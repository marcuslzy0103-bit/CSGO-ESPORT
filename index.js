/**
 * COUNTER-MANAGER 2026 PRO // CS:GO & CS2 ESPORTS SIMULATION ENGINE
 * Full Engine: AI Opponents, Season Calendar, Training Perks, Chemistry, BO3 Major, HLTV Stats, MVP Hall of Fame
 */

const STORAGE_KEY = 'cs_manager_save_v5';
const MAP_POOL = ['de_inferno', 'de_mirage', 'de_nuke', 'de_anubis', 'de_ancient', 'de_dust2', 'de_vertigo'];

/* ==========================================================================
   TEAM AI PROFILES — 每支战队的独特战术风格与明星选手
   ========================================================================== */
const TEAM_PROFILES = {
  'Natus Vincere': { style: 'awp_heavy', avgAim: 93, avgSense: 91, avgClutch: 94, star: 's1mple', region: '🇺🇦 Ukraine', points: 985 },
  'Team Vitality':  { style: 'balanced',  avgAim: 92, avgSense: 95, avgClutch: 93, star: 'ZywOo',  region: '🇫🇷 France', points: 940 },
  'FaZe Clan':      { style: 'firepower', avgAim: 95, avgSense: 88, avgClutch: 90, star: 'rain',   region: '🇪🇺 Europe', points: 890 },
  'G2 Esports':     { style: 'tactical',  avgAim: 90, avgSense: 94, avgClutch: 88, star: 'NiKo',   region: '🇪🇺 Europe', points: 850 },
  'MOUZ':           { style: 'aggressive', avgAim: 91, avgSense: 87, avgClutch: 89, star: 'frozen', region: '🇪🇺 Europe', points: 810 },
  'Astralis':       { style: 'defensive', avgAim: 87, avgSense: 96, avgClutch: 86, star: 'dev1ce', region: '🇩🇰 Denmark', points: 760 },
  'Heroic':         { style: 'tactical',  avgAim: 88, avgSense: 91, avgClutch: 85, star: 'stavn',  region: '🇩🇰 Denmark', points: 720 },
  'FURIA Esports':  { style: 'aggressive', avgAim: 89, avgSense: 85, avgClutch: 87, star: 'KSCERATO', region: '🇧🇷 Brazil', points: 680 },
  'Cloud9':         { style: 'balanced',  avgAim: 88, avgSense: 89, avgClutch: 86, star: 'HObbit', region: '🇺🇸 NA', points: 620 },
  'ENCE':           { style: 'tactical',  avgAim: 86, avgSense: 90, avgClutch: 84, star: 'dycha',  region: '🇪🇺 Europe', points: 580 },
  'Liquid':         { style: 'balanced',  avgAim: 87, avgSense: 88, avgClutch: 85, star: 'NAF',    region: '🇺🇸 NA', points: 560 },
  'Complexity':     { style: 'aggressive', avgAim: 84, avgSense: 83, avgClutch: 82, star: 'JT',    region: '🇺🇸 NA', points: 420 },
};
const TEAM_NAMES = Object.keys(TEAM_PROFILES);

/* ==========================================================================
   PERK DEFINITIONS — 选手特长 Perk 技能树
   ========================================================================== */
const PERK_DEFS = {
  'AWP Specialist':  { stat: 'aim',      boost: 5, cost: 5, req: { aim: 85 },      icon: '🔭', desc: 'AWP 命中率 +5' },
  'Clutch God':      { stat: 'clutch',   boost: 6, cost: 5, req: { clutch: 85 },   icon: '🧊', desc: '1vN 残局心态 +6' },
  'IGL Mastermind':  { stat: 'sense',    boost: 5, cost: 4, req: { sense: 88 },     icon: '🧠', desc: '全队战术读图 +5' },
  'Entry Machine':   { stat: 'aim',      boost: 4, cost: 4, req: { aim: 82 },       icon: '💥', desc: '首杀火力突破 +4' },
  'Smoke Criminal':  { stat: 'sense',    boost: 4, cost: 3, req: { sense: 80 },     icon: '💨', desc: '投掷物利用率 +4' },
  'Speed Demon':     { stat: 'movement', boost: 5, cost: 3, req: { movement: 82 },  icon: '⚡', desc: '极限身法走位 +5' },
};

/* ==========================================================================
   DEFAULT GAME STATE — 完整默认游戏状态
   ========================================================================== */
const defaultGameState = {
  club: { name: 'CYBER WOLVES CS', region: '🇲🇾 Malaysia', coach: 'Marcus', budget: 100000, rank: 18, wins: 0, losses: 0 },
  trainingPoints: 15,
  tacticStyle: 'balanced',
  matchesPlayed: 0,
  roster: [
    { id: 'p1', name: 'Marcus',  role: 'AWPer',  aim: 88, sense: 85, clutch: 90, movement: 84, morale: 95, salary: 4500, value: 35000, perks: [], chemistry: 100, joinedAt: 0 },
    { id: 'p2', name: 'Vortex',  role: 'IGL',    aim: 80, sense: 92, clutch: 82, movement: 78, morale: 90, salary: 3800, value: 28000, perks: [], chemistry: 100, joinedAt: 0 },
    { id: 'p3', name: 'Blaze',   role: 'Entry',  aim: 89, sense: 79, clutch: 80, movement: 88, morale: 88, salary: 3600, value: 26000, perks: [], chemistry: 100, joinedAt: 0 },
    { id: 'p4', name: 'Shadow',  role: 'Support',aim: 82, sense: 86, clutch: 84, movement: 80, morale: 92, salary: 3200, value: 22000, perks: [], chemistry: 100, joinedAt: 0 },
    { id: 'p5', name: 'Echo',    role: 'Lurker', aim: 85, sense: 88, clutch: 89, movement: 85, morale: 90, salary: 3400, value: 24000, perks: [], chemistry: 100, joinedAt: 0 }
  ],
  bench: [],
  market: [
    { id: 'm1', name: 's1mple_fan',   role: 'AWPer', aim: 96, sense: 94, clutch: 95, movement: 92, morale: 95, salary: 8500, value: 75000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'm2', name: 'ZywOo_JR',     role: 'AWPer', aim: 95, sense: 96, clutch: 94, movement: 90, morale: 96, salary: 8200, value: 72000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'm3', name: 'NiKo_Rifle',   role: 'Entry', aim: 97, sense: 90, clutch: 88, movement: 91, morale: 90, salary: 7800, value: 68000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'm4', name: 'ropz_Lurk',    role: 'Lurker',aim: 92, sense: 97, clutch: 96, movement: 89, morale: 94, salary: 7500, value: 65000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'm5', name: 'm0NESY_Flick', role: 'AWPer', aim: 95, sense: 92, clutch: 93, movement: 95, morale: 92, salary: 7900, value: 70000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'm6', name: 'b1t_OneTap',   role: 'Entry', aim: 94, sense: 88, clutch: 86, movement: 87, morale: 90, salary: 5500, value: 45000, perks: [], chemistry: 50, joinedAt: -1 }
  ],
  academy: [
    { id: 'a1', name: 'Rookie_Ace',  role: 'Entry',  aim: 72, sense: 68, clutch: 70, movement: 75, morale: 98, salary: 1200, value: 8000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'a2', name: 'Junior_AWP',  role: 'AWPer',  aim: 74, sense: 65, clutch: 68, movement: 70, morale: 95, salary: 1000, value: 6000, perks: [], chemistry: 50, joinedAt: -1 },
    { id: 'a3', name: 'NewBlood_IGL',role: 'IGL',    aim: 68, sense: 76, clutch: 72, movement: 67, morale: 97, salary: 1100, value: 7000, perks: [], chemistry: 50, joinedAt: -1 },
  ],
  season: { phase: 'league', matchIndex: 0, calendar: [] },
  playerStats: {},
  trophies: [],
  hltvRankings: [],
  currentMatch: null
};

let gameState = null;
let autoPlayInterval = null;

/* ==========================================================================
   INIT — 游戏初始化
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  initTabs();
  initEvents();
  renderAll();
});

/* ==========================================================================
   1. STORAGE — 存档控制器
   ========================================================================== */
