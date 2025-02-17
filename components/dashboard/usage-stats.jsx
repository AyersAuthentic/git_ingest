'use client';

function UsageStats() {
  return (
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
  );
}

export { UsageStats }; 