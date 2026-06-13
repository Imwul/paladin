import React, { useState, useEffect } from 'react';
import ProperNoun from './ProperNoun';
import { chronologyData } from '../data/chronology';
import { BookOpen, Edit3, Trash2, Save, Calendar, Shield, Heart, Award, AlertTriangle, Users, Compass, Eye, EyeOff, Search } from 'lucide-react';

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
  736: "아를(Arles) 해방 포위 공성전: 이슬람 무어인(Moors) 세력과 손을 잡은 루시옹의 제라르(Gerard) 공작의 반역 세력을 격퇴하고, 사라센인들의 손에 떨어진 아를(Arles) 시를 구출해내기 위한 포위전 및 돌격전에 참전했습니다.",
  737: "아비뇽(Avignon) 공성전 및 반역 징벌전: 무어인들과 결탁해 프랑크 왕국을 배신한 서고트(Visigoth) 귀족들을 처벌하기 위해 아비뇽(Avignon) 성벽을 공성 병기로 부수고 돌입하였으며, 성내 of 모든 반역 이교도들을 학살하고 도시를 초토화시켰습니다.",
  738: "부르고뉴(Burgundy) 무어 평정 및 보르들레(Bordelais) 습격전: 로렌(Lorraine) 가문을 지원하여 부르고뉴 지방 깊숙이 침입한 무어인 군세를 소탕하거나, 오랜 가문 복수의 화신인 보르들레(Bordelais) 세력의 거점을 소탕하는 야간 습격전에 나섰습니다.",
  739: "셉티마니아(Septimania) 사라센 축출전: 단신왕 피핀(Pepin the Short) 및 롬바르디아 왕 리우트프란트(Liutprand)의 동맹군에 종군하여, 무어인(Moors)들의 남부 요새들을 포위 공성하고 협력자들의 영지를 몰수하는 전투에서 큰 무공을 세워 전리품을 배분받았습니다.",
  740: "로슈브룬(Rochebrune) 성곽 수호전과 덴마크 왕 정벌: 덴마크(Denmark)의 침략군에 맞서 나이모(Naimon) 대공의 사촌인 파스루즈(Passerose)가 농성하던 로슈브룬(Rochebrune) 성을 성공적으로 방어 및 탈환했습니다. 이후 조부님(알베르 경)께서는 덴마크 본토까지 전격 돌입하여 덴마크 왕을 전사시키고 왕위를 찬탈한 영웅적 쾌거를 기록했습니다. 귀로에는 로바스트르(Robastre) 경이 이교도 거인 모리에(Morhier)를 결투 끝에 참수하며 거인들의 타워를 함락시켰습니다.",
  741: "궁재 카롤루스 마르텔(Charles Martel) 서거 및 안덴 장례식: 30여 년간 왕국을 지배한 공의 안덴(Andenne) 대성당 장례식에 참석하여 슬픔을 나누고, 유산을 분할받은 두 아들 카를로만(Carloman)과 피핀(Pepin)에 반기를 든 그리포(Grifo) 왕자의 반란군을 격퇴해 기사를 생포했습니다.",
  742: "쾰른 백작 두온 드 라 로슈(Doon de La Roche)의 성대한 왕실 혼례: 국왕 피핀(Pepin)의 아름다운 누이인 올리브(Olive) 공주와 충신 두온(Doon) 백작의 쾰른(Cologne) 대성당 결혼식에 공식 하객으로 참석하여 연회를 즐겼습니다.",
  743: "레겐스부르크(Regensburg) 대결전 및 삼면 평정 원정: 바이에른(Bavaria)을 영구 병합하기 위해 도나우 강변의 레겐스부르크(Regensburg)에서 오딜로(Odilo) 공작 군대를 격파하고, 아키텐의 반란군 및 북방 작센(Saxony) 이교도 국경지대를 불태우는 징벌 원정에 나섰습니다.",
  744: "조부 알베르 경의 최후 원정과 은퇴: 왕실에 잠입한 아키텐 공작 후놀트(Hunald)의 간첩들을 적발해 참수하고, 왕국 국경을 침범한 작센인(Saxons)들을 토벌하여 영예로운 무공 훈장을 수여받으며 평생의 기사 현역을 매듭지었습니다.",
  745: "돈 드 라 로슈(Doon de la Roche)의 결혼 & 아키텐 공국 와이페르 승계: 돈 경이 토밀의 딸 오드구르와 결혼하여 아들 말랭그를 낳았고, 아키텐의 후놀트 공작이 포로로 잡혀 수도원으로 보내지며 아들 와이페르가 공작위에 즉위했습니다. 이와 동시에 부친 제라르(Gerard) 경이 조부 알베르 경으로부터 기사직을 승계하며 혼례를 성취하셨습니다.",
  746: "당신(플레이어 캐릭터)의 탄생 및 알레마니아 피의 의무: 가문의 미래이자 위대한 기사가 될 당신(플레이어)이 탄생했습니다. [역사] 궁재 카를로만(Carloman)의 명에 따라 알레마니아(Alemannia) 반란 귀족들을 처단하는 냉혹한 작전에 종군하여 반역자들을 엄벌했습니다.",
  747: "롬바르디아 및 로마(Rome) 순례 동행: 세속의 명예를 내려놓고 롬바르디아(Lombardy)를 거쳐 몬테카시노(Monte Cassino) 수도원으로 귀의하려는 카를로만(Carloman) 공을 호위하며 성지 로마에 당도하여 엄숙한 면죄 성사를 받았습니다.",
  748: "무훈시 [라울 드 캉브레(Raoul de Cambrai)]의 속죄 순례 및 그리포 반란: 베르니에(Bernier)와 베아트릭스(Beatrix) 부부가 속죄 순례 도중 무어인의 기습을 받아 포로로 감금되는 시련을 겪었습니다. [역사] 왕국의 반역자 그리포(Grifo) 왕자가 바이에른(Bavaria)으로 탈출하였으며 타실로 3세(Tassilo III)가 바이에른 공작으로 취임했습니다.",
  749: "바이에른(Bavaria) 그리포 추격전: 바이에른으로 패주하여 아키텐 공작 바이에르(Waifer) 및 롬바르디아 국왕 아이스툴프(Aistulf)와 연대하려는 역도 그리포(Grifo) 왕자의 잔당을 토벌하기 위해 험난한 군사 작전에 종군했습니다.",
  750: "작센 대전투와 이교도 추장 저스타몽 격퇴: 뫼즈 강과 국경지대를 위협하며 작센의 이교 추장 저스타몽(Justamont)이 이끄는 이교도 군단에 맞서 피핀(Pepin) 국왕의 선봉장으로 대평원 벌판에서 뼈를 깎는 혈투를 벌여 이교도를 축출했습니다.",
  751: "역사적인 피핀 3세(Pepin III) 대관식 경비: 메로빙거 왕조의 무기력한 마지막 국왕 힐데리히 3세(Childeric III)의 폐위식과 피핀 3세(Pepin the Short) 국왕의 대관식 경비를 성대히 담당했습니다.",
  752: "무어 왕실 망명기 [마이네(Mainet)] 및 피핀 2세 공습: 독살 음모를 피해 톨레도(Toledo)로 피신한 젊은 샤를마뉴(마이네) 왕자가 갈라프레(Galafre)의 용병으로 뛰며 활약하고 갈리엔나(Galienne) 공주와의 숭고한 사랑을 얻었습니다. [역사] 남부 국경에 사라센 침공이 발생하고 샤를마뉴의 친동생 카를로만 2세(Carloman II)가 출생했습니다.",
  753: "비부르크(Wiburg) 산 대결전과 그리포 최후: 작센(Saxony)인들의 이교도 반역군에 대항해 피핀(Pepin) 국왕과 함께 친정하여 험준한 비부르크(Wiburg) 산맥에서 격렬한 산악전의 전초를 전개했습니다. (이 전투에서 힐데가르(Hildegar) 대주교가 전사하고, 도주하던 반역자 그리포 왕자가 사로잡혀 감옥에서 사망함)",
  754: "나르본(Narbonne) 탈환 공성전 및 알프스 돌파: 아이메리 드 나르본(Aymeri de Narbonne) 경을 도와 셉티마니아의 요충지 나르본(Narbonne) 시를 사라센인들의 억압으로부터 완전히 구출하기 위해 피비린내 나는 참호전과 성벽 격돌을 치렀습니다.",
  755: "무훈시 [리옹 드 부르주(Lion de Bourges)] 및 [오르송 드 보베(Orson de Beauvais)] 노래: 리옹(Lion) 경이 잃어버린 부모를 찾아 이탈리아 몬테로세(Monterose) 성을 공성했으며, 늙은 백작 오르송(Orson)이 예루살렘의 감옥에서 충직한 아들 밀로(Milo)의 결사 구출 작전으로 마침내 사법적 정의를 지켰습니다.",
  756: "롬바르디아 파비아(Pavia) 요새 대공성전: 교황령을 거듭 침범하는 롬바르디아 왕 아이스툴프(Aistulf)의 콧대를 꺾기 위해 파비아(Pavia) 성벽 아래에서 치열한 격전을 펼치며 롬바르디아의 항복을 받아내고 교황청 기증령(Donation of Pepin)의 토대를 닦았습니다.",
  757: "덴마크(Denmark) 수륙 양면 징벌 원정: 쾰른 백작 두온(Doon)과 피핀(Pepin) 국왕의 친정에 종군하여 북방의 호전적인 덴마크 바이킹 함대들을 격파하고 덴마크 왕으로부터 왕자 오지에(Ogier the Dane)를 인질로 인도받았습니다.",
  758: "작센(Saxony) 무자비한 보복 초토화 작전: 공약한 연 300필 군마 조공을 거부하고 무장 봉기한 작센 영토 깊숙이 침투하여 파괴와 거부 불허의 강제 기독교 개종을 동반한 대토벌전을 완수했습니다.",
  759: "무훈시 [로렌 사람들(Les Lorrains)] 복수극 및 셉티마니아 완전 수복: 멧돼지 사냥 중 가문 원수에게 암살당한 베고(Bego) 백작의 복수극으로 프랑크 영내가 피로 물들었습니다. [역사] 피핀(Pepin) 국왕이 마침내 사라센 무어인(Moors)들을 한 명도 남김없이 몰아내어 남방 셉티마니아(Septimania)를 완전히 탈환했습니다.",
  760: "아키텐(Aquitaine) 대원정 개막 및 리무쟁(Limousin) 공성: 아키텐 공작 와이페르(Waifer)의 독립 시도를 분쇄하기 위해 샤를마뉴 왕자 및 피핀 국왕의 선봉으로 아키텐 영내 리무쟁(Limousin) 성을 포위 공성하여 함락시켰습니다. 쾰른의 란드리(Landri) 경을 모시고 파리로 귀국하는 길을 보좌했습니다.",
  761: "부르주(Bourges) 성채 포위 공략: 아키텐 정벌의 노른자위 거점인 부르주(Bourges)와 리모주(Limoges) 시를 완전히 장악하기 위해 기사단의 사다리 돌격을 감행해 적의 철옹성 방어벽을 깨부수고 승리했습니다.",
  762: "아키텐(Aquitaine) 약탈 전초전 및 샤를마뉴 궁정: 아키텐의 잔당들을 압박하기 위해 국경지대 아르장통(Argenton)에 요새를 건설하고, 어린 롤랑(밀로의 아들)의 대담한 당돌함을 왕실 연회에서 기쁨으로 나눴습니다.",
  763: "쾰른 라 로슈(La Roche) 성곽 결사 사수: 배반자 토밀(Tomile)과 말랭그(Malingre)가 이끄는 대반란군의 삼중 포위망 속에 갇혀, 본대 지원군이 도착하기 전까지 밤낮으로 성곽에서 저항하며 요새를 지켰습니다.",
  764: "라 로슈(La Roche) 탈환 공성전 및 툴루즈 함락: 오베리(Auberi) 주교의 복수군에 참전해 라 로슈 성을 맹렬히 격파해 탈환하고 쾰른(Cologne)을 수복하였으며, 아키텐 와이페르 공작의 수도 툴루즈(Toulouse)를 최종 점령했습니다.",
  765: "오트페이유(Hautefeuille) 포위 공성전 및 작센 족장 브로히막스 격파: 쾰른의 평화를 위협하는 작센 군대를 요격하기 위해 오트페이유 공성전에서 목숨을 건 격전을 벌였으며, 국왕 피핀을 납치하려는 작센의 악랄한 족장 브로히막스(Brohimax) 세력을 참수 토벌했습니다.",
  766: "몽펠리에(Montpellier) 및 에그르몽(Aigremont) 최후 대공성전: 부친 제라르 경의 영광스러운 현역 마지막 해로, 후계자 샤를마뉴 왕자 및 위비앙(Vivien)의 프랑크 성전 연합군에 합류해 몽펠리에와 이교도의 요새 에그르몽 성벽을 격파하여 최후의 기사도 불꽃을 피워냈습니다.",
  767: "평화적인 기성직 과도기: 국왕 피핀의 병환이 위독해지자 제국 영토가 잠시 정비되며 가문 영지에 안정과 수확의 평화가 지속되었습니다."
};

