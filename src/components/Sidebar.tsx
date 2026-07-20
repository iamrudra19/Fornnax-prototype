import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Cpu, 
  FileText, 
  Target, 
  PenTool, 
  Workflow,
  Factory
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Enquiry Inbox', icon: Inbox, badgeCount: 2 },
    { id: 'spec-collector', label: 'AI Spec Collector', icon: Cpu },
    { id: 'briefs', label: 'Enquiry Briefs', icon: FileText },
    { id: 'lead-finder', label: 'Lead Finder', icon: Target },
    { id: 'outreach', label: 'Outreach Studio', icon: PenTool },
    { id: 'orchestration', label: 'Agent Orchestration', icon: Workflow, live: true },
  ];

  return (
    <aside id="sidebar-container" className="fixed top-0 left-0 h-screen w-60 bg-fornnax-card border-r border-fornnax-border flex flex-col justify-between z-30">
      {/* Upper Logo Area */}
      <div>
        <div id="sidebar-header" className="p-5 border-b border-fornnax-border flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-fornnax-red flex items-center justify-center shadow-[0_0_15px_rgba(226,58,46,0.3)]">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-fornnax-text-primary leading-none">
              FORNNAX
            </h1>
            <span className="text-[10px] text-fornnax-text-secondary uppercase tracking-[0.08em] font-mono block mt-1">
              Export Intel Hub
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav id="sidebar-navigation" className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`menu-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'sidebar-active text-fornnax-text-primary'
                    : 'text-fornnax-text-secondary hover:text-fornnax-text-primary hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? 'text-fornnax-red' : 'text-fornnax-text-secondary group-hover:text-fornnax-text-primary'
                    }`} 
                  />
                  <span className="font-sans">{item.label}</span>
                </div>

                {/* Badge Counters or Live Indicator */}
                {item.badgeCount && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-fornnax-red text-white font-semibold">
                    {item.badgeCount}
                  </span>
                )}

                {item.live && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fornnax-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fornnax-green"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-fornnax-border bg-fornnax-bg/50">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-fornnax-text-secondary uppercase tracking-wider">
            Powered by Proxim Systems
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-fornnax-green live-pulse" title="System Connected" />
        </div>
      </div>
    </aside>
  );
}
