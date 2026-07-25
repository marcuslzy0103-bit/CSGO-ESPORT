/**
 * BADMINTON LIFE PRO 2026 // 羽毛球人生与职业生涯 RPG 模拟引擎
 * Full Engine: 0-38 Life Progression, Free Stat Allocation, Tournament Registration, 2D BWF Court Physics, Hawk-Eye.
 */

const STORAGE_KEY = 'badminton_life_save_v1';

/* ==========================================================================
   STAT DEFINITIONS — 6 大自由属性加点定义
   ========================================================================== */
const STAT_DEFS = {
  smash:      { name: '💥 杀球爆发力 (Smash Power)', desc: '提升重杀得分率与杀球最高时速 (最高 450+ km/h！)', color: 'text-amber-400', icon: '💥' },
  footwork:   { name: '⚡ 步法身法 (Footwork Speed)', desc: '提升全场防守覆盖跑位速度与救球成功率', color: 'text-emerald-400', icon: '⚡' },
  netTouch:   { name: '🎾 网前手感 (Net Touch)',     desc: '提升搓球、贴网放网、勾对角的得分率与网前压制力', color: 'text-cyan-400', icon: '🎾' },
  stamina:    { name: '🫁 体能储备 (Stamina)',      desc: '降低第三局决胜局与 Deuce 拉锯战的体能衰减速度', color: 'text-purple-400', icon: '🫁' },
  deception:  { name: '🎭 假动作与心态 (Deception)', desc: '提升停顿推球骗重心成功率与关键分抗压能力', color: 'text-pink-400', icon: '🎭' },
  injuryRes:  { name: '🛡️ 抗伤病率 (Injury Res)',    desc: '降低高强度密集赛程下的膝盖/肩袖拉伤概率', color: 'text-blue-400', icon: '🛡️' }
};

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
    stage: 'JUNIOR', // 'CHILDHOOD' (0-6), 'PRIMARY' (7-12), 'JUNIOR' (13-17), 'PRO' (18-32), 'VETERAN' (33+)
    funds: 2500,
    rank: 142,
    statPoints: 8,
    stats: {
      smash: 78,
      footwork: 74,
      netTouch: 76,
      stamina: 80,
      deception: 72,
      injuryRes: 85
    },
    racket: 'Yonex Astrox 88D',
    racketBoosts: { smash: 5, netTouch: 3 },
    wins: 28,
    losses: 6,
    titles: 3,
    eventLog: [
      '🎉 16 岁入选马来西亚国家青年队，获赠 Yonex Astrox 88D 球拍！',
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
  if (gameState.player.statPoints === undefined) gameState.player.statPoints = 8;
  if (!gameState.player.trophies) gameState.player.trophies = [];
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

  // 周特训按键
  document.getElementById('btn-next-week')?.addEventListener('click', advanceWeek);

  // 从0岁开启新人生 Modal
  const modal = document.getElementById('modal-new-career');
  document.getElementById('btn-new-career')?.addEventListener('click', () => modal?.classList.remove('hidden'));
  document.getElementById('modal-close-btn')?.addEventListener('click', () => modal?.classList.add('hidden'));

  document.getElementById('form-new-career')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-player-name').value.trim();
    if (!name) return;
    const country = document.getElementById('input-player-country').value;
    
    // 重新生成 0 岁卡片
    gameState.player = {
      name, country,
      ageYears: 0, ageWeeks: 0,
      height: Math.floor(Math.random() * 12) + 175,
      stage: 'CHILDHOOD',
      funds: 500,
      rank: 999,
      statPoints: 10,
      stats: { smash: 20, footwork: 20, netTouch: 20, stamina: 30, deception: 15, injuryRes: 90 },
      racket: '儿童新手球拍', racketBoosts: {},
      wins: 0, losses: 0, titles: 0,
      eventLog: [`👶 0 岁出生于 ${country}！遗传预测身高 ${Math.floor(Math.random() * 12) + 175} cm，获得 10 初始属性点！`],
      trophies: []
    };

    saveGame(); renderAll(); modal?.classList.add('hidden');
    showToast(`诞生！[${name}] 开始了他的羽毛球传奇人生！`);
  });

  // 比赛按键
  document.getElementById('btn-sim-point')?.addEventListener('click', simulateBadmintonPoint);
  document.getElementById('btn-sim-match-auto')?.addEventListener('click', autoPlayMatch);
}

/* ==========================================================================
   4. WEEK & AGE PROGRESSION — 周推进与年龄成长系统 (0-38 岁)
   ========================================================================== */
