export type PersonInput = {
  name: string;
  role: string;
  photo?: string | null;
  bio?: string;
  order?: number;
};

export type TimelineInput = {
  date: string;
  title: string;
  description?: string;
  order?: number;
};

export type SourceInput = {
  title: string;
  url?: string;
  order?: number;
};

export type MediaInput = {
  type: string;
  path: string;
  caption?: string;
  order?: number;
};

export type StoryInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  youtubeUrl?: string | null;
  location?: string | null;
  year?: number | null;
  status?: string;
  tags?: string;
  published?: boolean;
  featured?: boolean;
  categoryId?: string | null;
  people?: PersonInput[];
  timeline?: TimelineInput[];
  sources?: SourceInput[];
  media?: MediaInput[];
};
