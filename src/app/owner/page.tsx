import { redirect } from "next/navigation";

/** Legacy route — the owner dashboard now lives at /dashboard. */
export default function LegacyOwnerPage() {
  redirect("/dashboard");
}
