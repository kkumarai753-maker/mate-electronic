import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container empty-state not-found">
      <span className="eyebrow">A CONNECTION WENT MISSING</span>
      <h1>We couldn’t find that page.</h1>
      <p>Browse the collection to find your next electrical essential.</p>
      <Link href="/shop/" className="btn btn-primary">
        Back to the shop <ArrowRight size={17} />
      </Link>
    </div>
  );
}
