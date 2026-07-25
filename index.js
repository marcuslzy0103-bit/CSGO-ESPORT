/**
 * COUNTER-MANAGER 2026 v3 // CS:GO & CS2 ESPORTS SIMULATION
 * New: Map B/P, Player Growth, Auto-Save, Bench System.
 */
const STORAGE_KEY = "cs_manager_save_v3";

const MAP_POOL = [
  { name: 'Mirage', ct_win_rate: 0.58 },
  { name: 'Inferno', ct_win_rate: 0.55 },
  { name: 'Nuke', ct_win_rate: 0.54 },
  { name: 'Overpass', ct_win_rate: 0.53 },
  { name: 'Ancient', ct_win_rate: 0.56 },
  { name: 'Vertigo', ct_win_rate: 0.57 },
  { name: 'Anubis', ct_win_rate: 0.52 }
];

const defaultGameState = {
  club: { name: 'CYBER WOLVES CS', region: 'Malaysia', coach: 'Marcus', budget: 100000, rank: 18, wins: 0, losses: 0, totalMatchesPlayed: 0 },
  tacticStyle: 'balanced',
  roster: [
    { id: 'p1', name: 'Marcus', role: 'AWPer', aim: 88, sense: 85, clutch: 90, movement: 84, morale: 95, salary: 4500, value: 35000, experience: 120, mapProficiency: {} },
    { id: 'p2', name: 'Vortex', role: 'IGL', aim: 80, sense: 92, clutch: 82, movement: 78, morale: 90, salary: 3800, value: 28000, experience: 95, mapProficiency: {} },
    { id: 'p3', name: 'Blaze', role: 'Entry', aim: 89, sense: 79, clutch: 80, movement: 88, morale: 88, salary: 3600, value: 26000, experience: 110, mapProficiency: {} },
    { id: 'p4', name: 'Shadow', role: 'Support', aim: 82, sense: 86, clutch: 84, movement: 80, morale: 92, salary: 3200, value: 22000, experience: 80, mapProficiency: {} },
    { id: 'p5', name: 'Echo', role: 'Lurker', aim: 85, sense: 88, clutch: 89, movement: 85, morale: 90, salary: 3400, value: 24000, experience: 100, mapProficiency: {} }
  ],
  bench: [], soldPlayers: [],
  market: [
    { id: 'm1', name: 's1mple_fan', role: 'AWPer', aim: 96, sense: 94, clutch: 95, movement: 92, morale: 95, salary: 8500, value: 75000, experience: 200, mapProficiency: {} },
    { id: 'm2', name: 'ZywOo_JR', role: 'AWPer', aim: 95, sense: 96, clutch: 94, movement: 90, morale: 96, salary: 8200, value: 72000, experience: 190, mapProficiency: {} },
    { id: 'm3', name: 'NiKo_Rifle', role: 'Entry', aim: 97, sense: 90, clutch: 88, movement: 91, morale: 90, salary: 7800, value: 68000, experience: 180, mapProficiency: {} },
    { id: 'm4', name: 'ropz_Lurk', role: 'Lurker', aim: 92, sense: 97, clutch: 96, movement: 89, morale: 94, salary: 7500, value: 65000, experience: 170, mapProficiency: {} },
    { id: 'm5', name: 'm0NESY_Flick', role: 'AWPer', aim: 95, sense: 92, clutch: 93, movement: 95, morale: 92, salary: 7900, value: 70000, experience: 160, mapProficiency: {} },
    { id: 'm6', name: 'b1t_OneTap', role: 'Entry', aim: 94, sense: 88, clutch: 86, movement: 87, morale: 90, salary: 5500, value: 45000, experience: 130, mapProficiency: {} }
  ],
  hltvRankings: [
    { rank: 1, name: 'Natus Vincere', region: 'Ukraine', points: 985, winLoss: '24-4' },
    { rank: 2, name: 'Team Vitality', region: 'France', points: 940, winLoss: '22-5' },
    { rank: 3, name: 'FaZe Clan', region: 'Europe', points: 890, winLoss: '20-7' },
    { rank: 4, name: 'G2 Esports', region: 'Europe', points: 850, winLoss: '19-8' },
    { rank: 5, name: 'MOUZ', region: 'Europe', points: 810, winLoss: '17-9' },
    { rank: 6, name: 'Astralis', region: 'Denmark', points: 760, winLoss: '16-10' },
    { rank: 7, name: 'Heroic', region: 'Denmark', points: 720, winLoss: '15-11' },
    { rank: 8, name: 'FURIA Esports', region: 'Brazil', points: 680, winLoss: '14-12' },
    { rank: 18, name: 'CYBER WOLVES CS', region: 'Malaysia', points: 340, winLoss: '0-0' }
  ],
  currentMatch: null, banPickPhase: false, banPickData: null, autoSaveCounter: 0
};

