import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Target,
  Search,
  Check,
  Loader2,
  TrendingUp,
  Users,
  Globe,
  X,
  Sparkles,
  Database,
  MapPin,
  Factory,
  Radar,
  Gauge,
  UserRound,
  RotateCcw,
  Filter,
  Zap,
  Terminal
} from 'lucide-react';
import { Lead } from '../types';

interface LeadFinderViewProps {
  onImportLead: (lead: Lead) => void;
  setActiveTab?: (tab: string) => void;
  setSelectedEnquiryId?: (id: string | null) => void;
}

// ---------- Fornnax ICP filter dimensions ----------

type Region = 'Middle East (GCC)' | 'Europe' | 'India' | 'Australia & NZ' | 'Africa';
type Segment =
  | 'Tyre Recycling (TDF / Crumb)'
  | 'Tyre Pyrolysis'
  | 'MSW → RDF / WtE'
  | 'Cement Co-processing';
type Stage =
  | 'New License / Permit'
  | 'Live Tender'
  | 'Expansion Announced'
  | 'Operating — Upgrade Candidate';
type CapacityTier = '1–3 TPH' | '3–6 TPH' | '6–10 TPH' | '10+ TPH';
type DmRole = 'Owner / MD' | 'Plant Director' | 'Head of Projects' | 'Procurement Head';

const REGIONS: Region[] = ['Middle East (GCC)', 'Europe', 'India', 'Australia & NZ', 'Africa'];
const SEGMENTS: Segment[] = [
  'Tyre Recycling (TDF / Crumb)',
  'Tyre Pyrolysis',
  'MSW → RDF / WtE',
  'Cement Co-processing'
];
const STAGES: Stage[] = [
  'New License / Permit',
  'Live Tender',
  'Expansion Announced',
  'Operating — Upgrade Candidate'
];
const CAPACITIES: CapacityTier[] = ['1–3 TPH', '3–6 TPH', '6–10 TPH', '10+ TPH'];
const DM_ROLES: DmRole[] = ['Owner / MD', 'Plant Director', 'Head of Projects', 'Procurement Head'];

interface LeadRecord {
  id: string;
  companyName: string;
  country: string;
  countryCode: string;
  flag: string;
  region: Region;
  segment: Segment;
  stage: Stage;
  capacityTier: CapacityTier;
  dmRole: DmRole;
  existingCustomer?: boolean;
  headline: string;
  source: string;
  date: string;
  fitScore: number;
  reasoning: string;
  snapshot: string;
  decisionMakers: { name: string; role: string }[];
  projectSize: string;
  competitors: string[];
  recommendedAngle: string;
  material: string;
  throughput: string;
  outputSize: string;
  estimatedBudget: string;
}

// ---------- Scrapeable ICP database (mock — real companies) ----------

