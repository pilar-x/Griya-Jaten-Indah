import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  BuildingOffice2Icon,
  BoltIcon,
  SparklesIcon,
  BanknotesIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export const FacilityMaintenanceView: React.FC = () => {
  const { houses, rooms, addExpense, maintenanceLogs, updateMaintenanceStatus } = useApp();

  const [schedules, setSchedules] = useState<Array<{
    id: string;
    houseName: string;
    roomNumber: string;
    type: "Servis AC Rutin (3 Bulan)" | "Pembersihan Tandon Air" | "Wi-Fi & Router Check" | "Pengecatan & Perbaikan";
    scheduledDate: string; // YYYY-MM-DD
    estimatedCost: number;
    technician: string;
    status: "Mendekati Jadwal" | "Selesai" | "Terlambat";
    notes?: string;
  }>>([
    {
      id: "sch-1",
      houseName: "GJI Baru",
      roomNumber: "Kamar 01 (AC)",
      type: "Servis AC Rutin (3 Bulan)",
      scheduledDate: "2026-08-15",
      estimatedCost: 75000,
      technician: "CV Jogja Cool AC",
      status: "Mendekati Jadwal",
      notes: "Cuci filter & penambahan freon R32",
    },
    {
      id: "sch-2",
      houseName: "Homestay",
      roomNumber: "Kamar Paviliun",
      type: "Servis AC Rutin (3 Bulan)",
      scheduledDate: "2026-08-20",
      estimatedCost: 75000,
      technician: "CV Jogja Cool AC",
      status: "Mendekati Jadwal",
      notes: "Cuci rutin outdoor & indoor unit",
    },
    {
      id: "sch-3",
      houseName: "Rumah 1 (Putri)",
      roomNumber: "Tandon Utama Lt. 2",
      type: "Pembersihan Tandon Air",
      scheduledDate: "2026-08-10",
      estimatedCost: 150000,
      technician: "Pak Agus Penjaga Kost",
      status: "Mendekati Jadwal",
      notes: "Kuras endapan tandon air & ganti filter kran",
    },
    {
      id: "sch-4",
      houseName: "Rumah 4 (Putra)",
      roomNumber: "All Area",
      type: "Wi-Fi & Router Check",
      scheduledDate: "2026-08-05",
      estimatedCost: 0,
      technician: "Teknisi Biznet / Indihome",
      status: "Selesai",
      notes: "Restart router & upgrade firmware",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [houseName, setHouseName] = useState("GJI Baru");
  const [roomNumber, setRoomNumber] = useState("KM1");
  const [type, setType] = useState<any>("Servis AC Rutin (3 Bulan)");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [estimatedCost, setEstimatedCost] = useState<number>(75000);
  const [technician, setTechnician] = useState("CV Jogja Cool AC");
  const [notes, setNotes] = useState("");

  const handleMarkComplete = (sch: any) => {
    // Update status to Selesai
    setSchedules((prev) =>
      prev.map((s) => (s.id === sch.id ? { ...s, status: "Selesai" } : s))
    );

    // Auto record into expenses if cost > 0
    if (sch.estimatedCost > 0) {
      addExpense({
        houseName: sch.houseName,
        category: "Maintenance & Perbaikan" as any,
        amount: sch.estimatedCost,
        description: `${sch.type} - ${sch.roomNumber} (${sch.technician})`,
        date: new Date().toISOString().slice(0, 10),
      });
    }

    alert(`Perawatan ${sch.type} diselesaikan! Biaya Rp ${sch.estimatedCost.toLocaleString("id-ID")} telah dicatat ke Laporan Keuangan.`);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSch = {
      id: "sch-" + Date.now(),
      houseName,
      roomNumber,
      type,
      scheduledDate,
      estimatedCost,
      technician,
      status: "Mendekati Jadwal" as const,
      notes,
    };
    setSchedules((prev) => [newSch, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Manajemen Jadwal Perawatan Fasilitas (Facility Maintenance Tracker)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan atur pengingat berkala servis AC (3 bulanan), cuci tandon air, dan perawatan Wi-Fi per gedung.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Tambah Agenda Perawatan</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Total Unit AC Terpasang</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">18 Unit</p>
          <p className="text-[11px] text-emerald-600 font-bold">Rutin Servis 3 Bulan</p>
        </div>

        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Tandon Air PAM Gedung</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">7 Unit</p>
          <p className="text-[11px] text-blue-600 font-bold">Kuras Berkala 2 Bulan</p>
        </div>

        <div className="p-5 rounded-[20px] bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Jadwal Servis Bulan Ini</p>
          <p className="text-2xl font-black text-amber-600">{schedules.filter((s) => s.status === "Mendekati Jadwal").length} Agenda</p>
          <p className="text-[11px] text-slate-500">Siap Dikerjakan</p>
        </div>

        <div className="p-5 rounded-[20px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md space-y-1">
          <p className="text-xs font-semibold text-emerald-100">Estimasi Biaya Servis</p>
          <p className="text-2xl font-black text-white">
            Rp {schedules.reduce((acc, curr) => acc + curr.estimatedCost, 0).toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-emerald-100">Anggaran Operasional Maintenance</p>
        </div>
      </div>

      {/* LIVE TENANT DAMAGE REPORTS TABLE */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              📢 Laporan Kerusakan Masuk dari Penghuni Kost (Real-Time)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {maintenanceLogs.length} Laporan Masuk
          </span>
        </div>

        {maintenanceLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 space-y-1">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800 dark:text-white">Belum Ada Laporan Kerusakan Baru dari Penghuni</p>
            <p className="text-[11px] text-slate-400">Setiap aduan kerusakan dari Portal Penghuni akan otomatis muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase">
                  <th className="p-3.5">Gedung & Kamar</th>
                  <th className="p-3.5">Rincian Kerusakan Fasilitas</th>
                  <th className="p-3.5">Tanggal Lapor</th>
                  <th className="p-3.5">Status Penanganan</th>
                  <th className="p-3.5 text-center">Aksi Pemilik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {maintenanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 dark:text-white">
                      <p>{log.houseName}</p>
                      <span className="text-[11px] text-slate-500">Kamar {log.roomNumber}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300 max-w-xs">
                      {log.issue}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">{log.reportedDate}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          log.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : log.status === "Dikerjakan"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex justify-center gap-1.5">
                        {log.status !== "Dikerjakan" && log.status !== "Selesai" && (
                          <button
                            onClick={() => updateMaintenanceStatus(log.id, "Dikerjakan")}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all"
                          >
                            Proses Dikerjakan
                          </button>
                        )}
                        {log.status !== "Selesai" && (
                          <button
                            onClick={() => updateMaintenanceStatus(log.id, "Selesai")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all"
                          >
                            Tandai Selesai
                          </button>
                        )}
                        {log.status === "Selesai" && (
                          <span className="text-[11px] text-emerald-500 font-bold">✓ Tuntas</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SCHEDULE LIST TABLE */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-emerald-600" />
          <span>Agenda & Jadwal Pemeliharaan Fasilitas GJI</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase">
                <th className="p-3.5">Gedung & Unit</th>
                <th className="p-3.5">Jenis Perawatan</th>
                <th className="p-3.5">Tanggal Perkiraan</th>
                <th className="p-3.5">Teknisi / Vendor</th>
                <th className="p-3.5">Biaya (Rp)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-800 dark:text-white">{sch.houseName}</p>
                    <p className="text-[11px] text-slate-500">{sch.roomNumber}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    {sch.type}
                    {sch.notes && <p className="text-[10px] text-slate-400 font-normal">{sch.notes}</p>}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-white">{sch.scheduledDate}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{sch.technician}</td>
                  <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rp {sch.estimatedCost.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        sch.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {sch.status !== "Selesai" ? (
                      <button
                        onClick={() => handleMarkComplete(sch)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all"
                      >
                        Tandai Selesai
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-bold">✓ Terverifikasi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SCHEDULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Tambah Agenda Perawatan Fasilitas
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Gedung Properti</label>
                <select
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Nomor Kamar / Unit</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="misal: Kamar 01 / Tandon Utama"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Jenis Perawatan</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                >
                  <option value="Servis AC Rutin (3 Bulan)">Servis AC Rutin (3 Bulan)</option>
                  <option value="Pembersihan Tandon Air">Pembersihan Tandon Air</option>
                  <option value="Wi-Fi & Router Check">Wi-Fi & Router Check</option>
                  <option value="Pengecatan & Perbaikan">Pengecatan & Perbaikan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Tanggal Rencana</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Biaya Estimasi (Rp)</label>
                  <input
                    type="number"
                    required
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Teknisi / Vendor</label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  placeholder="misal: CV Jogja Cool AC / Pak Agus"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Simpan Agenda
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