function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  showToast('游戏进度已自动保存！💾');
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      gameState = JSON.parse(saved);
      migrateState();
    } catch (e) { resetToDefault(); }
  } else { resetToDefault(); }
  if (!gameState.season.calendar.length) generateSeasonCalendar();
  if (!gameState.currentMatch) advanceToNextMatch();
}

function resetToDefault() {
  gameState = JSON.parse(JSON.stringify(defaultGameState));
  initPlayerStats();
  buildHltvRankings();
  generateSeasonCalendar();
}

function migrateState() {
  if (!gameState.bench) gameState.bench = [];
  if (!gameState.academy) gameState.academy = defaultGameState.academy;
  if (!gameState.season) gameState.season = { phase: 'league', matchIndex: 0, calendar: [] };
  if (!gameState.playerStats) { gameState.playerStats = {}; initPlayerStats(); }
  if (!gameState.trophies) gameState.trophies = [];
  if (gameState.trainingPoints === undefined) gameState.trainingPoints = 15;
  if (gameState.matchesPlayed === undefined) gameState.matchesPlayed = 0;
  gameState.roster.forEach(p => {
    if (!p.perks) p.perks = [];
    if (p.chemistry === undefined) p.chemistry = 100;
    if (p.joinedAt === undefined) p.joinedAt = 0;
  });
  if (!gameState.hltvRankings || !gameState.hltvRankings.length) buildHltvRankings();
}

function initPlayerStats() {
  gameState.roster.forEach(p => {
    if (!gameState.playerStats[p.id]) {
      gameState.playerStats[p.id] = { kills: 0, deaths: 0, rounds: 0, clutchWins: 0, clutchAttempts: 0 };
    }
  });
}

function buildHltvRankings() {
  gameState.hltvRankings = TEAM_NAMES.map((name, i) => ({
    rank: i + 1, name, region: TEAM_PROFILES[name].region, points: TEAM_PROFILES[name].points, winLoss: '0-0'
  }));
  // Insert user club
  gameState.hltvRankings.push({
    rank: gameState.club.rank, name: gameState.club.name, region: gameState.club.region,
    points: 340, winLoss: `${gameState.club.wins}-${gameState.club.losses}`
  });
  gameState.hltvRankings.sort((a, b) => b.points - a.points);
  gameState.hltvRankings.forEach((r, i) => r.rank = i + 1);
}

function showToast(msg) {
  const toast = document.getElementById('game-toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.remove('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
  }, 2800);
}

/* ==========================================================================
   2. TAB SYSTEM — Tab 导航
   ========================================================================== */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });
  document.querySelectorAll('[data-tab-goto]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab-goto')));
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('hidden', c.id !== `tab-${tabId}`);
  });
}

/* ==========================================================================
   3. EVENTS — 事件监听
   ========================================================================== */
