/**
 * In-browser mock of the GroundPulse NestJS API.
 *
 * It implements the same REST contract as API-WEB-01 and enforces the same
 * business rules the backend must enforce (role scoping, verified-only
 * assignment, repair state machine, audit log on every state change,
 * notification fan-out, async report generation). The data lives in
 * localStorage so it survives reloads.
 *
 * This file is only used when NEXT_PUBLIC_USE_MOCK_API is not "false".
 */
import { DEFAULT_TEMPLATES } from "../checklist-templates";
import { GroundPulseError, type GroundPulseErrorCode } from "../errors";
import type {
  AdminDashboardSummary,
  AuditLog,
  AuthResponse,
  CreatePropertyInput,
  FlagIssueInput,
  HealthPoint,
  Inspection,
  InspectionDetail,
  InspectorProfile,
  Issue,
  IssueDetail,
  Notification,
  NotificationType,
  Property,
  PropertyDocument,
  RegisterInput,
  Repair,
  RepairStatus,
  RepairWithContext,
  Role,
  SaveChecklistDraftInput,
  ScheduleInspectionInput,
  ServiceProviderProfile,
  User,
  VerificationRequest,
} from "../types";
import { mockBus } from "./bus";
import {
  createSeed,
  DB_VERSION,
  scoreFromItems,
  uid,
  type InspectionRow,
  type IssueRow,
  type MockDb,
  type PropertyRow,
  type UserRow,
} from "./seed";

const STORAGE_KEY = "gp_mock_db";

// ---------------------------------------------------------------- storage

let memoryDb: MockDb | null = null;

function load(): MockDb {
  if (typeof window === "undefined") {
    memoryDb ??= createSeed();
    return memoryDb;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb;
      if (parsed.version === DB_VERSION) return parsed;
    }
  } catch {
    /* fall through to a fresh seed */
  }
  const seed = createSeed();
  save(seed);
  return seed;
}

function save(db: MockDb) {
  if (typeof window === "undefined") {
    memoryDb = db;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Quota exceeded (large photos). Drop the oldest notifications and retry.
    db.notifications = db.notifications.slice(-50);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      throw fail("UNKNOWN", "Browser storage is full. Reset the demo data from Settings.", 507);
    }
  }
}

export function resetMockDb() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  memoryDb = null;
}

// ---------------------------------------------------------------- helpers

function fail(code: GroundPulseErrorCode, message: string, status: number) {
  return new GroundPulseError(code, message, status);
}

const nowIso = () => new Date().toISOString();

function publicUser(u: UserRow): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    verified: u.verified,
    createdAt: u.createdAt,
  };
}

function issueTokens(u: UserRow): AuthResponse {
  return {
    accessToken: `mock-access.${u.id}.${Date.now()}`,
    refreshToken: `mock-refresh.${u.id}`,
    user: publicUser(u),
  };
}

function userFromToken(db: MockDb, token: string | null): UserRow | null {
  if (!token) return null;
  const id = token.split(".")[1];
  return db.users.find((u) => u.id === id) ?? null;
}

interface Ctx {
  db: MockDb;
  user: UserRow;
  params: Record<string, string>;
  query: URLSearchParams;
  body: Record<string, unknown>;
}

function requireRole(ctx: Ctx, ...roles: Role[]) {
  if (!roles.includes(ctx.user.role)) {
    throw fail("FORBIDDEN", "You don't have permission to do that.", 403);
  }
}

function writeAudit(ctx: Ctx, entityType: AuditLog["entityType"], entityId: string, action: string, metadata: Record<string, unknown> = {}) {
  ctx.db.auditLogs.push({
    id: uid("al"),
    entityType,
    entityId,
    action,
    actorId: ctx.user.id,
    actorName: ctx.user.name,
    metadata,
    timestamp: nowIso(),
  });
}

function notify(db: MockDb, userId: string, type: NotificationType, title: string, body: string, href?: string) {
  const n: Notification = {
    id: uid("n"),
    userId,
    type,
    payload: { title, body, href },
    read: false,
    createdAt: nowIso(),
  };
  db.notifications.push(n);
  mockBus.emit(`user:${userId}`, "notification.new", n);
}

function emit(userIds: (string | null | undefined)[], event: string, payload: unknown) {
  new Set(userIds.filter(Boolean) as string[]).forEach((id) => mockBus.emit(`user:${id}`, event, payload));
}

const adminIds = (db: MockDb) => db.users.filter((u) => u.role === "ADMIN").map((u) => u.id);

// ------------------------------------------------------------ view builders

function getProperty(db: MockDb, id: string) {
  const p = db.properties.find((x) => x.id === id);
  if (!p) throw fail("PROPERTY_NOT_FOUND", "Property not found.", 404);
  return p;
}

function assertCanSeeProperty(ctx: Ctx, p: PropertyRow) {
  if (ctx.user.role === "ADMIN") return;
  if (ctx.user.role === "OWNER" && p.ownerId === ctx.user.id) return;
  if (ctx.user.role === "INSPECTOR" && ctx.db.inspections.some((i) => i.propertyId === p.id && i.inspectorId === ctx.user.id)) return;
  throw fail("FORBIDDEN_NOT_OWNER", "You don't have access to this property.", 403);
}

function toProperty(db: MockDb, p: PropertyRow): Property {
  const ins = db.inspections.filter((i) => i.propertyId === p.id);
  const last = ins
    .filter((i) => i.status === "SUBMITTED")
    .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))[0];
  const next = ins
    .filter((i) => i.status !== "SUBMITTED")
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0];
  return {
    id: p.id,
    ownerId: p.ownerId,
    name: p.name,
    address: p.address,
    city: p.city,
    type: p.type,
    coverPhotoUrl: p.coverPhotoUrl,
    healthScore: p.healthScore,
    createdAt: p.createdAt,
    lastInspectionDate: last?.submittedAt ?? last?.scheduledDate ?? null,
    nextInspectionDate: next?.scheduledDate ?? null,
    openIssueCount: db.issues.filter((i) => i.propertyId === p.id && i.status === "FLAGGED").length,
    ownerName: db.users.find((u) => u.id === p.ownerId)?.name,
  };
}

function toInspection(db: MockDb, i: InspectionRow): Inspection {
  const p = db.properties.find((x) => x.id === i.propertyId);
  const items = db.checklistItems.filter((c) => c.inspectionId === i.id);
  return {
    ...i,
    propertyName: p?.name ?? "Unknown property",
    propertyAddress: p ? `${p.address}, ${p.city}` : "",
    inspectorName: db.users.find((u) => u.id === i.inspectorId)?.name ?? null,
    itemsTotal: items.length,
    itemsDone: items.filter((c) => c.status !== null).length,
    issueCount: db.issues.filter((x) => x.inspectionId === i.id).length,
    reportId: db.reports.find((r) => r.inspectionId === i.id)?.id ?? null,
  };
}

