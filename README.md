<div align="center">

<pre>
 ██████╗ ███████╗███╗   ██╗████████╗ ██████╗ ██╗    ██╗███╗   ██╗
 ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔═══██╗██║    ██║████╗  ██║
 ██████╔╝█████╗  ██╔██╗ ██║   ██║   ██║   ██║██║ █╗ ██║██╔██╗ ██║
 ██╔══██╗██╔════╝██║╚██╗██║   ██║   ██║   ██║██║███╗██║██║╚██╗██║
 ██║  ██║███████╗██║ ╚████║   ██║   ╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
                                                                     
 Decentralized Peer-to-Peer Rental & Smart Logistics Engine v1.0
 Built on Stellar Soroban Smart Contracts
</pre>

[![Smart Contract](https://img.shields.io/badge/soroban-v25.0-%237b2cbf?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org/)
[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?style=for-the-badge)](https://laboratory.stellar.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Trustless P2P Rental, Redefined.** A decentralized sharing-economy platform featuring immutable automated escrow security, integrated map geolocation tracking, and dynamic multi-party fee distribution.

[Smart Contract ID](#smart-contract-id) • [Core Features](#core-features) • [Architecture](#architecture) • [Technical Deep Dive](#technical-deep-dive)

</div>

---

## Overview

**RentOwn** is a fully decentralized peer-to-peer (P2P) equipment rental and smart-logistics protocol built using the Stellar Soroban SDK. The platform eliminates centralized middleman risk by orchestrating trustless asset agreements between **Lenders**, **Borrowers**, and independent **Couriers**. 

Every listing stores immutable geospatial coordinates (Latitude & Longitude) directly on-chain, enabling native frontend map integrations (e.g., Google Maps API) without relying on traditional databases.

---

## Smart Contract ID

The smart contract is officially compiled, signed, and deployed on the **Stellar Testnet** infrastructure:

* **Contract ID:** `CCCVEAEEOILMBIPSWEG6UTKBADRT6TTB2J2726V7WKRJ44OJHSGPLTLF`
* **Network:** Testnet
* **Soroban SDK Version:** `v25.0`

> 🌐 **Live Testing:** You can inspect, load, and interact with this live contract instantly via the [Stellar Laboratory API Explorer](https://laboratory.stellar.org/).

---

## Architecture