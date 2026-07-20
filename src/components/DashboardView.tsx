import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Cpu, 
  Activity, 
  MapPin, 
  ArrowUpRight, 
  AlertCircle,
  FileCheck,
  Clock,
  Trash2,
  Globe,
  TrendingDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Enquiry } from '../types';

interface DashboardViewProps {
  enquiries: Enquiry[];
  onSelectEnquiry: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

// Reusable Count-Up Number Component for dense numbers
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const incrementTime = 30;
    const totalSteps = duration / incrementTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono font-bold">
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Custom response time minute/second tracker
function AnimatedTimeCounter() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = duration / 30;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      setMinutes(Math.min(Math.round(4 * ratio), 4));
      setSeconds(Math.min(Math.round(32 * ratio), 32));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono font-bold">
      {minutes}m {seconds}s
    </span>
  );
}

interface TickerItem {
  id: string;
  flag: string;
  company: string;
  interest: string;
  time: string;
  isNew?: boolean;
}

export default function DashboardView({ enquiries, onSelectEnquiry, setActiveTab }: DashboardViewProps) {
  // Initial live ticker items pool as requested
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { id: '1', flag: '🇸🇦', company: 'Al Rashid Recycling LLC', interest: 'Tyre recycling plant, TDF output', time: '02:14 IST' },
    { id: '2', flag: '🇩🇪', company: 'EcoKreis GmbH', interest: 'SR-200HD primary shredder', time: '03:41 IST' },
    { id: '3', flag: '🇦🇺', company: 'TyreCycle Australia', interest: 'Complete OTR tyre line', time: '05:02 IST' },
    { id: '4', flag: '🇳🇬', company: 'Lagos Tyre & Metal', interest: 'Rubber crumb plant', time: '06:15 IST' },
  ]);

  // Pool of rotating simulated live feeds to feed the live ticker stream
  const livePool: Omit<TickerItem, 'id' | 'time'>[] = [
    { flag: '🇶🇦', company: 'Doha Waste Recovery', interest: 'SR-200 dual shaft line' },
    { flag: '🇺🇸', company: 'Liberty Tire Solutions LLC', interest: 'High-torque wire scrap separator' },
    { flag: '🇻🇳', company: 'Vietnam Rubber Tech Co.', interest: 'SR-150 primary tire shredder' },
    { flag: '🇦🇪', company: 'Gulf Green Industrial Solutions', interest: 'Tyre crumb processor plant' },
    { flag: '🇲🇾', company: 'Kuala Lumpur Tyre Sorters', interest: 'Steel wire extraction unit' },
    { flag: '🇺🇦', company: 'Kiev Shina Resource', interest: 'Custom OTR granulator R-2000' },
  ];

  // Dynamic feed update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random from pool
      const index = Math.floor(Math.random() * livePool.length);
      const picked = livePool[index];
      
      const now = new Date();
      // Format time as IST
      const istHours = String(now.getHours()).padStart(2, '0');
      const istMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${istHours}:${istMinutes} IST`;

      const newItem: TickerItem = {
        id: Math.random().toString(),
        flag: picked.flag,
        company: picked.company,
        interest: picked.interest,
        time: timeStr,
        isNew: true
      };

      // Add to front of list and limit to 7 items
      setTickerItems(prev => [newItem, ...prev.map(item => ({ ...item, isNew: false }))].slice(0, 7));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Editorial Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-fornnax-border pb-5 gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-fornnax-text-primary uppercase flex items-center gap-2">
            <Globe className="w-6 h-6 text-fornnax-red" />
            <span>Export Intelligence Hub</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Real-time global recycling equipment sales pipeline powered by autonomous parsing, customs correlation, and dual-use risk verification.
          </p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => setActiveTab('inbox')}
            className="px-4 py-2 bg-fornnax-card hover:bg-white/[0.02] border border-fornnax-border rounded-[8px] text-xs font-semibold text-fornnax-text-primary transition-all duration-150 flex items-center space-x-2"
          >
            <span>Access Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => setActiveTab('orchestration')}
            className="px-4 py-2 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[8px] text-xs font-semibold transition-all duration-150 flex items-center space-x-2 shadow-[0_0_15px_rgba(226,58,46,0.2)]"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>System Status: 5/5 Daemons</span>
          </button>
        </div>
      </div>

      {/* KPI GRID - 5 columns layout for executive visual impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 card-hover-effect flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-fornnax-red/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary block">
              Enquiries This Month
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-display font-bold text-fornnax-text-primary">
                <AnimatedNumber value={47} />
              </span>
              <span className="text-fornnax-green text-[10px] font-mono font-medium flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +14%
              </span>
            </div>
          </div>
          <div className="border-t border-fornnax-border/50 pt-3 mt-4 text-[10px] text-fornnax-text-secondary leading-snug">
            Email <span className="text-fornnax-text-primary font-mono font-semibold">18</span> · WhatsApp <span className="text-fornnax-text-primary font-mono font-semibold">14</span> · Web <span className="text-fornnax-text-primary font-mono font-semibold">9</span> · IndiaMART <span className="text-fornnax-text-primary font-mono font-semibold">6</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 card-hover-effect flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-fornnax-green/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary block">
              Avg First Response
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-display font-bold text-fornnax-green">
                <AnimatedTimeCounter />
              </span>
            </div>
          </div>
          <div className="mt-4 pt-1.5">
            <span className="px-2 py-1 rounded bg-fornnax-green/15 text-fornnax-green text-[9px] font-mono font-semibold tracking-tight inline-block uppercase">
              vs 29h industry average
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 card-hover-effect flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-fornnax-amber/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary block">
              Briefs Auto-Generated
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-display font-bold text-fornnax-text-primary">
                <AnimatedNumber value={41} />
              </span>
              <span className="px-1.5 py-0.5 bg-fornnax-amber/15 text-fornnax-amber rounded text-[9px] font-mono">
                AI Sized
              </span>
            </div>
          </div>
          <div className="border-t border-fornnax-border/50 pt-3 mt-4 text-[10px] text-fornnax-text-secondary">
            <span className="text-fornnax-text-primary font-mono font-semibold">87%</span> required zero human input
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 card-hover-effect flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-fornnax-red/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary block">
              Pipeline Value
            </span>
            <div className="flex items-baseline space-x-1 mt-2">
              <span className="text-3xl font-display font-bold text-fornnax-red">
                <AnimatedNumber value={38.4} decimals={1} prefix="₹" suffix=" Cr" />
              </span>
            </div>
          </div>
          <div className="border-t border-fornnax-border/50 pt-3 mt-4 text-[10px] text-fornnax-text-secondary leading-snug">
            <span className="text-fornnax-red font-mono font-semibold">12 hot</span> · <span className="text-fornnax-amber font-mono font-semibold">19 warm</span> leads currently sized
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 card-hover-effect flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-fornnax-text-secondary/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-fornnax-text-secondary block">
              Low-Quality Flagged
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-3xl font-display font-bold text-fornnax-text-secondary">
                <AnimatedNumber value={11} />
              </span>
              <span className="px-1.5 py-0.5 bg-fornnax-bg border border-fornnax-border text-fornnax-text-secondary rounded text-[9px] font-mono">
                Filtered
              </span>
            </div>
          </div>
          <div className="border-t border-fornnax-border/50 pt-3 mt-4 text-[10px] text-fornnax-green font-semibold">
            ~9 team-hours saved
          </div>
        </div>
      </div>

      {/* CORE PIPELINE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Live Enquiry Feed & Speed Comparison Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Enquiry Feed Panel */}
          <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-5 flex flex-col justify-between h-[340px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-fornnax-green live-pulse shrink-0" />
                  <h4 className="font-display text-xs font-bold text-fornnax-text-primary uppercase tracking-wider">
                    Live Global Enquiry Transceiver
                  </h4>
                </div>
                <span className="text-[9px] font-mono text-fornnax-text-secondary uppercase">
                  Automatic IMAP/API Ingestion (24/7)
                </span>
              </div>

              {/* Scrolling Window Wrapper */}
              <div className="overflow-y-auto space-y-2 h-[220px] pr-1 select-none">
                {tickerItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-[8px] bg-fornnax-bg border border-fornnax-border/60 transition-all duration-300 flex items-center justify-between group ${
                      item.isNew 
                        ? 'border-fornnax-red bg-fornnax-red/5 shadow-[inset_0_0_10px_rgba(226,58,46,0.04)] animate-[fadeIn_0.5s_ease-out]' 
                        : 'hover:border-fornnax-red/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Flag Badge */}
                      <span className="text-xl shrink-0" title="Country Flag">
                        {item.flag}
                      </span>

                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-fornnax-text-primary font-sans">
                            {item.company}
                          </span>
                          {item.isNew && (
                            <span className="px-1.5 py-0.2 bg-fornnax-red text-white text-[8px] font-mono font-bold uppercase rounded tracking-wider animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-fornnax-text-secondary font-mono truncate mt-0.5">
                          {item.interest}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <span className="text-[10px] font-mono text-fornnax-text-secondary bg-fornnax-card px-2 py-1 rounded border border-fornnax-border">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[9px] font-mono text-fornnax-text-secondary flex justify-between items-center border-t border-fornnax-border/50 pt-3 mt-2">
              <span>Streaming secure trade logs...</span>
              <span className="text-fornnax-green font-semibold">● Live pipeline active</span>
            </div>
          </div>

          {/* Response-time comparison Chart */}
          <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-display text-xs font-bold text-fornnax-text-primary uppercase tracking-wider">
                  Lead Conversion Speed Benchmarks
                </h4>
                <p className="text-[10px] text-fornnax-text-secondary mt-0.5">
                  Visualizing lead response time delays against standard manufacturing operations.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-fornnax-red/10 border border-fornnax-red/35 text-fornnax-red text-[9px] font-mono font-semibold uppercase rounded tracking-wider">
                Speed is the new reference
              </span>
            </div>

            {/* Response Time Custom Bar Chart */}
            <div className="space-y-4 pt-1">
              {/* Fornnax with AI */}
              <div>
                <div className="flex justify-between text-xs mb-1 items-center">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-fornnax-red live-pulse" />
                    <span className="font-sans font-bold text-fornnax-text-primary">Fornnax with AI</span>
                  </div>
                  <span className="font-mono font-extrabold text-fornnax-red text-xs bg-fornnax-red/10 px-2 py-0.5 rounded border border-fornnax-red/20">
                    4.5 minutes
                  </span>
                </div>
                <div className="w-full h-7 bg-fornnax-bg rounded-[6px] overflow-hidden border border-fornnax-border/80 flex items-center p-1">
                  <div className="h-full bg-fornnax-red rounded-[4px] shadow-[0_0_12px_rgba(226,58,46,0.5)] animate-[widthGrow_1.2s_ease-out]" style={{ width: '12%' }} />
                  <span className="text-[9px] font-mono text-fornnax-red ml-2 font-bold uppercase tracking-widest animate-pulse">Ultra-Fast Outbound Sizing</span>
                </div>
              </div>

              {/* Industry Average */}
              <div>
                <div className="flex justify-between text-xs mb-1 items-center">
                  <span className="font-sans text-fornnax-text-secondary pl-3.5">Industry Average</span>
                  <span className="font-mono text-fornnax-text-secondary text-xs">
                    29 hours
                  </span>
                </div>
                <div className="w-full h-7 bg-fornnax-bg rounded-[6px] overflow-hidden border border-fornnax-border/80 flex items-center p-1">
                  <div className="h-full bg-fornnax-text-secondary/20 rounded-[4px] animate-[widthGrow_1.2s_ease-out]" style={{ width: '75%' }} />
                  <span className="text-[9px] font-mono text-fornnax-text-secondary/60 ml-2">Manual Parsing Delay</span>
                </div>
              </div>

              {/* European competitors */}
              <div>
                <div className="flex justify-between text-xs mb-1 items-center">
                  <span className="font-sans text-fornnax-text-secondary pl-3.5">European Competitors</span>
                  <span className="font-mono text-fornnax-text-secondary text-xs">
                    1–2 Business Days (~40 hours)
                  </span>
                </div>
                <div className="w-full h-7 bg-fornnax-bg rounded-[6px] overflow-hidden border border-fornnax-border/80 flex items-center p-1">
                  <div className="h-full bg-fornnax-text-secondary/40 rounded-[4px] animate-[widthGrow_1.2s_ease-out]" style={{ width: '100%' }} />
                  <span className="text-[9px] font-mono text-fornnax-text-secondary/60 ml-2">Quote Backlog Queue</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-fornnax-bg border border-fornnax-border/50 rounded-[8px] text-[10px] font-mono text-fornnax-text-secondary leading-normal">
              <span className="text-fornnax-green font-bold uppercase">ROI METRIC:</span> Because recycling buyers request quotes from multiple suppliers simultaneously, responding in <span className="text-fornnax-text-primary">4.5 minutes</span> versus the industry standard of <span className="text-fornnax-text-primary">29 hours</span> increases lead conversion probability by <span className="text-fornnax-green font-semibold font-mono">312%</span>.
            </div>
          </div>
        </div>

        {/* Right Column - Enquiries by Region & Tactical Alerts */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Enquiries by Region Panel */}
          <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-5 flex flex-col justify-between h-[340px]">
            <div>
              <h4 className="font-display text-xs font-bold text-fornnax-text-primary uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-fornnax-red" />
                <span>Geographic Target Markets</span>
              </h4>

              {/* Regional List */}
              <div className="space-y-2.5">
                {[
                  { country: 'Saudi Arabia', flag: '🇸🇦', code: 'KSA', count: 14, trend: 'up' },
                  { country: 'Germany', flag: '🇩🇪', code: 'DEU', count: 9, trend: 'up' },
                  { country: 'Australia', flag: '🇦🇺', code: 'AUS', count: 8, trend: 'up' },
                  { country: 'United Arab Emirates', flag: '🇦🇪', code: 'ARE', count: 6, trend: 'up' },
                  { country: 'Nigeria', flag: '🇳🇬', code: 'NGA', count: 5, trend: 'stable' },
                  { country: 'Vietnam', flag: '🇻🇳', code: 'VNM', count: 4, trend: 'up' },
                  { country: 'United States', flag: '🇺🇸', code: 'USA', count: 3, trend: 'up' },
                ].map((reg) => (
                  <div key={reg.country} className="flex items-center justify-between py-1 border-b border-fornnax-border/30 last:border-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-base shrink-0">{reg.flag}</span>
                      <span className="text-xs font-semibold text-fornnax-text-primary font-sans truncate">
                        {reg.country}
                      </span>
                      <span className="text-[9px] font-mono text-fornnax-text-secondary uppercase">
                        ({reg.code})
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-fornnax-text-primary bg-fornnax-bg px-2 py-0.5 rounded border border-fornnax-border">
                        {reg.count}
                      </span>
                      <span className={`text-xs font-mono ${reg.trend === 'up' ? 'text-fornnax-green' : 'text-fornnax-text-secondary'}`}>
                        {reg.trend === 'up' ? '▲' : '■'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[9px] font-mono text-fornnax-text-secondary text-center pt-2">
              Aggregated from customs shipping logs
            </div>
          </div>

          {/* Strategic Action / Compliance Alert Guard Card */}
          <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-5 space-y-4">
            <h4 className="font-display text-xs font-bold text-fornnax-text-primary uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-fornnax-green" />
              <span>Sovereign Export Compliance Guard</span>
            </h4>

            <div className="space-y-3">
              <div className="flex gap-3 items-start border-l-2 border-fornnax-amber pl-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-fornnax-text-primary">Competitor Pricing Loop</div>
                  <div className="text-[10px] text-fornnax-text-secondary mt-1 font-mono leading-relaxed">
                    Lindner primary pricing index rose by 4% in MENA. High margins target identified.
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 items-start border-l-2 border-fornnax-red pl-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-fornnax-text-primary">Dual-Use Spec Conflict Clear</div>
                  <div className="text-[10px] text-fornnax-text-secondary mt-1 font-mono leading-relaxed">
                    SABIC supplier screening completed. Zero OFAC/EU sanctions flagged on pending bids.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-fornnax-bg border border-fornnax-border/60 rounded-[8px] text-[10px] font-mono text-fornnax-text-secondary leading-relaxed">
              <span className="text-fornnax-red font-bold uppercase">DAEMON LOG:</span> Active scanning of export control regulations is run on every lead ingestion.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
