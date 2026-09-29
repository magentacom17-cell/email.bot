import PDFDocument from 'pdfkit';

/**
 * Generates the complete, authentic 18-Page Official Company Profile PDF
 * for PT Radcom Solusindo Informatika without changing any content.
 */
export function generateCompanyProfilePdf(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        info: {
          Title: 'COMPANY PROFILE — PT. RADCOM SOLUSINDO INFORMATIKA',
          Author: 'PT. Radcom Solusindo Informatika',
          Subject: 'Company Profile Resmi & Portofolio Pengadaan',
          Keywords: 'Radcom, Company Profile, IT, CCTV, Electrical, LPSE, PaDi UMKM, SIPLah, e-Katalog LKPP',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));

      // Theme Colors based on original deck
      const navy = '#0c2354';
      const darkNavy = '#071638';
      const gold = '#e69500';
      const lightGold = '#fef3c7';
      const blue = '#1769e0';
      const darkText = '#1e293b';
      const mutedText = '#475569';
      const cardBg = '#f8fafc';
      const borderColor = '#cbd5e1';

      const pageWidth = 595.28;
      const pageHeight = 841.89;

      // Helper for standard page top header
      const renderTopHeader = (title: string, pageNum: number) => {
        doc.rect(0, 0, pageWidth, 60).fill(navy);
        doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text(title, 40, 22);

        // Logo Top Right
        doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('RSI', pageWidth - 100, 16);
        doc.fillColor('#93c5fd').fontSize(7.5).font('Helvetica-Bold').text('RADCOM SOLUSINDO', pageWidth - 100, 34);
        doc.fillColor('#93c5fd').fontSize(7.5).font('Helvetica-Bold').text('INFORMATIKA', pageWidth - 100, 43);

        // Gold divider line
        doc.rect(0, 60, pageWidth, 4).fill(gold);

        // Page Footer
        doc.rect(0, pageHeight - 35, pageWidth, 35).fill('#f1f5f9');
        doc.fillColor(mutedText).fontSize(8).font('Helvetica').text(
          `PT. Radcom Solusindo Informatika — Company Profile`,
          40,
          pageHeight - 22
        );
        doc.fillColor(navy).fontSize(8).font('Helvetica-Bold').text(
          `Halaman ${pageNum} dari 18`,
          pageWidth - 140,
          pageHeight - 22,
          { align: 'right', width: 100 }
        );
      };

      // ==========================================
      // PAGE 1: COVER
      // ==========================================
      doc.rect(0, 0, pageWidth, pageHeight).fill('#ffffff');

      // Top right logo block
      doc.roundedRect(pageWidth - 180, 35, 145, 65, 8).fillAndStroke('#ffffff', '#e2e8f0');
      doc.fillColor(navy).fontSize(34).font('Helvetica-Bold').text('RSI', pageWidth - 165, 42);
      doc.fillColor('#dc2626').fontSize(9).font('Helvetica-Bold').text('R A D C O M', pageWidth - 165, 74);
      doc.fillColor('#dc2626').fontSize(9).font('Helvetica-Bold').text('SOLUSINDO', pageWidth - 165, 84);
      doc.fillColor(navy).fontSize(8).font('Helvetica-Bold').text('INFORMATIKA', pageWidth - 165, 94);

      // Hero Architectural Circular Graphic
      doc.save();
      doc.circle(200, 250, 150).fillAndStroke('#1e293b', navy);
      doc.circle(200, 250, 142).stroke('#64748b');
      // Inner abstract skyscraper styling
      doc.rect(140, 150, 120, 180).fill('#334155');
      doc.rect(170, 120, 60, 210).fill('#475569');
      doc.restore();

      // Gold Arch Curve on right
      doc.save();
      doc.circle(520, 480, 220).fill(gold);
      doc.restore();

      // Company Name Banner
      doc.rect(0, 490, pageWidth, 42).fill(navy);
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(
        'PT. RADCOMSOLUSINDOINFORMATIKA',
        40,
        503,
        { characterSpacing: 1 }
      );

      // Main Big Title
      doc.fillColor(navy).fontSize(44).font('Helvetica-Bold').text('COMPANY', 40, 565);
      doc.fillColor(gold).fontSize(44).font('Helvetica-Bold').text('PROFILE', 40, 615);

      // Bottom Procurement Portal Logos Strip
      doc.rect(0, 755, pageWidth, 86.89).fill('#ffffff');
      doc.rect(0, 755, pageWidth, 2).fill(gold);

      // Badges
      const badgeY = 775;
      // LPSE
      doc.roundedRect(40, badgeY, 95, 36, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#dc2626').fontSize(11).font('Helvetica-Bold').text('● LPSE', 55, badgeY + 11);

      // PaDi UMKM
      doc.roundedRect(155, badgeY, 115, 36, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#0284c7').fontSize(10).font('Helvetica-Bold').text('PaDi UMKM', 170, badgeY + 7);
      doc.fillColor('#64748b').fontSize(7).font('Helvetica').text('Pasar Digital BUMN', 170, badgeY + 21);

      // SIPLah
      doc.roundedRect(290, badgeY, 110, 36, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#ea580c').fontSize(10).font('Helvetica-Bold').text('SIPLah', 305, badgeY + 7);
      doc.fillColor('#64748b').fontSize(7).font('Helvetica').text('Kemendikbudristek', 305, badgeY + 21);

      // e-Katalog LKPP
      doc.roundedRect(420, badgeY, 135, 36, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#dc2626').fontSize(10).font('Helvetica-Bold').text('e-catalogue', 435, badgeY + 7);
      doc.fillColor('#1e3a8a').fontSize(8).font('Helvetica-Bold').text('LKPP', 510, badgeY + 7);
      doc.fillColor('#64748b').fontSize(7).font('Helvetica').text('Pengadaan Pemerintah', 435, badgeY + 21);

      // ==========================================
      // PAGE 2: DAFTAR ISI
      // ==========================================
      doc.addPage();
      renderTopHeader('DAFTAR ISI', 2);

      // Left blue curve
      doc.save();
      doc.circle(0, 420, 220).fill(navy);
      doc.restore();

      // Logo on left
      doc.roundedRect(20, 380, 140, 80, 8).fill('#ffffff');
      doc.fillColor(navy).fontSize(30).font('Helvetica-Bold').text('RSI', 35, 390);
      doc.fillColor('#dc2626').fontSize(8).font('Helvetica-Bold').text('RADCOM SOLUSINDO', 35, 422);
      doc.fillColor(navy).fontSize(8).font('Helvetica-Bold').text('INFORMATIKA', 35, 432);

      // Main Daftar Isi Card
      doc.roundedRect(200, 100, 355, 660, 12).fillAndStroke('#fef3c7', '#fde68a');

      doc.fillColor(navy).fontSize(24).font('Helvetica-Bold').text('DAFTAR ISI', 230, 125);
      doc.rect(230, 158, 60, 4).fill(gold);

      const tableOfContents = [
        { title: 'Cover', page: 'Halaman 1' },
        { title: 'Daftar Isi', page: 'Halaman 2' },
        { title: 'Filosofi (Visi, Misi, & Grand Value)', page: 'Halaman 3' },
        { title: 'Tentang Kami', page: 'Halaman 4' },
        { title: 'Model Bisnis Kami', page: 'Halaman 5' },
        { title: 'Lini Bisnis (Line of Business IT)', page: 'Halaman 6' },
        { title: 'Surat Penunjukan Dealer (HP, Epson, Gear)', page: 'Halaman 7 - 9' },
        { title: 'Daftar Rekanan', page: 'Halaman 10' },
        { title: 'Project Pengadaan & Instalasi', page: 'Halaman 11' },
        { title: 'Dokumentasi Kerjasama & Pengiriman', page: 'Halaman 12 - 17' },
        { title: 'Penutup & Kontak Perusahaan', page: 'Halaman 18' },
      ];

      let tocY = 185;
      tableOfContents.forEach((item, index) => {
        // Node circle
        doc.circle(235, tocY + 8, 5).fill(navy);
        doc.circle(235, tocY + 8, 3).fill(gold);

        doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text(item.title, 255, tocY);
        doc.fillColor(mutedText).fontSize(9).font('Helvetica').text(item.page, 255, tocY + 16);

        doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(255, tocY + 36).lineTo(520, tocY + 36).stroke();
        tocY += 46;
      });

      // ==========================================
      // PAGE 3: FILOSOFI
      // ==========================================
      doc.addPage();
      renderTopHeader('FILOSOFI PERUSAHAAN', 3);

      doc.fillColor(navy).fontSize(28).font('Helvetica-Bold').text('FILOSOFI', 40, 95);
      doc.rect(40, 130, 50, 4).fill(gold);

      // Section: VISI
      doc.roundedRect(40, 155, 515, 110, 10).fillAndStroke(cardBg, borderColor);
      doc.fillColor(gold).fontSize(14).font('Helvetica-Bold').text('((( VISI', 60, 175);
      doc.fillColor(darkText).fontSize(11).font('Helvetica').text(
        'Menjadi Perusahaan pengadaan kebutuhan institusi terlengkap yang dapat mensupport semua kebutuhan kantor dengan service excellent',
        60,
        205,
        { width: 475, lineGap: 4 }
      );

      // Section: MISI
      doc.roundedRect(40, 285, 515, 185, 10).fillAndStroke(cardBg, borderColor);
      doc.fillColor(gold).fontSize(14).font('Helvetica-Bold').text('((( MISI', 60, 305);

      doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('» Memberikan solusi teknologi informasi secara menyeluruh', 60, 335);
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text('sesuai kebutuhan masyarakat.', 75, 350);

      doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('» Memberikan layanan kebutuhan pengadaan secara cepat dan tepat', 60, 375);
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text('sesuai tuntutan kebutuhan pelanggan.', 75, 390);

      doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('» Memberikan layanan berbasis produk focus.', 60, 415);
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text('Menghadirkan produk berkualitas tinggi dengan jaminan garansi resmi.', 75, 430);

      // Section: GRAND VALUE
      doc.roundedRect(40, 490, 515, 175, 10).fillAndStroke('#eff6ff', '#bfdbfe');
      doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('((( GRAND VALUE', 60, 510);

      doc.fillColor(blue).fontSize(10.5).font('Helvetica-Bold').text('» Berorientasi kepada kepuasaan pelanggan', 60, 540);
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text(
        '(standar mutu dan kecepatan) serta efisiensi anggaran pengadaan.',
        75,
        558,
        { width: 450 }
      );

      doc.fillColor(blue).fontSize(10.5).font('Helvetica-Bold').text('» Berorientasi pada peningkatan kualitas individu', 60, 590);
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text(
        'menjunjung tinggi profesionalisme, integritas, jujur dan bermoral mulia.',
        75,
        608,
        { width: 450 }
      );

      // ==========================================
      // PAGE 4: TENTANG KAMI
      // ==========================================
      doc.addPage();
      renderTopHeader('TENTANG KAMI', 4);

      // Brand Logo Center Top
      doc.roundedRect(pageWidth / 2 - 80, 85, 160, 70, 8).fillAndStroke('#ffffff', '#e2e8f0');
      doc.fillColor(navy).fontSize(28).font('Helvetica-Bold').text('RSI', pageWidth / 2 - 65, 93);
      doc.fillColor('#dc2626').fontSize(8).font('Helvetica-Bold').text('RADCOM SOLUSINDO', pageWidth / 2 - 65, 123);
      doc.fillColor(navy).fontSize(8).font('Helvetica-Bold').text('INFORMATIKA', pageWidth / 2 - 65, 133);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('TENTANG KAMI', 40, 175, { align: 'center', width: 515 });
      doc.rect(pageWidth / 2 - 30, 210, 60, 4).fill(gold);

      // Paragraph 1 Card
      doc.roundedRect(40, 235, 515, 200, 12).fillAndStroke('#fef3c7', '#fde68a');
      doc.fillColor(gold).fontSize(18).font('Helvetica-Bold').text('»', 60, 250);
      doc.fillColor(darkText).fontSize(11).font('Helvetica').text(
        `Radcom Solusindo Informatika adalah perusahaan yang berdiri pada tanggal 4 Januari 2004 yang berawal bergerak dalam bidang Teknologi Informasi dan lambat laun merambah ke dalam pengadaan seluruh kebutuhan perusahaan, seperti kebutuhan IT, alat tulis kantor, tinta toner, kontruksi, percetakan, cctv dan sarana prasarana lainnya.`,
        80,
        255,
        { width: 450, lineGap: 5, align: 'justify' }
      );

      // Paragraph 2 Card
      doc.roundedRect(40, 455, 515, 230, 12).fillAndStroke('#eff6ff', '#bfdbfe');
      doc.fillColor(blue).fontSize(18).font('Helvetica-Bold').text('»', 60, 470);
      doc.fillColor(darkText).fontSize(11).font('Helvetica').text(
        `Komitmen yang ditawarkan oleh perusahaan dalam memberikan pelayanan kepada pelanggan adalah menyajikan citra kerja yang profesional, memberikan solusi terhadap segala permasalahan di bidang IT khususnya dan serta bidang lainnya pada umumnya serta memberikan pelayanan terbaik demi mencapai kepuasan dan kepercayaan pelanggan.`,
        80,
        475,
        { width: 450, lineGap: 5, align: 'justify' }
      );

      // ==========================================
      // PAGE 5: MODEL BISNIS KAMI
      // ==========================================
      doc.addPage();
      renderTopHeader('MODEL BISNIS KAMI', 5);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('MODEL BISNIS KAMI', 40, 90);
      doc.rect(40, 125, 60, 4).fill(gold);

      // Model 1: Layanan Jasa Service / Maintenance
      doc.roundedRect(40, 145, 515, 255, 12).fillAndStroke('#fef2f2', '#fecaca');

      doc.fillColor(gold).fontSize(28).font('Helvetica-Bold').text('1', 60, 160);
      doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Layanan Jasa Service / Maintanance', 90, 168);

      // Flow boxes
      const flow1 = [
        { label: 'Waktu Kunjungan – Teknisi Datang', desc: 'Respon cepat' },
        { label: 'Maintenence / Setting sesuai kontrak', desc: 'Sesuai SOP' },
        { label: 'Report Pekerjaan ($)', desc: 'Laporan resmi' },
        { label: 'Dokumentasi Pekerjaan Selesai', desc: 'BAST & QC' },
      ];

      let f1Y = 215;
      flow1.forEach((f, idx) => {
        doc.roundedRect(60, f1Y, 475, 38, 6).fillAndStroke('#ffffff', '#cbd5e1');
        doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text(`Langkah ${idx + 1}: ${f.label}`, 75, f1Y + 12);
        doc.fillColor(gold).fontSize(8.5).font('Helvetica-Bold').text(f.desc, 440, f1Y + 12, { align: 'right', width: 80 });
        f1Y += 44;
      });

      // Model 2: Pengadaan Kebutuhan Barang / Kantor
      doc.roundedRect(40, 420, 515, 255, 12).fillAndStroke('#f0fdf4', '#bbf7d0');

      doc.fillColor(gold).fontSize(28).font('Helvetica-Bold').text('2', 60, 435);
      doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Pengadaan Kebutuhan Barang / Kantor', 90, 443);

      const flow2 = [
        { label: 'Penawaran Barang / Harga (Quotation Resmi)', desc: '1x24 Jam' },
        { label: 'Menerima PO – Proses Persiapan Gudang', desc: 'Ready Stock' },
        { label: 'Pengiriman Barang ($)', desc: 'Armada Sendiri' },
        { label: 'Term of Payment Sesuai Kesepakatan (CBD / TOP)', desc: 'Faktur Pajak' },
      ];

      let f2Y = 490;
      flow2.forEach((f, idx) => {
        doc.roundedRect(60, f2Y, 475, 38, 6).fillAndStroke('#ffffff', '#cbd5e1');
        doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text(`Tahap ${idx + 1}: ${f.label}`, 75, f2Y + 12);
        doc.fillColor('#16a34a').fontSize(8.5).font('Helvetica-Bold').text(f.desc, 440, f2Y + 12, { align: 'right', width: 80 });
        f2Y += 44;
      });

      // ==========================================
      // PAGE 6: LINE OF BUSINESS IT
      // ==========================================
      doc.addPage();
      renderTopHeader('LINE OF BUSINESS IT', 6);

      doc.fillColor(navy).fontSize(24).font('Helvetica-Bold').text('LINE OF BUSINESS IT', 40, 90);
      doc.rect(40, 122, 60, 4).fill(gold);

      const businessCategories = [
        { category: 'Server', brands: 'DELL, IBM, HP Enterprise', icon: '🖥️' },
        { category: 'Network System', brands: 'D-Link, Linksys (Cisco), CISCO Systems', icon: '🌐' },
        { category: 'Antivirus', brands: 'Norton from Symantec, KASPERSKY Lab', icon: '🛡️' },
        { category: 'Projector', brands: 'Panasonic, InFocus, EIKI, NEC Display', icon: '📽️' },
        { category: 'Notebook & Laptop', brands: 'DELL, acer, TOSHIBA, Lenovo, HP', icon: '💻' },
        { category: 'Printer & Plotter', brands: 'HP, EPSON, Canon, Fuji xerox', icon: '🖨️' },
      ];

      let bY = 145;
      businessCategories.forEach(item => {
        doc.roundedRect(40, bY, 515, 80, 8).fillAndStroke(cardBg, borderColor);

        // Category Tag
        doc.rect(40, bY, 150, 80).fill(navy);
        doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(item.category, 55, bY + 30);

        // Brands Detail
        doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text(item.brands, 210, bY + 22);
        doc.fillColor(mutedText).fontSize(9).font('Helvetica').text('Distribusi Resmi, Garansi Nasional, & Ketersediaan Suku Cadang.', 210, bY + 45);

        bY += 92;
      });

      // ==========================================
      // PAGE 7: SURAT PENUNJUKAN DEALER - HP
      // ==========================================
      doc.addPage();
      renderTopHeader('SURAT PENUNJUKAN DEALER — HEWLETT-PACKARD (HP)', 7);

      doc.fillColor(navy).fontSize(22).font('Helvetica-Bold').text('SURAT PENUNJUKAN DEALER RESMI', 40, 85);
      doc.rect(40, 115, 60, 3).fill(gold);

      // Certificate Container Card
      doc.roundedRect(40, 130, 515, 610, 8).fillAndStroke('#ffffff', '#94a3b8');

      // HP Header
      doc.roundedRect(60, 150, 475, 60, 6).fill('#0284c7');
      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('hp invent', 80, 170);
      doc.fillColor('#e0f2fe').fontSize(8.5).font('Helvetica').text('Hewlett-Packard Singapore (Sales) Pte Ltd\n450 Alexandra Road, Singapore 119960', 320, 165, { align: 'right', width: 200 });

      doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text('HEWLETT-PACKARD SUPPLIES MANAGED PARTNER PROGRAM', 60, 230, { align: 'center', width: 475 });
      doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('HP AllStars – PERIODE: Q3FY2009 | No: 34/SMPP/Q3/2009', 60, 246, { align: 'center', width: 475 });

      doc.strokeColor('#cbd5e1').moveTo(60, 265).lineTo(535, 265).stroke();

      const hpBody = `Supplies Managed Partner Program ini dibuat per tanggal 1 May 2009 yang telah disepakati antara pihak-pihak sebagai berikut:

1. HEWLETT-PACKARD SINGAPORE SALES (disebut HPSS)
   450 Alexandra Road, Singapore 119960
   Contact Person: Neo Kai Tee | Email: kai-tee.neo@hp.com

dengan

2. RADCOM SOLUSINDO INFORMATIKA (disebut Managed Partner)
   Partner ID: 2-5P5-1424
   Jl. Mampang Prapatan XI no. 43 Jakarta 12790, Indonesia
   Telp: 62(21) 79182182 | Fax: 62(21) 79184489
   Contact Person: Dafril | Email: dafril26@yahoo.com
   Kategori Partner Supplies: GOLD

Kedua belah pihak sepakat untuk mentaati semua aturan yang terlampir dalam Supplies Managed Partner Program - HP AllStars ini.`;

      doc.fillColor(darkText).fontSize(10).font('Helvetica').text(hpBody, 60, 280, { width: 475, lineGap: 5 });

      // Signatures
      doc.roundedRect(60, 560, 220, 130, 6).fillAndStroke(cardBg, borderColor);
      doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text('HEWLETT-PACKARD INDONESIA', 75, 575);
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica-Oblique').text('(Signed)', 75, 620);
      doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text('Neo Kai Tee', 75, 650);
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica').text('After Market Supplies South-East Asia', 75, 665);

      doc.roundedRect(315, 560, 220, 130, 6).fillAndStroke(cardBg, borderColor);
      doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text('RADCOM SOLUSINDO INFORMATIKA', 330, 575);
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica-Oblique').text('(Signed & Stamped)', 330, 620);
      doc.fillColor(navy).fontSize(9.5).font('Helvetica-Bold').text('Dafril', 330, 650);
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica').text('Director / Owner', 330, 665);

      // ==========================================
      // PAGE 8: SURAT PENUNJUKAN DEALER - EPSON
      // ==========================================
      doc.addPage();
      renderTopHeader('SURAT PENUNJUKAN DEALER — EPSON INDONESIA', 8);

      doc.fillColor(navy).fontSize(22).font('Helvetica-Bold').text('SURAT PENUNJUKAN DEALER RESMI', 40, 85);
      doc.rect(40, 115, 60, 3).fill(gold);

      doc.roundedRect(40, 130, 515, 610, 8).fillAndStroke('#ffffff', '#94a3b8');

      // Epsindo Header
      doc.fillColor('#1e40af').fontSize(24).font('Helvetica-Bold').text('epsindo', 65, 155);
      doc.fillColor(mutedText).fontSize(9).font('Helvetica').text('PT. EPSINDO PRIMA SINERGI — Distributor Resmi Epson Indonesia', 65, 185);
      doc.strokeColor('#cbd5e1').moveTo(65, 205).lineTo(530, 205).stroke();

      doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('SURAT PENUNJUKAN DEALER', 40, 230, { align: 'center', width: 515 });

      const epsonText = `PT. Epsindo Prima Sinergi sebagai distributor resmi di Indonesia untuk produk-produk Epson Printer dan Supplies (Ribbon, Tinta, Toner, Paper) dengan ini menunjuk:

              RADCOM SOLUSINDO INFORMATIKA
              Mampang Prapatan XI, Jl. Mangga Dua Raya

Sebagai salah satu Dealer resmi kami dalam pengadaan produk asli Epson dengan adanya hologram resmi Epson Indonesia.

Demikianlah surat penunjukan ini kami buat, untuk dapat digunakan sebagaimana mestinya.

Terimakasih.`;

      doc.fillColor(darkText).fontSize(11).font('Helvetica').text(epsonText, 65, 275, { width: 465, lineGap: 6 });

      doc.fillColor(navy).fontSize(10.5).font('Helvetica-Bold').text('Hormat kami,', 65, 470);
      doc.fillColor(mutedText).fontSize(9).font('Helvetica-Oblique').text('(Signed & Stamped PT Epsindo Prima Sinergi)', 65, 520);
      doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text('Sherly Pausen', 65, 555);
      doc.fillColor(darkText).fontSize(9.5).font('Helvetica').text('Senior Manager Sales & Marketing Dept.', 65, 570);
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica').text('PT. EPSINDO PRIMA SINERGI', 65, 585);

      // ==========================================
      // PAGE 9: SURAT PENUNJUKAN DEALER - GEAR
      // ==========================================
      doc.addPage();
      renderTopHeader('SURAT PENUNJUKAN DEALER — GEAR COMPUTER', 9);

      doc.fillColor(navy).fontSize(22).font('Helvetica-Bold').text('SURAT PENUNJUKAN DEALER RESMI', 40, 85);
      doc.rect(40, 115, 60, 3).fill(gold);

      doc.roundedRect(40, 130, 515, 610, 8).fillAndStroke('#ffffff', '#94a3b8');

      doc.fillColor(gold).fontSize(26).font('Helvetica-Bold').text('Gear computer', 65, 155);
      doc.fillColor(mutedText).fontSize(9).font('Helvetica-Bold').text('No. 171IMV0713', 440, 160);

      doc.fillColor(navy).fontSize(12).font('Helvetica-Bold').text('CERTIFICATE AUTHORIZATION LETTER', 40, 210, { align: 'center', width: 515 });
      doc.fillColor(mutedText).fontSize(10).font('Helvetica').text('This certificate authorization letter is presented to:', 40, 230, { align: 'center', width: 515 });

      doc.roundedRect(80, 260, 435, 70, 8).fillAndStroke('#fef3c7', '#fde68a');
      doc.fillColor(navy).fontSize(16).font('Helvetica-Bold').text('RADCOM SOLUSINDO INFORMATIKA', 80, 275, { align: 'center', width: 435 });
      doc.fillColor(darkText).fontSize(10).font('Helvetica').text('Jl. Mampang Prapatan XI No. 43 Jakarta 12790 Jakarta - Indonesia', 80, 298, { align: 'center', width: 435 });

      doc.fillColor(darkText).fontSize(11).font('Helvetica').text(
        'With this certificate announcing RADCOM SOLUSINDO INFORMATIKA as Gear Master Dealer in the Gear Channel Partner Program.',
        80,
        360,
        { width: 435, align: 'center', lineGap: 4 }
      );

      doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('Validity Date: 1 April 2013 – 2 April 2014', 80, 430, { align: 'center', width: 435 });

      doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text('Achmad Fauzi', 40, 520, { align: 'center', width: 515 });
      doc.fillColor(mutedText).fontSize(9.5).font('Helvetica').text('Channel Division — PT. INDO MEGA VISION', 40, 538, { align: 'center', width: 515 });
      doc.fillColor(mutedText).fontSize(8.5).font('Helvetica').text('Gedung Metro Sunter Lt. 4, Jl. Danau Sunter Utara Blok A2, Jakarta Utara', 40, 554, { align: 'center', width: 515 });

      // ==========================================
      // PAGE 10: DAFTAR REKANAN
      // ==========================================
      doc.addPage();
      renderTopHeader('DAFTAR REKANAN', 10);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DAFTAR REKANAN', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(9.5).font('Helvetica').text(
        'Dipercaya oleh puluhan institusi pemerintah, BUMN, lembaga internasional, perhotelan, manufaktur, dan perbankan:',
        40,
        130
      );

      // Clients Directory Grid (Exact names from page 10)
      const allClients = [
        'Direktorat Tipidkor Bareskrim Polri', 'WWF (World Wide Fund for Nature)', 'CARE International Indonesia',
        'International SOS', 'Konservasi Alam Nusantara', 'Kelompok AgroMedia', 'ChildFund International',
        'Atlas Copco Nusantara', 'Oiltanking Merak', 'Control Union Indonesia', 'Peterson Commodities',
        'Koltiva Agro Digital', 'Rumah Sakit Tria Dipa', 'iDSMED', 'Silverlake Symmetry', 'PT. Interprima Indocom',
        'Bhumyamca Sekawan', 'Collega (Telkom Indonesia)', 'Mega Finance', 'Rumah Energi Indonesia',
        'Chakra Jawara (TMT Group)', 'Parker Engineering', 'ICRC (Palang Merah Internasional)', 'GF Culinary Group',
        'SPR', 'PT. International Chemical Industry (Baterai ABC)', 'Intracawood Manufacturing', 'PT. ANJ',
        'AEDI', 'Alila Hotels and Resorts', 'Harris Hotels', 'The Hermitage Hotel Jakarta', 'Heidelberg Indonesia',
        'Moores Rowland', 'Anzindo', 'Sintesa Group', 'Protindo', 'Indonesian Paradise Property',
        'HILTI Indonesia', 'CNPC BGP Indonesia', 'FABS Construction', 'TOP', 'Hadiprana Design',
        'Penerbit Erlangga', 'Seascape Surveys Indonesia', 'TÜV Rheinland Indonesia', 'The Summit Kelapa Gading',
        'Sinar Mas Group', 'China Construction Bank (CCB) Indonesia', 'DAPRA PT Danatel Pratama', 'Boncafé Indonesia',
        'Graha Niaga Tata Utama', 'Chitra Paratama', 'Shipper Logistik Indonesia', 'Asuransi Rama', 'Berkat Jaya Beton'
      ];

      let clientY = 155;
      const cColWidth = 168;
      const cRows = 19;

      allClients.forEach((cl, idx) => {
        const col = Math.floor(idx / cRows);
        const row = idx % cRows;
        const x = 40 + (col * cColWidth);
        const y = clientY + (row * 30);

        doc.roundedRect(x, y, cColWidth - 8, 26, 4).fillAndStroke(cardBg, '#e2e8f0');
        doc.fillColor(gold).fontSize(8).font('Helvetica-Bold').text('✔', x + 6, y + 8);
        doc.fillColor(darkText).fontSize(7.5).font('Helvetica-Bold').text(cl, x + 18, y + 8, { width: cColWidth - 28, ellipsis: true });
      });

      // ==========================================
      // PAGE 11: DAFTAR PROJECT
      // ==========================================
      doc.addPage();
      renderTopHeader('DAFTAR PROJECT', 11);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DAFTAR PROJECT', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);

      // Project 1
      doc.roundedRect(40, 140, 515, 270, 12).fillAndStroke('#ffffff', '#cbd5e1');

      doc.rect(40, 140, 515, 55).fill(navy);
      doc.fillColor(gold).fontSize(11).font('Helvetica-Bold').text(
        'ROYAL EMBASSY OF SAUDI ARABIA OFFICE OF MILITARY ATTACHE JAKARTA',
        55,
        155,
        { width: 485 }
      );
      doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(
        'Project Instalasi Pemasangan 30 Camera CCTV NVR',
        55,
        172
      );

      doc.fillColor(darkText).fontSize(10).font('Helvetica').text(
        `Berdasarkan Surat Perintah Kerja (SPK) resmi tanggal 2 Juli 2025 antara Kantor Atase Militer Kedutaan Besar Kerajaan Arab Saudi di Jakarta dan Singapura (diwakili oleh Brigadir Jenderal Staf Ahmed) dengan PT RADCOM SOLUSINDO INFORMATIKA.\n\nLingkup Pekerjaan:\n• Pengadaan dan pemasangan 30 unit IP Camera CCTV High Definition dengan Network Video Recorder (NVR).\n• Pemasangan kabel transmisi data jaringan dan konfigurasi pemantauan keamanan gedung kedutaan.\n• Uji fungsi, integrasi server monitor, dan serah terima pekerjaan sesuai standar keamanan internasional.`,
        60,
        210,
        { width: 475, lineGap: 4 }
      );

      // Project 2
      doc.roundedRect(40, 435, 515, 270, 12).fillAndStroke('#ffffff', '#cbd5e1');

      doc.rect(40, 435, 515, 55).fill(navy);
      doc.fillColor(gold).fontSize(11).font('Helvetica-Bold').text(
        'PT. INTEGRASI JARINGAN EKOSISTEM (IJE / KAI)',
        55,
        450,
        { width: 485 }
      );
      doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(
        'Project Instalasi Pemasangan IP Camera CCTV & Akses Door 8 Shelter KAI',
        55,
        467
      );

      doc.fillColor(darkText).fontSize(10).font('Helvetica').text(
        `Pelaksanaan proyek infrastruktur keamanan dan akses kontrol pada 8 shelter stasiun Kereta Api Indonesia (KAI) bekerja sama dengan PT. Integrasi Jaringan Ekosistem.\n\nLingkup Pekerjaan:\n• Pemasangan sistem Access Door Controller dengan sensor biometric dan kartu akses RFID pada 8 shelter.\n• Instalasi jaringan kamera IP CCTV tahan cuaca (outdoor IP67) terintegrasi ke pusat pengawasan (command center).\n• Pemasangan kabel fiber optic & UTP Cat6, terminasi panel rack, dan commissioning sistem secara penuh.`,
        60,
        505,
        { width: 475, lineGap: 4 }
      );

      // ==========================================
      // PAGE 12: DOKUMENTASI - KERJASAMA POLRI
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — KERJASAMA DIREKTORAT TIPIDKOR BARESKRIM POLRI', 12);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('DOKUMENTASI RESMI DENGAN DIREKTORAT TIPIDKOR BARESKRIM POLRI', 40, 130);

      const doc12Cards = [
        {
          title: 'BARESKRIM POLRI — RESPONTABILITAS & TRANSPARANSI',
          date: 'Jumat, 18 Juni 2021 | Jalan Trunojoyo No. 3, Jakarta Selatan',
          desc: 'Kunjungan kerja teknis dan koordinasi pengadaan sarana IT kantor Direktorat Tipidkor Bareskrim Polri.'
        },
        {
          title: 'SURAT PERJANJIAN KERJASAMA RESMI',
          date: 'Tahun Anggaran Berjalan | Bareskrim Polri & PT. Radcom Solusindo',
          desc: 'Dokumen kontrak resmi pengadaan dan pemeliharaan perangkat komputer kerja, server, serta consumable kantor.'
        },
        {
          title: 'RAPAT KOORDINASI DENGAN JAJARAN PERWIRA POLRI',
          date: 'Kamis, 12 Agustus 2021 | Ruang Rapat Tipidkor Gedung Bareskrim',
          desc: 'Paparan teknis tim Radcom Solusindo mengenai spesifikasi perangkat komputer, jaringan, dan keamanan sistem informasi.'
        },
        {
          title: 'PELAKSANAAN TUGAS & INSTALASI SISTEM',
          date: 'Kamis, 2 Desember 2021 | Mabes Polri Jl. Trunojoyo',
          desc: 'Serah terima barang, testing perangkat notebook operasional, dan instalasi sistem oleh tim teknisi spesialis Radcom.'
        }
      ];

      let d12Y = 155;
      doc12Cards.forEach(card => {
        doc.roundedRect(40, d12Y, 515, 120, 8).fillAndStroke(cardBg, borderColor);
        doc.fillColor(navy).fontSize(11).font('Helvetica-Bold').text(card.title, 55, d12Y + 16);
        doc.fillColor(gold).fontSize(9).font('Helvetica-Bold').text(card.date, 55, d12Y + 34);
        doc.fillColor(darkText).fontSize(9.5).font('Helvetica').text(card.desc, 55, d12Y + 52, { width: 475, lineGap: 3 });
        d12Y += 135;
      });

      // ==========================================
      // PAGE 13: DOKUMENTASI - SAFETY & FURNITURE
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — PENGADAAN SAFETY EQUIPMENT & MEBEL KANTOR', 13);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('PENGADAAN PERALATAN SAFETY K3, SERAGAM, & MEBEL KANTOR', 40, 130);

      const doc13Items = [
        {
          title: 'Logistik Armada Truk & Pengiriman Kontainer',
          desc: 'Pengiriman massal ratusan karton perlengkapan pabrik dan material safety proyek ke lokasi gudang klien.'
        },
        {
          title: 'Sepatu Safety Dr. OSHA & Caterpillar Original',
          desc: 'Pengadaan ribuan pasang safety shoes bersertifikasi SNI/ANSI untuk pekerja konstruksi dan operasional lapangan.'
        },
        {
          title: 'Plakat Penghargaan & Seragam Kerja Karyawan PT ANJ',
          desc: 'Produksi seragam wearpack safety reflektif oranye untuk PT ANJ beserta cinderamata plakat akrilik resmi.'
        },
        {
          title: 'Kursi Kuliah & Kursi Kerja Kantor Ergonomis',
          desc: 'Pengadaan ratusan unit kursi lipat meja belajar dan kursi putar kantor berbusa tebal siap pakai.'
        }
      ];

      let d13Y = 155;
      doc13Items.forEach(item => {
        doc.roundedRect(40, d13Y, 515, 120, 8).fillAndStroke(cardBg, borderColor);
        doc.fillColor(navy).fontSize(12).font('Helvetica-Bold').text(item.title, 55, d13Y + 20);
        doc.fillColor(darkText).fontSize(10).font('Helvetica').text(item.desc, 55, d13Y + 44, { width: 475, lineGap: 4 });
        d13Y += 135;
      });

      // ==========================================
      // PAGE 14: DOKUMENTASI - IT & ATK
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — PENGADAAN PERANGKAT IT, GADGET & ATK', 14);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('PENGADAAN SMARTPHONE, LAPTOP, ROUTER & KERTAS HVS', 40, 130);

      const doc14Items = [
        {
          title: 'Display Bracket & Perlengkapan Instalasi TV',
          desc: 'Pengadaan puluhan unit wall bracket dan stand display monitor untuk ruang rapat dan monitoring command center.'
        },
        {
          title: 'Smartphone Infinix Smart 6 & Apple iPhone',
          desc: 'Penyediaan perangkat gadget operasional sales force dan manajerial dalam kondisi segel original bergaransi resmi.'
        },
        {
          title: 'ATK Joyko Binder Clips & Kertas SiDU Sinar Dunia A4 80gr',
          desc: 'Suplai puluhan ribu rim kertas SiDU A4 80gr dan aneka perlengkapan kantor ke instansi pemerintah dan swasta.'
        },
        {
          title: 'Xiaomi Mi Router 4A & Laptop Axioo MyBook',
          desc: 'Pengadaan ratusan unit router wireless gigabit dan laptop Axioo bergaransi resmi untuk digitalisasi kantor.'
        }
      ];

      let d14Y = 155;
      doc14Items.forEach(item => {
        doc.roundedRect(40, d14Y, 515, 120, 8).fillAndStroke(cardBg, borderColor);
        doc.fillColor(navy).fontSize(12).font('Helvetica-Bold').text(item.title, 55, d14Y + 20);
        doc.fillColor(darkText).fontSize(10).font('Helvetica').text(item.desc, 55, d14Y + 44, { width: 475, lineGap: 4 });
        d14Y += 135;
      });

      // ==========================================
      // PAGE 15: DOKUMENTASI - CONSUMER GOODS & TEKNISI
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — SEMBAKO, LAB TEKNISI & INSTALASI RACK SERVER', 15);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('PENGADAAN CONSUMER GOODS, SERVICE CENTER, & JARINGAN SERVER', 40, 130);

      const doc15Items = [
        {
          title: 'Pengadaan Consumer Goods, Sembako & Obat-Obatan Kantor',
          desc: 'Suplai paket sembako kopi Tora Bika, tissue Tessa, Bodrex, Hansaplast, Glade, dan masker medis korporasi.'
        },
        {
          title: 'Laboratorium Service Center & Teknisi Komputer Radcom',
          desc: 'Fasilitas perbaikan laptop, recovery data server, serta maintenance berkala yang dikelola teknisi berpengalaman.'
        },
        {
          title: 'Instalasi Server Rack, Switch & Pengkabelan Panel Data',
          desc: 'Pemasangan rapi kabel ducting, patch cord, switch manageable, dan rack server di ruang server pelanggan.'
        },
        {
          title: 'Pengerjaan Interior, Plafon & Jalur Kelistrikan Kantor',
          desc: 'Dukungan pekerjaan sipil ringan untuk jalur kabel listrik tersembunyi dan instalasi lampu perkantoran.'
        }
      ];

      let d15Y = 155;
      doc15Items.forEach(item => {
        doc.roundedRect(40, d15Y, 515, 120, 8).fillAndStroke(cardBg, borderColor);
        doc.fillColor(navy).fontSize(12).font('Helvetica-Bold').text(item.title, 55, d15Y + 20);
        doc.fillColor(darkText).fontSize(10).font('Helvetica').text(item.desc, 55, d15Y + 44, { width: 475, lineGap: 4 });
        d15Y += 135;
      });

      // ==========================================
      // PAGE 16: DOKUMENTASI - GATHERING & HUT 17 TAHUN
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — GATHERING & ULANG TAHUN KE-17', 16);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('KEBERSAMAAN TIM & PERAYAAN 17 TAHUN DEDIKASI RADCOM', 40, 130);

      const doc16Items = [
        {
          title: 'Perayaan Ulang Tahun PT Radcom Solusindo Informatika ke-17',
          desc: 'Momen penuh syukur 17 tahun berkiprah (2004 - sekarang) melayani kebutuhan pengadaan ribuan pelanggan di Indonesia.'
        },
        {
          title: 'Employee Gathering & Team Building di Alam Terbuka',
          desc: 'Membangun soliditas, kekompakan, dan integritas seluruh jajaran staf manajemen, sales, logistik, dan teknisi.'
        },
        {
          title: 'Acara Ramah Tamah & Kebersamaan Keluarga Besar Radcom',
          desc: 'Menjaga keharmonisan dan budaya kerja kekeluargaan yang bermoral mulia sesuai Grand Value perusahaan.'
        },
        {
          title: 'Doa Bersama & Santunan Sosial',
          desc: 'Wujud kepedulian sosial perusahaan terhadap masyarakat sekitar sebagai bagian dari komitmen berkelanjutan.'
        }
      ];

      let d16Y = 155;
      doc16Items.forEach(item => {
        doc.roundedRect(40, d16Y, 515, 120, 8).fillAndStroke('#fffbeb', '#fef3c7');
        doc.fillColor(gold).fontSize(12).font('Helvetica-Bold').text(item.title, 55, d16Y + 20);
        doc.fillColor(darkText).fontSize(10).font('Helvetica').text(item.desc, 55, d16Y + 44, { width: 475, lineGap: 4 });
        d16Y += 135;
      });

      // ==========================================
      // PAGE 17: DOKUMENTASI - LOGISTIK & SERAH TERIMA
      // ==========================================
      doc.addPage();
      renderTopHeader('DOKUMENTASI — PENGIRIMAN & SERAH TERIMA PROYEK', 17);

      doc.fillColor(navy).fontSize(26).font('Helvetica-Bold').text('DOKUMENTASI', 40, 85);
      doc.rect(40, 118, 60, 4).fill(gold);
      doc.fillColor(mutedText).fontSize(10).font('Helvetica-Bold').text('ARMADA PENGIRIMAN LOGISTIK & KOORDINASI LAPANGAN', 40, 130);

      const doc17Items = [
        {
          title: 'Pemuatan Barang ke Truk Ekspedisi Logistik Radcom',
          desc: 'Proses loading barang display monitor, server, dan karton perlengkapan pabrik dengan pengemasan aman (safety bubble wrap).'
        },
        {
          title: 'Serah Terima Barang Bersama Pejabat Pembuat Komitmen (PPK)',
          desc: 'Penyerahan resmi barang pengadaan sesuai surat pesanan lengkap dengan Berita Acara Serah Terima (BAST).'
        },
        {
          title: 'Distribusi Cepat Armada Kurir Motor Kertas SiDU A4',
          desc: 'Layanan pengiriman ekspres kebutuhan mendesak ATK dan tinta printer langsung ke meja kerja pemesan.'
        },
        {
          title: 'Briefing Lapangan Tim Teknisi & Rapat Evaluasi Proyek',
          desc: 'Pemeriksaan kepatuhan prosedur keselamatan kerja (K3) dan koordinasi jadwal penyelesaian proyek tepat waktu.'
        }
      ];

      let d17Y = 155;
      doc17Items.forEach(item => {
        doc.roundedRect(40, d17Y, 515, 120, 8).fillAndStroke(cardBg, borderColor);
        doc.fillColor(navy).fontSize(12).font('Helvetica-Bold').text(item.title, 55, d17Y + 20);
        doc.fillColor(darkText).fontSize(10).font('Helvetica').text(item.desc, 55, d17Y + 44, { width: 475, lineGap: 4 });
        d17Y += 135;
      });

      // ==========================================
      // PAGE 18: PENUTUP / KONTAK LENGKAP
      // ==========================================
      doc.addPage();

      // Top Full Navy Banner with Logo
      doc.rect(0, 0, pageWidth, 240).fill(darkNavy);

      // RSI Logo
      doc.roundedRect(pageWidth / 2 - 75, 40, 150, 65, 8).fill('#ffffff');
      doc.fillColor(navy).fontSize(28).font('Helvetica-Bold').text('RSI', pageWidth / 2 - 60, 48);
      doc.fillColor('#dc2626').fontSize(8.5).font('Helvetica-Bold').text('RADCOM SOLUSINDO', pageWidth / 2 - 60, 78);
      doc.fillColor(navy).fontSize(8.5).font('Helvetica-Bold').text('INFORMATIKA', pageWidth / 2 - 60, 88);

      doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(
        'PT RADCOM SOLUSINDO INFORMATIKA',
        40,
        130,
        { align: 'center', width: 515 }
      );

      doc.fillColor(lightGold).fontSize(11).font('Helvetica').text(
        'Perusahaan pengadaan barang dan jasa dengan pertambahan\nnilai pajak dan dapat mengeluarkan\nfaktur pajak.',
        40,
        165,
        { align: 'center', width: 515, lineGap: 3 }
      );

      // Contact Information Cards
      const contactCards = [
        {
          label: 'Phone (Telepon Kantor)',
          value: '(021) 79182182',
          icon: '☎️',
        },
        {
          label: 'Mobile / WhatsApp',
          value: '+62 859 6671 7414',
          icon: '📱',
        },
        {
          label: 'Email Resmi',
          value: 'info@radcomsolusindo.com',
          icon: '✉️',
        },
        {
          label: 'Website Resmi',
          value: 'www.radcomsolusindo.com',
          icon: '🌐',
        },
        {
          label: 'Alamat Kantor Operasional',
          value: 'Jl. Mampang Prapatan X No. 36\nMampang, Jakarta 12790',
          icon: '📍',
        },
      ];

      let cY = 270;
      contactCards.forEach(c => {
        doc.roundedRect(60, cY, 475, 70, 10).fillAndStroke('#ffffff', '#cbd5e1');

        doc.fillColor(gold).fontSize(10).font('Helvetica-Bold').text(c.label.toUpperCase(), 80, cY + 16);
        doc.fillColor(navy).fontSize(13).font('Helvetica-Bold').text(c.value, 80, cY + 34);

        cY += 82;
      });

      // Bottom Gold Strip
      doc.rect(0, pageHeight - 50, pageWidth, 50).fill(navy);
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text(
        'Hak Cipta © PT. Radcom Solusindo Informatika. Seluruh hak cipta dilindungi undang-undang.',
        40,
        pageHeight - 32,
        { align: 'center', width: 515 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
