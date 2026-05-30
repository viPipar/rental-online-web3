// ============================================================
// KONFIGURASI JARINGAN — Single Source of Truth
// Ubah VITE_NETWORK di .env untuk switch antara testnet/mainnet
// ============================================================

export const NETWORK_TYPE = import.meta.env.VITE_NETWORK ?? 'mainnet';

export const NETWORKS = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    label: 'Stellar Testnet',
    shortLabel: 'Testnet',
  },
  mainnet: {
    rpcUrl: 'https://mainnet.sorobanrpc.com',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    contractId: 'CA6EISAZU2O5NH3I66YRT5NEKPSCIF4OEHSGWMXOJ2KXUBN5VVJCT2F6',
    explorerUrl: 'https://stellar.expert/explorer/public',
    horizonUrl: 'https://horizon.stellar.org',
    label: 'Stellar Mainnet',
    shortLabel: 'Mainnet',
  },
};

export const NETWORK = NETWORKS[NETWORK_TYPE];

// Helper: singkat contract ID untuk UI (ex: "CA6EIS...CT2F6")
export const shortContractId = `${NETWORK.contractId.slice(0, 6)}...${NETWORK.contractId.slice(-5)}`;
