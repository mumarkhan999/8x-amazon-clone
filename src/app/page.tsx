import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const products = await getProducts({ q, category });

  const heading = q
    ? `Results for "${q}"`
    : category
      ? category
      : "Today's Deals";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {!q && !category && (
        <div className="mb-6 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 px-6 py-10 text-white">
          <h1 className="text-3xl font-bold">Welcome to amazon.clone</h1>
          <p className="mt-2 max-w-xl text-zinc-300">
            A from-scratch storefront built for a 24-hour take-home — browse,
            search, add to cart, and check out with Stripe test payments.
          </p>
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">{heading}</h2>

      {products.length === 0 ? (
        <p className="text-zinc-500">No products found. Try a different search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
