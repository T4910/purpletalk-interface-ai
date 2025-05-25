
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  KeyIcon,
} from "lucide-react";

interface UserSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSettings({ open, onOpenChange }: UserSettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="flex h-[500px]">
          <TabsList className="flex flex-col h-full w-48 p-2 space-y-1">
            <TabsTrigger 
              value="profile" 
              className="w-full justify-start data-[state=active]:bg-accent"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="w-full justify-start data-[state=active]:bg-accent"
            >
              <BellIcon className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="w-full justify-start data-[state=active]:bg-accent"
            >
              <ShieldIcon className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="w-full justify-start data-[state=active]:bg-accent"
            >
              <PaletteIcon className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="w-full justify-start data-[state=active]:bg-accent"
            >
              <KeyIcon className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <Separator orientation="vertical" className="mx-4" />
          
          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="profile" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about property updates
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAlerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get email notifications for important updates
                      </p>
                    </div>
                    <Switch
                      id="emailAlerts"
                      checked={emailAlerts}
                      onCheckedChange={setEmailAlerts}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6 m-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile information
                      </p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Export</Label>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your data
                      </p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
