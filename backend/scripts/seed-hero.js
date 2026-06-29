const axios = require('axios');

const API_URL = 'http://localhost:5123/api';
const SCHOOL_ID = process.env.VITE_SCHOOL_ID || '1';

async function seedHeroContent() {
  try {
    console.log('Seeding hero content...');
    
    const heroData = {
      hero_title: 'Welcome to Dr. Kabiru Gwarzo Academy',
      hero_subtitle: '& Tahfeez — Strive for Excellence',
      hero_image_url: '/school.png',
    };

    const response = await axios.post(
      `${API_URL}/website-content?school_id=${SCHOOL_ID}`,
      heroData
    );

    console.log('✅ Hero content seeded successfully:', response.data);
  } catch (error) {
    console.error('❌ Error seeding hero content:', error.response?.data || error.message);
  }
}

seedHeroContent();
