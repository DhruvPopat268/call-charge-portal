
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UserDashboardLayout = () => {
  const { currentUser, isUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isUser) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
