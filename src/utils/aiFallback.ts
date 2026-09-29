/**
 * Client-side smart copywriting fallback for static cloud deployments (e.g. Cloudflare Pages)
 * Ensures intelligent email composition works instantly even without an active backend server.
 */
export function generateEmailLocally(
  text: string,
  type: string,
  customer: string = '',
  company: string = '',
  extraNotes: string = ''
): string {
  const targetName = customer ? `Bapak/Ibu ${customer}` : 'Bapak/Ibu';
  const targetComp = company ? ` di ${company}` : '';
  const notesClause = extraNotes ? `\n\nCatatan Khusus: ${extraNotes}` : '';

  if (type === 'formal') {
    return `Yth. ${targetName}${targetComp},

Semoga Bapak/Ibu senantiasa dalam keadaan sehat dan sukses selalu.

Menindaklanjuti komunikasi kami sebelumnya dari PT Radcom Solusindo Informatika, perkenankan kami menyampaikan kembali komitmen kami sebagai partner pengadaan terpercaya untuk kebutuhan electrical, IT & networking, safety equipment, CCTV, dan perlengkapan operasional perusahaan Bapak/Ibu.

Kami siap memberikan konsultasi spesifikasi teknis, harga kompetitif, serta jaminan ketersediaan barang yang sesuai dengan standar proyek Anda.

Besar harapan kami untuk dapat berdiskusi lebih lanjut dan menjalin kemitraan kerja sama yang saling menguntungkan. Apabila terdapat daftar kebutuhan (BOM / inquiry) yang sedang diproses, silakan menginformasikan kepada kami agar dapat segera kami buatkan penawaran harga terbaik.${notesClause}

Demikian kami sampaikan. Atas perhatian dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.

Hormat kami,
PT Radcom Solusindo Informatika`;
  }

  if (type === 'concise') {
    return `Yth. ${targetName}${targetComp},

Salam hangat dari PT Radcom Solusindo Informatika.

Kami siap mendukung kebutuhan pengadaan perusahaan Bapak/Ibu dengan keunggulan:
1. Harga langsung distributor & bersaing
2. Garansi resmi prinsipal dan legalitas pengadaan lengkap (LKPP, LPSE, SIPLah, PaDi UMKM)
3. Ketersediaan stok ready & pengiriman tepat waktu

Mohon kiranya dapat menginformasikan rincian item (BOM/BoQ) yang sedang dibutuhkan agar dapat kami berikan penawaran harga resmi hari ini.${notesClause}

Terima kasih atas perhatian dan kerja samanya.

Salam,
PT Radcom Solusindo Informatika`;
  }

  if (type === 'urgent_followup') {
    return `Yth. ${targetName}${targetComp},

Salam hangat dari PT Radcom Solusindo Informatika.

Izin konfirmasi singkat terkait penawaran harga pengadaan yang telah kami kirimkan sebelumnya. Kami ingin memastikan apakah draft spesifikasi dan estimasi harga sudah sesuai dengan kebutuhan proyek Bapak/Ibu saat ini.

Apabila ada penyesuaian anggaran, substitusi merek/tipe, atau jadwal pengiriman tertentu yang ditargetkan, tim kami siap membantu melakukan revisi penawaran secepatnya hari ini.${notesClause}

Terima kasih banyak atas waktu dan kerja sama Bapak/Ibu.

Salam,
PT Radcom Solusindo Informatika`;
  }

  if (type === 'focus_cctv_it') {
    return `Yth. ${targetName}${targetComp},

Semoga Bapak/Ibu senantiasa sukses dalam setiap aktivitas.

PT Radcom Solusindo Informatika adalah penyedia solusi terintegrasi untuk kebutuhan IT & Security System, meliputi:
- CCTV IP Camera, NVR & Video Management System (Hikvision, Dahua, Uniview)
- Networking Infrastructure (Switch Manageable, Router, Access Point Aruba, Cisco, Ruijie)
- Server, Storage, UPS & Rack Cabinet (APC, Schneider, Dell, HP)
- Jasa instalasi kabel UTP/Fiber Optic & konfigurasi jaringan

Kami siap melakukan survey lokasi dan memberikan rekomendasi spesifikasi teknis optimal sesuai anggaran Bapak/Ibu.${notesClause}

Katalog dan profil perusahaan terlampir untuk referensi. Kami nantikan kabar baik kerja sama dari Bapak/Ibu.

Hormat kami,
PT Radcom Solusindo Informatika`;
  }

  if (type === 'focus_electrical') {
    return `Yth. ${targetName}${targetComp},

Semoga Bapak/Ibu dalam keadaan sehat dan lancar dalam menjalankan operasional perusahaan.

Melalui surat ini, PT Radcom Solusindo Informatika bermaksud memperkenalkan kapabilitas kami dalam penyediaan kebutuhan Electrical & Panel System industri:
- Kabel Power & Kontrol (Supreme, Kabelindo, Kabelmetal, Jembo)
- Circuit Breaker MCB, MCCB, ACB & Kontaktor (Schneider, ABB, Chint)
- Komponen Panel Distribusi, Busbar, Trafo, dan Genset
- Material grounding & penangkal petir

Seluruh produk yang kami suplai memiliki sertifikat SNI dan garansi resmi. Kami siap memberikan penawaran harga khusus kontraktor / industri.${notesClause}

Terima kasih atas perhatian Bapak/Ibu.

Salam hormat,
PT Radcom Solusindo Informatika`;
  }

  if (type === 'focus_safety') {
    return `Yth. ${targetName}${targetComp},

Salam keselamatan kerja (K3) dari PT Radcom Solusindo Informatika.

Kami siap menyuplai perlengkapan Alat Pelindung Diri (APD) dan keselamatan industri standar K3 nasional maupun internasional untuk menunjang operasional ${company || 'perusahaan Bapak/Ibu'}:
- Sepatu Safety standar EN ISO & SNI (Kings, Cheetah, Krushers)
- Helm Proyek SNI, Rompi Safety Reflektor, Kacamata Safety
- Sarung Tangan Industri (Chemical, Cut-resistant, Leather)
- Tabung Pemadam Api (APAR), Safety Sign & Spill Kit

Stok ready dengan harga grosir untuk kebutuhan reguler pabrik atau proyek kontraktor.${notesClause}

Silakan kirimkan daftar kebutuhan APD Anda untuk kami kalkulasikan penawaran terbaik.

Hormat kami,
PT Radcom Solusindo Informatika`;
  }

  return (text || '').trim() + (notesClause ? `\n\n${notesClause}` : '') + `\n\nApabila Bapak/Ibu membutuhkan sampel produk atau survey teknis gratis, tim spesialis PT Radcom Solusindo Informatika siap berkoordinasi langsung.`;
}