function toIssue(db: MockDb, i: IssueRow): Issue {
  const p = db.properties.find((x) => x.id === i.propertyId);
  return {
    ...i,
    propertyName: p?.name ?? "",
    propertyAddress: p ? `${p.address}, ${p.city}` : "",
    flaggedByName: db.users.find((u) => u.id === i.flaggedBy)?.name ?? "Inspector",
    repairId: db.repairs.find((r) => r.issueId === i.id)?.id ?? null,
  };
}

function toProviderProfile(db: MockDb, providerId: string | null): ServiceProviderProfile | null {
  const sp = db.providers.find((p) => p.id === providerId);
  if (!sp) return null;
  const u = db.users.find((x) => x.id === sp.userId)!;
  return {
    ...sp,
    name: u.name,
    email: u.email,
    phone: u.phone,
    completedJobs: db.repairs.filter((r) => r.providerId === sp.id && r.status === "COMPLETED").length,
  };
}

function toRepair(db: MockDb, r: Repair): RepairWithContext {
  const issue = db.issues.find((i) => i.id === r.issueId)!;
  const p = db.properties.find((x) => x.id === issue.propertyId)!;
  return {
    ...r,
    issueCategory: issue.category,
    issueDescription: issue.description,
    issueMediaUrls: issue.mediaUrls,
    propertyId: p.id,
    propertyName: p.name,
    propertyAddress: p.address,
    propertyCity: p.city,
    provider: toProviderProfile(db, r.providerId),
  };
}

function getInspectionRow(ctx: Ctx, id: string) {
  const i = ctx.db.inspections.find((x) => x.id === id);
  if (!i) throw fail("INSPECTION_NOT_FOUND", "Inspection not found.", 404);
  const p = getProperty(ctx.db, i.propertyId);
  const allowed =
    ctx.user.role === "ADMIN" ||
    (ctx.user.role === "OWNER" && p.ownerId === ctx.user.id) ||
    (ctx.user.role === "INSPECTOR" && i.inspectorId === ctx.user.id);
  if (!allowed) throw fail("INSPECTION_NOT_FOUND", "Inspection not found.", 404);
  return i;
}

function getIssueRow(ctx: Ctx, id: string) {
  const issue = ctx.db.issues.find((x) => x.id === id);
  if (!issue) throw fail("ISSUE_NOT_FOUND", "Issue not found.", 404);
  const p = getProperty(ctx.db, issue.propertyId);
  const repair = ctx.db.repairs.find((r) => r.issueId === id);
  const provider = ctx.db.providers.find((sp) => sp.id === repair?.providerId);
  const allowed =
    ctx.user.role === "ADMIN" ||
    (ctx.user.role === "OWNER" && p.ownerId === ctx.user.id) ||
    (ctx.user.role === "INSPECTOR" && issue.flaggedBy === ctx.user.id) ||
    (ctx.user.role === "PROVIDER" && provider?.userId === ctx.user.id);
  if (!allowed) throw fail("ISSUE_NOT_FOUND", "Issue not found.", 404);
  return issue;
}

function getRepairRow(ctx: Ctx, id: string) {
  const r = ctx.db.repairs.find((x) => x.id === id);
  if (!r) throw fail("REPAIR_NOT_FOUND", "Repair not found.", 404);
  return r;
}

function myProvider(ctx: Ctx) {
  const sp = ctx.db.providers.find((p) => p.userId === ctx.user.id);
  if (!sp) throw fail("FORBIDDEN", "No provider profile for this account.", 403);
  return sp;
}

function ownerOfIssue(db: MockDb, issue: IssueRow) {
  return db.properties.find((p) => p.id === issue.propertyId)?.ownerId;
}

function providerUserId(db: MockDb, providerId: string | null) {
  return db.providers.find((p) => p.id === providerId)?.userId ?? null;
}

/** Pick the verified inspector with the fewest open jobs (auto-assignment). */
function autoAssignInspector(db: MockDb): string | null {
  const inspectors = db.users.filter((u) => u.role === "INSPECTOR" && u.verified);
  if (!inspectors.length) return null;
  const load = (id: string) => db.inspections.filter((i) => i.inspectorId === id && i.status !== "SUBMITTED").length;
  return inspectors.sort((a, b) => load(a.id) - load(b.id))[0].id;
}

function templateFor(db: MockDb, type: string) {
  return db.templates.find((t) => t.propertyType === type)?.items ?? DEFAULT_TEMPLATES[type] ?? DEFAULT_TEMPLATES.Apartment;
}

function createInspectionRow(db: MockDb, propertyId: string, scheduledDate: string, recurrenceRule: string | null, inspectorId: string | null) {
  const p = getProperty(db, propertyId);
  const row: InspectionRow = {
    id: uid("ins"),
    propertyId,
    inspectorId,
    scheduledDate,
    recurrenceRule,
    status: "SCHEDULED",
    startedAt: null,
    submittedAt: null,
  };
  db.inspections.push(row);
  templateFor(db, p.type).forEach((t, idx) =>
    db.checklistItems.push({
      id: `${row.id}_ci${idx}`,
      inspectionId: row.id,
      roomArea: t.roomArea,
      itemName: t.itemName,
      status: null,
      mediaUrls: [],
      notes: null,
    })
  );
  return row;
}

function nextDateFromRule(rule: string, fromIso: string): string | null {
  const d = new Date(fromIso);
  const interval = Number(/INTERVAL=(\d+)/.exec(rule)?.[1] ?? 1);
  if (rule.includes("WEEKLY")) d.setDate(d.getDate() + 7 * interval);
  else if (rule.includes("MONTHLY")) d.setMonth(d.getMonth() + interval);
  else return null;
  return d.toISOString();
}

/**
 * Stand-in for the BullMQ report job: compiles the report a few seconds after
 * submit, recomputes the health score, notifies the owner and spawns the next
 * recurring inspection.
 */
