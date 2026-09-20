"use client";

import { useState } from "react";
import Link from "next/link";

export function CategoryMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-100"
      >
        <span aria-hidden>☰</span>
        Shop by Category
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close category menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-black/40"
          />
          <div className="absolute top-full left-0 z-20 w-full border-t border-zinc-700 bg-zinc-800 py-1 shadow-lg">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
              >
                {category}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
