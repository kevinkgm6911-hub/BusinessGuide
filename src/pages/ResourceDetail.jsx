import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import resourcesData from "../data/resources.json";
import {
  STARTER_SLUGS,
  percentComplete,
  isDone,
  setDone,
} from "../lib/progress";
import { getGuideBySlug } from "../content/guides/index.js";

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

/* 🧭 Sticky Starter Path Ribbon */
function StickyStepRibbon({ slug }) {
  const idx = STARTER_SLUGS.indexOf(slug);
  if (idx === -1) return null;

  const [pct, setPct] = useState(percentComplete());
  const done = isDone(slug);
  const prev = idx > 0 ? STARTER_SLUGS[idx - 1] : null;
  const next =
    idx < STARTER_SLUGS.length - 1 ? STARTER_SLUGS[idx + 1] : null;

  useEffect(() => {
    const onFocus = () => setPct(percentComplete());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

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
              onClick={() => {
                setDone(slug, !done);
                setPct(percentComplete());
              }}
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

/* 🧩 Main component */
export default function ResourceDetail() {
  const { slug } = useParams();

  // --- MDX Guide Path ---
  const mdxGuide = getGuideBySlug?.(slug);
  if (mdxGuide) {
    const { meta, Content } = mdxGuide;

    return (
      <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link to="/resources" className="text-gray-400 hover:text-orange-400">
              ← Back to Resources
            </Link>
          </div>

          <StickyStepRibbon slug={slug} />

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
            <h1 className="mt-2 text-4xl font-extrabold">{meta.title}</h1>
            {meta.description && (
              <p className="mt-2 text-gray-300">{meta.description}</p>
            )}
          </div>

          {/* Body */}
          <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24">
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
            <Link to="/resources" className="text-gray-400 hover:text-orange-400">
              ← Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Fallback: JSON resource path ---
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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link to="/resources" className="text-gray-400 hover:text-orange-400">
            ← Back to Resources
          </Link>
        </div>

        <StickyStepRibbon slug={slug} />

        <h1 className="text-4xl font-extrabold mb-4">{resource.title}</h1>
        <span className="inline-block text-sm font-semibold text-orange-400 mb-6">
          {resource.category}
        </span>

        {/* Downloads */}
        {Array.isArray(resource.downloads) && resource.downloads.length > 0 && (
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

        {/* Sections */}
        <div className="space-y-10">
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
        </div>

        <div className="mt-12">
          <Link
            to="/resources"
            className="text-gray-400 hover:text-orange-400 transition"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
