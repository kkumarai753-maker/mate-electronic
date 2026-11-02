"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Heart,
  ShoppingBag,
  Phone,
  Menu,
  X,
  ChevronDown,
  MapPin,
  LayoutGrid,
  Mail,
  MessageCircle,
} from "lucide-react";
import { categories, products, business, currency } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
export function Header() {
  const { cart, wishlist, ready } = useStore();
  const path = usePathname(),
    router = useRouter();
  const [mobile, setMobile] = useState(false),
    [q, setQ] = useState(""),
    [focus, setFocus] = useState(false);
  useEffect(() => {
    setMobile(false);
    setFocus(false);
  }, [path]);
  const matches = q.trim()
    ? products
        .filter((p) =>
          `${p.name} ${p.brand}`.toLowerCase().includes(q.trim().toLowerCase()),
        )
        .slice(0, 4)
    : [];
  function search(e: React.FormEvent) {
    e.preventDefault();
    setFocus(false);
    router.push("/shop/?q=" + encodeURIComponent(q.trim()));
  }
  return (
    <>
      <div className="announcement">
        <div className="container">
          <span>Thoughtful electricals. Brighter everyday living.</span>
          <span className="announcement-demo">
            DEMO STORE · ILLUSTRATIVE PRICES · NO PAYMENTS
          </span>
          <Link href="/contact/">
            <MapPin size={12} /> Hingna, Nagpur <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
      <header className="main-header">
        <div className="container header-inner">
          <button
            className="mobile-menu icon-btn"
            onClick={() => setMobile(!mobile)}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            aria-label={mobile ? "Close menu" : "Open menu"}
          >
            {mobile ? <X /> : <Menu />}
          </button>
          <Link href="/" className="brand" aria-label="Mate Electricals home">
            <img
              src="/brand/horizontal-dark.svg"
              width="230"
              height="68"
              alt="MATE ELECTRICALS"
            />
          </Link>
          <form onSubmit={search} role="search" className="header-search">
            <Search size={19} />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search lights, switches, fans and more…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 150)}
            />
            <button type="submit" aria-label="Search catalog">
              <ArrowRight size={18} />
            </button>
            {focus && q.trim() ? (
              <div className="search-suggestions">
                <span className="suggestions-label">PRODUCTS</span>
                {matches.length ? (
                  matches.map((p) => (
                    <Link
                      href={"/products/" + p.slug + "/"}
                      key={p.id}
                      onClick={() => setFocus(false)}
                    >
                      <img src={p.image} alt="" width="45" height="40" />
                      <span>
                        {p.name}
                        <small>{currency(p.price)} · demo price</small>
                      </span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ))
                ) : (
                  <p>No matches. Try lighting or switches.</p>
                )}
                <button className="all-results" type="submit">
                  View all search results <ArrowRight size={15} />
                </button>
              </div>
            ) : null}
          </form>
          <div className="header-actions">
            <Link href="/contact/" className="header-contact">
              <Phone size={20} />
              <span>
                Let’s talk<small>Contact our store</small>
              </span>
            </Link>
            <Link
              className="icon-btn"
              href="/wishlist/"
              aria-label={`Wishlist, ${ready ? wishlist.length : 0} saved products`}
            >
              <Heart />
              <span className="counter">{ready ? wishlist.length : 0}</span>
            </Link>
            <Link
              className="icon-btn"
              href="/cart/"
              aria-label={`Cart, ${ready ? cart.reduce((n, l) => n + l.quantity, 0) : 0} items`}
            >
              <ShoppingBag />
              <span className="counter orange">
                {ready ? cart.reduce((n, l) => n + l.quantity, 0) : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>
      <div className="nav-wrap">
        <nav className="container desktop-nav" aria-label="Main navigation">
          <details
            className="category-dropdown"
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.removeAttribute("open");
            }}
          >
            <summary>
              <LayoutGrid size={16} /> Shop by category{" "}
              <ChevronDown size={14} />
            </summary>
            <div className="category-dropdown-panel">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={"/collections/" + c.id + "/"}
                  onClick={(e) =>
                    e.currentTarget.closest("details")?.removeAttribute("open")
                  }
                >
                  <img src={c.image} width="35" height="30" alt="" />
                  {c.name}
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>
          </details>
          {[
            ["/", "Home"],
            ["/shop/", "Shop all"],
            ["/categories/", "Collections"],
            ["/about/", "Our store"],
            ["/contact/", "Contact"],
          ].map(([url, label]) => (
            <Link key={url} className={path === url ? "active" : ""} href={url}>
              {label}
            </Link>
          ))}
          <Link className="bulk-nav" href="/bulk-enquiry/">
            For your next big project <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
      {mobile ? (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ["/", "Home"],
            ["/shop/", "Shop all products"],
            ["/categories/", "Collections"],
            ["/about/", "About our store"],
            ["/contact/", "Contact & location"],
            ["/bulk-enquiry/", "Bulk enquiry"],
            ["/wishlist/", "Wishlist"],
            ["/cart/", "Shopping cart"],
          ].map(([u, l]) => (
            <Link key={u} href={u} onClick={() => setMobile(false)}>
              {l}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      ) : null}
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="Mate Electricals home">
            <img
              src="/brand/horizontal-dark.svg"
              alt="MATE ELECTRICALS"
              width="230"
              height="68"
            />
          </Link>
          <p>
            Lighting, electrical essentials, and the
            <br />
            finishing touches that feel like home.
          </p>
          <Link href="/contact/" className="footer-location">
            <MapPin size={15} /> Hingna, Nagpur, Maharashtra
          </Link>
        </div>
        <div>
          <h3>Explore the store</h3>
          <Link href="/shop/">All products</Link>
          <Link href="/categories/">Our collections</Link>
          <Link href="/collections/led-lighting/">Lighting collection</Link>
          <Link href="/collections/fans-fixtures/">Fans & fixtures</Link>
        </div>
        <div>
          <h3>Here to help</h3>
          <Link href="/about/">About Mate Electricals</Link>
          <Link href="/contact/">Contact & directions</Link>
          <Link href="/bulk-enquiry/">Bulk order enquiries</Link>
          <Link href="/cart/">Your shopping cart</Link>
        </div>
        <div className="footer-project">
          <span className="eyebrow">PLANNING SOMETHING BIGGER?</span>
          <h3>
            A good project starts
            <br />
            with a good connection.
          </h3>
          <Link href="/bulk-enquiry/">
            Let’s talk requirements <ArrowUpRight size={16} />
          </Link>
          <p>
            Product range, prices and contacts shown
            <br />
            in this demo require store confirmation.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} MATE ELECTRICALS</span>
        <span>Demo store · No payments or real orders</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((i, n) => (
        <span key={n}>
          <span aria-hidden="true">/</span>
          {i.href ? (
            <Link href={i.href}>{i.label}</Link>
          ) : (
            <span aria-current="page">{i.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
export function StorePhotoNotice() {
  return (
    <div className="photo-notice">
      <div className="photo-notice-symbol">
        <MapPin size={35} />
      </div>
      <span className="eyebrow">THE REAL PLACE BEHIND THE PRODUCTS</span>
      <h3>Meet us in Hingna.</h3>
      <p>
        Visit Mate Electricals in Nagpur to explore products in person and
        discuss your project.
      </p>
      <Link className="btn btn-secondary" href="/contact/">
        Plan your visit <ArrowUpRight size={16} />
      </Link>
      <small>
        Store gallery coming soon. Actual shop photographs were not included in
        the available attachments.
      </small>
    </div>
  );
}
