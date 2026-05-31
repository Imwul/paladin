import React, { useState } from 'react';
import { greatFamilies, soloScenarios } from '../data/lore';
import { Shield, Book, Compass, Search, ChevronRight, HelpCircle, Award } from 'lucide-react';
import ProperNoun from './ProperNoun';

export default function LoreEncyclopedia() {
  const [activeSubTab, setActiveSubTab] = useState('families');
  const [selectedFamily, setSelectedFamily] = useState(greatFamilies[0]);
  const [selectedScenario, setSelectedScenario] = useState(soloScenarios[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFamilies = greatFamilies.filter(f =>
    f.nameKO.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.backgroundKO.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScenarios = soloScenarios.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rules.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cs-page view-animate">
      
      {/* Tutorial Header Banner */}
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">🏛️ 제국 백과사전 (Carolingian Encyclopedia)</h4>
          <p>샤를마뉴 대제 시대의 8대 명가 설정과 룰북 후반부의 솔로 시나리오 공식 행동 규칙을 열람하세요.</p>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px', marginBottom: '16px' }}>
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
      </div>

      {/* Search Input Bar (only shown for filtering lists) */}
      {activeSubTab !== 'feudal' && (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-grey)' }} />
          <input 
            type="text" 
            placeholder={activeSubTab === 'families' ? "가문 이름 또는 키워드로 검색..." : "시나리오 이름 또는 규칙 검색..."}
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

    </div>
  );
}
