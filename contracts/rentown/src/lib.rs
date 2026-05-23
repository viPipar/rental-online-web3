#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Symbol, Vec
};

// ========================================================
// 1. ENUM & STRUCT UTAMA (SEMUA MASUK BLOCKCHAIN)
// ========================================================

#[contracttype]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum RentalStatus {
    Active = 0,      // Sedang disewa
    Completed = 1,   // Selesai aman, jaminan cair
    Matching = 2,    // Menunggu Kurir mengambil barang
    Delivering = 3,  // Kurir sedang mengantar ke rumah penyewa
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Item {
    pub id: u64,
    pub owner: Address,
    pub title: String,
    pub rent_per_day: i128,
    pub collateral: i128,
    pub is_available: bool,
    // Koordinat Google Maps disimpan dalam bentuk String (Contoh: "-6.595038")
    pub lat: String,
    pub lng: String,
    pub city: String,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct RentalTx {
    pub id: u64,
    pub item_id: u64,
    pub renter: Address,
    pub courier: Address,
    pub collateral_locked: i128,
    pub status: RentalStatus,
}

// ========================================================
// 2. KUNCI UNTUK STORAGE INSTANCE
// ========================================================
const INITIALIZED: Symbol = symbol_short!("INIT");
const TOKEN_ADDR: Symbol = symbol_short!("TK_ADDR");
const ITEM_CTR: Symbol = symbol_short!("ITM_CTR");
const RNT_CTR: Symbol = symbol_short!("RNT_CTR");
const ITEMS_MAP: Symbol = symbol_short!("ITM_MAP");
const RENTALS_MAP: Symbol = symbol_short!("RNT_MAP");

// ========================================================
// 3. LOGIKA SMART CONTRACT
// ========================================================
#[contract]
pub struct RentOwnContract;

#[contractimpl]
impl RentOwnContract {
    
    // Fungsi 1: Inisialisasi token jaminan (Misal alamat token USDC di Testnet)
    pub fn initialize(env: Env, token_address: Address) {
        let is_init: bool = env.storage().instance().get(&INITIALIZED).unwrap_or(false);
        if is_init { 
            panic!("Kontrak sudah diinisialisasi sebelumnya!"); 
        }
        env.storage().instance().set(&TOKEN_ADDR, &token_address);
        env.storage().instance().set(&ITEM_CTR, &0u64);
        env.storage().instance().set(&RNT_CTR, &0u64);
        env.storage().instance().set(&INITIALIZED, &true);
    }

    // Fungsi 2: MEMINJAMKAN (Lender) - Daftarkan barang + pasang titik Google Maps langsung ke Blockchain
    pub fn list_item(env: Env, owner: Address, title: String, rent_per_day: i128, collateral: i128, lat: String, lng: String, city: String) -> u64 {
        owner.require_auth();

        if rent_per_day <= 0 || collateral <= 0 {
            panic!("Harga sewa dan jaminan harus lebih besar dari 0");
        }

        let mut items: Vec<Item> = env.storage().instance().get(&ITEMS_MAP).unwrap_or(Vec::new(&env));
        let mut current_id: u64 = env.storage().instance().get(&ITEM_CTR).unwrap_or(0);
        current_id += 1;

        let new_item = Item {
            id: current_id,
            owner,
            title,
            rent_per_day,
            collateral,
            is_available: true,
            lat,
            lng,
            city,
        };

        items.push_back(new_item);
        env.storage().instance().set(&ITEMS_MAP, &items);
        env.storage().instance().set(&ITEM_CTR, &current_id);

        current_id
    }

    // Fungsi 3: MEMINJAM (Borrower) - Kunci dana sewa + jaminan ke Escrow, set status "Matching" kurir
    pub fn rent_item(env: Env, renter: Address, courier: Address, item_id: u64, duration: u64) -> u64 {
        renter.require_auth();

        if duration <= 0 {
            panic!("Durasi minimal peminjaman adalah 1 hari");
        }

        let mut items: Vec<Item> = env.storage().instance().get(&ITEMS_MAP).expect("Katalog masih kosong");
        let mut target_idx: Option<u32> = None;
        let mut matched_item: Option<Item> = None;

        for i in 0..items.len() {
            let current_item = items.get(i).unwrap();
            if current_item.id == item_id {
                if !current_item.is_available { 
                    panic!("Maaf, barang ini sedang disewa orang lain"); 
                }
                target_idx = Some(i);
                matched_item = Some(current_item);
                break;
            }
        }

        let mut active_item = matched_item.expect("ID barang tidak ditemukan");
        let item_index = target_idx.unwrap();

        let total_rent_cost = active_item.rent_per_day * (duration as i128);
        let total_funds_to_lock = total_rent_cost + active_item.collateral;

        let token_address: Address = env.storage().instance().get(&TOKEN_ADDR).unwrap();
        let token_client = token::Client::new(&env, &token_address);
        
        // Pindahkan aset dari dompet penyewa ke dalam kontrol Smart Contract
        token_client.transfer(&renter, &env.current_contract_address(), &total_funds_to_lock);

        // Kunci status barang agar tidak bisa dirental orang lain lagi
        active_item.is_available = false;
        
        // FIX ERROR E0382: Gunakan .clone() agar active_item tidak hangus setelah dimasukkan ke array
        items.set(item_index, active_item.clone());
        env.storage().instance().set(&ITEMS_MAP, &items);

        let mut rentals: Vec<RentalTx> = env.storage().instance().get(&RENTALS_MAP).unwrap_or(Vec::new(&env));
        let mut current_rental_id: u64 = env.storage().instance().get(&RNT_CTR).unwrap_or(0);
        current_rental_id += 1;

        // Pembuatan objek transaksi sewa (Sekarang datanya bisa diakses dengan aman)
        let new_rental_tx = RentalTx {
            id: current_rental_id,
            item_id,
            renter,
            courier,
            collateral_locked: active_item.collateral,
            status: RentalStatus::Matching,
        };

        rentals.push_back(new_rental_tx);
        env.storage().instance().set(&RENTALS_MAP, &rentals);
        env.storage().instance().set(&RNT_CTR, &current_rental_id);

        current_rental_id
    }

    // Fungsi 4: LIVE STATUS UPDATE - Kurir mengupdate status perjalanan di blockchain (Matching -> Delivering -> Active)
    pub fn update_delivery_status(env: Env, courier: Address, rental_id: u64, new_status: u32) {
        courier.require_auth();
        let mut rentals: Vec<RentalTx> = env.storage().instance().get(&RENTALS_MAP).expect("Belum ada transaksi");
        let mut found = false;
        
        for i in 0..rentals.len() {
            let mut tx = rentals.get(i).unwrap();
            if tx.id == rental_id {
                if tx.courier != courier { 
                    panic!("Otorisasi Gagal: Anda bukan kurir resmi untuk pesanan ini!"); 
                }
                
                if new_status == 3 {
                    tx.status = RentalStatus::Delivering; // Kurir jalan antar barang
                } else if new_status == 0 {
                    tx.status = RentalStatus::Active;     // Barang sudah sampai, masa sewa mulai hitung
                } else {
                    panic!("Kode status tidak valid");
                }
                
                rentals.set(i, tx);
                found = true;
                break;
            }
        }
        
        if !found {
            panic!("ID Transaksi rental tidak ditemukan");
        }
        
        env.storage().instance().set(&RENTALS_MAP, &rentals);
    }

    // Fungsi 5: SELESAI PINJAM - Pemilik konfirmasi barang balik, dana terbagi otomatis secara desentralisasi
    pub fn complete_rental(env: Env, owner: Address, rental_id: u64, duration: u64, courier_fee: i128) {
        owner.require_auth();

        let mut rentals: Vec<RentalTx> = env.storage().instance().get(&RENTALS_MAP).expect("Transaksi kosong");
        let mut tx_index: u32 = 0;
        let mut found_tx: Option<RentalTx> = None;

        for i in 0..rentals.len() {
            let tx = rentals.get(i).unwrap();
            if tx.id == rental_id {
                if tx.status == RentalStatus::Completed {
                    panic!("Transaksi ini sudah diselesaikan");
                }
                tx_index = i;
                found_tx = Some(tx);
                break;
            }
        }

        let mut tx_data = found_tx.expect("ID Transaksi rental tidak terdaftar");
        
        let mut items: Vec<Item> = env.storage().instance().get(&ITEMS_MAP).expect("Katalog kosong");
        let mut item_idx: u32 = 0;
        let mut found_item: Option<Item> = None;

        for i in 0..items.len() {
            let item = items.get(i).unwrap();
            if item.id == tx_data.item_id {
                if item.owner != owner { 
                    panic!("Anda bukan pemilik sah barang dari transaksi ini"); 
                }
                item_idx = i;
                found_item = Some(item);
                break;
            }
        }

        let mut item_data = found_item.unwrap();
        let total_rent_earned = item_data.rent_per_day * (duration as i128);
        
        if courier_fee > total_rent_earned {
            panic!("Biaya kurir tidak boleh melampaui total omset sewa barang");
        }
        
        let net_owner_share = total_rent_earned - courier_fee;

        let token_address: Address = env.storage().instance().get(&TOKEN_ADDR).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        // 1. Kirim laba sewa bersih ke dompet Pemilik Barang
        if net_owner_share > 0 {
            token_client.transfer(&env.current_contract_address(), &owner, &net_owner_share);
        }
        
        // 2. Kirim bayaran kurir ke dompet Kurir
        if courier_fee > 0 {
            token_client.transfer(&env.current_contract_address(), &tx_data.courier, &courier_fee);
        }
        
        // 3. Kembalikan uang jaminan penuh tanpa potongan sepeser pun ke dompet Penyewa asli
        token_client.transfer(&env.current_contract_address(), &tx_data.renter, &tx_data.collateral_locked);

        // Reset status barang menjadi tersedia kembali di katalog umum
        item_data.is_available = true;
        items.set(item_idx, item_data);
        env.storage().instance().set(&ITEMS_MAP, &items);

        // Ubah status riwayat transaksi menjadi selesai
        tx_data.status = RentalStatus::Completed;
        rentals.set(tx_index, tx_data);
        env.storage().instance().set(&RENTALS_MAP, &rentals);
    }

    // Fungsi 6: LIHAT KATALOG - Mengembalikan list barang lengkap beserta koordinat Google Maps bawaannya
    pub fn get_catalog(env: Env) -> Vec<Item> {
        env.storage().instance().get(&ITEMS_MAP).unwrap_or(Vec::new(&env))
    }
}