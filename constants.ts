
import { RiskLevel, ExposureLevel, FindingCategoryLevel, SurveillanceLogCategory, PredefinedSurveillanceArea } from './types';

// Legacy or general purpose risk level thresholds
export const RISK_LEVEL_THRESHOLDS: Record<RiskLevel, { min: number, max: number }> = {
  [RiskLevel.LOW]: { min: 0, max: 10 },
  [RiskLevel.MEDIUM]: { min: 11, max: 25 },
  [RiskLevel.HIGH]: { min: 26, max: 40 },
  [RiskLevel.CRITICAL]: { min: 41, max: Infinity },
};

// Tailwind CSS classes for general risk level display
export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.LOW]: "bg-risk-low",
  [RiskLevel.MEDIUM]: "bg-risk-medium",
  [RiskLevel.HIGH]: "bg-risk-high",
  [RiskLevel.CRITICAL]: "bg-risk-critical",
};

export const RISK_LEVEL_TEXT_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.LOW]: "text-risk-low",
  [RiskLevel.MEDIUM]: "text-risk-medium",
  [RiskLevel.HIGH]: "text-risk-high",
  [RiskLevel.CRITICAL]: "text-risk-critical",
};

// Hex colors for charts
export const CHART_HEX_RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.LOW]: '#22c55e', // Green
  [RiskLevel.MEDIUM]: '#eab308', // Yellow
  [RiskLevel.HIGH]: '#f97316', // Orange
  [RiskLevel.CRITICAL]: '#ef4444', // Red
};
// Hex colors for Exposure Levels (example, can be adjusted)
export const CHART_HEX_EXPOSURE_LEVEL_COLORS: Record<ExposureLevel, string> = {
  [ExposureLevel.A]: '#4ade80', // Lighter Green
  [ExposureLevel.B]: '#86efac', 
  [ExposureLevel.C]: '#fde047', // Lighter Yellow
  [ExposureLevel.D]: '#fed7aa', // Lighter Orange
  [ExposureLevel.E]: '#fecaca', // Lighter Red
};

export const CHART_HEX_SURVEILLANCE_STATUS_COLORS = {
  OPEN: '#facc15', // Tailwind Yellow-400
  COMPLETED: '#4ade80', // Tailwind Green-400
};


// Weights for legacy risk calculation (to be phased out)
export const WEIGHT_AIRCRAFT_FREQUENCY = 2;
export const WEIGHT_ENVIRONMENTAL_COMPLEXITY = 2;
export const WEIGHT_OCCURRENCES_SCORE = 1;


// RBS Calculation Weights and Parameters

// From Slide 17: F(P) = wc*C(p) - wd*D(p) + wi*I(p)
export const RBS_WEIGHT_COMPLIANCE = 0.75;      // wc
export const RBS_WEIGHT_DEVIATION = 1.00;       // wd
export const RBS_WEIGHT_IMPROVEMENT = 0.25;     // wi

// From Slide 19: C(p) related
export const RBS_COMPLIANCE_FINDING_WEIGHTS = {
  ncp: 0.50, // Non-Compliance (Red)
  ncf: 0.35, // Non-Conformance (Yellow)
  nad: 0.15, // Non-Adherence (Green)
};

// From Slide 20: D(p) related
export const RBS_DEVIATION_CATEGORY_WEIGHTS = {
  accident: 0.50,
  seriousIncident: 0.35,
  incident: 0.15,
};

// From Slide 21: I(p) related, Nn weights for corrective actions
export const RBS_CORRECTIVE_ACTION_WEIGHTS = {
  rootCause: 0.25,
  hazardIdentified: 0.50,
  riskAssessed: 0.75,
  riskMitigated: 1.00,
};

// Overall Performance Score (F(P) or "hasil ORP") to Risk Indicator Level ("nilai IDR" 1-5)
// Based on Slide 29
export const RBS_PERFORMANCE_TO_INDICATOR_LEVEL: Array<{thresholdMax: number, level: number, label: string}> = [
  { thresholdMax: 35, level: 5, label: "Very High ORP" }, // 0-35
  { thresholdMax: 60, level: 4, label: "High ORP" },       // >35-60
  { thresholdMax: 75, level: 3, label: "Medium ORP" },        // >60-75 (Adjusted from slide's 60<70)
  { thresholdMax: 85, level: 2, label: "Low ORP" },       // >75-85
  { thresholdMax: Infinity, level: 1, label: "Very Low ORP" } // >85-100+
];


