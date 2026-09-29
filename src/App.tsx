/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { EmailForm } from './components/EmailForm.tsx';
import { EmailPreviewCard } from './components/EmailPreviewCard.tsx';
import { SmtpModal } from './components/SmtpModal.tsx';
import { SenderProfileModal } from './components/SenderProfileModal.tsx';
import { ContactsModal } from './components/ContactsModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { AiAssistantModal } from './components/AiAssistantModal.tsx';
import { FunctionOutputModal } from './components/FunctionOutputModal.tsx';
import {
  defaultTemplates,
  defaultSenderProfile,
  defaultContacts,
} from './data/defaultTemplates.ts';
import {
  EmailTemplate,
  SenderProfile,
  CustomerContact,
  SmtpConfig,
  EmailHistoryItem,
  EmailAttachment,
  CompanyProfileAttachment,
} from './types/index.ts';
import {
  replaceVariables,
  buildPlainTextEmail,
  buildHtmlEmail,
  getGmailWebComposeUrl,
  getOutlookWebComposeUrl,
  getMailtoUrl,
  getWhatsAppShareUrl,
} from './utils/emailBuilder.ts';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Paperclip,
  Send,
  Zap,
} from 'lucide-react';

export default function App() {
  // Persistent Settings
  const [senderProfile, setSenderProfile] = useState<SenderProfile>(() => {
    try {
      const saved = localStorage.getItem('radcom_sender_profile_v2');
      return saved ? JSON.parse(saved) : defaultSenderProfile;
    } catch {
      return defaultSenderProfile;
    }
  });

  const [contacts, setContacts] = useState<CustomerContact[]>(() => {
    try {
      const saved = localStorage.getItem('radcom_contacts');
      return saved ? JSON.parse(saved) : defaultContacts;
    } catch {
      return defaultContacts;
    }
  });

  const [history, setHistory] = useState<EmailHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('radcom_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('radcom_custom_templates');
      return saved ? JSON.parse(saved) : defaultTemplates;
    } catch {
      return defaultTemplates;
    }
  });

  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(() => {
    try {
      const saved = localStorage.getItem('radcom_smtp_config');
      return saved
        ? JSON.parse(saved)
        : {
            host: '',
            port: 465,
            secure: true,
            user: '',
            pass: '',
            from: '',
            enabled: false,
          };
    } catch {
      return {
        host: '',
        port: 465,
        secure: true,
        user: '',
        pass: '',
        from: '',
        enabled: false,
      };
    }
  });

  // Active Email Form State
  const [to, setTo] = useState('hendra.gunawan@suryacitra.co.id');
  const [customerName, setCustomerName] = useState('Bapak Hendra Gunawan');
  const [companyName, setCompanyName] = useState('PT Surya Citra Mandiri');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('intro');
  const [subject, setSubject] = useState(defaultTemplates[0].subject);
  const [rawTemplateBody, setRawTemplateBody] = useState(defaultTemplates[0].body);
  const [message, setMessage] = useState(() => {
    return replaceVariables(defaultTemplates[0].body, {
      customerName: 'Bapak Hendra Gunawan',
      companyName: 'PT Surya Citra Mandiri',
      senderProfile: defaultSenderProfile,
    });
  });

  // Attachments
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [includeCompanyProfile, setIncludeCompanyProfile] = useState<boolean>(true);
  const [customCompanyProfile, setCustomCompanyProfile] = useState<CompanyProfileAttachment | null>(() => {
    try {
      const saved = localStorage.getItem('radcom_custom_company_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI Modals
  const [isSmtpOpen, setIsSmtpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isFunctionOutputOpen, setIsFunctionOutputOpen] = useState(false);

  // Status & Feedback Banner
  const [isSendingServer, setIsSendingServer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendNotification, setSendNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    previewUrl?: string | null;
  } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('radcom_sender_profile_v2', JSON.stringify(senderProfile));
    } catch (e) {
      console.warn('Could not save sender profile', e);
    }
  }, [senderProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('radcom_contacts', JSON.stringify(contacts));
    } catch (e) {
      console.warn('Could not save contacts', e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('radcom_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('radcom_smtp_config', JSON.stringify(smtpConfig));
    } catch (e) {
      console.warn('Could not save smtp config', e);
    }
  }, [smtpConfig]);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find(t => t.id === templateId);
    if (tmpl) {
      setRawTemplateBody(tmpl.body);
      setSubject(
        replaceVariables(tmpl.subject, {
          customerName,
          companyName,
          senderProfile,
        })
      );
      setMessage(
        replaceVariables(tmpl.body, {
          customerName,
          companyName,
          senderProfile,
        })
      );
    }
  };

  // Resolved message body for live preview & dispatch
  const resolvedBody = replaceVariables(message, {
    customerName,
    companyName,
    senderProfile,
  });

  // Save new custom template
  const handleSaveAsCustomTemplate = () => {
    const name = window.prompt(
      'Nama untuk template kustom baru ini:',
      'Template — ' + (subject.slice(0, 24) || 'Kustom')
    );
    if (!name) return;

    const newTmpl: EmailTemplate = {
      id: 'custom_' + Date.now(),
      name,
      category: 'kustom',
      subject,
      body: message,
      description: 'Template kustom disimpan oleh pengguna',
      badge: 'Kustom',
    };

    const updated = [newTmpl, ...templates];
    setTemplates(updated);
    localStorage.setItem('radcom_custom_templates', JSON.stringify(updated));
    setSelectedTemplateId(newTmpl.id);
    setSendNotification({
      type: 'info',
      title: 'Template Tersimpan',
      message: `Template "${name}" berhasil disimpan ke daftar template Anda.`,
    });
  };

  // Select customer from address book
  const handleSelectContact = (contact: CustomerContact) => {
    setTo(contact.email);
    setCustomerName(contact.name);
    setCompanyName(contact.company);

    // Re-resolve placeholders if message contains them
    setMessage(prev =>
      replaceVariables(prev, {
        customerName: contact.name,
        companyName: contact.company,
        senderProfile,
      })
    );
  };

  const handleAddContact = (newContact: CustomerContact) => {
    setContacts(prev => [newContact, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Upload Custom Original Company Profile
  const handleUploadCompanyProfile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Harap pilih file dokumen berformat PDF.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file PDF maksimal 25 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      const sizeKb = file.size / 1024;
      const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${Math.round(sizeKb)} KB`;
      const newCustomProfile: CompanyProfileAttachment = {
        filename: file.name,
        sizeFormatted,
        base64,
        isCustom: true,
        uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setCustomCompanyProfile(newCustomProfile);
      setIncludeCompanyProfile(true);
      try {
        localStorage.setItem('radcom_custom_company_profile', JSON.stringify(newCustomProfile));
      } catch (err) {
        console.warn('LocalStorage limit for custom company profile:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomCompanyProfile = () => {
    setCustomCompanyProfile(null);
    try {
      localStorage.removeItem('radcom_custom_company_profile');
    } catch (err) {
      console.warn(err);
    }
  };

  // Send Direct via Server / SMTP
  const handleSendViaServer = async () => {
    if (!to.trim()) {
      setSendNotification({
        type: 'error',
        title: 'Email Tujuan Kosong',
        message: 'Mohon masukkan alamat email penerima sebelum mengirim.',
      });
      return;
    }

    setIsSendingServer(true);
    setSendNotification(null);

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

    try {
      const payload: any = {
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject: subject || 'PT Radcom Solusindo Informatika',
        text: plainText,
        html: fullHtml,
        senderName: `${senderProfile.name} | ${senderProfile.company}`,
        attachments: attachments.length > 0 ? attachments : undefined,
        includeCompanyProfile,
        customCompanyProfile: customCompanyProfile ? {
          filename: customCompanyProfile.filename,
          base64: customCompanyProfile.base64,
          contentType: 'application/pdf',
        } : undefined,
      };

      if (smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
        payload.smtp = {
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: smtpConfig.secure,
          user: smtpConfig.user,
          pass: smtpConfig.pass,
          from: smtpConfig.from || undefined,
        };
      }

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Record in history
        const newHistoryItem: EmailHistoryItem = {
          id: 'hist_' + Date.now(),
          timestamp: new Date().toISOString(),
          to,
          recipientName: customerName,
          company: companyName,
          subject,
          channel: 'server',
          status: data.isSandbox ? 'sandbox' : 'sent',
          previewUrl: data.previewUrl,
          messageSnippet: resolvedBody.slice(0, 140) + '...',
        };
        setHistory(prev => [newHistoryItem, ...prev]);

        setSendNotification({
          type: 'success',
          title: data.isSandbox
            ? 'Email & Company Profile (PDF) Berhasil Diproses (Uji Coba Sandbox)'
            : 'Email & Company Profile (PDF) Berhasil Terkirim!',
          message: data.isSandbox
            ? `Email uji coba berhasil dikirimkan ke kotak surat Ethereal bersama lampiran Company-Profile-PT-Radcom-Solusindo.pdf. Anda dapat melihat hasil rendering pengiriman melalui tombol pratinjau di bawah.`
            : `Email resmi PT Radcom Solusindo berhasil dikirimkan ke ${to} beserta lampiran Company Profile (PDF).`,
          previewUrl: data.previewUrl,
        });
      } else {
        setSendNotification({
          type: 'error',
          title: 'Pengiriman Gagal',
          message: data.error || 'Terjadi kesalahan saat memproses pengiriman.',
        });
      }
    } catch (err: any) {
      setSendNotification({
        type: 'error',
        title: 'Pengiriman Server Tidak Tersedia (Mode Cloud Statis)',
        message: 'Endpoint SMTP server tidak terjangkau di hosting statis. Silakan gunakan tombol "Buka di Gmail/Outlook (Mailto)" atau "Salin Template HTML" di kartu pratinjau untuk mengirimkan email langsung dengan format resmi.',
      });
    } finally {
      setIsSendingServer(false);
    }
  };

  // Open Gmail Web
  const handleOpenGmailWeb = () => {
    if (!to.trim()) {
      setSendNotification({
        type: 'error',
        title: 'Email Tujuan Kosong',
        message: 'Mohon masukkan email target terlebih dahulu.',
      });
      return;
    }

    const plainText = buildPlainTextEmail(
      resolvedBody,
      senderProfile,
      includeCompanyProfile,
      customCompanyProfile?.filename
    );
    const url = getGmailWebComposeUrl(to, subject, plainText, cc, bcc);

    // If company profile is enabled, auto-download so user can drag-and-drop to Gmail
    if (includeCompanyProfile) {
      if (customCompanyProfile && customCompanyProfile.base64) {
        try {
          const byteCharacters = atob(customCompanyProfile.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const dlUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = dlUrl;
          a.download = customCompanyProfile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(dlUrl);
        } catch (e) {
          console.error(e);
        }
      } else {
        const a = document.createElement('a');
        a.href = '/Company-Profile-PT-Radcom-Solusindo.pdf';
        a.download = 'Company-Profile-PT-Radcom-Solusindo.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    // If custom attachments exist, auto download so user can drag-and-drop to Gmail
    if (attachments.length > 0) {
      attachments.forEach(att => {
        const blob = new Blob([att.content], { type: att.contentType || 'text/plain;charset=utf-8' });
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = att.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);
      });
    }

    window.open(url, '_blank');

    // Record in history
    setHistory(prev => [
      {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        to,
        recipientName: customerName,
        company: companyName,
        subject,
        channel: 'gmail',
        status: 'opened',
        messageSnippet: resolvedBody.slice(0, 140) + '...',
      },
      ...prev,
    ]);

    setSendNotification({
      type: 'info',
      title: 'Membuka Gmail Web',
      message:
        attachments.length > 0 || includeCompanyProfile
          ? `Membuka tab Gmail Web dengan data terisi. Dokumen Company Profile (${customCompanyProfile ? customCompanyProfile.filename : 'Company-Profile-PT-Radcom-Solusindo.pdf'}) telah diunduh otomatis ke perangkat Anda agar dapat langsung diseret (drag-and-drop) ke email.`
          : `Tab Gmail Web dibuka dengan subject dan isi pesan terisi lengkap.`,
    });
  };

  // Open Outlook Web
  const handleOpenOutlookWeb = () => {
    if (!to.trim()) {
      setSendNotification({
        type: 'error',
        title: 'Email Tujuan Kosong',
        message: 'Mohon masukkan email target terlebih dahulu.',
      });
      return;
    }

    const plainText = buildPlainTextEmail(
      resolvedBody,
      senderProfile,
      includeCompanyProfile,
      customCompanyProfile?.filename
    );
    const url = getOutlookWebComposeUrl(to, subject, plainText, cc);

    if (includeCompanyProfile) {
      if (customCompanyProfile && customCompanyProfile.base64) {
        try {
          const byteCharacters = atob(customCompanyProfile.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const dlUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = dlUrl;
          a.download = customCompanyProfile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(dlUrl);
        } catch (e) {
          console.error(e);
        }
      } else {
        const a = document.createElement('a');
        a.href = '/Company-Profile-PT-Radcom-Solusindo.pdf';
        a.download = 'Company-Profile-PT-Radcom-Solusindo.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    window.open(url, '_blank');

    setHistory(prev => [
      {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        to,
        recipientName: customerName,
        company: companyName,
        subject,
        channel: 'outlook',
        status: 'opened',
        messageSnippet: resolvedBody.slice(0, 140) + '...',
      },
      ...prev,
    ]);
  };

  // Open Mailto
  const handleOpenMailto = () => {
    if (!to.trim()) {
      setSendNotification({
        type: 'error',
        title: 'Email Tujuan Kosong',
        message: 'Mohon masukkan email target terlebih dahulu.',
      });
      return;
    }

    const plainText = buildPlainTextEmail(
      resolvedBody,
      senderProfile,
      includeCompanyProfile,
      customCompanyProfile?.filename
    );
    const url = getMailtoUrl(to, subject, plainText, cc, bcc);
    window.location.href = url;

    setHistory(prev => [
      {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        to,
        recipientName: customerName,
        company: companyName,
        subject,
        channel: 'mailto',
        status: 'opened',
        messageSnippet: resolvedBody.slice(0, 140) + '...',
      },
      ...prev,
    ]);
  };

  // Follow-up via WhatsApp
  const handleSendWhatsApp = () => {
    const waText = `Halo ${customerName || 'Bapak/Ibu'},\n\nSaya ${senderProfile.name} dari ${senderProfile.company}.\nIzin menyampaikan penawaran dan informasi pengadaan terkait:\n*${subject}*\n\nRingkasan:\n${resolvedBody.slice(0, 400)}...\n\nDetail lengkap telah kami siapkan juga via email resmi ke ${to || 'email Anda'}.\nTerima kasih atas kerja samanya.`;
    const targetContact = contacts.find(c => c.email === to || c.name === customerName);
    const phone = targetContact?.phone || '';

    const url = getWhatsAppShareUrl(phone, waText);
    window.open(url, '_blank');

    setHistory(prev => [
      {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        to: phone ? `${to} (WA: ${phone})` : to,
        recipientName: customerName,
        company: companyName,
        subject: `[WhatsApp] ${subject}`,
        channel: 'whatsapp',
        status: 'opened',
        messageSnippet: waText.slice(0, 140) + '...',
      },
      ...prev,
    ]);
  };

  // Copy Plain Text
  const handleCopyText = () => {
    const plainText = buildPlainTextEmail(
      resolvedBody,
      senderProfile,
      includeCompanyProfile,
      customCompanyProfile?.filename
    );
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    setHistory(prev => [
      {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        to,
        recipientName: customerName,
        company: companyName,
        subject,
        channel: 'copied',
        status: 'copied',
        messageSnippet: resolvedBody.slice(0, 140) + '...',
      },
      ...prev,
    ]);
  };

  // Load item from history back into form
  const handleLoadHistoryItem = (item: EmailHistoryItem) => {
    setTo(item.to.split(' ')[0]);
    if (item.recipientName) setCustomerName(item.recipientName);
    if (item.company) setCompanyName(item.company);
    setSubject(item.subject);
    setSendNotification({
      type: 'info',
      title: 'Riwayat Dimuat',
      message: `Pesan kepada "${item.recipientName || item.to}" berhasil dimuat kembali ke editor.`,
    });
  };

  // Attachment handling
  const handleRemoveAttachment = (filename: string) => {
    setAttachments(prev => prev.filter(a => a.filename !== filename));
  };

  // Function Output inclusion handlers
  const handleIncludeFunctionOutputAsText = (text: string) => {
    setMessage(prev => `${prev}\n\n${text}`);
    setSendNotification({
      type: 'info',
      title: 'Rincian Ditambahkan ke Pesan',
      message: 'Tabel rincian penawaran berhasil disertakan langsung ke dalam isi email.',
    });
  };

  const handleIncludeFunctionOutputAsAttachment = (
    attachment: EmailAttachment,
    summaryText?: string
  ) => {
    setAttachments(prev => [...prev.filter(a => a.filename !== attachment.filename), attachment]);
    if (summaryText) {
      setMessage(prev => `${prev}\n\n${summaryText}`);
    }
    setSendNotification({
      type: 'info',
      title: 'Lampiran Ditambahkan',
      message: `File "${attachment.filename}" berhasil dikaitkan sebagai lampiran email.`,
    });
  };

  const handleIncludeFunctionOutputBoth = (
    summaryText: string,
    attachment: EmailAttachment
  ) => {
    setAttachments(prev => [...prev.filter(a => a.filename !== attachment.filename), attachment]);
    setMessage(prev => `${prev}\n\n${summaryText}`);
    setSendNotification({
      type: 'info',
      title: 'Rincian & Lampiran Disertakan',
      message: `Ringkasan telah masuk ke badan email dan file "${attachment.filename}" siap terkirim sebagai lampiran.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header
        senderProfile={senderProfile}
        smtpConfig={smtpConfig}
        contactsCount={contacts.length}
        historyCount={history.length}
        onOpenSmtp={() => setIsSmtpOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenContacts={() => setIsContactsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-4">
        
        {/* Top Notification / Feedback Banner */}
        {sendNotification && (
          <div
            className={`p-4 rounded-2xl border shadow-md flex items-start justify-between gap-3 transition-all ${
              sendNotification.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : sendNotification.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {sendNotification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : sendNotification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">{sendNotification.title}</div>
                <div className="text-xs leading-relaxed text-slate-700">
                  {sendNotification.message}
                </div>
                {sendNotification.previewUrl && (
                  <div className="pt-2">
                    <a
                      href={sendNotification.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka & Lihat Email di Ethereal Sandbox Inbox</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSendNotification(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Feature Highlights & Quick Action Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Hub Pengiriman Email & Penawaran Bisnis
              </div>
              <div className="text-xs text-blue-200/80">
                Pilih apakah rincian penawaran disertakan langsung sebagai teks pesan atau lampiran file (.txt/.pdf).
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFunctionOutputOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Buat Rincian / Lampiran</span>
            </button>
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Poles Teks AI</span>
            </button>
          </div>
        </div>

        {/* Dual-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Editor & Sending Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <EmailForm
              to={to}
              setTo={setTo}
              customerName={customerName}
              setCustomerName={setCustomerName}
              companyName={companyName}
              setCompanyName={setCompanyName}
              cc={cc}
              setCc={setCc}
              bcc={bcc}
              setBcc={setBcc}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleSelectTemplate}
              templates={templates}
              subject={subject}
              setSubject={setSubject}
              message={message}
              setMessage={setMessage}
              attachments={attachments}
              onRemoveAttachment={handleRemoveAttachment}
              onOpenFunctionOutput={() => setIsFunctionOutputOpen(true)}
              includeCompanyProfile={includeCompanyProfile}
              setIncludeCompanyProfile={setIncludeCompanyProfile}
              customCompanyProfile={customCompanyProfile}
              onUploadCompanyProfile={handleUploadCompanyProfile}
              onRemoveCustomCompanyProfile={handleRemoveCustomCompanyProfile}
              senderProfile={senderProfile}
              smtpConfig={smtpConfig}
              onSendViaServer={handleSendViaServer}
              isSendingServer={isSendingServer}
              onOpenGmailWeb={handleOpenGmailWeb}
              onOpenOutlookWeb={handleOpenOutlookWeb}
              onOpenMailto={handleOpenMailto}
              onSendWhatsApp={handleSendWhatsApp}
              onCopyText={handleCopyText}
              copied={copied}
              onOpenAiAssistant={() => setIsAiOpen(true)}
              onOpenContacts={() => setIsContactsOpen(true)}
              onSaveAsCustomTemplate={handleSaveAsCustomTemplate}
            />
          </div>

          {/* Right Column: Live Rendered Email Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <EmailPreviewCard
              to={to}
              customerName={customerName}
              companyName={companyName}
              subject={subject}
              resolvedBody={resolvedBody}
              senderProfile={senderProfile}
              includeCompanyProfile={includeCompanyProfile}
              customCompanyProfile={customCompanyProfile}
              onCopyText={handleCopyText}
              copied={copied}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-center text-xs mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-slate-200">RADCOM</span>
            <span>· PT Radcom Solusindo Informatika</span>
          </div>
          <div>
            Supplier Pengadaan Electrical · IT & Networking · CCTV · AC HVAC · Safety K3
          </div>
          <div className="text-slate-500 text-[11px]">
            Versi Pro · Multi-channel Dispatch Engine
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SmtpModal
        isOpen={isSmtpOpen}
        onClose={() => setIsSmtpOpen(false)}
        config={smtpConfig}
        onSave={newConfig => {
          setSmtpConfig(newConfig);
          setSendNotification({
            type: 'info',
            title: 'Pengaturan SMTP Disimpan',
            message: newConfig.host
              ? `Konfigurasi server ${newConfig.host} berhasil diperbarui.`
              : 'Mode Sandbox Ethereal aktif.',
          });
        }}
      />

      <SenderProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={senderProfile}
        onSave={newProfile => {
          setSenderProfile(newProfile);
          setSendNotification({
            type: 'info',
            title: 'Profil Sales Disimpan',
            message: `Data pengirim atas nama ${newProfile.name} berhasil diperbarui.`,
          });
        }}
      />

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        onSelectContact={handleSelectContact}
        onAddContact={handleAddContact}
        onDeleteContact={handleDeleteContact}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem('radcom_history');
        }}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentBody={message}
        customerName={customerName}
        companyName={companyName}
        onApply={newText => {
          setMessage(newText);
          setSendNotification({
            type: 'info',
            title: 'Teks Dipoles oleh AI',
            message: 'Draft baru dari asisten AI telah diterapkan ke editor email.',
          });
        }}
      />

      <FunctionOutputModal
        isOpen={isFunctionOutputOpen}
        onClose={() => setIsFunctionOutputOpen(false)}
        customerName={customerName}
        companyName={companyName}
        senderProfile={senderProfile}
        onIncludeAsText={handleIncludeFunctionOutputAsText}
        onIncludeAsAttachment={handleIncludeFunctionOutputAsAttachment}
        onIncludeBoth={handleIncludeFunctionOutputBoth}
      />
    </div>
  );
}
