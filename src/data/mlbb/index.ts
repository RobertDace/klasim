// src/data/mlbb/index.ts
// Auto-generated MLBB dataset and accessor utilities

import heroesData from './heroes.json';
import tierStatsData from './hero_tier_stats.json';
import relationsData from './hero_relations.json';
import itemsData from './items.json';
import battleSpellsData from './battle_spells.json';
import emblemsData from './emblems.json';
import buildsData from './builds.json';

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
  skill_order: string | number[];
  skills: MLBBHeroSkill[];
}

export interface MLBBTierStat {
  hero_id: string | number;
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

export interface MLBBEnrichedBuild {
  id: string;
  title: string;
  description: string;
  likes_count: number;
  is_verified: boolean;
  items: MLBBItem[];
  conditional_items: MLBBItem[];
  spell: MLBBBattleSpell | null;
  emblem: MLBBEmblem | null;
  totalStats: Record<string, number>;
}

export const buildsMap: Record<string, MLBBEnrichedBuild[]> = (buildsData as unknown) as Record<string, MLBBEnrichedBuild[]>;

export function getHeroBuilds(slug: string): MLBBEnrichedBuild[] {
  return buildsMap[slug.toLowerCase()] || [];
}
