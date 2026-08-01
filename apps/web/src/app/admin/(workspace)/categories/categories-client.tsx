"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory, restoreCategory, permanentlyDeleteCategory } from "./action";
import type { Category } from "@/lib/supabase/types";

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const activeCategories = categories.filter(c => !c.deleted_at);
  const trashedCategories = categories.filter(c => c.deleted_at);

  const handleDelete = (id: string) => {
    if (!window.confirm("Move this category to trash? It will be permanently deleted after 10 days.")) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) alert(result.error);
      else window.location.reload();
    });
  };

  const handleRestore = (id: string) => {
    startTransition(async () => {
      const result = await restoreCategory(id);
      if (result?.error) alert(result.error);
      else window.location.reload();
    });
  };

  const handlePermDelete = (id: string) => {
    if (!window.confirm("PERMANENTLY delete this category and ALL its products? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await permanentlyDeleteCategory(id);
      if (result?.error) alert(result.error);
      else window.location.reload();
    });
  };

  const handleEditSubmit = (id: string, formData: FormData) => {
    startTransition(async () => {
      const result = await updateCategory(id, formData);
      if (result?.error) alert(result.error);
      else window.location.reload();
    });
  };

  const handleCreateSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.error) alert(result.error);
      else window.location.reload();
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button onClick={() => setFormOpen(!formOpen)} className="rounded-md bg-rosa-accent px-4 py-2 text-sm font-medium text-rosa-dark">
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

      {/* Active Categories */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Active ({activeCategories.length})</h2>
        <div className="overflow-hidden rounded-lg border border-rosa-border">
          <table className="min-w-full divide-y divide-rosa-border">
            <thead className="bg-rosa-card">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Name (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-rosa-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rosa-border bg-rosa-dark">
              {activeCategories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 text-sm text-white">
                    {editingId === cat.id ? (
                      <input name="name_en" defaultValue={cat.name_en} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${cat.id}`} />
                    ) : cat.name_en}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {editingId === cat.id ? (
                      <input name="slug" defaultValue={cat.slug} className="block w-full rounded-md border border-rosa-border bg-rosa-card px-2 py-1 text-white" form={`edit-${cat.id}`} />
                    ) : cat.slug}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {editingId === cat.id ? (
                      <button type="submit" form={`edit-${cat.id}`} disabled={isPending} className="text-green-400 hover:text-green-300 mr-4">Save</button>
                    ) : (
                      <button onClick={() => setEditingId(cat.id)} className="text-rosa-accent hover:text-rosa-accent/80 mr-4">Edit</button>
                    )}
                    <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="text-red-400 hover:text-red-300">Trash</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trashed Categories */}
      {trashedCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-red-400 mb-4">Trash ({trashedCategories.length}) - Auto-deleted after 10 days</h2>
          <div className="overflow-hidden rounded-lg border border-red-500/20">
            <table className="min-w-full divide-y divide-rosa-border">
              <thead className="bg-rosa-card">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Name (EN)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-rosa-muted">Deleted On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-rosa-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rosa-border bg-rosa-dark/50">
                {trashedCategories.map((cat) => (
                  <tr key={cat.id} className="opacity-60">
                    <td className="px-6 py-4 text-sm text-white">{cat.name_en}</td>
                    <td className="px-6 py-4 text-sm text-rosa-muted">{new Date(cat.deleted_at!).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => handleRestore(cat.id)} disabled={isPending} className="text-green-400 hover:text-green-300 mr-4">Restore</button>
                      <button onClick={() => handlePermDelete(cat.id)} disabled={isPending} className="text-red-400 hover:text-red-300">Delete Forever</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hidden edit forms */}
      {categories.map(cat => (
        editingId === cat.id && (
          <form key={cat.id} id={`edit-${cat.id}`} action={(formData) => handleEditSubmit(cat.id, formData)} className="hidden" />
        )
      ))}
    </div>
  );
}
