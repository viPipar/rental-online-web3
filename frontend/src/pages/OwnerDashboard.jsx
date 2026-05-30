import { useState, useEffect } from 'react';
import { LayoutGrid, PlusCircle, ClipboardList, TrendingUp, DollarSign, Package, Star, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ItemForm from '../components/ItemForm';
import { formatIDR, getStatusLabel } from '../data/mockItems';
import { getMyListings, getMyRentals } from '../lib/contract';
import { NETWORK, shortContractId } from '../lib/config';
import { useWallet } from '../hooks/useWallet';
import './OwnerDashboard.css';

const TABS = [
  { id: 'listings',  label: 'Barang Saya',    icon: LayoutGrid },
  { id: 'add',       label: 'Tambah Barang',  icon: PlusCircle },
  { id: 'rentals',   label: 'Penyewaan Aktif',icon: ClipboardList },
  { id: 'earnings',  label: 'Pendapatan',     icon: TrendingUp },
];

const STATS = [
  { icon: Package,    label: 'Total Listing',    value: '2', color: 'purple' },
  { icon: DollarSign, label: 'Total Pendapatan', value: formatIDR(255000), color: 'green' },
  { icon: Star,       label: 'Rating Rata-rata', value: '4.8', color: 'amber' },
  { icon: CheckCircle,label: 'Transaksi Sukses', value: '1', color: 'blue' },
];

export default function OwnerDashboard() {
  const { address, shortAddress } = useWallet();
  const [tab, setTab] = useState('listings');
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerRentals, setOwnerRentals] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const myItems = await getMyListings(address);
        const myRentals = await getMyRentals(address);
        if (mounted) {
          setItems(myItems);
          setOwnerRentals(myRentals);
        }
      } catch (e) {
        console.error('Failed to load owner data', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [address]); // re-load saat wallet berubah

  const handleAddItem = (newItem) => {
    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: newItem.id || Date.now(),
        owner: address || 'unknown',
        ownerName: shortAddress || 'Kamu',
        isAvailable: true,
        rating: 0,
        reviewCount: 0,
        images: newItem.imageUrl ? [newItem.imageUrl] : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'],
      },
    ]);
    setTab('listings');
  };

  const handleComplete = (rentalId) => {
    setCompleted((prev) => [...prev, rentalId]);
  };

  return (
    <div className="owner-page page-wrapper">
      <Navbar />

      <div className="owner-layout">
        {/* Sidebar */}
        <aside className="owner-sidebar">
          <div className="owner-profile">
            <div className="owner-avatar">🏠</div>
            <div>
              <p className="owner-name">{shortAddress ?? 'Belum Connect'}</p>
              <p className="owner-role">Pemilik Barang</p>
            </div>
          </div>

          <nav className="sidebar-nav">
                {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`sidebar-tab-${id}`}
                className={`sidebar-tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={17} />
                {label}
                    {id === 'rentals' && ownerRentals.length > 0 && (
                      <span className="sidebar-badge">{ownerRentals.length}</span>
                    )}
              </button>
            ))}
          </nav>

          <div className="sidebar-contract">
            <p className="sidebar-contract-label">Contract</p>
            <a
              href={`${NETWORK.explorerUrl}/contract/${NETWORK.contractId}`}
              target="_blank"
              rel="noopener noreferrer"
              title={NETWORK.contractId}
              className="sidebar-contract-id"
            >
              {shortContractId}
            </a>
            <p className="sidebar-network">{NETWORK.label}</p>
          </div>
        </aside>

        {/* Main */}
        <main className="owner-main">
          {/* Stats */}
          <div className="stats-grid">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`stat-box glass-card stat-${color}`}>
                <div className={`stat-box-icon stat-icon-${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="stat-box-value">{value}</p>
                  <p className="stat-box-label">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── My Listings ── */}
          {tab === 'listings' && (
            <div className="owner-section">
              <div className="section-header">
                <h2 className="section-title">Barang Saya</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setTab('add')}>
                  <PlusCircle size={15} /> Tambah Baru
                </button>
              </div>

              {items.length === 0 ? (
                <div className="empty-owner">
                  <Package size={48} />
                  <p>Belum ada barang terdaftar. Tambahkan barang pertamamu!</p>
                  <button className="btn btn-primary" onClick={() => setTab('add')}>+ Tambah Barang</button>
                </div>
              ) : (
                <div className="owner-items-grid">
                  {items.map((item) => {
                    const statusInfo = getStatusLabel(item.isAvailable ? 'Available' : 'Active');
                    return (
                      <div key={item.id} className="owner-item-card glass-card">
                        <div className="owner-item-img-wrap">
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="owner-item-img"
                          />
                          <span className={`badge ${statusInfo.class} owner-item-badge`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="owner-item-body">
                          <p className="owner-item-category">{item.category}</p>
                          <h3 className="owner-item-title">{item.title}</h3>
                          <div className="owner-item-price">
                            <span>{formatIDR(item.rentPerDay)}<small>/hari</small></span>
                            <span className="owner-item-collateral">Jaminan: {formatIDR(item.collateral)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Add Item Form ── */}
          {tab === 'add' && (
            <div className="owner-section">
              <div className="section-header">
                <h2 className="section-title">Tambah Barang Sewaan</h2>
              </div>
              <ItemForm onSubmit={handleAddItem} />
            </div>
          )}

          {/* ── Active Rentals ── */}
          {tab === 'rentals' && (
            <div className="owner-section">
              <div className="section-header">
                <h2 className="section-title">Penyewaan Aktif</h2>
              </div>

              {ownerRentals.length === 0 ? (
                <div className="empty-owner">
                  <ClipboardList size={48} />
                  <p>Belum ada penyewaan aktif saat ini.</p>
                </div>
              ) : (
                <div className="active-rentals">
                  {ownerRentals.map((rental) => {
                    const isDone = completed.includes(rental.id);
                    const statusInfo = getStatusLabel(isDone ? 'Completed' : rental.status);
                    return (
                      <div key={rental.id} className="active-rental-card glass-card">
                        <div className="active-rental-header">
                          <img src={rental.item.images?.[0]} alt="" className="active-rental-img" />
                          <div className="active-rental-info">
                            <div className="active-rental-top">
                              <h3>{rental.item.title}</h3>
                              <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                            </div>
                            <div className="active-rental-meta">
                              <span>👤 Penyewa: <strong>{rental.renterName}</strong></span>
                              <span>🚴 Kurir: <strong>{rental.courierName}</strong></span>
                              <span>📅 {rental.startDate} → {rental.endDate} ({rental.duration} hari)</span>
                            </div>
                            <div className="active-rental-amounts">
                              <div className="amount-chip">
                                Pendapatan Bersih<br />
                                <strong>{formatIDR(rental.totalRent - rental.courierFee)}</strong>
                              </div>
                              <div className="amount-chip amount-chip-courier">
                                Fee Kurir<br />
                                <strong>{formatIDR(rental.courierFee)}</strong>
                              </div>
                              <div className="amount-chip amount-chip-collateral">
                                Jaminan Penyewa<br />
                                <strong>{formatIDR(rental.collateralLocked)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {!isDone && (
                          <div className="active-rental-footer">
                            <p className="active-rental-note">
                              💡 Klik tombol di bawah saat barang sudah kembali dan kondisinya aman. Dana akan terdistribusi otomatis via smart contract.
                            </p>
                            <button
                              id={`complete-rental-btn-${rental.id}`}
                              className="btn btn-success"
                              onClick={() => handleComplete(rental.id)}
                            >
                              ✅ Konfirmasi Barang Sudah Kembali
                            </button>
                          </div>
                        )}

                        {isDone && (
                          <div className="rental-done-notice">
                            ✅ Selesai! Dana sudah otomatis terbagi: {formatIDR(rental.totalRent - rental.courierFee)} → Kamu · {formatIDR(rental.courierFee)} → Kurir · Jaminan dikembalikan ke penyewa.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Earnings ── */}
          {tab === 'earnings' && (
            <div className="owner-section">
              <div className="section-header">
                <h2 className="section-title">Ringkasan Pendapatan</h2>
              </div>
              <div className="earnings-grid">
                <div className="earnings-card glass-card">
                  <h3>Pendapatan Bulan Ini</h3>
                  <div className="earnings-big-value">{formatIDR(255000)}</div>
                  <p className="earnings-sub">Dari 1 transaksi selesai</p>
                </div>
                <div className="earnings-card glass-card">
                  <h3>Menunggu Pencairan</h3>
                  <div className="earnings-big-value earnings-pending">{formatIDR(205000)}</div>
                  <p className="earnings-sub">1 penyewaan aktif · dikunci di escrow</p>
                </div>
              </div>

              <div className="earnings-history glass-card">
                <h4 className="earnings-history-title">Riwayat Transaksi</h4>
                <div className="earnings-row earnings-row-header">
                  <span>Barang</span>
                  <span>Penyewa</span>
                  <span>Durasi</span>
                  <span>Pendapatan</span>
                  <span>Status</span>
                </div>
                {[
                  { id: 'TRX-001', item: 'Tenda Camping 4P', renter: 'Ahmad F.', duration: '3 hari', amount: formatIDR(205000), status: 'Aktif' },
                  { id: 'TRX-000', item: 'Tenda Camping 4P', renter: 'Dewi S.', duration: '5 hari', amount: formatIDR(375000), status: 'Selesai' },
                ].map((t) => (
                  <div key={t.id} className="earnings-row">
                    <span>{t.item}</span>
                    <span>{t.renter}</span>
                    <span>{t.duration}</span>
                    <span className="earnings-amount">{t.amount}</span>
                    <span className={`badge ${t.status === 'Selesai' ? 'badge-completed' : 'badge-rented'}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