function initEvents() {
  document.getElementById('btn-save-game')?.addEventListener('click', saveGame);

  // New Club Modal
  const modal = document.getElementById('modal-new-club');
  document.getElementById('btn-new-club')?.addEventListener('click', () => modal?.classList.remove('hidden'));
  document.getElementById('modal-close-btn')?.addEventListener('click', () => modal?.classList.add('hidden'));

  document.getElementById('form-new-club')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-club-name').value.trim();
    if (!name) return;
    gameState.club.name = name.toUpperCase();
    gameState.club.region = document.getElementById('input-club-region').value;
    gameState.club.coach = document.getElementById('input-coach-name').value.trim() || 'Marcus';
    gameState.club.budget = 100000; gameState.club.wins = 0; gameState.club.losses = 0; gameState.club.rank = 18;
    gameState.trainingPoints = 15; gameState.matchesPlayed = 0; gameState.bench = []; gameState.trophies = [];
    gameState.roster.forEach(p => { p.chemistry = 100; p.perks = []; p.joinedAt = 0; });
    initPlayerStats(); buildHltvRankings(); generateSeasonCalendar(); advanceToNextMatch();
    saveGame(); renderAll(); modal?.classList.add('hidden');
    showToast(`战队 [${gameState.club.name}] 正式创立！征战 Major 之路开始！`);
  });

  // Tactic select
  document.getElementById('select-tactic-style')?.addEventListener('change', (e) => {
    gameState.tacticStyle = e.target.value; saveGame();
    showToast(`战术调整为: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Buy TP
  document.getElementById('btn-buy-tp')?.addEventListener('click', () => {
    if (gameState.club.budget < 10000) { showToast('资金不足！需要 $10,000 购买训练营课时。'); return; }
    gameState.club.budget -= 10000; gameState.trainingPoints += 5;
    saveGame(); renderAll(); showToast('成功购买 5 TP 训练点数！可用于强化选手属性。');
  });

  // Match buttons
  document.getElementById('dash-btn-play')?.addEventListener('click', () => switchTab('match'));
  document.getElementById('btn-sim-round')?.addEventListener('click', simulateRound);
  document.getElementById('btn-sim-auto')?.addEventListener('click', autoPlayMatch);
  document.getElementById('btn-reset-match')?.addEventListener('click', () => {
    stopAutoPlay(); advanceToNextMatch(); renderAll();
    showToast(`下一场比赛已准备就绪！`);
  });
}

/* ==========================================================================
   4. SEASON CALENDAR — 赛季日历系统
   ========================================================================== */
const PHASE_CONFIG = {
  league:          { label: '🟢 联赛 (League)',          count: 6, format: 'BO1' },
  qualifiers:      { label: '🟡 资格赛 (Qualifiers)',    count: 3, format: 'BO1' },
  major_groups:    { label: '🔵 Major 小组赛 (Groups)',   count: 3, format: 'BO1' },
  major_playoffs:  { label: '🏆 Major 淘汰赛 (Playoffs)',count: 3, format: 'BO3' },
};
const PHASE_ORDER = ['league', 'qualifiers', 'major_groups', 'major_playoffs'];

function generateSeasonCalendar() {
  const cal = [];
  const shuffled = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
  let idx = 0;
  PHASE_ORDER.forEach(phase => {
    const cfg = PHASE_CONFIG[phase];
    for (let i = 0; i < cfg.count; i++) {
      cal.push({ opponent: shuffled[idx % shuffled.length], phase, format: cfg.format, result: null, score: null });
      idx++;
    }
  });
  gameState.season = { phase: 'league', matchIndex: 0, calendar: cal };
}

function getCurrentSeasonMatch() {
  return gameState.season.calendar[gameState.season.matchIndex] || null;
}

function advanceToNextMatch() {
  const sm = getCurrentSeasonMatch();
  if (!sm) { endSeason(); return; }
  gameState.season.phase = sm.phase;
  initNewMatch(sm.opponent, sm.format);
}

function endSeason() {
  showToast('🏆 赛季结束！即将开始新赛季！');
  generateSeasonCalendar();
  advanceToNextMatch();
}

/* ==========================================================================
   5. MATCH ENGINE — CS 比赛模拟引擎 (支持 BO1 & BO3)
   ========================================================================== */
function initNewMatch(oppName, format) {
  stopAutoPlay();
  format = format || 'BO1';

  // Map Veto
  const shuffledMaps = [...MAP_POOL].sort(() => Math.random() - 0.5);
  const banned = shuffledMaps.slice(0, 2).map(m => m.toUpperCase());
  const remaining = shuffledMaps.slice(2);

  let maps;
  if (format === 'BO3') {
    maps = remaining.slice(0, 3);
  } else {
    maps = [remaining[0]];
  }

  gameState.currentMatch = {
    opponent: oppName, format,
    maps: maps.map(m => m.toUpperCase()),
    bannedMaps: banned,
    currentMapIndex: 0,
    seriesScoreMy: 0, seriesScoreOpp: 0,
    // Current map state
    roundNum: 1, scoreMy: 0, scoreOpp: 0,
    mySide: 'CT', oppSide: 'T',
    myMoney: 800, oppMoney: 800,
    myBuyType: 'PISTOL ($800)', oppBuyType: 'PISTOL ($800)',
    myLossStreak: 0, oppLossStreak: 0,
    killFeed: [], isFinished: false, isMapFinished: false
  };
}

function getEffectiveStat(player, stat) {
  let val = player[stat] || 0;
  // Perk boosts
  (player.perks || []).forEach(perkName => {
    const def = PERK_DEFS[perkName];
    if (def && def.stat === stat) val += def.boost;
  });
  // Chemistry modifier
  const chem = player.chemistry !== undefined ? player.chemistry : 100;
  if (chem < 70) val = Math.round(val * 0.9);
  else if (chem >= 90) val += 3;
  return Math.min(99, val);
}

function getOppProfile(oppName) {
  return TEAM_PROFILES[oppName] || { style: 'balanced', avgAim: 85, avgSense: 85, avgClutch: 85, star: 'Unknown', region: '🌍' };
}

function simulateRound() {
  const m = gameState.currentMatch;
  if (!m || m.isFinished) { stopAutoPlay(); showToast('比赛已结束！'); return; }

  const opp = getOppProfile(m.opponent);

  // Halftime swap at round 13
  if (m.roundNum === 13) {
    [m.mySide, m.oppSide] = [m.oppSide, m.mySide];
    m.myMoney = 800; m.oppMoney = 800;
    m.myLossStreak = 0; m.oppLossStreak = 0;
    m.myBuyType = 'PISTOL ($800)'; m.oppBuyType = 'PISTOL ($800)';
    m.killFeed.unshift(`🔄 --- 半场换边！我方现为 ${m.mySide} ---`);
  } else if (m.roundNum === 1) {
    m.myBuyType = 'PISTOL ($800)'; m.oppBuyType = 'PISTOL ($800)';
  } else {
    m.myBuyType = m.myMoney >= 4200 ? 'FULL BUY (AK/AWP + 护甲)' : (m.myMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE');
    m.oppBuyType = m.oppMoney >= 4200 ? 'FULL BUY (AK/AWP + 护甲)' : (m.oppMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE');
  }

  // Calculate power with effective stats, chemistry, perks
  const avgAim = gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'aim'), 0) / 5;
  const avgClutch = gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'clutch'), 0) / 5;
  const avgChem = gameState.roster.reduce((s, p) => s + (p.chemistry || 100), 0) / 5;

  let myPower = avgAim * 0.45 + avgClutch * 0.25 + (m.myMoney / 16000) * 20 + (avgChem / 100) * 10;
  let oppPower = opp.avgAim * 0.45 + opp.avgClutch * 0.25 + (m.oppMoney / 16000) * 20 + 9;

  // Tactic modifiers
  const tactics = { aggressive: 5, defensive: 3, balanced: 0, forcebuy: 2 };
  myPower += tactics[gameState.tacticStyle] || 0;

  // Opponent style modifiers
  if (opp.style === 'awp_heavy') oppPower += 3;
  if (opp.style === 'defensive') oppPower += 2;
  if (opp.style === 'aggressive') oppPower += 4;

  const winProb = Math.max(0.15, Math.min(0.85, myPower / (myPower + oppPower)));
  const myWon = Math.random() < winProb;

  // Pick a random player for kill feed
  const hero = gameState.roster[Math.floor(Math.random() * 5)];
  const weapons = ['AK-47', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 'Galil AR', 'MP9'];
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const logs = [];
  logs.push(`--- 回合 ${m.roundNum} [${m.maps[m.currentMapIndex]}] (${m.mySide} vs ${m.oppSide}) ---`);

  // Update player stats
  const heroStats = gameState.playerStats[hero.id] || { kills: 0, deaths: 0, rounds: 0, clutchWins: 0, clutchAttempts: 0 };
  heroStats.rounds++;

  if (myWon) {
    m.scoreMy++; m.oppLossStreak++; m.myLossStreak = 0;
    m.myMoney = Math.min(16000, m.myMoney + 3250);
    m.oppMoney = Math.min(16000, m.oppMoney + 1400 + Math.min(m.oppLossStreak * 500, 2000));

    const isClutch = Math.random() < 0.2;
    const kills = Math.floor(Math.random() * 3) + 1;
    heroStats.kills += kills;

    if (isClutch) {
      heroStats.clutchAttempts++; heroStats.clutchWins++;
      logs.push(`💥 [CLUTCH 1v${Math.floor(Math.random() * 2) + 2}] ${hero.name} 极限残局，${weapon} 连续击杀完成逆转！`);
    } else if (Math.random() < 0.3) {
      logs.push(`💣 [炸弹安放] ${hero.name} 精准封烟，顺利安放 C4 并守住包点！`);
    } else {
      logs.push(`🎯 [首杀] ${hero.name} 使用 ${weapon} 爆头击杀 ${opp.star}！`);
    }
  } else {
    m.scoreOpp++; m.myLossStreak++; m.oppLossStreak = 0;
    m.oppMoney = Math.min(16000, m.oppMoney + 3250);
    m.myMoney = Math.min(16000, m.myMoney + 1400 + Math.min(m.myLossStreak * 500, 2000));

    heroStats.deaths++;
    if (Math.random() < 0.2) { heroStats.clutchAttempts++; }

    if (Math.random() < 0.3) {
      logs.push(`⚠️ ${opp.star} 使用 AWP 长枪架住关键位，我方突破失败。`);
    } else if (Math.random() < 0.3) {
      logs.push(`🛡️ [拆弹] 对手成功回防拆除 C4，遗憾丢掉本回合。`);
    } else {
      logs.push(`❌ 对手团队配合火力交叉，我方未能完成回防。`);
    }
  }

  gameState.playerStats[hero.id] = heroStats;
  m.killFeed.unshift(...logs.reverse());
  m.roundNum++;

  // Check map win (MR12: first to 13)
  if (m.scoreMy >= 13 || m.scoreOpp >= 13) {
    finishMap();
  }

  renderMatchUI();
}

function finishMap() {
  const m = gameState.currentMatch;
  const mapWon = m.scoreMy > m.scoreOpp;
  const mapScore = `${m.scoreMy}:${m.scoreOpp}`;

  if (mapWon) m.seriesScoreMy++;
  else m.seriesScoreOpp++;

  m.killFeed.unshift(`🗺️ === 地图 ${m.maps[m.currentMapIndex]} 结束！比分 ${mapScore} ${mapWon ? '✅ 我方胜利' : '❌ 对手胜利'} (系列赛 ${m.seriesScoreMy}-${m.seriesScoreOpp}) ===`);

  const winsNeeded = m.format === 'BO3' ? 2 : 1;

  if (m.seriesScoreMy >= winsNeeded || m.seriesScoreOpp >= winsNeeded) {
    m.isFinished = true; m.isMapFinished = true;
    stopAutoPlay();
    finishMatch();
  } else {
    // Next map in BO3
    m.currentMapIndex++;
    m.roundNum = 1; m.scoreMy = 0; m.scoreOpp = 0;
    m.mySide = 'CT'; m.oppSide = 'T';
    m.myMoney = 800; m.oppMoney = 800;
    m.myLossStreak = 0; m.oppLossStreak = 0;
    m.myBuyType = 'PISTOL ($800)'; m.oppBuyType = 'PISTOL ($800)';
    m.isMapFinished = false;
    m.killFeed.unshift(`🗺️ --- 即将开始地图 ${m.maps[m.currentMapIndex]} ---`);
  }
}

function finishMatch() {
  const m = gameState.currentMatch;
  const won = m.format === 'BO3' ? m.seriesScoreMy > m.seriesScoreOpp : m.scoreMy > m.scoreOpp;

  // Update season calendar
  const sm = getCurrentSeasonMatch();
  if (sm) {
    sm.result = won ? 'WIN' : 'LOSS';
    sm.score = m.format === 'BO3' ? `${m.seriesScoreMy}-${m.seriesScoreOpp}` : `${m.scoreMy}:${m.scoreOpp}`;
  }

  gameState.matchesPlayed++;

  // Chemistry: all starters +5
  gameState.roster.forEach(p => { p.chemistry = Math.min(100, (p.chemistry || 100) + 5); });

  if (won) {
    gameState.club.wins++;
    const prize = gameState.season.phase === 'major_playoffs' ? 50000 : 25000;
    gameState.club.budget += prize;
    gameState.trainingPoints += 3;
    if (gameState.club.rank > 1) gameState.club.rank--;

    // Check Major Champion
    if (gameState.season.phase === 'major_playoffs' && gameState.season.matchIndex >= gameState.season.calendar.length - 1) {
      // Find MVP (highest kill player)
      let mvpId = null, mvpKills = 0;
      Object.entries(gameState.playerStats).forEach(([id, st]) => {
        if (st.kills > mvpKills) { mvpKills = st.kills; mvpId = id; }
      });
      const mvpPlayer = gameState.roster.find(p => p.id === mvpId);
      gameState.trophies.push({
        title: `Major Champion Season ${gameState.trophies.length + 1}`,
        date: new Date().toLocaleDateString(), mvpPlayer: mvpPlayer ? mvpPlayer.name : 'N/A'
      });
      showToast(`🏆🏆🏆 恭喜荣获 MAJOR 冠军！MVP: ${mvpPlayer ? mvpPlayer.name : 'N/A'}！奖金 $${prize.toLocaleString()}！`);
    } else {
      showToast(`🏆 胜利！奖金 $${prize.toLocaleString()}，TP +3，排名升至 #${gameState.club.rank}！`);
    }
  } else {
    gameState.club.losses++;
    gameState.club.budget += 8000;
    gameState.trainingPoints += 1;
    if (gameState.club.rank < 30) gameState.club.rank++;
    showToast(`💔 失利，参与奖 $8,000，TP +1。调整战术再战！`);
  }

  // Update HLTV rankings
  const userEntry = gameState.hltvRankings.find(r => r.name === gameState.club.name);
  if (userEntry) {
    userEntry.winLoss = `${gameState.club.wins}-${gameState.club.losses}`;
    userEntry.rank = gameState.club.rank;
  }

  gameState.season.matchIndex++;
  saveGame(); renderAll();
}

