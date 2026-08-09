const row = (quality, weapon, primarySkill, secondarySkill, damageDice, armor, options = {}) => ({
  quality, weapon, primarySkill, secondarySkill, damageDice, armor,
  shield: Boolean(options.shield), mounted: Boolean(options.mounted), missile: Boolean(options.missile),
  greatSpear: Boolean(options.greatSpear), ransomEligible: Boolean(options.ransomEligible),
  horse: options.horse || null, secondaryWeapon: options.secondaryWeapon || '단검', secondaryDamage: options.secondaryDamage || null,
  note: options.note || ''
});

const Y = { shield: true };
const knight = (quality, sword, lance, damage, armor, horse, ransomEligible = true) => row(
  quality, '검', sword, lance, damage, armor,
  { shield: true, mounted: true, horse, secondaryWeapon: '마상창', ransomEligible }
);

const earlyKnights = [
  knight('Sergeant', 11, 10, 3, 6, 'Rouncy (4d6)', false), knight('Ordinary', 11, 10, 3, 6, 'Charger (6d6)'),
  knight('Poor', 11, 10, 3, 6, 'Rouncy (4d6)'), knight('Poor', 12, 11, 3, 6, 'Rouncy (4d6)'),
  knight('Poor', 13, 12, 3, 6, 'Rouncy (4d6)'), knight('Ordinary', 13, 12, 4, 10, 'Charger (6d6)'),
  knight('Rich', 14, 12, 4, 10, 'Charger (6d6)'), knight('Ordinary', 14, 12, 4, 6, 'Charger (6d6)'),
  knight('Poor', 14, 12, 4, 6, 'Rouncy (4d6)'), knight('Ordinary', 14, 12, 5, 6, 'Charger (6d6)'),
  knight('Poor', 15, 13, 4, 6, 'Rouncy (4d6)'), knight('Rich', 15, 13, 4, 10, 'Charger (6d6)'),
  knight('Poor', 16, 14, 5, 6, 'Rouncy (4d6)'), knight('Ordinary', 16, 14, 5, 10, 'Charger (6d6)'),
  knight('Sergeant', 17, 14, 5, 10, 'Rouncy (4d6)', false), knight('Ordinary', 17, 15, 5, 10, 'Charger (6d6)'),
  knight('Rich', 18, 16, 6, 10, 'Charger (6d6)'), knight('Ordinary', 19, 17, 6, 10, 'Charger (6d6)'),
  knight('Poor', 19, 17, 5, 6, 'Rouncy (4d6)'), knight('Ordinary', 20, 18, 6, 10, 'Charger (6d6)'),
  knight('Rich', 25, 16, 6, 12, 'Charger (7d6)')
];

const lateKnights = [
  knight('Sergeant', 11, 10, 3, 10, 'Rouncy (4d6)', false), knight('Ordinary', 11, 10, 3, 14, 'Charger (6d6)'),
  knight('Poor', 11, 10, 3, 12, 'Rouncy (4d6)'), knight('Poor', 12, 11, 3, 12, 'Rouncy (4d6)'),
  knight('Poor', 13, 12, 3, 12, 'Rouncy (4d6)'), knight('Ordinary', 13, 12, 4, 14, 'Charger (6d6)'),
  knight('Rich', 14, 12, 4, 16, 'Destrier (8d6)'), knight('Ordinary', 14, 12, 4, 14, 'Charger (6d6)'),
  knight('Poor', 14, 12, 4, 12, 'Charger (6d6)'), knight('Ordinary', 14, 12, 5, 14, 'Charger (6d6)'),
  knight('Poor', 15, 13, 4, 12, 'Charger (6d6)'), knight('Rich', 15, 13, 4, 16, 'Destrier (8d6)'),
  knight('Poor', 16, 14, 5, 12, 'Charger (6d6)'), knight('Ordinary', 16, 14, 5, 14, 'Charger (6d6)'),
  knight('Sergeant', 17, 14, 5, 12, 'Charger (6d6)', false), knight('Ordinary', 17, 15, 5, 14, 'Charger (6d6)'),
  knight('Rich', 18, 16, 6, 16, 'Destrier (8d6)'), knight('Ordinary', 19, 17, 6, 14, 'Destrier (8d6)'),
  knight('Poor', 19, 17, 5, 12, 'Charger (6d6)'), knight('Ordinary', 20, 18, 6, 14, 'Destrier (8d6)'),
  knight('Rich', 25, 16, 6, 16, 'Destrier (8d6)')
];

