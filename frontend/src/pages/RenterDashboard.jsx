import { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Map, History, ChevronRight, PackageX } from 'lucide-react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import ItemCard from '../components/ItemCard';
import MapView from '../components/MapView';
import RentalTracker from '../components/RentalTracker';
import ItemDetail from './ItemDetail';
import { formatIDR, getStatusLabel } from '../data/mockItems';
import { getCatalog, getMyRentals } from '../lib/contract';
import './RenterDashboard.css';

const TABS = [
  { id: 'catalog', label: 'Katalog Barang', icon: LayoutGrid },
  { id: 'map',     label: 'Peta Lokasi',    icon: Map },
  { id: 'rentals', label: 'Penyewaan Saya', icon: History },
];

const DEFAULT_FILTERS = {
  search: '',
  category: 'Semua',
  city: 'Semua Kota',
  minPrice: '',
  maxPrice: '',
  availableOnly: false,
};

export default function RenterDashboard() {
  const [tab, setTab]         = useState('catalog');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null); // Item for detail modal
  const [items, setItems] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [rentals, setRentals] = useState([]);

  const loadRentals = async () => {
    try {
      const r = await getMyRentals();
      setRentals(r);
    } catch (e) {
      console.error('Failed to load rentals', e);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadRentals();
    })();
    return () => { mounted = false };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'Semua' && item.category !== filters.category) return false;
      if (filters.city !== 'Semua Kota' && item.city !== filters.city) return false;
      if (filters.minPrice && item.rentPerDay < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.rentPerDay > Number(filters.maxPrice)) return false;
      if (filters.availableOnly && !item.isAvailable) return false;
      return true;
    });
  }, [filters]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCatalog(true);
      try {
        const data = await getCatalog();
        if (mounted) setItems(data);
      } catch (e) {
        console.error('Gagal memuat katalog', e);
      } finally {
        if (mounted) setLoadingCatalog(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const activeCount    = filtered.filter((i) => i.isAvailable).length;
  const unavailCount   = filtered.filter((i) => !i.isAvailable).length;

  const handleRentSuccess = async () => {
    await Promise.all([getCatalog().then(setItems), loadRentals()]);
  };

  return (
    <div className="renter-page page-wrapper">
      <Navbar />

      <div className="renter-container container">
        {/* Page Header */}
        <div className="renter-header">
          <div>
            <h1 className="renter-title">Temukan Barang Sewa</h1>
            <p className="renter-subtitle">
              {loadingCatalog ? (
                <>Memuat katalog... <span className="text-muted">Harap tunggu</span></>
              ) : (
                <>
                  {filtered.length} barang ditemukan ·{' '}
                  <span className="text-green">{activeCount} tersedia</span>
                  {unavailCount > 0 && <span className="text-muted"> · {unavailCount} sedang disewa</span>}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="renter-tabs">
              {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`tab-${id}`}
              className={`renter-tab ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={15} />
              {label}
              {id === 'rentals' && rentals.length > 0 && (
                <span className="tab-badge">{rentals.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Filter Bar — shown on catalog & map tabs */}
        {tab !== 'rentals' && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}

        {/* ── Catalog Tab ── */}
        {tab === 'catalog' && (
          <>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <PackageX size={48} />
                <h3>Tidak ada barang ditemukan</h3>
                <p>Coba ubah filter pencarianmu.</p>
                <button className="btn btn-secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="items-grid">
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={setSelected} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Map Tab ── */}
        {tab === 'map' && (
          <MapView items={filtered} onItemClick={setSelected} />
        )}

        {/* ── My Rentals Tab ── */}
        {tab === 'rentals' && (
          <div className="rentals-list">
            {rentals.length === 0 ? (
              <div className="empty-state">
                <History size={48} />
                <h3>Belum ada riwayat penyewaan</h3>
                <p>Mulai sewa barang dari katalog untuk melihat riwayat di sini.</p>
                <button className="btn btn-primary" onClick={() => setTab('catalog')}>
                  Lihat Katalog
                </button>
              </div>
            ) : (
              rentals.map((rental) => {
                const status = getStatusLabel(rental.status);
                return (
                  <div key={rental.id} className="rental-card glass-card">
                    <div className="rental-card-header">
                      <div className="rental-card-img-wrap">
                        <img
                          src={rental.item.images?.[0]}
                          alt={rental.item.title}
                          className="rental-card-img"
                        />
                      </div>
                      <div className="rental-card-info">
                        <div className="rental-card-top">
                          <h3 className="rental-card-title">{rental.item.title}</h3>
                          <span className={`badge ${status.class}`}>{status.label}</span>
                        </div>
                        <div className="rental-meta-row">
                          <span>📅 {rental.startDate} → {rental.endDate}</span>
                          <span>⏱ {rental.duration} hari</span>
                          <span>🚴 {rental.courierName}</span>
                        </div>
                        <div className="rental-cost-row">
                          <div className="rental-cost-item">
                            <span className="cost-label">Biaya Sewa</span>
                            <span className="cost-value">{formatIDR(rental.totalRent)}</span>
                          </div>
                          <div className="rental-cost-item">
                            <span className="cost-label">Jaminan (akan kembali)</span>
                            <span className="cost-value cost-collateral">{formatIDR(rental.collateralLocked)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracker */}
                    {rental.status !== 'Completed' && (
                      <div className="rental-tracker-wrap">
                        <p className="rental-tracker-label">Status Pengiriman</p>
                        <RentalTracker status={rental.status} />
                      </div>
                    )}

                    {rental.status === 'Completed' && (
                      <div className="rental-completed-notice">
                        ✅ Transaksi selesai. Jaminan sebesar {formatIDR(rental.collateralLocked)} sudah dikembalikan ke wallet kamu.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selected && (
        <ItemDetail item={selected} onClose={() => setSelected(null)} onRentSuccess={handleRentSuccess} />
      )}
    </div>
  );
}
