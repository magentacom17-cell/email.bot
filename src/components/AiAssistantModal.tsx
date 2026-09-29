import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw, Wand2, Lightbulb } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBody: string;
  customerName: string;
  companyName: string;
  onApply: (newText: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  currentBody,
  customerName,
  companyName,
  onApply,
}) => {
  const [promptType, setPromptType] = useState('formal');
  const [extraNotes, setExtraNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [source, setSource] = useState<string>('');

  if (!isOpen) return null;

  const presets = [
    {
      id: 'formal',
      title: '👔 Bahasa Bisnis Resmi & Santun',
      desc: 'Sangat cocok untuk perkenalan awal ke direktur, manajer purchasing, atau PIC tender.',
    },
    {
      id: 'concise',
      title: '⚡ Padat & To-The-Point',
      desc: 'Ringkas, tidak bertele-tele, fokus pada ketersediaan stok & harga bersaing.',
    },
    {
      id: 'urgent_followup',
      title: '⏱️ Follow-up Tindak Lanjut Penawaran',
      desc: 'Menanyakan status review penawaran yang telah dikirim secara profesional.',
    },
    {
      id: 'focus_cctv_it',
      title: '📹 Fokus IT, Server & CCTV System',
      desc: 'Menonjolkan brand prinsipal IT, router, switch, IP Cam, dan NVR.',
    },
    {
      id: 'focus_electrical',
      title: '⚡ Fokus Electrical, Panel & Kabel',
      desc: 'Menekankan pasokan kabel power, breaker, trafo, panel distribusi, & instalasi.',
    },
    {
      id: 'focus_safety',
      title: '🦺 Fokus Safety K3 & Alat Pabrik',
      desc: 'Menawarkan sepatu safety, helm proyek SNI, rompi, dan APAR.',
    },
  ];

  const handleGenerate = async (presetId: string = promptType) => {
    setIsLoading(true);
    setResultText('');
    setPromptType(presetId);

    try {
      const res = await fetch('/api/ai-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: presetId,
          currentBody,
          customerName,
          companyName,
          extraNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setResultText(data.text);
        setSource(data.source || 'ai');
      } else {
        setResultText('Gagal memproses email dengan AI.');
      }
    } catch (err: any) {
      setResultText('Terjadi kendala saat menghubungi asisten AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (resultText) {
      onApply(resultText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/20 border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Asisten AI Radcom Copilot</h3>
              <p className="text-xs text-amber-100/90">
                Poles dan sesuaikan draft pesan penawaran agar lebih persuasif & profesional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Target Info */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex flex-wrap gap-4 text-amber-900">
            <div>
              <span className="font-semibold text-amber-700">Target PIC:</span>{' '}
              <span className="font-bold">{customerName || 'Bapak/Ibu Pimpinan'}</span>
            </div>
            <div>
              <span className="font-semibold text-amber-700">Perusahaan:</span>{' '}
              <span className="font-bold">{companyName || 'Perusahaan Klien'}</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
              Pilih Gaya / Fokus Bahasa Email:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleGenerate(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    promptType === p.id
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs mb-0.5">{p.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Extra Instruction */}
          <div>
            <label className="block font-bold text-slate-700 text-[11px] mb-1">
              Instruksi Tambahan (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: Berikan diskon 5% untuk PO minggu ini / tekankan garansi 2 tahun..."
                value={extraNotes}
                onChange={e => setExtraNotes(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleGenerate(promptType)}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Membuat...' : 'Proses AI'}</span>
              </button>
            </div>
          </div>

          {/* Result Area */}
          {resultText && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hasil Rekomendasi Draft:</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  Sumber: {source}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-800 text-xs">
                {resultText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Batal
          </button>

          {resultText ? (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md shadow-amber-500/20 transition-all text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Draft Ini ke Form</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleGenerate(promptType)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Memproses AI...' : 'Jalankan Pemoles'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