function enqueueReportJob(inspectionId: string) {
  setTimeout(() => {
    const db = load();
    const ins = db.inspections.find((i) => i.id === inspectionId);
    if (!ins || db.reports.some((r) => r.inspectionId === inspectionId)) return;
    const items = db.checklistItems.filter((c) => c.inspectionId === inspectionId);
    const score = scoreFromItems(items);
    const report = {
      id: uid("rep"),
      inspectionId,
      generatedAt: nowIso(),
      summaryUrl: null,
      healthScore: score,
      passCount: items.filter((i) => i.status === "PASS").length,
      attentionCount: items.filter((i) => i.status === "ATTENTION").length,
      failCount: items.filter((i) => i.status === "FAIL").length,
    };
    db.reports.push(report);
    const p = db.properties.find((x) => x.id === ins.propertyId)!;
    p.healthScore = score;

    if (ins.recurrenceRule) {
      const next = nextDateFromRule(ins.recurrenceRule, ins.scheduledDate);
      if (next) createInspectionRow(db, p.id, next, ins.recurrenceRule, ins.inspectorId);
    }

    const issues = db.issues.filter((i) => i.inspectionId === inspectionId).length;
    notify(
      db,
      p.ownerId,
      "REPORT_READY",
      "Inspection report ready",
      `${p.name}: health score ${score}/100${issues ? `, ${issues} issue${issues > 1 ? "s" : ""} flagged` : ", no issues found"}.`,
      `/report/${inspectionId}`
    );
    save(db);
    emit([p.ownerId, ins.inspectorId, ...adminIds(db)], "report.ready", {
      inspectionId,
      reportUrl: `/report/${inspectionId}`,
      propertyId: p.id,
    });
    emit(adminIds(db), "dashboard.changed", {});
  }, 3500);
}

// ---------------------------------------------------------------- routes

type Handler = (ctx: Ctx) => unknown;
type Route = { method: string; pattern: RegExp; keys: string[]; handler: Handler; public?: boolean };

const routes: Route[] = [];

function route(method: string, path: string, handler: Handler, isPublic = false) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" +
      path.replace(/:(\w+)/g, (_, k) => {
        keys.push(k);
        return "([^/]+)";
      }) +
      "$"
  );
  routes.push({ method, pattern, keys, handler, public: isPublic });
}

// ---- auth -----------------------------------------------------------------

route(
  "POST",
  "/auth/login",
  ({ db, body }) => {
    const email = String(body.email ?? "").toLowerCase().trim();
    const u = db.users.find((x) => x.email === email);
    if (!u || u.password !== body.password) throw fail("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    return issueTokens(u);
  },
  true
);

route(
  "POST",
  "/auth/register",
  (ctx) => {
    const { db } = ctx;
    const input = ctx.body as unknown as RegisterInput;
    const email = input.email.toLowerCase().trim();
    if (db.users.some((u) => u.email === email)) throw fail("EMAIL_TAKEN", "An account with this email already exists.", 409);
    if (input.role === "ADMIN") throw fail("FORBIDDEN", "Admin accounts are created by invitation only.", 403);
    const u: UserRow = {
      id: uid("u"),
      name: input.name,
      email,
      password: input.password,
      role: input.role,
      phone: input.phone ?? null,
      verified: input.role === "OWNER",
      createdAt: nowIso(),
    };
    db.users.push(u);
    if (u.role === "PROVIDER") {
      db.providers.push({
        id: uid("sp"),
        userId: u.id,
        serviceTypes: input.serviceTypes?.length ? input.serviceTypes : ["General Repairs"],
        locality: input.locality || "Bengaluru",
        verified: false,
        rating: null,
      });
    }
    if (u.role !== "OWNER") {
      adminIds(db).forEach((a) =>
        notify(db, a, "ACCOUNT_VERIFIED", "New verification request", `${u.name} signed up as ${u.role.toLowerCase()}.`, "/admin/verification")
      );
      emit(adminIds(db), "dashboard.changed", {});
    }
    return issueTokens(u);
  },
  true
);

route("GET", "/auth/me", ({ user }) => publicUser(user));

route("PATCH", "/users/me", ({ user, body }) => {
  if (typeof body.name === "string" && body.name.trim()) user.name = body.name.trim();
  if (typeof body.phone === "string") user.phone = body.phone.trim() || null;
  return publicUser(user);
});

route("GET", "/users/me/preferences", ({ db, user }) => db.preferences[user.id] ?? { notificationChannel: "BOTH" });
route("PATCH", "/users/me/preferences", ({ db, user, body }) => {
  db.preferences[user.id] = { notificationChannel: (body.notificationChannel as "EMAIL") ?? "BOTH" };
  return db.preferences[user.id];
});

// ---- properties -----------------------------------------------------------

route("GET", "/properties", (ctx) => {
  const { db, user } = ctx;
  let rows = db.properties.filter((p) => !p.archived);
  if (user.role === "OWNER") rows = rows.filter((p) => p.ownerId === user.id);
  else if (user.role !== "ADMIN") throw fail("FORBIDDEN", "Not allowed.", 403);
  return rows.map((p) => toProperty(db, p)).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
});

route("POST", "/properties", (ctx) => {
  requireRole(ctx, "OWNER");
  const input = ctx.body as unknown as CreatePropertyInput;
  if (!input.address?.trim()) throw fail("PROPERTY_ADDRESS_REQUIRED", "Address is required.", 400);
  if (!input.coverPhotoUrl) throw fail("VALIDATION_ERROR", "At least one photo is required.", 400);
  const row: PropertyRow = {
    id: uid("p"),
    ownerId: ctx.user.id,
    name: input.name?.trim() || input.address.split(",")[0],
    address: input.address.trim(),
    city: input.city,
    type: input.type,
    coverPhotoUrl: input.coverPhotoUrl,
    healthScore: null,
    createdAt: nowIso(),
    archived: false,
  };
  ctx.db.properties.push(row);
  writeAudit(ctx, "Property", row.id, "CREATED", { address: row.address, type: row.type });
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return toProperty(ctx.db, row);
});

route("GET", "/properties/:id", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  assertCanSeeProperty(ctx, p);
  return toProperty(ctx.db, p);
});

route("PATCH", "/properties/:id", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  if (ctx.user.role !== "ADMIN" && p.ownerId !== ctx.user.id) throw fail("FORBIDDEN_NOT_OWNER", "You don't own this property.", 403);
  const before = { name: p.name, address: p.address, city: p.city, type: p.type };
  const b = ctx.body as Partial<CreatePropertyInput>;
  if (b.address !== undefined && !b.address.trim()) throw fail("PROPERTY_ADDRESS_REQUIRED", "Address is required.", 400);
  Object.assign(p, Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined)));
  writeAudit(ctx, "Property", p.id, "UPDATED", { before, after: b });
  return toProperty(ctx.db, p);
});

