const row = (min, max, result, effect = '', extra = {}) => ({ min, max, result, effect, ...extra });
const sourceAction = (id, label, type, extra = {}) => ({ id, label, type, required: true, ...extra });
const sourceCheck = (id, label, group, key) => sourceAction(id, label, 'check', { group, key });
const sourceScore = (id, label, group, key, amount) => sourceAction(id, label, 'score', { group, key, amount });
const sourceGlory = (id, amount, label) => sourceAction(id, label, 'glory', { amount });
const sourceStanding = (id, key, amount, label) => sourceAction(id, label, 'standing', { key, amount });
const sourceHonor = (id, amount, label) => sourceAction(id, label, 'honor', { amount });

export const CHAPTER_19_TABLES = Object.freeze({
  '19-1': { title: 'Mountain Dangers', sourcePage: 401, die: '1d6', consumer: 'humble_squires.mountain_dangers', rows: [
    row(1, 1, "Horse's DEX", '실패하면 말과 기수가 갑옷 없이 각각 2d6 피해.'),
    row(2, 2, "Horse's CON", '실패하면 추위, 먹이 부족, 질병으로 말 사망.'),
    row(3, 3, 'DEX', '실패하면 격렬한 낙마로 3d6 피해.'),
    row(4, 4, 'Horsemanship', '실패하면 STR 판정. 다시 실패하면 말이 달아나 유실.'),
    row(5, 5, 'Awareness', '실패하면 눈사태로 갑옷 없이 3d6 피해.'),
    row(6, 6, 'Prudent', '실패하면 밤에 굶주린 늑대 다섯 마리가 천막을 공격.')
  ] },
  '19-2': { title: 'Rumors', sourcePage: 403, die: '1d6', consumer: 'humble_squires.spoleto_rumors', rows: [
    row(1, 1, 'The Enemy', '토토 공작과 코르수블 술탄, 그레고리 공작의 패배에 관한 소문.'),
    row(2, 2, 'The Siege of Rome', '로마 약탈, 성유물 탈취, 라테라노 궁전 포위에 관한 소문.'),
    row(3, 3, 'The New Pope', '토토가 세운 문맹의 참칭 교황에 관한 소문.'),
    row(4, 4, 'Prince Carloman', '카를로만과 제라르가 보이지 않는 이유에 관한 소문.'),
    row(5, 5, 'The Lombards', '데시데리우스의 두 딸과 혼인 후보에 관한 소문.'),
    row(6, 6, 'The Lombard Army', '알로리가 지휘하는 롬바르드 동맹군에 관한 소문.')
  ] },
  '19-3': { title: 'Random Battle Enemy', sourcePage: 404, die: '1d20', consumer: 'humble_squires.battle_rounds', rows: [
    row(1, 4, 'Wounded Saracens', '', { skill: 'Spear 5', damage: '4d6', armor: 6, shield: false }),
    row(5, 8, 'Wounded Danes', '', { skill: 'Axe 5', damage: '5d6', armor: 8, shield: false }),
    row(9, 12, 'Fleeing Saracens', '', { skill: 'Sword 10', damage: '4d6', armor: 12, shield: false }),
    row(13, 14, 'Berserker Danes', '', { skill: '2-Handed Axe 30', damage: '6d6', armor: 10, shield: false }),
    row(15, 18, 'Saracen Knights', '', { skill: 'Sword 15, Lance 13', damage: '4d6', armor: 10, shield: true, horse: 'Charger 6d6' }),
    row(19, 19, 'A Saracen Giant', '', { skill: 'Tree Trunk 20', damage: '8d6', armor: 15, shield: false }),
    row(20, 20, 'A Saracen Leader', '', { skill: 'Lance 22, Sword 16', damage: '6d6', armor: 12, shield: true, horse: 'Charger 7d6' })
  ] },
  '19-4': { title: 'Random Battle Enemy', sourcePage: 405, die: '1d20', consumer: 'humble_squires.battle_round_3', rows: [
    row(1, 13, 'Falseron, Defending', '', { skill: '28', damage: 'N/A' }),
    row(14, 20, 'Morlant, Berserk', '플레이어 종자의 선제 비대결 공격을 버틴 경우.', { skill: '28', damage: '5d6' })
  ] },
  '19-5': { title: 'Battle of Mount Bitter Events', sourcePage: 406, die: 'round', consumer: 'humble_squires.mount_bitter', rows: [
    row(1, 1, 'Saracen Archery', '각 기사에게 Bow 15의 3d6 화살 공격 세 번.'),
    row(2, 2, 'Lance Charge', '사라센 기병의 마상창 돌격.'),
    row(3, 3, 'Carloman Wounded', '카를로만이 거인에게 중상. 아골란트와 싸우며 철수를 엄호.'),
    row(4, 4, 'Player Unit Routs', '플레이어 기사 부대 패주. 각자가 상대와 개인전.'),
    row(5, 5, 'Roland Slays Aumont', '롤랑이 아우몽을 쓰러뜨리고 뒤랑달, 베양티프, 올리팡을 획득.')
  ] },
  '19-6': { title: 'Faerie Skill Test', sourcePage: 412, die: '1d6', consumer: 'short.faerie_castle.skill_test', rows: [
    row(1, 1, 'Elegant Flattery', '', { test: ['courtesy', 'eloquence'] }),
    row(2, 2, 'Faerie Chess', '', { test: ['gaming', 'siege'] }),
    row(3, 3, 'Family Tales', '', { test: ['heraldry', 'recognize'] }),
    row(4, 4, 'Grand Feast', '', { test: ['dancing', 'singing'] }),
    row(5, 5, 'Wild Hunt', '', { test: ['horsemanship', 'hunting'] }),
    row(6, 6, 'Wondrous Tales', '', { test: ['faerieLore', 'folkLore'] })
  ] },
  '19-7': { title: 'Faerie Temptation', sourcePage: 413, die: 'sequence', consumer: 'short.faerie_castle.temptation', rows: [
    row(1, 1, 'Envy', '연인이 다른 기사에게 친절함.', { test: 'trusting' }),
    row(2, 2, 'Gluttony', '훌륭한 음식과 포도주가 끝없이 제공됨.', { test: 'temperate' }),
    row(3, 3, 'Greed', '요정 여왕이 누구에게 축복을 줄지 물음.', { test: 'generous' }),
    row(4, 4, 'Lust', '매혹적인 요정 처녀들의 유혹.', { test: 'chaste' }),
    row(5, 5, 'Pride', '궁정 전체가 영웅담을 과장하도록 부추김.', { test: 'modest' }),
    row(6, 6, 'Sloth', '따뜻한 침상과 아름다운 풍경에 머물고 싶어짐.', { test: 'energetic' }),
    row(7, 7, 'Wrath', '원수에게 저주를 내릴 기회를 제안.', { test: 'forgiving' })
  ] },
  '19-8': { title: 'Hunting Terrain Modifiers', sourcePage: 425, die: 'reference', consumer: 'hunt.chase', rows: [
    row(1, 1, 'Your Homeland', '+5', { key: 'homeland', modifier: 5 }), row(2, 2, 'Open Fields', '+5', { key: 'open', modifier: 5 }),
    row(3, 3, 'Forest/Wildlands', '0', { key: 'forest', modifier: 0 }), row(4, 4, 'No Dogs', '-5', { key: 'no_dogs', modifier: -5 }),
    row(5, 5, 'Barren Waste', '-5', { key: 'waste', modifier: -5 }), row(6, 6, 'Marsh/Swamp', '-5', { key: 'marsh', modifier: -5 }),
    row(7, 7, 'Mountains', '-5', { key: 'mountain', modifier: -5 }), row(8, 8, 'Poor Visibility', '-5', { key: 'visibility', modifier: -5 })
  ] },
  '19-9': { title: 'Hunt Versus Avoidance Results', sourcePage: 425, die: 'opposed', consumer: 'hunt.chase', rows: [
    row(1, 1, 'Win', '즉시 먹잇감을 발견하고 Discover the Prey로 이동.', { key: 'win', movement: 99 }),
    row(2, 2, 'Partial Success', '추적선을 한 칸 전진하고 segment 하나 소비.', { key: 'partial', movement: 1 }),
    row(3, 3, 'Lose', '한 칸 후퇴하고 segment 하나 소비한 뒤 장애물 처리.', { key: 'lose', movement: -1 }),
    row(4, 4, 'Fumble', '두 칸 후퇴하고 추적을 잃어 Search로 복귀.', { key: 'fumble', movement: -2 })
  ] },
  '19-10': { title: 'Hunting Obstacles', sourcePage: 425, die: '2d6', consumer: 'hunt.obstacle', rows: [
    row(2, 2, 'Hidden Ditch or Precipice', '말 DEX 실패 시 말과 기수에게 2d6 피해.'),
    row(3, 3, 'Branches or Rocks', 'DEX 실패 시 낙마와 1d6 피해.'),
    row(4, 4, 'Wrong Animal', 'Table 19-11을 굴림.'),
    row(5, 5, 'Small Stream or Ditch', '말 Move에 d20 판정. 실패하면 도약 거부, 대실패면 말과 기수 1d6 피해.'),
    row(6, 6, 'Birds Flush', 'Horsemanship 실패 시 낙마와 1d6 피해.'),
    row(7, 7, 'Confusing Tracks', 'Hunting 실패 시 추적을 잃고 Search로 복귀.'),
    row(8, 8, 'Fallen Tree', 'd20+20이 말 SIZ보다 커야 통과.'),
    row(9, 9, 'Thorny Brambles', '말 CON 실패 시 1d6 피해.'),
    row(10, 10, 'Horns or Dogs', 'Awareness 실패 시 일행과 떨어짐.'),
    row(11, 11, 'Dead End', 'Awareness 실패 시 11을 무시하고 이 표를 두 번 굴림.'),
    row(12, 12, 'Prey Charges Back', '즉시 Discover the Prey로 이동.')
  ] },
  '19-11': { title: 'Prey', sourcePage: 425, die: '1d20', consumer: 'hunt.prey', rows: [
    row(1, 4, 'Deer', '', { avoidance: 15, chapter18Page: 381 }), row(4, 7, 'Aurochs', '', { avoidance: 5, chapter18Page: 380 }),
    row(8, 11, 'Bear', '', { avoidance: 7, chapter18Page: 380 }), row(12, 16, 'Boar', '', { avoidance: 10, chapter18Page: 381 }),
    row(17, 19, 'Wolf', '', { avoidance: 10, chapter18Page: 382 }), row(20, 20, 'Special Encounter', '아래 Special subtable에서 다시 1d20.', { subtable: 'special' })
  ], subtables: { special: [
    row(1, 5, 'Panther', '', { avoidance: 15, chapter18Page: 382 }), row(6, 10, 'European Lion', '', { avoidance: 10, chapter18Page: 381 }),
    row(11, 15, 'Nuton', '', { avoidance: 20, chapter18Page: 387 }), row(16, 18, 'Ogre', '', { avoidance: 5, chapter18Page: 382 }),
    row(19, 19, 'Unicorn', '', { avoidance: 20, chapter18Page: 388 }), row(20, 20, 'Faerie Lady', '', { avoidance: 20, chapter18Page: 389 })
  ] } },
  '19-12': { title: 'Weapon Versus Avoidance Results', sourcePage: 426, die: 'opposed', consumer: 'hunt.surprise_attack', rows: [
    row(1, 1, 'Critical Success', '최대 피해. 의식이 있으면 다음 라운드에 반격.', { key: 'critical' }),
    row(2, 2, 'Win', '보통 피해. 심하게 다치지 않았다면 다음 라운드에 반격.', { key: 'win' }),
    row(3, 3, 'Partial Success', '먹잇감 도주. +5를 받고 Chase로 복귀.', { key: 'partial' }),
    row(4, 4, 'Failure', '먹잇감 도주. Chase로 복귀.', { key: 'failure' }),
    row(5, 5, 'Fumble', '먹잇감 도주. 낙마 1d6 피해 뒤 Chase로 복귀.', { key: 'fumble' })
  ] },
  '19-13': { title: 'Challenge Encounters', sourcePage: 427, die: '1d6', consumer: 'solo.challenges.month', rows: [
    row(1, 1, 'Traffic', '', { royalRoad: 3, localRoad: 2, path: 1 }), row(2, 2, 'Traffic', '', { royalRoad: 6, localRoad: 4, path: 2 }),
    row(3, 3, 'Traffic', '', { royalRoad: 9, localRoad: 6, path: 3 }), row(4, 4, 'Traffic', '', { royalRoad: 12, localRoad: 8, path: 4 }),
    row(5, 5, 'Traffic', '', { royalRoad: 15, localRoad: 10, path: 5 }), row(6, 6, 'Traffic', '', { royalRoad: 18, localRoad: 12, path: 6 })
  ] },
  '19-14': { title: 'Quality of Knight', sourcePage: 427, die: '1d6', consumer: 'solo.challenges.opponent', rows: [
    row(1, 1, 'Young Knight'), row(2, 3, 'Ordinary Knight'), row(4, 4, 'Notable Knight'), row(5, 5, 'Famous Knight'),
    row(6, 6, 'Special Encounter', 'Table 19-14의 Special Encounter subtable 사용.', { subtable: 'special' })
  ], subtables: { special: [row(1, 1, 'Personal Enemy'), row(2, 3, 'Bandits', '1d6+1명.'), row(4, 4, 'Notable Foreign Christian Knight'), row(5, 5, 'Famous Pagan Knight'), row(6, 6, 'Paladin')] } },
  '19-15': { title: 'Feuding Enemies', sourcePage: 428, die: '1d6', consumer: 'solo.feud.confrontation', rows: [
    row(1, 1, 'Lone Knight', 'Quality of Knight에서 6을 무시하고 판정.', { battleModifier: null }),
    row(2, 2, 'Half Strength Group', '', { battleModifier: 5 }), row(3, 3, 'Equal Force, Bad Terrain', '', { battleModifier: 2 }),
    row(4, 4, 'Equal Force', '', { battleModifier: 0 }), row(5, 5, 'Double Strength Group', '', { battleModifier: -5 }),
    row(6, 6, 'Ambush', '5번과 같고 적이 자유 공격 1라운드.', { battleModifier: -10 })
  ] },
  '19-16': { title: 'Lost in the Woods Encounters', sourcePage: 429, die: '1d20', consumer: 'solo.forest.day', rows: [
    row(1, 5, 'Irrevocably Lost'), row(6, 6, 'Shrine', 'Love God 성공 시 다음 판정 +2.'), row(7, 8, 'Bandits'),
    row(9, 9, 'Melancholic or Mad Paladin', '1d6 1-4 Melancholic, 5-6 Mad.'), row(10, 11, 'Wild Animal', 'Table 19-11 사용.'),
    row(12, 13, 'Unfriendly Village', '다음 판정 -5.'), row(14, 16, 'Friendly Village', '다음 판정 +10.'),
    row(17, 17, 'Hermit', '다음 판정 +5.'), row(18, 19, 'Manor Found', 'Table 19-17 사용.'), row(20, 20, 'Familiar Area', '숲을 빠져나와 절차 종료.')
  ] },
  '19-17': { title: 'Manor Encounters', sourcePage: 430, die: '1d6', consumer: 'solo.forest.manor', rows: [
    row(1, 1, 'Royal Fisc', '다음 Lost in the Woods 판정 +15.'), row(2, 3, 'Friendly Manor', '다음 판정 +10.'),
    row(4, 5, 'Jousting Knight', '사랑을 위한 마상시합 뒤 Friendly Manor로 처리.'), row(6, 6, 'Robber Knight', '죽음까지 전투. 성공해도 다음 판정 수정 없음.')
  ] },
  '19-18': { title: 'Holy Lands Travel Events', sourcePage: 430, die: '1d6', consumer: 'solo.holy_lands.travel', rows: [
    row(1, 1, 'Captured by Saracens', '매년 Standing Lord 또는 Family -5로 몸값 판정.'),
    row(2, 2, 'Ship Sinks', 'Love Charlemagne 성공 시 구조되어 귀환, 아니면 실종 후 Forest 절차.'),
    row(3, 3, 'Heat and Deprivation', 'CON 실패 시 Aging 표 1회.'),
    row(4, 4, 'Save Pilgrims', 'Valorous, Church Standing, Battle, melee weapon 체크와 Glory 100.', { actions: [
      sourceCheck('valorous', 'Valorous 체크', 'traits', 'valorous'), sourceCheck('church', 'Standing [Church] 체크', 'standings', 'church'),
      sourceCheck('battle', 'Battle 체크', 'skills', 'battle'), sourceGlory('glory', 100, '순례자 구출 Glory 100')
    ] }),
    row(5, 5, 'Angelic Vision', 'Love God +1.', { actions: [sourceScore('love_god', 'Love [God] +1', 'passions', 'loveGod', 1)] }),
    row(6, 6, 'True Relic', '무작위 virtue +3 성유물 획득.')
  ] },
  '19-19': { title: 'Holy Lands Events', sourcePage: 430, die: '1d6', consumer: 'solo.holy_lands.year', rows: [
    row(1, 1, 'Plague', 'Aging 표 1회.'), row(2, 2, 'Persian Doctors', 'Chirurgery +1d3.'),
    row(3, 3, 'Build a Church', 'Energetic, Love God, Church Standing +1; Siege 체크.', { actions: [
      sourceScore('energetic', 'Energetic +1', 'traits', 'energetic', 1), sourceScore('love_god', 'Love [God] +1', 'passions', 'loveGod', 1),
      sourceStanding('church', 'church', 1, 'Standing [Church] +1'), sourceCheck('siege', 'Siege 체크', 'skills', 'siege')
    ] }),
    row(4, 4, 'Siege of Jerusalem', 'Valorous, Siege, melee weapon, Crossbow 체크와 Glory 100.', { actions: [
      sourceCheck('valorous', 'Valorous 체크', 'traits', 'valorous'), sourceCheck('siege', 'Siege 체크', 'skills', 'siege'),
      sourceCheck('crossbow', 'Crossbow 체크', 'skills', 'crossbow'), sourceGlory('glory', 100, '예루살렘 공성 Glory 100')
    ] }),
    row(5, 5, 'Large Battle', 'Valorous, Horsemanship, Battle, melee weapon 체크와 Glory 100.', { actions: [
      sourceCheck('valorous', 'Valorous 체크', 'traits', 'valorous'), sourceCheck('horsemanship', 'Horsemanship 체크', 'skills', 'horsemanship'),
      sourceCheck('battle', 'Battle 체크', 'skills', 'battle'), sourceGlory('glory', 100, '성지 대전투 Glory 100')
    ] }),
    row(6, 6, 'Genuine Miracle', 'Love God와 Religion +1, Glory 50.', { actions: [
      sourceScore('love_god', 'Love [God] +1', 'passions', 'loveGod', 1), sourceScore('religion', 'Religion +1', 'skills', 'religion', 1),
      sourceGlory('glory', 50, '진정한 기적 Glory 50')
    ] })
  ] },
  '19-20': { title: 'Mad Acts', sourcePage: 431, die: 'fumbled passion value', consumer: 'solo.wild_hunt.madness', rows: [
    row(1, 5, 'Silent Woodsman', '효과 없음.', { characterChanges: 1 }),
    row(6, 10, 'Attacked a Village', 'Commoners Standing -1.', { characterChanges: 2, actions: [sourceStanding('commoners', 'commoners', -1, 'Standing [commoners] -1')] }),
    row(11, 15, 'Burned a Chapel', 'Church Standing -1.', { characterChanges: 3, actions: [sourceStanding('church', 'church', -1, 'Standing [Church] -1')] }),
    row(16, 20, 'Raped a Noble Lady', 'Honor -1.', { characterChanges: 4, actions: [sourceHonor('honor', -1, 'Honor -1')] }),
    row(21, 999, 'Slaughtered a Wedding Party', 'Honor -2.', { characterChanges: 5, actions: [sourceHonor('honor', -2, 'Honor -2')] })
  ] },
  '19-21': { title: 'Character Changes', sourcePage: 431, die: '1d20', consumer: 'solo.wild_hunt.character_change', rows: [
    row(1, 3, 'Random Virtue to 20', '이미 20 이상이면 +1.'), row(4, 5, 'Random Vice to 20', '이미 20 이상이면 +1.'),
    row(6, 7, 'Random Standard Passion to 5'), row(8, 10, 'Random Passion to 20', '이미 20 이상이면 +1.'),
    row(11, 11, 'Lose Non-standard Passions'), row(12, 12, 'Random Ordinary Skill to 1'), row(13, 13, 'Random Courtly Skill to 1'),
    row(14, 14, 'Random Combat Skill to 1'), row(15, 15, 'Amor/Love and Hate Reverse'), row(16, 20, 'Aging Table', 'Table 10-1 사용.')
  ] },
  '19-22': { title: "Nobleman's Complaints", sourcePage: 431, die: '1d6', consumer: 'solo.mallus.complaint', rows: [
    row(1, 1, 'Runaway Peasants', '', { test: 'folkLore' }), row(2, 2, 'Corruption and Illegal Tolls', '', { test: 'stewardship' }),
    row(3, 3, 'Poaching', '', { test: 'hunting' }), row(4, 4, 'Adultery', '', { test: 'intrigue' }),
    row(5, 5, 'Robbing a Noble Pilgrim', '', { test: 'recognize' }), row(6, 6, 'Grave Discourtesy', '', { test: 'courtesy' })
  ] },
  '19-23': { title: 'Oath-Givers', sourcePage: 432, die: '1d6', consumer: 'solo.mallus.oath_givers', rows: [
    row(1, 1, 'More for Plaintiff'), row(2, 2, 'More for Accused'), row(3, 5, 'Equal Numbers'), row(6, 6, 'No Oath-Givers')
  ] },
  '19-24': { title: 'Offered Bribes', sourcePage: 432, die: '1d6', consumer: 'solo.mallus.bribes', rows: [
    row(1, 1, 'Plaintiff Offers £1'), row(2, 2, 'Plaintiff Offers £1d)', '원문 인쇄 표기를 그대로 보존.'),
    row(3, 3, 'Accused Offers £1'), row(4, 4, 'Accused Offers 1d6£'), row(5, 5, 'Both Offer 1d6£'), row(6, 6, 'No Bribe')
  ] },
  '19-25': { title: 'Missi Dominici Conclusions', sourcePage: 433, die: 'inspection score', consumer: 'solo.missus_dominicus.report', rows: [
    row(-999, -1, 'Promotion'), row(0, 1, 'Compliments'), row(2, 3, 'Business as Usual'), row(4, 5, 'Reprimand'), row(6, 999, 'Degradation')
  ] },
  '19-26': { title: 'Pilgrimage Encounters', sourcePage: 433, die: '1d6', consumer: 'solo.pilgrimage.outbound_and_return', rows: [
    row(1, 1, 'Outlaw Attack', '갑옷 없이 4d6 상처.'), row(2, 2, 'No Special Event'),
    row(3, 3, 'Famous Hero Companion', 'Glory 25와 Intrigue 체크.', { actions: [sourceGlory('glory', 25, '영웅 동행 Glory 25'), sourceCheck('intrigue', 'Intrigue 체크', 'skills', 'intrigue')] }),
    row(4, 4, 'Pilgrim Friendship', '무작위 전문 수행원을 무료로 얻고 Retinue Standing 체크.', { actions: [sourceCheck('retinue', 'Standing [retinue] 체크', 'standings', 'retinue')] }),
    row(5, 5, 'Angelic Vision', 'Love God +1.', { actions: [sourceScore('love_god', 'Love [God] +1', 'passions', 'loveGod', 1)] }),
    row(6, 6, 'Genuine Miracle', 'Love God와 Religion +1, Glory 50.', { actions: [sourceScore('love_god', 'Love [God] +1', 'passions', 'loveGod', 1), sourceScore('religion', 'Religion +1', 'skills', 'religion', 1), sourceGlory('glory', 50, '진정한 기적 Glory 50')] })
  ] },
  '19-27': { title: 'Amor Modifiers', sourcePage: 433, die: 'reference', consumer: 'solo.romance.declaration', rows: [
    row(1, 1, 'Amor Glory', '여성은 Glory 1,000당 +1, 남성은 5,000당 +1.', { key: 'glory' }),
    row(2, 2, 'Stunning Beauty', 'APP 15 초과 1점당 +1.', { key: 'beauty' }), row(3, 3, 'Amor Saved Knight', '+5.', { key: 'saved_knight' }),
    row(4, 4, 'Knight Saved Amor', '+5.', { key: 'saved_amor' }), row(5, 5, 'Amor Is an Enemy', '-1.', { key: 'enemy' })
  ] },
  '19-28': { title: "Lover's Tasks", sourcePage: 434, die: '1d20 + completed tasks', consumer: 'solo.romance.task', rows: [
    row(1, 2, 'Bring Jewelry', '1d6£ 가치.'), row(3, 4, 'Sigh and Look Moonstruck', '', { test: 'amor' }), row(5, 6, 'Make Her Smile', '', { test: 'app' }),
    row(7, 8, 'Fresh Flowers from Afar', '', { test: 'horsemanship' }), row(9, 10, 'Surprise Garden Song', '', { test: 'singing' }),
    row(11, 12, 'Traditional Love Poem', '', { test: 'eloquence' }), row(13, 14, 'Pace the Ramparts', '', { test: ['energetic', 'amor'] }),
    row(15, 16, 'Enter Every Tournament Event', '', { dependency: 'chapter_7_tournament' }), row(17, 18, 'Disguised Love Poem', '', { test: ['eloquence', 'romance'] }),
    row(19, 20, 'Joust All Strangers for a Month', '', { dependency: 'solo_challenges' }), row(21, 22, 'Fight a Boar Unarmored', '', { dependency: 'chapter_7_combat' }),
    row(23, 24, 'Win a Tournament Prize', '', { dependency: 'solo_tournament' }), row(25, 26, 'Defy Your Lord', 'GM과 원문 의도 확인 필요.'),
    row(27, 28, 'Kill Husband, Father, or Guardian', 'GM과 원문 의도 확인 후 notable knight와 사투.')
  ] },
  '19-29': { title: 'Sample Discovery Factors', sourcePage: 435, die: 'gm reference', consumer: 'solo.romance.discovery', rows: [
    row(1, 3, 'Blissfully Unaware'), row(4, 5, 'Gifts Misattributed'), row(6, 7, 'Too Many Longing Glances'), row(8, 11, 'Being Followed'),
    row(12, 13, 'Public Slip'), row(14, 15, 'Busybody Interference'), row(16, 16, 'Malicious Gossip'), row(17, 17, 'Spiteful Maids'), row(18, 20, 'Deliberate Trap')
  ] },
  '19-30': { title: 'Exposure Results', sourcePage: 435, die: '1d20', consumer: 'solo.romance.exposure', rows: [
    row(1, 1, 'Family Feud'), row(2, 2, 'Fight to the Death'), row(3, 5, 'Public Shame and Repudiation'), row(6, 10, 'Exile and Wife Beaten'),
    row(11, 18, 'Private Threat and Repudiation'), row(19, 19, 'Private Threat and Forgiveness'), row(20, 20, 'No Action')
  ] },
  '19-31': { title: 'Tournament Glory', sourcePage: 436, die: 'reference', consumer: 'solo.tournament.awards', rows: [
    row(1, 1, 'Local', '', { plaisanceChampion: 50, plaisanceParticipant: '10', outranceChampion: 100, outranceParticipant: '50', rounds: 4 }),
    row(2, 2, 'Regional', '', { plaisanceChampion: 100, plaisanceParticipant: '10-20', outranceChampion: 200, outranceParticipant: '50-100', rounds: 6 }),
    row(3, 3, 'Regal', '', { plaisanceChampion: 200, plaisanceParticipant: '20-30', outranceChampion: 400, outranceParticipant: '200-300', rounds: 10 })
  ] },
  '19-32': { title: 'Tournament Jousting Opponents', sourcePage: 436, die: '1d6 + round', consumer: 'solo.tournament.joust', rows: [
    row(2, 3, 'Young Knight', '', { lanceBase: 9, damage: '5d6' }), row(4, 5, 'Ordinary Knight', '', { lanceBase: 11, damage: '6d6' }),
    row(6, 7, 'Ordinary Knight', '', { lanceBase: 13, damage: '6d6' }), row(8, 9, 'Notable Knight', '', { lanceBase: 15, damage: '7d6' }),
    row(10, 11, 'Famous Knight', '', { lanceBase: 17, damage: '7d6' }), row(12, 999, 'Paladin', '', { lanceBase: 19, damage: '8d6' })
  ] },
  '19-33': { title: 'Tournament Melee Opponents', sourcePage: 437, die: '1d6', consumer: 'solo.tournament.melee', rows: [
    row(1, 1, 'Young Knight', '', { sword: 10, damage: '3d6' }), row(2, 2, 'Ordinary Knight', '', { sword: 13, damage: '4d6' }),
    row(3, 3, 'Ordinary Knight', '', { sword: 16, damage: '5d6' }), row(4, 4, 'Notable Knight', '', { sword: 19, damage: '6d6' }),
    row(5, 5, 'Famous Knight', '', { sword: 22, damage: '7d6' }), row(6, 6, 'Paladin', '', { sword: 25, damage: '8d6' })
  ] },
  '19-34': { title: 'Knight Home Service', sourcePage: 437, die: '1d20', consumer: 'solo.vassal_service.events', rows: [
    row(1, 5, 'Garrison Duty', '', { actions: [sourceCheck('awareness', 'Awareness 체크', 'skills', 'awareness'), sourceCheck('intrigue', 'Intrigue 체크', 'skills', 'intrigue')] }),
    row(6, 10, 'Border Patrol', '', { actions: [sourceCheck('horsemanship', 'Horsemanship 체크', 'skills', 'horsemanship'), sourceCheck('awareness', 'Awareness 체크', 'skills', 'awareness')] }),
    row(11, 12, 'Escort Nearby', '', { actions: [sourceCheck('horsemanship', 'Horsemanship 체크', 'skills', 'horsemanship'), sourceCheck('courtesy', 'Courtesy 체크', 'skills', 'courtesy'), sourceCheck('intrigue', 'Intrigue 체크', 'skills', 'intrigue')] }),
    row(13, 13, 'Escort Far Away', '', { actions: [sourceCheck('courtesy', 'Courtesy 체크', 'skills', 'courtesy'), sourceCheck('intrigue', 'Intrigue 체크', 'skills', 'intrigue'), sourceCheck('awareness', 'Awareness 체크', 'skills', 'awareness'), sourceCheck('horsemanship', 'Horsemanship 체크', 'skills', 'horsemanship')] }),
    row(14, 16, 'Local Tournament', '', { actions: [sourceCheck('lance', 'Lance 체크', 'skills', 'lance'), sourceCheck('sword', 'Sword 체크', 'skills', 'sword'), sourceCheck('gaming', 'Gaming 체크', 'skills', 'gaming'), sourceCheck('horsemanship', 'Horsemanship 체크', 'skills', 'horsemanship')] }),
    row(17, 20, 'Welcome Strangers', 'Recognize 결과에 따라 추가 결과를 처리한다.', { actions: [sourceCheck('recognize', 'Recognize 판정 체크', 'skills', 'recognize')] })
  ] },
  '19-35': { title: 'Common Court Participants', sourcePage: 438, die: '2d6', consumer: 'solo.manor.judgment', rows: [
    row(2, 2, 'Rich Farmer', '판결 대가로 £2 제안.'), row(3, 3, 'Village Priest'), row(4, 4, 'Rich Farmer', '판결 대가로 £1 제안.'),
    row(5, 5, 'Poor Old Widow'), row(6, 6, 'Peddler'), row(7, 8, 'Farmer'), row(9, 9, 'Tradesman'), row(10, 10, 'Poor Farmer'),
    row(11, 11, 'Attractive Flirtatious Widow'), row(12, 12, 'Childhood Friend', '생각을 돕는다며 £1 제안.')
  ] },
  '19-36': { title: 'Disputes', sourcePage: 438, die: '1d20', consumer: 'solo.manor.dispute', rows: [
    row(1, 1, 'Ownership of a Cow'), row(2, 2, 'Ownership of a Pig'), row(3, 3, 'Ownership of an Ox'), row(4, 4, 'Time to Use the Plow'),
    row(5, 5, 'Unpaid Debt'), row(6, 8, 'Verbal Insults'), row(9, 12, 'Brawl'), row(13, 13, 'Knifing'),
    row(14, 15, 'Theft of Petty Property'), row(16, 17, 'Theft of Real Property'), row(18, 18, 'A Wife'), row(19, 19, 'A Daughter'), row(20, 20, 'A Killing')
  ] }
});

