'use client';

function CreateKeyModal({ isOpen, onClose, onCreateKey, newKeyData, setNewKeyData }) {
  if (!isOpen) return null;

  return (
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
            onClick={onCreateKey}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export { CreateKeyModal }; 