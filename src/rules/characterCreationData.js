export const CHARACTER_CREATION_STEPS = [
  { id: 'mode', title: 'Campaign and Character Mode', shortTitle: 'Mode', ruleIds: ['CHAR-PERSONAL-001', 'CHAR-NAME-001', 'CHAR-FEMALE-001'], pages: '26-27, 41-42' },
  { id: 'family', title: 'Family Setup', shortTitle: 'Family', ruleIds: ['CHAR-FAMILY-001', 'CHAR-DIRECTED-001'], pages: '27-30' },
  { id: 'familyCharacteristic', title: 'Family Characteristic', shortTitle: 'Characteristic', ruleIds: ['CHAR-FAMCHAR-M-001', 'CHAR-FAMCHAR-F-001'], pages: '28, Tables 1-1 and 1-2' },
  { id: 'saint', title: 'Patron Saint', shortTitle: 'Saint', ruleIds: ['CHAR-SAINT-001'], pages: '28-29, Table 1-3' },
  { id: 'father', title: 'Family Muster and Father', shortTitle: 'Father', ruleIds: ['CHAR-MUSTER-001', 'CHAR-FATHER-001', 'CHAR-FATHER-SURV-001'], pages: '29-31, Tables 1-4 to 1-6' },
  { id: 'sonNumber', title: 'Son Number', shortTitle: 'Son Number', ruleIds: ['CHAR-SON-001', 'CHAR-FEMALE-001'], pages: '27, 31' },
  { id: 'pageEducation', title: 'Page Education', shortTitle: 'Page', ruleIds: ['CHAR-PAGE-001'], pages: '31-32, Table 1-7' },
  { id: 'cultureHomeland', title: 'Culture and Homeland', shortTitle: 'Origin', ruleIds: ['CHAR-CULTURE-001', 'CHAR-HOMELAND-001'], pages: '32' },
  { id: 'attributes', title: 'Attributes', shortTitle: 'Attributes', ruleIds: ['CHAR-ATTR-001', 'CHAR-DERIVED-001'], pages: '32-33, Table 1-8' },
  { id: 'feature', title: 'Distinctive Feature', shortTitle: 'Feature', ruleIds: ['CHAR-FEATURE-001'], pages: '33, Table 1-9' },
  { id: 'traits', title: 'Traits', shortTitle: 'Traits', ruleIds: ['CHAR-TRAIT-001'], pages: '33-34' },
  { id: 'passions', title: 'Passions', shortTitle: 'Passions', ruleIds: ['CHAR-PASSION-001'], pages: '34, Table 1-10' },
  { id: 'standings', title: 'Standings', shortTitle: 'Standings', ruleIds: ['CHAR-STANDING-001'], pages: '34, Table 1-11' },
  { id: 'skills', title: 'Skills', shortTitle: 'Skills', ruleIds: ['CHAR-SKILL-M-001', 'CHAR-SKILL-F-001', 'CHAR-SKILL-ORDER-001'], pages: '34-35, Tables 1-12 and 1-13' },
  { id: 'squireYears', title: 'Squire Years and Qualification', shortTitle: 'Knighthood', ruleIds: ['CHAR-KNIGHT-QUAL-001'], pages: '35' },
  { id: 'ideals', title: 'Ideals', shortTitle: 'Ideals', ruleIds: ['CHAR-IDEAL-001'], pages: '35-36' },
  { id: 'glory', title: 'Initial Glory', shortTitle: 'Glory', ruleIds: ['CHAR-GLORY-001'], pages: '36' },
  { id: 'outfit', title: 'Starting Outfit', shortTitle: 'Outfit', ruleIds: ['CHAR-OUTFIT-001'], pages: '39-40, Table 1-14' },
  { id: 'birthGift', title: 'Frankish Birth Gift', shortTitle: 'Birth Gift', ruleIds: ['CHAR-GIFT-001'], pages: '40, Table 1-15' },
  { id: 'review', title: 'Story and Review', shortTitle: 'Review', ruleIds: ['CHAR-STORY-001'], pages: '41' }
];

