import { getCampaignPhase } from './campaignRules.js';
import { resolveD20Roll, rollDie } from './coreRules.js';
import { appendChronicleEvent, recordGloryAward, recordStandingChange } from './ledgerRules.js';
import { RELIGIOUS_TRAITS } from './personalityRules.js';

export const ECONOMY_SCHEMA_VERSION = 2;
export const DENIERS_PER_LIVRE = 240;

const clone = value => JSON.parse(JSON.stringify(value));
const asNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asInt = (value, fallback = 0) => Math.trunc(asNumber(value, fallback));
const money = value => Math.max(0, Math.round(asNumber(value)));
const iso = value => typeof value === 'string' ? value : (value || new Date()).toISOString();
const safeId = value => String(value || '').replace(/[^a-z0-9:_-]/gi, '_');
const list = value => Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];

export const toDeniers = livres => Math.round(asNumber(livres) * DENIERS_PER_LIVRE);
export const toLivres = deniers => money(deniers) / DENIERS_PER_LIVRE;
export const formatCoin = deniers => {
  const total = money(deniers);
  const livres = Math.floor(total / DENIERS_PER_LIVRE);
  const remainder = total % DENIERS_PER_LIVRE;
  const sols = Math.floor(remainder / 12);
  const pennies = remainder % 12;
  const parts = [];
  if (livres) parts.push(`£${livres}`);
  if (sols) parts.push(`${sols}s`);
  if (pennies || !parts.length) parts.push(`${pennies}d`);
  return parts.join(' ');
};

const market = (id, category, label, costDeniers, options = {}) => ({
  id, category, label, costDeniers: money(costDeniers), phase: options.phase ?? 0,
  foreign: Boolean(options.foreign), referenceOnly: Boolean(options.referenceOnly),
  consumable: Boolean(options.consumable), service: Boolean(options.service),
  combat: options.combat || null, note: options.note || '', sourcePage: options.sourcePage || 'Ch.12 pp.199-204'
});

export const MARKET_CATEGORIES = [
  ['food', '식량과 음료'], ['mount', '탈것'], ['animal', '가축과 사냥 동물'], ['armor', '갑옷과 방패'],
  ['horseArmor', '마갑'], ['melee', '근접 무기'], ['missile', '원거리 무기'], ['clothing', '의복'],
  ['jewelry', '보석과 장신구'], ['service', '도시·수도원 서비스'], ['furnishing', '직물과 가구'],
  ['instrument', '악기'], ['luxury', '사치품'], ['transport', '운송과 여행'], ['vessel', '선박']
].map(([id, label]) => ({ id, label }));

export const MARKET_CATALOG = [
  market('fare_common', 'food', '4주 식비 · 평민', 8, { consumable: true }),
  market('fare_knight', 'food', '4주 식비 · 기사', 14, { consumable: true }),
  market('feast', 'food', '연회 · 기사 1명 또는 평민 4명', 1, { consumable: true }),
  market('meal_common', 'food', '한 끼 · 평민 4명', 1, { consumable: true }),
  market('meal_knight', 'food', '한 끼 · 기사', 2, { consumable: true }),
  market('rations', 'food', '4주 식량', 4, { consumable: true }),
  market('spices', 'food', '향신료 · 보통', 60, { consumable: true }),
  market('spices_exotic', 'food', '향신료 · 외래', 240, { consumable: true }),
  market('wine_frankish', 'food', '프랑크산 와인 한 병', 1, { consumable: true }),
  market('wine_exotic', 'food', '외래 와인 한 병', 2, { consumable: true }),

  market('donkey', 'mount', '당나귀', 40, { combat: { damage: '4d6', move: 5, armor: 3, str: 20, con: 15 } }),
  market('cart_horse', 'mount', '짐수레 말', 60, { combat: { damage: '2d6', move: 4, armor: 3, str: 15, con: 10 } }),
  market('mule', 'mount', '노새', 80, { combat: { damage: '6d6', move: 6, armor: 4, str: 25, con: 18 } }),
  market('sumpter', 'mount', '짐말', 80, { combat: { damage: '3d6', move: 5, armor: 3, str: 15, con: 16 } }),
  market('camel', 'mount', '낙타', 0, { foreign: true, referenceOnly: true, note: '사라센·페르시아만. 말 상대 높이 우위 +5.', combat: { damage: '6d6', move: 6, armor: 5, str: 20, con: 12 } }),
  market('pony', 'mount', '조랑말', 960, { combat: { damage: '2d6', move: 4, armor: 3, str: 20, con: 15 } }),
  market('basque_pony', 'mount', '바스크 조랑말', 0, { foreign: true, referenceOnly: true, combat: { damage: '2d6', move: 4, armor: 3, str: 15, con: 14 } }),
  market('war_pony', 'mount', '전투 조랑말', 2880, { combat: { damage: '5d6', move: 6, armor: 4, str: 20, con: 14 } }),
  market('steppe_pony', 'mount', '초원 조랑말', 0, { foreign: true, referenceOnly: true, combat: { damage: '5d6', move: 7, armor: 4, str: 20, con: 10 } }),
  market('rouncy', 'mount', '승용마', 240, { combat: { profileKey: 'rouncy', damage: '4d6', move: 6, armor: 4, str: 18, con: 14 } }),
  market('palfrey', 'mount', '여행마', 960, { combat: { damage: '3d6', move: 6, armor: 3, str: 16, con: 8 } }),
  market('courser', 'mount', '준마', 1920, { combat: { profileKey: 'courser', damage: '5d6', move: 9, armor: 5, str: 24, con: 15 } }),
  market('arab_courser', 'mount', '아랍 준마', 6720, { phase: 4, combat: { damage: '5d6', move: 10, armor: 4, str: 24, con: 18 } }),
  market('charger', 'mount', '돌격마', 2400, { combat: { profileKey: 'charger', damage: '6d6', move: 8, armor: 5, str: 30, con: 12 } }),
  market('andalusian_charger', 'mount', '안달루시아 돌격마', 4800, { phase: 3, combat: { damage: '7d6', move: 8, armor: 5, str: 32, con: 12 } }),
  market('destrier', 'mount', '군마', 7680, { phase: 4, combat: { profileKey: 'destrier', damage: '8d6', move: 7, armor: 5, str: 38, con: 10 } }),

  ...[['sheep_goat','양 또는 염소',36],['fat_sheep_goat','살찐 양 또는 염소',48],['ewe_lamb','암양과 새끼',25],['ram','숫양',32],['sow','암퇘지',40],['yearling_ox_cow','한 살 황소 또는 암소',40],['milk_cow_low','젖소 · 최저가',60],['milk_cow_high','젖소 · 최고가',120],['ox','황소',180],['bull','종우',240],['hawk','매',15],['trained_hawk','훈련된 매 · Falconry +5',80],['dog','개',5],['unusual_dog','희귀한 개',25]].map(([id,label,cost]) => market(id, 'animal', label, cost)),

  market('clothing_armor', 'armor', '의복', 5, { combat: { armor: 0, dex: 0, armorType: 'none' } }),
  market('padding', 'armor', '누비옷', 7, { combat: { armor: 2, dex: 0, armorType: 'leather' } }),
  market('soft_leather', 'armor', '연질 가죽 갑옷', 15, { combat: { armor: 4, dex: -2, armorType: 'leather' } }),
  market('cuirbouilli', 'armor', '경화 가죽 갑옷', 60, { combat: { armor: 6, dex: -2, armorType: 'leather' } }),
  market('ring_mail', 'armor', '링 메일', 140, { combat: { armor: 7, dex: -5, armorType: 'chainmail' } }),
  market('scale_armor', 'armor', '미늘 갑옷', 200, { combat: { armor: 8, dex: -5, armorType: 'chainmail' } }),
  market('byzantine_scale', 'armor', '비잔티움 미늘 갑옷', 340, { foreign: true, referenceOnly: true, combat: { armor: 9, dex: -5, armorType: 'chainmail' } }),
  market('chain_mail', 'armor', '사슬갑옷', 480, { phase: 1, combat: { armor: 10, dex: -5, armorType: 'chainmail' } }),
  market('reinforced_chain', 'armor', '보강 사슬갑옷', 960, { phase: 2, combat: { armor: 12, dex: -5, armorType: 'chainmail' } }),
  market('partial_plate', 'armor', '부분 판금갑옷', 2400, { phase: 3, combat: { armor: 14, dex: -10, armorType: 'plate' } }),
  market('full_plate', 'armor', '전신 판금갑옷', 3840, { phase: 4, combat: { armor: 16, dex: -10, armorType: 'plate' } }),
  market('buckler', 'armor', '버클러', 3, { combat: { shield: 4 } }),
  market('shield', 'armor', '방패', 5, { combat: { shield: 6 } }),
  market('large_shield', 'armor', '대형 방패', 5, { combat: { shield: 9, dex: -5 } }),

  market('caparison', 'horseArmor', '카파리슨 · 천', 30, { combat: { armor: 2, armorType: 'caparison', horse: 'any' } }),
  market('trapper', 'horseArmor', '트래퍼 · 누비', 120, { combat: { armor: 4, armorType: 'trapper', horse: 'any' } }),
  market('horse_cuirbouilli', 'horseArmor', '경화 가죽 마갑', 480, { combat: { armor: 6, armorType: 'cuirbouilli', horse: 'charger_destrier' } }),
  market('chain_barding', 'horseArmor', '사슬 마갑', 2400, { phase: 3, combat: { armor: 10, moveDex: -1, armorType: 'barding', horse: 'charger_destrier' } }),
  market('partial_plate_barding', 'horseArmor', '부분 판금 마갑', 3840, { phase: 4, combat: { armor: 12, moveDex: -2, armorType: 'plate_barding', horse: 'destrier' } }),

  market('axe', 'melee', '한손 도끼', 25, { combat: { weaponId: 'axe', damage: 'normal', special: '방패 피해 주사위가 6이면 방패에 2 피해' } }),
  market('great_axe', 'melee', '양손 도끼', 50, { combat: { weaponId: 'greatAxe', damage: '+1d6', special: '방패 피해 주사위가 6이면 방패에 2 피해' } }),
  market('dagger', 'melee', '단검', 5, { combat: { weaponId: 'dagger', damage: '-1d6', special: '붙잡기 중 사용 가능' } }),
  market('flail', 'melee', '한손 도리깨', 50, { phase: 2, combat: { weaponId: 'flail', damage: 'normal' } }),
  market('warflail', 'melee', '양손 도리깨', 75, { phase: 3, combat: { weaponId: 'warflail', damage: '+1d6' } }),
  market('hammer', 'melee', '한손 전투 망치', 30, { combat: { weaponId: 'hammer', damage: 'normal' } }),
  market('great_hammer', 'melee', '양손 전투 망치', 50, { phase: 3, combat: { weaponId: 'greatHammer', damage: '+1d6' } }),
  market('halberd', 'melee', '할버드', 60, { phase: 4, combat: { weaponId: 'halberd', damage: '+1d6' } }),
  market('lance', 'melee', '마상창', 3, { combat: { weaponId: 'lance', damage: '말 피해' } }),
  market('mace', 'melee', '한손 철퇴', 30, { combat: { weaponId: 'mace', damage: 'normal' } }),
  market('morning_star', 'melee', '모닝스타', 75, { phase: 2, combat: { weaponId: 'morningStar', damage: '+1d6' } }),
  market('spear', 'melee', '창', 1, { combat: { weaponId: 'spear', damage: 'normal' } }),
  market('great_spear', 'melee', '양손창', 2, { combat: { weaponId: 'greatSpear', damage: '+1d6' } }),
  market('iron_sword', 'melee', '철제·외래 검', 60, { combat: { weaponId: 'sword', damage: 'normal' } }),
  market('frankish_sword', 'melee', '프랑크 강철검', 75, { combat: { weaponId: 'sword', skill: 1, damage: 'normal' } }),
  market('persian_sword', 'melee', '페르시아 강철검', 240, { foreign: true, referenceOnly: true, combat: { weaponId: 'sword', damage: 'normal' } }),
  market('great_sword', 'melee', '양손검', 100, { phase: 2, combat: { weaponId: 'greatSword', damage: '+1d6' } }),

  market('throwing_axe', 'missile', '투척 도끼', 10, { combat: { missileWeaponId: 'throwingAxe', damage: '-1d6', range: '5/10/15' } }),
  market('short_bow', 'missile', '단궁', 15, { combat: { missileWeaponId: 'bow', damage: '3d6', range: '50/100/150' } }),
  market('compound_bow', 'missile', '합성궁', 0, { referenceOnly: true, combat: { missileWeaponId: 'compoundBow', damage: '5d6', range: '60/120/180' } }),
  market('long_bow', 'missile', '장궁', 50, { phase: 4, combat: { missileWeaponId: 'longbow', damage: '6d6', range: '100/200/300' } }),
  market('light_crossbow', 'missile', '경쇠뇌', 100, { combat: { missileWeaponId: 'lightCrossbow', damage: '1d6+10', range: '50/100/150' } }),
  market('medium_crossbow', 'missile', '중쇠뇌', 140, { phase: 2, combat: { missileWeaponId: 'mediumCrossbow', damage: '1d6+13', range: '60/120/180' } }),
  market('heavy_crossbow', 'missile', '중쇠뇌 · 대형', 480, { phase: 3, combat: { missileWeaponId: 'heavyCrossbow', damage: '1d6+16', range: '70/140/210' } }),
  market('javelin', 'missile', '투창', 1, { combat: { missileWeaponId: 'javelin', damage: '-1d6', range: '10/20/30' } }),
  market('sling', 'missile', '투석구', 0, { combat: { missileWeaponId: 'sling', damage: '-2d6', range: '35/70/100' } }),

  ...[
    ['fashion_knightly','현행 유행 기사 의복',240],['fashion_noble','현행 유행 귀족 의복',600],['old_knightly','구식 기사 의복',100],['old_noble','구식 귀족 의복',300],['monk_cowl','수도복',20],['short_mantle','짧은 망토',40],['marten_cloak','담비털 망토',240]
  ].map(([id,label,cost]) => market(id, 'clothing', label, cost)),
  ...[
    ['common_earrings','보통 귀걸이',10],['silver_earrings','은 귀걸이',25],['silver_ring','은 반지',40],['seal_ring','소박한 인장 반지',60],['gold_earrings','금 귀걸이',160],['gold_ring','금 반지',240],['silver_brooch','은 브로치',240],['diamond','세공 전 다이아몬드',240],['silver_diamond_medallion','다이아몬드 은 메달',480],['pearl_earrings','진주 귀걸이',480],['gold_brooch','금 브로치',1200],['ruby_ring','화려한 루비 금반지',1200],['emerald_ring','에메랄드 금반지',1440],['diamond_pearl_medallion','다이아몬드·진주 금 메달',8400]
  ].map(([id,label,cost]) => market(id, 'jewelry', label, cost)),
  ...[
    ['minstrel_day','음유시인 하루 고용',20],['minstrel_song','지정 장소에서 노래',5],['minstrel_night','밤새 공연',20],['love_poem','연시 작곡',30],['mocking_poem','풍자시 작곡',50],['heroic_lay','영웅 서사시 작곡',60],['herald_day','전문 전령 하루 고용',20],['letter_delivery','편지 전달 · 예상 여행일당',5],['genealogy_low','족보 조사 · 최저가',240],['genealogy_high','족보 조사 · 최고가',1200],['lawyer_day','법률가 하루 고용',12],['fishing_boat_hire','어선 고용',60],['ship_week','선박 운송 · 주당',60],['chirurgeon_week','외과의 고용 · 주당',140],['pirate_ship_hire','해적선 20인 고용',720],['read_letter','수도원 편지 낭독',1],['write_letter','수도원 편지 작성',3],['copy_page','책 필사 · 쪽당',5],['mass','미사 봉헌',5],['illuminate_page','채식 필사 · 쪽당',25]
  ].map(([id,label,cost]) => market(id, 'service', label, cost, { service: true, consumable: true })),
  ...[
    ['carpet','보통 카펫',100],['thick_carpet','두꺼운 카펫',200],['plain_tapestry','소박한 태피스트리',100],['sturdy_tapestry','튼튼한 고급 태피스트리',180],['designed_tapestry','무늬 태피스트리',480],['fine_tapestry','아름다운 고급 태피스트리',720],['embroidered_tapestry','장면 자수 태피스트리',1200],['byzantine_tapestry','비잔티움 태피스트리',1680]
  ].map(([id,label,cost]) => market(id, 'furnishing', label, cost)),
  market('lute', 'instrument', '류트', 60), market('harp', 'instrument', '하프', 240),
  ...[['perfume','수입 향수',40],['hand_mirror','유리 손거울',40],['drinking_glass','유리잔',60],['silver_dish','은 접시',240],['gold_dish','금 접시',1680],['golden_goblet','금 술잔',2880]].map(([id,label,cost]) => market(id, 'luxury', label, cost)),
  market('cart', 'transport', '이륜 수레', 7), market('wagon', 'transport', '사륜 수레', 10),
  market('camp_tent', 'transport', '야영 천막', 2), market('travel_gear', 'transport', '여행 장비', 60), market('war_gear', 'transport', '전쟁 장비', 180), market('pavilion', 'transport', '대형 천막', 240),
  ...[['rowboat','노 젓는 배·코라클',5],['fishing_boat','어선',20],['small_trade_ship','소형 상선',1200],['large_trade_ship','대형 상선',3600],['war_ship','전함',4800],['pleasure_barge','유람선',2400],['horse_transport','말 운송선',3600]].map(([id,label,cost]) => market(id, 'vessel', label, cost))
];

