/**
 * Carolingian Lore Database for Paladin Companion.
 * Contains detailed historical facts about the 8 Great Families and 15 Solo Scenarios.
 */

export const greatFamilies = [
  {
    key: "arnulfings",
    nameEN: "House of the Arnulfings (Carolingians)",
    nameKO: "아르눌프 가문 (카롤링거 왕가)",
    mottoEN: "By the Grace of God, We Reign",
    mottoKO: "신의 은총으로, 우리는 지배하노라",
    crestSymbol: "⚜️👑🦅",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Attributed_Arms_of_Charlemagne.svg/250px-Attributed_Arms_of_Charlemagne.svg.png",
    backgroundEN: "The ruling dynasty of the Franks, founded by Pepin of Herstal and Charles Martel, culminating in the reign of Charlemagne. They are the defenders of the Christian faith and the creators of the Holy Roman Empire.",
    backgroundKO: "헤르스탈의 피핀과 샤를 마르텔에 의해 기틀이 세워지고 샤를마뉴 대제에 이르러 만개한 프랑크 제국의 집권 왕조입니다. 기독교 신앙의 가장 든든한 수호자이자, 장엄한 신성로마제국의 창설자 가문입니다.",
    traitsEN: "Highly proud, pious, and born to rule. They value absolute loyalty to the Crown.",
    traitsKO: "극도로 높은 자부심, 강렬한 종교적 경건함, 지배자로 태어난 타고난 위엄을 지니고 있습니다. 왕관에 대한 절대적 충성을 가장 무겁게 여깁니다.",
    crestDescEN: "Gules, an imperial eagle displayed or, beak and talons azure.",
    crestDescKO: "붉은 바탕에 황금색 제국 독수리, 파란색 부리와 발톱."
  },
  {
    key: "ardennes",
    nameEN: "House of Ardennes",
    nameKO: "아르덴 가문 (숲의 수호자)",
    mottoEN: "Strong as the Oak, Silent as the Forest",
    mottoKO: "참나무처럼 굳건하게, 숲처럼 침묵 속에",
    crestSymbol: "🐗🌳🛡️",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Blason_d%C3%A9partement_fr_Ardennes.svg/250px-Blason_d%C3%A9partement_fr_Ardennes.svg.png",
    backgroundEN: "Lords of the vast and mysterious Ardennes forest. They are ancient, hardy, and possess deep connections to the land and folklore, often guarding the borders against dangerous incursions.",
    backgroundKO: "광활하고 신비로운 아르덴의 대삼림을 지배하는 영주들입니다. 매우 고결하고 강인한 기질을 가지고 있으며, 영지와 지역 민간 전설에 깊은 연관을 맺고 있습니다. 제국의 국경을 침범하는 이교도들의 습격에 항상 선봉에 봅니다.",
    traitsEN: "Highly prudent and patient. Deeply knowledgeable in folklore and faerie lore.",
    traitsKO: "신중함과 끈질긴 인내심이 돋보입니다. 숲속에 잠든 민간 요정 전설과 조상들의 전통 지식에 매우 박식합니다.",
    crestDescEN: "Argent, a wild boar rampant sable, armed gules.",
    crestDescKO: "은색 바탕에 포효하는 검은색 야생 멧돼지, 붉은 이빨과 발톱."
  },
  {
    key: "monglane",
    nameEN: "House of Monglane (The Narbonnais)",
    nameKO: "몽글란 가문 (나르본의 용사들)",
    mottoEN: "First in the Breach, Last to Retreat",
    mottoKO: "돌격할 때 선봉에, 퇴각할 때 후방에",
    crestSymbol: "🗡️🏰🌅",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Blason_ville_fr_Narbonne.svg/250px-Blason_ville_fr_Narbonne.svg.png",
    backgroundEN: "Founded by the legendary Sir Garin of Monglane, this house is famous for producing highly valorous and hot-tempered knights who govern the southern marches against Saracen invasions. William of Orange is their most famous scion.",
    backgroundKO: "전설적인 기사 가린 경에 의해 수립된 가문으로, 피레네 국경선 너머 에스파냐 사라센 제국의 침략에 대항해 남부 변방을 사수하는 용맹무쌍하고 불같은 성정의 전사들을 끝없이 배출한 가문입니다. 오렌지의 기욤이 이 가문의 가장 영광스러운 후손입니다.",
    traitsEN: "Extremely valorous, honest, and vengeful against pagans. Renowned for massive physical size and combat prowess.",
    traitsKO: "극단적으로 용맹하고 타협이 없는 정직함을 지녔으며, 이교도에 대한 끓어오르는 증오를 품고 있습니다. 압도적인 체구와 전장의 분쇄 능력을 자랑합니다.",
    crestDescEN: "Azure, a tower triple-towered argent, overlooking a sea gules.",
    crestDescKO: "푸른 바탕에 은색의 3중 성탑, 아래로는 붉게 물든 바다."
  },
  {
    key: "mayence",
    nameEN: "House of Mayence (The Traitors)",
    nameKO: "마옌스 가문 (반역과 음모의 혈통)",
    mottoEN: "Shadows Guide Our Steel",
    mottoKO: "그림자가 우리의 검을 인도하리라",
    crestSymbol: "🐍🗝️🍷",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Coat_of_arms_of_Mainz.svg/250px-Coat_of_arms_of_Mainz.svg.png",
    backgroundEN: "A powerful and wealthy house cursed with a reputation for intrigue, pride, and betrayal. Ganelon, the betrayer of Roland at Roncevaux, belongs to this house. They hold great sway at Charlemagne's court through whispers.",
    backgroundKO: "막대한 부와 교묘한 지혜를 지녔으나, 음모와 반역의 어두운 오명을 짊어진 가문입니다. 론세스바예스 고개에서 롤랑을 배신하여 비극적 종말을 불러온 가늘롱 백작이 바로 이 가문 출신입니다. 왕궁에서 조용한 귓속말과 은밀한 연대를 통해 막강한 영향력을 발휘합니다.",
    traitsEN: "Highly deceitful, proud, and experts in intrigue and politics. Often harbor deep grudges.",
    traitsKO: "대단히 기만적이고 오만하며, 음모와 사교계의 정치 공작에 비할 바 없는 달인들입니다. 한 번 품은 원한은 대를 이어 갚습니다.",
    crestDescEN: "Or, three serpents coiling sable, crowned and langued gules.",
    crestDescKO: "황금색 바탕에 서로 휘감긴 세 마리의 검은 독사, 붉은 왕관과 튀어나온 혀."
  },
  {
    key: "agilolfings",
    nameEN: "House of the Agilolfings (Bavaria and Denmark)",
    nameKO: "아길롤핑 가문 (바이에른과 덴마크의 혼혈)",
    mottoEN: "Between the North Sea and the Alps",
    mottoKO: "북해의 파도와 알프스의 만년설 사이에서",
    crestSymbol: "❄️🛡️🌊",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Coat_of_arms_of_Bavaria.svg/250px-Coat_of_arms_of_Bavaria.svg.png",
    backgroundEN: "An ancient and noble ducal family of Bavaria, tightly intertwined with Danish royalty. Ogier the Dane is closely associated with this house. They have struggled with Charlemagne for autonomy, leading to the dramatic fall of Duke Tassilo.",
    backgroundKO: "바이에른의 유서 깊은 공작가이자 북방 덴마크 왕가와 피로 얽힌 거대 가문입니다. 덴마크인 오지에 경이 이 혈통과 깊은 연대를 맺고 있습니다. 바이에른의 독립성을 지키기 위해 샤를마뉴 대제와 수차례 격렬한 힘겨루기를 펼쳤으며, 타실로 공작의 몰락으로 비장한 역사를 가졌습니다.",
    traitsEN: "Proud and independent-minded, yet fiercely loyal to brothers-in-arms.",
    traitsKO: "자주적인 독립 정신이 매우 강하고 오만하지만, 한 번 맺은 형제 기사의 맹세에는 목숨을 바쳐 든든하게 응합니다.",
    crestDescEN: "Per pale, azure a crescent argent, and gules a lion rampant or.",
    crestDescKO: "좌우 분할, 왼쪽은 파란 바탕에 은색 초승달, 오른쪽은 붉은 바탕에 황금 사자."
  },
  {
    key: "aigremont",
    nameEN: "House of Aigremont / Clermont (The Aymonides)",
    nameKO: "에그레몽 가문 (에몽 백작의 자손들)",
    mottoEN: "Unbowed, Unconquered",
    mottoKO: "무릎 꿇지 않으며, 정복당하지 않는다",
    crestSymbol: "🐎⛰️🔥",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Blason_ville_fr_Montauban_%28Tarn-et-Garonne%29.svg/250px-Blason_ville_fr_Montauban_%28Tarn-et-Garonne%29.svg.png",
    backgroundEN: "A house famous for their legendary rebellions and fierce independence. Duke Beuves of Aigremont and Count Aymon's four sons (Renaud of Montauban and his brothers) who rode the magic horse Bayard are the legends of this lineage.",
    backgroundKO: "역사상 가장 전설적인 반란과 꺾이지 않는 투지로 유명한 가문입니다. 에그레몽의 보브 공작과, 전설적인 마법마 바야르(Bayard)를 함께 타고 어전에 저항한 에몽 백작의 네 아들(몽토방의 르노와 형제들)이 이 가문의 신화입니다.",
    traitsEN: "Extremely valorous, independent, forgiving to family, and possessing high hospitality.",
    traitsKO: "대단히 용맹스럽고 독립적이며, 자기 혈육에 대해서는 한없이 관대하고 타인에게는 환대를 아끼지 않는 영웅적인 면모를 보입니다.",
    crestDescEN: "Gules, a four-headed horse rampant argent, on a chief azure three mullets or.",
    crestDescKO: "붉은 바탕에 기어오르는 네 개의 머리를 가진 은색 말, 파란색 상단부에는 세 개의 황금색 별."
  },
  {
    key: "doon_mayence",
    nameEN: "House of Doon de Mayence",
    nameKO: "둔 드 마옌스 가문 (원로 전사들의 가계)",
    mottoEN: "Honor Carved in Battle-Worn Iron",
    mottoKO: "닳아 헤진 강철 위에 새겨진 명예",
    crestSymbol: "⚒️⚔️🦅",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Blason_ville_fr_Bujaleuf_%28Haute-Vienne%29.svg/250px-Blason_ville_fr_Bujaleuf_%28Haute-Vienne%29.svg.png",
    backgroundEN: "An ancient branch of knights who pioneered the early expansion of the Frankish Kingdom. Famous for producing rugged, giant-killing warriors who favor axes and heavy combat over courtly refinements.",
    backgroundKO: "프랑크 왕국의 초창기 영토 확장을 개척한 고참 전사 기사들의 유서 깊은 방계 혈통입니다. 궁정의 화려함보다는 거친 전장의 도끼질과 무거운 갑옷을 사랑하며, 거인을 사냥하는 괴력의 전사들을 다수 탄생시켰습니다.",
    traitsEN: "Highly energetic, valorous, arbitrary, and possessing huge physical size. They disregard court etiquette.",
    traitsKO: "열정적이고 용맹하며, 독단적인 결단을 내리는 거침없는 성격을 보여줍니다. 대단히 강인한 신체를 지녔으며 귀찮은 에티켓은 경시하는 경향이 있습니다.",
    crestDescEN: "Sable, a double-headed axe argent between two wings expanded or.",
    crestDescKO: "검은 바탕에 은색의 양날 도끼, 양옆에는 날개를 펼친 황금색 독수리 날개."
  },
  {
    key: "nanteuil",
    nameEN: "House of Nanteuil",
    nameKO: "낭퇴유 가문 (법률과 행정의 명문)",
    mottoEN: "Justice and the Written Word",
    mottoKO: "정의와 기록된 율법",
    crestSymbol: "⚖️📜🖋️",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Blason_Nanteuil-le-Haudouin.svg/250px-Blason_Nanteuil-le-Haudouin.svg.png",
    backgroundEN: "A highly educated house of knights who often serve as judges, counselors, and counts of royal administration. They value the rule of law, peace, and the restoration of learning in Charlemagne's Carolingian Renaissance.",
    backgroundKO: "매우 높은 교육수준을 자랑하는 명망가로, 황제 곁에서 고문관, 사법 재판관, 세무 백작 등의 핵심 관직을 지켰습니다. 법치주의, 제국의 평화, 샤를마뉴 대제의 '카롤링거 르네상스' 율법 학문 부흥에 열렬히 동참한 가문입니다.",
    traitsEN: "Highly just, honest, and literate. Possess high stewardship and courtesy.",
    traitsKO: "정의로움과 타오르는 정직함이 돋보이며, 문해력을 갖춘 보기 드문 지식인들입니다. 영지 관리와 예법 기술의 정수를 보여줍니다.",
    crestDescEN: "Argent, a balance held by a hand vested gules, issuing from a cloud azure.",
    crestDescKO: "은색 바탕에 푸른 구름 속에서 나타나 저울을 들고 있는 붉은 소매의 사법의 손."
  }
];

