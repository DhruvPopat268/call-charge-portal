
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboardLayout = () => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/user/dashboard" />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
