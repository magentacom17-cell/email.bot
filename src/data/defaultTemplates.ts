import { EmailTemplate, SenderProfile, CustomerContact } from '../types/index.ts';

export const defaultSenderProfile: SenderProfile = {
  name: 'Satria',
  title: 'Business Representative',
  company: 'PT Radcom Solusindo Informatika',
  phone: '+62 817-0380-7122',
  email: 'satria@radcomsolusindo.com',
  address: 'Jl. Mampang Prapatan X No. 36, Mampang, Jakarta 12790',
  website: 'www.radcomsolusindo.com',
  tagline: 'Pengadaan Barang & Jasa Terpercaya Sejak 2004 · LPSE, PaDi UMKM, SIPLah, e-Katalog LKPP',
};

export const defaultContacts: CustomerContact[] = [
  {
    id: 'c1',
    name: 'Bapak Hendra Gunawan',
    company: 'PT Surya Citra Mandiri',
    email: 'hendra.gunawan@suryacitra.co.id',
    phone: '08119876543',
    notes: 'Kebutuhan kabel NYA/NYM & panel distribusi lantai 4',
    category: 'Kontraktor & MEP',
  },
  {
    id: 'c2',
    name: 'Ibu Ratna Dewi',
    company: 'PT Mega Nusantara Perkasa',
    email: 'purchasing@meganusa.com',
    phone: '08128765432',
    notes: 'Inquiry IP Camera CCTV & Server NVR 32 Channel',
    category: 'Purchasing Corporate',
  },
  {
    id: 'c3',
    name: 'Bapak Dedi Kurniawan',
    company: 'CV Makmur Sejahtera Abadi',
    email: 'dedi@makmursejahtera.id',
    phone: '08137788990',
    notes: 'Pengadaan safety equipment (Sepatu safety, helm, rompi)',
    category: 'Industri & Pabrik',
  },
  {
    id: 'c4',
    name: 'Ibu Maya Septiani',
    company: 'PT Integra Solusi Digital',
    email: 'procurement@integrasolusi.com',
    phone: '08156677889',
    notes: 'Kebutuhan Switch Managed 24 Port & Access Point WiFi 6',
    category: 'IT Enterprise',
  },
];

