import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import './MapPicker.css';

const pinIcon = divIcon({
  html: `<div class="map-picker-pin">📍</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    },
  });
  return null;
}

export default function MapPicker({ value, onChange }) {
  const center = value
    ? [parseFloat(value.lat), parseFloat(value.lng)]
    : [-6.9175, 107.6191]; // Default: Bandung

  return (
    <div className="map-picker-wrap">
      <div className="map-picker-hint">
        <Navigation size={14} />
        Klik pada peta untuk memilih lokasi barang
      </div>
      <div className="map-picker-container">
        <MapContainer center={center} zoom={12} className="map-picker-map" scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onPick={onChange} />
          {value && (
            <Marker position={[parseFloat(value.lat), parseFloat(value.lng)]} icon={pinIcon} />
          )}
        </MapContainer>
      </div>
      {value && (
        <div className="map-picker-coords">
          <span>📍</span>
          <code>{value.lat}, {value.lng}</code>
        </div>
      )}
    </div>
  );
}
