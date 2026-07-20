import React, { useState, useEffect, useRef } from 'react';
import { 
  Workflow, 
  Cpu, 
  Play, 
  Pause, 
  RotateCw, 
  Terminal, 
  CheckCircle, 
  AlertTriangle,
  Server,
  TrendingUp,
  Inbox,
  FileText,
  Target,
  PenTool,
  Send,
  Users,
  ArrowRight,
  Activity,
  Zap,
  Check,
  Shield,
  Clock,
  MessageSquare,
  Mail,
  HelpCircle
} from 'lucide-react';

interface AgentOrchestrationViewProps {
  setActiveTab?: (tab: string) => void;
}

interface WorkerAgent {
  id: string;
  name: string;
  roleDescription: string;
  targetTab: string;
  iconName: 'inbox' | 'cpu' | 'briefs' | 'lead-finder' | 'outreach';
  status: 'Idle' | 'Working' | 'Done';
  completedToday: number;
  avgHandleTime: string;
  successRate: string;
  tokensToday: string;
}

// Reusable count-up animation component for statistics
function AnimatedOrchNumber({ value, prefix = "", suffix = "", decimals = 0, duration = 1200 }: { value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
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

export default function AgentOrchestrationView({ setActiveTab }: AgentOrchestrationViewProps) {
  // 6 Specialized Worker Nodes matching Fornnax actual ICP flow
  const [workers, setWorkers] = useState<WorkerAgent[]>([
    {
      id: "WRK-001",
      name: "Enquiry Intake Agent",
      roleDescription: "Listens to multi-channel WhatsApp and Email streams, validating domain reputation and parsing sender context.",
      targetTab: "inbox",
      iconName: "inbox",
      status: "Idle",
      completedToday: 142,
      avgHandleTime: "32s",
      successRate: "99.8%",
      tokensToday: "412K"
    },
    {
      id: "WRK-002",
      name: "Spec Collector Agent",
      roleDescription: "Extracts physical machinery specifications (TPH, sizing, power layout) via interactive chat sessions.",
      targetTab: "spec-collector",
      iconName: "cpu",
      status: "Idle",
      completedToday: 87,
      avgHandleTime: "4m 12s",
      successRate: "98.5%",
      tokensToday: "1.2M"
    },
    {
      id: "WRK-003",
      name: "Brief Writer Agent",
      roleDescription: "Autonomously compiles technical-commercial PDFs with recommended Fornnax plant configurations.",
      targetTab: "briefs",
      iconName: "briefs",
      status: "Idle",
      completedToday: 62,
      avgHandleTime: "3m 15s",
      successRate: "100%",
      tokensToday: "850K"
    },
    {
      id: "WRK-004",
      name: "Lead Scout Agent",
      roleDescription: "Scans international trade manifestations, tender databases, and recycling regulatory platforms.",
      targetTab: "lead-finder",
      iconName: "lead-finder",
      status: "Idle",
      completedToday: 214,
      avgHandleTime: "1m 45s",
      successRate: "97.2%",
      tokensToday: "2.4M"
    },
    {
      id: "WRK-005",
      name: "Prospect Research Agent",
      roleDescription: "Uncovers regional decision makers, estimated project sizes, and likely bidding competitors.",
      targetTab: "lead-finder",
      iconName: "lead-finder",
      status: "Idle",
      completedToday: 53,
      avgHandleTime: "2m 30s",
      successRate: "99.1%",
      tokensToday: "980K"
    },
    {
      id: "WRK-006",
      name: "Outreach Drafter Agent",
      roleDescription: "Composes localized multi-channel sequences with tailored case studies and GCC regional metrics.",
      targetTab: "outreach",
      iconName: "outreach",
      status: "Idle",
      completedToday: 98,
      avgHandleTime: "1m 10s",
      successRate: "99.4%",
      tokensToday: "670K"
    }
  ]);

  // Selected agent for details panel (Defaults to WRK-001)
  const [selectedAgentId, setSelectedAgentId] = useState<string>("WRK-001");
  const [isSimulationPaused, setIsSimulationPaused] = useState<boolean>(false);
  const [activeDispatchPath, setActiveDispatchPath] = useState<number | null>(null);

  // Live activity telemetry log state with default specified entries
  const [logs, setLogs] = useState<string[]>([
    "02:14:09 — Enquiry Intake: new WhatsApp enquiry detected (Saudi Arabia)",
    "02:14:31 — Manager: dispatched to Spec Collector",
    "02:19:00 — Brief Writer: brief FX-2026-0147 generated",
    "06:00:02 — Lead Scout: 3 new signals found overnight (SIRC, Tyrecycle, CPCB EPR)",
    "07:30:15 — System: All Fornnax LLM microservices reporting healthy status (ping 48ms)",
    "07:45:20 — Manager Agent: Standing by in central queue orchestration mode..."
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Listen for global custom events driving the high-fidelity demo replay simulation
  useEffect(() => {
    const handleSimLog = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.log) {
        setLogs(prev => [...prev, customEvent.detail.log]);
      }
    };

    const handleNodeStatus = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { nodeId, status } = customEvent.detail;
        setWorkers(prev => prev.map(w => w.id === nodeId ? { ...w, status } : w));
      }
    };

    window.addEventListener('fornnax-simulation-log', handleSimLog);
    window.addEventListener('fornnax-simulation-node-status', handleNodeStatus);

    return () => {
      window.removeEventListener('fornnax-simulation-log', handleSimLog);
      window.removeEventListener('fornnax-simulation-node-status', handleNodeStatus);
    };
  }, []);

  // Auto-scroll telemetry log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Real-Time Agent Dispatch Simulation Loop
  useEffect(() => {
    if (isSimulationPaused) return;

    const dispatchInterval = setInterval(() => {
      // Pick a random worker
      const randomIdx = Math.floor(Math.random() * workers.length);
      const targetWorker = workers[randomIdx];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      // Step 1: Manager Dispatches to Worker
      setActiveDispatchPath(randomIdx);
      
      setLogs(prev => [
        ...prev, 
        `${timeStr} — Manager: dispatched task to ${targetWorker.name}...`
      ]);

      // Transition worker status to Working
      setWorkers(prev => prev.map((w, idx) => 
        idx === randomIdx ? { ...w, status: 'Working' } : w
      ));

      // Step 2: After 3 seconds, complete the task
      setTimeout(() => {
        if (isSimulationPaused) return;
        
        const finishTime = new Date();
        const finishStr = finishTime.toTimeString().split(' ')[0];
        
        // Generate a context-appropriate log message
        let actionMsg = "";
        switch(targetWorker.id) {
          case "WRK-001":
            actionMsg = "scanned and parsed inbox (Reputation safe, domain validated)";
            break;
          case "WRK-002":
            actionMsg = "compiled chat session specifications for truck tires (10 TPH target)";
            break;
          case "WRK-003":
            actionMsg = "compiled technical-commercial PDF (Configuration: SR-200HD)";
            break;
          case "WRK-004":
            actionMsg = "scanned trade manifest logs (Identified scrap flow update)";
            break;
          case "WRK-005":
            actionMsg = "indexed regional decision-makers and estimated project scope";
            break;
          case "WRK-006":
            actionMsg = "synthesized executive English-Arabic outreach copy";
            break;
          default:
            actionMsg = "completed execution pipeline successfully";
        }

        setLogs(prev => [
          ...prev,
          `${finishStr} — ${targetWorker.name}: task complete — ${actionMsg}.`
        ]);

        // Transition worker to Done, increment total completed
        setWorkers(prev => prev.map((w, idx) => 
          idx === randomIdx ? { 
            ...w, 
            status: 'Done',
            completedToday: w.completedToday + 1
          } : w
        ));

        // Clear active dispatch line
        setActiveDispatchPath(null);

        // Transition back to Idle after 1.5 seconds
        setTimeout(() => {
          setWorkers(prev => prev.map((w, idx) => 
            idx === randomIdx ? { ...w, status: 'Idle' } : w
          ));
        }, 1500);

      }, 3000);

    }, 8500); // Trigger every 8.5 seconds

    return () => clearInterval(dispatchInterval);
  }, [isSimulationPaused, workers]);

  // Helper to resolve Icons
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'inbox':
        return <Inbox className={className} />;
      case 'cpu':
        return <Cpu className={className} />;
      case 'briefs':
        return <FileText className={className} />;
      case 'lead-finder':
        return <Target className={className} />;
      case 'outreach':
        return <PenTool className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  const selectedAgent = workers.find(w => w.id === selectedAgentId) || workers[0];

  return (
    <div className="space-y-6">
      {/* Injecting CSS styles for pulsing connection dash lines */}
      <style>{`
        @keyframes pulseDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .pulsing-line {
          stroke-dasharray: 6, 6;
          animation: pulseDash 1.2s linear infinite;
        }
      `}</style>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase flex items-center space-x-2">
            <Workflow className="w-6 h-6 text-fornnax-red" />
            <span>AI Workforce Control Room</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Real-time monitoring panel displaying autonomous Manager dispatch flows, model latency, and task execution throughput.
          </p>
        </div>

        {/* Global Node Telemetry */}
        <div className="flex items-center space-x-4 shrink-0 self-start md:self-center">
          <button 
            onClick={() => setIsSimulationPaused(!isSimulationPaused)}
            className="p-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-fornnax-border rounded-[8px] text-[10px] font-mono text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-all"
          >
            {isSimulationPaused ? <Play className="w-3.5 h-3.5 text-fornnax-green" /> : <Pause className="w-3.5 h-3.5 text-fornnax-amber" />}
            <span>{isSimulationPaused ? 'Resume Simulation' : 'Pause Simulation'}</span>
          </button>

          <div className="flex items-center space-x-2 bg-fornnax-card border border-fornnax-border px-3 py-1.5 rounded-[8px] font-mono text-[10px] text-fornnax-text-secondary">
            <Server className="w-3.5 h-3.5 text-fornnax-green" />
            <span>Core: Active</span>
            <span>•</span>
            <span>CPU: 3.1%</span>
            <span>•</span>
            <span className="text-fornnax-green">6 Nodes Online</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Diagram vs Log Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left/Center: Orchestration Blueprint Diagram (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0C0F14] border-2 border-fornnax-border rounded-[10px] p-6 relative flex flex-col justify-between min-h-[580px] overflow-hidden">
          
          {/* Engineering grid blueprint watermark background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
          
          {/* Diagnostic Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 text-[8px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none">
            <Activity className="w-3 h-3 text-fornnax-red animate-pulse" />
            <span>Fornnax-Core Architecture Topology</span>
          </div>

          {/* SVG Connector Lines Layout Layer (Visible on Desktop only) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" style={{ minHeight: '520px' }}>
            {/* Curved Bezier Connectors from Manager at top center (50%, 18%) to 6 Worker nodes in 2 columns */}
            {/* Column 1 (Left Column): X=26%, Y-levels at 37%, 62%, 87% */}
            <path 
              d="M 380 90 C 250 90, 200 120, 200 170" 
              fill="none" 
              stroke={activeDispatchPath === 0 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 0 ? "3" : "1.5"} 
              className={activeDispatchPath === 0 ? "pulsing-line transition-all" : "transition-all"}
            />
            <path 
              d="M 380 90 C 250 90, 200 240, 200 295" 
              fill="none" 
              stroke={activeDispatchPath === 1 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 1 ? "3" : "1.5"} 
              className={activeDispatchPath === 1 ? "pulsing-line transition-all" : "transition-all"}
            />
            <path 
              d="M 380 90 C 250 90, 200 340, 200 420" 
              fill="none" 
              stroke={activeDispatchPath === 2 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 2 ? "3" : "1.5"} 
              className={activeDispatchPath === 2 ? "pulsing-line transition-all" : "transition-all"}
            />

            {/* Column 2 (Right Column): X=74%, Y-levels at 37%, 62%, 87% */}
            <path 
              d="M 380 90 C 510 90, 560 120, 560 170" 
              fill="none" 
              stroke={activeDispatchPath === 3 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 3 ? "3" : "1.5"} 
              className={activeDispatchPath === 3 ? "pulsing-line transition-all" : "transition-all"}
            />
            <path 
              d="M 380 90 C 510 90, 560 240, 560 295" 
              fill="none" 
              stroke={activeDispatchPath === 4 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 4 ? "3" : "1.5"} 
              className={activeDispatchPath === 4 ? "pulsing-line transition-all" : "transition-all"}
            />
            <path 
              d="M 380 90 C 510 90, 560 340, 560 420" 
              fill="none" 
              stroke={activeDispatchPath === 5 ? "#10B981" : "#27272A"} 
              strokeWidth={activeDispatchPath === 5 ? "3" : "1.5"} 
              className={activeDispatchPath === 5 ? "pulsing-line transition-all" : "transition-all"}
            />
          </svg>

          {/* Core Diagram Elements */}
          <div className="space-y-6 relative z-10 w-full">
            
            {/* Top Node: Manager Agent */}
            <div className="flex justify-center pt-2">
              <div className="bg-zinc-950 border-2 border-fornnax-red rounded-[12px] p-4 w-72 text-center shadow-[0_0_20px_rgba(226,58,46,0.15)] select-none">
                <div className="flex items-center justify-center space-x-2">
                  <div className="p-1.5 bg-fornnax-red/10 rounded border border-fornnax-red/20">
                    <Workflow className="w-4 h-4 text-fornnax-red" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold leading-none">PRIMARY DISPATCHER</span>
                    <h3 className="text-xs font-black text-white uppercase tracking-wide mt-1">Manager Agent</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-zinc-800/80 text-[9px] font-mono text-zinc-400">
                  <div className="bg-zinc-900/50 p-1 rounded border border-zinc-800">
                    <span>Task Latency</span>
                    <strong className="block text-white mt-0.5">148 ms</strong>
                  </div>
                  <div className="bg-zinc-900/50 p-1 rounded border border-zinc-800">
                    <span>Active Dispatches</span>
                    <strong className="block text-fornnax-green mt-0.5">
                      {activeDispatchPath !== null ? '1 Processing' : 'Standing By'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Workers Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 pt-2">
              
              {/* Left Column: Customer Intake & Sizing Specs pipeline */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block pl-1">
                  [01] Customer Intake Pipeline
                </span>

                <div className="space-y-3">
                  {workers.slice(0, 3).map((w, index) => {
                    const isSelected = w.id === selectedAgentId;
                    const statusColors = 
                      w.status === 'Working' ? 'bg-fornnax-amber/15 text-fornnax-amber border-fornnax-amber/30' :
                      w.status === 'Done' ? 'bg-fornnax-green/15 text-fornnax-green border-fornnax-green/30' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700/60';

                    return (
                      <div
                        key={w.id}
                        onClick={() => setSelectedAgentId(w.id)}
                        className={`p-3 rounded-[8px] border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'bg-zinc-900 border-fornnax-red shadow-[inset_0_0_8px_rgba(226,58,46,0.15)]' 
                            : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className={`p-1.5 rounded ${isSelected ? 'bg-fornnax-red/10 text-fornnax-red' : 'bg-zinc-900 text-zinc-400'}`}>
                            {renderIcon(w.iconName, "w-4 h-4 shrink-0")}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                            <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
                              Avg: {w.avgHandleTime} • Completed: {w.completedToday}
                            </span>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${statusColors}`}>
                          {w.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Lead Scouting & Global Trade Intel pipeline */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block pl-1">
                  [02] Global Intelligence Pipeline
                </span>

                <div className="space-y-3">
                  {workers.slice(3, 6).map((w, index) => {
                    const isSelected = w.id === selectedAgentId;
                    const statusColors = 
                      w.status === 'Working' ? 'bg-fornnax-amber/15 text-fornnax-amber border-fornnax-amber/30' :
                      w.status === 'Done' ? 'bg-fornnax-green/15 text-fornnax-green border-fornnax-green/30' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700/60';

                    return (
                      <div
                        key={w.id}
                        onClick={() => setSelectedAgentId(w.id)}
                        className={`p-3 rounded-[8px] border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'bg-zinc-900 border-fornnax-red shadow-[inset_0_0_8px_rgba(226,58,46,0.15)]' 
                            : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className={`p-1.5 rounded ${isSelected ? 'bg-fornnax-red/10 text-fornnax-red' : 'bg-zinc-900 text-zinc-400'}`}>
                            {renderIcon(w.iconName, "w-4 h-4 shrink-0")}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                            <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
                              Avg: {w.avgHandleTime} • Completed: {w.completedToday}
                            </span>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${statusColors}`}>
                          {w.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Selected Worker Node Detail Panel */}
          {selectedAgent && (
            <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-[8px] relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-mono bg-fornnax-red/15 text-fornnax-red px-1.5 py-0.2 rounded border border-fornnax-red/25 uppercase font-bold tracking-wider">
                    Agent Dossier
                  </span>
                  <h4 className="text-xs font-bold text-white font-sans">{selectedAgent.name}</h4>
                  <span className="text-[9px] font-mono text-zinc-500">Avg response: {selectedAgent.avgHandleTime}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
                  {selectedAgent.roleDescription}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-stretch sm:self-center justify-between sm:justify-start">
                <div className="font-mono text-[10px] text-zinc-500 text-right hidden sm:block">
                  <div>Success: <strong className="text-fornnax-green">{selectedAgent.successRate}</strong></div>
                  <div>Tokens today: <strong className="text-zinc-300">{selectedAgent.tokensToday}</strong></div>
                </div>

                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab(selectedAgent.targetTab)}
                    className="p-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-[6px] text-xs font-semibold text-white flex items-center space-x-1 hover:border-fornnax-red transition-all shrink-0"
                  >
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right: Live Activity Log Stream (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col h-[600px]">
          <h3 className="font-display text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3.5 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-fornnax-red" />
            <span>Telemetry Activity Log</span>
          </h3>

          <div className="bg-[#08090C] border-2 border-fornnax-border rounded-[10px] p-4 flex flex-col flex-1 overflow-hidden font-mono text-[10px] text-zinc-400 relative">
            
            {/* Console header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-fornnax-red inline-block animate-ping" />
                <span className="text-white font-bold tracking-wider">FORNNAX-CORE-LOG</span>
              </div>
              
              <button 
                onClick={() => setLogs([])}
                className="hover:text-fornnax-red text-[9px] font-bold"
              >
                Clear logs
              </button>
            </div>

            {/* Scrollable logs */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text">
              {logs.map((log, i) => {
                let colorClass = "text-zinc-400";
                if (log.includes("Manager:")) colorClass = "text-white font-medium";
                if (log.includes("Enquiry Intake:")) colorClass = "text-fornnax-green";
                if (log.includes("Brief Writer:")) colorClass = "text-fornnax-green font-bold";
                if (log.includes("Lead Scout:")) colorClass = "text-fornnax-amber";
                if (log.includes("System:")) colorClass = "text-zinc-500 italic";

                return (
                  <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>

            {/* Glowing active footer */}
            <div className="absolute bottom-2.5 right-4 flex items-center space-x-1 font-mono text-[9px] select-none text-zinc-500 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-fornnax-green live-pulse" />
              <span>LIVE TELEMETRY ACTIVE</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom: "This week" Summary Statistics Strip */}
      <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] p-5 relative overflow-hidden select-none">
        
        {/* Subtle red outline highlight */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-fornnax-red" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="space-y-1 pl-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
              Enquiries Processed
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-black text-white">
                <AnimatedOrchNumber value={584} />
              </span>
              <span className="text-[10px] font-mono text-fornnax-green font-bold">+18% vs LW</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
              Briefs Generated
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-black text-white">
                <AnimatedOrchNumber value={216} />
              </span>
              <span className="text-[10px] font-mono text-fornnax-green font-bold">+12% vs LW</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
              Leads Found
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-black text-white">
                <AnimatedOrchNumber value={1402} />
              </span>
              <span className="text-[10px] font-mono text-fornnax-green font-bold">+24% vs LW</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
              Drafts Written
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-black text-white">
                <AnimatedOrchNumber value={387} />
              </span>
              <span className="text-[10px] font-mono text-fornnax-green font-bold">+15% vs LW</span>
            </div>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1 bg-zinc-950/40 p-2.5 rounded border border-zinc-800/60">
            <span className="text-[9px] font-mono text-fornnax-red uppercase tracking-wider block font-black">
              Est. Human Hours Saved
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-black text-fornnax-green">
                <AnimatedOrchNumber value={194.5} decimals={1} suffix=" h" />
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Autonomous Value</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
