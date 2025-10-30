// src/lib/resources.js
import { listGuides } from "../content/guides/index.js";

/** Normalize MDX meta for the Resource Hub */
export function getAllResources() {
  const guides = listGuides?.() || [];

  // Normalize and sort
  return guides
    .map((g) => ({
      title: g.title,
      slug: g.slug,
      category: g.category || "General",
      description: g.excerpt || g.description || "",
      difficulty: g.difficulty || "",
      duration: g.duration || "",
      thumbnail: g.thumbnail || "",
      source: "mdx",
    }))
    .sort(
      (a, b) =>
        (a.category || "").localeCompare(b.category || "") ||
        (a.title || "").localeCompare(b.title || "")
    );
}