let gameState = JSON.parse(JSON.stringify(defaultGameState));

document.addEventListener('DOMContentLoaded', function() {
  loadGame(); initTabs(); initEvents(); renderAll();
});

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  showToast('游戏进度已自动保存！');
}

function autoSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadGame() {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { gameState = mergeWithDefaults(JSON.parse(saved), defaultGameState); }
    catch (e) { gameState = JSON.parse(JSON.stringify(defaultGameState)); }
  }
  if (!gameState.currentMatch) initNewMatch('FaZe Clan');
}

function mergeWithDefaults(saved, defaults) {
  var result = Object.assign({}, saved);
  for (var key of Object.keys(defaults)) {
    if (!(key in result)) { result[key] = JSON.parse(JSON.stringify(defaults[key])); }
    else if (defaults[key] && typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && !Array.isArray(result[key])) {
      result[key] = mergeWithDefaults(result[key], defaults[key]);
    } else if (Array.isArray(defaults[key]) && saved[key] && typeof saved[key] === 'object') {
      var existingIds = new Set(result[key].map(function(p){ return p.id; }));
      for (var item of defaults[key]) { if (!existingIds.has(item.id)) result[key].push(JSON.parse(JSON.stringify(item))); }
    }
  }
  return result;
}

function showToast(msg, dur) {
  dur = dur || 2500;
  var toast = document.getElementById('game-toast');
  var text = document.getElementById('toast-text');
  if (toast && text) {
    text.textContent = msg;
    toast.classList.remove('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(function() {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-[-100%]', 'opacity-0', 'pointer-events-none');
    }, dur);
  }
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.getAttribute('data-tab')); });
  });
  document.querySelectorAll('[data-tab-goto]').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.getAttribute('data-tab-goto')); });
  });
  var closeBtn = document.getElementById('modal-close-btn');
  var modal = document.getElementById('modal-new-club');
  if (closeBtn && modal) closeBtn.addEventListener('click', function() { modal.classList.add('hidden'); });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.add('hidden'); });
  document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    if (b.getAttribute('data-tab') === tabId) b.classList.add('active');
  });
  if (tabId === 'match') showBanPickModal();
}

