
import React from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Billing = () => {
  // Sample billing data
  const billingInfo = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Example Corp',
    address: '123 Main St, City, Country',
    paymentMethod: {
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2023
    }
  };

  const invoices = [
    {
      id: 'INV-001',
      date: '2023-05-01',
      amount: 49.00,
      status: 'paid',
      description: 'Pro Plan - May 2023'
    },
    {
      id: 'INV-002',
      date: '2023-04-01',
      amount: 49.00,
      status: 'paid',
      description: 'Pro Plan - April 2023'
    },
    {
      id: 'INV-003',
      date: '2023-03-01',
      amount: 49.00,
      status: 'paid',
      description: 'Pro Plan - March 2023'
    },
    {
      id: 'INV-004',
      date: '2023-02-01',
      amount: 19.00,
      status: 'paid',
      description: 'Basic Plan - February 2023'
    },
    {
      id: 'INV-005',
      date: '2023-01-01',
      amount: 19.00,
      status: 'paid',
      description: 'Basic Plan - January 2023'
    }
  ];

  const handleUpdatePayment = () => {
    toast.success('Opening payment method update flow');
    // In a real application, this would open the Stripe billing portal
  };

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Downloading invoice ${invoice.id}`);
    // In a real application, this would download the invoice PDF
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your billing information and view invoices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Billing Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Name</span>
              <span>{billingInfo.name}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span>{billingInfo.email}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Company</span>
              <span>{billingInfo.company}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span className="text-muted-foreground">Address</span>
              <span>{billingInfo.address}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="px-4 py-2 border border-input rounded-md hover:bg-accent"
              onClick={() => toast.info('Edit billing info flow would go here')}
            >
              Edit Billing Information
            </button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          
          <div className="p-4 border border-border rounded-md flex items-start space-x-3">
            <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4ZM20 6V10H4V6H20ZM4 12H20V18H4V12ZM7 15H9V17H7V15ZM11 15H17V17H11V15Z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">{billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}</div>
              <div className="text-sm text-muted-foreground">
                Expires {billingInfo.paymentMethod.expMonth}/{billingInfo.paymentMethod.expYear}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              onClick={handleUpdatePayment}
            >
              Update Payment Method
            </button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-sm font-medium">Invoice</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{invoice.id}</td>
                  <td className="px-4 py-3 text-sm">{invoice.date}</td>
                  <td className="px-4 py-3 text-sm">{invoice.description}</td>
                  <td className="px-4 py-3 text-sm">${invoice.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => handleDownloadInvoice(invoice)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Billing;
