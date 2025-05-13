
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Example Corp',
    role: 'Developer'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    apiUsage: true,
    billing: true,
    marketing: false
  });
  
  const [security, setSecurity] = useState({
    twoFactor: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked
    });
  };

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setSecurity({
      ...security,
      [name]: checked
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would validate and update the password
    toast.success('Password changed successfully!');
    e.target.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profile Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Change Password
                </button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    name="email"
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Usage Alerts</p>
                  <p className="text-sm text-muted-foreground">Get alerts when nearing limits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    name="apiUsage"
                    checked={notifications.apiUsage}
                    onChange={handleNotificationChange}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Billing Notifications</p>
                  <p className="text-sm text-muted-foreground">Invoices and payment reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    name="billing"
                    checked={notifications.billing}
                    onChange={handleNotificationChange}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-sm text-muted-foreground">Receive product updates and news</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    name="marketing"
                    checked={notifications.marketing}
                    onChange={handleNotificationChange}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    name="twoFactor"
                    checked={security.twoFactor}
                    onChange={handleSecurityChange}
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              {security.twoFactor && (
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  <p>Two-factor authentication would be set up here</p>
                </div>
              )}
              <div className="pt-4 border-t border-border">
                <button
                  className="w-full px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10"
                  onClick={() => toast.info('Account deletion flow would start here')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
