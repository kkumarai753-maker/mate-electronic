import {
  Layers,
  ClipboardList,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs, PageIntro } from "@/components/Shell";
import { BulkEnquiryForm } from "@/components/Forms";
export const metadata = { title: "Bulk product & project enquiry" };
export default function Page() {
  return (
    <div className="container bulk-page">
      <Breadcrumbs items={[{ label: "Bulk enquiry" }]} />
      <div className="bulk-intro">
        <PageIntro
          eyebrow="FOR HOMES. FOR WORK. FOR WHAT’S NEXT."
          title="Electrical solutions for every project."
          description="Explore electrical supplies for homes, offices, electricians, contractors, and commercial projects."
        />
        <Layers size={100} strokeWidth={0.8} />
      </div>
      <div className="bulk-layout">
        <aside>
          <span className="eyebrow">LET’S TALK REQUIREMENTS</span>
          <h2>
            Build your list.
            <br />
            Start a conversation.
          </h2>
          <p>
            Share the products and quantities you have in mind. Use
            specifications from your electrician or project plan so the store
            can understand your requirements.
          </p>
          <div className="trade-tags">
            {[
              "Electricians",
              "Contractors",
              "Builders",
              "Interior designers",
              "Commercial buyers",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="bulk-steps">
            <div>
              <ClipboardList size={22} />
              <span>
                <b>Describe your requirement</b>
                <small>Product type, rating, quantity and finish.</small>
              </span>
            </div>
            <div>
              <MessageCircle size={22} />
              <span>
                <b>Review a WhatsApp message</b>
                <small>Nothing is sent automatically.</small>
              </span>
            </div>
            <div>
              <CheckCircle2 size={22} />
              <span>
                <b>Confirm with the shop</b>
                <small>Actual stock and quotes need confirmation.</small>
              </span>
            </div>
          </div>
          <p className="unverified-note">
            Business contacts are unverified. Confirm ownership before sending
            personal or project information.
          </p>
        </aside>
        <div className="form-card">
          <h2>Your project enquiry.</h2>
          <BulkEnquiryForm />
        </div>
      </div>
    </div>
  );
}
