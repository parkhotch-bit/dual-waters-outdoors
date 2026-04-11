import { Link } from "react-router-dom";
import { useState } from "react";
import { subscribeEmail } from "../hooks/useEmailSubscribe";

function YTIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function IGIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null

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
    <footer className="bg-forest-dark border-t border-moss/20 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-offwhite mb-1">
              Dual Waters <span className="text-moss">Outdoors</span>
            </p>
            <p className="text-slate text-xs italic mb-2">One Weekend at a Time</p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://youtube.com/@Dual_Waters"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <YTIcon size={20} />
              </a>
              <a
                href="https://instagram.com/dualwaters/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <IGIcon size={20} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold text-slate uppercase tracking-widest mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/blog", label: "Blog" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate hover:text-offwhite transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-semibold text-slate uppercase tracking-widest mb-4">
              Stay in the Loop
            </p>
            <p className="text-slate text-sm mb-4">
              New videos, seasonal trip reports, and other outdoor blogs — no spam, ever.
            </p>
            {status === "success" ? (
              <p className="text-moss text-sm font-medium">
                You're on the list.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-forest-card border border-moss/30 text-offwhite placeholder-slate text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-moss"
                />
                <button
                  type="submit"
                  className="bg-moss hover:bg-moss-light text-offwhite text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Join
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-moss/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate text-xs">
            &copy; {new Date().getFullYear()} Dual Waters Outdoors. All rights reserved.
          </p>
          <Link to="/auth" className="text-slate/30 hover:text-slate text-xs transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
