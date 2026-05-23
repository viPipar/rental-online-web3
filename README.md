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
[![Network](https://img.shields.io/badge/Network-Stellar_Testnet-3498db?style=for-the-badge&logo=stellar&logoColor=white)](https://laboratory.stellar.org/)
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

The smart contract is officially compiled, signed, and deployed on the **Stellar Testnet**:

```
Contract ID : CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF
Network     : Stellar Testnet
SDK Version : Soroban SDK v25.0
Language    : Rust (no_std)
```

> 🌐 **Inspect Live:** Load and interact with the contract instantly via the [Stellar Laboratory API Explorer →](https://laboratory.stellar.org/#contract-explorer?network=testnet&contractId=CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF)

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

---

## ⚙️ Local Development

### Prerequisites
```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

### Build Contract
```bash
stellar contract build
```

### Run Tests
```bash
cargo test
```

### Deploy to Testnet
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/rentown.wasm \
  --source YOUR_SECRET_KEY \
  --network testnet
```

---

## 🗺️ Roadmap & Next Steps

### ✅ Phase 1 — Web3 Backend Layer *(COMPLETE)*

- [x] Immutable `Item`, `RentalTx`, `RentalStatus` data structures (Soroban SDK v25 memory-safe patterns)
- [x] On-chain geolocation storage — lat/lng in Stellar ledger (zero SQL/NoSQL dependency)
- [x] Automated escrow: rent lock, collateral lock, courier pay, collateral return
- [x] Multi-party `require_auth()` authorization on all state-mutating functions
- [x] Live deployment on Stellar Testnet with valid Contract ID

### 🔵 Phase 2 — Frontend Integration Layer *(Next Step)*

- [ ] **Stellar Freighter Wallet** — browser extension integration for Owner, Renter & Courier `Sign Transaction` flows
- [ ] **Soroban Client SDK Binding** — generate JS/TS bindings from `.wasm` via `stellar contract bindings typescript`
- [ ] **Google Maps API Integration** — consume `get_catalog()` lat/lng output to render real-time item markers on an interactive map
- [ ] **Next.js / React Frontend** — responsive web UI for listing, browsing, renting, and tracking

### 🟣 Phase 3 — Production Hardening *(Future)*

- [ ] Migrate from `instance` to `persistent` storage for large catalogs
- [ ] Time-locked rental expiry via Soroban ledger timestamps
- [ ] Dispute resolution mechanism
- [ ] Mainnet deployment

---

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ on **Stellar Soroban** · Submission for Workshop Blockchain 2026

**[⭐ Star this repo](https://github.com) · [🔍 Inspect Contract on Stellar Lab](https://laboratory.stellar.org/)**

</div>