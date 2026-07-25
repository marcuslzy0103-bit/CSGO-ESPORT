/**
 * COUNTER-MANAGER 2026 PRO // CS:GO & CS2 ESPORTS SIMULATION ENGINE
 * Fixed Map: DE_DUST2 2D Tactical Radar Visualizer
 */

const STORAGE_KEY = 'cs_manager_save_v6';
const MAP_POOL = ['de_dust2']; // 固定经典 Dust II 地图

/* ==========================================================================
   TEAM AI PROFILES — 每支战队的独特战术风格与明星选手
   ========================================================================== */
const TEAM_PROFILES = {
  'Natus Vincere': { style: 'awp_heavy', avgAim: 93, avgSense: 91, avgClutch: 94, star: 's1mple', region: '🇺化 Ukraine', points: 985 },
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
   PERK DEFINITIONS — 选手角色固有特长 (Innate Traits)
   ========================================================================== */
const PERK_DEFS = {
  'AWP Specialist':  { stat: 'aim',      boost: 5, icon: '🔭', desc: 'AWP 狙击精通' },
  'Clutch God':      { stat: 'clutch',   boost: 6, icon: '🧊', desc: '1vN 残局心态' },
  'IGL Mastermind':  { stat: 'sense',    boost: 5, icon: '🧠', desc: '指挥读图' },
  'Entry Machine':   { stat: 'aim',      boost: 4, icon: '💥', desc: '突破首杀' },
  'Smoke Criminal':  { stat: 'sense',    boost: 4, icon: '💨', desc: '道具搜查' },
  'Speed Demon':     { stat: 'movement', boost: 5, icon: '⚡', desc: '身法走位' },
};

/* ==========================================================================
   DEFAULT GAME STATE — 默认游戏状态
   ========================================================================== */
const defaultGameState = {
  club: { name: 'CYBER WOLVES CS', region: '🇲🇾 Malaysia', coach: 'Marcus', budget: 100000, rank: 18, wins: 0, losses: 0 },
  tacticStyle: 'balanced',
  matchesPlayed: 0,
  roster: [
    { id: 'p1', name: 'Marcus',  role: 'AWPer',  aim: 88, sense: 85, clutch: 90, movement: 84, morale: 95, salary: 4500, value: 35000, perks: ['AWP Specialist'], chemistry: 100 },
    { id: 'p2', name: 'Vortex',  role: 'IGL',    aim: 80, sense: 92, clutch: 82, movement: 78, morale: 90, salary: 3800, value: 28000, perks: ['IGL Mastermind'], chemistry: 100 },
    { id: 'p3', name: 'Blaze',   role: 'Entry',  aim: 89, sense: 79, clutch: 80, movement: 88, morale: 88, salary: 3600, value: 26000, perks: ['Entry Machine'], chemistry: 100 },
    { id: 'p4', name: 'Shadow',  role: 'Support',aim: 82, sense: 86, clutch: 84, movement: 80, morale: 92, salary: 3200, value: 22000, perks: ['Smoke Criminal'], chemistry: 100 },
    { id: 'p5', name: 'Echo',    role: 'Lurker', aim: 85, sense: 88, clutch: 89, movement: 85, morale: 90, salary: 3400, value: 24000, perks: ['Clutch God'], chemistry: 100 }
  ],
  bench: [],
  market: [
    { id: 'm1', name: 's1mple_fan',   role: 'AWPer', aim: 96, sense: 94, clutch: 95, movement: 92, morale: 95, salary: 8500, value: 75000, perks: ['AWP Specialist'], chemistry: 50 },
    { id: 'm2', name: 'ZywOo_JR',     role: 'AWPer', aim: 95, sense: 96, clutch: 94, movement: 90, morale: 96, salary: 8200, value: 72000, perks: ['AWP Specialist', 'Clutch God'], chemistry: 50 },
    { id: 'm3', name: 'NiKo_Rifle',   role: 'Entry', aim: 97, sense: 90, clutch: 88, movement: 91, morale: 90, salary: 7800, value: 68000, perks: ['Entry Machine'], chemistry: 50 },
    { id: 'm4', name: 'ropz_Lurk',    role: 'Lurker',aim: 92, sense: 97, clutch: 96, movement: 89, morale: 94, salary: 7500, value: 65000, perks: ['Smoke Criminal'], chemistry: 50 },
    { id: 'm5', name: 'm0NESY_Flick', role: 'AWPer', aim: 95, sense: 92, clutch: 93, movement: 95, morale: 92, salary: 7900, value: 70000, perks: ['Speed Demon'], chemistry: 50 },
    { id: 'm6', name: 'b1t_OneTap',   role: 'Entry', aim: 94, sense: 88, clutch: 86, movement: 87, morale: 90, salary: 5500, value: 45000, perks: ['Entry Machine'], chemistry: 50 }
  ],
  academy: [
    { id: 'a1', name: 'Rookie_Ace',  role: 'Entry',  aim: 72, sense: 68, clutch: 70, movement: 75, morale: 98, salary: 1200, value: 8000, perks: ['Entry Machine'], chemistry: 50 },
    { id: 'a2', name: 'Junior_AWP',  role: 'AWPer',  aim: 74, sense: 65, clutch: 68, movement: 70, morale: 95, salary: 1000, value: 6000, perks: ['AWP Specialist'], chemistry: 50 },
    { id: 'a3', name: 'NewBlood_IGL',role: 'IGL',    aim: 68, sense: 76, clutch: 72, movement: 67, morale: 97, salary: 1100, value: 7000, perks: ['IGL Mastermind'], chemistry: 50 },
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
  if (gameState.matchesPlayed === undefined) gameState.matchesPlayed = 0;
  gameState.roster.forEach(p => {
    if (!p.perks) p.perks = [];
    if (p.chemistry === undefined) p.chemistry = 100;
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
    gameState.matchesPlayed = 0; gameState.bench = []; gameState.trophies = [];
    gameState.roster.forEach(p => { p.chemistry = 100; });
    initPlayerStats(); buildHltvRankings(); generateSeasonCalendar(); advanceToNextMatch();
    saveGame(); renderAll(); modal?.classList.add('hidden');
    showToast(`战队 [${gameState.club.name}] 正式创立！征战 Dust2 Major 赛场！`);
  });

  // Tactic select
  document.getElementById('select-tactic-style')?.addEventListener('change', (e) => {
    gameState.tacticStyle = e.target.value; saveGame();
    showToast(`战术调整为: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Match buttons
  document.getElementById('dash-btn-play')?.addEventListener('click', () => switchTab('match'));
  document.getElementById('btn-sim-round')?.addEventListener('click', simulateRound);
  document.getElementById('btn-sim-auto')?.addEventListener('click', autoPlayMatch);
  document.getElementById('btn-reset-match')?.addEventListener('click', () => {
    stopAutoPlay(); advanceToNextMatch(); renderAll();
    showToast(`Dust2 经典对决已准备就绪！`);
  });
}

/* ==========================================================================
   4. SEASON CALENDAR — 赛季日历系统
   ========================================================================== */
const PHASE_CONFIG = {
  league:          { label: '🟢 Dust2 联赛 (League)',     count: 6, format: 'BO1' },
  qualifiers:      { label: '🟡 Major 资格赛 (Qualifiers)', count: 3, format: 'BO1' },
  major_groups:    { label: '🔵 Major 小组赛 (Groups)',   count: 3, format: 'BO1' },
  major_playoffs:  { label: '🏆 Major 8强淘汰赛 (Playoffs)',count: 3, format: 'BO3' },
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
   5. MATCH ENGINE — CS 比赛模拟引擎 (固定 DE_DUST2 地图)
   ========================================================================== */
function initNewMatch(oppName, format) {
  stopAutoPlay();
  format = format || 'BO1';

  gameState.currentMatch = {
    opponent: oppName, format,
    maps: ['DE_DUST2'],
    bannedMaps: ['DE_INFERNO', 'DE_NUKES', 'DE_MIRAGE'],
    currentMapIndex: 0,
    seriesScoreMy: 0, seriesScoreOpp: 0,
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
  (player.perks || []).forEach(perkName => {
    const def = PERK_DEFS[perkName];
    if (def && def.stat === stat) val += def.boost;
  });
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
    m.myBuyType = m.myMoney >= 4200 ? 'FULL BUY (AK/AWP + 护甲)' : (m.myMoney >= 2200 ? 'FORCE BUY (Galil/Famas)' : 'ECO SAVE');
    m.oppBuyType = m.oppMoney >= 4200 ? 'FULL BUY (AK/AWP + 护甲)' : (m.oppMoney >= 2200 ? 'FORCE BUY (Galil/Famas)' : 'ECO SAVE');
  }

  const avgAim = gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'aim'), 0) / 5;
  const avgClutch = gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'clutch'), 0) / 5;
  const avgChem = gameState.roster.reduce((s, p) => s + (p.chemistry || 100), 0) / 5;

  let myPower = avgAim * 0.45 + avgClutch * 0.25 + (m.myMoney / 16000) * 20 + (avgChem / 100) * 10;
  let oppPower = opp.avgAim * 0.45 + opp.avgClutch * 0.25 + (m.oppMoney / 16000) * 20 + 9;

  const tactics = { aggressive: 5, defensive: 3, balanced: 0, forcebuy: 2 };
  myPower += tactics[gameState.tacticStyle] || 0;

  if (opp.style === 'awp_heavy') oppPower += 3;
  if (opp.style === 'defensive') oppPower += 2;
  if (opp.style === 'aggressive') oppPower += 4;

  const winProb = Math.max(0.15, Math.min(0.85, myPower / (myPower + oppPower)));
  const myWon = Math.random() < winProb;

  const hero = gameState.roster[Math.floor(Math.random() * 5)];
  const weapons = ['AK-47', 'M4A4', 'AWP', 'Desert Eagle', 'USP-S', 'Galil AR', 'MP9'];
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const logs = [];
  logs.push(`--- 回合 ${m.roundNum} [de_dust2] (${m.mySide} vs ${m.oppSide}) ---`);

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
      logs.push(`💥 [Dust2 残局] ${hero.name} B 包点冷静思考，${weapon} 1v2 守包成功！`);
    } else if (Math.random() < 0.3) {
      logs.push(`💣 [C4 安放] ${hero.name} 精准封 A 门大门烟雾，顺利安放 C4 爆破！`);
    } else {
      logs.push(`🎯 [A 门首杀] ${hero.name} 使用 ${weapon} 爆头架死 ${opp.star}！`);
    }
  } else {
    m.scoreOpp++; m.myLossStreak++; m.oppLossStreak = 0;
    m.oppMoney = Math.min(16000, m.oppMoney + 3250);
    m.myMoney = Math.min(16000, m.myMoney + 1400 + Math.min(m.myLossStreak * 500, 2000));

    heroStats.deaths++;
    if (Math.random() < 0.2) { heroStats.clutchAttempts++; }

    if (Math.random() < 0.3) {
      logs.push(`⚠️ ${opp.star} 在 Dust2 中门架狙完成首杀，对手控制中路。`);
    } else if (Math.random() < 0.3) {
      logs.push(`🛡️ [拆弹成功] 对手在 A 小回防封烟拆除 C4，我方惜败。`);
    } else {
      logs.push(`❌ 对手 B 洞 Rush 火力过于猛烈，我方防线告破。`);
    }
  }

  gameState.playerStats[hero.id] = heroStats;
  m.killFeed.unshift(...logs.reverse());
  m.roundNum++;

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

  m.killFeed.unshift(`🗺️ === DE_DUST2 结束！比分 ${mapScore} ${mapWon ? '✅ 我方胜利' : '❌ 对手胜利'} (系列赛 ${m.seriesScoreMy}-${m.seriesScoreOpp}) ===`);

  const winsNeeded = m.format === 'BO3' ? 2 : 1;

  if (m.seriesScoreMy >= winsNeeded || m.seriesScoreOpp >= winsNeeded) {
    m.isFinished = true; m.isMapFinished = true;
    stopAutoPlay();
    finishMatch();
  } else {
    m.currentMapIndex = 0;
    m.roundNum = 1; m.scoreMy = 0; m.scoreOpp = 0;
    m.mySide = 'CT'; m.oppSide = 'T';
    m.myMoney = 800; m.oppMoney = 800;
    m.myLossStreak = 0; m.oppLossStreak = 0;
    m.myBuyType = 'PISTOL ($800)'; m.oppBuyType = 'PISTOL ($800)';
    m.isMapFinished = false;
    m.killFeed.unshift(`🗺️ --- 即将开始下一局 de_dust2 ---`);
  }
}

function finishMatch() {
  const m = gameState.currentMatch;
  const won = m.format === 'BO3' ? m.seriesScoreMy > m.seriesScoreOpp : m.scoreMy > m.scoreOpp;

  const sm = getCurrentSeasonMatch();
  if (sm) {
    sm.result = won ? 'WIN' : 'LOSS';
    sm.score = m.format === 'BO3' ? `${m.seriesScoreMy}-${m.seriesScoreOpp}` : `${m.scoreMy}:${m.scoreOpp}`;
  }

  gameState.matchesPlayed++;
  gameState.roster.forEach(p => { p.chemistry = Math.min(100, (p.chemistry || 100) + 5); });

  if (won) {
    gameState.club.wins++;
    const prize = gameState.season.phase === 'major_playoffs' ? 50000 : 25000;
    gameState.club.budget += prize;
    if (gameState.club.rank > 1) gameState.club.rank--;

    if (gameState.season.phase === 'major_playoffs' && gameState.season.matchIndex >= gameState.season.calendar.length - 1) {
      let mvpId = null, mvpKills = 0;
      Object.entries(gameState.playerStats).forEach(([id, st]) => {
        if (st.kills > mvpKills) { mvpKills = st.kills; mvpId = id; }
      });
      const mvpPlayer = gameState.roster.find(p => p.id === mvpId);
      gameState.trophies.push({
        title: `Dust2 Major Champion S${gameState.trophies.length + 1}`,
        date: new Date().toLocaleDateString(), mvpPlayer: mvpPlayer ? mvpPlayer.name : 'N/A'
      });
      showToast(`🏆🏆🏆 恭喜荣获 DUST2 MAJOR 冠军！MVP: ${mvpPlayer ? mvpPlayer.name : 'N/A'}！奖金 $${prize.toLocaleString()}！`);
    } else {
      showToast(`🏆 Dust2 胜利！奖金 $${prize.toLocaleString()}，排名升至 #${gameState.club.rank}！`);
    }
  } else {
    gameState.club.losses++;
    gameState.club.budget += 8000;
    if (gameState.club.rank < 30) gameState.club.rank++;
    showToast(`💔 失利，参与奖 $8,000。继续调整战术！`);
  }

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
   6. TRANSFER & BENCH — 转会与替补席
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
  gameState.roster[replaceIdx] = src;

  if (!gameState.playerStats[src.id]) {
    gameState.playerStats[src.id] = { kills: 0, deaths: 0, rounds: 0, clutchWins: 0, clutchAttempts: 0 };
  }

  gameState.market = gameState.market.filter(m => m.id !== playerId);
  gameState.academy = gameState.academy.filter(a => a.id !== playerId);
  saveGame(); renderAll();
  showToast(`🎉 签约 [${src.name}]！替代 [${replaced.name}]，新选手需要磨合期。`);
};

/* ==========================================================================
   7. RENDER ENGINE — UI 渲染引擎
   ========================================================================== */
function renderAll() {
  renderHeader(); renderDashboard(); renderRoster(); renderBench();
  renderTransfers(); renderAcademy(); renderMatchUI(); renderBracket();
  renderStats(); renderTrophyCabinet(); renderRankings();
}

function el(id) { return document.getElementById(id); }
function setEl(id, txt) { const e = el(id); if (e) e.textContent = txt; }

function renderHeader() {
  const c = gameState.club;
  setEl('header-club-name', c.name);
  setEl('header-budget', `$${c.budget.toLocaleString()}`);
  setEl('header-rank', `#${c.rank} WORLD`);
}

function renderDashboard() {
  const c = gameState.club;
  const sm = getCurrentSeasonMatch();
  setEl('dash-next-opp', sm ? sm.opponent : '赛季结束');
  setEl('dash-avg-aim', (gameState.roster.reduce((s, p) => s + getEffectiveStat(p, 'aim'), 0) / 5).toFixed(1));
  setEl('dash-avg-morale', Math.round(gameState.roster.reduce((s, p) => s + p.morale, 0) / 5) + '%');

  const totalSalary = gameState.roster.reduce((s, p) => s + p.salary, 0) + (gameState.bench || []).reduce((s, p) => s + p.salary, 0);
  setEl('dash-monthly-salary', `$${totalSalary.toLocaleString()}`);

  const phaseLabel = sm ? PHASE_CONFIG[sm.phase]?.label || sm.phase : '赛季结束';
  setEl('header-season', `${phaseLabel} | 比赛 ${gameState.season.matchIndex + 1}/${gameState.season.calendar.length}`);

  const list = el('dash-roster-list');
  if (list) {
    list.innerHTML = gameState.roster.map(p => {
      const perkBadges = (p.perks || []).map(pk => {
        const d = PERK_DEFS[pk]; return d ? `<span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold">${d.icon} ${pk}</span>` : '';
      }).join(' ');
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

  const news = el('dash-news-list');
  if (news) {
    const latestResults = gameState.season.calendar.filter(m => m.result).slice(-3).reverse();
    let newsHtml = `<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
      🔥 <strong class="text-amber-400">[HLTV Dust2]</strong> <strong>${c.name}</strong> ${phaseLabel} | 排名 #${c.rank}
    </div>`;
    latestResults.forEach(r => {
      const isWin = r.result === 'WIN';
      newsHtml += `<div class="p-3 rounded-lg bg-slate-950 border ${isWin ? 'border-emerald-500/30' : 'border-rose-500/30'} text-slate-300">
        ${isWin ? '✅' : '❌'} vs <strong>${r.opponent}</strong> ${r.score} (de_dust2)
      </div>`;
    });
    news.innerHTML = newsHtml;
  }
}

// 渲染阵容（纯展示，取消手动加点按键）
function renderRoster() {
  const cards = el('roster-training-cards');
  if (!cards) return;

  cards.innerHTML = gameState.roster.map(p => {
    const perkBadges = (p.perks || []).map(pk => {
      const d = PERK_DEFS[pk]; return d ? `<div class="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1">${d.icon} ${pk}</div>` : '';
    }).join('');

    const chemColor = p.chemistry >= 90 ? 'text-emerald-400' : p.chemistry >= 70 ? 'text-amber-400' : 'text-rose-400';

    return `<div class="rounded-xl bg-cs-card border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-xl hover:border-amber-500/50 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">${p.role}</span>
        <span class="${chemColor} text-[10px] font-bold">默契 ${p.chemistry}%</span>
      </div>
      <div class="text-lg font-extrabold text-white">${p.name}</div>
      <div class="flex flex-wrap gap-1">${perkBadges || '<span class="text-slate-500 text-[10px]">通用选手</span>'}</div>
      <div class="space-y-2 text-[11px] pt-1 border-t border-slate-800/80">
        <div class="flex justify-between"><span>Aim 枪法:</span><strong class="text-emerald-400 font-bold text-sm">${p.aim}</strong></div>
        <div class="flex justify-between"><span>Sense 意识:</span><strong class="text-cyan-400 font-bold text-sm">${p.sense}</strong></div>
        <div class="flex justify-between"><span>Clutch 残局:</span><strong class="text-amber-400 font-bold text-sm">${p.clutch}</strong></div>
        <div class="flex justify-between"><span>Speed 身法:</span><strong class="text-purple-400 font-bold text-sm">${p.movement}</strong></div>
        <div class="flex justify-between"><span>Morale 士气:</span><strong class="text-white font-bold">${p.morale}%</strong></div>
      </div>
      <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>月薪: $${p.salary}</span>
        <span class="text-emerald-400 font-bold">首发</span>
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
      <button onclick="buyPlayer('${p.id}')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">🌱 签约青训新人 ($${p.value.toLocaleString()})</button>
    </div>`).join('');
}

function renderMatchUI() {
  const m = gameState.currentMatch;
  if (!m) return;

  setEl('match-my-team-name', gameState.club.name);
  setEl('match-opp-team-name', m.opponent);
  setEl('score-my', m.scoreMy); setEl('score-opp', m.scoreOpp);
  setEl('match-round-counter', `ROUND ${m.roundNum} / 24 ${m.format === 'BO3' ? `| MAP ${m.currentMapIndex + 1}/3 (${m.seriesScoreMy}-${m.seriesScoreOpp})` : ''}`);

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

  setEl('match-map-name', `DE_DUST2 (${m.mySide} vs ${m.oppSide})`);
  setEl('match-ban-info', `BAN: DE_INFERNO, DE_MIRAGE | ${m.format}`);

  const sm = getCurrentSeasonMatch();
  setEl('major-stage-title', sm ? `${PHASE_CONFIG[sm.phase]?.label || sm.phase} | DE_DUST2` : '');

  setEl('eco-my-team', gameState.club.name); setEl('eco-opp-team', m.opponent);
  setEl('eco-my-buy-type', `BUY: ${m.myBuyType}`); setEl('eco-opp-buy-type', `BUY: ${m.oppBuyType}`);
  setEl('eco-my-money', `$${m.myMoney.toLocaleString()}`); setEl('eco-opp-money', `$${m.oppMoney.toLocaleString()}`);

  const fb = el('kill-feed-box');
  if (fb) {
    if (!m.killFeed.length) {
      fb.innerHTML = '<div class="text-slate-500 italic">点击"模拟下一回合"开始体验 Dust2 对决...</div>';
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
    view.innerHTML = `<div class="col-span-3 text-slate-500 text-xs italic py-8">Major 淘汰赛尚未开始。完成 Dust2 联赛后解锁淘汰树。</div>`;
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
    cab.innerHTML = '<div class="col-span-3 text-slate-500 text-xs italic py-4">尚未获得 Dust2 Major 冠军奖杯。</div>';
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
   8. 2D LIVE DUST2 RADAR VISUALIZER — DUST II 专属高细节战术雷达引擎
   ========================================================================== */
let radarCanvas = null;
let radarCtx = null;
let radarAnimationId = null;

let radarEntities = {
  cts: [],
  ts: [],
  tracers: [],
  smokes: [],
  flashes: [],
  c4: { active: false, x: 0, y: 0, plantedAt: null, timer: 0 },
  roundPhase: 'PREP'
};

// 真实的 CS:GO DE_DUST2 战术区域精准坐标 (800 x 450 Canvas)
const DUST2_ZONES = {
  tSpawn:     { x: 90,  y: 380, label: 'T SPAWN' },
  outsideLong:{ x: 250, y: 380, label: 'OUTSIDE LONG' },
  longDoors:  { x: 390, y: 380, label: 'LONG DOORS' },
  pit:        { x: 520, y: 410, label: 'PIT' },
  aLong:      { x: 670, y: 320, label: 'A LONG' },
  aSite:      { x: 690, y: 130, label: 'A SITE' },
  goose:      { x: 745, y: 95,  label: 'GOOSE' },
  shortA:     { x: 540, y: 160, label: 'SHORT A' },
  catwalk:    { x: 440, y: 220, label: 'CATWALK' },
  xbox:       { x: 375, y: 220, label: 'XBOX' },
  mid:        { x: 350, y: 250, label: 'MID DOORS' },
  suicide:    { x: 220, y: 290, label: 'SUICIDE' },
  lowerTunnel:{ x: 260, y: 190, label: 'LOWER TUNNEL' },
  upperTunnel:{ x: 140, y: 180, label: 'UPPER TUNNEL' },
  bSite:      { x: 150, y: 90,  label: 'B SITE' },
  bDoors:     { x: 270, y: 95,  label: 'B DOORS' },
  ctSpawn:    { x: 480, y: 85,  label: 'CT SPAWN' },
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

  const userRoster = gameState.roster;
  const oppRoster = [
    { name: opp?.star || 'OppStar', movement: 88, role: 'AWPer' },
    { name: 'Rifle_Ace', movement: 85, role: 'Entry' },
    { name: 'Support_Guy', movement: 82, role: 'Support' },
    { name: 'IGL_Pro', movement: 80, role: 'IGL' },
    { name: 'Lurk_Master', movement: 86, role: 'Lurker' }
  ];

  const ctPlayers = isUserCT ? userRoster : oppRoster;
  const tPlayers = !isUserCT ? userRoster : oppRoster;

  radarEntities.cts = ctPlayers.map((p, i) => {
    const moveStat = p.movement || 82;
    // 基于身法 Speed 属性计算真人在地图上的跑步移动速度 (1.5 ~ 3.2 px/frame)
    const baseSpeed = 1.5 + (moveStat / 100) * 1.7;
    const speed = p.role === 'AWPer' ? baseSpeed * 0.88 : baseSpeed; // 持狙移动减速

    return {
      id: `ct_${i}`, name: p.name, team: 'CT', role: p.role,
      x: DUST2_ZONES.ctSpawn.x + (Math.random() * 40 - 20),
      y: DUST2_ZONES.ctSpawn.y + (i * 18 - 36),
      path: [DUST2_ZONES.ctSpawn],
      pathIndex: 0,
      targetX: DUST2_ZONES.ctSpawn.x,
      targetY: DUST2_ZONES.ctSpawn.y,
      speed: speed,
      angle: 0, hp: 100, isAlive: true,
      color: '#38bdf8'
    };
  });

  radarEntities.ts = tPlayers.map((p, i) => {
    const moveStat = p.movement || 82;
    const baseSpeed = 1.5 + (moveStat / 100) * 1.7;
    const speed = p.role === 'AWPer' ? baseSpeed * 0.88 : baseSpeed;

    return {
      id: `t_${i}`, name: p.name, team: 'T', role: p.role,
      x: DUST2_ZONES.tSpawn.x + (Math.random() * 40 - 20),
      y: DUST2_ZONES.tSpawn.y + (i * 18 - 36),
      path: [DUST2_ZONES.tSpawn],
      pathIndex: 0,
      targetX: DUST2_ZONES.tSpawn.x,
      targetY: DUST2_ZONES.tSpawn.y,
      speed: speed,
      angle: 0, hp: 100, isAlive: true,
      color: '#f97316'
    };
  });

  radarEntities.tracers = [];
  radarEntities.smokes = [];
  radarEntities.flashes = [];
  radarEntities.c4 = { active: false, x: 0, y: 0, plantedAt: null, timer: 0 };
  radarEntities.roundPhase = 'PREP';

  const alertBanner = document.getElementById('c4-alert-banner');
  if (alertBanner) alertBanner.classList.add('hidden');
  
  const tag = document.getElementById('radar-status-tag');
  if (tag) {
    tag.textContent = 'Dust2 准备阶段 (PREP)';
    tag.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold';
  }
}

// 模拟 Dust2 经典战术推进路线 (带真实航点路径)
function triggerRadarBattle(myWon) {
  if (!radarCtx) initRadarCanvas();

  const stratRoll = Math.random();
  let stratName = 'A LONG RUSH (A大攻势)';
  let targetSite = DUST2_ZONES.aSite;

  // 预设路线 (T 队沿走廊航点移动)
  let tPathALong = [DUST2_ZONES.tSpawn, DUST2_ZONES.outsideLong, DUST2_ZONES.longDoors, DUST2_ZONES.aLong, DUST2_ZONES.aSite];
  let tPathB = [DUST2_ZONES.tSpawn, DUST2_ZONES.upperTunnel, DUST2_ZONES.bSite];
  let tPathMidShort = [DUST2_ZONES.tSpawn, DUST2_ZONES.suicide, DUST2_ZONES.mid, DUST2_ZONES.xbox, DUST2_ZONES.catwalk, DUST2_ZONES.shortA, DUST2_ZONES.aSite];

  let selectedTPath = tPathALong;

  if (stratRoll < 0.35) {
    stratName = 'B TUNNELS RUSH (B洞强冲)';
    targetSite = DUST2_ZONES.bSite;
    selectedTPath = tPathB;
  } else if (stratRoll < 0.7) {
    stratName = 'MID TO SHORT A (中路转A小)';
    targetSite = DUST2_ZONES.aSite;
    selectedTPath = tPathMidShort;
  }

  radarEntities.roundPhase = 'ENGAGE';
  const tag = document.getElementById('radar-status-tag');
  if (tag) {
    tag.textContent = `⚡ Dust2 战术推进: ${stratName}`;
    tag.className = 'px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold animate-pulse';
  }

  // 为 T 队分配路径与目标
  radarEntities.ts.forEach((t, i) => {
    if (!t.isAlive) return;
    t.path = selectedTPath;
    t.pathIndex = 0;
    t.targetX = selectedTPath[0].x;
    t.targetY = selectedTPath[0].y;
  });

  // 为 CT 队分配 Dust2 防守路径
  radarEntities.cts.forEach((ct, i) => {
    if (!ct.isAlive) return;
    let ctPath = [DUST2_ZONES.ctSpawn];
    if (i === 0) ctPath.push({ x: DUST2_ZONES.mid.x, y: DUST2_ZONES.ctSpawn.y + 35 }); // Mid AWP
    else if (i <= 2) ctPath.push(DUST2_ZONES.aSite, DUST2_ZONES.goose);
    else ctPath.push(DUST2_ZONES.bSite, DUST2_ZONES.bDoors);

    ct.path = ctPath;
    ct.pathIndex = 0;
    ct.targetX = ctPath[0].x;
    ct.targetY = ctPath[0].y;
  });

  // 阶段 2: 双方推进接触后触发交火
  setTimeout(() => {
    radarEntities.smokes.push({ x: targetSite.x + (Math.random() * 30 - 15), y: targetSite.y + (Math.random() * 30 - 15), radius: 35, opacity: 0.85 });
    radarEntities.flashes.push({ x: targetSite.x + 10, y: targetSite.y - 10, radius: 15, opacity: 1.0 });

    const aliveCTs = radarEntities.cts.filter(c => c.isAlive);
    const aliveTs = radarEntities.ts.filter(t => t.isAlive);

    for (let k = 0; k < 8; k++) {
      if (aliveCTs.length && aliveTs.length) {
        const ct = aliveCTs[Math.floor(Math.random() * aliveCTs.length)];
        const t = aliveTs[Math.floor(Math.random() * aliveTs.length)];
        radarEntities.tracers.push({
          x1: ct.x, y1: ct.y, x2: t.x, y2: t.y, opacity: 1.0, color: '#f59e0b'
        });
      }
    }

    if (myWon) {
      const loserTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.ts : radarEntities.cts;
      const winnerTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.cts : radarEntities.ts;
      loserTeam.filter(p => p.isAlive).slice(0, 4).forEach(p => { p.isAlive = false; p.hp = 0; });
      winnerTeam.filter(p => p.isAlive).slice(0, 1).forEach(p => { p.hp = 30; });
    } else {
      const loserTeam = gameState.currentMatch?.mySide === 'CT' ? radarEntities.cts : radarEntities.ts;
      loserTeam.filter(p => p.isAlive).slice(0, 4).forEach(p => { p.isAlive = false; p.hp = 0; });
    }

    if (Math.random() < 0.65) {
      radarEntities.c4.active = true;
      radarEntities.c4.x = targetSite.x;
      radarEntities.c4.y = targetSite.y;
      radarEntities.c4.plantedAt = targetSite.label;
      
      const alertBanner = document.getElementById('c4-alert-banner');
      if (alertBanner) alertBanner.classList.remove('hidden');
    }
  }, 900);
}

// 60FPS High-Detail Radar 渲染 Loop
function radarLoop() {
  if (radarCtx && radarCanvas) {
    drawDust2RadarHighDetail();
  }
  requestAnimationFrame(radarLoop);
}

function drawDust2RadarHighDetail() {
  const width = radarCanvas.width;
  const height = radarCanvas.height;

  // 1. 沙色沙尘主题背景底色
  radarCtx.fillStyle = '#0e1420';
  radarCtx.fillRect(0, 0, width, height);

  // 战术坐标网格
  radarCtx.strokeStyle = 'rgba(45, 59, 85, 0.35)';
  radarCtx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    radarCtx.beginPath(); radarCtx.moveTo(x, 0); radarCtx.lineTo(x, height); radarCtx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    radarCtx.beginPath(); radarCtx.moveTo(0, y); radarCtx.lineTo(width, y); radarCtx.stroke();
  }

  // 2. 绘制 Dust II 精准 2D 建筑墙体与地图实景全貌
  drawDust2DetailedMapGeometry(width, height);

  // 3. 烟雾弹云雾
  radarEntities.smokes.forEach(s => {
    radarCtx.beginPath();
    radarCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    radarCtx.fillStyle = `rgba(148, 163, 184, ${s.opacity})`;
    radarCtx.fill();
    s.radius = Math.min(45, s.radius + 0.15);
  });

  // 4. 枪口火焰 (Muzzle Flashes)
  radarEntities.flashes.forEach(f => {
    radarCtx.beginPath();
    radarCtx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    radarCtx.fillStyle = `rgba(251, 191, 36, ${f.opacity})`;
    radarCtx.fill();
    f.opacity -= 0.08;
  });
  radarEntities.flashes = radarEntities.flashes.filter(f => f.opacity > 0);

  // 5. C4 爆破警告圈
  if (radarEntities.c4.active) {
    const pulse = (Date.now() % 1000) / 1000;
    radarCtx.beginPath();
    radarCtx.arc(radarEntities.c4.x, radarEntities.c4.y, 12 + pulse * 24, 0, Math.PI * 2);
    radarCtx.strokeStyle = `rgba(244, 63, 94, ${1 - pulse})`;
    radarCtx.lineWidth = 3;
    radarCtx.stroke();

    radarCtx.beginPath();
    radarCtx.arc(radarEntities.c4.x, radarEntities.c4.y, 7, 0, Math.PI * 2);
    radarCtx.fillStyle = '#f43f5e';
    radarCtx.fill();

    radarCtx.fillStyle = '#ffffff';
    radarCtx.font = 'bold 9px monospace';
    radarCtx.textAlign = 'center';
    radarCtx.fillText('💣 C4', radarEntities.c4.x, radarEntities.c4.y - 12);
  }

  // 6. 弹道射线 (Tracers)
  radarEntities.tracers.forEach(t => {
    radarCtx.beginPath();
    radarCtx.moveTo(t.x1, t.y1);
    radarCtx.lineTo(t.x2, t.y2);
    radarCtx.strokeStyle = `rgba(245, 158, 11, ${t.opacity})`;
    radarCtx.lineWidth = 2.5;
    radarCtx.stroke();
    t.opacity -= 0.05;
  });
  radarEntities.tracers = radarEntities.tracers.filter(t => t.opacity > 0);

  // 7. 绘制 CT (蓝色) & T (橙色) 选手圆点 (基于选手实际 Speed 属性沿 Dust2 航点逐帧步进)
  const allPlayers = [...radarEntities.cts, ...radarEntities.ts];

  allPlayers.forEach(p => {
    if (!p.isAlive) {
      radarCtx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      radarCtx.font = 'bold 12px monospace';
      radarCtx.fillText('✖', p.x - 4, p.y + 4);
      return;
    }

    // 检查是否需要更新航点目标
    if (p.path && p.path.length > 0) {
      const currentTarget = p.path[p.pathIndex];
      if (currentTarget) {
        p.targetX = currentTarget.x;
        p.targetY = currentTarget.y;

        const distToTarget = Math.hypot(currentTarget.x - p.x, currentTarget.y - p.y);
        // 如果到达当前航点，自动切换到下一个航点
        if (distToTarget < 12 && p.pathIndex < p.path.length - 1) {
          p.pathIndex++;
        }
      }
    }

    // 计算方向向量与按选手 speed 步进移动
    const dx = p.targetX - p.x;
    const dy = p.targetY - p.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 1.5) {
      p.angle = Math.atan2(dy, dx);
      // 使用基于选手身法 Speed 属性计算的真实移动速度
      const step = Math.min(dist, p.speed || 2.0);
      p.x += Math.cos(p.angle) * step;
      p.y += Math.sin(p.angle) * step;
    }

    // 视角 FOV 扇形 (Field of View Cone)
    radarCtx.save();
    radarCtx.beginPath();
    radarCtx.moveTo(p.x, p.y);
    radarCtx.arc(p.x, p.y, 25, p.angle - 0.35, p.angle + 0.35);
    radarCtx.closePath();
    radarCtx.fillStyle = p.team === 'CT' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(249, 115, 22, 0.15)';
    radarCtx.fill();
    radarCtx.restore();

    // 选手圆点光效
    radarCtx.beginPath();
    radarCtx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    radarCtx.fillStyle = p.team === 'CT' ? '#38bdf8' : '#f97316';
    radarCtx.shadowColor = p.team === 'CT' ? '#38bdf8' : '#f97316';
    radarCtx.shadowBlur = 10;
    radarCtx.fill();
    radarCtx.shadowBlur = 0;

    radarCtx.lineWidth = 2;
    radarCtx.strokeStyle = '#ffffff';
    radarCtx.stroke();

    // 血量环 (Health Ring Gauge)
    if (p.hp < 100) {
      radarCtx.beginPath();
      radarCtx.arc(p.x, p.y, 11, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (p.hp / 100)));
      radarCtx.strokeStyle = p.hp > 50 ? '#10b981' : '#f43f5e';
      radarCtx.lineWidth = 2;
      radarCtx.stroke();
    }

    // 名字 Label
    radarCtx.fillStyle = p.team === 'CT' ? '#7dd3fc' : '#ffedd5';
    radarCtx.font = 'bold 10px monospace';
    radarCtx.textAlign = 'center';
    radarCtx.fillText(p.name, p.x, p.y - 14);
  });
}

// 绘制高度逼真精细的 CS:GO Dust II 2D 地图全貌
function drawDust2DetailedMapGeometry(width, height) {
  // 1. 沙石主通道 Ground Shading
  radarCtx.fillStyle = '#172030';
  
  // A 大通道 Long A Pathway
  radarCtx.fillRect(250, 360, 420, 40);
  radarCtx.fillRect(650, 130, 40, 240);

  // Short A / Catwalk Pathway
  radarCtx.fillRect(350, 220, 190, 30);
  radarCtx.fillRect(520, 150, 40, 100);

  // Mid Corridor & Suicide
  radarCtx.fillRect(220, 275, 140, 30);
  radarCtx.fillRect(335, 100, 35, 190);

  // CT Ramp & Spawn
  radarCtx.fillRect(440, 75, 100, 40);

  // 2. 绘制 B 洞 Upper & Lower Tunnels 专属暗色与斜纹顶棚 (Roof Hatching)
  radarCtx.fillStyle = '#111827';
  radarCtx.fillRect(110, 160, 160, 40); // Upper tunnel
  radarCtx.fillRect(240, 180, 40, 60);  // Lower tunnel

  // Tunnel 斜线纹理
  radarCtx.strokeStyle = 'rgba(75, 85, 99, 0.4)';
  radarCtx.lineWidth = 1;
  for (let tx = 110; tx < 270; tx += 10) {
    radarCtx.beginPath(); radarCtx.moveTo(tx, 160); radarCtx.lineTo(tx + 8, 200); radarCtx.stroke();
  }

  // 3. 通道墙体边界 Main Walls
  radarCtx.lineWidth = 3.5;
  radarCtx.strokeStyle = '#334155';

  radarCtx.beginPath();
  // T Spawn -> Outside Long -> Long Doors -> A Long -> A Site
  radarCtx.moveTo(DUST2_ZONES.tSpawn.x, DUST2_ZONES.tSpawn.y);
  radarCtx.lineTo(DUST2_ZONES.outsideLong.x, DUST2_ZONES.outsideLong.y);
  radarCtx.lineTo(DUST2_ZONES.longDoors.x, DUST2_ZONES.longDoors.y);
  radarCtx.lineTo(DUST2_ZONES.aLong.x, DUST2_ZONES.aLong.y);
  radarCtx.lineTo(DUST2_ZONES.aSite.x, DUST2_ZONES.aSite.y);

  // Pit
  radarCtx.moveTo(DUST2_ZONES.longDoors.x, DUST2_ZONES.longDoors.y);
  radarCtx.lineTo(DUST2_ZONES.pit.x, DUST2_ZONES.pit.y);

  // Mid & Catwalk
  radarCtx.moveTo(DUST2_ZONES.suicide.x, DUST2_ZONES.suicide.y);
  radarCtx.lineTo(DUST2_ZONES.mid.x, DUST2_ZONES.mid.y);
  radarCtx.lineTo(DUST2_ZONES.catwalk.x, DUST2_ZONES.catwalk.y);
  radarCtx.lineTo(DUST2_ZONES.shortA.x, DUST2_ZONES.shortA.y);
  radarCtx.lineTo(DUST2_ZONES.aSite.x, DUST2_ZONES.aSite.y);

  // B Tunnels -> B Site
  radarCtx.moveTo(DUST2_ZONES.tSpawn.x, DUST2_ZONES.tSpawn.y);
  radarCtx.lineTo(DUST2_ZONES.upperTunnel.x, DUST2_ZONES.upperTunnel.y);
  radarCtx.lineTo(DUST2_ZONES.bSite.x, DUST2_ZONES.bSite.y);

  // Lower tunnel -> Mid
  radarCtx.moveTo(DUST2_ZONES.upperTunnel.x, DUST2_ZONES.upperTunnel.y);
  radarCtx.lineTo(DUST2_ZONES.lowerTunnel.x, DUST2_ZONES.lowerTunnel.y);
  radarCtx.lineTo(DUST2_ZONES.mid.x, DUST2_ZONES.mid.y);

  // CT Spawn connections
  radarCtx.moveTo(DUST2_ZONES.ctSpawn.x, DUST2_ZONES.ctSpawn.y);
  radarCtx.lineTo(DUST2_ZONES.aSite.x, DUST2_ZONES.aSite.y);
  radarCtx.moveTo(DUST2_ZONES.ctSpawn.x, DUST2_ZONES.ctSpawn.y);
  radarCtx.lineTo(DUST2_ZONES.bDoors.x, DUST2_ZONES.bDoors.y);
  radarCtx.lineTo(DUST2_ZONES.bSite.x, DUST2_ZONES.bSite.y);

  radarCtx.stroke();

  // 4. 绘制 Dust2 经典掩体障碍物 (Obstacles & Boxes)
  // Xbox Box at Mid
  drawBoxObstacle(DUST2_ZONES.xbox.x, DUST2_ZONES.xbox.y, 16, 16, 'XBOX', '#d97706');

  // Goose Box at A
  drawBoxObstacle(DUST2_ZONES.goose.x, DUST2_ZONES.goose.y, 22, 18, 'GOOSE', '#64748b');

  // A Site Platform Box
  drawBoxObstacle(DUST2_ZONES.aSite.x + 15, DUST2_ZONES.aSite.y - 10, 24, 24, 'BOXES', '#f59e0b');

  // B Site Platform Box
  drawBoxObstacle(DUST2_ZONES.bSite.x - 10, DUST2_ZONES.bSite.y + 10, 26, 26, 'PLATFORM', '#f59e0b');

  // 门标记 (Doors)
  drawDoorMarker(DUST2_ZONES.mid.x, DUST2_ZONES.mid.y - 20, 'MID DOORS');
  drawDoorMarker(DUST2_ZONES.longDoors.x, DUST2_ZONES.longDoors.y, 'LONG DOORS');
  drawDoorMarker(DUST2_ZONES.bDoors.x, DUST2_ZONES.bDoors.y, 'B DOORS');

  // 5. 绘制 A / B 包点 Zone
  drawDust2ZoneBox(DUST2_ZONES.aSite.x, DUST2_ZONES.aSite.y, 90, 60, 'A SITE', '#f59e0b');
  drawDust2ZoneBox(DUST2_ZONES.bSite.x, DUST2_ZONES.bSite.y, 90, 60, 'B SITE', '#f59e0b');
  drawDust2ZoneBox(DUST2_ZONES.ctSpawn.x, DUST2_ZONES.ctSpawn.y, 80, 50, 'CT SPAWN', '#38bdf8');
  drawDust2ZoneBox(DUST2_ZONES.tSpawn.x, DUST2_ZONES.tSpawn.y, 80, 50, 'T SPAWN', '#f97316');

  // 坑下 Pit Outline
  radarCtx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  radarCtx.strokeRect(DUST2_ZONES.pit.x - 20, DUST2_ZONES.pit.y - 15, 40, 30);
  radarCtx.fillStyle = 'rgba(239, 68, 68, 0.6)';
  radarCtx.font = 'bold 9px monospace';
  radarCtx.textAlign = 'center';
  radarCtx.fillText('PIT', DUST2_ZONES.pit.x, DUST2_ZONES.pit.y + 3);

  // 罗盘 & 标题
  drawCompassRose(width - 50, 45);

  radarCtx.fillStyle = '#f59e0b';
  radarCtx.font = 'bold 12px monospace';
  radarCtx.textAlign = 'left';
  radarCtx.fillText('MAP: DE_DUST2 // CS:GO PRO HIGH-DETAIL RADAR', 15, 25);
}

function drawBoxObstacle(x, y, w, h, label, color) {
  radarCtx.fillStyle = `${color}40`;
  radarCtx.strokeStyle = color;
  radarCtx.lineWidth = 1.5;
  radarCtx.fillRect(x - w / 2, y - h / 2, w, h);
  radarCtx.strokeRect(x - w / 2, y - h / 2, w, h);
}

function drawDoorMarker(x, y, label) {
  radarCtx.fillStyle = '#e2e8f0';
  radarCtx.font = 'bold 9px monospace';
  radarCtx.textAlign = 'center';
  radarCtx.fillText(`🚪 ${label}`, x, y);
}

function drawCompassRose(cx, cy) {
  radarCtx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  radarCtx.lineWidth = 1.5;
  radarCtx.beginPath();
  radarCtx.arc(cx, cy, 18, 0, Math.PI * 2);
  radarCtx.stroke();

  radarCtx.fillStyle = '#f59e0b';
  radarCtx.font = 'bold 9px monospace';
  radarCtx.textAlign = 'center';
  radarCtx.fillText('N', cx, cy - 22);
  radarCtx.fillText('E', cx + 24, cy + 3);
  radarCtx.fillText('S', cx, cy + 28);
  radarCtx.fillText('W', cx - 24, cy + 3);
}

function drawDust2ZoneBox(cx, cy, w, h, label, color) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  radarCtx.fillStyle = `${color}20`;
  radarCtx.strokeStyle = `${color}80`;
  radarCtx.lineWidth = 1.5;

  radarCtx.fillRect(x, y, w, h);
  radarCtx.strokeRect(x, y, w, h);

  radarCtx.fillStyle = color;
  radarCtx.font = 'bold 10px monospace';
  radarCtx.textAlign = 'center';
  radarCtx.fillText(label, cx, cy + 4);
}

// 挂钩模拟回合
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

const originalInitNewMatch = initNewMatch;
initNewMatch = function(oppName, format) {
  originalInitNewMatch(oppName, format);
  resetRadarPositions();
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initRadarCanvas, 200);
});