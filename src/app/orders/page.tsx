import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { getOrdersForUser } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

const statusLabel: Record<string, string> = {
  pending: "Payment pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 border-b border-zinc-200 pb-2 text-2xl font-semibold">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 p-8 text-center text-zinc-600">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-yellow-400 px-6 py-2.5 font-medium text-zinc-900 hover:bg-yellow-500"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 hover:border-zinc-400"
              >
                <div>
                  <p className="text-sm text-zinc-500">
                    Order #{order.id.slice(0, 8)} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 font-medium">
                    {statusLabel[order.status] ?? order.status}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(order.totalCents)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
