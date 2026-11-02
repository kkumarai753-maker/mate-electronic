import { products, business, whatsappLink } from "./catalog";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
export const apiMode = API_URL ? "Python API demo" : "Browser demo";
type Customer = {
  full_name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
};
export type CheckoutRequest = {
  items: { product_id: string; quantity: number }[];
  customer: Customer;
  demo_acknowledged: true;
};
export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  demo_acknowledged: true;
};
export type BulkRequest = {
  name: string;
  company?: string;
  phone: string;
  requirements: string;
  quantity: number;
  message?: string;
  demo_acknowledged: true;
};
async function post<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Please check your details and try again.");
  return response.json();
}
export async function submitDemoCheckout(
  payload: CheckoutRequest,
): Promise<{
  reference: string;
  demo: boolean;
  notice: string;
  order?: { total: number };
}> {
  if (API_URL) return post("/api/demo-checkout", payload);
  let total = 0;
  if (!payload.items.length) throw new Error("Cart is empty");
  for (const item of payload.items) {
    const p = products.find((p) => p.id === item.product_id);
    if (
      !p ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      throw new Error("Invalid cart");
    total += p.price * item.quantity;
  }
  if (!payload.demo_acknowledged)
    throw new Error("Demo acknowledgement required");
  return {
    reference: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    demo: true,
    notice:
      "Browser demonstration only. No order placed, no payment collected, no customer details stored.",
    order: { total },
  };
}
export async function submitDemoContact(
  payload: ContactRequest,
): Promise<{ demo: boolean; notice: string }> {
  if (API_URL) return post("/api/contact", payload);
  return {
    demo: true,
    notice:
      "Demo form validated. No message was sent and no details were stored.",
  };
}
export async function submitBulkEnquiry(
  payload: BulkRequest,
): Promise<{
  demo: boolean;
  notice: string;
  whatsapp_url: string;
  contact_verified: boolean;
  contact_notice: string;
}> {
  if (API_URL) return post("/api/bulk-enquiry", payload);
  const message = [
    "Hello Mate Electricals, I would like to enquire about a bulk requirement.",
    `Name: ${payload.name}`,
    `Company: ${payload.company || "Not provided"}`,
    `Phone: ${payload.phone}`,
    `Requirements: ${payload.requirements}`,
    `Quantity: ${payload.quantity}`,
    `Additional notes: ${payload.message || "None"}`,
    "",
    "Please confirm availability, specifications and quotation.",
  ].join("\n");
  return {
    demo: true,
    notice:
      "No request has been sent. Opening WhatsApp prepares a message; you choose whether to send it.",
    whatsapp_url: whatsappLink(message),
    contact_verified: business.contactsVerified,
    contact_notice:
      "Unverified business number. Confirm with the store before contacting.",
  };
}
