import React from 'react';
import { X, Clock, ExternalLink, RotateCcw, Trash2, Mail, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { EmailHistoryItem } from '../types/index.ts';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: EmailHistoryItem[];
  onLoadItem: (item: EmailHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'server':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Send className="w-3 h-3" /> Server SMTP
          </span>
        );
      case 'gmail':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
            <Mail className="w-3 h-3" /> Gmail Web
          </span>
        );
      case 'outlook':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Mail className="w-3 h-3" /> Outlook Web
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {channel}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Riwayat Pengiriman Email</span>
            </h3>
            <p className="text-xs text-blue-200/80">
              Daftar email yang telah dikirim atau disiapkan melalui RADCOM Workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[460px]">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Belum ada riwayat email yang dikirimkan.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Kirim email melalui Server SMTP, Gmail Web, atau Outlook untuk mencatatnya di sini.
              </p>
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getChannelBadge(item.channel)}
                    <span className="font-bold text-slate-900 text-sm">
                      {item.recipientName ? `${item.recipientName} ` : ''}
                      &lt;{item.to}&gt;
                    </span>
                    {item.company && (
                      <span className="text-slate-500 font-medium">({item.company})</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="font-semibold text-blue-900">
                  {item.subject}
                </div>

                {item.messageSnippet && (
                  <p className="text-slate-600 line-clamp-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                    {item.messageSnippet}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div>
                    {item.previewUrl && (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka Hasil Sandbox (Ethereal)</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onLoadItem(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Muat Ulang Pesan Ini</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs flex justify-between items-center">
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Riwayat</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