function initEvents() {
  var form = document.getElementById('form-new-club');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('input-club-name').value.trim();
      var region = document.getElementById('input-club-region').value;
      var coach = document.getElementById('input-coach-name').value.trim();
      if (!name) { showToast('请输入战队名称！'); return; }
      gameState.club.name = name.toUpperCase();
      gameState.club.region = region;
      gameState.club.coach = coach || 'Marcus';
      gameState.club.budget = 100000;
      gameState.club.wins = 0; gameState.club.losses = 0;
      gameState.club.rank = 18; gameState.club.totalMatchesPlayed = 0;
      var ue = gameState.hltvRankings.find(function(r){ return r.rank===18; });
      if (ue) { ue.name = gameState.club.name; ue.region = gameState.club.region; ue.winLoss = '0-0'; ue.points = 340; }
      initNewMatch('FaZe Clan');
      saveGame(); renderAll();
      var m = document.getElementById('modal-new-club');
      if (m) m.classList.add('hidden');
      showToast('成功创建战队 [' + name.toUpperCase() + ']！加油冲击 Major 冠军！');
    });
  }

  var st = document.getElementById('select-tactic-style');
  if (st) st.addEventListener('change', function(e) {
    gameState.tacticStyle = e.target.value; saveGame();
    showToast('战术风格: ' + e.target.options[e.target.selectedIndex].text);
  });

  var bp = document.getElementById('dash-btn-play');
  if (bp) bp.addEventListener('click', function(){ switchTab('match'); });

  var sr = document.getElementById('btn-sim-round');
  if (sr) sr.addEventListener('click', simulateRound);

  var sa = document.getElementById('btn-sim-auto');
  if (sa) sa.addEventListener('click', autoPlayMatch);

  var rm = document.getElementById('btn-reset-match');
  if (rm) rm.addEventListener('click', function() {
    var opps=['Natus Vincere','Team Vitality','FaZe Clan','G2 Esports','Astralis'];
    var ro = opps[Math.floor(Math.random()*opps.length)];
    initNewMatch(ro); renderMatchUI();
    showToast('已与 ' + ro + ' 开始新比赛！');
  });
}

function generateBanPick() {
  var shuffled = MAP_POOL.slice().sort(function(){return Math.random()-0.5;});
  var picked = shuffled.slice(5,7);
  var banned = shuffled.slice(0,5).map(function(m){return m.name;});
  return { banned: banned, candidate: picked.map(function(m){return{name:m.name,ctWinRate:m.ct_win_rate}}), selected: picked[0].name, ctWinRate: picked[0].ct_win_rate };
}

function showBanPickModal() {
  var match = gameState.currentMatch;
  if (!match || match.isFinished || match.mapInfo) return;
  match.mapInfo = generateBanPick();
}

function initNewMatch(oppName) {
  gameState.currentMatch = {
    opponent: oppName, roundNum: 1, scoreMy: 0, scoreOpp: 0,
    mySide: Math.random()<0.5?'CT':'T', oppSide: Math.random()<0.5?'T':'CT',
    myMoney: 4000, oppMoney: 4000, myBuyType:'PISTOL', oppBuyType:'PISTOL',
    myLossStreak:0, oppLossStreak:0, killFeed:[], isFinished:false, mapInfo:null, bannedMaps:[]
  };
}

function getPlayerMapBonus(player, mapName) {
  if (!player.mapProficiency) player.mapProficiency={};
  return player.mapProficiency[mapName] || 0;
}

function avgStat(arr, stat) {
  var sum = arr.reduce(function(s,p){return s+(p[stat]||0);},0);
  return arr.length>0 ? sum/arr.length : 0;
}

