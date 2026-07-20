import { Enquiry, Lead, OrchestrationAgent } from './types';

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "FNX-EQ-2026-001",
    companyName: "Al Rashid Recycling LLC",
    country: "Saudi Arabia",
    countryCode: "SA",
    material: "Scrap Truck and Car Tires",
    throughput: "5.0 Tons / Hour",
    outputSize: "< 4.0 mm Rubber Crumb (Wire free)",
    receivedDate: "2026-07-19 02:14:00",
    score: 87,
    status: "brief_ready",
    contactPerson: "Eng. Abdulaziz Al-Subaie",
    emailSubject: "Tyre recycling plant, Dammam",
    emailBody: `Hello Fornnax Team,

We are Al Rashid Recycling LLC in Dammam, Saudi Arabia. We are setting up a comprehensive mechanical recycling plant for scrap car and truck tires to comply with the new EPR (Extended Producer Responsibility) frameworks in KSA.

Key Sizing Requirements:
- Feedstock capacity: Stable 5 Tons/Hour.
- Desired output: < 4.0 mm rubber crumb, 99.9% wire and fiber-free.
- Power supply: 3-Phase, 380V, 60Hz.

Please share technical drawings and a quotation for a primary dual-shaft shredder (like your SR-200) coupled with a secondary high-speed granulator. We have a letter of intent from the municipality and are ready to finalize offtake contracts.

Best,
Eng. Abdulaziz Al-Subaie
Project Director, Al Rashid Recycling LLC`,
    notes: "EPR-driven tyre recycler. Government subsidy approved. High priority. Recommended model: Fornnax Primary Shredder SR-200 and Granulator R-2000. Voltage requires 380V/60Hz panel design.",
    specs: {
      inputMaterial: "Scrap Truck & Car Tires (up to 1200mm)",
      targetOutputSize: "< 4.0 mm wire-free rubber crumb",
      capacity: "5.0 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "$380,000"
    },
    channel: "whatsapp",
    specCompleteness: 100
  },
  {
    id: "FNX-EQ-2026-002",
    companyName: "EcoKreis GmbH",
    country: "Germany",
    countryCode: "DE",
    material: "Car & OTR Scrap Tires",
    throughput: "3.5 Tons / Hour",
    outputSize: "10-20mm TDF + < 4.0mm Rubber Crumb",
    receivedDate: "2026-07-19 03:41:00",
    score: 91,
    status: "brief_ready",
    contactPerson: "Dr. Hans-Dieter Weber",
    emailSubject: "SR-200HD + granulator, TDF→crumb",
    emailBody: `Sehr geehrte Damen und Herren,

We are setting up a tire recycling extension in Cologne, Germany, focusing on both Tire-Derived Fuel (TDF) for cement mills and fine rubber crumb production.

We require:
- A high-torque primary pre-shredder capable of handling large OTR tires (up to 1500mm diameter).
- Coarse sizing down to 50-80mm TDF chips.
- Secondary granulator line to reduce a portion of the stream down to < 4.0mm rubber granules with 99.9% wire extraction.
- Throughput rate: 3.5 metric tons per hour.
- Hard Requirement: Full European CE Certification.

We are interested in your SR-200HD primary shredder with double-hardened blades. Kindly provide an export proposal including shipping estimates to the Port of Hamburg.

Mit freundlichen Grüßen,
Dr. Hans-Dieter Weber
EcoKreis GmbH`,
    notes: "Pyrolysis feed & TDF supplier. German standard CE electrical cabinets required. Double-hardened wear plates required on blades. High confidence score.",
    specs: {
      inputMaterial: "Car, Truck, & OTR Tires (up to 1500mm)",
      targetOutputSize: "50-80mm TDF chips and < 4.0mm fine rubber granules",
      capacity: "3.5 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "€320,000"
    },
    channel: "email",
    specCompleteness: 100
  },
  {
    id: "FNX-EQ-2026-003",
    companyName: "GreenLoop Vietnam",
    country: "Vietnam",
    countryCode: "VN",
    material: "Municipal Solid Waste (MSW)",
    throughput: "12.0 Tons / Hour",
    outputSize: "< 80.0 mm RDF coarse fraction",
    receivedDate: "2026-07-19 09:12:00",
    score: 64,
    status: "collecting",
    contactPerson: "Nguyen Minh Tri",
    emailSubject: "MSW to RDF line",
    emailBody: `Hi Fornnax,

We are developing a new waste-to-energy project near Da Nang, Vietnam. We need a primary shredder to handle municipal solid waste, wood pallets, cardboard, and light industrial waste.

Target is to feed an RDF (Refuse-Derived Fuel) boiler. 
- Input Capacity: Roughly 12 Tons/Hour.
- Target Output Size: Approximately < 80mm.
- Looking for a stationary unit with automatic reverse to handle non-shreddable impurities.

Please send us pricing and catalog for your heavy-duty dual-shaft shredder series.

Thanks,
Nguyen Minh Tri
Operations Manager | GreenLoop Vietnam`,
    notes: "MSW/RDF Contractor. Needs a robust dual-shaft pre-shredder. Auto-reverse control panel logic is critical. Needs further sizing specs verification. Recommended: Fornnax SR-200 dual shaft.",
    specs: {
      inputMaterial: "Municipal Solid Waste, Wood, Pallets",
      targetOutputSize: "< 80.0 mm RDF coarse fraction",
      capacity: "12.0 Tons / Hour",
      separationRequired: false,
      estimatedBudget: "$250,000"
    },
    channel: "web",
    specCompleteness: 60
  },
  {
    id: "FNX-EQ-2026-004",
    companyName: "Rudra Trading Corp (reseller pattern)",
    country: "India",
    countryCode: "IN",
    material: "All Machinery",
    throughput: "Not Specified",
    outputSize: "Not Specified",
    receivedDate: "2026-07-19 11:47:00",
    score: 18,
    status: "auto_answered",
    contactPerson: "R. K. Sharma",
    emailSubject: "price list all machines",
    emailBody: `Sir,

Please send price list and catalog of all shredding machines, tyre recyclers, and copper wire separators that you make. We are brokers and have buyers looking for cheap machinery.

Send immediately on WhatsApp.

Thanks,
Rudra Trading Corp`,
    notes: "Reseller/Broker pattern flagged. Low priority rating of 18. Auto-reply triggered with generic export PDF catalog. Moving to archived/low-priority queue.",
    specs: {
      inputMaterial: "Various (unspecified)",
      targetOutputSize: "Unspecified",
      capacity: "Unspecified",
      separationRequired: false,
      estimatedBudget: "Low/Unspecified"
    },
    channel: "indiamart",
    specCompleteness: 20
  },
  {
    id: "FNX-EQ-2026-005",
    companyName: "Sahara Tyre Pyrolysis Co.",
    country: "Egypt",
    countryCode: "EG",
    material: "Scrap Truck Tires",
    throughput: "4.0 Tons / Hour",
    outputSize: "50mm Tire Chips (Steel Left In)",
    receivedDate: "2026-07-19 05:22:00",
    score: 82,
    status: "brief_ready",
    contactPerson: "Mustafa Mansour",
    emailSubject: "Mechanical shredder to feed Pyrolysis Reactors",
    emailBody: `Dear Fornnax Export Office,

We operate a continuous pyrolysis reactor plant in Suez, Egypt. We are currently feeding whole tires manually, but to scale up we must shift to automated mechanical shredding down to 50mm chips.

Our specifications:
- Throughput: 4 Tons/Hour.
- Input: Steel-belted radial truck tires.
- final product: Coarse 50mm rubber chips. Steel wire separation is NOT needed at the primary stage because our reactor handles whole chips.

We need a heavy-duty single-shaft shredder that is reliable and has low-maintenance downtime. Please send specifications.

Best regards,
Mustafa Mansour
Sahara Tyre Pyrolysis Co.`,
    notes: "Pyrolysis operator adding a mechanical line. Primary single-shaft or dual-shaft shredder is ideal. Steel removal is not requested at this stage. Recommended model: Fornnax SR-150 primary shredder.",
    specs: {
      inputMaterial: "Steel-belted radial truck tires",
      targetOutputSize: "~ 50mm coarse tire chips",
      capacity: "4.0 Tons / Hour",
      separationRequired: false,
      estimatedBudget: "$190,000"
    },
    channel: "whatsapp",
    specCompleteness: 90
  },
  {
    id: "FNX-EQ-2026-006",
    companyName: "Rhein-Main Zement Klinker",
    country: "Germany",
    countryCode: "DE",
    material: "Car & Truck Tires",
    throughput: "8.0 Tons / Hour",
    outputSize: "50-100mm TDF chips",
    receivedDate: "2026-07-19 06:10:00",
    score: 95,
    status: "brief_ready",
    contactPerson: "Dipl.-Ing. Klaus Fischer",
    emailSubject: "Inquiry: Secondary Fuel Production (TDF) Shredding System",
    emailBody: `Sehr geehrte Fornnax-Vertretung,

We are planning an automated co-processing line at our cement kiln facility in Frankfurt, Germany. We require a high-reliability shredding setup to produce Tire-Derived Fuel (TDF) chips from scrap automotive tires.

Technical Specifications:
- Processing rate: Minimum 8.0 metric tons per hour.
- Output specification: Coarse shredded chips in the range of 50-100mm.
- High wire tolerance is essential.
- System must include an over-belt magnetic separator to extract approx 60% of radial bead wire before feeding the kiln.

Please submit a detailed technical layout for your Dual-Shaft Shredder SR-200. We require high availability and CE electrical certification.

Mit freundlichen Grüßen,
Klaus Fischer
Technical Operations, Rhein-Main Zement Klinker`,
    notes: "Cement co-processing TDF supplier. High volume. Excellent match score. Suggested model: Fornnax SR-200 Heavy Duty with robust magnet separators.",
    specs: {
      inputMaterial: "Car & Truck Scrap Tires",
      targetOutputSize: "50-100mm TDF chips",
      capacity: "8.0 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "€410,000"
    },
    channel: "email",
    specCompleteness: 100
  },
  {
    id: "FNX-EQ-2026-007",
    companyName: "Queensland OTR Recyclers",
    country: "Australia",
    countryCode: "AU",
    material: "Giant OTR Mining Tires",
    throughput: "6.0 Tons / Hour",
    outputSize: "20mm coarse rubber chips + bead extraction",
    receivedDate: "2026-07-19 07:15:00",
    score: 79,
    status: "analyzing",
    contactPerson: "Marcus Vance",
    emailSubject: "OTR mining tire pre-shredding line quotation",
    emailBody: `Hi Fornnax team,

We run a mining waste yard in Gladstone, Queensland. We have a massive stockpile of giant OTR (Off-The-Road) tires from mine haulers, up to 3 meters in outer diameter.

We are looking for a complete pre-shredding line to reduce these OTR tires down to manageable sizes (< 100mm) before feeding fine granulators. 
- Target throughput: 6 Tons/Hour.
- Primary requirement: Giant tire bead cutter/extractor and an extra large shredder mouth.

Can you supply the bead cutter and a dual-shaft shredder with sufficient hydraulic torque to break down mining tyres?

Cheers,
Marcus Vance`,
    notes: "Mining OTR segment. Specialized bead cutting is a prerequisite before OTR shredding can occur. Recommended model: Fornnax Hydraulic Bead Cutter + SR-200 Shredder.",
    specs: {
      inputMaterial: "Giant OTR Mining Tires (up to 3000mm)",
      targetOutputSize: "< 100mm pre-shredded sections",
      capacity: "6.0 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "$520,000"
    },
    channel: "expo",
    specCompleteness: 80
  },
  {
    id: "FNX-EQ-2026-008",
    companyName: "Lagos CleanEarth Solutions",
    country: "Nigeria",
    countryCode: "NG",
    material: "Car & Truck Tires",
    throughput: "2.0 Tons / Hour",
    outputSize: "Rubber Crumb (< 3.0mm)",
    receivedDate: "2026-07-19 08:30:00",
    score: 55,
    status: "collecting",
    contactPerson: "Chinedu Okafor",
    emailSubject: "Scrap tire recycling plant, rubber crumb project",
    emailBody: `Hello Sales,

We are setting up a private recycling project in Lagos, Nigeria. We want to convert passenger vehicle tires into fine rubber crumb (< 3mm) to manufacture rubber tiles and asphalt modifier.

We need a complete turnkey line that does shredding, granulating, and wire sorting.
- Capacity: 2 Tons/Hour.
- We would also like to get information on available spare parts and blade resharpening services.

What is the best price you can offer for a small-scale complete line?

Regards,
Chinedu Okafor`,
    notes: "EPR-driven tyre recycler starting small-scale. Needs detailed pricing and shipping estimates to Lagos Port. Budget constraints likely, recommended model: Fornnax SR-100 coupled with R-1200 granulator.",
    specs: {
      inputMaterial: "Passenger car tires",
      targetOutputSize: "< 3.0 mm fine rubber granules",
      capacity: "2.0 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "$180,000"
    },
    channel: "web",
    specCompleteness: 50
  },
  {
    id: "FNX-EQ-2026-009",
    companyName: "UAE Industrial Co-Processing Group",
    country: "United Arab Emirates",
    countryCode: "AE",
    material: "Municipal Waste and Cable Scrap",
    throughput: "10.0 Tons / Hour",
    outputSize: "Mixed Coarse Fractions",
    receivedDate: "2026-07-19 10:12:00",
    score: 89,
    status: "brief_ready",
    contactPerson: "Tareq Al-Mansoori",
    emailSubject: "Dual-Shaft Shredder quotation for industrial scrap yard",
    emailBody: `Dear Fornnax Export Department,

We operate a large-scale industrial sorting and co-processing terminal in Jebel Ali, Dubai. We process mixed industrial plastic, armored power cables, and municipal wood scrap.

We require a heavy-duty shredder:
- Throughput: 10 Tons/Hour.
- High tolerance for metal spikes and steel bands.
- Auto-reverse functionality and hydraulic force feeding system.
- Voltage: 3-Phase, 415V, 50Hz.

We would like to coordinate a technical meeting in Anand next month to finalize the machinery layout.

Kind regards,
Tareq Al-Mansoori`,
    notes: "High potential client. Jebel Ali Freezone location. Demands premium dual-shaft shredder. Suggested model: Fornnax SR-200 Dual-Shaft with heavy steel frame construction.",
    specs: {
      inputMaterial: "Mixed Industrial Plastics, Cables, & Scrap Wood",
      targetOutputSize: "< 100mm coarse shred",
      capacity: "10.0 Tons / Hour",
      separationRequired: false,
      estimatedBudget: "$420,000"
    },
    channel: "email",
    specCompleteness: 100
  },
  {
    id: "FNX-EQ-2026-010",
    companyName: "California Cable & Wire Shredders",
    country: "United States",
    countryCode: "US",
    material: "Industrial Copper & Aluminum Cables",
    throughput: "4.0 Tons / Hour",
    outputSize: "< 5.0 mm pure copper granules",
    receivedDate: "2026-07-19 12:45:00",
    score: 93,
    status: "brief_ready",
    contactPerson: "Sarah Jenkins",
    emailSubject: "Inquiry: High capacity cable granulator and gravity separator",
    emailBody: `Hi Fornnax Team,

We are California Cable & Wire Shredders, located in Bakersfield, CA. We are looking to replace our old European cable granulator line with a higher capacity, heavy-duty setup.

Our specifications:
- Input feed: Heavy industrial armored power lines, utility cables, and copper wire harnesses.
- Feed throughput: 4.0 Tons/Hour.
- Target Output: < 5.0 mm pure copper granules, wire PVC fraction cleanly separated.
- Air gravity sorting table must be included.
- Electrical specifications: 3-Phase, 480V, 60Hz.

Please send us your mechanical datasheets, delivery terms (FOB Port of Mundra), and expected delivery times.

Best,
Sarah Jenkins
Operations Lead, California Cable & Wire Shredders`,
    notes: "Cable & E-Waste Processor. High score of 93. Custom US voltage (480V/60Hz) is required. Suggested model: Fornnax TR-1500 Cable Granulator coupled with premium Air Gravity Separation Table.",
    specs: {
      inputMaterial: "Armored power lines and copper utility cables",
      targetOutputSize: "< 5.0 mm high-purity copper granules",
      capacity: "4.0 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "$360,000"
    },
    channel: "email",
    specCompleteness: 100
  },
  {
    id: "FNX-EQ-2026-011",
    companyName: "Seoul Smart Eco-Materials",
    country: "South Korea",
    countryCode: "KR",
    material: "Electronic Scrap & Plastic Casings",
    throughput: "Not Sized Yet",
    outputSize: "Not Sized Yet",
    receivedDate: "2026-07-19 14:05:00",
    score: 48,
    status: "new",
    contactPerson: "Ji-Woo Park",
    emailSubject: "Electronic scrap granulator pricing",
    emailBody: `Dear Sirs,

We require pricing for small scale electronic casing shredder. We are Seoul Smart Eco-Materials. 

Please send catalog and price.

Thank you,
Ji-Woo Park`,
    notes: "New, very brief inquiry. Needs spec extraction daemon to prompt for throughput, electrical sizing, and exact input materials.",
    specs: {
      inputMaterial: "Electronic casing scrap",
      targetOutputSize: "Unspecified",
      capacity: "Unspecified",
      separationRequired: false,
      estimatedBudget: "Unspecified"
    },
    channel: "whatsapp",
    specCompleteness: 40
  },
  {
    id: "FNX-EQ-2026-012",
    companyName: "Tokyo Scrap E-Waste Refinery",
    country: "Japan",
    countryCode: "JP",
    material: "WEEE PCB Circuit Boards",
    throughput: "2.0 Tons / Hour",
    outputSize: "< 8.0 mm uniform fraction",
    receivedDate: "2026-07-19 15:30:00",
    score: 76,
    status: "analyzing",
    contactPerson: "Takashi Saito",
    emailSubject: "High precision PCB size reduction machinery",
    emailBody: `Dear Fornnax Technology,

We met your representative at the Tokyo Waste Expo. We are looking to implement a primary size reduction machine for printed circuit boards (PCB) and phone casings.

Specifications:
- Capacity: 2.0 Tons/Hour.
- Target Output Size: < 8mm uniform.
- Blades must be highly wear-resistant due to high fiber contents.
- Metal separation is handled downstream by our electrostatic unit.

Please send technical specifications of your TR series copper and electronics scrap granulators.

Saito Takashi
Tokyo Scrap E-Waste Refinery`,
    notes: "WEEE PCB Recycler. High wear blades are essential. Needs electrostatic downstream interface specifications. Recommended model: Fornnax TR-1000.",
    specs: {
      inputMaterial: "WEEE Printed Circuit Boards",
      targetOutputSize: "< 8.0 mm uniform fraction",
      capacity: "2.0 Tons / Hour",
      separationRequired: false,
      estimatedBudget: "$230,000"
    },
    channel: "expo",
    specCompleteness: 70
  },
  {
    id: "FNX-EQ-2026-013",
    companyName: "Mumbai Metal & Cable Salvage",
    country: "India",
    countryCode: "IN",
    material: "Scrap Aluminum & Copper Cables",
    throughput: "1.5 Tons / Hour",
    outputSize: "< 6.0 mm granules",
    receivedDate: "2026-07-19 16:50:00",
    score: 35,
    status: "action_required",
    contactPerson: "Anand Mehta",
    emailSubject: "Best price for small cable separator",
    emailBody: `Sir,

Please quote best price for 1.5 TPH cable recycling machine. We process scrap wires in Kurla, Mumbai.

We have low budget. Please quote discounted second-hand price if available.

Anand Mehta`,
    notes: "Domestic low-budget buyer. Broker/small dealer archetype. Low priority score. Responded with catalog of Fornnax standard entry-level TR line and deferred to domestic dealers.",
    specs: {
      inputMaterial: "Scrap aluminum & copper wires",
      targetOutputSize: "< 6.0 mm metal granules",
      capacity: "1.5 Tons / Hour",
      separationRequired: true,
      estimatedBudget: "₹25 - ₹35 Lakhs"
    },
    channel: "indiamart",
    specCompleteness: 30
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "LD-001",
    companyName: "Sachsen Kabel-Recycling",
    country: "Germany",
    type: "Cable & Copper Scrap Recycler",
    source: "Import customs database (copper logs)",
    contactEmail: "info@sachsen-kabel.de",
    phone: "+49 351 28319",
    status: "new",
    confidenceScore: 92
  },
  {
    id: "LD-002",
    companyName: "Riyadh Eco-Tire Shredders",
    country: "Saudi Arabia",
    type: "Scrap Tire Accumulator",
    source: "Saudi Industrial Directory",
    contactEmail: "procurement@riyadhecotires.com",
    phone: "+966 11 482 1192",
    status: "contacted",
    confidenceScore: 89
  },
  {
    id: "LD-003",
    companyName: "Melbourne Green-Waste Processing",
    country: "Australia",
    type: "Municipal Waste and RDF Manufacturer",
    source: "Google Maps Scraping (Brisbane/Melbourne)",
    contactEmail: "admin@melbgreenwaste.com.au",
    phone: "+61 3 9482 1202",
    status: "new",
    confidenceScore: 78
  },
  {
    id: "LD-004",
    companyName: "Al-Khobar Cable Granulating Co.",
    country: "Saudi Arabia",
    type: "Non-Ferrous Scrap Processor",
    source: "Import customs database (copper logs)",
    contactEmail: "hassan@alkhobarcables.com",
    phone: "+966 13 892 4811",
    status: "new",
    confidenceScore: 85
  },
  {
    id: "LD-005",
    companyName: "Bavaria E-Waste Refiners",
    country: "Germany",
    type: "WEEE & Electronics Recycler",
    source: "EU WEEE Registry",
    contactEmail: "contact@bavaria-ewaste.de",
    phone: "+49 89 2194 0022",
    status: "not_interested",
    confidenceScore: 64
  }
];

