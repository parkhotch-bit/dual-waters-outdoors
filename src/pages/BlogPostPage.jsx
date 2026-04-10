import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { usePost } from "../hooks/usePosts";

const CATEGORY_LABELS = {
  "trip-report": "Trip Report",
  gear: "Gear",
  economy: "Economy",
  tips: "Tips & Tactics",
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const { post, loading } = usePost(slug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-forest-card rounded w-2/3" />
          <div className="h-4 bg-forest-card rounded w-1/3" />
          <div className="aspect-video bg-forest-card rounded-2xl mt-8" />
          <div className="space-y-3 mt-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-forest-card rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const dateStr = post.publishedAt?.toDate
    ? post.publishedAt.toDate().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Helmet>
        <title>{post.title} — Dual Waters Outdoors</title>
        <meta name="description" content={post.excerpt || post.title} />
        {post.featuredImage && (
          <meta property="og:image" content={post.featuredImage} />
        )}
        <link
          rel="canonical"
          href={`https://dualwatersoutdoors.com/blog/${post.slug}`}
        />
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-slate hover:text-offwhite text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        {/* Category */}
        {post.category && (
          <span className="inline-block text-xs font-semibold bg-moss/20 text-moss-light px-3 py-1 rounded-full mb-4">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-offwhite leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {dateStr && (
            <span className="text-slate text-sm">{dateStr}</span>
          )}
          {post.tags?.length > 0 && (
            <>
              <span className="text-slate/30">·</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-forest-card border border-moss/20 text-slate px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-10">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body */}
        <article className="prose prose-sm max-w-none text-offwhite leading-relaxed">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="font-display text-3xl font-bold text-offwhite mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-display text-2xl font-bold text-offwhite mt-8 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-xl font-bold text-offwhite mt-6 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-offwhite/90 leading-relaxed mb-5">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-amber hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-5 text-offwhite/90">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mb-5 text-offwhite/90">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-moss pl-4 my-6 text-slate italic">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="text-offwhite font-semibold">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="text-amber bg-forest-card px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="w-full rounded-xl my-6 object-cover"
                />
              ),
              hr: () => <hr className="border-moss/20 my-8" />,
            }}
          >
            {post.body || ""}
          </ReactMarkdown>
        </article>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-moss/20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate hover:text-offwhite text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            All posts
          </Link>
        </div>
      </main>
    </>
  );
}
