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
  ArrowRightStartOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const menuGroups = [
    {
      title: "MODE AKSES TAMPILAN",
      items: [
        { id: "calon-penghuni", label: "Portal Calon Penghuni", icon: SparklesIcon, badge: "Public", highlight: true },
        { id: "portal-penghuni", label: "Portal Mandiri Penghuni", icon: UserGroupIcon, badge: "Tenant" },
        { id: "pemilik-executive", label: "Pemilik Kost Dashboard", icon: ShieldCheckIcon, badge: "Eksekutif" },
        { id: "tata-tertib", label: "Tata Tertib GJI (19 Rules)", icon: DocumentTextIcon, badge: "Resmi" },
      ],
    },
    {
      title: "UTAMA",
      items: [
        { id: "dashboard", label: "Dashboard Manajerial", icon: HomeIcon },
        { id: "denah", label: "Denah Interaktif", icon: MapIcon, badge: "Live" },
        { id: "penghuni", label: "Data Penghuni", icon: UserGroupIcon },
        { id: "rumah", label: "Data Rumah", icon: BuildingOffice2Icon },
        { id: "kamar", label: "Data Kamar", icon: KeyIcon },
      ],
    },
    {
      title: "TRANSAKSI & WA",
      items: [
        { id: "pembayaran", label: "Pembayaran & Kwitansi", icon: CreditCardIcon },
        { id: "reminder", label: "Reminder & WA Gateway", icon: ChatBubbleLeftRightIcon, badge: "API Auto" },
        { id: "keuangan", label: "Keuangan & Trend 12M", icon: BanknotesIcon },
        { id: "laporan", label: "Laporan & PDF", icon: DocumentChartBarIcon },
      ],
    },
    {
      title: "FITUR MODEREN & PROPERTI",
      items: [
        { id: "ai", label: "Smart AI Assistant", icon: SparklesIcon, highlight: true },
        { id: "facility-maintenance", label: "Perawatan Fasilitas (AC/PAM)", icon: Square3Stack3DIcon, badge: "3 Bulan" },
        { id: "maps", label: "Peta Lokasi Kost", icon: MapPinIcon },
        { id: "meter", label: "Meter PLN & PAM", icon: BoltIcon },
        { id: "inventaris", label: "Inventaris Kamar", icon: Square3Stack3DIcon },
        { id: "dokumen", label: "Dokumen & Kontrak", icon: DocumentTextIcon },
        { id: "kalender", label: "Kalender Aktivitas", icon: CalendarDaysIcon },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        { id: "pengaturan", label: "Pengaturan & Backup", icon: Cog6ToothIcon },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between p-4 shrink-0 transition-all duration-200 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </p>
            <nav className="space-y-1">
              {group.items.map((item) => {
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
                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200/50 dark:border-emerald-800/40"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
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
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
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
        ))}
      </div>

      {/* Footer System Info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
          <p className="text-[11px] font-bold text-slate-800 dark:text-white">
            GRIYA JATEN INDAH
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Sleman, Yogyakarta • v2.4 PWA
          </p>
          <button
            onClick={() => setActiveView("dashboard")}
            className="mt-2 w-full py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
          >
            <ArrowRightStartOnRectangleIcon className="w-3.5 h-3.5" />
            <span>Mode Aktif: Properti Smart</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
