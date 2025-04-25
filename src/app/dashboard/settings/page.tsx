"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

interface AppSettings {
  appName: string;
  apiUrl: string;
  maxFileSize: number;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  autoSaveInterval: number;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'Admin Panel',
    apiUrl: 'https://api.adminpanel.com',
    maxFileSize: 10,
    notificationsEnabled: true,
    darkModeEnabled: false,
    autoSaveInterval: 5
  });

  // Set mounted state untuk menandakan kode berjalan di client-side
  useEffect(() => {
    setMounted(true);
    // Set darkModeEnabled sesuai dengan tema saat halaman dimuat
    setSettings(prev => ({
      ...prev,
      darkModeEnabled: theme === 'dark'
    }));
  }, [theme]);

  // Update darkModeEnabled berdasarkan theme aktual
  useEffect(() => {
    if (mounted) {
      setSettings(prev => ({
        ...prev,
        darkModeEnabled: theme === 'dark'
      }));
    }
  }, [theme, mounted]);

  // Simpan perubahan settings
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Simulasi API request dengan timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Di sini nantinya akan memanggil API untuk menyimpan pengaturan
      // const response = await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify(settings)
      // });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler untuk perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // Handler untuk perubahan switch
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === 'darkModeEnabled') {
      // Ubah tema aplikasi saat darkModeEnabled berubah
      setTheme(checked ? 'dark' : 'light');
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Jika belum mounted (masih server-side rendering), tampilkan skeleton atau loading
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse"></div>
        <div className="h-64 bg-neutral-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="dark:bg-neutral-900 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input 
                    id="appName" 
                    name="appName"
                    value={settings.appName} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <Input 
                    id="apiUrl" 
                    name="apiUrl"
                    value={settings.apiUrl} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="dark:bg-neutral-900 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the admin panel
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkModeEnabled}
                  onCheckedChange={(checked) => 
                    handleSwitchChange('darkModeEnabled', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="dark:bg-neutral-900 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important events
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    handleSwitchChange('notificationsEnabled', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
} 