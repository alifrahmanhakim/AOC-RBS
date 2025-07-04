
export enum RiskLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum ExposureLevel {
  A = "A", // Very Low
  B = "B", // Low
  C = "C", // Medium
  D = "D", // High
  E = "E", // Very High
}

export enum OccurrenceType {
  ACCIDENT = "Accident",
  SERIOUS_INCIDENT = "Serious Incident",
  INCIDENT = "Incident",
  SDR = "Service Difficulty Report (SDR)",
  SAFETY_REPORT = "Safety Report (Internal/Voluntary)",
  OTHER = "Other Reportable Occurrence",
}

export enum SeverityLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
  [SeverityLevel.LOW]: 1,
  [SeverityLevel.MEDIUM]: 3,
  [SeverityLevel.HIGH]: 5,
  [SeverityLevel.CRITICAL]: 10,
};

export interface Location {
  latitude?: number;
  longitude?: number;
  addressString?: string;
}

export interface WeatherForecast {
  temperature?: number;
  weatherCode?: number;
  weatherDescription?: string;
  windSpeed?: number;
  source?: 'Open-Meteo' | string; // Allow for other sources
  fetchedAt?: string; // ISO date string
}

export interface RouteDetails {
    originAirportICAO?: string;
    destinationAirportICAO?: string;
    originAirportName?: string; // Added for airportdb.io integration
    destinationAirportName?: string; // Added for airportdb.io integration
    routeDescription?: string;
    flightDataSource?: 'AviationStack' | 'AirportDB' | 'Manual' | 'Fetching...' | string;
}

export interface Occurrence {
  id: string;
  dateTime: string; // ISO datetime string
  type: OccurrenceType;
  severity: SeverityLevel;
  description: string;
  category?: OccurrenceCategory;
  location?: Location;
  weatherForecast?: WeatherForecast;
  flightNumber?: string;
  aircraftRegistration?: string;
  routeDetails?: RouteDetails;
}

export interface LegacyRiskFactors {
  aircraftFrequency: number; // Scale 1-5 (Very Low to Very High)
  environmentalComplexity: number; // Scale 1-5
  occurrences: Occurrence[];
}

export interface ComplexityFactors {
  annualFlightCount: number;
  numEmployees: number;
  numAircraft: number;
  numAircraftModels: number;
  numDestinations: number;
  hasInternationalOps: boolean; // true for 'Yes', false for 'No'
  avgFleetAge: number; // years
  numDomesticBases: number;
}

export interface ComplianceFindingCounts {
  ncp: number; // Non-Compliance
  ncf: number; // Non-Conformance
  nad: number; // Non-Adherence
}

export interface ComplianceData {
  findings: ComplianceFindingCounts;
  totalChecklistItems: number; // N_checklist_items from slide 19
}

export interface DeviationData {
  accidentCount: number;
  seriousIncidentCount: number;
  incidentCount: number;
  totalFlightCycles: number;
}

export interface ImprovementData {
  totalDeviationsNd: number;
  totalFindingsNf: number;
  correctiveActionsRootCause: number;
  correctiveActionsHazardIdentified: number;
  correctiveActionsRiskAssessed: number;
  correctiveActionsRiskMitigated: number;
  totalCorrectiveActionsAppliedToFindings: number; // Not directly used in I(p) calc but useful info
  totalCorrectiveActionsAppliedToDeviations: number; // Not directly used in I(p) calc but useful info
}

export enum FindingCategoryLevel {
  LEVEL_1 = "Level 1 (Non-Compliance)", // Target +15 days
  LEVEL_2 = "Level 2 (Non-Conformance)", // Target +30 days
  LEVEL_3 = "Level 3 (Non-Adherence)",   // Target +60 days
}

export interface SurveillanceFinding {
  id: string;
  dateAdded: string; // ISO date string
  
