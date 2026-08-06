import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheckIcon,
  KeyIcon,
  LockClosedIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

interface OwnerSecurityPinModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
}

export const OwnerSecurityPinModal: React.FC<OwnerSecurityPinModalProps> = ({ isOpen, onSuccess }) => {
  const { verifyAndUnlockOwner, setActiveView, ownerPin } = useApp();
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg("Silakan masukkan 4-digit Kode PIN Pemilik.");
      return;
    }

    const success = verifyAndUnlockOwner(pinInput);
    if (success) {
      setErrorMsg("");
      setPinInput("");
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg("❌ Kode PIN Salah! Gunakan PIN default: 1234");
    }
  };

  const handleGoToPublicPortal = () => {
    setActiveView("calon-penghuni");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        {/* Header Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                Keamanan Pemilik Kost
              </span>
              <h3 className="font-extrabold text-lg leading-snug mt-1">
                Akses Terkunci Kode PIN
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Halaman manajerial pemilik Kost Griya Jaten Indah dilindungi kode pengaman untuk menjaga kerahasiaan data omset & penghuni.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <KeyIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Masukkan Kode PIN Pemilik Kost</span>
            </label>

            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="4 Digit PIN (Standard: 1234)"
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-center text-lg font-mono font-extrabold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                {showPin ? "Sembunyikan" : "Lihat PIN"}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-2 text-center animate-bounce">
                {errorMsg}
              </p>
            )}
          </div>

          {/* PIN Hint Info */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 shrink-0" />
              <span>PIN Bawaan Pabrik: <strong>1234</strong></span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              Pemilik kost dapat mengubah kode PIN kapan saja melalui menu <strong>Pengaturan & Backup</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <LockClosedIcon className="w-4 h-4" />
              <span>Verifikasi & Buka Akses Pemilik</span>
            </button>

            <button
              type="button"
              onClick={handleGoToPublicPortal}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-4 h-4 text-emerald-500" />
              <span>Kembali ke Portal Calon Penyewa (Publik)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
