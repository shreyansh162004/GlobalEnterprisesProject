# 🚀 Direct Supabase Connection - Getting Started

Your credentials are already in `.env.local`. Now you need to set up your database.

## ✅ Verify Your Credentials

1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Look for project: `zlbfmnfsznbaozsxzhxj`
4. Click on it

You should see your project dashboard.

---

## 🗄️ Create Database Tables

### Quick Setup (Recommended)

1. In your Supabase dashboard, go to left sidebar → **SQL Editor**
2. Click **New Query**
3. Copy **entire content** from the file: `SUPABASE_SCHEMA.sql` in your project
4. Paste it into the SQL editor
5. Click **Run** button (⚡)
6. ✅ Tables are created!

### What Gets Created

```
✅ products (main inventory)
✅ categories (product categories)
✅ brands (brands list)
✅ banners (homepage banners)
✅ contact_info (company contact)
✅ whatsapp_config (WhatsApp number)
✅ instagram_reels (Instagram content)
✅ youtube_videos (YouTube content)
✅ channel_links (social media links)
✅ admin_credentials (admin login - preset: admin/global2024)
```

---

## 🧪 Test Your Setup

Once tables are created:

```bash
npm run dev
```

Then:

1. Open browser → `http://localhost:8080`
2. Go to `/admin`
3. Login: `admin` / `global2024`
4. Try adding a product

**If successful**: ✅ Everything works!
**If error**: Check troubleshooting below

---

## 🔌 How Connection Works

```
Your App (.env.local)
    ↓
    Uses: NEXT_PUBLIC_SUPABASE_URL
    Uses: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ↓
    Connects to Supabase Project
    ↓
    Reads/Writes to Database Tables
```

✅ **No SQL commands needed** - Just run the schema once!

---

## ⚠️ Troubleshooting

### "Table does not exist" Error

**Solution**: Run SUPABASE_SCHEMA.sql (see above)

### "401 Unauthorized"

**Possible causes**:

1. Wrong credentials in `.env.local`
2. Project is paused
3. API key is disabled

**Fix**:

- Go to Supabase dashboard
- Check project is active (not paused)
- Go to Settings → API → Copy correct anon key
- Update `.env.local` with correct key
- Restart dev server

### "Cannot connect to database"

**Solution**:

1. Check `.env.local` has correct URL and key
2. Check internet connection
3. Restart dev server with: `npm run dev`

### Admin login not working

**Fix**:

1. Make sure `admin_credentials` table exists
2. Check table has default row with: username='admin', password='global2024'
3. If not, manually insert via Supabase dashboard

---

## 📋 Checklist

- [ ] Credentials in `.env.local` ✅
- [ ] Can access Supabase dashboard
- [ ] Ran SUPABASE_SCHEMA.sql
- [ ] All 10 tables visible in Supabase
- [ ] Started dev server with `npm run dev`
- [ ] Can login to admin with admin/global2024
- [ ] Can add a product
- [ ] Data persists after refresh

---

## 🎯 Next Steps

### After Tables Created:

1. ✅ Start dev server: `npm run dev`
2. ✅ Test admin features
3. ✅ Add some products manually
4. ✅ Verify data shows on homepage
5. ✅ Ready for production!

### Optional:

- Add more products via admin
- Customize banner, categories, brands
- Update contact info
- Add social media links

---

## 📞 Quick Links

| Link                           | Purpose         |
| ------------------------------ | --------------- |
| https://supabase.com/dashboard | Supabase Admin  |
| https://supabase.com/docs      | Documentation   |
| Supabase Settings → API        | Get credentials |

---

## 💡 Remember

**Your env credentials are set! Just create the tables and you're done.**

```
✅ Connection = Automatic (uses .env.local)
✅ Tables = Automatic (once created via SQL)
✅ App Ready = Immediate (after tables exist)
```

---

**Status**: ✅ Ready to create tables
**Time to complete**: ~5 minutes
**Difficulty**: ⭐ Very Easy