export const CHAPTER_19_SHORT_GUIDES = Object.freeze({
  adulterous_spouse: {
    options: ['증언 조사', '아내의 신명재판', '고발자 측과 사법 결투'], tests: ['intrigue', 'valorous', 'just', 'forgiving'],
    action: '증언과 정황을 조사한 뒤 신명재판 또는 40일 안의 사법 결투를 택한다. 고문은 Just, Merciful, Retinue·Church·Commoners Standing과 Honor에 원문 손실을 줄 수 있다.',
    conclusion: '유죄면 아내와 패배한 대리인의 생사가 갈리고, 무죄면 거짓 고발자 처벌 또는 Forgiving 판정을 처리한다.', glory: '무죄 입증 50; 사법 결투의 상대 대리인 격파 75.'
  },
  angry_merchant: {
    options: ['시굴프 조사', '백작 설득', '상인의 정체 확인', '시굴프 고발'], tests: ['intrigue', 'recognize', 'just', 'honest', 'eloquence', 'religion', 'loveGod'],
    action: '말 도둑 시굴프의 사건을 조사하고 Love [Charlemagne]가 실패한 우울 상태처럼 백작을 설득한다. 상인은 변장한 샤를마뉴이며 고발은 결투·뇌물·영지 몰수로 이어질 수 있다.',
    conclusion: '불의를 묵인하면 벌금과 Arbitrary +1, 정의를 관철하면 시굴프 처벌과 장원 하사 가능성을 처리한다.', glory: '샤를마뉴 앞에서 정의 관철 100; 시굴프 격파 50.'
  },
  children_blue_heaven: {
    options: ['주교 명령대로 유대인 체포', '실종 아동 조사', '도나티오 추적', '주교를 샤를마뉴에게 고발'], tests: ['religion', 'intrigue', 'folkLore', 'recognize', 'stewardship', 'awareness'],
    action: '마기스터, 부모, 성당 지하실, 포도주 시장의 시간 관계와 도나티오의 배를 조사한다. 성급한 체포는 Honor와 Just 손실을 낳는다.',
    conclusion: '도나티오와 부패 주교의 노예 거래를 밝히거나, 실패 시 새 희생양과 반복되는 실종을 남긴다.', glory: '도나티오 유죄 입증 50; 주교 유죄 입증 100.'
  },
  devils_bridge: {
    options: ['다리 건설과 야간 기도', '이교도 거인 도전', '불리한 전투 감수'], tests: ['battle', 'awareness', 'faerieLore', 'loveCharlemagne', 'chaste', 'forgiving'],
    action: '적의 우세를 Battle로 평가하고, 악마의 미덕 유혹과 거짓 일출을 견디거나 거인과 Chapter 7 전투를 한다. 둘 다 실패하면 Chapter 8 전투 수정 -15.',
    conclusion: '다리를 지켜 탈출하거나 거인을 꺾어 적을 물러나게 한다.', glory: '협곡의 악마 격퇴 250; 이교도 거인 격파 250.'
  },
  faerie_castle: {
    options: ['여섯 시련을 받아 탈출', '해방된 뒤 동료를 돕기', '폐허를 떠나기'], tests: ['awareness', 'faerieLore', 'recognize'],
    action: 'Table 19-6의 기술 대결에서 이겨 유혹 자격을 얻고 Table 19-7의 여섯 미덕 유혹을 모두 견딘다. 실패할 때마다 다음 기회를 위해 기술 대결을 반복한다.',
    conclusion: '성 안의 매년마다 정상 노화·경험을 처리하고 현실 경과 시간은 GM이 결정한다. 선물은 Faerie Lore 대성공 때만 진품으로 확인된다.', glory: '요정 성에서 보낸 해마다 100; 팔라딘 해방 지원 100.'
  },
  love_of_bayard: {
    options: ['바야르 돌보기', '도움을 거절'], tests: ['faerieLore', 'gaming', 'hunting', 'swimming'],
    action: '일주일 동안 최고급 곡물, 빗질, 강철 편자, 운동·놀이, 불가의 실내 잠자리를 해결한다. 허가 없이 타거나 강제하면 바야르가 공격한다.',
    conclusion: '건강하게 돌려주면 르노의 미래 호의를 얻고, 잃으면 르노가 상처를 무릅쓰고 추적한다.', glory: '바야르를 잘 돌봄 50.'
  },
  foreign_embassy: {
    options: ['서신·선물', '평화 조약', '서적', '약초', '정략혼인', '몸값 협상', '성유물', '개종'], tests: ['awareness', 'folkLore', 'languages', 'horsemanship', 'stewardship', 'heraldry', 'recognize', 'modest', 'courtesy', 'eloquence', 'intrigue'],
    action: '장거리 여행과 인질 교환을 거쳐 적대 인물을 알아보고, 궁정 경연과 모욕을 넘긴 뒤 Eloquence와 목표별 판정으로 임무를 성사시킨다.',
    conclusion: '안전 귀환 후 인질을 돌려보내고 파견자에게 성과를 보고한다. 성공에 맞는 Honor·Amor·Love·Standing만 적용한다.', glory: '달성한 외교 목표마다 50.'
  },
  greedy_abbot: {
    options: ['사전 방비', '제단 상시 경계', '도둑 추격', '거짓 기적 조사'], tests: ['awareness', 'hunting', 'recognize', 'religion', 'energetic'],
    action: '시장 첫 사흘의 군중 절도와 마지막 밤의 벽 뚫기를 대비한다. 실패하면 Hunt식 추격을 하고, 수도사들의 가짜 기적을 별도로 조사한다.',
    conclusion: '보물 유실은 Honor·Church Standing -1, 방어 성공은 둘 다 +1과 Glory/1,000£ 상당 보상.', glory: '보물 방어 50; 도둑 체포 50; 거짓 기적 폭로 25.'
  },
  guarding_maugis: {
    options: ['구금 장소', '손발 결박', '재갈', '장비·가루 압수', '밤낮 경계'], tests: ['energetic', 'awareness', 'hunting', 'recognize', 'intrigue'],
    action: '마우지스의 구금 조건과 일과를 정하고 마법 가루 노출을 처리한다. 혼자 야간 경계할 때 Energetic 실패는 탈출 기회를 준다.',
    conclusion: '탈출이면 Honor와 Lord Standing -1, 상해를 입히면 Honor -1과 클레르몽 가문의 Hate·feud, 끝까지 지키면 성공.', glory: '주군 귀환까지 마우지스 구금 50.'
  },
  love_conquers_all: {
    options: ['비밀 만남 준비', '공개 암호 고백', '세 가지 연인의 과업', '마지막 경쟁자 도전'], tests: ['romance', 'eloquence', 'singing'],
    action: 'Chapter 3/9 Amor를 생성·선언하고 공개 고백 뒤 Table 19-28에서 중복 없는 세 과업을 수행한다. 마지막 경쟁자는 결투나 합의한 경연으로 해결한다.',
    conclusion: '상대 Amor 16+면 Essai로 진행하고, 아니면 거절·고발·챔피언 도전의 결과를 보존한다.', glory: '연인의 마음 획득 100; 성공한 판정과 격파 상대의 정상 Glory.'
  },
  melancholic_paladin: {
    options: ['숲 수색', '비살상 제압', '원인 조사와 회복'], tests: ['hunting', 'awareness'],
    action: 'Avoidance 10을 상대로 Hunt식으로 팔라딘을 찾고 경쟁 기사보다 먼저 비살상 제압한다. 원인을 알아낸 뒤 Chapter 3 Melancholy 회복을 시도한다.',
    conclusion: '정신·신체가 건강한 채 귀환하면 왕의 호의나 선물, 실패해도 수색 결과를 보고한다.', glory: '우울한 팔라딘을 궁정으로 귀환 100.'
  },
  miracle_truth: {
    options: ['선교사의 사기 묵인', '사기 폭로', '교회와 방어시설 건설', '선교사 이탈 후 잔류'], tests: ['awareness', 'stewardship', 'battle', 'loveGod'],
    action: '가짜 천상 편지·치유·끓는 물 기적을 Awareness -5로 간파하고 대응을 선택한다. 주민을 동원해 교회와 방어를 세우고 Saxon 공격을 처리한다.',
    conclusion: '교회와 주민이 생존하면 마을 immunity를 받을 수 있다. 진짜 기적·일기토·방어 실패 결과는 GM 판단과 기존 엔진으로 처리한다.', glory: '교회 건설 50; Saxony 기독교 전초 유지 해마다 25.'
  },
  noble_hostage: {
    options: ['인질 보호와 원인 조사', '신명재판 대리', '민중에게 인도', '주군의 처형 명령 거부'], tests: ['honor', 'standingCommoners'],
    action: '불길한 사건의 원인을 정하고 인질 수색·감시를 예의 있게 수행한다. 민중 봉기, 신명재판, 인질 친족의 맹세 파기 분기를 처리한다.',
    conclusion: '인질 보호·무죄 입증·평화 유지 시 Lord Standing +1과 Glory/1,000£ 선물. 민중에게 넘기면 Commoners Standing은 오르지만 Honor·Lord Standing은 하락.', glory: '인질 보호 50; 평화 유지 75.'
  },
  pagan_lady: {
    options: ['구드룬 비밀 방문', '게르볼드 결투', '게르볼드의 주군·주교 설득', '구드룬 위로·구애'], tests: ['suspicious', 'hunting', 'honest', 'honor', 'eloquence', 'intrigue', 'recognize', 'courtesy', 'religion', 'loveGod'],
    action: '적지에서 구드룬을 만나 게르볼드의 배신을 확인하고, 정복 결투나 권위자의 명령으로 약속을 강제하거나 그녀의 새로운 관계를 해결한다.',
    conclusion: '구드룬이 만족하지 못하면 Saxon feud가 시작될 수 있다. 낭만적 해결은 Honor·Romance 체크와 연간 Lover’s Task 성공.', glory: '구드룬의 passion 성취 50; 전쟁 방지 75; 적지의 비밀 방문 25.'
  },
  pagan_prison: {
    options: ['거인 챔피언', '외부에 구조 요청', '비밀 굴 파기', '이교도 공주의 사랑'], tests: ['energetic', 'siege', 'eloquence', 'valorous', 'loveGod', 'honor'],
    action: '장비를 빼앗긴 Impoverished 포로로 시작해 네 원문 탈출책 중 하나를 실행한다. 구조군은 Chapter 8 Siege, 거인은 Chapter 7, 보상·몸값은 Chapter 12를 쓴다.',
    conclusion: '탈출 성공이면 귀환하며, 공주의 도움은 세 romantic test와 세례·혼인 약속을 요구한다. 실패하면 다음 해 같은 상태에서 재시도한다.', glory: '감옥 탈출 100; 거인 영주 격파 250; 이교도 공주와 혼인 500.'
  },
  rebellious_baron: {
    options: ['정상 도로와 무장 해제 협상', '순례자·상인 변장', '은밀 잠입'], tests: ['suspicious', 'trusting', 'intrigue', 'deceitful', 'folkLore', 'hunting', 'prudent', 'courtesy', 'modest', 'eloquence'],
    action: '국경 경비, 성의 무장 해제 요구, 모욕적인 연회와 이틀의 궁정 활동을 넘긴 뒤 최후통첩을 Eloquence로 전달한다.',
    conclusion: '메시지 전달 시 Valorous, 무혈 해결 시 Honor, 답신 귀환 시 Lord Standing 체크.', glory: '메시지 전달 50; 답신 획득 50.'
  },
  small_knight: {
    options: ['토너먼트 참가', '갈레란의 약점 조사', '갈레란 참가에 이의 제기', '작은 기사에게 맡김'], tests: ['intrigue', 'honor'],
    action: '비무장 완화가 없는 위험한 대회와 사법 결투를 Chapter 7로 처리하고, 갈레란·알릭스·베르타의 관계를 확인한다.',
    conclusion: '승자는 베르타와 혼인 가능하며 알릭스의 복수를 달래야 한다. 방치한 분기는 두 여성의 죽음과 유령으로 끝날 수 있다.', glory: '알릭스 명예 방어 100; 갈레란 격파 75; 베르타 혼인 250; 알릭스 구원 100.'
  },
  wrathful_lord: {
    options: ['명령 수락', '수락하는 척함', '명령 거부', '평화적 해결 모색'], tests: ['arbitrary', 'just', 'deceitful', 'honor', 'loveFamily', 'awareness', 'folkLore', 'horsemanship', 'hunting', 'recognize', 'swimming'],
    action: '하르두앵을 추적하거나 주군의 추격대를 피해 Chase를 진행한다. 최종 대면은 명예로운 도전 또는 Honor -1의 매복, 설득에 의한 평화 분기다.',
    conclusion: '복종은 Honor를 더럽히고 거부는 주군의 Hate·outlaw 상태를 낳을 수 있다. 원문은 완전히 만족스러운 결말이 드물다고 명시한다.', glory: '평화적 해결 100.'
  }
});

