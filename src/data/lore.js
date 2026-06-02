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
    "fortificationsKO": "성곽을 짓지 않고 대신 높은 봉우리에 목조 망루(Watch Tower)를 조밀하게 세워 적의 침입 시 신속히 동굴로 대피합니다."
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
    "fortificationsKO": "강변의 통로를 거대 통나무 바리케이드로 봉쇄하는 게르슈(Guerche) 방벽 요새를 운용합니다."
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
    "fortificationsKO": "로마의 석조 성벽을 보강하여 사용하거나 언덕 위에 목조 모트-앤-베일리(Motte-and-Bailey) 성채를 건설하여 항전합니다."
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
    "fortificationsKO": "삼중으로 둘러쳐진 장엄한 석조 요새 성벽(테오도시우스 성벽)과 해자로 대도시 전체를 완벽히 통제합니다."
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
    "fortificationsKO": "국경선 전체를 진흙과 돌벽으로 방어하는 웅장한 40km 흙벽 요새인 다네비르케(Danevirke)를 사수합니다."
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
    "fortificationsKO": "프랑크식 언덕 성채를 그대로 도입하여 곳곳에 목조 초소를 세워 변방의 국경을 방어합니다."
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
    "fortificationsKO": "둥근 환상 철책 요새인 '아바르 링(Avar Ring)'을 구축하여 제국 전역의 황금을 비축하는 비밀 거점으로 썼습니다."
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
    "fortificationsKO": "성곽이 없으며 도시의 치안 판사 및 프랑크 수호 영주가 제공하는 공공 성벽 예하에서 보호받습니다."
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
    "fortificationsKO": "고대 로마의 장엄한 석조 방벽과 다층식 성탑 요새를 결합하여 난공불락의 강력한 성곽을 사수합니다."
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
    "fortificationsKO": "남부 에스파냐에 알카사르(Alcazar)라 불리는 웅장한 대리석 석조 요새와 기하학적 다각 성벽을 구축합니다."
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
    "fortificationsKO": "두터운 사막 흙벽과 대리석 방벽, 거대 쇠창살 문으로 무장한 삼중의 원형 요새 성벽을 지어 방어합니다."
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
    "fortificationsKO": "황제들이 건설한 거대 고대 벽돌 석조 요새인 '산탄젤로 성채(Castel Sant'Angelo)'를 최종 거점으로 사수합니다."
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
    "fortificationsKO": "산꼭대기에 거대 흙벽 요새를 세우고 참호를 삼중으로 파내려 간 '시그부르크(Sigiburg)' 식 요새 성채를 운용합니다."
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
    "fortificationsKO": "늪지대 한가운데에 고리 모양의 목조 요새인 '그라드(Grad)'를 건설하여 최종 대피소로 운용합니다."
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
    "fortificationsKO": "견고한 남부 석조 영지 성채와 방어용 벽돌 성탑 요새를 소유하여 영지를 안전하게 수호합니다."
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
    "fortificationsKO": "마법의 안개와 투명 주문으로 은폐되어 침입자들의 감각을 교란하는 공중 회전 성채를 소유합니다."
  }
];