  // New fields for Area integration
  surveillanceLogCategoryId?: SurveillanceLogCategory; // Category of the surveillance area
  predefinedAreaId?: string; // Link to PredefinedSurveillanceArea.id
  itemNumber?: string; // Auto-filled from selected PredefinedSurveillanceArea (e.g., "1", "2.a")
  areaDescription?: string; // Auto-filled: areaDescription from PredefinedSurveillanceArea

  finding: string; // The actual finding text
  findingCategory: FindingCategoryLevel; 
  rootCauseAnalysis: string;
  correctiveActionPlan: string; // Hazard Identification
  riskAssessment: string; // NEW
  correctiveActionTaken: string; // Mitigation Action
  targetCompletionDate: string; // ISO date string - Will be calculated
  isCompleted: boolean;
  actualCompletionDate?: string; // ISO date string, set when isCompleted is true
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface RiskIndicatorHistoryEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  technicalIndicator: number; // Risk Indicator Level (IDR, 1-5)
  economicIndicator: number; // Economic Indicator Score (0-5)
  performanceScore: number; // F(P) score (0-1)
  exposureLevel: ExposureLevel;
}

export enum SurveillanceLogCategory {
  AIRWORTHINESS = "Airworthiness Surveillance Area",
  OPERATIONS = "Aircraft Operations Surveillance Area",
  SMS = "Safety Management System (SMS) Surveillance",
  QMS = "Quality Management System (QMS) Surveillance"
}

export interface PredefinedSurveillanceArea {
  id: string; // Unique ID for the predefined area, e.g., "airworthiness-1"
  itemNumber: string; // The "No." from the PDF, e.g., "1", "2.a"
  areaDescription: string; // The "Area" text from the PDF
  category: SurveillanceLogCategory;
  defaultFormNumber?: string; // The "Formulir Number" from the PDF
}

export type SurveillanceLogStatus = 'Done' | 'Not Done' | 'On Going';

export interface SurveillanceLogItem {
  id: string; // Unique ID for this specific log record
  predefinedAreaId: string; // Link to PredefinedSurveillanceArea.id
  
  // Denormalized/cached from PredefinedSurveillanceArea for easier display/query
  category: SurveillanceLogCategory;
  itemNumber: string; 
  area: string; 
  
  status: SurveillanceLogStatus;
  lastUpdated: string; // ISO date string when status was last set
  notes?: string;
}

export const OPERATOR_CATEGORIES = [
  "Scheduled Commercial Air Transport",
  "Non-Scheduled Commercial Air Transport",
  "General Aviation - Complex",
  "General Aviation - Non-Complex",
  "Cargo Operations",
  "Special Operations (e.g., Aerial Work)",
];

export interface EconomicFactors {
  liquidity: number; // 0-10, higher is worse
  shortTermDebt: number; // 0-10, higher is worse
  longTermDebt: number; // 0-10, higher is worse
  decapitalization: number; // 0-10, higher is worse
  profitabilityAndCashFlows: number; // 0-10, higher is worse
  
  // Optional: sub-details for each factor
  liquidityDetails?: Record<string, string | number>;
  shortTermDebtDetails?: Record<string, string | number>;
  longTermDebtDetails?: Record<string, string | number>;
  decapitalizationDetails?: Record<string, string | number>;
  profitabilityAndCashFlowsDetails?: Record<string, string | number>;
  
  lastUpdatedByAI?: string; // ISO date string for when these factors were updated
}

export interface Operator {
  id: string;
  name: string;
  aocNumber: string;
  logoUrl?: string;
  lastUpdated: string; // ISO date string

  // RBS Input Data Blocks
  complexityFactors: ComplexityFactors;
  complianceData: ComplianceData; // Fallback if no open findings
  deviationData: DeviationData; 
  improvementData: ImprovementData; 
  surveillanceFindings?: SurveillanceFinding[]; 
  surveillanceLogs?: SurveillanceLogItem[]; 

  // RBS Calculated Output
  exposureScore: number; // FIdes
  exposureLevel: ExposureLevel; // A-E

  complianceFactorScore: number; // C(p)
  deviationFactorScore: number;  // D(p)
  improvementFactorScore: number; // I(p)
  overallPerformanceScore: number; // F(P)