route("POST", "/properties/:id/archive", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  if (p.ownerId !== ctx.user.id && ctx.user.role !== "ADMIN") throw fail("FORBIDDEN_NOT_OWNER", "You don't own this property.", 403);
  const open =
    ctx.db.inspections.some((i) => i.propertyId === p.id && i.status !== "SUBMITTED") ||
    ctx.db.issues.some((i) => i.propertyId === p.id && (i.status === "FLAGGED" || i.status === "APPROVED"));
  if (open) throw fail("VALIDATION_ERROR", "This property has open inspections or issues. Close them before archiving.", 409);
  p.archived = true;
  writeAudit(ctx, "Property", p.id, "ARCHIVED");
  return { ok: true };
});

route("GET", "/properties/:id/health-history", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  assertCanSeeProperty(ctx, p);
  return ctx.db.inspections
    .filter((i) => i.propertyId === p.id && i.status === "SUBMITTED")
    .map((i) => ({ i, r: ctx.db.reports.find((r) => r.inspectionId === i.id) }))
    .filter((x) => x.r)
    .sort((a, b) => a.i.scheduledDate.localeCompare(b.i.scheduledDate))
    .map<HealthPoint>((x) => ({ date: x.i.scheduledDate, score: x.r!.healthScore }));
});

route("GET", "/properties/:id/documents", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  assertCanSeeProperty(ctx, p);
  return ctx.db.documents.filter((d) => d.propertyId === p.id).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
});

route("POST", "/properties/:id/documents", (ctx) => {
  const p = getProperty(ctx.db, ctx.params.id);
  if (p.ownerId !== ctx.user.id) throw fail("FORBIDDEN_NOT_OWNER", "You don't own this property.", 403);
  const doc: PropertyDocument = {
    id: uid("doc"),
    propertyId: p.id,
    name: String(ctx.body.name),
    kind: (ctx.body.kind as PropertyDocument["kind"]) ?? "OTHER",
    url: String(ctx.body.url ?? "#"),
    sizeBytes: Number(ctx.body.sizeBytes ?? 0),
    uploadedAt: nowIso(),
  };
  ctx.db.documents.push(doc);
  return doc;
});

route("DELETE", "/documents/:id", (ctx) => {
  const d = ctx.db.documents.find((x) => x.id === ctx.params.id);
  if (!d) throw fail("NOT_FOUND", "Document not found.", 404);
  const p = getProperty(ctx.db, d.propertyId);
  if (p.ownerId !== ctx.user.id) throw fail("FORBIDDEN_NOT_OWNER", "You don't own this property.", 403);
  ctx.db.documents = ctx.db.documents.filter((x) => x.id !== d.id);
  return { ok: true };
});

// ---- inspections ----------------------------------------------------------

route("GET", "/inspections", (ctx) => {
  const { db, user, query } = ctx;
  let rows = db.inspections;
  if (user.role === "OWNER") {
    const mine = new Set(db.properties.filter((p) => p.ownerId === user.id).map((p) => p.id));
    rows = rows.filter((i) => mine.has(i.propertyId));
  } else if (user.role === "INSPECTOR") {
    rows = rows.filter((i) => i.inspectorId === user.id);
  } else if (user.role !== "ADMIN") {
    throw fail("FORBIDDEN", "Not allowed.", 403);
  }
  const propertyId = query.get("propertyId");
  if (propertyId) rows = rows.filter((i) => i.propertyId === propertyId);
  const status = query.get("status");
  if (status) rows = rows.filter((i) => status.split(",").includes(i.status));
  if (query.get("unassigned") === "true") rows = rows.filter((i) => !i.inspectorId);
  return rows.map((i) => toInspection(db, i)).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
});

