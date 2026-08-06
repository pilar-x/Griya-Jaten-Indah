import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BoltIcon, PlusIcon, CheckCircleIcon, XMarkIcon, SparklesIcon, CameraIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export const PlnPamMeterView: React.FC = () => {
  const { meters, addMeterReading, rooms } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [plnInitial, setPlnInitial] = useState("");
  const [plnFinal, setPlnFinal] = useState("");
  const [pamInitial, setPamInitial] = useState("");
  const [pamFinal, setPamFinal] = useState("");
  const [notes, setNotes] = useState("");

  // AI Auto-Scan State
  const [scanning, setScanning] = useState(false);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScanMeterPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setScanPreview(base64);
      setScanning(true);
      setScanResult(null);

      try {
        const res = await fetch("/api/gemini/scan-meter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            meterType: "Meteran Listrik PLN / PAM",
          }),
        });

        const data = await res.json();
        if (data.result) {
          setScanResult(data.result);
          if (data.result.detectedType?.includes("Air")) {
            setPamFinal(String(data.result.digits || ""));
            setNotes(`[Auto-Scan AI PAM]: Terdeteksi ${data.result.digits} m³ (Estimasi Biaya: Rp ${Number(data.result.estimatedCostExtra || 0).toLocaleString("id-ID")})`);
          } else {
            setPlnFinal(String(data.result.digits || ""));
            setNotes(`[Auto-Scan AI PLN]: Terdeteksi ${data.result.digits} kWh (Estimasi Biaya: Rp ${Number(data.result.estimatedCostExtra || 0).toLocaleString("id-ID")})`);
          }
        }
      } catch (err) {
        console.error("Failed AI scan", err);
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMeter = (e: React.FormEvent) => {
    e.preventDefault();
    const r = rooms.find((rm) => rm.id === selectedRoomId);
    if (!r) return;

    addMeterReading({
      roomId: r.id,
      roomNumber: `${r.houseName} (${r.roomNumber})`,
      date,
      plnInitial: Number(plnInitial) || 0,
      plnFinal: Number(plnFinal) || 0,
      pamInitial: Number(pamInitial) || 0,
      pamFinal: Number(pamFinal) || 0,
      notes: notes || "Pencatatan bulanan",
    });

    setShowAddModal(false);
    setPlnInitial("");
    setPlnFinal("");
    setPamInitial("");
    setPamFinal("");
    setNotes("");
    setScanPreview(null);
    setScanResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BoltIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>Pencatatan Meter Listrik PLN & Air PAM ({meters.length} Catatan)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ✨ Gemini OCR AI
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Petugas atau penghuni cukup memfoto meteran. AI Gemini otomatis membaca angka kWh/m³ dan mengalkulasi tagihan secara presisi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <CameraIcon className="w-4 h-4 text-emerald-200" />
          <span>+ Foto & Auto-Scan Meter</span>
        </button>
      </div>

      {/* Meter Table */}
      <div className="p-1 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
              <th className="p-3.5">Kamar / Properti</th>
              <th className="p-3.5">Awal PLN (kWh)</th>
              <th className="p-3.5">Akhir PLN (kWh)</th>
              <th className="p-3.5">Pemakaian PLN</th>
              <th className="p-3.5">Awal PAM (m³)</th>
              <th className="p-3.5">Akhir PAM (m³)</th>
              <th className="p-3.5">Pemakaian PAM</th>
              <th className="p-3.5">Catatan / OCR AI</th>
              <th className="p-3.5">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {meters.map((m) => {
              const plnUsage = m.plnFinal - m.plnInitial;
              const pamUsage = m.pamFinal - m.pamInitial;
              return (
                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-800 dark:text-white">{m.roomNumber}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{m.plnInitial}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{m.plnFinal}</td>
                  <td className="p-3.5 font-bold text-emerald-600">{plnUsage >= 0 ? `${plnUsage} kWh` : "—"}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{m.pamInitial}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{m.pamFinal}</td>
                  <td className="p-3.5 font-bold text-blue-600">{pamUsage >= 0 ? `${pamUsage} m³` : "—"}</td>
                  <td className="p-3.5 text-slate-500 max-w-xs truncate">{m.notes || "—"}</td>
                  <td className="p-3.5 text-slate-500 font-mono">{m.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD METER MODAL WITH AI OCR SCAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-emerald-600" />
                <span>Input Meteran Listrik & Air (Auto-Scan AI)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* AI Photo Scanner Upload Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-emerald-400" />
                <p className="font-extrabold text-xs">Foto Meteran (AI Auto-Scan Gemini OCR)</p>
              </div>
              <p className="text-[11px] text-slate-300">
                Unggah atau foto fisik meteran listrik PLN / PAM. AI akan membaca angka digital/analog secara otomatis.
              </p>

              <label className="block p-3 rounded-xl border-2 border-dashed border-emerald-400/50 bg-white/10 hover:bg-white/20 text-center cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScanMeterPhoto}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
                  {scanning ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Sedang Membaca Angka Meteran...</span>
                    </>
                  ) : (
                    <>
                      <CameraIcon className="w-4 h-4" />
                      <span>Pilih Foto / Ambil Gambar Meteran</span>
                    </>
                  )}
                </div>
              </label>

              {scanPreview && (
                <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-xl border border-white/10">
                  <img src={scanPreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg shrink-0" />
                  {scanResult && (
                    <div className="text-[11px] space-y-0.5">
                      <p className="font-extrabold text-emerald-400">
                        ✓ AI Terdeteksi: {scanResult.kwhOrM3Text || `${scanResult.digits} Units`}
                      </p>
                      <p className="text-slate-300">Tipe: {scanResult.detectedType} (Akurasi: {scanResult.confidence})</p>
                      <p className="text-amber-300 font-bold">
                        Tagihan Tambahan: Rp {Number(scanResult.estimatedCostExtra || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleAddMeter} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Kamar / Gedung:
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.houseName} — Kamar {r.roomNumber} ({r.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Pencatatan:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-900/40">
                <div className="col-span-2 font-bold text-amber-800 dark:text-amber-300">⚡ Meteran Listrik PLN (kWh)</div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Meter Awal</label>
                  <input
                    type="number"
                    placeholder="Contoh: 1200"
                    value={plnInitial}
                    onChange={(e) => setPlnInitial(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Meter Akhir</label>
                  <input
                    type="number"
                    placeholder="Contoh: 1245"
                    value={plnFinal}
                    onChange={(e) => setPlnFinal(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-900/40">
                <div className="col-span-2 font-bold text-blue-800 dark:text-blue-300">💧 Meteran Air PAM (m³)</div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Meter Awal</label>
                  <input
                    type="number"
                    placeholder="Contoh: 340"
                    value={pamInitial}
                    onChange={(e) => setPamInitial(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Meter Akhir</label>
                  <input
                    type="number"
                    placeholder="Contoh: 348"
                    value={pamFinal}
                    onChange={(e) => setPamFinal(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Tambahan & Hasil OCR AI:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan hasil scan / pemakaian berlebih"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
