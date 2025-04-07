import { WebClient } from "@slack/web-api";
import { storage } from "../storage";
import { PluginMessage } from "@shared/schema";

interface SlackManualConfig {
  workspaceName: string;
  channelName: string;
  botToken?: string;
  channelId?: string;
  manualMode: boolean;
}

/**
 * SlackService handles communication with the Slack API
 */
export class SlackService {
  private client?: WebClient;
  private botToken?: string;
  private channelId?: string;
  private manualConfig?: SlackManualConfig;
  private manualMode: boolean = false;
  
  constructor() {
    // Try to get Slack credentials from environment
    this.botToken = process.env.SLACK_BOT_TOKEN;
    this.channelId = process.env.SLACK_CHANNEL_ID;
    
    // Initialize Slack client if credentials are available
    if (this.botToken) {
      this.client = new WebClient(this.botToken);
    }
  }
  
  /**
   * Configure Slack service with manual settings
   * This allows for a no-API-key approach where users configure via the UI
   */
  configureManually(config: SlackManualConfig): boolean {
    this.manualConfig = config;
    this.manualMode = config.manualMode;
    
    // If botToken is provided in the manual config, use it
    if (config.botToken) {
      this.botToken = config.botToken;
      this.client = new WebClient(this.botToken);
    }
    
    // If channelId is provided in the manual config, use it
    if (config.channelId) {
      this.channelId = config.channelId;
    }
    
    return true;
  }
  
  /**
   * Check if Slack integration is available
   */
  isAvailable(): boolean {
    // In manual mode, we consider it available if manual config exists
    if (this.manualMode && this.manualConfig) {
      return true;
    }
    
    // Otherwise, check for proper API credentials
    return !!this.client && !!this.botToken && !!this.channelId;
  }
  
  /**
   * Generate Slack OAuth URL
   */
  generateAuthUrl(): string {
    // In a real implementation, this would be a proper OAuth flow with appropriate scopes
    // For now, just return a placeholder URL since we're using environment variables
    return "https://slack.com/oauth/v2/authorize?client_id=[YOUR_CLIENT_ID]&scope=channels:history,channels:read,chat:write&user_scope=";
  }
  
  /**
   * Fetch messages from Slack channel
   */
  async fetchMessages(limit: number = 20): Promise<PluginMessage[]> {
    // If in manual mode with no API access, return simulated messages
    if (this.manualMode && this.manualConfig && (!this.client || !this.channelId)) {
      return this.getSimulatedMessages(limit);
    }
    
    // Otherwise, proceed with normal API call if available
    if (!this.isAvailable() || !this.client || !this.channelId) {
      throw new Error("Slack integration not configured");
    }
    
    try {
      // Fetch messages from Slack API
      const response = await this.client.conversations.history({
        channel: this.channelId,
        limit
      });
      
      if (!response.ok || !response.messages) {
        throw new Error("Failed to fetch messages from Slack");
      }
      
      // Map Slack messages to our PluginMessage format
      return response.messages.map(message => {
        // Get user name from user ID if available
        const userName = message.user || "Unknown";
        
        return {
          externalId: message.ts || "",
          content: message.text || "",
          sender: {
            id: message.user || "",
            name: userName 
          },
          timestamp: new Date((Number(message.ts || "0") * 1000)).toISOString(),
          metadata: {
            channel: this.channelId,
            threadTs: message.thread_ts,
            reactions: message.reactions,
            files: message.files,
          },
          urls: this.extractUrls(message.text || ""),
        };
      });
    } catch (error) {
      console.error("Error fetching Slack messages:", error);
      throw error;
    }
  }
  
  /**
   * Send message to Slack channel
   */
  async sendMessage(text: string): Promise<boolean> {
    // If in manual mode with no API access, just log and return success
    if (this.manualMode && this.manualConfig && (!this.client || !this.channelId)) {
      console.log(`[Manual Slack Mode] Would send to ${this.manualConfig.channelName}: ${text}`);
      return true;
    }
    
    // Otherwise, proceed with normal API call if available
    if (!this.isAvailable() || !this.client || !this.channelId) {
      throw new Error("Slack integration not configured");
    }
    
    try {
      const response = await this.client.chat.postMessage({
        channel: this.channelId,
        text
      });
      
      return response.ok || false;
    } catch (error) {
      console.error("Error sending message to Slack:", error);
      return false;
    }
  }
  
  /**
   * Generate simulated messages for manual mode when API is not available
   */
  private getSimulatedMessages(limit: number = 20): PluginMessage[] {
    if (!this.manualConfig) {
      return [];
    }
    
    const channelName = this.manualConfig.channelName;
    const workspaceName = this.manualConfig.workspaceName;
    
    // Create sample messages for the configured workspace/channel
    const sampleMessages: PluginMessage[] = [
      {
        externalId: "sample1",
        content: `Check out this link everyone! https://bit.ly/3fakelink`,
        sender: {
          id: "U12345",
          name: "coworker1"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        metadata: {
          channel: channelName
        },
        urls: ["https://bit.ly/3fakelink"]
      },
      {
        externalId: "sample2",
        content: `Hey team, I found this cool resource: http://googl.download/resource`,
        sender: {
          id: "U23456",
          name: "teammate2"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        metadata: {
          channel: channelName
        },
        urls: ["http://googl.download/resource"]
      },
      {
        externalId: "sample3",
        content: `We need everyone to verify their account details ASAP here: https://verification-system.net/accounts`,
        sender: {
          id: "U34567",
          name: "manager"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        metadata: {
          channel: channelName
        },
        urls: ["https://verification-system.net/accounts"]
      }
    ];
    
    return sampleMessages.slice(0, limit);
  }
  
  /**
   * Extract URLs from text content
   */
  private extractUrls(text: string): string[] {
    if (!text) return [];
    
    // Basic URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    return matches || [];
  }
}

// Export a singleton instance
export const slackService = new SlackService();