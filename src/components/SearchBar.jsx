import React, { useState } from 'react';
import { geocodeLocation } from '../services/bathroomAPI';

function SearchBar({ onLocationChange, onUserLocationRequest }) {
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setSearching(true);
    const result = await geocodeLocation(searchText);
    setSearching(false);

    if (result) {
      onLocationChange(result);
    } else {
      alert('Location not found. Please try a different search term.');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearching(false);
        onUserLocationRequest({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setSearching(false);
        alert('Unable to get your location. Please check your browser permissions.');
        console.error('Geolocation error:', error);
      }
    );
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="px-6 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search address or neighborhood..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm text-gray-700 placeholder-gray-400"
              disabled={searching}
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchText.trim()}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1.5"
          >
            {searching ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </>
            ) : (
              'Search'
            )}
          </button>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={searching}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            My Location
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
