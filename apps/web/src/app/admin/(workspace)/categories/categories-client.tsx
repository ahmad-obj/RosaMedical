"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "./action";
import type { Category } from "@/lib/supabase/types";

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This will also delete all products inside it.")) return;
    
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) {
        alert(result.error);
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    });
  };

  const handleEditSubmit = (id: string, formData: FormData) => {
    startTransition(async () => {
      const result = await updateCategory(id, formData);
      if (result?.error) {
        alert(result.error);
      } else {
        const slug = formData.get("slug") as string;
        const name_en = formData.get("name_en") as string;
        const name_ar = formData.get("name_ar") as string;
        const is_active = formData.get("is_active") === "on";
        const sort_order = Number(formData.get("sort_order")) || 1;
        
        setCategories(prev => prev.map(c => c.id === id ? { ...c, slug, name_en, name_ar, is_active, sort_order } : c));
        setEditingId(null);
      }
    });
  };

  const handleCreateSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCategory(formData);
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
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button 
          onClick={() => setFormOpen(!formOpen)}
          className="rounded-md bg-rosa-accent px-4 py-2 text-sm font-medium text-rosa-dark"
        >
          {formOpen ? "Cancel" : "Add Category"}
        </button>
      </div>

      {formOpen && (
        <form action={handleCreateSubmit} className="rounded-lg border border-rosa-border bg-rosa-card p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-rosa-muted">Name (English)</label>
              <input required name="name_en" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Name (Arabic)</label>
              <input required name="name_ar" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Slug</label>
              <input required name="slug" className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-rosa-muted">Sort Order</label>
              <input type="number" name="sort_order" defaultValue={1} className="mt-1 block w-full rounded-md border border-rosa-border bg-rosa-dark px-3 py-2 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_active" defaultChecked className="rounded border-rosa-border" />
            <label className="text-sm text-rosa-muted">Active</label>
          </div>
          <button type="submit" disabled={isPending} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {isPending ? "Saving..." : "Create Category"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-rosa-border">
        <table className="min-w-full divide-y divide-rosa-border">
          <thead className="bg-rosa-card">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Name (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Name (AR)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Active</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-rosa-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rosa-border bg-rosa-dark">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === cat.id ? (
                    <input name="name_en" defaultValue={cat.name_en} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${cat.id}`} />
                  ) : cat.name_en}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === cat.id ? (
                    <input name="name_ar" defaultValue={cat.name_ar} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${cat.id}`} />
                  ) : cat.name_ar}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === cat.id ? (
                    <input name="slug" defaultValue={cat.slug} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${cat.id}`} />
                  ) : cat.slug}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {editingId === cat.id ? (
                    <input type="checkbox" name="is_active" defaultChecked={cat.is_active} className="rounded border-rosa-border" form={`edit-${cat.id}`} />
                  ) : cat.is_active ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  {editingId === cat.id ? (
                    <div className="flex justify-end gap-2">
                      <button type="submit" form={`edit-${cat.id}`} disabled={isPending} className="text-green-400 hover:text-green-300">
                        {isPending ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-rosa-muted hover:text-white">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button onClick={() => setEditingId(cat.id)} className="text-rosa-accent hover:text-rosa-accent/80">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-rosa-muted">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden edit forms */}
      {categories.map(cat => (
        editingId === cat.id && (
          <form key={cat.id} id={`edit-${cat.id}`} action={(formData) => handleEditSubmit(cat.id, formData)} className="hidden" />
        )
      ))}
    </div>
  );
}
