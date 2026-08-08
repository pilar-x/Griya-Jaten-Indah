import React from "react";
import { useApp } from "../context/AppContext";
import {
  HomeIcon,
  MapIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  KeyIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  SparklesIcon,
  MapPinIcon,
  BoltIcon,
  Square3Stack3DIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isOwnerUnlocked, lockOwnerAccess } = useApp();

  // 4 Fitur umum publik khusus Calon Penghuni
  const publicMenuItems = [
    {
      id: "calon-penghuni",
      label: "Portal Calon Penghuni",
      desc: "Informasi, Fasilitas & Booking",
      icon: SparklesIcon,
      badge: "Utama",
      highlight: true,
    },
    {
      id: "denah",
      label: "Cek Ketersediaan Kamar",
      desc: "Denah Interaktif Status Kamar",
      icon: MapIcon,
      badge: "Live",
    },
    {
      id: "tata-tertib",
      label: "Tata Tertib GJI",
      desc: "19 Aturan Resmi Kost",
      icon: DocumentTextIcon,
      badge: "Resmi",
    },
    {
      id: "maps",
      label: "Peta Lokasi Kost",
      desc: "Integrasi Google Maps",
      icon: MapPinIcon,
    },
  ];

  // Menu Manajemen Pemilik Kost (Hanya tampil jika sudah dibuka PIN)
  const ownerMenuItems = [
    { id: "pemilik-executive", label: "Pemilik Executive", icon: ShieldCheckIcon, badge: "VIP" },
    { id: "dashboard", label: "Dashboard Manajerial", icon: HomeIcon },
    { id: "ai", label: "Tanya AI Kost (Smart AI)", icon: SparklesIcon, badge: "AI" },
    { id: "penghuni", label: "Data Penghuni", icon: UserGroupIcon },
    { id: "rumah", label: "Data Rumah Kost", icon: BuildingOffice2Icon },
    { id: "kamar", label: "Data Kamar", icon: KeyIcon },
    { id: "pembayaran", label: "Pembayaran & Kwitansi", icon: CreditCardIcon },
    { id: "reminder", label: "Reminder WA Gateway", icon: ChatBubbleLeftRightIcon, badge: "API" },
    { id: "keuangan", label: "Keuangan & Trend 12M", icon: BanknotesIcon },
    { id: "laporan", label: "Laporan & Export PDF", icon: DocumentChartBarIcon },
    { id: "facility-maintenance", label: "Perawatan Fasilitas", icon: Square3Stack3DIcon },
    { id: "meter", label: "Meter PLN & PAM", icon: BoltIcon },
    { id: "inventaris", label: "Inventaris Kamar", icon: Square3Stack3DIcon },
    { id: "dokumen", label: "Dokumen & Kontrak", icon: DocumentTextIcon },
    { id: "kalender", label: "Kalender Aktivitas", icon: CalendarDaysIcon },
    { id: "pengaturan", label: "Pengaturan & Backup", icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-4 shrink-0 transition-all duration-200 min-h-[calc(100vh-65px)]">
      <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
        
        {/* PUBLIC MENU SECTION (5 FITUR FITUR CALON PENGHUNI) */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              FITUR UMUM CALON PENGHUNI
            </p>
            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <nav className="space-y-1.5">
            {publicMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 scale-[1.01]"
                      : item.highlight
                      ? "bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/40"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                    <div className="flex flex-col">
                      <span className="leading-snug">{item.label}</span>
                      <span className={`text-[10px] ${isActive ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"} font-normal`}>
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* OWNER MANAJERIAL SECTION - ONLY SHOWN IF UNLOCKED WITH PIN */}
        {isOwnerUnlocked ? (
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                MANAJEMEN PEMILIK KOST
              </p>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <LockOpenIcon className="w-3 h-3 text-emerald-600" />
                Unlocked
              </span>
            </div>
            <nav className="space-y-1">
              {ownerMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* OWNER MENUS ARE COMPLETELY HIDDEN IN CALON PENGHUNI MODE */
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900/50 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <LockClosedIcon className="w-4 h-4 text-amber-600" />
                <span>Area Khusus Pemilik</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Menu manajemen internal disembunyikan untuk keamanan pengunjung.
              </p>
              <button
                onClick={() => setActiveView("pemilik-executive")}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <LockClosedIcon className="w-3.5 h-3.5" />
                <span>Masuk Mode Pemilik (PIN)</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer System Info */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
        <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-center">
          <p className="text-[11px] font-extrabold text-black dark:text-white">
            GRIYA JATEN INDAH
          </p>
          <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {isOwnerUnlocked ? "Mode: Pemilik Kost (Akses Penuh)" : "Mode: Calon Penghuni (Publik)"}
          </p>
          {isOwnerUnlocked ? (
            <button
              onClick={lockOwnerAccess}
              className="mt-2 w-full py-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:underline flex items-center justify-center gap-1"
            >
              <LockClosedIcon className="w-3.5 h-3.5" />
              <span>Kunci Kembali Akses</span>
            </button>
          ) : (
            <p className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
              ✓ Akses Publik Terproteksi
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};


