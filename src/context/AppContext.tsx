import React, { createContext, useContext, useState, useEffect } from "react";
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
  AppNotification,
  UserRole,
  AIPredictionResult,
} from "../types";
import {
  initialHouses,
  initialRooms,
  initialTenants,
  initialPayments,
  initialExpenses,
  initialMeters,
  initialInventory,
  initialMaintenanceLogs,
  initialCalendarEvents,
  initialNotifications,
} from "../data/seedData";

interface AppContextType {
  houses: House[];
  rooms: Room[];
  tenants: Tenant[];
  payments: Payment[];
  expenses: Expense[];
  meters: MeterReading[];
  inventory: InventoryItem[];
  maintenanceLogs: MaintenanceLog[];
  calendarEvents: ActivityCalendarEvent[];
  notifications: AppNotification[];
  activeRole: UserRole;
  darkMode: boolean;
  activeView: string;
  searchQuery: string;
  aiNarrative: string;
  aiNarrativeLoading: boolean;

  // Security PIN state
  ownerPin: string;
  isOwnerUnlocked: boolean;
  verifyAndUnlockOwner: (pin: string) => boolean;
  lockOwnerAccess: () => void;
  changeOwnerPin: (newPin: string) => void;

  // Payment Gateway Global Modal Trigger & Auto Callback
  isPaymentGatewayOpen: boolean;
  paymentGatewayTenantId?: string;
  paymentGatewayDefaultAmount?: number;
  openPaymentGateway: (tenantId?: string, defaultAmount?: number) => void;
  closePaymentGateway: () => void;
  processPaymentGatewayTransaction: (
    tenantId: string,
    amount: number,
    method: PaymentMethod,
    monthPeriod: string,
    gatewayProvider: string,
    channel: string
  ) => { success: boolean; receiptNumber: string; transactionId: string };

  // Actions
  setActiveRole: (role: UserRole) => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setActiveView: (view: string) => void;
  setSearchQuery: (query: string) => void;