const LEAD_DB: LeadRecord[] = [
  {
    id: 'LD-001',
    companyName: 'Saudi Investment Recycling Company (SIRC)',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'PIF-owned SIRC expanding tyre recycling capacity under Vision 2030',
    source: 'Saudi Press Agency & PIF circular',
    date: 'Jul 18, 2026',
    fitScore: 94,
    reasoning: 'Government-backed, high-capacity truck/OTR volumes — SR-200HD config recommended',
    snapshot:
      "Wholly owned subsidiary of PIF (Public Investment Fund) tasked with driving Saudi Arabia's circular economy and waste diversion targets up to 94% by 2035. Setting up multiple high-tonnage regional tire recycling hubs.",
    decisionMakers: [
      { name: 'Eng. Ziad Al-Shiha', role: 'CEO' },
      { name: 'Dr. Khalid Al-Mutairi', role: 'VP Waste-to-Energy' },
      { name: 'Eng. Fahad Al-Dossari', role: 'Lead Procurement Manager' }
    ],
    projectSize: 'Est. $2.5M - $4.0M mechanical line installations',
    competitors: ['Eldan (Denmark)', 'Vecoplan (Germany)', 'UNTHA (Austria)'],
    recommendedAngle:
      'Leverage Fornnax SR-200HD high-torque pre-shredder capabilities. Focus on extreme sand-resistance features for desert-harvested truck tires and guarantee 99.9% steel purity for secondary steel recycling.',
    material: 'Scrap Truck & Car Tires (up to 1200mm)',
    throughput: '10.0 Tons / Hour',
    outputSize: '< 4.0 mm wire-free rubber crumb',
    estimatedBudget: '$3,800,000'
  },
  {
    id: 'LD-002',
    companyName: 'Rubber Future (Future Environmental Group)',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '3–6 TPH',
    dmRole: 'Owner / MD',
    headline: "Riyadh's premier tyre recycler scaling crumb output under Vision 2030",
    source: 'Future Environmental Group disclosures (fe-sa.com)',
    date: 'Jul 14, 2026',
    fitScore: 90,
    reasoning: 'Flagship KSA recycler adding crumb capacity — SR-150 + R-Series combo fits stated roadmap',
    snapshot:
      'Riyadh-based flagship of Future Environmental Group, positioned as the premier tyre recycling operator in Saudi Arabia. Scaling collection network and crumb rubber output as Vision 2030 landfill-diversion targets tighten across the Kingdom.',
    decisionMakers: [
      { name: 'Abdullah Al-Qahtani', role: 'Managing Director' },
      { name: 'Eng. Sami Al-Harbi', role: 'Plant Operations Head' }
    ],
    projectSize: 'Est. $1.2M - $2.0M crumb line expansion',
    competitors: ['Eldan (Denmark)', 'UNTHA (Austria)'],
    recommendedAngle:
      'Propose an SR-150 primary + R-Series secondary combination sized for 4 TPH. Emphasize regional installation record, faster spare-part logistics from India vs. Northern Europe, and desert-dust hardening.',
    material: 'Passenger & light truck tyres',
    throughput: '4.0 Tons / Hour',
    outputSize: '< 4.0 mm rubber crumb',
    estimatedBudget: '$1,450,000'
  },
  {
    id: 'LD-003',
    companyName: 'SARPCO — Saudi Rubber Products Co.',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Operating — Upgrade Candidate',
    capacityTier: '1–3 TPH',
    dmRole: 'Plant Director',
    headline: '30-year-old Dammam crumb rubber operation — aging line, growing product range',
    source: 'Saudi industrial directory & company filings',
    date: 'Jul 10, 2026',
    fitScore: 84,
    reasoning: 'Legacy machinery due for modernization; KSA quality crackdowns favor certified equipment upgrades',
    snapshot:
      'Dammam-based rubber products manufacturer operating for over 30 years, producing crumb-rubber-based goods for construction and infrastructure. Aging processing lines and stricter Saudi quality enforcement make it a prime modernization candidate.',
    decisionMakers: [
      { name: 'Khalid Al-Dossary', role: 'Plant Director' },
      { name: 'Faisal Al-Amri', role: 'Maintenance & Engineering Manager' }
    ],
    projectSize: 'Est. $600K - $1.0M line modernization',
    competitors: ['Local fabricators', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Lead with the 2021 KSA recycling-quality crackdown: position Fornnax as the certified upgrade path with guaranteed output consistency, on-site commissioning, and a trade-in style phased replacement of legacy shredders.',
    material: 'Scrap car tyres & rubber offcuts',
    throughput: '2.5 Tons / Hour',
    outputSize: '< 2.0 mm crumb powder',
    estimatedBudget: '$820,000'
  },
  {
    id: 'LD-004',
    companyName: 'Sharjah National Rubber Industries (Ghantoot Group)',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Operating — Upgrade Candidate',
    capacityTier: '3–6 TPH',
    dmRole: 'Plant Director',
    headline: 'Runs an ELDAN line today — competitor displacement & capacity expansion play',
    source: 'Eldan Recycling public case study',
    date: 'Jul 08, 2026',
    fitScore: 88,
    reasoning: 'Named Eldan reference site — displacement target with a concrete cost-per-tonne comparison',
    snapshot:
      'Ghantoot Group tyre recycling unit in Sharjah, publicly documented as an Eldan equipment reference site. Processes UAE scrap tyres into crumb and granulate for export and local rubber products.',
    decisionMakers: [
      { name: 'Rashid Al-Mazrouei', role: 'Plant Director' },
      { name: 'Vinod Menon', role: 'Group Purchase Manager' }
    ],
    projectSize: 'Est. $1.0M - $1.8M second-line addition',
    competitors: ['Eldan (Denmark) — INCUMBENT LINE', 'UNTHA (Austria)'],
    recommendedAngle:
      'Competitive displacement: benchmark Fornnax cost-per-tonne, blade life, and 48-hour spare-part delivery from Gujarat against the incumbent Danish line. Offer a paid material trial at the Mundra demo plant.',
    material: 'Car & truck tyres',
    throughput: '5.0 Tons / Hour',
    outputSize: '0.8 - 4.0 mm granulate',
    estimatedBudget: '$1,350,000'
  },
  {
    id: 'LD-005',
    companyName: 'Tadweer (Abu Dhabi Waste Management)',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '3–6 TPH',
    dmRole: 'Head of Projects',
    headline: 'Al Ain tyre plant processing 2,000 t/month — capacity expansion candidate',
    source: 'Waste & Recycling MEA sector report',
    date: 'Jul 05, 2026',
    fitScore: 85,
    reasoning: 'Government entity with operating plant at capacity ceiling; granulate demand rising in UAE',
    snapshot:
      "Abu Dhabi's public waste management company operating a tyre recycling facility in Al Ain handling roughly 2,000 tonnes per month, producing 0.8-4mm granules. Emirate-level landfill diversion targets are pushing throughput requirements up.",
    decisionMakers: [
      { name: 'Eng. Mohammed Al-Marzouqi', role: 'Head of Projects' },
      { name: 'Aisha Al-Suwaidi', role: 'Procurement Section Manager' }
    ],
    projectSize: 'Est. $1.5M - $2.5M throughput expansion',
    competitors: ['Eldan (Denmark)', 'Lindner (Germany)'],
    recommendedAngle:
      'Pitch a parallel SR-series line to break the 2,000 t/month ceiling without stopping the existing plant. Emphasize government-grade documentation, CE compliance, and regional reference installs.',
    material: 'Mixed car & truck tyres',
    throughput: '5.0 Tons / Hour',
    outputSize: '0.8 - 4.0 mm granules',
    estimatedBudget: '$1,900,000'
  },
  {
    id: 'LD-006',
    companyName: 'BEEAH Group (Sharjah)',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East (GCC)',
    segment: 'MSW → RDF / WtE',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: 'Tendering commercial & industrial waste processing lines for WtE expansion',
    source: 'Sharjah Municipality Tender Portal Ref #AE-BE-2026',
    date: 'Jul 12, 2026',
    fitScore: 86,
    reasoning: 'Ideal MSW/RDF pre-shredding application for high-density municipal waste',
    snapshot:
      "The Middle East's pioneer in environmental services and waste management. Developing waste-to-energy expansion in the Northern Emirates requiring state-of-the-art solid waste shredders for RDF feedstock.",
    decisionMakers: [
      { name: 'Eng. Khaled Al Huraimel', role: 'Group CEO' },
      { name: 'Fahad Shehail', role: 'Chief Operating Officer' }
    ],
    projectSize: 'Est. $3.0M - $5.0M comprehensive sorting plant upgrade',
    competitors: ['UNTHA (Austria)', 'Lindner Recyclingtech (Germany)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'Propose dual SR-200 series primary shredders configured with anti-wrap shafts and aggressive cutters to prevent nylon wire choking. Emphasize low electrical power draw compared to European alternatives.',
    material: 'Municipal Solid Waste (MSW) & Industrial Plastics',
    throughput: '12.0 Tons / Hour',
    outputSize: '< 80.0 mm RDF coarse fraction',
    estimatedBudget: '$4,500,000'
  },
  {
    id: 'LD-007',
    companyName: 'Genan',
    country: 'Denmark',
    countryCode: 'DK',
    flag: '🇩🇰',
    region: 'Europe',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: 'Sold Houston plant to Liberty Tire (Jul 2026) to concentrate capital on European expansion',
    source: 'Tyre & Rubber Recycling — Jul 16, 2026',
    date: 'Jul 16, 2026',
    fitScore: 91,
    reasoning: "World's largest ELT recycler with fresh expansion budget earmarked for Europe",
    snapshot:
      "The world's largest end-of-life tyre recycler, headquartered in Denmark with multiple high-tonnage European plants. Just divested its US Houston facility to Liberty Tire Recycling to focus investment on growing European operations.",
    decisionMakers: [
      { name: 'Lars Raahauge', role: 'Head of Business Development' },
      { name: 'Poul Steen Rasmussen', role: 'Group CEO' }
    ],
    projectSize: 'Est. €2.0M - €4.0M European line additions',
    competitors: ['Eldan (Denmark)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'Time-sensitive: post-divestment capital is being redeployed into Europe. Pitch Fornnax as the cost-advantaged capacity play for their next European line, with a paid trial and IFAT follow-up meeting.',
    material: 'Car & truck tyres (high volume)',
    throughput: '12.0 Tons / Hour',
    outputSize: '< 4.0 mm wire-free crumb',
    estimatedBudget: '$3,200,000'
  },
  {
    id: 'LD-008',
    companyName: 'Murfitts Industries Ltd.',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '3–6 TPH',
    dmRole: 'Owner / MD',
    headline: 'UK\u2019s largest tyre recycler increasing rubber crumb output for sports & safety surfaces',
    source: 'UK Rubber Association Bulletin',
    date: 'Jul 09, 2026',
    fitScore: 85,
    reasoning: 'Requires fine granulation line (R-Series + high speed granulator)',
    snapshot:
      'Major UK tire processor and market leader in sports turf rubber surfacing crumb. Expanding their fine-powder compounding facilities in Ely to support European athletic track exports.',
    decisionMakers: [
      { name: 'Mark Murfitt', role: 'Managing Director' },
      { name: 'Ian Mitchell', role: 'Technical Director' }
    ],
    projectSize: '$750,000 - $1,100,000 fine-powder lines',
    competitors: ['Eldan (Denmark)', 'Granutech-Saturn (USA)'],
    recommendedAngle:
      'Showcase Fornnax R-Series secondary granulator crumb yield purity, lower rotor maintenance costs, and our patented magnetic cross-belt separation effectiveness.',
    material: 'Pre-shredded 20mm rubber mulch',
    throughput: '3.5 Tons / Hour',
    outputSize: '< 2.0 mm rubber crumb powder',
    estimatedBudget: '$920,000'
  },
  {
    id: 'LD-009',
    companyName: 'Ragn-Sells Estonia',
    country: 'Estonia',
    countryCode: 'EE',
    flag: '🇪🇪',
    region: 'Europe',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'New License / Permit',
    capacityTier: '3–6 TPH',
    dmRole: 'Head of Projects',
    headline: 'Planning tyre-shredding plant feeding Enefit Power — ~15,000 t/yr ELT',
    source: 'Weibold Intelligence bulletin',
    date: 'Jul 03, 2026',
    fitScore: 87,
    reasoning: 'Greenfield plant with confirmed offtake partner — equipment selection window open now',
    snapshot:
      'Nordic environmental group planning a tyre-shredding facility in Estonia in cooperation with Enefit Power, targeting roughly 15,000 tonnes of end-of-life tyres per year as feedstock for sustainable fuel production.',
    decisionMakers: [
      { name: 'Rain Vääna', role: 'CEO, Ragn-Sells Estonia' },
      { name: 'Kai Realo', role: 'Group Development Director' }
    ],
    projectSize: 'Est. €1.2M - €2.0M greenfield shredding line',
    competitors: ['Eldan (Denmark)', 'UNTHA (Austria)', 'Lindner (Germany)'],
    recommendedAngle:
      'Greenfield spec-in opportunity: get Fornnax into the tender spec before European vendors lock it. Lead with TDF chip consistency guarantees matched to Enefit Power feedstock requirements and total landed cost.',
    material: 'End-of-life tyres (15,000 t/yr)',
    throughput: '4.0 Tons / Hour',
    outputSize: '50 - 80 mm TDF chips',
    estimatedBudget: '$1,600,000'
  },
  {
    id: 'LD-010',
    companyName: 'Tyrecycle (ResourceCo)',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'Australia & NZ',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '6–10 TPH',
    dmRole: 'Procurement Head',
    headline: "Scaling OTR tyre processing after Australia's whole-tyre export ban",
    source: 'Australia Customs Manifests & EPR Board',
    date: 'Jul 15, 2026',
    fitScore: 92,
    reasoning: 'Strict ban on scrap exports forcing local processors to purchase massive mining-region OTR lines',
    snapshot:
      "Australia's largest tyre recycler, operating processing plants nationwide. Experiencing massive influx of heavy mining OTR tires from Pilbara region since export bans took strict effect.",
    decisionMakers: [
      { name: 'George J.', role: 'GM Engineering & Procurement' },
      { name: 'Dr. Sarah Mitchell', role: 'Lead Process Architect' }
    ],
    projectSize: 'Est. $1.5M - $2.2M mechanical granulator systems',
    competitors: ['Eldan (Denmark)', 'UNTHA (Austria)'],
    recommendedAngle:
      "Highlight Fornnax's high-speed granulator durability and active water cooling design for high-throughput continuous operations in Australia's high-ambient mining regions.",
    material: 'Heavy OTR & Off-highway Earthmover Tires',
    throughput: '6.0 Tons / Hour',
    outputSize: '10-20mm TDF chips and steel separated crumb',
    estimatedBudget: '$1,850,000'
  },
  {
    id: 'LD-011',
    companyName: 'RPM Automotive Group',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'Australia & NZ',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '3–6 TPH',
    dmRole: 'Owner / MD',
    existingCustomer: true,
    headline: 'Public Fornnax partnership — expansion & referral play into ANZ market',
    source: 'Waste Management World — Fornnax partnership feature',
    date: 'Jul 11, 2026',
    fitScore: 93,
    reasoning: 'EXISTING CUSTOMER with published case study — fastest path to expansion & referral revenue',
    snapshot:
      'ASX-listed automotive parts and tyre group building out tyre recycling capability with Fornnax equipment — the partnership is publicly documented in trade press as a driver of circular-economy efficiency in Australia.',
    decisionMakers: [
      { name: 'Clive Finkelstein', role: 'Executive Chairman' },
      { name: 'Guy Nicholls', role: 'Group CEO' }
    ],
    projectSize: 'Est. $800K - $1.5M capacity extension',
    competitors: ['— (incumbent vendor: Fornnax)'],
    recommendedAngle:
      'Land-and-expand: propose the next capacity stage plus a formal referral/reference program. Their public case study is the strongest proof asset for every other ANZ prospect in this list.',
    material: 'Car & 4WD tyres',
    throughput: '4.0 Tons / Hour',
    outputSize: '< 4.0 mm crumb',
    estimatedBudget: '$1,100,000'
  },
  {
    id: 'LD-012',
    companyName: 'CPCB EPR Registrants (6 new crumb plants)',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'New License / Permit',
    capacityTier: '3–6 TPH',
    dmRole: 'Owner / MD',
    headline: 'CPCB tyre EPR mandate: 6 new crumb rubber plant registrants this week',
    source: 'CPCB National EPR Portal (India)',
    date: 'Jul 05, 2026',
    fitScore: 89,
    reasoning: 'Domestic home-turf pipeline expansion. Highly active tier-2 promoters looking for robust equipment.',
    snapshot:
      "Regulatory body overseeing India's strict mandatory recycling credits (EPR) for tire importers. Prompting a boom in local medium-to-high capacity greenfield crumb rubber plant registrations.",
    decisionMakers: [
      { name: 'Suresh Patel', role: 'Managing Partner (EPR Applicant)' },
      { name: 'Eng. RK Sharma', role: 'Chief Assessor' }
    ],
    projectSize: '₹12 Cr - ₹18 Cr per facility',
    competitors: ['Local unorganized fabricators', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Promote Fornnax as the premium domestic gold-standard with zero customs duty delays, 100% locally available high-speed spare parts, and instant on-site installation support in Gujarat.',
    material: 'Scrap car & truck tires',
    throughput: '4.0 Tons / Hour',
    outputSize: '< 4.0 mm rubber crumb + clean steel',
    estimatedBudget: '$850,000'
  },
  {
    id: 'LD-013',
    companyName: 'Geocycle India / UltraTech TDF Suppliers',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Cement Co-processing',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'Cement co-processing ramping TDF demand — suppliers need primary shredders',
    source: 'Indian Cement Co-Processing Forum Bulletin',
    date: 'Jul 01, 2026',
    fitScore: 82,
    reasoning: 'High volume pre-shredding to feed cement kilns. Sells directly to regional suppliers.',
    snapshot:
      'Major cement manufacturers expanding multi-fuel burners to incorporate tire-derived fuel (TDF chips). Their registered scrap suppliers require high-reliability primary pre-shredders to chop OTR and truck tires to 50-80mm.',
    decisionMakers: [
      { name: 'Anand Mehta', role: 'Principal Sourcing Lead (Geocycle)' },
      { name: 'RK Gupta', role: 'Lead Kiln Operations' }
    ],
    projectSize: '₹3.5 Cr - ₹5.0 Cr primary shredder line',
    competitors: ['Vecoplan (Germany)', 'Lindner (Germany)'],
    recommendedAngle:
      'Emphasize the massive structural strength of the Fornnax SR-200 dual-shaft shredder, capable of continuous 24/7 heavy TDF supply with double-hardened alloy blades.',
    material: 'Nylon and Steel Truck Tires',
    throughput: '15.0 Tons / Hour',
    outputSize: '50-100mm Coarse TDF Chips',
    estimatedBudget: '$550,000'
  },
  {
    id: 'LD-014',
    companyName: 'Green Distillation Technologies / Volco Power',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    region: 'Africa',
    segment: 'Tyre Pyrolysis',
    stage: 'New License / Permit',
    capacityTier: '6–10 TPH',
    dmRole: 'Head of Projects',
    headline: '$50M agreement for up to 5 tyre pyrolysis plants across South Africa — feedstock pre-shredding required',
    source: 'GDT / Volco Power joint announcement',
    date: 'Jun 28, 2026',
    fitScore: 81,
    reasoning: 'Multi-plant rollout needs standardized feedstock shredding ahead of each pyrolysis line',
    snapshot:
      'Australian destructive-distillation technology company partnering with Volco Power on a reported $50M rollout of up to five tyre processing plants across South Africa. Each site needs consistent pre-shredded feedstock preparation.',
    decisionMakers: [
      { name: 'Trevor Bayley', role: 'COO, GDT' },
      { name: 'Sipho Ndlovu', role: 'Projects Director, Volco Power' }
    ],
    projectSize: 'Est. $2.0M - $3.5M across 5 sites (phased)',
    competitors: ['Chinese pyrolysis line bundlers', 'Eldan (Denmark)'],
    recommendedAngle:
      'Frame a fleet deal: one standardized Fornnax pre-shredding spec replicated across all five sites with centralized spares stock in Durban. Volume pricing beats per-site European quotes.',
    material: 'Car & truck tyres (pyrolysis feedstock)',
    throughput: '6.0 Tons / Hour',
    outputSize: '50 - 150 mm shreds',
    estimatedBudget: '$2,400,000'
  },
  {
    id: 'LD-015',
    companyName: 'Kuwait EPA — Salmi Tyre Stockpile Program',
    country: 'Kuwait',
    countryCode: 'KW',
    flag: '🇰🇼',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: "World's largest tyre graveyard cleanup — Salmi relocation & recycling tenders live",
    source: 'Kuwait EPA / CAPT tender bulletin',
    date: 'Jul 06, 2026',
    fitScore: 87,
    reasoning: 'Government-funded stockpile of 40M+ ELTs must be processed locally — multi-line shredding scope',
    snapshot:
      "Kuwait's environmental authority is clearing the Sulaibiya/Salmi tyre stockpiles — among the largest in the world with over 40 million end-of-life tyres — through phased recycling tenders requiring high-throughput local processing capacity.",
    decisionMakers: [
      { name: 'Eng. Abdullah Al-Enezi', role: 'Projects Director' },
      { name: 'Fatima Al-Sabah', role: 'Tender Committee Lead' }
    ],
    projectSize: 'Est. $3.0M - $6.0M multi-line processing scope',
    competitors: ['Eldan (Denmark)', 'Lindner (Germany)', 'Chinese line bundlers'],
    recommendedAngle:
      'Bid-ready spec: dual SR-200HD primaries with desert-hardened cooling and the documented 300 t/day reference plant. Emphasize delivery speed from India and an on-site commissioning team that fits tender timelines.',
    material: 'Aged & sand-contaminated car/truck tyres',
    throughput: '20.0 Tons / Hour (multi-line)',
    outputSize: '50 - 80 mm TDF chips',
    estimatedBudget: '$4,800,000'
  },
  {
    id: 'LD-016',
    companyName: 'Dubai Municipality — Warsan WtE Feedstock',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East (GCC)',
    segment: 'MSW → RDF / WtE',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'RDF feedstock pre-shredding lines tendered for Warsan waste-to-energy complex',
    source: 'Dubai Municipality procurement portal',
    date: 'Jul 02, 2026',
    fitScore: 83,
    reasoning: 'Bulky & commercial waste pre-shredding scope fits SR-200 anti-wrap configuration',
    snapshot:
      "Dubai Municipality operates the Warsan waste-to-energy complex — among the world's largest — and is tendering feedstock preparation upgrades including primary shredding for bulky and commercial waste streams.",
    decisionMakers: [
      { name: 'Eng. Salem Al-Falasi', role: 'Senior Procurement Manager' },
      { name: 'Priya Nair', role: 'Technical Evaluation Lead' }
    ],
    projectSize: 'Est. $2.5M - $4.0M feedstock preparation package',
    competitors: ['Lindner (Germany)', 'UNTHA (Austria)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'Anti-wrap shaft SR-200 configuration for mixed commercial waste; highlight power draw per tonne versus German references and the growing GCC install base.',
    material: 'Bulky & commercial MSW',
    throughput: '15.0 Tons / Hour',
    outputSize: '< 100 mm RDF fraction',
    estimatedBudget: '$3,200,000'
  },
  {
    id: 'LD-017',
    companyName: 'Shawamel Technology Factory',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    region: 'Middle East (GCC)',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'New License / Permit',
    capacityTier: '3–6 TPH',
    dmRole: 'Owner / MD',
    headline: 'New Khobar tyre recycling entrant licensed under Vision 2030 industrial program',
    source: 'Saudi MODON industrial licensing registry',
    date: 'Jun 30, 2026',
    fitScore: 82,
    reasoning: 'Greenfield entrant selecting its first complete line — single-vendor package opportunity',
    snapshot:
      'Khobar-based new entrant licensed to build tyre recycling capacity under the Vision 2030 industrial diversification push. Currently selecting its first complete processing line.',
    decisionMakers: [
      { name: 'Turki Al-Shammari', role: 'Founder & MD' },
      { name: 'Eng. Waleed Hassan', role: 'Project Consultant' }
    ],
    projectSize: 'Est. $900K - $1.6M greenfield line',
    competitors: ['Standard Chinese machinery exporters', 'Eldan (Denmark)'],
    recommendedAngle:
      'Greenfield spec-in: full line (primary + secondary + granulator) as a single-vendor package with financing-friendly phased delivery and Arabic-language operator training.',
    material: 'Car & light truck tyres',
    throughput: '3.5 Tons / Hour',
    outputSize: '< 4.0 mm crumb',
    estimatedBudget: '$1,250,000'
  },
  {
    id: 'LD-018',
    companyName: 'RAK FTZ Pyrolysis Cluster (4 licensed operators)',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East (GCC)',
    segment: 'Tyre Pyrolysis',
    stage: 'New License / Permit',
    capacityTier: '1–3 TPH',
    dmRole: 'Owner / MD',
    headline: 'Four newly licensed tyre pyrolysis operators need compliant feedstock pre-shredding',
    source: 'RAK Free Trade Zone license registry',
    date: 'Jun 26, 2026',
    fitScore: 78,
    reasoning: 'Currently importing pre-shredded feedstock at a premium — shared shredding hub economics',
    snapshot:
      'Cluster of newly licensed pyrolysis operators in the Ras Al Khaimah free zone. Each unit requires consistent 50-150mm shreds and is currently importing pre-shredded feedstock at a premium.',
    decisionMakers: [
      { name: 'Imran Qureshi', role: 'Owner, Unit 2' },
      { name: 'Rakesh Jain', role: 'Owner, Unit 4' }
    ],
    projectSize: 'Est. $350K - $600K per operator (shared line possible)',
    competitors: ['Chinese pyrolysis line bundlers'],
    recommendedAngle:
      'Sell one shared Fornnax primary shredder as a feedstock hub for all four operators — kill their per-tonne import premium with an on-site processing cost model.',
    material: 'Car tyres (pyrolysis feedstock)',
    throughput: '2.0 Tons / Hour',
    outputSize: '50 - 150 mm shreds',
    estimatedBudget: '$480,000'
  },
  {
    id: 'LD-019',
    companyName: 'Saudi Cement Alternative Fuels Program',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    region: 'Middle East (GCC)',
    segment: 'Cement Co-processing',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'Eastern Province cement kilns scaling TDF co-processing — suppliers need shredding capacity',
    source: 'Saudi cement sector co-processing bulletin',
    date: 'Jun 22, 2026',
    fitScore: 79,
    reasoning: 'Kiln TDF contracts pull scrap suppliers into chip production — primary shredder demand',
    snapshot:
      'Eastern Province cement producers are expanding alternative-fuel firing with tyre-derived fuel, pulling their registered scrap suppliers into TDF chip production contracts.',
    decisionMakers: [
      { name: 'Mohammed Al-Zahrani', role: 'Group Sourcing Lead' },
      { name: 'Eng. Tariq Naeem', role: 'Kiln Operations' }
    ],
    projectSize: 'Est. $500K - $900K primary shredder line',
    competitors: ['Vecoplan (Germany)', 'Lindner (Germany)'],
    recommendedAngle:
      '24/7 duty-cycle SR-200 with double-hardened blades; guarantee chip size consistency for kiln feed contracts.',
    material: 'Truck tyres',
    throughput: '12.0 Tons / Hour',
    outputSize: '50 - 100 mm TDF chips',
    estimatedBudget: '$650,000'
  },
  {
    id: 'LD-020',
    companyName: 'Contec S.A.',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    region: 'Europe',
    segment: 'Tyre Pyrolysis',
    stage: 'Expansion Announced',
    capacityTier: '3–6 TPH',
    dmRole: 'Head of Projects',
    headline: 'Szczecin ELT pyrolysis plant scaling — mechanical pre-processing expansion',
    source: 'Weibold Intelligence / company announcements',
    date: 'Jul 07, 2026',
    fitScore: 83,
    reasoning: 'Feedstock uniformity drives recovered carbon black quality — shred consistency is the lever',
    snapshot:
      'Polish cleantech recycler operating a commercial ELT pyrolysis facility in Szczecin, scaling capacity for recovered carbon black and pyrolysis oil offtake deals with European tyre makers.',
    decisionMakers: [
      { name: 'Krzysztof Wróblewski', role: 'CEO' },
      { name: 'Marta Kowalska', role: 'Head of Projects' }
    ],
    projectSize: 'Est. €800K - €1.4M pre-processing line',
    competitors: ['Eldan (Denmark)', 'UNTHA (Austria)'],
    recommendedAngle:
      'Pitch Fornnax shred-consistency data and EU CE documentation with a Mundra material trial — their rCB quality depends on feedstock uniformity.',
    material: 'Car & truck tyres (pyrolysis feedstock)',
    throughput: '4.0 Tons / Hour',
    outputSize: '20 - 50 mm clean shreds',
    estimatedBudget: '$1,150,000'
  },
  {
    id: 'LD-021',
    companyName: 'Life for Tyres Group',
    country: 'Luxembourg',
    countryCode: 'LU',
    flag: '🇱🇺',
    region: 'Europe',
    segment: 'Tyre Pyrolysis',
    stage: 'New License / Permit',
    capacityTier: '6–10 TPH',
    dmRole: 'Owner / MD',
    headline: 'Multi-plant tyre valorization rollout — new European site permits in progress',
    source: 'Trade press / company filings',
    date: 'Jun 20, 2026',
    fitScore: 80,
    reasoning: 'Multi-site rollout needs one standardized mechanical pre-processing spec',
    snapshot:
      'European tyre valorization group with an announced multi-plant rollout (including a $46M US facility), permitting additional European sites requiring full mechanical pre-processing ahead of conversion.',
    decisionMakers: [
      { name: 'Marc Weber', role: 'Group Founder' },
      { name: 'Elena Rossi', role: 'Development Director' }
    ],
    projectSize: 'Est. €1.5M - €2.5M per site',
    competitors: ['Eldan (Denmark)', 'Lindner (Germany)'],
    recommendedAngle:
      'Standardized multi-site spec with volume pricing and one commissioning team across sites.',
    material: 'End-of-life tyres (mixed)',
    throughput: '6.0 Tons / Hour',
    outputSize: '50 - 150 mm shreds',
    estimatedBudget: '$1,900,000'
  },
  {
    id: 'LD-022',
    companyName: 'PreZero International (Schwarz Group)',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    segment: 'MSW → RDF / WtE',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'RDF production line upgrades tendered across German sorting plants',
    source: 'EU TED procurement notices',
    date: 'Jul 04, 2026',
    fitScore: 81,
    reasoning: 'Multi-plant RDF upgrade program — lifecycle cost displacement play vs. German OEMs',
    snapshot:
      'Environmental division of Schwarz Group (Lidl/Kaufland) operating waste sorting and RDF production across Europe; tendering shredding upgrades for commercial waste streams.',
    decisionMakers: [
      { name: 'Stefan Krüger', role: 'Category Buyer, Machinery' },
      { name: 'Dr. Anna Weiss', role: 'Plant Engineering' }
    ],
    projectSize: 'Est. €2.0M - €3.5M multi-plant program',
    competitors: ['Lindner (Germany)', 'UNTHA (Austria)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'Home-market displacement: undercut German OEM lifecycle cost with blade-life data and remote diagnostics; CE compliance plus an EU service partner story is mandatory.',
    material: 'Commercial & industrial waste',
    throughput: '14.0 Tons / Hour',
    outputSize: '< 80 mm RDF',
    estimatedBudget: '$2,700,000'
  },
  {
    id: 'LD-023',
    companyName: 'Geocycle Europe (Holcim)',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    region: 'Europe',
    segment: 'Cement Co-processing',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'Holcim co-processing arm expanding alternative-fuel platforms in Central & Eastern Europe',
    source: 'Holcim sustainability disclosures',
    date: 'Jun 24, 2026',
    fitScore: 80,
    reasoning: 'AFR platform expansion mirrors the Geocycle India supplier playbook',
    snapshot:
      "Holcim's waste-management arm expanding alternative fuel pre-processing platforms across Central & Eastern Europe to lift kiln substitution rates.",
    decisionMakers: [
      { name: 'Tomasz Nowak', role: 'AFR Platform Manager' },
      { name: 'Lucie Novak', role: 'Procurement Lead' }
    ],
    projectSize: 'Est. €1.2M - €2.0M AFR pre-processing',
    competitors: ['Vecoplan (Germany)', 'Lindner (Germany)'],
    recommendedAngle:
      'Reference the UltraTech/Geocycle India supplier playbook and propose an identical spec for the CEE platforms.',
    material: 'Mixed AFR / TDF',
    throughput: '12.0 Tons / Hour',
    outputSize: '< 80 mm kiln feed',
    estimatedBudget: '$1,600,000'
  },
  {
    id: 'LD-024',
    companyName: 'IFAT Munich Booth Leads (14 contacts)',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Operating — Upgrade Candidate',
    capacityTier: '3–6 TPH',
    dmRole: 'Plant Director',
    headline: 'Unworked booth scans from IFAT Munich 2026 — European recyclers evaluating line upgrades',
    source: 'Fornnax booth scan CRM (IFAT 2026)',
    date: 'May 07, 2026',
    fitScore: 78,
    reasoning: 'Warm expo contacts — operating recyclers replacing aging shredders',
    snapshot:
      'Consolidated booth scans from the Fornnax pavilion at IFAT Munich 2026 — mostly operating European tyre and polymer recyclers evaluating replacement of aging shredders.',
    decisionMakers: [
      { name: 'Dr. Hans-Dieter Weber', role: 'Consortium Technical Lead' },
      { name: 'Luc Dubois', role: 'Division Director' }
    ],
    projectSize: 'Est. €400K - €800K per account',
    competitors: ['UNTHA (Austria)', 'Eldan (Denmark)'],
    recommendedAngle:
      'Invite to a factory tour and material trial at Anand HQ; highlight CE compliance and the European spares depot.',
    material: 'OTR & car tyres, cables',
    throughput: '5.0 Tons / Hour',
    outputSize: 'CE-compliant sorted output',
    estimatedBudget: '$680,000'
  },
  {
    id: 'LD-025',
    companyName: 'GRP Ltd (Gujarat Reclaim & Rubber Products)',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '6–10 TPH',
    dmRole: 'Plant Director',
    headline: "India's largest reclaim rubber producer adding crumb capacity across plants",
    source: 'BSE filings & trade press',
    date: 'Jul 08, 2026',
    fitScore: 88,
    reasoning: 'Home-turf flagship account with multi-plant capacity additions underway',
    snapshot:
      'Publicly listed leader in reclaim rubber with multiple Indian plants and global exports; expanding crumb and fine-mesh capacity to feed reclaim and export demand.',
    decisionMakers: [
      { name: 'Rajendra Gandhi', role: 'Managing Director' },
      { name: 'Hardik Shah', role: 'VP Operations' }
    ],
    projectSize: 'Est. ₹8 Cr - ₹14 Cr capacity additions',
    competitors: ['Eldan (Denmark)', 'Local fabricators'],
    recommendedAngle:
      'Home-turf flagship account: Gujarat-to-Gujarat logistics, 48-hour spares, and a reference visit to the Mundra 300 t/day plant.',
    material: 'Truck & OTR tyres',
    throughput: '8.0 Tons / Hour',
    outputSize: '< 0.5 mm fine mesh crumb',
    estimatedBudget: '$1,400,000'
  },
  {
    id: 'LD-026',
    companyName: 'Tinna Rubber & Infrastructure',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '6–10 TPH',
    dmRole: 'Procurement Head',
    headline: 'Largest Indian tyre recycler expanding crumb & steel recovery lines',
    source: 'NSE filings & investor presentation',
    date: 'Jul 06, 2026',
    fitScore: 87,
    reasoning: 'Announced capex for capacity growth — import displacement opportunity',
    snapshot:
      'Listed tyre recycling major processing truck tyres into crumb, reclaim and recovered steel across multiple Indian plants, with announced capex for capacity growth.',
    decisionMakers: [
      { name: 'Bhupinder Sekhri', role: 'Managing Director' },
      { name: 'Amit Sharma', role: 'Head - Procurement' }
    ],
    projectSize: 'Est. ₹10 Cr - ₹16 Cr line additions',
    competitors: ['Eldan (Denmark)', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Displace import dependence: zero customs delay, GST-friendly domestic billing, and faster commissioning than European vendors.',
    material: 'Truck tyres',
    throughput: '8.0 Tons / Hour',
    outputSize: '0.3 - 4.0 mm crumb + 99% clean steel',
    estimatedBudget: '$1,300,000'
  },
  {
    id: 'LD-027',
    companyName: 'Ramky Enviro Engineers',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'MSW → RDF / WtE',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: 'Municipal RDF & WtE feedstock tenders across multiple states',
    source: 'State municipal tender portals',
    date: 'Jul 03, 2026',
    fitScore: 84,
    reasoning: 'Recurring RDF pre-shredding tenders across MSW concessions',
    snapshot:
      "One of India's largest environmental services companies operating MSW concessions and WtE plants; regularly tenders RDF pre-shredding and processing lines.",
    decisionMakers: [
      { name: 'Goutham Reddy', role: 'Executive Director' },
      { name: 'M. Srinivas', role: 'GM Projects' }
    ],
    projectSize: 'Est. ₹6 Cr - ₹10 Cr per concession',
    competitors: ['Lindner (Germany)', 'Local fabricators'],
    recommendedAngle:
      'Tender-spec fit with liquidated-damages-safe delivery timelines and 24/7 service coverage across India.',
    material: 'Municipal Solid Waste (mixed)',
    throughput: '20.0 Tons / Hour',
    outputSize: '< 100 mm RDF',
    estimatedBudget: '$900,000'
  },
  {
    id: 'LD-028',
    companyName: 'Abellon Clean Energy',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'MSW → RDF / WtE',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: 'Gujarat WtE operator expanding RDF processing capacity',
    source: 'Company announcements',
    date: 'Jun 29, 2026',
    fitScore: 83,
    reasoning: 'Same-state buyer — Ahmedabad HQ is 90 minutes from Fornnax works',
    snapshot:
      'Ahmedabad-headquartered clean energy company operating waste-to-energy plants in Gujarat; expanding RDF feedstock preparation for new boiler capacity.',
    decisionMakers: [
      { name: 'Aalap Shah', role: 'Director' },
      { name: 'Kandarp Patel', role: 'Head of Projects' }
    ],
    projectSize: 'Est. ₹5 Cr - ₹8 Cr feedstock lines',
    competitors: ['Lindner (Germany)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'Same-state advantage: Ahmedabad HQ to Fornnax works is a 90-minute drive — a same-day service SLA no European vendor can match.',
    material: 'MSW & agri residue',
    throughput: '15.0 Tons / Hour',
    outputSize: '< 80 mm RDF',
    estimatedBudget: '$750,000'
  },
  {
    id: 'LD-029',
    companyName: 'Kalburgi Cement (Vicat Group)',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Cement Co-processing',
    stage: 'Operating — Upgrade Candidate',
    capacityTier: '10+ TPH',
    dmRole: 'Plant Director',
    headline: 'Installed RDF secondary shredder in 2024 — proven co-processing buyer, primary stage next',
    source: 'Vendor installation records / trade press',
    date: 'Jun 25, 2026',
    fitScore: 80,
    reasoning: 'Already bought once — natural primary-stage upsell to widen acceptable feedstock',
    snapshot:
      'Vicat Group cement plant in Karnataka already co-processing RDF (secondary shredder installed 2024). Natural upsell for primary-stage shredding to widen acceptable feedstock.',
    decisionMakers: [
      { name: 'S. Manjunath', role: 'Plant Director' },
      { name: 'Pierre Laurent', role: 'Group AFR Advisor' }
    ],
    projectSize: 'Est. ₹3 Cr - ₹5 Cr primary stage',
    competitors: ['Maxin India (incumbent secondary)', 'Vecoplan (Germany)'],
    recommendedAngle:
      'They have already bought once — sell the primary stage on feedstock-flexibility economics per tonne of clinker.',
    material: 'Mixed waste / RDF feed',
    throughput: '12.0 Tons / Hour',
    outputSize: '< 200 mm primary fraction',
    estimatedBudget: '$520,000'
  },
  {
    id: 'LD-030',
    companyName: 'EPR-Registered Pyrolysis Upgraders (Gujarat & Maharashtra)',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'India',
    segment: 'Tyre Pyrolysis',
    stage: 'New License / Permit',
    capacityTier: '1–3 TPH',
    dmRole: 'Owner / MD',
    headline: 'CPCB compliance drive pushing pyrolysis units to formal, mechanized feedstock prep',
    source: 'CPCB EPR portal & state PCB notices',
    date: 'Jun 21, 2026',
    fitScore: 79,
    reasoning: 'Compliance requires enclosed mechanized feedstock prep replacing manual cutting',
    snapshot:
      'Wave of pyrolysis operators formalizing under CPCB EPR rules; compliance requires enclosed, mechanized feedstock preparation replacing manual cutting.',
    decisionMakers: [
      { name: 'Nilesh Deshmukh', role: 'Owner-operator' },
      { name: 'Sanjay Mistry', role: 'Owner-operator' }
    ],
    projectSize: 'Est. ₹80L - ₹1.5 Cr per unit',
    competitors: ['Local fabricators'],
    recommendedAngle:
      'Compliance-in-a-box: CPCB-friendly enclosed shredding with a documentation pack; financing via equipment loan partners.',
    material: 'Car tyres',
    throughput: '2.0 Tons / Hour',
    outputSize: '50 - 150 mm shreds',
    estimatedBudget: '$160,000'
  },
  {
    id: 'LD-031',
    companyName: 'Treadlite NZ',
    country: 'New Zealand',
    countryCode: 'NZ',
    flag: '🇳🇿',
    region: 'Australia & NZ',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Operating — Upgrade Candidate',
    capacityTier: '1–3 TPH',
    dmRole: 'Owner / MD',
    headline: 'NZ tyre recycler outgrowing first-generation line under the Tyrewise stewardship scheme',
    source: 'Tyrewise stewardship registry & trade press',
    date: 'Jun 27, 2026',
    fitScore: 81,
    reasoning: 'Stewardship-funded ELT volumes justify a capacity upgrade',
    snapshot:
      "Waikato-based tyre recycler processing a growing share of New Zealand's end-of-life tyres as the Tyrewise stewardship scheme funnels volume to accredited processors.",
    decisionMakers: [
      { name: 'Brad Barton', role: 'Founder & MD' },
      { name: 'Sarah Cole', role: 'Operations Manager' }
    ],
    projectSize: 'Est. NZ$800K - NZ$1.4M line upgrade',
    competitors: ['Eldan (Denmark)', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Stewardship-funded volumes justify capacity: model the payback using Tyrewise per-tyre fees.',
    material: 'Car & 4WD tyres',
    throughput: '2.5 Tons / Hour',
    outputSize: '< 4.0 mm crumb',
    estimatedBudget: '$700,000'
  },
  {
    id: 'LD-032',
    companyName: 'ResourceCo Energy (Adelaide)',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'Australia & NZ',
    segment: 'Cement Co-processing',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Head of Projects',
    headline: 'Expanding processed engineered fuel (PEF) supply to cement kilns',
    source: 'Company announcements & Cement Industry Federation',
    date: 'Jul 01, 2026',
    fitScore: 84,
    reasoning: 'PEF capacity expansion for cement kilns in Australia and Southeast Asia',
    snapshot:
      'Adelaide-based resource recovery major producing processed engineered fuel for cement kilns in Australia and Southeast Asia; expanding PEF capacity.',
    decisionMakers: [
      { name: 'Ben Sawley', role: 'CEO, ResourceCo Energy' },
      { name: 'Jim Fairweather', role: 'Group Projects' }
    ],
    projectSize: 'Est. A$2.0M - A$3.5M PEF line expansion',
    competitors: ['Lindner (Germany)', 'UNTHA (Austria)'],
    recommendedAngle:
      'High-ambient duty cooling plus throughput guarantees; use the RPM Automotive relationship as the ANZ door-opener.',
    material: 'C&I waste for PEF',
    throughput: '15.0 Tons / Hour',
    outputSize: '< 50 mm PEF',
    estimatedBudget: '$2,200,000'
  },
  {
    id: 'LD-033',
    companyName: 'Mathe Group',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    region: 'Africa',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Expansion Announced',
    capacityTier: '1–3 TPH',
    dmRole: 'Owner / MD',
    headline: 'KZN truck-tyre crumb producer expanding as waste-tyre flows formalize',
    source: 'South African trade press',
    date: 'Jun 23, 2026',
    fitScore: 83,
    reasoning: 'Road-crumb demand growing; total landed cost beats European lines',
    snapshot:
      'Hammarsdale (KwaZulu-Natal) recycler converting truck tyres into rubber crumb for roads and industry; expanding processing capacity as waste-tyre flows formalize.',
    decisionMakers: [
      { name: 'Dr. Mehran Zarrebini', role: 'CEO' },
      { name: 'Vusi Dlamini', role: 'Plant Manager' }
    ],
    projectSize: 'Est. $600K - $1.0M crumb expansion',
    competitors: ['Eldan (Denmark)', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Road-crumb specification consistency plus total landed cost vs. European lines; offer a Durban port logistics plan.',
    material: 'Truck tyres',
    throughput: '2.5 Tons / Hour',
    outputSize: '0.5 - 2.0 mm crumb',
    estimatedBudget: '$780,000'
  },
  {
    id: 'LD-034',
    companyName: 'SA Waste Management Bureau — Tyre Stockpile Tenders',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    region: 'Africa',
    segment: 'Tyre Recycling (TDF / Crumb)',
    stage: 'Live Tender',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'Government tenders to process national waste-tyre stockpiles',
    source: 'SA government eTenders portal',
    date: 'Jun 19, 2026',
    fitScore: 80,
    reasoning: 'Tender winners must buy processing capacity — partner with bidders pre-award',
    snapshot:
      "The Waste Management Bureau manages South Africa's waste tyre plan and periodically tenders processing of accumulated stockpiles to accredited recyclers — driving equipment purchases by bid winners.",
    decisionMakers: [
      { name: 'Thabo Mokoena', role: 'Bureau Procurement' },
      { name: 'Accredited bidders', role: 'Various processors' }
    ],
    projectSize: 'Est. $1.5M - $3.0M per awarded processor',
    competitors: ['Eldan (Denmark)', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Partner with bidders pre-award: attach a Fornnax spec and delivery guarantee to strengthen their tender submissions.',
    material: 'Stockpiled mixed tyres',
    throughput: '10.0 Tons / Hour',
    outputSize: '50 - 80 mm TDF',
    estimatedBudget: '$1,700,000'
  },
  {
    id: 'LD-035',
    companyName: 'Geocycle Nigeria (Lafarge Africa)',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    region: 'Africa',
    segment: 'Cement Co-processing',
    stage: 'Expansion Announced',
    capacityTier: '10+ TPH',
    dmRole: 'Procurement Head',
    headline: 'Lafarge Africa scaling co-processing platforms — AFR pre-processing investment',
    source: 'Lafarge Africa sustainability report',
    date: 'Jun 17, 2026',
    fitScore: 78,
    reasoning: 'AFR platform expansion needs tyre & industrial waste shredding capacity',
    snapshot:
      "Lafarge Africa's Geocycle platform is expanding alternative-fuel co-processing at Nigerian cement plants, requiring shredding capacity for tyres and industrial waste.",
    decisionMakers: [
      { name: 'Chinedu Okafor', role: 'Geocycle Lead' },
      { name: 'Amaka Eze', role: 'Procurement Manager' }
    ],
    projectSize: 'Est. $800K - $1.5M AFR platform',
    competitors: ['Vecoplan (Germany)', 'Standard Chinese machinery exporters'],
    recommendedAngle:
      'Africa-ready: robust low-maintenance design, generator-friendly power draw, and a Lagos spares stocking proposal.',
    material: 'Tyres & industrial waste',
    throughput: '10.0 Tons / Hour',
    outputSize: '< 80 mm kiln feed',
    estimatedBudget: '$1,050,000'
  }
];

// ---------- Helpers ----------

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

interface FilterGroupProps<T extends string> {
  title: string;
  icon: ReactNode;
  options: T[];
  selected: T[];
  count: (option: T) => number;
  onToggle: (option: T) => void;
  disabled: boolean;
}

function FilterGroup<T extends string>({
  title,
  icon,
  options,
  selected,
  count,
  onToggle,
  disabled
}: FilterGroupProps<T>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {options.map(option => {
          const isChecked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(option)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[6px] border text-left transition-all duration-150 disabled:opacity-50 ${
                isChecked
                  ? 'bg-fornnax-red/10 border-fornnax-red/40'
                  : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'
              }`}
            >
              <span className="flex items-center space-x-2 min-w-0">
                <span
                  className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ${
                    isChecked ? 'bg-fornnax-red border-fornnax-red' : 'border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                <span className={`text-[11px] truncate ${isChecked ? 'text-white font-medium' : 'text-zinc-400'}`}>
                  {option}
                </span>
              </span>
              <span className="text-[9px] font-mono text-zinc-600 shrink-0 ml-2">{count(option)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Main component ----------

export default function LeadFinderView({ onImportLead, setActiveTab }: LeadFinderViewProps) {
  // Filters (Apollo-style: checkboxes, AND across groups, OR within a group)
  const [selRegions, setSelRegions] = useState<Region[]>(['Middle East (GCC)']);
  const [selSegments, setSelSegments] = useState<Segment[]>(['Tyre Recycling (TDF / Crumb)']);
  const [selStages, setSelStages] = useState<Stage[]>([]);
  const [selCapacities, setSelCapacities] = useState<CapacityTier[]>([]);
  const [selRoles, setSelRoles] = useState<DmRole[]>([]);
  const [minFit, setMinFit] = useState<number>(0);

  // Scrape lifecycle
  const [phase, setPhase] = useState<'idle' | 'scraping' | 'done'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<LeadRecord[]>([]);
  const [revealed, setRevealed] = useState<number>(0);

  // Detail drawer + pipeline
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [wasRelaxed, setWasRelaxed] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => window.clearTimeout(t));
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  const regionOk = (rec: LeadRecord) => selRegions.length === 0 || selRegions.includes(rec.region);
  const segmentOk = (rec: LeadRecord) => selSegments.length === 0 || selSegments.includes(rec.segment);
  const stageOk = (rec: LeadRecord) => selStages.length === 0 || selStages.includes(rec.stage);
  const capacityOk = (rec: LeadRecord) => selCapacities.length === 0 || selCapacities.includes(rec.capacityTier);
  const roleOk = (rec: LeadRecord) => selRoles.length === 0 || selRoles.includes(rec.dmRole);
  const fitOk = (rec: LeadRecord) => rec.fitScore >= minFit;

  // Apollo-style matching: exact matches first. If no company matches every
  // filter, progressively relax the softest criteria (capacity/role/fit, then
  // stage, then segment) so the engine never returns an empty result set.
  const computeMatches = (): { records: LeadRecord[]; relaxed: boolean } => {
    const exact = LEAD_DB.filter(
      r => regionOk(r) && segmentOk(r) && stageOk(r) && capacityOk(r) && roleOk(r) && fitOk(r)
    );
    if (exact.length > 0) return { records: exact, relaxed: false };
    const tier2 = LEAD_DB.filter(r => regionOk(r) && segmentOk(r) && stageOk(r));
    if (tier2.length > 0) return { records: tier2, relaxed: true };
    const tier3 = LEAD_DB.filter(r => regionOk(r) && segmentOk(r));
    if (tier3.length > 0) return { records: tier3, relaxed: true };
    const tier4 = LEAD_DB.filter(r => regionOk(r));
    if (tier4.length > 0) return { records: tier4, relaxed: true };
    return { records: LEAD_DB, relaxed: true };
  };

  const liveMatchCount = computeMatches().records.length;
  const isScraping = phase === 'scraping';

  const resetFilters = () => {
    if (isScraping) return;
    setSelRegions([]);
    setSelSegments([]);
    setSelStages([]);
    setSelCapacities([]);
    setSelRoles([]);
    setMinFit(0);
  };

  const handleFindLeads = () => {
    if (isScraping) return;

    const { records, relaxed } = computeMatches();
    const matched = [...records].sort((a, b) => b.fitScore - a.fitScore);
    setWasRelaxed(relaxed);
    const regionLabel = selRegions.length > 0 ? selRegions.join(' + ') : 'All regions';
    const segmentLabel = selSegments.length > 0 ? selSegments.join(' + ') : 'All segments';

    timersRef.current.forEach(t => window.clearTimeout(t));
    timersRef.current = [];

    setPhase('scraping');
    setLogs([]);
    setProgress(0);
    setResults([]);
    setRevealed(0);
    setSelectedLeadId(null);
    setKeyword('');
    setToast(null);

    const scanLines: string[] = [
      `[ENGINE] Lead scrape initialized — ${regionLabel} · ${segmentLabel}`,
      `[LINKEDIN] Crawling company registry & decision-maker profiles… ${matched.length * 4 + 3} profiles matched`,
      `[TENDERS] Etimad (KSA) · UAE municipal portals · EU TED… ${Math.max(matched.length - 2, 1)} live signals parsed`,
      `[EPR] CPCB India · Tyre Stewardship Australia registries… ${matched.length + 2} registrants pulled`,
      `[MEDIA] Tyre & Rubber Recycling · Weibold · RecyclingInside… ${matched.length * 2 + 1} expansion mentions`,
      `[CUSTOMS] Import manifests — shredder & granulator HS codes… ${Math.max(matched.length - 1, 1)} buyer signals`,
      `[ICP MODEL] Scoring ${LEAD_DB.length} companies against Fornnax ICP… ${matched.length} QUALIFIED ✓`
    ];

    scanLines.forEach((line, index) => {
      schedule(() => {
        setLogs(prev => [...prev, line]);
        setProgress(Math.round(((index + 1) / scanLines.length) * 100));
      }, 420 * (index + 1));
    });

    schedule(() => {
      setPhase('done');
      setResults(matched);
      if (matched.length > 0) {
        setToast(`${matched.length} qualified leads scraped for ${regionLabel}.`);
        schedule(() => setToast(null), 4000);
      }
      matched.forEach((_, index) => {
        schedule(() => setRevealed(prev => prev + 1), 130 * (index + 1));
      });
    }, 420 * (scanLines.length + 1) + 300);
  };

  const buildLead = (rec: LeadRecord): Lead => ({
    id: rec.id,
    companyName: rec.companyName,
    country: rec.country,
    type: rec.stage,
    source: rec.source,
    contactEmail: `${rec.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@export-dept.com`,
    phone: '+966 11 ' + Math.floor(1000000 + Math.random() * 9000000),
    status: 'new',
    confidenceScore: rec.fitScore
  });

  const handleImportToPipeline = (rec: LeadRecord) => {
    onImportLead(buildLead(rec));
    if (!importedIds.includes(rec.id)) {
      setImportedIds(prev => [...prev, rec.id]);
    }
    setToast(`Imported ${rec.companyName} as active CRM enquiry.`);
    schedule(() => setToast(null), 3000);
  };

  const handleDraftOutreach = (rec: LeadRecord) => {
    onImportLead(buildLead(rec));
    if (!importedIds.includes(rec.id)) {
      setImportedIds(prev => [...prev, rec.id]);
    }
    setToast(`Successfully imported '${rec.companyName}' to pipeline.`);
    if (setActiveTab) {
      schedule(() => {
        setToast(null);
        setActiveTab('outreach');
      }, 1000);
    }
  };

  const keywordLower = keyword.toLowerCase();
  const visibleResults = results
    .filter(
      rec =>
        keywordLower === '' ||
        rec.companyName.toLowerCase().includes(keywordLower) ||
        rec.country.toLowerCase().includes(keywordLower) ||
        rec.headline.toLowerCase().includes(keywordLower) ||
        rec.segment.toLowerCase().includes(keywordLower)
    )
    .slice(0, revealed);

  const selectedLead = results.find(rec => rec.id === selectedLeadId) || null;

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes lfRowIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lfDrawerIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes lfBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="bg-fornnax-green/15 border border-fornnax-green/30 text-fornnax-green text-xs font-mono py-2.5 px-4 rounded-[6px] flex items-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase flex items-center space-x-2">
            <Target className="w-6 h-6 text-fornnax-red" />
            <span>AI Sales Engineer & Lead Finder</span>
          </h2>
          <p className="text-xs text-fornnax-text-secondary mt-1">
            Select your target market, hit Find Leads, and scrape qualified machinery buyers matched to Fornnax's ICP.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
          <Database className="w-3.5 h-3.5 text-fornnax-red" />
          <span>Sources: LinkedIn · Tenders · EPR · Customs · Trade Media</span>
        </div>
      </div>

      {/* Workspace: Filters (left) + Results (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ---- Filter sidebar ---- */}
        <div className={`${showMobileFilters ? 'fixed inset-0 z-50 bg-fornnax-bg overflow-y-auto p-4 flex flex-col' : 'hidden lg:flex lg:col-span-3 bg-fornnax-card border border-fornnax-border rounded-[10px] overflow-hidden flex-col'}`}>
          {/* Mobile Sticky Header */}
          <div className="sticky top-0 bg-fornnax-bg border-b border-fornnax-border pb-3 mb-3 flex items-center justify-between z-10 lg:hidden shrink-0">
            <span className="text-xs font-mono font-black text-white uppercase tracking-widest">LEAD FILTERS</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetFilters}
                disabled={isScraping}
                className="flex items-center space-x-1 text-[9px] font-mono text-zinc-500 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-white/5 rounded-md text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-fornnax-border flex items-center justify-between lg:flex hidden">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-fornnax-red" />
              <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Lead Filters</span>
            </div>
            <button
              onClick={resetFilters}
              disabled={isScraping}
              className="flex items-center space-x-1 text-[9px] font-mono text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[560px] overflow-y-auto">
            <FilterGroup
              title="Region"
              icon={<MapPin className="w-3 h-3 text-fornnax-red" />}
              options={REGIONS}
              selected={selRegions}
              count={option => LEAD_DB.filter(rec => rec.region === option).length}
              onToggle={option => setSelRegions(prev => toggleValue(prev, option))}
              disabled={isScraping}
            />
            <FilterGroup
              title="Industry Segment"
              icon={<Factory className="w-3 h-3 text-fornnax-red" />}
              options={SEGMENTS}
              selected={selSegments}
              count={option => LEAD_DB.filter(rec => rec.segment === option).length}
              onToggle={option => setSelSegments(prev => toggleValue(prev, option))}
              disabled={isScraping}
            />
            <FilterGroup
              title="Buying Signal"
              icon={<Zap className="w-3 h-3 text-fornnax-red" />}
              options={STAGES}
              selected={selStages}
              count={option => LEAD_DB.filter(rec => rec.stage === option).length}
              onToggle={option => setSelStages(prev => toggleValue(prev, option))}
              disabled={isScraping}
            />
            <FilterGroup
              title="Capacity Requirement"
              icon={<Gauge className="w-3 h-3 text-fornnax-red" />}
              options={CAPACITIES}
              selected={selCapacities}
              count={option => LEAD_DB.filter(rec => rec.capacityTier === option).length}
              onToggle={option => setSelCapacities(prev => toggleValue(prev, option))}
              disabled={isScraping}
            />
            <FilterGroup
              title="Decision Maker"
              icon={<UserRound className="w-3 h-3 text-fornnax-red" />}
              options={DM_ROLES}
              selected={selRoles}
              count={option => LEAD_DB.filter(rec => rec.dmRole === option).length}
              onToggle={option => setSelRoles(prev => toggleValue(prev, option))}
              disabled={isScraping}
            />

            {/* Min fit score */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                <TrendingUp className="w-3 h-3 text-fornnax-red" />
                <span>Min. ICP Fit Score</span>
              </div>
              <select
                value={minFit}
                onChange={e => setMinFit(Number(e.target.value))}
                disabled={isScraping}
                className="w-full bg-fornnax-bg border border-fornnax-border text-zinc-300 text-[11px] rounded-[6px] px-2.5 py-2 focus:outline-none focus:border-fornnax-red disabled:opacity-50"
              >
                <option value={0}>Any score</option>
                <option value={80}>80+</option>
                <option value={85}>85+</option>
                <option value={90}>90+</option>
              </select>
            </div>
          </div>

          {/* Live match preview + CTA */}
          <div className="p-4 border-t border-fornnax-border bg-zinc-950/60 space-y-3 sticky bottom-0 z-10 lg:relative">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-500 uppercase tracking-wider">Matching companies</span>
              <span className="text-fornnax-green font-bold">{liveMatchCount}</span>
            </div>
            <button
              onClick={() => {
                handleFindLeads();
                setShowMobileFilters(false);
              }}
              disabled={isScraping}
              className="w-full py-2.5 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[8px] text-xs font-bold transition-all duration-150 shadow-[0_0_15px_rgba(226,58,46,0.25)] flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scraping sources…</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Leads ({liveMatchCount})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ---- Results area ---- */}
        <div className="lg:col-span-9 space-y-4 w-full">
          {/* Mobile-only Filter Trigger */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex lg:hidden w-full items-center justify-between p-3.5 bg-fornnax-card border border-fornnax-border rounded-[10px] text-xs font-mono font-bold text-white hover:border-fornnax-red transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-fornnax-red" />
              <span>Filters</span>
            </div>
            <span className="text-fornnax-green bg-fornnax-green/15 px-2 py-0.5 rounded-[4px] text-[10px]">
              {liveMatchCount} matching
            </span>
          </button>
          {/* Idle empty state */}
          {phase === 'idle' && (
            <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] py-20 px-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                <Radar className="w-7 h-7 text-fornnax-red" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wide">No leads scraped yet</h3>
                <p className="text-xs text-fornnax-text-secondary mt-1.5 max-w-md leading-relaxed">
                  Set your target filters on the left and hit <span className="text-white font-semibold">Find Leads</span>. The
                  engine scrapes tender portals, EPR registries, LinkedIn and customs data — then scores every company against
                  Fornnax's ideal customer profile.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['Etimad (KSA)', 'CPCB EPR Portal', 'EU TED Tenders', 'LinkedIn', 'Customs Manifests', 'Weibold', 'Tyre & Rubber Recycling'].map(sourceName => (
                  <span
                    key={sourceName}
                    className="text-[9px] font-mono text-zinc-500 border border-zinc-800 bg-zinc-950/60 rounded px-2 py-0.5"
                  >
                    {sourceName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scraping console */}
          {phase === 'scraping' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-[10px] p-5 font-mono text-xs shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Terminal className="w-4 h-4 text-fornnax-red animate-pulse" />
                  <span className="text-[11px] font-black tracking-wider text-white uppercase">Live Lead Scraper</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold">{progress}%</span>
              </div>
              <div className="space-y-1.5 min-h-[120px]">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                    <span className="text-fornnax-red shrink-0">▸</span>
                    <span className={log.indexOf('QUALIFIED') !== -1 ? 'text-fornnax-green font-bold' : 'text-zinc-300'}>{log}</span>
                  </div>
                ))}
                <span
                  className="inline-block w-2 h-3.5 bg-fornnax-red align-middle"
                  style={{ animation: 'lfBlink 0.8s step-start infinite' }}
                />
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-fornnax-red h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {phase === 'done' && (
            <>
              {/* Summary strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <Check className="w-3.5 h-3.5 text-fornnax-green" />
                  <span className="text-fornnax-green font-bold">SCRAPE COMPLETE</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">6 sources scanned</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-white font-bold">{results.length} qualified leads</span>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Refine results…"
                    className="w-full bg-fornnax-bg border border-fornnax-border rounded-[8px] pl-9 pr-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-fornnax-red transition-all"
                  />
                </div>
              </div>

              {wasRelaxed && results.length > 0 && (
                <div className="bg-fornnax-amber/10 border border-fornnax-amber/30 text-fornnax-amber text-[10px] font-mono py-2 px-3 rounded-[6px] flex items-center flex-wrap gap-x-2">
                  <span className="font-bold uppercase tracking-wider">Closest matches</span>
                  <span className="text-fornnax-amber/80">
                    No companies matched every selected filter exactly — showing the {results.length} nearest ICP matches.
                  </span>
                </div>
              )}

              {results.length === 0 ? (
                <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] py-16 text-center space-y-2">
                  <p className="text-xs font-mono text-zinc-400">0 companies matched your filters.</p>
                  <p className="text-[10px] font-mono text-zinc-600">Widen your criteria and run the scrape again.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <div className="bg-fornnax-card border border-fornnax-border rounded-[10px] overflow-hidden min-w-[720px]">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-fornnax-border bg-zinc-950/60 text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                      <div className="col-span-4">Company</div>
                      <div className="col-span-2">Segment</div>
                      <div className="col-span-3">Buying Signal</div>
                      <div className="col-span-1 text-right">Fit</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {visibleResults.map(rec => {
                      const isImported = importedIds.includes(rec.id);
                      return (
                        <div
                          key={rec.id}
                          onClick={() => setSelectedLeadId(rec.id)}
                          className="grid grid-cols-12 gap-3 items-center px-4 py-3.5 border-b border-zinc-800/60 last:border-b-0 hover:bg-zinc-900/50 cursor-pointer transition-colors duration-150 group"
                          style={{ animation: 'lfRowIn 0.3s ease both' }}
                        >
                          {/* Company */}
                          <div className="col-span-4 min-w-0">
                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="text-sm shrink-0">{rec.flag}</span>
                              <span className="text-xs font-semibold text-white truncate group-hover:text-fornnax-red transition-colors">
                                {rec.companyName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 mt-1 ml-6">
                              <span className="text-[9px] font-mono text-zinc-500">{rec.country}</span>
                              <span className="text-[9px] font-mono text-zinc-600">· {rec.dmRole}</span>
                              {rec.existingCustomer && (
                                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border bg-fornnax-green/10 text-fornnax-green border-fornnax-green/20 uppercase tracking-wider">
                                  Fornnax Customer
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Segment */}
                          <div className="col-span-2">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-zinc-900 text-zinc-300 border-zinc-700/60 uppercase tracking-wide inline-block">
                              {rec.segment}
                            </span>
                          </div>

                          {/* Signal */}
                          <div className="col-span-3 min-w-0">
                            <span className="text-[9px] font-mono font-bold text-fornnax-amber uppercase tracking-wider block">{rec.stage}</span>
                            <span className="text-[10px] text-zinc-400 truncate block mt-0.5">{rec.headline}</span>
                          </div>

                          {/* Fit */}
                          <div className="col-span-1 text-right">
                            <span className="text-xs font-mono font-bold text-fornnax-green">{rec.fitScore}</span>
                            <div className="w-full bg-zinc-800 rounded-full h-0.5 mt-1">
                              <div className="bg-fornnax-green h-full rounded-full" style={{ width: `${rec.fitScore}%` }} />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 flex justify-end items-center space-x-1.5">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedLeadId(rec.id);
                              }}
                              className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] font-mono text-zinc-300 hover:text-white transition-all"
                            >
                              Research
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDraftOutreach(rec);
                              }}
                              className="p-1 px-2.5 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded text-[9px] font-mono font-bold transition-all flex items-center space-x-1"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{isImported ? 'Drafted' : 'Draft Outreach'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---- Intel Profiler drawer ---- */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedLeadId(null)} />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full lg:max-w-[620px] bg-[#11141A] border-l-2 border-fornnax-border shadow-2xl overflow-y-auto flex flex-col"
            style={{ animation: 'lfDrawerIn 0.25s ease both' }}
          >
            <div className="h-1.5 bg-gradient-to-r from-fornnax-red via-fornnax-amber to-fornnax-green shrink-0" />

            {/* Drawer header */}
            <div className="p-6 border-b border-fornnax-border bg-gradient-to-r from-zinc-900/60 to-transparent flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/80 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                    Intel Profiler
                  </span>
                  <span className="text-xs shrink-0">{selectedLead.flag}</span>
                  <span className="text-[10px] font-mono text-zinc-500">Lead: {selectedLead.id}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mt-1.5 uppercase tracking-wide">
                  {selectedLead.companyName}
                </h3>
                <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] font-mono text-zinc-500">
                  <Globe className="w-3.5 h-3.5 text-zinc-600" />
                  <span>
                    {selectedLead.country} · {selectedLead.segment} · {selectedLead.capacityTier}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <div className="flex items-center space-x-1 bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 px-3">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black mr-1">Fit</span>
                  <span className="text-lg font-mono font-black text-fornnax-green">{selectedLead.fitScore}%</span>
                </div>
                <button onClick={() => setSelectedLeadId(null)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer body */}
            <div className="p-6 space-y-5 flex-1">
              {/* Signal */}
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-[6px]">
                <span className="text-[9px] font-mono font-bold text-fornnax-amber uppercase tracking-wider block mb-1">
                  {selectedLead.stage} · {selectedLead.date} · {selectedLead.source}
                </span>
                <span className="text-xs text-white font-medium">{selectedLead.headline}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                  [A] Target Company Profile
                </span>
                <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs leading-relaxed text-zinc-300">
                  {selectedLead.snapshot}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                  [B] Decision Makers
                </span>
                <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] space-y-2 text-xs">
                  {selectedLead.decisionMakers.map((dm, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-white font-medium flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-fornnax-red" />
                        <span>{dm.name}</span>
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px]">{dm.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                  [C] Estimated Machinery Procurement
                </span>
                <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs text-fornnax-green font-mono font-bold flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{selectedLead.projectSize}</span>
                </div>
              </div>

              {/* Spec strip */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Material', value: selectedLead.material },
                  { label: 'Throughput', value: selectedLead.throughput },
                  { label: 'Output Size', value: selectedLead.outputSize },
                  { label: 'Est. Budget', value: selectedLead.estimatedBudget }
                ].map(item => (
                  <div key={item.label} className="p-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px]">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">{item.label}</span>
                    <span className="text-[11px] font-mono text-white mt-0.5 block">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                  [D] Competitors Likely Bidding
                </span>
                <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-[6px] text-xs space-y-1.5 font-mono">
                  {selectedLead.competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center space-x-2 text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-fornnax-amber rounded-full" />
                      <span>{competitor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-fornnax-red font-bold uppercase tracking-wider block">
                  [E] Strategic Fornnax Sales Angle
                </span>
                <div className="p-3.5 bg-zinc-900/70 border border-fornnax-red/20 rounded-[6px] text-xs leading-relaxed text-white font-medium shadow-[0_0_12px_rgba(226,58,46,0.03)]">
                  {selectedLead.recommendedAngle}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="p-4 bg-zinc-950 border-t border-fornnax-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="text-[10px] font-mono text-zinc-500">Push this lead into your active pipeline.</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleImportToPipeline(selectedLead)}
                  className="p-2 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-[8px] text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                >
                  {importedIds.includes(selectedLead.id) ? 'Imported ✓' : 'Import to CRM'}
                </button>
                <button
                  onClick={() => handleDraftOutreach(selectedLead)}
                  className="p-2 px-5 bg-fornnax-red hover:bg-fornnax-red/90 text-white rounded-[8px] text-xs font-bold transition-all shadow-[0_0_15px_rgba(226,58,46,0.25)] flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Outreach Now</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
