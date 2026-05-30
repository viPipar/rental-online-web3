import { useState, useCallback } from 'react';
import {
  isConnected as freighterIsConnected,
  getAddress as freighterGetAddress,
  setAllowed as freighterSetAllowed,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';
import { NETWORK } from '../lib/config';

// ============================================================
// useWallet — Integrasi Freighter Wallet v6 (Stellar)
// ============================================================

/** Validasi bahwa string adalah Stellar public key (dimulai G, panjang 56) */
function isValidStellarAddress(addr) {
  return typeof addr === 'string' && addr.startsWith('G') && addr.length === 56;
}

/** Baca address dari localStorage, hanya jika valid */
function readStoredAddress() {
  try {
    const stored = window.localStorage.getItem('rentown_address');
    return isValidStellarAddress(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function useWallet() {
  const [address, setAddress] = useState(readStoredAddress);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    // Bersihkan localStorage yang mungkin berisi value rusak
    try { window.localStorage.removeItem('rentown_address'); } catch {}

    try {
      // 1. Cek apakah ekstensi Freighter terinstall
      const connectionStatus = await freighterIsConnected();
      // freighter-api v6: mengembalikan { isConnected: boolean }
      const installed = connectionStatus?.isConnected ?? false;

      if (!installed) {
        throw new Error(
          'Freighter wallet tidak terdeteksi. Pastikan ekstensi Freighter sudah diinstall dan diaktifkan di browser.'
        );
      }

      // 2. Minta izin akses ke wallet user (popup Freighter akan muncul)
      await freighterSetAllowed();

      // 3. Ambil alamat wallet
      const result = await freighterGetAddress();
      // freighter-api v6: { address: string, error?: string }
      if (result?.error) {
        throw new Error(`Freighter: ${result.error}`);
      }

      const addr = result?.address;
      if (!isValidStellarAddress(addr)) {
        throw new Error(
          'Tidak bisa mendapatkan alamat wallet yang valid. Pastikan Freighter tidak dikunci dan sudah login.'
        );
      }

      setAddress(addr);
      window.localStorage.setItem('rentown_address', addr);
    } catch (err) {
      const msg = err?.message || 'Gagal menghubungkan wallet';
      setError(msg);
      setAddress(null);
      console.error('[useWallet] connect error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
    try { window.localStorage.removeItem('rentown_address'); } catch {}
  }, []);

  /**
   * Tandatangani transaksi XDR menggunakan Freighter v6.
   * @param {string} txXdr - Transaction XDR (base64)
   * @returns {Promise<string>} - Signed XDR (base64)
   */
  const signTransaction = useCallback(async (txXdr) => {
    const result = await freighterSignTransaction(txXdr, {
      networkPassphrase: NETWORK.networkPassphrase,
    });
    // freighter-api v6: { signedTxXdr: string, error?: string }
    if (result?.error) {
      throw new Error(`Freighter signing error: ${result.error}`);
    }
    const signedXdr = result?.signedTxXdr;
    if (!signedXdr) {
      throw new Error('Freighter tidak mengembalikan signed transaction');
    }
    return signedXdr;
  }, []);

  const shortAddress = isValidStellarAddress(address)
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return { address, shortAddress, isConnecting, error, connect, disconnect, signTransaction };
}
