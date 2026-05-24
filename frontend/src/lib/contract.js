// Simple contract abstraction layer (scaffold)
// Saat ini menggunakan mock data dari `data/mockItems.js`.
// Nanti bisa diganti implementasinya dengan soroban client untuk memanggil kontrak on-chain.
import { mockItems, mockRentals, mockOwnerRentals } from '../data/mockItems';

const STORAGE_ITEMS_KEY = 'rentown_items_v1';
const STORAGE_RENTALS_KEY = 'rentown_rentals_v1';

function readItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_ITEMS_KEY);
    if (!raw) return [...mockItems];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('readItems error', e);
    return [...mockItems];
  }
}

function writeItems(items) {
  try { window.localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items)); } catch (e) { console.warn(e); }
}

function readRentals() {
  try {
    const raw = window.localStorage.getItem(STORAGE_RENTALS_KEY);
    if (!raw) return [...mockRentals, ...mockOwnerRentals];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('readRentals error', e);
    return [...mockRentals, ...mockOwnerRentals];
  }
}

function writeRentals(rentals) {
  try { window.localStorage.setItem(STORAGE_RENTALS_KEY, JSON.stringify(rentals)); } catch (e) { console.warn(e); }
}

export async function getCatalog() {
  await new Promise((r) => setTimeout(r, 150));
  return readItems();
}

export async function getMyListings(address) {
  await new Promise((r) => setTimeout(r, 100));
  const items = readItems();
  if (!address) return items.filter((i) => i.owner && i.owner === 'GSTLR_YOU_OWNER_001') || items;
  return items.filter((i) => i.owner === address);
}

export async function getMyRentals(address) {
  await new Promise((r) => setTimeout(r, 120));
  const rentals = readRentals();
  if (!address) return rentals;
  return rentals.filter((r) => r.renter === address || r.courier === address || r.item?.owner === address);
}

export async function listItem(payload) {
  // Simulate contract listing: append to items and persist locally
  await new Promise((r) => setTimeout(r, 400));
  const items = readItems();
  const id = Date.now();
  const newItem = {
    id,
    owner: payload.owner || 'GSTLR_YOU_OWNER_001',
    ownerName: payload.ownerName || 'Kamu',
    title: payload.title,
    category: payload.category,
    description: payload.description,
    condition: payload.condition,
    rentPerDay: Number(payload.rentPerDay),
    collateral: Number(payload.collateral),
    isAvailable: true,
    lat: payload.lat || payload.location?.lat || '-6.9175',
    lng: payload.lng || payload.location?.lng || '107.6191',
    city: payload.city,
    images: payload.images || (payload.imageUrl ? [payload.imageUrl] : []),
    rating: 0,
    reviewCount: 0,
    minDuration: payload.minDuration || 1,
    maxDuration: payload.maxDuration || 30,
  };
  items.unshift(newItem);
  writeItems(items);
  return { success: true, id };
}

export async function rentItem({ itemId, renter, courier, duration }) {
  // Simulate creating a rental and locking funds
  await new Promise((r) => setTimeout(r, 500));
  const rentals = readRentals();
  const items = readItems();
  const item = items.find((i) => i.id === itemId);
  const id = Date.now();
  const rental = {
    id,
    itemId,
    item,
    renter: renter || 'GSTLR_YOU_RENTER_001',
    courier: courier || 'GCOURIER_DEMO',
    courierName: 'Kurir Demo',
    collateralLocked: item?.collateral || 0,
    totalRent: (item?.rentPerDay || 0) * (duration || 1),
    duration: duration || 1,
    status: 'Matching',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + (duration || 1) * 86400000).toISOString().slice(0, 10),
  };
  rentals.unshift(rental);
  writeRentals(rentals);
  // mark item unavailable
  if (item) {
    item.isAvailable = false;
    writeItems(items);
  }
  return { success: true, rentalId: id };
}

export default { getCatalog, getMyListings, getMyRentals, listItem, rentItem };

