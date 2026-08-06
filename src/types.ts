export type GenderType = "Putri" | "Putra" | "Campur";

export type RoomStatus = "Terisi" | "Kosong" | "Akan Jatuh Tempo" | "Terlambat" | "Maintenance";

export type PaymentStatus = "Lunas" | "Akan Jatuh Tempo" | "Terlambat";

export type PaymentMethod = "Cash" | "Transfer" | "QRIS";

export type UserRole = "Pemilik" | "Penjaga Kost" | "Admin";

export interface House {
  id: string;
  name: string; // e.g. "Rumah 1", "Rumah 2", "Rumah 3", "Rumah 4", "Rumah 5", "GJI Baru", "Homestay"
  gender: GenderType;
  totalRooms: number;
  description?: string;
  address?: string;
}

export interface Room {
  id: string;
  houseId: string;
  houseName: string;
  roomNumber: string; // e.g. "Pav", "KM3", "KM4", "KM1", etc.
  type: string; // "Standard", "VIP / Paviliun", "Homestay"
  tariff: number; // e.g. 600000, 650000, 700000
  status: RoomStatus;
  currentTenantId?: string;
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  houseId: string;
  houseName: string;
  roomId: string;
  roomNumber: string;
  gender: "Putri" | "Putra";
  phone: string; // WhatsApp e.g. "08123456789"
  entryDate: string; // YYYY-MM-DD or DD MMMM
  dueDate: string; // YYYY-MM-DD or DD MMMM
  tariff: number;
  paymentStatus: PaymentStatus;
  nik?: string;
  address?: string;
  cityOrigin?: string;
  occupation?: string; // e.g. "Mahasiswi UGM", "Pekerja", "Staff"
  institution?: string; // e.g. "Universitas Gadjah Mada", "UNY", "PT Telkom"
  exitDate?: string;
  ktpDocUrl?: string; // Base64 or mock URL
  contractDocUrl?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "KWT/GJI/2026/08/001"
  tenantId: string;
  tenantName: string;
  houseName: string;
  roomNumber: string;
  amount: number;
  date: string; // YYYY-MM-DD
  monthPeriod: string; // e.g. "Agustus 2026"
  method: PaymentMethod;
  proofUrl?: string;
  notes?: string;
  recordedBy: string;
}

export interface Expense {
  id: string;
  title: string;
  category: "Listrik / PLN" | "Air / PAM" | "Perbaikan & Maintenance" | "Gaji Penjaga" | "Kebersihan & Sampah" | "Internet / WiFi" | "Lain-lain";
  amount: number;
  date: string; // YYYY-MM-DD
  houseName: string;
  notes?: string;
}

export interface MeterReading {
  id: string;
  houseName: string;
  roomNumber: string;
  utilityType: "Listrik (PLN)" | "Air (PAM)";
  previousReading: number;
  currentReading: number;
  usage: number; // currentReading - previousReading
  ratePerUnit: number;
  totalCost: number;
  readingDate: string;
}

export interface InventoryItem {
  id: string;
  houseName: string;
  roomNumber: string;
  itemName: string; // "Kasur Busa / Springbed", "Lemari Pakaian", "Meja Belajar", "Kursi", "AC", "Kunci Kamar"
  condition: "Bagus" | "Perlu Perbaikan" | "Rusak";
  lastChecked: string;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  houseName: string;
  roomNumber: string;
  issue: string; // e.g., "AC kurang dingin", "Kran bocor", "Lampu mati"
  reportedDate: string;
  status: "Diproses" | "Selesai" | "Pending";
  cost?: number;
  technician?: string;
}

export interface ActivityCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "Jatuh Tempo" | "Check-In" | "Check-Out" | "Inspeksi Kamar" | "Maintenance";
  houseName?: string;
  roomNumber?: string;
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success" | "danger";
  date: string;
  read: boolean;
}

export interface AIPredictionResult {
  predictedRevenueNextMonth: number;
  predictedOccupancyRate: number;
  riskTenants: Array<{ name: string; house: string; room: string; reason: string }>;
  pricingRecommendations: Array<{ house: string; currentPriceRange: string; recommendedPrice: string; reason: string }>;
  vacantRoomStrategy: Array<{ room: string; house: string; daysVacantApprox: number; actionTip: string }>;
  summaryInsight: string;
}
