import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapGarage {
  garage_id: number;
  garage_name: string;
  description: string;
  lat: number;
  lng: number;
  province: string;
  district: string;
  address: string;
  profile_picture: string | null;
  service_type: string;
}

const defaultCenter = { lat: 6.9271, lng: 79.8612 };

const GarageMap: React.FC<{ garages: MapGarage[] }> = ({ garages }) => {
  return (
    <MapContainer className="pt-20 relative z-0" center={defaultCenter} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {garages.map(g => {
        if (!g.lat || !g.lng) return null;
        const icon = L.divIcon({
          className: '',
          iconSize: [80, 80],
          iconAnchor: [40, 80],
          popupAnchor: [0, -80],
          html: `
            <div class="flex flex-col items-center text-center">
              <div class="rounded-full overflow-hidden w-12 h-12 border-2 border-white shadow">
                <img src="${g.profile_picture || 'https://via.placeholder.com/48'}" class="w-full h-full object-cover"/>
              </div>
              <div class="text-xs bg-white px-2 py-0.5 mt-1 rounded shadow max-w-[80px] truncate text-black">
                ${g.garage_name}
              </div>
            </div>
          `,
        });
        return (
          <Marker key={g.garage_id} position={[g.lat, g.lng]} icon={icon}>
            <Popup>
              <strong>{g.garage_name}</strong><br />
              {g.description}<br />
              <em>{g.province}, {g.district}</em><br />
              {g.address}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default GarageMap;
