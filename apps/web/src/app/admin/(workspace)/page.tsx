import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    { href: "/admin/categories", title: "Categories", desc: "Add, edit, or remove instrument families" },
    { href: "/admin/products", title: "Products", desc: "Manage your surgical instruments catalog" },
    { href: "/admin/messages", title: "Messages", desc: "View contact form submissions and quotes" },
    { href: "/admin/site-content", title: "Site Content", desc: "Update About Us, contact info, and footer" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="text-rosa-muted">Welcome back! What would you like to do today?</p>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link 
            key={card.href} 
            href={card.href}
            className="block rounded-lg border border-rosa-border bg-rosa-card p-6 transition-all hover:border-rosa-accent hover:bg-rosa-dark"
          >
            <h2 className="font-heading text-xl font-bold text-rosa-accent">{card.title}</h2>
            <p className="mt-2 text-sm text-rosa-muted">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
