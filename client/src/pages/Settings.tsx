import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AccessibilityIcon, Bell, Plug } from 'lucide-react';
import ProtectionSettings from '@/components/settings/protection-settings';
import AccessibilitySettings from '@/components/accessibility/accessibility-settings';
import NotificationSettings from '@/components/settings/notification-settings';
import PluginSettings from '@/components/settings/plugin-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Customize your PhishShield AI experience</p>
      </div>

      <Tabs defaultValue="protection" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Protection</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <AccessibilityIcon className="h-4 w-4" />
            <span>Accessibility</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="plugins" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <span>Plugins</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="protection">
          <ProtectionSettings />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Plugin Settings</CardTitle>
              <CardDescription>
                Configure plugin connections and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PluginSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}