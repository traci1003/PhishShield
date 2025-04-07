import { PluginMessage, PluginStatus } from "@shared/schema";
import { IPlugin } from "./plugin-interface";
import { apiRequest } from "../queryClient";

/**
 * Base class for plugins with shared functionality
 */
export abstract class BasePlugin implements IPlugin {
  // Abstract properties to be implemented by derived classes
  abstract id: string;
  abstract name: string;
  abstract type: 'sms' | 'email' | 'social';
  abstract description: string;
  abstract icon: string;

  // Plugin state
  status: PluginStatus = {
    connected: false,
    enabled: false,
    available: false,
    requiresAuth: false,
    authUrl: ""
  };

  /**
   * Enable the plugin
   */
  async enable(): Promise<boolean> {
    try {
      const response = await apiRequest("POST", `/api/plugins/${this.id}/enable`);
      const data = await response.json();
      
      if (data.success) {
        this.status = data.plugins[this.id];
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error enabling plugin ${this.id}:`, error);
      return false;
    }
  }

  /**
   * Disable the plugin
   */
  async disable(): Promise<boolean> {
    try {
      const response = await apiRequest("POST", `/api/plugins/${this.id}/disable`);
      const data = await response.json();
      
      if (data.success) {
        this.status = data.plugins[this.id];
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error disabling plugin ${this.id}:`, error);
      return false;
    }
  }

  /**
   * Fetch messages from this plugin
   */
  async fetchMessages(limit: number = 20): Promise<PluginMessage[]> {
    try {
      if (!this.status.enabled) {
        return [];
      }
      
      const response = await apiRequest("GET", `/api/plugins/${this.id}/messages?limit=${limit}`);
      const messages = await response.json();
      
      return messages;
    } catch (error) {
      console.error(`Error fetching messages for plugin ${this.id}:`, error);
      return [];
    }
  }

  /**
   * Authenticate the plugin with provided credentials
   */
  async authenticate(authData: any): Promise<boolean> {
    try {
      const response = await apiRequest("POST", `/api/plugins/${this.id}/auth`, authData);
      const data = await response.json();
      
      if (data.success) {
        this.status = data.plugins[this.id];
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error authenticating plugin ${this.id}:`, error);
      return false;
    }
  }

  /**
   * Get the configuration component for this plugin
   * This should be overridden by derived classes to provide custom UI
   */
  getConfigComponent(): JSX.Element | null {
    return null;
  }

  /**
   * Get the message component for displaying messages from this plugin
   * This should be overridden by derived classes to provide custom UI
   */
  abstract getMessageComponent(message: PluginMessage): JSX.Element;
}