import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define the world bounds to prevent panning into repeated maps
const bounds = [
  [-90, -180], // Southwest corner
  [90, 180]    // Northeast corner
];

const MapView = ({ earthquakes }) => {
    const getIntensityColor = (magnitude) => {
        if (magnitude >= 7) return 'rgba(128, 0, 128,';
        if (magnitude >= 6) return 'rgba(255, 0, 0,';
        if (magnitude >= 4.5) return 'rgba(255, 165, 0,';       // High intensity (Red)
        if (magnitude >= 2.5) return 'rgba(255, 255, 0,';    // Moderate intensity (Orange)
        return 'rgba(0, 255, 0,';                                 // Low intensity (Green)
      };

  return (
    <div className="map-wrapper">
        <MapContainer
          center={[30, 0]}
          zoom={2}
          minZoom={2}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {earthquakes.map(earthquake => {
            const coords = earthquake.geometry.coordinates;
            const magnitude = earthquake.properties.mag;
            const depth = coords[2];
            const baseColor = getIntensityColor(magnitude);
            const center = [coords[1], coords[0]];
            const baseRadius = magnitude * 20000;

            const gradientLayers = [
              { radius: baseRadius, opacity: 0.2 },
              { radius: baseRadius * 0.6, opacity: 0.4 },
              { radius: baseRadius * 0.3, opacity: 0.7 },
            ];

            return (
              <React.Fragment key={earthquake.id}>
                {gradientLayers.map((layer, index) => (
                  <Circle
                    key={index}
                    center={center}
                    radius={layer.radius}
                    pathOptions={{
                      fillColor: `${baseColor} ${layer.opacity})`,
                      fillOpacity: 1,
                      stroke: false,
                    }}
                  >
                    {index === gradientLayers.length - 1 && (
                      <Popup>
                        <b>{earthquake.properties.place}</b><br />
                        Magnitude: {magnitude}<br />
                        Depth: {depth} km<br />
                        Time: {new Date(earthquake.properties.time).toLocaleString()}
                      </Popup>
                    )}
                  </Circle>
                ))}
              </React.Fragment>
            );
          })}
        </MapContainer>
    </div>
  );
};

export default MapView;