import { PluginMessage } from "@shared/schema";
import { BasePlugin } from "./base-plugin";

/**
 * Email Plugin implementation
 */
export class EmailPlugin extends BasePlugin {
  id = "email";
  name = "Email Protection";
  type = "email" as const;
  description = "Detects and blocks phishing attempts in emails";
  icon = "mail"; // Lucide icon name
  
  /**
   * Get message display component for email messages
   */
  getMessageComponent(message: PluginMessage): JSX.Element {
    // In a real implementation, this would return a React component
    // For now, we're returning a dummy element (would be replaced with proper component)
    return {} as JSX.Element;
  }
}

// Export a singleton instance
export const emailPlugin = new EmailPlugin();