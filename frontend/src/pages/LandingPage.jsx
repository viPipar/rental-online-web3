import { useNavigate } from 'react-router-dom';
import { Package, Search, Shield, Zap, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const STATS = [
  { icon: Package, value: '500+', label: 'Barang Terdaftar' },
  { icon: Users,   value: '1.2K', label: 'Pengguna Aktif' },
  { icon: Star,    value: '4.8',  label: 'Rating Rata-rata' },
  { icon: TrendingUp, value: '98%', label: 'Transaksi Sukses' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Escrow Otomatis',
    desc: 'Dana sewa & jaminan dikunci di smart contract, bukan rekening siapapun. Aman 100%.',
    color: 'purple',
  },
  {
    icon: Search,
    title: 'Temukan dengan Maps',
    desc: 'Lihat lokasi barang sewaan secara real-time di peta. Pilih yang paling dekat darimu.',
    color: 'blue',
  },
  {
    icon: Package,
    title: 'Logistik Terintegrasi',
    desc: 'Kurir tercatat di blockchain. Status pengiriman bisa dipantau setiap saat secara transparan.',
    color: 'green',
  },
  {
    icon: Zap,
    title: 'Powered by Stellar',
    desc: 'Transaksi selesai dalam 5 detik dengan biaya hampir nol menggunakan jaringan Stellar Soroban.',
    color: 'amber',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Navbar />

      {/* Background mesh */}
      <div className="landing-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-grid" />
      </div>

      {/* Hero */}
      <section className="hero container">
        <div className="hero-badge anim-fade-up">
          <Zap size={12} />
          <span>Live di Stellar Testnet · Contract ID: CCCVEAE...LTLF</span>
        </div>

        <h1 className="hero-title anim-fade-up-delay-1">
          Platform Rental<br />
          <span className="hero-title-gradient">Peer-to-Peer</span><br />
          Berbasis Blockchain
        </h1>

        <p className="hero-subtitle anim-fade-up-delay-2">
          Sewa dan sewakan barang dengan aman tanpa perantara. Dana dijamin oleh smart contract
          Stellar Soroban — bukan oleh kepercayaan belaka.
        </p>

        {/* Role selection cards */}
        <div className="role-cards anim-fade-up-delay-3">
          {/* Renter Card */}
          <div
            id="role-card-renter"
            className="role-card role-card-renter"
            onClick={() => navigate('/renter')}
          >
            <div className="role-card-icon">
              <Search size={32} />
            </div>
            <div className="role-card-content">
              <h2 className="role-card-title">Saya Ingin Meminjam</h2>
              <p className="role-card-desc">
                Temukan barang yang kamu butuhkan di sekitar lokasi kamu. Browse katalog, cek peta,
                dan sewa dengan aman.
              </p>
              <ul className="role-card-features">
                <li>✦ Katalog barang lengkap dengan filter</li>
                <li>✦ Lihat lokasi di peta interaktif</li>
                <li>✦ Tracking status pengiriman real-time</li>
                <li>✦ Jaminan kembali 100% saat selesai</li>
              </ul>
            </div>
            <div className="role-card-arrow">
              <ArrowRight size={20} />
            </div>
            <div className="role-card-glow role-glow-blue" />
          </div>

          {/* Owner Card */}
          <div
            id="role-card-owner"
            className="role-card role-card-owner"
            onClick={() => navigate('/owner')}
          >
            <div className="role-card-icon">
              <Package size={32} />
            </div>
            <div className="role-card-content">
              <h2 className="role-card-title">Saya Ingin Meminjamkan</h2>
              <p className="role-card-desc">
                Daftarkan barang kamu, tentukan harga, dan mulai hasilkan pendapatan pasif dari aset
                yang selama ini menganggur.
              </p>
              <ul className="role-card-features">
                <li>✦ Form listing mudah + pilih lokasi di peta</li>
                <li>✦ Dana sewa masuk otomatis via escrow</li>
                <li>✦ Pantau siapa yang menyewa barangmu</li>
                <li>✦ Dashboard pendapatan realtime</li>
              </ul>
            </div>
            <div className="role-card-arrow">
              <ArrowRight size={20} />
            </div>
            <div className="role-card-glow role-glow-purple" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section container anim-fade-up-delay-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="stat-card glass-card">
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section container">
        <h2 className="features-title anim-fade-up">Kenapa RentOwn?</h2>
        <p className="features-subtitle anim-fade-up">
          Teknologi blockchain memastikan setiap transaksi transparan, otomatis, dan tidak bisa
          dimanipulasi siapapun — termasuk kami.
        </p>
        <div className="features-grid">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`feature-card glass-card anim-fade-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`feature-icon feature-icon-${f.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer container">
        <div className="footer-logo">
          <Zap size={16} />
          RentOwn
        </div>
        <p className="footer-text">
          Built on Stellar Soroban · Contract{' '}
          <a
            href="https://laboratory.stellar.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF
          </a>
        </p>
      </footer>
    </div>
  );
}
