/**
 * Shared TypeScript types for the GroundPulse frontend.
 *
 * These mirror the entities in the PRD (Section 4 — User Stories) and the
 * database tables the backend will expose:
 * users, properties, inspections, checklist_items, issues, repairs.
 *
 * Keeping them in one file means the dashboards, the mock API and (later)
 * the real NestJS API all agree on the same shape of data.
 */

export type Role = "OWNER" | "INSPECTOR" | "ADMIN";

export type InspectionStatus = "SCHEDULED" | "IN_PROGRESS" | "SUBMITTED";

export type IssueStatus = "FLAGGED" | "APPROVED" | "DECLINED" | "CLOSED";

export type IssueCategory =
  | "LEAK"
  | "ELECTRICAL"
  | "SECURITY"
  | "CLEANLINESS"
  | "OTHER";

/** PASS / FAIL / ATTENTION — the three states of one checklist row (US-004). */
export type CheckStatus = "PASS" | "FAIL" | "ATTENTION";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Property {
  id: string;
  ownerId: string;
  address: string;
  type: string; // "Apartment" | "Villa" | "Plot" ...
  coverPhoto: string; // emoji placeholder until S3 upload is wired up
  healthScore: number; // 0-100, recomputed after every inspection (S-013)
  lastInspection: string | null; // ISO date
  openIssues: number;
}

export interface Inspection {
  id: string;
  propertyId: string;
  propertyAddress: string;
  inspectorName: string | null;
  scheduledDate: string; // ISO date
  status: InspectionStatus;
  itemsTotal: number;
  itemsDone: number;
}

export interface Issue {
  id: string;
  propertyId: string;
  propertyAddress: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  createdAt: string; // ISO date
  photos: number;
}

export interface ChecklistItem {
  id: string;
  roomArea: string; // "Kitchen", "Bedroom 1" ...
  itemName: string; // "Sink & Plumbing"
  status: CheckStatus | null; // null until the inspector marks it
  photos: number;
}

/** One point on the owner dashboard health-score chart (Recharts). */
export interface HealthPoint {
  month: string;
  score: number;
}
