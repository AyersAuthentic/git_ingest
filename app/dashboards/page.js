'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2"/>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/>
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="8" width="12" height="12" rx="2"/>
    <path d="M4 16V4a2 2 0 0 1 2-2h10"/>
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [newName, setNewName] = useState('');
  const [showFullKey, setShowFullKey] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: ''
  });

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

  function generateApiKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let result = 'ingest_';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }

  async function createNewKey() {
    if (!newKeyData.name.trim()) {
      alert('Please enter a name for the API key');
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

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error creating key: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert');
      }

      setApiKeys(prev => [...prev, data[0]]);
      setIsModalOpen(false);
      setNewKeyData({ name: '' });
      
      // Show success message
      alert('API key created successfully!');
    } catch (error) {
      console.error('Error creating new key:', error);
      alert(`Failed to create API key: ${error.message}`);
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
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) {
      console.error('Error deleting key:', error);
      return;
    }

    setApiKeys(prev => prev.filter(key => key.id !== keyId));
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
      alert('API key copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-8 bg-white">
      {/* Gradient Header Section */}
      <div className="w-full max-w-4xl mx-auto mb-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-sm text-white/90 uppercase tracking-wider mb-2">CURRENT PLAN</h2>
            <h1 className="text-4xl font-bold text-white">Researcher</h1>
          </div>
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/30 transition-colors">
            Manage Plan
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white">API Limit</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '2.4%' }}></div>
            </div>
            <div className="mt-2 text-sm text-white">24 / 1,000 Requests</div>
          </div>
        </div>
      </div>

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create a new API key</h2>
            
            <p className="text-gray-700 mb-8">
              Enter a name for the new API key.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({...newKeyData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Key Name"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={createNewKey}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
