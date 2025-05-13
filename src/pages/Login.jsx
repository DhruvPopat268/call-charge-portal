
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, role);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return currentUser.role === 'admin' ? 
      <Navigate to="/admin/dashboard" /> : 
      <Navigate to="/user/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center mx-auto">
            <span className="font-bold text-2xl text-white">AP</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">APIHub</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
          <p className="font-medium text-blue-800">Demo Credentials:</p>
          <p className="text-blue-600">Admin: admin@example.com / admin123</p>
          <p className="text-blue-600">User: user@example.com / user123</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