export const ORCHESTRATION_AGENTS: OrchestrationAgent[] = [
  {
    id: "AGT-001",
    name: "Enquiry Parser Daemon",
    role: "Email Parsing & Ingestion",
    status: "idle",
    lastActive: "12 seconds ago",
    currentTask: "Polling imap.fornnaxtools.com mailbox for new enquiries...",
    totalInvocations: 1420,
    tokensUsed: 425000
  },
  {
    id: "AGT-002",
    name: "Spec Extractor Agent",
    role: "Technical Parameter Parsing",
    status: "running",
    lastActive: "Active now",
    currentTask: "Parsing incoming inquiry email from Karlsruhe Elektronik-Schredder GmbH...",
    totalInvocations: 890,
    tokensUsed: 1250000
  },
  {
    id: "AGT-003",
    name: "Customs & Freight Intelligence Bot",
    role: "Importer History Cross-Reference",
    status: "success",
    lastActive: "4 mins ago",
    currentTask: "Querying global shipping manifests for 'Saudi Plastic & Rubber Recycling'...",
    totalInvocations: 560,
    tokensUsed: 890000
  },
  {
    id: "AGT-004",
    name: "Sanction & Compliance Screener",
    role: "Dual-Use Machinery Risk Verification",
    status: "success",
    lastActive: "1 min ago",
    currentTask: "Screening 'Abdulaziz Al-Subaie' against Consolidated OFAC & EU sanctions list...",
    totalInvocations: 1240,
    tokensUsed: 310000
  },
  {
    id: "AGT-005",
    name: "Outreach Template Drafter",
    role: "AI Offer & Email Draft generator",
    status: "idle",
    lastActive: "2 hours ago",
    currentTask: "Standing by to draft industrial machine proposal for verified briefs...",
    totalInvocations: 430,
    tokensUsed: 1650000
  }
];
