import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import axios from 'axios';

const ApiLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/proxy/logs`);
        console.log(res.data)
        setLogs(res.data); // <- Use .data to access actual logs
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

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

  const filteredLogs =
    filter === 'all'
      ? logs
      : logs.filter((log) => {
          if (filter === 'success') return log.status >= 200 && log.status < 300;
          if (filter === 'error') return log.status >= 400;
          return true;
        });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Logs</h1>
        <p className="text-muted-foreground">Monitor API activity and troubleshoot issues</p>
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
                <th className="px-4 py-2 text-left text-sm font-medium">API Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Method</th>

                <th className="px-4 py-2 text-left text-sm font-medium">Endpoint</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Response Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{log.name}</td>
                  <td className="px-4 py-3 text-sm">{log.method}</td>

                  <td className="px-4 py-3 text-sm font-mono">{log.endpoint}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        log.status
                      )} text-white`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.responseTime} ms</td>
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
