import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet marker icon issues in Vite/React
delete L.Icon.Default.prototype._getIconUrl;

const greenEcoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const truckTransportIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const buyerPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically re-center map
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({
  center = [13.0827, 80.2707], // Default Chennai, TN
  zoom = 11,
  markers = [],
  routePoints = [],
  height = "380px",
  onSelectLocation = null
}) => {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={zoom} />
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ECO MART India'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display route polyline if tracking */}
        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#059669"
            weight={4}
            dashArray="8, 8"
          />
        )}

        {/* Display Map Markers */}
        {markers.map((marker, index) => {
          let icon = greenEcoIcon;
          if (marker.type === 'transport') icon = truckTransportIcon;
          if (marker.type === 'buyer') icon = buyerPinIcon;

          return (
            <Marker
              key={marker.id || index}
              position={[marker.lat, marker.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectLocation && onSelectLocation(marker)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2 max-w-xs">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                    marker.type === 'transport' ? 'bg-purple-100 text-purple-800' :
                    marker.type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {marker.typeLabel || 'Eco Listing'}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{marker.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{marker.location || marker.address}</p>
                  {marker.price && (
                    <p className="text-xs font-extrabold text-emerald-700 mt-1">₹{marker.price.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
