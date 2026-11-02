"use client";
import Link from "next/link";
import { Heart, Plus, ArrowUpRight, ShoppingBag } from "lucide-react";
import { type Product, currency, categoryName } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
export function ProductCard({
  product: p,
  compact = false,
  moveFromWishlist = false,
}: {
  product: Product;
  compact?: boolean;
  moveFromWishlist?: boolean;
}) {
  const { wishlist, toggleWish, add, ready } = useStore();
  const saved = wishlist.includes(p.id);
  return (
    <article className={"product-card " + (compact ? "compact" : "")}>
      <div className="product-media">
        <Link href={"/products/" + p.slug + "/"} aria-label={"View " + p.name}>
          <img
            src={p.image}
            alt={p.name + " — illustrative product image"}
            width="400"
            height="320"
            loading="lazy"
          />
        </Link>
        {p.badge ? <span className="product-badge">The demo edit</span> : null}
        <button
          className={"wish-btn " + (saved ? "is-saved" : "")}
          onClick={() => toggleWish(p.id)}
          aria-label={
            (saved ? "Remove " : "Save ") +
            p.name +
            (saved ? " from wishlist" : " to wishlist")
          }
          aria-pressed={saved}
          disabled={!ready}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <Link className="quick-view" href={"/products/" + p.slug + "/"}>
          View details <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="product-copy">
        <span className="product-category">{categoryName(p.category)}</span>
        <Link href={"/products/" + p.slug + "/"} className="product-title">
          {p.name}
        </Link>
        <span className="product-brand">
          {p.brand} <span>· Demo label</span>
        </span>
        <div className="product-price">
          <strong>{currency(p.price)}</strong>
          <span>Demo price</span>
        </div>
        <button
          className="add-cart"
          onClick={() => {
            add(p.id);
            if (moveFromWishlist && saved) toggleWish(p.id);
          }}
          disabled={!ready}
        >
          <ShoppingBag size={14} />{" "}
          {moveFromWishlist ? "Move to cart" : "Add to cart"} <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
export function ProductGrid({
  items,
  moveFromWishlist = false,
}: {
  items: Product[];
  moveFromWishlist?: boolean;
}) {
  return (
    <div className="product-grid">
      {items.map((p) => (
        <ProductCard
          product={p}
          key={p.id}
          moveFromWishlist={moveFromWishlist}
        />
      ))}
    </div>
  );
}
