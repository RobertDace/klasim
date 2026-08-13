// src/components/tournament/PlayoffBracket.tsx
'use client';

import { useState } from 'react';
import { TeamStanding } from '@/lib/calculator';

interface PlayoffBracketProps {
  standings: TeamStanding[];
}

interface TeamInfo {
  code: string;
  name: string;
}

export default function PlayoffBracket({ standings }: PlayoffBracketProps) {
  const topTeams = standings.slice(0, 6);

  const team1: TeamInfo = topTeams[0] ? { code: topTeams[0].teamCode, name: topTeams[0].teamName } : { code: 'TBD', name: 'Rank 1' };
  const team2: TeamInfo = topTeams[1] ? { code: topTeams[1].teamCode, name: topTeams[1].teamName } : { code: 'TBD', name: 'Rank 2' };
  const team3: TeamInfo = topTeams[2] ? { code: topTeams[2].teamCode, name: topTeams[2].teamName } : { code: 'TBD', name: 'Rank 3' };
  const team4: TeamInfo = topTeams[3] ? { code: topTeams[3].teamCode, name: topTeams[3].teamName } : { code: 'TBD', name: 'Rank 4' };
  const team5: TeamInfo = topTeams[4] ? { code: topTeams[4].teamCode, name: topTeams[4].teamName } : { code: 'TBD', name: 'Rank 5' };
  const team6: TeamInfo = topTeams[5] ? { code: topTeams[5].teamCode, name: topTeams[5].teamName } : { code: 'TBD', name: 'Rank 6' };

  const [m1Winner, setM1Winner] = useState<TeamInfo | null>(null);
  const [m2Winner, setM2Winner] = useState<TeamInfo | null>(null);
  const [m3Winner, setM3Winner] = useState<TeamInfo | null>(null);
  const [m3Loser, setM3Loser] = useState<TeamInfo | null>(null);
  const [m4Winner, setM4Winner] = useState<TeamInfo | null>(null);
  const [m4Loser, setM4Loser] = useState<TeamInfo | null>(null);
  const [m5Winner, setM5Winner] = useState<TeamInfo | null>(null);
  const [m6Winner, setM6Winner] = useState<TeamInfo | null>(null);
  const [m6Loser, setM6Loser] = useState<TeamInfo | null>(null);
  const [m7Winner, setM7Winner] = useState<TeamInfo | null>(null);
  const [champion, setChampion] = useState<TeamInfo | null>(null);

  const handleM1Select = (winner: TeamInfo) => {
    setM1Winner(winner);
  };

  const handleM2Select = (winner: TeamInfo) => {
    setM2Winner(winner);
  };

  const handleM3Select = (winner: TeamInfo, loser: TeamInfo) => {
    setM3Winner(winner);
    setM3Loser(loser);
  };

  const handleM4Select = (winner: TeamInfo, loser: TeamInfo) => {
    setM4Winner(winner);
    setM4Loser(loser);
  };

  const handleM5Select = (winner: TeamInfo) => {
    setM5Winner(winner);
  };

  const handleM6Select = (winner: TeamInfo, loser: TeamInfo) => {
    setM6Winner(winner);
    setM6Loser(loser);
  };

  const handleM7Select = (winner: TeamInfo) => {
    setM7Winner(winner);
  };

  const handleM8Select = (winner: TeamInfo) => {
    setChampion(winner);
  };

  const handleResetPlayoffs = () => {
    setM1Winner(null);
    setM2Winner(null);
    setM3Winner(null);
    setM3Loser(null);
    setM4Winner(null);
    setM4Loser(null);
    setM5Winner(null);
    setM6Winner(null);
    setM6Loser(null);
    setM7Winner(null);
    setChampion(null);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-200">
              Simulator Bagan Playoffs (Double Elimination)
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Klik tim pemenang di tiap pertandingan untuk memajukan tim ke babak selanjutnya.
          </p>
        </div>
        <button
          onClick={handleResetPlayoffs}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-300 transition-all hover:bg-amber-400/10 hover:text-amber-400"
        >
          Reset Bagan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* ROUND 1: PLAY-INS */}
        <div className="space-y-6">
          <div className="font-mono text-[11px] font-black uppercase tracking-wider text-sky-400 border-b border-sky-400/20 pb-2">
            R1 // PLAY-INS (BO5)
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 flex justify-between">
              <span>MATCH 1</span>
              <span>PLAY-IN</span>
            </div>
            <button
              onClick={() => handleM1Select(team3)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m1Winner?.code === team3.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>#3 {team3.code}</span>
              <span className="text-[10px] opacity-80">{team3.name}</span>
            </button>
            <button
              onClick={() => handleM1Select(team6)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m1Winner?.code === team6.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>#6 {team6.code}</span>
              <span className="text-[10px] opacity-80">{team6.name}</span>
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 flex justify-between">
              <span>MATCH 2</span>
              <span>PLAY-IN</span>
            </div>
            <button
              onClick={() => handleM2Select(team4)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m2Winner?.code === team4.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>#4 {team4.code}</span>
              <span className="text-[10px] opacity-80">{team4.name}</span>
            </button>
            <button
              onClick={() => handleM2Select(team5)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m2Winner?.code === team5.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>#5 {team5.code}</span>
              <span className="text-[10px] opacity-80">{team5.name}</span>
            </button>
          </div>
        </div>

        {/* ROUND 2: UPPER SEMIFINALS */}
        <div className="space-y-6">
          <div className="font-mono text-[11px] font-black uppercase tracking-wider text-emerald-400 border-b border-emerald-400/20 pb-2">
            R2 // UPPER SEMIS (BO5)
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] p-3 space-y-2">
            <div className="text-[10px] font-mono text-emerald-400 flex justify-between">
              <span>MATCH 3</span>
              <span>UPPER SEMI 1</span>
            </div>
            <button
              disabled={!m1Winner}
              onClick={() => m1Winner && handleM3Select(team1, m1Winner)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m3Winner?.code === team1.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              <span>#1 {team1.code}</span>
              <span className="text-[10px] opacity-80">{team1.name}</span>
            </button>
            <button
              disabled={!m1Winner}
              onClick={() => m1Winner && handleM3Select(m1Winner, team1)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m1Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m3Winner?.code === m1Winner.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM1: {m1Winner ? m1Winner.code : 'TBD'}</span>
              <span className="text-[10px] opacity-80">{m1Winner ? m1Winner.name : 'Waiting M1'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] p-3 space-y-2">
            <div className="text-[10px] font-mono text-emerald-400 flex justify-between">
              <span>MATCH 4</span>
              <span>UPPER SEMI 2</span>
            </div>
            <button
              disabled={!m2Winner}
              onClick={() => m2Winner && handleM4Select(team2, m2Winner)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                m4Winner?.code === team2.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              <span>#2 {team2.code}</span>
              <span className="text-[10px] opacity-80">{team2.name}</span>
            </button>
            <button
              disabled={!m2Winner}
              onClick={() => m2Winner && handleM4Select(m2Winner, team2)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m2Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m4Winner?.code === m2Winner.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM2: {m2Winner ? m2Winner.code : 'TBD'}</span>
              <span className="text-[10px] opacity-80">{m2Winner ? m2Winner.name : 'Waiting M2'}</span>
            </button>
          </div>
        </div>

        {/* LOWER BRACKET & UPPER FINAL */}
        <div className="space-y-6">
          <div className="font-mono text-[11px] font-black uppercase tracking-wider text-rose-400 border-b border-rose-400/20 pb-2">
            LOWER & UPPER FINALS (BO5)
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.02] p-3 space-y-2">
            <div className="text-[10px] font-mono text-rose-400 flex justify-between">
              <span>MATCH 5</span>
              <span>LOWER SEMI</span>
            </div>
            <button
              disabled={!m3Loser || !m4Loser}
              onClick={() => m3Loser && handleM5Select(m3Loser)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m3Loser
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m5Winner?.code === m3Loser.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>LM3: {m3Loser ? m3Loser.code : 'TBD'}</span>
            </button>
            <button
              disabled={!m3Loser || !m4Loser}
              onClick={() => m4Loser && handleM5Select(m4Loser)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m4Loser
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m5Winner?.code === m4Loser.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>LM4: {m4Loser ? m4Loser.code : 'TBD'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.02] p-3 space-y-2">
            <div className="text-[10px] font-mono text-amber-400 flex justify-between">
              <span>MATCH 6</span>
              <span>UPPER FINAL</span>
            </div>
            <button
              disabled={!m3Winner || !m4Winner}
              onClick={() => m3Winner && m4Winner && handleM6Select(m3Winner, m4Winner)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m3Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m6Winner?.code === m3Winner.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM3: {m3Winner ? m3Winner.code : 'TBD'}</span>
            </button>
            <button
              disabled={!m3Winner || !m4Winner}
              onClick={() => m3Winner && m4Winner && handleM6Select(m4Winner, m3Winner)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m4Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m6Winner?.code === m4Winner.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM4: {m4Winner ? m4Winner.code : 'TBD'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.02] p-3 space-y-2">
            <div className="text-[10px] font-mono text-rose-400 flex justify-between">
              <span>MATCH 7</span>
              <span>LOWER FINAL</span>
            </div>
            <button
              disabled={!m5Winner || !m6Loser}
              onClick={() => m5Winner && handleM7Select(m5Winner)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m5Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m7Winner?.code === m5Winner.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM5: {m5Winner ? m5Winner.code : 'TBD'}</span>
            </button>
            <button
              disabled={!m5Winner || !m6Loser}
              onClick={() => m6Loser && handleM7Select(m6Loser)}
              className={`w-full flex items-center justify-between rounded p-2 font-mono text-xs font-bold transition-all ${
                !m6Loser
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : m7Winner?.code === m6Loser.code
                  ? 'bg-amber-400 text-black ring-1 ring-amber-300'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>LM6: {m6Loser ? m6Loser.code : 'TBD'}</span>
            </button>
          </div>
        </div>

        {/* GRAND FINALS & CHAMPION BADGE */}
        <div className="space-y-6">
          <div className="font-mono text-[11px] font-black uppercase tracking-wider text-amber-400 border-b border-amber-400/20 pb-2">
            GRAND FINALS (BO7)
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.05] p-4 space-y-3 shadow-lg shadow-amber-500/10">
            <div className="text-[10px] font-mono text-amber-400 font-bold flex justify-between">
              <span>MATCH 8</span>
              <span>GRAND FINAL</span>
            </div>
            <button
              disabled={!m6Winner || !m7Winner}
              onClick={() => m6Winner && handleM8Select(m6Winner)}
              className={`w-full flex items-center justify-between rounded p-2.5 font-mono text-xs font-extrabold transition-all ${
                !m6Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : champion?.code === m6Winner.code
                  ? 'bg-amber-400 text-black ring-2 ring-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM6: {m6Winner ? m6Winner.code : 'TBD'}</span>
              <span className="text-[10px] opacity-80">{m6Winner ? m6Winner.name : ''}</span>
            </button>
            <button
              disabled={!m6Winner || !m7Winner}
              onClick={() => m7Winner && handleM8Select(m7Winner)}
              className={`w-full flex items-center justify-between rounded p-2.5 font-mono text-xs font-extrabold transition-all ${
                !m7Winner
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : champion?.code === m7Winner.code
                  ? 'bg-amber-400 text-black ring-2 ring-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>WM7: {m7Winner ? m7Winner.code : 'TBD'}</span>
              <span className="text-[10px] opacity-80">{m7Winner ? m7Winner.name : ''}</span>
            </button>
          </div>

          {/* Champion Vector Badge */}
          {champion ? (
            <div className="rounded-xl border border-amber-400/50 bg-gradient-to-b from-amber-500/20 to-amber-500/5 p-6 text-center space-y-2 animate-fade-in shadow-xl shadow-amber-500/20">
              <div className="flex justify-center">
                <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m12-4v4m3-16v4m-2-2h4M6 17h12M12 3v14" />
                </svg>
              </div>
              <div className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                PROSPECTIVE CHAMPION
              </div>
              <div className="text-2xl font-black text-white uppercase tracking-wider">
                {champion.name}
              </div>
              <div className="font-mono text-xs text-amber-300 font-bold">
                ({champion.code})
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center space-y-2">
              <div className="flex justify-center">
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m12-4v4m3-16v4m-2-2h4M6 17h12M12 3v14" />
                </svg>
              </div>
              <div className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                CHAMPION UNDECIDED
              </div>
              <p className="text-[11px] text-slate-500">
                Selesaikan simulasi match hingga Grand Final untuk melihat juara turnamen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}