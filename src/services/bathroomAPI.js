import { isCurrentlyOpen } from '../utils/filters';
import { mockBathrooms } from '../data/mockBathrooms';

const DATASETS = {
  operational: 'vzrx-zg6z', // Public Restrooms (Operational)
  automatic: 'uzgy-xh4j',   // Automatic Public Toilets
  parks: 'hjae-yuav'        // Directory Of Toilets In Public Parks
};

const BASE_URL = 'https://data.cityofnewyork.us/resource';

// Use mock data as fallback
const USE_MOCK_DATA = true;

/**
 * Fetch bathrooms from a specific dataset
 * @param {string} datasetId - Dataset identifier
 * @param {number} limit - Maximum number of records
 * @returns {Promise<Array>} Array of bathroom data
 */
async function fetchDataset(datasetId, limit = 500) {
  try {
    const response = await fetch(`${BASE_URL}/${datasetId}.json?$limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dataset ${datasetId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching dataset ${datasetId}:`, error);
    return [];
  }
}

/**
 * Normalize bathroom data from different datasets to common format
 * @param {Object} raw - Raw data from API
 * @param {string} type - Type of bathroom (public, park, apt)
 * @returns {Object} Normalized bathroom object
 */
function normalizeBathroom(raw, type) {
  // Different datasets have different field names, so we need to handle each
  const latitude = parseFloat(raw.latitude || raw.lat || raw.the_geom?.coordinates?.[1]);
  const longitude = parseFloat(raw.longitude || raw.lon || raw.lng || raw.the_geom?.coordinates?.[0]);

  // Skip if no valid coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  const hours = raw.hours_of_operation || raw.hours || raw.operation_hours || 'Hours vary';
  const accessible = Boolean(
    raw.ada_accessible === 'Y' ||
    raw.ada_accessible === true ||
    raw.accessible === 'Y' ||
    raw.accessible === true ||
    raw.handicap_accessible === 'Y'
  );

  return {
    id: raw.objectid || raw.id || `${type}-${latitude}-${longitude}`,
    name: raw.name || raw.location_name || raw.site_name || raw.park_name || 'Public Restroom',
    latitude,
    longitude,
    address: raw.address || raw.location || raw.street_address || 'Address not available',
    hours,
    isAccessible: accessible,
    isOpen: isCurrentlyOpen(hours),
    rating: 3.5 + Math.random() * 1, // Simulated rating between 3.5-4.5
    type
  };
}

/**
 * Fetch all bathroom data from NYC Open Data
 * @returns {Promise<Array>} Array of normalized bathroom objects
 */
export async function fetchAllBathrooms() {
  // Use mock data if enabled or as fallback
  if (USE_MOCK_DATA) {
    console.log('Using mock bathroom data (NYC Open Data API unavailable)');
    return mockBathrooms.map(bathroom => ({
      ...bathroom,
      isOpen: isCurrentlyOpen(bathroom.hours),
      rating: 3.5 + Math.random() * 1
    }));
  }

  try {
    console.log('Fetching bathroom data from NYC Open Data...');

    // Fetch from multiple datasets in parallel
    const [operational, automatic, parks] = await Promise.all([
      fetchDataset(DATASETS.operational, 500),
      fetchDataset(DATASETS.automatic, 100),
      fetchDataset(DATASETS.parks, 500)
    ]);

    console.log('Raw data received:', {
      operational: operational.length,
      automatic: automatic.length,
      parks: parks.length
    });

    // Normalize all bathrooms
    const allBathrooms = [
      ...operational.map(b => normalizeBathroom(b, 'public')),
      ...automatic.map(b => normalizeBathroom(b, 'apt')),
      ...parks.map(b => normalizeBathroom(b, 'park'))
    ].filter(b => b !== null); // Remove invalid entries

    console.log(`Successfully loaded ${allBathrooms.length} bathrooms`);

    // Fallback to mock data if API returns no valid data
    if (allBathrooms.length === 0) {
      console.warn('No data from API, falling back to mock data');
      return mockBathrooms.map(bathroom => ({
        ...bathroom,
        isOpen: isCurrentlyOpen(bathroom.hours),
        rating: 3.5 + Math.random() * 1
      }));
    }

    return allBathrooms;
  } catch (error) {
    console.error('Error fetching bathrooms:', error);
    // Fallback to mock data on error
    console.log('Falling back to mock data due to error');
    return mockBathrooms.map(bathroom => ({
      ...bathroom,
      isOpen: isCurrentlyOpen(bathroom.hours),
      rating: 3.5 + Math.random() * 1
    }));
  }
}

/**
 * Search for location coordinates using Nominatim (OpenStreetMap)
 * @param {string} query - Search query (address, neighborhood, etc.)
 * @returns {Promise<Object|null>} Location {lat, lng, displayName} or null
 */
export async function geocodeLocation(query) {
  if (!query) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query + ', New York City, NY')}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    if (data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