export const FAMILY_CHARACTERISTICS_MALE = [
  { range: [1, 2], key: 'keenSenses', label: 'Keen of eye and ear', effects: { skills: { awareness: 5 } } },
  { range: [3, 3], key: 'woundHealers', label: 'Natural healers of wounds', effects: { skills: { firstAid: 5 } } },
  { range: [4, 4], key: 'shieldMemory', label: 'Never forget a face or a shield', effects: { skills: { heraldry: 5, recognize: 5 } } },
  { range: [5, 6], key: 'bornInSaddle', label: 'Born in the saddle', effects: { skills: { horsemanship: 5 } } },
  { range: [7, 8], key: 'atHomeInNature', label: 'At home in nature', effects: { skills: { hunting: 5 } } },
  { range: [9, 10], key: 'riverOtters', label: 'Like otters in the river', effects: { skills: { swimming: 10 } } },
  { range: [11, 11], key: 'polite', label: 'Polite, elegant, lovable', effects: { skills: { courtesy: 10 } } },
  { range: [12, 12], key: 'lightFooted', label: 'Light-footed and elegant', effects: { skills: { dancing: 10 } } },
  { range: [13, 13], key: 'storytellers', label: 'Good speakers and storyteller', effects: { skills: { eloquence: 10 } } },
  { range: [14, 14], key: 'birdMasters', label: 'Masters of birds', effects: { skills: { falconry: 10 } } },
  { range: [15, 15], key: 'games', label: 'Clever at games', effects: { skills: { gaming: 10 } } },
  { range: [16, 16], key: 'deductive', label: 'Surprisingly deductive', effects: { skills: { intrigue: 10 } } },
  { range: [17, 17], key: 'musicians', label: 'Gifted musicians', effects: { skills: { playInstruments: 10 } } },
  { range: [18, 18], key: 'voice', label: 'Excellent voice', effects: { skills: { singing: 10 } } },
  { range: [19, 19], key: 'tacticians', label: 'Master tacticians', choice: 'battleOrSiege' },
  { range: [20, 20], key: 'playerChoice', label: "Player's choice", choice: 'familyCharacteristic' }
];

export const FAMILY_CHARACTERISTICS_FEMALE = [
  { range: [1, 4], key: 'beauty', label: 'Great beauty', effects: { attributes: { app: 5 } } },
  { range: [5, 5], key: 'nimbleFingers', label: 'Nimble fingers', effects: { skills: { industry: 10 } } },
  { range: [6, 10], key: 'naturalHealers', label: 'Natural healers', effects: { skills: { firstAid: 5, chirurgery: 5 } } },
  { range: [11, 15], key: 'animals', label: 'Good with animals', effects: { skills: { falconry: 5, horsemanship: 5 } } },
  { range: [16, 17], key: 'beautifulVoice', label: 'Beautiful voice', effects: { skills: { eloquence: 5, singing: 5 } } },
  { range: [18, 19], key: 'caretakers', label: 'Caretakers', effects: { skills: { stewardship: 10 } } },
  { range: [20, 20], key: 'playerChoice', label: "Player's choice", choice: 'familyCharacteristic' }
];

