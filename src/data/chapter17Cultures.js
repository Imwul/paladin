const item = id => ({ id });
const choose = (...ids) => ({ oneOf: ids });
const profile = (id, label, sourcePage, sourceText, items, mounts = [], horseArmor = []) => ({
  id, label, sourcePage, sourceText, items, mounts, horseArmor
});

const RELIGIONS = Object.freeze({
  christian: { id: 'christian', label: 'Christian', prayerEligible: true },
  pagan: { id: 'pagan', label: 'Pagan', prayerEligible: false },
  jewish: { id: 'jewish', label: 'Jewish', prayerEligible: false }
});

export const CHAPTER17_RELIGIONS = RELIGIONS;

export const FRANKISH_CULTURE = Object.freeze({
  id: 'frankish',
  printedName: 'Frankish',
  displayName: '프랑크 (Franks)',
  sourcePage: 'Ch.1 pp.26-41',
  playable: true,
  permission: 'core',
  homeland: 'Ardennes',
  attributeModifiers: { siz: 0, dex: 0, str: 0, con: 0, app: 0 },
  religionOptions: ['christian'],
  defaultReligionId: 'christian',
  scorePolicy: 'chapter1',
  familyPolicy: 'chapter1',
  statusPolicy: 'chapter1_knighthood',
  equipmentProfiles: []
});

