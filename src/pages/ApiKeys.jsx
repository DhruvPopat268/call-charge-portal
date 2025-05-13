
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const sampleApiKeys = [
  {
    id: 1,
    name: 'Production Key',
    key: 'pk_live_51Hb6uRDJ8ciJNQmi6zfF7Uv5dUwvPgRrFpFF',
    createdAt: '2023-04-15T10:23:14',
    lastUsed: '2023-05-13T14:22:03',
    status: 'active'
  },
  {
    id: 2,
    name: 'Development Key',
    key: 'pk_test_51Hb6uRDJ8ciJNQmi6zfF7Uv5dUwvGhTrQpRE',
    createdAt: '2023-04-15T10:23:14',
    lastUsed: '2023-05-12T09:45:22',
    status: 'active'
  },
  {
    id: 3,
    name: 'Sandbox Testing',
    key: 'pk_sandbox_51Hb6uRDJ8ciJNQmi6zfF7Uv5dUwvUiJkHgG',
    createdAt: '2023-03-22T15:12:33',
    lastUsed: '2023-05-10T16:30:45',
    status: 'inactive'
  }
];

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState(sampleApiKeys);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCreateKey = (e) => {
    e.preventDefault();
    
    const newKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      key: `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      status: 'active'
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setShowNewKeyForm(false);
    toast.success('New API key created successfully!');
  };

  const handleRevokeKey = (id) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' } : key
    ));
    toast.success('API key has been revoked.');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API access keys
          </p>
        </div>
        
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => setShowNewKeyForm(!showNewKeyForm)}
        >
          {showNewKeyForm ? 'Cancel' : 'Generate New API Key'}
        </button>
      </div>

      {showNewKeyForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Key Name</label>
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Key"
                className="w-full p-2 border border-input rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Generate Key
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">API Key</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Last Used</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3">{apiKey.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                        {apiKey.key.substring(0, 10)}...
                      </code>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey.key);
                          toast.success('API key copied to clipboard');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(apiKey.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(apiKey.lastUsed)}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {apiKey.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs text-destructive hover:underline"
                      disabled={apiKey.status !== 'active'}
                      onClick={() => handleRevokeKey(apiKey.id)}
                    >
                      {apiKey.status === 'active' ? 'Revoke' : 'Revoked'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Keep your API keys secure — they should be stored securely and never exposed in client-side code.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;
