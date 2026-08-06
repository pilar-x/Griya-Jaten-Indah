import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Tenant } from "../../types";
import {
  DocumentTextIcon,
  FolderIcon,
  EyeIcon,
  XMarkIcon,
  PrinterIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export const DocumentsView: React.FC = () => {
  const { tenants } = useApp();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState<"ktp" | "contract">("ktp");

  const OWNER_NAME = "Ibu Retno Handayani";
  const OWNER_PHONE = "0817-201-958";

  const handlePrintDocument = () => {
    window.print();
  };

  const handleSendContractWa = (t: Tenant) => {
    const text = `*SURAT PERJANJIAN SEWA KOST GRIYA JATEN INDAH*\n\n*Nama Penghuni:* ${t.name}\n*Lokasi:* ${t.houseName} (Kamar ${t.roomNumber})\n*Tarif Sewa:* Rp ${t.tariff.toLocaleString("id-ID")}/bulan\n*Jatuh Tempo:* Setiap tanggal ${t.dueDate.slice(-2)}\n\n*Pemilik:* ${OWNER_NAME} (${OWNER_PHONE})\n\nDokumen digital terverifikasi dalam sistem Smart Kost GJI. Terima kasih.`;
    const cleanPhone = t.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Arsip Dokumen KTP & Kontrak Sewa Penghuni
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Penyimpanan digital identitas KTP dan surat perjanjian kontrak sewa kamar Griya Jaten Indah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        {tenants.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.houseName} - {t.roomNumber}</p>
              </div>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <FolderIcon className="w-5 h-5" />
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">📷 File KTP:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  KTP_{t.name.split(" ")[0]}.jpg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">📄 Perjanjian Kontrak:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Kontrak_GJI_2026.pdf
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTenant(t);
                setActiveTab("ktp");
              }}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Pratinjau Dokumen</span>
            </button>
          </div>
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Arsip Digital Terverifikasi
                </span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                  Dokumen: {selectedTenant.name} ({selectedTenant.houseName} - {selectedTenant.roomNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setActiveTab("ktp")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "ktp"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                📷 Pratinjau KTP Digital
              </button>
              <button
                onClick={() => setActiveTab("contract")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "contract"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                📄 Surat Perjanjian Sewa GJI
              </button>
            </div>

            {/* KTP TAB CONTENT */}
            {activeTab === "ktp" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-mono tracking-widest text-blue-200 uppercase">
                        REPUBLIK INDONESIA — KARTU TANDA PENDUDUK
                      </p>
                      <p className="text-base font-extrabold tracking-wider mt-1 font-mono">
                        NIK: 340407120{selectedTenant.id.slice(-4)}88001
                      </p>
                    </div>
                    <ShieldCheckIcon className="w-8 h-8 text-blue-300 opacity-80" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="col-span-2 space-y-1">
                      <p><span className="text-blue-300">Nama:</span> <strong className="uppercase">{selectedTenant.name}</strong></p>
                      <p><span className="text-blue-300">Pekerjaan:</span> {selectedTenant.occupation} ({selectedTenant.institution})</p>
                      <p><span className="text-blue-300">No. HP:</span> {selectedTenant.phone}</p>
                      <p><span className="text-blue-300">Alamat Asal:</span> {selectedTenant.originCity}</p>
                      <p><span className="text-blue-300">Kamar GJI:</span> {selectedTenant.houseName} — Kamar {selectedTenant.roomNumber}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-xl border border-white/20 text-center">
                      <div className="w-16 h-20 bg-slate-300 rounded-lg flex items-center justify-center text-slate-700 font-bold text-xs">
                        FOTO KTP
                      </div>
                      <span className="text-[9px] text-emerald-300 mt-2 font-bold">VERIFIED GJI</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-500 flex items-center justify-between">
                  <span>Status Verifikasi Identitas KTP:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" /> Terverifikasi & Disimpan
                  </span>
                </div>
              </div>
            )}

            {/* CONTRACT TAB CONTENT */}
            {activeTab === "contract" && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-amber-200/60 dark:border-slate-700 text-xs space-y-3 leading-relaxed">
                  <div className="text-center border-b border-amber-200 dark:border-slate-700 pb-3">
                    <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-300 uppercase">
                      SURAT PERJANJIAN SEWA KAMAR KOST GRIYA JATEN INDAH
                    </h4>
                    <p className="text-[10px] text-slate-500">No. Registrasi Kontrak: GJI/{new Date().getFullYear()}/{selectedTenant.id}</p>
                  </div>

                  <p>
                    Pada hari ini disetujui perjanjian sewa kamar kost antara <strong>{OWNER_NAME}</strong> (PIHAK PERTAMA / Pemilik) dan <strong>{selectedTenant.name}</strong> (PIHAK KEDUA / Penghuni).
                  </p>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/50 dark:border-slate-700 space-y-1">
                    <p>• <strong>Kamar Ditempati:</strong> {selectedTenant.houseName} — Kamar {selectedTenant.roomNumber}</p>
                    <p>• <strong>Tarif Sewa Bulanan:</strong> Rp {selectedTenant.tariff.toLocaleString("id-ID")} / bulan</p>
                    <p>• <strong>Tanggal Jatuh Tempo:</strong> Setiap tanggal {selectedTenant.dueDate.slice(-2)} tiap bulannya</p>
                    <p>• <strong>Tanggal Masuk Awal:</strong> {selectedTenant.entryDate}</p>
                  </div>

                  <p>
                    PIHAK KEDUA telah membaca, memahami, dan bersedia mematuhi seluruh <strong>19 Poin Tata Tertib Penghuni Kost Griya Jaten Indah</strong>.
                  </p>

                  <div className="pt-4 border-t border-amber-200 dark:border-slate-700 flex justify-between items-end text-center">
                    <div>
                      <p className="text-[10px] text-slate-400">Pihak Kedua (Penghuni)</p>
                      <p className="font-bold mt-6 text-slate-800 dark:text-white">{selectedTenant.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Pihak Pertama (Pemilik GJI)</p>
                      <p className="font-bold mt-6 text-emerald-700 dark:text-emerald-400">{OWNER_NAME}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendContractWa(selectedTenant)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Kirim Ringkasan Kontrak via WA</span>
                  </button>
                  <button
                    onClick={handlePrintDocument}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    <span>Cetak Dokumen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

