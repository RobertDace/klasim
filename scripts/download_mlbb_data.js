const fs = require('fs');
const path = require('path');
const https = require('https');

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

async function fetchTable(tableName) {
  console.log(`[API] Fetching table: ${tableName}...`);
  const res = await fetch(`${API_BASE}/${tableName}?select=*`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch table ${tableName}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log(`[API] Fetched ${data.length} records for ${tableName}.`);
  return data;
}

// Download file with retries
async function downloadFile(url, destPath, retries = 3) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    return true; // already downloaded
  }

  // Handle wsrv url decode if helpful, or fetch direct
  let targetUrl = url;
  if (targetUrl.startsWith('//')) {
    targetUrl = 'https:' + targetUrl;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        // If 404 or something, try decoding wsrv url if it is a wsrv url
        if (targetUrl.includes('wsrv.nl/?url=')) {
          const match = targetUrl.match(/wsrv\.nl\/\?url=([^&]+)/);
          if (match) {
            targetUrl = decodeURIComponent(match[1]);
            continue;
          }
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      return true;
    } catch (err) {
      if (attempt === retries) {
        console.warn(`[WARN] Failed to download ${url} -> ${destPath}: ${err.message}`);
        return false;
      }
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
  return false;
}

// Batch download helper
async function downloadPool(items, concurrency = 10, label = 'Assets') {
  let completed = 0;
  let failed = 0;
  const total = items.length;
  console.log(`[DOWNLOAD] Starting ${label} (${total} items, concurrency: ${concurrency})...`);

  for (let i = 0; i < total; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async item => {
        const ok = await downloadFile(item.url, item.dest);
        if (ok) completed++;
        else failed++;
      })
    );
    process.stdout.write(`\r[PROGRESS] ${label}: ${completed}/${total} (Failed: ${failed})`);
  }
  console.log(`\n[DOWNLOAD] ${label} finished: ${completed} ok, ${failed} failed.`);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public', 'mlbb');
  const dataDir = path.join(rootDir, 'src', 'data', 'mlbb');

  const heroesImgDir = path.join(publicDir, 'heroes');
  const skillsImgDir = path.join(publicDir, 'skills');
  const itemsImgDir = path.join(publicDir, 'items');
  const spellsImgDir = path.join(publicDir, 'spells');
  const emblemsImgDir = path.join(publicDir, 'emblems');

  [heroesImgDir, skillsImgDir, itemsImgDir, spellsImgDir, emblemsImgDir, dataDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 1. Fetch tables
  const [
    rawHeroes,
    rawHeroDetails,
    rawTierStats,
    rawRelations,
    rawItems,
    rawSpells,
    rawEmblems
  ] = await Promise.all([
    fetchTable('heroes'),
    fetchTable('hero_details'),
    fetchTable('hero_tier_stats'),
    fetchTable('hero_relations'),
    fetchTable('items'),
    fetchTable('battle_spells'),
    fetchTable('emblems')
  ]);

  // Map hero details by moonton_hero_id and hero_id
  const detailsByMoontonId = new Map();
  const detailsByHeroId = new Map();
  rawHeroDetails.forEach(d => {
    if (d.moonton_hero_id) detailsByMoontonId.set(d.moonton_hero_id, d);
    if (d.hero_id) detailsByHeroId.set(d.hero_id, d);
  });

  // 2. Prepare Heroes assets to download
  const heroDownloads = [];
  const skillDownloads = [];
  const processedHeroes = [];

  for (const h of rawHeroes) {
    const slug = slugify(h.name);
    const detail = detailsByMoontonId.get(h.moonton_hero_id) || detailsByHeroId.get(h.id) || {};

    // Determine extension
    let ext = '.jpg';
    if (h.image_url && h.image_url.includes('.png')) ext = '.png';
    else if (h.image_url && h.image_url.includes('.webp')) ext = '.webp';

    const heroFilename = `${slug}${ext}`;
    const heroFilePath = path.join(heroesImgDir, heroFilename);
    const localHeroImgUrl = `/mlbb/heroes/${heroFilename}`;

    if (h.image_url) {
      heroDownloads.push({ url: h.image_url, dest: heroFilePath });
    }

    // Skills
    const skillsId = detail.skills_id || [];
    const skillsEn = detail.skills_en || [];
    const maxSkills = Math.max(skillsId.length, skillsEn.length);
    const combinedSkills = [];

    for (let i = 0; i < maxSkills; i++) {
      const sId = skillsId[i] || {};
      const sEn = skillsEn[i] || {};
      const skillId = sId.id || sEn.id || `${slug}-skill-${i + 1}`;
      const iconUrl = sId.icon || sEn.icon;
      let localSkillIcon = null;

      if (iconUrl) {
        const skillFilename = `${slug}_skill_${sId.order || i + 1}_${skillId}.png`;
        const skillFilePath = path.join(skillsImgDir, skillFilename);
        localSkillIcon = `/mlbb/skills/${skillFilename}`;
        skillDownloads.push({ url: iconUrl, dest: skillFilePath });
      }

      combinedSkills.push({
        id: skillId,
        name: sId.name || sEn.name || `Skill ${i + 1}`,
        order: sId.order || i + 1,
        cdCost: sId.cdCost || sEn.cdCost || '',
        tags: sId.tags || sEn.tags || [],
        icon: localSkillIcon,
        icon_remote: iconUrl,
        desc_id: sId.desc || [],
        desc_en: sEn.desc || []
      });
    }

    processedHeroes.push({
      id: h.id,
      moonton_hero_id: h.moonton_hero_id,
      name: h.name,
      slug: slug,
      title: h.description || '',
      roles: h.roles || [],
      lane: detail.lane || [],
      speciality: detail.speciality || [],
      image: localHeroImgUrl,
      image_remote: h.image_url,
      stats: {
        durability: detail.stat_durability ?? 0,
        offense: detail.stat_offense ?? 0,
        ability: detail.stat_ability ?? 0,
        difficulty: detail.stat_difficulty ?? 0
      },
      lore: {
        id: detail.lore_id || '',
        en: detail.lore_en || ''
      },
      skill_order: detail.skill_order || [],
      skills: combinedSkills
    });
  }

  // 3. Prepare Items assets
  const itemDownloads = [];
  const processedItems = rawItems.map(item => {
    const slug = slugify(item.name);
    let ext = '.png';
    if (item.image_url && item.image_url.includes('.jpg')) ext = '.jpg';
    else if (item.image_url && item.image_url.includes('.webp')) ext = '.webp';

    const filename = `${slug}${ext}`;
    const dest = path.join(itemsImgDir, filename);
    const localImg = `/mlbb/items/${filename}`;

    if (item.image_url) {
      itemDownloads.push({ url: item.image_url, dest });
    }

    return {
      ...item,
      slug,
      image: localImg,
      image_remote: item.image_url
    };
  });

  // 4. Prepare Spells assets
  const spellDownloads = [];
  const processedSpells = rawSpells.map(s => {
    const slug = slugify(s.name);
    let ext = '.png';
    if (s.image_url && s.image_url.includes('.jpg')) ext = '.jpg';
    const filename = `${slug}${ext}`;
    const dest = path.join(spellsImgDir, filename);
    const localImg = `/mlbb/spells/${filename}`;

    if (s.image_url) {
      spellDownloads.push({ url: s.image_url, dest });
    }

    return {
      ...s,
      slug,
      image: localImg,
      image_remote: s.image_url
    };
  });

  // 5. Prepare Emblems assets
  const emblemDownloads = [];
  const processedEmblems = rawEmblems.map(e => {
    const slug = slugify(e.name);
    let ext = '.png';
    const filename = `${slug}${ext}`;
    const dest = path.join(emblemsImgDir, filename);
    const localImg = `/mlbb/emblems/${filename}`;

    if (e.image_url) {
      emblemDownloads.push({ url: e.image_url, dest });
    }

    return {
      ...e,
      slug,
      image: localImg,
      image_remote: e.image_url
    };
  });

  // Execute downloads in parallel pools
  await downloadPool(heroDownloads, 12, 'Hero Portraits');
  await downloadPool(skillDownloads, 15, 'Skill Icons');
  await downloadPool(itemDownloads, 10, 'Items');
  await downloadPool(spellDownloads, 5, 'Battle Spells');
  await downloadPool(emblemDownloads, 5, 'Emblems');

  // Save JSON files
  console.log('[DATA] Writing JSON data files to src/data/mlbb/...');

  // Sort heroes by name alphabetically
  processedHeroes.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(path.join(dataDir, 'heroes.json'), JSON.stringify(processedHeroes, null, 2));
  fs.writeFileSync(path.join(dataDir, 'hero_details.json'), JSON.stringify(rawHeroDetails, null, 2));
  fs.writeFileSync(path.join(dataDir, 'hero_tier_stats.json'), JSON.stringify(rawTierStats, null, 2));
  fs.writeFileSync(path.join(dataDir, 'hero_relations.json'), JSON.stringify(rawRelations, null, 2));
  fs.writeFileSync(path.join(dataDir, 'items.json'), JSON.stringify(processedItems, null, 2));
  fs.writeFileSync(path.join(dataDir, 'battle_spells.json'), JSON.stringify(processedSpells, null, 2));
  fs.writeFileSync(path.join(dataDir, 'emblems.json'), JSON.stringify(processedEmblems, null, 2));

  // Create TypeScript helper index.ts
  const tsContent = `// src/data/mlbb/index.ts
// Auto-generated MLBB dataset and accessor utilities

import heroesData from './heroes.json';
import tierStatsData from './hero_tier_stats.json';
import relationsData from './hero_relations.json';
import itemsData from './items.json';
import battleSpellsData from './battle_spells.json';
import emblemsData from './emblems.json';

export interface MLBBHeroSkill {
  id: string | number;
  name: string;
  order: number;
  cdCost: string;
  tags: Array<{ name: string; color: string }>;
  icon: string | null;
  icon_remote: string | null;
  desc_id: Array<{ t?: string; c?: string }>;
  desc_en: Array<{ t?: string; c?: string }>;
}

export interface MLBBHero {
  id: string;
  moonton_hero_id: number;
  name: string;
  slug: string;
  title: string;
  roles: string[];
  lane: string[];
  speciality: string[];
  image: string;
  image_remote: string;
  stats: {
    durability: number;
    offense: number;
    ability: number;
    difficulty: number;
  };
  lore: {
    id: string;
    en: string;
  };
  skill_order: number[];
  skills: MLBBHeroSkill[];
}

export interface MLBBTierStat {
  hero_id: string;
  hero_name: string;
  hero_icon: string;
  rank: string;
  lane: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
  score: number;
  tier: string;
  rank_position: number;
  updated_at: string;
}

export interface MLBBHeroRelation {
  moonton_hero_id: number;
  hero_name: string;
  rank: string;
  counters: any[];
  synergies: any[];
  updated_at: string;
}

export interface MLBBItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: number;
  image: string;
  image_remote: string;
  stats: Record<string, any>;
  passive_description: string;
  mpl_id: string;
}

export interface MLBBBattleSpell {
  id: string;
  name: string;
  slug: string;
  image: string;
  image_remote: string;
  description: string;
  cooldown: number;
}

export interface MLBBEmblem {
  id: string;
  name: string;
  slug: string;
  image: string;
  image_remote: string;
  attributes: Record<string, any>;
  mpl_id: string;
}

export const heroes: MLBBHero[] = heroesData as MLBBHero[];
export const heroTierStats: MLBBTierStat[] = tierStatsData as MLBBTierStat[];
export const heroRelations: MLBBHeroRelation[] = relationsData as MLBBHeroRelation[];
export const items: MLBBItem[] = itemsData as MLBBItem[];
export const battleSpells: MLBBBattleSpell[] = battleSpellsData as MLBBBattleSpell[];
export const emblems: MLBBEmblem[] = emblemsData as MLBBEmblem[];

export function getAllHeroes(): MLBBHero[] {
  return heroes;
}

export function getHeroBySlug(slug: string): MLBBHero | undefined {
  return heroes.find(h => h.slug === slug.toLowerCase());
}

export function getHeroById(id: string): MLBBHero | undefined {
  return heroes.find(h => h.id === id);
}

export function getHeroByMoontonId(moontonId: number): MLBBHero | undefined {
  return heroes.find(h => h.moonton_hero_id === moontonId);
}

export function getHeroesByRole(role: string): MLBBHero[] {
  return heroes.filter(h => h.roles.map(r => r.toLowerCase()).includes(role.toLowerCase()));
}

export function getHeroesByLane(lane: string): MLBBHero[] {
  return heroes.filter(h => h.lane.map(l => l.toLowerCase()).includes(lane.toLowerCase()));
}

export function getHeroTierStats(heroName: string): MLBBTierStat[] {
  return heroTierStats.filter(s => s.hero_name.toLowerCase() === heroName.toLowerCase());
}

export function getHeroRelations(heroName: string): MLBBHeroRelation | undefined {
  return heroRelations.find(r => r.hero_name.toLowerCase() === heroName.toLowerCase());
}
`;

  fs.writeFileSync(path.join(dataDir, 'index.ts'), tsContent);

  console.log('[SUCCESS] All MLBB data and assets have been downloaded and saved successfully!');
  console.log(`- Heroes count: ${processedHeroes.length}`);
  console.log(`- Skills count: ${skillDownloads.length}`);
  console.log(`- Items count: ${processedItems.length}`);
  console.log(`- Battle Spells count: ${processedSpells.length}`);
  console.log(`- Emblems count: ${processedEmblems.length}`);
}

main().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
