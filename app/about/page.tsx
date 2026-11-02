import Link from "next/link";
import { ArrowUpRight, Lightbulb, Layers, MapPin } from "lucide-react";
import { categories } from "@/lib/catalog";
import { Breadcrumbs, PageIntro, StorePhotoNotice } from "@/components/Shell";
export const metadata = { title: "About our store" };
export default function Page() {
  return (
    <div className="container about-page">
      <Breadcrumbs items={[{ label: "About us" }]} />
      <div className="about-hero">
        <div>
          <PageIntro
            eyebrow="HELLO, WE’RE MATE ELECTRICALS"
            title="Every space starts with a connection."
            description="An electrical products and lighting store in Nagpur, Maharashtra. Helping you explore the essentials for your home, business, and next project."
          />
          <Link className="btn btn-primary" href="/shop/">
            Explore our demo range <ArrowUpRight size={17} />
          </Link>
        </div>
        <figure>
          <img
            src="/assets/interior.png"
            alt="Styled illustrative interior showing lighting and a ceiling fan; not a photograph of the store"
            width="1536"
            height="1024"
          />
          <figcaption>
            Styled interior imagery · Not an actual store photograph
          </figcaption>
        </figure>
      </div>
      <section className="section about-story">
        <span className="eyebrow">THE EVERYDAY, WELL CONNECTED</span>
        <div>
          <h2>
            The useful details.
            <br />
            The finishing touches.
          </h2>
          <p>
            Electrical products are part of everyday life: the light over your
            table, the fan in your room, and the fittings that connect your
            space. Mate Electricals is a local electrical and lighting store in
            Hingna, Nagpur.
            <br />
            <br />
            This online store is a demonstration of how the shop could serve
            customers online. Its sample products, prices and brand labels are
            illustrative. Visit the store to confirm the actual range and
            discuss your requirements.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE WHAT’S POSSIBLE</span>
            <h2>For homes. For projects. For everyday.</h2>
          </div>
          <Link className="text-link" href="/categories/">
            All collections <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="about-category-links">
          {categories.map((c) => (
            <Link href={"/collections/" + c.id + "/"} key={c.id}>
              {c.name}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section store-gallery">
        <div>
          <span className="eyebrow">OUR STORE & GALLERY</span>
          <h2>
            There’s a real shop
            <br />
            behind the screen.
          </h2>
          <p>
            Find us in Hingna, Nagpur. Bring a product list, your project plans,
            or the specifications your electrician recommends.
          </p>
          <p className="gallery-note">
            Actual storefront, counter, shelf and lighting-sample photographs
            are awaiting upload. The available attachments contain design
            references only, so no images here are presented as photographs of
            the shop.
          </p>
        </div>
        <StorePhotoNotice />
      </section>
    </div>
  );
}
