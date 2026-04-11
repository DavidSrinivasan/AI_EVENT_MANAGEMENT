import React, { useEffect, useRef } from 'react';

// FREE map using Leaflet + OpenStreetMap
// No API key needed! No credit card! Free forever!

function EventMap({ lat = 1.3521, lng = 103.8198, venueName = "Event Venue" }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS then init map
        if (!window.L) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else {
            initMap();
        }

        function initMap() {
            if (mapInstanceRef.current) return; // already initialized

            const map = window.L.map(mapRef.current).setView([lat, lng], 15);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add marker
            window.L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${venueName}</b>`)
                .openPopup();

            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, venueName]);

    return (
        <div
            ref={mapRef}
            style={{
                height: '400px',
                width: '100%',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
            }}
        />
    );
}

export default EventMap;
