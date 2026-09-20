import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { getCategories } from "@/lib/products";
import { CartBadge } from "./cart-badge";
import { logout } from "@/lib/actions/auth";

export async function Navbar() {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <header className="sticky top-0 z-20">
      <div className="flex items-center gap-4 bg-zinc-900 px-4 py-2 text-white">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          amazon<span className="text-orange-400">.clone</span>
        </Link>

        <form action="/" method="GET" className="flex min-w-0 flex-1">
          <input
            type="text"
            name="q"
            placeholder="Search products, brands, and categories"
            className="min-w-0 flex-1 rounded-l bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-r bg-orange-400 px-4 text-zinc-900 hover:bg-orange-500"
            aria-label="Search"
          >
            🔍
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-4 text-sm">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="leading-tight hover:underline">
                <div className="text-xs text-zinc-300">Hello, {user.name}</div>
                <div className="font-bold">Returns &amp; Orders</div>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded border border-zinc-600 px-2 py-1 text-xs hover:border-white"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="leading-tight hover:underline">
              <div className="text-xs text-zinc-300">Hello, sign in</div>
              <div className="font-bold">Account &amp; Lists</div>
            </Link>
          )}

          <CartBadge />
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto bg-zinc-800 px-4 py-1.5 text-xs text-zinc-100">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/?category=${encodeURIComponent(category)}`}
            className="shrink-0 hover:underline"
          >
            {category}
          </Link>
        ))}
      </nav>
    </header>
  );
}
