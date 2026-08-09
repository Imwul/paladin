import assert from 'node:assert/strict';
import {
  addEstate,
  addMagicItem,
  applyAnnualEconomy,
  buyBuilding,
  buyMarketItem,
  dismissRetainer,
  equipMagicItem,
  equipMarketEquipment,
  finalizeMassBattle,
  getEquippedMarketCombat,
  getMagicCombatEffects,
  getMagicScoreModifiers,
  getMarketAvailability,
  hireRetainer,
  makeDeposit,
  payToFreeEnslavedPerson,
  performRetainerTask,
  repayLoan,
  resolveFoodPriceCheck,
  resolveSpyExposure,
  resolveWinterStep,
  sellMarketItem,
  settleRansom,
  startMassBattle,
  takeLoan,
  toDeniers,
  trainMountForAttack
} from '../src/rules/index.js';
import { sanitizeCampaignState } from '../src/utils/campaignState.js';

const traitPairs = [
  ['chaste','lustful'],['energetic','lazy'],['forgiving','vengeful'],['generous','selfish'],['honest','deceitful'],['just','arbitrary'],
  ['merciful','cruel'],['modest','proud'],['prudent','reckless'],['temperate','indulgent'],['trusting','suspicious'],['valorous','cowardly']
];
const makeCharacter = () => ({
  personal:{name:'경제 시험 기사',age:25,campaignYear:780,maintenance:'ordinary',personalClass:'봉신 기사',features:[]},
  attributes:{siz:14,dex:14,str:14,con:14,app:10,currentHp:28},
  traits:Object.fromEntries(traitPairs.flatMap(([left,right])=>[[left,left==='just'?16:10],[right,left==='just'?4:10]])),traitsChecked:{},
  passions:{honor:16,loveFamily:16,loveGod:15,loveCharlemagne:15},passionsChecked:{},
  standings:{liegeLord:16,family:16,church:10,retinue:12,commoners:12,charlemagne:10},standingsChecked:{},
  skills:{stewardship:15,trade:12,sword:16,lance:15,bow:12,horsemanship:14,battle:14,siege:12,firstAid:10},skillsChecked:{},
  squire:{name:'종자',age:16,status:'생존'},horses:{warhorse:{type:'Charger',hp:46,armor:5,status:'건강'}},
  gear:{cash:100,gloryThisGame:0,gloryTotal:1000,homePossessions:'장원'},
  family:{name:'시험 가문',manors:1,members:[{id:'self',name:'경제 시험 기사',relation:'본인',generation:3,status:'생존'}]},journal:{},
  campaign:{schemaVersion:9,saveRevision:0,appliedEvents:{},chronicleEvents:[],familyTimeline:[],gloryLedger:[],standingLedger:[],captives:[],pendingEconomy:[],conditions:[],fortresses:[],lifecycle:{status:'active',careerStatus:'active',activeCharacterId:'self',primaryCharacterId:'self',events:[],unresolvedChoices:[]},health:{wounds:[],weeklyCare:[]},winter:null}
});
const fixed = value => () => value;

// Schema v10 migration preserves cash, estates, and Chapter 8 pending claims exactly once.
const legacy = makeCharacter();
legacy.campaign.pendingEconomy = [{id:'legacy-ransom',type:'ransom',status:'pending_chapter_12',year:779}];
const migrated = sanitizeCampaignState(legacy,makeCharacter());
assert.equal(migrated.campaign.schemaVersion,10);
assert.equal(migrated.campaign.economy.coinDeniers,toDeniers(100));
assert.equal(migrated.campaign.economy.estates.length,1);
assert.equal(migrated.campaign.economy.ransoms.length,1);
assert.deepEqual(migrated.campaign.pendingEconomy,[]);
const reloadedMigration = sanitizeCampaignState(JSON.parse(JSON.stringify(migrated)),makeCharacter());
assert.equal(reloadedMigration.campaign.economy.ransoms.length,1);

