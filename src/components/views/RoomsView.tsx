import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Room, Tenant } from "../../types";
import { KeyIcon, FunnelIcon, MagnifyingGlassIcon, UserIcon, PhoneIcon, CalendarIcon } from "@heroicons/react/24/outline";

export const RoomsView: React.FC = () => {
  const { rooms, houses, tenants, setActiveView } = useApp();

  const [houseFilter, setHouseFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedRoom, setSelectedRoom] = useState<{ room: Room; tenant?: Tenant } | null>(null);

  const filteredRooms = rooms.filter((r) => {
    const matchHouse = houseFilter === "Semua" || r.houseName === houseFilter;

    const tenant = tenants.find(
      (t) => t.roomId === r.id || (t.houseName === r.houseName && t.roomNumber === r.roomNumber)
    );

    let calculatedStatus = r.status;
    if (tenant) {
      if (tenant.paymentStatus === "Terlambat") calculatedStatus = "Terlambat";
      else if (tenant.paymentStatus === "Akan Jatuh Tempo") calculatedStatus = "Akan Jatuh Tempo";
    }

    const matchStatus = statusFilter === "Semua" || calculatedStatus === statusFilter;

    return matchHouse && matchStatus;
  });

  const getCardStyle = (room: Room, tenant?: Tenant) => {
    if (room.status === "Maintenance") {
      return "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:shadow-amber-400/40 hover:border-amber-400 hover:-translate-y-1 transition-all duration-300";
    }
    if (room.status === "Kosong") {
      return "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:shadow-lg hover:shadow-pink-500/40 hover:border-pink-400 hover:-translate-y-1 transition-all duration-300";
    }
    if (tenant?.paymentStatus === "Terlambat") {
      return "bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-purple-500/50 hover:border-purple-300 hover:-translate-y-1 transition-all duration-300";
    }
    if (tenant?.paymentStatus === "Akan Jatuh Tempo") {
      return "bg-amber-400 text-slate-950 dark:text-slate-950 border-amber-500 shadow-md shadow-amber-400/20 hover:shadow-xl hover:shadow-rose-400/50 hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 font-bold";
    }
    return "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 hover:shadow-xl hover:shadow-cyan-400/50 hover:border-cyan-300 hover:-translate-y-1 transition-all duration-300";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Manajemen Data Kamar ({rooms.length} Total Kamar)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Status warna realtime: Hijau (Terisi Lunas), Kuning (Akan Jatuh Tempo), Merah (Terlambat/Kosong), Abu-abu (Maintenance).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white">🟢 Terisi Lunas</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-900">🟡 Jatuh Tempo</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white">🔴 Terlambat / Kosong</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            🔘 Maintenance
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Rumah:</span>
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="Semua">Semua Properti</option>
            {houses.map((h) => (
              <option key={h.id} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Terisi">Terisi Lunas</option>
            <option value="Akan Jatuh Tempo">Akan Jatuh Tempo</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Kosong">Kosong</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* ROOM CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredRooms.map((room) => {
          const tenant = tenants.find(
            (t) => t.roomId === room.id || (t.houseName === room.houseName && t.roomNumber === room.roomNumber)
          );
          const styleClass = getCardStyle(room, tenant);

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom({ room, tenant })}
              className={`p-4 rounded-[18px] border-2 transition-all cursor-pointer flex flex-col justify-between h-36 hover:scale-[1.03] ${styleClass}`}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">{room.houseName}</p>
                <h3 className="text-base font-extrabold tracking-tight mt-0.5">{room.roomNumber}</h3>
                <p className="text-[10px] opacity-90">{room.type}</p>
              </div>

              <div>
                <p className="font-bold text-xs truncate">
                  {tenant ? tenant.name : room.status === "Kosong" ? "🔴 KOSONG" : room.notes || "MAINTENANCE"}
                </p>
                <p className="text-[10px] font-semibold opacity-90 mt-0.5">
                  Rp {room.tariff.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="text-[9px] font-bold border-t border-black/10 pt-1 flex items-center justify-between">
                <span>{tenant ? tenant.paymentStatus : room.status}</span>
                <span>Klik Detail →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROOM DETAIL MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {selectedRoom.room.houseName}
                </span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                  Kamar {selectedRoom.room.roomNumber} ({selectedRoom.room.type})
                </h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <p className="text-slate-500 font-medium">Status Kamar:</p>
                <p className="font-bold text-slate-800 dark:text-white text-base">{selectedRoom.room.status}</p>
                <p className="text-slate-500">
                  Tarif: <strong className="text-emerald-600">Rp {selectedRoom.room.tariff.toLocaleString("id-ID")}</strong> / bulan
                </p>
                {selectedRoom.room.notes && (
                  <p className="text-xs text-slate-500 italic">Catatan: {selectedRoom.room.notes}</p>
                )}
              </div>

              {selectedRoom.tenant ? (
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-white">{selectedRoom.tenant.name}</p>
                  <p className="text-xs text-slate-500">{selectedRoom.tenant.occupation} ({selectedRoom.tenant.institution})</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">HP: {selectedRoom.tenant.phone}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">Jatuh Tempo: <strong className="text-rose-600">{selectedRoom.tenant.dueDate}</strong></p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">Status Bayar: <strong className="text-emerald-700">{selectedRoom.tenant.paymentStatus}</strong></p>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 text-center">
                  <p className="font-semibold text-rose-700 dark:text-rose-300">Kamar Kosong / Belum Terisi</p>
                  <p className="text-xs text-slate-500 mt-0.5">Dapat dialokasikan untuk penghuni baru.</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                {selectedRoom.tenant ? (
                  <button
                    onClick={() => {
                      setSelectedRoom(null);
                      setActiveView("pembayaran");
                    }}
                    className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                  >
                    Input Pembayaran
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRoom(null);
                      setActiveView("penghuni");
                    }}
                    className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                  >
                    + Isi Penghuni Baru
                  </button>
                )}
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
