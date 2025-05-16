
import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const UserDashboard = () => {

  const [logs, setLogs] = useState([]);
  const [endpointUsage, setEndpointUsage] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const usageByEndpoint = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/logs/usage-by-endpoint');
        setEndpointUsage(res.data);
      } catch (err) {
        console.error('Failed to load endpoint usage:', err);
      }
    };
    usageByEndpoint();

    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/recent');
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };
    fetchLogs();

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:7000/proxy/stats');
        const data = res.data;

        setStats([
          {
            title: 'Total API Calls',
            value: data.totalCalls.toLocaleString(),
            change: '+0%', // Optional: add real comparison logic
            positive: true
          },
          {
            title: 'Active APIs',
            value: data.activeApis.toString(),
            change: '+0', // Optional
            positive: true
          },
          {
            title: 'API Response Time',
            value: `${data.avgResponseTime}ms`,
            change: '-0ms', // Optional
            positive: true
          },
          {
            title: 'Success Rate',
            value: `${data.successRate}%`,
            change: '+0%', // Optional
            positive: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, </h1>
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
            {logs.map((log, i) => (
              <div
                key={log._id || i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  ></div>
                  <span className="font-medium">{log.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {log.success ? 'Success' : 'Failed'} •{' '}
                  {moment(log.timestamp).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">API Usage By Endpoint</h3>
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
    </div>
  );
};

export default UserDashboard;
