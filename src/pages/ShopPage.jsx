import { Helmet } from "react-helmet-async";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

// Placeholder products shown when Firestore is empty.
// Add real products via /admin once Firestore is set up.
const PLACEHOLDER_PRODUCTS = [
  {
    id: "placeholder-1",
    name: "Dual Waters Hat",
    description: "Structured 5-panel cap. Embroidered logo. One size fits most.",
    price: 32,
    images: [],
    inStock: true,
  },
  {
    id: "placeholder-2",
    name: "DWO Sticker Pack",
    description: "Three weather-resistant vinyl stickers. Perfect for rods, trucks, and tackle boxes.",
    price: 8,
    images: [],
    inStock: true,
  },
  {
    id: "placeholder-3",
    name: "Logo Tee",
    description: "Heavyweight cotton tee with chest logo print. Sizes S–2XL.",
    price: 28,
    images: [],
    inStock: true,
  },
  {
    id: "placeholder-4",
    name: "Ripstop Field Shirt",
    description: "Lightweight ripstop button-up with vented back. Built for the water.",
    price: 65,
    images: [],
    inStock: false,
  },
];

export default function ShopPage() {
  const { products, loading } = useProducts();

  const displayProducts =
    !loading && products.length > 0 ? products : PLACEHOLDER_PRODUCTS;


  return (
    <>
      <Helmet>
        <title>Shop — Dual Waters Outdoors</title>
        <meta
          name="description"
          content="Dual Waters Outdoors merch — hats, tees, stickers, and more."
        />
      </Helmet>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-moss text-xs font-semibold uppercase tracking-widest mb-3">
            Merch
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-offwhite mb-4">
            The Shop
          </h1>
          <p className="text-slate max-w-xl leading-relaxed">
            Gear up with Dual Waters Outdoors merch. Hats, stickers, apparel —
            more dropping soon.
          </p>
        </div>


        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-forest-card border border-moss/10 rounded-xl aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
