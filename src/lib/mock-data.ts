/**
 * Mock data for the frontend demo.
 *
 * My teammate is building the real NestJS + Prisma + PostgreSQL backend.
 * Until those endpoints exist, every screen reads from this file so the UI
 * can be built, demoed and reviewed independently of the backend.
 *
 * When the API is ready, only src/lib/api.ts changes — the components do not.
 */
import type {
  ChecklistItem,
  HealthPoint,
  Inspection,
  Issue,
  Property,
} from "./types";

export const properties: Property[] = [
  {
    id: "p1",
    ownerId: "u1",
    address: "Prestige Lakeside, Whitefield, Bengaluru",
    type: "Apartment",
    coverPhoto: "🏢",
    healthScore: 86,
    lastInspection: "2026-10-04",
    openIssues: 1,
  },
  {
    id: "p2",
    ownerId: "u1",
    address: "Brigade Meadows Villa, Sarjapur Road, Bengaluru",
    type: "Villa",
    coverPhoto: "🏡",
    healthScore: 62,
    lastInspection: "2026-09-28",
    openIssues: 3,
  },
  {
    id: "p3",
    ownerId: "u1",
    address: "Plot 44, Devanahalli, Bengaluru",
    type: "Plot",
    coverPhoto: "🌾",
    healthScore: 94,
    lastInspection: "2026-10-01",
    openIssues: 0,
  },
];

export const inspections: Inspection[] = [
  {
    id: "i1",
    propertyId: "p1",
    propertyAddress: "Prestige Lakeside, Whitefield",
    inspectorName: "Ravi Kumar",
    scheduledDate: "2026-10-13",
    status: "SCHEDULED",
    itemsTotal: 42,
    itemsDone: 0,
  },
  {
    id: "i2",
    propertyId: "p2",
    propertyAddress: "Brigade Meadows Villa, Sarjapur Road",
    inspectorName: "Ravi Kumar",
    scheduledDate: "2026-10-13",
    status: "IN_PROGRESS",
    itemsTotal: 42,
    itemsDone: 18,
  },
  {
    id: "i3",
    propertyId: "p3",
    propertyAddress: "Plot 44, Devanahalli",
    inspectorName: "Ravi Kumar",
    scheduledDate: "2026-10-01",
    status: "SUBMITTED",
    itemsTotal: 28,
    itemsDone: 28,
  },
];

export const issues: Issue[] = [
  {
    id: "is1",
    propertyId: "p2",
    propertyAddress: "Brigade Meadows Villa, Sarjapur Road",
    category: "LEAK",
    description: "Water seepage spreading on the master bedroom ceiling.",
    status: "FLAGGED",
    createdAt: "2026-09-28",
    photos: 3,
  },
  {
    id: "is2",
    propertyId: "p2",
    propertyAddress: "Brigade Meadows Villa, Sarjapur Road",
    category: "ELECTRICAL",
    description: "MCB in the main board trips when the geyser is switched on.",
    status: "APPROVED",
    createdAt: "2026-09-28",
    photos: 2,
  },
  {
    id: "is3",
    propertyId: "p1",
    propertyAddress: "Prestige Lakeside, Whitefield",
    category: "CLEANLINESS",
    description: "Balcony drain blocked with leaves, water standing.",
    status: "FLAGGED",
    createdAt: "2026-10-04",
    photos: 1,
  },
];

/** The checklist the inspector fills on site (US-004). */
export const checklist: ChecklistItem[] = [
  { id: "c1", roomArea: "Entrance", itemName: "Main door & lock", status: "PASS", photos: 1 },
  { id: "c2", roomArea: "Living Room", itemName: "Walls & ceiling", status: "PASS", photos: 2 },
  { id: "c3", roomArea: "Living Room", itemName: "Windows & grills", status: "ATTENTION", photos: 1 },
  { id: "c4", roomArea: "Kitchen", itemName: "Sink & plumbing", status: "FAIL", photos: 3 },
  { id: "c5", roomArea: "Kitchen", itemName: "Electrical points", status: "PASS", photos: 1 },
  { id: "c6", roomArea: "Bedroom 1", itemName: "Seepage check", status: null, photos: 0 },
  { id: "c7", roomArea: "Bedroom 1", itemName: "Fan & lights", status: null, photos: 0 },
  { id: "c8", roomArea: "Utility", itemName: "Electricity meter reading", status: null, photos: 0 },
];

/** Health score trend shown on the owner dashboard chart (Recharts). */
export const healthTrend: HealthPoint[] = [
  { month: "May", score: 71 },
  { month: "Jun", score: 74 },
  { month: "Jul", score: 69 },
  { month: "Aug", score: 78 },
  { month: "Sep", score: 81 },
  { month: "Oct", score: 86 },
];
