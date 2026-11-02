import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, products } from "@/lib/catalog";
import { Breadcrumbs, PageIntro } from "@/components/Shell";
export const metadata = { title: "Explore our collections" };
export default function Page() {
  return (
    <div className="container categories-page">
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <PageIntro
        eyebrow="A LITTLE OF EVERYTHING. EVERYTHING YOU NEED."
        title="Find your connection."
        description="Eight collections for the way you live, work, and build."
      />
      <div className="collection-grid">
        {categories.map((c) => (
          <Link
            href={"/collections/" + c.id + "/"}
            className="collection-card"
            key={c.id}
          >
            <div>
              <img
                src={c.image}
                alt={c.name + " — representative illustration"}
                width="400"
                height="320"
              />
              <span>
                {products.filter((p) => p.category === c.id).length} demo
                products
              </span>
            </div>
            <h2>
              {c.name}
              <ArrowUpRight size={21} />
            </h2>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
      <p className="catalog-demo-note">
        Suggested collections for this demo. The shop’s full inventory, brands
        and stock have not been verified.
      </p>
    </div>
  );
}
