# Supabase Migration - Complete Guide

## ✅ Migration Completed

This guide documents the complete migration from localStorage to Supabase database for Global Enterprises website.

## What Has Been Migrated

### 1. **Products** (`ge-products` → `products` table)

- All product data now stored in Supabase
- Includes: name, price, brand, category, specs, description, images, featured status
- ID: UUIDs (auto-generated)

### 2. **Banners** (`ge-banner` → `banners` table)

- Banner image data stored in Supabase
- Includes: image (data URL), link, alt text
- Only one active banner at a time
- ID: UUID (auto-generated)

### 3. **Categories** (`ge-categories` → `categories` table)

- Category list stored in Supabase
- Unique name constraint
- ID: UUID (auto-generated)

### 4. **Brands** (`ge-brands` → `brands` table)

- Brand list stored in Supabase
- Unique name constraint
- ID: UUID (auto-generated)

### 5. **Contact Information** (`ge-contact-info` → `contact_info` table)

- Contact details (phone, email, address, hours)
- Stored in Supabase
- ID: UUID (auto-generated)

### 6. **WhatsApp Number** (`ge-whatsapp` → `whatsapp_config` table)

- WhatsApp contact number stored in Supabase
- Single record table
- ID: UUID (auto-generated)

### 7. **Instagram Reels** (`ge-instagram-reels` → `instagram_reels` table)

- Reel URLs stored in Supabase
- Unique URL constraint
- ID: UUID (auto-generated)

### 8. **YouTube Videos** (`ge-youtube-videos` → `youtube_videos` table)

- Video URLs stored in Supabase
- Unique URL constraint
- ID: UUID (auto-generated)

### 9. **Channel Links** (`ge-channel-links` → `channel_links` table)

- Instagram and YouTube channel URLs
- Single record table
- ID: UUID (auto-generated)

### 10. **Admin Credentials** (NEW - `admin_credentials` table)

- Username: `admin`
- Password: `global2024`
- **UNCHANGED FROM ORIGINAL** - kept as required
- ID: UUID (auto-generated)

## What Remains in Local Storage (By Design)

### ✓ Cart (`ge-cart`)

- Client-side only, doesn't need database persistence
- Remains in localStorage for fast access

### ✓ Admin Auth Session (`ge-admin-auth`)

- Session-only flag for admin login state
- Remains in localStorage
- Cleared on logout

## Database Schema

All tables have been created with the following structure:

```sql
-- Core tables with timestamps
products (id, name, price, brand, category, specs, description, images[], featured, created_at, updated_at)
banners (id, image, link, alt, is_active, created_at, updated_at)
categories (id, name, created_at)
brands (id, name, created_at)
contact_info (id, phone, email, address, hours, created_at, updated_at)
whatsapp_config (id, number, created_at, updated_at)
instagram_reels (id, url, created_at)
youtube_videos (id, url, created_at)
channel_links (id, instagram, youtube, updated_at)
admin_credentials (id, username, password, created_at, updated_at)
```

### Indexes Created

- `idx_products_category` - for category filtering
- `idx_products_brand` - for brand filtering
- `idx_products_featured` - for featured products
- `idx_categories_name` - for category lookup
- `idx_brands_name` - for brand lookup

## Updated Files

### Core Supabase Integration

- **`src/utils/supabase/database.ts`** (NEW)
  - Comprehensive Supabase data service
  - All CRUD operations for each entity
  - Error handling and logging
  - Async/await pattern throughout

### Updated Components & Pages

- **`src/data/products.ts`** - REFACTORED
  - Exports Supabase functions
  - Async wrappers for backward compatibility
  - Utility functions unchanged (phoneToTelHref, phoneLast10)

- **`src/pages/Admin.tsx`** - COMPLETELY REWRITTEN
  - Uses async Supabase functions
  - Added loading states
  - Improved error handling
  - Admin credentials locked and cannot be changed
  - Default login: admin / global2024

