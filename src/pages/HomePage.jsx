import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import BlogCard from "../components/BlogCard";
import { usePosts } from "../hooks/usePosts";
import { subscribeEmail } from "../hooks/useEmailSubscribe";

// ─── Replace with your YouTube video ID ───────────────────────
// e.g. for https://youtu.be/abc123  →  "abc123"
const YOUTUBE_VIDEO_ID = "hTW0OHjqVrc";
const YOUTUBE_CHANNEL_URL = "https://youtube.com/@Dual_Waters";

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeEmail(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-forest-card border border-moss/20 rounded-2xl px-6 py-12 sm:px-12 text-center">
      <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-3">
        Free Updates
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-offwhite mb-3">
        Don't Miss a Drop
      </h2>
      <p className="text-slate max-w-md mx-auto mb-8 text-sm leading-relaxed">
        New videos, seasonal trip reports, and other outdoor blogs — no spam, ever.
      </p>
      {status === "success" ? (
        <p className="text-moss font-semibold text-lg">You're on the list.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-forest border border-moss/30 text-offwhite placeholder-slate text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-moss"
          />
          <button
            type="submit"
            className="bg-amber hover:bg-amber-dark text-forest-dark font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">Something went wrong. Try again.</p>
      )}
    </section>
  );
}

export default function HomePage() {
  const { posts, loading } = usePosts({ max: 3 });

  return (
    <>
      <Helmet>
        <title>Dual Waters Outdoors — Fishing, Gear & the Outdoor Economy</title>
        <meta
          name="description"
          content="Trip reports, gear reviews, and outdoor economy content from the Dual Waters Outdoors YouTube channel."
        />
      </Helmet>

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/70 via-forest-dark/50 to-forest" />

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-4">
              Dual Waters Outdoors
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-offwhite leading-tight mb-6">
              Dual Waters.
              <br />
              <span className="text-amber">One Channel.</span>
            </h1>
            <p className="text-slate text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Taking on the outdoors through fly-fishing, hunting, camping and
              cooking.<br />One weekend at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
                Watch on YouTube
              </a>
              <Link
                to="/blog"
                className="w-full sm:w-auto flex items-center justify-center gap-1 border border-moss/40 hover:border-moss text-offwhite font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Read the Blog
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate/40 text-xs tracking-widest uppercase">
            scroll
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-20">
          {/* ── Latest YouTube Video ─────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-2">
                  Latest Video
                </p>
                <h2 className="font-display text-3xl font-bold text-offwhite">
                  On the Channel
                </h2>
              </div>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate hover:text-offwhite transition-colors flex items-center gap-1"
              >
                All videos <ChevronRight size={14} />
              </a>
            </div>

            {YOUTUBE_VIDEO_ID === "YOUR_VIDEO_ID" ? (
              <div className="aspect-video bg-forest-card border border-dashed border-moss/20 rounded-2xl flex flex-col items-center justify-center gap-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-red-600/40">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
                <p className="text-slate text-sm">
                  Set <code className="text-amber">YOUTUBE_VIDEO_ID</code> in{" "}
                  <code className="text-slate/80">src/pages/HomePage.jsx</code>
                </p>
              </div>
            ) : (
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                  title="Latest Dual Waters Outdoors video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
          </section>

          {/* ── Latest Posts ────────────────────────────────── */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-2">
                  From the Blog
                </p>
                <h2 className="font-display text-3xl font-bold text-offwhite">
                  Latest Posts
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-sm text-slate hover:text-offwhite transition-colors flex items-center gap-1"
              >
                All posts <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-forest-card border border-moss/10 rounded-xl h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-forest-card border border-dashed border-moss/15 rounded-xl py-16 text-center">
                <p className="text-slate text-sm">Posts coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* ── Email Capture ───────────────────────────────── */}
          <EmailCapture />
        </div>
      </main>
    </>
  );
}
