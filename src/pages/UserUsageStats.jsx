
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios'

const UserUsageStats = () => {

  const [stats, setStats] = useState([]);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [apiUsage, setApiUsage] = useState([]);
  const [endpointUsage, setEndpointUsage] = useState([]);

  console.log(stats)

  const usageSummary = {
    total: 30293,
    avgPerDay: 4328,
    peakDay: 'May 11',
    peakCalls: 2541
  };

  useEffect(() => {
    axios.get('http://localhost:7000/proxy/logs/stats')
      .then(res => {setStats(res.data)
      })
      .catch(err => console.error(err));

    const fetchDailyUsage = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/logs/daily-usage');
        setDailyUsage(res.data);
      } catch (err) {
        console.error('Error fetching daily usage:', err.message);
      }
    };
    fetchDailyUsage();

    const usageByAPI = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/logs/usage-by-api');
        console.log(res.data)
        setApiUsage(res.data);
      } catch (err) {
        console.error('Error fetching API usage:', err.message);
      }
    };
    usageByAPI();

    const usageByEndpoint = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/logs/usage-by-endpoint');
        setEndpointUsage(res.data);
      } catch (err) {
        console.error('Failed to load endpoint usage:', err);
      }
    };
    usageByEndpoint();
  },[]);

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
          <h3 className="text-2xl font-bold mt-2">{stats?.totalCalls ? stats.totalCalls.toLocaleString() : 'N/A'}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Average Daily Calls</p>
          <h3 className="text-2xl font-bold mt-2">{stats?.averageCalls ? stats.averageCalls.toLocaleString() : 'N/A'}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Peak Usage Day</p>
          <h3 className="text-2xl font-bold mt-2">{stats?.peakDay || 'N/A'}</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Peak Day Calls</p>
          <h3 className="text-2xl font-bold mt-2">{stats?.peakDayCalls ? stats.peakDayCalls.toLocaleString() : 'N/A'}</h3>
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
                      style={{ width: `${(api.calls / stats.totalCalls) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-muted-foreground">{Math.round((api.calls / stats.totalCalls) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserUsageStats;
