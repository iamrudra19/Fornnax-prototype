/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import EnquiryInboxView from './components/EnquiryInboxView';
import AiSpecCollectorView from './components/AiSpecCollectorView';
import EnquiryBriefsView from './components/EnquiryBriefsView';
import LeadFinderView from './components/LeadFinderView';
import OutreachStudioView from './components/OutreachStudioView';
import AgentOrchestrationView from './components/AgentOrchestrationView';
import SkeletonLoader from './components/SkeletonLoader';
import { Enquiry, Lead, EnquirySpecs } from './types';
import { INITIAL_ENQUIRIES } from './mockData';
import { Zap, RotateCw, Play, Settings, Sparkles, CheckCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: any;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public state: ErrorBoundaryState;

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-lg text-red-200 font-mono text-xs space-y-4">
          <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
            <span>⚠️ React Rendering Error Detected</span>
          </h2>
          <p className="font-semibold text-white bg-red-900/40 p-3 rounded border border-red-500/20">{this.state.error?.toString()}</p>
          <pre className="p-4 bg-black/45 border border-zinc-800 rounded overflow-auto max-h-60 text-[10px] text-zinc-300 leading-relaxed">
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold font-sans transition-all shadow"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(INITIAL_ENQUIRIES[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactivity and simulation states
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isReplayingSaudi, setIsReplayingSaudi] = useState<boolean>(false);
  const [demoToast, setDemoToast] = useState<{ title: string; message: string } | null>(null);
  const [demoControlsOpen, setDemoControlsOpen] = useState<boolean>(false);

  // Transition handler that triggers beautiful loading skeletons
  const handleTabChange = (tab: string) => {
    setIsPageLoading(true);
    setActiveTab(tab);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  // Automated step-by-step high-fidelity Saudi Enquiry Simulation Replay
  const handleReplaySaudiSimulation = () => {
    if (isReplayingSaudi) return;
    setIsReplayingSaudi(true);
    setIsPageLoading(false); // Do not block with skeletons during active replay transitions
    setDemoControlsOpen(false);

    // Step 0: Immediate Reset to baseline
    setEnquiries(INITIAL_ENQUIRIES);
    setSelectedEnquiryId(null);
    setActiveTab('dashboard');
    setDemoToast({
      title: "TELEMETRY SYNCHRONIZED",
      message: "Resetting database state and spinning up Saudi Vision 2030 WhatsApp ingestion hooks..."
    });

    const dispatchLog = (text: string) => {
      window.dispatchEvent(new CustomEvent('fornnax-simulation-log', { detail: { log: text } }));
    };

    const dispatchNode = (nodeId: string, status: 'Idle' | 'Working' | 'Done') => {
      window.dispatchEvent(new CustomEvent('fornnax-simulation-node-status', { detail: { nodeId, status } }));
    };

    // Step 1: Ingestion Handshake (2.0s)
    setTimeout(() => {
      const liveSaudiLead: Enquiry = {
        id: "FNX-EQ-LIVE-SAUDI-SIRC",
        companyName: "Saudi Investment Recycling Company (SIRC)",
        country: "Saudi Arabia",
        countryCode: "SA",
        material: "Desert OTR & Heavy Truck Tires",
        throughput: "10.0 Tons / Hour",
        outputSize: "< 4.0 mm Rubber Crumb (99.9% wire-free)",
        receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        score: 94,
        status: "new",
        contactPerson: "Eng. Fahad Al-Dossari",
        emailSubject: "URGENT PIF-MANDATED RECYCLING FLEET SIZE REDUCTION",
        emailBody: `Dear Fornnax Export Sales Team,

Following the PIF-mandated national circular expansion, we are establishing heavy-duty tire shredding facilities in Riyadh. 

We need highly durable machinery that handles abrasive sand-covered truck and OTR tires continuously. 

Specs required:
- Capacity: 10 Tons/Hour
- Output: <4.0mm athletic rubber crumb
- Steel separation purity must be 99.9%
- Bearings must be sand-exclusion sealed

Please expedite technical proposal and CE certifications.

Eng. Fahad Al-Dossari
Lead Procurement, SIRC`,
        notes: "PIF Sovereign backing. Extreme Desert sand-exclusion bearings required on SR-200HD. High-density magnets. Ready for VIP factory tour in Anand.",
        specs: {
          inputMaterial: "Sand-laden truck and OTR tires",
          targetOutputSize: "< 4.0 mm rubber crumb",
          capacity: "10.0 Tons / Hour",
          separationRequired: true,
          estimatedBudget: "$3,800,000",
          powerAvailability: "3-Phase, 380V, 60Hz",
          siteStatus: "Civil Foundations Ready",
          timeline: "Immediate Finalisation"
        },
        channel: "whatsapp",
        specCompleteness: 15
      };

      setEnquiries(prev => [liveSaudiLead, ...prev]);
      setSelectedEnquiryId("FNX-EQ-LIVE-SAUDI-SIRC");
      setDemoToast({
        title: "🚨 WhatsApp Ingestion Triggered",
        message: "New message handshaked from Saudi Investment Recycling Company (Riyadh)..."
      });
      dispatchLog("02:14:00 — Enquiry Intake: SIRC WhatsApp handshake initiated...");
      dispatchNode("WRK-001", "Working");
    }, 2000);

    // Step 2: Routed to Spec Collector (4.5s)
    setTimeout(() => {
      setActiveTab('orchestration');
      setDemoToast({
        title: "⚡ Manager Dispatch",
        message: "Forwarding raw WhatsApp string to Spec Collector node for multi-param extraction..."
      });
      dispatchLog("02:14:02 — Manager: routed SIRC payload to Spec Collector Agent...");
      dispatchNode("WRK-001", "Done");
      dispatchNode("WRK-002", "Working");
    }, 5000);

    // Step 3: Spec Extraction Complete (8.0s)
    setTimeout(() => {
      setDemoToast({
        title: "🔍 Parameter Extraction Compiling",
        message: "Sized: 10 Tons/Hour truck & OTR tyres. Sand-exclusion bearings, double-hardened blades..."
      });
      setEnquiries(prev => prev.map(e => e.id === "FNX-EQ-LIVE-SAUDI-SIRC" ? { ...e, specCompleteness: 100, status: "brief_ready" } : e));
      dispatchLog("02:14:15 — Spec Collector: Extracted 8 core parameters. 100% data fidelity reached.");
      dispatchNode("WRK-002", "Done");
      dispatchNode("WRK-003", "Working");
    }, 8500);

    // Step 4: Technical Brief Generation (11.5s)
    setTimeout(() => {
      setDemoToast({
        title: "📄 Technical Brief Written",
        message: "Recommended configuration suggestion: Dual-Shaft Fornnax SR-200HD dual magnet line."
      });
      dispatchLog("02:14:22 — Brief Writer: Brief FX-2026-0147 compiled for SIRC Saudi Arabia.");
      dispatchNode("WRK-003", "Done");
      dispatchNode("WRK-006", "Working");
    }, 12000);

    // Step 5: Outreach Sequence Generated (14.5s)
    setTimeout(() => {
      setDemoToast({
        title: "✍️ Personalized Outreach Ready",
        message: "Bilingual English-Arabic proposal completed with Fornnax Gulf Region references."
      });
      dispatchLog("02:14:30 — Outreach Drafter: Composed custom 10 TPH Arab-region proposal dossier.");
      dispatchNode("WRK-006", "Done");
    }, 15500);

    // Step 6: Money Moment Complete, Load outreach studio (17.5s)
    setTimeout(() => {
      setActiveTab('outreach');
      setSelectedEnquiryId("FNX-EQ-LIVE-SAUDI-SIRC");
      setDemoToast({
        title: "🎉 Simulation Successful",
        message: "SIRC lead fully resolved. Commercial proposal ready for dispatch in Outreach Studio!"
      });
      dispatchLog("02:14:35 — System: SIRC pipeline fully resolved. Ready for human executive review.");
    }, 18500);

    // Step 7: Finalize
    setTimeout(() => {
      setDemoToast(null);
      setIsReplayingSaudi(false);
    }, 22500);
  };

  // Demo Reset Trigger
  const handleResetDemoData = () => {
    setEnquiries(INITIAL_ENQUIRIES);
    setSelectedEnquiryId(INITIAL_ENQUIRIES[0]?.id || null);
    setActiveTab('dashboard');
    setDemoControlsOpen(false);
    setDemoToast({
      title: "DEMO RESET COMPLETED",
      message: "Restored baseline pipeline data, cleared active logs, and closed open socket buffers."
    });
    setTimeout(() => setDemoToast(null), 3500);
  };

  // Status Updater callback
  const handleUpdateStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Notes Updater callback
  const handleUpdateNotes = (id: string, notes: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, notes } : e));
  };

  // Save extracted specs callback
  const handleSaveSpecs = (id: string, specs: EnquirySpecs) => {
    setEnquiries(prev => prev.map(e => {
      if (e.id === id) {
        // Calculate completeness based on the 7 core fields
        const keys: (keyof EnquirySpecs)[] = [
          'inputMaterial',
          'capacity',
          'targetOutputSize',
          'powerAvailability',
          'siteStatus',
          'timeline',
          'estimatedBudget'
        ];
        const completedCount = keys.filter(k => !!specs[k]).length;
        const specCompleteness = Math.round((completedCount / 7) * 100);

        return {
          ...e,
          specs,
          specCompleteness,
          // Sync high-level properties for display in other lists
          material: specs.inputMaterial || e.material,
          throughput: specs.capacity || e.throughput,
          outputSize: specs.targetOutputSize || e.outputSize
        };
      }
      return e;
    }));
  };

  // Import Lead from Lead Finder into our Active Enquiry Pipeline
  const handleImportLead = (lead: Lead) => {
    const newEnquiry: Enquiry = {
      id: `FNX-EQ-2026-00${enquiries.length + 1}`,
      companyName: lead.companyName,
      country: lead.country,
      countryCode: lead.country === "Saudi Arabia" ? "SA" : lead.country === "Germany" ? "DE" : "AU",
      material: "Pending Detailed Verification",
      throughput: "Not Sized Yet",
      outputSize: "Not Sized Yet",
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      score: lead.confidenceScore,
      status: "unread",
      contactPerson: "Export Purchasing Agent",
      emailSubject: `Inquiry response regarding Fornnax size reduction equipment matching: ${lead.type}`,
      emailBody: `Hello Fornnax Team,

We are writing to you after our business profile matches was highlighted. We process ${lead.type} and are interested in learning more about your stationary shredding equipment, capacity limits, and lead times.

Please arrange a call with your sales specialist for the ${lead.country} region.

Thanks,
Procurement Team | ${lead.companyName}`,
      notes: `Imported via Lead Finder. Trade Source: ${lead.source}. Ready for outreach.`
    };

    setEnquiries(prev => [newEnquiry, ...prev]);
    setSelectedEnquiryId(newEnquiry.id);
  };

  // View Router Render
  const renderActiveView = () => {
    if (isPageLoading) {
      return <SkeletonLoader tab={activeTab} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            enquiries={enquiries} 
            onSelectEnquiry={(id) => {
              setSelectedEnquiryId(id);
              handleTabChange('inbox');
            }} 
            setActiveTab={handleTabChange} 
          />
        );
      case 'inbox':
        return (
          <EnquiryInboxView
            enquiries={enquiries}
            selectedEnquiryId={selectedEnquiryId}
            onSelectEnquiry={setSelectedEnquiryId}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            setActiveTab={handleTabChange}
          />
        );
      case 'spec-collector':
        return (
          <AiSpecCollectorView
            enquiries={enquiries}
            selectedEnquiryId={selectedEnquiryId}
            onSaveSpecs={handleSaveSpecs}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={handleTabChange}
          />
        );
      case 'briefs':
        return (
          <EnquiryBriefsView
            enquiries={enquiries}
            selectedEnquiryId={selectedEnquiryId}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={handleTabChange}
          />
        );
      case 'lead-finder':
        return (
          <LeadFinderView 
            onImportLead={handleImportLead} 
            setActiveTab={handleTabChange}
            setSelectedEnquiryId={setSelectedEnquiryId}
          />
        );
      case 'outreach':
        return (
          <OutreachStudioView
            enquiries={enquiries}
            selectedEnquiryId={selectedEnquiryId}
            setSelectedEnquiryId={setSelectedEnquiryId}
          />
        );
      case 'orchestration':
        return <AgentOrchestrationView setActiveTab={handleTabChange} />;
      default:
        return (
          <div className="text-center py-20 text-fornnax-text-secondary font-mono">
            View under construction.
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-fornnax-bg grid-texture text-fornnax-text-primary relative overflow-hidden flex">
      {/* 240px Fixed Sidebar - Use handleTabChange for smooth skeletons */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-60 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dynamic Route Screen Layout */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {/* Slide fade view effect wrapper */}
          <div className="animate-[fadeIn_0.2s_ease-out]">
            <ErrorBoundary>
              {renderActiveView()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Simulation / Action Toasts Overlay */}
      {demoToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-zinc-950 border-2 border-fornnax-red p-4 rounded-xl shadow-[0_0_40px_rgba(226,58,46,0.45)] flex items-center space-x-3.5 animate-fadeIn max-w-lg w-[90vw] md:w-full backdrop-blur-sm">
          <div className="p-2.5 bg-fornnax-red/15 rounded-lg border border-fornnax-red/30 shrink-0">
            <Zap className="w-5.5 h-5.5 text-fornnax-red animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-mono text-fornnax-red uppercase tracking-widest font-black flex items-center gap-1.5">
              <span>DEMO OVERLAY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-fornnax-red animate-ping" />
            </div>
            <div className="text-[11px] font-mono font-bold text-white mt-0.5 uppercase tracking-wide leading-tight truncate">{demoToast.title}</div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 leading-snug">{demoToast.message}</div>
          </div>
        </div>
      )}

      {/* Demo Controls Discreet Overlay at bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setDemoControlsOpen(!demoControlsOpen)}
            className="w-12 h-12 rounded-full bg-zinc-950 border border-fornnax-red hover:border-red-400 text-fornnax-red hover:text-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(226,58,46,0.35)] transition-all duration-200 group hover:scale-105 active:scale-95"
            title="Demo Control Center"
          >
            <Settings className="w-5.5 h-5.5 animate-[spin_10s_linear_infinite] group-hover:rotate-180 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fornnax-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-fornnax-red"></span>
            </span>
          </button>

          {demoControlsOpen && (
            <div className="absolute bottom-14 right-0 bg-zinc-950/95 border-2 border-zinc-800 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] w-64 space-y-3 animate-fadeIn backdrop-blur-md select-none">
              <div className="flex items-center space-x-1.5 border-b border-zinc-800 pb-2">
                <Sparkles className="w-4 h-4 text-fornnax-red" />
                <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">Demo Control Center</span>
              </div>
              
              <div className="text-[10px] font-mono text-zinc-400 leading-normal">
                Reset system cache or simulate an end-to-end PIF Saudi enquiry live.
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleReplaySaudiSimulation}
                  disabled={isReplayingSaudi}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-mono text-[10px] font-bold border transition-all flex items-center justify-between ${
                    isReplayingSaudi 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-fornnax-red/10 border-fornnax-red/30 text-fornnax-red hover:bg-fornnax-red hover:text-white hover:border-fornnax-red shadow-[0_0_10px_rgba(226,58,46,0.1)]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Play className="w-3.5 h-3.5 animate-pulse" />
                    <span>Replay Saudi Inquiry</span>
                  </div>
                  <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-1 py-0.2 rounded font-normal">SIM</span>
                </button>

                <button
                  onClick={handleResetDemoData}
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left font-mono text-[10px] font-bold text-zinc-300 hover:text-white transition-all flex items-center space-x-2"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reset Pipeline Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

