// src/app/mlbb/guides/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { heroes, items, battleSpells, emblems } from '@/data/mlbb';

// ==========================================
// DATA STRUCTURES FOR MACRO & STRATEGY
// ==========================================

interface ObjectiveStage {
  id: string;
  timeString: string;
  minute: number;
  title: string;
  icon: string;
  category: 'spawn' | 'turtle' | 'lord' | 'turret' | 'roam';
  summary: string;
  retributionDamage: number;
  keyTactics: string[];
  roleResponsibilities: {
    roam: string;
    jungle: string;
    mid: string;
    gold: string;
    exp: string;
  };
  criticalMistake: string;
}

const OBJECTIVE_TIMELINE: ObjectiveStage[] = [
  {
    id: 'start-000',
    timeString: '00:00 - 00:30',
    minute: 0,
    title: 'Match Start, Buff Leash & Invade Guard',
    icon: '🚩',
    category: 'spawn',
    summary: 'Minion waves spawn di 00:10. Tim menentukan arah rotasi awal: protect blue buff, leash jungler, atau counter-invade ke jungle musuh.',
    retributionDamage: 1080,
    keyTactics: [
      'Roamer wajib membuka semak buff yang berseberangan dengan posisi jungler untuk mencegah sneaky invade lawan.',
      'Mid laner membantu clear minion wave pertama secepat mungkin (target < 4 detik) untuk mencapai Level 2 lebih awal.',
      'EXP laner dan Gold laner prioritaskan last-hit minion wave pertama tanpa overextend.',
    ],
    roleResponsibilities: {
      roam: 'Buka visi semak sungai / buff jungler, zoning roamer lawan agar tidak reset buff.',
      jungle: 'Clear buff pertama (Blue jika hero boros energi/mana seperti Fanny/Ling, Red jika hero basic attack).',
      mid: 'Burst wave pertama segera, amankan semak tengah untuk kontrol river vision.',
      gold: 'Fokus last hit wave pertama, jangan tukar darah berlebihan sebelum level 2.',
      exp: 'Duel lane wave pertama, monitor semak buff terdekat dari kemungkinan invade.',
    },
    criticalMistake: 'Roamer menempel jungler membagi EXP/Gold buff, atau mid laner roaming sebelum wave pertama habis dibersihkan.',
  },
  {
    id: 'litho-045',
    timeString: '00:45',
    minute: 0.75,
    title: 'Lithowanderer Spawn & River Dominance',
    icon: '🦎',
    category: 'spawn',
    summary: 'Lithowanderer spawn di salah satu sisi sungai. Memberikan vision ward yang mengikuti hero pengeliminasi dan movement speed buff di area sungai.',
    retributionDamage: 1140,
    keyTactics: [
      'Kontrol Litho menentukan tempo ganking ke Gold Lane atau EXP Lane.',
      'Jika jungler lawan memiliki kill potential lebih tinggi di level 2 (misal Martis/Baxia), hindari kontes 50:50 jika tim kekurangan backup.',
      'Gunakan skill burst sinkron dengan Retribution jika memutuskan untuk merebut.',
    ],
    roleResponsibilities: {
      roam: 'Zoning jungler lawan dari semak river Litho, gunakan skill crowd control awal.',
      jungle: 'Eksekusi Litho dengan kalkulasi Retribution (~1.140 HP) atau tinggalkan jika berisiko terculik.',
      mid: 'Spam skill poke dari jarak aman, bersiap rotasi mengikuti pergerakan roamer.',
      gold: 'Waspada gank mendadak jika jungler lawan mengamankan Litho di sisi dekat Gold Lane.',
      exp: 'Bantu backup jika Litho spawn di dekat EXP lane.',
    },
    criticalMistake: 'Memaksakan kontes Lithowanderer saat Mid Laner lawan sudah rotasi sementara Mid Laner kawan tertinggal di lane.',
  },
  {
    id: 'turtle-200',
    timeString: '02:00',
    minute: 2,
    title: 'Turtle #1 Spawn (Level 4 Spike Fight)',
    icon: '🐢',
    category: 'turtle',
    summary: 'Turtle pertama muncul di river sisi EXP Lane. Mengeliminasi Turtle memberikan shield tebal untuk seluruh tim, gold tambahan, dan keunggulan level.',
    retributionDamage: 1320,
    keyTactics: [
      'Setup visi 15 detik sebelum Turtle spawn (menit 01:45). Roamer & Mid wajib menguasai semak pit.',
      'Jungler wajib mencapai Level 4 sebelum kontes dimulai untuk membuka Ultimate.',
      'Zoning jungler musuh keluar dari jangkauan Retribution (retri range ~5.5 yard).',
    ],
    roleResponsibilities: {
      roam: 'Tahan posisi di semak terdepan (choke point), cegah jungler lawan masuk pit.',
      jungle: 'Tarik Turtle sedikit keluar dari pit untuk mempersempit sudut steal musuh, tahan Retri di ~1.320 HP.',
      mid: 'Gunakan ultimate untuk zoning area pit atau follow-up inisiasi roamer.',
      gold: 'Push wave di gold lane, manfaatkan musuh yang terdistraksi di turtle pit untuk cicil turret shield.',
      exp: 'Wajib hadir di pit, gunakan hero durability tinggi untuk badanin damage lawan.',
    },
    criticalMistake: 'Semua 5 pemain memukul Turtle di dalam pit sehingga terkena ultimate AoE combo musuh secara bersamaan.',
  },
  {
    id: 'turtle-400',
    timeString: '04:00',
    minute: 4,
    title: 'Turtle #2 Spawn & Outer Turret Gold Rush',
    icon: '🐢',
    category: 'turtle',
    summary: 'Turtle kedua spawn. Bersamaan dengan menit-menit akhir lapisan pelindung gold turret (Outer Turret Shield).',
    retributionDamage: 1480,
    keyTactics: [
      'Tim yang tertinggal gold dapat memilih trading: biarkan musuh ambil Turtle sementara 2-3 kawan menghancurkan Turret Shield di seberang map.',
      'Maksimalkan damage ke lapisan gold turret sebelum pelindung habis di menit 05:00.',
    ],
    roleResponsibilities: {
      roam: 'Beri opsi: apakah kontes Turtle #2 atau invasi red/blue buff lawan yang baru respawn.',
      jungle: 'Amankan Turtle #2 jika unggul, atau curi jungle lawan jika musuh commit turtle.',
      mid: 'Bersihkan wave mid secepatnya agar turret mid tidak terkena cicilan.',
      gold: 'Kuras habis sisa gold shield di outer turret musuh sebelum 05:00.',
      exp: 'Bantu zoning Turtle atau potong wave musuh (proxying).',
    },
    criticalMistake: 'Mengejar kill hero musuh di luar objektif saat shield turret lawan masih penuh dan Turtle gratis dibiarkan.',
  },
  {
    id: 'shield-500',
    timeString: '05:00',
    minute: 5,
    title: 'Turret Gold Shield Drops & Full Roam Unlock',
    icon: '🛡️',
    category: 'turret',
    summary: 'Pelindung gold turret luar lenyap. Turret kini menerima damage penuh tanpa pengurangan. Blessing sepatu roamer mulai mencapai level maksimal.',
    retributionDamage: 1560,
    keyTactics: [
      'Outer turret yang hancur membuka akses langsung ke jungle musuh dan membatasi ruang gerak laner lawan.',
      'Roamer mulai memiliki blessing aktif penuh (Conceal / Encourage / Favor / Dire Hit) untuk ganking masif.',
      'Rotasi kini difokuskan untuk merontokkan outer turret lawan secara merata di 3 lane.',
    ],
    roleResponsibilities: {
      roam: 'Aktifkan blessing (misal Conceal) untuk pick-off carry lawan yang farming sendirian.',
      jungle: 'Mulai kontrol objektif netral dan counter-jungle secara agresif di area turret yang sudah jebol.',
      mid: 'Bantu gank lane terlemah lawan untuk meruntuhkan outer turret pertama.',
      gold: 'Runtuhkan outer turret jika memungkinkan, lalu tukar lane (lane swap) ke EXP jika turret bawah sudah jatuh.',
      exp: 'Tukar lane jika Gold laner sudah merontokkan turret, atau lakukan split push.',
    },
    criticalMistake: 'Gold laner tetap berdiam diri di lane bawah setelah turret hancur alih-alih rotasi ke mid/top untuk rotasi objektif.',
  },
  {
    id: 'turtle-600',
    timeString: '06:00',
    minute: 6,
    title: 'Turtle #3 (Final Turtle Before Lord)',
    icon: '🐢',
    category: 'turtle',
    summary: 'Turtle terakhir sebelum transisi ke fase Lord. Tim yang mendapatkan 3 Turtle biasanya memegang keunggulan 3.000+ gold.',
    retributionDamage: 1640,
    keyTactics: [
      'Kemenangan di Turtle 3 menjadi modal utama untuk menguasai Lord pertama di menit 08:00.',
      'Jika Turtle 3 tereliminasi, Lord pertama akan spawn tepat 2 menit setelahnya.',
    ],
    roleResponsibilities: {
      roam: 'Dirikan perimeter pertahanan di semak sungai utama.',
      jungle: 'Retribution threshold di ~1.640 HP, pastikan tidak terbuang untuk creep biasa.',
      mid: 'Gunakan poke spell untuk menguras HP jungler/roamer lawan sebelum mereka masuk pit.',
      gold: 'Rotasi jika berdekatan, atau freeze lane untuk mengunci musuh.',
      exp: 'Tahan hero frontliner musuh di area choke point.',
    },
    criticalMistake: 'Memulai Turtle 3 saat jungler kawan baru saja mati atau battle spell Retribution sedang cooldown.',
  },
  {
    id: 'lord-800',
    timeString: '08:00',
    minute: 8,
    title: 'Lord #1 Spawn (Initial Unenhanced Lord)',
    icon: '👑',
    category: 'lord',
    summary: 'Lord pertama muncul di pit! Lord ini belum memiliki kemampuan charge menabrak turret, namun cukup kuat untuk merontokkan Inner Turret.',
    retributionDamage: 1800,
    keyTactics: [
      'Setup wave 3 lane sebelum memukul Lord: dorong minimal 2 lane melewati sungai (cross-river wave).',
      'Jangan buru-buru memukul Lord jika musuh masih berlima dan memiliki hero pencuri seperti Cecilion/Pharsa/Novaria.',
      'Gunakan strategi bait: pukul Lord sampai 50%, lalu inisiasi musuh saat mereka tergesa-gesa mendekat.',
    ],
    roleResponsibilities: {
      roam: 'Sweep semak pit dengan skill vision (bukan badan), tahan posisi di semak luar musuh.',
      jungle: 'Hit Lord dengan sudut menghadap markas sendiri, tahan Retri di ~1.800 HP.',
      mid: 'Simpan skill ultimate untuk kontes teamfight, bukan untuk mencicil Lord.',
      gold: 'Damage dealer utama ke Lord, jaga jarak aman dari semak tak berpenghuni.',
      exp: 'Flanking ke arah mage/marksman musuh saat mereka mencoba mendekati pit.',
    },
    criticalMistake: 'Menghabiskan semua skill ultimate kawan untuk memukul Lord, sehingga tidak ada skill tersisa saat lawan melakukan kontes.',
  },
  {
    id: 'lord-1200',
    timeString: '12:00',
    minute: 12,
    title: 'Enhanced Lord (Charge & Turret Buster)',
    icon: '⚡',
    category: 'lord',
    summary: 'Lord Level 2 (Enhanced)! Lord kini memiliki kemampuan Charge menyeruduk turret pertama yang ditemuinya dan True Damage stomp di area sekitar.',
    retributionDamage: 1960,
    keyTactics: [
      'Kematian di menit 12+ berakibat fatal karena death timer mencapai 40-50 detik.',
      'Sinkronisasi minion wave di ketiga lane: jangan biarkan Lord berjalan sendirian tanpa ada minion di lane lain.',
      'Serang base musuh secara serempak saat Lord melakukan charge ke inhibitor turret.',
    ],
    roleResponsibilities: {
      roam: 'Cari pick-off sebelum Lord dipukul. Gunakan Conceal untuk inisiasi kejutan.',
      jungle: 'Fokus penuh pada Retribution threshold (~1.960 HP) dan timing combo burst.',
      mid: 'Clear wave lawan sebelum Lord tiba agar inhibitor turret musuh tidak dapat bantuan clear wave.',
      gold: 'Fokus menghancurkan Inhibitor Turret saat perhatian musuh teralih ke Lord.',
      exp: 'Cut wave belakang musuh jika memungkinkan atau jaga pintu keluar base lawan.',
    },
    criticalMistake: 'Maju mendahului Lord dan mati konyol sebelum Lord sempat menabrak turret base lawan.',
  },
  {
    id: 'lord-1800',
    timeString: '18:00+',
    minute: 18,
    title: 'Evolved Sanctuary Lord (80% DR & Mega Lightning)',
    icon: '🔱',
    category: 'lord',
    summary: 'Lord Level 3 (Evolved Sanctuary Lord). Mendapatkan 80% Damage Reduction jika ada 3+ kawan di sekitarnya, menembakkan petir penyapu minion, dan memberi aura buff bagi hero pengiring.',
    retributionDamage: 2200,
    keyTactics: [
      'Ini adalah penentu akhir pertandingan. 1 kesalahan posisi (mispositioning) berarti kekalahan instan.',
      'Dampingi Lord minimal 3 hero kawan agar pasif 80% Damage Reduction Lord aktif.',
      'Targetkan penghancuran Crystal/Nexus base musuh secara langsung jika minion super sudah masuk.',
    ],
    roleResponsibilities: {
      roam: 'Pasang badan di garis depan, serap skill burst musuh demi melindungi marksman & jungler.',
      jungle: 'Retri threshold ~2.200 HP. Gunakan Immortality / Winter Crown untuk survivabilitas maksimal.',
      mid: 'Zoning musuh di dalam base mereka dengan high-ground AoE.',
      gold: 'Target langsung turret inhibitor dan Nexus musuh, abaikan hero tank lawan.',
      exp: 'Kunci carry musuh di dalam fountain mereka atau hentikan clear wave mereka.',
    },
    criticalMistake: 'Mengejar hero lawan sampai ke fountain base musuh sementara minion wave kawan habis dibersihkan lawan.',
  },
];