  riskIndicatorLevel: number; // IDR (1-5, based on F(P))
  finalRiskCategoryKey: string; // e.g., "1A", "5E" for matrix
  suggestedSurveillanceCycleMonths: number; // Based on matrix

  // Legacy Risk (to be phased out or used as supplementary)
  legacyRiskFactors: LegacyRiskFactors; // Old inputs
  legacyOverallRiskScore: number;
  legacyOverallRiskLevel: RiskLevel; // Low, Medium, High, Critical

  // Economic & Technical Profile for Safety Risk Area Chart
  economicIndicatorScore?: number; // 0-5 scale (Overall score)
  operatorCategory?: string; // e.g., Scheduled, Non-Scheduled
  hadFatalAccidentLast3Years?: boolean;

  // AI Generated Financials
  financialReportText?: string;
  financialReportSources?: GroundingSource[];
  economicIndicatorScoreLastUpdatedByAI?: string; // ISO date string for the overall score

  // NEW: Detailed Economic Factors for Spiderweb/Heatmap
  economicFactors?: EconomicFactors;

  // History for Trend Chart
  riskIndicatorHistory?: RiskIndicatorHistoryEntry[]; 
}

export enum OccurrenceCategory {
  ADRM = "ADRM", // Aerodrome design, service, or functionality issues
  AMAN = "AMAN", // Intentional abrupt maneuvering of the aircraft
  ARC = "ARC",   // Abnormal runway contact
  ATM = "ATM",   // Air traffic management (ATM) or CNS service issues
  BIRD = "BIRD", // Collisions/near collisions with birds
  CABIN = "CABIN", // Cabin safety events
  CFIT = "CFIT", // Controlled flight into or toward terrain
  CTOL = "CTOL", // Collision with obstacle(s) during take-off or landing (airborne)
  EVAC = "EVAC", // Evacuation issues
  EXTL = "EXTL", // External load related occurrences
  FNI = "F-NI",  // Fire/smoke (non-impact)
  FPOST = "F-POST", // Fire/smoke (post-impact)
  FUEL = "FUEL", // Fuel related issues
  GCOL = "GCOL", // Ground collision (taxiing)
  GTOW = "GTOW", // Glider towing related events
  ICE = "ICE",   // Icing issues
  LALT = "LALT", // Low altitude operations (intentional, non-takeoff/landing)
  LOCG = "LOC-G", // Loss of control - ground
  LOCI = "LOC-I", // Loss of control - inflight
  LOLI = "LOLI", // Loss of lifting conditions en-route (gliders, balloons)
  MAC = "MAC",   // Midair collision / Airprox / ACAS alert / Loss of separation
  RAMP = "RAMP", // Ground handling operations
  RE = "RE",     // Runway excursion
  RIO = "RI-O",  // Runway incursion - other (person/animal)
  RIVA = "RI-VA", // Runway incursion - vehicle or aircraft
  SCFNP = "SCF-NP", // System/component failure - non-powerplant
  SCFPP = "SCF-PP", // System/component failure - powerplant
  SEC = "SEC",   // Security related
  TURB = "TURB", // In-flight turbulence encounter
  UIMC = "UIMC", // Unintended flight in IMC
  USOS = "USOS", // Undershoot/overshoot (touchdown off runway surface)
  WILD = "WILD", // Wildlife collision/risk (on runway/helipad)
  WSTRW = "WSTRW",// Windshear or thunderstorm encounter
  OTHR = "OTHR", // Other
  UNK = "UNK"    // Unknown or undetermined
}

