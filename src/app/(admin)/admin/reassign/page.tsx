import View from "./view";

// Rendered client-side after the browser-held session is checked (see AppShell),
// so this segment opts out of instant-navigation validation.
export const instant = false;

export default function Page() {
  return <View />;
}