export const BUILDING_CATALOG = [
  ['ox_shed','외양간',2,'ordinary'],['commoner_dwelling','평민 주택',3,'ordinary'],['barn','헛간',12,'ordinary'],['manor_hall','장원 회관',480,'ordinary'],['stone_bridge','석교',1200,'ordinary'],['small_chapel','작은 예배당',1920,'ordinary'],['small_stone_tower','작은 석탑',2400,'ordinary'],['fine_church','훌륭한 교회',12000,'ordinary'],
  ['flower_garden','꽃밭',75,'improvement'],['glass_window','유리창',80,'improvement'],['fish_pond','양어장',120,'improvement'],['solar_furniture','응접실 가구 일체',150,'improvement'],['tile_floor','타일 바닥',240,'improvement'],['fireplace','벽난로와 굴뚝',240,'improvement'],['small_orchard','작은 과수원',240,'improvement'],['bedroom_furniture','침실 가구 일체',240,'improvement'],['chapel_furniture','예배당 가구 일체',480,'improvement'],
  ['motte_bailey','모트 앤 베일리 성',10800,'defense',0,'5/3'],['wooden_palisade','목책 · 구역당',3600,'defense',0,'2'],['ditch_rampart','해자와 토루 · 구역당',1200,'defense',0,'2'],['curtain_wall','커튼월 · 구역당',4800,'defense',1,'7'],['double_curtain_wall','이중 커튼월 · 구역당',7200,'defense',1,'9'],['gateworks','성문과 부속시설',1440,'defense',1,'-1'],['large_gateworks','대형 성문과 부속시설',1680,'defense',1,'-2'],['postern','후문',1440,'defense',1,'0'],['square_gate_tower','사각 성문탑',3600,'defense',1,'4'],['huge_keep','거대 주탑',24000,'defense',1,'20'],['square_keep','사각 주탑',7200,'defense',1,'10'],['square_tower','사각 탑',2400,'defense',1,'5'],['tall_square_keep','고층 사각 주탑',12000,'defense',2,'15'],['double_square_tower','이중 사각 탑',4800,'defense',2,'8'],['triple_square_tower','삼중 사각 탑',7200,'defense',2,'11'],['gatehouse','성문루',7200,'defense',3,'10'],['tall_gatehouse','고층 성문루',12000,'defense',3,'12'],['palace','궁전',7200,'defense',3,'2'],['round_keep','원형 주탑',9600,'defense',3,'12'],['tall_round_keep','고층 원형 주탑',19200,'defense',3,'18'],['round_tower','원형 탑',4800,'defense',3,'7'],['double_round_tower','이중 원형 탑',9600,'defense',3,'10'],['triple_round_tower','삼중 원형 탑',14400,'defense',3,'13'],['barbican','바비칸',7200,'defense',4,'4'],['large_barbican','대형 바비칸',14400,'defense',4,'6'],['d_tower','D형 탑',7200,'defense',4,'7']
].map(([id,label,costDeniers,category,phase = 0,dv = null]) => ({ id,label,costDeniers,category,phase,dv,sourcePage:'Ch.12 pp.203-204' }));

export const RETAINER_CATALOG = [
  { id:'chaplain',label:'사제',phase:0,skillDice:{Languages:'1d6+6','Reading & Writing':'1d6+6',Religion:'1d6+6','Love [God]':'2d6+6'} },
  { id:'engineer',label:'공병',phase:0,skillDice:{Siege:'2d6+6'} },
  { id:'healer',label:'치료사',phase:0,skillDice:{Chirurgery:'1d6+6','First Aid':'2d6+6'} },
  { id:'herald',label:'전령관',phase:2,skillDice:{Courtesy:'1d6+6',Eloquence:'1d6+6',Heraldry:'2d6+6',Gaming:'2d6+6'} },
  { id:'horse_groom',label:'마필 관리인',phase:0,skillDice:{Horsemanship:'2d6+6'} },
  { id:'magician',label:'마술사·점성가',phase:0,skillDice:{Magic:'1d6','Faerie Lore':'1d6+6'} },
  { id:'master_smith',label:'장인 대장장이',phase:0,skillDice:{'Industry (forging)':'2d6+6'} },
  { id:'merchant',label:'상인',phase:0,skillDice:{Trade:'1d6+6'} },
  { id:'minstrel',label:'음유시인',phase:2,skillDice:{Romance:'1d6+6',Courtesy:'1d6+6',Eloquence:'1d6+6','Play Instrument':'1d6+6'} },
  { id:'spy',label:'첩자',phase:0,skillDice:{'Folk Lore':'1d6+6',Awareness:'2d6+6',Intrigue:'2d6+6'} },
  { id:'squire',label:'종자',phase:0,skillDice:{} },
  { id:'steward',label:'청지기',phase:0,skillDice:{Stewardship:'2d6+6',Energetic:'2d6+6'} }
].map(item => ({ ...item, annualCostDeniers: 240, sourcePage:'Ch.12 pp.204-205' }));

export const RANSOM_VALUES = {
  freeman: ['자유민',240], priest_monk:['사제·수도사',480], squire:['종자',960], knight_mercenary:['용병 기사',1440],
  knight_bachelor:['독신 기사',2880], knight_vassal:['봉신 기사',4320], knight_banneret:['배너렛 기사',8400], abbot:['수도원장',8400],
  bishop:['주교',18000], count:['백작',18000], archbishop:['대주교',36000], duke:['공작',72000], prince:['왕자',240000], king:['왕',2400000]
};