// ==========================================
// ROLE MASTERCLASS DATA
// ==========================================

interface RoleMasterclass {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  border: string;
  bgGrad: string;
  accent: string;
  idealMindset: string;
  coreArchetypes: Array<{ name: string; desc: string; heroes: string }>;
  earlyGameStrategy: string[];
  midLateTeamfightGuide: string[];
  proMicroTips: string[];
  recommendedSpells: string[];
  recommendedEmblemTalents: string[];
}

const ROLE_MASTERCLASSES: RoleMasterclass[] = [
  {
    id: 'roamer',
    name: 'ROAMER / TANK & SUPPORT',
    tagline: 'The Map General & Tempo Director',
    icon: '🛡️',
    color: 'text-amber-400',
    border: 'border-amber-400/40',
    bgGrad: 'from-amber-500/10 to-transparent',
    accent: 'bg-amber-400 text-black',
    idealMindset: 'Roamer yang baik tidak dinilai dari jumlah assist, melainkan dari berapa detik tim kawan merasa aman di peta dan berapa kali jungler lawan terganggu ritme farmingnya.',
    coreArchetypes: [
      { name: 'Hard CC Initiator', desc: 'Membuka teamfight dengan crowd control masif area.', heroes: 'Tigreal, Atlas, Khufra, Minotaur' },
      { name: 'Utility Healer/Shielder', desc: 'Memperpanjang daya tahan hidup carry tim lewat heal, shield, dan sprint.', heroes: 'Mathilda, Angela, Floryn, Rafaela' },
      { name: 'Frontline Meatshield', desc: 'Menyerap ratusan ribu damage, menguras skill lawan, dan zoning area.', heroes: 'Hylos, Belerick, Grock, Fredrinn' },
      { name: 'Disrupter & Pick-Off', desc: 'Mengacaukan formasi musuh dan menculik target empuk.', heroes: 'Chou, Franco, Kaja, Chip' },
    ],
    earlyGameStrategy: [
      'Menit 00:00 - 00:30: Jangan pernah menempel jungler yang sedang memukul creep jika tidak ada ancaman invade. Buka semak river atau semak buff seberang.',
      'Menit 00:45: Bersiap di area Lithowanderer. Bantu mid laner poke musuh atau ganggu jungler musuh yang mencoba last hit.',
      'Menit 01:30: Rotasi ke Gold Lane untuk melindungi marksman dari potensi gank level 4 musuh.',
      'Menit 01:50: Berangkat menuju pit Turtle pertama. Amankan semak choke point sebelum jungler kawan tiba.',
    ],
    midLateTeamfightGuide: [
      'Zoning > Inisiasi: Di perebutan Lord, menahan 3 musuh di luar pit jauh lebih berharga daripada memukul Lord bersama-sama.',
      'Gunakan Conceal secara tak terduga dari semak blind spot lawan, bukan dari garis depan yang terlihat jelas di minimap.',
      'Jika carry kawan diincar assassin lincah (Ling, Fanny, Hayabusa), simpan skill CC hard (knock-up/suppress) khusus untuk menyelamatkan carry kawan (peeling), bukan untuk menyerang tanker musuh.',
    ],
    proMicroTips: [
      'Gunakan blessing "Favor" jika hero memiliki skill heal/shield, atau "Dire Hit" pada hero roamer damage seperti Natalia/Saber/Hilda.',
      'Periksa semak menggunakan skill proyektil (misal Grock S1, Khufra S1 cancel) untuk melihat reaksi item Dreadnaught / blade armor tanpa perlu memasukkan badan.',
      'Track cooldown Battle Spell lawan (Flicker, Purify) dan laporkan ke tim sebelum melakukan inisiasi.',
    ],
    recommendedSpells: ['Flicker', 'Revitalize', 'Vengeance', 'Petrify'],
    recommendedEmblemTalents: ['Support / Tank Emblem', 'Agility (Movement)', 'Tenacity / Wilderness Blessing', 'Focus Fire / Brave Smite'],
  },
  {
    id: 'jungler',
    name: 'JUNGLER / OBJECTIVE EXECUTIONER',
    tagline: 'The Economy Engine & Smite Specialist',
    icon: '🗡️',
    color: 'text-rose-400',
    border: 'border-rose-400/40',
    bgGrad: 'from-rose-500/10 to-transparent',
    accent: 'bg-rose-400 text-black',
    idealMindset: 'Jungler turnamen bukan pemburu kill individual, melainkan eksekutor objektif objektif netral yang menghitung setiap detik cooldown Retribution dan HP creep.',
    coreArchetypes: [
      { name: 'High-Mobility Assassin', desc: 'Melompati rintangan map, eksekusi backline, dan split push cepat.', heroes: 'Ling, Fanny, Hayabusa, Nolan, Lancelot' },
      { name: 'Tank & Utility Jungle', desc: 'Objektif kontrol super stabil, tahan invasi, dan sustain teamfight luar biasa.', heroes: 'Baxia, Fredrinn, Barats, Akai' },
      { name: 'Bruiser / Fighter Jungle', desc: 'Kombinasi sustain lifesteal dan damage konsisten di mid-game.', heroes: 'Suyou, Alpha, Dyrroth, Martis, Julian' },
    ],
    earlyGameStrategy: [
      'Pahami rute buff: Jika bot lane adalah Gold Lane kawan, mulai dari Blue Buff di Top Lane agar rotasi level 4 Anda berakhir di bot lane tepat saat ganking window terbuka di menit 01:45.',
      'Tarik creep ke arah rute perjalanan berikutnya (kiting creep) untuk menghemat 2-3 detik waktu tempuh per camp.',
      'Tahan Retribution di camp pertama hanya jika tidak ada ancaman invasi, gunakan Retri di camp kedua untuk percepat Level 4 sebelum Turtle.',
    ],
    midLateTeamfightGuide: [
      'Rumus Sinkronisasi Retribution: Jangan pernah mengandalkan Retribution saja saat HP Lord tersisa 2.000. Kombinasikan skill burst terkuat Anda (misal Lancelot S2, Nolan enhanced basic, Fanny kabel) pada 3.000 HP sehingga dalam 0.1 detik HP Lord anjlok ke 1.800 dan langsung dieksekusi Retribution.',
      'Tunggu cooldown skill CC musuh keluar sebelum assassin terjun ke barisan belakang lawan.',
      'Jika tim Anda kalah jumlah di pit Lord, pertimbangkan counter-push lane yang jauh atau lakukan split push daripada memaksakan kontes bunuh diri.',
    ],
    proMicroTips: [
      'Bloody Retribution (Merah) cocok untuk Tank Jungler untuk mencuri HP lawan. Ice Retribution (Biru) cocok untuk Assassin untuk memperlambat target lincah. Flame Retribution (Ungu) cocok untuk mencuri Physical/Magic power lawan.',
      'Selalu cek status level hero Anda untuk mengetahui nominal pasti damage Retribution (Level 1: 1.080, Level 15: 2.200).',
      'Hindari mengambil minion lane sebelum menit ke-5 karena penalti gold/EXP creep jungle sangat merugikan laner kawan.',
    ],
    recommendedSpells: ['Ice Retribution', 'Bloody Retribution', 'Flame Retribution'],
    recommendedEmblemTalents: ['Assassin / Fighter Emblem', 'Rupture / Thrill', 'Seasoned Hunter (+15% Damage Creep)', 'Killing Spree / War Cry'],
  },
  {
    id: 'mid',
    name: 'MID LANER / TEMPO ARCHITECT',
    tagline: 'Wave Clearance & River Controller',
    icon: '🧙',
    color: 'text-cyan-400',
    border: 'border-cyan-400/40',
    bgGrad: 'from-cyan-500/10 to-transparent',
    accent: 'bg-cyan-400 text-black',
    idealMindset: 'Jantung permainan MLBB ada di mid lane. Siapa yang membersihkan wave dalam 4 detik, dialah yang memegang hak prerogatif untuk melakukan gank pertama di sidelane.',
    coreArchetypes: [
      { name: 'High-Ground Artillery', desc: 'Jangkauan skill masif dari luar jangkauan penglihatan musuh.', heroes: 'Pharsa, Yve, Xavier, Cecilion' },
      { name: 'Burst & Single Target Catch', desc: 'Mengeliminasi satu target empuk dalam satu rangkaian kombo instan.', heroes: 'Vexana, Kadita, Aurora, Eudora, Nana' },
      { name: 'Crowd Control & Displacement', desc: 'Mengontrol pergerakan musuh di teamfight sempit.', heroes: 'Zhuxin, Valentina, Faramis, Lylia' },
    ],
    earlyGameStrategy: [
      'Aturan 4 Detik: Gunakan spell AoE segera saat 3 minion musuh berbaris lurus di menit 00:15. Segera setelah wave mati, putuskan arah rotasi: bantu Litho atau gank Gold Lane.',
      'JANGAN PERNAH melewati sungai terbuka sendirian tanpa kawalan Roamer. Selalu berjalan memutar melalui jalur hutan kawan yang aman (safe jungle route).',
      'Gunakan skill jarak jauh untuk melakukan "face check" ke semak sempit sebelum melangkah maju.',
    ],
    midLateTeamfightGuide: [
      'High-Ground Defense: Jika 3 inhibitor turret kawan hancur, tugas utama mid laner adalah menghabisi wave minion super dari dalam base sebelum minion sempat menyentuh turret.',
      'Dalam kontes Lord, posisikan diri Anda di seberang dinding pit. Lempar spell zoning (misal ulti Pharsa/Yve) tepat di jalur masuk musuh, bukan di badan Lord.',
      'Selalu amankan item defensif di slot ke-4 atau ke-5 (Winter Crown / Athena Shield) agar tidak menjadi sasaran empuk assassin lawan.',
    ],
    proMicroTips: [
      'Gunakan item Glowing Wand untuk memutus efek regenerasi dan shield hero lawan (menggantikan fungsi Necklace of Durance).',
      'Manfaatkan pasif Genius Wand: kurangi Magic Defense musuh hingga 21 poin dengan skill damage berkelanjutan sebelum meluncurkan burst ultimate.',
      'Perhatikan cooldown Flicker Anda: jika tanpa Flicker, mundurlah 2 yard lebih jauh ke belakang tanker.',
    ],
    recommendedSpells: ['Flicker', 'Purify', 'Flameshot'],
    recommendedEmblemTalents: ['Mage Emblem', 'Inspire (CDR) / Rupture (Penetration)', 'Bargain Hunter (Diskon Item) / Wilderness Blessing', 'Lethal Ignition / Impure Rage'],
  },
  {
    id: 'gold',
    name: 'GOLD LANER / LATE-GAME WIN CONDITION',
    tagline: 'The Ultimate Scaling Damage Carry',
    icon: '🏹',
    color: 'text-amber-300',
    border: 'border-amber-300/40',
    bgGrad: 'from-amber-400/10 to-transparent',
    accent: 'bg-amber-300 text-black',
    idealMindset: 'Tugas utama Gold Laner di 5 menit pertama bukanlah mencari kill, melainkan tidak mati dan mengamankan 100% last-hit minion gold turret.',
    coreArchetypes: [
      { name: 'Attack Speed / Trinity DPS', desc: 'Penghancur hero berdarah tebal dengan Demon Hunter Sword + Golden Staff + Corrosion Scythe.', heroes: 'Claude, Moskov, Miya, Karrie, Wanwan' },
      { name: 'Critical Burst Marksman', desc: 'Damage meledak 2.000+ dalam 2-3 tembakan di late game.', heroes: 'Bruno, Lesley, Irithel, Layla, Clint' },
      { name: 'Mage / Hybrid Gold Carry', desc: 'Memberikan magic damage konstan dan mobilitas tinggi.', heroes: 'Harith, Roger, Lunox, Natan, Beatrix' },
    ],
    earlyGameStrategy: [
      'Pelajari timing rotasi musuh: Menit 01:30 - 02:00 adalah "zona merah" di mana jungler dan roamer lawan biasanya melancarkan gank level 4 ke Gold Lane.',
      'Jika roamer kawan sedang berada di seberang map (Turtle pit), peluk turret kawan erat-erat. Lebih baik kehilangan 2 minion daripada mati ter-dive 3 hero musuh.',
      'Kuras shield turret musuh saat laner musuh mati atau terpaksa recall ke base.',
    ],
    midLateTeamfightGuide: [
      'Aturan Front-to-Back: Serang target terdekat yang aman di jangkauan tembak Anda. Jangan pernah memaksakan diri melompat ke belakang untuk mengejar mage lawan jika ada tank musuh yang siap me-lockdown Anda.',
      'Tunggu Assassin musuh menampakkan diri di peta atau menghabiskan ultimate mereka sebelum Anda masuk ke arena pertempuran terbuka.',
      'Di fase late-game (15:00+), selalu beli Wind of Nature (WoN) untuk hero physical atau Winter Crown untuk hero hybrid demi membeli waktu 2 detik kebal damage.',
    ],
    proMicroTips: [
      'Kuasai teknik "Stutter-Stepping" (kiting): tembak satu basic attack, geser analog pergerakan ke belakang, tembak lagi. Jangan pernah diam berdiri di satu titik saat menembak.',
      'Gunakan Malefic Gun untuk menambah jangkauan basic attack hingga Anda bisa mencicil turret musuh dari luar jangkauan tembakan turret.',
      'Ganti item instan (fast item swap): di late game, latih pergantian Immortality yang pecah langsung dijual dan digantikan oleh Winter Crown atau Rose Gold Meteor dalam 1 detik.',
    ],
    recommendedSpells: ['Flicker', 'Purify', 'Wind Chant (Item WoN)', 'Sprint'],
    recommendedEmblemTalents: ['Marksman / Assassin Emblem', 'Swift (Attack Speed) / Fatal (Crit)', 'Weapons Master / Tenacity', 'Weakness Finder / Quantum Charge'],
  },
  {
    id: 'exp',
    name: 'EXP LANER / THE FLANK & OFF-LANE DICTATOR',
    tagline: 'The Independent Duelist & Backline Disruptor',
    icon: '🥋',
    color: 'text-emerald-400',
    border: 'border-emerald-400/40',
    bgGrad: 'from-emerald-500/10 to-transparent',
    accent: 'bg-emerald-400 text-black',
    idealMindset: 'EXP Laner adalah pilar kestabilan tim. Ia mandiri di laning phase, pengacau formasi musuh di teamfight, dan garda terdepan di perebutan objektif Turtle.',
    coreArchetypes: [
      { name: 'Sustain & Raidboss Fighter', desc: 'Semakin dipukul semakin tebal dengan regenerasi dan lifesteal deras.', heroes: 'Terizla, Yu Zhong, Ruby, Thamuz, Uranus' },
      { name: 'High-Mobility Flanker', desc: 'Meluncur dari sudut tak terduga untuk menghabisi backline carry lawan.', heroes: 'Benedetta, Paquito, Arlott, Chou, Lapu-Lapu' },
      { name: 'Split Push Specialist', desc: 'Merontokkan turret di sisi berlawanan map saat musuh sibuk grouping.', heroes: 'Zilong, Sun, Argus, Masha' },
    ],
    earlyGameStrategy: [
      'Duel Level 1 & 2: Kenali power spike hero Anda vs lawan. Yu Zhong, Terizla, Dyrroth sangat kuat di level 1-2. Hero seperti Chou atau Paquito butuh level 4.',
      'Menit 01:45: Wajib bantu zoning di area Turtle pertama. Potong jalur rotasi EXP laner musuh agar tidak bisa ikut kontes Turtle.',
      'Teknik Cut Lane (Proxying): Jika hero Anda memiliki skill clear cepat (misal Benedetta/Terizla), potong wave di antara Turret T1 dan T2 musuh, lalu langsung rotasi ke mid lane.',
    ],
    midLateTeamfightGuide: [
      'Flanking > Frontline: Di teamfight 5v5 atau perebutan Lord, jangan berdiri sejajar dengan Roamer kawan. Berputarlah lewat semak samping atau belakang musuh untuk menyergap Mage dan Marksman musuh.',
      'Zoning Retri User: Gunakan badan dan skill CC Anda untuk mendorong Jungler lawan menjauh dari pit Lord.',
      'Keseimbangan Split Push: Jangan melakukan split push tanpa melihat minimap. Jika 4 musuh hilang dari peta, mereka pasti sedang bergerak ke arah lane Anda.',
    ],
    proMicroTips: [
      'Gunakan War Axe + Brute Force Breastplate untuk mendapatkan kombinasi True Damage pasif, Cooldown Reduction 20%, dan ketahanan Physical/Magic Defense berlipat ganda.',
      'Perhatikan pasif "Brave Smite" pada emblem: memulihkan 4% Max HP setiap kali memberikan skill damage atau efek crowd control pada musuh (cooldown 6 detik).',
      'Gunakan Petrify tepat di tengah kerumunan musuh untuk menjamin kombo ultimate Anda mengenai seluruh anggota tim musuh.',
    ],
    recommendedSpells: ['Petrify', 'Vengeance', 'Flicker', 'Execute'],
    recommendedEmblemTalents: ['Fighter / Tank Emblem', 'Thrill / Firmness', 'Festival of Blood (Spell Vamp) / Tenacity', 'Brave Smite / War Cry'],
  },
];