function simulateRound() {
  var match = gameState.currentMatch;
  if (!match || match.isFinished) { showToast('比赛已结束！请重新开始。'); return; }
  if (!match.mapInfo) showBanPickModal();

  // ECONOMY
  if (match.roundNum===1||match.roundNum===13) {
    match.myBuyType='PISTOL ($800)'; match.oppBuyType='PISTOL ($800)';
  } else {
    match.myBuyType = match.myMoney>=4200 ? 'FULL BUY' : (match.myMoney>=2200 ? 'FORCE BUY' : 'ECO SAVE');
    match.oppBuyType = match.oppMoney>=4200 ? 'FULL BUY' : (match.oppMoney>=2200 ? 'FORCE BUY' : 'ECO SAVE');
  }

  // POWER CALC
  var aa=avgStat(gameState.roster,'aim'), ac=avgStat(gameState.roster,'clutch'), as2=avgStat(gameState.roster,'sense');
  var mb=0;
  if (match.mapInfo) { for(var i=0;i<gameState.roster.length;i++) mb+=getPlayerMapBonus(gameState.roster[i],match.mapInfo.selected); mb/=gameState.roster.length; }
  var sb = match.mySide==='CT'?3:-1, osb = match.oppSide==='CT'?3:-1;

  var mp=aa*0.4+ac*0.25+as2*0.15+(match.myMoney/16000)*15+mb*0.2+sb;
  var op=82*0.4+80*0.25+80*0.15+(match.oppMoney/16000)*15+osb;

  if (gameState.tacticStyle==='aggressive') mp+=4;
  if (gameState.tacticStyle==='defensive') mp+=2;

  if (match.mapInfo&&match.mySide==='T'){mp*=(1-match.mapInfo.ctWinRate);op*=match.mapInfo.ctWinRate;}

  var wp=mp/(mp+op), won=Math.random()<wp;

  // KILL FEED
  var killer=gameState.roster[Math.floor(Math.random()*gameState.roster.length)];
  var atk=match.mySide==='T'?killer.name:'Opponent';
  var weapons=['AK-47','M4A1-S','AWP','Desert Eagle','MP9','MAC-10'];
  var weapon=weapons[Math.floor(Math.random()*weapons.length)];
  var log=['--- 回合 '+match.roundNum+' ('+(match.mapInfo?match.mapInfo.selected:'???')+' | '+match.mySide+' vs '+match.oppSide+') ---'];

  if (won) {
    match.scoreMy++; match.oppLossStreak++; match.myLossStreak=0;
    match.myMoney=Math.min(16000,match.myMoney+3250);
    match.oppMoney=Math.min(16000,match.oppMoney+1400+Math.min(match.oppLossStreak*500,2000));
    if(Math.random()<0.3)log.push('[CLUTCH 1v'+(Math.ceil(Math.random()*3)+1)+'] '+atk+' 完成极限收尾！');else if(Math.random()<0.4)log.push('[首杀] '+atk+' 使用 '+weapon+' 爆头击杀对手！');else if(Math.random()<0.25)log.push('[炸弹安放] '+atk+' 成功安放炸弹赢下回合！');else log.push('[回合胜利] '+atk+' 带领队伍拿下该回合。')
  } else {
    match.scoreOpp++; match.myLossStreak++; match.oppLossStreak=0;
    match.myMoney=Math.min(16000,Math.max(1000,800+match.myLossStreak*600));
    match.oppMoney=Math.min(16000,match.oppMoney+3250);
    if (match.scoreOpp-match.scoreMy>=2&&Math.random()<0.25) log.push('[CLUTCH 对面] 对手完成残局逆转！');
    else if (Math.random()<0.3) log.push('[拆弹成功] CT方拆除炸弹赢下回合！');
    else log.push('[输掉] 对手赢得该回合。');
  }

  match.killFeed=match.killFeed.concat(log); match.roundNum++;

  // AUTO SAVE every 5 rounds
  gameState.autoSaveCounter++;
  if (gameState.autoSaveCounter%5===0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    showToast('自动存档... (回合'+(match.roundNum-1)+')', 1500);
  }

  if (match.scoreMy>=16||match.scoreOpp>=16||match.roundNum>26) finishMatch();
  renderMatchUI();
}

function autoPlayMatch() {
  var match=gameState.currentMatch;
  if (!match||match.isFinished) { showToast('没有进行中的比赛。'); return; }
  var rounds=0, maxR=Math.min(26-match.roundNum+1,8);
  for (var i=0;i<maxR;i++){internalSimulateRound();rounds++;if(match.isFinished)break;}
  if (match.isFinished) finishMatch(); else renderMatchUI();
  showToast('自动模拟了'+rounds+'回合！', 2000);
}

