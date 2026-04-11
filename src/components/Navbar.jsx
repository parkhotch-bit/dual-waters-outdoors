import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";

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
import { useAuth } from "../AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogOut() {
    await logOut();
    navigate("/");
  }

  const navLink =
    "text-slate hover:text-offwhite transition-colors text-sm font-medium";
  const active = (path) =>
    location.pathname.startsWith(path) ? "text-offwhite" : "";

  return (
    <nav className="sticky top-0 z-50 bg-forest-dark/90 border-b border-moss/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-moss/20 border border-moss/40 flex items-center justify-center overflow-hidden">
              <img
                src="/new.png"
                alt="Dual Waters Outdoors"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-amber font-bold text-sm">DW</span>';
                }}
              />
            </div>
            <span className="font-display text-lg font-bold text-offwhite tracking-wide group-hover:text-amber transition-colors leading-tight hidden sm:block">
              Dual Waters
              <span className="text-moss"> Outdoors</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/blog" className={`${navLink} ${active("/blog")}`}>
              Blog
            </Link>
            <Link to="/shop" className={`${navLink} ${active("/shop")}`}>
              Shop
            </Link>
            <Link to="/about" className={`${navLink} ${active("/about")}`}>
              About
            </Link>

            {/* Social icons */}
            <a
              href="https://youtube.com/@Dual_Waters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-red-400 transition-colors"
              aria-label="YouTube"
            >
              <YTIcon size={18} />
            </a>
            <a
              href="https://instagram.com/dualwaters/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <IGIcon size={18} />
            </a>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-slate hover:text-offwhite transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber text-forest-dark text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </Link>

            {user && (
              <button
                onClick={handleLogOut}
                className="text-xs text-slate hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile: cart + menu */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative text-slate hover:text-offwhite">
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber text-forest-dark text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="text-slate hover:text-offwhite"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-forest-dark border-t border-moss/20 px-4 py-5 space-y-4">
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block text-slate hover:text-offwhite py-1 text-sm font-medium"
          >
            Blog
          </Link>
          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="block text-slate hover:text-offwhite py-1 text-sm font-medium"
          >
            Shop
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block text-slate hover:text-offwhite py-1 text-sm font-medium"
          >
            About
          </Link>
          <div className="flex items-center gap-5 pt-2 border-t border-moss/20">
            <a
              href="https://youtube.com/@Dual_Waters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-red-400 transition-colors"
            >
              <YTIcon size={18} />
            </a>
            <a
              href="https://instagram.com/dualwaters/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-pink-400 transition-colors"
            >
              <IGIcon size={18} />
            </a>
          </div>
          {user && (
            <button
              onClick={() => { handleLogOut(); setMenuOpen(false); }}
              className="block text-red-400 text-sm py-1"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