- **`src/pages/Index.tsx`** - UPDATED
  - Fetches products, reels, videos, channels from Supabase
  - Proper loading states
  - Error handling for failed requests

- **`src/pages/About.tsx`** - UPDATED
  - Fetches channel links from Supabase
  - Async data loading

## Migration Steps to Perform

### 1. Run Supabase Schema Setup

Copy and run all SQL commands from `SUPABASE_SCHEMA.sql` in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Paste the entire contents of `SUPABASE_SCHEMA.sql`
5. Click "Run" to create all tables and indexes

### 2. Set Environment Variables

Ensure these are set in your `.env.local` or `.env.production`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### 3. Migrate Existing Data (Optional)

If you have existing data in localStorage that you want to migrate:

1. Open browser DevTools
2. Go to Application > Local Storage
3. Extract your existing data (products, banners, etc.)
4. Use Supabase dashboard to manually insert records, or
5. Create a one-time migration script

### 4. Test the Migration

1. Start the development server: `npm run dev`
2. Go to Admin dashboard (`/admin`)
3. Login with: admin / global2024
4. Test each section:
   - Add/Edit/Delete products
   - Update banner, categories, brands
   - Update contact info
   - Add social media links
   - Verify changes persist on page refresh

## Key Changes in API

### Before (localStorage)

```javascript
// Synchronous
const products = getProducts();
const banner = getBanner();
saveProducts(updated);
```

### After (Supabase)

```javascript
// Asynchronous
const products = await getProducts();
const banner = await getBanner();
await saveProduct(newProduct);
```

## Important Notes

### ⚠️ Admin Credentials

- **Username**: `admin`
- **Password**: `global2024`
- These cannot be changed through the UI (locked for security)
- To change credentials, update directly in Supabase `admin_credentials` table

### Performance Considerations

- All database operations are async
- Use `loading` states in components
- Consider caching frequently accessed data
- ProductCard components now load asynchronously

### Error Handling

- All database functions have try-catch blocks
- Errors are logged to console
- Toast notifications inform users of failures
- Fallback defaults provided where appropriate

### Data Persistence

- All data is now persisted in Supabase database
- No data loss on browser cache clear
- Database changes visible across tabs/browsers
- Changes are immediate (no syncing required)

## Rollback (If Needed)

If you need to rollback to localStorage temporarily:

1. Restore backup of old code
2. Delete `src/utils/supabase/database.ts`
3. Restore original `src/data/products.ts` from git history
4. Revert Admin.tsx, Index.tsx, About.tsx to previous versions
5. Rebuild and test

## Testing Checklist

- [ ] Admin login works (admin / global2024)
- [ ] Can add new products
- [ ] Can edit existing products
- [ ] Can delete products
- [ ] Can add/remove categories
- [ ] Can add/remove brands
- [ ] Can update WhatsApp number
- [ ] Can update contact information
- [ ] Can upload/change banner
- [ ] Can add/remove Instagram reels
- [ ] Can add/remove YouTube videos
- [ ] Can update channel links
- [ ] Homepage displays products
- [ ] Homepage displays banner (if set)
- [ ] Homepage displays media links
- [ ] About page shows channel links
- [ ] Data persists after page refresh
- [ ] Data persists across browser tabs

## Support & Troubleshooting

### "Table does not exist" Error

- Run the SQL schema setup again
- Ensure Supabase project is active
- Check that all tables appear in dashboard

### "401 Unauthorized" Error

- Verify environment variables are correct
- Check Supabase API keys in dashboard
- Ensure public access is enabled if using anon key

### "Unique violation" Error

- Category/Brand already exists
- Media URL already in database
- Check Supabase dashboard and remove duplicates

### Changes Not Persisting

- Check browser console for errors
- Verify network requests in DevTools
- Ensure Supabase database is writable
- Check Row Level Security (RLS) policies

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: April 26, 2026
**Migration Status**: ✅ COMPLETE
**Admin Credentials**: admin / global2024 (unchanged)
