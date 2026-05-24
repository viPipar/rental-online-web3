import { useState, useCallback } from 'react';

// Stub untuk Stellar Freighter Wallet
// Siap untuk diganti dengan integrasi @stellar/freighter-api nyata
export function useWallet() {
  const [address, setAddress] = useState(() => window.localStorage.getItem('rentown_address'));
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Prefer Freighter if available
      if (window.freighter && typeof window.freighter.getPublicKey === 'function') {
        // Some Freighter integrations require a connect call first
        if (typeof window.freighter.connect === 'function') {
          try { await window.freighter.connect(); } catch (e) { /* ignore connect errors */ }
        }
        const result = await window.freighter.getPublicKey();
        setAddress(result);
        window.localStorage.setItem('rentown_address', result);
      } else {
        // Demo fallback
        await new Promise((r) => setTimeout(r, 600));
        const demo = 'GDEMO123RENTOWN456WALLET789STELLAR';
        setAddress(demo);
        window.localStorage.setItem('rentown_address', demo);
      }
    } catch (err) {
      setError(err?.message || 'Gagal menghubungkan wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
    window.localStorage.removeItem('rentown_address');
  }, []);

  // Helper to request signing a transaction via Freighter if available
  const signTransaction = useCallback(async (txXdr) => {
    if (window.freighter && typeof window.freighter.signTransaction === 'function') {
      return await window.freighter.signTransaction(txXdr);
    }
    throw new Error('Freighter tidak tersedia untuk menandatangani transaksi');
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return { address, shortAddress, isConnecting, error, connect, disconnect, signTransaction };
}
