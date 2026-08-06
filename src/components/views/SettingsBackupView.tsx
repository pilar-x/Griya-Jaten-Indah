import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Cog6ToothIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowPathIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export const SettingsBackupView: React.FC = () => {
  const { exportBackupJson, importBackupJson, resetToDefaultSeed, activeRole, setActiveRole } = useApp();
  const [importStatus, setImportStatus] = useState("");

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const success = importBackupJson(event.target?.result as string);
          if (success) setImportStatus("✅ Data berhasil dipulihkan dari file backup!");
          else setImportStatus("❌ Format file JSON tidak valid.");
        } catch (err) {
          setImportStatus("❌ Terjadi kesalahan saat membaca file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Pengaturan Sistem & Backup Database
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Ekspor cadangan data lengkap ke file JSON, pulihkan data (restore), atau atur peran pengguna.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backup & Restore Box */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <ArrowDownTrayIcon className="w-5 h-5 text-emerald-600" />
            <span>Backup Data Sistem (JSON Export)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Unduh seluruh database (penghuni, rumah, kamar, pembayaran, pengeluaran) sebagai cadangan aman.
          </p>
          <button
            onClick={exportBackupJson}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Unduh Backup JSON Database</span>
          </button>
        </div>

        {/* Restore Box */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-blue-600" />
            <span>Restore / Import Data Backup</span>
          </h3>
          <p className="text-xs text-slate-500">
            Unggah file backup `.json` untuk mengembalikan data sebelumnya.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {importStatus && <p className="text-xs font-bold text-emerald-600 mt-1">{importStatus}</p>}
        </div>
      </div>

      {/* Reset Seed Box */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <ArrowPathIcon className="w-5 h-5 text-rose-500" />
          <span>Reset Database ke Seed Awal</span>
        </h3>
        <p className="text-xs text-slate-500">
          Kembalikan seluruh data ke kondisi awal saat aplikasi pertama dibuka (Data 7 Rumah, 41 Kamar, 31 Penghuni).
        </p>
        <button
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin mereset seluruh database ke data awal?")) {
              resetToDefaultSeed();
              alert("Database telah berhasil direset ke data awal.");
            }
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all"
        >
          Reset Database Ke Data Awal
        </button>
      </div>
    </div>
  );
};
