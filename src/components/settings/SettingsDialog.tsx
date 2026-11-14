"use client";

/**
 * Settings modal (UX screen 9): theme toggle, notification channel, account
 * info, privacy notice. Also hosts the "reset demo data" action in mock mode.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Monitor, Moon, RotateCcw, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VerifiedBadge } from "@/components/issue/IssueParts";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useSaveNotificationChannel, useUpdateMe } from "@/hooks/useAuth";
import { config } from "@/lib/config";
import { errorMessage } from "@/lib/errors";
import type { NotificationChannel } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { ROLE_LABEL, useAuthStore } from "@/stores/authStore";
import { usePreferencesStore, type ThemePreference } from "@/stores/preferencesStore";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().max(20).optional(),
});

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 rounded-xl bg-surface-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors", value === o.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme, notificationChannel, setNotificationChannel } = usePreferencesStore();
  const saveChannel = useSaveNotificationChannel();
  const updateMe = useUpdateMe();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Settings" size="md">
      <div className="space-y-7">
        <section>
          <h3 className="mb-2 text-sm font-semibold">Appearance</h3>
          <Segmented<ThemePreference>
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
              { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
              { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
            ]}
          />
        </section>

        <section>
          <h3 className="mb-1 text-sm font-semibold">Notifications</h3>
          <p className="mb-2 text-xs text-muted">How should we tell you when a report is ready or something needs your decision?</p>
          <Segmented<NotificationChannel>
            label="Notification channel"
            value={notificationChannel}
            onChange={(c) => {
              setNotificationChannel(c);
              saveChannel.mutate(c, { onSuccess: () => toast.success("Notification preference saved") });
            }}
            options={[
              { value: "EMAIL", label: "Email" },
              { value: "IN_APP", label: "In-app" },
              { value: "BOTH", label: "Both" },
            ]}
          />
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Account</h3>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">{user.email}</span>
            <Badge tone="blue">{ROLE_LABEL[user.role]}</Badge>
            {(user.role === "INSPECTOR" || user.role === "PROVIDER") &&
              (user.verified ? <VerifiedBadge /> : <Badge tone="amber">Verification pending</Badge>)}
            <span className="text-xs text-subtle">Member since {formatDate(user.createdAt)}</span>
          </div>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit((v) =>
              updateMe.mutate(v, {
                onSuccess: () => toast.success("Profile updated"),
                onError: (e) => toast.error("Couldn't update profile", { description: errorMessage(e) }),
              })
            )}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="set-name" className="mb-1.5 block text-xs font-medium text-muted">Full name</label>
                <Input id="set-name" error={form.formState.errors.name?.message} {...form.register("name")} />
              </div>
              <div>
                <label htmlFor="set-phone" className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
                <Input id="set-phone" error={form.formState.errors.phone?.message} {...form.register("phone")} />
              </div>
            </div>
            <Button type="submit" size="sm" variant="outline" loading={updateMe.isPending} disabled={!form.formState.isDirty}>
              Save profile
            </Button>
          </form>
        </section>

        <section className="flex gap-3 rounded-xl bg-surface-2 p-4 text-sm">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <p className="text-muted">
            <span className="font-medium text-ink">Privacy. </span>
            Your property media is stored securely and only visible to verified, assigned users.
          </p>
        </section>

        {config.useMockApi && (
          <section className="rounded-xl border border-dashed border-line p-4">
            <h3 className="text-sm font-semibold">Demo data</h3>
            <p className="mt-1 text-xs text-muted">The app is running on the built-in mock API. Reset to restore the original sample properties, jobs and issues.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={async () => {
                const { resetMockDb } = await import("@/lib/mock/server");
                resetMockDb();
                localStorage.removeItem("gp_checklist_drafts");
                window.location.reload();
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Button>
          </section>
        )}
      </div>
    </Dialog>
  );
}
