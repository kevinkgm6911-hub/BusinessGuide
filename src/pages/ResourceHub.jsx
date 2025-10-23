import { useState } from "react";
import { Link } from "react-router-dom";
import resourcesData from "../data/resources.json";

export default function ResourceHub() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Legal", "Finance", "Marketing", "Tech", "Productivity"];

  // Filter resources by category + search
  const filteredResources = resourcesData.filter((res) => {
    const matchesCategory =
      selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                <span className="inline-block text-sm font-semibold text-orange-400 mb-2">
                  {res.category}
                </span>
                <h3 className="text-2xl font-bold mb-3">{res.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{res.description}</p>
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
