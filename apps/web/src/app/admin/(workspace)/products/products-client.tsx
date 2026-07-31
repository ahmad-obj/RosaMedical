"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct, deleteProduct } from "./action";
import type { Product, Category } from "@/lib/supabase/types";

export function ProductsClient({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result?.error) {
        alert(result.error);
      } else {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    });
  };

  const handleEditSubmit = (id: string, formData: FormData) => {
    startTransition(async () => {
      const result = await updateProduct(id, formData);
      if (result?.error) {
        alert(result.error);
      } else {
        const name_en = formData.get("name_en") as string;
        const item_code = formData.get("item_code") as string;
        const sell_mode = formData.get("sell_mode") as string;
        const is_active = formData.get("is_active") === "on";
        
        setProducts(prev => prev.map(p => p.id === id ? { ...p, name_en, item_code, sell_mode, is_active } : p));
        setEditingId(null);
      }
    });
  };

  const handleCreateSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createProduct(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        setFormOpen(false);
        window.location.reload(); // Simple refresh to show new item
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button 
          onClick={() => setFormOpen(!formOpen)}
          className="rounded-md bg-rosa-accent px-4 py-2 text-sm font-medium text-rosa-dark"
        >
          {formOpen ? "Cancel" : "Add Product"}
        </button>
      </div>

      {formOpen && (
        <form action={handleCreateSubmit} className="rounded-lg border border-rosa-border bg-rosa-card p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-rosa-muted">Item Code</label>
              <input required name="item_code" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Category</label>
              <select required name="category_id" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Name (English)</label>
              <input required name="name_en" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Name (Arabic)</label>
              <input required name="name_ar" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Sell Mode</label>
              <select name="sell_mode" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white">
                <option value="quote">Quote Only</option>
                <option value="direct">Direct Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Stock Status</label>
              <select name="stock_status" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white">
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-rosa-muted">Description (English)</label>
            <textarea name="description_en" rows={3} className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white"></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_active" defaultChecked className="rounded border-rosa-border" />
            <label className="text-sm text-rosa-muted">Active</label>
          </div>
          <button type="submit" disabled={isPending} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {isPending ? "Saving..." : "Create Product"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-rosa-border">
        <table className="min-w-full divide-y divide-rosa-border">
          <thead className="bg-rosa-card">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Item Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Name (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Sell Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Active</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-rosa-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rosa-border bg-rosa-dark">
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === prod.id ? (
                    <input name="item_code" defaultValue={prod.item_code} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${prod.id}`} />
                  ) : prod.item_code}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === prod.id ? (
                    <input name="name_en" defaultValue={prod.name_en} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${prod.id}`} />
                  ) : prod.name_en}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === prod.id ? (
                    <select name="sell_mode" defaultValue={prod.sell_mode} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${prod.id}`}>
                      <option value="quote">Quote Only</option>
                      <option value="direct">Direct Sale</option>
                    </select>
                  ) : prod.sell_mode}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === prod.id ? (
                    <input type="checkbox" name="is_active" defaultChecked={prod.is_active} className="rounded border-rosa-border" form={`edit-${prod.id}`} />
                  ) : prod.is_active ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  {editingId === prod.id ? (
                    <div className="flex justify-end gap-2">
                      <button type="submit" form={`edit-${prod.id}`} disabled={isPending} className="text-green-400 hover:text-green-300">
                        {isPending ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-rosa-muted hover:text-white">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button onClick={() => setEditingId(prod.id)} className="text-rosa-accent hover:text-rosa-accent/80">Edit</button>
                      <button onClick={() => handleDelete(prod.id)} disabled={isPending} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-rosa-muted">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden edit forms */}
      {products.map(prod => (
        editingId === prod.id && (
          <form key={prod.id} id={`edit-${prod.id}`} action={(formData) => handleEditSubmit(prod.id, formData)} className="hidden" />
        )
      ))}
    </div>
  );
}
