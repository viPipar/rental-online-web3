import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';
import { formatIDR } from '../data/mockItems';
import './MapView.css';

// Custom colored marker icon
function createPinIcon(available) {
  const color = available ? '#8b5cf6' : '#f59e0b';
  const html = `
    <div style="
      width:36px; height:36px; border-radius:50% 50% 50% 0;
      background:${color}; transform:rotate(-45deg);
      border:3px solid rgba(255,255,255,0.3);
      box-shadow:0 4px 14px rgba(0,0,0,0.5), 0 0 10px ${color}88;
      display:flex; align-items:center; justify-content:center;
    ">
      <div style="transform:rotate(45deg); color:white; font-size:14px;">📍</div>
    </div>`;
  return divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -38] });
}

export default function MapView({ items, onItemClick }) {
  const center = [-6.9, 108.5]; // Centering on Java Island

  return (
    <div className="map-view-wrap">
      <MapContainer
        center={center}
        zoom={7}
        className="map-container"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {items.map((item) => (
          <Marker
            key={item.id}
            position={[parseFloat(item.lat), parseFloat(item.lng)]}
            icon={createPinIcon(item.isAvailable)}
          >
            <Popup>
              <div className="map-popup">
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="map-popup-img"
                />
                <div className="map-popup-body">
                  <div className="map-popup-category">{item.category}</div>
                  <h4 className="map-popup-title">{item.title}</h4>
                  <div className="map-popup-price">{formatIDR(item.rentPerDay)}<span>/hari</span></div>
                  <span className={`badge ${item.isAvailable ? 'badge-available' : 'badge-rented'}`}>
                    {item.isAvailable ? 'Tersedia' : 'Disewa'}
                  </span>
                  {item.isAvailable && (
                    <button
                      className="btn btn-primary btn-sm map-popup-btn"
                      onClick={() => onItemClick && onItemClick(item)}
                    >
                      Lihat Detail
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#8b5cf6' }} />
          <span>Tersedia</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#f59e0b' }} />
          <span>Sedang Disewa</span>
        </div>
        <div className="legend-count">{items.length} barang ditemukan</div>
      </div>
    </div>
  );
}
