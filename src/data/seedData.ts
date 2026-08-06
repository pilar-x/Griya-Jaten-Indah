import {
  House,
  Room,
  Tenant,
  Payment,
  Expense,
  MeterReading,
  InventoryItem,
  MaintenanceLog,
  ActivityCalendarEvent,
  AppNotification
} from "../types";

export const initialHouses: House[] = [
  {
    id: "h1",
    name: "Rumah 1",
    gender: "Putri",
    totalRooms: 7,
    description: "Kost Putri Area Depan, dekat gazebo & parkir motor utama.",
    address: "Jl. Griya Jaten Indah No. 1, Sleman, DI Yogyakarta",
  },
  {
    id: "h2",
    name: "Rumah 2",
    gender: "Putra",
    totalRooms: 7,
    description: "Kost Putra Area Tengah, dilengkapi dapur bersama & jemuran.",
    address: "Jl. Griya Jaten Indah No. 2, Sleman, DI Yogyakarta",
  },
  {
    id: "h3",
    name: "Rumah 3",
    gender: "Putra",
    totalRooms: 7,
    description: "Kost Putra Area Barat, tenang & nyaman untuk mahasiswa.",
    address: "Jl. Griya Jaten Indah No. 3, Sleman, DI Yogyakarta",
  },
  {
    id: "h4",
    name: "Rumah 4",
    gender: "Putri",
    totalRooms: 7,
    description: "Kost Putri Area Samping, lengkap ruang santai & pos penjaga.",
    address: "Jl. Griya Jaten Indah No. 4, Sleman, DI Yogyakarta",
  },
  {
    id: "h5",
    name: "Rumah 5",
    gender: "Putri",
    totalRooms: 7,
    description: "Kost Putri Asri, dekat kebun & fasilitas mesin cuci bersama.",
    address: "Jl. Griya Jaten Indah No. 5, Sleman, DI Yogyakarta",
  },
  {
    id: "h6",
    name: "GJI Baru",
    gender: "Putri",
    totalRooms: 10,
    description: "Gedung Baru Modern 2 Lantai, kamar mandi dalam & AC.",
    address: "Jl. Griya Jaten Indah Blok Baru, Sleman, DI Yogyakarta",
  },
  {
    id: "h7",
    name: "Homestay",
    gender: "Campur",
    totalRooms: 1,
    description: "Unit Paviliun Eksklusif Homestay harian/bulanan full furnish.",
    address: "Jl. Griya Jaten Indah No. 8, Sleman, DI Yogyakarta",
  },
  {
    id: "h8",
    name: "GJI Ekstensi (Tahap Pembangunan)",
    gender: "Campur",
    totalRooms: 10,
    description: "Proyek konstruksi 10 kamar tambahan baru (Estimasi rampung Q4 2026). Total unit nanti 56 kamar.",
    address: "Jl. Griya Jaten Indah Blok Ekstensi, Sleman, DI Yogyakarta",
  },
];

