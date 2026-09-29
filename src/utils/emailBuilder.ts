import { SenderProfile } from '../types/index.ts';
import { radcomLogoBase64 } from '../assets/logoBase64.ts';
import { partnersBadgesBase64 } from '../assets/partnersBase64.ts';

export function replaceVariables(
  text: string,
  variables: {
    customerName: string;
    companyName: string;
    senderProfile: SenderProfile;
  }
): string {
  const { customerName, companyName, senderProfile } = variables;

  const resolvedCustomer = customerName.trim() || 'Bapak/Ibu';
  const resolvedCompany = companyName.trim() || 'Perusahaan';

  return text
    .replace(/\[Nama\]/g, resolvedCustomer)
    .replace(/\[Perusahaan\]/g, resolvedCompany)
    .replace(/\[Nama Sales\]/g, senderProfile.name || 'Satria Pratama')
    .replace(/\[Perusahaan Sales\]/g, senderProfile.company || 'PT Radcom Solusindo Informatika')
    .replace(/\[No HP Sales\]/g, senderProfile.phone || '+62 812-3456-7890')
    .replace(/\[Email Sales\]/g, senderProfile.email || 'satria@radcom.co.id');
}

export function buildPlainTextEmail(
  body: string,
  senderProfile: SenderProfile,
  includeCompanyProfile: boolean = true,
  companyProfileFilename?: string
): string {
  const filename = companyProfileFilename || 'Company-Profile-PT-Radcom-Solusindo.pdf';
  const attachmentNote = includeCompanyProfile ? `
[Dokumen Terlampir]:
📎 ${filename} (Company Profile Resmi PT Radcom Solusindo Informatika: Rekanan, Proyek, & Izin Pengadaan LPSE, PaDi UMKM, SIPLah, e-Katalog LKPP)
`.trim() : '';

  const signature = `
Warm Regards,

${senderProfile.name || 'Satria'}
${senderProfile.title || 'Business Representative'}

${senderProfile.company || 'PT Radcom Solusindo Informatika'}
Jl. Mampang Prapatan X No. 36
Mampang, Jakarta 12790

Phone: +62 817-0380-7122  Mobile: +62 817-0380-7122
E-mail: ${senderProfile.email || 'satria@radcomsolusindo.com'}
Visit us at: ${senderProfile.website || 'www.radcomsolusindo.com'}
[Mitra Resmi: PaDi UMKM | SIPLah | LPSE | e-Katalog LKPP]
  `.trim();

  return attachmentNote ? `${body.trim()}\n\n${attachmentNote}\n\n${signature}` : `${body.trim()}\n\n${signature}`;
}