function internalSimulateRound() {
  var match=gameState.currentMatch;
  if (!match||match.isFinished) return;
  if (match.roundNum===1||match.roundNum===13){match.myBuyType='PISTOL';match.oppBuyType='PISTOL';}
  else{match.myBuyType=match.myMoney>=4200?'FULL BUY':(match.myMoney>=2200?'FORCE BUY':'ECO SAVE');match.oppBuyType=match.oppMoney>=4200?'FULL BUY':(match.oppMoney>=2200?'FORCE BUY':'ECO SAVE');}
  var mp2=avgStat(gameState.roster,'aim')*0.4+avgStat(gameState.roster,'clutch')*0.25+(match.myMoney/16000)*15;
  var op2=82*0.4+80*0.25+(match.oppMoney/16000)*15;
  if (gameState.tacticStyle==='aggressive') mp2+=4;
  var wp2=mp2/(mp2+op2), won=Math.random()<wp2;
  if(won){match.scoreMy++;match.oppLossStreak++;match.myLossStreak=0;match.myMoney=Math.min(16000,match.myMoney+3250);match.oppMoney=Math.min(16000,match.oppMoney+1400+Math.min(match.oppLossStreak*500,2000));}
  else{match.scoreOpp++;match.myLossStreak++;match.oppLossStreak=0;match.myMoney=Math.min(16000,Math.max(1000,800+match.myLossStreak*600));match.oppMoney=Math.min(16000,match.oppMoney+3250);}
  match.roundNum++;
  if(match.scoreMy>=16||match.scoreOpp>=16||match.roundNum>26) match.isFinished=true;
}

function applyPostMatchPlayerGrowth(won) {
  gameState.roster.forEach(function(player) {
    player.experience = Math.max(0,(player.experience||0)+(won?Math.floor(Math.random()*10)+5:Math.floor(Math.random()*5)));
    var v=Math.random();
    if(v<0.3){player.aim=Math.min(99,player.aim+(Math.random()<0.5?1:0));player.morale=Math.min(100,player.morale+1);}
    else if(v>0.85){player.aim=Math.max(50,player.aim-1);player.morale=Math.max(50,player.morale-2);}
    else{if(won){player.sense=Math.min(99,player.sense+(Math.random()<0.3?1:0));player.clutch=Math.min(99,player.clutch+(Math.random()<0.3?1:0));}else{player.movement=Math.max(50,player.movement-(Math.random()<0.2?1:0));}}
    player.value=Math.floor((player.aim+player.sense+player.clutch+player.movement)/4*800+(player.experience||0)*10);
    player.salary=Math.floor(player.value*0.08);
    player.morale=won?Math.min(100,player.morale+3):Math.max(50,player.morale-3);
  });
}

function applyMapProficiency(mapName) {
  gameState.roster.forEach(function(player) {
    if(!player.mapProficiency)player.mapProficiency={};
    var c=player.mapProficiency[mapName]||0;
    player.mapProficiency[mapName]=Math.min(20,c+Math.floor(Math.random()*2)+1);
  });
}

function finishMatch() {
  var match=gameState.currentMatch, won=match.scoreMy>match.scoreOpp;
  applyPostMatchPlayerGrowth(won);
  if(match.mapInfo)applyMapProficiency(match.mapInfo.selected);
  if(won){gameState.club.wins++;gameState.club.budget+=25000;gameState.club.rank=Math.max(1,gameState.club.rank-Math.floor(Math.random()*3));showToast('🏆 胜利！战胜 '+match.opponent+'！+ $25,000 奖金！');}
  else{gameState.club.losses++;gameState.club.rank=Math.min(20,gameState.club.rank+Math.floor(Math.random()*3)+1);showToast('😞 失败！不敌 '+match.opponent+'。');}
  gameState.club.totalMatchesPlayed++;
  var ue=gameState.hltvRankings.find(function(r){return r.name===gameState.club.name;});
  if(ue){ue.winLoss=gameState.club.wins+'W-'+gameState.club.losses+'L';ue.points=won?(340+gameState.club.wins*15):(340-gameState.club.losses*10);}
  match.isFinished=true; saveGame(); renderAll();
}

