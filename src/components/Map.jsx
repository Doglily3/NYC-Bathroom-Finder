import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function Map({ bathrooms, center, zoom, onBathroomClick, selectedBathroom, userLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView(center, zoom);

    // Use CartoDB Voyager for a modern, clean look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update bathroom markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icons for different types
    const createIcon = (type, isSelected) => {
      const colors = {
        public: isSelected ? '#1e40af' : '#3b82f6',
        park: isSelected ? '#047857' : '#10b981',
        apt: isSelected ? '#6d28d9' : '#8b5cf6'
      };

      const size = isSelected ? 32 : 28;

      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              background: linear-gradient(135deg, ${colors[type]} 0%, ${colors[type]}dd 100%);
              width: ${size}px;
              height: ${size}px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              ${isSelected ? 'animation: pulse 1.5s ease-in-out infinite;' : ''}
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -60%);
              color: white;
              font-size: ${size > 28 ? '14px' : '12px'};
              font-weight: bold;
              z-index: 1;
              text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            ">🚻</div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
      });
    };

    // Add markers for each bathroom
    bathrooms.forEach(bathroom => {
      const isSelected = selectedBathroom?.id === bathroom.id;
      const icon = createIcon(bathroom.type, isSelected);

      const marker = L.marker([bathroom.latitude, bathroom.longitude], { icon })
        .addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${bathroom.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${bathroom.address}</p>
          <p style="font-size: 12px; margin-bottom: 4px;">
            <strong>Hours:</strong> ${bathroom.hours}
          </p>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px;">
            ${bathroom.isAccessible ? '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px;">♿ Accessible</span>' : ''}
            ${bathroom.isOpen ? '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px;">✓ Open</span>' : '<span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 11px;">✗ Closed</span>'}
            ${bathroom.distance ? `<span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 11px;">📍 ${bathroom.distance.toFixed(2)} mi</span>` : ''}
          </div>
          <div style="margin-top: 8px; font-size: 12px;">
            <span style="color: #f59e0b;">★</span> ${bathroom.rating.toFixed(1)}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onBathroomClick(bathroom);
      });

      markersRef.current.push(marker);
    });
  }, [bathrooms, selectedBathroom, onBathroomClick]);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add new user marker if location exists
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 0 0 2px #ef4444, 0 4px 12px rgba(0,0,0,0.3);
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 12px;
              z-index: 1;
              font-weight: bold;
            ">📍</div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<strong>Your Location</strong>');
    }
  }, [userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}

export default Map;