const procedure = (minimum, items) => ({ minimum, items });
const procedureItem = (id, title, sourcePage, extra = {}) => ({ id, title, sourcePage, ...extra });

export const CHAPTER_19_SHORT_PROCEDURES = Object.freeze({
  adulterous_spouse: procedure(2, [
    procedureItem('hear_testimony', '고발자와 증인의 진술을 듣는다', 409),
    procedureItem('choose_proof', '신명재판 또는 40일 안의 사법 결투를 택한다', 409),
    procedureItem('resolve_verdict', '유무죄와 패배한 대리인의 생사를 확정한다', 409)
  ]),
  angry_merchant: procedure(2, [
    procedureItem('investigate_sigulf', '상인의 증언과 시굴프의 말 도난을 조사한다', 410),
    procedureItem('address_count', '백작의 Love [Charlemagne]와 정의 문제를 해결한다', 410),
    procedureItem('resolve_judgment', '샤를마뉴의 정체 공개와 판결 결과를 확정한다', 410)
  ]),
  children_blue_heaven: procedure(3, [
    procedureItem('investigate_city', '마기스터, 부모, 성당과 실종 시간선을 조사한다', 410),
    procedureItem('trace_wine', '포도주 통과 Blue Heaven호를 추적한다', 411),
    procedureItem('confront_crime', '도나티오와 주교에 대한 증거·대응을 확정한다', 411)
  ]),
  devils_bridge: procedure(2, [
    procedureItem('assess_position', 'Battle로 이교도군의 우세를 평가한다', 411),
    procedureItem('choose_escape', '다리 수호 또는 이교도 거인 도전을 선택한다', 412),
    procedureItem('resolve_failure', '둘 다 실패하면 Chapter 8의 -15 Battle 결과를 처리한다', 412, { optional: true })
  ]),
  faerie_castle: procedure(2, [
    procedureItem('enter_realm', 'Awareness와 Faerie Lore로 요정 영역 진입을 확인한다', 412),
    procedureItem('track_time', '실패한 시련의 월·연도 경과와 노화를 기록한다', 412),
    procedureItem('leave_or_help', '해방 후 떠나거나 남은 동료를 돕는다', 413)
  ]),
  love_of_bayard: procedure(5, [
    procedureItem('feed_week', '일주일 동안 매일 최고급 곡물을 먹인다', 413),
    procedureItem('groom_week', '매일 접근·신뢰·접촉의 세 Horsemanship 단계를 처리한다', 413),
    procedureItem('shoe_once', '한 번 강철 편자를 신긴다', 413),
    procedureItem('entertain_week', '매일 특별한 먹이 또는 놀이로 바야르를 붙잡아 둔다', 413),
    procedureItem('sleep_week', '매일 불 가까운 실내 잠자리를 마련한다', 413)
  ]),
  foreign_embassy: procedure(4, [
    procedureItem('travel', '여행·인질 교환과 비용을 처리한다', 414),
    procedureItem('reception', '적대 인물, 예법과 궁정 경연을 처리한다', 414),
    procedureItem('present_mission', 'Eloquence와 목표별 판정으로 임무를 제시한다', 415),
    procedureItem('return_report', '귀환·인질 석방·파견자 보고를 처리한다', 415)
  ]),
  greedy_abbot: procedure(4, [
    procedureItem('prepare', '시장 전 방비와 경계 계획의 수정치를 확정한다', 415),
    procedureItem('first_attempt', '첫 사흘의 군중 절도 시도를 처리한다', 415),
    procedureItem('miracle_hoax', '수도사들의 거짓 기적을 별도로 조사한다', 415),
    procedureItem('second_attempt', '마지막 밤의 벽 뚫기와 필요 시 추격을 처리한다', 415)
  ]),
  guarding_maugis: procedure(4, [
    procedureItem('conditions', '구금 장소·결박·재갈·장비 보관을 정한다', 416),
    procedureItem('powder', '마법 가루에 노출됐다면 1d6 효과를 기록한다', 416, { optional: true }),
    procedureItem('routine', '식사·용변과 밤낮 경계 일과를 확정한다', 416),
    procedureItem('escape', '탈출 시 추적·재포획 결과를 처리한다', 416, { optional: true })
  ]),
  love_conquers_all: procedure(3, [
    procedureItem('secret_meeting', '비밀 만남과 Romance 대 Suspicious를 처리한다', 417),
    procedureItem('public_declaration', '암호화된 공개 고백을 처리한다', 417),
    procedureItem('rival', '세 과업 뒤 마지막 경쟁자의 도전 결과를 처리한다', 417)
  ]),
  melancholic_paladin: procedure(3, [
    procedureItem('search', 'Avoidance 10을 상대로 숲에서 팔라딘을 찾는다', 417),
    procedureItem('subdue', '죽이지 않고 제압한다', 418),
    procedureItem('heal', '원인을 확인하고 Melancholy 회복을 시도한다', 418)
  ]),
  miracle_truth: procedure(3, [
    procedureItem('spot_fraud', 'Awareness -5로 거짓 기적을 간파한다', 418),
    procedureItem('prepare_village', '교회와 방어시설 건설을 조직한다', 418),
    procedureItem('resolve_raid', '진짜 기적·일기토·방어 중 실제 결과를 처리한다', 419)
  ]),
  noble_hostage: procedure(3, [
    procedureItem('investigate_omens', '불길한 사건의 원인을 조사하고 GM 비밀을 보존한다', 419),
    procedureItem('protect_hostage', '민중·신명재판·봉기 속에서 인질을 보호한다', 419),
    procedureItem('resolve_orders', '친족의 맹세 파기와 처형 명령을 처리한다', 419)
  ]),
  pagan_lady: procedure(4, [
    procedureItem('visit_gudrun', 'Hunting으로 적지의 구드룬을 비밀 방문한다', 420),
    procedureItem('find_gervold', '게르볼드의 거짓말과 새 구혼을 확인한다', 420),
    procedureItem('force_promise', '결투 또는 주군·주교의 권위로 약속을 다룬다', 420),
    procedureItem('satisfy_gudrun', '구드룬의 Amor/Hate와 만족 여부를 확정한다', 420)
  ]),
  pagan_prison: procedure(2, [
    procedureItem('apply_captivity', '장비 상실, Impoverished, CON 결과를 적용한다', 420),
    procedureItem('escape_plan', '거인·구조 요청·굴·공주의 사랑 중 탈출책을 실행한다', 421),
    procedureItem('retry_year', '실패 시 같은 감옥 상태로 다음 해 재시도한다', 421, { optional: true })
  ]),
  rebellious_baron: procedure(5, [
    procedureItem('cross_border', '정상 도로·변장·잠입 중 국경 접근을 해결한다', 421),
    procedureItem('disarm', '성 안의 무장 해제 요구와 위험을 처리한다', 422),
    procedureItem('court_activity_one', '첫 번째 궁정 활동을 수행한다', 422),
    procedureItem('court_activity_two', '중복되지 않는 두 번째 궁정 활동을 수행한다', 422),
    procedureItem('deliver_message', '모든 기사의 Eloquence와 답신을 확정한다', 422)
  ]),
  small_knight: procedure(3, [
    procedureItem('investigate', '갈레란과 알릭스의 약혼 관계를 조사한다', 422),
    procedureItem('judicial_duel', '참가 이의와 사법 결투를 Chapter 7로 해결한다', 423),
    procedureItem('reconcile', '갈레란과 알릭스의 후속 관계·비극을 확정한다', 423)
  ]),
  wrathful_lord: procedure(2, [
    procedureItem('answer_order', '암살 명령을 수락·위장 수락·거부한다', 423),
    procedureItem('resolve_target', '하르두앵 또는 추격대와의 최종 대면을 해결한다', 423)
  ])
});