function autoPlayMatch() {
  if (!gameState.currentMatch || gameState.currentMatch.isFinished) return;
  if (autoPlayInterval) { stopAutoPlay(); return; }
  const btn = document.getElementById('btn-sim-auto');
  if (btn) btn.textContent = '⏸ 暂停自动模拟';
  autoPlayInterval = setInterval(() => {
    if (gameState.currentMatch.isFinished) stopAutoPlay();
    else simulateRound();
  }, 150);
}

function stopAutoPlay() {
  if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
  const btn = document.getElementById('btn-sim-auto');
  if (btn) btn.textContent = '⚡ 自动模拟 (AUTO PLAY)';
}

/* ==========================================================================
   6. TRAINING & PERKS — 训练与技能树
   ========================================================================== */
window.trainStat = function(playerId, stat) {
  if (gameState.trainingPoints < 2) { showToast('训练点数不足！需要 2 TP。'); return; }
  const p = gameState.roster.find(r => r.id === playerId);
  if (!p) return;
  if (p[stat] >= 99) { showToast(`${p.name} 的 ${stat} 已达上限 99！`); return; }
  p[stat] = Math.min(99, p[stat] + 2);
  gameState.trainingPoints -= 2;
  saveGame(); renderAll();
  showToast(`${p.name} 的 ${stat} 提升至 ${p[stat]}！`);
};

window.unlockPerk = function(playerId, perkName) {
  const p = gameState.roster.find(r => r.id === playerId);
  if (!p) return;
  if (p.perks.includes(perkName)) { showToast('已解锁该 Perk！'); return; }
  const def = PERK_DEFS[perkName];
  if (!def) return;
  if (gameState.trainingPoints < def.cost) { showToast(`TP 不足！需要 ${def.cost} TP。`); return; }
  // Check requirements
  for (const [stat, minVal] of Object.entries(def.req)) {
    if ((p[stat] || 0) < minVal) { showToast(`${p.name} 的 ${stat} 未达到 ${minVal} 门槛！`); return; }
  }
  p.perks.push(perkName);
  gameState.trainingPoints -= def.cost;
  saveGame(); renderAll();
  showToast(`${def.icon} ${p.name} 解锁 Perk [${perkName}]！${def.desc}`);
};

/* ==========================================================================
   7. TRANSFER & BENCH — 转会与替补席
   ========================================================================== */
window.buyPlayer = function(playerId) {
  const src = gameState.market.find(m => m.id === playerId) || gameState.academy.find(a => a.id === playerId);
  if (!src) return;
  if (gameState.club.budget < src.value) { showToast('资金不足！'); return; }

  gameState.club.budget -= src.value;
  let replaceIdx = gameState.roster.findIndex(r => r.role === src.role);
  if (replaceIdx === -1) {
    replaceIdx = 0;
    for (let i = 1; i < gameState.roster.length; i++) {
      if (gameState.roster[i].aim < gameState.roster[replaceIdx].aim) replaceIdx = i;
    }
  }
  const replaced = gameState.roster[replaceIdx];
  replaced.morale = Math.max(60, replaced.morale - 15);
  gameState.bench.push(replaced);

  src.chemistry = 50;
  src.joinedAt = gameState.matchesPlayed;
  gameState.roster[replaceIdx] = src;

  // Init stats for new player
  if (!gameState.playerStats[src.id]) {
    gameState.playerStats[src.id] = { kills: 0, deaths: 0, rounds: 0, clutchWins: 0, clutchAttempts: 0 };
  }

  gameState.market = gameState.market.filter(m => m.id !== playerId);
  gameState.academy = gameState.academy.filter(a => a.id !== playerId);
  saveGame(); renderAll();
  showToast(`🎉 签约 [${src.name}]！替代 [${replaced.name}]，新选手需要磨合期。`);
};

/* ==========================================================================
   8. RENDER ENGINE — UI 渲染引擎
   ========================================================================== */
function renderAll() {
  renderHeader(); renderDashboard(); renderTraining(); renderBench();
  renderTransfers(); renderAcademy(); renderMatchUI(); renderBracket();
  renderStats(); renderTrophyCabinet(); renderRankings();
}

function el(id) { return document.getElementById(id); }
function setEl(id, txt) { const e = el(id); if (e) e.textContent = txt; }

function renderHeader() {
  const c = gameState.club;
  setEl('header-club-name', c.name);
  setEl('header-budget', `$${c.budget.toLocaleString()}`);
  setEl('header-tp', `${gameState.trainingPoints} TP`);
  setEl('header-rank', `#${c.rank} WORLD`);
}

function renderDashboard() {
  const c = gameState.club;
  const sm = getCurrentSeasonMatch();
  setEl('dash-next-opp', sm ? sm.opponent : '赛季结束');
  setEl('dash-avg-aim', (gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'aim'), 0) / 5).toFixed(1));
  setEl('dash-tp-display', `${gameState.trainingPoints} TP`);
  setEl('dash-avg-morale', Math.round(gameState.roster.reduce((s, p) => s + p.morale, 0) / 5) + '%');

  const totalSalary = gameState.roster.reduce((s, p) => s + p.salary, 0) + (gameState.bench || []).reduce((s, p) => s + p.salary, 0);
  setEl('dash-monthly-salary', `$${totalSalary.toLocaleString()}`);

  // Season info in header
  const phaseLabel = sm ? PHASE_CONFIG[sm.phase]?.label || sm.phase : '赛季结束';
  setEl('header-season', `${phaseLabel} | 比赛 ${gameState.season.matchIndex + 1}/${gameState.season.calendar.length}`);

  // Roster snapshot
  const list = el('dash-roster-list');
  if (list) {
    list.innerHTML = gameState.roster.map(p => {
      const perkBadges = (p.perks || []).map(pk => {
        const d = PERK_DEFS[pk]; return d ? `<span class="px-1 py-0.5 rounded text-[9px] perk-badge-${d.stat === 'aim' ? 'awp' : d.stat === 'clutch' ? 'clutch' : d.stat === 'sense' ? 'igl' : 'entry'}">${d.icon}</span>` : '';
      }).join('');
      const chemColor = p.chemistry >= 90 ? 'text-emerald-400' : p.chemistry >= 70 ? 'text-amber-400' : 'text-rose-400';
      return `<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">${p.role}</span>
          <span class="font-bold text-white">${p.name}</span>${perkBadges}
        </div>
        <div class="flex items-center gap-3 text-slate-400">
          <span>Aim:<strong class="text-emerald-400">${getEffectiveStat(p, 'aim')}</strong></span>
          <span>Clutch:<strong class="text-cyan-400">${getEffectiveStat(p, 'clutch')}</strong></span>
          <span class="${chemColor}">默契:${p.chemistry}%</span>
        </div>
      </div>`;
    }).join('');
  }

  // News
  const news = el('dash-news-list');
  if (news) {
    const latestResults = gameState.season.calendar.filter(m => m.result).slice(-3).reverse();
    let newsHtml = `<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
      🔥 <strong class="text-amber-400">[HLTV]</strong> <strong>${c.name}</strong> ${phaseLabel} | 排名 #${c.rank} | 资金 $${c.budget.toLocaleString()}
    </div>`;
    latestResults.forEach(r => {
      const isWin = r.result === 'WIN';
      newsHtml += `<div class="p-3 rounded-lg bg-slate-950 border ${isWin ? 'border-emerald-500/30' : 'border-rose-500/30'} text-slate-300">
        ${isWin ? '✅' : '❌'} vs <strong>${r.opponent}</strong> ${r.score} (${PHASE_CONFIG[r.phase]?.label || r.phase})
      </div>`;
    });
    news.innerHTML = newsHtml;
  }
}

