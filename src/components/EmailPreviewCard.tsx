import React, { useState } from 'react';
import { Eye, Smartphone, Monitor, Copy, Check, Printer, ExternalLink, ShieldCheck, Mail } from 'lucide-react';
import { SenderProfile, CompanyProfileAttachment } from '../types/index.ts';
import { buildHtmlEmail, buildPlainTextEmail } from '../utils/emailBuilder.ts';
import { RadcomLogo } from './RadcomLogo.tsx';
import { partnersBadgesBase64 } from '../assets/partnersBase64.ts';
import regeneratedPartnerBadgesImg from '../assets/images/regenerated_image_1790668669323.png';
import signatureLogoImg from '../assets/images/regenerated_image_1790668897925.jpg';

interface EmailPreviewCardProps {
  to: string;
  customerName: string;
  companyName: string;
  subject: string;
  resolvedBody: string;
  senderProfile: SenderProfile;
  includeCompanyProfile?: boolean;
  customCompanyProfile?: CompanyProfileAttachment | null;
  onCopyText: () => void;
  copied: boolean;
}

export const EmailPreviewCard: React.FC<EmailPreviewCardProps> = ({
  to,
  customerName,
  companyName,
  subject,
  resolvedBody,
  senderProfile,
  includeCompanyProfile = true,
  customCompanyProfile,
  onCopyText,
  copied,
}) => {
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [htmlCopied, setHtmlCopied] = useState(false);

  const fullHtml = buildHtmlEmail(
    resolvedBody,
    subject,
    senderProfile,
    includeCompanyProfile,
    customCompanyProfile?.filename
  );
  const plainText = buildPlainTextEmail(
    resolvedBody,
    senderProfile,
    includeCompanyProfile,
    customCompanyProfile?.filename
  );

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(fullHtml);
    setHtmlCopied(true);
    setTimeout(() => setHtmlCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/40 overflow-hidden flex flex-col h-full">
      {/* Card Header & Controls */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm tracking-wide">Live Preview Penerima</h3>
          <span className="text-xs text-slate-400">
            {to ? `(Kepada: ${to})` : '(Belum ada email target)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('html')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'html'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surat HTML
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'text'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Teks Polos
            </button>
          </div>

          {/* Device Toggle (Only for HTML) */}
          {viewMode === 'html' && (
            <div className="hidden sm:flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1 rounded-md transition-all ${
                  deviceMode === 'desktop' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Layar Komputer / Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1 rounded-md transition-all ${
                  deviceMode === 'mobile' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Layar Smartphone / HP"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Cetak Surat / Simpan PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onCopyText}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            title="Salin Teks Lengkap"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span className="hidden md:inline">{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>
        </div>
      </div>

      {/* Email Meta Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">Pengirim:</span>
          <span className="font-medium text-slate-900">
            {senderProfile.name} &lt;{senderProfile.email}&gt;
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">Kepada:</span>
          <span className="font-medium text-slate-900">
            {customerName ? `${customerName} ` : ''}
            {to ? `&lt;${to}&gt;` : '<email-target@perusahaan.com>'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">Subject:</span>
          <span className="font-bold text-blue-900 truncate">
            {subject || '(Tanpa Subject)'}
          </span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-slate-100 p-3 sm:p-5 overflow-y-auto max-h-[620px] flex justify-center items-start">
        {viewMode === 'html' ? (
          <div
            className={`w-full transition-all duration-300 ${
              deviceMode === 'mobile' ? 'max-w-[380px]' : 'max-w-[660px]'
            }`}
          >
            {/* Rendered HTML Container */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              {/* Radcom Banner */}
              <div className="bg-gradient-to-r from-[#0b1736] via-[#0f2a63] to-[#123d87] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-extrabold tracking-widest text-white">
                      RAD<span className="text-blue-400">COM</span>
                    </div>
                    <div className="text-[11px] text-blue-200/90 font-medium tracking-wide">
                      PT RADCOM SOLUSINDO INFORMATIKA
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/20">
                    Official Supplier
                  </span>
                </div>
              </div>

              {/* Product Badge Strip */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 text-[11px] text-slate-600 font-medium overflow-x-auto whitespace-nowrap">
                ⚡ Electrical · 🌐 IT & Networking · 📹 CCTV Security · ❄️ HVAC · 🦺 Safety K3
              </div>

              {/* Email Content Body */}
              <div className="p-6 text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap font-sans">
                {resolvedBody || 'Tulis isi email pada formulir di sebelah kiri untuk melihat pratinjau langsung...'}
              </div>

              {/* Company Profile PDF Attachment Badge */}
              {includeCompanyProfile && (
                <div className="mx-6 mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="font-bold text-emerald-950 text-xs">
                        {customCompanyProfile ? customCompanyProfile.filename : 'Company-Profile-PT-Radcom-Solusindo.pdf'}
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        {customCompanyProfile 
                          ? `File Asli Terunggah (${customCompanyProfile.sizeFormatted}) • Lampiran Resmi Perusahaan`
                          : 'Profil Resmi, Rekanan, Portofolio Proyek, & Izin Pengadaan LPSE / PaDi UMKM / SIPLah / LKPP'}
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-extrabold px-2 py-1 rounded-md border ${
                    customCompanyProfile
                      ? 'text-emerald-900 bg-emerald-200 border-emerald-400'
                      : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                  }`}>
                    {customCompanyProfile ? 'PDF Asli Terlampir' : 'PDF Resmi Terlampir'}
                  </span>
                </div>
              )}

              {/* Signature Box */}
              <div className="mx-6 mb-6 pt-6 border-t border-slate-200/90 text-xs text-slate-800 space-y-3.5 font-sans">
                {/* Salutation */}
                <div className="text-slate-600 font-medium">
                  Warm Regards
                </div>

                {/* Name & Title */}
                <div>
                  <div className="font-bold text-slate-900 text-base tracking-tight">
                    {senderProfile.name || 'Satria'}
                  </div>
                  <div className="text-slate-600 font-medium text-xs">
                    {senderProfile.title || 'Business Representative'}
                  </div>
                </div>

                {/* Logo Radcom di bawah Business Representative */}
                <div className="py-0.5">
                  <RadcomLogo src={signatureLogoImg} className="w-20 h-20 rounded-xl shadow-xs border border-slate-200/90" />
                </div>

                {/* Company Name & Address */}
                <div className="space-y-0.5 pt-1">
                  <div className="font-bold text-[#0e2354] text-sm tracking-wide">
                    {senderProfile.company || 'PT Radcom Solusindo Informatika'}
                  </div>
                  <div className="text-slate-600 text-xs leading-relaxed">
                    Jl. Mampang Prapatan X No. 36<br />
                    Mampang, Jakarta 12790
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-1 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="font-semibold text-slate-800">Phone:</span>{' '}
                    +62 817-0380-7122 &nbsp;&nbsp;
                    <span className="font-semibold text-slate-800">Mobile:</span>{' '}
                    +62 817-0380-7122
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">E-mail:</span>{' '}
                    <a
                      href={`mailto:${senderProfile.email || 'satria@radcomsolusindo.com'}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {senderProfile.email || 'satria@radcomsolusindo.com'}
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Visit us at:</span>{' '}
                    <a
                      href={`https://${senderProfile.website || 'www.radcomsolusindo.com'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {senderProfile.website || 'www.radcomsolusindo.com'}
                    </a>
                  </div>
                </div>

                {/* Foto SIPLah, PaDi UMKM, LPSE, e-catalogue di bawah Visit us */}
                <div className="pt-2">
                  <div className="inline-block bg-white p-2 rounded-lg border border-slate-200/90 shadow-2xs">
                    <img
                      src={regeneratedPartnerBadgesImg}
                      alt="Mitra Resmi Pengadaan: PaDi UMKM, SIPLah, LPSE, e-Katalog LKPP"
                      className="h-10 sm:h-12 w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Radcom Footer */}
              <div className="bg-slate-900 text-slate-400 p-4 text-center text-[10px] space-y-1">
                <p className="font-bold text-slate-300">
                  PT RADCOM SOLUSINDO INFORMATIKA
                </p>
                <p>
                  Partner Resmi Pengadaan Perlengkapan Proyek, Industri, dan Perkantoran
                </p>
                <p className="text-slate-500 text-[9px]">
                  Hak Cipta © {new Date().getFullYear()} PT Radcom Solusindo Informatika. Seluruh hak cipta dilindungi.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Plain Text Preview */
          <div className="w-full max-w-[660px] bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600">Format Teks Standar / RFC</span>
              <span className="text-[11px] text-slate-400">{plainText.length} karakter</span>
            </div>
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              {plainText}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Utility Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Siap dikirim dengan identitas resmi PT Radcom Solusindo Informatika</span>
        </div>
        <button
          onClick={handleCopyHtml}
          className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline flex items-center gap-1"
        >
          {htmlCopied ? <Check className="w-3 h-3 text-emerald-600" /> : null}
          <span>{htmlCopied ? 'Kode HTML Disalin!' : 'Salin Kode HTML'}</span>
        </button>
      </div>
    </div>
  );
};
