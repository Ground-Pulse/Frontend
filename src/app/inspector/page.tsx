import { redirect } from "next/navigation";

/** Legacy route — inspector home now lives at /inspections. */
export default function LegacyInspectorPage() {
  redirect("/inspections");
}
