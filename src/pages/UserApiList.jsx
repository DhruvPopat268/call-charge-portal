import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios'

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};


const UserApiList = () => {
  const [apis, setApis] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editApi, setEditApi] = useState(null); // track API being edited


  console.log(apis)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      endpoint: '',
      price: 0,
      calls: 1000,
      status: 'active',
    },
  });

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const res = await axios.get('http://localhost:7000/api/list', {
          withCredentials: true,
        });

        setApis(res.data); // assuming res.data is an array of APIs
      } catch (error) {
        console.error('Failed to fetch APIs:', error);
        toast.error('Failed to load APIs.');
      }
    };

    fetchApis();
  }, [])


  const onSubmit = async (data) => {
    try {
      if (editApi) {
        const res = await axios.put(`http://localhost:7000/api/${editApi._id}`, data, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const updatedList = apis.map((api) =>
            api._id === editApi._id ? res.data : api
          );
          setApis(updatedList);
          toast.success('API updated successfully!');
        }

      } else {
        const res_post = await axios.post("http://localhost:7000/api/add", data, {
          withCredentials: true
        });

        if (res_post.status === 201) {
          setApis([...apis, res_post.data]);
          toast.success('API added successfully!');
        }
      }

      reset();
      setShowAddForm(false);
      setEditApi(null);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit API.');
    }
  };



  const handlePurchaseApi = (api) => {
    toast.success(`Started purchase process for ${api.name}`);
  };

  const handleAPIDelete = async (api) => {
    const apiId = api._id; // Update to correctly access _id from the API object

    if (!apiId) {
      toast.error("API ID is missing. Deletion cannot proceed.");
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:7000/api/${apiId}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setApis((prev) => prev.filter((item) => item._id !== apiId)); // Filter by the correct API ID
        toast.success(`${api.name} deleted successfully!`);
      } else {
        toast.error(`Failed to delete ${api.name}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('An error occurred while deleting the API.');
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">APIs</h1>
        </div>

        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => {
            setEditApi(null);
            setShowAddForm((prev) => !prev);
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New API'}
        </button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editApi ? 'Edit API' : 'Add New API'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">API Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'API Name is required' })}
                  className="w-full p-2 border border-input rounded-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Endpoint</label>
                <input
                  type="text"
                  {...register('endpoint', { required: 'Endpoint is required' })}
                  className="w-full p-2 border border-input rounded-md"
                />
                {errors.endpoint && <p className="text-red-500 text-sm">{errors.endpoint.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  className="w-full p-2 border border-input rounded-md h-24"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div className='w-full'>
                <label className="block text-sm font-medium mb-1">Price ($ per 1000 calls)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className="w-full p-2 border border-input rounded-md"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}


              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-medium mb-1">
                  HTTP Method
                </label>
                <select
                  id="method"
                  {...register('method')}
                  className="w-full p-2 border border-input rounded-md"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                {editApi ? 'Update API' : 'Add API'}
              </button>

            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api) => (
          <Card key={api._id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{api.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <p className="mt-2 text-muted-foreground">{api.description}</p>

              <div className="mt-4 text-sm">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Endpoint:</span>
                  <span className="font-mono">{api.endpoint}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Pricing:</span>
                  <span>
                    {/* ${api.price.toFixed(2)} per {api.calls.toLocaleString()} calls */}
                    ${api.price?.toFixed(2)} per {Number(api.calls || 0).toLocaleString()} calls

                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted border-t border-border">
              <button
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                onClick={() => handlePurchaseApi(api)}
              >
                Purchase API Access
              </button>
            </div>

            <div className="p-4 bg-muted border-t border-border flex flex-col gap-2">
              <input
                type="text"
                readOnly
                value={api.proxyUrl}
                className="w-full p-2 border text-center border-gray-300 rounded bg-gray-100 text-sm"
              />
              <CopyButton text={api.proxyUrl} />
            </div>

            <div className="p-4 bg-muted border-t border-border flex justify-between">
              <button
                className="px-3 py-1 border border-input rounded-md hover:bg-accent"
                onClick={() => {
                  setEditApi(api);
                  setShowAddForm(true);
                  reset(api); // prefill the form
                }}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-destructive border border-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleAPIDelete(api)}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserApiList;