const medievalKeyMap = {
  chaste: "정숙(Chaste)", lustful: "음탕(Lustful)",
  energetic: "열정(Energetic)", lazy: "나태(Lazy)",
  forgiving: "관용(Forgiving)", vengeful: "보복(Vengeful)",
  generous: "관대(Generous)", selfish: "이기(Selfish)",
  honest: "정직(Honest)", deceitful: "기만(Deceitful)",
  just: "정의(Just)", arbitrary: "독단(Arbitrary)",
  merciful: "자비(Merciful)", cruel: "잔혹(Cruel)",
  modest: "겸손(Modest)", proud: "오만(Proud)",
  pious: "신앙(Pious)", worldly: "세속(Worldly)",
  prudent: "신중(Prudent)", reckless: "무모(Reckless)",
  temperate: "절제(Temperate)", indulgent: "방종(Indulgent)",
  trusting: "신뢰(Trusting)", suspicious: "의심(Suspicious)",
  valorous: "용맹(Valorous)", cowardly: "겁쟁이(Cowardly)",

  loyaltyliege: "주군 충성(Loyalty [Liege])",
  lovefamily: "가족 사랑(Love [Family])",
  hospitality: "손님 환대(Hospitality)",
  honor: "기사 명예(Honor)",
  hatesaracens: "사라센 증오(Hate [Saracens])",
  hatesaxons: "작센 증오(Hate [Saxons])",
  hatedanes: "덴마크 증오(Hate [Danes])",
  lovegod: "주님 사랑(Love [God])",
  amor: "연인 사랑(Amor)",

  charlemagne: "국왕 명망(Standing [Charlemagne])",
  liegelord: "영주 명망(Standing [Lord])",
  family: "가문 명망(Standing [Family])",
  retinue: "가신단 명망(Standing [Retinue])",
  church: "교회 명망(Standing [Church])",
  commoners: "평민 명망(Standing [Commoners])",

  siz: "체구(SIZ)", dex: "민첩(DEX)", str: "근력(STR)", con: "건강(CON)", app: "외모(APP)",

  awareness: "경계", chirurgery: "의술", faerieLore: "요정 지식", firstAid: "응급 치료", folkLore: "민간 전설",
  horsemanship: "마술(Horsemanship)", hunting: "수렵", industry: "성실", recognize: "가문 식별", religion: "종교", stewardship: "영지 관리", swimming: "수영",
  courtesy: "공정 예법", dancing: "궁정 무도", eloquence: "웅변", falconry: "매사냥", gaming: "게임", heraldry: "문장학", intrigue: "궁정 음모", playInstruments: "악기 연주", readingWriting: "독서/독필", romance: "연애 교양", singing: "노래",
  battle: "전투 전술", siege: "공성 전술",
  axe: "도끼검술", bludgeon: "둔기무술", dagger: "단검술", spear: "창술", sword: "검술", unarmed: "맨손 격투",
  lance: "마상창술(Lance)",
  bow: "활쏘기", crossbow: "쇠뇌 사격", thrownWeapon: "투척 무기"
};

