/**
 * BADMINTON LIFE PRO 2026 // 羽毛球人生与职业生涯 RPG 模拟引擎
 * Full Engine: 0-38 Life Progression, Free Stat Allocation, Tournament Registration, 2D BWF Court Physics, Hawk-Eye.
 */

const STORAGE_KEY = 'badminton_life_save_v1';

/* ==========================================================================
   STAT DEFINITIONS — 12 维羽毛球专业细分属性矩阵
   ========================================================================== */
const STAT_DEFS = {
  // 💥 杀球与平抽群组
  smashPower:      { name: '💥 双跳重杀爆发力', desc: '决定起跳重杀瞬间爆发力与砸地板杀球最高时速 (最高 450+ km/h)', color: 'text-amber-400', icon: '💥' },
  sliceAngle:      { name: '🔪 滑板与劈杀角度', desc: '决定滑板劈杀斜线角度与切球贴网落地陡峭度', color: 'text-amber-400', icon: '🔪' },
  driveSpeed:      { name: '⚡ 中场平抽快挡',   desc: '决定中后场 200km/h 极速平抽快挡时的反击连贯率', color: 'text-amber-400', icon: '⚡' },

  // ⚡ 身法与防守群组
  footworkCoverage:{ name: '👟 米字步全场覆盖', desc: '决定步法连贯性与前后场四角救球覆盖面积', color: 'text-emerald-400', icon: '👟' },
  recoverySpeed:   { name: '🔄 击球回中启动步', desc: '决定完成杀球/救球后快速收腿回中路防守的速度', color: 'text-emerald-400', icon: '🔄' },
  defenseWall:     { name: '🛡️ 接杀化解起高球', desc: '决定被对手重杀时将球挑深化解进攻或反顶死角的能力', color: 'text-emerald-400', icon: '🛡️' },

  // 🎾 网前与控球群组
  spinNet:         { name: '🌀 贴网滚网搓球', desc: '决定网前放网细腻度，制造擦网过下坠的死角球', color: 'text-cyan-400', icon: '🌀' },
  crossCourtWipe:  { name: '📐 网前快速勾对角', desc: '决定在网前急速改变球路甩勾对角底线的准确度', color: 'text-cyan-400', icon: '📐' },
  killIntercept:   { name: '🏸 网前高点扑球', desc: '决定网前抓对方半高球瞬间高点举拍扑杀速度', color: 'text-cyan-400', icon: '🏸' },

  // 🫁 体能与心智群组
  staminaPool:     { name: '🫁 决胜局体能储备', desc: '决定打满 3 局 60 分钟高强度拉锯战时后半程体能下滑速度', color: 'text-purple-400', icon: '🫁' },
  clutchMindset:   { name: '🫀 Deuce 关键分心智', desc: '决定在 20:20 Deuce 关键分时的稳定度与减少非受迫失误', color: 'text-purple-400', icon: '🫀' },
  deceptionHold:   { name: '🎭 假动作停顿掩护', desc: '决定挥拍做动作时停顿 0.5 秒晃骗对手重心的成功率', color: 'text-purple-400', icon: '🎭' }
};

/* ==========================================================================
   SKILL TREES & SPECIAL MOVES — 4 大羽毛球流派绝技树定义
   ========================================================================== */
const SKILL_TREES = [
  {
    id: 'smash_school',
    name: '💥 全攻重杀流派 (Aggressive Smash School)',
    desc: '追求极限扣杀时速与绝对压制力的进攻流派。',
    color: 'text-amber-400',
    skills: [
      { id: 's1', name: '⚡ 跳杀压线 (Jump Smash Direct)', reqStat: 'smashPower', reqVal: 35, desc: '杀球最高时速 +25km/h，杀球得分率 +15%', icon: '⚡' },
      { id: 's2', name: '🔪 劈杀斜线 (Cross Slicing)', reqStat: 'sliceAngle', reqVal: 55, desc: '陡峭角度劈杀，对手接球出界失误率 +20%', icon: '🔪' },
      { id: 's3', name: '🔥 450km/h 极速重扣 (God of Smash)', reqStat: 'smashPower', reqVal: 75, desc: '【终极奥义】触发金色闪电全屏特效，杀球胜率 +30%', icon: '🔥', isUltimate: true }
    ]
  },
  {
    id: 'defense_school',
    name: '🛡️ 全场拉吊防守流派 (Iron Wall Defense)',
    desc: '依靠严密防守与跑位消耗对手体能的钢铁防线。',
    color: 'text-emerald-400',
    skills: [
      { id: 'd1', name: '🐟 鱼跃扑救 (Diving Save)', reqStat: 'footworkCoverage', reqVal: 35, desc: '被动救起死角球概率 +25%', icon: '🐟' },
      { id: 'd2', name: '🏸 反手底线抽击 (Backhand Deep Clear)', reqStat: 'recoverySpeed', reqVal: 55, desc: '底线被动化解，反手甩出深高远球', icon: '🏸' },
      { id: 'd3', name: '🏰 叹息之墙 (Iron Wall Defense)', reqStat: 'defenseWall', reqVal: 75, desc: '【终极奥义】对手杀球体力消耗 +50%，防守反击胜率 +25%', icon: '🏰', isUltimate: true }
    ]
  },
  {
    id: 'net_school',
    name: '🎾 网前细腻控球流派 (Ghost Net Play)',
    desc: '在贴网处展现出神入化的手感，制造滚网与死角。',
    color: 'text-cyan-400',
    skills: [
      { id: 'n1', name: '🌀 贴网滚网搓球 (Spinning Hair-pin)', reqStat: 'spinNet', reqVal: 35, desc: '羽毛球贴网急坠，逼对方搓球挂网失误', icon: '🌀' },
      { id: 'n2', name: '📐 勾对角死角 (Cross-net Wipe)', reqStat: 'crossCourtWipe', reqVal: 55, desc: '网前快速改变球路推对角死角', icon: '📐' },
      { id: 'n3', name: '👻 网前死神控球 (Ghost Touch)', reqStat: 'killIntercept', reqVal: 75, desc: '【终极奥义】网前小球胜率 +30%，对手下网率 +25%', icon: '👻', isUltimate: true }
    ]
  },
  {
    id: 'deception_school',
    name: '🎭 假动作与心智流派 (Mind Game & Deception)',
    desc: '通过停顿与假动作骗取对手重心，掌控心理主动。',
    color: 'text-purple-400',
    skills: [
      { id: 'm1', name: '⏱️ 动作停顿推后场 (Hold and Flick)', reqStat: 'deceptionHold', reqVal: 35, desc: '动作停顿 0.5 秒晃骗对手重心后甩深球', icon: '⏱️' },
      { id: 'm2', name: '🎭 假杀真吊 (Deceptive Drop Shot)', reqStat: 'deceptionHold', reqVal: 55, desc: '做全力重杀挥拍动作实际网前轻吊', icon: '🎭' },
      { id: 'm3', name: '🫀 心脏骤停 Match Point (CLUTCH GOD)', reqStat: 'clutchMindset', reqVal: 75, desc: '【终极奥义】在 Deuce 与局点关键分抗压胜率 +35%', icon: '🫀', isUltimate: true }
    ]
  }
];

/* ==========================================================================
   DEFAULT GAME STATE — 从 0 岁出生默认游戏状态
   ========================================================================== */
