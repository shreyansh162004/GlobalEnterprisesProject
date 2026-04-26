import { createClient } from './src/utils/supabase/client';

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...\n');
    
    const supabase = createClient();
    
    // Test 1: Simple health check
    console.log('1️⃣ Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
      .limit(0);
    
    if (healthError?.code === 'PGRST116') {
      console.log('❌ Products table does not exist yet');
      console.log('   You need to create the database tables first.\n');
      console.log('   Options:');
      console.log('   1. Run SUPABASE_SCHEMA.sql in Supabase SQL Editor');
      console.log('   2. Or manually create tables using Supabase dashboard\n');
      return false;
    }
    
    if (healthError && healthError.code !== 'PGRST116') {
      console.log('❌ Connection error:', healthError.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`   Found products table\n`);
    
    // Test 2: Check if data exists
    console.log('2️⃣ Checking for existing data...');
    const { data: products, error: dataError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);
    
    if (dataError) {
      console.log('⚠️ Error reading products:', dataError.message);
    } else if (products && products.length > 0) {
      console.log(`✅ Found ${products.length} product(s)`);
      console.log(`   Sample: ${products[0].name}`);
    } else {
      console.log('📭 No products in database yet');
    }
    
    // Test 3: Check all tables
    console.log('\n3️⃣ Checking database tables...');
    const tables = [
      'products', 'categories', 'brands', 'banners',
      'contact_info', 'whatsapp_config', 'instagram_reels',
      'youtube_videos', 'channel_links', 'admin_credentials'
    ];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
        .limit(0);
      
      if (error?.code === 'PGRST116') {
        console.log(`   ❌ ${table}`);
      } else if (error) {
        console.log(`   ⚠️  ${table} (error: ${error.code})`);
      } else {
        console.log(`   ✅ ${table}`);
      }
    }
    
    console.log('\n✨ Test complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    return false;
  }
}

testConnection();