export const UNIVERSAL_AIDS = [
  { id:'eldest_son_knighting',label:'장남의 기사 서임',note:'기사 장비에 최소 £8. £8 초과 지출은 부자와 아들이 £1당 Glory 1, 최대 100.' },
  { id:'eldest_daughter_wedding',label:'장녀의 혼인',note:'혼례 비용과 지참금 마련.' },
  { id:'ransom_lord',label:'주군의 몸값',note:'두 번째 포획에는 봉신이 다시 낼 의무가 없다.' },
  { id:'support_crusade',label:'십자군 원조',note:'봉신이 영광과 비용을 함께 부담.' }
];

export const MILITARY_PURCHASES = [
  {id:'bandits_10',label:'도적 10명 · 한 달',costDeniers:240,type:'mercenary'},
  {id:'foot_soldiers_5',label:'보병 5명 · 한 달',costDeniers:240,type:'mercenary'},
  {id:'siege_crew_4',label:'공성 병기 조작원 4명 · 한 달',costDeniers:240,type:'mercenary'},
  {id:'armored_foot_2',label:'장갑 보병 2명 · 한 달',costDeniers:240,type:'mercenary'},
  {id:'mounted_sergeant',label:'여행마를 탄 하사관 1명 · 한 달',costDeniers:240,type:'mercenary'},
  {id:'arrows_5000',label:'화살 5,000발',costDeniers:2400,type:'siege'},
  {id:'ladders_250',label:'사다리 250개',costDeniers:2400,type:'siege'},
  {id:'pavis_mantlets_100',label:'파비스와 방패막이 100개',costDeniers:2400,type:'siege'},
  {id:'ballistae_4',label:'발리스타 4대',costDeniers:2400,type:'siege'},
  {id:'tortoises_3',label:'공성 차폐차 3대와 충차·곡괭이·천공기',costDeniers:2400,type:'siege'},
  {id:'mangonels_2',label:'중형 망고넬 2대',costDeniers:2400,type:'siege'},
  {id:'trebuchet',label:'대형 트레뷰셋 1대',costDeniers:2400,type:'siege'},
  {id:'siege_tower',label:'공성탑 1대',costDeniers:2400,type:'siege'}
];

const magic = (id, label, kind, summary, effects = {}, options = {}) => ({ id,label,kind,summary,effects,combatBase:options.combatBase || null,personalityBased:Boolean(options.personalityBased),sourcePage:options.sourcePage || 'Ch.12 pp.205-209' });
export const MAGIC_ITEM_CATALOG = [
  magic('agolants_ring','아골란트의 반지','object','악한 마법과 독에 1d20 대항, 보물 은닉, 배신 경고.',{ gm:true }),
  magic('holy_relic_amulet','성유물 부적','relic','특정 기독교 특성이 15를 넘는 만큼 생명력 증가.',{ hpFromReligiousTrait:true }),
  magic('astolfs_horn','아스톨프의 뿔나팔','object','듣는 모든 이가 Valorous -10을 즉시 판정.',{ gmTargets:true }),
  magic('aumons_tent','아우몬의 천막','object','밤을 밝히고 내부에서 먼 주변을 본다.',{ narrative:true }),
  magic('book_of_sorcery','마도서','object','조건을 갖춘 단 한 번의 독서로 Magic과 Faerie Lore를 바꾸며 광기 위험을 판정.',{ procedure:true }),
  magic('book_of_knowledge','지식서','object','성공적인 독서 한 번으로 지정 지식 기술 +1.',{ procedure:true }),
  magic('book_of_magic','마법서','object','주문·악마 소환의 서사적 도구.',{ gm:true }),
  magic('byzantine_cup','비잔티움 잔','object','열병과 흔한 질병을 치료하고 하루 동안 의식 불명으로 취급.',{ health:true }),
  magic('cassandras_canopy','카산드라의 천개','object','사랑하는 부부에게 지속적인 축복.',{ gm:true }),
  magic('charlemagnes_scepter','샤를마뉴의 홀','object','프랑크 왕만 소유 가능. 모든 Standing +3.',{ standingBonus:3 }),
  magic('charlemagnes_talisman','샤를마뉴의 부적','relic','마법으로부터 보호하고 모든 기독교 특성 +1.',{ religiousTraitBonus:1 }),
  magic('conjuring_powder','소환의 가루','object','마우기스가 악마를 소환하는 데 사용.',{ consumable:true,gm:true }),
  magic('crown_lombards','롬바르드 왕관','relic','APP와 Love [God] +3.',{ appBonus:3,loveGodBonus:3 }),
  magic('cumaean_pavilion','쿠마에 천막','object','Honor와 Chaste 성공 시 미래 사건을 보여준다.',{ gm:true }),
  magic('cuckolds_cup','배우자 부정의 잔','object','배우자의 부정을 드러낸다.',{ gm:true }),
  magic('ermengards_tent','에르멘가르드의 치유 천막','object','연 1회 밤을 보낸 뒤 Forgiving 성공치만큼 회복.',{ annualUse:true,health:true }),
  magic('faerie_crystal','요정 수정','object','치명상 또는 죽음의 부상에서 한 번 생명을 구하고 깨진다.',{ singleUse:true,health:true }),
  magic('faerie_fruit','요정 열매','object','최근 며칠의 기억을 잃게 하며 현실에서 하루 만에 썩는다.',{ consumable:true,narrative:true }),
  magic('faerie_healing_stone','요정 치유석','object','상처를 완치하고 그 피해를 소유자에게 옮긴다. 사람당 평생 한 번.',{ health:true }),
  magic('fastradas_ring','파스트라다의 반지','object','Love 2d6+6 마법을 지닌다.',{ gm:true }),
  magic('infinite_water_flask','무한한 물의 플라스크','object','마실 만큼의 물을 끝없이 따른다.',{ narrative:true }),
  magic('fountain_love_hate','사랑과 증오의 샘물','object','다음 이성 대상 Love 또는 Hate 2d6+6, 기존 반대 감정을 같은 수치로 뒤집는다.',{ procedure:true }),
  magic('frisian_banner','프리슬란트 깃발','object','Battle +3, 폭풍과 번개에서 보호.',{ battleBonus:3 }),
  magic('healing_balm','치유의 향유','object','상처 하나를 즉시 완치.',{ consumable:true,health:true }),
  magic('logastillas_book','로가스틸라의 책','object','Reading & Writing 성공 시 마법·함정·환상을 푸는 정보 제공.',{ gm:true }),
  magic('lovers_rings','연인의 예지 반지','object','짝 반지를 낀 연인이 위험하면 자동 변색.',{ narrative:true }),
  magic('maugis_spellbook','마우기스의 주문서','object','소환할 악마의 이름과 약점을 알게 한다.',{ gm:true }),
  magic('melissas_mirror','멜리사의 거울','object','비친 장소의 과거를 보여준다.',{ gm:true }),
  magic('ogiers_ring','오지에의 반지','object','모든 자연 노화 판정에서 보호.',{ agingImmune:true }),
  magic('oliphant','올리팡','object','10마일에 들리고 아군 Valorous +5, 적 -5. 사용자 Reckless +5와 방어 무시 1d6 피해.',{ combatAction:true }),
  magic('oriflamme','오리플람','relic','기독교인이 들면 이교도를 눈멀게 하고 전장의 소유자 Battle +5.',{ battleBonus:5,gmTargets:true }),
  magic('potion_sleep','수면 물약','object','마시면 8시간 마법의 잠.',{ consumable:true }),
  magic('powder_sleep','수면 가루','object','흡입한 사람과 동물을 몇 시간 즉시 재운다.',{ consumable:true,gmTargets:true }),
  magic('powder_sneezing','재채기 가루','object','3d6 근접 라운드 동안 모든 행동 -5.',{ consumable:true,combatModifier:-5 }),
  magic('ring_protection','보호의 반지','object','강철·불·익사 중 지정 원인 하나의 피해를 절반으로 한다.',{ halfDamageChoice:true }),
  magic('ring_reason','이성의 반지','object','마법과 환상을 무효화하고 입에 물면 투명해진다.',{ gm:true }),
  magic('tassilo_chalice','타실로의 성배','object','Eloquence와 Proud +5.',{ eloquenceBonus:5,proudBonus:5 }),
  magic('almace','알마스','weapon','기독교 사용자의 가장 낮은 종교 특성만큼 피해 증가.',{ damageFromLowestReligious:true },{combatBase:'sword'}),
  magic('griffin_arrow','그리핀의 화살','weapon','사람이나 말에 처음 쏠 때 Bow +10.',{ firstShotBowBonus:10,singleUseTrigger:true},{combatBase:'bow'}),
  magic('blinding_shield','아틀란테스의 눈부신 방패','armor','보는 사람을 한 시간 자동 실명시킨다.',{ gmTargets:true },{combatBase:'shield'}),
  magic('aumons_helmet','아우몬의 투구','armor','생명력 +3.',{ hpBonus:3 }),
  magic('balisard','발리사르드','weapon','피해는 보통이지만 모든 갑옷을 절반으로 줄인다.',{ halveArmor:true },{combatBase:'sword'}),
  magic('charlemagnes_helmet','샤를마뉴의 투구','armor','방어 +5.',{ armorBonus:5 }),
  magic('courtain','쿠르탱','weapon','Just가 10을 넘는 만큼 피해 증가.',{ damageFromJust:true },{combatBase:'sword',personalityBased:true}),
  magic('dagger_fate','운명의 단검','weapon','집중하면 칼날 색으로 미래의 위험을 암시한다.',{ gm:true },{combatBase:'dagger'}),
  magic('durendal','뒤랑달','weapon','Honor가 10을 넘는 만큼 기술과 피해 증가.',{ skillDamageFromHonor:true },{combatBase:'sword',personalityBased:true}),
  magic('froberge','프로베르주','weapon','Love [family]가 10을 넘는 만큼 생명력 증가.',{ hpFromLoveFamily:true },{combatBase:'sword',personalityBased:true}),
  magic('golden_lance','황금 마상창','weapon','부서지지 않고 보통 피해를 주며 적을 자동 낙마시킨다.',{ unbreakable:true,automaticUnhorse:true },{combatBase:'lance'}),
  magic('halteclere','오트클레르','weapon','Prudent와 Honor +3.',{ prudentBonus:3,honorBonus:3 },{combatBase:'sword'}),
  magic('hectors_armor','헥토르의 갑옷','armor','방어력이 착용자의 Honor와 같다.',{ armorFromHonor:true },{personalityBased:true}),
  magic('joyeuse','주아외즈','weapon','독 면역. 큰 부상의 추가 효과와 생명력 손실에 따른 -5/-10을 무시.',{ poisonImmune:true,ignoreMajorWoundEffects:true,ignoreHealthPenalties:true },{combatBase:'sword'}),
  magic('mambrinos_helmet','맘브리노의 투구','armor','방어 +1.',{ armorBonus:1 }),
  magic('murgleis','뮈르글레','weapon','큰 부상의 오한 효과에서 보호.',{ ignoreMajorWoundChill:true },{combatBase:'sword'}),
  magic('nimrods_armor','님로드의 갑옷','armor','무기와 불에 방어 20, 모든 Standing -5.',{ armorOverride:20,standingPenalty:5 }),
  magic('otuels_gambeson','오투엘의 감베슨','armor','열과 불에서 보호하고 부상을 입으면 First Aid처럼 자동 치유.',{ fireImmune:true,automaticFirstAid:true }),
  magic('crown_thorns','가시관','relic','첫 기도와 Love [Charlemagne] 성공으로 Modest와 Forgiving을 영구 증가.',{ procedure:true }),
  magic('last_supper_cup','최후의 만찬 성배','relic','첫 음용과 True Love [God] 성공으로 Love [God] +3.',{ procedure:true }),
  magic('ring_meek','온유의 반지','relic','기독교 착용자 Modest +3.',{ modestBonus:3 }),
  magic('saints_relic','성인의 유물','relic','해당 성인과 관련된 성격 특성 +1d3.',{ procedure:true }),
  magic('sancta_camisa','산크타 카미사','relic','자녀 없는 기독교인의 Love [Charlemagne] 성공 시 다음 출산 +5.',{ procedure:true }),
  magic('st_george_belt_spurs','성 조지의 검대와 박차','relic','검대는 Valorous +3, 박차는 Horsemanship +3.',{ valorousBonus:3,horsemanshipBonus:3 }),
  magic('st_george_lance','성 조지의 마상창','relic','기독교 사용자의 가장 낮은 종교 특성만큼 피해 증가.',{ damageFromLowestReligious:true },{combatBase:'lance'}),
  magic('st_martins_cloak','성 마르틴의 망토','relic','성소 앞에서 기도한 모든 기독교 전사가 그날 첫 근접전·전투 라운드에 자연 방어 +3.',{ firstRoundArmorBonus:3 })
];

