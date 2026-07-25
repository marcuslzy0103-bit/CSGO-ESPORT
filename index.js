/**
 * COUNTER-MANAGER 2026 // CS:GO & CS2 ESPORTS SIMULATION ENGINE
 * Features: CS Economy ($16k max), HLTV Live Kill Feed Engine, Roster Tactics, & Transfer Market.
 */

const STORAGE_KEY = 'cs_manager_save_v2';

// 初始默认战队数据
const defaultGameState = {
  club: {
    name: 'CYBER WOLVES CS',
    region: '🇲🇾 Malaysia',
    coach: 'Marcus',
    budget: 100000,
    rank: 18,
    wins: 0,
    losses: 0,
  },
  tacticStyle: 'balanced',
  roster: [
    { id: 'p1', name: 'Marcus', role: 'AWPer', aim: 88, sense: 85, clutch: 90, movement: 84, morale: 95, salary: 4500, value: 35000 },
    { id: 'p2', name: 'Vortex', role: 'IGL', aim: 80, sense: 92, clutch: 82, movement: 78, morale: 90, salary: 3800, value: 28000 },
    { id: 'p3', name: 'Blaze', role: 'Entry', aim: 89, sense: 79, clutch: 80, movement: 88, morale: 88, salary: 3600, value: 26000 },
    { id: 'p4', name: 'Shadow', role: 'Support', aim: 82, sense: 86, clutch: 84, movement: 80, morale: 92, salary: 3200, value: 22000 },
    { id: 'p5', name: 'Echo', role: 'Lurker', aim: 85, sense: 88, clutch: 89, movement: 85, morale: 90, salary: 3400, value: 24000 }
  ],
  market: [
    { id: 'm1', name: 's1mple_fan', role: 'AWPer', aim: 96, sense: 94, clutch: 95, movement: 92, morale: 95, salary: 8500, value: 75000 },
    { id: 'm2', name: 'ZywOo_JR', role: 'AWPer', aim: 95, sense: 96, clutch: 94, movement: 90, morale: 96, salary: 8200, value: 72000 },
    { id: 'm3', name: 'NiKo_Rifle', role: 'Entry', aim: 97, sense: 90, clutch: 88, movement: 91, morale: 90, salary: 7800, value: 68000 },
    { id: 'm4', name: 'ropz_Lurk', role: 'Lurker', aim: 92, sense: 97, clutch: 96, movement: 89, morale: 94, salary: 7500, value: 65000 },
    { id: 'm5', name: 'm0NESY_Flick', role: 'AWPer', aim: 95, sense: 92, clutch: 93, movement: 95, morale: 92, salary: 7900, value: 70000 },
    { id: 'm6', name: 'b1t_OneTap', role: 'Entry', aim: 94, sense: 88, clutch: 86, movement: 87, morale: 90, salary: 5500, value: 45000 }
  ],
  hltvRankings: [
    { rank: 1, name: 'Natus Vincere', region: '🇺🇦 Ukraine', points: 985, winLoss: '24-4' },
    { rank: 2, name: 'Team Vitality', region: '🇫🇷 France', points: 940, winLoss: '22-5' },
    { rank: 3, name: 'FaZe Clan', region: '🇪🇺 Europe', points: 890, winLoss: '20-7' },
    { rank: 4, name: 'G2 Esports', region: '🇪🇺 Europe', points: 850, winLoss: '19-8' },
    { rank: 5, name: 'MOUZ', region: '🇪🇺 Europe', points: 810, winLoss: '17-9' },
    { rank: 6, name: 'Astralis', region: '🇩🇰 Denmark', points: 760, winLoss: '16-10' },
    { rank: 7, name: 'Heroic', region: '🇩🇰 Denmark', points: 720, winLoss: '15-11' },
    { rank: 8, name: 'FURIA Esports', region: '🇧🇷 Brazil', points: 680, winLoss: '14-12' },
    { rank: 18, name: 'CYBER WOLVES CS', region: '🇲🇾 Malaysia', points: 340, winLoss: '0-0' }
  ],
  currentMatch: null
};

let gameState = JSON.parse(JSON.stringify(defaultGameState));

// DOM Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  initTabs();
  initEvents();
  renderAll();
});

/* ==========================================================================
   1. GAME STORAGE & STATE CONTROLLER
   ========================================================================== */
