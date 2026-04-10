import { useState } from "react";
import { Helmet } from "react-helmet-async";
import BlogCard from "../components/BlogCard";
import { usePosts } from "../hooks/usePosts";

const CATEGORIES = [
  { value: null, label: "All" },
  { value: "trip-report", label: "Trip Reports" },
  { value: "gear", label: "Gear" },
  { value: "economy", label: "Economy" },
  { value: "tips", label: "Tips & Tactics" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const { posts, loading } = usePosts({ category: activeCategory });

  return (
    <>
      <Helmet>
        <title>Blog — Dual Waters Outdoors</title>
        <meta
          name="description"
          content="Fishing trip reports, gear breakdowns, and outdoor economy content from Dual Waters Outdoors."
        />
      </Helmet>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-3">
            Dual Waters Outdoors
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-offwhite mb-4">
            The Blog
          </h1>
          <p className="text-slate max-w-xl leading-relaxed">
            Trip reports from the water, honest gear reviews, and a look at the
            business side of the outdoor industry.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === value
                  ? "bg-moss text-offwhite"
                  : "bg-forest-card border border-moss/20 text-slate hover:text-offwhite hover:border-moss/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-forest-card border border-moss/10 rounded-xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-forest-card border border-dashed border-moss/15 rounded-xl py-24 text-center">
            <p className="text-slate text-sm">
              No posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
