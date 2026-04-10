import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Trash2, Edit2, Plus, X, Check } from "lucide-react";
import { useAuth } from "../AuthContext";
import { usePosts, createPost, updatePost, deletePost } from "../hooks/usePosts";
import { useProducts, createProduct, updateProduct, deleteProduct } from "../hooks/useProducts";

// ── Slug helper ───────────────────────────────────────────────
function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Post Form ────────────────────────────────────────────────
const BLANK_POST = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "trip-report",
  tags: "",
  featuredImage: "",
};

function PostForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, tags: (initial.tags ?? []).join(", ") }
      : BLANK_POST
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "title" && !initial) next.slug = toSlug(value);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.slug) return;
    setSaving(true);
    setError(null);
    try {
      const data = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-forest-card border border-moss/20 rounded-2xl p-6 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Title *">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            className={inputCls}
            placeholder="My May Snake River Report"
          />
        </Field>
        <Field label="Slug *">
          <input
            value={form.slug}
            onChange={(e) => set("slug", toSlug(e.target.value))}
            required
            className={inputCls}
            placeholder="my-may-snake-river-report"
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          >
            <option value="trip-report">Trip Report</option>
            <option value="gear">Gear</option>
            <option value="economy">Economy</option>
            <option value="tips">Tips & Tactics</option>
          </select>
        </Field>
        <Field label="Tags (comma-separated)">
          <input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            className={inputCls}
            placeholder="trout, wyoming, fly-fishing"
          />
        </Field>
        <Field label="Featured Image URL" className="sm:col-span-2">
          <input
            value={form.featuredImage}
            onChange={(e) => set("featuredImage", e.target.value)}
            className={inputCls}
            placeholder="https://..."
          />
        </Field>
      </div>
      <Field label="Excerpt (shown on cards)">
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          className={inputCls}
          placeholder="A short 1–2 sentence summary."
        />
      </Field>
      <Field label="Body (Markdown)">
        <textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          rows={14}
          className={`${inputCls} font-mono text-xs`}
          placeholder={`## Opening\n\nWrite your post in Markdown...\n\n## Gear Used\n\n- Rod: ...\n- Reel: ...`}
        />
      </Field>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-moss hover:bg-moss-light text-offwhite text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <Check size={14} />
          {saving ? "Saving…" : initial ? "Update Post" : "Publish Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 bg-forest border border-moss/20 text-slate hover:text-offwhite text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Product Form ─────────────────────────────────────────────
const BLANK_PRODUCT = {
  name: "",
  description: "",
  price: "",
  images: "",
  variants: "",
  stripeLink: "",
  category: "apparel",
  inStock: true,
};

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          images: (initial.images ?? []).join(", "),
          variants: (initial.variants ?? []).join(", "),
          price: initial.price ?? "",
        }
      : BLANK_PRODUCT
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price) || 0,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        variants: form.variants.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-forest-card border border-moss/20 rounded-2xl p-6 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Product Name *">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className={inputCls}
            placeholder="Dual Waters Hat"
          />
        </Field>
        <Field label="Price (USD) *">
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
            className={inputCls}
            placeholder="32.00"
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          >
            <option value="apparel">Apparel</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="In Stock">
          <select
            value={form.inStock ? "true" : "false"}
            onChange={(e) => set("inStock", e.target.value === "true")}
            className={inputCls}
          >
            <option value="true">In Stock</option>
            <option value="false">Sold Out</option>
          </select>
        </Field>
        <Field label="Variants (comma-separated)" className="sm:col-span-2">
          <input
            value={form.variants}
            onChange={(e) => set("variants", e.target.value)}
            className={inputCls}
            placeholder="S, M, L, XL  (or leave blank for one-size)"
          />
        </Field>
        <Field label="Image URLs (comma-separated)" className="sm:col-span-2">
          <input
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            className={inputCls}
            placeholder="https://..."
          />
        </Field>
        <Field label="Stripe Payment Link (optional)" className="sm:col-span-2">
          <input
            value={form.stripeLink}
            onChange={(e) => set("stripeLink", e.target.value)}
            className={inputCls}
            placeholder="https://buy.stripe.com/..."
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputCls}
          placeholder="Short product description shown on the product page."
        />
      </Field>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-moss hover:bg-moss-light text-offwhite text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <Check size={14} />
          {saving ? "Saving…" : initial ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 bg-forest border border-moss/20 text-slate hover:text-offwhite text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Posts Tab ────────────────────────────────────────────────
function PostsTab() {
  const { posts, loading } = usePosts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function handleCreate(data) {
    await createPost(data);
    setShowForm(false);
  }

  async function handleUpdate(data) {
    await updatePost(editing.id, data);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
  }

  return (
    <div className="space-y-6">
      {!showForm && !editing && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-moss hover:bg-moss-light text-offwhite text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={14} />
          New Post
        </button>
      )}

      {showForm && (
        <PostForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <PostForm
          initial={editing}
          onSave={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-slate text-sm">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 bg-forest-card border border-moss/15 rounded-xl px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-offwhite text-sm font-medium truncate">
                  {post.title}
                </p>
                <p className="text-slate text-xs truncate">/blog/{post.slug}</p>
              </div>
              <span className="text-xs bg-moss/20 text-moss-light px-2 py-0.5 rounded-full shrink-0">
                {post.category}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditing(post); setShowForm(false); }}
                  className="text-slate hover:text-offwhite transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-slate hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Products Tab ─────────────────────────────────────────────
function ProductsTab() {
  const { products, loading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function handleCreate(data) {
    await createProduct(data);
    setShowForm(false);
  }

  async function handleUpdate(data) {
    await updateProduct(editing.id, data);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
  }

  return (
    <div className="space-y-6">
      {!showForm && !editing && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-moss hover:bg-moss-light text-offwhite text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={14} />
          Add Product
        </button>
      )}

      {showForm && (
        <ProductForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editing && (
        <ProductForm
          initial={editing}
          onSave={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-slate text-sm">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-forest-card border border-moss/15 rounded-xl px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-offwhite text-sm font-medium truncate">
                  {product.name}
                </p>
                <p className="text-amber text-xs">${product.price?.toFixed(2)}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  product.inStock
                    ? "bg-moss/20 text-moss-light"
                    : "bg-slate/20 text-slate"
                }`}
              >
                {product.inStock ? "In Stock" : "Sold Out"}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditing(product); setShowForm(false); }}
                  className="text-slate hover:text-offwhite transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-slate hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared helpers ───────────────────────────────────────────
const inputCls =
  "w-full bg-forest border border-moss/30 text-offwhite placeholder-slate text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-moss";

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Admin Page ───────────────────────────────────────────────
export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState("posts");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin — Dual Waters Outdoors</title>
      </Helmet>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-2">
            Admin
          </p>
          <h1 className="font-display text-4xl font-bold text-offwhite">
            Content Manager
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["posts", "products"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-moss text-offwhite"
                  : "bg-forest-card border border-moss/20 text-slate hover:text-offwhite"
              }`}
            >
              {t === "posts" ? "Blog Posts" : "Shop Products"}
            </button>
          ))}
        </div>

        {tab === "posts" ? <PostsTab /> : <ProductsTab />}
      </main>
    </>
  );
}
