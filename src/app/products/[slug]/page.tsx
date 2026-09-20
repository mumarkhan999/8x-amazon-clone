import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/star-rating";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <p className="text-sm text-zinc-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
            {product.title}
          </h1>
          <div className="mt-2">
            <StarRating
              rating={Number(product.rating)}
              reviewCount={product.reviewCount}
            />
          </div>

          <div className="mt-4 border-t border-zinc-200 pt-4">
            <p className="text-3xl font-semibold text-zinc-900">
              {formatPrice(product.priceCents)}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <div className="mt-6 max-w-xs rounded-lg border border-zinc-200 p-4">
            <p className="mb-3 text-2xl font-semibold text-zinc-900">
              {formatPrice(product.priceCents)}
            </p>
            <AddToCartButton product={product} className="w-full text-center" />
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">About this item</h2>
            <p className="text-sm leading-relaxed text-zinc-700">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
