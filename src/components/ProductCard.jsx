import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { id, name, description, price, images, inStock } = product;

  return (
    <Link
      to={`/shop/${id}`}
      className="group block bg-forest-card border border-moss/15 rounded-xl overflow-hidden hover:border-moss/40 transition-colors"
    >
      {/* Product image */}
      <div className="aspect-square bg-forest overflow-hidden">
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate/20 text-5xl font-display">DW</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-bold text-offwhite leading-snug mb-1 group-hover:text-amber transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-slate text-xs leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-amber font-semibold text-sm">
            ${typeof price === "number" ? price.toFixed(2) : price}
          </span>
          {!inStock && (
            <span className="text-xs text-slate/60 border border-slate/20 px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
