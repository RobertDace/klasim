// src/app/my-tournaments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserTournamentsAction, deleteCustomTournamentAction } from '@/actions/tournament';

export default function MyTournamentsPage() {
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [maxQuota, setMaxQuota] = useState(5);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await getUserTournamentsAction();
      if (res.success && res.tournaments) {
        setTournaments(res.tournaments);
        setQuotaUsed(res.quotaUsed || 0);
        setMaxQuota(res.maxQuota || 5);
      }
    } catch (err) {
      console.error('Error fetching user tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchTournaments();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/tournament/custom/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = async (tournamentId: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus turnamen ini? Tindakan ini akan mengosongkan slot kuota cloud kamu.')) {
      return;
    }

    setDeletingId(tournamentId);
    try {
      const res = await deleteCustomTournamentAction(tournamentId);
      if (res.success) {
        setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
        setQuotaUsed((prev) => Math.max(0, prev - 1));
      } else {
        alert(res.error || 'Gagal menghapus turnamen.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus turnamen.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black font-mono">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Top */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BERANDA
          </Link>

          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            CLOUD TOURNAMENT MANAGEMENT
          </span>
        </div>

        {/* Header Dashboard */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              DASHBOARD PENGGUNA
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight font-sans">
              TURNAMEN SAYA
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Kelola turnamen kustom yang tersimpan di cloud Neon PostgreSQL milik akunmu.
            </p>
          </div>

          {user && (
            <Link
              href="/tournament/create"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black uppercase text-black transition-all hover:bg-amber-300 active:scale-95 shadow-md shadow-amber-400/20"
            >
              <span>+ BUAT TURNAMEN BARU</span>
            </Link>
          )}
        </div>

        {/* Guest Guard Banner if not logged in */}
        {!authLoading && !user && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-6 text-center space-y-4 backdrop-blur-xl">
            <div className="text-base font-black uppercase text-amber-400 font-sans">
              ANDA BELUM MASUK KE AKUN
            </div>
            <p className="max-w-md mx-auto text-xs text-slate-300">
              Masuk atau buat akun gratis untuk mengelola turnamen cloud, membagikan tautan publik, dan mengamankan kuota turnamenmu.
            </p>
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-black uppercase text-black hover:bg-amber-300 active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              MASUK / DAFTAR SEKARANG
            </button>
          </div>
        )}

        {/* User Quota Card */}
        {user && (
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] uppercase text-slate-500">KAPASITAS CLOUD DATABASE</div>
              <div className="text-sm font-bold text-white">
                <span className="text-amber-400 font-black text-lg">{quotaUsed}</span> / {maxQuota} Slot Turnamen Digunakan
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${(quotaUsed / maxQuota) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Free Tier (5 Slot Max)</span>
                <span>{maxQuota - quotaUsed} Tersedia</span>
              </div>
            </div>
          </div>
        )}

        {/* Tournaments List */}
        {user && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
              <span>DAFTAR TURNAMEN AKTIF ({tournaments.length})</span>
              <span>PROVIDER: NEON POSTGRESQL</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-slate-500">
                <span className="inline-block h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-2" />
                MEMUAT DAFTAR TURNAMEN CLOUD...
              </div>
            ) : tournaments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-black/40 p-12 text-center space-y-3">
                <div className="text-sm font-bold text-slate-400">Belum ada turnamen tersimpan di cloud</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Buat turnamen kustom pertamamu sekarang untuk mendapatkan tautan publik yang bisa dibagikan ke komunitas.
                </p>
                <Link
                  href="/tournament/create"
                  className="inline-block rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-400/20 transition-all"
                >
                  + Buat Turnamen Sekarang
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tournaments.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl hover:border-amber-400/40 transition-all"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-400 border border-amber-400/30">
                          {t.game?.name || t.format}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(t.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black uppercase text-white font-sans">
                        {t.name}
                      </h3>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>👥 {t.teams?.length || 0} Tim</span>
                        <span>•</span>
                        <span>⚔️ {t.matches?.length || 0} Pertandingan</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">Cloud Synced ✓</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <button
                        onClick={() => handleCopyLink(t.slug)}
                        className="flex-1 sm:flex-initial rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-all cursor-pointer"
                      >
                        {copiedSlug === t.slug ? '✓ TERSALIN' : '🔗 SALIN LINK'}
                      </button>

                      <Link
                        href={`/tournament/custom/${t.slug}`}
                        className="flex-1 sm:flex-initial rounded-xl bg-amber-400 px-4 py-2 text-[11px] font-black uppercase text-black hover:bg-amber-300 transition-all text-center"
                      >
                        BUKA SIMULATOR
                      </Link>

                      <button
                        disabled={deletingId === t.id}
                        onClick={() => handleDelete(t.id)}
                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50 cursor-pointer"
                        title="Hapus Turnamen"
                      >
                        {deletingId === t.id ? '...' : 'HAPUS'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