const catalogById = (catalog, id) => catalog.find(item => item.id === id);
const normalizeEntry = (entry, index, prefix) => ({ ...entry, id: safeId(entry.id || `${prefix}:${index + 1}`) });

const normalizePendingRansoms = pendingEconomy => list(pendingEconomy)
  .filter(entry => ['ransom', 'player_ransom'].includes(entry.type))
  .map((entry, index) => ({
    ...normalizeEntry(entry, index, 'ransom'),
    amountDeniers: entry.amountDeniers ?? (entry.amount == null ? null : toDeniers(entry.amount)),
    direction: entry.type === 'player_ransom' ? 'payable' : 'receivable',
    status: entry.status === 'settled' ? 'settled' : 'pending',
    sourceType: entry.type || 'ransom'
  }));

const mergeUniqueEntries = (primary, additions, limit = 1000) => {
  const ids = new Set(primary.map(entry => entry.id));
  const uniqueAdditions = additions.filter(entry => {
    if (ids.has(entry.id)) return false;
    ids.add(entry.id);
    return true;
  });
  return [...primary, ...uniqueAdditions].slice(-limit);
};

export const CHRISTIAN_RELIGIOUS_TRAITS = Object.freeze([...RELIGIOUS_TRAITS]);

export const createEconomyState = (character = {}, pendingEconomy = []) => {
  const manorCount = Number.isFinite(Number(character.family?.manors))
    ? Math.max(0, asInt(character.family.manors))
    : character.family?.hasEstate || String(character.gear?.homePossessions || '').includes('장원') ? 1 : 0;
  const year = asInt(character.personal?.campaignYear, 767);
  return {
    version: ECONOMY_SCHEMA_VERSION,
    coinDeniers: toDeniers(character.gear?.cash || 0),
    treasure: [],
    ransoms: normalizePendingRansoms(pendingEconomy),
    loans: [], deposits: [], investments: [],
    estates: Array.from({ length: manorCount }, (_, index) => ({ id:`estate:migrated:${index + 1}`,name:`장원 ${index + 1}`,type:'manor',annualIncomeDeniers:1440,status:'active',acquiredYear:year,source:'legacy_migration' })),
    income: [], expenses: [], retainers: [], buildings: [], magicItems: [], equipment: [], transactions: [],
    aidsUsed: {}, famineMultiplier: 1, lastWinterYear: null, migratedFromLegacy: true
  };
};

export const sanitizeEconomyState = (value, character = {}, pendingEconomy = []) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : createEconomyState(character, pendingEconomy);
  const normalize = (key, limit = 1000) => list(source[key]).slice(-limit).map((entry, index) => normalizeEntry(entry, index, key));
  const ransoms = mergeUniqueEntries(normalize('ransoms'), normalizePendingRansoms(pendingEconomy));
  return {
    version: ECONOMY_SCHEMA_VERSION,
    coinDeniers: money(source.coinDeniers ?? toDeniers(character.gear?.cash || 0)),
    treasure: normalize('treasure'), ransoms, loans: normalize('loans'), deposits: normalize('deposits'), investments: normalize('investments'),
    estates: normalize('estates', 250), income: normalize('income'), expenses: normalize('expenses'), retainers: normalize('retainers', 250), buildings: normalize('buildings', 500),
    magicItems: normalize('magicItems', 250), equipment: normalize('equipment', 1000), transactions: normalize('transactions', 2000),
    aidsUsed: source.aidsUsed && typeof source.aidsUsed === 'object' && !Array.isArray(source.aidsUsed) ? source.aidsUsed : {},
    annualRetainerEffects: source.annualRetainerEffects && typeof source.annualRetainerEffects === 'object' && !Array.isArray(source.annualRetainerEffects) ? source.annualRetainerEffects : {},
    famineMultiplier: Math.max(1, asInt(source.famineMultiplier, 1)), lastWinterYear: source.lastWinterYear == null ? null : asInt(source.lastWinterYear), migratedFromLegacy: Boolean(source.migratedFromLegacy)
  };
};

export const ensureEconomy = characterValue => {
  const character = clone(characterValue);
  character.campaign = character.campaign || {};
  character.gear = character.gear || {};
  character.campaign.economy = sanitizeEconomyState(character.campaign.economy, character, character.campaign.pendingEconomy);
  character.campaign.pendingEconomy = [];
  character.gear.cash = toLivres(character.campaign.economy.coinDeniers);
  return character;
};

const appendTransaction = (character, entry) => {
  const economy = character.campaign.economy;
  const normalized = {
    id: safeId(entry.id || `economy:${entry.type}:${entry.year || character.personal?.campaignYear}:${entry.createdAt || Date.now()}`),
    year: asInt(entry.year, character.personal?.campaignYear || 767), type: String(entry.type || 'entry'), amountDeniers: asInt(entry.amountDeniers),
    label: String(entry.label || '경제 기록'), sourceRuleId: String(entry.sourceRuleId || 'WEALTH-INCOME-001'), sourcePage: String(entry.sourcePage || 'Ch.12'),
    assetValueDeniers: money(entry.assetValueDeniers), inventoryId: entry.inventoryId || null,
    relatedId: entry.relatedId || null, note: String(entry.note || ''), createdAt: iso(entry.createdAt)
  };
  const existing = economy.transactions.find(item => item.id === normalized.id);
  if (existing) return existing;
  economy.transactions = [...economy.transactions, normalized].slice(-2000);
  return normalized;
};

const changeCoin = (character, amountDeniers, entry) => {
  const transactionId = entry?.id ? safeId(entry.id) : null;
  const existing = transactionId
    ? character.campaign.economy.transactions.find(item => item.id === transactionId)
    : null;
  if (existing) return { transaction: existing, applied: false };
  const before = character.campaign.economy.coinDeniers;
  const after = before + asInt(amountDeniers);
  if (after < 0) throw new RangeError(`보유 현금이 ${formatCoin(Math.abs(after))} 부족합니다.`);
  character.campaign.economy.coinDeniers = after;
  character.gear.cash = toLivres(after);
  const transaction = appendTransaction(character, { ...entry, amountDeniers });
  const ledgerKey = amountDeniers >= 0 ? 'income' : 'expenses';
  character.campaign.economy[ledgerKey] = [...character.campaign.economy[ledgerKey], transaction].slice(-1000);
  return { transaction, applied: true };
};

const recordBattleLoot = (character, input, valueDeniers) => {
  const economy = character.campaign.economy;
  const transactionId = safeId(input.id || `battle-loot:${input.year || character.personal?.campaignYear}:${input.createdAt || Date.now()}`);
  const existing = economy.transactions.find(item => item.id === transactionId);
  if (existing) return { transaction: existing, applied: false };

  const inventoryId = safeId(`${transactionId}:inventory`);
  const treasure = {
    id: inventoryId,
    label: String(input.label || '전투 전리품'),
    category: 'battle_loot',
    quantity: 1,
    unitValueDeniers: money(valueDeniers),
    acquiredYear: asInt(input.year, character.personal?.campaignYear || 767),
    source: 'battle_loot',
    sourceId: input.sourceId || transactionId,
    disposed: false,
    note: String(input.note || '')
  };
  economy.treasure = mergeUniqueEntries(economy.treasure, [treasure]);
  const transaction = appendTransaction(character, {
    ...input,
    id: transactionId,
    amountDeniers: 0,
    assetValueDeniers: treasure.unitValueDeniers,
    inventoryId,
    relatedId: inventoryId,
    sourcePage: 'Chapter 8 pp.148-149; Chapter 12 pp.195, 198-199'
  });
  economy.income = [...economy.income, transaction].slice(-1000);
  appendChronicleEvent(character, {
    id: `${transactionId}:chronicle`,
    year: treasure.acquiredYear,
    type: 'treasure',
    title: treasure.label,
    narrative: `${formatCoin(treasure.unitValueDeniers)} 상당의 전리품을 확보해 보물 목록에 기록했습니다.`,
    sourceRuleId: transaction.sourceRuleId,
    sourcePage: transaction.sourcePage,
    createdAt: transaction.createdAt
  });
  return { transaction, treasure, applied: true };
};

export const recordEconomyTransfer = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const amountDeniers = asInt(input.amountDeniers ?? toDeniers(input.amountLivres));
  const result = input.type === 'battle_loot'
    ? recordBattleLoot(character, input, amountDeniers)
    : changeCoin(character, amountDeniers, input);
  return { character, economy: character.campaign.economy, ...result };
};

export const getMarketAvailability = (itemId, year, options = {}) => {
  const item = catalogById(MARKET_CATALOG, itemId);
  if (!item) return { available:false,reason:'unknown_item',item:null };
  const phase = getCampaignPhase(year)?.number ?? 0;
  if (item.referenceOnly || item.foreign) return options.gmOverride ? { available:true,reason:'gm_override',item } : { available:false,reason:'foreign_or_reference_only',item };
  if (phase < item.phase) return { available:false,reason:'future_phase',item,requiredPhase:item.phase,currentPhase:phase };
  if (options.gmUnavailable) return { available:false,reason:'gm_unavailable',item };
  return { available:true,reason:'standard_city_market',item,currentPhase:phase };
};

export const getMerchantMultiplier = outcome => ({ critical:0.5,success:0.75,failure:1,fumble:1.5 }[outcome] ?? 1);
export const getMerchantSaleMultiplier = outcome => ({ critical:1,success:0.75,failure:0.5,fumble:0.25 }[outcome] ?? 0.5);

