const stats = (siz, dex, str, con, app = null) => ({ siz, dex, str, con, ...(app == null ? {} : { app }) });
const attack = (id, name, skill, options = {}) => ({ id, name, skill, kind: 'melee', weaponId: 'natural', ...options });
const entry = (id, name, sourcePage, category, values) => ({ id, name, sourcePage, category, behaviorNotes: [], ...values });

const knight = (id, name, sourcePage, attributes, values) => entry(id, name, sourcePage, 'human', {
  type: 'knight', stats: stats(attributes, attributes, attributes, attributes, attributes), ...values
});

const human = (id, name, sourcePage, values) => entry(id, name, sourcePage, 'human', { type: 'human', ...values });
const mount = (id, name, sourcePage, values) => entry(id, name, sourcePage, 'mount', { type: 'mount', ...values });
const animal = (id, name, sourcePage, category, values) => entry(id, name, sourcePage, category, { type: 'animal', ...values });
const monster = (id, name, sourcePage, values) => entry(id, name, sourcePage, 'enchanted', { type: 'monster', magical: true, ...values });

export const CHAPTER_18_CREATURES = Object.freeze([
  knight('young_knight', 'Young Knight', 373, 12, {
    glory: { personal: 1500, defeated: 40 }, damageDice: 4, armor: 10, armorExpression: '10 + shield', shield: 6, move: 2, hp: 24,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('lance', 'Lance', 10, { weaponId: 'lance' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })],
    skills: { battle: 10, awareness: 10, courtesy: 5, firstAid: 10, gaming: 10, heraldry: 5, hunting: 5 }, traits: { valorous: 13 },
    passions: { honor: 15, standard: '1d6+10' }, mounts: ['rouncy', 'charger']
  }),
  knight('ordinary_knight', 'Ordinary Knight', 373, 13, {
    glory: { personal: 2000, defeated: 50 }, damageDice: 4, armor: 10, armorExpression: '10 + shield', shield: 6, move: 3, hp: 26,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('lance', 'Lance', 15, { weaponId: 'lance' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })],
    skills: { battle: 15, awareness: 10, courtesy: 10, firstAid: 10, gaming: 10, heraldry: 10, hunting: 10 }, traits: { valorous: '1d6+10' },
    passions: { honor: 15, standard: '1d6+10' }, mounts: ['charger']
  }),
  knight('old_knight', 'Old Knight', 373, 10, {
    glory: { personal: 2500, defeated: 50 }, damageDice: 3, armor: 10, armorExpression: '10 + shield', shield: 6, move: 2, hp: 20,
    attacks: [attack('sword', 'Sword', 20, { weaponId: 'sword' }), attack('lance', 'Lance', 18, { weaponId: 'lance' }), attack('spear', 'Spear', 10, { weaponId: 'spear' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })],
    skills: { battle: 18, awareness: 15, courtesy: 15, firstAid: 15, gaming: 15, heraldry: 15, horsemanship: 18, hunting: 15 }, traits: { valorous: '1d6+12' },
    passions: { honor: 15, standard: '1d6+10' }, mounts: ['charger']
  }),
  knight('notable_knight', 'Notable Knight', 374, 14, {
    glory: { personal: 3000, defeated: 100 }, damageDice: 5, armor: 15, armorExpression: '12 + shield + 3', shield: 6, move: 3, hp: 28,
    attacks: [attack('sword', 'Sword', 18, { weaponId: 'sword' }), attack('lance', 'Lance', 18, { weaponId: 'lance' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })],
    skills: { battle: 18, awareness: 12, courtesy: 10, firstAid: 10, gaming: 10, heraldry: 10, hunting: 10 }, traits: { valorous: '1d6+12' },
    passions: { standard: '1d6+12' }, mounts: ['charger', 'destrier']
  }),
  knight('famous_knight', 'Famous Knight / Scara', 374, 16, {
    glory: { personal: 6000, defeated: 250 }, damageDice: 5, armor: 15, armorExpression: '12 + shield + 3', shield: 6, move: 3, hp: 32,
    attacks: [attack('sword', 'Sword', 20, { weaponId: 'sword' }), attack('lance', 'Lance', 20, { weaponId: 'lance' }), attack('dagger', 'Dagger', 18, { weaponId: 'dagger' })],
    skills: { battle: 20, awareness: 13, courtesy: 13, firstAid: 13, gaming: 13, heraldry: 13, hunting: 13 }, traits: { valorous: '1d6+14' },
    passions: { standard: '1d6+14' }, mounts: ['charger', 'destrier']
  }),
  knight('paladin', 'Paladin', 374, 18, {
    glory: { personal: 10000, defeated: 500 }, damageDice: 6, armor: 15, armorExpression: '12 + shield + 3', shield: 6, move: 4, hp: 36,
    attacks: [attack('sword', 'Sword', 22, { weaponId: 'sword' }), attack('lance', 'Lance', 22, { weaponId: 'lance' }), attack('dagger', 'Dagger', 20, { weaponId: 'dagger' })],
    skills: { battle: 22, awareness: 16, courtesy: 16, firstAid: 16, gaming: 16, heraldry: 16, hunting: 16, otherKnightlyMinimum: 5 }, traits: { valorous: '1d6+16' },
    passions: { standard: '1d6+16' }, mounts: ['charger', 'destrier'], gmFineTune: true
  }),

  human('bandit', 'Bandit', 374, {
    stats: stats(9, 9, 9, 9, 9), glory: { defeated: 10 }, damageDice: 3, armor: 4, move: 4, hp: 18,
    attacks: [attack('bow', 'Bow', 10, { kind: 'ranged', missileWeaponId: 'bow' }), attack('spear', 'Spear', 10, { weaponId: 'spear' }), attack('unarmed', 'Unarmed', 8, { weaponId: 'unarmed' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })], traits: { valorous: 9 }
  }),
  human('archer', 'Archer', 374, {
    stats: stats(10, 10, 10, 10, 10), glory: { defeated: 10 }, damageDice: 3, armor: 2, move: 4, hp: 20,
    attacks: [attack('bow', 'Bow', 12, { kind: 'ranged', missileWeaponId: 'bow' }), attack('crossbow', 'Crossbow', 12, { kind: 'ranged', missileWeaponId: 'lightCrossbow' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })], traits: { valorous: 10 }
  }),
  human('footman', 'Footman', 374, {
    stats: stats(11, 11, 11, 11, 11), glory: { defeated: 15 }, damageDice: 4, armor: 6, armorExpression: '6 + shield', shield: 6, move: 3, hp: 22,
    attacks: [attack('axe', 'Axe', 10, { weaponId: 'axe' }), attack('spear', 'Spear', 12, { weaponId: 'spear' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })], traits: { valorous: 11 }
  }),
  human('sergeant', 'Sergeant', 374, {
    stats: stats(12, 12, 12, 12, 12), glory: { defeated: 35 }, damageDice: 4, armor: 10, armorExpression: '10 + shield', shield: 6, move: 2, hp: 24,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('lance', 'Lance', 10, { weaponId: 'lance' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })],
    skills: { battle: 10 }, traits: { valorous: 12 }, mounts: ['rouncy']
  }),
  human('basque_noble', 'Basque Noble', 374, {
    stats: stats(12, 13, 13, 14, 13), glory: { defeated: 25 }, damageDice: 4, armor: 6, armorExpression: '6 + shield', shield: 6, move: 4, hp: 26,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('spear', 'Spear', 15, { weaponId: 'spear' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })]
  }),
  human('basque_marauder', 'Basque Marauder', 374, {
    stats: stats(9, 10, 10, 11, 10), glory: { defeated: 10 }, damageDice: 3, armor: 4, shield: 4, armorExpression: '4 + light shield 4', move: 4, hp: 20,
    attacks: [attack('bow', 'Bow', 10, { kind: 'ranged', missileWeaponId: 'bow' }), attack('javelin', 'Javelin', 10, { kind: 'ranged', missileWeaponId: 'javelin' }), attack('sling', 'Sling', 10, { kind: 'ranged', missileWeaponId: 'sling' }), attack('spear', 'Spear', 10, { weaponId: 'spear' }), attack('axe', 'Axe', 10, { weaponId: 'axe' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })]
  }),
  human('byzantine_officer', 'Byzantine Officer', 375, {
    stats: stats(14, 14, 14, 14, 14), glory: { defeated: 100 }, damageDice: 5, armor: 14, armorExpression: '14 + shield', shield: 6, move: 3, hp: 28,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('compound_bow', 'Compound Bow', 15, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('mace', 'Mace', 15, { weaponId: 'mace' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })], mounts: ['charger'], mountArmor: 2
  }),
  human('byzantine_cataphract', 'Byzantine Cataphract', 375, {
    stats: stats(12, 12, 12, 12, 12), glory: { defeated: 40 }, damageDice: 4, armor: 14, shield: 4, armorExpression: '14 + light shield 4', move: 2, hp: 28,
    attacks: [attack('compound_bow', 'Compound Bow', 15, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('lance', 'Lance', 15, { weaponId: 'lance' }), attack('mace', 'Mace', 15, { weaponId: 'mace' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })], mounts: ['charger']
  }),
  human('saxon_hearthguard', 'Saxon Hearthguard / Danish Huscarl', 375, {
    stats: stats(15, 12, 15, 15, 12), glory: { defeated: 25 }, damageDice: 5, armor: 8, shield: 6, armorExpression: '8 + shield', move: 3, hp: 30,
    attacks: [attack('great_axe', 'Two-handed Axe', 15, { weaponId: 'greatAxe' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })]
  }),
  human('hunnish_noble', 'Hunnish Noble', 375, {
    stats: stats(12, 14, 15, 15, 13), glory: { defeated: 100 }, damageDice: 5, armor: 7, shield: 3, armorExpression: '7 + light shield 3', move: 3, hp: 27,
    attacks: [attack('compound_bow', 'Compound Bow', 20, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('scimitar', 'Scimitar', 15, { weaponId: 'sword' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })], mounts: ['steppe_pony'], mountArmor: 4
  }),
  human('hunnish_mounted_archer', 'Hunnish Mounted Archer', 375, {
    stats: stats(10, 12, 13, 13, 11), glory: { defeated: 35 }, damageDice: 4, armor: 5, shield: 3, armorExpression: '5 + light shield 3', move: 4, hp: 23,
    attacks: [attack('compound_bow', 'Compound Bow', 15, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('javelin', 'Javelin', 10, { kind: 'ranged', missileWeaponId: 'javelin' }), attack('dagger', 'Dagger', 10, { weaponId: 'dagger' })], mounts: ['steppe_pony'], mountArmor: 4
  }),
  human('moorish_faris', 'Moorish Faris', 375, {
    stats: stats(14, 15, 14, 13, 14), glory: { defeated: 100 }, damageDice: 5, armor: 10, shield: 4, armorExpression: '10 + small round shield 4', move: 3, hp: 27,
    attacks: [attack('compound_bow', 'Compound Bow', 15, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('lance', 'Lance', 15, { weaponId: 'lance' }), attack('mace', 'Mace', 15, { weaponId: 'mace' }), attack('scimitar', 'Scimitar', 15, { weaponId: 'sword' }), attack('dagger', 'Curved Dagger', 15, { weaponId: 'dagger' })], mounts: ['arab_courser', 'andalusian_charger', 'camel']
  }),
  human('moorish_askari', 'Moorish Askari', 375, {
    stats: stats(12, 13, 12, 11, 12), glory: { defeated: 35 }, damageDice: 4, armor: 6, shield: 4, armorExpression: '6 + small round shield 4', move: 4, hp: 23,
    attacks: [attack('compound_bow', 'Compound Bow', 10, { kind: 'ranged', missileWeaponId: 'compoundBow' }), attack('mace', 'Mace', 10, { weaponId: 'mace' }), attack('spear', 'Spear', 10, { weaponId: 'spear' }), attack('dagger', 'Curved Dagger', 10, { weaponId: 'dagger' })], mounts: ['arab_courser']
  }),
  human('persian_noble', 'Persian Noble', 375, {
    stats: stats(13, 15, 14, 14, 15), glory: { defeated: 100 }, damageDice: 5, armor: 9, shield: 4, armorExpression: '9 + small shield 4', move: 3, hp: 27,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('mace', 'Mace', 15, { weaponId: 'mace' }), attack('lance', 'Lance', 15, { weaponId: 'lance' }), attack('dagger', 'Curved Dagger', 15, { weaponId: 'dagger' })], mounts: ['arab_courser', 'camel']
  }),
  human('slav_noble', 'Slav Noble', 375, {
    stats: stats(12, 14, 14, 14, 14), glory: { defeated: 50 }, damageDice: 4, armor: 6, shield: 6, armorExpression: '6 + shield', move: 3, hp: 26,
    attacks: [attack('sword', 'Sword', 15, { weaponId: 'sword' }), attack('dagger', 'Dagger', 15, { weaponId: 'dagger' })], mounts: ['pony', 'rouncy']
  }),

  human('monk', 'Monk', 375, {
    stats: stats(10, 10, 10, 13, 10), glory: { defeated: 1, honorLossPossible: 1 }, damageDice: 3, armor: 1, move: 4, hp: 23, attacks: [],
    skills: { chirurgery: 18, firstAid: 18, readingWriting: 6, religion: 18, stewardship: 12 }, traits: { valorous: 5 }, passions: { loveGod: 17 }, mounts: ['horse', 'pony', 'donkey', 'palfrey']
  }),
  human('farmer', 'Farmer', 375, {
    stats: stats(8, 9, 12, 10, 8), glory: { defeated: 1, honorLossPossible: 1 }, damageDice: 3, armor: 1, move: 4, hp: 18,
    attacks: [attack('club', 'Club used as Mace', 5, { weaponId: 'mace', damageDiceModifier: -1 })], skills: { faerieLore: 5, firstAid: 10, folkLore: 12, hunting: 2, industry: 10, stewardship: 8 }, traits: { valorous: 5 }
  }),
  human('rich_merchant', 'Rich Merchant', 376, {
    stats: stats(11, 10, 10, 14, 8), glory: { defeated: 1, honorLossPossible: 1 }, damageDice: 3, armor: 2, move: 4, hp: 24,
    attacks: [attack('sword', 'Sword', 5, { weaponId: 'sword' })], skills: { awareness: 12, eloquence: 12, firstAid: 10, folklore: 16, hunting: 2, stewardship: 14 }, traits: { valorous: 6 }, mounts: ['rouncy']
  }),
  human('village_blacksmith', 'Village Blacksmith', 376, {
    stats: stats(11, 13, 17, 14, 7), glory: { defeated: 1, honorLossPossible: 1 }, damageDice: 5, armor: 2, move: 5, hp: 25,
    attacks: [attack('hammer', 'Hammer', 5, { weaponId: 'hammer' })], skills: { awareness: 8, faerieLore: 8, firstAid: 10, folklore: 12, industry: 15 }, traits: { valorous: 12 }
  }),
  human('common_maidservant', 'Common Maidservant', 376, {
    stats: stats(10, 13, 9, 13, 12), glory: {}, damageDice: 3, armor: 1, move: 4, hp: 23,
    attacks: [attack('dagger', 'Dagger', 3, { weaponId: 'dagger' })], skills: { awareness: 10, chirurgery: 10, courtesy: 3, firstAid: 10, folklore: 13, industry: 10 }, traits: { chaste: 10, valorous: 3 }
  }),
  human('maid_in_waiting', 'Maid-in-Waiting', 376, {
    stats: stats(10, 14, 8, 13, 14), glory: {}, damageDice: 3, armor: 1, move: 4, hp: 23,
    attacks: [attack('dagger', 'Dagger', 3, { weaponId: 'dagger' })], skills: { awareness: 8, chirurgery: 9, courtesy: 8, dance: 9, firstAid: 12, industry: 13, stewardship: 7, siege: 3 }, traits: { chaste: 13, valorous: 4 }
  }),
  human('damosel', 'Damosel', 376, {
    stats: stats(10, 11, 9, 14, 15), glory: { personal: 250 }, damageDice: 3, armor: 1, move: 4, hp: 24,
    attacks: [attack('dagger', 'Dagger', 3, { weaponId: 'dagger' })], skills: { awareness: 10, chirurgery: 17, courtesy: 16, dance: 12, firstAid: 16, industry: 16, stewardship: 15, siege: 7 }, traits: { chaste: 17, valorous: 8 }, passions: { honor: 17 }
  }),
  human('lady', 'Lady', 376, {
    stats: stats(10, 13, 10, 15, 15), glory: { personal: 850 }, damageDice: 3, armor: 1, move: 4, hp: 25,
    attacks: [attack('dagger', 'Dagger', 3, { weaponId: 'dagger' })], skills: { awareness: 10, chirurgery: 17, courtesy: 14, dance: 12, firstAid: 16, industry: 15, stewardship: 12, siege: 9 }, traits: { chaste: 13, valorous: 4 }, passions: { honor: 16 }
  }),

  mount('palfrey', 'Palfrey', 377, { stats: stats(26, 10, 16, 8), damageDice: 3, armor: 3, move: 6, hp: 34, healingRate: 2, attacks: [], training: [] }),
  mount('rouncy', 'Rouncy', 377, { stats: stats(26, 10, 18, 14), damageDice: 4, armor: 4, move: 6, hp: 40, healingRate: 3, attacks: [], training: ['combat'] }),
  mount('charger', 'Charger', 377, { stats: stats(34, 17, 30, 12), damageDice: 6, armor: 5, move: 8, hp: 46, healingRate: 4, attacks: [], training: ['combat'] }),
  mount('andalusian_charger', 'Andalusian Charger', 377, { stats: stats(36, 17, 32, 12), damageDice: 7, armor: 5, move: 8, hp: 48, healingRate: 4, attacks: [], training: ['combat'], availablePhase: 3 }),
  mount('courser', 'Courser', 377, { stats: stats(30, 25, 24, 15), damageDice: 5, armor: 5, move: 9, hp: 45, healingRate: 4, attacks: [], training: ['hunt'], mayTrain: ['combat'] }),
  mount('arab_courser', 'Arab Courser', 377, { stats: stats(30, 28, 24, 18), damageDice: 5, armor: 4, move: 10, hp: 48, healingRate: 4, attacks: [], training: [], availablePhase: 4, foreign: true }),
  mount('destrier', 'Destrier', 377, { stats: stats(42, 10, 38, 10), damageDice: 8, armor: 5, move: 7, hp: 52, healingRate: 5, attacks: [], training: ['combat'], mayTrain: ['attack'], availablePhase: 4 }),
  mount('carthorse', 'Carthorse', 377, { stats: stats(15, 10, 15, 10), damageDice: 2, armor: 3, move: 4, hp: 25, healingRate: 3, attacks: [], training: [] }),
  mount('donkey', 'Donkey', 377, { stats: stats(15, 15, 20, 15), damageDice: 5, armor: 3, move: 5, hp: 30, healingRate: 4, attacks: [], training: [] }),
  mount('mule', 'Mule', 377, { stats: stats(25, 8, 25, 18), damageDice: 6, armor: 4, move: 6, hp: 43, healingRate: 4, attacks: [], training: [] }),
  mount('sumpter', 'Sumpter', 377, { stats: stats(22, 12, 15, 16), damageDice: 3, armor: 3, move: 5, hp: 32, majorWound: 10, healingRate: 3, attacks: [], training: [] }),
  mount('bayard', 'Bayard', 378, {
    stats: stats(50, 25, 50, 50), damageDice: 6, armor: 8, move: 25, hp: 100, healingRate: 10, avoidance: 39,
    attacks: [attack('bite_kick', 'Bite and Kick', 25), attack('lance_charge', 'Lance Charge', 25, { kind: 'lance', damageDice: 17, weaponId: 'lance' })],
    skills: { awareness: 15 }, traits: { valorous: 20, vengeful: 18 }, passions: { loyaltyMaster: 16 }, training: ['combat', 'attack'], magical: true
  }),
  mount('camel', 'Camel', 379, {
    stats: stats(55, 17, 20, 12), damageDice: 6, armor: 5, move: 6, hp: 67, healingRate: 3, attacks: [], training: [], foreign: true,
    specials: [{ id: 'horseback_advantage', classification: 'deterministic', modifier: 5, against: 'horse_rider' }, { id: 'cold_survival', classification: 'reference', modifier: -5, reference: 'Table 10-8' }]
  }),
  mount('elephant', 'Elephant', 379, {
    stats: stats(80, 12, 80, 20), glory: { defeated: 100 }, damageDice: 18, armor: 7, move: 8, hp: 100, healingRate: 10, attacks: [
      attack('trample', 'Trample', 16), attack('grapple_throw', 'Grapple and Throw', 14, { kind: 'grapple', weaponId: 'unarmed', effect: 'throw_damage', throwDamageDice: 6 })
    ], modifiers: { prudent: 5 }, requiredChecks: [{ trait: 'prudent', modifier: 5, effect: 'refrain' }], training: []
  }),
  mount('basque_pony', 'Basque Pony', 379, { stats: stats(24, 18, 15, 14), damageDice: 5, armor: 4, move: 7, hp: 34, majorWound: 10, healingRate: 3, attacks: [], training: ['combat'], foreign: true }),
  mount('steppe_pony', 'Steppe Pony', 379, { stats: stats(24, 18, 20, 10), damageDice: 5, armor: 4, move: 7, hp: 34, majorWound: 10, healingRate: 3, attacks: [], training: ['combat'], foreign: true }),

  animal('common_dog', 'Common Dog', 379, 'hunting_animal', {
    stats: stats(4, 25, 12, 12), damageDice: 2, armor: 1, move: 8, hp: 16, healingRate: 2,
    attacks: [attack('bite', 'Bite', 8, { damageDiceModifierVsMetal: -1 })], trainedUse: 'hunt', huntWithoutPackModifier: -5
  }),
  animal('mastiff', 'Mastiff', 379, 'hunting_animal', {
    stats: stats(12, 20, 13, 12), damageDice: 3, armor: 2, move: 7, hp: 24, healingRate: 3,
    attacks: [attack('bite', 'Bite', 15, { damageDiceModifierVsMetal: -1 })], trainedUse: 'combat_or_hunt'
  }),
  animal('hawk', 'Hawk', 379, 'hunting_animal', {
    stats: stats(1, 20, 5, 5), damageDice: 1, armor: 1, move: 20, movementMode: 'fly', hp: 6, healingRate: 1,
    attacks: [attack('claws', 'Claws', 12, { damageDiceModifierVsMetal: -1 })], trainedUse: 'hunt'
  }),

  animal('aurochs', 'Aurochs', 380, 'animal', {
    stats: stats(42, 7, 42, 20), glory: { defeated: 12 }, damageDice: 10, armor: 7, move: 10, hp: 62, healingRate: 6, avoidance: 5,
    attacks: [attack('charge', 'Charge', 13, { damageDiceModifier: 2, charge: true }), attack('horn_gore', 'Horn Gore', 9, { damageDiceModifier: 1 }), attack('trample', 'Trample', 17)],
    behaviorNotes: ['Normally placid; deadly when threatened or trapped.']
  }),
  animal('bear', 'Bear', 381, 'animal', {
    stats: stats(25, 10, 25, 18), glory: { defeated: 10 }, damageDice: 3, armor: 6, move: 8, hp: 43, healingRate: 4, avoidance: 7,
    attacks: [attack('claws', 'Claws', 13, { packetCount: 2, targetsPerRound: 1 })], behaviorNotes: ['Attacks only one target per round.']
  }),
  animal('boar', 'Boar', 381, 'animal', {
    stats: stats(20, 15, 30, 25), glory: { defeated: 15 }, damageDice: 6, armor: 5, move: 8, hp: 45, healingRate: 6, avoidance: 10,
    attacks: [attack('tusks', 'Tusks', 18, { target: 'mount_if_mounted' })],
    specials: [{ id: 'last_round', classification: 'deterministic', effect: 'acts_one_round_after_incapacitation' }], behaviorNotes: ['Against a mounted foe, attacks the mount first.']
  }),
  animal('deer', 'Deer', 381, 'animal', {
    stats: stats(20, 25, 25, 20), glory: { defeated: 5 }, damageDice: 3, armor: 4, move: 9, hp: 40, healingRate: 5, avoidance: 15,
    attacks: [attack('gore', 'Gore', 12), attack('hoofs', 'Hoofs', 12), attack('charge', 'Charging Attack', 12, { damageDiceModifier: 2, attackModifier: 5, charge: true })]
  }),
  animal('african_lion', 'African Lion', 381, 'animal', {
    stats: stats(23, 25, 30, 20), glory: { defeated: 100 }, damageDice: 9, armor: 5, move: 11, hp: 43, healingRate: 5, avoidance: 10, modifiers: { valorous: -5 },
    attacks: [attack('claws', 'Claws', 21, { packetCount: 2 }), attack('bite', 'Bite', 20, { damageDiceModifier: 2, requiresTargetProne: true })]
  }),
  animal('european_lion', 'European Forest Lion', 381, 'animal', {
    stats: stats(15, 25, 30, 20), glory: { defeated: 75 }, damageDice: 6, armor: 5, move: 11, hp: 35, healingRate: 5, avoidance: 10, modifiers: { valorous: -3 },
    attacks: [attack('claws', 'Claws', 21, { packetCount: 2 }), attack('bite', 'Bite', 20, { damageDiceModifier: 2, requiresTargetProne: true })]
  }),
  animal('panther', 'Panther', 382, 'animal', {
    stats: stats(12, 25, 25, 15), glory: { defeated: 50 }, damageDice: 4, armor: 5, move: 9, hp: 27, healingRate: 4, avoidance: 17,
    attacks: [attack('claws', 'Claws', 10, { packetCount: 2 }), attack('bite', 'Bite', 15, { damageDiceModifier: 1 })], behaviorNotes: ['Prefers ambush against solitary foes in deep woods.']
  }),
  animal('wolf', 'Wolf', 382, 'animal', {
    stats: stats(5, 22, 12, 13), glory: { defeated: 5 }, damageDice: 3, armor: 2, move: 8, hp: 18, healingRate: 3, avoidance: 10,
    attacks: [attack('bite', 'Bite', 20)], behavior: { group: 'pack', attacksHumansRarely: true }, behaviorNotes: ['Travels and hunts in packs; rarely attacks humans under normal circumstances.']
  }),

  monster('ogre', 'Ogre', 382, {
    stats: stats(25, 8, 20, 25), glory: { defeated: 100 }, damageDice: 8, armor: 15, move: 3, hp: 50, healingRate: 5, avoidance: 5,
    attacks: [attack('club', 'Club', 13, { weaponId: 'mace' }), attack('unarmed', 'Unarmed Combat', 15, { weaponId: 'unarmed' })]
  }),
  monster('half_giant', 'Half-Giant', 383, {
    stats: stats(25, 12, 25, 20), glory: { defeated: 150, knightBonus: 20 }, damageDice: 8, armor: 20, armorExpression: '10 skin + 10 chainmail', move: 4, hp: 45, healingRate: 5,
    attacks: [attack('club', 'Club', 15, { weaponId: 'mace' }), attack('unarmed', 'Unarmed Combat', 12, { weaponId: 'unarmed' })]
  }),
  monster('giant', 'Giant', 383, {
    stats: stats(40, 5, 30, 25), glory: { defeated: 250 }, damageDice: 12, armor: 20, move: 6, hp: 65, healingRate: 6, avoidance: 5, modifiers: { valorous: -5, prudent: 5 },
    attacks: [attack('club', 'Club', 15, { weaponId: 'mace' }), attack('grapple', 'Grapple', 17, { kind: 'grapple', weaponId: 'unarmed' })]
  }),
  monster('basilisk', 'Basilisk', 383, {
    stats: stats(5, 25, 10, 50), glory: { defeated: 250 }, damageDice: 2, armor: 20, move: 5, hp: 55, healingRate: 6, avoidance: 13, modifiers: { valorous: -15, prudent: 15 },
    attacks: [
      attack('gaze', 'Gaze', 10, { effect: 'instant_death', damageDice: 0, noDamage: true }),
      attack('poison_spit', 'Poisonous Spit', 21, { kind: 'ranged', range: 25, effect: 'ongoing_poison_damage', damagePerRound: 10, stopRoll: 1 }),
      attack('poison_bite', 'Poison Bite', 10, { effect: 'madness_poison', potencyDice: 4, noDamage: true })
    ]
  }),
  monster('centaur', 'Centaur', 383, {
    stats: stats(25, 13, 17, 22, 7), glory: { defeated: 75 }, damageDice: 7, armor: 5, move: 7, hp: 47, avoidance: 12,
    attacks: [attack('club', 'Club', 15, { weaponId: 'mace', mutuallyExclusive: 'hoof' }), attack('hoof', 'Hoof', 15, { mutuallyExclusive: 'club' })],
    skills: { awareness: 16, chirurgery: 10, hunting: 15 }, traits: { indulgent: 19, valorous: 19 }
  }),
  monster('demon', 'Demon', 384, {
    stats: stats({ min: 3, max: 18 }, 10, 22, 18), glory: { defeated: 250 }, damageDice: { min: 4, max: 7 }, armor: 10, armorExpression: '10, vulnerable to Christian magic', move: 3, fly: 4,
    hp: { min: 21, max: 36 }, healingRate: 4, modifiers: { valorous: -5 }, variantRequired: ['siz', 'damageDice'],
    attacks: [attack('claws', 'Claws', 16), attack('spiked_tail', 'Spiked Tail', 12), attack('poison_breath', 'Poisonous Breath', 10, { effect: 'poison', potencyDice: 4, noDamage: true }), attack('minor_black_magic', 'Minor Black Magic', 10, { effect: 'gm_magic', classification: 'gm_choice', noDamage: true })],
    vulnerabilities: [{ id: 'christian_magic', classification: 'structured_choice', effect: 'GM applies source-specific Christian magic' }], behaviorNotes: ['Knowing its name permits commands; it may interpret orders unexpectedly.']
  }),
  monster('dragon', 'Dragon (Wyrm)', 384, {
    stats: stats(35, 30, 35, 25), glory: { defeated: 400 }, damageDice: 7, armor: 15, move: 10, hp: 60, healingRate: '1d6/round', avoidance: 7, modifiers: { valorous: -10 },
    attacks: [attack('bite', 'Bite', 15), attack('tail_lash', 'Tail Lash', 10, { differentTargetFrom: 'bite' }), attack('fire_breath', 'Fire Breath', 10, { effect: 'gm_fire', classification: 'gm_choice', noDamage: true })],
    specials: [
      { id: 'regeneration', classification: 'deterministic', dice: '1d6', timing: 'round_end' },
      { id: 'bite_tail_two_targets', classification: 'structured_choice', effect: 'Bite and Tail Lash attack two different opponents' },
      { id: 'unique_defeat', classification: 'gm_choice', effect: 'specific method of slaying may apply' }
    ]
  }),
  monster('goblin', 'Goblin', 385, {
    stats: stats(6, 30, 16, 20), glory: { defeated: 15 }, damageDice: 4, armor: { min: 4, max: 8 }, armorExpression: '4-8 leather', move: 7, hp: 26, healingRate: 4, avoidance: 30, modifiers: { valorous: 5 }, variantRequired: ['armor'],
    attacks: [attack('bite', 'Bite', 10), attack('petty_magic', 'Lesser Illusions or Petty Magic', null, { effect: 'gm_magic', classification: 'gm_choice', noDamage: true })],
    specials: [{ id: 'opposed_vice', classification: 'structured_choice', effect: 'opposed virtue overcomes vice and makes goblin flee' }]
  }),
  monster('griffin', 'Griffin', 385, {
    stats: stats(40, 20, 40, 25), glory: { defeated: 250 }, damageDice: 8, armor: 10, move: 14, movementMode: 'fly', hp: 65, healingRate: 7, avoidance: 30, modifiers: { valorous: -5 },
    attacks: [attack('ground_claws', 'Ground Claws', 17, { packetCount: 2, groundOnly: true }), attack('bite', 'Bite', 10), attack('flyby_claw', 'Fly-by Claw', 17, { flyby: true, defenderModifier: -15 }), attack('flyby_bite', 'Fly-by Bite and Seize', 10, { flyby: true, defenderModifier: -15, effect: 'grapple_drop', maxTargetSiz: 13 })],
    combatRestrictions: ['cannot_hover'], behaviorNotes: ['Has a special taste for horse meat and hates humans.']
  }),
  monster('harpy', 'Harpy', 386, {
    stats: stats(8, 6, 8, 12), glory: { defeated: 250 }, damageDice: 1, armor: 0, move: 12, movementMode: 'fly', hp: 20, healingRate: 2, modifiers: { valorous: -10 },
    attacks: [attack('claws', 'Claws', 10)], immunities: ['normal_weapons'], specials: [{ id: 'taint_food', classification: 'narrative', effect: 'infects food it touches' }]
  }),
  monster('hippogriff', 'Hippogriff', 386, {
    stats: stats(30, 25, 15, 10), glory: { defeated: 200 }, damageDice: 5, armor: 10, move: 20, movementMode: 'fly', hp: 40, healingRate: 3, avoidance: 30,
    attacks: [attack('hoofs', 'Hoofs', 12)],
    combatRestrictions: ['cannot_hover'], specials: [
      { id: 'taming', classification: 'gm_choice', effect: 'requires a special bridle' },
      { id: 'flyby_attack_source_conflict', classification: 'gm_choice', effect: 'Statblock lists Hoofs 12, while the combat note says a single claw or bite at -15; source provides no claw or bite skill.' }
    ]
  }),
  monster('manticore', 'Manticore', 386, {
    stats: stats(45, 20, 45, 25), glory: { defeated: 300 }, damageDice: 9, armor: 10, move: 11, hp: 70, healingRate: 7, avoidance: 10, modifiers: { valorous: -10, prudent: 10 },
    attacks: [attack('bite', 'Bite', 10), attack('tail_sting', 'Tail Sting', 20, { damageDice: 6 })]
  }),
  monster('nuton', 'Nuton', 387, {
    stats: stats(3, 10, 30, 15), glory: { defeated: 0 }, damageDice: 6, armor: 1, move: 6, hp: 18, healingRate: '1/round', avoidance: 20, modifiers: { prudent: 5 },
    attacks: [attack('throw_rocks', 'Throw Rocks', 15, { kind: 'ranged', missileWeaponId: 'thrownObject' }), attack('unarmed', 'Unarmed Combat', 20, { weaponId: 'unarmed' })],
    specials: [{ id: 'captured_wish', classification: 'narrative', effect: 'captured nuton offers one wish for release' }], behaviorNotes: ['Touchy and spiteful; locals often leave food gifts.']
  }),
  monster('orc', 'Orc', 387, {
    stats: stats(40, 15, 30, 20), glory: { defeated: 400 }, damageDice: 8, armor: 30, move: 5, movementMode: 'swim', hp: 60, healingRate: 5, modifiers: { valorous: -10 },
    attacks: [attack('tusks', 'Tusks', 12)]
  }),
  monster('pegasus', 'Pegasus', 387, {
    stats: stats(40, 20, 30, 15), glory: { captured: 150, killed: 0, killedHonor: -3 }, damageDice: 6, armor: 0, move: 16, movementMode: 'fly', hp: 55, healingRate: 5, avoidance: 15,
    attacks: [attack('kick', 'Kick', 15, { damageDice: 6 }), attack('bite', 'Bite', 15, { damageDice: 3 })], immunities: ['normal_weapons'],
    modifiers: { valorous: null }, requiredChecks: [{ trait: 'valorous', modifier: 0 }], riderLance: { skillModifier: -5, damageDice: 12 },
    specials: [{ id: 'pegasus_lance', classification: 'deterministic', attackModifier: -5, damageDice: 12, requires: 'rider lance charge' }, { id: 'taming', classification: 'gm_choice', effect: 'requires a magic bridle' }]
  }),
  monster('siren', 'Siren', 387, {
    stats: stats(8, 8, 8, 8), glory: { defeated: 100 }, damageDice: 2, armor: 0, move: 8, movementMode: 'fly', hp: 16, healingRate: 2, avoidance: 8,
    attacks: [attack('enchanting_song', 'Enchanting Song', 25, { effect: 'siren_song', opposedTrait: 'chaste', noDamage: true }), attack('claws', 'Claws', 8)],
    specials: [{ id: 'song_outcome', classification: 'structured_choice', options: ['lure_to_doom', 'magical_sleep'] }], behaviorNotes: ['If the song fails, the Siren becomes frustrated and angry.']
  }),
  monster('unicorn', 'Unicorn', 388, {
    stats: stats(20, 40, 20, 20), glory: { defeated: 75 }, damageDice: 4, armor: 5, move: 11, hp: 40, healingRate: '1d6/round', avoidance: 20,
    attacks: [attack('horn', 'Horn', 15), attack('charging_horn', 'Charging Horn', 15, { damageMultiplier: 2, charge: true })],
    requiredChecks: [{ trait: 'cruel', modifier: 0, effect: 'required_to_attack' }], specials: [{ id: 'uncapturable', classification: 'deterministic', effect: 'cannot_be_captured_alive' }, { id: 'virgin_ploy', classification: 'narrative', effect: 'source attraction procedure' }], behaviorNotes: ['Normally shy and retiring.']
  }),
  monster('faerie_enchantress', 'Faerie Enchantress', 389, {
    stats: stats(8, 14, 8, 8, 25), glory: {}, damageDice: 3, armor: 0, move: 4, hp: 16, healingRate: 2, avoidance: 20, modifiers: { prudent: 5 }, attacks: [],
    skills: { dancing: 20, gaming: 15, playInstruments: 20, singing: 20 }, traits: { lustful: 20, vengeful: 15, deceitful: 20, proud: 15, indulgent: 20 },
    specials: [{ id: 'illusions_magic', classification: 'gm_choice', effect: 'powerful illusions and other magic at GM discretion' }, { id: 'ransom_magic_armor', classification: 'structured_choice', effect: 'may negotiate captured liberty for magical armor or similar' }]
  })
]);

export const CHAPTER_18_CREATURE_BY_ID = Object.freeze(Object.fromEntries(CHAPTER_18_CREATURES.map(creature => [creature.id, creature])));

export const CHAPTER_18_REFERENCE_ENTRIES = Object.freeze([
  { id: 'normal_horses_in_combat', name: 'Table 18-1: Normal Horses in Combat', sourcePage: 378, classification: 'automatic_and_player_choice' },
  { id: 'hunt_training', name: 'Hunt Training', sourcePage: 378, classification: 'automatic' },
  { id: 'attack_training', name: 'Attack Training', sourcePage: 378, classification: 'automatic_and_narrative' },
  { id: 'ruining_horses', name: 'Ruining Horses', sourcePage: 378, classification: 'automatic' },
  { id: 'extraordinary_horses', name: 'Extraordinary Horses', sourcePage: 378, classification: 'gm_choice' },
  { id: 'special_mounts', name: 'Special Mounts for Player-knights', sourcePage: 378, classification: 'gm_choice' },
  { id: 'avoidance', name: 'Avoidance', sourcePage: 380, classification: 'automatic' },
  { id: 'discretion_valor', name: 'Discretion and Valor', sourcePage: 380, classification: 'gm_choice_and_automatic' },
  { id: 'monster_partial_glory', name: 'Monster Partial Victory Glory', sourcePage: 382, classification: 'gm_choice' },
  { id: 'ghost', name: 'Ghost', sourcePage: 384, classification: 'narrative', statblock: false },
  { id: 'will_o_wisp', name: 'Will-o-wisp', sourcePage: 388, classification: 'narrative', statblock: false },
  { id: 'king_oberon', name: 'King Oberon of Faerie', sourcePage: 388, classification: 'reference', statblock: false },
  { id: 'queen_morgan', name: 'Queen Morgan le Fay', sourcePage: 388, classification: 'reference', statblock: false },
  { id: 'named_faeries', name: 'Named Faeries and Half-Faeries', sourcePage: 389, classification: 'reference', statblock: false },
  { id: 'other_monsters', name: 'Other Monsters', sourcePage: 389, classification: 'gm_choice', statblock: false }
]);

export const CHAPTER_18_HUNT_MAP = Object.freeze({
  Deer: 'deer', Aurochs: 'aurochs', Bear: 'bear', Boar: 'boar', Wolf: 'wolf', Panther: 'panther',
  'European Lion': 'european_lion', Nuton: 'nuton', Ogre: 'ogre', Unicorn: 'unicorn', 'Faerie Lady': 'faerie_enchantress'
});

export const CHAPTER_18_ADVENTURE_DEFAULTS = Object.freeze({
  devils_bridge: ['giant', 'demon'], love_of_bayard: ['bayard'], greedy_abbot: ['bandit'],
  melancholic_paladin: ['paladin'], pagan_prison: ['giant'], small_knight: ['ordinary_knight', 'notable_knight']
});