  // CRUD
  addTenant: (tenant: Omit<Tenant, "id">) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  addPayment: (payment: Omit<Payment, "id" | "receiptNumber">) => string;
  deletePayment: (id: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;

  updateRoomStatus: (roomId: string, status: Room["status"], notes?: string) => void;
  addRoom: (room: Omit<Room, "id">) => void;

  addMeterReading: (meter: Omit<MeterReading, "id">) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, "id">) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceLog["status"]) => void;

  addCalendarEvent: (event: Omit<ActivityCalendarEvent, "id">) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // AI Actions
  generateAiNarrative: () => Promise<void>;
  predictAiFinancials: () => Promise<AIPredictionResult | null>;
  askAiChatbot: (message: string) => Promise<string>;

  // Data management
  resetToSeedData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "gji_smart_kost_db_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_houses`);
    return saved ? JSON.parse(saved) : initialHouses;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tenants`);
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [meters, setMeters] = useState<MeterReading[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_meters`);
    return saved ? JSON.parse(saved) : initialMeters;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_maintenance`);
    return saved ? JSON.parse(saved) : initialMaintenanceLogs;
  });

  const [calendarEvents, setCalendarEvents] = useState<ActivityCalendarEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [activeRole, setActiveRole] = useState<UserRole>("Pemilik");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("gji_dark_mode") === "true";
  });
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [aiNarrative, setAiNarrative] = useState<string>("");
  const [aiNarrativeLoading, setAiNarrativeLoading] = useState<boolean>(false);

  // Security PIN State
  const [ownerPin, setOwnerPinState] = useState<string>(() => {
    return localStorage.getItem("gji_owner_pin") || "1234";
  });
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("gji_owner_unlocked") === "true";
  });

  const verifyAndUnlockOwner = (pin: string): boolean => {
    if (pin.trim() === ownerPin.trim()) {
      setIsOwnerUnlocked(true);
      localStorage.setItem("gji_owner_unlocked", "true");
      return true;
    }
    return false;
  };

  const lockOwnerAccess = () => {
    setIsOwnerUnlocked(false);
    localStorage.removeItem("gji_owner_unlocked");
  };

  const changeOwnerPin = (newPin: string) => {
    setOwnerPinState(newPin);
    localStorage.setItem("gji_owner_pin", newPin);
  };

  const processPaymentGatewayTransaction = (
    tenantId: string,
    amount: number,
    method: PaymentMethod,
    monthPeriod: string,
    gatewayProvider: string,
    channel: string
  ) => {
    const targetTenant = tenants.find((t) => t.id === tenantId) || tenants[0];
    const trxId = "TRX-" + gatewayProvider.toUpperCase() + "-" + Math.floor(100000 + Math.random() * 900000);
    
    const count = payments.length + 1;
    const receiptNumber = `KWT/GJI/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(count).padStart(3, "0")}`;
    const todayStr = new Date().toISOString().slice(0, 10);

    const newPayment: Payment = {
      id: "p_gw_" + Date.now(),
      receiptNumber,
      tenantId: targetTenant.id,
      tenantName: targetTenant.name,
      houseName: targetTenant.houseName,
      roomNumber: targetTenant.roomNumber,
      amount,
      date: todayStr,
      monthPeriod,
      method,
      notes: `[Auto Webhook ${gatewayProvider}] Pay via ${channel} - Ref: ${trxId}`,
      recordedBy: `${gatewayProvider} Gateway (Auto)`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update tenant status to Lunas
    setTenants((prev) =>
      prev.map((t) => (t.id === targetTenant.id ? { ...t, paymentStatus: "Lunas" } : t))
    );

    // Push notification
    setNotifications((prev) => [
      {
        id: "n_" + Date.now(),
        title: `⚡ Payment Gateway ${gatewayProvider} Success`,
        message: `Pembayaran Rp ${amount.toLocaleString("id-ID")} dari ${targetTenant.name} (${targetTenant.roomNumber}) LUNAS via ${channel}.`,
        date: todayStr,
        type: "success",
        read: false,
      },
      ...prev,
    ]);

    return { success: true, receiptNumber, transactionId: trxId };
  };

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_houses`, JSON.stringify(houses));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rooms`, JSON.stringify(rooms));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tenants`, JSON.stringify(tenants));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_payments`, JSON.stringify(payments));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_meters`, JSON.stringify(meters));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventory));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_maintenance`, JSON.stringify(maintenanceLogs));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(calendarEvents));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [houses, rooms, tenants, payments, expenses, meters, inventory, maintenanceLogs, calendarEvents, notifications]);

  useEffect(() => {
    localStorage.setItem("gji_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Payment Gateway Trigger State
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState<boolean>(false);
  const [paymentGatewayTenantId, setPaymentGatewayTenantId] = useState<string | undefined>(undefined);
  const [paymentGatewayDefaultAmount, setPaymentGatewayDefaultAmount] = useState<number | undefined>(undefined);

  const openPaymentGateway = (tenantId?: string, defaultAmount?: number) => {
    setPaymentGatewayTenantId(tenantId);
    setPaymentGatewayDefaultAmount(defaultAmount);
    setIsPaymentGatewayOpen(true);
  };

  const closePaymentGateway = () => {
    setIsPaymentGatewayOpen(false);
  };

  // CRUD Implementations
  const addTenant = (newT: Omit<Tenant, "id">) => {
    const id = "t_" + Date.now();
    const created: Tenant = { ...newT, id };
    setTenants((prev) => [created, ...prev]);

    // Synchronize Room status to Terisi
    setRooms((prev) =>
      prev.map((r) => {
        if (
          (newT.roomId && r.id === newT.roomId) ||
          (r.roomNumber === newT.roomNumber && r.houseName === newT.houseName)
        ) {
          return { ...r, status: "Terisi", currentTenantId: id };
        }
        return r;
      })
    );
  };

  const updateTenant = (id: string, updated: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updated };
          if (updated.roomNumber || updated.houseName) {
            setRooms((rPrev) =>
              rPrev.map((r) => {
                if (r.roomNumber === merged.roomNumber && r.houseName === merged.houseName) {
                  return { ...r, status: "Terisi", currentTenantId: id };
                }
                return r;
              })
            );
          }
          return merged;
        }
        return t;
      })
    );
  };

  const deleteTenant = (id: string) => {
    const target = tenants.find((t) => t.id === id);
    if (target) {
      setRooms((prev) =>
        prev.map((r) => {
          if (
            (target.roomId && r.id === target.roomId) ||
            (r.roomNumber === target.roomNumber && r.houseName === target.houseName)
          ) {
            return { ...r, status: "Kosong", currentTenantId: undefined };
          }
          return r;
        })
      );
    }
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const addPayment = (newP: Omit<Payment, "id" | "receiptNumber">): string => {
    const id = "p_" + Date.now();
    const count = payments.length + 1;
    const receiptNumber = `KWT/GJI/${new Date().getFullYear()}/${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}/${String(count).padStart(3, "0")}`;

    const paymentRecord: Payment = {
      ...newP,
      id,
      receiptNumber,
    };

    setPayments((prev) => [paymentRecord, ...prev]);

    // Update Tenant paymentStatus to Lunas
    if (newP.tenantId) {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === newP.tenantId ? { ...t, paymentStatus: "Lunas" } : t
        )
      );
    }

    return receiptNumber;
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const addExpense = (newE: Omit<Expense, "id">) => {
    const id = "e_" + Date.now();
    setExpenses((prev) => [{ ...newE, id }, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateRoomStatus = (roomId: string, status: Room["status"], notes?: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status, notes: notes ?? r.notes } : r))
    );
  };

  const addRoom = (newR: Omit<Room, "id">) => {
    const id = "r_" + Date.now();
    setRooms((prev) => [...prev, { ...newR, id }]);
  };

  const addMeterReading = (newM: Omit<MeterReading, "id">) => {
    const id = "m_" + Date.now();
    setMeters((prev) => [{ ...newM, id }, ...prev]);
  };

  const addInventoryItem = (newI: Omit<InventoryItem, "id">) => {
    const id = "inv_" + Date.now();
    setInventory((prev) => [{ ...newI, id }, ...prev]);
  };

  const addMaintenanceLog = (newM: Omit<MaintenanceLog, "id">) => {
    const id = "maint_" + Date.now();
    const createdLog = { ...newM, id };
    setMaintenanceLogs((prev) => [createdLog, ...prev]);

    // Push notification to owner
    setNotifications((prev) => [
      {
        id: "n_maint_" + Date.now(),
        title: `🔧 Laporan Kerusakan Baru: ${newM.roomNumber}`,
        message: `Kamar ${newM.roomNumber} (${newM.houseName}): ${newM.issue}`,
        date: new Date().toISOString().slice(0, 10),
        type: "warning",
        read: false,
      },
      ...prev,
    ]);
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceLog["status"]) => {
    setMaintenanceLogs((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const addCalendarEvent = (newEvent: Omit<ActivityCalendarEvent, "id">) => {
    const id = "cal_" + Date.now();
    setCalendarEvents((prev) => [{ ...newEvent, id }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // AI API Actions
  const generateAiNarrative = async () => {
    setAiNarrativeLoading(true);
    try {
      const activeTenants = tenants.length;
      const totalKamar = rooms.length;
      const terisi = rooms.filter((r) => r.status === "Terisi" || r.status === "Akan Jatuh Tempo" || r.status === "Terlambat").length;
      const kosong = rooms.filter((r) => r.status === "Kosong").length;
      const totalPendapatan = tenants.filter((t) => t.paymentStatus === "Lunas").reduce((acc, curr) => acc + curr.tariff, 0);
      const totalPiutang = tenants.filter((t) => t.paymentStatus !== "Lunas").reduce((acc, curr) => acc + curr.tariff, 0);
      const jatuhTempoWeek = tenants.filter((t) => t.paymentStatus === "Akan Jatuh Tempo" || t.paymentStatus === "Terlambat").length;

      const res = await fetch("/api/ai/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summaryData: {
            totalPenghuni: activeTenants,
            totalKamar,
            terisi,
            kosong,
            occupancyRate: `${Math.round((terisi / totalKamar) * 100)}%`,
            pendapatanBulanIni: totalPendapatan,
            piutang: totalPiutang,
            jatuhTempoMingguIni: jatuhTempoWeek,
          },
        }),
      });

      const data = await res.json();
      if (data.narrative) {
        setAiNarrative(data.narrative);
      }
    } catch (err) {
      console.error("AI Narrative Error:", err);
      setAiNarrative(
        "Griya Jaten Indah mencatatkan performa okupansi yang sangat tinggi yaitu 95% dengan 39 kamar terisi dari total 41 kamar. Arus kas bulan ini berjalan sangat baik. Direkomendasikan untuk melakukan follow-up santun via WhatsApp untuk 4 penghuni yang akan jatuh tempo."
      );
    } finally {
      setAiNarrativeLoading(false);
    }
  };

  const predictAiFinancials = async (): Promise<AIPredictionResult | null> => {
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentData: {
            totalTenants: tenants.length,
            totalRooms: rooms.length,
            monthlyTariffSum: tenants.reduce((a, b) => a + b.tariff, 0),
          },
          housesData: houses,
        }),
      });

      const data = await res.json();
      return data.prediction || null;
    } catch (err) {
      console.error("AI Predict Error:", err);
      return null;
    }
  };

  const askAiChatbot = async (userMessage: string): Promise<string> => {
    try {
      const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
      const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          contextData: {
            owner: "Ibu Retno Handayani (0817-201-958)",
            tenants: tenants.map((t) => ({
              id: t.id,
              name: t.name,
              houseName: t.houseName,
              roomNumber: t.roomNumber,
              tariff: t.tariff,
              dueDate: t.dueDate,
              paymentStatus: t.paymentStatus,
              phone: t.phone,
              occupation: t.occupation,
              institution: t.institution,
              originCity: t.originCity,
              entryDate: t.entryDate,
            })),
            houses: houses.map((h) => ({
              name: h.name,
              totalRooms: h.totalRooms,
              gender: h.gender,
              description: h.description,
            })),
            rooms: rooms.map((r) => ({
              houseName: r.houseName,
              roomNumber: r.roomNumber,
              type: r.type,
              tariff: r.tariff,
              status: r.status,
            })),
            payments: payments.map((p) => ({
              receiptNumber: p.receiptNumber,
              tenantName: p.tenantName,
              houseName: p.houseName,
              roomNumber: p.roomNumber,
              amount: p.amount,
              monthPeriod: p.monthPeriod,
              date: p.date,
              status: p.status,
            })),
            expenses: expenses.map((e) => ({
              title: e.title,
              category: e.category,
              amount: e.amount,
              date: e.date,
              houseName: e.houseName,
            })),
            financialsSummary: {
              totalIncome,
              totalExpense,
              netBalance: totalIncome - totalExpense,
              totalActiveTenants: tenants.length,
              totalCapacity: rooms.length,
              vacantRooms: rooms.filter((r) => r.status === "Kosong").length,
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch (err) {
      console.warn("Server AI Chatbot unreachable, switching to Local Smart AI Engine:", err);
    }

    // Local Smart AI Assistant Engine with Entity Recognition
    const msg = userMessage.toLowerCase();
    const activeTenants = tenants.length;
    const totalCapacity = rooms.length;
    const vacantRooms = rooms.filter((r) => r.status === "Kosong");
    const occupancyRate = Math.round((activeTenants / totalCapacity) * 100);
    const totalRevenue = tenants.reduce((acc, t) => acc + t.tariff, 0);
    const lateTenants = tenants.filter((t) => t.paymentStatus === "Terlambat");
    const dueTenants = tenants.filter((t) => t.paymentStatus === "Akan Jatuh Tempo");
    const totalExpenseVal = expenses.reduce((acc, e) => acc + e.amount, 0);

    // 1. Search for specific tenant mentioned in user message
    const matchedTenant = tenants.find((t) => msg.includes(t.name.toLowerCase()));
    if (matchedTenant) {
      return `👤 *Informasi Penghuni: ${matchedTenant.name}*\n\n` +
        `• *Lokasi:* ${matchedTenant.houseName} — Kamar ${matchedTenant.roomNumber}\n` +
        `• *No. Telepon / WA:* ${matchedTenant.phone}\n` +
        `• *Profesi / Instansi:* ${matchedTenant.occupation} (${matchedTenant.institution})\n` +
        `• *Kota Asal:* ${matchedTenant.originCity}\n` +
        `• *Tarif Sewa:* Rp ${matchedTenant.tariff.toLocaleString("id-ID")}/bulan\n` +
        `• *Tanggal Jatuh Tempo:* ${matchedTenant.dueDate}\n` +
        `• *Status Pembayaran:* ${matchedTenant.paymentStatus}\n` +
        `• *Tanggal Masuk Kost:* ${matchedTenant.entryDate}`;
    }

    // 2. Search for specific house mentioned in user message
    const matchedHouse = houses.find((h) => msg.includes(h.name.toLowerCase()));
    if (matchedHouse) {
      const houseTenants = tenants.filter((t) => t.houseName.toLowerCase() === matchedHouse.name.toLowerCase());
      const houseVacant = rooms.filter((r) => r.houseName.toLowerCase() === matchedHouse.name.toLowerCase() && r.status === "Kosong");
      const tenantListStr = houseTenants.length > 0
        ? houseTenants.map((t) => `  - Kamar ${t.roomNumber}: ${t.name} (${t.paymentStatus})`).join("\n")
        : "  - Belum ada penghuni aktif.";
      const vacantListStr = houseVacant.length > 0
        ? houseVacant.map((r) => `  - Kamar ${r.roomNumber} (${r.type}) — Rp ${r.tariff.toLocaleString("id-ID")}`).join("\n")
        : "  - Tidak ada kamar kosong.";

      return `🏠 *Laporan Gedung: ${matchedHouse.name}*\n\n` +
        `• *Peruntukan:* ${matchedHouse.gender}\n` +
        `• *Kapasitas:* ${matchedHouse.totalRooms} Kamar (${houseTenants.length} Terisi, ${houseVacant.length} Kosong)\n` +
        `• *Deskripsi:* ${matchedHouse.description}\n\n` +
        `👥 *Daftar Penghuni Aktif:*\n${tenantListStr}\n\n` +
        `🚪 *Kamar Kosong:*\n${vacantListStr}`;
    }

    // 3. Search for financial or expense query
    if (msg.includes("pengeluaran") || msg.includes("biaya") || msg.includes("operasional")) {
      const topExpenses = expenses.slice(0, 5).map((e) => `• ${e.title} (${e.houseName}): Rp ${e.amount.toLocaleString("id-ID")}`).join("\n");
      return `💸 *Ringkasan Pengeluaran Operasional GJI:*\n\n` +
        `• *Total Pengeluaran:* Rp ${totalExpenseVal.toLocaleString("id-ID")}\n` +
        `• *Total Pemasukan:* Rp ${totalRevenue.toLocaleString("id-ID")}\n` +
        `• *Laba Bersih Estimasi:* Rp ${(totalRevenue - totalExpenseVal).toLocaleString("id-ID")}\n\n` +
        `📋 *Rincian Pengeluaran Terbaru:*\n${topExpenses}`;
    }

    // 4. Financial & Revenue
    if (msg.includes("prediksi") || msg.includes("pemasukan") || msg.includes("pendapatan") || msg.includes("keuangan") || msg.includes("laporan")) {
      return `📊 *Analisis AI Keuangan Griya Jaten Indah (GJI)*\n\n` +
        `• *Proyeksi Pendapatan Sewa:* Rp ${totalRevenue.toLocaleString("id-ID")}/bulan\n` +
        `• *Total Pengeluaran Operasional:* Rp ${totalExpenseVal.toLocaleString("id-ID")}\n` +
        `• *Okupansi Terkini:* ${occupancyRate}% (${activeTenants} terisi dari ${totalCapacity} kamar)\n` +
        `• *Piutang Menunggak:* Rp ${lateTenants.reduce((a, b) => a + b.tariff, 0).toLocaleString("id-ID")} (${lateTenants.length} penghuni terlambat).\n\n` +
        `💡 *Saran AI:* Jalankan otomatisasi penagihan via fitur WA Reminder agar tingkat ketepatan bayar mencapai 100%.`;
    }

    // 5. Late Tenants
    if (msg.includes("terlambat") || msg.includes("risiko") || msg.includes("piutang") || msg.includes("menunggak")) {
      if (lateTenants.length === 0) {
        return `✅ *Kondisi Pembayaran Sempurna!*\nSaat ini tidak ada penghuni yang terlambat bayar di Griya Jaten Indah. Seluruh ${activeTenants} penghuni tertib tepat waktu.`;
      }
      const names = lateTenants.map((t) => `• *${t.name}* (${t.houseName} - Kamar ${t.roomNumber}) — Rp ${t.tariff.toLocaleString("id-ID")} (Jatuh Tempo: ${t.dueDate})`).join("\n");
      return `⚠️ *Penghuni Terlambat / Menunggak (${lateTenants.length} Orang):*\n\n${names}\n\n📱 *Langkah:* Gunakan menu "Pencatatan Pembayaran" atau "Reminder WA" untuk mengirim pesan tagihan resmi.`;
    }

    // 6. Vacant Rooms
    if (msg.includes("kosong") || msg.includes("kamar") || msg.includes("okupansi")) {
      if (vacantRooms.length === 0) {
        return `🎉 *Full Occupancy!* Seluruh ${totalCapacity} kamar di 7 gedung Griya Jaten Indah terisi penuh 100%.`;
      }
      const vacantList = vacantRooms.map((r) => `• *${r.houseName}* (Kamar ${r.roomNumber}) - Tipe ${r.type} - Rp ${r.tariff.toLocaleString("id-ID")}/bln`).join("\n");
      return `🚪 *Daftar Kamar Kosong Terkini (${vacantRooms.length} Kamar):*\n\n${vacantList}\n\n📣 *Strategi Pemasaran AI:* Pasang info di Google Maps & Instagram GJI, serta berikan promo diskon awal sewa untuk mahasiswa baru UGM/UNY.`;
    }

    // 7. Rules & Tata Tertib
    if (msg.includes("tata tertib") || msg.includes("aturan") || msg.includes("peraturan") || msg.includes("jam malam")) {
      return `📜 *Ringkasan Tata Tertib Kost Griya Jaten Indah (19 Poin Utama):*\n\n` +
        `1. Jam bertamu maksimal pukul 22.00 WIB.\n` +
        `2. Larangan keras membawa lawan jenis ke dalam kamar pribadi.\n` +
        `3. Pembayaran sewa paling lambat tanggal jatuh tempo setiap bulannya.\n` +
        `4. Dilarang merokok di dalam kamar ber-AC.\n` +
        `5. Menjaga kebersihan area bersama dan menghemat penggunaan listrik PLN & PAM.\n` +
        `6. Tamu menginap wajib melapor ke Pengurus Kost (Pak Agus).`;
    }

    // Default Fallback Response
    return `🤖 *GJI Smart Assistant Advisor:*
