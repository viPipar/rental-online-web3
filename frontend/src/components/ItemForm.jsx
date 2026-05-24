import { useState } from 'react';
import { Image, Info } from 'lucide-react';
import MapPicker from './MapPicker';
import { CATEGORIES, CITIES, ITEM_CONDITIONS } from '../data/mockItems';
import { listItem } from '../lib/contract';
import './ItemForm.css';

const INIT = {
  title: '',
  category: CATEGORIES[1],
  description: '',
  condition: ITEM_CONDITIONS[0],
  rentPerDay: '',
  collateral: '',
  minDuration: 1,
  maxDuration: 30,
  city: CITIES[1],
  imageUrl: '',
  location: null,
};

export default function ItemForm({ onSubmit }) {
  const [form, setForm] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title       = 'Nama barang wajib diisi';
    if (!form.description.trim())  e.description = 'Deskripsi wajib diisi';
    if (!form.rentPerDay || form.rentPerDay <= 0) e.rentPerDay = 'Harga sewa harus lebih dari 0';
    if (!form.collateral  || form.collateral  <= 0) e.collateral = 'Jaminan harus lebih dari 0';
    if (!form.location)            e.location    = 'Pilih lokasi barang di peta';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        rentPerDay: Number(form.rentPerDay),
        collateral: Number(form.collateral),
        lat: form.location?.lat || '-6.9175',
        lng: form.location?.lng || '107.6191',
        minDuration: Number(form.minDuration),
        maxDuration: Number(form.maxDuration),
      };
      const res = await listItem(payload);
      if (res?.success) {
        setSuccess(true);
        onSubmit({ ...payload, id: res.id });
      } else {
        setErrors({ submit: 'Gagal mendaftarkan barang. Coba lagi.' });
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'Transaksi gagal' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 1500);
      setForm(INIT);
    }
  };

  return (
    <form className="item-form glass-card" onSubmit={handleSubmit} id="add-item-form">
      {/* Basic Info */}
      <div className="form-section">
        <h3 className="form-section-title">📦 Informasi Barang</h3>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="item-title">Nama Barang *</label>
            <input
              id="item-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="Contoh: Kamera Canon EOS M50"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-category">Kategori *</label>
            <select
              id="item-category"
              className="form-input"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="item-description">Deskripsi *</label>
          <textarea
            id="item-description"
            className={`form-input ${errors.description ? 'input-error' : ''}`}
            placeholder="Jelaskan kondisi, kelengkapan, cara penggunaan, dan hal penting lainnya..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="item-condition">Kondisi Barang</label>
            <select
              id="item-condition"
              className="form-input"
              value={form.condition}
              onChange={(e) => set('condition', e.target.value)}
            >
              {ITEM_CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-city">Kota</label>
            <select
              id="item-city"
              className="form-input"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
            >
              {CITIES.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="form-section">
        <h3 className="form-section-title">💰 Harga & Jaminan</h3>
        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label" htmlFor="item-price">Harga Sewa / Hari (IDR) *</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">Rp</span>
              <input
                id="item-price"
                type="number"
                className={`form-input input-with-prefix ${errors.rentPerDay ? 'input-error' : ''}`}
                placeholder="150000"
                value={form.rentPerDay}
                onChange={(e) => set('rentPerDay', e.target.value)}
                min={0}
              />
            </div>
            {errors.rentPerDay && <span className="form-error">{errors.rentPerDay}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-collateral">
              Jaminan (IDR) *
              <span className="label-hint">
                <Info size={12} /> akan dikembalikan
              </span>
            </label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">Rp</span>
              <input
                id="item-collateral"
                type="number"
                className={`form-input input-with-prefix ${errors.collateral ? 'input-error' : ''}`}
                placeholder="1000000"
                value={form.collateral}
                onChange={(e) => set('collateral', e.target.value)}
                min={0}
              />
            </div>
            {errors.collateral && <span className="form-error">{errors.collateral}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Durasi Sewa (hari)</label>
            <div className="form-row-2" style={{ gap: 8 }}>
              <input
                id="item-min-duration"
                type="number"
                className="form-input"
                placeholder="Min"
                value={form.minDuration}
                onChange={(e) => set('minDuration', e.target.value)}
                min={1}
              />
              <input
                id="item-max-duration"
                type="number"
                className="form-input"
                placeholder="Max"
                value={form.maxDuration}
                onChange={(e) => set('maxDuration', e.target.value)}
                min={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo */}
      <div className="form-section">
        <h3 className="form-section-title">🖼️ Foto Barang</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="item-image-url">URL Foto Barang</label>
          <div className="image-url-wrap">
            <input
              id="item-image-url"
              type="url"
              className="form-input"
              placeholder="https://example.com/foto-barang.jpg"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
            />
            {form.imageUrl && (
              <div className="image-preview-wrap">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="image-preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="image-preview-label">Preview</span>
              </div>
            )}
          </div>
          {!form.imageUrl && (
            <div className="image-placeholder">
              <Image size={28} />
              <span>Masukkan URL gambar untuk preview</span>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="form-section">
        <h3 className="form-section-title">📍 Lokasi Barang</h3>
        <p className="form-section-desc">Klik pada peta untuk menentukan titik lokasi barang sewaan kamu.</p>
        <MapPicker value={form.location} onChange={(loc) => set('location', loc)} />
        {errors.location && <span className="form-error">{errors.location}</span>}
      </div>

      {/* Submit */}
      <div className="form-submit-area">
        {success && (
          <div className="form-success">
            ✅ Barang berhasil didaftarkan ke blockchain! Kamu akan diarahkan ke daftar barang.
          </div>
        )}
        <button
          type="submit"
          id="submit-item-btn"
          className={`btn btn-primary btn-lg ${submitting ? 'loading' : ''}`}
          disabled={submitting}
        >
          {submitting ? '⏳ Mendaftarkan ke Blockchain...' : '🚀 Daftarkan Barang ke Blockchain'}
        </button>
      </div>
    </form>
  );
}
