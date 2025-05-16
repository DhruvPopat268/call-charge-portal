
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
// import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UserPlansManagement = () => {
  // const { isAdmin, currentUser } = useAuth();

  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  // if (!isAdmin) {
  //   return <Navigate to="/dashboard" />;
  // }

  // Sample plans data with more details for admin
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Basic',
      price: 19,
      includedCalls: 10000,
      extraCallPrice: 3.00,
      active: true,
      subscribers: 245,
      revenue: 4655
    },
    {
      id: 2,
      name: 'Pro',
      price: 49,
      includedCalls: 50000,
      extraCallPrice: 2.00,
      active: true,
      subscribers: 128,
      revenue: 6272
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 99,
      includedCalls: 150000,
      extraCallPrice: 1.50,
      active: true,
      subscribers: 36,
      revenue: 3564
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    includedCalls: 0,
    extraCallPrice: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({
      ...newPlan,
      [name]: name === 'name' ? value : Number(value)
    });
  };

  const handleAddPlan = (e) => {
    e.preventDefault();

    const planWithId = {
      ...newPlan,
      id: plans.length + 1,
      active: true,
      subscribers: 0,
      revenue: 0
    };

    setPlans([...plans, planWithId]);
    setShowAddForm(false);
    setNewPlan({
      name: '',
      price: 0,
      includedCalls: 0,
      extraCallPrice: 0
    });

    toast.success('New plan created successfully!');
  };

  const togglePlanStatus = (id) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, active: !plan.active } : plan
    ));
    
    const plan = plans.find(p => p.id === id);
    toast.success(`${plan.name} plan is now ${plan.active ? 'inactive' : 'active'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Plans Management</h1>
          <p className="text-muted-foreground">
            Create and manage subscription plans
          </p>
        </div>

        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Create New Plan'}
        </button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Plan</h2>
          <form onSubmit={handleAddPlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newPlan.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                  placeholder="e.g., Premium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={newPlan.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Included API Calls</label>
                <input
                  type="number"
                  name="includedCalls"
                  required
                  min="0"
                  value={newPlan.includedCalls}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Extra Calls Price ($ per 1000)</label>
                <input
                  type="number"
                  name="extraCallPrice"
                  required
                  min="0"
                  step="0.01"
                  value={newPlan.extraCallPrice}
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
                Create Plan
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
                <th className="px-4 py-2 text-left text-sm font-medium">Plan</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Included Calls</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Extra Call Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Subscribers</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Monthly Revenue</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{plan.name}</td>
                  <td className="px-4 py-3">${plan.price}</td>
                  <td className="px-4 py-3">{plan.includedCalls.toLocaleString()}</td>
                  <td className="px-4 py-3">${plan.extraCallPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">{plan.subscribers}</td>
                  <td className="px-4 py-3">${plan.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => toast.info('Edit plan functionality would go here')}
                      >
                        Edit
                      </button>
                      <button
                        className={`text-xs ${plan.active ? 'text-yellow-600' : 'text-green-600'} hover:underline`}
                        onClick={() => togglePlanStatus(plan.id)}
                      >
                        {plan.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Plan Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stripe Webhook URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value="https://yourdomain.com/api/stripe/webhook"
                className="flex-1 p-2 border border-input rounded-md bg-muted"
              />
              <button 
                className="px-3 py-2 text-primary border border-primary rounded-md hover:bg-primary/10"
                onClick={() => {
                  navigator.clipboard.writeText("https://yourdomain.com/api/stripe/webhook");
                  toast.success('Webhook URL copied to clipboard');
                }}
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this URL in your Stripe webhook settings to receive subscription events.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 mr-2"
              onClick={() => toast.info('Stripe settings configuration would go here')}
            >
              Configure Stripe Settings
            </button>
            <button
              className="px-4 py-2 border border-input rounded-md hover:bg-accent"
              onClick={() => toast.info('Test Stripe webhook functionality')}
            >
              Test Webhook
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserPlansManagement;
