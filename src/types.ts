export interface EnquirySpecs {
  inputMaterial: string;
  targetOutputSize: string;
  capacity: string;
  separationRequired: boolean;
  estimatedBudget: string;
  powerAvailability?: string;
  siteStatus?: string;
  timeline?: string;
  budgetStage?: string;
}

export interface Enquiry {
  id: string;
  companyName: string;
  country: string;
  countryCode: string; // e.g. "DE", "SA", "IN", "AU", "US"
  material: string;
  throughput: string;
  outputSize: string;
  receivedDate: string;
  score: number; // 0-100 Hot-Lead Score
  status: 'unread' | 'analyzing' | 'action_required' | 'brief_ready' | 'archived' | 'new' | 'collecting' | 'human_review' | 'auto_answered';
  contactPerson: string;
  emailSubject: string;
  emailBody: string;
  notes: string;
  specs?: EnquirySpecs;
  channel?: 'whatsapp' | 'email' | 'web' | 'indiamart' | 'expo';
  specCompleteness?: number; // 0-100%
}

export interface Lead {
  id: string;
  companyName: string;
  country: string;
  type: string;
  source: string;
  contactEmail: string;
  phone: string;
  status: 'new' | 'contacted' | 'not_interested';
  confidenceScore: number;
}

export interface OrchestrationAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  lastActive: string;
  currentTask: string;
  totalInvocations: number;
  tokensUsed: number;
}
