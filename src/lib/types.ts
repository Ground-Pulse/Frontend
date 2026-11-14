/**
 * Shared TypeScript types for the GroundPulse frontend.
 *
 * These mirror the API Specification (API-WEB-01) and the database design
 * (users, properties, inspections, checklist_items, inspection_reports,
 * issues, repairs, service_providers, notifications, audit_logs).
 *
 * A few fields marked "view field" are joined in by the API so screens don't
 * need a second request (e.g. propertyAddress on an Inspection).
 */

export type Role = "OWNER" | "INSPECTOR" | "ADMIN" | "PROVIDER";

export type InspectionStatus = "SCHEDULED" | "IN_PROGRESS" | "SUBMITTED";
export type CheckStatus = "PASS" | "FAIL" | "ATTENTION";
export type IssueStatus = "FLAGGED" | "APPROVED" | "DECLINED" | "CLOSED";
export type IssueCategory = "LEAK" | "ELECTRICAL" | "SECURITY" | "CLEANLINESS" | "OTHER";
export type RepairStatus = "REQUESTED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
export type Recurrence = "NONE" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
export type NotificationType =
  | "REPORT_READY"
  | "ISSUE_FLAGGED"
  | "REPAIR_STATUS_UPDATED"
  | "INSPECTION_ASSIGNED"
  | "INSPECTION_SCHEDULED"
  | "REPAIR_REQUESTED"
  | "JOB_ASSIGNED"
  | "ACCOUNT_VERIFIED"
  | "NEW_MESSAGE";
export type NotificationChannel = "EMAIL" | "IN_APP" | "BOTH";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  /** Inspectors and providers must be verified by an admin before assignment. */
  verified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  /** Provider-only fields */
  serviceTypes?: string[];
  locality?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  type: string;
  coverPhotoUrl: string;
  healthScore: number | null;
  createdAt: string;
  /** view fields */
  lastInspectionDate: string | null;
  nextInspectionDate: string | null;
  openIssueCount: number;
  ownerName?: string;
}

export interface CreatePropertyInput {
  name: string;
  address: string;
  city: string;
  type: string;
  coverPhotoUrl: string;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export interface Inspection {
  id: string;
  propertyId: string;
  inspectorId: string | null;
  scheduledDate: string;
  recurrenceRule: string | null;
  status: InspectionStatus;
  startedAt: string | null;
  submittedAt: string | null;
  /** view fields */
  propertyName: string;
  propertyAddress: string;
  inspectorName: string | null;
  itemsTotal: number;
  itemsDone: number;
  issueCount: number;
  reportId: string | null;
}

export interface InspectionDetail extends Inspection {
  checklistItems: ChecklistItem[];
  issues: Issue[];
  report: InspectionReport | null;
}

export interface ChecklistItem {
  id: string;
  inspectionId: string;
  roomArea: string;
  itemName: string;
  status: CheckStatus | null;
  mediaUrls: string[];
  notes: string | null;
}

export interface ScheduleInspectionInput {
  propertyId: string;
  scheduledDate: string;
  recurrenceRule?: string;
}

export interface SaveChecklistDraftInput {
  items: Array<Pick<ChecklistItem, "id" | "status" | "mediaUrls" | "notes">>;
}

export interface InspectionReport {
  id: string;
  inspectionId: string;
  generatedAt: string;
  summaryUrl: string | null;
  healthScore: number;
  passCount: number;
  attentionCount: number;
  failCount: number;
}

export interface Issue {
  id: string;
  inspectionId: string;
  propertyId: string;
  category: IssueCategory;
  description: string;
  mediaUrls: string[];
  status: IssueStatus;
  flaggedBy: string;
  decisionReason: string | null;
  createdAt: string;
  /** view fields */
  propertyName: string;
  propertyAddress: string;
  flaggedByName: string;
  repairId: string | null;
}

export interface IssueDetail extends Issue {
  repair: RepairWithContext | null;
  auditTrail: AuditLog[];
  messages: IssueMessage[];
}

export interface FlagIssueInput {
  inspectionId: string;
  category: IssueCategory;
  description: string;
  mediaUrls: string[];
}

export interface Repair {
  id: string;
  issueId: string;
  providerId: string | null;
  status: RepairStatus;
  costEstimate: number | null;
  completionNotes: string | null;
  completionPhotos: string[];
  ownerRating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RepairWithContext extends Repair {
  issueCategory: IssueCategory;
  issueDescription: string;
  issueMediaUrls: string[];
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  provider: ServiceProviderProfile | null;
}

export interface CompleteRepairInput {
  completionNotes: string;
  completionPhotos?: string[];
}

export interface ServiceProvider {
  id: string;
  userId: string;
  serviceTypes: string[];
  locality: string;
  verified: boolean;
  rating: number | null;
}

export interface ServiceProviderProfile extends ServiceProvider {
  name: string;
  email: string;
  phone: string | null;
  completedJobs: number;
}

export interface InspectorProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  verified: boolean;
  activeJobs: number;
}

export interface AdminDashboardSummary {
  activeProperties: number;
  pendingInspections: number;
  openIssues: number;
  inProgressRepairs: number;
  pendingVerifications: number;
  requestedRepairs: number;
}

export interface VerificationRequest {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  role: "INSPECTOR" | "PROVIDER";
  serviceTypes: string[];
  locality: string | null;
  createdAt: string;
}

export interface ReassignInput {
  kind: "INSPECTION" | "REPAIR";
  id: string;
  assigneeId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: {
    title: string;
    body: string;
    href?: string;
    [key: string]: unknown;
  };
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityType: "Property" | "Inspection" | "Issue" | "Repair" | "User";
  entityId: string;
  action: string;
  actorId: string;
  actorName: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface IssueMessage {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  body: string;
  createdAt: string;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  kind: "DEED" | "INSURANCE" | "UTILITY" | "OTHER";
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface ChecklistTemplate {
  id: string;
  propertyType: string;
  items: Array<{ roomArea: string; itemName: string }>;
  updatedAt: string;
}

export interface HealthPoint {
  date: string;
  score: number;
}

/** Socket.IO event payloads (API spec section 7). */
export interface RealtimeEvents {
  "repair.status.updated": { repairId: string; status: RepairStatus; issueId: string };
  "issue.flagged": { issueId: string; propertyId: string };
  "report.ready": { inspectionId: string; reportUrl: string; propertyId: string };
  "notification.new": Notification;
  "inspection.updated": { inspectionId: string; status: InspectionStatus };
  "dashboard.changed": Record<string, never>;
}