const defaultGameState = {
  player: {
    name: '李宗伟 (Lee Chong Wei)',
    country: '🇲🇾 马来西亚 (Malaysia)',
    ageYears: 16,
    ageWeeks: 24,
    height: 178, // cm
    stage: 'JUNIOR',
    funds: 2500,
    rank: 142,
    statPoints: 0,
    trainingPlan: { primary: 'smashPower', secondary: 'footworkCoverage' },
    stats: {
      smashPower: 58, sliceAngle: 52, driveSpeed: 50,
      footworkCoverage: 55, recoverySpeed: 52, defenseWall: 48,
      spinNet: 54, crossCourtWipe: 50, killIntercept: 46,
      staminaPool: 60, clutchMindset: 55, deceptionHold: 48
    },
    racket: 'Yonex Astrox 88D',
    racketBoosts: { smashPower: 5, spinNet: 3 },
    wins: 28, losses: 6, titles: 3,
    eventLog: [
      '🎉 16 岁入选马来西亚国家青年队，开启 12 维专业羽毛球特训方案！',
      '🏆 赢得市级青少年羽毛球公开赛男单冠军，积累 $800 奖金！',
      '👶 0 岁出生，遗传身高门槛 178 cm，手眼协调天赋判定出色！'
    ],
    trophies: [
      { title: '全国青少年锦标赛 🥇', date: '2025-11-12' },
      { title: '吉隆坡少儿公开赛 🥇', date: '2024-06-18' }
    ]
  },
  currentMatch: null,
  hltvRankings: [
    { rank: 1, name: '安赛龙 (Viktor Axelsen)', country: '🇩🇰 Denmark', points: 104500, titles: 28 },
    { rank: 2, name: '石宇奇 (Shi Yuqi)', country: '🇨🇳 China', points: 98400, titles: 19 },
    { rank: 3, name: '昆拉武特 (Kunlavut Vitidsarn)', country: '🇹🇭 Thailand', points: 91200, titles: 14 },
    { rank: 4, name: '奈良冈功大 (Kodai Naraoka)', country: '🇯🇵 Japan', points: 86500, titles: 11 },
    { rank: 5, name: '李梓嘉 (Lee Zii Jia)', country: '🇲🇾 Malaysia', points: 82100, titles: 12 },
    { rank: 142, name: '李宗伟 (YOU)', country: '🇲🇾 Malaysia', points: 14200, titles: 3 }
  ]
};

let gameState = null;
let autoMatchInterval = null;

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
  showToast('羽毛球生涯进度已成功保存！💾');
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      gameState = JSON.parse(saved);
      migrateState();
    } catch (e) { resetToDefault(); }
  } else { resetToDefault(); }
}

function resetToDefault() {
  gameState = JSON.parse(JSON.stringify(defaultGameState));
}

