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
    crestDescKO: "붉은 바탕에 황금색 제국 독수리, 파란색 부리와 발톱.",
    genealogy: "• 시조: 헤르스탈의 피핀 & 알파이다\n• 부친: 샤를 마르텔 (Charles Martel - 망치왕) & 로트루드\n• 후손: 피핀 3세 (Pepin the Short - 단신왕) & 베르트라다 (평발왕비)\n• 직계 자녀: 샤를마뉴 대제 (Charlemagne - 서로마 황제), 카를로만 (Carloman)\n• 방계 친족: 숙부 베르나르 경 (Sir Bernard)"
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
    crestDescKO: "은색 바탕에 포효하는 검은색 야생 멧돼지, 붉은 이빨과 발톱.",
    genealogy: "• 시조: 오리돈의 람베르트 (Lambert of Oridon)\n• 부친: 아르덴의 티에리 1세 (Thierry I, 736-793) & 에노의 리쉴드\n• 형제: 아를롱의 갈레랑 (Galeran of Arlon, 734)\n• 자녀: 아르덴의 티에리 2세 (Thierry II, 780), 베라르 (Berard), 갈로팽 (Galopin, 766), 아믈레브의 리샤르, 바스토뉴의 기욤"
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
    crestDescKO: "푸른 바탕에 은색의 3중 성탑, 아래로는 붉게 물든 바다.",
    genealogy: "• 시조: 몽글란의 가린 (Garin of Monglane) & 바이에른의 클라리사\n• 자녀: 안주의 가린 (Garin of Anjou), 아키텐의 에르망가르드\n• 손자: 비엔의 제라르 (Gerard of Vienne), 기욤 경 (오렌지의 기욤 - 나르본 백작), 기 경, 용맹한 비비앙 경"
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
    crestDescKO: "황금색 바탕에 서로 휘감긴 세 마리의 검은 독사, 붉은 왕관และ 튀어나온 혀.",
    genealogy: "• 시조: 마옌스의 그리포 (Grifo of Mayence)\n• 대표 백작: 가늘롱 백작 (Count Ganelon - 롤랑의 배신자)\n• 숙부: 하드라드 (Hardrad)\n• 친족/수호 기사: 피나벨 경 (Sir Pinabel - 제국 대결투의 사수)"
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
    crestDescKO: "좌우 분할, 왼쪽은 파란 바탕에 은색 초승달, 오른쪽은 붉은 바탕에 황금 사자.",
    genealogy: "• 시조: 바이에른의 오딜로 공작 & 칠트루드 (피핀의 누이)\n• 직계: 타실로 3세 공작 & 롬바르디아의 리우트베르가\n• 방계: 덴마크 국왕 고드프리드 1세\n• 전설의 기사: 덴마크인 오지에 (Ogier the Dane) & 벨리센드 공주\n• 제국 고문: 바이에른의 네모 공작 (Duke Naymo)"
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
    crestDescKO: "붉은 바탕에 기어오르는 네 개의 머리를 가진 은색 말, 파란색 상단부에는 세 개의 황금색 별.",
    genealogy: "• 부친: 도르돈의 에몽 백작 (Count Aymon) & 클레르몽의 베아트리스\n• 전설의 네 아들: 몽토방의 르노 (Sir Renaud), 알라르, 리샤르, 기샤르\n• 숙부: 에그레몽의 보브 공작 (Duke Beuves)\n• 친족 영웅: 모지 경 (Sir Maugis - 대마법사 사촌), 브라다만테 (여전사) & 무어인 로제로"
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
    crestDescKO: "검은 바탕에 은색의 양날 도끼, 양옆에는 날개를 펼친 황금색 독수리 날개.",
    genealogy: "• 시조: 마옌스의 도온 (Doon de Mayence, 685-735) & 플랑드린\n• 직계: 라 로슈의 도온 (Doon de La Roche) & 올리브 공주\n• 전사 자녀: 위고 경 (Sir Hugo, 733), 라 로슈의 드로고 (Drogo)"
  },
  {
    key: "nanteuil",
    nameEN: "House of Nanteuil",
    nameKO: "낭퇴유 가문 (법률 and 행정의 명문)",
    mottoEN: "Justice and the Written Word",
    mottoKO: "정의와 기록된 율법",
    crestSymbol: "⚖️📜🖋️",
    crestImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Blason_Nanteuil-le-Haudouin.svg/250px-Blason_Nanteuil-le-Haudouin.svg.png",
    backgroundEN: "A highly educated house of knights who often serve as judges, counselors, and counts of royal administration. They value the rule of law, peace, and the restoration of learning in Charlemagne's Carolingian Renaissance.",
    backgroundKO: "매우 높은 교육수준을 자랑하는 명망가로, 황제 곁에서 고문관, 사법 재판관, 세무 백작 등의 핵심 관직을 지켰습니다. 법치주의, 제국의 평화, 샤를마뉴 대제의 '카롤링거 르네상스' 율법 학문 부흥에 열렬히 동참한 가문입니다.",
    traitsEN: "Highly just, honest, and literate. Possess high stewardship and courtesy.",
    traitsKO: "정의로움과 타오르는 정직함이 돋보이며, 문해력을 갖춘 보기 드문 지식인들입니다. 영지 관리와 예법 기술의 정수를 보여줍니다.",
    crestDescEN: "Argent, a balance held by a hand vested gules, issuing from a cloud azure.",
    crestDescKO: "은색 바탕에 푸른 구름 속에서 나타나 저울을 들고 있는 붉은 소매의 사법의 손.",
    genealogy: "• 시조: 낭퇴유의 기 백작 (Count Guy of Nanteuil) & 아이글렌틴 (에몽 백작의 딸)\n• 직계 자녀: 낭퇴유의 트리스탄 (Tristan de Nanteuil - 율법과 고난의 기사)"
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
  },
  {
    key: "bavaria",
    emoji: "🏔️",
    nameKO: "바이에른 공국 (Bavaria)",
    nameEN: "The Duchy of Bavaria",
    rulerKO: "타실로 3세 공작 (Duke Tassilo III)",
    rulerEN: "Duke Tassilo III",
    passionKO: "주군에 대한 충성 (Loyalty [Lord]) 15점 또는 프랑크인에 대한 증오 (Hate [Franks]) 15점",
    passionEN: "Loyalty (Lord) 15 or Hate (Franks) 15",
    modifiers: [
      { name: "연애예법 (Courtesy)", value: "+3" },
      { name: "웅변 (Eloquence)", value: "+3" },
      { name: "가무/악기 (Singing/Play Instruments)", value: "+3" }
    ],
    historyKO: "도나우강 상류와 울창한 보헤미아 숲, 그리고 웅장한 알프스산맥 사이에 위치한 역사 깊은 공국입니다. 고대 로마의 문명적 유산이 잘 보존되어 있으며, 아길롤핑 가문의 지배 아래 우아하고 세련된 궁정 문화와 예술적 학문이 발달했습니다. 자치권과 독립을 위해 샤를마뉴 황제와 격렬한 대립각을 세웠던 비장한 역사를 지니고 있습니다.",
    historyEN: "An ancient, highly refined duchy bordered by the Danube, the Alps, and the Bohemian Forest. Under the Agilolfings, Bavaria maintains strong Roman cultural roots and courtly elegance, often struggling against Frankish hegemony."
  },
  {
    key: "gascony",
    emoji: "🏹",
    nameKO: "가스코뉴 공국 (Gascony)",
    nameEN: "The Duchy of Gascony",
    rulerKO: "이온 공작 (Duke Yon)",
    rulerEN: "Duke Yon",
    passionKO: "가족에 대한 사랑 (Love [Family]) 15점",
    passionEN: "Love (Family) 15",
    modifiers: [
      { name: "음모 (Intrigue)", value: "+3" },
      { name: "마술 (Horsemanship)", value: "+2" },
      { name: "사라센 예법 (Courtesy)", value: "+3" }
    ],
    historyKO: "피레네산맥의 서부 기슭과 대서양 연안 사이에 펼쳐진 광활한 구릉 지대입니다. 아키텐과 마찬가지로 라틴 문화와 아랍 문화가 공존하며, 대단히 기민하고 매혹적이지만 동시에 반골 기질이 강한 전사들의 고장입니다. 산악 지형을 이용해 제국의 통제에 빈번히 저항하였으며, 사라센과 프랑크 세력 사이에서 아슬아슬한 독자 세력을 형성하고 있습니다.",
    historyEN: "A scenic duchy nestled between the Atlantic coast and the Pyrenees. Its people are energetic, fiercely independent, and possess unique blending of Gascon, Frankish, and Andalusian customs."
  },
  {
    key: "provence",
    emoji: "🌊",
    nameKO: "프로방스 공국 (Provence)",
    nameEN: "The Duchy of Provence",
    rulerKO: "마르셀랭 공작 (Duke Marcellin)",
    rulerEN: "Duke Marcellin",
    passionKO: "가족에 대한 사랑 (Love [Family]) 15점",
    passionEN: "Love (Family) 15",
    modifiers: [
      { name: "지중해 항해 (Stewardship)", value: "+3" },
      { name: "예의 (Courtesy)", value: "+3" },
      { name: "요정 전설 (Faerie Lore)", value: "+2" }
    ],
    historyKO: "지중해의 따사로운 햇살을 받는 아름다운 해안 평야와 론강 하구의 염전 늪지대를 포괄하는 유서 깊은 남부 영토입니다. 로마 시대의 극장, 아쿠아덕트(수로교) 등 고대 건축의 잔재가 풍성하며, 지중해 무역을 통해 비잔틴과 아랍 문화의 영향을 깊게 받았습니다. 매력적이지만 변덕스럽고, 물빛 가득한 가문들의 기사도가 살아 숨 쉬고 있습니다.",
    historyEN: "A sun-drenched southern coastal region with a rich Roman heritage and busy maritime trade. Known for its salt marshes, ancient monuments, and knights who are volatile yet deeply refined."
  },
  {
    key: "breton_march",
    emoji: "⛵",
    nameKO: "브르타뉴 변경령 (Breton March)",
    nameEN: "The Breton March",
    rulerKO: "마크 백작 롤랑 경 (Sir Roland, Count of the March)",
    rulerEN: "Sir Roland, Count of the March",
    passionKO: "주군에 대한 충성 (Loyalty [Lord]) 15점 또는 영예 (Honor) 15점",
    passionEN: "Loyalty (Lord) 15 or Honor 15",
    modifiers: [
      { name: "경계 (Awareness)", value: "+3" },
      { name: "마상창 (Lance)", value: "+3" },
      { name: "해안 순찰 (Battle)", value: "+2" }
    ],
    historyKO: "프랑크 제국의 서쪽 국경이자 완고하고 호전적인 켈트 브레통인의 땅을 마주하는 삼엄한 군사 경계령입니다. 전설적인 성기사 롤랑 경이 마크 백작으로서 이 변경령의 초대 통치자로 임명되어 적들의 침입을 철통같이 방어했습니다. 사납게 휘몰아치는 해안가 거친 바람과 비바람 속에서 기사들은 한 치의 물러섬도 없이 복무합니다.",
    historyEN: "A heavily fortified militarized frontier bordering the independent Celtic Bretons. Established by Charlemagne and ruled by the legendary Sir Roland to guard the western sea roads and borders."
  },
  {
    key: "normandy",
    emoji: "🦁",
    nameKO: "노르망디 공국 (Normandy)",
    nameEN: "The Duchy of Normandy",
    rulerKO: "니벨롱 2세 공작 (Duke Nibelung II)",
    rulerEN: "Duke Nibelung II",
    passionKO: "영예 (Honor) 15점",
    passionEN: "Honor 15",
    modifiers: [
      { name: "정의 (Just)", value: "+3" },
      { name: "신중 (Prudent)", value: "+3" },
      { name: "장원 관리 (Stewardship)", value: "+2" }
    ],
    historyKO: "제국 서북부 센강 하구와 울창한 해안 삼림에 둘러싸인 강인한 전사들의 고장입니다. 이곳 주민들은 대단히 과묵하고 고독한 기질을 지니고 있으나, 명예와 의무감이 극도로 단단하며 사법 정의에 강한 소신을 품고 있습니다. 묵묵하게 장원을 일구고 방패를 다듬는 중세 영주 기사도의 또 다른 원형을 보여줍니다.",
    historyEN: "A rugged and forested northwestern coastal duchy on the Seine. Its inhabitants are solitary, highly silent, and possess a profound sense of duty, administrative justice, and stubborn honor."
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
  },
  {
    key: "destrier",
    emoji: "🐎",
    nameKO: "명마 데스트리에 (Great Warhorse - Destrier)",
    nameEN: "Great Warhorse Destrier",
    category: "야수 (Beast)",
    stats: { STR: 38, CON: 10, SIZ: 42, DEX: 10, HP: 52, Armor: 5, Damage: "8d6" },
    specialRules: [
      { title: "전투 마술 훈련 (Battle Trained)", desc: "데스트리에는 전장 돌격에 단련되어 있어, 기사가 전투 중에 마술(Horsemanship) 판정을 별도로 굴릴 필요 없이 오직 무기에만 전념할 수 있도록 합니다." },
      { title: "마상 랜스 돌격 (Lance Charge Damage)", desc: "이 말을 탄 기사가 랜스 돌격을 감행할 경우, 공격 성공 시 가하는 최종 돌격 피해량 주사위가 8d6으로 증가합니다." }
    ],
    loreKO: "어지간한 기사들의 체구(SIZ 42)를 압도하는 웅장한 전쟁용 군마입니다. 오직 강력하게 전투 훈련을 거친 대군마만이 데스트리에로 분류되며, 무겁고 두터운 판금 갑옷을 걸친 중장기사를 태우고도 적진의 방패벽을 가볍게 뚫고 들어갈 수 있습니다.",
    loreEN: "A large, war-trained horse. Only the Great Horse is big enough to be a destrier, capable of carrying a fully armored knight and delivering crushing damage in a lance charge."
  },
  {
    key: "bayard",
    emoji: "✨",
    nameKO: "마법마 바야르 (The Magical Steed Bayard)",
    nameEN: "Magical Steed Bayard",
    category: "초자연 (Supernatural)",
    stats: { STR: 50, CON: 50, SIZ: 50, DEX: 25, HP: 100, Armor: 8, Damage: "6d6" },
    specialRules: [
      { title: "인간에 버금가는 지성 (Human-like Wisdom)", desc: "바야르는 인간의 언어를 완전히 이해하며 고도의 감정과 지혜를 지녔습니다. 기사의 위험 경보(Awareness) 판정에 +5 보너스를 부여하며 결코 주인을 배신하지 않습니다." },
      { title: "바람을 가르는 돌격 (Wind Charge 17d6)", desc: "돌격(Move 25) 시 랜스 피해량이 무려 17d6으로 계산되며, 마술 회피(Avoidance) 판정이 39점 이하일 경우 어떠한 타격도 받지 않고 미끄러지듯 피합니다." }
    ],
    loreKO: "대마법사 모지가 심해와 숲의 정령들에게 얻어 사촌인 르노 경에게 선물한, 카롤링거 서사시 최고의 명마입니다. 네 명의 에몽 백작의 아들들을 한 등 위에 동시에 태우고 적진을 휘저었던 전설의 말이며, 르노에 대한 무한한 충성심을 자랑합니다.",
    loreEN: "The most famous faerie horse, won by Maugis and given to Renaud. Bayard possesses human intelligence, understands speech, and runs as fast as the wind, representing a knight's perfect loyal companion."
  },
  {
    key: "battle_elephant",
    emoji: "🐘",
    nameKO: "전투 코끼리 아불 아바스 (Battle Elephant - Abul-Abbas)",
    nameEN: "Battle Elephant Abul-Abbas",
    category: "야수 (Beast)",
    stats: { STR: 80, CON: 20, SIZ: 80, DEX: 12, HP: 100, Armor: 7, Damage: "18d6" },
    specialRules: [
      { title: "압사 짓밟기 (Trample 16)", desc: "전투 라운드 중 적대 대상을 압사시키는 짓밟기 판정이 16점으로 수행됩니다. 성공 시 적에게 18d6의 치명적인 물리 압착 피해를 입힙니다." },
      { title: "위압감 및 코끼리 공포증 (Elephantine Terror)", desc: "코끼리를 상대하는 기사는 전투 개시 전 신중(Prudent) +5 판정을 굴려야 합니다. 실패 시 코끼리의 거대한 풍채에 위축되어 공격 행동을 할 수 없게 됩니다." }
    ],
    loreKO: "아라비아 바그다드의 칼리프 하루날 라시드가 797년 샤를마뉴 황제에게 헌상한 실존했던 백색 전투 코끼리입니다. 북방의 덴마크 전쟁(810년)에도 동원되었으며, 이 거대한 괴수가 울부짖으며 돌격할 때 말들은 사방으로 흩어져 도망쳤습니다.",
    loreEN: "Gigantic war beasts used by eastern empires. The historical white elephant Abul-Abbas was gifted to Charlemagne in 797 by Haroun Al-Rashid, bringing unmatched dread to Northern battlefields."
  },
  {
    key: "battle_camel",
    emoji: "🐫",
    nameKO: "사막 전투 낙타 (Desert Battle Camel)",
    nameEN: "Desert Battle Camel",
    category: "야수 (Beast)",
    stats: { STR: 20, CON: 12, SIZ: 55, DEX: 17, HP: 67, Armor: 5, Damage: "6d6" },
    specialRules: [
      { title: "기병 대치 우위 (Mounted Superiority)", desc: "낙타에 기승해 싸우는 아랍 전사들은 일반 기마에 탑승한 기사들을 상대로 칼부림과 마창 대립 판정에 +5 가산점을 획득합니다." },
      { title: "겨울 기후 패널티 (Cold Vulnerability)", desc: "사막 태생인 낙타는 북부 유럽의 겨울 환경에서 혹한에 노출되면 생존 판정(Mount Survival)에 -5의 치명적인 벌점을 입습니다." }
    ],
    loreKO: "피레네 남쪽 사라고사 토후국과 머나먼 시리아, 페르시아에서 전사들이 애용하는 사막 전용 탈것입니다. 말이 낙타 특유의 악취에 겁을 먹는 경향이 있어 말 탄 서구 성기사들에게 마상 대치 시 기습적인 전술 우위를 부여합니다.",
    loreEN: "Desert mounts used by Saracen and Moorish horsemen. Warriors fighting from a camel's back gain a +5 combat advantage over riders mounted on standard horses."
  },
  {
    key: "combat_mastiff",
    emoji: "🐕",
    nameKO: "전투 맹견 마스티프 (Combat Mastiff)",
    nameEN: "Combat Mastiff",
    category: "야수 (Beast)",
    stats: { STR: 13, CON: 12, SIZ: 12, DEX: 20, HP: 24, Armor: 2, Damage: "3d6" },
    specialRules: [
      { title: "목덜미 물어뜯기 (Savage Bite 15)", desc: "전투 맹견 마스티프가 적을 물 때 Bite 15 수치로 대립 판정을 합니다. 철제 갑옷(Metal Armor)을 두른 기사나 적에겐 피해량이 1d6 감소합니다." },
      { title: "충직한 보초 및 수렵 동반 (Faithful Guardian)", desc: "기사가 겨울 야영 중이거나 수렵(Hunting) 중일 때 마스티프와 동행하면, 야습 경계(Awareness) 및 사냥 판정에 +5 가산점을 획득합니다." }
    ],
    loreKO: "사냥물의 뼈를 부러뜨리고 성을 침입하는 불한당이나 적병을 단숨에 물리치기 위해 귀족들이 육성하는 초대형 맹견입니다. 곰이나 거대한 멧돼지도 물어 뜯는 투지가 훌륭하여 기사들의 최고의 동반자로 여겨집니다.",
    loreEN: "Valuable dogs bred for combat and big game hunting. These massive mastiffs are impressive defenders, used to tackle bears, boars, and thieves effectively."
  },
  {
    key: "aurochs",
    emoji: "🐂",
    nameKO: "야생 들소 아우록스 (Aurochs)",
    nameEN: "Wild Bull Aurochs",
    category: "야수 (Beast)",
    stats: { STR: 42, CON: 20, SIZ: 42, DEX: 7, HP: 62, Armor: 7, Damage: "10d6" },
    specialRules: [
      { title: "분노의 뿔 돌격 (Horn Charge)", desc: "들소가 첫 돌격을 가할 때, 돌격 피해량에 +2d6이 합산(최종 12d6)되며, 뿔 받기(Horn Gore 9)에 걸리면 1d6의 추가 출혈 피해를 입힙니다." },
      { title: "수렁 수영 (Swamp Swimmer)", desc: "거대한 덩치에도 불구하고 물속에서 가볍게 수영이 가능하여, 늪지대나 강가 전투 시 지형 패널티를 전혀 받지 않습니다." }
    ],
    loreKO: "제국 북부 작센의 울창한 밀림과 라인강 변방의 질척이는 진흙탕 속에 서식하는 멧집 강한 고대 야생 들소입니다. 거대한 체구와 날카롭게 굽은 뿔을 자랑하며 포효하며 돌격해올 때 숲의 참나무조차 부서집니다.",
    loreEN: "Enormous, herbivorous wild bulls living in the deep forests and wet marshes of Frankland, capable of devastating trampling attacks when enraged."
  },
  {
    key: "pyrenean_bear",
    emoji: "🐻",
    nameKO: "피레네 갈색 곰 (Pyrenean Brown Bear)",
    nameEN: "Pyrenean Brown Bear",
    category: "야수 (Beast)",
    stats: { STR: 25, CON: 18, SIZ: 25, DEX: 10, HP: 43, Armor: 6, Damage: "3d6x2" },
    specialRules: [
      { title: "찢어발기는 마울링 (Mauling Claws 13)", desc: "전투 라운드 당 Claws 13으로 단 한 표적만 공격합니다. 대립 성공 시, 피해량 3d6을 2회 별도로 계산하여 각각 별개의 치명적인 상처로 입힙니다." },
      { title: "야생의 생존력 (Bear Resilience)", desc: "추운 겨울 삼림 조우 시 활 공격에 높은 저항력을 지니며, 매 라운드 자연 치유력이 인간의 두 배로 활성화됩니다." }
    ],
    loreKO: "피레네 산맥의 깊은 동굴과 은밀한 침엽수림에 서식하는 거구의 맹수입니다. 인간을 기피하지만 코너에 몰렸을 때 쏟아져 나오는 양손 발톱의 파괴력은 성기사의 마상 방패와 갑옷마저 갈가리 찢어버릴 수 있습니다.",
    loreEN: "Fearsome predators found in the high passes of the Pyrenees. Bears deliver separate mauling wounds that can easily turn a knight's shield to splinters."
  },
  {
    key: "aspremont_griffin",
    emoji: "🦅",
    nameKO: "하늘의 강탈자 그리핀 (Aspremont Griffin)",
    nameEN: "Aspremont Griffin",
    category: "초자연 (Supernatural)",
    stats: { STR: 40, CON: 25, SIZ: 40, DEX: 20, HP: 65, Armor: 10, Damage: "8d6" },
    specialRules: [
      { title: "공중 낙하 강탈 (Snatch & Drop)", desc: "비행 중 아머를 갖추지 않았거나 가벼운 적(SIZ 13 이하)을 입으로 낚아채어 하늘 높은 곳에서 땅으로 내던집니다. 추락한 대상은 6d6의 관통 낙하 대미지를 입습니다." },
      { title: "공중 활공 공격 (Flyby Attack -15)", desc: "공중을 날아가며 공격할 때 적의 방어/대립 주사위에 -15라는 파괴적인 명중 디버프를 강제하고 휩쓸고 지나갑니다." }
    ],
    loreKO: "독수리의 앞몸과 날개, 그리고 사자의 뒷몸을 지닌 전설적인 아스프레몽 고산 지대의 야수입니다. 특히 말 고기를 극도로 좋아하며 인간 기사들을 보면 굶주린 포효와 함께 내려꽂힙니다. 마법사들이 수호수로 자주 사역합니다.",
    loreEN: "A rare monster with the rear body of a lion and the foreparts of an eagle. Griffins have a special taste for horse meat and can snatch up and drop riders from the sky."
  },
  {
    key: "carolingian_dragon",
    emoji: "🐉",
    nameKO: "카롤링거 지옥 화룡 (Carolingian Dragon/Wyrm)",
    nameEN: "Carolingian Dragon Wyrm",
    category: "초자연 (Supernatural)",
    stats: { STR: 35, CON: 25, SIZ: 35, DEX: 30, HP: 60, Armor: 15, Damage: "7d6" },
    specialRules: [
      { title: "멸망의 화염 브레스 (Fire Breath 10)", desc: "용이 화염 브레스를 뿜을 때 피할 수 없는 6d6의 마법 화염 대미지를 입힙니다. 기사는 용맹(Valorous) -10 판정에 통과해야만 대항 무기를 뽑을 수 있습니다." },
      { title: "신체 재생 및 복원 (Demonic Regeneration)", desc: "드래곤은 잘린 팔다리를 기적적으로 복구하는 신비한 융합 능력을 가지고 있습니다. 전투 중 매 라운드가 끝날 때마다 1d6 HP를 즉시 자가 재생합니다." }
    ],
    loreKO: "프랑크 대륙의 문명과 멀리 떨어진 깊은 화산성 산맥이나 미지의 습지 유적 동굴에서 도사리는 종말의 상징입니다. 악마의 핏줄로부터 태어난 존재로 알려져 있으며, 이 괴수를 쓰러뜨려 명예를 쟁취한 기사는 제국의 영웅으로 칭송받습니다.",
    loreEN: "Extremely rare giant serpents of demonic origin. They exude dread, breathe ruinous fire, and possess the horrifying ability to regenerate severed limbs and wounds instantly."
  },
  {
    key: "pyrenean_manticore",
    emoji: "🦁",
    nameKO: "식인 야수 만티코어 (Pyrenean Manticore)",
    nameEN: "Pyrenean Manticore",
    category: "초자연 (Supernatural)",
    stats: { STR: 45, CON: 25, SIZ: 45, DEX: 20, HP: 70, Armor: 10, Damage: "9d6" },
    specialRules: [
      { title: "독침 꼬리 찌르기 (Tail Sting 20)", desc: "만티코어의 전갈 꼬리 찌르기가 Tail Sting 20으로 전개됩니다. 피해량은 6d6이지만 독성(Potency 4d6) 판정을 굴려 실패 시 심장 쇠약 디버프를 겪습니다." },
      { title: "공포의 기사도 판정 (Valorous -10)", desc: "기사는 만티코어를 마주했을 때 용맹(Valorous) -10 판정을 해야 합니다. 통과하지 못하면 공포에 질려 공격 주사위를 2번 굴려 나쁜 값을 취합니다." }
    ],
    loreKO: "머나먼 페르시아나 인도에 살던 식인 야수이나 제국의 산맥 협곡에 흘러들어 정착한 괴물입니다. 사자의 붉은 몸뚱이에 인간의 얼굴, 세 줄로 가득 찬 톱니바퀴 같은 이빨과 전갈의 가시 꼬리를 가졌으며, 플루트 같은 달콤한 목소리로 길을 잃은 순례자를 홀려 뼈째 갉아먹습니다.",
    loreEN: "A legendary man-eating beast with a lion's body, a human face, three rows of sharp teeth, and a deadly scorpion sting. It can leap over castle walls effortlessly to capture prey."
  },
  {
    key: "desert_basilisk",
    emoji: "🐍",
    nameKO: "죽음의 바실리스크 (Desert Basilisk)",
    nameEN: "Desert Basilisk",
    category: "초자연 (Supernatural)",
    stats: { STR: 10, CON: 50, SIZ: 5, DEX: 25, HP: 55, Armor: 20, Damage: "2d6" },
    specialRules: [
      { title: "사안의 저주 (Deadly Gaze 10)", desc: "바실리스크의 눈과 눈이 마주칠 경우(Gaze 10), 기사는 경건(Pious) 또는 용맹(Valorous) 판정을 즉시 굴려 실패 시 체력에 무관하게 즉시 사망(Instant Death)합니다." },
      { title: "맹독성 타액 침 (Poisonous Spit 21)", desc: "사거리 25야드 내에서 침을 뱉어 공격합니다. 피격 시 독 주사위를 매 라운드 굴려 1d6에서 1이 나올 때까지 라운드당 10점의 고정 아머 무시 대미지를 입습니다." }
    ],
    loreKO: "수탉의 머리에 날개를 달았으나 하늘을 날지 못하며, 몸은 거대한 사막 독사를 닮은 뱀의 왕입니다. 지나간 자리는 식물이 시들어 말라죽고 쉭쉭거리는 소리만으로 다른 독사들을 지배합니다. 주로 요정과 보물이 묻힌 성역을 수호합니다.",
    loreEN: "A highly lethal snake with a cock's head and wings. Its deadly gaze can strike a man dead instantly, and its venomous spit ruins the land and infects survivors with madness."
  },
  {
    key: "faerie_enchantress",
    emoji: "🧚‍♀️",
    nameKO: "요정 엔찬트리스 알치나 (Alcina the Faerie Enchantress)",
    nameEN: "Alcina the Faerie Enchantress",
    category: "초자연 (Supernatural)",
    stats: { STR: 8, CON: 8, SIZ: 8, DEX: 14, HP: 16, Armor: 0, Damage: "3d6" },
    specialRules: [
      { title: "치명적 요정 유혹 (Lustful Enchantment 20)", desc: "엔찬트리스는 고도의 환영술로 성기사를 홀립니다. 기사는 정조(Chaste) 대립 판정을 굴려 실패 시 마법의 성에 노예로 갇히며, 매 겨울 단계마다 구애 열망(Lustful) 점수가 +2씩 영구 증가합니다." },
      { title: "환각의 베일 (Veil of Illusion)", desc: "물리적 공격이 가해질 때 요정의 환각 마법으로 적중 주사위를 2번 굴려 무조건 실패율이 높은 더 낮은 주사위 수치를 따르도록 교란합니다." }
    ],
    loreKO: "요정 모르간의 이복자매이자 광란의 오를란도 서사시에서 수많은 성기사들을 홀려 자신의 마법 섬에 감금하고 동물의 형상으로 바꾼 음탕하고 매혹적인 요정입니다. 춤과 음악, 아름다운 사교 예절을 즐기며, 사로잡히면 영혼이 무너집니다.",
    loreEN: "Morgan's half-sister and a powerful lustful enchantress. She lures famous paladins to her magical island, keeping them as toys of her desire or transmuting them into wild beasts."
  },
  {
    key: "sea_orc",
    emoji: "🐋",
    nameKO: "심해의 폭군 오크 (Sea Orc)",
    nameEN: "Tyrant Sea Orc",
    category: "초자연 (Supernatural)",
    stats: { STR: 30, CON: 20, SIZ: 40, DEX: 15, HP: 60, Armor: 30, Damage: "8d6" },
    specialRules: [
      { title: "강철 비늘 아머 (Unbreakable Hide 30)", desc: "오크의 가죽은 강철 성벽과 같습니다. 아머 방어도가 30으로 책정되어 있으며, 신성 성검(Holy Sword)이나 거인 슬레이어 무기가 아닌 일반 무기로는 어떠한 긁힘 피해도 줄 수 없습니다." },
      { title: "어금니 물어뜯기 (Boar Tusks 12)", desc: "멧돼지 같은 어금니로 수중 대상을 강렬하게 물어뜯어 8d6의 피해를 입힙니다. 물속(Swim Rate 5)에서 벌어지는 대지 전투 시 적 기사를 마상째 삼킵니다." }
    ],
    loreKO: "아일랜드 북방 바다와 지중해 남부 해역을 지배하는, 거대 뱀의 꼬리와 야생 멧돼지의 머리를 가진 흉측한 깊은 바다의 거대 괴룡입니다. 무고한 처녀를 제물로 바치는 해안 부족들을 보호하며 군림해 왔으며, 오를란도 경이 닻줄을 입안에 처박아 물 밖으로 끌어내 죽였습니다.",
    loreEN: "A colossal sea monster with a coiling serpent body and a boar's head. Its rocky hide is virtually impervious to standard steel, requiring legendary strength to pierce."
  },
  {
    key: "carolingian_goblin",
    emoji: "👺",
    nameKO: "원죄의 고블린 (Carolingian Goblin)",
    nameEN: "Carolingian Goblin",
    category: "초자연 (Supernatural)",
    stats: { STR: 16, CON: 20, SIZ: 6, DEX: 30, HP: 26, Armor: 6, Damage: "4d6" },
    specialRules: [
      { title: "원죄의 투영 (Mirror of Vices)", desc: "고블린은 오만한 독수리, 게으른 소, 음탕한 염소 등의 모습으로 나타나 기사의 정신을 오염시킵니다. 기사는 대립되는 도덕적 미덕 판정(Chaste, Temperate, Pious 등)에 통과해야만 고블린을 물리치고 도망치게 할 수 있습니다." },
      { title: "요정의 장난꾸러기 도망 (Avoidance 30)", desc: "고블린은 지극히 민첩하여 도망(Avoidance 30)에 능합니다. 숲속에서 추적하거나 잡으려 할 때 대립 주사위에 큰 패널티를 부여합니다." }
    ],
    loreKO: "요정 모르간의 땅인 아발론 근방이나 황량한 제국의 광야에서 태어나는, 인간의 타락한 죄악들이 뭉쳐 기괴한 동물의 머리를 취한 하급 악귀들입니다. 기사를 물리적으로 타격하기보다 조롱하고 비웃으며 도덕심을 갉아먹는 것이 특징입니다.",
    loreEN: "Foul visual incarnations of human sins. These highly agile, animal-headed creatures harass traveling knights by magnifying their moral weaknesses rather than engaging in direct combat."
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

