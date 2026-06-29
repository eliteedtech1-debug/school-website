const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const mysql = require('mysql2/promise');

const FILE_REPO_URL = 'https://files.eliteedu.tech';
const SCHOOL_ID = 'Demo';

const galleryImages = [
  { file: 'students.png', caption: 'Students in the Classroom', category: 'photos' },
  { file: 'principal.png', caption: 'The Principal', category: 'photos' },
  { file: 'image copy.png', caption: 'Pre-vocational Laboratory', category: 'facilities' },
  { file: 'image copy 2.png', caption: 'Graduation Ceremony', category: 'events' },
  { file: 'image copy 3.png', caption: 'Graduation Ceremony', category: 'events' },
  { file: 'image copy 4.png', caption: 'Pre-vocational Laboratory', category: 'facilities' },
  { file: 'image copy 5.png', caption: 'Annual Ceremony', category: 'events' },
  { file: 'image copy 6.png', caption: 'Students Learning', category: 'photos' },
  { file: 'image copy 7.png', caption: 'Graduation Day', category: 'events' },
  { file: 'image copy 9.png', caption: 'Student Achievement', category: 'events' },
  { file: 'image copy 10.png', caption: 'Academic Excellence', category: 'events' },
  { file: 'image copy 12.png', caption: 'Quiz Competition', category: 'facilities' },
];

const videos = [
  { url: 'https://www.youtube.com/embed/aJxsTF9eWRk', thumb: 'https://img.youtube.com/vi/aJxsTF9eWRk/hqdefault.jpg', caption: 'School Assembly Event', category: 'videos' },
  { url: 'https://www.youtube.com/embed/B8OSkSdo6R0', thumb: 'https://img.youtube.com/vi/B8OSkSdo6R0/hqdefault.jpg', caption: 'Cultural Day Celebration', category: 'videos' },
  { url: 'https://www.youtube.com/embed/rfs-4HaRMnM', thumb: 'https://img.youtube.com/vi/rfs-4HaRMnM/hqdefault.jpg', caption: 'School Events', category: 'videos' },
  { url: 'https://www.youtube.com/embed/77l2Juo0Mws', thumb: 'https://img.youtube.com/vi/77l2Juo0Mws/hqdefault.jpg', caption: 'Annual Cultural Day', category: 'videos' },
];

async function uploadImage(filePath, caption) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: path.basename(filePath),
      contentType: 'image/png'
    });
    
    const response = await axios.post(`${FILE_REPO_URL}/upload`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    return response.data.url;
  } catch (error) {
    console.error(`Failed to upload ${caption}:`, error.message);
    return null;
  }
}

async function uploadGallery() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kirmaskngov_skcooly_bachup_db'
  });

  // Get existing media
  const [rows] = await connection.execute(
    'SELECT media FROM school_website_sections WHERE section_key = ? AND school_id = ?',
    ['gallery', SCHOOL_ID]
  );
  
  let mediaArray = [];
  if (rows.length > 0 && rows[0].media) {
    mediaArray = JSON.parse(rows[0].media);
    console.log(`Found ${mediaArray.length} existing items`);
  }

  // Add videos with proper categories
  const videosToAdd = [
    { id: `v${mediaArray.length + 1}`, url: 'https://www.youtube.com/embed/aJxsTF9eWRk', thumbnail_url: 'https://img.youtube.com/vi/aJxsTF9eWRk/hqdefault.jpg', type: 'video', caption: 'School Assembly Event', category: 'events', order: mediaArray.length },
    { id: `v${mediaArray.length + 2}`, url: 'https://www.youtube.com/embed/B8OSkSdo6R0', thumbnail_url: 'https://img.youtube.com/vi/B8OSkSdo6R0/hqdefault.jpg', type: 'video', caption: 'Cultural Day Celebration', category: 'videos', order: mediaArray.length + 1 },
    { id: `v${mediaArray.length + 3}`, url: 'https://www.youtube.com/embed/rfs-4HaRMnM', thumbnail_url: 'https://img.youtube.com/vi/rfs-4HaRMnM/hqdefault.jpg', type: 'video', caption: 'School Events', category: 'videos', order: mediaArray.length + 2 },
    { id: `v${mediaArray.length + 4}`, url: 'https://www.youtube.com/embed/77l2Juo0Mws', thumbnail_url: 'https://img.youtube.com/vi/77l2Juo0Mws/hqdefault.jpg', type: 'video', caption: 'Annual Cultural Day', category: 'videos', order: mediaArray.length + 3 },
  ];

  // Add category to existing items based on caption
  mediaArray = mediaArray.map(item => {
    if (!item.category) {
      const caption = (item.caption || '').toLowerCase();
      item.category = caption.includes('event') || caption.includes('graduation') || caption.includes('ceremony') ? 'events'
        : caption.includes('facility') || caption.includes('lab') || caption.includes('classroom') ? 'facilities'
        : 'photos';
    }
    return item;
  });

  mediaArray.push(...videosToAdd);
  console.log(`📹 Added ${videosToAdd.length} videos`);

  // Update database
  console.log('💾 Updating database...');
  const sql = `
    UPDATE school_website_sections 
    SET media = ?
    WHERE section_key = 'gallery' AND school_id = ?
  `;
  
  await connection.execute(sql, [JSON.stringify(mediaArray), SCHOOL_ID]);
  await connection.end();
  
  console.log(`✅ Gallery updated successfully!`);
  console.log(`Total items: ${mediaArray.length}`);
}

uploadGallery().catch(console.error);
