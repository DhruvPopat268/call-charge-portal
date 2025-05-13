
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Sample API data
const sampleApis = [
  {
    id: 1,
    name: 'Weather API',
    description: 'Real-time global weather data with detailed forecasts and historical data.',
    endpoint: 'api.example.com/v1/weather',
    price: 2.00,
    calls: 1000, 
    status: 'active'
  },
  {
    id: 2,
    name: 'Stock Market API',
    description: 'Up-to-date stock market data with real-time quotes and historical trends.',
    endpoint: 'api.example.com/v1/stocks',
    price: 5.00,
    calls: 1000,
    status: 'active'
  },
  {
    id: 3,
    name: 'Currency Exchange API',
    description: 'Fast and reliable currency exchange rates for 170+ world currencies.',
    endpoint: 'api.example.com/v1/currency',
    price: 1.50,
    calls: 1000,
    status: 'active'
  },
  {
    id: 4,
    name: 'News API',
    description: 'Global news from 50,000+ sources with real-time updates and search.',
    endpoint: 'api.example.com/v1/news',
    price: 3.00,
    calls: 1000,
    status: 'active'
  },
];

const ApiList = () => {
  const { isAdmin } = useAuth();
  const [apis, setApis] = useState(sampleApis);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApi, setNewApi] = useState({
    name: '',
    description: '',
    endpoint: '',
    price: 0,
    calls: 1000,
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApi({
      ...newApi,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const handleAddApi = (e) => {
    e.preventDefault();
    
    const apiWithId = {
      ...newApi,
      id: apis.length + 1
    };
    
    setApis([...apis, apiWithId]);
    setShowAddForm(false);
    setNewApi({
      name: '',
      description: '',
      endpoint: '',
      price: 0,
      calls: 1000,
      status: 'active'
    });
    
    toast.success('API added successfully!');
  };

  const handlePurchaseApi = (api) => {
    toast.success(`Started purchase process for ${api.name}`);
    // In a real application, this would open the Stripe checkout
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">APIs</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Manage your APIs and add new ones' 
              : 'Browse and purchase available APIs'}
          </p>
        </div>
        
        {isAdmin && (
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New API'}
          </button>
        )}
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New API</h2>
          <form onSubmit={handleAddApi} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">API Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newApi.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Endpoint</label>
                <input
                  type="text"
                  name="endpoint"
                  required
                  value={newApi.endpoint}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  value={newApi.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md h-24"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price ($ per 1000 calls)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={newApi.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add API
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api) => (
          <Card key={api.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{api.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <p className="mt-2 text-muted-foreground">{api.description}</p>
              
              <div className="mt-4 text-sm">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Endpoint:</span>
                  <span className="font-mono">{api.endpoint}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Pricing:</span>
                  <span>${api.price.toFixed(2)} per {api.calls.toLocaleString()} calls</span>
                </div>
              </div>
            </div>
            
            {!isAdmin && (
              <div className="p-4 bg-muted border-t border-border">
                <button
                  className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  onClick={() => handlePurchaseApi(api)}
                >
                  Purchase API Access
                </button>
              </div>
            )}
            
            {isAdmin && (
              <div className="p-4 bg-muted border-t border-border flex justify-between">
                <button
                  className="px-3 py-1 border border-input rounded-md hover:bg-accent"
                  onClick={() => toast.info('Edit functionality would go here')}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-destructive border border-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toast.info('Delete functionality would go here')}
                >
                  Delete
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiList;
