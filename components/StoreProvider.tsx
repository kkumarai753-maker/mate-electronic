"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { products } from "@/lib/catalog";
import { CheckCircle2, X } from "lucide-react";
export type CartLine = { productId: string; quantity: number };
type Store = {
  cart: CartLine[];
  wishlist: string[];
  ready: boolean;
  add: (id: string, qty?: number) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  notify: (s: string) => void;
};
const Context = createContext<Store | null>(null);
const isProduct = (id: string) => products.some((p) => p.id === id);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]),
    [wishlist, setWishlist] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mate-store-v1") || "null");
      if (saved?.version === 1) {
        if (Array.isArray(saved.cart)) {
          const merged = new Map<string, number>();
          for (const l of saved.cart) {
            if (
              l &&
              typeof l.productId === "string" &&
              isProduct(l.productId) &&
              Number.isInteger(l.quantity) &&
              l.quantity > 0
            )
              merged.set(
                l.productId,
                Math.min(99, (merged.get(l.productId) || 0) + l.quantity),
              );
          }
          setCart(
            [...merged].map(([productId, quantity]) => ({
              productId,
              quantity,
            })),
          );
        }
        if (Array.isArray(saved.wishlist))
          setWishlist([
            ...new Set<string>(
              saved.wishlist.filter(
                (id: unknown) => typeof id === "string" && isProduct(id),
              ),
            ),
          ]);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "mate-store-v1",
          JSON.stringify({ version: 1, cart, wishlist }),
        );
      } catch {}
  }, [cart, wishlist, ready]);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3200);
    return () => clearTimeout(t);
  }, [message]);
  const notify = useCallback((s: string) => setMessage(s), []);
  function add(id: string, quantity = 1) {
    if (!ready || !isProduct(id)) return;
    const qty = Number.isFinite(quantity)
      ? Math.min(99, Math.max(1, Math.floor(quantity)))
      : 1;
    setCart((c) =>
      c.some((l) => l.productId === id)
        ? c.map((l) =>
            l.productId === id
              ? { ...l, quantity: Math.min(99, l.quantity + qty) }
              : l,
          )
        : [...c, { productId: id, quantity: qty }],
    );
    notify("Added to your cart");
  }
  function update(id: string, quantity: number) {
    if (!Number.isFinite(quantity)) return;
    setCart((c) =>
      c.map((l) =>
        l.productId === id
          ? { ...l, quantity: Math.min(99, Math.max(1, Math.floor(quantity))) }
          : l,
      ),
    );
  }
  function toggleWish(id: string) {
    if (!ready || !isProduct(id)) return;
    setWishlist((w) =>
      w.includes(id) ? w.filter((i) => i !== id) : [...w, id],
    );
  }
  return (
    <Context.Provider
      value={{
        cart,
        wishlist,
        ready,
        add,
        update,
        remove: (id) => setCart((c) => c.filter((l) => l.productId !== id)),
        clear: () => setCart([]),
        toggleWish,
        notify,
      }}
    >
      {children}
      <div
        className={`toast ${message ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message ? (
          <>
            <CheckCircle2 size={18} />
            {message}
            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </>
        ) : null}
      </div>
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider required");
  return store;
}
