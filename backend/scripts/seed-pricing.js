const mysql = require('mysql2/promise');

const SCHOOL_ID = process.env.VITE_SCHOOL_ID || 'Demo';

const sections = [
  {
    section_key: 'pricing_hero',
    title: 'School Fees',
    paragraphs: [{ id: 'p1', text: 'Affordable quality education with flexible payment plans', order: 0 }],
    media: [],
    order_index: 0
  },
  {
    section_key: 'pricing_tiers',
    title: 'Fee Structure',
    paragraphs: [
      { id: 't1', text: JSON.stringify({ level: 'Pre-Nursery', amount: '50,000', features: ['Tuition', 'Books', 'Uniform'] }), order: 0 },
      { id: 't2', text: JSON.stringify({ level: 'Primary (1-6)', amount: '60,000', features: ['Tuition', 'Books', 'Uniform', 'E-Learning'] }), order: 1 },
      { id: 't3', text: JSON.stringify({ level: 'Junior Secondary (JSS 1-3)', amount: '70,000', features: ['Tuition', 'Books', 'Uniform', 'E-Learning', 'Practical'] }), order: 2 },
      { id: 't4', text: JSON.stringify({ level: 'Senior Secondary (SS 1-3)', amount: '80,000', features: ['Tuition', 'Books', 'Uniform', 'E-Learning', 'Practical', 'WAEC'] }), order: 3 },
      { id: 't5', text: JSON.stringify({ level: 'Islamiyya (All Levels)', amount: '30,000', features: ['Tuition', 'Islamic Books', 'Quran'] }), order: 4 },
      { id: 't6', text: JSON.stringify({ level: 'Tahfeez Program', amount: '40,000', features: ['Tuition', 'Quran Memorization', 'Tajweed'] }), order: 5 },
    ],
    media: [],
    order_index: 1
  },
  {
    section_key: 'pricing_payment_plans',
    title: 'Payment Options',
    paragraphs: [
      { id: 'pp1', text: JSON.stringify({ plan: 'One-Time Payment', discount: '5% discount', description: 'Pay full tuition at once' }), order: 0 },
      { id: 'pp2', text: JSON.stringify({ plan: '2 Installments', discount: 'No discount', description: 'Pay in two equal parts' }), order: 1 },
      { id: 'pp3', text: JSON.stringify({ plan: '3 Installments', discount: 'No discount', description: 'Pay termly' }), order: 2 },
    ],
    media: [],
    order_index: 2
  }
];

async function seedPricing() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kirmaskngov_skcooly_bachup_db'
  });

  console.log('💰 Seeding Price page sections...\n');

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
  console.log('\n🎉 Price page sections seeded successfully!');
}

seedPricing().catch(console.error);
