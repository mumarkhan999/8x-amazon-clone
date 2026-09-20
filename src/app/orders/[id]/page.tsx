import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getOrderForUser } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

const statusLabel: Record<string, string> = {
  pending: "Payment pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const result = await getOrderForUser(id, user.id);
  if (!result) notFound();

  const { order, items } = result;
  const address = order.shippingAddress as {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/orders" className="text-sm text-blue-600 hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Order #{order.id.slice(0, 8)}
          </h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">
            {statusLabel[order.status] ?? order.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Placed {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
          <p className="font-medium text-zinc-900">Shipping to</p>
          <p>{order.shippingName}</p>
          <p>{address.line1}</p>
          <p>
            {address.city}, {address.state} {address.zip}
          </p>
        </div>

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
      </div>
    </div>
  );
}
