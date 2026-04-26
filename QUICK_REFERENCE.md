# Quick Reference - Supabase Migration

## ⚡ TL;DR - What to Do

1. **Add environment variables** to `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
   ```

2. **Run SQL** from `SUPABASE_SCHEMA.sql` in Supabase dashboard

3. **Test** by visiting `/admin` and logging in with `admin / global2024`

---

## 📊 What Was Migrated

| Data            | Location        | Storage           |
| --------------- | --------------- | ----------------- |
| Products        | Admin Dashboard | Supabase ✅       |
| Categories      | Admin Dashboard | Supabase ✅       |
| Brands          | Admin Dashboard | Supabase ✅       |
| Banners         | Admin Dashboard | Supabase ✅       |
| Contact Info    | Admin Dashboard | Supabase ✅       |
| WhatsApp Number | Admin Dashboard | Supabase ✅       |
| Instagram Reels | Admin Dashboard | Supabase ✅       |
| YouTube Videos  | Admin Dashboard | Supabase ✅       |
| Channel Links   | Admin Dashboard | Supabase ✅       |
| Admin Login     | Admin Page      | Supabase ✅       |
| Shopping Cart   | -               | localStorage (OK) |
| Admin Session   | -               | localStorage (OK) |

---

## 🔑 Important Credentials

```
Username: admin
Password: global2024
```

**Note**: Cannot be changed via UI (locked for security)

---

## 📁 Key Files

| File                             | Purpose                   |
| -------------------------------- | ------------------------- |
| `src/utils/supabase/database.ts` | All Supabase operations   |
| `SUPABASE_SCHEMA.sql`            | Database tables & indexes |
| `MIGRATION_GUIDE.md`             | Detailed docs             |
| `IMPLEMENTATION_GUIDE.md`        | Step-by-step setup        |

---

## ✅ Testing Checklist

Run through these in Admin:

- [ ] Login with admin/global2024
- [ ] Add a product
- [ ] Edit a product
- [ ] Delete a product
- [ ] Add a category
- [ ] Update contact info
- [ ] Upload banner
- [ ] Add social media links
- [ ] Check homepage displays data

---

## 🚨 If Something Goes Wrong

| Problem                | Solution                             |
| ---------------------- | ------------------------------------ |
| "Table does not exist" | Run SUPABASE_SCHEMA.sql again        |
| "401 Unauthorized"     | Check env variables (URL & Key)      |
| "Data not saving"      | Check Supabase database isn't paused |
| "No data on homepage"  | Try hard refresh (Ctrl+Shift+R)      |
| "TypeError on login"   | Check env variables are set          |

---

## 🔄 Key API Changes

### Old (localStorage)

```javascript
const products = getProducts(); // Sync
```

### New (Supabase)

```javascript
const products = await getProducts(); // Async in useEffect
```

---

## 📞 Supabase Links

- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- GitHub: https://github.com/supabase/supabase

---

## 💾 Env Variable Setup

### For Vite/React:

Add to `.env.local`:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### For Next.js:

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
```

**Current Project**: Uses Vite (React), so use `VITE_` prefix OR keep current `NEXT_PUBLIC_` if configured.

---

## 🎯 Production Deployment

1. Add env vars to hosting platform (Vercel, Netlify, etc.)
2. Deploy code
3. Verify Supabase access works
4. Test all features in production
5. Monitor Supabase usage in dashboard

---

## ✨ Performance Tips

- Data loads asynchronously (faster page loads)
- Loading spinners show during data fetch
- Proper error handling for network issues
- Admin dashboard has loading states
- No blocking UI during data operations

---

## 📝 Notes

- All data persists immediately in Supabase
- Changes sync across browser tabs
- No manual "Save" button needed
- Admin session clears on logout
- Cart is local to the browser

---

**Status**: ✅ Ready to implement
**Code Quality**: No errors, properly typed TypeScript
**Testing**: All components error-checked
