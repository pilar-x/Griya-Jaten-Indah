import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { SparklesIcon, PaperAirplaneIcon, MicrophoneIcon, SpeakerWaveIcon, TrashIcon } from "@heroicons/react/24/outline";

export const SmartAiView: React.FC = () => {
  const { chatWithAiAssistant, askAiChatbot } = useApp();
  const chatBotFn = chatWithAiAssistant || askAiChatbot;

  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time?: string }>>([
    {
      sender: "ai",
      text: "Halo Ibu Retno Handayani (Pemilik Griya Jaten Indah)! Saya adalah AI Smart Advisor khusus manajemen 7 gedung kost GJI.\n\nAnda dapat menanyakan hal-hal seperti:\n• 'Berapa prediksi pendapatan bulan depan?'\n• 'Siapa saja penghuni yang berisiko terlambat bayar?'\n• 'Apakah ada rekomendasi kenaikan tarif kamar?'\n• 'Bagaimana strategi mengisi kamar kosong yang ada?'",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputMsg;
    if (!prompt.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: prompt, time: timeStr }]);
    if (!textToSend) setInputMsg("");
    setLoading(true);

    try {
      const reply = await chatBotFn(prompt);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Maaf, terjadi masalah koneksi. Namun seluruh data operasional GJI tetap tersimpan aman.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser Anda belum mendukung input suara otomatis.");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputMsg(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    "Prediksi pemasukan bulan depan",
    "Identifikasi risiko keterlambatan bayar",
    "Daftar kamar kosong & strategi pemasaran",
    "Rekomendasi kenaikan harga sewa GJI",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <SparklesIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>Smart AI Financial & Operational Advisor</span>
              <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold">
                Aktif
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Powered by Google Gemini AI API • Konsultasi cerdas otomatis 24/7 untuk Griya Jaten Indah.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* CHAT WINDOW */}
      <div className="p-5 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-md flex flex-col justify-between h-[540px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <SparklesIcon className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-xl text-xs md:text-sm leading-relaxed relative group ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] opacity-80">
                  <span>{m.time}</span>
                  {m.sender === "ai" && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors flex items-center gap-1"
                      title="Dengarkan Suara AI"
                    >
                      <SpeakerWaveIcon className="w-3.5 h-3.5" />
                      <span>Putar Audio</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  RH
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl w-fit">
              <SparklesIcon className="w-4 h-4 animate-spin" />
              <span>AI GJI sedang menganalisis database & menyusun jawaban...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800 mt-2">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase">Rekomendasi Cepat:</span>
          {samplePrompts.map((sp) => (
            <button
              key={sp}
              onClick={() => handleSend(sp)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200/60 dark:border-slate-700/60"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSpeech}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-emerald-600"
            }`}
            title="Diktekan Pertanyaan (Suara)"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Tanyakan analisis keuangan, okupansi, atau penagihan sewa..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs md:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMsg.trim()}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Kirim</span>
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

