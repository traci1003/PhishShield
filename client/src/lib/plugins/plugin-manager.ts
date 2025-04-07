import { IPlugin, IPluginManager } from "./plugin-interface";
import { smsPlugin } from "./sms-plugin";
import { emailPlugin } from "./email-plugin";
import { slackPlugin } from "./slack-plugin";
import { socialMediaPlugin } from "./social-media-plugin";

/**
 * Plugin Manager for handling all plugin operations
 */
export class PluginManager implements IPluginManager {
  private plugins: IPlugin[] = [];
  private isLoading: boolean = false;

  constructor() {
    // Register all plugins
    this.registerPlugin(smsPlugin);
    this.registerPlugin(emailPlugin);
    this.registerPlugin(slackPlugin);
    this.registerPlugin(socialMediaPlugin);
  }

  /**
   * Register a plugin with the manager
   */
  private registerPlugin(plugin: IPlugin): void {
    this.plugins.push(plugin);
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): IPlugin[] {
    return this.plugins;
  }

  /**
   * Get a specific plugin by ID
   */
  getPlugin(id: string): IPlugin | undefined {
    return this.plugins.find(plugin => plugin.id === id);
  }

  /**
   * Refresh all plugin statuses
   */
  async refreshPluginStatus(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch('/api/plugins');
      const data = await response.json();
      
      // Update plugin statuses
      for (const plugin of this.plugins) {
        if (data.plugins && data.plugins[plugin.id]) {
          plugin.status = data.plugins[plugin.id];
        }
      }
    } catch (error) {
      console.error('Error refreshing plugin status:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Check if plugins are currently loading
   */
  arePluginsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Scan a message with all enabled plugins
   */
  async scanMessage(message: any): Promise<any> {
    const enabledPlugins = this.plugins.filter(p => p.status.enabled);
    const results = [];
    
    for (const plugin of enabledPlugins) {
      try {
        // This would implement the actual scanning logic
        // For now, it's just a placeholder
        results.push({
          pluginId: plugin.id,
          result: { safe: true }
        });
      } catch (error) {
        console.error(`Error scanning with plugin ${plugin.id}:`, error);
      }
    }
    
    return results;
  }
}

// Singleton instance
export const pluginManager = new PluginManager();