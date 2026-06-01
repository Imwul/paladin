import React, { useState } from 'react';
import { greatFamilies, soloScenarios, gazetteer, bestiary, bibliography } from '../data/lore';
import { Shield, Book, Compass, Search, ChevronRight, HelpCircle, Award, Globe, Skull, Sparkles, Shuffle, RefreshCw } from 'lucide-react';
import ProperNoun from './ProperNoun';
import { frankishMalePrefixes, frankishMaleSuffixes, frankishFemalePrefixes, frankishFemaleSuffixes, nameEquivalents } from '../data/names';

export default function LoreEncyclopedia() {
  const [activeSubTab, setActiveSubTab] = useState('families');
  const [selectedFamily, setSelectedFamily] = useState(greatFamilies[0]);
  const [selectedScenario, setSelectedScenario] = useState(soloScenarios[0]);
  const [selectedRegion, setSelectedRegion] = useState(gazetteer[0]);
  const [selectedMonster, setSelectedMonster] = useState(bestiary[0]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredGazetteer = gazetteer.filter(g =>
    g.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.rulerKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.historyKO.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="cs-page view-animate">
      {/* Tutorial Header Banner */}
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">🏛️ 제국 백과사전 (Carolingian Encyclopedia)</h4>
          <p>샤를마뉴 대제 시대의 8대 명가 및 제국 지리(Gazetteer), 전설의 괴수 및 야수(Bestiary)와 솔로 시나리오 공식을 열람하세요.</p>
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
              activeSubTab === 'gazetteer' ? "지역 영지 이름 또는 영주 검색..." :
              activeSubTab === 'bestiary' ? "괴수/야수 이름 또는 카테고리 검색..." :
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
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{f.crestSymbol.split('')[0] || '🛡️'}</span>
                  <strong style={{ fontSize: '0.95rem', color: selectedFamily?.key === f.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{f.nameKO}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{f.nameEN}</div>
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
                <span style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>{selectedFamily.crestSymbol}</span>
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
                    ({selectedFamily.crestDescEN})
                  </div>
                </div>

                {/* Motto */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📜 가훈 (Motto)</h4>
                  <p style={{ fontSize: '1.18rem', fontWeight: 'bold', color: 'var(--color-crimson)', fontFamily: 'var(--font-korean-serif)' }}>
                    &ldquo;{selectedFamily.mottoKO}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                    ({selectedFamily.mottoEN})
                  </p>
                </div>

                {/* Background Narrative */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '4px' }}>📖 역사 및 대가문 배경</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedFamily.backgroundKO}
                  </p>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontFamily: 'var(--font-korean-serif)', fontStyle: 'italic' }}>
                    {selectedFamily.backgroundEN}
                  </p>
                </div>

                {/* Traits & Modifiers */}
                <div style={{ borderTop: '1px solid var(--color-grey-light)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '6px' }}>⚖️ 혈통적 기질 및 권장 성향</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-crimson)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedFamily.traitsKO}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-grey)', marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
                    ({selectedFamily.traitsEN})
                  </p>
                </div>

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

      {/* 4. GAZETTEER TAB */}
      {activeSubTab === 'gazetteer' && (
        <div className="cs-row" style={{ alignItems: 'flex-start', gap: '20px' }}>
          {/* Left Side List */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-royal-blue)', borderBottom: '2px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '8px' }}>
              제국 주요 영지 일람
            </h3>
            {filteredGazetteer.map(g => (
              <div 
                key={g.key}
                onClick={() => setSelectedRegion(g)}
                style={{ 
                  padding: '12px', 
                  border: selectedRegion?.key === g.key ? '2px solid var(--color-gold)' : '1px solid var(--color-grey-light)',
                  borderRadius: '4px',
                  background: selectedRegion?.key === g.key ? 'rgba(179,143,67,0.06)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>{g.emoji}</span>
                  <strong style={{ fontSize: '0.95rem', color: selectedRegion?.key === g.key ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{g.nameKO.split(' (')[0]}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginTop: '2px' }}>{g.nameEN}</div>
                </div>
                <ChevronRight size={16} color="var(--color-gold)" />
              </div>
            ))}
            {filteredGazetteer.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-grey)', fontStyle: 'italic', padding: '20px 0' }}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/* Right Side Detail Reader */}
          {selectedRegion && (
            <section className="cs-section" style={{ flex: '2 1 450px' }}>
              <div className="sheet-ribbon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{selectedRegion.emoji} {selectedRegion.nameKO}</h3>
              </div>
              <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(179,143,67,0.01)' }}>
                
                {/* Ruler & Starting Passion info card */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>👑 통치자 (Ruler)</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>{selectedRegion.rulerKO}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-grey)' }}>{selectedRegion.rulerEN}</div>
                  </div>
                  <div style={{ border: '1px solid var(--color-gold-light)', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '2px' }}>❤️ 시작 열정 (Starting Passion)</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-crimson)', fontWeight: 'bold', fontFamily: 'var(--font-korean-serif)' }}>{selectedRegion.passionKO}</div>
                  </div>
                </div>

                {/* Cultural Modifiers Table */}
                <div style={{ border: '1px dashed var(--color-gold)', padding: '12px', borderRadius: '4px', background: 'rgba(179,143,67,0.03)' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-grey)', fontWeight: 'bold', marginBottom: '6px' }}>📊 지역 문화 보정치 (Cultural Skill &amp; Attribute Modifiers)</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedRegion.modifiers.map((m, idx) => (
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

                {/* History & Lore */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-royal-blue)', fontWeight: 'bold', marginBottom: '6px' }}>📖 영지 역사 및 지리 설정</h4>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-ink)', fontFamily: 'var(--font-korean-serif)' }}>
                    {selectedRegion.historyKO}
                  </p>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontFamily: 'var(--font-korean-serif)', fontStyle: 'italic' }}>
                    {selectedRegion.historyEN}
                  </p>
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
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-ink-light)', marginTop: '8px', borderLeft: '2px solid var(--color-grey-light)', paddingLeft: '8px', fontFamily: 'var(--font-korean-serif)', fontStyle: 'italic' }}>
                    {selectedMonster.loreEN}
                  </p>
                </div>

              </div>
            </section>
          )}
        </div>
      )}

      {/* 3. FEUDAL & HISTORICAL INFO TAB */}
      {activeSubTab === 'feudal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="cs-row" style={{ gap: '20px' }}>
            <section className="cs-section" style={{ flex: '1 1 350px' }}>
              <div className="sheet-ribbon"><h3>🛡️ 샤를마뉴 제국의 봉건제와 신분제</h3></div>
              <div className="cs-section-inner" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-ink)' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>봉신 기사 (Vassal Knight):</strong> 대공이나 백작 등의 대주군으로부터 직접 장원(Manor)을 하사받고 그 토지를 대부하여 다스리는 기사입니다. 매년 주군의 전쟁 소집에 응할 군역 의무(보통 40일)를 지며, 장원 관리를 성실히 수행하여 연평균 <strong>£6 상당의 유지비</strong>와 가문을 유지해야 합니다.
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>가신 기사 (Household Knight):</strong> 토지를 배분받지 못하고 주군의 직속 궁성이나 성곽에 상주하는 직업 군인 기사들입니다. 이들은 장원의 직접 수확이 없는 대신 주군이 제공하는 식사와 숙식, 마구 복지와 매년 일정한 수당을 받습니다. 결혼 자금이 부족하여 '독신 기사(Bas Chevalier / Bachelor)'로 남아있는 경우가 대다수입니다.
                </p>
                <p>
                  <strong>사령 전사단 (Scara / Scarae):</strong> 샤를마뉴가 직속 지휘권을 가진 특수 정예 기병 전단으로, 최정예 성기사들로만 구성된 상시 기동 국경 타격대입니다. 제국의 위기 시 가장 맹렬히 진격하는 칼끝입니다.
                </p>
              </div>
            </section>

            <section className="cs-section" style={{ flex: '1 1 350px' }}>
              <div className="sheet-ribbon"><h3>⚜️ 기사의 도덕률과 기사도 10계명</h3></div>
              <div className="cs-section-inner" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ fontStyle: 'italic', color: 'var(--color-grey)', marginBottom: '8px' }}>
                  &ldquo;프랑크 제국의 기사는 신앙과 조국을 지키며, 무고한 여성과 성 교회를 무력으로 유린하는 이교 세력에 맞서는 장엄한 임무를 받았다.&rdquo;
                </p>
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
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
          </div>

          <section className="cs-section">
            <div className="sheet-ribbon"><h3>📖 기사의 세 가지 원대한 이상 (Ideals)</h3></div>
            <div className="cs-section-inner">
              <div className="cs-row" style={{ gap: '20px' }}>
                <div style={{ flex: '1 1 230px', minWidth: 0, padding: '10px', border: '1px solid var(--color-gold-light)', background: 'rgba(179,143,67,0.03)' }}>
                  <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '6px' }}>⚔️ 기사도적 기사 (Chivalrous Knight)</h4>
                  <ul style={{ paddingLeft: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px', color: 'var(--color-ink-light)' }}>
                    <li><strong>요구 성향:</strong> Energetic, Generous, Just, Merciful, Modest, Valorous 합산 <strong>90점 이상</strong></li>
                    <li><strong>요구 열망:</strong> Honor <strong>16점 이상</strong></li>
                    <li><strong>보너스 혜택:</strong> Inspired for Honor 시 전투 보너스 2배 (+10 / 대성공 +20), 상시 <strong>+3 invisible 아머</strong> (Divine Aid), <strong>매년 100 Glory 획득</strong></li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 230px', minWidth: 0, padding: '10px', border: '1px solid var(--color-gold-light)', background: 'rgba(179,143,67,0.03)' }}>
                  <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '6px' }}>✝ 신앙적인 기사 (Religious Knight)</h4>
                  <ul style={{ paddingLeft: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px', color: 'var(--color-ink-light)' }}>
                    <li><strong>요구 성향:</strong> Chaste, Forgiving, Merciful, Modest, Temperate, Trusting 합산 <strong>90점 이상</strong></li>
                    <li><strong>요구 열망:</strong> Love [God] <strong>16점 이상</strong></li>
                    <li><strong>보너스 혜택:</strong> 모든 <strong>기도(Prayer) 및 기적 판정에 +5</strong> 절대 보너스, <strong>매년 100 Glory 획득</strong></li>
                  </ul>
                </div>
                <div style={{ flex: '1 1 230px', minWidth: 0, padding: '10px', border: '1px solid var(--color-gold-light)', background: 'rgba(179,143,67,0.03)' }}>
                  <h4 style={{ color: '#4a148c', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '6px' }}>🌹 낭만적인 기사 (Romantic Knight)</h4>
                  <ul style={{ paddingLeft: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px', color: 'var(--color-ink-light)' }}>
                    <li><strong>요구 성향:</strong> Forgiving, Generous, Honest, Just, Prudent, Trusting 합산 <strong>90점 이상</strong></li>
                    <li><strong>요구 열망:</strong> Amor [Lady] 또는 Love [Amor] <strong>16점 이상</strong></li>
                    <li><strong>요구 기술:</strong> Romance 10점 및 예법 기술 4종 10점 이상</li>
                    <li><strong>보너스 혜택:</strong> Inspired for Amor 시 전투 보너스 2배 (+10 / 대성공 +20), 매 세션 <strong>1회 주사위 재굴림</strong> 찬스, <strong>매년 100 Glory 획득</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
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
