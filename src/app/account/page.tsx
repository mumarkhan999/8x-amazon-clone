import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 border-b border-zinc-200 pb-2 text-2xl font-semibold">
        Your Account
      </h1>

      <div className="rounded-lg border border-zinc-200 p-6">
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <dt className="text-zinc-500">Name</dt>
          <dd className="col-span-2">{user.name}</dd>
          <dt className="text-zinc-500">Email</dt>
          <dd className="col-span-2">{user.email}</dd>
        </dl>

        <div className="mt-6 flex gap-3">
          <Link
            href="/orders"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-500"
          >
            Your Orders
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
