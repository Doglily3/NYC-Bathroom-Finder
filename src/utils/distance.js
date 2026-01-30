/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Add distance property to each bathroom based on user location
 * @param {Array} bathrooms - Array of bathroom objects
 * @param {Object} userLocation - User's location {lat, lng}
 * @returns {Array} Bathrooms with distance property
 */
export function addDistanceToBathrooms(bathrooms, userLocation) {
  if (!userLocation) return bathrooms;

  return bathrooms.map(bathroom => ({
    ...bathroom,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      bathroom.latitude,
      bathroom.longitude
    )
  }));
}