function renderTraining() {
  setEl('roster-tp-val', `${gameState.trainingPoints} TP`);
  const cards = el('roster-training-cards');
  if (!cards) return;

  cards.innerHTML = gameState.roster.map(p => {
    const perkBadges = (p.perks || []).map(pk => {
      const d = PERK_DEFS[pk]; return d ? `<div class="px-2 py-0.5 rounded-full text-[9px] font-bold perk-badge-${d.stat === 'aim' ? 'awp' : d.stat === 'clutch' ? 'clutch' : d.stat === 'sense' ? 'igl' : 'entry'}">${d.icon} ${pk}</div>` : '';
    }).join('');

    // Available perks to unlock
    const availablePerks = Object.entries(PERK_DEFS).filter(([name]) => !p.perks.includes(name)).map(([name, def]) => {
      const meetsReq = Object.entries(def.req).every(([stat, min]) => (p[stat] || 0) >= min);
      return `<button onclick="unlockPerk('${p.id}','${name}')" class="px-2 py-1 rounded text-[9px] font-bold ${meetsReq ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}" ${meetsReq ? '' : 'disabled'} title="${def.desc} (需 ${def.cost} TP)">${def.icon} ${name} (${def.cost}TP)</button>`;
    }).join('');

    const chemColor = p.chemistry >= 90 ? 'text-emerald-400' : p.chemistry >= 70 ? 'text-amber-400' : 'text-rose-400';

    return `<div class="rounded-xl bg-cs-card border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-xl hover:border-amber-500/50 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">${p.role}</span>
        <span class="${chemColor} text-[10px]">默契 ${p.chemistry}%</span>
      </div>
      <div class="text-base font-extrabold text-white">${p.name}</div>
      <div class="flex flex-wrap gap-1">${perkBadges || '<span class="text-slate-500 text-[9px]">暂无 Perk</span>'}</div>
      <div class="space-y-1.5 text-[11px]">
        <div class="flex justify-between items-center"><span>Aim 枪法: <strong class="text-emerald-400">${p.aim}</strong></span><button onclick="trainStat('${p.id}','aim')" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] hover:bg-emerald-500/30">+2 (2TP)</button></div>
        <div class="flex justify-between items-center"><span>Sense 意识: <strong class="text-cyan-400">${p.sense}</strong></span><button onclick="trainStat('${p.id}','sense')" class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[9px] hover:bg-cyan-500/30">+2 (2TP)</button></div>
        <div class="flex justify-between items-center"><span>Clutch 残局: <strong class="text-amber-400">${p.clutch}</strong></span><button onclick="trainStat('${p.id}','clutch')" class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] hover:bg-amber-500/30">+2 (2TP)</button></div>
        <div class="flex justify-between items-center"><span>Speed 身法: <strong class="text-purple-400">${p.movement}</strong></span><button onclick="trainStat('${p.id}','movement')" class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] hover:bg-purple-500/30">+2 (2TP)</button></div>
        <div class="flex justify-between"><span>Morale 士气:</span><strong class="text-slate-200">${p.morale}%</strong></div>
      </div>
      <div class="pt-2 border-t border-slate-800 space-y-1">
        <div class="text-[9px] text-slate-400 font-bold">解锁 Perk 特长:</div>
        <div class="flex flex-wrap gap-1">${availablePerks}</div>
      </div>
    </div>`;
  }).join('');
}

function renderBench() {
  const benchList = el('bench-list');
  if (!benchList) return;
  if (!gameState.bench.length) {
    benchList.innerHTML = '<div class="text-slate-500 text-xs font-mono italic">替补席暂无选手。</div>';
  } else {
    benchList.innerHTML = gameState.bench.map(p => `
      <div class="p-3 rounded-lg bg-slate-950 border border-rose-500/30 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">BENCH</span>
          <span class="font-bold text-white">${p.name}</span>
          <span class="text-slate-500 text-[10px]">(${p.role})</span>
        </div>
        <div class="flex items-center gap-4 text-slate-400">
          <span>Aim:<strong class="text-emerald-400">${p.aim}</strong></span>
          <span>士气:<strong class="text-amber-400">${p.morale}%</strong></span>
        </div>
      </div>`).join('');
  }
}

function renderTransfers() {
  setEl('market-budget-display', `$${gameState.club.budget.toLocaleString()}`);
  const grid = el('market-players-grid');
  if (!grid) return;
  grid.innerHTML = gameState.market.map(p => `
    <div class="rounded-xl bg-cs-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl hover:border-emerald-500/40 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">${p.role}</span>
        <span class="text-emerald-400 font-bold text-sm">$${p.value.toLocaleString()}</span>
      </div>
      <div><div class="text-lg font-extrabold text-white">${p.name}</div><div class="text-slate-400 text-[11px]">月薪: $${p.salary}/月</div></div>
      <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div>Aim: <strong class="text-emerald-400">${p.aim}</strong></div><div>Sense: <strong class="text-cyan-400">${p.sense}</strong></div>
        <div>Clutch: <strong class="text-amber-400">${p.clutch}</strong></div><div>Speed: <strong class="text-purple-400">${p.movement}</strong></div>
      </div>
      <div class="text-[10px] text-rose-400">⚠️ 签约后默契值从 50% 开始磨合</div>
      <button onclick="buyPlayer('${p.id}')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">💰 签约 ($${p.value.toLocaleString()})</button>
    </div>`).join('');
}

function renderAcademy() {
  const grid = el('academy-players-grid');
  if (!grid) return;
  if (!gameState.academy.length) {
    grid.innerHTML = '<div class="text-slate-500 text-xs font-mono italic col-span-3">青训营暂无可选新人。</div>';
    return;
  }
  grid.innerHTML = gameState.academy.map(p => `
    <div class="rounded-xl bg-cs-card border border-emerald-500/20 p-5 space-y-4 font-mono text-xs shadow-xl hover:border-emerald-500/40 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">🌱 ${p.role}</span>
        <span class="text-emerald-400 font-bold text-sm">$${p.value.toLocaleString()}</span>
      </div>
      <div><div class="text-lg font-extrabold text-white">${p.name}</div><div class="text-emerald-400 text-[11px]">青训新秀 · 月薪仅 $${p.salary}/月</div></div>
      <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div>Aim: <strong class="text-emerald-400">${p.aim}</strong></div><div>Sense: <strong class="text-cyan-400">${p.sense}</strong></div>
        <div>Clutch: <strong class="text-amber-400">${p.clutch}</strong></div><div>Morale: <strong class="text-white">${p.morale}%</strong></div>
      </div>
      <div class="text-[10px] text-cyan-400">💡 属性较低但高士气 & 可通过训练培养</div>
      <button onclick="buyPlayer('${p.id}')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">🌱 签约青训新人 ($${p.value.toLocaleString()})</button>
    </div>`).join('');
}

