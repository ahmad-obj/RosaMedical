import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-rosa-dark px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-white">Order Successful!</h1>
        <p className="mt-4 text-rosa-muted">Thank you for your order. Our team will contact you shortly.</p>
        
        <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
          <Link href="/contact" className="rounded-lg bg-rosa-accent px-8 py-3 font-semibold text-rosa-dark">
            I want that (Contact Us)
          </Link>
          <Link href="/products" className="rounded-lg border border-rosa-border px-8 py-3 font-semibold text-white hover:bg-rosa-card">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
