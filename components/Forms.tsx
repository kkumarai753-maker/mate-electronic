"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  LoaderCircle,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  submitDemoCheckout,
  submitDemoContact,
  submitBulkEnquiry,
} from "../lib/api";

type Errors = Record<string, string>;
type FieldProps = {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  wide?: boolean;
  children?: ReactNode;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
};

function Field({
  name,
  label,
  error,
  type = "text",
  autoComplete,
  placeholder,
  required = true,
  wide,
  children,
  inputMode,
  maxLength,
}: FieldProps) {
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? (
          <span aria-hidden="true"> *</span>
        ) : (
          <span className="optional"> (optional)</span>
        )}
      </label>
      {children || (
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error ? (
        <small className="field-error" id={`${name}-error`}>
          {error}
        </small>
      ) : null}
    </div>
  );
}

function text(data: FormData, key: string) {
  return String(data.get(key) || "").trim();
}
function validPhone(phone: string) {
  return /^(?:\+91|91)?[6-9]\d{9}$/.test(phone.replace(/[\s()-]/g, ""));
}
function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function focusError(form: HTMLFormElement) {
  requestAnimationFrame(() =>
    (
      form.querySelector('[aria-invalid="true"]') as HTMLElement | null
    )?.focus(),
  );
}
function referenceFrom(result: unknown) {
  if (result && typeof result === "object") {
    const value = result as Record<string, unknown>;
    const reference =
      value.reference ?? value.demo_reference ?? value.order_reference;
    if (typeof reference === "string") return reference;
  }
  return "DEMO ONLY";
}

