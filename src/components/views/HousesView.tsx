import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BuildingOffice2Icon, HomeIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

export const HousesView: React.FC = () => {
  const { houses, rooms, tenants, setActiveView } = useApp();
  const [selectedHouseName, setSelectedHouseName] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm">
        <div className="flex items-center gap-2">
          <BuildingOffice2Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Data Properti Rumah Kost ({houses.length} Properti)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Ringkasan performa tiap rumah, tingkat keterisian (occupancy), potensi pendapatan bulanan, dan jumlah kamar kosong.
        </p>
      </div>

      {/* HOUSES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {houses.map((h) => {
          const houseRooms = rooms.filter((r) => r.houseName === h.name);
          const houseTenants = tenants.filter((t) => t.houseName === h.name);
          const vacantRoomsCount = houseRooms.filter((r) => r.status === "Kosong").length;
          const occupiedCount = houseRooms.filter((r) => r.status !== "Kosong").length;
          const occupancy = houseRooms.length > 0 ? Math.round((occupiedCount / houseRooms.length) * 100) : 0;
          const totalRev = houseTenants.reduce((acc, t) => acc + t.tariff, 0);

          const glowClass =
            h.gender === "Putri"
              ? "card-glow-pink"
              : h.gender === "Putra"
              ? "card-glow-blue"
              : "card-glow-emerald";

          return (
            <div
              key={h.id}
              className={`p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm cursor-pointer transition-all flex flex-col justify-between ${glowClass}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        h.gender === "Putri"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                          : h.gender === "Putra"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {h.gender}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-1">
                      {h.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{occupancy}%</span>
                    <p className="text-[10px] text-slate-400">Occupancy</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{h.description}</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${occupancy}%` }}
                  />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Total Kamar</p>
                    <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">{h.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Kosong</p>
                    <p className={`font-bold text-xs mt-0.5 ${vacantRoomsCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {vacantRoomsCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Pendapatan</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">
                      Rp {(totalRev / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedHouseName(selectedHouseName === h.name ? null : h.name)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all text-center"
                >
                  {selectedHouseName === h.name ? "Tutup Kamar" : "Lihat Kamar"}
                </button>
                <button
                  onClick={() => setActiveView("denah")}
                  className="py-2 px-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Denah
                </button>
              </div>

              {/* Expanded Rooms List */}
              {selectedHouseName === h.name && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 animate-in fade-in">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Daftar Kamar {h.name}:</p>
                  {houseRooms.map((r) => {
                    const tenant = tenants.find((t) => t.roomId === r.id || (t.houseName === r.houseName && t.roomNumber === r.roomNumber));
                    return (
                      <div
                        key={r.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800 dark:text-white">{r.roomNumber}</span>{" "}
                          <span className="text-slate-500">({r.type})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {tenant ? tenant.name : r.status}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              r.status === "Kosong"
                                ? "bg-rose-500"
                                : r.status === "Maintenance"
                                ? "bg-slate-400"
                                : "bg-emerald-500"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
