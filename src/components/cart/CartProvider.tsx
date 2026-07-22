"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { ArrowRight, X } from "lucide-react";
import { checkoutDomain } from "@/lib/shopify";
import { getSupabase } from "@/lib/supabaseClient";

export type CartLine = {
  key: string;         // productId::variantId
  variantId: string;   // gid://shopify/ProductVariant/...
  productId: string;
  title: string;
  variantLabel?: string; // "Black · M"
  price: number;
  image?: string;
  qty: number;
};

type NewLine = Omit<CartLine, "key" | "qty">;

type CartCtx = {
  items: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: NewLine, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  checkout: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "omc:cart:v1";
const FREE_SHIP_THRESHOLD = 300; // free shipping on orders at/above this subtotal
const numeric = (id: string) => id.split("/").pop();
const money = (n: number) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

function mergeCarts(a: CartLine[], b: CartLine[]): CartLine[] {
  const map = new Map<string, CartLine>();
  for (const l of a) map.set(l.key, { ...l });
  for (const l of b) {
    const ex = map.get(l.key);
    if (ex) ex.qty += l.qty;
    else map.set(l.key, { ...l });
  }
  return [...map.values()];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const mergedFor = useRef<string | null>(null);

  // Load saved bag once, on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist the bag to the browser as it changes.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  // When signed in, load the saved cart and keep it in sync with the profile.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let active = true;
    async function loadFor(uid: string | null) {
      if (!active) return;
      setUserId(uid);
      if (!uid) { mergedFor.current = null; return; }
      if (mergedFor.current === uid) return; // already merged this session
      mergedFor.current = uid;
      const { data } = await sb!
        .from("omc_saved_carts").select("items").eq("user_id", uid).maybeSingle();
      const saved: CartLine[] = Array.isArray(data?.items) ? (data!.items as CartLine[]) : [];
      if (active && saved.length) setItems((local) => mergeCarts(local, saved));
    }
    sb.auth.getUser().then(({ data }) => loadFor(data.user?.id ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => loadFor(s?.user?.id ?? null));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  // Push cart changes to the signed-in profile (debounced).
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId || !hydrated) return;
    const t = setTimeout(() => {
      sb.from("omc_saved_carts")
        .upsert({ user_id: userId, items, updated_at: new Date().toISOString() })
        .then(() => {});
    }, 700);
    return () => clearTimeout(t);
  }, [items, userId, hydrated]);

  const add = useCallback<CartCtx["add"]>((line, qty = 1) => {
    const key = `${line.productId}::${line.variantId}`;
    setItems((prev) => {
      const i = prev.findIndex((p) => p.key === key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...line, key, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) => (i.key !== key ? [i] : qty <= 0 ? [] : [{ ...i, qty }])),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items],
  );

  const checkout = useCallback(() => {
    if (!items.length) return;
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (w.fbq) {
      w.fbq("track", "InitiateCheckout", { content_ids: items.map((i) => i.productId), content_type: "product", value: items.reduce((n, i) => n + i.price * i.qty, 0), currency: "USD", num_items: items.reduce((n, i) => n + i.qty, 0) });
    }
    const path = items.map((i) => `${numeric(i.variantId)}:${i.qty}`).join(",");
    window.location.href = `https://${checkoutDomain}/cart/${path}`;
  }, [items]);

  const value: CartCtx = {
    items, count, subtotal, isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add, remove, setQty, clear, checkout,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

function CartDrawer() {
  const { items, isOpen, close, subtotal, count, setQty, remove, checkout } = useCart();

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const shipPct = Math.min(100, subtotal <= 0 ? 0 : (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-paper text-ink shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="label">Your Bag{count > 0 ? ` (${count})` : ""}</span>
          <button onClick={close} aria-label="Close bag" className="hover:opacity-60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-line px-5 py-3">
            <p className="text-center text-[11px] uppercase tracking-[0.14em] text-ink">
              {remaining > 0 ? (
                <>You&apos;re <span className="font-semibold">{money(remaining)}</span> away from free shipping</>
              ) : (
                "You've unlocked free shipping"
              )}
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${shipPct}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="label text-mute">Your bag is empty</p>
            <button onClick={close} className="label border-b border-ink pb-1 hover:opacity-60">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((it) => (
                <div key={it.key} className="flex gap-4 border-b border-line py-5">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-stone">
                    {it.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <p className="text-[13px] leading-snug text-ink">{it.title}</p>
                      <button
                        onClick={() => remove(it.key)}
                        aria-label="Remove item"
                        className="text-mute hover:text-ink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {it.variantLabel && (
                      <p className="mt-1 text-[12px] text-mute">{it.variantLabel}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => setQty(it.key, it.qty - 1)}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1 text-ink hover:bg-stone"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-[13px]">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.key, it.qty + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1 text-ink hover:bg-stone"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[13px] text-ink">{money(it.price * it.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="label text-mute">Subtotal</span>
                <span className="text-base text-ink">{money(subtotal)}</span>
              </div>
              <p className="mt-1 label-sm text-mute">
                {subtotal >= FREE_SHIP_THRESHOLD
                  ? "Free shipping unlocked · taxes calculated at checkout"
                  : "Shipping & taxes calculated at checkout"}
              </p>
              <button
                onClick={checkout}
                className="mt-4 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={close}
                className="mt-3 w-full text-center label-sm text-mute hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
