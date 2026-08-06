import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Payment } from "../../types";
import {
  UserIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export const TenantPortalView: React.FC = () => {
  const { tenants, rooms, houses, payments, maintenanceLogs, addMaintenanceLog, openPaymentGateway } = useApp();

  const [inputPhoneOrRoom, setInputPhoneOrRoom] = useState("");
  const [activeTenant, setActiveTenant] = useState<any>(tenants[0] || null);

  // Ticket Form State
  const [issueTitle, setIssueTitle] = useState("");
  const [issueCategory, setIssueCategory] = useState<"AC" | "Air / PAM" | "Listrik" | "Kunci & Pintu" | "Fasilitas Lain">("AC");
  const [urgency, setUrgency] = useState<"Biasa" | "Mendesak">("Biasa");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ticketSubmittedMsg, setTicketSubmittedMsg] = useState("");

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const handleSearchTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhoneOrRoom.trim()) return;

    const query = inputPhoneOrRoom.toLowerCase().trim();
    const found = tenants.find(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.phone.replace(/[^0-9]/g, "").includes(query.replace(/[^0-9]/g, "")) ||
        t.roomNumber.toLowerCase().includes(query) ||
        t.houseName.toLowerCase().includes(query)
    );
    if (found) {
      setActiveTenant(found);
    } else {
      alert(`Penghuni "${inputPhoneOrRoom}" tidak ditemukan. Silakan pilih dari daftar atau gunakan Nama/Nomor Kamar yang sesuai.`);
    }
  };

  const handleSelectTenantFromDropdown = (tenantId: string) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      setInputPhoneOrRoom(found.name);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !activeTenant) return;

    addMaintenanceLog({
      houseName: activeTenant.houseName,
      roomNumber: activeTenant.roomNumber,
      issue: `[${issueCategory}] ${issueTitle.trim()} (Tingkat: ${urgency})`,
      reportedDate: new Date().toISOString().slice(0, 10),
      status: "Diproses",
    });

    setTicketSubmittedMsg("✅ Laporan kerusakan berhasil dikirim! Data langsung tersinkron ke Dashboard Pemilik Kost.");
    setIssueTitle("");
    setPhotoPreview(null);

    setTimeout(() => {
      setTicketSubmittedMsg("");
    }, 4500);
  };

  const tenantPayments = payments.filter(
    (p) => p.tenantId === activeTenant?.id || p.tenantName?.toLowerCase() === activeTenant?.name?.toLowerCase()
  );

  const tenantTickets = maintenanceLogs.filter(
    (m) => m.houseName === activeTenant?.houseName && m.roomNumber === activeTenant?.roomNumber
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 rounded-[22px] bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-extrabold">Portal Mandiri Penghuni Kost Griya Jaten Indah</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase">
              Tersinkron Real-time
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Ketik nama Anda untuk mengecek status sewa, riwayat kwitansi pembayaran, serta melaporkan kerusakan fasilitas.
          </p>
        </div>

        {/* Tenant Picker & Search */}
        <div className="flex flex-col sm:flex-row gap-2 items-center bg-white/10 p-2 rounded-2xl border border-white/20">
          <select
            value={activeTenant?.id || ""}
            onChange={(e) => handleSelectTenantFromDropdown(e.target.value)}
            className="px-3 py-1.5 bg-slate-900/90 text-white text-xs rounded-xl font-bold border border-emerald-500/40 focus:outline-none w-full sm:w-auto"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                👤 {t.name} (Kamar {t.roomNumber} - {t.houseName})
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchTenant} className="flex gap-1 w-full sm:w-auto">
            <input
              type="text"
              value={inputPhoneOrRoom}
              onChange={(e) => setInputPhoneOrRoom(e.target.value)}
              placeholder="Cari Nama / No. HP..."
              className="px-3 py-1.5 bg-white/10 text-xs text-white placeholder-slate-400 focus:outline-none rounded-xl border border-white/20 w-full sm:w-36"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              <span>Cari</span>
            </button>
          </form>
        </div>
      </div>

      {activeTenant ? (
        <div className="space-y-6">
          {/* PROFILE & LEASE STATUS CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tenant Info & Rent Status */}
            <div className="lg:col-span-2 p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Penghuni Aktif • {activeTenant.houseName}
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-800 dark:text-white mt-1 flex items-center gap-2">
                    <span>{activeTenant.name}</span>
                    <span className="text-xs font-semibold text-slate-400">({activeTenant.gender || "Putra/Putri"})</span>
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Status Sewa & Pembayaran</p>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black inline-block mt-0.5 ${
                      activeTenant.paymentStatus === "Lunas"
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                        : activeTenant.paymentStatus === "Akan Jatuh Tempo"
                        ? "bg-amber-400 text-slate-900 shadow-sm shadow-amber-400/20"
                        : "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                    }`}
                  >
                    {activeTenant.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Grid Status Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Nomor Kamar & Lokasi</p>
                  <p className="font-extrabold text-sm text-slate-800 dark:text-white mt-0.5">
                    Kamar {activeTenant.roomNumber} ({activeTenant.houseName})
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Tarif Sewa Bulanan</p>
                  <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Rp {activeTenant.tariff.toLocaleString("id-ID")} / bulan
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Jatuh Tempo Pembayaran</p>
                  <p className="font-extrabold text-sm text-rose-600 dark:text-rose-400 mt-0.5">
                    {activeTenant.dueDate}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Tanggal Masuk Kost</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{activeTenant.entryDate}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Instansi / Tempat Kuliah/Kerja</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{activeTenant.institution || "Mahasiswa / Karyawan"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-slate-400 font-semibold text-[10px]">Nomor WhatsApp Penghuni</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{activeTenant.phone}</p>
                </div>
              </div>

              {/* PAYMENT INSTRUCTIONS & INSTANT GATEWAY BUTTON */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-slate-900/40 border border-emerald-200/60 dark:border-emerald-800/50 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500 text-white font-extrabold">
                      <SparklesIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-emerald-900 dark:text-emerald-100 text-sm">
                        Bayar Sewa Kost Instan (QRIS & Virtual Account)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Verifikasi otomatis real-time tanpa perlu kirim bukti transfer manual.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openPaymentGateway(activeTenant.id, activeTenant.tariff)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Bayar QRIS / VA Otomatis</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900 dark:text-emerald-100 font-semibold pt-1">
                  <div className="p-2.5 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 flex justify-between">
                    <span>BCA Transfer Manual:</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-300">037-3829-101</strong>
                  </div>
                  <div className="p-2.5 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 flex justify-between">
                    <span>Mandiri Transfer Manual:</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-300">137-00-1829-301</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Kwitansi Pembayaran Saya */}
            <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <DocumentArrowDownIcon className="w-5 h-5 text-emerald-600" />
                    <span>Kwitansi Pembayaran Saya</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {tenantPayments.length} Pembayaran
                  </span>
                </div>

                {tenantPayments.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 space-y-1">
                    <DocumentTextIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold">Belum Ada Kwitansi</p>
                    <p className="text-[11px] text-slate-400">
                      Riwayat kwitansi pembayaran sewa Anda akan muncul di sini setelah pembayaran dikonfirmasi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {tenantPayments.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex justify-between items-start font-bold text-slate-800 dark:text-white">
                          <div>
                            <span className="text-slate-900 dark:text-white block">{p.monthPeriod}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-normal">
                              {p.date} • {p.method}
                            </span>
                          </div>
                          <span className="text-emerald-600 font-extrabold text-sm">
                            Rp {p.amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                          No: {p.receiptNumber}
                        </p>
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <PrinterIcon className="w-3.5 h-3.5" />
                          <span>Lihat & Cetak Kwitansi Resmi</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 text-center">
                🔒 Kwitansi diterbitkan secara sah oleh Manajemen Griya Jaten Indah.
              </div>
            </div>
          </div>

          {/* LAPORAN KERUSAKAN FASILITAS (MAINTENANCE TICKET SINKRON DENGAN OWNER) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submit Form */}
            <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                    Form Laporan Kerusakan Fasilitas Kamar
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Tersinkron Ke Pemilik Kost
                </span>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Fasilitas / Kerusakan
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold"
                  >
                    <option value="AC">AC kurang dingin / bocor air / berisik</option>
                    <option value="Air / PAM">Air PAM keruh / kran air bocor / shower macet</option>
                    <option value="Listrik">Stopkontak / saklar / lampu mati / sekring turun</option>
                    <option value="Kunci & Pintu">Kunci kamar / engsel / gagang pintu macet</option>
                    <option value="Fasilitas Lain">Kasur Springbed / Lemari / Meja / Wi-Fi Internet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi Detail Kerusakan
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder={`misal: Kran air kamar mandi di Kamar ${activeTenant.roomNumber} menetes terus dan AC terasa kurang dingin sejak 2 hari lalu.`}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tingkat Urgensi Perbaikan
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold"
                    >
                      <option value="Biasa">Biasa (Diproses 1-2 Hari Kerja)</option>
                      <option value="Mendesak">Mendesak / Darurat (Hari ini)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Foto Bukti Kerusakan (Opsional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>

                {photoPreview && (
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold mb-1">Lampiran Foto Kerusakan:</p>
                    <img src={photoPreview} alt="Bukti" className="h-28 object-cover rounded-lg" />
                  </div>
                )}

                {ticketSubmittedMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 font-extrabold animate-bounce">
                    {ticketSubmittedMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <WrenchScrewdriverIcon className="w-4 h-4" />
                  <span>Kirim Laporan Kerusakan Ke Pemilik</span>
                </button>
              </form>
            </div>

            {/* Ticket Tracker Status */}
            <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-emerald-600" />
                  <span>Status Laporan Kerusakan Kamar {activeTenant.roomNumber}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {tenantTickets.length} Tiket
                </span>
              </div>

              {tenantTickets.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 space-y-2">
                  <CheckCircleIcon className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-extrabold text-slate-800 dark:text-white">Tidak Ada Laporan Kerusakan Active</p>
                  <p className="text-[11px] text-slate-400">
                    Fasilitas di kamar {activeTenant.roomNumber} dalam keadaan baik. Jika ada kendala, kirimkan laporan via form di sebelah kiri.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {tenantTickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                          {t.issue}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0 ${
                            t.status === "Selesai"
                              ? "bg-emerald-500 text-white"
                              : t.status === "Dikerjakan"
                              ? "bg-blue-500 text-white"
                              : "bg-amber-400 text-slate-950"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span>Dilaporkan: {t.reportedDate}</span>
                        <span>Lokasi: {t.houseName} - {t.roomNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
          <UserIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Pilih atau Cari Nama Penghuni</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Silakan pilih nama penghuni dari menu dropdown di atas atau ketik nama Anda untuk masuk ke portal mandiri.
          </p>
        </div>
      )}

      {/* OFFICIAL PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-sm">Kwitansi Resmi Pembayaran Sewa</h3>
                  <p className="text-[11px] text-slate-300 font-mono">{selectedReceipt.receiptNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Receipt Body Frame */}
              <div id="printable-receipt" className="p-6 bg-amber-50/30 dark:bg-slate-800/50 rounded-2xl border-2 border-emerald-500/30 space-y-4">
                <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-4">
                  <h4 className="font-black text-base text-slate-900 dark:text-white tracking-wide uppercase">
                    KOST GRIYA JATEN INDAH
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Jl. Jaten Indah No. 12, Pedowoso, Karanganyar / Yogyakarta
                  </p>
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white uppercase">
                    KWITANSI PEMBAYARAN SEWA (SAH)
                  </span>
                </div>

                <div className="space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor Kwitansi:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{selectedReceipt.receiptNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal Bayar:</span>
                    <strong className="text-slate-800 dark:text-white">{selectedReceipt.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Penghuni:</span>
                    <strong className="text-slate-800 dark:text-white">{selectedReceipt.tenantName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kamar & Lokasi:</span>
                    <strong className="text-slate-800 dark:text-white">
                      Kamar {selectedReceipt.roomNumber} ({selectedReceipt.houseName})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Periode Sewa Bulan:</span>
                    <strong className="text-slate-800 dark:text-white">{selectedReceipt.monthPeriod}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode Pembayaran:</span>
                    <strong className="text-emerald-600">{selectedReceipt.method}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">JUMLAH DIBAYAR</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    Rp {selectedReceipt.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize italic">
                    Terbilang: #{selectedReceipt.amount.toLocaleString("id-ID")} Rupiah Lunas#
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                  <span>Penerima: {selectedReceipt.recordedBy || "Pengelola GJI"}</span>
                  <span className="font-extrabold text-emerald-600">✓ STEMPEL DIGITAL GJI</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Cetak / Simpan PDF Kwitansi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