export const PATRON_SAINTS = [
  { roll: 1, key: 'ambrose', label: 'St. Ambrose', patronage: 'Scribes', effects: { skills: { eloquence: 5 } } },
  { roll: 2, key: 'anastasia', label: 'St. Anastasia', patronage: 'Martyrs', effects: { traits: { chaste: 3 } } },
  { roll: 3, key: 'boniface', label: 'St. Boniface', patronage: 'Youth', effects: { traits: { merciful: 3 } } },
  { roll: 4, key: 'christopher', label: 'St. Christopher', patronage: 'Travelers', effects: { traits: { modest: 3 } } },
  { roll: 5, key: 'denis', label: 'St. Denis', patronage: 'Franks', effects: { passions: { loveCharlemagne: 2 } } },
  { roll: 6, key: 'eligius', label: 'St. Eligius', patronage: 'Healers', effects: { skills: { firstAid: 5 } } },
  { roll: 7, key: 'gabriel', label: 'St. Gabriel', patronage: 'Messengers', effects: { traits: { forgiving: 3 } } },
  { roll: 8, key: 'helena', label: 'St. Helena', patronage: 'Widows', effects: { passions: { loveFamily: 2 } } },
  { roll: 9, key: 'hilary', label: 'St. Hilary', patronage: 'Madmen', effects: { traits: { just: 3 } } },
  { roll: 10, key: 'hubert', label: 'St. Hubert', patronage: 'Hunters', effects: { skills: { hunting: 5 } } },
  { roll: 11, key: 'james', label: 'St. James', patronage: 'Laborers', effects: { traits: { energetic: 3 } } },
  { roll: 12, key: 'jerome', label: 'St. Jerome', patronage: 'Students', effects: { traits: { trusting: 3 } } },
  { roll: 13, key: 'johnBaptist', label: 'St. John the Baptist', patronage: 'Children', effects: { traits: { honest: 3 } } },
  { roll: 14, key: 'joseph', label: 'St. Joseph', patronage: 'Craftsmen', effects: { passions: { honor: 2 } } },
  { roll: 15, key: 'justin', label: 'St. Justin', patronage: 'Orators', effects: { traits: { prudent: 3 } } },
  { roll: 16, key: 'martin', label: 'St. Martin', patronage: 'Soldiers', effects: { traits: { temperate: 3 } } },
  { roll: 17, key: 'mary', label: 'St. Mary', patronage: 'Mothers', effects: { passions: { loveGod: 2 } } },
  { roll: 18, key: 'michael', label: 'St. Michael', patronage: 'Warriors', effects: { traits: { valorous: 3 } } },
  { roll: 19, key: 'omer', label: 'St. Omer', patronage: 'Sick and Poor', effects: { traits: { generous: 3 } } },
  { roll: 20, key: 'playerChoice', label: "Player's choice", patronage: '', choice: true }
];

export const FATHER_CLASSES = [
  { range: [1, 1], key: 'lordOfficer', label: 'Lord or Officer', subtable: true },
  { range: [2, 3], key: 'banneret', label: 'Banneret Knight', skillPoints: 16, glory: 300, giftRolls: 3, outfit: 3, pageModifier: 0 },
  { range: [4, 8], key: 'vassal', label: 'Vassal Knight', skillPoints: 14, glory: 250, giftRolls: 2, outfit: 3, pageModifier: 1 },
  { range: [9, 15], key: 'bachelor', label: 'Bachelor Knight', skillPoints: 12, glory: 200, giftRolls: 1, outfit: 2, pageModifier: 2 },
  {
    range: [16, 20], key: 'mercenary', label: 'Mercenary Knight', skillPoints: 10, glory: 100,
    giftRolls: 1, outfit: 2, pageModifier: 3,
    effects: { skills: { sword: 3 }, traits: { cruel: 3 } }, choice: 'mercenaryMelee'
  }
];

export const FATHER_SUBCLASSES = [
  {
    range: [1, 5], key: 'lord', label: 'Lord', detailChoice: ['Count', 'Duke', 'Lay Bishop', 'Lay Abbot'],
    skillPoints: 14, glory: 400, giftRolls: 3, outfit: 4, pageModifier: -1,
    effects: { skills: { courtesy: 2, heraldry: 2, intrigue: 2, battle: 2, sword: 2, spear: 2 }, traits: { modest: -2 } }
  },
  {
    range: [6, 8], key: 'steward', label: 'Steward or Seneschal', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { stewardship: 5, intrigue: 3 }, traits: { valorous: 1, energetic: 2 } }, officer: true
  },
  {
    range: [9, 10], key: 'butler', label: 'Butler', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { stewardship: 2, courtesy: 2 }, traits: { valorous: 1, generous: 1 } }, officer: true
  },
  {
    range: [11, 12], key: 'chamberlain', label: 'Chamberlain', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { languages: 2, readingWriting: 2, heraldry: 3 }, traits: { valorous: 1 } }, officer: true
  },
  {
    range: [13, 14], key: 'marshal', label: 'Marshal', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { siege: 5, heraldry: 3 }, traits: { valorous: 2 } }, officer: true
  },
  {
    range: [15, 16], key: 'castellan', label: 'Castellan', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { siege: 2, courtesy: 3, stewardship: 3 }, traits: { valorous: 1 } }, officer: true
  },
  {
    range: [17, 18], key: 'forester', label: 'Forester', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { hunting: 3, awareness: 2, falconry: 2, faerieLore: 1 }, traits: { valorous: 1 } }, officer: true
  },
  {
    range: [19, 20], key: 'bailiff', label: 'Bailiff', skillPoints: 10, glory: 300, giftRolls: 2, pageModifier: 0,
    effects: { skills: { horsemanship: 2 }, traits: { valorous: 1, just: 2, honest: 1 } }, officer: true
  }
];

