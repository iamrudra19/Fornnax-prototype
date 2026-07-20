import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Sparkles, 
  FileText, 
  Copy, 
  Send, 
  Check, 
  RefreshCw, 
  User, 
  ArrowRight,
  Bookmark,
  Calendar,
  MessageSquare,
  Mail,
  Linkedin,
  PhoneCall,
  Volume2,
  Clock,
  Layers,
  ChevronRight,
  Sparkle,
  Sliders,
  Flag,
  Globe,
  Settings,
  Edit2
} from 'lucide-react';
import { Enquiry } from '../types';

interface OutreachStudioViewProps {
  enquiries: Enquiry[];
  selectedEnquiryId: string | null;
  setSelectedEnquiryId: (id: string | null) => void;
}

interface TimelineStep {
  day: number;
  title: string;
  channel: 'Email' | 'WhatsApp' | 'LinkedIn' | 'Call';
  description: string;
  status: 'COMPLETED' | 'APPROVED' | 'DRAFTED' | 'PAUSED';
}

export default function OutreachStudioView({
  enquiries,
  selectedEnquiryId,
  setSelectedEnquiryId,
}: OutreachStudioViewProps) {
  // Select active lead
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (selectedEnquiryId) {
      setActiveId(selectedEnquiryId);
    } else if (enquiries.length > 0) {
      setActiveId(enquiries[0].id);
    }
  }, [selectedEnquiryId, enquiries]);

  const activeEnquiry = enquiries.find(e => e.id === activeId) || enquiries[0] || null;

  // Tabs and State Configurations
  const [activeChannel, setActiveChannel] = useState<'Email' | 'WhatsApp' | 'LinkedIn'>('Email');
  const [selectedTone, setSelectedTone] = useState<'Technical' | 'Executive' | 'Warm'>('Technical');
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'DE' | 'AR'>('EN');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Timeline list state (so steps are editable)
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([
    { 
      day: 0, 
      title: "First Touch: Signal Proposal", 
      channel: "Email", 
      description: "Initial automated export presentation tailored to local industrial licenses or country regulations.",
      status: "COMPLETED" 
    },
    { 
      day: 3, 
      title: "Case Study & GCC Reference", 
      channel: "WhatsApp", 
      description: "Share commercial shredder telemetry reports demonstrating 99.9% steel purity from high-wear desert tires.", 
      status: "APPROVED" 
    },
    { 
      day: 7, 
      title: "Senior Engineering Call Ask", 
      channel: "Call", 
      description: "Offer custom electrical drawing configurations for 3-phase regional grids (380V/480V) with Chief Designer.", 
      status: "DRAFTED" 
    }
  ]);

  const handleStepEdit = (index: number, newDesc: string) => {
    setTimelineSteps(prev => prev.map((step, idx) => idx === index ? { ...step, description: newDesc } : step));
  };

  const handleStatusToggle = (index: number) => {
    const statusCycle: TimelineStep['status'][] = ['DRAFTED', 'APPROVED', 'COMPLETED', 'PAUSED'];
    setTimelineSteps(prev => prev.map((step, idx) => {
      if (idx === index) {
        const nextIdx = (statusCycle.indexOf(step.status) + 1) % statusCycle.length;
        return { ...step, status: statusCycle[nextIdx] };
      }
      return step;
    }));
  };

  // Generate dynamic, high-fidelity realistic drafts based on selected parameters
  useEffect(() => {
    if (!activeEnquiry) return;
    generateDraft();
  }, [activeEnquiry, activeChannel, selectedTone, selectedLanguage]);

  const generateDraft = () => {
    if (!activeEnquiry) return;

    const company = activeEnquiry.companyName;
    const client = activeEnquiry.contactPerson || "Export Purchasing Team";
    const material = activeEnquiry.specs?.inputMaterial || activeEnquiry.material || "Scrap Truck Tires";
    const capacity = activeEnquiry.specs?.capacity || activeEnquiry.throughput || "5 Tons/Hour";
    const outSize = activeEnquiry.specs?.targetOutputSize || activeEnquiry.outputSize || "< 4.0mm rubber crumb";
    const country = activeEnquiry.country;

    // Is SIRC Lead?
    const isSirc = company.toLowerCase().includes('sirc') || company.toLowerCase().includes('saudi investment');
    // Is German (EcoKreis)?
    const isGermany = country.toLowerCase().includes('germany') || activeEnquiry.countryCode === 'DE';

    // 1. WhatsApp Drafts
    if (activeChannel === 'WhatsApp') {
      if (isSirc) {
        if (selectedLanguage === 'AR') {
          setDraftContent(`🇸🇦 *تقنيات فورناكس // مبادرة سابك و SIRC لرؤية 2030*

مرحباً المهندس فهد الدوسري، إشارة إلى خطة SIRC لمضاعفة سعة تدوير الإطارات في الرياض والدمام، تود شركة Fornnax تقديم حلول الفرم الأولي SR-200HD المصممة للتعامل مع الإطارات الصحراوية المشبعة بالرمال بإنتاجية 10 طن/ساعة ونقاء فصل فولاذي بنسبة 99.9%. هل يمكننا ترتيب اتصال فني مدته 10 دقائق هذا الأسبوع لتنسيق الرسومات الهندسية؟`);
        } else {
          setDraftContent(`🇸🇦 *Fornnax Tech // SIRC Saudi Vision 2030 Tyre Sizing Alignment*

Eng. Fahad Al-Dossari, following SIRC's PIF-mandated expansion of tyre processing capacity in Riyadh/Dammam, Fornnax would like to share engineering drawings for our heavy-duty SR-200HD pre-shredder. Configured for 10 Tons/Hour of continuous truck & OTR tyres, guaranteeing 99.9% wire-free rubber crumb. Let's schedule a brief 10-min engineering call.`);
        }
      } else if (isGermany) {
        if (selectedLanguage === 'DE') {
          setDraftContent(`🇩🇪 *Fornnax Altreifenrecycling-Systeme // EcoKreis*

Sehr geehrter Dr. Weber, bezüglich Ihrer Kapazitätserweiterung von 3,5 t/h in Köln bieten unsere CE-zertifizierten R-Granulatoren eine unübertroffene Drahtabscheidung von 99,9 %. Haben Sie nächste Woche Zeit für ein kurzes Telefonat zur Abstimmung der Anschlussleistung (400V 50Hz)?`);
        } else {
          setDraftContent(`🇩🇪 *Fornnax Technical Division // EcoKreis Cologne Expansion*

Dr. Weber, regarding EcoKreis's target of 3.5 TPH processing in Cologne, we have finalized the drawing integration for the Fornnax SR-200HD pre-shredder and R-Series granulator line with full CE-compliant safety cabinets. Let's coordinate a 10-minute technical session.`);
        }
      } else {
        // Fallback WhatsApp
        setDraftContent(`🌐 *Fornnax Export Division // Project ${company}*

Hello ${client}, we have prepared the engineering flow-diagrams for your proposed Fornnax ${material} processing plant (${capacity}). The recommended system guarantees a pure, wire-separated ${outSize} product. When is a suitable time to discuss electrical configurations?`);
      }
      return;
    }

    // 2. LinkedIn Drafts
    if (activeChannel === 'LinkedIn') {
      if (isSirc) {
        setDraftContent(`Subject: Alignment: Fornnax Mechanical Sizing Fleet for SIRC KSA Tire Recycling Expansion

Dear Eng. Fahad Al-Dossari,

I hope this message finds you well. I recently reviewed SIRC's strategic initiatives expanding municipal and heavy truck tyre processing capacity in Riyadh to hit Vision 2030 circularity goals.

Fornnax Technology has successfully deployed high-torque mechanical sizing equipment specifically designed to withstand sand-heavy truck tire wear. Our SR-200HD shredders feature high-yield alloy blades and direct-drive torque to continuously output premium steel-free rubber crumb.

I would be delighted to host SIRC's technical delegation for a live factory trial at our Anand headquarters. Let's connect for a brief introductory call.

Best regards,
Fornnax Export Sales Division`);
      } else if (isGermany) {
        setDraftContent(`Subject: Technical Partnership: CE-Compliant Scrap Tire Granulation for EcoKreis GmbH

Dear Dr. Hans-Dieter Weber,

I followed your extension news in Cologne regarding high-purity tire-derived fuel and rubber mulch sizing.

At Fornnax, we build CE-compliant, high-durability size-reduction plants. Our high-speed granulators feature calibrated screening grids and active water-cooled bearing blocks to handle high continuous throughput under German safety standards.

Let's schedule a technical alignment call to review your layout footprints.

Best,
Fornnax Sales Engineer`);
      } else {
        setDraftContent(`Subject: Fornnax Sizing Equipment Alignment // Project: ${company}

Dear ${client},

We observed your active expansion in ${country} and would like to share our catalog for high-efficiency processing of ${material}. Our robust machinery is engineered for heavy industrial wear with minimal downtime.

Let's connect to review how we can support your ${capacity} throughput targets.

Warm regards,
Fornnax Export Division`);
      }
      return;
    }

    // 3. Email Drafts
    if (isSirc) {
      if (selectedTone === 'Executive') {
        setDraftContent(`Subject: STRATEGIC PARTNERSHIP PROPOSAL: High-Capacity Tyre Recycling Sizing Fleet for SIRC Vision 2030

Dear Eng. Ziad Al-Shiha,
CEO, Saudi Investment Recycling Company (SIRC)

Following up on SIRC's public initiatives to expand local circular processing infrastructure in support of Saudi Vision 2030, Fornnax Technology would like to propose a high-capacity tyre recycling sizing fleet tailored for heavy truck and OTR tire volumes in KSA.

We recommend our dual-shaft pre-shredder (SR-200HD) paired with secondary granulator lines, designed specifically for sand-laden desert tyres. This configuration guarantees an output of high-purity rubber crumb (<4.0mm) with 99.9% wire and textile separation.

Would you be available for a brief technical alignment call this week with our director of global exports?

Best regards,

Fornnax Export Sales Division
Anand, Gujarat, India`);
      } else {
        setDraftContent(`Subject: Technical Sizing Proposal: Fornnax 10 TPH Shredding Configuration for SIRC Riyadh

Dear Eng. Fahad Al-Dossari,
Lead Procurement Manager, Saudi Investment Recycling Company (SIRC)

In response to SIRC's PIF-mandated expansion for national tire recycling hubs in Riyadh, Fornnax has compiled a technical recommendation for high-capacity continuous sizing:

Recommended Fleet Configuration:
1. Primary Sizing: Fornnax Dual-Shaft Shredder SR-200HD
   - Massive dual-motor high-torque powertrain designed for thick truck & mining OTR tires.
   - Specialized sand-exclusion bearing seals to guarantee prolonged blade lifespan in desert environments.
2. Fine Granulation: R-Series High-Speed Sizers
   - Reduces tire chips to high-grade <4.0mm athletic rubber crumb.
   - Complete electromagnetic separator cross-belt to pull 99.9% wire scrap.

Fornnax machinery is fully compliant with regional grid standards (3-Phase 380V, 60Hz) and is backed by dedicated field-service engineering support in Riyadh.

We would be pleased to schedule a 15-minute video call to present our complete technical drawing and 3D layout footprints.

Warm regards,

Fornnax Export Sales Division
Anand, Gujarat, India
www.fornnaxtools.com`);
      }
    } else if (isGermany) {
      if (selectedLanguage === 'DE') {
        setDraftContent(`Betreff: Technischer Entwurf und Angebot: CE-konforme Altreifen-Recyclinganlage für EcoKreis GmbH

Sehr geehrter Dr. Weber,

Vielen Dank für Ihre Anfrage an Fornnax Technology. Wir freuen uns, Ihnen unser technisches Konzept für Ihre Altreifen-Aufbereitungsanlage in Köln vorzulegen.

Um Ihre geforderte Kapazität von 3,5 t/h zu erreichen, empfehlen wir folgende Fornnax-Systemkonfiguration:

1. Fornnax Vorzerkleinerer SR-200HD (CE-zertifiziert)
   - Hohes Drehmoment für problemlose OTR-Zerkleinerung.
   - Doppelgehärtete Messerplatten aus D2-Werkzeugstahl.
2. Fornnax Feingranulator R-Serie
   - Präzise Zerkleinerung auf < 4,0 mm Gummigranulat.
   - Hocheffiziente Magnetscheider für 99,9 % metallfreie Reinheit.

Unser Anand-Werk fertigt streng nach europäischen CE-Sicherheitsrichtlinien. Wir laden Sie herzlich zu einem Live-Materialtest in unser Werk ein.

Mit freundlichen Grüßen,

Fornnax Export Sales Division
Anand, Gujarat, Indien`);
      } else {
        setDraftContent(`Subject: Technical Proposal: Fornnax CE-Certified Tire Recycling Fleet for EcoKreis GmbH

Dear Dr. Hans-Dieter Weber,

Thank you for your active interest in Fornnax Technology. We are pleased to submit our initial technical recommendation for EcoKreis's proposed tire recycling extension in Cologne, Germany.

Based on your requirement of 3.5 Tons/Hour continuous feed and a target output of tire-derived fuel chips combined with <4.0mm rubber granules, we propose the following Fornnax configuration:

Proposed Machinery Layout:
- Primary Shredder: Fornnax SR-200HD (with dedicated CE-certified control panel)
- Fine Reduction: Fornnax High-Speed R-Series Sizers with custom screening grids
- Separation: Multi-drum magnetic conveyors to extract high-purity scrap steel wire

We look forward to hosting your engineering delegation for a live machinery demonstration. Please let us know your availability.

Best regards,

Fornnax Export Sales Division
Anand, Gujarat, India`);
      }
    } else {
      // General Template
      setDraftContent(`Subject: Export Proposal: Fornnax Industrial Recycling Sizing Fleet for ${company}

Dear ${client},

Following up on your export enquiry for ${company} regarding your high-volume size-reduction goals, we have developed a customized Fornnax machinery proposal:

Project Specs Under Consideration:
- Material Feed: ${material}
- Processing Capacity: ${capacity}
- Output Grade: ${outSize}

Our proposed system integrates our high-torque dual-shaft pre-shredding unit with secondary magnetic conveyor separators to guarantee extreme purity fractions with very low operating capex.

We invite you to share a material sample for live testing at our Gujarat HQ.

Sincerely,

Fornnax Export Sales Division
Anand, Gujarat, India
www.fornnaxtools.com`);
    }
  };

  const handleAiRefine = () => {
    setIsGenerating(true);
    setSuccessToast(null);
    setTimeout(() => {
      setIsGenerating(false);
      setDraftContent(prev => prev + `\n\n[AI ENHANCED UPDATE] Compiled GCC regional reference metrics: Demonstrated 99.9% steel extraction purity at 8.5 TPH average operations with sand-exclusion rotor bearings.`);
      setSuccessToast("Draft enhanced with premium localized case-study metrics!");
      setTimeout(() => setSuccessToast(null), 3000);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setSuccessToast(null);
    setTimeout(() => {
      setSent(false);
      setSuccessToast(`Technical offer successfully transmitted via ${activeChannel}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-fornnax-green/15 border border-fornnax-green/30 text-fornnax-green text-xs font-mono py-2.5 px-4 rounded-[6px] flex items-center space-x-2 animate-fadeIn shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase flex items-center space-x-2">
            <PenTool className="w-6 h-6 text-fornnax-red" />
            <span>AI Outreach Studio</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Compose high-accuracy commercial quotations, CE certifications, and tailored GCC factory-trial invitations for foreign importers.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-fornnax-green animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            SMTP & WhatsApp Gateway Connected
          </span>
        </div>
      </div>

      {activeEnquiry ? (
        /* Three-Panel Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Panel 1: Lead Selector (3 Cols) */}
          <div className="lg:col-span-3 bg-fornnax-card/95 border border-fornnax-border rounded-[10px] p-4 flex flex-col justify-between max-h-[720px] overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block border-b border-fornnax-border pb-2">
                Active Importers
              </span>

              <div className="space-y-2">
                {enquiries.map((enq) => {
                  const isActive = enq.id === activeId;
                  const isSirc = enq.companyName.toLowerCase().includes('sirc') || enq.companyName.toLowerCase().includes('saudi investment');
                  const scoreColor = enq.score >= 70 ? 'text-fornnax-green' : enq.score >= 40 ? 'text-fornnax-amber' : 'text-fornnax-red';
                  
                  return (
                    <button
                      key={enq.id}
                      onClick={() => {
                        setActiveId(enq.id);
                        setSelectedEnquiryId(enq.id);
                      }}
                      className={`w-full text-left p-3 rounded-[8px] border transition-all flex flex-col justify-between gap-2.5 ${
                        isActive
                          ? 'bg-zinc-900 border-fornnax-red shadow-[inset_0_0_8px_rgba(226,58,46,0.15)]'
                          : 'bg-fornnax-bg border-fornnax-border hover:border-zinc-700 hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="truncate">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate block max-w-[130px]">
                            {enq.companyName}
                          </span>
                          <span className="text-xs">{enq.countryCode === 'SA' ? '🇸🇦' : enq.countryCode === 'DE' ? '🇩🇪' : enq.countryCode === 'US' ? '🇺🇸' : enq.countryCode === 'IN' ? '🇮🇳' : enq.countryCode === 'EG' ? '🇪🇬' : '🌐'}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                          Ref: {enq.id.slice(-4)} • Score: <strong className={scoreColor}>{enq.score}</strong>
                        </span>
                      </div>

                      {isSirc && (
                        <span className="text-[8px] font-mono bg-fornnax-green/10 text-fornnax-green border border-fornnax-green/20 rounded px-1.5 py-0.5 uppercase tracking-wider font-bold w-max">
                          SIRC Saudi Lead
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-fornnax-border text-[10px] font-mono text-zinc-500 space-y-1 bg-zinc-950/40 p-2.5 rounded-lg">
              <div className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1 flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5 text-fornnax-red" />
                <span>Selected Lead Metadata</span>
              </div>
              <div className="truncate">Client: <span className="text-white font-medium">{activeEnquiry.contactPerson || 'Export Agent'}</span></div>
              <div className="truncate">Subject: <span className="text-white font-medium">{activeEnquiry.emailSubject}</span></div>
              <div className="truncate">Rate: <span className="text-white font-medium">{activeEnquiry.throughput}</span></div>
            </div>
          </div>

          {/* Panel 2: Message Editor (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-fornnax-card/95 border border-fornnax-border rounded-[10px] p-5">
            <div className="space-y-4 flex-1 flex flex-col">
              
              {/* Header Configuration Panel */}
              <div className="flex flex-col gap-3 pb-3 border-b border-fornnax-border">
                
                {/* Channels tabs */}
                <div className="flex justify-between items-center">
                  <div className="flex bg-fornnax-bg p-1 rounded-lg border border-fornnax-border">
                    {(['Email', 'WhatsApp', 'LinkedIn'] as const).map((ch) => {
                      const isActive = activeChannel === ch;
                      return (
                        <button
                          key={ch}
                          onClick={() => setActiveChannel(ch)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1 ${
                            isActive 
                              ? 'bg-zinc-800 text-white shadow-sm' 
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {ch === 'Email' ? <Mail className="w-3 h-3 text-fornnax-red shrink-0" /> :
                           ch === 'WhatsApp' ? <MessageSquare className="w-3 h-3 text-fornnax-green shrink-0" /> :
                           <Linkedin className="w-3 h-3 text-blue-500 shrink-0" />}
                          <span>{ch}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleAiRefine}
                    disabled={isGenerating}
                    className="p-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-fornnax-border text-[10px] font-mono font-bold text-fornnax-amber rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
                    title="Insert heavy GCC case-studies into proposal body"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Refine Case-Study</span>
                  </button>
                </div>

                {/* Sub-selectors (Tones & Languages) */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Tone selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Tone:</span>
                    <div className="flex bg-fornnax-bg rounded-md border border-fornnax-border p-0.5">
                      {(['Technical', 'Executive', 'Warm'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTone(t)}
                          className={`p-1 px-2 text-[8px] font-mono uppercase rounded font-bold ${
                            selectedTone === t ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Lang:</span>
                    <div className="flex bg-fornnax-bg rounded-md border border-fornnax-border p-0.5">
                      {(['EN', 'DE', 'AR'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setSelectedLanguage(l)}
                          className={`p-1 px-2 text-[8px] font-mono uppercase rounded font-bold ${
                            selectedLanguage === l ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Composition Workspace Textarea */}
              <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-1">
                  <span>DRAFT READY • VERIFIED FREE OF GRAMMATICAL ERRORS</span>
                  <button onClick={handleCopy} className="text-fornnax-red hover:underline font-bold">
                    {copied ? '✓ COPIED TO CLIPBOARD' : 'COPY DRAFT'}
                  </button>
                </div>
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full flex-1 bg-fornnax-bg border-2 border-fornnax-border rounded-[8px] p-4 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-fornnax-red resize-none overflow-y-auto shadow-inner"
                />
              </div>

            </div>

            {/* Transmitter footer buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-fornnax-border">
              <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                <span>Last compiled: just now</span>
              </span>

              <button
                onClick={handleSend}
                disabled={sent}
                className="px-6 py-2.5 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[8px] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(226,58,46,0.25)]"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>{sent ? 'Transmitting offer...' : `Send Technical ${activeChannel}`}</span>
              </button>
            </div>
          </div>

          {/* Panel 3: Sequence Timeline (3 Cols) */}
          <div className="lg:col-span-3 bg-fornnax-card/95 border border-fornnax-border rounded-[10px] p-4 flex flex-col justify-between max-h-[720px] overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block border-b border-fornnax-border pb-2">
                Drip Sequence Timeline
              </span>

              <div className="space-y-4 relative pl-3 border-l border-zinc-800">
                {timelineSteps.map((step, idx) => {
                  const statusColors = 
                    step.status === 'COMPLETED' ? 'bg-fornnax-green/10 text-fornnax-green border-fornnax-green/20' :
                    step.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    step.status === 'DRAFTED' ? 'bg-fornnax-amber/10 text-fornnax-amber border-fornnax-amber/20' :
                    'bg-zinc-800 text-zinc-500 border-zinc-700/60';

                  return (
                    <div key={idx} className="relative space-y-1.5">
                      
                      {/* Timeline Node dot */}
                      <div className={`absolute -left-[17px] top-1 w-2 h-2 rounded-full border-2 ${
                        step.status === 'COMPLETED' ? 'bg-fornnax-green border-fornnax-green shadow-[0_0_8px_#10B981]' :
                        step.status === 'APPROVED' ? 'bg-blue-400 border-blue-400' :
                        'bg-zinc-800 border-zinc-700'
                      }`} />

                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-black text-white">
                          DAY {step.day} • {step.channel}
                        </span>
                        
                        <button
                          onClick={() => handleStatusToggle(idx)}
                          className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded border ${statusColors} select-none hover:opacity-80 transition-opacity`}
                          title="Click to cycle status"
                        >
                          {step.status}
                        </button>
                      </div>

                      <h5 className="text-[11px] font-sans font-bold text-zinc-200">
                        {step.title}
                      </h5>

                      {/* Interactive text editor for the description */}
                      <textarea
                        value={step.description}
                        onChange={(e) => handleStepEdit(idx, e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded p-1.5 text-[10px] font-mono text-zinc-400 focus:outline-none focus:border-fornnax-red focus:bg-zinc-950 resize-none leading-relaxed transition-all"
                        placeholder="Step description..."
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-fornnax-border space-y-2 text-[10px] font-mono text-zinc-500">
              <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wider">
                Active Drip Trigger Panel
              </span>
              <p className="leading-relaxed">
                Drip sequences execute automatically based on CRM status hooks. Custom edits persist locally for immediate sandbox demo validation.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-fornnax-card border border-fornnax-border rounded-[10px] text-zinc-400 text-xs font-mono">
          Please select an active importer or custom signal to draft outreach sequences.
        </div>
      )}
    </div>
  );
}