// RBS Matrix: ExposureLevel (Rows A-E) vs RiskIndicatorLevel (Cols 1-5)
// Values are suggested surveillance cycle in months.
// Key: `${RiskIndicatorLevel}${ExposureLevel}`, e.g., "1A", "5E" (Matches finalRiskCategoryKey)
// Based on example matrix from slide 26/31
// Risk Indicator Level (FRp): 1 (Very Low), 2 (Low), 3 (Medium), 4 (High), 5 (Very High)
// Exposure Level (FIde): A (Very Low), B (Low), C (Medium), D (High), E (Very High)
export const RBS_MATRIX_SURVEILLANCE_CYCLES: Record<string, number> = {
  // Risk Indicator 1 (Very Low)
  "1A": 18, "1B": 18, "1C": 12, "1D": 12, "1E": 12,
  // Risk Indicator 2 (Low)
  "2A": 18, "2B": 12, "2C": 12, "2D": 6,  "2E": 6,
  // Risk Indicator 3 (Medium)
  "3A": 12, "3B": 12, "3C": 6,  "3D": 6,  "3E": 6,
  // Risk Indicator 4 (High)
  "4A": 12, "4B": 6,  "4C": 6,  "4D": 6,  "4E": 6,
  // Risk Indicator 5 (Very High)
  "5A": 6,  "5B": 6,  "5C": 6,  "5D": 6,  "5E": 6,
};

// For visualization, map the key (e.g. "1A" from slide 26) to matrix cells
// The key in the inner object is RiskIndicatorLevel (1-5)
// The cell value is RiskIndicatorLevel + ExposureLevel
export const RBS_MATRIX_CELL_KEYS: Record<ExposureLevel, Record<number, string>> = {
    [ExposureLevel.E]: { 1: "1E", 2: "2E", 3: "3E", 4: "4E", 5: "5E" }, 
    [ExposureLevel.D]: { 1: "1D", 2: "2D", 3: "3D", 4: "4D", 5: "5D" },
    [ExposureLevel.C]: { 1: "1C", 2: "2C", 3: "3C", 4: "4C", 5: "5C" },
    [ExposureLevel.B]: { 1: "1B", 2: "2B", 3: "3B", 4: "4B", 5: "5B" },
    [ExposureLevel.A]: { 1: "1A", 2: "2A", 3: "3A", 4: "4A", 5: "5A" }, 
};

// Colors for the RBS Matrix cells based on DKPPU image
// Format: "CellKey": "tailwind_background_class tailwind_text_class"
export const RBS_MATRIX_CELL_COLORS: Record<string, string> = {
  // Red cells (Critical Risk)
  "5E": "bg-risk-critical text-white", "4E": "bg-risk-critical text-white", "3E": "bg-risk-critical text-white",
  "5D": "bg-risk-critical text-white", "4D": "bg-risk-critical text-white",
  "5C": "bg-risk-critical text-white",
  // Yellow cells (Medium Risk)
  "2E": "bg-risk-medium text-slate-800", "1E": "bg-risk-medium text-slate-800",
  "3D": "bg-risk-medium text-slate-800", "2D": "bg-risk-medium text-slate-800",
  "4C": "bg-risk-medium text-slate-800", "3C": "bg-risk-medium text-slate-800", "2C": "bg-risk-medium text-slate-800",
  "5B": "bg-risk-medium text-slate-800", "4B": "bg-risk-medium text-slate-800", "3B": "bg-risk-medium text-slate-800",
  "5A": "bg-risk-medium text-slate-800", "4A": "bg-risk-medium text-slate-800",
  // Green cells (Low Risk)
  "1D": "bg-risk-low text-white",
  "1C": "bg-risk-low text-white",
  "2B": "bg-risk-low text-white", "1B": "bg-risk-low text-white",
  "3A": "bg-risk-low text-white", "2A": "bg-risk-low text-white", "1A": "bg-risk-low text-white",
  // Default
  "default": "bg-white text-slate-800"
};


export const MOCK_OPERATOR_LOGOS = [
  "https://picsum.photos/seed/garuda/100/50",
  "https://picsum.photos/seed/lionair/100/50",
  "https://picsum.photos/seed/citilink/100/50",
  "https://picsum.photos/seed/sriwijaya/100/50",
  "https://picsum.photos/seed/batikair/100/50",
];

