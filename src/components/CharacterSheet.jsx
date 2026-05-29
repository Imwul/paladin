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
    { key1: "chaste", label1: "Chaste (정숙)", key2: "lustful", label2: "Lustful (음탕)", sym: "✝ ♥" },
    { key1: "energetic", label1: "Energetic (열정)", key2: "lazy", label2: "Lazy (나태)", sym: "⦿" },
    { key1: "forgiving", label1: "Forgiving (관용)", key2: "vengeful", label2: "Vengeful (복수)", sym: "✝ ♥" },
    { key1: "generous", label1: "Generous (관대)", key2: "selfish", label2: "Selfish (이기)", sym: "⦿ ♥" },
    { key1: "honest", label1: "Honest (정직)", key2: "deceitful", label2: "Deceitful (기만)", sym: "⦿ ♥" },
    { key1: "just", label1: "Just (정의)", key2: "arbitrary", label2: "Arbitrary (독단)", sym: "⦿" },
    { key1: "merciful", label1: "Merciful (자비)", key2: "cruel", label2: "Cruel (잔혹)", sym: "⦿ ✝" },
    { key1: "modest", label1: "Modest (겸손)", key2: "proud", label2: "Proud (오만)", sym: "⦿ ✝" },
    { key1: "pious", label1: "Pious (경건)", key2: "worldly", label2: "Worldly (세속)", sym: "✝ ⦿" },
    { key1: "prudent", label1: "Prudent (신중)", key2: "reckless", label2: "Reckless (무모)", sym: "♥" },
    { key1: "temperate", label1: "Temperate (절제)", key2: "indulgent", label2: "Indulgent (방종)", sym: "✝" },
    { key1: "trusting", label1: "Trusting (신뢰)", key2: "suspicious", label2: "Suspicious (의심)", sym: "✝ ♥" },
    { key1: "valorous", label1: "Valorous (용맹)", key2: "cowardly", label2: "Cowardly (겁쟁이)", sym: "⦿" }
  ];

  const commonSkills = [
    { key: "awareness", label: "Awareness (경계)" },
    { key: "chirurgery", label: "Chirurgery (의술)" },
    { key: "faerieLore", label: "Faerie Lore (요정 전설)" },
    { key: "firstAid", label: "First Aid (응급처치)" },
    { key: "folkLore", label: "Folk Lore (민간 전설)" },
    { key: "horsemanship", label: "Horsemanship (마술)" },
    { key: "hunting", label: "Hunting (수렵)" },
    { key: "industry", label: "Industry (근면)" },
    { key: "recognize", label: "Recognize (신분 식별)" },
    { key: "religion", label: "Religion (종교 지식)" },
    { key: "stewardship", label: "Stewardship (영지 관리)" },
    { key: "swimming", label: "Swimming (수영)" }
  ];

  const courtlySkills = [
    { key: "courtesy", label: "Courtesy (예의)" },
    { key: "dancing", label: "Dancing (무용)" },
    { key: "eloquence", label: "Eloquence (웅변)" },
    { key: "falconry", label: "Falconry (매사냥)" },
    { key: "gaming", label: "Gaming (유희)" },
    { key: "heraldry", label: "Heraldry (문장학)" },
    { key: "intrigue", label: "Intrigue (음모)" },
    { key: "playInstruments", label: "Play Instruments (악기 연주)" },
    { key: "readingWriting", label: "Reading & Writing (독서 및 집필)" },
    { key: "romance", label: "Romance (로맨스)" },
    { key: "singing", label: "Singing (가창)" }
  ];

  return (
    <div className="view-animate" style={{ width: '100%' }}>
      
      {/* 3-Column Original Character Sheet Grid */}
      <div className="official-sheet-grid">
        
        {/* COLUMN 1: Personal Data & Personality Traits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Section: Personal Data */}
          <div className="sheet-ribbon">
            <h3>Personal Data</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div className="form-group-row">
              <span className="form-label">Name:</span>
              <input type="text" className="form-input" value={character?.personal?.name || ""} onChange={e => handleInputChange('personal', 'name', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Age:</span>
                <input type="number" className="form-input" value={character?.personal?.age || 0} onChange={e => handleInputChange('personal', 'age', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group-row" style={{ flex: 2 }}>
                <span className="form-label">Son Number:</span>
                <input type="text" className="form-input" value={character?.personal?.sonNumber || ""} onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)} />
              </div>
            </div>
            <div className="form-group-row">
              <span className="form-label">Blessing:</span>
              <input type="text" className="form-input" value={character?.personal?.blessing || ""} onChange={e => handleInputChange('personal', 'blessing', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Homeland:</span>
                <input type="text" className="form-input" value={character?.personal?.homeland || ""} onChange={e => handleInputChange('personal', 'homeland', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Home:</span>
                <input type="text" className="form-input" value={character?.personal?.home || ""} onChange={e => handleInputChange('personal', 'home', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Culture:</span>
                <input type="text" className="form-input" value={character?.personal?.culture || ""} onChange={e => handleInputChange('personal', 'culture', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Lineage:</span>
                <input type="text" className="form-input" value={character?.personal?.lineage || ""} onChange={e => handleInputChange('personal', 'lineage', e.target.value)} />
              </div>
            </div>
            <div className="form-group-row">
              <span className="form-label">Liege Lord:</span>
              <input type="text" className="form-input" value={character?.personal?.liegeLord || ""} onChange={e => handleInputChange('personal', 'liegeLord', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Father's Class:</span>
                <input type="text" className="form-input" value={character?.personal?.fathersClass || ""} onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label">Personal Class:</span>
                <input type="text" className="form-input" value={character?.personal?.personalClass || ""} onChange={e => handleInputChange('personal', 'personalClass', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section: Personality Traits */}
          <div className="sheet-ribbon">
            <h3>Personality Traits</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', lineHeight: '1.4', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: isChivalrousActive ? 'var(--color-crimson)' : 'inherit', fontWeight: isChivalrousActive ? 'bold' : 'normal' }}>
                <span>⦿ Chivalrous (기사도) [합산 {chivalrousTraitsTotal}/90]:</span>
                <span>{isChivalrousActive ? '★ 활성 (+3 아머)' : '비활성'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: isReligiousActive ? 'var(--color-crimson)' : 'inherit', fontWeight: isReligiousActive ? 'bold' : 'normal' }}>
                <span>✝ Religious (신앙) [합산 {religiousTraitsTotal}/90]:</span>
                <span>{isReligiousActive ? '★ 활성 (+5 기도)' : '비활성'}</span>
              </div>
            </div>

            {traitList.map(trait => (
              <div key={trait.key1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <span className="trait-icon" style={{ fontFamily: 'var(--font-english)', fontSize: '0.85rem', width: '28px', color: 'var(--color-crimson)', fontWeight: 'bold' }}>
                    {trait.sym}
                  </span>
                  <span className="form-label" style={{ fontSize: '0.92rem' }}>{trait.label1}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomColor: 'var(--color-gold)' }} value={character?.traits?.[trait.key1] || 0} onChange={e => handleTraitChange(trait.key1, trait.key2, e.target.value)} />
                  <span style={{ color: 'var(--color-grey-light)' }}>/</span>
                  <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomColor: 'var(--color-gold)' }} value={character?.traits?.[trait.key2] || 0} onChange={e => handleTraitChange(trait.key2, trait.key1, e.target.value)} />
                  <span className="form-label" style={{ fontSize: '0.92rem', width: '90px', textAlign: 'right' }}>{trait.label2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: Attributes, Distinctive Features & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Section: Attributes */}
          <div className="sheet-ribbon">
            <h3>Attributes</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold' }}>SIZ:</span>
              <div style={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
                <input type="number" className="form-input" style={{ maxWidth: '80px', textAlign: 'center' }} value={character?.attributes?.siz || 0} onChange={e => handleInputChange('attributes', 'siz', parseInt(e.target.value) || 0)} />
                <span className="form-label" style={{ marginLeft: '10px', fontSize: '0.85rem', color: 'var(--color-grey)' }}>(Knockdown {knockdown})</span>
              </div>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold' }}>DEX:</span>
              <input type="number" className="form-input" style={{ maxWidth: '80px', textAlign: 'center' }} value={character?.attributes?.dex || 0} onChange={e => handleInputChange('attributes', 'dex', parseInt(e.target.value) || 0)} />
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold' }}>STR:</span>
              <input type="number" className="form-input" style={{ maxWidth: '80px', textAlign: 'center' }} value={character?.attributes?.str || 0} onChange={e => handleInputChange('attributes', 'str', parseInt(e.target.value) || 0)} />
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold' }}>CON:</span>
              <div style={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
                <input type="number" className="form-input" style={{ maxWidth: '80px', textAlign: 'center' }} value={character?.attributes?.con || 0} onChange={e => handleInputChange('attributes', 'con', parseInt(e.target.value) || 0)} />
                <span className="form-label" style={{ marginLeft: '10px', fontSize: '0.85rem', color: 'var(--color-grey)' }}>(Major Wound {majorWound})</span>
              </div>
            </div>
            <div className="sheet-line-item">
              <span className="form-label" style={{ fontWeight: 'bold' }}>APP:</span>
              <input type="number" className="form-input" style={{ maxWidth: '80px', textAlign: 'center' }} value={character?.attributes?.app || 0} onChange={e => handleInputChange('attributes', 'app', parseInt(e.target.value) || 0)} />
            </div>
            <div style={{ borderTop: '1px dashed var(--color-gold-light)', marginTop: '10px', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="sheet-line-item">
                <span className="form-label">Damage [(STR+SIZ)/6]:</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedDamage}d6</strong>
              </div>
              <div className="sheet-line-item">
                <span className="form-label">Healing Rate [(STR+CON)/10]:</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedHealing}</strong>
              </div>
              <div className="sheet-line-item">
                <span className="form-label">Movement Rate [(STR+DEX)/10]:</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedMove}</strong>
              </div>
              <div className="sheet-line-item" style={{ borderTop: '1.5px solid var(--color-crimson)', paddingTop: '4px' }}>
                <span className="form-label" style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>Total Hit Points (SIZ+CON):</span>
                <strong style={{ fontFamily: 'var(--font-english)', color: 'var(--color-crimson)', fontSize: '1.1rem' }}>{maxHP}</strong>
              </div>
            </div>
          </div>

          {/* Section: Distinctive Features */}
          <div className="sheet-ribbon">
            <h3>Distinctive Features</h3>
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
              placeholder="1. e.g. Scar on left cheek" 
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
              placeholder="2. e.g. Piercing blue eyes" 
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
              placeholder="3. e.g. Tall and slender frame" 
            />
          </div>

          {/* Section: Skills (COMMON) */}
          <div className="sheet-ribbon">
            <h3>Skills - Common</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {commonSkills.map(skill => (
              <div key={skill.key} className="sheet-line-item">
                <span className="form-label" style={{ fontSize: '0.92rem' }}>{skill.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[skill.key] || false} onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
                  <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomStyle: 'dotted' }} value={character?.skills?.[skill.key] || 0} onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
                </div>
              </div>
            ))}
          </div>

          {/* Section: Skills (COURTLY) */}
          <div className="sheet-ribbon">
            <h3>Skills - Courtly</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {courtlySkills.map(skill => (
              <div key={skill.key} className="sheet-line-item">
                <span className="form-label" style={{ fontSize: '0.92rem' }}>{skill.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[skill.key] || false} onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
                  <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomStyle: 'dotted' }} value={character?.skills?.[skill.key] || 0} onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* COLUMN 3: Shield, Glory, Current Hit Points & Combat Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* 가문 방패 문장 (Shield Emblem Frame) */}
          <div className="shield-container">
            <div className="shield-text">
              <div style={{ fontSize: '1.8rem', color: 'var(--color-crimson)', marginBottom: '8px' }}>❖</div>
              <div style={{ fontStyle: 'italic' }}>Family Coat of Arms</div>
              <div style={{ fontSize: '0.72rem', marginTop: '5px', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>
                {character?.family?.name || "Ardennes"}
              </div>
            </div>
          </div>

          {/* Section: Glory */}
          <div className="sheet-ribbon">
            <h3>Glory</h3>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group-row" style={{ flex: 1 }}>
              <span className="form-label">This Game:</span>
              <input type="number" className="form-input" style={{ textAlign: 'center' }} value={character?.gear?.gloryThisGame || 0} onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group-row" style={{ flex: 1.2 }}>
              <span className="form-label">Total:</span>
              <input type="number" className="form-input" style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-crimson)' }} value={character?.gear?.gloryTotal || 0} onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Section: Passions */}
          <div className="sheet-ribbon">
            <h3>Passions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {[
              { key: "loyaltyLiege", label: "Loyalty (주군에 대한 충성)", defaultVal: 15 },
              { key: "loveFamily", label: "Love (가족에 대한 사랑)", defaultVal: 15 },
              { key: "hospitality", label: "Hospitality (손대접/환대)", defaultVal: 15 },
              { key: "honor", label: "Honor (기사의 명예)", defaultVal: 16 },
              { key: "hateSarasens", label: "Hate (이교도에 대한 증오)", defaultVal: 12 },
              { key: "loveGod", label: "Love (신에 대한 사랑)", defaultVal: 15 }
            ].map(passion => (
              <div key={passion.key} className="sheet-line-item">
                <span className="form-label" style={{ fontSize: '0.92rem' }}>{passion.label}</span>
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

          {/* Section: Squire & Horses */}
          <div className="sheet-ribbon">
            <h3>Squire & Horses</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', border: '1px dashed var(--color-gold)', padding: '12px', backgroundColor: 'rgba(195, 161, 101, 0.02)' }}>
            {/* Squire Sub-header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '4px', marginBottom: '4px' }}>
              <span className="form-label" style={{ fontWeight: 'bold', color: 'var(--color-crimson)' }}>종자 (Squire)</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group-row" style={{ flex: 2 }}>
                <span className="form-label" style={{ fontSize: '0.85rem' }}>이름:</span>
                <input type="text" className="form-input" style={{ fontSize: '0.9rem' }} value={character?.squire?.name || ""} onChange={e => handleInputChange('squire', 'name', e.target.value)} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label" style={{ fontSize: '0.85rem' }}>나이:</span>
                <input type="number" className="form-input" style={{ fontSize: '0.9rem', textAlign: 'center' }} value={character?.squire?.age || 0} onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            
            {/* Horse Sub-header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '4px', marginTop: '8px', marginBottom: '4px' }}>
              <span className="form-label" style={{ fontWeight: 'bold', color: 'var(--color-crimson)' }}>전투마 (Charger)</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label" style={{ fontSize: '0.85rem' }}>체력(HP):</span>
                <input type="number" className="form-input" style={{ fontSize: '0.9rem', textAlign: 'center' }} value={character?.horses?.warhorse?.hp || 0} onChange={e => {
                  const updatedWarhorse = { ...(character?.horses?.warhorse || {}), hp: parseInt(e.target.value) || 0 };
                  handleInputChange('horses', 'warhorse', updatedWarhorse);
                }} />
              </div>
              <div className="form-group-row" style={{ flex: 1 }}>
                <span className="form-label" style={{ fontSize: '0.85rem' }}>아머:</span>
                <input type="number" className="form-input" style={{ fontSize: '0.9rem', textAlign: 'center' }} value={character?.horses?.warhorse?.armor || 0} onChange={e => {
                  const updatedWarhorse = { ...(character?.horses?.warhorse || {}), armor: parseInt(e.target.value) || 0 };
                  handleInputChange('horses', 'warhorse', updatedWarhorse);
                }} />
              </div>
              <div className="form-group-row" style={{ flex: 1.2 }}>
                <span className="form-label" style={{ fontSize: '0.85rem' }}>피해량:</span>
                <input type="text" className="form-input" style={{ fontSize: '0.9rem', textAlign: 'center' }} value={character?.horses?.warhorse?.damage || ""} onChange={e => {
                  const updatedWarhorse = { ...(character?.horses?.warhorse || {}), damage: e.target.value };
                  handleInputChange('horses', 'warhorse', updatedWarhorse);
                }} />
              </div>
            </div>
          </div>

          {/* Section: Current Hit Points */}
          <div className="sheet-ribbon">
            <h3>Current Hit Points</h3>
          </div>
          <div style={{ border: '2px solid var(--color-crimson)', padding: '15px', position: 'relative', marginBottom: '20px', backgroundColor: 'rgba(144, 27, 27, 0.01)' }}>
            
            {/* BIG current hp entry */}
            <div className="form-group-row" style={{ marginBottom: '15px' }}>
              <span className="form-label" style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.05rem' }}>Current HP:</span>
              <input type="number" className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-crimson)', borderBottom: '2.5px solid var(--color-crimson)' }} value={character?.attributes?.currentHp || 0} max={maxHP} onChange={e => handleInputChange('attributes', 'currentHp', Math.min(maxHP, parseInt(e.target.value) || 0))} />
            </div>

            {/* Wound Status list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.75 ? 1 : 0.4 }}>
                <span className="trait-icon">⦿</span>
                <span>3/4 HP [ {Math.round(maxHP * 0.75)} ]</span>
                <span style={{ color: 'var(--color-grey)', marginLeft: 'auto' }}>-5 to Actions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.5 ? 1 : 0.4 }}>
                <span className="trait-icon">⦿</span>
                <span>1/2 HP [ {Math.round(maxHP * 0.5)} ]</span>
                <span style={{ color: 'var(--color-grey)', marginLeft: 'auto' }}>-10 to Actions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (character?.attributes?.currentHp || 0) <= maxHP * 0.25 ? 1 : 0.4 }}>
                <span className="trait-icon">⦿</span>
                <span>1/4 HP [ {Math.round(maxHP * 0.25)} ]</span>
                <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold', marginLeft: 'auto' }}>Unconscious</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', fontWeight: 'bold', opacity: (character?.attributes?.currentHp || 0) <= 0 ? 1 : 0.3 }}>
                <span className="trait-icon">✝</span>
                <span>Chirurgery Needed! (사망위험)</span>
              </div>
            </div>
          </div>

          {/* Section: Combat Skills */}
          <div className="sheet-ribbon">
            <h3>Combat Skills</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
            <div className="sheet-line-item">
              <span className="form-label">Battle (전술)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.battle || false} onChange={e => handleInputChange('skillsChecked', 'battle', e.target.checked)} />
                <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomStyle: 'dotted' }} value={character?.skills?.battle || 0} onChange={e => handleInputChange('skills', 'battle', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="sheet-line-item">
              <span className="form-label">Siege (공성)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.siege || false} onChange={e => handleInputChange('skillsChecked', 'siege', e.target.checked)} />
                <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomStyle: 'dotted' }} value={character?.skills?.siege || 0} onChange={e => handleInputChange('skills', 'siege', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Sub Section: Melee Weapons */}
          <div style={{ borderLeft: '2.5px solid var(--color-crimson)', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-crimson)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05rem' }}>Melee Weapons (근접 무기)</span>
            
            {["sword", "lance", "axe", "spear", "dagger", "bludgeon", "unarmed"].map(weaponKey => {
              const label = weaponKey === "sword" ? "Sword (검)" :
                            weaponKey === "lance" ? "Lance (마창)" :
                            weaponKey === "axe" ? "Axe (도끼)" :
                            weaponKey === "spear" ? "Spear & Polearm (창)" :
                            weaponKey === "dagger" ? "Dagger (단검)" :
                            weaponKey === "bludgeon" ? "Bludgeon (둔기)" :
                            "Unarmed (맨손)";
              return (
                <div key={weaponKey} className="sheet-line-item">
                  <span className="form-label" style={{ fontSize: '0.9rem' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" className="exp-checkbox" checked={character?.skillsChecked?.[weaponKey] || false} onChange={e => handleInputChange('skillsChecked', weaponKey, e.target.checked)} />
                    <input type="number" className="form-input" style={{ width: '40px', textAlign: 'center', borderBottomStyle: 'dotted' }} value={character?.skills?.[weaponKey] || 0} onChange={e => handleInputChange('skills', weaponKey, parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
