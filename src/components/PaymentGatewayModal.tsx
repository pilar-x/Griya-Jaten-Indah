import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PaymentMethod } from "../types";
import {
  CreditCardIcon,
  QrCodeIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
  SparklesIcon,
  PrinterIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTenantId?: string;
  defaultAmount?: number;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  preselectedTenantId,
  defaultAmount,
}) => {
  const { tenants, processPaymentGatewayTransaction } = useApp();

  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    preselectedTenantId || tenants[0]?.id || ""
  );
  const [amount, setAmount] = useState<number>(defaultAmount || tenants[0]?.tariff || 700000);
  const [monthPeriod, setMonthPeriod] = useState<string>("Agustus 2026");
  const [gatewayProvider, setGatewayProvider] = useState<"Midtrans" | "Xendit">("Midtrans");
  const [paymentChannel, setPaymentChannel] = useState<
    "QRIS" | "BCA VA" | "Mandiri VA" | "BRI VA" | "BNI VA"
  >("QRIS");

  const [copiedVa, setCopiedVa] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    receiptNumber: string;
    transactionId: string;
  } | null>(null);

  // Countdown timer for QRIS / VA (15 mins)
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  useEffect(() => {
    if (preselectedTenantId) {
      setSelectedTenantId(preselectedTenantId);
      const t = tenants.find((item) => item.id === preselectedTenantId);
      if (t) setAmount(t.tariff);
    }
  }, [preselectedTenantId, tenants]);

  useEffect(() => {
    let timer: any;
    if (isOpen && !successResult && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, successResult, timeLeft]);

  if (!isOpen) return null;

  const currentTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getVaNumber = () => {
    const phoneDigits = currentTenant ? currentTenant.phone.replace(/[^0-9]/g, "").slice(-8) : "12345678";
    if (paymentChannel === "BCA VA") return `88301${phoneDigits}`;
    if (paymentChannel === "Mandiri VA") return `89022${phoneDigits}`;
    if (paymentChannel === "BRI VA") return `12808${phoneDigits}`;
    if (paymentChannel === "BNI VA") return `98801${phoneDigits}`;
    return `88301${phoneDigits}`;
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText(getVaNumber());
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2500);
  };

  const handleSimulateWebhookPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const methodType: PaymentMethod = paymentChannel === "QRIS" ? "QRIS" : "Transfer";
      const res = processPaymentGatewayTransaction(
        currentTenant.id,
        amount,
        methodType,
        monthPeriod,
        gatewayProvider,
        paymentChannel
      );
      setIsVerifying(false);
      setSuccessResult({
        receiptNumber: res.receiptNumber,
        transactionId: res.transactionId,
      });
    }, 1800);
  };

  const handleResetModal = () => {
    setSuccessResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header Modal */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
              <CreditCardIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Payment Gateway Otomatis</h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-400 text-slate-950 rounded-full">
                  Real-time Verifikasi
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Powered by {gatewayProvider} Engine • Virtual Account & QRIS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {successResult ? (
            /* SUCCESS STATE */
            <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white inline-block">
                  ⚡ STATUS: LUNAS - VERIFIKASI OTOMATIS
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                  Pembayaran Sewa Berhasil!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sistem {gatewayProvider} telah mengonfirmasi pembayaran secara real-time.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-400 font-bold">No. Kwitansi Resmi:</span>
                  <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {successResult.receiptNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Ref Transaksi {gatewayProvider}:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {successResult.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Penghuni / Kamar:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {currentTenant?.name} ({currentTenant?.roomNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Nominal Pembayaran:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Rp {amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Metode & Channel:</span>
                  <span className="font-bold text-emerald-600">
                    {paymentChannel} ({gatewayProvider})
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleResetModal}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Selesai & Tutup</span>
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT SETUP FORM & QRIS/VA DISPLAY */
            <div className="space-y-5">
              {/* Tenant Selection & Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Penghuni Kost
                  </label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => {
                      setSelectedTenantId(e.target.value);
                      const t = tenants.find((item) => item.id === e.target.value);
                      if (t) setAmount(t.tariff);
                    }}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} - Kamar {t.roomNumber} ({t.houseName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Periode Sewa Bulan
                  </label>
                  <input
                    type="text"
                    value={monthPeriod}
                    onChange={(e) => setMonthPeriod(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Gateway Provider Selection (Midtrans / Xendit) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Engine Gateway Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setGatewayProvider("Midtrans")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      gatewayProvider === "Midtrans"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span>⚡ Midtrans Payment API</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayProvider("Xendit")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      gatewayProvider === "Xendit"
                        ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span>🔷 Xendit Gateway</span>
                  </button>
                </div>
              </div>

              {/* Channel Selectors: QRIS, BCA, Mandiri, BRI, BNI */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Kanal Pembayaran Otomatis
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px]">
                  {[
                    { id: "QRIS", label: "QRIS Instant", icon: QrCodeIcon },
                    { id: "BCA VA", label: "BCA VA", icon: BuildingLibraryIcon },
                    { id: "Mandiri VA", label: "Mandiri VA", icon: BuildingLibraryIcon },
                    { id: "BRI VA", label: "BRI VA", icon: BuildingLibraryIcon },
                    { id: "BNI VA", label: "BNI VA", icon: BuildingLibraryIcon },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isSel = paymentChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPaymentChannel(ch.id as any)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                          isSel
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.03]"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DISPLAY CARD: QRIS OR VIRTUAL ACCOUNT */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-amber-500" />
                    <span>Batas Waktu Bayar: <strong className="font-mono text-amber-600 dark:text-amber-400">{formatTime(timeLeft)}</strong></span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    Total: Rp {amount.toLocaleString("id-ID")}
                  </span>
                </div>

                {paymentChannel === "QRIS" ? (
                  /* QRIS DISPLAY */
                  <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="inline-block p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-md">
                      {/* Generates realistic QRIS SVG Code */}
                      <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#ffffff" />
                        {/* Corners */}
                        <rect x="5" y="5" width="25" height="25" fill="#000000" />
                        <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                        <rect x="13" y="13" width="9" height="9" fill="#000000" />

                        <rect x="70" y="5" width="25" height="25" fill="#000000" />
                        <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                        <rect x="78" y="13" width="9" height="9" fill="#000000" />

                        <rect x="5" y="70" width="25" height="25" fill="#000000" />
                        <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                        <rect x="13" y="78" width="9" height="9" fill="#000000" />

                        {/* Random dense QR code matrix pattern */}
                        <rect x="35" y="8" width="8" height="8" fill="#000" />
                        <rect x="48" y="12" width="12" height="6" fill="#000" />
                        <rect x="12" y="35" width="15" height="6" fill="#000" />
                        <rect x="32" y="32" width="12" height="12" fill="#000" />
                        <rect x="50" y="30" width="18" height="8" fill="#000" />
                        <rect x="72" y="36" width="16" height="16" fill="#000" />
                        <rect x="38" y="50" width="10" height="14" fill="#000" />
                        <rect x="55" y="52" width="14" height="10" fill="#000" />
                        <rect x="75" y="60" width="14" height="14" fill="#000" />
                        <rect x="35" y="72" width="12" height="12" fill="#000" />
                        <rect x="52" y="70" width="18" height="18" fill="#000" />
                        <rect x="75" y="80" width="14" height="8" fill="#000" />

                        {/* Center Logo */}
                        <rect x="40" y="40" width="20" height="20" rx="4" fill="#047857" />
                        <text x="50" y="54" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">GJI</text>
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white">
                        QRIS National Standard (NMID: ID10293847562)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scan menggunakan BCA Mobile, Livin Mandiri, GoPay, OVO, Dana, ShopeePay, DLI.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* VIRTUAL ACCOUNT DISPLAY */
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      Nomor Virtual Account ({paymentChannel}):
                    </p>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-mono text-lg font-extrabold text-slate-900 dark:text-white tracking-wider">
                        {getVaNumber()}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
                      >
                        <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
                        <span>{copiedVa ? "Tersalin!" : "Salin VA"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Lakukan transfer dari M-Banking / ATM ke nomor Virtual Account di atas. Sistem akan mendeteksi pembayaran secara otomatis tanpa konfirmasi manual.
                    </p>
                  </div>
                )}
              </div>

              {/* SIMULATION BUTTON FOR REAL-TIME AUTO CALLBACK */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSimulateWebhookPayment}
                  disabled={isVerifying}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>📡 Verifikasi Webhook {gatewayProvider} Processing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>⚡ Simulasi Verifikasi Otomatis Webhook (Midtrans / Xendit Callback)</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-1.5">
                  Simulasi push callback real-time seolah-olah bank / QRIS telah menerima pembayaran.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
