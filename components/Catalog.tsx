"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { products, categories, type Category } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";
import { Breadcrumbs, PageIntro } from "./Shell";
export default function Catalog({ collection }: { collection?: Category }) {
  const [q, setQ] = useState(""),
    [category, setCategory] = useState(collection?.id || ""),
    [brand, setBrand] = useState(""),
    [min, setMin] = useState(""),
    [max, setMax] = useState(""),
    [sort, setSort] = useState("featured"),
    [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") || "");
    const s = params.get("sort");
    if (s && ["featured", "price-asc", "price-desc", "name"].includes(s))
      setSort(s);
  }, []);
  const brands = [...new Set(products.map((p) => p.brand))];
  const invalidRange = !!max && Number(min) > Number(max);
  const list = useMemo(() => {
    const terms = q.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          (!category || p.category === category) &&
          (!brand || p.brand === brand) &&
          (!terms ||
            `${p.name} ${p.description} ${p.brand}`
              .toLowerCase()
              .includes(terms)) &&
          (!min || p.price >= Number(min)) &&
          (!max || p.price <= Number(max)) &&
          !invalidRange,
      )
      .sort((a, b) =>
        sort === "price-asc"
          ? a.price - b.price
          : sort === "price-desc"
            ? b.price - a.price
            : sort === "name"
              ? a.name.localeCompare(b.name)
              : Number(b.featured) - Number(a.featured),
      );
  }, [q, category, brand, min, max, sort, invalidRange]);
  useEffect(() => {
    if (filtersOpen)
      document
        .querySelector(".filter-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filtersOpen]);
  function reset() {
    setQ("");
    setCategory(collection?.id || "");
    setBrand("");
    setMin("");
    setMax("");
    setSort("featured");
  }
  const active =
    !!q || !!brand || !!min || !!max || (!collection && !!category);
  return (
    <div className="container catalog-page">
      <Breadcrumbs
        items={
          collection
            ? [
                { label: "Collections", href: "/categories/" },
                { label: collection.name },
              ]
            : [{ label: "Shop all products" }]
        }
      />
      <div
        className={"catalog-title " + (collection ? "collection-title" : "")}
      >
        <PageIntro
          eyebrow={collection ? "THE COLLECTION" : "THE COMPLETE DEMO RANGE"}
          title={collection?.name || "Find your next everyday essential."}
          description={
            collection?.description ||
            "Lighting, comfort, and the connections that make every space work."
          }
        />
        {collection ? (
          <img
            src={collection.image}
            alt={collection.name}
            width="240"
            height="192"
          />
        ) : null}
      </div>
      <div className="catalog-demo-note">
        Demo catalog · All prices, brands and specifications are illustrative.
        Confirm stock and quotations with the shop.
      </div>
      <div className="catalog-layout">
        <aside
          className={"filter-panel " + (filtersOpen ? "open" : "")}
          aria-label="Product filters"
        >
          <div className="filter-title">
            <h2>Refine your search</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="mobile-filter-close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="filter-section">
            <h3>Categories</h3>
            {!collection ? (
              <label className="radio-field">
                <input
                  type="radio"
                  name="category"
                  checked={!category}
                  onChange={() => setCategory("")}
                />{" "}
                All products <span>{products.length}</span>
              </label>
            ) : null}
            {categories
              .filter((c) => !collection || c.id === collection.id)
              .map((c) => (
                <label className="radio-field" key={c.id}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === c.id}
                    onChange={() => setCategory(c.id)}
                  />
                  {c.name}
                  <span>
                    {products.filter((p) => p.category === c.id).length}
                  </span>
                </label>
              ))}
            {collection ? (
              <Link className="filter-all" href="/categories/">
                View all collections <ArrowUpRight size={13} />
              </Link>
            ) : null}
          </div>
          <div className="filter-section">
            <h3>
              Price range <small>INR</small>
            </h3>
            <div className="price-inputs">
              <label>
                <span>Min price</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={min}
                  placeholder="₹ 0"
                  onChange={(e) => setMin(e.target.value)}
                />
              </label>
              <span>—</span>
              <label>
                <span>Max price</span>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={max}
                  placeholder="₹ 5,000"
                  onChange={(e) => setMax(e.target.value)}
                />
              </label>
            </div>
            {invalidRange ? (
              <p className="field-error" role="alert">
                Minimum price must not exceed maximum.
              </p>
            ) : null}
          </div>
          <div className="filter-section">
            <h3>Demo brands</h3>
            <label className="radio-field">
              <input
                type="radio"
                name="brand"
                checked={!brand}
                onChange={() => setBrand("")}
              />{" "}
              All demo labels
            </label>
            {brands.map((b) => (
              <label className="radio-field" key={b}>
                <input
                  type="radio"
                  name="brand"
                  checked={brand === b}
                  onChange={() => setBrand(b)}
                />
                {b}
              </label>
            ))}
            <p className="filter-note">
              Fictional labels for demonstration. No brand partnerships are
              implied.
            </p>
          </div>
          <button className="reset-filters" onClick={reset}>
            <RotateCcw size={14} /> Reset filters
          </button>
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search size={17} />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search this collection…"
                aria-label="Search catalog products"
              />
            </div>
            <button
              className="mobile-filter btn btn-secondary"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <label className="sort-field">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </label>
          </div>
          <div className="results-count">
            <span>
              {list.length} {list.length === 1 ? "product" : "products"}
            </span>
            {active ? (
              <button onClick={reset}>
                Clear filters <X size={12} />
              </button>
            ) : null}
          </div>
          {list.length ? (
            <ProductGrid items={list} />
          ) : (
            <div className="empty-state">
              <Search size={34} />
              <h2>No products found.</h2>
              <p>Try a different search or adjust your filters.</p>
              <button className="btn btn-primary" onClick={reset}>
                Reset filters <RotateCcw size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