const sectionStages = (sourcePage, guide) => [
  { id: 'setting', title: 'Setting and Characters', kind: 'reference', sourcePage, prompt: guide.action },
  { id: 'problem', title: 'Problem and Approach', kind: 'player_choice', sourcePage, options: guide.options, prompt: guide.action },
  { id: 'secrets', title: 'Secrets', kind: 'gm_decision', sourcePage, prompt: '원문이 GM에게 맡긴 비밀의 사실 여부와 공개 시점을 기록합니다.' },
  ...guide.tests.map((test, index) => ({ id: `test_${index + 1}_${test}`, title: `${test} Test`, kind: 'test', tests: [test], sourcePage, optional: true, prompt: '선택한 접근에서 이 판정이 실제로 필요할 때만 실행합니다.' })),
  { id: 'actions', title: 'Actions and Solutions', kind: 'procedure', sourcePage, prompt: guide.action },
  { id: 'conclusion', title: 'Conclusion', kind: 'gm_decision', sourcePage, prompt: guide.conclusion },
  { id: 'glory', title: 'Glory', kind: 'aftermath', sourcePage, prompt: guide.glory }
];

const SHORT_FORM_TABLES = {
  faerie_castle: ['19-6', '19-7']
};

const SHORT_FORM_TABLE_CONFIG = {
  faerie_castle: {
    '19-6': { repeat: { mode: 'manual', minimum: 1, label: '유혹에 저항할 자격을 얻을 때까지 기술 대결 반복' } },
    '19-7': {
      repeat: { mode: 'count', count: 6, unique: true, label: '원문이 말하는 여섯 유혹 저항' },
      sourceAmbiguity: '본문은 여섯 유혹이라고 하지만 Table 19-7에는 일곱 행이 인쇄되어 있습니다. 여섯 번째 성공 뒤 어떤 행을 제외할지는 GM이 원문 해석으로 확정합니다.'
    }
  }
};

