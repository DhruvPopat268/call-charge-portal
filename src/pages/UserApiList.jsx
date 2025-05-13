
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const UserApiList = () => {
  // Sample list of available APIs
  const [apis, setApis] = useState([
    {
      id: 1,
      name: 'Weather API',
      description: 'Real-time weather data for any location worldwide',
      price: 2.00,  // $ per 1000 calls
      endpoints: ['GET /current', 'GET /forecast', 'GET /historical'],
      purchased: true,
      category: 'Weather',
      popularity: 98
    },
    {
      id: 2,
      name: 'Stock Market API',
      description: 'Up-to-date stock quotes, market data, and company information',
      price: 3.50,
      endpoints: ['GET /quotes', 'GET /history', 'GET /companies'],
      purchased: true,
      category: 'Finance',
      popularity: 95
    },
    {
      id: 3,
      name: 'Currency Exchange API',
      description: 'Real-time currency exchange rates for 170+ currencies',
      price: 1.80,
      endpoints: ['GET /rates', 'GET /convert', 'GET /historical'],
      purchased: true,
      category: 'Finance',
      popularity: 92
    },
    {
      id: 4,
      name: 'News API',
      description: 'Breaking news headlines and article search from 80,000+ sources',
      price: 2.50,
      endpoints: ['GET /headlines', 'GET /search', 'GET /sources'],
      purchased: false,
      category: 'Media',
      popularity: 89
    },
    {
      id: 5,
      name: 'Geocoding API',
      description: 'Convert addresses to coordinates and vice versa',
      price: 2.20,
      endpoints: ['GET /geocode', 'GET /reverse', 'GET /autocomplete'],
      purchased: false,
      category: 'Mapping',
      popularity: 87
    },
    {
      id: 6,
      name: 'Image Recognition API',
      description: 'Identify objects, scenes, and faces in images',
      price: 4.00,
      endpoints: ['POST /analyze', 'POST /detect-faces', 'POST /labels'],
      purchased: false, 
      category: 'AI',
      popularity: 91
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handlePurchaseApi = (apiId) => {
    toast.success('Redirecting to payment gateway...');
    // In a real app, this would redirect to a Stripe checkout
    
    // For demo, we'll just mark it as purchased
    setTimeout(() => {
      setApis(apis.map(api => 
        api.id === apiId ? { ...api, purchased: true } : api
      ));
      toast.success('API purchased successfully!');
    }, 2000);
  };

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          api.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'purchased') return matchesSearch && api.purchased;
    if (filter === 'available') return matchesSearch && !api.purchased;
    if (filter === api.category.toLowerCase()) return matchesSearch;
    
    return false;
  });

  const categories = ['All', 'Purchased', 'Available', 'Weather', 'Finance', 'Media', 'Mapping', 'AI'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase APIs for your applications
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search APIs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === category.toLowerCase() 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredApis.map((api) => (
          <Card key={api.id} className="overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{api.name}</h3>
                <span className="bg-gray-100 text-xs font-medium px-2 py-1 rounded-full">
                  {api.category}
                </span>
              </div>
              
              <p className="text-muted-foreground mt-2">{api.description}</p>
              
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium">Available Endpoints:</p>
                <ul className="text-sm text-muted-foreground">
                  {api.endpoints.map((endpoint, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                      {endpoint}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center">
                <div className="h-2 bg-muted rounded-full overflow-hidden flex-1 mr-2">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${api.popularity}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">{api.popularity}% popularity</span>
              </div>
            </div>
            
            <div className="p-6 border-t border-border bg-muted flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Price per 1000 calls</p>
                <p className="text-lg font-bold">${api.price.toFixed(2)}</p>
              </div>
              
              {api.purchased ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                  Purchased
                </span>
              ) : (
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  onClick={() => handlePurchaseApi(api.id)}
                >
                  Purchase
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredApis.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No APIs found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserApiList;
