import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Mail, 
  Clock, 
  Cpu, 
  FileText, 
  Archive, 
  ChevronRight,
  Filter,
  CheckCircle,
  User,
  ExternalLink,
  MessageCircle,
  Globe,
  Scan,
  ShieldAlert,
  X,
  Sparkles,
  Check,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Enquiry } from '../types';

interface EnquiryInboxViewProps {
  enquiries: Enquiry[];
  selectedEnquiryId: string | null;
  onSelectEnquiry: (id: string | null) => void;
  onUpdateStatus: (id: string, status: Enquiry['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function EnquiryInboxView({
  enquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  onUpdateStatus,
  onUpdateNotes,
  setActiveTab,
}: EnquiryInboxViewProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedScore, setSelectedScore] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!!selectedEnquiryId);

  // Detail Enquiry finding
  const selectedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) || null;

  const handleRowClick = (id: string) => {
    onSelectEnquiry(id);
    setDrawerOpen(true);
  };

  // Channel helper styling
  const getChannelDetails = (channel?: Enquiry['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return {
          icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'WhatsApp',
          bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        };
      case 'email':
        return {
          icon: <Mail className="w-3.5 h-3.5 text-blue-400" />,
          label: 'Email',
          bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        };
      case 'web':
        return {
          icon: <Globe className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Web form',
          bg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        };
      case 'indiamart':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-orange-400" />,
          label: 'IndiaMART',
          bg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        };
      case 'expo':
        return {
          icon: <Scan className="w-3.5 h-3.5 text-indigo-400" />,
          label: 'Expo scan',
          bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        };
      default:
        return {
          icon: <Mail className="w-3.5 h-3.5 text-fornnax-text-secondary" />,
          label: 'Inquiry',
          bg: 'bg-fornnax-bg text-fornnax-text-secondary border border-fornnax-border'
        };
    }
  };

  // Score helper styling
  const getScoreDetails = (score: number) => {
    if (score >= 80) {
      return {
        label: `HOT ${score}`,
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold',
        indicator: 'bg-emerald-500'
      };
    } else if (score >= 50) {
      return {
        label: `WARM ${score}`,
        badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold',
        indicator: 'bg-amber-500'
      };
    } else {
      return {
        label: `FLAGGED ${score}`,
        badgeClass: 'border-2 border-red-500/50 text-red-400 font-bold bg-red-500/5',
        indicator: 'bg-red-500'
      };
    }
  };

  // Status map mapping
  const getStatusDetails = (status: Enquiry['status']) => {
    switch (status) {
      case 'new':
        return {
          label: 'New',
          badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
        };
      case 'collecting':
        return {
          label: 'AI Collecting Specs',
          badgeClass: 'bg-purple-500/15 text-purple-300 border border-purple-500/30 animate-pulse',
        };
      case 'brief_ready':
        return {
          label: 'Brief Ready',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        };
      case 'human_review':
        return {
          label: 'Human Review',
          badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        };
      case 'auto_answered':
        return {
          label: 'Auto-answered',
          badgeClass: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
        };
      case 'analyzing':
        return {
          label: 'AI Sizing specs',
          badgeClass: 'bg-pink-500/15 text-pink-400 border border-pink-500/30',
        };
      case 'action_required':
        return {
          label: 'Action Required',
          badgeClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
        };
      default:
        return {
          label: status.replace('_', ' '),
          badgeClass: 'bg-fornnax-bg text-fornnax-text-secondary border border-fornnax-border',
        };
    }
  };

  // Filtered dataset
  const filteredEnquiries = enquiries.filter(e => {
    // Search filter
    const searchString = `${e.companyName} ${e.country} ${e.material} ${e.emailSubject} ${e.contactPerson}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());

    // Channel filter
    const matchesChannel = selectedChannel === 'all' || e.channel === selectedChannel;

    // Status filter
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;

    // Score filter
    let matchesScore = true;
    if (selectedScore === 'hot') matchesScore = e.score >= 80;
    else if (selectedScore === 'warm') matchesScore = e.score >= 50 && e.score < 80;
    else if (selectedScore === 'flagged') matchesScore = e.score < 50;

    // Region filter
    let matchesRegion = true;
    if (selectedRegion !== 'all') {
      const countryCode = e.countryCode?.toUpperCase();
      if (selectedRegion === 'middle_east') {
        matchesRegion = ['SA', 'AE', 'EG'].includes(countryCode);
      } else if (selectedRegion === 'europe') {
        matchesRegion = ['DE', 'FR', 'IT', 'NL', 'GB', 'ES'].includes(countryCode);
      } else if (selectedRegion === 'apac') {
        matchesRegion = ['IN', 'VN', 'AU', 'KR', 'JP', 'MY', 'SG'].includes(countryCode);
      } else if (selectedRegion === 'north_america') {
        matchesRegion = ['US', 'CA', 'MX'].includes(countryCode);
      } else if (selectedRegion === 'africa') {
        matchesRegion = ['NG', 'ZA', 'GH', 'KE'].includes(countryCode);
      }
    }

    return matchesSearch && matchesChannel && matchesStatus && matchesScore && matchesRegion;
  });

  return (
    <div className="space-y-6 relative">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-fornnax-border pb-4 gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-fornnax-text-primary uppercase flex items-center gap-2">
            <Mail className="w-5.5 h-5.5 text-fornnax-red" />
            <span>Consolidated Enquiry Inbox</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Omni-channel view merging sales emails, WhatsApp pings, website forms, IndiaMART leads, and trade expo scans.
          </p>
        </div>
        <div className="text-xs font-mono text-fornnax-text-secondary bg-fornnax-card border border-fornnax-border px-3 py-1.5 rounded-[8px] flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-fornnax-green live-pulse" />
          <span>{filteredEnquiries.length} Active Leads Listed</span>
        </div>
      </div>

      {/* MULTI-CRITERIA FILTER BAR */}
      <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-fornnax-text-primary uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4 text-fornnax-red" />
          <span>Trade Ingestion Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-fornnax-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buyer, item, region..."
              className="w-full bg-fornnax-bg border border-fornnax-border rounded-[8px] pl-9 pr-3 py-2 text-xs text-fornnax-text-primary focus:outline-none focus:border-fornnax-red placeholder-fornnax-text-secondary"
            />
          </div>

          {/* Channel Dropdown */}
          <div className="flex items-center space-x-1.5 bg-fornnax-bg border border-fornnax-border rounded-[8px] px-2.5 py-1">
            <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase shrink-0">CHNL:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-transparent w-full text-xs text-fornnax-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-fornnax-card">All Channels</option>
              <option value="email" className="bg-fornnax-card">📧 Email</option>
              <option value="whatsapp" className="bg-fornnax-card">💬 WhatsApp</option>
              <option value="web" className="bg-fornnax-card">🌐 Web Form</option>
              <option value="indiamart" className="bg-fornnax-card">🇮🇳 IndiaMART</option>
              <option value="expo" className="bg-fornnax-card">🏷️ Expo Scan</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center space-x-1.5 bg-fornnax-bg border border-fornnax-border rounded-[8px] px-2.5 py-1">
            <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase shrink-0">STUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent w-full text-xs text-fornnax-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-fornnax-card">All Statuses</option>
              <option value="new" className="bg-fornnax-card">New Lead</option>
              <option value="collecting" className="bg-fornnax-card">AI Collecting Specs</option>
              <option value="brief_ready" className="bg-fornnax-card">Brief Ready</option>
              <option value="human_review" className="bg-fornnax-card">Human Review</option>
              <option value="auto_answered" className="bg-fornnax-card">Auto Answered</option>
              <option value="analyzing" className="bg-fornnax-card">AI Sizing Specs</option>
              <option value="action_required" className="bg-fornnax-card">Action Required</option>
            </select>
          </div>

          {/* Lead Score Dropdown */}
          <div className="flex items-center space-x-1.5 bg-fornnax-bg border border-fornnax-border rounded-[8px] px-2.5 py-1">
            <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase shrink-0">SCORE:</span>
            <select
              value={selectedScore}
              onChange={(e) => setSelectedScore(e.target.value)}
              className="bg-transparent w-full text-xs text-fornnax-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-fornnax-card">All Scores</option>
              <option value="hot" className="bg-fornnax-card">🔥 HOT (≥80)</option>
              <option value="warm" className="bg-fornnax-card">⚡ WARM (50-79)</option>
              <option value="flagged" className="bg-fornnax-card">⚠️ FLAGGED (&lt;50)</option>
            </select>
          </div>

          {/* Region/Country Dropdown */}
          <div className="flex items-center space-x-1.5 bg-fornnax-bg border border-fornnax-border rounded-[8px] px-2.5 py-1">
            <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase shrink-0">REGN:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent w-full text-xs text-fornnax-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-fornnax-card">All Regions</option>
              <option value="middle_east" className="bg-fornnax-card">Middle East</option>
              <option value="europe" className="bg-fornnax-card">Europe</option>
              <option value="apac" className="bg-fornnax-card">Asia-Pacific</option>
              <option value="north_america" className="bg-fornnax-card">North America</option>
              <option value="africa" className="bg-fornnax-card">Africa</option>
            </select>
          </div>
        </div>

        {/* Filters Clear Button and Active count */}
        {(selectedChannel !== 'all' || selectedStatus !== 'all' || selectedScore !== 'all' || selectedRegion !== 'all' || search) && (
          <div className="flex justify-between items-center pt-2 text-[11px] font-mono">
            <span className="text-fornnax-text-secondary">
              Showing {filteredEnquiries.length} filtered results of {enquiries.length} total pings
            </span>
            <button 
              onClick={() => {
                setSelectedChannel('all');
                setSelectedStatus('all');
                setSelectedScore('all');
                setSelectedRegion('all');
                setSearch('');
              }}
              className="text-fornnax-red hover:underline flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Active Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* CORE PIPELINE TABLE */}
      <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-fornnax-border bg-fornnax-bg/40 text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-28">Channel</th>
                <th className="py-3 px-4 w-64">Buyer & Country</th>
                <th className="py-3 px-4">Product Interest</th>
                <th className="py-3 px-4 w-40">Spec Completeness</th>
                <th className="py-3 px-4 w-28">Lead Score</th>
                <th className="py-3 px-4 w-40">Workflow Status</th>
                <th className="py-3 px-4 w-32 text-right">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fornnax-border/50 text-xs">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-fornnax-text-secondary font-mono">
                    <ShieldAlert className="w-8 h-8 text-fornnax-border mx-auto mb-2" />
                    <span>No enquiries matched the current active filters.</span>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const channel = getChannelDetails(enq.channel);
                  const score = getScoreDetails(enq.score);
                  const status = getStatusDetails(enq.status);
                  const isSelected = selectedEnquiryId === enq.id;

                  // Get flag emoji from country Code helper
                  const flagEmoji = enq.countryCode === "SA" ? "🇸🇦" :
                                    enq.countryCode === "DE" ? "🇩🇪" :
                                    enq.countryCode === "VN" ? "🇻🇳" :
                                    enq.countryCode === "IN" ? "🇮🇳" :
                                    enq.countryCode === "EG" ? "🇪🇬" :
                                    enq.countryCode === "AU" ? "🇦🇺" :
                                    enq.countryCode === "NG" ? "🇳🇬" :
                                    enq.countryCode === "AE" ? "🇦🇪" :
                                    enq.countryCode === "US" ? "🇺🇸" :
                                    enq.countryCode === "KR" ? "🇰🇷" :
                                    enq.countryCode === "JP" ? "🇯🇵" : "🌐";

                  return (
                    <tr 
                      key={enq.id}
                      onClick={() => handleRowClick(enq.id)}
                      className={`cursor-pointer transition-all duration-150 select-none group relative ${
                        isSelected 
                          ? 'bg-fornnax-red/5 hover:bg-fornnax-red/10' 
                          : 'hover:bg-white/[0.01]'
                      }`}
                    >
                      {/* Channel Icon & Label */}
                      <td className="py-3.5 px-4 font-semibold">
                        <div className="flex items-center space-x-1.5">
                          {channel.icon}
                          <span className="text-[11px] text-fornnax-text-primary">{channel.label}</span>
                        </div>
                      </td>

                      {/* Buyer Name & Flag */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg leading-none shrink-0" title={enq.country}>
                            {flagEmoji}
                          </span>
                          <div className="truncate">
                            <div className="font-semibold text-fornnax-text-primary group-hover:text-fornnax-red transition-colors font-sans truncate">
                              {enq.companyName}
                            </div>
                            <div className="text-[10px] text-fornnax-text-secondary truncate mt-0.5 font-mono">
                              {enq.contactPerson} · {enq.country}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product Interest / Subject */}
                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-xs md:max-w-sm">
                          <span className="text-fornnax-text-primary font-medium">
                            {enq.emailSubject}
                          </span>
                          <p className="text-[10px] text-fornnax-text-secondary truncate mt-0.5 font-mono">
                            Desired: {enq.material} ({enq.throughput})
                          </p>
                        </div>
                      </td>

                      {/* Spec Completeness Animated Progress bar */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-fornnax-text-secondary">AI Spec Match</span>
                            <span className="text-fornnax-text-primary font-bold">{enq.specCompleteness ?? 0}%</span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-fornnax-bg border border-fornnax-border rounded-full overflow-hidden">
                            {/* Animated progress bar with motion/react */}
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${enq.specCompleteness ?? 0}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                (enq.specCompleteness ?? 0) === 100 ? 'bg-fornnax-green' :
                                (enq.specCompleteness ?? 0) >= 50 ? 'bg-fornnax-amber' :
                                'bg-fornnax-red'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Lead Score Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono tracking-tight block text-center ${score.badgeClass}`}>
                          {score.label}
                        </span>
                      </td>

                      {/* Status Workflow stage */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-1 rounded-[6px] text-[10px] font-mono font-medium block text-center ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Received Date Mono timestamp */}
                      <td className="py-3.5 px-4 text-right font-mono text-[10px] text-fornnax-text-secondary">
                        {enq.receivedDate.substring(11, 16)} IST
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED DRAWERS WITH SLIDE-IN EFFECT */}
      <AnimatePresence>
        {drawerOpen && selectedEnquiry && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-[2px]"
            />

            {/* Slide out drawer card container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-fornnax-card border-l border-fornnax-border z-50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 bg-fornnax-bg border-b border-fornnax-border flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-fornnax-text-secondary">
                    <span>{selectedEnquiry.id}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-fornnax-red" />
                      <span>{selectedEnquiry.receivedDate}</span>
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-fornnax-text-primary mt-1 flex items-center space-x-2">
                    <span>{selectedEnquiry.companyName}</span>
                  </h3>
                </div>

                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 bg-fornnax-card hover:bg-fornnax-border border border-fornnax-border rounded-full text-fornnax-text-secondary hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-5">
                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-fornnax-bg/50 border border-fornnax-border/70 rounded-[8px]">
                  <div>
                    <span className="text-[10px] font-mono text-fornnax-text-secondary block uppercase">Contact Person</span>
                    <span className="text-xs font-semibold text-fornnax-text-primary">{selectedEnquiry.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-fornnax-text-secondary block uppercase">Country / Region</span>
                    <span className="text-xs font-semibold text-fornnax-text-primary">{selectedEnquiry.country}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] font-mono text-fornnax-text-secondary block uppercase">Channel Source</span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase mt-0.5 ${getChannelDetails(selectedEnquiry.channel).bg}`}>
                      {getChannelDetails(selectedEnquiry.channel).label}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] font-mono text-fornnax-text-secondary block uppercase">Lead Validation</span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase mt-0.5 ${getScoreDetails(selectedEnquiry.score).badgeClass}`}>
                      {getScoreDetails(selectedEnquiry.score).label} Score
                    </span>
                  </div>
                </div>

                {/* Original Raw Message Area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-[0.08em]">
                      Raw Ingestion Message: "{selectedEnquiry.emailSubject}"
                    </span>
                    <span className="text-[9px] text-fornnax-red font-mono font-semibold uppercase">SECURE ENCRYPTED</span>
                  </div>
                  <div className="p-4 bg-fornnax-bg border border-fornnax-border/60 rounded-[8px] whitespace-pre-wrap font-sans text-xs text-fornnax-text-primary leading-relaxed h-[180px] overflow-y-auto">
                    {selectedEnquiry.emailBody}
                  </div>
                </div>

                {/* Collected Specs Checklist */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-fornnax-border/60 pb-1.5">
                    <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-[0.08em]">
                      Sizing Parameters Checklist ({selectedEnquiry.specCompleteness ?? 0}% Complete)
                    </span>
                    <Cpu className="w-3.5 h-3.5 text-fornnax-red" />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Item 1 */}
                    <div className="p-2.5 rounded-[8px] bg-fornnax-bg border border-fornnax-border/50 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-1 rounded-full ${selectedEnquiry.specs?.inputMaterial ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedEnquiry.specs?.inputMaterial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-fornnax-text-secondary font-mono">Input Material Sized</span>
                      </div>
                      <span className="text-xs font-semibold text-fornnax-text-primary truncate ml-4 max-w-[200px]">
                        {selectedEnquiry.specs?.inputMaterial || "Missing"}
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2.5 rounded-[8px] bg-fornnax-bg border border-fornnax-border/50 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-1 rounded-full ${selectedEnquiry.specs?.targetOutputSize ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedEnquiry.specs?.targetOutputSize ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-fornnax-text-secondary font-mono">Target Output Size</span>
                      </div>
                      <span className="text-xs font-semibold text-fornnax-text-primary truncate ml-4 max-w-[200px]">
                        {selectedEnquiry.specs?.targetOutputSize || "Missing"}
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="p-2.5 rounded-[8px] bg-fornnax-bg border border-fornnax-border/50 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-1 rounded-full ${selectedEnquiry.specs?.capacity ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedEnquiry.specs?.capacity ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-fornnax-text-secondary font-mono">Throughput Capacity</span>
                      </div>
                      <span className="text-xs font-semibold text-fornnax-text-primary truncate ml-4 max-w-[200px]">
                        {selectedEnquiry.specs?.capacity || "Missing"}
                      </span>
                    </div>

                    {/* Item 4 */}
                    <div className="p-2.5 rounded-[8px] bg-fornnax-bg border border-fornnax-border/50 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-1 rounded-full ${selectedEnquiry.specs?.separationRequired !== undefined ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedEnquiry.specs?.separationRequired !== undefined ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-fornnax-text-secondary font-mono">Separation Technology Required</span>
                      </div>
                      <span className="text-xs font-semibold text-fornnax-text-primary font-mono text-right">
                        {selectedEnquiry.specs?.separationRequired ? "Yes (Magnetic/Air)" : "No Stage"}
                      </span>
                    </div>

                    {/* Item 5 */}
                    <div className="p-2.5 rounded-[8px] bg-fornnax-bg border border-fornnax-border/50 flex justify-between items-center">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`p-1 rounded-full ${selectedEnquiry.specs?.estimatedBudget ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {selectedEnquiry.specs?.estimatedBudget ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs text-fornnax-text-secondary font-mono">Estimated Sizing Budget</span>
                      </div>
                      <span className="text-xs font-semibold text-fornnax-text-primary">
                        {selectedEnquiry.specs?.estimatedBudget || "Missing"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Notes Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-[0.08em] block">
                    Engineering Team Notes
                  </label>
                  <textarea
                    value={selectedEnquiry.notes || ''}
                    onChange={(e) => onUpdateNotes(selectedEnquiry.id, e.target.value)}
                    placeholder="Enter customized logistics details or specific trial requests here..."
                    className="w-full h-20 bg-fornnax-bg border border-fornnax-border rounded-[8px] p-2.5 text-xs text-fornnax-text-primary font-sans focus:outline-none focus:border-fornnax-red placeholder-fornnax-text-secondary"
                  />
                </div>
              </div>

              {/* Drawer Bottom Action Row */}
              <div className="p-4 border-t border-fornnax-border bg-fornnax-bg/40 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-fornnax-text-secondary font-mono text-[10px]">
                  <Cpu className="w-3.5 h-3.5 text-fornnax-red" />
                  <span>Sizing Active</span>
                </div>

                <div className="flex space-x-2">
                  {/* Action 1: Open AI Conversation */}
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedEnquiry.id, 'collecting');
                      setActiveTab('spec-collector');
                      setDrawerOpen(false);
                    }}
                    className="px-3.5 py-2 bg-fornnax-bg hover:bg-white/[0.04] border border-fornnax-border rounded-[8px] text-xs font-semibold text-fornnax-text-primary transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Open AI conversation</span>
                  </button>

                  {/* Action 2: View Brief */}
                  <button
                    onClick={() => {
                      if (selectedEnquiry.status === 'new' || selectedEnquiry.status === 'collecting') {
                        onUpdateStatus(selectedEnquiry.id, 'brief_ready');
                      }
                      setActiveTab('briefs');
                      setDrawerOpen(false);
                    }}
                    className="px-4 py-2 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[8px] text-xs font-bold transition-all shadow-[0_0_15px_rgba(226,58,46,0.2)] flex items-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View brief</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
