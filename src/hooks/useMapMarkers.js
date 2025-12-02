import { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import { createPortMarkerElement, createProfileMarkerElement, createShipMarkerElement, calculateCurvedRoute } from '../utils/mapUtils';

export const useMapMarkers = (map, currentShip, users, profile, setHoveredUser, setSelectedUser, setOpenModal, setHoveredCrew, setSelectedPort) => {
    const markersRef = useRef([]);

    useEffect(() => {
        if (!map || !currentShip) return;

        // Clear existing markers tracked by ref
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add Port Markers
        if (currentShip.coordinates) {
            currentShip.coordinates.forEach((coord, index) => {
                const portName = currentShip.ports && currentShip.ports[index] ? currentShip.ports[index].name : null;
                const el = createPortMarkerElement(index, portName);

                el.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent map click
                    if (currentShip.ports && currentShip.ports[index]) {
                        setSelectedPort(currentShip.ports[index]);
                    }
                });

                const marker = new window.mapboxgl.Marker(el).setLngLat(coord).addTo(map);
                markersRef.current.push(marker);
            });
        }

        // Calculate route positions
        let shipPos = null;
        let profilePos = null;

        if (currentShip.coordinates) {
            const curved = calculateCurvedRoute(currentShip.coordinates);
            if (curved) {
                const length = turf.length(curved);

                // Find a point on the route that is furthest from any port
                let bestT = 0.5;
                let maxMinDistance = -1;

                // Sample points from 30% to 70%
                for (let t = 0.3; t <= 0.7; t += 0.05) {
                    const candidate = turf.along(curved, length * t);

                    // Find distance to nearest port
                    let minDistanceToPort = Infinity;
                    currentShip.coordinates.forEach(portCoord => {
                        const dist = turf.distance(candidate, turf.point(portCoord));
                        if (dist < minDistanceToPort) minDistanceToPort = dist;
                    });

                    if (minDistanceToPort > maxMinDistance) {
                        maxMinDistance = minDistanceToPort;
                        bestT = t;
                    }
                }

                // Place markers slightly apart along the route
                const separation = 0.04;
                shipPos = turf.along(curved, length * (bestT - separation)).geometry.coordinates;
                profilePos = turf.along(curved, length * (bestT + separation)).geometry.coordinates;

            } else if (currentShip.coordinates.length > 0) {
                // Fallback for straight lines
                const lats = currentShip.coordinates.map(c => c[1]);
                const lngs = currentShip.coordinates.map(c => c[0]);
                const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
                const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;

                shipPos = [avgLng - 0.5, avgLat];
                profilePos = [avgLng + 0.5, avgLat];
            }
        }

        // Add User Profile Marker
        if (profile && profilePos) {
            const el = createProfileMarkerElement(profile);
            const marker = new window.mapboxgl.Marker({ element: el }).setLngLat(profilePos).addTo(map);
            markersRef.current.push(marker);
        }

        const shipUsers = users.filter(u => u.shipId === currentShip.id);

        if (shipUsers.length > 0 && shipPos) {
            // Aggregate departments
            const departments = {};
            shipUsers.forEach(u => {
                const dept = u.department || 'General';
                departments[dept] = (departments[dept] || 0) + 1;
            });

            const el = createShipMarkerElement(shipUsers.length);

            el.addEventListener('mouseenter', (e) => {
                const rect = el.getBoundingClientRect();
                setHoveredCrew({
                    departments,
                    totalUsers: shipUsers.length,
                    position: {
                        x: rect.left + rect.width / 2,
                        y: rect.top
                    }
                });
            });

            el.addEventListener('mouseleave', () => {
                setHoveredCrew(null);
            });

            el.addEventListener('click', () => {
                setSelectedUser(null);
                setOpenModal('chat');
                setHoveredCrew(null); // Close hover card
            });

            const marker = new window.mapboxgl.Marker({ element: el }).setLngLat(shipPos).addTo(map);
            markersRef.current.push(marker);
        }

    }, [map, currentShip, users, profile]); // Removed setters to prevent re-runs on hover
};
