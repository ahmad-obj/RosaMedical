"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearCatalogueProjectionCache } from "@/features/catalogue-live/catalogue-live.cache";
import { validateSarInput, type SarAmount } from "@/features/pricing";
import { requireAdminUser } from "@/lib/supabase/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  replacePrimaryProductImage,
  type ProductMediaStorage,
  type ProductMediaWriteRepository
} from "./product-media-write";

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formOptionalSar(formData: FormData, key: "price_sar" | "price_override_sar"): SarAmount | null {
  const result = validateSarInput(formString(formData, key));
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}

function revalidateProductSurfaces(familySlug: string, productSlug: string) {
  clearCatalogueProjectionCache();
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/search");
  revalidatePath(`/products/${familySlug}`);
  revalidatePath(`/products/${familySlug}/${productSlug}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${familySlug}/${productSlug}`);
}

export async function uploadProductMedia(formData: FormData) {
  const productId = formString(formData, "product_id");
  const familySlug = formString(formData, "family_slug");
  const productSlug = formString(formData, "product_slug");
  const fileValue = formData.get("file");

  if (!(fileValue instanceof File)) {
    throw new Error("Choose a valid product image.");
  }

  await requireAdminUser();
  const admin = createAdminClient();

  const repository: ProductMediaWriteRepository = {
    async findProductIdentity(id) {
      const { data: product, error: productError } = await admin
        .from("products")
        .select("id,slug,is_active,category_id")
        .eq("id", id)
        .maybeSingle();

      if (productError) {
        throw new Error(`Product identity lookup failed: ${productError.message}`);
      }
      if (!product || !product.category_id) return null;

      const { data: category, error: categoryError } = await admin
        .from("categories")
        .select("slug")
        .eq("id", product.category_id)
        .maybeSingle();

      if (categoryError) {
        throw new Error(`Product family lookup failed: ${categoryError.message}`);
      }
      if (!category) return null;

      return {
        id: product.id,
        dbSlug: product.slug,
        familySlug: category.slug,
        isActive: product.is_active
      };
    },

    async findPrimaryImages(id) {
      const { data, error } = await admin
        .from("product_images")
        .select("id,image_path")
        .eq("product_id", id)
        .eq("sort_order", 0);

      if (error) {
        throw new Error(`Primary image lookup failed: ${error.message}`);
      }

      return (data ?? []).map((row) => ({
        id: row.id,
        imagePath: row.image_path
      }));
    },

    async insertPrimaryImage({ productId: id, imagePath }) {
      const { data, error } = await admin
        .from("product_images")
        .insert({ product_id: id, image_path: imagePath, sort_order: 0 })
        .select("id")
        .single();

      if (error) {
        throw new Error(`Primary image creation failed: ${error.message}`);
      }

      return { insertedId: data.id };
    },

    async updateImagePathEverywhere({ oldImagePath, newImagePath }) {
      const { data, error } = await admin
        .from("product_images")
        .update({ image_path: newImagePath })
        .eq("image_path", oldImagePath)
        .select("id");

      if (error) {
        throw new Error(`Linked image update failed: ${error.message}`);
      }

      return { updatedCount: data?.length ?? 0 };
    }
  };

  const storage: ProductMediaStorage = {
    async upload({ path, file, contentType }) {
      const bucket = admin.storage.from("product-media");
      const { error } = await bucket.upload(path, file, {
        upsert: false,
        contentType,
        cacheControl: "31536000"
      });
      if (error) {
        throw new Error(`Product image upload failed: ${error.message}`);
      }

      const { data } = bucket.getPublicUrl(path);
      if (!data.publicUrl) {
        throw new Error("Product image upload did not produce a public URL.");
      }
      return { publicUrl: data.publicUrl };
    },

    async remove(path) {
      const { error } = await admin.storage.from("product-media").remove([path]);
      if (error) {
        throw new Error(`Product image cleanup failed: ${error.message}`);
      }
    }
  };

  await replacePrimaryProductImage(
    { productId, familySlug, productSlug, file: fileValue },
    { repository, storage }
  );

  revalidateProductSurfaces(familySlug, productSlug);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  const familySlug = formString(formData, "family_slug");
  const nameEn = formString(formData, "name_en");
  const itemCode = formString(formData, "item_code");
  const descriptionEn = formString(formData, "description_en");
  const descriptionAr = formString(formData, "description_ar");
  const nameAr = formString(formData, "name_ar");
  const requestedSlug = formString(formData, "slug");
  const priceSar = formOptionalSar(formData, "price_sar");

  if (!familySlug || !nameEn || !itemCode) {
    throw new Error("Family, name, and item code are required.");
  }

  await requireAdminUser();
  const admin = createAdminClient();

  const { data: category, error: categoryError } = await admin
    .from("categories")
    .select("id")
    .eq("slug", familySlug)
    .maybeSingle();

  if (categoryError) {
    throw new Error(`Family lookup failed: ${categoryError.message}`);
  }
  if (!category) {
    throw new Error(`Unknown family: ${familySlug}`);
  }

  const bareSlug = slugify(requestedSlug || itemCode || nameEn);
  const slug = bareSlug ? `${familySlug}-${bareSlug}` : "";
  if (!slug) {
    throw new Error("Could not generate a valid slug from the item code or name.");
  }

  const { data: product, error: insertError } = await admin
    .from("products")
    .insert({
      category_id: category.id,
      item_code: itemCode,
      name_en: nameEn,
      name_ar: nameAr || nameEn,
      description_en: descriptionEn || null,
      description_ar: descriptionAr || descriptionEn || null,
      price: priceSar,
      is_active: false,
      slug,
      stock_status: "available",
      sell_mode: "quote"
    })
    .select("id,slug")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error(`Slug "${slug}" is already used — try a different item code or name.`);
    }
    throw new Error(`Product creation failed: ${insertError.message}`);
  }

  clearCatalogueProjectionCache();
  revalidatePath("/admin/products");

  const createdFamilyPrefix = `${familySlug}-`;
  const createdBareSlug = product.slug.startsWith(createdFamilyPrefix)
    ? product.slug.slice(createdFamilyPrefix.length)
    : product.slug;
  redirect(`/admin/products/${familySlug}/${createdBareSlug}`);
}

