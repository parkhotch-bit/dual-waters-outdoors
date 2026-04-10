import { Link } from "react-router-dom";

const CATEGORY_LABELS = {
  "trip-report": "Trip Report",
  gear: "Gear",
  economy: "Economy",
  tips: "Tips & Tactics",
};

const CATEGORY_COLORS = {
  "trip-report": "bg-moss/20 text-moss-light",
  gear: "bg-earth/20 text-earth-light",
  economy: "bg-amber/20 text-amber",
  tips: "bg-slate/20 text-slate",
};

export default function BlogCard({ post }) {
  const { title, slug, excerpt, category, featuredImage, publishedAt } = post;

  const dateStr = publishedAt?.toDate
    ? publishedAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      to={`/blog/${slug}`}
      className="group block bg-forest-card border border-moss/15 rounded-xl overflow-hidden hover:border-moss/40 transition-colors"
    >
      {/* Featured image */}
      <div className="aspect-[16/9] bg-forest overflow-hidden">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate/30 text-4xl">~</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Category badge */}
        {category && (
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${
              CATEGORY_COLORS[category] ?? "bg-slate/20 text-slate"
            }`}
          >
            {CATEGORY_LABELS[category] ?? category}
          </span>
        )}

        <h3 className="font-display text-lg font-bold text-offwhite leading-snug mb-2 group-hover:text-amber transition-colors">
          {title}
        </h3>

        {excerpt && (
          <p className="text-slate text-sm leading-relaxed line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}

        {dateStr && (
          <p className="text-slate/60 text-xs">{dateStr}</p>
        )}
      </div>
    </Link>
  );
}
