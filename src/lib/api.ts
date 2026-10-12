/**
 * Fake API layer.
 *
 * Every function returns a Promise after a small delay, exactly like a real
 * network call. The dashboards call these through TanStack Query, so loading
 * states, caching and refetching all behave like production.
 *
 * Swapping to the real backend later = replacing the body of each function
 * with `fetch(`${API_URL}/properties`)`. No component needs to change.
 */
import {
  checklist,
  healthTrend,
  inspections,
  issues,
  properties,
} from "./mock-data";
import type {
  ChecklistItem,
  HealthPoint,
  Inspection,
  Issue,
  Property,
} from "./types";

/** Simulates network latency so we can see the loading skeletons. */
function delay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const api = {
  getProperties: (): Promise<Property[]> => delay(properties),

  getInspections: (): Promise<Inspection[]> => delay(inspections),

  getIssues: (): Promise<Issue[]> => delay(issues),

  getChecklist: (): Promise<ChecklistItem[]> => delay(checklist, 400),

  getHealthTrend: (): Promise<HealthPoint[]> => delay(healthTrend, 400),
};
