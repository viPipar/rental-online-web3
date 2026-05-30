<div align="center">

<pre>
 ██████╗ ███████╗███╗   ██╗████████╗ ██████╗ ██╗    ██╗███╗   ██╗
 ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔═══██╗██║    ██║████╗  ██║
 ██████╔╝█████╗  ██╔██╗ ██║   ██║   ██║   ██║██║ █╗ ██║██╔██╗ ██║
 ██╔══██╗██╔══╝  ██║╚██╗██║   ██║   ██║   ██║██║███╗██║██║╚██╗██║
 ██║  ██║███████╗██║ ╚████║   ██║   ╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
</pre>

### Decentralized Peer-to-Peer Rental & Smart Logistics Engine
### Built on Stellar Soroban Smart Contracts

[![Soroban SDK](https://img.shields.io/badge/Soroban_SDK-v25.0-%237b2cbf?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org/)
[![Rust](https://img.shields.io/badge/Rust-1.85+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Network](https://img.shields.io/badge/Network-Stellar_Mainnet-27ae60?style=for-the-badge&logo=stellar&logoColor=white)](https://laboratory.stellar.org/)
[![Build](https://img.shields.io/badge/Build-✅_Passing-27ae60?style=for-the-badge)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-f39c12?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Trustless P2P Rental, Redefined.**  
A fully on-chain sharing-economy protocol with automated escrow, geolocation-native listings, and dynamic multi-party fee distribution — no database required.

[Live Contract](#-live-deployment) · [Architecture](#%EF%B8%8F-architecture) · [Contract API](#-contract-api-reference) · [Roadmap](#-roadmap--next-steps)

</div>

---

## 📖 Overview

**RentOwn** is a fully decentralized peer-to-peer (P2P) equipment rental and smart-logistics protocol built with the **Stellar Soroban SDK v25**. The platform eliminates centralized intermediary risk by orchestrating trustless, cryptographically-secured asset agreements between three parties:

| Role | Description |
|------|-------------|
| 🏠 **Owner (Lender)** | Lists items on-chain with pricing, collateral, and GPS coordinates |
| 🧑‍💼 **Renter (Borrower)** | Pays rent + collateral into automated escrow via the smart contract |
| 🚴 **Courier** | Delivers the item and receives an on-chain fee upon rental completion |

Every listing stores immutable geospatial coordinates **(Latitude & Longitude)** directly on the Stellar ledger — enabling native frontend map integrations without ever touching a traditional database.

---

## 🚀 Live Deployment

The smart contract is officially compiled, signed, and deployed on the **Stellar Mainnet**:

```
Contract ID : CA6EISAZU2O5NH3I66YRT5NEKPSCIF4OEHSGWMXOJ2KXUBN5VVJCT2F6
Network     : Stellar Mainnet
SDK Version : Soroban SDK v25.0
Language    : Rust (no_std)
```

> 🌐 **Inspect Live:** Load and interact with the contract instantly via the [Stellar Laboratory API Explorer →](https://laboratory.stellar.org/#contract-explorer?network=public&contractId=CA6EISAZU2O5NH3I66YRT5NEKPSCIF4OEHSGWMXOJ2KXUBN5VVJCT2F6)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STELLAR BLOCKCHAIN                           │
│                                                                     │
│  ┌─────────────┐    ┌──────────────────────────────────────────┐   │
│  │  Freighter  │    │       RentOwnContract  (Soroban)         │   │
│  │   Wallet    │───▶│                                          │   │
│  │  (Browser)  │    │  ┌────────────┐   ┌──────────────────┐  │   │
│  └─────────────┘    │  │  Item[]    │   │  RentalTx[]      │  │   │
│                     │  │ ─────────  │   │ ─────────────    │  │   │
│  ┌─────────────┐    │  │ id         │   │ id               │  │   │
│  │  Frontend   │    │  │ owner      │   │ item_id          │  │   │
│  │  (Next.js)  │◀───│  │ title      │   │ renter           │  │   │
│  │             │    │  │ rent/day   │   │ courier          │  │   │
│  └──────┬──────┘    │  │ collateral │   │ collateral_locked │  │   │
│         │           │  │ lat / lng  │   │ status           │  │   │
│  ┌──────▼──────┐    │  │ city       │   └──────────────────┘  │   │
│  │ Google Maps │    │  └────────────┘                         │   │
│  │   API       │    └──────────────────────────────────────────┘   │
│  └─────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Structures

#### `Item` — On-Chain Item Listing
```rust
pub struct Item {
    pub id:            u64,      // Auto-increment primary key
    pub owner:         Address,  // Verified lender address
    pub title:         String,   // Item name
    pub rent_per_day:  i128,     // Daily rate in stroops
    pub collateral:    i128,     // Security deposit amount
    pub is_available:  bool,     // Real-time availability flag
    pub lat:           String,   // GPS Latitude  (e.g. "-6.595038")
    pub lng:           String,   // GPS Longitude (e.g. "106.816635")
    pub city:          String,   // Human-readable city name
}
```

#### `RentalTx` — On-Chain Rental Transaction
```rust
pub struct RentalTx {
    pub id:                u64,          // Transaction ID
    pub item_id:           u64,          // Reference to Item
    pub renter:            Address,      // Verified borrower address
    pub courier:           Address,      // Assigned courier address
    pub collateral_locked: i128,         // Escrowed deposit amount
    pub status:            RentalStatus, // Current lifecycle stage
}
```

#### `RentalStatus` — Lifecycle State Machine
```rust
pub enum RentalStatus {
    Matching   = 2, // ⏳ Waiting for courier pickup
    Delivering = 3, // 🚴 Courier in transit to renter
    Active     = 0, // ✅ Item received, rental period running
    Completed  = 1, // 🎉 Done — funds distributed, collateral returned
}
```

---

## 📋 Contract API Reference

### `initialize(token_address: Address)`
Bootstraps the contract with the escrow token (e.g., USDC on Testnet). Can only be called **once**; subsequent calls panic.

---

### `list_item(...) → u64`
**Caller:** Owner (requires `require_auth()`)

Registers a new rentable item on-chain with full geospatial data.

| Parameter | Type | Description |
|-----------|------|-------------|
| `owner` | `Address` | The item owner's wallet |
| `title` | `String` | Item display name |
| `rent_per_day` | `i128` | Daily rental price in token units |
| `collateral` | `i128` | Security deposit (must be > 0) |
| `lat` | `String` | GPS Latitude string |
| `lng` | `String` | GPS Longitude string |
| `city` | `String` | City name |

**Returns:** `u64` — the new item's ID.

---

### `rent_item(renter, courier, item_id, duration) → u64`
**Caller:** Renter (requires `require_auth()`)

Locks `(rent_per_day × duration) + collateral` into the contract escrow via `token::transfer`. Sets the rental status to `Matching` and marks the item as unavailable atomically.

| Parameter | Type | Description |
|-----------|------|-------------|
| `renter` | `Address` | Borrower's wallet |
| `courier` | `Address` | Pre-assigned courier wallet |
| `item_id` | `u64` | Target item to rent |
| `duration` | `u64` | Rental period in days |

**Returns:** `u64` — the new rental transaction ID.

---

### `update_delivery_status(courier, rental_id, new_status)`
**Caller:** Assigned Courier only (requires `require_auth()`)

Updates the on-chain delivery lifecycle. Unauthorized callers are rejected.

| `new_status` value | Effect |
|--------------------|--------|
| `3` | Sets status → `Delivering` |
| `0` | Sets status → `Active` (item delivered, rental begins) |

---

### `complete_rental(owner, rental_id, duration, courier_fee)`
**Caller:** Owner (requires `require_auth()`)

Finalizes the rental and atomically distributes all locked funds:

```
Escrowed Funds Distribution
────────────────────────────────────────────
  Total Rent Revenue     = rent_per_day × duration
  → Owner Net Share      = Total Rent - courier_fee   ✅ transferred to owner
  → Courier Fee          = courier_fee param          ✅ transferred to courier
  → Collateral (100%)    = collateral_locked          ✅ returned to renter
────────────────────────────────────────────
```

Item availability is reset to `true` after completion.

---

### `get_catalog() → Vec<Item>`
Read-only. Returns all registered items with their full on-chain geolocation data — ready to be rendered as map markers via Google Maps / Mapbox API.

---

## 🔐 Security Model

| Mechanism | Implementation |
|-----------|---------------|
| **Auth Guard** | Every state-mutating function uses `require_auth()` — only the designated party can call each function |
| **Escrow Lock** | Funds are transferred into contract custody on `rent_item()` and only released by `complete_rental()` |
| **Immutability** | All state is stored in Soroban instance storage on the Stellar ledger |
| **Anti-Double Rent** | `is_available` flag is set atomically — no race conditions for the same item |
| **Courier Verification** | `update_delivery_status` verifies `tx.courier == courier` before allowing status updates |
| **Overflow Safety** | `Cargo.toml` profile enables `overflow-checks = true` for all arithmetic |

---

## 📁 Repository Structure

```
rentown-soroban-contract/
├── Cargo.toml                   # Workspace config (Soroban SDK v25)
├── Cargo.lock                   # Deterministic dependency lock
├── README.md                    # This file
└── contracts/
    └── rentown/
        ├── Cargo.toml           # Contract package config
        ├── Makefile             # Build & deploy helpers
        └── src/
            ├── lib.rs           # 🔑 Main smart contract logic (283 lines)
            └── test.rs          # Unit test stubs
```
</div>

---

## Ringkasan Singkat

RentOwn — Decentralized P2P rental built around a Soroban smart contract (deployed on Stellar mainnet).

Frontend saat ini: React + Vite full UI, peta (react-leaflet), dan alur sewa end-to-end yang menggunakan sebuah scaffold kontrak mock yang persisten (localStorage). Tujuan: siap diganti ke on-chain Soroban tanpa mengubah UI.

Implementasi utama:
- Halaman Landing, Owner & Renter dashboards
- Form listing dengan MapPicker, Item detail modal, dan alur sewa
- Map markers, popups, dan legend
- Wallet stub dengan dukungan Freighter (local demo + helper signTransaction)
- Contract scaffold: `frontend/src/lib/contract.js` (fungsi: getCatalog, listItem, rentItem, getMyListings, getMyRentals)
- Build optimisasi (`vite.config.js` manualChunks)
- Responsif dasar dan perbaikan aksesibilitas (ARIA)

Belum terhubung ke on-chain (apa yang perlu dikerjakan):
- Ganti implementasi `frontend/src/lib/contract.js` menjadi panggilan Soroban client
- Gunakan `useWallet.signTransaction` untuk menandatangani dan submit transaksi nyata
- Tambah monitoring transaksi on-chain / notifikasi status

Quickstart (frontend):

```bash
cd frontend
npm install
npm run dev
```

Catatan: Data demo disimpan di `localStorage` (kunci: `rentown_items_v1`, `rentown_rentals_v1`).

Jika ingin, saya dapat langsung mengerjakan: (A) integrasi Soroban client, atau (B) integrasi Freighter signing — pilih saja.

Built with ❤️ on **Stellar Soroban** · Submission for Workshop Blockchain 2026

**[⭐ Star this repo](https://github.com) · [🔍 Inspect Contract on Stellar Lab](https://laboratory.stellar.org/)**

</div>