function renderAll(){renderHeader();renderDashboard();renderRoster();renderTransfers();renderBench();renderMatchUI();renderRankings();}
function setEl(id,t){var e=document.getElementById(id);if(e)e.textContent=t;}

function renderHeader(){
  var c=gameState.club;
  setEl('header-budget','$'+c.budget.toLocaleString());
  setEl('header-rank','#'+c.rank+' WORLD');
  setEl('header-record',c.wins+'W-'+c.losses+'L');
  setEl('header-club-name',c.name);
}

function renderDashboard(){
  var c=gameState.club;
  setEl('dash-club-name',c.name); setEl('dash-region',c.region); setEl('dash-coach',c.coach);
  setEl('dash-budget-display','$'+c.budget.toLocaleString()); setEl('dash-rank-display','#'+c.rank);
  setEl('dash-record',c.wins+'W - '+c.losses+'L'); setEl('dash-match-count',c.totalMatchesPlayed||0);
  var ms=gameState.roster.reduce(function(s,p){return s+p.salary;},0);
  setEl('dash-monthly-salary','$'+ms.toLocaleString());

  // Roster list
  var rl=document.getElementById('dash-roster-list');
  if(rl){
    var h='';
    gameState.roster.forEach(function(p){
      h+='<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">';
      h+='<div class="flex items-center gap-3"><span class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">'+p.role+'</span><span class="font-bold text-white">'+p.name+'</span></div>';
      h+='<div class="flex items-center gap-4 text-slate-400">';
      h+='<span>Aim: <strong class="text-emerald-400">'+p.aim+'</strong></span>';
      h+='<span>Clutch: <strong class="text-cyan-400">'+p.clutch+'</strong></span>';
      h+='<span>士气: <strong class="text-amber-400">'+p.morale+'%</strong></span>';
      h+='<span>月薪: <strong class="text-slate-200">$'+p.salary+'</strong></span></div></div>';
    });
    rl.innerHTML=h;
  }

  // News
  var nl=document.getElementById('dash-news-list');
  if(nl){
    nl.innerHTML='<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"><strong class="text-amber-400">[HLTV]</strong> 战队 <strong>'+c.name+'</strong> 正式建立，目标角逐 IEM Katowice 资格！</div>'
      +'<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">俱乐部可用转会预算为 <strong>$'+c.budget.toLocaleString()+'</strong>。转会市场已有明星选手挂牌！</div>'
      +'<div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">当前世界排名: <strong class="text-amber-400">#'+c.rank+'</strong> | 战绩: <strong class="text-emerald-400">'+c.wins+'W-'+c.losses+'L</strong></div>';
  }
}