function FormNotice({ children }: { children: ReactNode }) {
  return (
    <div className="form-notice">
      <Info size={18} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
function SubmitButton({
  busy,
  children,
}: {
  busy: boolean;
  children: ReactNode;
}) {
  return (
    <button type="submit" className="btn btn-primary" disabled={busy}>
      {busy ? (
        <>
          <LoaderCircle size={17} className="spin" aria-hidden="true" />{" "}
          Checking details…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: text(data, "contact-name"),
      email: text(data, "contact-email"),
      phone: text(data, "contact-phone"),
      message: text(data, "contact-message"),
    };
    const next: Errors = {};
    if (payload.name.length < 2 || payload.name.length > 100)
      next["contact-name"] = "Enter your name (2–100 characters).";
    if (!validEmail(payload.email))
      next["contact-email"] = "Enter a valid email address.";
    if (payload.phone && !validPhone(payload.phone))
      next["contact-phone"] = "Enter a valid 10-digit Indian mobile number.";
    if (payload.message.length < 10 || payload.message.length > 3000)
      next["contact-message"] =
        "Enter a message between 10 and 3,000 characters.";
    setErrors(next);
    setFailure("");
    if (Object.keys(next).length) {
      focusError(form);
      return;
    }
    setBusy(true);
    try {
      await submitDemoContact({ ...payload, demo_acknowledged: true });
      setSuccess(true);
      form.reset();
    } catch {
      setFailure(
        "The demo could not validate your message. Please try again. Nothing has been sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <span className="eyebrow">DEMO COMPLETE</span>
        <h2>Your message looks good.</h2>
        <p>
          This was a demonstration. No message was delivered to the shop and
          your details were not saved.
        </p>
        <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
          Try another message <ArrowRight size={16} />
        </button>
      </div>
    );

  return (
    <form className="store-form" noValidate onSubmit={submit}>
      <FormNotice>
        Demo contact form. Your details are validated for this demonstration
        only. No message is sent or saved.
      </FormNotice>
      <p className="required-note">Fields marked * are required.</p>
      <div className="form-grid">
        <Field
          name="contact-name"
          label="Full name"
          autoComplete="name"
          placeholder="Your name"
          maxLength={100}
          error={errors["contact-name"]}
        />
        <Field
          name="contact-email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          error={errors["contact-email"]}
        />
        <Field
          name="contact-phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          maxLength={18}
          required={false}
          wide
          error={errors["contact-phone"]}
        />
        <Field
          name="contact-message"
          label="How can we help?"
          wide
          error={errors["contact-message"]}
        >
          <textarea
            id="contact-message"
            name="contact-message"
            rows={5}
            placeholder="Tell us what you are looking for…"
            required
            minLength={10}
            maxLength={3000}
            aria-invalid={Boolean(errors["contact-message"])}
            aria-describedby={
              errors["contact-message"] ? "contact-message-error" : undefined
            }
          />
        </Field>
      </div>
      {failure ? (
        <p className="form-error" role="alert">
          {failure}
        </p>
      ) : null}
      <div className="form-actions">
        <SubmitButton busy={busy}>
          Validate demo message <Send size={16} aria-hidden="true" />
        </SubmitButton>
      </div>
    </form>
  );
}

export function BulkEnquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [whatsAppUrl, setWhatsAppUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const quantityValue = text(data, "bulk-quantity");
    const payload = {
      name: text(data, "bulk-name"),
      company: text(data, "bulk-company"),
      phone: text(data, "bulk-phone"),
      requirements: text(data, "bulk-requirements"),
      quantity: Number(quantityValue),
      message: text(data, "bulk-message"),
    };
    const next: Errors = {};
    if (payload.name.length < 2 || payload.name.length > 100)
      next["bulk-name"] = "Enter your name (2–100 characters).";
    if (payload.company.length > 150)
      next["bulk-company"] = "Keep the company name under 150 characters.";
    if (!validPhone(payload.phone))
      next["bulk-phone"] = "Enter a valid 10-digit Indian mobile number.";
    if (payload.requirements.length < 10 || payload.requirements.length > 3000)
      next["bulk-requirements"] =
        "Describe the products you need (10–3,000 characters).";
    if (
      !quantityValue ||
      !Number.isInteger(payload.quantity) ||
      payload.quantity < 1 ||
      payload.quantity > 100000
    )
      next["bulk-quantity"] = "Enter a whole quantity between 1 and 100,000.";
    if (payload.message.length > 3000)
      next["bulk-message"] = "Keep your message under 3,000 characters.";
    setErrors(next);
    setFailure("");
    if (Object.keys(next).length) {
      focusError(form);
      return;
    }
    setBusy(true);
    try {
      const result = await submitBulkEnquiry({
        ...payload,
        demo_acknowledged: true,
      });
      setWhatsAppUrl(result.whatsapp_url);
    } catch {
      setFailure(
        "The demo could not validate your enquiry. Please try again. No request has been sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (whatsAppUrl)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <span className="eyebrow">YOUR ENQUIRY IS READY</span>
        <h2>One step closer to your project.</h2>
        <p>
          Your enquiry has been prepared, not submitted. Open WhatsApp to review
          the message before choosing whether to send it.
        </p>
        <div className="unverified-note">
          <Info size={18} aria-hidden="true" />
          <p>
            <strong>Number not yet verified:</strong> +91 93221 72834 was
            provided from a store photograph. Confirm it belongs to the shop
            before sending personal or project details.
          </p>
        </div>
        <div className="form-actions">
          <a
            className="btn btn-primary"
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review on WhatsApp <MessageCircle size={17} aria-hidden="true" />
          </a>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setWhatsAppUrl("")}
          >
            Edit enquiry
          </button>
        </div>
        <p className="required-note">
          No quotation has been issued. Availability and final prices must be
          confirmed by the shop.
        </p>
      </div>
    );

  return (
    <form className="store-form" noValidate onSubmit={submit}>
      <FormNotice>
        Build a project enquiry here. This demo does not send or save your
        request. You can review a prepared WhatsApp message after validation.
      </FormNotice>
      <p className="required-note">Fields marked * are required.</p>
      <div className="form-grid">
        <Field
          name="bulk-name"
          label="Customer name"
          autoComplete="name"
          placeholder="Your full name"
          maxLength={100}
          error={errors["bulk-name"]}
        />
        <Field
          name="bulk-company"
          label="Company name"
          autoComplete="organization"
          placeholder="Company or project name"
          maxLength={150}
          required={false}
          error={errors["bulk-company"]}
        />
        <Field
          name="bulk-phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          maxLength={18}
          error={errors["bulk-phone"]}
        />
        <Field
          name="bulk-quantity"
          label="Approximate quantity"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 50"
          error={errors["bulk-quantity"]}
        />
        <Field
          name="bulk-requirements"
          label="Product requirements"
          wide
          error={errors["bulk-requirements"]}
        >
          <textarea
            id="bulk-requirements"
            name="bulk-requirements"
            rows={4}
            placeholder="List product types, ratings, dimensions or preferred specifications…"
            required
            minLength={10}
            maxLength={3000}
            aria-invalid={Boolean(errors["bulk-requirements"])}
            aria-describedby={
              errors["bulk-requirements"]
                ? "bulk-requirements-error"
                : undefined
            }
          />
        </Field>
        <Field
          name="bulk-message"
          label="Additional message"
          wide
          required={false}
          error={errors["bulk-message"]}
        >
          <textarea
            id="bulk-message"
            name="bulk-message"
            rows={3}
            placeholder="Tell us about your project or timeline…"
            maxLength={3000}
            aria-invalid={Boolean(errors["bulk-message"])}
            aria-describedby={
              errors["bulk-message"] ? "bulk-message-error" : undefined
            }
          />
        </Field>
      </div>
      {failure ? (
        <p className="form-error" role="alert">
          {failure}
        </p>
      ) : null}
      <div className="form-actions">
        <SubmitButton busy={busy}>
          Prepare bulk enquiry <ArrowRight size={17} aria-hidden="true" />
        </SubmitButton>
      </div>
      <p className="unverified-note">
        WhatsApp contact +91 93221 72834 is unverified. Confirm the shop’s
        number before sending an enquiry.
      </p>
    </form>
  );
}

type CheckoutProps = {
  items: { productId: string; quantity: number }[];
  total: number;
  onComplete: () => void;
};
export function CheckoutForm({ items, total, onComplete }: CheckoutProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const customer = {
      name: text(data, "checkout-name"),
      phone: text(data, "checkout-phone"),
      email: text(data, "checkout-email"),
      address: text(data, "checkout-address"),
      city: text(data, "checkout-city"),
      state: text(data, "checkout-state"),
      pinCode: text(data, "checkout-pin"),
    };
    const next: Errors = {};
    if (customer.name.length < 2 || customer.name.length > 100)
      next["checkout-name"] = "Enter your full name (2–100 characters).";
    if (!validPhone(customer.phone))
      next["checkout-phone"] = "Enter a valid 10-digit Indian mobile number.";
    if (!validEmail(customer.email))
      next["checkout-email"] = "Enter a valid email address.";
    if (customer.address.length < 10 || customer.address.length > 500)
      next["checkout-address"] =
        "Enter a complete address (10–500 characters).";
    if (customer.city.length < 2 || customer.city.length > 100)
      next["checkout-city"] = "Enter a valid city (2–100 characters).";
    if (customer.state.length < 2 || customer.state.length > 100)
      next["checkout-state"] = "Enter a valid state (2–100 characters).";
    if (!/^[1-9]\d{5}$/.test(customer.pinCode))
      next["checkout-pin"] = "Enter a valid 6-digit Indian PIN code.";
    if (!data.get("demo-acknowledgement"))
      next["demo-acknowledgement"] =
        "Acknowledge that this is a demonstration checkout.";
    if (!items.length) {
      setFailure(
        "Your cart is empty. Add a product before trying demo checkout.",
      );
      return;
    }
    setErrors(next);
    setFailure("");
    if (Object.keys(next).length) {
      focusError(form);
      return;
    }
    setBusy(true);
    try {
      const response = await submitDemoCheckout({
        customer: {
          full_name: customer.name,
          mobile: customer.phone,
          email: customer.email,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pin_code: customer.pinCode,
        },
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        demo_acknowledged: true,
      });
      setReference(referenceFrom(response));
      form.reset();
      onComplete();
    } catch {
      setFailure(
        "The demo could not validate this checkout. Please try again. No order was placed and no payment was taken.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (reference)
    return (
      <div className="form-success checkout-success" role="status">
        <CheckCircle2 size={48} aria-hidden="true" />
        <span className="eyebrow">DEMONSTRATION COMPLETE</span>
        <h2>That’s how easy it could be.</h2>
        <p>
          You have completed the sample checkout.{" "}
          <strong>
            No real order has been placed and no payment has been taken.
          </strong>
        </p>
        <div className="demo-reference">
          <span>Demo reference</span>
          <strong>{reference}</strong>
          <span>Illustrative order total</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(total)}
          </strong>
        </div>
        <p>
          Your personal details have not been saved. Your demo cart has been
          cleared.
        </p>
        <Link className="btn btn-primary" href="/shop/">
          Continue shopping <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    );

  return (
    <form className="store-form" noValidate onSubmit={submit}>
      <FormNotice>
        <strong>Demonstration checkout.</strong> Use sample details. No payment
        information is required, no real order is placed, and customer details
        are not saved.
      </FormNotice>
      <div className="form-section-title">
        <span className="step-number">1</span>
        <h2>Customer details</h2>
      </div>
      <p className="required-note">Fields marked * are required.</p>
      <div className="form-grid">
        <Field
          name="checkout-name"
          label="Full name"
          autoComplete="name"
          placeholder="e.g. Demo Customer"
          maxLength={100}
          wide
          error={errors["checkout-name"]}
        />
        <Field
          name="checkout-phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          maxLength={18}
          error={errors["checkout-phone"]}
        />
        <Field
          name="checkout-email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="demo@example.com"
          maxLength={254}
          error={errors["checkout-email"]}
        />
        <Field
          name="checkout-address"
          label="Address"
          autoComplete="street-address"
          placeholder="House / flat, street and area"
          maxLength={500}
          wide
          error={errors["checkout-address"]}
        />
        <Field
          name="checkout-city"
          label="City"
          autoComplete="address-level2"
          placeholder="Nagpur"
          maxLength={100}
          error={errors["checkout-city"]}
        />
        <Field
          name="checkout-state"
          label="State"
          autoComplete="address-level1"
          placeholder="Maharashtra"
          maxLength={100}
          error={errors["checkout-state"]}
        />
        <Field
          name="checkout-pin"
          label="PIN code"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="6-digit PIN code"
          maxLength={6}
          error={errors["checkout-pin"]}
        />
      </div>
      <div className="form-section-title">
        <span className="step-number">2</span>
        <h2>Demo confirmation</h2>
      </div>
      <div className="checkout-payment">
        <ShieldCheck size={23} aria-hidden="true" />
        <div>
          <strong>No payment required</strong>
          <p>
            This demonstration does not connect to a payment gateway or send an
            order to the store.
          </p>
        </div>
      </div>
      <div className="checkbox-field">
        <label htmlFor="demo-acknowledgement">
          <input
            id="demo-acknowledgement"
            name="demo-acknowledgement"
            type="checkbox"
            required
            aria-invalid={Boolean(errors["demo-acknowledgement"])}
            aria-describedby={
              errors["demo-acknowledgement"]
                ? "demo-acknowledgement-error"
                : undefined
            }
          />
          <span>
            I understand this is a demonstration and no real order will be
            placed.
          </span>
        </label>
        {errors["demo-acknowledgement"] ? (
          <small className="field-error" id="demo-acknowledgement-error">
            {errors["demo-acknowledgement"]}
          </small>
        ) : null}
      </div>
      {failure ? (
        <p className="form-error" role="alert">
          {failure}
        </p>
      ) : null}
      <div className="form-actions">
        <SubmitButton busy={busy}>
          Complete demo checkout <ArrowRight size={17} aria-hidden="true" />
        </SubmitButton>
      </div>
    </form>
  );
}
