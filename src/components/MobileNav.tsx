import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Target, 
  PenTool, 
  Menu, 
  Cpu, 
  FileText, 
  Workflow,
  X
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badgeCount: 2 },
    { id: 'lead-finder', label: 'Leads', icon: Target },
    { id: 'outreach', label: 'Outreach', icon: PenTool },
  ];

  const moreTabs = [
    { id: 'spec-collector', label: 'AI Spec Collector', icon: Cpu },
    { id: 'briefs', label: 'Enquiry Briefs', icon: FileText },
    { id: 'orchestration', label: 'Agent Orchestration', icon: Workflow, live: true },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-fornnax-card border-t border-fornnax-border pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-5 min-h-[56px] items-center">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !isMoreOpen;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 transition-colors relative h-full min-h-[56px] ${
                  isActive ? 'text-fornnax-red' : 'text-fornnax-text-secondary'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5.5 h-5.5" />
                  {tab.badgeCount && (
                    <span className="absolute -top-1 -right-2 bg-fornnax-red text-white text-[8px] font-bold font-mono h-3.5 min-w-[14px] flex items-center justify-center px-0.5 rounded-full border border-fornnax-card">
                      {tab.badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-sans font-medium tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            id="mobile-tab-more"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center py-1.5 transition-colors h-full min-h-[56px] ${
              isMoreOpen || moreTabs.some(t => t.id === activeTab) ? 'text-fornnax-red' : 'text-fornnax-text-secondary'
            }`}
          >
            <Menu className="w-5.5 h-5.5" />
            <span className="text-[9px] font-sans font-medium tracking-tight mt-0.5">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet */}
      {isMoreOpen && (
        <>
          {/* Backdrop */}
          <div 
            id="mobile-sheet-backdrop" 
            className="fixed inset-0 bg-black/60 z-50 animate-[fadeIn_0.15s_ease-out] lg:hidden"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Sheet */}
          <div 
            id="mobile-sheet-content" 
            className="fixed bottom-0 left-0 right-0 z-50 bg-fornnax-card border-t border-fornnax-border rounded-t-2xl pb-[calc(16px+env(safe-area-inset-bottom)+56px)] p-5 space-y-4 animate-[slideInUp_0.2s_ease-out] lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-fornnax-border pb-3">
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest">
                More Modules
              </span>
              <button 
                id="close-mobile-sheet"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 hover:bg-white/5 rounded-md text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`mobile-more-item-${tab.id}`}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium transition-all ${
                      isActive 
                        ? 'bg-fornnax-red/10 border border-fornnax-red/20 text-white' 
                        : 'bg-zinc-900/40 border border-transparent text-fornnax-text-secondary active:bg-zinc-900/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-fornnax-red' : 'text-zinc-400'}`} />
                      <span className="text-xs font-sans">{tab.label}</span>
                    </div>

                    {tab.live && (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fornnax-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fornnax-green"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
