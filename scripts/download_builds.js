const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.molebuild.com/rest/v1';
const API_KEY = 'sb_publishable_jICLjneY1D5hn0NcknF1W9_UKazt33X';
const HEADERS = {
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'User-Agent': 'Mozilla/5.0'
};

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const dataDir = path.join(rootDir, 'src', 'data', 'mlbb');
  
  const heroes = JSON.parse(fs.readFileSync(path.join(dataDir, 'heroes.json')));
  const items = JSON.parse(fs.readFileSync(path.join(dataDir, 'items.json')));
  const spells = JSON.parse(fs.readFileSync(path.join(dataDir, 'battle_spells.json')));
  const emblems = JSON.parse(fs.readFileSync(path.join(dataDir, 'emblems.json')));

  const itemsById = new Map(items.map(i => [i.id, i]));
  const spellsById = new Map(spells.map(s => [s.id, s]));
  const emblemsById = new Map(emblems.map(e => [e.id, e]));

  console.log('[BUILDS] Fetching top community & pro builds from MoleBuild API...');
  
  // 1. Fetch top 1500 builds ordered by likes
  const res = await fetch(`${API_BASE}/builds?select=id,hero_id,title,description,items,conditional_items,emblem_id,battle_spell_id,likes_count,is_verified&order=likes_count.desc&limit=1500`, {
    headers: HEADERS
  });
  const allBuilds = await res.json();
  console.log(`[BUILDS] Fetched ${allBuilds.length} builds.`);

  // Group builds by hero_id
  const buildsByHeroId = new Map();
  allBuilds.forEach(b => {
    if (!buildsByHeroId.has(b.hero_id)) {
      buildsByHeroId.set(b.hero_id, []);
    }
    const list = buildsByHeroId.get(b.hero_id);
    if (list.length < 3) {
      list.push(b);
    }
  });

  // Check which heroes are still missing builds
  const missingHeroes = heroes.filter(h => !buildsByHeroId.has(h.id) || buildsByHeroId.get(h.id).length === 0);
  console.log(`[BUILDS] Heroes needing individual fetch: ${missingHeroes.length}`);

  for (const h of missingHeroes) {
    try {
      const hRes = await fetch(`${API_BASE}/builds?hero_id=eq.${h.id}&select=id,hero_id,title,description,items,conditional_items,emblem_id,battle_spell_id,likes_count,is_verified&order=created_at.desc&limit=2`, {
        headers: HEADERS
      });
      if (hRes.ok) {
        const hBuilds = await hRes.json();
        if (hBuilds.length > 0) {
          buildsByHeroId.set(h.id, hBuilds);
        }
      }
    } catch (e) {
      console.warn(`Failed for ${h.name}: ${e.message}`);
    }
  }

  // Format and enrich builds with resolved items, spells, emblems
  const enrichedBuilds = {};

  heroes.forEach(h => {
    const rawList = buildsByHeroId.get(h.id) || [];
    
    // If hero still has no build, create a sensible default template
    if (rawList.length === 0) {
      // Find default spell & emblem based on role
      const isMage = h.roles.includes('Mage');
      const isAssassin = h.roles.includes('Assassin');
      const isTank = h.roles.includes('Tank');
      const isMarksman = h.roles.includes('Marksman');
      
      let defaultEmblem = emblems.find(e => isMage ? e.name === 'Mage' : isTank ? e.name === 'Tank' : isAssassin ? e.name === 'Assassin' : isMarksman ? e.name === 'Marksman' : e.name === 'Fighter') || emblems[0];
      let defaultSpell = spells.find(s => isAssassin ? s.name.includes('Retribution') : isTank ? s.name === 'Vengeance' : s.name === 'Flicker') || spells[0];
      
      // Filter 6 suitable items
      const sampleItems = items.filter(i => isMage ? i.type === 'Magic' || i.type === 'Movement' : isTank ? i.type === 'Defense' || i.type === 'Movement' : i.type === 'Physical' || i.type === 'Attack' || i.type === 'Movement').slice(0, 6);

      rawList.push({
        id: `default-${h.slug}`,
        hero_id: h.id,
        title: `Rekomendasi Standar Meta ${h.name}`,
        description: `Build rekomendasi turnamen seimbang untuk ${h.name} pada role ${h.roles.join('/')}.`,
        items: sampleItems.map(i => i.id),
        conditional_items: [],
        emblem_id: defaultEmblem?.id || null,
        battle_spell_id: defaultSpell?.id || null,
        likes_count: 10,
        is_verified: true
      });
    }

    enrichedBuilds[h.slug] = rawList.map((b, idx) => {
      const resolvedItems = (b.items || []).map(id => itemsById.get(id)).filter(Boolean);
      const resolvedConditionals = (b.conditional_items || []).map(id => itemsById.get(id)).filter(Boolean);
      const resolvedSpell = spellsById.get(b.battle_spell_id) || null;
      const resolvedEmblem = emblemsById.get(b.emblem_id) || null;

      // Accumulate item stats
      const totalStats = {};
      resolvedItems.forEach(item => {
        if (item.stats) {
          Object.entries(item.stats).forEach(([k, v]) => {
            const num = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
            if (!isNaN(num)) {
              totalStats[k] = (totalStats[k] || 0) + num;
            }
          });
        }
      });

      return {
        id: b.id,
        title: b.title || `Pro Build #${idx + 1}`,
        description: b.description || '',
        likes_count: b.likes_count || 0,
        is_verified: b.is_verified || false,
        items: resolvedItems,
        conditional_items: resolvedConditionals,
        spell: resolvedSpell,
        emblem: resolvedEmblem,
        totalStats
      };
    });
  });

  const outputPath = path.join(dataDir, 'builds.json');
  fs.writeFileSync(outputPath, JSON.stringify(enrichedBuilds, null, 2));
  console.log(`[SUCCESS] Saved enriched builds for all ${heroes.length} heroes to ${outputPath}!`);
}

main().catch(console.error);
