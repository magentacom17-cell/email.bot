import React, { useState } from 'react';
import { X, Search, Plus, Trash2, Check, User, Building, Mail, Phone, Tag } from 'lucide-react';
import { CustomerContact } from '../types/index.ts';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: CustomerContact[];
  onSelectContact: (contact: CustomerContact) => void;
  onAddContact: (contact: CustomerContact) => void;
  onDeleteContact: (id: string) => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSelectContact,
  onAddContact,
  onDeleteContact,
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Partial<CustomerContact>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Kontraktor & Proyek',
    notes: '',
  });

  if (!isOpen) return null;

  const filtered = contacts.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;

    onAddContact({
      id: 'contact_' + Date.now(),
      name: newContact.name || '',
      company: newContact.company || '',
      email: newContact.email || '',
      phone: newContact.phone || '',
      category: newContact.category || 'Umum',
      notes: newContact.notes || '',
    });

    setNewContact({
      name: '',
      company: '',
      email: '',
      phone: '',
      category: 'Kontraktor & Proyek',
      notes: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Buku Kontak Customer / Klien</span>
            </h3>
            <p className="text-xs text-blue-200/80">
              Pilih kontak untuk mengisi email target, nama PIC, dan perusahaan dalam 1 klik
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Tutup Form' : 'Tambah Kontak Baru'}</span>
          </button>
        </div>

        {/* Add Contact Form Tray */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-blue-50/70 border-b border-blue-200 text-xs space-y-3">
            <div className="font-bold text-blue-900 text-xs">Tambah Data PIC / Customer Baru:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Nama PIC (Contoh: Bapak Hendra Gunawan)"
                value={newContact.name}
                onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nama Perusahaan (Contoh: PT Surya Citra Mandiri)"
                value={newContact.company}
                onChange={e => setNewContact({ ...newContact, company: e.target.value })}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                required
                placeholder="Email (hendra@suryacitra.co.id)"
                value={newContact.email}
                onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="No WhatsApp / HP (Opsional)"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Kategori (Misal: Kontraktor MEP / Purchasing)"
                value={newContact.category}
                onChange={e => setNewContact({ ...newContact, category: e.target.value })}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
              >
                Simpan ke Buku Kontak
              </button>
            </div>
          </form>
        )}

        {/* Contacts List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[420px]">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada kontak yang cocok dengan pencarian "{search}".
            </div>
          ) : (
            filtered.map(contact => (
              <div
                key={contact.id}
                className="group p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {contact.name}
                    </span>
                    {contact.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {contact.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="font-medium text-blue-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {contact.company || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="hidden sm:flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                  {contact.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Catatan: {contact.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectContact(contact);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Pilih Kontak</span>
                  </button>
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Kontak"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex justify-between items-center">
          <span>Total {contacts.length} kontak tersimpan</span>
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
