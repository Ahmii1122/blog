import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
