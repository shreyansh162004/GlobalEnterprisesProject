/**
 * Products Data Module - Supabase Integration
 * All data is now fetched from and saved to Supabase database
 * Admin credentials (username: "admin", password: "global2024") remain unchanged
 */

import * as db from "@/utils/supabase/database";

// ============================================================================
// RE-EXPORT FROM DATABASE MODULE
// ============================================================================

export type { Product, Banner, ContactInfo, AdminCreds, ChannelLinks } from "@/utils/supabase/database";

export const {
  fetchProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  fetchBrands,
  addBrand,
  deleteBrand,
  fetchCategories,
  addCategory,
  deleteCategory,
  fetchBanner,
  saveBanner,
  fetchContactInfo,
  saveContactInfo,
  fetchWhatsAppNumber,
  saveWhatsAppNumber,
  fetchInstagramReels,
  addInstagramReel,
  deleteInstagramReel,
  fetchYoutubeVideos,
  addYoutubeVideo,
  deleteYoutubeVideo,
  uploadImageToStorage,
  fetchChannelLinks,
  saveChannelLinks,
  fetchAdminCreds,
  updateAdminCreds,
} = db;

// ============================================================================
// UTILITY FUNCTIONS (unchanged)
// ============================================================================

// Convert a display phone like "+91 78797 07696" to a tel: href value.
export function phoneToTelHref(phone?: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return `+${digits}`;
}

// Last 10 digits — useful for tel: links that prefix +91.
export function phoneLast10(phone?: string): string {
  return (phone || "").replace(/\D/g, "").slice(-10);
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS (async wrappers)
// ============================================================================

// These functions maintain backward compatibility with existing code
// They are async versions of the old synchronous functions

export async function getProducts(): Promise<db.Product[]> {
  return fetchProducts();
}

export async function getAdminCreds(): Promise<db.AdminCreds> {
  return fetchAdminCreds();
}

export async function getBrands(): Promise<string[]> {
  return fetchBrands();
}

export async function getCategories(): Promise<string[]> {
  return fetchCategories();
}

export async function getBanner(): Promise<db.Banner | null> {
  return fetchBanner();
}

export async function getContactInfo(): Promise<db.ContactInfo> {
  const info = await fetchContactInfo();
  return (
    info || {
      phone: "+91 78797 07696",
      email: "info@globalenterprises.in",
      address: "Rasal Chowk, Jain Tower, Hotel Samdariya, Jabalpur, MP 482001",
      hours: "Mon–Sat: 10AM – 8PM",
    }
  );
}

export async function getWhatsAppNumber(): Promise<string> {
  return fetchWhatsAppNumber();
}

// Wrapper functions for saving data (for backward compatibility)
export const saveBrands = addBrand;
export const saveCategories = addCategory;
export const saveProducts = async (products: db.Product[]) => {
  // Note: This would need a bulk upsert function in Supabase
  // For now, we'll handle it in the Admin component
  return true;
};
