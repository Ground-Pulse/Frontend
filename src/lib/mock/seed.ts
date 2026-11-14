/**
 * Seed data for the in-browser mock backend.
 *
 * Rows here look like database rows (no joined "view" fields). Dates are
 * generated relative to "now" so the demo always has today's jobs, upcoming
 * inspections and a recent history.
 */
import { DEFAULT_TEMPLATES } from "../checklist-templates";
import type {
  AuditLog,
  CheckStatus,
  ChecklistItem,
  ChecklistTemplate,
  InspectionReport,
  InspectionStatus,
  IssueCategory,
  IssueMessage,
  IssueStatus,
  Notification,
  PropertyDocument,
  Repair,
  Role,
  ServiceProvider,
} from "../types";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string; // mock only — the real backend stores a bcrypt hash
  role: Role;
  phone: string | null;
  verified: boolean;
  createdAt: string;
}

export interface PropertyRow {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  type: string;
  coverPhotoUrl: string;
  healthScore: number | null;
  createdAt: string;
  archived: boolean;
}

export interface InspectionRow {
  id: string;
  propertyId: string;
  inspectorId: string | null;
  scheduledDate: string;
  recurrenceRule: string | null;
  status: InspectionStatus;
  startedAt: string | null;
  submittedAt: string | null;
}

export interface IssueRow {
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
}