export const buyMarketItem = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const quantity = Math.max(1, asInt(input.quantity, 1));
  const availability = getMarketAvailability(input.itemId, character.personal?.campaignYear, input);
  if (!availability.available) throw new RangeError(availability.reason === 'future_phase' ? `이 품목은 Phase ${availability.requiredPhase}부터 구할 수 있습니다.` : '표준 도시 시장에서 구할 수 없는 품목입니다.');
  const item = availability.item;
  let multiplier = asNumber(input.priceMultiplier, 1);
  let merchantCheck = null;
  if (input.merchantRoll != null) {
    const merchantSkill = input.merchantSkill ?? getRetainerSkill(character, 'merchant', 'Trade');
    merchantCheck = resolveD20Roll(input.merchantRoll, asInt(merchantSkill));
    multiplier *= getMerchantMultiplier(merchantCheck.outcome);
  }
  if (multiplier <= 0 || (!input.gmPriceNote && multiplier !== 1 && !merchantCheck)) throw new RangeError('GM 가격 조정에는 근거를 기록해야 합니다.');
  const foodMultiplier = item.category === 'food' ? Math.max(1, asInt(character.campaign.economy.famineMultiplier, 1)) : 1;
  const cost = Math.round(item.costDeniers * quantity * multiplier * foodMultiplier);
  const coinChange = changeCoin(character, -cost, { id:input.transactionId,type:'market_purchase',label:`${item.label} 구입`,relatedId:item.id,note:input.gmPriceNote,sourceRuleId:'WEALTH-MARKET-001',sourcePage:item.sourcePage,createdAt:input.now });
  if (!coinChange.applied) return { character, item, costDeniers:cost, merchantCheck, economy:character.campaign.economy, applied:false };
  if (!item.service) {
    const collection = ['armor','horseArmor','melee','missile','mount'].includes(item.category) ? 'equipment' : 'treasure';
    const existing = character.campaign.economy[collection].find(entry => entry.marketItemId === item.id && !entry.disposed);
    if (existing) existing.quantity = asInt(existing.quantity, 1) + quantity;
    else character.campaign.economy[collection].push({ id:safeId(`inventory:${item.id}:${iso(input.now)}`),marketItemId:item.id,label:item.label,category:item.category,quantity,unitValueDeniers:item.costDeniers,acquiredYear:character.personal?.campaignYear,source:'market',equipped:false });
  }
  return { character, item, costDeniers:cost, merchantCheck, economy:character.campaign.economy, applied:true };
};

