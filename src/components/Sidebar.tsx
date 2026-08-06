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
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isOwnerUnlocked, activeRole } = useApp();

  const isCalonPenghuniMode = activeView === "calon-penghuni" || activeRole === "Calon Penghuni";

  const publicMenuItems = [
    { id: "calon-penghuni", label: "Portal Calon Penghuni", icon: SparklesIcon, badge: "Public", highlight: true },
    { id: "tata-tertib", label: "Tata Tertib GJI (19 Rules)", icon: DocumentTextIcon, badge: "Resmi" },
    { id: "denah", label: "Cek Ketersediaan Kamar", icon: MapIcon, badge: "Live" },
    { id: "maps", label: "Peta Lokasi Kost", icon: MapPinIcon },
    { id: "ai", label: "Tanya AI Kost", icon: SparklesIcon, highlight: true },
    { id: "portal-penghuni", label: "Portal Mandiri Penghuni", icon: UserGroupIcon, badge: "Tenant" },
  ];

  const ownerMenuItems = [
    { id: "pemilik-executive", label: "Pemilik Executive", icon: ShieldCheckIcon, badge: "PIN", isOwnerOnly: true },
    { id: "dashboard", label: "Dashboard Manajerial", icon: HomeIcon, isOwnerOnly: true },
    { id: "penghuni", label: "Data Penghuni", icon: UserGroupIcon, isOwnerOnly: true },
    { id: "rumah", label: "Data Rumah", icon: BuildingOffice2Icon, isOwnerOnly: true },
    { id: "kamar", label: "Data Kamar", icon: KeyIcon, isOwnerOnly: true },
    { id: "pembayaran", label: "Pembayaran & Kwitansi", icon: CreditCardIcon, isOwnerOnly: true },
    { id: "reminder", label: "Reminder WA Gateway", icon: ChatBubbleLeftRightIcon, badge: "API", isOwnerOnly: true },
    { id: "keuangan", label: "Keuangan & Trend 12M", icon: BanknotesIcon, isOwnerOnly: true },
    { id: "laporan", label: "Laporan & PDF", icon: DocumentChartBarIcon, isOwnerOnly: true },
    { id: "facility-maintenance", label: "Perawatan Fasilitas", icon: Square3Stack3DIcon, isOwnerOnly: true },
    { id: "meter", label: "Meter PLN & PAM", icon: BoltIcon, isOwnerOnly: true },
    { id: "inventaris", label: "Inventaris Kamar", icon: Square3Stack3DIcon, isOwnerOnly: true },
    { id: "dokumen", label: "Dokumen & Kontrak", icon: DocumentTextIcon, isOwnerOnly: true },
    { id: "kalender", label: "Kalender Aktivitas", icon: CalendarDaysIcon, isOwnerOnly: true },
    { id: "pengaturan", label: "Pengaturan & Backup", icon: Cog6ToothIcon, isOwnerOnly: true },
  ];

  return (
    <aside className="w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-4 shrink-0 transition-all duration-200 min-h-[calc(100vh-65px)]">
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
        
        {/* PUBLIC MENU SECTION */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              PORTAL PUBLIK & CALON PENGHUNI
            </p>
            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <nav className="space-y-1">
            {publicMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                      : item.highlight
                      ? "bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/40"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
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

        {/* OWNER MANAJERIAL SECTION (PROTECTED BY PIN) */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              MANAJEMEN PEMILIK KOST
            </p>
            {!isOwnerUnlocked && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                <LockClosedIcon className="w-3 h-3" />
                PIN Locked
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {ownerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isLocked = !isOwnerUnlocked;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20"
                      : isLocked
                      ? "text-slate-500 dark:text-slate-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-900 dark:hover:text-amber-200"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : isLocked ? "text-slate-400 dark:text-slate-500" : "text-emerald-600 dark:text-emerald-400"}`} />
                    <span className={isLocked ? "opacity-80" : ""}>{item.label}</span>
                  </div>

                  {isLocked ? (
                    <LockClosedIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  ) : item.badge ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer System Info */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
        <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-center">
          <p className="text-[11px] font-extrabold text-black dark:text-white">
            GRIYA JATEN INDAH
          </p>
          <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {isCalonPenghuniMode ? "Mode: Calon Penghuni (Publik)" : isOwnerUnlocked ? "Mode: Pemilik (Akses Penuh)" : "Mode: Terkunci PIN"}
          </p>
          <button
            onClick={() => setActiveView(isCalonPenghuniMode ? "pemilik-executive" : "calon-penghuni")}
            className="mt-2 w-full py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
          >
            {isCalonPenghuniMode ? (
              <>
                <LockClosedIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Masuk Mode Pemilik (PIN)</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Lihat Mode Calon Penghuni</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

