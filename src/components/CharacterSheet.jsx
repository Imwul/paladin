import React from 'react';
import ProperNoun from './ProperNoun';

export default function CharacterSheet({ character, setCharacter }) {
  // Input change helper
  const handleInputChange = (category, field, value) => {
    setCharacter(prev => {
      const updated = { ...prev };
      if (category) {
        updated[category] = { 
          ...updated[category], 
          [field]: value 
        };
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  // Trait modification helper (opposing traits total 20)
  const handleTraitChange = (traitName, oppositeName, value) => {
    const numValue = Math.min(20, Math.max(0, parseInt(value) || 0));
    const oppositeValue = 20 - numValue;

    setCharacter(prev => {
      const updatedTraits = { 
        ...(prev?.traits || {}), 
        [traitName]: numValue, 
        [oppositeName]: oppositeValue 
      };
      return {
        ...prev,
        traits: updatedTraits
      };
    });
  };

  // Safe Core calculated stats with optional chaining and fallbacks
  const str = parseInt(character?.attributes?.str) || 0;
  const siz = parseInt(character?.attributes?.siz) || 0;
  const dex = parseInt(character?.attributes?.dex) || 0;
  const con = parseInt(character?.attributes?.con) || 0;
  const app = parseInt(character?.attributes?.app) || 0;

  const calculatedDamage = Math.floor((str + siz) / 6);
  const calculatedHealing = Math.round((str + con) / 10);
  const calculatedMove = Math.round((str + dex) / 10);
  const maxHP = siz + con;
  const knockdown = siz;
  const majorWound = con;

  // Safe Chivalrous / Religious / Romantic Bonus checks
  const chivalrousTraitsTotal = 
    (character?.traits?.chaste || 0) +
    (character?.traits?.forgiving || 0) +
    (character?.traits?.generous || 0) +
    (character?.traits?.honest || 0) +
    (character?.traits?.prudent || 0) +
    (character?.traits?.trusting || 0) +
    (character?.traits?.valorous || 0);
  const honorVal = parseInt(character?.passions?.honor) || 0;
  const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;

  const religiousTraitsTotal =
    (character?.traits?.chaste || 0) +
    (character?.traits?.forgiving || 0) +
    (character?.traits?.merciful || 0) +
    (character?.traits?.modest || 0) +
    (character?.traits?.pious || 0);
  const loveGodVal = parseInt(character?.passions?.loveGod) || 0;
  const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;

  const romanticTraitsTotal =
    (character?.traits?.generous || 0) +
    (character?.traits?.honest || 0) +
    (character?.traits?.just || 0) +
    (character?.traits?.merciful || 0) +
    (character?.traits?.modest || 0) +
    (character?.traits?.trusting || 0);
  const isRomanticActive = romanticTraitsTotal >= 90;

  // 13 Opposing Traits with official rulebook symbols
  const traitList = [
    { key1: "chaste", label1: "정숙", key2: "lustful", label2: "음탕", sym: "✝ ♥" },
    { key1: "energetic", label1: "열정", key2: "lazy", label2: "나태", sym: "⦿" },
    { key1: "forgiving", label1: "관용", key2: "vengeful", label2: "복수", sym: "✝ ♥" },
    { key1: "generous", label1: "관대", key2: "selfish", label2: "이기", sym: "⦿ ♥" },
    { key1: "honest", label1: "정직", key2: "deceitful", label2: "기만", sym: "⦿ ♥" },
    { key1: "just", label1: "정의", key2: "arbitrary", label2: "독단", sym: "⦿" },
    { key1: "merciful", label1: "자비", key2: "cruel", label2: "잔혹", sym: "⦿ ✝" },
    { key1: "modest", label1: "겸손", key2: "proud", label2: "오만", sym: "⦿ ✝" },
    { key1: "pious", label1: "경건", key2: "worldly", label2: "세속", sym: "✝ ⦿" },
    { key1: "prudent", label1: "신중", key2: "reckless", label2: "무모", sym: "♥" },
    { key1: "temperate", label1: "절제", key2: "indulgent", label2: "방종", sym: "✝" },
    { key1: "trusting", label1: "신뢰", key2: "suspicious", label2: "의심", sym: "✝ ♥" },
    { key1: "valorous", label1: "용맹", key2: "cowardly", label2: "겁쟁이", sym: "⦿" }
  ];

  const commonSkills = [
    { key: "awareness", label: "경계" },
    { key: "chirurgery", label: "의술" },
    { key: "faerieLore", label: "요정 전설" },
    { key: "firstAid", label: "응급처치" },
    { key: "folkLore", label: "민간 전설" },
    { key: "horsemanship", label: "마술" },
    { key: "hunting", label: "수렵" },
    { key: "industry", label: "근면" },
    { key: "recognize", label: "신분 식별" },
    { key: "religion", label: "종교 지식" },
    { key: "stewardship", label: "영지 관리" },
    { key: "swimming", label: "수영" }
  ];

  const courtlySkills = [
    { key: "courtesy", label: "예의" },
    { key: "dancing", label: "무용" },
    { key: "eloquence", label: "웅변" },
    { key: "falconry", label: "매사냥" },
    { key: "gaming", label: "유희" },
    { key: "heraldry", label: "문장학" },
    { key: "intrigue", label: "음모" },
    { key: "playInstruments", label: "악기 연주" },
    { key: "readingWriting", label: "독서 및 집필" },
    { key: "romance", label: "로맨스" },
    { key: "singing", label: "가창" }
  ];

  return (
    <div className="view-animate" style={{ width: '100%' }}>
      
      {/* 3-Column Original Character Sheet Grid */}
      <div className="official-sheet-grid">
        
        {/* COLUMN 1: Personal Data & Personality Traits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Section: Personal Data */}
          <div className="sheet-ribbon">
            <h3>기사 인적 사항</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div className="form-group-row">
              <span className="form-label">기사 이름:</span>
              <input type="text" className="form-input" value={character?.personal?.name || ""} onChange={e => handleInputChange('personal', 'name', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">나이:</span>
                <input type="number" className="form-input" value={character?.personal?.age || 0} onChange={e => handleInputChange('personal', 'age', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group-row" style={{ flex: 2 }}>
                <span className="form-label">자녀 서열:</span>
                <input type="text" className="form-input" value={character?.personal?.sonNumber || ""} onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)} />
              </div>
            </div>
            <div className="form-group-row">
              <span className="form-label">성스러운 축복:</span>
              <input type="text" className="form-input" value={character?.personal?.blessing || ""} onChange={e => handleInputChange('personal', 'blessing', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">고향/출신지:</span>
                <input type="text" className="form-input" value={character?.personal?.homeland || ""} onChange={e => handleInputChange('personal', 'homeland', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">영지/거처:</span>
                <input type="text" className="form-input" value={character?.personal?.home || ""} onChange={e => handleInputChange('personal', 'home', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">문화권:</span>
                <input type="text" className="form-input" value={character?.personal?.culture || ""} onChange={e => handleInputChange('personal', 'culture', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">가문/혈통:</span>
                <input type="text" className="form-input" value={character?.personal?.lineage || ""} onChange={e => handleInputChange('personal', 'lineage', e.target.value)} />
              </div>
            </div>
            <div className="form-group-row">
              <span className="form-label">섬기는 주군:</span>
              <input type="text" className="form-input" value={character?.personal?.liegeLord || ""} onChange={e => handleInputChange('personal', 'liegeLord', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">부친의 계급:</span>
                <input type="text" className="form-input" value={character?.personal?.fathersClass || ""} onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">기사의 신분:</span>
                <input type="text" className="form-input" value={character?.personal?.personalClass || ""} onChange={e => handleInputChange('personal', 'personalClass', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section: Personality Traits */}
          <div className="sheet-ribbon">
            <h3>성향 및 도덕률</h3>
          </div>

          {/* Bonus status indicators */}
          <div style={{ fontSize: '1.05rem', color: 'var(--color-ink)', lineHeight: '1.5', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 14px', backgroundColor: 'rgba(144, 27, 27, 0.04)', border: '1px solid var(--color-gold-light)', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isChivalrousActive ? 'var(--color-crimson)' : 'var(--color-ink-light)', fontWeight: isChivalrousActive ? '800' : '500' }}>
              <span style={{ fontSize: '1.08rem' }}>⚆ 기사도 보너스 [{chivalrousTraitsTotal}/90]:</span>
              <span style={{ color: isChivalrousActive ? 'var(--color-crimson)' : 'var(--color-grey)', fontWeight: 'bold' }}>{isChivalrousActive ? '★ 활성 (+3 아머)' : '비활성'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isReligiousActive ? 'var(--color-crimson)' : 'var(--color-ink-light)', fontWeight: isReligiousActive ? '800' : '500', borderTop: '1px dashed var(--color-gold-light)', paddingTop: '5px' }}>
              <span style={{ fontSize: '1.08rem' }}>✝ 신앙심 보너스 [{religiousTraitsTotal}/90]:</span>
              <span style={{ color: isReligiousActive ? 'var(--color-crimson)' : 'var(--color-grey)', fontWeight: 'bold' }}>{isReligiousActive ? '★ 활성 (+5 기도)' : '비활성'}</span>
            </div>
          </div>

          {/* Traits list — official sheet style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {traitList.map(trait => (
              <div key={trait.key1} style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr auto auto auto auto',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
                borderBottom: '1px solid rgba(195,161,101,0.12)'
              }}>
                {/* Symbol */}
                <span style={{ fontSize: '1.4rem', color: 'var(--color-crimson)', fontWeight: 'bold', lineHeight: 1 }}>
                  {trait.sym}
                </span>
                {/* Left label */}
                <span style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--color-ink)' }}>{trait.label1}</span>
                {/* Left value */}
                <input type="number" className="form-input" style={{ width: '44px', height: '32px', fontSize: '1.25rem', textAlign: 'center', borderBottomColor: 'var(--color-crimson)', fontWeight: 'bold', padding: '2px 4px' }} value={character?.traits?.[trait.key1] || 0} onChange={e => handleTraitChange(trait.key1, trait.key2, e.target.value)} />
                {/* Divider */}
                <span style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '1.1rem', padding: '0 2px' }}>/</span>
                {/* Right value */}
                <input type="number" className="form-input" style={{ width: '44px', height: '32px', fontSize: '1.25rem', textAlign: 'center', borderBottomColor: 'var(--color-crimson)', fontWeight: 'bold', padding: '2px 4px' }} value={character?.traits?.[trait.key2] || 0} onChange={e => handleTraitChange(trait.key2, trait.key1, e.target.value)} />
                {/* Right label */}
                <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-ink-light)', width: '68px', textAlign: 'right' }}>{trait.label2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: Attributes, Distinctive Features & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Section: Attributes */}
          <div className="sheet-ribbon">
            <h3>주요 능력치</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold', width: '100px', flexShrink: 0 }}>체구 (SIZ):</span>
              <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character?.attributes?.siz || 0} onChange={e => handleInputChange('attributes', 'siz', parseInt(e.target.value) || 0)} />
              <span className="form-label" style={{ marginLeft: '10px', fontSize: '0.95rem', color: 'var(--color-grey)', flex: 1 }}>(넉다운 기준 {knockdown})</span>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold', width: '100px', flexShrink: 0 }}>민첩 (DEX):</span>
              <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character?.attributes?.dex || 0} onChange={e => handleInputChange('attributes', 'dex', parseInt(e.target.value) || 0)} />
              <span style={{ flex: 1 }}></span>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold', width: '100px', flexShrink: 0 }}>근력 (STR):</span>
              <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character?.attributes?.str || 0} onChange={e => handleInputChange('attributes', 'str', parseInt(e.target.value) || 0)} />
              <span style={{ flex: 1 }}></span>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold', width: '100px', flexShrink: 0 }}>체질 (CON):</span>
              <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character?.attributes?.con || 0} onChange={e => handleInputChange('attributes', 'con', parseInt(e.target.value) || 0)} />
              <span className="form-label" style={{ marginLeft: '10px', fontSize: '0.95rem', color: 'var(--color-grey)', flex: 1 }}>(중상 기준 {majorWound})</span>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold', width: '100px', flexShrink: 0 }}>외모 (APP):</span>
              <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character?.attributes?.app || 0} onChange={e => handleInputChange('attributes', 'app', parseInt(e.target.value) || 0)} />
              <span style={{ flex: 1 }}></span>
            </div>
            <div style={{ borderTop: '1px dashed var(--color-gold-light)', marginTop: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="sheet-line-item">
                <span className="form-label">기본 피해량 [(STR+SIZ)/6]:</span>
                <strong>{calculatedDamage}d6</strong>
              </div>
              <div className="sheet-line-item">
                <span className="form-label">자연 치유력 [(STR+CON)/10]:</span>
                <strong>{calculatedHealing}</strong>
              </div>
              <div className="sheet-line-item">
                <span className="form-label">이동 속도 [(STR+DEX)/10]:</span>
                <strong>{calculatedMove}</strong>
              </div>
              <div className="sheet-line-item" style={{ borderTop: '1.5px solid var(--color-crimson)', paddingTop: '4px' }}>
                <span className="form-label" style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>최대 체력 (SIZ+CON):</span>
                <strong style={{ color: 'var(--color-crimson)', fontSize: '1.1rem' }}>{maxHP}</strong>
              </div>
            </div>
          </div>

          {/* Section: Distinctive Features */}
          <div className="sheet-ribbon">
            <h3>외형적 특징</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ borderBottomStyle: 'dotted' }} 
              value={character?.personal?.features?.[0] || ""} 
              onChange={e => {
                const arr = [...(character?.personal?.features || ["", "", ""])];
                arr[0] = e.target.value;
                handleInputChange('personal', 'features', arr);
              }}
              placeholder="1. 예: 왼쪽 뺨의 흉터" 
            />
            <input 
              type="text" 
              className="form-input" 
              style={{ borderBottomStyle: 'dotted' }} 
              value={character?.personal?.features?.[1] || ""} 
              onChange={e => {
                const arr = [...(character?.personal?.features || ["", "", ""])];
                arr[1] = e.target.value;
                handleInputChange('personal', 'features', arr);
              }}
              placeholder="2. 예: 날카로운 벽안" 
            />
            <input 
              type="text" 
              className="form-input" 
              style={{ borderBottomStyle: 'dotted' }} 
              value={character?.personal?.features?.[2] || ""} 
              onChange={e => {
                const arr = [...(character?.personal?.features || ["", "", ""])];
                arr[2] = e.target.value;
                handleInputChange('personal', 'features', arr);
              }}
              placeholder="3. 예: 크고 날씬한 체형" 
            />
          </div>

          {/* Section: Skills (COMMON) */}
          <div className="sheet-ribbon">
            <h3>기본 모험 기술 — COMMON</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '16px' }}>
            {commonSkills.map(skill => (
              <div key={skill.key} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(195,161,101,0.18)',
                padding: '5px 0'
              }}>
                <span className="form-label" style={{ fontSize: '1.12rem', color: 'var(--color-ink)' }}>{skill.label}</span>
                <input type="number" className="form-input" style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem', borderBottomStyle: 'solid', borderBottomColor: 'var(--color-crimson)', fontWeight: '600' }} value={character?.skills?.[skill.key] || 0} onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[skill.key] || false} onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
              </div>
            ))}
          </div>

          {/* Section: Skills (COURTLY) */}
          <div className="sheet-ribbon">
            <h3>궁정 예법 기술 — COURTLY</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {courtlySkills.map(skill => (
              <div key={skill.key} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(195,161,101,0.18)',
                padding: '5px 0'
              }}>
                <span className="form-label" style={{ fontSize: '1.12rem', color: 'var(--color-ink)' }}>{skill.label}</span>
                <input type="number" className="form-input" style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem', borderBottomStyle: 'solid', borderBottomColor: 'var(--color-crimson)', fontWeight: '600' }} value={character?.skills?.[skill.key] || 0} onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[skill.key] || false} onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: Shield, Glory, Current Hit Points & Combat Skills */}
        <div className="sheet-column-3">
          
          {/* Sub-column 3A: Heraldry, Glory, and Passions */}
          <div className="sheet-subcolumn">
            {/* 가문 방패 문장 (Shield Emblem Frame) */}
            <div className="shield-container">
              <div className="shield-text">
                <div style={{ fontSize: '1.8rem', color: 'var(--color-crimson)', marginBottom: '8px' }}>❖</div>
                <div style={{ fontStyle: 'italic' }}>가문의 문장</div>
                <div style={{ fontSize: '0.72rem', marginTop: '5px', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>
                  {character?.family?.name || "아르덴 (Ardennes)"}
                </div>
              </div>
            </div>

            {/* Section: Glory */}
            <div className="sheet-ribbon">
              <h3>영예 (Glory)</h3>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">이번 세션:</span>
                <input type="number" className="form-input" style={{ textAlign: 'center' }} value={character?.gear?.gloryThisGame || 0} onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group-row" style={{ flex: 1.2 }}>
                <span className="form-label">누적 총합:</span>
                <input type="number" className="form-input" style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-crimson)' }} value={character?.gear?.gloryTotal || 0} onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
              </div>
            </div>

            {/* Section: Passions */}
            <div className="sheet-ribbon">
              <h3>기사의 열망 (Passions)</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              {[
                { key: "loyaltyLiege", label: "주군에 대한 충성", defaultVal: 15 },
                { key: "loveFamily", label: "가족에 대한 사랑", defaultVal: 15 },
                { key: "hospitality", label: "손대접 및 환대", defaultVal: 15 },
                { key: "honor", label: "기사의 명예", defaultVal: 16 },
                { key: "hateSarasens", label: "이교도에 대한 증오", defaultVal: 12 },
                { key: "loveGod", label: "신에 대한 사랑", defaultVal: 15 }
              ].map(passion => (
                <div key={passion.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" className="exp-checkbox" checked={character?.passionsChecked?.[passion.key] || false} onChange={e => handleInputChange('passionsChecked', passion.key, e.target.checked)} />
                  <span className="form-label" style={{ fontSize: '1.02rem', flex: 1 }}>{passion.label}</span>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ width: '50px', textAlign: 'center', borderBottomStyle: 'dotted' }} 
                    value={character?.passions?.[passion.key] !== undefined ? character?.passions?.[passion.key] : passion.defaultVal} 
                    onChange={e => handleInputChange('passions', passion.key, parseInt(e.target.value) || 0)} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sub-column 3B: Combat Stats, Squires, HP, and Combat/Weapon Skills */}
          <div className="sheet-subcolumn">
            {/* Section: Current Hit Points */}
            <div className="sheet-ribbon">
              <h3>현재 체력</h3>
            </div>
            <div style={{ border: '2px solid var(--color-crimson)', padding: '15px', position: 'relative', marginBottom: '20px', backgroundColor: 'rgba(144, 27, 27, 0.01)' }}>
              {/* BIG current hp entry */}
              <div className="form-group-row" style={{ marginBottom: '15px' }}>
                <span className="form-label" style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.05rem' }}>현재 HP:</span>
                <input type="number" className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '2.5px solid var(--color-crimson)' }} value={character?.attributes?.currentHp || 0} max={maxHP} onChange={e => handleInputChange('attributes', 'currentHp', Math.min(maxHP, parseInt(e.target.value) || 0))} />
              </div>

              {/* Wound Status list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.75 ? 1 : 0.4 }}>
                  <span className="trait-icon">⦿</span>
                  <span>체력 3/4 [ {Math.round(maxHP * 0.75)} ]</span>
                  <span style={{ color: 'var(--color-grey)', marginLeft: 'auto' }}>모든 판정 -5</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.5 ? 1 : 0.4 }}>
                  <span className="trait-icon">⦿</span>
                  <span>체력 1/2 [ {Math.round(maxHP * 0.5)} ]</span>
                  <span style={{ color: 'var(--color-grey)', marginLeft: 'auto' }}>모든 판정 -10</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.25 ? 1 : 0.4 }}>
                  <span className="trait-icon">⦿</span>
                  <span>체력 1/4 [ {Math.round(maxHP * 0.25)} ]</span>
                  <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold', marginLeft: 'auto' }}>의식 불명</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', fontWeight: 'bold', opacity: (character?.attributes?.currentHp || 0) <= 0 ? 1 : 0.3 }}>
                  <span className="trait-icon">✝</span>
                  <span>치료 요망! (사망 위험)</span>
                </div>
              </div>
            </div>

            {/* Section: Squire & Horses */}
            <div className="sheet-ribbon">
              <h3>종자 및 전투마</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', border: '1.5px dashed var(--color-gold)', padding: '16px', backgroundColor: 'rgba(195, 161, 101, 0.03)', borderRadius: '3px' }}>
              {/* Squire Sub-header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '6px', marginBottom: '4px' }}>
                <span className="form-label" style={{ fontWeight: 'bold', color: 'var(--color-crimson)', fontSize: '1.15rem' }}>종자 (Squire)</span>
              </div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="form-group-row" style={{ flex: '2 1 150px' }}>
                  <span className="form-label" style={{ fontSize: '1.05rem' }}>이름:</span>
                  <input type="text" className="form-input" style={{ fontSize: '1.15rem' }} value={character?.squire?.name || ""} onChange={e => handleInputChange('squire', 'name', e.target.value)} />
                </div>
                <div className="form-group-row" style={{ flex: '1 1 80px' }}>
                  <span className="form-label" style={{ fontSize: '1.05rem' }}>나이:</span>
                  <input type="number" className="form-input" style={{ fontSize: '1.15rem', textAlign: 'center' }} value={character?.squire?.age || 0} onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              
              {/* Horse Sub-header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '6px', marginTop: '10px', marginBottom: '4px' }}>
                <span className="form-label" style={{ fontWeight: 'bold', color: 'var(--color-crimson)', fontSize: '1.15rem' }}>전투마 (Charger)</span>
              </div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div className="form-group-row" style={{ flex: '1 1 90px' }}>
                  <span className="form-label" style={{ fontSize: '1.05rem' }}>체력(HP):</span>
                  <input type="number" className="form-input" style={{ fontSize: '1.15rem', textAlign: 'center' }} value={character?.horses?.warhorse?.hp || 0} onChange={e => {
                    const updatedWarhorse = { ...(character?.horses?.warhorse || {}), hp: parseInt(e.target.value) || 0 };
                    handleInputChange('horses', 'warhorse', updatedWarhorse);
                  }} />
                </div>
                <div className="form-group-row" style={{ flex: '1 1 90px' }}>
                  <span className="form-label" style={{ fontSize: '1.05rem' }}>방어력:</span>
                  <input type="number" className="form-input" style={{ fontSize: '1.15rem', textAlign: 'center' }} value={character?.horses?.warhorse?.armor || 0} onChange={e => {
                    const updatedWarhorse = { ...(character?.horses?.warhorse || {}), armor: parseInt(e.target.value) || 0 };
                    handleInputChange('horses', 'warhorse', updatedWarhorse);
                  }} />
                </div>
                <div className="form-group-row" style={{ flex: '1.2 1 110px' }}>
                  <span className="form-label" style={{ fontSize: '1.05rem' }}>피해량:</span>
                  <input type="text" className="form-input" style={{ fontSize: '1.15rem', textAlign: 'center' }} value={character?.horses?.warhorse?.damage || ""} onChange={e => {
                    const updatedWarhorse = { ...(character?.horses?.warhorse || {}), damage: e.target.value };
                    handleInputChange('horses', 'warhorse', updatedWarhorse);
                  }} />
                </div>
              </div>
            </div>

            {/* Section: Combat Skills */}
            <div className="sheet-ribbon">
              <h3>전투 기술</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(195,161,101,0.18)',
                padding: '5px 0'
              }}>
                <span className="form-label" style={{ fontSize: '1.12rem' }}>전술 (Battle)</span>
                <input type="number" className="form-input" style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem', borderBottomColor: 'var(--color-crimson)', fontWeight: '600' }} value={character?.skills?.battle || 0} onChange={e => handleInputChange('skills', 'battle', parseInt(e.target.value) || 0)} />
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.battle || false} onChange={e => handleInputChange('skillsChecked', 'battle', e.target.checked)} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(195,161,101,0.18)',
                padding: '5px 0'
              }}>
                <span className="form-label" style={{ fontSize: '1.12rem' }}>공성 (Siege)</span>
                <input type="number" className="form-input" style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem', borderBottomColor: 'var(--color-crimson)', fontWeight: '600' }} value={character?.skills?.siege || 0} onChange={e => handleInputChange('skills', 'siege', parseInt(e.target.value) || 0)} />
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.siege || false} onChange={e => handleInputChange('skillsChecked', 'siege', e.target.checked)} />
              </div>
            </div>

            {/* Sub Section: Melee Weapons */}
            <div className="sheet-ribbon" style={{ marginTop: '0' }}>
              <h3>무기 및 전투 기술</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {["sword", "lance", "axe", "spear", "dagger", "bludgeon", "unarmed"].map(weaponKey => {
                const label = weaponKey === "sword" ? "검" :
                              weaponKey === "lance" ? "마창" :
                              weaponKey === "axe" ? "도끼" :
                              weaponKey === "spear" ? "창 / 폴암" :
                              weaponKey === "dagger" ? "단검" :
                              weaponKey === "bludgeon" ? "둔기" :
                              "맨손 격투";
                return (
                  <div key={weaponKey} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid rgba(195,161,101,0.18)',
                    padding: '5px 0'
                  }}>
                    <span className="form-label" style={{ fontSize: '1.12rem' }}>{label}</span>
                    <input type="number" className="form-input" style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem', borderBottomColor: 'var(--color-crimson)', fontWeight: '600' }} value={character?.skills?.[weaponKey] || 0} onChange={e => handleInputChange('skills', weaponKey, parseInt(e.target.value) || 0)} />
                    <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[weaponKey] || false} onChange={e => handleInputChange('skillsChecked', weaponKey, e.target.checked)} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