// Completed OCCURRENCE_CATEGORY_LABELS (Translated to English)
export const OCCURRENCE_CATEGORY_LABELS: Record<OccurrenceCategory, string> = {
  [OccurrenceCategory.ADRM]: "Aerodrome Design/Service",
  [OccurrenceCategory.AMAN]: "Abrupt Maneuver",
  [OccurrenceCategory.ARC]: "Abnormal Runway Contact",
  [OccurrenceCategory.ATM]: "ATM/CNS Service Issues",
  [OccurrenceCategory.BIRD]: "Birdstrike",
  [OccurrenceCategory.CABIN]: "Cabin Safety Events",
  [OccurrenceCategory.CFIT]: "Controlled Flight Into Terrain",
  [OccurrenceCategory.CTOL]: "Collision During Takeoff/Landing",
  [OccurrenceCategory.EVAC]: "Evacuation Issues",
  [OccurrenceCategory.EXTL]: "External Load Operations",
  [OccurrenceCategory.FNI]: "Fire/Smoke (Non-Impact)",
  [OccurrenceCategory.FPOST]: "Fire/Smoke (Post-Impact)",
  [OccurrenceCategory.FUEL]: "Fuel Related",
  [OccurrenceCategory.GCOL]: "Ground Collision",
  [OccurrenceCategory.GTOW]: "Glider Towing Events",
  [OccurrenceCategory.ICE]: "Icing",
  [OccurrenceCategory.LALT]: "Low Altitude Operations",
  [OccurrenceCategory.LOCG]: "Loss of Control - Ground",
  [OccurrenceCategory.LOCI]: "Loss of Control - Inflight",
  [OccurrenceCategory.LOLI]: "Loss of Lifting Conditions (En-route)",
  [OccurrenceCategory.MAC]: "Mid-Air Collision/Airprox/ACAS",
  [OccurrenceCategory.RAMP]: "Ground Handling",
  [OccurrenceCategory.RE]: "Runway Excursion",
  [OccurrenceCategory.RIO]: "Runway Incursion (Other)",
  [OccurrenceCategory.RIVA]: "Runway Incursion (Vehicle/Aircraft)",
  [OccurrenceCategory.SCFNP]: "System/Component Failure (Non-Powerplant)",
  [OccurrenceCategory.SCFPP]: "System/Component Failure (Powerplant)",
  [OccurrenceCategory.SEC]: "Security Related",
  [OccurrenceCategory.TURB]: "Turbulence Encounter",
  [OccurrenceCategory.UIMC]: "Unintended Flight in IMC",
  [OccurrenceCategory.USOS]: "Undershoot/Overshoot",
  [OccurrenceCategory.WILD]: "Wildlife Collision/Risk (Runway/Helipad)",
  [OccurrenceCategory.WSTRW]: "Windshear/Thunderstorm",
  [OccurrenceCategory.OTHR]: "Other",
  [OccurrenceCategory.UNK]: "Unknown/Undetermined"
};

