import { useState } from 'react';
import { MapPin, Star, Shield, Calendar, ChevronLeft, ChevronRight, X, User, Tag, Truck, Clock, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { formatIDR } from '../data/mockItems';
import { rentItem } from '../lib/contract';
import './ItemDetail.css';

const pinIcon = divIcon({
  html: `<div style="font-size:24px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5))">📍</div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

export default function ItemDetail({ item, onClose, onRentSuccess }) {
  const [imgIdx, setImgIdx]  = useState(0);
  const [duration, setDuration] = useState(item.minDuration || 1);
  const [courier, setCourier] = useState('');
  const [renting, setRenting] = useState(false);
  const [rented, setRented]   = useState(false);
  const [rentError, setRentError] = useState(null);
  const [rentalId, setRentalId] = useState(null);

  const images = item.images || [];
  const totalRent = item.rentPerDay * duration;
  const totalCost = totalRent + item.collateral;

  const handleRent = async () => {
    if (!courier.trim()) {
      setRentError('Alamat wallet kurir wajib diisi.');
      return;
    }

    setRentError(null);
    setRenting(true);

    try {
      const response = await rentItem({
        itemId: item.id,
        courier: courier.trim(),
        duration,
      });
      if (response?.success) {
        setRentalId(response.rentalId);
        setRented(true);
        onRentSuccess?.();
      } else {
        setRentError('Gagal memproses transaksi sewa. Coba lagi.');
      }
    } catch (err) {
      setRentError(err?.message || 'Terjadi kesalahan saat menyewa.');
    } finally {
      setRenting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="detail-title">
        {/* Close */}
        <button className="modal-close" onClick={onClose} id="modal-close-btn" aria-label="Tutup dialog">
          <X size={20} />
        </button>

        <div className="modal-body">
          {/* Left — Image & Map */}
          <div className="modal-left">
            {/* Gallery */}
            <div className="gallery">
              <img
                src={images[imgIdx] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'}
                alt={item.title}
                className="gallery-main"
              />
              {images.length > 1 && (
                <>
                  <button className="gallery-nav gallery-prev" onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}>
                    <ChevronLeft size={18} />
                  </button>
                  <button className="gallery-nav gallery-next" onClick={() => setImgIdx((i) => (i + 1) % images.length)}>
                    <ChevronRight size={18} />
                  </button>
                  <div className="gallery-dots">
                    {images.map((_, i) => (
                      <button key={i} className={`gallery-dot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                    ))}
                  </div>
                </>
              )}
              <div className="gallery-category">{item.category}</div>
            </div>

            {/* Mini Map */}
            <div className="detail-map-wrap">
              <p className="detail-map-label"><MapPin size={13} /> Lokasi Barang</p>
              <div className="detail-map">
                <MapContainer
                  center={[parseFloat(item.lat), parseFloat(item.lng)]}
                  zoom={14}
                  className="mini-map"
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[parseFloat(item.lat), parseFloat(item.lng)]} icon={pinIcon} />
                </MapContainer>
              </div>
              <p className="detail-map-city"><MapPin size={12} /> {item.city} · {item.lat}, {item.lng}</p>
            </div>
          </div>

          {/* Right — Details & Form */}
          <div className="modal-right">
            {/* Header info */}
            <div className="detail-header">
              <div className="detail-meta-top">
                <span className={`badge ${item.isAvailable ? 'badge-available' : 'badge-rented'}`}>
                  {item.isAvailable ? '● Tersedia' : '● Sedang Disewa'}
                </span>
                <span className="detail-condition">
                  <Tag size={12} /> {item.condition}
                </span>
              </div>
              <h2 className="detail-title" id="detail-title">{item.title}</h2>

              <div className="detail-rating">
                <Star size={15} className="star-fill" />
                <strong>{item.rating}</strong>
                <span>({item.reviewCount} ulasan)</span>
              </div>

              <div className="detail-owner">
                <div className="detail-owner-avatar">
                  <User size={16} />
                </div>
                <div>
                  <p className="detail-owner-label">Pemilik</p>
                  <p className="detail-owner-name">{item.ownerName}</p>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Description */}
            <div className="detail-section">
              <h4 className="detail-section-label">Deskripsi</h4>
              <p className="detail-desc">{item.description}</p>
            </div>

            {/* Info grid */}
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <Clock size={14} />
                <div>
                  <span className="info-label">Min Sewa</span>
                  <span className="info-val">{item.minDuration} hari</span>
                </div>
              </div>
              <div className="detail-info-item">
                <Calendar size={14} />
                <div>
                  <span className="info-label">Max Sewa</span>
                  <span className="info-val">{item.maxDuration} hari</span>
                </div>
              </div>
              <div className="detail-info-item">
                <Truck size={14} />
                <div>
                  <span className="info-label">Pengiriman</span>
                  <span className="info-val">Kurir P2P</span>
                </div>
              </div>
              <div className="detail-info-item">
                <CheckCircle size={14} />
                <div>
                  <span className="info-label">Kondisi</span>
                  <span className="info-val">{item.condition}</span>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Rent Form */}
            {item.isAvailable && !rented && (
              <div className="rent-form">
                <h4 className="detail-section-label">Form Penyewaan</h4>

                <div className="form-group">
                  <label className="form-label">Durasi Sewa (hari)</label>
                  <div className="duration-picker">
                    <button
                      className="duration-btn"
                      onClick={() => setDuration((d) => Math.max(item.minDuration, d - 1))}
                    >−</button>
                    <span className="duration-value">{duration} hari</span>
                    <button
                      className="duration-btn"
                      onClick={() => setDuration((d) => Math.min(item.maxDuration, d + 1))}
                    >+</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="courier-input">Alamat Wallet Kurir</label>
                  <input
                    id="courier-input"
                    type="text"
                    className="form-input"
                    placeholder="G... (Stellar address kurir)"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                  />
                </div>

                {/* Cost breakdown */}
                <div className="cost-breakdown glass-card">
                  <div className="cost-row">
                    <span>Sewa {formatIDR(item.rentPerDay)} × {duration} hari</span>
                    <span>{formatIDR(totalRent)}</span>
                  </div>
                  <div className="cost-row cost-collateral-row">
                    <span>
                      <Shield size={13} /> Jaminan (kembali selesai sewa)
                    </span>
                    <span>{formatIDR(item.collateral)}</span>
                  </div>
                  <div className="cost-total">
                    <span>Total Dana Dikunci</span>
                    <span className="cost-total-val">{formatIDR(totalCost)}</span>
                  </div>
                </div>

                <button
                  id="rent-now-btn"
                  className={`btn btn-primary btn-lg rent-submit ${renting ? 'loading' : ''}`}
                  onClick={handleRent}
                  disabled={renting}
                >
                  {renting ? (
                    <>⏳ Menandatangani transaksi...</>
                  ) : (
                    <>🔐 Sewa Sekarang · {formatIDR(totalCost)}</>
                  )}
                </button>
                {rentError && <p className="form-error">{rentError}</p>}
                <p className="rent-disclaimer">
                  Dana akan dikunci di smart contract Stellar Soroban dan hanya dilepas saat transaksi selesai.
                </p>
              </div>
            )}

            {/* Success state */}
            {rented && (
              <div className="rent-success">
                <div className="rent-success-icon">✅</div>
                <h3>Berhasil Disewa!</h3>
                <p>Transaksi tercatat di blockchain. Kurir akan segera menghubungi pemilik barang.</p>
                <div className="rent-success-id">
                  Rental ID: <code>#{rentalId || 'RTX-' + (Math.floor(Math.random() * 9000) + 1000)}</code>
                </div>
              </div>
            )}

            {/* Unavailable */}
            {!item.isAvailable && (
              <div className="unavailable-notice">
                <span>⏳</span>
                <div>
                  <strong>Barang Sedang Disewa</strong>
                  <p>Barang ini saat ini sedang dalam masa penyewaan. Cek lagi nanti atau cari barang serupa.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
