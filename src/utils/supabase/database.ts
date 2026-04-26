/**
 * Supabase Data Service
 * Handles all database operations for products, banners, contact info, and social media links
 * Replaces localStorage-based storage with Supabase database
 */

import { createClient } from "./client";

const supabase = createClient();
const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined) || "ge-images";

function formatSupabaseError(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);
  const e = error as { message?: string; details?: string; hint?: string; code?: string };
  return [e.code, e.message, e.details, e.hint].filter(Boolean).join(" | ");
}

export async function uploadImageToStorage(
  source: string,
  folder: "products" | "banners" = "products",
): Promise<string | null> {
  try {
    if (!source) return null;
    if (!source.startsWith("data:")) return source;

    const response = await fetch(source);
    const blob = await response.blob();
    const mime = blob.type || "image/jpeg";
    const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, {
        contentType: mime,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image to storage:", formatSupabaseError(error));
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.error("Unexpected error uploading image to storage:", err);
    return null;
  }
}

// ============================================================================
// PRODUCTS
// ============================================================================

export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  specs: string;
  description: string;
  images: string[];
  featured: boolean;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", formatSupabaseError(error));
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching products:", err);
    return [];
  }
}

export async function saveProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error("Error saving product:", formatSupabaseError(error));
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error saving product:", err);
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({ ...product, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", formatSupabaseError(error));
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating product:", err);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting product:", err);
    return false;
  }
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function fetchCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", formatSupabaseError(error));
      return [];
    }

    return data?.map((c) => c.name) || [];
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    return [];
  }
}

export async function addCategory(name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("categories")
      .insert([{ name }]);

    if (error) {
      console.error("Error adding category:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error adding category:", err);
    return false;
  }
}

export async function deleteCategory(name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", name);

    if (error) {
      console.error("Error deleting category:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting category:", err);
    return false;
  }
}

// ============================================================================
// BRANDS
// ============================================================================

export async function fetchBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("brands")
      .select("name")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching brands:", formatSupabaseError(error));
      return [];
    }

    return data?.map((b) => b.name) || [];
  } catch (err) {
    console.error("Unexpected error fetching brands:", err);
    return [];
  }
}

export async function addBrand(name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("brands")
      .insert([{ name }]);

    if (error) {
      console.error("Error adding brand:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error adding brand:", err);
    return false;
  }
}

export async function deleteBrand(name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("name", name);

    if (error) {
      console.error("Error deleting brand:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting brand:", err);
    return false;
  }
}

// ============================================================================
// BANNER
// ============================================================================

export interface Banner {
  image: string;
  link?: string;
  alt?: string;
}

export async function fetchBanner(): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching banner:", formatSupabaseError(error));
      return null;
    }

    const row = data?.[0];
    if (!row) return null;

    return {
      image: row.image,
      link: row.link,
      alt: row.alt,
    };
  } catch (err) {
    console.error("Unexpected error fetching banner:", err);
    return null;
  }
}

export async function saveBanner(banner: Banner | null): Promise<boolean> {
  try {
    if (!banner) {
      // Deactivate all banners
      const { error } = await supabase
        .from("banners")
        .update({ is_active: false })
        .eq("is_active", true);

      if (error) {
        console.error("Error deactivating banners:", formatSupabaseError(error));
        return false;
      }
      return true;
    }

    // Deactivate all existing banners first
    await supabase
      .from("banners")
      .update({ is_active: false })
      .eq("is_active", true);

    // Insert new banner
    const { error } = await supabase
      .from("banners")
      .insert([
        {
          image: banner.image,
          link: banner.link || null,
          alt: banner.alt || null,
          is_active: true,
        },
      ]);

    if (error) {
      console.error("Error saving banner:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error saving banner:", err);
    return false;
  }
}

// ============================================================================
// CONTACT INFO
// ============================================================================

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export async function fetchContactInfo(): Promise<ContactInfo | null> {
  try {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching contact info:", formatSupabaseError(error));
      return null;
    }

    const row = data?.[0];
    if (!row) return null;

    return {
      phone: row.phone,
      email: row.email,
      address: row.address,
      hours: row.hours,
    };
  } catch (err) {
    console.error("Unexpected error fetching contact info:", err);
    return null;
  }
}

export async function saveContactInfo(info: ContactInfo): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_info")
      .insert([
        {
          phone: info.phone,
          email: info.email,
          address: info.address,
          hours: info.hours,
        },
      ]);

    if (error) {
      console.error("Error saving contact info:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error saving contact info:", err);
    return false;
  }
}

// ============================================================================
// WHATSAPP NUMBER
// ============================================================================

