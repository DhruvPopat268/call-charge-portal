
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const stats = [
    {
      title: 'Total API Calls',
      value: '5,245',
      change: '+8.2%',
      positive: true
    },
    {
      title: 'Active APIs',
      value: '3',
      change: '+1',
      positive: true
    },
    {
      title: 'API Response Time',
      value: '218ms',
      change: '-8ms',
      positive: true
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      change: '+0.1%',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your API usage
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
          <h3 className="font-semibold mb-4">Purchased APIs</h3>
          <div className="space-y-4">
            {['Weather API', 'Currency API', 'Stock API'].map((api, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{api}</span>
                  <span className="text-sm text-muted-foreground">{90 - (i * 20)}% utilized</span>
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
          <div className="mt-4 pt-4 border-t border-border">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Browse More APIs
            </button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-md">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>
          </div>
          
          <button className="inline-flex items-center text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Payment Method
          </button>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;
