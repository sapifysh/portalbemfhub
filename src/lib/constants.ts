export const MINISTRIES = [
  'Satuan Pengendali Internal',
  'Deputi Hukum Kepresidenan',
  'Kajian dan Aksi Strategis',
  'Pemberdayaan dan Perlindungan Perempuan',
  'Pengembangan dan Sumber Daya Manusia',
  'Kebudayaan Pemuda dan Olahraga',
  'Ekonomi Kreatif',
  'Sosial dan Linkungan',
  'Pendidikan',
  'Advokasi dan Kesejahteraan Mahasiswa',
  'Dalam dan Luar Negeri',
  'Komunikasi, Media dan Informasi',
] as const;

export type Ministry = (typeof MINISTRIES)[number];

export const STATUS_VALUES = ['PASSED', 'FAILED', 'PENDING'] as const;
export type StatusValue = (typeof STATUS_VALUES)[number];

export const STATUS_LABELS: Record<StatusValue, string> = {
  PASSED: 'Lulus',
  FAILED: 'Belum Lulus',
  PENDING: 'Menunggu Pengumuman',
};

export const STATUS_LABELS_REVERSE: Record<string, StatusValue> = {
  LULUS: 'PASSED',
  'Lulus': 'PASSED',
  'BELUM LULUS': 'FAILED',
  'Belum Lulus': 'FAILED',
  'MENUNGGU PENGUMUMAN': 'PENDING',
  'Menunggu Pengumuman': 'PENDING',
};