// Food scarcity, liberation-only payment, and Phase 4 horse training use printed costs.
let conditions = sanitizeCampaignState(makeCharacter(),makeCharacter());
conditions = resolveFoodPriceCheck(conditions,{roll:1}).character;
conditions = buyMarketItem(conditions,{itemId:'rations'}).character;
assert.equal(conditions.campaign.economy.coinDeniers,toDeniers(100)-8);
conditions = payToFreeEnslavedPerson(conditions,{amountDeniers:120,note:'해방'}).character;
assert.equal(conditions.campaign.economy.transactions.at(-1).type,'emancipation_payment');
conditions.personal.campaignYear=801;
conditions = buyMarketItem(conditions,{itemId:'rouncy'}).character;
const trainedMount = conditions.campaign.economy.equipment.find(item=>item.marketItemId==='rouncy');
conditions = trainMountForAttack(conditions,{inventoryId:trainedMount.id}).character;
assert.equal(trainedMount.unitValueDeniers,toDeniers(1));
assert.equal(conditions.campaign.economy.equipment.find(item=>item.id===trainedMount.id).unitValueDeniers,toDeniers(2));

// Market phase gating, exact buy price, half-price sale, and equipped Chapter 7 loadout.
assert.equal(getMarketAvailability('full_plate',780).available,false);
let market = migrated;
market = buyMarketItem(market,{itemId:'chain_mail',quantity:1,now:'2026-08-09T01:00:00.000Z'}).character;
assert.equal(market.campaign.economy.coinDeniers,toDeniers(98));
const armorInventory = market.campaign.economy.equipment.find(item=>item.marketItemId==='chain_mail');
market = equipMarketEquipment(market,{inventoryId:armorInventory.id,equipped:true}).character;
assert.equal(getEquippedMarketCombat(market).armor,10);
market = sellMarketItem(market,{inventoryId:armorInventory.id,collection:'equipment',quantity:1,now:'2026-08-09T01:01:00.000Z'}).character;
assert.equal(market.campaign.economy.coinDeniers,toDeniers(99));

// Ransom Table 12-1 settles through the canonical ledger.
market.campaign.economy.ransoms.push({id:'battle-ransom',direction:'receivable',status:'pending',year:780});
market = settleRansom(market,{claimId:'battle-ransom',ransomStatus:'knight_vassal',now:'2026-08-09T01:02:00.000Z'}).character;
assert.equal(market.campaign.economy.coinDeniers,toDeniers(117));
assert.equal(market.campaign.economy.ransoms.find(item=>item.id==='battle-ransom').status,'settled');

// Estates and defensive works use exact costs, phases, and lord approval.
market = addEstate(market,{id:'estate:gift',name:'선물 받은 장원',gmApproved:true,note:'주군의 수여'}).character;
assert.equal(market.campaign.economy.estates.length,2);
assert.throws(()=>buyBuilding(market,{buildingId:'curtain_wall'}),/Standing/);
market = buyBuilding(market,{buildingId:'curtain_wall',lordApproval:true,now:'2026-08-09T01:03:00.000Z'}).character;
assert.equal(market.campaign.fortresses.at(-1).dv,'7');

// Loans, deposits, annual interest, fees, retainers, and repayment survive Winter processing.
let finance = sanitizeCampaignState(makeCharacter(),makeCharacter());
finance.passions.honor = 15;
finance = takeLoan(finance,{id:'loan:test',status:'knight_vassal',amountDeniers:toDeniers(10),lender:'메츠 상인',purpose:'예배당',goodOrChristianPurpose:true,now:'2026-08-09T02:00:00.000Z'}).character;
assert.equal(finance.campaign.economy.loans[0].annualRate,0.2);
finance = makeDeposit(finance,{id:'deposit:test',amountDeniers:toDeniers(10),institution:'생드니 수도원',personallyKnownToAbbot:true,feeRate:0.05,now:'2026-08-09T02:01:00.000Z'}).character;
finance = hireRetainer(finance,{id:'retainer:test',retainerId:'steward',name:'아델라르'},fixed(0.5)).character;
const annual = applyAnnualEconomy(finance,781,{rng:fixed(0.95)});
finance = annual.character;
assert.equal(finance.campaign.economy.loans[0].balanceDeniers,toDeniers(12));
assert.equal(finance.campaign.economy.deposits[0].balanceDeniers,toDeniers(9.5));
assert.equal(annual.retainerDeniers,toDeniers(1));
assert.equal(finance.gear.gloryThisGame,1);
const beforeDismissalCoin = finance.campaign.economy.coinDeniers;
finance = dismissRetainer(finance,{retainerId:'retainer:test',loseHonor:true}).character;
assert.equal(finance.campaign.economy.coinDeniers,beforeDismissalCoin);
assert.equal(finance.passions.honor,14);
finance = repayLoan(finance,{loanId:'loan:test',amountDeniers:toDeniers(12)}).character;
assert.equal(finance.campaign.economy.loans[0].status,'repaid');

