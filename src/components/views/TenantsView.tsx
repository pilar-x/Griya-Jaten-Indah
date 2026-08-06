import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Tenant } from "../../types";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PhoneIcon,
  IdentificationIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export const TenantsView: React.FC = () => {
  const { tenants, houses, rooms, addTenant, updateTenant, deleteTenant, payments, setActiveView } = useApp();

  const [search, setSearch] = useState("");
  const [houseFilter, setHouseFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [genderFilter, setGenderFilter] = useState("Semua");

  const [selectedTenantModal, setSelectedTenantModal] = useState<Tenant | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: "",
    houseName: houses[0]?.name || "Rumah 1",
    roomNumber: "KM3",
    gender: "Putri",
    phone: "081234567890",
    entryDate: new Date().toISOString().slice(0, 10),
    dueDate: "2026-08-25",
    tariff: 650000,
    paymentStatus: "Lunas",
    nik: "3404015201990002",
    cityOrigin: "Sleman",
    occupation: "Mahasiswa",
    institution: "UGM",
    notes: "",
  });

  // Filter logic
  const filteredTenants = tenants.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.houseName.toLowerCase().includes(search.toLowerCase()) ||
      t.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search);

    const matchHouse = houseFilter === "Semua" || t.houseName === houseFilter;
    const matchStatus = statusFilter === "Semua" || t.paymentStatus === statusFilter;
    const matchGender = genderFilter === "Semua" || t.gender === genderFilter;

    return matchSearch && matchHouse && matchStatus && matchGender;
  });

  const handleOpenAdd = () => {
    setEditingTenant(null);
    setFormData({
      name: "",
      houseName: houses[0]?.name || "Rumah 1",
      roomNumber: "KM3",
      gender: "Putri",
      phone: "081234567890",
      entryDate: new Date().toISOString().slice(0, 10),
      dueDate: "2026-08-25",
      tariff: 650000,
      paymentStatus: "Lunas",
      nik: "3404015201990002",
      cityOrigin: "Sleman",
      occupation: "Mahasiswa",
      institution: "UGM",
      notes: "",
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (t: Tenant) => {
    setEditingTenant(t);
    setFormData(t);
    setShowAddEditModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const matchedHouse = houses.find((h) => h.name === formData.houseName) || houses[0];
    const matchedRoom = rooms.find((r) => r.houseName === formData.houseName && r.roomNumber === formData.roomNumber);

    if (editingTenant) {
      updateTenant(editingTenant.id, formData);
    } else {
      addTenant({
        name: formData.name || "",
        houseId: matchedHouse.id,
        houseName: formData.houseName || matchedHouse.name,
        roomId: matchedRoom?.id || "r_new",
        roomNumber: formData.roomNumber || "KM3",
        gender: (formData.gender as "Putri" | "Putra") || "Putri",
        phone: formData.phone || "081234567890",
        entryDate: formData.entryDate || new Date().toISOString().slice(0, 10),
        dueDate: formData.dueDate || "2026-08-25",
        tariff: Number(formData.tariff) || 650000,
        paymentStatus: (formData.paymentStatus as any) || "Lunas",
        nik: formData.nik,
        cityOrigin: formData.cityOrigin,
        occupation: formData.occupation,
        institution: formData.institution,
        notes: formData.notes,
      });
    }

    setShowAddEditModal(false);
  };

  const openWhatsApp = (phone: string, name: string, dueDate: string, tariff: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    const msg = `Halo ${name},\n\nMengingatkan bahwa pembayaran sewa kamar Anda di Griya Jaten Indah akan jatuh tempo pada tanggal ${dueDate}.\nNominal: Rp ${tariff.toLocaleString("id-ID")}\n\nSilakan melakukan pembayaran via transfer / QRIS / cash.\nTerima kasih.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Manajemen Data Penghuni ({tenants.length} Orang)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data seluruh penyewa kost Griya Jaten Indah, tanggal masuk, jatuh tempo, dan dokumen.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Tambah Penghuni Baru</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-[18px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, kamar, HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* House Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Rumah:</span>
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Properti</option>
            {houses.map((h) => (
              <option key={h.id} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Akan Jatuh Tempo">Akan Jatuh Tempo</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Gender:</span>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Gender</option>
            <option value="Putri">Putri</option>
            <option value="Putra">Putra</option>
          </select>
        </div>
      </div>

      {/* TENANTS DATA TABLE */}
      <div className="p-1 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-3.5">Nama Penghuni</th>
                <th className="p-3.5">Properti</th>
                <th className="p-3.5">Kamar</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">No. HP (WA)</th>
                <th className="p-3.5">Jatuh Tempo</th>
                <th className="p-3.5">Tarif</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data penghuni sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p>{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{t.cityOrigin || "Yogyakarta"}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{t.houseName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                        {t.roomNumber}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          t.gender === "Putri"
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {t.gender}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">{t.phone}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-white">{t.dueDate}</td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {t.tariff.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          t.paymentStatus === "Lunas"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : t.paymentStatus === "Akan Jatuh Tempo"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedTenantModal(t)}
                          title="Lihat Detail Profil"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Data"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openWhatsApp(t.phone, t.name, t.dueDate, t.tariff)}
                          title="Kirim Pesan WhatsApp"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data penghuni ${t.name}?`)) {
                              deleteTenant(t.id);
                            }
                          }}
                          title="Hapus Penghuni"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL TENANT MODAL */}
      {selectedTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  {selectedTenantModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white">
                    {selectedTenantModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedTenantModal.houseName} • Kamar {selectedTenantModal.roomNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTenantModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-medium uppercase">No. Telepon / WA</p>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">{selectedTenantModal.phone}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-medium uppercase">NIK KTP</p>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">{selectedTenantModal.nik || "3404015201990002"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Kota Asal</p>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">{selectedTenantModal.cityOrigin || "Yogyakarta"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Pekerjaan / Instansi</p>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                    {selectedTenantModal.occupation || "Mahasiswi"} ({selectedTenantModal.institution || "UGM"})
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Tanggal Masuk:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedTenantModal.entryDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Tanggal Jatuh Tempo:</span>
                  <span className="font-bold text-rose-600">{selectedTenantModal.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Tarif Sewa Bulanan:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                    Rp {selectedTenantModal.tariff.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Payment History Timeline */}
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-2">Riwayat Pembayaran Terakhir:</p>
                <div className="space-y-1.5">
                  {payments
                    .filter((p) => p.tenantName === selectedTenantModal.name)
                    .map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{p.monthPeriod} ({p.method})</p>
                          <p className="text-[10px] text-slate-400">{p.receiptNumber} • {p.date}</p>
                        </div>
                        <span className="font-bold text-emerald-600">Rp {p.amount.toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  {payments.filter((p) => p.tenantName === selectedTenantModal.name).length === 0 && (
                    <p className="text-slate-400 italic text-xs">Belum ada catatan transaksi tambahan di sistem ini.</p>
                  )}
                </div>
              </div>

              {/* Document Upload Previews */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/30">
                  <DocumentTextIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">KTP Tersimpan</span>
                  <p className="text-[9px] text-emerald-600 mt-0.5">Sudah Terverifikasi</p>
                </div>
                <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/30">
                  <DocumentTextIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Kontrak Sewa</span>
                  <p className="text-[9px] text-emerald-600 mt-0.5">Aktif 1 Tahun</p>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => openWhatsApp(selectedTenantModal.phone, selectedTenantModal.name, selectedTenantModal.dueDate, selectedTenantModal.tariff)}
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Kirim WA Reminder</span>
                </button>
                <button
                  onClick={() => setSelectedTenantModal(null)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT TENANT MODAL */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                {editingTenant ? "Edit Data Penghuni" : "Tambah Penghuni Baru"}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Priska Rahmawati"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Properti Rumah</label>
                  <select
                    value={formData.houseName || houses[0]?.name}
                    onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.gender})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Nomor Kamar</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber || ""}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="Pav / KM3 / KM4"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender || "Putri"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Putri">Putri</option>
                    <option value="Putra">Putra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">No. HP (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Tanggal Masuk</label>
                  <input
                    type="text"
                    value={formData.entryDate || ""}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    placeholder="2026-08-01"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Jatuh Tempo</label>
                  <input
                    type="text"
                    value={formData.dueDate || ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="2026-08-25"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Tarif Sewa (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.tariff || 650000}
                    onChange={(e) => setFormData({ ...formData, tariff: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Status Pembayaran</label>
                  <select
                    value={formData.paymentStatus || "Lunas"}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Akan Jatuh Tempo">Akan Jatuh Tempo</option>
                    <option value="Terlambat">Terlambat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Kota Asal</label>
                  <input
                    type="text"
                    value={formData.cityOrigin || ""}
                    onChange={(e) => setFormData({ ...formData, cityOrigin: e.target.value })}
                    placeholder="Semarang / Solo"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Instansi / Kampus</label>
                  <input
                    type="text"
                    value={formData.institution || ""}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="UGM / UNY / Bank"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Simpan Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
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
