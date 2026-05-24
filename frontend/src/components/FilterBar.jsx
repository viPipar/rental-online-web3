import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockItems';
import './FilterBar.css';

export default function FilterBar({ filters, onChange }) {
  const handle = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="filter-bar glass-card">
      {/* Search */}
      <div className="filter-search">
        <Search size={16} className="filter-search-icon" />
        <input
          id="search-input"
          type="text"
          placeholder="Cari nama barang..."
          className="filter-search-input"
          value={filters.search}
          onChange={(e) => handle('search', e.target.value)}
        />
      </div>

      <div className="filter-divider" />

      {/* Category */}
      <div className="filter-select-wrap">
        <SlidersHorizontal size={15} className="filter-icon" />
        <select
          id="filter-category"
          className="filter-select"
          value={filters.category}
          onChange={(e) => handle('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronDown size={14} className="filter-chevron" />
      </div>

      {/* City */}
      <div className="filter-select-wrap">
        <select
          id="filter-city"
          className="filter-select"
          value={filters.city}
          onChange={(e) => handle('city', e.target.value)}
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronDown size={14} className="filter-chevron" />
      </div>

      {/* Price Range */}
      <div className="filter-price">
        <input
          id="filter-price-min"
          type="number"
          placeholder="Min/hari"
          className="filter-price-input"
          value={filters.minPrice}
          onChange={(e) => handle('minPrice', e.target.value)}
          min={0}
        />
        <span className="filter-price-sep">—</span>
        <input
          id="filter-price-max"
          type="number"
          placeholder="Max/hari"
          className="filter-price-input"
          value={filters.maxPrice}
          onChange={(e) => handle('maxPrice', e.target.value)}
          min={0}
        />
      </div>

      {/* Available only toggle */}
      <label className="filter-toggle" htmlFor="filter-available">
        <div className={`toggle-track ${filters.availableOnly ? 'active' : ''}`}>
          <div className="toggle-thumb" />
        </div>
        <input
          id="filter-available"
          type="checkbox"
          className="toggle-input"
          checked={filters.availableOnly}
          onChange={(e) => handle('availableOnly', e.target.checked)}
        />
        <span>Tersedia saja</span>
      </label>

      {/* Reset */}
      {(filters.search || filters.category !== 'Semua' || filters.city !== 'Semua Kota' || filters.availableOnly) && (
        <button
          id="reset-filter-btn"
          className="btn btn-ghost btn-sm filter-reset"
          onClick={() => onChange({ search: '', category: 'Semua', city: 'Semua Kota', minPrice: '', maxPrice: '', availableOnly: false })}
        >
          Reset
        </button>
      )}
    </div>
  );
}
