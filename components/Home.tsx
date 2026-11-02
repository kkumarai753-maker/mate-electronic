"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  PackageCheck,
  MapPin,
  Headphones,
  Layers,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import { products, categories, business } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";
const slides = [
  {
    eyebrow: "THE EVERYDAY, UPGRADED",
    title: (
      <>
        POWERING
        <br />
        EVERY <span>SPACE.</span>
      </>
    ),
    description:
      "Discover lighting, electrical essentials, and modern solutions for your home, business, and projects.",
    image: "/assets/hero.png",
    alt: "Illustrative studio arrangement of a ceiling fan, lighting, switches and cables",
    link: "/shop/",
  },
  {
    eyebrow: "MAKE ROOM FOR BETTER LIGHT",
    title: (
      <>
        LIGHT THAT
        <br />
        FEELS LIKE <span>HOME.</span>
      </>
    ),
    description:
      "From a quiet corner to a whole new room. Explore considered lighting and fixtures for your everyday spaces.",
    image: "/assets/interior.png",
    alt: "Illustrative interior with modern pendant lighting and a ceiling fan",
    link: "/collections/led-lighting/",
  },
];
export function SectionHeading({
  eyebrow,
  title,
  href,
  label = "View collection",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {href ? (
        <Link className="text-link" href={href}>
          {label}
          <ArrowUpRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}
export default function Home() {
  const [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = setInterval(() => setSlide((i) => (i + 1) % slides.length), 8500);
    return () => clearInterval(t);
  }, [paused]);
  const s = slides[slide];
  return (
    <>
      <section
        className="hero container"
        aria-roledescription="carousel"
        aria-label="Featured collections"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
      >
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span /> {s.eyebrow}
          </span>
          <h1>{s.title}</h1>
          <p>{s.description}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={s.link}>
              SHOP NOW <ArrowUpRight size={17} />
            </Link>
            <Link className="btn btn-plain" href="/categories/">
              EXPLORE COLLECTIONS <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-bottom">
            <span>
              <CheckCircle2 size={18} /> Everyday electricals
            </span>
            <span>
              <MapPin size={18} /> Nagpur, Maharashtra
            </span>
          </div>
        </div>
        <div className="hero-image">
          <img
            key={s.image}
            src={s.image}
            alt={s.alt}
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <span className="hero-circle">
            Small details.
            <strong>
              Brighter
              <br />
              possibilities.
            </strong>
            <ArrowUpRight size={18} />
          </span>
          <span className="hero-image-note">
            STYLED PRODUCT IMAGERY · ILLUSTRATIVE
          </span>
        </div>
        <div className="slider-controls">
          <span className="slider-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlide(i);
                  setPaused(true);
                }}
                className={slide === i ? "active" : ""}
                aria-label={`Show slide ${i + 1}`}
                aria-pressed={slide === i}
              />
            ))}
          </span>
          <button
            onClick={() => {
              setSlide((slide + slides.length - 1) % slides.length);
              setPaused(true);
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={() => {
              setSlide((slide + 1) % slides.length);
              setPaused(true);
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
      <div className="container confidence-bar">
        <div>
          <PackageCheck />
          <span>
            <b>One place. Many essentials.</b>
            <small>Electricals for your everyday spaces</small>
          </span>
        </div>
        <div>
          <Lightbulb />
          <span>
            <b>Find your brighter side</b>
            <small>Lighting for function and atmosphere</small>
          </span>
        </div>
        <div>
          <Layers />
          <span>
            <b>Planning a bigger project?</b>
            <small>Explore bulk enquiry options</small>
          </span>
        </div>
        <div>
          <MapPin />
          <span>
            <b>Your local connection</b>
            <small>Visit our store in Hingna, Nagpur</small>
          </span>
        </div>
      </div>
      <section className="section container">
        <SectionHeading
          eyebrow="FIND YOUR CONNECTION"
          title="Shop by category."
          href="/categories/"
          label="Explore all categories"
        />
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              href={"/collections/" + c.id + "/"}
              className="category-tile"
              key={c.id}
            >
              <span>
                <img
                  src={c.image}
                  alt={c.name}
                  width="400"
                  height="320"
                  loading="lazy"
                />
                <ArrowUpRight size={16} />
              </span>
              <h3>{c.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="THE MATE EDIT"
          title="Everyday essentials. Thoughtfully chosen."
          href="/shop/"
          label="Shop all products"
        />
        <ProductGrid items={products.filter((p) => p.featured).slice(0, 4)} />
        <p className="section-caption">
          An illustrative selection for this demo. Prices, specifications and
          stock require store confirmation.
        </p>
      </section>
      <section className="container duo-promos">
        <Link
          href="/collections/fans-fixtures/"
          className="promo-card fan-promo"
        >
          <div>
            <span className="eyebrow">COMFORT, IN EVERY CORNER</span>
            <h2>
              A fresh spin
              <br />
              on everyday living.
            </h2>
            <span className="text-link">
              Explore fans & fixtures <ArrowUpRight size={16} />
            </span>
          </div>
          <img
            src="/assets/fan.svg"
            alt="Illustrative ceiling fan"
            width="400"
            height="320"
          />
        </Link>
        <Link
          href="/collections/modular-switches/"
          className="promo-card switch-promo"
        >
          <div>
            <span className="eyebrow">FINISH WITH A LITTLE FINESSE</span>
            <h2>
              Small details.
              <br />
              Beautiful connections.
            </h2>
            <span className="text-link">
              Explore modular switches <ArrowUpRight size={16} />
            </span>
          </div>
          <img
            src="/assets/switch.svg"
            alt="Illustrative modular switch plate"
            width="400"
            height="320"
          />
        </Link>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="DISCOVER YOUR NEXT UPGRADE"
          title="Trending in the demo store."
          href="/shop/?sort=featured"
          label="Explore the edit"
        />
        <ProductGrid items={products.filter((p) => p.trending).slice(0, 4)} />
      </section>
      <section className="lighting-feature container">
        <div className="lighting-copy">
          <span className="eyebrow">THE LIGHTING COLLECTION</span>
          <h2>
            A warmer glow.
            <br />A brighter outlook.
          </h2>
          <p>
            Set the scene with decorative lighting, or get the basics
            brilliantly right with everyday LEDs.
          </p>
          <Link
            href="/collections/decorative-lighting/"
            className="btn btn-primary"
          >
            FIND YOUR LIGHT <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="lighting-art">
          <img
            src="/assets/pendant.svg"
            alt="Illustrative decorative pendant"
            width="400"
            height="320"
          />
          <span>GOOD LIGHT CHANGES EVERYTHING.</span>
        </div>
        <div className="lighting-mini">
          <Link href="/collections/led-lighting/">
            <img
              src="/assets/downlight.svg"
              alt="Ceiling downlight illustration"
              width="400"
              height="320"
            />
            <span>
              LED Lighting <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="BEHIND EVERY WELL-CONNECTED SPACE"
          title="The practical side of beautiful homes."
          href="/shop/"
          label="All electrical essentials"
        />
        <ProductGrid
          items={products
            .filter((p) =>
              [
                "wires-cables",
                "switchboards",
                "electrical-accessories",
                "smart-electricals",
              ].includes(p.category),
            )
            .filter((p, i) => i % 2 === 0)
            .slice(0, 4)}
        />
      </section>
      <section className="bulk-banner container">
        <div>
          <span className="eyebrow">FOR HOMES. FOR WORK. FOR WHAT’S NEXT.</span>
          <h2>
            ELECTRICAL SOLUTIONS
            <br />
            FOR EVERY PROJECT.
          </h2>
          <p>
            Explore electrical supplies for homes, offices, electricians,
            <br />
            contractors, and commercial projects.
          </p>
          <Link href="/bulk-enquiry/" className="btn btn-primary">
            REQUEST A BULK QUOTE <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="bulk-visual">
          <Layers size={100} strokeWidth={0.7} />
          <span>
            LET’S BUILD
            <br />
            <strong>
              something
              <br />
              well connected.
            </strong>
          </span>
        </div>
      </section>
      <section className="section container home-about">
        <div>
          <span className="eyebrow">HELLO FROM MATE ELECTRICALS</span>
          <h2>
            Your space.
            <br />
            Our local connection.
          </h2>
          <p>
            We’re an electrical products and lighting store in Nagpur. Explore
            the demo range online, then visit us in Hingna to discuss the
            products and specifications for your project.
          </p>
          <Link className="text-link" href="/about/">
            Get to know our store <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="visit-panel">
          <MapPin size={27} />
          <span className="eyebrow">VISIT OUR STORE</span>
          <h3>Hingna, Nagpur.</h3>
          <p>
            See products in person.
            <br />
            Bring your ideas and project requirements.
          </p>
          <a
            href={business.map}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Open shared shop location <ArrowUpRight size={16} />
          </a>
          <small>Store photographs are awaiting upload.</small>
        </div>
      </section>
    </>
  );
}
