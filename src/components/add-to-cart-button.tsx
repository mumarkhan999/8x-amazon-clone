"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  className = "",
}: {
  product: Product;
  quantity?: number;
  compact?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            imageUrl: product.imageUrl,
            priceCents: product.priceCents,
          },
          quantity
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`rounded-full bg-yellow-400 font-medium text-zinc-900 hover:bg-yellow-500 ${
        compact ? "px-3 py-1.5 text-sm" : "px-6 py-2.5 text-base"
      } ${className}`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