function advanceWeek() {
  const p = gameState.player;
  p.ageWeeks++;

  if (p.ageWeeks >= 52) {
    p.ageYears++;
    p.ageWeeks = 0;
    p.eventLog.unshift(`🎂 祝贺！你的年龄增长到了 ${p.ageYears} 岁！`);
  }

  // 判定年龄阶段
  if (p.ageYears < 7) p.stage = 'CHILDHOOD';
  else if (p.ageYears < 13) p.stage = 'PRIMARY';
  else if (p.ageYears < 18) p.stage = 'JUNIOR';
  else if (p.ageYears < 33) p.stage = 'PRO';
  else p.stage = 'VETERAN';

  // 周特训获得 TP 加点
  p.statPoints += 3;
  p.eventLog.unshift(`🏋️ 第 ${p.ageWeeks} 周特训完成：获得了 +3 可用属性加点 (TP)！`);

  // 随机触发羽毛球生活事件
  triggerRandomLifeEvent();

  saveGame(); renderAll();
}

function triggerRandomLifeEvent() {
  const p = gameState.player;
  const roll = Math.random();

  if (roll < 0.15) {
    p.funds += 200;
    p.eventLog.unshift(`💰 获得地方羽协青少年训练津贴 +$200！`);
  } else if (roll < 0.25) {
    p.stats.footwork = Math.min(99, p.stats.footwork + 1);
    p.eventLog.unshift(`👟 经过一周多球步法特训，【身法步法】永久 +1！`);
  } else if (roll < 0.35) {
    p.stats.smash = Math.min(99, p.stats.smash + 1);
    p.eventLog.unshift(`💥 练习中连续完成 50 次双跳重杀，【杀球爆发力】永久 +1！`);
  }
}

/* ==========================================================================
   5. STAT ALLOCATION CONTROLLER — 自由属性加点控制器
   ========================================================================== */
window.addStatPoint = function(statKey) {
  const p = gameState.player;
  if (p.statPoints < 1) { showToast('可用加点不足！请完成周特训积累 TP。'); return; }
  if (p.stats[statKey] >= 99) { showToast('该属性已达天花板上限 99！'); return; }

  p.stats[statKey]++;
  p.statPoints--;
  saveGame(); renderAll();
  showToast(`${STAT_DEFS[statKey].name} 提升至 ${p.stats[statKey]}！`);
};

window.subStatPoint = function(statKey) {
  const p = gameState.player;
  if (p.stats[statKey] <= 15) return;
  p.stats[statKey]--;
  p.statPoints++;
  saveGame(); renderAll();
};

/* ==========================================================================
   6. TOURNAMENT SYSTEM — 自由比赛报名系统
   ========================================================================== */
const TOURNAMENTS = [
  { id: 'j1', name: '🌱 社区少儿羽毛球公开赛', reqAge: 12, reqRank: 999, fee: 50, prize: 300, pts: 500, region: '本地' },
  { id: 'j2', name: '👦 全国中学生羽毛球锦标赛', reqAge: 18, reqRank: 999, fee: 200, prize: 1500, pts: 1500, region: '全国' },
  { id: 'b1', name: '🌍 BWF 国际挑战赛 (International Challenge)', reqAge: 16, reqRank: 500, fee: 400, prize: 3000, pts: 3500, region: '亚洲/欧洲' },
  { id: 'b2', name: '🟢 BWF Super 300 (德国公开赛)', reqAge: 17, reqRank: 200, fee: 800, prize: 12000, pts: 7000, region: '🇩🇪 德国' },
  { id: 'b3', name: '🟡 BWF Super 500 (韩国公开赛)', reqAge: 18, reqRank: 100, fee: 1500, prize: 25000, pts: 9200, region: '🇰🇷 韩国' },
  { id: 'b4', name: '🔵 BWF Super 750 (日本公开赛)', reqAge: 18, reqRank: 50, fee: 3000, prize: 50000, pts: 11000, region: '🇯🇵 日本' },
  { id: 'b5', name: '🏆 BWF Super 1000 (全英公开赛 All England)', reqAge: 18, reqRank: 32, fee: 5000, prize: 120000, pts: 12000, region: '🇬🇧 英国' },
  { id: 'b6', name: '🥇 奥运会羽毛球男单比赛 (Olympic Games)', reqAge: 18, reqRank: 16, fee: 0, prize: 250000, pts: 15000, region: '🇫🇷 巴黎' },
];

