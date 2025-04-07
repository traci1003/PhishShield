import { PluginMessage, PluginStatus } from "@shared/schema";

/**
 * Interface for plugin operations in the client
 */
export interface IPlugin {
  // Plugin metadata
  id: string;
  name: string;
  type: 'sms' | 'email' | 'social';
  description: string;
  icon: string;
  
  // Plugin state
  status: PluginStatus;
  
  // Plugin operations
  enable(): Promise<boolean>;
  disable(): Promise<boolean>;
  fetchMessages(limit?: number): Promise<PluginMessage[]>;
  authenticate(authData: any): Promise<boolean>;
  
  // UI methods
  getConfigComponent(): JSX.Element | null;
  getMessageComponent(message: PluginMessage): JSX.Element;
}

/**
 * Interface for plugin manager
 */
export interface IPluginManager {
  // Plugin registry operations
  getPlugins(): IPlugin[];
  getPlugin(id: string): IPlugin | undefined;
  
  // Plugin status operations
  refreshPluginStatus(): Promise<void>;
  arePluginsLoading(): boolean;
  
  // Integration methods
  scanMessage(message: PluginMessage): Promise<any>;
}