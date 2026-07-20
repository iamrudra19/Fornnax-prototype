import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Check, 
  X, 
  MessageCircle, 
  Mail, 
  Globe, 
  Scan, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle, 
  FileText, 
  Lock,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Enquiry, EnquirySpecs } from '../types';

interface AiSpecCollectorViewProps {
  enquiries: Enquiry[];
  selectedEnquiryId: string | null;
  onSaveSpecs: (id: string, specs: EnquirySpecs) => void;
  onUpdateStatus: (id: string, status: Enquiry['status']) => void;
  setActiveTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'ai';
  text: string;
  time: string;
}

interface ChecklistItem {
  label: string;
  key: string;
  value: string;
  checked: boolean;
}

interface ConversationScriptStep {
  sender: 'buyer' | 'ai';
  text: string;
  time: string;
  updatesSpecs?: Partial<Record<string, string>>;
}

// Fixed Scripts for the three major archetypes
const SCRIPTS: Record<string, ConversationScriptStep[]> = {
  // 1. AL RASHID RECYCLING LLC (SAUDI ARABIA) 🇸🇦
  'FNX-EQ-2026-001': [
    {
      sender: 'buyer',
      text: "Hello, I am interested in tyre recycling plant for Saudi Arabia. Please send price.",
      time: "02:14 IST"
    },
    {
      sender: 'ai',
      text: "Welcome to Fornnax Intelligence Support. I'd be glad to help configure the perfect size-reduction plant for Saudi Arabia! To recommend the correct model, could you share what input material (passenger car / truck / OTR tyres) you process, and your target monthly volume?",
      time: "02:14 IST"
    },
    {
      sender: 'buyer',
      text: "Mostly truck tyres, around 3000 tons per month.",
      time: "02:15 IST",
      updatesSpecs: {
        inputMaterial: 'Scrap Truck Tyres (Radial)',
        capacity: '~10 TPH (3,000 tpm)'
      }
    },
    {
      sender: 'ai',
      text: "Acknowledged. 3,000 tons/month matches a continuous ~10 Tons/Hour primary shredding line. What is your desired final output product (e.g., coarse TDF chips, metal-free rubber crumb, or fine granulate)? Also, is industrial 3-phase power availability already confirmed at your site?",
      time: "02:15 IST"
    },
    {
      sender: 'buyer',
      text: "Rubber crumb for sports surfaces. Land is ready in Dammam industrial city, power sanctioned.",
      time: "02:16 IST",
      updatesSpecs: {
        outputProduct: 'Rubber crumb (< 4mm) for sports surfaces',
        powerAvailability: 'Confirmed (Sanctioned)',
        siteStatus: 'Ready (Dammam Industrial City, KSA)'
      }
    },
    {
      sender: 'ai',
      text: "Perfect. Fine rubber crumb requires a primary shredder coupled with high-speed granulators and magnetic separators. To finalize the project docket, what is your expected project commissioning timeline, and are you at the approved budget or initial estimation stage?",
      time: "02:16 IST"
    },
    {
      sender: 'buyer',
      text: "We want to start in Q1 2027, budget approved.",
      time: "02:17 IST",
      updatesSpecs: {
        timeline: 'Q1 2027 (Start)',
        budgetStage: 'Approved & Budgeted'
      }
    },
    {
      sender: 'ai',
      text: "Perfect — our engineering team will receive your complete project brief within minutes. You will hear from a Fornnax specialist with a tailored configuration shortly.",
      time: "02:17 IST"
    }
  ],

  // 2. ECOKREIS GMBH (GERMANY) 🇩🇪
  'FNX-EQ-2026-002': [
    {
      sender: 'buyer',
      text: "Hallo, wir suchen einen Vorzerkleinerer für Altreifen zur TDF-Herstellung in Deutschland. Haben Sie ein Angebot für den SR-200HD?",
      time: "03:41 IST"
    },
    {
      sender: 'ai',
      text: "Guten Tag! Vielen Dank für Ihre Anfrage an Fornnax. Der SR-200HD ist hervorragend für die TDF-Herstellung geeignet. Um Ihnen eine präzise Konfiguration anzubieten: Welche Reifenarten (Pkw, Lkw oder OTR) verarbeiten Sie, und welchen Durchsatz in Tonnen pro Stunde streben Sie an?",
      time: "03:41 IST"
    },
    {
      sender: 'buyer',
      text: "Hauptsächlich Lkw- und OTR-Reifen bis 1400 mm, gewünschter Durchsatz sind 3 bis 4 Tonnen pro Stunde.",
      time: "03:42 IST",
      updatesSpecs: {
        inputMaterial: 'Lkw- & OTR-Reifen (< 1400mm)',
        capacity: '3 - 4 Tons / Hour (TPH)'
      }
    },
    {
      sender: 'ai',
      text: "Ausgezeichnet, 3-4 TPH liegt perfekt im Arbeitsbereich des SR-200. Welches Endprodukt wird benötigt (z.B. TDF-Schnitzel 50mm oder feines Gummigranulat)? Und wie steht es um den Standort und den Stromanschluss (CE-konform)?",
      time: "03:42 IST"
    },
    {
      sender: 'buyer',
      text: "TDF-Schnitzel 50mm. Die Halle in Köln ist gemietet, 400V 50Hz Stromversorgung steht bereit.",
      time: "03:43 IST",
      updatesSpecs: {
        outputProduct: '50mm TDF-Schnitzel',
        powerAvailability: 'Bereitgestellt (400V 50Hz CE)',
        siteStatus: 'Gemietet (Köln, Deutschland)'
      }
    },
    {
      sender: 'ai',
      text: "Hervorragend. Letzte Frage zur Einplanung: Wann soll die Inbetriebnahme erfolgen und ist das Investitionsbudget bereits freigegeben?",
      time: "03:43 IST"
    },
    {
      sender: 'buyer',
      text: "Inbetriebnahme im Herbst 2026, Investitionsbudget ist freigegeben und steht zur Verfügung.",
      time: "03:44 IST",
      updatesSpecs: {
        timeline: 'Herbst 2026',
        budgetStage: 'Freigegeben & Verfügbar'
      }
    },
    {
      sender: 'ai',
      text: "Perfekt — unser deutsches Engineering-Team erstellt Ihre Projektskizze. Ein Fornnax-Spezialist wird Ihnen in Kürze die detaillierte Spezifikation zusenden.",
      time: "03:44 IST"
    }
  ],

  // 3. RUDRA TRADING CORP (INDIA) 🇮🇳 (Flagged Reseller)
  'FNX-EQ-2026-004': [
    {
      sender: 'buyer',
      text: "Sir, please send price list of all tyre shredders and wire scrap separators. We have buyers in Gujarat.",
      time: "11:47 IST"
    },
    {
      sender: 'ai',
      text: "Namaste! Thank you for contacting Fornnax. We typically manufacture custom-configured industrial recycling plants. To help verify eligibility, are you the end-user or a trading reseller? If you have active projects, please specify the exact material, required capacity (TPH), and approved project budget.",
      time: "11:47 IST"
    },
    {
      sender: 'buyer',
      text: "We are brokers. Just send general price list of all models so we can show to our clients. Budget depends on client.",
      time: "11:48 IST",
      updatesSpecs: {
        inputMaterial: 'Reseller - Multiple/Unknown',
        capacity: 'No Sized TPH / Speculative',
        outputProduct: 'Brokering - Unknown Sizing',
        powerAvailability: 'No specific site',
        siteStatus: 'Brokerage - No Land',
        timeline: 'Speculative Interest',
        budgetStage: 'No Approved Budget'
      }
    },
    {
      sender: 'ai',
      text: "Understood. Fornnax works strictly via authorized engineering layouts directly with plant operators. We have triggered an automatic dispatch of our standard product catalog to your email. We will archive this ticket until direct end-user specifications are supplied.",
      time: "11:48 IST"
    }
  ]
};

