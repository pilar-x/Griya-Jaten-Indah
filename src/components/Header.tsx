import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { UserRole } from "../types";

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeView,
    setActiveView,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    tenants,
    rooms,
    payments,
    houses,
    isOwnerUnlocked,
    lockOwnerAccess,
  } = useApp();

  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Live global search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { tenants: [], rooms: [], payments: [], houses: [] };
    const q = searchQuery.toLowerCase();

    const matchedTenants = tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.houseName.toLowerCase().includes(q) ||
        t.roomNumber.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        (t.originCity && t.originCity.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedRooms = rooms.filter(
      (r) =>
        r.roomNumber.toLowerCase().includes(q) ||
        r.houseName.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedPayments = payments.filter(
      (p) =>
        p.tenantName.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.houseName.toLowerCase().includes(q) ||
        p.roomNumber.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedHouses = houses.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.gender.toLowerCase().includes(q) ||
        (h.description && h.description.toLowerCase().includes(q))
    ).slice(0, 3);

    return { tenants: matchedTenants, rooms: matchedRooms, payments: matchedPayments, houses: matchedHouses };
  }, [searchQuery, tenants, rooms, payments, houses]);

  const hasResults =
    searchResults.tenants.length > 0 ||
    searchResults.rooms.length > 0 ||
    searchResults.payments.length > 0 ||
    searchResults.houses.length > 0;

  // Today Date formatted in Indonesian
  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const roles: UserRole[] = ["Pemilik", "Penjaga Kost", "Admin"];

  const handleSelectSearchResult = (viewName: string) => {
    setActiveView(viewName as any);
    setShowMobileSearchModal(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 md:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left Brand / Logo & Quick View Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView("dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20">
              🏠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-800 dark:text-white text-base md:text-lg tracking-tight leading-none">
                  GRIYA JATEN INDAH
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300/50">
                  GJI Smart
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Smart Kost Management System
              </p>
            </div>
          </div>

          {/* Quick Mode Switcher Pills */}
          <div className="hidden xl:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/70 dark:border-slate-700/70 text-xs">
            <button
              onClick={() => setActiveView("calon-penghuni")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeView === "calon-penghuni"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              <span>🌟 Portal Calon Penghuni</span>
            </button>
            <button
              onClick={() => setActiveView("pemilik-executive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeView === "pemilik-executive"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              <span>👑 Pemilik Kost</span>
            </button>
            <button
              onClick={() => setActiveView("dashboard")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeView === "dashboard"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              }`}
            >
              <span>🏢 Operasional</span>
            </button>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:block flex-1 max-w-md relative">
          <div className="flex items-center relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama penghuni, nomor kamar, atau rumah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs md:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Search Results Live Dropdown */}
          {searchQuery.trim() !== "" && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 max-h-96 overflow-y-auto space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hasil Pencarian Global ("{searchQuery}")
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-rose-500"
                >
                  Tutup
                </button>
              </div>

              {!hasResults ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Tidak ditemukan data yang cocok dengan "{searchQuery}".
                </p>
              ) : (
                <div className="space-y-3 text-xs">
                  {/* Tenants */}
                  {searchResults.tenants.length > 0 && (
                    <div>
                      <p className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400 uppercase mb-1">
                        👤 Penghuni ({searchResults.tenants.length})
                      </p>
                      <div className="space-y-1">
                        {searchResults.tenants.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleSelectSearchResult("penghuni")}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer flex justify-between items-center transition-all"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{t.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {t.houseName} — Kamar {t.roomNumber} ({t.phone})
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold">
                              Lihat
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rooms */}
                  {searchResults.rooms.length > 0 && (
                    <div>
                      <p className="font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase mb-1">
                        🚪 Kamar ({searchResults.rooms.length})
                      </p>
                      <div className="space-y-1">
                        {searchResults.rooms.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => handleSelectSearchResult("kamar")}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 cursor-pointer flex justify-between items-center transition-all"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">
                                {r.houseName} — Kamar {r.roomNumber}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                Tipe: {r.type} • Status: {r.status}
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
                              Lihat
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payments */}
                  {searchResults.payments.length > 0 && (
                    <div>
                      <p className="font-bold text-[10px] text-amber-600 dark:text-amber-400 uppercase mb-1">
                        💸 Kwitansi & Pembayaran ({searchResults.payments.length})
                      </p>
                      <div className="space-y-1">
                        {searchResults.payments.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectSearchResult("pembayaran")}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/60 cursor-pointer flex justify-between items-center transition-all"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">
                                {p.receiptNumber} — {p.tenantName}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                Rp {p.amount.toLocaleString("id-ID")} ({p.monthPeriod})
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                              Lihat
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Trigger Button */}
          <button
            onClick={() => setShowMobileSearchModal(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cari Data"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-emerald-600" />
          </button>
          {/* Today's Date */}
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              {todayFormatted}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sleman, Yogyakarta
            </span>
          </div>

          {/* Owner PIN Security Lock Indicator */}
          <button
            onClick={() => {
              if (isOwnerUnlocked) {
                lockOwnerAccess();
              } else {
                setActiveView("pemilik-executive");
              }
            }}
            title={isOwnerUnlocked ? "Akses Pemilik Terbuka (Klik untuk Mengunci Kembali)" : "Akses Pemilik Terkunci PIN"}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isOwnerUnlocked
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
            }`}
          >
            <span>{isOwnerUnlocked ? "🔓 PIN Unlocked" : "🔒 PIN Terkunci"}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPopover((p) => !p)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <BellIcon className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-white">
                      Notifikasi
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                      {notifications.length} Info
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        !n.read
                          ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {n.type === "danger" ? (
                            <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" />
                          ) : (
                            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className="font-semibold text-xs text-slate-800 dark:text-white">
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Multi-Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown((p) => !p)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500/50 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {activeRole === "Pemilik" ? "RH" : activeRole === "Penjaga Kost" ? "JK" : "AD"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">
                  {activeRole === "Pemilik" ? "Ibu Retno Handayani" : activeRole === "Penjaga Kost" ? "Pak Agus (Penjaga)" : "Admin GJI"}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {activeRole === "Pemilik" ? "Pemilik (0817-201-958)" : activeRole}
                </p>
              </div>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Ganti Hak Akses
                </p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-between ${
                      activeRole === r
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{r}</span>
                    {activeRole === r && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH MODAL OVERLAY */}
      {showMobileSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex flex-col p-4 md:hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-emerald-600" />
                <span>Pencarian Global GJI</span>
              </span>
              <button
                onClick={() => setShowMobileSearchModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                autoFocus
                placeholder="Ketik nama penghuni, kamar, rumah, HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3.5 text-slate-400"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
              {!searchQuery.trim() ? (
                <p className="text-center text-slate-400 py-6">
                  Ketik kata kunci untuk mencari penghuni, kamar, atau kwitansi.
                </p>
              ) : !hasResults ? (
                <p className="text-center text-slate-500 py-6">
                  Tidak ditemukan hasil untuk "{searchQuery}".
                </p>
              ) : (
                <>
                  {searchResults.tenants.length > 0 && (
                    <div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] mb-1">
                        Penghuni ({searchResults.tenants.length})
                      </p>
                      <div className="space-y-1.5">
                        {searchResults.tenants.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleSelectSearchResult("penghuni")}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{t.name}</p>
                              <p className="text-[10px] text-slate-500">{t.houseName} - Kamar {t.roomNumber}</p>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg">
                              Buka
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.rooms.length > 0 && (
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] mb-1">
                        Kamar ({searchResults.rooms.length})
                      </p>
                      <div className="space-y-1.5">
                        {searchResults.rooms.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => handleSelectSearchResult("kamar")}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{r.houseName} — {r.roomNumber}</p>
                              <p className="text-[10px] text-slate-500">Status: {r.status}</p>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-blue-600 text-white font-bold rounded-lg">
                              Buka
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
