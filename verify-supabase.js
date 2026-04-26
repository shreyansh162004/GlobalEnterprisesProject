#!/usr/bin/env node

/**
 * Quick test to verify Supabase connection works
 * Run: node verify-supabase.js
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://zlbfmnfsznbaozsxzhxj.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

async function testConnection() {
  console.log("🔌 Testing Supabase Connection...\n");

  if (!supabaseKey) {
    console.log("❌ Missing Supabase key.");
    console.log(
      "Set NEXT_PUBLIC_SUPABASE_ANON_KEY (preferred) or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local\n",
    );
    return;
  }

  try {
    // Test 1: Basic connectivity
    console.log("1️⃣  Testing basic HTTP connection...");
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok || response.status === 401 || response.status === 403) {
      console.log("✅ Connected to Supabase!\n");
    } else {
      console.log(
        `❌ Connection failed: ${response.status} ${response.statusText}\n`,
      );
      return;
    }

    // Test 2: Check products table
    console.log("2️⃣  Checking if tables exist...\n");

    const tables = [
      "products",
      "categories",
      "brands",
      "banners",
      "contact_info",
      "whatsapp_config",
      "instagram_reels",
      "youtube_videos",
      "channel_links",
      "admin_credentials",
    ];

    let existingTables = 0;
    let missingTables = 0;

    for (const table of tables) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/${table}?select=count&limit=1`,
        {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: "application/json",
          },
        },
      );

      if (res.ok || res.status === 200) {
        console.log(`   ✅ ${table}`);
        existingTables++;
      } else if (res.status === 404) {
        console.log(`   ❌ ${table} - NOT FOUND`);
        missingTables++;
      } else if (res.status === 401 || res.status === 403) {
        console.log(`   ⚠️  ${table} - Access denied (RLS/permissions)`);
      } else {
        console.log(`   ⚠️  ${table} - Error: ${res.status}`);
        missingTables++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Found: ${existingTables} tables`);
    console.log(`   ❌ Missing: ${missingTables} tables\n`);

    if (missingTables > 0) {
      console.log(
        "💡 Solution: Create missing tables using SUPABASE_SCHEMA.sql\n",
      );
      console.log("   Steps:");
      console.log("   1. Go to https://supabase.com/dashboard");
      console.log("   2. Select your project");
      console.log('   3. Click "SQL Editor"');
      console.log('   4. Click "New Query"');
      console.log("   5. Copy-paste contents of SUPABASE_SCHEMA.sql");
      console.log('   6. Click "Run"\n');
    } else {
      console.log("🎉 All tables found! Your app is ready to use.\n");
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
  }
}

testConnection();
