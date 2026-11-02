"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Minus,
  Plus,
  ArrowRight,
  CheckCircle2,
  Info,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  type Product,
  products,
  categoryName,
  currency,
  whatsappLink,
} from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { Breadcrumbs } from "./Shell";
import { ProductGrid } from "./ProductCard";
import { SectionHeading } from "./Home";
export default function ProductDetail({ product: p }: { product: Product }) {
  const [qty, setQty] = useState(1),
    [view, setView] = useState("product"),
    [tab, setTab] = useState("details");
  const { add, wishlist, toggleWish, ready } = useStore();
  const saved = wishlist.includes(p.id);
  const related = products
    .filter((i) => i.id !== p.id)
    .sort(
      (a, b) =>
        Number(b.category === p.category) - Number(a.category === p.category),
    )
    .slice(0, 4);
  return (
    <div className="container detail-page">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop/" },
          {
            label: categoryName(p.category),
            href: "/collections/" + p.category + "/",
          },
          { label: p.name },
        ]}
      />
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="main-product-image">
            <span className="product-badge">ILLUSTRATIVE PRODUCT IMAGE</span>
            <img
              src={view === "product" ? p.image : "/assets/product-spec.svg"}
              alt={
                view === "product"
                  ? p.name + " — illustrative image"
                  : "Product specification checklist; confirm exact model in store"
              }
              width="600"
              height="480"
            />
          </div>
          <div className="thumbnails">
            <button
              className={view === "product" ? "active" : ""}
              aria-label="Show product image"
              aria-pressed={view === "product"}
              onClick={() => setView("product")}
            >
              <img src={p.image} alt="" width="80" height="64" />
            </button>
            <button
              className={view === "spec" ? "active" : ""}
              aria-label="Show specification checklist"
              aria-pressed={view === "spec"}
              onClick={() => setView("spec")}
            >
              <img
                src="/assets/product-spec.svg"
                alt=""
                width="80"
                height="64"
              />
            </button>
            <span>
              Product illustration &<br />
              specification guide
            </span>
          </div>
        </div>
        <div className="detail-content">
          <Link className="eyebrow" href={"/collections/" + p.category + "/"}>
            {categoryName(p.category)}
          </Link>
          <h1>{p.name}</h1>
          <div className="detail-brand">
            {p.brand} <span>Fictional demo label</span>
          </div>
          <div className="detail-price">
            {currency(p.price)}
            <span>ILLUSTRATIVE DEMO PRICE</span>
          </div>
          <p className="detail-description">
            {p.description.split("Demo product;")[0]}
          </p>
          <div className="detail-summary">
            {Object.entries(p.specs)
              .slice(0, 3)
              .map(([k, v]) => (
                <span key={k}>
                  <CheckCircle2 size={14} />
                  {k}: <b>{v}</b>
                </span>
              ))}
          </div>
          <label className="quantity-label">Quantity</label>
          <div className="purchase-actions">
            <div className="quantity-picker">
              <button
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={15} />
              </button>
              <input
                aria-label="Product quantity"
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.min(
                      99,
                      Math.max(1, Math.floor(Number(e.target.value)) || 1),
                    ),
                  )
                }
              />
              <button
                aria-label="Increase quantity"
                disabled={qty >= 99}
                onClick={() => setQty(Math.min(99, qty + 1))}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              className="btn btn-primary"
              disabled={!ready}
              onClick={() => add(p.id, qty)}
            >
              <ShoppingBag size={18} /> ADD TO CART <ArrowRight size={17} />
            </button>
            <button
              className={"detail-wish " + (saved ? "is-saved" : "")}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={saved}
              onClick={() => toggleWish(p.id)}
              disabled={!ready}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="detail-demo-notice">
            <Info size={16} />
            <p>
              Demo product. Price, specification and availability are examples.
              No real order or payment will be processed.
            </p>
          </div>
          <a
            className="whatsapp-enquiry"
            href={whatsappLink(
              `Hello Mate Electricals, I would like to enquire about ${p.name} (demo product reference). Quantity: ${qty}. Please confirm actual models, availability and price.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Enquire on WhatsApp{" "}
            <ArrowUpRight size={16} />
          </a>
          <small className="unverified-note">
            WhatsApp 9322172834 is unverified. Confirm this number belongs to
            the store before sending personal details.
          </small>
          <Link className="detail-bulk" href="/bulk-enquiry/">
            Need a project quantity? Request a bulk quote{" "}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      <div className="detail-tabs">
        <div
          role="tablist"
          aria-label="Product information"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const next = tab === "details" ? "specs" : "details";
              setTab(next);
              document
                .getElementById(
                  next === "details" ? "details-control" : "specs-control",
                )
                ?.focus();
            }
          }}
        >
          <button
            role="tab"
            tabIndex={tab === "details" ? 0 : -1}
            aria-selected={tab === "details"}
            aria-controls="details-tab"
            id="details-control"
            onClick={() => setTab("details")}
          >
            Product details
          </button>
          <button
            role="tab"
            tabIndex={tab === "specs" ? 0 : -1}
            aria-selected={tab === "specs"}
            aria-controls="specs-tab"
            id="specs-control"
            onClick={() => setTab("specs")}
          >
            Specifications
          </button>
        </div>
        {tab === "details" ? (
          <div
            id="details-tab"
            role="tabpanel"
            aria-labelledby="details-control"
          >
            <h2>Designed for the everyday.</h2>
            <p>{p.description}</p>
            <p>
              Product imagery is representative. Confirm the exact model,
              installation requirements and compatibility with the store before
              purchasing. Electrical installation should be completed by a
              qualified electrician.
            </p>
          </div>
        ) : (
          <div id="specs-tab" role="tabpanel" aria-labelledby="specs-control">
            <h2>At a glance.</h2>
            <p>Example specifications for this demonstration.</p>
            <dl className="spec-table">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      <section className="section related-products">
        <SectionHeading
          eyebrow="KEEP YOUR PROJECT CONNECTED"
          title="You might also explore."
          href="/shop/"
          label="Shop all"
        />
        <ProductGrid items={related} />
      </section>
    </div>
  );
}