// ==========================================
// WAVE MANAGEMENT PROTOCOLS
// ==========================================

interface WaveProtocol {
  id: string;
  name: string;
  badge: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Tournament';
  color: string;
  definition: string;
  howToExecute: string[];
  tacticalOutcome: string;
  counterplay: string;
}

const WAVE_PROTOCOLS: WaveProtocol[] = [
  {
    id: 'freeze',
    name: 'FREEZE LANE (PENGUNCIAN WAVE)',
    badge: 'STARVE THE ENEMY',
    icon: '🧊',
    difficulty: 'Intermediate',
    color: 'border-cyan-400/40 text-cyan-400 bg-cyan-400/10',
    definition: 'Mempertahankan titik temu minion kawan dan musuh tepat di luar jangkauan tembakan turret kawan. Tujuannya adalah membuat laner musuh tidak mendapatkan gold & EXP jika mereka takut mendekat, atau membunuh mereka dengan gank jika mereka overextend.',
    howToExecute: [
      'Hanya berikan serangan basic attack terakhir (last hit) pada minion musuh saat HP-nya tersisa < 5%.',
      'Jangan pernah menggunakan skill area of effect (AoE) pada minion wave.',
      'Biarkan 2-3 minion ranged/mage musuh tetap hidup dan tahan badan (tanking) beberapa detik di luar turret kawan sampai wave minion kawan berikutnya tiba.',
      'Posisikan hero Anda di depan minion musuh untuk mengintimidasi lawan agar tidak berani mendekati zona EXP.',
    ],
    tacticalOutcome: 'Laner lawan kehilangan 40-60% potensi gold dan tertinggal 1 hingga 2 level. Mereka dipaksa melangkah jauh keluar dari perlindungan turret, menjadi sasaran empuk gank roamer/jungler kawan.',
    counterplay: 'Minta bantuan Roamer atau Mid Laner untuk datang dan meledakkan wave musuh bersama-sama (crash wave) agar siklus freeze terpecah dan me-reset ke tengah.',
  },
  {
    id: 'slow-push',
    name: 'SLOW PUSH (MINION AVALANCHE)',
    badge: 'THE GHOST 6TH PLAYER',
    icon: '🌊',
    difficulty: 'Advanced',
    color: 'border-blue-400/40 text-blue-400 bg-blue-400/10',
    definition: 'Membangun akumulasi gelombang minion kawan secara perlahan hingga menumpuk menjadi 2 sampai 3 wave (12-18 minion) yang secara bersamaan menyerbu turret musuh secara mandiri tanpa pengawalan hero.',
    howToExecute: [
      'Lakukan di lane yang berseberangan dengan objektif yang akan datang (contoh: slow push di Top Lane saat Lord akan spawn di Bottom Lane).',
      'Dekati minion wave musuh: BUNUH HANYA minion Ranged (Mage) dan minion Gerobak (Siege), BIARKAN minion Melee (jarak dekat) musuh tetap hidup.',
      'Minion melee musuh yang alot akan menahan minion kawan bertarung lebih lama, sehingga wave minion kawan berikutnya punya waktu untuk bergabung.',
      'Tinggalkan lane tersebut segera dan bergabunglah bersama tim Anda untuk memulai pertarungan di pit Lord.',
    ],
    tacticalOutcome: 'Dalam 60-90 detik ke depan, timbunan 15+ minion kawan akan menghancurkan turret musuh secara mandiri. Musuh terpaksa mengirim 1 pemain untuk bertahan (membuat kontes Lord menjadi 5v4) atau kehilangan inhibitor turret secara gratis.',
    counterplay: 'Kirim hero dengan skill clear jarak jauh instan (seperti Xavier/Yve/Moskov) untuk membersihkan wave tersebut sebelum tumpukannya melewati garis tengah map.',
  },
  {
    id: 'fast-push',
    name: 'FAST PUSH (TEMPO RESET)',
    badge: 'MAXIMUM ROTATION SPEED',
    icon: '⚡',
    difficulty: 'Beginner',
    color: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
    definition: 'Melenyapkan seluruh wave minion musuh secepat kilat (target < 3 detik) menggunakan semua skill AoE yang tersedia agar minion kawan langsung masuk ke dalam jangkauan turret musuh.',
    howToExecute: [
      'Keluarkan skill burst terkuat pada ketiga minion musuh begitu mereka berbaris rapi.',
      'Pastikan semua minion mati tanpa Anda kehilangan banyak HP.',
      'Segera setelah minion bersih, putuskan tindakan berikutnya: rotasi gank, ambil creep jungle, recall reset base, atau curi buff lawan.',
      'Jangan berdiam diri di lane menonton turret menembak minion kawan.',
    ],
    tacticalOutcome: 'Menciptakan "Free Window" selama 25-30 detik di mana Anda bebas bergerak ke area peta manapun tanpa takut kehilangan gold dan EXP dari lane sendiri.',
    counterplay: 'Bersihkan wave kawan dengan kecepatan yang sama agar Anda tidak terkurung di bawah turret.',
  },
  {
    id: 'proxy',
    name: 'PROXYING / CUT LANE (LINE CUTTING)',
    badge: 'HIGH RISK HIGH REWARD',
    icon: '🔪',
    difficulty: 'Pro Tournament',
    color: 'border-rose-400/40 text-rose-400 bg-rose-400/10',
    definition: 'Memotong dan membersihkan minion wave musuh di belakang Turret Luar (T1) atau di antara Turret T1 dan T2 musuh sebelum minion tersebut sempat mencapai garis laning normal.',
    howToExecute: [
      'Hanya lakukan jika Anda menggunakan hero dengan mobilitas tinggi atau durability ekstrem (contoh: Benedetta, Terizla, Yu Zhong, Paquito).',
      'Pastikan posisi Jungler dan Mid Laner musuh terlihat di minimap berada di tempat lain (jangan cut lane jika musuh sedang missing).',
      'Masuk ke celah antara Turret T1 dan T2 musuh, cegat minion yang baru berjalan keluar, bersihkan dalam 3 detik, lalu kabur lewat hutan musuh.',
    ],
    tacticalOutcome: 'Laner musuh terkurung di bawah turret mereka menunggu minion kawan yang masuk tanpa ada minion mereka sendiri untuk menahan. Anda mendapatkan keuntungan waktu 30+ detik untuk langsung melakukan gank ke mid lane atau mencuri jungle musuh.',
    counterplay: 'Jungler dan Roamer menjebak hero yang sedang melakukan proxy di celah sempit antara dua turret sebelum mereka sempat melarikan diri.',
  },
];

