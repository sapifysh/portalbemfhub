import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { STATUS_LABELS, type StatusValue } from '../lib/constants';
import type { ParticipantData } from '../lib/api';
import { getParticipantByNim, isApiConfigured } from '../lib/api';
import { Header } from '../components/Header';

interface ParticipantDisplay extends ParticipantData {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export function ResultPage() {
  const { nim } = useParams<{ nim: string }>();
  const [participant, setParticipant] = useState<ParticipantDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiReady = isApiConfigured();

  useEffect(() => {
    async function fetchResult() {
      console.log('ResultPage: Fetching result for NIM:', nim);
      
      if (!nim) {
        setError('NIM tidak valid.');
        setLoading(false);
        return;
      }

      if (!apiReady) {
        setError('Sistem belum dikonfigurasi.');
        setLoading(false);
        return;
      }

      try {
        const decodedNim = decodeURIComponent(nim);
        console.log('ResultPage: Decoded NIM:', decodedNim);
        
        const response = await getParticipantByNim(decodedNim);
        console.log('ResultPage: API response:', response);

        if (response.success && response.data) {
          console.log('ResultPage: Setting participant data', response.data);
          setParticipant(response.data as ParticipantDisplay);
        } else {
          console.log('ResultPage: Error or not found:', response.error);
          if (response.error === 'PARTICIPANT_NOT_FOUND') {
            setError('NIM tidak ditemukan.');
          } else {
            setError('Terjadi kesalahan saat memuat data.');
          }
        }
      } catch (error) {
        console.error('ResultPage: Fetch error:', error);
        setError('Tidak dapat terhubung ke server.');
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [nim, apiReady]);

  const renderStatus = (status: StatusValue) => {
    const label = STATUS_LABELS[status];
    const config = {
      PASSED: {
        icon: CheckCircle,
        color: 'var(--color-success)',
        glow: 'rgba(16, 185, 129, 0.15)',
        title: 'Selamat!',
        message: 'Kamu dinyatakan lulus dalam Seleksi Staf Muda BEM RDM FHUB.',
        closing: 'Selamat atas hasil yang telah kamu capai. Sampai bertemu dan berproses bersama di BEM RDM FHUB.',
      },
      FAILED: {
        icon: XCircle,
        color: 'var(--color-error)',
        glow: 'rgba(239, 68, 68, 0.12)',
        title: 'Terima kasih!',
        message: 'Kamu telah menyelesaikan seluruh rangkaian seleksi Staf Muda BEM RDM FHUB.',
        closing: 'Terima kasih atas waktu, antusiasme, dan kontribusi yang telah kamu berikan. Tetap semangat dan sampai bertemu di kesempatan berikutnya.',
      },
      PENDING: {
        icon: Clock,
        color: 'var(--color-warning)',
        glow: 'rgba(245, 158, 11, 0.15)',
        title: 'Hasil Seleksi Belum Tersedia',
        message: 'Hasil seleksi untuk saat ini belum dapat ditampilkan. Silakan kembali setelah pengumuman resmi diterbitkan.',
        closing: '',
      },
    };

    const { icon: Icon, color, glow, title, message, closing } = config[status];

    return (
      <div className="text-center space-y-8 relative z-10">
        {/* Announcement Header */}
        <div className="space-y-2">
          <p className="text-eyebrow" style={{ color: 'var(--color-text-muted)' }}>
            PENGUMUMAN HASIL SELEKSI
          </p>
          <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 'clamp(20px, 3vw, 24px)', lineHeight: 1.3 }}>
            Staf Muda BEM RDM FHUB
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 400, lineHeight: 1.5 }}>
            Kabinet Resonansi Kita
          </p>
        </div>

        {/* Participant Information */}
        {participant && (
          <div className="space-y-3 pt-4">
            <p className="text-eyebrow" style={{ color: 'var(--color-text-muted)' }}>
              Hasil Seleksi
            </p>
            <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 'clamp(28px, 5vw, 34px)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {participant.name}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', fontWeight: 400, lineHeight: 1.5 }}>
              NIM {participant.nim}
            </p>
          </div>
        )}

        {/* Status Display */}
        <div className="py-8 relative">
          {/* Atmospheric glow behind status */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${glow} 0%, transparent 70%)`,
            }}
          />
          
          <div className="relative z-10 space-y-4">
            <p style={{ color: 'var(--color-text-primary)', fontSize: '18px', fontWeight: 600, lineHeight: 1.5 }}>
              {title}
            </p>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}>
              {message}
            </p>

            <h1
              style={{ color, fontSize: 'clamp(48px, 8vw, 56px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              {label}
            </h1>
          </div>
        </div>

        {/* Participant Details */}
        {participant && (
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto pt-4">
            <div className="text-left">
              <p className="text-caption mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Kementerian
              </p>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: 'clamp(16px, 2.5vw, 18px)', lineHeight: 1.5 }}>
                {participant.ministry}
              </p>
            </div>
            <div className="text-left">
              <p className="text-caption mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Status
              </p>
              <p style={{ color, fontWeight: 600, fontSize: 'clamp(16px, 2.5vw, 18px)', lineHeight: 1.5 }}>
                {label}
              </p>
            </div>
          </div>
        )}

        {/* Closing Message */}
        {closing && (
          <div className="pt-4">
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 400, lineHeight: 1.6, fontStyle: 'italic' }}>
              {closing}
            </p>
          </div>
        )}

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 transition-colors hover:opacity-70"
          style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '15px', lineHeight: 1.5 }}
        >
          <ArrowLeft size={16} />
          Kembali ke Pencarian
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            <p className="text-body-small" style={{ color: 'var(--color-text-muted)' }}>Memuat hasil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 relative z-10">
          <div className="glass-card card-enter p-8 sm:p-12 max-w-2xl w-full text-center">
            <div className="relative z-10 space-y-6">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <XCircle size={32} style={{ color: 'var(--color-error)' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-h2" style={{ color: 'var(--color-text-primary)' }}>
                  NIM Tidak Ditemukan
                </h2>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  {error}
                </p>
              </div>
              <Link to="/" className="btn btn-primary inline-flex">
                <ArrowLeft size={16} />
                Kembali
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!participant) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 relative z-10">
        <div className="glass-card card-enter p-8 sm:p-12 max-w-3xl w-full">
          {renderStatus(participant.status as StatusValue)}
        </div>
      </main>
    </div>
  );
}