const SHORT_FORM_PERSONALITY_STAGES = {
  adulterous_spouse: [{ id: 'canonical_prayer', title: 'Prayer Before the Ordeal', action: 'adulterous_spouse_prayer', sourcePage: 409, optional: true, procedure: { kind: 'prayer', beneficiary: 'other_prayer' } }],
  angry_merchant: [{ id: 'canonical_melancholy', title: 'Passion Clash with the Count', action: 'angry_merchant_melancholy', sourcePage: 410, optional: true }],
  devils_bridge: [
    { id: 'canonical_prayer', title: 'Prayer for Divine Aid', action: 'devils_bridge_prayer', sourcePage: 411, optional: true, procedure: { kind: 'prayer', beneficiary: 'self_prayer' } },
    { id: 'canonical_dream', title: 'Prophetic Dream', action: 'devils_bridge_dream', sourcePage: 411, optional: true, procedure: { kind: 'dream', passionKey: 'loveCharlemagne', messageSource: 'source' } }
  ],
  love_conquers_all: [{ id: 'canonical_amor', title: 'Amor and Lover’s Tasks', action: 'love_conquers_all', sourcePage: 417 }],
  melancholic_paladin: [{ id: 'canonical_melancholy', title: 'Melancholy Recovery', action: 'melancholic_paladin', sourcePage: 418 }],
  miracle_truth: [{ id: 'canonical_miracle', title: 'Prayer and Miracle Judgment', action: 'miracle_truth', sourcePage: 418 }],
  noble_hostage: [{ id: 'canonical_miracle', title: 'Miracle Judgment', action: 'noble_hostage_miracle', sourcePage: 419, optional: true }],
  pagan_lady: [{ id: 'canonical_pagan_amor', title: 'Gudrun’s Amor or Hate', action: 'pagan_lady', sourcePage: 420 }],
  pagan_prison: [{ id: 'canonical_princess_amor', title: 'Pagan Princess Amor', action: 'pagan_prison_amor', sourcePage: 421, optional: true }],
  wrathful_lord: [
    { id: 'canonical_shock', title: 'Betrayal Shock', action: 'wrathful_lord_shock', sourcePage: 423, optional: true },
    { id: 'canonical_passion_conflict', title: 'Opposed Loyalty Passion', action: 'wrathful_lord_conflict', sourcePage: 423, optional: true }
  ]
};

const SHORT_FORM_SUBSYSTEM_STAGES = {
  greedy_abbot: [{ id: 'thief_chase', title: 'Chase the Thieves', subsystem: 'chase', sourcePage: 415, optional: true }],
  wrathful_lord: [{ id: 'chase', title: 'Pursuit of Hardouin or Escape from the Lord', subsystem: 'chase', sourcePage: 423 }]
};

const SOLO_PERSONALITY_STAGES = {
  royal_court: [{ id: 'canonical_court_amor', title: 'Royal Court Amor', action: 'royal_court_amor', sourcePage: 436, optional: true }]
};

