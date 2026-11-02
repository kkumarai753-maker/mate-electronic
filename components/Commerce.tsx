"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Info,
} from "lucide-react";
import { products, currency } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { ProductGrid } from "./ProductCard";
import { Breadcrumbs, PageIntro } from "./Shell";
import { CheckoutForm } from "./Forms";
export function WishlistPage() {
  const { wishlist, ready } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container commerce-page">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <PageIntro
        eyebrow="KEEP YOUR IDEAS TOGETHER"
        title="Your wishlist."
        description="A few favourites for your next home project."
      />
      {!ready ? (
        <p role="status">Loading your wishlist…</p>
      ) : list.length ? (
        <>
          <div className="wishlist-summary">
            {list.length} saved {list.length === 1 ? "product" : "products"} ·
            Stored on this device
          </div>
          <ProductGrid items={list} moveFromWishlist />
        </>
      ) : (
        <div className="empty-state">
          <Heart size={45} strokeWidth={1} />
          <h2>A little inspiration goes a long way.</h2>
          <p>
            Save products with the heart icon. Your favourites will be here when
            you need them.
          </p>
          <Link className="btn btn-primary" href="/shop/">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
export function CartPage() {
  const { cart, ready, update, remove } = useStore();
  const lines = cart.map((l) => ({
    ...l,
    product: products.find((p) => p.id === l.productId)!,
  }));
  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
    count = cart.reduce((s, l) => s + l.quantity, 0);
  return (
    <div className="container commerce-page">
      <Breadcrumbs items={[{ label: "Shopping cart" }]} />
      <PageIntro
        eyebrow="YOUR EVERYDAY UPGRADES"
        title="Your shopping cart."
        description="One step closer to a well-connected space."
      />
      {!ready ? (
        <p role="status">Loading your cart…</p>
      ) : lines.length ? (
        <div className="cart-layout">
          <div className="cart-lines">
            <div className="cart-table-title">
              <span>PRODUCT</span>
              <span>QUANTITY & TOTAL</span>
            </div>
            {lines.map(({ product: p, quantity }) => (
              <article className="cart-line" key={p.id}>
                <Link href={"/products/" + p.slug + "/"} className="cart-image">
                  <img src={p.image} alt={p.name} width="135" height="108" />
                </Link>
                <div className="cart-line-copy">
                  <span>{p.brand} · Demo label</span>
                  <Link href={"/products/" + p.slug + "/"}>{p.name}</Link>
                  <small>{currency(p.price)} each · demo price</small>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={"Remove " + p.name + " from cart"}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
                <div className="cart-quantity">
                  <div className="quantity-picker">
                    <button
                      aria-label={"Decrease " + p.name + " quantity"}
                      disabled={quantity <= 1}
                      onClick={() => update(p.id, quantity - 1)}
                    >
                      <Minus size={13} />
                    </button>
                    <input
                      aria-label={p.name + " quantity"}
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) =>
                        update(p.id, Number(e.target.value) || 1)
                      }
                    />
                    <button
                      aria-label={"Increase " + p.name + " quantity"}
                      disabled={quantity >= 99}
                      onClick={() => update(p.id, quantity + 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <b>{currency(p.price * quantity)}</b>
                </div>
              </article>
            ))}
            <Link className="text-link continue-link" href="/shop/">
              Continue shopping <ArrowRight size={16} />
            </Link>
          </div>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div>
              <span>
                Subtotal ({count} {count === 1 ? "item" : "items"})
              </span>
              <strong data-testid="cart-subtotal">{currency(total)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <span>Not arranged in demo</span>
            </div>
            <div className="summary-total">
              <span>Demo total</span>
              <strong>{currency(total)}</strong>
            </div>
            <Link className="btn btn-primary" href="/checkout/">
              PROCEED TO DEMO CHECKOUT <ArrowRight size={16} />
            </Link>
            <p>
              <ShieldCheck size={17} /> Demo only. No payment or actual order.
            </p>
            <small>
              Example totals in INR. Tax and delivery are not separately
              calculated or charged in this demo.
            </small>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={45} strokeWidth={1} />
          <h2>Your next upgrade is waiting.</h2>
          <p>
            Your cart is empty. Explore the collection to find something for
            your space.
          </p>
          <Link className="btn btn-primary" href="/shop/">
            Start exploring <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
export function CheckoutPage() {
  const { cart, ready, clear } = useStore();
  const [completed, setCompleted] = useState(false);
  const [snapshot, setSnapshot] = useState<{
    items: typeof cart;
    total: number;
  } | null>(null);
  const items = snapshot?.items ?? cart;
  const total =
    snapshot?.total ??
    cart.reduce(
      (s, l) =>
        s +
        (products.find((p) => p.id === l.productId)?.price || 0) * l.quantity,
      0,
    );
  function complete() {
    setSnapshot({ items: [...cart], total });
    setCompleted(true);
    clear();
  }
  return (
    <div className="container commerce-page checkout-page">
      <Breadcrumbs
        items={[{ label: "Cart", href: "/cart/" }, { label: "Demo checkout" }]}
      />
      <PageIntro
        eyebrow="TRY THE COMPLETE SHOPPING EXPERIENCE"
        title="Demo checkout."
        description="Explore the checkout flow. No payment details are requested."
      />
      {!ready ? (
        <p role="status">Loading your checkout…</p>
      ) : items.length || completed ? (
        <div className="checkout-layout">
          <CheckoutForm items={items} total={total} onComplete={complete} />
          <aside className="order-summary checkout-summary">
            <h2>Your demo order</h2>
            {items.map((l) => {
              const p = products.find((p) => p.id === l.productId)!;
              return (
                <div className="checkout-line" key={p.id}>
                  <img src={p.image} alt="" width="65" height="52" />
                  <span>
                    {p.name}
                    <small>Qty {l.quantity}</small>
                  </span>
                  <b>{currency(p.price * l.quantity)}</b>
                </div>
              );
            })}
            <div className="summary-total">
              <span>Demo total</span>
              <strong>{currency(total)}</strong>
            </div>
            <div className="checkout-summary-notice">
              <Info size={18} />
              <p>
                Illustrative INR prices. No taxes, shipping, payments, or actual
                orders are processed.
              </p>
            </div>
            <Link href="/cart/" className="text-link">
              Return to cart <ArrowUpRight size={14} />
            </Link>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={42} />
          <h2>Add an essential first.</h2>
          <p>You’ll need a product in your cart to try the demo checkout.</p>
          <Link className="btn btn-primary" href="/shop/">
            Explore products <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
