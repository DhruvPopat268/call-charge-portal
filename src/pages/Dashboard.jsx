
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const stats = [
    {
      title: 'Total API Calls',
      value: '25,342',
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Active APIs',
      value: currentUser.role === 'admin' ? '24' : '3',
      change: '+2',
      positive: true
    },
    {
      title: 'API Response Time',
      value: '245ms',
      change: '-12ms',
      positive: true
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      change: '+0.2%',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your API performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <div className="flex items-baseline mt-2 space-x-2">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent API Activity</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${i % 4 === 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="font-medium">Weather API</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {i % 4 === 0 ? 'Failed' : 'Success'} • {i + 1}m ago
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">API Usage By Endpoint</h3>
          <div className="space-y-4">
            {['GET /weather', 'POST /users', 'GET /products', 'GET /analytics'].map((endpoint, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{endpoint}</span>
                  <span className="text-sm text-muted-foreground">{90 - (i * 20)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${90 - (i * 20)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
