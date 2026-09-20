import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getOrderForUser, markOrderPaid } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const { orderId, session_id: sessionId } = await searchParams;
  const user = await requireUser();

  if (!orderId) notFound();

  let result = await getOrderForUser(orderId, user.id);
  if (!result) notFound();

  // Self-heal: if the webhook hasn't landed yet, confirm directly with Stripe
  // so the confirmation page never shows "pending" for a payment that succeeded.
  if (result.order.status === "pending" && sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      await markOrderPaid(orderId);
      result = await getOrderForUser(orderId, user.id);
      if (!result) notFound();
    }
  }

  const { order, items } = result;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ClearCartOnMount />
      <div className="rounded-lg border border-zinc-200 p-6">
        <h1 className="text-2xl font-semibold text-emerald-700">
          {order.status === "paid" ? "Order confirmed!" : "Order received"}
        </h1>
        <p className="mt-1 text-zinc-600">
          {order.status === "paid"
            ? "Thanks for your order — we've received your payment."
            : "We're waiting on payment confirmation. This usually only takes a moment."}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-600">
          <dt>Order ID</dt>
          <dd className="text-right font-mono">{order.id.slice(0, 8)}</dd>
          <dt>Shipping to</dt>
          <dd className="text-right">{order.shippingName}</dd>
        </dl>

        <ul className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-zinc-100">
                <Image
                  src={item.imageUrlSnapshot}
                  alt={item.titleSnapshot}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="line-clamp-1">{item.titleSnapshot}</p>
                <p className="text-zinc-500">
                  Qty {item.quantity} · {formatPrice(item.priceCentsSnapshot)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-semibold">
            {formatPrice(order.totalCents)}
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/orders"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-500"
          >
            View orders
          </Link>
          <Link
            href="/"
            className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-yellow-500"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
