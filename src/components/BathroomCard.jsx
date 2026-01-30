import React from 'react';

function BathroomCard({ bathroom, onClick, isSelected }) {
  const typeColors = {
    public: 'bg-blue-50 text-blue-700 border-blue-200',
    park: 'bg-green-50 text-green-700 border-green-200',
    apt: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const typeLabels = {
    public: 'Public',
    park: 'Park',
    apt: 'APT'
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200
        hover:shadow-md
        ${isSelected
          ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
          : 'border border-gray-200 bg-white shadow-sm hover:border-blue-300'
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-base flex-1 pr-2 leading-tight">
          {bathroom.name}
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold border ${typeColors[bathroom.type]} whitespace-nowrap`}>
          {typeLabels[bathroom.type]}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 mb-2">
        <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-xs text-gray-600">{bathroom.address}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {bathroom.isAccessible && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
            ♿
          </span>
        )}
        {bathroom.isOpen ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
            ✓ Open
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
            ✗ Closed
          </span>
        )}
        {bathroom.distance !== undefined && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            📍 {bathroom.distance.toFixed(2)} mi
          </span>
        )}
      </div>

      {/* Hours and Rating */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{bathroom.hours}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium">{bathroom.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Navigation Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${bathroom.latitude},${bathroom.longitude}`, '_blank');
        }}
        className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Navigate
      </button>
    </div>
  );
}

export default BathroomCard;
