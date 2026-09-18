import { unstable_cache } from "next/cache";
import { getSettingRows, upsertSetting } from "@/lib/data";
import { PUBLIC_CACHE_TAG } from "@/lib/cache";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  youtubeChannelUrl: string;
  about: string;
};

export const defaultSettings: SiteSettings = {
  siteName: "Crime Codex",
  tagline: "Crime stories explained — the facts, the people, the timeline.",
  youtubeChannelUrl: "",
  about:
    "Crime Codex is the written archive behind the channel. Each episode gets a full case page: the story in text, the people involved, a timeline of events, sources, and any photos or clips that belong with the file.\n\nThe videos stay visual-free by design. This site is where the rest of the case lives — so viewers can slow down, re-read, and follow every beat.\n\nUpload only media you have the right to use.",
};

async function loadSettings(): Promise<SiteSettings> {
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

export const getSettings = unstable_cache(loadSettings, ["public-settings"], {
  revalidate: 60,
  tags: [PUBLIC_CACHE_TAG],
});

export async function saveSettings(next: SiteSettings) {
  const entries = Object.entries(next) as [keyof SiteSettings, string][];
  for (const [key, value] of entries) {
    await upsertSetting(key, value);
  }
}
