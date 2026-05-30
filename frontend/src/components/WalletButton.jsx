import { Wallet, LogOut, Loader, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import './WalletButton.css';

export default function WalletButton() {
  const { address, shortAddress, isConnecting, error, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="wallet-connected" role="status" aria-live="polite">
        <div className="wallet-dot" />
        <span className="wallet-address">{shortAddress}</span>
        <button
          className="wallet-disconnect"
          onClick={disconnect}
          title="Putuskan wallet"
          aria-label="Putuskan wallet"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-btn-wrap">
      <button
        id="connect-wallet-btn"
        className="btn btn-primary btn-sm wallet-btn"
        onClick={connect}
        disabled={isConnecting}
        aria-label="Connect Wallet"
      >
        {isConnecting ? (
          <>
            <Loader size={14} className="spin" />
            Menghubungkan...
          </>
        ) : (
          <>
            <Wallet size={14} />
            Connect Wallet
          </>
        )}
      </button>
      {error && (
        <div className="wallet-error" role="alert" title={error}>
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