const short = (id, title, sourcePage, integrations = [], dependencies = []) => ({
  id, type: 'short_form', title, sourcePage: `pp.${sourcePage}`, sourcePages: [sourcePage],
  classification: 'gm_framework', integrations, dependencies, stages: (() => {
    const stages = sectionStages(sourcePage, CHAPTER_19_SHORT_GUIDES[id]).map(stage => stage.id === 'actions'
      ? { ...stage, procedure: CHAPTER_19_SHORT_PROCEDURES[id] }
      : stage);
    const tableStages = listShortTables(id).map(tableId => ({
      id: `table_${tableId.replace('-', '_')}`,
      title: CHAPTER_19_TABLES[tableId].title,
      kind: 'table', tableId, sourcePage: CHAPTER_19_TABLES[tableId].sourcePage,
      ...(SHORT_FORM_TABLE_CONFIG[id]?.[tableId] || {})
    }));
    const personalityStages = (SHORT_FORM_PERSONALITY_STAGES[id] || []).map(item => ({
      ...item, kind: 'subsystem', subsystem: 'personality_magic'
    }));
    const subsystemStages = (SHORT_FORM_SUBSYSTEM_STAGES[id] || []).map(item => ({ ...item, kind: 'subsystem' }));
    const actionIndex = stages.findIndex(stage => stage.id === 'actions');
    return [...stages.slice(0, actionIndex + 1), ...personalityStages, ...tableStages, ...subsystemStages, ...stages.slice(actionIndex + 1)];
  })()
});

function listShortTables(id) {
  return SHORT_FORM_TABLES[id] || [];
}

export const CHAPTER_19_SHORT_FORMS = Object.freeze([
  short('adulterous_spouse', 'The Adulterous Spouse', 409, ['personality', 'combat', 'chronicle']),
  short('angry_merchant', 'The Angry Merchant', 409, ['personality', 'combat', 'standing', 'chronicle']),
  short('children_blue_heaven', 'Children of the Blue Heaven', 410, ['personality', 'combat', 'economy', 'chronicle']),
  short('devils_bridge', "The Devil's Bridge", 411, ['personality', 'combat', 'battle', 'glory', 'chronicle'], ['chapter_18']),
  short('faerie_castle', 'The Faerie Castle', 412, ['personality', 'tables', 'glory', 'chronicle'], ['chapter_10'],),
  short('love_of_bayard', 'For the Love of Bayard', 413, ['skills', 'economy', 'chronicle'], ['chapter_18']),
  short('foreign_embassy', 'The Foreign Embassy', 414, ['skills', 'personality', 'combat', 'economy', 'standing', 'chronicle']),
  short('greedy_abbot', 'The Greedy Abbot', 415, ['skills', 'combat', 'economy', 'standing', 'chronicle'], ['chapter_18']),
  short('guarding_maugis', 'Guarding Maugis', 416, ['skills', 'combat', 'chronicle']),
  short('love_conquers_all', 'Love Conquers All', 416, ['personality', 'combat', 'glory', 'chronicle']),
  short('melancholic_paladin', 'The Melancholic Paladin', 417, ['personality', 'combat', 'chronicle'], ['chapter_18']),
  short('miracle_truth', 'The Miracle of Truth', 418, ['personality', 'standing', 'chronicle']),
  short('noble_hostage', 'The Noble Hostage', 419, ['skills', 'combat', 'economy', 'standing', 'chronicle']),
  short('pagan_lady', 'The Pagan Lady', 419, ['personality', 'combat', 'chronicle']),
  short('pagan_prison', 'The Pagan Prison', 420, ['combat', 'battle', 'economy', 'glory', 'chronicle'], ['chapter_18']),
  short('rebellious_baron', 'The Rebellious Baron', 421, ['skills', 'personality', 'combat', 'standing', 'glory', 'chronicle']),
  short('small_knight', 'The Small Knight', 422, ['combat', 'glory', 'chronicle'], ['chapter_18']),
  short('wrathful_lord', 'The Wrathful Lord', 423, ['personality', 'combat', 'standing', 'chronicle'], ['chapter_3', 'chases'])
]);

const SOLO_SETUP_OPTIONS = Object.freeze({
  challenges: ['royal_road', 'local_road', 'path'],
  feud: ['punitive_expedition', 'defend_family'],
  forest: ['lost_in_woods', 'winter_solo'],
  holy_lands: ['pilgrim', 'crusader'],
  mallus: ['hear_case'],
  missus_dominicus: ['inspect_county'],
  pilgrimage: ['voluntary', 'penance'],
  royal_court: ['seek_admission'],
  tournament: ['local_plaisance', 'local_outrance', 'regional_plaisance', 'regional_outrance', 'regal_plaisance', 'regal_outrance'],
  vassal_service: ['annual_service'],
  manor: ['annual_manor_duties']
});

const SOLO_TABLE_CONFIG = Object.freeze({
  challenges: {
    '19-14': { repeat: { mode: 'result_target', sourceStageId: 'table_19_13', choiceFields: { royal_road: 'royalRoad', local_road: 'localRoad', path: 'path' }, label: '선택한 도로의 월간 조우 수' } }
  },
  forest: {
    '19-16': {
      repeat: { mode: 'until_result', results: ['Familiar Area'], label: '20이 나와 익숙한 지역에 도달할 때까지 하루마다 반복' },
      followUps: [
        { results: ['Wild Animal'], tableId: '19-11' },
        { results: ['Manor Found'], tableId: '19-17' }
      ]
    },
    '19-17': { nestedOnly: true }
  },
  pilgrimage: {
    '19-26': { repeat: { mode: 'count', count: 2, label: '성지로 가는 길과 돌아오는 길' } }
  },
  tournament: {
    '19-32': { repeat: { mode: 'result_target', sourceStageId: 'table_19_31', resultField: 'rounds', label: '대회 규모별 joust round' }, optional: true },
    '19-33': { repeat: { mode: 'result_target', sourceStageId: 'table_19_31', resultField: 'rounds', allowStop: true, minimum: 1, label: '대회 규모별 melee round; 각 round 뒤 은퇴 가능' }, optional: true }
  },
  vassal_service: {
    '19-34': { repeat: { mode: 'count', count: 3, unique: true, label: '중복을 버리고 세 번 추첨' } }
  },
  manor: {
    '19-35': { repeat: { mode: 'count', count: 2, label: '원고와 피고를 각각 한 번 판정' } }
  }
});

const SOLO_PROCEDURES = Object.freeze({
  challenges: procedure(2, [procedureItem('resolve_month', '부상·포획·말 상실과 남은 월간 상대 수를 정산한다', 428), procedureItem('settle_ransom', '몸값과 반환 장비를 Chapter 12에 넘긴다', 428)]),
  feud: procedure(4, [procedureItem('muster_kin', '친족과 선택적 용병을 소집한다', 428), procedureItem('exhort_kin', '전쟁의 이유를 설명하고 관련 체크를 받는다', 428), procedureItem('recon', 'Intrigue와 Awareness로 적의 힘을 정찰한다', 428), procedureItem('confrontation', '대기·돌격·후퇴 뒤 Chapter 7/8 결과와 몸값을 처리한다', 429)]),
  forest: procedure(1, [procedureItem('resolve_encounter', '각 일자의 조우·수정·포획·몸값 결과를 소비한다', 429)]),
  holy_lands: procedure(3, [procedureItem('pay_passage', '기사 £4와 말·종자당 £1의 왕복 선박 비용을 지불한다', 430), procedureItem('annual_checks', '성지 체류 해마다 종교 관련 자동 체크를 적용한다', 430), procedureItem('return_home', '귀환 사건 뒤 Frankland 복귀 상태를 확정한다', 430)]),
  mallus: procedure(2, [procedureItem('hear_evidence', '고발 내용, 선서 증인, 뇌물을 함께 검토한다', 432), procedureItem('sentence', 'Just 또는 Arbitrary 절차로 판결·배상을 확정한다', 432)]),
  missus_dominicus: procedure(3, [procedureItem('reception', 'Courtesy와 Recognize로 접대 수정치를 정한다', 432), procedureItem('inspection', 'Folk Lore, Stewardship, Awareness, Religion, Reading & Writing, Intrigue를 검사한다', 432), procedureItem('report', 'Inspection Score와 백작의 뇌물·최종 보고를 처리한다', 433)]),
  pilgrimage: procedure(3, [procedureItem('mortification', 'Modest로 고행 여부를 정한다', 433), procedureItem('donation', '선택 시 1년 수입을 Church에 기부한다', 433, { optional: true }), procedureItem('safe_return', '왕복 사건 뒤 귀환 체크를 적용한다', 433)]),
  royal_court: procedure(5, [procedureItem('admission', 'Standing [Charlemagne]+Glory 수정으로 입장을 판정한다', 436), procedureItem('gifts', 'heribannum 1/10 선물과 왕의 답례를 Economy로 정산한다', 436), procedureItem('court_life', 'Temperate/Indulgent와 선택한 세 courtly skill을 체크한다', 436), procedureItem('politics', 'Intrigue로 궁정 정치를 처리한다', 436), procedureItem('contests', '서로 다른 세 경연을 선택해 판정한다', 436)]),
  tournament: procedure(3, [procedureItem('helm_show', 'Gaming과 대회 조건을 확정한다', 436), procedureItem('challenges', '선택한 개별 도전을 단일 대결로 처리한다', 437, { optional: true }), procedureItem('awards', 'joust·melee·궁정 생활의 Glory와 체크를 정산한다', 437)]),
  vassal_service: procedure(3, [procedureItem('exchange_gifts', '£1 선물과 Standing [lord] 답례를 정산한다', 437), procedureItem('resolve_services', '세 무중복 봉사 결과의 체크를 적용한다', 437), procedureItem('court_life', 'Courtesy·Heraldry와 두 courtly skill을 체크한다', 437)]),
  manor: procedure(5, [procedureItem('lord_visit', 'Intrigue로 주군 방문을 처리한다', 438), procedureItem('estate_review', 'Folk Lore와 Stewardship으로 영지를 검토한다', 438), procedureItem('judgment', '두 당사자와 분쟁을 확인하고 Just 또는 Arbitrary로 판결한다', 438), procedureItem('hunt', '1d6 결과에 따라 Hunting/Horsemanship 또는 Courtesy/Falconry를 체크한다', 438), procedureItem('superstitions', 'Faerie Lore와 Church/Commoners Standing 결과를 처리한다', 438)])
});

const solo = (id, title, pages, tables, integrations = [], dependencies = []) => ({
  id, type: 'solo', title, sourcePage: `pp.${pages[0]}-${pages.at(-1)}`, sourcePages: pages,
  classification: 'procedural', tableIds: tables, integrations, dependencies,
  stages: [
    { id: 'setup', title: 'Setup', kind: 'player_choice', sourcePage: pages[0], options: SOLO_SETUP_OPTIONS[id] || [] },
    ...tables.filter(tableId => !SOLO_TABLE_CONFIG[id]?.[tableId]?.nestedOnly).map(tableId => ({
      id: `table_${tableId.replace('-', '_')}`, title: CHAPTER_19_TABLES[tableId].title, kind: 'table', tableId,
      sourcePage: CHAPTER_19_TABLES[tableId].sourcePage, ...(SOLO_TABLE_CONFIG[id]?.[tableId] || {})
    })),
    { id: 'resolution', title: 'Procedure Resolution', kind: 'procedure', sourcePage: pages.at(-1), procedure: SOLO_PROCEDURES[id] },
    ...(SOLO_PERSONALITY_STAGES[id] || []).map(item => ({ ...item, kind: 'subsystem', subsystem: 'personality_magic' })),
    { id: 'aftermath', title: 'Checks and Consequences', kind: 'aftermath', sourcePage: pages.at(-1) }
  ]
});