export const soloScenarios = [
  {
    key: "crossroad",
    name: "교차로 조우 (Crossroad Encounters)",
    flow: [
      "1. d20을 굴려 만남의 대상을 결정합니다.",
      "2. 1~5: 피로에 지친 순례자 (First Aid 또는 Stewardship으로 자선 베풀기 → 성향/영예 보너스)",
      "3. 6~10: 불한당들에게 괴롭힘당하는 농민 (Awareness/Battle로 위기 감지 후 무력 제압 → 평판 상승)",
      "4. 11~15: 급히 연서나 기밀 밀서를 전달하는 젊은 종자 (Intrigue/Courtesy로 호의 획득)",
      "5. 16~19: 다리를 사수하며 명예 결투를 요구하는 통행세 징수 라이벌 기사 (마상 창시합 전개)",
      "6. 20: 신비로운 숲속 요정의 환영 성곽 출현 (Faerie Lore 판정 실패 시 정신적 미혹)"
    ],
    rules: "모험을 떠나는 중 예기치 못한 인물들과 만나 기사의 도덕과 가치관을 시험하는 핵심 1인 판정 이벤트입니다."
  },
  {
    key: "joust",
    name: "마상 창시합 (The Jousts)",
    flow: [
      "1. 두 기사 모두 마창(Lance) 기술로 대립 d20 주사위를 굴립니다.",
      "2. 결과를 대조합니다: 대성공 vs 성공, 성공 vs 실패 등",
      "3. 승리한 기사가 말의 돌격 피해 주사위(예: Chargers의 4d6)를 굴려 상대에게 가합니다.",
      "4. 단일 타격 피해가 적의 체구(SIZ)를 초과하면 상대 기사는 즉시 낙마(Knockdown)합니다.",
      "5. 낙마 시 CON 판정을 통해 기절이나 부상 여부를 결정하고, 낙마한 기사는 검을 뽑아 지상 결투로 전환합니다."
    ],
    rules: "축제나 토너먼트, 또는 영지 결투에서 라이벌 기사와 벌이는 중세 최고의 기마 마창 시합 공식 메카닉입니다."
  },
  {
    key: "feud",
    name: "가문의 피빛 불화 (The Feud)",
    flow: [
      "1. 친족 소집: '가족에 대한 사랑' 성향 판정에 성공해야 사촌과 형제 기사들을 무장 소집할 수 있습니다.",
      "2. 흔적 추적: 수렵(Hunting)이나 경계(Awareness)를 굴려 라이벌 가문 무리의 야영지를 포착합니다.",
      "3. 협상 혹은 대면: 대립하는 가문 대표에게 명예로운 은화 배상금을 요구하거나, 거절 시 습격을 가합니다.",
      "4. 전술(Battle) 판정을 굴려 습격 전투의 기습 이점을 계산하고 백병전을 전개합니다."
    ],
    rules: "가문의 복수극을 다루는 장기 퀘스트입니다. 실패 시 가문의 불화가 'Festering Feud' 상태로 겨울 단계마다 터집니다."
  },
  {
    key: "forest",
    name: "아르덴 요정 숲 조난 (Lost In The Woods)",
    flow: [
      "1. 길 찾기: 수렵(Hunting)이나 요정 전설(Faerie Lore)을 굴려 신비의 숲 속에서 올바른 방향을 잡습니다.",
      "2. 실패 시: 숲에서 방황하며 매일 1d6의 소중한 시간이 낭비되고, 매일 밤 숲 조우 표를 굴립니다.",
      "3. 대실패 시: 시간 관념이 붕괴되는 요정의 마법(Faerie Glamour)에 빠져 1d20년 동안 실종 처리됩니다."
    ],
    rules: "아키텐이나 북방 아르덴 삼림 등 요정의 힘이 잔존하는 숲을 통과할 때 적용되는 위기 해결 규칙입니다."
  },
  {
    key: "holylands",
    name: "성지 순례 전역 (The Holy Lands)",
    flow: [
      "1. 바다 항해: CON 판정을 굴려 지독한 배멀미와 전염병을 버텨냅니다.",
      "2. 예루살렘 도착: 신에 대한 사랑(Love [God]) 및 경건(Pious) 판정으로 성지 예배를 올립니다.",
      "3. 사라센 적 조우: 십자군 성전 전사로서 이교도 매복 무리와 싸워 승리해야 무사히 복귀합니다.",
      "4. 복귀 시 100 Glory 및 Standing [Church] +3 획득."
    ],
    rules: "속죄나 신앙 증명을 위해 머나먼 지중해를 건너 예루살렘으로 순례를 떠나는 장대한 장기 정산 솔로 규칙입니다."
  },
  {
    key: "hunt",
    name: "야생마 및 명수 사냥 (The Hunt)",
    flow: [
      "1. 추적 단계: 사냥개와 종자들을 부리며 수렵(Hunting) 기술로 적을 쫓습니다.",
      "2. 추격 단계: 마술(Horsemanship) 판정으로 위험한 협곡과 덤불을 뛰어넘습니다.",
      "3. 사살 단계: 거대한 수멧돼지나 적대 동물이 덮칠 때 무기나 Spear로 대립 판정을 벌여 적을 즉사시킵니다.",
      "4. 사냥 대성공 시 고급 가죽을 획득하여 £1d6의 캐시나 lord에게 상납하여 Standing 보너스를 얻습니다."
    ],
    rules: "귀족들의 레저이자 전술 훈련인 사냥 규칙입니다. 대실패 시 사냥물에 받혀 치명상(Major Wound)을 입습니다."
  },
  {
    key: "madness",
    name: "기사의 광증 (Madness)",
    flow: [
      "1. 정신 붕괴: 사랑하는 연인을 잃거나 극심한 불도덕을 저질렀을 때 열망 판정 실패로 실성 상태가 됩니다.",
      "2. 방랑 생활: 모든 갑옷과 무기를 버리고 알몸으로 아르덴 숲을 방랑하며 야생 짐승처럼 울부짖습니다.",
      "3. 정신 회복: 매 겨울 정산 단계마다 CON 판정을 굴려 성공하거나, 성자나 연인의 따스한 포옹으로 치료됩니다.",
      "4. 광증 극복 시 지혜를 얻어 신중(Prudent)이 +1 영구 증가합니다."
    ],
    rules: "팔라딘 서사시의 고전적 테마인 '광기 어린 방랑'을 게임 엔진에 구현한 독특한 룰입니다."
  },
  {
    key: "mallus",
    name: "제국 사법 의회 (The Mallus)",
    flow: [
      "1. 억울한 고발 접수: 영지 농민이나 이웃 기사에게 영토 경계선 무단 침범 혐의로 제소당합니다.",
      "2. 배심원 증언: 정의(Just) 및 정직(Honest) 판정으로 배심원들 앞에서 엄숙한 결백 연설을 합니다.",
      "3. 판결 강행: 실패 시 사법 재판관 백작에게 거액의 배상금 벌금(£1d6)을 물거나 기결 처분을 받습니다."
    ],
    rules: "Carolingian 법정 제도를 체험할 수 있는 솔로 시나리오로, 평화적 정의 구현을 시험합니다."
  },
  {
    key: "missus",
    name: "순찰사 감찰관 영접 (Missus Dominicus)",
    flow: [
      "1. 감찰관 영접 준비: 영지 관리(Stewardship)를 굴려 식량을 비축하고 영지 세금 장부를 정리합니다.",
      "2. 예법 검사: 백작 예하 감찰관 앞에서 예의(Courtesy)를 굴려 완벽한 격식으로 알현합니다.",
      "3. 부패 폭로 위기: 감찰관이 음모(Intrigue) 판정으로 영지의 비리를 캐낼 때, 높은 평판으로 방어합니다.",
      "4. 대성공 시 샤를마뉴 황제의 친필 감사장과 Standing [Charlemagne] +2 획득."
    ],
    rules: "중앙 집권적 관료들이 지방 영지를 감시하러 파견되었을 때 영주 기사가 겪는 긴장감 넘치는 정치 판정입니다."
  },
  {
    key: "pilgrimage",
    name: "고해성사 순례 (The Pilgrimage)",
    flow: [
      "1. 육체적 고행: 무거운 고행 도구를 매고 경건(Pious) 판정으로 고행 길에 오릅니다.",
      "2. 자선 헌금: 수도원장에게 £1 상당의 헌금을 상납합니다.",
      "3. 고통 감내: 매일 d20을 굴려 영혼의 정화 판정을 진행합니다.",
      "4. 보상: 죄의 사함을 얻고 불명예 흉터가 지워집니다."
    ],
    rules: "겨울 단계 16번 결과 등 교회 세력과의 불화나 도덕적 파탄을 해결하기 위해 떠나는 고해 신앙 규칙입니다."
  },
  {
    key: "romance",
    name: "궁정식 구애의 시련 (Romance)",
    flow: [
      "1. 사랑의 선언: 웅변(Eloquence)이나 무용(Dancing)을 성공시켜 lady의 마음에 조용한 파도를 일으킵니다.",
      "2. 귀부인의 거절 극복: lady가 부여하는 영웅적인 결투 퀘스트(Essai)를 전장에서 직접 달성해야 합니다.",
      "3. 시련 돌파 시: Amor [Lady] 열망이 16점으로 활성화되며, 평생의 구애를 승인받아 가문을 맺습니다."
    ],
    rules: "귀부인에 대한 로맨틱한 구애와 기사로서의 품격을 조율하며 사랑의 완성으로 나아가는 과정입니다."
  },
  {
    key: "court",
    name: "왕실 가을 어전 회의 (The Royal Court)",
    flow: [
      "1. 황제 알현: 예의(Courtesy)를 굴려 품위 있는 귀족 기사의 격식을 뽐냅니다.",
      "2. 정적과의 설전: 웅변(Eloquence)이나 음모(Intrigue)로 어전 토론회에서 라이벌의 궤변을 제압합니다.",
      "3. 황제의 하사품: Standing [Charlemagne] d20 성공 시 황제가 직속 검이나 명장을 하사합니다."
    ],
    rules: "아헨 왕궁에서 펼쳐지는 정치 공작과 우아한 사교 모임에 참여할 때 쓰이는 규칙입니다."
  },
  {
    key: "tournament",
    name: "대토너먼트 축제 (The Tournament)",
    flow: [
      "1. 투구 전시대 열람: 문장학(Heraldry)을 굴려 출전한 기사들의 가문 성씨와 전적을 파악합니다.",
      "2. 예선 마상 시합: 마창(Lance) 기술로 라이벌들을 물리치고 결선 Melee에 진출합니다.",
      "3. 단체 백병전(Melee): Battle 기술을 굴려 우군 기사들과 대열을 짜고 모의 칼부림을 벌여 승리합니다.",
      "4. 보상: 우승 시 500 Glory와 황금 트로피, lady들의 찬사를 받습니다."
    ],
    rules: "평화 기에 전유럽 기사들이 무공과 영예를 한 자리에서 다투는 화려한 대규모 스포츠 축제 규칙입니다."
  },
  {
    key: "vassal",
    name: "봉신 기사의 군역 의무 (Vassal Service)",
    flow: [
      "1. 기사 징집 Summons: 주군의 부름에 수렵/전투마를 타고 만반의 무장을 갖춰 즉각 소집에 응합니다.",
      "2. 진지 구축 보초: 전술(Battle)이나 경계(Awareness)를 굴려 밤샘 야영 중 이교도의 야습을 예방합니다.",
      "3. 주군 엄호: 전장에서 주군이 위기에 처했을 때 몸을 던져 검(Sword) 대립 판정으로 사수합니다."
    ],
    rules: "vassal 기사로서 매년 거칠게 감당해야 하는 40일간의 주군 징집 의무 전역의 모험 판정입니다."
  },
  {
    key: "manor",
    name: "기사의 장원 관리 (Your Manor)",
    flow: [
      "1. 경계 획정 분쟁: 이웃 영주와 물줄기 지배권을 두고 다툴 때 Stewardship으로 소송을 준비합니다.",
      "2. 풍작 기우제: 민간 전설(Folk Lore)을 활용해 영지 농민들의 가뭄 불안 심리를 다독입니다.",
      "3. 법 집행: 영지 장원에서 절도나 죄를 지은 범죄자들을 Just 판정으로 처벌하여 치안을 유지합니다."
    ],
    rules: "vassal 기사들이 평시에 자신의 영지(Manor)를 직접 관리하고 보살필 때 발생하는 경영 판정입니다."
  }
];