export function buildHtmlEmail(
  body: string,
  subject: string,
  senderProfile: SenderProfile,
  includeCompanyProfile: boolean = true,
  companyProfileFilename?: string
): string {
  const filename = companyProfileFilename || 'Company-Profile-PT-Radcom-Solusindo.pdf';
  // Convert newlines to paragraphs/breaks
  const formattedBody = body
    .split('\n\n')
    .map(paragraph => {
      const lines = paragraph.split('\n').join('<br/>');
      return `<p style="margin: 0 0 16px 0; line-height: 1.68; color: #1e293b; font-size: 15px;">${lines}</p>`;
    })
    .join('');

  const companyProfileCallout = includeCompanyProfile ? `
          <!-- Attached Company Profile PDF Callout -->
          <tr>
            <td style="padding: 0 36px 24px 36px;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="width: 28px; height: 28px; background-color: #22c55e; border-radius: 6px; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px;">
                        📄
                      </div>
                    </td>
                    <td valign="middle" style="padding-left: 10px;">
                      <div style="font-size: 13px; font-weight: 700; color: #166534;">
                        Dokumen Terlampir: ${filename}
                      </div>
                      <div style="font-size: 11px; color: #15803d; margin-top: 2px;">
                        Profil legalitas resmi, portofolio proyek, daftar rekanan, izin dealer, dan sertifikasi pengadaan nasional (LPSE, PaDi UMKM, SIPLah, e-Katalog LKPP).
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 24px 0;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b1736 0%, #123d87 100%); padding: 28px 36px; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                      RAD<span style="color: #60a5fa;">COM</span>
                    </div>
                    <div style="font-size: 12px; color: #cbd5e1; letter-spacing: 0.5px; margin-top: 4px; font-weight: 500;">
                      PT RADCOM SOLUSINDO INFORMATIKA
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(255,255,255,0.12); color: #e2e8f0; font-size: 11px; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);">
                      LPSE • PaDi UMKM • SIPLah • LKPP
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Product Badges Strip -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 10px 36px;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">
                ⚡ Electrical • 🌐 IT & Networking • 📹 CCTV & Security • ❄️ HVAC / AC • 🦺 Safety K3
              </div>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              ${formattedBody}
            </td>
          </tr>

${companyProfileCallout}

          <!-- Signature Section -->
          <tr>
            <td style="padding: 0 36px 32px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #e2e8f0; padding-top: 24px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; color: #475569; margin-bottom: 12px;">
                      Warm Regards
                    </div>
                    <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
                      ${escapeHtml(senderProfile.name || 'Satria')}
                    </div>
                    <div style="font-size: 13px; font-weight: 500; color: #475569; margin-bottom: 12px;">
                      ${escapeHtml(senderProfile.title || 'Business Representative')}
                    </div>

                    <!-- Logo Radcom di bawah Business Representative -->
                    <div style="margin-bottom: 14px;">
                      <div style="display: inline-block; width: 68px; height: 68px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 4px; box-sizing: border-box;">
                        <img src="${radcomLogoBase64}" alt="PT. Radcom Solusindo Informatika" width="60" height="60" style="display: block; width: 60px; height: 60px; object-fit: contain; margin: 0 auto; border: 0;" />
                      </div>
                    </div>

                    <div style="font-size: 14px; font-weight: 700; color: #0e2354; margin-bottom: 4px;">
                      ${escapeHtml(senderProfile.company || 'PT Radcom Solusindo Informatika')}
                    </div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 12px;">
                      Jl. Mampang Prapatan X No. 36<br/>
                      Mampang, Jakarta 12790
                    </div>

                    <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
                      <strong>Phone:</strong> +62 817-0380-7122 &nbsp;&nbsp; <strong>Mobile:</strong> +62 817-0380-7122<br/>
                      <strong>E-mail:</strong> <a href="mailto:${escapeHtml(senderProfile.email || 'satria@radcomsolusindo.com')}" style="color: #1d4ed8; text-decoration: none;">${escapeHtml(senderProfile.email || 'satria@radcomsolusindo.com')}</a><br/>
                      <strong>Visit us at:</strong> <a href="https://${escapeHtml(senderProfile.website || 'www.radcomsolusindo.com')}" style="color: #1d4ed8; text-decoration: none;">${escapeHtml(senderProfile.website || 'www.radcomsolusindo.com')}</a>
                    </div>

                    <!-- Foto SIPLah, PaDi UMKM, LPSE, e-catalogue di bawah Visit us -->
                    <div style="margin-top: 8px;">
                      <img src="${partnersBadgesBase64}" alt="PaDi UMKM, SIPLah, LPSE, e-Katalog LKPP" height="42" style="display: block; height: 42px; width: auto; max-width: 100%; object-fit: contain;" />
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 22px 36px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #cbd5e1; font-weight: 600;">
                PT RADCOM SOLUSINDO INFORMATIKA
              </p>
              <p style="margin: 0 0 8px 0;">
                Kemitraan Terpercaya Pengadaan & Pasokan Kebutuhan Proyek, Pabrik, dan Perkantoran.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 10px;">
                Email ini dikirimkan secara resmi terkait kegiatan komunikasi bisnis & penawaran pengadaan.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[m] || m));
}

// Direct Webmail URLs
export function getGmailWebComposeUrl(to: string, subject: string, body: string, cc: string = '', bcc: string = ''): string {
  let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (cc) url += `&cc=${encodeURIComponent(cc)}`;
  if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
  return url;
}

export function getOutlookWebComposeUrl(to: string, subject: string, body: string, cc: string = ''): string {
  let url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (cc) url += `&cc=${encodeURIComponent(cc)}`;
  return url;
}

export function getMailtoUrl(to: string, subject: string, body: string, cc: string = '', bcc: string = ''): string {
  let url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (cc) url += `&cc=${encodeURIComponent(cc)}`;
  if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
  return url;
}

export function getWhatsAppShareUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const recipient = cleanPhone ? `https://wa.me/${cleanPhone}?text=` : 'https://wa.me/?text=';
  return `${recipient}${encodeURIComponent(text)}`;
}
