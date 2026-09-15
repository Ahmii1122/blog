import { getSettingRows, upsertSetting } from "@/lib/data";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  youtubeChannelUrl: string;
  about: string;
};

export const defaultSettings: SiteSettings = {
  siteName: "Case Files",
  tagline: "Crime stories explained — the facts, the people, the timeline.",
  youtubeChannelUrl: "",
  about:
    "This is the companion archive for the channel: full written case files, people involved, timelines, and sources that do not fit in a video.",
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await getSettingRows();
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return {
      siteName: map.siteName || defaultSettings.siteName,
      tagline: map.tagline || defaultSettings.tagline,
      youtubeChannelUrl: map.youtubeChannelUrl || defaultSettings.youtubeChannelUrl,
      about: map.about || defaultSettings.about,
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(next: SiteSettings) {
  const entries = Object.entries(next) as [keyof SiteSettings, string][];
  for (const [key, value] of entries) {
    await upsertSetting(key, value);
  }
}
