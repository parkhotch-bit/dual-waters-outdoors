import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "reset"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-forest border border-moss/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-offwhite placeholder:text-slate focus:outline-none focus:border-moss";

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-2xl font-bold text-offwhite">
            Dual Waters <span className="text-moss">Outdoors</span>
          </p>
          <p className="text-slate text-xs mt-1">Site Admin</p>
        </div>

        <div className="bg-forest-card border border-moss/20 rounded-2xl p-6">
          {/* Reset password */}
          {mode === "reset" && (
            <div>
              <h2 className="text-offwhite font-semibold text-sm mb-1">
                Reset your password
              </h2>
              <p className="text-slate text-xs mb-4">
                Enter your email and we'll send a reset link.
              </p>
              {resetSent ? (
                <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
                  Check your email for a reset link.
                </p>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  {error && <ErrorMsg msg={error} />}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-moss hover:bg-moss-light disabled:opacity-60 text-offwhite font-semibold py-3 rounded-xl transition-colors"
                  >
                    {loading ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>
              )}
              <button
                onClick={() => { setMode("signin"); setError(""); setResetSent(false); }}
                className="text-xs text-slate hover:text-offwhite mt-4 block transition-colors"
              >
                ← Back to sign in
              </button>
            </div>
          )}

          {/* Sign in / Sign up */}
          {mode !== "reset" && (
            <>
              <div className="flex gap-1 bg-forest rounded-xl p-1 mb-6">
                {["signin", "signup"].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      mode === m
                        ? "bg-moss text-offwhite"
                        : "text-slate hover:text-offwhite"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={inputCls}
                  />
                </div>

                {mode === "signin" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setMode("reset"); setError(""); }}
                      className="text-xs text-slate hover:text-offwhite transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && <ErrorMsg msg={error} />}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-moss hover:bg-moss-light disabled:opacity-60 text-offwhite font-semibold py-3 rounded-xl transition-colors"
                >
                  {loading
                    ? "Please wait…"
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
      <AlertCircle size={13} className="shrink-0 mt-0.5" />
      {msg}
    </div>
  );
}
