// src/pages/ResourceDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import resourcesData from "../data/resources.json";
import { getGuideBySlug } from "../content/guides/index.js";
import {
  STARTER_SLUGS,
  percentComplete,
  isDone,
  setDone,
} from "../lib/progress";

// MDX element mapping
const mdxComponents = {
  h1: (p) => <h1 className="text-3xl font-semibold mt-6" {...p} />,
  h2: (p) => <h2 className="text-2xl font-semibold mt-6" {...p} />,
  h3: (p) => <h3 className="text-xl font-semibold mt-5" {...p} />,
  p: (p) => <p className="mt-3 text-gray-200" {...p} />,
  a: (p) => <a className="text-orange-400 hover:underline" {...p} />,
  ul: (p) => (
    <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-200" {...p} />
  ),
  ol: (p) => (
    <ol className="list-decimal pl-5 mt-3 space-y-1 text-gray-200" {...p} />
  ),
};

/* 🧭 Simple Starter Path ribbon (local only) */
function StarterRibbon({ slug }) {
  const idx = STARTER_SLUGS.indexOf(slug);
  if (idx === -1) return null;

  const [pct, setPct] = useState(percentComplete());
  const done = isDone(slug);
  const prev = idx > 0 ? STARTER_SLUGS[idx - 1] : null;
  const next =
    idx < STARTER_SLUGS.length - 1 ? STARTER_SLUGS[idx + 1] : null;

  // Refresh when tab regains focus
  useEffect(() => {
    const onFocus = () => setPct(percentComplete());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function handleToggle() {
    setDone(slug, !done);
    setPct(percentComplete());
  }

  return (
    <div className="sticky top-0 z-40 mb-6 border-b border-neutral-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="mx-auto max-w-3xl px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-pink-300 rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5">
            Starter Path: Step {idx + 1} of {STARTER_SLUGS.length}
          </span>

          <div className="ml-2 hidden h-2 w-40 overflow-hidden rounded-full bg-neutral-800 sm:block">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="hidden text-xs text-gray-400 sm:block">
            {pct}% complete
          </span>

          <div className="ml-auto flex items-center gap-2">
            {prev && (
              <Link
                to={`/resources/${prev}`}
                className="rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs text-neutral-300 hover:border-neutral-600"
              >
                ← Prev
              </Link>
            )}

            <button
              type="button"
              onClick={handleToggle}
              className={`rounded-md border px-2.5 py-1 text-xs transition ${
                done
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:border-pink-500/60"
                  : "border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
              }`}
            >
              {done ? "✓ Done" : "Mark done"}
            </button>

            {next && (
              <Link
                to={`/resources/${next}`}
                className="rounded-md bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-orange-700"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🧩 Main component with sidebar TOC */
export default function ResourceDetail() {
  const { slug } = useParams();

  const articleRef = useRef(null);
  const [toc, setToc] = useState([]);

  // Generate table of contents from headings in the article
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const headingNodes = root.querySelectorAll("h1, h2, h3");
    const items = [];
    const usedIds = new Set();

    headingNodes.forEach((el) => {
      const level = Number(el.tagName[1]); // 1, 2, or 3
      const text = (el.textContent || "").trim();
      if (!text) return;

      // Generate a slug ID from the text
      let baseId = text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (!baseId) {
        baseId = "section";
      }

      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter++}`;
      }
      usedIds.add(id);

      el.setAttribute("id", id);

      items.push({ id, text, level });
    });

    setToc(items);
  }, [slug]);

  function handleTocClick(e, id) {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // 1) MDX guide if present
  const mdxGuide = getGuideBySlug?.(slug);
  if (mdxGuide) {
    const { meta, Content } = mdxGuide;

    return (
      <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <div className="mb-4 max-w-3xl">
            <Link
              to="/resources"
              className="text-gray-400 hover:text-orange-400"
            >
              ← Back to Resources
            </Link>
          </div>

          <StarterRibbon slug={slug} />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  {meta.category && (
                    <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-0.5">
                      {meta.category}
                    </span>
                  )}
                  {meta.difficulty && <span>{meta.difficulty}</span>}
                  {meta.duration && (
                    <>
                      <span>•</span>
                      <span>{meta.duration}</span>
                    </>
                  )}
                </div>
                <h1 className="mt-2 text-4xl font-extrabold">
                  {meta.title}
                </h1>
                {meta.description && (
                  <p className="mt-2 text-gray-300">{meta.description}</p>
                )}
              </div>

              {/* Body with ref for TOC scanning */}
              <article
                ref={articleRef}
                className="prose prose-invert max-w-none prose-headings:scroll-mt-24"
              >
                <Content components={mdxComponents} />
              </article>

              {/* Downloads */}
              {Array.isArray(meta.downloads) && meta.downloads.length > 0 && (
                <div className="mt-10 space-y-3">
                  <h3 className="text-xl font-semibold">Downloads</h3>
                  <ul className="space-y-2">
                    {meta.downloads.map((d, i) => (
                      <li key={i}>
                        <a
                          href={d.file}
                          download
                          className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm hover:border-orange-500"
                        >
                          📥 {d.label || d.file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-12">
                <Link
                  to="/resources"
                  className="text-gray-400 hover:text-orange-400"
                >
                  ← Back to Resources
                </Link>
              </div>
            </div>

            {/* Sidebar TOC */}
            {toc.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur p-4">
                  <h2 className="text-sm font-semibold text-gray-200 mb-3">
                    On this page
                  </h2>
                  <nav className="space-y-1 text-xs text-gray-400">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={`block w-full text-left hover:text-orange-300 hover:bg-gray-800/70 rounded px-2 py-1 ${
                          item.level === 1
                            ? "font-semibold"
                            : item.level === 2
                            ? "pl-2"
                            : "pl-4 text-[11px]"
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2) Fallback: JSON-based resources
  const resource = resourcesData.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg text-gray-400">
          ❌ Resource not found for slug: {slug}
        </p>
      </div>
    );
  }

  // For JSON resources, we reuse the same layout + TOC
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 max-w-3xl">
          <Link
            to="/resources"
            className="text-gray-400 hover:text-orange-400"
          >
            ← Back to Resources
          </Link>
        </div>

        <StarterRibbon slug={slug} />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Title & Category */}
            <h1 className="text-4xl font-extrabold mb-4">
              {resource.title}
            </h1>
            <span className="inline-block text-sm font-semibold text-orange-400 mb-6">
              {resource.category}
            </span>

            {/* Downloads */}
            {Array.isArray(resource.downloads) &&
              resource.downloads.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">Downloads</h3>
                  <ul className="space-y-2">
                    {resource.downloads.map((d, i) => (
                      <li key={i}>
                        <a
                          href={d.file}
                          download
                          className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm hover:border-orange-500"
                        >
                          📥 {d.label || d.file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Sections in article for TOC */}
            <article
              ref={articleRef}
              className="space-y-10 prose prose-invert max-w-none prose-headings:scroll-mt-24"
            >
              {resource.sections?.map((section, idx) => (
                <div key={idx}>
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-orange-400 mb-3">
                      {section.heading}
                    </h2>
                  )}
                  {section.text && (
                    <div className="text-gray-300 leading-relaxed [&_a]:text-orange-400 [&_a:hover]:underline">
                      <ReactMarkdown>{section.text}</ReactMarkdown>
                    </div>
                  )}
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.heading || "Resource illustration"}
                      className="rounded-lg shadow-lg mt-4"
                    />
                  )}
                </div>
              ))}
            </article>

            <div className="mt-12">
              <Link
                to="/resources"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                ← Back to Resources
              </Link>
            </div>
          </div>

          {/* Sidebar TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur p-4">
                <h2 className="text-sm font-semibold text-gray-200 mb-3">
                  On this page
                </h2>
                <nav className="space-y-1 text-xs text-gray-400">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => handleTocClick(e, item.id)}
                      className={`block w-full text-left hover:text-orange-300 hover:bg-gray-800/70 rounded px-2 py-1 ${
                        item.level === 1
                          ? "font-semibold"
                          : item.level === 2
                          ? "pl-2"
                          : "pl-4 text-[11px]"
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
