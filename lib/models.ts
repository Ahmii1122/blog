import { randomUUID } from "crypto";
import mongoose, { Schema } from "mongoose";

const personSchema = new Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "other" },
    photo: { type: String, default: null },
    bio: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const timelineSchema = new Schema(
  {
    date: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const sourceSchema = new Schema(
  {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const mediaSchema = new Schema(
  {
    type: { type: String, default: "image" },
    path: { type: String, default: "" },
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const categorySchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

const storySchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: null },
    youtubeUrl: { type: String, default: null },
    location: { type: String, default: null },
    year: { type: Number, default: null },
    status: { type: String, default: "unsolved" },
    tags: { type: String, default: "" },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    categoryId: { type: String, ref: "Category", default: null },
    people: { type: [personSchema], default: [] },
    timeline: { type: [timelineSchema], default: [] },
    sources: { type: [sourceSchema], default: [] },
    media: { type: [mediaSchema], default: [] },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export const Story = mongoose.models.Story || mongoose.model("Story", storySchema);
export const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);