function migrateState() {
  if (!gameState.player) resetToDefault();
  const p = gameState.player;
  if (p.statPoints === undefined) p.statPoints = 8;
  if (!p.trophies) p.trophies = [];

  // 修复过往存档：按年龄自动修正属性超出天花板的问题，并限制最大可用 TP 为 50 点
  const cap = getAgeStatCap(p.ageYears);
  if (p.stats) {
    Object.keys(p.stats).forEach(statKey => {
      if (p.stats[statKey] > cap) {
        p.stats[statKey] = cap;
      }
    });
  }
  if (p.statPoints > 50) p.statPoints = 35; // 自动修复膨胀的 800+ 点数为合理的 35 TP
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
let autoTrainInterval = null;

function initEvents() {
  document.getElementById('btn-save-game')?.addEventListener('click', saveGame);

  // 多倍速时间快速跨越按键
  document.getElementById('btn-next-week')?.addEventListener('click', () => advanceWeeks(1));
  document.getElementById('btn-next-month')?.addEventListener('click', () => advanceWeeks(4));
  document.getElementById('btn-next-year')?.addEventListener('click', () => advanceWeeks(52));
  document.getElementById('btn-skip-to-18')?.addEventListener('click', skipToAge18);
  document.getElementById('btn-auto-train')?.addEventListener('click', toggleAutoTrain);

  // 从0岁开启新人生 Modal
  const modal = document.getElementById('modal-new-career');
  document.getElementById('btn-new-career')?.addEventListener('click', () => modal?.classList.remove('hidden'));
  document.getElementById('modal-close-btn')?.addEventListener('click', () => modal?.classList.add('hidden'));

  document.getElementById('form-new-career')?.addEventListener('submit', (e) => {
    e.preventDefault();
    stopAutoTrain();
    const name = document.getElementById('input-player-name').value.trim();
    if (!name) return;
    const country = document.getElementById('input-player-country').value;
    const height = Math.floor(Math.random() * 12) + 175;

    // 彻底清空过往一切数据 (比赛状态、奖杯柜、胜负场、排名、资金与属性归零)
    gameState.currentMatch = null;
    gameState.player = {
      name, country,
      ageYears: 0, ageWeeks: 0,
      height,
      stage: 'CHILDHOOD',
      funds: 500,
      rank: 999,
      statPoints: 0,
      trainingPlan: { primary: 'smashPower', secondary: 'footworkCoverage' },
      stats: {
        smashPower: 10, sliceAngle: 10, driveSpeed: 10,
        footworkCoverage: 10, recoverySpeed: 10, defenseWall: 10,
        spinNet: 10, crossCourtWipe: 10, killIntercept: 10,
        staminaPool: 15, clutchMindset: 10, deceptionHold: 10
      },
      racket: '儿童塑料玩具拍', racketBoosts: {},
      wins: 0, losses: 0, titles: 0,
      eventLog: [`👶 0 岁呱呱坠地于 ${country}！遗传预估身高 ${height} cm，开启 12 维专业羽毛球细分成长之路！`],
      trophies: []
    };

    // 重置世界排名数据
    const userEntry = gameState.hltvRankings.find(r => r.name.includes('YOU'));
    if (userEntry) {
      userEntry.name = `${name} (YOU)`;
      userEntry.country = country;
      userEntry.rank = 999;
      userEntry.points = 0;
      userEntry.titles = 0;
    }

    saveGame(); renderAll(); modal?.classList.add('hidden');
    showToast(`👶 重生！[${name}] 0 岁开启全新羽毛球人生，数据已全面归零！`);
  });

  // 比赛按键
  document.getElementById('btn-sim-point')?.addEventListener('click', simulateBadmintonPoint);
  document.getElementById('btn-sim-match-auto')?.addEventListener('click', autoPlayMatch);
}

/* ==========================================================================
   4. WEEK & AGE PROGRESSION — 时间快速跨越与挂机闭关系统
   ========================================================================== */
function getAgeStatCap(ageYears) {
  if (ageYears <= 6) return 25;   // 👶 0~6 岁童年启蒙：上限 25 点
  if (ageYears <= 12) return 50;  // 👦 7~12 岁少儿组：上限 50 点
  if (ageYears <= 17) return 75;  // 🏸 13~17 岁青少年国青队：上限 75 点
  if (ageYears <= 32) return 99;  // 🏆 18~32 岁职业黄金期：上限 99 点
  return 90;                       // 🏅 33+ 岁老将期：上限 90 点
}

function getStatCost(currentVal) {
  if (currentVal >= 75) return 3;
  if (currentVal >= 50) return 2;
  return 1;
}

function advanceWeeks(count = 1, silent = false) {
  const p = gameState.player;
  if (!p.trainingPlan) p.trainingPlan = { primary: 'smash', secondary: 'footwork' };

  let grownStatsCount = 0;
  const cap = getAgeStatCap(p.ageYears);

  for (let i = 0; i < count; i++) {
    p.ageWeeks++;
    if (p.ageWeeks >= 52) {
      p.ageYears++;
      p.ageWeeks = 0;
      if (!silent) p.eventLog.unshift(`🎂 祝贺！年龄增长到了 ${p.ageYears} 岁！身体发育上限提升至 (${getAgeStatCap(p.ageYears)} 点)！`);
    }

    // 判定年龄阶段
    if (p.ageYears < 7) p.stage = 'CHILDHOOD';
    else if (p.ageYears < 13) p.stage = 'PRIMARY';
    else if (p.ageYears < 18) p.stage = 'JUNIOR';
    else if (p.ageYears < 33) p.stage = 'PRO';
    else p.stage = 'VETERAN';

    // 自动训练成长逻辑：每周按设定的【主修】和【辅修】科目自动涨属性！
    const currentCap = getAgeStatCap(p.ageYears);
    const prim = p.trainingPlan.primary;
    const sec = p.trainingPlan.secondary;

    // 主修科目：提升更快
    if (p.stats[prim] < currentCap) {
      p.stats[prim]++;
      grownStatsCount++;
    } else {
      p.funds += 50; // 已满则发放津贴
    }

    // 辅修科目：每 2 周提升 1 点
    if (p.ageWeeks % 2 === 0) {
      if (p.stats[sec] < currentCap) {
        p.stats[sec]++;
        grownStatsCount++;
      } else {
        p.funds += 30;
      }
    }

    if (!silent && Math.random() < 0.15) triggerRandomLifeEvent();
  }

  if (!silent) {
    const primDef = STAT_DEFS[p.trainingPlan.primary]?.name.split(' ')[1] || '训练';
    const secDef = STAT_DEFS[p.trainingPlan.secondary]?.name.split(' ')[1] || '特训';
    if (count > 1) {
      p.eventLog.unshift(`🚀 完成了 ${count} 周【${primDef}】与【${secDef}】特训方案！自动提升了 ${grownStatsCount} 属性点！`);
      showToast(`⚡ 按训练计划快速推进 ${count} 周！属性自动成长 +${grownStatsCount}！`);
    } else {
      p.eventLog.unshift(`🏋️ 本周完成了【${primDef}】与【${secDef}】按计划训练完成！`);
    }
  }

  saveGame(); renderAll();
}

/* ==========================================================================
   5. WEEKLY TRAINING PLANNER CONTROLLER — 每周训练规划控制器
   ========================================================================== */
window.setTrainingFocus = function(statKey, role) {
  const p = gameState.player;
  if (!p.trainingPlan) p.trainingPlan = { primary: 'smash', secondary: 'footwork' };

  if (role === 'primary') {
    if (p.trainingPlan.secondary === statKey) p.trainingPlan.secondary = p.trainingPlan.primary;
    p.trainingPlan.primary = statKey;
  } else {
    if (p.trainingPlan.primary === statKey) p.trainingPlan.primary = p.trainingPlan.secondary;
    p.trainingPlan.secondary = statKey;
  }

  saveGame(); renderAll();
  const name = STAT_DEFS[statKey].name.split(' ')[1];
  showToast(`📋 已将【${name}】设定为每周${role === 'primary' ? '主修' : '辅修'}训练科目！`);
};

window.setTrainingPreset = function(presetType) {
  const p = gameState.player;
  if (!p.trainingPlan) p.trainingPlan = { primary: 'smashPower', secondary: 'footworkCoverage' };

  if (presetType === 'SMASH') {
    p.trainingPlan.primary = 'smashPower'; p.trainingPlan.secondary = 'footworkCoverage';
  } else if (presetType === 'DEFENSE') {
    p.trainingPlan.primary = 'footworkCoverage'; p.trainingPlan.secondary = 'staminaPool';
  } else if (presetType === 'NET') {
    p.trainingPlan.primary = 'spinNet'; p.trainingPlan.secondary = 'crossCourtWipe';
  } else if (presetType === 'STAMINA') {
    p.trainingPlan.primary = 'staminaPool'; p.trainingPlan.secondary = 'clutchMindset';
  }

  saveGame(); renderAll();
  showToast('⚡ 已成功切换训练方案预设！');
};

function skipToAge18() {
  const p = gameState.player;
  if (p.ageYears >= 18) { showToast('你已经达到或超过 18 岁成年期！'); return; }

  // 年龄直接跨越到 18 岁
  p.ageYears = 18;
  p.ageWeeks = 0;
  p.stage = 'PRO';

  // 青少年身体自然基础成长 (平均提升至 35~45 点)
  const baseStats = {
    smashPower: 45, sliceAngle: 40, driveSpeed: 38,
    footworkCoverage: 42, recoverySpeed: 40, defenseWall: 36,
    spinNet: 40, crossCourtWipe: 38, killIntercept: 35,
    staminaPool: 48, clutchMindset: 40, deceptionHold: 36
  };
  Object.keys(baseStats).forEach(k => {
    if ((p.stats[k] || 0) < baseStats[k]) p.stats[k] = baseStats[k];
  });

  p.eventLog.unshift(`⚡ 开启【直达 18 岁成年期】！身体自然成长至 40 OVR 青少年国手基准，正式进军成年 BWF 职业巡回赛！`);
  showToast(`⚡ 直达 18 岁成年期！已进入成年 BWF 职业赛战场！`);
  saveGame(); renderAll();
}

function toggleAutoTrain() {
  const btn = document.getElementById('btn-auto-train');
  if (autoTrainInterval) {
    stopAutoTrain();
  } else {
    autoTrainInterval = setInterval(() => {
      advanceWeeks(1, true);
    }, 120);
    if (btn) {
      btn.textContent = '⏸ 停止自动闭关';
      btn.className = 'w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all animate-pulse';
    }
    showToast('🔄 已开启【自动闭关挂机】！属性点在快速飙升中...');
  }
}

function stopAutoTrain() {
  if (autoTrainInterval) {
    clearInterval(autoTrainInterval);
    autoTrainInterval = null;
    const btn = document.getElementById('btn-auto-train');
    if (btn) {
      btn.textContent = '🔄 开启自动闭关挂机';
      btn.className = 'w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold transition-all';
    }
    showToast('已暂停自动闭关。');
  }
}

function triggerRandomLifeEvent() {
  const p = gameState.player;
  const roll = Math.random();
  const cap = getAgeStatCap(p.ageYears);

  if (roll < 0.15) {
    p.funds += 100;
    p.eventLog.unshift(`💰 获得地方羽协青少年训练津贴 +$100！`);
  } else if (roll < 0.25) {
    if (p.stats.footwork < cap) {
      p.stats.footwork++;
      p.eventLog.unshift(`👟 经过一周多球步法特训，【身法步法】永久 +1！`);
    }
  } else if (roll < 0.35) {
    if (p.stats.smash < cap) {
      p.stats.smash++;
      p.eventLog.unshift(`💥 练习中连续完成 50 次双跳重杀，【杀球爆发力】永久 +1！`);
    }
  }
}

/* ==========================================================================
   5. STAT ALLOCATION CONTROLLER — 自由属性加点控制器 (带年龄天花板限制)
   ========================================================================== */
window.addStatPoint = function(statKey) {
  const p = gameState.player;
  const currentVal = p.stats[statKey];
  const cap = getAgeStatCap(p.ageYears);
  const cost = getStatCost(currentVal);

  if (currentVal >= cap) {
    showToast(`👶 你当前只有 ${p.ageYears} 岁 (${p.stage})，幼年身体发育限制该属性上限为 ${cap} 点！请随着年龄增长解锁上限。`);
    return;
  }

  if (p.statPoints < cost) {
    showToast(`可用加点不足！提升此高阶属性需要 ${cost} TP。`);
    return;
  }

  p.stats[statKey]++;
  p.statPoints -= cost;
  saveGame(); renderAll();
  showToast(`${STAT_DEFS[statKey].name} 提升至 ${p.stats[statKey]}！`);
};

window.subStatPoint = function(statKey) {
  const p = gameState.player;
  if (p.stats[statKey] <= 15) return;
  const cost = getStatCost(p.stats[statKey] - 1);
  p.stats[statKey]--;
  p.statPoints += cost;
  saveGame(); renderAll();
};

/* ==========================================================================
   6. TOURNAMENT SYSTEM — 自由比赛报名系统 (年龄门槛严格判定)
   ========================================================================== */
const TOURNAMENTS = [
  { id: 'j1', name: '🌱 社区少儿羽毛球公开赛', minAge: 7, maxAge: 12, reqRank: 999, fee: 50, prize: 300, pts: 500, region: '本地' },
  { id: 'j2', name: '👦 全国中学生羽毛球锦标赛', minAge: 13, maxAge: 18, reqRank: 999, fee: 200, prize: 1500, pts: 1500, region: '全国' },
  { id: 'b1', name: '🌍 BWF 国际挑战赛 (International Challenge)', minAge: 16, maxAge: 99, reqRank: 500, fee: 400, prize: 3000, pts: 3500, region: '亚洲/欧洲' },
  { id: 'b2', name: '🟢 BWF Super 300 (德国公开赛)', minAge: 17, maxAge: 99, reqRank: 200, fee: 800, prize: 12000, pts: 7000, region: '🇩🇪 德国' },
  { id: 'b3', name: '🟡 BWF Super 500 (韩国公开赛)', minAge: 18, maxAge: 99, reqRank: 100, fee: 1500, prize: 25000, pts: 9200, region: '🇰🇷 韩国' },
  { id: 'b4', name: '🔵 BWF Super 750 (日本公开赛)', minAge: 18, maxAge: 99, reqRank: 50, fee: 3000, prize: 50000, pts: 11000, region: '🇯🇵 日本' },
  { id: 'b5', name: '🏆 BWF Super 1000 (全英公开赛 All England)', minAge: 18, maxAge: 99, reqRank: 32, fee: 5000, prize: 120000, pts: 12000, region: '🇬🇧 英国' },
  { id: 'b6', name: '🥇 奥运会羽毛球男单比赛 (Olympic Games)', minAge: 18, maxAge: 99, reqRank: 16, fee: 0, prize: 250000, pts: 15000, region: '🇫🇷 巴黎' },
];

window.enterTournament = function(tourneyId) {
  const tourney = TOURNAMENTS.find(t => t.id === tourneyId);
  if (!tourney) return;
  const p = gameState.player;

  if (p.ageYears < tourney.minAge) { showToast(`👶 你只有 ${p.ageYears} 岁，未达到参赛最低年龄 (${tourney.minAge} 岁)！`); return; }
  if (p.ageYears > tourney.maxAge) { showToast(`你已超龄 (${p.ageYears} 岁)，无法报名 ${tourney.maxAge} 岁限制组比赛！`); return; }
  if (p.funds < tourney.fee) { showToast(`资金不足！报名需要 $${tourney.fee}。`); return; }
  if (p.rank > tourney.reqRank) { showToast(`BWF 排名不足！需要排名世界前 #${tourney.reqRank}。`); return; }

  p.funds -= tourney.fee;

  // 匹配对手
  const oppNames = ['安赛龙 (Axelsen)', '石宇奇 (Shi Yuqi)', '昆拉武特', '奈良冈功大', '李梓嘉', '常山干太', '周天成'];
  const randomOpp = oppNames[Math.floor(Math.random() * oppNames.length)];
  const oppOvr = Math.min(96, Math.max(50, p.rank < 20 ? 92 : p.rank < 100 ? 82 : 65));

  gameState.currentMatch = {
    tourney,
    oppName: randomOpp,
    oppOvr,
    myScore: 0, oppScore: 0,
    mySets: 0, oppSets: 0,
    currentSet: 1,
    killLog: [],
    isFinished: false
  };

  saveGame(); renderAll(); switchTab('court');
  initBadmintonCanvas();
  showToast(`成功报名 [${tourney.name}]！前往球场迎战 ${randomOpp}！`);
};

/* ==========================================================================
   7. 2D COURT ENGINE — 2D BWF 实时羽毛球物理与 60FPS 观战引擎
   ========================================================================== */
let courtCanvas = null;
let courtCtx = null;
let courtAnimationId = null;

let courtEntities = {
  myPlayer: { x: 400, y: 340, targetX: 400, targetY: 340, color: '#10b981', swingAnim: 0 },
  oppPlayer: { x: 400, y: 110, targetX: 400, targetY: 110, color: '#f43f5e', swingAnim: 0 },
  shuttle: {
    x: 400, y: 225, z: 0,
    startX: 400, startY: 225,
    targetX: 400, targetY: 225,
    progress: 1, speed: 0.04,
    arcHeight: 50,
    isSmash: false,
    trail: []
  },
  lastShotName: '',
  smashSpeed: 0
};

function initBadmintonCanvas() {
  courtCanvas = document.getElementById('badminton-canvas');
  if (!courtCanvas) return;
  courtCtx = courtCanvas.getContext('2d');
  if (!courtAnimationId) {
    courtAnimationId = requestAnimationFrame(courtLoop);
  }
}

let rallyEngine = {
  inRally: false,
  shotIndex: 0,
  rallySequence: [],
  winnerSide: 'MY',
  finalShotType: 'SMASH'
};

function triggerShuttleShot(fromSide, shotType, targetLoc) {
  const s = courtEntities.shuttle;
  const myP = courtEntities.myPlayer;
  const oppP = courtEntities.oppPlayer;

  s.startX = s.x;
  s.startY = s.y;
  s.progress = 0;
  s.trail = [];

  const minX = 205, maxX = 595;
  const nearMinY = 240, nearMaxY = 380;
  const farMinY = 60, farMaxY = 210;

  if (fromSide === 'MY') { // 我方击球，打往远场对手半场
    myP.targetX = Math.max(minX, Math.min(maxX, s.x));
    myP.targetY = Math.max(nearMinY, Math.min(nearMaxY, s.y));
    myP.swingAnim = 1;

    s.targetX = targetLoc ? targetLoc.x : Math.floor(Math.random() * (maxX - minX)) + minX;
    s.targetY = targetLoc ? targetLoc.y : Math.floor(Math.random() * (farMaxY - farMinY)) + farMinY;
    oppP.targetX = s.targetX;
    oppP.targetY = s.targetY;
  } else { // 对手击球，打往近场我方半场
    oppP.targetX = Math.max(minX, Math.min(maxX, s.x));
    oppP.targetY = Math.max(farMinY, Math.min(farMaxY, s.y));
    oppP.swingAnim = 1;

    s.targetX = targetLoc ? targetLoc.x : Math.floor(Math.random() * (maxX - minX)) + minX;
    s.targetY = targetLoc ? targetLoc.y : Math.floor(Math.random() * (nearMaxY - nearMinY)) + nearMinY;
    myP.targetX = s.targetX;
    myP.targetY = s.targetY;
  }

  // 抛物线与速度参数设置
  if (shotType === 'SMASH') {
    s.isSmash = true;
    s.speed = 0.08;
    s.arcHeight = 22; // 陡峭急速下击
    courtEntities.lastShotName = `💥 418 km/h 陡峭重杀!`;
  } else if (shotType === 'CLEAR') {
    s.isSmash = false;
    s.speed = 0.035;
    s.arcHeight = 115; // 深弧线高远球
    courtEntities.lastShotName = `🏸 底线高远球压深`;
  } else if (shotType === 'DROP') {
    s.isSmash = false;
    s.speed = 0.045;
    s.arcHeight = 40; // 网前搓球急坠
    courtEntities.lastShotName = `🎾 网前精妙搓球`;
  } else if (shotType === 'SERVE') {
    s.isSmash = false;
    s.speed = 0.04;
    s.arcHeight = 60; // 比赛发球
    courtEntities.lastShotName = `🏸 比赛发球`;
  } else {
    s.isSmash = false;
    s.speed = 0.055;
    s.arcHeight = 35; // 平抽快挡
    courtEntities.lastShotName = `⚡ 中场平抽快挡`;
  }
}

function simulateBadmintonPoint() {
  const m = gameState.currentMatch;
  if (!m || m.isFinished) { stopAutoMatch(); showToast('本场比赛已结束！'); return; }
  if (rallyEngine.inRally) return; // 正在回合中，防止重复触发

  const p = gameState.player;
  const myOvr = Math.round((p.stats.smash + p.stats.footwork + p.stats.netTouch + p.stats.stamina) / 4);

  const winProb = Math.max(0.15, Math.min(0.85, (myOvr + (p.racketBoosts.smash || 0)) / (myOvr + m.oppOvr)));
  const myWonPoint = Math.random() < winProb;

  // 生成 3 到 7 拍实时多拍回合序列 (Rally sequence)
  const rallyLength = Math.floor(Math.random() * 4) * 2 + 3; // 3, 5, 7 拍
  const shotPool = ['CLEAR', 'DROP', 'DRIVE', 'CLEAR'];
  const sequence = [];

  let currentSide = myWonPoint ? (rallyLength % 2 === 1 ? 'MY' : 'OPP') : (rallyLength % 2 === 1 ? 'OPP' : 'MY');

  sequence.push({ side: currentSide, shot: 'SERVE' });
  currentSide = currentSide === 'MY' ? 'OPP' : 'MY';

  for (let i = 1; i < rallyLength - 1; i++) {
    const shot = shotPool[Math.floor(Math.random() * shotPool.length)];
    sequence.push({ side: currentSide, shot });
    currentSide = currentSide === 'MY' ? 'OPP' : 'MY';
  }

  const finalShot = Math.random() < 0.6 ? 'SMASH' : 'DROP';
  sequence.push({ side: currentSide, shot: finalShot, isFinal: true });

  rallyEngine = {
    inRally: true,
    shotIndex: 0,
    rallySequence: sequence,
    winnerSide: myWonPoint ? 'MY' : 'OPP',
    finalShotType: finalShot
  };

  playNextRallyShot();
}

function playNextRallyShot() {
  if (!rallyEngine.inRally) return;

  const seq = rallyEngine.rallySequence;
  const idx = rallyEngine.shotIndex;

  if (idx < seq.length) {
    const cur = seq[idx];
    triggerShuttleShot(cur.side, cur.shot);
  }
}

function onShuttleReachedTarget() {
  if (!rallyEngine.inRally) return;

  const seq = rallyEngine.rallySequence;
  const idx = rallyEngine.shotIndex;

  if (idx < seq.length - 1) {
    // 还在多拍回合拉锯中，推进到下一拍！
    rallyEngine.shotIndex++;
    setTimeout(playNextRallyShot, 120);
  } else {
    // 最后一拍：羽毛球落地杀球/出界，真正结算 +1 分！
    finishRallyPoint();
  }
}

function finishRallyPoint() {
  rallyEngine.inRally = false;
  const m = gameState.currentMatch;
  if (!m || m.isFinished) return;

  const p = gameState.player;
  const myWonPoint = rallyEngine.winnerSide === 'MY';
  const finalShot = rallyEngine.finalShotType;

  if (finalShot === 'SMASH' && myWonPoint) {
    const speed = Math.floor(Math.random() * 40) + 380;
    courtEntities.smashSpeed = speed;
    const banner = document.getElementById('smash-speed-banner');
    if (banner) {
      banner.textContent = `⚡ MONSTER SMASH! ${speed} km/h!`;
      banner.classList.remove('hidden');
      setTimeout(() => banner.classList.add('hidden'), 1800);
    }
  }

  if (Math.random() < 0.08) {
    const hawkeyeResult = Math.random() < 0.6 ? 'IN! (界内压线 1.8mm)' : 'OUT! (界外出界 3.2mm)';
    const hawkeyeBanner = document.getElementById('hawkeye-banner');
    const hawkeyeText = document.getElementById('hawkeye-result-text');
    if (hawkeyeBanner && hawkeyeText) {
      hawkeyeText.textContent = hawkeyeResult;
      hawkeyeBanner.classList.remove('hidden');
      setTimeout(() => hawkeyeBanner.classList.add('hidden'), 2200);
    }
  }

  // 真正加分！
  if (myWonPoint) {
    m.myScore++;
    m.killLog.unshift(`💥 [得分] ${p.name} 经过 ${seqLength()} 拍精彩拉锯，凭借 ${finalShot === 'SMASH' ? '双跳重杀' : '网前搓球'} 得分！`);
  } else {
    m.oppScore++;
    m.killLog.unshift(`⚠️ 对手 ${m.oppName} 底线突击直线杀球得分。`);
  }

  if ((m.myScore >= 21 || m.oppScore >= 21) && Math.abs(m.myScore - m.oppScore) >= 2) {
    if (m.myScore > m.oppScore) m.mySets++;
    else m.oppSets++;

    m.myScore = 0; m.oppScore = 0;
    m.currentSet++;

    if (m.mySets >= 2 || m.oppSets >= 2) {
      m.isFinished = true;
      stopAutoMatch();
      finishBadmintonMatch();
    }
  }

  renderMatchUI();

  // 如果处于自动模拟状态，在 1.4 秒后自动发起下一回合！
  if (autoMatchInterval && !m.isFinished) {
    setTimeout(() => {
      if (autoMatchInterval && !m.isFinished) simulateBadmintonPoint();
    }, 1400);
  }
}

function seqLength() {
  return rallyEngine.rallySequence ? rallyEngine.rallySequence.length : 5;
}

function autoPlayMatch() {
  if (!gameState.currentMatch || gameState.currentMatch.isFinished) return;
  if (autoMatchInterval) { stopAutoMatch(); return; }
  const btn = document.getElementById('btn-sim-match-auto');
  if (btn) btn.textContent = '⏸ 暂停自动模拟';
  autoMatchInterval = true;
  simulateBadmintonPoint();
}

function stopAutoMatch() {
  autoMatchInterval = false;
  const btn = document.getElementById('btn-sim-match-auto');
  if (btn) btn.textContent = '⚡ 自动模拟整场比赛 (AUTO MATCH)';
}

function finishBadmintonMatch() {
  const m = gameState.currentMatch;
  const won = m.mySets > m.oppSets;
  const p = gameState.player;

  if (won) {
    p.wins++;
    p.funds += m.tourney.prize;
    p.rank = Math.max(1, p.rank - Math.floor(Math.random() * 15 + 5));
    p.titles++;
    p.trophies.push({ title: `${m.tourney.name} 🥇`, date: new Date().toLocaleDateString() });
    p.eventLog.unshift(`🏆 夺冠！赢得 [${m.tourney.name}] 冠军！奖金 $${m.tourney.prize.toLocaleString()}，BWF 排名升至 #${p.rank}！`);
    showToast(`🏆 冠军！获得奖金 $${m.tourney.prize.toLocaleString()}，排名升至 #${p.rank}！`);
  } else {
    p.losses++;
    p.funds += Math.round(m.tourney.prize * 0.2);
    p.eventLog.unshift(`💔 在 [${m.tourney.name}] 中惜败于 ${m.oppName}，获得参与奖 $${Math.round(m.tourney.prize * 0.2)}。`);
    showToast(`💔 惜败，获得参与奖金。继续训练提升能力！`);
  }

  saveGame(); renderAll();
}

function courtLoop() {
  if (courtCtx && courtCanvas) {
    updateCourtPhysics();
    drawBwfCourtScene();
  }
  courtAnimationId = requestAnimationFrame(courtLoop);
}

function updateCourtPhysics() {
  const myP = courtEntities.myPlayer;
  const oppP = courtEntities.oppPlayer;
  const s = courtEntities.shuttle;

  // 1. 球员平滑步法移动 (Lerp interpolation)
  myP.x += (myP.targetX - myP.x) * 0.12;
  myP.y += (myP.targetY - myP.y) * 0.12;

  oppP.x += (oppP.targetX - oppP.x) * 0.12;
  oppP.y += (oppP.targetY - oppP.y) * 0.12;

  // 微小的准备动作双脚颠抖 bounce
  const time = Date.now() * 0.005;
  myP.y += Math.sin(time) * 0.2;
  oppP.y += Math.sin(time + 1) * 0.2;

  // 挥拍动画渐隐
  if (myP.swingAnim > 0) myP.swingAnim -= 0.05;
  if (oppP.swingAnim > 0) oppP.swingAnim -= 0.05;

  // 2. 羽毛球抛物线飞行插值
  if (s.progress < 1) {
    const prevProgress = s.progress;
    s.progress = Math.min(1, s.progress + s.speed);

    s.x = s.startX + (s.targetX - s.startX) * s.progress;
    s.y = s.startY + (s.targetY - s.startY) * s.progress;
    s.z = Math.sin(s.progress * Math.PI) * s.arcHeight;

    // 记录拖尾物理轨迹
    s.trail.push({ x: s.x, y: s.y, z: s.z });
    if (s.trail.length > 10) s.trail.shift();

    // 刚到达目标落点，触发多拍逻辑或落地加分！
    if (s.progress >= 1 && prevProgress < 1) {
      onShuttleReachedTarget();
    }
  }
}

function drawBwfCourtScene() {
  const w = courtCanvas.width;
  const h = courtCanvas.height;

  // 1. BWF 标志性绿色地胶背景
  courtCtx.fillStyle = '#047857';
  courtCtx.fillRect(0, 0, w, h);

  // 2. 绘制标准羽毛球单打/双打白边线
  courtCtx.strokeStyle = '#ffffff';
  courtCtx.lineWidth = 3;

  const cx = 180, cy = 40, cw = 440, ch = 370;
  courtCtx.strokeRect(cx, cy, cw, ch);

  // 双打边线与发球线
  courtCtx.lineWidth = 1.5;
  courtCtx.strokeRect(cx + 25, cy, cw - 50, ch); // 单打边线

  // 中线与前发球线
  const midY = cy + ch / 2;
  courtCtx.beginPath();
  courtCtx.moveTo(cx + cw / 2, cy); courtCtx.lineTo(cx + cw / 2, cy + ch); // 中线
  courtCtx.moveTo(cx, midY - 45); courtCtx.lineTo(cx + cw, midY - 45); // 前发球线 (上)
  courtCtx.moveTo(cx, midY + 45); courtCtx.lineTo(cx + cw, midY + 45); // 前发球线 (下)
  courtCtx.stroke();

  // 3. 绘制中间白网 (Net)
  courtCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  courtCtx.lineWidth = 4;
  courtCtx.beginPath();
  courtCtx.moveTo(cx - 15, midY); courtCtx.lineTo(cx + cw + 15, midY);
  courtCtx.stroke();

  // 网柱 Net Posts
  courtCtx.fillStyle = '#f59e0b';
  courtCtx.fillRect(cx - 18, midY - 6, 8, 12);
  courtCtx.fillRect(cx + cw + 10, midY - 6, 8, 12);

  // 4. 绘制羽毛球地面阴影 & 飞行轨迹 lines (Smash / Trail)
  const s = courtEntities.shuttle;

  // 绘制抛物线拖尾 Lines
  if (s.trail.length > 1) {
    courtCtx.beginPath();
    courtCtx.moveTo(s.trail[0].x, s.trail[0].y - s.trail[0].z);
    for (let i = 1; i < s.trail.length; i++) {
      courtCtx.lineTo(s.trail[i].x, s.trail[i].y - s.trail[i].z);
    }
    courtCtx.strokeStyle = s.isSmash ? '#fbbf24' : 'rgba(254, 240, 138, 0.6)';
    courtCtx.lineWidth = s.isSmash ? 4 : 2;
    if (s.isSmash) {
      courtCtx.shadowColor = '#f59e0b';
      courtCtx.shadowBlur = 15;
    }
    courtCtx.stroke();
    courtCtx.shadowBlur = 0;
  }

  // 羽毛球地面阴影
  const shadowSize = Math.max(2, 6 - s.z * 0.04);
  courtCtx.beginPath();
  courtCtx.ellipse(s.x, s.y, shadowSize * 1.5, shadowSize, 0, 0, Math.PI * 2);
  courtCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  courtCtx.fill();

  // 5. 绘制空中羽毛球 (飞行高程 y - z)
  courtCtx.beginPath();
  courtCtx.arc(s.x, s.y - s.z, 6, 0, Math.PI * 2);
  courtCtx.fillStyle = s.isSmash ? '#f59e0b' : '#ffffff';
  courtCtx.shadowColor = s.isSmash ? '#f59e0b' : '#fef08a';
  courtCtx.shadowBlur = 10;
  courtCtx.fill();
  courtCtx.shadowBlur = 0;
  courtCtx.lineWidth = 1; courtCtx.strokeStyle = '#93c5fd'; courtCtx.stroke();

  // 6. 绘制球员圆点 (近场我方 🟢，远场对手 🔴)
  const my = courtEntities.myPlayer;
  const opp = courtEntities.oppPlayer;

  // 近场我方圆点 & 挥拍光圈
  if (my.swingAnim > 0) {
    courtCtx.beginPath();
    courtCtx.arc(my.x, my.y, 22 * (1 - my.swingAnim), 0, Math.PI * 2);
    courtCtx.strokeStyle = `rgba(16, 185, 129, ${my.swingAnim})`;
    courtCtx.lineWidth = 2; courtCtx.stroke();
  }
  courtCtx.beginPath();
  courtCtx.arc(my.x, my.y, 11, 0, Math.PI * 2);
  courtCtx.fillStyle = '#10b981';
  courtCtx.shadowColor = '#10b981'; courtCtx.shadowBlur = 14;
  courtCtx.fill(); courtCtx.shadowBlur = 0;
  courtCtx.lineWidth = 2.5; courtCtx.strokeStyle = '#ffffff'; courtCtx.stroke();

  // 远场对手圆点 & 挥拍光圈
  if (opp.swingAnim > 0) {
    courtCtx.beginPath();
    courtCtx.arc(opp.x, opp.y, 22 * (1 - opp.swingAnim), 0, Math.PI * 2);
    courtCtx.strokeStyle = `rgba(244, 63, 94, ${opp.swingAnim})`;
    courtCtx.lineWidth = 2; courtCtx.stroke();
  }
  courtCtx.beginPath();
  courtCtx.arc(opp.x, opp.y, 11, 0, Math.PI * 2);
  courtCtx.fillStyle = '#f43f5e';
  courtCtx.shadowColor = '#f43f5e'; courtCtx.shadowBlur = 14;
  courtCtx.fill(); courtCtx.shadowBlur = 0;
  courtCtx.lineWidth = 2.5; courtCtx.strokeStyle = '#ffffff'; courtCtx.stroke();

  // 7. 绘制球场上方击球特效 Banner
  if (courtEntities.lastShotName) {
    courtCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    courtCtx.fillRect(cx + 60, cy + 10, 320, 24);
    courtCtx.strokeStyle = '#f59e0b'; courtCtx.lineWidth = 1;
    courtCtx.strokeRect(cx + 60, cy + 10, 320, 24);

    courtCtx.fillStyle = '#fbbf24';
    courtCtx.font = 'bold 12px monospace';
    courtCtx.textAlign = 'center';
    courtCtx.fillText(courtEntities.lastShotName, cx + 220, cy + 26);
  }

  // 8. 绘制水印标题
  courtCtx.fillStyle = 'rgba(255,255,255,0.4)';
  courtCtx.font = 'bold 11px monospace';
  courtCtx.textAlign = 'left';
  courtCtx.fillText('BWF 60FPS REAL-TIME OBSERVER', 20, 25);
}

/* ==========================================================================
   8. EQUIPMENT SHOP — 球拍装备系统
   ========================================================================== */
const RACKETS = [
  { name: 'Yonex Astrox 100ZZ', price: 1200, boost: '杀球爆发 +8 | 步法 +3', boosts: { smash: 8, footwork: 3 }, desc: '全攻击型重杀神器，安赛龙同款！' },
  { name: 'Victor Thruster RYUGA', price: 1500, boost: '杀球爆发 +10 | 体能 +4', boosts: { smash: 10, stamina: 4 }, desc: '龙牙之刃，极端杀球爆发！' },
  { name: 'Li-Ning N72-II Light', price: 1000, boost: '网前手感 +8 | 身法 +4', boosts: { netTouch: 8, footwork: 4 }, desc: '轻巧控球，网前搓球与对角神器！' }
];

window.buyRacket = function(racketIndex) {
  const r = RACKETS[racketIndex];
  if (!r) return;
  const p = gameState.player;

  if (p.funds < r.price) { showToast(`资金不足！购买需要 $${r.price}。`); return; }

  p.funds -= r.price;
  p.racket = r.name;
  p.racketBoosts = r.boosts;
  saveGame(); renderAll();
  showToast(`🎉 签约装备！换上了 [${r.name}]！`);
};

/* ==========================================================================
   9. RENDER ENGINE — UI 渲染引擎
   ========================================================================== */
function renderAll() {
  renderHeader(); renderDashboard(); renderStats(); renderSkills(); renderTournaments();
  renderMatchUI(); renderShop(); renderRankings();
}

function renderSkills() {
  const p = gameState.player;
  const container = el('skill-trees-container');
  if (!container) return;

  let totalUnlocked = 0;

  container.innerHTML = SKILL_TREES.map(tree => {
    const skillCards = tree.skills.map(skill => {
      const currentVal = p.stats[skill.reqStat] || 0;
      const isUnlocked = currentVal >= skill.reqVal;
      if (isUnlocked) totalUnlocked++;

      return `<div class="p-3.5 rounded-lg border ${isUnlocked ? (skill.isUltimate ? 'bg-amber-500/10 border-amber-500/60 shadow-amber-500/10' : 'bg-slate-900 border-emerald-500/40') : 'bg-slate-950/60 border-slate-800 opacity-60'} space-y-1.5 transition-all font-mono text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold ${isUnlocked ? (skill.isUltimate ? 'text-amber-400 font-black' : 'text-emerald-400') : 'text-slate-400'}">
            ${skill.icon} ${skill.name}
          </span>
          <span class="${isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'} text-[10px]">
            ${isUnlocked ? '✓ 已解锁' : `🔒 需${STAT_DEFS[skill.reqStat].name.split(' ')[1]} ${skill.reqVal}`}
          </span>
        </div>
        <p class="text-slate-300 text-[11px]">${skill.desc}</p>
      </div>`;
    }).join('');

    return `<div class="rounded-xl bg-bwf-card border border-slate-800 p-6 space-y-4 shadow-xl">
      <div class="border-b border-slate-800 pb-3">
        <h3 class="font-bold text-base ${tree.color}">${tree.name}</h3>
        <p class="text-slate-400 text-xs mt-1">${tree.desc}</p>
      </div>
      <div class="space-y-3">
        ${skillCards}
      </div>
    </div>`;
  }).join('');

  setEl('unlocked-skills-count', `${totalUnlocked} / 12`);
}

function el(id) { return document.getElementById(id); }
function setEl(id, txt) { const e = el(id); if (e) e.textContent = txt; }

function renderHeader() {
  const p = gameState.player;
  setEl('header-player-name', `${p.name}`);
  setEl('header-age-badge', `${p.ageYears} 岁 (${p.stage})`);
  setEl('header-funds', `$${p.funds.toLocaleString()}`);
  setEl('header-tp', `${p.statPoints} TP`);
  setEl('header-rank', `#${p.rank} WORLD`);
}

const STAGE_LABELS = {
  CHILDHOOD: '👶 0~6 岁 · 幼年启蒙期 (CHILDHOOD)',
  PRIMARY:   '👦 7~12 岁 · 少儿比赛期 (PRIMARY SCHOOL)',
  JUNIOR:    '🏸 13~17 岁 · 国青试训期 (JUNIOR SQUAD)',
  PRO:       '🏆 18~32 岁 · BWF 职业巡回赛 (PRO TOUR)',
  VETERAN:   '🏅 33+ 岁 · 名人堂老将期 (LEGEND VETERAN)'
};

const STAGE_DESCS = {
  CHILDHOOD: '你尚在幼年学步阶段，身体发育受限制（属性上限 25 点），无法参加正式羽毛球比赛。请快进时间长到 7 岁入学少儿组！',
  PRIMARY:   '你进入了小学并加入羽毛球社团，属性上限提升至 50 点。可以自由报名【社区少儿公开赛】体验首场羽毛球实战！',
  JUNIOR:    '你入选了国家青年队，属性上限提升至 75 点。准备参加全国中学生锦标赛与世青赛 (WJBC)！',
  PRO:       '你进入了成年 BWF 职业巡回赛，属性上限全面解禁至 99 点！报名 S300/S500/S750/S1000 与奥运会，冲刺世界第一！',
  VETERAN:   '你是羽毛球界的传奇老将，虽然体能有些许下滑，但丰厚的经验与假动作依旧独步天下。'
};

function renderDashboard() {
  const p = gameState.player;
  setEl('dash-stage-title', STAGE_LABELS[p.stage] || `${p.ageYears} 岁`);
  setEl('dash-stage-desc', STAGE_DESCS[p.stage] || '');

  setEl('dash-week-num', p.ageWeeks);
  setEl('dash-age-display', `${p.ageYears} 岁 ${p.ageWeeks} 周`);

  const ovr = Math.round((p.stats.smash + p.stats.footwork + p.stats.netTouch + p.stats.stamina) / 4);
  setEl('dash-ovr-display', `${ovr} OVR`);
  setEl('dash-racket-display', p.racket);

  // 准确计算胜率与冠军数 (修复重生后胜率残留 Bug)
  const totalMatches = p.wins + p.losses;
  const winRate = totalMatches > 0 ? ((p.wins / totalMatches) * 100).toFixed(1) : '0.0';
  setEl('dash-record-display', `${p.wins} 胜 - ${p.losses} 负`);
  setEl('dash-record-sub', `胜率 ${winRate}% | 冠军奖杯: ${p.trophies ? p.trophies.length : 0}`);

  // 属性快照
  const snapshot = el('dash-stats-snapshot');
  if (snapshot) {
    snapshot.innerHTML = Object.entries(STAT_DEFS).map(([key, def]) => `
      <div class="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
        <span class="text-slate-300 font-bold">${def.icon} ${def.name.split(' ')[1]}</span>
        <strong class="${def.color}">${p.stats[key]}</strong>
      </div>`).join('');
  }

  // 日志
  const eventLog = el('dash-event-log');
  if (eventLog) {
    eventLog.innerHTML = p.eventLog.map(log => `
      <div class="p-2 rounded bg-slate-950 border border-slate-800/60 text-slate-300">${log}</div>
    `).join('');
  }
}

function renderStats() {
  const p = gameState.player;
  if (!p.trainingPlan) p.trainingPlan = { primary: 'smash', secondary: 'footwork' };
  const cap = getAgeStatCap(p.ageYears);
  setEl('stat-tp-display', `${cap} 点`);

  const grid = el('stat-allocation-cards');
  if (!grid) return;

  grid.innerHTML = Object.entries(STAT_DEFS).map(([key, def]) => {
    const val = p.stats[key];
    const isPrimary = p.trainingPlan.primary === key;
    const isSecondary = p.trainingPlan.secondary === key;
    const isAtCap = val >= cap;

    let borderClass = 'border-slate-800';
    let badgeHtml = '<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">休整中</span>';

    if (isPrimary) {
      borderClass = 'border-amber-500/80 shadow-amber-500/10';
      badgeHtml = '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/50 font-bold text-[10px]">🔥 主修科目 (+1/周)</span>';
    } else if (isSecondary) {
      borderClass = 'border-cyan-500/80 shadow-cyan-500/10';
      badgeHtml = '<span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold text-[10px]">⚡ 辅修科目 (+1/双周)</span>';
    }

    return `<div class="rounded-xl bg-bwf-card border ${borderClass} p-5 space-y-4 font-mono text-xs shadow-xl transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white text-sm">${def.name}</span>
        <div class="text-right">
          <strong class="text-lg font-black ${def.color}">${val}</strong>
          <span class="text-slate-500 text-[10px]"> / ${cap} Max</span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        ${badgeHtml}
        ${isAtCap ? '<span class="text-amber-400 font-bold text-[10px]">🔒 达阶段上限</span>' : ''}
      </div>

      <p class="text-slate-400 text-[11px] h-7">${def.desc}</p>

      <div class="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-400 stat-bar-fill" style="width: ${(val / cap) * 100}%"></div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button onclick="setTrainingFocus('${key}', 'primary')" class="py-2 rounded-lg ${isPrimary ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-[11px] font-bold transition-all">
          ${isPrimary ? '🔥 主修中' : '🎯 设为主修'}
        </button>
        <button onclick="setTrainingFocus('${key}', 'secondary')" class="py-2 rounded-lg ${isSecondary ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-[11px] font-bold transition-all">
          ${isSecondary ? '⚡ 辅修中' : '👟 设为辅修'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function renderTournaments() {
  const p = gameState.player;
  setEl('tourney-funds-display', `$${p.funds.toLocaleString()}`);
  setEl('tourney-rank-display', `#${p.rank}`);
  const grid = el('tournaments-grid');
  if (!grid) return;

  if (p.ageYears < 7) {
    grid.innerHTML = `<div class="col-span-2 p-8 rounded-xl bg-slate-950 border border-amber-500/30 text-center space-y-3 font-mono">
      <div class="text-4xl">👶</div>
      <div class="text-amber-400 font-extrabold text-sm">尚在幼年启蒙阶段 (${p.ageYears} 岁)</div>
      <p class="text-slate-400 text-xs max-w-md mx-auto">你目前还在吮指头和拿玩具拍挥挥手阶段，无法报名参加正式比赛！请在面板使用【推进 1 年】或【直达 18 岁】长到 7 岁以上解锁少儿比赛。</p>
    </div>`;
    return;
  }

  grid.innerHTML = TOURNAMENTS.map(t => {
    const isMinAgeOk = p.ageYears >= t.minAge;
    const isMaxAgeOk = p.ageYears <= t.maxAge;
    const isRankOk = p.rank <= t.reqRank;
    const isFundsOk = p.funds >= t.fee;
    const canEnter = isMinAgeOk && isMaxAgeOk && isRankOk && isFundsOk;

    let reason = '';
    if (!isMinAgeOk) reason = `需满 ${t.minAge} 岁 (当前 ${p.ageYears} 岁)`;
    else if (!isMaxAgeOk) reason = `超龄 (需 ≤ ${t.maxAge} 岁)`;
    else if (!isRankOk) reason = `排名不足 (需前 #${t.reqRank})`;
    else if (!isFundsOk) reason = `资金不足 (需 $${t.fee})`;

    return `<div class="rounded-xl bg-bwf-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white text-sm">${t.name}</span>
        <span class="text-amber-400 font-bold">奖金: $${t.prize.toLocaleString()}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div>地区: <strong class="text-slate-200">${t.region}</strong></div>
        <div>报名费: <strong class="text-emerald-400">$${t.fee}</strong></div>
        <div>年龄门槛: <strong class="${isMinAgeOk && isMaxAgeOk ? 'text-emerald-400' : 'text-rose-400'}">${t.minAge} ~ ${t.maxAge === 99 ? '无上限' : t.maxAge} 岁</strong></div>
        <div>排名要求: <strong class="${isRankOk ? 'text-emerald-400' : 'text-rose-400'}">前 #${t.reqRank}</strong></div>
      </div>
      <button onclick="enterTournament('${t.id}')" class="w-full py-2.5 rounded-lg ${canEnter ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-bold transition-all" ${canEnter ? '' : 'disabled'}>
        ${canEnter ? '✈️ 报名出征该比赛' : `⚠️ ${reason}`}
      </button>
    </div>`;
  }).join('');
}

function renderMatchUI() {
  const m = gameState.currentMatch;
  if (!m) return;

  setEl('court-my-name', gameState.player.name);
  setEl('court-opp-name', m.oppName);
  setEl('score-my', m.myScore); setEl('score-opp', m.oppScore);
  setEl('court-set-counter', `局数: ${m.mySets} - ${m.oppSets} (SET ${m.currentSet})`);
  setEl('court-match-title', `LIVE MATCH // ${m.tourney.name}`);
}

function renderShop() {
  setEl('shop-funds-display', `$${gameState.player.funds.toLocaleString()}`);
  const grid = el('rackets-grid');
  if (!grid) return;

  grid.innerHTML = RACKETS.map((r, i) => `
    <div class="rounded-xl bg-bwf-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white text-base">${r.name}</span>
        <span class="text-emerald-400 font-bold text-sm">$${r.price}</span>
      </div>
      <p class="text-slate-400 text-[11px]">${r.desc}</p>
      <div class="p-2 rounded bg-slate-950 text-cyan-400 font-bold">${r.boost}</div>
      <button onclick="buyRacket(${i})" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all">
        💰 签约购买球拍 ($${r.price})
      </button>
    </div>`).join('');
}

function renderRankings() {
  const tbody = el('rankings-tbody');
  if (!tbody) return;

  tbody.innerHTML = gameState.hltvRankings.map(r => `
    <tr class="${r.name.includes('YOU') ? 'bg-emerald-500/10 font-bold text-emerald-400' : 'hover:bg-slate-900/60'} transition-colors">
      <td class="p-4 font-bold">#${r.rank}</td>
      <td class="p-4 font-bold">${r.name}</td>
      <td class="p-4">${r.country}</td>
      <td class="p-4 text-emerald-400 font-bold">${r.points.toLocaleString()} pts</td>
      <td class="p-4 text-amber-400 font-bold">${r.titles} 🏆</td>
    </tr>`).join('');

  const cab = el('trophy-cabinet');
  if (cab) {
    if (!gameState.player.trophies.length) {
      cab.innerHTML = '<div class="col-span-3 text-slate-500 text-xs italic py-4">尚未赢得荣誉冠军奖杯。</div>';
    } else {
      cab.innerHTML = gameState.player.trophies.map(t => `
        <div class="rounded-xl bg-slate-950 border border-amber-500/50 p-5 text-center space-y-2 trophy-gold font-mono text-xs">
          <div class="text-4xl">🥇</div>
          <div class="text-amber-400 font-extrabold text-sm">${t.title}</div>
          <div class="text-slate-400 text-[10px]">${t.date}</div>
        </div>`).join('');
    }
  }
}