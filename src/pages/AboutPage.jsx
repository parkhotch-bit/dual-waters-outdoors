import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@Dual_Waters";
const INSTAGRAM_URL = "https://instagram.com/dualwaters/";

function YTIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function IGIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — Dual Waters Outdoors</title>
        <meta
          name="description"
          content="The story behind Dual Waters Outdoors — a fishing and outdoor content channel covering fly fishing, saltwater, gear, and the outdoor economy."
        />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-3">
            The Story
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-offwhite">
            About Dual Waters
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          {/* Photo */}
          <div className="md:col-span-2">
            <div className="aspect-[3/4] bg-forest-card border border-moss/20 rounded-2xl overflow-hidden">
              {/* Replace with your actual photo path */}
              <img
                src="/IMG_5475.jpg"
                alt="Dual Waters Outdoors"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-6">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <YTIcon size={16} />
                YouTube
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-forest-card border border-moss/20 hover:border-moss/40 text-slate hover:text-offwhite text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <IGIcon size={16} />
                Instagram
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-3 space-y-6 text-offwhite/90 leading-relaxed">
            {/*
              ── Replace this placeholder bio with your own. ──
              Keep it personal. Talk about where you fish, what
              you cover on the channel, and why you started it.
            */}
            <p className="text-lg text-offwhite leading-relaxed">
              Dual Waters Outdoors is a YouTube channel and blog covering the
              full spectrum of fishing — from mountain trout streams to open
              saltwater flats.
            </p>
            <p className="text-slate leading-relaxed">
              The name comes from a simple idea: two different worlds, one
              obsession. Freshwater and salt. Fly rod and spinning gear. Remote
              wilderness and accessible public water. Both deserve honest
              coverage.
            </p>
            <p className="text-slate leading-relaxed">
              Alongside the fishing content, I cover the outdoor economy — the
              guides, gear brands, conservation fights, and business decisions
              that shape where and how we fish. It's a side of the industry that
              rarely gets talked about plainly.
            </p>
            <p className="text-slate leading-relaxed">
              If you're here for trip reports, gear takes you can actually trust,
              or a behind-the-scenes look at the outdoor industry — you're in the
              right place.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/blog"
                className="bg-moss hover:bg-moss-light text-offwhite font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Read the Blog
              </Link>
              <Link
                to="/shop"
                className="border border-moss/30 hover:border-moss text-offwhite font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Shop Merch
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
