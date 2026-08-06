import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  UserGroupIcon,
  SparklesIcon,
  MapPinIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  KeyIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  PrinterIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export const CalonPenghuniView: React.FC = () => {
  const { rooms, houses, addTenant, setActiveView } = useApp();

  const [genderFilter, setGenderFilter] = useState<"All" | "Putri" | "Putra" | "Homestay">("All");
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [showEmptyOnly, setShowEmptyOnly] = useState<boolean>(true);

  // Booking / Survey Form State
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [surveyName, setSurveyName] = useState<string>("");
  const [surveyPhone, setSurveyPhone] = useState<string>("");
  const [surveyDate, setSurveyDate] = useState<string>("");
  const [surveyNotes, setSurveyNotes] = useState<string>("");

  // Rent Estimator State
  const [estimatorRoomId, setEstimatorRoomId] = useState<string>(rooms[0]?.id || "");
  const [leaseMonths, setLeaseMonths] = useState<number>(1);
  const [includeKeyDeposit, setIncludeKeyDeposit] = useState<boolean>(true);

  // E-CONTRACT & E-SIGNATURE STATE
  const [contractName, setContractName] = useState("");
  const [contractPhone, setContractPhone] = useState("");
  const [contractNik, setContractNik] = useState("");
  const [contractOrigin, setContractOrigin] = useState("");
  const [contractInstitution, setContractInstitution] = useState("");
  const [contractRoomId, setContractRoomId] = useState(rooms[0]?.id || "");
  const [contractEntryDate, setContractEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [contractDeposit, setContractDeposit] = useState("200000");
  const [ktpPhotoPreview, setKtpPhotoPreview] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [contractSuccessMsg, setContractSuccessMsg] = useState("");
  const [signedContractData, setSignedContractData] = useState<any | null>(null);

  // Canvas E-Signature Ref & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractName || !contractPhone || !agreeTerms) {
      alert("Harap lengkapi Nama, Nomor WA, dan centang persetujuan aturan sewa.");
      return;
    }

    const selectedRoom = rooms.find((r) => r.id === contractRoomId) || rooms[0];
    let signatureUrl = "";
    if (canvasRef.current && hasSigned) {
      signatureUrl = canvasRef.current.toDataURL("image/png");
    }

    // Call addTenant to register as tenant in system
    addTenant({
      name: contractName.trim(),
      phone: contractPhone.trim(),
      nik: contractNik.trim() || "33130" + Math.floor(1000000000 + Math.random() * 9000000000),
      originCity: contractOrigin.trim() || "Yogyakarta / Karanganyar",
      occupation: "Mahasiswa / Karyawan",
      institution: contractInstitution.trim() || "UGM / UNY",
      gender: selectedRoom?.type?.includes("Putri") ? "Putri" : "Putra",
      roomId: selectedRoom?.id,
      houseName: selectedRoom?.houseName || "Griya Jaten Indah",
      roomNumber: selectedRoom?.roomNumber || "101",
      entryDate: contractEntryDate,
      dueDate: contractEntryDate,
      tariff: selectedRoom?.tariff || 750000,
      paymentStatus: "Belum Bayar",
      ktpPhoto: ktpPhotoPreview || undefined,
    });

    const contractObj = {
      id: "CTR-GJI-" + Date.now(),
      date: contractEntryDate,
      tenantName: contractName,
      phone: contractPhone,
      nik: contractNik || "33130123910291",
      origin: contractOrigin || "Yogyakarta",
      institution: contractInstitution || "UGM",
      houseName: selectedRoom?.houseName,
      roomNumber: selectedRoom?.roomNumber,
      tariff: selectedRoom?.tariff,
      deposit: Number(contractDeposit) || 200000,
      signatureUrl,
      ktpPhoto: ktpPhotoPreview,
    };

    setSignedContractData(contractObj);
    setContractSuccessMsg("🎉 Pendaftaran & Tanda Tangan E-Contract Berhasil! Surat Perjanjian Sewa Digital Resmi Telah Terbit.");

    // Reset Form
    setContractName("");
    setContractPhone("");
    setContractNik("");
    setContractOrigin("");
    setContractInstitution("");
    clearCanvas();
  };

  const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/iw5DrZ84yAbM1vZn9";
  const OWNER_NAME = "Ibu Retno Handayani";
  const OWNER_PHONE_DISPLAY = "0817-201-958";
  const MANAGER_WA = "62817201958"; // Ibu Retno Handayani WA

  // Filtered rooms logic
  const filteredRooms = rooms.filter((r) => {
    const house = houses.find((h) => h.id === r.houseId);
    if (!house) return false;

    if (showEmptyOnly && r.status !== "Kosong") return false;

    if (genderFilter === "Putri" && house.gender !== "Putri") return false;
    if (genderFilter === "Putra" && house.gender !== "Putra") return false;
    if (genderFilter === "Homestay" && house.name !== "Homestay") return false;

    if (r.tariff > maxPrice) return false;

    return true;
  });

  const selectedEstimatorRoom = rooms.find((r) => r.id === estimatorRoomId) || rooms[0];

  const calculateEstimatorTotal = () => {
    if (!selectedEstimatorRoom) return { base: 0, deposit: 0, discount: 0, total: 0 };
    const base = selectedEstimatorRoom.tariff * leaseMonths;
    const deposit = includeKeyDeposit ? 100000 : 0;
    // Discount 1 Bulan if paying 1 year upfront (Bayar 12 bulan, hanya bayar 11 bulan)
    const discount = leaseMonths >= 12 ? selectedEstimatorRoom.tariff : 0;
    const total = base + deposit - discount;
    return { base, deposit, discount, total };
  };

  const estimatorResult = calculateEstimatorTotal();

  const handleSendSurveyWa = (roomNumber?: string, houseName?: string) => {
    const targetRoom = roomNumber || "Kamar Kost GJI";
    const targetHouse = houseName || "Griya Jaten Indah";
    const nameStr = surveyName ? `Halo Ibu Retno Handayani (Pemilik GJI), saya *${surveyName}*` : "Halo Ibu Retno Handayani (Pemilik GJI)";
    const dateStr = surveyDate ? ` tanggal *${surveyDate}*` : "";
    const notesStr = surveyNotes ? `\nCatatan: ${surveyNotes}` : "";

    const message = `${nameStr}, bermaksud untuk menanyakan / menjadwalkan survei kamar sewa:\n\n🏡 *Gedung:* ${targetHouse}\n🚪 *Kamar:* ${targetRoom}${dateStr}\n\n📍 *Lokasi Maps:* ${GOOGLE_MAPS_LINK}${notesStr}\n\nApakah kamar tersebut masih tersedia dan bisa dikunjungi? Terima kasih!`;

    const waUrl = `https://wa.me/${MANAGER_WA}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* PUBLIC HERO BANNER */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <SparklesIcon className="w-4 h-4 animate-spin" />
            <span>Portal Calon Penghuni Kost GJI Sleman (46 Kamar Jadi + 10 Kamar Dalam Pembangunan = Total 56 Kamar)</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Kamar Kost Nyaman & Strategis Dekat UGM & UNY — Griya Jaten Indah
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Griya Jaten Indah memiliki <strong>46 kamar yang sudah siap huni</strong> tersebar di 7 gedung (Putri, Putra & Homestay) dan <strong>10 kamar tambahan baru yang sedang dalam tahap pembangunan</strong> (Total kapasitas 56 kamar). Lingkungan asri, jalan mobil lapang, dan aman 24 jam.
          </p>

          {/* DISKON PROMO BANNER */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-400/40 text-xs text-amber-200 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shrink-0">PROMO</span>
              <span>Bayar Sewa 1 Tahun Di Depan = <strong>DISKON 1 BULAN (Cukup Bayar 11 Bulan!)</strong></span>
            </div>
            <span className="text-[11px] text-emerald-300 font-normal">Tersedia juga pembayaran bulanan standar</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <MapPinIcon className="w-4 h-4" />
              <span>Buka Google Maps Resmi</span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleSendSurveyWa()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-300" />
              <span>Hubungi Pemilik: Ibu Retno ({OWNER_PHONE_DISPLAY})</span>
            </button>
          </div>
        </div>
      </div>

      {/* FORM E-CONTRACT & E-SIGNATURE DIGITAL PENDAFTARAN */}
      <div className="p-6 rounded-[26px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span>Form Pendaftaran & Tanda Tangan Digital (E-Contract Sewa)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Resmi & Legal
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Isi data calon penghuni, upload KTP, ttd digital di layar HP/PC, dan terbitkan surat perjanjian sewa resmi.
              </p>
            </div>
          </div>
        </div>

        {contractSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{contractSuccessMsg}</span>
            </div>
            <button
              onClick={() => setActiveView("documents")}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-[11px] shrink-0"
            >
              Lihat di Arsip Dokumen →
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmitContract} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Column 1: Identitas Calon Penghuni */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <UserGroupIcon className="w-4 h-4 text-emerald-600" />
              <span>1. Identitas Calon Penghuni</span>
            </h4>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nama Lengkap (Sesuai KTP): *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Anisa Rahmawati"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nomor WhatsApp Aktif: *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 081234567890"
                value={contractPhone}
                onChange={(e) => setContractPhone(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  NIK KTP (16 Digit):
                </label>
                <input
                  type="text"
                  placeholder="33130xxxxxxxxxxx"
                  value={contractNik}
                  onChange={(e) => setContractNik(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Kota Asal:
                </label>
                <input
                  type="text"
                  placeholder="Surakarta / Semarang"
                  value={contractOrigin}
                  onChange={(e) => setContractOrigin(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Instansi / Kampus / Pekerjaan:
              </label>
              <input
                type="text"
                placeholder="UGM / UNY / PT Telkom"
                value={contractInstitution}
                onChange={(e) => setContractInstitution(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Upload Foto KTP (Opsional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleKtpUpload}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 text-xs"
              />
              {ktpPhotoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={ktpPhotoPreview} alt="Preview KTP" className="h-12 w-20 object-cover rounded-lg border border-slate-300" />
                  <span className="text-[10px] text-emerald-600 font-bold">✓ KTP Terunggah</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Pilihan Kamar, E-Signature, & Terms */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <PencilSquareIcon className="w-4 h-4 text-emerald-600" />
              <span>2. Sewa Kamar & Tanda Tangan Digital</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Pilih Kamar Kost:
                </label>
                <select
                  value={contractRoomId}
                  onChange={(e) => setContractRoomId(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.houseName} — Rm {r.roomNumber} (Rp {r.tariff.toLocaleString("id-ID")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Tanggal Masuk Sewa:
                </label>
                <input
                  type="date"
                  value={contractEntryDate}
                  onChange={(e) => setContractEntryDate(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Nominal Deposit Jaminan Kunci & Kamar:
              </label>
              <input
                type="number"
                value={contractDeposit}
                onChange={(e) => setContractDeposit(e.target.value)}
                placeholder="200000"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold text-emerald-600"
              />
            </div>

            {/* E-SIGNATURE CANVAS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Tanda Tangan Digital (E-Signature):
                </label>
                {hasSigned && (
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-rose-500 hover:underline font-bold flex items-center gap-1"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" /> Ulangi TTD
                  </button>
                )}
              </div>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden relative touch-none">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full cursor-crosshair"
                />
                {!hasSigned && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-semibold">
                    Goreskan tanda tangan Anda di sini (Mouse / Sentuh Layar)
                  </div>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="agreeTerms" className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug cursor-pointer">
                Saya menyetujui seluruh <strong>Tata Tertib & Perjanjian Sewa Griya Jaten Indah</strong>, bersedia membayar uang sewa tepat waktu dan menjaga fasilitas kamar.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              <DocumentCheckIcon className="w-4 h-4" />
              <span>Submit & Terbitkan E-Contract Perjanjian Sewa</span>
            </button>
          </div>
        </form>

        {/* SIGNED CONTRACT DISPLAY CARD */}
        {signedContractData && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 shadow-xl space-y-4 animate-in zoom-in-95 mt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-black text-sm text-white">SURAT PERJANJIAN SEWA DIGITAL (E-CONTRACT)</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">No. Dokumen: {signedContractData.id}</p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700"
              >
                <PrinterIcon className="w-4 h-4" /> Cetak / PDF
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400">Penyewa (Penghuni):</span>
                <p className="font-bold text-white">{signedContractData.tenantName}</p>
                <p className="text-[10px] text-slate-300">{signedContractData.phone} • NIK: {signedContractData.nik}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Properti & Kamar:</span>
                <p className="font-bold text-emerald-400">{signedContractData.houseName} — Kamar {signedContractData.roomNumber}</p>
                <p className="text-[10px] text-slate-300">Tarif: Rp {Number(signedContractData.tariff || 0).toLocaleString("id-ID")}/bln</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Deposit Jaminan:</span>
                <p className="font-bold text-amber-400">Rp {Number(signedContractData.deposit || 0).toLocaleString("id-ID")}</p>
                <p className="text-[10px] text-slate-300">Tgl Masuk: {signedContractData.date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                <p>Pemilik Kost: <strong>Ibu Retno Handayani</strong></p>
                <p className="text-[10px] text-emerald-400">Status: Verifikasi Digital Terdaftar di System GJI</p>
              </div>
              {signedContractData.signatureUrl && (
                <div className="text-center">
                  <p className="text-[9px] text-slate-400 mb-1">E-Signature Penyewa:</p>
                  <img
                    src={signedContractData.signatureUrl}
                    alt="Signature"
                    className="h-12 bg-white rounded p-1 border border-emerald-400 inline-block"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* HIGHLIGHT FASILITAS & GRATIS (FREE) CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fasilitas Utama */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <BuildingOffice2Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
              Fasilitas Kamar Lengkap
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Kamar Mandi Dalam & Luar</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Meja & Kursi Belajar</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Tempat Tidur Springbed</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Almari Pakaian Kayu</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 col-span-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Cantelan Baju, Cermin & Kipas/AC</span>
            </div>
          </div>
        </div>

        {/* Free / Gratis Extras */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                FASILITAS FREE / GRATIS
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
              NO EXTRA FEE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Listrik Standar Gratis</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>High Speed Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Bebas Iuran Sampah</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Keamanan & Kebersihan</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Area Parkir & Mushola</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Jemuran & Ruang Tamu</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS FOR PROSPECTIVE TENANTS */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Filter Pencarian Kamar Tersedia
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Ditemukan: <strong className="text-emerald-600">{filteredRooms.length} Kamar</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gender Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Jenis Kost / Tipe
            </label>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
              {(["All", "Putri", "Putra", "Homestay"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    genderFilter === g
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                  }`}
                >
                  {g === "All" ? "Semua" : g}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Maksimal Tarif / Bulan
              </label>
              <span className="text-xs font-extrabold text-emerald-600">
                Rp {maxPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="2000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Show Empty Only Toggle */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tampilkan Kamar Kosong Saja</p>
              <p className="text-[10px] text-slate-500">Sembunyikan kamar yang terisi</p>
            </div>
            <input
              type="checkbox"
              checked={showEmptyOnly}
              onChange={(e) => setShowEmptyOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* CATALOG OF ROOMS */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <KeyIcon className="w-5 h-5 text-emerald-600" />
          <span>Katalog Kamar Griya Jaten Indah</span>
        </h3>

        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center rounded-[22px] bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Tidak ada kamar yang sesuai filter.</p>
            <p className="text-xs text-slate-500">Coba tingkatkan batas harga atau ganti opsi filter jenis kost.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((r) => {
              const house = houses.find((h) => h.id === r.houseId);
              const isHomestay = house?.name === "Homestay";
              const isGjiBaru = house?.name === "GJI Baru";

              return (
                <div
                  key={r.id}
                  className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {house?.gender} • {r.type}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-800 dark:text-white mt-1">
                          {r.houseName} - Kamar {r.roomNumber}
                        </h4>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          r.status === "Kosong"
                            ? "bg-emerald-500 text-white animate-pulse"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {r.status === "Kosong" ? "Tersedia" : r.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Tarif Bulanan:</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        Rp {r.tariff.toLocaleString("id-ID")}
                        <span className="text-[10px] font-normal text-slate-400">/bln</span>
                      </span>
                    </div>

                    {/* Key Facilities List */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Kasur Springbed & Lemari Kayu Pakaian</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Meja Belajar + Kursi Nyaman</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{isGjiBaru || isHomestay ? "Fasilitas AC & Kamar Mandi Dalam" : "Kipas Angin Dinding + Kamar Mandi Bersama/Dalam"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Free High Speed Wi-Fi 100Mbps</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      onClick={() => handleSendSurveyWa(r.roomNumber, r.houseName)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      <span>Jadwalkan Survei / Booking WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RENT ESTIMATOR / CALCULATOR & CAMPUS DISTANCES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Estimator */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <CalculatorIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">
              Simulasi & Kalkulator Biaya Sewa
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Pilih Kamar yang Diminati:
              </label>
              <select
                value={estimatorRoomId}
                onChange={(e) => setEstimatorRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                {rooms.map((rm) => (
                  <option key={rm.id} value={rm.id}>
                    {rm.houseName} - {rm.roomNumber} (Rp {rm.tariff.toLocaleString("id-ID")}/bln)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Durasi Sewa:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setLeaseMonths(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      leaseMonths === m
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {m} Bulan
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Deposit Kunci & Kebersihan</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Dikembalikan saat selesai masa sewa</p>
              </div>
              <input
                type="checkbox"
                checked={includeKeyDeposit}
                onChange={(e) => setIncludeKeyDeposit(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Total Display */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Subtotal Sewa ({leaseMonths} Bulan):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Rp {estimatorResult.base.toLocaleString("id-ID")}</span>
              </div>
              {includeKeyDeposit && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Deposit Kunci (Refundable):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">+ Rp {estimatorResult.deposit.toLocaleString("id-ID")}</span>
                </div>
              )}
              {estimatorResult.discount > 0 && (
                <div className="flex justify-between items-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span>Diskon Bayar 1 Tahun (Gratis 1 Bulan! Cukup bayar 11 bulan):</span>
                  <span>- Rp {estimatorResult.discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black pt-2.5 border-t border-emerald-200 dark:border-slate-800">
                <span className="text-slate-900 dark:text-white font-extrabold">Estimasi Total Awal:</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-lg font-black">
                  Rp {estimatorResult.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ & Peraturan Kost */}
        <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                Peraturan & Tata Tertib Resmi GJI
              </h3>
            </div>
            <button
              onClick={() => setActiveView("tata-tertib")}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>19 Peraturan Lengkap</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-bold text-slate-800 dark:text-white">🚫 Larangan Tamu Lawan Jenis di Kamar (Pasal 4)</p>
              <p className="mt-0.5 text-slate-500">Tamu lawan jenis hanya diperkenankan di ruang tamu/teras hingga pukul 22.00 WIB.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-bold text-slate-800 dark:text-white">⚡ Listrik Standar & Tambahan Elektronik (Pasal 16)</p>
              <p className="mt-0.5 text-slate-500">Gratis listrik standar. Apabila membawa TV, Dispenser, Kulkas, Rice Cooker atau AC dikenakan biaya tambahan per bulan.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-bold text-slate-800 dark:text-white">💳 Pembayaran & Diskon Sewa 1 Tahun (Pasal 2)</p>
              <p className="mt-0.5 text-slate-500">Pembayaran bulanan via transfer ke Ibu Retno Handayani. Bayar 12 bulan di depan DISKON 1 bulan (cukup bayar 11 bulan).</p>
            </div>

            <button
              onClick={() => setActiveView("tata-tertib")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
            >
              <span>📄 Buka Dokumen Lengkap 19 Pasal Tata Tertib GJI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
