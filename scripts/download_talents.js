const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.molebuild.com/rest/v1';
const API_KEY = 'sb_publishable_jICLjneY1D5hn0NcknF1W9_UKazt33X';
const HEADERS = {
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
};

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    return true;
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (err) {
    console.warn(`[WARN] Failed to download ${url}: ${err.message}`);
    return false;
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const talentsImgDir = path.join(rootDir, 'public', 'mlbb', 'talents');
  const dataDir = path.join(rootDir, 'src', 'data', 'mlbb');

  if (!fs.existsSync(talentsImgDir)) {
    fs.mkdirSync(talentsImgDir, { recursive: true });
  }

  console.log('[TALENTS] Fetching emblem_attributes from MoleBuild API...');
  const res = await fetch(`${API_BASE}/emblem_attributes?select=*&order=tier.asc,name.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to fetch emblem_attributes: ${res.statusText}`);

  const rawTalents = await res.json();
  console.log(`[TALENTS] Fetched ${rawTalents.length} emblem talents.`);

  const processedTalents = [];
  for (const t of rawTalents) {
    const slug = slugify(t.name);
    const filename = `${slug}.png`;
    const dest = path.join(talentsImgDir, filename);
    const localImg = `/mlbb/talents/${filename}`;

    if (t.image_url) {
      await downloadFile(t.image_url, dest);
    }

    processedTalents.push({
      id: t.id,
      name: t.name,
      slug,
      tier: t.tier,
      description: t.description,
      image: localImg,
      image_remote: t.image_url,
      mpl_id: t.mpl_id
    });
  }

  const outputPath = path.join(dataDir, 'emblem_talents.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedTalents, null, 2));
  console.log(`[SUCCESS] Saved ${processedTalents.length} talents to ${outputPath}!`);
}

main().catch(console.error);
