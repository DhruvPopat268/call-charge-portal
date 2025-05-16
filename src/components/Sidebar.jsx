
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';


import { 
  Package,
  FileText,
  Key,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Activity,
} from 'lucide-react';

const Sidebar = () => {
  // const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  let role = localStorage.getItem('role')
  let name = localStorage.getItem('name')

  const menuItems = [
    {
      title: 'APIs',
      icon: <Package size={20} />,
      path: '/admin/dashboard/apis',
      admin: false
    },
    {
      title: 'API Logs',
      icon: <FileText size={20} />,
      path: '/admin/dashboard/logs',
      admin: false
    },
    {
      title: 'API Keys',
      icon: <Key size={20} />,
      path: '/admin/dashboard/keys',
      admin: false
    },
    {
      title: 'Usage Stats',
      icon: <BarChart2 size={20} />,
      path: '/admin/dashboard/stats',
      admin: false
    },
    {
      title: 'Subscription',
      icon: <Activity size={20} />,
      path: '/admin/dashboard/subscription',
      admin: false
    },
    {
      title: 'Plans',
      icon: <Package size={20} />,
      path: '/admin/dashboard/plans',
      // admin: isAdmin
    },
    {
      title: 'Billing',
      icon: <CreditCard size={20} />,
      path: '/admin/dashboard/billing',
      admin: false
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/dashboard/settings',
      admin: false
    },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/admin/logout`, {}, { withCredentials: true });

    // Clear localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('adminId');
    localStorage.removeItem('name');

    // Navigate to login page
    navigate('/auth');
    toast.success("Logout Successfully")
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  return (
    <div 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <span className="font-bold text-lg text-white">AP</span>
            </div>
            <span className="font-bold text-xl">APIHub</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-lg text-white">AP</span>
          </div>
        )}
        <button 
          className="text-sidebar-foreground hover:bg-sidebar-accent p-1 rounded"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-6">
          {!collapsed ? (
            <div className="bg-sidebar-accent rounded-md p-3">
              <p className="text-xs opacity-70">Logged in as {role}</p>
              <p className="font-medium truncate">{name}</p> 
            </div>
          ) : (
            <div className="bg-sidebar-accent rounded-md p-2 flex justify-center">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium">{currentUser?.name?.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>

        <nav>
          {menuItems
            .filter(item => !item.admin || isAdmin)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 mb-1 mx-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <span className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")}>{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </Link>
            ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <LogOut size={20} className={collapsed ? "mx-auto" : "mr-3"} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
