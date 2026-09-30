import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer, { SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateCompanyProfilePdf } from './server/generateCompanyProfilePdf.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Company Profile PDF Download / Stream Endpoint
app.get('/api/company-profile-pdf', async (_req: Request, res: Response): Promise<void> => {
  try {
    const pdfBuffer = await generateCompanyProfilePdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Company-Profile-PT-Radcom-Solusindo.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating company profile PDF:', error);
    res.status(500).json({ success: false, error: 'Gagal membuat file Company Profile PDF' });
  }
});

// Send Email Route
app.post('/api/send-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      senderName,
      smtp,
      attachments,
      includeCompanyProfile = true,
      customCompanyProfile,
    } = req.body;

    if (!to) {
      res.status(400).json({ success: false, error: 'Email tujuan (to) wajib diisi' });
      return;
    }

    let transporter;
    let fromAddress = senderName 
      ? `"${senderName}" <info@radcomsolusindo.com>`
      : '"PT Radcom Solusindo Informatika" <info@radcomsolusindo.com>';
    let isSandbox = false;

    // Check if custom SMTP provided by client
    if (smtp && smtp.host && smtp.user && smtp.pass) {
      transporter = nodemailer.createTransport({
        host: smtp.host,
        port: Number(smtp.port) || 465,
        secure: smtp.secure !== undefined ? Boolean(smtp.secure) : (Number(smtp.port) === 465),
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });
      fromAddress = smtp.from || `"${senderName || 'PT Radcom Solusindo Informatika'}" <${smtp.user}>`;
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use server env SMTP
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      fromAddress = process.env.SMTP_FROM || `"${senderName || 'PT Radcom Solusindo Informatika'}" <${process.env.SMTP_USER}>`;
    } else {
      // Use Ethereal test sandbox account so emails can be tested immediately with real preview
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      fromAddress = `"${senderName || 'PT Radcom Solusindo Informatika'}" <${testAccount.user}>`;
      isSandbox = true;
    }

    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to,
      subject: subject || '(Tanpa Subject) - PT Radcom Solusindo Informatika',
      text: text || '',
      html: html || undefined,
      attachments: [],
    };

    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;

    // Add user provided attachments (e.g. Quotation breakdown / BOQ)
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      for (const att of attachments) {
        mailOptions.attachments!.push({
          filename: att.filename || 'lampiran.txt',
          content: att.content,
          contentType: att.contentType || 'text/plain',
          encoding: att.encoding || undefined,
        });
      }
    }

    // Automatically attach Company Profile PDF (as requested)
    if (includeCompanyProfile !== false) {
      if (customCompanyProfile && customCompanyProfile.base64) {
        // User uploaded custom original company profile
        try {
          const fileBuffer = Buffer.from(customCompanyProfile.base64, 'base64');
          mailOptions.attachments!.push({
            filename: customCompanyProfile.filename || 'Company-Profile-PT-Radcom-Solusindo.pdf',
            content: fileBuffer,
            contentType: 'application/pdf',
          });
        } catch (customErr) {
          console.error('Error attaching custom company profile:', customErr);
        }
      } else {
        // Default official 18-page Company Profile
        try {
          const companyProfilePdfBuffer = await generateCompanyProfilePdf();
          mailOptions.attachments!.push({
            filename: 'Company-Profile-PT-Radcom-Solusindo.pdf',
            content: companyProfilePdfBuffer,
            contentType: 'application/pdf',
          });
        } catch (pdfErr) {
          console.warn('Could not generate company profile PDF, proceeding without it:', pdfErr);
        }
      }
    }

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = isSandbox ? nodemailer.getTestMessageUrl(info) : null;

    res.json({
      success: true,
      messageId: info.messageId,
      previewUrl,
      isSandbox,
      hasCompanyProfilePdf: includeCompanyProfile !== false,
      timestamp: new Date().toISOString(),
      recipient: to,
    });
  } catch (error: any) {
    console.error('Send mail error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengirim email melalui server SMTP',
    });
  }
});

// Verify SMTP connection
app.post('/api/verify-smtp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { host, port, secure, user, pass } = req.body;
    if (!host || !user || !pass) {
      res.status(400).json({ success: false, error: 'Host, username, dan password wajib diisi' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 465,
      secure: secure !== undefined ? Boolean(secure) : (Number(port) === 465),
      auth: { user, pass },
      connectionTimeout: 8000,
    });

    await transporter.verify();
    res.json({ success: true, message: 'Koneksi ke server SMTP berhasil!' });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Koneksi ke server SMTP gagal. Periksa konfigurasi dan kredensial Anda.',
    });
  }
});