export const PAGE_EDUCATIONS = [
  {
    range: [-Infinity, 3], key: 'royalCourt', label: 'Royal court', glory: 200,
    effects: { skills: { courtesy: 5, falconry: 3, hunting: 3, intrigue: 3 }, traits: { just: 3, modest: -3 } }
  },
  {
    range: [4, 6], key: 'greatNobleCourt', label: "Great noble's court", glory: 100,
    effects: { skills: { courtesy: 3, falconry: 2, hunting: 2, intrigue: 2, stewardship: 2 }, traits: { modest: -2, valorous: 2 } }
  },
  {
    range: [7, 9], key: 'greatMonastery', label: 'Great monastery', glory: 50,
    effects: { skills: { chirurgery: 2, eloquence: 2, faerieLore: 2, languages: 2, readingWriting: 3, religion: 2, singing: 2 }, passions: { loveGod: 1 } }
  },
  {
    range: [10, 15], key: 'banneretCourt', label: "Knight banneret's court", glory: 50,
    effects: { skills: { courtesy: 2, falconry: 1, folkLore: 2, gaming: 2, hunting: 1, bow: 2 }, traits: { valorous: 1 } }
  },
  {
    range: [16, 19], key: 'knightManor', label: "Knight's manor", glory: 20,
    effects: { skills: { folkLore: 2, gaming: 2, hunting: 1, dagger: 1, bow: 1 }, traits: { modest: 1, prudent: 1 } }
  },
  {
    range: [20, Infinity], key: 'smallMonastery', label: 'Small monastery', glory: 10,
    effects: { skills: { folkLore: 2, readingWriting: 2, religion: 1, singing: 1 }, traits: { chaste: 1, modest: 1 }, passions: { loveGod: 1 } }
  }
];

export const DISTINCTIVE_FEATURES = [
  { roll: 1, key: 'hair', label: 'Hair' },
  { roll: 2, key: 'torso', label: 'Torso' },
  { roll: 3, key: 'limbs', label: 'Limbs' },
  { roll: 4, key: 'speech', label: 'Speech' },
  { roll: 5, key: 'facialFeature', label: 'Facial Feature' },
  { roll: 6, key: 'facialExpression', label: 'Facial Expression' }
];

export const SKILL_CATEGORIES = {
  common: ['awareness', 'chirurgery', 'faerieLore', 'firstAid', 'folkLore', 'horsemanship', 'hunting', 'industry', 'recognize', 'religion', 'stewardship', 'swimming'],
  courtly: ['courtesy', 'dancing', 'eloquence', 'falconry', 'gaming', 'heraldry', 'intrigue', 'languages', 'playInstruments', 'readingWriting', 'romance', 'singing'],
  combat: ['battle', 'siege', 'bow', 'crossbow', 'lance', 'thrownWeapon', 'axe', 'bludgeon', 'dagger', 'spear', 'sword', 'unarmed']
};

export const MELEE_WEAPON_SKILLS = ['axe', 'bludgeon', 'dagger', 'spear', 'sword'];

