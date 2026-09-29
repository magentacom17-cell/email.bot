import React, { useState, useRef } from 'react';
import {
  Send,
  Mail,
  Copy,
  Check,
  Sparkles,
  UserPlus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  Layers,
  HelpCircle,
  Paperclip,
  Trash2,
  Download,
  Calculator,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  EmailTemplate,
  SenderProfile,
  SmtpConfig,
  CustomerContact,
  EmailAttachment,
  CompanyProfileAttachment,
} from '../types/index.ts';

interface EmailFormProps {
  to: string;
  setTo: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  cc: string;
  setCc: (val: string) => void;
  bcc: string;
  setBcc: (val: string) => void;
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  templates: EmailTemplate[];
  subject: string;
  setSubject: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  attachments: EmailAttachment[];
  onRemoveAttachment: (filename: string) => void;
  onOpenFunctionOutput: () => void;
  includeCompanyProfile: boolean;
  setIncludeCompanyProfile: (val: boolean) => void;
  customCompanyProfile: CompanyProfileAttachment | null;
  onUploadCompanyProfile: (file: File) => void;
  onRemoveCustomCompanyProfile: () => void;
  senderProfile: SenderProfile;
  smtpConfig: SmtpConfig;
  onSendViaServer: () => Promise<void>;
  isSendingServer: boolean;
  onOpenGmailWeb: () => void;
  onOpenOutlookWeb: () => void;
  onOpenMailto: () => void;
  onSendWhatsApp: () => void;
  onCopyText: () => void;
  copied: boolean;
  onOpenAiAssistant: () => void;
  onOpenContacts: () => void;
  onSaveAsCustomTemplate: () => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  to,
  setTo,
  customerName,
  setCustomerName,
  companyName,
  setCompanyName,
  cc,
  setCc,
  bcc,
  setBcc,
  selectedTemplateId,
  onSelectTemplate,
  templates,
  subject,
  setSubject,
  message,
  setMessage,
  attachments,
  onRemoveAttachment,
  onOpenFunctionOutput,
  includeCompanyProfile,
  setIncludeCompanyProfile,
  customCompanyProfile,
  onUploadCompanyProfile,
  onRemoveCustomCompanyProfile,
  senderProfile,
  smtpConfig,
  onSendViaServer,
  isSendingServer,
  onOpenGmailWeb,
  onOpenOutlookWeb,
  onOpenMailto,
  onSendWhatsApp,
  onCopyText,
  copied,
  onOpenAiAssistant,
  onOpenContacts,
  onSaveAsCustomTemplate,
}) => {
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCompanyProfile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadCompanyProfile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadCustomPdf = () => {
    if (!customCompanyProfile?.base64) return;
    try {
      const byteCharacters = atob(customCompanyProfile.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = customCompanyProfile.filename || 'Company-Profile-Asli.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download custom PDF:', err);
    }
  };

  const insertVariable = (varName: string) => {
    setMessage(message + ` ${varName} `);
  };

  const categories = [
    { id: 'all', label: 'Semua Template' },
    { id: 'perkenalan', label: 'Perkenalan' },
    { id: 'penawaran', label: 'Penawaran' },
    { id: 'followup', label: 'Follow-up' },
    { id: 'operasional', label: 'PO / Operasional' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory || t.category === 'kustom');

  const downloadAttachmentLocally = (att: EmailAttachment) => {
    const blob = new Blob([att.content], { type: att.contentType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = att.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/30 overflow-hidden flex flex-col">
      {/* Form Title & Fast Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 py-4 border-b border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span>Editor & Pengirim Pesan Email</span>
          </h2>
          <p className="text-xs text-blue-200/80">
            Isi penerima, rincian penawaran, dan pilih metode pengiriman
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Function Output / Quotation Generator Button */}
          <button
            type="button"
            onClick={onOpenFunctionOutput}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/40 hover:bg-blue-600/70 border border-blue-400/40 text-blue-100 transition-all cursor-pointer shadow-xs"
            title="Buka Generator Rincian Penawaran & Dokumen Lampiran"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-300" />
            <span>+ Rincian Penawaran</span>
          </button>

          {/* AI Polish */}
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poles AI</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {/* Recipient Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="to-input" className="block text-xs font-bold text-slate-700">
                Email Target <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenContacts}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Pilih Kontak</span>
              </button>
            </div>
            <input
              id="to-input"
              type="email"
              required
              placeholder="customer@perusahaan.com"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="customer-name" className="block text-xs font-bold text-slate-700 mb-1">
              Nama Customer / PIC
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="Bapak Hendra"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="company-name" className="block text-xs font-bold text-slate-700 mb-1">
              Nama Perusahaan
            </label>
            <input
              id="company-name"
              type="text"
              placeholder="PT Surya Citra"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* CC / BCC Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowCcBcc(!showCcBcc)}
            className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
          >
            {showCcBcc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{showCcBcc ? 'Sembunyikan CC & BCC' : '+ Tambah CC / BCC'}</span>
          </button>

          {showCcBcc && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  CC (Carbon Copy)
                </label>
                <input
                  type="text"
                  placeholder="purchasing@perusahaan.com, finance@radcom.co.id"
                  value={cc}
                  onChange={e => setCc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  BCC (Blind Carbon Copy)
                </label>
                <input
                  type="text"
                  placeholder="arsip@radcom.co.id"
                  value={bcc}
                  onChange={e => setBcc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Template Selector with Category Badges */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-700">
              Pilihan Template Pesan Bisnis
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onSaveAsCustomTemplate}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                title="Simpan pesan saat ini sebagai template kustom baru"
              >
                <BookmarkPlus className="w-3 h-3" />
                <span>Simpan Sebagai Template</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Select Dropdown */}
          <select
            value={selectedTemplateId}
            onChange={e => onSelectTemplate(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
          >
            {filteredTemplates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject-input" className="block text-xs font-bold text-slate-700 mb-1">
            Subject Email
          </label>
          <input
            id="subject-input"
            type="text"
            placeholder="Subject email..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-slate-900"
          />
        </div>

        {/* Dynamic Variable Chips */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
            <label htmlFor="message-input" className="block text-xs font-bold text-slate-700">
              Isi Surat Email
            </label>
            <div className="flex flex-wrap items-center gap-1 text-[10px]">
              <span className="text-slate-400">Variabel:</span>
              <button
                type="button"
                onClick={() => insertVariable('[Nama]')}
                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-medium border border-blue-200"
              >
                +[Nama]
              </button>
              <button
                type="button"
                onClick={() => insertVariable('[Perusahaan]')}
                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-medium border border-blue-200"
              >
                +[Perusahaan]
              </button>
              <button
                type="button"
                onClick={() => insertVariable('[Nama Sales]')}
                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-medium border border-blue-200"
              >
                +[Nama Sales]
              </button>
              <button
                type="button"
                onClick={() => insertVariable('[No HP Sales]')}
                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-medium border border-blue-200"
              >
                +[No HP]
              </button>
            </div>
          </div>

          <textarea
            id="message-input"
            rows={10}
            placeholder="Tulis isi email di sini..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-[13px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed transition-all text-slate-800 font-sans"
          />
        </div>

        {/* Company Profile PDF Management & Upload Column */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-4 rounded-xl border transition-all ${
            isDragging
              ? 'bg-blue-50/90 border-2 border-dashed border-blue-500 shadow-md ring-2 ring-blue-300'
              : includeCompanyProfile
              ? customCompanyProfile
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 shadow-xs'
                : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-blue-200 shadow-xs'
              : 'bg-slate-50 border-slate-200 opacity-80'
          }`}
        >
          {/* Hidden File Input for PDF Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Top Bar: Checkbox & Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="include-company-profile"
                checked={includeCompanyProfile}
                onChange={e => setIncludeCompanyProfile(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="include-company-profile"
                className="text-xs font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Lampirkan Company Profile (PDF) dalam Email</span>
              </label>
            </div>

            <div>
              {customCompanyProfile ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  FILE ASLI PENGGUNA TERPASANG
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                  STANDAR RESMI PT RADCOM (18 HALAMAN)
                </span>
              )}
            </div>
          </div>

          {/* Body Section */}
          {customCompanyProfile ? (
            /* Uploaded Custom Company Profile View */
            <div className="bg-white/90 border border-emerald-200 rounded-xl p-3.5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs font-extrabold text-sm">
                    PDF
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900 break-all">
                        {customCompanyProfile.filename}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {customCompanyProfile.sizeFormatted}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      ✓ Dokumen asli Anda aktif dan akan otomatis dilampirkan ke setiap email penawaran / korespondensi.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onRemoveCustomCompanyProfile}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                  title="Hapus file kustom dan kembali ke default"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons for Custom File */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ganti File PDF Lain</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCustomPdf}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unduh File Asli</span>
                </button>

                <button
                  type="button"
                  onClick={onRemoveCustomCompanyProfile}
                  className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ml-auto cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Gunakan Default Radcom</span>
                </button>
              </div>
            </div>
          ) : (
            /* Default Radcom File View with Interactive Upload Area */
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Saat ini menggunakan file <strong>Company-Profile-PT-Radcom-Solusindo.pdf</strong> (18 halaman lengkap: legalitas PKP, izin dealer resmi HP Supplies Gold, Epson Indonesia & Gear Computer, proyek Kedutaan Arab Saudi & KAI, 50+ rekanan, serta sertifikasi LPSE / PaDi UMKM / SIPLah / LKPP).
              </p>

              {/* Dedicated Upload Dropzone / Button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-900 group-hover:text-blue-700">
                      Klik di Sini atau Tarik & Lepas (Drag & Drop) File Company Profile Asli Anda
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Format dokumen <strong>.PDF</strong> (Maksimal 25 MB). File yang diunggah akan otomatis terlampir di setiap email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Link to inspect default official PDF */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Ingin melihat file profil bawaan PT Radcom?
                </span>
                <a
                  href="/Company-Profile-PT-Radcom-Solusindo.pdf"
                  download="Company-Profile-PT-Radcom-Solusindo.pdf"
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unduh File Bawaan (18 Halaman)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Attached Files List (Attachments Section) */}
        {attachments && attachments.length > 0 && (
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lampiran File ({attachments.length}):</span>
              </span>
              <span className="text-[11px] text-indigo-700">
                Akan otomatis terkirim bersama email
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {attachments.map(att => (
                <div
                  key={att.filename}
                  className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 shadow-xs text-xs"
                >
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {att.filename}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({Math.round(att.content.length / 1024 * 10) / 10 || 1} KB)
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadAttachmentLocally(att)}
                    className="p-1 text-slate-400 hover:text-blue-600"
                    title="Unduh File"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(att.filename)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Hapus Lampiran"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Channel Dispatch Actions */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Kirimkan Melalui:
            </span>
            <span className="text-[11px] text-slate-500">
              Pilih kanal sesuai kenyamanan Anda
            </span>
          </div>

          {/* Primary Sending Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {/* Direct Send via Server / SMTP */}
            <button
              type="button"
              onClick={onSendViaServer}
              disabled={isSendingServer}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSendingServer ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSendingServer ? 'Mengirimkan...' : 'Kirim Langsung (Server)'}</span>
            </button>

            {/* Direct Gmail Web Composer */}
            <button
              type="button"
              onClick={onOpenGmailWeb}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
              title="Buka langsung tab baru di browser Gmail dengan pesan terisi lengkap"
            >
              <Mail className="w-4 h-4" />
              <span>Buka di Gmail Web</span>
            </button>

            {/* Outlook Web Composer */}
            <button
              type="button"
              onClick={onOpenOutlookWeb}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0078d4] hover:bg-[#106ebe] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
              title="Buka tab baru Outlook Web"
            >
              <Mail className="w-4 h-4" />
              <span>Buka di Outlook Web</span>
            </button>

            {/* Mailto / Default Client */}
            <button
              type="button"
              onClick={onOpenMailto}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 text-slate-700 hover:text-blue-900 font-semibold text-xs transition-all cursor-pointer"
              title="Buka aplikasi email desktop default (Apple Mail / Windows Mail / Thunderbird)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Aplikasi Email (Mailto)</span>
            </button>

            {/* WhatsApp Summary */}
            <button
              type="button"
              onClick={onSendWhatsApp}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs transition-all cursor-pointer"
              title="Kirim follow-up ringkas ke WhatsApp customer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Follow-up WhatsApp</span>
            </button>

            {/* Copy Text */}
            <button
              type="button"
              onClick={onCopyText}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Pesan Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Teks Lengkap</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
