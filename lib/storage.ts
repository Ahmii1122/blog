import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function getBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "blog";
}

export function getSupabase(): SupabaseClient {
  return createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isCaseId(value: string) {
  return /^[a-zA-Z0-9-]{8,80}$/.test(value);
}

async function ensureBucket() {
  const supabase = getSupabase();
  const bucket = getBucket();
  const { data } = await supabase.storage.getBucket(bucket);
  if (!data) {
    await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: "100MB",
    });
    return;
  }
  if (!data.public) {
    await supabase.storage.updateBucket(bucket, { public: true });
  }
}

export async function uploadCaseFile(input: {
  storyId: string;
  kind: "cover" | "people" | "media";
  filename: string;
  bytes: Buffer;
  contentType: string;
}) {
  if (!isCaseId(input.storyId)) {
    throw new Error("Invalid case folder");
  }

  await ensureBucket();
  const supabase = getSupabase();
  const bucket = getBucket();
  const path = `cases/${input.storyId}/${input.kind}/${input.filename}`;

  const { error } = await supabase.storage.from(bucket).upload(path, input.bytes, {
    contentType: input.contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteCaseFolder(storyId: string) {
  if (!isCaseId(storyId)) return;

  const supabase = getSupabase();
  const bucket = getBucket();
  const folders = ["cover", "people", "media"];

  for (const folder of folders) {
    const prefix = `cases/${storyId}/${folder}`;
    const { data } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
    const paths = (data ?? [])
      .filter((item) => item.name)
      .map((item) => `${prefix}/${item.name}`);
    if (paths.length) {
      await supabase.storage.from(bucket).remove(paths);
    }
  }
}
