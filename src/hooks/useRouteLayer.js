import { useEffect, useRef } from 'react';
import { calculateCurvedRoute } from '../utils/mapUtils';

export const useRouteLayer = (map, currentShip) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (!map || !currentShip) return;

        map.flyTo({
            center: currentShip.coordinates[0],
            zoom: 4,
            essential: true
        });

        const curved = calculateCurvedRoute(currentShip.coordinates);

        const addRouteLayer = () => {
            if (!map.getSource('route')) {
                map.addSource('route', { type: 'geojson', data: curved });
            }
            if (!map.getLayer('route')) {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 3,
                        'line-dasharray': [0, 2]
                    }
                });
            }

            const animateDashArray = (timestamp) => {
                const newStep = (timestamp / 50) % 2;
                if (map && map.getLayer('route')) {
                    map.setPaintProperty('route', 'line-dasharray-offset', newStep);
                }
                animationRef.current = requestAnimationFrame(animateDashArray);
            };

            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            animationRef.current = requestAnimationFrame(animateDashArray);
        };

        if (map.getSource('route')) {
            map.getSource('route').setData(curved);
        } else {
            if (map.loaded()) {
                addRouteLayer();
            } else {
                map.on('load', addRouteLayer);
            }
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [map, currentShip]);
};
