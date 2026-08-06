import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BanknotesIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  ArrowRightIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export const PemilikExecutiveView: React.FC = () => {
  const { houses, rooms, tenants, payments, expenses, askAiChatbot, exportDatabaseJson } = useApp();
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Calculate Key Executive Metrics
  const currentMonthPeriod = "Agustus 2026";

  const totalMonthlyRevenue = payments
    .filter((p) => p.monthPeriod.includes("Agustus") || p.date.startsWith("2026-08"))
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMonthlyExpenses = expenses
    .filter((e) => e.date.startsWith("2026-08"))
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalMonthlyRevenue - totalMonthlyExpenses;

  const totalRoomsCount = rooms.length;
  const occupiedRoomsCount = rooms.filter((r) => r.status !== "Kosong").length;
  const emptyRoomsCount = totalRoomsCount - occupiedRoomsCount;
  const occupancyPercentage = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  const overdueTenants = tenants.filter((t) => t.paymentStatus === "Terlambat");
  const upcomingDueDateTenants = tenants.filter((t) => t.paymentStatus === "Akan Jatuh Tempo");

  const totalOverdueAmount = overdueTenants.reduce((sum, t) => sum + t.tariff, 0);

  const OWNER_NAME = "Ibu Retno Handayani";
  const OWNER_PHONE = "0817-201-958";

  const handleGenerateAiExecutiveAdvice = async () => {
    setAiLoading(true);
    const prompt = `Saya adalah Ibu Retno Handayani, Pemilik Kost Griya Jaten Indah (7 Gedung, 41 Kamar). 
Statistik bulan ini:
- Total Omset: Rp ${totalMonthlyRevenue.toLocaleString("id-ID")}
- Total Pengeluaran: Rp ${totalMonthlyExpenses.toLocaleString("id-ID")}
- Laba Bersih: Rp ${netProfit.toLocaleString("id-ID")}
- Okupansi: ${occupancyPercentage}% (${occupiedRoomsCount}/${totalRoomsCount} Kamar Terisi, ${emptyRoomsCount} Kosong)
- Penghuni Terlambat: ${overdueTenants.length} orang (Total Tunggakan: Rp ${totalOverdueAmount.toLocaleString("id-ID")})

Mohon berikan ringkasan eksekutif dan 3 saran strategis pemilik untuk Ibu Retno Handayani dalam memaksimalkan profit & kelancaran sewa.`;

    const result = await askAiChatbot(prompt);
    setAiAdvice(result);
    setAiLoading(false);
  };

  const handleSendReportToGuard = () => {
    const text = `*LAPORAN EKSEKUTIF PEMILIK KOST GJI (Agustus 2026)*\n*Pemilik:* ${OWNER_NAME} (${OWNER_PHONE})\n\n- Omset Terkumpul: Rp ${totalMonthlyRevenue.toLocaleString("id-ID")}\n- Total Pengeluaran: Rp ${totalMonthlyExpenses.toLocaleString("id-ID")}\n- Laba Bersih: Rp ${netProfit.toLocaleString("id-ID")}\n- Okupansi: ${occupancyPercentage}% (${occupiedRoomsCount}/${totalRoomsCount} Kamar)\n- Tunggakan Terlambat: ${overdueTenants.length} Penghuni (Rp ${totalOverdueAmount.toLocaleString("id-ID")})\n\nMohon Pak Penjaga Kost (Pak Agus) untuk terus memantau penagihan sewa dan kebersihan 7 gedung. Terima kasih!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* EXECUTIVE BANNER HEADER */}
      <div className="p-6 rounded-[26px] bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            <span>Mode Kontrol Pemilik Kost • {OWNER_NAME} ({OWNER_PHONE})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            Executive Owner Dashboard — Ibu Retno Handayani
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Pengawasan performa bisnis 7 rumah kost Griya Jaten Indah, arus kas keuangan, dan penagihan piutang sewa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <button
            onClick={handleSendReportToGuard}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Kirim Laporan ke Penjaga</span>
          </button>
          <button
            onClick={exportDatabaseJson}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Backup Data JSON</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE TOP KPI CARDS WITH HOVER GLOW EFFECTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue Card (Glows Cyan) */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-cyan cursor-pointer space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pemasukan Gross (Bulan Ini)</span>
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BanknotesIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            Rp {totalMonthlyRevenue.toLocaleString("id-ID")}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
            <span>Target Rp 26.000.000 (Tercapai)</span>
          </div>
        </div>

        {/* Operational Expenses (Glows Rose/Pink) */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-rose cursor-pointer space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Operational Expenses</span>
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <ArrowTrendingDownIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            Rp {totalMonthlyExpenses.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-slate-500">Listrik, PAM, Gaji, Repair</p>
        </div>

        {/* Net Profit (Glows Emerald) */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md card-glow-emerald cursor-pointer space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-100">
            <span>Laba Bersih (Net Profit)</span>
            <span className="p-2 rounded-xl bg-white/20 text-white">
              <SparklesIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-white">
            Rp {netProfit.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-emerald-100">Margin Laba: ~90% Operasional Safe</p>
        </div>

        {/* Occupancy Rate (Glows Purple) */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm card-glow-purple cursor-pointer space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Tingkat Okupansi Total</span>
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BuildingOffice2Icon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {occupancyPercentage}%
            <span className="text-xs font-medium text-slate-500 ml-1.5">
              ({occupiedRoomsCount}/{totalRoomsCount} Kamar)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI EXECUTIVE STRATEGY ADVISOR */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              AI Smart Executive Advisor (Gemini Powered)
            </h3>
          </div>

          <button
            onClick={handleGenerateAiExecutiveAdvice}
            disabled={aiLoading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{aiLoading ? "Menganalisis..." : "Generate Analisis Strategis Pemilik"}</span>
          </button>
        </div>

        {aiAdvice ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {aiAdvice}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Klik tombol di atas untuk membuat rekomendasi eksekutif otomatis mengenai proyeksi sewa dan optimasi tarif 7 gedung.</span>
          </div>
        )}
      </div>

      {/* CONSTRUCTION PROJECT 10 NEW ROOMS TRACKER */}
      <div className="p-5 rounded-[24px] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white border border-emerald-800/40 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/50 pb-3">
          <div className="flex items-center gap-2">
            <BuildingOffice2Icon className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Proyek Konstruksi 10 Kamar Baru (GJI Ekstensi)
              </h3>
              <p className="text-xs text-slate-300">
                Pembangunan 10 kamar tambahan untuk mencapai total 56 unit kamar Griya Jaten Indah
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 self-start sm:self-auto">
            Target Selesai: Q4 2026 (65% Progress)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium">Estimasi Investasi & Anggaran:</span>
            <div className="text-lg font-black text-emerald-400">Rp 150.000.000</div>
            <p className="text-[11px] text-slate-300">Realisasi Saat Ini: Rp 97.500.000 (65%)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium">Potensi Tambahan Omset/Bulan:</span>
            <div className="text-lg font-black text-amber-300">+ Rp 7.500.000 / bln</div>
            <p className="text-[11px] text-slate-300">10 Kamar x Rp 750.000 (Tarif Baru)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium">Kapasitas Properti GJI:</span>
            <div className="text-lg font-black text-white">46 Unit Ready → 56 Total</div>
            <p className="text-[11px] text-emerald-300">Siap Sewa Akhir Tahun 2026</p>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Tahapan Pembangunan:</span>
            <span>65% Selesai</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full w-[65%]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px]">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-center">
              ✓ Pondasi & Struktur
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-center">
              ✓ Dinding & Atap
            </div>
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-center animate-pulse">
              ⏳ Plafon & Keramik
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-center">
              ○ Inst. Listrik & Air
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-center col-span-2 sm:col-span-1">
              ○ Furnishing & Cat
            </div>
          </div>
        </div>
      </div>

      {/* OCCUPANCY & PERFORMANCE BREAKDOWN ACROSS 7 HOUSES */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BuildingOffice2Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Breakdown Portfolio Kost Griya Jaten Indah
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">46 Kamar Jadi + 10 Kamar Dalam Pembangunan (Total 56 Unit)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {houses.map((h) => {
            const houseRooms = rooms.filter((r) => r.houseId === h.id);
            const houseOccupied = houseRooms.filter((r) => r.status !== "Kosong").length;
            const houseTotal = houseRooms.length;
            const houseOccupancyPct = houseTotal > 0 ? Math.round((houseOccupied / houseTotal) * 100) : 0;

            const houseRevenue = payments
              .filter((p) => p.houseName === h.name)
              .reduce((sum, p) => sum + p.amount, 0);

            return (
              <div
                key={h.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-white">{h.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {h.gender}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Okupansi:</span>
                  <span className="font-bold">{houseOccupied}/{houseTotal} Kamar ({houseOccupancyPct}%)</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${houseOccupancyPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Estimasi Omset:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rp {houseRevenue.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELINQUENT PAYMENTS & ACTION NEEDED */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Penghuni Terlambat Bayar & Piutang (Perlu Tindakan Pemilik)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            {overdueTenants.length} Penghuni Terlambat
          </span>
        </div>

        {overdueTenants.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Semua penghuni telah melunasi sewa bulan ini. Tidak ada tunggakan!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {overdueTenants.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{t.name}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({t.houseName} - {t.roomNumber})
                    </span>
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    Jatuh tempo: {t.dueDate} • Tunggakan: Rp {t.tariff.toLocaleString("id-ID")}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${t.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Halo Sdr/i ${t.name}, ini pengingat dari Pemilik Kost Griya Jaten Indah untuk tagihan sewa ${t.houseName} kamar ${t.roomNumber} sebesar Rp ${t.tariff.toLocaleString("id-ID")} yang telah melampaui jatuh tempo ${t.dueDate}. Mohon segera konfirmasi pembayaran. Terima kasih!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Kirim Peringatan WA</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