route("POST", "/inspections", (ctx) => {
  requireRole(ctx, "OWNER", "ADMIN");
  const input = ctx.body as unknown as ScheduleInspectionInput;
  const p = getProperty(ctx.db, input.propertyId);
  if (ctx.user.role === "OWNER" && p.ownerId !== ctx.user.id) throw fail("FORBIDDEN_NOT_OWNER", "You don't own this property.", 403);
  const date = new Date(input.scheduledDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(date.getTime()) || date < today) throw fail("PAST_DATE_NOT_ALLOWED", "Please select a valid future date.", 400);
  const row = createInspectionRow(ctx.db, p.id, date.toISOString(), input.recurrenceRule || null, null);
  writeAudit(ctx, "Inspection", row.id, "SCHEDULED", { scheduledDate: row.scheduledDate, recurrenceRule: row.recurrenceRule });
  emit(adminIds(ctx.db), "dashboard.changed", {});

  // Async auto-assignment (backend: BullMQ "assign-inspector" job)
  const inspectionId = row.id;
  setTimeout(() => {
    const db = load();
    const ins = db.inspections.find((i) => i.id === inspectionId);
    if (!ins || ins.inspectorId) return;
    const inspectorId = autoAssignInspector(db);
    if (!inspectorId) return;
    ins.inspectorId = inspectorId;
    const prop = db.properties.find((x) => x.id === ins.propertyId)!;
    const inspector = db.users.find((u) => u.id === inspectorId)!;
    db.auditLogs.push({ id: uid("al"), entityType: "Inspection", entityId: ins.id, action: "ASSIGNED", actorId: "system", actorName: "Auto-assignment", metadata: { inspectorId }, timestamp: nowIso() });
    const when = new Date(ins.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    notify(db, prop.ownerId, "INSPECTION_ASSIGNED", "Inspector assigned", `${inspector.name} (verified) will inspect ${prop.name} on ${when}.`, `/property/${prop.id}`);
    notify(db, inspectorId, "INSPECTION_ASSIGNED", "New job assigned", `${prop.name}, ${prop.city} — ${when}.`, `/inspection/${ins.id}/checklist`);
    save(db);
    emit([prop.ownerId, inspectorId, ...adminIds(db)], "inspection.updated", { inspectionId: ins.id, status: ins.status });
  }, 2500);

  return toInspection(ctx.db, row);
});

route("GET", "/inspections/:id", (ctx): InspectionDetail => {
  const i = getInspectionRow(ctx, ctx.params.id);
  return {
    ...toInspection(ctx.db, i),
    checklistItems: ctx.db.checklistItems.filter((c) => c.inspectionId === i.id),
    issues: ctx.db.issues.filter((x) => x.inspectionId === i.id).map((x) => toIssue(ctx.db, x)),
    report: ctx.db.reports.find((r) => r.inspectionId === i.id) ?? null,
  };
});

route("POST", "/inspections/:id/start", (ctx) => {
  requireRole(ctx, "INSPECTOR");
  const i = getInspectionRow(ctx, ctx.params.id);
  if (i.status === "SUBMITTED") throw fail("INSPECTION_ALREADY_SUBMITTED", "This inspection was already submitted.", 409);
  if (i.status === "SCHEDULED") {
    i.status = "IN_PROGRESS";
    i.startedAt = nowIso();
    writeAudit(ctx, "Inspection", i.id, "STARTED");
    const owner = getProperty(ctx.db, i.propertyId).ownerId;
    emit([owner, ...adminIds(ctx.db)], "inspection.updated", { inspectionId: i.id, status: i.status });
  }
  return toInspection(ctx.db, i);
});

route("PATCH", "/inspections/:id/checklist", (ctx) => {
  requireRole(ctx, "INSPECTOR");
  const i = getInspectionRow(ctx, ctx.params.id);
  if (i.status === "SUBMITTED") throw fail("INSPECTION_ALREADY_SUBMITTED", "This checklist is locked.", 409);
  const input = ctx.body as unknown as SaveChecklistDraftInput;
  for (const patch of input.items ?? []) {
    const item = ctx.db.checklistItems.find((c) => c.id === patch.id && c.inspectionId === i.id);
    if (!item) continue;
    item.status = patch.status;
    item.mediaUrls = patch.mediaUrls ?? item.mediaUrls;
    item.notes = patch.notes ?? null;
  }
  if (i.status === "SCHEDULED") {
    i.status = "IN_PROGRESS";
    i.startedAt = nowIso();
  }
  return { ok: true, savedAt: nowIso() };
});

route("POST", "/inspections/:id/submit", (ctx) => {
  requireRole(ctx, "INSPECTOR");
  const i = getInspectionRow(ctx, ctx.params.id);
  if (i.status === "SUBMITTED") throw fail("INSPECTION_ALREADY_SUBMITTED", "This inspection was already submitted.", 409);
  const items = ctx.db.checklistItems.filter((c) => c.inspectionId === i.id);
  if (items.some((c) => c.status === null)) throw fail("CHECKLIST_INCOMPLETE", "Complete all checklist items before submitting.", 400);
  i.status = "SUBMITTED";
  i.submittedAt = nowIso();
  writeAudit(ctx, "Inspection", i.id, "SUBMITTED", { items: items.length });
  enqueueReportJob(i.id);
  const owner = getProperty(ctx.db, i.propertyId).ownerId;
  emit([owner, ...adminIds(ctx.db)], "inspection.updated", { inspectionId: i.id, status: i.status });
  return { ok: true, inspectionId: i.id, message: "Report is being generated." };
});

route("POST", "/inspections/:id/cancel", (ctx) => {
  requireRole(ctx, "OWNER", "ADMIN");
  const i = getInspectionRow(ctx, ctx.params.id);
  if (i.status !== "SCHEDULED") throw fail("VALIDATION_ERROR", "Only scheduled inspections can be cancelled.", 409);
  ctx.db.inspections = ctx.db.inspections.filter((x) => x.id !== i.id);
  ctx.db.checklistItems = ctx.db.checklistItems.filter((c) => c.inspectionId !== i.id);
  writeAudit(ctx, "Inspection", i.id, "CANCELLED");
  if (i.inspectorId) notify(ctx.db, i.inspectorId, "INSPECTION_ASSIGNED", "Job cancelled", `An inspection on ${new Date(i.scheduledDate).toLocaleDateString("en-IN")} was cancelled by the owner.`, "/inspections");
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return { ok: true };
});

// ---- issues ---------------------------------------------------------------

route("GET", "/issues", (ctx) => {
  const { db, user, query } = ctx;
  let rows = db.issues;
  if (user.role === "OWNER") {
    const mine = new Set(db.properties.filter((p) => p.ownerId === user.id).map((p) => p.id));
    rows = rows.filter((i) => mine.has(i.propertyId));
  } else if (user.role === "INSPECTOR") {
    rows = rows.filter((i) => i.flaggedBy === user.id);
  } else if (user.role !== "ADMIN") {
    throw fail("FORBIDDEN", "Not allowed.", 403);
  }
  const propertyId = query.get("propertyId");
  if (propertyId) rows = rows.filter((i) => i.propertyId === propertyId);
  const status = query.get("status");
  if (status) rows = rows.filter((i) => status.split(",").includes(i.status));
  return rows.map((i) => toIssue(db, i)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

route("POST", "/issues", (ctx) => {
  requireRole(ctx, "INSPECTOR");
  const input = ctx.body as unknown as FlagIssueInput;
  const ins = getInspectionRow(ctx, input.inspectionId);
  if (ins.status === "SUBMITTED") throw fail("INSPECTION_ALREADY_SUBMITTED", "This inspection is locked.", 409);
  if (!input.mediaUrls?.length) throw fail("ISSUE_MEDIA_REQUIRED", "At least one photo is required.", 400);
  if (!input.description?.trim()) throw fail("VALIDATION_ERROR", "Description is required.", 400);
  const row: IssueRow = {
    id: uid("iss"),
    inspectionId: ins.id,
    propertyId: ins.propertyId,
    category: input.category,
    description: input.description.trim(),
    mediaUrls: input.mediaUrls,
    status: "FLAGGED",
    flaggedBy: ctx.user.id,
    decisionReason: null,
    createdAt: nowIso(),
  };
  ctx.db.issues.push(row);
  writeAudit(ctx, "Issue", row.id, "FLAGGED", { category: row.category });
  const p = getProperty(ctx.db, ins.propertyId);
  notify(ctx.db, p.ownerId, "ISSUE_FLAGGED", `Issue flagged: ${row.category.toLowerCase()}`, `${ctx.user.name} flagged an issue at ${p.name}. Review it and approve or decline the repair.`, `/issue/${row.id}`);
  emit([p.ownerId, ...adminIds(ctx.db)], "issue.flagged", { issueId: row.id, propertyId: p.id });
  return toIssue(ctx.db, row);
});

route("GET", "/issues/:id", (ctx): IssueDetail => {
  const issue = getIssueRow(ctx, ctx.params.id);
  const repair = ctx.db.repairs.find((r) => r.issueId === issue.id);
  return {
    ...toIssue(ctx.db, issue),
    repair: repair ? toRepair(ctx.db, repair) : null,
    auditTrail: ctx.db.auditLogs
      .filter((a) => (a.entityType === "Issue" && a.entityId === issue.id) || (a.entityType === "Repair" && a.entityId === repair?.id))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    messages: ctx.db.messages.filter((m) => m.issueId === issue.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
});

route("POST", "/issues/:id/approve", (ctx) => {
  requireRole(ctx, "OWNER");
  const issue = getIssueRow(ctx, ctx.params.id);
  if (issue.status !== "FLAGGED") throw fail("ISSUE_ALREADY_DECIDED", "A decision was already made on this issue.", 409);
  issue.status = "APPROVED";
  const repair: Repair = {
    id: uid("rpr"),
    issueId: issue.id,
    providerId: null,
    status: "REQUESTED",
    costEstimate: null,
    completionNotes: null,
    completionPhotos: [],
    ownerRating: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  ctx.db.repairs.push(repair);
  writeAudit(ctx, "Issue", issue.id, "APPROVED");
  writeAudit(ctx, "Repair", repair.id, "CREATED", { status: "REQUESTED" });
  const p = getProperty(ctx.db, issue.propertyId);
  adminIds(ctx.db).forEach((a) =>
    notify(ctx.db, a, "REPAIR_REQUESTED", "Repair needs a provider", `${ctx.user.name} approved a ${issue.category.toLowerCase()} repair at ${p.name}, ${p.city}.`, "/admin/reassign")
  );
  emit([ctx.user.id, ...adminIds(ctx.db)], "repair.status.updated", { repairId: repair.id, status: repair.status, issueId: issue.id });
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return repair;
});

route("POST", "/issues/:id/decline", (ctx) => {
  requireRole(ctx, "OWNER");
  const issue = getIssueRow(ctx, ctx.params.id);
  if (issue.status !== "FLAGGED") throw fail("ISSUE_ALREADY_DECIDED", "A decision was already made on this issue.", 409);
  const reason = String(ctx.body.reason ?? "").trim();
  if (!reason) throw fail("VALIDATION_ERROR", "Please give a reason for declining.", 400);
  issue.status = "DECLINED";
  issue.decisionReason = reason;
  writeAudit(ctx, "Issue", issue.id, "DECLINED", { reason });
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return toIssue(ctx.db, issue);
});

route("GET", "/issues/:id/messages", (ctx) => {
  const issue = getIssueRow(ctx, ctx.params.id);
  return ctx.db.messages.filter((m) => m.issueId === issue.id);
});

route("POST", "/issues/:id/messages", (ctx) => {
  const issue = getIssueRow(ctx, ctx.params.id);
  const body = String(ctx.body.body ?? "").trim();
  if (!body) throw fail("VALIDATION_ERROR", "Message can't be empty.", 400);
  const msg = { id: uid("m"), issueId: issue.id, authorId: ctx.user.id, authorName: ctx.user.name, authorRole: ctx.user.role, body, createdAt: nowIso() };
  ctx.db.messages.push(msg);
  const repair = ctx.db.repairs.find((r) => r.issueId === issue.id);
  const participants = [ownerOfIssue(ctx.db, issue), issue.flaggedBy, providerUserId(ctx.db, repair?.providerId ?? null)].filter((id) => id && id !== ctx.user.id) as string[];
  participants.forEach((id) => notify(ctx.db, id, "NEW_MESSAGE", `New message from ${ctx.user.name}`, body.slice(0, 120), `/issue/${issue.id}`));
  return msg;
});

// ---- repairs --------------------------------------------------------------

route("GET", "/repairs", (ctx) => {
  const { db, user, query } = ctx;
  let rows = db.repairs;
  if (user.role === "OWNER") {
    const mine = new Set(db.properties.filter((p) => p.ownerId === user.id).map((p) => p.id));
    rows = rows.filter((r) => mine.has(db.issues.find((i) => i.id === r.issueId)!.propertyId));
  } else if (user.role === "PROVIDER") {
    const sp = myProvider(ctx);
    rows = rows.filter((r) => r.providerId === sp.id);
  } else if (user.role !== "ADMIN") {
    throw fail("FORBIDDEN", "Not allowed.", 403);
  }
  const status = query.get("status");
  if (status) rows = rows.filter((r) => status.split(",").includes(r.status));
  return rows.map((r) => toRepair(db, r)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

const TRANSITIONS: Record<RepairStatus, RepairStatus[]> = {
  REQUESTED: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS", "REQUESTED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
};

function transitionRepair(ctx: Ctx, r: Repair, to: RepairStatus, extra: Record<string, unknown> = {}) {
  if (!TRANSITIONS[r.status].includes(to)) {
    throw fail("REPAIR_INVALID_TRANSITION", `A repair can't move from ${r.status} to ${to}.`, 409);
  }
  const from = r.status;
  r.status = to;
  r.updatedAt = nowIso();
  writeAudit(ctx, "Repair", r.id, to === "ASSIGNED" ? "ASSIGNED" : to === "COMPLETED" ? "COMPLETED" : "STATUS_CHANGED", { from, to, ...extra });
  const issue = ctx.db.issues.find((i) => i.id === r.issueId)!;
  if (to === "COMPLETED") issue.status = "CLOSED";
  const owner = ownerOfIssue(ctx.db, issue);
  const p = getProperty(ctx.db, issue.propertyId);
  const labels: Record<RepairStatus, string> = {
    REQUESTED: "Repair waiting for a provider",
    ASSIGNED: "Provider assigned",
    IN_PROGRESS: "Repair in progress",
    COMPLETED: "Repair completed",
  };
  if (owner) notify(ctx.db, owner, "REPAIR_STATUS_UPDATED", labels[to], `${p.name}: ${issue.category.toLowerCase()} repair is now ${to.replace("_", " ").toLowerCase()}.`, `/issue/${issue.id}`);
  emit([owner, providerUserId(ctx.db, r.providerId), ...adminIds(ctx.db)], "repair.status.updated", { repairId: r.id, status: r.status, issueId: issue.id });
  emit(adminIds(ctx.db), "dashboard.changed", {});
}

route("POST", "/repairs/:id/assign", (ctx) => {
  requireRole(ctx, "ADMIN");
  const r = getRepairRow(ctx, ctx.params.id);
  const sp = ctx.db.providers.find((p) => p.id === ctx.body.providerId);
  if (!sp) throw fail("NOT_FOUND", "Provider not found.", 404);
  if (!sp.verified) throw fail("PROVIDER_NOT_VERIFIED", "Only verified providers can be assigned.", 403);
  if (r.status === "ASSIGNED") {
    // reassignment of a not-yet-accepted job
    const previous = r.providerId;
    r.providerId = sp.id;
    r.updatedAt = nowIso();
    writeAudit(ctx, "Repair", r.id, "REASSIGNED", { from: previous, to: sp.id });
  } else {
    r.providerId = sp.id;
    transitionRepair(ctx, r, "ASSIGNED", { providerId: sp.id });
  }
  const issue = ctx.db.issues.find((i) => i.id === r.issueId)!;
  const p = getProperty(ctx.db, issue.propertyId);
  notify(ctx.db, sp.userId, "JOB_ASSIGNED", "New job assigned", `${issue.category.toLowerCase()} repair at ${p.name}, ${p.address}, ${p.city}.`, "/provider/jobs");
  emit([sp.userId], "repair.status.updated", { repairId: r.id, status: r.status, issueId: issue.id });
  return toRepair(ctx.db, r);
});

route("PATCH", "/repairs/:id/status", (ctx) => {
  requireRole(ctx, "PROVIDER", "ADMIN");
  const r = getRepairRow(ctx, ctx.params.id);
  if (ctx.user.role === "PROVIDER" && r.providerId !== myProvider(ctx).id) throw fail("FORBIDDEN", "This job isn't assigned to you.", 403);
  const to = ctx.body.status as RepairStatus;
  if (to === "COMPLETED") throw fail("REPAIR_INVALID_TRANSITION", "Use the complete endpoint with a confirmation note.", 409);
  const extra: Record<string, unknown> = {};
  if (ctx.body.costEstimate !== undefined && ctx.body.costEstimate !== null) {
    const cost = Number(ctx.body.costEstimate);
    if (isNaN(cost) || cost < 0) throw fail("VALIDATION_ERROR", "Cost estimate must be zero or more.", 400);
    r.costEstimate = cost;
    extra.costEstimate = cost;
  }
  transitionRepair(ctx, r, to, extra);
  return toRepair(ctx.db, r);
});

route("POST", "/repairs/:id/decline", (ctx) => {
  requireRole(ctx, "PROVIDER");
  const r = getRepairRow(ctx, ctx.params.id);
  if (r.providerId !== myProvider(ctx).id) throw fail("FORBIDDEN", "This job isn't assigned to you.", 403);
  const reason = String(ctx.body.reason ?? "").trim() || "Not available";
  transitionRepair(ctx, r, "REQUESTED", { declinedBy: r.providerId, reason });
  r.providerId = null;
  adminIds(ctx.db).forEach((a) => notify(ctx.db, a, "REPAIR_REQUESTED", "Provider declined a job", `${ctx.user.name} declined: "${reason}". Reassign a provider.`, "/admin/reassign"));
  return toRepair(ctx.db, r);
});

route("POST", "/repairs/:id/complete", (ctx) => {
  requireRole(ctx, "PROVIDER");
  const r = getRepairRow(ctx, ctx.params.id);
  if (r.providerId !== myProvider(ctx).id) throw fail("FORBIDDEN", "This job isn't assigned to you.", 403);
  const notes = String(ctx.body.completionNotes ?? "").trim();
  if (!notes) throw fail("COMPLETION_NOTE_REQUIRED", "Add a confirmation note before marking this job complete.", 400);
  r.completionNotes = notes;
  r.completionPhotos = (ctx.body.completionPhotos as string[]) ?? [];
  transitionRepair(ctx, r, "COMPLETED", { notes });
  return toRepair(ctx.db, r);
});

route("POST", "/repairs/:id/rate", (ctx) => {
  requireRole(ctx, "OWNER");
  const r = getRepairRow(ctx, ctx.params.id);
  const issue = ctx.db.issues.find((i) => i.id === r.issueId)!;
  if (ownerOfIssue(ctx.db, issue) !== ctx.user.id) throw fail("FORBIDDEN_NOT_OWNER", "Not your repair.", 403);
  if (r.status !== "COMPLETED") throw fail("VALIDATION_ERROR", "You can rate a provider once the repair is completed.", 409);
  const rating = Math.round(Number(ctx.body.rating));
  if (!(rating >= 1 && rating <= 5)) throw fail("VALIDATION_ERROR", "Rating must be 1–5.", 400);
  r.ownerRating = rating;
  const sp = ctx.db.providers.find((p) => p.id === r.providerId);
  if (sp) {
    const rated = ctx.db.repairs.filter((x) => x.providerId === sp.id && x.ownerRating);
    sp.rating = Math.round((rated.reduce((s, x) => s + (x.ownerRating ?? 0), 0) / rated.length) * 10) / 10;
  }
  writeAudit(ctx, "Repair", r.id, "RATED", { rating });
  return toRepair(ctx.db, r);
});

// ---- providers / inspectors ----------------------------------------------

route("GET", "/providers", (ctx) => {
  requireRole(ctx, "ADMIN");
  const { query, db } = ctx;
  let rows = db.providers;
  if (query.get("verified") === "true") rows = rows.filter((p) => p.verified);
  const locality = query.get("locality");
  if (locality) rows = rows.filter((p) => p.locality === locality);
  const serviceType = query.get("serviceType");
  if (serviceType) rows = rows.filter((p) => p.serviceTypes.includes(serviceType));
  return rows.map((p) => toProviderProfile(db, p.id)!);
});

route("GET", "/providers/me", (ctx) => {
  requireRole(ctx, "PROVIDER");
  return toProviderProfile(ctx.db, myProvider(ctx).id);
});

route("GET", "/inspectors", (ctx) => {
  requireRole(ctx, "ADMIN");
  return ctx.db.users
    .filter((u) => u.role === "INSPECTOR" && (ctx.query.get("verified") !== "true" || u.verified))
    .map<InspectorProfile>((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      verified: u.verified,
      activeJobs: ctx.db.inspections.filter((i) => i.inspectorId === u.id && i.status !== "SUBMITTED").length,
    }));
});

// ---- admin ----------------------------------------------------------------

route("GET", "/admin/dashboard", (ctx): AdminDashboardSummary => {
  requireRole(ctx, "ADMIN");
  const { db } = ctx;
  return {
    activeProperties: db.properties.filter((p) => !p.archived).length,
    pendingInspections: db.inspections.filter((i) => i.status !== "SUBMITTED").length,
    openIssues: db.issues.filter((i) => i.status === "FLAGGED").length,
    inProgressRepairs: db.repairs.filter((r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length,
    pendingVerifications: db.users.filter((u) => (u.role === "INSPECTOR" || u.role === "PROVIDER") && !u.verified).length,
    requestedRepairs: db.repairs.filter((r) => r.status === "REQUESTED").length,
  };
});

route("POST", "/admin/reassign", (ctx) => {
  requireRole(ctx, "ADMIN");
  const { kind, id, assigneeId } = ctx.body as { kind: string; id: string; assigneeId: string };
  if (kind === "INSPECTION") {
    const ins = getInspectionRow(ctx, id);
    if (ins.status === "SUBMITTED") throw fail("INSPECTION_ALREADY_SUBMITTED", "Submitted inspections can't be reassigned.", 409);
    const inspector = ctx.db.users.find((u) => u.id === assigneeId && u.role === "INSPECTOR");
    if (!inspector) throw fail("NOT_FOUND", "Inspector not found.", 404);
    if (!inspector.verified) throw fail("INSPECTOR_NOT_VERIFIED", "Only verified inspectors can be assigned.", 403);
    const previous = ins.inspectorId;
    ins.inspectorId = inspector.id;
    writeAudit(ctx, "Inspection", ins.id, previous ? "REASSIGNED" : "ASSIGNED", { from: previous, to: inspector.id });
    const p = getProperty(ctx.db, ins.propertyId);
    const when = new Date(ins.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    notify(ctx.db, inspector.id, "INSPECTION_ASSIGNED", "New job assigned", `${p.name}, ${p.city} — ${when}.`, `/inspection/${ins.id}/checklist`);
    notify(ctx.db, p.ownerId, "INSPECTION_ASSIGNED", "Inspector assigned", `${inspector.name} (verified) will inspect ${p.name} on ${when}.`, `/property/${p.id}`);
    if (previous && previous !== inspector.id) notify(ctx.db, previous, "INSPECTION_ASSIGNED", "Job reassigned", `${p.name} on ${when} was moved to another inspector.`, "/inspections");
    emit([p.ownerId, inspector.id, previous], "inspection.updated", { inspectionId: ins.id, status: ins.status });
    return toInspection(ctx.db, ins);
  }
  throw fail("VALIDATION_ERROR", "Use /repairs/:id/assign for repairs.", 400);
});

route("GET", "/admin/verification", (ctx): VerificationRequest[] => {
  requireRole(ctx, "ADMIN");
  return ctx.db.users
    .filter((u) => (u.role === "INSPECTOR" || u.role === "PROVIDER") && !u.verified)
    .map((u) => {
      const sp = ctx.db.providers.find((p) => p.userId === u.id);
      return {
        userId: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role as "INSPECTOR" | "PROVIDER",
        serviceTypes: sp?.serviceTypes ?? [],
        locality: sp?.locality ?? null,
        createdAt: u.createdAt,
      };
    });
});

route("POST", "/admin/verification/:userId/approve", (ctx) => {
  requireRole(ctx, "ADMIN");
  const u = ctx.db.users.find((x) => x.id === ctx.params.userId);
  if (!u) throw fail("NOT_FOUND", "User not found.", 404);
  u.verified = true;
  const sp = ctx.db.providers.find((p) => p.userId === u.id);
  if (sp) sp.verified = true;
  writeAudit(ctx, "User", u.id, "VERIFIED", { role: u.role });
  notify(ctx.db, u.id, "ACCOUNT_VERIFIED", "You're verified", "Your account has been verified. You can now be assigned jobs.", u.role === "PROVIDER" ? "/provider/jobs" : "/inspections");
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return publicUser(u);
});

route("POST", "/admin/verification/:userId/reject", (ctx) => {
  requireRole(ctx, "ADMIN");
  const u = ctx.db.users.find((x) => x.id === ctx.params.userId);
  if (!u) throw fail("NOT_FOUND", "User not found.", 404);
  writeAudit(ctx, "User", u.id, "VERIFICATION_REJECTED", { reason: ctx.body.reason ?? null });
  notify(ctx.db, u.id, "ACCOUNT_VERIFIED", "Verification not approved", String(ctx.body.reason || "Please contact support to complete your verification."));
  // keep the account but leave it unverified; remove from queue by marking metadata
  ctx.db.users = ctx.db.users.filter((x) => x.id !== u.id);
  ctx.db.providers = ctx.db.providers.filter((p) => p.userId !== u.id);
  emit(adminIds(ctx.db), "dashboard.changed", {});
  return { ok: true };
});

route("GET", "/admin/audit-logs", (ctx) => {
  requireRole(ctx, "ADMIN");
  let rows = ctx.db.auditLogs;
  const entityType = ctx.query.get("entityType");
  const entityId = ctx.query.get("entityId");
  if (entityType) rows = rows.filter((a) => a.entityType === entityType);
  if (entityId) rows = rows.filter((a) => a.entityId === entityId);
  return [...rows].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 300);
});

route("GET", "/templates", (ctx) => {
  requireRole(ctx, "ADMIN");
  return ctx.db.templates;
});

route("PUT", "/templates/:id", (ctx) => {
  requireRole(ctx, "ADMIN");
  const t = ctx.db.templates.find((x) => x.id === ctx.params.id);
  if (!t) throw fail("NOT_FOUND", "Template not found.", 404);
  const items = (ctx.body.items as typeof t.items).filter((i) => i.roomArea.trim() && i.itemName.trim());
  if (!items.length) throw fail("VALIDATION_ERROR", "A template needs at least one item.", 400);
  t.items = items;
  t.updatedAt = nowIso();
  return t;
});

// ---- notifications --------------------------------------------------------

route("GET", "/notifications", ({ db, user }) =>
  db.notifications.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
);

route("PATCH", "/notifications/:id/read", ({ db, user, params }) => {
  const n = db.notifications.find((x) => x.id === params.id && x.userId === user.id);
  if (n) n.read = true;
  return { ok: true };
});

route("POST", "/notifications/read-all", ({ db, user }) => {
  db.notifications.forEach((n) => {
    if (n.userId === user.id) n.read = true;
  });
  return { ok: true };
});

// ---------------------------------------------------------------- dispatch

const MUTATING = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export async function handleMockRequest<T>(
  method: string,
  url: string,
  body: unknown,
  token: string | null
): Promise<T> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 120 + Math.random() * 250));
  const [path, qs] = url.split("?");
  const db = load();
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = r.pattern.exec(path);
    if (!m) continue;
    const user = userFromToken(db, token);
    if (!r.public && !user) throw fail("UNAUTHORIZED", "Your session has expired. Please sign in again.", 401);
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    const result = r.handler({
      db,
      user: user as UserRow,
      params,
      query: new URLSearchParams(qs ?? ""),
      body: (body ?? {}) as Record<string, unknown>,
    });
    if (MUTATING.has(method)) save(db);
    // structuredClone so callers never mutate the "database"
    return structuredClone(result) as T;
  }
  throw fail("NOT_FOUND", `No mock route for ${method} ${path}`, 404);
}

export const DEMO_ACCOUNTS: { role: Role; email: string; name: string }[] = [
  { role: "OWNER", email: "priya@example.com", name: "Priya (NRI owner, 2 properties)" },
  { role: "OWNER", email: "arvind@example.com", name: "Arvind (investor, 3 properties)" },
  { role: "INSPECTOR", email: "ravi@example.com", name: "Ravi (inspector, job today)" },
  { role: "ADMIN", email: "admin@groundpulse.in", name: "Anita (admin)" },
  { role: "PROVIDER", email: "imran@example.com", name: "Imran (electrician)" },
  { role: "PROVIDER", email: "deepa@example.com", name: "Deepa (locksmith, Mumbai)" },
];
