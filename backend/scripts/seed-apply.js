const mysql = require('mysql2/promise');

const SCHOOL_ID = process.env.VITE_SCHOOL_ID || 'Demo';

const sections = [
  {
    section_key: 'apply_hero',
    title: 'Apply Now',
    paragraphs: [{
      id: 'p1',
      text: 'Join our academic community. Start your journey to excellence today.',
      order: 0
    }],
    media: [],
    order_index: 0
  },
  {
    section_key: 'apply_requirements',
    title: 'Requirements',
    paragraphs: [
      { id: 'r1', text: JSON.stringify({ title: 'Birth Certificate', description: 'Original and photocopy' }), order: 0 },
      { id: 'r2', text: JSON.stringify({ title: 'Passport Photos', description: '4 recent passport photographs' }), order: 1 },
      { id: 'r3', text: JSON.stringify({ title: 'Previous School Report', description: 'Last term report card (for transfers)' }), order: 2 },
      { id: 'r4', text: JSON.stringify({ title: 'Medical Report', description: 'Health certificate from recognized hospital' }), order: 3 },
    ],
    media: [],
    order_index: 1
  },
  {
    section_key: 'apply_steps',
    title: 'Application Process',
    paragraphs: [
      { id: 's1', text: JSON.stringify({ step: 1, title: 'Fill Application Form', description: 'Complete the online form with accurate information' }), order: 0 },
      { id: 's2', text: JSON.stringify({ step: 2, title: 'Submit Documents', description: 'Upload required documents' }), order: 1 },
      { id: 's3', text: JSON.stringify({ step: 3, title: 'Pay Application Fee', description: 'Make payment via provided channels' }), order: 2 },
      { id: 's4', text: JSON.stringify({ step: 4, title: 'Entrance Assessment', description: 'Attend scheduled entrance examination' }), order: 3 },
      { id: 's5', text: JSON.stringify({ step: 5, title: 'Receive Admission', description: 'Get admission decision via email/SMS' }), order: 4 },
    ],
    media: [],
    order_index: 2
  },
  {
    section_key: 'apply_deadline',
    title: 'Application Deadline',
    paragraphs: [{
      id: 'd1',
      text: 'Applications for 2025/2026 academic session are now open. Early application is encouraged as spaces are limited.',
      order: 0
    }],
    media: [],
    order_index: 3
  }
];

async function seedApply() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kirmaskngov_skcooly_bachup_db'
  });

  console.log('📝 Seeding Apply page sections...\n');

  for (const section of sections) {
    const sql = `
      INSERT INTO school_website_sections 
        (school_id, section_key, title, paragraphs, media, order_index, is_visible) 
      VALUES (?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE 
        title = VALUES(title),
        paragraphs = VALUES(paragraphs),
        media = VALUES(media),
        order_index = VALUES(order_index)
    `;
    
    await connection.execute(sql, [
      SCHOOL_ID,
      section.section_key,
      section.title,
      JSON.stringify(section.paragraphs),
      JSON.stringify(section.media),
      section.order_index
    ]);
    
    console.log(`✅ ${section.title} (${section.section_key})`);
  }

  await connection.end();
  console.log('\n🎉 Apply page sections seeded successfully!');
}

seedApply().catch(console.error);