window.enterTournament = function(tourneyId) {
  const tourney = TOURNAMENTS.find(t => t.id === tourneyId);
  if (!tourney) return;
  const p = gameState.player;

  if (p.funds < tourney.fee) { showToast(`资金不足！报名需要 $${tourney.fee}。`); return; }
  if (p.ageYears > tourney.reqAge && tourney.reqAge <= 18) { showToast('超龄无法参加该少儿/中学生组比赛！'); return; }
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
   7. 2D COURT ENGINE — 2D BWF 球场物理与实时观战引擎
   ========================================================================== */
let courtCanvas = null;
let courtCtx = null;
let courtAnimationId = null;

let courtEntities = {
  myPlayer: { x: 400, y: 350, targetX: 400, targetY: 350, color: '#10b981' },
  oppPlayer: { x: 400, y: 100, targetX: 400, targetY: 100, color: '#f43f5e' },
  shuttle: { x: 400, y: 225, z: 0, vx: 0, vy: 0, vz: 0, state: 'IDLE' },
  smashSpeed: 0,
  hawkEye: { active: false, result: 'IN' }
};

function initBadmintonCanvas() {
  courtCanvas = document.getElementById('badminton-canvas');
  if (!courtCanvas) return;
  courtCtx = courtCanvas.getContext('2d');
  if (!courtAnimationId) {
    requestAnimationFrame(courtLoop);
  }
}

function simulateBadmintonPoint() {
  const m = gameState.currentMatch;
  if (!m || m.isFinished) { stopAutoMatch(); showToast('本场比赛已结束！'); return; }

  const p = gameState.player;
  const myOvr = Math.round((p.stats.smash + p.stats.footwork + p.stats.netTouch + p.stats.stamina) / 4);

  // 算力胜率判定
  const winProb = Math.max(0.15, Math.min(0.85, (myOvr + (p.racketBoosts.smash || 0)) / (myOvr + m.oppOvr)));
  const myWonPoint = Math.random() < winProb;

  // 动作类型：高远球 Clear, 重杀 Smash, 吊球 Drop
  const shotTypes = ['SMASH', 'CLEAR', 'DROP', 'NET'];
  const shot = shotTypes[Math.floor(Math.random() * shotTypes.length)];

  if (shot === 'SMASH' && myWonPoint) {
    const speed = Math.floor(Math.random() * 40) + 380; // 380 - 420 km/h 杀球!
    courtEntities.smashSpeed = speed;
    const banner = document.getElementById('smash-speed-banner');
    if (banner) {
      banner.textContent = `⚡ MONSTER SMASH! ${speed} km/h!`;
      banner.classList.remove('hidden');
      setTimeout(() => banner.classList.add('hidden'), 1800);
    }
  }

  // 鹰眼挑战概率触发 (5% 压线分)
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

  if (myWonPoint) {
    m.myScore++;
    m.killLog.unshift(`💥 [得分] ${p.name} 凭借精准 ${shot === 'SMASH' ? '双跳重杀' : '网前搓球'} 得分！`);
  } else {
    m.oppScore++;
    m.killLog.unshift(`⚠️ 对手 ${m.oppName} 底线突击直线杀球得分。`);
  }

  // 21 分制与 Deuce 判定 (先达 21 分且净胜 2 分)
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
}

function autoPlayMatch() {
  if (!gameState.currentMatch || gameState.currentMatch.isFinished) return;
  if (autoMatchInterval) { stopAutoMatch(); return; }
  const btn = document.getElementById('btn-sim-match-auto');
  if (btn) btn.textContent = '⏸ 暂停自动模拟';
  autoMatchInterval = setInterval(() => {
    if (gameState.currentMatch.isFinished) stopAutoMatch();
    else simulateBadmintonPoint();
  }, 160);
}

function stopAutoMatch() {
  if (autoMatchInterval) { clearInterval(autoMatchInterval); autoMatchInterval = null; }
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
    drawBwfCourtScene();
  }
  requestAnimationFrame(courtLoop);
}

