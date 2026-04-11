import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart — Dual Waters Outdoors</title>
        </Helmet>
        <main className="max-w-2xl mx-auto px-4 py-24 text-center">
          <ShoppingCart size={48} className="text-slate/30 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-offwhite mb-3">
            Your cart is empty
          </h1>
          <p className="text-slate mb-8">
            Head to the shop and find something worth wearing.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-amber hover:bg-amber-dark text-forest-dark font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Browse the Shop
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart — Dual Waters Outdoors</title>
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-offwhite mb-10">
          Your Cart
        </h1>

        <div className="space-y-4 mb-10">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variant}`}
              className="flex items-center gap-4 bg-forest-card border border-moss/15 rounded-xl p-4"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-forest border border-moss/10 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate/20 text-xs font-display">DW</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-offwhite font-medium text-sm truncate">
                  {item.name}
                </p>
                {item.variant && item.variant !== "One Size" && (
                  <p className="text-slate text-xs">{item.variant}</p>
                )}
                <p className="text-amber text-sm font-semibold mt-1">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    updateQty(item.id, item.variant, item.qty - 1)
                  }
                  className="w-7 h-7 flex items-center justify-center bg-forest border border-moss/20 rounded-lg text-slate hover:text-offwhite hover:border-moss/40 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-offwhite text-sm w-6 text-center">
                  {item.qty}
                </span>
                <button
                  onClick={() =>
                    updateQty(item.id, item.variant, item.qty + 1)
                  }
                  className="w-7 h-7 flex items-center justify-center bg-forest border border-moss/20 rounded-lg text-slate hover:text-offwhite hover:border-moss/40 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id, item.variant)}
                className="text-slate hover:text-red-400 transition-colors ml-2 shrink-0"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-forest-card border border-moss/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate">Subtotal</span>
            <span className="text-offwhite font-semibold text-lg">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            disabled
            className="w-full bg-amber/40 text-forest-dark/60 font-semibold py-4 rounded-xl cursor-not-allowed mb-3"
          >
            Checkout Coming Soon
          </button>

          <button
            onClick={clearCart}
            className="w-full text-slate hover:text-red-400 text-sm transition-colors"
          >
            Clear cart
          </button>
        </div>
      </main>
    </>
  );
}
