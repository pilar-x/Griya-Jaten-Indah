import React, { useState } from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalculatorIcon,
  PrinterIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BoltIcon,
  SparklesIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

export const TataTertibView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Penting" | "Fasilitas & Tamu" | "Biaya & Tambahan" | "Sanksi">("All");

  // Rule #16 Electronic Appliance Surcharge Calculator state
  const [elecTv, setElecTv] = useState(false);
  const [elecDispenser, setElecDispenser] = useState(false);
  const [elecKulkas, setElecKulkas] = useState(false);
  const [elecRiceCooker, setElecRiceCooker] = useState(false);
  const [elecAc, setElecAc] = useState(false);

  // Rule #6 Guest Stay Calculator state
  const [guestNights, setGuestNights] = useState(1);
  const [guestPersons, setGuestPersons] = useState(1);
  const [extraMattresses, setExtraMattresses] = useState(0);

  const OWNER_NAME = "Ibu Retno Handayani";
  const OWNER_PHONE = "0817-201-958";
  const GJI_ADDRESS = "Jl. Kabupaten (Utara), Ds. Jaten RT.07/RW.31 Sendangadi, Mlati, Sleman, D.I. Yogyakarta";

  // Calculate Electronic Surcharge
  const totalElecCost =
    (elecTv ? 25000 : 0) +
    (elecDispenser ? 40000 : 0) +
    (elecKulkas ? 100000 : 0) +
    (elecRiceCooker ? 10000 : 0) +
    (elecAc ? 850000 : 0);

  // Calculate Guest Stay Surcharge
  const totalGuestCost = (guestPersons * 50000 * guestNights) + (extraMattresses * 50000 * guestNights);

  const rulesList = [
    {
      id: 1,
      title: "1. Identitas Diri (KTP/SIM)",
      category: "Penting",
      text: "Setiap penghuni kos wajib menyerahkan fotocopy KTP/SIM kepada Pemilik Kos.",
      important: true,
    },
    {
      id: 2,
      title: "2. Pembayaran Bulanan Kos",
      category: "Biaya & Tambahan",
      text: "Pembayaran bulanan kos dilakukan sesuai dengan tanggal masuk setiap bulannya, melalui tunai atau transfer ke rekening resmi Ibu Retno Handayani.",
      important: true,
    },
    {
      id: 3,
      title: "3. Pemeliharaan Fasilitas Kamar",
      category: "Fasilitas & Tamu",
      text: "Penghuni kos wajib memelihara fasilitas yang disediakan di setiap kamar yaitu: Kasur, Meja, Kursi, Lemari, kelengkapan Kamar Mandi maupun fasilitas lainnya.",
      important: false,
    },
    {
      id: 4,
      title: "4. Larangan Tamu Lawan Jenis Ke Kamar",
      category: "Penting",
      text: "Penghuni kos DILARANG MEMASUKAN TAMU LAWAN JENIS (bukan muhrim) ke dalam kamar/rumah, (MENERIMA TAMU DI RUANG TAMU TERAS SAJA).",
      important: true,
      highlightRed: true,
    },
    {
      id: 5,
      title: "5. Jam Bertamu Terbatas",
      category: "Fasilitas & Tamu",
      text: "Waktu menerima tamu antara pukul 06.00 s/d 22.00 WIB (Lebih dari pkl. 22.00 WIB dilarang menerima tamu).",
      important: true,
      highlightRed: true,
    },
    {
      id: 6,
      title: "6. Ketentuan Menginap Keluarga / Teman",
      category: "Fasilitas & Tamu",
      text: "Apabila membawa keluarga, teman (bukan lawan jenis) menginap, wajib: (a) lapor ke pengurus kos dan menyerahkan KTP, (b) Dikenakan biaya Rp 50.000/malam/orang, jika tambah Kasur dikenakan biaya lagi Rp 50.000/kasur.",
      important: false,
    },
    {
      id: 7,
      title: "7. Kebersihan & Keamanan Lingkungan",
      category: "Fasilitas & Tamu",
      text: "Penghuni kos wajib dan bertanggungjawab dalam menjaga kebersihan, kerapihan, keamanan, kenyamanan rumah kos, mushola dan kamar kos & Kamar mandi masing-masing.",
      important: false,
    },
    {
      id: 8,
      title: "8. Pintu Pagar Terkunci",
      category: "Penting",
      text: "Keluar masuk kos, pintu pagar harus selalu terkunci demi keamanan bersama.",
      important: true,
    },
    {
      id: 9,
      title: "9. Tanggung Jawab Kunci Kamar & Gerbang",
      category: "Fasilitas & Tamu",
      text: "Kunci kamar dan gerbang yang dibawa penghuni kos merupakan barang pinjaman selama penghuni menempati kamar. Jika kehilangan mohon segera lapor ke pengurus/pemilik kos dan wajib mengganti biaya pembuatan kunci baru.",
      important: false,
    },
    {
      id: 10,
      title: "10. Tanggung Jawab Barang Pribadi",
      category: "Penting",
      text: "Pengelola/Pemilik kos tidak bertanggungjawab atas kehilangan/kerusakan barang milik penghuni kos.",
      important: false,
    },
    {
      id: 11,
      title: "11. Larangan Perubahan Fisik Bangunan",
      category: "Fasilitas & Tamu",
      text: "Penghuni kos dilarang melakukan perubahan (memaku tembok, mencoret-coret tembok dan furniture, menempel poster dan sejenisnya).",
      important: false,
    },
    {
      id: 12,
      title: "12. Kebersihan Sampah",
      category: "Fasilitas & Tamu",
      text: "Buang sampah pada tempat yang telah disediakan di masing-masing gedung.",
      important: false,
    },
    {
      id: 13,
      title: "13. Aturan Merokok",
      category: "Penting",
      text: "Dilarang merokok di dalam rumah kos/dikamar, (di teras saja).",
      important: true,
    },
    {
      id: 14,
      title: "14. Parkir & Etika Antar Penghuni",
      category: "Fasilitas & Tamu",
      text: "Parkir kendaraan dengan rapih & saling menghormati antar penghuni kos.",
      important: false,
    },
    {
      id: 15,
      title: "15. Larangan Hewan & Barang Berbahaya",
      category: "Sanksi",
      text: "Dilarang membawa hewan peliharaan, senjata api dan barang-barang lainnya yang bertentangan dengan undang-undang pidana.",
      important: true,
      highlightRed: true,
    },
    {
      id: 16,
      title: "16. Tambahan Biaya Peralatan Elektronik",
      category: "Biaya & Tambahan",
      text: "ADA TAMBAHAN BIAYA dari harga sewa kamar yang disepakati jika membawa peralatan elektronik: (a) TV: Rp 25.000/bln, (b) Dispenser: Rp 40.000/bln, (c) Kulkas: Rp 100.000/bln, (d) Rice Cooker: Rp 10.000/bln, (e) AC: Rp 850.000/bln.",
      important: true,
    },
    {
      id: 17,
      title: "17. Kerukunan & Etika Pergaulan",
      category: "Fasilitas & Tamu",
      text: "Para Penghuni kos harus selalu menjaga kerukunan dan keharmonisan dalam bersikap dan berkomunikasi juga etika pergaulan yang baik.",
      important: false,
    },
    {
      id: 18,
      title: "18. Sanksi & Penghentian Kontrak Kos",
      category: "Sanksi",
      text: "Pemilik Kos berhak untuk MENGHENTIKAN KONTRAK KOS apabila Penghuni Kos: (a) Melakukan perbuatan tidak senonoh/Mesum/Maksiat, (b) Melakukan Miras/Mabuk dan sejenisnya, (c) Membuat keributan/kegaduhan dll serta mengganggu penghuni kos lainnya, (d) Sepakat Pemilik Kos memproses secara hukum apabila penghuni kos tidak mematuhi peraturan-peraturan tersebut.",
      important: true,
      highlightRed: true,
    },
    {
      id: 19,
      title: "19. Persetujuan Tata Tertib",
      category: "Penting",
      text: "Penghuni kos dianggap telah mengetahui dan menyetujui Peraturan/Tata Tertib ini. Semoga Penghuni Kos Griya Jaten Indah dapat tinggal dengan nyaman, tenang dan damai aamiin.",
      important: true,
    },
  ];

  const filteredRules = rulesList.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.text.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === "All") return matchesSearch;
    return matchesSearch && r.category === selectedCategory;
  });

  const handlePrint = () => {
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const printHtml = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Tata Tertib Resmi Kost Griya Jaten Indah (GJI)</title>
          <style>
            @page {
              size: A4;
              margin: 12mm;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 10px;
              margin: 0;
              line-height: 1.4;
              font-size: 10pt;
            }
            .header-kop {
              text-align: center;
              border-bottom: 3px double #047857;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header-kop h1 {
              font-size: 16pt;
              margin: 0 0 4px 0;
              color: #047857;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .header-kop p {
              margin: 2px 0;
              font-size: 9pt;
              color: #334155;
            }
            .badge-official {
              display: inline-block;
              background-color: #d1fae5;
              color: #065f46;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 8.5pt;
              font-weight: bold;
              margin-top: 4px;
            }
            .rules-grid {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .rule-card {
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 8px 12px;
              background-color: #f8fafc;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .rule-card.important {
              background-color: #fffbebf5;
              border-color: #fde68a;
            }
            .rule-card.red {
              background-color: #fef2f2;
              border-color: #fca5a5;
            }
            .rule-title-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 3px;
            }
            .rule-title {
              font-weight: 700;
              font-size: 10.5pt;
              color: #0f172a;
            }
            .rule-title.red {
              color: #b91c1c;
            }
            .rule-tag {
              font-size: 7.5pt;
              font-weight: 800;
              padding: 1px 6px;
              border-radius: 10px;
              background-color: #e2e8f0;
              color: #334155;
              text-transform: uppercase;
            }
            .rule-tag.red {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .rule-tag.important {
              background-color: #fef3c7;
              color: #92400e;
            }
            .rule-text {
              font-size: 9.5pt;
              color: #334155;
              line-height: 1.35;
            }
            .closing-box {
              margin-top: 18px;
              text-align: center;
              border: 1px dashed #047857;
              padding: 10px;
              border-radius: 6px;
              background-color: #ecfdf5;
              font-style: italic;
              font-size: 9.5pt;
              color: #065f46;
              page-break-inside: avoid;
            }
            .signature-section {
              margin-top: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              page-break-inside: avoid;
            }
            .sig-box {
              text-align: center;
              min-width: 180px;
            }
            .sig-space {
              height: 50px;
            }
            .sig-name {
              font-weight: 800;
              font-size: 10.5pt;
              text-decoration: underline;
              color: #0f172a;
            }
            .no-print-bar {
              background: #0f172a;
              color: #ffffff;
              padding: 10px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
              border-radius: 8px;
              font-family: sans-serif;
            }
            .btn-print {
              background: #10b981;
              color: #ffffff;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-weight: bold;
              cursor: pointer;
            }
            @media print {
              .no-print-bar {
                display: none !important;
              }
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print-bar">
            <span><strong>Pratinjau Cetak / PDF Tata Tertib GJI</strong> (Gunakan menu "Save as PDF" di dialog cetak)</span>
            <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
          </div>

          <div class="header-kop">
            <h1>TATA TERTIB RUMAH KOS GRIYA JATEN INDAH (GJI)</h1>
            <p><strong>Alamat Properti:</strong> ${GJI_ADDRESS}</p>
            <p><strong>Pemilik Kos:</strong> ${OWNER_NAME} | <strong>No. HP/WA:</strong> ${OWNER_PHONE}</p>
            <div class="badge-official">DOKUMEN RESMI 19 PASAL TATA TERTIB KOST</div>
          </div>

          <div class="rules-grid">
            ${rulesList
              .map(
                (r) => `
              <div class="rule-card ${r.highlightRed ? "red" : r.important ? "important" : ""}">
                <div class="rule-title-row">
                  <span class="rule-title ${r.highlightRed ? "red" : ""}">${r.title}</span>
                  <span class="rule-tag ${r.highlightRed ? "red" : r.important ? "important" : ""}">${r.category}</span>
                </div>
                <div class="rule-text">${r.text}</div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="closing-box">
            "Semoga Penghuni Kos Griya Jaten Indah dapat tinggal dengan nyaman, tenang dan damai. Aamiin."
          </div>

          <div class="signature-section">
            <div>
              <p style="font-size: 8.5pt; color: #64748b; margin: 0;">Dokumen ini diterbitkan secara resmi oleh sistem manajemen GJI Smart.</p>
            </div>
            <div class="sig-box">
              <p style="font-size: 9.5pt; margin: 0;">Sleman, ${today}</p>
              <p style="font-size: 9.5pt; margin: 2px 0 0 0; font-weight: bold;">Pemilik Kos Griya Jaten Indah</p>
              <div class="sig-space"></div>
              <p class="sig-name">${OWNER_NAME}</p>
              <p style="font-size: 8.5pt; color: #475569; margin: 0;">(${OWNER_PHONE})</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    try {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.open();
        printWin.document.write(printHtml);
        printWin.document.close();
      } else {
        window.print();
      }
    } catch (err) {
      window.print();
    }
  };

  const handleShareWa = () => {
    const text = `*TATA TERTIB RUMAH KOS GRIYA JATEN INDAH (GJI)*\n📍 ${GJI_ADDRESS}\n\nPemilik: ${OWNER_NAME} (${OWNER_PHONE})\n\n19 Peraturan Resmi Kost GJI dapat diakses secara digital. Mohon seluruh penghuni dan calon penghuni untuk membaca dan menaati tata tertib demi kenyamanan bersama.\n\n*Poin Penting:* Dilarang membawa tamu lawan jenis ke kamar (di teras saja, max pkl 22.00 WIB).`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[26px] bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold">
            <DocumentTextIcon className="w-4 h-4 text-red-400" />
            <span>Dokumen Resmi Peraturan & Kebijakan Kost</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            TATA TERTIB - RUMAH KOS GRIYA JATEN INDAH (GJI)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{GJI_ADDRESS}</span>
          </p>
          <p className="text-xs text-slate-400">
            Tertanda Pemilik Kos: <strong>{OWNER_NAME}</strong> ({OWNER_PHONE})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Cetak / Cetak PDF</span>
          </button>
          <button
            onClick={handleShareWa}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Bagikan via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE CALCULATORS FOR RULES #16 & #6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Rule #16 - Tambahan Elektronik */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                Kalkulator Tambahan Biaya Elektronik (Pasal 16)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Per Bulan
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Centang peralatan elektronik tambahan yang dibawa ke dalam kamar untuk menghitung total biaya sewa per bulan:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500">
              <span className="font-semibold text-slate-800 dark:text-slate-200">TV (+Rp 25.000)</span>
              <input
                type="checkbox"
                checked={elecTv}
                onChange={(e) => setElecTv(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Dispenser (+Rp 40.000)</span>
              <input
                type="checkbox"
                checked={elecDispenser}
                onChange={(e) => setElecDispenser(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Kulkas (+Rp 100.000)</span>
              <input
                type="checkbox"
                checked={elecKulkas}
                onChange={(e) => setElecKulkas(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Rice Cooker (+Rp 10.000)</span>
              <input
                type="checkbox"
                checked={elecRiceCooker}
                onChange={(e) => setElecRiceCooker(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500 col-span-1 sm:col-span-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">AC Unit (+Rp 850.000)</span>
              <input
                type="checkbox"
                checked={elecAc}
                onChange={(e) => setElecAc(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Total Tambahan Elektronik / Bulan:</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400">
              + Rp {totalElecCost.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Calculator Rule #6 - Biaya Menginap Keluarga/Teman */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                Simulasi Menginap Keluarga/Teman (Pasal 6)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Per Malam
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Aturan: Dikenakan Rp 50.000/malam/orang (sesama jenis / keluarga). Tambah kasur +Rp 50.000/kasur. Wajib lapor pengurus & kumpulkan KTP.
          </p>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Jumlah Orang:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={guestPersons}
                onChange={(e) => setGuestPersons(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Jumlah Malam:</label>
              <input
                type="number"
                min="1"
                max="30"
                value={guestNights}
                onChange={(e) => setGuestNights(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Extra Kasur:</label>
              <input
                type="number"
                min="0"
                max="3"
                value={extraMattresses}
                onChange={(e) => setExtraMattresses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Estimasi Total Menginap:</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              Rp {totalGuestCost.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH RULES */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci tata tertib..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {(["All", "Penting", "Fasilitas & Tamu", "Biaya & Tambahan", "Sanksi"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                }`}
              >
                {cat === "All" ? "Semua 19 Pasal" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* RULES LIST (19 PASAL) */}
        <div className="space-y-3 pt-2">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all space-y-1.5 ${
                rule.highlightRed
                  ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                  : rule.important
                  ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/40"
                  : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-black text-sm ${
                    rule.highlightRed
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-slate-800 dark:text-white"
                  }`}
                >
                  {rule.title}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    rule.category === "Sanksi" || rule.highlightRed
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : rule.category === "Penting"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {rule.category}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {rule.text}
              </p>
            </div>
          ))}
        </div>

        {/* CLOSING / SIGNATURE */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-emerald-200 dark:border-slate-700 text-center space-y-2">
          <p className="text-xs text-slate-700 dark:text-slate-300 italic">
            "Semoga Penghuni Kos Griya Jaten Indah dapat tinggal dengan nyaman, tenang dan damai. Aamiin."
          </p>
          <div className="pt-2 border-t border-emerald-200/60 dark:border-slate-700/60 max-w-xs mx-auto">
            <p className="text-xs font-bold text-slate-800 dark:text-white">Tertanda Pemilik Kos</p>
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">{OWNER_NAME}</p>
            <p className="text-[11px] text-slate-500">Nomor Telepon/WA: {OWNER_PHONE}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
