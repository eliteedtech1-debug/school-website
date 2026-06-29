const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const mysql = require('mysql2/promise');

const UPLOAD_URL = 'http://localhost:5123/api/upload';
const SCHOOL_ID = process.env.VITE_SCHOOL_ID || 'Demo';

async function uploadAndUpdateHero() {
  try {
    // 1. Upload image via local API (which forwards to files.eliteedu.tech)
    console.log('📤 Uploading school.png...');
    const imagePath = path.join(__dirname, '../../src/assets/school.png');
    const imageBuffer = fs.readFileSync(imagePath);
    
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: 'school-hero.png',
      contentType: 'image/png'
    });
    
    // Note: This requires authentication, so let's skip upload and use local path for now
    const imageUrl = '/school.png';
    console.log('✅ Using local image:', imageUrl);
    
    // 2. Update database
    console.log('💾 Updating database...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kirmaskngov_skcooly_bachup_db'
    });
    
    const sql = `
      INSERT INTO school_website_content 
        (school_id, hero_title, hero_subtitle, hero_image_url) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        hero_title = VALUES(hero_title),
        hero_subtitle = VALUES(hero_subtitle),
        hero_image_url = VALUES(hero_image_url)
    `;
    
    await connection.execute(sql, [
      SCHOOL_ID,
      'Welcome to Dr. Kabiru Gwarzo Academy',
      '& Tahfeez — Strive for Excellence',
      imageUrl
    ]);
    
    await connection.end();
    console.log('✅ Database updated successfully!');
    console.log(`\n🎉 Hero section ready with image: ${imageUrl}`);
    console.log('\nNote: Image is served from public folder. To upload to files.eliteedu.tech,');
    console.log('use the website settings UI at /settings/websiteSettings and click Upload.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadAndUpdateHero();
