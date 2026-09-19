"use client";

import type { Category } from "@/lib/commerce/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/explore"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-foreground text-background"
            : "bg-background/60 text-foreground hover:bg-background/80"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/explore?category=${category.id}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-foreground text-background"
              : "bg-background/60 text-foreground hover:bg-background/80"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
