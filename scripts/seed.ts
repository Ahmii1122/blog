import { readFileSync } from "fs";
import { resolve } from "path";
import { connectMongo } from "../lib/mongo";
import { Category, Setting, Story } from "../lib/models";

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Next.js already loads .env during `next dev` / `next build`.
  }
}

loadEnv();

async function main() {
  await connectMongo();

  const existing = await Story.countDocuments();
  if (existing > 0) {
    console.log("MongoDB already has cases. Skipping seed.");
    return;
  }

  await Setting.deleteMany({});
  await Category.deleteMany({});

  await Setting.insertMany([
    { key: "siteName", value: "Crime Codex" },
    {
      key: "tagline",
      value: "Crime stories explained — the facts, the people, the timeline.",
    },
    { key: "youtubeChannelUrl", value: "" },
    {
      key: "about",
      value:
        "Crime Codex is the written archive behind the channel. Each episode gets a full case page: the story in text, the people involved, a timeline of events, sources, and any photos or clips that belong with the file.\n\nThe videos stay visual-free by design. This site is where the rest of the case lives — so viewers can slow down, re-read, and follow every beat.\n\nUpload only media you have the right to use.",
    },
  ]);

  const unsolved = await Category.create({
    name: "Unsolved",
    slug: "unsolved",
    description: "Cases still without a definitive ending.",
  });

  await Category.insertMany([
    {
      name: "True Crime",
      slug: "true-crime",
      description: "Documented crimes, reconstructed in full.",
    },
    {
      name: "Heist",
      slug: "heist",
      description: "Robberies, cons, and vanishing loot.",
    },
    {
      name: "Cold Case",
      slug: "cold-case",
      description: "Files that went quiet — then didn't.",
    },
  ]);

  await Story.create({
    slug: "the-hollow-bridge-vanishing",
    title: "The Hollow Bridge Vanishing",
    excerpt:
      "A night train, a fog-bound river crossing, and a courier who never reached the other side. This sample case shows how a file looks on the site.",
    content: `On a wet October night in 1994, a locked courier satchel left Central Station on the last train west. The satchel was meant to reach a riverside depot before dawn. It never did.

The train crossed Hollow Bridge at 1:14 a.m. Fog sat on the water. The conductor later said the cars felt "too quiet" after the span — not empty, just wrong. At the next stop, seat 14B was vacant. The satchel was gone. The window latch was open to the river.

## What we know

No ticket was scanned after the bridge. No body was recovered from the current. The official report called it a disappearance in transit and closed the file in fourteen months.

This written case is a **sample** so the archive is not empty when you first open the site. Replace it with a real file from the admin panel.

## Why it still matters

Vanishing-in-transit cases are built from gaps: a timestamp, a missing object, a witness who almost saw something. The video can walk the beats. This page holds the rest — names, dates, and the order of events — so nothing important has to be rushed.`,
    location: "Hollow Bridge, West River Line",
    year: 1994,
    status: "unsolved",
    tags: "vanishing, transit, sample",
    published: true,
    featured: true,
    publishedAt: new Date(),
    categoryId: unsolved._id,
    people: [
      {
        name: "Evan Calder",
        role: "other",
        bio: "Courier assigned to the overnight satchel. Last confirmed at Central Station at 12:41 a.m.",
        order: 0,
      },
      {
        name: "Mara Quinn",
        role: "witness",
        bio: "Passenger in 14A. Reported the open window and an empty seat after the bridge.",
        order: 1,
      },
      {
        name: "Inspector Hale",
        role: "investigator",
        bio: "Led the transit inquiry. Closed the file in 1996 with no recovery.",
        order: 2,
      },
    ],
    timeline: [
      {
        date: "12 Oct 1994, 12:41 a.m.",
        title: "Satchel logged at Central Station",
        description: "Courier checked in. Train departed on time.",
        order: 0,
      },
      {
        date: "12 Oct 1994, 1:14 a.m.",
        title: "Train crosses Hollow Bridge",
        description: "Fog on the river. No emergency stop.",
        order: 1,
      },
      {
        date: "12 Oct 1994, 1:31 a.m.",
        title: "Seat 14B found empty",
        description: "Window latch open. Satchel missing.",
        order: 2,
      },
      {
        date: "1996",
        title: "Inquiry closed",
        description: "No recovery. Status remains unsolved.",
        order: 3,
      },
    ],
    sources: [
      {
        title: "Replace this with a real source",
        url: "https://example.com",
        order: 0,
      },
    ],
  });

  console.log("Seeded MongoDB with sample case files.");
}

main()
  .then(async () => {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
