import { useEffect, useRef, useState } from 'react';
import { MAPBOX_TOKEN } from '../data/mockData';

export const useMapbox = (currentShip) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapboxLoaded, setMapboxLoaded] = useState(false);

    // Lazy load Mapbox GL JS
    useEffect(() => {
        if (!mapboxLoaded) {
            const link = document.createElement('link');
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
            script.onload = () => setMapboxLoaded(true);
            document.body.appendChild(script);
        }
    }, [mapboxLoaded]);

    // Initialize map
    useEffect(() => {
        if (!mapboxLoaded || !mapContainerRef.current) return;
        if (MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') return;

        window.mapboxgl.accessToken = MAPBOX_TOKEN;

        if (!mapInstanceRef.current) {
            const map = new window.mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: currentShip ? currentShip.coordinates[0] : [0, 20],
                zoom: currentShip ? 4 : 1.5,
                attributionControl: false,
                renderWorldCopies: true,
                preserveDrawingBuffer: false,
                maxTileCacheSize: 500,
                transformRequest: (url, resourceType) => {
                    if (resourceType === 'Tile') {
                        return { url, headers: { 'Cache-Control': 'max-age=3600' } };
                    }
                }
            });
            mapInstanceRef.current = map;

            map.on('load', () => {
                if (map.getLayer('water')) {
                    map.setPaintProperty('water', 'fill-color', '#90CAF9');
                }
            });
        }
    }, [mapboxLoaded, currentShip]);

    return { map: mapInstanceRef.current, mapContainerRef, mapboxLoaded };
};