export const FINDING_CATEGORY_OPTIONS = [
  { value: FindingCategoryLevel.LEVEL_1, label: "Level 1 (Non-Compliance) - Target 15 days" },
  { value: FindingCategoryLevel.LEVEL_2, label: "Level 2 (Non-Conformance) - Target 30 days" },
  { value: FindingCategoryLevel.LEVEL_3, label: "Level 3 (Non-Adherence) - Target 60 days" },
];

export const FINDING_CATEGORY_TARGET_DAYS: Record<FindingCategoryLevel, number> = {
  [FindingCategoryLevel.LEVEL_1]: 15,
  [FindingCategoryLevel.LEVEL_2]: 30,
  [FindingCategoryLevel.LEVEL_3]: 60,
};

// Data extracted from PDF Tables 6-1, 6-2, 6-3, 6-4 (Translated to English)
export const PREDEFINED_SURVEILLANCE_AREAS: PredefinedSurveillanceArea[] = [
  // --- TABLE 6-1: Airworthiness Surveillance Area ---
  { id: 'airworthiness-1', itemNumber: '1', areaDescription: 'Management and Administration;', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-15' },
  { id: 'airworthiness-2.1', itemNumber: '2.1', areaDescription: 'Company Aircraft Maintenance Manual', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-32' },
  { id: 'airworthiness-2.2', itemNumber: '2.2', areaDescription: 'Operations Specifications', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-16' }, // Note: Form 120-16 might be general, 120-34 for Opspec
  { id: 'airworthiness-2.3', itemNumber: '2.3', areaDescription: 'Minimum Equipment List (MEL)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-53' },
  { id: 'airworthiness-2.4', itemNumber: '2.4', areaDescription: 'Publications/Library (Airworthiness)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-53' }, // Or general form
  { id: 'airworthiness-3', itemNumber: '3', areaDescription: 'Training Program and Records (Aircraft Maintenance Personnel)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-52' },
  { id: 'airworthiness-4.1', itemNumber: '4.1', areaDescription: 'AD Compliance', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-41' },
  { id: 'airworthiness-4.2', itemNumber: '4.2', areaDescription: 'Aircraft Maintenance Records System', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-42' },
  { id: 'airworthiness-4.3', itemNumber: '4.3', areaDescription: 'Major Repairs and Modifications', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-47' },
  { id: 'airworthiness-5.1', itemNumber: '5.1', areaDescription: 'Maintenance Facilities', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-51' },
  { id: 'airworthiness-5.2', itemNumber: '5.2', areaDescription: 'Refueling and Servicing', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-48' },
  { id: 'airworthiness-6', itemNumber: '6', areaDescription: 'Aircraft Maintenance Contract Arrangements', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-43' },
  { id: 'airworthiness-7', itemNumber: '7', areaDescription: 'Minimum Equipment List (MEL) Management Program', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-54' },
  { id: 'airworthiness-8.1', itemNumber: '8.1', areaDescription: 'Aircraft Maintenance Program (General)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-33' },
  { id: 'airworthiness-8.2', itemNumber: '8.2', areaDescription: 'Aging Aircraft Program', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-49' },
  { id: 'airworthiness-8.3', itemNumber: '8.3', areaDescription: 'Weight and Balance', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-35' },
  { id: 'airworthiness-8.4', itemNumber: '8.4', areaDescription: 'Aircraft Maintenance Inspection System & RII', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-44' },
  { id: 'airworthiness-9', itemNumber: '9', areaDescription: 'Aircraft Maintenance Process Inspection', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-50' },
  { id: 'airworthiness-10.1', itemNumber: '10.1', areaDescription: 'CASP (Continuing Analysis and Surveillance Program)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-45' },
  { id: 'airworthiness-10.2', itemNumber: '10.2', areaDescription: 'Reliability Program', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-36' },
  { id: 'airworthiness-11.1', itemNumber: '11.1', areaDescription: 'SDR Reporting Procedure', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-46' },
  { id: 'airworthiness-11.2', itemNumber: '11.2', areaDescription: 'Mechanical Interruption Summary Report (MISR)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '43-03' },
  { id: 'airworthiness-12', itemNumber: '12', areaDescription: 'Ramp Inspection (Airworthiness)', category: SurveillanceLogCategory.AIRWORTHINESS, defaultFormNumber: '120-13' },

  // --- TABLE 6-2: Aircraft Operations Surveillance Area ---
  { id: 'operations-1', itemNumber: '1', areaDescription: 'Management and Administration (Operations)', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '120-15' },
  { id: 'operations-2.1', itemNumber: '2.1', areaDescription: 'Publications/Library (Operations)', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '120-34' },
  { id: 'operations-2.2', itemNumber: '2.2', areaDescription: 'Operations Manual', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '120-16' },
  { id: 'operations-2.3', itemNumber: '2.3', areaDescription: 'Aircraft Documentation (Operations)', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '120-53' }, // Could also be 8400-19
  { id: 'operations-3', itemNumber: '3', areaDescription: 'Minimum Equipment List (MEL) Management Program (Operations)', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '120-54' },
  { id: 'operations-4', itemNumber: '4', areaDescription: 'Operational Control', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-04' },
  { id: 'operations-5', itemNumber: '5', areaDescription: 'Flight Log / Flight Documentation', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-05' },
  { id: 'operations-6', itemNumber: '6', areaDescription: 'Flight and Duty Time Records', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-06' },
  { id: 'operations-7.a', itemNumber: '7.a', areaDescription: 'Ground Training - Pilot, Cabin Crew, Operations Officer', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-23' }, // Or 8400-21/22
  { id: 'operations-7.b', itemNumber: '7.b', areaDescription: 'Simulator and/or Flight Training - Pilot, Cabin Crew, Operations Officer', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-23' }, // Or 8400-21/22
  { id: 'operations-8', itemNumber: '8', areaDescription: 'Company Check Program (Check Pilot, FA, and FOO)', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-24' }, // Or 8400-25
  { id: 'operations-9', itemNumber: '9', areaDescription: 'Cockpit Enroute Inspection', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-09' },
  { id: 'operations-10', itemNumber: '10', areaDescription: 'Cabin Enroute Inspection', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-10' },
  { id: 'operations-11', itemNumber: '11', areaDescription: 'Station Facilities Inspection', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-11' },
  { id: 'operations-12', itemNumber: '12', areaDescription: 'Route Inspection', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: 'N/A' }, // Form not specified
  { id: 'operations-13', itemNumber: '13', areaDescription: 'Flight Crew Proficiency and Competency Check', category: SurveillanceLogCategory.OPERATIONS, defaultFormNumber: '8400-13' },

  // --- TABLE 6-3: Safety Management System (SMS) Surveillance ---
  { id: 'sms-1', itemNumber: '1', areaDescription: 'Safety Management System (SMS) Manual', category: SurveillanceLogCategory.SMS, defaultFormNumber: '120-90 Part I' },
  { id: 'sms-2', itemNumber: '2', areaDescription: 'SMS Implementation', category: SurveillanceLogCategory.SMS, defaultFormNumber: '120-90 Part II' },
  { id: 'sms-3', itemNumber: '3', areaDescription: 'Flight Data Analysis (FDA) - If Applicable', category: SurveillanceLogCategory.SMS, defaultFormNumber: '120-95' },
  { id: 'sms-4', itemNumber: '4', areaDescription: 'SMS Reporting System', category: SurveillanceLogCategory.SMS, defaultFormNumber: '120-98' },
  { id: 'sms-5', itemNumber: '5', areaDescription: 'Internal Audit Process including Contractors (SMS)', category: SurveillanceLogCategory.SMS, defaultFormNumber: '120-97' },

  // --- TABLE 6-4: Quality Management System (QMS) Surveillance ---
  { id: 'qms-1', itemNumber: '1', areaDescription: 'Quality Assurance Organization and Management', category: SurveillanceLogCategory.QMS, defaultFormNumber: '120-83' },
  { id: 'qms-2', itemNumber: '2', areaDescription: 'Audit Program (QMS)', category: SurveillanceLogCategory.QMS, defaultFormNumber: '120-84' },
  { id: 'qms-3', itemNumber: '3', areaDescription: 'Auditor Training and Qualification Program (QMS)', category: SurveillanceLogCategory.QMS, defaultFormNumber: '120-85' },
  { id: 'qms-4', itemNumber: '4', areaDescription: 'Process for Addressing Findings (QMS)', category: SurveillanceLogCategory.QMS, defaultFormNumber: '120-86' },
  { id: 'qms-5', itemNumber: '5', areaDescription: 'Audit Quality and Records (QMS)', category: SurveillanceLogCategory.QMS, defaultFormNumber: '120-87' },
];
// End of constants.ts file.