const footmen = [
  row('Peasant', '삽 (-1d6)', 5, 1, 3, 1), row('Peasant', '괭이 (-1d6)', 10, 1, 3, 1),
  row('Archer', '활', 10, 1, 3, 1, { missile: true }), row('Foot soldier', '양손창', 10, 5, 3, 1, { greatSpear: true }),
  row('Archer', '활', 12, 4, 3, 1, { missile: true }), row('Foot soldier', '창', 12, 5, 4, 1, Y),
  row('Archer', '활', 13, 6, 3, 1, { missile: true }), row('Foot soldier', '창', 13, 7, 4, 2, Y),
  row('Archer', '활', 14, 6, 3, 1, { missile: true }), row('Foot soldier', '양손창', 14, 6, 5, 2, { greatSpear: true }),
  row('Archer', '활', 15, 6, 3, 2, { missile: true }), row('Foot soldier', '창', 15, 8, 4, 4, Y),
  row('Archer', '활', 16, 6, 3, 4, { missile: true }), row('Foot soldier', '검', 16, 8, 5, 4, Y),
  row('Archer', '활', 17, 7, 3, 4, { missile: true }), row('Foot soldier', '양손창', 17, 8, 5, 4, { greatSpear: true }),
  row('Archer', '활', 18, 7, 3, 4, { missile: true }), row('Foot soldier', '양손창', 19, 10, 6, 6, { greatSpear: true }),
  row('Archer', '활', 20, 8, 3, 4, { missile: true }), row('Foot soldier', '검', 20, 13, 5, 6, Y),
  row('Elite guard', '양손창', 21, 15, 5, 11, { greatSpear: true })
];

const saxons = [
  row('Ceorl/Frilingi', '양손창', 5, 2, 3, 1, { greatSpear: true }), row('Ceorl/Frilingi', '양손창', 10, 4, 4, 1, { greatSpear: true }),
  row('Ceorl/Frilingi', '활', 10, 4, 3, 1, { missile: true }), row('Ceorl/Frilingi', '창', 11, 5, 3, 1, Y),
  row('Ceorl/Frilingi', '투창', 12, 8, 3, 1, { ...Y, missile: true }), row('Ceorl/Frilingi', '창', 12, 5, 5, 4, Y),
  row('Hearthguard/Huscarl', '양손창', 13, 10, 5, 4, { greatSpear: true, ransomEligible: true }),
  row('Hearthguard/Huscarl', '검', 13, 12, 5, 6, { ...Y, missile: true, secondaryWeapon: '활', secondaryDamage: '3d6', ransomEligible: true }),
  row('Mounted Hearthguard/Huscarl', '검', 14, 12, 5, 6, { ...Y, mounted: true, horse: 'Rouncy (4d6)', secondaryWeapon: '마상창', ransomEligible: true }),
  row('Hearthguard/Huscarl', '검', 14, 12, 6, 6, { ...Y, secondaryWeapon: '창', ransomEligible: true }),
  row('Hearthguard/Huscarl', '양손도끼', 15, 12, 6, 4, { ...Y, ransomEligible: true }),
  row('Hearthguard/Huscarl', '검', 15, 13, 5, 6, { ...Y, secondaryWeapon: '창', ransomEligible: true }),
  row('Hearthguard/Huscarl', '양손도끼', 16, 14, 7, 6, { ...Y, ransomEligible: true }),
  row('Hearthguard/Huscarl', '양손도끼', 16, 14, 7, 10, { ...Y, ransomEligible: true }),
  row('Hearthguard/Huscarl', '양손창', 17, 14, 5, 6, { greatSpear: true, ransomEligible: true }),
  row('Edhilingui/Jarl', '검', 19, 15, 4, 10, { ...Y, missile: true, secondaryWeapon: '투창', secondaryDamage: '3d6' }),
  row('Mounted Hearthguard/Huscarl', '검', 18, 13, 6, 10, { ...Y, mounted: true, horse: 'Charger (6d6)', secondaryWeapon: '마상창', ransomEligible: true }),
  row('Mounted Edhilingui/Jarl', '검', 19, 15, 6, 10, { ...Y, mounted: true, horse: 'Charger (6d6)', secondaryWeapon: '마상창', ransomEligible: true }),
  row('Berserker', '검', 30, 0, 6, 10, Y), row('Berserker', '검', 35, 0, 7, 10, Y),
  row('Small giants', '나무', 20, 0, 8, 15)
];

const bretons = [
  row('Light foot', '투창', 5, 1, 2, 1, { missile: true }), row('Light foot', '투창', 10, 5, 2, 1, { missile: true }),
  row('Light foot', '투창', 11, 6, 3, 1, { missile: true }), row('Light foot', '투창', 12, 7, 2, 1, { missile: true }),
  row('Light foot', '활', 13, 6, 3, 1, { missile: true }), row('Light foot', '활', 14, 7, 3, 1, { missile: true }),
  row('Light foot', '양손창', 15, 7, 3, 2, { missile: true, greatSpear: true }),
  row('Light horse', '투창', 16, 8, 3, 2, { mounted: true, missile: true }), row('Light horse', '투창', 16, 8, 5, 2, { mounted: true }),
  row('Light horse', '창', 17, 10, 5, 2, { ...Y, mounted: true }), row('Light horse', '창', 18, 12, 6, 4, { ...Y, mounted: true }),
  row('Light horse', '검', 14, 13, 4, 4, { ...Y, mounted: true, secondaryWeapon: '창' }), row('Light horse', '검', 15, 13, 4, 4, { ...Y, mounted: true, secondaryWeapon: '창' }),
  row('Light horse', '투창', 15, 13, 5, 6, { mounted: true, missile: true, secondaryWeapon: '검' }), row('Light horse', '투창', 16, 14, 4, 4, { mounted: true, missile: true, secondaryWeapon: '검' }),
  row('Light horse', '투창', 17, 15, 5, 6, { mounted: true, missile: true, secondaryWeapon: '검' }), row('Light horse', '검', 18, 15, 5, 6, { ...Y, mounted: true, secondaryWeapon: '창' }),
  row('Light horse', '검', 19, 16, 5, 6, { ...Y, mounted: true, secondaryWeapon: '창' }), row('Light horse', '검', 19, 16, 6, 6, { ...Y, mounted: true, secondaryWeapon: '창' }),
  row('Light horse', '검', 20, 18, 6, 6, { ...Y, mounted: true, secondaryWeapon: '창' }), row('Mounted chieftain', '검', 21, 19, 6, 8, { ...Y, mounted: true, secondaryWeapon: '마상창', ransomEligible: true })
];

