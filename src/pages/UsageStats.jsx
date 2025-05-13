
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsageStats = () => {
  // Sample data for charts
  const dailyUsage = [
    { date: 'May 7', calls: 1234 },
    { date: 'May 8', calls: 2145 },
    { date: 'May 9', calls: 1535 },
    { date: 'May 10', calls: 1842 },
    { date: 'May 11', calls: 2541 },
    { date: 'May 12', calls: 1920 },
    { date: 'May 13', calls: 1674 }
  ];

  const apiUsage = [
    { name: 'Weather API', calls: 12453 },
    { name: 'Stock Market API', calls: 8765 },
    { name: 'Currency API', calls: 6543 },
    { name: 'News API', calls: 4532 }
  ];

  const endpointUsage = [
    { name: 'GET /weather/current', calls: 8234 },
    { name: 'GET /weather/forecast', calls: 4219 },
    { name: 'GET /stocks/quotes', calls: 5432 },
    { name: 'GET /currency/convert', calls: 3987 },
    { name: 'GET /news/headlines', calls: 2876 }
  ];

  // Usage summary data
  const usageSummary = {
    total: 30293,
    avgPerDay: 4328,
    peakDay: 'May 11',
    peakCalls: 2541
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usage Statistics</h1>
        <p className="text-muted-foreground">
          Monitor your API usage metrics and patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total API Calls (Last 7 Days)</p>
          <h3 className="text-2xl font-bold mt-2">{usageSummary.total.toLocaleString()}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Average Daily Calls</p>
          <h3 className="text-2xl font-bold mt-2">{usageSummary.avgPerDay.toLocaleString()}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Peak Usage Day</p>
          <h3 className="text-2xl font-bold mt-2">{usageSummary.peakDay}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Peak Day Calls</p>
          <h3 className="text-2xl font-bold mt-2">{usageSummary.peakCalls.toLocaleString()}</h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily API Usage (Last 7 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyUsage}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Usage by API</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={apiUsage}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="calls" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Endpoints</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={endpointUsage}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 120, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="calls" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Usage Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">API Call Breakdown</p>
            <div className="mt-2 space-y-2">
              {apiUsage.map((api) => (
                <div key={api.name} className="flex items-center">
                  <div className="w-40 font-medium truncate">{api.name}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden mx-2">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(api.calls / usageSummary.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-muted-foreground">{Math.round((api.calls / usageSummary.total) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UsageStats;
