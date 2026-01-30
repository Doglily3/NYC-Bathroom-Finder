import React, { useState, useEffect, useMemo } from 'react';
import Map from './components/Map';
import BathroomList from './components/BathroomList';
import SearchBar from './components/SearchBar';
import UrgentButton from './components/UrgentButton';
import { fetchAllBathrooms } from './services/bathroomAPI';
import { addDistanceToBathrooms } from './utils/distance';
import { urgentSort, applyFilters } from './utils/filters';

const NYC_CENTER = { lat: 40.7128, lng: -74.0060 };
const DEFAULT_ZOOM = 12;

function App() {
  // State management
  const [allBathrooms, setAllBathrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(NYC_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [urgentMode, setUrgentMode] = useState(false);
  const [filters, setFilters] = useState({
    openNow: false,
    accessibleOnly: false,
    maxDistance: 0, // 0 means no distance filter
    type: 'all'
  });

  // Fetch bathrooms on mount
  useEffect(() => {
    const loadBathrooms = async () => {
      setLoading(true);
      const data = await fetchAllBathrooms();
      setAllBathrooms(data);
      setLoading(false);
    };

    loadBathrooms();
  }, []);

  // Calculate distances when user location changes
  const bathroomsWithDistance = useMemo(() => {
    return addDistanceToBathrooms(allBathrooms, userLocation);
  }, [allBathrooms, userLocation]);

  // Apply filters and sorting
  const displayedBathrooms = useMemo(() => {
    let result = bathroomsWithDistance;

    // Apply urgent mode sorting
    if (urgentMode) {
      result = urgentSort(result, userLocation);
    } else {
      // Apply regular filters
      result = applyFilters(result, filters);

      // Sort by distance if user location is set
      if (userLocation) {
        result = [...result].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }
    }

    return result;
  }, [bathroomsWithDistance, urgentMode, filters, userLocation]);

  // Handle location change from search
  const handleLocationChange = (location) => {
    setUserLocation(location);
    setMapCenter({ lat: location.lat, lng: location.lng });
    setMapZoom(14);
  };

  // Handle user location request
  const handleUserLocationRequest = (location) => {
    setUserLocation(location);
    setMapCenter(location);
    setMapZoom(14);
  };

  // Handle bathroom click from list
  const handleBathroomClick = (bathroom) => {
    setSelectedBathroom(bathroom);
    setMapCenter({ lat: bathroom.latitude, lng: bathroom.longitude });
    setMapZoom(16);
  };

  // Toggle urgent mode
  const handleUrgentToggle = () => {
    if (!userLocation) {
      alert('Please set your location first using "My Location" or search');
      return;
    }
    setUrgentMode(!urgentMode);
  };

  // Toggle filters
  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-2xl font-bold">
              NYC Bathroom Finder
            </h1>
          </div>
          <p className="text-center text-blue-100 mt-1 text-sm">
            Find clean, accessible restrooms near you
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        onLocationChange={handleLocationChange}
        onUserLocationRequest={handleUserLocationRequest}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Sidebar - List View */}
        <div className="w-full md:w-[400px] bg-white flex flex-col shadow-md rounded-lg overflow-hidden">
          {/* Urgent Button */}
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <UrgentButton
              onClick={handleUrgentToggle}
              isActive={urgentMode}
              disabled={!userLocation}
            />
          </div>

          {/* Filters */}
          <div className="p-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="font-semibold text-gray-900 text-xs">Filters</h3>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center cursor-pointer p-1.5 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={() => toggleFilter('openNow')}
                  disabled={urgentMode}
                  className="mr-2 h-3.5 w-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-xs text-gray-700">Open Now</span>
              </label>
              <label className="flex items-center cursor-pointer p-1.5 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.accessibleOnly}
                  onChange={() => toggleFilter('accessibleOnly')}
                  disabled={urgentMode}
                  className="mr-2 h-3.5 w-3.5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-xs text-gray-700">Accessible Only</span>
              </label>

              {/* Type Filter */}
              <div className="pt-0.5">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  disabled={urgentMode}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="public">Public Restrooms</option>
                  <option value="park">Park Facilities</option>
                  <option value="apt">Automatic Toilets</option>
                </select>
              </div>
            </div>

            {urgentMode && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded border border-amber-200">
                ⚡ Filters disabled
              </div>
            )}
          </div>

          {/* Bathroom List */}
          <div className="flex-1 overflow-hidden bg-white">
            <BathroomList
              bathrooms={displayedBathrooms}
              onBathroomClick={handleBathroomClick}
              selectedId={selectedBathroom?.id}
              loading={loading}
            />
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 relative rounded-lg overflow-hidden shadow-md border border-gray-200">
          <Map
            bathrooms={displayedBathrooms}
            center={mapCenter}
            zoom={mapZoom}
            onBathroomClick={handleBathroomClick}
            selectedBathroom={selectedBathroom}
            userLocation={userLocation}
          />

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[1000]">
            <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Legend
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">
                  🚻
                </div>
                <span className="text-xs text-gray-700">Public</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-xs">
                  🚻
                </div>
                <span className="text-xs text-gray-700">Park</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">
                  🚻
                </div>
                <span className="text-xs text-gray-700">APT</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  📍
                </div>
                <span className="text-xs font-medium text-gray-900">You</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