// ==========================================
// TALENT & EMBLEM SYNERGY MATRIX
// ==========================================

interface TalentPreset {
  id: string;
  name: string;
  roleTarget: string;
  emblem: string;
  tier1: string;
  tier2: string;
  tier3: string;
  bestHeroes: string[];
  synergyExplanation: string;
  coreItemSynergy: string[];
}

const TALENT_PRESETS: TalentPreset[] = [
  {
    id: 'burst-assassin',
    name: 'Lethal Executioner (Physical Burst)',
    roleTarget: 'Jungler / Assassin / Mid Burst',
    emblem: 'Assassin Emblem',
    tier1: 'Rupture (+5 Adaptive Penetration)',
    tier2: 'Seasoned Hunter (+15% Damage to Creep & Lord)',
    tier3: 'Killing Spree (Regen 8% HP & 15% Movement on Kill)',
    bestHeroes: ['Ling', 'Hayabusa', 'Nolan', 'Lancelot', 'Saber'],
    synergyExplanation: 'Kombinasi Seasoned Hunter menjamin Retribution damage optimal melawan Turtle/Lord, sementara Killing Spree memulihkan HP instan dan memberi speed boost setelah membunuh carry musuh untuk keluar dari teamfight dengan selamat.',
    coreItemSynergy: ['Blade of the Heptaseas', 'Hunter Strike', 'Blade of Despair', 'Malefic Roar'],
  },
  {
    id: 'sustain-fighter',
    name: 'War Veteran (Raidboss Sustain)',
    roleTarget: 'EXP Laner / Fighter Bruiser',
    emblem: 'Fighter / Tank Emblem',
    tier1: 'Thrill (+16 Adaptive Attack) / Vitality (+225 HP)',
    tier2: 'Festival of Blood (Up to 10% Spell Vamp)',
    tier3: 'Brave Smite (Heal 4% Max HP on Skill Damage, CD 6s)',
    bestHeroes: ['Terizla', 'Yu Zhong', 'Ruby', 'Thamuz', 'Lapu-Lapu'],
    synergyExplanation: 'Festival of Blood memberikan spell vamp berkelanjutan saat membunuh hero/minion, dipadukan dengan Brave Smite yang memulihkan ribuan HP setiap kali meluncurkan skill CC ke kerumunan musuh.',
    coreItemSynergy: ['War Axe', 'Brute Force Breastplate', 'Dominance Ice', 'Oracle', 'Queen\'s Wings'],
  },
  {
    id: 'poke-burst-mage',
    name: 'Ignition Burn (Artillery Mage)',
    roleTarget: 'Mid Laner / Magic Carry',
    emblem: 'Mage Emblem',
    tier1: 'Inspire (+5% Cooldown Reduction)',
    tier2: 'Bargain Hunter (Item Diskon 5%) / Wilderness Blessing',
    tier3: 'Lethal Ignition (Deal 7% Max HP Damage 3x triggers 162-750 adaptive explosion)',
    bestHeroes: ['Pharsa', 'Vexana', 'Xavier', 'Yve', 'Nana', 'Kadita'],
    synergyExplanation: 'Lethal Ignition meledak saat melancarkan rangkaian kombo skill dalam 5 detik, menghabisi sisa HP marksman/assassin musuh yang berusaha kabur.',
    coreItemSynergy: ['Glowing Wand', 'Genius Wand', 'Holy Crystal', 'Divine Glaive', 'Lightning Truncheon'],
  },
  {
    id: 'trinity-marksman',
    name: 'Quantum Velocity (Kiting DPS)',
    roleTarget: 'Gold Laner / Marksman Carry',
    emblem: 'Marksman / Assassin Emblem',
    tier1: 'Swift (+10% Attack Speed) / Fatal (+5% Crit Rate)',
    tier2: 'Weapons Master (+5% Extra Attack) / Tenacity (Defense when low HP)',
    tier3: 'Quantum Charge (Basic Attack gives 30% Movement Speed & Heals HP)',
    bestHeroes: ['Claude', 'Moskov', 'Karrie', 'Wanwan', 'Beatrix', 'Miya'],
    synergyExplanation: 'Quantum Charge memberikan movement speed instan dan regenerasi HP setiap beberapa detik saat melepaskan basic attack, memungkinkan kiting (stutter-step) sempurna tanpa tersentuh tank lawan.',
    coreItemSynergy: ['Demon Hunter Sword', 'Golden Staff', 'Corrosion Scythe', 'Wind of Nature', 'Rose Gold Meteor'],
  },
  {
    id: 'frontline-tank',
    name: 'Unbreakable Bastion (Crowd Controller)',
    roleTarget: 'Roamer / Main Tank',
    emblem: 'Tank / Support Emblem',
    tier1: 'Firmness (+6 Physical Defense) / Vitality (+225 HP)',
    tier2: 'Tenacity (+15 Physical & Magic Defense when HP < 50%)',
    tier3: 'Focus Fire (Damage to enemy increases ally damage by 6%) / Brave Smite',
    bestHeroes: ['Tigreal', 'Hylos', 'Belerick', 'Khufra', 'Minotaur', 'Grock'],
    synergyExplanation: 'Tenacity membuat tank menjadi monster tahan pukul di bawah 50% HP. Dipadukan dengan Focus Fire, musuh yang terkena crowd control menerima 6% damage ekstra dari seluruh anggota tim Anda.',
    coreItemSynergy: ['Dominance Ice', 'Athena\'s Shield', 'Antique Cuirass', 'Blade Armor', 'Immortality'],
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MlbbGuidesPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'roles' | 'waves' | 'talents' | 'checklist'>('timeline');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('lord-1200');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('roamer');
  const [selectedWaveId, setSelectedWaveId] = useState<string>('freeze');
  const [selectedTalentPresetId, setSelectedTalentPresetId] = useState<string>('burst-assassin');

  // Active items
  const activeObjective = useMemo(() => {
    return OBJECTIVE_TIMELINE.find((o) => o.id === selectedObjectiveId) || OBJECTIVE_TIMELINE[0];
  }, [selectedObjectiveId]);

  const activeRole = useMemo(() => {
    return ROLE_MASTERCLASSES.find((r) => r.id === selectedRoleId) || ROLE_MASTERCLASSES[0];
  }, [selectedRoleId]);

  const activeWave = useMemo(() => {
    return WAVE_PROTOCOLS.find((w) => w.id === selectedWaveId) || WAVE_PROTOCOLS[0];
  }, [selectedWaveId]);

  const activeTalent = useMemo(() => {
    return TALENT_PRESETS.find((t) => t.id === selectedTalentPresetId) || TALENT_PRESETS[0];
  }, [selectedTalentPresetId]);

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Navbar activeSection="mlbb" />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* BREADCRUMB & METADATA */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-8 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              BERANDA
            </Link>
            <span>/</span>
            <Link href="/mlbb/heroes" className="hover:text-amber-400 transition-colors">
              MLBB META
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">STRATEGY & MACRO CODEX</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              S34 TOURNAMENT MANUAL
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline font-mono text-[11px]">
              MPL ID STANDARDS
            </span>
          </div>
        </div>

        {/* HERO TITLE BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-slate-950 p-6 sm:p-8 mb-8 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-3">
              <span>PRO ESPORTS PLAYBOOK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans mb-3">
              MACRO STRATEGY & LANING CODEX
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans mb-5">
              Buku panduan taktik kompetitif MPL: Kalkulator waktu objektif map, simulasi perhitungan damage Retribution, 5 Role Masterclasses, dan formula manipulasi minion wave untuk mendominasi pertandingan.
            </p>

            {/* QUICK LINK PILLS */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                href="/mlbb/draft"
                className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-bold text-slate-300 hover:border-amber-400/50 hover:text-white transition-all"
              >
                <span>⚔️</span>
                <span>5v5 Draft Simulator</span>
              </Link>
              <Link
                href="/mlbb/counter-pick"
                className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-bold text-slate-300 hover:border-rose-400/50 hover:text-white transition-all"
              >
                <span>🎯</span>
                <span>Counter-Pick Finder</span>
              </Link>
              <Link
                href="/mlbb/tier-list"
                className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-bold text-slate-300 hover:border-emerald-400/50 hover:text-white transition-all"
              >
                <span>🏆</span>
                <span>Meta Tier List</span>
              </Link>
              <Link
                href="/mlbb/builder"
                className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-800/60 px-3 py-1.5 text-xs font-mono font-bold text-slate-300 hover:border-cyan-400/50 hover:text-white transition-all"
              >
                <span>🛠️</span>
                <span>Build Workshop</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PRIMARY CODEX NAVIGATION TABS */}
        <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar gap-2 mb-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <span>⏱️</span>
            <span>1. MAP TIMELINE & RETRI MATH</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
              activeTab === 'roles'
                ? 'border-rose-400 text-rose-400 bg-rose-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <span>🥋</span>
            <span>2. 5 ROLE MASTERCLASSES</span>
          </button>

          <button
            onClick={() => setActiveTab('waves')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
              activeTab === 'waves'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <span>🌊</span>
            <span>3. WAVE MANAGEMENT (4 TYPES)</span>
          </button>

          <button
            onClick={() => setActiveTab('talents')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
              activeTab === 'talents'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <span>💎</span>
            <span>4. TALENT & EMBLEM MATRIX</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-all ${
              activeTab === 'checklist'
                ? 'border-indigo-400 text-indigo-400 bg-indigo-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <span>📋</span>
            <span>5. TOURNAMENT MATCH CHECKLIST</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MAP OBJECTIVE TIMELINE & RETRI CALCULATOR        */}
        {/* ======================================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            {/* TIMELINE HORIZONTAL SCROLLER BAR */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  CHOOSE OBJECTIVE TIMESTAMP (0:00 - 18:00+)
                </span>
                <span className="text-amber-400 font-bold">
                  ACTIVE: {activeObjective.timeString}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {OBJECTIVE_TIMELINE.map((obj) => {
                  const isSelected = obj.id === selectedObjectiveId;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setSelectedObjectiveId(obj.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/15 text-white shadow-lg shadow-amber-400/10 scale-105'
                          : 'border-white/10 bg-slate-800/40 text-slate-400 hover:border-white/25 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg mb-1">{obj.icon}</span>
                      <span className="font-mono text-[11px] font-bold text-amber-400">
                        {obj.timeString.split(' ')[0]}
                      </span>
                      <span className="text-[9px] line-clamp-1 text-slate-300 font-sans mt-0.5">
                        {obj.title.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OBJECTIVE DEEP-DIVE CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT / MAIN STAGE CARD (8 COLS) */}
              <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 backdrop-blur-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30">
                      {activeObjective.icon}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                        TIMESTAMP // {activeObjective.timeString}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
                        {activeObjective.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right font-mono">
                      <div className="text-[10px] text-slate-400 uppercase">RETRIBUTION SMITE</div>
                      <div className="text-lg font-black text-emerald-400 tabular-nums">
                        {activeObjective.retributionDamage.toLocaleString()} HP
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUMMARY */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    EXECUTIVE SUMMARY // MAKSUD & TUJUAN FASE
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeObjective.summary}
                  </p>
                </div>

                {/* KEY TACTICS */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <span>⚡</span>
                    <span>STANDAR EKSEKUSI TAKTIKAL TIM (MPL GUIDELINES)</span>
                  </h3>
                  <div className="space-y-2.5">
                    {activeObjective.keyTactics.map((tactic, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-300"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-400 font-mono">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{tactic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5 ROLE RESPONSIBILITIES AT THIS OBJECTIVE */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                    <span>🧭</span>
                    <span>PERAN & TUGAS SPESIFIK 5 ROLE</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-amber-400/20 bg-amber-400/5">
                      <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                        <span>🛡️</span>
                        <span>ROAMER:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {activeObjective.roleResponsibilities.roam}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-rose-400/20 bg-rose-400/5">
                      <div className="font-mono font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                        <span>🗡️</span>
                        <span>JUNGLER:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {activeObjective.roleResponsibilities.jungle}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5">
                      <div className="font-mono font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                        <span>🧙</span>
                        <span>MID LANER:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {activeObjective.roleResponsibilities.mid}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-amber-300/20 bg-amber-300/5">
                      <div className="font-mono font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                        <span>🏹</span>
                        <span>GOLD LANER:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {activeObjective.roleResponsibilities.gold}
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5">
                      <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                        <span>🥋</span>
                        <span>EXP LANER:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {activeObjective.roleResponsibilities.exp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CRITICAL MISTAKE TO AVOID */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                    <span>⚠️</span>
                    <span>FATAL MISTAKE (BLUNDER YANG HARUS DIHINDARI)</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {activeObjective.criticalMistake}
                  </p>
                </div>
              </div>

              {/* RIGHT / RETRIBUTION FORMULA & MAP TELEMETRY (4 COLS) */}
              <div className="lg:col-span-4 space-y-6">
                {/* RETRI SCALING MATRIX */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      RETRIBUTION MATH SCALING
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">LEVEL 1 - 15</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Retribution memberikan True Damage ke monster jungle. Rumus resmi Moonton: <strong className="text-white font-mono">Damage = 1.000 + (Hero Level × 80)</strong>.
                  </p>

                  <div className="space-y-1.5 font-mono text-xs">
                    {[
                      { lv: 'Lv 1', dmg: '1.080 HP', note: 'Start Game' },
                      { lv: 'Lv 4', dmg: '1.320 HP', note: 'Turtle 1 Target' },
                      { lv: 'Lv 8', dmg: '1.640 HP', note: 'Turtle 3 Target' },
                      { lv: 'Lv 10', dmg: '1.800 HP', note: 'Lord 1 Target' },
                      { lv: 'Lv 12', dmg: '1.960 HP', note: 'Enhanced Lord' },
                      { lv: 'Lv 15', dmg: '2.200 HP', note: 'Max Evolved Lord' },
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded ${
                          row.note.includes('Target') || row.note.includes('Enhanced') || row.note.includes('Max')
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold'
                            : 'bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        <span className="text-slate-400">{row.lv}</span>
                        <span className="text-white font-bold">{row.dmg}</span>
                        <span className="text-[10px] text-slate-500">{row.note}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg border border-amber-400/20 bg-amber-400/5 text-[11px] text-amber-200/90 leading-relaxed">
                    💡 <strong>Pro Tip:</strong> Kombinasikan Retribution dengan skill burst ber-damage 1.000+ (contoh: Lancelot S2 atau Hayabusa S1) pada 3.000 HP. Lawan tidak akan sempat merebut karena HP monster akan drop seketika dalam 0.1 detik!
                  </div>
                </div>

                {/* OBJECTIVE RESPAWN TIMER RULES */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl font-mono text-xs space-y-3">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-white/10 pb-2">
                    RESPAWN CYCLES // SIKLUS RESPAWN
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Turtle Respawn:</span>
                      <span className="font-bold text-white">2 Menit setelah mati</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Turtle Max Spawn:</span>
                      <span className="font-bold text-white">3 Kali (Hingga 07:59)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lord 1 Spawn:</span>
                      <span className="font-bold text-amber-400">Tepat di 08:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lord Respawn:</span>
                      <span className="font-bold text-white">3 Menit setelah mati</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Enhanced Lord:</span>
                      <span className="font-bold text-cyan-400">Mulai Menit 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Evolved Lord:</span>
                      <span className="font-bold text-purple-400">Mulai Menit 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Buff Creep Respawn:</span>
                      <span className="font-bold text-white">90 Detik setelah mati</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: 5 ROLE MASTERCLASSES                             */}
        {/* ======================================================== */}
        {activeTab === 'roles' && (
          <div className="space-y-8">
            {/* ROLE SELECTOR CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {ROLE_MASTERCLASSES.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `${role.border} bg-slate-800/80 text-white shadow-xl scale-105`
                        : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{role.icon}</span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      {role.name.split('/')[0].trim()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                      {role.tagline}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* DETAILED ROLE GUIDE SECTION */}
            <div className={`rounded-2xl border ${activeRole.border} bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl space-y-7`}>
              {/* HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-3 rounded-xl bg-slate-950 border border-white/10">
                    {activeRole.icon}
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      ROLE MASTERCLASS // {activeRole.tagline}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase">
                      {activeRole.name}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">SPELLS:</span>
                  {activeRole.recommendedSpells.map((sp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-white">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* IDEAL MINDSET QUOTE */}
              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60 font-sans italic text-sm text-slate-200 border-l-4 border-l-amber-400">
                "{activeRole.idealMindset}"
              </div>

              {/* CORE ARCHETYPES */}
              <div>
                <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🧩</span>
                  <span>SUB-ARCHETYPE & HERO META S34</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRole.coreArchetypes.map((arch, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 text-xs">
                      <div className="font-mono font-bold text-white text-sm mb-1">{arch.name}</div>
                      <p className="text-slate-400 leading-relaxed mb-2">{arch.desc}</p>
                      <div className="text-[11px] font-mono text-amber-300">
                        <strong>Top Picks:</strong> {arch.heroes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EARLY GAME STRATEGY */}
              <div>
                <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🌅</span>
                  <span>EARLY GAME ROTATION (00:00 - 05:00)</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  {activeRole.earlyGameStrategy.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-slate-950/30">
                      <span className="font-mono font-bold text-cyan-400 text-xs">{idx + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MID/LATE TEAMFIGHT GUIDE */}
              <div>
                <h3 className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>⚔️</span>
                  <span>MID & LATE GAME TEAMFIGHT EXECUTION</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  {activeRole.midLateTeamfightGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-slate-950/30">
                      <span className="font-mono font-bold text-rose-400 text-xs">✓</span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRO MICRO TIPS */}
              <div>
                <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>MICRO TRICKS & IN-GAME MECHANICS</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  {activeRole.proMicroTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                      <span className="font-mono font-bold text-emerald-400 text-xs">★</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WAVE MANAGEMENT PROTOCOLS (4 TYPES)              */}
        {/* ======================================================== */}
        {activeTab === 'waves' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {WAVE_PROTOCOLS.map((w) => {
                const isSelected = w.id === selectedWaveId;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWaveId(w.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${w.color} shadow-lg scale-105`
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{w.icon}</span>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">
                        {w.difficulty}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-sm text-white">{w.name.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{w.badge}</div>
                  </button>
                );
              })}
            </div>

            {/* WAVE PROTOCOL DETAIL */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-3 rounded-xl bg-slate-950 border border-white/10">
                    {activeWave.icon}
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      WAVE PROTOCOL // {activeWave.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase">
                      {activeWave.name}
                    </h2>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-slate-800 border border-white/10 text-amber-400">
                  DIFFICULTY: {activeWave.difficulty.toUpperCase()}
                </span>
              </div>

              {/* DEFINITION */}
              <div>
                <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  DEFINISI STRATEGIS
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeWave.definition}
                </p>
              </div>

              {/* HOW TO EXECUTE */}
              <div>
                <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🛠️</span>
                  <span>CARA EKSEKUSI LANGKAH DEMI LANGKAH</span>
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300">
                  {activeWave.howToExecute.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-slate-950/40">
                      <span className="font-mono font-bold text-amber-400 text-xs shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/30">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OUTCOME & COUNTERPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>DAMPAK STRATEGIS // HASIL AKHIR:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeWave.tacticalOutcome}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <div className="font-mono font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>CARA COUNTER // SOLUSI LAWAN:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeWave.counterplay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TALENT & EMBLEM MATRIX                            */}
        {/* ======================================================== */}
        {activeTab === 'talents' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {TALENT_PRESETS.map((t) => {
                const isSelected = t.id === selectedTalentPresetId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTalentPresetId(t.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-400/10 text-white shadow-lg scale-105'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold mb-1">
                      {t.roleTarget.split('/')[0]}
                    </div>
                    <div className="font-mono font-bold text-xs text-white line-clamp-1">{t.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{t.emblem}</div>
                  </button>
                );
              })}
            </div>

            {/* TALENT DETAIL PRESET */}
            <div className="rounded-2xl border border-emerald-400/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    EMBLEM BUILD // {activeTalent.roleTarget}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase">
                    {activeTalent.name}
                  </h2>
                </div>

                <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-slate-800 border border-white/10 text-amber-400">
                  BASE: {activeTalent.emblem}
                </span>
              </div>

              {/* 3 TIERS VISUAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">TIER 1 (STAT BOOST)</div>
                  <div className="text-white font-bold text-sm mb-1">{activeTalent.tier1.split('(')[0]}</div>
                  <div className="text-emerald-400 text-xs">({activeTalent.tier1.split('(')[1]}</div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">TIER 2 (PLAYSTYLE PERK)</div>
                  <div className="text-white font-bold text-sm mb-1">{activeTalent.tier2.split('(')[0]}</div>
                  <div className="text-cyan-400 text-xs">({activeTalent.tier2.split('(')[1]}</div>
                </div>

                <div className="p-4 rounded-xl border border-amber-400/30 bg-amber-400/5">
                  <div className="text-[10px] text-amber-400 uppercase font-bold mb-1">TIER 3 (CORE KEYSTONE)</div>
                  <div className="text-amber-300 font-bold text-sm mb-1">{activeTalent.tier3.split('(')[0]}</div>
                  <div className="text-slate-300 text-xs">({activeTalent.tier3.split('(')[1]}</div>
                </div>
              </div>

              {/* SYNERGY EXPLANATION */}
              <div>
                <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  PENJELASAN SINERGI TEKNIS
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {activeTalent.synergyExplanation}
                </p>
              </div>

              {/* RECOMMENDED HEROES & ITEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40">
                  <div className="text-amber-400 font-bold mb-2 uppercase flex items-center gap-1.5">
                    <span>👑</span>
                    <span>BEST USER HEROES:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeTalent.bestHeroes.map((hero, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-white">
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40">
                  <div className="text-cyan-400 font-bold mb-2 uppercase flex items-center gap-1.5">
                    <span>📦</span>
                    <span>CORE ITEM SYNERGIES:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeTalent.coreItemSynergy.map((it, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-slate-200">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: TOURNAMENT MATCH CHECKLIST                       */}
        {/* ======================================================== */}
        {activeTab === 'checklist' && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
                PRE-MATCH & IN-GAME PROTOCOLS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase">
                MPL MATCH PREPARATION CHECKLIST
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-1">
                Gunakan checklist ini saat latihan scrim atau turnamen resmi untuk memastikan tidak ada pilar makro yang terlewatkan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40 space-y-3">
                <div className="font-mono font-bold text-amber-400 uppercase flex items-center gap-2">
                  <span>1.</span>
                  <span>Fase Drafting & Komposisi Tim</span>
                </div>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-amber-400 focus:ring-0" />
                  <span>Apakah tim memiliki minimal 2 sumber Crowd Control Hard (Stun / Knock-up)?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-amber-400 focus:ring-0" />
                  <span>Apakah komposisi seimbang antara Physical Damage dan Magic Damage (mencegah musuh build armor satu jenis)?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-amber-400 focus:ring-0" />
                  <span>Apakah pick hero Gold Laner aman dari potensi dive Assassin musuh?</span>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40 space-y-3">
                <div className="font-mono font-bold text-rose-400 uppercase flex items-center gap-2">
                  <span>2.</span>
                  <span>Early Game & Lithowanderer</span>
                </div>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-rose-400 focus:ring-0" />
                  <span>Semak buff jungle yang rawan invade sudah di-check di menit 00:15?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-rose-400 focus:ring-0" />
                  <span>Mid laner sudah clear wave 1 dalam waktu kurang dari 4 detik?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-rose-400 focus:ring-0" />
                  <span>Posisi Jungler lawan sudah terdeteksi di minimap sebelum menit 01:30?</span>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40 space-y-3">
                <div className="font-mono font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <span>3.</span>
                  <span>Turtle & Objective Fights</span>
                </div>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-cyan-400 focus:ring-0" />
                  <span>Roamer dan Mid sudah menguasai semak pit 15 detik sebelum Turtle spawn?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-cyan-400 focus:ring-0" />
                  <span>Jungler sudah mencapai level 4 dan memiliki Retribution siap pakai?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-cyan-400 focus:ring-0" />
                  <span>Tidak ada pemain yang masuk ke dalam pit secara bersamaan (cegah AoE wipe)?</span>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40 space-y-3">
                <div className="font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <span>4.</span>
                  <span>Lord Sieging & Base Defense</span>
                </div>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-emerald-400 focus:ring-0" />
                  <span>Minion wave di 3 lane sudah di-push melewati sungai sebelum memulai Lord?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-emerald-400 focus:ring-0" />
                  <span>Carry sudah membeli item survivabilitas (WoN / Winter Crown / Immortality)?</span>
                </label>
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-800 text-emerald-400 focus:ring-0" />
                  <span>Tim tidak overchase ke arah fountain lawan saat menyerang inhibitor turret?</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
