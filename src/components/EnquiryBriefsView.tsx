import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Check, 
  MapPin, 
  Printer, 
  ShieldAlert,
  Share2,
  Factory,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  Compass,
  Calendar,
  Layers,
  Cpu,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Enquiry } from '../types';

interface EnquiryBriefsViewProps {
  enquiries: Enquiry[];
  selectedEnquiryId: string | null;
  onUpdateStatus: (id: string, status: Enquiry['status']) => void;
  setActiveTab?: (tab: string) => void;
}

interface BriefDetails {
  briefNo: string;
  projectOverview: string;
  inputMaterial: string;
  requiredCapacity: string;
  outputProduct: string;
  sitePower: string;
  timelineBudget: string;
  recommendedConfig: string;
  suggestedNextAction: string;
  receivedTime: string;
  briefReadyTime: string;
  elapsedTime: string;
  languageTag?: string;
  isFlagged?: boolean;
  flagReason?: string;
}

// Custom curated extended brief parameters matching the exact prompt spec
const CURATED_BRIEFS: Record<string, BriefDetails> = {
  'FNX-EQ-2026-001': {
    briefNo: 'FX-2026-0147',
    projectOverview: 'Establishment of a modern tyre recycling plant in Dammam to address the KSA Extended Producer Responsibility (EPR) regulations. High-capacity continuous processing line requested.',
    inputMaterial: 'Truck tyres, ~3,000 t/month',
    requiredCapacity: '≈10 TPH',
    outputProduct: 'Rubber crumb, sports surfaces grade',
    sitePower: 'Dammam industrial city — land ready, power sanctioned',
    timelineBudget: 'Q1 2027, budget approved',
    recommendedConfig: 'SR-200HD primary shredder → R-Series secondary shredder → granulator line',
    suggestedNextAction: 'Senior sales call within 24h — buyer is comparison-shopping European vendors',
    receivedTime: '02:14 IST',
    briefReadyTime: '02:19 IST',
    elapsedTime: '4m 51s',
    isFlagged: false
  },
  'FNX-EQ-2026-002': {
    briefNo: 'FX-2026-0205',
    projectOverview: 'Expansion of existing tire recycling plant in Cologne, Germany, targeting dual supply of Tire-Derived Fuel (TDF) for cement co-processing and high-grade crumb rubber production. Full CE certification is a mandatory contract criteria.',
    inputMaterial: 'OTR, car, and truck tires, ~2,500 t/month',
    requiredCapacity: '≈3.5 TPH',
    outputProduct: 'TDF chips (50-80mm) & high-purity rubber granules (<4.0mm)',
    sitePower: 'Cologne facility extension — site active, 3-Phase 400V 50Hz CE connection ready',
    timelineBudget: 'Commissioning target Dec 2026, capex allocated (€320,000)',
    recommendedConfig: 'SR-200HD Primary Shredder with CE panel → R-Series High Speed Granulator with dual magnet drum separators',
    suggestedNextAction: 'Draft formal technical-commercial proposal conforming to DIN EN standards. Schedule call with Dr. Weber.',
    receivedTime: '03:41 IST',
    briefReadyTime: '03:44 IST',
    elapsedTime: '3m 12s',
    languageTag: 'Conversation held in German 🇩🇪',
    isFlagged: false
  },
  'FNX-EQ-2026-010': {
    briefNo: 'FX-2026-0093',
    projectOverview: 'Bakersfield, CA non-ferrous recovery facility looking to decommission older European cable sorting equipment and upgrade to high-efficiency, multi-feed metal granulation and gravity separation systems.',
    inputMaterial: 'Armored power lines and copper utility cables, ~1,200 t/month',
    requiredCapacity: '≈4.0 TPH',
    outputProduct: 'High-purity pure copper granules (<5.0 mm)',
    sitePower: 'Operating industrial yard — 3-Phase 480V 60Hz US standard connection active',
    timelineBudget: 'Immediate procurement, financing approved ($360,000 budget)',
    recommendedConfig: 'TR-1500 Cable Granulator + premium Air Gravity Separation Table with localized US electricals',
    suggestedNextAction: 'Transmit FOB Port of Mundra quotation + shipping transit times. Operations Lead is active.',
    receivedTime: '12:45 IST',
    briefReadyTime: '12:48 IST',
    elapsedTime: '3m 05s',
    isFlagged: false
  },
  'FNX-EQ-2026-004': {
    briefNo: 'FX-2026-0312',
    projectOverview: 'Identified broker/intermediary seeking global price lists for broker resale. Zero project parameters, undefined feedstocks, and request for "cheap second-hand price list" suggests a non-qualified price-shopper. Auto-replied and filtered.',
    inputMaterial: 'Undefined / Multiple',
    requiredCapacity: 'Unspecified',
    outputProduct: 'Not specified',
    sitePower: 'No site, non-industrial residential broker office',
    timelineBudget: 'No budget, speculative inquiry',
    recommendedConfig: 'None (Deferred to regional distributors / Standard catalog PDF auto-sent)',
    suggestedNextAction: 'Auto-archived in CRM. Low-priority follow up. No engineering hours spent.',
    receivedTime: '11:47 IST',
    briefReadyTime: '11:47 IST',
    elapsedTime: '14s',
    isFlagged: true,
    flagReason: 'RESELLER / PRICE-SHOPPER'
  }
};