export const CHAPTER_19_SOLOS = Object.freeze([
  solo('challenges', 'Challenges', [427, 428], ['19-13', '19-14'], ['combat', 'economy', 'glory'], ['chapter_18']),
  solo('feud', 'The Feud', [428, 429], ['19-15'], ['personality', 'battle', 'economy', 'standing'], ['chapter_8']),
  solo('forest', 'The Forest', [429, 430], ['19-16', '19-17'], ['combat', 'economy', 'standing'], ['chapter_18']),
  {
    id: 'holy_lands', type: 'solo', title: 'The Holy Lands', sourcePage: 'p.430', sourcePages: [430],
    classification: 'procedural', tableIds: ['19-18', '19-19'], integrations: ['economy', 'battle', 'glory', 'standing'], dependencies: ['chapter_10', 'chapter_18'],
    stages: [
      { id: 'setup', title: 'Pilgrim or Crusader', kind: 'player_choice', sourcePage: 430, options: ['pilgrim', 'crusader'] },
      { id: 'outbound_travel', title: 'Outbound Holy Lands Travel', kind: 'table', tableId: '19-18', sourcePage: 430 },
      { id: 'years_in_holy_lands', title: 'Years in the Holy Lands', kind: 'table', tableId: '19-19', sourcePage: 430, repeat: { mode: 'manual', minimum: 1, label: '성지에 머무는 해마다 한 번; 귀환할 때 중단' } },
      { id: 'homeward_travel', title: 'Homeward Holy Lands Travel', kind: 'table', tableId: '19-18', sourcePage: 430 },
      { id: 'resolution', title: 'Voyage and Annual Consequences', kind: 'procedure', sourcePage: 430, procedure: SOLO_PROCEDURES.holy_lands },
      { id: 'aftermath', title: 'Return to Frankland', kind: 'aftermath', sourcePage: 430 }
    ]
  },
  {
    id: 'hunt', type: 'solo', title: 'The Hunt', sourcePage: 'pp.424-426, 430', sourcePages: [424, 425, 426, 430],
    classification: 'procedural', tableIds: ['19-8', '19-9', '19-10', '19-11', '19-12'],
    integrations: ['skills', 'combat'], dependencies: ['chapter_13', 'chapter_18'],
    stages: [
      { id: 'setup', title: 'Hunt Preparation', kind: 'player_choice', sourcePage: 424 },
      {
        id: 'hunt_procedure', title: 'Search, Chase, and the Kill', kind: 'subsystem', subsystem: 'hunt', sourcePage: 424,
        tableIds: ['19-8', '19-9', '19-10', '19-11', '19-12']
      }
    ]
  },
  {
    id: 'wild_hunt', type: 'solo', title: 'The Wild Hunt', sourcePage: 'p.431', sourcePages: [431],
    classification: 'procedural', tableIds: ['19-20', '19-21'], integrations: ['personality', 'standing'], dependencies: ['chapter_10'],
    stages: [
      { id: 'setup', title: 'Madness Source', kind: 'player_choice', sourcePage: 431, options: ['passion_fumble', 'wild_hunt'] },
      { id: 'canonical_madness', title: 'Mad Acts, Character Changes, and Recovery', kind: 'subsystem', subsystem: 'personality_magic', action: 'wild_hunt', sourcePage: 431 },
      { id: 'aftermath', title: 'Recovery or Another Year', kind: 'aftermath', sourcePage: 431 }
    ]
  },
  solo('mallus', 'The Mallus', [431, 432], ['19-22', '19-23', '19-24'], ['skills', 'personality', 'economy']),
  solo('missus_dominicus', 'Missus Dominicus', [432, 433], ['19-25'], ['skills', 'personality', 'standing'], ['chapter_11']),
  solo('pilgrimage', 'The Pilgrimage', [433], ['19-26'], ['personality', 'economy', 'glory', 'standing'], ['chapter_12']),
  {
    id: 'romance', type: 'solo', title: 'Romance', sourcePage: 'pp.433-435', sourcePages: [433, 434, 435],
    classification: 'procedural', tableIds: ['19-27', '19-28', '19-29', '19-30'],
    integrations: ['personality', 'combat', 'economy', 'glory'], dependencies: [],
    stages: [
      { id: 'setup', title: 'Passionate Declaration', kind: 'player_choice', sourcePage: 433, options: ['declare_amor', 'continue_amor'] },
      { id: 'canonical_amor_start', title: 'Amor and Potential Amor', kind: 'subsystem', subsystem: 'personality_magic', action: 'romance_start', sourcePage: 433 },
      { id: 'canonical_wooing', title: 'Gift, Approach, and Lover’s Task', kind: 'subsystem', subsystem: 'personality_magic', action: 'romance_progression', sourcePage: 434 },
      { id: 'canonical_essai', title: 'The Essai', kind: 'subsystem', subsystem: 'personality_magic', action: 'romance_essai', sourcePage: 434 },
      { id: 'canonical_consummation', title: 'Consummation', kind: 'subsystem', subsystem: 'personality_magic', action: 'romance_consummation', sourcePage: 435 },
      { id: 'canonical_discovery', title: 'Subterfuge, Discovery, and Exposure', kind: 'subsystem', subsystem: 'personality_magic', action: 'romance_discovery', sourcePage: 435 },
      { id: 'aftermath', title: 'Possible Pregnancy and Conclusion', kind: 'aftermath', sourcePage: 435 }
    ]
  },
  solo('royal_court', 'The Royal Court', [436], [], ['skills', 'personality', 'economy', 'standing', 'glory']),
  solo('tournament', 'The Tournament', [436, 437], ['19-31', '19-32', '19-33'], ['combat', 'economy', 'glory', 'standing'], ['chapter_7']),
  solo('vassal_service', 'Vassal Service', [437], ['19-34'], ['skills', 'personality', 'economy', 'standing']),
  solo('manor', 'Your Manor', [438], ['19-35', '19-36'], ['skills', 'personality', 'economy', 'standing'], ['chapter_12'])
]);

export const CHAPTER_19_LONG_ADVENTURES = Object.freeze([
  {
    id: 'jewel', type: 'long_form', title: 'The Adventure of the Jewel', sourcePage: 'pp.394-399', sourcePages: [394, 395, 396, 397, 398, 399],
    sourcePremise: { year: 766, role: 'squire', label: '원문 전제 · 766년 종자 캐릭터' },
    classification: 'fixed_adventure', integrations: ['skills', 'personality', 'combat', 'economy', 'glory', 'standing', 'chronicle'], dependencies: [],
    stages: [
      { id: 'setup', title: 'Lord Thierry\'s Charge', kind: 'setup', sourcePage: 394 },
      { id: 'information', title: 'Information and Route', kind: 'test', sourcePage: 394, tests: ['religion', 'intrigue'], testMode: 'all' },
      { id: 'pilgrim', title: 'The Strange Pilgrim', kind: 'player_choice', sourcePage: 395, options: ['give_alms', 'refuse_alms'] },
      { id: 'pilgrim_selfish', title: 'Refusing Alms', kind: 'test', sourcePage: 395, tests: ['selfish'], repeat: { mode: 'participants', label: '자선을 베풀지 않은 모든 참가자' }, when: { stageId: 'pilgrim', value: 'refuse_alms' } },
      { id: 'brigands', title: 'The Brigands', kind: 'subsystem', subsystem: 'combat', sourcePage: 396 },
      { id: 'brigand_pursuit', title: 'Pursuit of the Fleeing Brigands', kind: 'subsystem', subsystem: 'chase', sourcePage: 396, optional: true },
      { id: 'route', title: 'The Route South', kind: 'player_choice', sourcePage: 396, options: ['island', 'esneux'] },
      { id: 'hermit', title: 'The Hermit', kind: 'gm_decision', sourcePage: 396 },
      { id: 'hermit_prayer', title: 'The Hermit’s Prayer', kind: 'subsystem', subsystem: 'personality_magic', action: 'jewel_hermit_prayer', sourcePage: 396, optional: true, procedure: { kind: 'prayer', beneficiary: 'other_prayer', form: 'normal', place: 'ordinary', day: 'ordinary', sacredItem: 'none', sourceEffect: '은자가 대신 기도하므로 Love [God]로 기도의 이익을 판정합니다.' } },
      { id: 'hermit_healing', title: 'The Hermit’s Healing', kind: 'subsystem', subsystem: 'healing', sourcePage: 396, optional: true, healingSkill: 15 },
      { id: 'relic_prayer', title: 'Prayer to Saint Marcian’s Relic', kind: 'subsystem', subsystem: 'personality_magic', action: 'jewel_relic_prayer', sourcePage: 395, optional: true, procedure: { kind: 'prayer', beneficiary: 'self_prayer', form: 'normal', place: 'ordinary', day: 'ordinary', sacredItem: 'none', contextModifier: 5, contextNote: 'Saint Marcian’s relic against wild animals', sourceEffect: '성공하면 에인가르의 모든 행동에 -5.' } },
      { id: 'dream', title: 'The Dream', kind: 'subsystem', subsystem: 'personality_magic', action: 'jewel_dream', sourcePage: 396, optional: true, when: { stageId: 'route', value: 'island' }, procedure: { kind: 'dream', passionKey: 'loveCharlemagne', messageSource: 'source', sourcePrompt: '양 떼를 지키는 개들 사이에서 검은 개가 양을 공격하고, 목자는 늑대 떼와 싸우는 꿈.' } },
      { id: 'beaver_dam', title: 'The Beaver Dam', kind: 'test', sourcePage: 397, tests: ['siege'] },
      { id: 'beaver_result', title: 'Dam and Flood Consequence', kind: 'consequence', sourcePage: 397 },
      { id: 'esneux', title: 'Esneux and Its Rumors', kind: 'test', sourcePage: 397, tests: ['folkLore'] },
      { id: 'special_mass', title: 'Saint Marcian’s Special Mass', kind: 'test', sourcePage: 397, tests: ['loveCharlemagne'], optional: true },
      { id: 'eingarstein', title: 'Eingarstein', kind: 'gm_decision', sourcePage: 398 },
      { id: 'werewolf', title: 'Sir Eingar at Night', kind: 'subsystem', subsystem: 'combat', sourcePage: 398 },
      { id: 'eingar_fate', title: 'Mercy and Sir Eingar’s Fate', kind: 'player_choice', sourcePage: 399, options: ['spare_and_monastery', 'killed_in_combat', 'captured_for_judgment'] },
      { id: 'return', title: 'Return to La Roche', kind: 'consequence', sourcePage: 399, requiresCanonicalConsequence: true },
      { id: 'aftermath', title: 'Glory and Treasure', kind: 'aftermath', sourcePage: 399, requiresCanonicalConsequence: true }
    ]
  },
  {
    id: 'humble_squires', type: 'long_form', title: 'The Adventure of the Humble Squires', sourcePage: 'pp.399-409', sourcePages: [399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409],
    sourcePremise: { year: 767, role: 'squire', label: '원문 전제 · 767년 종자 캐릭터' },
    classification: 'fixed_adventure', integrations: ['skills', 'personality', 'hunt', 'combat', 'battle', 'economy', 'glory', 'standing', 'lifecycle', 'chronicle'], dependencies: ['chapter_18'],
    stages: [
      { id: 'setup', title: 'The Frankish Host', kind: 'setup', sourcePage: 399 },
      { id: 'mountain_dangers', title: 'A Perilous Mountain Journey', kind: 'table', tableId: '19-1', sourcePage: 401, repeat: { mode: 'participants', label: '각 Player-squire가 한 번' } },
      {
        id: 'white_deer', title: 'The White Deer', kind: 'subsystem', subsystem: 'hunt', sourcePage: 401,
        hunt: { segments: 4, segmentMinutes: 15, modifier: 2, prey: { name: 'White Deer', avoidance: 39, movement: 10, sourcePage: 401 } }
      },
      { id: 'rumors', title: 'The Lombard Alliance', kind: 'table', tableId: '19-2', sourcePage: 403 },
      { id: 'blessing', title: 'Archbishop Turpin\'s Blessing', kind: 'subsystem', subsystem: 'personality_magic', action: 'humble_blessing', sourcePage: 403, procedure: { kind: 'prayer', beneficiary: 'other_prayer' } },
      { id: 'battle_passion', title: 'Honor Against Love [Charlemagne]', kind: 'subsystem', subsystem: 'personality_magic', action: 'humble_passion_conflict', sourcePage: 404, optional: true },
      { id: 'rome_battle', title: 'The Battle of the Humble Squires', kind: 'subsystem', subsystem: 'battle', sourcePage: 403 },
      { id: 'battle_enemy', title: 'Squire Battle Rounds 1 and 2', kind: 'table', tableId: '19-3', sourcePage: 404, repeat: { mode: 'count', count: 2, label: '전투 1·2라운드의 상대' } },
      { id: 'third_round', title: 'Falseron and Morlant', kind: 'table', tableId: '19-4', sourcePage: 405 },
      { id: 'battle_choices', title: 'Prisoners, Plunder, and Captives', kind: 'player_choice', sourcePage: 405, options: ['free_prisoners', 'plunder', 'capture_pagan'] },
      { id: 'battle_choice_consequence', title: 'Prisoner, Plunder, or Captive Settlement', kind: 'consequence', sourcePage: 405, requiresCanonicalConsequence: true },
      { id: 'knighting', title: 'The Knighting Ceremony', kind: 'subsystem', subsystem: 'knighthood', sourcePage: 406 },
      { id: 'paladins', title: 'The Order of Paladins', kind: 'narrative', sourcePage: 406 },
      { id: 'mount_bitter', title: 'The Battle of Mount Bitter', kind: 'table', tableId: '19-5', sourcePage: 406, repeat: { mode: 'count', count: 5, sequence: true, label: '원문 1~5라운드 고정 사건' }, optional: true },
      { id: 'challenges', title: 'Chivalric Challenges', kind: 'subsystem', subsystem: 'combat', sourcePage: 406, dependency: 'chapter_18', optional: true },
      { id: 'prophetic_dream', title: 'The Prophetic Dream', kind: 'subsystem', subsystem: 'personality_magic', action: 'humble_dream', sourcePage: 407, optional: true, procedure: { kind: 'dream', passionKey: 'loveGod', messageSource: 'source', sourcePrompt: '귀족의 연회에서 춤추다 검은 뱀을 밟고 발목을 물리는 꿈.' } },
      { id: 'ambush', title: 'The Dishonorable Ambush', kind: 'subsystem', subsystem: 'combat', sourcePage: 408, dependency: 'chapter_18', optional: true },
      { id: 'rescue_attempt', title: 'Aumont Tower Rescue Attempt', kind: 'player_choice', sourcePage: 407, options: ['volunteer', 'ordered', 'do_not_participate'], optional: true },
      { id: 'mount_bitter_climb_roll', title: 'Mount Bitter Climb Danger', kind: 'player_choice', sourcePage: 407, options: ['swimming', 'climbing', 'con', 'str', 'energetic', 'temperate'], optional: true },
      { id: 'mount_bitter_climb_test', title: 'Mount Bitter Climb Test', kind: 'test', sourcePage: 407, tests: ['swimming', 'climbing', 'con', 'str', 'energetic', 'temperate'], optional: true },
      { id: 'floripas_trials', title: 'Princess Floripas’s Three Trials', kind: 'test', sourcePage: 408, tests: ['courtesy', 'dancing', 'eloquence', 'languages', 'playInstruments', 'romance', 'singing'], repeat: { mode: 'count', count: 3, unique: true, label: '각 Player-knight가 고른 서로 다른 세 과업' }, optional: true },
      { id: 'aumont_siege', title: 'Siege of Aumont’s Tower', kind: 'subsystem', subsystem: 'battle', battleType: 'siege', sourcePage: 408, optional: true },
      { id: 'final_duel', title: 'Ogier and Danemont’s Final Duel', kind: 'narrative', sourcePage: 408, optional: true },
      { id: 'aftermath', title: 'Glory and Conclusion', kind: 'aftermath', sourcePage: 409, requiresCanonicalConsequence: true }
    ]
  }
]);