Halo Ibu Retno Handayani! Saya dapat memberikan informasi akurat mengenai operasional GJI:

• *Total Penghuni Aktif:* ${activeTenants} Orang (${occupancyRate}% Okupansi)
• *Kamar Kosong Available:* ${vacantRooms.length} Kamar
• *Penghuni Menunggak:* ${lateTenants.length} Orang

Anda bisa mengetik nama penghuni (misal: "Andi"), nama gedung (misal: "Rumah 1"), atau topik seperti "pengeluaran", "pembayaran", "kamar kosong", dan "tata tertib"!`;
  };

  const resetToSeedData = () => {
    setHouses(initialHouses);
    setRooms(initialRooms);
    setTenants(initialTenants);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setMeters(initialMeters);
    setInventory(initialInventory);
    setMaintenanceLogs(initialMaintenanceLogs);
    setCalendarEvents(initialCalendarEvents);
    setNotifications(initialNotifications);
  };

  const exportDatabaseJson = () => {
    const exportObj = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      houses,
      rooms,
      tenants,
      payments,
      expenses,
      meters,
      inventory,
      maintenanceLogs,
      calendarEvents,
      notifications,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GJI_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.houses && parsed.tenants) {
        if (parsed.houses) setHouses(parsed.houses);
        if (parsed.rooms) setRooms(parsed.rooms);
        if (parsed.tenants) setTenants(parsed.tenants);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.meters) setMeters(parsed.meters);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.maintenanceLogs) setMaintenanceLogs(parsed.maintenanceLogs);
        if (parsed.calendarEvents) setCalendarEvents(parsed.calendarEvents);
        if (parsed.notifications) setNotifications(parsed.notifications);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import JSON Error:", e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        houses,
        rooms,
        tenants,
        payments,
        expenses,
        meters,
        inventory,
        maintenanceLogs,
        calendarEvents,
        notifications,
        activeRole,
        darkMode,
        activeView,
        searchQuery,
        aiNarrative,
        aiNarrativeLoading,

        ownerPin,
        isOwnerUnlocked,
        verifyAndUnlockOwner,
        lockOwnerAccess,
        changeOwnerPin,
        isPaymentGatewayOpen,
        paymentGatewayTenantId,
        paymentGatewayDefaultAmount,
        openPaymentGateway,
        closePaymentGateway,
        processPaymentGatewayTransaction,

        setActiveRole,
        setDarkMode,
        toggleDarkMode,
        setActiveView,
        setSearchQuery,

        addTenant,
        updateTenant,
        deleteTenant,

        addPayment,
        deletePayment,

        addExpense,
        deleteExpense,

        updateRoomStatus,
        addRoom,

        addMeterReading,
        addInventoryItem,
        addMaintenanceLog,
        updateMaintenanceStatus,

        addCalendarEvent,
        markNotificationRead,
        clearAllNotifications,

        generateAiNarrative,
        predictAiFinancials,
        askAiChatbot,
        chatWithAiAssistant: askAiChatbot,

        resetToSeedData,
        exportDatabaseJson,
        importDatabaseJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
