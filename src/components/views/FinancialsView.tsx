import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BanknotesIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  TrashIcon,
  ChartBarIcon,
  BuildingOffice2Icon
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export const FinancialsView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, tenants, houses, rooms } = useApp();

  const [activeTab, setActiveTab] = useState<"table" | "trend12m" | "building">("trend12m");
  const [showModal, setShowModal] = useState(false);
  const [houseName, setHouseName] = useState("Rumah 1");
  const [category, setCategory] = useState<any>("Listrik & Air");
  const [amount, setAmount] = useState<number>(150000);
  const [description, setDescription] = useState("Token Listrik PLN Koridor");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const totalIncome = tenants
    .filter((t) => t.paymentStatus === "Lunas")
    .reduce((sum, t) => sum + t.tariff, 0);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // 12-Month Financial Trend Mock Data
  const monthlyData12M = [
    { month: "Jan", gross: 18500000, expense: 2100000, net: 16400000, occupancy: 90 },
    { month: "Feb", gross: 19200000, expense: 2050000, net: 17150000, occupancy: 92 },
    { month: "Mar", gross: 19800000, expense: 2300000, net: 17500000, occupancy: 95 },
    { month: "Apr", gross: 19500000, expense: 1900000, net: 17600000, occupancy: 93 },
    { month: "Mei", gross: 20100000, expense: 2200000, net: 17900000, occupancy: 96 },
    { month: "Jun", gross: 20800000, expense: 2400000, net: 18400000, occupancy: 98 },
    { month: "Jul", gross: 21500000, expense: 2150000, net: 19350000, occupancy: 100 },
    { month: "Agt", gross: 22350000, expense: totalExpense || 2250000, net: 22350000 - (totalExpense || 2250000), occupancy: 98 },
    { month: "Sep", gross: 21800000, expense: 2100000, net: 19700000, occupancy: 97 },
    { month: "Okt", gross: 22000000, expense: 2300000, net: 19700000, occupancy: 97 },
    { month: "Nov", gross: 22500000, expense: 2200000, net: 20300000, occupancy: 98 },
    { month: "Des", gross: 23100000, expense: 2500000, net: 20600000, occupancy: 100 },
  ];

  // Cross-Building Financial & Occupancy Comparison Data
  const buildingComparisonData = houses.map((h) => {
    const houseTenants = tenants.filter((t) => t.houseName.toLowerCase() === h.name.toLowerCase());
    const houseRooms = rooms.filter((r) => r.houseName.toLowerCase() === h.name.toLowerCase());
    const houseGross = houseTenants.reduce((acc, t) => acc + t.tariff, 0);
    const houseExp = expenses.filter((e) => e.houseName.toLowerCase() === h.name.toLowerCase()).reduce((acc, e) => acc + e.amount, 0) || 300000;
    const occRate = houseRooms.length > 0 ? Math.round((houseTenants.length / houseRooms.length) * 100) : 0;

    return {
      building: h.name,
      grossRevenue: houseGross || 2500000,
      operationalCost: houseExp,
      netRevenue: (houseGross || 2500000) - houseExp,
      occupancyPercent: occRate,
      gender: h.gender,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      houseName,
      category,
      amount,
      description,
      date,
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BanknotesIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Manajemen Keuangan, Grafik Trend 12 Bulan & Perbandingan Gedung
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analisis grafik interaktif pemasukan bersih, biaya operasional, dan performa keuangan 7 gedung Griya Jaten Indah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Tab Selectors */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("trend12m")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "trend12m"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Trend 12 Bulan</span>
            </button>
            <button
              onClick={() => setActiveTab("building")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "building"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              <BuildingOffice2Icon className="w-3.5 h-3.5" />
              <span>Perbandingan Gedung</span>
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "table"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              Log Catatan
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-emerald cursor-pointer">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
            <span>Total Pemasukan Sewa (Lunas)</span>
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            Rp {totalIncome.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Dari 39 Kamar Terisi</p>
        </div>

        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-rose cursor-pointer">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ArrowTrendingDownIcon className="w-4 h-4 text-rose-500" />
            <span>Total Pengeluaran Operasional</span>
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            Rp {totalExpense.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">PLN, PAM, Gaji, Wi-Fi, Repair</p>
        </div>

        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-purple cursor-pointer">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4 text-teal-500" />
            <span>Laba Bersih Operasional (Net Profit)</span>
          </p>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-2">
            Rp {netProfit.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">Margin Keuntungan Bersih: ~90%</p>
        </div>
      </div>

      {activeTab === "trend12m" && (
        /* 12-MONTH FINANCIAL TREND CHART */
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-emerald-600" />
                <span>Grafik Trend Keuangan 12 Bulan (Januari - Desember)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Visualisasi komparasi Pemasukan Gross vs Pengeluaran Operasional vs Laba Bersih
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs rounded-full">
              Pertumbuhan Stabil +8.5% YOY
            </span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData12M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${val / 1000000}M`} />
                <Tooltip
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, ""]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="gross" name="Pemasukan Gross" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran Operasional" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="net" name="Laba Bersih" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "building" && (
        /* CROSS-BUILDING FINANCIAL & OCCUPANCY COMPARISON CHART */
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <BuildingOffice2Icon className="w-5 h-5 text-emerald-600" />
                <span>Perbandingan Pendapatan & Biaya Antar Gedung (Rumah 1 - 5, GJI Baru, Homestay)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Membandingkan kontribusi omset dan efisiensi operasional setiap unit bangunan kost
              </p>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="building" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${val / 1000000}M`} />
                <Tooltip
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, ""]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="grossRevenue" name="Total Omset Sewa" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="netRevenue" name="Laba Bersih Unit" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="operationalCost" name="Biaya Operasional" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "table" && (
        /* EXPENSE TABLE */
        <div className="p-1 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Properti</th>
                  <th className="p-3.5">Deskripsi</th>
                  <th className="p-3.5">Nominal</th>
                  <th className="p-3.5">Tanggal</th>
                  <th className="p-3.5 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 dark:text-white">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {e.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">{e.houseName}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-200">{e.description}</td>
                    <td className="p-3.5 font-extrabold text-rose-600 dark:text-rose-400">
                      Rp {e.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3.5 text-slate-500">{e.date}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Tambah Catatan Pengeluaran
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Properti Rumah
                </label>
                <input
                  type="text"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  placeholder="Rumah 1 / GJI Baru / Operasional"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                >
                  <option value="Listrik & Air">Listrik & Air</option>
                  <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                  <option value="Internet & Wi-Fi">Internet & Wi-Fi</option>
                  <option value="Gaji Penjaga">Gaji Penjaga</option>
                  <option value="Maintenance & Perbaikan">Maintenance & Perbaikan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Deskripsi Pengeluaran
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
