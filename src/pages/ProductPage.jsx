import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-forest-card rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-forest-card rounded w-3/4" />
            <div className="h-6 bg-forest-card rounded w-1/4" />
            <div className="h-4 bg-forest-card rounded w-full mt-6" />
            <div className="h-4 bg-forest-card rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Allow viewing placeholder products (no Firestore doc) — redirect only for truly missing
  if (!product && id.startsWith("placeholder")) {
    return <Navigate to="/shop" replace />;
  }
  if (!product) return <Navigate to="/shop" replace />;

  const hasVariants = product.variants?.length > 0;
  const needsVariant = hasVariants && !selectedVariant;

  function handleAddToCart() {
    if (needsVariant) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? null,
      variant: selectedVariant ?? "One Size",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <Helmet>
        <title>{product.name} — Dual Waters Outdoors Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-slate hover:text-offwhite text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square bg-forest-card border border-moss/15 rounded-2xl overflow-hidden">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate/20 text-6xl font-display">DW</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i
                        ? "border-moss"
                        : "border-moss/20 hover:border-moss/40"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-offwhite mb-2">
              {product.name}
            </h1>
            <p className="text-amber text-2xl font-semibold mb-6">
              ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </p>

            {product.description && (
              <p className="text-slate leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {hasVariants && (
              <div className="mb-8">
                <p className="text-offwhite text-sm font-medium mb-3">
                  Size / Option
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedVariant === v
                          ? "bg-moss border-moss text-offwhite"
                          : "bg-transparent border-moss/30 text-slate hover:border-moss/60 hover:text-offwhite"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {needsVariant && (
                  <p className="text-slate/60 text-xs mt-2">
                    Please select a size.
                  </p>
                )}
              </div>
            )}

            {product.inStock === false ? (
              <button
                disabled
                className="w-full bg-forest-card border border-moss/20 text-slate rounded-xl py-4 font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : product.stripeLink ? (
              /* Direct Stripe Payment Link — no cart needed */
              <a
                href={product.stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber hover:bg-amber-dark text-forest-dark font-semibold py-4 rounded-xl transition-colors"
              >
                Buy Now
              </a>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={needsVariant}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl transition-colors ${
                  needsVariant
                    ? "bg-forest-card border border-moss/20 text-slate cursor-not-allowed"
                    : added
                    ? "bg-moss text-offwhite"
                    : "bg-amber hover:bg-amber-dark text-forest-dark"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>
            )}

            <Link
              to="/cart"
              className="block text-center text-slate hover:text-offwhite text-sm mt-4 transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
