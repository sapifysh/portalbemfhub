import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getParticipantByNim, isApiConfigured } from '../lib/api';

export function HomePage() {
  const [nim, setNim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiReady = isApiConfigured();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) {
      setError('Silakan masukkan NIM Anda.');
      return;
    }

    setLoading(true);
    setError('');

    console.log('Search initiated for NIM:', nim.trim());
    console.log('API Ready:', apiReady);

    if (!apiReady) {
      setError('Sistem belum dikonfigurasi. Silakan hubungi administrator.');
      setLoading(false);
      return;
    }

    try {
      const response = await getParticipantByNim(nim.trim());
      console.log('Search response:', response);

      if (response.success && response.data) {
        console.log('Participant found, navigating to result page');
        navigate(`/hasil/${encodeURIComponent(response.data.nim)}`);
      } else {
        console.log('Participant not found or error:', response.error);
        if (response.error === 'PARTICIPANT_NOT_FOUND') {
          setError('NIM tidak ditemukan. Pastikan NIM yang Anda masukkan benar.');
        } else if (response.error === 'NETWORK_ERROR' || response.error === 'TIMEOUT') {
          setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
        } else if (response.error === 'API_NOT_CONFIGURED') {
          setError('Sistem belum dikonfigurasi. Silakan hubungi administrator.');
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Theme Toggle - Viewport Level */}
      <button
        onClick={toggleTheme}
        className="theme-toggle-fixed"
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="min-h-screen flex flex-col relative">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 sm:py-28 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 max-w-3xl">
          <p
            className="text-eyebrow mb-5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            HASIL SELEKSI
          </p>
          <h1
            className="text-h1 mb-6"
            style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700 }}
          >
            Pengumuman Staf Muda
          </h1>
          <p
            className="text-body"
            style={{ color: 'var(--color-text-secondary)', opacity: 0.65, fontSize: '17px' }}
          >
            BEM RDM FHUB · Kabinet Resonansi Kita
          </p>
        </div>

        {/* Search Card — Large Horizontal Glass Surface */}
        <div 
          className="glass-card card-enter w-full max-w-2xl p-8 sm:p-10"
          style={{
            background: isDark ? 'rgba(26, 31, 46, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: isDark ? '1px solid rgba(45, 55, 72, 0.4)' : '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <form onSubmit={handleSearch} className="space-y-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  id="nim-input"
                  type="text"
                  value={nim}
                  onChange={(e) => {
                    setNim(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan NIM"
                  className="input pr-12"
                  style={{ fontSize: '16px' }}
                  autoComplete="off"
                  aria-describedby={error ? 'nim-error' : undefined}
                />
                <Search
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary !px-8 whitespace-nowrap"
                style={{ fontSize: '15px' }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Cek Hasil'
                )}
              </button>
            </div>

            {error && (
              <p
                id="nim-error"
                className="text-body-small px-4 py-3 rounded-xl"
                style={{
                  color: 'var(--color-error)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  fontWeight: 500,
                }}
                role="alert"
              >
                {error}
              </p>
            )}
          </form>

          {!apiReady && (
            <p
              className="text-caption mt-6 text-center px-4 py-2 rounded-xl relative z-10"
              style={{
                color: 'var(--color-text-muted)',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              Sistem belum dikonfigurasi. Silakan hubungi administrator.
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 sm:mt-24 text-center">
          <p className="text-caption" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            © 2025 BEM RDM FHUB
          </p>
        </footer>
      </main>
    </div>
    </>
  );
}
