// Eagerly import all MDX files in this folder
const modules = import.meta.glob("./*.mdx", { eager: true });

// Build slug -> { meta, Content } map
const guides = {};
for (const path in modules) {
  const mod = modules[path];
  const meta = mod.meta || {};
  const Content = mod.default;
  if (meta?.slug) guides[meta.slug] = { meta, Content };
}

export function getGuideBySlug(slug) {
  return guides[slug] || null;
}

export function listGuides() {
  return Object.values(guides).map(({ meta }) => meta);
}
