import React, { useState, useEffect } from 'react';
import { Search, Globe, User } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TopBar({ searchQuery, setSearchQuery }: TopBarProps) {
  const [times, setTimes] = useState({
    ist: '',
    cet: '',
    ast: '',
    aest: '',
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      
      const formatTime = (timeZone: string) => {
        return new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);
      };

      setTimes({
        ist: formatTime('Asia/Kolkata'),
        cet: formatTime('Europe/Berlin'),
        ast: formatTime('Asia/Riyadh'),
        aest: formatTime('Australia/Sydney'),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="top-bar-container" className="sticky top-0 w-full h-16 bg-fornnax-card border-b border-fornnax-border flex items-center justify-between px-6 z-20 shrink-0">
      {/* Global Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-fornnax-text-secondary" />
        <input
          type="text"
          id="global-search-input"
          placeholder="Search enquiries, specs, or agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-fornnax-bg text-fornnax-text-primary pl-9 pr-4 py-2 rounded-[8px] border border-fornnax-border text-xs focus:outline-none focus:border-fornnax-red transition-colors font-sans placeholder-fornnax-text-secondary"
        />
      </div>

      {/* Live Clocks & User Profile */}
      <div className="flex items-center space-x-6">
        {/* Timezones Block */}
        <div className="hidden lg:flex items-center space-x-4 border-r border-fornnax-border pr-6">
          <div className="flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary">
            <Globe className="w-3.5 h-3.5 text-fornnax-red" />
            <span>HQ & Global Markets:</span>
          </div>

          {/* IST Clock */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono font-semibold text-fornnax-text-secondary">IST (IN)</span>
            <span className="text-xs font-mono text-fornnax-text-primary tracking-wide bg-fornnax-bg px-2 py-0.5 rounded border border-fornnax-border">
              {times.ist || '00:00:00'}
            </span>
          </div>

          {/* AST Clock */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono font-semibold text-fornnax-amber">AST (KSA)</span>
            <span className="text-xs font-mono text-fornnax-text-primary tracking-wide bg-fornnax-bg px-2 py-0.5 rounded border border-fornnax-border">
              {times.ast || '00:00:00'}
            </span>
          </div>

          {/* CET Clock */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono font-semibold text-fornnax-text-secondary">CET (EU)</span>
            <span className="text-xs font-mono text-fornnax-text-primary tracking-wide bg-fornnax-bg px-2 py-0.5 rounded border border-fornnax-border">
              {times.cet || '00:00:00'}
            </span>
          </div>

          {/* AEST Clock */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono font-semibold text-fornnax-green">AEST (AU)</span>
            <span className="text-xs font-mono text-fornnax-text-primary tracking-wide bg-fornnax-bg px-2 py-0.5 rounded border border-fornnax-border">
              {times.aest || '00:00:00'}
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-medium text-fornnax-text-primary block font-sans">
              Fornnax Sales Team
            </span>
            <span className="text-[9px] font-mono text-fornnax-red uppercase tracking-[0.08em] block">
              GLOBAL EXPORTS
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-fornnax-bg border border-fornnax-border flex items-center justify-center text-fornnax-red shadow-inner">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
