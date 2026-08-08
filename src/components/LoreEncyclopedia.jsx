import { useState } from 'react';
import { greatFamilies, soloScenarios, bestiary, bibliography, npcs, paladins, cultures, frankishSociety, franklandTerritories, minorNpcs } from '../data/lore';
import { Shield, Book, Compass, Search, ChevronRight, HelpCircle, Award, Globe, Skull, Sparkles, Shuffle, RefreshCw, Scale, Crown, Home, Sword, Library } from 'lucide-react';
import { frankishMalePrefixes, frankishMaleSuffixes, frankishFemalePrefixes, frankishFemaleSuffixes, nameEquivalents } from '../data/names';

import europe768Map from '../assets/europe_768.jpg';
import ardennesMap from '../assets/ardennes.jpg';
import europe814Map from '../assets/europe_814.jpg';
import aachenMap from '../assets/aachen.jpg';

export default function LoreEncyclopedia() {
  const [activeSubTab, setActiveSubTab] = useState('families');
  const [selectedFamily, setSelectedFamily] = useState(greatFamilies[0]);
  const [selectedScenario, setSelectedScenario] = useState(soloScenarios[0]);
  const [selectedMonster, setSelectedMonster] = useState(bestiary[0]);
  const [selectedNPC, setSelectedNPC] = useState(npcs ? npcs[0] : null);
  const [selectedCulture, setSelectedCulture] = useState(cultures ? cultures[0] : null);
  const [npcViewMode, setNpcViewMode] = useState('major'); // 'major', 'paladins'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSocietyTab, setSelectedSocietyTab] = useState('crown');
  const [showGmRef, setShowGmRef] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState(franklandTerritories ? franklandTerritories[0] : null);
  const [selectedGeoTab, setSelectedGeoTab] = useState('overview');
  const [selectedMinorNPC, setSelectedMinorNPC] = useState(null);
  const [cultureLangMode, setCultureLangMode] = useState('both');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  // Name Generator State
  const [genGender, setGenGender] = useState('male');
  const [generatedName, setGeneratedName] = useState({ en: 'Adalbert', ko: '아달베르트' });

  const generateRandomName = (gender = genGender) => {
    const prefixes = gender === 'male' ? frankishMalePrefixes : frankishFemalePrefixes;
    const suffixes = gender === 'male' ? frankishMaleSuffixes : frankishFemaleSuffixes;
    const randPre = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randSuf = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const cleanPre = randPre.split('/')[0].replace('(', '').replace(')', '').replace('-', '');
    const cleanSuf = randSuf.split('/')[0].replace('(', '').replace(')', '').replace('-', '');
    
    const fullNameEN = cleanPre + cleanSuf;
    
    const preKoMap = {
      Adal: '아달', Amal: '아말', Agil: '아길', Ag: '아그', Ald: '알드', Alb: '알브', And: '안드', Ans: '안스',
      Angil: '앙질', Arbo: '아르보', Arn: '아르노', Aud: '오드', Aut: '오', Bald: '발드', Baud: '보',
      Bern: '베른', Bert: '베르', Brun: '브륀', Char: '샤를', Gar: '가르', Chil: '실', Chlo: '클로',
      Dag: '다그', Ever: '에베르', Erle: '에를레', Megin: '메진', Fara: '파라', Floris: '플로리스',
      Fred: '프레드', Frid: '프리드', Foul: '풀', Fulc: '풀크', Geno: '제노', Ger: '제르', Geld: '겔드',
      Gond: '공', Gund: '군드', Grim: '그림', Guerim: '게랭', Had: '하드', Hard: '하르드', Hegi: '헤지',
      Her: '헤르', Heil: '하일', Heim: '하임', Hugo: '위고', Huno: '위노', Ingo: '인고', Irmin: '이르민',
      Isem: '이젬', Lam: '람', Land: '랑드', Lud: '뤼드', Madal: '마달', Magin: '마쟁', Marc: '마르크',
      Mero: '메로', Nort: '노르', Raban: '라반', Rade: '라드', Ragno: '라뇨', Ragin: '라쟁', Rein: '랭',
      Rich: '리슈', Rudo: '뤼도', Sig: '지그', Swind: '스윈드', Theod: '테오드', Thiad: '티아드',
      Thurin: '튀랭', Walde: '발데', Warin: '와랭', Wido: '위도', Wulf: '울프',
      Ad: '아드', Bas: '바지', Chrot: '크로', Dhuo: '듀오', Flor: '플로르', Fleur: '플뢰르', Folch: '폴슈',
      Gise: '지젤', Hersi: '에르지', Hilde: '힐데', Inge: '인게', Mat: '마트', Mar: '마르', Nant: '낭', Rol: '롤', Theo: '테오'
    };
    
    const sufKoMap = {
      atus: '아투스', bert: '베르', bard: '바르', bold: '보', obald: '보', baud: '보', bern: '베르',
      brand: '브랑', char: '샤르', gar: '가르', ger: '지에', cor: '코르', drad: '드라', don: '동',
      dio: '디오', duin: '댕', elin: '랭', eric: '리', oric: '리', fried: '프리드', fred: '프레드',
      froid: '프루아', gand: '강', gang: '강', gaud: '고', gast: '가스트', grim: '그림', hard: '하르드',
      hart: '하르트', helm: '엘름', er: '에', hair: '에르', ing: '앵', land: '랑', lant: '랑',
      mar: '마르', mer: '메르', man: '망', mond: '몽', nier: '니에', olph: '올프', gulph: '울프',
      omer: '오메르', imer: '이메르', rad: '라드', ric: '릭', vech: '베슈', veus: '보', wald: '발트',
      win: '뱅', ouin: '댕', wulf: '울프',
      burge: '뷔르주', berga: '베르가', delis: '델리스', da: '다', tha: '타', dith: '디트', rada: '라다',
      trada: '트라다', elma: '엘마', fride: '프리드', pride: '프리드', gise: '지즈', gisela: '지젤라',
      gonde: '공드', gonda: '공다', haide: '아이드', hilde: '힐드', ilia: '일리아', hilda: '힐다',
      inga: '인가', landa: '린다', lina: '리나', lindis: '린디스', lena: '레나', trudis: '트뤼디스', truda: '트뤼다'
    };
    
    const koPre = preKoMap[cleanPre] || cleanPre;
    const koSuf = sufKoMap[cleanSuf] || cleanSuf;
    
    setGeneratedName({
      en: fullNameEN.charAt(0).toUpperCase() + fullNameEN.slice(1).toLowerCase(),
      ko: koPre + koSuf
    });
  };

  const filteredFamilies = greatFamilies.filter(f =>
    f.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.backgroundKO.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScenarios = soloScenarios.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rules.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTerritories = franklandTerritories.filter(t => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    if (t.nameKO.toLowerCase().includes(query) || 
        t.nameEN.toLowerCase().includes(query) ||
        t.descKO.toLowerCase().includes(query) ||
        t.descEN.toLowerCase().includes(query) ||
        t.rulerKO.toLowerCase().includes(query) ||
        t.rulerEN.toLowerCase().includes(query) ||
        t.passionKO.toLowerCase().includes(query)) {
      return true;
    }
    
    if (t.subdivisions && t.subdivisions.some(sub => sub.nameKO.toLowerCase().includes(query) || sub.descKO.toLowerCase().includes(query))) {
      return true;
    }
    
    if (t.towns && t.towns.some(town => town.nameKO.toLowerCase().includes(query) || town.nameEN.toLowerCase().includes(query) || town.descKO.toLowerCase().includes(query))) {
      return true;
    }
    
    if (t.abbeys && t.abbeys.some(abbey => abbey.nameKO.toLowerCase().includes(query) || abbey.nameEN.toLowerCase().includes(query) || abbey.descKO.toLowerCase().includes(query))) {
      return true;
    }
    
    if (t.enchanted && t.enchanted.some(site => site.nameKO.toLowerCase().includes(query) || site.nameEN.toLowerCase().includes(query) || site.descKO.toLowerCase().includes(query))) {
      return true;
    }
    
    return false;
  });

  const filteredBestiary = bestiary.filter(b =>
    b.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.loreKO.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEquivalents = nameEquivalents.filter(e =>
    e.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.equivalents.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMajorEpics = bibliography.majorEpics.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMinorEpics = bibliography.minorEpics.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudies = bibliography.studies.filter(e =>
    (e.author ? e.author.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNPCs = (npcs || []).filter(n =>
    n.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.titleKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.biographyKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.significantItems.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPaladins = (paladins || []).filter(p =>
    p.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMinorNPCs = (minorNpcs || []).filter(n =>
    n.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.biographyKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.biographyEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.subcategory ? n.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );

  const categoryMinorNPCs = filteredMinorNPCs.filter(n => {
    if (npcViewMode === 'family_court') return n.category === 'Imperial Family & Court';
    if (npcViewMode === 'enemies') return n.category === 'Enemies Within';
    if (npcViewMode === 'foreigners') return n.category === 'Foreigners';
    return false;
  });

  const activeMinorNPC = selectedMinorNPC || categoryMinorNPCs[0] || null;

  const filteredCultures = (cultures || []).filter(c =>
    c.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.characterKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.appearanceKO.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBilingualSection = (title, koVal, enVal, icon = "", customStyle = {}) => {
    return (
      <div style={{ border: '1px solid var(--color-grey-light)', padding: '12px', borderRadius: '4px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', ...customStyle }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{icon}</span> {title}
        </div>
        
        {(cultureLangMode === 'KO' || cultureLangMode === 'both') && koVal && (
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {koVal}
          </p>
        )}
        
        {cultureLangMode === 'both' && koVal && enVal && <div style={{ height: '8px' }} />}
        
        {(cultureLangMode === 'EN' || cultureLangMode === 'both') && enVal && (
          <p lang="en" style={{
            fontSize: '0.78rem', 
            lineHeight: '1.5', 
            color: 'var(--color-ink-light)', 
            fontFamily: 'var(--font-korean-serif)', 
            fontStyle: 'italic', 
            margin: 0, 
            borderLeft: cultureLangMode === 'both' ? '2.5px solid var(--color-gold-light)' : 'none',
            paddingLeft: cultureLangMode === 'both' ? '8px' : 0,
            whiteSpace: 'pre-wrap'
          }}>
            {enVal}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="cs-page view-animate">
      <h2 className="cs-page-title">
        <Library size={20} style={{ color: 'var(--color-gold-dark)' }} />
        제국의 백과사전
      </h2>
      {/* Tutorial Header Banner */}
      <div className="tutorial-banner">
        <div>
          <p style={{ margin: 0 }}>
            샤를마뉴 대제 시대의 8대 명가 및 제국 지리(Gazetteer), 전설의 괴수 및 야수(Bestiary)와 솔로 시나리오 공식을 열람하세요.
          </p>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px', marginBottom: '16px' }}>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'families' ? 'bold' : 'normal', 
            color: activeSubTab === 'families' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('families'); setSearchQuery(''); }}
        >
          <Shield size={16} /> 8대 위대한 가문
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'npcs' ? 'bold' : 'normal', 
            color: activeSubTab === 'npcs' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('npcs'); setSearchQuery(''); setSelectedNPC(npcs[0]); }}
        >
          <Award size={16} /> 주요 인물 &amp; 영웅 (Ch.16)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'cultures' ? 'bold' : 'normal', 
            color: activeSubTab === 'cultures' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('cultures'); setSearchQuery(''); setSelectedCulture(cultures[0]); }}
        >
          <Globe size={16} /> 외래 문화 &amp; 세력 (Ch.17)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'scenarios' ? 'bold' : 'normal', 
            color: activeSubTab === 'scenarios' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('scenarios'); setSearchQuery(''); }}
        >
          <Compass size={16} /> 솔로 시나리오 지침서
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'gazetteer' ? 'bold' : 'normal', 
            color: activeSubTab === 'gazetteer' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('gazetteer'); setSearchQuery(''); }}
        >
          <Globe size={16} /> 제국 지리 사전 (Gazetteer)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'bestiary' ? 'bold' : 'normal', 
            color: activeSubTab === 'bestiary' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('bestiary'); setSearchQuery(''); }}
        >
          <Skull size={16} /> 제국 괴수 및 야수 사전 (Bestiary)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'feudal' ? 'bold' : 'normal', 
            color: activeSubTab === 'feudal' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('feudal'); setSearchQuery(''); }}
        >
          <Book size={16} /> 제국 사법 &amp; 역사 해설
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'names' ? 'bold' : 'normal', 
            color: activeSubTab === 'names' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('names'); setSearchQuery(''); generateRandomName(genGender); }}
        >
          <Sparkles size={16} /> 프랑크 이름 생성기 (Appendix I)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: activeSubTab === 'bibliography' ? 'bold' : 'normal', 
            color: activeSubTab === 'bibliography' ? 'var(--color-crimson)' : 'var(--color-ink-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => { setActiveSubTab('bibliography'); setSearchQuery(''); }}
        >
          <Book size={16} /> 권장 도서 &amp; 서사시 (Appendix II)
        </button>
      </div>

      {/* Search Input Bar (only shown for filtering lists) */}
      {activeSubTab !== 'feudal' && (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-grey)' }} />
          <input 
            type="text" 
            placeholder={
              activeSubTab === 'families' ? "가문 이름 또는 키워드로 검색..." :
              activeSubTab === 'scenarios' ? "시나리오 이름 또는 규칙 검색..." :
              activeSubTab === 'gazetteer' ? "강역, 도시, 성채, 수도원 또는 신비 유적 검색..." :
              activeSubTab === 'bestiary' ? "괴수/야수 이름 또는 카테고리 검색..." :
              activeSubTab === 'npcs' ? "인물 이름, 작위 또는 성물 검색..." :
              activeSubTab === 'cultures' ? "세력 이름, 기질 또는 연표 검색..." :
              activeSubTab === 'names' ? "현대 이름 또는 프랑크어 동의어 검색..." :
              "도서명, 저자, 또는 설명 검색..."
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px 8px 36px', 
              borderRadius: '4px', 
              border: '1px solid var(--color-gold-light)',
              background: '#fff',
              fontSize: '0.9rem'
            }}
          />
        </div>
      )}

      {/* RENDER TAB CONTENTS */}

      {/* 1. FAMILIES TAB */}
      {activeSubTab === 'families' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left Side List */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              영예로운 8대 가문 일람
            </h3>
            {filteredFamilies.map(f => (
              <div 
                key={f.key}
                onClick={() => setSelectedFamily(f)}
                style={{ 
                  padding: '12px', 
                  border: selectedFamily?.key === f.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedFamily?.key === f.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Shield size={18} aria-hidden="true" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  <strong style={{ fontSize: '0.95rem', color: selectedFamily?.key === f.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{f.nameKO}</strong>
                  <div lang="en" style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{f.nameEN}</div>
                </div>
                <ChevronRight size={16} color="var(--color-gold)" />
              </div>
            ))}
            {filteredFamilies.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right Side Detail Reader */}
          {selectedFamily && (
            <section className="cs-section" style={{ flex: '2 1 450px' }}>
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedFamily.nameKO}</h3>
                <Shield size={20} aria-hidden="true" />
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                
                {/* Visual Coat of Arms Shield */}
                {selectedFamily.crestImage && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                    <div 
                      style={{ 
                        width: '120px', 
                        height: '140px', 
                        border: '2.5px solid var(--color-gold-dark)',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                        borderBottomLeftRadius: '50% 75%',
                        borderBottomRightRadius: '50% 75%',
                        padding: '12px 10px 18px 10px',
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #f5ecd5 100%)',
                        boxShadow: '0 6px 12px rgba(46, 31, 15, 0.12), inset 0 0 12px rgba(201,168,76,0.15)',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <img 
                        src={selectedFamily.crestImage} 
                        alt={`${selectedFamily.nameKO} Crest`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.15))'
                        }} 
                      />
                    </div>
                  </div>
                )}
                
                {/* Crest Description Badge */}
                <div style={{ border: '1px dashed var(--color-gold)', padding: '10px 14px', borderRadius: '4px', background: 'rgba(179,143,67,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '4px' }}>🛡️ 가문의 공식 문장 설명 (Blazon)</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)', lineHeight: '1.5' }}>
                    &ldquo;{selectedFamily.crestDescKO}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
                    <span lang="en">({selectedFamily.crestDescEN})</span>
                  </div>
                </div>

                {/* Motto */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📜 가훈 (Motto)</h4>
                  <p style={{ fontSize: '1.18rem', fontWeight: 'bold', color: 'var(--color-crimson)', fontFamily: 'var(--font-korean-serif)' }}>
                    &ldquo;{selectedFamily.mottoKO}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                    <span lang="en">({selectedFamily.mottoEN})</span>
                  </p>
                </div>

                {/* Background Narrative */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📖 역사 및 대가문 배경</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedFamily.backgroundKO}
                  </p>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontFamily: 'var(--font-korean-serif)', fontStyle: 'italic' }}>
                    <span lang="en">{selectedFamily.backgroundEN}</span>
                  </p>
                </div>

                {/* Traits & Modifiers */}
                <div style={{ borderTop: '1px solid var(--color-grey-light)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '6px' }}>⚖️ 혈통적 기질 및 권장 성향</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-crimson)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedFamily.traitsKO}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-grey)', marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
                    <span lang="en">({selectedFamily.traitsEN})</span>
                  </p>
                </div>

                {/* Appendix Three: Genealogical Lineage */}
                {selectedFamily.genealogy && (
                  <div style={{ borderTop: '1px solid var(--color-grey-light)', paddingTop: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👑 룰북 공식 영웅 계보 및 혈통도 (Appendix Three: Genealogy)
                    </h4>
                    <div 
                      style={{ 
                        background: '#fffef9', 
                        border: '1.5px solid var(--color-gold)', 
                        borderRadius: '6px', 
                        padding: '12px', 
                        boxShadow: '0 2px 6px rgba(201,168,76,0.06)' 
                      }}
                    >
                      <div 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '6px', 
                          fontSize: '0.84rem', 
                          lineHeight: '1.5', 
                          color: 'var(--color-ink)', 
                          fontFamily: 'var(--font-korean-serif)' 
                        }}
                      >
                        {selectedFamily.genealogy.split('\n').map((line, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>✦</span>
                            <div>{line.replace('• ', '')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}
        </div>
      )}

      {/* 2. SCENARIOS TAB */}
      {activeSubTab === 'scenarios' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left List */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              솔로 시나리오 목록
            </h3>
            {filteredScenarios.map(s => (
              <div 
                key={s.key}
                onClick={() => setSelectedScenario(s)}
                style={{ 
                  padding: '10px 12px', 
                  border: selectedScenario?.key === s.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedScenario?.key === s.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Compass size={14} color="var(--color-gold)" />
                <span style={{ fontSize: '0.88rem', fontWeight: selectedScenario?.key === s.key ? 'bold' : 'normal', color: 'var(--color-ink)' }}>
                  {s.name}
                </span>
              </div>
            ))}
            {filteredScenarios.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right detail reader */}
          {selectedScenario && (
            <section className="cs-section" style={{ flex: '2 1 450px' }}>
              <div className="sheet-ribbon">
                <h3>🧭 {selectedScenario.name}</h3>
              </div>
              <div className="cs-section-inner" style={{ backgroundColor: 'rgba(179,143,67,0.01)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Description */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📖 시나리오 배경 개요</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-light)', lineHeight: 1.5 }}>
                    {selectedScenario.rules}
                  </p>
                </div>

                {/* Flow Checklist */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-crimson)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px dashed var(--color-gold-light)', paddingBottom: '4px' }}>
                    ⚔️ 공식 룰 판정 흐름 (Flow &amp; Mechanics)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedScenario.flow.map((f, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          fontSize: '0.85rem', 
                          color: 'var(--color-ink)', 
                          lineHeight: 1.5,
                          backgroundColor: '#fff',
                          border: '1px solid var(--color-grey-light)',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1rem', marginTop: '-2px' }}>✦</span>
                        <div>{f}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* 4. GAZETTEER TAB (Chapter 14: Frankland) */}
      {activeSubTab === 'gazetteer' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left Side List: 10 Territories */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              🏛️ 제국 대강역 강역 (Territories)
            </h3>
            {/* 🗺️ 제국 지도 컬렉션 (Map Collection) */}
            <div 
              onClick={() => {
                setSelectedTerritory(null);
                setSelectedGeoTab('europe_768');
              }}
              style={{ 
                padding: '12px', 
                border: selectedTerritory === null ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                borderRadius: '4px',
                background: selectedTerritory === null ? 'rgba(179,143,67,0.06)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>🗺️</span>
                <strong style={{ fontSize: '0.95rem', color: selectedTerritory === null ? 'var(--color-crimson)' : 'var(--color-ink)' }}>제국 공식 지도첩 (Atlas)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>Imperial Maps Collection</div>
              </div>
              <ChevronRight size={16} color="var(--color-gold)" />
            </div>

            {filteredTerritories.map(t => (
              <div 
                key={t.key}
                onClick={() => {
                  setSelectedTerritory(t);
                  setSelectedGeoTab('overview');
                }}
                style={{ 
                  padding: '12px', 
                  border: selectedTerritory?.key === t.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedTerritory?.key === t.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>{t.emoji}</span>
                  <strong style={{ fontSize: '0.95rem', color: selectedTerritory?.key === t.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{t.nameKO.split(' (')[0]}</strong>
                  <div lang="en" style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{t.nameEN}</div>
                </div>
                <ChevronRight size={16} color="var(--color-gold)" />
              </div>
            ))}
            {filteredTerritories.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right Side Detail Reader: Multi-Tab Parchment-styled browser */}
          {selectedTerritory && (
            <section className="cs-section" style={{ flex: '2 1 480px' }}>
              {/* Parchment Ribbon Title */}
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedTerritory.emoji} {selectedTerritory.nameKO}</h3>
              </div>

              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fffefb', border: '1px solid var(--color-gold-light)', padding: '16px' }}>
                
                {/* 5-Sub-Tab Switcher */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px' }}>
                  {[
                    { id: 'overview', name: '🏰 강역 개요' },
                    { id: 'towns', name: '⚔️ 도시 & 성채' },
                    { id: 'abbeys', name: '⛪ 수도원 & 성물' },
                    { id: 'enchanted', name: '✨ 신비 유적' },
                    { id: 'trpg', name: '📊 TRPG 가이드' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className="btn-medieval"
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        background: selectedGeoTab === tab.id ? 'var(--color-crimson)' : 'none',
                        color: selectedGeoTab === tab.id ? '#fff' : 'var(--color-ink-light)',
                        border: selectedGeoTab === tab.id ? '1px solid var(--color-crimson)' : '1px solid var(--color-grey-light)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedGeoTab(tab.id)}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Sub-Tab Contents */}
                {selectedGeoTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Ruler Card */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fffefb' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>👑 통치 영주 (Rulers)</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>{selectedTerritory.rulerKO}</div>
                        <div lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{selectedTerritory.rulerEN}</div>
                      </div>
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fffefb' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>❤️ 시작 열정 (Passion)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-crimson)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>{selectedTerritory.passionKO}</div>
                      </div>
                    </div>

                    {/* Historical Overview */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>📖 강역 소개 &amp; 지리적 설정</h4>
                      <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)', margin: '0 0 8px 0' }}>
                        {selectedTerritory.descKO}
                      </p>
                      <p lang="en" style={{ fontSize: '0.76rem', lineHeight: 1.5, color: 'var(--color-ink-light)', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontStyle: 'italic', margin: 0 }}>
                        {selectedTerritory.descEN}
                      </p>
                    </div>

                    {/* Subdivisions / Counties */}
                    {selectedTerritory.subdivisions && selectedTerritory.subdivisions.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '8px' }}>📂 하위 행정 구역 및 백작령 (Subdivisions)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedTerritory.subdivisions.map((sub, idx) => (
                            <div key={idx} style={{ padding: '8px 10px', border: '1px solid rgba(179,143,67,0.1)', background: 'rgba(179,143,67,0.01)', borderRadius: '3px' }}>
                              <strong style={{ fontSize: '0.82rem', color: 'var(--color-ink)', display: 'block', marginBottom: '2px' }}>📍 {sub.nameKO}</strong>
                              <p style={{ fontSize: '0.76rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.4 }}>{sub.descKO}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedGeoTab === 'towns' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>🛡️ 주요 도시 및 철옹성 요새</h4>
                    {selectedTerritory.towns && selectedTerritory.towns.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedTerritory.towns.map((town, idx) => (
                          <div key={idx} style={{ border: '1px solid var(--color-gold-light)', padding: '12px', borderRadius: '4px', background: '#fffefb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(179,143,67,0.1)', paddingBottom: '4px', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-royal-blue)' }}>🏰 {town.nameKO}</strong>
                              <span lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{town.nameEN}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.4 }}>{town.descKO}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', fontStyle: 'italic', margin: 0 }}>해당 강역은 대규모 도시가 성립되지 않은 삼림 혹은 늪지대입니다.</p>
                    )}
                  </div>
                )}

                {selectedGeoTab === 'abbeys' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>⛪ 성스러운 수도원 및 봉헌 성물</h4>
                    {selectedTerritory.abbeys && selectedTerritory.abbeys.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedTerritory.abbeys.map((abbey, idx) => (
                          <div key={idx} style={{ border: '1px solid var(--color-gold-light)', padding: '12px', borderRadius: '4px', background: '#fffefb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(179,143,67,0.1)', paddingBottom: '4px', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-crimson)' }}>⛪ {abbey.nameKO}</strong>
                              <span lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{abbey.nameEN}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.4 }}>{abbey.descKO}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', fontStyle: 'italic', margin: 0 }}>해당 강역에는 성물이 대규모로 보존된 독립 교구 수도원이 존재하지 않습니다.</p>
                    )}
                  </div>
                )}

                {selectedGeoTab === 'enchanted' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>✨ 요정의 신비와 초자연적 비경</h4>
                    {selectedTerritory.enchanted && selectedTerritory.enchanted.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedTerritory.enchanted.map((site, idx) => (
                          <div key={idx} style={{ border: '1px solid var(--color-gold-light)', padding: '12px', borderRadius: '4px', background: '#fffefb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(179,143,67,0.1)', paddingBottom: '4px', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>✨ {site.nameKO}</strong>
                              <span lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{site.nameEN}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.4 }}>{site.descKO}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', fontStyle: 'italic', margin: 0 }}>해당 강역은 성스러운 정화 기운이 가득하거나, 외래 이교 마술이 봉인되어 전설의 요정 비경이 발견되지 않았습니다.</p>
                    )}
                  </div>
                )}

                {selectedGeoTab === 'trpg' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>📊 TRPG 가문 탄생지 가이드 (Birthplace homeland modifiers)</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.5 }}>
                      기사 캐릭터 생성 시, 이 강역을 **가문 고향(Homeland)**으로 설정할 경우 다음과 같은 기술 및 속성 능력치 보정 혜택을 영구적으로 획득합니다.
                    </p>

                    {/* Homeland Modifiers Badge Grid */}
                    <div style={{ border: '1px dashed var(--color-gold)', padding: '12px', borderRadius: '4px', background: 'rgba(179,143,67,0.03)' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>📊 고향 설정 보정치 (Homeland Modifiers)</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedTerritory.modifiers.map((m, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              fontSize: '0.8rem', 
                              padding: '4px 8px', 
                              background: '#fff', 
                              border: '1px solid var(--color-grey-light)', 
                              borderRadius: '4px', 
                              color: 'var(--color-ink)',
                              fontWeight: '500'
                            }}
                          >
                            {m.name}: <strong style={{ color: 'var(--color-crimson)' }}>{m.value}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {selectedTerritory === null && (
            <section className="cs-section" style={{ flex: '3.5 1 480px' }}>
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>🗺️ 제국 공식 지도첩 (Carolingian Atlas)</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fffefb', border: '1px solid var(--color-gold-light)', padding: '16px' }}>
                {/* Map Subtabs Switcher */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px' }}>
                  {[
                    { id: 'europe_768', name: '🗺️ 유럽 강역도 (768 AD)' },
                    { id: 'europe_814', name: '🗺️ 유럽 강역도 (814 AD)' },
                    { id: 'ardennes', name: '🌲 아르덴 상세도' },
                    { id: 'aachen', name: '🏰 아헨 황실 궁정도' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className="btn-medieval"
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        background: selectedGeoTab === tab.id ? 'var(--color-crimson)' : 'none',
                        color: selectedGeoTab === tab.id ? '#fff' : 'var(--color-ink-light)',
                        border: selectedGeoTab === tab.id ? '1px solid var(--color-crimson)' : '1px solid var(--color-grey-light)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedGeoTab(tab.id)}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* CSS Pulsing animation for map hotspots */}
                <style>{`
                  @keyframes mapPulse {
                    0% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 4px rgba(201, 168, 76, 0.4); }
                    50% { transform: scale(1.1); opacity: 0.9; box-shadow: 0 0 12px rgba(201, 168, 76, 0.8); }
                    100% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 4px rgba(201, 168, 76, 0.4); }
                  }
                  .map-hotspot-indicator {
                    animation: mapPulse 2s infinite ease-in-out;
                  }
                `}</style>

                {/* Map Display area with parchment frame */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', width: '100%' }}>
                  {(() => {
                    const territoryHotspots = [
                      { key: 'austrasia', name: '오스트라시아 (Austrasia)', top: '22%', left: '36.8%', width: '17.6%', height: '14%' },
                      { key: 'neustria', name: '네우스트리아 (Neustria)', top: '28%', left: '10.3%', width: '17.6%', height: '14%' },
                      { key: 'burgundy', name: '부르군트 (Burgundy)', top: '48%', left: '32.4%', width: '16.2%', height: '14%' },
                      { key: 'aquitaine', name: '아키텐 (Aquitaine)', top: '56%', left: '4.4%', width: '19.1%', height: '15%' },
                      { key: 'gascony', name: '가스코뉴 (Gascony)', top: '74%', left: '1%', width: '15%', height: '10%' },
                      { key: 'provence', name: '프로방스 (Provence)', top: '70%', left: '38.2%', width: '14.7%', height: '10%' },
                      { key: 'septimania', name: '셉티마니아 (Septimania)', top: '72%', left: '14.7%', width: '16.2%', height: '10%' },
                      { key: 'alemannia', name: '알레마니아 (Alemannia)', top: '38%', left: '47.1%', width: '14.7%', height: '12%' },
                      { key: 'bavaria', name: '바이에른 (Bavaria)', top: '40%', left: '63.2%', width: '16.2%', height: '13%' },
                      { key: 'thuringia', name: '튀링겐 (Thuringia)', top: '22%', left: '54.4%', width: '14.7%', height: '12%' }
                    ];

                    const handleHotspotClick = (key) => {
                      const found = franklandTerritories.find(t => t.key === key);
                      if (found) {
                        setSelectedTerritory(found);
                        setSelectedGeoTab('overview');
                      }
                    };

                    return (
                      <div style={{ width: '100%' }}>
                        {selectedGeoTab === 'europe_768' && (
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px', textAlign: 'left' }}>
                              🗺️ 유럽 강역도 (서기 768년 - 샤를마뉴 즉위 원년) [인터랙티브 대화형]
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.5, textAlign: 'left', marginBottom: '12px' }}>
                              국왕 피핀 3세 사후, 샤를마뉴 대제와 동생 카를로만 1세가 프랑크 왕국을 분할 통치하던 즉위 원년 시점의 대륙 강역도입니다. **지도 속 각 영역을 클릭하면 세부 설정으로 이동합니다.**
                            </p>
                            <div style={{ position: 'relative', border: '2px solid var(--color-gold-light)', padding: '6px', borderRadius: '4px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                              <img 
                                src={europe768Map} 
                                alt="Map of Europe 768 AD" 
                                style={{ width: '100%', borderRadius: '2px', display: 'block' }} 
                              />
                              {/* Render Interactive Hotspots */}
                              {territoryHotspots.map(spot => (
                                <div
                                  key={spot.key}
                                  onClick={() => handleHotspotClick(spot.key)}
                                  onMouseEnter={() => {
                                    const found = franklandTerritories.find(t => t.key === spot.key);
                                    setHoveredHotspot(found);
                                  }}
                                  onMouseLeave={() => setHoveredHotspot(null)}
                                  style={{
                                    position: 'absolute',
                                    top: spot.top,
                                    left: spot.left,
                                    width: spot.width,
                                    height: spot.height,
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    border: hoveredHotspot?.key === spot.key ? '2px solid var(--color-gold)' : '2px dashed rgba(201, 168, 76, 0.4)',
                                    background: hoveredHotspot?.key === spot.key ? 'rgba(201, 168, 76, 0.25)' : 'rgba(201, 168, 76, 0.05)',
                                    boxShadow: hoveredHotspot?.key === spot.key ? '0 0 10px rgba(201, 168, 76, 0.6)' : 'none',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10
                                  }}
                                  className={hoveredHotspot?.key === spot.key ? '' : 'map-hotspot-indicator'}
                                  title={spot.name}
                                >
                                  <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: hoveredHotspot?.key === spot.key ? 'var(--color-crimson)' : 'var(--color-gold-dark)',
                                    boxShadow: hoveredHotspot?.key === spot.key ? '0 0 6px var(--color-crimson)' : 'none'
                                  }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedGeoTab === 'europe_814' && (
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px', textAlign: 'left' }}>
                              🗺️ 유럽 강역도 (서기 814년 - 샤를마뉴 대제 서거) [인터랙티브 대화형]
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.5, textAlign: 'left', marginBottom: '12px' }}>
                              샤를마뉴 대제가 전 생애에 걸친 대정복 위업을 통해 작센, 바이에른, 아바르, 롬바르디아를 정복하고 거대한 로마 제국 황제로서 서거하기 직전 최절정기의 제국 대강역도입니다. **지도 속 각 영역을 클릭하면 세부 설정으로 이동합니다.**
                            </p>
                            <div style={{ position: 'relative', border: '2px solid var(--color-gold-light)', padding: '6px', borderRadius: '4px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                              <img 
                                src={europe814Map} 
                                alt="Map of Europe 814 AD" 
                                style={{ width: '100%', borderRadius: '2px', display: 'block' }} 
                              />
                              {/* Render Interactive Hotspots */}
                              {territoryHotspots.map(spot => (
                                <div
                                  key={spot.key}
                                  onClick={() => handleHotspotClick(spot.key)}
                                  onMouseEnter={() => {
                                    const found = franklandTerritories.find(t => t.key === spot.key);
                                    setHoveredHotspot(found);
                                  }}
                                  onMouseLeave={() => setHoveredHotspot(null)}
                                  style={{
                                    position: 'absolute',
                                    top: spot.top,
                                    left: spot.left,
                                    width: spot.width,
                                    height: spot.height,
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    border: hoveredHotspot?.key === spot.key ? '2px solid var(--color-gold)' : '2px dashed rgba(201, 168, 76, 0.4)',
                                    background: hoveredHotspot?.key === spot.key ? 'rgba(201, 168, 76, 0.25)' : 'rgba(201, 168, 76, 0.05)',
                                    boxShadow: hoveredHotspot?.key === spot.key ? '0 0 10px rgba(201, 168, 76, 0.6)' : 'none',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10
                                  }}
                                  className={hoveredHotspot?.key === spot.key ? '' : 'map-hotspot-indicator'}
                                  title={spot.name}
                                >
                                  <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: hoveredHotspot?.key === spot.key ? 'var(--color-crimson)' : 'var(--color-gold-dark)',
                                    boxShadow: hoveredHotspot?.key === spot.key ? '0 0 6px var(--color-crimson)' : 'none'
                                  }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Real-Time Map Inspector Card */}
                        {(selectedGeoTab === 'europe_768' || selectedGeoTab === 'europe_814') && (
                          <div style={{
                            marginTop: '16px',
                            width: '100%',
                            border: '1.5px solid var(--color-gold)',
                            borderRadius: '6px',
                            background: '#fffef9',
                            padding: '14px',
                            textAlign: 'left',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.03)',
                            boxSizing: 'border-box'
                          }}>
                            {!hoveredHotspot ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                <Compass size={16} />
                                <span>💡 지도 위의 반짝이는 강역 원형 마커에 마우스를 올리면 통치자와 보정 혜택 요약이 제공됩니다. 클릭 시 백과사전으로 즉시 이동합니다!</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '6px' }}>
                                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-crimson)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{hoveredHotspot.emoji}</span> {hoveredHotspot.nameKO}
                                  </h4>
                                  <span lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)' }}>{hoveredHotspot.nameEN}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                                  <div>
                                    <span style={{ color: 'var(--color-grey)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>👑 통치 영주 (Ruler)</span>
                                    <strong style={{ color: 'var(--color-ink)' }}>{hoveredHotspot.rulerKO}</strong>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--color-grey)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>❤️ 시작 열정 (Passion)</span>
                                    <strong style={{ color: 'var(--color-crimson)' }}>{hoveredHotspot.passionKO.split(' 또는')[0]}</strong>
                                  </div>
                                </div>
                                <div style={{ fontSize: '0.78rem', borderTop: '1px dashed rgba(179,143,67,0.15)', paddingTop: '6px' }}>
                                  <span style={{ color: 'var(--color-grey)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📊 고향 보정치 (Homeland Modifiers)</span>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {hoveredHotspot.modifiers.map((m, idx) => (
                                      <span key={idx} style={{ padding: '2px 6px', background: 'rgba(179,143,67,0.04)', border: '1px solid var(--color-gold-light)', borderRadius: '3px', fontWeight: 'bold', color: 'var(--color-ink-light)', fontSize: '0.72rem' }}>
                                        {m.name} <strong style={{ color: 'var(--color-royal-blue)' }}>{m.value}</strong>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', lineHeight: 1.4, margin: '4px 0 0 0', fontStyle: 'italic', borderLeft: '3px solid var(--color-gold)', paddingLeft: '8px' }}>
                                  {hoveredHotspot.descKO.substring(0, 100)}...
                                </p>
                                <div style={{ color: 'var(--color-gold-dark)', fontSize: '0.74rem', fontWeight: 'bold', marginTop: '4px', textAlign: 'right' }}>
                                  👉 클릭 시 상세 가제티어 설명창으로 즉시 이동합니다.
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedGeoTab === 'ardennes' && (
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px', textAlign: 'left' }}>
                              🌲 아르덴 상세 세부 지도 (The Ardennes Forest &amp; Bastogne)
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.5, textAlign: 'left', marginBottom: '12px' }}>
                              플레이어 성기사들이 어린 시절 교육받고 모험을 시작하는 아르덴 공국 및 바스토뉴(Bastogne) 요새도시 중심의 세부 강역도입니다. 울창한 원시 삼림과 복잡한 지류, 신비 유적 및 수도원들의 상세 입지가 결합되어 있습니다.
                            </p>
                            <div style={{ border: '2px solid var(--color-gold-light)', padding: '6px', borderRadius: '4px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', maxWidth: '650px', margin: '0 auto' }}>
                              <img 
                                src={ardennesMap} 
                                alt="Map of the Ardennes" 
                                style={{ width: '100%', borderRadius: '2px', display: 'block' }} 
                              />
                            </div>
                          </div>
                        )}

                        {selectedGeoTab === 'aachen' && (
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px', textAlign: 'left' }}>
                              🏰 아헨 제국 궁정 세부 도면 (Aachen Palace Compound)
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.5, textAlign: 'left', marginBottom: '12px' }}>
                              샤를마뉴 대제의 황실 궁정이 위치한 아헨(Aachen)의 제국 궁정 성벽 단지 세부 배치 도면입니다. 황금 돔 예배당(Palatine Chapel), 대제의 대강당(Aula Regia), 국고 탑 등의 상세 입지를 보여줍니다.
                            </p>
                            <div style={{ border: '2px solid var(--color-gold-light)', padding: '6px', borderRadius: '4px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', maxWidth: '600px', margin: '0 auto' }}>
                              <img 
                                src={aachenMap} 
                                alt="Map of Aachen Palace" 
                                style={{ width: '100%', borderRadius: '2px', display: 'block' }} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          </section>
        )}
        </div>
      )}

      {/* 5. BESTIARY TAB */}
      {activeSubTab === 'bestiary' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left Side List */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              괴수 및 전설의 야수 일람
            </h3>
            {filteredBestiary.map(b => (
              <div 
                key={b.key}
                onClick={() => setSelectedMonster(b)}
                style={{ 
                  padding: '12px', 
                  border: selectedMonster?.key === b.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedMonster?.key === b.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>{b.emoji}</span>
                  <strong style={{ fontSize: '0.95rem', color: selectedMonster?.key === b.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{b.nameKO.split(' (')[0]}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{b.category}</div>
                </div>
                <ChevronRight size={16} color="var(--color-gold)" />
              </div>
            ))}
            {filteredBestiary.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right Side Detail Reader */}
          {selectedMonster && (
            <section className="cs-section" style={{ flex: '2 1 450px' }}>
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedMonster.emoji} {selectedMonster.nameKO}</h3>
                <span style={{ fontSize: '0.8rem', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>
                  {selectedMonster.category}
                </span>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                
                {/* TRPG Stats Table Card */}
                <div style={{ border: '1px solid var(--color-gold-light)', borderRadius: '6px', background: '#fff', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📊 TRPG 전투 능력치 스펙 (Standard TRPG Stats)
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center', background: '#faf8f5', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>STR (근력)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>{selectedMonster.stats.STR}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: '#faf8f5', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>CON (건강)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>{selectedMonster.stats.CON}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: '#faf8f5', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>SIZ (크기)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>{selectedMonster.stats.SIZ}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: '#faf8f5', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>DEX (민첩)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>{selectedMonster.stats.DEX}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                    {/* HP Bar */}
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>
                        <span>HP (체력)</span>
                        <span style={{ color: 'var(--color-crimson)' }}>{selectedMonster.stats.HP} / {selectedMonster.stats.HP}</span>
                      </div>
                      <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, var(--color-crimson) 0%, #ff5252 100%)' }} />
                      </div>
                    </div>

                    {/* Armor Shield */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fdfbf7', padding: '4px', borderRadius: '4px', border: '1.5px solid var(--color-gold)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>🛡️ 아머 (Armor)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>{selectedMonster.stats.Armor}</div>
                    </div>

                    {/* Damage */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff5f5', padding: '4px', borderRadius: '4px', border: '1.5px solid #ff8a80' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-crimson)', fontWeight: 'bold' }}>⚔️ 피해량 (Damage)</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-crimson)' }}>{selectedMonster.stats.Damage}</div>
                    </div>
                  </div>
                </div>

                {/* Combat Special Rules */}
                <div style={{ border: '1.5px solid var(--color-gold)', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 3px 8px rgba(201,168,76,0.1)' }}>
                  <div style={{ background: 'linear-gradient(135deg, #b38f43 0%, #8c6b23 100%)', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💀 솔로 전투 특수 규칙 (Combat Special Rules)
                  </div>
                  <div style={{ background: '#fffefb', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedMonster.specialRules.map((r, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-crimson)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✦ {r.title}
                        </div>
                        <div style={{ color: 'var(--color-ink-light)', paddingLeft: '12px', borderLeft: '1.5px solid var(--color-gold-light)' }}>
                          {r.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lore / Description */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📖 배경 기사도 야사 및 관찰 보고</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedMonster.loreKO}
                  </p>
                  <p lang="en" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontStyle: 'italic' }}>
                    {selectedMonster.loreEN}
                  </p>
                </div>

              </div>
            </section>
          )}
        </div>
      )}


      {/* 2.5. NPCS TAB (Chapter 16) */}
      {activeSubTab === 'npcs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* NPC View Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <button 
              onClick={() => { setNpcViewMode('major'); setSearchQuery(''); }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid var(--color-gold)',
                background: npcViewMode === 'major' ? 'var(--color-crimson)' : '#fff',
                color: npcViewMode === 'major' ? '#fff' : 'var(--color-ink)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              👑 전설의 8대 영웅 (Major Heroes)
            </button>
            <button 
              onClick={() => { setNpcViewMode('paladins'); setSearchQuery(''); }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid var(--color-gold)',
                background: npcViewMode === 'paladins' ? 'var(--color-crimson)' : '#fff',
                color: npcViewMode === 'paladins' ? '#fff' : 'var(--color-ink)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              🛡️ 32인 성기사단 (Paladins)
            </button>
            <button 
              onClick={() => { setNpcViewMode('family_court'); setSearchQuery(''); setSelectedMinorNPC(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid var(--color-gold)',
                background: npcViewMode === 'family_court' ? 'var(--color-crimson)' : '#fff',
                color: npcViewMode === 'family_court' ? '#fff' : 'var(--color-ink)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              🏰 황실 & 궁정 (Family & Court)
            </button>
            <button 
              onClick={() => { setNpcViewMode('enemies'); setSearchQuery(''); setSelectedMinorNPC(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid var(--color-gold)',
                background: npcViewMode === 'enemies' ? 'var(--color-crimson)' : '#fff',
                color: npcViewMode === 'enemies' ? '#fff' : 'var(--color-ink)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              🐍 제국의 정적 (Enemies Within)
            </button>
            <button 
              onClick={() => { setNpcViewMode('foreigners'); setSearchQuery(''); setSelectedMinorNPC(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1.5px solid var(--color-gold)',
                background: npcViewMode === 'foreigners' ? 'var(--color-crimson)' : '#fff',
                color: npcViewMode === 'foreigners' ? '#fff' : 'var(--color-ink)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              🕌 외세 세력 인물 (Foreigners)
            </button>
          </div>

          {npcViewMode === 'major' && (
            <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
              {/* Left List */}
              <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
                  전설의 8대 영웅 일람
                </h3>
                {filteredNPCs.map(n => (
                  <div 
                    key={n.key}
                    onClick={() => setSelectedNPC(n)}
                    style={{ 
                      padding: '12px', 
                      border: selectedNPC?.key === n.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                      borderRadius: '4px',
                      background: selectedNPC?.key === n.key ? 'rgba(179,143,67,0.06)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>👑</span>
                      <strong style={{ fontSize: '0.95rem', color: selectedNPC?.key === n.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{n.nameKO.split(' (')[0]}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{n.nameEN.split(' (')[0]}</div>
                    </div>
                    <ChevronRight size={16} color="var(--color-gold)" />
                  </div>
                ))}
                {filteredNPCs.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
                )}
              </div>

              {/* Right Details */}
              {selectedNPC && (
                <section className="cs-section" style={{ flex: '2 1 450px' }}>
                  <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>👑 {selectedNPC.nameKO}</h3>
                    <span style={{ fontSize: '0.8rem', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>
                      명예: {selectedNPC.glory.toLocaleString()} Glory
                    </span>
                  </div>
                  <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                    
                    {/* Title & Combat derived values */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>👑 신분 및 작위</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>{selectedNPC.titleKO}</div>
                        <div lang="en" style={{ fontSize: '0.75rem', color: 'var(--color-grey)' }}>{selectedNPC.titleEN}</div>
                      </div>
                      <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>⚔️ 피해 (Damage)</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-crimson)' }}>{selectedNPC.damage}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>🛡️ 아머 (Armor)</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-gold-dark)' }}>{selectedNPC.armor}</div>
                        </div>
                      </div>
                    </div>

                    {/* Character Stats Grid */}
                    <div style={{ border: '1px solid var(--color-gold-light)', borderRadius: '6px', background: '#fff', padding: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '8px' }}>📊 캐릭터 고유 속성 (Attributes)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '10px' }}>
                        {['STR', 'CON', 'SIZ', 'DEX', 'APP'].map(att => (
                          <div key={att} style={{ textAlign: 'center', background: '#faf8f5', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-grey-light)' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-grey)', fontWeight: 'bold' }}>{att}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-ink)' }}>{selectedNPC.stats[att]}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                        <div style={{ background: '#fff5f5', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ffab91' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>
                            <span>HP (생명력)</span>
                            <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>{selectedNPC.stats.HP}</span>
                          </div>
                          <div style={{ height: '5px', background: '#e0e0e0', borderRadius: '2.5px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '100%', background: 'var(--color-crimson)' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', background: '#faf8f5', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-grey-light)', fontSize: '0.75rem' }}>
                          <div style={{ color: 'var(--color-grey)', fontSize: '0.6rem' }}>MW (치명상)</div>
                          <strong style={{ color: 'var(--color-ink)' }}>{selectedNPC.stats.MW}</strong>
                        </div>
                        <div style={{ textAlign: 'center', background: '#faf8f5', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-grey-light)', fontSize: '0.75rem' }}>
                          <div style={{ color: 'var(--color-grey)', fontSize: '0.6rem' }}>UC (기절치)</div>
                          <strong style={{ color: 'var(--color-ink)' }}>{selectedNPC.stats.UC}</strong>
                        </div>
                        <div style={{ textAlign: 'center', background: '#faf8f5', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-grey-light)', fontSize: '0.75rem' }}>
                          <div style={{ color: 'var(--color-grey)', fontSize: '0.6rem' }}>KD (낙마치)</div>
                          <strong style={{ color: 'var(--color-ink)' }}>{selectedNPC.stats.KD}</strong>
                        </div>
                      </div>
                    </div>

                    {/* 12 Chivalrous Traits Grid with visual sliders */}
                    <div style={{ border: '1px dashed var(--color-gold)', borderRadius: '6px', background: 'rgba(179,143,67,0.02)', padding: '12px' }}>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '8px' }}>⚖️ 기사단 12 성향치 (Chivalrous Traits)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 8px', fontSize: '0.8rem' }}>
                        {Object.entries(selectedNPC.traits).map(([trait, val]) => {
                          const opposingMap = {
                            Chaste: 'Lustful', Energetic: 'Lazy', Forgiving: 'Vengeful',
                            Generous: 'Selfish', Honest: 'Deceitful', Just: 'Arbitrary',
                            Merciful: 'Cruel', Modest: 'Proud', Prudent: 'Reckless',
                            Temperate: 'Indulgent', Trusting: 'Suspicious', Valorous: 'Cowardly'
                          };
                          const opposing = opposingMap[trait] || '';
                          const total = 20;
                          const firstPct = Math.min((val / total) * 100, 100);
                          return (
                            <div key={trait} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: '500' }}>
                                <span style={{ color: val >= 16 ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{trait} ({val})</span>
                                <span style={{ color: 'var(--color-grey)', fontSize: '0.75rem' }}>{opposing}</span>
                              </div>
                              <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${firstPct}%`, background: val >= 16 ? 'var(--color-crimson)' : 'var(--color-gold)' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {selectedNPC.directedTraits && selectedNPC.directedTraits !== "없음" && (
                        <div style={{ marginTop: '8px', fontSize: '0.78rem', borderTop: '1px dashed var(--color-gold-light)', paddingTop: '6px' }}>
                          <strong>🎯 지향성 성향 (Directed Traits):</strong> <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>{selectedNPC.directedTraits}</span>
                        </div>
                      )}
                    </div>

                    {/* Passions & Ideals */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid var(--color-grey-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>❤️ 마음의 열망 (Passions)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {selectedNPC.passions.map((p, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--color-ink-light)' }}>{p.name}</span>
                              <strong style={{ color: 'var(--color-crimson)' }}>{p.value}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ border: '1px solid var(--color-grey-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '4px' }}>⚜️ 기사적 이상 (Ideals)</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', fontFamily: 'var(--font-korean-serif)', lineHeight: '1.4' }}>
                          {selectedNPC.ideals}
                        </div>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div style={{ border: '1px solid var(--color-grey-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>📜 기사도 기술 (Courtly &amp; Common Skills)</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {selectedNPC.skills.map((s, idx) => (
                          <span key={idx} style={{ fontSize: '0.78rem', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-ink)' }}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Combat Skills Grid */}
                    <div style={{ border: '1px solid var(--color-grey-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>⚔️ 전투 무기 기술 (Combat Weapon Skills)</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {selectedNPC.combatSkills.map((cs, idx) => (
                          <span key={idx} style={{ fontSize: '0.78rem', background: '#fff5f5', border: '1px solid #ffcdd2', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-crimson)', fontWeight: '500' }}>{cs}</span>
                        ))}
                      </div>
                    </div>

                    {/* Significant Items */}
                    <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: 'rgba(179,143,67,0.02)' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>✨ 핵심 장비 및 성물 (Significant Items)</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {selectedNPC.significantItems.map((item, idx) => (
                          <span key={idx} style={{ fontSize: '0.78rem', background: '#fff', border: '1px solid var(--color-gold)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-gold-dark)', fontWeight: '500' }}>{item}</span>
                        ))}
                      </div>
                    </div>

                    {/* Biography */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '6px' }}>📖 성사기 고증 약사 및 해설</h4>
                      <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>
                        {selectedNPC.biographyKO}
                      </p>
                      <p lang="en" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontStyle: 'italic' }}>
                        {selectedNPC.biographyEN}
                      </p>
                    </div>

                  </div>
                </section>
              )}
            </div>
          )}

          {npcViewMode === 'paladins' && (
            <div className="cs-row" style={{ width: '100%' }}>
              <section className="cs-section" style={{ flex: '1 1 100%' }}>
                <div className="sheet-ribbon">
                  <h3>🛡️ 32인 제국 성기사단 로스터 (Official Roster of Paladins)</h3>
                </div>
                <div className="cs-section-inner" style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-gold)', textAlign: 'left', color: 'var(--color-gold-dark)' }}>
                        <th style={{ padding: '10px 8px' }}>성기사 이름 (Name)</th>
                        <th style={{ padding: '10px 8px' }}>서임 시기 (Knighted)</th>
                        <th style={{ padding: '10px 8px' }}>동료 기사 (Companion)</th>
                        <th style={{ padding: '10px 8px' }}>룰북 공식 행적 및 서사적 고증 요약</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPaladins.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-grey-light)', background: idx % 2 === 0 ? 'rgba(179,143,67,0.02)' : '#fff' }}>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold', color: 'var(--color-crimson)', minWidth: '150px' }}>
                            {p.nameKO} <div lang="en" style={{ fontSize: '0.72rem', color: 'var(--color-grey)', fontWeight: 'normal' }}>{p.nameEN}</div>
                          </td>
                          <td style={{ padding: '10px 8px', fontWeight: '500', minWidth: '80px' }}>{p.knighted}</td>
                          <td style={{ padding: '10px 8px', color: 'var(--color-royal-blue)', minWidth: '120px' }}>{p.companion}</td>
                          <td style={{ padding: '10px 8px', color: 'var(--color-ink)', lineHeight: '1.4', fontFamily: 'var(--font-korean-serif)' }}>{p.desc}</td>
                        </tr>
                      ))}
                      {filteredPaladins.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic' }}>검색 결과가 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {(npcViewMode === 'family_court' || npcViewMode === 'enemies' || npcViewMode === 'foreigners') && (
            <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
              {/* Left List: Grouped by subcategory */}
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '4px' }}>
                  {npcViewMode === 'family_court' && "👑 황실 직계 및 궁정 인물"}
                  {npcViewMode === 'enemies' && "🐍 제국의 정치적 라이벌 및 반역파"}
                  {npcViewMode === 'foreigners' && "🕌 제국 주변 외세 세력 인물"}
                </h3>
                
                {/* Grouping Logic */}
                {(() => {
                  const grouped = categoryMinorNPCs.reduce((acc, item) => {
                    const sub = item.subcategory || "기타";
                    if (!acc[sub]) acc[sub] = [];
                    acc[sub].push(item);
                    return acc;
                  }, {});
                  
                  if (categoryMinorNPCs.length === 0) {
                    return <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>;
                  }
                  
                  return Object.entries(grouped).map(([subTitle, items]) => (
                    <div key={subTitle} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold', 
                        color: 'var(--color-gold-dark)', 
                        background: 'rgba(179,143,67,0.06)', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        borderLeft: '3px solid var(--color-gold)'
                      }}>
                        {subTitle}
                      </div>
                      {items.map(n => {
                        const isSelected = activeMinorNPC?.key === n.key;
                        return (
                          <div 
                            key={n.key}
                            onClick={() => setSelectedMinorNPC(n)}
                            style={{ 
                              padding: '10px 12px', 
                              border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                              borderRadius: '4px',
                              background: isSelected ? 'rgba(179,143,67,0.06)' : '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong style={{ fontSize: '0.88rem', color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {n.nameKO.split(' (')[0]}
                              </strong>
                              {n.years && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-grey)', display: 'block', marginTop: '1px' }}>
                                  🕰️ {n.years}
                                </span>
                              )}
                            </div>
                            <ChevronRight size={14} color="var(--color-gold)" style={{ flexShrink: 0, marginLeft: '6px' }} />
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>

              {/* Right Details: Premium Parchment layout */}
              {activeMinorNPC && (
                <section className="cs-section" style={{ flex: '2 1 450px' }}>
                  <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>📖 {activeMinorNPC.nameKO}</h3>
                    {activeMinorNPC.years && (
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>
                        🕰️ {activeMinorNPC.years}
                      </span>
                    )}
                  </div>
                  <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                    
                    {/* Meta info box */}
                    <div style={{ border: '1px solid var(--color-gold-light)', padding: '12px', borderRadius: '4px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>📁 대분류</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-ink)', fontWeight: 'bold' }}>
                            {activeMinorNPC.category === 'Imperial Family & Court' && "👑 황실 & 제국 궁정"}
                            {activeMinorNPC.category === 'Enemies Within' && "🐍 제국의 정적"}
                            {activeMinorNPC.category === 'Foreigners' && "🕌 외세 세력"}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>🏷️ 세부 카테고리</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-royal-blue)', fontWeight: 'bold' }}>{activeMinorNPC.subcategory}</div>
                        </div>
                      </div>
                    </div>

                    {/* Biography KO */}
                    <div style={{ border: '1px dashed var(--color-gold-light)', padding: '16px', borderRadius: '6px', background: '#fffdf9' }}>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📖</span> 제국 사서 실기 및 연대기 해설
                      </h4>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)', whiteSpace: 'pre-wrap' }}>
                        {activeMinorNPC.biographyKO}
                      </p>
                    </div>

                    {/* Biography EN */}
                    <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: '12px', background: '#faf8f5', padding: '12px', borderRadius: '0 4px 4px 0' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '4px' }}>📜 Rulebook Original Entry</div>
                      <p lang="en" style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--color-ink-light)', fontStyle: 'italic', margin: 0 }}>
                        {activeMinorNPC.biographyEN}
                      </p>
                    </div>

                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2.7. CULTURES TAB (Chapter 17) */}
      {activeSubTab === 'cultures' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left List */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              제국 16대 외래 집단 일람
            </h3>
            {filteredCultures.map(c => (
              <div 
                key={c.key}
                onClick={() => setSelectedCulture(c)}
                style={{ 
                  padding: '12px', 
                  border: selectedCulture?.key === c.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedCulture?.key === c.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>{c.emoji}</span>
                  <strong style={{ fontSize: '0.95rem', color: selectedCulture?.key === c.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{c.nameKO.split(' (')[0]}</strong>
                  <div lang="en" style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{c.nameEN}</div>
                </div>
                <ChevronRight size={16} color="var(--color-gold)" />
              </div>
            ))}
            {filteredCultures.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right Details */}
          {selectedCulture && (
            <section className="cs-section" style={{ flex: '2 1 450px' }}>
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedCulture.emoji} {selectedCulture.nameKO}</h3>
                <span lang="en" style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{selectedCulture.nameEN}</span>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                
                {/* Language Mode Toggle */}
                <div style={{ display: 'flex', gap: '8px', padding: '8px 12px', background: '#faf8f5', border: '1px solid var(--color-gold-light)', borderRadius: '6px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RefreshCw size={14} /> 해설 번역 언어 (Rulebook Translation Mode)
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { key: 'KO', label: '국문 해설' },
                      { key: 'EN', label: '영문 원문' },
                      { key: 'both', label: '대조 병기' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setCultureLangMode(opt.key)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 10px',
                          border: '1.5px solid var(--color-gold)',
                          borderRadius: '4px',
                          background: cultureLangMode === opt.key ? 'var(--color-gold)' : '#fff',
                          color: cultureLangMode === opt.key ? '#fff' : 'var(--color-gold-dark)',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          outline: 'none'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical Modifiers from Table 17-1 */}
                <div style={{ border: '1.5px solid var(--color-gold)', padding: '12px', borderRadius: '6px', background: '#fffef9' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 'bold', marginBottom: '6px' }}>📊 신체 능력치 증감 보정치 (Table 17-1 Physical Modifiers)</div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {Object.keys(selectedCulture.modifiers).length > 0 ? (
                      Object.entries(selectedCulture.modifiers).map(([att, val]) => (
                        <span key={att} style={{ fontSize: '0.85rem', padding: '4px 10px', background: 'rgba(179,143,67,0.04)', border: '1.5px solid var(--color-gold)', borderRadius: '4px', fontWeight: 'bold', color: 'var(--color-ink)' }}>
                          {att}: <strong style={{ color: val.startsWith('-') ? 'var(--color-crimson)' : 'var(--color-royal-blue)' }}>{val}</strong>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-grey)', fontStyle: 'italic' }}>기본 인간 속성 적용 (보정치 없음)</span>
                    )}
                  </div>
                </div>

                {/* Naming 풀 및 대표 외모 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'stretch' }}>
                  <div style={{ border: '1px solid var(--color-grey-light)', padding: '12px', borderRadius: '4px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>🗣️ 대표 작명 풀 (Representative Names)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-ink)', lineHeight: '1.5' }}>
                      <div><strong>남성 (Men):</strong> {selectedCulture.names.men}</div>
                      <div style={{ marginTop: '6px' }}><strong>여성 (Women):</strong> {selectedCulture.names.women}</div>
                    </div>
                  </div>
                  {renderBilingualSection("👥 신체 및 외모적 특징", selectedCulture.appearanceKO, selectedCulture.appearanceEN, "👥")}
                </div>

                {/* Character, Skills, Relations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {renderBilingualSection("⚖️ 세력의 문화적 기질", selectedCulture.characterKO, selectedCulture.characterEN, "⚖️")}
                  {renderBilingualSection("📜 문화적 특기 기술", selectedCulture.skillsKO, selectedCulture.skillsEN, "📜")}
                </div>

                {/* Relations with Franks */}
                {renderBilingualSection("⚜️ 프랑크 제국 황실과의 관계", selectedCulture.relationsKO, selectedCulture.relationsEN, "⚜️", {
                  border: '1px dashed var(--color-gold)',
                  background: 'rgba(179,143,67,0.02)'
                })}

                {/* Daily Life, Warfare, Equipment, Honor, Fortifications */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {renderBilingualSection("🏕️ 사회 및 경제 생활방식", selectedCulture.dailyLifeKO, selectedCulture.dailyLifeEN, "🏕️")}
                  {renderBilingualSection("⚔️ 전투 방식 및 전술", selectedCulture.warfareKO, selectedCulture.warfareEN, "⚔️")}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {renderBilingualSection("🛡️ 표준 무장 (Standard Equipment)", selectedCulture.equipmentKO, selectedCulture.equipmentEN, "🛡️")}
                  {renderBilingualSection("🏰 요새화 수준 (Fortifications)", selectedCulture.fortificationsKO, selectedCulture.fortificationsEN, "🏰")}
                </div>

                {renderBilingualSection("⚖️ 세력의 고유 명예율 (Code of Honor)", selectedCulture.codeOfHonorKO, selectedCulture.codeOfHonorEN, "⚖️", {
                  border: '1px solid var(--color-gold-light)',
                  background: 'rgba(179,143,67,0.02)'
                })}

                {/* Chronology Timeline */}
                {selectedCulture.chronology && selectedCulture.chronology.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-grey-light)', paddingTop: '12px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '8px' }}>
                      📅 제국 대역사 속 핵심 연표 (Chronology)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedCulture.chronology.map((c, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', lineHeight: '1.4' }}>
                          <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold', minWidth: '55px' }}>{c.year}</span>
                          <span style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>{c.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}
        </div>
      )}

            {/* 3. FEUDAL & HISTORICAL INFO TAB */}
      {activeSubTab === 'feudal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ink)', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
              <Book size={20} /> 제13장: 프랑크 사회 (Frankish Society)
            </h3>
            <button 
              className={`btn-medieval ${showGmRef ? 'btn-medieval-primary' : ''}`}
              onClick={() => setShowGmRef(!showGmRef)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px' }}
            >
              <Shuffle size={14} /> {showGmRef ? '역사 해설 보기' : 'GM 룰북 퀵-레퍼런스'}
            </button>
          </div>

          {!showGmRef ? (
            /* INTERACTIVE ARCHIVE BROWSER */
            <div className="cs-row" style={{ gap: '20px', alignItems: 'flex-start' }}>
              {/* Left Sidebar Category Selection */}
              <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '10px' }}>
                {frankishSociety.map(sec => {
                  const IconComponent = sec.key === 'crown' ? Crown :
                                      sec.key === 'justice' ? Scale :
                                      sec.key === 'palace' ? Book :
                                      sec.key === 'knighthood' ? Award :
                                      sec.key === 'dailyLife' ? Home :
                                      sec.key === 'church' ? HelpCircle : Sword;
                  return (
                    <button
                      key={sec.key}
                      className={`btn-medieval ${selectedSocietyTab === sec.key ? 'btn-medieval-primary' : ''}`}
                      onClick={() => setSelectedSocietyTab(sec.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '10px',
                        padding: '10px 14px',
                        textAlign: 'left',
                        width: '100%',
                        fontSize: '0.9rem'
                      }}
                    >
                      <IconComponent size={16} style={{ color: selectedSocietyTab === sec.key ? 'inherit' : 'var(--color-gold-dark)' }} />
                      {sec.titleKO}
                    </button>
                  );
                })}
              </div>

              {/* Right Content Pane */}
              <div style={{ flex: '3 3 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(() => {
                  const currentSection = frankishSociety.find(sec => sec.key === selectedSocietyTab) || frankishSociety[0];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="sheet-ribbon">
                        <h3>{currentSection.titleKO}</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {currentSection.topics.map((topic, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              background: '#fffefb', 
                              border: '1px solid var(--color-gold-light)', 
                              padding: '16px', 
                              borderRadius: '4px', 
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(179,143,67,0.1)', paddingBottom: '8px', marginBottom: '10px' }}>
                              <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem', color: 'var(--color-ink)' }}>
                                {topic.titleKO}
                              </h4>
                              <span lang="en" style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', border: '1px solid var(--color-gold-light)', padding: '2px 6px', background: 'rgba(179,143,67,0.05)', borderRadius: '2px', fontWeight: 'bold' }}>
                                {topic.nameEN}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginBottom: '12px' }}>
                              {topic.desc}
                            </p>
                            <div 
                              style={{ 
                                borderLeft: '3px solid var(--color-crimson)', 
                                padding: '10px 12px', 
                                background: 'rgba(179,143,67,0.03)', 
                                fontSize: '0.8rem', 
                                color: 'var(--color-ink-light)', 
                                lineHeight: 1.5,
                                border: '1px solid rgba(179,143,67,0.15)',
                                borderLeftWidth: '3px',
                                borderRadius: '0 4px 4px 0'
                              }}
                            >
                              <strong style={{ color: 'var(--color-crimson)', display: 'block', fontSize: '0.82rem', marginBottom: '4px' }}>
                                🎲 TRPG 룰북 가이드 &amp; 판정
                              </strong>
                              {topic.trpgRules}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* GM RULES QUICK-REFERENCE TOOL */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="sheet-ribbon">
                <h3>🎲 GM 룰북 핵심 참조 요약 (GM Quick-Reference Guide)</h3>
              </div>
              <div className="cs-row" style={{ gap: '20px', alignItems: 'flex-start' }}>
                {/* Chivalry 10 Commandments & Ideals */}
                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <section className="cs-section">
                    <div style={{ padding: '14px', border: '1px solid var(--color-gold-light)', background: '#fffefb' }}>
                      <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>
                        ⚜️ 기사의 도덕률과 기사도 10계명
                      </h4>
                      <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--color-ink-light)', lineHeight: 1.4 }}>
                        <li>너는 교회의 가르침을 진실히 믿고 그 규례를 충실히 지킬 것이다.</li>
                        <li>너는 제국과 성 교회를 끝까지 지켜낼 용맹한 방패가 될 것이다.</li>
                        <li>너는 무방비하고 억압받는 모든 자들의 보호자가 될 것이다.</li>
                        <li>너는 조국 프랑크 강토를 헌신적으로 방위할 것이다.</li>
                        <li>너는 주군에 대한 맹세와 약조를 결코 거스르지 않을 것이다.</li>
                        <li>너는 부도덕한 이교 세력의 기만적 제안에 절대 야합하지 않을 것이다.</li>
                        <li>너는 주의 공명정대한 정의를 행하되 사리사욕을 앞세우지 않을 것이다.</li>
                        <li>너는 패배하여 자비를 구하는 약자에게 반드시 관용을 베풀 것이다.</li>
                        <li>너는 타인을 기만하지 않고 항상 진실을 말할 것이다.</li>
                        <li>너는 모든 위업에 대적하여 항상 전설적인 명예를 갈고닦을 것이다.</li>
                      </ol>
                    </div>
                  </section>

                  <section className="cs-section">
                    <div style={{ padding: '14px', border: '1px solid var(--color-gold-light)', background: '#fffefb' }}>
                      <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>
                        👑 성기사의 3대 이상 (Three Knightly Ideals)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--color-ink)' }}>⚔️ 기사도적 기사 (Chivalrous Knight)</strong>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                            - 요구치: Energetic, Generous, Just, Merciful, Modest, Valorous 합산 90점 이상 / Honor 열망 16점 이상<br />
                            - 보너스: Inspired 시 전투 2배 (+10 / 대성공 +20), 상시 <strong>+3 invisible 아머</strong> (Divine Aid), 매년 100 Glory
                          </p>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--color-ink)' }}>✝ 신앙적인 기사 (Religious Knight)</strong>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                            - 요구치: Chaste, Forgiving, Merciful, Modest, Temperate, Trusting 합산 90점 이상 / Love [God] 16점 이상<br />
                            - 보너스: 모든 <strong>기도(Prayer) 및 기적 판정에 +5</strong> 절대 보너스, 매년 100 Glory
                          </p>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--color-ink)' }}>🌹 낭만적인 기사 (Romantic Knight)</strong>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-light)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                            - 요구치: Forgiving, Generous, Honest, Just, Prudent, Trusting 합산 90점 이상 / Amor [Lady] 16점 이상<br />
                            - 보너스: Inspired 시 전투 2배 (+10 / 대성공 +20), 매 세션 <strong>1회 주사위 재굴림</strong> 찬스, 매년 100 Glory
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Stewardship and Trial by Ordeal Tables */}
                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <section className="cs-section">
                    <div style={{ padding: '14px', border: '1px solid var(--color-gold-light)', background: '#fffefb' }}>
                      <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>
                        🌾 장원 연간 세입 및 수확 판정 (Stewardship Table)
                      </h4>
                      <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left', lineHeight: 1.4 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-gold-light)', color: 'var(--color-gold-dark)' }}>
                            <th style={{ padding: '4px 0', fontWeight: 'bold' }}>Stewardship 판정 결과</th>
                            <th style={{ padding: '4px 0', fontWeight: 'bold', textAlign: 'right' }}>장원 재무 소득 변화</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(179,143,67,0.08)' }}>
                            <td style={{ padding: '6px 0', fontWeight: 'bold', color: 'var(--color-crimson)' }}>대성공 (Critical Success)</td>
                            <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-crimson)' }}>풍작 소득 보너스 획득 (+£2)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(179,143,67,0.08)' }}>
                            <td style={{ padding: '6px 0' }}>성공 (Success)</td>
                            <td style={{ padding: '6px 0', textAlign: 'right' }}>정상 장원 소득 수금 (£6)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(179,143,67,0.08)' }}>
                            <td style={{ padding: '6px 0' }}>실패 (Failure)</td>
                            <td style={{ padding: '6px 0', textAlign: 'right' }}>정상 소득 수금 (£6), 단 농민 갈등 발생</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px 0', fontWeight: 'bold', color: 'var(--color-grey)' }}>대실패 (Fumble)</td>
                            <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-grey)' }}>기근 / 역병 대손실 (-£2) &amp; 농민 폭동</td>
                          </tr>
                        </tbody>
                      </table>
                      <p style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic', marginTop: '6px', marginBottom: 0 }}>
                        * 기사 캐릭터가 Stewardship 판정 시 절대 "대실패 (Fumble)"는 일어나지 않으며, 영주로서 가뭄이나 기근의 재해를 맞이할 경우 극단적 실패는 반드시 "대실패"로 간주되어 농노 관리에 패널티를 받습니다.
                      </p>
                    </div>
                  </section>

                  <section className="cs-section">
                    <div style={{ padding: '14px', border: '1px solid var(--color-gold-light)', background: '#fffefb' }}>
                      <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px', borderBottom: '1px solid rgba(179,143,67,0.15)', paddingBottom: '4px' }}>
                        ⚖️ 신명 재판 사법 판정 (Trial by Ordeal Table)
                      </h4>
                      <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left', lineHeight: 1.4 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-gold-light)', color: 'var(--color-gold-dark)' }}>
                            <th style={{ padding: '4px 0', fontWeight: 'bold' }}>신명 재판 종류</th>
                            <th style={{ padding: '4px 0', fontWeight: 'bold' }}>요구 판정 (Roll)</th>
                            <th style={{ padding: '4px 0', fontWeight: 'bold', textAlign: 'right' }}>실패 시 결과</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(179,143,67,0.08)' }}>
                            <td style={{ padding: '6px 0', fontWeight: 'bold' }}>뜨거운 철판 쥐기 (Hot Iron)</td>
                            <td style={{ padding: '6px 0' }}><strong>CON x 3</strong> 판정</td>
                            <td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--color-crimson)' }}>3d6 HP 소실 &amp; 유죄 교수형</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(179,143,67,0.08)' }}>
                            <td style={{ padding: '6px 0', fontWeight: 'bold' }}>끓는 물 손 넣기 (Boiling Water)</td>
                            <td style={{ padding: '6px 0' }}><strong>CON x 2</strong> 판정</td>
                            <td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--color-crimson)' }}>3d6 HP 소실 &amp; 유죄 교수형</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px 0', fontWeight: 'bold' }}>찬물 잠수 (Cold Water)</td>
                            <td style={{ padding: '6px 0' }}><strong>CON x 5</strong> 판정</td>
                            <td style={{ padding: '6px 0', textAlign: 'right', color: 'var(--color-crimson)' }}>가라앉으면 무죄, 뜨면 유죄 처형</td>
                          </tr>
                        </tbody>
                      </table>
                      <p style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic', marginTop: '6px', marginBottom: 0 }}>
                        * 신성 결투(Trial by Combat) 시, 피고나 원고 중 결투 판정에서 대실패(Fumble)를 범하는 쪽은 칼이 부러지거나 하느님이 거짓을 벌하시는 즉각 유죄 처분을 받고 참형을 당합니다.
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FRANKISH NAME GENERATOR TAB (Appendix I) */}
      {activeSubTab === 'names' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left Column: Interactive Generator */}
          <section className="cs-section" style={{ flex: '1 1 350px' }}>
            <div className="sheet-ribbon">
              <h3>🎲 실시간 프랑크 이름 생성기 (Appendix I)</h3>
            </div>
            <div className="cs-section-inner" style={{ background: '#fffefb', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-light)', lineHeight: 1.5 }}>
                프랑크인의 전통적인 작명 방식인 <strong>접두사(Prefix)와 접미사(Suffix)</strong>를 결합하여 나만의 고유한 기사단원 이름을 작명합니다.
              </p>

              {/* Gender Selector Toggle */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '12px' }}>
                <button
                  className="btn-medieval"
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '0.85rem',
                    background: genGender === 'male' ? 'var(--color-crimson)' : 'none',
                    color: genGender === 'male' ? '#fff' : 'var(--color-ink-light)',
                    border: genGender === 'male' ? '1px solid var(--color-crimson)' : '1px solid var(--color-grey-light)'
                  }}
                  onClick={() => { setGenGender('male'); generateRandomName('male'); }}
                >
                  🛡️ 남성명 (Male)
                </button>
                <button
                  className="btn-medieval"
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '0.85rem',
                    background: genGender === 'female' ? 'var(--color-crimson)' : 'none',
                    color: genGender === 'female' ? '#fff' : 'var(--color-ink-light)',
                    border: genGender === 'female' ? '1px solid var(--color-crimson)' : '1px solid var(--color-grey-light)'
                  }}
                  onClick={() => { setGenGender('female'); generateRandomName('female'); }}
                >
                  🌹 여성명 (Female)
                </button>
              </div>

              {/* Generated Name Display */}
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #fdfbf7 0%, #f5ecd5 100%)', 
                  border: '2.5px solid var(--color-gold)', 
                  borderRadius: '6px', 
                  padding: '20px 10px', 
                  textAlign: 'center', 
                  boxShadow: '0 4px 10px rgba(201,168,76,0.15), inset 0 0 10px rgba(201,168,76,0.1)'
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '6px' }}>
                  📜 생성된 프랑크 전사의 서사적 명칭
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-crimson)', fontFamily: 'var(--font-serif)', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                  {generatedName.en}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-ink)', marginTop: '4px', fontFamily: 'var(--font-korean-serif)' }}>
                  {generatedName.ko}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-medieval" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => generateRandomName()}
                >
                  <Shuffle size={14} /> 🎲 무작위 자동 조합
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--color-grey-light)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--color-grey)', lineHeight: 1.5 }}>
                • <strong>접두사 예시:</strong> Adal (고결한), Agil (무기), Bald (담대한), Dag (낮/빛)<br />
                • <strong>접미사 예시:</strong> bert (밝은), hard (강인한), wulf (늑대), berga (보호자)
              </div>
            </div>
          </section>

          {/* Right Column: Name Equivalents Dictionary */}
          <section className="cs-section" style={{ flex: '1.3 1 450px' }}>
            <div className="sheet-ribbon">
              <h3>📜 현대 이름 - 역사적 프랑크어 동의어 대조표</h3>
            </div>
            <div className="cs-section-inner" style={{ padding: '12px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', marginBottom: '10px' }}>
                현대의 영문 이름이 12세기 프랑크 무공시 및 중세 사료(라틴어/고대 불어)에서 어떤 영광스러운 대조 이름으로 사용되는지 열람하세요.
              </p>
              
              <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid var(--color-grey-light)', borderRadius: '4px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-gold-light)', borderBottom: '1.5px solid var(--color-gold)' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-ink)' }}>현대 영어명</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-ink)' }}>중세 문헌명 (Equivalents)</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-ink)' }}>한국어 번역 대치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquivalents.map((e, idx) => (
                      <tr 
                        key={idx} 
                        style={{ 
                          borderBottom: '1px solid #eee', 
                          background: idx % 2 === 0 ? '#fdfdfd' : '#fffef9'
                        }}
                      >
                        <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>{e.en}</td>
                        <td style={{ padding: '8px', color: 'var(--color-crimson)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                          {e.equivalents.join(', ')}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--color-ink-light)' }}>{e.ko}</td>
                      </tr>
                    ))}
                    {filteredEquivalents.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic' }}>
                          검색어와 매칭되는 대치 이름이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 5. RECOMMEND BIBLIOGRAPHY & EPICS TAB (Appendix II) */}
      {activeSubTab === 'bibliography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top description */}
          <div style={{ border: '1px dashed var(--color-gold)', padding: '12px 16px', borderRadius: '4px', background: 'rgba(179,143,67,0.03)' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-crimson)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📚 카롤링거 기사 전설 권장 도서 및 문헌 해설 (Appendix II)
            </h4>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: 'var(--color-ink-light)', lineHeight: 1.5 }}>
              본 companion app의 깊은 고증 배경이 되는 샤를마뉴 제국의 역사서(Einhard의 전기 등)와 중세 시대의 매혹적인 기사도 대서사시(무공시 - Chansons de Geste) 목록을 완벽하게 열람할 수 있는 학술 아카이브입니다.
            </p>
          </div>

          <div className="cs-row" style={{ gap: '20px', alignItems: 'flex-start' }}>
            {/* Left side: Major and Minor Epics */}
            <div style={{ flex: '1.2 1 450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Major Epics */}
              <section className="cs-section">
                <div className="sheet-ribbon">
                  <h3>⚔️ 8대 핵심 기사도 대서사시 (Major Epics)</h3>
                </div>
                <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredMajorEpics.map((epic, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        paddingLeft: '12px', 
                        background: '#fffefb',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-grey-light)',
                        borderLeft: '3px solid var(--color-gold)'
                      }}
                    >
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.92rem', color: 'var(--color-crimson)', fontWeight: 'bold' }}>{epic.title}</h4>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic', marginBottom: '4px' }}>{epic.details}</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-ink)', lineHeight: 1.4 }}>{epic.desc}</p>
                    </div>
                  ))}
                  {filteredMajorEpics.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '10px 0' }}>검색 매칭 결과가 없습니다.</p>
                  )}
                </div>
              </section>

              {/* Minor Epics */}
              <section className="cs-section">
                <div className="sheet-ribbon">
                  <h3>🛡️ 방계 기사 무공시 및 전설 (Minor Epics)</h3>
                </div>
                <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredMinorEpics.map((epic, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        paddingLeft: '12px', 
                        background: '#fffdfd',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-grey-light)',
                        borderLeft: '3px solid var(--color-royal-blue)'
                      }}
                    >
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold' }}>{epic.title}</h4>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic', marginBottom: '4px' }}>{epic.details}</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-ink-light)', lineHeight: 1.4 }}>{epic.desc}</p>
                    </div>
                  ))}
                  {filteredMinorEpics.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '10px 0' }}>검색 매칭 결과가 없습니다.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Right side: Historical studies & Chronicles */}
            <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <section className="cs-section">
                <div className="sheet-ribbon">
                  <h3>📜 역사자료 및 역사 연구 (Carolingian Studies)</h3>
                </div>
                <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredStudies.map((study, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        paddingLeft: '12px', 
                        background: '#fffdfa',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-grey-light)',
                        borderLeft: '3px solid #6a1b9a'
                      }}
                    >
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.88rem', color: '#6a1b9a', fontWeight: 'bold' }}>{study.title}</h4>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-grey)', fontStyle: 'italic', marginBottom: '4px' }}>
                        {study.author} &bull; {study.details}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-ink)', lineHeight: 1.4 }}>{study.desc}</p>
                    </div>
                  ))}
                  {filteredStudies.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '10px 0' }}>검색 매칭 결과가 없습니다.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