function renderMatchUI() {
  const m = gameState.currentMatch;
  if (!m) return;
  const opp = getOppProfile(m.opponent);

  setEl('match-my-team-name', gameState.club.name);
  setEl('match-opp-team-name', m.opponent);
  setEl('score-my', m.scoreMy); setEl('score-opp', m.scoreOpp);
  setEl('match-round-counter', `ROUND ${m.roundNum} / 24 ${m.format === 'BO3' ? `| MAP ${m.currentMapIndex + 1}/3 (${m.seriesScoreMy}-${m.seriesScoreOpp})` : ''}`);

  // Side badges
  const mySideText = el('match-my-side-text'), oppSideText = el('match-opp-side-text');
  const myBadge = el('badge-my-side'), oppBadge = el('badge-opp-side');
  if (mySideText && oppSideText && myBadge && oppBadge) {
    mySideText.textContent = `SIDE: ${m.mySide} (${m.mySide === 'CT' ? '防守' : '进攻'})`;
    oppSideText.textContent = `SIDE: ${m.oppSide} (${m.oppSide === 'CT' ? '防守' : '进攻'})`;
    myBadge.textContent = m.mySide; oppBadge.textContent = m.oppSide;
    const ctClass = 'w-12 h-12 rounded-xl bg-cs-ct/20 border border-cs-ct/40 flex items-center justify-center font-extrabold text-cs-ct font-mono text-lg';
    const tClass = 'w-12 h-12 rounded-xl bg-cs-t/20 border border-cs-t/40 flex items-center justify-center font-extrabold text-cs-t font-mono text-lg';
    myBadge.className = m.mySide === 'CT' ? ctClass : tClass;
    oppBadge.className = m.mySide === 'CT' ? tClass : ctClass;
  }

  // Map & Ban info
  setEl('match-map-name', `${m.maps[m.currentMapIndex]} (${m.mySide} vs ${m.oppSide})`);
  setEl('match-ban-info', `BAN: ${m.bannedMaps.join(', ')} | ${m.format}`);

  // Stage title
  const sm = getCurrentSeasonMatch();
  setEl('major-stage-title', sm ? `${PHASE_CONFIG[sm.phase]?.label || sm.phase} | ${m.format}` : '');

  // Economy
  setEl('eco-my-team', gameState.club.name); setEl('eco-opp-team', m.opponent);
  setEl('eco-my-buy-type', `BUY: ${m.myBuyType}`); setEl('eco-opp-buy-type', `BUY: ${m.oppBuyType}`);
  setEl('eco-my-money', `$${m.myMoney.toLocaleString()}`); setEl('eco-opp-money', `$${m.oppMoney.toLocaleString()}`);

  // Kill Feed
  const fb = el('kill-feed-box');
  if (fb) {
    if (!m.killFeed.length) {
      fb.innerHTML = '<div class="text-slate-500 italic">点击"模拟下一回合"开始体验热血 CS 对决...</div>';
    } else {
      fb.innerHTML = m.killFeed.map(log => {
        let cls = 'text-slate-300';
        if (log.includes('---') || log.includes('===')) cls = 'text-amber-400 font-bold border-t border-slate-800 pt-2';
        else if (log.includes('CLUTCH')) cls = 'text-amber-300 font-bold bg-amber-500/10 p-1 rounded';
        else if (log.includes('首杀') || log.includes('爆头')) cls = 'text-emerald-400 font-bold';
        else if (log.includes('失败') || log.includes('❌')) cls = 'text-rose-400';
        else if (log.includes('炸弹') || log.includes('C4')) cls = 'text-orange-400';
        else if (log.includes('拆弹') || log.includes('🛡️')) cls = 'text-cyan-400';
        return `<div class="${cls}">${log}</div>`;
      }).join('');
      fb.scrollTop = fb.scrollHeight;
    }
  }
}

function renderBracket() {
  const view = el('major-bracket-view');
  if (!view) return;

  const playoffMatches = gameState.season.calendar.filter(m => m.phase === 'major_playoffs');
  if (!playoffMatches.length) {
    view.innerHTML = `<div class="col-span-3 text-slate-500 text-xs italic py-8">Major 淘汰赛尚未开始。完成联赛和资格赛后即可解锁淘汰树。</div>`;
    return;
  }

  const stages = ['四分之一决赛', '半决赛', '总决赛'];
  view.innerHTML = playoffMatches.map((m, i) => {
    const isPlayed = !!m.result;
    const isWin = m.result === 'WIN';
    const borderColor = isPlayed ? (isWin ? 'border-emerald-500/50' : 'border-rose-500/50') : 'border-amber-500/30';
    return `<div class="rounded-xl bg-slate-950 border ${borderColor} p-4 space-y-2">
      <div class="text-amber-400 font-bold text-[10px]">${stages[i] || 'BO3'}</div>
      <div class="text-white font-extrabold">${gameState.club.name}</div>
      <div class="text-slate-500">VS</div>
      <div class="text-cs-t font-bold">${m.opponent}</div>
      <div class="text-[10px] ${isWin ? 'text-emerald-400' : isPlayed ? 'text-rose-400' : 'text-slate-500'}">
        ${isPlayed ? `${m.score} ${isWin ? '✅ WIN' : '❌ LOSS'}` : '🔜 待比赛'}
      </div>
    </div>`;
  }).join('');
}

function renderStats() {
  const tbody = el('stats-tbody');
  if (!tbody) return;

  tbody.innerHTML = gameState.roster.map(p => {
    const st = gameState.playerStats[p.id] || { kills: 0, deaths: 0, rounds: 0, clutchWins: 0, clutchAttempts: 0 };
    const kd = st.deaths > 0 ? (st.kills / st.deaths).toFixed(2) : st.kills.toFixed(2);
    const kast = st.rounds > 0 ? Math.min(100, Math.round((st.kills + st.clutchWins) / st.rounds * 100 + 40)) : 0;
    const rating = st.rounds > 0 ? Math.min(2.0, ((st.kills * 0.8 + st.clutchWins * 2) / Math.max(1, st.rounds) + 0.5)).toFixed(2) : '0.00';

    const perkBadges = (p.perks || []).map(pk => { const d = PERK_DEFS[pk]; return d ? d.icon : ''; }).join(' ');

    return `<tr class="hover:bg-slate-900/60 transition-colors">
      <td class="p-4 font-bold text-white">${p.name} ${perkBadges}</td>
      <td class="p-4"><span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px]">${p.role}</span></td>
      <td class="p-4 text-emerald-400 font-bold">${st.kills}</td>
      <td class="p-4 ${parseFloat(kd) >= 1.0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">${kd}</td>
      <td class="p-4 text-cyan-400">${kast}%</td>
      <td class="p-4 ${parseFloat(rating) >= 1.0 ? 'text-amber-400' : 'text-slate-400'} font-bold">${rating}</td>
      <td class="p-4 text-purple-400 font-bold">${st.clutchWins} / ${st.clutchAttempts}</td>
    </tr>`;
  }).join('');
}

function renderTrophyCabinet() {
  const cab = el('trophy-cabinet');
  if (!cab) return;
  if (!gameState.trophies.length) {
    cab.innerHTML = '<div class="col-span-3 text-slate-500 text-xs italic py-4">尚未获得任何 Major 冠军奖杯。赢得 Major 淘汰赛冠军后，奖杯将在此展示！</div>';
    return;
  }
  cab.innerHTML = gameState.trophies.map(t => `
    <div class="rounded-xl bg-slate-950 border border-amber-500/50 p-5 text-center space-y-2 trophy-gold">
      <div class="text-4xl">🏆</div>
      <div class="text-amber-400 font-extrabold text-sm">${t.title}</div>
      <div class="text-slate-400 text-[10px]">${t.date}</div>
      <div class="text-cyan-400 font-bold text-[11px]">MVP: ${t.mvpPlayer}</div>
    </div>`).join('');
}