export const CHAPTER17_CULTURES = Object.freeze([
  {
    id: 'basques', printedName: 'Basques', displayName: '바스크 (Basques)', sourcePage: 'Ch.17 pp.341-342',
    playable: true, permission: 'gm', homeland: 'Basque Country',
    attributeModifiers: { siz: -1, dex: 0, str: 0, con: 1, app: 0 },
    religionOptions: ['christian', 'pagan'], defaultReligionId: null,
    religionNote: '최근 기독교로 개종했으나 원문은 이교 바스크도 함께 설명합니다.',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('noble', 'Noble', 342, 'Leather armor (6), wooden shield (6); spear, sword, dagger.', [item('leather_armor_6'), item('shield'), item('spear'), item('iron_sword'), item('dagger')]),
      profile('footman', 'Footman', 342, 'Animal skin armor (4), small wooden shield (4); spear or javelins, hand axe, bow or sling, dagger.', [item('soft_leather'), item('buckler'), choose('spear', 'javelin'), item('axe'), choose('short_bow', 'sling'), item('dagger')])
    ]
  },
  {
    id: 'bretons', printedName: 'Bretons', displayName: '브레통 (Bretons)', sourcePage: 'Ch.17 pp.342-344',
    playable: true, permission: 'gm', homeland: 'Brittany',
    attributeModifiers: { siz: -2, dex: 0, str: 0, con: 1, app: -1 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('noble', 'Noble', 344, 'Ring mail and round iron helmet (8), wooden shield (6); spear, iron sword, dagger; rouncy, courser.', [item('ring_mail_8'), item('shield'), item('spear'), item('iron_sword'), item('dagger')], [item('rouncy'), item('courser')]),
      profile('horseman', 'Horseman', 344, 'Leather armor (6); spear, dagger; rouncy.', [item('leather_armor_6'), item('spear'), item('dagger')], [item('rouncy')]),
      profile('footman', 'Footman', 344, 'Leather armor (6), wooden shield (6); spear, dagger.', [item('leather_armor_6'), item('shield'), item('spear'), item('dagger')])
    ]
  },
  {
    id: 'britons', printedName: 'Britons', displayName: '브리튼인 (Britons)', sourcePage: 'Ch.17 pp.344-345',
    playable: true, permission: 'gm', homeland: 'British Isles',
    attributeModifiers: { siz: 0, dex: 0, str: 0, con: 0, app: 0 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_recognized',
    equipmentProfiles: [
      profile('noble', 'Noble', 345, 'Ring mail and iron helmet (8), wooden shield (6); spear, sword, dagger; courser or charger.', [item('ring_mail_8'), item('shield'), item('spear'), item('iron_sword'), item('dagger')], [choose('courser', 'charger')]),
      profile('horseman', 'Horseman', 345, 'Leather armor and iron helmet (6); spear, sword, dagger; rouncy.', [item('leather_armor_6'), item('spear'), item('iron_sword'), item('dagger')], [item('rouncy')]),
      profile('footman', 'Footman', 345, 'Leather armor and cap (5), wooden shield (6); spear, dagger or short sword, bow.', [item('leather_armor_5'), item('shield'), item('spear'), choose('dagger', 'short_sword'), item('short_bow')])
    ]
  },
  {
    id: 'byzantines', printedName: 'Byzantines', displayName: '비잔티움인 (Byzantines)', sourcePage: 'Ch.17 pp.345-347',
    playable: true, permission: 'gm', homeland: 'Byzantine Empire',
    attributeModifiers: { siz: -1, dex: 1, str: -1, con: 0, app: 1 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_analogous',
    equipmentProfiles: [
      profile('higher_rank', 'Higher rank', 347, 'Heavy scale and closed helmet (14); iron sword, mace, compound bow, dagger; charger with trapper (2), courser.', [item('heavy_scale_14'), item('iron_sword'), item('mace'), item('compound_bow'), item('dagger')], [item('charger'), item('courser')], [item('foreign_trapper_2')]),
      profile('cataphract', 'Cataphract', 347, 'Scale armor and open helmet (12), light shield (4); mace, lance, compound bow, dagger; charger.', [item('scale_armor_12'), item('buckler'), item('mace'), item('lance'), item('compound_bow'), item('dagger')], [item('charger')]),
      profile('footman', 'Footman', 347, 'Cuirbouilli and iron helmet (6), shield (6); spear, bow, dagger.', [item('cuirbouilli'), item('shield'), item('spear'), item('short_bow'), item('dagger')])
    ]
  },
  {
    id: 'danes', printedName: 'Danes', displayName: '데인인 (Danes)', sourcePage: 'Ch.17 pp.347-350',
    playable: true, permission: 'gm', homeland: 'Denmark',
    attributeModifiers: { siz: 1, dex: -2, str: 1, con: 1, app: -2 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('jarl_huscarl', 'Jarl / Huscarl', 349, 'Ring mail and conical metal helmet (8), wooden shield (6); iron sword, dagger.', [item('ring_mail_8'), item('shield'), item('iron_sword'), item('dagger')]),
      profile('carl', 'Carl', 349, 'Cuirbouilli (6), wooden shield (6); spear or axe, bow, dagger.', [item('cuirbouilli'), item('shield'), choose('spear', 'axe'), item('short_bow'), item('dagger')])
    ]
  },
  {
    id: 'gascons', printedName: 'Gascons', displayName: '가스콩인 (Gascons)', sourcePage: 'Ch.17 pp.349-350',
    playable: true, permission: 'gm', homeland: 'Gascony or Aquitaine',
    attributeModifiers: { siz: -1, dex: 1, str: -1, con: 0, app: 1 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_recognized',
    equipmentProfiles: [
      profile('noble', 'Noble', 350, 'Ring mail (8), shield (6); spear, sword, dagger; rouncy and courser.', [item('ring_mail_8'), item('shield'), item('spear'), item('iron_sword'), item('dagger')], [item('rouncy'), item('courser')]),
      profile('horseman', 'Horseman', 350, 'Ring mail (8); spear, bow, dagger; rouncy.', [item('ring_mail_8'), item('spear'), item('short_bow'), item('dagger')], [item('rouncy')]),
      profile('footman', 'Footman', 350, 'Leather armor and skullcap (5), wooden shield (6); spear or javelins, dagger.', [item('leather_armor_5'), item('shield'), choose('spear', 'javelin'), item('dagger')])
    ]
  },
  {
    id: 'huns', printedName: 'Huns', displayName: '훈족 (Huns)', sourcePage: 'Ch.17 pp.351-353',
    playable: true, permission: 'gm', homeland: 'Hunnish steppe lands',
    attributeModifiers: { siz: -2, dex: 0, str: 1, con: 1, app: -1 },
    religionOptions: ['pagan', 'jewish', 'christian'], defaultReligionId: null,
    religionNote: '대부분은 이교도이며, Khazars/Circassians는 유대교, 일부는 기독교 개종자입니다.',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('noble', 'Noble', 353, 'Cuirbouilli and open helmet (7), light shield (3); scimitar, compound bow, dagger; steppe pony with felt (2) or lamellar (4) horse armor.', [item('cuirbouilli_7'), item('light_shield_3'), item('scimitar'), item('compound_bow'), item('dagger')], [item('steppe_pony')], [choose('felt_horse_armor', 'lamellar_horse_armor')]),
      profile('mounted_archer', 'Mounted archer', 353, 'Fur clothes and cap (5), light shield (3); compound bow, dagger; steppe pony with felt (2) or lamellar (4) horse armor.', [item('fur_armor_5'), item('light_shield_3'), item('compound_bow'), item('dagger')], [item('steppe_pony')], [choose('felt_horse_armor', 'lamellar_horse_armor')]),
      profile('footman', 'Footman', 353, 'Furs (5), light shield (3); javelin, compound bow, dagger.', [item('fur_armor_5'), item('light_shield_3'), item('javelin'), item('compound_bow'), item('dagger')])
    ]
  },
  {
    id: 'jews', printedName: 'Jews', displayName: '유대인 (Jews)', sourcePage: 'Ch.17 pp.353-354',
    playable: true, permission: 'gm', homeland: 'Diaspora',
    attributeModifiers: { siz: -1, dex: 0, str: -2, con: 0, app: 0 },
    religionOptions: ['jewish'], defaultReligionId: 'jewish',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'military_forbidden',
    equipmentProfiles: [
      profile('unarmed', 'Unarmed traveler', 354, 'The Jews have no army, are exempt from military service, and are not allowed to carry weapons.', [item('clothing_armor')])
    ]
  },
  {
    id: 'lombards', printedName: 'Lombards', displayName: '롬바르드인 (Lombards)', sourcePage: 'Ch.17 pp.354-357',
    playable: true, permission: 'gm', homeland: 'Lombardy',
    attributeModifiers: { siz: 0, dex: 0, str: 0, con: 0, app: 0 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_recognized',
    equipmentProfiles: [
      profile('noble', 'Noble', 357, 'Scale armor (12), shield (6); spear, sword, dagger; charger and rouncy.', [item('scale_armor_12'), item('shield'), item('spear'), item('iron_sword'), item('dagger')], [item('charger'), item('rouncy')]),
      profile('footman', 'Footman / Urban militia', 357, 'Cuirbouilli (6), shield (6); spear, hand axe, bow, dagger.', [item('cuirbouilli'), item('shield'), item('spear'), item('axe'), item('short_bow'), item('dagger')])
    ]
  },
  {
    id: 'moors_saracens', printedName: 'Moors / Saracens', displayName: '무어인 / 사라센 (Moors / Saracens)', sourcePage: 'Ch.17 pp.357-360',
    playable: true, permission: 'gm', homeland: 'Moorish Spain or Saracen lands',
    attributeModifiers: { siz: -1, dex: 1, str: 0, con: 0, app: 0 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    religionNote: 'Paladin의 서사적 원문 표현을 그대로 분류하며 실제 역사적 종교 설명으로 사용하지 않습니다.',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_analogous',
    equipmentProfiles: [
      profile('faris', 'Faris', 360, 'Light chain mail (10), small round shield (4); scimitar, mace, lance, compound bow, curved dagger; courser, charger, or camel.', [item('chain_mail'), item('buckler'), item('scimitar'), item('mace'), item('lance'), item('compound_bow'), item('curved_dagger')], [choose('courser', 'charger', 'camel')]),
      profile('askari', 'Askari', 360, 'Cuirbouilli (6), small round shield (4); spear, compound bow, curved dagger; courser.', [item('cuirbouilli'), item('buckler'), item('spear'), item('compound_bow'), item('curved_dagger')], [item('courser')]),
      profile('footman', 'Footman', 360, 'Soft leather (4), small round shield (4); spear, mace, bow, curved dagger.', [item('soft_leather'), item('buckler'), item('spear'), item('mace'), item('short_bow'), item('curved_dagger')])
    ]
  },
  {
    id: 'persians', printedName: 'Persians', displayName: '페르시아인 (Persians)', sourcePage: 'Ch.17 pp.360-363',
    playable: true, permission: 'gm', homeland: 'Persia',
    attributeModifiers: { siz: -1, dex: 1, str: 0, con: 0, app: 1 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_analogous',
    equipmentProfiles: [
      profile('noble', 'Noble', 363, 'Byzantine scale and pointed helmet (9), small shield (4); sword or mace, lance, curved dagger; courser or camel.', [item('byzantine_scale'), item('buckler'), choose('persian_sword', 'mace'), item('lance'), item('curved_dagger')], [choose('courser', 'camel')]),
      profile('footman', 'Footman', 363, 'Light or no armor (0-2), small shield (4); spear or javelin or compound bow, curved dagger.', [choose('clothing_armor', 'padding'), item('buckler'), choose('spear', 'javelin', 'compound_bow'), item('curved_dagger')])
    ]
  },
  {
    id: 'romans', printedName: 'Romans', displayName: '로마인 (Romans)', sourcePage: 'Ch.17 pp.363-365',
    playable: true, permission: 'gm', homeland: 'Rome',
    attributeModifiers: { siz: -1, dex: 0, str: -1, con: 0, app: 1 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_recognized',
    equipmentProfiles: [
      profile('equites', 'Equites / Knight', 365, 'Scale armor and iron helmet (10), wooden shield (6); sword, spear, dagger; charger and rouncy.', [item('roman_scale_10'), item('shield'), item('iron_sword'), item('spear'), item('dagger')], [item('charger'), item('rouncy')]),
      profile('footman', 'Footman', 365, 'Cuirbouilli and iron helmet (7), large shield (7); short sword, spear, dagger.', [item('cuirbouilli_7'), item('large_shield_7'), item('short_sword'), item('spear'), item('dagger')])
    ]
  },
  {
    id: 'saxons_frisians', printedName: 'Saxons / Frisians', displayName: '색슨인 / 프리슬란트인 (Saxons / Frisians)', sourcePage: 'Ch.17 pp.364-367',
    playable: true, permission: 'gm', homeland: 'Saxony or Frisia',
    attributeModifiers: { siz: 1, dex: -1, str: 1, con: 0, app: -1 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('edhilingui', 'Edhilingui / Hearthguard', 367, 'Ring mail and open iron helmet (8), shield (6); sword, bow, dagger; courser or rouncy.', [item('ring_mail_8'), item('shield'), item('iron_sword'), item('short_bow'), item('dagger')], [choose('courser', 'rouncy')]),
      profile('ceorl', 'Ceorl', 367, 'Leather armor (4), shield (6); spear, axe or sword, bow, dagger.', [item('soft_leather'), item('shield'), item('spear'), choose('axe', 'iron_sword'), item('short_bow'), item('dagger')])
    ]
  },
  {
    id: 'slavs', printedName: 'Slavs', displayName: '슬라브인 (Slavs)', sourcePage: 'Ch.17 pp.367-369',
    playable: true, permission: 'gm', homeland: 'Slavonia',
    attributeModifiers: { siz: -2, dex: 0, str: 0, con: 0, app: 0 },
    religionOptions: ['pagan'], defaultReligionId: 'pagan',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_unknown',
    equipmentProfiles: [
      profile('noble', 'Noble', 369, 'Leather armor and metal helmet (6), wooden shield (6); sword, dagger; pony or rouncy.', [item('leather_armor_6'), item('shield'), item('iron_sword'), item('dagger')], [choose('pony', 'rouncy')]),
      profile('footman', 'Footman', 369, 'Padded armor (2), wooden shield (6); spear, axe, sling or bow, dagger.', [item('padding'), item('shield'), item('spear'), item('axe'), choose('sling', 'short_bow'), item('dagger')])
    ]
  },
  {
    id: 'visigoths', printedName: 'Visigoths', displayName: '서고트인 (Visigoths)', sourcePage: 'Ch.17 pp.369-370',
    playable: true, permission: 'gm', homeland: 'Visigothic Spain',
    attributeModifiers: { siz: -1, dex: 0, str: 0, con: 0, app: 0 },
    religionOptions: ['christian'], defaultReligionId: 'christian',
    scorePolicy: 'gm_unquantified', familyPolicy: 'gm_input', statusPolicy: 'knighthood_recognized',
    equipmentProfiles: [
      profile('knight', 'Knight', 370, 'Ring mail and iron helmet (8), shield (6); sword, spear, dagger.', [item('ring_mail_8'), item('shield'), item('iron_sword'), item('spear'), item('dagger')]),
      profile('horseman', 'Horseman', 370, 'Leather armor and iron helmet (6); spear, bow, dagger.', [item('leather_armor_6'), item('spear'), item('short_bow'), item('dagger')]),
      profile('footman', 'Footman', 370, 'Leather armor and cap (5), wooden shield (6); spear, bow, dagger.', [item('leather_armor_5'), item('shield'), item('spear'), item('short_bow'), item('dagger')])
    ]
  }
]);

export const CHARACTER_CULTURES = Object.freeze([FRANKISH_CULTURE, ...CHAPTER17_CULTURES]);

export const LEGENDARY_LANDS = Object.freeze([
  { id: 'ethiopia', printedName: 'Ethiopia', sourcePage: 'Ch.17 p.371', playable: false, classification: 'reference_only' },
  { id: 'cathay', printedName: 'Cathay', sourcePage: 'Ch.17 p.371', playable: false, classification: 'reference_only' }
]);
