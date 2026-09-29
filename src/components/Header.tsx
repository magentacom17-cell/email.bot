import React from 'react';
import { Send, Settings, UserCheck, BookOpen, Clock, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { SenderProfile, SmtpConfig } from '../types/index.ts';
import { RadcomLogo } from './RadcomLogo.tsx';
import headerLogoImg from '../assets/images/regenerated_image_1790668897185.jpg';

interface HeaderProps {
  senderProfile: SenderProfile;
  smtpConfig: SmtpConfig;
  contactsCount: number;
  historyCount: number;
  onOpenSmtp: () => void;
  onOpenProfile: () => void;
  onOpenContacts: () => void;
  onOpenHistory: () => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  senderProfile,
  smtpConfig,
  contactsCount,
  historyCount,
  onOpenSmtp,
  onOpenProfile,
  onOpenContacts,
  onOpenHistory,
  onOpenAi,
}) => {
  const isSmtpConfigured = smtpConfig.host && smtpConfig.user && smtpConfig.pass;

  return (
    <header className="bg-gradient-to-r from-[#08132e] via-[#0c2354] to-[#123d87] text-white shadow-xl border-b border-blue-900/40 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <RadcomLogo src={headerLogoImg} className="w-11 h-11" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-wider">
                RAD<span className="text-blue-400">COM</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                PRO WORKSPACE
              </span>
            </div>
            <p className="text-xs text-blue-200/80 font-medium">
              PT Radcom Solusindo Informatika · Email & Procurement Dispatch
            </p>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex items-center flex-wrap gap-2">
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30 transition-all shadow-sm"
            title="Asisten AI Penulis & Pemoles Email"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden md:inline">Asisten AI</span>
          </button>

          {/* Contacts Address Book */}
          <button
            onClick={onOpenContacts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 transition-colors"
            title="Buku Kontak Customer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-300" />
            <span>Kontak</span>
            {contactsCount > 0 && (
              <span className="bg-blue-500/80 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {contactsCount}
              </span>
            )}
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 transition-colors"
            title="Riwayat Pengiriman Email"
          >
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>Riwayat</span>
            {historyCount > 0 && (
              <span className="bg-indigo-500/80 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* SMTP Settings */}
          <button
            onClick={onOpenSmtp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSmtpConfigured
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/15'
            }`}
            title="Konfigurasi Server SMTP Email"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SMTP:</span>
            <span className="font-bold text-[11px]">
              {isSmtpConfigured ? 'Aktif' : 'Sandbox (Uji Coba)'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSmtpConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Sales Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 transition-colors text-xs"
            title="Ubah Profil Sales & Signature"
          >
            <div className="w-6 h-6 rounded-full bg-blue-400 text-blue-950 font-bold flex items-center justify-center text-[11px]">
              {senderProfile.name ? senderProfile.name.charAt(0) : 'S'}
            </div>
            <span className="font-semibold text-slate-100 max-w-[100px] truncate">
              {senderProfile.name.split(' ')[0]}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