export const defaultTemplates: EmailTemplate[] = [
  {
    id: 'intro',
    name: 'Perkenalan PT Radcom Solusindo Informatika',
    category: 'perkenalan',
    badge: 'Populer',
    description: 'Surat perkenalan resmi profil perusahaan untuk calon customer atau purchasing baru.',
    subject: 'Perkenalan & Profil Supplier Pengadaan — PT Radcom Solusindo Informatika',
    body: `Yth. [Nama]
[Perusahaan]
di Tempat

Dengan hormat,

Semoga Bapak/Ibu senantiasa dalam keadaan sehat dan kegiatan operasional perusahaan berjalan dengan lancar.

Perkenalkan, saya [Nama Sales] dari PT Radcom Solusindo Informatika.

Kami merupakan supplier sekaligus partner pengadaan resmi yang telah berpengalaman melayani berbagai kebutuhan proyek gedung, industri manufaktur, perkantoran, dan instansi. Portofolio pengadaan yang kami sediakan meliputi:

1. Electrical & Mechanical: Kabel power, saklar/stop kontak industri, panel listrik, breaker (MCCB/MCB), trafo, inverter, genset.
2. IT & Networking: Server, switch manageable, router enterprise, access point Wi-Fi, rak server, kabel UTP Cat6/Cat6A, fiber optic.
3. CCTV & Security System: IP Camera, NVR, access door control, barrier gate, walk-through detector.
4. Tata Udara (AC / HVAC): AC Split, cassette, ducting, VRV/VRF, exhaust fan komersial beserta instalasi pipa.
5. Safety Equipment & K3: Helm proyek, safety shoes standar SNI/ANSI, rompi reflektif, body harness, sarung tangan khusus, APAR.
6. Perlengkapan Umum & Tools: Perkakas teknik (hand tools & power tools), consumable industri, dan material penunjang proyek lainnya.

Keunggulan bekerja sama dengan PT Radcom Solusindo Informatika:
• Produk 100% Original bergaransi resmi dari prinsipal terkemuka.
• Harga kompetitif dengan skema pembayaran yang fleksibel (sesuai verifikasi PO/SPK).
• Kecepatan respon ketersediaan stok (ready stock & fast delivery).
• Layanan konsultasi teknis spesifikasi sebelum pemesanan.

Apabila saat ini Bapak/Ibu atau tim pengadaan sedang memiliki kebutuhan barang, daftar estimasi (Bill of Quantities / BOM), atau sedang mencari perbandingan penawaran, kami dengan senang hati siap memberikan penawaran harga terbaik.

Silakan balas email ini atau hubungi kami melalui WhatsApp di [No HP Sales] untuk diskusi lebih lanjut.

Atas perhatian dan kesempatan yang diberikan, kami ucapkan terima kasih.

Hormat kami,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'followup_general',
    name: 'Follow-up Kebutuhan Pengadaan (BOM / Inquiry)',
    category: 'followup',
    badge: 'Follow-up',
    description: 'Menanyakan perkembangan kebutuhan barang yang sedang dicari customer.',
    subject: 'Follow-up Kebutuhan Pengadaan & Suplai Barang — [Perusahaan]',
    body: `Yth. [Nama]
[Perusahaan]

Dengan hormat,

Semoga Bapak/Ibu senantiasa dalam keadaan baik dan sukses dalam aktivitas kerja hari ini.

Saya [Nama Sales] dari PT Radcom Solusindo Informatika. Izin follow-up singkat terkait rencana kebutuhan pengadaan barang atau perlengkapan operasional di lingkungan [Perusahaan].

Apabila saat ini ada kebutuhan mendesak untuk:
• Material elektrikal atau kabel proyek
• Pengadaan perangkat IT, server, jaringan, atau CCTV
• Unit pendingin ruangan (AC) / pergantian sparepart
• Peralatan safety K3 untuk teknisi / operasional pabrik

Mohon berkenan menginformasikan kepada kami spesifikasi atau target jadwalnya. Kami siap membantu pengecekan ketersediaan stok dan memberikan estimasi penawaran harga terbaik dalam waktu 1x24 jam.

Terima kasih banyak atas waktu dan kerja sama yang terjalin selama ini.

Salam hangat,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'quotation_send',
    name: 'Pengiriman Penawaran Harga Resmi (Official Quotation)',
    category: 'penawaran',
    badge: 'Penawaran',
    description: 'Pesan pengantar saat mengirimkan file quotation / penawaran harga resmi.',
    subject: 'Penawaran Harga Resmi Pengadaan — PT Radcom Solusindo Informatika',
    body: `Yth. [Nama]
Bagian Pengadaan / Purchasing
[Perusahaan]

Dengan hormat,

Terima kasih atas kepercayaan dan kesempatan yang diberikan kepada PT Radcom Solusindo Informatika untuk berpartisipasi dalam memenuhi kebutuhan pengadaan [Perusahaan].

Bersama email ini, kami sampaikan Surat Penawaran Harga resmi sesuai dengan spesifikasi dan volume yang telah didiskusikan sebelumnya.

Ringkasan Kondisi Penawaran:
1. Harga yang tertera sudah termasuk garansi resmi distributor.
2. Waktu Pengiriman (Lead Time): Ready stock / Estimasi 2-4 hari kerja setelah PO resmi kami terima.
3. Lokasi Pengiriman: Loco gudang / Franco proyek sesuai kesepakatan.
4. Masa Berlaku Penawaran: 14 hari kalender terhitung sejak tanggal diterbitkan.
5. Ketentuan Pembayaran: Sesuai Purchase Order (PO) yang disepakati.

Mohon berkenan untuk meninjau penawaran terlampir. Apabila ada hal yang perlu didiskusikan kembali, baik terkait spesifikasi teknis alternatif maupun negosiasi harga terbaik, kami sangat terbuka untuk berdiskusi.

Kami menantikan kabar baik serta arahan selanjutnya dari Bapak/Ibu.

Hormat kami,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'followup_quote',
    name: 'Follow-up Penawaran yang Sudah Dikirim (3-7 Hari)',
    category: 'followup',
    badge: 'Follow-up',
    description: 'Menanyakan status tindak lanjut penawaran harga yang telah dikirimkan sebelumnya.',
    subject: 'Follow-up Penawaran Harga PT Radcom Solusindo Informatika — [Perusahaan]',
    body: `Yth. [Nama]
[Perusahaan]

Dengan hormat,

Semoga Bapak/Ibu senantiasa sehat dan sukses dalam memimpin kegiatan proyek.

Izin follow-up kembali terkait Surat Penawaran Harga yang telah kami sampaikan sebelumnya untuk kebutuhan [Perusahaan].

Kami ingin menanyakan apakah dokumen penawaran tersebut telah selesai ditinjau oleh tim terkait? Mohon informasinya apabila:
1. Terdapat spesifikasi barang atau alternatif brand yang perlu kami sesuaikan kembali.
2. Diperlukan negosiasi anggaran lebih lanjut untuk memenuhi target budget proyek.
3. Diperlukan sampel fisik barang atau lembar spesifikasi teknis (data sheet/katalog).

Tim kami siap memberikan dukungan optimal agar proses pengadaan di [Perusahaan] dapat berjalan efisien dan tepat waktu.

Terima kasih banyak atas waktu dan perhatian Bapak/Ibu.

Salam hormat,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'meeting_invite',
    name: 'Undangan Diskusi Teknis / Survey Lokasi Proyek',
    category: 'operasional',
    description: 'Mengajak customer berdiskusi teknis via online meeting atau kunjungan langsung.',
    subject: 'Undangan Diskusi Teknis & Presentasi Solusi Pengadaan — PT Radcom Solusindo Informatika',
    body: `Yth. [Nama]
[Perusahaan]

Dengan hormat,

Terima kasih atas komunikasi awal yang telah terjalin dengan baik antara [Perusahaan] dan PT Radcom Solusindo Informatika.

Guna memastikan seluruh kebutuhan teknis, spesifikasi material, dan estimasi waktu pengerjaan dapat terakomodasi secara tepat, kami bermaksud mengundang Bapak/Ibu beserta tim teknis untuk berdiskusi secara singkat (15–30 menit).

Adapun agenda yang dapat kami tawarkan:
1. Penjelasan spesifikasi teknis dan komparasi efisiensi brand.
2. Demo produk / presentasi portofolio proyek serupa yang telah kami kerjakan.
3. Kunjungan atau survey langsung ke lokasi/gudang jika diperlukan.

Diskusi dapat dilakukan secara tatap muka langsung di kantor Bapak/Ibu ataupun via Google Meet/Zoom sesuai kenyamanan jadwal Bapak/Ibu.

Mohon informasikan ketersediaan waktu luang Bapak/Ibu di minggu ini.

Terima kasih atas kerja samanya yang luar biasa.

Hormat kami,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'po_confirmation',
    name: 'Konfirmasi Penerimaan Purchase Order (PO)',
    category: 'operasional',
    description: 'Konfirmasi resmi saat menerima PO dari customer dan langkah proses pengiriman.',
    subject: 'Konfirmasi Penerimaan Purchase Order (PO) — PT Radcom Solusindo Informatika',
    body: `Yth. [Nama]
Finance & Procurement Department
[Perusahaan]

Dengan hormat,

Kami mengonfirmasi bahwa Purchase Order (PO) dari [Perusahaan] telah kami terima dengan baik dan saat ini sedang masuk ke dalam tahap antrean pemrosesan di gudang logistik kami.

Rincian singkat pemrosesan:
• Status Pesanan: Sedang Dipersiapkan & Quality Check (QC).
• Estimasi Jadwal Pengiriman: 1-2 hari kerja.
• Dokumen Penyerta: Surat Jalan (DO), Faktur Pajak, dan Invoice asli akan disertakan bersama barang.

Tim logistik kami akan segera mengabarkan nomor kontak driver/kurir sesaat sebelum armada berangkat menuju lokasi pengiriman [Perusahaan].

Terima kasih sebesar-besarnya atas kepercayaan dan kemitraan yang terjalin dengan PT Radcom Solusindo Informatika.

Salam hangat,
[Nama Sales]
[Perusahaan Sales]`,
  },
  {
    id: 'blank',
    name: 'Pesan Kustom (Kosong)',
    category: 'kustom',
    description: 'Mulai menulis pesan dari awal dengan format bersih.',
    subject: 'Kebutuhan Pengadaan Barang — PT Radcom Solusindo Informatika',
    body: `Yth. [Nama]
[Perusahaan]

Dengan hormat,

Tuliskan pesan Anda di sini...

Salam,
[Nama Sales]
[Perusahaan Sales]`,
  },
];
