// src/components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  activeSection?: string;
}

export default function Navbar({ activeSection = 'beranda' }: NavbarProps) {
  const [timeString, setTimeString] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'beranda', label: 'BERANDA', code: '01' },
    { id: 'modul', label: 'MODUL TURNAMEN', code: '02' },
    { id: 'lab', label: 'SCENARIO LAB', code: '03' },
    { id: 'tentang', label: 'TENTANG', code: '04' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#05070c]/90 backdrop-blur-xl font-mono text-xs select-none">
      {/* Micro-Telemetry Rail */}
      <div className="border-b border-white/5 bg-black/40 px-4 py-1.5 text-[10px] text-slate-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TELEMETRY ENGINE V2.4
            </span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400 uppercase hidden sm:inline">
              SEKSI AKTIF: <strong className="text-amber-400">{activeSection.toUpperCase()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-500">DETERMINISTIC SIMULATION</span>
            <span className="text-slate-700 hidden md:inline">/</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {timeString || '00:00:00 WIB'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Terminal */}
        <button
          onClick={() => scrollToSection('beranda')}
          className="group flex items-center gap-3 text-left active:scale-95 transition-transform"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded border border-amber-400/40 bg-amber-400/10 font-mono text-sm font-black text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-black">
            <span>K</span>
            <span className="absolute -top-1 -left-1 h-1 w-1 border-t border-l border-amber-400" />
            <span className="absolute -bottom-1 -right-1 h-1 w-1 border-b border-r border-amber-400" />
          </div>
          <div>
            <span className="block text-sm font-black uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors">
              KLASIM
            </span>
            <span className="block text-[8px] uppercase tracking-widest text-slate-500 leading-none">
              STANDINGS TELEMETRY
            </span>
          </div>
        </button>

        {/* Page Section Navigation (Navbar Umum) */}
        <nav className="hidden md:flex items-center gap-1 border border-white/10 bg-slate-950/80 p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`text-[9px] ${isActive ? 'text-black/70' : 'text-slate-600'}`}>
                  {item.code}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/tournament/create"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-[11px] font-black uppercase text-amber-400 transition-all duration-200 hover:bg-amber-400 hover:text-black active:scale-95"
          >
            <span>+ BUAT TURNAMEN</span>
          </Link>
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
  );
}