// Specialist limits and effects remain executable rather than descriptive.
finance = hireRetainer(finance,{id:'retainer:smith',retainerId:'master_smith',name:'장인'},fixed(0.5)).character;
finance = performRetainerTask(finance,{retainerId:'retainer:smith',skill:'Industry (forging)',roll:14,note:'연간 검 제작'}).character;
const forged = finance.campaign.economy.equipment.find(item=>item.source==='master_smith');
finance = equipMarketEquipment(finance,{inventoryId:forged.id,equipped:true}).character;
assert.equal(getEquippedMarketCombat(finance).weaponSkillBonus,1);
assert.equal(getEquippedMarketCombat(finance).weaponUnbreakable,true);
assert.throws(()=>performRetainerTask(finance,{retainerId:'retainer:smith',roll:14,note:'두 번째 제작'}),/한 해/);
finance = hireRetainer(finance,{id:'retainer:spy',retainerId:'spy',name:'첩자'},fixed(0.5)).character;
finance = performRetainerTask(finance,{retainerId:'retainer:spy',skill:'Intrigue',roll:20,note:'성채 병력 조사'}).character;
assert.equal(finance.campaign.economy.retainers.find(item=>item.id==='retainer:spy').status,'caught_pending_standing');
finance = resolveSpyExposure(finance,{retainerId:'retainer:spy',standingTarget:10,roll:20,standingLabel:'해당 궁정'}).character;
assert.equal(finance.campaign.economy.retainers.find(item=>item.id==='retainer:spy').status,'turned_coat');
finance = hireRetainer(finance,{id:'retainer:herald',retainerId:'herald',name:'전령관'},fixed(0.5)).character;
finance = performRetainerTask(finance,{retainerId:'retainer:herald',skill:'Eloquence',roll:10,gloryAmount:20,note:'결투의 승리'}).character;
assert.equal(finance.campaign.gloryLedger.some(item=>item.id==='herald-glory:retainer:herald:780'&&item.amount===20),true);

