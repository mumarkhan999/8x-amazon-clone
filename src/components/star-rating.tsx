export function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex text-orange-500" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < full ? "★" : "☆"}</span>
        ))}
      </div>
      <span className="text-zinc-500">
        {rating.toFixed(1)} · {reviewCount.toLocaleString()}
      </span>
    </div>
  );
}
