import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  UserGroupIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AIPredictionResult } from "../../types";

export const DashboardView: React.FC = () => {
  const {
    tenants,
    rooms,
    houses,
    maintenanceLogs,
    updateMaintenanceStatus,
    aiNarrative,
    aiNarrativeLoading,
    generateAiNarrative,
    predictAiFinancials,
    setActiveView,
  } = useApp();

  const [aiPredictData, setAiPredictData] = useState<AIPredictionResult | null>(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [showPredictModal, setShowPredictModal] = useState(false);

  useEffect(() => {
    if (!aiNarrative) {
      generateAiNarrative();
    }
  }, []);

  // Compute KPI values dynamically
  const totalTenants = tenants.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(
    (r) => r.status === "Terisi" || r.status === "Akan Jatuh Tempo" || r.status === "Terlambat"
  ).length;
  const vacantRooms = rooms.filter((r) => r.status === "Kosong").length;

  const currentMonthRevenue = tenants
    .filter((t) => t.paymentStatus === "Lunas")
    .reduce((sum, t) => sum + t.tariff, 0);

  const totalPiutang = tenants
    .filter((t) => t.paymentStatus !== "Lunas")
    .reduce((sum, t) => sum + t.tariff, 0);

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const dueThisWeekCount = tenants.filter(
    (t) => t.paymentStatus === "Akan Jatuh Tempo" || t.paymentStatus === "Terlambat"
  ).length;

  // Chart Data Preparation
  // 1. Line Chart 12 Months Trend (Realistic projection based on GJI revenue)
  const monthlyRevenueData = [
    { month: "Agt 25", revenue: 18200000 },
    { month: "Sep 25", revenue: 18500000 },
    { month: "Okt 25", revenue: 19100000 },
    { month: "Nov 25", revenue: 19400000 },
    { month: "Des 25", revenue: 19800000 },
    { month: "Jan 26", revenue: 19800000 },
    { month: "Feb 26", revenue: 20100000 },
    { month: "Mar 26", revenue: 20100000 },
    { month: "Apr 26", revenue: 20350000 },
    { month: "Mei 26", revenue: 20350000 },
    { month: "Jun 26", revenue: 20350000 },
    { month: "Jul 26", revenue: 20350000 },
    { month: "Agt 26", revenue: currentMonthRevenue },
  ];

  // 2. Pie Chart Composition
  const lunasCount = tenants.filter((t) => t.paymentStatus === "Lunas").length;
  const akanJatuhTempoCount = tenants.filter((t) => t.paymentStatus === "Akan Jatuh Tempo").length;
  const terlambatCount = tenants.filter((t) => t.paymentStatus === "Terlambat").length;

  const pieCompositionData = [
    { name: "Lunas", value: lunasCount, color: "#10b981" },
    { name: "Akan Jatuh Tempo", value: akanJatuhTempoCount, color: "#f59e0b" },
    { name: "Terlambat", value: terlambatCount, color: "#ef4444" },
  ];

  // 3. Bar Chart Revenue per House
  const houseRevenueData = houses.map((h) => {
    const houseTenants = tenants.filter((t) => t.houseName === h.name && t.paymentStatus === "Lunas");
    const rev = houseTenants.reduce((sum, t) => sum + t.tariff, 0);
    return {
      name: h.name,
      Revenue: rev,
      Kamar: h.totalRooms,
    };
  });

  const handleRunPredict = async () => {
    setPredictLoading(true);
    setShowPredictModal(true);
    const result = await predictAiFinancials();
    setAiPredictData(result);
    setPredictLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Executive Narrative */}
      <div className="p-5 md:p-6 rounded-[22px] bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <SparklesIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Ringkasan Eksekutif Smart AI GJI
              </h2>
              <p className="text-xs text-emerald-300/80">
                Analisis otomatis performa bisnis & arus kas Griya Jaten Indah
              </p>
            </div>
          </div>
          <button
            onClick={generateAiNarrative}
            disabled={aiNarrativeLoading}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <SparklesIcon className={`w-4 h-4 ${aiNarrativeLoading ? "animate-spin" : ""}`} />
            <span>{aiNarrativeLoading ? "Menganalisis..." : "Perbarui Narasi AI"}</span>
          </button>
        </div>

        <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-normal">
          {aiNarrativeLoading ? (
            <span className="italic animate-pulse">Sedang membaca data keuangan dan okupansi...</span>
          ) : (
            aiNarrative ||
            "Griya Jaten Indah mencatatkan performa okupansi 95% dengan 39 kamar terisi dari 41 total kamar. Arus kas bulan ini terpantau sehat dengan pendapatan berjalan Rp 20.350.000. Terdapat 2 kamar kosong yang berpotensi meningkatkan penerimaan bulanan."
          )}
        </p>

        {/* Quick AI Action Triggers */}
        <div className="mt-4 pt-4 border-t border-emerald-800/40 flex flex-wrap gap-2">
          <button
            onClick={handleRunPredict}
            className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-200 rounded-xl transition-all border border-emerald-400/20 flex items-center gap-1.5"
          >
            <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jalankan Prediksi AI Bulan Depan</span>
          </button>
          <button
            onClick={() => setActiveView("reminder")}
            className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-200 rounded-xl transition-all border border-emerald-400/20 flex items-center gap-1.5"
          >
            <PaperAirplaneIcon className="w-3.5 h-3.5 text-teal-300" />
            <span>Kirim Reminder WA Otomatis</span>
          </button>
        </div>
      </div>

      {/* 8 KPI CARDS GRID WITH VIBRANT COLOR GLOW HOVER EFFECTS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Card 1: Total Penghuni (Glows Blue) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-blue cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Penghuni</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            {totalTenants} <span className="text-xs font-medium text-slate-500">Orang</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>• Terdaftar aktif</span>
          </p>
        </div>

        {/* Card 2: Total Kamar (Glows Purple) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-purple cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Kamar</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HomeIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            {totalRooms} <span className="text-xs font-medium text-slate-500">Kamar</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">7 Properti Tersebar</p>
        </div>

        {/* Card 3: Terisi (Glows Emerald) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-emerald cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Terisi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {occupiedRooms} <span className="text-xs font-medium text-slate-500">Kamar</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            39 Aktif (+2 Staff/Gudang)
          </p>
        </div>

        {/* Card 4: Kosong (Glows Pink) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-pink cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Kosong</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-rose-600 dark:text-rose-400">
            {vacantRooms} <span className="text-xs font-medium text-slate-500">Kamar</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">R4 KM7 & R5 KM8</p>
        </div>

        {/* Card 5: Pendapatan Bulan Ini (Glows Cyan) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-cyan cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pendapatan Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
            Rp {currentMonthRevenue.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Lunas {lunasCount} penghuni
          </p>
        </div>

        {/* Card 6: Occupancy Rate (Glows Emerald) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-emerald cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-teal-600 dark:text-teal-400">
            {occupancyRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sangat Tinggi</p>
        </div>

        {/* Card 7: Piutang (Glows Amber) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-amber cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Piutang (Belum Bayar)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ExclamationCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400">
            Rp {totalPiutang.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            {akanJatuhTempoCount + terlambatCount} Orang Belum Lunas
          </p>
        </div>

        {/* Card 8: Jatuh Tempo Minggu Ini (Glows Rose) */}
        <div className="p-4 md:p-5 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-rose cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Jatuh Tempo Minggu Ini</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <CalendarDaysIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            {dueThisWeekCount} <span className="text-xs font-medium text-slate-500">Penghuni</span>
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-medium">Perlu Pengingat WA</p>
        </div>
      </div>

      {/* CHARTS SECTION WITH DYNAMIC HOVER GLOW CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart: Grafik Pendapatan Bulanan */}
        <div className="lg:col-span-2 p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-emerald">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Grafik Pendapatan Bulanan (12 Bulan)
              </h3>
              <p className="text-xs text-slate-500">Tren penerimaan sewa kamar Griya Jaten Indah</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300/40">
              Pertumbuhan Stabil
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Pendapatan"]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Komposisi Status Pembayaran */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-purple flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Komposisi Pembayaran
            </h3>
            <p className="text-xs text-slate-500">Status kelunasan sewa bulan berjalan</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieCompositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieCompositionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">{item.value} orang</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Pendapatan per Rumah & Quick Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart Revenue per House */}
        <div className="lg:col-span-2 p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-cyan">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Pendapatan per Rumah / Properti
              </h3>
              <p className="text-xs text-slate-500">Perbandingan penerimaan sewa antar gedung</p>
            </div>
            <button
              onClick={() => setActiveView("rumah")}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Lihat Rumah →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={houseRevenueData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`Rp ${Number(val).toLocaleString("id-ID")}`, "Pendapatan"]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                />
                <Bar dataKey="Revenue" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Reminder / Attention List */}
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <ExclamationCircleIcon className="w-4 h-4 text-amber-500" />
              <span>Perlu Perhatian</span>
            </h3>
            <button
              onClick={() => setActiveView("reminder")}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Proses WA
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {tenants
              .filter((t) => t.paymentStatus !== "Lunas")
              .map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-xs text-slate-800 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {t.houseName} • {t.roomNumber}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      Rp {t.tariff.toLocaleString("id-ID")} • Jatuh Tempo {t.dueDate}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      t.paymentStatus === "Terlambat"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {t.paymentStatus}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* LIVE SYNC TENANT MAINTENANCE REPORTS SECTION */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <WrenchScrewdriverIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span>Laporan Kerusakan Fasilitas Masuk dari Penghuni</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Tersinkron Real-Time
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Aduan perbaikan AC, air PAM, listrik, dan kunci dari portal mandiri penghuni.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView("facility-maintenance")}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Kelola Pemeliharaan Lengkap →</span>
          </button>
        </div>

        {maintenanceLogs.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Tidak ada laporan kerusakan fasilitas aktif saat ini.</p>
            <p className="text-[11px] text-slate-400">Semua fasilitas kamar penghuni terpantau baik.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {maintenanceLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs hover:border-amber-400/60 transition-all"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-black text-slate-900 dark:text-white block text-sm">
                      Kamar {log.roomNumber} ({log.houseName})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Dilaporkan: {log.reportedDate}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      log.status === "Selesai"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : log.status === "Dikerjakan"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 leading-snug">
                  {log.issue}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Ubah Status Laporan:</span>
                  <div className="flex gap-1">
                    {log.status !== "Dikerjakan" && log.status !== "Selesai" && (
                      <button
                        onClick={() => updateMaintenanceStatus(log.id, "Dikerjakan")}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg shadow-xs"
                      >
                        Dikerjakan
                      </button>
                    )}
                    {log.status !== "Selesai" && (
                      <button
                        onClick={() => updateMaintenanceStatus(log.id, "Selesai")}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg shadow-xs"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI PREDICTION RESULT MODAL */}
      {showPredictModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white">
                  Hasil Analisis Prediksi AI Griya Jaten Indah
                </h3>
              </div>
              <button
                onClick={() => setShowPredictModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            {predictLoading ? (
              <div className="py-12 text-center space-y-3">
                <SparklesIcon className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Menganalisis historis pembayaran, okupansi, dan strategi tarif...
                </p>
              </div>
            ) : aiPredictData ? (
              <div className="space-y-4 py-4 text-xs md:text-sm">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    Proyeksi Pendapatan Bulan Depan:
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rp {(aiPredictData.predictedRevenueNextMonth || 20500000).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Estimasi Okupansi: {aiPredictData.predictedOccupancyRate || 95}%
                  </p>
                </div>

                {aiPredictData.summaryInsight && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-white mb-1">🔍 Ringkasan Insight:</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{aiPredictData.summaryInsight}</p>
                  </div>
                )}

                {aiPredictData.riskTenants && aiPredictData.riskTenants.length > 0 && (
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white mb-2">⚠️ Risiko Keterlambatan Pembayaran:</p>
                    <div className="space-y-1.5">
                      {aiPredictData.riskTenants.map((r, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40">
                          <span className="font-semibold text-rose-700 dark:text-rose-300">{r.name} ({r.house} - {r.room})</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{r.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowPredictModal(false)}
                    className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-xs hover:bg-emerald-500 transition-all"
                  >
                    Tutup & Terapkan Strategi
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500">
                Gagal memuat prediksi AI. Silakan coba klik tombol kembali.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
