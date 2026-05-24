import { Star, MapPin, Clock, Shield } from 'lucide-react';
import { formatIDR } from '../data/mockItems';
import './ItemCard.css';

export default function ItemCard({ item, onClick }) {
  const availability = item.isAvailable;

  return (
    <div
      id={`item-card-${item.id}`}
      className="item-card glass-card"
      onClick={() => onClick && onClick(item)}
    >
      {/* Image */}
      <div className="item-card-img-wrap">
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
          alt={item.title}
          className="item-card-img"
          loading="lazy"
        />
        <div className={`item-card-availability ${availability ? 'available' : 'unavailable'}`}>
          <span className={`badge ${availability ? 'badge-available' : 'badge-rented'}`}>
            <span className="badge-dot" />
            {availability ? 'Tersedia' : 'Disewa'}
          </span>
        </div>
        <div className="item-card-category">{item.category}</div>
      </div>

      {/* Content */}
      <div className="item-card-content">
        <h3 className="item-card-title">{item.title}</h3>

        <div className="item-card-meta">
          <span className="item-card-meta-item">
            <MapPin size={13} />
            {item.city}
          </span>
          <span className="item-card-meta-item">
            <Star size={13} className="star-icon" />
            {item.rating} ({item.reviewCount})
          </span>
        </div>

        <p className="item-card-desc">{item.description}</p>

        <div className="item-card-footer">
          <div className="item-card-price">
            <span className="price-amount">{formatIDR(item.rentPerDay)}</span>
            <span className="price-unit">/ hari</span>
          </div>
          <div className="item-card-collateral">
            <Shield size={12} />
            <span>Jaminan {formatIDR(item.collateral)}</span>
          </div>
        </div>

        <button
          className={`btn item-card-btn ${availability ? 'btn-primary' : 'btn btn-secondary'}`}
          disabled={!availability}
          onClick={(e) => { e.stopPropagation(); onClick && onClick(item); }}
          aria-label={availability ? `Lihat detail dan sewa ${item.title}` : `${item.title} sedang disewa`}
        >
          {availability ? 'Lihat Detail & Sewa' : 'Sedang Disewa'}
        </button>
      </div>
    </div>
  );
}