export const gazetteer = [
  {
    key: "ardennes",
    emoji: "🌲",
    nameKO: "아르덴 대삼림 (Ardennes)",
    nameEN: "The Forest of Ardennes",
    rulerKO: "티에리 공작 (Duke Thierry)",
    rulerEN: "Duke Thierry",
    passionKO: "가족에 대한 사랑 (Love [Family]) 15점",
    passionEN: "Love (Family) 15",
    modifiers: [
      { name: "영지 관리 (Stewardship)", value: "+2" },
      { name: "수렵 (Hunting)", value: "+3" },
      { name: "요정 전설 (Faerie Lore)", value: "+5" }
    ],
    historyKO: "벨기에와 프랑스 국경 지대에 넓게 뻗어 있는, 울창하고 신비로운 원시림입니다. 고대 켈트 요정 전설의 힘이 여전히 숲의 안개 속에 깃들어 있으며, 성난 수멧돼지와 거인들이 서식합니다. 숲의 수호자 기질을 지닌 강인한 기사들이 이 영토를 사수합니다.",
    historyEN: "A vast, ancient forest spanning the borderlands. It is deeply connected to ancient faerie folklore, harboring dangerous beasts and mysterious ruins. Its knights are rugged and deeply bound to their ancestral lands."
  },
  {
    key: "aquitaine",
    emoji: "🍇",
    nameKO: "아키텐 공국 (Aquitaine)",
    nameEN: "The Duchy of Aquitaine",
    rulerKO: "바이페르 공작 (Duke Waifer)",
    rulerEN: "Duke Waifer",
    passionKO: "주군에 대한 충성 (Loyalty [Lord]) 15점",
    passionEN: "Loyalty (Lord) 15",
    modifiers: [
      { name: "연애예법 (Romance)", value: "+3" },
      { name: "마술 (Horsemanship)", value: "+2" },
      { name: "예의 (Courtesy)", value: "+3" }
    ],
    historyKO: "프랑크 제국 남서부의 풍요롭고 따뜻한 농경 구릉지입니다. 로마 시대의 찬란한 문화가 깊이 남아 있으며, 음유시인의 사랑 노래와 화려한 궁정 구애(Courtly Love) 문화가 가장 먼저 꽃피어난 기사도의 정수와 같은 예술의 고장입니다.",
    historyEN: "A rich and sunny southern land characterized by Roman heritage and rolling hills. It is the cradle of troubadours, courtly love, and refined horsemanship, displaying the elegant side of chivalry."
  },
  {
    key: "saxony",
    emoji: "🛡️",
    nameKO: "작센 공국 (Saxony)",
    nameEN: "The Duchy of Saxony",
    rulerKO: "비두킨트 공작 (Duke Widukind)",
    rulerEN: "Duke Widukind",
    passionKO: "프랑크인에 대한 증오 (Hate [Franks]) 15점 (또는 작센인에 대한 증오 15점)",
    passionEN: "Hate (Franks) 15 or Hate (Saxons) 15",
    modifiers: [
      { name: "전술 (Battle)", value: "+3" },
      { name: "창/도끼 (Spear/Axe)", value: "+2" },
      { name: "경계 (Awareness)", value: "+2" }
    ],
    historyKO: "독일 북부의 거친 밀림과 수렁이 가득한 제국의 새로운 정복지입니다. 샤를마뉴의 30년 작센 전쟁이 벌어진 피비린내 나는 전장이며, 이교도 작센인들의 강력한 민간 저항과 기습 공격이 빈발하여 언제나 전운이 감도는 삼엄한 국경지대입니다.",
    historyEN: "A wild and rugged region in the north, newly annexed after decades of bitter warfare. It is a land of dense marshes, pagan resistance led by Widukind, and constant border patrols."
  },
  {
    key: "zaragoza",
    emoji: "🕌",
    nameKO: "사라고사 토후국 (Zaragoza)",
    nameEN: "The Emirate of Zaragoza",
    rulerKO: "마르실 토후 (Emir Marsile)",
    rulerEN: "Emir Marsile",
    passionKO: "기독교인에 대한 증오 (Hate [Christians]) 15점 (또는 이교도에 대한 증오 15점)",
    passionEN: "Hate (Christians) 15 or Hate (Pagans) 15",
    modifiers: [
      { name: "음모 (Intrigue)", value: "+3" },
      { name: "사라센 검술 (Scimitar)", value: "+2" },
      { name: "사막 생존 (Awareness)", value: "+3" }
    ],
    historyKO: "피레네 산맥 남쪽 에스파냐 영토에 위치한 거대 이슬람 관문 도시이자 성채 토후국입니다. 마르실 토후의 치세 아래 찬란한 아랍 과학과 군사력이 집결해 있으며, 론세스바예스의 롤랑 배신 공작이 수립된 역사의 도가니입니다.",
    historyEN: "A powerful Islamic stronghold south of the Pyrenees. Under Emir Marsile, it represents the highly sophisticated Andalusian civilization, standing as the main rival and source of intrigue for Charlemagne's paladins."
  },
  {
    key: "rome",
    emoji: "🏛️",
    nameKO: "로마 교황령 (Rome)",
    nameEN: "The Papal States of Rome",
    rulerKO: "교황 레오 3세 (Pope Leo III)",
    rulerEN: "Pope Leo III",
    passionKO: "신에 대한 사랑 (Love [God]) 15점",
    passionEN: "Love (God) 15",
    modifiers: [
      { name: "경건 (Pious)", value: "+3" },
      { name: "문해력 (Read/Write)", value: "+5" },
      { name: "종교 지식 (Religion)", value: "+3" }
    ],
    historyKO: "유럽 역사와 가톨릭 신앙의 영원한 수도입니다. 800년 크리스마스 날, 교황 레오 3세가 샤를마뉴에게 서로마 제국 황제의 왕관을 씌워 준 종교적 신성함의 원천이자, 라틴 교양과 사법 문해력의 중심지입니다.",
    historyEN: "The eternal city and the spiritual heart of the West. It is where Pope Leo III crowned Charlemagne as Emperor, serving as a bastion of ancient scholarship, divine miracles, and holy law."
  }
];