// OCCURRENCE_CATEGORY_USAGE_NOTES (Shortened for brevity during translation)
export const OCCURRENCE_CATEGORY_USAGE_NOTES: Record<OccurrenceCategory, string> = {
  [OccurrenceCategory.ADRM]: `Occurrences involving aerodrome design, service, or functionality issues. Usage Notes (to be fully translated): Includes deficiencies/issues associated with State-approved Aerodrome runways, taxiways, ramp area, parking area, buildings and structures, Crash/Fire/Rescue (CFR) services, obstacles on the Aerodrome property, lighting, markings, signage, procedures, policies, and standards.`,
  [OccurrenceCategory.AMAN]: `The intentional abrupt maneuvering of the aircraft by the flight crew. Usage Notes (to be fully translated): This category includes the intentional maneuvering of the aircraft to avoid a collision with terrain, objects/obstacles, weather or other aircraft.`,
  [OccurrenceCategory.ARC]: `Any landing or takeoff involving abnormal runway or landing surface contact. Usage Notes (to be fully translated): Events such as hard/heavy landings, long/fast landings, off center landings, crabbed landings, nose wheel first touchdown, tail strikes, and wingtip/nacelle strikes are included.`,
  [OccurrenceCategory.ATM]: "Usage notes for ATM category (to be fully translated). Air traffic management (ATM) or CNS service issues.",
  [OccurrenceCategory.BIRD]: "Usage notes for BIRD category (to be fully translated). Collisions/near collisions with birds.",
  [OccurrenceCategory.CABIN]: "Usage notes for CABIN category (to be fully translated). Cabin safety events.",
  [OccurrenceCategory.CFIT]: "Usage notes for CFIT category (to be fully translated). Controlled flight into or toward terrain.",
  [OccurrenceCategory.CTOL]: "Usage notes for CTOL category (to be fully translated). Collision with obstacle(s) during take-off or landing (airborne).",
  [OccurrenceCategory.EVAC]: "Usage notes for EVAC category (to be fully translated). Evacuation issues.",
  [OccurrenceCategory.EXTL]: "Usage notes for EXTL category (to be fully translated). External load related occurrences.",
  [OccurrenceCategory.FNI]: "Usage notes for F-NI category (to be fully translated). Fire/smoke (non-impact).",
  [OccurrenceCategory.FPOST]: "Usage notes for F-POST category (to be fully translated). Fire/smoke (post-impact).",
  [OccurrenceCategory.FUEL]: "Usage notes for FUEL category (to be fully translated). Fuel related issues.",
  [OccurrenceCategory.GCOL]: "Usage notes for GCOL category (to be fully translated). Ground collision (taxiing).",
  [OccurrenceCategory.GTOW]: "Usage notes for GTOW category (to be fully translated). Glider towing related events.",
  [OccurrenceCategory.ICE]: "Usage notes for ICE category (to be fully translated). Icing issues.",
  [OccurrenceCategory.LALT]: "Usage notes for LALT category (to be fully translated). Low altitude operations (intentional, non-takeoff/landing).",
  [OccurrenceCategory.LOCG]: "Usage notes for LOC-G category (to be fully translated). Loss of control - ground.",
  [OccurrenceCategory.LOCI]: "Usage notes for LOC-I category (to be fully translated). Loss of control - inflight.",
  [OccurrenceCategory.LOLI]: "Usage notes for LOLI category (to be fully translated). Loss of lifting conditions en-route (gliders, balloons).",
  [OccurrenceCategory.MAC]: "Usage notes for MAC category (to be fully translated). Midair collision / Airprox / ACAS alert / Loss of separation.",
  [OccurrenceCategory.RAMP]: "Usage notes for RAMP category (to be fully translated). Ground handling operations.",
  [OccurrenceCategory.RE]: "Usage notes for RE category (to be fully translated). Runway excursion.",
  [OccurrenceCategory.RIO]: "Usage notes for RI-O category (to be fully translated). Runway incursion - other (person/animal).",
  [OccurrenceCategory.RIVA]: "Usage notes for RI-VA category (to be fully translated). Runway incursion - vehicle or aircraft.",
  [OccurrenceCategory.SCFNP]: "Usage notes for SCF-NP category (to be fully translated). System/component failure - non-powerplant.",
  [OccurrenceCategory.SCFPP]: "Usage notes for SCF-PP category (to be fully translated). System/component failure - powerplant.",
  [OccurrenceCategory.SEC]: "Usage notes for SEC category (to be fully translated). Security related.",
  [OccurrenceCategory.TURB]: "Usage notes for TURB category (to be fully translated). In-flight turbulence encounter.",
  [OccurrenceCategory.UIMC]: "Usage notes for UIMC category (to be fully translated). Unintended flight in IMC.",
  [OccurrenceCategory.USOS]: "Usage notes for USOS category (to be fully translated). Undershoot/overshoot (touchdown off runway surface).",
  [OccurrenceCategory.WILD]: "Usage notes for WILD category (to be fully translated). Wildlife collision/risk (on runway/helipad).",
  [OccurrenceCategory.WSTRW]: "Usage notes for WSTRW category (to be fully translated). Windshear or thunderstorm encounter.",
  [OccurrenceCategory.OTHR]: "Usage notes for OTHR category (to be fully translated). Other.",
  [OccurrenceCategory.UNK]: "Usage notes for UNK category (to be fully translated). Unknown or undetermined."
};


