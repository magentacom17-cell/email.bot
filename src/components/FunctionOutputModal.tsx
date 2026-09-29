import React, { useState } from 'react';
import { X, FileText, Paperclip, Check, Download, Plus, Trash2, Calculator, ArrowRight } from 'lucide-react';
import { EmailAttachment, SenderProfile } from '../types/index.ts';

interface QuotationItem {
  id: string;
  name: string;
  spec: string;
  qty: number;
  unit: string;
  price: number;
}

interface FunctionOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  companyName: string;
  senderProfile: SenderProfile;
  onIncludeAsText: (generatedText: string) => void;
  onIncludeAsAttachment: (attachment: EmailAttachment, summaryText?: string) => void;
  onIncludeBoth: (summaryText: string, attachment: EmailAttachment) => void;
}

export const FunctionOutputModal: React.FC<FunctionOutputModalProps> = ({
  isOpen,
  onClose,
  customerName,
  companyName,
  senderProfile,
  onIncludeAsText,
  onIncludeAsAttachment,
  onIncludeBoth,
}) => {
  const [docType, setDocType] = useState<'quotation' | 'survey' | 'custom'>('quotation');
  const [quoteNumber, setQuoteNumber] = useState(`RAD/Q/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`);
  const [includeTax, setIncludeTax] = useState(true);
  const [terms, setTerms] = useState('Pembayaran 14 hari setelah barang diterima (TOP 14 Days). Garansi resmi 1 tahun.');

  // Default quotation items
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: '1',
      name: 'IP Camera Hikvision 4MP DarkFighter',
      spec: 'DS-2CD2143G2-I, PoE, Smart IR 30m, IP67 Metal',
      qty: 8,
      unit: 'Unit',
      price: 1150000,
    },
    {
      id: '2',
      name: 'NVR Hikvision 16 Channel 4K',
      spec: 'DS-7616NI-Q2, 2 SATA Slot up to 16TB, H.265+',
      qty: 1,
      unit: 'Unit',
      price: 2450000,
    },
    {
      id: '3',
      name: 'Switch Managed 24 Port Gigabit PoE+',
      spec: 'Ubiquiti UniFi USW-24-PoE Gen2, 95W Total PoE',
      qty: 1,
      unit: 'Unit',
      price: 6850000,
    },
    {
      id: '4',
      name: 'Kabel UTP Cat6 Original Roll 305m',
      spec: 'Belden USA 100% Tembaga Murni murni Fluke Pass',
      qty: 2,
      unit: 'Roll',
      price: 2200000,
    },
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems([
      ...items,
      {
        id: 'item_' + Date.now(),
        name: 'Item Baru',
        spec: 'Spesifikasi teknis',
        qty: 1,
        unit: 'Unit',
        price: 500000,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const subtotal = items.reduce((acc, it) => acc + (it.qty * it.price), 0);
  const tax = includeTax ? Math.round(subtotal * 0.11) : 0;
  const grandTotal = subtotal + tax;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Generate Document Output Text
  const generateFunctionOutput = (): string => {
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let out = `========================================================================\n`;
    out += `                PT RADCOM SOLUSINDO INFORMATIKA\n`;
    out += `      Supplier & Pengadaan IT, Electrical, CCTV, HVAC & Safety K3\n`;
    out += `        ${senderProfile.address} | Telp: ${senderProfile.phone}\n`;
    out += `========================================================================\n\n`;
    out += `SURAT RINCIAN PENAWARAN HARGA (OFFICIAL QUOTATION)\n`;
    out += `Nomor Penawaran : ${quoteNumber}\n`;
    out += `Tanggal         : ${dateStr}\n`;
    out += `Ditujukan Kepada: ${customerName || 'Bapak/Ibu Pimpinan'}\n`;
    out += `Perusahaan      : ${companyName || 'Perusahaan Klien'}\n`;
    out += `Diterbitkan Oleh: ${senderProfile.name} (${senderProfile.phone})\n\n`;
    out += `------------------------------------------------------------------------\n`;
    out += `NO | NAMA & SPESIFIKASI BARANG             | QTY | HARGA SATUAN | TOTAL\n`;
    out += `------------------------------------------------------------------------\n`;

    items.forEach((it, idx) => {
      const lineTotal = it.qty * it.price;
      out += `${String(idx + 1).padEnd(2)} | ${it.name}\n`;
      out += `   | Spek: ${it.spec}\n`;
      out += `   | ${it.qty} ${it.unit} x ${formatRupiah(it.price)} = ${formatRupiah(lineTotal)}\n`;
      out += `------------------------------------------------------------------------\n`;
    });

    out += `SUBTOTAL                        : ${formatRupiah(subtotal)}\n`;
    if (includeTax) {
      out += `PPN (11%)                       : ${formatRupiah(tax)}\n`;
    }
    out += `GRAND TOTAL ESTIMASI            : ${formatRupiah(grandTotal)}\n`;
    out += `========================================================================\n\n`;
    out += `KETENTUAN & SYARAT:\n`;
    out += `1. ${terms}\n`;
    out += `2. Masa berlaku penawaran 14 hari kerja.\n`;
    out += `3. Ketersediaan stok dapat berubah sewaktu-waktu sebelum PO resmi diterbitkan.\n\n`;
    out += `Hormat kami,\n${senderProfile.name}\n${senderProfile.company}\n`;

    return out;
  };

  const outputContent = generateFunctionOutput();

  const handleApplyAsText = () => {
    onIncludeAsText(outputContent);
    onClose();
  };

  const handleApplyAsAttachment = () => {
    const filename = `Penawaran-PT-Radcom-${quoteNumber.replace(/[\/\\]/g, '-')}.txt`;
    const attachment: EmailAttachment = {
      filename,
      content: outputContent,
      contentType: 'text/plain',
    };
    onIncludeAsAttachment(attachment, `Terlampir rincian penawaran resmi (${filename}) dengan total estimasi ${formatRupiah(grandTotal)}.`);
    onClose();
  };

  const handleApplyBoth = () => {
    const filename = `Penawaran-PT-Radcom-${quoteNumber.replace(/[\/\\]/g, '-')}.txt`;
    const attachment: EmailAttachment = {
      filename,
      content: outputContent,
      contentType: 'text/plain',
    };
    const summary = `Berikut kami sampaikan ringkasan penawaran untuk ${companyName || 'Bapak/Ibu'}:\n• Total Item: ${items.length} item kebutuhan\n• Estimasi Nilai: ${formatRupiah(grandTotal)} (Termasuk PPN)\n• Detail spesifikasi lengkap terlampir pada file ${filename}.\n\nMohon berkenan memeriksa lampiran dokumen tersebut.`;
    onIncludeBoth(summary, attachment);
    onClose();
  };

  const downloadFileLocally = () => {
    const filename = `Penawaran-PT-Radcom-${quoteNumber.replace(/[\/\\]/g, '-')}.txt`;
    const blob = new Blob([outputContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/30 border border-blue-400/30">
              <Calculator className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Generator Output Penawaran & Dokumen Pengadaan</h3>
              <p className="text-xs text-blue-200/80">
                Buat tabel rincian harga/output fungsi dan sertakan ke email sebagai teks atau lampiran
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                No. Penawaran
              </label>
              <input
                type="text"
                value={quoteNumber}
                onChange={e => setQuoteNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Customer / PIC
              </label>
              <input
                type="text"
                disabled
                value={customerName || 'Bapak/Ibu Pimpinan'}
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Perusahaan
              </label>
              <input
                type="text"
                disabled
                value={companyName || 'Perusahaan Klien'}
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-xs">
                Daftar Item Kebutuhan (Bill of Quantities):
              </span>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Baris</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-blue-900 w-5">#{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Nama Barang"
                      value={it.name}
                      onChange={e => updateItem(it.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      disabled={items.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Spesifikasi teknis / tipe / brand"
                        value={it.spec}
                        onChange={e => updateItem(it.id, 'spec', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-slate-600 text-[11px]"
                      />
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.qty}
                        onChange={e => updateItem(it.id, 'qty', Math.max(1, Number(e.target.value)))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-slate-800 text-center"
                      />
                      <input
                        type="text"
                        placeholder="Satuan (Unit/Roll)"
                        value={it.unit}
                        onChange={e => updateItem(it.id, 'unit', e.target.value)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-slate-800 text-center"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Harga Satuan"
                        value={it.price}
                        onChange={e => updateItem(it.id, 'price', Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-slate-800 text-right font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Tax */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inc-tax"
                checked={includeTax}
                onChange={e => setIncludeTax(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="inc-tax" className="font-semibold text-slate-700 cursor-pointer text-xs">
                Termasuk PPN 11% (Faktur Pajak Resmi)
              </label>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-slate-500 text-[11px]">
                Subtotal: {formatRupiah(subtotal)} {includeTax ? `+ PPN ${formatRupiah(tax)}` : ''}
              </div>
              <div className="text-base font-extrabold text-blue-900 font-mono">
                Total: {formatRupiah(grandTotal)}
              </div>
            </div>
          </div>

          {/* Live Output Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 text-xs">
                Pratinjau Output Dokumen Teks:
              </span>
              <button
                type="button"
                onClick={downloadFileLocally}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                <span>Unduh File (.txt)</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[10px] leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre">
              {outputContent}
            </pre>
          </div>
        </div>

        {/* Choice of Inclusion (Either as Plain Text or Attachment) */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Tutup
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Include as Text in Body */}
            <button
              type="button"
              onClick={handleApplyAsText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-blue-900 font-bold transition-all shadow-xs"
              title="Masukkan seluruh rincian langsung ke dalam kolom teks isi email"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Sertakan sebagai Isi Pesan (Text)</span>
            </button>

            {/* Include as Attachment File */}
            <button
              type="button"
              onClick={handleApplyAsAttachment}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-300 hover:border-indigo-500 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-bold transition-all shadow-xs"
              title="Kaitkan rincian sebagai file lampiran (.txt) saat dikirim"
            >
              <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sertakan sebagai Lampiran File (.txt)</span>
            </button>

            {/* Include Both */}
            <button
              type="button"
              onClick={handleApplyBoth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20"
              title="Sertakan ringkasan di badan email dan kaitkan dokumen lengkap sebagai lampiran"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Keduanya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
