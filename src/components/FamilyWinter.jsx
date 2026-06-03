import React, { useState } from 'react';
import { Shield, Dices, RotateCcw, ChevronRight, ChevronLeft, Check, Award, Compass, Heart, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { greatFamilies } from '../data/lore';
import FamilyTree from './FamilyTree';

export default function FamilyWinter({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('family');
  const [winterStep, setWinterStep] = useState(1);
  const [logMessages, setLogMessages] = useState([]);

  // --- 구원 및 성인 판정 (Salvation & Canonization) 추가 상태 ---
  const [salvationDeedsPaladin, setSalvationDeedsPaladin] = useState(false);
  const [salvationDeedsHolyWar, setSalvationDeedsHolyWar] = useState(false);
  const [salvationPagans, setSalvationPagans] = useState(0);
  const [salvationCustomDeeds, setSalvationCustomDeeds] = useState(0);
  const [salvationManualD20, setSalvationManualD20] = useState('');
  const [salvationRollResult, setSalvationRollResult] = useState(null);
  const [blessingRollResult, setBlessingRollResult] = useState(null);
  
  // Interactive Step States
  const [agingD20, setAgingD20] = useState(null);
  const [agingLosses, setAgingLosses] = useState([]);
  const [agingApplied, setAgingApplied] = useState(false);

  const [harvestRoll, setHarvestRoll] = useState(null);
  const [harvestMult, setHarvestMult] = useState(null);
  const [harvestRevenue, setHarvestRevenue] = useState(null);
  const [harvestApplied, setHarvestApplied] = useState(false);

  const [squireSurvivalRoll, setSquireSurvivalRoll] = useState(null);
  const [squireStatus, setSquireStatus] = useState('');
  const [horseSurvivalRoll, setHorseSurvivalRoll] = useState(null);
  const [horseStatus, setHorseStatus] = useState('');
  const [survivalApplied, setSurvivalApplied] = useState(false);

  const [personalEventRoll, setPersonalEventRoll] = useState(null);
  const [personalEventText, setPersonalEventText] = useState(null);
  const [personalEventApplied, setPersonalEventApplied] = useState(false);

  const [marriageRoll, setMarriageRoll] = useState(null);
  const [marriageResult, setMarriageResult] = useState(null);
  const [childbirthRoll, setChildbirthRoll] = useState(null);
  const [childbirthResult, setChildbirthResult] = useState(null);
  const [familyEventRoll, setFamilyEventRoll] = useState(null);
  const [familyEventResult, setFamilyEventResult] = useState(null);
  const [familyApplied, setFamilyApplied] = useState(false);

  const [experienceLogs, setExperienceLogs] = useState([]);
  const [experienceApplied, setExperienceApplied] = useState(false);

  // Step 8 states
  const [trainingOption, setTrainingOption] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedTrait, setSelectedTrait] = useState('');
  const [selectedPassion, setSelectedPassion] = useState('');
  const [selectedStanding, setSelectedStanding] = useState('');
  
  // Option B: 4 skills
  const [selectedSkills, setSelectedSkills] = useState({ adventure: '', courtly: '', combat: '', free: '' });
  // Option C: 1 high skill
  const [selectedHighSkill, setSelectedHighSkill] = useState('');
  const [trainingApplied, setTrainingApplied] = useState(false);

  // 📜 조상 연대기 발전기 (Page 45-49) States
  const [isAncestorGenOpen, setIsAncestorGenOpen] = useState(false);
  const [ancestorRollLog, setAncestorRollLog] = useState([]);
  const [grandfatherGlory, setGrandfatherGlory] = useState(2500);
  const [grandfatherDeathYear, setGrandfatherDeathYear] = useState(747);
  const [grandfatherDeathCause, setGrandfatherDeathCause] = useState('노환');
  const [grandfatherHates, setGrandfatherHates] = useState({ saxons: 0, moors: 0 });
  
  const [fatherGlory, setFatherGlory] = useState(2500);
  const [fatherDeathYear, setFatherDeathYear] = useState(766);
  const [fatherDeathCause, setFatherDeathCause] = useState('작센 원정 중 용맹 전사');
  const [fatherHates, setFatherHates] = useState({ saxons: 0, moors: 0 });
  const [ancestorApplied, setAncestorApplied] = useState(false);
  const [showRefTables, setShowRefTables] = useState(false);
  const [showRefAging, setShowRefAging] = useState(false);
  const [showRefHarvest, setShowRefHarvest] = useState(false);
  const [showRefSurvival, setShowRefSurvival] = useState(false);
  const [showRefPersonal, setShowRefPersonal] = useState(false);
  const [showRefFamily, setShowRefFamily] = useState(false);
  const [showRefExperience, setShowRefExperience] = useState(false);

  // --- 신설: 인터랙티브 연대기용 추가 상태 ---
  const [chronicleMode, setChronicleMode] = useState('interactive'); // 'interactive' | 'auto'
  const [interactiveYear, setInteractiveYear] = useState(723);
  const [interactiveStage, setInteractiveStage] = useState('idle'); // 'idle' | 'gf_running' | 'gf_dead' | 'f_running' | 'f_dead' | 'completed'
  const [chronicleManualD20, setChronicleManualD20] = useState('');
  const [currentYearRolled, setCurrentYearRolled] = useState(false);
  const [currentYearResultText, setCurrentYearResultText] = useState('');
  const [fSkipYearsUntil, setFSkipYearsUntil] = useState(0);
  const [gfDead, setGfDead] = useState(false);
  const [fatherDead, setFatherDead] = useState(false);
  const [chronicleHistory, setChronicleHistory] = useState([]);
  const [chroniclePendingRoll, setChroniclePendingRoll] = useState(null);

  // 연도별 이벤트 매핑
  // 연도별 이벤트 매핑
  const ANCESTOR_EVENTS = {
    723: "작센(Saxony) 신성수 파괴 원정: 데시데리우스(Desiderius) 교회의 보호자이자 궁재 카롤루스 마르텔(Charles Martel)의 명에 따라, 헤센(Hesse) 지방 가이스마르(Geismar)의 토르 신성한 떡갈나무(Donar Oak)를 벌채하고 작센인(Saxons)들의 프리츨라(Fritzlar) 요새 인근 이교도 신성림(Holy Trees)들을 파괴하는 원정에 종군하였습니다.",
    724: "교황 그레고리오 2세(Gregory II)의 성유물 기증 및 제라르 경 탄생: 교황이 카롤루스 마르텔(Charles Martel)에게 성 베드로의 쇠사슬(Saint Peter's Chains)과 열쇠 성유물함(Shrine of Keys)을 기증하며 보호를 요청했습니다. 한편, 가문의 영광스러운 상속자이자 부친이 되실 제라르(Gerard) 경이 탄생하는 영광을 맞이했습니다.",
    725: "오툉(Autun) 포위전 결사 항전: 셉티마니아(Septimania)를 장악한 무어인(Moors)들의 대군이 님(Nîmes)과 카르카손(Carcassonne)을 차례로 함락하고, 론(Rhône) 강 계곡을 따라 북상하여 부르고뉴의 심장부 오툉(Autun)까지 약탈과 파괴를 자행하자 오툉 성채 수비대원으로서 결사 항전했습니다. 아키텐의 오도(Eudes) 공작이 무어인들과 밀약을 맺었다는 매수 소문이 흉흉히 돌았습니다.",
    726: "영지 방비와 평화기: 무어인들의 공세가 한 차례 꺾이고 기사단이 전열을 정비하는 동안, 겨울철 영지 순찰을 돌며 후방의 성벽과 참호를 보수하고 평온한 기사 의무를 완수했습니다.",
    727: "국경의 평화와 풍작: 제국 국경과 영지에 아무런 마찰이 없었던 한 해로, 봉토의 곡식 수확을 직접 감독하고 가문의 권세와 영지민들의 치안을 평화롭게 유지하였습니다.",
    728: "작센 정벌 및 아키텐 공작 제압 대원정: 카롤루스 마르텔(Charles Martel)이 북방 작센(Saxony)과 동프리지아(East Frisia)를 징벌하는 원정을 단행하고, 스페인의 이슬람 세력과 밀약을 맺어 프랑크 왕국으로부터 독립하려는 아키텐(Aquitaine)의 오도(Eudes) 공작을 무릎 꿇리기 위해 남북을 가르는 군사 작전에 참전했습니다.",
    729: "작센 바르벨 타워(Varbel Tower) 공방전: 가린 드 몽글란(Garin de Monglane) 공작과 두온 드 메양스(Doon de Mayence) 공작을 구출하고 도우려 작센인(Saxons)들의 굳건한 거점 요새인 바르벨(Varbel) 타워 인근 전장으로 출정하여 치열한 정벌전을 벌였습니다.",
    730: "무훈시 [고프레(Gaufrey)] 및 [오베리 드 부르고뉴(Auberi de Bourgogne)]의 대사건: 바르벨(Varbel) 타워에 갇혔던 프랑크 기사들이 플뢰르드핀(Fleurdepine) 공주의 지혜로 은밀한 지하 통로를 통해 탈출하고, 거인 로바스트르(Robastre)가 이교도 전사 글로리앙(Gloriant)을 처단했습니다. 또한 바이에른(Bavaria) 영토에서는 오베리(Auberi) 경이 아바르(Avars)족의 공습으로부터 영토를 완전 사수하였습니다.",
    731: "오리돈(Oridon) 공성전: 궁재 카롤루스 마르텔(Charles Martel)의 영에 따라, 배반자 람베르트(Lambert) 백작이 굳건히 수비하던 오리돈(Oridon) 성을 겹겹이 에워싸고 공성하여 반역도당을 소탕했습니다.",
    732: "역사적인 포아티에(Poitiers/투르) 전투: 안달루스(al-Andalus)의 아브드 알 라흐만(Abdul Rahman) 총독이 이끄는 사라센 무어인(Moors)들의 대규모 침공군에 맞서, 서유럽 기독교 세계의 운명을 걸고 카롤루스 마르텔(Charles Martel)과 아키텐의 오도(Eudes) 공작 연합군의 정예 기사로 평원에 집결하여 격전을 벌였습니다.",
    733: "무훈시 [도렐과 베통(Daurel and Beton)] 및 아키텐 상속: 브라반트(Brabant)의 보브(Boves) 백작이 프랑크 국왕의 누이인 에르멩가르드(Ermengard) 공주와 혼인했으나 질투에 눈먼 기(Guy) 백작의 음모가 도사렸습니다. [역사] 아키텐(Aquitaine)의 오도(Eudes) 공작이 서거하고 후놀트(Hunald)가 아키텐 공위를 상속받았습니다.",
    734: "기사도의 희망 베통(Beton) 탄생 및 종자 교육: [도렐과 베통]의 영웅 베통(Beton) 경이 탄생했습니다. [역사] 궁재 카롤루스 마르텔(Charles Martel)이 둘째 아들 단신왕 피핀(Pepin the Short)을 롬바르디아(Lombardy) 왕실 파비아(Pavia)로 보내 기사 훈련을 쌓게 했습니다.",
    735: "보르도(Bordeaux) 공성전 및 루시옹의 제라르 대결: 카롤루스 마르텔(Charles Martel)과 함께 아키텐의 보르도(Bordeaux)와 블라이(Blaye)를 공성하여 후놀트(Hunald) 공작의 항복을 받아내고, 루시옹(Roussillon)의 제라르(Gerard) 공작 세력을 압박하는 전투에 투입되었습니다.",
    736: "아를(Arles) 해방 포위 공성전: 이슬람 무어인(Moors) 세력과 손을 잡은 루시옹의 제라르(Gerard) 공작의 반역 세력을 격퇴하고, 사라센인들의 손에 떨어진 아를(Arles) 시를 구출해내기 위한 포위전 and 돌격전에 참전했습니다.",
    737: "아비뇽(Avignon) 공성전 및 반역 징벌전: 무어인들과 결탁해 프랑크 왕국을 배신한 서고트(Visigoth) 귀족들을 처벌하기 위해 아비뇽(Avignon) 성벽을 공성 병기로 부수고 돌입하였으며, 성내의 모든 반역 이교도들을 학살하고 도시를 초토화시켰습니다.",
    738: "부르고뉴(Burgundy) 무어 평정 및 보르들레(Bordelais) 습격전: 로렌(Lorraine) 가문을 지원하여 부르고뉴 지방 깊숙이 침입한 무어인 군세를 소탕하거나, 오랜 가문 복수의 화신인 보르들레(Bordelais) 세력의 거점을 소탕하는 야간 습격전에 나섰습니다.",
    739: "셉티마니아(Septimania) 사라센 축출전: 단신왕 피핀(Pepin the Short) and 롬바르디아 왕 리우트프란트(Liutprand)의 동맹군에 종군하여, 무어인(Moors)들의 남부 요새들을 포위 공성하고 협력자들의 영지를 몰수하는 전투에서 큰 무공을 세워 전리품을 배분받았습니다.",
    740: "로슈브룬(Rochebrune) 성곽 수호전과 덴마크 왕 정벌: 덴마크(Denmark)의 침략군에 맞서 나이모(Naimon) 대공의 사촌인 파스루즈(Passerose)가 농성하던 로슈브룬(Rochebrune) 성을 성공적으로 방어 및 탈환했습니다. 이후 할아버님(고드프루아 경)께서는 덴마크 본토까지 전격 돌입하여 덴마크 왕을 전사시키고 왕위를 찬탈한 영웅적 쾌거를 기록했습니다. 귀로에는 로바스트르(Robastre) 경이 이교도 거인 모리에(Morhier)를 결투 끝에 참수하며 거인들의 타워를 함락시켰습니다.",
    741: "궁재 카롤루스 마르텔(Charles Martel) 서거 및 안덴 장례식: 30여 년간 왕국을 지배한 공의 안덴(Andenne) 대성당 장례식에 참석하여 슬픔을 나누고, 유산을 분할받은 두 아들 카를로만(Carloman)과 피핀(Pepin)에 반기를 든 그리포(Grifo) 왕자의 반란군을 격퇴해 기사를 생포했습니다.",
    742: "쾰른 백작 두온 드 라 로슈(Doon de La Roche)의 성대한 왕실 혼례: 국왕 피핀(Pepin)의 아름다운 누이인 올리브(Olive) 공주와 충신 두온(Doon) 백작의 쾰른(Cologne) 대성당 결혼식에 공식 하객으로 참석하여 연회를 즐겼습니다.",
    743: "레겐스부르크(Regensburg) 대결전 및 삼면 평정 원정: 바이에른(Bavaria)을 영구 병합하기 위해 도나우 강변의 레겐스부르크(Regensburg)에서 오딜로(Odilo) 공작 군대를 격파하고, 아키텐의 반란군 및 북방 작센(Saxony) 이교도 국경지대를 불태우는 징벌 원정에 나섰습니다.",
    744: "조조부 고드프루아 경의 최후 원정과 은퇴: 왕실에 잠입한 아키텐 공작 후놀트(Hunald)의 간첩들을 적발해 참수하고, 왕국 국경을 침범한 작센인(Saxons)들을 토벌하여 영예로운 무공 훈장을 수여받으며 평생의 기사 현역을 매듭지었습니다.",

    745: "부친 제라르(Gerard) 경의 정식 혼례와 왕실 공인: 조부 고드프루아 경의 은퇴와 함께 기사 직위를 계승받고, 왕실과 가문의 번영을 다지기 위해 가문 간의 결합을 성취하여 영광의 기틀을 닦으셨습니다.",
    746: "롤랑 경 탄생 및 알레마니아 피의 의무: 가문의 미래이자 위대한 성기사가 될 롤랑 경이 탄생했습니다. [역사] 궁재 카를로만(Carloman)의 명에 따라 알레마니아(Alemannia) 반란 귀족들을 처단하는 냉혹한 작전에 종군하여 반역자들을 엄벌했습니다.",
    747: "롬바르디아 및 로마(Rome) 순례 동행: 세속의 명예를 내려놓고 롬바르디아(Lombardy)를 거쳐 몬테카시노(Monte Cassino) 수도원으로 귀의하려는 카를로만(Carloman) 공을 호위하며 성지 로마에 당도하여 엄숙한 면죄 성사를 받았습니다.",
    748: "무훈시 [라울 드 캉브레(Raoul de Cambrai)]의 속죄 순례 및 그리포 반란: 베르니에(Bernier)와 베아트릭스(Beatrix) 부부가 속죄 순례 도중 무어인의 기습을 받아 포로로 감금되는 시련을 겪었습니다. [역사] 왕국의 반역자 그리포(Grifo) 왕자가 바이에른(Bavaria)으로 탈출하였으며 타실로 3세(Tassilo III)가 바이에른 공작으로 취임했습니다.",
    749: "바이에른(Bavaria) 그리포 추격전: 바이에른으로 패주하여 아키텐 공작 바이에르(Waifer) 및 롬바르디아 국왕 아이스툴프(Aistulf)와 연대하려는 역도 그리포(Grifo) 왕자의 잔당을 토벌하기 위해 험난한 군사 작전에 종군했습니다.",
    750: "작센 대전투와 이교도 추장 저스타몽 격퇴: 뫼즈 강과 국경지대를 위협하며 작센의 이교 추장 저스타몽(Justamont)이 이끄는 이교도 군단에 맞서 피핀(Pepin) 국왕의 선봉장으로 대평원 벌판에서 뼈를 깎는 혈투를 벌여 이교도를 축출했습니다.",
    751: "역사적인 피핀 3세(Pepin III) 대관식 경비: 메로빙거 왕조의 무기력한 마지막 국왕 힐데리히 3세(Childeric III)의 폐위식과 피핀 3세(Pepin the Short) 국왕의 대관식 경비를 성대히 담당했습니다.",
    752: "무어 왕실 망명기 [마이네(Mainet)] 및 피핀 2세 공습: 독살 음모를 피해 톨레도(Toledo)로 피신한 젊은 샤를마뉴(마이네) 왕자가 갈라프레(Galafre)의 용병으로 뛰며 활약하고 갈리엔나(Galienne) 공주와의 숭고한 사랑을 얻었습니다. [역사] 남부 국경에 사라센 침공이 발생하고 샤를마뉴의 친동생 카를로만 2세(Carloman II)가 출생했습니다.",
    753: "비부르크(Wiburg) 산 대결전과 그리포 최후: 작센(Saxony)인들의 이교도 반역군에 대항해 피핀(Pepin) 국왕과 함께 친정하여 험준한 비부르크(Wiburg) 산맥에서 격렬한 산악전을 전개했습니다. (이 전투에서 힐데가르(Hildegar) 대주교가 전사하고, 도주하던 반역자 그리포 왕자가 사로잡혀 감옥에서 사망함)",
    754: "나르본(Narbonne) 탈환 공성전 및 알프스 돌파: 아이메리 드 나르본(Aymeri de Narbonne) 경을 도와 셉티마니아의 요충지 나르본(Narbonne) 시를 사라센인들의 억압으로부터 완전히 구출하기 위해 피비린내 나는 참호전과 성벽 격돌을 치렀습니다.",
    755: "무훈시 [리옹 드 부르주(Lion de Bourges)] 및 [오르송 드 보베(Orson de Beauvais)] 노래: 리옹(Lion) 경이 잃어버린 부모를 찾아 이탈리아 몬테로세(Monterose) 성을 공성했으며, 늙은 백작 오르송(Orson)이 예루살렘의 감옥에서 충직한 아들 밀로(Milo)의 결사 구출 작전으로 마침내 사법적 정의를 지켰습니다.",
    756: "롬바르디아 파비아(Pavia) 요새 대공성전: 교황령을 거듭 침범하는 롬바르디아 왕 아이스툴프(Aistulf)의 콧대를 꺾기 위해 파비아(Pavia) 성벽 아래에서 치열한 격전을 펼치며 롬바르디아의 항복을 받아내고 교황청 기증령(Donation of Pepin)의 토대를 닦았습니다.",
    757: "덴마크(Denmark) 수륙 양면 징벌 원정: 쾰른 백작 두온(Doon)과 피핀(Pepin) 국왕의 친정에 종군하여 북방의 호전적인 덴마크 바이킹 함대들을 격파하고 덴마크 왕으로부터 왕자 오지에(Ogier the Dane)를 인질로 인도받았습니다.",
    758: "작센(Saxony) 무자비한 보복 초토화 작전: 공약한 연 300필 군마 조공을 거부하고 무장 봉기한 작센 영토 깊숙이 침투하여 파괴와 거부 불허의 강제 기독교 개종을 동반한 대토벌전을 완수했습니다.",
    759: "무훈시 [로렌 사람들(Les Lorrains)] 복수극 및 셉티마니아 완전 수복: 멧돼지 사냥 중 가문 원수에게 암살당한 베고(Bego) 백작의 복수극으로 프랑크 영내가 피로 물들었습니다. [역사] 피핀(Pepin) 국왕이 마침내 사라센 무어인(Moors)들을 한 명도 남김없이 몰아내어 남방 셉티마니아(Septimania)를 완전히 탈환했습니다.",
    760: "아키텐(Aquitaine) 대원정 개막 및 리무쟁(Limousin) 공성: 아키텐 공작 와이페르(Waifer)의 독립 시도를 분쇄하기 위해 샤를마뉴 왕자 및 피핀 국왕의 선봉으로 아키텐 영내 리무쟁(Limousin) 성을 포위 공성하여 함락시켰습니다. 쾰른의 란드리(Landri) 경을 모시고 파리로 귀국하는 길을 보좌했습니다.",
    761: "부르주(Bourges) 성채 포위 공략: 아키텐 정벌의 노른자위 거점인 부르주(Bourges)와 리모주(Limoges) 시를 완전히 장악하기 위해 기사단의 사다리 돌격을 감행해 적의 철옹성 방어벽을 깨부수고 승리했습니다.",
    762: "아키텐(Aquitaine) 약탈 전초전 및 샤를마뉴 궁정: 아키텐의 잔당들을 압박하기 위해 국경지대 아르장통(Argenton)에 요새를 건설하고, 어린 롤랑의 대담한 당돌함을 왕실 연회에서 기쁨으로 나눴습니다.",
    763: "쾰른 라 로슈(La Roche) 성곽 결사 사수: 배반자 토밀(Tomile)과 말랭그(Malingre)가 이끄는 대반란군의 삼중 포위망 속에 갇혀, 본대 지원군이 도착하기 전까지 밤낮으로 성곽에서 저항하며 요새를 지켰습니다.",
    764: "라 로슈(La Roche) 탈환 공성전 및 툴루즈 함락: 오베리(Auberi) 주교의 복수군에 참전해 라 로슈 성을 맹렬히 격파해 탈환하고 쾰른(Cologne)을 수복하였으며, 아키텐 와이페르 공작의 수도 툴루즈(Toulouse)를 최종 점령했습니다.",
    765: "오트페이유(Hautefeuille) 포위 공성전 및 작센 족장 브로히막스 격파: 쾰른의 평화를 위협하는 작센 군대를 요격하기 위해 오트페이유 공성전에서 목숨을 건 격전을 벌였으며, 국왕 피핀을 납치하려는 작센의 악랄한 족장 브로히막스(Brohimax) 세력을 참수 토벌했습니다.",
    766: "몽펠리에(Montpellier) 및 에그르몽(Aigremont) 최후 대공성전: 부친 제라르 경의 영광스러운 현역 마지막 해로, 후계자 샤를마뉴 왕자 및 위비앙(Vivien)의 프랑크 성전 연합군에 합류해 몽펠리에와 이교도의 요새 에그르몽 성벽을 격파하여 최후의 기사도 불꽃을 피워냈습니다."
  };

  const isGapYear = (yr, stage) => {
    if (stage.startsWith('gf')) {
      return [724, 726, 727, 730, 733, 734].includes(yr);
    } else if (stage.startsWith('f')) {
      return [748, 752, 755, 759].includes(yr);
    }
    return false;
  };

  const saveChronicleHistory = () => {
    const snapshot = {
      interactiveYear,
      interactiveStage,
      grandfatherGlory,
      grandfatherDeathYear,
      grandfatherDeathCause,
      grandfatherHates: { ...grandfatherHates },
      fatherGlory,
      fatherDeathYear,
      fatherDeathCause,
      fatherHates: { ...fatherHates },
      gfDead,
      fatherDead,
      ancestorRollLog: [...ancestorRollLog],
      currentYearRolled,
      currentYearResultText,
      fSkipYearsUntil,
      chronicleManualD20,
      chroniclePendingRoll
    };
    setChronicleHistory(prev => [...prev, snapshot]);
  };

  const undoLastChronicleStep = () => {
    if (chronicleHistory.length === 0) return;
    const prev = chronicleHistory[chronicleHistory.length - 1];
    setChronicleHistory(hist => hist.slice(0, -1));
    setInteractiveYear(prev.interactiveYear);
    setInteractiveStage(prev.interactiveStage);
    setGrandfatherGlory(prev.grandfatherGlory);
    setGrandfatherDeathYear(prev.grandfatherDeathYear);
    setGrandfatherDeathCause(prev.grandfatherDeathCause);
    setGrandfatherHates(prev.grandfatherHates);
    setFatherGlory(prev.fatherGlory);
    setFatherDeathYear(prev.fatherDeathYear);
    setFatherDeathCause(prev.fatherDeathCause);
    setFatherHates(prev.fatherHates);
    setGfDead(prev.gfDead);
    setFatherDead(prev.fatherDead);
    setAncestorRollLog(prev.ancestorRollLog);
    setCurrentYearRolled(prev.currentYearRolled);
    setCurrentYearResultText(prev.currentYearResultText);
    setFSkipYearsUntil(prev.fSkipYearsUntil);
    setChronicleManualD20(prev.chronicleManualD20);
    setChroniclePendingRoll(prev.chroniclePendingRoll);
  };

  const handleGapYearInteractive = () => {
    saveChronicleHistory();
    const event = ANCESTOR_EVENTS[interactiveYear];
    const logMsg = `🏰 ${interactiveYear}년: [역사] ${event}\n  └ 📖 평온한 공백기: 무사히 한 해를 보냈습니다.`;
    setAncestorRollLog(prev => [...prev, logMsg]);
    setCurrentYearRolled(true);
    setCurrentYearResultText("🕊️ 역사적 평온기: 무사히 생존");
  };

  const startInteractiveChronicle = () => {
    setInteractiveStage('gf_running');
    setInteractiveYear(723);
    setGrandfatherGlory(2500);
    setGrandfatherDeathYear(null);
    setGrandfatherDeathCause('');
    setGrandfatherHates({ saxons: 0, moors: 0 });
    
    setFatherGlory(2500);
    setFatherDeathYear(null);
    setFatherDeathCause('');
    setFatherHates({ saxons: 0, moors: 0 });
    
    setChronicleManualD20('');
    setCurrentYearRolled(false);
    setCurrentYearResultText('');
    setFSkipYearsUntil(0);
    setAncestorRollLog(["📜 [인터랙티브 가문 연대기 시작 - 723년]"]);
    setAncestorApplied(false);
    setChronicleHistory([]);
    setGfDead(false);
    setFatherDead(false);
    setChroniclePendingRoll(null);
  };

  const rollSingleYearInteractive = () => {
    try {
      if (currentYearRolled) return;

      if (isGapYear(interactiveYear, interactiveStage)) {
        handleGapYearInteractive();
        return;
      }

      saveChronicleHistory();

      if (chroniclePendingRoll) {
        const pending = { ...chroniclePendingRoll };
        setChroniclePendingRoll(null);

        let d20 = parseInt(chronicleManualD20);
        if (isNaN(d20) || d20 < 1 || d20 > 20) {
          d20 = Math.floor(Math.random() * 20) + 1;
        }

        const rollD20 = () => Math.floor(Math.random() * 20) + 1;
        const rollD6 = () => Math.floor(Math.random() * 6) + 1;
        const rollD3 = () => Math.floor(Math.random() * 3) + 1;

        let logMsg = pending.logPrefix;
        let yearOutcomeText = "";

        if (pending.type === 'gf_combat_survival') {
          const runGfCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
            const rollVal = d20;
            const modifiedRoll = rollVal + battleModifier;
            let dead = false;
            let gloryGained = standardGlory * (isVictor ? 2 : 1);
            let cause = "";
            let rollDescText = "";

            if (modifiedRoll <= 0) {
              dead = true;
              gloryGained += 1000;
              cause = "전투 중 장렬한 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 1) {
              dead = true;
              cause = "전투 중 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 2) {
              dead = true;
              const retiredYears = rollD20();
              cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
              rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 3) {
              dead = true;
              cause = "포로 압송 및 실종 (Captured)";
              rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll <= 5) {
              gloryGained += 100;
              rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
            } else {
              rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
            }

            return { dead, gloryGained, cause, rollDescText };
          };

          const res = runGfCombatSurvival(pending.eventName, pending.battleModifier, pending.isVictor, pending.standardGlory);
          logMsg += res.rollDescText;

          if (res.dead) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause(res.cause);
            setInteractiveStage('gf_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            setGrandfatherGlory(prev => prev + res.gloryGained);
            if (pending.hateEnemy) {
              const hVal = rollD3();
              if (pending.hateEnemy === 'saxons') setGrandfatherHates(prev => ({ ...prev, saxons: prev.saxons + hVal }));
              else if (pending.hateEnemy === 'moors') setGrandfatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
              logMsg += `\n  └ [증오 획득] ${pending.hateEnemy === 'saxons' ? '작센인' : '무어인'}에 대한 증오 +${hVal}`;
              yearOutcomeText = `${pending.hateEnemy === 'saxons' ? '작센' : '무어'} 전투 생존 및 증오 +${hVal} 획득 (+${res.gloryGained} Glory)`;
            } else {
              yearOutcomeText = `전투 생존 완료 (+${res.gloryGained} Glory)`;
            }

            if (pending.customOutcome === 'cruel_trait') {
              logMsg += "\n  └ [기질 획득] 배신자들에 대한 복수심으로 가득 차 무자비함(Cruel) 1d6 기질 획득!";
              yearOutcomeText = `아비뇽 징벌 공방전 승리 및 복수 기질 획득 (+${res.gloryGained} Glory)`;
            } else if (pending.customOutcome === 'birth_gift') {
              logMsg += "\n  └ [왕실의 선물] 수복 공헌을 기려 마르텔 공으로부터 프랑크 탄생 선물을 받았습니다! (Frankish Birth Gift 획득!)";
              yearOutcomeText = "셉티마니아 대승리 및 왕실 하사품(Birth Gift) 획득 (+${res.gloryGained} Glory)";
            } else if (pending.customOutcome === 'danes_hate') {
              logMsg += "\n  └ [새로운 위협] 평생 처음 마주한 덴마크인들에 대해 엄청난 분노(Hate Danes 1d6)를 품었습니다!";
              yearOutcomeText = "덴마크 성벽 사수 및 덴마크 증오 획득 (+${res.gloryGained} Glory)";
            }
          }
        } 
        else if (pending.type === 'gf_raid_survival') {
          let sDead = false;
          let sGlory = 25;
          let sCause = "";
          let sLog = "";

          if (d20 === 1) {
            sDead = true;
            sCause = `${pending.enemyName} 습격 방어 중 전사`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
          } else if (d20 === 2) {
            sDead = true;
            const retiredYears = rollD20();
            sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
          } else if (d20 === 3) {
            sDead = true;
            sCause = `포로 압송 및 실종`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
          } else if (d20 <= 5) {
            sGlory += 100;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
          } else {
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
          }

          const hVal = rollD3();
          setGrandfatherGlory(prev => prev + sGlory);
          if (sDead) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause(sCause);
            setInteractiveStage('gf_dead');
            yearOutcomeText = `사망: ${sCause}`;
          } else {
            if (pending.enemyName === "Saxons") setGrandfatherHates(prev => ({ ...prev, saxons: prev.saxons + hVal }));
            else setGrandfatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
            sLog += ` (이교도 증오 +${hVal} 획득)`;
            yearOutcomeText = `평화로운 국경 방어 성공 (+${sGlory} Glory)`;
          }
          logMsg += "\n" + sLog;
        }
        else if (pending.type === 'gf_poitiers') {
          if (d20 === 1) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("Poitiers 전사 (Combat)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 1400);
            logMsg += `🗡️ 포아티에 주사위 ${d20} - 전설적인 전공을 기사단에 남기며 장렬히 전사하셨습니다! (+1400 Glory)`;
            yearOutcomeText = "전사: 포아티에 전투 장렬한 전사 (+1400 Glory)";
          } else if (d20 <= 11) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("Poitiers 전사 (Combat)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 400);
            logMsg += `🗡️ 포아티에 주사위 ${d20} - 전투 중 영예롭게 전사하셨습니다. (+400 Glory)`;
            yearOutcomeText = "전사: 포아티에 격전 중 전사 (+400 Glory)";
          } else if (d20 === 12) {
            setGfDead(true);
            setGrandfatherDeathYear(pending.yr);
            setGrandfatherDeathCause("스페인 압송 포로 (Captured)");
            setInteractiveStage('gf_dead');
            setGrandfatherGlory(prev => prev + 400);
            logMsg += `🔗 포아티에 주사위 ${d20} - 포로로 잡혀 무어인의 땅(스페인)으로 압송되어 소식이 끊겼습니다. (+400 Glory)`;
            yearOutcomeText = "포로: 무어인 땅으로 압송 실종 (+400 Glory)";
          } else if (d20 === 13) {
            setGrandfatherGlory(prev => prev + 500);
            const hVal = rollD3();
            setGrandfatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
            logMsg += `✨ 포아티에 주사위 ${d20} - 적진을 돌파하는 영웅적 전공을 세우며 전리품을 획득했습니다! (+500 Glory, 무어인 증오 +${hVal})`;
            yearOutcomeText = `영웅: 포아티에 돌격 전공 획득 (+500 Glory, 무어 증오 +${hVal})`;
          } else if (d20 <= 19) {
            setGrandfatherGlory(prev => prev + 400);
            const hVal = rollD3();
            setGrandfatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
            logMsg += `🛡️ 포아티에 주사위 ${d20} - 무사히 생존하여 대승리에 공헌했습니다. (+400 Glory, 무어인 증오 +${hVal})`;
            yearOutcomeText = `승전: 투르-포아티에 승전 생존 (+400 Glory, 무어 증오 +${hVal})`;
          } else {
            setGrandfatherGlory(prev => prev + 900);
            const hVal = rollD3();
            setGrandfatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
            logMsg += `👑 포아티에 주사위 ${d20} - 전장 한가운데서 침공 사령관 에미르 압둘 라흐만을 결투로 베는 불멸의 업적을 세우셨습니다! (+900 Glory, 무어인 증오 +${hVal})`;
            yearOutcomeText = `👑 불멸의 무공: 적장 압둘 라흐만 결투 처단 (+900 Glory, 무어 증오 +${hVal})`;
          }
        }
        else if (pending.type === 'f_combat_survival') {
          const runFCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
            const rollVal = d20;
            const modifiedRoll = rollVal + battleModifier;
            let dead = false;
            let gloryGained = standardGlory * (isVictor ? 2 : 1);
            let cause = "";
            let rollDescText = "";

            if (modifiedRoll <= 0) {
              dead = true;
              gloryGained += 1000;
              cause = "전투 중 장렬한 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 1) {
              dead = true;
              cause = "전투 중 전사 (Combat)";
              rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 2) {
              dead = true;
              const retiredYears = rollD20();
              cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
              rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll === 3) {
              dead = true;
              cause = "포로 압송 및 실종 (Captured)";
              rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
            } else if (modifiedRoll <= 5) {
              gloryGained += 100;
              rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
            } else {
              rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
            }

            return { dead, gloryGained, cause, rollDescText };
          };

          const res = runFCombatSurvival(pending.eventName, pending.battleModifier, pending.isVictor, pending.standardGlory);
          logMsg += res.rollDescText;

          if (res.dead) {
            setFatherDead(true);
            setFatherDeathYear(pending.yr);
            setFatherDeathCause(res.cause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${res.cause}`;
          } else {
            setFatherGlory(prev => prev + res.gloryGained);
            if (pending.hateEnemy) {
              const hVal = rollD3();
              if (pending.hateEnemy === 'saxons') setFatherHates(prev => ({ ...prev, saxons: prev.saxons + hVal }));
              else if (pending.hateEnemy === 'moors') setFatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
              else if (pending.hateEnemy === 'danes') setFatherHates(prev => ({ ...prev, danes: (prev.danes || 0) + hVal }));
              logMsg += `\n  └ [증오 획득] ${pending.hateEnemy === 'saxons' ? '작센인' : pending.hateEnemy === 'moors' ? '무어인' : '덴마크 바이킹'}에 대한 증오 +${hVal}`;
              yearOutcomeText = `${pending.hateEnemy === 'saxons' ? '작센' : pending.hateEnemy === 'moors' ? '무어' : '바이킹'} 전투 생존 및 증오 +${hVal} (+${res.gloryGained} Glory)`;
            } else {
              yearOutcomeText = `전투 생존 완료 (+${res.gloryGained} Glory)`;
            }

            if (pending.customOutcome === 'saxons_hate_d6') {
              const hVal = rollD6();
              setFatherHates(prev => ({ ...prev, saxons: prev.saxons + hVal }));
              logMsg += `\n  └ [증오 획득] 작센인에 대한 극심한 증오 +${hVal}`;
              yearOutcomeText = `작센 격전 생존 및 극심한 증오 +${hVal} (+${res.gloryGained} Glory)`;
            } else if (pending.customOutcome === 'viviens_baptism') {
              setFatherGlory(prev => prev + 25);
              logMsg += `\n  └ ⛪ 이교도 귀족 위비앙 부부의 역사적인 기독교 세례 성사에서 가문의 명예 하객 대열을 호위하셨습니다! (+25 Glory)`;
              yearOutcomeText = `위비앙 세례식 가문 호위 및 대성당 참석 (+75 Glory)`;
            }
          }
        }
        else if (pending.type === 'f_raid_survival') {
          let sDead = false;
          let sGlory = 25;
          let sCause = "";
          let sLog = "";

          if (d20 === 1) {
            sDead = true;
            sCause = `${pending.enemyName} 습격 방어 중 전사`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
          } else if (d20 === 2) {
            sDead = true;
            const retiredYears = rollD20();
            sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
          } else if (d20 === 3) {
            sDead = true;
            sCause = `포로 압송 및 실종`;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
          } else if (d20 <= 5) {
            sGlory += 100;
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
          } else {
            sLog = `    └ [습격 수비전 주사위 ${d20}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
          }

          const hVal = rollD3();
          setFatherGlory(prev => prev + sGlory);
          if (sDead) {
            setFatherDead(true);
            setFatherDeathYear(pending.yr);
            setFatherDeathCause(sCause);
            setInteractiveStage('f_dead');
            yearOutcomeText = `사망: ${sCause}`;
          } else {
            if (pending.enemyName === "Saxons") setFatherHates(prev => ({ ...prev, saxons: prev.saxons + hVal }));
            else if (pending.enemyName === "Moors") setFatherHates(prev => ({ ...prev, moors: prev.moors + hVal }));
            else setFatherHates(prev => ({ ...prev, danes: (prev.danes || 0) + hVal }));
            sLog += ` (이교도 증오 +${hVal} 획득)`;
            yearOutcomeText = `평화로운 국경 방어 성공 (+${sGlory} Glory)`;
          }
          logMsg += "\n" + sLog;
        }

        setAncestorRollLog(prev => [...prev, logMsg]);
        setCurrentYearRolled(true);
        setCurrentYearResultText(yearOutcomeText);
        setChronicleManualD20('');
        return;
      }

      let d20 = parseInt(chronicleManualD20);
      if (isNaN(d20) || d20 < 1 || d20 > 20) {
        d20 = Math.floor(Math.random() * 20) + 1;
      }

      const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    const rollD6 = () => Math.floor(Math.random() * 6) + 1;
    const rollD3 = () => Math.floor(Math.random() * 3) + 1;

    let logMsg = "";
    let yearOutcomeText = "";
    const yr = interactiveYear;

    if (interactiveStage === 'gf_running') {
      const runGfCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
        const rollVal = (secondManualD20 !== undefined) ? secondManualD20 : rollD20();
        const modifiedRoll = rollVal + battleModifier;
        let dead = false;
        let gloryGained = standardGlory * (isVictor ? 2 : 1);
        let cause = "";
        let rollDescText = "";

        if (modifiedRoll <= 0) {
          dead = true;
          gloryGained += 1000;
          cause = "전투 중 장렬한 전사 (Combat)";
          rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 1) {
          dead = true;
          cause = "전투 중 전사 (Combat)";
          rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 2) {
          dead = true;
          const retiredYears = rollD20();
          cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
          rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 3) {
          dead = true;
          cause = "포로 압송 및 실종 (Captured)";
          rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll <= 5) {
          gloryGained += 100;
          rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
        } else {
          rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
        }

        return { dead, gloryGained, cause, rollDescText };
      };

      const runGfOrdinaryYear = (eventDescription, enemyName = "Saxons") => {
        let gloryGained = 0;
        let dead = false;
        let cause = "";
        let rollDescText = "";

        if (d20 === 1) {
          dead = true;
          cause = "예기치 못한 급사 (Ordinary Year Death)";
          rollDescText = `💀 [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
        } else if (d20 <= 17) {
          rollDescText = `🏰 [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
        } else if (d20 <= 19) {
          gloryGained = 50;
          rollDescText = `✨ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
        } else {
          return { isRaidPending: true };
        }

        return { dead, gloryGained, cause, rollDescText };
      };

      const event = ANCESTOR_EVENTS[yr];
      if (yr === 723) {
        if (d20 <= 10) {
          logMsg = `🏰 723년: [역사] ${event}\n  └ [주사위 ${d20}] - 후방 수비대(Garrison) 의무를 안전하게 수행했습니다.`;
          yearOutcomeText = "후방 수비대 의무 완수 (무사 생존)";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 723,
            firstRoll: d20,
            logPrefix: `🏰 723년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 습격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 724) {
        const res = runGfOrdinaryYear(event, "Saxons");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'gf_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 ${yr}년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 작센 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Saxons'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 724년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setGrandfatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause(res.cause);
          setInteractiveStage('gf_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `평화로운 국경 방어 성공 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 725) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("질병사 (Illness)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 725년: [역사] ${event}\n  └ 💀 행군 도중 돌발적인 질병으로 급거 서거하셨습니다.`;
          yearOutcomeText = "사망: 질병사";
        } else if (d20 <= 10) {
          logMsg = `🏰 725년: [역사] ${event}\n  └ 후방 성채 경계 근무를 수행했습니다.`;
          yearOutcomeText = "후방 성채 수비 완료";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 725,
            firstRoll: d20,
            logPrefix: `🏰 725년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오툉 포위 공방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: false,
            standardGlory: 50,
            hateEnemy: 'moors'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 726 || yr === 727) {
        const res = runGfOrdinaryYear(event, "Saxons");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'gf_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 ${yr}년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 작센 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Saxons'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setGrandfatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause(res.cause);
          setInteractiveStage('gf_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `봉토 관리 및 순찰 완료 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 728) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("사고 (Accident)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 728년: [역사] ${event}\n  └ 💀 불의의 마차 낙마 사고로 서거하셨습니다.`;
          yearOutcomeText = "사망: 낙마 사고";
        } else if (d20 <= 10) {
          logMsg = `🏰 728년: [역사] ${event}\n  └ 후방 영지 보급 호위를 전담했습니다.`;
          yearOutcomeText = "보급 호위 의무 완수";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 728,
            firstRoll: d20,
            logPrefix: `🏰 728년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 결전(오도 공작 응징전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 728,
            firstRoll: d20,
            logPrefix: `🏰 728년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 북방 작센 대공세에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 729) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("사냥 사고 (Hunting Accident)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 729년: [역사] ${event}\n  └ 💀 사냥 중 멧돼지의 기습을 받아 서거하셨습니다.`;
          yearOutcomeText = "사망: 멧돼지 습격 사고";
        } else if (d20 <= 10) {
          logMsg = `🏰 729년: [역사] ${event}\n  └ 성벽 경계 및 보초 근무를 수행했습니다.`;
          yearOutcomeText = "성벽 경계 근무 완수";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 729,
            firstRoll: d20,
            logPrefix: `🏰 729년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - Vauclere 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: false,
            standardGlory: 100,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 729,
            firstRoll: d20,
            logPrefix: `🏰 729년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - Barbel Tower 공방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 730) {
        const res = runGfOrdinaryYear(event, "Saxons");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'gf_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 ${yr}년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 작센 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Saxons'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 730년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setGrandfatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause(res.cause);
          setInteractiveStage('gf_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `국경 평화 경호 및 역사 무훈 사수 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 731) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("질병사 (Illness)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 731년: [역사] ${event}\n  └ 💀 군영 내 전염병으로 돌연 서거하셨습니다.`;
          yearOutcomeText = "사망: 군영 전염병";
        } else if (d20 <= 15) {
          logMsg = `🏰 731년: [역사] ${event}\n  └ 후방 수비대 임무를 마쳤습니다.`;
          yearOutcomeText = "수비대 복무 완료";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 731,
            firstRoll: d20,
            logPrefix: `🏰 731년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오리돈 포위 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 732) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("낙사 (Accident)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 732년: [역사] ${event}\n  └ 💀 전투 직전 말에서 떨어져 서거하셨습니다.`;
          yearOutcomeText = "사망: 낙마사";
        } else if (d20 <= 5) {
          logMsg = `🏰 732년: [역사] ${event}\n  └ 기사단 후방 보급을 호위했습니다.`;
          yearOutcomeText = "보급 호위 완료 (전투 불참)";
        } else {
          setChroniclePendingRoll({
            type: 'gf_poitiers',
            yr: 732,
            firstRoll: d20,
            logPrefix: `🏰 732년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 투르-포아티에 역사적 대전투에 참전합니다. 생존 판정이 필요합니다.\n`
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 733 || yr === 734) {
        const res = runGfOrdinaryYear(event, "Moors");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'gf_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 ${yr}년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Moors'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 ${yr}년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setGrandfatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause(res.cause);
          setInteractiveStage('gf_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `제국 왕실 후계 및 종자 영입 지원 완료 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 735) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("사망 (Feud)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 735년: [역사] ${event}\n  └ 💀 가문 불화 결투 도중 서거하셨습니다.`;
          yearOutcomeText = "사망: 가문 불화 결투 사망";
        } else if (d20 <= 5) {
          logMsg = `🏰 735년: [역사] ${event}\n  └ 쾰른 경비 의무를 마쳤습니다.`;
          yearOutcomeText = "쾰른 성벽 경비";
        } else if (d20 <= 12) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 735,
            firstRoll: d20,
            logPrefix: `🏰 735년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 루시옹 대결전(제라르 공작 결투전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 15) {
          logMsg = `🏰 735년: [역사] ${event}\n  └ ⚖️ 위옹 경의 아모르 스캔들 재판에서 위증을 강요받아 정직함이 무너집니다. (Just 수치 하락)`;
          yearOutcomeText = "사법 재판 명예 실추 (Just 타격)";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 735,
            firstRoll: d20,
            logPrefix: `🏰 735년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 보르도 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 736) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("질병사 (Illness)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 736년: [역사] ${event}\n  └ 💀 진중의 무서운 열병으로 서거하셨습니다.`;
          yearOutcomeText = "사망: 진중 열병";
        } else if (d20 <= 5) {
          logMsg = `🏰 736년: [역사] ${event}\n  └ 기사단 초소 근무를 섰습니다.`;
          yearOutcomeText = "초소 근무 복무";
        } else if (d20 <= 10) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 736,
            firstRoll: d20,
            logPrefix: `🏰 736년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 제라르군 매복 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: false,
            standardGlory: 100,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 736,
            firstRoll: d20,
            logPrefix: `🏰 736년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아를 해방전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: 'moors'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 737) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("사고 (Accident)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 737년: [역사] ${event}\n  └ 💀 성벽 수축 공사 도중 돌에 깔려 서거하셨습니다.`;
          yearOutcomeText = "사망: 돌 압사";
        } else if (d20 <= 5) {
          logMsg = `🏰 737년: [역사] ${event}\n  └ 영지 가드 근무를 섰습니다.`;
          yearOutcomeText = "영지 가드 순찰";
        } else if (d20 <= 10) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 737,
            firstRoll: d20,
            logPrefix: `🏰 737년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 제라르 반란 잔당전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: false,
            standardGlory: 100,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 737,
            firstRoll: d20,
            logPrefix: `🏰 737년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아비뇽 대참화(징벌 공방전)에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: null,
            customOutcome: 'cruel_trait'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 738) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("사망 (Feud)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 738년: [역사] ${event}\n  └ 💀 라이벌 가문의 자객에게 급습받아 서거하셨습니다.`;
          yearOutcomeText = "사망: 자객 습격 사망";
        } else if (d20 <= 10) {
          logMsg = `🏰 738년: [역사] ${event}\n  └ 쾰른 성 수비대에 소집되었습니다.`;
          yearOutcomeText = "쾰른 성벽 경계근무";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 738,
            firstRoll: d20,
            logPrefix: `🏰 738년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 부르고뉴 무어인전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: 'moors'
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 738,
            firstRoll: d20,
            logPrefix: `🏰 738년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 보르들레 보복 습격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 739) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("행방불명 (Disappeared)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 739년: [역사] ${event}\n  └ 💀 원정길의 수풀 속에서 실종되시어 돌아오지 못했습니다.`;
          yearOutcomeText = "실종: 셉티마니아 숲 속 행방불명";
        } else if (d20 <= 5) {
          logMsg = `🏰 739년: [역사] ${event}\n  └ 후방 수비 의무를 원활하게 수행했습니다.`;
          yearOutcomeText = "후방 지원 완수";
        } else if (d20 <= 10) {
          setGrandfatherGlory(prev => prev + 50);
          logMsg = `🏰 739년: [역사] ${event}\n  └ 🛡️ 실패로 끝난 아를 포위전에서 힘겹게 목숨을 건졌습니다. (+50 Glory)`;
          yearOutcomeText = "아를 패전 극적 퇴각 성공 (+50 Glory)";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 739,
            firstRoll: d20,
            logPrefix: `🏰 739년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 셉티마니아 대공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: null,
            customOutcome: 'birth_gift'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 740) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("덴마크 전사 (Combat)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 740년: [역사] ${event}\n  └ 💀 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`;
          yearOutcomeText = "전사: 바이킹 상륙 전함 백병전 사망";
        } else if (d20 <= 10) {
          logMsg = `🏰 740년: [역사] ${event}\n  └ 후방 성벽을 지켰습니다.`;
          yearOutcomeText = "로슈브룬 후방 방어";
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 740,
            firstRoll: d20,
            logPrefix: `🏰 740년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 덴마크인 습격 방어전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: 'danes',
            customOutcome: 'danes_hate'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 741) {
        logMsg = `🏰 741년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("질병사 (Illness)");
          setInteractiveStage('gf_dead');
          logMsg += `💀 주군 카롤루스 마르텔의 부고를 듣고 상심 속에 병사하셨습니다.`;
          yearOutcomeText = "사망: 주군 서거 상심에 병사";
        } else if (d20 <= 5) {
          logMsg += `쾰른에서 애도 기간을 가졌습니다.`;
          yearOutcomeText = "쾰른 애도 복무";
        } else if (d20 <= 10) {
          setGrandfatherGlory(prev => prev + 50);
          logMsg += `🛡️ 반역 왕자의 병력을 기습해 체포에 일조했습니다! (+50 Glory)`;
          yearOutcomeText = "그리포 진압 공헌 (+50 Glory)";
        } else {
          setGrandfatherGlory(prev => prev + 50);
          logMsg += `🕯️ 카롤루스 마르텔의 장엄한 아르덴 성당 매장식에 기치를 들었습니다. (+50 Glory)`;
          yearOutcomeText = "국왕급 주군 대장례식 기치 배정 (+50 Glory)";
        }
      } else if (yr === 742) {
        logMsg = `🏰 742년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("노환 (Old Age)");
          setInteractiveStage('gf_dead');
          logMsg += `💀 주군들의 결혼 잔치 직후 노환으로 평화로이 서거하셨습니다.`;
          yearOutcomeText = "서거: 결혼식 하객 복귀 중 노환 영면";
        } else if (d20 <= 10) {
          logMsg += `축제 기간 영지 순찰을 담당했습니다.`;
          yearOutcomeText = "축제 영지 보초";
        } else {
          setGrandfatherGlory(prev => prev + 25);
          logMsg += `🎉 국왕과 대귀족들이 모인 성대한 연회에서 가문의 권세를 떨쳤습니다. (+25 Glory)`;
          yearOutcomeText = "국왕 연회 공식 하객 참석 (+25 Glory)";
        }
      } else if (yr === 743) {
        if (d20 === 1) {
          setGfDead(true);
          setGrandfatherDeathYear(yr);
          setGrandfatherDeathCause("바이에른 전사 (Combat)");
          setInteractiveStage('gf_dead');
          logMsg = `🏰 743년: [역사] ${event}\n  └ 💀 알프스 고갯길에서 바이에른 보병의 기습을 받아 전사하셨습니다.`;
          yearOutcomeText = "전사: 바이에른 고지 기습 전사";
        } else if (d20 <= 5) {
          logMsg = `🏰 743년: [역사] ${event}\n  └ 가문 영지를 수호했습니다.`;
          yearOutcomeText = "아르덴 영지 수호";
        } else if (d20 <= 10) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 743,
            firstRoll: d20,
            logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 레겐스부르크 결전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 743,
            firstRoll: d20,
            logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 정벌전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 743,
            firstRoll: d20,
            logPrefix: `🏰 743년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 진압전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: null
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 744) {
        if (d20 <= 10) {
          logMsg = `🏰 744년: [역사] ${event}\n  └ 노장이 되어 고향 영지를 지켰습니다.`;
          yearOutcomeText = "노장 은퇴 준비 보초";
        } else if (d20 <= 14) {
          setChroniclePendingRoll({
            type: 'gf_combat_survival',
            yr: 744,
            firstRoll: d20,
            logPrefix: `🏰 744년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 최후 전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 18) {
          setGrandfatherGlory(prev => prev + 25);
          logMsg = `🏰 744년: [역사] ${event}\n  └ 👑 파리 대성당에서 섭정 베르트라다 왕비의 성대하고 역사적인 복귀식 대열에 합류했습니다. (+25 Glory)`;
          yearOutcomeText = "왕비 친위 대열 합류 무훈 (+25 Glory)";
        } else {
          setGrandfatherGlory(prev => prev + 100);
          logMsg = `🏰 744년: [역사] ${event}\n  └ 🔍 피핀 국왕의 어전에서 아키텐 위노 공작이 심어놓은 흉악한 세작을 기지로 생포해 상을 받았습니다! (+100 Glory)`;
          yearOutcomeText = "왕실 스파이 생포 훈장 획득 (+100 Glory)";
        }
      }

      setAncestorRollLog(prev => [...prev, logMsg]);
      setCurrentYearRolled(true);
      setCurrentYearResultText(yearOutcomeText);
    } 
    else if (interactiveStage === 'f_running') {
      const runFCombatSurvival = (eventName, battleModifier = 0, isVictor = true, standardGlory = 100) => {
        const rollVal = (secondManualD20 !== undefined) ? secondManualD20 : rollD20();
        const modifiedRoll = rollVal + battleModifier;
        let dead = false;
        let gloryGained = standardGlory * (isVictor ? 2 : 1);
        let cause = "";
        let rollDescText = "";

        if (modifiedRoll <= 0) {
          dead = true;
          gloryGained += 1000;
          cause = "전투 중 장렬한 전사 (Combat)";
          rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 1) {
          dead = true;
          cause = "전투 중 전사 (Combat)";
          rollDescText = `🗡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 2) {
          dead = true;
          const retiredYears = rollD20();
          cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
          rollDescText = `🏥 주사위 ${rollVal}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll === 3) {
          dead = true;
          cause = "포로 압송 및 실종 (Captured)";
          rollDescText = `🔗 주사위 ${rollVal}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
        } else if (modifiedRoll <= 5) {
          gloryGained += 100;
          rollDescText = `✨ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
        } else {
          rollDescText = `🛡️ 주사위 ${rollVal}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
        }

        return { dead, gloryGained, cause, rollDescText };
      };

      const runFOrdinaryYear = (eventDescription, enemyName = "Saxons") => {
        let gloryGained = 0;
        let dead = false;
        let cause = "";
        let rollDescText = "";

        if (d20 === 1) {
          dead = true;
          cause = "예기치 못한 급사 (Ordinary Year Death)";
          rollDescText = `💀 [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
        } else if (d20 <= 17) {
          rollDescText = `🏰 [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
        } else if (d20 <= 19) {
          gloryGained = 50;
          rollDescText = `✨ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
        } else {
          return { isRaidPending: true };
        }

        return { dead, gloryGained, cause, rollDescText };
      };

      const event = ANCESTOR_EVENTS[yr];
      if (yr === 745) {
        logMsg = `👰 745년: [가문] ${event}\n  └ [주사위 ${d20}] - 부친께서 `;
        if (d20 <= 5) {
          setFatherGlory(prev => prev + 100);
          logMsg += `현명한 조언을 해주는 양가 가문의 아가씨를 맞아 혼인하셨습니다. (+100 Glory)`;
          yearOutcomeText = "가문 현인과의 혼사 성취 (+100 Glory)";
        } else if (d20 <= 10) {
          setFatherGlory(prev => prev + 200);
          logMsg += `가문에 헌신적인 공로를 세워, 아르덴 영주로부터 직접 귀부인의 손을 약속받으셨습니다! (+200 Glory)`;
          yearOutcomeText = "영주 추천 귀부인과의 혼사 성취 (+200 Glory)";
        } else {
          setFatherGlory(prev => prev + 400);
          logMsg += `적대 가문 영주의 어여쁜 여식을 극적인 기사 결투 끝에 쟁취하여 가문을 일으켰습니다! (+400 Glory)`;
          yearOutcomeText = "결투 결사 끝 적대 가문 영주 여식과 로맨틱 혼사 (+400 Glory)";
        }
      } else if (yr === 746) {
        logMsg = `🏰 746년: [가문] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("전역사 (Illness)");
          setInteractiveStage('f_dead');
          logMsg += `💀 무서운 군영 내 돌림병에 걸려 롤랑 경의 탄생 소식만을 듣고 서거하셨습니다.`;
          yearOutcomeText = "사망: 군영 열병사 (롤랑 경 출생)";
        } else if (d20 <= 10) {
          logMsg += `기쁜 롤랑 경의 탄생을 전장에서 전해 듣고 가문의 축배를 올렸습니다.`;
          yearOutcomeText = "롤랑 경 출생 축하연 (전선 유지)";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 746년: [가문] ${event}\n  └ [1차 주사위 ${d20}] - 셉티마니아 무어인 방어전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (셉티마니아 무어인 방어전)",
            battleModifier: -1,
            isVictor: false,
            standardGlory: 25,
            hateEnemy: 'moors'
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 18) {
          logMsg += `알레마니아 반역자들을 징벌하는 피핀의 대숙청 대열에 참여하셨습니다. 잔혹성(Cruel) 1d6 기질 획득!`;
          yearOutcomeText = "알레마니아 피의 대숙청 및 잔혹성 기질 마킹";
        } else {
          setFatherGlory(prev => prev + 50);
          logMsg += `마침내 롤랑 경의 장엄한 탄생을 직접 보고 기사로서 성인 묘비에 참배하며 믿음을 다짐했습니다. (+1 Love God, +50 Glory)`;
          yearOutcomeText = "아들의 세례식 친히 참석 및 영적인 다짐 (+50 Glory)";
        }
      } else if (yr === 747) {
        logMsg = `🏰 747년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("순례 중 사망 (Accident)");
          setInteractiveStage('f_dead');
          logMsg += `💀 알프스 산맥을 돌파하던 도중 눈사태로 낙사하셨습니다.`;
          yearOutcomeText = "사망: 알프스 눈사태 조난";
        } else if (d20 <= 10) {
          logMsg += `쾰른 궁정의 보초를 섰습니다.`;
          yearOutcomeText = "쾰른 대정문 보초";
        } else if (d20 <= 18) {
          setFatherGlory(prev => prev + 25);
          logMsg += `카를로만 공의 은퇴길 로마 대순례단에 하객으로 동참해 축복을 목도했습니다. (+25 Glory)`;
          yearOutcomeText = "로마 대주교 순례 가이드 무사 수행 (+25 Glory)";
        } else {
          setFatherDead(true);
          const yearsRet = rollD20();
          setFatherDeathYear(yr + yearsRet);
          setFatherDeathCause("성스러운 은수사 은퇴 (Hermit)");
          setInteractiveStage('f_dead');
          logMsg += `🌲 마인츠 대주교 보니파키우스를 접견한 후 깊은 성령을 깨달아 아르덴 깊은 숲의 은수사(Hermit)로 기꺼이 은퇴하셨습니다. (+1 Love God, 기사 전역, ${yearsRet}년 뒤 임종)`;
          yearOutcomeText = `은퇴: 성직자 접견 후 은수사 전격 은퇴 (${yearsRet}년 뒤 서거)`;
        }
      } else if (yr === 748) {
        const res = runFOrdinaryYear(event, "Moors");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'f_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 748년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Moors'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 748년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setFatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause(res.cause);
          setInteractiveStage('f_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `제국 후방 평화 수비 완료 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 749) {
        logMsg = `🏰 749년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("바이에른 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 레겐스부르크 근교의 기습전에서 전사하셨습니다.`;
          yearOutcomeText = "전사: 바이에른 그리포 기습전 전사";
        } else if (d20 <= 10) {
          logMsg += `기사단 행군 대열의 중심을 지켰습니다.`;
          yearOutcomeText = "기사단 행군 복무";
        } else if (d20 <= 18) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 749년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 바이에른 기습 공세에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (바이에른 기습 공세)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100
          });
          setChronicleManualD20('');
          return;
        } else {
          logMsg += `⚠️ 포로 그리포 왕자의 참모진 경비를 전담했으나, 한밤중 감시망이 뚫려 왕자가 도주하는 명예 훼손을 겪었습니다. (Honor 수치 하락)`;
          yearOutcomeText = "경비 누수로 인한 명예 징계 실추";
        }
      } else if (yr === 750) {
        logMsg = `🏰 750년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("작센 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 작센인들의 숲속 함정에 포위되어 장렬히 전사하셨습니다.`;
          yearOutcomeText = "전사: 작센 매복 함정 전사";
        } else if (d20 <= 10) {
          logMsg += `영지 수비 근무를 섰습니다.`;
          yearOutcomeText = "수비대 근무";
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 750년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 대전투에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event,
            battleModifier: 0,
            isVictor: true,
            standardGlory: 100,
            customOutcome: 'saxons_hate_d6'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 751) {
        logMsg = `🏰 751년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("수비 중 사망 (Feud)");
          setInteractiveStage('f_dead');
          logMsg += `💀 반역도당의 황궁 난입 사태에서 왕가를 지키다 서거하셨습니다.`;
          yearOutcomeText = "사망: 황궁 습격 경호 중 사망";
        } else if (d20 <= 10) {
          logMsg += `즉위식장 외부 바리케이드를 경비했습니다.`;
          yearOutcomeText = "즉위식장 외곽 수비";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 751년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 궁정 반역 세작 처단전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (반역 세작 처단)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherGlory(prev => prev + 50);
          logMsg += `👑 성스러운 피핀 3세의 대관 미사에서 왕의 최측근 근위대로 기립하며 큰 명예를 획득했습니다! (+50 Glory)`;
          yearOutcomeText = "👑 역사적 대관식 황실 대근위대 발탁 (+50 Glory)";
        }
      } else if (yr === 752) {
        const res = runFOrdinaryYear(event, "Moors");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'f_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 752년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Moors'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 752년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setFatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause(res.cause);
          setInteractiveStage('f_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `왕실 수습 외교 지원 성공 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 753) {
        logMsg = `🏰 753년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("작센 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 비부르크 산 절벽 전장에서 추락사 혹은 장렬히 전사하셨습니다.`;
          yearOutcomeText = "전사: 비부르크 산 절벽 결사전 사망";
        } else if (d20 <= 10) {
          logMsg += `쾰른 군영을 수호했습니다.`;
          yearOutcomeText = "쾰른 수비대";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 753년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 비부르크 대참패 전장에 낙오되어 고립되었습니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (비부르크 참사)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            customOutcome: 'saxons_hate_d6'
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherGlory(prev => prev + 50);
          logMsg += `🗡️ 국경을 이탈해 암약을 시도하던 반역자 그리포를 검거하는 기사 특별 부대를 이끌어 활약했습니다! (+50 Glory)`;
          yearOutcomeText = "그리포 탈주 검거대 대장 공적 (+50 Glory)";
        }
      } else if (yr === 754) {
        logMsg = `🏰 754년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("무어 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 나르본 성문을 부수던 와중 적들의 화포 혹은 불화살을 맞고 전사하셨습니다.`;
          yearOutcomeText = "전사: 나르본 성문 격파 공세 사망";
        } else if (d20 <= 8) {
          logMsg += `교황 전령을 접견하는 경호 임무를 수행했습니다.`;
          yearOutcomeText = "교황 특사 가드 임무";
        } else if (d20 <= 14) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 754년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 알프스 설산 포위망 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (알프스 원정 전투)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 18) {
          setFatherGlory(prev => prev + 25);
          logMsg += `🇮🇹 롬바르디아 영지 약탈 공방전에서 적들의 식량 창고를 털어 군에 공헌했습니다. (+25 Glory)`;
          yearOutcomeText = "롬바르디아 적 기지 창고 파괴 공적 (+25 Glory)";
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 754년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 나르본 탈환 대작전 선봉에 섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (나르본 탈환 대작전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            hateEnemy: 'moors'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 755) {
        const res = runFOrdinaryYear(event, "Moors");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'f_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 755년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 무어 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Moors'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 755년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setFatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause(res.cause);
          setInteractiveStage('f_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `이탈리아 정의 구현 무공 기록 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 756) {
        logMsg = `🏰 756년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("파비아 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 파비아 성루 기습 작전에서 전사하셨습니다.`;
          yearOutcomeText = "전사: 파비아 공성 사다리 작전 중 사망";
        } else if (d20 <= 10) {
          logMsg += `이탈리아 고지 점령대를 경계했습니다.`;
          yearOutcomeText = "파비아 외곽 고지 경비";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 756년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 파비아 성문 기습 돌격대에 자원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (파비아 성문 공략)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherGlory(prev => prev + 25);
          logMsg += `⛪ 승리 후 로마 바티칸 성당의 정예 황실 가드로 배정되어 교황령 수호의 증인이 되었습니다. (+25 Glory)`;
          yearOutcomeText = "⛪ 교황청 직속 황실 가드 임명 대업 (+25 Glory)";
        }
      } else if (yr === 757) {
        logMsg = `🏰 757년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("덴마크 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`;
          yearOutcomeText = "전사: 바이킹 상륙 전함 백병전 사망";
        } else if (d20 <= 10) {
          logMsg += `초소 순찰을 돌며 조용히 보냈습니다.`;
          yearOutcomeText = "초소 근무 복무";
        } else if (d20 <= 18) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 757년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 습격해 온 북방 바이킹과의 격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (바이킹 결전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 100,
            hateEnemy: 'danes'
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherHates(prev => ({ ...prev, danes: (prev.danes || 0) + 6 }));
          logMsg += `⚠️ 덴마크 국왕의 오만한 기습에 걸려 머리가 깎인 채로 사절에서 풀려나는 엄청난 굴욕을 겪었습니다. (Honor 대폭 삭감, 덴마크인 증오 대폭 상승)`;
          yearOutcomeText = "오욕: 바이킹 포로 수모 및 덴마크 증오 +6 획득";
        }
      } else if (yr === 758) {
        logMsg = `🏰 758년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("작센 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 불타는 작센 성읍의 철수 도중 전사하셨습니다.`;
          yearOutcomeText = "전사: 작센 소탕 철수 도중 매복 전사";
        } else if (d20 <= 10) {
          logMsg += `국경 참호를 보수했습니다.`;
          yearOutcomeText = "참호 수축 근무";
        } else if (d20 <= 16) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 758년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 작센 강제정벌 레이드 종군을 결정합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (작센 강제정벌 레이드)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25,
            hateEnemy: 'saxons'
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 758년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 피비린내 나는 작센 대학살 징벌전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (작센 대학살 징벌전)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            customOutcome: 'saxons_hate_d6'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 759) {
        const res = runFOrdinaryYear(event, "Saxons");
        if (res.isRaidPending) {
          setChroniclePendingRoll({
            type: 'f_raid_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 759년: [역사] ${event}\n  └ 🔥 [1차 주사위 ${d20}] - 국경을 넘나드는 작센 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! 생존 판정이 필요합니다.`,
            enemyName: 'Saxons'
          });
          setChronicleManualD20('');
          return;
        }
        logMsg = `🏰 759년: [역사] ${event}\n  └ ${res.rollDescText}`;
        setFatherGlory(prev => prev + res.gloryGained);
        if (res.dead) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause(res.cause);
          setInteractiveStage('f_dead');
          yearOutcomeText = `사망: ${res.cause}`;
        } else {
          yearOutcomeText = `사라센 남부 완전 소탕 축제 참석 (+${res.gloryGained} Glory)`;
        }
      } else if (yr === 760) {
        logMsg = `🏰 760년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("아키텐 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 리무쟁 공성망을 공격하던 와중 화살을 맞아 전사하셨습니다.`;
          yearOutcomeText = "전사: 리무쟁 성 포위망 공격 도중 전사";
        } else if (d20 <= 5) {
          logMsg += `후방 포병대를 경호했습니다.`;
          yearOutcomeText = "후방 포병 경호";
        } else if (d20 <= 10) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 760년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 리무쟁 요새 공성망 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (리무쟁 공성 돌파)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 760년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 수림 게릴라 소탕전에 종군합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (아키텐 수림 게릴라전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherGlory(prev => prev + 200);
          setFSkipYearsUntil(763);
          logMsg += `✈️ 쾰른의 백장 란드리 경의 신뢰를 받아 비잔티움 대원정단의 참모로 전격 합류했습니다! 761~762년 동안 로마를 거쳐 콘스탄티노플에서 장대한 외교 원정을 수행합니다. (+200 Glory, 명예 수치 대폭 상승)`;
          yearOutcomeText = "비잔티움 제국 외교 대사절 특사 발탁 (761~762 스킵) (+200 Glory)";
        }
      } else if (yr === 761) {
        logMsg = `🏰 761년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("부르주 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 부르주 성벽 함락 작전에서 적의 불벼락을 맞고 전사하셨습니다.`;
          yearOutcomeText = "전사: 부르주 참호 격파 중 화염 사망";
        } else if (d20 <= 10) {
          logMsg += `기사단 예비 진지를 보수했습니다.`;
          yearOutcomeText = "예비 진지 복무";
        } else if (d20 <= 17) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 761년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 부르주 요새 대격파 격전에 뛰어듭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (부르주 격파전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 761년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 브르타뉴 소탕전에 지원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (브르타뉴 소탕)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 762) {
        logMsg = `🏰 762년: [가문] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("아키텐 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 아키텐 기습군의 정찰 칼날에 희생되셨습니다.`;
          yearOutcomeText = "전사: 아키텐 정찰 조우 격전 중 사망";
        } else if (d20 <= 10) {
          logMsg += `아르헨돈 요새 수비를 섰습니다.`;
          yearOutcomeText = "아르헨돈 요새 지킴이";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 762년: [가문] ${event}\n  └ [1차 주사위 ${d20}] - 아키텐 산지 약탈 돌파 작전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (아키텐 산악 약탈전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25
          });
          setChronicleManualD20('');
          return;
        } else {
          setFatherGlory(prev => prev + 50);
          logMsg += `👑 왕궁 기사단 훈련 중 어린 아들 롤랑이 왕의 식탁에서 대담하게 고기를 훔쳐 아버지를 감탄시키고 밀로 백작 가문이 화해하는 역사적 현장을 배석했습니다. (+50 Glory)`;
          yearOutcomeText = "👑 가문 화해 및 롤랑의 어전 대담한 데뷔 축하 (+50 Glory)";
        }
      } else if (yr === 763) {
        logMsg = `🏰 763년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("라 로슈 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 포위당한 라 로슈 성루에서 적의 발석기에 깔려 전사하셨습니다.`;
          yearOutcomeText = "전사: 성곽 수비 도중 투석 바위 사망";
        } else if (d20 <= 5) {
          logMsg += `화살 통을 날 나르며 공성에 저항했습니다.`;
          yearOutcomeText = "화살 보급 의무 복무";
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 763년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 성루 총사수 결사방어전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (성루 총사수 결전)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 764) {
        logMsg = `🏰 764년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("툴루즈 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 툴루즈 성문 돌파 시도 중 성루 위에서 쏟아지는 화약/기름에 전사하셨습니다.`;
          yearOutcomeText = "전사: 툴루즈 공성 기름 화상 사망";
        } else if (d20 <= 10) {
          logMsg += `보급선 방어를 담당했습니다.`;
          yearOutcomeText = "보급 마차 지킴이";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 764년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오베리 백작의 라 로슈 탈환 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (오베리 백작의 라 로슈 탈환전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 764년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 툴루즈 대공격의 돌격대에 자원합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (툴루즈 대공격)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 25
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 765) {
        logMsg = `🏰 765년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("작센 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 쾰른을 지키는 격돌에서 전사하셨습니다.`;
          yearOutcomeText = "전사: 쾰른 대침공 작센 격파 중 사망";
        } else if (d20 <= 10) {
          logMsg += `수비 진영을 정리했습니다.`;
          yearOutcomeText = "진영 후방 정돈";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 765년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 오트페이유 포위 돌파전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (오트페이유 포위전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 765년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 추장 브로히막스와의 역사적인 브로히막스 결전에 나섭니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (브로히막스 결전)",
            battleModifier: -1,
            isVictor: true,
            standardGlory: 100,
            customOutcome: 'saxons_hate_d6'
          });
          setChronicleManualD20('');
          return;
        }
      } else if (yr === 766) {
        logMsg = `🏰 766년: [역사] ${event}\n  └ [주사위 ${d20}] - `;
        if (d20 === 1) {
          setFatherDead(true);
          setFatherDeathYear(yr);
          setFatherDeathCause("최후의 전사 (Combat)");
          setInteractiveStage('f_dead');
          logMsg += `💀 아들 롤랑의 성인식을 몇 달 앞두고 가문의 무훈을 빛내며 성벽 아래에서 전사하셨습니다.`;
          yearOutcomeText = "장렬한 전사: 아들 기사식을 앞두고 에그르몽 결전 전사";
        } else if (d20 <= 10) {
          logMsg += `황실 가드 임무를 다했습니다.`;
          yearOutcomeText = "황실 특수 가드 수행";
        } else if (d20 <= 15) {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 766년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 몽펠리에 포위 공성전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (몽펠리에 공성전)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50
          });
          setChronicleManualD20('');
          return;
        } else {
          setChroniclePendingRoll({
            type: 'f_combat_survival',
            yr,
            firstRoll: d20,
            logPrefix: `🏰 766년: [역사] ${event}\n  └ [1차 주사위 ${d20}] - 에그르몽 대 격전에 참전합니다. 생존을 위해 전투 생존 판정이 필요합니다.\n`,
            eventName: event + " (에그르몽 대승)",
            battleModifier: 0,
            isVictor: true,
            standardGlory: 50,
            customOutcome: 'viviens_baptism'
          });
          setChronicleManualD20('');
          return;
        }
      }

      setAncestorRollLog(prev => [...prev, logMsg]);
      setCurrentYearRolled(true);
      setCurrentYearResultText(yearOutcomeText);
    }
    } catch (err) {
      console.error(err);
      alert("Error in rollSingleYearInteractive:\n" + err.stack);
    }
  };

  const advanceChronicleYear = () => {
    try {
      if (!currentYearRolled) return;

      saveChronicleHistory();

    const rollD20 = () => Math.floor(Math.random() * 20) + 1;

    if (interactiveStage === 'gf_running') {
      const nextYr = interactiveYear + 1;
      if (nextYr > 744) {
        const deathYr = 744 + rollD20();
        const cause = "평화로운 영면 (Old Age)";
        const finalMsg = `👴 ${deathYr}년: 은퇴한 할아버님(시조 고드프루아 경)께서 평화롭게 침상에서 영면에 드셨습니다.`;
        
        setGfDead(true);
        setGrandfatherDeathYear(deathYr);
        setGrandfatherDeathCause(cause);
        setAncestorRollLog(prev => [...prev, finalMsg]);
        moveToFatherStage();
      } else {
        setInteractiveYear(nextYr);
        setCurrentYearRolled(false);
        setCurrentYearResultText('');
        setChronicleManualD20('');
      }
    } 
    else if (interactiveStage === 'gf_dead') {
      moveToFatherStage();
    }
    else if (interactiveStage === 'f_running') {
      if (fSkipYearsUntil > interactiveYear) {
        const nextYr = fSkipYearsUntil;
        setInteractiveYear(nextYr);
        setCurrentYearRolled(false);
        setCurrentYearResultText('');
        setChronicleManualD20('');
        setFSkipYearsUntil(0);
        setAncestorRollLog(prev => [...prev, `✈️ 761~762년: 부친께서는 란드리 경과 함께 비잔티움 대원정에 참전하시어 머나먼 동방에 계십니다. (Garrison 및 전투 자동 생존)`]);
      } else {
        const nextYr = interactiveYear + 1;
        if (nextYr > 766) {
          const deathYr = 766 + rollD20();
          const cause = "평화로운 영면 (Old Age)";
          const finalMsg = `👴 ${deathYr}년: 은퇴한 아버님(제라르 경)께서 영광스러운 대공의 은퇴 생활 도중 침상에서 평화로이 서거하셨습니다.`;
          
          setFatherDead(true);
          setFatherDeathYear(deathYr);
          setFatherDeathCause(cause);
          setAncestorRollLog(prev => [...prev, finalMsg]);
          
          completeInteractiveChronicle(fatherGlory, deathYr, cause);
        } else {
          setInteractiveYear(nextYr);
          setCurrentYearRolled(false);
          setCurrentYearResultText('');
          setChronicleManualD20('');
        }
      }
    }
    else if (interactiveStage === 'f_dead') {
      completeInteractiveChronicle(fatherGlory, fatherDeathYear, fatherDeathCause);
    }
    } catch (err) {
      console.error(err);
      alert("Error in advanceChronicleYear:\n" + err.stack);
    }
  };

  const moveToFatherStage = () => {
    setInteractiveStage('f_running');
    setInteractiveYear(745);
    setCurrentYearRolled(false);
    setCurrentYearResultText('');
    setChronicleManualD20('');

    const inheritedGlory = Math.floor(grandfatherGlory / 10);
    const startGlory = 2500 + inheritedGlory;
    setFatherGlory(startGlory);

    let inhSaxons = grandfatherHates.saxons > 10 ? grandfatherHates.saxons : 0;
    let inhMoors = grandfatherHates.moors > 10 ? grandfatherHates.moors : 0;
    setFatherHates({ saxons: inhSaxons, moors: inhMoors });

    setAncestorRollLog(prev => [
      ...prev,
      "",
      "📜 [부친의 생애: 연대기 시작 745년]",
      `🎁 745년: 부친(724년생)께서 성인식을 마치고 조부의 위대한 유산 1/10을 물려받아 ${startGlory} Glory로 당당히 기사 서임을 받으셨습니다.`
    ]);
  };

  const completeInteractiveChronicle = (finalFGlory, finalFDeathYear, finalFDeathCause) => {
    setInteractiveStage('completed');
    
    const summaryLogs = [
      "",
      "🎉 [연대기 결과 요약]",
      `• 조부 최종 명예: ${grandfatherGlory} Glory (생존기간: 700~${grandfatherDeathYear || 744}, 사인: ${grandfatherDeathCause || '평화로운 영면'})`,
      `• 부친 최종 명예: ${finalFGlory} Glory (생존기간: 724~${finalFDeathYear}, 사인: ${finalFDeathCause})`,
      `• 조상으로부터 플레이어 캐릭터(롤랑 경)에게 계승될 유산:`,
      `  - 계승 명예: +${Math.floor(finalFGlory / 10)} Glory (부친 명예의 1/10)`,
      fatherHates.saxons > 10 ? `  - 계승 증오: 작센인에 대한 증오 Passion [${fatherHates.saxons}]` : null,
      fatherHates.moors > 10 ? `  - 계승 증오: 이교도(무어인)에 대한 증오 Passion [${fatherHates.moors}]` : null
    ].filter(Boolean);

    setAncestorRollLog(prev => [...prev, ...summaryLogs]);
  };

  const rollAncestorHistory = () => {
    const logs = [];
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    const rollD6 = () => Math.floor(Math.random() * 6) + 1;
    const rollD3 = () => Math.floor(Math.random() * 3) + 1;

    logs.push("📜 [조조부의 생애: 연대기 시작 723년]");
    let gfGlory = 2500;
    let gfHateSaxons = 0;
    let gfHateMoors = 0;
    let gfHateDanes = 0;
    let gfDead = false;
    let gfDeathYr = 744;
    let gfCause = '노환';

    const runCombatSurvival = (yr, eventName, isGrandfather, battleModifier = 0, isVictor = true, standardGlory = 100) => {
      const roll = rollD20();
      const modifiedRoll = roll + battleModifier;
      
      let dead = false;
      let gloryGained = standardGlory * (isVictor ? 2 : 1);
      let logMsg = "";
      let cause = "";
      let status = "survived";

      if (modifiedRoll <= 0) {
        dead = true;
        status = "dead";
        gloryGained += 1000;
        cause = "전투 중 장렬한 전사 (Combat)";
        logMsg = `🗡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 전공을 치하받으며 장렬히 전사하셨습니다! (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 1) {
        dead = true;
        status = "dead";
        cause = "전투 중 전사 (Combat)";
        logMsg = `🗡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 전투 중 아쉽게 전사하셨습니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 2) {
        dead = true;
        status = "retired";
        const retiredYears = rollD20();
        cause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
        logMsg = `🏥 ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 불구가 되는 중상을 입어 은퇴 후 에히터나흐 수도원으로 들어갑니다. ${retiredYears}년 뒤 수도원에서 조용히 영면에 드십니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll === 3) {
        dead = true;
        status = "captured";
        cause = "포로 압송 및 실종 (Captured)";
        logMsg = `🔗 ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 포로로 잡혀 적국으로 압송되었으며 영영 돌아오지 못했습니다. (+${gloryGained} Glory)`;
      } else if (modifiedRoll <= 5) {
        gloryGained += 100;
        logMsg = `✨ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 기적적으로 생존하고 전장에 큰 기여를 한 영웅적 전공을 세웠습니다! (+${gloryGained} Glory)`;
      } else {
        logMsg = `🛡️ ${yr}년: ${eventName} -> 주사위 ${roll}(보정 ${modifiedRoll}) - 치열한 전투 속에서 무사히 살아남으셨습니다. (+${gloryGained} Glory)`;
      }

      if (isGrandfather) {
        gfGlory += gloryGained;
        if (dead) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = cause;
        }
      } else {
        fGlory += gloryGained;
        if (dead) {
          fDead = true;
          fDeathYr = yr;
          fCause = cause;
        }
      }
      logs.push(logMsg);
      return { dead, status };
    };

    const rollOrdinaryYear = (yr, eventDescription, isGrandfather, enemyName = "Saxons") => {
      const d20 = rollD20();
      let gloryGained = 0;
      let dead = false;
      let logMsg = "";
      let cause = "";
      let status = "survived";

      if (d20 === 1) {
        dead = true;
        status = "dead";
        cause = "예기치 못한 급사 (Ordinary Year Death)";
        logMsg = `💀 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 평화로운 겨울철에 갑작스러운 불의의 사고 혹은 급병으로 서거하셨습니다.`;
      } else if (d20 <= 17) {
        logMsg = `🏰 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 기사로서 성채 수비대(Garrison) 의무 및 영지 보초 임무를 평온히 완수했습니다.`;
      } else if (d20 <= 19) {
        gloryGained = 50;
        logMsg = `✨ ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 봉토를 훌륭히 순찰하고 주군의 신임을 받아 기념비적이고 명예로운 무훈을 올렸습니다! (+50 Glory)`;
      } else {
        logMsg = `🔥 ${yr}년: [역사] ${eventDescription}\n  └ [주사위 ${d20}] - 국경을 넘나드는 ${enemyName === "Saxons" ? "작센" : enemyName === "Moors" ? "무어" : "덴마크"} 이교도 습격단에 맞서 치열한 영지 방어전을 벌였습니다! (전투 생존 판정 돌입)`;
        
        // Combat Survival on a raid (25 Glory, unmodified, victor)
        const survivalRoll = rollD20();
        let sDead = false;
        let sGlory = 25;
        let sCause = "";
        let sLog = "";

        if (survivalRoll === 1) {
          sDead = true;
          sCause = `${enemyName} 습격 방어 중 전사`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 안타깝게도 밀려오는 적들을 막아서다 격전 중 장렬히 전사하셨습니다.`;
        } else if (survivalRoll === 2) {
          sDead = true;
          const retiredYears = rollD20();
          sCause = `부상 은퇴 (수도원에서 ${retiredYears}년 후 영면)`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 불구가 되는 중상을 입어 은퇴 후 수도원에 귀의합니다. ${retiredYears}년 뒤 조용히 영면에 드십니다.`;
        } else if (survivalRoll === 3) {
          sDead = true;
          sCause = `포로 압송 및 실종`;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 적들의 포로가 되어 머나먼 이교의 땅으로 납치되었으며 끝내 돌아오지 못했습니다.`;
        } else if (survivalRoll <= 5) {
          sGlory += 100;
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 기적적으로 습격의 대장을 척살하는 위대한 영웅적 무훈을 세우며 살아남았습니다! (+${sGlory} Glory)`;
        } else {
          sLog = `    └ [습격 수비전 주사위 ${survivalRoll}] - 무사히 습격을 격퇴하고 칼날 끝에서 살아남았습니다. (+${sGlory} Glory)`;
        }

        const hVal = rollD3();
        if (isGrandfather) {
          gfGlory += sGlory;
          if (sDead) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = sCause;
          } else {
            if (enemyName === "Saxons") gfHateSaxons += hVal;
            else gfHateMoors += hVal;
            sLog += ` (이교도 증오 +${hVal} 획득)`;
          }
        } else {
          fGlory += sGlory;
          if (sDead) {
            fDead = true;
            fDeathYr = yr;
            fCause = sCause;
          } else {
            if (enemyName === "Saxons") fHateSaxons += hVal;
            else if (enemyName === "Moors") fHateMoors += hVal;
            else fHateDanes += hVal;
            sLog += ` (이교도 증오 +${hVal} 획득)`;
          }
        }
        logMsg += `\n` + sLog;
      }

      if (isGrandfather) {
        if (dead) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = cause;
        }
      } else {
        if (dead) {
          fDead = true;
          fDeathYr = yr;
          fCause = cause;
        }
      }
      logs.push(logMsg);
    };

    // 👴 [조조부의 연대기 (723~744)]
    for (let yr = 723; yr <= 744; yr++) {
      if (gfDead) continue;

      if (yr === 723) {
        const event = "작센 신성수 파괴 공격: 카롤루스 마르텔이 가이스마르와 프리츨라 인근의 작센 신성한 나무(holy trees)들을 파괴한 역사적 원정에 종군했습니다.";
        const roll = rollD20();
        if (roll <= 10) {
          logs.push(`🏰 723년: [역사] ${event} -> 주사위 ${roll} - 후방 수비대(Garrison) 의무를 안전하게 수행했습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 724) {
        const event = "교황 성유물 기증: 교황이 카롤루스 마르텔에게 성 베드로의 쇠사슬과 열쇠 성유물함을 기증하였습니다. 가문의 영광스러운 후계자이자 아버님이 되실 제라르 경(Gerard)이 탄생하셨습니다.";
        logs.push(`🏰 724년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 725) {
        const event = "오툉 포위전: 무어인들이 Nîmes과 Carcassonne을 함락시키고 론 강을 따라 오툉(Autun)까지 대약탈을 감행하여, 오툉 수비대로서 결사 항전했습니다. (오도 공작 매수 소문)";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 725년: [역사] ${event} -> 주사위 ${roll} - 행군 도중 돌발적인 질병으로 급거 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 725년: [역사] ${event} -> 주사위 ${roll} - 후방 성채 경계 근무를 수행했습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, false, 50);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        }
      } else if (yr === 726) {
        const event = "중대한 무훈의 공백기: 기사단이 전열을 정비하는 동안, 할아버님께서는 후방 참호를 강화하고 평화로운 겨울 보초 임무에 전념하셨습니다.";
        logs.push(`🏰 726년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 727) {
        const event = "영지의 평온: 제국 국경에 마찰이 일어나지 않은 해로, 봉토의 곡식 수확을 관리하고 가문의 권세를 평화롭게 유지하였습니다.";
        logs.push(`🏰 727년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 728) {
        const event = "작센 및 아키텐 대원정: 카롤루스 마르텔이 작센과 프리지아에서 원정을 벌이고, 독립을 선포하며 무어인과 연맹을 맺은 아키텐의 오도 공작을 제압하기 위해 대원정에 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사고 (Accident)";
          logs.push(`💀 728년: [역사] ${event} -> 주사위 ${roll} - 불의의 마차 낙마 사고로 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 728년: [역사] ${event} -> 주사위 ${roll} - 후방 영지 보급 호위를 전담했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오도 공작 응징전)", true, -1, true, 100);
        } else {
          const res = runCombatSurvival(yr, event + " (북방 작센전)", true, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 729) {
        const event = "작센 전투 및 바르벨 타워 공성: 가린과 두온 공작을 돕기 위해 작센인들의 거점인 바르벨 타워 근처에서 대전투를 펼쳤습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사냥 사고 (Hunting Accident)";
          logs.push(`💀 729년: [역사] ${event} -> 주사위 ${roll} - 사냥 중 멧돼지의 기습을 받아 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 729년: [역사] ${event} -> 주사위 ${roll} - 성벽 경계 및 보초 근무를 수행했습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (Vauclere 전투)", true, -1, false, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else {
          const res = runCombatSurvival(yr, event + " (Barbel Tower 공방전)", true, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        }
      } else if (yr === 730) {
        const event = "무훈시 [Gaufrey] & [Auberi de Bourgogne]: 바르벨 타워에서 공주 플뢰르드핀의 지혜로 갇힌 프랑크 기사들이 구출되고 거인 로바스트르가 글로리앙을 결투로 참수했으며, 오베리 경이 아바르족의 공습으로부터 바이에른 영토를 완전히 사수하여 귀족적 안착에 성공했습니다.";
        logs.push(`🏰 730년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 731) {
        const event = "오리돈 공성전: 카롤루스 마르텔을 도와 배반자 람베르트의 성인 오리돈(Oridon)을 포위 공성했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 731년: [역사] ${event} -> 주사위 ${roll} - 군영 내 전염병으로 돌연 서거하셨습니다.`);
        } else if (roll <= 15) {
          logs.push(`🏰 731년: [역사] ${event} -> 주사위 ${roll} - 후방 수비대 임무를 마쳤습니다.`);
        } else {
          runCombatSurvival(yr, event, true, 0, true, 50);
        }
      } else if (yr === 732) {
        const event = "포아티에 전투 (투르 전투): 이슬람 무어인들의 대규모 침공군에 맞서 서유럽의 운명을 걸고 카롤루스 마르텔의 연합군에 합류하여 평원에서 격전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "낙사 (Accident)";
          logs.push(`💀 732년: [역사] ${event} -> 주사위 ${roll} - 전투 직전 말에서 떨어져 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 732년: [역사] ${event} -> 주사위 ${roll} - 기사단 후방 보급을 호위했습니다.`);
        } else {
          const pRoll = rollD20();
          if (pRoll === 1) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "Poitiers 전사 (Combat)";
            gfGlory += 1400;
            logs.push(`🗡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전설적인 전공을 기사단에 남기며 장렬히 전사하셨습니다! (+${gfGlory} Glory)`);
          } else if (pRoll <= 11) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "Poitiers 전사 (Combat)";
            gfGlory += 400;
            logs.push(`🗡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전투 중 영예롭게 전사하셨습니다. (+400 Glory)`);
          } else if (pRoll === 12) {
            gfDead = true;
            gfDeathYr = yr;
            gfCause = "스페인 압송 포로 (Captured)";
            gfGlory += 400;
            logs.push(`🔗 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 포로로 잡혀 무어인의 땅(스페인)으로 압송되어 소식이 끊겼습니다. (+400 Glory)`);
          } else if (pRoll === 13) {
            gfGlory += 500;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`✨ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 적진을 돌파하는 영웅적 전공을 세우며 전리품을 획득했습니다! (+500 Glory, 무어인 증오 +${hVal})`);
          } else if (pRoll <= 19) {
            gfGlory += 400;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`🛡️ 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 무사히 생존하여 대승리에 공헌했습니다. (+400 Glory, 무어인 증오 +${hVal})`);
          } else {
            gfGlory += 900;
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`👑 732년: [역사] ${event} -> 포아티에 주사위 ${pRoll} - 전장 한가운데서 침공 사령관 에미르 압둘 라흐만을 결투로 베는 불멸의 업적을 세우셨습니다! (+900 Glory, 무어인 증오 +${hVal})`);
          }
        }
      } else if (yr === 733) {
        const event = "무훈시 [Daurel and Beton] & [역사]: 브라반트 공작 베비스가 프랑크 왕국 국왕의 누이 에르멩가르드 공주와 성대한 축복 속에 결혼했으나, 질투심에 타락한 기(Guy) 백작이 주군을 해칠 비열한 음모를 꾸몄습니다. [역사] 아키텐의 수호자 오도 공작이 서거하여 아들 후놀트가 작위를 상속받았습니다.";
        logs.push(`🏰 733년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 734) {
        const event = "무훈시 [Daurel and Beton] & [역사]: 주군 가문의 위대한 희망이자 기사도의 정수인 아기 베통 경이 출생하였습니다. [역사] 프랑크의 진정한 권력자 카롤루스 마르텔이 그의 둘째 아들 피핀(Pepin)을 롬바르디아의 Pavia 왕실로 보내 수습 종자 훈련을 거치도록 조치했습니다.";
        logs.push(`🏰 734년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 735) {
        const event = "루시옹 대결 및 보르도 공성전: 카롤루스 마르텔을 종군하여 보르도 공성에 나서거나, 루시옹의 제라르 공작과의 대결전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사망 (Feud)";
          logs.push(`💀 735년: [역사] ${event} -> 주사위 ${roll} - 가문 불화 결투 도중 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 735년: [역사] ${event} -> 주사위 ${roll} - 쾰른 경비 의무를 마쳤습니다.`);
        } else if (roll <= 12) {
          runCombatSurvival(yr, event + " (루시옹 대결)", true, 0, true, 50);
        } else if (roll <= 15) {
          logs.push(`⚖️ 735년: [역사] ${event} -> 주사위 ${roll} - 위옹 경의 아모르 스캔들 재판에서 위증을 강요받아 정직함이 무너집니다. (Just 수치 하락)`);
        } else {
          runCombatSurvival(yr, event + " (보르도 공성)", true, 0, true, 50);
        }
      } else if (yr === 736) {
        const event = "제라르 격퇴 및 아를 해방전: 무어인들과 손을 잡은 반역세력을 토벌하고, 무어인의 치하에서 아를(Arles)을 완전히 탈환하기 위한 공성전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 736년: [역사] ${event} -> 주사위 ${roll} - 진중의 무서운 열병으로 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 736년: [역사] ${event} -> 주사위 ${roll} - 기사단 초소 근무를 섰습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (제라르 전투)", true, -1, false, 100);
        } else {
          const res = runCombatSurvival(yr, event + " (아를 해방전)", true, 0, true, 50);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        }
      } else if (yr === 737) {
        const event = "아비뇽 공성전 및 학살극: 무어인과 연맹을 맺은 비시고트 반역자들을 징벌하기 위해 아비뇽을 격파하고, 도시 함락 후 가차 없는 학살 및 처벌에 가담했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사고 (Accident)";
          logs.push(`💀 737년: [역사] ${event} -> 주사위 ${roll} - 성벽 수축 공사 도중 돌에 깔려 서거하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 737년: [역사] ${event} -> 주사위 ${roll} - 영지 가드 근무를 섰습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (제라르 전투)", true, -1, false, 100);
        } else {
          runCombatSurvival(yr, event + " (아비뇽 대참화)", true, 0, true, 50);
          logs.push("  └ [기질 획득] 배신자들에 대한 복수심으로 가득 차 무자비함(Cruel) 1d6 기질 획득!");
        }
      } else if (yr === 738) {
        const event = "부르고뉴 전투 및 보르들레 습격전: 로렌 가문을 도우며 부르고뉴로 쳐들어온 무어 침공군을 격파하거나, 보르들레 가문을 급습하는 가문 불화 전투에 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "사망 (Feud)";
          logs.push(`💀 738년: [역사] ${event} -> 주사위 ${roll} - 라이벌 가문의 자객에게 급습받아 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 738년: [역사] ${event} -> 주사위 ${roll} - 쾰른 성 수비대에 소집되었습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (부르고뉴 무어인전)", true, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${gfHateMoors})`);
          }
        } else {
          runCombatSurvival(yr, event + " (보르들레 습격전)", true, 0, true, 25);
        }
      } else if (yr === 739) {
        const event = "셉티마니아 수복전: 남부에서 무어인들을 축출하기 위한 셉티마니아 공성전에 가담해 큰 전리품을 획득하고 충성스러운 기사로 인정받았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "행방불명 (Disappeared)";
          logs.push(`💀 739년: [역사] ${event} -> 주사위 ${roll} - 원정길의 수풀 속에서 실종되시어 돌아오지 못했습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 739년: [역사] ${event} -> 주사위 ${roll} - 후방 수비 의무를 원활하게 수행했습니다.`);
        } else if (roll <= 10) {
          gfGlory += 50;
          logs.push(`🛡️ 739년: [역사] ${event} -> 프로방스 공성전 주사위 ${roll} - 실패로 끝난 아를 포위전에서 힘겹게 목숨을 건졌습니다. (+50 Glory)`);
        } else {
          const res = runCombatSurvival(yr, event + " (셉티마니아 대공성)", true, 0, true, 50);
          if (!res.dead) {
            logs.push("  └ [왕실의 선물] 수복 공헌을 기려 마르텔 공으로부터 프랑크 탄생 선물을 받았습니다! (Frankish Birth Gift 획득!)");
          }
        }
      } else if (yr === 740) {
        const event = "로슈브룬 공성전: 대공 나이모의 사촌 파스루즈를 구출하기 위해 덴마크 침공군에 맞서 로슈브룬 성을 방어 및 탈환했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "덴마크 전사 (Combat)";
          logs.push(`💀 740년: [역사] ${event} -> 주사위 ${roll} - 북유럽 바이킹 도끼에 맞서 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 740년: [역사] ${event} -> 주사위 ${roll} - 후방 성벽을 지켰습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, true, 0, true, 50);
          if (!res.dead) {
            logs.push("  └ [새로운 위협] 평생 처음 마주한 덴마크인들에 대해 엄청난 분노(Hate Danes 1d6)를 품었습니다!");
          }
        }
      } else if (yr === 741) {
        const event = "카롤루스 마르텔의 서거 및 장례: 마르텔 공의 서거을 기리고, 영지를 탈취하려는 그리포 왕자의 반란군을 생포하는 진압군에 가담했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "질병사 (Illness)";
          logs.push(`💀 741년: [역사] ${event} -> 주사위 ${roll} - 주군 카롤루스 마르텔의 부고를 듣고 상심 속에 병사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 741년: [역사] ${event} -> 주사위 ${roll} - 쾰른에서 애도 기간을 가졌습니다.`);
        } else if (roll <= 10) {
          gfGlory += 50;
          logs.push(`🛡️ 741년: [역사] ${event} -> 그리포 생포전 주사위 ${roll} - 반역 왕자의 병력을 기습해 체포에 일조했습니다! (+50 Glory)`);
        } else {
          gfGlory += 50;
          logs.push(`🕯️ 741년: [역사] ${event} -> 장례식 참석 주사위 ${roll} - 카롤루스 마르텔의 장엄한 아르덴 성당 매장식에 기치를 들었습니다. (+50 Glory)`);
        }
      } else if (yr === 742) {
        const event = "두온 백작의 결혼식: 국왕 피핀의 누이 올리브 공주와 두온 백작의 화려한 쾰른 혼례식에 공식 하객으로 참석했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "노환 (Old Age)";
          logs.push(`💀 742년: [역사] ${event} -> 주사위 ${roll} - 주군들의 결혼 잔치 직후 노환으로 평화로이 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 742년: [역사] ${event} -> 주사위 ${roll} - 축제 기간 영지 순찰을 담당했습니다.`);
        } else {
          gfGlory += 25;
          logs.push(`🎉 742년: [역사] ${event} -> 하객 참석 주사위 ${roll} - 국왕과 대귀족들이 모인 성대한 연회에서 가문의 권세를 떨쳤습니다. (+25 Glory)`);
        }
      } else if (yr === 743) {
        const event = "레겐스부르크 전투 및 삼면 원정: 바이에른을 완전 병합하기 위한 레겐스부르크 전투에 참전하거나, 아키텐/작센의 반란을 평정하기 위해 종군했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          gfDead = true;
          gfDeathYr = yr;
          gfCause = "바이에른 전사 (Combat)";
          logs.push(`💀 743년: [역사] ${event} -> 주사위 ${roll} - 알프스 고갯길에서 바이에른 보병의 기습을 받아 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 743년: [역사] ${event} -> 주사위 ${roll} - 가문 영지를 수호했습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (레겐스부르크 결전)", true, -1, true, 100);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (작센 정벌)", true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else {
          runCombatSurvival(yr, event + " (아키텐 진압)", true, 0, true, 25);
        }
      } else if (yr === 744) {
        const event = "조조부 은퇴 전 최후의 원정: 궁정의 간첩을 적발하고 최후의 작센 습격을 차단하며 기사로서의 영예로운 일생을 매듭지었습니다.";
        const roll = rollD20();
        if (roll <= 10) {
          logs.push(`🏰 744년: [역사] ${event} -> 주사위 ${roll} - 노장이 되어 고향 영지를 지켰습니다.`);
        } else if (roll <= 14) {
          const res = runCombatSurvival(yr, event + " (작센 최후 전투)", true, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            gfHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${gfHateSaxons})`);
          }
        } else if (roll <= 18) {
          gfGlory += 25;
          logs.push(`👑 744년: [역사] ${event} -> 주사위 ${roll} - 파리 대성당에서 섭정 베르트라다 왕비의 성대하고 역사적인 복귀식 대열에 합류했습니다. (+25 Glory)`);
        } else {
          gfGlory += 100;
          logs.push(`🔍 744년: [역사] ${event} -> 주사위 ${roll} - 피핀 국왕의 어전에서 아키텐 위노 공작이 심어놓은 흉악한 세작을 기지로 생포해 상을 받았습니다! (+100 Glory)`);
        }
      }
    }

    if (!gfDead) {
      gfDeathYr = 744 + rollD20();
      gfCause = "평화로운 영면 (Old Age)";
      logs.push(`👴 ${gfDeathYr}년: 은퇴한 할아버님(시조 고드프루아 경)께서 평화롭게 침상에서 영면에 드셨습니다.`);
    }

    setGrandfatherGlory(gfGlory);
    setGrandfatherDeathYear(gfDeathYr);
    setGrandfatherDeathCause(gfCause);
    setGrandfatherHates({ saxons: gfHateSaxons, moors: gfHateMoors });

    let inheritedSaxons = gfHateSaxons > 10 ? gfHateSaxons : 0;
    let inheritedMoors = gfHateMoors > 10 ? gfHateMoors : 0;

    // 👨 [부친의 연대기 (745~766)]
    logs.push("");
    logs.push("📜 [부친의 생애: 연대기 시작 745년]");
    let fGlory = 2500 + Math.floor(gfGlory / 10);
    logs.push(`🎁 745년: 부친(724년생)께서 성인식을 마치고 조부의 위대한 유산 1/10을 물려받아 ${fGlory} Glory로 당당히 기사 서임을 받으셨습니다.`);
    
    let fHateSaxons = inheritedSaxons;
    let fHateMoors = inheritedMoors;
    let fHateDanes = 0;
    let fDead = false;
    let fDeathYr = 766;
    let fCause = '노환';
    let skipYearsUntil = 0;

    for (let yr = 745; yr <= 766; yr++) {
      if (fDead) continue;
      if (yr < skipYearsUntil) {
        logs.push(`✈️ ${yr}년: 부친께서는 란드리 경과 함께 비잔티움 대원정에 참전하시어 머나먼 동방에 계십니다. (Garrison 및 전투 자동 생존)`);
        continue;
      }

      if (yr === 745) {
        const event = "부친의 영광스러운 결혼: 가문 번영과 동맹의 기틀을 닦는 기사 가문의 결합을 성취하셨습니다.";
        const roll = rollD20();
        if (roll <= 5) {
          fGlory += 100;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 부친께서 현명한 조언을 해주는 양가 가문의 아가씨를 맞아 혼인하셨습니다. (+100 Glory)`);
        } else if (roll <= 10) {
          fGlory += 200;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 가문에 헌신적인 공로를 세워, 아르덴 영주로부터 직접 귀부인의 손을 약속받으셨습니다! (+200 Glory)`);
        } else {
          fGlory += 400;
          logs.push(`👰 745년: [가문] ${event} -> 주사위 ${roll} - 적대 가문 영주의 어여쁜 여식을 극적인 기사 결투 끝에 쟁취하여 가문을 일으켰습니다! (+400 Glory)`);
        }
      } else if (yr === 746) {
        const event = "롤랑 경의 탄생 및 셉티마니아 원정: 무어인들의 셉티마니아 습격에 동참하거나, 알레마니아 반란을 피의 숙청으로 다스린 혹독한 군무에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "전역사 (Illness)";
          logs.push(`💀 746년: [역사] ${event} -> 주사위 ${roll} - 무서운 군영 내 돌림병에 걸려 롤랑 경의 탄생 소식만을 듣고 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 746년: [가문] ${event} -> 주사위 ${roll} - 기쁜 롤랑 경의 탄생을 전장에서 전해 듣고 가문의 축배를 올렸습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (셉티마니아 무어인 방어전)", false, -1, false, 25);
          if (!res.dead) {
            const hVal = rollD3();
            fHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${fHateMoors})`);
          }
        } else if (roll <= 18) {
          logs.push(`🪓 746년: [역사] ${event} -> 주사위 ${roll} - 알레마니아 반역자들을 징벌하는 피핀의 대숙청 대열에 참여하셨습니다. 잔혹성(Cruel) 1d6 기질 획득!`);
        } else {
          fGlory += 50;
          logs.push(`✝️ 746년: [가문] ${event} -> 주사위 ${roll} - 마침내 롤랑 경의 장엄한 탄생을 직접 보고 기사로서 성인 묘비에 참배하며 믿음을 다짐했습니다. (+1 Love God, +50 Glory)`);
        }
      } else if (yr === 747) {
        const event = "카를로만 공의 순례 동행: 궁정의 번잡함을 떠나 카를로만 공을 모시고 롬바르디아를 거쳐 로마로 순례 여행을 다녀오거나, 신앙의 부름을 받았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "순례 중 사망 (Accident)";
          logs.push(`💀 747년: [역사] ${event} -> 주사위 ${roll} - 알프스 산맥을 돌파하던 도중 눈사태로 낙사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 747년: [역사] ${event} -> 주사위 ${roll} - 쾰른 궁정의 보초를 섰습니다.`);
        } else if (roll <= 18) {
          fGlory += 25;
          logs.push(`✝️ 747년: [역사] ${event} -> 주사위 ${roll} - 카를로만 공의 은퇴길 로마 대순례단에 하객으로 동참해 축복을 목도했습니다. (+25 Glory)`);
        } else {
          fDead = true;
          fDeathYr = yr + rollD20();
          fCause = "성스러운 은수사 은퇴 (Hermit)";
          logs.push(`🌲 747년: [역사] ${event} -> 주사위 ${roll} - 마인츠 대주교 보니파키우스를 접견한 후 깊은 성령을 깨달아 아르덴 깊은 숲의 은수사(Hermit)로 기꺼이 은퇴하셨습니다. (+1 Love God, 기사 전역)`);
        }
      } else if (yr === 748) {
        const event = "무훈시 [Raoul de Cambrai] & [역사]: 베르니에와 베아트릭스가 고난 끝에 죄를 씻기 위한 순례 도중 무어인 기습을 받아 스페인 지하 감옥에 갇혔습니다. [역사] 반역도당 그리포 왕자가 바이에른으로 패주했고, 피핀 왕의 중재로 타실로 3세가 공작으로 정식 등극했습니다.";
        logs.push(`🏰 748년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 749) {
        const event = "바이에른 전역 및 그리포 왕자 탈출 사건: 반역자 그리포 왕자가 피핀을 피해 탈출하자, 그의 바이에른 지지 병력들을 격파하는 평정 작전에 참전했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "바이에른 전사 (Combat)";
          logs.push(`💀 749년: [역사] ${event} -> 주사위 ${roll} - 레겐스부르크 근교의 기습전에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 749년: [역사] ${event} -> 주사위 ${roll} - 기사단 행군 대열의 중심을 지켰습니다.`);
        } else if (roll <= 18) {
          runCombatSurvival(yr, event + " (바이에른 기습 공세)", false, -1, true, 100);
        } else {
          logs.push(`⚠️ 749년: [역사] ${event} -> 주사위 ${roll} - 포로 그리포 왕자의 참모진 경비를 전담했으나, 한밤중 감시망이 뚫려 왕자가 도주하는 명예 훼손을 겪었습니다. (Honor 수치 하락)`);
        }
      } else if (yr === 750) {
        const event = "작센 대전투: 작센 추장 저스타몽이 선포한 이교 대침공에 대항해, 피핀 국왕의 선봉으로 작센 벌판에서 치열한 혈투를 전개했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 750년: [역사] ${event} -> 주사위 ${roll} - 작센인들의 숲속 함정에 포위되어 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 750년: [역사] ${event} -> 주사위 ${roll} - 영지 수비 근무를 섰습니다.`);
        } else {
          const res = runCombatSurvival(yr, event, false, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 격렬한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 751) {
        const event = "피핀 3세의 대관식 경비: 메로빙거 최후의 국왕 힐데리히 3세의 폐위식과 피핀 3세의 새로운 프랑크 국왕 즉위식 대관 경비를 맡았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "수비 중 사망 (Feud)";
          logs.push(`💀 751년: [역사] ${event} -> 주사위 ${roll} - 반역도당의 황궁 난입 사태에서 왕가를 지키다 서거하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 751년: [역사] ${event} -> 주사위 ${roll} - 즉위식장 외부 바리케이드를 경비했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (반역 세작 처단)", false, 0, true, 25);
        } else {
          fGlory += 50;
          logs.push(`👑 751년: [역사] ${event} -> 즉위 경비 주사위 ${roll} - 성스러운 피핀 3세의 대관 미사에서 왕의 최측근 근위대로 기립하며 큰 명예를 획득했습니다! (+50 Glory)`);
        }
      } else if (yr === 752) {
        const event = "무훈시 [Mainet] & [역사]: 사생아들의 독살 음모를 기지로 피해 툴레도로 망명한 젊은 샤를마뉴(마이네)가 술탄 갈라프레의 휘하 용병으로 뛰며 거인 카이망과 브라이망을 영웅적으로 베고, 공주 갈리엔나의 숭고한 구애를 쟁취했습니다. [역사] 이교도들이 남방 국경을 무단 습격하였으며, 샤를마뉴의 친동생 카를로만 2세가 출생했습니다.";
        logs.push(`🏰 752년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 753) {
        const event = "비부르크 산 전투: 작센 이교도들의 반란에 맞서 피핀 왕과 함께 출정하여 대지진 속 비부르크 산에서 격렬한 전투를 벌였습니다. (대주교 힐데가르 전사)";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 753년: [역사] ${event} -> 주사위 ${roll} - 비부르크 산 절벽 전장에서 추락사 혹은 장렬히 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 753년: [역사] ${event} -> 주사위 ${roll} - 쾰른 군영을 수호했습니다.`);
        } else if (roll <= 15) {
          const res = runCombatSurvival(yr, event + " (비부르크 참사)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 극심한 원한 +${hVal} (누적: ${fHateSaxons})`);
          }
        } else {
          fGlory += 50;
          logs.push(`🗡️ 753년: [역사] ${event} -> 주사위 ${roll} - 국경을 이탈해 암약을 시도하던 반역자 그리포를 검거하는 기사 특별 부대를 이끌어 활약했습니다! (+50 Glory)`);
        }
      } else if (yr === 754) {
        const event = "나르본 공성전 및 알프스 행군: 교황의 동맹 요청에 응하여 반역 동맹군에 맞서 알프스를 돌파하거나 사라센 세력을 격퇴하기 위해 나르본 탈환전에 종군했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "무어 전사 (Combat)";
          logs.push(`💀 754년: [역사] ${event} -> 주사위 ${roll} - 나르본 성문을 부수던 와중 적들의 화포 혹은 불화살을 맞고 전사하셨습니다.`);
        } else if (roll <= 8) {
          logs.push(`🏰 754년: [역사] ${event} -> 주사위 ${roll} - 교황 전령을 접견하는 경호 임무를 수행했습니다.`);
        } else if (roll <= 14) {
          runCombatSurvival(yr, event + " (알프스 원정 전투)", false, -1, true, 100);
        } else if (roll <= 18) {
          fGlory += 25;
          logs.push(`🇮🇹 754년: [역사] ${event} -> 주사위 ${roll} - 롬바르디아 영지 약탈 공방전에서 적들의 식량 창고를 털어 군에 공헌했습니다. (+25 Glory)`);
        } else {
          const res = runCombatSurvival(yr, event + " (나르본 탈환 대작전)", false, 0, true, 50);
          if (!res.dead) {
            const hVal = rollD3();
            fHateMoors += hVal;
            logs.push(`  └ [증오 획득] 무어인에 대한 증오 +${hVal} (누적: ${fHateMoors})`);
          }
        }
      } else if (yr === 755) {
        const event = "무훈시 [Lion de Bourges] & [Orson de Beauvais]: 사자 젖을 먹고 자란 영웅 리옹이 친부모를 찾아 위대한 모험을 돌파하고 이탈리아 Monterose성을 공성했으며, [Orson de Beauvais] Chanson에서 충직한 밀로 기사가 성지 예루살렘의 암흑 감옥에 갇힌 늙은 아버지 오르송 백작을 극적으로 탈환해 사법적 정의를 지켰습니다.";
        logs.push(`🏰 755년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 756) {
        const event = "파비아 포위 공성전: 교황령 수호를 방해하는 롬바르디아 왕 아이스툴프를 징벌하기 위해 파비아 성벽 아래에서 격전을 전개했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "파비아 전사 (Combat)";
          logs.push(`💀 756년: [역사] ${event} -> 주사위 ${roll} - 파비아 성루 기습 작전에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 756년: [역사] ${event} -> 주사위 ${roll} - 이탈리아 고지 점령대를 경계했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (파비아 성문 공략)", false, -1, true, 50);
        } else {
          fGlory += 25;
          logs.push(`⛪ 756년: [역사] ${event} -> 주사위 ${roll} - 승리 후 로마 바티칸 성당의 정예 황실 가드로 배정되어 교황령 수호의 증인이 되었습니다. (+25 Glory)`);
        }
      } else if (yr === 757) {
        const event = "덴마크 정벌 원정: 쾰른의 백작 두온과 피핀 왕의 공세에 동참하여 북방의 덴마크인들을 제압하고 국위를 떨쳤습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "덴마크 전사 (Combat)";
          logs.push(`💀 757년: [역사] ${event} -> 주사위 ${roll} - 덴마크 상륙 도중 전함 위에서 적의 도끼에 스러지셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 757년: [역사] ${event} -> 주사위 ${roll} - 초소 순찰을 돌며 조용히 보냈습니다.`);
        } else if (roll <= 18) {
          const res = runCombatSurvival(yr, event + " (바이킹 결전)", false, 0, true, 100);
          if (!res.dead) {
            const hVal = rollD3();
            fHateDanes += hVal;
            logs.push(`  └ [증오 획득] 덴마크 바이킹에 대한 원한 +${hVal}`);
          }
        } else {
          fHateDanes += 6;
          logs.push(`⚠️ 757년: [역사] ${event} -> 주사위 ${roll} - 덴마크 국왕의 오만한 기습에 걸려 머리가 깎인 채로 사절에서 풀려나는 엄청난 굴욕을 겪었습니다. (Honor 대폭 삭감, 덴마크인 증오 대폭 상승)`);
        }
      } else if (yr === 758) {
        const event = "작센 보복 정벌: 매년 300필의 군마 조공을 거부하고 거듭 반란을 일으키는 작센 영토로 침투해 강제 개종과 무자비한 토벌전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 758년: [역사] ${event} -> 주사위 ${roll} - 불타는 작센 성읍의 철수 도중 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 758년: [역사] ${event} -> 주사위 ${roll} - 국경 참호를 보수했습니다.`);
        } else if (roll <= 16) {
          const res = runCombatSurvival(yr, event + " (작센 강제정벌 레이드)", false, 0, true, 25);
          if (!res.dead) {
            const hVal = rollD3();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        } else {
          const res = runCombatSurvival(yr, event + " (작센 대학살 징벌전)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센인에 대한 뼈에 사무친 복수심 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 759) {
        const event = "무훈시 [Les Lorrains] & [역사]: 영예로운 Bego 백작이 멧돼지 사냥 도중 가문의 오래된 원수인 Fromont 패거리에게 야만적으로 암살당하여 피비린내 나는 복수극이 재발했습니다. [역사] 피핀 국왕이 마침내 사라센 무어인들을 완전히 몰아내어 남부 Septimania 영토를 완전히 탈환하였습니다.";
        logs.push(`🏰 759년: [역사] ${event}\n  └ 📖 평온한 공백기: 룰북 규칙에 따라 주사위 판정 없이 안전하게 한 해를 보냈습니다.`);
      } else if (yr === 760) {
        const event = "리무쟁 공성전 및 쾰른 사절단: 아키텐 전역의 포문을 열기 위해 리무쟁 성을 공격하거나, 반역을 꾀하는 토밀 가문의 계획에 맞서 사절로 나섰습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "아키텐 전사 (Combat)";
          logs.push(`💀 760년: [역사] ${event} -> 주사위 ${roll} - 리무쟁 공성망을 공격하던 와중 화살을 맞아 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 760년: [역사] ${event} -> 주사위 ${roll} - 후방 포병대를 경호했습니다.`);
        } else if (roll <= 10) {
          runCombatSurvival(yr, event + " (리무쟁 공성 돌파)", false, 0, true, 50);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (아키텐 수림 게릴라전)", false, 0, true, 25);
        } else {
          fGlory += 200;
          skipYearsUntil = 763;
          logs.push(`✈️ ${yr}년: [역사] ${event} -> 주사위 ${roll} - 쾰른의 백장 란드리 경의 신뢰를 받아 비잔티움 대원정단의 참모로 전격 합류했습니다! 761~762년 동안 로마를 거쳐 콘스탄티노플에서 장대한 외교 원정을 수행합니다. (+200 Glory, 명예 수치 대폭 상승)`);
        }
      } else if (yr === 761) {
        const event = "부르주 포위전 및 브르타뉴 습격: 아키텐 정벌 전역의 핵심 거점인 부르주(Bourges) 성을 성공적으로 공략하여 대승을 거두었습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "부르주 전사 (Combat)";
          logs.push(`💀 761년: [역사] ${event} -> 주사위 ${roll} - 부르주 성벽 함락 작전에서 적의 불벼락을 맞고 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 761년: [역사] ${event} -> 주사위 ${roll} - 기사단 예비 진지를 보수했습니다.`);
        } else if (roll <= 17) {
          runCombatSurvival(yr, event + " (부르주 격파전)", false, 0, true, 50);
        } else {
          runCombatSurvival(yr, event + " (브르타뉴 소탕)", false, 0, true, 25);
        }
      } else if (yr === 762) {
        const event = "아키텐 약탈전 및 왕가의 화해: 아키텐 전초 기지를 견고하게 세우고, 어린 롤랑이 왕궁 음식물 서리를 하던 당돌한 순간과 가문의 기쁨을 지켜보았습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "아키텐 전사 (Combat)";
          logs.push(`💀 762년: [역사] ${event} -> 주사위 ${roll} - 아키텐 기습군의 정찰 칼날에 희생되셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 762년: [역사] ${event} -> 주사위 ${roll} - 아르헨돈 요새 수비를 섰습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (아키텐 산악 약탈전)", false, 0, true, 25);
        } else {
          fGlory += 50;
          logs.push(`👑 762년: [가문] ${event} -> 주사위 ${roll} - 왕궁 기사단 훈련 중 어린 아들 롤랑이 왕의 식탁에서 대담하게 고기를 훔쳐 아버지를 감탄시키고 밀로 백작 가문이 화해하는 역사적 현장을 배석했습니다. (+50 Glory)`);
        }
      } else if (yr === 763) {
        const event = "쾰른 라 로슈 성의 기적적인 방어: 토밀과 말랭그가 이끄는 대반란군의 겹겹이 쌓인 포위를 뚫고 성을 사수했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "라 로슈 전사 (Combat)";
          logs.push(`💀 763년: [역사] ${event} -> 주사위 ${roll} - 포위당한 라 로슈 성루에서 적의 발석기에 깔려 전사하셨습니다.`);
        } else if (roll <= 5) {
          logs.push(`🏰 763년: [역사] ${event} -> 주사위 ${roll} - 화살 통을 날 나르며 공성에 저항했습니다.`);
        } else {
          runCombatSurvival(yr, event + " (성루 총사수 결전)", false, -1, true, 50);
        }
      } else if (yr === 764) {
        const event = "라 로슈 제2차 공성 및 툴루즈 함락: 오베리 주교와 함께 성을 격파하고 쾰른을 탈환하거나, 아키텐의 수도 툴루즈 점령 작전에 합류했습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "툴루즈 전사 (Combat)";
          logs.push(`💀 764년: [역사] ${event} -> 주사위 ${roll} - 툴루즈 성문 돌파 시도 중 성루 위에서 쏟아지는 화약/기름에 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 764년: ${event} -> 주사위 ${roll} - 보급선 방어를 담당했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오베리 백작의 라 로슈 탈환전)", false, 0, true, 50);
        } else {
          runCombatSurvival(yr, event + " (툴루즈 대공격)", false, 0, true, 25);
        }
      } else if (yr === 765) {
        const event = "오트페이유 공성과 작센 족장 브로히막스 격퇴: 쾰른의 평화를 깨려는 작센 군단을 맞아 족장 브로히막스와의 대결에서 목숨을 건 수호전을 벌였습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "작센 전사 (Combat)";
          logs.push(`💀 765년: [역사] ${event} -> 주사위 ${roll} - 쾰른을 지키는 격돌에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 765년: [역사] ${event} -> 주사위 ${roll} - 수비 진영을 정리했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (오트페이유 포위전)", false, 0, true, 50);
        } else {
          const res = runCombatSurvival(yr, event + " (브로히막스 결전)", false, -1, true, 100);
          if (!res.dead) {
            const hVal = rollD6();
            fHateSaxons += hVal;
            logs.push(`  └ [증오 획득] 작센 군단에 대한 증오 +${hVal} (누적: ${fHateSaxons})`);
          }
        }
      } else if (yr === 766) {
        const event = "부친 은퇴 전 마지막 참전: 샤를마뉴 왕자 및 위비앙의 세력과 함께 몽펠리에와 에그르몽 포위 공성전에 참전하여 최후의 기사도 영광을 불살랐습니다.";
        const roll = rollD20();
        if (roll === 1) {
          fDead = true;
          fDeathYr = yr;
          fCause = "최후의 전사 (Combat)";
          logs.push(`💀 766년: [역사] ${event} -> 주사위 ${roll} - 아들 롤랑의 성인식을 몇 달 앞두고 가문의 무훈을 빛내며 성벽 아래에서 전사하셨습니다.`);
        } else if (roll <= 10) {
          logs.push(`🏰 766년: [역사] ${event} -> 주사위 ${roll} - 황실 가드 임무를 다했습니다.`);
        } else if (roll <= 15) {
          runCombatSurvival(yr, event + " (몽펠리에 공성전)", false, 0, true, 50);
        } else {
          const res = runCombatSurvival(yr, event + " (에그르몽 대승)", false, 0, true, 50);
          if (!res.dead) {
            fGlory += 25;
            logs.push(`⛪ 766년: [역사] ${event} -> 주사위 ${roll} - 이교도 귀족 위비앙 부부의 역사적인 기독교 세례 성사에서 가문의 명예 하객 대열을 호위하셨습니다! (+25 Glory)`);
          }
        }
      }
    }

    if (!fDead) {
      fDeathYr = 766 + rollD20();
      fCause = "평화로운 영면 (Old Age)";
      logs.push(`👴 ${fDeathYr}년: 은퇴한 아버님(제라르 경)께서 영광스러운 대공의 은퇴 생활 도중 침상에서 평화로이 서거하셨습니다.`);
    }

    setFatherGlory(fGlory);
    setFatherDeathYear(fDeathYr);
    setFatherDeathCause(fCause);
    setFatherHates({ saxons: fHateSaxons, moors: fHateMoors });

    logs.push("");
    logs.push("🎉 [연대기 결과 요약]");
    logs.push(`• 조부 최종 명예: ${gfGlory} Glory (생존기간: 700~${gfDeathYr}, 사인: ${gfCause})`);
    logs.push(`• 부친 최종 명예: ${fGlory} Glory (생존기간: 724~${fDeathYr}, 사인: ${fCause})`);
    logs.push(`• 조상으로부터 플레이어 캐릭터(롤랑 경)에게 계승될 유산:`);
    logs.push(`  - 계승 명예: +${Math.floor(fGlory / 10)} Glory (부친 명예의 1/10)`);
    if (fHateSaxons > 10) logs.push(`  - 계승 증오: 작센인에 대한 증오 Passion [${fHateSaxons}]`);
    if (fHateMoors > 10) logs.push(`  - 계승 증오: 이교도(무어인)에 대한 증오 Passion [${fHateMoors}]`);

    setAncestorRollLog(logs);
    setAncestorApplied(false);
  };


  const applyAncestorLegacy = () => {
    if (ancestorApplied) return;
    
    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      const inheritedGlory = Math.floor(fatherGlory / 10);
      updated.gear.gloryTotal = (updated.gear.gloryTotal || 1000) + inheritedGlory;

      if (fatherHates.saxons > 10) {
        updated.passions.hateSaxons = fatherHates.saxons;
      }
      if (fatherHates.moors > 10) {
        updated.passions.hateMoors = fatherHates.moors;
      }

      if (updated.family && updated.family.members) {
        updated.family.members = updated.family.members.map(m => {
          if (m.id === 'albert' || m.relation === '조부') {
            return {
              ...m,
              lifeYears: `700~${grandfatherDeathYear}`,
              status: '사망',
              deathCause: grandfatherDeathCause,
              note: `샤를마뉴 대제 초기의 백작 기사이자 전설적인 용사. ${grandfatherDeathCause}로 서거. 최종 명예 ${grandfatherGlory} Glory.`
            };
          }
          if (m.id === 'gerard' || m.relation === '부친') {
            return {
              ...m,
              lifeYears: `724~${fatherDeathYear}`,
              status: '사망',
              deathCause: fatherDeathCause,
              note: `작센 및 파비아 원정에 참전한 부친. ${fatherDeathCause}로 장렬히 서거. 최종 명예 ${fatherGlory} Glory.`
            };
          }
          return m;
        });
      }

      return updated;
    });

    setAncestorApplied(true);
    alert(`조상들의 연대기 유산이 캐릭터 시트와 가계도에 영구히 반영되었습니다!\n(계승 명예: +${Math.floor(fatherGlory / 10)} Glory)`);
  };

  const handleFamilyChange = (field, value) => {
    setCharacter(prev => ({ ...prev, family: { ...prev.family, [field]: value } }));
  };

  const addLog = (msg) => {
    setLogMessages(prev => [msg, ...prev]);
  };

  // ══════════════════════════════════════════════════
  // STEP 2: AGING LOGIC
  // ══════════════════════════════════════════════════
  const rollAging = () => {
    const age = character.personal.age || 0;
    if (age < 30) {
      addLog(`[노화]: ${age}세 (30세 미만). 노화 주사위를 생략합니다.`);
      setAgingD20(20);
      setAgingLosses([]);
      setAgingApplied(true);
      return;
    }

    const d20 = Math.floor(Math.random() * 20) + 1;
    setAgingD20(d20);

    let numRolls = 0;
    if (d20 === 1) numRolls = 5;
    else if (d20 <= 3) numRolls = 4;
    else if (d20 <= 6) numRolls = 3;
    else if (d20 <= 10) numRolls = 2;
    else if (d20 <= 15) numRolls = 1;

    const losses = [];
    const stats = ["SIZ", "DEX", "STR", "CON", "APP"];
    for (let i = 0; i < numRolls; i++) {
      const d6 = Math.floor(Math.random() * 6) + 1;
      if (d6 <= 5) {
        losses.push(stats[d6 - 1]);
      } else {
        losses.push("None");
      }
    }

    setAgingLosses(losses);
    setAgingApplied(false);
  };

  const applyAging = () => {
    if (agingApplied) return;
    const resolvedLosses = agingLosses.filter(l => l !== "None");

    setCharacter(prev => {
      const updatedAttr = { ...prev.attributes };
      resolvedLosses.forEach(stat => {
        const key = stat.toLowerCase();
        updatedAttr[key] = Math.max(1, (updatedAttr[key] || 0) - 1);
      });
      // Adjust current HP if SIZ or CON changed
      updatedAttr.currentHp = Math.min(updatedAttr.currentHp || 0, updatedAttr.siz + updatedAttr.con);
      return { ...prev, attributes: updatedAttr };
    });

    const lossText = resolvedLosses.length > 0 ? resolvedLosses.join(', ') + ' 각 -1' : '하락 없음';
    addLog(`[노화 적용]: d20 [${agingD20}] -> ${lossText}.`);
    setAgingApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 3: HARVEST LOGIC
  // ══════════════════════════════════════════════════
  const rollHarvest = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setHarvestRoll(d20);

    const stewardship = character.skills.stewardship || 3;
    let mult = 1.0;
    let outcome = "성공";

    if (d20 === 20) {
      mult = 0.5; outcome = "대실패";
    } else if (d20 === 1 || d20 === stewardship) {
      mult = 1.5; outcome = "대성공";
    } else if (d20 < stewardship) {
      mult = 1.0; outcome = "성공";
    } else {
      mult = 0.75; outcome = "실패";
    }

    const revenue = Math.round(6 * mult);
    setHarvestMult(mult);
    setHarvestRevenue(revenue);
    setHarvestApplied(false);
  };

  const applyHarvest = () => {
    if (harvestApplied) return;
    setCharacter(prev => {
      const updatedGear = { ...prev.gear };
      updatedGear.cash = (updatedGear.cash || 0) + harvestRevenue;
      return { ...prev, gear: updatedGear };
    });

    addLog(`[영지 수확]: 영지관리 d20 [${harvestRoll}] vs [${character.skills.stewardship}]. 배율 x${harvestMult} -> £${harvestRevenue} 획득!`);
    setHarvestApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 4: SURVIVAL LOGIC
  // ══════════════════════════════════════════════════
  const rollSurvival = () => {
    // Squire
    const sRoll = Math.floor(Math.random() * 20) + 1;
    setSquireSurvivalRoll(sRoll);
    let sStatus = "건강함";
    if (sRoll === 1) sStatus = "사망 위험!";
    else if (sRoll === 2) sStatus = "질병 (내년 판정 -5)";
    setSquireStatus(sStatus);

    // Horse
    const hRoll = Math.floor(Math.random() * 20) + 1;
    setHorseSurvivalRoll(hRoll);
    let hStatus = "건강함";
    if (hRoll === 1) hStatus = "사망 위험!";
    else if (hRoll === 2) hStatus = "질병 (내년 판정 -5)";
    setHorseStatus(hStatus);

    setSurvivalApplied(false);
  };

  const applySurvival = () => {
    if (survivalApplied) return;
    addLog(`[동료 생존]: 종자 d20 [${squireSurvivalRoll}] -> ${squireStatus}, 군마 d20 [${horseSurvivalRoll}] -> ${horseStatus}`);
    setSurvivalApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 5: PERSONAL EVENT LOGIC (Table 10-9)
  // ══════════════════════════════════════════════════
  const personalEventTable = {
    1: { name: "정숙 (Chaste) 시험", trait: "chaste", crit: "레이디의 유혹을 뿌리치고 도덕을 증명했습니다! 정숙 +1", succ: "Serving wenches의 유혹을 물리쳤습니다. 정숙 체크!", fail: "사생아가 생겼습니다. 내년에 태어납니다. 음탕 체크!", fumb: "유혹에 들키는 수치! 은밀 기사 음모 적발. 명예 -1" },
    2: { name: "열정 (Energetic) 시험", trait: "energetic", crit: "엄청난 헌신! 훈련 포인트 +2 추가!", succ: "성실하게 수련했습니다. 훈련 포인트 +1 획득!", fail: "태만하게 여흥과 음주로 겨울을 보냈습니다. 나태 체크!", fumb: "완전한 나태와 방종! 이번 겨울 훈련과 실습 단계(Step 8)를 완전히 건너뜁니다!" },
    3: { name: "관용 (Forgiving) 시험", trait: "forgiving", crit: "친족의 무거운 잘못에 눈물을 흘리며 포용했습니다. 관용 +1", succ: "어전회의 모욕을 유머로 승화시켰습니다. 관용 체크!", fail: "라이벌 기사와의 사소한 언쟁으로 결투 신청을 감행했습니다. 실패 시 명예 -1", fumb: "이성을 잃고 라이벌을 검으로 베어 가문의 참혹한 복수극(Feud)을 열었습니다!" },
    4: { name: "관대 (Generous) 시험", trait: "generous", crit: "빈민 구제에 전재산의 절반을 기부했습니다. 관대 +1, 명망 +1", succ: "극빈층에게 £1을 선사했습니다. 관대 체크!", fail: "왕궁에서 지나친 탐욕과 명예욕을 부렸습니다. 이기 체크!", fumb: "지독한 이기심으로 인해 평민, 종교, 영지 명망(Standings) 각 -1 하락!" },
    5: { name: "정직 (Honest) 시험", trait: "honest", crit: "위증 압박 속에서도 진실을 굳게 대변했습니다. 정직 +1", succ: "주군의 사리사욕에 대해 솔직히 간언했습니다. 정직 체크!", fail: "비열하게 거짓말을 하다 들통났습니다. 무작위 명망 -1 하락", fumb: "거짓말의 대명사로 전락해 기사의 기틀인 명예(Honor)가 1점 깎입니다!" },
    6: { name: "정의 (Just) 시험", trait: "just", crit: "교회 비리를 눈감지 않고 법을 관철했습니다. 정의 +1", succ: "정당한 영지 재판 판결을 내렸습니다. 정의 체크!", fail: "뇌물 £1을 챙기는 부정을 저질렀습니다. 평민 명망 -1", fumb: "대주교에게 부정한 판결로 대중 앞에서 호된 질타를 당했습니다. 명예 -1" },
    7: { name: "자비 (Merciful) 시험", trait: "merciful", crit: "무고함을 증명하고 나를 해하려 한 정적을 사면했습니다. 자비 +1", succ: "영토 분쟁을 평화적으로 합의 종결했습니다. 자비 체크!", fail: "사소한 기득권을 지키려 피농민의 딸을 가혹한 벌로 복역했습니다. 잔혹 체크!", fumb: "빈민들의 애절한 구걸을 묵살했습니다. 교회 및 평민 명망 각 -1 하락" },
    8: { name: "겸손 (Modest) 시험", trait: "modest", crit: "타인이 나의 전술적 업적을 가로챘음에도 웃으며 축하했습니다. 겸손 +1", succ: "동료들을 먼저 주군의 만찬 테이블에 앉혔습니다. 겸손 체크!", fail: "가수 광대를 고용해 위업을 부풀렸습니다. £1 지출, 내년 영예 2배", fumb: "지나친 boast로 분노한 라이벌 기사에게 명예 배상금 £1을 강제 배상했습니다." },
    9: { name: "신중 (Prudent) 시험", trait: "prudent", crit: "현명한 보급책으로 겨울 영지의 굶주림을 사전에 면했습니다. 신중 +1", succ: "사냥터 무리한 계곡 점프를 사양했습니다. 신중 체크!", fail: "추운 눈폭풍 속에 고행 길을 강행했습니다. CON 굴림 실패 시 즉각 노화 d20!", fumb: "무모한 모험으로 인해 무작위 명망 수치가 1점 깎입니다." },
    10: { name: "절제 (Temperate) 시험", trait: "temperate", crit: "자발적 빈곤 서약으로 절제를 증명했습니다. £1 획득, 절제 +1", succ: "근검절약하는 겨울 라이프를 지켰습니다. 절제 체크!", fail: "지나친 궁정 명품을 지르고 말았습니다. 내년 유지비 상향 의무화.", fumb: "퇴폐적인 호화 잔치로 재산을 탕진하여 내년에 Rich 유지비 배수 지불!" },
    11: { name: "신뢰 (Trusting) 시험", trait: "trusting", crit: "온갖 혐의로 몰린 정인을 변론하여 믿음을 수호했습니다. 신뢰 +1", succ: "라이벌 기사단에 믿음을 표시하며 영지를 맡겼습니다. 신뢰 체크!", fail: "말도 안 되는 궁정 루머로 이웃을 무고했습니다. 주군의 사법 굴림 개입.", fumb: "wild한 비난 무고로 주군을 분노케 해, 주군 명망(Standing) -1 하락" },
    12: { name: "용맹 (Valorous) 시험", trait: "valorous", crit: "주군을 기습한 거대 야생 멧돼지의 목을 따 구출했습니다! 용맹 +1, 50 Glory", succ: "화마에 휩싸인 동료의 마구간에서 말을 구했습니다. 용맹 체크, 10 Glory", fail: "추운 작센 정찰 작전에서 거짓 꾀병으로 숨었습니다. 겁쟁이 체크!", fumb: "늑대 한 마리에 소스라치게 놀라 낙마하여 도주했습니다. 명예 -1" },
    13: { name: "왕 사랑 (Love [Charlemagne]) 시험", trait: "loveCharlemagne", crit: "황제의 가호! 내년 전투나 모험 중 무작위 1회 주사위 재굴림 찬스!", succ: "순찰사 앞에서 주군을 영광스럽게 찬양했습니다. 국왕 사랑 체크!", fail: "기사들이 술자리에서 황제를 조롱할 때 함께 껄껄댔습니다. (아무일 없음)", fumb: "황제의 명예로운 위업에 의심을 제기해, 국왕 명망(Standing) -1 하락" },
    14: { name: "명예 (Honor) 시험", trait: "honor", crit: "주군이 영지를 보상으로 하사했습니다! 장원 2개 및 £2d6 소지금 획득!", succ: "전령들이 명예로운 품격을 송축합니다. 20 Glory 획득, 명예 체크!", fail: "주인의 환대를 짓밟는 결례를 범했습니다. 사죄용 연회 개최비 £1 지출.", fumb: "비열한 도적과 야합하여 비열한 수치를 떨쳤습니다. 무작위 명망 -2 하락" },
    15: { name: "가족 사랑 (Love [family]) 시험", trait: "loveFamily", crit: "가문 명예 결투에 대리 출전해 사투를 벌였습니다! 3d6 노아머 부상, 용맹/가족사랑/가문명망 체크!", succ: "피소된 가문 일원의 신원 보증을 서주었습니다. 가문 명망 체크!", fail: "의회를 앞두고 혈육을 등지고 험담을 하였습니다. 가족 사랑 -1", fumb: "죽음의 위기에 빠진 삼촌이나 사촌의 구원 요청을 묵살했습니다. 가족 사랑 -2" },
    16: { name: "신 사랑 (Love [God]) 시험", trait: "loveGod", crit: "거룩한 성지 순례를 다녀왔습니다. £1 지출, 신 사랑 +1, 교회 명망 +1 (훈련 단계 스킵)", succ: "성직자의 감동적 설교의 모범 사례로 칭송받았습니다. 신 사랑 체크!", fail: "폭언과 신성모독적 저주를 내뱉었습니다. 교회 명망 -1", fumb: "정기 주일 미사를 수차례 거부하고 타락했습니다. 신 사랑 -1" },
    17: { name: "주군 명망 (Standing [lord]) 시험", trait: "standingLord", crit: "주군이 장비와 군마를 최고급 전투마(Charger)로 전면 무상 교체해주었습니다!", succ: "주군이 위업을 기려 선물을 하사합니다. 탄생 기프트 1개 획득!", fail: "전리품 분배에서 철저히 소외되었습니다. 쟁취 시 £1 및 이기 체크!", fumb: "불충 혐의로 몰렸습니다. 사법 도전을 펼치거나 명예 1점 영구 삭감." },
    18: { name: "교회 명망 (Standing [Church]) 시험", trait: "standingChurch", crit: "주교가 가을 대의회에서 축사를 올렸습니다. 25 Glory 및 국왕 명망 +1", succ: "주교의 전용 사냥 파티에 특별 초대를 받았습니다. 수렵 체크!", fail: "어전에서 사제에게 비열한 성정으로 공개 비난당했습니다. 평민 명망 -1", fumb: "교회 불경죄로 영구 순례 퀘스트를 명령받았습니다. 거부 시 교회 명망 -1" },
    19: { name: "평민 명망 (Standing [commoners]) 시험", trait: "standingCommoners", crit: "평민 상인 길드에서 최고급 Coursers 명마를 기부했습니다. 평민 명망 +1", succ: "장원 농민들이 기사를 위해 축제를 열었습니다. 민간 전설/평민 명망 체크!", fail: "백성들이 주교에게 불만을 제소했습니다. 무작위 기독교 성향 성공 시 체크, 실패 시 반대 체크.", fumb: "부랑 아웃로 무리에게 숲속 매복 기습을 당해 3d6 노아머 피해!" },
    20: { name: "기사의 결단 (Player's Choice)", trait: "choice", crit: "기사가 원하는 성향 하나를 자유롭게 +1 올립니다.", succ: "원하는 성향이나 기술 하나에 자유롭게 체크를 남깁니다.", fail: "아무 일도 일어나지 않았습니다.", fumb: "사소한 수치로 무작위 명망 하나가 1점 하락합니다." }
  };

  const rollPersonalEvent = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setPersonalEventRoll(d20);
    setPersonalEventText(personalEventTable[d20]);
    setPersonalEventApplied(false);
  };

  const applyPersonalEvent = (outcome) => {
    if (personalEventApplied) return;
    addLog(`[개인 사건]: d20 [${personalEventRoll}] ${personalEventText.name} -> 결과 [${outcome}] 적용.`);
    setPersonalEventApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 6: FAMILY LOGIC (Marriage / Childbirth / Family Event)
  // ══════════════════════════════════════════════════
  const rollMarriage = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setMarriageRoll(d20);
    let rank = "가신 기사의 딸";
    let dowry = 1;
    let glory = 50;

    if (d20 <= 5) { rank = "부유한 평민 상인의 딸"; dowry = Math.floor(Math.random() * 18) + 9; glory = 0; }
    else if (d20 <= 8) { rank = "수습 종자의 딸"; dowry = 3; glory = 10; }
    else if (d20 <= 10) { rank = "가신 기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 50; }
    else if (d20 === 11) { rank = "부유한 봉신기사의 맏딸"; dowry = Math.floor(Math.random() * 3) + 7; glory = 100; }
    else if (d20 <= 20) { rank = "일반 봉신기사의 딸"; dowry = Math.floor(Math.random() * 6) + 1; glory = 100; }
    else if (d20 <= 25) { rank = "봉신기사 가문 여상속인"; dowry = 15; glory = 100; } // 1 manor + 1d6+10 represented as £15
    else { rank = "남작 가문의 막내딸"; dowry = 20; glory = 250; }

    setMarriageResult({ rank, dowry, glory });
  };

  const rollChildbirth = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setChildbirthRoll(d20);
    let outcome = "아무 일 없음";
    if (d20 === 11) outcome = "비극: 산모와 아이 모두 출산 중 서거 😭";
    else if (d20 === 12) outcome = "비극: 산모 서거, 아이 생존 (성별 1d6) 🕯️";
    else if (d20 <= 19) outcome = "경사: 건강한 아이 출생! (성별 1d6) 👶";
    else if (d20 === 20) outcome = "경사: 쌍둥이 아이 출생! 🎉👶👶";

    setChildbirthResult(outcome);
  };

  const rollFamilyEvent = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setFamilyEventRoll(d20);
    let outcome = "평온한 한 해";
    if (d20 === 1) outcome = "가문의 비극: 친족이 시합 또는 불화 끝에 사망";
    else if (d20 === 2) outcome = "가문의 영광: 귀인의 목숨을 구하고 서거. 친족 전원 +10 Glory";
    else if (d20 === 3) outcome = "위대한 위업: 멧돼지 사냥에서 주군 구출. 친족 전원 +5 Glory";
    else if (d20 === 4) outcome = "납치 사건: 친족이 강제 결혼이나 몸값을 노린 무리에 납치됨";
    else if (d20 === 5) outcome = "실종 사건: 친족 한 명이 행방불명됨";
    else if (d20 === 8) outcome = "뜻밖의 하사품: 가문의 선조 유물 선물 획득!";
    else if (d20 === 10) outcome = "경사스런 혼사: 가문 일원이 엄청난 귀족가와 혼인. 명예 +1";
    else if (d20 === 19) outcome = "벼락 영전: 친족이 궁성 백작이나 순찰사로 전격 임명! +10 Glory";
    else outcome = "가문 평온: 가문 내에 무난하고 평화로운 기운이 돕니다.";

    setFamilyEventResult(outcome);
  };

  const applyFamilyPhase = () => {
    if (familyApplied) return;
    
    setCharacter(prev => {
      const updatedGear = { ...prev.gear };
      if (marriageResult) {
        updatedGear.cash = (updatedGear.cash || 0) + marriageResult.dowry;
        updatedGear.gloryThisGame = (updatedGear.gloryThisGame || 0) + marriageResult.glory;
      }
      return { ...prev, gear: updatedGear };
    });

    let msg = `[가문 정산]: `;
    if (marriageResult) msg += `결혼 성공 (${marriageResult.rank}, dowry £${marriageResult.dowry}, +${marriageResult.glory} Glory) `;
    if (childbirthResult) msg += `/ 출산 d20 [${childbirthRoll}] -> ${childbirthResult} `;
    if (familyEventResult) msg += `/ 가문사건 d20 [${familyEventRoll}] -> ${familyEventResult}`;

    addLog(msg);
    setFamilyApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 7: EXPERIENCE LOGIC
  // ══════════════════════════════════════════════════
  const runExperiencePhase = () => {
    if (experienceApplied) return;

    const checkedSkills = Object.keys(character.skillsChecked).filter(k => character.skillsChecked[k]);
    const checkedPassions = Object.keys(character.passionsChecked).filter(k => character.passionsChecked[k]);

    const logs = [];
    const updatedSkills = { ...character.skills };
    const updatedPassions = { ...character.passions };

    // Roll for skills
    checkedSkills.forEach(key => {
      const val = character.skills[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const success = d20 >= val || d20 === 20;
      if (success && val < 20) {
        updatedSkills[key] = val + 1;
        logs.push(`[기술 ${key} 성장]: d20 [${d20}] vs [${val}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[기술 ${key} 유지]: d20 [${d20}] vs [${val}]. 실패.`);
      }
    });

    // Roll for passions
    checkedPassions.forEach(key => {
      const val = character.passions[key] || 0;
      const d20 = Math.floor(Math.random() * 20) + 1;
      const success = d20 >= val || d20 === 20;
      if (success && val < 20) {
        updatedPassions[key] = val + 1;
        logs.push(`[열망 ${key} 성장]: d20 [${d20}] vs [${val}]. 성공! → ${val + 1} 🎉`);
      } else {
        logs.push(`[열망 ${key} 유지]: d20 [${d20}] vs [${val}]. 실패.`);
      }
    });

    setCharacter(prev => ({
      ...prev,
      skills: updatedSkills,
      skillsChecked: {},
      passions: updatedPassions,
      passionsChecked: {}
    }));

    setExperienceLogs(logs);
    if (logs.length > 0) {
      logs.forEach(l => addLog(l));
    } else {
      addLog(`[경험 판정]: 체크된 기술/열망이 없습니다.`);
    }
    setExperienceApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 8: TRAINING & PRACTICE LOGIC
  // ══════════════════════════════════════════════════
  const applyTraining = () => {
    if (trainingApplied) return;

    if (trainingOption === 'optionA') {
      if (selectedAttribute) {
        const age = character.personal.age || 0;
        if (age >= 30) {
          alert("나이가 30세 이상입니다! 룰북 규정에 따라 30세 이후에는 훈련으로 기본 능력치를 상승시킬 수 없습니다.");
          return;
        }
        if (selectedAttribute === 'siz' && age >= 21) {
          alert("나이가 21세 이상입니다! 룰북 규정에 따라 체구(SIZ)는 21세 이후로 증가시킬 수 없습니다.");
          return;
        }
        setCharacter(prev => ({
          ...prev,
          attributes: { ...prev.attributes, [selectedAttribute]: (prev.attributes[selectedAttribute] || 0) + 1 }
        }));
        addLog(`[자유 단련]: 능력치 [${selectedAttribute.toUpperCase()}] +1 영구 증가!`);
      } else if (selectedTrait) {
        // opposite trait adjusts automatically
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[selectedTrait];
        setCharacter(prev => ({
          ...prev,
          traits: {
            ...prev.traits,
            [selectedTrait]: Math.min(20, (prev.traits[selectedTrait] || 0) + 1),
            [opp]: Math.max(0, (prev.traits[opp] || 0) - 1)
          }
        }));
        addLog(`[자유 단련]: 성향 [${selectedTrait}] +1 증가!`);
      } else if (selectedPassion) {
        setCharacter(prev => ({
          ...prev,
          passions: { ...prev.passions, [selectedPassion]: Math.min(20, (prev.passions[selectedPassion] || 0) + 1) }
        }));
        addLog(`[자유 단련]: 열망 [${selectedPassion}] +1 증가!`);
      } else if (selectedStanding) {
        setCharacter(prev => ({
          ...prev,
          standings: { ...prev.standings, [selectedStanding]: Math.min(20, (prev.standings[selectedStanding] || 0) + 1) }
        }));
        addLog(`[자유 단련]: 명망 [${selectedStanding}] +1 증가!`);
      }
    } 
    else if (trainingOption === 'optionB') {
      setCharacter(prev => {
        const skills = { ...prev.skills };
        const keys = Object.values(selectedSkills).filter(k => k);
        keys.forEach(k => {
          if (skills[k] < 15) {
            skills[k] = (skills[k] || 0) + 1;
          }
        });
        return { ...prev, skills };
      });
      addLog(`[자유 단련]: 4개 기술 훈련 (+1 상승, 한계 15) 적용 완료!`);
    } 
    else if (trainingOption === 'optionC') {
      if (selectedHighSkill && (character.skills[selectedHighSkill] >= 15)) {
        setCharacter(prev => ({
          ...prev,
          skills: { ...prev.skills, [selectedHighSkill]: Math.min(20, (prev.skills[selectedHighSkill] || 0) + 1) }
        }));
        addLog(`[자유 단련]: 상급 기술 [${selectedHighSkill}] +1 돌파 상승! (상한 20)`);
      } else {
        alert("선택한 기술의 수치가 15 미만입니다! 옵션 C는 수치 15 이상인 기술만 단련할 수 있습니다.");
        return;
      }
    }

    setTrainingApplied(true);
  };

  // ══════════════════════════════════════════════════
  // STEP 9: COMPUTE ANNUAL GLORY
  // ══════════════════════════════════════════════════
  const computeGlory = () => {
    // 1. Manor: +6
    let annual = 6;

    // 2. Chivalrous Active: +100
    const chivalrousTraitsTotal =
      (character?.traits?.energetic || 0) + (character?.traits?.generous || 0) +
      (character?.traits?.just || 0) + (character?.traits?.merciful || 0) +
      (character?.traits?.modest || 0) + (character?.traits?.valorous || 0);
    const honorVal = parseInt(character?.passions?.honor) || 0;
    const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;
    if (isChivalrousActive) annual += 100;

    // 3. Religious Active: +100
    const religiousTraitsTotal =
      (character?.traits?.chaste || 0) + (character?.traits?.forgiving || 0) +
      (character?.traits?.merciful || 0) + (character?.traits?.modest || 0) +
      (character?.traits?.temperate || 0) + (character?.traits?.trusting || 0);
    const loveGodVal = parseInt(character?.passions?.loveGod) || 0;
    const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;
    if (isReligiousActive) annual += 100;

    // 4. Romantic Active: +100
    const romanceVal = character?.skills?.romance || 0;
    const otherCourtlySkillsOver10 = Object.keys(character.skills)
      .filter(k => ["courtesy", "dancing", "eloquence", "falconry", "gaming", "heraldry", "intrigue", "playInstruments", "readingWriting", "singing"].includes(k))
      .filter(k => (character.skills[k] || 0) >= 10)
      .length;
    const hasRequiredCourtlySkills = romanceVal >= 10 && otherCourtlySkillsOver10 >= 4;
    const amorVal = parseInt(character?.passions?.amor) || 0;
    const isRomanticActive = (character?.traits?.forgiving || 0) + (character?.traits?.generous || 0) +
      (character?.traits?.honest || 0) + (character?.traits?.just || 0) +
      (character?.traits?.prudent || 0) + (character?.traits?.trusting || 0) >= 90 && amorVal >= 16 && hasRequiredCourtlySkills;
    if (isRomanticActive) annual += 100;

    // 5. Passive Glory: stats > 15
    let passiveGlory = 0;
    Object.keys(character.skills).forEach(k => { if (character.skills[k] > 15) passiveGlory += (character.skills[k] - 15); });
    Object.keys(character.traits).forEach(k => { if (character.traits[k] > 15) passiveGlory += (character.traits[k] - 15); });
    Object.keys(character.passions).forEach(k => { if (character.passions[k] > 15) passiveGlory += (character.passions[k] - 15); });
    Object.keys(character.standings || {}).forEach(k => { if (character.standings[k] > 15) passiveGlory += (character.standings[k] - 15); });

    const totalCalculated = annual + passiveGlory;
    setCalculatedAnnualGlory(totalCalculated);
    setGloryApplied(false);
  };

  const applyGlory = () => {
    if (gloryApplied) return;

    const previousTotal = character.gear.gloryTotal || 0;
    const addedGlory = calculatedAnnualGlory + (character.gear.gloryThisGame || 0);
    const newTotal = previousTotal + addedGlory;

    // Calculate Glory Bonus points (1 point per 1,000 threshold crossed)
    const prevThreshold = Math.floor(previousTotal / 1000);
    const newThreshold = Math.floor(newTotal / 1000);
    const bonusEarned = Math.max(0, newThreshold - prevThreshold);

    setCharacter(prev => ({
      ...prev,
      gear: {
        ...prev.gear,
        gloryTotal: newTotal,
        gloryThisGame: 0
      }
    }));

    addLog(`[영예 정산]: 연간정산 +${calculatedAnnualGlory} Glory (장원 6점 + 활성 이상 보너스) 합산 완료. 누적 영예: ${newTotal}`);
    if (bonusEarned > 0) {
      addLog(`[축하합니다!]: 영예 1,000단위 돌파! 자유 능력치 +1 보너스 점수 [${bonusEarned}]점을 획득했습니다! (Step 10 위젯 사용)`);
      setGloryBonusPoints(bonusEarned);
    }
    setGloryApplied(true);
  };

  const spendGloryBonus = (statType, key) => {
    if (bonusSpent >= gloryBonusPoints) {
      alert("부여받은 돌파 보너스 점수를 모두 소모했습니다!");
      return;
    }

    setCharacter(prev => {
      const updated = { ...prev };
      if (statType === 'attribute') {
        updated.attributes[key] = (updated.attributes[key] || 0) + 1;
      } else if (statType === 'skill') {
        updated.skills[key] = (updated.skills[key] || 0) + 1;
      } else if (statType === 'passion') {
        updated.passions[key] = (updated.passions[key] || 0) + 1;
      } else if (statType === 'standing') {
        updated.standings[key] = (updated.standings[key] || 0) + 1;
      } else if (statType === 'trait') {
        const oppositeMap = {
          chaste: "lustful", energetic: "lazy", forgiving: "vengeful",
          generous: "selfish", honest: "deceitful", just: "arbitrary",
          merciful: "cruel", modest: "proud", pious: "worldly",
          prudent: "reckless", temperate: "indulgent", trusting: "suspicious",
          valorous: "cowardly"
        };
        const opp = oppositeMap[key];
        updated.traits[key] = Math.min(20, (updated.traits[key] || 0) + 1);
        updated.traits[opp] = Math.max(0, (updated.traits[opp] || 0) - 1);
      }
      return updated;
    });

    addLog(`[영예 돌파 보너스 사용]: ${key} +1 영구 증가!`);
    setBonusSpent(b => b + 1);
  };

  const endWinterPhase = () => {
    setCharacter(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        age: (prev.personal.age || 0) + 1
      }
    }));
    addLog(`⚔️ 겨울 정산 완료: 기사의 나이 +1세! 따스한 햇빛과 함께 새 봄이 찾아옵니다! ⚔️`);
    setWinterStep(1);
    setActiveSubTab('family');
    // reset states
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
  };

  const resetWinter = () => {
    setWinterStep(1);
    setLogMessages([]);
    setAgingD20(null); setHarvestRoll(null); setSquireSurvivalRoll(null);
    setPersonalEventRoll(null); setMarriageRoll(null); setChildbirthRoll(null);
    setFamilyEventRoll(null); setExperienceLogs([]); setTrainingApplied(false);
    setCalculatedAnnualGlory(null); setGloryBonusPoints(0); setBonusSpent(0);
  };

  // Lists for selection
  const attributeKeys = ['siz', 'dex', 'str', 'con', 'app'];
  const traitKeys = ['chaste', 'energetic', 'forgiving', 'generous', 'honest', 'just', 'merciful', 'modest', 'pious', 'prudent', 'temperate', 'trusting', 'valorous'];
  const passionKeys = Object.keys(character.passions);
  const standingKeys = Object.keys(character.standings || {});

  return (
    <div className="cs-page view-animate">
      
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">🏰 가문 및 겨울 정산 (The Winter Phase)</h4>
          <p>1년 주기의 모험 정리는 기사의 성장과 다음 해의 경제를 결정합니다. 룰북 공식 10단계를 진행하세요.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sub-tab-navigation" style={{ margin: '12px 0 16px 0' }}>
        <button 
          className={`sub-tab-btn ${activeSubTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('family')}
        >
          <Shield size={14} /> 가문 역사와 영지 정보 시트
        </button>
        <button 
          className={`sub-tab-btn ${activeSubTab === 'tree' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('tree')}
        >
          <Heart size={14} /> 가족 대서사 계보도 (Lineage)
        </button>
        <button 
          className={`sub-tab-btn ${activeSubTab === 'winter' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('winter')}
        >
          <RotateCcw size={14} /> 겨울 나기와 봉토 경제 경영
        </button>
        <button 
          className={`sub-tab-btn ${activeSubTab === 'salvation' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('salvation')}
        >
          <Award size={14} /> 기사 은퇴 및 구원 판정 (Salvation)
        </button>
      </div>

      {/* SUB TAB: FAMILY DETAILS */}
      {activeSubTab === 'family' && (
        <section className="cs-section view-animate">
          <div className="sheet-ribbon"><h3>가문 명망 및 영지 설정</h3></div>
          <div className="cs-section-inner">
            <div className="cs-field-grid">
              {[
                { key: 'name', label: '가문 성씨', ph: '예: 아르덴' },
                { key: 'motto', label: '가언/신조', ph: '예: 명예와 신조' },
                { key: 'battleCry', label: '전투 함성', ph: '예: 몽주아 생드니!' },
                { key: 'ancestor', label: '가문 시조', ph: '예: 고드프루아 경' },
                { key: 'homeCountry', label: '영지/고향', ph: '예: 아키텐' },
                { key: 'patronSaint', label: '수호 성인', ph: '예: 성 데니스' },
              ].map(f => (
                <div className="cs-field" key={f.key}>
                  <span className="cs-field-label">{f.label}:</span>
                  <input type="text" value={character.family[f.key] || ''} placeholder={f.ph}
                    onChange={e => handleFamilyChange(f.key, e.target.value)} />
                </div>
              ))}
              <div className="cs-field">
                <span className="cs-field-label">가문 고유 명예:</span>
                <input type="number" value={character.family.honor || 0}
                  onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>우방 동맹 가문:</label>
                <textarea className="form-input" rows={2} value={character.family.allies || ''} style={{ width: '100%', padding: '6px' }}
                  onChange={e => handleFamilyChange('allies', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>적대 대립 가문:</label>
                <textarea className="form-input" rows={2} value={character.family.enemies || ''} style={{ width: '100%', padding: '6px' }}
                  onChange={e => handleFamilyChange('enemies', e.target.value)} />
              </div>
            </div>

            {/* 📜 룰북 기반 조상 연대기 발전기 */}
            <div style={{ marginTop: '20px', borderTop: '2px dashed var(--color-gold-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: 'var(--color-royal-blue)', fontFamily: 'var(--font-korean)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                  <Sparkles size={16} />
                  📜 룰북 조상 연대기 발전기 (Page 45-49)
                </h4>
                <button
                  type="button"
                  className="btn-medieval btn-medieval-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setIsAncestorGenOpen(!isAncestorGenOpen)}
                >
                  <Sparkles size={12} />
                  {isAncestorGenOpen ? '연대기 닫기' : '연대기 도우미 열기'}
                </button>
              </div>

              {isAncestorGenOpen && (
                <div className="view-animate" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--color-gold-light)', borderRadius: '8px', padding: '16px', marginTop: '10px' }}>
                  
                  {/* 📖 룰북 판정표 레퍼런스 (Table 2-2 & Table 2-3) */}
                  <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: 'rgba(201,168,76,0.1)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefTables(!showRefTables)}>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📖 룰북 판정 레퍼런스 테이블 보기 (Table 2-1, 2-2, 2-3)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefTables ? '접기 ▲' : '펼치기 ▼'}</span>
                    </div>
                    {showRefTables && (
                      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                        {/* Left Column: Table 2-1 & Table 2-2 */}
                        <div>
                          {/* Table 2-1: Ordinary Year Events */}
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-1: Ordinary Year Events (평시 연도 사건)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '14px' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                <th style={{ padding: '3px 2px' }}>연간 사건 (Event)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1</td>
                                <td style={{ padding: '3px 2px' }}>무작위 원인으로 사망 (Table 2-3 참조)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>2~17</td>
                                <td style={{ padding: '3px 2px' }}>성채 경비 임무 수행 (Served garrison duty)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>18~19</td>
                                <td style={{ padding: '3px 2px' }}>명예롭고 기념비적인 업적 달성 (+50 Glory)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>20</td>
                                <td style={{ padding: '3px 2px' }}>작센/프리지아 습격 시 국경 방어전 (Defended homeland during raid)<br />
                                  <span style={{ fontSize: '0.68rem', color: 'var(--color-grey)' }}>
                                    * Combat Survival(Table 2-2) 판정 진행. 생존 시 작센/프리지아 증오 +1d3 획득
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Table 2-2: Combat Survival */}
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-2: Combat Survival (전투 생존 판정)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과*</th>
                                <th style={{ padding: '3px 2px' }}>판정 결과 (Combat Result)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>0 이하</td>
                                <td style={{ padding: '3px 2px' }}>장렬한 전사 (+1,000 Glory)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1</td>
                                <td style={{ padding: '3px 2px' }}>전투 중 전사 (추가 명예 없음)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>2</td>
                                <td style={{ padding: '3px 2px' }}>부상 은퇴 (수도원행, 1d20년 후 서거)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>3</td>
                                <td style={{ padding: '3px 2px' }}>포로 압송 및 행방불명 (미귀환)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4~5</td>
                                <td style={{ padding: '3px 2px', color: 'var(--color-success)', fontWeight: 600 }}>생존 및 영웅적 업적 달성 (+100 Glory)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6~20</td>
                                <td style={{ padding: '3px 2px' }}>무사히 생존 완료</td>
                              </tr>
                            </tbody>
                          </table>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-grey)', marginTop: '6px', lineHeight: 1.3 }}>
                            * 역사적 대전투(Battle) 판정 시에는 <strong>주사위 값에 -1 보정</strong>을 적용합니다.<br />
                            * 승전한 경우 획득하는 명예(Glory)가 2배로 계산됩니다.
                          </div>
                        </div>

                        {/* Table 2-3: Miscellaneous Death Causes */}
                        <div>
                          <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            Table 2-3: Miscellaneous Death Causes (기타 사망 원인)
                          </h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                <th style={{ padding: '3px 2px' }}>남성 (Male)</th>
                                <th style={{ padding: '3px 2px' }}>여성 (Female)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1~3</td>
                                <td style={{ padding: '3px 2px' }}>전투 중 전사 (Battle)</td>
                                <td style={{ padding: '3px 2px' }}>산고 중 사망 (Childbirth)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>5</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6</td>
                                <td style={{ padding: '3px 2px' }}>가문 불화 (Feud)</td>
                                <td style={{ padding: '3px 2px' }}>사냥 사고 (Hunting)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>7~8</td>
                                <td style={{ padding: '3px 2px' }}>적 습격 (Raid)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>9~10</td>
                                <td style={{ padding: '3px 2px' }}>사냥 사고 (Hunting)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>11~13</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                                <td style={{ padding: '3px 2px' }}>사고사 (Accident)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>14</td>
                                <td style={{ padding: '3px 2px' }}>실종 (Disappeared)</td>
                                <td style={{ padding: '3px 2px' }}>실종 (Disappeared)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>15~18</td>
                                <td style={{ padding: '3px 2px' }}>질병사 (Illness)</td>
                                <td style={{ padding: '3px 2px' }}>질병사 (Illness)</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>19~20</td>
                                <td style={{ padding: '3px 2px' }}>노환 (Old age)</td>
                                <td style={{ padding: '3px 2px' }}>노환 (Old age)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mode Selector */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '10px' }}>
                    <button
                      type="button"
                      className={`tab-btn btn-medieval ${chronicleMode === 'interactive' ? 'active' : ''}`}
                      onClick={() => { setChronicleMode('interactive'); }}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}
                    >
                      📜 1단계씩 직접 개척 (권장: 서사 누적 체험)
                    </button>
                    <button
                      type="button"
                      className={`tab-btn btn-medieval ${chronicleMode === 'auto' ? 'active' : ''}`}
                      onClick={() => { setChronicleMode('auto'); }}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, justifyContent: 'center' }}
                    >
                      🎲 일괄 자동 생성 (Auto-Roll)
                    </button>
                  </div>

                  {chronicleMode === 'auto' ? (
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-grey)', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                        룰북 규칙서 25~30쪽 및 45~49쪽 고증 규칙에 따라, 조부(723년~)와 부친(748년~)의 전공 및 사망 원인을 대진표식으로 시뮬레이션합니다.<br />
                        • 조부는 2,500 Glory에서 출발해 매년의 모험과 삭센/무어 원정 참전 주사위를 굴립니다.<br />
                        • 부친은 2,500 Glory + 조부의 최종 영광의 1/10을 상속받아 평생의 업적을 쌓습니다.<br />
                        • 생성된 영광과 증오 속성은 1/10의 비율로 캐릭터 시트에 정식으로 계승 반영됩니다.
                      </p>

                      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                        <button
                          type="button"
                          className="btn-medieval btn-medieval-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                          onClick={rollAncestorHistory}
                        >
                          <RefreshCw size={14} />
                          조상 연대기 일괄 주사위 롤링 (Auto-Roll All)
                        </button>
                        {ancestorRollLog.length > 0 && !ancestorApplied && (
                          <button
                            type="button"
                            className="btn-medieval btn-medieval-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                            onClick={applyAncestorLegacy}
                          >
                            <Check size={14} />
                            연대기 유산 적용하기 (Glory & 증오 계승)
                          </button>
                        )}
                      </div>

                      {ancestorRollLog.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'rgba(43, 65, 112, 0.04)', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--color-gold-light)' }}>
                            <div>
                              <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-royal-blue)', fontSize: '0.86rem' }}>👴 조조부 (Godefroy 경)</h5>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                • 최종 명예: <strong>{grandfatherGlory} Glory</strong><br />
                                • 생몰년도: 700년 ~ {grandfatherDeathYear}년<br />
                                • 사인: {grandfatherDeathCause}<br />
                                • 누적 증오: 작센인 ({grandfatherHates.saxons}), 무어인 ({grandfatherHates.moors})
                              </span>
                            </div>
                            <div>
                              <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-crimson)', fontSize: '0.86rem' }}>👨 부친 (Gerard 경)</h5>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                • 최종 명예: <strong>{fatherGlory} Glory</strong><br />
                                • 생몰년도: 724년 ~ {fatherDeathYear}년<br />
                                • 사인: {fatherDeathCause}<br />
                                • 누적 증오: 작센인 ({fatherHates.saxons}), 무어인 ({fatherHates.moors})
                              </span>
                            </div>
                          </div>

                          <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#faf6eb', border: '1.2px solid rgba(201, 168, 76, 0.3)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', whiteSpace: 'pre-wrap', color: '#5a4933', scrollbarWidth: 'thin' }}>
                            {ancestorRollLog.join('\n')}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 📜 INTERACTIVE MODE UI
                    <div className="view-animate" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {interactiveStage === 'idle' ? (
                        <div style={{ textAlign: 'center', padding: '24px 10px', backgroundColor: 'rgba(179,143,67,0.03)', border: '1px dashed var(--color-gold)' }}>
                          <Compass size={36} style={{ margin: '0 auto 12px', color: 'var(--color-gold-dark)' }} />
                          <h4 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-ink)' }}>가문의 역사를 한 해씩 직접 개척해 보세요</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', margin: '6px 0 16px', lineHeight: 1.4 }}>
                            723년부터 766년까지 프랑크 왕국 역사적 대기사 원정 사건들을 실시간으로 읽으며,<br />
                            조조부와 아버지가 쌓아 올린 전설적인 무공과 유산을 생생한 주사위 판정으로 체험할 수 있습니다.
                          </p>
                          <button
                            type="button"
                            className="btn-medieval btn-medieval-primary"
                            style={{ margin: '0 auto', fontSize: '0.9rem', padding: '8px 18px', justifyContent: 'center' }}
                            onClick={startInteractiveChronicle}
                          >
                            📜 가문 연대기 직접 개척 시작하기
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Top Status Board */}
                          {interactiveStage !== 'completed' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(201, 168, 76, 0.2)', marginBottom: '12px' }}>
                              <div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>진행 인물</span>
                                <h5 style={{ margin: '2px 0 0 0', fontWeight: 'bold', fontSize: '0.92rem', color: interactiveStage.startsWith('gf') ? 'var(--color-royal-blue)' : 'var(--color-crimson)' }}>
                                  {interactiveStage.startsWith('gf') ? '👴 조조부 (Godefroy 경)' : '👨 부친 (Gerard 경)'}
                                </h5>
                                <div style={{ fontSize: '0.76rem', marginTop: '4px', color: 'var(--color-ink)' }}>
                                  • 생몰: {interactiveStage.startsWith('gf') ? '700 ~ ?' : '724 ~ ?'}<br />
                                  • 현재 연도: <strong style={{ fontSize: '1.05rem', color: 'var(--color-gold-dark)' }}>{interactiveYear}년</strong>
                                </div>
                              </div>
                              <div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>누적 무훈 현황</span>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>
                                  🏆 {interactiveStage.startsWith('gf') ? grandfatherGlory : fatherGlory} Glory
                                </div>
                                <div style={{ fontSize: '0.74rem', marginTop: '4px', color: 'var(--color-ink-light)' }}>
                                  • 작센 증오: {interactiveStage.startsWith('gf') ? grandfatherHates.saxons : fatherHates.saxons}<br />
                                  • 무어 증오: {interactiveStage.startsWith('gf') ? grandfatherHates.moors : fatherHates.moors}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Historical Event Scroll */}
                          {interactiveStage !== 'completed' && (
                            <div style={{ border: '1.5px solid var(--color-gold-light)', background: '#faf6eb', padding: '12px 14px', borderRadius: '6px', position: 'relative', marginBottom: '14px' }}>
                              <div style={{ position: 'absolute', right: '10px', top: '-10px', backgroundColor: 'var(--color-gold)', color: '#fff', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                역사 사건서
                              </div>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                🛡️ {interactiveYear}년 국경 원정 기록
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: '#5a4933', lineHeight: '1.5' }}>
                                {ANCESTOR_EVENTS[interactiveYear]}
                              </p>
                            </div>
                          )}

                          {/* Dice Roll / Input Box */}
                          {interactiveStage !== 'completed' && !currentYearRolled && (
                            isGapYear(interactiveYear, interactiveStage) ? (
                              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                  <div>
                                    <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '0.86rem', color: 'var(--color-success)' }}>🕊️ 역사적 평온기 (공백기)</h5>
                                    <span style={{ fontSize: '0.76rem', color: 'var(--color-ink)' }}>
                                      룰북 규칙에 따라 이 연도에는 전쟁이나 주사위 판정(위험)이 발생하지 않습니다.
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--color-success)', background: 'var(--color-success)' }}
                                    onClick={handleGapYearInteractive}
                                  >
                                    🕊️ 평온하게 한 해 보내기
                                  </button>
                                </div>
                              </div>
                            ) : chroniclePendingRoll ? (
                              <div style={{ backgroundColor: 'rgba(185, 28, 28, 0.04)', border: '1px solid rgba(185, 28, 28, 0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--color-grey)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontWeight: 'bold', color: 'var(--color-crimson)' }}>🛡️ 2차 생존/추가 판정 필요!</span>
                                  <span style={{ fontSize: '0.78rem', lineHeight: 1.4, whiteSpace: 'pre-wrap', backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '4px', borderLeft: '3px solid var(--color-crimson)' }}>
                                    {chroniclePendingRoll.logPrefix.trim()}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>🎲 2차 주사위 입력:</span>
                                    <input
                                      type="text"
                                      placeholder="예: 10 (생존)"
                                      value={chronicleManualD20}
                                      onChange={e => setChronicleManualD20(e.target.value)}
                                      style={{ width: '130px', padding: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--color-crimson)', background: 'var(--color-crimson)' }}
                                    onClick={rollSingleYearInteractive}
                                  >
                                    🛡️ {interactiveYear}년 생존 판정 굴리기
                                  </button>
                                </div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                                  * 1차 판정 결과({chroniclePendingRoll.firstRoll})에 따른 추가 생존 판정입니다. 입력하지 않으면 무작위(d20)로 결정됩니다.
                                </span>
                              </div>
                            ) : (
                              <div style={{ backgroundColor: 'rgba(179,143,67,0.04)', border: '1px solid rgba(179,143,67,0.2)', padding: '14px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>🎲 주사위 수동 입력:</span>
                                    <input
                                      type="text"
                                      placeholder="예: 15"
                                      value={chronicleManualD20}
                                      onChange={e => setChronicleManualD20(e.target.value)}
                                      style={{ width: '130px', padding: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-crimson)', textAlign: 'center', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    onClick={rollSingleYearInteractive}
                                  >
                                    ⚔️ {interactiveYear}년 운명 주사위 판정
                                  </button>
                                </div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                                  * 수동 값을 입력하면 주사위 결과가 해당 눈으로 강제 적용되며, 입력하지 않으면 무작위(d20)로 결정됩니다.
                                </span>
                              </div>
                            )
                          )}

                          {/* Year Outcome display */}
                          {currentYearRolled && interactiveStage !== 'completed' && (
                            <div className="view-animate" style={{ backgroundColor: currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'rgba(153, 34, 34, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1.5px solid ${currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'var(--color-danger)' : 'var(--color-success)'}`, padding: '14px', borderRadius: '6px', marginBottom: '14px', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{interactiveYear}년 판정 결과</span>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 'bold', color: currentYearResultText.includes('사망') || currentYearResultText.includes('전사') ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                {currentYearResultText}
                              </h4>
                              
                              <p style={{ fontSize: '0.76rem', color: 'var(--color-grey)', margin: '4px 0 12px 0' }}>
                                당해 세부 사건 전개가 연대기 로그 북에 정식 마킹되었습니다.
                              </p>

                              <button
                                type="button"
                                className="btn-medieval"
                                style={{ margin: '0 auto', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--color-gold-dark)' }}
                                onClick={advanceChronicleYear}
                              >
                                {interactiveStage === 'gf_dead' ? '👨 부친 Gerard 경의 시대로 이동' : 
                                 interactiveStage === 'f_dead' ? '🏁 연대기 완료 및 유산 정산' :
                                 interactiveYear === 744 ? '👴 조조부 은퇴 및 부친 상속식 진행' :
                                 interactiveYear === 766 ? '🏁 부친 은퇴 및 연대기 매듭짓기' :
                                 `➡️ ${interactiveYear + 1}년으로 시간선 진행`}
                              </button>
                            </div>
                          )}

                          {/* Undo button */}
                          {chronicleHistory.length > 0 && interactiveStage !== 'completed' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', marginBottom: '8px' }}>
                              <button
                                type="button"
                                className="btn-medieval"
                                style={{ fontSize: '0.78rem', padding: '4px 10px', color: 'var(--color-grey)', borderColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent' }}
                                onClick={undoLastChronicleStep}
                              >
                                ↩️ 뒤로가기 (직전 판정 취소)
                              </button>
                            </div>
                          )}

                          {/* Completed Stage View */}
                          {interactiveStage === 'completed' && (
                            <div className="view-animate" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1.5px solid var(--color-success)', borderRadius: '6px' }}>
                                <Award size={32} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
                                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-success)' }}>
                                  🎉 위대한 조상들의 연대기가 완전히 완성되었습니다!
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginTop: '4px', lineHeight: 1.4 }}>
                                  조부 고드프루아 경과 부친 제라르 경의 웅장한 영웅담이 가문에 뿌리내렸습니다.<br />
                                  쌓아올린 명예의 1/10과 불굴의 신조, 이교도에 대한 분노가 롤랑 경에게 오롯이 계승됩니다.
                                </p>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'rgba(43, 65, 112, 0.04)', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--color-gold-light)' }}>
                                <div>
                                  <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-royal-blue)', fontSize: '0.86rem' }}>👴 조조부 (Godefroy 경)</h5>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                    • 최종 명예: <strong>{grandfatherGlory} Glory</strong><br />
                                    • 생몰년도: 700년 ~ {grandfatherDeathYear}년<br />
                                    • 사인: {grandfatherDeathCause || '평화로운 임종'}<br />
                                    • 누적 증오: 작센인 ({grandfatherHates.saxons}), 무어인 ({grandfatherHates.moors})
                                  </span>
                                </div>
                                <div>
                                  <h5 style={{ margin: '0 0 6px 0', color: 'var(--color-crimson)', fontSize: '0.86rem' }}>👨 부친 (Gerard 경)</h5>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--color-ink)', lineHeight: '1.4' }}>
                                    • 최종 명예: <strong>{fatherGlory} Glory</strong><br />
                                    • 생몰년도: 724년 ~ {fatherDeathYear}년<br />
                                    • 사인: {fatherDeathCause || '평화로운 임종'}<br />
                                    • 누적 증오: 작센인 ({fatherHates.saxons}), 무어인 ({fatherHates.moors})
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {!ancestorApplied ? (
                                  <button
                                    type="button"
                                    className="btn-medieval btn-medieval-primary"
                                    style={{ fontSize: '0.9rem', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={applyAncestorLegacy}
                                  >
                                    <Check size={16} />
                                    연대기 유산 최종 적용하기 (시트 계승)
                                  </button>
                                ) : (
                                  <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid var(--color-success)', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                                    <Check size={18} /> 계승 유산 시트 반영 완료!
                                  </div>
                                )}
                                <button
                                  type="button"
                                  className="btn-medieval"
                                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                                  onClick={startInteractiveChronicle}
                                >
                                  🔄 다시 개척하기 (초기화)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Historical Log Scroll Box */}
                          <div style={{ marginTop: '16px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>📜 양가 가문 대서사 로그 북</span>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#faf6eb', border: '1.2px solid rgba(201, 168, 76, 0.3)', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', whiteSpace: 'pre-wrap', color: '#5a4933', scrollbarWidth: 'thin', lineHeight: '1.5' }}>
                              {ancestorRollLog.slice().reverse().map((line, idx) => (
                                <div key={idx} style={{ borderBottom: '1px dashed rgba(201,168,76,0.15)', paddingBottom: '4px', marginBottom: '4px' }}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SUB TAB: FAMILY TREE */}
      {activeSubTab === 'tree' && (
        <FamilyTree character={character} setCharacter={setCharacter} />
      )}

      {/* SUB TAB: 10-STEP WINTER PHASE WIZARD */}
      {activeSubTab === 'winter' && (
        <div className="view-animate">
          
          {/* Main Step Panel */}
          <section className="cs-section">
            <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>단계 {winterStep}: {[
                "1단계: 솔로 시나리오",
                "2단계: 노화 판정 (Aging)",
                "3단계: 영지 수확 및 경제 정산",
                "4단계: 동료 및 군마 생존 판정",
                "5단계: 개인 돌발 사건 (Personal Events)",
                "6단계: 가문 정산 (결혼/출산/가문사건)",
                "7단계: 경험 판정 (Experience)",
                "8단계: 자유 단련 및 수련 (Training)",
                "9단계: 영예 계산 및 정산 (Glory)",
                "10단계: 영예 돌파 보너스 및 봄 맞이"
              ][winterStep - 1]}</h3>
              <button className="btn-medieval" onClick={resetWinter} style={{ fontSize: '0.78rem', padding: '2px 6px', background: 'none' }}>
                <RotateCcw size={12} /> 초기화
              </button>
            </div>
            
            <div className="cs-section-inner" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              {/* CONTENT FOR EACH STEP */}
              <div style={{ marginBottom: '20px' }}>
                
                {/* STEP 1 */}
                {winterStep === 1 && (
                  <div>
                    <p style={{ marginBottom: '10px' }}>여름 모험 세션에 참여하지 못했거나 추가 성장이 필요하다면, 주사위 판정으로 1대1 솔로 시나리오를 전개할 수 있습니다.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)' }}>팁: 신설된 <strong>제국 백과사전(Lore)</strong> 탭에서 15가지 솔로 시나리오의 흐름과 룰을 확인해 보세요.</p>
                    <div style={{ marginTop: '16px', padding: '10px', border: '1px dashed var(--color-gold)', background: 'rgba(179,143,67,0.03)', textAlign: 'center' }}>
                      <Compass size={24} style={{ margin: '0 auto 8px', color: 'var(--color-gold)' }} />
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>솔로 시나리오 진행을 마쳤습니까?</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginTop: '4px' }}>진행 완료 시 다음 단계로 진행하세요. 만약 진행하지 않았다면 무시하고 넘어가시면 됩니다.</p>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {winterStep === 2 && (
                  <div>
                    {/* 📖 룰북 노화 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefAging(!showRefAging)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 노화 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefAging ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefAging && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 기사의 나이가 <strong>30세 이상</strong>일 때 매 겨울마다 d20을 굴려 노화 여부를 판정합니다. (30세 미만은 무조건 생략)
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 결과</th>
                                <th style={{ padding: '4px' }}>감소 판정 주사위 횟수 (1d6)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>1</td>
                                <td style={{ padding: '4px' }}><strong>5회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>2 ~ 3</td>
                                <td style={{ padding: '4px' }}><strong>4회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>4 ~ 6</td>
                                <td style={{ padding: '4px' }}><strong>3회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>7 ~ 10</td>
                                <td style={{ padding: '4px' }}><strong>2회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>11 ~ 15</td>
                                <td style={{ padding: '4px' }}><strong>1회</strong> 굴림</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>16 ~ 20</td>
                                <td style={{ padding: '4px' }}><strong>0회</strong> (스탯 하락 없음)</td>
                              </tr>
                            </tbody>
                          </table>
                          <p style={{ margin: '6px 0 0 0', fontStyle: 'italic', color: 'var(--color-grey)', lineHeight: '1.3' }}>
                            ※ 감소 판정 1d6 결과에 따라 해당 능력치 영구 -1 하락:<br />
                            1 = SIZ, 2 = DEX, 3 = STR, 4 = CON, 5 = APP, 6 = 하락 없음 (피해 무효)
                          </p>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>기사의 나이가 <strong>30세 이상</strong>이면 세월의 흐름에 따른 노화 판정 주사위를 굴립니다.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ padding: '10px 14px', border: '1px solid var(--color-crimson)', background: 'rgba(153,34,34,0.03)' }}>
                        현재 기사의 나이: <strong style={{ fontSize: '1.2rem', color: 'var(--color-crimson)' }}>{character.personal.age}세</strong>
                      </div>
                      
                      {!agingApplied ? (
                        <button className="btn-medieval btn-medieval-primary" onClick={rollAging}>
                          <Dices size={15} /> 노화 판정 굴리기 (d20)
                        </button>
                      ) : (
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> 적용 완료!
                        </div>
                      )}
                    </div>

                    {agingD20 && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold-light)', padding: '12px', background: 'rgba(179,143,67,0.04)' }}>
                        <div>d20 결과: <strong>{agingD20}</strong> (30세 미만은 항상 패스)</div>
                        <div style={{ marginTop: '6px' }}>
                          영향받는 주요 속성 개수: <strong>{agingLosses.length}개</strong>
                          {agingLosses.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {agingLosses.map((l, i) => (
                                <span key={i} style={{ padding: '2px 8px', border: '1px solid var(--color-danger)', fontSize: '0.8rem', background: '#fff', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                                  {l === 'None' ? '피해없음' : `${l} -1`}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {!agingApplied && (
                          <button className="btn-medieval" onClick={applyAging} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                            노화 피해 시트에 영구 반영하기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3 */}
                {winterStep === 3 && (
                  <div>
                    {/* 📖 룰북 영지 수확 및 경제 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefHarvest(!showRefHarvest)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 영지 수확 및 경제 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefHarvest ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefHarvest && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 기사의 영지 관리(Stewardship) 기술 수치를 기준으로 d20을 굴려 세입 배율을 결정합니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>Stewardship 판정 결과</th>
                                <th style={{ padding: '4px' }}>세입 배율</th>
                                <th style={{ padding: '4px' }}>획득 세입 (£)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>대성공 (Critical) <span style={{fontWeight:'normal', fontSize:'0.7rem', color:'var(--color-grey)'}}>(d20 결과가 1 또는 Stewardship 수치와 동일)</span></td>
                                <td style={{ padding: '4px' }}><strong>x1.5</strong></td>
                                <td style={{ padding: '4px' }}>£9</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>성공 (Success) <span style={{fontWeight:'normal', fontSize:'0.7rem', color:'var(--color-grey)'}}>(d20 결과가 Stewardship 수치 미만)</span></td>
                                <td style={{ padding: '4px' }}><strong>x1.0</strong></td>
                                <td style={{ padding: '4px' }}>£6 (기본 수입)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>실패 (Failure) <span style={{fontWeight:'normal', fontSize:'0.7rem', color:'var(--color-grey)'}}>(d20 결과가 Stewardship 수치 초과)</span></td>
                                <td style={{ padding: '4px' }}><strong>x0.75</strong></td>
                                <td style={{ padding: '4px' }}>£4 (반올림)</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>대실패 (Fumble) <span style={{fontWeight:'normal', fontSize:'0.7rem', color:'var(--color-grey)'}}>(d20 결과가 20)</span></td>
                                <td style={{ padding: '4px' }}><strong>x0.5</strong></td>
                                <td style={{ padding: '4px' }}>£3</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>영지 관리(Stewardship) 판정을 통해 올해 대농장의 풍흉작과 세입 배율을 결정합니다.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ padding: '10px 14px', border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.02)' }}>
                        영지관리(Stewardship) 수치: <strong>{character.skills.stewardship || 3}</strong>
                      </div>
                      
                      {!harvestApplied ? (
                        <button className="btn-medieval btn-medieval-primary" onClick={rollHarvest}>
                          <Dices size={15} /> 수확 판정 굴리기 (d20)
                        </button>
                      ) : (
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={16} /> 소지금 합산 완료!
                        </div>
                      )}
                    </div>

                    {harvestRoll && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold-light)', padding: '12px', background: 'rgba(179,143,67,0.04)' }}>
                        <div>d20 결과: <strong>{harvestRoll}</strong> (Stewardship 이하 성공)</div>
                        <div style={{ marginTop: '6px', fontSize: '1rem' }}>
                          수확 결과 배율: <strong style={{ color: 'var(--color-crimson)' }}>x{harvestMult}</strong> (매출: <strong>£{harvestRevenue}</strong> 상당)
                        </div>
                        {!harvestApplied && (
                          <button className="btn-medieval" onClick={applyHarvest} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                            £{harvestRevenue} 소지금에 합산하기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4 */}
                {winterStep === 4 && (
                  <div>
                    {/* 📖 룰북 동료 및 군마 생존 판정 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefSurvival(!showRefSurvival)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 동료 및 군마 생존 판정 레퍼런스 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefSurvival ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefSurvival && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)' }}>
                            * 동종 기사의 종자(Squire)와 군마(Warhorse)가 겨울을 건강히 넘겼는지 d20 생존 주사위를 굴립니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 결과</th>
                                <th style={{ padding: '4px' }}>상태 및 게임 효과</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>1</td>
                                <td style={{ padding: '4px' }}><strong>사망 위험 (Die / Lost)</strong> - 사망하거나 가출/실종됩니다. 새로운 동료/말을 구해야 합니다.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold' }}>2</td>
                                <td style={{ padding: '4px' }}><strong>질병 (Illness / Injured)</strong> - 심한 병치레나 골절상을 겪어, 다음 해 생존 판정에 <strong>-5 보정</strong>을 적용받습니다.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>3 ~ 20</td>
                                <td style={{ padding: '4px' }}><strong>건강함 (Healthy)</strong> - 이상 없이 겨울을 보내고 다음 해 기사를 보조합니다.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>소중한 충복 종자(Squire) 및 아끼는 돌격 전투마(Charger)의 생존을 체크합니다.</p>
                    
                    {!survivalApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={rollSurvival}>
                        <Dices size={15} /> 생존 판정 굴리기 (d20)
                      </button>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 생존 결과 기록 완료!
                      </div>
                    )}

                    {squireSurvivalRoll && (
                      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', background: squireStatus.includes('사망') ? 'rgba(153,34,34,0.04)' : '#fff' }}>
                          <strong>종자 (Squire) 생존:</strong>
                          <div style={{ marginTop: '4px' }}>d20 결과: <strong>{squireSurvivalRoll}</strong></div>
                          <div style={{ fontWeight: 'bold', color: squireStatus.includes('사망') ? 'var(--color-danger)' : 'green' }}>상태: {squireStatus}</div>
                        </div>
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', background: horseStatus.includes('사망') ? 'rgba(153,34,34,0.04)' : '#fff' }}>
                          <strong>전투마 (warhorse) 생존:</strong>
                          <div style={{ marginTop: '4px' }}>d20 결과: <strong>{horseSurvivalRoll}</strong></div>
                          <div style={{ fontWeight: 'bold', color: horseStatus.includes('사망') ? 'var(--color-danger)' : 'green' }}>상태: {horseStatus}</div>
                        </div>
                      </div>
                    )}

                    {squireSurvivalRoll && !survivalApplied && (
                      <button className="btn-medieval" onClick={applySurvival} style={{ marginTop: '12px', justifyContent: 'center', width: '100%' }}>
                        생존 결과 기록실 인계하기
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 5 */}
                {winterStep === 5 && (
                  <div>
                    {/* 📖 룰북 개인 돌발 사건 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefPersonal(!showRefPersonal)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 개인 돌발 사건 (Table 10-9) 레퍼런스 전체 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefPersonal ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefPersonal && (
                        <div style={{ padding: '10px', fontSize: '0.72rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff', maxHeight: '300px', overflowY: 'auto' }}>
                          <p style={{ margin: '0 0 8px 0', color: 'var(--color-ink-light)' }}>
                            * 겨울철 기사 한 명 한 명에게 닥쳐오는 성향, 열망 또는 지위 시험 이벤트 테이블입니다. (d20 굴림)
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px', width: '40px' }}>d20</th>
                                <th style={{ padding: '4px', width: '120px' }}>성향/지위 시험</th>
                                <th style={{ padding: '4px' }}>성공/실패 효과 요약</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(personalEventTable).map(([d, ev]) => (
                                <tr key={d} style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '4px', fontWeight: 'bold', textAlign: 'center' }}>{d}</td>
                                  <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>{ev.name}</td>
                                  <td style={{ padding: '4px', lineHeight: '1.25' }}>
                                    <span style={{color:'green'}}><strong>대성공:</strong> {ev.crit}</span><br />
                                    <span style={{color:'#666'}}><strong>성공:</strong> {ev.succ}</span><br />
                                    <span style={{color:'var(--color-crimson)'}}><strong>실패:</strong> {ev.fail}</span><br />
                                    <span style={{color:'red'}}><strong>대실패:</strong> {ev.fumb}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>룰북 <strong>Table 10-9</strong>에 수록된 기사들의 겨울철 20가지 성향 연동 돌발 사건을 판정합니다.</p>
                    
                    {!personalEventApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={rollPersonalEvent}>
                        <Dices size={15} /> 개인 사건 굴리기 (Table 10-9 d20)
                      </button>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 사건 해결 완료!
                      </div>
                    )}

                    {personalEventRoll && personalEventText && (
                      <div style={{ marginTop: '16px', border: '1px solid var(--color-gold)', padding: '14px', background: 'rgba(179,143,67,0.03)' }}>
                        <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '8px' }}>
                          d20 [#{personalEventRoll}]: {personalEventText.name}
                        </h4>
                        
                        <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                          <div><strong>대성공 (Critical):</strong> {personalEventText.crit}</div>
                          <div><strong>성공 (Success):</strong> {personalEventText.succ}</div>
                          <div><strong>실패 (Failure):</strong> {personalEventText.fail}</div>
                          <div><strong>대실패 (Fumble):</strong> {personalEventText.fumb}</div>
                        </div>

                        {!personalEventApplied && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['Critical', 'Success', 'Failure', 'Fumble'].map(o => (
                              <button key={o} className="btn-medieval" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => applyPersonalEvent(o)}>
                                {o} 결과 적용
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6 */}
                {winterStep === 6 && (
                  <div>
                    {/* 📖 룰북 가문 정산 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefFamily(!showRefFamily)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 가문 정산 (결혼, 출산, 가문 사건) 판정 테이블 보기
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefFamily ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefFamily && (
                        <div style={{ padding: '12px', fontSize: '0.72rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '350px', overflowY: 'auto' }}>
                          {/* Marriage Table */}
                          <div>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              1. Marriage Table (결혼 주사위 판정표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>배우자 신분</th>
                                  <th style={{ padding: '3px 2px' }}>지참금 (£)</th>
                                  <th style={{ padding: '3px 2px' }}>결혼 영예</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1 ~ 5</td>
                                  <td style={{ padding: '3px 2px' }}>부유한 평민 상인의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>9d3 (£9 ~ 27)</td>
                                  <td style={{ padding: '3px 2px' }}>0 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>6 ~ 8</td>
                                  <td style={{ padding: '3px 2px' }}>수습 종자의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>£3</td>
                                  <td style={{ padding: '3px 2px' }}>10 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>9 ~ 10</td>
                                  <td style={{ padding: '3px 2px' }}>가신 기사의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d6 (£1 ~ 6)</td>
                                  <td style={{ padding: '3px 2px' }}>50 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>11</td>
                                  <td style={{ padding: '3px 2px' }}>부유한 봉신기사의 맏딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d3+6 (£7 ~ 9)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>12 ~ 20</td>
                                  <td style={{ padding: '3px 2px' }}>일반 봉신기사의 딸</td>
                                  <td style={{ padding: '3px 2px' }}>1d6 (£1 ~ 6)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>21 ~ 25</td>
                                  <td style={{ padding: '3px 2px' }}>봉신기사 가문 여상속인 (Heir)</td>
                                  <td style={{ padding: '3px 2px' }}>£15 (장원 상속)</td>
                                  <td style={{ padding: '3px 2px' }}>100 Glory</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>26 이상</td>
                                  <td style={{ padding: '3px 2px' }}>남작 가문의 막내딸</td>
                                  <td style={{ padding: '3px 2px' }}>£20</td>
                                  <td style={{ padding: '3px 2px' }}>250 Glory</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* Childbirth Table */}
                          <div style={{ marginTop: '10px' }}>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              2. Childbirth Table (출산 주사위 판정표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>출산 결과 및 상태</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>1 ~ 10</td>
                                  <td style={{ padding: '3px 2px' }}>아무 일 없음 (임신하지 않았거나 출산 지연)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'red' }}>11</td>
                                  <td style={{ padding: '3px 2px' }}><strong>비극:</strong> 산모(배우자)와 신생아 모두 출산 중 사망</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-crimson)' }}>12</td>
                                  <td style={{ padding: '3px 2px' }}><strong>비극:</strong> 산모 사망, 아이는 생존 (성별 1d6: 홀수=아들, 짝수=딸)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>13 ~ 19</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사:</strong> 건강한 아이 출생 (성별 1d6: 홀수=아들, 짝수=딸)</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>20</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사:</strong> 쌍둥이 탄생! (각 성별 1d6)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* Family Event Table */}
                          <div style={{ marginTop: '10px' }}>
                            <h5 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                              3. Family Event Table (가문 무작위 사건표)
                            </h5>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                  <th style={{ padding: '3px 2px', width: '60px' }}>d20 결과</th>
                                  <th style={{ padding: '3px 2px' }}>사건 명칭 및 게임 효과</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'red' }}>1</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문의 비극:</strong> 친족 한 명이 마상시합 또는 혈투 끝에 급서</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>2</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문의 영광:</strong> 친족이 주군 구출 후 사망. (가문 전원 +10 Glory)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>3</td>
                                  <td style={{ padding: '3px 2px' }}><strong>위대한 위업:</strong> 친족이 멧돼지 습격에서 주군 구출. (가문 전원 +5 Glory)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>4</td>
                                  <td style={{ padding: '3px 2px' }}><strong>납치 사건:</strong> 친족이 강제 결혼 또는 몸값을 노린 도적단에 납치됨</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold' }}>5</td>
                                  <td style={{ padding: '3px 2px' }}><strong>실종 사건:</strong> 가문 일원 중 한 명이 사냥 또는 전쟁 중 행방불명됨</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>8</td>
                                  <td style={{ padding: '3px 2px' }}><strong>뜻밖의 하사품:</strong> 선조의 고대 성물 발견 및 상속</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>10</td>
                                  <td style={{ padding: '3px 2px' }}><strong>경사스런 혼사:</strong> 영예로운 가문 동맹 및 명문가 결혼. (가문 명예 +1)</td>
                                </tr>
                                <tr style={{ borderBottom: '1px dashed #eee' }}>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'green' }}>19</td>
                                  <td style={{ padding: '3px 2px' }}><strong>벼락 영전:</strong> 친족이 황실 궁정 백작이나 순찰사 임명. (가문 전원 +10 Glory)</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '3px 2px', fontWeight: 'bold', color: 'var(--color-grey)' }}>기타 결과</td>
                                  <td style={{ padding: '3px 2px' }}><strong>가문 평온:</strong> 특별한 일 없이 무난하게 영지에서 생활함</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '10px' }}>기사의 대를 잇기 위한 <strong>결혼(Courtesy), 출산(Childbirth), 가문사건(Table 10-12)</strong>을 정산합니다.</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <button className="btn-medieval" onClick={rollMarriage}><Dices size={12} /> 무작위 결혼 굴림 (Table 10-10)</button>
                      <button className="btn-medieval" onClick={rollChildbirth}><Dices size={12} /> 출산 d20 (Table 10-11)</button>
                      <button className="btn-medieval" onClick={rollFamilyEvent}><Dices size={12} /> 가문사건 d20 (Table 10-12)</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {marriageResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>결혼 판정:</strong> {marriageResult.rank} (지참금: <strong>£{marriageResult.dowry}</strong>, 영예: <strong>+{marriageResult.glory}</strong>)
                        </div>
                      )}
                      {childbirthResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>출산 d20 [{childbirthRoll}]:</strong> {childbirthResult}
                        </div>
                      )}
                      {familyEventResult && (
                        <div style={{ border: '1px solid var(--color-gold-light)', padding: '8px', background: '#fff', fontSize: '0.85rem' }}>
                          <strong>가문사건 d20 [{familyEventRoll}]:</strong> {familyEventResult}
                        </div>
                      )}
                    </div>

                    {(marriageResult || childbirthResult || familyEventResult) && !familyApplied && (
                      <button className="btn-medieval btn-medieval-primary" onClick={applyFamilyPhase} style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
                        가문 정산 결과(소지금 &amp; 영예) 최종 반영하기
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 7 */}
                {winterStep === 7 && (
                  <div>
                    {/* 📖 룰북 경험 성장 레퍼런스 */}
                    <div style={{ marginBottom: '16px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowRefExperience(!showRefExperience)}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 룰북 경험 성장 (Experience Check) 레퍼런스 규칙
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-grey)' }}>{showRefExperience ? '접기 ▲' : '펼치기 ▼'}</span>
                      </div>
                      {showRefExperience && (
                        <div style={{ padding: '10px', fontSize: '0.74rem', borderTop: '1px solid rgba(201,168,76,0.15)', backgroundColor: '#fff' }}>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--color-ink-light)', lineHeight: '1.3' }}>
                            * 세션 시나리오 도중 체크(☐)된 모든 스펙트럼(기술, 성향, 열망)에 대해 각각 d20을 굴려 성장을 시도합니다.
                          </p>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                                <th style={{ padding: '4px' }}>d20 굴림 결과</th>
                                <th style={{ padding: '4px' }}>성공 판정 기준 및 결과</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px dashed #eee' }}>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'green' }}>현재 수치 이상 <span style={{fontWeight:'normal'}}>또는</span> 20</td>
                                <td style={{ padding: '4px' }}><strong>성장 성공:</strong> 해당 능력치가 <strong>+1점 상승</strong>하며, 체크가 해제됩니다.</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '4px', fontWeight: 'bold', color: 'var(--color-grey)' }}>현재 수치 미만 <span style={{fontWeight:'normal'}}>(20 미만)</span></td>
                                <td style={{ padding: '4px' }}><strong>성장 실패:</strong> 능력치 상승은 없으며, 체크만 해제됩니다.</td>
                              </tr>
                            </tbody>
                          </table>
                          <p style={{ margin: '6px 0 0 0', fontStyle: 'italic', color: 'var(--color-grey)' }}>
                            ※ 수치 한계: 일반적인 겨울 경험 성장은 최대 15점까지만 가능하며, 15점 도달 이후에는 Step 8의 상급기술 돌파(Option C) 또는 영예 보너스 등을 통해서만 16점 이상 돌파할 수 있습니다.
                          </p>
                        </div>
                      )}
                    </div>
                    <p style={{ marginBottom: '12px' }}>여름 모험 중에 체크(☐)된 기사의 기술, 성향, 열망들을 한 해 수련 성과로 d20 성장 판정합니다.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)', marginBottom: '12px' }}>룰북 규정: d20 굴림 결과가 <strong>현재 값 이상 또는 20</strong>이 나오면 +1점 상승하고 시트 체크가 해제됩니다.</p>
                    
                    {!experienceApplied ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={runExperiencePhase}>
                        <Dices size={15} /> 경험 성장 판정 실행 (Checked Stats d20)
                      </button>
                    ) : (
                      <div>
                        <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                          <Check size={16} /> 성장 판정 실행 완료!
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--color-grey-light)', padding: '8px', background: '#fff' }}>
                          {experienceLogs.map((l, i) => <div key={i} style={{ fontSize: '0.8rem' }}>{l}</div>)}
                          {experienceLogs.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--color-grey)', fontStyle: 'italic' }}>성장한 스탯이 없습니다.</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 8 */}
                {winterStep === 8 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>겨울 여유 시간 동안 기사의 특별 자유 연마를 설계하여 시트에 직접 즉시 반영합니다.</p>
                    
                    {!trainingApplied ? (
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '14px', background: 'rgba(179,143,67,0.02)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <button className={`btn-medieval ${trainingOption === 'optionA' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => { setTrainingOption('optionA'); setSelectedAttribute(''); setSelectedTrait(''); setSelectedPassion(''); setSelectedStanding(''); }}>
                            A. 능력치/성향/열망 +1
                          </button>
                          <button className={`btn-medieval ${trainingOption === 'optionB' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => setTrainingOption('optionB')}>
                            B. 4개 기술 단련 (+1)
                          </button>
                          <button className={`btn-medieval ${trainingOption === 'optionC' ? 'btn-medieval-primary' : ''}`} style={{ fontSize: '0.8rem' }} onClick={() => { setTrainingOption('optionC'); setSelectedHighSkill(''); }}>
                            C. 상급기술 돌파 (+1)
                          </button>
                        </div>

                        {/* Option A form */}
                        {trainingOption === 'optionA' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                            <div>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>능력치 상승 (SIZ는 21세, 기타 30세 나이제한 적용):</label>
                              <select value={selectedAttribute} onChange={e => { setSelectedAttribute(e.target.value); setSelectedTrait(''); setSelectedPassion(''); setSelectedStanding(''); }} style={{ width: '100%', padding: '4px' }}>
                                <option value="">-- 선택 --</option>
                                {attributeKeys.map(k => <option key={k} value={k}>{k.toUpperCase()} (현재: {character.attributes[k]}점)</option>)}
                              </select>
                            </div>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-grey)' }}>또는</div>
                            <div>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>성향/열망/사회적 명망 상승 (한계 15):</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <select value={selectedTrait} onChange={e => { setSelectedTrait(e.target.value); setSelectedAttribute(''); setSelectedPassion(''); setSelectedStanding(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 성향 선택 --</option>
                                  {traitKeys.map(k => <option key={k} value={k}>{k} (현재: {character.traits[k]}점)</option>)}
                                </select>
                                <select value={selectedPassion} onChange={e => { setSelectedPassion(e.target.value); setSelectedAttribute(''); setSelectedTrait(''); setSelectedStanding(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 열망 선택 --</option>
                                  {passionKeys.map(k => <option key={k} value={k}>{k} (현재: {character.passions[k]}점)</option>)}
                                </select>
                                <select value={selectedStanding} onChange={e => { setSelectedStanding(e.target.value); setSelectedAttribute(''); setSelectedTrait(''); setSelectedPassion(''); }} style={{ flex: '1', padding: '4px' }}>
                                  <option value="">-- 명망 선택 --</option>
                                  {standingKeys.map(k => <option key={k} value={k}>{k} (현재: {character.standings[k]}점)</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Option B form */}
                        {trainingOption === 'optionB' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                            <p style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>4개 종류 기술에 각 +1점 성장 (단, 15점 초과 불가능 &amp; 초기치 0 불가능)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>일반 모험 기술:</label>
                                <select value={selectedSkills.adventure} onChange={e => setSelectedSkills(prev => ({ ...prev, adventure: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["awareness", "chirurgery", "faerieLore", "firstAid", "folkLore", "horsemanship", "hunting", "industry", "recognize", "religion", "stewardship", "swimming"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>궁정 예법 기술:</label>
                                <select value={selectedSkills.courtly} onChange={e => setSelectedSkills(prev => ({ ...prev, courtly: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["courtesy", "dancing", "eloquence", "falconry", "gaming", "heraldry", "intrigue", "playInstruments", "readingWriting", "romance", "singing"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>전투/무기 기술:</label>
                                <select value={selectedSkills.combat} onChange={e => setSelectedSkills(prev => ({ ...prev, combat: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).filter(k => ["battle", "siege", "sword", "lance", "axe", "spear", "dagger", "bludgeon", "unarmed"].includes(k)).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ display: 'block', marginBottom: '2px' }}>자유 선택 기술:</label>
                                <select value={selectedSkills.free} onChange={e => setSelectedSkills(prev => ({ ...prev, free: e.target.value }))} style={{ width: '100%', padding: '4px' }}>
                                  <option value="">-- 선택 --</option>
                                  {Object.keys(character.skills).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Option C form */}
                        {trainingOption === 'optionC' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                            <p style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>이미 15점 이상에 도달한 최상급 기술 하나를 +1점 돌파 성장 (상한 20)</p>
                            <select value={selectedHighSkill} onChange={e => setSelectedHighSkill(e.target.value)} style={{ width: '100%', padding: '4px' }}>
                              <option value="">-- 선택 (15점 이상 기술 목록) --</option>
                              {Object.keys(character.skills).filter(k => (character.skills[k] >= 15)).map(k => <option key={k} value={k}>{k} (현재: {character.skills[k]}점)</option>)}
                            </select>
                          </div>
                        )}

                        {trainingOption && (
                          <button className="btn-medieval btn-medieval-primary" onClick={applyTraining} style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                            자유 수련 단련 효과 시트에 즉시 반영하기
                          </button>
                        )}

                      </div>
                    ) : (
                      <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={16} /> 기사 자유 단련 수련이 성공적으로 시트에 반영되었습니다!
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 9 */}
                {winterStep === 9 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>올해 모험 중 획득한 세션 영예와 영지 6점, Chivalrous/Religious/Romantic 기사 등 이상 보너스(+100) 및 패시브 영예를 합산 정산합니다.</p>
                    
                    {!calculatedAnnualGlory ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={computeGlory}>
                        <Award size={15} /> 연간 영예 자동 계산 실행
                      </button>
                    ) : (
                      <div>
                        <div style={{ border: '1px solid var(--color-gold)', padding: '12px', background: 'rgba(179,143,67,0.03)', marginBottom: '12px' }}>
                          <div>이번 세션 중 획득 영예: <strong>{character.gear.gloryThisGame} Glory</strong></div>
                          <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-crimson)' }}>
                            연간 고정 및 패시브 영예 합산: +{calculatedAnnualGlory} Glory
                          </div>
                        </div>
                        
                        {!gloryApplied ? (
                          <button className="btn-medieval btn-medieval-primary" onClick={applyGlory} style={{ width: '100%', justifyContent: 'center' }}>
                            모든 정산 영예를 시트 누적 영예(Glory Total)에 최종 합산하기
                          </button>
                        ) : (
                          <div style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={16} /> 영예 합산 정산 완료!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 10 */}
                {winterStep === 10 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>기사의 총누적 영예가 <strong>새로운 1,000단위</strong>를 돌파할 때마다 부여되는 <strong>영예 보너스 위젯</strong>입니다.</p>
                    
                    {gloryBonusPoints > 0 ? (
                      <div style={{ border: '1px solid var(--color-gold)', padding: '14px', background: 'rgba(179,143,67,0.03)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--color-crimson)' }}>
                          🎉 영예 돌파 보너스 활성화! 사용 가능 점수: {gloryBonusPoints - bonusSpent} / {gloryBonusPoints} 점
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)' }}>돌파 보너스는 나이 제한이나 수치 제한 없이 시트의 원하는 어떤 수치든 +1점 상승시킬 수 있습니다.</p>
                        
                        {bonusSpent < gloryBonusPoints && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <select id="bonus-attr-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('attribute', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 주요능력치 (+1) --</option>
                                {attributeKeys.map(k => <option key={k} value={k}>{k.toUpperCase()} ({character.attributes[k]})</option>)}
                              </select>
                              <select id="bonus-trait-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('trait', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사성향 (+1) --</option>
                                {traitKeys.map(k => <option key={k} value={k}>{k} ({character.traits[k]})</option>)}
                              </select>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <select id="bonus-skill-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('skill', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사기술 (+1) --</option>
                                {Object.keys(character.skills).map(k => <option key={k} value={k}>{k} ({character.skills[k]})</option>)}
                              </select>
                              <select id="bonus-passion-sel" style={{ flex: '1', padding: '4px' }} onChange={e => { spendGloryBonus('passion', e.target.value); e.target.value = ''; }}>
                                <option value="">-- 기사열망 (+1) --</option>
                                {passionKeys.map(k => <option key={k} value={k}>{k} ({character.passions[k]})</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-grey)' }}>올해는 영예 1,000단위 돌파 보너스 점수가 활성화되지 않았습니다.</p>
                    )}

                    <div style={{ marginTop: '20px', borderTop: '2px solid var(--color-gold)', paddingTop: '16px', textAlign: 'center' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'green', marginBottom: '8px' }}>⚔️ 겨울을 이겨내고 새 봄을 맞이할 준비가 되셨습니까?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '14px' }}>
                        버튼을 누르면 겨울 정산이 완전히 영구 완료되며, 기사의 공식 연령이 **+1세** 증가하고 대시보드로 돌아갑니다.
                      </p>
                      <button className="btn-medieval btn-medieval-primary" style={{ margin: '0 auto', fontSize: '1.05rem', padding: '8px 20px' }} onClick={endWinterPhase}>
                        새로운 봄 기운 열기 (기사 나이 +1)
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Wizard Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gold-light)', paddingTop: '12px' }}>
                <button className="btn-medieval" disabled={winterStep === 1} onClick={() => setWinterStep(w => w - 1)}>
                  <ChevronLeft size={14} /> 이전 단계
                </button>
                <button className="btn-medieval" disabled={winterStep === 10} onClick={() => setWinterStep(w => w + 1)}>
                  다음 단계 <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </section>

          {/* Sub Panel: Logger */}
          <section className="cs-section" style={{ marginTop: '8px' }}>
            <div className="sheet-ribbon"><h3>겨울 정산 결과 실시간 기록실 (Log)</h3></div>
            <div className="cs-section-inner">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', border: '1px solid var(--color-gold-light)' }}>
                {logMessages.length === 0 ? (
                  <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '30px 0' }}>
                    겨울 주사위 굴림 기록이 여기에 기록됩니다.
                  </div>
                ) : (
                  logMessages.map((msg, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '5px', lineHeight: 1.4, display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>[로그]</span>
                      <span style={{ color: 'var(--color-ink)' }}>{msg}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* SUB TAB: RETIREMENT & SALVATION */}
      {activeSubTab === 'salvation' && (() => {
        // Calculate lowest religious trait
        const chaste = character.traits.chaste || 10;
        const forgiving = character.traits.forgiving || 10;
        const merciful = character.traits.merciful || 10;
        const modest = character.traits.modest || 10;
        const temperate = character.traits.temperate || 10;
        const trusting = character.traits.trusting || 10;

        const lowestReligiousTrait = Math.min(chaste, forgiving, merciful, modest, temperate, trusting);

        // Passion bonuses
        const amorVal = character.passions.amor || 0;
        const honorVal = character.passions.honor || 0;
        const loyaltyLiege = character.passions.loyaltyLiege || 0;
        const loveGodVal = character.passions.loveGod || 0;

        const amorBonus = Math.min(5, Math.max(0, amorVal - 15));
        const honorBonus = Math.min(5, Math.max(0, honorVal - 15));
        const liegeBonus = Math.min(5, Math.max(0, loyaltyLiege - 15));
        const godBonus = Math.min(5, Math.max(0, loveGodVal - 15));

        const deedsBonus = (salvationDeedsPaladin ? 5 : 0) + 
                            (salvationDeedsHolyWar ? 5 : 0) + 
                            Math.min(5, Math.max(0, parseInt(salvationPagans) || 0)) + 
                            (parseInt(salvationCustomDeeds) || 0);

        const totalSalvationScore = lowestReligiousTrait + amorBonus + honorBonus + liegeBonus + godBonus + deedsBonus;

        const rollSalvation = () => {
          let d20 = parseInt(salvationManualD20);
          if (isNaN(d20) || d20 < 1 || d20 > 20) {
            d20 = Math.floor(Math.random() * 20) + 1;
          }

          let outcome = "";
          let destination = "";
          let saintEligible = false;
          let isSaint = false;

          // Critical
          if (d20 === 1) {
            outcome = "⭐ 임계 성공 (Critical Success!)";
            destination = "👼 천국 직행 (Immediate Heaven!)";
            if (deedsBonus >= 15) {
              saintEligible = true;
            }
          } 
          // Fumble
          else if (d20 === 20) {
            outcome = "💀 임계 실패 (Fumble!)";
            if (totalSalvationScore <= 5) {
              destination = "🔥 지옥 낙하 (Damned to Hell!)";
            } else {
              destination = "⛪ 연옥 (Purgatory)";
            }
          } 
          // Success
          else if (d20 <= totalSalvationScore) {
            outcome = "✅ 성공 (Success)";
            destination = "👼 천국 (Heaven)";
          } 
          // Failure
          else {
            outcome = "❌ 실패 (Failure)";
            destination = "⛪ 연옥 (Purgatory)";
          }

          // If saint eligible, check church standing
          const churchStanding = character.standings.church || 15;
          const churchRoll = Math.floor(Math.random() * 20) + 1;
          if (saintEligible && churchRoll <= churchStanding) {
            isSaint = true;
          }

          setSalvationRollResult({
            roll: d20,
            total: totalSalvationScore,
            outcome,
            destination,
            isSaint,
            churchRoll,
            churchStanding
          });
        };

        const applySalvationLegacy = () => {
          if (!salvationRollResult) return;
          const { isSaint } = salvationRollResult;

          setCharacter(prev => {
            const updated = JSON.parse(JSON.stringify(prev));
            // Heirloom / legacy bonuses
            updated.gear.gloryTotal = Math.floor((updated.gear.gloryTotal || 1000) * 1.1); // Inherit 1.1x total glory in next generation
            updated.personal.age = 18;
            updated.personal.personalClass = "종자 (Squire)";
            updated.personal.name = "계승자 " + updated.personal.name.replace(" 경", "").replace("Sir ", "");
            
            if (isSaint) {
              updated.personal.blessing = "가문의 수호 성인 축복 (Saintly Lineage)";
            }
            return updated;
          });

          alert("기사의 은퇴 판정 유산이 성기사 캐릭터 시트에 영구히 반영되었습니다!\n(다음 세대 계승자 종자가 준비되었습니다!)");
        };

        return (
          <section className="cs-section view-animate">
            <div className="sheet-ribbon"><h3>⛪ 기사 은퇴 및 영면 구원 판정 (Salvation Roll)</h3></div>
            <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ backgroundColor: 'rgba(43, 65, 112, 0.04)', border: '1.5px solid var(--color-gold)', padding: '16px', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-royal-blue)' }}>
                  📖 구원(Salvation) 판정 규칙
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-ink)', lineHeight: '1.45', margin: 0 }}>
                  룰북 42쪽 규칙에 의거, 기사 캐릭터가 전사하거나 은퇴할 때 자신의 평생의 공적과 신앙심을 저울질하여 천국, 연옥, 지옥 중 어디로 갈지 판정합니다.<br />
                  구원 판정에 성공하면 다음 세대 계승자는 **이전 캐릭터의 특정한 핵심 스킬 전수 보너스** 및 **시작 탄생 선물 가산 혜택**을 누립니다.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Score Calculator */}
                <div style={{ border: '1.2px solid rgba(201,168,76,0.3)', padding: '14px', borderRadius: '6px', backgroundColor: '#fff' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '4px' }}>
                    📊 구원 스코어 계산기 (Salvation Score)
                  </h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>⛪ 가장 낮은 종교적 성향 수치 (기본값):</span>
                      <strong style={{ color: 'var(--color-crimson)' }}>{lowestReligiousTrait} 점</strong>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', marginTop: '-6px', marginBottom: '4px' }}>
                      * 정숙({chaste}), 관용({forgiving}), 자비({merciful}), 겸손({modest}), 절제({temperate}), 신뢰({trusting}) 중 최솟값
                    </span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>💘 연인 열망 보너스 (Amor &gt; 15):</span>
                      <span>+{amorBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({amorVal}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>🏅 명예 열망 보너스 (Honor &gt; 15):</span>
                      <span>+{honorBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({honorVal}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>👑 주군 충성 보너스 (Loyalty &gt; 15):</span>
                      <span>+{liegeBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({loyaltyLiege}점)</span></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '4px' }}>
                      <span>⛪ 신앙 열망 보너스 (Love God &gt; 15):</span>
                      <span>+{godBonus} 점 <span style={{ color: 'var(--color-grey)' }}>({loveGodVal}점)</span></span>
                    </div>

                    {/* Deeds Checklist */}
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={salvationDeedsPaladin} onChange={e => setSalvationDeedsPaladin(e.target.checked)} />
                        🛡️ 성기사 공적 (Paladin Deeds): +5 점
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={salvationDeedsHolyWar} onChange={e => setSalvationDeedsHolyWar(e.target.checked)} />
                        ⛪ 성전 참전 중 전사 또는 은퇴 후 수도자 귀의: +5 점
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>🧙 직접 개종시킨 이교도 수 (최대 5):</span>
                        <input type="number" min={0} max={5} value={salvationPagans} onChange={e => setSalvationPagans(Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))} style={{ width: '60px', padding: '2px 4px', textAlign: 'center' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>🎭 GM 부여 기타 가산치:</span>
                        <input type="number" value={salvationCustomDeeds} onChange={e => setSalvationCustomDeeds(parseInt(e.target.value) || 0)} style={{ width: '60px', padding: '2px 4px', textAlign: 'center' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid var(--color-gold-dark)', paddingTop: '8px', marginTop: '10px', fontSize: '0.92rem' }}>
                      <strong>최종 구원 판정 기준치 (Salvation Score):</strong>
                      <strong style={{ color: 'var(--color-success)', fontSize: '1.05rem' }}>{totalSalvationScore} 점</strong>
                    </div>
                  </div>
                </div>

                {/* Roller & Outcome */}
                <div style={{ border: '1.2px solid rgba(201,168,76,0.3)', padding: '14px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1.5px solid var(--color-gold-light)', paddingBottom: '4px' }}>
                      🎲 운명 주사위 굴림 및 영면 판정
                    </h5>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>주사위 수동 입력 (1~20):</span>
                      <input 
                        type="number" 
                        min={1} max={20}
                        placeholder="랜덤"
                        value={salvationManualD20}
                        onChange={e => setSalvationManualD20(e.target.value)}
                        style={{ width: '80px', padding: '4px', textAlign: 'center', fontWeight: 'bold', border: '1.5px solid var(--color-gold-light)', borderRadius: '4px' }}
                      />
                      <button 
                        type="button" 
                        className="btn-medieval btn-medieval-primary" 
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                        onClick={rollSalvation}
                      >
                        ⛪ 영면 판정 굴림
                      </button>
                    </div>

                    {salvationRollResult && (
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid var(--color-success)', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', lineHeight: '1.45' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-success)', borderBottom: '1px dashed var(--color-success)', paddingBottom: '4px', marginBottom: '6px' }}>
                          영혼 판정 결과: {salvationRollResult.outcome}
                        </div>
                        • 구원 판정 기준치: <strong>{salvationRollResult.total}</strong><br />
                        • 운명 주사위 결과: <strong>d20: [ {salvationRollResult.roll} ]</strong><br />
                        • 영면의 안식처: <strong style={{ color: 'var(--color-crimson)', fontSize: '0.92rem' }}>{salvationRollResult.destination}</strong><br />
                        
                        {salvationRollResult.isSaint ? (
                          <div style={{ marginTop: '8px', padding: '6px', backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', borderRadius: '4px', fontWeight: 'bold', color: 'var(--color-gold-dark)', textAlign: 'center' }}>
                            👼 🎉 가문의 기적: 성인(Saint) 추대 성공!<br />
                            (다음 계승자: Table 1-17 성인의 축복 획득!)
                          </div>
                        ) : (
                          <div style={{ marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-grey)' }}>
                            * 성인(Sainthood) 조건: 구원 공적 보너스 15점 이상 확보, 주사위 임계 성공(1), 교단 소속 Standing 판정 패스
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {salvationRollResult && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button 
                        type="button" 
                        className="btn-medieval btn-medieval-primary" 
                        style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                        onClick={applySalvationLegacy}
                      >
                        🌟 영면 및 가문 계승 시트 적용
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </section>
        );
      })()}

    </div>
  );
}
