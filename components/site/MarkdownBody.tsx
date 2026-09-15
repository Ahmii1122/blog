"use client";

import Markdown from "react-markdown";

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="story-body">
      <Markdown>{content}</Markdown>
    </div>
  );
}
