// ============================================================
// contract.js — Soroban On-Chain Client
// Terhubung langsung ke smart contract di Stellar (Mainnet/Testnet)
// Mainnet Contract: CA6EISAZU2O5NH3I66YRT5NEKPSCIF4OEHSGWMXOJ2KXUBN5VVJCT2F6
// ============================================================
import {
  rpc,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  scValToNative,
  nativeToScVal,
  Address,
  Account,
  Keypair,
} from '@stellar/stellar-sdk';
import { NETWORK } from './config';
import { mockItems, mockRentals, mockOwnerRentals } from '../data/mockItems';

// ──────────────────────────────────────────────────────────────
// Setup klien Soroban RPC & kontrak
// ──────────────────────────────────────────────────────────────
const server = new rpc.Server(NETWORK.rpcUrl, { allowHttp: false });
const contract = new Contract(NETWORK.contractId);

// ──────────────────────────────────────────────────────────────
// Helper: Simulasi transaksi (read-only, tanpa wallet)
//
// Menggunakan Keypair.random() untuk source account karena:
// - Selalu menghasilkan public key 56-char yang valid
// - Soroban simulation TIDAK mengeksekusi on-chain, jadi
//   akun tidak perlu ada/funded di blockchain
// ──────────────────────────────────────────────────────────────
async function simulateView(operation) {
  // Buat ephemeral keypair — hanya dipakai untuk format transaksi
  const ephemeralKeypair = Keypair.random();
  const sourceAccount = new Account(ephemeralKeypair.publicKey(), '0');

  const tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK.networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(result)) {
    throw new Error(`Soroban simulation error: ${result.error}`);
  }

  return result.result?.retval ?? null;
}

// ──────────────────────────────────────────────────────────────
// Helper: Invoke + sign + submit transaksi (butuh wallet)
// ──────────────────────────────────────────────────────────────
async function invokeAndSubmit(operation, signerAddress, signTransactionFn) {
  // 1. Ambil account dari network (butuh sequence number nyata)
  const account = await server.getAccount(signerAddress);

  // 2. Build transaksi
  const tx = new TransactionBuilder(account, {
    fee: '500000', // 0.05 XLM max fee
    networkPassphrase: NETWORK.networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(60)
    .build();

  // 3. Soroban: prepare transaksi (inject footprint, resource fee, dll)
  const preparedTx = await server.prepareTransaction(tx);

  // 4. Sign menggunakan Freighter (via useWallet.signTransaction)
  const signedXdr = await signTransactionFn(preparedTx.toXDR());

  // 5. Re-build dari signed XDR
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK.networkPassphrase);

  // 6. Submit ke jaringan
  const sendResult = await server.sendTransaction(signedTx);
  if (sendResult.status === 'ERROR') {
    throw new Error(`Transaksi gagal: ${JSON.stringify(sendResult.errorResult)}`);
  }

  // 7. Tunggu konfirmasi
  return await waitForConfirmation(sendResult.hash);
}

// ──────────────────────────────────────────────────────────────
// Helper: Poll sampai transaksi terkonfirmasi
// ──────────────────────────────────────────────────────────────
async function waitForConfirmation(txHash, maxAttempts = 30) {
  const { GetTransactionStatus } = rpc.Api;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const result = await server.getTransaction(txHash);
    if (result.status === GetTransactionStatus.SUCCESS) {
      return { success: true, txHash, result };
    }
    if (result.status === GetTransactionStatus.FAILED) {
      throw new Error(`Transaksi gagal di blockchain: ${txHash}`);
    }
    // PENDING/NOT_FOUND → lanjut polling
  }
  throw new Error(`Timeout menunggu konfirmasi transaksi: ${txHash}`);
}