// Default static sessions if script doesn't play
const DEFAULT_CHECKLIST: Record<string, Record<string, string>> = {
  'FNX-EQ-2026-001': {
    inputMaterial: 'Scrap Truck Tyres (Radial)',
    capacity: '~10 TPH (3,000 tpm)',
    outputProduct: 'Rubber crumb (< 4mm) for sports surfaces',
    powerAvailability: 'Confirmed (Sanctioned)',
    siteStatus: 'Ready (Dammam Industrial City, KSA)',
    timeline: 'Q1 2027 (Start)',
    budgetStage: 'Approved & Budgeted'
  },
  'FNX-EQ-2026-002': {
    inputMaterial: 'Lkw- & OTR-Reifen (< 1400mm)',
    capacity: '3 - 4 Tons / Hour (TPH)',
    outputProduct: '50mm TDF-Schnitzel',
    powerAvailability: 'Bereitgestellt (400V 50Hz CE)',
    siteStatus: 'Gemietet (Köln, Deutschland)',
    timeline: 'Herbst 2026',
    budgetStage: 'Freigegeben & Verfügbar'
  },
  'FNX-EQ-2026-004': {
    inputMaterial: 'Reseller - Multiple/Unknown',
    capacity: 'No Sized TPH / Speculative',
    outputProduct: 'Brokering - Unknown Sizing',
    powerAvailability: 'No specific site',
    siteStatus: 'Brokerage - No Land',
    timeline: 'Speculative Interest',
    budgetStage: 'No Approved Budget'
  }
};

