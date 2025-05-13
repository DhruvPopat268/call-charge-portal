
import React from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Subscription = () => {
  // Sample subscription data
  const subscription = {
    plan: 'Pro',
    status: 'Active',
    startDate: '2023-04-01',
    renewDate: '2023-06-01',
    includedCalls: 50000,
    usedCalls: 30293,
    pricePerExtraCalls: 2.00
  };

  const plans = [
    {
      name: 'Basic',
      price: 19,
      includedCalls: 10000,
      extraCallPrice: 3.00,
      features: [
        'Access to Basic APIs',
        'Standard Support Response',
        'Simple Analytics Dashboard',
        'API Rate limiting: 5 req/sec'
      ],
      recommended: false
    },
    {
      name: 'Pro',
      price: 49,
      includedCalls: 50000,
      extraCallPrice: 2.00,
      features: [
        'Access to All APIs',
        'Priority Support',
        'Advanced Analytics Dashboard',
        'API Rate limiting: 20 req/sec',
        'Custom API Keys',
        'Team Access (up to 3 users)'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 99,
      includedCalls: 150000,
      extraCallPrice: 1.50,
      features: [
        'Access to All APIs & Early Access',
        '24/7 Premium Support',
        'Full Analytics & Reporting',
        'API Rate limiting: 50 req/sec',
        'Unlimited API Keys',
        'Team Access (unlimited users)',
        'Dedicated Account Manager',
        'SLA guarantees'
      ],
      recommended: false
    }
  ];

  const handleUpgrade = (plan) => {
    toast.success(`Opening Stripe checkout for ${plan.name} plan`);
    // In a real application, this would open the Stripe checkout
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Subscription</h1>
        <p className="text-muted-foreground">
          Manage your API subscription and usage
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Current Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{subscription.plan}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {subscription.status}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Started</span>
              <span>{subscription.startDate}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Next Renewal</span>
              <span>{subscription.renewDate}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">API Call Usage</h4>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${(subscription.usedCalls / subscription.includedCalls) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>{subscription.usedCalls.toLocaleString()} used</span>
                <span>{subscription.includedCalls.toLocaleString()} included</span>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Extra API calls</p>
                  <p className="text-sm text-muted-foreground">${subscription.pricePerExtraCalls.toFixed(2)} per 1,000 calls</p>
                </div>
                <button 
                  className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary/90"
                  onClick={() => toast.success('Opening additional API calls purchase flow')}
                >
                  Buy More
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10"
            onClick={() => toast.info('Cancellation flow would start here')}
          >
            Cancel Subscription
          </button>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`overflow-hidden border-2 ${plan.recommended ? 'border-primary' : 'border-border'}`}
            >
              {plan.recommended && (
                <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                  Recommended
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Includes {plan.includedCalls.toLocaleString()} API calls/month
                </p>
                <p className="text-sm text-muted-foreground">
                  ${plan.extraCallPrice.toFixed(2)} per 1,000 extra calls
                </p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 border-t border-border bg-muted">
                <button
                  className={`w-full py-2 rounded-md ${
                    plan.name === subscription.plan
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  disabled={plan.name === subscription.plan}
                  onClick={() => handleUpgrade(plan)}
                >
                  {plan.name === subscription.plan ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