export default function EnquiryBriefsView({
  enquiries,
  selectedEnquiryId,
  onUpdateStatus,
  setActiveTab,
}: EnquiryBriefsViewProps) {
  // Local track of active selection inside briefs tab
  const [activeId, setActiveId] = useState<string>('');

  // Synchronize with external selection if it changes, or default to first valid brief
  useEffect(() => {
    if (selectedEnquiryId) {
      setActiveId(selectedEnquiryId);
    } else if (enquiries.length > 0) {
      // Find first with brief or specs
      const firstWithBrief = enquiries.find(e => e.status === 'brief_ready' || e.status === 'auto_answered') || enquiries[0];
      setActiveId(firstWithBrief.id);
    }
  }, [selectedEnquiryId, enquiries]);

  const activeEnquiry = enquiries.find(e => e.id === activeId) || enquiries[0] || null;

  // Interactivity feedback states
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const getBriefDetails = (enquiry: Enquiry): BriefDetails => {
    if (CURATED_BRIEFS[enquiry.id]) {
      return CURATED_BRIEFS[enquiry.id];
    }
    // Dynamic fallback generator to handle custom simulation / live-chat briefs elegantly
    const lastFour = enquiry.id.slice(-4);
    const isBroker = enquiry.score < 30 || enquiry.companyName.toLowerCase().includes('broker') || enquiry.companyName.toLowerCase().includes('trading');
    return {
      briefNo: `FX-2026-${lastFour}`,
      projectOverview: enquiry.notes || `Automated technical specification synthesis for ${enquiry.companyName} project in ${enquiry.country}.`,
      inputMaterial: enquiry.specs?.inputMaterial || enquiry.material || 'Scrap Tires / Industrial Scrap',
      requiredCapacity: enquiry.specs?.capacity || enquiry.throughput || '≈5.0 TPH',
      outputProduct: enquiry.specs?.targetOutputSize || enquiry.outputSize || 'Rubber crumb / granules',
      sitePower: enquiry.specs?.powerAvailability || 'Land acquired, 3-Phase power sanctioned',
      timelineBudget: `Project target: ${enquiry.specs?.timeline || 'Q1 2027'} • Budget: ${enquiry.specs?.estimatedBudget || enquiry.specs?.budgetStage || 'Approved'}`,
      recommendedConfig: isBroker ? 'None (Deferred to regional distributors / Standard catalog PDF auto-sent)' : 'SR-200HD Primary Shredder → R-Series Secondary Shredder → Granulator Line',
      suggestedNextAction: isBroker ? 'Auto-archived in CRM. Low-priority follow up.' : 'Senior sales call within 24h — buyer is comparison-shopping European vendors',
      receivedTime: enquiry.receivedDate ? enquiry.receivedDate.split(' ')[1] || '14:05' : '14:05',
      briefReadyTime: '14:09 IST',
      elapsedTime: '4m 04s',
      isFlagged: isBroker,
      flagReason: isBroker ? 'RESELLER / PRICE-SHOPPER' : undefined
    };
  };

  const activeBrief = activeEnquiry ? getBriefDetails(activeEnquiry) : null;

  // Render animated lead score dial SVG path
  const renderScoreDial = (score: number) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const isHot = score >= 70;
    const colorClass = isHot ? 'text-fornnax-green' : score >= 40 ? 'text-fornnax-amber' : 'text-fornnax-red';
    const bgGlow = isHot ? 'rgba(16,185,129,0.15)' : score >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(226,58,46,0.15)';

    return (
      <div className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 w-24 h-24 select-none">
        <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
          {/* Track circle */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            className="text-zinc-800"
            strokeWidth="5"
            fill="none"
          />
          {/* Indicator circle */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            style={{ filter: `drop-shadow(0 0 4px ${colorClass})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-sm font-mono font-bold text-white tracking-tighter">{score}</span>
          <span className={`text-[8px] font-mono font-black uppercase ${colorClass}`}>
            {isHot ? 'HOT' : score >= 40 ? 'WARM' : 'COLD'}
          </span>
        </div>
      </div>
    );
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setSuccessToast(null);
    setTimeout(() => {
      setIsExporting(false);
      setSuccessToast("Technical-Commercial Brief PDF generated and downloaded.");
      setTimeout(() => setSuccessToast(null), 3500);
    }, 1500);
  };

  const handleSendToWhatsApp = () => {
    setIsSendingWhatsApp(true);
    setSuccessToast(null);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setSuccessToast("Transmitted structured brief to Fornnax Export Sales Team via WhatsApp Business Gateway.");
      if (activeEnquiry) {
        onUpdateStatus(activeEnquiry.id, 'brief_ready');
      }
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase flex items-center space-x-2">
            <FileText className="w-6 h-6 text-fornnax-red" />
            <span>Enquiry Briefs</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Browse high-fidelity mechanical parameters, project timelines, and recommended machine configurations compiled instantly by Fornnax AI.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-fornnax-green animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            AI Synthesis Node Active
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: List of generated briefs (buyer, flag, score badge, date) */}
        <div className="lg:col-span-4 space-y-3 max-h-[280px] lg:max-h-[750px] overflow-y-auto pr-1">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1 font-bold">
            Available Dossiers ({enquiries.length})
          </div>

          <div className="space-y-2">
            {enquiries.map((enq) => {
              const isActive = enq.id === activeId;
              const brief = getBriefDetails(enq);
              const scoreColor = enq.score >= 70 ? 'bg-fornnax-green/10 text-fornnax-green border-fornnax-green/20' : enq.score >= 40 ? 'bg-fornnax-amber/10 text-fornnax-amber border-fornnax-amber/20' : 'bg-fornnax-red/10 text-fornnax-red border-fornnax-red/20';

              return (
                <button
                  key={enq.id}
                  onClick={() => setActiveId(enq.id)}
                  className={`w-full text-left p-3.5 rounded-[8px] border transition-all duration-150 flex flex-col justify-between ${
                    isActive
                      ? 'bg-zinc-900 border-fornnax-red shadow-[inset_0_0_8px_rgba(226,58,46,0.15)]'
                      : 'bg-fornnax-card/90 border-fornnax-border/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white truncate block">
                          {enq.companyName}
                        </span>
                        <span className="text-xs shrink-0">{enq.countryCode === 'SA' ? '🇸🇦' : enq.countryCode === 'DE' ? '🇩🇪' : enq.countryCode === 'US' ? '🇺🇸' : enq.countryCode === 'IN' ? '🇮🇳' : enq.countryCode === 'EG' ? '🇪🇬' : '🌐'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                        {brief.briefNo} • {enq.receivedDate.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0 space-y-1.5">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${scoreColor}`}>
                        {enq.score} {enq.score >= 70 ? 'HOT' : enq.score >= 40 ? 'WARM' : 'COLD'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights, Flags & Tags */}
                  <div className="flex flex-wrap gap-1 mt-3 w-full">
                    {brief.languageTag && (
                      <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/60 px-1.5 py-0.2 rounded">
                        {brief.languageTag}
                      </span>
                    )}
                    {brief.isFlagged && (
                      <span className="text-[9px] font-mono bg-fornnax-red/10 text-fornnax-red border border-fornnax-red/20 px-1.5 py-0.2 rounded font-semibold animate-pulse">
                        ⚠️ FLAGGED
                      </span>
                    )}
                    {!brief.isFlagged && !brief.languageTag && (
                      <span className="text-[9px] font-mono bg-zinc-800 text-fornnax-green border border-zinc-700/60 px-1.5 py-0.2 rounded flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5 shrink-0" />
                        <span>Validated</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected brief premium document rendering card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Success Notification Alert Toast */}
          {successToast && (
            <div className="bg-fornnax-green/10 border border-fornnax-green/30 text-fornnax-green text-xs font-mono py-2.5 px-4 rounded-[6px] flex items-center space-x-2 animate-fadeIn shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {activeEnquiry && activeBrief ? (
            <div className="space-y-4">
              {/* Premium Document Card */}
              <div className="bg-[#11141A] border-2 border-fornnax-border rounded-[10px] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px] hover:border-zinc-800 transition-colors duration-300">
                
                {/* Engineering Grid Subtle Watermark Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                
                {/* Confidential Stamp */}
                <div className="absolute right-30 top-12 opacity-5 pointer-events-none select-none border-2 border-fornnax-red px-4 py-1 rounded text-fornnax-red font-display text-2xl font-black tracking-widest transform rotate-12">
                  APPROVED EXPORT BRIEF
                </div>

                {/* Document Header Panel */}
                <div className="p-6 border-b border-fornnax-border bg-gradient-to-r from-zinc-900/60 to-transparent relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono bg-fornnax-red/15 text-fornnax-red px-2 py-0.5 rounded border border-fornnax-red/20 uppercase tracking-widest font-black">
                        EXPORT ENQUIRY BRIEF #{activeBrief.briefNo}
                      </span>
                      {activeBrief.languageTag && (
                        <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                          {activeBrief.languageTag}
                        </span>
                      )}
                      {activeBrief.isFlagged && (
                        <span className="text-[9px] font-mono bg-fornnax-red/10 text-fornnax-red border border-fornnax-red/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-fornnax-red" />
                          <span>{activeBrief.flagReason}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-white mt-2.5 uppercase tracking-wide flex items-center space-x-2">
                      <span>{activeEnquiry.companyName}</span>
                      <span className="text-sm shrink-0">{activeEnquiry.countryCode === 'SA' ? '🇸🇦' : activeEnquiry.countryCode === 'DE' ? '🇩🇪' : activeEnquiry.countryCode === 'US' ? '🇺🇸' : activeEnquiry.countryCode === 'IN' ? '🇮🇳' : activeEnquiry.countryCode === 'EG' ? '🇪🇬' : '🌐'} {activeEnquiry.country}</span>
                    </h3>
                    
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] font-mono text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Synthesized {activeEnquiry.receivedDate}</span>
                    </div>
                  </div>

                  {/* Score Dial Arc */}
                  <div className="shrink-0 self-center">
                    {renderScoreDial(activeEnquiry.score)}
                  </div>
                </div>

                {/* Document Main Content Body (Clean Two-Column Grid) */}
                <div className="p-6 md:p-8 space-y-6 relative z-10 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Column Parameters */}
                    <div className="space-y-5">
                      
                      {/* Project Overview */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [01] PROJECT OVERVIEW
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-300 font-sans">
                          {activeBrief.projectOverview}
                        </div>
                      </div>

                      {/* Input Material */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [02] INPUT MATERIAL SPECIFICATION
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-200 font-sans font-medium flex items-center space-x-2">
                          <Layers className="w-4 h-4 text-fornnax-green shrink-0" />
                          <span>{activeBrief.inputMaterial}</span>
                        </div>
                      </div>

                      {/* Required Capacity */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [03] REQUIRED THROUGHPUT / CAPACITY
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-white font-mono font-bold flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-fornnax-green shrink-0" />
                          <span>{activeBrief.requiredCapacity}</span>
                        </div>
                      </div>

                      {/* Output Product */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [04] TARGET OUTPUT PRODUCT SIZE
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-200 font-sans font-medium flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-fornnax-green shrink-0" />
                          <span>{activeBrief.outputProduct}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right Column Parameters */}
                    <div className="space-y-5">
                      
                      {/* Site & Power */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [05] SITE READY STATE & ELECTRICAL POWER
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-300 font-sans flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-fornnax-amber shrink-0 mt-0.5" />
                          <span>{activeBrief.sitePower}</span>
                        </div>
                      </div>

                      {/* Timeline & Budget */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [06] CAPITAL INVESTMENT & TIMELINE
                        </span>
                        <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-300 font-sans flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-fornnax-amber shrink-0 mt-0.5" />
                          <span>{activeBrief.timelineBudget}</span>
                        </div>
                      </div>

                      {/* Recommended Fornnax Configuration */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [07] RECOMMENDED FORNNAX PLANT SELECTION
                        </span>
                        <div className="p-3 bg-zinc-900/60 border border-fornnax-red/20 rounded-[6px] text-xs leading-relaxed text-white font-sans font-bold shadow-[0_0_10px_rgba(226,58,46,0.03)]">
                          <span className="text-fornnax-red block mb-1">Proposed Sizing Fleet:</span>
                          <span className="text-[12px]">{activeBrief.recommendedConfig}</span>
                          <span className="block text-[9px] text-zinc-500 font-mono font-medium mt-1.5 italic">
                            * configuration suggestion — engineering validation required before quotation signing
                          </span>
                        </div>
                      </div>

                      {/* Suggested Next Action */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                          [08] EXPORT DESK ACTION PLAN
                        </span>
                        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-[6px] text-xs leading-relaxed text-fornnax-green font-sans font-semibold">
                          {activeBrief.suggestedNextAction}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* KILL DETAIL: Footer strip in mono with subtle green glow */}
                <div className="mt-auto p-4 bg-zinc-950 border-t border-fornnax-border relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 select-none">
                  {/* Subtle neon glow indicator line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-fornnax-green/80 shadow-[0_0_8px_#10B981]" />
                  
                  <div className="flex flex-wrap items-center gap-1.5 leading-relaxed">
                    <span>Enquiry received {activeBrief.receivedTime}</span>
                    <span className="text-zinc-700">•</span>
                    <span>Brief ready {activeBrief.briefReadyTime}</span>
                    <span className="text-zinc-700">•</span>
                    <span>Elapsed <strong className="text-fornnax-green">{activeBrief.elapsedTime}</strong></span>
                    <span className="text-zinc-700">•</span>
                    <span className="bg-fornnax-green/10 text-fornnax-green border border-fornnax-green/20 px-1 py-0.2 rounded font-bold text-[9px]">
                      No human involved
                    </span>
                  </div>

                  <div className="hidden md:block text-zinc-500 font-bold uppercase text-[9px]">
                    FX-AUTOGEN-SECURE
                  </div>
                </div>

              </div>

              {/* Action Buttons Panel */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/30 border border-fornnax-border p-4 rounded-[10px]">
                
                {/* Secondary buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-fornnax-border rounded-[8px] text-xs font-semibold text-white flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-zinc-400" />
                    <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
                  </button>

                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('spec-collector')}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-fornnax-border rounded-[8px] text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center space-x-2 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-zinc-400" />
                      <span>Open conversation</span>
                    </button>
                  )}
                </div>

                {/* Primary Button: Send to WhatsApp */}
                <button
                  onClick={handleSendToWhatsApp}
                  disabled={isSendingWhatsApp}
                  className="px-5 py-2.5 bg-fornnax-green hover:bg-fornnax-green/95 text-white rounded-[8px] text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSendingWhatsApp ? 'Transmitting to Sales...' : 'Send to sales team WhatsApp'}</span>
                </button>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-fornnax-card border border-fornnax-border rounded-[10px] text-zinc-400 text-xs font-mono">
              Please select an enquiry from the list to preview the engineering brief.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
