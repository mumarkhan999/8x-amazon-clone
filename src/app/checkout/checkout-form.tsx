"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export function CheckoutForm({ defaultName }: { defaultName: string }) {
  const { items, totalCents } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 p-6 text-center">
        <p className="text-zinc-600">Your cart is empty.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 rounded-full bg-yellow-400 px-6 py-2.5 font-medium text-zinc-900 hover:bg-yellow-500"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          shippingName: formData.get("name"),
          shippingAddress: {
            line1: formData.get("line1"),
            city: formData.get("city"),
            state: formData.get("state"),
            zip: formData.get("zip"),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:col-span-2">
        <div className="rounded-lg border border-zinc-200 p-4">
          <h2 className="mb-3 font-semibold">Shipping address</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={defaultName}
                required
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="line1" className="mb-1 block text-sm font-medium">
                Street address
              </label>
              <input
                id="line1"
                name="line1"
                required
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1 block text-sm font-medium">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  required
                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="zip" className="mb-1 block text-sm font-medium">
                  ZIP
                </label>
                <input
                  id="zip"
                  name="zip"
                  required
                  className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-yellow-400 px-6 py-2.5 font-medium text-zinc-900 hover:bg-yellow-500 disabled:opacity-60"
        >
          {submitting ? "Redirecting to payment…" : "Continue to payment"}
        </button>
        <p className="text-xs text-zinc-500">
          You&apos;ll enter card details on Stripe&apos;s secure checkout page.
          Use test card 4242 4242 4242 4242, any future expiry, any CVC.
        </p>
      </form>

      <div className="h-fit rounded-lg border border-zinc-200 p-4">
        <h2 className="mb-3 font-semibold">Order summary</h2>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-zinc-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="line-clamp-1">{item.title}</p>
                <p className="text-zinc-500">
                  Qty {item.quantity} · {formatPrice(item.priceCents)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-zinc-200 pt-3 text-lg font-semibold">
          Total: {formatPrice(totalCents)}
        </div>
      </div>
    </div>
  );
}