export async function deleteProduct(formData: FormData) {
  const productId = formString(formData, "product_id");
  const familySlug = formString(formData, "family_slug");
  const productSlug = formString(formData, "product_slug");
  if (!productId) {
    throw new Error("Missing product id.");
  }
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: images } = await admin
    .from("product_images")
    .select("image_path")
    .eq("product_id", productId);

  if (images && images.length > 0) {
    const paths = images.map((row) => row.image_path).filter(Boolean);
    if (paths.length > 0) {
      await admin.storage.from("product-media").remove(paths);
    }
  }

  const { error: imagesError } = await admin
    .from("product_images")
    .delete()
    .eq("product_id", productId);
  if (imagesError) {
    throw new Error(`Deleting product images failed: ${imagesError.message}`);
  }

  const { error: variantsError } = await admin
    .from("product_variants")
    .delete()
    .eq("product_id", productId);
  if (variantsError) {
    throw new Error(`Deleting product variants failed: ${variantsError.message}`);
  }

  const { error: productError } = await admin
    .from("products")
    .delete()
    .eq("id", productId);
  if (productError) {
    throw new Error(`Deleting product failed: ${productError.message}`);
  }

  revalidateProductSurfaces(familySlug, productSlug);
  redirect("/admin/products");
}

export async function activateProduct(formData: FormData) {
  const productId = formString(formData, "product_id");
  const familySlug = formString(formData, "family_slug");
  const productSlug = formString(formData, "product_slug");

  if (!productId) {
    throw new Error("Missing product id.");
  }

  await requireAdminUser();
  const admin = createAdminClient();

  const { error } = await admin
    .from("products")
    .update({ is_active: true })
    .eq("id", productId);

  if (error) {
    throw new Error(`Product activation failed: ${error.message}`);
  }

  revalidateProductSurfaces(familySlug, productSlug);
}

export async function saveProduct(formData: FormData) {
  const productId = formString(formData, "product_id");
  const familySlug = formString(formData, "family_slug");
  const nameEn = formString(formData, "name_en");
  const nameAr = formString(formData, "name_ar") || nameEn;
  const itemCode = formString(formData, "item_code");
  const descriptionEn = formString(formData, "description_en");
  const descriptionAr = formString(formData, "description_ar") || descriptionEn;
  const requestedSlug = formString(formData, "slug");
  const priceSar = formOptionalSar(formData, "price_sar");

  if (!productId || !familySlug || !nameEn || !itemCode) {
    throw new Error("Family, English name, and item code are required.");
  }

  const bareSlug = slugify(requestedSlug || itemCode || nameEn);
  if (!bareSlug) throw new Error("Enter a valid product URL slug.");

  await requireAdminUser();
  const admin = createAdminClient();
  const { data: category, error: categoryError } = await admin
    .from("categories")
    .select("id")
    .eq("slug", familySlug)
    .maybeSingle();

  if (categoryError) throw new Error(`Family lookup failed: ${categoryError.message}`);
  if (!category) throw new Error(`Unknown family: ${familySlug}`);

  const dbSlug = `${familySlug}-${bareSlug}`;
  const { error } = await admin
    .from("products")
    .update({
      category_id: category.id,
      item_code: itemCode,
      name_en: nameEn,
      name_ar: nameAr,
      description_en: descriptionEn || null,
      description_ar: descriptionAr || null,
      price: priceSar,
      slug: dbSlug
    })
    .eq("id", productId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(`URL slug "${bareSlug}" is already in use.`);
    }
    throw new Error(`Product update failed: ${error.message}`);
  }

  revalidateProductSurfaces(familySlug, bareSlug);
  redirect(`/admin/products/${familySlug}/${bareSlug}`);
}

export async function saveVariantPriceOverride(formData: FormData): Promise<void> {
  const productId = formString(formData, "product_id");
  const variantId = formString(formData, "variant_id");
  const familySlug = formString(formData, "family_slug");
  const productSlug = formString(formData, "product_slug");
  const priceOverrideSar = formOptionalSar(formData, "price_override_sar");

  if (!productId || !variantId || !familySlug || !productSlug) {
    throw new Error("Missing product or variant identity.");
  }

  await requireAdminUser();
  const admin = createAdminClient();
  const { data: variant, error: lookupError } = await admin
    .from("product_variants")
    .select("id,product_id")
    .eq("id", variantId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Variant lookup failed: ${lookupError.message}`);
  }
  if (!variant || variant.product_id !== productId) {
    throw new Error("Variant does not belong to this product.");
  }

  const { error: updateError } = await admin
    .from("product_variants")
    .update({ price_override: priceOverrideSar })
    .eq("id", variantId)
    .eq("product_id", productId);

  if (updateError) {
    throw new Error(`Variant price update failed: ${updateError.message}`);
  }

  revalidateProductSurfaces(familySlug, productSlug);
}
