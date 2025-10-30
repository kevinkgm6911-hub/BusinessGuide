import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import resourcesData from "../data/resources.json";

// ⬇️ NEW: MDX guide loader (from the setup we added)
import { getGuideBySlug } from "../content/guides/index.js";

// Localized MDX element mappings (no global MDXProvider)
const mdxComponents = {
  h1: (p) => <h1 className="text-3xl font-semibold mt-6" {...p} />,
  h2: (p) => <h2 className="text-2xl font-semibold mt-6" {...p} />,
  h3: (p) => <h3 className="text-xl font-semibold mt-5" {...p} />,
  p:  (p) => <p className="mt-3 text-gray-200" {...p} />,
  a:  (p) => <a className="text-orange-400 hover:underline" {...p} />,
  ul: (p) => <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-200" {...p} />,
  ol: (p) => <ol className="list-decimal pl-5 mt-3 space-y-1 text-gray-200" {...p} />,
};

export default function ResourceDetail() {
  const { slug } = useParams();

  // 1) Prefer MDX guide if present
  const mdxGuide = getGuideBySlug?.(slug);
  if (mdxGuide) {
    const { meta, Content } = mdxGuide;

    return (
      <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
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

          {/* Optional downloads (if provided via meta.downloads) */}
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

  // 2) Fallback: your existing JSON-based resources
  const resource = resourcesData.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg text-gray-400">❌ Resource not found for slug: {slug}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4">{resource.title}</h1>

        {/* Category */}
        <span className="inline-block text-sm font-semibold text-orange-400 mb-6">
          {resource.category}
        </span>

        {/* ✅ Replaced PDF button with optional downloads */}
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

        {/* Back link */}
        <div className="mt-12">
          <Link to="/resources" className="text-gray-400 hover:text-orange-400 transition">
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
