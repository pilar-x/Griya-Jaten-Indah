import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { exportToPdf } from "../../utils/pdfExport";
import { DocumentChartBarIcon, ArrowDownTrayIcon, PrinterIcon, TableCellsIcon } from "@heroicons/react/24/outline";

export const ReportsView: React.FC = () => {
  const { tenants, payments, expenses, houses } = useApp();
  const [selectedMonth, setSelectedMonth] = useState("Agustus 2026");

  const totalRevenue = tenants
    .filter((t) => t.paymentStatus === "Lunas")
    .reduce((sum, t) => sum + t.tariff, 0);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpense;

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No Kwitansi,Penghuni,Properti,Kamar,Metode,Nominal,Tanggal\n";

    payments.forEach((p) => {
      csvContent += `${p.receiptNumber},"${p.tenantName}","${p.houseName}",${p.roomNumber},${p.method},${p.amount},${p.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_GJI_${selectedMonth.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = async () => {
    await exportToPdf("printable-report-canvas", `Laporan_Keuangan_GJI_${selectedMonth.replace(/\s+/g, "_")}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <DocumentChartBarIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Laporan Rekapitulasi Keuangan & Okupansi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ekspor laporan keuangan resmi ke PDF atau spreadsheet Excel (CSV) untuk keperluan audit & laporan pemilik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <TableCellsIcon className="w-4 h-4 text-emerald-600" />
            <span>Export Excel (.CSV)</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Cetak / Download PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CANVAS */}
      <div id="printable-report-canvas" className="p-6 md:p-8 rounded-[24px] bg-white text-slate-900 border border-slate-200 shadow-lg print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-xl font-black text-emerald-800 uppercase tracking-tight">
              LAPORAN KEUANGAN & OKUPANSI KOST
            </h1>
            <p className="text-xs font-bold text-slate-600">GRIYA JATEN INDAH (GJI) • SLEMAN, YOGYAKARTA</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-700">Periode Laporan: {selectedMonth}</p>
            <p className="text-slate-500">Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
          </div>
        </div>

        {/* Summary Table */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <p className="text-xs font-bold text-emerald-800 uppercase">Total Pemasukan Sewa</p>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">Rp {totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
            <p className="text-xs font-bold text-rose-800 uppercase">Total Pengeluaran</p>
            <p className="text-xl font-extrabold text-rose-700 mt-1">Rp {totalExpense.toLocaleString("id-ID")}</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
            <p className="text-xs font-bold text-teal-800 uppercase">Laba Bersih Operasional</p>
            <p className="text-xl font-extrabold text-teal-700 mt-1">Rp {netIncome.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Breakdown per Properti */}
        <div className="mb-6">
          <h3 className="font-extrabold text-sm text-slate-800 mb-2">1. Ringkasan Pemasukan Tiap Properti</h3>
          <table className="w-full text-left text-xs border border-slate-200 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold">
                <th className="p-2.5">Nama Properti</th>
                <th className="p-2.5">Tipe Gender</th>
                <th className="p-2.5">Jumlah Kamar</th>
                <th className="p-2.5">Jumlah Penghuni</th>
                <th className="p-2.5">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {houses.map((h) => {
                const hTenants = tenants.filter((t) => t.houseName === h.name && t.paymentStatus === "Lunas");
                const sumRev = hTenants.reduce((acc, t) => acc + t.tariff, 0);
                return (
                  <tr key={h.id}>
                    <td className="p-2.5 font-bold">{h.name}</td>
                    <td className="p-2.5">{h.gender}</td>
                    <td className="p-2.5">{h.totalRooms} Kamar</td>
                    <td className="p-2.5">{hTenants.length} Orang</td>
                    <td className="p-2.5 font-bold text-emerald-700">Rp {sumRev.toLocaleString("id-ID")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Breakdown Payments */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 mb-2">2. Rincian Transaksi Masuk ({payments.length} Kwitansi)</h3>
          <table className="w-full text-left text-xs border border-slate-200 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold">
                <th className="p-2">No. Kwitansi</th>
                <th className="p-2">Penghuni</th>
                <th className="p-2">Properti / Kamar</th>
                <th className="p-2">Metode</th>
                <th className="p-2">Nominal</th>
                <th className="p-2">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 font-mono font-bold">{p.receiptNumber}</td>
                  <td className="p-2 font-semibold">{p.tenantName}</td>
                  <td className="p-2">{p.houseName} ({p.roomNumber})</td>
                  <td className="p-2">{p.method}</td>
                  <td className="p-2 font-bold text-emerald-700">Rp {p.amount.toLocaleString("id-ID")}</td>
                  <td className="p-2">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