export const FRANKISH_SKILL_FORMULAS = {
  male: {
    awareness: '1d6+3', chirurgery: 0, faerieLore: 1, firstAid: '2d6+3', folkLore: '1d6', horsemanship: '2d6+3',
    hunting: '2d6+3', industry: 0, recognize: '1d6', religion: '1d6', stewardship: '1d6', swimming: '2d6',
    courtesy: '1d6+3', dancing: '1d6', eloquence: '1d6', falconry: '1d6', gaming: '1d6', heraldry: '1d6',
    intrigue: '1d6', languages: 1, playInstruments: '1d6', readingWriting: 0, romance: '1d6', singing: '1d6',
    battle: '2d6+3', siege: '1d6+3', bow: 'halfDex', crossbow: 'halfDex', lance: '1d6+3', thrownWeapon: 'halfDex',
    axe: '2d6', bludgeon: '2d6', dagger: '2d6', spear: '2d6', sword: '2d6+3', unarmed: 'halfDex'
  },
  female: {
    awareness: '1d6+3', chirurgery: '2d6', faerieLore: '1d6', firstAid: '2d6+3', folkLore: '1d6', horsemanship: '1d6+3',
    hunting: '1d6', industry: '2d6', recognize: '2d6', religion: '1d6', stewardship: '2d6', swimming: '1d6',
    courtesy: '1d6+3', dancing: '2d6', eloquence: '1d6', falconry: '1d6', gaming: '1d6', heraldry: 1,
    intrigue: '1d6', languages: 1, playInstruments: '1d6', readingWriting: '1d6', romance: '1d6+3', singing: '2d6',
    battle: '1d6+3', siege: '1d6', bow: 'halfDex', crossbow: 'halfDex', lance: '1d6+3', thrownWeapon: 'halfDex',
    axe: '1d6+3', bludgeon: '1d6+3', dagger: '2d6', spear: '1d6+3', sword: '2d6+3', unarmed: 'halfDex'
  }
};

const ironWeapons = ['Iron sword x1', 'Spear x1', 'Dagger x1', 'Axe, flail, or hammer x1', 'Bow x1', 'Arrows x12', 'Lances x3'];
const steelWeapons = ['Steel sword x1', 'Spears x2', 'Daggers x2', 'Axe, flail, or hammer x1', 'Light crossbow x1', 'Bolts x12', 'Lances x5'];

export const STARTING_OUTFITS = {
  1: { horses: { rouncy: 1 }, squires: 0, armorByPhase: ['Cuirbouilli', 'Cuirbouilli', 'Cuirbouilli', 'Chain mail', 'Chain mail'], shields: 1, weapons: ironWeapons, clothes: '90d', cash: 0 },
  2: { horses: { rouncy: 2 }, squires: 1, armorByPhase: ['Cuirbouilli', 'Cuirbouilli', 'Cuirbouilli', 'Chain mail', 'Chain mail'], shields: 2, weapons: ironWeapons, clothes: '120d', cash: 0 },
  3: { horses: { charger: 1, rouncy: 1 }, squires: 1, armorByPhase: ['Ring mail', 'Ring mail', 'Ring mail', 'Chain mail', 'Chain mail'], shields: 2, weapons: ironWeapons, clothes: '1 pound', cash: 0 },
  4: { horses: { charger: 1, rouncy: 1, sumpter: 1, palfrey: 1 }, squires: 1, armorByPhase: ['Ring mail', 'Chain mail', 'Reinforced chain mail', 'Reinforced chain mail', 'Partial plate'], shields: 3, weapons: steelWeapons, clothes: '4 pounds', cash: 2 },
  5: { horses: { charger: 2, courser: 1, rouncy: 2, sumpter: 1, palfrey: 1 }, squires: 2, armorByPhase: ['Chain mail', 'Reinforced chain mail', 'Partial plate', 'Partial plate', 'Full plate'], shields: 3, weapons: steelWeapons, clothes: '6 pounds', cash: 3 },
  6: { horses: { charger: 2, courser: 1, rouncy: 2, sumpter: 1, palfrey: 1 }, squires: 4, armorByPhase: ['Chain mail', 'Reinforced chain mail', 'Partial plate', 'Full plate', 'Full plate'], shields: 3, weapons: steelWeapons, clothes: '10 pounds', cash: 8 }
};