export async function fetchWhatsAppNumber(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("whatsapp_config")
      .select("number")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching WhatsApp number:", formatSupabaseError(error));
      return "917879707696";
    }

    return data?.[0]?.number || "917879707696";
  } catch (err) {
    console.error("Unexpected error fetching WhatsApp number:", err);
    return "917879707696";
  }
}

export async function saveWhatsAppNumber(number: string): Promise<boolean> {
  try {
    const cleaned = number.replace(/\D/g, "");

    // Keep a single deterministic row and upsert into it.
    const { error } = await supabase
      .from("whatsapp_config")
      .upsert(
        [
          {
            id: "00000000-0000-0000-0000-000000000001",
            number: cleaned,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" },
      );

    if (error) {
      console.error("Error saving WhatsApp number:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error saving WhatsApp number:", err);
    return false;
  }
}

// ============================================================================
// INSTAGRAM REELS
// ============================================================================

export async function fetchInstagramReels(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("instagram_reels")
      .select("url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching Instagram reels:", formatSupabaseError(error));
      return [];
    }

    return data?.map((r) => r.url) || [];
  } catch (err) {
    console.error("Unexpected error fetching Instagram reels:", err);
    return [];
  }
}

export async function addInstagramReel(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("instagram_reels")
      .insert([{ url }]);

    if (error) {
      console.error("Error adding Instagram reel:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error adding Instagram reel:", err);
    return false;
  }
}

export async function deleteInstagramReel(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("instagram_reels")
      .delete()
      .eq("url", url);

    if (error) {
      console.error("Error deleting Instagram reel:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting Instagram reel:", err);
    return false;
  }
}

// ============================================================================
// YOUTUBE VIDEOS
// ============================================================================

export async function fetchYoutubeVideos(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("youtube_videos")
      .select("url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching YouTube videos:", formatSupabaseError(error));
      return [];
    }

    return data?.map((v) => v.url) || [];
  } catch (err) {
    console.error("Unexpected error fetching YouTube videos:", err);
    return [];
  }
}

export async function addYoutubeVideo(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("youtube_videos")
      .insert([{ url }]);

    if (error) {
      console.error("Error adding YouTube video:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error adding YouTube video:", err);
    return false;
  }
}

export async function deleteYoutubeVideo(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("youtube_videos")
      .delete()
      .eq("url", url);

    if (error) {
      console.error("Error deleting YouTube video:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting YouTube video:", err);
    return false;
  }
}

// ============================================================================
// CHANNEL LINKS
// ============================================================================

export interface ChannelLinks {
  instagram: string;
  youtube: string;
}

export async function fetchChannelLinks(): Promise<ChannelLinks> {
  try {
    const { data, error } = await supabase
      .from("channel_links")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error fetching channel links:", formatSupabaseError(error));
      return { instagram: "", youtube: "" };
    }

    const row = data?.[0];
    if (!row) return { instagram: "", youtube: "" };

    return {
      instagram: row.instagram || "",
      youtube: row.youtube || "",
    };
  } catch (err) {
    console.error("Unexpected error fetching channel links:", err);
    return { instagram: "", youtube: "" };
  }
}

export async function saveChannelLinks(links: ChannelLinks): Promise<boolean> {
  try {
    // Keep a single deterministic row and upsert into it.
    const { error } = await supabase
      .from("channel_links")
      .upsert(
        [
          {
            id: "00000000-0000-0000-0000-000000000001",
            instagram: links.instagram || null,
            youtube: links.youtube || null,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" },
      );

    if (error) {
      console.error("Error saving channel links:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error saving channel links:", err);
    return false;
  }
}

// ============================================================================
// ADMIN CREDENTIALS (DO NOT CHANGE)
// ============================================================================

export interface AdminCreds {
  username: string;
  password: string;
}

export async function fetchAdminCreds(): Promise<AdminCreds> {
  try {
    const { data, error } = await supabase
      .from("admin_credentials")
      .select("username, password")
      .eq("username", "admin")
      .limit(1);

    if (error) {
      console.error("Error fetching admin credentials:", formatSupabaseError(error));
      return { username: "admin", password: "global2024" };
    }

    const row = data?.[0];
    if (!row) return { username: "admin", password: "global2024" };

    return {
      username: row.username,
      password: row.password,
    };
  } catch (err) {
    console.error("Unexpected error fetching admin credentials:", err);
    return { username: "admin", password: "global2024" };
  }
}

// Note: Admin credentials should be updated only by admin users with proper security measures
// This function is intentionally restricted and should be used sparingly
export async function updateAdminCreds(creds: AdminCreds): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("admin_credentials")
      .update({ username: creds.username, password: creds.password })
      .eq("username", "admin");

    if (error) {
      console.error("Error updating admin credentials:", formatSupabaseError(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error updating admin credentials:", err);
    return false;
  }
}