function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  showToast('游戏进度与战队战绩已自动保存！💾');
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      gameState = JSON.parse(saved);
    } catch (e) {
      gameState = JSON.parse(JSON.stringify(defaultGameState));
    }
  }
  if (!gameState.currentMatch) {
    initNewMatch('FaZe Clan');
  }
}

function showToast(msg) {
  const toast = document.getElementById('game-toast');
  const text = document.getElementById('toast-text');
  if (toast && text) {
    text.textContent = msg;
    toast.classList.remove('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
    }, 2500);
  }
}

/* ==========================================================================
   2. TAB NAVIGATION SYSTEM
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  document.querySelectorAll('[data-tab-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab-goto'));
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `tab-${tabId}`) content.classList.remove('hidden');
    else content.classList.add('hidden');
  });
}

/* ==========================================================================
   3. EVENT LISTENERS
   ========================================================================== */
function initEvents() {
  // Save Game Button
  document.getElementById('btn-save-game')?.addEventListener('click', saveGame);

  // New Club Modal Open/Close
  const modal = document.getElementById('modal-new-club');
  document.getElementById('btn-new-club')?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });
  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  // New Club Form Submit
  document.getElementById('form-new-club')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('input-club-name').value.trim();
    const regionInput = document.getElementById('input-club-region').value;
    const coachInput = document.getElementById('input-coach-name').value.trim();

    if (!nameInput) return;

    gameState.club.name = nameInput.toUpperCase();
    gameState.club.region = regionInput;
    gameState.club.coach = coachInput || 'Marcus';
    gameState.club.budget = 100000;
    gameState.club.wins = 0;
    gameState.club.losses = 0;
    gameState.club.rank = 18;

    // Reset HLTV User Entry
    const userEntry = gameState.hltvRankings.find(r => r.rank === 18);
    if (userEntry) {
      userEntry.name = gameState.club.name;
      userEntry.region = gameState.club.region;
      userEntry.winLoss = '0-0';
    }

    initNewMatch('FaZe Clan');
    saveGame();
    renderAll();
    modal?.classList.add('hidden');
    showToast(`成功创建战队 [${gameState.club.name}]！加油冲击 Major 冠军！`);
  });

  // Tactic Selector
  document.getElementById('select-tactic-style')?.addEventListener('change', (e) => {
    gameState.tacticStyle = e.target.value;
    saveGame();
    showToast(`战术风格更新为: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Match Action Buttons
  document.getElementById('dash-btn-play')?.addEventListener('click', () => {
    switchTab('match');
  });

  document.getElementById('btn-sim-round')?.addEventListener('click', simulateRound);
  document.getElementById('btn-sim-auto')?.addEventListener('click', autoPlayMatch);
  document.getElementById('btn-reset-match')?.addEventListener('click', () => {
    const opps = ['Natus Vincere', 'Team Vitality', 'FaZe Clan', 'G2 Esports', 'Astralis'];
    const randomOpp = opps[Math.floor(Math.random() * opps.length)];
    initNewMatch(randomOpp);
    renderMatchUI();
    showToast(`已开始与 ${randomOpp} 的全新对抗赛！`);
  });
}

/* ==========================================================================
   4. CS MATCH ENGINE & CS ECONOMY SIMULATION
   ========================================================================== */
function initNewMatch(oppName) {
  gameState.currentMatch = {
    opponent: oppName,
    roundNum: 1,
    scoreMy: 0,
    scoreOpp: 0,
    mySide: 'CT',
    oppSide: 'T',
    myMoney: 4000,
    oppMoney: 4000,
    myBuyType: 'PISTOL',
    oppBuyType: 'PISTOL',
    myLossStreak: 0,
    oppLossStreak: 0,
    killFeed: [],
    isFinished: false
  };
}

function simulateRound() {
  const match = gameState.currentMatch;
  if (!match || match.isFinished) {
    showToast('本场比赛已结束！请点击重新开始以匹配新对手。');
    return;
  }

  // 1. Calculate Economy & Buy Types for Round
  if (match.roundNum === 1 || match.roundNum === 13) {
    match.myBuyType = 'PISTOL ($800)';
    match.oppBuyType = 'PISTOL ($800)';
  } else {
    match.myBuyType = match.myMoney >= 4200 ? 'FULL BUY (AK-47/AWP + 护甲)' : (match.myMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE ($1,000)');
    match.oppBuyType = match.oppMoney >= 4200 ? 'FULL BUY (AK-47/AWP + 护甲)' : (match.oppMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE ($1,000)');
  }

  // 2. Calculate Win Probability based on Player Aim, Tactics, Morale & Economy
  const avgAim = gameState.roster.reduce((sum, p) => sum + p.aim, 0) / 5;
  const avgClutch = gameState.roster.reduce((sum, p) => sum + p.clutch, 0) / 5;
  
  let myPower = avgAim * 0.5 + avgClutch * 0.3 + (match.myMoney / 16000) * 20;
  let oppPower = 85 * 0.5 + 85 * 0.3 + (match.oppMoney / 16000) * 20;

  // Tactical Modifier
  if (gameState.tacticStyle === 'aggressive') myPower += 5;
  if (gameState.tacticStyle === 'defensive') myPower += 3;

  const winProb = myPower / (myPower + oppPower);
  const myWon = Math.random() < winProb;

  // 3. Generate Live Kill Feed Events
  const killer = gameState.roster[Math.floor(Math.random() * gameState.roster.length)];
  const weapons = ['AK-47', 'M4A1-S', 'AWP', 'Desert Eagle', 'MP9'];
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];

  let roundLog = [];
  roundLog.push(`--- 回合 ${match.roundNum} 开始 (${match.mySide} vs ${match.oppSide}) ---`);

  if (myWon) {
    match.scoreMy++;
    match.oppLossStreak++;
    match.myLossStreak = 0;

    // Money payout
    match.myMoney = Math.min(16000, match.myMoney + 3250);
    const oppLossBonus = 1400 + Math.min(match.oppLossStreak * 500, 2000);
    match.oppMoney = Math.min(16000, match.oppMoney + oppLossBonus);

    const isClutch = Math.random() < 0.25;
    if (isClutch) {
      roundLog.push(`💥 [CLUTCH 1v2] ${killer.name} 心态爆发，用 ${weapon} 完成极限收尾！`);
    } else {
      roundLog.push(`🎯 [首杀] ${killer.name} 使用 ${weapon} 爆头击杀对手突破手！`);
      roundLog.push(`💣 [安放/拆除] 战队协同配合，顺利拿下本回合！`);
    }
  } else {
    match.scoreOpp++;
    match.myLossStreak++;
    match.oppLossStreak = 0;

    match.oppMoney = Math.min(16000, match.oppMoney + 3250);
    const myLossBonus = 1400 + Math.min(match.myLossStreak * 500, 2000);
    match.myMoney = Math.min(16000, match.myMoney + myLossBonus);

    roundLog.push(`⚠️ 对手枪法压制，爆破点突破成功。`);
    roundLog.push(`❌ 我方未能完成回防 (Retake)，遗憾输掉本回合。`);
  }

  match.killFeed.unshift(...roundLog.reverse());
  match.roundNum++;

  // Check Match End (MR12: first to 13 rounds)
  if (match.scoreMy >= 13 || match.scoreOpp >= 13) {
    match.isFinished = true;
    finishMatch();
  }

  renderMatchUI();
}

function autoPlayMatch() {
  const match = gameState.currentMatch;
  if (!match || match.isFinished) return;

  const interval = setInterval(() => {
    if (match.isFinished) {
      clearInterval(interval);
    } else {
      simulateRound();
    }
  }, 150);
}

function finishMatch() {
  const match = gameState.currentMatch;
  const won = match.scoreMy > match.scoreOpp;

  if (won) {
    gameState.club.wins++;
    gameState.club.budget += 25000; // Prize Money
    if (gameState.club.rank > 1) gameState.club.rank--;
    showToast(`🏆 恭喜获得胜利！赢取赛场奖金 $25,000，HLTV 世界排名上升至 #${gameState.club.rank}！`);
  } else {
    gameState.club.losses++;
    gameState.club.budget += 8000;
    if (gameState.club.rank < 30) gameState.club.rank++;
    showToast(`💔 遗憾失利，获得参与奖金 $8,000。继续调整阵容再战！`);
  }

  // Update HLTV Record
  const userEntry = gameState.hltvRankings.find(r => r.name === gameState.club.name);
  if (userEntry) {
    userEntry.winLoss = `${gameState.club.wins}-${gameState.club.losses}`;
    userEntry.rank = gameState.club.rank;
  }

  saveGame();
  renderAll();
}

/* ==========================================================================
   5. RENDER ENGINE (UI RENDERING)
   ========================================================================== */
function renderAll() {
  renderHeader();
  renderDashboard();
  renderRoster();
  renderTransfers();
  renderMatchUI();
  renderRankings();
}

function renderHeader() {
  const c = gameState.club;
  document.getElementById('header-club-name').textContent = c.name;
  document.getElementById('header-budget').textContent = `$${c.budget.toLocaleString()}`;
  document.getElementById('header-rank').textContent = `#${c.rank} WORLD`;
  document.getElementById('header-record').textContent = `${c.wins}胜 - ${c.losses}负`;
}

function renderDashboard() {
  const c = gameState.club;
  document.getElementById('dash-next-opp').textContent = gameState.currentMatch?.opponent || 'FaZe Clan';
  document.getElementById('dash-avg-aim').textContent = (gameState.roster.reduce((s, p) => s + p.aim, 0) / 5).toFixed(1);
  document.getElementById('dash-avg-tactics').textContent = (gameState.roster.reduce((s, p) => s + p.sense, 0) / 5).toFixed(1);
  document.getElementById('dash-avg-morale').textContent = Math.round(gameState.roster.reduce((s, p) => s + p.morale, 0) / 5) + '%';
  document.getElementById('dash-monthly-salary').textContent = `$${gameState.roster.reduce((s, p) => s + p.salary, 0).toLocaleString()}`;

  // Roster Snapshot
  const list = document.getElementById('dash-roster-list');
  if (list) {
    list.innerHTML = gameState.roster.map(p => `
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">${p.role}</span>
          <span class="font-bold text-white">${p.name}</span>
        </div>
        <div class="flex items-center gap-4 text-slate-400">
          <span>🎯 Aim: <strong class="text-emerald-400">${p.aim}</strong></span>
          <span>💥 Clutch: <strong class="text-cyan-400">${p.clutch}</strong></span>
          <span>💰 月薪: <strong class="text-slate-200">$${p.salary}</strong></span>
        </div>
      </div>
    `).join('');
  }

  // News
  const news = document.getElementById('dash-news-list');
  if (news) {
    news.innerHTML = `
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
        🔥 <strong class="text-amber-400">[HLTV]</strong> 战队 <strong>${c.name}</strong> 正式建立，目标角逐 IEM Katowice 资格！
      </div>
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
        💰 俱乐部可用转会预算为 <strong>$${c.budget.toLocaleString()}</strong>。转会市场已有明星选手挂牌！
      </div>
    `;
  }
}

function renderRoster() {
  const cards = document.getElementById('roster-full-cards');
  if (!cards) return;

  cards.innerHTML = gameState.roster.map(p => `
    <div class="rounded-xl bg-cs-card border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-xl relative group hover:border-amber-500/50 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">${p.role}</span>
        <span class="text-slate-500 text-[10px]">VALUE: $${(p.value/1000).toFixed(0)}k</span>
      </div>

      <div class="text-base font-extrabold text-white">${p.name}</div>

      <div class="space-y-1.5 pt-1 text-[11px]">
        <div class="flex justify-between"><span>Aim 枪法:</span><strong class="text-emerald-400">${p.aim}</strong></div>
        <div class="flex justify-between"><span>Sense 意识:</span><strong class="text-cyan-400">${p.sense}</strong></div>
        <div class="flex justify-between"><span>Clutch 残局:</span><strong class="text-amber-400">${p.clutch}</strong></div>
        <div class="flex justify-between"><span>Speed 身法:</span><strong class="text-purple-400">${p.movement}</strong></div>
        <div class="flex justify-between"><span>Morale 士气:</span><strong class="text-slate-200">${p.morale}%</strong></div>
      </div>

      <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>月薪: $${p.salary}</span>
        <span class="text-emerald-400">首发契约</span>
      </div>
    </div>
  `).join('');
}

function renderTransfers() {
  document.getElementById('market-budget-display').textContent = `$${gameState.club.budget.toLocaleString()}`;
  const grid = document.getElementById('market-players-grid');
  if (!grid) return;

  grid.innerHTML = gameState.market.map(p => `
    <div class="rounded-xl bg-cs-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl hover:border-emerald-500/40 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">${p.role}</span>
        <span class="text-emerald-400 font-bold text-sm">$${p.value.toLocaleString()}</span>
      </div>

      <div>
        <div class="text-lg font-extrabold text-white">${p.name}</div>
        <div class="text-slate-400 text-[11px]">期望月薪: $${p.salary}/月</div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div>Aim 枪力: <strong class="text-emerald-400">${p.aim}</strong></div>
        <div>Sense 意识: <strong class="text-cyan-400">${p.sense}</strong></div>
        <div>Clutch 残局: <strong class="text-amber-400">${p.clutch}</strong></div>
        <div>Speed 身法: <strong class="text-purple-400">${p.movement}</strong></div>
      </div>

      <button onclick="buyPlayer('${p.id}')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">
        💰 签约该选手 ($${p.value.toLocaleString()})
      </button>
    </div>
  `).join('');
}

window.buyPlayer = function(playerId) {
  const p = gameState.market.find(m => m.id === playerId);
  if (!p) return;

  if (gameState.club.budget < p.value) {
    showToast('资金不足！无法完成该选手的转会签约。');
    return;
  }

  gameState.club.budget -= p.value;
  // Replace lowest aim player
  gameState.roster.sort((a, b) => a.aim - b.aim);
  const replaced = gameState.roster.shift();

  gameState.roster.push(p);
  gameState.market = gameState.market.filter(m => m.id !== playerId);

  saveGame();
  renderAll();
  showToast(`🎉 成功签约明星选手 [${p.name}]！替代了选手的首发位置。`);
};

function renderMatchUI() {
  const m = gameState.currentMatch;
  if (!m) return;

  document.getElementById('match-opp-team-name').textContent = m.opponent;
  document.getElementById('score-my').textContent = m.scoreMy;
  document.getElementById('score-opp').textContent = m.scoreOpp;
  document.getElementById('match-round-counter').textContent = `ROUND ${m.roundNum} / 24`;

  document.getElementById('eco-my-buy-type').textContent = `BUY: ${m.myBuyType}`;
  document.getElementById('eco-opp-buy-type').textContent = `BUY: ${m.oppBuyType}`;
  document.getElementById('eco-my-money').textContent = `$${m.myMoney.toLocaleString()}`;
  document.getElementById('eco-opp-money').textContent = `$${m.oppMoney.toLocaleString()}`;

  const feedBox = document.getElementById('kill-feed-box');
  if (feedBox) {
    if (m.killFeed.length === 0) {
      feedBox.innerHTML = `<div class="text-slate-500 italic">点击“模拟下一回合”开始体验热血 CS 对决...</div>`;
    } else {
      feedBox.innerHTML = m.killFeed.map(log => {
        let cls = 'text-slate-300';
        if (log.includes('---')) cls = 'text-amber-400 font-bold border-t border-slate-800 pt-2';
        else if (log.includes('CLUTCH')) cls = 'text-amber-300 font-bold bg-amber-500/10 p-1 rounded';
        else if (log.includes('爆头') || log.includes('首杀')) cls = 'text-emerald-400 font-bold';
        else if (log.includes('输掉') || log.includes('失败')) cls = 'text-rose-400';
        return `<div class="${cls}">${log}</div>`;
      }).join('');
    }
  }
}

function renderRankings() {
  const tbody = document.getElementById('rankings-tbody');
  if (!tbody) return;

  tbody.innerHTML = gameState.hltvRankings.map(r => `
    <tr class="${r.name === gameState.club.name ? 'bg-amber-500/10 font-bold text-amber-400' : 'hover:bg-slate-900/60'} transition-colors">
      <td class="p-4 font-bold">#${r.rank}</td>
      <td class="p-4 flex items-center gap-2">
        <span>${r.name}</span>
        ${r.name === gameState.club.name ? '<span class="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px]">YOUR CLUB</span>' : ''}
      </td>
      <td class="p-4">${r.region}</td>
      <td class="p-4 text-emerald-400 font-bold">${r.points} pts</td>
      <td class="p-4 text-slate-400">${r.winLoss}</td>
    </tr>
  `).join('');
}
