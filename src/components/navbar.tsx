import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { getCategories } from "@/lib/products";
import { CartBadge } from "./cart-badge";
import { CategoryMenu } from "./category-menu";
import { logout } from "@/lib/actions/auth";

export async function Navbar() {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <header className="sticky top-0 z-20">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-zinc-900 px-4 py-2 text-white">
        <Link href="/" className="order-1 shrink-0 text-xl font-bold tracking-tight">
          amazon<span className="text-orange-400">.clone</span>
        </Link>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-3 text-sm md:order-3 md:ml-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="leading-tight hover:underline">
                <div className="hidden text-xs text-zinc-300 sm:block">
                  Hello, {user.name}
                </div>
                <div className="font-bold">
                  <span className="sm:hidden">Orders</span>
                  <span className="hidden sm:inline">Returns &amp; Orders</span>
                </div>
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
              <div className="hidden text-xs text-zinc-300 sm:block">Hello, sign in</div>
              <div className="font-bold">
                <span className="sm:hidden">Account</span>
                <span className="hidden sm:inline">Account &amp; Lists</span>
              </div>
            </Link>
          )}

          <CartBadge />
        </div>

        <form
          action="/"
          method="GET"
          className="order-3 flex w-full min-w-0 md:order-2 md:w-auto md:flex-1"
        >
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
      </div>

      {/* Amazon's own mobile web tucks categories behind a menu rather than
          a scrollable strip — a horizontal scroller has no affordance
          signaling it's swipeable. Desktop keeps the always-visible row,
          since it fits and mouse/trackpad scroll is a natural interaction. */}
      <nav className="hidden gap-4 overflow-x-auto bg-zinc-800 px-4 py-1.5 text-xs text-zinc-100 md:flex">
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
      <CategoryMenu categories={categories} />
    </header>
  );
}
