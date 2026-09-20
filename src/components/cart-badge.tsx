"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="flex items-end gap-1 rounded px-2 py-1 hover:outline hover:outline-1 hover:outline-white"
    >
      <span className="relative text-2xl">
        🛒
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
          {totalItems}
        </span>
      </span>
      <span className="hidden text-sm font-bold sm:inline">Cart</span>
    </Link>
  );
}
