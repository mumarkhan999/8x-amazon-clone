import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { StarRating } from "./star-rating";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded bg-zinc-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        <p className="line-clamp-2 text-sm font-medium text-zinc-900">
          {product.title}
        </p>
        <div className="mt-1">
          <StarRating
            rating={Number(product.rating)}
            reviewCount={product.reviewCount}
          />
        </div>
        <p className="mt-2 text-lg font-semibold text-zinc-900">
          {formatPrice(product.priceCents)}
        </p>
      </Link>
      <AddToCartButton product={product} className="mt-3" compact />
    </div>
  );
}
