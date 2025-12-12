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

  const categories = useMemo(() => {
    const set = new Set(all.map((r) => r.category || "General"));
    return ["All", ...Array.from(set).sort()];
  }, [all]);

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
    <div className="py-10 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            📚 Resource Hub
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300">
            Curated guides, templates, and tools to help you launch and grow
            your side hustle.
          </p>
        </div>

        {/* Starter Path Callout */}
        {showBanner && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-10 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs sm:text-sm font-semibold text-orange-200">
                  New here? Start with the Starter Path.
                </p>
                <p className="text-xs text-orange-100/80 mt-1">
                  A short, guided sequence of 5 core steps. You&apos;re{" "}
                  <span className="font-semibold">{starterPct}%</span> complete.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/start"
                  className="rounded-xl bg-orange-500 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600"
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
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="🔍 Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-200 placeholder-gray-500 text-sm sm:text-base"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <div
                key={res.slug}
                className="bg-gray-900 rounded-xl shadow-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-orange-500/20 transition"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block text-xs sm:text-sm font-semibold text-orange-400">
                      {res.category || "General"}
                    </span>
                    {res.source === "mdx" && (
                      <span className="ml-auto rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] text-pink-300">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {res.title}
                  </h3>
                  {res.description && (
                    <p className="text-gray-400 text-sm mb-4 sm:mb-6 line-clamp-3">
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
            <p className="text-center text-gray-400 col-span-full text-sm sm:text-base">
              No resources found. Try a different search or category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
