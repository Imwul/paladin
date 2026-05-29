/**
 * Chronology data for the Paladin Companion (768 AD - 814 AD).
 * Key events are populated with proper noun translations following the "English(한글)" pattern.
 */
export const chronologyData = [
  {
    year: 768,
    title: "The Birth of a Reign (제국의 탄생)",
    summary: "King Pepin the Short(페팽) dies. The realm is divided between his sons Charlemagne(샤를마뉴) and Carloman(카를로망). Diss dissident nobles like Duke Waifer(와이페르) are suppressed in Aquitaine(아키텐).",
    details: "King Pepin(페팽)’s death creates a dual kingship. Charlemagne(샤를마뉴) rules the north and west from Noyon(누아용), while Carloman(카를로망) rules the south and east from Soissons(수아송). Tensions immediately simmer between the brothers as Waifer(와이페르)’s remaining loyalists stir trouble in Aquitaine(아키텐).",
    events: [
      { type: "War", text: "Aquitaine Campaign: Charlemagne(샤를마뉴) begins building the fortress of Fronsac(프롱삭) to pacify the rebellious Aquitainians(아키텐인)." },
      { type: "Court", text: "The brothers are crowned separately, showcasing the division in Frankish(프랑크) unity." }
    ]
  },
  {
    year: 769,
    title: "Aquitainian Rebellion (아키텐의 반란)",
    summary: "The old rebel Waifer(와이페르)'s father, Hunald II(위날드 2세), leads a final revolt in Aquitaine(아키텐). Charlemagne(샤를마뉴) marches south alone after Carloman(카를로망) refuses to help.",
    details: "Hunald II(위날드 2세) attempts to reclaim the duchy but finds little support. Charlemagne(샤를마뉴) hunts him down, forcing Lupo II(루포 2세), Duke of Gascony(가스코뉴), to surrender Hunald II(위날드 2세) and swear loyalty to the Frankish(프랑크) throne.",
    events: [
      { type: "War", text: "Solo campaign by Charlemagne(샤를마뉴) in Aquitaine(아키텐). Lupo II(루포 2세) yields the rebels." },
      { type: "Intrigue", text: "The rift between Charlemagne(샤를마뉴) and Carloman(카를로망) widens significantly due to Carloman(카를로망)'s refusal of military aid." }
    ]
  },
  {
    year: 770,
    title: "Lombard Matchmaking (롬바르드와의 정략결혼)",
    summary: "Queen Mother Bertrada(베르트라다) travels to Italy(이탈리아) and brokers an alliance. Charlemagne(샤를마뉴) marries Desiderata(데시데라타), daughter of King Desiderius(데시데리우스) of the Lombards(롬바르드).",
    details: "The marriage is meant to bring peace but angers Pope Stephen III(스테파노 3세), who fears Lombard(롬바르드) encirclement. The alliance is temporary and highly unstable.",
    events: [
      { type: "Court", text: "Charlemagne(샤를마뉴) marries Desiderata(데시데라타) in a grand court assembly." },
      { type: "Intrigue", text: "Gerberga(게르베르가) marries Carloman(카를로망) to balance the geopolitical scale." }
    ]
  },
  {
    year: 771,
    title: "Sole Ruler of the Franks (프랑크의 유일한 군주)",
    summary: "King Carloman(카를로망) dies unexpectedly. Charlemagne(샤를마뉴) acts swiftly to annex his brother’s lands, forcing Carloman(카를로망)’s widow Gerberga(게르베르가) to flee to Pavia(파비아).",
    details: "Carloman(카를로망) dies at Samoussy(사무시). Charlemagne(샤를마뉴) immediately gathers Carloman(카를로망)’s barons, including Abbot Fulrad(풀라드) and Count Bernard(베르나르), securing their oaths. Gerberga(게르베르가) flees to Italy(이탈리아) seeking refuge with King Desiderius(데시데리우스). Charlemagne(샤를마뉴) repudiates Desiderata(데시데라타) and marries Hildegard(힐데가르트) of Swabia(슈바벤).",
    events: [
      { type: "Court", text: "Charlemagne(샤를마뉴) crowned sole King of the Franks(프랑크) at Corbie(코르비)." },
      { type: "Intrigue", text: "Desiderata(데시데라타) is sent back to Lombardy(롬바르디아) in disgrace, triggering a blood feud." }
    ]
  },
  {
    year: 772,
    title: "The Saxon Wars Begin (작센 전쟁의 포문)",
    summary: "Charlemagne(샤를마뉴) launches a retaliatory campaign against the pagan Saxons(작센). The sacred pillar Irminsul(이르민술) is destroyed, sparking decades of blood-drenched warfare.",
    details: "Responding to Saxon(작센) raids on the church at Deventer(데벤터르), Charlemagne(샤를마뉴) leads the host to Eresburg(에레스부르크) and marches to the deep forests where the pagan Irminsul(이르민술) pillar stands. He destroys the idol and distributes its massive treasury of gold and silver to his knights.",
    events: [
      { type: "War", text: "Destruction of the Irminsul(이르민술). Eresburg(에레스부르크) falls to the Franks(프랑크)." },
      { type: "Lore", text: "Widukind(위두킨트) emerges as the fierce chieftain rallying the Westphalian(베스트팔렌) Saxons(작센)." }
    ]
  },
  {
    year: 773,
    title: "The Siege of Pavia (파비아 공성전)",
    summary: "Pope Hadrian I(하드리아노 1세) calls for aid. Charlemagne(샤를마뉴) invades Italy(이탈리아) to confront King Desiderius(데시데리우스), initiating the Siege of Pavia(파비아).",
    details: "Desiderius(데시데리우스) demands that the Pope crown Gerberga(게르베르가)’s sons as kings. Charlemagne(샤를마뉴) gathers his hosts at Geneva(제네바), crosses the Alps(알프스) via the Cenis(스니) pass, and breaks the Lombard(롬바르드) defenses at the Clusa(클루사). The main army lays siege to Pavia(파비아), while a detachment blockades Verona(베로나).",
    events: [
      { type: "War", text: "Lombard Campaign: Battle of the Clusa. Ogier the Dane(오지에) breaks out from the Lombard(롬바르드) ranks to return to Charlemagne(샤를마뉴)." },
      { type: "Intrigue", text: "Bradamant(브라다만테) is knighted at court after proving her immense valor in the skirmishes." }
    ]
  },
  {
    year: 774,
    title: "Lombardy Conquered (롬바르디아의 함락)",
    summary: "Pavia(파비아) falls. Desiderius(데시데리우스) is deposed. Charlemagne(샤를마뉴) crowns himself King of the Lombards(롬바르드), cementing Frankish(프랑크) dominance over Italy(이탈리아).",
    details: "During Easter, Charlemagne(샤를마뉴) visits Rome(로마) to confirm the Donation of Pepin. Pavia(파비아) surrenders due to plague. Desiderius(데시데리우스) is exiled to the monastery of Corbie(코르비). Charlemagne(샤를마뉴) assumes the iron crown. Saxons(작센) take advantage of his absence to recapture Eresburg(에레스부르크).",
    events: [
      { type: "Court", text: "Charlemagne(샤를마뉴) crowned King of the Lombards(롬바르드)." },
      { type: "War", text: "Saxon reprisal: The pagan Saxons(작센) burn the monastery at Fritzlar(프리츠라르)." }
    ]
  },
  {
    year: 775,
    title: "The Great Saxon Reprisal (작센의 재격돌)",
    summary: "Charlemagne(샤를마뉴) leads three columns into Saxony(작센), capturing Sigiburg(시기부르크) and Brunisberg(브루니스베르크). Widukind(위두킨트) mounts guerrilla defenses.",
    details: "The Frankish(프랑크) army marches into Eastphalia(오스트팔렌) and Engria(엔그리아). Though Charlemagne(샤를마뉴) achieves several tactical victories, Widukind(위두킨트)'s Westphalians(베스트팔렌인) launch devastating counter-ambushes, killing many Frankish(프랑크) rearguard knights.",
    events: [
      { type: "War", text: "Capture of Sigiburg(시기부르크). Widukind(위두킨트) wages a hit-and-run shadow war." },
      { type: "Lore", text: "The legendary events of Orlando Innamorato(올란도 인나모라토) commence, with Astolfo(아스톨포) and Renaud(르노) pursuing the exotic princess Angelica(안젤리카) in the Ardennes(아르덴) forest." }
    ]
  },
  {
    year: 776,
    title: "Rebellion in Friuli (프리울리의 반란)",
    summary: "Duke Hrodgaud(로드가우트) of Friuli(프리울리) rebels in Italy(이탈리아). Charlemagne(샤를마뉴) rushes south, kills the duke in battle, and installs Frankish(프랑크) counts.",
    details: "The Lombard(롬바르드) nobility attempts a coup while Charlemagne(샤를마뉴) is busy in the north. The lightning response of the Frankish(프랑크) king crushes the rebellion instantly. Hrodgaud(로드가우트) is slain, and cities like Treviso(트레비소) are heavily garrisoned.",
    events: [
      { type: "War", text: "Friuli Campaign: Siege and fall of Treviso(트레비소)." },
      { type: "Court", text: "Establishment of Frankish(프랑크) counts across Northern Italy(이탈리아) to secure the borders." }
    ]
  },
  {
    year: 777,
    title: "The Assembly of Paderborn (파더보른 의회)",
    summary: "A massive assembly is held in Saxony(작센). Many Saxons(작센) are baptized. Saracen(사라센) governors from Spain(스페인) arrive seeking an alliance against the Caliph of Cordoba(코르도바).",
    details: "At Paderborn(파더보른), Charlemagne(샤를마뉴) showcases the submission of Saxony(작센). Widukind(위두킨트), however, refuses to attend and flees to the court of King Sigfred(지그프리드) of Denmark(덴마크). Governors Sulaiman al-Arabi(술라이만 알 아라비) of Barcelona(바르셀로나) offer to yield their strongholds to Charlemagne(샤를마뉴) in exchange for protection.",
    events: [
      { type: "Court", text: "First imperial-style assembly in Saxony(작센) at Karlsburg(카를스부르크/파더보른)." },
      { type: "Intrigue", text: "Planning the Spanish Campaign. Roland(롤랑) advocates strongly for a holy crusade." }
    ]
  },
  {
    year: 778,
    title: "The Disaster of Roncevaux Pass (론세스바예스 전투)",
    summary: "The Spanish Expedition ends in tragedy. The army fails to capture Saragossa(사라고사). On the retreat, the Basque(바스크) tribes ambush the rearguard, killing Roland(롤랑) and many Paladins.",
    details: "Charlemagne(샤를마뉴) enters Spain(스페인) via the Pyrenees(피레네). Saragossa(사라고사) refuses to open its gates, and Suleiman(술레이만) is taken hostage but rescued by his sons. While retreating, Charlemagne(샤를마뉴) razes Pamplona(팜플로나) to secure the borders. In retaliation, the Basques(바스크인), joined by Saracens(사라센인), ambush the rearguard in the narrow Roncevaux Pass(론세스바예스). Count Roland(롤랑), Sir Oliver(올리비에), and Archbishop Turpin(튀르팽) perish in the epic battle.",
    events: [
      { type: "War", text: "Battle of Roncevaux Pass(론세스바예스): The legendary sacrifice of Roland(롤랑) and the blowing of the Olifant(올리판트) horn." },
      { type: "Lore", text: "Charlemagne(샤를마뉴) executes the traitor Ganelon(가늘롱) in Paris(파리) after a judicial duel fought by Thierry(티에리) and Pinabel(피나벨)." }
    ]
  },
  {
    year: 779,
    title: "Saxon Fire and Tears (작센의 불길)",
    summary: "Widukind(위두킨트) returns, burning settlements down to the Rhine(라인). Charlemagne(샤를마뉴) retaliates with utter ruthlessness, winning the battle of Bocholt(보홀트).",
    details: "With Roland(롤랑) gone, the Saxons(작센) sense weakness. Widukind(위두킨트) leads Westphalian(베스트팔렌) and Eastphalian(오스트팔렌) warbands. Charlemagne(샤를마뉴) defeats them at Bocholt(보홀트) and marches through Westphalia(베스트팔렌), securing hostages and demanding tribute.",
    events: [
      { type: "War", text: "Battle of Bocholt: A decisive Frankish(프랑크) victory against the Saxon(작센) coaliton." }
    ]
  },
  {
    year: 780,
    title: "The Consolidation of Borders (국경의 안정)",
    summary: "Charlemagne(샤를마뉴) organizes the administration of Saxony(작센) into missionary districts and crowns his young sons in Rome(로마) to secure succession.",
    details: "Charlemagne(샤를마뉴) establishes the Saxon(작센) capitulary, forbidding pagan practices under pain of death. He also arranges for Pope Hadrian(하드리아노) to crown Pepin(페팽) as King of Italy(이탈리아) and Louis(루이) as King of Aquitaine(아키텐).",
    events: [
      { type: "Court", text: "Coronation of Louis the Pious(경건왕 루이) and Pepin of Italy(이탈리아의 페팽) in Rome(로마)." },
      { type: "Lore", text: "Renaud de Montauban(르노) returns to court but faces bitter disputes over family holdings, ultimately leading to his self-imposed exile." }
    ]
  },
  {
    year: 782,
    title: "The Bloody Verdict of Verden (베르덴의 피빛 심판)",
    summary: "Widukind(위두킨트) crushes a Frankish(프랑크) force at Süntel(륀텔). In a rage, Charlemagne(샤를마뉴) executes 4,500 Saxon(작센) rebels at the Massacre of Verden(베르덴).",
    details: "While Charlemagne(샤를마뉴) is away, his generals are routed by Widukind(위두킨트) at the Süntel(쉬륀텔) hills. Enraged by the betrayal of the baptized Saxons(작센), Charlemagne(샤를마뉴) gathers the host at Verden(베르덴), demands the surrender of the rebel leaders, and orders the execution of 4,500 Saxon(작센) prisoners. Widukind(위두킨트) escapes back to Denmark(덴마크).",
    events: [
      { type: "War", text: "Battle of Süntel (Frankish defeat) and the subsequent Massacre of Verden(베르덴)." },
      { type: "Lore", text: "The Capitulatio de partibus Saxoniae is strictly enforced, banning pagan burials and feasts." }
    ]
  },
  {
    year: 785,
    title: "The Surrender of Widukind (위두킨트의 굴복)",
    summary: "Widukind(위두킨트) recognizes the futility of resistance. He surrenders at Attigny(아티니) and accepts Christian baptism, ending the first phase of the Saxon Wars.",
    details: "Charlemagne(샤를마뉴) wages winter campaigns, hunting Widukind(위두킨트) down. The chieftain agrees to negotiate. At Attigny(아티니), Widukind(위두킨트) and his brother-in-law Abbio(아비오) are baptized, with Charlemagne(샤를마뉴) serving as their godfather. A brief, blessed era of peace descends upon the empire.",
    events: [
      { type: "Court", text: "Baptism of Widukind(위두킨트) at Attigny(아티니). The Pope declares a universal feast of thanksgiving." }
    ]
  },
  {
    year: 788,
    title: "The Annexation of Bavaria (바이에른의 병합)",
    summary: "Duke Tassilo III(타실로 3세) of Bavaria(바이에른) is accused of treason and deposed. Bavaria(바이에른) is officially incorporated into the Frankish(프랑크) kingdom.",
    details: "Tassilo III(타실로 3세), a cousin of Charlemagne(샤를마뉴), is accused of breaking his oaths and conspiring with the pagan Avars(아바르). He is forced to abdicate at the assembly of Ingelheim(잉겔하임) and sent to a monastery. Bavaria(바이에른)’s independence is brought to an end.",
    events: [
      { type: "Intrigue", text: "Trial and deposition of Duke Tassilo III(타실로 3세) at Ingelheim(잉겔하임)." }
    ]
  },
  {
    year: 791,
    title: "The Campaign Against the Avars (아바르 원정)",
    summary: "Charlemagne(샤를마뉴) launches a massive three-pronged offensive against the nomadic Avars(아바르) along the Danube(다뉴브) river.",
    details: "The Avars(아바르), a powerful steppic horde, have raided borders for years. Charlemagne(샤를마뉴) leads the main Frankish(프랑크) host, while his son Pepin(페팽) invades from Italy(이탈리아). Disease decimates the Frankish(프랑크) horses, forcing a temporary retreat, but the Avar(아바르) defenses are critically breached.",
    events: [
      { type: "War", text: "Avar Crusade: Charlemagne(샤를마뉴) marches through the Enns(엔스) borderland." }
    ]
  },
  {
    year: 796,
    title: "The Looting of the Avar Ring (아바르 궁성의 약탈)",
    summary: "Margrave Eric of Friuli(에리크) and King Pepin(페팽) sack the great Avar Ring(아바르 링). The immense accumulated treasures of the steppes are brought to Aachen(아헨).",
    details: "An Avar(아바르) civil war weakens the horde. Eric of Friuli(에리크) leads the vanguard and penetrates the Avar Ring(아바르 링) - a giant circular series of fortifications. They capture the hoard. The gold, jewels, and silks are sent to Aachen(아헨) in fifteen massive wagons, forever altering the economy of Western Europe(유럽).",
    events: [
      { type: "War", text: "Sack of the Ring. The power of the Avar Khaganate(아바르 카간국) is broken forever." },
      { type: "Court", text: "Charlemagne(샤를마뉴) builds his permanent palace and Cathedral at Aachen(아헨)." }
    ]
  },
  {
    year: 800,
    title: "The Imperial Coronation (신성로마제국 황제 대관식)",
    summary: "On Christmas Day, Pope Leo III(레오 3세) crowns Charlemagne(샤를마뉴) as Holy Roman Emperor in St. Peter's Basilica(성베드로 성당) in Rome(로마).",
    details: "Having traveled to Rome(로마) to investigate and clear Pope Leo III(레오 3세) of false charges brought by roman conspirators, Charlemagne(샤를마뉴) attends Christmas mass. As he kneels before the altar, the Pope places the golden crown on his head. The crowd chants: 'To Charles, the most pious Augustus, crowned by God, great and peace-giving Emperor, life and victory!'",
    events: [
      { type: "Court", text: "Imperial Coronation of Charlemagne(샤를마뉴) in Rome(로마)." },
      { type: "Lore", text: "The legendary Order of Paladins(성기사단) reaches its zenith of prestige and glory." }
    ]
  },
  {
    year: 804,
    title: "The Final Saxon Peace (작센과의 최종 평화)",
    summary: "The Saxon Wars end. Charlemagne(샤를마뉴) signs the Treaty of Salz(살츠), finalizing terms and deporting the last stubborn Wigmodian(위그모디아) rebels.",
    details: "After 32 years of campaigns, the final treaty is signed. The Saxons(작센) are granted equal status under the law with the Franks(프랑크), provided they remain baptized Christians. Charlemagne(샤를마뉴) deports remaining dissident clans to the interior of the empire, replacing them with loyal Obotrite(오보트리트) allies.",
    events: [
      { type: "Court", text: "Treaty of Salz(살츠): Universal reconciliation between Saxon(작센) and Frankish(프랑크) lineages." }
    ]
  },
  {
    year: 810,
    title: "The Threat from the North (북방의 덴마크 위협)",
    summary: "King Godfred(고드프리드) of Denmark(덴마크) launches a giant fleet to attack the Frisian(프리지아) coast. Queen Luitgard(루이트가르트) and Charlemagne's legendary warhorse die.",
    details: "Godfred(고드프리드) builds the Danevirke(단네비르케) wall and challenges the Emperor. Charlemagne(샤를마뉴) prepares a massive expedition, but before a great battle takes place, Godfred(고드프리드) is assassinated by one of his own housecarls. The Danish threat recedes, but Charlemagne(샤를마뉴) mourns the loss of his wife Luitgard(루이트가르트) and his favorite warhorse.",
    events: [
      { type: "War", text: "Danish war mobilization. Mobilizing a fleet along the Elbe(엘베) river." }
    ]
  },
  {
    year: 814,
    title: "The Death of the Emperor (황제의 서거)",
    summary: "Emperor Charlemagne(샤를마뉴) dies of pleurisy at Aachen(아헨) at the age of 72. His son Louis the Pious(경건왕 루이) inherits the imperial crown.",
    details: "Charlemagne(샤를마뉴) falls ill in January after bathing. He is buried in the Palace Chapel of Aachen(아헨) on the very day of his death. A golden sun set over the Frankish Empire(프랑크 제국), but his legends, his code of honor, and the exploits of his paladins will live on for a thousand years.",
    events: [
      { type: "Court", text: "Burial of Charlemagne(샤를마뉴) in the Aachen Cathedral(아헨 대성당)." },
      { type: "Lore", text: "End of the legendary Companion. The lineage is passed to the sons." }
    ]
  }
];
