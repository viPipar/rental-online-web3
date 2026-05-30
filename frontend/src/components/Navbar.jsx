import { Link, useLocation } from 'react-router-dom';
import { Wallet, Zap, Home } from 'lucide-react';
import WalletButton from './WalletButton';
import { NETWORK } from '../lib/config';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isOwner  = location.pathname === '/owner';
  const isRenter = location.pathname === '/renter';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Zap size={18} />
          </div>
          <span className="navbar-logo-text">RentOwn</span>
          <span className="navbar-logo-badge">{NETWORK.shortLabel}</span>
        </Link>

        {/* Center tabs (only on dashboard pages) */}
        {(isOwner || isRenter) && (
          <div className="navbar-tabs">
            <Link
              to="/renter"
              className={`navbar-tab ${isRenter ? 'active' : ''}`}
            >
              Meminjam
            </Link>
            <Link
              to="/owner"
              className={`navbar-tab ${isOwner ? 'active' : ''}`}
            >
              Meminjamkan
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          {(isOwner || isRenter) && (
            <Link to="/" className="btn btn-ghost btn-sm">
              <Home size={16} />
              Beranda
            </Link>
          )}
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
