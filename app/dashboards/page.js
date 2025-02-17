'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Notification } from '@/components/ui/notification';
import { Sidebar } from '@/components/layout/sidebar';
import { UsageStats } from '@/components/dashboard/usage-stats';
import { CreateKeyModal } from '@/components/dashboard/create-key-modal';
import { EyeIcon, CopyIcon, EditIcon, TrashIcon } from '@/components/ui/icons';

function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = 'ingest_';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [newName, setNewName] = useState('');
  const [showFullKey, setShowFullKey] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ name: '' });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*');
        
        if (error) throw error;
        
        setApiKeys(data || []);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('api_keys').select('count');
        if (error) throw error;
        console.log('Supabase connection successful');
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    };
    
    testConnection();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col p-8 bg-white">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl mb-12"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function createNewKey() {
    if (!newKeyData.name.trim()) {
      setNotification({
        show: true,
        message: "Please enter a name for the API key",
        type: 'error'
      });
      return;
    }

    try {
      const newKey = {
        name: newKeyData.name.trim(),
        key: generateApiKey(),
        usage: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();

      if (error) throw error;

      setApiKeys(prev => [...prev, data[0]]);
      setIsModalOpen(false);
      setNewKeyData({ name: '' });
      
      setNotification({
        show: true,
        message: "API key created successfully!",
        type: 'success'
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    } catch (error) {
      console.error('Error creating new key:', error);
      setNotification({
        show: true,
        message: `Failed to create API key: ${error.message}`,
        type: 'error'
      });
    }
  }

  const updateKeyName = async (keyId) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ name: newName })
      .eq('id', keyId);

    if (error) {
      console.error('Error updating key name:', error);
      return;
    }

    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, name: newName } : key
    ));
    setEditingKey(null);
    setNewName('');
  };

  const deleteKey = async (keyId) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      setNotification({
        show: true,
        message: "API key deleted successfully",
        type: 'error' // Using error type for red color
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    } catch (error) {
      console.error('Error deleting key:', error);
      setNotification({
        show: true,
        message: `Failed to delete API key: ${error.message}`,
        type: 'error'
      });
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setShowFullKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotification({
        show: true,
        message: 'Successfully copied API key',
        type: 'success'
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    } catch (err) {
      setNotification({
        show: true,
        message: 'Failed to copy API key',
        type: 'error'
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <main className={`
        flex-1 p-4 transition-all duration-200
        ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
      `}>
        <UsageStats />

        {/* API Keys Section */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Create New Key
            </button>
          </div>

          <p className="text-gray-600 mb-8">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>

          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 text-sm font-medium text-gray-500">NAME</th>
                  <th className="text-left py-4 text-sm font-medium text-gray-500">USAGE</th>
                  <th className="text-left py-4 text-sm font-medium text-gray-500">KEY</th>
                  <th className="text-right py-4 text-sm font-medium text-gray-500">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">
                      {editingKey === key.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            placeholder={key.name}
                          />
                          <button
                            onClick={() => updateKeyName(key.id)}
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="text-sm text-gray-500 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        key.name
                      )}
                    </td>
                    <td className="py-4 text-gray-900">{key.usage}</td>
                    <td className="py-4 font-mono text-gray-600">
                      {showFullKey[key.id] ? key.key : key.key.substring(0, 12) + '...'}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-4">
                        <button 
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={showFullKey[key.id] ? "Hide API Key" : "Show API Key"}
                        >
                          <EyeIcon />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(key.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy API Key"
                        >
                          <CopyIcon />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingKey(key.id);
                            setNewName(key.name);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit Key Name"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => deleteKey(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Delete API Key"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {apiKeys.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No API keys found. Create one to get started.
              </div>
            )}
          </div>
        </div>

        <CreateKeyModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateKey={createNewKey}
          newKeyData={newKeyData}
          setNewKeyData={setNewKeyData}
        />

        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </main>
    </div>
  );
}
