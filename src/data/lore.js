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
    name: "🎲 [솔로 룰] 교차로 조우 (Crossroad Encounters)",
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
    name: "🎲 [솔로 룰] 마상 창시합 (The Jousts)",
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
    name: "🎲 [솔로 룰] 가문의 피빛 불화 (The Feud)",
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
    name: "🎲 [솔로 룰] 아르덴 요정 숲 조난 (Lost In The Woods)",
    flow: [
      "1. 길 찾기: 수렵(Hunting)이나 요정 전설(Faerie Lore)을 굴려 신비의 숲 속에서 올바른 방향을 잡습니다.",
      "2. 실패 시: 숲에서 방황하며 매일 1d6의 소중한 시간이 낭비되고, 매일 밤 숲 조우 표를 굴립니다.",
      "3. 대실패 시: 시간 관념이 붕괴되는 요정의 마법(Faerie Glamour)에 빠져 1d20년 동안 실종 처리됩니다."
    ],
    rules: "아키텐이나 북방 아르덴 삼림 등 요정의 힘이 잔존하는 숲을 통과할 때 적용되는 위기 해결 규칙입니다."
  },
  {
    key: "holylands",
    name: "🎲 [솔로 룰] 성지 순례 전역 (The Holy Lands)",
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
    name: "🎲 [솔로 룰] 야생마 및 명수 사냥 (The Hunt)",
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
    name: "🎲 [솔로 룰] 기사의 광증 (Madness)",
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
    name: "🎲 [솔로 룰] 제국 사법 의회 (The Mallus)",
    flow: [
      "1. 억울한 고발 접수: 영지 농민이나 이웃 기사에게 영토 경계선 무단 침범 혐의로 제소당합니다.",
      "2. 배심원 증언: 정의(Just) 및 정직(Honest) 판정으로 배심원들 앞에서 엄숙한 결백 연설을 합니다.",
      "3. 판결 강행: 실패 시 사법 재판관 백작에게 거액의 배상금 벌금(£1d6)을 물거나 기결 처분을 받습니다."
    ],
    rules: "Carolingian 법정 제도를 체험할 수 있는 솔로 시나리오로, 평화적 정의 구현을 시험합니다."
  },
  {
    key: "missus",
    name: "🎲 [솔로 룰] 순찰사 감찰관 영접 (Missus Dominicus)",
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
    name: "🎲 [솔로 룰] 고해성사 순례 (The Pilgrimage)",
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
    name: "🎲 [솔로 룰] 궁정식 구애의 시련 (Romance)",
    flow: [
      "1. 사랑의 선언: 웅변(Eloquence)이나 무용(Dancing)을 성공시켜 lady의 마음에 조용한 파도를 일으킵니다.",
      "2. 귀부인의 거절 극복: lady가 부여하는 영웅적인 결투 퀘스트(Essai)를 전장에서 직접 달성해야 합니다.",
      "3. 시련 돌파 시: Amor [Lady] 열망이 16점으로 활성화되며, 평생의 구애를 승인받아 가문을 맺습니다."
    ],
    rules: "귀부인에 대한 로맨틱한 구애와 기사로서의 품격을 조율하며 사랑의 완성으로 나아가는 과정입니다."
  },
  {
    key: "court",
    name: "🎲 [솔로 룰] 왕실 가을 어전 회의 (The Royal Court)",
    flow: [
      "1. 황제 알현: 예의(Courtesy)를 굴려 품위 있는 귀족 기사의 격식을 뽐냅니다.",
      "2. 정적과의 설전: 웅변(Eloquence)이나 음모(Intrigue)로 어전 토론회에서 라이벌의 궤변을 제압합니다.",
      "3. 황제의 하사품: Standing [Charlemagne] d20 성공 시 황제가 직속 검이나 명장을 하사합니다."
    ],
    rules: "아헨 왕궁에서 펼쳐지는 정치 공작과 우아한 사교 모임에 참여할 때 쓰이는 규칙입니다."
  },
  {
    key: "tournament",
    name: "🎲 [솔로 룰] 대토너먼트 축제 (The Tournament)",
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
    name: "🎲 [솔로 룰] 봉신 기사의 군역 의무 (Vassal Service)",
    flow: [
      "1. 기사 징집 Summons: 주군의 부름에 수렵/전투마를 타고 만반의 무장을 갖춰 즉각 소집에 응합니다.",
      "2. 진지 구축 보초: 전술(Battle)이나 경계(Awareness)를 굴려 밤샘 야영 중 이교도의 야습을 예방합니다.",
      "3. 주군 엄호: 전장에서 주군이 위기에 처했을 때 몸을 던져 검(Sword) 대립 판정으로 사수합니다."
    ],
    rules: "vassal 기사로서 매년 거칠게 감당해야 하는 40일간의 주군 징집 의무 전역의 모험 판정입니다."
  },
  {
    key: "manor",
    name: "🎲 [솔로 룰] 기사의 장원 관리 (Your Manor)",
    flow: [
      "1. 경계 획정 분쟁: 이웃 영주와 물줄기 지배권을 두고 다툴 때 Stewardship으로 소송을 준비합니다.",
      "2. 풍작 기우제: 민간 전설(Folk Lore)을 활용해 영지 농민들의 가뭄 불안 심리를 다독입니다.",
      "3. 법 집행: 영지 장원에서 절도나 죄를 지은 범죄자들을 Just 판정으로 처벌하여 치안을 유지합니다."
    ],
    rules: "vassal 기사들이 평시에 자신의 영지(Manor)를 직접 관리하고 보살필 때 발생하는 경영 판정입니다."
  },
  {
    key: "adv_jewel",
    name: "🧭 [챕터 19 모험] 보석의 모험 (The Adventure of the Jewel)",
    flow: [
      "1. 봉신의 임무(Vassal's Mission) 개시: 주군의 특별 호출을 받아 낯선 순례자(A Strange Pilgrim)와 조우하여 밀서를 전달받습니다.",
      "2. 습격(Brigands!): 숲속 통행길에서 이교도 산적단과 조우해 Sword 또는 Spear로 백병전을 전개합니다.",
      "3. 섬의 은자(The Hermit of the Isle) 방문: 호수 중앙 섬에 은거하는 은자로부터 꿈의 계시(The Dream of Desperate Sheep)를 해석받고 악마의 징조를 포착합니다.",
      "4. 성난 농민들(Angry Peasants): 비버 댐(The Beaver Dam) 붕괴로 수몰 위험에 처해 폭동 직전인 농민들을 Stewardship(영지 관리) 또는 Eloquence(웅변)로 진정시킵니다.",
      "5. 영지 침입자(Unwanted Visitors): 아인거슈타인 장원(Manor Eingarstein)에 침입한 적 가문의 군대를 격퇴하고 영지 농민 반란(Peasant Revolt)을 성공적으로 진압하여 보석을 탈환합니다."
    ],
    rules: "프랑크 제국의 국경 변방에서 벌어지는 상실된 성물/보석의 회수를 다루는 대규모 공식 장기 모험 시나리오입니다."
  },
  {
    key: "adv_squires",
    name: "🧭 [챕터 19 모험] 겸손한 종자들의 모험 (The Adventure of the Humble Squires)",
    flow: [
      "1. 알프스 횡단(Crossing the Alps): 험난한 겨울 산맥 CON 판정과 산악 조난(Perilous Mountain Journey) 돌파, 신비의 백색 사슴(The White Deer) 추적을 개시합니다.",
      "2. 롬바르디아 동맹(The Lombard Alliance): 폭풍 전야(Calm Before the Storm) 속에서 롬바르디아 연합군과 대적하여 '겸손한 종자들의 전투' 전술(Battle) 대립을 펼칩니다.",
      "3. 비열한 매복(A Dishonorable Ambush): 비열한 흑색 갑옷의 밤샘 기습에 대항해 아군 진영을 사수하고 롤랑과 오지에 경을 엄호하는 구출 임무(Rescue Attempts)를 수행합니다.",
      "4. 오몽의 성탑 공략(Aumont's Tower): 사랑의 고해를 약속한 이교도 공주 플로리파스의 낭만 예법 시련(Courtesy, Dancing, Romance 등 총 3가지 시련 성공)을 통과하여 성탑을 해방합니다.",
      "5. 최후의 결투(The Final Duel): 성탑 포위전을 영웅적으로 수성(Siege)하고, 마법검 코르텐(Courtain)을 든 덴마크인 오지에 경이 이교도 대전사 다네몽을 물리치는 최종 결전을 목격 및 지원합니다."
    ],
    rules: "알프스 산맥을 넘어 서로마 황제 샤를마뉴의 론세스바예스 전야와 이탈리아 전역을 아우르는 장엄한 영웅 기사도 시나리오입니다."
  },
  {
    key: "sf_adultery",
    name: "📜 [챕터 19 단편] 부정한 배우자의 심판 (The Adulterous Spouse)",
    flow: [
      "1. 고발 직면: 영지 장원에 복귀하자마자 증인들의 간통 현장 목격 증언을 접수하고 상황을 파악합니다.",
      "2. 아내의 변론: '어둠 속에서 낯선 인물의 인기척을 느꼈을 뿐'이라는 아내의 무죄 탄원에 Honor(명예) 및 Trusting(신뢰) 성향을 점검합니다.",
      "3. 사법 고문/고문 기각: 증인들을 고문해 자백을 받아내는 것은 사법 정의(Just)와 Pious(경건) 수치 하락을 초래하므로 신중히 대처합니다.",
      "4. 신성 심판 오딜(Ordeal): 아내가 뜨거운 달궈진 쇠를 들고 견뎌내는 신성 오딜(Hot Iron Ordeal)을 수행하도록 허용할지 결정합니다. (Valorous 판정 및 Just 성공 시 신의 은총으로 피해 감소)",
      "5. 사법 결투(Trial by Combat): 아내의 무죄를 지키기 위해 무례한 고발자의 가문 챔피언과 40일 이내에 목숨을 건 명예 결투(Battle / Sword)를 전개합니다. 승리 시 고발자를 엄벌하며 Forgiving(관대) 성공 시 보너스 획득."
    ],
    rules: "장기 군역 전역을 마치고 돌아온 기사가 영지에서 간통 혐의로 고발당한 아내의 결결을 입증하고 진실을 밝히는 도덕 재판 시나리오입니다."
  },
  {
    key: "sf_merchant",
    name: "📜 [챕터 19 단편] 분노한 상인의 탄원 (The Angry Merchant)",
    flow: [
      "1. 부패한 법정 영접: 백작의 연례 사법 의회에서 백작의 가신 시굴프 경이 상인의 말을 강탈한 사건을 목격합니다.",
      "2. 은밀한 수색: 상인의 주장을 바탕으로 시굴프 경의 영지 장원을 Awareness(경계) 및 Intrigue(음모)로 은밀히 수색하여 장원 구석에 숨겨진 도난마를 찾아냅니다.",
      "3. 황제의 정체 간파: 상인의 거구와 독특한 웅변력을 통해 그가 변장하여 암행 순찰 중인 샤를마뉴 황제(Charlemagne)임을 Recognize(식별)로 간파합니다.",
      "4. 백작 설득: 탐욕스러운 백작의 마음을 Just(정의), Honest(정직), Eloquence(웅변)로 돌려놓는 도덕적 조언을 수행합니다.",
      "5. 백작의 방해 격퇴: 백작이 뇌물을 제안하며 사건을 덮으려 하거나 시굴프 경이 사법 결투를 신청할 때, 봉신 의무와 기사도 명예를 걸고 백병전에서 승리하여 황제에게 영지를 하사받습니다."
    ],
    rules: "탐욕스러운 지방 백작의 영지 법정에서 강탈당한 말을 찾으러 온 거구의 상인과 백작의 갈등 사이에 낀 기사의 중재 시나리오입니다."
  },
  {
    key: "sf_blue_heaven",
    name: "📜 [챕터 19 단편] 청천호의 아이들 (Children of the Blue Heaven)",
    flow: [
      "1. 폭동 진압: 유대인 상인들이 아이들을 납치해 마법 의식을 벌인다는 뜬소문으로 도시에 폭동이 일어날 때, Pious(경건) 및 Just(정의) 판정으로 무고한 상인들을 군중으로부터 보호합니다.",
      "2. 민간 단서 추적: 수사 도중 Folk Lore(민간 전설)와 성당 지하에서 들려오는 아이들의 곡소리를 감지하고 성당 지하 밀실 내부를 Awareness로 포착합니다.",
      "3. 물증 획득: 실종 주기가 매달 열리는 와인 시장(Wine Market)과 정확히 겹친다는 것을 Stewardship(장원 관리)으로 간파하고, 이탈리아 노예선 '청천호'의 와인 오크통 안에서 흘러나오는 피땀 자국을 발견합니다.",
      "4. 진범 주교 대치: 납치범이 다름 아닌 배후의 타락한 주교(Bishop Agobard)와 그 수하 롬바르드 상인 도나티오임을 파악하고 주교의 암살 자객단 습격(Awareness -5)에 맞서 백병전을 전개합니다.",
      "5. 황제의 고발: 획득한 증거를 바탕으로 샤를마뉴 황제에게 주교의 만행을 정식 보고하여 황제 직속 성기사단(Paladins)을 소집하고 주교를 처단합니다."
    ],
    rules: "도시 안에서 의문의 아동 연쇄 실종 사건이 발생하고 죄 없는 이교도 상인들이 누명을 쓸 때, 진범인 타락한 주교의 실체를 밝히는 사법 수사 시나리오입니다."
  },
  {
    key: "sf_devils_bridge",
    name: "📜 [챕터 19 단편] 악마의 다리 (The Devil’s Bridge)",
    flow: [
      "1. 고립 타개: 좁은 협곡 벼랑 끝에 포위된 주군의 군대를 위해 전술(Battle -10) 상황을 분석하고 나무 다리 건설을 개시합니다.",
      "2. 악마의 방해 포착: 밤마다 다리가 붕괴되는 현상에 대해 Faerie Lore(요정 전설)로 수렁 아래 잠든 밤의 악마(Demon of the Chasm)의 징조를 밝혀냅니다.",
      "3. 영적 밤샘 수호: 악마가 밤마다 환각으로 기사들을 유혹해 다리를 부수려 할 때, Chaste(정조), Forgiving(관대), Temperate(절제) 등 기사도 미덕 대립 판정으로 악마의 환영술을 무력화합니다.",
      "4. 거인과의 사투: 다리가 부서진 최악의 경우, 기병 진입이 불가능한 벼랑길에서 이교도들이 내세운 Behemoth Pagan Giant(거인)와 5라운드 이상의 혈투(Sword)를 전개합니다.",
      "5. 전역 돌파: 8라운드에 이르러 피로로 잠든 거인의 목을 베거나 악마를 몰아내어 무사히 주군의 군대를 이끌고 다리를 건너며 기사도 영예(Glory 250)를 쟁취합니다."
    ],
    rules: "계곡 수렁 아래의 악마와 후방의 이교도 군대 사이에 기습 포위된 주군의 군대를 구하기 위해 다리를 사수하거나 거인과 결투하는 시나리오입니다."
  },
  {
    key: "sf_faerie_castle",
    name: "📜 [챕터 19 단편] 요정의 성 (The Faerie Castle)",
    flow: [
      "1. 요정 성 진입: 숲속 탐험 도중 그림자가 사라지는 요정 마법(Faerie Glamour)의 안개를 겪고 신비로운 꽃들의 성에 도달합니다.",
      "2. 6대 요정 기예 겨루기: 성에서 탈출할 자격을 얻기 위해 요정들과 6가지 기예 대결(Courtesy 예법 대결, Gaming 요정 체스 대결, Heraldry 계보 대결, Dancing 무용 대결, Horsemanship 기마 대결, Faerie Lore 전설 대결)을 펼쳐 승리합니다.",
      "3. 6대 원죄의 시험: 요정 여왕이 제시하는 6가지 악덕 유혹(Temperance vs Gluttony 식탐 유혹, Generous vs Greed 물욕 유혹, Chaste vs Lust 음탕 유혹, Modest vs Pride 교만 유혹, Energetic vs Sloth 나태 유혹, Forgiving vs Wrath 분노 유혹)을 성향 판정으로 극복합니다.",
      "4. 성기사 발견 및 해방: 성안에 함께 억류된 샤를마뉴의 12성기사(Paladin)를 Recognize(식별)로 알아내고, 그들을 유혹의 베일로부터 일깨워 함께 해방시킵니다.",
      "5. 물질 소멸 및 귀환: 시련을 전부 이겨내고 탈출에 성공할 때, 요정이 준 황금과 비마(Hippogriff) 등의 보물이 물거품처럼 사라지는 요정 마법의 공허함을 겪으며 영구적인 지혜를 획득합니다."
    ],
    rules: "신비한 삼림 속에서 오감을 홀리는 요정 알치나의 매혹적인 황금 궁성에 갇힌 성기사를 구출하고 마법의 시련을 통과해 탈출하는 시나리오입니다."
  },
  {
    key: "sf_love_bayard",
    name: "📜 [챕터 19 단편] 마법마 바야르에 대한 사랑 (For the Love of Bayard)",
    flow: [
      "1. 명마 영접: 상처 입은 르노 경을 안심시키고 숲속 공터에 홀로 남겨진 거구의 마법마 바야르(Bayard - STR 50)와 조우합니다.",
      "2. 마법 사료 급여: 기품이 높은 바야르에게 일반 건초가 아닌 최고의 밀과 최고급 보리 사료(£1 상당)를 제공해야 하며, 저급 사료 급여 시 성질을 부려 Horsemanship 판정에 -5 패널티가 붙습니다.",
      "3. 데일리 그루밍 시련: 매일 바야르에게 접근하고, 감화를 주고, 털을 빗겨주기 위해 총 3회의 고난도 Horsemanship(마술) 판정에 통과하여 야성을 길들입니다.",
      "4. 강철 편자 작업: 일반 철제 편자 대신 특수 강철 편자를 바야르의 네 발굽에 무사히 박는 편자 박기 작업을 나무 고정틀(Travis) 없이 순수한 친밀도만으로 완수합니다.",
      "5. 어전의 보상: 르노 경이 의식을 차릴 때까지 바야르를 무사히 돌보아 돌려주고, 훗날 몽토방의 르노 경에게 제국 최고의 기사도적 은혜(Master's Favor)를 획득하며 야생마 추적 보너스를 얻습니다."
    ],
    rules: "중상을 입고 쓰러진 영웅 르노 경을 대신해 지성을 가진 마법의 야생마 바야르를 보살피며 교감을 쌓는 난이도 높은 기마 관리 시나리오입니다."
  },
  {
    key: "sf_embassy",
    name: "📜 [챕터 19 단편] 이국의 사절단 (The Foreign Embassy)",
    flow: [
      "1. 사절단 영접: 어전이나 요새에서 머나먼 동방(바그다드, 콘스탄티노플 등)에서 온 이국의 외교 사절단 일행을 품격 있게 맞이합니다.",
      "2. 사절단 예법 대치: Courtesy(예의) 및 Intrigue(음모) 판정을 통해 그들의 이국적인 선물 이면에 잠재된 외교적 의도와 스파이 공작을 조사합니다.",
      "3. 동방 학술 교류: 사절단 학자들과 Languages(언어) 및 Religion(종교) 판정으로 성경 고문서 해석 논쟁을 벌여 제국의 문화적 위상을 높입니다.",
      "4. 보상: 외교 임무를 훌륭히 완수해 Standing [Charlemagne] +2 및 50 Glory를 획득합니다."
    ],
    rules: "제국 궁정이나 변경령에서 동방의 외교 사절단을 영접하며 벌어지는 품격 높은 예법 및 문화 정치 공작 시나리오입니다."
  },
  {
    key: "sf_abbot",
    name: "📜 [챕터 19 단편] 탐욕스러운 수도원장 (The Greedy Abbot)",
    flow: [
      "1. 수도원 제소: 이웃의 탐욕스러운 세속 수도원장(Lay Abbot)이 영지 비축량이나 수도원 토지를 횡령했다는 제소를 받습니다.",
      "2. 회계 수사: Stewardship(영지 관리) 및 Just(정의) 판정으로 수도원의 십일조 장부와 밀 창고를 은밀히 수색하여 횡령 물증을 확보합니다.",
      "3. 주술적 사기 돌파: 수도원장이 기적을 사칭해 농민들을 현혹할 때, Religion(종교 지식) 판정으로 이것이 기적인지 마법적 사기극인지 밝혀냅니다.",
      "4. 판결 집행: Just 및 Pious 판정을 굴려 수도원장을 공식 파문하거나 황제 법정에 제소하여 수도원을 정상화하고 Standing [Church] +3을 얻습니다."
    ],
    rules: "수도원의 부패를 파헤치고 횡령을 은밀히 수사하여 교회의 질서와 정의를 바로 세우는 종교 사법 수사 시나리오입니다."
  },
  {
    key: "sf_maugis",
    name: "📜 [챕터 19 단편] 대마법사 모지 엄호 (Guarding Maugis)",
    flow: [
      "1. 대마법사 엄호 의무: 사촌이자 제국 최강의 대마법사인 모지 경(Sir Maugis)이 마법 물약이나 영적 의식을 치르는 동안 그를 엄호하는 임무를 받습니다.",
      "2. 영적 기습 차단: 모지가 마법을 외우는 수 라운드 동안, 어둠 속에서 은밀히 다가오는 이교도 자객들을 Awareness(경계) 및 Dodge(회피)로 미연에 방지합니다.",
      "3. 요정 마법 방어: 기습해오는 요정 기사들과 흉측한 하급 마수들에 대항해 Sword 스킬로 전선을 구축해 완벽하게 시간 벌이를 수행합니다.",
      "4. 의식 완료: 모지의 마법 의식이 성공하는 순간, 전장을 뒤덮는 찬란한 광휘와 함께 마법적 축복 보상 및 100 Glory를 획득합니다."
    ],
    rules: "수도원이나 숲속 한가운데에서 의식을 치르는 마법사 모지를 지키기 위해 사방에서 날아오는 위기들을 돌파하는 방어 수호 시나리오입니다."
  },
  {
    key: "sf_pagan_lady",
    name: "📜 [챕터 19 단편] 이교도 귀부인의 사랑 (The Pagan Lady)",
    flow: [
      "1. 이교도 귀부인 조우: 전장이나 적지 침공 도중, 지극히 고결하고 아름다운 이교도 사라센 귀부인과 조우해 연민을 품게 됩니다.",
      "2. 궁정 구애의 시련: Courtesy(예의) 및 Eloquence(웅변)로 그녀의 마음을 두드리고, 그녀의 가문이 요구하는 Chivalric Essai(마상 결투 퀘스트)를 수행합니다.",
      "3. 개종 유도: Pious(경건) 및 Religion(종교 지식) 대립 판정을 통해 그녀에게 기독교의 신성한 사랑을 설파하여 진정 어린 개종(Conversion)을 유도합니다.",
      "4. 가문의 축복: 개종과 함께 성당에서 정식 세례 및 혼인 성사를 맺고, 영구적인 Amor [Lady] 16점 및 대가문의 동맹을 수립합니다."
    ],
    rules: "사라센 전역 중 이교도 귀부인과 국경과 신앙을 초월한 비장하고 아름다운 궁정 사랑을 성취하는 기사도 로맨스 시나리오입니다."
  },
  {
    key: "sf_pagan_prison",
    name: "📜 [챕터 19 단편] 이교도 지하 감옥 탈출 (The Pagan Prison)",
    flow: [
      "1. 지하 투옥: 전장 패배 혹은 함정에 빠져 사라센 토후국의 차갑고 어두운 지하 감옥에 억류됩니다.",
      "2. 탈옥로 개척: Dagger(단검) 기술 및 DEX 판정으로 간수들의 시선을 교란하고, 녹슬어 헤진 쇠창살을 탈옥로로 개척합니다.",
      "3. 은밀한 탈출: Intrigue(음모) 및 Awareness(경계)를 통해 보초병들의 야간 순찰 동선을 완벽히 파악해 소리 없이 뒤를 밟으며 장비가 보관된 무기고로 잠입합니다.",
      "4. 사막 돌파: 획득한 장비를 갖추고 Horsemanship(마술) 및 사막 서바이벌 판정을 통과해 사막 매복조의 추격을 뿌리칩니다.",
      "5. 국경 복귀: 동료 기사들과 함께 피레네 국경령에 복귀하여 영웅적 탈출 성공 보상(100 Glory)을 얻습니다."
    ],
    rules: "이교도 영토의 한복판에 위치한 난공불락의 지하 성채 감옥에서 장비를 탈환하고 사막을 돌파해 복귀하는 스릴 넘치는 탈옥 시나리오입니다."
  },
  {
    key: "sf_rebel_baron",
    name: "📜 [챕터 19 단편] 반역을 꾀하는 남작 (The Rebellious Baron)",
    flow: [
      "1. 반역 징후 포착: 이웃의 오만한 남작이 제국의 세금 납부를 거절하고 사적인 성채 축조 및 병력 징집을 개시했다는 정보를 얻습니다.",
      "2. 첩보 수사: Intrigue(음모) 및 Recognize(식별) 판정으로 남작의 전령을 가로막아 그가 마옌스(Mayence) 음모 가문과 교류하는 반역 기밀 밀서를 가로챕니다.",
      "3. 성채 기습: Battle(전술) 판정으로 기습 이점을 활용해 축조 중인 남작의 목조 모트 성을 급습(Assault)하여 방패벽을 무너뜨립니다.",
      "4. 반역 처단: 반역자 남작과 Sword 스킬 대립 결투를 벌여 그를 굴복시키고 황제의 사법 평화(Just)를 구현하여 대가문의 칭송 및 100 Glory를 쟁취합니다."
    ],
    rules: "중앙 제국의 질서에 반항하며 은밀히 반란 군세를 모으는 영주 남작의 실태를 파헤치고 기습해 처단하는 반란 진압 시나리오입니다."
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

/**
 * Carolingian Lore Database Additions (Chapter 16 & 17)
 */

export const npcs = [
  {
    "key": "charlemagne",
    "nameKO": "샤를마뉴 대제 (King Charlemagne)",
    "nameEN": "King Charlemagne (Anno 768)",
    "titleKO": "프랑크인들의 국왕, 서로마 황제, 로마의 보호자",
    "titleEN": "King of the Franks; Protector of Rome",
    "glory": 15000,
    "stats": {
      "SIZ": 23,
      "DEX": 13,
      "STR": 22,
      "CON": 30,
      "APP": 15,
      "HP": 53,
      "MW": 30,
      "UC": 13,
      "KD": 23,
      "HR": 5
    },
    "damage": "8d6",
    "armor": "12+shield+3+5 (마법 투구)",
    "move": 4,
    "traits": {
      "Chaste": 13,
      "Energetic": 25,
      "Forgiving": 17,
      "Generous": 20,
      "Honest": 16,
      "Just": 14,
      "Merciful": 15,
      "Modest": 13,
      "Prudent": 10,
      "Temperate": 15,
      "Trusting": 17,
      "Valorous": 28
    },
    "directedTraits": "복수심 (반역자들 대상) +15",
    "passions": [
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 25
      },
      {
        "name": "영예 (Honor)",
        "value": 19
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 20
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous), 신앙적인 기사 (Religious, 768년 이후)",
    "skills": [
      "경계 (Awareness) 18",
      "예의 (Courtesy) 16",
      "웅변 (Eloquence) 15",
      "수렵 (Hunting) 20",
      "음모 (Intrigue) 18",
      "외국어 (Languages) 10",
      "수영 (Swimming) 25"
    ],
    "combatSkills": [
      "전술 (Battle) 25",
      "공선 (Siege) 20",
      "검술 (Sword) 22",
      "도끼 (Axe) 20",
      "마상창 (Lance) 18",
      "단검 (Dagger) 18"
    ],
    "significantItems": [
      "조이외즈 (Joyeuse - 신성 성검)",
      "블랑샤르 (Blanchard - 명마)",
      "샤를마뉴의 투구 (방어도 +5 마법 투구)",
      "샤를마뉴의 셉터 (왕권 상징)",
      "샤를마뉴의 부적",
      "파스트라다의 반지 (783년 이후)"
    ],
    "biographyKO": "프랑크의 위대한 지배자이자 기독교 제국인 신성로마제국의 수립자입니다. 무한한 정력과 거인 같은 위엄을 자랑하며, 공명정대하고 Compassionate(자비)한 사법 재판관으로 명성을 떨쳤습니다. 아침저녁으로 예배에 충실히 출석하는 가장 경건한 주님의 전사이기도 합니다. 숲에서 아우록스 야생 들소를 수렵하고 Aachen의 온천에서 기사들과 수영 경주를 벌이길 즐겼습니다. 그의 전설적인 성검 조이외즈(Joyeuse)는 전설의 명검 듀란달과 같은 강철로 제련되어 푸른 별빛을 뿜어냅니다.",
    "biographyEN": "The glorious leader of the Franks and the perfect embodiment of a king and emperor, divinely inspired and guided in his mission to build a solid Christian realm. He is robust, extremely energetic, and wields the holy sword Joyeuse."
  },
  {
    "key": "turpin",
    "nameKO": "투르팽 대주교 (Archbishop Turpin)",
    "nameEN": "Archbishop Turpin (Anno 768)",
    "titleKO": "랭스 대주교, 제국의 성기사 (Paladin)",
    "titleEN": "Archbishop of the Franks, Paladin",
    "glory": 7300,
    "stats": {
      "SIZ": 15,
      "DEX": 10,
      "STR": 18,
      "CON": 23,
      "APP": 8,
      "HP": 38,
      "MW": 23,
      "UC": 10,
      "KD": 15,
      "HR": 4
    },
    "damage": "6d6",
    "armor": "10+방패+3",
    "move": 3,
    "traits": {
      "Chaste": 20,
      "Energetic": 25,
      "Forgiving": 16,
      "Generous": 20,
      "Honest": 16,
      "Just": 8,
      "Merciful": 16,
      "Modest": 18,
      "Prudent": 10,
      "Temperate": 19,
      "Trusting": 16,
      "Valorous": 21
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 20
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 10
      },
      {
        "name": "영예 (Honor)",
        "value": 20
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 25
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous), 신앙적인 기사 (Religious)",
    "skills": [
      "웅변 (Eloquence) 16",
      "음모 (Intrigue) 17",
      "외국어 (Languages) 11",
      "문해력 (Read/Write) 10",
      "인식 (Recognize) 18",
      "종교 지식 (Religion) 19",
      "가무 (Singing) 16"
    ],
    "combatSkills": [
      "전술 (Battle) 14",
      "공선 (Siege) 10",
      "검술 (Sword) 21",
      "둔기 (Bludgeon) 20",
      "창 (Spear/Polearm) 11",
      "단검 (Dagger) 13",
      "마상창 (Lance) 15"
    ],
    "significantItems": [
      "알마스 (Almace - 성검)"
    ],
    "biographyKO": "생드니의 수도사 출신이자 랭스의 대주교로 임명된 카롤링거의 위대한 전사 대주교입니다. 부친이 전사하자 십자가와 경전을 내려두고 칼과 철퇴를 쥐고 샤를마뉴 대제와 함께 이교도들과 맞서 싸웠습니다. 기사와 사제라는 이중적인 역할을 가장 성공적으로 수행하며 성 교회의 대의를 대변합니다. 왕실의 비서이자 황제의 가장 충직한 고문이며, 론세스바예스 협곡에서 롤랑과 올리버의 영웅적 항전을 영적인 사함과 무력으로 지켜낸 후 장렬히 전사합니다.",
    "biographyEN": "A monk of Saint Denis who became Archbishop of Reims and decided to take up arms. Turpin represents the Church's active military support of Charlemagne's holy wars and serves as the royal biographer."
  },
  {
    "key": "ogier",
    "nameKO": "덴마크인 오지에 경 (Sir Ogier the Dane)",
    "nameEN": "Sir Ogier the Dane (Anno 768)",
    "titleKO": "덴마크의 왕자, 제국의 성기사 (Paladin)",
    "titleEN": "Prince of Denmark; Paladin",
    "glory": 4200,
    "stats": {
      "SIZ": 26,
      "DEX": 10,
      "STR": 28,
      "CON": 20,
      "APP": 10,
      "HP": 46,
      "MW": 20,
      "UC": 12,
      "KD": 26,
      "HR": 5
    },
    "damage": "9d6",
    "armor": "10+방패+3",
    "move": 4,
    "traits": {
      "Chaste": 12,
      "Energetic": 16,
      "Forgiving": 4,
      "Generous": 13,
      "Honest": 5,
      "Just": 19,
      "Merciful": 8,
      "Modest": 10,
      "Prudent": 5,
      "Temperate": 4,
      "Trusting": 10,
      "Valorous": 24
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 16
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 14
      },
      {
        "name": "영예 (Honor)",
        "value": 23
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 11
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "예의 (Courtesy) 16",
      "요정 전설 (Faerie Lore) 16",
      "마술/보드게임 (Gaming) 16",
      "마술 (Horsemanship) 20",
      "수영 (Swimming) 1"
    ],
    "combatSkills": [
      "전술 (Battle) 19",
      "공선 (Siege) 12",
      "검술 (Sword) 21+9 (쿠르탱 보너스)",
      "도끼 (Axe) 20",
      "단검 (Dagger) 16",
      "마상창 (Lance) 15"
    ],
    "significantItems": [
      "브루아피에 (Broiefer - 전투마)",
      "쿠르탱 (Courtain - 성검, +9 보너스)"
    ],
    "biographyKO": "덴마크 국왕 고드프리드의 거인급 육체를 지닌 아들로, 인질로 끌려와 프랑크 왕국에서 자랐습니다. 극도로 용맹스럽고 무시무시한 힘(STR 28, SIZ 26)을 지녀, 적의 거대 야수들을 단칼에 동강 내는 능력을 보여줍니다. 대제와 불화와 갈등을 겪으면서도 12성기사의 영광을 지켰으며, 덴마크와 프랑크 사이의 수많은 반란 시기를 조율한 의롭고 완고한 영웅입니다. 그의 칼 쿠르탱(Courtain)은 마력을 머금어 전투에 강력한 파괴적 예리함을 제공합니다.",
    "biographyEN": "King Godfrid's semi-giant son raised as a hostage. Though frequently in conflict with Charlemagne, the irate and stubborn Dane remains incredibly loyal to the paladins and defeats cumbersome giants."
  },
  {
    "key": "roland",
    "nameKO": "성기사 롤랑 경 (Sir Roland)",
    "nameEN": "Sir Roland (Anno 768)",
    "titleKO": "브르타뉴 변경백, 서로마 최고의 기사, 제국의 성기사 (Paladin)",
    "titleEN": "Count of the Breton March; Paladin",
    "glory": 4500,
    "stats": {
      "SIZ": 20,
      "DEX": 16,
      "STR": 26,
      "CON": 20,
      "APP": 16,
      "HP": 40,
      "MW": 22,
      "UC": 10,
      "KD": 18,
      "HR": 5
    },
    "damage": "8d6+13 (듀란달 보너스)",
    "armor": "23+방패+3 (헥토르의 갑옷 포함)",
    "move": 4,
    "traits": {
      "Chaste": 19,
      "Energetic": 19,
      "Forgiving": 16,
      "Generous": 19,
      "Honest": 11,
      "Just": 13,
      "Merciful": 16,
      "Modest": 1,
      "Prudent": 1,
      "Temperate": 12,
      "Trusting": 15,
      "Valorous": 25
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 25
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 15
      },
      {
        "name": "영예 (Honor)",
        "value": 23
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 14
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "예의 (Courtesy) 18",
      "매사냥 (Falconry) 17",
      "마술 (Horsemanship) 18",
      "수렵 (Hunting) 19",
      "수영 (Swimming) 20"
    ],
    "combatSkills": [
      "전술 (Battle) 16",
      "공선 (Siege) 11",
      "검술 (Sword) 20+13 (듀란달 보너스)",
      "창 (Spear/Polearm) 21",
      "단검 (Dagger) 15",
      "마상창 (Lance) 17"
    ],
    "significantItems": [
      "베일랑티프 (Veillantif - 전쟁 군마)",
      "헥토르의 마법 갑옷 (아머 극대화)",
      "듀란달 (Durendal - 천상의 보검, +13 관통 보너스)",
      "올리판트 (Oliphant - 상아 뿔나팔)"
    ],
    "biographyKO": "샤를마뉴 대제의 누이 베르타와 미요 백작 사이에서 출생하여 제국 최고의 무용을 떨친 영예로운 조카이자 성기사단의 단장입니다. 마법 성검 듀란달(Durendal)과 고대 트로이의 영웅 헥토르의 갑옷(Hector's Armor)을 수령하여 난공불락의 불패 투사가 되었습니다. 그러나 성격적인 크나큰 결함으로 오만함(Modest 1)과 극단적 무모함(Prudent 1)을 지녀, 론세스바예스 협곡에서 증원 뿔나팔을 부는 명예를 거부하다가 전우 올리버를 잃고 장렬히 눈을 감았습니다. 격노 시 이성을 잃는 간질성 '신성한 광분(Divine Fury)'을 발작하기도 합니다.",
    "biographyEN": "Charlemagne's nephew, Count of the Breton March, engagement to Oliver's sister Aude. Nigh-invincible after obtaining Durendal and Hector's Armor. His ultimate flaws are excessive pride and reckless zeal."
  },
  {
    "key": "oliver",
    "nameKO": "비엔의 올리버 경 (Sir Oliver of Vienne)",
    "nameEN": "Sir Oliver of Vienne (Anno 768)",
    "titleKO": "비엔의 영주, 지혜의 성기사 (Paladin)",
    "titleEN": "Paladin of the Realm",
    "glory": 2800,
    "stats": {
      "SIZ": 18,
      "DEX": 22,
      "STR": 18,
      "CON": 26,
      "APP": 23,
      "HP": 44,
      "MW": 26,
      "UC": 11,
      "KD": 18,
      "HR": 4
    },
    "damage": "6d6",
    "armor": "10+방패",
    "move": 4,
    "traits": {
      "Chaste": 16,
      "Energetic": 16,
      "Forgiving": 12,
      "Generous": 13,
      "Honest": 15,
      "Just": 14,
      "Merciful": 16,
      "Modest": 10,
      "Prudent": 19,
      "Temperate": 10,
      "Trusting": 13,
      "Valorous": 18
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 19
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 15
      },
      {
        "name": "영예 (Honor)",
        "value": 23
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 18
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "예의 (Courtesy) 19",
      "웅변 (Eloquence) 16",
      "매사냥 (Falconry) 18",
      "구급 (First Aid) 16",
      "마술 (Horsemanship) 20",
      "종교 지식 (Religion) 10",
      "장원 관리 (Stewardship) 10"
    ],
    "combatSkills": [
      "전술 (Battle) 25",
      "공선 (Siege) 15",
      "검술 (Sword) 24",
      "창술 (Spear) 21",
      "단검 (Dagger) 13",
      "마상창 (Lance) 17"
    ],
    "significantItems": [
      "페랑 (Ferrant - 명마)",
      "오트클레르 (Halteclere - 성검, 론세스바예스 돌파검)"
    ],
    "biographyKO": "몽글란 가문 출신으로, 롤랑과 비견되는 제국의 지혜의 성기사입니다. 극도로 수려한 외모(APP 23)와 민첩성(DEX 22)을 자랑하며, 지혜롭고 사려 깊어 롤랑의 오만함과 무모함을 언제나 든든하게 보완해 주었습니다. '롤랑은 용맹하지만, 올리버는 현명하다'는 롤랑의 노래 87절의 구절이 그의 정체성을 상징합니다. 그의 성검 오트클레르(Halteclere)는 은으로 제련된 아름다운 자루와 무시무시한 참수력을 가졌으며 론세스바예스 전투에서 수많은 아랍 전사를 쓰러뜨렸습니다.",
    "biographyEN": "A member of the House of Monglane. Known for his great wisdom and keen senses, representing the intellectual and cautious counterpart to Roland. 'Roland is valiant, Oliver is wise.'"
  },
  {
    "key": "astolf",
    "nameKO": "잉글랜드의 아스톨프 경 (Sir Astolf of England)",
    "nameEN": "Sir Astolf of England (Anno 773)",
    "titleKO": "잉글랜드의 왕자, 기상천외한 성기사 (Paladin)",
    "titleEN": "Prince of England; Paladin",
    "glory": 4100,
    "stats": {
      "SIZ": 16,
      "DEX": 7,
      "STR": 17,
      "CON": 24,
      "APP": 20,
      "HP": 30,
      "MW": 17,
      "UC": 8,
      "KD": 13,
      "HR": 3
    },
    "damage": "5d6",
    "armor": "10+방패+3",
    "move": 2,
    "traits": {
      "Chaste": 15,
      "Energetic": 17,
      "Forgiving": 16,
      "Generous": 18,
      "Honest": 19,
      "Just": 14,
      "Merciful": 15,
      "Modest": 10,
      "Prudent": 6,
      "Temperate": 12,
      "Trusting": 16,
      "Valorous": 17
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 18
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 15
      },
      {
        "name": "영예 (Honor)",
        "value": 21
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 15
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "인식/경계 (Awareness) 18",
      "예의 (Courtesy) 20",
      "웅변 (Eloquence) 20",
      "음모 (Intrigue) 15",
      "인식 (Recognize) 18",
      "연애예법 (Romance) 15"
    ],
    "combatSkills": [
      "전술 (Battle) 15",
      "공선 (Siege) 10",
      "검술 (Sword) 20",
      "창술 (Spear) 20",
      "단검 (Dagger) 10",
      "마상창 (Lance) 12"
    ],
    "significantItems": [
      "황금 마창 (Golden Lance - 건드리기만 해도 낙마시키는 100% 명중마창)",
      "공포의 뿔나팔 (Horn of Terror - 듣는 적을 도망치게 만드는 뿔피리)",
      "주문 해제 고서 (Book of Spell Breaking - 요정의 마법 해제)"
    ],
    "biographyKO": "잉글랜드 오파 국왕의 둘째 아들로, 검술이나 물리적인 완력은 떨어지지만 뛰어난 사교성, 미려한 용모(APP 20), 그리고 무엇보다도 기상천외한 마법 유물들을 모으고 다루는 재주가 뛰어난 천재적인 기사입니다. 상대를 무조건 낙마시키는 황금 마창(Golden Lance)과 악마마저 도망치게 만드는 공포의 뿔나팔(Horn of Terror)을 무기로 썼습니다. 전설적인 히포그리프(반독수리 반말)를 타고 달나라까지 올라가 롤랑이 사랑의 고열로 상실했던 이성(Wits)을 병에 담아 복구해 낸 신화적인 업적을 이룬 위대한 모험가입니다. 말년에 마옌스 백작으로서 성자 대열에 합류하였습니다.",
    "biographyEN": "King Offa's second son. Famous for his good looks, courtly courtesy, and legendary magic items (Golden Lance, Horn of Terror, Spell Book). He rode a hippogriff to the moon to recover Roland's lost wits."
  },
  {
    "key": "renaud",
    "nameKO": "몽토방의 르노 경 (Sir Renaud of Montalban)",
    "nameEN": "Sir Renaud of Montalban (Anno 768)",
    "titleKO": "몽토방의 백작, 반란의 성기사 (Paladin)",
    "titleEN": "Paladin of the Realm",
    "glory": 3300,
    "stats": {
      "SIZ": 20,
      "DEX": 18,
      "STR": 22,
      "CON": 18,
      "APP": 12,
      "HP": 52,
      "MW": 18,
      "UC": 9,
      "KD": 18,
      "HR": 4
    },
    "damage": "7d6",
    "armor": "10+방패",
    "move": 4,
    "traits": {
      "Chaste": 4,
      "Energetic": 17,
      "Forgiving": 6,
      "Generous": 10,
      "Honest": 16,
      "Just": 9,
      "Merciful": 17,
      "Modest": 1,
      "Prudent": 14,
      "Temperate": 16,
      "Trusting": 11,
      "Valorous": 22
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 15
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 24
      },
      {
        "name": "영예 (Honor)",
        "value": 22
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 9
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "요정 전설 (Faerie Lore) 14",
      "구급 (First Aid) 16",
      "마술/보드게임 (Gaming) 16",
      "문장학 (Heraldry) 16",
      "마술 (Horsemanship) 24"
    ],
    "combatSkills": [
      "전술 (Battle) 15",
      "공선 (Siege) 15",
      "검술 (Sword) 20+14 (프로베르주 보너스)",
      "창술 (Spear) 17",
      "단검 (Dagger) 14",
      "마상창 (Lance) 14"
    ],
    "significantItems": [
      "바야르 (Bayard - 마법 비행 군마)",
      "프로베르주 (Froberge - 마법성검, +14 공격 보너스)"
    ],
    "biographyKO": "에몽 백작의 네 아들 중 첫째이자 가장 뛰어난 기사로, 대제에게 무릎 꿇지 않는 기백을 가졌습니다. 사촌 마법사 모지 경과 협력하여 난공불락의 요새 몽토방(Montalban)을 건설하고, 마법마 바야르를 타고 샤를마뉴 대제의 봉건적 억압에 정면으로 대항했습니다. 성격적으로 엄청난 오만함을 가졌으나, 가족애와 용맹만큼은 그 누구보다 높습니다. 대제와의 평화를 위해 눈물을 머금고 자신의 마법마 바야르를 헌상하여 희생하였고, 이후 여생을 예루살렘 성지 십자군 전역에서 속죄하며 보낸 파란만장한 영웅입니다. 그의 칼 프로베르주(Froberge)는 이교도의 혼을 쥐고 흔드는 붉은 검광을 내뿜습니다.",
    "biographyEN": "The eldest and most formidable of Aymon's four sons. Renaud is the proudest knight of Frankland, riding the magic horse Bayard. He staged a legendary rebellion against Charlemagne before making peace and crusading."
  },
  {
    "key": "william",
    "nameKO": "창코 기욤 / 나르본의 기욤 경 (Sir William Shortnose)",
    "nameEN": "Sir William Shortnose (Anno 775)",
    "titleKO": "셉티마니아 공작, 제국의 성기사 (Paladin)",
    "titleEN": "Paladin of the Realm",
    "glory": 5400,
    "stats": {
      "SIZ": 21,
      "DEX": 14,
      "STR": 24,
      "CON": 20,
      "APP": 9,
      "HP": 40,
      "MW": 20,
      "UC": 10,
      "KD": 20,
      "HR": 4
    },
    "damage": "7d6",
    "armor": "10+방패+3",
    "move": 4,
    "traits": {
      "Chaste": 12,
      "Energetic": 19,
      "Forgiving": 14,
      "Generous": 20,
      "Honest": 6,
      "Just": 16,
      "Merciful": 17,
      "Modest": 5,
      "Prudent": 10,
      "Temperate": 5,
      "Trusting": 5,
      "Valorous": 20
    },
    "directedTraits": "없음",
    "passions": [
      {
        "name": "샤를마뉴에 대한 사랑 (Love [Charlemagne])",
        "value": 18
      },
      {
        "name": "가족에 대한 사랑 (Love [Family])",
        "value": 20
      },
      {
        "name": "영예 (Honor)",
        "value": 25
      },
      {
        "name": "신에 대한 사랑 (Love [God])",
        "value": 18
      }
    ],
    "ideals": "기사도적 기사 (Chivalrous)",
    "skills": [
      "경계 (Awareness) 16",
      "예의 (Courtesy) 16",
      "수렵 (Hunting) 17",
      "음모 (Intrigue) 16",
      "외국어 (Languages) 13",
      "인식 (Recognize) 19",
      "연애예법 (Romance) 12"
    ],
    "combatSkills": [
      "전술 (Battle) 18",
      "공선 (Siege) 17",
      "검술 (Sword) 23",
      "창술 (Spear/Polearm) 21",
      "단검 (Dagger) 13",
      "마상창 (Lance) 22"
    ],
    "significantItems": [
      "보호의 액막이 부적 (Protective Talisman)"
    ],
    "biographyKO": "몽글란 가문의 나르본 백작 아이메리의 아들로, 사라센과의 일대 결투 중 코끝이 잘려 나가 '창코 기욤(Shortnose)'이라는 영광스러운 훈명을 얻은 전사입니다. 물려받을 영지가 없는 가난한 무지 기사로 시작했으나, 타고난 낙천적인 배짱과 호탕함, 불타는 애국심으로 남부 프랑크 영토를 위협하는 사라고사의 아랍 침략자들을 물리쳐 셉티마니아 공작이 되었습니다. 샤를마뉴의 억지스러운 아들 왕세자 루이를 보필하며 제국 최후의 충성 보루가 되었습니다. 화가 나면 성문지기를 단숨에 때려죽이는 불같은 다혈질이기도 하지만, 언제나 사후에 유족에게 명예로운 배상금(Wergild)을 정중하게 지불했던 특유의 상남자 기질을 품었습니다.",
    "biographyEN": "Aymeri's brave son who acquired the title Duke of Septimania in 790. Known for his boisterous laugh, quick temper, and absolute loyalty to the crown, defending the southern marches against Saracens."
  }
];

export const paladins = [
  {
    "nameEN": "Anseïs of Carthago",
    "nameKO": "카르타고의 안세이스",
    "knighted": "779년",
    "companion": "창코 기욤",
    "desc": "브르타뉴 리파이 경의 아들로 론세스바예스에서 장렬히 전사한 후 코르도바 공주 고디사와 혼인하여 스페인 공작으로 분투함."
  },
  {
    "nameEN": "Anseïs the Proud",
    "nameKO": "오만한 안세이스",
    "knighted": "767년",
    "companion": "삼손",
    "desc": "디종 자작의 아들로 롤랑, 오지에와 함께 전장에서 함께 첫 서임을 받았던 제국 1세대 명예로운 오만한 성기사."
  },
  {
    "nameEN": "Aymonnet",
    "nameKO": "에모네 (르노의 장남)",
    "knighted": "795년",
    "companion": "요네 (동생)",
    "desc": "르노 경의 맏아들로 동생 요네와 절대 떨어지지 않는 단짝이며 주로 가문의 적인 비열한 마옌스 가문과의 불화 복수극에서 대활약함."
  },
  {
    "nameEN": "Baldwin the Brave",
    "nameKO": "용맹한 보두앵",
    "knighted": "779년",
    "companion": "베라르",
    "desc": "배신자 가늘롱 백작의 셋째 아들이나, 부친의 사악함과 달리 지극히 신의 있고 예의 바른 신앙 기사로 작센 공작을 역임하다 전사."
  },
  {
    "nameEN": "Berard of Ardennes",
    "nameKO": "아르덴의 베라르",
    "knighted": "781년",
    "companion": "용맹한 보두앵",
    "desc": "아르덴의 티에리 공작의 첫째 아들로 무모하고 Lustful(욕망)한 기질이 돋보이는 전사로, 작센과의 혹한 삼림 전쟁에서 활약."
  },
  {
    "nameEN": "Berenger the Gascon",
    "nameKO": "가스코뉴의 베랑제",
    "knighted": "767년",
    "companion": "오도 경",
    "desc": "겸손한 종자들의 전투에서 대공을 세우고 즉시 성기사로 발탁된 날랜 전사로, 제국 최고의 고참 승마술의 일인자."
  },
  {
    "nameEN": "Bertrand of Narbonne",
    "nameKO": "나르본의 베르트랑",
    "knighted": "792년",
    "companion": "용맹한 비비앙",
    "desc": "창코 기욤 백작의 용감한 조카로 예하 기사단과 함께 프로방스 수복 전쟁의 최선봉에 서서 바르바스트로에서 활약하고 아라비아 공주와 혼인."
  },
  {
    "nameEN": "Bradamant the Maiden",
    "nameKO": "여전사 브라다만테",
    "knighted": "773년",
    "companion": "로제로 (남편)",
    "desc": "에몽 백작의 고결하고 용맹무쌍한 딸이자 12성기사의 유일한 여성 기사. 적장 로제로와 사랑에 빠져 그를 침례하고 운명적 혼인을 맺음."
  },
  {
    "nameEN": "Engelier of Bordeaux",
    "nameKO": "보르도의 앙젤리에",
    "knighted": "773년",
    "companion": "안주의 제라르",
    "desc": "오지에가 이탈리아로 탈영하자 황제가 징집한 정중한 궁정 예법의 명가 출신 성기사로, 고도의 마상창 기술과 감미로운 음악 재능 소유자."
  },
  {
    "nameEN": "Eric of Friuli",
    "nameKO": "프리울리의 에리크",
    "knighted": "789년",
    "companion": "바이에른의 게롤트",
    "desc": "에티코니드 가문의 기둥이자 프리울리 공작. 뛰어난 대열 전술가이자 지휘관으로 아바르 족의 반란에 맞서 웅장하게 전사함."
  },
  {
    "nameEN": "Galien the Restored",
    "nameKO": "정화자 갈리앙",
    "knighted": "788년",
    "companion": "없음 (단독)",
    "desc": "성기사 올리버와 비잔티움 공주 사이에 태어나 동양에서 자란 후, 아버지를 해친 사라센 악귀들을 징벌하고 예루살렘의 국왕에 오름."
  },
  {
    "nameEN": "Geoffrey of Anjou",
    "nameKO": "안주의 조프루아",
    "knighted": "786년",
    "companion": "없음 (단독)",
    "desc": "안주의 티에리 백작의 아들로 평소에는 극도로 신사적이고 온화하지만, 전선에 서면 짐승 같은 괴력을 뿜어내는 공포의 전사."
  },
  {
    "nameEN": "Gerard of Anjou",
    "nameKO": "안주의 제라르",
    "knighted": "773년",
    "companion": "앙젤리에",
    "desc": "사치와 화려한 궁정 예법을 멀리하고 극도로 spartan하고 금욕적인 신앙 생활을 일관하여 살아있는 성자로 대우받은 경건 기사."
  },
  {
    "nameEN": "Gerold II of Bavaria",
    "nameKO": "바이에른의 게롤트 2세",
    "knighted": "789년",
    "companion": "프리울리의 에리크",
    "desc": "황제의 처남이자 검술 스승으로 명망이 높았으며 타실로 공작의 폐위 이후 바이에른의 공작 겸 수호 성기사단장으로 부임함."
  },
  {
    "nameEN": "Guy of Burgundy",
    "nameKO": "부르고뉴의 기",
    "knighted": "767년",
    "companion": "와랭 경",
    "desc": "가스코뉴 공작 욘의 친척이자 몽글란 가문의 영광스러운 후손으로, 항상 쾌활하고 호탕한 유머 감각을 자랑하는 전투 사령관."
  },
  {
    "nameEN": "Hamon of Galicia",
    "nameKO": "갈리시아의 아몽",
    "knighted": "779년",
    "companion": "프리지아의 랭볼",
    "desc": "갈리시아의 고결한 공작으로 프리지아 백작 랭볼과 긴밀한 형제 서약을 맺고 아바르 캠페인에서 제국의 국경을 수호하다 전사."
  },
  {
    "nameEN": "Huon of Bordeaux",
    "nameKO": "보르도의 위옹",
    "knighted": "808년",
    "companion": "오베론 (요정왕)",
    "desc": "용맹하지만 다혈질인 청년으로, 황제의 미움을 사 불가능한 요정 숲 퀘스트를 수행하고 아발론 요정왕 오베론의 후계자가 됨."
  },
  {
    "nameEN": "Ivory the Foundling",
    "nameKO": "고아 이보리",
    "knighted": "767년",
    "companion": "검은 이보",
    "desc": "도온 백작 밑에서 자란 고아로 모든 Moors(이교도)들을 몰아내거나 성수를 입히기 전까진 결코 여인을 안지 않겠다는 무서운 고결 맹세 기사."
  },
  {
    "nameEN": "Maillefer",
    "nameKO": "마유페르",
    "knighted": "810년",
    "companion": "없음",
    "desc": "사라센 거인의 괴력과 성기사의 지혜를 동시에 물려받아 아헨의 궁성을 멀리하고 단독으로 알프스 바위 절벽을 방랑하는 철퇴 기사."
  },
  {
    "nameEN": "Odo of Lengres",
    "nameKO": "랑그르의 오도",
    "knighted": "767년",
    "companion": "베랑제",
    "desc": "매우 감미로운 사랑 노래와 로맨틱한 시를 지어 어전을 황홀하게 미소 짓게 만든 음유시인 출신의 백작이자 성기사단원."
  },
  {
    "nameEN": "Rainouart",
    "nameKO": "레누아르 (거인 성기사)",
    "knighted": "793년",
    "companion": "없음",
    "desc": "사라센 에미르의 아들이었으나 프랑크 왕실 주방의 심부름꾼으로 자랐다. 300kg에 달하는 거대한 쇠몽둥이로 아랍 군대를 날려버림."
  },
  {
    "nameEN": "Raimbold of Frisia",
    "nameKO": "프리지아의 랭볼",
    "knighted": "779년",
    "companion": "갈리시아의 아몽",
    "desc": "평생 청빈과 소박을 서약하고 고향 프리지아인들을 전원 가톨릭으로 침례 시키는 성스러운 목적을 달성한 선교 전사 성기사."
  },
  {
    "nameEN": "Rogero the Moor",
    "nameKO": "무어인 로제로",
    "knighted": "779년",
    "companion": "브라다만테 (부인)",
    "desc": "사라센 제일의 용사이자 마술사 아틀란테스의 보살핌을 받았던 불패의 무인. 운명의 상대 브라다만테를 만나 개종하고 불가리아의 왕이 됨."
  },
  {
    "nameEN": "Salomon of Brittany",
    "nameKO": "브르타뉴의 살로몽",
    "knighted": "779년",
    "companion": "덴마크인 오지에",
    "desc": "브르타뉴의 Samson 공작의 장남으로 프랑크 법률 학문을 완전히 공부한 행정가였으며 브르타뉴 공국을 수호하다 마상 대회 중 낙마사함."
  },
  {
    "nameEN": "Samson of Brittany",
    "nameKO": "브르타뉴의 삼손",
    "knighted": "767년",
    "companion": "오만한 안세이스",
    "desc": "본래 켈트 브레통 인질이었으나 세례를 받고 제국에 귀화한 1세대 대성기사로, 자신의 옛 부족과의 수많은 변경 분쟁을 철저하게 진압함."
  },
  {
    "nameEN": "Sancho the Gascon",
    "nameKO": "가스코뉴의 산초",
    "knighted": "786년",
    "companion": "없음",
    "desc": "가스코뉴 욘 공작의 장남으로 어릴 때 인질로 궁정에서 자란 후, 황제 아들 루이 9세 예하에서 스페인 정벌의 최고 돌격사령관이 됨."
  },
  {
    "nameEN": "Sevin of Bordeaux",
    "nameKO": "보르도의 세뱅",
    "knighted": "779년",
    "companion": "아스톨프",
    "desc": "보르도의 위옹의 부친이자 기옌의 대공작. 오랜 로렌 가문과의 친족 혈투 때문에 북방 프랑크 백작들에게 의심을 사나, 황태자를 구하고 장렬히 전사."
  },
  {
    "nameEN": "Thierry of Anjou",
    "nameKO": "안주의 티에리",
    "knighted": "783년",
    "companion": "없음",
    "desc": "전사한 보두앵과 베라르의 복수를 서약하고 일어선 안주의 젊은 기사로, 론세스바예스 배신 재판에서 가늘롱 가문의 결투 투사 피나벨을 결투로 척살함."
  },
  {
    "nameEN": "Vivien the Fearless",
    "nameKO": "용맹무쌍 비비앙",
    "knighted": "792년",
    "companion": "나르본의 베르트랑",
    "desc": "창코 기욤의 불같은 성정을 그대로 물려받은 조카로 서임식 날 '사라센 기병 앞에서 단 한 보도 물러서지 않겠다'고 서약하여 아르샹에서 최후까지 버티다 순국."
  },
  {
    "nameEN": "Warin of Vergy",
    "nameKO": "베르지의 와랭",
    "knighted": "767년",
    "companion": "부르고뉴의 기",
    "desc": "아베르뉴 출신의 수렵과 덫의 명수이자 제국 12인의 오리지널 대성기사 중 한 명. 그의 아들 이장바르는 훗날 전쟁 중 샤를마뉴의 목숨을 구함."
  },
  {
    "nameEN": "Yonnet",
    "nameKO": "요네 (르노의 차남)",
    "knighted": "795년",
    "companion": "에모네 (형)",
    "desc": "르노 경과 사라센 왕녀 클라리사의 둘째 아들로, 형 에모네와 함께 몽토방 가문의 성검 명예를 회복하기 위해 제국 궁정의 음모에 맞서 싸움."
  },
  {
    "nameEN": "Yvo the Black",
    "nameKO": "검은 이보",
    "knighted": "767년",
    "companion": "고아 이보리",
    "desc": "바젤의 수호 백작으로 가슴 밑까지 내려오는 무성한 검은 수염과 흑색 장발이 특징인 맹장이며 친구 이보리의 모든 스페인 순례길을 끝까지 호위함."
  }
];

export const cultures = [
  {
    "key": "basques",
    "nameKO": "바스크 산악 세력 (Basques)",
    "nameEN": "The Basques",
    "emoji": "⛰️",
    "modifiers": {
      "SIZ": "-1",
      "CON": "+1"
    },
    "names": {
      "men": "Aitor, Centulo, Domingo, Eneko, Lupus, Otxoa, Pelayo, Sancho, Xabier",
      "women": "Garbina, Munia, Oneca, Zutoia, Sancha"
    },
    "appearanceKO": "피레네 산맥의 단단하고 강인한 체구(SIZ -1, CON +1)를 지닌 검은 머리의 산악인들입니다. 이교도에 버금가는 매서운 독수리 눈빛을 가졌습니다.",
    "characterKO": "독립심과 부족적 자부심(Proud)이 극도로 높으며, 외세의 강제적 사법 권위를 극도로 거부(Arbitrary)하고 부족 법률만 따릅니다. 가문 복수극을 즐깁니다.",
    "skillsKO": "산악 추적 및 덫 설치, 기습 징후 포착(Awareness +5), 고산 요정 숲 전설(Faerie Lore/Folk Lore +5)",
    "relationsKO": "768년 가스코뉴 대공이 황제에게 복종했으나 바스크인들은 계속 게릴라 항쟁을 전개했습니다. 778년 론세스바예스 고개에서 아랍 무어인 세력과 결탁하여 롤랑의 프랑크 후위군을 습격하고 전멸시켰습니다.",
    "chronology": [
      {
        "year": "768년",
        "event": "바스크의 옥초아 대공이 대제에게 형식적인 연공 상납을 조인했으나 실제 독립을 고수함."
      },
      {
        "year": "778년",
        "event": "론세스바예스 협곡 습격. 롤랑과 12성기사가 장렬히 순국하고 옥초아 대공도 전사함."
      },
      {
        "year": "812년",
        "event": "제2차 론세스바예스 산악 전투 발생 후 프랑크 황실에 조건부 굴복."
      }
    ],
    "dailyLifeKO": "피레네 산간 협곡의 척박한 판자촌에서 양을 치며 목축업으로 먹고삽니다. 모계 사회 전통이 남아 있어 귀부인들이 재산을 상속하며 영향력 있는 사법 고문관을 맡습니다.",
    "warfareKO": "중기병 마창 기동은 전혀 하지 않으며 경무장 기마 포니를 애용합니다. 숲과 협곡에 숨어 있다가 휩쓸고 지나가는 Hit-and-Run 기습 전술의 명수입니다.",
    "equipmentKO": "족장: 가죽 갑옷 (아머 6), 목제 둥근 방패, 투창 및 산악용 검.\n풋맨: 산짐승 모피 갑옷 (아머 4), 화살 및 돌팔매 물맷돌.",
    "codeOfHonorKO": "프랑크의 기사도 서약이나 봉건제(Homage)를 이교도의 기만술로 취급하여 절대 따르지 않으며 오직 친족(Family Loyalty)과 가문의 복수만을 최고의 의무로 삼습니다.",
    "fortificationsKO": "성곽을 짓지 않고 대신 높은 봉우리에 목조 망루(Watch Tower)를 조밀하게 세워 적의 침입 시 신속히 동굴로 대피합니다.",
    "appearanceEN": "These stocky mountain folks are not very tall (–1 SIZ), but usually stronglybuilt, resilient (+1 CON) and darkhaired. Some have blue eyes, but all have a proud, penetrating look that puts foreigners ill at ease.",
    "characterEN": "The main Basques characteristic is their deep sense of independence and pride (Proud). They are very intolerant of authority (Arbitrary) and are often described as taciturn, treacherous and fickle (Deceitful). They obey only to their family and clan (Love [family]).",
    "skillsEN": "The Basques are widely known for their keen sight and hearing (Awareness), and for their numerous legends and superstitions (Folk Lore, Faerie Lore).",
    "relationsEN": "The Basque country is part of the duchy of Gascony and, as such, a part of the Frankish kingdom. However, when Duke Lupus of Gascony does homage to Charlemagne in 768, the Basques revolt and become a semiindependent nation whose leader pays only lipservice to the Franks. In 778, some local chieftains ally with the Moors at the slaughter of Roncevaux. At the death of their leader they once more pay homage to the Franks, but Charlemagne’s authority over the Basques remains weak at best.",
    "dailyLifeEN": "Pamplona, the seat of the duke, is the only Basque town. Basques live almost exclusively in poor mountain villages, where they practice sheep herding. Their way of life is completely selfsufficient, so they trade very little with the outside world. W omen have a large role in Basque society. Indeed, families are based on matrilineal kinship. W omen have a voice as esteemed councilors and they may own property and land.",
    "warfareEN": "Basques fight as mountain warriors. They have no cavalry, though they use their sturdy mountain ponies to carry equipment. They try to avoid open battle in the plains, preferring hitand-run guerrilla warfare and ambushes, which allow them to take full advantage of the mountainous terrain.",
    "equipmentEN": "Nobles: Leather armor (6 points), wooden shield (6 points); spear, sword, dagger. Footmen: Animal skin armor (4 points), small wooden shield (4 points); spear or javelins, hand axe, bow or sling, dagger.",
    "codeOfHonorEN": "Knighthood, and chivalry especially, are unknown to the Basques. Their individual honor is based solely on family reputation. As a result, family feuds are numerous and longlasting. The Basques are fundamentally hostile to any centralized power and are only superficially feudalized, having preserved many elements of their tribal society. Therefore, they often refuse to do homage or swear fealty to a Frankish overlord. When they do, such an oath has no value for them and they unhesitatingly break any promise that goes against the interest of their clan or family.",
    "fortificationsEN": "The Basques do not build castles. In case of impending trouble, wooden watch towers are used to inform the population, who may flee into hidden mountain caves if necessary."
  },
  {
    "key": "bretons",
    "nameKO": "켈트 브레통 세력 (Bretons)",
    "nameEN": "The Bretons",
    "emoji": "⛵",
    "modifiers": {
      "SIZ": "-2",
      "CON": "+1",
      "APP": "-1"
    },
    "names": {
      "men": "Aquin, Conan, Doret, Eon, Gwion, Karadeg, Morvan, Nominuë, Salaoun, Warok",
      "women": "Azenor, Enored, Erdisa, Madenn, Nolwenn"
    },
    "appearanceKO": "프랑크의 서쪽 반도 끝자락에 거주하는 왜소하고 단단한 켈트인들입니다. 야성적인 털수염을 기르고 흑백의 누비옷을 걸치고 다닙니다.",
    "characterKO": "매우 고집이 세고 완고하며 호전적입니다. 프랑크인들은 이들을 '야수와 같다'고 혹평하였으며, 끈질긴 반란 투지(Energetic)를 자랑합니다.",
    "skillsKO": "늪지대 길 찾기, 삼림 사냥 및 도끼 던지기, 신비로운 켈트 요정 숲 전설(Faerie Lore +5)",
    "relationsKO": "삼손 공작과 살로몽 공작을 성기사로 흡수하였으나 부족민들은 끝없이 반란을 전개하여 브르타뉴 변경백인 롤랑 경이 철통 방어선을 유지했습니다.",
    "chronology": [
      {
        "year": "753년",
        "event": "피핀 국왕이 브르타뉴 변경령을 최초 설치하고 군대를 전진 배치함."
      },
      {
        "year": "768년",
        "event": "롤랑 경이 브르타뉴 변경백으로 임명되어 철통 요새를 사수함."
      },
      {
        "year": "786년",
        "event": "대제의 대규모 징벌군 진입 후 살로몽 공작을 영주로 봉하고 잠정 굴복시킴."
      }
    ],
    "dailyLifeKO": "울창한 참나무 숲과 갯벌 근방의 통나무 요새촌에 밀집하여 수산업과 가축 사육으로 생계를 꾸려 나갑니다. 무역은 거의 전무하여 몹시 가난합니다.",
    "warfareKO": "마구 마갑이 없는 정찰용 Rouncy 경기병을 활용하며, 삼림 덤불 속에 깊은 참호를 파 기마 돌격을 무력화시키는 늪지 전술을 씁니다.",
    "equipmentKO": "족장: 사슬 메일 조끼 (아머 8), 라운드 철제 투구, 전투용 검.\n풋맨: 누비 가죽옷 (아머 6), 마상창, 단검 및 활.",
    "codeOfHonorKO": "야만적인 부족 결의만 중시하며 포로 몸값 협상 대신 오직 동등한 포로 맞교환(Exchange)만을 수락하는 거친 사법률을 가졌습니다.",
    "fortificationsKO": "강변의 통로를 거대 통나무 바리케이드로 봉쇄하는 게르슈(Guerche) 방벽 요새를 운용합니다.",
    "appearanceEN": "The Bretons are a short (–2 SIZ), stocky (+1 CON), darkhaired, and rather unsophisticated people (–1 APP). The men can be recognized by their wild beards, and they often dress in simple black and white clothes.",
    "characterEN": "They originally came from Britain, from the end of the world. (…) That people, dishonest and pompous, have been in rebellion up to now, and lacking in goodwill. (…) They take no thought for orphans, widows, churches. A man will lie down with his sister; one brother will rape another brother’s wife; everyone lives incestuously with everyone else; wickedness abounds. They live in briar patches and sleep in the woods and rejoice to live by theft in the manner of beasts. The force of justice claims no hall for itself with them, and the proper kinds of judgments escape them. — Ermold the Black , III The word “Breton” is derived from “brutal.” On the main Breton character traits are quite negative, with a reputation of being Deceitful, Lustful, Arbitrary and Cowardly, but they are also recognized as quite Energetic.",
    "skillsEN": "The Bretons live close to nature and know the secrets about the woods and its wild life (Folk Lore, Hunting), as well as many stories about the Other W orld (Faerie Lore). Almost all Bretons have a knack for music (Play Instruments).",
    "relationsEN": "In the beginning of Charlemagne’s reign, the Bretons pay tribute in return for their independence. The converted Duke Samson of Brittany collects these taxes, but despite his title he does not rule over the Armorican peninsula. After the disaster at Roncevaux, the Breton leaders refuse to do homage and no longer send their traditional gifts, so Charlemagne orders the conquest of Brittany.",
    "dailyLifeEN": "The people usually live in a small village on top of a hill, protected by a wooden palisade. Most houses are square wooden dwellings with low thatched roofs. The locals make a living from fishing and cattle herding. The whole of Brittany is quite poor, and trade with other lands almost nonexistent.",
    "warfareEN": "They have often taken the path to our lands, but they do not go back to theirs unharmed. — Ermold the Black , III Bretons are mainly seasonal raiders. In battle they rely on light cavalry without horsearmor. Their favorite guerrilla tactic is to set traps and prepare ambushes for Frankish horsemen. Avoiding open battle with the superior Frankish troops, they often pretend to retreat and then turn around to attack. When cornered, the forest provides them with hidden routes which allow them to return unseen and attack their opponents in the back. Their few rules of honor are barbarian and as variable as the local weather. Bretons rarely ask a ransom for their prisoners, but they do accept the exchange of captured foes. Local chieftains build fortified barriers named guerches, which serve to block the waterways into the hinterland. These local magnates may live in a wooden or, rarely, stone tower. At best, the few Breton “kings” live in what they call a castle: [The king ] lives in a place with woods on one side and a nice stream on the other, situated amidst hedges, trenches and a swamp. Inside was a grand stone tower house that shone with the splendor of weapons whenever it happened to be filled with different soldiers. — Ermold the Blac k, III",
    "equipmentEN": "Nobles: Ring mail armor and round iron helmet (8 points), wooden shield (6 points); spear, iron sword, dagger; rouncy, courser. Horsemen: Leather armor (6 points); spear, dagger; rouncy. Footmen: Leather armor (6 points), wooden shield (6 points); spear, dagger.",
    "codeOfHonorEN": "",
    "fortificationsEN": ""
  },
  {
    "key": "britons",
    "nameKO": "아일랜드 & 브리튼 연맹 (Britons)",
    "nameEN": "The Britons",
    "emoji": "🛡️",
    "modifiers": {
      "DEX": "+0"
    },
    "names": {
      "men": "Ailward, Cenric, Coenwulf, Ecfrid, Edmund, Egbert, Harold, Offa, Zerbin",
      "women": "Alvina, Ethel, Maud, Mildredd, Rowena, Wilona"
    },
    "appearanceKO": "바다 너머 브리튼 섬에 거주하는 전사들로 프랑크인과 흡사하나 적발과 금발이 흔합니다. 귀족들은 단정한 수염을 다듬고 체크무늬 모직 옷을 입습니다.",
    "characterKO": "샤를마뉴 대제를 존경하며 성실하게 복무하길 갈망합니다. 몹시 성실하고 정직하며(Honest), 검소하고 경건한(Temperate) 기사도 신사입니다.",
    "skillsKO": "해안선 항해 및 도서 지리 지식, 사교 예법(Courtesy +5), 웅변 및 풍자 시 작시(Eloquence +5)",
    "relationsKO": "대제를 큰아버지이자 은인으로 여겨 덴마크 해적 바이킹을 몰아내는 방패로 삼았으며 아스톨프 왕자를 아헨의 궁정에 사절로 파견했습니다.",
    "chronology": [
      {
        "year": "789년",
        "event": "대제가 아들을 오파 국왕의 딸과 정략혼 하려 했으나 혼인 조건 마찰로 조율 실패."
      },
      {
        "year": "793년",
        "event": "덴마크 바이킹 해적들이 노섬브리아의 린디스파른 성당을 약탈하자 프랑크와 연대 구축."
      },
      {
        "year": "796년",
        "event": "대제의 우방 오파 국왕이 서거하자 브리튼 전역이 심각한 전란에 휩싸임."
      }
    ],
    "dailyLifeKO": "로마가 건설한 고대 가도와 항구를 관리하며 양모 가공업과 상업을 전개합니다. 성당과 스크립토륨(필사실) 중심의 기독교 학문 부흥에 열성입니다.",
    "warfareKO": "말이 몹시 비싸고 귀하여 전투 시 말에서 내려 방패벽을 짜고 싸우며, 후방에서 롱보우 장궁의 정밀 화망 지원을 전개하는 전술을 애용합니다.",
    "equipmentKO": "기사: 사슬 갑옷과 철제 투구 (아머 8), 목제 카이트 쉴드, 브로드소드.\n보병: 가죽 흉갑 및 모자 (아머 5), 투창 및 목제 단궁.",
    "codeOfHonorKO": "프랑크의 정통 기사도 법률(Chivalry)과 사법 결투, 봉건 맹세를 완벽히 신뢰하고 정중히 따릅니다.",
    "fortificationsKO": "로마의 석조 성벽을 보강하여 사용하거나 언덕 위에 목조 모트-앤-베일리(Motte-and-Bailey) 성채를 건설하여 항전합니다.",
    "appearanceEN": "The people of the British Isles are much like the Franks, though more of them have red hair. Most nobles shave, though the ones from the isolated regions, such as Scotland or Cornwall, let their beards and hair grow. When not in armor, they wear checkered shirts and fine linen trousers, whereas the women dress in an elegant RomanoBritish style unique to the Isles.",
    "characterEN": "Britons are civilized gentlemen, much like the good Sir Astolf. The nobles try to follow the example of the Franks. As a people they are particularly lauded for their hard work (Energetic), sincerity (Honest) and their rather frugal way of life (T emperate).",
    "skillsEN": "The Britons are a seagoing nation of adventurers and merchants (Stewardship). They are known for their refinement and good manners (Courtesy), their sharp tongue and their particular sense of humor (Eloquence). The Britons are fervent Christians (Religion). Indeed, many monks and priests travel from the Isles to go and live in a monastery or an hermitage on the continent (Love [God]).",
    "relationsEN": "The Britons take example from their respected Frankish brothers for many things. Charlemagne looks upon the British princes as his sons, and he is their natural ally against the Danes. Many British nobles send their sons to the continent to receive a proper knightly education at one of the Frankish courts.",
    "dailyLifeEN": "Apart from a few urban centers like London or Y ork, most Britons live on the countryside in small farming communities. The peasants make their living from herding, especially sheep and goats. Along the coast, fishermen sail out daily on their small boats. In general, the Britons are not as rich as the Franks.",
    "warfareEN": "British lords are often not as well equipped as their Frankish counterparts. They largely rely on levies of scantily armored footmen, with only a few knights to command them. The rare and expensive horses are saved for riding and pursuit, rarely ridden in combat. In battle they make full use of archery. There is one point at which the Britons are superior to Charlemagne: their fleet is better equipped and organized, though still unable to rival the seaborne Danes.",
    "equipmentEN": "Nobles: Ring mail armor and iron helmet (8 points), wooden shield (6 points); spear, sword, dagger; courser or charger. Horsemen: Leather armor and iron helmet (6 points), spear, sword, dagger; rouncy. Footmen: Leather armor and a leather cap (5 points), wooden shield (6 points); spear, dagger or short sword, bow.",
    "codeOfHonorEN": "British nobles are generally honorable and follow the code of knighthood. Their word can be trusted.",
    "fortificationsEN": "Much like in Frankland, the British lords live in fortified manors or small wooden motte castles to which the local population may flee in case of attack, especially in the exposed coastal areas."
  },
  {
    "key": "byzantines",
    "nameKO": "비잔티움 제국 (Byzantines)",
    "nameEN": "The Byzantines",
    "emoji": "👑",
    "modifiers": {
      "SIZ": "-1",
      "DEX": "+1",
      "STR": "-1",
      "APP": "+1"
    },
    "names": {
      "men": "Aristakes, Basil, Constantinos, Galien, Leo, Manuel, Michael, Nikephoros, Tarasios",
      "women": "Aelia, Anastasia, Ariadne, Eudocia, Irene, Metrodora, Thecla, Sofia"
    },
    "appearanceKO": "지중해의 찬란한 태양 아래 자란 날씬하고 수려한 귀족들입니다. 우아한 로마식 비단 튜닉과 금실 망토를 걸치고 머리를 단정히 매만집니다.",
    "characterKO": "스스로를 천하 유일의 진짜 로마 황제이자 정통 기독교 후예라고 자부합니다. 음모와 암투(Deceitful)에 능하며 프랑크 야만인들을 의심(Suspicious)합니다.",
    "skillsKO": "제국 법률 및 행정(Stewardship +5), 고도의 법정 정치와 이간책(Intrigue +5), 그리스어 및 신학 토론(Religion/Eloquence +5)",
    "relationsKO": "프랑크인들이 로마 황제의 작위를 강탈했다고 분노하면서도 사라센의 침략을 막기 위해 조건부 우방 제안과 파혼을 반복하는 오만한 라이벌입니다.",
    "chronology": [
      {
        "year": "769년",
        "event": "샤를마뉴 대제가 예루살렘과 콘스탄티노플을 비공식 순방하여 교류를 트기 시작함."
      },
      {
        "year": "781년",
        "event": "대제의 딸 로트루드 공주와 콘스탄티누스 6세 황제의 조기 약혼 조인."
      },
      {
        "year": "802년",
        "event": "여제 이레네가 대제에게 서로마-동로마의 황실 통합 대혼인을 제안했으나 궁정 쿠데타로 유배됨."
      }
    ],
    "dailyLifeKO": "세계 최고의 대도시 콘스탄티노플을 거점으로 전 지중해의 비단, 향료, 노예 무역을 통제합니다. 황실의 내시(Eunuch) 관료들이 사법 전반을 지휘합니다.",
    "warfareKO": "최첨단 국영 방산 공장에서 생산된 통일된 철제 비늘 갑옷을 보급하며, 불을 뿜는 화염방사기 '그리스의 불(Greek Fire)'과 정예 카타프락토이 중기병을 씁니다.",
    "equipmentKO": "장군: 정밀 철제 비늘 갑옷과 폐쇄형 마스크 투구 (아머 14), 마갑 입힌 군마.\n보병: 경화 가죽 흉갑 (아머 6), 대형 원형 방패, 활 및 단검.",
    "codeOfHonorKO": "명예를 입으로 숭상하나 정치가 가문을 우선하기에, 정적의 씨를 말리기 위해 실명시키거나 거세하여 요양원으로 보내는 비장한 제국 법률을 선호합니다.",
    "fortificationsKO": "삼중으로 둘러쳐진 장엄한 석조 요새 성벽(테오도시우스 성벽)과 해자로 대도시 전체를 완벽히 통제합니다.",
    "appearanceEN": "Like all Mediterranean people, the Byzantines are slightly smaller and less robust than the Franks (–1 SIZ, –1 STR). They have long straight noses. They dress in elegant robes like the Romans, take good care of their looks and are found to be quite beautiful (+1 APP) and handy (+1 DEX).",
    "characterEN": "The Byzantines are known to be particularly Proud, Deceitful, Indulgent, and Suspicious of Franks. Still, Byzantines are a type of Christians (Love [God]). In the long and bloody wars against the Bulgars and the Persians, many of them develop a Hate [Bulgars] or Hate [Persians]. Though their luxurious way of life and frequent change of politics have somewhat diminished it, their Honor is generally still higher than their Love [family].",
    "skillsEN": "Byzantines are excellent tacticians, both for attacking strongholds and on the battlefield (Battle, Siege). The Byzantines pride themselves in their highly developed court life and refined manners (Courtesy). Their administration is very complex, but very efficient (Stewardship). T o outsiders it often seems as if they spend their time scheming and hatching wily plots (Intrigue). All members of the upper class and many merchants are completely literate, and often in more than one language (Reading & W riting, Languages). Indeed, lack of education is frowned upon. From their books they have learned the arts of debate and persuasion (Eloquence) or even sophisticated theological arguments (Religion). Their empire has many islands, so most inhabitants have some skill as a navigator or sailor. Another particularity is their fondness of the chariot races organized in great arenas.",
    "relationsEN": "If a Frank is your friend, he is certainly not your neighbor. — Byzantine proverb The Byzantines dream of restoring the ancient Roman Empire, of which they pretend to be true heirs. They see themselves as the guardians of classical and Roman civilization and the center of Christianity. They perceive the Franks as powerful barbarians. The Byzantines and Franks share two enemies: the Bulgars and the Saracens. Phase 1–2: As long as the Lombard exiles receive Byzantine support in their attempts to reconquer their lost Italian territories, the Franks view Byzantium as a peaceful enemy. Phase 3–4: When Benevento finally submits and the Saracen pressure on Byzantium grows, the Franks are no longer enemies, but become a sort of amiable rivals. This produces a halfhearted alliance and some marriage proposals, most of which are ultimately abandoned. Despite insistent Byzantine demands, Charlemagne refuses to declare war on the Persians. W orse, he is on friendly terms with the caliph.",
    "dailyLifeEN": "The Byzantines are appallingly wealthy and relatively educated. Their merchants operate in the Mediterranean Sea under the protection of the imperial fleet and carry considerable riches in spices, silks, gold and slaves. The main trade routes via land lead to Sericane, Persia and even Cathay. The Byzantines maintain a very efficient postal service used by the army and merchants.",
    "warfareEN": "The Byzantines are constantly at war with the Huns from Bulgaria, the Persians (to whom they sometimes have to pay heavy tributes in return for peace), and the Saracens from Babylon. On the other hand, the Khazars (Circassians) are natural allies against the Persians. Without declaring open war, Empress Irene starts to colonize deserted Slavic lands on the European mainland.",
    "equipmentEN": "Higher ranks: Heavy scale armor and closed helmet (14 points); iron sword, mace, compound bow, dagger; charger with trapper (2 points), courser. Cataphract: Scale armor and open helmet (12 points), light shield (4 points); mace, lance, compound bow, dagger; charger. Footman: Cuirbouilli and iron helmet (6 points), shield (6 points); spear, bow, dagger.",
    "codeOfHonorEN": "",
    "fortificationsEN": ""
  },
  {
    "key": "danes",
    "nameKO": "북방 바이킹 덴마크 (Danes)",
    "nameEN": "The Danes",
    "emoji": "🪓",
    "modifiers": {
      "SIZ": "+1",
      "DEX": "-2",
      "STR": "+1",
      "CON": "+1",
      "APP": "-2"
    },
    "names": {
      "men": "Ake, Bjorn, Brand, Halfdan, Harald, Ivar, Knut, Ragnar, Sigurd, Svein, Ulf",
      "women": "Asa, Freydis, Gudrun, Gunhild, Ragnhild, Sigrid"
    },
    "appearanceKO": "북해의 해풍을 맞고 자란 엄청난 거구(SIZ +1, STR +1)의 맹장들입니다. 땋아 내린 긴 금발과 매서운 푸른 눈, 목에 두른 무거운 황동 목걸이가 인상적입니다.",
    "characterKO": "겨울의 동토가 잉태한 가장 사나운 복수귀(Vengeful, Cruel)들입니다. 승마술을 전혀 모르며, 대량의 꿀술을 퍼마시는 폭음(Indulgent) 전통을 가졌습니다.",
    "skillsKO": "해안선 원거리 항해 및 생존, 수영(Swimming +5), 룬 문자 조각 및 북유럽 신화 전설(Folk Lore +5)",
    "relationsKO": "이교 작센 족의 맹방으로 참전하여 프랑크 제국의 연안을 습격했으며 793년 영국의 린디스파른 수도원을 대약탈하여 기독교 세계에 공포를 심었습니다.",
    "chronology": [
      {
        "year": "757년",
        "event": "피핀 국왕이 덴마크 국경을 압박하자 어린 오지에 왕자를 인질로 상납함."
      },
      {
        "year": "793년",
        "event": "덴마크 해적 바이킹들이 잉글랜드 린디스파른 성당을 피로 물들이며 바이킹 시대 개막."
      },
      {
        "year": "810년",
        "event": "고드프리드 2세 국왕이 프리지아를 약탈한 후 암살당하자 프랑크와 잠정 강화 조인."
      }
    ],
    "dailyLifeKO": "척박하고 차가운 노르딕 반도에서 농업과 연안 어업을 하며 먹고삽니다. 해적선 장포단들이 일구어 온 가문의 명예와 노예 쟁탈을 최고의 성취로 봅니다.",
    "warfareKO": "파도를 가르는 드래곤쉽 장선(Longship)을 타고 침투하여 기습 상륙 작전을 편 후, 지상에서는 거대한 도끼와 방패 장막을 펼치고 난투를 벌입니다.",
    "equipmentKO": "바이킹 족장: 사슬갑옷 및 독수리 가면 투구 (아머 10), 둥근 목제 방패, 양손도끼.\n선원: 가죽 자켓 (아머 6), 투창, 브로드소드, 도끼 및 단검.",
    "codeOfHonorKO": "적을 약탈하고 살육하는 야만적 용맹(Valorous)을 최고의 미덕으로 삼으며, 오딘과 토르 신에게 가축과 포로를 바치는 거친 제례를 올립니다.",
    "fortificationsKO": "국경선 전체를 진흙과 돌벽으로 방어하는 웅장한 40km 흙벽 요새인 다네비르케(Danevirke)를 사수합니다.",
    "appearanceEN": "The Danes are big (+1 SIZ), resilient (+1 CON), strong (+1 STR), have long blond hair and deep blue eyes. They are hearty folk made tough by the harsh region they live in, and they are not known for their delicacy (–2 DEX, –2 APP). Rich Danes wear a torc: a bronze or gold neck ring.",
    "characterEN": "Dark and cold winters make these barbarians moody and dangerous (V alorous), while the long summers overexcite them (Reckless). Horse riding is unknown to them, as are civilized manners. They work hard (Energetic), are straightforward (Honest), boastful and easily insulted (Proud), superstitious (Arbitrary), uncouth and wild like the land where they live (V engeful). Danes are famous for their capacity to absorb huge amounts of food and drink (Indulgent). They are the most barbarian of peoples, who are like kinds of wild beasts. They live in the North, close to the Hyperboreal mountains, surrounded by all sides by excessive cold. They are an unquiet people preying on other peoples; and if a crowd of captives falls into their hands, no one is ever or hardly ever able to return. — Aethicus Ister Narrowly linked to their pagan customs is their treacherous nature and dishonorable savagery (Cruel), which makes them particularly feared enemies. For a long time they maintained wicked pagan practices, worshiping empty idols instead of their creator. Neptune was a god, and Jupiter assumed Christ’s place; they paid him all sacred honors. This people were called Danes. They are also called Northmen by the Franks. They are fast, agile and wellarmed. They inhabit the sea and seek out wealth by ship. — Ermold the Black , IV",
    "skillsEN": "They are the undisputed rulers of the sea, sailing as far as possible to trade their merchandise (Stewardship). They have a knack for exaggerated stories (Folk Lore, Faerie Lore), they excel in Swimming and other physical activities. On the other hand, Danes seem hardly inclined to learn any courtly skills apart from Gaming. They live by a moral code in which notions as courage, hospitality, and Love [family] are central.",
    "relationsEN": "As allies of the Saxons the Danes are the enemies of the Franks, even though they rarely meet on the battlefield in the early years of Charlemagne’s reign. At the end of the P aladin chronology, though, the Danes become more and more aggressive, attacking the shores of Britannia first, later Frisia and even some northern Frankish coasts. Alcuin writes a lament about the Danish destruction of the monastery of Lindisfarne in 793: How painful to everyone was that day, when, alas, A pagan war band arrived from the ends of the earth, Descended suddenly by ship and came to our land, Despoiling our fathers’ venerable tombs of their finery And befouling the temples dedicated to God, And Sorech, the most pure vine of the divine Christ, W as suddenly gnawed by the teeth of foxes.",
    "dailyLifeEN": "Apart from the capital, Haithabu, and Birka, there are no towns in Denmark. The Danes live in small villages, often on the coast. Chiefs live in a great wooden hall. Some rich Danes have more than one wife. Most Danes tend to their farms or sail out to go fishing, but they are also able seafaring merchants and pirates. Their fast longships cover great distances, all the way to the British Isles, Frankland and Slavonia. Sometimes smaller groups get permission to navigate in the Frankish mainland via the Rhine, the Meuse and other rivers used as commercial routes. Instead of silver pieces, the Danes use hacksilver, cattle and barter. That region produces no useful fruit, but a multitude of beasts and cattle, horses (larger and more useful than those of other peoples); it produces much crystal and the most clear amber, hard like stones. (…) It is also very rich in iron. — Aethicus Ister",
    "warfareEN": "At the end of the eighth century the coastlines of England and Frankland come under attack from Danish raiders. They even threaten the prosperous port of Dorestad. Their favorite tactic is the amphibious raid on coastal areas, using their superior longships (also called dragonships), which are light, extremely fast and very maneuverable. The invading ships sometimes run aground in a river, making them easy targets. If the water level in a river drops, the islands on which the Danes build their camps become vulnerable to attack by mounted troops. On land, they have neither siege engines (apart from battering rams and ladders) nor cavalry, which explains why they tend to avoid open battles. In battle, a Danish standard is usually some sort of dragon or animal. Once engaged they frequently use archers, but the most feared Danes are the socalled berserks, huge fanatical warriors wearing bear or wolf skins, who can work themselves into a terrible battle frenzy. Huscarls are heavily-armed warriors maintained by a jarl, much like household knights.",
    "equipmentEN": "Jarl/Huscarl: Ring mail armor and a conical metal helmet (8 points), wooden shield (6 points); iron sword, dagger. Carls: Cuirbouilli (6 points), wooden shield (6 pts); spear or axe, bow, dagger. Code of honor Among themselves, Danes are men of honor, but foreigners should be wary of taking a Dane’s word for granted. Knighthood and chivalry are unknown to them. They are always ready to exchange hostages and negotiate, until the fighting begins. Once engaged in combat they never surrender. Prisoners of war are either exchanged or sacrificed to their gods.",
    "codeOfHonorEN": "",
    "fortificationsEN": "The Danes build only few castles. Apart from the Danevirke the only strongholds are a few ringforts: merchant villages surrounded by a palisade and wooden gate towers."
  },
  {
    "key": "gascons",
    "nameKO": "가스코뉴 기병 세력 (Gascons)",
    "nameEN": "The Gascons",
    "emoji": "🏇",
    "modifiers": {
      "SIZ": "-1",
      "DEX": "+1",
      "STR": "-1",
      "APP": "+1"
    },
    "names": {
      "men": "Arnalt, Centule, Garcia, Lupus, Menant, Remon, Sancho, Ximen",
      "women": "Azenor, Aude, Bertrada, Clarissa, Sancha"
    },
    "appearanceKO": "제국 남부 피레네 구릉지에 거주하는 기민하고 날랜 기사들입니다. 프랑크인보다 키가 작고 어두운 피부를 지녔으나 몹시 민첩합니다.",
    "characterKO": "자랑하기를 몹시 좋아하는 허풍선이(Proud)이며 대단히 정열적이고 호전적이지만, 한편으로는 프랑크 주군에 대한 맹세를 쉽게 바꿉니다(Deceitful).",
    "skillsKO": "마상 승마 돌격 및 마상 추적, 웅변 및 연애 시 낭송(Courtesy/Eloquence +5), 정찰(Awareness +5)",
    "relationsKO": "768년 룹스 공작이 샤를마뉴 대제에게 굴복하여 스페인과 피레네 변방의 기마 선봉 수호대로 충직하게 복무했습니다.",
    "chronology": [
      {
        "year": "768년",
        "event": "룹스 대공이 대제에게 세습 충성을 맹세하고 가스코뉴를 프랑크 주권령으로 조인함."
      },
      {
        "year": "787년",
        "event": "오달릭 백작이 가스코뉴의 독립을 선포하고 봉기하였으나 진압당하고 수도원으로 추방됨."
      },
      {
        "year": "800년",
        "event": "성기사 산초 경이 루이 국왕 예하 스페인 정벌 공로로 가스코뉴 공작으로 임명됨."
      }
    ],
    "dailyLifeKO": "기후가 따뜻하고 포도가 풍부히 재배되는 비옥한 평야에서 군마를 육성하며 살아갑니다. 프랑크의 기사 예법과 음유시인 예술을 가장 빠르게 도입했습니다.",
    "warfareKO": "제국 기병대 중 가장 빠르고 우수한 승마술을 보유한 경기병 군단을 운용하며 적의 후방을 교란하는 우회 돌격을 선호합니다.",
    "equipmentKO": "기사: 사슬 메일 조끼 (아머 8), 강철 투구, 가벼운 마창 및 스패타 검.\n풋맨: 가죽 옷 (아머 6), 투창, 활 및 가벼운 목제 방패.",
    "codeOfHonorKO": "프랑크 기사도(Chivalry)의 거의 모든 예법과 낭만적 법률을 정중히 수용하여 따르며 마상 시합을 즐깁니다.",
    "fortificationsKO": "프랑크식 언덕 성채를 그대로 도입하여 곳곳에 목조 초소를 세워 변방의 국경을 방어합니다.",
    "appearanceEN": "Southern nobles are always elegant (+1 APP) and welldressed, wearing a circular cloak, a shirt with long wide sleeves, baggy trousers and leather boots. They are slightly smaller than Franks (–1 SIZ) and less strong (–1 STR), but they have nimble fingers (+1 DEX).",
    "characterEN": "They are acknowledged as a refined people, but corrupt, slightly effeminate, and “a volatile race, ” i.e. Deceitful, Arbitrary, Lustful, Lazy and Indulgent. Their way of life is rather freespir- ited and independent. Aquitainians are known as Merciful and Forgiving folk.",
    "skillsEN": "They are naturally talented at courtly skills like Eloquence, Dancing, Falconry, Play Instrument, Singing, and, later, Romance. Their noble courts attract many singers, musicians and poets.",
    "relationsEN": "Despite the defiant aspirations for independence of his people, Duke Lupus rallies to Charlemagne in 768. Later, when Louis becomes King of Aquitaine (his realm includes the territories of Aquitaine, Gascony, Septimania and Provence), he adopts southern fashion and habits. The territory remains quite distinct from Frankland. Charlemagne rarely uses Gascon troops in foreign campaigns, instead preferring to use their city levies as garrisons at fortified places.",
    "dailyLifeEN": "Gascony used to be a more urbanized region, but during King Pepin’s wars against Aquitaine, and to a lesser degree Gascony, many towns were ravaged and their population fled to the surrounding countryside, leaving the urban centers abandoned. One notable characteristic of Gascon culture is that women have more rights and play a more prominent role in public life than Frankish women. It is not unusual for a noble widow or sister of a deceased lord to govern his lands until a male heir comes of age. The onceprosperous lands and vineyards have been devastated by the many years of war and stubborn resistance against King Pepin. Many roads are in disrepair and there is almost no external commerce left, so the people depend on the local economy centered around the rural manors, which they still call villas, in much the same way as the Franks.",
    "warfareEN": "Gascons fight primarily as infantry or javelinusing light cavalry skirmishers. They have neither stirrups nor saddles, but are skillful horsemen nevertheless. Under Charlemagne, the Gascons often serve as mercenaries in feuds. In battle, their favorite cavalry tactic consists of repeated attack followed by feigned retreat.",
    "equipmentEN": "Nobles: Ring mail armor (8 points), shield (6 points); spear, sword, dagger; rouncy and courser. Horsemen: Ring mail armor (8 points); spear, bow, dagger; rouncy. Footmen: Leather armor and skullcap (5 points), wooden shield (6 points); spear or javelins, dagger.",
    "codeOfHonorEN": "Gascon knights are men of honor, though not particularly noted for their extreme valor nor their sense of loyalty. As said, they often hold allodial lands and therefore recognize no liege, even though they swear an oath of fidelity to the king.",
    "fortificationsEN": "The Gascons adopt Frankish-style motte-and-bailey castles and erect wooden watchtowers at key points to defend their border frontiers."
  },
  {
    "key": "huns",
    "nameKO": "훈족 & 불가르족 세력 (Huns & Bulgars)",
    "nameEN": "The Huns and Bulgars",
    "emoji": "🏹",
    "modifiers": {
      "SIZ": "-2",
      "DEX": "+1",
      "STR": "+1",
      "CON": "-1"
    },
    "names": {
      "men": "Dorame, Krum, Kurguz, Medoro, Rogero, Sacripant, Unguimer",
      "women": "Marfisa, Sumaya, Zora"
    },
    "appearanceKO": "판노니아 평원과 불가리아 동부에서 온 아시아계 기마 전사들의 후예입니다. 작고 단단하며 흉터가 많고 모피 모자를 깊게 눌러 씁니다.",
    "characterKO": "초원의 말 위에서 태어나 평생을 약탈과 유목으로 일관하는 용맹한 궁수들입니다. 군율이 매우 엄격하고 가차 없으며 사납습니다(Cruel).",
    "skillsKO": "마상 궁술(Bow +5), 야외 생존 및 사막 길 찾기, 동물 승마술(Horsemanship +5)",
    "relationsKO": "동부 국경의 주적으로 군림하며 아바르의 거대한 금은보화 요새(Avar Ring)를 두고 대제와 수차례 피의 공방을 벌였습니다.",
    "chronology": [
      {
        "year": "777년",
        "event": "무어 전사 로제로가 기독교로 개종하고 Telerig II로 명명되어 불가리아 국왕으로 등극."
      },
      {
        "year": "794년",
        "event": "대제의 장남 칼로만이 유목 전사단의 본진인 아바르 링(Avar Ring)을 함락시키고 황금을 대약탈함."
      },
      {
        "year": "811년",
        "event": "크룸 국왕이 동로마 황제를 사살하고 그의 해골로 전술 축제 술잔을 주조함."
      }
    ],
    "dailyLifeKO": "이동식 텐트 게르를 치고 소와 말 무리를 끌며 광활한 동유럽 평원을 이동합니다. 황금과 노예 약탈품 배분을 통해 부족 세력을 유지합니다.",
    "warfareKO": "모든 전사가 승마하며, 적에게 달려들다 몸을 돌려 등 뒤로 활을 쏘는 '파르티안 샷(Parthian Shot)' 마상 궁술로 적 기병대를 요리합니다.",
    "equipmentKO": "궁수 귀족: 가벼운 가죽 비늘 조끼 (아머 8), 합성 복합궁, 철제 곡도, 경기마.\n풋맨: 모피 누더기 옷 (아머 4), 화살통, 단검 및 포획용 올가미 로프.",
    "codeOfHonorKO": "초원의 칼의 법률만 따르며, 전사한 적장의 해골을 금으로 장식하여 술잔으로 쓰는 혹독한 복수 명예율을 지녔습니다.",
    "fortificationsKO": "둥근 환상 철책 요새인 '아바르 링(Avar Ring)'을 구축하여 제국 전역의 황금을 비축하는 비밀 거점으로 썼습니다.",
    "appearanceEN": "A stunted, foul and puny people, scarcely human and having no language save one which bears but slight resemblance to human speech. (…) Their hardihood is evident in their wild appearance, and they are beings who are cruel to their children on the very day they are born. For they cut the cheeks of the males with a sword, so that before they receive the nourishment of milk they must learn to endure wounds. Hence they grow old beardless and their young men are without comeliness, because a face furrowed by the sword spoils by its scars the natural beauty of a beard. They are short in stature, quick in bodily movement, alert horsemen, broad shouldered, ready in the use of bow and arrow, and have firmset necks which are ever erect in pride. Though they live in the form of men, they have the cruelty of wild beasts. — Jordanes In short, the Huns are a “ filthy race of longhaired barbarians. ” Indeed, they are broadfaced, quite ugly (–1 APP) and short (–2 SIZ), but strong and resistant (+1 STR, +1 CON), as Notker further notes: “ The ironlike and rockhard people called Huns .” These tanned and bowlegged steppe nomads, with rather square heads and wide chests, have long black hair (which the Avars wear braided) and thin mustaches. Both men and women wear gold earrings.",
    "characterEN": "Huns are uneducated pagan savages. The most learned Alcuin describes them as “ a barbarian people, impervious to reason, uneducated, narrowminded and slow to accept the holy mysteries.” They distrust buildings and are generally given to mysterious magical beliefs (Suspicious), they eat raw meat and some are said to be cannibals. They systematically rape the women of all conquered people (Cruel, Arbitrary, V engeful).",
    "skillsEN": "Their skills at Horsemanship and the compound Bow are unrivaled.",
    "relationsEN": "In the early years, the Avars welcome the exiled Lombard and Bavarian enemies of Charlemagne. Later they lend their aid to the Slavs who try to resist the Franks. Finally, the Bulgars ally with Charlemagne against the Avars, who are completely defeated (792–796). The justification for the Avar wars are, as usual, the sacred task to convert the pagans and steal back the liturgical treasures these barbarians have stolen from Christians over the last few centuries. In the palace of the Ring, the Franks discovered so much gold and silver and captured so much precious booty in their battles, that it could rightly be maintained that they had in all justice taken from the Huns what these last had unjustly stolen from other nations. — Einhard An additional motivation for Charlemagne is that he wants to reward those Bavarian nobles who supported him against T assilo in 788, by offering them the newly conquered lands in the east. Christ, son of God, who created all peoples, lands, springs, rivers, mountains and formed mankind, has converted the Avars… — De Pippine Regis Victoria Avarica Charlemagne’s court has precious little contact with the other Hunnic tribes. Some missionaries are sent to convert these remote peoples, but with little result, despite some optimistic reports from the clergy.",
    "dailyLifeEN": "The common Huns are seminomadic pastoralists keeping herds of cattle, goats, sheep and horses. Given the immense territory on which they live, population density is unsurprisingly low. Rich noble Hunnish men have many women, but adultery is severely punished: adulterers are quartered by horses or bent trees. When a khagan dies, he usually leaves many children from different women, which causes a period of political instability until a new khagan takes power. The Huns are often wealthy, but have few commercial relations with the outside world. They even block the trade on the Danube. “At that time, the Avars, the Bulgars and many other savage races barred the overland route to Byzantium, ” — Notker . They use smoke signals to communicate over great distances. The only artisanal skill of which the Huns have a great mastery is metal working (silver, gold, and bronze). They invented the stirrup.",
    "warfareEN": "Y oung Hunnish warriors must prove themselves by bringing back the head or nose of their first human kill. Once accepted as men, they are given their own pony and may participate in military expeditions. The Bulgars are continually at war with Byzantium, while the Avars exercise a reign of terror in central Europe. They regularly conduct very fast raids into Lombardy or Bavaria, where they pillage churches and collect “peace tributes.” On horseback they are able to cover enormous distances at great speed. They prefer swooping cavalry raids, aided by bow fire from horseback, and often use Slavs as human shields when retreating. Note that rain sometimes hampers their archery. While raiding, they aim at collecting riches and taking women for slaves. While they are masters of the art of mobile warfare, their tactics lose a lot of efficiency in a pitched defensive battle.",
    "equipmentEN": "Nobles: Cuirbouilli and open helmet (7 points), light shield (3 points); scimitar, compound bow, dagger; steppe pony with felt (2 points) or lamellar (4 points) horsearmor. Mounted archers: Fur clothes and cap (5 points), light shield (3 points); compound bow, dagger; steppe pony with felt (2 points) or lamellar (4 points) horsearmor. Footmen: Furs (5 points) and light shield (3 points); javelin, compound bow, dagger.",
    "codeOfHonorEN": "The Huns follow their leader as long as he is successful in war. They do not follow the codes of knighthood or chivalry, and their word cannot be trusted.",
    "fortificationsEN": "Having little or no siege equipment and very little skill in siegecraft and other forms of immobile warfare, they rarely attack or defend fortifications. In the open field, they set up their wagons in a circular camp. All in all, defense is a Hunnic weakness."
  },
  {
    "key": "jews",
    "nameKO": "유대인 상인 집단 (Jews)",
    "nameEN": "The Jews",
    "emoji": "📜",
    "modifiers": {
      "SIZ": "-1",
      "DEX": "-2"
    },
    "names": {
      "men": "Isaac, Joseph, Nathan, Samuel, Solomon",
      "women": "Esther, Judith, Rachel, Rebecca, Sarah"
    },
    "appearanceKO": "제국의 주요 행정 도시와 콘스탄티노플, 바그다드에 상주하는 아시아계 지식인들입니다. 긴 수염을 기르고 긴 종교적 외투를 걸치고 다닙니다.",
    "characterKO": "세상의 모진 핍박 속에서도 고결한 경전의 율법을 수호합니다. 몹시 현명하며 평화적 협상과 교육(Prudent)을 중시합니다.",
    "skillsKO": "화폐 감정 및 무역 계산(Stewardship +10), 외국어 통역 및 외교 기술(Languages/Eloquence +5), 율법 필사(Read/Write +5)",
    "relationsKO": "샤를마뉴 대제는 이들을 제국의 귀중한 외교관이자 통상 거점으로 여겨 신변을 특별히 보호하였고 아라비아 대칼리프 외교에 통역사로 동행시켰습니다.",
    "chronology": [
      {
        "year": "797년",
        "event": "대제가 유대인 이삭(Isaac)을 바그다드 대칼리프 하루날 라시드 궁정에 특별 외교 특사로 파견함."
      },
      {
        "year": "802년",
        "event": "이삭이 대칼리프의 백색 전투 코끼리 아불 아바스를 아헨의 대궐까지 안전하게 인도하여 기증식 대성공."
      }
    ],
    "dailyLifeKO": "도시의 전용 거주 구역에 거주하며 상업, 장원 세금 징수, 학술 필사 및 약학 연구에 종사합니다. 철저히 종교 회당(Synagogue)의 율법에 복종합니다.",
    "warfareKO": "절대 물리적 전투에 참여하지 않으며, 무기를 들 의무를 면제받는 대신 제국 왕실에 막대한 통상 보조세를 상납합니다.",
    "equipmentKO": "비무장: 비단 외투 및 종교 경전 고서적 궤짝 소지.",
    "codeOfHonorKO": "성경의 모세 율법과 십계명을 철저히 목숨 바쳐 준수하며 평화적 타협과 계약(Honest)을 신성히 여깁니다.",
    "fortificationsKO": "성곽이 없으며 도시의 치안 판사 및 프랑크 수호 영주가 제공하는 공공 성벽 예하에서 보호받습니다.",
    "appearanceEN": "Jews are slightly smaller (–1 SIZ) and often much less muscular then Franks (–2 STR). They have an aquiline profile and usually dress in robes.",
    "characterEN": "Jews are generally known as hard workers (Energetic, Modest, and T emperate). Their shrewd merchants have a reputation of being Honest and Prudent, but quite Selfish at times.",
    "skillsEN": "Jews are praised as trustworthy merchants (Stewardship) who travel everywhere in Europe and beyond. They are always literate and often speak many tongues (Reading & W riting, Languages). They have poor fighting skills, but are often employed as skilled physicians (Chirurgery, First Aid).",
    "relationsEN": "In times of famine or at the outbreak of an epidemic, Jews often get accused of sorcery or simply of bringing bad luck. Therefore Charlemagne officially protects the Jews by law, especially the merchants. Although they may not hold official positions, the king sometimes employs Jews as diplomats, interpreters and guides for embassies to the East.",
    "dailyLifeEN": "The Jewish people have no homeland, but have traveled all over the world and settled in many countries, especially Persia and the Patriarchate of Jerusalem. Strangely, the Hunnic Circassians are Jewish, of a sort. Jews are not very numerous in Frankland. Some are landholders in the southern provinces, but most often they are merchants in Frankish and Italian cities, especially Narbonne and Rome. Generally, Jews live undisturbed in the midst of Christians. They wear no particular costume and speak the same language as everybody else; only few speak Hebrew. In southern Frankish cities with a Jewish community, a magister is in charge of protecting Jews and acts as a Jewish spokesman to the count or bishop. Wherever they live, Jews must pay taxes and even tithes as anyone else. In Frankland, most Jews are merchants, goldsmiths, doctors, moneylenders or even tax collectors. Jewish merchants sell musk, aloes wood, camphor, cinnamon and other spices from the Orient and Constantinople. The Lombards are their commercial rivals. From the Franks, they buy eunuchs, woven cloth, skins and furs. They may not trade in weapons, money, wine nor food: Let no Jew presume to have a moneychanger’s table in his house, nor shall he presume to sell wine, grain, or other commodities there. But if it be discovered that he has done so all his goods shall be taken away from him, and he shall be imprisoned until he is brought into our presence. — Capitulary for the Jews",
    "warfareEN": "The Jews have no army. They are exempt from military service, since Charlemagne’s army is explicitly a Christian one. They are not allowed to carry weapons. For their protection, Jewish merchants are often accompanied by Gascon, Visigoth or Lombard mercenary knights.",
    "equipmentEN": "Unarmed: Silk robes, religious scriptures, and boxes of ancient scholarly texts.",
    "codeOfHonorEN": "Strictly adhere to the Mosaic Law of the Bible and the Ten Commandments, holding peaceful compromise and contracts (Honest) as sacred duties.",
    "fortificationsEN": "They build no fortifications of their own, but are protected under the public city walls provided by the royal magistrates and defending Frankish lords."
  },
  {
    "key": "lombards",
    "nameKO": "롬바르드 귀족 세력 (Lombards)",
    "nameEN": "The Lombards",
    "emoji": "🦁",
    "modifiers": {
      "DEX": "+0"
    },
    "names": {
      "men": "Adalgis, Arichis, Desiderius, Grimoald, Hildeprand, Winichis",
      "women": "Adalperga, Ansa, Desideria, Gerberga, Liutperga"
    },
    "appearanceKO": "이탈리아 반도의 비옥함 속에서 자란 세련되고 화려한 북부의 전사들입니다. 미학적인 장발을 자랑하며 화려한 이탈리아식 의복을 입습니다.",
    "characterKO": "샤를마뉴 대제에게 왕국을 빼앗긴 피의 grudges(원한)를 품었습니다. 몹시 오만하며(Proud), 교묘한 정치적 배신(Deceitful)의 귀재들입니다.",
    "skillsKO": "마상 결투 및 검술(Sword +5), 제국 궁정 예절과 정치(Courtesy/Intrigue +5), 사법 율법 지식",
    "relationsKO": "대제가 롬바르드 공주 데시데리아를 아내로 맞았다가 파혼하여 전쟁이 터졌으며, 774년 파비아가 함락된 후 작위를 상실하고 와해되었습니다.",
    "chronology": [
      {
        "year": "770년",
        "event": "대제가 롬바르드 데시데리아 공주와 정략 결혼을 맺었으나 1년 만에 파문하고 돌려보내 전쟁 유발."
      },
      {
        "year": "774년",
        "event": "파비아 공방전 대승. 데시데리우스 국왕이 폐위당하고 대제가 '롬바르드의 철왕관'을 직접 직접 씀."
      },
      {
        "year": "787년",
        "event": "남부 베네벤토의 아리키스 공작이 황제에게 반기를 들었으나 즉각 패배하고 차남을 인질로 상납."
      }
    ],
    "dailyLifeKO": "밀라노, 파비아 등 대도시의 화려한 대리석 저택에서 예술과 웅변을 즐기며 살아갑니다. 황실의 행정과 법정 사법의 요직을 독차지했습니다.",
    "warfareKO": "프랑크식 중기병을 완벽히 흡수하여 강철 마갑과 이탈리아 검술을 조합한 강력한 카발리에리(Cavalieri) 돌격 전술을 운용합니다.",
    "equipmentKO": "기사: 최고급 사슬 메일 갑옷 (아머 10), 강철 반면형 투구, 롬바르드식 날카로운 스패타 검.\n풋맨: 가죽 옷 (아머 6), 투창 및 중형 둥근 나무 방패.",
    "codeOfHonorKO": "로마 법률에 기초한 기사도 서약(Chivalry)을 완벽히 사용하나 가문의 영지 보존을 위해서라면 황제와의 약속도 기꺼이 기만합니다.",
    "fortificationsKO": "고대 로마의 장엄한 석조 방벽과 다층식 성탑 요새를 결합하여 난공불락의 강력한 성곽을 사수합니다.",
    "appearanceEN": "The name “Longobards”/”Lombards” means “longbeards.” The Lombards wear short mantles, wide trousers and leather boots. They have beards and grow their hair long, but shave the back of the head. W omen wear Romanstyle dresses and jewelry.",
    "characterEN": "All a Lombard wants is to fill his stomach with wine and his house with gold. — Frankish saying The Pope describes the decadent Lombards in a letter to Charlemagne and Carloman, in which he asks both Frankish kings not to marry a Lombard princess, for “the faithless and most vile Lombards (…) have certainly brought forth the lepe r s .” While not all Lombards are vile and untrustworthy, most of them have certain character flaws such as Deceitful, Lustful, Lazy, Indulgent, Proud, Selfish and Cowardly. Only after the Frankish conquest of Lombardy in 774 do they become more appreciated for their emulation of the dominant Carolingian culture. They are not particularly noted for their courage or energy, but most Lombards are fervent Christians (Love [God]).",
    "skillsEN": "Their urban background makes Lombard knights intimately familiar with merchants (Stewardship) and politics (Intrigue). Y oung nobles receive their education at the wealthy and refined city courts, where they particularly develop the courtly skills (Courtesy, Dancing, Eloquence, Languages, Reading & W riting, Singing).",
    "relationsEN": "At first, the Lombards are allied to the Franks by three royal weddings: T assilo of Bavaria, Carloman and Charlemagne each marry a daughter of the Lombard king. However, when Charlemagne repudiates his wife and Carloman dies in 771, things change radically. T wo years later, when King Desiderius threatens to take Rome, Charlemagne invades and conquers Lombardy. Once the Lombards become part of the Frankish empire, many become loyal vassals of Charlemagne. Those who resist the Frankish king flee to Benevento, Spoleto, Byzantium, Bavaria or Avarland. The Byzantines become allies in their revolt against the Franks in Italy.",
    "dailyLifeEN": "The Italian peninsula is quite urbanized compared to the rest of the realm, much like Romanized lands such as Septimania and Provence. The rich Italian cities are walled and often have paved streets, bath houses, and various other Roman monuments like great statues, an aqueduct, or an amphitheater. Economy W ealth is primarily based on the important urban production centers and on long distance trade. Cities like Pavia and V enice are counted among the great ports for Oriental products.",
    "warfareEN": "Lombards are rich and wellequipped. Like the Franks, they fight predominantly with shock cavalry. Urban militias fight only to defend their city and never follow their gastald on campaign abroad.",
    "equipmentEN": "Nobles: Scale armor (12 points), shield (6 points); spear, sword, dagger; charger and rouncy (like the Romans, Lombard knights wear a cross on their helmet). Footmen/Urban militia: Cuirbouilli (6 points), shield (6 points); spear, hand axe, bow, dagger.",
    "codeOfHonorEN": "The Lombards have a peculiar concept of honor and knighthood. Nobles derive a significant part of their authority from their wealth and mercantile success. Much like the Saracens, the world of the Lombards is all about money. In short, Lombard lords care more about the economic health of their city than for battle prowess and glory. Still, Lombard knights value their public credibility and a given word is sacred.",
    "fortificationsEN": "Lombard lords do not build their castles in the country, but exclusively inside their cities. Such a castle is usually integrated into the city walls and other defensive works. However, the king can order the construction of a fortress in the general interest of the Lombard people, such as the Lombard Narrows."
  },
  {
    "key": "moors",
    "nameKO": "안달루스 무어 & 사라센 세력 (Moors & Saracens)",
    "nameEN": "The Moors and Saracens",
    "emoji": "🌙",
    "modifiers": {
      "SIZ": "-1",
      "DEX": "+1"
    },
    "names": {
      "men": "Agolant, Baligant, Hisham, Marsile, Medoro, Tiebaut",
      "women": "Ayglente, Gaudissa, Guibourc, Orable"
    },
    "appearanceKO": "에스파냐 남부 및 북아프리카에서 진출한 날렵하고 수려한 무인들입니다. 갈색 피부와 곱슬머리, 비단 터번과 초승달 단검이 특징입니다.",
    "characterKO": "프랑크 서사시에서 묘사되길 오만하고 용맹한 이교의 불패 전사입니다. 극도의 용맹(Valorous)과 조국 수호 열망(Love [Country])이 높습니다.",
    "skillsKO": "사막 승마술 및 모래 폭풍 속 길 찾기, 정밀 검술 및 곡도 베기(Sword +5), 마상 투창 사격",
    "relationsKO": "피레네 이남 사라고사를 거점으로 제국 남부 변경을 끊임없이 침공하여 성기사 롤랑의 목숨을 앗아간 프랑크 최고의 최대 라이벌입니다.",
    "chronology": [
      {
        "year": "778년",
        "event": "사라고사 원정 및 론세스바예스 대참사. 마르실레 국왕의 간계로 프랑크 성기사단 괴멸."
      },
      {
        "year": "793년",
        "event": "무어인 에미르 데라메가 제국 남부 수호를 박살 내고 아르샹에서 비비앙 경을 사살함."
      },
      {
        "year": "810년",
        "event": "대제의 끈질긴 반격 끝에 스페인 변경령(Spanish March)을 획득하고 평화 협정 조인."
      }
    ],
    "dailyLifeKO": "코르도바의 찬란한 석조 궁전에서 기하학, 천문학, 약학을 연구하며 화려한 비단 무역을 운용합니다. 종교적 사원 중심의 도시 행정을 자랑합니다.",
    "warfareKO": "아라비아마를 탄 경기병 군단이 사방에서 질풍노도처럼 화살과 투창을 쏟아붓고 바람처럼 퇴각하는 위력적인 기동 기습 전술을 펼칩니다.",
    "equipmentKO": "사라센 지휘관: 정밀 강철 흉갑과 터번 투구 (아머 10), 초승달 모양 시미터 곡도, 경기마.\n기병/풋맨: 가죽 갑옷 (아머 6), 목제 가벼운 가죽 방패, 투창 및 단궁.",
    "codeOfHonorKO": "프랑크의 기사도와 흡사한 자신들만의 독자적인 '유목 명예 규범(Furusiyya)'을 엄격히 수용하여 포로 대우와 사법 결투를 지킵니다.",
    "fortificationsKO": "남부 에스파냐에 알카사르(Alcazar)라 불리는 웅장한 대리석 석조 요새와 기하학적 다각 성벽을 구축합니다.",
    "appearanceEN": "Most have curly black hair and copper, brown or black skin. Men wear short pointy beards and sometimes a thin mustache. However, the Saracens from the North African mountains are often fairhaired and blueeyed. They are not the most resilient of all people (–1 SIZ), but have a certain natural agility (+1 DEX). Like the Persians, Saracen men wear turbans. Ladies often wear large round golden earrings. Unmarried women hide their nose and mouth behind a transparent veil.",
    "characterEN": "As pagans their characters are necessarily flawed. Their vices are numerous: they are cunning liars and regularly betray others and themselves (Deceitful, Arbitrary), they are extremely boastful (Proud), they sometimes torture their prisoners or sell them as slaves (Cruel). The emir has commanded a raiding gang all night! He’s taken towns and countrykeeps alike; He’s hacked the head of many a lawful squire And slit the breasts of their defenseless wives; He’s given their girls, all daughters of fine knights (…) to the scum at his side, Then bound them all in chains, criminallike; These girls cry out, lamenting loud their plight: “O, Charlemagne! Come and avenge this crime!” For gold and coin they’re bought and sold meanwhile. — Song of Aspremont , III T o boost their relatively low valor (Cowardly), some Saracens drink the blood of tigers, antelopes, and giraffes.They have a comparatively low Love [family]: “Tell Charlemagne you will follow him to Aachen And receive the Christian faith; You will be his vassal in honor and in all your goods. If he asks you hostages, send him some, Either ten or twenty, as a mark of good faith. Let us send him the sons of our wives; Even if it means his death, I shall send him mine. Far better for them to lose their heads there Than for us to lose our honor and our lands And be reduced to begging. ” — Song of Roland , III On the other hand, their culture highly values moderation in sexual and other appetites (Chaste, T emperate).",
    "skillsEN": "The pagan science of healing is largely superior to the rudimentary skills of the Frankish monks (First Aid, Chirurgery). The Saracens have a long tradition of horsemanship and trick riding (Horsemanship). Their mercantile society gives them significant skill in Stewardship.",
    "relationsEN": "At first, the Saracen attitude toward the Franks varies from awe and admiration to open hostility. T o distinguish themselves from the merchants, feudalized Moorish nobles try to uphold the ideals of honor and knighthood, which creates a sort of solidarity with Frankish knights. Therefore, Frankish exiles are often warmly welcomed by their noble counterparts at Saracen courts. In his youth, Charlemagne himself served the Moorish emir as an exiled mercenary knight! As the P aladin chronology advances, the initial respect fades and cedes its place to mutual hatred. After the Battle of Roncevaux many Christians from Spain seek refuge north of the Pyrenees. In the Frankish mind, the Mozarabs (Arabspeaking Christians living in Spain, a majority of the population!) are severely oppressed. One of the unexpected results for the Saracens is a sort of tacit alliance with the Byzantines in mutual opposition to the Franks and Persians.",
    "dailyLifeEN": "A small number of Saracens are nomadic desert folk who ride on camels and live in tents. However, most Saracens live in cities. Houses are usually built from tamped earth. Since water is a constant problem, all cities are situated in river valleys. The surrounding fields are irrigated either by chain wells (a series of linked underground wells), or by norias (waterwheels with buckets driven by donkeys in order to lift underground water to the field). The numerous, often very large, cities have very narrow and sinuous streets, and in their central market squares a temple can usually be found. A Master of the Market (sahib alsuq) controls this central area, which is strictly nonresidential and deserted at night, when it is patrolled by guards. Jews usually have their own walled quarter. The wali lives in his citadel castle (alcazar) along the city wall. Saracen society has given rise to burgeoning urbancraft industries. Even during times of war, many caravans travel along the main trade routes, though political instability does not favor the commercial routes from Frankland leading into Spain via Saragossa. Saracen merchants trade with all other cultures around the Mediterranean Sea. Indeed, trade is so important in the Saracen world that their entire empire is a free trade area where one’s origin is no bar to travel. Foreign merchants are treated with respect, for commercial interests outweigh military hostility. Like the Byzantines and Persians, Saracen merchants prefer gold coins or silk bundles to silver pieces. Saracens are especially known for their flourishing slave trade. Note that no Moorish or Saracen slaves are allowed, nor can lawabiding taxpaying foreigners be enslaved. Slaves in Spain tend to be employed as domestic servants, administrators and soldiers, rather than peasants obliged to work in the fields. Moorish cities are famous for their leather, camels and purebred horses. Though well supplied with most luxury goods (silks, perfume, glass), the Moors have a chronic need for wood, since their lands are not very forested. The rural population, mostly Visigothic, make their living from sheep herding and farming cereal crops, grapevines and olive trees. Like the Persians, the Moors and Saracens practice intensive hydraulic agriculture around their cities. Inside the towns and cities lofty gardens produce fruits.",
    "warfareEN": "The Saracens have a permanent standing army composed of askaris (warriors) and foreign mercenary soldiers. The better equipped nobles are faris, the equivalent of the Frankish knights. An almansour is a sort of banneret, while a wali is the ruler over a town or a small district (a kura, plural kuwar), quite like a count. A king is called an emir. The highest rank is that of sultan, comparable to an emperor. Saracens sometimes count enslaved giants or centaurs among their ranks. The Moors carry a white standard, the Sultan of Babylon raises a green banner. While they sometimes engage in full scale battles with the Franks, the Saracens are more feared for their quick raids and their piracy on the Mediterranean Sea. Their goal is often not conquest but the capture of plunder and slaves.",
    "equipmentEN": "Faris: Light chain mail and a pointy helmet (10 points), small round shield (4 points); scimitar, mace, lance, compound bow, curved dagger; courser, charger, or camel. Askaris: Cuirbouilli and a pointy helmet (6 points), small round shield (4 points); spear, compound bow, curved dagger; courser. Footmen: Soft leather (4 points), small round shield (4 points); spear, mace, bow, curved dagger.",
    "codeOfHonorEN": "The Moors and Saracens recognize some chivalric customs, like judicial combat to resolve conflicts. T o them, such a trial by combat duel is a cynical challenge to the Christian God to prove His power. “For the city which is my inherited right choose any man who is valiant in fight and I shall choose one of my line. Then we shall of our champions make trial. If your God has the power to inspire the defeat of my champion by your knight, then you will hold Rome free and for life. ” — The Coronation of Louis , XVIII Generally, they respect a word of honor from one military commander to another. Emir Galafre proposes to give hostages as proof of his honesty and trustworthiness: “If you suspect me of treacherous guile I shall let both my sons as hostages ride. No fortune so great will ransom their lives, you shall hang them both from a tree to die. ” — The Coronation of Louis , XIX When delivering a message to a Saracen court, Franks should be prudent, however, because there is a limit to the Saracens’ respect of diplomatic immunity.",
    "fortificationsEN": "The Saracens are great builders. Their castles and fortresses are generally strong and much bigger than Frankish strongholds. Their cities, especially, often have high solid walls reinforced with many towers. In the countryside, the Saracens use a dense network of wooden guard towers to alert the surrounding villages and towns, making them difficult to surprise."
  },
  {
    "key": "persians",
    "nameKO": "바빌론 & 페르시아 제국 (Persians)",
    "nameEN": "The Persians",
    "emoji": "🕌",
    "modifiers": {
      "SIZ": "-1",
      "DEX": "+1",
      "APP": "+1"
    },
    "names": {
      "men": "Abdallaziz, Harun, Jafar, Mansur, Rashid, Suleiman, Yusuf",
      "women": "Asma, Dinazade, Halima, Layla, Sherazade"
    },
    "appearanceKO": "지중해 동부 너머 바그다드에서 진출한 구리빛 피부의 극도로 아름다운 귀족들입니다. 비단 터번과 투명한 보석 면사포를 씁니다.",
    "characterKO": "동방 최고의 고대 학문과 풍요를 누리는 지혜로운(Just) 신사입니다. 술을 절대 마시지 않으며(Temperate), 도덕적 순결함(Chaste)이 높습니다.",
    "skillsKO": "고대 수학 및 연금술 연구(Faerie Lore +5), 웅변술 및 아라비아 문자 필사(Read/Write +5), 정밀 복합궁 사격",
    "relationsKO": "동로마 비잔티움 제국을 공통의 주적으로 삼았기에 프랑크 제국과는 원거리 동맹을 맺고 호랑이 가죽, 보석, 코끼리를 우호 상납한 절친한 우방입니다.",
    "chronology": [
      {
        "year": "786년",
        "event": "현명한 하루날 라시드가 대칼리프에 올라 바그다드를 세계 최대 무역지로 육성함."
      },
      {
        "year": "797년",
        "event": "대제와 대칼리프 하루날 라시드 사이에 최초의 동방-서방 거대 평화 외교 동맹 수립."
      },
      {
        "year": "802년",
        "event": "페르시아의 사절단이 백색 코끼리를 황제에게 헌상하여 우방 관계의 정점을 찍음."
      }
    ],
    "dailyLifeKO": "동방 물품이 집결하는 바그다드의 거대한 시장과 대도서관을 기반으로 천문학과 철학을 탐구합니다. 대칼리프 어전의 수상(Vizier)이 전권을 대리합니다.",
    "warfareKO": "말의 머리와 가슴까지 덮는 강철 마갑 기병단과 동방 특유의 거대 백색 코끼리 타격 부대를 운용하여 강력한 위압감을 줍니다.",
    "equipmentKO": "귀족 기병: 정밀 정련 비늘 흉갑과 터번형 투구 (아머 12), 마갑 전투마, 복합식 합성궁.\n보병: 누비 가죽 조끼 (아머 6), 가죽 방패, 중형 초승달 곡도.",
    "codeOfHonorKO": "타협이 없으며 약속을 신성하게 여기는 동방의 고결한 도덕률을 수호하며 술과 돼지고기를 멀리하는 spartan 성정을 지켰습니다.",
    "fortificationsKO": "두터운 사막 흙벽과 대리석 방벽, 거대 쇠창살 문으로 무장한 삼중의 원형 요새 성벽을 지어 방어합니다.",
    "appearanceEN": "Persians resemble the Saracens in stature (–1 SIZ, +1 DEX) and share the same other outward characteristics, though Persians are more handsome (+1 APP) with a copper tan, black curly hair, and deep brown eyes. Men wear a small pointy beard. They wear losefitting robes, turbans and ornamented curved daggers. Persian ladies wear ornamented dresses and a transparent veil which covers at least the upper half of their face.",
    "characterEN": "The people from Persia form a tolerant and Just civilization. Like the Saracens, the Persian culture separates the private and public life of men and women (Chaste). Because of the eternal wars with Byzantium, many Persians Hate [Byzantines]. Their warriors are simply described as V alorous: “ Persians are brave, trusting to the horse no less than to their skill with weapons. ” — Ermold the Black. Unlike all other cultures (including Saracens), Persians do not drink wine nor any other alcoholic beverage (T emperate). Persians never look a foreign woman directly in the eyes.",
    "skillsEN": "All noblemen are educated, are proficient in Reading & W riting and have a certain knowledge of Languages and Eloquence, but their pagan nature leads them to follow many superstitions (Faerie Lore). Compared to the Franks, the Persians have far more knowledge in the domains of sciences, manufacturing techniques and healing (Chirurgery). Persians are merchants by nature and travel great distances by land or sea to reach foreign markets (Stewardship). Life in the city has familiarized them with the subtleties of administrative and political machinations (Intrigue).",
    "relationsEN": "Even though contact is difficult, the Persians are more or less allied with the Franks against the Moors and Saracens, especially when Harun alRashid comes to power. Under King Pepin’s rule an embassy is sent to Baghdad, which returns in 768, together with Persian ambassadors and numerous presents. In 777, Persian ambassadors come to Charlemagne to negotiate an alliance against Marsile in exchange for support and the protection of pilgrims in the Holy Land. From 797 on, a number of embassies are exchanged, this time looking for an alliance against the Byzantines. The caliph sends Charlemagne many fabulous presents, including a white elephant and a waterclock. The Persians brought the emperor an elephant, monkeys, balsam, nard, and various ointments, spices, perfumes, and different medicines to such an extent that the East seemed emptied and the West filled. — Notker , 2.8 Negotiations between the Franks and the Persians are often about the city of Jerusalem. Harun agrees to put it under Frankish overlordship, although the Persians maintain their military presence to protect the Christians against the Saracens. Harun: “I will give the Holy Land into Charlemagne’s power, and I will be the advocate over it. He himself, whenever it shall seem most opportune, may direct envoys to me, and he will find me a most faithful steward of all the income of this very province. ” — Notker , 2.9",
    "dailyLifeEN": "Most Persians live close to a source of water, which they use to irrigate their fields. Other inhabited areas are the oases in the desert or the serails along the main caravan trails, where travelers and merchants spend time to rest and replenish their food and water supplies. Note that Persian food is very odd to Frankish taste and stomachs. The great Persian cities are supported by intensive irrigation agriculture. The trade in gold, horses, silk, spices and slaves is the prime source of wealth. Persian merchants have commercial relations with almost all known countries, including far Cathay and Sericane. Thanks to their farflung, international contacts, the Persians have made significant scientific progress in many domains. The Persian caliph himself employs many renowned scholars and accomplished artists, and his court has become a major home of innovation in many areas, such as astrology, pharmacology, alchemy, medicine, and music.",
    "warfareEN": "The Persians are eternally at war with the Byzantines. The backbone of the caliph’s army consists of light, very mobile cavalry. The infantry is slow and not always reliable. Infantry archers are used to harass the enemy until the horsemen charge or maneuver to outflank the enemy. The goal is often to reach the enemy camp in order to plunder it. The Persians’ favorite tactics are feigned retreats and nocturnal ambushes. The Persian Caliph flies a black banner and his soldiers wear black, apart from the troops defending Jerusalem, who wear white clothes.",
    "equipmentEN": "Nobles: Byzantine scale armor, conical pointed helmet (9 points) and a small shield (4 points); sword or mace, lance, curved dagger; a courser or a camel. Footmen: Light or no armor (0 to 2 points) and a small shield (4 points); spear or javelin or compound bow, curved dagger.",
    "codeOfHonorEN": "The feudalized Persians appreciate the noble code of knighthood as much as the Franks, which reinforces their friendship. Some particularly noble Persian knights even respect the ways of chivalry, like Carahue: “Just king, ” says he, “good grace, hear me now! They took Ogier away from you, but lest no one Should believe I was involved in such a heinous act, I will constitute myself your prisoner and thus stay Until Ogier the Dane shall be delivered. ” “What a chivalrous pagan!” say the Franks cheerfully. — Enfances Ogier",
    "fortificationsEN": "The coastal areas of the Holy Lands are defended by stone castles and guard towers in order to prevent Byzantine or Saracen raids. The cities in the Persian heartland are always protected by high walls and dozens of stone towers. In the countryside, all oases are guarded by a high stone tower. Even the caravan serails are often fortified."
  },
  {
    "key": "romans",
    "nameKO": "로마 귀족 세력 (Romans)",
    "nameEN": "The Romans",
    "emoji": "🏛️",
    "modifiers": {
      "SIZ": "-1",
      "STR": "-1",
      "APP": "+1"
    },
    "names": {
      "men": "Ambrosius, Aurelius, Claudius, Gaius, Gregorius, Hadrianus, Lucius, Tiberius",
      "women": "Agrippina, Camilla, Crispina, Drusilla, Julia, Novella"
    },
    "appearanceKO": "로마 교황청 근방에 거주하는 체구가 작고 이목구비가 뚜렷한 고대 로마인들의 후예입니다. 항상 백색 로마 토가를 걸치고 다닙니다.",
    "characterKO": "자신들의 고대 역사와 대리석 유적에 대해 대단한 프라이드(Proud)가 있으나 실제론 탐욕적이며(Selfish), 식탐이 높고 변덕스럽습니다(Indulgent).",
    "skillsKO": "교황청 라틴어 필사 및 율법 논쟁(Read/Write +10), 교황청 법정 외교(Courtesy +5), 종교 신학 지식(Religion +5)",
    "relationsKO": "샤를마뉴 대제에게 교황청 수호를 구걸하였으며 800년 크리스마스 날 대제에게 서로마 황제의 관을 씌워준 역사적인 협력 집단입니다.",
    "chronology": [
      {
        "year": "774년",
        "event": "대제가 파비아를 함락시키고 로마를 방문하여 교황청 영토 보존을 엄숙히 조인함."
      },
      {
        "year": "800년",
        "event": "대제가 로마 성 베드로 성당에서 성탄절 날 교황 레오 3세에 의해 서로마 황제로 등극함."
      },
      {
        "year": "809년",
        "event": "로마 폭동 발생 시 프랑크 정예 성기사단이 즉각 진입하여 교황의 신변을 철저히 사수함."
      }
    ],
    "dailyLifeKO": "로마 콜로세움과 포룸 유적 주변의 판잣집과 저택에 모여 살며 교황청 배급과 종교 관광 기부금으로 살아갑니다. 추기경단이 사법을 통제합니다.",
    "warfareKO": "스스로 군대를 육성할 능력이 거의 상실되어 로마 시민 자율 방범대와 교황청 소속의 프랑크 용병 대원들이 대신 전투를 전개합니다.",
    "equipmentKO": "방범 대원: 로마식 가죽 조끼 (아머 6), 구형 로마군 투구, 청동 단검 및 장창.\n시민: 백색 비단 토가 및 종교적 은제 십자가 장식 소지.",
    "codeOfHonorKO": "오직 현세의 이익과 교황청 정치적 영향력 보존만을 최고 가치로 삼으며 신학적 가치를 사법에 우선합니다.",
    "fortificationsKO": "황제들이 건설한 거대 고대 벽돌 석조 요새인 '산탄젤로 성채(Castel Sant'Angelo)'를 최종 거점으로 사수합니다.",
    "appearanceEN": "The Romans are handsome (+1 APP), rather small (–1 SIZ, –1 STR), darkhaired, often with an elegant but large nose. Men shave, and both sexes wear long robes, often white, and much jewelry.",
    "characterEN": "The Romans are Proud of their city and its prestigious history. They are always scheming (Deceitful) and forever concerned about food (Indulgent) and money (Selfish).",
    "skillsEN": "Due to their sophisticated education they speak well in public (Reading & W riting, Languages, Eloquence), and know their way around in a bureaucracy or at a senatorial meeting (Courtesy, Intrigue). Since Rome is the city of the Pope, the Christian dogmas and religion have no secrets for them (Religion). Many senior Church members are members of the local aristocracy, so the Church looks at the Romans citizens with a particular kind of affection (Standing [Church]).",
    "relationsEN": "Ever since the Pope anointed Pepin the Short and made the king and his descendants the official Protectors of Rome, the Franks have been unswervingly loyal allies of the Eternal City. Rome has been besieged by enemies more than once, and each time the Franks have come across the Alps to prevent the capture of the city.",
    "dailyLifeEN": "Of Roman origin, the rich papal cities are walled and often have paved streets, bathhouses, and various Roman monuments. Apart from the traditional economic functions of a great city, the most important source of income is the Church. The tithe brings in good money, as do the gifts of pilgrims and ambassadors seeking the favor of the Roman pontiff. In addition, the numerous cathedrals and abandoned tombs draw a lot of relic collectors from all over the West, and some unscrupulous Romans make a substantial living out of the relic trade.",
    "warfareEN": "The Pope maintains a permanent city guard and a fleet to ward off Saracen pirates and raiders. Most of the warriors are Roman citizens, but in times of need Christian mercenaries are hired.",
    "equipmentEN": "Equites (Knights): Scale armor and an iron helmet (10 points), wooden shield (6 points); sword, spear, dagger; charger and rouncy (note that Roman knights wear a cross on their helmet, instead of plumes). Footmen: Cuirbouilli armor and iron helmet (7 points), large shield (7 points); short sword, spear, dagger.",
    "codeOfHonorEN": "Roman knights often swear oaths on God. They have a very acute sense of personal Honor and can be quite touchy and easily provoked.",
    "fortificationsEN": "Rome is protected by impressive double walls and ancient stone guard towers. In times of extreme danger, the Pope and Roman citizens retreat to ancient fortified stone structures and brick monuments within the Eternal City."
  },
  {
    "key": "saxons",
    "nameKO": "작센 & 프리지아 세력 (Saxons & Frisians)",
    "nameEN": "The Saxons and Frisians",
    "emoji": "🌲",
    "modifiers": {
      "SIZ": "+1",
      "DEX": "-1",
      "STR": "+1",
      "CON": "-1"
    },
    "names": {
      "men": "Adalbert, Bruno, Egil, Gerold, Imma, Radbod, Sturm, Widukind, Wulf",
      "women": "Geva, Oda, Sebile, Thekla"
    },
    "appearanceKO": "제국 북동부 작센 밀림과 프리지아 해안가에 살며 멧집이 매우 좋은 장사(SIZ +1, STR +1)들입니다. 털가죽 망토를 두르고 다닙니다.",
    "characterKO": "대제의 억압적 가톨릭 개종 정책에 피로 항쟁하는 강인한 전사들입니다. 독립성이 극도로 높고 완고하며 이교 전통(Arbitrary)이 굳건합니다.",
    "skillsKO": "밀림 수렵 및 추적(Hunting +5), 혹한 야외 생존 및 겨울 늪지 지리(Awareness +5), 도끼 전투술(Axe +5)",
    "relationsKO": "대제가 평생 동안 무려 30년 넘게 피의 정벌(Saxon Wars)을 전개한 최대의 영적 숙적이자 변경의 공포 대상입니다.",
    "chronology": [
      {
        "year": "772년",
        "event": "대제가 작센의 심장인 신성한 거목 이르민술(Irminsul)을 철저히 베어버려 피의 복수전 촉발."
      },
      {
        "year": "782년",
        "event": "쥔텔 산맥 대첩 및 베르덴 참수형. 대제가 하루 만에 4,500명의 작센 포로를 처형함."
      },
      {
        "year": "785년",
        "event": "작센의 영웅 비두킨드(Widukind) 대공이 대제에게 세례를 받고 굴복하여 전쟁의 첫 기틀 완화."
      }
    ],
    "dailyLifeKO": "라인강 너머 울창한 침엽수 삼림 속의 목조 방벽 마을에서 농사를 짓고 사냥하며 거친 삶을 일굽니다. 전사 평의회 알팅(Althing)의 평결을 따릅니다.",
    "warfareKO": "기마술이 없어 전원이 땅에 발을 딛고 거대한 둥근 목제 방패를 겹쳐 짠 '방패벽(Shield Wall)' 전술과 무시무시한 양손 도끼를 휘두릅니다.",
    "equipmentKO": "작센 족장: 가죽 흉갑 및 강철 뿔 투구 (아머 8), 중형 둥근 가죽 방패, 양손 도끼.\n전사: 짐승 모피옷 (아머 4), 프리지아제 롱 소드, 단검 및 단궁.",
    "codeOfHonorKO": "기독교를 기만으로 여기고 침엽수 삼림 깊은 곳의 거목 이르민술 아래에서 게르만 고대 신들에게 피의 맹세를 올리는 전사 도덕을 수호합니다.",
    "fortificationsKO": "산꼭대기에 거대 흙벽 요새를 세우고 참호를 삼중으로 파내려 간 '시그부르크(Sigiburg)' 식 요새 성채를 운용합니다.",
    "appearanceEN": "The Saxons are rather clumsy (–1 DEX) and ugly (–1 APP) but, like the Danes, they are strong (+1 STR) and tall (+1 SIZ). They are blueeyed and have blond hair with wild beards. Saxons wear golden necklaces (torcs) as status symbols.",
    "characterEN": "The Saxons are sinful and evil devilworshipers, who have no honor (Arbitrary). These traitorous barbarians are Deceitful, and very V engeful and Cruel. The Saxons are ferocious by nature. They are much given to devil worship and they are hostile to our religion. They think it no dishonor to violate and transgress the laws of God and man. They are always willing to break the promises they make. Hardly a day passes without some incident which breaks the peace. Murder, robbery and arson are of constant occurrence. — Einhard",
    "skillsEN": "Frisian merchants are cunning tricksters (Stewardship). They know the law and have a very keen legal mind: Beware of the Frisians, my son. Let me tell you the tale of the unwary Frankish merchant who exchanged a gold torque for as much dust as a Frisian could hold in his clothes. The man gathered dust everywhere, scattered it over a large area of land, and then loudly proclaimed it to be his! — Res Gestae Saxonicae",
    "relationsEN": "The Saxons are the Franks’ most intimate and bitter enemies. Charles Martel and Pepin the Short both organized several punitive raids into Saxony, but they never aimed to conquer the land. T wo holy oaks were destroyed: one at Geismar, the other near Fritzlar, in 723. Allied to the Danes, the Saxons refuse to pay homage and regularly raid Austrasia and Thuringia. V ery early in his reign Charlemagne decides to conquer and convert his fierce neighbors. “W ar was duly declared on them. It was waged with immense hatred on both sides. ” — Einhard Slowly, the Franks take a physical and spiritual hold on Saxony. Missionaries build churches and the lands of its deported inhabitants are given to Frankish nobles or newly appointed Saxon counts. Paradoxically, the Saxon nobles (especially ladies) admire the refined Frankish court life. Indeed, several Saxon leaders rally to the Frankish cause at one time or another, for they are caught in a paradox: to effectively resist their Frankish neighbors, they must adopt the superior customs of feudalism and knighthood; but by doing so they lose the very things they are fighting for: their cultural identity and independence. After long years of bloody warfare, the Saxons are finally converted and assimilated, often becoming Charlemagne’s most loyal vassals. “United with the Franks, the Saxons came to form with them a single people. ” — Einhard",
    "dailyLifeEN": "Saxons are a seminomadic people and have no cities. Their villages are isolated from each other by forests and valleys, which are partly covered with peat bogs. Saxons depend on agriculture and the rearing of horses. The grassy valleys are used for cattle grazing. Most temporary settlements can be found along the rivers Elbe and W eser, where the Saxons live in wooden stablehouses. Whenever food shortages occur, the men raid neighboring regions, usually the agriculturally more developed Franks or Slavs. The Frisians live in the coastal marshes, either in small harbor villages with a long street parallel to the coast or navigable waterway, or on artificial, flattopped clay mounds. Their wickerwork houses are daubed with clay to make them waterproof. They fish, raise cattle, horses and sheep on the nearby salt marshes, and grow grain on the higher marsh land. Saxons speak a Germanic language very similar to Frankish. They often give alliterative names to their children. Most Saxons are illiterate; only their shamans use runes to carve their secret formulas on stones or on pieces of wood, which they strap to a man’s arm with leather. Runes are mainly used as safeguards against illness, dangers and bad luck. Saxony is poorly developed and the economy is based on cattle breeding rather than on arable farming. Since to Saxons land cannot be individually owned, a man’s wealth is measured by his livestock. Instead of coins, they use small pieces of hacked silver like the Danes. Nobles trade by bartering agricultural produce or luxury items like swords, jewelry or linen gowns. The only things they produce for trade are salt and ore. Frankish merchants almost never venture into Saxony. In contrast to inland Saxons, the Frisians have a coinbased currency system. They are renowned merchants (or pirates), and possess a considerable fleet based at Dorestad harbor. They trade widely with the British Isles, Scandinavia, the Baltic and along the rivers into the mainland all the way down to Spain and Italy.",
    "warfareEN": "The Saxons fight almost exclusively as infantry, because the dense forests doesn’t really favor mounted combat. Saxons often use shield walls, and they dig hidden ditches to disrupt enemy cavalry. In times of war, several clans come together and elect a warchief: The Old Saxons have no king but only a number of satraps who are set over the people and, when at any time war is about to break out, they cast lots impartially and all follow and obey the one on whom the lot falls, for the duration of the war. When the war is over, they all become satraps of equal rank again. — Bede",
    "equipmentEN": "Edhilingui/Hearthguard: Ring mail and an open iron helmet (8 points), a shield (6 points); sword, bow, dagger; courser or rouncy. Ceorl: Leather armor (4 points), shield (6 points); spear, axe or sword, bow, dagger.",
    "codeOfHonorEN": "Saxon warriors have no knightly honor, but they respect the traditions of hospitality. Generally, the only promises they keep are the ones they swear to their pagan gods. They do not hesitate to massacre women and children, and seem to delight in burning churches and killing monks and priests. However, sooner or later Saxon chiefs adopt the noble customs of knighthood.",
    "fortificationsEN": "Rich nobles often have small wooden ring forts on hilltops. The Saxons no longer build stone castles."
  },
  {
    "key": "slavs",
    "nameKO": "동부 슬라브 집단 (Slavs)",
    "nameEN": "The Slavs",
    "emoji": "🐸",
    "modifiers": {
      "SIZ": "-2"
    },
    "names": {
      "men": "Celeadrag, Dragan, Lecho, Pribina, Radost, Vladimir, Witzan",
      "women": "Brana, Doba, Nadia, Rada, Slata, Vera, Vesna"
    },
    "appearanceKO": "제국 극동쪽 엘베강 너머 습지대에 서식하는 왜소한(SIZ -2) 체구의 동유럽 원주민들입니다. 머리를 길게 땋아 내린 것이 특징입니다.",
    "characterKO": "손님에게 음식을 대접하는 환대(Hospitality) 전통이 최고로 깊습니다. 그러나 외세에 복종(Modest)하여 억압받는 경우가 대다수입니다.",
    "skillsKO": "늪지 및 강가 생존법, 낚시 및 통나무 배 제작, 약초 지식",
    "relationsKO": "대제는 이들을 가치가 미미한 벌레와 같이 무시했으나, 교묘한 외교 공작을 통해 작센 족을 견제하는 이이제이(以夷制夷) 동맹 세력으로 썼습니다.",
    "chronology": [
      {
        "year": "780년",
        "event": "오보드리트 슬라브 부족이 프랑크와 최초로 군사 우방 조약을 체결함."
      },
      {
        "year": "789년",
        "event": "대제가 엘베강을 도하하여 빌치 부족을 복종시키고 제국의 동쪽 경계선을 확립함."
      },
      {
        "year": "812년",
        "event": "가톨릭으로 개종한 슬라브 연맹이 제국을 도와 덴마크 바이킹 습격 방어에 동참."
      }
    ],
    "dailyLifeKO": "질척이는 늪지와 강변의 움집에서 농사를 짓고 야생 벌꿀을 채집하며 가난하게 살아갑니다. 부족 족장 평의회가 사법 전반을 대리합니다.",
    "warfareKO": "금속 갑옷이 전무하여 가벼운 나무 창과 활을 쏘고 재빨리 강 속으로 헤엄쳐 도망치는 늪지 생존 기습 전술을 펼칩니다.",
    "equipmentKO": "전사: 모피 쪼끼 및 가죽 아궁이 옷 (아머 4), 나무 방패, 목창, 뼈로 만든 화살 단궁.",
    "codeOfHonorKO": "기사도는 전혀 없으며, 동맹을 맺은 프랑크 영주들을 자신들의 고대 정령 신들 아래 정직하게 영접하는 신의율을 수호합니다.",
    "fortificationsKO": "늪지대 한가운데에 고리 모양의 목조 요새인 '그라드(Grad)'를 건설하여 최종 대피소로 운용합니다.",
    "appearanceEN": "Slavs are small (–2 SIZ) with dark, braided hair.",
    "characterEN": "Slavs value the sacred traditions of hospitality like no others. The word “slave” is derived from “Slav.” They are a relatively weak and submissive people (Modest, Cowardly), whose lands are conquered by the Saxons, Avars, Bulgars, Byzantines and Franks.",
    "skillsEN": "The Slavs have no particular skills or qualities that set them apart from other civilizations.",
    "relationsEN": "“What do these little frogs matter to me? I could carry seven, eight or nine of them about strung on my lance muttering I don’t know what! It’s a shame that our lord king and we should weary ourselves killing such worms!” — Notker the Stammerer , 12 The different Slavic tribes are constantly warring on each other, and these divisions are an opportunity exploited by Charlemagne, who sometimes uses one tribe to attack another. Conquered Slav tribes are either completely annihilated, or made subservient to a newly appointed local leader. Once converted, these tribes often become allies against the pagan Saxons.",
    "dailyLifeEN": "Like the neighboring Saxons, the Slavs have no real cities. They live primarily as fishermen, cattleraising herdsmen, or farmers, and trade with Saxons, Franks and Byzantines along the great navigable rivers and along the coasts. Their armed merchants travel in groups and use hacksilver, pelts and pieces of cloth as means of payment. In the areas under Hunnic control, the Slavs pay silver and furs as a tribute to their overlords. They build their villages on steep promontories or in boggy places difficult to access. Undefended rural settlements are often near navigable rivers or a lake, giving villagers a way to escape in case of attack. Larger trading villages are surrounded by timber walls, earthen ramparts and ditches, with several entrances. All men are shaved bald except for a single thin tail at the back. For women, hairstyle indicates their social position, age and marital status. Nobles practice polygamy. Chiefs welcome their important guests by taking a sauna together.",
    "warfareEN": "Internal strife, smallscale raids and ambushes are daily bread to the Slavs. A typical warrior band consists of around 200 warriors. They raid primarily to enhance wealth and community prestige for the leader and his druzhina, rather than to conquer. Slavs usually use ambushes, sudden attacks and tricks, often during the night. They tend not to fight in an organized fashion, nor do they like to fight in the open, but rather prefer difficult swampy grounds where heavy armored knights are at a disadvantage. Success against the Slavs depends mainly on speed, denying the targeted tribe time to organize its defenses. Their lack of military unity and strength makes them easy victims. Slav prisoners are often used as slave laborers by the Frankish army, deported into Frankland, or sold. Slavs themselves do not take slaves, but they do take war prisoners. However, they do not keep these indefinitely, but let them go after a certain period of time and payment of ransom.",
    "equipmentEN": "Nobles: Leather armor and metal helmet (6 points), wooden shield (6 points); sword, dagger; pony or rouncy. Footmen: Padded armor (2 points), wooden shield (6 points); spear, axe, sling or bow, dagger.",
    "codeOfHonorEN": "W arriors are loyal to their chief as long as he sustains them. They do not follow the customs of civilized warriors.",
    "fortificationsEN": "The strongholds serve as homes for tribal chiefs and as refuges for the local population. They are usually built on hilltops and fortified with limestone ramparts or compact earthen ringworks, with an access to fresh water. The clan leaders each have their own limestone fortress. These rather weak strongholds are built for prestige as much as any military purpose. The Slavs’ best defense is the virgin forest, which acts as an impenetrable bufferzone. Sometimes, they build linear earthworks between forests and marshes for archers to cover a hasty retreat."
  },
  {
    "key": "visigoths",
    "nameKO": "남부 서고트 명가 (Visigoths)",
    "nameEN": "The Visigoths",
    "emoji": "🏹",
    "modifiers": {
      "SIZ": "-1"
    },
    "names": {
      "men": "Adalric, Agobard, Bera, Chorso, Galindo, Milo, Sanilo, Tancred",
      "women": "Dodila, Esclarmunda, Guibourc, Radegonda, Sybil"
    },
    "appearanceKO": "프로방스와 피레네 이북 남부 도시에 거주하는 작은(SIZ -1) 체구의 서고트족 기사들입니다. 프랑크인과 흡사하나 구레나룻 턱수염을 단정히 기릅니다.",
    "characterKO": "남부의 비옥함 속에서 살아가는 예의 바르고(Modest) 합리적인 성정을 가졌습니다. 상업과 사법 행정에 대단한 소질이 돋보입니다.",
    "skillsKO": "승마 돌격 및 마술(Horsemanship +5), 화폐 통상 및 영지 행정(Stewardship +5), 지중해 다국어 구사(Languages +5)",
    "relationsKO": "사라센 침략자들에 맞서 스페인 변경령에서 프랑크 제국과 연대하였으며, 아스투리아스 기독교 왕국과 왕실 족보가 조밀하게 얽힌 든든한 동맹입니다.",
    "chronology": [
      {
        "year": "714년",
        "event": "사라센이 스페인을 병탄하자 서고트 명가들이 피레네 이북 아키텐으로 대탈출하여 안착함."
      },
      {
        "year": "754년",
        "event": "피핀 국왕이 셉티마니아를 완벽히 해방시키자 서고트 귀족들이 제국의 사법관으로 귀부함."
      },
      {
        "year": "804년",
        "event": "서고트 명문 출신의 베네딕트 성자가 젤론 수도원을 창설하고 기욤 대공을 영접함."
      }
    ],
    "dailyLifeKO": "지중해 남부 해안 도시의 비옥한 장원을 관리하고 올리브유와 과수 무역을 관장하며 부유하게 살아갑니다. 철저히 로마 성문법을 신뢰합니다.",
    "warfareKO": "프랑크의 무거운 플레이트 메일 전술을 차용하여 강력한 돌격 마술(Horsemanship)과 궁정 검술을 유기적으로 조합해 싸웁니다.",
    "equipmentKO": "기사: 최고급 사슬 메일 조끼 (아머 10), 강철 원형 투구, 서고트식 롱소드, 스패니쉬 호스.\n풋맨: 가죽 옷 (아머 6), 투창 및 중형 카이트 쉴드 방패.",
    "codeOfHonorKO": "프랑크의 봉건제와 성문 사법, 기사도 맹세를 대단히 정직하게 준수하며 교회의 자선 사업에 막대한 부를 쾌척합니다.",
    "fortificationsKO": "견고한 남부 석조 영지 성채와 방어용 벽돌 성탑 요새를 소유하여 영지를 안전하게 수호합니다.",
    "appearanceEN": "The Visigoths are slightly shorter than Franks (–1 SIZ) and usually have dark hair. The clothes worn by men and women differ little from the Gascon and Frankish styles, but Visigothic men have beards.",
    "characterEN": "The Visigoths are an easygoing, openminded and Modest people.",
    "skillsEN": "Even though they live in a rather urban and mercantile culture (Stewardship, Intrigue), the Visigoths are excellent horsemen (Horsemanship). The ethnic blend of their coastal towns contributes favorably to their Languages.",
    "relationsEN": "Almost all of Provence is still under Moorish control in 767. The Franks wholly reconquered Septimania in 754, and the independent Christian kingdom of Asturias has become their loyal ally against the Moors. The blood line of the Frankish kings and that of the Asturias have become mingled since the marriage of Pepin the Short and the Asturian Princess Bertrada Broadfoot, daughter of Floris and Blancheflour. Chronology (Provence, Septimania, Spanish March) 714 The Saracens conquer the Iberian Peninsula. 725 The Saracens conquer Septimania and Provence, taking captive many knights, who are sold as slaves. 739 Partial liberation of Aquitaine by Charles Martel. 754 Pepin the Short takes Narbonne with the help of the Lombards and the local nobility, completing the liberation of Septimania. 776 Tiebaut besieges Narbonne. 788 Emir Hisham raids Septimania. 790 William Shortnose captures Nîmes. 791 William Shortnose captures Orange. 793 Battle of the Archant, where Vivien dies. 801 The Franks capture Barcelona. 803 Charlemagne creates the Spanish March which contains Septimania, Provence and the territories conquered in northern Spain. William Shortnose becomes its marquis. Chronology (Asturias) 730 King Pelagius of Asturias discovers the holy bones of Saint James the Great in Santiago de Compostela, which attracts many Christian pilgrims. 768 King Fruela assassinated. 771 Charlemagne affirms Aurelio as the King of Asturias. 774 King Aurelio succeeded by Silo. 778 After the Battle of Roncevaux, Silo annexes Galicia. 783 At Silo’s death, Mauregato assembles an army and claims the throne of Asturias. Prince Alphonso II flees to the Basque Country. 789 At Mauregato’s death, the monk Bermudo is elected king. 791 Bermudo, defeated by the Saracens, abdicates. He is succeeded by Alphonso II. 798 Alphonso conquers Luiserna. 813 Death of Alphonso. His sonin-law Hugo the Orphan becomes the King of Asturias. Territories and Nations Septimania: Also called the Narbonnaise (the region around Narbonne), it extends to Beziers and the Rhone in the east, the Black Hills of Carcassonne in the north, the Basque Pyrenees in the west, and the Pyrenees and the Mediterranean to the south. The most important cities are Béziers, Carcassonne, Nîmes and the capital Narbonne. Provence: This nominally Frankish region is under Saracen control at the start of Charlemagne’s reign. Provence stretches out in the Rhone valley south of Lyon to the Alps in the east and the Rhone in the west. Its major cities are Arles, Nîmes and Orange. Asturias: This poor and isolated Christian kingdom is situated north of the River Douro, in the northwestern part of Spain. Its capital is Oviedo. The kingdom is divided into 4 regions: Castilia (abandoned by the Moors), Galicia (annexed by Alphonso II in 792), Cantabria, and Leon. Emirate of Cordoba: Founded on the ancient Visigothic Kingdom, the Saracen emirate is still largely inhabited by Visigoths, especially the northern T arraconensis region.",
    "dailyLifeEN": "The Visigothic territories were once rich farming lands producing wine and olive oil. The towns were autonomous and many Jews lived there in peace. But, at the start of Charlemagne’s reign, the lands of the Visigoths have been devastated by many years of warfare. T o recolonize these deserted lands, the king grants lands and immunities to Visigothic refugees on the condition that they resettle their ancient homes. These are usually small agrarian settlements and, rarely, towns. Normally, inherited land is partitioned between all adult sons by drawing lots, but Visigothic tradition allows married women to hold and to inherit property independently from their husbands. Visigothic women thus have a relatively important public role, all the more so since social structures are based on monetary as well as territorial wealth. In the towns, merchants and artisans have as much a say in local politics as knights. The harbor towns actively trade with cities in Italy, Spain, Frankland and the British Isles. A sizable Jewish merchant community can be found in most Visigothic towns. In the countryside, economic life is primarily local and centered around the rural villas. Sheep herding is the prime source of income in the mountains.",
    "warfareEN": "The Visigoths of Septimania and Provence are renowned horsemen using repeated hitand-run tactics. They frequently serve as mercenaries in feuds.",
    "equipmentEN": "Knights: Ring mail armor and an iron helmet (8 points), shield (6 points); sword, spear, dagger. Horsemen: Leather armor and an iron helmet (6 points); spear, bow, dagger. Footmen: Leather armor and cap (5 points), wooden shield (6 points); spear, bow, dagger.",
    "codeOfHonorEN": "Visigothic knights follow the same code of knighthood as the Franks and have the same sense of honor. The only difference is the fact that Visigothic lords hold allodial lands, free from the feudal obligations encumbering many Frankish knights.",
    "fortificationsEN": "Most castles are rather simple wooden or halfstone fortifications which serve to protect personal domains or abbeys."
  },
  {
    "key": "legendary",
    "nameKO": "전설의 땅 - 에티오피아 & 카테이 (Legendary Lands)",
    "nameEN": "Legendary Lands",
    "emoji": "✨",
    "modifiers": {},
    "names": {
      "men": "Senapo, Agrican, Gradasso, Brunello",
      "women": "Angelica, Clarice"
    },
    "appearanceKO": "제국의 영역을 아득히 벗어난 머나먼 극동과 아프리카의 존재들입니다. 황금 비단 외투를 걸치고 신비로운 마법 장신구를 두르고 있습니다.",
    "characterKO": "아득히 먼 미지의 세상에서 온 신비로운 영웅들입니다. 황금을 가볍게 여기며 고도의 신비로운 환술을 부립니다.",
    "skillsKO": "마법 주문 해제 및 환상 식별(Faerie Lore +10), 외국어 마스터(Languages +10)",
    "relationsKO": "사라센 세력의 배후 동맹이거나, 신비로운 보석을 지키는 존재들이며, 아스톨프 기사가 히포그리프를 타고 방문하여 우방의 인연을 맺었습니다.",
    "chronology": [
      {
        "year": "775년",
        "event": "동방 카테이(중국)의 안젤리카 공주가 대제의 어전에 출현하여 성기사단의 이성을 홀려 비장한 소동 유발."
      },
      {
        "year": "776년",
        "event": "성기사 아스톨프 경이 아프리카 에티오피아의 세나포 국왕을 아라비아 괴수들의 고난에서 구하고 동맹 구축."
      }
    ],
    "dailyLifeKO": "황금 성벽이 번쩍이고 공중 정원이 회전하는 장엄한 동방의 대수도 알브라카(Albracca)에서 마법적 번영을 누리며 풍족하게 삽니다.",
    "warfareKO": "마법과 신비로운 괴수(히포그리프 등), 그리고 온몸을 불사르는 강력한 동방의 마법 방패를 무기로 사용하여 프랑크 기병을 제압합니다.",
    "equipmentKO": "귀족: 황금 비단 판금 의복 (아머 15), 마법 보석 반지, 투명 비단 안개 베일.\n유목: 동양의 신비로운 마법 곡도, 룬 마법 나팔.",
    "codeOfHonorKO": "프랑크의 기사도를 모르지만, 기사들의 고결한 맹세에 감복하여 침례를 받고 스스로 성기사단에 자청해 합류하기도 하는 신비로운 명예 규범을 가졌습니다.",
    "fortificationsKO": "마법의 안개와 투명 주문으로 은폐되어 침입자들의 감각을 교란하는 공중 회전 성채를 소유합니다.",
    "appearanceEN": "Mysterious figures from far-off lands of Cathay in the East and Ethiopia in the South. They wear garments of gold and silk, and carry exotic magical treasures and jewelry.",
    "characterEN": "These travelers from unknown realms are fabulously rich and possess strange mystical abilities. In Cathay, they have so much gold that it is worthless to them. The Ethiopians are devout Christians who are deeply loyal to their king, Senapo.",
    "skillsEN": "The people of these lands are well-versed in magic, illusions, and unique healing arts, and speak exotic foreign languages.",
    "relationsEN": "The Ethiopians are allies of the Franks against the Saracens. Charlemagne helps them by sending grain, wine, and oil. The British knight, Astolf, visits Ethiopia during his travels in 776. Cathay's powerful magician sends his beautiful daughter and son to Charlemagne's court in 775.",
    "dailyLifeEN": "Ethiopia is described as a Christian island surrounded by pagans, ruled by Senapo, thought by some to be the legendary Prester John. The capital of Cathay is the fabled, wondrous city of Albracca, ruled by a powerful magician, where wealth and magic flourish.",
    "warfareEN": "They rely on magic, unique tactics, and legendary creatures such as the Hippogriff, or standard eastern mercenaries, to overwhelm their enemies.",
    "equipmentEN": "Nobles: Golden silk plate garments (15 points armor), magical gem rings, invisible silk mist veils.\\nNomads: Mystical eastern scimitars, runic magic horns.",
    "codeOfHonorEN": "They are noble and honorable figures who, though unfamiliar with Frankish chivalry, possess a deep spiritual sense of honor; some may choose to receive baptism and join the Paladins.",
    "fortificationsEN": "They possess mystical levitating castles, magical abbeys, and ancient cities shielded from intruders by magic and illusion."
  }
];

export const frankishSociety = [
  {
    "key": "crown",
    "titleKO": "왕권과 봉건제 (Crown & Feudalism)",
    "icon": "Shield",
    "topics": [
      {
        "titleKO": "국왕의 신성한 지위 (Spiritual Kingship & Mundane Rule)",
        "nameEN": "Spiritual Kingship & Mundane Rule",
        "desc": "프랑크 왕국의 군주는 단순한 세속적 군사 지도자가 아닌, 하느님의 선택을 받고 교황에 의해 성유식(Anointing)을 치른 신성한 구원의 대행자입니다. 왕은 영적으로 백성들의 영혼을 하느님께 인도할 책무를 가지며, 세속적으로는 백작들을 자신의 권위 아래 통제하는 절대적 군주입니다.",
        "trpgRules": "기사들은 국왕(대제)을 향한 성스러운 열망인 'Loyalty [Charlemagne]' 또는 'Loyalty [King]' 열망을 15점 이상 유지할 때 국왕의 직접 명령에 직면할 경우 의지 및 열망 판정(Loyalty Roll)에 +5 보너스를 받습니다. 대제의 어명이 내리면 기사는 즉각 열망을 판정해 고무(Inspired) 상태에 돌입할 수 있습니다."
      },
      {
        "titleKO": "봉건 피라미드와 서약 (Feudal Pyramid & Homage)",
        "nameEN": "Feudal Pyramid & Homage",
        "desc": "샤를마뉴 제국의 중추는 Homage(봉신 서약)와 Fealty(충성 서약)로 구성된 쌍무적 계약 관계입니다. 봉신은 주군 앞에 무릎을 꿇고 합장한 손을 주군의 두 손에 얹으며 평생의 복종을 서약합니다. 주군은 이에 답해 입맞춤을 베풀며 장원(Manor)의 분봉과 기사 가문의 보호를 약속합니다.",
        "trpgRules": "봉신 서약의 핵심은 Aid(군역 협조)와 Counsel(자문)입니다. 봉신 기사는 매년 최대 40일간의 무상 군역 의무를 지며, 주군의 소집 명령에 고의적으로 불응(Dereliction of duty - Herisliz)할 경우 사법 의회에서 탄핵당하고 기사의 영지(Fief)가 즉각 회수 및 가산 압류될 수 있습니다."
      },
      {
        "titleKO": "신분 삼분설 (Trifunctional Model)",
        "nameEN": "Trifunctional Model",
        "desc": "프랑크 사회는 하느님이 정하신 신성한 삼분설(Three-order Model)에 기반합니다. 기도하는 자(Oratores - 성직자), 싸우는 자(Bellatores - 기사 및 귀족), 노동하는 자(Laboratores - 농민 및 평민)가 서로를 상호 보완합니다. 기사는 무력으로 교회를 수호하고 백성을 지키며, 농민은 식량을 공출하여 모두를 먹여 살립니다.",
        "trpgRules": "TRPG 캠페인 시작 시 신분 계급은 캐릭터의 초기 Glory 점수와 가문 상속 자산에 결정적인 영향을 줍니다. 기사 가문은 기사 계급(Bellatores)에 속하여 기본적으로 1,000 Glory를 안고 시작하며, 평민 출신이 전장에서 대실패(Fumble) 없이 가공할 무공을 증명해 기사 작위를 받는 경우 추가로 500 Glory를 즉시 획득합니다."
      },
      {
        "titleKO": "영지와 장원 분봉 (Land & Fiefs)",
        "nameEN": "Land & Fiefs",
        "desc": "제국의 영지는 소유 방식에 따라 완전 독립적 자유 영지인 Allod(자유 직할령), 왕실 소유의 국유지인 Fisc(국유 장원), 그리고 군역의 대가로 일시 대여된 봉토(Feud / Precarium)로 나뉩니다. 성기사들은 대제로부터 직접 분봉을 받은 영주 기사로서, 자신의 Demesne(영주 직할지)과 소속 가솔들을 돌봐야 합니다.",
        "trpgRules": "표준 장원(Demesne Manor) 1개소는 매년 영주에게 £6(실링/펜스 환산) 상당의 연간 경제적 소득을 산출합니다. 겨울 단계(Winter Phase) 동안 기사는 영지 관리 기술(Stewardship) 판정을 수행해야 하며, 판정 대실패 시 장원에 흉작이나 가축 역병이 돌아 소득이 -£2 실추되고, 대성공 시 추가 보너스 풍작 소득 £2를 얻습니다."
      },
      {
        "titleKO": "백작과 공작 (Counts & Dukes)",
        "nameEN": "Counts & Dukes",
        "desc": "대제는 각 행정 구역(County)마다 백작(Count)을 수임하여 민정, 사법, 세무를 총괄하게 합니다. 국경의 대규모 요충 관구는 여러 백작령을 아우르는 대공작(Duke)이나 변경백(Margrave)이 다스려, 외래 이교도들의 기습적인 대규모 국경 침공을 상시 방어하고 영토의 통치권을 영구히 보장합니다.",
        "trpgRules": "백작급 주군은 전시 소집 시 최소 10명 이상의 중장 기병 전단(Banneret)을 징집할 권한이 있습니다. 플레이어 기사가 백작의 기치 하에 소집되어 전투를 치를 경우, 주군의 'Loyalty [Count]' 열망을 굴려 성공 시 전투 개막 직후 부대 전체가 군사 격려(Inspired) 혜택을 획득합니다."
      }
    ]
  },
  {
    "key": "justice",
    "titleKO": "사법과 특사 (Justice & Royal Envoys)",
    "icon": "Scale",
    "topics": [
      {
        "titleKO": "제국의 법률과 관습법 (The Law)",
        "nameEN": "The Law",
        "desc": "제국의 사법 체제는 고대 게르만족 부족 관습법(살리카 법 등)과 교회의 성스러운 카논 성법(Canon Law), 그리고 대제가 반포하는 제국 칙령(Capitularies)이 유기적으로 조화된 복합적 권한입니다. 법은 백성의 공명정대한 질서를 확립하고 이교 세력의 악습을 타파하는 수단으로 작용합니다.",
        "trpgRules": "제국 칙령에 따라 기독교를 모욕하거나 교회의 성물을 훼손하는 자는 즉각 형사 사법 재판에 회부되어 영구 교수형에 처해집니다. 사법 재판 중 기사 캐릭터는 법률 지식(Law)이나 지혜(Int) 능력치 판정을 통해 피고의 불합리한 혐의를 변론하고 감형 청원을 이끌 수 있습니다."
      },
      {
        "titleKO": "사법 재판과 의회 (Judicial Courts)",
        "nameEN": "Judicial Courts",
        "desc": "제국 내에서 정의를 실현하는 법정은 세 가지 채널이 있습니다. 친족 간의 사적인 복수인 Feud(혈투 피의 복수), 백작이나 대주교가 주재하는 백작령 법정(Public Court), 그리고 대제가 몸소 주재하는 왕실 사법 의회(Royal Court)입니다. 왕실 의회는 최고 수준의 맹약 범죄와 반역 혐의를 처단합니다.",
        "trpgRules": "배신이나 음모 혐의로 피고를 고소하려는 기사는 법정에서 정식 증거와 증인(Inquiry)을 제시해야 합니다. 법정 판결 단계에서 심문관은 청문 판정(Inquiry Roll)을 통해 진실을 수색하며, 배신 혐의가 공적으로 입증된 기사는 기사 작위가 박탈(Degraded)되고 영주 가문에서 영원히 추방당합니다."
      },
      {
        "titleKO": "신성 결투와 신명 재판 (Trial by Combat & Ordeal)",
        "nameEN": "Trial by Combat & Ordeal",
        "desc": "물증과 증인이 불충분할 때, 프랑크 법정은 하느님이 결코 거짓을 방관하지 않으신다는 믿음 아래 신의 심판을 구합니다. 기사들은 보검을 휘둘러 무력으로 옳고 그름을 입증하는 신성 결투(Trial by Combat)를 벌이며, 성직자나 평민들은 뜨거운 달군 철판을 쥐거나 끓는 물에 손을 넣는 가혹한 신명 재판(Trial by Ordeal)을 거칩니다.",
        "trpgRules": "신성 결투는 양측 대전사가 죽거나 항복할 때까지 1대 1 결투(Judicial Duel)로 진행됩니다. 결투 중 판정이 대실패(Fumble)할 경우 칼이 부러지거나 방패가 박살 나는 신의 징벌을 받습니다. 신명 재판의 경우, 피고는 CONx3 판정을 수행해야 하며, 판정 실패 시 치명적인 화상 피해(3d6 HP 감소)와 함께 즉각 유죄 판결을 받아 처형됩니다."
      },
      {
        "titleKO": "황제 순찰사 (Missi Dominici)",
        "nameEN": "Missi Dominici",
        "desc": "제국 전역의 백작과 영주들이 황제를 기만하고 부패를 저지르는 것을 방지하기 위해, 대제는 성스러운 전령관 특사인 황제 순찰사(Missi Dominici) 제도를 운영합니다. 일반적으로 지혜로운 대주교와 강직한 백작이 2인 1조가 되어 각 변경 관구를 순찰하며, 불합리한 지방 판결을 뒤집고 황실에 직접 보고합니다.",
        "trpgRules": "순찰사는 황제의 인장이 찍힌 성물을 소지하여, 지방 영지의 군사 징집권과 사법권을 일시적으로 초월 통제합니다. 플레이어 기사가 황제 순찰사의 명령에 협조하거나 동행 변경 임무를 성실히 완수할 경우, 황실의 두터운 신임을 입증하여 어전에서 직접 전설적인 Glory +200 보상을 획득하게 됩니다."
      }
    ]
  },
  {
    "key": "palace",
    "titleKO": "궁정과 예법 (The Palace & Court Life)",
    "icon": "Crown",
    "topics": [
      {
        "titleKO": "궁정 아카데미와 소문자 서체 (Palace Academy)",
        "nameEN": "Palace Academy",
        "desc": "대제는 아헨(Aachen) 왕궁에 전 유럽의 지성을 소집하여 궁정 아카데미(Palace Academy)를 건립하고 학문을 부흥시킵니다. 석학 앨퀸(Alcuin)이 주도한 이 부흥기 속에서 지식인들은 복잡한 서체를 통일하고 전설적인 고전 라틴어 사본들을 복제하는 위대한 카롤링거 르네상스를 꽃피웁니다.",
        "trpgRules": "제국 전역의 수도원 학교에서는 읽기, 쓰기, 음악을 장려합니다. 기사가 학문 기술인 'Read [Latin]' 또는 'Composing' 예지 능력을 연마해 10점 이상 달성할 경우, 궁정 어전 회의나 귀부인들과의 대화 판정에서 카리스마적 +3 매력 보너스 혜택을 상시 획득합니다."
      },
      {
        "titleKO": "궁정 알현 및 연회 예법 (Court Protocol)",
        "nameEN": "Court Protocol",
        "desc": "황실 궁정 라이프는 완벽히 규격화된 네 단계의 장엄한 예법으로 구성됩니다. 대제를 친견하는 알현(The Interview), 산해진미와 칠현금 선율이 울려 퍼지는 장엄한 연회(The Feast), 기사의 품격에 걸맞은 격조 높은 숙식 대접(Accommodations), 그리고 보검과 비단을 하사받아 주군의 곁을 떠나는 작별(Departure)입니다.",
        "trpgRules": "궁정 연회에 참석한 기사는 사교 기술인 'Courtesy' 및 'Intrigue' 기술을 사용해 타 귀족 가문들의 동태를 정찰합니다. Courtesy 판정 대성공 시 타 백작 가문의 막강한 후원 약속을 받아 영지 소득 보너스를 얻을 수 있으며, 판정 대실패 시 술기운에 실수를 범해 가문의 위신 Glory -50 감점 수모를 겪습니다."
      },
      {
        "titleKO": "궁정 사냥 (Hunting)",
        "nameEN": "Hunting",
        "desc": "사냥은 단순한 여가가 아닌, 기사들이 거친 숲속에서 전술적 기마 능력과 예리한 감각을 단련하는 성스러운 무예 훈련입니다. 대제와 성기사들은 아르덴 숲이나 라인강 기슭의 깊은 원시림으로 나아가 가공할 힘을 지닌 거대 야생 멧돼지(Boar)와 성스러운 은빛 사슴(Stag)을 추적합니다.",
        "trpgRules": "사냥 시 기사 캐릭터는 Hunting 기술 판정을 매 세션 수행합니다. 사냥 성공 시 기사는 신선한 식량 보급과 함께 무용담 Glory +20을 얻습니다. 사냥 도중 '야생 동물 대습격' 카드 조우 시 기사는 즉각 전투 판정을 펼쳐야 하며, 멧돼지의 엄니 기습에 방심할 경우 중상을 입고 겨울 회복 판정에 심각한 불이익을 받습니다."
      },
      {
        "titleKO": "고결한 사랑 (Fin’amor)",
        "nameEN": "Fin’amor",
        "desc": "궁정 예법의 꽃은 시인들과 고귀한 레이디들이 창안한 고결한 사랑, 즉 Courtly Love(Fin’amor)입니다. 이 사랑은 세속적인 탐욕과 정욕(Lustful)을 배제하고, 오직 연인을 향한 영혼의 절대적 충성과 고결함을 갈고닦아 영웅적 무공을 촉발하는 성스러운 순수 열정의 완성입니다.",
        "trpgRules": "Fin’amor를 맹세한 기사는 연인에 대한 절대적 숭배 열망인 'Amor [Lady]' 또는 'Love [Amor]' 열망을 16점 이상 보유해야 합니다. 결전 직전 연인의 징표(손수건, 반지)를 가슴에 얹고 판정에 성공할 경우, 기사는 고무(Inspired for Amor) 상태가 되어 전투 중 Damage 및 모든 기술 수치가 즉각 2배로 상승합니다."
      }
    ]
  },
  {
    "key": "knighthood",
    "titleKO": "기사도와 토너먼트 (Knighthood & Tournaments)",
    "icon": "Award",
    "topics": [
      {
        "titleKO": "기사 수역과 서임식 (Becoming a Knight)",
        "nameEN": "Becoming a Knight",
        "desc": "기사 가문의 자손들은 10세가 되면 타 영주의 성에서 Page(시종) 생활을 하며 예법을 배우고, 14세가 되면 Squire(종자)가 되어 주군의 전장을 호위합니다. 마침내 21세의 성년이 되면 하룻밤 동안의 성당 참회 기도와 성수 목욕 의식을 치른 뒤, 주군의 성검 아콜레이드(Accolade - 타격)를 통해 장엄한 기사 작위를 수여받습니다.",
        "trpgRules": "서임식 직후 새내기 기사는 주군으로부터 Warhorse(전쟁군마), Shield(기사방패), Chainmail hauberk(사슬 갑옷), 그리고 성스러운 검을 지급받습니다. 기사 대관을 완성한 기사는 즉시 영예로운 Glory +1,000 점을 가문 일지에 영구히 기록하며 제국의 적법한 전사로 대우받습니다."
      },
      {
        "titleKO": "성기사의 3대 원대한 이상 (The Three Ideals)",
        "nameEN": "The Three Ideals",
        "desc": "프랑크 제국의 기사는 자신의 도덕적 성향치에 따라 3대 위대한 기사의 경지에 도달할 수 있습니다. 맹렬한 용기와 정의를 다듬는 기사도적 기사(Chivalrous Knight), 신앙과 용서를 추구하는 신앙적인 기사(Religious Knight), 그리고 고결한 연인과 신의를 지키는 낭만적인 기사(Romantic Knight)가 그것입니다.",
        "trpgRules": "기사도적 기사는 Energetic/Generous/Just/Merciful/Modest/Valorous 성향 합산 90점 이상 달성 시 활성화되며 상시 +3 invisible Armor 보너스를 받습니다. 신앙 기사는 Chaste/Forgiving/Merciful/Modest/Temperate/Trusting 합산 90점 시 기도(Prayer) 판정에 +5 가산치를 얻고, 낭만 기사는 매 세션 1회 주사위 재굴림 특권을 얻습니다."
      },
      {
        "titleKO": "마상 토너먼트 (Tournaments)",
        "nameEN": "Tournaments",
        "desc": "대제는 기사들의 전술적 역량을 연마하고 우방국 사절들에게 제국의 군사적 패권을 과시하기 위해 장엄한 마상 토너먼트(Tournaments)를 정기적으로 소집합니다. 초기 1기에는 맹수 격투와 Bohort(목조 단체 기동전) 위주였으나, 제국 중기 2기부터는 Joust(1대 1 마상 창시합)와 대규모 Melee(단체 모의 전술 백병전)로 정교화됩니다.",
        "trpgRules": "마상 시합(Joust) 시 기사들은 평화용 무딘 랜스(Blunted Lance)를 사용합니다. 랜싱 기술(Lance)과 기마 기술(Horsemanship) 대결로 상대 기사를 말 안장에서 쳐 떨어뜨리는 낙마(Knockdown) 성공 시, 막대한 Glory +100 점과 함께 상대의 군마와 갑옷을 전리품으로 압수하거나 정식 몸값을 요구할 기사적 권리를 쟁취합니다."
      }
    ]
  },
  {
    "key": "dailyLife",
    "titleKO": "영지 생활과 사회 (Daily Life & Economy)",
    "icon": "Home",
    "topics": [
      {
        "titleKO": "장원과 농민의 노역 (Demesne Hall & Peasant Labor)",
        "nameEN": "Demesne Hall & Peasant Labor",
        "desc": "기사의 영지는 영주 직할 홀(Lord's Hall)과 농민들의 밀집 부락(Villages)으로 구성됩니다. 자유 농민과 예속 농노(Serfs)들은 영주 직할지(Demesne Lands)에서 매주 일정 일수 이상의 무상 강제 노역(Corvee)을 수행해야 하며, 방앗간(Mills) 이용세와 수확량의 일정 세금을 영주 기사에게 꼬박꼬박 공출해야 합니다.",
        "trpgRules": "겨울 단계의 영지 사태 굴림 시, Stewardship 기술 판정에 대실패(Fumble)할 경우 가혹한 수확 부진과 농민 소요가 겹쳐 기사 가문의 연간 영지 소득이 대폭 소실됩니다. 반면 Stewardship 성공 시 평화로운 세입 수거로 영지의 인프라(방앗간 재건, 양묘장 증설 등)를 확장해 가문의 Glory를 매년 누적해 나갈 수 있습니다."
      },
      {
        "titleKO": "제국의 도로망과 여정 (Travel & Danger)",
        "nameEN": "Travel & Danger",
        "desc": "제국의 도로망은 고대 로마인들이 닦은 석조 가도(Roman Roads)와 흙길 임도들로 연결되어 있습니다. 기사단이 원정이나 순찰을 나갈 때, 거친 아르덴 숲이나 울창한 변경림은 수많은 야생 곰, 늑대 떼, 그리고 무자비한 이교도 산적단(Robber Knights)들이 도처에 잠복한 가혹한 위험 지대입니다.",
        "trpgRules": "제국 가도를 이탈해 여행할 때, 기사단은 Horsemanship 및 Awareness 판정을 상시 통과해야 합니다. 판정에 대실패(Fumble)할 경우 험난한 협곡에서 군마가 발을 헛디뎌 낙마하거나, 독사에게 물리거나, 소지한 모든 식량을 강탈당하는 처참한 재해(Travel Mishaps)를 입어 여정이 일시적으로 중단됩니다."
      },
      {
        "titleKO": "무역, 화폐 및 노예제 (Trade & Slavery)",
        "nameEN": "Trade & Slavery",
        "desc": "프랑크 제국의 경제는 피핀이 도입하고 샤를마뉴 대제가 쇄신한 은화 체제인 데나리우스(Deniers)에 기반합니다. 제국 동부와 남부 국경 지대에서는 비잔티움 비단과 코르도바 가죽이 활발히 밀거래되며, 전쟁 중 사로잡힌 이교도 죄수들을 매매하는 가혹한 노예 거래와 지중해 노예 무역선도 빈번히 정박합니다.",
        "trpgRules": "플레이어 기사가 스페인이나 이탈리아 전역에서 이교 사라센 포로들을 대거 사로잡는 경우, 이들을 가축 변경 농노로 편입시키거나 해상 시장에 판매하여 즉각 은화 £2~£5당의 전리품 일시불 현금 자산을 획득할 수 있습니다. 다만, 기사도적 기사(Chivalrous)는 비기독교적 노예 상업 참여 시 Honor 열망 수치가 -1 깎입니다."
      },
      {
        "titleKO": "가족과 여성의 권리 (Family & Women)",
        "nameEN": "Family & Women",
        "desc": "가부장적 전통 속에서도 프랑크 법률은 여성 기사의 존재를 매우 제한적이나마 인정하며(브라다만테와 같은 전사 마이든), 미망인을 위한 Widow's Portion(미망인 상속 몫 - 사후 남편 재산의 3분의 1 상속권) 제도를 명시하고 있습니다. 귀족 가문의 Heiress(상속녀)는 대제의 특별 윤허를 얻어 자신의 장원을 성실히 방어할 의무를 가집니다.",
        "trpgRules": "영주 기사가 후손(Son/Daughter) 없이 전사할 경우, 미망인 귀부인은 가문의 수호를 보장받기 위해 대제 앞에서 정식 상속 청원(Widow's Portion Claim) 판정을 수행해야 합니다. 기사도적 기사단원이 이들의 정당한 상속 분쟁 결투 대전사(Champion)로 참전해 결투를 승리로 이끌 경우 엄청난 명예 점수인 Glory +150을 선사받습니다."
      }
    ]
  },
  {
    "key": "church",
    "titleKO": "교회와 신앙 (The Church & Clergy)",
    "icon": "Book",
    "topics": [
      {
        "titleKO": "성직자 계급과 수도원 (Clergy & Monks)",
        "nameEN": "Clergy & Monks",
        "desc": "제국의 기독교 영적 통치망은 대수도원장(Abbot)과 대주교(Bishop)에 의해 주도됩니다. 대지가 축복을 받는 영적 중심인 베네딕토회 수도원(Abbeys)들은 황실의 든든한 학문과 종교 지지 세력이 되며, 은둔 수련을 고집하는 Hermits(은둔 수도사)들은 숲속 깊은 성당에서 주의 신성한 계시를 대변하곤 합니다.",
        "trpgRules": "은둔 수도사나 대주교를 적으로 삼거나 약탈하는 영주는 대제에 의해 영지가 몰수될 뿐 아니라 즉각 파문(Excommunication) 조치를 당합니다. 파문을 당한 기사는 성가족 예배 보너스를 일절 받을 수 없으며, 겨울 회복 판정에 심각한 패널티(-5)를 받아 상처 치유 속도가 현저히 지체됩니다."
      },
      {
        "titleKO": "성인 축성과 성물 (Angels, Saints & Relics)",
        "nameEN": "Angels, Saints & Relics",
        "desc": "제국 민중의 신앙은 기적을 부르는 순교 성인(Saints)들과 그들의 유해 성물(Relics) 숭배와 밀접합니다. 성인들이 흘린 핏방울이나 성유물, 성스러운 검, 그리고 천상의 성 힐데베르트 성가 등은 전쟁터에서 악마들의 간계를 물리치고 성기사단의 육신을 수호하는 하느님의 성스러운 신비입니다.",
        "trpgRules": "기사 캐릭터가 공식 성물(예: 성 가브리엘의 깃털, 성인 뼈 조각 등)을 성당에서 정식 분수하여 갑옷 가슴받이에 봉헌 소지할 경우, 성령의 구호 판정(Divine Aid Roll) 성공 확률이 25% 가산됩니다. 또한 마법적인 저주나 이교 마녀의 사악한 환각 공격에 조우할 때 즉각 저항력 +5 보너스를 받습니다."
      },
      {
        "titleKO": "신의 평화와 정의로운 전쟁 (Peace of God & Just War)",
        "nameEN": "Peace of God & Just War",
        "desc": "교회는 불필요한 동족상잔을 방지하기 위해 신의 평화와 휴전(Truce of God - 지정된 절기와 주말에는 유혈 무장 결투 엄금) 교리를 반포합니다. 동시에 성지를 정복하고 이교 세력을 축출하기 위한 성전은 '정의로운 전쟁(Just War / Holy Crusade)'으로 승인하여, 성전에 참가하는 전사들의 모든 죄업을 사하는 대대적 교세를 전개합니다.",
        "trpgRules": "신의 휴전(Truce of God)을 준수하지 않고 기독교도 기사와 사적인 사투를 벌이는 자는 즉각 기사도 명예 Honor 열망 수치가 5점 강제 소멸되는 치명적인 대실패를 겪습니다. 반면 정의로운 전쟁(Just War) 원정군 기치 하에 참전해 이교 장수를 척살한 경우, 참회 성찰 성공률이 2배로 강화됩니다."
      }
    ]
  },
  {
    "key": "warfare",
    "titleKO": "전쟁과 요새 (Warfare & Fortifications)",
    "icon": "Sword",
    "topics": [
      {
        "titleKO": "Scarae와 원정군 조직 (Palatine Scarae & Campaign)",
        "nameEN": "Palatine Scarae & Campaign",
        "desc": "대제는 매년 봄이 되면 소집령(May Field)을 통해 연례 군사 원정을 소집합니다. 정규 기병 외에도 대제 직속의 상시 기동 최정예 scarae(스카라 전사단)를 국경에 상시 전진 배치하여 신속한 기습 타격을 완수하며, 성기사단(Paladins)은 이 철기병 군단의 최선봉장이 되어 돌격을 진두지휘합니다.",
        "trpgRules": "Scarae 기병단의 일원으로 수임된 기사는 매월 군마 기동력 및 전술 판정 시 상시 +3 가산 보너스를 얻습니다. 대규모 야전 기습 시 Scarae 호위 전단은 선제 기선제압 돌격(Charge Initiative)을 무조건적으로 쟁취하여, 적군 궁수대의 일제 사격 전에 적의 중앙 진형을 돌파할 수 있습니다."
      },
      {
        "titleKO": "기병 돌격과 전술 (Cavalry Bataille & Tactics)",
        "nameEN": "Cavalry Bataille & Tactics",
        "desc": "프랑크 기사 전술의 핵심은 기마 랜스 충격력에 기반한 장엄한 Bataille(기병 제파 전열 돌격)입니다. 강력한 쐐기 대열(Wedge Formation)로 집결된 중장 기병단은 적의 전선 한가운데로 기병 랜스 돌격을 펼치며, 보병 전사들이 적의 후방 진형을 포위하는 기마 유기적인 포위 전술로 전투를 지배합니다.",
        "trpgRules": "전투 전 단계에서 기마 돌격 전술(Battle) 판정 성공 시, 기사 전체 부대는 첫 돌격 라운드 공격력 보정치가 +1d6 주사위만큼 추가 가산됩니다. 돌격 도중 Horsemanship 판정이 대실패(Fumble)할 경우 말이 뒤집히며 기사는 낙마해 2d6의 충격 데미지를 즉시 입고 지상 백병전으로 강제 돌입합니다."
      },
      {
        "titleKO": "흙둔덕 목조 요새와 석조 성곽 (Motte & Bailey & Stone Castles)",
        "nameEN": "Motte & Bailey & Stone Castles",
        "desc": "제국 초기의 표준 성곽은 Motte and Bailey(인공 흙둔덕 위에 나무 울타리와 탑을 세운 보루 요새)였습니다. 짓기 저렴하고 방어 성능이 우수하지만 이교도들의 불화살 투석 공격에 매우 약했기에, 제국 중기부터 대제는 석조 아성(Stone Keeps)과 정교한 기계식 옹성 게이트하우스(Gatehouses)를 증축해 국경의 철통 보안을 완성합니다.",
        "trpgRules": "Motte 요새 공성 시, 수비군은 높은 지리적 이점으로 모든 활 사격 및 돌팔매질 판정에 방어력 +3 보너스 칩을 받습니다. 플레이어 기사가 장원 업그레이드를 통해 목조 보루를 'Stone Keep(석조 성채)'으로 보강할 경우 영주로서의 Glory 점수가 +300 대폭 누적되며 공성 침략에 영구히 완전 면역 혜택을 지닙니다."
      }
    ]
  }
];

// Chapter 14: Frankland Territories Complete Database
// Fully localized in Korean with premium TRPG lore, matching pages 261-282.

export const franklandTerritories = [
  {
    "key": "austrasia",
    "emoji": "👑",
    "nameKO": "오스트라시아 (Austrasia)",
    "nameEN": "Austrasia",
    "rulerKO": "샤를마뉴 대제 (King Charlemagne) & 아르덴의 티에리 공작",
    "rulerEN": "King Charlemagne & Duke Thierry of Ardennes",
    "passionKO": "주군에 대한 충성 (Loyalty [King]) 15점 또는 명예 (Honor) 15점",
    "passionEN": "Loyalty (King) 15 or Honor 15",
    "modifiers": [
      { "name": "영주 직할령 관리 (Stewardship)", "value": "+2" },
      { "name": "수렵 (Hunting)", "value": "+2" },
      { "name": "요정 전설 (Faerie Lore)", "value": "+3" }
    ],
    "descKO": "오스트라시아는 프랑크 제국의 역사적 발상지이자 종교, 사법, 군사적 중추입니다. 서쪽의 랭스로부터 동쪽의 베저강에 이르기까지 광활하게 뻗어 있으며, 아헨 황실 궁정과 울창한 아르덴 삼림을 품고 있습니다. 빽빽한 원시림과 기름진 강 유역을 따라 요새도시와 거대 대수도원들이 밀집해 있으며, 제국 최정예 철기병단인 스카라(Scarae)의 모병 거점이기도 합니다.",
    "descEN": "The heartland of the Frankish Empire, extending from Reims to the Weser. It is a land of dense forests, rich river valleys, and powerful ecclesiastical immunities. As the seat of the Imperial Palace of Aachen, it represents the absolute center of Carolingian authority, religion, and military power.",
    "subdivisions": [
      {
        "nameKO": "아르덴 공국 (Duchy of Ardennes)",
        "descKO": "벨기에와 프랑스 국경 지대에 위치한 거칠고 험준한 산림 영지입니다. 혹독한 겨울과 척박한 지리적 요건을 지녔으나, 성 위베르의 전설과 기독교/요정의 신비가 안개 속에 서려 있습니다. 기사들은 수렵에 극도로 능하며 완고하고 독립적입니다."
      },
      {
        "nameKO": "브라반트 공국 (Duchy of Brabant)",
        "descKO": "모래 벌판과 평화로운 구릉지대입니다. 충직하고 손님이 찾아오는 것을 환영하는 기사들이 영지를 개간하고 있으며, 덴마크인 오지에 경이 대공으로 군림하기도 하는 번영의 요충지입니다."
      },
      {
        "nameKO": "샹파뉴 공국 (Duchy of Champagne)",
        "descKO": "인구가 희박하고 고독한 황야 지대입니다. 역사 깊은 클레르몽 가문의 에그르몽 성과 성 투르팽 대주교의 랭스 대교구가 이곳에 속해 있으며, 기사들은 다소 내성적이지만 매우 명예롭습니다."
      },
      {
        "nameKO": "쾰른 대주교령 (Prince-Bishopric of Cologne)",
        "descKO": "라인강 동부의 신앙 깊고 근면한 전사들의 고장입니다. 견고한 대리석 성곽으로 둘러싸인 대도시 쾰른과 성물이 가득한 성소들이 강줄기를 따라 밀집해 있습니다."
      },
      {
        "nameKO": "플랑드르-아르투아 공국 (Duchy of Flanders-Artois)",
        "descKO": "북해 무역과 모직물 산업의 거점입니다. 켄토빅 국제항구와 유서 깊은 코르비 수도원 필사실이 자리해 있으며, 기사들은 현실적이고 근면합니다."
      }
    ],
    "towns": [
      {
        "nameKO": "아헨 제국 궁정 (Palace of Aachen)",
        "nameEN": "The Palace of Aachen",
        "descKO": "793년 샤를마뉴 대제가 천연 온천천 온수(Aquae Granni) 옆에 건설한 황실 복합 대도시입니다. 황금 돔의 궁정 예배당(Palatine Chapel)과 대리석 왕좌, 황실 대강당(Aula Regia), 국고의 탑, 그리고 온천 요양원이 완비된 제국의 영광스러운 수도입니다."
      },
      {
        "nameKO": "바스토뉴 (Bastogne)",
        "nameEN": "Bastogne",
        "descKO": "아르덴 삼림 중앙 교차로에 흙벽과 10대 방어 돌탑으로 요새화된 유서 깊은 성곽 도시로, 대제 지휘하의 롬바르드 상인들이 무역 거점을 장악하고 있습니다."
      },
      {
        "nameKO": "쾰른 (Cologne)",
        "nameEN": "Cologne",
        "descKO": "라인강 서안에 위치한 강력한 직사각형 성벽 도시로, 12개의 돌문탑과 강철 다리, 대수도원을 소유한 전통적인 대주교 통치령입니다."
      },
      {
        "nameKO": "부용 성채 (Bouillon Castle)",
        "nameEN": "Bouillon Castle",
        "descKO": "서무아강의 굽이치는 절벽 위에 세워진 클레르몽 가문 백작의 견고한 석조 아성 성채로, 가도의 수운 강가 통행세를 통제합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "생 드니 대수도원 (Abbey of Saint Denis)",
        "nameEN": "Abbey of Saint Denis",
        "descKO": "역대 프랑크 국왕들이 안치되는 황실 성묘 성당으로, 대제국의 수호 성인인 생 드니의 유골과 성 마르틴의 성스러운 망토가 보존되어 있습니다."
      },
      {
        "nameKO": "생 리키에 수도원 (Abbey of Saint Riquier)",
        "nameEN": "Abbey of Saint Riquier",
        "descKO": "200여 권의 전설적인 도서관과 그리스도의 성수 망토 조각, 마르지 않는 기적의 빵 조각 등 전설적인 유물 성물이 봉헌되어 있는 학문의 고향입니다."
      },
      {
        "nameKO": "스타블로-말메디 수도원 (Stavelot-Malmédy)",
        "nameEN": "Stavelot-Malmédy",
        "descKO": "아르덴 숲 한가운데 위치한 두 개의 연합 베네딕토회 수도원으로, 치유술의 비법이 깃든 구료병원(Hospice)으로 전 유럽에 이름이 높습니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "누통의 돌거석 (Nutons' Rocks)",
        "nameEN": "Nutons' Rocks",
        "descKO": "아르덴 숲 깊은 곳에 솟아오른 거대한 이끼 낀 바위산 틈새로, 고대 난쟁이 요정 종족인 누통(Nutons)들의 지하 보물 창고와 거처로 연결되는 차원문이 깃들어 있습니다."
      },
      {
        "nameKO": "악마의 성채 유적 (Roc de la Tour)",
        "nameEN": "Roc de la Tour",
        "descKO": "가난한 기사가 딸을 위해 악마와 혼의 계약을 맺어 하룻밤 사이에 완성될 뻔했으나, 기도를 들은 닭이 새벽 일찍 울어 계약이 파기되자 악마가 분노하여 산산조각 내버린 악마의 붕괴 성채 유적입니다."
      }
    ]
  },
  {
    "key": "burgundy",
    "emoji": "🍷",
    "nameKO": "부르군트 (Burgundy)",
    "nameEN": "Burgundy",
    "rulerKO": "오베리 공작 (Duke Aubery) & 성 마리스 기치 성기사단",
    "rulerEN": "Duke Aubery & Paladins of the Golden Banner",
    "passionKO": "가족에 대한 사랑 (Love [Family]) 15점 또는 영예 (Honor) 15점",
    "passionEN": "Love (Family) 15 or Honor 15",
    "modifiers": [
      { "name": "연애예법 (Romance)", "value": "+2" },
      { "name": "향락주의 (Indulgent)", "value": "+1" },
      { "name": "기사도적 예의 (Courtesy)", "value": "+2" }
    ],
    "descKO": "부르군트는 제국 중남부의 굽이치는 포도밭 구릉과 알프스 산기슭에 펼쳐진 풍요로운 대영토입니다. 느베르, 디종, 리옹을 비롯한 30여 개의 백작령 연합체로 구성되어 있습니다. 로마 시대의 정취가 깊게 흐르며 좋은 와인과 정교한 요리를 즐기는 낙천적이고 품위 있는 기사들이 가문을 지키고 있으며, 성 마우리스의 황금 전투 깃발이 수호하는 신성한 수렁도 존재합니다.",
    "descEN": "A vast, hilly, and mountainous territory in south-central Frankland. Famous for its ancient Roman baths, rich vineyards, and elegant court life. Although politically split into 30 counties, it is united by high chivalry and the golden battle standard of Saint Maurice.",
    "subdivisions": [
      {
        "nameKO": "디종 백작령 (County of Dijon)",
        "descKO": "부르군트 백작령의 최고 행정 중심지이자 최고급 와인과 직물 무역이 발달한 풍요로운 평원지대입니다."
      },
      {
        "nameKO": "사부아 백작령 (County of Savoy)",
        "descKO": "알프스 협곡 관문인 제네바와 로잔을 포함하며, 웅장한 설산 경관과 가혹한 관세 검문소들이 강가를 차단하고 있습니다."
      }
    ],
    "towns": [
      {
        "nameKO": "디종 (Dijon)",
        "nameEN": "Dijon",
        "descKO": "부르군트 공작의 전통적인 치소 대리석 요새성으로, 로마식 온천 목욕탕과 찬란한 성 마우리스 대성당이 위용을 자랑합니다."
      },
      {
        "nameKO": "르 퓌 앙 벨레 (Le Puy-en-Velay)",
        "nameEN": "Le Puy-en-Velay",
        "descKO": "화산암 꼭대기에 기적의 치유 권능이 서려 있는 '열병의 돌(Fever Stone)'이 안치된 대성당으로, 전 프랑크 기독교인들이 평생 한 번 고질병 치유를 위해 찾아오는 성스러운 순례 대요충지입니다."
      },
      {
        "nameKO": "비엔 (Vienne)",
        "nameEN": "Vienne",
        "descKO": "론강 계곡에 위치한 백작령 치소 석조 성채로, 대제의 전설적인 성기사 올리버 경이 자신의 젊은 기사 시절에 통치하던 명예로운 고향 성채입니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "생 모리스 대수도원 (Abbey of Saint Maurice)",
        "nameEN": "Abbey of Saint Maurice",
        "descKO": "레만호 기슭 아구눔(Agaune)에 세워진 유서 깊은 성소로, 순교한 기독교 로마 군단장 성 마우리스의 기적을 부르는 보검과 성유물이 보존되어 있습니다."
      },
      {
        "nameKO": "륌쇠유 수도원 (Abbey of Luxeuil)",
        "nameEN": "Abbey of Luxeuil",
        "descKO": "성 콜룸바누스가 고대 치유 온천의 폐허 위에 건립한 수도원으로, 아일랜드 출신 석학 은둔수도사들이 기적의 치유 목욕 요법을 사수하고 있습니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "성 베르나르 악마의 관문 (Saint Bernard Passes)",
        "nameEN": "Saint Bernard Passes",
        "descKO": "알프스 설산을 뚫고 롬바르드 왕국으로 진격하는 기마 험로로, 이탈리아 기슭에 '롬바르디아의 협곡 성곽(Lombard Narrow)'이라는 악명 높은 괴수요새가 입구를 봉쇄하고 있습니다."
      }
    ]
  },
  {
    "key": "neustria",
    "emoji": "🛡️",
    "nameKO": "네우스트리아 (Neustria)",
    "nameEN": "Neustria",
    "rulerKO": "샤를마뉴 대제 & 노르망디의 니벨롱 2세 공작",
    "rulerEN": "King Charlemagne & Duke Nibelung II of Normandy",
    "passionKO": "영예 (Honor) 15점 또는 주군에 대한 충성 (Loyalty [Lord]) 15점",
    "passionEN": "Honor 15 or Loyalty (Lord) 15",
    "modifiers": [
      { "name": "정의 (Just)", "value": "+2" },
      { "name": "신중 (Prudent)", "value": "+2" },
      { "name": "궁정 웅변 (Eloquence)", "value": "+1" }
    ],
    "descKO": "네우스트리아는 프랑크 왕국의 기름진 평원과 센강 유역을 포괄하는 부유한 핵심 서부 대통치령입니다. 파리를 핵심으로 투르, 오를레앙, 루앙을 연결하며 기사도적 예법과 학문이 고도로 발달했습니다. 전설의 마크 백작 롤랑 경이 브르타뉴 변경령을 다스려 이교도 켈트족을 철저히 방어했으며, 노르망디의 엄격하고 독자적인 기사 가문들이 장원을 다스립니다.",
    "descEN": "The western heartland of the Frankish Empire, characterized by the fertile river plains of the Seine and Loire basins. It boasts major cultural cities like Paris, Rouen, and Tours, and serves as the strategic buffer zone against Celtic Brittany and northern sea threats.",
    "subdivisions": [
      {
        "nameKO": "앙주 공국 (Duchy of Anjou)",
        "descKO": "가장 자부심 강하고 엄격한 명가들이 밀집한 강가 요새 지대입니다. 투르 백작의 마르무티에 수도원과 앙제 성채가 길목을 방어하며 기사들은 신중하고 고결합니다."
      },
      {
        "nameKO": "베리 공국 (Duchy of Berry)",
        "descKO": "소박하고 전통적인 소도시 농경 지대로, 기사들은 화려함을 경계하고 오직 우직하고 정직한 게르만 전통 규범을 고수합니다."
      },
      {
        "nameKO": "브르타뉴 변경령 (Breton March)",
        "descKO": "켈트 브레통 이교도들과 맞닿은 최전선 군사 경계 요새지대입니다. 롤랑 경이 초대 변경백을 수임해 사나운 바닷바람과 기습을 온몸으로 사수했습니다."
      },
      {
        "nameKO": "노르망디 공국 (Duchy of Normandy)",
        "descKO": "센강 하구의 험난한 해안 삼림 지대입니다. 기사들은 과묵하고 고독하지만, 강력한 정의감과 타협 없는 가문 명예심을 지닌 용맹한 전사들입니다."
      }
    ],
    "towns": [
      {
        "nameKO": "파리 (Paris)",
        "nameEN": "Paris",
        "descKO": "제국 서부 최대 규모의 대도시로, 센강 시테섬을 중심으로 이중 대성벽과 파리 대학교가 건립되어 있어 전 세계 학자기사들의 사교 중심지 역할을 수행합니다."
      },
      {
        "nameKO": "투르 (Tours)",
        "nameEN": "Tours",
        "descKO": "성 마르틴의 성묘 대성당을 중심으로 세워진 강력한 백작 도시로, 1,000여 권의 마법 필사본을 보유한 유서 깊은 학문의 심장부 마르무티에 대수도원이 있습니다."
      },
      {
        "nameKO": "루앙 (Rouen)",
        "nameEN": "Rouen",
        "descKO": "로마 고대 성곽과 원형 목욕탕이 보존된 상업 항구도시로, 센강 하구 통행세를 걷는 거대 성채와 주교령이 위치합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "생 드니 대수도원 (Abbey of Saint Denis)",
        "nameEN": "Abbey of Saint Denis",
        "descKO": "네우스트리아 경계의 최고 왕실 수도원으로, 샤를마뉴의 선대 왕들의 황실 유골과 천상의 힐데베르트 백작부인 성가 등 초자연적 권능의 유물이 봉인되어 있습니다."
      },
      {
        "nameKO": "플뢰리 대수도원 (Abbey of Fleury)",
        "nameEN": "Abbey of Fleury",
        "descKO": "기독교 수도 규범의 원천인 성 베네딕토(Saint Benedict)의 성스러운 유해 골격을 안전하게 보존하고 수호하는 영적으로 독보적인 황실 수도원입니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "몽포콩 처형 언덕 (Montfaucon Hill)",
        "nameEN": "Montfaucon Hill",
        "descKO": "파리 외곽에 위치한 거대 기황 처형 나무 대형 교수대로, 가문을 배신한 역적이나 어둠의 마법을 숭배한 기사의 원혼들이 폭풍우 치는 밤마다 울부짖는 공포의 초자연적 금지 구역입니다."
      }
    ]
  },
  {
    "key": "alemannia",
    "emoji": "❄️",
    "nameKO": "알레마니아 (Alemannia)",
    "nameEN": "Alemannia",
    "rulerKO": "콘스탄츠의 제데온 주교 & 아르가우 백작 가문",
    "rulerEN": "Bishop Gedeon of Constance & Counts of Aargau",
    "passionKO": "신에 대한 사랑 (Love [God]) 15점 또는 명예 (Honor) 15점",
    "passionEN": "Love (God) 15 or Honor 15",
    "modifiers": [
      { "name": "가무/성가 (Singing)", "value": "+2" },
      { "name": "문해력 (Read/Write)", "value": "+1" },
      { "name": "경건성 (Pious)", "value": "+1" }
    ],
    "descKO": "알레마니아(슈바벤 공국)는 라인강 상류와 웅장한 보덴호(Lake Constance)를 중심으로 알프스 북쪽 기슭에 위치한 험준한 산악 대령입니다. 유서 깊은 라이헤나우 대수도원과 장크트 갈렌 학교에서 제국 고위 귀족 자제들이 유학하며 라틴 성가와 읽고 쓰는 최고급 학식을 전수받습니다. 기사들은 학구적이면서도 알프스를 지키는 방패 역할을 맡습니다.",
    "descEN": "Also known as the Duchy of Swabia, nestled around Lake Constance and the northern Alps. A mountainous, heavily forested territory famous for its monastic centers of learning, such as Reichenau and Saint Gall, which educate the empire's future elite.",
    "towns": [
      {
        "nameKO": "콘스탄츠 (Constance)",
        "nameEN": "Constance",
        "descKO": "보덴호 해항 기슭에 세워진 거대 교역 요충 도시로, 지혜로운 제데온 주교가 왕실 동전 발행소와 석조 주교관을 다스립니다."
      },
      {
        "nameKO": "바젤 (Basel)",
        "nameEN": "Basel",
        "descKO": "라인강이 굽어보이는 바위 언덕 위에 전설적인 기사 '흑인 이보 경'이 건립한 석조 감시 아성이 자리하며, 강물 무역선을 통제합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "라이헤나우 대수도원 (Abbey of Reichenau)",
        "nameEN": "Abbey of Reichenau",
        "descKO": "보덴호 섬 중앙에 위치한 신성하고 부유한 왕실 대수도원으로, 그리스도의 십자가 진짜 나무 파편 조각(True Cross)과 성 마가(St. Mark)의 성유물이 엄격하게 봉헌되어 성령의 구호 판정에 가산을 줍니다."
      },
      {
        "nameKO": "장크트 갈렌 대수도원 (Abbey of Saint Gall)",
        "nameEN": "Abbey of Saint Gall",
        "descKO": "성 콜룸바누스의 영적인 제자 갈루스(Gallus)가 건립한 유럽 최고 영예의 학문 및 신앙 기지로, 천상의 라틴 음악학교와 필사 필사실을 갖춘 지식의 총본산입니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "슈바르츠발트 (Black Forest)",
        "nameEN": "Black Forest",
        "descKO": "침엽수가 밤의 장막처럼 뒤덮인 거대 검은 삼림 지대로, 요정 야수들이 들끓고 고대 로마인들이 봉인한 어둠의 석조 제단들과 광맥이 잠들어 있는 위험천만한 대미궁 지역입니다."
      }
    ]
  },
  {
    "key": "aquitaine",
    "emoji": "🍇",
    "nameKO": "아키텐 (Aquitaine)",
    "nameEN": "Aquitaine",
    "rulerKO": "경건왕 루트비히 (King Louis the Pious)",
    "rulerEN": "King Louis the Pious",
    "passionKO": "가족에 대한 사랑 (Love [Family]) 15점 또는 연인에 대한 절대적 헌신 15점",
    "passionEN": "Love (Family) 15 or Amor (Lady) 15",
    "modifiers": [
      { "name": "연애예법 (Romance)", "value": "+2" },
      { "name": "기사도적 예의 (Courtesy)", "value": "+2" },
      { "name": "마술 (Horsemanship)", "value": "+1" }
    ],
    "descKO": "아키텐은 프랑크 제국 남서부의 온화하고 넓은 평원과 구릉 지대로, 찬란한 고대 로마의 찬란한 문화 예술이 그대로 살아 숨 쉬는 풍요로운 땅입니다. 음유시인의 달콤한 세레나데와 격조 높은 고결한 연애(Fin'amor) 문화가 처음 잉태된 예술적 기사도의 요람입니다. 샤를마뉴의 막내아들 루트비히가 아키텐의 소왕으로 즉위하였으며, 오베르뉴, 기옌, 리무쟁, 푸아투 등 4대 하위 공국들이 비옥한 포도밭을 일굽니다.",
    "descEN": "A grand southern sub-kingdom encompassing rolling plains, vine-clad hills, and preserved Roman architecture. As the historic cradle of troubadours and courtly love, it embodies the refined and artistic dimensions of the knightly code under King Louis the Pious.",
    "subdivisions": [
      {
        "nameKO": "오베르뉴 공국 (Duchy of Auvergne)",
        "descKO": "화산암 지대에 세워진 무뚝뚝하고 굳센 바위 성채들의 고장입니다. 기사들은 소박하지만 명예를 칼같이 준수하는 용맹한 수호자들입니다."
      },
      {
        "nameKO": "기옌 공국 (Duchy of Guyenne)",
        "descKO": "가로느강 유역의 부유하고 개성 넘치는 거대 공국입니다. 거대한 무역 항구도시 보르도가 바스크 이교도들의 기습을 철통같이 감시하고 방어합니다."
      },
      {
        "nameKO": "리무쟁 공국 (Duchy of Limousin)",
        "descKO": "마음이 평온하고 이성적인 평화의 은총이 깃든 시골 농경 지대입니다. 성 엘루아와 성 마르시알을 수호성인으로 섬깁니다."
      },
      {
        "nameKO": "푸아투 공국 (Duchy of Poitou)",
        "descKO": "수많은 지류와 광활한 습지대(Poitevin Marsh)가 그물처럼 얽힌 물의 영토입니다. 기사들은 인내심이 강하고 침착합니다."
      }
    ],
    "towns": [
      {
        "nameKO": "보르도 (Bordeaux)",
        "nameEN": "Bordeaux",
        "descKO": "가로느강 입구에 건설된 찬란한 성벽 교역 대도시로, 보르도 공작의 우아한 대리석 어전 법정과 바스크 해적들을 격퇴하는 해군 항구가 자리잡고 있습니다."
      },
      {
        "nameKO": "프롱삭 국경성채 (Royal Fortress of Fronsac)",
        "nameEN": "Royal Fortress of Fronsac",
        "descKO": "샤를마뉴 대제가 768년 아키텐 반역을 진압하고 완벽히 통제하기 위해 가로느강 기슭에 구축한 거대 황실 목조 요새성으로, 철통같은 황실 정규군이 주둔합니다."
      },
      {
        "nameKO": "포 요새 (Pau Castle)",
        "nameEN": "Pau Castle",
        "descKO": "피레네 산맥 관문 기슭에 토루(Motte-and-Bailey) 형식으로 지어진 군사 기지로, 스페인 전선과 론세스바예스 고개로 통하는 가도를 영구 수호합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "누아르무티에 수도원 (Abbey of Noirmoutier)",
        "nameEN": "Abbey of Noirmoutier",
        "descKO": "푸아투 해안가 외딴 섬에 축성된 요새화된 베네딕토회 성소로, 대서양 외래 이교도들의 거친 해적 행위와 습격 속에서도 꿋꿋이 기적을 행하는 신앙의 보루입니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "푸아투의 요정 습지대 (Poitevin Marsh)",
        "nameEN": "Poitevin Marsh",
        "descKO": "길을 잃기 쉬운 무수한 미로형 강줄기와 안개 늪으로 가득한 미지의 지대로, 사악한 산적들의 요격 기지이자 동시에 요정(Faerie)의 축복을 내리는 성스러운 물빛 샘터들이 조우하는 미스터리한 장소입니다."
      }
    ]
  },
  {
    "key": "bavaria",
    "emoji": "🏔️",
    "nameKO": "바이에른 (Bavaria)",
    "nameEN": "Bavaria",
    "rulerKO": "레겐스부르크의 타실로 3세 공작 & 아기롤핑 가문",
    "rulerEN": "Duke Tassilo III of Regensburg & The Agilolfings",
    "passionKO": "가문의 명예 수호 (Love [Family]) 15점 또는 프랑크인에 대한 증오 15점",
    "passionEN": "Love (Family) 15 or Hate (Franks) 15",
    "modifiers": [
      { "name": "기사도적 예의 (Courtesy)", "value": "+2" },
      { "name": "악기 연주 (Play Instruments)", "value": "+2" },
      { "name": "사교 사법 (Intrigue)", "value": "+1" }
    ],
    "descKO": "바이에른은 도나우강 상류와 웅장한 알프스 설산, 그리고 북부의 깊고 거대한 보헤미아 숲 사이에 놓인 유서 깊은 독립 공국입니다. 찬란한 고대 로마의 문명적 기반이 정교하게 이식되어 있어, 귀족들의 문화적 눈높이와 연회 댄싱, 웅변 예법이 롬바르드 왕국만큼 우아하고 세련되었습니다. 아기롤핑 가문의 타실로 3세가 영지를 독립적으로 통치하고자 황제와 아슬아슬한 냉전을 펼쳐왔으며, 철저한 기마 혈통의 전쟁군마 30필을 매년 바쳐야 하는 조약 의무가 서려 있습니다.",
    "descEN": "An ancient, highly cultivated alpine duchy along the upper Danube. Renowned for its Roman cultural roots, elegant courtly manners, and musical excellence. The ruling Agilolfings frequently strive for independence from Frankish rule, leading to deep political intrigue.",
    "towns": [
      {
        "nameKO": "레겐스부르크 (Regensburg)",
        "nameEN": "Regensburg",
        "descKO": "아름다운 대성당과 거대 목조 다리로 수놓인 바이에른의 우아한 수도 대도시로, 타실로 공작이 기용해 전 유럽에서 소집된 일류 음악가들과 귀부인들이 춤추는 궁정 연회장입니다."
      },
      {
        "nameKO": "린츠 변경초소 (Linz Guardpost)",
        "nameEN": "Linz",
        "descKO": "엠스강 기슭에 구축된 목조 국경 성채로, 야만적인 아바르(Avar)족의 기습적 국경 침공을 영구적으로 방어 및 요격하는 군사 초소입니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "몬트제 대수도원 (Abbey of Mondsee)",
        "nameEN": "Abbey of Mondsee",
        "descKO": "아기롤핑 가문의 보조금으로 은빛 몬트 호숫가 기슭에 축성된 신성한 베네딕토회 대수도원으로, 수도사들의 기도를 통해 숲속의 요정 저주를 정화합니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "보헤미아 원시림 (Bohemian Forest)",
        "nameEN": "Bohemian Forest",
        "descKO": "침엽수가 빙하기처럼 뒤덮인 혹한의 고산 툰드라 원시림으로, 인간의 손길이 일절 닿지 않아 태고의 추위와 굶주린 괴수 늑대 떼들이 눈밭 속에 우글거리는 침묵의 얼어붙은 삼림입니다."
      }
    ]
  },
  {
    "key": "gascony",
    "emoji": "🏹",
    "nameKO": "가스코뉴 (Gascony)",
    "nameEN": "Gascony",
    "rulerKO": "가스코뉴의 이온 공작 (Duke Yon of Gascony)",
    "rulerEN": "Duke Yon of Gascony",
    "passionKO": "가족에 대한 사랑 (Love [Family]) 15점 또는 명예 (Honor) 15점",
    "passionEN": "Love (Family) 15 or Honor 15",
    "modifiers": [
      { "name": "사교 사법 (Intrigue)", "value": "+2" },
      { "name": "마술 (Horsemanship)", "value": "+1" },
      { "name": "기사도적 예의 (Courtesy)", "value": "+2" }
    ],
    "descKO": "가스코뉴는 피레네산맥 서부 기슭과 푸른 대서양 연안 사이에 자리 잡은 거친 변경의 굳센 구릉 전사령입니다. 비기독교 바스크 전사들의 피가 섞여 있어 매우 기민하고 민첩하며 마술에 능합니다. 프랑크 황실과 사라센 칼리프조 사이에서 아슬아슬한 이중 외교를 전개하며, 자존심이 극도로 세고 반골 기질이 흘러넘치는 전설적인 성채 몬탈반의 주역 4형제(Renaud 등)의 혈투가 펼쳐지는 장소입니다.",
    "descEN": "A strategic and rugged duchy located between the Atlantic coast and the western Pyrenees. Known for its agile horsemen, complex diplomacy between Franks and Moors, and independent-minded knights like Sir Renaud and his brothers.",
    "towns": [
      {
        "nameKO": "몬탈반Marble 대성채 (White Castle of Montalban)",
        "nameEN": "White Castle of Montalban",
        "descKO": "에이몽 백작의 용맹한 네 아들(레노 등)이 깎아지른 절벽 산꼭대기에 대리석 백옥으로 축성한 철공 불락의 전설적인 대성채로, 공성 공격에 완전한 면역 특권을 품은 요새입니다."
      },
      {
        "nameKO": "바욘 (Bayonne)",
        "nameEN": "Bayonne",
        "descKO": "대서양 강귀 입구에 세워진 거대 성벽 해항 도시로, 기사 가문의 음모와 상인 연맹의 해운 교역이 번창하는 요충 항구입니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "아르장통 황실요새 (Fortress of Argenton)",
        "nameEN": "Fortress of Argenton",
        "descKO": "피핀 왕이 가로느강을 건너는 유일한 목조 대리교 목재 통로를 방어하기 위해 세운 거대 성곽 군사 감시 요새입니다."
      }
    ]
  },
  {
    "key": "provence",
    "emoji": "🌊",
    "nameKO": "프로방스 (Provence)",
    "nameEN": "Provence",
    "rulerKO": "가스코뉴의 룹 3세 공작 & 마르세유 가문 영주들",
    "rulerEN": "Duke Lupus III of Gascony & Lords of Marseilles",
    "passionKO": "가족에 대한 사랑 (Love [Family]) 15점 또는 영예 (Honor) 15점",
    "passionEN": "Love (Family) 15 or Honor 15",
    "modifiers": [
      { "name": "지중해 항해 (Stewardship)", "value": "+2" },
      { "name": "이국 언어 (Languages)", "value": "+2" },
      { "name": "사교 사법 (Intrigue)", "value": "+1" }
    ],
    "descKO": "프로방스는 지중해의 찬란한 태양과 거친 론강 하구 삼각주(Camargue)가 만나는 천혜의 남부 해안 영토입니다. 고대 로마의 거대 원형 극장, 수로교, 석조 아치들이 풍성하게 잔존해 있습니다. 지중해 황금 해운 교역을 통해 비잔틴 제국 및 아랍 상인들의 다채로운 이국적 문화와 접촉하며 가장 개방적이고 화려한 귀족 사회를 개척했으나, 동시에 사라센 참주들의 기습적인 해안 약탈 위협에 끊임없이 노출된 삼엄한 변경선이기도 합니다.",
    "descEN": "A sun-drenched coastal region with a rich Roman heritage and bustling maritime trade. Situated around the Rhone delta, it features ancient aqueducts, amphitheaters, and busy ports like Marseilles, while remaining highly vulnerable to Moorish raids.",
    "towns": [
      {
        "nameKO": "마르세유 (Marseille)",
        "nameEN": "Marseille",
        "descKO": "분홍빛 옹벽 성곽과 거대한 바다 등대, 그리고 '란송 요새(Castle of Lanson)'가 입구를 통제하는 지중해 최대의 황금 무역 해양 도시입니다."
      },
      {
        "nameKO": "아를 (Arles)",
        "nameEN": "Arles",
        "descKO": "론강 하류에 로마 대성벽과 찬란한 수도교, 그리고 거대한 바퀴 수력 밀 방아간들이 위용을 자랑하는 유서 깊은 주교 요새 도시입니다."
      },
      {
        "nameKO": "오랑주 대성채 (Orange Keep)",
        "nameEN": "Orange",
        "descKO": "순백의 마블 대리석으로 천연 암벽 꼭대기에 축성된 우아하고 정교한 백옥 아성으로, '글로리에트 타워(Gloriete Tower)'라 칭하며 론강 통행권을 사수합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "생 질 수도원 (Abbey of Saint Gilles)",
        "nameEN": "Abbey of Saint Gilles",
        "descKO": "은둔 수도사 성 질(Saint Giles)의 묘소 위에 건립된 대수도원으로, 기도를 통해 자녀 생산의 성령 은총(Infertility Cure)을 선사받는 기적으로 유명합니다."
      }
    ]
  },
  {
    "key": "septimania",
    "emoji": "🕌",
    "nameKO": "셉티마니아 / 고티아 (Septimania / Gothia)",
    "nameEN": "Septimania (Gothia)",
    "rulerKO": "성기사 창코 기욤 공작 (Duke William Shortnose)",
    "rulerEN": "Duke William Shortnose",
    "passionKO": "이교 사라센에 대한 증오 (Hate [Moors]) 15점 또는 용맹 (Valorous) 15점",
    "passionEN": "Hate (Moors) 15 or Valorous 15",
    "modifiers": [
      { "name": "용맹 (Valorous)", "value": "+2" },
      { "name": "이국 언어 (Languages)", "value": "+2" },
      { "name": "명예심 (Proud)", "value": "+1" }
    ],
    "descKO": "셉티마니아(고티아)는 피레네산맥 동쪽 기슭과 지중해 사이에 위치한 강인한 비시고트(Visigoth)계 기독교 문명지대입니다. 툴루즈, 나르본, 카르카손 등 요새 도시들이 우뚝 솟아 있으며, 론세스바예스의 참사 이후 대제의 전설적인 성기사 '창코 기욤 경(Sir William Shortnose)'이 이곳에 부임하여 사라센 침략 부대와 피 튀기는 정면 혈투를 치렀습니다. 기사들은 거침없고 극도로 용맹하며 이교와 마법에 대한 저항심이 뚜렷합니다.",
    "descEN": "A highly urbanized, Romanized Visigothic region covering the fertile plains between the Pyrenees and the Rhone. Under the legendary Sir William Shortnose, it stands as the absolute military fortress holding the line against Andalusian Moorish incursions.",
    "towns": [
      {
        "nameKO": "카르카손 성채도시 (Formidable Carcassonne)",
        "nameEN": "Carcassonne",
        "descKO": "24개의 목조 망루 돌탑과 이중 마블 대성곽으로 보강된 난공불락의 산악 성채도시로, 어떤 대군도 함락시킬 수 없는 요새의 진수입니다."
      },
      {
        "nameKO": "나르본 (Narbonne)",
        "nameEN": "Narbonne",
        "descKO": "올비유강 하구 입구에 자리잡은 성벽 해교 항구로, 중세 최대의 유대인 학자 길드와 아이메리 백작의 대리석 아성이 우뚝 서 있습니다."
      },
      {
        "nameKO": "툴루즈 (Toulouse)",
        "nameEN": "Toulouse",
        "descKO": "가로느강에 수놓인 유서 깊은 로마 성곽 주교 도시로, 셉티마니아 공작의 지휘 본부이자 고대 수호 성인의 바실리카 성당이 있습니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "아니안 대수도원 (Abbey of Aniane)",
        "nameEN": "Abbey of Aniane",
        "descKO": "777년 기독교 수도 규칙 개혁가인 성 베네딕토(Benedict of Aniane)가 셉티마니아 계곡에 건립하여 황실의 특별 비호를 받는 대영성 수도원입니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "아르샹 암벽 절벽 (The Archant)",
        "nameEN": "The Archant",
        "descKO": "기괴한 형상의 천연 절벽과 바다 동굴들이 어우러진 해안가로, 사라센 흑해적 갤리선들이 어둠의 상륙을 비밀리에 시도하는 위험한 신비 지대입니다."
      }
    ]
  },
  {
    "key": "thuringia",
    "emoji": "🌲",
    "nameKO": "튀링겐 (Thuringia)",
    "nameEN": "Thuringia",
    "rulerKO": "개종자 위두킨트 대공 & 에르푸르트 기사단",
    "rulerEN": "Duke Widukind the Convert & Erfurt Knights",
    "passionKO": "이교 작센인에 대한 증오 (Hate [Saxons]) 15점 또는 신에 대한 사랑 15점",
    "passionEN": "Hate (Saxons) 15 or Love (God) 15",
    "modifiers": [
      { "name": "용맹 (Valorous)", "value": "+2" },
      { "name": "야만 전설 (Folk Lore)", "value": "+1" },
      { "name": "복수심 (Vengeful)", "value": "+1" }
    ],
    "descKO": "튀링겐은 마인강, 베저강, 자알레강 사이에 위치한 울창한 산악 삼림 지대로, 호전적인 야만 작센족과 이교도 슬라브(Slav)족의 대규모 약탈 침략을 방어하는 삼엄한 동부 국경 완충 변경지대입니다. 척박한 지리와 거친 기후 속에서 선교 기사단과 위두킨트 개종대공의 군대가 주둔하고 있으며, 기사들은 혹독한 전투 환경으로 인해 극도로 강인하고 복수심에 가득 찬 굳센 기질을 소유하고 있습니다.",
    "descEN": "A heavily forested frontier march situated between the Main and Saele rivers. Acting as a vital military buffer zone guarding Austrasia from pagan Saxon and Slavic raids, its knights are hardened by relentless, brutal skirmishes.",
    "towns": [
      {
        "nameKO": "에르푸르트 산악보루 (Erfurt Hill Fort)",
        "nameEN": "Erfurt",
        "descKO": "튀링겐 대공이 주둔하는 거대 흙둑 성채 요새로, 이교 침략을 차단하는 군사 관문이자 동방 슬라브 모피 상인들의 무역 통제소입니다."
      },
      {
        "nameKO": "그레일몽 성 (Grailmont Castle)",
        "nameEN": "Grailmont Castle",
        "descKO": "제국의 유력한 마옌스(Mayence) 가문이 국경림 꼭대기에 우뚝 세운 강력한 석조 아성으로, 침략자들의 지휘부를 저격 격퇴합니다."
      }
    ],
    "abbeys": [
      {
        "nameKO": "헤르스펠트 수도원 (Abbey of Hersfeld)",
        "nameEN": "Abbey of Hersfeld",
        "descKO": "성 스투름(Sturm)이 작센 복음화를 위한 전초 기지로 깊은 동부 숲속에 건립한 베네딕토회 전사선교사 수도원입니다."
      },
      {
        "nameKO": "오르드루프 선교원 (Abbey of Ohrdruf)",
        "nameEN": "Abbey of Ohrdruf",
        "descKO": "대순교자 성 보니파스(St. Boniface)가 붉은 삼나무 가시 울타리 너머에 세운 목조 선교 성소로, 작센 기습에도 꿋꿋이 정교한 기도를 올립니다."
      }
    ],
    "enchanted": [
      {
        "nameKO": "몽글란 성채 유적 (Ruins of Monglane)",
        "nameEN": "Ruins of Monglane",
        "descKO": "대기사 장크트 가린(Garin of Monglane)의 명예가 서린 유서 깊은 성곽이었으나, 수십 년 전 이교 작센족의 방화 기습으로 뼈대만 남아 숯처럼 타버린 비장한 숲속의 고대 유적 잔해입니다."
      }
    ]
  }
];

export const minorNpcs = [
  {
    "key": "alard",
    "nameKO": "알라르",
    "nameEN": "Alard",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "알라르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 백작 Aymon’s second 아들. Though he is not as strong and valiant as his elder 형제, the hot-headed Alard remains a fearsome and destructive opponent.",
    "biographyEN": "Count Aymon’s second son. Though he is not as strong and valiant as his elder brother, the hot-headed Alard remains a fearsome and destructive opponent."
  },
  {
    "key": "aymer_the_puny",
    "nameKO": "왜소한 에메르",
    "nameEN": "Aymer the Puny",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "왜소한 에메르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. William Shortnose’s younger 형제 gets captured at 론세스바예스 협곡, but after a few years he manages to escape. He vows to never again sleep under a roof, and to spend his whole life warring against the infidels (this gentle 기사 is slightly insane).",
    "biographyEN": "William Shortnose’s younger brother gets captured at Roncevaux, but after a few years he manages to escape. He vows to never again sleep under a roof, and to spend his whole life warring against the infidels (this gentle knight is slightly insane)."
  },
  {
    "key": "fulco_of_candie",
    "nameKO": "캉디의 풀코",
    "nameEN": "Fulco of Candie",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "캉디의 풀코 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 조카 of Vivien the Fearless is a fighter worthy of his 숙부’s fame, as well as being a courteous womanizer. He becomes the last 공작 of Spain by the peace terms of 810.",
    "biographyEN": "The nephew of Vivien the Fearless is a fighter worthy of his uncle’s fame, as well as being a courteous womanizer. He becomes the last Duke of Spain by the peace terms of 810."
  },
  {
    "key": "garin_of_anjou",
    "nameKO": "안주의 가린",
    "nameEN": "Garin of Anjou",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "안주의 가린 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. William Shortnose’s younger 형제 is the 부친 of Vivien. He gets captured after 론세스바예스 협곡 and is ================= liberated in exchange for his 아들. He 사망합니다 at the hands of the 작센인 in the 전투 of the Süntel Mountains in 782.",
    "biographyEN": "William Shortnose’s younger brother is the father of Vivien. He gets captured after Roncevaux and is ================= liberated in exchange for his son. He dies at the hands of the Saxons in the Battle of the Süntel Mountains in 782."
  },
  {
    "key": "garnier_of_nanteuil",
    "nameKO": "낭퇴유의 가르니에",
    "nameEN": "Garnier of Nanteuil",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "낭퇴유의 가르니에 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Raised at the royal 궁정, he ~의 곁에서 용감히 분투하였으며, Anseïs of Carthago. He later rescues his lover, Aye of Avignon, when she is imprisoned at Majorca. During the siege of his home castle, Garnier is 전사한 by Ganelon’s 형제, Milo.",
    "biographyEN": "Raised at the royal court, he fights at the side of Anseïs of Carthago. He later rescues his lover, Aye of Avignon, when she is imprisoned at Majorca. During the siege of his home castle, Garnier is slain by Ganelon’s brother, Milo."
  },
  {
    "key": "gerard_of_vienne",
    "nameKO": "비엔의 제라르",
    "nameEN": "Gerard of Vienne",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "비엔의 제라르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. When Oliver’s proud and independent 숙부 is insulted by 국왕 Carloman’s 아내, 왕비 Gerberga, he declares a 가문 간의 피의 복수극(Feud) and refuses to acknowledge himself as either Carloman’s or 샤를마뉴 대제’s vassal. “Whatever’s mine, my wealth, my land, my weal Not one shelled egg thereof I’ll ever yield To any man — Lord God alone I heed! Your 국왕 샤를마뉴 대제 I’ll never love nor fear; Let him come here and kneel down at my feet!” — The Song of Aspremont , I Peace is concluded after an aborted duel between his 조카 Oliver and Roland. On his horse Killvillian, the white-haired 백작 Gerard then joins 샤를마뉴 대제 for the First Spanish 원정 and 사망합니다 heroically at 론세스바예스 협곡.",
    "biographyEN": "When Oliver’s proud and independent uncle is insulted by King Carloman’s wife, Queen Gerberga, he declares a feud and refuses to acknowledge himself as either Carloman’s or Charlemagne’s vassal. “Whatever’s mine, my wealth, my land, my weal Not one shelled egg thereof I’ll ever yield To any man — Lord God alone I heed! Your King Charlemagne I’ll never love nor fear; Let him come here and kneel down at my feet!” — The Song of Aspremont , I Peace is concluded after an aborted duel between his nephew Oliver and Roland. On his horse Killvillian, the white-haired Count Gerard then joins Charlemagne for the First Spanish Campaign and dies heroically at Roncevaux."
  },
  {
    "key": "guichard_the_wild",
    "nameKO": "야생마 기샤르",
    "nameEN": "Guichard the Wild",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "야생마 기샤르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 백작 Aymon’s fourth 아들 is Bradamant’s twin 형제. His rash and reckless behavior earns him his surname.",
    "biographyEN": "Count Aymon’s fourth son is Bradamant’s twin brother. His rash and reckless behavior earns him his surname."
  },
  {
    "key": "guy_of_nanteuil",
    "nameKO": "낭퇴유의 기 경",
    "nameEN": "Guy of Nanteuil",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "낭퇴유의 기 경 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 그의 복수를 위해 부친’s death, Guy allies with the chivalrous W ali of Majorca and kills the vile Milo of Mayence in 전투, rekindling the 가문 간의 피의 복수극(Feud) between the houses of Nanteuil and Mayence.",
    "biographyEN": "T o avenge his father’s death, Guy allies with the chivalrous W ali of Majorca and kills the vile Milo of Mayence in battle, rekindling the feud between the houses of Nanteuil and Mayence."
  },
  {
    "key": "lion_of_bourges",
    "nameKO": "부르주의 리옹",
    "nameEN": "Lion of Bourges",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "부르주의 리옹 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The courteous 아들 of the destitute 백작 Herpin of Bourges lives an adventurous life, trying to find his parents, regain his ancestral fief, and punish traitors (who are often from the Mayence clan). The courageous and god-fearing Lion is sometimes assisted in his laudable projects by a holy White 기사.",
    "biographyEN": "The courteous son of the destitute Count Herpin of Bourges lives an adventurous life, trying to find his parents, regain his ancestral fief, and punish traitors (who are often from the Mayence clan). The courageous and god-fearing Lion is sometimes assisted in his laudable projects by a holy White Knight."
  },
  {
    "key": "milo_of_aiglent",
    "nameKO": "에글랑의 밀로 공작",
    "nameEN": "Milo of Aiglent",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "에글랑의 밀로 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 부친 of Roland is the strong, handsome, optimistic, valorous, and slightly naive 공작 of Septimania. He is the bastard 아들 of the false 왕비 Aliste and Bernard of Clermont. He is the royal seneschal until he falls in love with Bertha and they are exiled. After their marriage and reinstatement at 궁정, he is made 공작 of Septimania.",
    "biographyEN": "The father of Roland is the strong, handsome, optimistic, valorous, and slightly naive Duke of Septimania. He is the bastard son of the false Queen Aliste and Bernard of Clermont. He is the royal seneschal until he falls in love with Bertha and they are exiled. After their marriage and reinstatement at court, he is made Duke of Septimania."
  },
  {
    "key": "oliver_and_william_of_bourges",
    "nameKO": "부르주의 올리버와 기욤",
    "nameEN": "Oliver and William of Bourges",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "부르주의 올리버와 기욤 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. These twin brothers are the 아들들 of Lion of Bourges and Florentine of Sicily. After many adventures, they manage to recover their ancestral fief by sounding the town’s magical horn.",
    "biographyEN": "These twin brothers are the sons of Lion of Bourges and Florentine of Sicily. After many adventures, they manage to recover their ancestral fief by sounding the town’s magical horn."
  },
  {
    "key": "richard",
    "nameKO": "리샤르",
    "nameEN": "Richard",
    "category": "Imperial Family & Court",
    "subcategory": "⚔️ 반란 귀족 및 기타 기사 (Revolting Barons & Knights)",
    "years": "",
    "biographyKO": "리샤르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 백작 Aymon’s third 아들 is a doughty warrior. Unlike his brothers, the introverted Richard thinks before acting, and occasionally even plans things ahead. Even if Maugis remains the House of Aigremont’s uncontested master-brain, Richard sometimes saves his brothers from catastrophe by using a clever subterfuge. Minor Characters",
    "biographyEN": "Count Aymon’s third son is a doughty warrior. Unlike his brothers, the introverted Richard thinks before acting, and occasionally even plans things ahead. Even if Maugis remains the House of Aigremont’s uncontested master-brain, Richard sometimes saves his brothers from catastrophe by using a clever subterfuge. Minor Characters"
  },
  {
    "key": "pepin_the_short",
    "nameKO": "단신왕 피핀 (714–768)",
    "nameEN": "Pepin the Short (714–768)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 부모 (Parents)",
    "years": "714–768",
    "biographyKO": "단신왕 피핀 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s 부친 is the illustrious 아들 of the great 망치왕 샤를 마르텔 and Rothrude. He was anointed in 751, and crowned 국왕 of the Franks in 754. As a young 황자 he received his education at the 수도원 of St. Denis. Pepin is a clever man with a soothing voice, whose motto is: “Never take on more than one enemy at a time.”",
    "biographyEN": "Charlemagne’s father is the illustrious son of the great Charles Martel and Rothrude. He was anointed in 751, and crowned King of the Franks in 754. As a young prince he received his education at the abbey of St. Denis. Pepin is a clever man with a soothing voice, whose motto is: “Never take on more than one enemy at a time.”"
  },
  {
    "key": "bertrada_broadfoot",
    "nameKO": "평발왕비 베르트라다 (726–783)",
    "nameEN": "Bertrada Broadfoot (726–783)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 부모 (Parents)",
    "years": "726–783",
    "biographyKO": "피핀 3세의 총명한 평발 왕비이자 샤를마뉴의 자애로운 모친입니다. 아스트리아스 왕가의 딸로 태어나 제국 궁정의 외교 및 자녀들의 교양 교육에 지대한 영향력을 발휘하였습니다. 극도로 경건하고 지조 높은 정조를 가졌으며, 궁정의 대소사는 모두 그녀의 뜻을 거쳤습니다.",
    "biographyEN": "Pepin the Short’s wife is the daughter of King Floris and Queen Blancheflour of Asturias. She plays an important role at the royal court until her death. As a mother, she favors Charlemagne over his brother Carloman. She spends much energy in finding suitably elegant and cultivated wives and husbands for her “barbarian” sons and daughters. Bertrada is a pious, chaste, generous and modest woman, who thinks everything that goes on at court is her business."
  },
  {
    "key": "adelaid",
    "nameKO": "아델라이드 (738–756)",
    "nameEN": "Adelaid (738–756)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 형제 (Siblings)",
    "years": "738–756",
    "biographyKO": "아델라이드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 아내 of Aymon of Dordon and the 모친 of Renaud, his brothers, and 자매 Bradamant. Adelaid is a modest and generous 모친, a pious woman and a faithful 아내, who never loses her calm at the side of her irascible, and often, violent 남편.",
    "biographyEN": "Wife of Aymon of Dordon and the mother of Renaud, his brothers, and sister Bradamant. Adelaid is a modest and generous mother, a pious woman and a faithful wife, who never loses her calm at the side of her irascible, and often, violent husband."
  },
  {
    "key": "rothaid",
    "nameKO": "로테이드 (744–789)",
    "nameEN": "Rothaid (744–789)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 형제 (Siblings)",
    "years": "744–789",
    "biographyKO": "로테이드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A meek but handsome 공주, who 혼인합니다 백작 Anthony of Avignon, to whom she gives a fierce 딸, Aye of Avignon.",
    "biographyEN": "A meek but handsome princess, who marries Count Anthony of Avignon, to whom she gives a fierce daughter, Aye of Avignon."
  },
  {
    "key": "carloman_i",
    "nameKO": "카를로만 1세 (750–771)",
    "nameEN": "Carloman I (750–771)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 형제 (Siblings)",
    "years": "750–771",
    "biographyKO": "카를로만 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s younger and more intellectual 형제 was raised by Abbot Fulrad at the 수도원 of St. Denis, and is therefore in vogue among scholars. His military education was at the hands of 공작 Thierry of Ardennes, who 기사들 his royal squire in 767. A year later, 황자 Carloman inherits a large part of his 부친’s kingdom. He 혼인합니다 his beloved Gerberga of 롬바르디아 in 769, who bears him two 아들들: Pepin and Lothair. He is 사망한 by a furious Ogier In 771, but officially he 사망합니다 in a “hunting accident.” 샤를마뉴 대제 strongly dislikes his peevish younger 형제, who is always complaining about everything. As a 국왕, Carloman is surrounded by flattering courtiers who spend their time scheming and plotting.",
    "biographyEN": "Charlemagne’s younger and more intellectual brother was raised by Abbot Fulrad at the abbey of St. Denis, and is therefore in vogue among scholars. His military education was at the hands of Duke Thierry of Ardennes, who knights his royal squire in 767. A year later, Prince Carloman inherits a large part of his father’s kingdom. He marries his beloved Gerberga of Lombardy in 769, who bears him two sons: Pepin and Lothair. He is killed by a furious Ogier In 771, but officially he dies in a “hunting accident.” Charlemagne strongly dislikes his peevish younger brother, who is always complaining about everything. As a king, Carloman is surrounded by flattering courtiers who spend their time scheming and plotting."
  },
  {
    "key": "gertrude",
    "nameKO": "게르트루드 (751–771)",
    "nameEN": "Gertrude (751–771)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 형제 (Siblings)",
    "years": "751–771",
    "biographyKO": "게르트루드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A strong-willed woman who 혼인합니다 a Neustrian 백작. She 사망합니다 giving birth to a 딸, Avissa, the 모친 of Aiol.",
    "biographyEN": "A strong-willed woman who marries a Neustrian count. She dies giving birth to a daughter, Avissa, the mother of Aiol."
  },
  {
    "key": "gisela",
    "nameKO": "기셀라 (757–810)",
    "nameEN": "Gisela (757–810)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 형제 (Siblings)",
    "years": "757–810",
    "biographyKO": "기셀라 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This grave and distant girl is promised to the Lombard 황자 Adalgise at an early age, but later becomes a nun and abbess of Chelles, where she is nicknamed “ Alcuin’s 자매.” =================",
    "biographyEN": "This grave and distant girl is promised to the Lombard prince Adalgise at an early age, but later becomes a nun and abbess of Chelles, where she is nicknamed “ Alcuin’s sister.” ================="
  },
  {
    "key": "himiltrude",
    "nameKO": "히밀트루드 (764–770)",
    "nameEN": "Himiltrude (764–770)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황후 (Wives)",
    "years": "764–770",
    "biographyKO": "히밀트루드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This young Frankish 후궁 of modest origins is not officially 혼인했습니다 to 샤를마뉴 대제, even though she gives him two 아들들, Pepin and Louis, of which the first is, unfortunately, hunchbacked. She is repudiated and sent to a nunnery in 770.",
    "biographyEN": "This young Frankish concubine of modest origins is not officially married to Charlemagne, even though she gives him two sons, Pepin and Louis, of which the first is, unfortunately, hunchbacked. She is repudiated and sent to a nunnery in 770."
  },
  {
    "key": "desideria",
    "nameKO": "데시데리아 (770–771)",
    "nameEN": "Desideria (770–771)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황후 (Wives)",
    "years": "770–771",
    "biographyKO": "피핀 3세의 총명한 평발 왕비이자 샤를마뉴의 자애로운 모친입니다. 아스트리아스 왕가의 딸로 태어나 제국 궁정의 외교 및 자녀들의 교양 교육에 지대한 영향력을 발휘하였습니다. 극도로 경건하고 지조 높은 정조를 가졌으며, 궁정의 대소사는 모두 그녀의 뜻을 거쳤습니다.",
    "biographyEN": "The third daughter of King Desiderius is a lovely and refined Lombard princess. Charlemagne sees her for the first time when Bertrada brings her back from Lombardy. He is smitten and agrees to marry her, but repudiates her for political reasons only a year later. During her short reign as queen the beautiful girl exasperates the courtiers with her pride, her endless chatting (in Latin only), and her immoderate taste for luxury. She travels accompanied by poets, singers and other artists. Her numerous servants carry her glass goblets, silver cutlery, and plates everywhere. Her dresses must be silk, and she abhors Charlemagne’s peasant-like lifestyle."
  },
  {
    "key": "hildegard",
    "nameKO": "힐데가르트 (771–783)",
    "nameEN": "Hildegard (771–783)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황후 (Wives)",
    "years": "771–783",
    "biographyKO": "샤를마뉴 대제가 데시데리아 황후를 폐위한 후 맞이한 13세의 어린 알레마니아 출신 황후입니다. 제국 후손인 피핀, 샤를로 황자와 다섯 공주를 출산하였으며, 궁정에서 기사도적 예법과 고결한 도덕성의 기틀을 마련한 가장 온화하고 자비로운 어머니의 현신입니다.",
    "biographyEN": "This Alemannian princess is only 13 years old when Charlemagne marries her in 771, after he repudiates Desideria. She is the daughter of Gerold I of Vinzgau and a cousin to T assilo III. This virtuous young woman gives birth to two princes: Pepin and Charlot, and five princesses: Rothrud, Bertha, Gisela, Hiltrude and Adaltrude. Hildegard is a model of virtue, though slightly jealous and vengeful towards the children her husband had with other women. Fastrada (784–794).  The daughter of Count Radulf of Thuringia is said to be elf-born, and is much disliked at court. Her extreme beauty barely conceals her ice cold, selfish, vengeful, and cruel nature. She bears Charlemagne two daughters: Theodrade and Hiltrude."
  },
  {
    "key": "liutgard",
    "nameKO": "리우트가르트 (795–800)",
    "nameEN": "Liutgard (795–800)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황후 (Wives)",
    "years": "795–800",
    "biographyKO": "리우트가르트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A gentle Alemannian 공주, whom 샤를마뉴 대제 is already courting before Fastrada’s death.",
    "biographyEN": "A gentle Alemannian princess, whom Charlemagne is already courting before Fastrada’s death."
  },
  {
    "key": "gerswinda",
    "nameKO": "게르스윈다",
    "nameEN": "Gerswinda",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 후궁 (Concubines)",
    "years": "",
    "biographyKO": "게르스윈다 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 모친 of Adaltrude.",
    "biographyEN": "Mother of Adaltrude."
  },
  {
    "key": "madelgard",
    "nameKO": "마델가르트",
    "nameEN": "Madelgard",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 후궁 (Concubines)",
    "years": "",
    "biographyKO": "마델가르트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 모친 of a Ruothild.",
    "biographyEN": "Mother of a Ruothild."
  },
  {
    "key": "regina",
    "nameKO": "레기나",
    "nameEN": "Regina",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 후궁 (Concubines)",
    "years": "",
    "biographyKO": "레기나 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 모친 of Drogo and Hugo.",
    "biographyEN": "Mother of Drogo and Hugo."
  },
  {
    "key": "adallinda",
    "nameKO": "아달린다",
    "nameEN": "Adallinda",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 후궁 (Concubines)",
    "years": "",
    "biographyKO": "아달린다 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 모친 of Ricbod and Thierry.",
    "biographyEN": "Mother of Ricbod and Thierry."
  },
  {
    "key": "pepin_the_hunchback",
    "nameKO": "꼽추 피핀 (765–811)",
    "nameEN": "Pepin the Hunchback (765–811)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황자 (Sons)",
    "years": "765–811",
    "biographyKO": "꼽추 피핀 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The deformed 아들 of 샤를마뉴 대제’s 후궁 Himiltrude is reduced to the status of kitchen knave. The modest 황자 is honest and generous, but naive. Although very handsome, he remains unmarried all his life because of his malformation. After Hardrad’s failed coup in 785, Pepin is sent to the 수도원 of Prüm, where he 사망합니다 under mysterious circumstances.",
    "biographyEN": "The deformed son of Charlemagne’s concubine Himiltrude is reduced to the status of kitchen knave. The modest prince is honest and generous, but naive. Although very handsome, he remains unmarried all his life because of his malformation. After Hardrad’s failed coup in 785, Pepin is sent to the monastery of Prüm, where he dies under mysterious circumstances."
  },
  {
    "key": "louis_the_pious",
    "nameKO": "경건왕 루이 (766)",
    "nameEN": "Louis the Pious (766)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황자 (Sons)",
    "years": "766",
    "biographyKO": "경건왕 루이 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s least favorite 아들 is somewhat effeminate. His main qualities are intellectual, not military. The timid and very pious 황자 lacks confidence, and he especially dislikes his tutor, William Shortnose, who is his complete opposite. Louis is crowned 국왕 of 아키텐 in 그는 oulouse in 781, where he was raised. He 혼인합니다 William’s 자매, Blancheflour, and later Ermengard, the 딸 of 백작 Ingram of Hesbaye. As 샤를마뉴 대제’s only surviving 아들, Louis is crowned co-황제 in 813. At the end of his life, Ermold the Black describes Louis as “ the world’s Caesar, the glory of the Franks, the crown of 기독교인들, first in peace and faith, yet second to none in war, distinguished in learning and the works of piety. ”",
    "biographyEN": "Charlemagne’s least favorite son is somewhat effeminate. His main qualities are intellectual, not military. The timid and very pious prince lacks confidence, and he especially dislikes his tutor, William Shortnose, who is his complete opposite. Louis is crowned King of Aquitaine in T oulouse in 781, where he was raised. He marries William’s sister, Blancheflour, and later Ermengard, the daughter of Count Ingram of Hesbaye. As Charlemagne’s only surviving son, Louis is crowned co-emperor in 813. At the end of his life, Ermold the Black describes Louis as “ the world’s Caesar, the glory of the Franks, the crown of Christians, first in peace and faith, yet second to none in war, distinguished in learning and the works of piety. ”"
  },
  {
    "key": "charlot",
    "nameKO": "샤를로 황자 (772–811)",
    "nameEN": "Charlot (772–811)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황자 (Sons)",
    "years": "772–811",
    "biographyKO": "샤를로 황자 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Also known as “Charles the Y ounger, ” the 국왕’s favorite 아들 is raised at the 궁정 of 공작 Thierry of Ardennes. Despite his achievements as a valorous army leader, 황자 Charlot suffers from a lack of recognition from the 성기사단, who suspect his vain, suspicious, deceitful, selfish character. In 789, 황자 Charlot becomes 공작 of the Breton March, and from 793 onwards he acts as his 부친’s supreme representative at 궁정. At the end of his life, the embittered Charlot lets himself be deluded by the Black 기사들. Carloman/Pepin (774–810): Born Carloman, but re-세례를 받은 in 780, 황자 Pepin is crowned 국왕 of Italy as a child a year later, under 샤를마뉴 대제’s 사촌 Adalhard’s tutelage. 국왕 Pepin becomes an astute 전투 commander, but lacks political and courtly skills. Bastard 아들들 Drogo (801–855), Hugo (802–844), Ricbod (805–844) and Thierry (807–?).",
    "biographyEN": "Also known as “Charles the Y ounger, ” the king’s favorite son is raised at the court of Duke Thierry of Ardennes. Despite his achievements as a valorous army leader, Prince Charlot suffers from a lack of recognition from the paladins, who suspect his vain, suspicious, deceitful, selfish character. In 789, Prince Charlot becomes Duke of the Breton March, and from 793 onwards he acts as his father’s supreme representative at court. At the end of his life, the embittered Charlot lets himself be deluded by the Black Knights. Carloman/Pepin (774–810): Born Carloman, but re-baptized in 780, Prince Pepin is crowned King of Italy as a child a year later, under Charlemagne’s cousin Adalhard’s tutelage. King Pepin becomes an astute battle commander, but lacks political and courtly skills. Bastard sons Drogo (801–855), Hugo (802–844), Ricbod (805–844) and Thierry (807–?)."
  },
  {
    "key": "rothrud",
    "nameKO": "로트루드 공주 (773–810)",
    "nameEN": "Rothrud (773–810)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황녀 (Daughters)",
    "years": "773–810",
    "biographyKO": "로트루드 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. She is first promised to the Greek 황제 (781), but finally stays at 궁정 and bears her lover, 백작 Rorgo of Le Mans, a 아들 named Louis.",
    "biographyEN": "She is first promised to the Greek Emperor (781), but finally stays at court and bears her lover, Count Rorgo of Le Mans, a son named Louis."
  },
  {
    "key": "bertha",
    "nameKO": "베르타 공주 (779–826)",
    "nameEN": "Bertha (779–826)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 황녀 (Daughters)",
    "years": "779–826",
    "biographyKO": "베르타 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This frivolous and proud 공주 혼인합니다 Angilbert (a diplomat and the Lay Abbot of Saint Riquier from 790 to his death in 814), with whom she has a 아들, Nithard. Gisela (781–808),Theodrada (785–844), Hiltrude (786), Adaltrude (787), Rhuothild (790): All other 딸들 born after Bertha are raised at 궁정 and generally end their lives as the honorific abbess of a royal nunnery.",
    "biographyEN": "This frivolous and proud princess marries Angilbert (a diplomat and the Lay Abbot of Saint Riquier from 790 to his death in 814), with whom she has a son, Nithard. Gisela (781–808),Theodrada (785–844), Hiltrude (786), Adaltrude (787), Rhuothild (790): All other daughters born after Bertha are raised at court and generally end their lives as the honorific abbess of a royal nunnery."
  },
  {
    "key": "adalhard",
    "nameKO": "아달하르트 (751–827)",
    "nameEN": "Adalhard (751–827)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "751–827",
    "biographyKO": "아달하르트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s favorite 사촌 에서 양육되었으며, 궁정 as the 아들 of 숙부 Bernard. At Carloman’s death, he goes to 롬바르디아 with Ogier, but returns to favor later and becomes the Lay Abbot of Corbie (800). He is the tutor of 샤를마뉴 대제’s 아들, 국왕 Pepin of Italy.",
    "biographyEN": "Charlemagne’s favorite cousin was raised at court as the son of uncle Bernard. At Carloman’s death, he goes to Lombardy with Ogier, but returns to favor later and becomes the Lay Abbot of Corbie (800). He is the tutor of Charlemagne’s son, King Pepin of Italy."
  },
  {
    "key": "angilbert",
    "nameKO": "안길베르트 (751–814)",
    "nameEN": "Angilbert (751–814)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "751–814",
    "biographyKO": "안길베르트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s 아들-in-law 에서 양육되었으며, royal 궁정. At first, he is young 국왕 Pepin of Italy’s palace 백작, but later he returns to 궁정 as a poet and diplomat. There he enjoys a very worldly lifestyle, and becomes the lover of young 공주 Bertha. At the end of his life, Angilbert retires to the 수도원 of St. Riquier, where he 사망합니다 as a saint.",
    "biographyEN": "Charlemagne’s son-in-law was raised at royal court. At first, he is young King Pepin of Italy’s palace count, but later he returns to court as a poet and diplomat. There he enjoys a very worldly lifestyle, and becomes the lover of young Princess Bertha. At the end of his life, Angilbert retires to the monastery of St. Riquier, where he dies as a saint."
  },
  {
    "key": "bertha",
    "nameKO": "베르타 공주 (735–)",
    "nameEN": "Bertha (735–)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "735–",
    "biographyKO": "베르타 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A year before giving birth to Roland in 750, 샤를마뉴 대제’s 사촌 was banished from 궁정 with her lover, 백작 Milo of Aiglent. After a period of exile, she finally 혼인했습니다 Milo and raised their 아들, Roland. Her 남편 was made Minor Characters ================= 공작 of Septimania. After Milo’s death in 771, Bertha 혼인합니다 백작 Ganelon, to whom she gives a 아들, named Baldwin. At her second 남편’s shameful death, she retires to a nunnery.",
    "biographyEN": "A year before giving birth to Roland in 750, Charlemagne’s cousin was banished from court with her lover, Count Milo of Aiglent. After a period of exile, she finally married Milo and raised their son, Roland. Her husband was made Minor Characters ================= Duke of Septimania. After Milo’s death in 771, Bertha marries Count Ganelon, to whom she gives a son, named Baldwin. At her second husband’s shameful death, she retires to a nunnery."
  },
  {
    "key": "bernard",
    "nameKO": "베르나르 (736–787)",
    "nameEN": "Bernard (736–787)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "736–787",
    "biographyKO": "베르나르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s 숙부 is a bastard 아들 of 단신왕 피핀. He is 혼인했습니다 to a 작센인 귀족 woman. The discrete and humble Bernard acts as one of 샤를마뉴 대제’s army commanders in the Lombard wars. He is the 부친 of 샤를마뉴 대제’s favorite cousins, Adalhard and W ala.",
    "biographyEN": "Charlemagne’s uncle is a bastard son of Pepin the Short. He is married to a Saxon noble woman. The discrete and humble Bernard acts as one of Charlemagne’s army commanders in the Lombard wars. He is the father of Charlemagne’s favorite cousins, Adalhard and W ala."
  },
  {
    "key": "childebrand_ii",
    "nameKO": "킬데브란트 2세 (779–826)",
    "nameEN": "Childebrand II (779–826)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "779–826",
    "biographyKO": "킬데브란트 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s diligent and shrewd 사촌, 아들 of 백작 Nibelung I, is a palatine 백작 and a missus dominicus. Childebrand is a very discreet and perspicacious nobleman.",
    "biographyEN": "Charlemagne’s diligent and shrewd cousin, son of Count Nibelung I, is a palatine count and a missus dominicus. Childebrand is a very discreet and perspicacious nobleman."
  },
  {
    "key": "gontrada",
    "nameKO": "곤트라다",
    "nameEN": "Gontrada",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "",
    "biographyKO": "곤트라다 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Adalhard and W ala’s 자매 is 샤를마뉴 대제’s chaste 사촌 and a good friend.",
    "biographyEN": "Adalhard and W ala’s sister is Charlemagne’s chaste cousin and a good friend."
  },
  {
    "key": "lothair",
    "nameKO": "로타르 (744–768)",
    "nameEN": "Lothair (744–768)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "744–768",
    "biographyKO": "로타르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This unfortunate 사촌 is 사망한 by Bevis of Aigremont, which sparks the 가문 간의 피의 복수극(Feud) between 샤를마뉴 대제 and Aymon’s 아들들.",
    "biographyEN": "This unfortunate cousin is killed by Bevis of Aigremont, which sparks the feud between Charlemagne and Aymon’s sons."
  },
  {
    "key": "nibelung_i",
    "nameKO": "니벨룽 1세 (725–771)",
    "nameEN": "Nibelung I (725–771)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "725–771",
    "biographyKO": "니벨룽 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 샤를마뉴 대제’s distant 숙부 is the 아들 of Childebrand I, who was 망치왕 샤를 마르텔’s half-형제. He is the stern and just 백작 of Paris, as well as 샤를마뉴 대제’s palace 백작.",
    "biographyEN": "Charlemagne’s distant uncle is the son of Childebrand I, who was Charles Martel’s half-brother. He is the stern and just Count of Paris, as well as Charlemagne’s palace count."
  },
  {
    "key": "w_ala",
    "nameKO": "W ala (755–836)",
    "nameEN": "W ala (755–836)",
    "category": "Imperial Family & Court",
    "subcategory": "👑 황실 친족 (Other Relatives)",
    "years": "755–836",
    "biographyKO": "W ala 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Adalhard’s younger 형제 is 숙부 Bernard’s second 아들. 그는n influential royal councilor, and one of 샤를마뉴 대제’s personal friends. He 혼인합니다 Lady Rollinda, William Shortnose’s only 딸, and later retires to Corbie, where he succeeds his 형제 as abbot.",
    "biographyEN": "Adalhard’s younger brother is uncle Bernard’s second son. He is an influential royal councilor, and one of Charlemagne’s personal friends. He marries Lady Rollinda, William Shortnose’s only daughter, and later retires to Corbie, where he succeeds his brother as abbot."
  },
  {
    "key": "ganelon_of_ponthieu",
    "nameKO": "퐁티외의 가늘롱 백작 (736–778)",
    "nameEN": "Ganelon of Ponthieu (736–778)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 대신 (Courtiers)",
    "years": "736–778",
    "biographyKO": "퐁티외의 가늘롱 백작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The valorous 백작 of Mayence inherited his ancestor Doon’s blazon: “St. George (as a 기사) decapitating a 이교도.” Ganelon is 샤를마뉴 대제’s childhood friend, and 혼인합니다 공주 Bertha after 공작 Milo d’ Aiglent’s death in 771. Ganelon starts to hate his 아들-in-law, Roland, when Roland makes peace with Oliver at the duel of Vienne, a fief 샤를마뉴 대제 would have given to Ganelon had Roland won. When, years later, Roland laughingly advises 샤를마뉴 대제 to send Ganelon on a virtually suicidal mission to Emir Masile’s 궁정, the 백작 of Mayence decides to avenge himself. His 반역 results in the 전투 of 론세스바예스 협곡, and his vengeful, arbitrary, proud and deceitful character is finally revealed. In 전투, Ganelon wields the blessed 성검 Murgleis.",
    "biographyEN": "The valorous Count of Mayence inherited his ancestor Doon’s blazon: “St. George (as a knight) decapitating a pagan.” Ganelon is Charlemagne’s childhood friend, and marries Princess Bertha after Duke Milo d’ Aiglent’s death in 771. Ganelon starts to hate his son-in-law, Roland, when Roland makes peace with Oliver at the duel of Vienne, a fief Charlemagne would have given to Ganelon had Roland won. When, years later, Roland laughingly advises Charlemagne to send Ganelon on a virtually suicidal mission to Emir Masile’s court, the Count of Mayence decides to avenge himself. His treason results in the Battle of Roncevaux, and his vengeful, arbitrary, proud and deceitful character is finally revealed. In battle, Ganelon wields the blessed sword Murgleis."
  },
  {
    "key": "naymo_of_bavaria",
    "nameKO": "바이에른의 네모 공작 (732–815)",
    "nameEN": "Naymo of Bavaria (732–815)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 대신 (Courtiers)",
    "years": "732–815",
    "biographyKO": "바이에른의 네모 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Another of 샤를마뉴 대제’s childhood friends, and the 국왕’s most trusted advisor. The modest and wise palatine 공작 is the 부친 of Aquilon (raised as Anibal by the 사라센), Bertrand (사망한 by Ogier in 773), and Wistace (Garin of Anjou’s 아내 and Vivien the Fearless’ 모친). The wise Naymo is unswervingly loyal, just, moderate, forgiving, merciful and prudent. He acts in all respects as if he were 샤를마뉴 대제’s elder 형제, and is at the 황제’s side until the end. Many learned abbots and bishops live at 궁정 permanently, or for several months a year, to assist 샤를마뉴 대제 in the administration of his kingdom. The Palace Academy is founded in 780 by Alcuin. All its members have a skill of at least 16 in Eloquence, Intrigue, Languages, Reading & W riting, and Religion. They all have classical nicknames; 샤를마뉴 대제 himself, for example, is known as David.",
    "biographyEN": "Another of Charlemagne’s childhood friends, and the king’s most trusted advisor. The modest and wise palatine duke is the father of Aquilon (raised as Anibal by the Saracens), Bertrand (killed by Ogier in 773), and Wistace (Garin of Anjou’s wife and Vivien the Fearless’ mother). The wise Naymo is unswervingly loyal, just, moderate, forgiving, merciful and prudent. He acts in all respects as if he were Charlemagne’s elder brother, and is at the emperor’s side until the end. Many learned abbots and bishops live at court permanently, or for several months a year, to assist Charlemagne in the administration of his kingdom. The Palace Academy is founded in 780 by Alcuin. All its members have a skill of at least 16 in Eloquence, Intrigue, Languages, Reading & W riting, and Religion. They all have classical nicknames; Charlemagne himself, for example, is known as David."
  },
  {
    "key": "alcuin",
    "nameKO": "알쿠인 (735–804)",
    "nameEN": "Alcuin (735–804)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "735–804",
    "biographyKO": "알쿠인 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The tall British monk is a calm and honest man with great diplomatic and persuasive skills. 그는 magister at Y ork until he becomes 샤를마뉴 대제’s personal councilor and tutor in 780. The wise and most learned Northumbrian founds the royal Palace Academy, where he is nicknamed Flaccus. He goes back to Y ork in 790, but a few years later he returns to Frankland. In 796 he retires from 궁정 as the Abbot of St. Martin’s (and several other satellite abbeys and monasteries), where he 사망합니다 in 804.",
    "biographyEN": "The tall British monk is a calm and honest man with great diplomatic and persuasive skills. He is a magister at Y ork until he becomes Charlemagne’s personal councilor and tutor in 780. The wise and most learned Northumbrian founds the royal Palace Academy, where he is nicknamed Flaccus. He goes back to Y ork in 790, but a few years later he returns to Frankland. In 796 he retires from court as the Abbot of St. Martin’s (and several other satellite abbeys and monasteries), where he dies in 804."
  },
  {
    "key": "arno_of_salzburg",
    "nameKO": "잘츠부르크의 아르노 (750–821)",
    "nameEN": "Arno of Salzburg (750–821)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "750–821",
    "biographyKO": "잘츠부르크의 아르노 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This Bavarian bishop enters the Palace Academy as Aquila, a year after 그는 assilo’s banishment to the 수도원 of Jumieges. 국왕 샤를마뉴 대제 appoints him as Archbishop of Germania (798), Abbot of St. Amand, and later Archbishop of the Avar March (805). He is frequently sent out as missus dominicus.",
    "biographyEN": "This Bavarian bishop enters the Palace Academy as Aquila, a year after T assilo’s banishment to the Monastery of Jumieges. King Charlemagne appoints him as Archbishop of Germania (798), Abbot of St. Amand, and later Archbishop of the Avar March (805). He is frequently sent out as missus dominicus."
  },
  {
    "key": "benedict_of_aniane",
    "nameKO": "아니안의 베네딕토 (747–821)",
    "nameEN": "Benedict of Aniane (747–821)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "747–821",
    "biographyKO": "아니안의 베네딕토 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 아들 of the Visigothic 백작 Aigulf of Gellone grows up at the royal 궁정, where he becomes the personal friend of Alcuin and Theodulf. He lives in a Burgundian 수도원 for a while, but in 781 he becomes 국왕 Louis’ spiritual mentor. He writes a new Benedictine Rule for the numerous monasteries he founds in Septimania and 아키텐, such as Aniane (782) and Gellone (804, for his boyhood friend, William Shortnose). By the time Louis is crowned 황제, the dynamic Benedict has become a living saint: “Thanks to his help, the holy fortresses [monasteries] are now pleasing to God. A beautiful will reigned in his sacred conduct; he was as holy as it is allowed man to be. ” Ermoldus , II",
    "biographyEN": "The son of the Visigothic Count Aigulf of Gellone grows up at the royal court, where he becomes the personal friend of Alcuin and Theodulf. He lives in a Burgundian monastery for a while, but in 781 he becomes King Louis’ spiritual mentor. He writes a new Benedictine Rule for the numerous monasteries he founds in Septimania and Aquitaine, such as Aniane (782) and Gellone (804, for his boyhood friend, William Shortnose). By the time Louis is crowned Emperor, the dynamic Benedict has become a living saint: “Thanks to his help, the holy fortresses [monasteries] are now pleasing to God. A beautiful will reigned in his sacred conduct; he was as holy as it is allowed man to be. ” Ermoldus , II"
  },
  {
    "key": "clement",
    "nameKO": "클레멘트 (750–818)",
    "nameEN": "Clement (750–818)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "750–818",
    "biographyKO": "클레멘트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. An eloquent and patient Irish monk who arrives at 샤를마뉴 대제’s 궁정 in 775 and rapidly becomes the magister of the University of Paris. As Alcuin’s right hand at 궁정, he is in charge of the education of the royal children.",
    "biographyEN": "An eloquent and patient Irish monk who arrives at Charlemagne’s court in 775 and rapidly becomes the magister of the University of Paris. As Alcuin’s right hand at court, he is in charge of the education of the royal children."
  },
  {
    "key": "dagulf",
    "nameKO": "다굴프 (743–809)",
    "nameEN": "Dagulf (743–809)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "743–809",
    "biographyKO": "다굴프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. During summer, the conscientious library master travels through the realm to visit the royal scriptoria. In winter, he supervises the monks at 궁정.",
    "biographyEN": "During summer, the conscientious library master travels through the realm to visit the royal scriptoria. In winter, he supervises the monks at court."
  },
  {
    "key": "dungal",
    "nameKO": "둥갈 (749–828)",
    "nameEN": "Dungal (749–828)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "749–828",
    "biographyKO": "둥갈 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This Irish monk is 샤를마뉴 대제’s 궁정 점성술사. He teaches the liberal arts at the Palace Academy.",
    "biographyEN": "This Irish monk is Charlemagne’s court astrologer. He teaches the liberal arts at the Palace Academy."
  },
  {
    "key": "einhard",
    "nameKO": "아인하르트 (770–840)",
    "nameEN": "Einhard (770–840)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "770–840",
    "biographyKO": "풀다 수도원 출신의 지극히 총명한 왜소증 수도사이자 학자입니다. 샤를마뉴 대제의 전속 비서이자 공식 대전기 작가로 임명되어 성기사들의 연대기를 기록하였습니다. 조각, 보석 세공, 금속 세공의 명장이며, 대제의 공주와 은밀한 로맨스를 나눈 궁정의 기재입니다.",
    "biographyEN": "A very talented and versatile dwarfsized monk from Fulda. He is a scholar, and skilled in metal working, wood-carving, and gem cutting. He becomes Charlemagne’s biographer, and continues the paladins’ chronicles where T urpin left them. At court, he woos one of Charlemagne’s daughters. His academic nickname is Nardulus. Einhard undertakes several ================= diplomatic missions in the emperor’s name to the Saxons and the Romans. He is King Louis’ arch-chaplain, and possesses a personal chapel with relics outside the Royal Palace."
  },
  {
    "key": "fredegise",
    "nameKO": "프레데지스 (791–834)",
    "nameEN": "Fredegise (791–834)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "791–834",
    "biographyKO": "프레데지스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A British disciple of Alcuin, nicknamed Nathanaël, who succeeds his master as the Abbot of 그는 ours after Alcuin’s death in 804. His specialization is theology.",
    "biographyEN": "A British disciple of Alcuin, nicknamed Nathanaël, who succeeds his master as the Abbot of T ours after Alcuin’s death in 804. His specialization is theology."
  },
  {
    "key": "fulrad",
    "nameKO": "Fulrad (710–784)",
    "nameEN": "Fulrad (710–784)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "710–784",
    "biographyKO": "Fulrad 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Abbot of St. Denis, who owns many rich domains all over Frankland, is the tutor and friend of 국왕 Carloman. After Carloman’s death, this holy monk becomes 샤를마뉴 대제’s arch-chaplain and ambassador. At his death he is declared a saint.",
    "biographyEN": "The Abbot of St. Denis, who owns many rich domains all over Frankland, is the tutor and friend of King Carloman. After Carloman’s death, this holy monk becomes Charlemagne’s arch-chaplain and ambassador. At his death he is declared a saint."
  },
  {
    "key": "george_the_byzantine",
    "nameKO": "비잔틴의 조지 (755–817)",
    "nameEN": "George the Byzantine (755–817)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "755–817",
    "biographyKO": "비잔틴의 조지 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A very erudite Greek, he speaks Latin, Arabic and Hebrew. 그는 bishop in 롬바르디아, but leaves Pope Stephen III’s service to become the Bishop of Amiens. 샤를마뉴 대제 regularly charges George with embassies to 로마 and Byzantium.",
    "biographyEN": "A very erudite Greek, he speaks Latin, Arabic and Hebrew. He is a bishop in Lombardy, but leaves Pope Stephen III’s service to become the Bishop of Amiens. Charlemagne regularly charges George with embassies to Rome and Byzantium."
  },
  {
    "key": "hildebald_of_cologne",
    "nameKO": "쾰른의 힐데발트 (761–818)",
    "nameEN": "Hildebald of Cologne (761–818)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "761–818",
    "biographyKO": "쾰른의 힐데발트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A personal friend of 샤를마뉴 대제, nicknamed Aaron at the Academy, this wise and energetic scholar is a wandering missionary bishop. At 궁정, he fulfils the offices of arch-chaplain and chancellor.",
    "biographyEN": "A personal friend of Charlemagne, nicknamed Aaron at the Academy, this wise and energetic scholar is a wandering missionary bishop. At court, he fulfils the offices of arch-chaplain and chancellor."
  },
  {
    "key": "ludger",
    "nameKO": "루트거 (742–809)",
    "nameEN": "Ludger (742–809)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "742–809",
    "biographyKO": "루트거 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A 귀족 Frisian monk who teaches at the Utrecht cathedral school. 그는 peaceful and patient missionary among the Frisians. In 793, he miraculously cures and converts the blind Frisian skald Bernlef. Later, Ludger is the chief missionary in Saxony (793), and he becomes Abbot and Bishop of Münster (805), where he 사망합니다 as a saint.",
    "biographyEN": "A noble Frisian monk who teaches at the Utrecht cathedral school. He is a peaceful and patient missionary among the Frisians. In 793, he miraculously cures and converts the blind Frisian skald Bernlef. Later, Ludger is the chief missionary in Saxony (793), and he becomes Abbot and Bishop of Münster (805), where he dies as a saint."
  },
  {
    "key": "modoin",
    "nameKO": "모도인 (770–840)",
    "nameEN": "Modoin (770–840)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "770–840",
    "biographyKO": "모도인 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A Visigothic monk raised at 궁정, where he is known as Ovid. Modoin is a 궁정 poet and a member of 국왕 Louis’ household.",
    "biographyEN": "A Visigothic monk raised at court, where he is known as Ovid. Modoin is a court poet and a member of King Louis’ household."
  },
  {
    "key": "paul_the_deacon",
    "nameKO": "부제 바오로 (720–802)",
    "nameEN": "Paul the Deacon (720–802)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "720–802",
    "biographyKO": "부제 바오로 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The venerable Lombard Bishop of Aquileia is a renowned grammarian. He arrives at 궁정 in 774, where he is nicknamed Timothee, and he becomes Angilbert’s tutor. In 787 샤를마뉴 대제 appoints him as the new Archbishop of V enice, and he accompanies 국왕 Pepin during the Avar 원정.",
    "biographyEN": "The venerable Lombard Bishop of Aquileia is a renowned grammarian. He arrives at court in 774, where he is nicknamed Timothee, and he becomes Angilbert’s tutor. In 787 Charlemagne appoints him as the new Archbishop of V enice, and he accompanies King Pepin during the Avar campaign."
  },
  {
    "key": "peter_of_pisa",
    "nameKO": "피사의 피에트로 (744–799)",
    "nameEN": "Peter of Pisa (744–799)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "744–799",
    "biographyKO": "피사의 피에트로 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A humorless Lombard from Pavia who teaches Latin at the Palace Academy. He is the tutor of 샤를마뉴 대제’s children. In 790 he retires from 궁정 to become a lay abbot.",
    "biographyEN": "A humorless Lombard from Pavia who teaches Latin at the Palace Academy. He is the tutor of Charlemagne’s children. In 790 he retires from court to become a lay abbot."
  },
  {
    "key": "raban_maur",
    "nameKO": "라바누스 마우루스 (780–856)",
    "nameEN": "Raban Maur (780–856)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "780–856",
    "biographyKO": "라바누스 마우루스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A quiet and diligent monk from Fulda, and a pupil of Alcuin at 그는 ours, he comes to 궁정 to write teaching manuals.",
    "biographyEN": "A quiet and diligent monk from Fulda, and a pupil of Alcuin at T ours, he comes to court to write teaching manuals."
  },
  {
    "key": "theodulf",
    "nameKO": "테오둘프 주교 (759–821)",
    "nameEN": "Theodulf (759–821)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "759–821",
    "biographyKO": "테오둘프 주교 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Visigothic Bishop of Orleans (798) and Abbot of Fleury studied under Benedict of Aniane. Theodulf is at 궁정 from 780 to 797, where he is named Pindor. He acts as a missus dominicus together with Bishop Leidrad of Lyon.",
    "biographyEN": "The Visigothic Bishop of Orleans (798) and Abbot of Fleury studied under Benedict of Aniane. Theodulf is at court from 780 to 797, where he is named Pindor. He acts as a missus dominicus together with Bishop Leidrad of Lyon."
  },
  {
    "key": "willihad",
    "nameKO": "빌리하드 (741–789)",
    "nameEN": "Willihad (741–789)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "741–789",
    "biographyKO": "빌리하드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A pure monk from Y ork, where he became Alcuin’s friend. 그는 ~로 유배당해 Frisia and Saxony as a missionary in 765, but flees in despair after a 작센인 massacre in 782. He briefly retreats to the 수도원 of Echternach, and later becomes the Bishop of W orms.",
    "biographyEN": "A pure monk from Y ork, where he became Alcuin’s friend. He is sent to Frisia and Saxony as a missionary in 765, but flees in despair after a Saxon massacre in 782. He briefly retreats to the abbey of Echternach, and later becomes the Bishop of W orms."
  },
  {
    "key": "wido",
    "nameKO": "위도 (761–802)",
    "nameEN": "Wido (761–802)",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "761–802",
    "biographyKO": "위도 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Alcuin’s most talented pupil and companion is the personal tutor of 공주 Gisela. Wido succeeds his master as head of the Palace Academy, where he is nicknamed Candidus. Officers Most important administrative offices are held by educated members of the clergy. Laymen are largely excluded from these functions. The major offices are given here:",
    "biographyEN": "Alcuin’s most talented pupil and companion is the personal tutor of Princess Gisela. Wido succeeds his master as head of the Palace Academy, where he is nicknamed Candidus. Officers Most important administrative offices are held by educated members of the clergy. Laymen are largely excluded from these functions. The major offices are given here:"
  },
  {
    "key": "chamberlain",
    "nameKO": "궁정 시종장 (Chamberlain)",
    "nameEN": "Chamberlain",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "궁정 시종장 (Chamberlain) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The chamberlain takes care of the personal belongings of the royal household, including the treasury, called the “chamber, ” which is a veritable warehouse filled with coffers of jewels, gold and silver, crowns, silks, illuminated manuscripts and other luxurious goods. Adalgise (768–782); Meginfred (783–791), Eberhard (792–812); Jeremy (813–814).",
    "biographyEN": "The chamberlain takes care of the personal belongings of the royal household, including the treasury, called the “chamber, ” which is a veritable warehouse filled with coffers of jewels, gold and silver, crowns, silks, illuminated manuscripts and other luxurious goods. Adalgise (768–782); Meginfred (783–791), Eberhard (792–812); Jeremy (813–814)."
  },
  {
    "key": "chancellor",
    "nameKO": "제국 대법관 (Chancellor)",
    "nameEN": "Chancellor",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "제국 대법관 (Chancellor) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. He oversees the royal charters and archives, assists on the appointment of bishops and abbots, and is the 국왕’s principal councilor on religious matters in general. Fulrad, Abbot of Saint Denis (771–784); Bishop Angilram of Metz (784–791); Archbishop Hildebald of Cologne (791–814).",
    "biographyEN": "He oversees the royal charters and archives, assists on the appointment of bishops and abbots, and is the king’s principal councilor on religious matters in general. Fulrad, Abbot of Saint Denis (771–784); Bishop Angilram of Metz (784–791); Archbishop Hildebald of Cologne (791–814)."
  },
  {
    "key": "chaplain",
    "nameKO": "궁정 성직자 (Chaplain)",
    "nameEN": "Chaplain",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "궁정 성직자 (Chaplain) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The guardian of the cape (chapelle) of St. Martin, the most holy relic of the Frankish kings, and master of the 궁정 library. Itherius (767–775); Abbot Rado of Arras (776–797); Archibald (797–812); Archbishop Jeremy of Sens (812–814). Marshal/Constable: The master of the royal horses and stud farms. Geilo (768–772); Fago (773–786); Gimbold (787–799); Gerricus (799–804); Burchard (805–814).",
    "biographyEN": "The guardian of the cape (chapelle) of St. Martin, the most holy relic of the Frankish kings, and master of the court library. Itherius (767–775); Abbot Rado of Arras (776–797); Archibald (797–812); Archbishop Jeremy of Sens (812–814). Marshal/Constable: The master of the royal horses and stud farms. Geilo (768–772); Fago (773–786); Gimbold (787–799); Gerricus (799–804); Burchard (805–814)."
  },
  {
    "key": "master_of_the_kitchens",
    "nameKO": "궁정 주방 마스터 (Master of Kitchens)",
    "nameEN": "Master of the Kitchens",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "궁정 주방 마스터 (Master of Kitchens) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Often the subject of gentle raillery, the master cook is nevertheless an important figure at 궁정. Bego (768–778); Audulf (778–801); Hortmar (801–814).",
    "biographyEN": "Often the subject of gentle raillery, the master cook is nevertheless an important figure at court. Bego (768–778); Audulf (778–801); Hortmar (801–814)."
  },
  {
    "key": "magister",
    "nameKO": "아카데미 원장 (Magister)",
    "nameEN": "Magister",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "아카데미 원장 (Magister) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The head of the Palace Academy. Alcuin (780–796); Wido (796–814).",
    "biographyEN": "The head of the Palace Academy. Alcuin (780–796); Wido (796–814)."
  },
  {
    "key": "palace_count",
    "nameKO": "궁정 백작 (Palace Count)",
    "nameEN": "Palace Count",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "궁정 백작 (Palace Count) 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The principal royal advisor and president of the permanent special royal tribunal. He commands the scarae and is responsible for the 궁정’s security. 백작 Nibelung I (768–771); 백작 Anselm (771–778); 백작 Sturm (779–800); 백작 Childebrand II (800–814).",
    "biographyEN": "The principal royal advisor and president of the permanent special royal tribunal. He commands the scarae and is responsible for the court’s security. Count Nibelung I (768–771); Count Anselm (771–778); Count Sturm (779–800); Count Childebrand II (800–814)."
  },
  {
    "key": "seneschal",
    "nameKO": "궁정 궁내관 (Seneschal)",
    "nameEN": "Seneschal",
    "category": "Imperial Family & Court",
    "subcategory": "🏰 궁정 학자 (Academicians)",
    "years": "",
    "biographyKO": "풀다 수도원 출신의 지극히 총명한 왜소증 수도사이자 학자입니다. 샤를마뉴 대제의 전속 비서이자 공식 대전기 작가로 임명되어 성기사들의 연대기를 기록하였습니다. 조각, 보석 세공, 금속 세공의 명장이며, 대제의 공주와 은밀한 로맨스를 나눈 궁정의 기재입니다.",
    "biographyEN": "Also known as the steward, he manages the provisions of the court, an especially important and difficult task. Eggihard (768–778); Ludfrid (779–791); Audulf (791– 801); Einhard (802–808); Ansegise (809–814)."
  },
  {
    "key": "angelica",
    "nameKO": "안젤리카 공주",
    "nameEN": "Angelica",
    "category": "Imperial Family & Court",
    "subcategory": "🔮 신비한 마법사 (Magicians)",
    "years": "",
    "biographyKO": "안젤리카 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A stunning and chaste 공주 of Cathay, who wears a powerful 마법의 ring of invisibility and 마법의 negation. She may herself produce only minor enchantments, but her supernatural beauty (APP 30) often works as a Love spell on men. She is saved from a sea monster by Rogero (775) and wooed by Roland, but finally falls in love with a young Moor, Medoro, with whom she returns to Cathay.",
    "biographyEN": "A stunning and chaste princess of Cathay, who wears a powerful magic ring of invisibility and magic negation. She may herself produce only minor enchantments, but her supernatural beauty (APP 30) often works as a Love spell on men. She is saved from a sea monster by Rogero (775) and wooed by Roland, but finally falls in love with a young Moor, Medoro, with whom she returns to Cathay."
  },
  {
    "key": "atlantes",
    "nameKO": "아틀란테스",
    "nameEN": "Atlantes",
    "category": "Imperial Family & Court",
    "subcategory": "🔮 신비한 마법사 (Magicians)",
    "years": "",
    "biographyKO": "아틀란테스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The most powerful Saracen 점성술사 and 흑마법사 lives in a 마법의 mountain castle. He loves Rogero as his 아들, and tries to protect him from harm and adventure by locking him up inside his steel prison-palace. The deceitful and cunning Atlantes owns a powerful spell book of illusions, a 방패 of Blinding and a hippogriff. Carelessness is his weakness. The magician finally 사망합니다 of a broken heart when Rogero leaves, converts to Christianity, and 혼인합니다 Bradamant.",
    "biographyEN": "The most powerful Saracen astrologer and sorcerer lives in a magic mountain castle. He loves Rogero as his son, and tries to protect him from harm and adventure by locking him up inside his steel prison-palace. The deceitful and cunning Atlantes owns a powerful spell book of illusions, a Shield of Blinding and a hippogriff. Carelessness is his weakness. The magician finally dies of a broken heart when Rogero leaves, converts to Christianity, and marries Bradamant."
  },
  {
    "key": "basin",
    "nameKO": "Basin (Elegast)",
    "nameEN": "Basin (Elegast)",
    "category": "Imperial Family & Court",
    "subcategory": "🔮 신비한 마법사 (Magicians)",
    "years": "Elegast",
    "biographyKO": "Basin 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Frankish 백작 of Geneva is a skillful 마법사, who was born and raised at his fief of Huy. He mainly uses herbs to produce 마법의 effects such as opening locks, understanding animal speech, putting people to sleep, and healing wounds. Ever loyal to 샤를마뉴 대제, he nevertheless is accused of betrayal and destituted (781). Impoverished, he becomes the robber 기사 Elegast, wandering through the Austrasian forests. 샤를마뉴 대제 forgives Basin and reinstates him in 786. At the end of his life he becomes the Archbishop of 그는 rier (802). He has three 아들들: Berenger, Renier, and Aubery.",
    "biographyEN": "The Frankish Count of Geneva is a skillful enchanter, who was born and raised at his fief of Huy. He mainly uses herbs to produce magic effects such as opening locks, understanding animal speech, putting people to sleep, and healing wounds. Ever loyal to Charlemagne, he nevertheless is accused of betrayal and destituted (781). Impoverished, he becomes the robber knight Elegast, wandering through the Austrasian forests. Charlemagne forgives Basin and reinstates him in 786. At the end of his life he becomes the Archbishop of T rier (802). He has three sons: Berenger, Renier, and Aubery."
  },
  {
    "key": "maugis",
    "nameKO": "모지",
    "nameEN": "Maugis",
    "category": "Imperial Family & Court",
    "subcategory": "🔮 신비한 마법사 (Magicians)",
    "years": "",
    "biographyKO": "모지 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The most famous Frankish 마법기사-기사, from the family of Aigremont, was raised by a faerie lady and studied 마법의 at 그는 oledo. Renaud’s 사촌 possesses a very useful spell book which he sometimes consults. However, he only relies on his 마법의 when all other means have failed. He uses powders to make others sleep or sneeze, and to conjure up demons who he may send on an errand or foretell him the future: ================= Maugis took his tome. To understand this matter more, He called four demons up from hell. See how his mind was terrified! See how he shook, by heavenly God! He saw, as before his eyes, 샤를마뉴 대제 dead, his 궁정 destroyed. — Orlando Innamorato , 1.1.XXXVI Maugis becomes 샤를마뉴 대제’s most hated adversary in his 가문 간의 피의 복수극(Feud) with the house of Aigremont. On several occasions, the 마법사 plays tricks on his sovereign, though never with the intention to harm him.",
    "biographyEN": "The most famous Frankish wizard-knight, from the family of Aigremont, was raised by a faerie lady and studied magic at T oledo. Renaud’s cousin possesses a very useful spell book which he sometimes consults. However, he only relies on his magic when all other means have failed. He uses powders to make others sleep or sneeze, and to conjure up demons who he may send on an errand or foretell him the future: ================= Maugis took his tome. To understand this matter more, He called four demons up from hell. See how his mind was terrified! See how he shook, by heavenly God! He saw, as before his eyes, Charlemagne dead, his court destroyed. — Orlando Innamorato , 1.1.XXXVI Maugis becomes Charlemagne’s most hated adversary in his feud with the house of Aigremont. On several occasions, the enchanter plays tricks on his sovereign, though never with the intention to harm him."
  },
  {
    "key": "merlin",
    "nameKO": "메를린",
    "nameEN": "Merlin",
    "category": "Imperial Family & Court",
    "subcategory": "🔮 신비한 마법사 (Magicians)",
    "years": "",
    "biographyKO": "사악한 마옌스(Mayence) 가문의 마지막 백작이자 흑색 기사단(Black Knights)의 악명 높은 우두머리입니다. 교활하고 비열한 음모가로 대제의 총애를 받는 샤를로 황자를 흑색 세력으로 타락시켰으며, 위고 경 일행을 기습 암살하려다 도리어 파멸을 맞이한 가문 파멸의 원흉입니다.",
    "biographyEN": "The long-dead magician is sometimes present as a living spirit inside a cave or a tomb, from where he makes prophecies and gives his good counsel to any passing knights. No king is free of internal intrigue, and Charlemagne is no exception. The followers of Duke Hunold of Aquitaine, who is killed in 769, claim that at least one of the late duke’s children is still alive and can pretend to the lordship of Aquitaine. They do not foment open rebellion, but they use rather subversive ways of achieving their objectives. It is noteworthy that the Frankish king almost never visits the southern part of the Franklands. T o consolidate his power in the south, Charlemagne has his son Louis crowned King of Aquitaine in 781 with the help of William Shortnose. On this occasion, nobles such as Arneïs and the relatives of old Richard of Orleans cause quite a stir. Afterwards, the Aquitainian faction at court is seriously weakened, but their thirst for independence and their personal ambitions of power are still very much alive. At his brother’s unfortunate death in 771, Charlemagne claims the lands of Carloman II and becomes the sole leader of the Franks. This shocks several high noblemen, since normally Carloman’s title should have been passed on to his two healthy sons, for whom Charlemagne refuses to appoint a regent. Rather than serve a usurper, Ogier and his friends openly rebel against their new king. When Carloman’s widow, Gerberga of Pavia, flees to her father’s court, Frankish nobles accompany the princess and her two sons to Lombardy. Charlemagne captures his sister-in-law and his two young cousins, as well as Ogier the Dane, during his successful campaign against the Lombards in 773. Charlemagne sends the royal Lombards (King Desiderius, Queen Ansa, Princess Gerberga and her sons) to separate monasteries, and he has Ogier locked up in a castle under Duke Naymo’s care. As far as the king is concerned, the Lombard royal dynasty is no more, and Charlemagne distributes titles and lands to his loyal Frankish followers. Most surviving Lombard nobles swear fealty to their new king. But not all of them. Others prefer to flee, especially to Avarland or Bavaria. They are welcomed with open arms at the Agilolfing court, as Duke T assilo of Bavaria is himself married to the Lombard Princess Liutperga. Indeed, the disinherited Gerberga and her relatives have many powerful discontented friends. Among their allies are some Franks who remain loyal to Carloman II and his sons. Abroad, the Bavarian-Lombard faction is supported by Constantinople (the refuge of the vengeful Prince Adalgise), the Avars, and the independent Italian duchies of Benevento, Spoleto and Friuli. The House of Mayence is one of the most powerful clans of the kingdom. Their leader, Ganelon of Ponthieu, Count of Mainz, is a trusted councilor until he betrays his lord king out of hate for Roland, his step-son. Ganelon is accused after the battle of Roncevaux. His honor is defended by his champion and cousin, Pinabel the Gascon (an excellent swordsman and a skilled thief ), who loses his judicial duel against Count Thierry of Anjou. Ganelon is quartered by horses. Apart from Baldwin the Brave, all other Mayence knights are black-hearted traitors and ideally suited to figure as villains in an adventure. They want power by all means and, not surprisingly, they are among the founders of the Black Knights. Regularly, wronged vassals — including some paladins — oppose King Charlemagne. Even though they continue to recognize him as their lawful king, and respect him as such, they fight him to obtain justice or reparation for a crime. The four sons of Count Aymon defy the king’s power for several years, just like their cousin Maugis and their friend Ogier the Dane. Other powerful counts, like Gerard of Vienne and his family, or Garnier and Guy of Nanteuil, refuse to submit to Charlemagne on his conditions. All these revolting barons end up making peace, after having defeated their king in battle, or a forceful intervention from the paladins, or a miracle from God. Charlemagne’s repudiated son, sweet-faced but unfortunately hunchbacked, lives a miserable life in the court’s kitchens. His mother Himiltrude is safely locked away in a nunnery. But at court, flatterers tell Pepin that he should take his life back into his own hands, change his destiny and become king, or even emperor, himself ! These “friends” would gladly help to install Pepin on the Frankish throne in order to obtain high positions for themselves. On several occasions, high nobles conspire against their king in order to seize the throne. Count Hardrad of Thuringia comes close in 785, but his vast conspiracy ultimately fails. Minor Characters ================= After the failed coup of Count Hardrad, some of his relatives ally themselves with the House of Mayence. They create a secret but influential brotherhood, the Black Knights, whose first leader is Macharias of Lausanne, Hardrad’s nephew. Their goal is to further their political interests by manipulating Prince Charlot, Charlemagne’s favorite son. The Black Knights are mostly courtiers, always intriguing and scheming. Whenever their leader sends them out to do dirty business (up to assassination), the anonymous knights all dress in black, hence the name of their organization. They recognize each other by a small secret token, like a blue stone or a ribbon. The prince himself almost never participates and usually stays back at court. However, in 809 the Black Knights and their leader, Amaury de Hauteville, ambush Huon of Bordeaux and his men, and in the ensuing fight Prince Charlot is killed."
  },
  {
    "key": "amaury_of_hauteville",
    "nameKO": "오트빌의 아모리 백작",
    "nameEN": "Amaury of Hauteville",
    "category": "Enemies Within",
    "subcategory": "⚔️ 흑색 기사단 (Black Knights)",
    "years": "",
    "biographyKO": "사악한 마옌스(Mayence) 가문의 마지막 백작이자 흑색 기사단(Black Knights)의 악명 높은 우두머리입니다. 교활하고 비열한 음모가로 대제의 총애를 받는 샤를로 황자를 흑색 세력으로 타락시켰으며, 위고 경 일행을 기습 암살하려다 도리어 파멸을 맞이한 가문 파멸의 원흉입니다.",
    "biographyEN": "The last member of the House of Mayence becomes Count of Mayence in 803. A few years later, he replaces Fulco of Morillon as the chief of Charlot’s Black Knights. Amaury is a dastardly backstabber, corrupt and cruel, fatally proud, and over-confident."
  },
  {
    "key": "dorame",
    "nameKO": "도라메",
    "nameEN": "Dorame",
    "category": "Foreigners",
    "subcategory": "❄️ 아바르 (Avars)",
    "years": "",
    "biographyKO": "도라메 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The decadent khagan of the Avars (784–790).",
    "biographyEN": "The decadent khagan of the Avars (784–790)."
  },
  {
    "key": "otxoa",
    "nameKO": "옥초아 공작",
    "nameEN": "Otxoa",
    "category": "Foreigners",
    "subcategory": "🏔️ 바스크 (Basques)",
    "years": "",
    "biographyKO": "옥초아 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The treacherous 공작 of the 바스크족 allies with the 무어인 against the Franks, resulting in the disaster of 론세스바예스 협곡, where Otxoa meets his end.",
    "biographyEN": "The treacherous Duke of the Basques allies with the Moors against the Franks, resulting in the disaster of Roncevaux, where Otxoa meets his end."
  },
  {
    "key": "orthez",
    "nameKO": "오르테즈 공작",
    "nameEN": "Orthez",
    "category": "Foreigners",
    "subcategory": "🏔️ 바스크 (Basques)",
    "years": "",
    "biographyKO": "오르테즈 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. He succeeds his 부친 as a 공작 in 778, and although he pledges fealty to 샤를마뉴 대제, he tries to remain as independent from his Frankish overlord as possible.",
    "biographyEN": "He succeeds his father as a duke in 778, and although he pledges fealty to Charlemagne, he tries to remain as independent from his Frankish overlord as possible."
  },
  {
    "key": "aquin",
    "nameKO": "아캥 왕",
    "nameEN": "Aquin",
    "category": "Foreigners",
    "subcategory": "🏹 브르타뉴 (Bretons)",
    "years": "",
    "biographyKO": "아캥 왕 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 이교도 국왕 of 브르타뉴 is bald, with a hoary white beard. He wields a 마법의 창 and is known for his wisdom, cunning and valor. He is one of the very few Bretons to be literate. His war cry is “Manbrie!.” He reigns until 786.",
    "biographyEN": "The pagan king of Brittany is bald, with a hoary white beard. He wields a magic lance and is known for his wisdom, cunning and valor. He is one of the very few Bretons to be literate. His war cry is “Manbrie!.” He reigns until 786."
  },
  {
    "key": "doret_of_gardain",
    "nameKO": "가르댕의 도레",
    "nameEN": "Doret of Gardain",
    "category": "Foreigners",
    "subcategory": "🏹 브르타뉴 (Bretons)",
    "years": "",
    "biographyKO": "가르댕의 도레 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Aquin’s youngest 아들 is eager to prove himself in 전투.",
    "biographyEN": "King Aquin’s youngest son is eager to prove himself in battle."
  },
  {
    "key": "erdisa",
    "nameKO": "에르디사 왕비",
    "nameEN": "Erdisa",
    "category": "Foreigners",
    "subcategory": "🏹 브르타뉴 (Bretons)",
    "years": "",
    "biographyKO": "에르디사 왕비 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Breton 왕비 is very beautiful and exceptionally modest and wise.",
    "biographyEN": "The Breton queen is very beautiful and exceptionally modest and wise."
  },
  {
    "key": "grimoart_of_dinard",
    "nameKO": "디나르의 그리모아르",
    "nameEN": "Grimoart of Dinard",
    "category": "Foreigners",
    "subcategory": "🏹 브르타뉴 (Bretons)",
    "years": "",
    "biographyKO": "디나르의 그리모아르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Aquin’s eldest 아들 is a boastful, cruel and selfish man.",
    "biographyEN": "King Aquin’s eldest son is a boastful, cruel and selfish man."
  },
  {
    "key": "lubien_and_macabray",
    "nameKO": "루비앙과 마카브레",
    "nameEN": "Lubien and Macabray",
    "category": "Foreigners",
    "subcategory": "🏹 브르타뉴 (Bretons)",
    "years": "",
    "biographyKO": "루비앙과 마카브레 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 그는 wo aggressive local warlords, who regularly stage raids into Frankland for loot and prestige. 사망한 in 785. c o Nverts",
    "biographyEN": "T wo aggressive local warlords, who regularly stage raids into Frankland for loot and prestige. Killed in 785. c o Nverts"
  },
  {
    "key": "offa",
    "nameKO": "오파 국왕",
    "nameEN": "Offa",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "오파 국왕 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The clever and learned 국왕 of 머시아 (757–796) annexed W essex (by marriage), Kent, Sussex and East Anglia, unifying southern England. An enlightened ruler, Offa is a great admirer and a faithful ally of 샤를마뉴 대제, who in return protects British merchants and pilgrims on the continent.",
    "biographyEN": "The clever and learned King of Mercia (757–796) annexed W essex (by marriage), Kent, Sussex and East Anglia, unifying southern England. An enlightened ruler, Offa is a great admirer and a faithful ally of Charlemagne, who in return protects British merchants and pilgrims on the continent."
  },
  {
    "key": "clarice",
    "nameKO": "클라리스",
    "nameEN": "Clarice",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "클라리스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Offa’s beautiful 자매 혼인합니다 the widowed Ogier in 780.",
    "biographyEN": "King Offa’s beautiful sister marries the widowed Ogier in 780."
  },
  {
    "key": "ecfrid",
    "nameKO": "엑프리드",
    "nameEN": "Ecfrid",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "엑프리드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Offa’s 아들 is crowned co-ruler of 머시아 in 787, and rules as the sole 국왕 from his 부친’s death to his own, five months later. Like his 부친, he is a loyal ally of the Franks in their common struggle against the 덴마크인.",
    "biographyEN": "Offa’s son is crowned co-ruler of Mercia in 787, and rules as the sole king from his father’s death to his own, five months later. Like his father, he is a loyal ally of the Franks in their common struggle against the Danes."
  },
  {
    "key": "coenwulf",
    "nameKO": "코엔울프",
    "nameEN": "Coenwulf",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "코엔울프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The pious and ruthless 국왕 of 머시아 (796–821). NortHu Mbria",
    "biographyEN": "The pious and ruthless King of Mercia (796–821). NortHu Mbria"
  },
  {
    "key": "ahlred",
    "nameKO": "알레드",
    "nameEN": "Ahlred",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "알레드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 노섬브리아 (765–774).",
    "biographyEN": "King of Northumbria (765–774)."
  },
  {
    "key": "aethelred_i",
    "nameKO": "에텔레드 1세",
    "nameEN": "Aethelred I",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "에텔레드 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 노섬브리아 (774–779).",
    "biographyEN": "King of Northumbria (774–779)."
  },
  {
    "key": "aelfwald_i",
    "nameKO": "엘프왈드 1세",
    "nameEN": "Aelfwald I",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "엘프왈드 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 노섬브리아 (779–788).",
    "biographyEN": "King of Northumbria (779–788)."
  },
  {
    "key": "osred_ii",
    "nameKO": "오스레드 2세",
    "nameEN": "Osred II",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "오스레드 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 노섬브리아 (788–796).",
    "biographyEN": "King of Northumbria (788–796)."
  },
  {
    "key": "eardwulf",
    "nameKO": "어드울프",
    "nameEN": "Eardwulf",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "어드울프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 노섬브리아 (796–806), whose blazon is “d’azur à une couronne de fleurs argent” (a crown of silver flowers on a blue field).",
    "biographyEN": "King of Northumbria (796–806), whose blazon is “d’azur à une couronne de fleurs argent” (a crown of silver flowers on a blue field)."
  },
  {
    "key": "gilmer",
    "nameKO": "길머",
    "nameEN": "Gilmer",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "길머 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Zerbin’s valiant 조카 serves at the 궁정 of William Shortnose.",
    "biographyEN": "Zerbin’s valiant nephew serves at the court of William Shortnose."
  },
  {
    "key": "zerbin",
    "nameKO": "제르뱅 왕자",
    "nameEN": "Zerbin",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "제르뱅 왕자 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The romantic 황자 of 스코틀랜드 is the lover of Isabella of Galicia, 공작 Hamon’s 딸. Zerbin aids in finding back Roland’s wits. He recovers Roland’s arms and armor, but is then 전사한 by the cruel Mandricard (776). w esseX",
    "biographyEN": "The romantic prince of Scotland is the lover of Isabella of Galicia, Duke Hamon’s daughter. Zerbin aids in finding back Roland’s wits. He recovers Roland’s arms and armor, but is then slain by the cruel Mandricard (776). w esseX"
  },
  {
    "key": "cynewulf",
    "nameKO": "키네울프",
    "nameEN": "Cynewulf",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "키네울프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of W essex (757–786).",
    "biographyEN": "King of W essex (757–786)."
  },
  {
    "key": "bertric",
    "nameKO": "베르트릭",
    "nameEN": "Bertric",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "베르트릭 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of W essex (786–802).",
    "biographyEN": "King of W essex (786–802)."
  },
  {
    "key": "egbert_the_great",
    "nameKO": "에그버트 대왕",
    "nameEN": "Egbert the Great",
    "category": "Foreigners",
    "subcategory": "🏹 브리튼 (Britons)",
    "years": "",
    "biographyKO": "에그버트 대왕 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. As a chivalrous youth, 황자 Egbert spends some time at 샤를마뉴 대제’s 궁정. After Offa’s death, he rules W essex as an independent sovereign (802–839). e MPerors",
    "biographyEN": "As a chivalrous youth, Prince Egbert spends some time at Charlemagne’s court. After Offa’s death, he rules W essex as an independent sovereign (802–839). e MPerors"
  },
  {
    "key": "constantine_v",
    "nameKO": "콘스탄티누스 5세",
    "nameEN": "Constantine V",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "콘스탄티누스 5세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 바실레우스(그리스 황제) (741–775), whom the Franks call Hugo the Strong, is an ambitious man and a skilled military commander. One of his 딸들, Iakobine, has a child from the 성기사 Oliver, named Galien. The 비잔틴인 irreverently nickname him “Copronymos” (“dung-named”). =================",
    "biographyEN": "The Basileus (741–775), whom the Franks call Hugo the Strong, is an ambitious man and a skilled military commander. One of his daughters, Iakobine, has a child from the paladin Oliver, named Galien. The Byzantines irreverently nickname him “Copronymos” (“dung-named”). ================="
  },
  {
    "key": "leo_iv",
    "nameKO": "레오 4세",
    "nameEN": "Leo IV",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "레오 4세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Nicknamed “the Khazar” because his 모친 was a Circassian 공주, 황제 Leo IV (775–780) is a wise and tolerant ruler.",
    "biographyEN": "Nicknamed “the Khazar” because his mother was a Circassian princess, Emperor Leo IV (775–780) is a wise and tolerant ruler."
  },
  {
    "key": "constantine_vi",
    "nameKO": "콘스탄티누스 6세",
    "nameEN": "Constantine VI",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "콘스탄티누스 6세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This weak 황제 (780–797) is consumed by his ill-fated love for the Frankish 공주 Rothrud.",
    "biographyEN": "This weak emperor (780–797) is consumed by his ill-fated love for the Frankish Princess Rothrud."
  },
  {
    "key": "irene_of_athens",
    "nameKO": "아테네의 이레네 여제",
    "nameEN": "Irene of Athens",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "아테네의 이레네 여제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Leo IV’s 아내, she becomes the empress-regent (780–797), and later empress (797–802), then is exiled to Lesbos. Irene is an unscrupulous, energetic, intelligent, and very generous lady.",
    "biographyEN": "Leo IV’s wife, she becomes the empress-regent (780–797), and later empress (797–802), then is exiled to Lesbos. Irene is an unscrupulous, energetic, intelligent, and very generous lady."
  },
  {
    "key": "nikephoros",
    "nameKO": "니케포로스 서로마 황제",
    "nameEN": "Nikephoros",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "니케포로스 서로마 황제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This 황제 (802–811) is notorious for his devouring ambition and cruelty. 사망한 at the 전투 of Pliska.",
    "biographyEN": "This emperor (802–811) is notorious for his devouring ambition and cruelty. Killed at the battle of Pliska."
  },
  {
    "key": "staurakios_the_paralyzed",
    "nameKO": "반신불수 스타우라키오스",
    "nameEN": "Staurakios the Paralyzed",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "반신불수 스타우라키오스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 바실레우스(그리스 황제) of the Greeks (811). Named co-황제 with his 부친, Nikephoros, in 803. He abdicates in favor of Michael Rangabe, and 사망합니다 in 812 of wounds received at the 전투 of Pliska.",
    "biographyEN": "Basileus of the Greeks (811). Named co-emperor with his father, Nikephoros, in 803. He abdicates in favor of Michael Rangabe, and dies in 812 of wounds received at the Battle of Pliska."
  },
  {
    "key": "michael_rangabe",
    "nameKO": "미하일 랑가베",
    "nameEN": "Michael Rangabe",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "미하일 랑가베 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A skilled politician, 황제 Michael (811–813) tries to reconcile the opposing factions in order to unite his people against the 페르시아.",
    "biographyEN": "A skilled politician, Emperor Michael (811–813) tries to reconcile the opposing factions in order to unite his people against the Persians."
  },
  {
    "key": "leo_v",
    "nameKO": "레오 5세",
    "nameEN": "Leo V",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "레오 5세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 황제 of Byzantium (813–820). PatriarcHs",
    "biographyEN": "Emperor of Byzantium (813–820). PatriarcHs"
  },
  {
    "key": "niketas_the_slav",
    "nameKO": "슬라브인 니케타스",
    "nameEN": "Niketas the Slav",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "슬라브인 니케타스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Patriarch from 766 to 780.",
    "biographyEN": "Patriarch from 766 to 780."
  },
  {
    "key": "paul_the_new",
    "nameKO": "신형 바오로",
    "nameEN": "Paul the New",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "신형 바오로 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Patriarch from 780 to 784, when he retires to a 수도원.",
    "biographyEN": "Patriarch from 780 to 784, when he retires to a monastery."
  },
  {
    "key": "t_arasios",
    "nameKO": "타라시오스",
    "nameEN": "T arasios",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "타라시오스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This patriarch (784–806) is a very wise and learned lay scholar.",
    "biographyEN": "This patriarch (784–806) is a very wise and learned lay scholar."
  },
  {
    "key": "nikephoros",
    "nameKO": "니케포로스 서로마 황제",
    "nameEN": "Nikephoros",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "니케포로스 서로마 황제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 그는 arasios’ successor (806–815) is a simple but learned monk, known for his chastity and his tolerant attitude. o tHers",
    "biographyEN": "T arasios’ successor (806–815) is a simple but learned monk, known for his chastity and his tolerant attitude. o tHers"
  },
  {
    "key": "stauriakos",
    "nameKO": "스타우리아코스",
    "nameEN": "Stauriakos",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "스타우리아코스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A eunuch, a patrician and a logothete. He is Empress Irene’s right hand and favorite diplomat until his death in 800.",
    "biographyEN": "A eunuch, a patrician and a logothete. He is Empress Irene’s right hand and favorite diplomat until his death in 800."
  },
  {
    "key": "elissa",
    "nameKO": "엘리사",
    "nameEN": "Elissa",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "엘리사 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A 궁정 eunuch who acts as 공주 Rothrud’s tutor.",
    "biographyEN": "A court eunuch who acts as Princess Rothrud’s tutor."
  },
  {
    "key": "pancratios",
    "nameKO": "판크라티오스",
    "nameEN": "Pancratios",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "판크라티오스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 비잔틴 제국 궁정 점성술사.",
    "biographyEN": "The Byzantine court astrologer."
  },
  {
    "key": "salmadrine",
    "nameKO": "살마드린 공주",
    "nameEN": "Salmadrine",
    "category": "Foreigners",
    "subcategory": "👑 비잔틴 제국 (Byzantines)",
    "years": "",
    "biographyKO": "살마드린 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This beautiful 공주, Constantine V’s 자매, is 혼인했습니다 to the heroic Sir Landri of La Roche, the 아들 of Doon of La Roche and 공주 Olive of the Franks.",
    "biographyEN": "This beautiful princess, Constantine V’s sister, is married to the heroic Sir Landri of La Roche, the son of Doon of La Roche and Princess Olive of the Franks."
  },
  {
    "key": "godfrid_i",
    "nameKO": "고드프리드 1세",
    "nameEN": "Godfrid I",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "작센인들의 총사령관이자 '숲의 자식'으로 불린 위대한 샤먼 전사입니다. 보이지 않는 은신 마법과 야만 신앙을 부리며 기독교 프랑크 제국에 평생 가혹한 철혈 저항을 이끌었습니다. 785년 마침내 대제에게 굴복하여 기독교 세례를 받고 개종한 후 라이헤나우 수도원에서 생을 마감했습니다.",
    "biographyEN": "The proud and illustrious Frankish King of the Danes (740–781), was married to Duchess Passerose of Bavaria, Duke Naymo’s cousin. After her death in 751, the old but valiant King Godfrid married a Danish princess named Belissende, who pushed him to make war on the Frankish king. Defeated in battle, King Godfrid agreed to send his son, Ogier, as a hostage to the Frankish court. The noble king becomes Widukind’s ally in the Saxon’s resistance against the Frankish conquest. Guyon/Hemming I: Ogier’s chaste and thoughtful half-brother is crowned after their father’s violent death in a campaign against invading giants. Under King Hemming I’s rule (781–798), the relations between the Franks and the Danes are relatively peaceful."
  },
  {
    "key": "magnus_the_strong",
    "nameKO": "힘센 마그누스",
    "nameEN": "Magnus the Strong",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "힘센 마그누스 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A Danish convert who serves as a 기사 at the Frisian 궁정 under 공작 Lohier. In 800, carrying the enchanted Frisian banner he helps 국왕 샤를마뉴 대제 to liberate 로마 and he becomes the 공작 of Frisia.",
    "biographyEN": "A Danish convert who serves as a knight at the Frisian court under Duke Lohier. In 800, carrying the enchanted Frisian banner he helps King Charlemagne to liberate Rome and he becomes the duke of Frisia."
  },
  {
    "key": "sigfrid",
    "nameKO": "지크프리트",
    "nameEN": "Sigfrid",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "지크프리트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This rich and selfish warlord manages to usurp the title of 국왕 of Denmark in 798, after 국왕 Hemming I’s death. Godfrid II avenges his 부친 and kills Sigfrid in 전투 in 804.",
    "biographyEN": "This rich and selfish warlord manages to usurp the title of King of Denmark in 798, after King Hemming I’s death. Godfrid II avenges his father and kills Sigfrid in battle in 804."
  },
  {
    "key": "godfrid_ii",
    "nameKO": "고드프리드 2세",
    "nameEN": "Godfrid II",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "고드프리드 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Hemming I’s 아들 rules from 804 to 810, when he is 사망한 by a Danish traitor. The wealthy and prudent Godfrid II builds the Danevirke to protect his lands from the Franks.",
    "biographyEN": "King Hemming I’s son rules from 804 to 810, when he is killed by a Danish traitor. The wealthy and prudent Godfrid II builds the Danevirke to protect his lands from the Franks."
  },
  {
    "key": "hemming_ii",
    "nameKO": "헤밍 2세",
    "nameEN": "Hemming II",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "헤밍 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Godfrid II’s 조카 is a wise and prudent 국왕 (811–812). He makes war with the Franks and favors prosperity through trade.",
    "biographyEN": "King Godfrid II’s nephew is a wise and prudent king (811–812). He makes war with the Franks and favors prosperity through trade."
  },
  {
    "key": "reginald",
    "nameKO": "레지널드",
    "nameEN": "Reginald",
    "category": "Foreigners",
    "subcategory": "🌊 북방 덴마크 (Danes)",
    "years": "",
    "biographyKO": "레지널드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Hemming I’s youngest 아들 사망합니다 in 전투 in 808. a quitaiNiaN 귀족들",
    "biographyEN": "King Hemming I’s youngest son dies in battle in 808. a quitaiNiaN  Nobles"
  },
  {
    "key": "w_aifer",
    "nameKO": "W aifer",
    "nameEN": "W aifer",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "W aifer 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 공작 of 아키텐 (748–767) is an ally of the rebellious 황자 Grifo (국왕 Pepin’s half-형제).",
    "biographyEN": "The Duke of Aquitaine (748–767) is an ally of the rebellious Prince Grifo (King Pepin’s half-brother)."
  },
  {
    "key": "hunold",
    "nameKO": "위놀드 공작",
    "nameEN": "Hunold",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "위놀드 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of 아키텐 (767–768), 공작 W aifer’s 아들.",
    "biographyEN": "Duke of Aquitaine (767–768), Duke W aifer’s son."
  },
  {
    "key": "alice",
    "nameKO": "앨리스 공작부인",
    "nameEN": "Alice",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "앨리스 공작부인 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Duchess-regent of 아키텐 (803–810), Sevin’s 아내 and 모친 of Huon of Bordeaux.",
    "biographyEN": "Duchess-regent of Aquitaine (803–810), Sevin’s wife and mother of Huon of Bordeaux."
  },
  {
    "key": "lupus",
    "nameKO": "루푸스 공작",
    "nameEN": "Lupus",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "루푸스 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 공작 of Gascony (759–768) betrays his ally 공작 W aifer of 아키텐, formally submits to 샤를마뉴 대제, and becomes a faithful Frankish 백작. He 사망합니다 at 론세스바예스 협곡.",
    "biographyEN": "The Duke of Gascony (759–768) betrays his ally Duke W aifer of Aquitaine, formally submits to Charlemagne, and becomes a faithful Frankish count. He dies at Roncevaux."
  },
  {
    "key": "yo_n",
    "nameKO": "요네 공작",
    "nameEN": "Yo n",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "요네 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The 공작 of Gascony (768–786) 혼인합니다 his eldest 딸 Clarissa to Renaud of Montalban, his second 딸 Ayglentine becomes the 아내 of Guy of Nanteuil, and the third weds the valiant Sir Bevis of Commarchis.",
    "biographyEN": "The Duke of Gascony (768–786) marries his eldest daughter Clarissa to Renaud of Montalban, his second daughter Ayglentine becomes the wife of Guy of Nanteuil, and the third weds the valiant Sir Bevis of Commarchis."
  },
  {
    "key": "odalric",
    "nameKO": "오달릭",
    "nameEN": "Odalric",
    "category": "Foreigners",
    "subcategory": "🏔️ 가스코뉴 & 아키텐 (Gascons & Aquitainians)",
    "years": "",
    "biographyKO": "오달릭 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 Lupus’ second 아들 captures his rival, 공작 Chorso of 그는 oulouse, in 787 and vainly tries to restore the independence of Gascony. He is forced to surrender and is sent to a 수도원 to reflect upon his numerous sins.",
    "biographyEN": "Duke Lupus’ second son captures his rival, Duke Chorso of T oulouse, in 787 and vainly tries to restore the independence of Gascony. He is forced to surrender and is sent to a monastery to reflect upon his numerous sins."
  },
  {
    "key": "kurguz",
    "nameKO": "쿠르구즈",
    "nameEN": "Kurguz",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "쿠르구즈 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The fat and decadent ceremonial khagan.",
    "biographyEN": "The fat and decadent ceremonial khagan."
  },
  {
    "key": "unguimer",
    "nameKO": "웅구이메르",
    "nameEN": "Unguimer",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "웅구이메르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A traitor tarkan who helps the Franks conquer the Avar Ring in 794. b ulgar k HagaNs",
    "biographyEN": "A traitor tarkan who helps the Franks conquer the Avar Ring in 794. b ulgar  k HagaNs"
  },
  {
    "key": "t_elerig",
    "nameKO": "텔레리그",
    "nameEN": "T elerig",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "텔레리그 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Successful in his wars with Byzantium, the cruel khagan is nevertheless chased from power by one of his own in 776. Minor Characters =================",
    "biographyEN": "Successful in his wars with Byzantium, the cruel khagan is nevertheless chased from power by one of his own in 776. Minor Characters ================="
  },
  {
    "key": "krum",
    "nameKO": "크룸",
    "nameEN": "Krum",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "크룸 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Rogero’s successor is a skillful 전투 leader and a subtle diplomat. His rule (784–814) is based on austerity, discipline and ruthless military efficiency. He maintains the alliance with the Franks to annihilate his Avar rivals. c ircassiaN t sars",
    "biographyEN": "King Rogero’s successor is a skillful battle leader and a subtle diplomat. His rule (784–814) is based on austerity, discipline and ruthless military efficiency. He maintains the alliance with the Franks to annihilate his Avar rivals. c ircassiaN  t sars"
  },
  {
    "key": "sacripant",
    "nameKO": "사크리판트 차르",
    "nameEN": "Sacripant",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "동방 카타이 제국에서 온 절세의 미모를 지닌 이국적인 공주입니다. 온 세상 남자들을 홀리는 마성의 미모(APP 30)와 마법을 무효화하고 투명화 상태로 만드는 영험한 마법 반지를 소유했습니다. 성기사 롤랑을 광증에 빠뜨린 장본인이자 동방 전설의 마법적 상징입니다.",
    "biographyEN": "The courteous tsar of Circassia (or Khazaria) is a vain contender for the love of Angelica of Cathay. He rides the fabulous horse Frontino, until it is stolen from underneath him by Brunello. s ericaNe  k HagaNs"
  },
  {
    "key": "agrican",
    "nameKO": "아그리칸 카간",
    "nameEN": "Agrican",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "동방 카타이 제국에서 온 절세의 미모를 지닌 이국적인 공주입니다. 온 세상 남자들을 홀리는 마성의 미모(APP 30)와 마법을 무효화하고 투명화 상태로 만드는 영험한 마법 반지를 소유했습니다. 성기사 롤랑을 광증에 빠뜨린 장본인이자 동방 전설의 마법적 상징입니다.",
    "biographyEN": "Roland kills this noble and worthy khagan in a duel for Angelica’s love in 775. Just before he expires, Agrican demands that Roland baptize him."
  },
  {
    "key": "gradasso",
    "nameKO": "그라다소 카간",
    "nameEN": "Gradasso",
    "category": "Foreigners",
    "subcategory": "❄️ 불가르 & 훈족 (Bulgars & Huns)",
    "years": "",
    "biographyKO": "그라다소 카간 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This chivalrous but arrogant khagan of the 그는 artars attacks Frankland and defies 샤를마뉴 대제 in order to win Bayard and Durendal for himself. He is finally 사망한 by Roland at the threefold duel of Lampedusa (776).",
    "biographyEN": "This chivalrous but arrogant khagan of the T artars attacks Frankland and defies Charlemagne in order to win Bayard and Durendal for himself. He is finally killed by Roland at the threefold duel of Lampedusa (776)."
  },
  {
    "key": "isaac",
    "nameKO": "유대인 이삭",
    "nameEN": "Isaac",
    "category": "Foreigners",
    "subcategory": "⛪ 유대인 (Jews)",
    "years": "",
    "biographyKO": "유대인 이삭 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A wise and wealthy merchant who speaks Hebrew, Latin, Greek, and Arabic. 샤를마뉴 대제 sends him on an embassy to Harun al-Rashid in 799. r oyal l o Mbard f a Mily",
    "biographyEN": "A wise and wealthy merchant who speaks Hebrew, Latin, Greek, and Arabic. Charlemagne sends him on an embassy to Harun al-Rashid in 799. r oyal  l o Mbard  f a Mily"
  },
  {
    "key": "desiderius",
    "nameKO": "데시데리우스 국왕",
    "nameEN": "Desiderius",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "데시데리우스 국왕 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The former 공작 of 그는 uscany, now 국왕 of 롬바르디아, is too old to fight on the battlefield. He prefers to advance his plans through political alliances, by marrying his children to the rich and powerful. 그는 ~로 유배당해 a 수도원 after the fall of Pavia in 774.",
    "biographyEN": "The former Duke of T uscany, now King of Lombardy, is too old to fight on the battlefield. He prefers to advance his plans through political alliances, by marrying his children to the rich and powerful. He is sent to a monastery after the fall of Pavia in 774."
  },
  {
    "key": "ansa",
    "nameKO": "안사 왕비",
    "nameEN": "Ansa",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "안사 왕비 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Desiderius’ beautiful and proud 아내.",
    "biographyEN": "King Desiderius’ beautiful and proud wife."
  },
  {
    "key": "adalchis",
    "nameKO": "아달지스 왕자",
    "nameEN": "Adalchis",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "아달지스 왕자 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 Desiderius’ only 아들 is the exiled leader of the anti-Frankish alliance. He is resentful, cruel, and rather a coward.",
    "biographyEN": "King Desiderius’ only son is the exiled leader of the anti-Frankish alliance. He is resentful, cruel, and rather a coward."
  },
  {
    "key": "liutperga",
    "nameKO": "리우트베르가 공주",
    "nameEN": "Liutperga",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "리우트베르가 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Desiderius’ eldest 딸 is 혼인했습니다 to 공작 그는 assilo III of 바이에른. She cultivates an intense and overt hate of 국왕 샤를마뉴 대제, to whom she never bows.",
    "biographyEN": "Desiderius’ eldest daughter is married to Duke T assilo III of Bavaria. She cultivates an intense and overt hate of King Charlemagne, to whom she never bows."
  },
  {
    "key": "gerberga",
    "nameKO": "게르베르가 왕비",
    "nameEN": "Gerberga",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "게르베르가 왕비 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Desiderius’ second 딸 is 국왕 Carloman’s 아내. At her 남편’s death, she flees to Pavia.",
    "biographyEN": "Desiderius’ second daughter is King Carloman’s wife. At her husband’s death, she flees to Pavia."
  },
  {
    "key": "desideria",
    "nameKO": "데시데리아",
    "nameEN": "Desideria",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "데시데리아 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. See Wives.",
    "biographyEN": "See Wives."
  },
  {
    "key": "adalperga",
    "nameKO": "아달페르가 공주",
    "nameEN": "Adalperga",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "아달페르가 공주 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Desiderius’ fourth 딸 is 혼인했습니다 to 공작 Arichis of Benevento. b eNeveNto",
    "biographyEN": "Desiderius’ fourth daughter is married to Duke Arichis of Benevento. b eNeveNto"
  },
  {
    "key": "arichis",
    "nameKO": "아리키스 공작",
    "nameEN": "Arichis",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "아리키스 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The stubborn and haughty 공작 (758–787) calls himself “황자, ” and refuses to submit after the Frankish conquest of 롬바르디아. He is pious and cultivated, and delights in intrigues and dastardly plots, quite like his 비잔틴 제국 friends. He is 혼인했습니다 to 공주 Adalperga of 롬바르디아.",
    "biographyEN": "The stubborn and haughty duke (758–787) calls himself “prince, ” and refuses to submit after the Frankish conquest of Lombardy. He is pious and cultivated, and delights in intrigues and dastardly plots, quite like his Byzantine friends. He is married to Princess Adalperga of Lombardy."
  },
  {
    "key": "grimoald_iii",
    "nameKO": "그리모알드 3세",
    "nameEN": "Grimoald III",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "그리모알드 3세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Arichis’ youngest 아들 is taken hostage by 샤를마뉴 대제 in 787, then released and installed as 공작 (788–806). He remains loyal and even fights against his former 비잔틴 제국 allies.",
    "biographyEN": "Arichis’ youngest son is taken hostage by Charlemagne in 787, then released and installed as duke (788–806). He remains loyal and even fights against his former Byzantine allies."
  },
  {
    "key": "grimoald_iv",
    "nameKO": "그리모알드 4세",
    "nameEN": "Grimoald IV",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "그리모알드 4세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. He was Grimoald’s treasurer, and takes the throne from Grimoald III’s 아들, Ilderic, in 806. He rules by brute force until his 암살 in 817. f riuli",
    "biographyEN": "He was Grimoald’s treasurer, and takes the throne from Grimoald III’s son, Ilderic, in 806. He rules by brute force until his assassination in 817. f riuli"
  },
  {
    "key": "rhodgaud",
    "nameKO": "로드고드 공작",
    "nameEN": "Rhodgaud",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "로드고드 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Rebellious and fickle 공작 of Friuli (767–776).",
    "biographyEN": "Rebellious and fickle Duke of Friuli (767–776)."
  },
  {
    "key": "marcarius",
    "nameKO": "마르카리우스 공작",
    "nameEN": "Marcarius",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "마르카리우스 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of Friuli (776–789), appointed by 샤를마뉴 대제 himself.",
    "biographyEN": "Duke of Friuli (776–789), appointed by Charlemagne himself."
  },
  {
    "key": "aio",
    "nameKO": "아이오 공작",
    "nameEN": "Aio",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "아이오 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of Friuli (799–816), arrogant but respected. s Poleto",
    "biographyEN": "Duke of Friuli (799–816), arrogant but respected. s Poleto"
  },
  {
    "key": "theodicius",
    "nameKO": "테오디키우스 공작",
    "nameEN": "Theodicius",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "테오디키우스 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Lombard 공작 (767–773) 사망합니다 in the war against the Franks.",
    "biographyEN": "The Lombard duke (767–773) dies in the war against the Franks."
  },
  {
    "key": "hildeprand",
    "nameKO": "힐데프란드 공작",
    "nameEN": "Hildeprand",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "힐데프란드 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A valorous Frankish 공작 (774–789), who 사망합니다 in 전투 against the 비잔틴인.",
    "biographyEN": "A valorous Frankish duke (774–789), who dies in battle against the Byzantines."
  },
  {
    "key": "winichis",
    "nameKO": "위니키스 공작",
    "nameEN": "Winichis",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "위니키스 공작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A just and loyal Frankish 공작 (789–822). v eNice",
    "biographyEN": "A just and loyal Frankish duke (789–822). v eNice"
  },
  {
    "key": "galbaio",
    "nameKO": "갈바이오 도제",
    "nameEN": "Galbaio",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "갈바이오 도제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The wealthy doge (공작) of V enice (764–787) is a shrewd and prudent man.",
    "biographyEN": "The wealthy doge (duke) of V enice (764–787) is a shrewd and prudent man."
  },
  {
    "key": "giovanni",
    "nameKO": "조반니 도제",
    "nameEN": "Giovanni",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "조반니 도제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Galbaio’s 아들 and his successor as doge (787–805) is a vengeful, cruel character and an unscrupulous slave trader.",
    "biographyEN": "Galbaio’s son and his successor as doge (787–805) is a vengeful, cruel character and an unscrupulous slave trader."
  },
  {
    "key": "oberlier",
    "nameKO": "오벨리어 도제",
    "nameEN": "Oberlier",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "오벨리어 도제 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. As doge (805–810) he wisely 혼인합니다 a Frankish woman and remains loyal to 샤를마뉴 대제. o tHers",
    "biographyEN": "As doge (805–810) he wisely marries a Frankish woman and remains loyal to Charlemagne. o tHers"
  },
  {
    "key": "garnier",
    "nameKO": "갈리에 대공",
    "nameEN": "Garnier",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "갈리에 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The perfidious 공작 of Calabria.",
    "biographyEN": "The perfidious Duke of Calabria."
  },
  {
    "key": "gregorio",
    "nameKO": "그레고리오 대공",
    "nameEN": "Gregorio",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "그레고리오 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of Campania.",
    "biographyEN": "Duke of Campania."
  },
  {
    "key": "milo",
    "nameKO": "밀로 대공",
    "nameEN": "Milo",
    "category": "Foreigners",
    "subcategory": "🛡️ 롬바르드 (Lombards)",
    "years": "",
    "biographyKO": "밀로 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of Apulia.",
    "biographyEN": "Duke of Apulia."
  },
  {
    "key": "al_mansour",
    "nameKO": "알 만수르 칼리프",
    "nameEN": "Al-Mansour",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알 만수르 칼리프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This generous and just caliph (754–775) stimulates the arts and sciences that make the Persian realm flourish.",
    "biographyEN": "This generous and just caliph (754–775) stimulates the arts and sciences that make the Persian realm flourish."
  },
  {
    "key": "al_mahdi",
    "nameKO": "알 마흐디 칼리프",
    "nameEN": "Al-Mahdi",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알 마흐디 칼리프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Al-Mansour’s 아들 is a just and stern caliph (775–785), who manages to keep the peace. He imprisons his vizier, Jacub, when he suspects him of 반역.",
    "biographyEN": "Al-Mansour’s son is a just and stern caliph (775–785), who manages to keep the peace. He imprisons his vizier, Jacub, when he suspects him of treason."
  },
  {
    "key": "al_hadi",
    "nameKO": "알 하디 칼리프",
    "nameEN": "Al-Hadi",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알 하디 칼리프 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Al-Mahdi’s 아들 is briefly caliph from 785 to 786, until he is assassinated by a family member.",
    "biographyEN": "Al-Mahdi’s son is briefly caliph from 785 to 786, until he is assassinated by a family member."
  },
  {
    "key": "harun_al_rashid",
    "nameKO": "하룬 알 라시드",
    "nameEN": "Harun al-Rashid",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "하룬 알 라시드 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The enlightened, just and very learned caliph (786–809) is 샤를마뉴 대제’s respected ally.",
    "biographyEN": "The enlightened, just and very learned caliph (786–809) is Charlemagne’s respected ally."
  },
  {
    "key": "al_amin",
    "nameKO": "알 아민",
    "nameEN": "Al-Amin",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알 아민 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Harun’s 아들 and successor (809–813). o tHers",
    "biographyEN": "Harun’s son and successor (809–813). o tHers"
  },
  {
    "key": "jafar",
    "nameKO": "자파르 재상",
    "nameEN": "Jafar",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "자파르 재상 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Harun’s grand vizier is a shrewd, powerful, and very demanding nobleman. =================",
    "biographyEN": "Harun’s grand vizier is a shrewd, powerful, and very demanding nobleman. ================="
  },
  {
    "key": "carahue_the_courteous",
    "nameKO": "예의 바른 카라후",
    "nameEN": "Carahue the Courteous",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "예의 바른 카라후 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. An extremely chivalrous 기사, who earns Ogier’s respect at the siege of 로마 in 767, and becomes his life-long friend. He finally accepts 세례 in 784, when he 혼인합니다 공주 Gloriande (the late Sultan Corsuble’s 딸) and takes a mission to convert the people of Cathay. Roman Popes",
    "biographyEN": "An extremely chivalrous knight, who earns Ogier’s respect at the siege of Rome in 767, and becomes his life-long friend. He finally accepts baptism in 784, when he marries Princess Gloriande (the late Sultan Corsuble’s daughter) and takes a mission to convert the people of Cathay. Roman Popes"
  },
  {
    "key": "paul_i",
    "nameKO": "교황 바오로 1세",
    "nameEN": "Paul I",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "교황 바오로 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Pope until his death in 767, Stephen II’s energetic 형제 is a learned aristocrat and a fine diplomat.",
    "biographyEN": "Pope until his death in 767, Stephen II’s energetic brother is a learned aristocrat and a fine diplomat."
  },
  {
    "key": "constantine_ii",
    "nameKO": "대립교황 콘스탄티누스 2세",
    "nameEN": "Constantine II",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "대립교황 콘스탄티누스 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A dogmatic and humorless lay anti-Pope (767–768), installed at the Lateran Palace under threat of military action by his 형제, 공작 그는 oto of Nepi.",
    "biographyEN": "A dogmatic and humorless lay anti-Pope (767–768), installed at the Lateran Palace under threat of military action by his brother, Duke T oto of Nepi."
  },
  {
    "key": "stephen_iii",
    "nameKO": "교황 스테파노 3세",
    "nameEN": "Stephen III",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "교황 스테파노 3세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A prudent and somewhat paranoid Pope (768–772), who wants to control everything and everybody around him.",
    "biographyEN": "A prudent and somewhat paranoid Pope (768–772), who wants to control everything and everybody around him."
  },
  {
    "key": "adrian_i",
    "nameKO": "교황 하드리아노 1세",
    "nameEN": "Adrian I",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "교황 하드리아노 1세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. An aristocrat from a very wealthy patrician family, this Pope (772–795) is a subtle politician and skilled diplomat. He cares little for theology.",
    "biographyEN": "An aristocrat from a very wealthy patrician family, this Pope (772–795) is a subtle politician and skilled diplomat. He cares little for theology."
  },
  {
    "key": "leo_iii",
    "nameKO": "교황 레오 3세",
    "nameEN": "Leo III",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "교황 레오 3세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. He is not a member of the Roman aristocracy, but as a Pope (795–816) he manages his affairs among the Romans with success. His adversaries reproach him for caring too much for temporal power and pleasures. 무어인 e Mirs of c ordoba",
    "biographyEN": "He is not a member of the Roman aristocracy, but as a Pope (795–816) he manages his affairs among the Romans with success. His adversaries reproach him for caring too much for temporal power and pleasures. Moors e Mirs  of  c ordoba"
  },
  {
    "key": "galafre_of_aufalerne",
    "nameKO": "아우팔레른의 갈라프르",
    "nameEN": "Galafre of Aufalerne",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "아우팔레른의 갈라프르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕 and Galienna’s 부친 was a cultivated poet and a man of peace. The tolerant emir (750–765) was loved by his people. 사망한 in 전투 by the caliph of 페르시아.",
    "biographyEN": "Marsile and Galienna’s father was a cultivated poet and a man of peace. The tolerant emir (750–765) was loved by his people. Killed in battle by the caliph of Persia."
  },
  {
    "key": "marsile_of_cordoba",
    "nameKO": "코르도바의 마르실 왕",
    "nameEN": "Marsile of Cordoba",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "코르도바의 마르실 왕 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. (765–779) 마르실 왕 is Emir Galafre’s 아들 and the older 형제 of Sultan 발리강. Ever since his youth, he has strongly disliked the Franks in general, and 샤를마뉴 대제 in particular. He is driven by jealousy and his unreasonable ambition to conquer Frankland. He wields a 성검 called Precieuse. Hisham the Cruel, also known as 마르실 왕 II: 마르실 왕’s 아들 is even more cruel and hateful than his 부친, hence his nickname. During his long and violent reign (780–808), he gets briefly imprisoned by his rival Deramay (793–794), but returns to power and systematically eliminates all those he suspects of disloyalty, causing long-lasting revolts and unrest all over the emirate.",
    "biographyEN": "(765–779) Marsile is Emir Galafre’s son and the older brother of Sultan Baligant. Ever since his youth, he has strongly disliked the Franks in general, and Charlemagne in particular. He is driven by jealousy and his unreasonable ambition to conquer Frankland. He wields a sword called Precieuse. Hisham the Cruel, also known as Marsile II: Marsile’s son is even more cruel and hateful than his father, hence his nickname. During his long and violent reign (780–808), he gets briefly imprisoned by his rival Deramay (793–794), but returns to power and systematically eliminates all those he suspects of disloyalty, causing long-lasting revolts and unrest all over the emirate."
  },
  {
    "key": "deramay_the_usurper",
    "nameKO": "찬탈자 데라마이",
    "nameEN": "Deramay the Usurper",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "찬탈자 데라마이 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The deceitful and vain W ali of Cordoba captures Emir 마르실 왕 II and claims the title of emir for himself (793–794). 귀족들",
    "biographyEN": "The deceitful and vain W ali of Cordoba captures Emir Marsile II and claims the title of emir for himself (793–794). Nobles"
  },
  {
    "key": "abdul_rahman",
    "nameKO": "압둘 라흐만",
    "nameEN": "Abdul Rahman",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "압둘 라흐만 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Hisham’s chivalrous youngest 아들 has a poetic soul, but feels the burden of fulfilling his 부친’s insane ambitions.",
    "biographyEN": "Hisham’s chivalrous youngest son has a poetic soul, but feels the burden of fulfilling his father’s insane ambitions."
  },
  {
    "key": "agolant",
    "nameKO": "아골란트",
    "nameEN": "Agolant",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "아골란트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The proud and valiant W ali of Compostela.",
    "biographyEN": "The proud and valiant W ali of Compostela."
  },
  {
    "key": "aragon_of_orange",
    "nameKO": "오렌지의 아라공",
    "nameEN": "Aragon of Orange",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "오렌지의 아라공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Tiebaut’s eldest 아들.",
    "biographyEN": "Tiebaut’s eldest son."
  },
  {
    "key": "blancandrin_of_v_alfond",
    "nameKO": "발퐁드의 블랑캉드랭",
    "nameEN": "Blancandrin of V alfond",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "발퐁드의 블랑캉드랭 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Emir 마르실 왕’s white-bearded ambassador; a despicable, sly, ruthless character, who is even willing to sacrifice his own 아들들 in his quest for wealth and power.",
    "biographyEN": "Emir Marsile’s white-bearded ambassador; a despicable, sly, ruthless character, who is even willing to sacrifice his own sons in his quest for wealth and power."
  },
  {
    "key": "bramimonde",
    "nameKO": "브라미몽드 왕비",
    "nameEN": "Bramimonde",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "브라미몽드 왕비 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕’s 아내 is a romantic 왕비, who is captured and 세례를 받은 as Juliana at Aachen after the 전투 of 론세스바예스 협곡.",
    "biographyEN": "Marsile’s wife is a romantic queen, who is captured and baptized as Juliana at Aachen after the Battle of Roncevaux."
  },
  {
    "key": "corsolt",
    "nameKO": "코르솔트",
    "nameEN": "Corsolt",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "코르솔트 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The cruel W ali of Barbastro in 802 (not to be confused with the disreputable giant who cuts off William’s nose in a duel near 로마 in 781).",
    "biographyEN": "The cruel W ali of Barbastro in 802 (not to be confused with the disreputable giant who cuts off William’s nose in a duel near Rome in 781)."
  },
  {
    "key": "dardinel",
    "nameKO": "다르디넬",
    "nameEN": "Dardinel",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "다르디넬 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕’s courteous half-형제 and 황자 of 그는 oledo, 사망한 in 전투 by Renaud of Montalban in 775.",
    "biographyEN": "Marsile’s courteous half-brother and prince of T oledo, killed in battle by Renaud of Montalban in 775."
  },
  {
    "key": "ganor_of_aufalerne",
    "nameKO": "아우팔레른의 가노르",
    "nameEN": "Ganor of Aufalerne",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "아우팔레른의 가노르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. This pious, courteous, and relatively autonomous wali is the bastard 아들 of Emir Galafre. He is in love with Aye of Avignon, whom he captures and 혼인합니다.",
    "biographyEN": "This pious, courteous, and relatively autonomous wali is the bastard son of Emir Galafre. He is in love with Aye of Avignon, whom he captures and marries."
  },
  {
    "key": "gaudissa",
    "nameKO": "고디사",
    "nameEN": "Gaudissa",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "고디사 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕 I’s lovely 딸. She converts and 혼인합니다 공작 Anseïs of Carthago. Otrant of Nîmes: The W ali of Nîmes, who gets 사망한 when William captures his city in 790.",
    "biographyEN": "Marsile I’s lovely daughter. She converts and marries Duke Anseïs of Carthago. Otrant of Nîmes: The W ali of Nîmes, who gets killed when William captures his city in 790."
  },
  {
    "key": "siglorel",
    "nameKO": "시글로렐",
    "nameEN": "Siglorel",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "시글로렐 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕’s 궁정 마법사.",
    "biographyEN": "Marsile’s court enchanter."
  },
  {
    "key": "sulayman",
    "nameKO": "슐레이만",
    "nameEN": "Sulayman",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "슐레이만 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The W ali of Barcelona is the head of the Persian faction in Spain. He secretly travels to Paderborn in 777 to enlist Frankish support against Emir 마르실 왕 of Cordoba.",
    "biographyEN": "The W ali of Barcelona is the head of the Persian faction in Spain. He secretly travels to Paderborn in 777 to enlist Frankish support against Emir Marsile of Cordoba."
  },
  {
    "key": "tiebaut",
    "nameKO": "티에보",
    "nameEN": "Tiebaut",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "티에보 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The former W ali of Orange (776–791) is Lady Orable’s first 남편 before she converts and 혼인합니다 William. 그는 learned, cunning man and a proud warrior. c o Nverts",
    "biographyEN": "The former W ali of Orange (776–791) is Lady Orable’s first husband before she converts and marries William. He is a learned, cunning man and a proud warrior. c o Nverts"
  },
  {
    "key": "florismart",
    "nameKO": "플로리스마르",
    "nameEN": "Florismart",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "플로리스마르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A courteous and romantic Moor 개종한 by Roland, whose friend he becomes. His lover is the 이교도 공주 Flordelis. He is 사망한 by Gradasso at Lampedusa in 776.",
    "biographyEN": "A courteous and romantic Moor converted by Roland, whose friend he becomes. His lover is the pagan Princess Flordelis. He is killed by Gradasso at Lampedusa in 776."
  },
  {
    "key": "orable",
    "nameKO": "Orable (Guibourc)",
    "nameEN": "Orable (Guibourc)",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "Guibourc",
    "biographyKO": "Orable 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 마르실 왕’s 자매 is forced to marry Tiebaut, but she is secretly in love with Sir William Shortnose, whom she 혼인합니다 after her 세례 as Guibourc, in 791. 그녀는 loyal, courageous, willful, romantic 공주, who knows some minor 마법의. She loves William so much that she entirely denies her 이교도 relatives, apart from Rainouart, whom she converts.",
    "biographyEN": "Marsile’s sister is forced to marry Tiebaut, but she is secretly in love with Sir William Shortnose, whom she marries after her baptism as Guibourc, in 791. She is a loyal, courageous, willful, romantic princess, who knows some minor magic. She loves William so much that she entirely denies her pagan relatives, apart from Rainouart, whom she converts."
  },
  {
    "key": "marfisa",
    "nameKO": "마르피사",
    "nameEN": "Marfisa",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "마르피사 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Rogero’s twin 자매 is a fierce warrior-maiden.",
    "biographyEN": "Rogero’s twin sister is a fierce warrior-maiden."
  },
  {
    "key": "otuel",
    "nameKO": "Otuel (Ferrau)",
    "nameEN": "Otuel (Ferrau)",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "Ferrau",
    "biographyKO": "Otuel 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A courteous semi-giant, miraculously 개종한 by Roland during the First Spanish 원정 in 771. His 아내 is the beautiful Belisarde. In 775, he slays Khagan Argalia of Sericane in a duel.",
    "biographyEN": "A courteous semi-giant, miraculously converted by Roland during the First Spanish Campaign in 771. His wife is the beautiful Belisarde. In 775, he slays Khagan Argalia of Sericane in a duel."
  },
  {
    "key": "corsuble",
    "nameKO": "코르쉬블",
    "nameEN": "Corsuble",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "코르쉬블 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The honorable and chivalrous Sultan (752– 774) who claims 로마 as his heritage.",
    "biographyEN": "The honorable and chivalrous Sultan (752– 774) who claims Rome as his heritage."
  },
  {
    "key": "baligant",
    "nameKO": "발리강 에미르",
    "nameEN": "Baligant",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "발리강 에미르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Emir 마르실 왕’s younger 형제 is the monstrous, reckless and pretentious Sultan of Babylon (775–778). He is 사망한 by 샤를마뉴 대제 himself in the second part of the 전투 of 론세스바예스 협곡.",
    "biographyEN": "Emir Marsile’s younger brother is the monstrous, reckless and pretentious Sultan of Babylon (775–778). He is killed by Charlemagne himself in the second part of the Battle of Roncevaux."
  },
  {
    "key": "bruhier",
    "nameKO": "브뤼히에 술탄",
    "nameEN": "Bruhier",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "브뤼히에 술탄 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A valorous but arrogant Sultan (779–780), who believes himself to be invincible, until Ogier kills him in a duel.",
    "biographyEN": "A valorous but arrogant Sultan (779–780), who believes himself to be invincible, until Ogier kills him in a duel."
  },
  {
    "key": "norandin",
    "nameKO": "노란딘 술탄",
    "nameEN": "Norandin",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "노란딘 술탄 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The greedy and iniquitous Sultan (781–802) is 사망한 at Jerusalem in a 전투 with 백작 Simon of Apulia. Minor Characters =================",
    "biographyEN": "The greedy and iniquitous Sultan (781–802) is killed at Jerusalem in a battle with Count Simon of Apulia. Minor Characters ================="
  },
  {
    "key": "gaudisso",
    "nameKO": "고디소 술탄",
    "nameEN": "Gaudisso",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "고디소 술탄 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A vain and decadent Sultan (803–811), who is 전사한 by Huon of Bordeaux. The young 성기사 혼인합니다 the Sultan’s gorgeous 딸, Clarimunda.",
    "biographyEN": "A vain and decadent Sultan (803–811), who is slain by Huon of Bordeaux. The young paladin marries the Sultan’s gorgeous daughter, Clarimunda."
  },
  {
    "key": "agrapard",
    "nameKO": "아그라파르 술탄",
    "nameEN": "Agrapard",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "아그라파르 술탄 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Sultan of Babylon (811–814). 귀족들",
    "biographyEN": "The Sultan of Babylon (811–814). Nobles"
  },
  {
    "key": "brunello_the_dwarf",
    "nameKO": "난쟁이 브루넬로",
    "nameEN": "Brunello the Dwarf",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "동방 카타이 제국에서 온 절세의 미모를 지닌 이국적인 공주입니다. 온 세상 남자들을 홀리는 마성의 미모(APP 30)와 마법을 무효화하고 투명화 상태로 만드는 영험한 마법 반지를 소유했습니다. 성기사 롤랑을 광증에 빠뜨린 장본인이자 동방 전설의 마법적 상징입니다.",
    "biographyEN": "A master-thief who steals Angelica’s magic ring, Sacripant’s horse, and Marfisa’s sword (775). He fails to kill Bradamant, who ties him to a tree. Brunello is liberated by Marfisa, but is then hanged by the Saracen Emir Agramant (776)."
  },
  {
    "key": "ferragut",
    "nameKO": "무어 거인 페라구",
    "nameEN": "Ferragut",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "무어 거인 페라구 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A courteous but stupid 무어인 giant, Emir 마르실 왕’s 조카, who is completely invulnerable to weapons (except at his navel) thanks to a 마법의 healing balm. He is 사망한 in a duel by Roland in 771.",
    "biographyEN": "A courteous but stupid Moorish giant, Emir Marsile’s nephew, who is completely invulnerable to weapons (except at his navel) thanks to a magic healing balm. He is killed in a duel by Roland in 771."
  },
  {
    "key": "lengoulaffre",
    "nameKO": "랭굴라프르 에미르",
    "nameEN": "Lengoulaffre",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "랭굴라프르 에미르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Sultan Bruhier’s 형제 is the W ali of Alexandria. He gets 사망한 in a duel with Carahue in 784.",
    "biographyEN": "Sultan Bruhier’s brother is the W ali of Alexandria. He gets killed in a duel with Carahue in 784."
  },
  {
    "key": "mandricard",
    "nameKO": "만드리카르드",
    "nameEN": "Mandricard",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알제의 자랑스러운 사라센 군주이자 전설의 이교도 에미르입니다. 비할 바 없는 강력한 완력과 오만한 성정을 지녔으나, 갈리시아의 이사벨라 공주를 불의로 죽게 한 후 깊이 뉘우쳤습니다. 그녀의 무덤 다리를 지키며 1년간 결투를 벌이다 장렬히 무력으로 전사했습니다.",
    "biographyEN": "Rodomont’s rival for the love of Princess Doralice."
  },
  {
    "key": "rodomont_of_algiers",
    "nameKO": "알제의 로도몽트",
    "nameEN": "Rodomont of Algiers",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "알제의 자랑스러운 사라센 군주이자 전설의 이교도 에미르입니다. 비할 바 없는 강력한 완력과 오만한 성정을 지녔으나, 갈리시아의 이사벨라 공주를 불의로 죽게 한 후 깊이 뉘우쳤습니다. 그녀의 무덤 다리를 지키며 1년간 결투를 벌이다 장렬히 무력으로 전사했습니다.",
    "biographyEN": "This extremely boastful, yet courteous, Emir of Algiers is the father of Galacienne (Rogero’s mother), and himself in love with Princess Doralice of Granada (who prefers Mandricard). Rodomont accidentally kills Princess Isabella of Galicia, for whom he builds a bridge and a tomb. In her memory, he defends the bridge leading to the funerary monument for an entire year. He is killed by Roland at Bradamant’s wedding (777)."
  },
  {
    "key": "yvorin_of_monbranc",
    "nameKO": "몽브랑의 이보랭",
    "nameEN": "Yvorin of Monbranc",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "몽브랑의 이보랭 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Sultan Gaudisso’s 형제. c o Nverts",
    "biographyEN": "Sultan Gaudisso’s brother. c o Nverts"
  },
  {
    "key": "iroldo",
    "nameKO": "이롤도",
    "nameEN": "Iroldo",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "이롤도 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Prasildo’s gallant companion, and Roland’s friend.",
    "biographyEN": "Prasildo’s gallant companion, and Roland’s friend."
  },
  {
    "key": "moisan",
    "nameKO": "모아상 에미르",
    "nameEN": "Moisan",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "모아상 에미르 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Emir of Jerusalem converts in 782, after having witnessed a miracle. His 딸 Clara demands 세례 and 혼인합니다 Ogier’s companion, W alter.",
    "biographyEN": "The Emir of Jerusalem converts in 782, after having witnessed a miracle. His daughter Clara demands baptism and marries Ogier’s companion, W alter."
  },
  {
    "key": "prasildo",
    "nameKO": "프라실도",
    "nameEN": "Prasildo",
    "category": "Foreigners",
    "subcategory": "🐫 페르시아 & 바빌론 (Persians)",
    "years": "",
    "biographyKO": "프라실도 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Roland’s friend, and Iroldo’s chivalrous companion.",
    "biographyEN": "Roland’s friend, and Iroldo’s chivalrous companion."
  },
  {
    "key": "abbio_and_wibrecht",
    "nameKO": "아비오와 위브레히트",
    "nameEN": "Abbio and Wibrecht",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "작센인들의 총사령관이자 '숲의 자식'으로 불린 위대한 샤먼 전사입니다. 보이지 않는 은신 마법과 야만 신앙을 부리며 기독교 프랑크 제국에 평생 가혹한 철혈 저항을 이끌었습니다. 785년 마침내 대제에게 굴복하여 기독교 세례를 받고 개종한 후 라이헤나우 수도원에서 생을 마감했습니다.",
    "biographyEN": "Widukind’s sons, who are forcibly baptized in their father’s company in 785."
  },
  {
    "key": "brun",
    "nameKO": "브룬",
    "nameEN": "Brun",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "브룬 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The chief of the Angarians.",
    "biographyEN": "The chief of the Angarians."
  },
  {
    "key": "cimosco",
    "nameKO": "시모스코",
    "nameEN": "Cimosco",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "시모스코 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The chief of the Frisians.",
    "biographyEN": "The chief of the Frisians."
  },
  {
    "key": "dyalas",
    "nameKO": "디알라스 기사",
    "nameEN": "Dyalas",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "작센인들의 총사령관이자 '숲의 자식'으로 불린 위대한 샤먼 전사입니다. 보이지 않는 은신 마법과 야만 신앙을 부리며 기독교 프랑크 제국에 평생 가혹한 철혈 저항을 이끌었습니다. 785년 마침내 대제에게 굴복하여 기독교 세례를 받고 개종한 후 라이헤나우 수도원에서 생을 마감했습니다.",
    "biographyEN": "Widukind’s third son is a chivalric knight who denies his Saxon heritage and demands to be baptized as “Widukind the Convert.” Charlemagne appoints him Duke of Saxony after Baldwin’s untimely death in 783."
  },
  {
    "key": "hessi",
    "nameKO": "헤시 백작",
    "nameEN": "Hessi",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "헤시 백작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The Eastphalian leader, who submits to 샤를마뉴 대제 in 775.",
    "biographyEN": "The Eastphalian leader, who submits to Charlemagne in 775."
  },
  {
    "key": "widukind",
    "nameKO": "샤먼 전사 위두킨트",
    "nameEN": "Widukind",
    "category": "Foreigners",
    "subcategory": "🌲 작센 & 프리시아 (Saxons & Frisians)",
    "years": "",
    "biographyKO": "작센인들의 총사령관이자 '숲의 자식'으로 불린 위대한 샤먼 전사입니다. 보이지 않는 은신 마법과 야만 신앙을 부리며 기독교 프랑크 제국에 평생 가혹한 철혈 저항을 이끌었습니다. 785년 마침내 대제에게 굴복하여 기독교 세례를 받고 개종한 후 라이헤나우 수도원에서 생을 마감했습니다.",
    "biographyEN": "His name means “child of the forest.” Widukind is the uncontested leader of the W estphalians, and later even of all rebel Saxons. He is a shamanic warrior who possesses the power of invisibility; a vengeful and cruel man. He is married to Lady Sebile, who is in love with Roland’s half-brother, Baldwin, whom she marries after having received baptism in 783. Widukind is allied with the Danes, with whom he relentlessly fights the hated Franks, until he is finally captured and baptized in 785. Widukind then becomes a monk at the Abbey of Reichenau until his death in 810."
  },
  {
    "key": "dragovit",
    "nameKO": "드라고비트 대공",
    "nameEN": "Dragovit",
    "category": "Foreigners",
    "subcategory": "🌲 슬라브 (Slavs)",
    "years": "",
    "biographyKO": "드라고비트 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 황자 of the Wilzi.",
    "biographyEN": "Prince of the Wilzi."
  },
  {
    "key": "godelaid",
    "nameKO": "고들라이드 대공",
    "nameEN": "Godelaid",
    "category": "Foreigners",
    "subcategory": "🌲 슬라브 (Slavs)",
    "years": "",
    "biographyKO": "고들라이드 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 황자, 아들 of Thrasico.",
    "biographyEN": "Prince, son of Thrasico."
  },
  {
    "key": "lecho",
    "nameKO": "레초 대공",
    "nameEN": "Lecho",
    "category": "Foreigners",
    "subcategory": "🌲 슬라브 (Slavs)",
    "years": "",
    "biographyKO": "레초 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 황자 of the Czechs.",
    "biographyEN": "Prince of the Czechs."
  },
  {
    "key": "miliduoch",
    "nameKO": "밀리두오크 대공",
    "nameEN": "Miliduoch",
    "category": "Foreigners",
    "subcategory": "🌲 슬라브 (Slavs)",
    "years": "",
    "biographyKO": "밀리두오크 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 황자 of the Serbs.",
    "biographyEN": "Prince of the Serbs."
  },
  {
    "key": "thrasico",
    "nameKO": "트라시코 대공",
    "nameEN": "Thrasico",
    "category": "Foreigners",
    "subcategory": "🌲 슬라브 (Slavs)",
    "years": "",
    "biographyKO": "트라시코 대공 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The last independent 국왕 of the Slavs. k iNgs of a sturias",
    "biographyEN": "The last independent King of the Slavs. k iNgs  of  a sturias"
  },
  {
    "key": "fruela_the_cruel",
    "nameKO": "잔혹왕 프루엘라",
    "nameEN": "Fruela the Cruel",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "잔혹왕 프루엘라 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 아스투리아스 until his 암살 (757–768).",
    "biographyEN": "King of Asturias until his assassination (757–768)."
  },
  {
    "key": "aurelio",
    "nameKO": "아우렐리오",
    "nameEN": "Aurelio",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "아우렐리오 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A good-hearted and generous 국왕 (768–774) who gains the throne upon the death of his 사촌. His rank is re-affirmed by 샤를마뉴 대제 in 771.",
    "biographyEN": "A good-hearted and generous king (768–774) who gains the throne upon the death of his cousin. His rank is re-affirmed by Charlemagne in 771."
  },
  {
    "key": "silo",
    "nameKO": "실로",
    "nameEN": "Silo",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "실로 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. An ambitious 국왕 (774–783) and a subtle diplomat.",
    "biographyEN": "An ambitious king (774–783) and a subtle diplomat."
  },
  {
    "key": "mauregato_the_usurper",
    "nameKO": "찬탈자 마우레가토",
    "nameEN": "Mauregato the Usurper",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "찬탈자 마우레가토 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 국왕 of 아스투리아스 (783–789). He is the evil, scheming, bastard 아들 of Alphonso I and a Saracen 후궁. He is 형제 to Fruela the Cruel.",
    "biographyEN": "King of Asturias (783–789). He is the evil, scheming, bastard son of Alphonso I and a Saracen concubine. He is brother to Fruela the Cruel."
  },
  {
    "key": "bermudo_the_deacon",
    "nameKO": "부제 베르무도",
    "nameEN": "Bermudo the Deacon",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "부제 베르무도 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A merciful and pious 국왕 (789– 791), who abdicates and retires to a 수도원.",
    "biographyEN": "A merciful and pious king (789– 791), who abdicates and retires to a monastery."
  },
  {
    "key": "alphonso_ii_the_chaste",
    "nameKO": "경건왕 알폰소 2세",
    "nameEN": "Alphonso II the Chaste",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "경건왕 알폰소 2세 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. An enlightened 국왕 (791–813), reputed to be chaste, generous, temperate, pious and valorous.",
    "biographyEN": "An enlightened king (791–813), reputed to be chaste, generous, temperate, pious and valorous."
  },
  {
    "key": "hugo_the_orphan",
    "nameKO": "외로운 위고",
    "nameEN": "Hugo the Orphan",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "외로운 위고 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. Raymond of St. Giles’ only 아들 혼인합니다 Alphonso’s 여성 후계자 Sorplante, and becomes the first Frankish 국왕 of 아스투리아스 in 813. o tHers",
    "biographyEN": "Raymond of St. Giles’ only son marries Alphonso’s heiress Sorplante, and becomes the first Frankish King of Asturias in 813. o tHers"
  },
  {
    "key": "beato_of_liebana",
    "nameKO": "리에바나의 베아토",
    "nameEN": "Beato of Liebana",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "리에바나의 베아토 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. A learned monk at the Asturian 궁정; strongly opposed to Adoptionism and an intimate friend of Alcuin.",
    "biographyEN": "A learned monk at the Asturian court; strongly opposed to Adoptionism and an intimate friend of Alcuin."
  },
  {
    "key": "bera",
    "nameKO": "베라 백작",
    "nameEN": "Bera",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "베라 백작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. The loyal and valorous 백작 of Carcassonne is made 백작 of Barcelona after its conquest in 801.",
    "biographyEN": "The loyal and valorous Count of Carcassonne is made Count of Barcelona after its conquest in 801."
  },
  {
    "key": "isabella_of_galicia",
    "nameKO": "갈리시아의 이사벨라 공주",
    "nameEN": "Isabella of Galicia",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "알제의 자랑스러운 사라센 군주이자 전설의 이교도 에미르입니다. 비할 바 없는 강력한 완력과 오만한 성정을 지녔으나, 갈리시아의 이사벨라 공주를 불의로 죽게 한 후 깊이 뉘우쳤습니다. 그녀의 무덤 다리를 지키며 1년간 결투를 벌이다 장렬히 무력으로 전사했습니다.",
    "biographyEN": "Duke Hamon’s romantic daughter, in love with Prince Zerbin of Scotland. She is slain by the cruel Rodomonte in 775."
  },
  {
    "key": "raymond",
    "nameKO": "레이몽 백작",
    "nameEN": "Raymond",
    "category": "Foreigners",
    "subcategory": "⛪ 비시고트 & 아스투리아스 (Visigoths & Asturias)",
    "years": "",
    "biographyKO": "레이몽 백작 경은 카롤링거 제국의 운명을 뒤흔든 주요 인물로, 원문에 따르면 다음과 같이 고증되어 있습니다. 공작 of Navarra (779–803).",
    "biographyEN": "Duke of Navarra (779–803)."
  }
];