function renderRoster(){
  var cards=document.getElementById('roster-full-cards'); if(!cards)return;
  var h='';
  gameState.roster.forEach(function(p){
    h+='<div class="rounded-xl bg-cs-card border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-xl relative group hover:border-amber-500/50 transition-all">';
    h+='<div class="flex items-center justify-between border-b border-slate-800 pb-2"><span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">'+p.role+'</span><span class="text-slate-500 text-[10px]">EXP: '+(p.experience||0)+'</span></div>';
    h+='<div class="text-base font-extrabold text-white">'+p.name+'</div>';
    h+='<div class="space-y-1.5 pt-1 text-[11px]">';
    h+='<div class="flex justify-between"><span>Aim 枪法:</span><strong class="text-emerald-400">'+p.aim+'</strong></div>';
    h+='<div class="flex justify-between"><span>Sense 意识:</span><strong class="text-cyan-400">'+p.sense+'</strong></div>';
    h+='<div class="flex justify-between"><span>Clutch 残局:</span><strong class="text-amber-400">'+p.clutch+'</strong></div>';
    h+='<div class="flex justify-between"><span>Speed 身法:</span><strong class="text-purple-400">'+p.movement+'</strong></div>';
    h+='<div class="flex justify-between"><span>Morale 士气:</span><strong class="text-slate-200">'+p.morale+'%</strong></div>';
    h+='</div>';
    if(p.mapProficiency&&Object.keys(p.mapProficiency).length>0){
      h+='<div class="pt-1 border-t border-slate-800 text-[10px]"><span class="text-slate-500">地图熟练度:</span><div class="grid grid-cols-2 gap-1 mt-1">';
      for(var mp in p.mapProficiency){if(Object.prototype.hasOwnProperty.call(p.mapProficiency,mp)){h+='<div class="flex justify-between"><span>'+mp+':</span><strong class="text-amber-400">'+p.mapProficiency[mp]+'/20</strong></div>';}}
      h+='</div></div>';
    }
    h+='<div class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between"><span>月薪: $'+p.salary+'</span><span class="text-emerald-400">首发契约</span></div>';
    h+='</div>';
  });
  cards.innerHTML=h;
}

function renderTransfers(){
  setEl('market-budget-display','$'+gameState.club.budget.toLocaleString());
  var grid=document.getElementById('market-players-grid'); if(!grid)return;
  var h='';
  gameState.market.forEach(function(p){
    h+='<div class="rounded-xl bg-cs-card border border-slate-800 p-5 space-y-4 font-mono text-xs shadow-xl hover:border-emerald-500/40 transition-all">';
    h+='<div class="flex items-center justify-between border-b border-slate-800 pb-2">';
    h+='<span class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">'+p.role+'</span>';
    h+='<span class="text-emerald-400 font-bold text-sm">$'+p.value.toLocaleString()+'</span></div>';
    h+='<div><div class="text-lg font-extrabold text-white">'+p.name+'</div>';
    h+='<div class="text-slate-400 text-[11px]">月薪: $'+p.salary+'/月 | EXP: '+(p.experience||0)+'</div></div>';
    h+='<div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">';
    h+='<div>Aim: <strong class="text-emerald-400">'+p.aim+'</strong></div>';
    h+='<div>Sense: <strong class="text-cyan-400">'+p.sense+'</strong></div>';
    h+='<div>Clutch: <strong class="text-amber-400">'+p.clutch+'</strong></div>';
    h+='<div>Speed: <strong class="text-purple-400">'+p.movement+'</strong></div></div>';
    h+='<button onclick="buyPlayer(\''+p.id+'\')" class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all">';
    h+='💰 签约 ($'+p.value.toLocaleString()+')</button></div>';
  });
  grid.innerHTML=h;
}

window.buyPlayer=function(playerId){
  var p=gameState.market.find(function(m){return m.id===playerId;});
  if(!p)return;
  if(gameState.club.budget<p.value){showToast('资金不足！无法完成该选手的转会签约。');return;}
  gameState.club.budget-=p.value;
  gameState.roster.sort(function(a,b){return a.aim-b.aim;});
  var replaced=gameState.roster.shift();
  replaced.morale=Math.max(60,replaced.morale-15);
  gameState.bench.push(replaced);
  gameState.roster.push(p);
  gameState.market=gameState.market.filter(function(m){return m.id!==playerId;});
  saveGame(); renderAll();
  showToast('成功签约 ['+p.name+']！原选手进入替补席。');
};