export const DEFAULT_COMPLEXITY_FACTORS: ComplexityFactors = {
  annualFlightCount: 0,
  numEmployees: 0,
  numAircraft: 0,
  numAircraftModels: 0,
  numDestinations: 0,
  hasInternationalOps: false,
  avgFleetAge: 0,
  numDomesticBases: 0,
};

export const DEFAULT_COMPLIANCE_DATA: ComplianceData = {
  findings: { ncp: 0, ncf: 0, nad: 0 },
  totalChecklistItems: 100, // Default N_checklist_items
};

export const DEFAULT_DEVIATION_DATA: DeviationData = {
  accidentCount: 0,
  seriousIncidentCount: 0,
  incidentCount: 0,
  totalFlightCycles: 1000, // Default to avoid division by zero if not set
};

export const DEFAULT_IMPROVEMENT_DATA: ImprovementData = {
  totalDeviationsNd: 0,
  totalFindingsNf: 0,
  correctiveActionsRootCause: 0,
  correctiveActionsHazardIdentified: 0,
  correctiveActionsRiskAssessed: 0,
  correctiveActionsRiskMitigated: 0,
  totalCorrectiveActionsAppliedToFindings: 0,
  totalCorrectiveActionsAppliedToDeviations: 0,
};

export const DEFAULT_LEGACY_RISK_FACTORS: LegacyRiskFactors = {
  aircraftFrequency: 1,
  environmentalComplexity: 1,
  occurrences: [],
};

export const DEFAULT_OCCURRENCE_REPORT_FORM_STATE: Omit<Occurrence, 'id'> = {
  dateTime: new Date().toISOString().slice(0, 16), // For datetime-local input
  type: OccurrenceType.INCIDENT,
  severity: SeverityLevel.LOW,
  description: '',
  category: OccurrenceCategory.OTHR,
  location: { latitude: undefined, longitude: undefined, addressString: undefined },
  weatherForecast: {},
  flightNumber: '',
  aircraftRegistration: '',
  routeDetails: { 
    originAirportICAO: '', 
    destinationAirportICAO: '', 
    originAirportName: '',      // Added
    destinationAirportName: '', // Added
    routeDescription: '', 
    flightDataSource: 'Manual' 
  },
};

export const DEFAULT_SURVEILLANCE_FINDING_FORM_STATE: Omit<SurveillanceFinding, 'id' | 'isCompleted' | 'dateAdded' | 'actualCompletionDate' | 'targetCompletionDate'> = {
  surveillanceLogCategoryId: undefined,
  predefinedAreaId: undefined,
  itemNumber: '',
  areaDescription: '',
  finding: '',
  findingCategory: FindingCategoryLevel.LEVEL_3,
  rootCauseAnalysis: '',
  correctiveActionPlan: '',
  riskAssessment: '',
  correctiveActionTaken: '',
};

export enum UserRole {
  ADMIN = "Admin",
  RESTRICTED_USER = "Restricted User"
}

export interface UserProfile { // More generic now
  id: string; // Could be a username for mock auth
  displayName: string;
  role: UserRole;
  // For restricted users, this filters which operators they can see/manage
  managesOperatorNameContaining?: string; 
}


// WMO Weather Codes (Translated for example, main codes are international)
export const WMO_WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle: Light intensity',
  53: 'Drizzle: Moderate intensity',
  55: 'Drizzle: Dense intensity',
  61: 'Rain: Slight intensity',
  63: 'Rain: Moderate intensity',
  65: 'Rain: Heavy intensity',
  80: 'Rain showers: Slight',
  81: 'Rain showers: Moderate',
  82: 'Rain showers: Violent',
  // ... add more as needed
};

// airportdb.io API response structure (partial)
export interface AirportDbResponse {
  icao_code: string;
  iata_code?: string;
  name: string;
  city?: string;
  state_code?: string;
  country_code: string;
  country_name: string;
  latitude_deg: number;
  longitude_deg: number;
  elevation_ft?: number;
  // ... and many other fields we might not use
}