function drawBwfCourtScene() {
  const w = courtCanvas.width;
  const h = courtCanvas.height;

  // 1. BWF 标志性绿地胶背景
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

  // 3. 绘制中间网 (Net)
  courtCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  courtCtx.lineWidth = 4;
  courtCtx.beginPath();
  courtCtx.moveTo(cx - 15, midY); courtCtx.lineTo(cx + cw + 15, midY);
  courtCtx.stroke();

  // 网柱 Net Posts
  courtCtx.fillStyle = '#f59e0b';
  courtCtx.fillRect(cx - 18, midY - 6, 8, 12);
  courtCtx.fillRect(cx + cw + 10, midY - 6, 8, 12);

  // 4. 绘制球员圆点 (近场我方 🟢，远场对手 🔴)
  const my = courtEntities.myPlayer;
  const opp = courtEntities.oppPlayer;

  // 近场我方圆点
  courtCtx.beginPath();
  courtCtx.arc(my.x, my.y, 10, 0, Math.PI * 2);
  courtCtx.fillStyle = '#10b981';
  courtCtx.shadowColor = '#10b981'; courtCtx.shadowBlur = 12;
  courtCtx.fill(); courtCtx.shadowBlur = 0;
  courtCtx.lineWidth = 2; courtCtx.strokeStyle = '#ffffff'; courtCtx.stroke();

  // 远场对手圆点
  courtCtx.beginPath();
  courtCtx.arc(opp.x, opp.y, 10, 0, Math.PI * 2);
  courtCtx.fillStyle = '#f43f5e';
  courtCtx.shadowColor = '#f43f5e'; courtCtx.shadowBlur = 12;
  courtCtx.fill(); courtCtx.shadowBlur = 0;
  courtCtx.lineWidth = 2; courtCtx.strokeStyle = '#ffffff'; courtCtx.stroke();

  // 5. 绘制羽毛球白点
  courtCtx.beginPath();
  courtCtx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
  courtCtx.fillStyle = '#fef08a';
  courtCtx.shadowColor = '#fef08a'; courtCtx.shadowBlur = 8;
  courtCtx.fill(); courtCtx.shadowBlur = 0;

  // 水印标题
  courtCtx.fillStyle = 'rgba(255,255,255,0.4)';
  courtCtx.font = 'bold 12px monospace';
  courtCtx.textAlign = 'left';
  courtCtx.fillText('BWF OFFICIAL 2D COURT OBSERVER', 20, 25);
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
  renderHeader(); renderDashboard(); renderStats(); renderTournaments();
  renderMatchUI(); renderShop(); renderRankings();
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

function renderDashboard() {
  const p = gameState.player;
  setEl('dash-week-num', p.ageWeeks);
  setEl('dash-age-display', `${p.ageYears} 岁 ${p.ageWeeks} 周`);

  const ovr = Math.round((p.stats.smash + p.stats.footwork + p.stats.netTouch + p.stats.stamina) / 4);
  setEl('dash-ovr-display', `${ovr} OVR`);
  setEl('dash-racket-display', p.racket);
  setEl('dash-record-display', `${p.wins} 胜 - ${p.losses} 负`);

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
  setEl('stat-tp-display', `${p.statPoints} TP`);
  const grid = el('stat-allocation-cards');
  if (!grid) return;

  grid.innerHTML = Object.entries(STAT_DEFS).map(([key, def]) => `
    <div class="rounded-xl bg-bwf-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl hover:border-emerald-500/40 transition-all">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white text-sm">${def.name}</span>
        <strong class="text-lg font-black ${def.color}">${p.stats[key]}</strong>
      </div>
      <p class="text-slate-400 text-[11px] h-8">${def.desc}</p>

      <div class="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-400 stat-bar-fill" style="width: ${p.stats[key]}%"></div>
      </div>

      <div class="flex items-center gap-2 pt-2">
        <button onclick="addStatPoint('${key}')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">
          + 加 1 点 (消耗 1 TP)
        </button>
      </div>
    </div>`).join('');
}

function renderTournaments() {
  setEl('tourney-funds-display', `$${gameState.player.funds.toLocaleString()}`);
  setEl('tourney-rank-display', `#${gameState.player.rank}`);
  const grid = el('tournaments-grid');
  if (!grid) return;

  grid.innerHTML = TOURNAMENTS.map(t => {
    const isAgeOk = gameState.player.ageYears <= t.reqAge || t.reqAge > 18;
    const isRankOk = gameState.player.rank <= t.reqRank;
    const isFundsOk = gameState.player.funds >= t.fee;
    const canEnter = isAgeOk && isRankOk && isFundsOk;

    return `<div class="rounded-xl bg-bwf-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white text-sm">${t.name}</span>
        <span class="text-amber-400 font-bold">奖金: $${t.prize.toLocaleString()}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div>地区: <strong class="text-slate-200">${t.region}</strong></div>
        <div>报名费: <strong class="text-emerald-400">$${t.fee}</strong></div>
        <div>年龄要求: <strong class="${isAgeOk ? 'text-emerald-400' : 'text-rose-400'}">≤ ${t.reqAge} 岁</strong></div>
        <div>排名要求: <strong class="${isRankOk ? 'text-emerald-400' : 'text-rose-400'}">前 #${t.reqRank}</strong></div>
      </div>
      <button onclick="enterTournament('${t.id}')" class="w-full py-2.5 rounded-lg ${canEnter ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-bold transition-all" ${canEnter ? '' : 'disabled'}>
        ${canEnter ? '✈️ 报名出征该比赛' : '⚠️ 条件未满足无法报名'}
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