export const bestiary = [
  {
    key: "giant_boar",
    emoji: "🐗",
    nameKO: "아르덴 거대 수멧돼지 (Ardennes Giant Boar)",
    nameEN: "Ardennes Giant Boar",
    category: "야수 (Beast)",
    stats: { STR: 32, CON: 22, SIZ: 35, DEX: 11, HP: 29, Armor: 6, Damage: "6d6" },
    specialRules: [
      { title: "분노의 돌격 (Furious Charge)", desc: "멧돼지가 첫 돌격을 가할 때, 상대 기사는 마술(Horsemanship) 혹은 SIZ 대립 판정을 굴려야 합니다. 실패 시 즉시 낙마(Knockdown)하며 1d6의 추가 마찰 관통 피해를 받습니다." },
      { title: "질긴 가죽 (Thick Hide)", desc: "지방과 두터운 털로 덮여 있어, 일반 화살이나 투척 무기로 가하는 원거리 피해는 아머 수치가 10으로 취급됩니다." }
    ],
    loreKO: "아르덴 숲 깊은 곳에서 이끼 낀 거목 아래 서식하는 전설적인 괴수입니다. 일반 수멧돼지의 4배에 달하는 거구와 강철 같은 강도의 어금니를 가지고 있어, 어설픈 사냥꾼의 뼈와 갑옷을 통째로 으스러뜨립니다.",
    loreEN: "A colossal beast roaming the dark groves of Ardennes. Its monstrous tusks can pierce heavy mail, and its rage makes it immune to minor wounds, requiring a coordinated hunt to bring down."
  },
  {
    key: "carolingian_giant",
    emoji: "🧌",
    nameKO: "피레네 산맥 거인 (Pyrenean Giant)",
    nameEN: "Pyrenean Giant",
    category: "거인 (Giant)",
    stats: { STR: 45, CON: 28, SIZ: 50, DEX: 8, HP: 39, Armor: 4, Damage: "8d6" },
    specialRules: [
      { title: "광폭한 휘두르기 (Sweep Attack)", desc: "거인의 무식한 곤봉 공격은 넓은 범위를 휩씁니다. 기병이 맞설 때, 대립 판정 실패 시 공격 피해량이 기마 방패의 아머 방어도를 관통하여 말과 기사 모두에게 절반씩 직접 전달됩니다." },
      { title: "공포의 포효 (Terrifying Roar)", desc: "거인이 전투 시작 시 포효를 지르면, 모든 기사는 기사도 성향인 '용맹(Valorous)' 판정을 굴려야 합니다. 실패 시 기가 죽어 전투가 끝날 때까지 모든 무기 스킬 판정에 -5 패널티를 받습니다." }
    ],
    loreKO: "피레네나 알프스의 거친 바위 협곡에 숨어 지내는 고대 거인족의 생존자입니다. 인간 기사들을 한 손으로 움켜쥐어 바위에 메칠 수 있는 엄청난 괴력을 지니고 있으며, 거대한 고목 몽둥이로 무장하고 있습니다.",
    loreEN: "A remnant of an ancient race living in the high mountain passes. Giants possess immense strength and wield heavy clubs capable of crushing a warhorse with a single blow."
  },
  {
    key: "faerie_knight",
    emoji: "🧝‍♂️",
    nameKO: "숲의 요정 기사 (Forest Faerie Knight)",
    nameEN: "Forest Faerie Knight",
    category: "초자연 (Supernatural)",
    stats: { STR: 18, CON: 15, SIZ: 16, DEX: 22, HP: 16, Armor: 8, Damage: "4d6" },
    specialRules: [
      { title: "요정의 미혹 (Faerie Glamour)", desc: "요정 기사가 공격을 적중시킬 때마다, 기사는 '정직/신뢰(Trusting)' 또는 '요정 전설(Faerie Lore)' 판정을 굴려야 합니다. 실패 시 오감이 환각에 빠져 다음 1턴 동안 무기 공격 시 주사위를 2번 굴려 더 낮은 값을 적용합니다." },
      { title: "신비로운 민첩성 (Ethereal Grace)", desc: "요정 기사는 물리 법칙을 무시하고 가볍게 나뭇잎 위를 걷습니다. 어떠한 지형에서도 이동 및 방어 제약이 없으며, 기사의 '회피(Dodge)' 판정에 영구적인 -3 디버프를 가합니다." }
    ],
    loreKO: "아르덴의 안개 너머 요정 성채(Faerie Realm)에서 파견된 의문의 전사입니다. 밤빛이 흐르는 은색 요정 갑옷을 두르고 있으며, 인간들의 무분별한 삼림 벌채와 성전 침입을 무력으로 처단하러 홀연히 모습을 드러냅니다.",
    loreEN: "An enigmatic guardian from the faerie realm. Wielding a sword of pure starlight and wearing enchanted armor, they defend the pagan sanctuaries of the forest from mortal encroachment."
  },
  {
    key: "saracen_cavalry",
    emoji: "🏇",
    nameKO: "사라센 정예 경기병 (Saracen Cavalry)",
    nameEN: "Saracen Elite Cavalry",
    category: "인간 (Human)",
    stats: { STR: 14, CON: 14, SIZ: 14, DEX: 16, HP: 14, Armor: 5, Damage: "4d6" },
    specialRules: [
      { title: "치고 빠지기 (Hit & Run)", desc: "경기병은 마상 궁술과 투창에 매우 능합니다. 사거리가 확보된 전투 시, 선제 라운드에서 무작위로 활(Bow) 공격을 수행하여 방어 판정이 불가한 2d6 피해를 기사에게 입힌 후 백병전에 돌입합니다." },
      { title: "시미터 베기 (Scimitar Slash)", desc: "사라센 정밀 검술로 치명타(대성공)가 터질 경우, 두터운 판금 아머를 우회하여 피 흘리는 지속 자상 피해(매 라운드 정산 시 1d3 HP 소실)를 가합니다. 구급(First Aid) 성공 시에만 멈춥니다." }
    ],
    loreKO: "에스파냐 남부 및 아프리카에서 징집된 기민하고 노련한 사라센 경기병입니다. 무거운 사슬 갑옷을 입어 둔한 프랑크 성기사들에 비해 가벼운 누비 갑옷과 민첩한 아라비아마를 타고 질풍노도처럼 치고 빠지는 전술을 구사합니다.",
    loreEN: "Swift and highly skilled light horsemen from Al-Andalus. They rely on mobility, curved scimitars, and shortbows to harass and outflank the heavily armored Frankish knights."
  },
  {
    key: "wolf_pack",
    emoji: "🐺",
    nameKO: "혹한의 겨울 늑대 무리 (Winter Wolf Pack)",
    nameEN: "Winter Wolf Pack",
    category: "야수 (Beast)",
    stats: { STR: 12, CON: 12, SIZ: 10, DEX: 15, HP: 11, Armor: 2, Damage: "2d6+2" },
    specialRules: [
      { title: "무리 전술 (Pack Coordination)", desc: "늑대 무리는 표적을 포위합니다. 늑대가 2마리 이상 동시에 교전 중일 때, 기사의 회피(Dodge) 판정은 불가능하며, 늑대 무리의 모든 물어뜯기 대립 판정에 +2 가산 보너스가 붙습니다." },
      { title: "살을 에는 동상 (Freezing Bite)", desc: "한겨울 밤 조우 시 늑대의 물어뜯기에 피해를 입은 기사는 CON 판정을 굴려야 합니다. 실패 시 동상(Frostbite)을 입어 영지나 성으로 돌아가 요양할 때까지 매일 1 HP의 자연 치유만 가능하게 제한됩니다." }
    ],
    loreKO: "겨울철 식량이 모두 소진되었을 때 눈 덮인 황야에서 사냥감을 찾아 울부짖는 늑대 무리입니다. 굶주림으로 지극히 흉포해져 있으며, 길 잃은 순례자나 단독 정찰 중인 기사의 말을 집요하게 추적합니다.",
    loreEN: "A desperate pack of wolves hunting in the frozen forests. They hunt in perfect coordination, using their numbers to surround isolated travelers and bring down larger prey through exhaustion."
  }
];

