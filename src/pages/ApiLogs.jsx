
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const sampleLogs = [
  {
    id: '1001',
    apiName: 'Weather API',
    endpoint: 'GET /weather/location',
    status: 200,
    latency: 124,
    timestamp: '2023-05-13T14:22:03',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1002',
    apiName: 'Stock Market API',
    endpoint: 'GET /stocks/quote/AAPL',
    status: 200,
    latency: 89,
    timestamp: '2023-05-13T14:20:45',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1003',
    apiName: 'Weather API',
    endpoint: 'GET /weather/forecast',
    status: 429,
    latency: 45,
    timestamp: '2023-05-13T14:19:32',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1004',
    apiName: 'Currency Exchange API',
    endpoint: 'GET /currency/convert',
    status: 200,
    latency: 102,
    timestamp: '2023-05-13T14:18:17',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1005',
    apiName: 'News API',
    endpoint: 'GET /news/headlines',
    status: 404,
    latency: 76,
    timestamp: '2023-05-13T14:16:55',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1006',
    apiName: 'Stock Market API',
    endpoint: 'GET /stocks/history/TSLA',
    status: 200,
    latency: 156,
    timestamp: '2023-05-13T14:15:22',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1007',
    apiName: 'Weather API',
    endpoint: 'GET /weather/alerts',
    status: 200,
    latency: 92,
    timestamp: '2023-05-13T14:14:07',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '1008',
    apiName: 'Currency Exchange API',
    endpoint: 'GET /currency/rates',
    status: 500,
    latency: 205,
    timestamp: '2023-05-13T14:12:33',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
];

const ApiLogs = () => {
  const [logs] = useState(sampleLogs);
  const [filter, setFilter] = useState('all');
  
  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => {
        if (filter === 'success') return log.status >= 200 && log.status < 300;
        if (filter === 'error') return log.status >= 400;
        return true;
      });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Logs</h1>
        <p className="text-muted-foreground">
          Monitor API activity and troubleshoot issues
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Filter Status</label>
            <select 
              className="p-2 border border-input rounded-md bg-background"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Logs</option>
              <option value="success">Success (2xx)</option>
              <option value="error">Error (4xx, 5xx)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-sm font-medium">API</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Endpoint</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Latency</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{log.apiName}</td>
                  <td className="px-4 py-3 text-sm font-mono">{log.endpoint}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)} text-white`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.latency} ms</td>
                  <td className="px-4 py-3 text-sm">{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </Card>
    </div>
  );
};

export default ApiLogs;
