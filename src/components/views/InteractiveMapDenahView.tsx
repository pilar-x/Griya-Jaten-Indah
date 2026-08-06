import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Room, Tenant } from "../../types";
import {
  MapIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export const InteractiveMapDenahView: React.FC = () => {
  const { houses, rooms, tenants, setActiveView } = useApp();
  const [selectedHouseId, setSelectedHouseId] = useState<string>(houses[0]?.id || "h1");
  const [selectedRoom, setSelectedRoom] = useState<{ room: Room; tenant?: Tenant } | null>(null);

  const selectedHouse = houses.find((h) => h.id === selectedHouseId) || houses[0];
  const houseRooms = rooms.filter((r) => r.houseName === selectedHouse.name);

  const getStatusColor = (status: Room["status"], tenant?: Tenant) => {
    if (status === "Maintenance") return "bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-800 dark:text-slate-200";
    if (status === "Kosong") return "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400";

    if (tenant?.paymentStatus === "Terlambat") {
      return "bg-rose-500 text-white border-rose-600 shadow-rose-500/20";
    }
    if (tenant?.paymentStatus === "Akan Jatuh Tempo") {
      return "bg-amber-400 text-slate-950 dark:text-slate-950 border-amber-500 shadow-amber-400/20 font-bold";
    }
    return "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20";
  };

  const handleRoomClick = (room: Room) => {
    const tenant = tenants.find((t) => t.roomId === room.id || (t.houseName === room.houseName && t.roomNumber === room.roomNumber));
    setSelectedRoom({ room, tenant });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Denah Interaktif Kamar (Interactive Floorplan)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual spasial denah properti Griya Jaten Indah. Klik kamar untuk melihat detail status & penghuni.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Terisi (Lunas)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-700 dark:text-slate-300">Akan Jatuh Tempo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-700 dark:text-slate-300">Terlambat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-700 dark:text-slate-300">Kosong / Maintenance</span>
          </div>
        </div>
      </div>

      {/* House Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {houses.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHouseId(h.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedHouseId === h.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
            }`}
          >
            {h.name} <span className="opacity-75">({h.gender})</span>
          </button>
        ))}
      </div>

      {/* FLOORPLAN ARCHITECTURAL BLUEPRINT GRID */}
      <div className="p-6 md:p-8 rounded-[24px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full uppercase">
              Properti: {selectedHouse.name} ({selectedHouse.gender})
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-1">
              Denah Tata Letak Kamar ({houseRooms.length} Kamar)
            </h3>
            <p className="text-xs text-slate-500">{selectedHouse.description}</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Okupansi: {Math.round((houseRooms.filter((r) => r.status !== "Kosong").length / houseRooms.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Visual Architectural Layout */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 relative min-h-[320px] flex flex-col justify-between gap-8">
          {/* Top Corridor Label */}
          <div className="text-center py-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            ─── KORIDOR UTAMA / HALAMAN DEPAN ───
          </div>

          {/* Room Boxes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {houseRooms.map((room) => {
              const tenant = tenants.find(
                (t) => t.roomId === room.id || (t.houseName === room.houseName && t.roomNumber === room.roomNumber)
              );
              const colorClass = getStatusColor(room.status, tenant);

              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col justify-between h-32 hover:scale-[1.04] shadow-sm relative overflow-hidden ${colorClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm tracking-tight">{room.roomNumber}</span>
                    <span className="text-[10px] font-medium opacity-90">{room.type}</span>
                  </div>

                  <div className="my-1">
                    <p className="font-bold text-xs truncate">
                      {tenant ? tenant.name : room.status === "Kosong" ? "KOSONG" : room.notes || "MAINTENANCE"}
                    </p>
                    <p className="text-[10px] opacity-90 mt-0.5">
                      Rp {room.tariff.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-medium border-t border-black/10 pt-1 mt-1">
                    <span>{tenant ? tenant.paymentStatus : room.status}</span>
                    <span>{tenant ? `JT ${tenant.dueDate.slice(-5)}` : "Lihat"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Facilities / Entrance Indicator */}
          <div className="text-center py-1 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-lg text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            ▲ POS PENJAGA / PARKIR MOTOR & GERBANG RUMAH
          </div>
        </div>
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
                <span className="font-bold text-slate-800 dark:text-white text-base">
                  {selectedRoom.room.status}
                </span>
                <p className="text-slate-500">
                  Tarif Sewa: <span className="font-bold text-emerald-600">Rp {selectedRoom.room.tariff.toLocaleString("id-ID")}</span> / bulan
                </p>
              </div>

              {selectedRoom.tenant ? (
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{selectedRoom.tenant.name}</p>
                      <p className="text-xs text-slate-500">{selectedRoom.tenant.occupation} ({selectedRoom.tenant.institution})</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/50 space-y-1 text-xs">
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedRoom.tenant.phone}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Masuk: {selectedRoom.tenant.entryDate} • Due: <strong className="text-rose-600">{selectedRoom.tenant.dueDate}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CreditCardIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Status Bayar: <strong className="text-emerald-700">{selectedRoom.tenant.paymentStatus}</strong></span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 text-center">
                  <InformationCircleIcon className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Kamar Ini Belum Terisi</p>
                  <p className="text-xs text-slate-500 mt-0.5">Siap huni untuk calon penghuni baru.</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                {selectedRoom.tenant && (
                  <button
                    onClick={() => {
                      setSelectedRoom(null);
                      setActiveView("pembayaran");
                    }}
                    className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                  >
                    Input Pembayaran
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