function renderRankings() {
  const tbody = el('rankings-tbody');
  if (!tbody) return;
  // Sort by rank
  gameState.hltvRankings.sort((a, b) => a.rank - b.rank);
  tbody.innerHTML = gameState.hltvRankings.map(r => {
    const isUser = r.name === gameState.club.name;
    return `<tr class="${isUser ? 'bg-amber-500/10 font-bold text-amber-400' : 'hover:bg-slate-900/60'} transition-colors">
      <td class="p-4 font-bold">#${r.rank}</td>
      <td class="p-4 flex items-center gap-2"><span>${r.name}</span>${isUser ? '<span class="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px]">YOUR CLUB</span>' : ''}</td>
      <td class="p-4">${r.region}</td>
      <td class="p-4 text-emerald-400 font-bold">${r.points} pts</td>
      <td class="p-4 text-slate-400">${r.winLoss}</td>
    </tr>`;
  }).join('');
}

/* ==========================================================================
   9. 2D LIVE RADAR ENGINE — 2D 实时战术雷达地图模拟引擎
   ========================================================================== */
let radarCanvas = null;
let radarCtx = null;
let radarAnimationId = null;

// 雷达中的 10 个选手的状态坐标
let radarEntities = {
  cts: [],
  ts: [],
  tracers: [], // 枪火弹道射线
  smokes: [],  // 烟雾弹
  c4: { active: false, x: 0, y: 0, plantedAt: null, timer: 0 },
  roundPhase: 'PREP' // PREP, ENGAGE, PLANTED, END
};

// CS 地图经典战术区域坐标基准 (800 x 450 Canvas)
const RADAR_ZONES = {
  ctSpawn: { x: 700, y: 225 },
  tSpawn:  { x: 100, y: 225 },
  siteA:   { x: 550, y: 100, label: 'A SITE' },
  siteB:   { x: 550, y: 350, label: 'B SITE' },
  mid:     { x: 400, y: 225, label: 'MIDDLE' },
  aLong:   { x: 300, y: 100, label: 'A LONG' },
  bApps:   { x: 300, y: 350, label: 'B APPS' },
  banana:  { x: 450, y: 330, label: 'BANANA' },
};

function initRadarCanvas() {
  radarCanvas = document.getElementById('radar-canvas');
  if (!radarCanvas) return;
  radarCtx = radarCanvas.getContext('2d');
  resetRadarPositions();
  if (!radarAnimationId) {
    requestAnimationFrame(radarLoop);
  }
}

function resetRadarPositions() {
  const m = gameState.currentMatch;
  const isUserCT = m ? m.mySide === 'CT' : true;
  const opp = m ? getOppProfile(m.opponent) : null;

  const ctNames = isUserCT 
    ? gameState.roster.map(p => p.name) 
    : [opp?.star || 'OppStar', 'Enemy2', 'Enemy3', 'Enemy4', 'Enemy5'];
  
  const tNames = !isUserCT 
    ? gameState.roster.map(p => p.name) 
    : [opp?.star || 'OppStar', 'Enemy2', 'Enemy3', 'Enemy4', 'Enemy5'];

  radarEntities.cts = ctNames.map((name, i) => ({
    id: `ct_${i}`, name, team: 'CT',
    x: RADAR_ZONES.ctSpawn.x + (Math.random() * 40 - 20),
    y: RADAR_ZONES.ctSpawn.y + (i * 30 - 60),
    targetX: RADAR_ZONES.ctSpawn.x,
    targetY: RADAR_ZONES.ctSpawn.y,
    hp: 100, isAlive: true,
    color: '#38bdf8' // 蓝色
  }));

  radarEntities.ts = tNames.map((name, i) => ({
    id: `t_${i}`, name, team: 'T',
    x: RADAR_ZONES.tSpawn.x + (Math.random() * 40 - 20),
    y: RADAR_ZONES.tSpawn.y + (i * 30 - 60),
    targetX: RADAR_ZONES.tSpawn.x,
    targetY: RADAR_ZONES.tSpawn.y,
    hp: 100, isAlive: true,
    color: '#f97316' // 橙色
  }));

  radarEntities.tracers = [];
  radarEntities.smokes = [];
  radarEntities.c4 = { active: false, x: 0, y: 0, plantedAt: null, timer: 0 };
  radarEntities.roundPhase = 'PREP';

  const alertBanner = document.getElementById('c4-alert-banner');
  if (alertBanner) alertBanner.classList.add('hidden');
  
  const tag = document.getElementById('radar-status-tag');
  if (tag) {
    tag.textContent = '准备阶段 (PREP)';
    tag.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold';
  }
}

// 模拟回合时触发现场人物点对战与走位
function triggerRadarBattle(myWon) {
  if (!radarCtx) initRadarCanvas();

  const isA = Math.random() < 0.5;
  const targetSite = isA ? RADAR_ZONES.siteA : RADAR_ZONES.siteB;
  const targetChoke = isA ? RADAR_ZONES.aLong : RADAR_ZONES.bApps;

  radarEntities.roundPhase = 'ENGAGE';
  const tag = document.getElementById('radar-status-tag');
  if (tag) {
    tag.textContent = `交火阶段 (RUSH ${isA ? 'A' : 'B'})`;
    tag.className = 'px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold animate-pulse';
  }

  // T 点向前推进
  radarEntities.ts.forEach((t, i) => {
    if (!t.isAlive) return;
    t.targetX = targetChoke.x + Math.random() * 80 - 40;
    t.targetY = targetChoke.y + Math.random() * 80 - 40;
  });

  // CT 点防守关键点
  radarEntities.cts.forEach((ct, i) => {
    if (!ct.isAlive) return;
    if (i < 3) {
      ct.targetX = targetSite.x + Math.random() * 60 - 30;
      ct.targetY = targetSite.y + Math.random() * 60 - 30;
    } else {
      ct.targetX = RADAR_ZONES.mid.x + Math.random() * 50 - 25;
      ct.targetY = RADAR_ZONES.mid.y + Math.random() * 50 - 25;
    }
  });

  // 1 秒后触发包点交火与 C4 爆破
  setTimeout(() => {
    // 烟雾弹效果
    radarEntities.smokes.push({ x: targetSite.x + (Math.random() * 40 - 20), y: targetSite.y + (Math.random() * 40 - 20), radius: 35, opacity: 0.8 });

    // T 进点
    radarEntities.ts.forEach(t => {
      if (t.isAlive) {
        t.targetX = targetSite.x + Math.random() * 70 - 35;
        t.targetY = targetSite.y + Math.random() * 70 - 35;
      }
    });

    // 生成弹道 Tracer
    const aliveCTs = radarEntities.cts.filter(c => c.isAlive);
    const aliveTs = radarEntities.ts.filter(t => t.isAlive);

    for (let k = 0; k < 6; k++) {
      if (aliveCTs.length && aliveTs.length) {
        const ct = aliveCTs[Math.floor(Math.random() * aliveCTs.length)];
        const t = aliveTs[Math.floor(Math.random() * aliveTs.length)];
        radarEntities.tracers.push({
          x1: ct.x, y1: ct.y, x2: t.x, y2: t.y, opacity: 1.0, color: '#f59e0b'
        });
      }
    }

    // 判定淘汰伤亡点
    if (myWon) {
      // 对手方多死几个点
      const loserTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.ts : radarEntities.cts;
      const winnerTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.cts : radarEntities.ts;
      
      loserTeam.filter(p => p.isAlive).slice(0, 3).forEach(p => { p.isAlive = false; p.hp = 0; });
      winnerTeam.filter(p => p.isAlive).slice(0, 1).forEach(p => { p.hp = 30; });
    } else {
      const loserTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.cts : radarEntities.ts;
      loserTeam.filter(p => p.isAlive).slice(0, 3).forEach(p => { p.isAlive = false; p.hp = 0; });
    }

    // C4 炸弹安放动画判定
    if (Math.random() < 0.6) {
      radarEntities.c4.active = true;
      radarEntities.c4.x = targetSite.x;
      radarEntities.c4.y = targetSite.y;
      radarEntities.c4.plantedAt = isA ? 'A SITE' : 'B SITE';
      
      const alertBanner = document.getElementById('c4-alert-banner');
      if (alertBanner) alertBanner.classList.remove('hidden');
    }
  }, 400);
}

