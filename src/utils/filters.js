/**
 * Check if bathroom is currently open based on hours
 * @param {string} hours - Hours string (e.g., "24/7", "9am-5pm")
 * @returns {boolean} Whether bathroom is currently open
 */
export function isCurrentlyOpen(hours) {
  if (!hours) return false;

  // Handle 24/7 cases
  if (hours.toLowerCase().includes('24') || hours.toLowerCase().includes('24/7')) {
    return true;
  }

  // For other cases, we'll need to parse the hours
  // For now, default to true (will be enhanced with actual parsing)
  return true;
}

/**
 * Filter and sort bathrooms for urgent mode
 * Priority: Open > Near > Accessible
 * @param {Array} bathrooms - Array of bathroom objects with distance
 * @param {Object} userLocation - User's location
 * @returns {Array} Sorted bathrooms
 */
export function urgentSort(bathrooms, userLocation) {
  if (!userLocation || !bathrooms.length) return bathrooms;

  // First, filter to only open bathrooms
  const openBathrooms = bathrooms.filter(b => b.isOpen);

  // Sort by: accessible first (bonus), then by distance
  return openBathrooms.sort((a, b) => {
    // Accessible bathrooms get priority
    if (a.isAccessible && !b.isAccessible) return -1;
    if (!a.isAccessible && b.isAccessible) return 1;

    // Then sort by distance
    return (a.distance || 0) - (b.distance || 0);
  });
}

/**
 * Apply all active filters to bathroom list
 * @param {Array} bathrooms - Array of bathroom objects
 * @param {Object} filters - Filter settings
 * @returns {Array} Filtered bathrooms
 */
export function applyFilters(bathrooms, filters) {
  let filtered = [...bathrooms];

  // Filter by open status
  if (filters.openNow) {
    filtered = filtered.filter(b => b.isOpen);
  }

  // Filter by accessibility
  if (filters.accessibleOnly) {
    filtered = filtered.filter(b => b.isAccessible);
  }

  // Filter by distance
  if (filters.maxDistance && filters.maxDistance > 0) {
    filtered = filtered.filter(b => !b.distance || b.distance <= filters.maxDistance);
  }

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(b => b.type === filters.type);
  }

  return filtered;
}
