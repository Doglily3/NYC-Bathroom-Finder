import React, { useEffect, useRef } from 'react';
import BathroomCard from './BathroomCard';

function BathroomList({ bathrooms, onBathroomClick, selectedId, loading }) {
  const listRef = useRef(null);
  const cardRefs = useRef({});

  // Auto-scroll to selected bathroom when it changes
  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      const selectedCard = cardRefs.current[selectedId];

      if (selectedCard) {
        // Use scrollIntoView for automatic positioning
        selectedCard.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [selectedId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading bathrooms...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (bathrooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-6">
          <div className="mb-4">
            <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold text-xl mb-2">No bathrooms found</p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Try adjusting your filters or search in a different location to find available restrooms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="h-full overflow-y-auto px-4 py-3 scroll-smooth">
      <div className="mb-3 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded border border-blue-200">
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-semibold text-blue-900">
          {bathrooms.length} {bathrooms.length === 1 ? 'restroom' : 'restrooms'}
        </span>
      </div>
      {bathrooms.map(bathroom => (
        <div
          key={bathroom.id}
          ref={el => cardRefs.current[bathroom.id] = el}
        >
          <BathroomCard
            bathroom={bathroom}
            onClick={() => onBathroomClick(bathroom)}
            isSelected={bathroom.id === selectedId}
          />
        </div>
      ))}
    </div>
  );
}

export default BathroomList;
