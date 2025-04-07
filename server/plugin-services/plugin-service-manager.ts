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
      },
      ["social-media"]: {
        available: true, // Social media plugin is always available
        enabled: false,
        connected: false,
        requiresAuth: false, // Uses manual configuration
        authUrl: "",
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
      case "social-media":
        // For social media, generate demo messages based on configured platform
        if (pluginConnection.authData && (pluginConnection.authData as any).manualConfig) {
          const config = (pluginConnection.authData as any).manualConfig;
          return this.generateSocialMediaMessages(config.platform, limit);
        }
        return [];
      default:
        return [];
    }
  }
  
  /**
   * Generate sample social media messages for demonstration
   */
  private generateSocialMediaMessages(platform: string, limit: number): PluginMessage[] {
    const messages: PluginMessage[] = [
      {
        externalId: "social1",
        content: `Hey, check out this cool giveaway! Click this link to claim your prize: https://bit.ly/3fakelink`,
        sender: {
          id: "user123",
          name: "Friend1",
          handle: `@friend1_${platform}`
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        metadata: {
          platform
        },
        urls: ["https://bit.ly/3fakelink"]
      },
      {
        externalId: "social2",
        content: `Important message from ${platform} support: We've noticed suspicious activity on your account. Please verify your details here: http://secure-${platform}.verify-now.com`,
        sender: {
          id: "user456",
          name: `${platform}Support`,
          handle: `@${platform}_support`
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        metadata: {
          platform,
          verified: true
        },
        urls: [`http://secure-${platform}.verify-now.com`]
      },
      {
        externalId: "social3",
        content: `Did you see the news about what happened to that celebrity? 😲 Check it out: https://breaking-news.co/celebrity-scandal`,
        sender: {
          id: "user789",
          name: "NewsUpdates",
          handle: "@LatestNews"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        metadata: {
          platform
        },
        urls: ["https://breaking-news.co/celebrity-scandal"]
      }
    ];
    
    return messages.slice(0, limit);
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
      case "social-media":
        return true; // Social media plugin doesn't need specific monitoring
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
      case "social-media":
        return true; // Social media plugin doesn't need specific monitoring
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
      case "social-media":
        return "social";
      default:
        return "unknown";
    }
  }
  
  /**
   * Configure the social media plugin
   */
  async configureSocialMediaPlugin(userId: number, platform: string, username?: string): Promise<boolean> {
    // Build configuration object
    const config = {
      platform,
      username,
      manualMode: true
    };
    
    // Use the generic plugin configuration method
    return this.configurePlugin(userId, "social-media", config);
  }
}

// Export a singleton instance
export const pluginServiceManager = new PluginServiceManager();