// ──────────────────────────────────────────────────────────────
// Helper: Parse ScVal Item (Soroban struct) → objek JavaScript
// ──────────────────────────────────────────────────────────────
function parseOnChainItem(rawItem) {
  try {
    // scValToNative sudah mengubah ScVal → JS native
    // rawItem bisa berupa ScVal atau sudah di-native-kan oleh scValToNative(Vec<Item>)
    const n = typeof rawItem === 'object' && rawItem !== null ? rawItem : {};
    return {
      id: Number(n.id ?? 0),
      owner: String(n.owner ?? ''),
      title: String(n.title ?? ''),
      rentPerDay: Number(n.rent_per_day ?? 0),
      collateral: Number(n.collateral ?? 0),
      isAvailable: Boolean(n.is_available),
      lat: String(n.lat ?? '-6.9175'),
      lng: String(n.lng ?? '107.6191'),
      city: String(n.city ?? ''),
      // ── Field UI (tidak tersimpan di blockchain, diisi default) ──
      category: 'Lainnya',
      description: 'Barang terdaftar on-chain via Stellar Soroban.',
      condition: 'Bekas (Terawat)',
      ownerName: `${String(n.owner ?? '').slice(0, 6)}...`,
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'],
      rating: 0,
      reviewCount: 0,
      minDuration: 1,
      maxDuration: 30,
    };
  } catch (e) {
    console.warn('[parseOnChainItem] Gagal parse item:', e);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────
// FUNGSI PUBLIK
// ──────────────────────────────────────────────────────────────

/**
 * Ambil semua barang dari katalog on-chain.
 * Read-only — tidak butuh wallet.
 */
export async function getCatalog() {
  try {
    const retval = await simulateView(contract.call('get_catalog'));
    if (!retval) return [...mockItems];

    const raw = scValToNative(retval); // Vec<Item> → array of JS objects
    if (!Array.isArray(raw) || raw.length === 0) {
      console.info('[getCatalog] Katalog on-chain kosong, menampilkan mock data untuk demo.');
      return [...mockItems];
    }

    const parsed = raw.map(parseOnChainItem).filter(Boolean);
    return parsed.length > 0 ? parsed : [...mockItems];
  } catch (e) {
    console.warn('[getCatalog] On-chain gagal, fallback ke mock:', e.message);
    return [...mockItems];
  }
}

/**
 * Ambil listing milik owner berdasarkan address.
 */
export async function getMyListings(address) {
  const items = await getCatalog();
  if (!address) return []; // Wallet belum connect — kembalikan kosong
  return items.filter((i) => i.owner === address);
}

/**
 * Ambil riwayat sewa user.
 * Menggunakan localStorage sebagai cache (on-chain perlu fungsi get_rentals di kontrak).
 */
export async function getMyRentals(address) {
  try {
    const raw = window.localStorage.getItem('rentown_rentals_v1');
    const rentals = raw ? JSON.parse(raw) : [...mockRentals, ...mockOwnerRentals];
    if (!address) return rentals;
    return rentals.filter(
      (r) => r.renter === address || r.courier === address || r.item?.owner === address
    );
  } catch {
    return [...mockRentals, ...mockOwnerRentals];
  }
}

/**
 * Daftarkan barang baru ke blockchain.
 * PENTING: Harga dalam IDR → dikonversi ke stroops (1 XLM = 10_000_000 stroops).
 *
 * @param {object} payload - Data barang
 * @param {string} signerAddress - Address wallet owner
 * @param {Function} signTransactionFn - Dari useWallet().signTransaction
 */
export async function listItem(payload, signerAddress, signTransactionFn) {
  if (!signerAddress || !signTransactionFn) {
    throw new Error('Wallet belum terhubung. Silakan connect Freighter terlebih dahulu.');
  }

  // Konversi angka ke stroops (nilai terkecil XLM, seperti satoshi di BTC)
  const rentStroops = BigInt(Math.round(Number(payload.rentPerDay) * 1e7));
  const collateralStroops = BigInt(Math.round(Number(payload.collateral) * 1e7));

  const operation = contract.call(
    'list_item',
    new Address(signerAddress).toScVal(),
    nativeToScVal(String(payload.title), { type: 'string' }),
    nativeToScVal(rentStroops, { type: 'i128' }),
    nativeToScVal(collateralStroops, { type: 'i128' }),
    nativeToScVal(String(payload.lat || '-6.9175'), { type: 'string' }),
    nativeToScVal(String(payload.lng || '107.6191'), { type: 'string' }),
    nativeToScVal(String(payload.city || ''), { type: 'string' }),
  );

  return await invokeAndSubmit(operation, signerAddress, signTransactionFn);
}

/**
 * Sewa barang — kunci dana ke escrow smart contract.
 * @param {object} params
 */
export async function rentItem({ itemId, renter, courier, duration, signerAddress, signTransactionFn }) {
  const signer = signerAddress || renter;
  if (!signer || !signTransactionFn) {
    throw new Error('Wallet belum terhubung.');
  }

  const operation = contract.call(
    'rent_item',
    new Address(signer).toScVal(),
    new Address(courier).toScVal(),
    nativeToScVal(BigInt(itemId), { type: 'u64' }),
    nativeToScVal(BigInt(duration), { type: 'u64' }),
  );

  return await invokeAndSubmit(operation, signer, signTransactionFn);
}

/**
 * Update status pengiriman (kurir only).
 * newStatus: 3 = Delivering, 0 = Active
 */
export async function updateDeliveryStatus({ rentalId, newStatus, courierAddress, signTransactionFn }) {
  if (!courierAddress || !signTransactionFn) {
    throw new Error('Wallet kurir belum terhubung.');
  }
  const operation = contract.call(
    'update_delivery_status',
    new Address(courierAddress).toScVal(),
    nativeToScVal(BigInt(rentalId), { type: 'u64' }),
    nativeToScVal(Number(newStatus), { type: 'u32' }),
  );
  return await invokeAndSubmit(operation, courierAddress, signTransactionFn);
}

/**
 * Selesaikan sewa — distribusikan dana otomatis dari escrow.
 */
export async function completeRental({ rentalId, duration, courierFee, ownerAddress, signTransactionFn }) {
  if (!ownerAddress || !signTransactionFn) {
    throw new Error('Wallet pemilik belum terhubung.');
  }
  const courierFeeStroops = BigInt(Math.round(Number(courierFee) * 1e7));
  const operation = contract.call(
    'complete_rental',
    new Address(ownerAddress).toScVal(),
    nativeToScVal(BigInt(rentalId), { type: 'u64' }),
    nativeToScVal(BigInt(duration), { type: 'u64' }),
    nativeToScVal(courierFeeStroops, { type: 'i128' }),
  );
  return await invokeAndSubmit(operation, ownerAddress, signTransactionFn);
}

export default {
  getCatalog,
  getMyListings,
  getMyRentals,
  listItem,
  rentItem,
  updateDeliveryStatus,
  completeRental,
};
