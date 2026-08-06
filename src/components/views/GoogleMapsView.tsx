import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  TruckIcon,
  SparklesIcon,
  CheckIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";

export const GoogleMapsView: React.FC = () => {
  const { houses, rooms, tenants } = useApp();
  const [selectedHouseId, setSelectedHouseId] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  const OFFICIAL_MAPS_LINK = "https://maps.app.goo.gl/iw5DrZ84yAbM1vZn9";
  const EMBED_MAP_URL = "https://maps.google.com/maps?q=Griya+Jaten+Indah,+Karangwuni,+Caturtunggal,+Depok,+Sleman,+Yogyakarta&t=&z=17&ie=UTF8&iwloc=&output=embed";

  const locations = [
    {
      id: "h1",
      name: "Griya Jaten Indah - Rumah 1 (Putri)",
      type: "Kost Putri",
      address: "Jl. Jaten No. 1, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 7,
      occupied: rooms.filter((r) => r.houseId === "h1" && r.status !== "Kosong").length,
      note: "Depan Gazebo Utama & Parkiran Motor Luas • Dekat UGM MIPA & Teknik",
      coordinates: "-7.768124, 110.385412",
    },
    {
      id: "h2",
      name: "Griya Jaten Indah - Rumah 2 (Putra)",
      type: "Kost Putra",
      address: "Jl. Jaten No. 3, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 7,
      occupied: rooms.filter((r) => r.houseId === "h2" && r.status !== "Kosong").length,
      note: "Akses Jalan Mobil Samping Dapur Bersama • Tenang & Kondusif",
      coordinates: "-7.768350, 110.385620",
    },
    {
      id: "h3",
      name: "Griya Jaten Indah - Rumah 3 (Putra)",
      type: "Kost Putra",
      address: "Jl. Jaten No. 5, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 7,
      occupied: rooms.filter((r) => r.houseId === "h3" && r.status !== "Kosong").length,
      note: "Area Barat Kost • Dekat Jakal KM 5 & Minimarket 24 Jam",
      coordinates: "-7.768510, 110.385800",
    },
    {
      id: "h4",
      name: "Griya Jaten Indah - Rumah 4 (Putri)",
      type: "Kost Putri",
      address: "Jl. Jaten No. 7, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 7,
      occupied: rooms.filter((r) => r.houseId === "h4" && r.status !== "Kosong").length,
      note: "Ruang Santai Luas & Pos Keamanan • Bebas Banjir",
      coordinates: "-7.768700, 110.386010",
    },
    {
      id: "h5",
      name: "Griya Jaten Indah - Rumah 5 (Putri)",
      type: "Kost Putri",
      address: "Jl. Jaten No. 9, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 7,
      occupied: rooms.filter((r) => r.houseId === "h5" && r.status !== "Kosong").length,
      note: "Area Taman Asri & Fasilitas Cuci Bersama",
      coordinates: "-7.768900, 110.386230",
    },
    {
      id: "h6",
      name: "Griya Jaten Indah - GJI Baru (Putri)",
      type: "Kost Putri Eksklusif",
      address: "Jl. Jaten Utama No. 12, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 9,
      occupied: rooms.filter((r) => r.houseId === "h6" && r.status !== "Kosong").length,
      note: "Gedung Baru 2 Lantai • Full AC & Kamar Mandi Dalam",
      coordinates: "-7.767900, 110.385200",
    },
    {
      id: "h7",
      name: "Griya Jaten Indah - Homestay",
      type: "Sewa Harian / Paviliun",
      address: "Jl. Jaten No. 15, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281",
      totalRooms: 1,
      occupied: rooms.filter((r) => r.houseId === "h7" && r.status !== "Kosong").length,
      note: "Khusus Sewa Harian/Bulanan Full Furnish & Smart TV",
      coordinates: "-7.767700, 110.385000",
    },
  ];

  const filteredLocations = selectedHouseId === "all"
    ? locations
    : locations.filter((loc) => loc.id === selectedHouseId);

  const campusLandmarks = [
    { name: "Universitas Gadjah Mada (UGM)", distance: "500 meter", time: "3 menit motor / 6 menit jalan kaki", type: "Kampus Utama" },
    { name: "Universitas Negeri Yogyakarta (UNY)", distance: "1.2 km", time: "5 menit motor", type: "Kampus Utama" },
    { name: "RSUP Dr. Sardjito", distance: "900 meter", time: "4 menit motor", type: "Fasilitas Kesehatan" },
    { name: "Jalan Kaliurang (Jakal) KM 5", distance: "300 meter", time: "2 menit jalan kaki", type: "Pusat Kuliner & Resto" },
    { name: "Pakuwon Mall / Hartono Mall", distance: "2.5 km", time: "8 menit motor", type: "Pusat Perbelanjaan" },
    { name: "Stasiun Tugu / Malioboro", distance: "4.8 km", time: "15 menit motor", type: "Transportasi & Wisata" },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(OFFICIAL_MAPS_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsappShare = () => {
    const targetPhone = tenantPhone.replace(/\D/g, "");
    const nameStr = tenantName ? `Halo Kak ${tenantName}, ` : "Halo Kak, ";
    const message = `${nameStr}berikut link lokasi resmi Google Maps Kost Griya Jaten Indah (GJI):\n\n📍 *Griya Jaten Indah (GJI)*\nAlamat: Jl. Jaten, Karangwuni, Caturtunggal, Depok, Sleman, DI Yogyakarta 55281\n\n🔗 *Google Maps:* ${OFFICIAL_MAPS_LINK}\n\nFasilitas: Lingkungan aman & tenang, dekat UGM/UNY, akses mobil, parkir motor, WiFi kencang, dan airbersih.\n\nJika sudah sampai di sekitar Karangwuni, silakan hubungi kami untuk survei kamar! Terima kasih.`;

    const waUrl = targetPhone
      ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-[22px] bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <MapPinIcon className="w-6 h-6 animate-bounce" />
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full">
              Peta Presisi Terverifikasi
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Peta Lokasi Resmi Griya Jaten Indah (GJI)
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Lokasi 7 Rumah Kost GJI di Karangwuni, Caturtunggal, Depok, Sleman. Terhubung langsung dengan Google Maps resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <a
            href={OFFICIAL_MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            <span>Buka Peta Asli (Google Maps)</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Tersalin!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span>Salin Link Maps</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter & Active Location Card */}
      <div className="p-4 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-bold text-slate-500 uppercase shrink-0 mr-1">Pilih Gedung:</span>
          <button
            onClick={() => setSelectedHouseId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedHouseId === "all"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Semua (7 Gedung)
          </button>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedHouseId(loc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedHouseId === loc.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {loc.name.split(" - ")[1]}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          📍 Karangwuni, Caturtunggal, Sleman (Dekat UGM)
        </span>
      </div>

      {/* Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Google Map Frame */}
        <div className="lg:col-span-2 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md h-[500px] relative bg-slate-100 dark:bg-slate-800 flex flex-col">
          <div className="p-3 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Google Maps Live View (Griya Jaten Indah)</span>
            </div>
            <a
              href={OFFICIAL_MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline text-[11px] font-bold flex items-center gap-1"
            >
              <span>{OFFICIAL_MAPS_LINK}</span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <iframe
            title="Peta Lokasi Griya Jaten Indah"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={EMBED_MAP_URL}
            className="flex-1 w-full h-full"
          />
        </div>

        {/* Share Location via WhatsApp & Quick Tools */}
        <div className="space-y-4">
          {/* Share Box */}
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-emerald-600" />
              <span>Kirim Serlok Ke Calon Penghuni</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kirim tautan Google Maps resmi ({OFFICIAL_MAPS_LINK}) langsung ke WhatsApp calon penyewa kost.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nama Calon Penghuni (Opsional)"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="No. WhatsApp (misal: 08123456789)"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleSendWhatsappShare}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Kirim Link Maps via WhatsApp</span>
              </button>
              {shareSuccess && (
                <p className="text-[11px] font-bold text-emerald-600 text-center animate-fade-in">
                  ✅ Pesan WhatsApp siap dikirim!
                </p>
              )}
            </div>
          </div>

          {/* Landmarks / Distance List */}
          <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white">
              <AcademicCapIcon className="w-5 h-5 text-emerald-600" />
              <span>Jarak Ke Kampus & Fasilitas Utama</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {campusLandmarks.map((lm, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{lm.name}</p>
                    <p className="text-[11px] text-slate-500">{lm.time}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] shrink-0">
                    {lm.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buildings Location Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <BuildingOffice2Icon className="w-5 h-5 text-emerald-600" />
          <span>Daftar Alamat Lengkap 7 Gedung Griya Jaten Indah</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-4 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm hover:border-emerald-500/70 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {loc.type}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">{loc.name}</h4>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  {loc.occupied}/{loc.totalRooms} Kamar Terisi
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {loc.address}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300">
                💡 <span className="font-medium">{loc.note}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 font-mono">GPS: {loc.coordinates}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + loc.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <span>Buka Rute</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
