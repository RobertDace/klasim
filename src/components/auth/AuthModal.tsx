// src/components/auth/AuthModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginAction, registerAction } from '@/actions/auth';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openLoginModal, openRegisterModal, setUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (authModalMode === 'register') {
        const res = await registerAction({ name, email, password });
        if (res.success && res.user) {
          setUser(res.user);
          closeAuthModal();
          return;
        } else {
          setErrorMessage(res.error || 'Pendaftaran gagal.');
        }
      } else {
        const res = await loginAction({ email, password });
        if (res.success && res.user) {
          setUser(res.user);
          closeAuthModal();
          return;
        } else {
          setErrorMessage(res.error || 'Email atau password salah.');
        }
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-mono">
      {/* Backdrop blur overlay */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#05070c]/80 backdrop-blur-md animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        {/* Header HUD */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-400 font-bold text-xs text-black">
              K
            </div>
            <div>
              <span className="block text-[11px] font-black uppercase text-white font-sans">
                KLASIM SECURITY GATE
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-500">
                USER AUTHENTICATION
              </span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:border-white/30 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="my-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/50 p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              openLoginModal();
            }}
            className={`rounded-lg py-2 font-bold uppercase transition-all ${
              authModalMode === 'login'
                ? 'bg-amber-400 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MASUK (LOGIN)
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              openRegisterModal();
            }}
            className={`rounded-lg py-2 font-bold uppercase transition-all ${
              authModalMode === 'register'
                ? 'bg-amber-400 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DAFTAR BARU
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Nama Pengguna
              </label>
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="Contoh: Alex Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-slate-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 rounded-xl bg-amber-400 py-3 text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-md shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>MEMVERIFIKASI...</span>
              </>
            ) : (
              <span>{authModalMode === 'login' ? 'MASUK KE AKUN' : 'BUAT AKUN SEKARANG'}</span>
            )}
          </button>
        </form>

        {/* Security Note Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-500">
          <span>ENCRYPTION: BCRYPT + JWT</span>
          <span className="text-emerald-400 font-bold">PROTECTED</span>
        </div>
      </div>
    </div>
  );
}

