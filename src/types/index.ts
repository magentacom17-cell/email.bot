export interface EmailTemplate {
  id: string;
  name: string;
  category: 'perkenalan' | 'penawaran' | 'followup' | 'operasional' | 'kustom';
  subject: string;
  body: string;
  description: string;
  badge?: string;
}

export interface SenderProfile {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  tagline: string;
}

export interface CustomerContact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  notes?: string;
  category?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  enabled: boolean;
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface CompanyProfileAttachment {
  filename: string;
  sizeFormatted: string;
  base64: string;
  isCustom: boolean;
  uploadedAt?: string;
}

export interface EmailHistoryItem {
  id: string;
  timestamp: string;
  to: string;
  recipientName: string;
  company: string;
  subject: string;
  channel: 'server' | 'gmail' | 'outlook' | 'mailto' | 'whatsapp' | 'copied';
  status: 'sent' | 'opened' | 'copied' | 'sandbox';
  previewUrl?: string;
  messageSnippet: string;
}