// Magic items cannot be bought, preserve state, and expose exact combat bonuses.
finance.passions.honor = 16;
assert.throws(()=>addMagicItem(finance,{magicItemId:'durendal',acquisition:'market'}),/시장/);
finance = addMagicItem(finance,{id:'magic:durendal',magicItemId:'durendal',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:durendal',equipped:true}).character;
assert.equal(getMagicCombatEffects(finance).skillBonus,6);
assert.equal(getMagicCombatEffects(finance).damageBonus,6);
finance = addMagicItem(finance,{id:'magic:ring',magicItemId:'ring_protection',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:ring',equipped:true,protectionChoice:'steel'}).character;
assert.deepEqual(getMagicCombatEffects(finance).halfDamageSources,['steel']);
finance.traits.chaste=18;
finance = addMagicItem(finance,{id:'magic:amulet',magicItemId:'holy_relic_amulet',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:amulet',equipped:true,religiousTrait:'chaste'}).character;
assert.equal(getMagicCombatEffects(finance).hpBonus,3);
finance = addMagicItem(finance,{id:'magic:talisman',magicItemId:'charlemagnes_talisman',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:talisman',equipped:true}).character;
assert.equal(getMagicScoreModifiers(finance).traits.forgiving,1);
assert.equal(getMagicScoreModifiers(finance).traits.energetic,undefined);
finance = addMagicItem(finance,{id:'magic:spurs',magicItemId:'st_george_belt_spurs',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:spurs',equipped:true}).character;
assert.equal(getMagicCombatEffects(finance).horsemanshipBonus,3);
assert.equal(finance.attributes.magicValorousBonus,3);
finance = addMagicItem(finance,{id:'magic:scepter',magicItemId:'charlemagnes_scepter',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:scepter',equipped:true}).character;
finance = addMagicItem(finance,{id:'magic:nimrod',magicItemId:'nimrods_armor',acquisition:'adventure'}).character;
finance = equipMagicItem(finance,{ownedItemId:'magic:nimrod',equipped:true}).character;
assert.equal(getMagicScoreModifiers(finance).standings.all,-2);
assert.equal(getMagicCombatEffects(finance).armorOverride,20);

// Chapter 8 loot and ransom flow into Economy, then Winter and reload do not duplicate them.
let campaign = sanitizeCampaignState(makeCharacter(),makeCharacter());
campaign = addMagicItem(campaign,{id:'magic:banner',magicItemId:'frisian_banner',acquisition:'adventure'}).character;
campaign = equipMagicItem(campaign,{ownedItemId:'magic:banner',equipped:true}).character;
campaign = startMassBattle(campaign,{id:'battle:economy',name:'경제 통합 전투',scale:'small',duration:1,playerArmySize:100,enemyArmySize:100,playerArmyBattle:15,battalionBattle:15,followerRefs:[]},'2026-08-09T03:00:00.000Z').character;
assert.equal(campaign.campaign.massBattle.sides.player.battalionBattle,18);
campaign.campaign.massBattle.phase='aftermath';
campaign.campaign.massBattle.captives=[{id:'captive:test',status:'held',ransomEligible:true}];
campaign.campaign.massBattle.aftermath={applied:false,glory:{total:0},loot:4,ransomClaims:[{id:'claim:test',captiveId:'captive:test'}],result:{result:'decisive_victory'}};
campaign = finalizeMassBattle(campaign,'2026-08-09T03:01:00.000Z').character;
assert.equal(campaign.campaign.economy.coinDeniers,toDeniers(104));
assert.equal(campaign.campaign.economy.ransoms.some(item=>item.id==='claim:test'),true);
campaign = resolveWinterStep(campaign,{stepId:'soloScenario',input:{choice:'not_applicable'}},fixed(0.5)).character;
campaign = resolveWinterStep(campaign,{stepId:'aging',input:{}},fixed(0.99)).character;
campaign = resolveWinterStep(campaign,{stepId:'economy',input:{harvestRoll:5,maintenanceGrade:'ordinary'}},fixed(0.5)).character;
const saved = JSON.parse(JSON.stringify(campaign));
const restored = sanitizeCampaignState(saved,makeCharacter());
assert.equal(restored.campaign.economy.coinDeniers,campaign.campaign.economy.coinDeniers);
assert.equal(restored.campaign.economy.transactions.filter(item=>item.id==='battle:economy:loot').length,1);
assert.equal(restored.campaign.economy.ransoms.filter(item=>item.id==='claim:test').length,1);

// Ogier's Ring suppresses the natural aging roll while age still advances.
let ageless = sanitizeCampaignState(makeCharacter(),makeCharacter());
ageless.personal.age = 40;
ageless = addMagicItem(ageless,{id:'magic:ogier',magicItemId:'ogiers_ring',acquisition:'adventure'}).character;
ageless = equipMagicItem(ageless,{ownedItemId:'magic:ogier',equipped:true}).character;
ageless = resolveWinterStep(ageless,{stepId:'soloScenario',input:{choice:'not_applicable'}},fixed(0.5)).character;
const aging = resolveWinterStep(ageless,{stepId:'aging',input:{agingRoll:20,attributeRolls:[1,2,3,4,5]}},fixed(0.5));
assert.equal(aging.record.result.agingRollRequired,false);
assert.equal(aging.character.personal.age,41);

console.log('Chapter 12 economy regression passed.');
