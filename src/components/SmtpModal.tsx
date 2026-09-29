import React, { useState } from 'react';
import { X, Check, AlertCircle, RefreshCw, Key, Shield, HelpCircle, Server } from 'lucide-react';
import { SmtpConfig } from '../types/index.ts';

interface SmtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SmtpConfig;
  onSave: (newConfig: SmtpConfig) => void;
}

export const SmtpModal: React.FC<SmtpModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<SmtpConfig>(config);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handlePreset = (type: 'gmail' | 'office365' | 'cpanel' | 'sandbox') => {
    setTestResult(null);
    if (type === 'gmail') {
      setFormData(prev => ({
        ...prev,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: prev.user || '',
        pass: prev.pass || '',
        from: prev.user ? `PT Radcom Solusindo <${prev.user}>` : '',
        enabled: true,
      }));
    } else if (type === 'office365') {
      setFormData(prev => ({
        ...prev,
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        user: prev.user || '',
        pass: prev.pass || '',
        from: prev.user ? `PT Radcom Solusindo <${prev.user}>` : '',
        enabled: true,
      }));
    } else if (type === 'cpanel') {
      setFormData(prev => ({
        ...prev,
        host: 'mail.radcom.co.id',
        port: 465,
        secure: true,
        user: prev.user || 'satria@radcom.co.id',
        pass: prev.pass || '',
        from: '"Satria — PT Radcom Solusindo" <satria@radcom.co.id>',
        enabled: true,
      }));
    } else if (type === 'sandbox') {
      setFormData({
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: '',
        from: '',
        enabled: false,
      });
      setTestResult({
        success: true,
        message: 'Mode Sandbox Ethereal aktif. Email uji coba akan menghasilkan tautan pratinjau pesan otomatis tanpa perlu kredensial.',
      });
    }
  };

  const testConnection = async () => {
    if (!formData.host || !formData.user || !formData.pass) {
      setTestResult({
        success: false,
        message: 'Mohon isi Host SMTP, Username, dan Password/App Password terlebih dahulu.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/verify-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: formData.host,
          port: formData.port,
          secure: formData.secure,
          user: formData.user,
          pass: formData.pass,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: 'Koneksi ke server SMTP berhasil diverifikasi!' });
      } else {
        setTestResult({ success: false, message: data.error || 'Koneksi gagal ditolak server' });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal menghubungi server untuk verifikasi SMTP.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-400/30">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pengaturan Server Email (SMTP)</h3>
              <p className="text-xs text-blue-200/80">
                Kirim email langsung dari sistem tanpa perlu membuka aplikasi luar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pilih Konfigurasi Cepat / Provider:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePreset('gmail')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all text-xs"
              >
                <div className="font-bold text-slate-900">Gmail</div>
                <div className="text-[11px] text-slate-500">App Password</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset('office365')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all text-xs"
              >
                <div className="font-bold text-slate-900">Office 365</div>
                <div className="text-[11px] text-slate-500">Outlook / Exchange</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset('cpanel')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all text-xs"
              >
                <div className="font-bold text-slate-900">Webmail Perusahaan</div>
                <div className="text-[11px] text-slate-500">@radcom.co.id</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset('sandbox')}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-left transition-all text-xs"
              >
                <div className="font-bold text-amber-900">Sandbox Test</div>
                <div className="text-[11px] text-amber-700">Tanpa sandi (Ethereal)</div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMTP Host Server
              </label>
              <input
                type="text"
                placeholder="smtp.gmail.com / mail.perusahaan.com"
                value={formData.host}
                onChange={e => setFormData({ ...formData, host: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Port
              </label>
              <input
                type="number"
                placeholder="465 / 587"
                value={formData.port}
                onChange={e => setFormData({ ...formData, port: Number(e.target.value) || 465 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="smtp-secure"
              checked={formData.secure}
              onChange={e => setFormData({ ...formData, secure: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="smtp-secure" className="text-xs text-slate-700 font-medium">
              Gunakan Enkripsi Aman SSL/TLS (Wajib untuk Port 465)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Email Akun
              </label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={formData.user}
                onChange={e => setFormData({ ...formData, user: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / App Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={formData.pass}
                onChange={e => setFormData({ ...formData, pass: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Format Nama Pengirim (From Display Header)
            </label>
            <input
              type="text"
              placeholder='"PT Radcom Solusindo" <email@perusahaan.com>'
              value={formData.from}
              onChange={e => setFormData({ ...formData, from: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Opsional. Jika dikosongkan, nama profil sales akan digunakan secara otomatis.
            </span>
          </div>

          {/* Helpful Tip for Gmail Users */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Petunjuk Khusus Pengguna Gmail:</span>
            </div>
            <p className="text-[12px] leading-relaxed text-blue-800">
              Google mengharuskan <strong>"Sandi Aplikasi" (App Password 16 karakter)</strong> untuk akun dengan verifikasi 2 langkah aktif. Buat di:
              <em> myaccount.google.com &gt; Keamanan &gt; Verifikasi 2 Langkah &gt; Sandi Aplikasi</em>.
            </p>
          </div>

          {/* Test Status Alert */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={testConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
