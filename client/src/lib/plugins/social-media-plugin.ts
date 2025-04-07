import { PluginMessage } from "@shared/schema";
import { BasePlugin } from "./base-plugin";

// Interface for manual Social Media configuration
export interface SocialMediaConfig {
  platform: string;
  username?: string;
  manualMode: boolean;
}

/**
 * Social Media Plugin implementation 
 * Handles protection for various social media platforms (Facebook, Twitter, Instagram, etc.)
 */
export class SocialMediaPlugin extends BasePlugin {
  id = "social-media";
  name = "Social Media Protection";
  type = "social" as const;
  description = "Detects and blocks phishing attempts in social media messages";
  icon = "message-circle"; // Lucide icon name
  config: SocialMediaConfig = {
    platform: 'facebook',
    manualMode: true
  };
  
  /**
   * Configure the Social Media plugin with manual settings
   */
  async configureManually(config: SocialMediaConfig): Promise<boolean> {
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
        this.status.connected = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error configuring Social Media plugin:', error);
      return false;
    }
  }
  
  /**
   * Authenticate with the social media platform
   * Used when not in manual mode
   */
  async authenticate(): Promise<boolean> {
    // If in manual mode, skip OAuth flow
    if (this.config.manualMode) {
      return this.status.connected;
    }

    if (this.status.authUrl) {
      // In a real app, this would open the OAuth URL in a new window
      window.open(this.status.authUrl, '_blank');
      return true;
    }
    return false;
  }
  
  /**
   * Check if the plugin can be used
   */
  canUse(): boolean {
    return this.status.connected || 
           (this.config.manualMode && !!this.config.platform);
  }
  
  /**
   * Get message display component for social media messages
   */
  getMessageComponent(message: PluginMessage): JSX.Element {
    // In a real implementation, this would return a React component
    // For now, we're returning a dummy element (would be replaced with proper component)
    return {} as JSX.Element;
  }
  
  /**
   * Simulate scanning a social media message for threats
   */
  async scanMessage(message: string, sender?: string): Promise<any> {
    try {
      // If not connected or configured, return an error
      if (!this.canUse()) {
        return { error: 'Social Media plugin not configured' };
      }
      
      // In a real implementation, this would call the server to scan the message
      const response = await fetch('/api/scan/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: message,
          sender: sender || 'Unknown User',
          source: 'social'
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      return { error: 'Failed to scan message' };
    } catch (error) {
      console.error('Error scanning social media message:', error);
      return { error: 'Error scanning message' };
    }
  }
  
  /**
   * Fetch messages from configured social media platform
   */
  async fetchMessages(limit: number = 20): Promise<PluginMessage[]> {
    try {
      if (!this.status.enabled) {
        return [];
      }
      
      // In a real implementation, this would call the API to get messages
      // For now, we'll return simulated messages based on the platform
      return this.getSimulatedMessages(limit);
    } catch (error) {
      console.error(`Error fetching messages for social media plugin:`, error);
      return [];
    }
  }
  
  /**
   * Generate simulated messages for testing
   */
  private getSimulatedMessages(limit: number = 20): PluginMessage[] {
    if (!this.config.platform) {
      return [];
    }
    
    const platform = this.config.platform;
    
    // Sample messages based on the platform
    const sampleMessages: PluginMessage[] = [
      {
        externalId: "sample1",
        content: `Hey, check out this cool giveaway! Click this link to claim your prize: https://bit.ly/3fakelink`,
        sender: {
          id: "user123",
          name: "Friend1",
          handle: `@friend1_${platform}`
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        metadata: {
          platform
        },
        urls: ["https://bit.ly/3fakelink"]
      },
      {
        externalId: "sample2",
        content: `Important message from ${platform} support: We've noticed suspicious activity on your account. Please verify your details here: http://secure-${platform}.verify-now.com`,
        sender: {
          id: "user456",
          name: `${platform}Support`,
          handle: `@${platform}_support`
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        metadata: {
          platform,
          verified: true
        },
        urls: [`http://secure-${platform}.verify-now.com`]
      },
      {
        externalId: "sample3",
        content: `Did you see the news about what happened to that celebrity? 😲 Check it out: https://breaking-news.co/celebrity-scandal`,
        sender: {
          id: "user789",
          name: "NewsUpdates",
          handle: "@LatestNews"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        metadata: {
          platform
        },
        urls: ["https://breaking-news.co/celebrity-scandal"]
      }
    ];
    
    return sampleMessages.slice(0, limit);
  }
}

// Export a singleton instance
export const socialMediaPlugin = new SocialMediaPlugin();