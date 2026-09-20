"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, totalItems, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-zinc-600">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-yellow-400 px-6 py-2.5 font-medium text-zinc-900 hover:bg-yellow-500"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="mb-4 border-b border-zinc-200 pb-2 text-2xl font-semibold">
          Shopping Cart
        </h1>
        <ul className="divide-y divide-zinc-200">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded bg-zinc-100"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    {formatPrice(item.priceCents)}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    Qty:
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(item.productId, Number(e.target.value))
                      }
                      className="rounded border border-zinc-300 px-2 py-1"
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-blue-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-fit rounded-lg border border-zinc-200 p-4">
        <p className="text-lg">
          Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}):{" "}
          <span className="font-semibold">{formatPrice(totalCents)}</span>
        </p>
        <Link
          href="/checkout"
          className="mt-3 block rounded-full bg-yellow-400 px-4 py-2.5 text-center font-medium text-zinc-900 hover:bg-yellow-500"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
