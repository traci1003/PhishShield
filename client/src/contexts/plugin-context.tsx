import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IPlugin } from '../lib/plugins/plugin-interface';
import { pluginManager } from '../lib/plugins/plugin-manager';

interface PluginContextType {
  plugins: IPlugin[];
  smsPlugins: IPlugin[];
  emailPlugins: IPlugin[];
  socialPlugins: IPlugin[];
  isLoading: boolean;
  refreshPlugins: () => Promise<void>;
  getPluginById: (id: string) => IPlugin | undefined;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

interface PluginProviderProps {
  children: ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all plugins from plugin manager
  const plugins = pluginManager.getPlugins();
  
  // Filter plugins by type
  const smsPlugins = plugins.filter((p: IPlugin) => p.type === 'sms');
  const emailPlugins = plugins.filter((p: IPlugin) => p.type === 'email');
  const socialPlugins = plugins.filter((p: IPlugin) => p.type === 'social');
  
  // Get a plugin by ID
  const getPluginById = (id: string) => pluginManager.getPlugin(id);

  // Refresh all plugin statuses
  const refreshPlugins = async () => {
    setIsLoading(true);
    try {
      await pluginManager.refreshPluginStatus();
    } catch (error) {
      console.error('Error refreshing plugins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check plugin status when loaded or refreshed
  useEffect(() => {
    refreshPlugins();
  }, [refreshTrigger]);

  // Refresh manually
  const triggerRefresh = async () => {
    await refreshPlugins();
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    plugins,
    smsPlugins,
    emailPlugins,
    socialPlugins,
    isLoading,
    refreshPlugins: triggerRefresh,
    getPluginById,
  };

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  );
};