export const sellMarketItem = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const priorTransaction = input.transactionId
    ? character.campaign.economy.transactions.find(entry => entry.id === safeId(input.transactionId))
    : null;
  if (priorTransaction) {
    return {
      character,
      proceedsDeniers: priorTransaction.amountDeniers,
      multiplier: input.tradeWithOwnLord ? 1 : 0.5,
      merchantCheck: null,
      economy: character.campaign.economy,
      applied: false
    };
  }
  const collection = input.collection === 'treasure' ? 'treasure' : 'equipment';
  const owned = character.campaign.economy[collection].find(entry => entry.id === input.inventoryId && !entry.disposed);
  if (!owned) throw new RangeError('매각할 소유 물품을 찾을 수 없습니다.');
  const item = catalogById(MARKET_CATALOG, owned.marketItemId);
  const quantity = Math.max(1, Math.min(asInt(input.quantity, 1), asInt(owned.quantity, 1)));
  let multiplier = input.tradeWithOwnLord ? 1 : 0.5;
  let merchantCheck = null;
  if (input.merchantRoll != null && !input.tradeWithOwnLord) {
    const merchantSkill = input.merchantSkill ?? getRetainerSkill(character, 'merchant', 'Trade');
    merchantCheck = resolveD20Roll(input.merchantRoll, asInt(merchantSkill));
    multiplier = getMerchantSaleMultiplier(merchantCheck.outcome);
  }
  const proceeds = Math.round(asInt(owned.unitValueDeniers, item?.costDeniers || 0) * quantity * multiplier);
  const coinChange = changeCoin(character, proceeds, { id:input.transactionId,type:'market_sale',label:`${owned.label} 매각`,relatedId:owned.id,note:input.tradeWithOwnLord?'자신의 주군과 정가 거래':'시장 거래',sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 pp.198-199',createdAt:input.now });
  if (!coinChange.applied) return { character, proceedsDeniers:proceeds, multiplier, merchantCheck, economy:character.campaign.economy, applied:false };
  owned.quantity = asInt(owned.quantity, 1) - quantity;
  if (owned.quantity <= 0) { owned.quantity = 0; owned.disposed = true; owned.equipped = false; }
  return { character, proceedsDeniers:proceeds, multiplier, merchantCheck, economy:character.campaign.economy, applied:true };
};

export const resolveFoodPriceCheck = (characterValue, input = {}, rng = Math.random) => {
  const character = ensureEconomy(characterValue);
  const roll = input.roll || rollDie(6, rng);
  if (roll < 1 || roll > 6) throw new RangeError('식량 가격 판정은 d6 1~6이어야 합니다.');
  const doubled = Boolean(input.famine) || roll === 1;
  character.campaign.economy.famineMultiplier = doubled ? Math.max(1, asInt(character.campaign.economy.famineMultiplier, 1)) * 2 : 1;
  character.campaign.economy.famineYear = character.personal?.campaignYear;
  appendTransaction(character,{type:'food_price_check',amountDeniers:0,label:doubled?`식량 가격 ×${character.campaign.economy.famineMultiplier}`:'식량 가격 정상',note:input.famine?'기근':'d6 판정',sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.199'});
  return {character,roll,multiplier:character.campaign.economy.famineMultiplier,economy:character.campaign.economy};
};

export const trainMountForAttack = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const phase = getCampaignPhase(character.personal?.campaignYear)?.number ?? 0;
  if (phase < 4) throw new RangeError('말의 전투 훈련은 Phase 4부터 가능합니다.');
  const mount = character.campaign.economy.equipment.find(entry => entry.id === input.inventoryId && entry.category === 'mount' && !entry.disposed);
  if (!mount || mount.attackTrained) throw new RangeError('훈련할 미훈련 말을 찾을 수 없습니다.');
  const trainingCost = money(mount.unitValueDeniers);
  changeCoin(character,-trainingCost,{type:'mount_attack_training',label:`${mount.label} 전투 훈련`,relatedId:mount.id,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.199',createdAt:input.now});
  mount.attackTrained = true;
  mount.unitValueDeniers += trainingCost;
  mount.note = 'Phase 4 전투 훈련 완료 · 실제 말 공격은 Chapter 18 절차';
  return {character,mount,trainingCostDeniers:trainingCost,economy:character.campaign.economy};
};

export const payToFreeEnslavedPerson = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const amount = money(input.amountDeniers);
  if (amount < 120 || amount > toDeniers(10)) throw new RangeError('해방 목적의 일반 가격은 120d~£1½이며 특별한 경우에도 £10을 넘지 않습니다.');
  if (amount > toDeniers(1.5) && !input.gmSpecial) throw new RangeError('£1½ 초과 가격은 특별한 인물이라는 GM 확인이 필요합니다.');
  changeCoin(character,-amount,{type:'emancipation_payment',label:'노예 신분인 사람의 해방',note:input.note,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.205',createdAt:input.now});
  return {character,amountDeniers:amount,economy:character.campaign.economy};
};

export const addEstate = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  if (!input.gmApproved) throw new RangeError('토지의 수여·상속은 GM 결정이 필요합니다.');
  const estate = { id:safeId(input.id || `estate:${character.personal?.campaignYear}:${Date.now()}`),name:String(input.name || '이름 없는 장원'),type:'manor',annualIncomeDeniers:money(input.annualIncomeDeniers ?? 1440),status:'active',acquiredYear:character.personal?.campaignYear,source:String(input.source || 'gm_grant'),note:String(input.note || '') };
  character.campaign.economy.estates.push(estate);
  character.family.manors = character.campaign.economy.estates.filter(entry => entry.status === 'active').length;
  appendTransaction(character,{id:input.transactionId,type:'estate_acquired',amountDeniers:0,label:`${estate.name} 취득`,relatedId:estate.id,note:estate.note,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.196',createdAt:input.now});
  return { character, estate, economy:character.campaign.economy };
};

export const buyBuilding = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const building = catalogById(BUILDING_CATALOG, input.buildingId);
  if (!building) throw new RangeError('건설 표에서 시설을 찾을 수 없습니다.');
  const phase = getCampaignPhase(character.personal?.campaignYear)?.number ?? 0;
  if (phase < building.phase) throw new RangeError(`이 방어시설은 Phase ${building.phase}부터 건설할 수 있습니다.`);
  if (building.category === 'defense' && !input.lordApproval) throw new RangeError('방어시설은 Standing [lord] 성공 승인이 필요합니다.');
  const quantity = Math.max(1, asInt(input.quantity, 1));
  const cost = building.costDeniers * quantity;
  changeCoin(character,-cost,{id:input.transactionId,type:'construction',label:`${building.label} 건설`,relatedId:building.id,note:input.note,sourceRuleId:'WEALTH-MARKET-001',sourcePage:building.sourcePage,createdAt:input.now});
  const entry = { id:safeId(`building:${building.id}:${iso(input.now)}`),buildingId:building.id,label:building.label,category:building.category,quantity,costDeniers:cost,dv:building.dv,estateId:input.estateId || null,status:'complete',builtYear:character.personal?.campaignYear };
  character.campaign.economy.buildings.push(entry);
  if (building.category === 'defense') {
    character.campaign.fortresses = [...(character.campaign.fortresses || []),{id:entry.id,name:entry.label,dv:entry.dv,source:'chapter_12_construction',year:entry.builtYear}].slice(-100);
  }
  return { character, building:entry, economy:character.campaign.economy };
};

const rollNotation = (notation, rng) => {
  const match = String(notation).match(/(\d+)d6(?:\+(\d+))?/);
  if (!match) return null;
  return Array.from({length:asInt(match[1])},()=>rollDie(6,rng)).reduce((sum,value)=>sum+value,asInt(match[2]));
};

export const hireRetainer = (characterValue, input = {}, rng = Math.random) => {
  const character = ensureEconomy(characterValue);
  const profile = catalogById(RETAINER_CATALOG, input.retainerId);
  if (!profile) throw new RangeError('전문 수행원 표에서 대상을 찾을 수 없습니다.');
  const phase = getCampaignPhase(character.personal?.campaignYear)?.number ?? 0;
  if (phase < profile.phase) throw new RangeError(`이 전문가는 Phase ${profile.phase}부터 고용할 수 있습니다.`);
  const age = profile.id === 'squire' ? 15 : asInt(input.age, rollDie(20,rng)+20);
  const skills = Object.fromEntries(Object.entries(profile.skillDice).map(([skill, notation]) => [skill, rollNotation(notation,rng)]));
  const retainer = { id:safeId(input.id || `retainer:${profile.id}:${Date.now()}`),profileId:profile.id,name:String(input.name || profile.label),label:profile.label,age,skills,annualCostDeniers:profile.annualCostDeniers,status:'active',hiredYear:character.personal?.campaignYear,annualChecks:profile.id!=='magician',fundMagicResearch:Boolean(input.fundMagicResearch) };
  character.campaign.economy.retainers.push(retainer);
  appendTransaction(character,{id:input.transactionId,type:'retainer_hired',amountDeniers:0,label:`${retainer.name} 고용`,relatedId:retainer.id,sourceRuleId:'WEALTH-MARKET-001',sourcePage:profile.sourcePage,createdAt:input.now});
  return { character, retainer, economy:character.campaign.economy };
};

export const dismissRetainer = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const retainer = character.campaign.economy.retainers.find(entry => entry.id === input.retainerId && entry.status === 'active');
  if (!retainer) throw new RangeError('해고할 수행원을 찾을 수 없습니다.');
  if (input.loseHonor) character.passions.honor = Math.max(0,asInt(character.passions?.honor)-1);
  else if (character.campaign.economy.coinDeniers >= retainer.annualCostDeniers) changeCoin(character,-retainer.annualCostDeniers,{type:'retainer_severance',label:`${retainer.name} 해고 보상`,relatedId:retainer.id,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.204',createdAt:input.now});
  else throw new RangeError('한 해 급료를 지급하거나 Honor 1점을 잃어야 합니다.');
  retainer.status='dismissed'; retainer.dismissedYear=character.personal?.campaignYear;
  return { character, retainer, economy:character.campaign.economy };
};

export const performRetainerTask = (characterValue, input = {}, rng = Math.random) => {
  const character = ensureEconomy(characterValue);
  const retainer = character.campaign.economy.retainers.find(entry => entry.id === input.retainerId && entry.status === 'active');
  if (!retainer) throw new RangeError('임무를 맡길 수행원을 찾을 수 없습니다.');
  const year = asInt(character.personal?.campaignYear, 767);
  const yearTasks = list(retainer.tasks).filter(task => task.year === year);
  if (retainer.profileId === 'minstrel' && yearTasks.length >= 1) throw new RangeError('음유시인은 연애 구혼 판정을 한 해에 한 번만 대신할 수 있습니다.');
  if (retainer.profileId === 'herald' && yearTasks.length >= 1) throw new RangeError('전령관은 한 해에 한 번만 한 공적의 Glory를 배가할 수 있습니다.');
  if (retainer.profileId === 'spy' && yearTasks.length >= 3) throw new RangeError('첩자는 한 해에 세 가지 임무까지만 수행할 수 있습니다.');
  if (retainer.profileId === 'master_smith' && yearTasks.length >= 1) throw new RangeError('장인 대장장이는 한 해에 검 한 자루만 제작할 수 있습니다.');
  const skills = Object.keys(retainer.skills || {});
  const skill = skills.includes(input.skill) ? input.skill : skills[0];
  if (!skill) throw new RangeError('이 수행원에게 판정할 기술이 없습니다.');
  if (retainer.profileId === 'spy' && !String(input.note || '').trim()) throw new RangeError('첩자에게 맡긴 구체적인 임무를 기록해야 합니다.');
  const target = asInt(retainer.skills[skill]) + asInt(input.modifier);
  const roll = input.roll || rollDie(20, rng);
  const check = resolveD20Roll(roll, target);
  const task = {
    id:safeId(input.id || `retainer-task:${retainer.id}:${year}:${yearTasks.length + 1}`), year, skill, target, roll:check.roll,
    outcome:check.outcome, modifier:asInt(input.modifier), note:String(input.note || ''), sourcePage:'Ch.12 pp.204-205'
  };
  if (retainer.profileId === 'minstrel') task.effect = '구혼 판정을 주인 대신 수행';
  if (retainer.profileId === 'herald') {
    if (skill !== 'Eloquence') throw new RangeError('공적 선포는 전령관의 Eloquence로 판정합니다.');
    const glory = Math.max(0, asInt(input.gloryAmount));
    if (!glory || !task.note) throw new RangeError('배가할 단일 공적의 원래 Glory와 사건을 기록해야 합니다.');
    if (check.success) {
      recordGloryAward(character,{id:`herald-glory:${retainer.id}:${year}`,year,amount:glory,title:`전령관의 공적 선포 · ${task.note}`,narrative:`${retainer.name}이 공적을 선포하여 원래 Glory ${glory}만큼을 추가했습니다.`,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.204'});
      task.effect = `단일 공적 Glory +${glory}`;
      task.gloryAwarded = glory;
    } else task.effect = '공적 선포 실패 · 추가 Glory 없음';
  }
  if (retainer.profileId === 'spy' && check.success) {
    task.effect = 'GM이 정하는 관련 후속 판정 +5';
    task.futureRollBonus = 5;
  }
  if (retainer.profileId === 'spy' && check.fumble) {
    task.effect = '발각됨 · 후속 Standing 판정 필요';
    retainer.status = 'caught_pending_standing';
  }
  if (retainer.profileId === 'master_smith') {
    const quality = {
      fumble:{label:'결함 있는 검',skillBonus:-1,breakOnTie:false,unbreakable:false},
      failure:{label:'보통 검',skillBonus:0,breakOnTie:false,unbreakable:false},
      success:{label:'우수한 검',skillBonus:1,breakOnTie:true,unbreakable:false},
      critical:{label:'최고급 검',skillBonus:1,breakOnTie:false,unbreakable:true}
    }[check.outcome];
    const sword = {
      id:safeId(`inventory:smith-sword:${retainer.id}:${year}`), marketItemId:'frankish_sword', label:`${retainer.name}의 ${quality.label}`,
      category:'melee',quantity:1,unitValueDeniers:75,acquiredYear:year,source:'master_smith',equipped:false,
      customCombat:{skill:quality.skillBonus,breakOnTie:quality.breakOnTie,unbreakable:quality.unbreakable}
    };
    character.campaign.economy.equipment.push(sword);
    task.effect = `${quality.label} 제작`;
    task.createdItemId = sword.id;
  }
  retainer.tasks = [...yearTasks, task, ...list(retainer.tasks).filter(entry => entry.year !== year)].slice(0,100);
  appendTransaction(character,{id:`${task.id}:record`,year,type:'retainer_task',amountDeniers:0,label:`${retainer.name} · ${task.effect || skill}`,relatedId:retainer.id,note:task.note,sourceRuleId:'WEALTH-MARKET-001',sourcePage:task.sourcePage});
  return { character, retainer, task, check, economy:character.campaign.economy };
};

export const resolveSpyExposure = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const spy = character.campaign.economy.retainers.find(entry => entry.id === input.retainerId && entry.profileId === 'spy' && entry.status === 'caught_pending_standing');
  if (!spy) throw new RangeError('발각된 첩자를 찾을 수 없습니다.');
  const check = resolveD20Roll(input.roll, input.standingTarget);
  spy.status = check.success ? 'active' : 'turned_coat';
  spy.exposure = {year:character.personal?.campaignYear,roll:check.roll,target:check.target,outcome:check.outcome,standing:String(input.standingLabel || 'GM 지정 Standing'),note:String(input.note || '')};
  appendTransaction(character,{type:'spy_exposure',amountDeniers:0,label:check.success?`${spy.name}의 정체 보호`:`${spy.name}의 변절`,relatedId:spy.id,note:spy.exposure.note,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.205'});
  return {character,spy,check,economy:character.campaign.economy};
};

export const takeLoan = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const status = RANSOM_VALUES[input.status];
  if (!status) throw new RangeError('Heribannum 신분을 선택해야 합니다.');
  const principal = money(input.amountDeniers);
  if (!input.goodOrChristianPurpose) throw new RangeError('대출은 선하거나 기독교적인 목적에만 허용됩니다.');
  if (principal > status[1]) throw new RangeError(`통상 대출 한도는 자신의 Heribannum ${formatCoin(status[1])}입니다.`);
  const phase = getCampaignPhase(character.personal?.campaignYear)?.number ?? 0;
  const loan = { id:safeId(input.id || `loan:${Date.now()}`),lender:String(input.lender || '상인'),principalDeniers:principal,balanceDeniers:principal,annualRate:phase*0.1,phaseAtOrigination:phase,status:'active',purpose:String(input.purpose || ''),openedYear:character.personal?.campaignYear,lastInterestYear:character.personal?.campaignYear };
  character.campaign.economy.loans.push(loan);
  changeCoin(character,principal,{id:input.transactionId,type:'loan_received',label:`${loan.lender} 대출`,relatedId:loan.id,note:loan.purpose,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.197-198',createdAt:input.now});
  return { character, loan, economy:character.campaign.economy };
};

export const repayLoan = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const loan = character.campaign.economy.loans.find(entry => entry.id === input.loanId && entry.status === 'active');
  if (!loan) throw new RangeError('상환할 대출을 찾을 수 없습니다.');
  const amount = Math.min(money(input.amountDeniers),money(loan.balanceDeniers));
  if (!amount) throw new RangeError('상환액을 입력해야 합니다.');
  changeCoin(character,-amount,{id:input.transactionId,type:'loan_repayment',label:`${loan.lender} 대출 상환`,relatedId:loan.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198',createdAt:input.now});
  loan.balanceDeniers -= amount;
  if (loan.balanceDeniers <= 0) { loan.balanceDeniers=0; loan.status='repaid'; loan.closedYear=character.personal?.campaignYear; }
  return { character, loan, economy:character.campaign.economy };
};

export const makeDeposit = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const amount = money(input.amountDeniers);
  const free = asInt(character.passions?.honor) >= 16 || Boolean(input.churchStandingSuccess);
  if (!input.personallyKnownToAbbot && asInt(character.passions?.honor) < 16 && !input.churchStandingSuccess) throw new RangeError('수도원 예금은 수도원장과의 친분, Honor 16+, 또는 Standing [Church] 성공이 필요합니다.');
  const feeRate = free ? 0 : asNumber(input.feeRate, 0.05);
  if (!free && (feeRate < 0.05 || feeRate > 0.1)) throw new RangeError('수도원 예금 수수료는 보통 연 5~10%입니다.');
  changeCoin(character,-amount,{id:input.transactionId,type:'deposit',label:'수도원 예금',sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198',createdAt:input.now});
  const deposit={id:safeId(input.id || `deposit:${Date.now()}`),institution:String(input.institution || '수도원'),principalDeniers:amount,balanceDeniers:amount,annualFeeRate:feeRate,status:'active',openedYear:character.personal?.campaignYear,lastFeeYear:character.personal?.campaignYear};
  character.campaign.economy.deposits.push(deposit);
  return { character, deposit, economy:character.campaign.economy };
};

export const withdrawDeposit = (characterValue, input = {}) => {
  const character=ensureEconomy(characterValue);
  const deposit=character.campaign.economy.deposits.find(entry=>entry.id===input.depositId&&entry.status==='active');
  if(!deposit) throw new RangeError('인출할 예금을 찾을 수 없습니다.');
  const amount=Math.min(money(input.amountDeniers),money(deposit.balanceDeniers));
  deposit.balanceDeniers-=amount;
  if(deposit.balanceDeniers<=0){deposit.balanceDeniers=0;deposit.status='withdrawn';}
  changeCoin(character,amount,{id:input.transactionId,type:'deposit_withdrawal',label:`${deposit.institution} 예금 인출`,relatedId:deposit.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198',createdAt:input.now});
  return {character,deposit,economy:character.campaign.economy};
};

export const settleRansom = (characterValue, input = {}) => {
  const character=ensureEconomy(characterValue);
  const claim=character.campaign.economy.ransoms.find(entry=>entry.id===input.claimId&&entry.status!=='settled');
  if(!claim) throw new RangeError('정산할 몸값 청구를 찾을 수 없습니다.');
  const row=RANSOM_VALUES[input.ransomStatus];
  if(!row) throw new RangeError('Table 12-1 신분을 선택해야 합니다.');
  const minimum=row[1];
  const amount=Math.max(minimum,money(input.amountDeniers ?? minimum));
  const direction=input.direction || claim.direction || 'receivable';
  let standingCheck=null;
  if(direction==='receivable') changeCoin(character,amount,{id:input.transactionId,type:'ransom_income',label:`${row[0]} 몸값 수령`,relatedId:claim.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.196-197',createdAt:input.now});
  else if(input.payer==='self') changeCoin(character,-amount,{id:input.transactionId,type:'ransom_payment',label:`${row[0]} 몸값 지급`,relatedId:claim.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.196-197',createdAt:input.now});
  else if(input.payer==='lord' || input.payer==='family') {
    const key=input.payer==='lord'?'liegeLord':'family';
    standingCheck=resolveD20Roll(input.standingRoll,asInt(character.standings?.[key]));
    if(!standingCheck.success) throw new RangeError(input.payer==='lord'?'주군의 몸값 지원이 성립하지 않았습니다.':'가문의 몸값 지원이 성립하지 않았습니다.');
  } else if(input.payer!=='pledge') throw new RangeError('본인·주군·가문·서약 중 몸값 조달 방식을 선택해야 합니다.');
  claim.status='settled'; claim.ransomStatus=input.ransomStatus; claim.amountDeniers=amount; claim.direction=direction; claim.payer=input.payer || 'captor'; claim.settledYear=character.personal?.campaignYear; claim.standingCheck=standingCheck;
  appendTransaction(character,{id:`${claim.id}:settled`,type:'ransom_settled',amountDeniers:0,label:`${row[0]} 몸값 확정`,relatedId:claim.id,note:input.note,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.196-197',createdAt:input.now});
  const captive=character.campaign?.captives?.find(entry=>entry.id===claim.captiveId);
  if(captive){captive.status='ransomed';captive.ransomStatus=input.ransomStatus;captive.ransomClaimId=claim.id;captive.ransomDeniers=amount;captive.settledYear=character.personal?.campaignYear;}
  if(direction==='payable'&&['active','awaiting_ransom'].includes(character.campaign?.captivity?.status)) character.campaign.captivity={...character.campaign.captivity,status:'released',resolvedAt:iso(input.now),releasedYear:character.personal?.campaignYear,ransomClaimId:claim.id};
  appendChronicleEvent(character,{
    id:`${claim.id}:chronicle`,year:character.personal?.campaignYear,type:'ransom',
    title:direction==='receivable'?'몸값을 받다':'몸값을 치르고 풀려나다',
    narrative:direction==='receivable'
      ? `${captive?.name || row[0]}의 몸값 ${formatCoin(amount)}을 받아 포로를 석방했습니다.`
      : `${row[0]}의 몸값 ${formatCoin(amount)}을 정산하고 포로 생활을 마쳤습니다.`,
    sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.196-197',createdAt:iso(input.now)
  });
  return {character,claim,minimumDeniers:minimum,economy:character.campaign.economy};
};

export const addMagicItem = (characterValue, input = {}) => {
  const character=ensureEconomy(characterValue);
  const item=catalogById(MAGIC_ITEM_CATALOG,input.magicItemId);
  if(!item) throw new RangeError('Chapter 12 마법 물품 목록에서 찾을 수 없습니다.');
  if(input.acquisition==='market') throw new RangeError('마법·마법부여 물품은 시장에서 살 수 없습니다.');
  const owned={id:safeId(input.id||`magic:${item.id}:${Date.now()}`),magicItemId:item.id,label:item.label,kind:item.kind,acquiredYear:character.personal?.campaignYear,acquisition:String(input.acquisition||'adventure'),equipped:false,used:false,useCount:0,note:String(input.note||'')};
  character.campaign.economy.magicItems.push(owned);
  appendTransaction(character,{id:input.transactionId,type:'magic_item_acquired',amountDeniers:0,label:`${item.label} 획득`,relatedId:owned.id,note:owned.note,sourceRuleId:'ITEM-MAGIC-001',sourcePage:item.sourcePage,createdAt:input.now});
  return {character,item:owned,economy:character.campaign.economy};
};

const addScoreModifier = (scores, group, key, amount) => {
  scores[group][key] = asInt(scores[group][key]) + asInt(amount);
};

export const getMagicScoreModifiers = character => {
  const owned=list(character.campaign?.economy?.magicItems).filter(entry=>entry.equipped&&!entry.consumed);
  const scores={attributes:{},traits:{},passions:{},skills:{},standings:{all:0}};
  for(const ownedItem of owned){
    const item=catalogById(MAGIC_ITEM_CATALOG,ownedItem.magicItemId); if(!item) continue;
    const e=item.effects;
    if(e.religiousTraitBonus) CHRISTIAN_RELIGIOUS_TRAITS.forEach(key=>addScoreModifier(scores,'traits',key,e.religiousTraitBonus));
    if(e.appBonus) addScoreModifier(scores,'attributes','app',e.appBonus);
    if(e.loveGodBonus) addScoreModifier(scores,'passions','loveGod',e.loveGodBonus);
    if(e.eloquenceBonus) addScoreModifier(scores,'skills','eloquence',e.eloquenceBonus);
    if(e.horsemanshipBonus) addScoreModifier(scores,'skills','horsemanship',e.horsemanshipBonus);
    if(e.proudBonus) addScoreModifier(scores,'traits','proud',e.proudBonus);
    if(e.prudentBonus) addScoreModifier(scores,'traits','prudent',e.prudentBonus);
    if(e.honorBonus) addScoreModifier(scores,'passions','honor',e.honorBonus);
    if(e.modestBonus) addScoreModifier(scores,'traits','modest',e.modestBonus);
    if(e.valorousBonus) addScoreModifier(scores,'traits','valorous',e.valorousBonus);
    if(e.standingBonus) scores.standings.all+=asInt(e.standingBonus);
    if(e.standingPenalty) scores.standings.all-=asInt(e.standingPenalty);
  }
  return scores;
};

export const getMagicCombatEffects = character => {
  const owned=list(character.campaign?.economy?.magicItems).filter(entry=>entry.equipped&&!entry.consumed);
  const scoreModifiers=getMagicScoreModifiers(character);
  const effects={itemIds:[],skillBonus:0,damageBonus:0,armorBonus:0,armorOverride:null,hpBonus:0,battleBonus:0,agingImmune:false,fireImmune:false,fireArmor:0,halfDamageSources:[],automaticFirstAid:false,halveArmor:false,automaticUnhorse:false,unbreakable:false,ignoreHealthPenalties:false,ignoreMajorWoundEffects:false,poisonImmune:false,firstShotBowBonus:0,firstRoundArmorBonus:0,horsemanshipBonus:asInt(scoreModifiers.skills.horsemanship),valorousBonus:asInt(scoreModifiers.traits.valorous),scoreModifiers,personalityBasedOnly:true};
  const lowestReligious=Math.min(...CHRISTIAN_RELIGIOUS_TRAITS.map(key=>asInt(character.traits?.[key])+asInt(scoreModifiers.traits[key])));
  for(const ownedItem of owned){
    const item=catalogById(MAGIC_ITEM_CATALOG,ownedItem.magicItemId); if(!item) continue;
    effects.itemIds.push(item.id); effects.personalityBasedOnly=effects.personalityBasedOnly&&item.personalityBased;
    const e=item.effects;
    if(e.hpBonus) effects.hpBonus+=e.hpBonus;
    if(e.hpFromLoveFamily) effects.hpBonus+=Math.max(0,asInt(character.passions?.loveFamily)-10);
    if(e.hpFromReligiousTrait&&ownedItem.religiousTrait) effects.hpBonus+=Math.max(0,asInt(character.traits?.[ownedItem.religiousTrait])+asInt(scoreModifiers.traits[ownedItem.religiousTrait])-15);
    if(e.damageFromLowestReligious) effects.damageBonus+=lowestReligious;
    if(e.damageFromJust) effects.damageBonus+=Math.max(0,asInt(character.traits?.just)-10);
    if(e.skillDamageFromHonor){const bonus=Math.max(0,asInt(character.passions?.honor)-10);effects.skillBonus+=bonus;effects.damageBonus+=bonus;}
    if(e.armorBonus) effects.armorBonus+=e.armorBonus;
    if(e.armorFromHonor) effects.armorOverride=Math.max(effects.armorOverride??0,asInt(character.passions?.honor));
    if(e.armorOverride) effects.armorOverride=Math.max(effects.armorOverride??0,e.armorOverride);
    if(e.halveArmor) effects.halveArmor=true;
    if(e.automaticUnhorse) effects.automaticUnhorse=true;
    if(e.unbreakable) effects.unbreakable=true;
    if(e.ignoreHealthPenalties) effects.ignoreHealthPenalties=true;
    if(e.ignoreMajorWoundEffects) effects.ignoreMajorWoundEffects=true;
    if(e.poisonImmune) effects.poisonImmune=true;
    if(e.battleBonus) effects.battleBonus+=asInt(e.battleBonus);
    if(e.agingImmune) effects.agingImmune=true;
    if(e.fireImmune) effects.fireImmune=true;
    if(e.armorOverride===20) effects.fireArmor=Math.max(effects.fireArmor,20);
    if(e.automaticFirstAid) effects.automaticFirstAid=true;
    if(e.halfDamageChoice&&['steel','fire','drowning'].includes(ownedItem.protectionChoice)) effects.halfDamageSources.push(ownedItem.protectionChoice);
    if(e.firstShotBowBonus&&!ownedItem.used) effects.firstShotBowBonus=Math.max(effects.firstShotBowBonus,e.firstShotBowBonus);
    if(e.firstRoundArmorBonus) effects.firstRoundArmorBonus=Math.max(effects.firstRoundArmorBonus,e.firstRoundArmorBonus);
  }
  return effects;
};

export const equipMagicItem = (characterValue, input = {}) => {
  const character=ensureEconomy(characterValue);
  const owned=character.campaign.economy.magicItems.find(entry=>entry.id===input.ownedItemId&&!entry.consumed);
  if(!owned) throw new RangeError('착용할 마법 물품을 찾을 수 없습니다.');
  const item=catalogById(MAGIC_ITEM_CATALOG,owned.magicItemId);
  const beforeEffects=getMagicCombatEffects(character);
  if(input.equipped && ['weapon','armor'].includes(item.kind)) character.campaign.economy.magicItems.forEach(entry=>{const profile=catalogById(MAGIC_ITEM_CATALOG,entry.magicItemId);if(entry.id!==owned.id&&profile?.kind===item.kind) entry.equipped=false;});
  owned.equipped=Boolean(input.equipped);
  if(input.religiousTrait) owned.religiousTrait=String(input.religiousTrait);
  if(['steel','fire','drowning'].includes(input.protectionChoice)) owned.protectionChoice=input.protectionChoice;
  const afterEffects=getMagicCombatEffects(character);
  const hpDelta=afterEffects.hpBonus-beforeEffects.hpBonus;
  character.attributes.hpBonus=afterEffects.hpBonus;
  character.attributes.currentHp=Math.max(1,asInt(character.attributes.currentHp)+hpDelta);
  character.attributes.ignoreHealthPenalties=afterEffects.ignoreHealthPenalties?1:0;
  character.attributes.ignoreMajorWoundEffects=afterEffects.ignoreMajorWoundEffects?1:0;
  character.attributes.poisonImmune=afterEffects.poisonImmune?1:0;
  character.attributes.fireImmune=afterEffects.fireImmune?1:0;
  character.attributes.magicFireArmor=afterEffects.fireArmor;
  character.attributes.magicHalfDamageSources=afterEffects.halfDamageSources;
  character.attributes.magicValorousBonus=afterEffects.valorousBonus;
  return {character,item:owned,effects:afterEffects,economy:character.campaign.economy};
};

const equipmentSlot = item => item.category === 'armor' && item.combat?.shield ? 'shield' : item.category;

export const equipMarketEquipment = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const owned = character.campaign.economy.equipment.find(entry => entry.id === input.inventoryId && !entry.disposed && asInt(entry.quantity, 1) > 0);
  if (!owned) throw new RangeError('장착할 장비를 찾을 수 없습니다.');
  const item = catalogById(MARKET_CATALOG, owned.marketItemId);
  if (!item?.combat) throw new RangeError('전투 장비로 사용할 수 없는 품목입니다.');
  const slot = equipmentSlot(item);
  if (input.equipped) character.campaign.economy.equipment.forEach(entry => {
    const profile = catalogById(MARKET_CATALOG, entry.marketItemId);
    if (entry.id !== owned.id && profile && equipmentSlot(profile) === slot) entry.equipped = false;
  });
  owned.equipped = Boolean(input.equipped);
  owned.slot = slot;
  return { character, item: owned, loadout: getEquippedMarketCombat(character), economy: character.campaign.economy };
};

export const getEquippedMarketCombat = character => {
  const equipped = list(character.campaign?.economy?.equipment).filter(entry => entry.equipped && !entry.disposed);
  const result = { itemIds: [], weaponId: null, weaponSkillBonus: 0, weaponBreakOnTie: false, weaponUnbreakable: false, missileWeaponId: null, armor: null, armorType: null, armorDexModifier: null, shield: null, mount: null, horseArmor: null };
  equipped.forEach(entry => {
    const item = catalogById(MARKET_CATALOG, entry.marketItemId);
    if (!item?.combat) return;
    result.itemIds.push(item.id);
    const combat = {...item.combat,...(entry.customCombat || {})};
    if (combat.weaponId) result.weaponId = combat.weaponId;
    if (item.category === 'melee') {
      result.weaponSkillBonus = asInt(combat.skill);
      result.weaponBreakOnTie = Boolean(combat.breakOnTie);
      result.weaponUnbreakable = Boolean(combat.unbreakable);
    }
    if (item.combat.missileWeaponId) result.missileWeaponId = item.combat.missileWeaponId;
    if (item.category === 'armor' && item.combat.armor !== undefined) {
      result.armor = item.combat.armor;
      result.armorType = item.combat.armorType;
    }
    if (item.combat.dex !== undefined && (item.combat.armor !== undefined || item.combat.shield !== undefined)) result.armorDexModifier = (result.armorDexModifier ?? 0) + asInt(item.combat.dex);
    if (item.combat.shield !== undefined) result.shield = item.combat.shield;
    if (item.category === 'mount') result.mount = item;
    if (item.category === 'horseArmor') result.horseArmor = item;
  });
  return result;
};

export const getRetainerSkill = (character, profileId, skillName) => {
  const retainer = list(character.campaign?.economy?.retainers).find(entry => entry.status === 'active' && entry.profileId === profileId);
  if (!retainer) return null;
  const match = Object.entries(retainer.skills || {}).find(([key]) => key.toLowerCase().includes(String(skillName).toLowerCase()));
  return match && Number.isFinite(Number(match[1])) ? Number(match[1]) : null;
};

export const recordMajorInvestment = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const amount = money(input.amountDeniers);
  if (!amount || !input.description) throw new RangeError('투자 금액과 대상을 기록해야 합니다.');
  changeCoin(character, -amount, { id:input.transactionId,type:'major_investment',label:String(input.description),sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198',createdAt:input.now });
  const investment = { id:safeId(input.id || `investment:${Date.now()}`),description:String(input.description),amountDeniers:amount,year:character.personal?.campaignYear,status:'completed',returnRule:'none_in_chapter_12',note:String(input.note || '') };
  character.campaign.economy.investments.push(investment);
  return { character, investment, economy:character.campaign.economy };
};

export const collectUniversalAid = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const aid = catalogById(UNIVERSAL_AIDS, input.aidId);
  if (!aid) throw new RangeError('네 가지 보편적 원조 중 하나를 선택해야 합니다.');
  if (character.campaign.economy.aidsUsed[aid.id]) throw new RangeError('이 보편적 원조는 이미 한 번 징수했습니다.');
  const incomes = Array.isArray(input.vassalAnnualIncomesDeniers) ? input.vassalAnnualIncomesDeniers.map(money) : [];
  if (!incomes.length) throw new RangeError('각 봉신 영지의 평년 수입을 입력해야 합니다.');
  const amount = incomes.reduce((sum, value) => sum + value, 0);
  changeCoin(character, amount, { id:input.transactionId,type:'universal_aid',label:aid.label,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 pp.196-197',createdAt:input.now });
  character.campaign.economy.aidsUsed[aid.id] = { year:character.personal?.campaignYear,amountDeniers:amount,vassalAnnualIncomesDeniers:incomes };
  return { character, aid, amountDeniers:amount, economy:character.campaign.economy };
};

export const collectTallage = (characterValue, input = {}) => {
  if (!input.gmDecision || !input.note) throw new RangeError('Tallage는 궁정과 시민의 결정 및 그 근거를 기록해야 합니다.');
  const amount = money(input.amountDeniers);
  return recordEconomyTransfer(characterValue, { id:input.transactionId,type:'tallage',amountDeniers:amount,label:'동의된 특별세',note:input.note,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.197',createdAt:input.now });
};

export const collectImpost = (characterValue, input = {}) => {
  let character = ensureEconomy(characterValue);
  const amount = money(input.amountDeniers);
  character = recordEconomyTransfer(character, { id:input.transactionId,type:'impost',amountDeniers:amount,label:'강제 부과금',note:input.note,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.197',createdAt:input.now }).character;
  recordStandingChange(character,{id:`impost-standing:${character.personal?.campaignYear}:${character.campaign.economy.transactions.length}`,year:character.personal?.campaignYear,standingKey:'commoners',amount:-2,title:'강제 부과금',narrative:'평민에게 강제 부과금을 징수했습니다.',sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.197'});
  return { character, economy:character.campaign.economy };
};

export const purchaseMilitaryAsset = (characterValue, input = {}) => {
  const character = ensureEconomy(characterValue);
  const asset = catalogById(MILITARY_PURCHASES, input.assetId);
  if (!asset) throw new RangeError('용병·공성 장비 표에서 항목을 찾을 수 없습니다.');
  if (!input.lordApproval) throw new RangeError('사전 Standing [lord] 성공 승인이 필요합니다.');
  const quantity = Math.max(1,asInt(input.quantity,1));
  const cost = asset.costDeniers * quantity;
  changeCoin(character,-cost,{id:input.transactionId,type:'military_purchase',label:asset.label,relatedId:asset.id,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.204',createdAt:input.now});
  character.campaign.economy.equipment.push({id:safeId(`military:${asset.id}:${Date.now()}`),marketItemId:asset.id,label:asset.label,category:asset.type,quantity,unitValueDeniers:asset.costDeniers,acquiredYear:character.personal?.campaignYear,source:'chapter_12_military',equipped:false});
  return {character,asset,costDeniers:cost,economy:character.campaign.economy};
};

export const recordMagicItemUse = (characterValue, input = {}) => {
  const character=ensureEconomy(characterValue);
  const owned=character.campaign.economy.magicItems.find(entry=>entry.id===input.ownedItemId&&!entry.consumed);
  if(!owned) throw new RangeError('사용할 마법 물품을 찾을 수 없습니다.');
  const item=catalogById(MAGIC_ITEM_CATALOG,owned.magicItemId);
  owned.used=true; owned.useCount=asInt(owned.useCount)+1; owned.lastUsedYear=character.personal?.campaignYear; owned.lastOutcome=String(input.outcome||'');
  if(input.consume && (item.effects.singleUse || item.effects.consumable)) owned.consumed=true;
  appendTransaction(character,{id:input.transactionId,type:'magic_item_use',amountDeniers:0,label:`${item.label} 사용`,relatedId:owned.id,note:input.outcome,sourceRuleId:'ITEM-MAGIC-001',sourcePage:item.sourcePage,createdAt:input.now});
  return {character,item:owned,economy:character.campaign.economy};
};

export const applyAnnualEconomy = (characterValue, year, options = {}) => {
  const character=ensureEconomy(characterValue);
  const economy=character.campaign.economy;
  if(economy.lastWinterYear===year) return {character,economy,applied:false,interestDeniers:0,feesDeniers:0,retainerDeniers:0};
  let interestDeniers=0,feesDeniers=0;
  economy.loans.filter(entry=>entry.status==='active'&&asInt(entry.lastInterestYear)<year).forEach(loan=>{const charge=Math.round(loan.balanceDeniers*asNumber(loan.annualRate));loan.balanceDeniers+=charge;loan.lastInterestYear=year;interestDeniers+=charge;appendTransaction(character,{id:`loan-interest:${loan.id}:${year}`,year,type:'loan_interest',amountDeniers:0,label:`${loan.lender} 대출 이자 ${formatCoin(charge)}`,relatedId:loan.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198'});});
  economy.deposits.filter(entry=>entry.status==='active'&&asInt(entry.lastFeeYear)<year).forEach(deposit=>{const fee=Math.round(deposit.balanceDeniers*asNumber(deposit.annualFeeRate));deposit.balanceDeniers=Math.max(0,deposit.balanceDeniers-fee);deposit.lastFeeYear=year;feesDeniers+=fee;appendTransaction(character,{id:`deposit-fee:${deposit.id}:${year}`,year,type:'deposit_fee',amountDeniers:0,label:`${deposit.institution} 예금 수수료 ${formatCoin(fee)}`,relatedId:deposit.id,sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.198'});});
  const activeRetainers=economy.retainers.filter(entry=>entry.status==='active');
  const rng=options.rng || Math.random;
  const retainerChecks=[];
  let horseSurvivalBonus=0;
  activeRetainers.forEach(retainer=>{
    recordGloryAward(character,{id:`retainer-glory:${retainer.id}:${year}`,year,amount:toLivres(retainer.annualCostDeniers),title:`수행원 · ${retainer.name}`,narrative:`${retainer.label} 수행원을 유지했습니다.`,sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 p.204'});
    retainer.age=asInt(retainer.age)+1;
    if(retainer.profileId==='squire'){
      const departureRoll=options.retainerRolls?.[retainer.id]?.departure || rollDie(6,rng);
      retainerChecks.push({retainerId:retainer.id,type:'departure',roll:departureRoll});
      if(departureRoll===1){retainer.status='departed';retainer.departedYear=year;return;}
    }
    const eligible=retainer.profileId!=='magician'||retainer.fundMagicResearch;
    if(!eligible)return;
    Object.entries(retainer.skills||{}).forEach(([skill,value])=>{
      if(!Number.isFinite(Number(value)))return;
      const roll=options.retainerRolls?.[retainer.id]?.[skill]||rollDie(20,rng);
      const check=resolveD20Roll(roll,asInt(value));
      const before=asInt(value);
      if(!check.success)retainer.skills[skill]=before+1;
      retainerChecks.push({retainerId:retainer.id,skill,roll,outcome:check.outcome,before,after:asInt(retainer.skills[skill])});
      if(retainer.profileId==='horse_groom'&&skill.toLowerCase().includes('horsemanship')&&check.success)horseSurvivalBonus=1;
    });
  });
  economy.annualRetainerEffects[year]={retainerChecks,horseSurvivalBonus};
  const retainerDeniers=activeRetainers.filter(entry=>entry.status==='active').reduce((sum,entry)=>sum+money(entry.annualCostDeniers)+(entry.profileId==='magician'&&entry.fundMagicResearch?money(entry.skills?.Magic)*DENIERS_PER_LIVRE:0),0);
  if(retainerDeniers){
    if(economy.coinDeniers<retainerDeniers&&!options.allowRetainerDebt) throw new RangeError(`수행원 연봉 ${formatCoin(retainerDeniers)}을 지급하려면 재산 정리가 필요합니다.`);
    changeCoin(character,-retainerDeniers,{id:`retainer-pay:${year}`,year,type:'retainer_pay',label:'전문 수행원 연간 급료',sourceRuleId:'WEALTH-MARKET-001',sourcePage:'Ch.12 pp.204-205'});
  }
  economy.lastWinterYear=year;
  return {character,economy,applied:true,interestDeniers,feesDeniers,retainerDeniers,retainerChecks,horseSurvivalBonus};
};

export const applyLordRansomFailure = (characterValue, claimId, retinueCount = 1) => {
  const character=ensureEconomy(characterValue);
  character.passions.honor=Math.max(0,asInt(character.passions?.honor)-Math.max(1,asInt(retinueCount,1)));
  recordStandingChange(character,{id:`ransom-abandoned:${claimId}`,year:character.personal?.campaignYear,standingKey:'retinue',amount:-Math.max(1,asInt(retinueCount,1)),title:'몸값 의무 불이행',narrative:'붙잡힌 가신 기사의 몸값을 치르지 않았습니다.',sourceRuleId:'WEALTH-INCOME-001',sourcePage:'Ch.12 p.196'});
  return {character,economy:character.campaign.economy};
};