export const BIRTH_GIFTS = [
  { range: [1, 1], key: 'decoratedSaddle', label: 'Family heirloom: decorated saddle', value: '120d' },
  { range: [2, 2], key: 'magnificentCloak', label: 'Family heirloom: magnificent cloak', value: '1 pound' },
  { range: [3, 3], key: 'blessedSpear', label: 'Family heirloom: blessed spear', conditionalModifier: { skill: 'spear', amount: 1, condition: 'against pagans' } },
  { range: [4, 4], key: 'moneyOne', label: 'Money: 1 pound in coin', cash: 1 },
  { range: [5, 6], key: 'blessedSword', label: 'Family heirloom: blessed iron sword', conditionalModifier: { skill: 'sword', amount: 1, condition: 'against pagans' } },
  { range: [7, 7], key: 'goldenRing', label: 'Family heirloom: golden ring', value: '2 pounds' },
  { range: [8, 9], key: 'sacredRelic', label: 'Family heirloom: sacred relic', choice: 'religiousTrait', nestedRoll: '1d6' },
  { range: [10, 11], key: 'extraPalfrey', label: 'An extra palfrey' },
  { range: [12, 12], key: 'moneyThree', label: 'Money: 3 pounds in coin', cash: 3 },
  { range: [13, 14], key: 'extraCharger', label: 'An extra charger' },
  { range: [15, 15], key: 'outfitUpgrade', label: 'Upgrade outfit by 1', special: 'outfitUpgrade' },
  { range: [16, 16], key: 'annualStipend', label: 'Lifelong annual stipend of 1 pound', annualStipend: 1 },
  { range: [17, 17], key: 'exceptionalWeapon', label: 'An exceptional weapon', choice: 'meleeWeapon' },
  { range: [18, 18], key: 'healingPotion', label: 'A healing potion', healing: '1d6 Hit Points' },
  { range: [19, 19], key: 'rollTwice', label: 'Roll twice, ignoring other 19 results', special: 'rollTwice' },
  { range: [20, 20], key: 'playerChoice', label: "Player's choice", choice: 'birthGift' }
];

export const RELIC_TYPES = ['finger', 'tears', 'hair', 'bone', 'bone', 'blood'];

export const SOURCE_TRAIT_LABELS = {
  chaste: 'Chaste', lustful: 'Lustful', energetic: 'Energetic', lazy: 'Lazy', forgiving: 'Forgiving', vengeful: 'Vengeful',
  generous: 'Generous', selfish: 'Selfish', honest: 'Honest', deceitful: 'Deceitful', just: 'Just', arbitrary: 'Arbitrary',
  merciful: 'Merciful', cruel: 'Cruel', modest: 'Modest', proud: 'Proud', prudent: 'Prudent', reckless: 'Reckless',
  temperate: 'Temperate', indulgent: 'Indulgent', trusting: 'Trusting', suspicious: 'Suspicious', valorous: 'Valorous', cowardly: 'Cowardly'
};

export const SOURCE_SKILL_LABELS = {
  awareness: 'Awareness', chirurgery: 'Chirurgery', faerieLore: 'Faerie Lore', firstAid: 'First Aid', folkLore: 'Folk Lore',
  horsemanship: 'Horsemanship', hunting: 'Hunting', industry: 'Industry', recognize: 'Recognize', religion: 'Religion',
  stewardship: 'Stewardship', swimming: 'Swimming', courtesy: 'Courtesy', dancing: 'Dancing', eloquence: 'Eloquence',
  falconry: 'Falconry', gaming: 'Gaming', heraldry: 'Heraldry', intrigue: 'Intrigue', languages: 'Languages',
  playInstruments: 'Play Instruments', readingWriting: 'Reading/Writing', romance: 'Romance', singing: 'Singing', battle: 'Battle',
  siege: 'Siege', bow: 'Bow', crossbow: 'Crossbow', lance: 'Lance', thrownWeapon: 'Thrown Weapons', axe: 'Axe',
  bludgeon: 'Bludgeon', dagger: 'Dagger', spear: 'Spear/Polearm', sword: 'Sword', unarmed: 'Unarmed'
};
