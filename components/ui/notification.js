'use client';

export function Notification({ message, type, onClose }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-lg min-w-[320px]
        ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
        {type === 'success' && (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <span className="flex-1 text-center">{message}</span>
        <button onClick={onClose} className="ml-4 hover:opacity-80">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}