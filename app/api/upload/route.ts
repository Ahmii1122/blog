import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { isCaseId, uploadCaseFile } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["video/quicktime", "mov"],
]);

const KINDS = new Set(["cover", "people", "media"]);

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const storyId = String(form.get("storyId") ?? "");
  const kind = String(form.get("kind") ?? "media");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!isCaseId(storyId) || !KINDS.has(kind)) {
    return NextResponse.json({ error: "Each case needs its own folder. Missing case id." }, { status: 400 });
  }

  const extFromType = ALLOWED.get(file.type);
  const originalExt = path.extname(file.name).replace(".", "").toLowerCase();
  const ext =
    extFromType ||
    (["jpg", "jpeg", "png", "webp", "gif", "mp4", "webm", "mov"].includes(originalExt) ? originalExt : null);

  if (!ext) {
    return NextResponse.json(
      { error: "Only images (jpg, png, webp, gif) and videos (mp4, webm, mov) are allowed" },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`;
  const fileKind = file.type.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext) ? "video" : "image";

  try {
    const uploaded = await uploadCaseFile({
      storyId,
      kind: kind as "cover" | "people" | "media",
      filename,
      bytes,
      contentType: file.type || (fileKind === "video" ? "video/mp4" : "image/jpeg"),
    });
    return NextResponse.json({ url: uploaded.url, type: fileKind, path: uploaded.path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
