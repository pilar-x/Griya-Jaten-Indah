import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Square3Stack3DIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export const InventoryView: React.FC = () => {
  const { rooms, activeRole } = useApp();

  const [tickets, setTickets] = useState([
    {
      id: "t1",
      houseName: "GJI Baru",
      roomNumber: "KM3",
      issue: "Lampu kamar mandi redup & berkedip",
      reporter: "Siti Rahma (Penghuni)",
      date: "2026-08-01",
      status: "Diproses",
      assignedTo: "Pak Agus (Penjaga Kost)",
    },
    {
      id: "t2",
      houseName: "Rumah 2",
      roomNumber: "KM1",
      issue: "Gagang pintu kamar perlu dikencangkan",
      reporter: "Budi Santoso",
      date: "2026-07-28",
      status: "Selesai",
      assignedTo: "Pak Agus (Penjaga Kost)",
    },
    {
      id: "t3",
      houseName: "Rumah 4",
      roomNumber: "KM5",
      issue: "Kran air wastafel agak menetes",
      reporter: "Aisyah Putri",
      date: "2026-08-02",
      status: "Pending",
      assignedTo: "Pak Agus (Penjaga Kost)",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHouse, setNewHouse] = useState("Rumah 1");
  const [newRoom, setNewRoom] = useState("KM1");
  const [newIssue, setNewIssue] = useState("");
  const [newReporter, setNewReporter] = useState("");

  const inventoryItems = [
    { name: "Kasur Springbed Single 120x200", condition: "Bagus / Baik", qty: 46 },
    { name: "Lemari Pakaian Kayu 2 Pintu", condition: "Bagus / Baik", qty: 46 },
    { name: "Meja Belajar + Kursi", condition: "Bagus / Baik", qty: 46 },
    { name: "AC Split 1/2 PK (GJI Baru & Pav)", condition: "Bagus (Servis Rutin)", qty: 12 },
    { name: "Kipas Angin Dinding (R1-R5)", condition: "Bagus / Baik text-emerald-600", qty: 34 },
    { name: "Kamar Mandi Dalam / Water Heater", condition: "Bagus / Baik", qty: 18 },
    { name: "Tandon Air & Pompa Otomatis 7 Rumah", condition: "Berfungsi Normal", qty: 7 },
    { name: "Router Wi-Fi IndiHome 100Mbps", condition: "Signal Bagus di 7 Gedung", qty: 7 },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue) return;

    const newT = {
      id: "t_" + Date.now(),
      houseName: newHouse,
      roomNumber: newRoom,
      issue: newIssue,
      reporter: newReporter || "Penghuni GJI",
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
      assignedTo: "Pak Agus (Penjaga Kost)",
    };

    setTickets([newT, ...tickets]);
    setShowAddModal(false);
    setNewIssue("");
    setNewReporter("");
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleAlertGuardWa = (t: typeof tickets[0]) => {
    const text = `*LAPORAN PERBAIKAN / KENDALA FASILITAS KOST GJI*\n\nAtas Nama: *${t.reporter}*\nLokasi: *${t.houseName} (${t.roomNumber})*\nKendala: *${t.issue}*\nStatus Saat Ini: *${t.status}*\nTanggal: *${t.date}*\n\nMohon Pak Penjaga Kost (Pak Agus) untuk dapat mengecek ke lokasi. Terima kasih!\n\n_Pemilik: Ibu Retno Handayani (0817-201-958)_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Square3Stack3DIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Aset Inventaris & Sistem Lapor Perbaikan Fasilitas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Katalog fasilitas 46 kamar jadi + 10 kamar baru dan penanganan kendala teknis oleh Pak Agus (Petugas Kebersihan & Keamanan).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Buat Laporan Kendala</span>
        </button>
      </div>

      {/* MAINTENANCE TICKETS SECTION */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
              Status Perbaikan & Perawatan Fasilitas (Pak Agus)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {tickets.filter((t) => t.status !== "Selesai").length} Perlu Penanganan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border space-y-3 transition-all ${
                t.status === "Pending"
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                  : t.status === "Diproses"
                  ? "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                  : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-white">
                  {t.houseName} — {t.roomNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                    t.status === "Pending"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : t.status === "Diproses"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                "{t.issue}"
              </p>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p>Pelapor: <strong>{t.reporter}</strong></p>
                <p>Penanggung Jawab: {t.assignedTo}</p>
                <p>Tanggal: {t.date}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <select
                  value={t.status}
                  onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-800 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>

                <button
                  onClick={() => handleAlertGuardWa(t)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1"
                >
                  <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                  <span>WA Pak Agus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KATALOG INVENTARIS ASET */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
          Katalog Total Aset Terpasang (46 Kamar Siap Huni + Facilities)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventoryItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">
                  {item.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs shrink-0">
                  {item.qty}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{item.condition}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ADD TICKET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                Buat Laporan Kendala Perbaikan
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Gedung Properti
                </label>
                <select
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold"
                >
                  <option value="Rumah 1">Rumah 1 (Putri)</option>
                  <option value="Rumah 2">Rumah 2 (Putra)</option>
                  <option value="Rumah 3">Rumah 3 (Putri)</option>
                  <option value="Rumah 4">Rumah 4 (Putra)</option>
                  <option value="Rumah 5">Rumah 5 (Putri)</option>
                  <option value="GJI Baru">GJI Baru (Putri AC)</option>
                  <option value="Homestay">Homestay (Paviliun)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="misal: KM3 / Pav"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Detail Kendala / Kerusakan
                </label>
                <textarea
                  required
                  rows={3}
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  placeholder="misal: Lampu berkedip, kran bocor, Wi-Fi lambat..."
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Nama Pelapor
                </label>
                <input
                  type="text"
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  placeholder="Nama Penghuni / Petugas"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Kirim Laporan Ke Pak Agus
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
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

