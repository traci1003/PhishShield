import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { usePlugins } from '@/contexts/plugin-context';
import { IPlugin } from '@/lib/plugins/plugin-interface';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Plug,
  PlugZap,
  RefreshCw,
  Settings,
  X,
  MessageSquare,
  Mail,
  Smartphone
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PluginSettings() {
  const { plugins, refreshPlugins, isLoading } = usePlugins();
  const { toast } = useToast();
  const [configurePluginId, setConfigurePluginId] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});

  // Mutation to configure a plugin
  const configureMutation = useMutation({
    mutationFn: async ({ pluginId, config }: { pluginId: string, config: Record<string, string> }) => {
      const response = await apiRequest('POST', `/api/plugins/${pluginId}/configure`, config);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plugins'] });
      refreshPlugins();
      setConfigDialogOpen(false);
      toast({
        title: "Plugin configured",
        description: "The plugin has been successfully configured.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to configure the plugin.",
      });
    }
  });

  // Handle toggling plugin enabled state
  const handleTogglePlugin = async (plugin: IPlugin) => {
    try {
      if (plugin.status.enabled) {
        await plugin.disable();
      } else {
        await plugin.enable();
      }
      await refreshPlugins();
      toast({
        title: plugin.status.enabled ? "Plugin enabled" : "Plugin disabled",
        description: `The ${plugin.name} has been ${plugin.status.enabled ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${plugin.status.enabled ? "disable" : "enable"} the plugin.`,
      });
    }
  };

  // Handle opening configuration dialog
  const handleConfigurePlugin = (pluginId: string) => {
    setConfigurePluginId(pluginId);
    setConfigValues({}); // Reset config values
    setConfigDialogOpen(true);
  };

  // Handle submitting plugin configuration
  const handleSubmitConfig = () => {
    if (configurePluginId) {
      configureMutation.mutate({
        pluginId: configurePluginId,
        config: configValues
      });
    }
  };

  // Get plugin icon based on type
  const getPluginIcon = (type: string) => {
    switch (type) {
      case 'slack':
        return <MessageSquare className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Plug className="h-5 w-5" />;
    }
  };

  // Get configuration fields for plugin
  const getConfigFields = (pluginId: string) => {
    switch (pluginId) {
      case 'slack':
        return [
          { id: 'teamName', label: 'Team Name', placeholder: 'Your Slack Team Name' },
          { id: 'channelName', label: 'Channel Name', placeholder: 'The channel to monitor' }
        ];
      case 'email':
        return [
          { id: 'emailAddress', label: 'Email Address', placeholder: 'Your email address' }
        ];
      case 'sms':
        return [
          { id: 'phoneNumber', label: 'Phone Number', placeholder: '+1234567890' }
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Connected Plugins</h3>
        <Button variant="outline" size="sm" onClick={refreshPlugins}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {plugins.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-dashed">
          <PlugZap className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No plugins found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No protection plugins have been installed or configured.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="p-4 rounded-lg border flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  {getPluginIcon(plugin.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium capitalize">{plugin.name}</h4>
                    <Badge variant={plugin.status.connected ? "default" : "outline"} className="text-xs">
                      {plugin.status.connected ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      {plugin.status.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plugin.status.connected 
                      ? `Protection ${plugin.status.enabled ? 'active' : 'inactive'} for ${plugin.type} messages.`
                      : `Configure this plugin to enable protection for ${plugin.type} messages.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleConfigurePlugin(plugin.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Switch 
                  checked={plugin.status.enabled}
                  onCheckedChange={() => handleTogglePlugin(plugin)}
                  disabled={!plugin.status.connected}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {configurePluginId?.charAt(0).toUpperCase()}{configurePluginId?.slice(1)} Plugin</DialogTitle>
            <DialogDescription>
              Enter the required information to connect to your {configurePluginId} account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {configurePluginId && getConfigFields(configurePluginId).map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input 
                  id={field.id}
                  placeholder={field.placeholder}
                  value={configValues[field.id] || ''}
                  onChange={(e) => setConfigValues({
                    ...configValues,
                    [field.id]: e.target.value
                  })}
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}