export const bibliography = {
  majorEpics: [
    { title: "Chanson de Guillaume and La Prise d’Orange", details: "ed. P.E. Bennett (London, 2001)", desc: "오렌지의 기욤(나르본 가문의 백작)의 활약상을 다룬 대표적인 12세기 영웅 무공시." },
    { title: "Guillaume d’Orange: Four Twelfth-Century Epics", details: "ed. J.M. Ferrante (New York, 2001)", desc: "남부 프랑크 국경에서 벌어지는 사라센 침공을 막아내는 기욤의 눈부신 활약상을 다룬 번역본 모음." },
    { title: "Histoire de Huon de Bordeaux et Aubéron, roi de féerie", details: "ed. R. Pernoud (Paris, 1983)", desc: "아르덴 요정 숲의 요정왕 오베론과 위옹 경의 신비로운 모험을 담은 환상 서사시." },
    { title: "Karlamagnus Saga: The Saga of Charlemagne and his Heroes", details: "Toronto, 1980", desc: "샤를마뉴 대제와 성기사들의 전설을 집대성하여 중세 노르드어로 번역/편찬한 거대 서사 전집." },
    { title: "La Chevalerie d’Ogier de Danemarche", details: "Raimbert de Paris, ed. M. Eusebi (Milan, 1963)", desc: "샤를마뉴 대제와 대립하며 명예를 찾고 제국을 수호하는 덴마크인 오지에 경의 기사도 일대기." },
    { title: "Les Quatre Fils Aymon", details: "ed. M. de Combarieu et al. (Paris, 2011)", desc: "샤를마뉴 대제에 반대하여 마법마 바야르를 타고 저항한 에몽 백작의 네 아들(르노와 형제들)의 비장한 저항시." },
    { title: "Orlando Furioso (광란의 오를란도)", details: "Ludovico Ariosto (Oxford, 2008)", desc: "르네상스 시기 루도비코 아리오스토가 완성한 최고의 이탈리아 성기사 대서사시." },
    { title: "The Song of Roland (롤랑의 노래)", details: "various editions", desc: "론세스바예스 고개에서 전사한 롤랑과 12성기사의 영웅적 장렬함을 다룬 세계 최고의 기사도 무공시." }
  ],
  minorEpics: [
    { title: "Aiol", details: "ed. S.C. Malicote (New York, 2014)", desc: "가난한 몰락 기사 아이올이 주군의 인정을 받기 위해 명예로운 모험을 떠나는 이야기." },
    { title: "Ami et Amiles (아미와 아밀레)", details: "ed. N. Desgrugillers-Billard (Clermont-Ferrand, 2008)", desc: "어떠한 시련 속에서도 결코 깨지지 않는 두 기사의 아름답고 비장한 신의와 우정의 서사." },
    { title: "Aye d’Avignon (아비뇽의 아예)", details: "ed. S.J. Borg (Geneva, 1967)", desc: "봉건적 강제 혼인에 저항하고 남편의 원수를 갚기 위해 일어선 여장부 기사 아예의 일대기." },
    { title: "Doon de Mayence (도온 드 마옌스)", details: "ed. A. Pey (Paris, 1859)", desc: "원로 가문의 기틀을 세운 대전사 도온 경의 탄생과 모험, 거인 사냥 연대기." },
    { title: "Fierabras (피에라브라)", details: "ed. M. le Person (Paris, 2003)", desc: "로마를 습격했던 사라센 거인 전사 피에라브라가 롤랑과 결투 후 기독교로 개종하고 성기사단원이 되는 무용담." },
    { title: "Gui de Nanteuil (낭퇴유의 기 경)", details: "ed. J. McCormack (Geneva, 1970)", desc: "법률과 행정의 명가 낭퇴유 가문의 음모와 사법적 명예 회복을 둘러싼 정밀한 사회 고발형 서사시." }
  ],
  studies: [
    { author: "Einhard & Notker the Stammerer", title: "Two Lives of Charlemagne", details: "trans. Lewis Thorpe (1969)", desc: "샤를마뉴 대제의 직속 비서 아인하르트와 수도사 노트커가 기록한 대제의 가장 유명한 전기문." },
    { author: "Pierre Riché", title: "The Carolingians: A Family Who Forged Europe", details: "trans. M. Allen (1993)", desc: "어떻게 카롤링거 가문이 분열된 프랑크 영토를 통합하고 현대 유럽의 뼈대를 주조했는가에 대한 역사학계 최고의 역작." },
    { author: "David Nicolle", title: "The Age of Charlemagne", details: "Osprey Publishing (1984)", desc: "샤를마뉴 시대 기병의 전술, 무장 방어구, 기마 돌격술을 방대한 복원 그림과 함께 수록한 전쟁사 고증서." },
    { author: "Leon Gauthier", title: "Les Épopées Françaises (프랑스 무공시 연구)", details: "Paris, 1897", desc: "중세 프랑스 무공시(Chansons de Geste)의 수십만 행에 달하는 인명, 지명, 족보 계통을 총정리한 문학 연구사 기념비." }
  ]
};