export interface MockDb {
  version: number;
  users: UserRow[];
  properties: PropertyRow[];
  inspections: InspectionRow[];
  checklistItems: ChecklistItem[];
  reports: InspectionReport[];
  issues: IssueRow[];
  repairs: Repair[];
  providers: ServiceProvider[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  messages: IssueMessage[];
  documents: PropertyDocument[];
  templates: ChecklistTemplate[];
  preferences: Record<string, { notificationChannel: "EMAIL" | "IN_APP" | "BOTH" }>;
}

export const DB_VERSION = 3;

const DAY = 24 * 60 * 60 * 1000;
export const daysFromNow = (n: number, hour = 10) => {
  const d = new Date(Date.now() + n * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
export const dateOnly = (iso: string) => iso.slice(0, 10);

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const PHOTOS = {
  apartment: img("photo-1545324418-cc1a3fa10c00"),
  villa: img("photo-1600585154340-be6161a56a0c"),
  house: img("photo-1568605114967-8130f3a36994"),
  studio: img("photo-1502672260266-1c1ef2d93688"),
  office: img("photo-1497366216548-37526070297c"),
  leak: img("photo-1585704032915-c3400ca199e7"),
  electrical: img("photo-1621905251189-08b45d6a269e"),
  door: img("photo-1558002038-1055907df827"),
  kitchen: img("photo-1556911220-bff31c812dba"),
  bathroom: img("photo-1552321554-5fefe8c9ef14"),
  balcony: img("photo-1600566753086-00f18fb6b3ea"),
  living: img("photo-1586023492125-27b2c045efd7"),
  repairDone: img("photo-1581578731548-c64695cc6952"),
};

let counter = 0;
export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Spread statuses so the computed score lands near the target. */
function statusesForScore(n: number, target: number): CheckStatus[] {
  const lostHalfPoints = Math.round(2 * n * (1 - target / 100));
  let fail = Math.floor(lostHalfPoints / 3);
  let attention = lostHalfPoints - 2 * fail;
  while (fail + attention > n) {
    attention--;
  }
  fail = Math.max(0, fail);
  const out: CheckStatus[] = Array(n).fill("PASS");
  // spread non-pass items through the list so they hit different rooms
  const positions = Array.from({ length: n }, (_, i) => (i * 7 + 3) % n);
  let p = 0;
  for (let i = 0; i < fail; i++) out[positions[p++]] = "FAIL";
  for (let i = 0; i < attention; i++) out[positions[p++]] = "ATTENTION";
  return out;
}

export function scoreFromItems(items: Pick<ChecklistItem, "status">[]) {
  if (!items.length) return 0;
  const points = items.reduce(
    (sum, i) => sum + (i.status === "PASS" ? 1 : i.status === "ATTENTION" ? 0.5 : 0),
    0
  );
  return Math.round((points / items.length) * 100);
}

export function createSeed(): MockDb {
  const now = new Date().toISOString();
  const users: UserRow[] = [
    { id: "u_priya", name: "Priya Sharma", email: "priya@example.com", password: "password123", role: "OWNER", phone: "+971 50 123 4567", verified: true, createdAt: daysFromNow(-200) },
    { id: "u_arvind", name: "Arvind Rao", email: "arvind@example.com", password: "password123", role: "OWNER", phone: "+91 98450 11223", verified: true, createdAt: daysFromNow(-160) },
    { id: "u_ravi", name: "Ravi Kumar", email: "ravi@example.com", password: "password123", role: "INSPECTOR", phone: "+91 99000 22110", verified: true, createdAt: daysFromNow(-300) },
    { id: "u_meera", name: "Meera Iyer", email: "meera@example.com", password: "password123", role: "INSPECTOR", phone: "+91 98201 33445", verified: true, createdAt: daysFromNow(-250) },
    { id: "u_karan", name: "Karan Mehta", email: "karan@example.com", password: "password123", role: "INSPECTOR", phone: "+91 98111 77889", verified: false, createdAt: daysFromNow(-2) },
    { id: "u_admin", name: "Anita Desai", email: "admin@groundpulse.in", password: "password123", role: "ADMIN", phone: null, verified: true, createdAt: daysFromNow(-400) },
    { id: "u_suresh", name: "Suresh Plumbing Works", email: "suresh@example.com", password: "password123", role: "PROVIDER", phone: "+91 98860 44556", verified: true, createdAt: daysFromNow(-280) },
    { id: "u_imran", name: "Volt Electricals (Imran)", email: "imran@example.com", password: "password123", role: "PROVIDER", phone: "+91 97400 66778", verified: true, createdAt: daysFromNow(-260) },
    { id: "u_deepa", name: "SecureHome Locks (Deepa)", email: "deepa@example.com", password: "password123", role: "PROVIDER", phone: "+91 96320 99001", verified: true, createdAt: daysFromNow(-240) },
    { id: "u_ganesh", name: "Ganesh Plumbing Mumbai", email: "ganesh@example.com", password: "password123", role: "PROVIDER", phone: "+91 98190 12121", verified: true, createdAt: daysFromNow(-220) },
    { id: "u_joseph", name: "CleanPro Services (Joseph)", email: "joseph@example.com", password: "password123", role: "PROVIDER", phone: "+91 98670 34343", verified: false, createdAt: daysFromNow(-1) },
  ];

  const providers: ServiceProvider[] = [
    { id: "sp_suresh", userId: "u_suresh", serviceTypes: ["Plumbing", "General Repairs"], locality: "Bengaluru", verified: true, rating: 4.6 },
    { id: "sp_imran", userId: "u_imran", serviceTypes: ["Electrical"], locality: "Bengaluru", verified: true, rating: 4.8 },
    { id: "sp_deepa", userId: "u_deepa", serviceTypes: ["Security", "General Repairs"], locality: "Mumbai", verified: true, rating: 4.3 },
    { id: "sp_ganesh", userId: "u_ganesh", serviceTypes: ["Plumbing"], locality: "Mumbai", verified: true, rating: 4.0 },
    { id: "sp_joseph", userId: "u_joseph", serviceTypes: ["Cleaning", "Pest Control"], locality: "Bengaluru", verified: false, rating: null },
  ];

  const properties: PropertyRow[] = [
    { id: "p_lakeside", ownerId: "u_priya", name: "Lakeside Apartment", address: "Flat 1204, Prestige Lakeside Habitat, Whitefield", city: "Bengaluru", type: "Apartment", coverPhotoUrl: PHOTOS.apartment, healthScore: null, createdAt: daysFromNow(-190), archived: false },
    { id: "p_sarjapur", ownerId: "u_priya", name: "Sarjapur Family Villa", address: "Villa 22, Brigade Meadows, Sarjapur Road", city: "Bengaluru", type: "Villa", coverPhotoUrl: PHOTOS.villa, healthScore: null, createdAt: daysFromNow(-185), archived: false },
    { id: "p_andheri", ownerId: "u_arvind", name: "Andheri 2BHK (Unit 3)", address: "B-704, Oberoi Springs, Andheri West", city: "Mumbai", type: "Apartment", coverPhotoUrl: PHOTOS.living, healthScore: null, createdAt: daysFromNow(-150), archived: false },
    { id: "p_powai", ownerId: "u_arvind", name: "Powai Studio (Unit 5)", address: "1102, Hiranandani Gardens, Powai", city: "Mumbai", type: "Apartment", coverPhotoUrl: PHOTOS.studio, healthScore: null, createdAt: daysFromNow(-150), archived: false },
    { id: "p_koramangala", ownerId: "u_arvind", name: "Koramangala House", address: "No. 14, 5th Block, Koramangala", city: "Bengaluru", type: "Independent House", coverPhotoUrl: PHOTOS.house, healthScore: null, createdAt: daysFromNow(-140), archived: false },
  ];

  const inspections: InspectionRow[] = [];
  const checklistItems: ChecklistItem[] = [];
  const reports: InspectionReport[] = [];
  const itemPhotos = [PHOTOS.kitchen, PHOTOS.bathroom, PHOTOS.living, PHOTOS.balcony, PHOTOS.door];

  function addInspection(opts: {
    id: string;
    propertyId: string;
    inspectorId: string | null;
    day: number;
    status: InspectionStatus;
    recurrence?: string | null;
    targetScore?: number;
  }) {
    const prop = properties.find((p) => p.id === opts.propertyId)!;
    const template = DEFAULT_TEMPLATES[prop.type] ?? DEFAULT_TEMPLATES.Apartment;
    const statuses =
      opts.status === "SUBMITTED" ? statusesForScore(template.length, opts.targetScore ?? 85) : [];
    const scheduledDate = daysFromNow(opts.day);
    inspections.push({
      id: opts.id,
      propertyId: opts.propertyId,
      inspectorId: opts.inspectorId,
      scheduledDate,
      recurrenceRule: opts.recurrence ?? null,
      status: opts.status,
      startedAt: opts.status !== "SCHEDULED" ? daysFromNow(opts.day, 11) : null,
      submittedAt: opts.status === "SUBMITTED" ? daysFromNow(opts.day, 13) : null,
    });
    const items = template.map<ChecklistItem>((t, idx) => ({
      id: `${opts.id}_ci${idx}`,
      inspectionId: opts.id,
      roomArea: t.roomArea,
      itemName: t.itemName,
      status: opts.status === "SUBMITTED" ? statuses[idx] : null,
      mediaUrls: opts.status === "SUBMITTED" && idx % 3 === 0 ? [itemPhotos[idx % itemPhotos.length]] : [],
      notes:
        opts.status === "SUBMITTED" && statuses[idx] !== "PASS"
          ? statuses[idx] === "FAIL"
            ? "Needs repair — see flagged issue."
            : "Minor wear, monitor next visit."
          : null,
    }));
    checklistItems.push(...items);
    if (opts.status === "SUBMITTED") {
      const score = scoreFromItems(items);
      reports.push({
        id: `rep_${opts.id}`,
        inspectionId: opts.id,
        generatedAt: daysFromNow(opts.day, 15),
        summaryUrl: null,
        healthScore: score,
        passCount: items.filter((i) => i.status === "PASS").length,
        attentionCount: items.filter((i) => i.status === "ATTENTION").length,
        failCount: items.filter((i) => i.status === "FAIL").length,
      });
      prop.healthScore = score; // later inspections overwrite (called in date order)
    }
  }

  const history: Record<string, number[]> = {
    p_lakeside: [72, 75, 70, 79, 82, 86],
    p_sarjapur: [80, 76, 71, 68, 64, 62],
    p_andheri: [66, 70, 74, 78],
    p_powai: [88, 85, 90, 92],
    p_koramangala: [58, 63, 69],
  };
  const inspectorFor: Record<string, string> = {
    p_lakeside: "u_ravi",
    p_sarjapur: "u_ravi",
    p_andheri: "u_meera",
    p_powai: "u_meera",
    p_koramangala: "u_ravi",
  };
  for (const [pid, scores] of Object.entries(history)) {
    scores.forEach((s, i) => {
      const day = -((scores.length - i) * 30) + 6; // monthly, most recent ~24 days ago
      addInspection({
        id: `ins_${pid}_${i}`,
        propertyId: pid,
        inspectorId: inspectorFor[pid],
        day,
        status: "SUBMITTED",
        recurrence: "FREQ=MONTHLY",
        targetScore: s,
      });
    });
  }

  // Upcoming / active jobs
  addInspection({ id: "ins_today_sarjapur", propertyId: "p_sarjapur", inspectorId: "u_ravi", day: 0, status: "SCHEDULED", recurrence: "FREQ=MONTHLY" });
  addInspection({ id: "ins_lakeside_next", propertyId: "p_lakeside", inspectorId: "u_ravi", day: 5, status: "SCHEDULED", recurrence: "FREQ=MONTHLY" });
  addInspection({ id: "ins_koramangala_next", propertyId: "p_koramangala", inspectorId: "u_ravi", day: 9, status: "SCHEDULED", recurrence: null });
  addInspection({ id: "ins_andheri_next", propertyId: "p_andheri", inspectorId: "u_meera", day: 1, status: "SCHEDULED", recurrence: "FREQ=MONTHLY;INTERVAL=3" });
  addInspection({ id: "ins_powai_next", propertyId: "p_powai", inspectorId: null, day: 3, status: "SCHEDULED", recurrence: null });

  const latest = (pid: string) => `ins_${pid}_${history[pid].length - 1}`;

  const issues: IssueRow[] = [
    { id: "iss_leak_sarjapur", inspectionId: latest("p_sarjapur"), propertyId: "p_sarjapur", category: "LEAK", description: "Water seepage spreading on the master bedroom ceiling, below the terrace drain. Patch is ~60cm wide and damp to touch.", mediaUrls: [PHOTOS.leak, PHOTOS.bathroom], status: "FLAGGED", flaggedBy: "u_ravi", decisionReason: null, createdAt: daysFromNow(-24, 13) },
    { id: "iss_elec_sarjapur", inspectionId: latest("p_sarjapur"), propertyId: "p_sarjapur", category: "ELECTRICAL", description: "Main MCB trips whenever the bathroom geyser is switched on. Likely a faulty geyser element or earth leakage.", mediaUrls: [PHOTOS.electrical], status: "APPROVED", flaggedBy: "u_ravi", decisionReason: null, createdAt: daysFromNow(-24, 13) },
    { id: "iss_clean_lakeside", inspectionId: latest("p_lakeside"), propertyId: "p_lakeside", category: "CLEANLINESS", description: "Balcony drain blocked with leaves; standing water after rain could seep into the living room.", mediaUrls: [PHOTOS.balcony], status: "FLAGGED", flaggedBy: "u_ravi", decisionReason: null, createdAt: daysFromNow(-24, 13) },
    { id: "iss_sec_andheri", inspectionId: latest("p_andheri"), propertyId: "p_andheri", category: "SECURITY", description: "Main door deadbolt is loose and does not fully engage. Door can be pushed open when only the latch is used.", mediaUrls: [PHOTOS.door], status: "APPROVED", flaggedBy: "u_meera", decisionReason: null, createdAt: daysFromNow(-24, 13) },
    { id: "iss_leak_powai", inspectionId: `ins_p_powai_2`, propertyId: "p_powai", category: "LEAK", description: "Kitchen sink trap leaking slowly into the cabinet below.", mediaUrls: [PHOTOS.kitchen], status: "CLOSED", flaggedBy: "u_meera", decisionReason: null, createdAt: daysFromNow(-54, 13) },
    { id: "iss_other_kora", inspectionId: latest("p_koramangala"), propertyId: "p_koramangala", category: "OTHER", description: "Paint peeling on the north-facing compound wall. Cosmetic only.", mediaUrls: [PHOTOS.house], status: "DECLINED", flaggedBy: "u_ravi", decisionReason: "Cosmetic — will repaint when tenant changes next year.", createdAt: daysFromNow(-24, 13) },
  ];

  const repairs: Repair[] = [
    { id: "rep_elec_sarjapur", issueId: "iss_elec_sarjapur", providerId: "sp_imran", status: "IN_PROGRESS", costEstimate: 2800, completionNotes: null, completionPhotos: [], ownerRating: null, createdAt: daysFromNow(-23), updatedAt: daysFromNow(-2) },
    { id: "rep_sec_andheri", issueId: "iss_sec_andheri", providerId: null, status: "REQUESTED", costEstimate: null, completionNotes: null, completionPhotos: [], ownerRating: null, createdAt: daysFromNow(-1), updatedAt: daysFromNow(-1) },
    { id: "rep_leak_powai", issueId: "iss_leak_powai", providerId: "sp_ganesh", status: "COMPLETED", costEstimate: 1200, completionNotes: "Replaced the sink trap and the waste pipe washer. Ran water for 15 minutes — no leak.", completionPhotos: [PHOTOS.repairDone], ownerRating: 4, createdAt: daysFromNow(-53), updatedAt: daysFromNow(-48) },
  ];

  const audit = (entityType: AuditLog["entityType"], entityId: string, action: string, actorId: string, day: number, metadata: Record<string, unknown> = {}): AuditLog => ({
    id: uid("al"),
    entityType,
    entityId,
    action,
    actorId,
    actorName: users.find((u) => u.id === actorId)?.name ?? "System",
    metadata,
    timestamp: daysFromNow(day, 14),
  });

  const auditLogs: AuditLog[] = [
    ...issues.map((i) => audit("Issue", i.id, "FLAGGED", i.flaggedBy, i.id === "iss_leak_powai" ? -54 : -24, { category: i.category })),
    audit("Issue", "iss_elec_sarjapur", "APPROVED", "u_priya", -23),
    audit("Repair", "rep_elec_sarjapur", "CREATED", "u_priya", -23, { status: "REQUESTED" }),
    audit("Repair", "rep_elec_sarjapur", "ASSIGNED", "u_admin", -20, { providerId: "sp_imran", from: "REQUESTED", to: "ASSIGNED" }),
    audit("Repair", "rep_elec_sarjapur", "STATUS_CHANGED", "u_imran", -2, { from: "ASSIGNED", to: "IN_PROGRESS", costEstimate: 2800 }),
    audit("Issue", "iss_sec_andheri", "APPROVED", "u_arvind", -1),
    audit("Repair", "rep_sec_andheri", "CREATED", "u_arvind", -1, { status: "REQUESTED" }),
    audit("Issue", "iss_leak_powai", "APPROVED", "u_arvind", -53),
    audit("Repair", "rep_leak_powai", "ASSIGNED", "u_admin", -52, { providerId: "sp_ganesh" }),
    audit("Repair", "rep_leak_powai", "STATUS_CHANGED", "u_ganesh", -50, { from: "ASSIGNED", to: "IN_PROGRESS" }),
    audit("Repair", "rep_leak_powai", "COMPLETED", "u_ganesh", -48, { from: "IN_PROGRESS", to: "COMPLETED" }),
    audit("Issue", "iss_other_kora", "DECLINED", "u_arvind", -22, { reason: "Cosmetic — will repaint when tenant changes next year." }),
  ];

  const note = (userId: string, type: Notification["type"], title: string, body: string, href: string, day: number, read = false): Notification => ({
    id: uid("n"),
    userId,
    type,
    payload: { title, body, href },
    read,
    createdAt: daysFromNow(day, 15),
  });

  const notifications: Notification[] = [
    note("u_priya", "REPORT_READY", "Inspection report ready", "Your Sarjapur Family Villa report is ready — health score 62.", `/report/${latest("p_sarjapur")}`, -24, true),
    note("u_priya", "ISSUE_FLAGGED", "Issue flagged: water leak", "Ravi flagged a leak at Sarjapur Family Villa. Review and approve or decline.", "/issue/iss_leak_sarjapur", -24),
    note("u_priya", "ISSUE_FLAGGED", "Issue flagged: cleanliness", "Balcony drain blocked at Lakeside Apartment.", "/issue/iss_clean_lakeside", -24),
    note("u_priya", "REPAIR_STATUS_UPDATED", "Repair in progress", "Volt Electricals started work on the MCB tripping issue.", "/issue/iss_elec_sarjapur", -2),
    note("u_priya", "INSPECTION_ASSIGNED", "Inspector assigned", "Ravi Kumar will inspect Sarjapur Family Villa today.", "/property/p_sarjapur", -3, true),
    note("u_arvind", "REPAIR_STATUS_UPDATED", "Repair requested", "Your approval was sent to the admin team to assign a verified locksmith.", "/issue/iss_sec_andheri", -1),
    note("u_ravi", "INSPECTION_ASSIGNED", "New job assigned", "Sarjapur Family Villa — today.", "/inspection/ins_today_sarjapur/checklist", -3),
    note("u_admin", "REPAIR_REQUESTED", "Repair needs a provider", "Owner approved a SECURITY repair at Andheri 2BHK.", "/admin/reassign", -1),
    note("u_admin", "ACCOUNT_VERIFIED", "New verification request", "Karan Mehta signed up as an inspector.", "/admin/verification", -2),
    note("u_imran", "JOB_ASSIGNED", "New job assigned", "MCB tripping at Sarjapur Family Villa, Bengaluru.", "/provider/jobs", -20, true),
  ];

  const messages: IssueMessage[] = [
    { id: uid("m"), issueId: "iss_elec_sarjapur", authorId: "u_imran", authorName: "Volt Electricals (Imran)", authorRole: "PROVIDER", body: "Visited today. Geyser element has a short to earth — replacing it tomorrow. Estimate ₹2,800 incl. part.", createdAt: daysFromNow(-2, 16) },
    { id: uid("m"), issueId: "iss_elec_sarjapur", authorId: "u_priya", authorName: "Priya Sharma", authorRole: "OWNER", body: "Thanks Imran, please go ahead. Share a photo once done.", createdAt: daysFromNow(-2, 18) },
  ];

  const documents: PropertyDocument[] = [
    { id: uid("doc"), propertyId: "p_lakeside", name: "Sale deed.pdf", kind: "DEED", url: "#", sizeBytes: 2_340_000, uploadedAt: daysFromNow(-180) },
    { id: uid("doc"), propertyId: "p_lakeside", name: "Home insurance 2026.pdf", kind: "INSURANCE", url: "#", sizeBytes: 640_000, uploadedAt: daysFromNow(-90) },
  ];

  const templates: ChecklistTemplate[] = Object.entries(DEFAULT_TEMPLATES).map(([propertyType, items]) => ({
    id: `tpl_${propertyType.toLowerCase().replace(/\s+/g, "_")}`,
    propertyType,
    items,
    updatedAt: now,
  }));

  return {
    version: DB_VERSION,
    users,
    properties,
    inspections,
    checklistItems,
    reports,
    issues,
    repairs,
    providers,
    notifications,
    auditLogs,
    messages,
    documents,
    templates,
    preferences: {},
  };
}