const basqueSlav = (slav = false) => {
  const primary = slav ? [7, 8, 9, 11, 12, 15, 9, 9, 10, 10, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20] : [10, 11, 12, 14, 16, 18, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 19, 19, 20, 22];
  const secondary = slav ? [5, 6, 7, 8, 10, 14, 8, 8, 9, 9, 10, 9, 9, 10, 10, 11, 12, 13, 14, 15, 18] : [5, 6, 7, 8, 10, 14, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 17, 18, 21];
  const damage = [2, 2, 2, 2, 2, 2, 3, 4, 4, 5, 4, 4, 4, 4, 5, 5, 5, 4, 5, 5, 5];
  const armor = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 6, 6, 6];
  return primary.map((skill, index) => {
    const javelin = index < 6;
    const sword = index === 20;
    const spearSword = index >= 11 && index < 20;
    return row(index === 0 ? 'Untried warrior' : index === 20 ? 'Chieftain' : 'Warrior', sword ? '검' : javelin ? '투창' : index < 11 ? '양손창' : '창', skill, secondary[index], damage[index], armor[index], {
      shield: index >= 17, missile: javelin, greatSpear: index >= 6 && index < 11,
      secondaryWeapon: spearSword ? '검' : sword ? '창' : '단검', ransomEligible: index === 20
    });
  });
};

const huns = [
  row('Untried warrior', '투창', 10, 5, 5, 3, { ...Y, missile: true, note: '표기 (3)' }),
  row('Slav Warrior', '창', 11, 6, 2, 0), row('Slav Warrior', '창', 12, 7, 2, 0),
  row('Foot Warrior', '복합궁', 13, 8, 5, 5, { ...Y, missile: true, note: '표기 (3)' }), row('Foot Warrior', '복합궁', 14, 10, 5, 5, { ...Y, missile: true, note: '표기 (3)' }),
  row('Foot Warrior', '복합궁', 15, 14, 5, 5, { ...Y, missile: true, note: '표기 (3)' }),
  ...[[13,11],[14,11],[15,12],[16,12],[17,13],[18,13]].map(([a,b]) => row('Mounted Warrior', '복합궁', a, b, 5, 5, { ...Y, mounted: true, missile: true, note: '표기 (3)' })),
  ...[[16,13,4,6],[16,14,4,6],[17,14,5,6],[17,15,5,6],[18,15,5,6],[19,16,4,8],[19,17,5,10],[20,18,5,10]].map(([a,b,d,armor], index) => row(index < 6 ? 'Mounted Warrior' : 'Warrior', '창', a, b, d, armor, { ...Y, mounted: index < 6, secondaryWeapon: '검', note: index < 6 ? '표기 (3)' : '' })),
  row('Chieftain', '검', 22, 21, 5, 10, { ...Y, secondaryWeapon: '창', ransomEligible: true })
];

export const BATTLE_ENEMY_TABLES = Object.freeze({
  earlyKnights: { label: '초기 기사', sourcePage: 149, rows: earlyKnights },
  lateKnights: { label: '후기 기사', sourcePage: 150, rows: lateKnights },
  footmen: { label: '보병', sourcePage: 151, rows: footmen },
  saxonsDanes: { label: '색슨과 데인', sourcePage: 152, rows: saxons },
  bretons: { label: '브르타뉴인', sourcePage: 153, rows: bretons },
  basques: { label: '바스크인', sourcePage: 154, rows: basqueSlav(false) },
  slavs: { label: '슬라브인', sourcePage: 154, rows: basqueSlav(true) },
  hunsAvars: { label: '훈과 아바르', sourcePage: 155, rows: huns }
});

export const lookupBattleEnemy = (tableId, rawRoll) => {
  const table = BATTLE_ENEMY_TABLES[tableId];
  if (!table) throw new RangeError('알 수 없는 Battle Enemy 표입니다.');
  const roll = Math.max(1, Math.trunc(Number(rawRoll) || 1));
  const rowIndex = Math.min(20, roll - 1);
  return { tableId, tableLabel: table.label, sourcePage: table.sourcePage, roll, ...table.rows[rowIndex] };
};
