// src/pages/ResourceHub.jsx
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllResources } from "../lib/resources";
import { percentComplete } from "../lib/progress";

const HUB_BANNER_KEY = "starterHubBannerHidden:v1";

export default function ResourceHub() {
  const all = useMemo(() => getAllResources(), []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerHidden, setBannerHidden] = useState(() => {
    try {
      return localStorage.getItem(HUB_BANNER_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [starterPct, setStarterPct] = useState(0);

  useEffect(() => {
    setStarterPct(percentComplete());
  }, []);

  const showBanner = starterPct < 100 && !bannerHidden;

  // Build category list dynamically from merged data
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

  function handleHideBanner() {
    setBannerHidden(true);
    try {
      localStorage.setItem(HUB_BANNER_KEY, "true");
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-24 px-6">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-6">📚 Resource Hub</h1>
        <p className="text-lg text-gray-300">
          Curated guides, templates, and tools to help you launch and grow your
          side hustle.
        </p>
      </div>

      {/* Starter Path Callout */}
      {showBanner && (
        <div className="max-w-4xl mx-auto mb-10 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-semibold text-orange-200">
                New here? Start with the Starter Path.
              </p>
              <p className="text-xs text-orange-100/80 mt-1">
                A short, guided sequence of 5 core steps. You&apos;re{" "}
                <span className="font-semibold">{starterPct}%</span> complete.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/start"
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
              >
                {starterPct > 0
                  ? `Continue Starter Path (${starterPct}%)`
                  : "Start the Starter Path"}
              </Link>
              <button
                type="button"
                onClick={handleHideBanner}
                className="text-xs text-orange-100/70 hover:text-orange-100"
              >
                Hide
              </button>
            </div>
          </div>
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