export const initialRooms: Room[] = [
  // Rumah 1 (Putri) - 7 kamar
  { id: "r1_pav", houseId: "h1", houseName: "Rumah 1", roomNumber: "Pav", type: "Paviliun", tariff: 700000, status: "Terisi", currentTenantId: "t1_1" },
  { id: "r1_km3", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM3", type: "Standard", tariff: 700000, status: "Terisi", currentTenantId: "t1_2" },
  { id: "r1_km4", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM4", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t1_3" },
  { id: "r1_km5", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM5", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t1_4" },
  { id: "r1_km6", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM6", type: "Standard", tariff: 650000, status: "Akan Jatuh Tempo", currentTenantId: "t1_5" },
  { id: "r1_km7", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM7", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t1_6" },
  { id: "r1_km8", houseId: "h1", houseName: "Rumah 1", roomNumber: "KM8", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t1_7" },

  // Rumah 2 (Putra) - 7 kamar
  { id: "r2_pav", houseId: "h2", houseName: "Rumah 2", roomNumber: "Pav", type: "Paviliun", tariff: 700000, status: "Terisi", currentTenantId: "t2_1" },
  { id: "r2_km3", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM3", type: "Standard", tariff: 700000, status: "Terlambat", currentTenantId: "t2_2" },
  { id: "r2_km4", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM4", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t2_3" },
  { id: "r2_km5", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM5", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t2_4" },
  { id: "r2_km6", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM6", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t2_5" },
  { id: "r2_km7", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM7", type: "Standard", tariff: 600000, status: "Akan Jatuh Tempo", currentTenantId: "t2_6" },
  { id: "r2_km8", houseId: "h2", houseName: "Rumah 2", roomNumber: "KM8", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t2_7" },

  // Rumah 3 (Putra) - 7 kamar
  { id: "r3_pav", houseId: "h3", houseName: "Rumah 3", roomNumber: "Pav", type: "Paviliun", tariff: 700000, status: "Terisi", currentTenantId: "t3_1" },
  { id: "r3_km3", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM3", type: "Standard", tariff: 700000, status: "Terisi", currentTenantId: "t3_2" },
  { id: "r3_km4", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM4", type: "Standard", tariff: 650000, status: "Terlambat", currentTenantId: "t3_3" },
  { id: "r3_km5", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM5", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t3_4" },
  { id: "r3_km6", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM6", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t3_5" },
  { id: "r3_km7", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM7", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t3_6" },
  { id: "r3_km8", houseId: "h3", houseName: "Rumah 3", roomNumber: "KM8", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t3_7" },

  // Rumah 4 (Putri) - 7 kamar
  { id: "r4_pav", houseId: "h4", houseName: "Rumah 4", roomNumber: "Pav", type: "Paviliun", tariff: 700000, status: "Terisi", currentTenantId: "t4_1" },
  { id: "r4_km3", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM3", type: "Standard", tariff: 700000, status: "Terisi", currentTenantId: "t4_2" },
  { id: "r4_km4", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM4", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t4_3" },
  { id: "r4_km5", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM5", type: "Standard", tariff: 650000, status: "Akan Jatuh Tempo", currentTenantId: "t4_4" },
  { id: "r4_km6", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM6", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t4_5" },
  { id: "r4_km7", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM7", type: "Standard", tariff: 600000, status: "Kosong", notes: "Siap huni, cat baru" },
  { id: "r4_km8", houseId: "h4", houseName: "Rumah 4", roomNumber: "KM8", type: "Mess Staff", tariff: 0, status: "Maintenance", notes: "Kamar Penjaga Kost (Mbak Siska)" },

  // Rumah 5 (Putri) - 7 kamar
  { id: "r5_pav", houseId: "h5", houseName: "Rumah 5", roomNumber: "Pav", type: "Paviliun", tariff: 700000, status: "Terisi", currentTenantId: "t5_1" },
  { id: "r5_km3", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM3", type: "Standard", tariff: 700000, status: "Akan Jatuh Tempo", currentTenantId: "t5_2" },
  { id: "r5_km4", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM4", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t5_3" },
  { id: "r5_km5", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM5", type: "Standard", tariff: 650000, status: "Terisi", currentTenantId: "t5_4" },
  { id: "r5_km6", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM6", type: "Standard", tariff: 600000, status: "Terisi", currentTenantId: "t5_5" },
  { id: "r5_km7", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM7", type: "Gudang", tariff: 0, status: "Maintenance", notes: "Gudang Penyimpanan Barang Properti" },
  { id: "r5_km8", houseId: "h5", houseName: "Rumah 5", roomNumber: "KM8", type: "Standard", tariff: 600000, status: "Kosong", notes: "Kamar Kosong" },

  // GJI Baru (Putri) - 10 kamar
  { id: "rgji_km1", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM1", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_1" },
  { id: "rgji_km2", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM2", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_2" },
  { id: "rgji_km3", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM3", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_3" },
  { id: "rgji_km4", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM4", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_4" },
  { id: "rgji_km5", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM5", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_5" },
  { id: "rgji_km6", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM6", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_6" },
  { id: "rgji_km7", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM7", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_7" },
  { id: "rgji_km8", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM8", type: "GJI Baru Modern", tariff: 650000, status: "Terisi", currentTenantId: "tgji_8" },
  { id: "rgji_km9", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM9", type: "GJI Baru Modern", tariff: 700000, status: "Terisi", currentTenantId: "tgji_9" },
  { id: "rgji_km10", houseId: "h6", houseName: "GJI Baru", roomNumber: "KM10", type: "GJI Baru Modern", tariff: 700000, status: "Kosong", notes: "Siap huni, fasilitas AC & K.Mandi Dalam" },

  // Homestay - 1 kamar
  { id: "rhome_pav", houseId: "h7", houseName: "Homestay", roomNumber: "Pav", type: "Homestay VIP", tariff: 700000, status: "Terisi", currentTenantId: "thome_1" },

  // GJI Ekstensi (Dalam Pembangunan) - 10 kamar baru
  { id: "rekst_p1", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P1", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p2", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P2", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p3", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P3", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p4", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P4", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p5", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P5", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p6", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P6", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p7", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P7", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p8", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P8", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p9", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P9", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
  { id: "rekst_p10", houseId: "h8", houseName: "GJI Ekstensi", roomNumber: "P10", type: "Tahap Pembangunan", tariff: 750000, status: "Maintenance", notes: "Sedang dibangun (Proyek 10 Kamar Baru)" },
];

export const initialTenants: Tenant[] = [
  // Rumah 1 (Putri)
  { id: "t1_1", name: "Priska", houseId: "h1", houseName: "Rumah 1", roomId: "r1_pav", roomNumber: "Pav", gender: "Putri", phone: "081223344551", entryDate: "2024-06-21", dueDate: "2026-08-21", tariff: 700000, paymentStatus: "Lunas", nik: "3404015206980001", cityOrigin: "Semarang", occupation: "Mahasiswi", institution: "UGM" },
  { id: "t1_2", name: "Ulfa", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km3", roomNumber: "KM3", gender: "Putri", phone: "081223344552", entryDate: "2024-05-11", dueDate: "2026-08-11", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Solo", occupation: "Mahasiswi", institution: "UNY" },
  { id: "t1_3", name: "Arin", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km4", roomNumber: "KM4", gender: "Putri", phone: "081223344553", entryDate: "2024-04-26", dueDate: "2026-08-26", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Magelang", occupation: "Karyawati", institution: "Bank BNI" },
  { id: "t1_4", name: "Yashinta", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km5", roomNumber: "KM5", gender: "Putri", phone: "081223344554", entryDate: "2024-06-10", dueDate: "2026-08-10", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Purwokerto", occupation: "Mahasiswi", institution: "UGM" },
  { id: "t1_5", name: "Marcela", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km6", roomNumber: "KM6", gender: "Putri", phone: "081223344555", entryDate: "2024-07-14", dueDate: "2026-08-14", tariff: 650000, paymentStatus: "Akan Jatuh Tempo", cityOrigin: "Surakarta", occupation: "Mahasiswi", institution: "Atma Jaya" },
  { id: "t1_6", name: "Hafizah", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km7", roomNumber: "KM7", gender: "Putri", phone: "081223344556", entryDate: "2024-06-30", dueDate: "2026-08-30", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Tegal", occupation: "Mahasiswi", institution: "UIN Suka" },
  { id: "t1_7", name: "Cindy", houseId: "h1", houseName: "Rumah 1", roomId: "r1_km8", roomNumber: "KM8", gender: "Putri", phone: "081223344557", entryDate: "2024-06-29", dueDate: "2026-08-29", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Pekalongan", occupation: "Karyawati", institution: "RS Sardjito" },

  // Rumah 2 (Putra)
  { id: "t2_1", name: "Meilia (Putri)", houseId: "h2", houseName: "Rumah 2", roomId: "r2_pav", roomNumber: "Pav", gender: "Putri", phone: "081334455661", entryDate: "2024-05-17", dueDate: "2026-08-17", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Banyumas", occupation: "Dokter Muda", institution: "RSUD Sleman" },
  { id: "t2_2", name: "Julian", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km3", roomNumber: "KM3", gender: "Putra", phone: "081334455662", entryDate: "2024-02-06", dueDate: "2026-08-06", tariff: 700000, paymentStatus: "Terlambat", cityOrigin: "Jakarta", occupation: "Mahasiswa", institution: "UGM" },
  { id: "t2_3", name: "Elan", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km4", roomNumber: "KM4", gender: "Putra", phone: "081334455663", entryDate: "2024-04-30", dueDate: "2026-08-30", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Bandung", occupation: "Software Engineer", institution: "Startup" },
  { id: "t2_4", name: "Naufan", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km5", roomNumber: "KM5", gender: "Putra", phone: "081334455664", entryDate: "2024-05-01", dueDate: "2026-08-01", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Cirebon", occupation: "Mahasiswa", institution: "UNY" },
  { id: "t2_5", name: "Hadziq", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km6", roomNumber: "KM6", gender: "Putra", phone: "081334455665", entryDate: "2024-06-17", dueDate: "2026-08-17", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Kediri", occupation: "Mahasiswa", institution: "UII" },
  { id: "t2_6", name: "Alwi", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km7", roomNumber: "KM7", gender: "Putra", phone: "081334455666", entryDate: "2024-11-01", dueDate: "2026-08-01", tariff: 600000, paymentStatus: "Akan Jatuh Tempo", cityOrigin: "Malang", occupation: "Mahasiswa", institution: "UGM" },
  { id: "t2_7", name: "Muh. Sophy", houseId: "h2", houseName: "Rumah 2", roomId: "r2_km8", roomNumber: "KM8", gender: "Putra", phone: "081334455667", entryDate: "2024-07-13", dueDate: "2026-08-13", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Surabaya", occupation: "Mahasiswa", institution: "UPN" },

  // Rumah 3 (Putra)
  { id: "t3_1", name: "Fahri", houseId: "h3", houseName: "Rumah 3", roomId: "r3_pav", roomNumber: "Pav", gender: "Putra", phone: "081445566771", entryDate: "2024-06-21", dueDate: "2026-08-21", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Semarang", occupation: "Mahasiswa", institution: "UGM" },
  { id: "t3_2", name: "Dimas", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km3", roomNumber: "KM3", gender: "Putra", phone: "081445566772", entryDate: "2024-09-20", dueDate: "2026-08-20", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Bogor", occupation: "Mahasiswa", institution: "UGM" },
  { id: "t3_3", name: "Imdadu", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km4", roomNumber: "KM4", gender: "Putra", phone: "081445566773", entryDate: "2024-03-15", dueDate: "2026-08-15", tariff: 650000, paymentStatus: "Terlambat", cityOrigin: "Pati", occupation: "Mahasiswa", institution: "UNY" },
  { id: "t3_4", name: "Dhimas", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km5", roomNumber: "KM5", gender: "Putra", phone: "081445566774", entryDate: "2024-01-24", dueDate: "2026-08-24", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Kudus", occupation: "Freelancer", institution: "Self-Employed" },
  { id: "t3_5", name: "Ilyasa", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km6", roomNumber: "KM6", gender: "Putra", phone: "081445566775", entryDate: "2024-02-01", dueDate: "2026-08-01", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Jepara", occupation: "Mahasiswa", institution: "UII" },
  { id: "t3_6", name: "Iqbal", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km7", roomNumber: "KM7", gender: "Putra", phone: "081445566776", entryDate: "2024-02-07", dueDate: "2026-08-07", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Blora", occupation: "Mahasiswa", institution: "Amikom" },
  { id: "t3_7", name: "Hasbi", houseId: "h3", houseName: "Rumah 3", roomId: "r3_km8", roomNumber: "KM8", gender: "Putra", phone: "081445566777", entryDate: "2024-06-30", dueDate: "2026-08-30", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Remabang", occupation: "Mahasiswa", institution: "UGM" },

  // Rumah 4 (Putri)
  { id: "t4_1", name: "Ari Sindi", houseId: "h4", houseName: "Rumah 4", roomId: "r4_pav", roomNumber: "Pav", gender: "Putri", phone: "081556677881", entryDate: "2024-04-01", dueDate: "2026-08-01", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Yogyakarta", occupation: "Karyawati", institution: "BCA" },
  { id: "t4_2", name: "Fathia L.", houseId: "h4", houseName: "Rumah 4", roomId: "r4_km3", roomNumber: "KM3", gender: "Putri", phone: "081556677882", entryDate: "2024-01-13", dueDate: "2026-08-13", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Magelang", occupation: "Mahasiswi", institution: "UGM" },
  { id: "t4_3", name: "Anes", houseId: "h4", houseName: "Rumah 4", roomId: "r4_km4", roomNumber: "KM4", gender: "Putri", phone: "081556677883", entryDate: "2024-01-21", dueDate: "2026-08-21", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Klaten", occupation: "Mahasiswi", institution: "Atma Jaya" },
  { id: "t4_4", name: "Zulfa", houseId: "h4", houseName: "Rumah 4", roomId: "r4_km5", roomNumber: "KM5", gender: "Putri", phone: "081556677884", entryDate: "2024-06-08", dueDate: "2026-08-08", tariff: 650000, paymentStatus: "Akan Jatuh Tempo", cityOrigin: "Boyolali", occupation: "Mahasiswi", institution: "UNY" },
  { id: "t4_5", name: "Eka Nur", houseId: "h4", houseName: "Rumah 4", roomId: "r4_km6", roomNumber: "KM6", gender: "Putri", phone: "081556677885", entryDate: "2024-05-24", dueDate: "2026-08-24", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Purworejo", occupation: "Perawat", institution: "Klinik Utama" },

  // Rumah 5 (Putri)
  { id: "t5_1", name: "Dewi", houseId: "h5", houseName: "Rumah 5", roomId: "r5_pav", roomNumber: "Pav", gender: "Putri", phone: "081667788991", entryDate: "2024-05-18", dueDate: "2026-08-18", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Wonogiri", occupation: "Mahasiswi", institution: "UGM" },
  { id: "t5_2", name: "Emiya", houseId: "h5", houseName: "Rumah 5", roomId: "r5_km3", roomNumber: "KM3", gender: "Putri", phone: "081667788992", entryDate: "2024-07-21", dueDate: "2026-08-21", tariff: 700000, paymentStatus: "Akan Jatuh Tempo", cityOrigin: "Kebumen", occupation: "Mahasiswi", institution: "UGM" },
  { id: "t5_3", name: "Nungky", houseId: "h5", houseName: "Rumah 5", roomId: "r5_km4", roomNumber: "KM4", gender: "Putri", phone: "081667788993", entryDate: "2024-05-15", dueDate: "2026-08-15", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Cilacap", occupation: "Karyawati", institution: "Apotek" },
  { id: "t5_4", name: "Aulia", houseId: "h5", houseName: "Rumah 5", roomId: "r5_km5", roomNumber: "KM5", gender: "Putri", phone: "081667788994", entryDate: "2024-06-15", dueDate: "2026-08-15", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Brebes", occupation: "Mahasiswi", institution: "UIN Suka" },
  { id: "t5_5", name: "Intan", houseId: "h5", houseName: "Rumah 5", roomId: "r5_km6", roomNumber: "KM6", gender: "Putri", phone: "081667788995", entryDate: "2024-11-22", dueDate: "2026-08-22", tariff: 600000, paymentStatus: "Lunas", cityOrigin: "Banyuwangi", occupation: "Mahasiswi", institution: "UNY" },

  // GJI Baru (Putri)
  { id: "tgji_1", name: "Desi", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km1", roomNumber: "KM1", gender: "Putri", phone: "081778899001", entryDate: "2024-05-14", dueDate: "2026-08-14", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Jember", occupation: "Mahasiswi", institution: "UGM" },
  { id: "tgji_2", name: "Deva", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km2", roomNumber: "KM2", gender: "Putri", phone: "081778899002", entryDate: "2024-05-14", dueDate: "2026-08-14", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Madiun", occupation: "Mahasiswi", institution: "UGM" },
  { id: "tgji_3", name: "Sahiroh", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km3", roomNumber: "KM3", gender: "Putri", phone: "081778899003", entryDate: "2024-01-11", dueDate: "2026-08-11", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Ngawi", occupation: "Mahasiswi", institution: "UNY" },
  { id: "tgji_4", name: "Ulfah", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km4", roomNumber: "KM4", gender: "Putri", phone: "081778899004", entryDate: "2024-05-06", dueDate: "2026-08-06", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Ponorogo", occupation: "Mahasiswi", institution: "UGM" },
  { id: "tgji_5", name: "Diva", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km5", roomNumber: "KM5", gender: "Putri", phone: "081778899005", entryDate: "2024-06-01", dueDate: "2026-08-01", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Tulungagung", occupation: "Mahasiswi", institution: "Amikom" },
  { id: "tgji_6", name: "Putri", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km6", roomNumber: "KM6", gender: "Putri", phone: "081778899006", entryDate: "2024-05-14", dueDate: "2026-08-14", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Blitar", occupation: "Mahasiswi", institution: "Atma Jaya" },
  { id: "tgji_7", name: "Indah", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km7", roomNumber: "KM7", gender: "Putri", phone: "081778899007", entryDate: "2024-06-03", dueDate: "2026-08-03", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Nganjuk", occupation: "Mahasiswi", institution: "UII" },
  { id: "tgji_8", name: "Susi", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km8", roomNumber: "KM8", gender: "Putri", phone: "081778899008", entryDate: "2024-05-09", dueDate: "2026-08-09", tariff: 650000, paymentStatus: "Lunas", cityOrigin: "Trenggalek", occupation: "Karyawati", institution: "Distro" },
  { id: "tgji_9", name: "Anisa", houseId: "h6", houseName: "GJI Baru", roomId: "rgji_km9", roomNumber: "KM9", gender: "Putri", phone: "081778899009", entryDate: "2024-06-08", dueDate: "2026-08-08", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Mojokerto", occupation: "Mahasiswi", institution: "UGM" },

  // Homestay
  { id: "thome_1", name: "Bintang", houseId: "h7", houseName: "Homestay", roomId: "rhome_pav", roomNumber: "Pav", gender: "Putra", phone: "081889900111", entryDate: "2024-06-02", dueDate: "2026-08-02", tariff: 700000, paymentStatus: "Lunas", cityOrigin: "Denpasar", occupation: "Pekerja Remote", institution: "IT Consultant" },
];

export const initialPayments: Payment[] = [
  {
    id: "p1",
    receiptNumber: "KWT/GJI/2026/08/001",
    tenantId: "t1_1",
    tenantName: "Priska",
    houseName: "Rumah 1",
    roomNumber: "Pav",
    amount: 700000,
    date: "2026-08-01",
    monthPeriod: "Agustus 2026",
    method: "Transfer",
    recordedBy: "Admin",
    notes: "Pembayaran Sewa Bulan Agustus 2026"
  },
  {
    id: "p2",
    receiptNumber: "KWT/GJI/2026/08/002",
    tenantId: "t1_2",
    tenantName: "Ulfa",
    houseName: "Rumah 1",
    roomNumber: "KM3",
    amount: 700000,
    date: "2026-08-01",
    monthPeriod: "Agustus 2026",
    method: "QRIS",
    recordedBy: "Admin"
  },
  {
    id: "p3",
    receiptNumber: "KWT/GJI/2026/08/003",
    tenantId: "tgji_9",
    tenantName: "Anisa",
    houseName: "GJI Baru",
    roomNumber: "KM9",
    amount: 700000,
    date: "2026-08-02",
    monthPeriod: "Agustus 2026",
    method: "Transfer",
    recordedBy: "Pemilik"
  },
  {
    id: "p4",
    receiptNumber: "KWT/GJI/2026/08/004",
    tenantId: "thome_1",
    tenantName: "Bintang",
    houseName: "Homestay",
    roomNumber: "Pav",
    amount: 700000,
    date: "2026-08-02",
    monthPeriod: "Agustus 2026",
    method: "Cash",
    recordedBy: "Penjaga Kost"
  }
];

export const initialExpenses: Expense[] = [
  { id: "e1", title: "Pembayaran Listrik PLN Induk Rumah 1 & 2", category: "Listrik / PLN", amount: 1250000, date: "2026-08-01", houseName: "Rumah 1", notes: "Token PLN Utama" },
  { id: "e2", title: "Tagihan Air PAM Bulan Juli-Agustus", category: "Air / PAM", amount: 480000, date: "2026-08-02", houseName: "Semua Properti", notes: "Semua rumah" },
  { id: "e3", title: "Gaji Penjaga Kost (Mbak Siska)", category: "Gaji Penjaga", amount: 1800000, date: "2026-08-01", houseName: "Rumah 4", notes: "Gaji bulanan operasional" },
  { id: "e4", title: "Service & Cleaning AC GJI Baru KM1-KM5", category: "Perbaikan & Maintenance", amount: 350000, date: "2026-07-28", houseName: "GJI Baru", notes: "Cuci AC rutin" },
  { id: "e5", title: "Iuran Kebersihan & Keamanan RT/RW", category: "Kebersihan & Sampah", amount: 200000, date: "2026-08-01", houseName: "Semua Properti" },
  { id: "e6", title: "Langganan WiFi Biznet GJI Baru & Rumah 1", category: "Internet / WiFi", amount: 650000, date: "2026-08-02", houseName: "GJI Baru" },
];

export const initialMeters: MeterReading[] = [
  { id: "m1", houseName: "Rumah 1", roomNumber: "Pav", utilityType: "Listrik (PLN)", previousReading: 1240, currentReading: 1310, usage: 70, ratePerUnit: 1600, totalCost: 112000, readingDate: "2026-08-01" },
  { id: "m2", houseName: "Rumah 1", roomNumber: "KM3", utilityType: "Listrik (PLN)", previousReading: 890, currentReading: 955, usage: 65, ratePerUnit: 1600, totalCost: 104000, readingDate: "2026-08-01" },
  { id: "m3", houseName: "GJI Baru", roomNumber: "KM1", utilityType: "Listrik (PLN)", previousReading: 2100, currentReading: 2190, usage: 90, ratePerUnit: 1600, totalCost: 144000, readingDate: "2026-08-01" },
];

export const initialInventory: InventoryItem[] = [
  { id: "inv1", houseName: "Rumah 1", roomNumber: "Pav", itemName: "Kasur Springbed No. 2", condition: "Bagus", lastChecked: "2026-07-25" },
  { id: "inv2", houseName: "Rumah 1", roomNumber: "Pav", itemName: "Lemari Kayu 2 Pintu", condition: "Bagus", lastChecked: "2026-07-25" },
  { id: "inv3", houseName: "Rumah 1", roomNumber: "Pav", itemName: "AC Sharp 0.5 PK", condition: "Bagus", lastChecked: "2026-07-25" },
  { id: "inv4", houseName: "Rumah 2", roomNumber: "KM3", itemName: "AC Panasonic 1/2 PK", condition: "Perlu Perbaikan", lastChecked: "2026-08-01", notes: "Suara kipas agak bising" },
  { id: "inv5", houseName: "Rumah 4", roomNumber: "KM7", itemName: "Kasur Busa Inoac", condition: "Bagus", lastChecked: "2026-08-02", notes: "Kamar kosong siap huni" },
];

export const initialMaintenanceLogs: MaintenanceLog[] = [
  { id: "maint1", houseName: "Rumah 2", roomNumber: "KM3", issue: "AC kurang dingin & berisik", reportedDate: "2026-08-01", status: "Diproses", technician: "Pak Supri (Teknisi AC)", cost: 150000 },
  { id: "maint2", houseName: "Rumah 5", roomNumber: "KM7", issue: "Pengecatan ulang dinding gudang", reportedDate: "2026-07-20", status: "Selesai", technician: "Pak Tukang", cost: 250000 },
];

export const initialCalendarEvents: ActivityCalendarEvent[] = [
  { id: "cal1", title: "Jatuh Tempo: Julian (R2 KM3)", date: "2026-08-06", type: "Jatuh Tempo", houseName: "Rumah 2", roomNumber: "KM3" },
  { id: "cal2", title: "Jatuh Tempo: Anisa (GJI Baru KM9)", date: "2026-08-08", type: "Jatuh Tempo", houseName: "GJI Baru", roomNumber: "KM9" },
  { id: "cal3", title: "Servis AC Rutin Rumah 1", date: "2026-08-10", type: "Maintenance", houseName: "Rumah 1" },
  { id: "cal4", title: "Inspeksi Kebersihan Bulanan", date: "2026-08-15", type: "Inspeksi Kamar" },
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif1",
    title: "Tagihan Terlambat!",
    message: "Julian (Rumah 2 KM3) belum membayar sewa yang jatuh tempo tanggal 6 Agustus.",
    type: "danger",
    date: "2026-08-03",
    read: false,
  },
  {
    id: "notif2",
    title: "Jatuh Tempo MINGGU INI",
    message: "Terdapat 4 penghuni yang jatuh tempo pembayaran dalam 7 hari ke depan.",
    type: "warning",
    date: "2026-08-03",
    read: false,
  },
  {
    id: "notif3",
    title: "Pembayaran Diterima",
    message: "Bintang (Homestay) telah membayar Rp 700.000 via Cash.",
    type: "success",
    date: "2026-08-02",
    read: true,
  }
];