export default function AiSpecCollectorView({
  enquiries,
  selectedEnquiryId,
  onSaveSpecs,
  onUpdateStatus,
  setActiveTab,
}: AiSpecCollectorViewProps) {
  // Fallback to Saudi Arabia if no active selected
  const initialEnqId = selectedEnquiryId || 'FNX-EQ-2026-001';
  const [activeSessionId, setActiveSessionId] = useState<string>(initialEnqId);

  // Sync with selectedEnquiryId prop
  useEffect(() => {
    if (selectedEnquiryId) {
      setActiveSessionId(selectedEnquiryId);
    }
  }, [selectedEnquiryId]);

  // Current session data
  const currentEnquiry = enquiries.find(e => e.id === activeSessionId) || enquiries[0] || null;

  // Active messages state
  const [sessionMessages, setSessionMessages] = useState<Record<string, ChatMessage[]>>({
    'FNX-EQ-2026-001': [],
    'FNX-EQ-2026-002': [],
    'FNX-EQ-2026-004': []
  });

  // Checklist values state
  const [extractedSpecs, setExtractedSpecs] = useState<Record<string, Record<string, string>>>({
    'FNX-EQ-2026-001': {},
    'FNX-EQ-2026-002': {},
    'FNX-EQ-2026-004': {}
  });

  // Sizing Simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [typingState, setTypingState] = useState<'none' | 'buyer' | 'ai'>('none');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live Mode states
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [liveInput, setLiveInput] = useState<string>('');

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages, typingState]);

  // Clear chat history
  const handleClearChat = () => {
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: []
    }));
    setExtractedSpecs(prev => ({
      ...prev,
      [activeSessionId]: {}
    }));
  };

  // Reset or run simulation
  const handleStartSimulation = () => {
    const script = SCRIPTS[activeSessionId];
    if (!script) return;

    setIsSimulating(true);
    // Reset conversation and checklist to initial step 0 & 1
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: [script[0], script[1]].map((msg, idx) => ({
        id: `sim-${idx}`,
        sender: msg.sender,
        text: msg.text,
        time: msg.time
      }))
    }));
    setExtractedSpecs(prev => ({
      ...prev,
      [activeSessionId]: {}
    }));

    // Trigger sequential timeouts
    let currentIdx = 2; // Starting simulation from step 2

    const runNextStep = () => {
      if (currentIdx >= script.length) {
        setIsSimulating(false);
        setTypingState('none');

        // Save specs to app state
        const specs = DEFAULT_CHECKLIST[activeSessionId];
        if (specs) {
          onSaveSpecs(activeSessionId, {
            inputMaterial: specs.inputMaterial || '',
            targetOutputSize: specs.outputProduct || '',
            capacity: specs.capacity || '',
            separationRequired: activeSessionId !== 'FNX-EQ-2026-004',
            estimatedBudget: specs.budgetStage || ''
          });

          // Update Enquiry Status based on session
          if (activeSessionId === 'FNX-EQ-2026-004') {
            onUpdateStatus(activeSessionId, 'auto_answered');
          } else {
            onUpdateStatus(activeSessionId, 'brief_ready');
          }
        }
        return;
      }

      const nextMsg = script[currentIdx];
      // Set typing mode
      setTypingState(nextMsg.sender);

      setTimeout(() => {
        // Add message
        setSessionMessages(prev => ({
          ...prev,
          [activeSessionId]: [
            ...(prev[activeSessionId] || []),
            {
              id: `sim-${currentIdx}`,
              sender: nextMsg.sender,
              text: nextMsg.text,
              time: nextMsg.time
            }
          ]
        }));

        // Apply checklist updates if any
        if (nextMsg.updatesSpecs) {
          setExtractedSpecs(prev => ({
            ...prev,
            [activeSessionId]: {
              ...prev[activeSessionId],
              ...nextMsg.updatesSpecs
            }
          }));
        }

        currentIdx++;
        setTypingState('none');

        // Delay before AI responds (if next message is AI) or next step
        const nextDelay = 1800;
        setTimeout(runNextStep, nextDelay);

      }, 1500); // Typings indicators lasts 1.5s
    };

    // Begin sequence
    setTimeout(runNextStep, 1000);
  };

  // Quick helper to fill checklist instantly for demo
  const handleQuickComplete = () => {
    const specs = DEFAULT_CHECKLIST[activeSessionId];
    if (specs) {
      setExtractedSpecs(prev => ({
        ...prev,
        [activeSessionId]: specs
      }));

      onSaveSpecs(activeSessionId, {
        inputMaterial: specs.inputMaterial || '',
        targetOutputSize: specs.outputProduct || '',
        capacity: specs.capacity || '',
        separationRequired: activeSessionId !== 'FNX-EQ-2026-004',
        estimatedBudget: specs.budgetStage || ''
      });

      // Update parent status
      if (activeSessionId === 'FNX-EQ-2026-004') {
        onUpdateStatus(activeSessionId, 'auto_answered');
      } else {
        onUpdateStatus(activeSessionId, 'brief_ready');
      }
    }
  };

  // Send live message handler
  const handleSendLiveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveInput.trim() || typingState !== 'none') return;

    const buyerText = liveInput.trim();
    setLiveInput('');

    const currentTimeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' IST';

    const newBuyerMsg: ChatMessage = {
      id: `live-buyer-${Date.now()}`,
      sender: 'buyer',
      text: buyerText,
      time: currentTimeString
    };

    // Append Buyer's message to local chat history state
    const updatedMessages = [...(sessionMessages[activeSessionId] || []), newBuyerMsg];
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: updatedMessages
    }));

    // Update status to analyzing/collecting
    onUpdateStatus(activeSessionId, 'collecting');
    setTypingState('ai');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiReply = data.reply || "I apologize, I encountered an issue parsing your enquiry. Could you please specify your requirements again?";
      const newSpecs = data.extractedSpecs || {};

      // Append AI's reply
      const newAiMsg: ChatMessage = {
        id: `live-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: currentTimeString
      };

      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...updatedMessages, newAiMsg]
      }));

      // Merge and update extracted checklist specs
      setExtractedSpecs(prev => {
        const mergedSpecs = {
          ...prev[activeSessionId],
          ...newSpecs
        };

        // Filter and clean empty strings so checklist matches correctly
        const cleanedMerged: Record<string, string> = {};
        Object.keys(mergedSpecs).forEach(key => {
          if (mergedSpecs[key] && mergedSpecs[key].trim() !== '') {
            cleanedMerged[key] = mergedSpecs[key];
          }
        });

        // Save specs to App state
        onSaveSpecs(activeSessionId, {
          inputMaterial: cleanedMerged.inputMaterial || '',
          targetOutputSize: cleanedMerged.outputProduct || '',
          capacity: cleanedMerged.capacity || '',
          separationRequired: activeSessionId !== 'FNX-EQ-2026-004',
          estimatedBudget: cleanedMerged.budgetStage || '',
          powerAvailability: cleanedMerged.powerAvailability || '',
          siteStatus: cleanedMerged.siteStatus || '',
          timeline: cleanedMerged.timeline || '',
          budgetStage: cleanedMerged.budgetStage || ''
        });

        // Calculate completeness
        const completed = checklistKeys.filter(k => !!cleanedMerged[k]).length;
        if (completed === 7) {
          if (activeSessionId === 'FNX-EQ-2026-004') {
            onUpdateStatus(activeSessionId, 'auto_answered');
          } else {
            onUpdateStatus(activeSessionId, 'brief_ready');
          }
        }

        return {
          ...prev,
          [activeSessionId]: cleanedMerged
        };
      });

    } catch (err) {
      console.error("Error communicating with Fornnax AI:", err);
      const errorMsg: ChatMessage = {
        id: `live-ai-error-${Date.now()}`,
        sender: 'ai',
        text: "I am having difficulty connecting to our central sales system right now. However, I have saved your details. Our export engineering team will review your project requirements and follow up.",
        time: currentTimeString
      };
      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...updatedMessages, errorMsg]
      }));
    } finally {
      setTypingState('none');
    }
  };

  // Get active session specs
  const activeExtracted = extractedSpecs[activeSessionId] || {};
  
  // Calculate completed count
  const checklistKeys = [
    'inputMaterial',
    'capacity',
    'outputProduct',
    'powerAvailability',
    'siteStatus',
    'timeline',
    'budgetStage'
  ];
  
  const completedCount = checklistKeys.filter(k => !!activeExtracted[k]).length;
  const percentComplete = Math.round((completedCount / 7) * 100);

  // Set default chat sessions on mounting is disabled so user starts with a clean slate
  // and has to click "Simulate incoming enquiry" to run the simulation.

  return (
    <div className="space-y-6">
      {/* Title Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-fornnax-border pb-4 gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-fornnax-text-primary uppercase flex items-center gap-2">
            <Cpu className="w-5.5 h-5.5 text-fornnax-red" />
            <span>AI Autonomous Spec Collector</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Simulate 24/7 natural conversational profiling. Extract strict engineering specs from buyers before human engineers engage.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className="px-3 py-1.5 bg-fornnax-card hover:bg-white/[0.02] border border-fornnax-border rounded-[6px] text-xs font-semibold text-fornnax-text-primary transition-all flex items-center space-x-1.5"
          >
            <span>Back to Inbox</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[480px]">
        {/* LEFT COLUMN: ACTIVE CHATS LIST (3 cols) */}
        <div className="lg:col-span-3 bg-fornnax-card border border-fornnax-border rounded-[10px] p-3 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-widest border-b border-fornnax-border pb-2 px-1">
              Active Trade Chat Channels
            </div>

            <div className="space-y-2">
              {[
                { id: 'FNX-EQ-2026-001', name: 'Al Rashid Recycling', flag: '🇸🇦', channel: 'WhatsApp', text: 'interested in tyre recycling...', unread: true, lang: 'EN' },
                { id: 'FNX-EQ-2026-002', name: 'EcoKreis GmbH', flag: '🇩🇪', channel: 'Email', text: 'Hallo, wir suchen einen Vorzerk...', unread: false, lang: 'DE (Multilingual)' },
                { id: 'FNX-EQ-2026-004', name: 'Rudra Trading Corp', flag: '🇮🇳', channel: 'IndiaMART', text: 'price list all machines...', unread: false, lang: 'Broker (Flagged)' },
              ].map((item) => {
                const isSelected = activeSessionId === item.id;
                const enq = enquiries.find(e => e.id === item.id);
                // Calculate completion inside map
                const isComplete = enq?.status === 'brief_ready' || enq?.status === 'auto_answered' || (extractedSpecs[item.id] && Object.keys(extractedSpecs[item.id]).length === 7);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isSimulating) {
                        setActiveSessionId(item.id);
                      }
                    }}
                    disabled={isSimulating}
                    className={`w-full p-3 rounded-[8px] border text-left flex items-start justify-between transition-all relative ${
                      isSelected 
                        ? 'bg-fornnax-red/5 border-fornnax-red shadow-[inset_0_0_10px_rgba(226,58,46,0.05)]' 
                        : 'bg-fornnax-bg border-fornnax-border/75 hover:border-fornnax-border-highlight'
                    } ${isSimulating ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="min-w-0 flex items-start space-x-2.5">
                      <span className="text-xl leading-none shrink-0">{item.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-fornnax-text-primary truncate block font-sans">
                            {item.name}
                          </span>
                          {item.unread && !isComplete && (
                            <span className="w-1.5 h-1.5 rounded-full bg-fornnax-red shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-fornnax-text-secondary truncate mt-1 font-mono">
                          {item.channel} · {item.lang}
                        </p>
                        <p className="text-[10px] text-fornnax-text-secondary truncate mt-0.5 font-sans italic">
                          "{item.text}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      {isComplete ? (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${item.id === 'FNX-EQ-2026-004' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {item.id === 'FNX-EQ-2026-004' ? 'Reseller' : 'Ready'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded text-[8px] font-mono font-bold uppercase animate-pulse">
                          Live
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-fornnax-bg rounded-[8px] border border-fornnax-border/60 text-[10px] font-mono text-fornnax-text-secondary leading-normal">
            <span className="text-fornnax-red font-bold block mb-1">DAEMON LOG:</span> Listening on WhatsApp Gateway (WABA 3.0), Exchange IMAP, and IndiaMART leads webhook.
          </div>
        </div>

        {/* CENTER COLUMN: WHATSAPP-STYLE CHAT THREAD (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E0F14] border border-fornnax-border rounded-[10px] flex flex-col justify-between overflow-hidden relative shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]">
          {/* Wallpaper pattern background overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-color-dodge bg-[radial-gradient(#e23a2e_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Chat Header */}
          <div className="p-3.5 bg-fornnax-card border-b border-fornnax-border flex justify-between items-center z-10 relative">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="text-2xl">{currentEnquiry?.countryCode === 'SA' ? '🇸🇦' : currentEnquiry?.countryCode === 'DE' ? '🇩🇪' : '🇮🇳'}</span>
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-fornnax-green border-2 border-[#15161C] live-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-fornnax-text-primary font-sans leading-none flex items-center space-x-1.5">
                  <span>{currentEnquiry?.companyName}</span>
                </h4>
                <div className="flex items-center space-x-1 mt-1 text-[9px] font-mono text-fornnax-green uppercase">
                  <span>{isLiveMode ? 'Live Sizing Agent' : 'Active Sizing Daemon'}</span>
                  <span>•</span>
                  <span>{isLiveMode ? 'Connected' : 'Online'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Live Mode Toggle Switch */}
              <div className="flex items-center space-x-2 bg-zinc-900 border border-fornnax-border/70 rounded-[6px] py-1 px-2.5 select-none shrink-0">
                <span className="text-[9px] font-mono uppercase tracking-wider text-fornnax-text-secondary">Live Mode</span>
                <button
                  id="live-mode-toggle"
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`w-7.5 h-4.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    isLiveMode ? 'bg-fornnax-green' : 'bg-zinc-700'
                  }`}
                  title="Toggle live mode to chat as the buyer"
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      isLiveMode ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {isLiveMode ? (
                <button
                  onClick={handleClearChat}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-fornnax-border rounded-[6px] text-zinc-400 hover:text-white transition-all text-[9px] font-mono shrink-0"
                  title="Clear chat history to start a fresh custom conversation"
                >
                  Clear Chat
                </button>
              ) : (
                <>
                  <button
                    onClick={handleStartSimulation}
                    disabled={isSimulating}
                    className="px-3 py-1.5 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[6px] text-xs font-bold transition-all flex items-center space-x-1.5 shadow-[0_0_12px_rgba(226,58,46,0.3)] disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{percentComplete === 100 ? 'Replay Simulation' : '▶ Simulate incoming enquiry'}</span>
                  </button>

                  {percentComplete < 100 && (
                    <button
                      onClick={handleQuickComplete}
                      className="p-1.5 bg-fornnax-bg hover:bg-fornnax-border border border-fornnax-border rounded-[6px] text-fornnax-text-secondary hover:text-white transition-all text-xs font-mono"
                      title="Quick complete for presentation"
                    >
                      Skip
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Bubbles Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none z-10 relative">
            <div className="flex justify-center my-2">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full text-[9px] font-mono uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3 h-3 text-fornnax-green" />
                <span>{isLiveMode ? 'Live Interactive Session Secured' : 'End-to-End Encrypted CRM Sync'}</span>
              </span>
            </div>

            {/* Render conversation messages */}
            {(sessionMessages[activeSessionId] || []).map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAi ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}
                >
                  <div
                    className={`max-w-[85%] rounded-[12px] p-3 text-xs leading-relaxed relative border ${
                      isAi
                        ? 'bg-fornnax-red/10 border-fornnax-red/30 text-[#FFF] rounded-tr-none shadow-[0_2px_10px_rgba(226,58,46,0.05)]'
                        : 'bg-[#1D1E26] border-zinc-800 text-fornnax-text-primary rounded-tl-none'
                    }`}
                  >
                    {isAi && (
                      <span className="text-[8px] font-mono text-fornnax-red uppercase font-bold block mb-1 tracking-widest flex items-center space-x-1">
                        <Cpu className="w-2.5 h-2.5" />
                        <span>Fornnax AI Support</span>
                      </span>
                    )}
                    
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>

                    <div className="flex justify-end items-center space-x-1 mt-1 text-[8px] font-mono text-fornnax-text-secondary select-none">
                      <span>{msg.time}</span>
                      {isAi && <span className="text-fornnax-green">✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingState !== 'none' && (
              <div className={`flex ${typingState === 'ai' ? 'justify-end' : 'justify-start'}`}>
                <div className="bg-[#1D1E26] border border-zinc-800 p-3 rounded-[12px] rounded-tl-none flex items-center space-x-2">
                  <span className="text-[9px] font-mono text-fornnax-text-secondary uppercase">
                    {typingState === 'ai' ? 'Fornnax AI is typing' : 'Buyer is typing'}
                  </span>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-fornnax-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-fornnax-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-fornnax-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Footer Input Field */}
          <div className="p-3 bg-fornnax-card border-t border-fornnax-border z-10 relative flex items-center space-x-2">
            {isLiveMode ? (
              <form onSubmit={handleSendLiveMessage} className="w-full flex items-center space-x-2">
                <input
                  id="live-chat-input"
                  type="text"
                  value={liveInput}
                  onChange={(e) => setLiveInput(e.target.value)}
                  disabled={typingState !== 'none'}
                  placeholder="Type a message as the buyer..."
                  className="flex-1 bg-fornnax-bg border border-fornnax-border rounded-full px-4 py-2 text-xs text-fornnax-text-primary focus:outline-none focus:border-fornnax-red transition-all"
                />
                <button
                  type="submit"
                  disabled={!liveInput.trim() || typingState !== 'none'}
                  className="px-4 py-2 bg-fornnax-red hover:bg-fornnax-red/90 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-800 disabled:shadow-none text-white rounded-full text-xs font-bold transition-all shadow-[0_0_10px_rgba(226,58,46,0.3)] flex items-center space-x-1"
                >
                  <span>Send</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="w-full flex justify-between items-center bg-fornnax-bg border border-fornnax-border rounded-full px-4 py-2 text-xs text-fornnax-text-secondary select-none">
                <span>Sizing agent is handling this conversation autonomously...</span>
                <Volume2 className="w-4 h-4 text-fornnax-text-secondary/50 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ENQUIRY COMPLETENESS CHECKLIST PANEL (3 cols) */}
        <div className="lg:col-span-3 bg-fornnax-card border border-fornnax-border rounded-[10px] p-4 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-fornnax-border pb-2">
              <span className="text-[10px] font-mono text-fornnax-text-secondary uppercase tracking-widest">
                Enquiry Completeness
              </span>
              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold ${
                percentComplete === 100 
                  ? activeSessionId === 'FNX-EQ-2026-004' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {percentComplete === 100 
                  ? activeSessionId === 'FNX-EQ-2026-004' 
                    ? 'RESLLR FLGD' 
                    : '100% DONE' 
                  : `${percentComplete}% MATCH`}
              </span>
            </div>

            {/* Completion Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-fornnax-text-secondary">
                <span>Verification Score</span>
                <span>{completedCount} / 7 Fields Sized</span>
              </div>
              <div className="w-full h-2 bg-fornnax-bg border border-fornnax-border rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    percentComplete === 100 
                      ? activeSessionId === 'FNX-EQ-2026-004' 
                        ? 'bg-red-500' 
                        : 'bg-fornnax-green' 
                      : 'bg-fornnax-amber'
                  }`}
                />
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2.5 pt-1">
              {[
                { label: 'Input Material', key: 'inputMaterial', icon: '📦' },
                { label: 'Capacity (TPH)', key: 'capacity', icon: '⚡' },
                { label: 'Output Product', key: 'outputProduct', icon: '⚙️' },
                { label: 'Power Availability', key: 'powerAvailability', icon: '🔋' },
                { label: 'Site Status', key: 'siteStatus', icon: '🏭' },
                { label: 'Timeline', key: 'timeline', icon: '📅' },
                { label: 'Budget Stage', key: 'budgetStage', icon: '💰' },
              ].map((field) => {
                const isChecked = !!activeExtracted[field.key];
                const valueText = activeExtracted[field.key] || '';

                return (
                  <div
                    key={field.key}
                    className={`p-2.5 rounded-[8px] bg-fornnax-bg border transition-all duration-300 flex flex-col justify-between ${
                      isChecked 
                        ? activeSessionId === 'FNX-EQ-2026-004'
                          ? 'border-red-500/35 bg-red-500/[0.02]'
                          : 'border-fornnax-green/35 bg-fornnax-green/[0.02]' 
                        : 'border-fornnax-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs shrink-0">{field.icon}</span>
                        <span className="text-xs font-semibold text-fornnax-text-primary font-sans">
                          {field.label}
                        </span>
                      </div>

                      <AnimatePresence mode="popLayout">
                        {isChecked ? (
                          <motion.div
                            key="checked"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className={`p-0.5 rounded-full ${activeSessionId === 'FNX-EQ-2026-004' ? 'bg-red-500/15 text-red-400' : 'bg-fornnax-green/15 text-fornnax-green'}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ opacity: 0.5 }}
                            className="w-4 h-4 rounded-full border border-fornnax-border/80 flex items-center justify-center text-[10px] text-fornnax-text-secondary select-none"
                          >
                            ⭘
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {isChecked && (
                      <motion.span
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[10px] font-mono mt-1.5 font-bold block ${
                          activeSessionId === 'FNX-EQ-2026-004' ? 'text-red-400' : 'text-fornnax-text-primary'
                        }`}
                      >
                        {valueText}
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic completion alerts and buttons */}
          <div className="mt-3 border-t border-fornnax-border/50 pt-3">
            <AnimatePresence>
              {percentComplete === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {activeSessionId === 'FNX-EQ-2026-004' ? (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[8px] text-[10px] font-mono flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase block">automated warning:</span>
                        Reseller broker pattern detected. Auto-answered catalog. Deferring to direct operator validations.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-fornnax-green/10 border border-fornnax-green/20 text-fornnax-green rounded-[8px] text-[10px] font-mono flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-fornnax-green shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase block">dossier ready:</span>
                        Brief generated at {activeSessionId === 'FNX-EQ-2026-001' ? '02:19' : '03:45'} IST — view in Enquiry Briefs.
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {activeSessionId !== 'FNX-EQ-2026-004' && (
                      <button
                        onClick={() => setActiveTab('briefs')}
                        className="w-full py-2 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[6px] text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(226,58,46,0.3)]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View brief</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const specs = DEFAULT_CHECKLIST[activeSessionId];
                        if (specs) {
                          onSaveSpecs(activeSessionId, {
                            inputMaterial: specs.inputMaterial || '',
                            targetOutputSize: specs.outputProduct || '',
                            capacity: specs.capacity || '',
                            separationRequired: activeSessionId !== 'FNX-EQ-2026-004',
                            estimatedBudget: specs.budgetStage || ''
                          });
                        }
                        alert("Conversation specs locked & archived successfully.");
                        setActiveTab('inbox');
                      }}
                      className="w-full py-2 bg-fornnax-bg hover:bg-white/[0.04] border border-fornnax-border rounded-[6px] text-xs font-semibold text-fornnax-text-primary text-center transition-all"
                    >
                      Archive chat
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
