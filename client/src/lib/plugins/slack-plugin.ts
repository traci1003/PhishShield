import { PluginMessage } from "@shared/schema";
import { BasePlugin } from "./base-plugin";

// Interface for manual Slack configuration
export interface SlackConfig {
  workspaceName: string;
  channelName: string;
  botToken?: string;
  channelId?: string;
  manualMode: boolean;
}

/**
 * Slack Plugin implementation with support for manual configuration
 */
export class SlackPlugin extends BasePlugin {
  id = "slack";
  name = "Slack Protection";
  type = "social" as const;
  description = "Detects and blocks phishing attempts in Slack messages";
  icon = "slack"; // Lucide icon name
  config: SlackConfig = {
    workspaceName: '',
    channelName: '',
    manualMode: true
  };
  
  /**
   * Configure the Slack plugin with manual settings
   * This allows for a no-API-key approach where users configure via the UI
   */
  async configureManually(config: SlackConfig): Promise<boolean> {
    try {
      // In a real implementation, this would save the config to the server
      const response = await fetch(`/api/plugins/${this.id}/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        this.config = config;
        // Update the connection status
        this.status.isConnected = true;
        this.status.lastConnected = new Date().toISOString();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error configuring Slack plugin:', error);
      return false;
    }
  }
  
  /**
   * Request OAuth authentication for Slack
   * Used when not in manual mode
   */
  async authenticate(): Promise<boolean> {
    // If in manual mode, skip OAuth flow
    if (this.config.manualMode) {
      return this.status.isConnected;
    }

    if (this.status.authUrl) {
      // In a real app, this would open the OAuth URL in a new window
      window.open(this.status.authUrl, '_blank');
      return true;
    }
    return false;
  }
  
  /**
   * Check if the plugin can be used (either manual config or OAuth)
   */
  canUse(): boolean {
    return this.status.isConnected || 
           (this.config.manualMode && !!this.config.workspaceName && !!this.config.channelName);
  }
  
  /**
   * Get message display component for Slack messages
   */
  getMessageComponent(message: PluginMessage): JSX.Element {
    // In a real implementation, this would return a React component
    // For now, we're returning a dummy element (would be replaced with proper component)
    return {} as JSX.Element;
  }
  
  /**
   * Simulate scanning a Slack message for threats
   */
  async scanMessage(message: string, sender?: string): Promise<any> {
    try {
      // If not connected or configured, return an error
      if (!this.canUse()) {
        return { error: 'Slack plugin not configured' };
      }
      
      // In a real implementation, this would call the server to scan the message
      const response = await fetch('/api/scan/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          sender: sender || 'Unknown Slack User',
          source: 'slack'
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      return { error: 'Failed to scan message' };
    } catch (error) {
      console.error('Error scanning Slack message:', error);
      return { error: 'Error scanning message' };
    }
  }
}

// Export a singleton instance
export const slackPlugin = new SlackPlugin();