export default function ChronologyJournal({ character, setCharacter }) {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'lineage'
  const [activeEra, setActiveEra] = useState('player'); // 'grandfather' | 'father' | 'player'
  const [editingYear, setEditingYear] = useState(null);
  const [journalInput, setJournalInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRawLogs, setShowRawLogs] = useState({}); // mapping: year -> bool

  const campaignYear = parseInt(character.personal?.campaignYear) || 768;
  const ancestorRollLog = character?.family?.ancestorRollLog || [];

  const patronSaint =
    character?.family?.patronSaint ||
    character?.patronSaint ||
    character?.familySaint ||
    "기록 없음";

  const patronSaintRoll =
    character?.family?.patronSaintRoll ??
    character?.patronSaintRoll ??
    null;

  // Auto-select era based on current campaign year or default
  useEffect(() => {
    if (activeEra === 'player') {
      // Do not override if already in player tab
      return;
    }
  }, [campaignYear]);

  // Save manual journal entry
  const saveJournalEntry = (year) => {
    if (!journalInput.trim()) return;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.journal) updated.journal = {};
      
      const fullText = prev.journal?.[year]?.text || '';
      const winterLogIndex = fullText.search(/\[\d{3,4}년 겨울 정산 일지\]/);
      let winterLogPart = '';
      if (winterLogIndex !== -1) {
        winterLogPart = '\n\n' + fullText.substring(winterLogIndex).trim();
      }

      updated.journal[year] = {
        text: journalInput.trim() + winterLogPart,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });

    setEditingYear(null);
    alert(`${year}년 비망록이 안전하게 연대기에 기록되었습니다!`);
  };

  const deleteJournalEntry = (year) => {
    if (!window.confirm(`${year}년의 주관적 기록을 소각하시겠습니까? (겨울 정산 로그는 보존됩니다)`)) return;

    setCharacter(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.journal?.[year]) {
        const fullText = updated.journal[year].text || '';
        const winterLogIndex = fullText.search(/\[\d{3,4}년 겨울 정산 일지\]/);
        if (winterLogIndex !== -1) {
          updated.journal[year].text = fullText.substring(winterLogIndex).trim();
        } else {
          delete updated.journal[year];
        }
      }
      return updated;
    });

    setEditingYear(null);
    setJournalInput('');
  };

  const startEditing = (year, text) => {
    setEditingYear(year);
    setJournalInput(text);
  };

  // Helper to split manual text and winter log
  const splitJournalText = (fullText) => {
    if (!fullText) return { manual: '', winter: '' };
    const winterLogIndex = fullText.search(/\[\d{3,4}년 겨울 정산 일지\]/);
    if (winterLogIndex !== -1) {
      return {
        manual: fullText.substring(0, winterLogIndex).trim(),
        winter: fullText.substring(winterLogIndex).trim()
      };
    }
    return { manual: fullText.trim(), winter: '' };
  };

  // Automated log parser
  const parseWinterLog = (text, year) => {
    if (!text || typeof text !== 'string') return [];
    const lines = text.split('\n');
    const annals = [];
    const cleanLine = (l) => l.replace(/^•\s*/, '').trim();

    lines.forEach(line => {
      const l = cleanLine(line);
      if (!l || (l.startsWith('[') && l.endsWith(']'))) return;

      // Aging
      if (l.includes('노화')) {
        if (l.includes('30세 미만') || l.includes('하락 없음') || l.includes('하락 획득 없음')) {
          annals.push("세월의 영향이 아직 미치지 않아 기사는 지탱하는 육신의 강건함을 그대로 유지함.");
        } else {
          const match = l.match(/->\s*(.+)/);
          const stats = match ? match[1].replace(/,/g, ', ') : '';
          const translatedStats = stats.split(', ').map(s => {
            const trimmed = s.trim();
            const cleanKey = trimmed.toLowerCase().split(' ')[0];
            return medievalKeyMap[cleanKey] || trimmed;
          }).join(', ');
          annals.push(`세월의 흐름으로 기사의 육체 기량 일부가 감퇴함 (${translatedStats}).`);
        }
      }
      // Harvest
      else if (l.includes('영지 수확')) {
        const revMatch = l.match(/£(\d+)/);
        const multMatch = l.match(/배율 x([\d.]+)/);
        const rev = revMatch ? revMatch[1] : '0';
        const mult = multMatch ? parseFloat(multMatch[1]) : 1.0;
        
        let harvestDesc = '';
        if (mult >= 1.5) harvestDesc = "장원에 대풍작의 은혜가 내려 창고가 넘쳤으며,";
        else if (mult >= 1.0) harvestDesc = "고른 수확을 올려 영지가 평온하였으며,";
        else if (mult >= 0.7) harvestDesc = "기후가 좋지 못하여 평년보다 아쉬운 수확을 거두었으나,";
        else harvestDesc = "참혹한 기근이 대지를 덮쳐 수확이 궤멸적이었으나,";
        
        annals.push(`${harvestDesc} 영지에서 £${rev}의 조세를 거두어 가문 금고를 채움.`);
      }
      // Companion survival
      else if (l.includes('동료 생존')) {
        const squireMatch = l.match(/종자 d20 \[\d+\] -> ([^,]+)/);
        const horseMatch = l.match(/군마 d20 \[\d+\] -> (.+)/);
        
        const sStatus = squireMatch ? squireMatch[1].trim() : '';
        const hStatus = horseMatch ? horseMatch[1].trim() : '';
        
        let desc = '';
        if (sStatus.includes('건강함') && hStatus.includes('건강함')) {
          desc = "종자는 신실하게 장비를 점검하였고, 군마들 또한 강건하게 겨울을 넘김.";
        } else {
          const parts = [];
          if (sStatus) {
            if (sStatus.includes('건강함')) parts.push("종자 건강함");
            else parts.push(`종자가 병마(${sStatus})에 처함`);
          }
          if (hStatus) {
            if (hStatus.includes('건강함')) parts.push("군마 무탈함");
            else parts.push(`군마가 상해(${hStatus})를 입음`);
          }
          desc = parts.join(', ') + '.';
        }
        annals.push(desc);
      }
      // Personal event
      else if (l.includes('개인 사건')) {
        const match = l.match(/\[개인 사건\]:\s*d20 \[\d+\]\s*(.+)\s*->\s*결과\s*\[([^\]]+)\]/);
        if (match) {
          const name = match[1].trim();
          const outcome = match[2].trim();
          let outKor = outcome === 'Success' || outcome === 'succ' ? '성공' : outcome === 'Critical' || outcome === 'crit' ? '대성공' : outcome === 'Failure' || outcome === 'fail' ? '실패' : '대실패(Fumble)';
          annals.push(`개인 행적: 기도의 성향 시험인 [${name}]을 거쳐 [${outKor}]을(를) 거둠.`);
        }
      }
      // Training
      else if (l.includes('자유 단련')) {
        if (l.includes('4개 기술 훈련')) {
          annals.push("기량 연마: 겨울 은거 기간 동안 4개 보조/무술 스킬을 훈련함.");
        } else {
          const match = l.match(/능력치 \[([^\]]+)\]/);
          const traitMatch = l.match(/성향 \[([^\]]+)\]/);
          const passionMatch = l.match(/열망 \[([^\]]+)\]/);
          const standingMatch = l.match(/명망 \[([^\]]+)\]/);
          const highMatch = l.match(/상급 기술 \[([^\]]+)\]/);

          let target = '';
          if (match) target = medievalKeyMap[match[1].toLowerCase()] || match[1];
          else if (traitMatch) target = medievalKeyMap[traitMatch[1]] || traitMatch[1];
          else if (passionMatch) target = medievalKeyMap[passionMatch[1]] || passionMatch[1];
          else if (standingMatch) target = medievalKeyMap[standingMatch[1]] || standingMatch[1];
          else if (highMatch) target = medievalKeyMap[highMatch[1]] || highMatch[1];

          if (target) {
            annals.push(`기량 단련: 은거 기간 중 기사의 [${target}]을(를) 연마하여 상승시킴.`);
          }
        }
      }
      // Experience
      else if (l.includes('경험 판정') || l.includes('성장') && (l.includes('기술') || l.includes('열망'))) {
        if (l.includes('체크된 기술/열망이 없습니다') || l.includes('실패')) return;
        const match = l.match(/\[(?:기술|열망)\s+([^\s]+)\s+성장\]/);
        if (match) {
          const key = match[1];
          const label = medievalKeyMap[key] || key;
          annals.push(`경험 도약: 실전 무공의 영감으로 [${label}] 기량이 일신하여 도약함.`);
        }
      }
      // Glory settlement
      else if (l.includes('영예 정산')) {
        const gloryMatch = l.match(/\+(\d+)\s*Glory/);
        const totalMatch = l.match(/누적 영예:\s*(\d+)/);
        if (gloryMatch && totalMatch) {
          annals.push(`겨울 궁정 영예: 황실의 영예 공적으로 단해 +${gloryMatch[1]} Glory를 칭송받음.`);
        }
      }
      // Squire age change
      else if (l.includes('종자 성장') || l.includes('종자 나이')) {
        const match = l.match(/종자\s+(.+?)의 나이가\s+(\d+)세\s*->\s*(\d+)세/);
        if (match) {
          annals.push(`종자 성장: 가신 종자 [${match[1]}]가 성실한 연단 끝에 ${match[3]}세로 성장함.`);
        }
      }
      // Squire independence
      else if (l.includes('종자 독립')) {
        annals.push("종자 독립: 기존 종자가 성인 기사로 사임 자립하고 새 14세 종자를 배치함.");
      }
      // Succession log
      else if (l.includes('[계승]')) {
        annals.push(l.replace('[계승]', '가업 승계:').trim());
      }
    });

    return annals;
  };

  // Compile lineage events from character.family.members
  const getLineageAnnalsForYear = (year) => {
    const annals = [];
    const currentYear = parseInt(year);
    const members = character.family?.members || [];

    members.forEach(m => {
      if (!m) return;
      const lifeYears = typeof m.lifeYears === 'string' ? m.lifeYears : (m.lifeYears ? String(m.lifeYears) : '');
      const parts = lifeYears.split('~');
      const birthYear = parseInt(parts[0]);
      const deathYear = parts[1] ? parseInt(parts[1]) : null;

      const mName = typeof m.name === 'string' ? m.name : '';
      const cleanName = mName.split(' (')[0] || '이름 없음';

      if (birthYear === currentYear) {
        if (m.relation === '자녀') {
          annals.push(`자녀 탄생: 가문에 명예로운 적통 자녀 [${cleanName}]가 출생하여 기쁨을 더함.`);
        } else if (m.relation === '배우자') {
          annals.push(`가문 혼사: 기사가 배우자 [${cleanName}]과 성대한 혼례를 맺고 가연을 세움.`);
        }
      }

      if (deathYear === currentYear) {
        annals.push(`가문 상사: 가문원 [${cleanName}] 서거 (사인: ${m.deathCause || m.note || '선종'}).`);
      }
    });

    // Inheritance in initial year 768
    if (currentYear === 768) {
      const selfMember = members.find(m => m && m.relation === '본인') || { name: '롤랑 경' };
      const selfName = (selfMember.name || '롤랑 경').split(' (')[0] || '롤랑 경';
      annals.push(`가업 상속: 부친 제라르 경의 파비아 원정 전사로 인해 [${selfName}]이 아르덴 가문을 정식 계승함.`);
    }

    // Dynamic Glory thresholds crossed
    const getGlory = (y) => {
      const entry = character.journal?.[y];
      if (!entry || typeof entry.text !== 'string') return null;
      const match = entry.text.match(/누적 영예:\s*(\d+)/);
      return match ? parseInt(match[1]) : null;
    };

    const currentGlory = getGlory(currentYear);
    const prevGlory = getGlory(currentYear - 1);
    if (currentGlory) {
      if (prevGlory) {
        const curTh = Math.floor(currentGlory / 1000);
        const prevTh = Math.floor(prevGlory / 1000);
        if (curTh > prevTh) {
          annals.push(`영예 돌파: 가문의 총 누적 영예가 ${curTh * 1000} Glory의 기적적인 단계를 넘어 장벽을 돌파함.`);
        }
      } else if (currentGlory >= 2000) {
        // Initial transition or missing previous
        annals.push(`영예 돌파: 가문의 누적 영예가 ${Math.floor(currentGlory / 1000) * 1000} Glory를 정식 돌파함.`);
      }
    }

    return annals;
  };

  // Compile full list of annals entries for a year
  const getAnnalsForYear = (year) => {
    const journalEntry = character.journal?.[year];
    const { winter } = splitJournalText(journalEntry?.text || '');
    
    const lineageEvents = getLineageAnnalsForYear(year);
    const parsedLogs = parseWinterLog(winter, year);

    return [...lineageEvents, ...parsedLogs];
  };

  // Era definition configurations
  const eras = {
    grandfather: {
      title: "조부 알베르의 연대 (723 ~ 744 AD)",
      start: 723,
      end: 744
    },
    father: {
      title: "부친 제라르의 연대 (745 ~ 767 AD)",
      start: 745,
      end: 767
    },
    player: {
      title: `기사 ${(character.personal?.name || '롤랑 경').split(' (')[0]}의 연대 (768 AD ~ 현재)`,
      start: 768,
      end: Math.max(768, campaignYear)
    }
  };

  // Render year list based on active era
  const getYearsInEra = () => {
    const era = eras[activeEra];
    const years = [];
    for (let y = era.start; y <= era.end; y++) {
      years.push(y);
    }
    return years;
  };

  // Check search queries
  const filterYearsBySearch = (years) => {
    if (!searchQuery.trim()) return years;
    const q = searchQuery.toLowerCase();

    return years.filter(year => {
      const globalHist = chronologyData.find(item => item.year === year) || ANCESTOR_EVENTS[year] || '';
      const globalStr = typeof globalHist === 'object' && globalHist !== null ? `${globalHist.title || ''} ${globalHist.summary || ''} ${globalHist.details || ''}` : String(globalHist || '');
      
      const journalText = character.journal?.[year]?.text || '';
      const annals = getAnnalsForYear(year).join(' ');

      return (
        year.toString().includes(q) ||
        globalStr.toLowerCase().includes(q) ||
        journalText.toLowerCase().includes(q) ||
        annals.toLowerCase().includes(q)
      );
    });
  };

  const activeYears = filterYearsBySearch(getYearsInEra());

  // Split members into Living and Deceased
  const members = character.family?.members || [];
  const livingMembers = members.filter(m => m.status === '생존');
  const deceasedMembers = members.filter(m => m.status === '사망');

  // Compute family stats
  const totalGlory = character.gear?.gloryTotal || 1200;
  const currentLeaderName = (character.personal?.name || '롤랑 경').split(' (')[0];

  return (
    <div className="cs-page view-animate">
      
      {/* 📜 Elegant Illuminated Parchment Shield Header Card */}
      <section className="cs-section" style={{ border: '2px solid var(--color-gold)' }}>
        <div className="cs-section-inner" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(201, 168, 76, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '56px', height: '56px', border: '2px solid var(--color-gold-dark)', borderRadius: '50%', backgroundColor: 'rgba(43, 65, 112, 0.1)' }}>
              <Shield size={28} style={{ color: 'var(--color-gold-dark)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-royal-blue)', margin: 0 }}>
                {character.family?.name || '아르덴'} 가문 역사 대연대기
              </h2>
              <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-grey)', margin: '2px 0 0 0', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span>🛡️ 가문훈: <strong>"{character.family?.motto || '명예와 신조'}"</strong></span>
                <span>•</span>
                <span>📣 함성: <strong>"{character.family?.battleCry || '몽주아 생드니!'}"</strong></span>
                <span>•</span>
                <span>⛪ 수호 성인: <strong>{patronSaint}</strong>{patronSaintRoll !== null ? ` (🎲 d20: ${patronSaintRoll})` : ''}</span>
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem' }}>
            <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '6px', border: '1px solid var(--color-gold-light)' }}>
              <div style={{ color: 'var(--color-grey)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>가문 누적 영예</div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--color-gold-dark)' }}>{totalGlory.toLocaleString()} Glory</strong>
            </div>
            <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '6px', border: '1px solid var(--color-gold-light)' }}>
              <div style={{ color: 'var(--color-grey)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>현재 작위 수임</div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--color-royal-blue)' }}>{currentLeaderName}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 Primary View Toggle Tabs */}
      <div style={{ display: 'flex', gap: '6px', margin: '4px 0 10px 0' }}>
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`btn-medieval ${activeTab === 'timeline' ? 'btn-medieval-primary' : ''}`}
          style={{ flex: 1, justifyContent: 'center', borderRadius: '6px', padding: '10px' }}
        >
          <BookOpen size={16} /> 가문 역사 연대기 (Chronicle Timeline)
        </button>
        <button 
          onClick={() => setActiveTab('lineage')}
          className={`btn-medieval ${activeTab === 'lineage' ? 'btn-medieval-primary' : ''}`}
          style={{ flex: 1, justifyContent: 'center', borderRadius: '6px', padding: '10px' }}
        >
          <Users size={16} /> 가문 계보 및 영령록 (Lineage & Memorial)
        </button>
      </div>

      {activeTab === 'timeline' ? (
        <>
          {/* 🔍 Search and Epoch Selection */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <button 
                onClick={() => setActiveEra('grandfather')}
                className={`tab-btn btn-medieval ${activeEra === 'grandfather' ? 'active' : ''}`}
                style={{ padding: '6px 12px', borderBottom: '1px solid var(--color-gold)', borderRadius: '4px 4px 0 0' }}
              >
                조부의 연대 (723~744)
              </button>
              <button 
                onClick={() => setActiveEra('father')}
                className={`tab-btn btn-medieval ${activeEra === 'father' ? 'active' : ''}`}
                style={{ padding: '6px 12px', borderBottom: '1px solid var(--color-gold)', borderRadius: '4px 4px 0 0' }}
              >
                부친의 연대 (745~767)
              </button>
              <button 
                onClick={() => setActiveEra('player')}
                className={`tab-btn btn-medieval ${activeEra === 'player' ? 'active' : ''}`}
                style={{ padding: '6px 12px', borderBottom: '1px solid var(--color-gold)', borderRadius: '4px 4px 0 0' }}
              >
                나의 대서사 (768~현재)
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '8px', color: 'var(--color-grey)' }} />
              <input 
                type="text" 
                placeholder="연대기 사건 검색..." 
                className="form-input" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '26px', fontSize: '0.82rem', width: '100%', minHeight: '30px' }}
              />
            </div>
          </div>

          {/* 📜 Clear Year-by-Year Annals Parchment Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(activeEra === 'grandfather' || activeEra === 'father') && ancestorRollLog.length === 0 ? (
              <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '1px dashed var(--color-gold-light)', borderRadius: '8px' }}>
                아직 보존된 조상 연대기가 없습니다. 가계도에서 조상 생성을 완료하면 이곳에 기록됩니다.
              </div>
            ) : activeYears.length === 0 ? (
              <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '1px dashed var(--color-gold-light)', borderRadius: '8px' }}>
                이 연대와 일치하는 기록이 아직 성취되지 않았거나 검색어와 일치하는 편년 기록이 존재하지 않습니다.
              </div>
            ) : (
              activeYears.map(year => {
                const globalHist = chronologyData.find(item => item.year === year);
                const ancestorHist = ANCESTOR_EVENTS[year];
                
                const journalEntry = character.journal?.[year];
                const { manual, winter } = splitJournalText(journalEntry?.text || '');
                const annals = getAnnalsForYear(year);

                const isInteractiveAncestor = (year < 768);
                const isCurrentYear = (year === campaignYear);

                return (
                  <div 
                    key={year} 
                    style={{ 
                      borderBottom: '1px solid var(--color-gold-light)', 
                      padding: '10px 0', 
                      backgroundColor: isCurrentYear ? 'rgba(201, 168, 76, 0.04)' : 'transparent',
                      borderLeft: isCurrentYear ? '3px solid var(--color-gold-dark)' : 'none',
                      paddingLeft: isCurrentYear ? '8px' : '0'
                    }}
                  >
                    {/* Header */}
                    <div style={{ 
                      padding: '2px 0 4px 0', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px dotted rgba(201, 168, 76, 0.25)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontFamily: 'var(--font-heading)', 
                          fontSize: '0.9rem', 
                          fontWeight: 'bold', 
                          color: 'var(--color-ink)',
                          marginRight: '8px'
                        }}>
                          {year} AD
                        </span>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--color-ink-light)' }}>
                          {globalHist ? globalHist.title : isInteractiveAncestor ? (year <= 744 ? "조부 알베르의 연대기" : "부친 제라르의 연대기") : "가문의 안정기"}
                        </strong>
                      </div>
                      {isCurrentYear && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--color-ink-light)' }}>
                          [현재 플레이 연도]
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '6px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      
                      {/* Kingdom History */}
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.74rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                          <Compass size={11} /> 제국 연대기 (Kingdom History)
                        </div>
                        <p style={{ fontStyle: 'italic', paddingLeft: '4px', margin: 0 }}>
                          {globalHist ? globalHist.summary : ancestorHist ? ancestorHist : "제국의 국경이 평화롭게 보존되며 기사들이 한 해의 원정을 준비하였습니다."}
                        </p>
                      </div>

                      {/* House Annals (Parsed Factual Record) */}
                      <div style={{ borderTop: '1px dashed rgba(201, 168, 76, 0.15)', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-ink-light)', fontWeight: 'bold', fontSize: '0.74rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                          <Shield size={11} /> 가문사 편년 (House Annals)
                        </div>
                        
                        {isInteractiveAncestor ? (
                          // Render ancestor log rolls if available
                          ancestorRollLog.some(line => typeof line === 'string' && line.includes(`${year}년`)) ? (
                            <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '0.82rem', color: 'var(--color-ink)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {ancestorRollLog
                                .filter(line => typeof line === 'string' && line.includes(`${year}년`))
                                .map((line, idx) => (
                                  <li key={idx} style={{ listStyleType: 'square' }}>
                                    {line.replace(/^🏰\s*\d+년:\s*\[역사\]\s*/, '').replace(/^🏰\s*\d+년:\s*/, '').replace(/└\s*/, '').trim()}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', fontStyle: 'italic', paddingLeft: '4px', margin: 0 }}>
                              조상 편년 기록이 비어있습니다. 기본 수확과 임무 수주를 거쳤습니다.
                            </p>
                          )
                        ) : (
                          // Render parsed player winter logs + marriages + births + deaths
                          annals.length > 0 ? (
                            <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '0.82rem', color: 'var(--color-ink)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {annals.map((event, idx) => (
                                <li key={idx} style={{ listStyleType: 'square', lineHeight: 1.4 }}>
                                  {event}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', fontStyle: 'italic', paddingLeft: '4px', margin: 0 }}>
                              기록될 만한 특별한 가문 사건이나 겨울 정산 기록이 존재하지 않습니다.
                            </p>
                          )
                        )}
                      </div>

                      {/* Knight's Memoir (Manual Journal Entry) */}
                      {!isInteractiveAncestor && (
                        <div style={{ borderTop: '1px dashed rgba(201, 168, 76, 0.15)', paddingTop: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-grey)', fontWeight: 'bold', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                              <Edit3 size={11} /> 기사의 비망록 (Knight's Memoir)
                            </div>
                            {editingYear !== year && (
                              <button 
                                onClick={() => startEditing(year, manual)}
                                className="btn-medieval" 
                                style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '2px' }}
                              >
                                비망록 작성/수정
                              </button>
                            )}
                          </div>

                          {editingYear === year ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                              <textarea 
                                className="form-input" 
                                style={{ minHeight: '80px', fontSize: '0.82rem', resize: 'vertical', width: '100%' }}
                                value={journalInput}
                                onChange={e => setJournalInput(e.target.value)}
                                placeholder="올해의 전투 무훈, 성스러운 서약, 개인적인 행적 등을 기록하십시오..."
                              />
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setEditingYear(null)} className="btn-medieval" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                                  취소
                                </button>
                                {manual && (
                                  <button onClick={() => deleteJournalEntry(year)} className="btn-medieval" style={{ fontSize: '0.72rem', padding: '3px 8px', color: 'var(--color-danger)' }}>
                                    지우기
                                  </button>
                                )}
                                <button onClick={() => saveJournalEntry(year)} className="btn-medieval btn-medieval-primary" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                                  <Save size={11} /> 기록 보관
                                </button>
                              </div>
                            </div>
                          ) : (
                            manual ? (
                              <p style={{ padding: '6px 10px', background: 'rgba(179,143,67,0.02)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '2px', fontStyle: 'italic', fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--color-ink-light)', whiteSpace: 'pre-wrap', margin: 0 }}>
                                "{manual}"
                              </p>
                            ) : (
                              <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', fontStyle: 'italic', margin: 0, paddingLeft: '4px' }}>
                                "올해는 기록된 기사의 비망록이 없습니다."
                              </p>
                            )
                          )}
                        </div>
                      )}

                      {/* Raw Game Log Reference Toggle */}
                      {!isInteractiveAncestor && winter && (
                        <div style={{ borderTop: '1px solid rgba(201, 168, 76, 0.06)', paddingTop: '4px', display: 'flex', flexDirection: 'column' }}>
                          <button 
                            onClick={() => setShowRawLogs(prev => ({ ...prev, [year]: !prev[year] }))}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--color-grey)', 
                              fontSize: '0.68rem', 
                              cursor: 'pointer',
                              padding: '1px 0',
                              width: 'fit-content'
                            }}
                          >
                            {showRawLogs[year] ? (
                              <>
                                <EyeOff size={10} /> 정산 게임 로그 접기
                              </>
                            ) : (
                              <>
                                <Eye size={10} /> 정산 게임 로그 원문 보기 (규칙 참조용)
                              </>
                            )}
                          </button>
                          
                          {showRawLogs[year] && (
                            <pre style={{ 
                              marginTop: '4px', 
                              padding: '6px 10px', 
                              backgroundColor: 'rgba(0,0,0,0.02)', 
                              border: '1px solid #ddd', 
                              borderRadius: '2px', 
                              fontSize: '0.72rem', 
                              fontFamily: 'monospace', 
                              color: '#666',
                              whiteSpace: 'pre-wrap',
                              margin: 0
                            }}>
                              {winter}
                            </pre>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* 👥 Lineage Register & Memorial Hall View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 가문의 현역 단원 (Living Lineage) */}
          <section className="cs-section">
            <div className="sheet-ribbon" style={{ background: 'var(--color-royal-blue)' }}>
              <h3>👥 가문의 생존 기사단 (Living Lineage)</h3>
            </div>
            <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {livingMembers.length === 0 ? (
                <p style={{ color: 'var(--color-grey)', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>생존해 있는 가문원이 존재하지 않습니다.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                  {livingMembers.map(m => {
                    const birthYear = parseInt(m.lifeYears?.split('~')?.[0]) || 768;
                    const age = Math.max(0, campaignYear - birthYear);

                    return (
                      <div 
                        key={m.id} 
                        style={{ 
                          border: '1px solid var(--color-gold-light)', 
                          borderRadius: '8px', 
                          padding: '12px', 
                          backgroundColor: m.relation === '본인' ? 'rgba(43,65,112,0.03)' : 'rgba(255,255,255,0.7)',
                          borderLeft: m.relation === '본인' ? '3px solid var(--color-royal-blue)' : '3px solid var(--color-gold)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--color-ink)' }}>{m.name}</strong>
                          <span style={{ fontSize: '0.74rem', padding: '2px 6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', fontWeight: 600 }}>
                            {m.relation}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-grey)', display: 'flex', gap: '10px', marginBottom: '6px' }}>
                          <span>생년: {birthYear} AD</span>
                          <span>•</span>
                          <span>현재 나이: {age}세</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                          {m.note || "가문을 수호하는 기사단의 소중한 혈육입니다."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 영령들의 묘비명 전당 (Memorial Hall) */}
          <section className="cs-section">
            <div className="sheet-ribbon" style={{ background: 'var(--color-danger)' }}>
              <h3>🕯️ 영령들의 명예 묘비록 (Memorial Hall)</h3>
            </div>
            <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deceasedMembers.length === 0 ? (
                <p style={{ color: 'var(--color-grey)', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>아직 서거하신 선조가 기록에 없습니다.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {deceasedMembers.map(m => (
                    <div 
                      key={m.id} 
                      style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '6px', 
                        padding: '12px', 
                        backgroundColor: '#f9f9f9',
                        borderLeft: '3px solid #8b2020',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: '1 1 200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--color-ink)' }}>{m.name}</strong>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontWeight: 600 }}>({m.relation})</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 'bold', marginBottom: '6px' }}>
                          💀 생애: {m.lifeYears} AD (사인: {m.deathCause || '서거'})
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                          {m.note || "가문을 수호하고 역사를 밝혀준 고결한 인물입니다."}
                        </p>
                      </div>
                      
                      <div style={{ alignSelf: 'center', padding: '4px 10px', background: 'rgba(139, 32, 32, 0.05)', borderRadius: '4px', border: '1px solid rgba(139, 32, 32, 0.15)', fontSize: '0.78rem', color: '#8b2020', fontWeight: 'bold' }}>
                        영면
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
