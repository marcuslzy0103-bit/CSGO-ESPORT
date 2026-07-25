/**
 * COUNTER-MANAGER 2026 // CS:GO & CS2 ESPORTS SIMULATION ENGINE
 * Robust Bug-Fixed Engine with Halftime Side Swaps, Map BP, Bench Management, & CS Economy.
 */

const STORAGE_KEY = 'cs_manager_save_v3';

// 初始默认战队状态
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
  bench: [], // 替补席
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
let autoPlayInterval = null;

// 初始化入口
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  initTabs();
  initEvents();
  renderAll();
});

/* ==========================================================================
   1. 存档与状态控制器 (Storage Controller)
   ========================================================================== */
function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  showToast('游戏进度与战力已成功保存！💾');
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      gameState = JSON.parse(saved);
      if (!gameState.bench) gameState.bench = [];
    } catch (e) {
      gameState = JSON.parse(JSON.stringify(defaultGameState));
    }
  } else {
    gameState = JSON.parse(JSON.stringify(defaultGameState));
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
   2. TAB 切换控制 (Tab Controller)
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
   3. 事件监听 (Event Listeners)
   ========================================================================== */
function initEvents() {
  // 保存游戏
  document.getElementById('btn-save-game')?.addEventListener('click', saveGame);

  // 新建战队模态框
  const modal = document.getElementById('modal-new-club');
  document.getElementById('btn-new-club')?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });
  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  // 创建战队表单提交
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
    gameState.bench = [];

    // 更新 HLTV 排名前排
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
    showToast(`成功创立战队 [${gameState.club.name}]！准备进军 Major 赛场！`);
  });

  // 战术风格下拉菜单
  document.getElementById('select-tactic-style')?.addEventListener('change', (e) => {
    gameState.tacticStyle = e.target.value;
    saveGame();
    showToast(`战术风格已调整为: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // 比赛按钮
  document.getElementById('dash-btn-play')?.addEventListener('click', () => {
    switchTab('match');
  });

  document.getElementById('btn-sim-round')?.addEventListener('click', simulateRound);
  document.getElementById('btn-sim-auto')?.addEventListener('click', autoPlayMatch);
  document.getElementById('btn-reset-match')?.addEventListener('click', () => {
    stopAutoPlay();
    const opps = ['Natus Vincere', 'Team Vitality', 'FaZe Clan', 'G2 Esports', 'Astralis'];
    const randomOpp = opps[Math.floor(Math.random() * opps.length)];
    initNewMatch(randomOpp);
    renderMatchUI();
    showToast(`已成功匹配新对手 ${randomOpp}！`);
  });
}

/* ==========================================================================
   4. CS 比赛模拟引擎 (CS ECONOMY & HLTV LIVE SIMULATOR)
   ========================================================================== */
const MAP_POOL = ['de_inferno', 'de_mirage', 'de_nuke', 'de_anubis', 'de_ancient'];

function initNewMatch(oppName) {
  stopAutoPlay();
  
  // 地图 BP 禁选
  const selectedMap = MAP_POOL[Math.floor(Math.random() * MAP_POOL.length)];
  const banned = MAP_POOL.filter(m => m !== selectedMap).slice(0, 2);

  gameState.currentMatch = {
    opponent: oppName,
    mapInfo: { selected: selectedMap.toUpperCase() },
    bannedMaps: banned.map(m => m.toUpperCase()),
    roundNum: 1,
    scoreMy: 0,
    scoreOpp: 0,
    mySide: 'CT',
    oppSide: 'T',
    myMoney: 800,
    oppMoney: 800,
    myBuyType: 'PISTOL ($800)',
    oppBuyType: 'PISTOL ($800)',
    myLossStreak: 0,
    oppLossStreak: 0,
    killFeed: [],
    isFinished: false
  };
}

function simulateRound() {
  const match = gameState.currentMatch;
  if (!match || match.isFinished) {
    stopAutoPlay();
    showToast('本场比赛已结束！点击“重新开始”匹配新对手。');
    return;
  }

  // 1. 半场换边逻辑 (MR12: 第 13 回合换边)
  if (match.roundNum === 13) {
    const tempSide = match.mySide;
    match.mySide = match.oppSide;
    match.oppSide = tempSide;

    match.myMoney = 800;
    match.oppMoney = 800;
    match.myLossStreak = 0;
    match.oppLossStreak = 0;
    match.myBuyType = 'PISTOL ($800)';
    match.oppBuyType = 'PISTOL ($800)';

    match.killFeed.unshift(`🔄 --- 半场交换攻防阵营！(现在我方阵营: ${match.mySide}) ---`);
  } else {
    // 买枪与经济判定
    if (match.roundNum === 1) {
      match.myBuyType = 'PISTOL ($800)';
      match.oppBuyType = 'PISTOL ($800)';
    } else {
      match.myBuyType = match.myMoney >= 4200 ? 'FULL BUY (AK-47/AWP + 护甲)' : (match.myMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE ($1,000)');
      match.oppBuyType = match.oppMoney >= 4200 ? 'FULL BUY (AK-47/AWP + 护甲)' : (match.oppMoney >= 2200 ? 'FORCE BUY (Galil + Armor)' : 'ECO SAVE ($1,000)');
    }
  }

  // 2. 胜率算力拟合 (Aim, Sense, Morale & Economy)
  const avgAim = gameState.roster.reduce((sum, p) => sum + p.aim, 0) / 5;
  const avgClutch = gameState.roster.reduce((sum, p) => sum + p.clutch, 0) / 5;

  let myPower = avgAim * 0.5 + avgClutch * 0.3 + (match.myMoney / 16000) * 25;
  let oppPower = 85 * 0.5 + 85 * 0.3 + (match.oppMoney / 16000) * 25;

  // 战术加成
  if (gameState.tacticStyle === 'aggressive') myPower += 6;
  if (gameState.tacticStyle === 'defensive') myPower += 4;

  const winProb = Math.max(0.15, Math.min(0.85, myPower / (myPower + oppPower)));
  const myWon = Math.random() < winProb;

  // 3. Live Kill Feed 生成
  const killer = gameState.roster[Math.floor(Math.random() * gameState.roster.length)];
  const weapons = ['AK-47', 'M4A1-S', 'AWP', 'Desert Eagle', 'MP9'];
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];

  let roundLog = [];
  roundLog.push(`--- 回合 ${match.roundNum} (${match.mySide} vs ${match.oppSide}) ---`);

  if (myWon) {
    match.scoreMy++;
    match.oppLossStreak++;
    match.myLossStreak = 0;

    match.myMoney = Math.min(16000, match.myMoney + 3250);
    const oppLossBonus = 1400 + Math.min(match.oppLossStreak * 500, 2000);
    match.oppMoney = Math.min(16000, match.oppMoney + oppLossBonus);

    if (Math.random() < 0.25) {
      roundLog.push(`💥 [CLUTCH 1v2] ${killer.name} 残局冷静思考，使用 ${weapon} 完成惊天单人收尾！`);
    } else if (Math.random() < 0.3) {
      roundLog.push(`💣 [炸弹安放] 我方精准投掷封烟，顺利在 A 包点安放 C4 爆破！`);
    } else {
      roundLog.push(`🎯 [首杀] ${killer.name} 使用 ${weapon} 爆头击杀对手前压选手！`);
    }
  } else {
    match.scoreOpp++;
    match.myLossStreak++;
    match.oppLossStreak = 0;

    match.oppMoney = Math.min(16000, match.oppMoney + 3250);
    const myLossBonus = 1400 + Math.min(match.myLossStreak * 500, 2000);
    match.myMoney = Math.min(16000, match.myMoney + myLossBonus);

    if (Math.random() < 0.25) {
      roundLog.push(`🛡️ [拆弹成功] 对手回防封烟解弹成功，遗憾丢掉本局。`);
    } else {
      roundLog.push(`⚠️ 对手枪法火力压制，突破点防线告破。`);
    }
  }

  match.killFeed.unshift(...roundLog.reverse());
  match.roundNum++;

  // MR12 胜负判断 (先达 13 分胜利)
  if (match.scoreMy >= 13 || match.scoreOpp >= 13) {
    match.isFinished = true;
    stopAutoPlay();
    finishMatch();
  }

  renderMatchUI();
}

function autoPlayMatch() {
  const match = gameState.currentMatch;
  if (!match || match.isFinished) return;

  if (autoPlayInterval) {
    stopAutoPlay();
    return;
  }

  const btnAuto = document.getElementById('btn-sim-auto');
  if (btnAuto) btnAuto.textContent = '⏸ 暂停自动模拟';

  autoPlayInterval = setInterval(() => {
    if (match.isFinished) {
      stopAutoPlay();
    } else {
      simulateRound();
    }
  }, 180);
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
  const btnAuto = document.getElementById('btn-sim-auto');
  if (btnAuto) btnAuto.textContent = '⚡ 自动模拟整场比赛 (AUTO PLAY)';
}

function finishMatch() {
  const match = gameState.currentMatch;
  const won = match.scoreMy > match.scoreOpp;

  if (won) {
    gameState.club.wins++;
    gameState.club.budget += 25000;
    if (gameState.club.rank > 1) gameState.club.rank--;
    showToast(`🏆 获得胜利 (${match.scoreMy}:${match.scoreOpp})！赢取赛场大奖 $25,000，HLTV 排名上升至 #${gameState.club.rank}！`);
  } else {
    gameState.club.losses++;
    gameState.club.budget += 8000;
    if (gameState.club.rank < 30) gameState.club.rank++;
    showToast(`💔 比赛失利 (${match.scoreMy}:${match.scoreOpp})，获得参与奖金 $8,000。继续调整战术再战！`);
  }

  const userEntry = gameState.hltvRankings.find(r => r.name === gameState.club.name);
  if (userEntry) {
    userEntry.winLoss = `${gameState.club.wins}-${gameState.club.losses}`;
    userEntry.rank = gameState.club.rank;
  }

  saveGame();
  renderAll();
}

/* ==========================================================================
   5. 转会签约与替补席 (TRANSFER & BENCH ENGINE)
   ========================================================================== */
window.buyPlayer = function(playerId) {
  const p = gameState.market.find(m => m.id === playerId);
  if (!p) return;

  if (gameState.club.budget < p.value) {
    showToast('俱乐部资金不足！无法完成该转会交易。');
    return;
  }

  gameState.club.budget -= p.value;

  // 保持阵容同角色替换或移除枪法最低的选手
  let replaceIdx = gameState.roster.findIndex(r => r.role === p.role);
  if (replaceIdx === -1) {
    // 若无同角色，替换枪法最低的选手
    replaceIdx = 0;
    for (let i = 1; i < gameState.roster.length; i++) {
      if (gameState.roster[i].aim < gameState.roster[replaceIdx].aim) replaceIdx = i;
    }
  }

  const replaced = gameState.roster[replaceIdx];
  replaced.morale = Math.max(60, replaced.morale - 15);

  // 转移至替补席
  gameState.bench.push(replaced);
  gameState.roster[replaceIdx] = p;
  gameState.market = gameState.market.filter(m => m.id !== playerId);

  saveGame();
  renderAll();
  showToast(`🎉 成功签约 [${p.name}]！替代了 [${replaced.name}] 的首发位置，原选手进入替补席。`);
};

/* ==========================================================================
   6. 全局 UI 渲染引擎 (UI RENDERING ENGINE)
   ========================================================================== */
function renderAll() {
  renderHeader();
  renderDashboard();
  renderRoster();
  renderBench();
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

  // 薪资计算 (包含首发与替补)
  const rosterSalary = gameState.roster.reduce((s, p) => s + p.salary, 0);
  const benchSalary = (gameState.bench || []).reduce((s, p) => s + p.salary, 0);
  document.getElementById('dash-monthly-salary').textContent = `$${(rosterSalary + benchSalary).toLocaleString()}`;

  // 5人首发快照
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

  // 动态头条新闻
  const news = document.getElementById('dash-news-list');
  if (news) {
    news.innerHTML = `
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
        🔥 <strong class="text-amber-400">[HLTV]</strong> 战队 <strong>${c.name}</strong> 职业生涯全面开启，冲击 Major 冠军资格！
      </div>
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
        💰 俱乐部财务状态良好，可用资金 <strong>$${c.budget.toLocaleString()}</strong>。
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

function renderBench() {
  const benchList = document.getElementById('bench-list');
  if (!benchList) return;

  if (!gameState.bench || gameState.bench.length === 0) {
    benchList.innerHTML = `<div class="text-slate-500 text-xs font-mono italic">替补席暂无选手。从转会市场签约新选手后，原选手将进入替补席。</div>`;
  } else {
    benchList.innerHTML = gameState.bench.map(p => `
      <div class="p-3 rounded-lg bg-slate-950 border border-rose-500/30 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">BENCH</span>
          <span class="font-bold text-white">${p.name}</span>
          <span class="text-slate-500 text-[10px]">(${p.role})</span>
        </div>
        <div class="flex items-center gap-4 text-slate-400">
          <span>🎯 Aim: <strong class="text-emerald-400">${p.aim}</strong></span>
          <span>士气: <strong class="text-amber-400">${p.morale}%</strong></span>
          <span>月薪: <strong class="text-slate-200">$${p.salary}</strong></span>
        </div>
      </div>
    `).join('');
  }
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

function renderMatchUI() {
  const m = gameState.currentMatch;
  if (!m) return;

  document.getElementById('match-opp-team-name').textContent = m.opponent;
  document.getElementById('score-my').textContent = m.scoreMy;
  document.getElementById('score-opp').textContent = m.scoreOpp;
  document.getElementById('match-round-counter').textContent = `ROUND ${m.roundNum} / 24`;

  // 攻防阵营样式与文本
  const mySideText = document.getElementById('match-my-side-text');
  const oppSideText = document.getElementById('match-opp-side-text');
  const myBadge = document.getElementById('badge-my-side');
  const oppBadge = document.getElementById('badge-opp-side');

  if (mySideText && oppSideText && myBadge && oppBadge) {
    mySideText.textContent = `SIDE: ${m.mySide} (${m.mySide === 'CT' ? '防守方' : '进攻方'})`;
    oppSideText.textContent = `SIDE: ${m.oppSide} (${m.oppSide === 'CT' ? '防守方' : '进攻方'})`;
    myBadge.textContent = m.mySide;
    oppBadge.textContent = m.oppSide;

    if (m.mySide === 'CT') {
      myBadge.className = 'w-12 h-12 rounded-xl bg-cs-ct/20 border border-cs-ct/40 flex items-center justify-center font-extrabold text-cs-ct font-mono text-lg';
      oppBadge.className = 'w-12 h-12 rounded-xl bg-cs-t/20 border border-cs-t/40 flex items-center justify-center font-extrabold text-cs-t font-mono text-lg';
    } else {
      myBadge.className = 'w-12 h-12 rounded-xl bg-cs-t/20 border border-cs-t/40 flex items-center justify-center font-extrabold text-cs-t font-mono text-lg';
      oppBadge.className = 'w-12 h-12 rounded-xl bg-cs-ct/20 border border-cs-ct/40 flex items-center justify-center font-extrabold text-cs-ct font-mono text-lg';
    }
  }

  // 地图 BP
  const mapNameEl = document.getElementById('match-map-name');
  if (mapNameEl && m.mapInfo) {
    mapNameEl.textContent = `${m.mapInfo.selected} (${m.mySide} vs ${m.oppSide})`;
  }

  const banInfoEl = document.getElementById('match-ban-info');
  if (banInfoEl && m.bannedMaps) {
    banInfoEl.textContent = `BAN: ${m.bannedMaps.join(', ')}`;
  }

  // 经济与买枪
  document.getElementById('eco-my-buy-type').textContent = `BUY: ${m.myBuyType}`;
  document.getElementById('eco-opp-buy-type').textContent = `BUY: ${m.oppBuyType}`;
  document.getElementById('eco-my-money').textContent = `$${m.myMoney.toLocaleString()}`;
  document.getElementById('eco-opp-money').textContent = `$${m.oppMoney.toLocaleString()}`;

  // Kill Feed 自动置底
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
        else if (log.includes('炸弹')) cls = 'text-orange-400';
        else if (log.includes('拆弹')) cls = 'text-cyan-400';
        return `<div class="${cls}">${log}</div>`;
      }).join('');

      feedBox.scrollTop = feedBox.scrollHeight;
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