// AI Polish & Generation Route
app.post('/api/ai-polish', async (req: Request, res: Response): Promise<void> => {
  try {
    const { promptType, currentBody, customerName, companyName, tone, extraNotes } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Local fallback enhancement
      const enhanced = enhanceEmailLocally(currentBody, promptType, customerName, companyName);
      res.json({ success: true, text: enhanced, source: 'rule-based' });
      return;
    }

    const ai = new GoogleGenAI();
    const systemInstruction = `Anda adalah asisten komunikasi B2B senior untuk PT Radcom Solusindo Informatika (supplier dan partner pengadaan perlengkapan industri, electrical, IT & networking, CCTV, AC, safety equipment, dan perkantoran).
Tugas Anda adalah menulis atau menyempurnakan draft email penawaran / follow up dalam bahasa Indonesia yang sangat sopan, profesional, terstruktur, dan persuasif tanpa terkesan memaksa.
Gunakan placeholder [Nama] dan [Perusahaan] jika diperlukan.
Jangan sertakan markdown pembuka/penutup seperti \`\`\`markdown atau ucapan basa-basi santai. Kembalikan langsung teks email yang siap dikirim.`;

    const userPrompt = `
Kebutuhan: ${promptType || 'Sempurnakan teks email'}
Penerima: ${customerName || 'Bapak/Ibu'}
Perusahaan: ${companyName || 'Perusahaan'}
Tone: ${tone || 'Profesional & Ramah'}
Catatan Tambahan: ${extraNotes || '-'}

Teks draft saat ini:
"${currentBody || ''}"

Tolong tuliskan draft email yang rapi, profesional, dan meyakinkan. Sertakan salam pembuka resmi, perkenalan singkat PT Radcom Solusindo Informatika jika relevan, inti pesan, dan penutup ramah.`;

    let reply = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      reply = response.text || '';
    } catch (modelErr: any) {
      console.warn('Gemini API call skipped or quota limited, using smart local generator.');
    }

    if (reply && reply.trim()) {
      res.json({ success: true, text: reply.trim(), source: 'gemini' });
    } else {
      const fallbackText = enhanceEmailLocally(req.body.currentBody, req.body.promptType, req.body.customerName, req.body.companyName);
      res.json({ success: true, text: fallbackText, source: 'fallback' });
    }
  } catch (error: any) {
    // Graceful fallback without 500 error
    const fallbackText = enhanceEmailLocally(req.body?.currentBody, req.body?.promptType, req.body?.customerName, req.body?.companyName);
    res.json({ success: true, text: fallbackText, source: 'fallback' });
  }
});

function enhanceEmailLocally(text: string, type: string, customer: string = '', company: string = ''): string {
  const targetName = customer ? `Bapak/Ibu ${customer}` : 'Bapak/Ibu';
  const targetComp = company ? ` di ${company}` : '';

  if (type === 'formal') {
    return `Yth. ${targetName}${targetComp},\n\nSemoga Bapak/Ibu senantiasa dalam keadaan sehat dan sukses selalu.\n\nMenindaklanjuti komunikasi kami sebelumnya dari PT Radcom Solusindo Informatika, perkenankan kami menyampaikan kembali komitmen kami sebagai partner pengadaan terpercaya untuk kebutuhan electrical, IT & networking, safety equipment, CCTV, dan perlengkapan operasional perusahaan Bapak/Ibu.\n\nKami siap memberikan konsultasi spesifikasi teknis, harga kompetitif, serta jaminan ketersediaan barang yang sesuai dengan standar proyek Anda.\n\nBesar harapan kami untuk dapat berdiskusi lebih lanjut dan menjalin kemitraan kerja sama yang saling menguntungkan. Apabila terdapat daftar kebutuhan (BOM / inquiry) yang sedang diproses, silakan menginformasikan kepada kami.\n\nDemikian kami sampaikan. Atas perhatian dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.\n\nHormat kami,\nPT Radcom Solusindo Informatika`;
  }

  if (type === 'urgent_followup') {
    return `Yth. ${targetName}${targetComp},\n\nSalam hangat dari PT Radcom Solusindo Informatika.\n\nIzin konfirmasi singkat terkait penawaran harga pengadaan yang telah kami kirimkan sebelumnya. Kami ingin memastikan apakah draft spesifikasi dan estimasi harga sudah sesuai dengan kebutuhan proyek Bapak/Ibu saat ini.\n\nApabila ada penyesuaian anggaran, substitusi merek/tipe, atau jadwal pengiriman tertentu yang ditargetkan, tim kami siap membantu melakukan revisi penawaran secepatnya hari ini.\n\nTerima kasih banyak atas waktu dan kerja sama Bapak/Ibu.\n\nSalam,\nPT Radcom Solusindo Informatika`;
  }

  return (text || '').trim() + `\n\nApabila Bapak/Ibu membutuhkan sampel produk atau survey teknis gratis, tim spesialis PT Radcom Solusindo Informatika siap berkoordinasi langsung.`;
}

// Start Express Server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RADCOM Email Workspace running at http://localhost:${PORT}`);
  });
}

startServer();
