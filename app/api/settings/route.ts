import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getSettings, saveSettings, type SiteSettings } from "@/lib/settings";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<SiteSettings>;
  const current = await getSettings();
  const next: SiteSettings = {
    siteName: body.siteName?.trim() || current.siteName,
    tagline: body.tagline ?? current.tagline,
    youtubeChannelUrl: body.youtubeChannelUrl ?? current.youtubeChannelUrl,
    about: body.about ?? current.about,
  };
  await saveSettings(next);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
  return NextResponse.json(next);
}