function renderMatchUI(){
  var m=gameState.currentMatch; if(!m)return;
  setEl('match-opp-team-name',m.opponent); setEl('score-my',m.scoreMy); setEl('score-opp',m.scoreOpp);
  setEl('match-round-counter','ROUND '+m.roundNum+' / 24');

  var md=document.getElementById('match-map-name');
  if(md&&m.mapInfo)md.textContent=m.mapInfo.selected+' ('+m.mySide+' vs '+m.oppSide+')';

  var bd=document.getElementById('match-ban-info');
  if(bd){
    if(m.bannedMaps&&m.bannedMaps.length>0)bd.innerHTML='<span class="text-rose-400">BAN: '+m.bannedMaps.join(', ')+'</span>';
    else bd.innerHTML='<span class="text-slate-500">等待地图BP...</span>';
  }

  setEl('eco-my-buy-type','BUY: '+m.myBuyType); setEl('eco-opp-buy-type','BUY: '+m.oppBuyType);
  setEl('eco-my-money','$'+m.myMoney.toLocaleString()); setEl('eco-opp-money','$'+m.oppMoney.toLocaleString());

  var fb=document.getElementById('kill-feed-box');
  if(fb){
    if(m.killFeed.length===0){fb.innerHTML='<div class="text-slate-500 italic">点击模拟下一回合开始...</div>';}
    else{
      var fh='';
      m.killFeed.forEach(function(log){
        var cls='text-slate-300';
        if(log.includes('---'))cls='text-amber-400 font-bold border-t border-slate-800 pt-2';
        else if(log.includes('CLUTCH'))cls='text-amber-300 font-bold bg-amber-500/10 p-1 rounded';
        else if(log.includes('首杀')||log.includes('爆头'))cls='text-emerald-400';
        else if(log.includes('输掉')||log.includes('失败'))cls='text-rose-400';
        else if(log.includes('炸弹'))cls='text-orange-400';
        else if(log.includes('拆弹'))cls='text-cyan-400';
        fh+='<div class="'+cls+'">'+log+'</div>';
      });
      fb.innerHTML=fh; fb.scrollTop=fb.scrollHeight;
    }
  }

  var fba=document.getElementById('btn-finished-action');
  if(fba&&m.isFinished){
    fba.textContent='重新开始';
    fba.onclick=function(){
      var opps=['Natus Vincere','Team Vitality','FaZe Clan','G2 Esports','Astralis'];
      initNewMatch(opps[Math.floor(Math.random()*opps.length)]); renderMatchUI(); renderAll();
    };
  }
}


function renderBench() {
  var bl = document.getElementById('bench-list');
  if (!bl) return;
  var h = '';
  if (gameState.bench.length === 0) {
    h = '<div class="text-slate-500 text-xs italic">替补席暂无选手</div>';
  } else {
    gameState.bench.forEach(function(p) {
      h += '<div class="p-3 rounded-lg bg-slate-950 border border-rose-500/30 flex items-center justify-between font-mono text-xs">';
      h += '<div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">BENCH</span><span class="font-bold text-white">'+p.name+'</span></div>';
      h += '<div class="flex items-center gap-4 text-slate-400">';
      h += '<span>Aim: <strong class="text-emerald-400">'+p.aim+'</strong></span>';
      h += '<span>士气: <strong class="text-amber-400">'+p.morale+'%</strong></span></div></div>';
    });
  }
  bl.innerHTML = h;
}
function renderRankings(){
  var tbody=document.getElementById('rankings-tbody'); if(!tbody)return;
  var h='';
  gameState.hltvRankings.forEach(function(r){
    var IU=r.name===gameState.club.name;
    h+='<tr class="'+(IU?'bg-amber-500/10 font-bold text-amber-400':'hover:bg-slate-900/60')+' transition-colors">';
    h+='<td class="p-4 font-bold">#'+r.rank+'</td>';
    h+='<td class="p-4 flex items-center gap-2"><span>'+r.name+'</span>';
    if(IU)h+='<span class="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px]">YOUR CLUB</span>';
    h+='</td><td class="p-4">'+r.region+'</td>';
    h+='<td class="p-4 text-emerald-400 font-bold">'+r.points+' pts</td>';
    h+='<td class="p-4 text-slate-400">'+r.winLoss+'</td></tr>';
  });
  tbody.innerHTML=h;
}