import { readFileSync, readdirSync, statSync, createReadStream } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import FormData from 'form-data';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets');
const FILE_REPO_URL = process.env.FILE_REPO_URL || 'https://files.elitecore.com.ng';
const API_KEY = process.env.FILE_REPO_API_KEY;

if (!API_KEY) {
  console.error('❌ Set FILE_REPO_API_KEY env var');
  process.exit(1);
}

const SKIP = ['StoryViewer.jsx'];

async function uploadFile(filePath, filename) {
  const form = new FormData();
  form.append('file', createReadStream(filePath), filename);

  try {
    const res = await axios.post(`${FILE_REPO_URL}/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${API_KEY}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return res.data;
  } catch (err) {
    throw new Error(`${filename}: ${err.response?.status} ${JSON.stringify(err.response?.data)}`);
  }
}

async function main() {
  const files = readdirSync(ASSETS_DIR).filter(f => !SKIP.includes(f));
  console.log(`Uploading ${files.length} files from ${ASSETS_DIR}...\n`);

  const results = [];

  for (const file of files) {
    const filePath = join(ASSETS_DIR, file);
    const stat = statSync(filePath);
    if (!stat.isFile()) continue;

    process.stdout.write(`  ${file} (${(stat.size / 1024).toFixed(1)} KB)... `);

    try {
      const result = await uploadFile(filePath, file);
      console.log(`✅ ${result.url || result.secure_url}`);
      results.push({ file, url: result.url || result.secure_url, filename: result.filename });
    } catch (err) {
      console.log(`❌ ${err.message}`);
      results.push({ file, error: err.message });
    }
  }

  console.log('\n--- Summary ---');
  const ok = results.filter(r => r.url);
  const fail = results.filter(r => r.error);
  console.log(`Uploaded: ${ok.length}/${files.length}`);
  if (fail.length) console.log(`Failed: ${fail.map(f => f.file).join(', ')}`);

  if (ok.length) {
    console.log('\nURL mapping:');
    for (const r of ok) {
      console.log(`  ${r.file} → ${r.url}`);
    }
  }
}

main().catch(console.error);
