// src/components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CommandPalette from '@/components/common/CommandPalette';

interface NavbarProps {
  activeSection?: string;
}

export default function Navbar({ activeSection = 'beranda' }: NavbarProps) {
  const { user, loading: authLoading, openLoginModal, logout } = useAuth();
  const [timeString, setTimeString] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global open-command-palette event listener
  useEffect(() => {
    const handleOpen = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  // 1. Live WIB Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Scroll Progress Meter
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: { id: string; label: string; code: string; href: string }) => {
    setIsMobileMenuOpen(false);
    if (item.href.startsWith('/#')) {
      const targetId = item.href.replace('/#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  };

  const navItems = [
    { id: 'beranda', label: 'BERANDA', code: '01', href: '/' },
    { id: 'mlbb', label: 'MLBB', code: '02', href: '/mlbb', isHighlight: true },
    { id: 'pubgm', label: 'PUBG MOBILE', code: '03', href: '/pubgm' },
    { id: 'valorant', label: 'VALORANT', code: '04', href: '/valorant' },
    { id: 'turnamen', label: 'TURNAMEN', code: '05', href: '/tournament' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#05070c]/95 backdrop-blur-xl font-mono text-xs select-none">
        {/* Micro-Telemetry Rail */}
        <div className="border-b border-white/5 bg-black/40 px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] text-slate-500">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                V2.4 ENGINE
              </span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-400 uppercase">
                LOC: <strong className="text-amber-400">{activeSection.toUpperCase()}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-slate-500">DETERMINISTIC SIMULATION</span>
              <span className="text-slate-700 hidden md:inline">/</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {timeString || '00:00:00 WIB'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 lg:px-8">
          {/* Brand Terminal */}
          <Link
            href="/"
            onClick={() => handleNavClick({ id: 'beranda', label: 'BERANDA', code: '01', href: '/' })}
            className="group flex items-center gap-2.5 sm:gap-3 text-left active:scale-95 transition-transform cursor-pointer"
          >
            <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-amber-400/40 bg-amber-400/10 font-mono text-xs sm:text-sm font-black text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-black">
              <span>K</span>
              <span className="absolute -top-0.5 -left-0.5 h-1 w-1 border-t border-l border-amber-400" />
              <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 border-b border-r border-amber-400" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors font-sans">
                KLASIM
              </span>
              <span className="block text-[7px] sm:text-[8px] uppercase tracking-widest text-slate-500 leading-none">
                STANDINGS TELEMETRY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items (No Dropdown - Direct Navigation to Pages) */}
          <nav className="hidden md:flex items-center gap-1 border border-white/10 bg-slate-950/80 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-sm font-black'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`text-[9px] ${isActive ? 'text-black/70' : 'text-slate-600'}`}>
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action & Auth Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Search Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] text-slate-300 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-white transition-all active:scale-95 cursor-pointer font-mono"
              title="Pencarian Cepat (Ctrl+K)"
            >
              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden lg:inline text-slate-400">Cari hero, item...</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300 border border-white/10 font-mono">
                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" strokeWidth={2.5} />
                </svg>
                <span>K</span>
              </span>
            </button>

            {/* Auth Button Desktop */}
            {!authLoading && (
              <div className="relative hidden sm:block">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-200 hover:border-amber-400/40 hover:text-amber-400 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="max-w-[100px] truncate uppercase">{user.name}</span>
                      <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/15 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        <div className="border-b border-white/10 px-3 py-2 text-[10px] text-slate-400">
                          <span className="block font-bold text-white truncate">{user.name}</span>
                          <span className="block text-[9px] text-slate-500 truncate">{user.email}</span>
                        </div>

                        <Link
                          href="/my-tournaments"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-300 hover:bg-amber-400/10 hover:text-amber-400 transition-all"
                        >
                          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                          </svg>
                          <span>Turnamen Saya</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-300 hover:border-white/30 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <span>MASUK</span>
                  </button>
                )}
              </div>
            )}

            {/* Mobile Burger HUD Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[10px] font-bold uppercase text-slate-300 active:scale-95"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
              <span>MENU</span>
            </button>
          </div>
        </div>

        {/* Hairline Scroll Progress Meter */}
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-amber-400 transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between bg-[#05070c]/98 pt-24 pb-8 px-5 font-mono md:hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-slate-500">
              <span>NAVIGASI SEKSI</span>
              <span>KLASIM TELEMETRY</span>
            </div>

            {/* Quick Search in Mobile Drawer */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3 text-xs font-mono text-slate-200 hover:border-amber-400/40 transition-all active:scale-98"
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="font-sans text-slate-300">Cari hero, item, modul...</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-400 border border-white/10 font-mono">
                  <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" strokeWidth={2.5} />
                  </svg>
                  <span>K</span>
                </span>
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id} className="space-y-1.5">
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs font-bold uppercase transition-all ${
                        isActive
                          ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-md shadow-amber-400/10'
                          : 'border-white/10 bg-black/40 text-slate-300 active:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] text-slate-500 font-normal">{item.code}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="text-amber-400 text-xs">●</span>}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Auth Section in Mobile Drawer */}
            <div className="pt-2">
              {user ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>AKUN AKTIF:</span>
                    <strong className="text-white uppercase">{user.name}</strong>
                  </div>
                  <Link
                    href="/my-tournaments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-400 uppercase"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                    <span>Turnamen Saya</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center gap-1.5 text-center text-[10px] text-rose-400 py-1"
                  >
                    <svg className="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 py-3 text-xs font-bold text-white uppercase"
                >
                  MASUK / DAFTAR AKUN
                </button>
              )}
            </div>
          </div>

          {/* Bottom Drawer Meta */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <Link
              href="/tournament/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-amber-400 py-3 text-xs font-black uppercase text-black active:scale-95 shadow-md shadow-amber-400/20"
            >
              + Buat Turnamen Custom
            </Link>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>LOGIC: DETERMINISTIC</span>
              <span>SYS TIME: {timeString}</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}