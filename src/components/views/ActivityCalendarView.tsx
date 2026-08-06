import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarDaysIcon, PlusIcon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

export const ActivityCalendarView: React.FC = () => {
  const { tenants, calendarEvents, addCalendarEvent, setActiveView } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState<"Jatuh Tempo" | "Kebersihan" | "Meter" | "Maintenance" | "Lainnya">("Kebersihan");

  const combinedEvents = [
    ...tenants.map((t) => ({
      id: `due_${t.id}`,
      date: t.dueDate,
      title: `Jatuh Tempo Sewa: ${t.name}`,
      subtitle: `${t.houseName} (${t.roomNumber}) • Rp ${t.tariff.toLocaleString("id-ID")}`,
      type: "Jatuh Tempo" as const,
      tenantId: t.id,
    })),
    ...calendarEvents.map((ev) => ({
      id: ev.id,
      date: ev.date,
      title: ev.title,
      subtitle: ev.subtitle || ev.description || "",
      type: ev.type as any,
      tenantId: undefined,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      date,
      title,
      subtitle,
      description: subtitle,
      type,
    });

    setShowModal(false);
    setTitle("");
    setSubtitle("");
  };

  const handleEventClick = (ev: typeof combinedEvents[0]) => {
    if (ev.type === "Jatuh Tempo") {
      setActiveView("pembayaran");
    } else if (ev.type === "Maintenance") {
      setActiveView("inventaris");
    } else if (ev.type === "Meter") {
      setActiveView("meter");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Kalender Aktivitas & Jadwal Jatuh Tempo ({combinedEvents.length} Agenda)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Jadwal jatuh tempo sewa penghuni, agenda kebersihan bersama, dan perawatan fasilitas GJI.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>+ Tambah Agenda Kegiatan</span>
        </button>
      </div>

      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3">
        <div className="space-y-2">
          {combinedEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => handleEventClick(ev)}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between hover:border-emerald-500 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                  <span>{ev.date.slice(-2)}</span>
                  <span className="text-[9px] uppercase">{ev.date.slice(5, 7)}</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                    ev.type === "Jatuh Tempo"
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                      : ev.type === "Maintenance"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {ev.type}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">Klik aksi →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD AGENDA MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-emerald-600" />
                <span>Tambah Agenda / Kegiatan Baru</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs md:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Agenda:</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembersihan Rutin Tandon Air R1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Kegiatan:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Kategori:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="Kebersihan">Kebersihan Rutin</option>
                  <option value="Maintenance">Maintenance & Perbaikan</option>
                  <option value="Meter">Pengecekan Meter PLN/PAM</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Keterangan / Subtitle:</label>
                <input
                  type="text"
                  placeholder="Contoh: Dilakukan oleh Pak Agus (Penjaga Kost)"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