// 60FPS 实时 Canvas 渲染 Loop
function radarLoop() {
  if (radarCtx && radarCanvas) {
    drawRadarScene();
  }
  requestAnimationFrame(radarLoop);
}

function drawRadarScene() {
  const width = radarCanvas.width;
  const height = radarCanvas.height;

  // 1. 清空与背景底色
  radarCtx.fillStyle = '#090d16';
  radarCtx.fillRect(0, 0, width, height);

  // 网格战术背景
  radarCtx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
  radarCtx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    radarCtx.beginPath(); radarCtx.moveTo(x, 0); radarCtx.lineTo(x, height); radarCtx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    radarCtx.beginPath(); radarCtx.moveTo(0, y); radarCtx.lineTo(width, y); radarCtx.stroke();
  }

  // 2. 绘制 CS 经典地图墙体与包点 layout
  drawMapStructure(width, height);

  // 3. 绘制烟雾弹遮挡
  radarEntities.smokes.forEach(s => {
    radarCtx.beginPath();
    radarCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    radarCtx.fillStyle = `rgba(148, 163, 184, ${s.opacity})`;
    radarCtx.fill();
    s.radius = Math.min(45, s.radius + 0.1);
  });

  // 4. 绘制 C4 炸弹脉冲动画
  if (radarEntities.c4.active) {
    const pulse = (Date.now() % 1000) / 1000;
    radarCtx.beginPath();
    radarCtx.arc(radarEntities.c4.x, radarEntities.c4.y, 10 + pulse * 20, 0, Math.PI * 2);
    radarCtx.strokeStyle = `rgba(244, 63, 94, ${1 - pulse})`;
    radarCtx.lineWidth = 3;
    radarCtx.stroke();

    radarCtx.beginPath();
    radarCtx.arc(radarEntities.c4.x, radarEntities.c4.y, 6, 0, Math.PI * 2);
    radarCtx.fillStyle = '#f43f5e';
    radarCtx.fill();
  }

  // 5. 绘制弹道 Gunfire Tracers
  radarEntities.tracers.forEach(t => {
    radarCtx.beginPath();
    radarCtx.moveTo(t.x1, t.y1);
    radarCtx.lineTo(t.x2, t.y2);
    radarCtx.strokeStyle = `rgba(245, 158, 11, ${t.opacity})`;
    radarCtx.lineWidth = 2;
    radarCtx.stroke();
    t.opacity -= 0.05;
  });
  radarEntities.tracers = radarEntities.tracers.filter(t => t.opacity > 0);

  // 6. 更新与绘制 CT (蓝色) & T (橙色) 选手圆点
  const allPlayers = [...radarEntities.cts, ...radarEntities.ts];

  allPlayers.forEach(p => {
    // 平滑插值走向目标点
    p.x += (p.targetX - p.x) * 0.08;
    p.y += (p.targetY - p.y) * 0.08;

    if (!p.isAlive) {
      // 阵亡标 X 💀
      radarCtx.fillStyle = 'rgba(100, 116, 139, 0.6)';
      radarCtx.font = 'bold 12px monospace';
      radarCtx.fillText('✖', p.x - 4, p.y + 4);
      return;
    }

    // 选手圆点光圈
    radarCtx.beginPath();
    radarCtx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    radarCtx.fillStyle = p.team === 'CT' ? '#38bdf8' : '#f97316';
    radarCtx.shadowColor = p.team === 'CT' ? '#38bdf8' : '#f97316';
    radarCtx.shadowBlur = 10;
    radarCtx.fill();
    radarCtx.shadowBlur = 0; // 重置光芒

    // 圆点外圈白色边框
    radarCtx.lineWidth = 2;
    radarCtx.strokeStyle = '#ffffff';
    radarCtx.stroke();

    // 名字 Label
    radarCtx.fillStyle = p.team === 'CT' ? '#7dd3fc' : '#ffedd5';
    radarCtx.font = 'bold 10px monospace';
    radarCtx.textAlign = 'center';
    radarCtx.fillText(p.name, p.x, p.y - 12);
  });
}

// 绘制平面战术地图结构 (A区, B区, 中路, 路线)
function drawMapStructure(width, height) {
  const m = gameState.currentMatch;
  const mapName = m ? m.maps[m.currentMapIndex] : 'DE_INFERNO';

  radarCtx.lineWidth = 3;
  radarCtx.strokeStyle = '#334155';

  // 绘制通道路线 Line Paths
  radarCtx.beginPath();
  // T Spawn to Mid & Sites
  radarCtx.moveTo(RADAR_ZONES.tSpawn.x, RADAR_ZONES.tSpawn.y);
  radarCtx.lineTo(RADAR_ZONES.mid.x, RADAR_ZONES.mid.y);
  radarCtx.lineTo(RADAR_ZONES.ctSpawn.x, RADAR_ZONES.ctSpawn.y);

  radarCtx.moveTo(RADAR_ZONES.tSpawn.x, RADAR_ZONES.tSpawn.y);
  radarCtx.lineTo(RADAR_ZONES.aLong.x, RADAR_ZONES.aLong.y);
  radarCtx.lineTo(RADAR_ZONES.siteA.x, RADAR_ZONES.siteA.y);
  radarCtx.lineTo(RADAR_ZONES.ctSpawn.x, RADAR_ZONES.ctSpawn.y);

  radarCtx.moveTo(RADAR_ZONES.tSpawn.x, RADAR_ZONES.tSpawn.y);
  radarCtx.lineTo(RADAR_ZONES.bApps.x, RADAR_ZONES.bApps.y);
  radarCtx.lineTo(RADAR_ZONES.siteB.x, RADAR_ZONES.siteB.y);
  radarCtx.lineTo(RADAR_ZONES.ctSpawn.x, RADAR_ZONES.ctSpawn.y);

  radarCtx.stroke();

  // A 包点 Zone
  drawZoneBox(RADAR_ZONES.siteA.x, RADAR_ZONES.siteA.y, 90, 60, 'A SITE', '#f59e0b');

  // B 包点 Zone
  drawZoneBox(RADAR_ZONES.siteB.x, RADAR_ZONES.siteB.y, 90, 60, 'B SITE', '#f59e0b');

  // CT & T 出生点 Base Boxes
  drawZoneBox(RADAR_ZONES.ctSpawn.x, RADAR_ZONES.ctSpawn.y, 70, 70, 'CT BASE', '#38bdf8');
  drawZoneBox(RADAR_ZONES.tSpawn.x, RADAR_ZONES.tSpawn.y, 70, 70, 'T BASE', '#f97316');

  // 顶端地图标
  radarCtx.fillStyle = '#94a3b8';
  radarCtx.font = 'bold 12px monospace';
  radarCtx.textAlign = 'left';
  radarCtx.fillText(`MAP: ${mapName} // 2D RADAR OBSERVER`, 15, 25);
}

function drawZoneBox(cx, cy, w, h, label, color) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  radarCtx.fillStyle = `${color}15`; // 15% 透明度
  radarCtx.strokeStyle = `${color}60`;
  radarCtx.lineWidth = 1.5;

  radarCtx.fillRect(x, y, w, h);
  radarCtx.strokeRect(x, y, w, h);

  radarCtx.fillStyle = color;
  radarCtx.font = 'bold 10px monospace';
  radarCtx.textAlign = 'center';
  radarCtx.fillText(label, cx, cy + 4);
}

// 挂钩到模拟回合函数 simulateRound
const originalSimulateRound = simulateRound;
simulateRound = function() {
  const m = gameState.currentMatch;
  const myWonBefore = m ? m.scoreMy : 0;
  originalSimulateRound();
  
  if (gameState.currentMatch) {
    const myWon = gameState.currentMatch.scoreMy > myWonBefore;
    triggerRadarBattle(myWon);
  }
};

// 挂钩到匹配新对手时重置雷达
const originalInitNewMatch = initNewMatch;
initNewMatch = function(oppName, format) {
  originalInitNewMatch(oppName, format);
  resetRadarPositions();
};

// 页面加载完成后初始化 Canvas
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initRadarCanvas, 200);
});