export const CHAPTER_19_ADVENTURES = Object.freeze([
  ...CHAPTER_19_LONG_ADVENTURES,
  ...CHAPTER_19_SHORT_FORMS,
  ...CHAPTER_19_SOLOS
]);

export const CHAPTER_19_ADVENTURE_BY_ID = Object.freeze(Object.fromEntries(CHAPTER_19_ADVENTURES.map(item => [item.id, item])));

export const CHAPTER_19_OVERVIEWS = Object.freeze({
  jewel: '766년의 종자들이 성 마르키아누스 성유물을 운반하며 도적, 가난한 농민, 잔혹한 영주와 늑대 가죽의 비밀을 마주하는 입문 모험.',
  humble_squires: '767년 알프스 원정, 로마의 전투, 기사 서임, 팔라딘 기사단 창설까지 이어지는 종자들의 장편 모험.',
  adulterous_spouse: '오랜 부재 뒤 아내가 간통 혐의로 고발된 기사가 조사, 신명재판 또는 사법 결투로 유무죄를 가리는 사건.',
  angry_merchant: '정의를 돈보다 가볍게 여기는 백작의 법정에서, 상인으로 변장한 샤를마뉴와 도둑 기사 시굴프의 사건을 판결한다.',
  children_blue_heaven: '유대 상인이 희생된 도시 폭동 뒤 실종 아동과 포도주 거래를 조사하여 부패한 주교와 노예 상인의 범행을 밝힌다.',
  devils_bridge: '협곡과 이교도 군대 사이에 갇힌 군세가 악마의 다리, 이교도 거인, 불리한 전투 가운데 탈출로를 찾는다.',
  faerie_castle: '요정 성에 붙잡힌 기사들이 여섯 기술 시련과 일곱 미덕의 유혹을 견디며 시간의 함정에서 빠져나온다.',
  love_of_bayard: '부상당한 르노를 대신해 일주일 동안 변덕스럽고 위험한 명마 바야르를 먹이고 돌보고 편자를 박아 지킨다.',
  foreign_embassy: '외국 궁정으로 향한 사절단이 선물, 평화, 혼인, 서적, 몸값 등의 임무를 모욕과 결투 없이 성사시킨다.',
  greedy_abbot: '연례 시장 동안 수도원 보물을 지키고 절도단의 계획과 수도사들이 꾸민 거짓 기적을 밝혀낸다.',
  guarding_maugis: '마우지스를 지키며 그의 마법 가루와 탈출 계획, 추격과 전투 결과를 원문 순서로 처리한다.',
  love_conquers_all: '위험에 처한 연인들을 도와 비밀 연락과 세 가지 어려운 연애 과업을 완수하게 한다.',
  melancholic_paladin: '고립된 숲에서 우울 또는 광기에 빠진 팔라딘을 찾아 죽이지 않고 제압하거나 회복시킨다.',
  miracle_truth: '기적과 증언을 둘러싼 분쟁에서 거짓과 진실을 가리고 판결과 신앙의 결과를 기록한다.',
  noble_hostage: '귀족 인질의 정체와 혐의를 조사하고 몸값, 보호, 전투 또는 석방의 결과를 결정한다.',
  pagan_lady: '이교도 귀부인과의 관계에서 신앙, Honor, Romance의 요구와 가족의 반대를 처리한다.',
  pagan_prison: '이교도 감옥에서 몸값, 굴 파기, 구원군 공성, 거인과의 결투, 공주의 도움 중 원문 탈출책을 실행한다.',
  rebellious_baron: '적대적인 귀족의 영지에 최후통첩을 전달하고 무장 해제, 모욕, 잠입, 결투의 위험을 넘겨 답신을 얻는다.',
  small_knight: '위험한 토너먼트에서 베르타, 갈레란, 복수심에 찬 작은 기사 알릭스의 비극적 갈등을 다룬다.',
  wrathful_lord: '주군의 불명예스러운 암살 명령을 따르거나 거부하고 추격, 충격, 결투 또는 평화적 해결을 감당한다.',
  challenges: '한 달 동안 길목을 지키며 도로 교통량과 기사 품질 표로 상대를 정하고 Chapter 7 마상시합을 반복한다.',
  feud: '친족을 소집하고 정찰한 뒤 Feuding Enemies 결과에 따라 Chapter 8 또는 개인 결투로 가문의 사적 전쟁을 처리한다.',
  forest: '매일 Lost in the Woods를 굴려 20이 나올 때까지 조우, 장원, 적대 생물, 포획과 몸값을 처리한다.',
  holy_lands: '왕복 선박 비용을 지불하고 여행 사건, 매년 성지 사건, 귀환 사건을 거치는 최소 2년 절차.',
  hunt: '계절별 segment 안에서 Search, Chase, 장애물, 먹잇감, 기습과 Chapter 7 전투를 진행하는 공용 사냥 절차.',
  wild_hunt: '사냥 중 폭풍과 Wild Hunt에 휘말린 기사가 Madness 행동, 성격 변화, 회복 판정을 연도별로 처리한다.',
  mallus: '영주 기사가 원고와 피고, 서약 증인, 뇌물, Just/Arbitrary 판결을 거쳐 귀족 법정 사건을 심리한다.',
  missus_dominicus: '샤를마뉴의 감찰사로서 백작령의 접대와 행정을 여섯 기술로 검사하고 보고서와 뇌물 결과를 확정한다.',
  pilgrimage: '겸손한 고행과 기부를 정한 뒤 왕복 두 번의 순례 조우와 안전 귀환의 종교적 결과를 처리한다.',
  romance: '사랑 선언, 상대의 잠재 Amor와 Reluctance, 해마다 선물과 과업, essai, 비밀 유지와 발각을 장기 상태로 기록한다.',
  royal_court: 'Standing으로 왕실 입장을 판정하고 선물 교환, 궁정 생활, 정치, 연애와 세 가지 경연을 처리한다.',
  tournament: 'Helm Show 뒤 마상시합, 도전, melee를 Chapter 7로 수행하고 대회 규모와 무기 조건에 맞는 Glory를 받는다.',
  vassal_service: '주군과 선물을 교환하고 중복 없는 세 가지 봉신 근무 사건과 궁정 생활의 체크와 Glory를 처리한다.',
  manor: '매년 주군 방문, 영지 검토, 두 당사자의 재판, 사냥, 미신 사건을 장원과 Standing 상태에 반영한다.'
});

export const CHAPTER_19_EXTERNAL_DEPENDENCIES = Object.freeze([
  { id: 'chapter_1_lifecycle', chapter: 1, rule: 'Knighthood ceremony and Frankish Birth Gift', current: 'canonical lifecycle/creation bridge', blocking: false },
  { id: 'chapter_3', chapter: 3, rule: 'Passion shock, melancholy, madness', current: 'canonical Personality/Magic engine', blocking: false },
  { id: 'chapter_3_9_amor', chapter: '3/9', rule: 'Amor and Love [Amor]', current: 'canonical long-term Amor state', blocking: false },
  { id: 'chapter_9', chapter: 9, rule: 'Miracles, relics, and religious consequences', current: 'canonical prayer resolver plus explicit GM miracle decision', blocking: false },
  { id: 'chapter_10', chapter: 10, rule: 'Aging and pregnancy', current: 'Winter engine hand-off', blocking: false },
  { id: 'chapter_11', chapter: 11, rule: 'Missus dominicus office and duties', current: 'source reference plus GM confirmation', blocking: false },
  { id: 'chapter_12', chapter: 12, rule: 'Economy, ransom, treasure, gifts', current: 'Economy v2', blocking: false },
  { id: 'chapter_13', chapter: 13, rule: 'Hunting context and paladin society', current: 'Chapter 19 hunt plus source dependency record', blocking: false },
  { id: 'chapter_18', chapter: 18, rule: 'Opponent and creature statistics and abilities', current: 'canonical registry, Chapter 7 adapter, special consequence and return', blocking: false },
  { id: 'chases', chapter: 19, rule: 'Chases and pursuits', current: 'Chapter 19 procedure record', blocking: false }
]);
