import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useMapbox } from '../hooks/useMapbox';
import { useRouteLayer } from '../hooks/useRouteLayer';
import { useMapMarkers } from '../hooks/useMapMarkers';
import { calculateRouteMidpoint } from '../utils/mapUtils';

const MapBackground = () => {
  const { currentShipId, users, ships, setSelectedUser, setOpenModal, profile, mapViewAction, setHoveredUser, setHoveredCrew, setSelectedPort } = useAppContext();

  const currentShip = ships.find(s => s.id === currentShipId);
  const shipUsers = users.filter(u => u.shipId === currentShipId);

  // Initialize Map
  const { map, mapContainerRef, mapboxLoaded } = useMapbox(currentShip);

  // Handle Route Layer
  useRouteLayer(map, currentShip);

  // Handle Markers
  useMapMarkers(map, currentShip, users, profile, setHoveredUser, setSelectedUser, setOpenModal, setHoveredCrew, setSelectedPort);

  // Handle Map Actions (Zoom/Focus)
  useEffect(() => {
    if (!mapViewAction || !map) return;

    if (mapViewAction.type === 'FOCUS_ALL') {
      // Calculate the "at sea" midpoint
      const midpoint = calculateRouteMidpoint(currentShip.coordinates);

      if (midpoint) {
        map.flyTo({
          center: midpoint,
          zoom: 6,
          essential: true,
          speed: 1.5
        });
      } else if (profile && profile.lat && profile.lng) {
        // Fallback to profile if no route
        map.flyTo({
          center: [profile.lng, profile.lat],
          zoom: 6,
          essential: true,
          speed: 1.5
        });
      }
    }
  }, [mapViewAction, profile, shipUsers, map, currentShip]);

  // Zoom to route midpoint when profile/ship is loaded
  useEffect(() => {
    if (!map || !currentShip || !currentShip.coordinates) return;

    // Calculate the "at sea" midpoint where the ship and user are pinned
    const midpoint = calculateRouteMidpoint(currentShip.coordinates);

    if (midpoint) {
      setTimeout(() => {
        map.flyTo({
          center: midpoint,
          zoom: 6, // Good zoom level to see the ship and some context
          essential: true,
          duration: 2000
        });
      }, 500);
    }
  }, [currentShip, map]);

  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-slate-100">
      {!mapboxLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, transparent 20%, rgba(30, 58, 138, 0.15) 100%),
            radial-gradient(circle at 85% 30%, transparent 20%, rgba(30, 58, 138, 0.2) 100%),
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(15, 23, 42, 0.1) 100%)
          `
        }}
      />
    </div>
  );
};

export default MapBackground;

