// ============================================
// HalalMap Georgia - Location Button Component
// Button to get user's current location
// ============================================

'use client';

interface LocationButtonProps {
  onClick: () => void;
  isActive: boolean;
  isLoading: boolean;
}

export default function LocationButton({ onClick, isActive, isLoading }: LocationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`btn px-4 py-3 shadow-lg ${
        isActive
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
      title="Use my location"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="spinner"></div>
          <span>Finding...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-xl">📍</span>
          <span className="font-medium">Use My Location</span>
        </div>
      )}
    </button>
  );
}
