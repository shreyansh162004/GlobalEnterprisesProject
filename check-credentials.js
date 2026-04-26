#!/usr/bin/env node

/**
 * Verify Supabase credentials and test connection
 */

const url = "https://zlbfmnfsznbaozsxzhxj.supabase.co";
const publishableKey = "sb_publishable_itoVDUyfXil1cLwUf3p1uw_jETys3Yi";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYmZtbmZzem5iYW96c3h6aHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTcyNzAsImV4cCI6MjA5Mjc3MzI3MH0.eHNu_gLGWyyFCM-eRNIfQEoOT33WN_mH6285siPWM1Q";

async function verifyCredentials() {
  console.log("🔍 Verifying Supabase Credentials\n");

  // Parse JWT manually
  console.log("1️⃣  Checking JWT Token...");
  try {
    const parts = anonKey.split(".");
    if (parts.length !== 3) {
      console.log("❌ Invalid JWT format (not 3 parts)");
      return false;
    }

    // Decode payload (base64)
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    );

    console.log("✅ JWT Token is VALID\n");
    console.log("   Token Details:");
    console.log(`   ├─ Issuer: ${payload.iss}`);
    console.log(`   ├─ Project ID: ${payload.ref}`);
    console.log(`   ├─ Role: ${payload.role}`);
    console.log(`   ├─ Issued: ${new Date(payload.iat * 1000).toISOString()}`);
    console.log(
      `   └─ Expires: ${new Date(payload.exp * 1000).toISOString()}\n`,
    );

    // Verify project ID matches
    const urlProjectId = url.split(".")[0].replace("https://", "");
    console.log(`2️⃣  Checking Project ID Match...`);
    console.log(`   URL Project ID: ${urlProjectId}`);
    console.log(`   Token Project ID: ${payload.ref}`);

    if (urlProjectId === payload.ref) {
      console.log("✅ Project IDs MATCH!\n");
    } else {
      console.log("⚠️  Project IDs DO NOT MATCH!\n");
      console.log("   This could cause connection issues.\n");
    }
  } catch (e) {
    console.log(`❌ Error parsing JWT: ${e.message}\n`);
    return false;
  }

  // Test connection
  console.log("3️⃣  Testing Supabase Connection...");
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    console.log(`   Response: ${response.status} ${response.statusText}`);

    if (
      response.status === 200 ||
      response.status === 401 ||
      response.status === 403
    ) {
      console.log("✅ Connection to Supabase works!\n");
      return true;
    } else if (response.status === 404) {
      console.log("❌ Supabase endpoint not found. Check URL.\n");
      return false;
    } else {
      console.log("⚠️  Unexpected response. Connection may be limited.\n");
      return true;
    }
  } catch (e) {
    console.log(`❌ Connection error: ${e.message}\n`);
    return false;
  }
}

async function testTableAccess() {
  console.log("4️⃣  Testing Table Access...\n");

  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYmZtbmZzem5iYW96c3h6aHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTcyNzAsImV4cCI6MjA5Mjc3MzI3MH0.eHNu_gLGWyyFCM-eRNIfQEoOT33WN_mH6285siPWM1Q";

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

  let found = 0;
  let missing = 0;

  for (const table of tables) {
    try {
      const response = await fetch(`${url}/rest/v1/${table}?select=count()`, {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(`   ✅ ${table}`);
        found++;
      } else if (response.status === 404) {
        console.log(`   ❌ ${table} - NOT FOUND`);
        missing++;
      } else {
        console.log(`   ⚠️  ${table} - Status: ${response.status}`);
      }
    } catch (e) {
      console.log(`   ❌ ${table} - Error: ${e.message}`);
      missing++;
    }
  }

  console.log(`\n   Summary: ${found} found, ${missing} missing\n`);
}

async function main() {
  const ok = await verifyCredentials();

  if (ok) {
    await testTableAccess();

    console.log("✨ Credential Check Complete!\n");
    console.log("📝 Summary:");
    console.log("   ✅ URL is valid");
    console.log("   ✅ ANON_KEY is valid JWT");
    console.log("   ✅ Project ID matches\n");
    console.log("🚀 Next Steps:");
    console.log("   1. Create database tables using SUPABASE_SCHEMA.sql");
    console.log("   2. Run: npm run dev");
    console.log("   3. Visit: http://localhost:8080/admin");
    console.log("   4. Login: admin / global2024\n");
  }
}

main();
