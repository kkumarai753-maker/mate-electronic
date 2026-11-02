import Link from "next/link";
import { Phone, MessageCircle, MapPin, ArrowUpRight, Info } from "lucide-react";
import { business, whatsappLink } from "@/lib/catalog";
import { Breadcrumbs, PageIntro, StorePhotoNotice } from "@/components/Shell";
import { ContactForm } from "@/components/Forms";
export const metadata = { title: "Contact & store location" };
export default function Page() {
  return (
    <div className="container contact-page">
      <Breadcrumbs items={[{ label: "Contact us" }]} />
      <PageIntro
        eyebrow="LET’S MAKE A CONNECTION"
        title="Here for your next project."
        description="Explore the demo form, find our shared shop location, or prepare a product enquiry."
      />
      <div className="contact-cards">
        <div>
          <MapPin />
          <h2>Visit our store</h2>
          <p>
            Hingna, Nagpur
            <br />
            Maharashtra, India
          </p>
          <a href={business.map} target="_blank" rel="noopener noreferrer">
            Open shared location <ArrowUpRight size={15} />
          </a>
          <small>
            Location link supplied by the user; not independently verified.
          </small>
        </div>
        <div>
          <Phone />
          <h2>Call the shop</h2>
          <a href="tel:+918668649168">
            +91 86686 49168 <ArrowUpRight size={15} />
          </a>
          <p>Discuss products and requirements.</p>
          <small className="unverified-label">
            Unverified contact · Confirm before calling
          </small>
        </div>
        <div>
          <MessageCircle />
          <h2>WhatsApp enquiry</h2>
          <a
            href={whatsappLink(
              "Hello Mate Electricals, I would like to enquire about your electrical products. Please confirm that this is the shop’s number.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            +91 93221 72834 <ArrowUpRight size={15} />
          </a>
          <p>Review your message before sending.</p>
          <small className="unverified-label">
            Unverified contact · Confirm before sharing details
          </small>
        </div>
      </div>
      <div className="contact-layout">
        <div className="form-card">
          <span className="eyebrow">TELL US WHAT YOU HAVE IN MIND</span>
          <h2>Start a conversation.</h2>
          <ContactForm />
        </div>
        <aside className="contact-aside">
          <StorePhotoNotice />
          <div className="contact-bulk">
            <h3>Buying for a project?</h3>
            <p>
              Prepare a detailed product and quantity list for a bulk enquiry.
            </p>
            <Link className="text-link" href="/bulk-enquiry/">
              Request a bulk quote <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
