import { PluginMessage, PluginStatus, PLUGIN_TYPES } from "@shared/schema";
import { emailService } from "./email-service";
import { slackService } from "./slack-service";
import { smsService } from "./sms-service";
import { storage } from "../storage";

/**
 * PluginServiceManager manages all plugin services and provides a unified interface
 */
export class PluginServiceManager {
  /**
   * Get all available plugin services and their status
   */
  async getPluginStatus(userId: number): Promise<Record<string, PluginStatus>> {
    // Get user plugin connections from storage
    const userPlugins = await storage.getPluginConnectionsByUser(userId);
    
    // Create a status map for all plugin types
    const statusMap: Record<string, PluginStatus> = {
      [PLUGIN_TYPES.EMAIL]: {
        available: emailService.isAvailable(),
        enabled: false,
        connected: false,
        requiresAuth: true,
        authUrl: emailService.generateAuthUrl(),
        userId
      },
      [PLUGIN_TYPES.SMS]: {
        available: smsService.isAvailable(),
        enabled: false,
        connected: smsService.isAvailable(), // SMS is considered connected if available (on mobile)
        requiresAuth: false,
        authUrl: "",
        userId
      },
      [PLUGIN_TYPES.SLACK]: {
        available: slackService.isAvailable(),
        enabled: false,
        connected: slackService.isAvailable(),
        requiresAuth: true,
        authUrl: slackService.generateAuthUrl(),
        userId
      }
    };
    
    // Update status based on user's connections
    userPlugins.forEach(plugin => {
      if (statusMap[plugin.pluginId]) {
        statusMap[plugin.pluginId].connected = true;
        statusMap[plugin.pluginId].enabled = plugin.isEnabled;
      }
    });
    
    return statusMap;
  }
  
  /**
   * Fetch messages from a specific plugin
   */
  async fetchPluginMessages(userId: number, pluginId: string, limit: number = 20): Promise<PluginMessage[]> {
    // Check if the user has this plugin enabled
    const pluginConnection = await storage.getPluginConnection(userId, pluginId);
    
    if (!pluginConnection || !pluginConnection.isEnabled) {
      return [];
    }
    
    // Fetch messages based on plugin type
    switch (pluginId) {
      case PLUGIN_TYPES.EMAIL:
        return emailService.fetchMessages(limit);
      case PLUGIN_TYPES.SMS:
        return smsService.fetchMessages(limit);
      case PLUGIN_TYPES.SLACK:
        return slackService.fetchMessages(limit);
      default:
        return [];
    }
  }
  
  /**
   * Enable a plugin for a user
   */
  async enablePlugin(userId: number, pluginId: string): Promise<boolean> {
    // Get the plugin connection
    let pluginConnection = await storage.getPluginConnection(userId, pluginId);
    
    // Create connection if it doesn't exist
    if (!pluginConnection) {
      pluginConnection = await storage.createPluginConnection({
        userId,
        pluginId,
        type: this.getPluginType(pluginId),
        isEnabled: true,
        isConnected: true,
        isProtectionEnabled: true,
        settings: {},
        authData: {}
      });
    } else {
      // Update existing connection
      pluginConnection = await storage.updatePluginConnection(userId, pluginId, {
        isEnabled: true,
        isProtectionEnabled: true
      });
    }
    
    // Enable monitoring based on plugin type
    switch (pluginId) {
      case PLUGIN_TYPES.EMAIL:
        return emailService.enableMonitoring();
      case PLUGIN_TYPES.SMS:
        return smsService.enableMonitoring();
      case PLUGIN_TYPES.SLACK:
        return true; // Slack doesn't need specific monitoring
      default:
        return false;
    }
  }
  
  /**
   * Disable a plugin for a user
   */
  async disablePlugin(userId: number, pluginId: string): Promise<boolean> {
    // Get the plugin connection
    const pluginConnection = await storage.getPluginConnection(userId, pluginId);
    
    if (!pluginConnection) {
      return false;
    }
    
    // Update connection to disabled
    await storage.updatePluginConnection(userId, pluginId, {
      isEnabled: false,
      isProtectionEnabled: false
    });
    
    // Disable monitoring based on plugin type
    switch (pluginId) {
      case PLUGIN_TYPES.EMAIL:
        return emailService.disableMonitoring();
      case PLUGIN_TYPES.SMS:
        return smsService.disableMonitoring();
      case PLUGIN_TYPES.SLACK:
        return true; // Slack doesn't need specific monitoring
      default:
        return false;
    }
  }
  
  /**
   * Set authentication tokens for a plugin
   */
  async setPluginAuth(userId: number, pluginId: string, authData: any): Promise<boolean> {
    // Get or create the plugin connection
    let pluginConnection = await storage.getPluginConnection(userId, pluginId);
    
    if (!pluginConnection) {
      pluginConnection = await storage.createPluginConnection({
        userId,
        pluginId,
        type: this.getPluginType(pluginId),
        isEnabled: true,
        isConnected: true,
        isProtectionEnabled: true,
        authData: authData,
        settings: {}
      });
    } else {
      // Update existing connection with auth data
      // Ensure authData is treated as a new object to avoid spread operator issues
      pluginConnection = await storage.updatePluginConnection(userId, pluginId, {
        authData: { ...authData }
      });
    }
    
    // Set auth based on plugin type
    switch (pluginId) {
      case PLUGIN_TYPES.EMAIL:
        if (authData.tokens) {
          emailService.setAuthTokens(authData.tokens);
          return true;
        }
        return false;
      case PLUGIN_TYPES.SLACK:
        if (authData.manualConfig) {
          // Configure Slack with manual configuration
          return slackService.configureManually(authData.manualConfig);
        }
        return true;
      default:
        return true;
    }
  }
  
  /**
   * Configure a plugin with manual settings
   */
  async configurePlugin(userId: number, pluginId: string, configData: any): Promise<boolean> {
    // Get or create the plugin connection
    let pluginConnection = await storage.getPluginConnection(userId, pluginId);
    
    if (!pluginConnection) {
      pluginConnection = await storage.createPluginConnection({
        userId,
        pluginId,
        type: this.getPluginType(pluginId),
        isEnabled: true,
        isConnected: true,
        isProtectionEnabled: true,
        authData: { manualConfig: configData },
        settings: {}
      });
    } else {
      // Update existing connection with configuration data
      // Create a new object for auth data to avoid spread operator issues
      const updatedAuthData = {
        manualConfig: configData
      };
        
      pluginConnection = await storage.updatePluginConnection(userId, pluginId, {
        isConnected: true,
        isEnabled: true,
        authData: updatedAuthData
      });
    }
    
    // Configure based on plugin type
    switch (pluginId) {
      case PLUGIN_TYPES.SLACK:
        // Check if it's a manual configuration for Slack
        if (configData.manualMode) {
          return slackService.configureManually(configData);
        }
        return true;
      default:
        return true;
    }
  }
  
  /**
   * Get the plugin type from the plugin ID
   */
  private getPluginType(pluginId: string): string {
    switch (pluginId) {
      case PLUGIN_TYPES.EMAIL:
        return "email";
      case PLUGIN_TYPES.SMS:
        return "sms";
      case PLUGIN_TYPES.SLACK:
        return "social";
      default:
        return "unknown";
    }
  }
}

// Export a singleton instance
export const pluginServiceManager = new PluginServiceManager();