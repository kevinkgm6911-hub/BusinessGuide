import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllResources } from "../lib/resources";
import { percentComplete, onProgress } from "../lib/progress";

export default function ResourceHub() {
  const all = useMemo(() => getAllResources(), []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Starter Path state
  const [progress, setProgress] = useState(percentComplete());
  const [showCallout, setShowCallout] = useState(false);
  const [wasHidden, setWasHidden] = useState(
    () => localStorage.getItem("hideStarterCallout") === "true"
  );

  // Initialize visibility + react to progress changes from elsewhere
  useEffect(() => {
    const decide = () => {
      const p = percentComplete();
      setProgress(p);
      const hidden = localStorage.getItem("hideStarterCallout") === "true";
      setWasHidden(hidden);
      // show if not hidden and not complete
      setShowCallout(!hidden && p < 100);
    };
    // initial
    decide();
    // subscribe to progress bus (header toggles, other tabs, etc.)
    const off = onProgress(decide);
    return off;
  }, []);

  // Build category list dynamically
  const categories = useMemo(() => {
    const set = new Set(all.map((r) => r.category || "General"));
    return ["All", ...Array.from(set).sort()];
  }, [all]);

  // Filter by category + search
  const filteredResources = all.filter((res) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (res.category || "General") === selectedCategory;
    const hay = `${res.title} ${res.description} ${res.category}`.toLowerCase();
    const matchesSearch = hay.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-6">📚 Resource Hub</h1>
        <p className="text-lg text-gray-300">
          Curated guides, templates, and tools to help you launch and grow your side hustle.
        </p>
      </div>

      {/* ✅ Starter Path Callout (visible) */}
      {showCallout && progress < 100 && (
        <div className="max-w-4xl mx-auto mb-10 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-6 py-6 text-center relative">
          <button
            onClick={() => {
              setShowCallout(false);
              localStorage.setItem("hideStarterCallout", "true");
              setWasHidden(true);
            }}
            className="absolute top-3 right-4 text-pink-300 hover:text-pink-400 text-sm"
            aria-label="Dismiss"
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold text-pink-300 mb-2">
            🌟 New to Side Hustles? Start Here!
          </h3>
          <p className="text-gray-300 mb-4">
            Follow our <strong>5-Step Starter Path</strong> to go from idea → plan → launch.
          </p>
          <div className="flex justify-center mb-3">
            <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">{progress}% complete</p>
          <Link
            to="/start"
            className="inline-block px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-sm font-semibold"
          >
            🚀 Continue Starter Path
          </Link>
        </div>
      )}

      {/* ✅ Starter Path “hidden” bar (collapsed state) */}
      {!showCallout && wasHidden && progress < 100 && (
        <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
          <span className="text-xs text-gray-400">
            Starter Path is hidden ({progress}% complete)
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("hideStarterCallout");
              setWasHidden(false);
              setShowCallout(true);
            }}
            className="ml-auto rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600"
          >
            Show
          </button>
          <Link
            to="/start"
            className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold hover:bg-orange-700"
          >
            Go to Starter Path →
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <input
          type="text"
          placeholder="🔍 Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat
                ? "bg-orange-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <div
              key={res.slug}
              className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-orange-500/20 transition"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block text-sm font-semibold text-orange-400">
                    {res.category || "General"}
                  </span>
                  {res.source === "mdx" && (
                    <span className="ml-auto rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[11px] text-pink-300">
                      New
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3">{res.title}</h3>
                {res.description && (
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {res.description}
                  </p>
                )}
              </div>
              <Link
                to={`/resources/${res.slug}`}
                className="mt-auto inline-block px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-sm font-semibold text-center transition"
              >
                View Resource →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No resources found. Try a different search or category.
          </p>
        )}
      </div>
    </div>
  );
}
