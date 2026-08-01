"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { useRouter } from "next/navigation";

export function CheckoutClient({ userId }) {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const total = cart.reduce((t, i) => t + (i.price || 0) * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const msg = "Order:\n" + cart.map(i => "- " + i.name_en + " x" + i.quantity).join("\n");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), message: msg
        })
      });
      const data = await res.json();
      if (res.ok) { clearCart(); router.push("/order-success"); }
      else { setStatus("error"); setError(data.error || "Failed"); }
    } catch { setStatus("error"); setError("Network"); }
  };

  if (!mounted) return null;
  if (cart.length === 0) return (
    <div className="flex min-h-[60vh] items-center justify-center bg-rosa-dark">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Cart is empty</h1>
        <button onClick={() => router.push("/products")} className="mt-6 rounded-lg bg-rosa-accent px-6 py-3 font-medium text-rosa-dark">Browse</button>
      </div>
    </div>
  );

  return (
    <div className="bg-rosa-dark min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        <div className="mb-8 rounded-xl border border-rosa-border bg-rosa-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-3 border-b border-rosa-border last:border-0">
              <span className="text-white">{item.name_en} x{item.quantity}</span>
              <span className="text-white">${((item.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t-2 border-rosa-border">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-lg font-bold text-rosa-accent">${total.toFixed(2)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-xl border border-rosa-border bg-rosa-card p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Contact Info</h2>
          {status === "error" && <div className="text-red-400">{error}</div>}
          <input required type="text" name="name" placeholder="Name" className="block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white" />
          <input required type="email" name="email" placeholder="Email" className="block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white" />
          <input required type="tel" name="phone" placeholder="Phone (+966...)" className="block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white" />
          <button type="submit" disabled={status === "loading"} className="w-full rounded-lg bg-rosa-accent px-6 py-3.5 font-semibold text-rosa-dark disabled:opacity-50">
            {status === "loading" ? "Placing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}