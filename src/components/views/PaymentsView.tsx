import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Payment, PaymentMethod } from "../../types";
import { exportToPdf } from "../../utils/pdfExport";
import {
  CreditCardIcon,
  PlusIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  QrCodeIcon,
  DocumentCheckIcon,
  TrashIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export const PaymentsView: React.FC = () => {
  const { payments, tenants, addPayment, deletePayment, activeRole, openPaymentGateway } = useApp();

  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Input Form State
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || "");
  const [method, setMethod] = useState<PaymentMethod>("Transfer");
  const [amount, setAmount] = useState<number>(700000);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [monthPeriod, setMonthPeriod] = useState<string>("Agustus 2026");
  const [notes, setNotes] = useState<string>("Pembayaran sewa kamar bulanan");
  const [proofUrl, setProofUrl] = useState<string>("");

  const handleSelectTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const t = tenants.find((item) => item.id === tenantId);
    if (t) {
      setAmount(t.tariff);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tenants.find((item) => item.id === selectedTenantId) || tenants[0];
    if (!t) return;

    const receiptNum = addPayment({
      tenantId: t.id,
      tenantName: t.name,
      houseName: t.houseName,
      roomNumber: t.roomNumber,
      amount,
      date,
      monthPeriod,
      method,
      proofUrl,
      notes,
      recordedBy: activeRole,
    });

    setShowInputModal(false);

    // Open Kwitansi for the newly created payment
    const newPaymentObj: Payment = {
      id: "p_temp",
      receiptNumber: receiptNum,
      tenantId: t.id,
      tenantName: t.name,
      houseName: t.houseName,
      roomNumber: t.roomNumber,
      amount,
      date,
      monthPeriod,
      method,
      proofUrl,
      notes,
      recordedBy: activeRole,
    };
    setSelectedReceipt(newPaymentObj);
  };

  // Helper number to Indonesian words (Terbilang)
  const numberToTerbilang = (num: number): string => {
    if (num === 700000) return "Tujuh Ratus Ribu Rupiah";
    if (num === 650000) return "Enam Ratus Lima Puluh Ribu Rupiah";
    if (num === 600000) return "Enam Ratus Ribu Rupiah";
    return `${num.toLocaleString("id-ID")} Rupiah`;
  };

  const handlePrint = async () => {
    if (selectedReceipt) {
      await exportToPdf("kwitansi-modal-content", `Kwitansi_GJI_${selectedReceipt.receiptNumber}`);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Pencatatan Pembayaran & Kwitansi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Input transaksi sewa (Cash, Transfer, QRIS), cetak kwitansi resmi ber-QR Code, dan simpan bukti transfer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openPaymentGateway()}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <QrCodeIcon className="w-4 h-4 text-amber-400" />
            <span>⚡ Payment Gateway (QRIS / VA)</span>
          </button>

          <button
            onClick={() => {
              setShowInputModal(true);
              setProofUrl("");
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Input Pembayaran Baru</span>
          </button>
        </div>
      </div>

      {/* PAYMENTS HISTORY TABLE */}
      <div className="p-1 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-3.5">No. Kwitansi</th>
                <th className="p-3.5">Penghuni</th>
                <th className="p-3.5">Properti & Kamar</th>
                <th className="p-3.5">Periode Bulan</th>
                <th className="p-3.5">Metode</th>
                <th className="p-3.5">Nominal</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5 text-center">Aksi Kwitansi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {p.receiptNumber}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-white">{p.tenantName}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                    {p.houseName} ({p.roomNumber})
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-200">{p.monthPeriod}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        p.method === "QRIS"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : p.method === "Transfer"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-800 dark:text-white">
                    Rp {p.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3.5 text-slate-500">{p.date}</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-500 transition-all flex items-center gap-1"
                      >
                        <PrinterIcon className="w-3.5 h-3.5" />
                        <span>Kwitansi</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus transaksi ${p.receiptNumber}?`)) {
                            deletePayment(p.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INPUT PAYMENT MODAL */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Catat Pembayaran Sewa Baru
              </h3>
              <button
                onClick={() => setShowInputModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Pilih Penghuni Kost
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => handleSelectTenantChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.houseName} - {t.roomNumber}) • Rp {t.tariff.toLocaleString("id-ID")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Transfer">Transfer Bank</option>
                    <option value="QRIS">Scan QRIS</option>
                    <option value="Cash">Cash / Tunai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Periode Bulan
                  </label>
                  <input
                    type="text"
                    required
                    value={monthPeriod}
                    onChange={(e) => setMonthPeriod(e.target.value)}
                    placeholder="Agustus 2026"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Upload Bukti Transfer / Resi (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {proofUrl && (
                  <img src={proofUrl} alt="Proof" className="mt-2 h-20 rounded-xl object-cover border" />
                )}
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Catatan</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all text-center"
                >
                  Simpan & Cetak Kwitansi
                </button>
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL KWITANSI MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div id="kwitansi-modal-content" className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 border-4 border-emerald-500 print:border-0 print:shadow-none print:m-0 print:p-0">
            {/* Kwitansi Header */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  🏠
                </div>
                <div>
                  <h2 className="font-black text-lg text-emerald-800 uppercase tracking-tight">
                    GRIYA JATEN INDAH (GJI)
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Smart Kost Management System • Sleman, Yogyakarta
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-lg uppercase">
                  KWITANSI RESMI
                </span>
                <p className="text-xs font-mono font-bold text-slate-700 mt-1">{selectedReceipt.receiptNumber}</p>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs md:text-sm py-2">
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="font-bold text-slate-600">Telah Diterima Dari:</span>
                <span className="col-span-2 font-extrabold text-slate-900 text-base">{selectedReceipt.tenantName}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="font-bold text-slate-600">Properti & Kamar:</span>
                <span className="col-span-2 font-bold text-slate-800">
                  {selectedReceipt.houseName} — Kamar {selectedReceipt.roomNumber}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="font-bold text-slate-600">Uang Sejumlah:</span>
                <span className="col-span-2 font-bold text-emerald-700 italic bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  "{numberToTerbilang(selectedReceipt.amount)}"
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="font-bold text-slate-600">Untuk Pembayaran:</span>
                <span className="col-span-2 text-slate-800 font-medium">
                  Sewa Kamar Periode {selectedReceipt.monthPeriod} ({selectedReceipt.method})
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mt-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">JUMLAH NOMINAL</p>
                  <p className="text-2xl font-black text-emerald-700">
                    Rp {selectedReceipt.amount.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="text-center">
                  {/* QR Code Verification Block */}
                  <div className="w-16 h-16 bg-slate-900 text-white p-1 rounded-xl mx-auto flex items-center justify-center font-bold text-[8px]">
                    <QrCodeIcon className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 block">VERIFIED GJI</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-6 text-center text-xs border-t border-slate-200 mt-4">
                <div>
                  <p className="text-slate-500 font-medium">Yogyakarta, {selectedReceipt.date}</p>
                  <p className="font-bold text-slate-800 mt-1">Penyewa / Penghuni</p>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic">( Tanda Tangan )</span>
                  </div>
                  <p className="font-bold text-slate-900 underline">{selectedReceipt.tenantName}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-medium">Pemilik / Pengelola Properti</p>
                  <p className="font-bold text-slate-800 mt-1">Griya Jaten Indah</p>
                  <div className="h-12 flex flex-col items-center justify-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      [ TERBAYAR LUNAS ]
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 mt-0.5">Ibu Retno Handayani</span>
                  </div>
                  <p className="font-bold text-slate-900 underline">({selectedReceipt.recordedBy})</p>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
              <button
                onClick={() => {
                  const text = `*KWITANSI PEMBAYARAN RESMI KOST GRIYA JATEN INDAH (GJI)*\nNo. Kwitansi: ${selectedReceipt.receiptNumber}\n\nTelah Diterima Dari: *${selectedReceipt.tenantName}*\nNominal: *Rp ${selectedReceipt.amount.toLocaleString("id-ID")}*\nUntuk Pembayaran: *${selectedReceipt.notes || selectedReceipt.monthPeriod}*\nProperti: *${selectedReceipt.houseName} (${selectedReceipt.roomNumber})*\nMetode: *${selectedReceipt.method}*\nTanggal: *${selectedReceipt.date}*\n\nStatus: *LUNAS (VERIFIED GJI)*\nPemilik: Ibu Retno Handayani (0817-201-958)\n\nTerima Kasih!`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="px-4 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Kirim WA</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
