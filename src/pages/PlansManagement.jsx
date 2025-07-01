import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Loader2, Plus } from 'lucide-react';

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/plans`);
      setPlans(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      toast.error('Error fetching plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (editPlan) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/plans/${editPlan._id}`, data);
        toast.success('Plan updated!');
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/plans`, data);
        toast.success('Plan created!');
      }

      reset();
      setEditPlan(null);
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      toast.error('Save failed');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch {
      toast.error('Delete failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plans</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-2"
          onClick={() => {
            setEditPlan(null);
            reset();
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Create New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center text-muted-foreground py-10 space-y-2">
          <p className="text-lg font-medium">No plans found.</p>
          <p className="text-sm">Start by adding your first plan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Price</th>
                <th className="text-left px-4 py-2 font-medium">Included Calls</th>
                <th className="text-left px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id} className="border-t hover:bg-muted/40 transition">
                  <td className="px-4 py-3">{plan.name}</td>
                <td className="px-4 py-3">£{plan.price.toFixed(2)}</td>

                  <td className="px-4 py-3">{plan.includedCalls.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setEditPlan(plan);
                          reset(plan);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={actionLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              {editPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register('name')}
                placeholder="Plan Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                {...register('price')}
                placeholder="Price"
                type="number"
                className="w-full p-2 border rounded"
                required
              />
              <input
                {...register('includedCalls')}
                placeholder="Included Calls"
                type="number"
                className="w-full p-2 border rounded"
                required
              />
             

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditPlan(null);
                    reset();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center"
                >
                  {actionLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                  {editPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansManagement;