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
  const [isMlbbDropdownOpen, setIsMlbbDropdownOpen] = useState(false);
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
    setIsMlbbDropdownOpen(false);
    if (item.href.startsWith('/#')) {
      const targetId = item.href.replace('/#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  };

  const mlbbSubItems = [
    { href: '/mlbb/heroes', label: 'HERO HUB & BUILDS', desc: '133 Hero, Skill, Scaling & Builds', icon: '🛡️' },
    { href: '/mlbb/tier-list', label: 'META TIER LIST', desc: 'Ranking S+ sampai C per Lane', icon: '🏆' },
    { href: '/mlbb/draft', label: 'DRAFT SIMULATOR 5v5', desc: 'Simulasi Pick/Ban & Sinergi Tim', icon: '⚔️' },
    { href: '/mlbb/counter-pick', label: 'COUNTER PICK FINDER', desc: 'Rekomendasi Counter 1-5 Hero', icon: '🎯' },
    { href: '/mlbb/items', label: 'DATABASE ITEM', desc: '90 Equipment, Pasif Unik & Komparator', icon: '📦' },
    { href: '/mlbb/compare', label: 'DUAL HERO COMPARATOR', desc: 'Perbandingan Duel 2 Hero Head-to-Head', icon: '⚖️' },
    { href: '/mlbb/builder', label: 'CUSTOM BUILD CREATOR', desc: 'Workshop Racik 6 Item & Emblem', icon: '🛠️' },
    { href: '/mlbb/builds', label: 'TOURNAMENT BUILDS', desc: '365+ Build Resmi MPL & M-Series', icon: '🎖️' },
    { href: '/mlbb/guides', label: 'STRATEGY & MACRO HUB', desc: '5 Role Masterclasses, Map Timers & Waves', icon: '🧭' },
    { href: '/mlbb/patch-notes', label: 'PATCH NOTES & META', desc: 'Analisis Buff, Nerf & Pergeseran Meta', icon: '📈' },
  ];

  const navItems = [
    { id: 'beranda', label: 'BERANDA', code: '01', href: '/' },
    { id: 'mlbb', label: 'MLBB META', code: '02', href: '/mlbb/heroes', isHighlight: true },
    { id: 'modul', label: 'MODUL TURNAMEN', code: '03', href: '/#modul' },
    { id: 'lab', label: 'SCENARIO LAB', code: '04', href: '/#lab' },
    { id: 'tentang', label: 'TENTANG', code: '05', href: '/#tentang' },
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

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 border border-white/10 bg-slate-950/80 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              if (item.id === 'mlbb') {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setIsMlbbDropdownOpen(true)}
                    onMouseLeave={() => setIsMlbbDropdownOpen(false)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                        isActive || isMlbbDropdownOpen
                          ? 'bg-amber-400 text-black shadow-sm font-black'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={`text-[9px] ${isActive || isMlbbDropdownOpen ? 'text-black/70' : 'text-slate-600'}`}>
                        {item.code}
                      </span>
                      <span>{item.label}</span>
                      <span className="text-[8px] opacity-70">▼</span>
                    </Link>

                    {/* Floating MLBB Meta Dropdown */}
                    {isMlbbDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-80 max-h-[75vh] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="border-b border-white/10 px-3 py-1.5 text-[9px] text-amber-400 font-mono font-bold tracking-wider flex items-center justify-between">
                          <span>MLBB META SUITE</span>
                          <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded">10 TOOLS</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {mlbbSubItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => {
                                setIsMlbbDropdownOpen(false);
                                setIsMobileMenuOpen(false);
                              }}
                              className="group flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all hover:bg-amber-400/10 cursor-pointer"
                            >
                              <span className="text-base shrink-0 mt-0.5">{sub.icon}</span>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors font-sans">
                                  {sub.label}
                                </div>
                                <div className="text-[9px] text-slate-400 truncate font-sans">
                                  {sub.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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
              <span className="text-amber-400">🔍</span>
              <span className="hidden lg:inline text-slate-400">Cari hero, item...</span>
              <kbd className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300 border border-white/10">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/tournament/create"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-[11px] font-black uppercase text-amber-400 transition-all duration-200 hover:bg-amber-400 hover:text-black active:scale-95"
            >
              <span>+ BUAT</span>
              <span className="hidden sm:inline">TURNAMEN</span>
            </Link>

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
                      <span className="text-[9px] text-slate-500">▼</span>
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
                          <span>🏆</span>
                          <span>Turnamen Saya</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        >
                          <span>⎋</span>
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
              <span className="text-amber-400">{isMobileMenuOpen ? '✕' : '☰'}</span>
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
                  <span className="text-amber-400 text-sm">🔍</span>
                  <span className="font-sans text-slate-300">Cari hero, item, modul...</span>
                </span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-400 border border-white/10">
                  ⌘K
                </kbd>
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
                        {item.id === 'mlbb' && (
                          <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[8px] font-mono text-amber-300 border border-amber-400/30">
                            10 TOOLS
                          </span>
                        )}
                      </div>
                      {isActive && <span className="text-amber-400 text-xs">●</span>}
                    </Link>

                    {/* Expandable sub-items for MLBB on Mobile */}
                    {item.id === 'mlbb' && (
                      <div className="grid grid-cols-1 gap-1.5 pl-3 border-l-2 border-amber-400/40 ml-3 py-1">
                        {mlbbSubItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-slate-300 hover:text-amber-400 hover:border-amber-400/30 transition-all text-[11px] font-mono"
                          >
                            <span className="flex items-center gap-2">
                              <span>{sub.icon}</span>
                              <span className="font-bold">{sub.label}</span>
                            </span>
                            <span className="text-[9px] text-slate-500">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
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
                    className="flex w-full items-center justify-center rounded-lg border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-400 uppercase"
                  >
                    🏆 Turnamen Saya
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center text-[10px] text-rose-400 py-1"
                  >
                    Keluar (Logout)
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