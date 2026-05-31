import React from 'react';

const traitList = [
  { key1: "chaste", label1: "정숙", key2: "lustful", label2: "음탕", sym: "✝♥" },
  { key1: "energetic", label1: "열정", key2: "lazy", label2: "나태", sym: "⦿" },
  { key1: "forgiving", label1: "관용", key2: "vengeful", label2: "복수", sym: "✝♥" },
  { key1: "generous", label1: "관대", key2: "selfish", label2: "이기", sym: "⦿♥" },
  { key1: "honest", label1: "정직", key2: "deceitful", label2: "기만", sym: "⦿♥" },
  { key1: "just", label1: "정의", key2: "arbitrary", label2: "독단", sym: "⦿" },
  { key1: "merciful", label1: "자비", key2: "cruel", label2: "잔혹", sym: "⦿✝" },
  { key1: "modest", label1: "겸손", key2: "proud", label2: "오만", sym: "⦿✝" },
  { key1: "pious", label1: "경건", key2: "worldly", label2: "세속", sym: "✝⦿" },
  { key1: "prudent", label1: "신중", key2: "reckless", label2: "무모", sym: "♥" },
  { key1: "temperate", label1: "절제", key2: "indulgent", label2: "방종", sym: "✝" },
  { key1: "trusting", label1: "신뢰", key2: "suspicious", label2: "의심", sym: "✝♥" },
  { key1: "valorous", label1: "용맹", key2: "cowardly", label2: "겁쟁이", sym: "⦿" }
];

const commonSkills = [
  { key: "awareness", label: "경계" }, { key: "chirurgery", label: "의술" },
  { key: "faerieLore", label: "요정 전설" }, { key: "firstAid", label: "응급처치" },
  { key: "folkLore", label: "민간 전설" }, { key: "horsemanship", label: "마술" },
  { key: "hunting", label: "수렵" }, { key: "industry", label: "근면" },
  { key: "recognize", label: "신분 식별" }, { key: "religion", label: "종교 지식" },
  { key: "stewardship", label: "영지 관리" }, { key: "swimming", label: "수영" }
];

const courtlySkills = [
  { key: "courtesy", label: "예의" }, { key: "dancing", label: "무용" },
  { key: "eloquence", label: "웅변" }, { key: "falconry", label: "매사냥" },
  { key: "gaming", label: "유희" }, { key: "heraldry", label: "문장학" },
  { key: "intrigue", label: "음모" }, { key: "playInstruments", label: "악기 연주" },
  { key: "readingWriting", label: "독서 및 집필" }, { key: "romance", label: "로맨스" },
  { key: "singing", label: "가창" }
];

const weaponSkills = [
  { key: "sword", label: "검" }, { key: "lance", label: "마창" },
  { key: "axe", label: "도끼" }, { key: "spear", label: "창 / 폴암" },
  { key: "dagger", label: "단검" }, { key: "bludgeon", label: "둔기" },
  { key: "unarmed", label: "맨손 격투" }
];

const personalFields = [
  { key: 'name', label: '기사 이름', cat: 'personal' },
  { key: 'age', label: '나이', cat: 'personal', type: 'number' },
  { key: 'sonNumber', label: '자녀 서열', cat: 'personal' },
  { key: 'blessing', label: '성스러운 축복', cat: 'personal' },
  { key: 'homeland', label: '고향/출신지', cat: 'personal' },
  { key: 'home', label: '영지/거처', cat: 'personal' },
  { key: 'culture', label: '문화권', cat: 'personal' },
  { key: 'lineage', label: '가문/혈통', cat: 'personal' },
  { key: 'liegeLord', label: '섬기는 주군', cat: 'personal' },
  { key: 'fathersClass', label: '부친의 계급', cat: 'personal' },
  { key: 'personalClass', label: '기사의 신분', cat: 'personal' },
];

const passions = [
  { key: "loyaltyLiege", label: "주군에 대한 충성 (Loyalty)", defaultVal: 15 },
  { key: "loveFamily", label: "가족에 대한 사랑 (Love Family)", defaultVal: 15 },
  { key: "hospitality", label: "손대접 및 환대 (Hospitality)", defaultVal: 15 },
  { key: "honor", label: "기사의 명예 (Honor)", defaultVal: 16 },
  { key: "hateSarasens", label: "이교도에 대한 증오 (Hate Saracens)", defaultVal: 12 },
  { key: "loveGod", label: "신에 대한 사랑 (Love God)", defaultVal: 15 },
  { key: "amor", label: "Amor [연인에 대한 로맨스]", defaultVal: 0 }
];

export default function CharacterSheet({ character, setCharacter }) {
  const handleInputChange = (category, field, value) => {
    setCharacter(prev => {
      const updated = { ...prev };
      if (category) {
        updated[category] = { ...updated[category], [field]: value };
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  const handleTraitChange = (traitName, oppositeName, value) => {
    const numValue = Math.min(20, Math.max(0, parseInt(value) || 0));
    const oppositeValue = 20 - numValue;
    setCharacter(prev => ({
      ...prev,
      traits: { ...(prev?.traits || {}), [traitName]: numValue, [oppositeName]: oppositeValue }
    }));
  };

  // Calculated stats
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
  const currentHp = character?.attributes?.currentHp || 0;
  const hpPercent = maxHP > 0 ? Math.max(0, Math.min(100, (currentHp / maxHP) * 100)) : 0;

  // 1. Chivalrous Knight: Energetic, Generous, Just, Merciful, Modest, Valorous (Total >= 90 & Honor >= 16)
  const chivalrousTraitsTotal =
    (character?.traits?.energetic || 0) + (character?.traits?.generous || 0) +
    (character?.traits?.just || 0) + (character?.traits?.merciful || 0) +
    (character?.traits?.modest || 0) + (character?.traits?.valorous || 0);
  const honorVal = parseInt(character?.passions?.honor) || 0;
  const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;

  // 2. Religious Knight: Chaste, Forgiving, Merciful, Modest, Temperate, Trusting (Total >= 90 & Love[God] >= 16)
  const religiousTraitsTotal =
    (character?.traits?.chaste || 0) + (character?.traits?.forgiving || 0) +
    (character?.traits?.merciful || 0) + (character?.traits?.modest || 0) +
    (character?.traits?.temperate || 0) + (character?.traits?.trusting || 0);
  const loveGodVal = parseInt(character?.passions?.loveGod) || 0;
  const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;

  // 3. Romantic Knight: Forgiving, Generous, Honest, Just, Prudent, Trusting (Total >= 90 & Amor >= 16 & Romance skill >= 10 & 4 other courtly skills >= 10)
  const romanticTraitsTotal =
    (character?.traits?.forgiving || 0) + (character?.traits?.generous || 0) +
    (character?.traits?.honest || 0) + (character?.traits?.just || 0) +
    (character?.traits?.prudent || 0) + (character?.traits?.trusting || 0);

  const romanceVal = character?.skills?.romance || 0;
  const otherCourtlySkillsOver10 = courtlySkills
    .filter(s => s.key !== 'romance')
    .filter(s => (character?.skills?.[s.key] || 0) >= 10)
    .length;
  const hasRequiredCourtlySkills = romanceVal >= 10 && otherCourtlySkillsOver10 >= 4;
  const amorVal = parseInt(character?.passions?.amor) || 0;
  const isRomanticActive = romanticTraitsTotal >= 90 && amorVal >= 16 && hasRequiredCourtlySkills;

  // 4. Standings Base values auto-calculated
  const baseStandings = {
    charlemagne: Math.min(
      character?.traits?.energetic || 0,
      character?.traits?.generous || 0,
      character?.traits?.just || 0,
      character?.traits?.merciful || 0,
      character?.traits?.modest || 0,
      character?.traits?.valorous || 0
    ),
    liegeLord: character?.traits?.valorous || 0,
    family: honorVal,
    retinue: character?.traits?.generous || 0,
    church: loveGodVal,
    commoners: character?.traits?.merciful || 0
  };

  const standingsList = [
    { key: "charlemagne", label: "황제 샤를마뉴 (Charlemagne)", base: baseStandings.charlemagne },
    { key: "liegeLord", label: "섬기는 주군 (Liege Lord)", base: baseStandings.liegeLord },
    { key: "family", label: "가문 가계 (Family)", base: baseStandings.family },
    { key: "retinue", label: "종자 및 시종단 (Retinue)", base: baseStandings.retinue },
    { key: "church", label: "성 교회 (The Church)", base: baseStandings.church },
    { key: "commoners", label: "영지 평민단 (Commoners)", base: baseStandings.commoners }
  ];

  // Data arrays are declared at module scope level

  const SkillRow = ({ skill, category = 'skills' }) => (
    <div className="cs-skill-row">
      <span className="cs-skill-name">{skill.label}</span>
      <span className="cs-skill-val">
        <div className="cs-num-ctrl">
          <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('skills', skill.key, Math.max(0, (character?.skills?.[skill.key] || 0) - 1))}>−</button>
          <input type="number" value={character?.skills?.[skill.key] || 0}
            onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} />
          <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('skills', skill.key, (character?.skills?.[skill.key] || 0) + 1)}>+</button>
        </div>
      </span>
      <input type="checkbox" className="exp-checkbox"
        checked={character?.skillsChecked?.[skill.key] || false}
        onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)} />
    </div>
  );

  // Personal fields are declared at module scope level

  const attrList = [
    { key: 'siz', label: '체구', abbr: 'SIZ', note: `넉다운 ${knockdown}` },
    { key: 'dex', label: '민첩', abbr: 'DEX' },
    { key: 'str', label: '근력', abbr: 'STR' },
    { key: 'con', label: '체질', abbr: 'CON', note: `중상 ${majorWound}` },
    { key: 'app', label: '외모', abbr: 'APP' },
  ];

  // Passions are declared at module scope level

  return (
    <div className="cs-page view-animate">

      {/* ══════ PERSONAL DATA ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>기사 인적 사항</h3></div>
        <div className="cs-section-inner">
          <div className="cs-field-grid">
            {personalFields.map(f => (
              <div className="cs-field" key={f.key}>
                <span className="cs-field-label">{f.label}:</span>
                <input type={f.type || 'text'}
                  value={f.type === 'number' ? (character?.personal?.[f.key] || 0) : (character?.personal?.[f.key] || '')}
                  onChange={e => handleInputChange('personal', f.key, f.type === 'number' ? (parseInt(e.target.value) || 0) : e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ ATTRIBUTES (Stat Blocks) ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>주요 능력치</h3></div>
        <div className="cs-section-inner">
          <div className="cs-attr-row">
            {attrList.map(attr => (
              <div className="cs-attr-block" key={attr.key}>
                <span className="cs-attr-abbr">{attr.abbr}</span>
                <span className="cs-attr-label">{attr.label}</span>
                <input type="number" value={character?.attributes?.[attr.key] || 0}
                  onChange={e => handleInputChange('attributes', attr.key, parseInt(e.target.value) || 0)} />
                <div className="cs-attr-actions">
                  <button type="button" className="cs-attr-btn" 
                    onClick={() => handleInputChange('attributes', attr.key, Math.max(0, (character?.attributes?.[attr.key] || 0) - 1))}>−</button>
                  <button type="button" className="cs-attr-btn" 
                    onClick={() => handleInputChange('attributes', attr.key, (character?.attributes?.[attr.key] || 0) + 1)}>+</button>
                </div>
                {attr.note && <span className="cs-attr-note">{attr.note}</span>}
              </div>
            ))}
          </div>

          {/* Derived Stats */}
          <div className="cs-derived-strip">
            <div className="cs-derived-item">
              <span className="cs-derived-label">피해량</span>
              <span className="cs-derived-value">{calculatedDamage}d6</span>
            </div>
            <div className="cs-derived-item">
              <span className="cs-derived-label">치유력</span>
              <span className="cs-derived-value">{calculatedHealing}</span>
            </div>
            <div className="cs-derived-item">
              <span className="cs-derived-label">이동</span>
              <span className="cs-derived-value">{calculatedMove}</span>
            </div>
            <div className="cs-derived-item cs-derived-hp">
              <span className="cs-derived-label">최대 HP</span>
              <span className="cs-derived-value">{maxHP}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HP + GLORY (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>현재 체력</h3></div>
          <div className="cs-section-inner">
            <div className="cs-hp-panel">
              <div className="cs-hp-main">
                <span style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '0.95rem' }}>HP</span>
                <input type="number" value={currentHp} max={maxHP}
                  onChange={e => handleInputChange('attributes', 'currentHp', Math.min(maxHP, parseInt(e.target.value) || 0))} />
                <span style={{ fontSize: '1.1rem', color: 'var(--color-grey)' }}>/ {maxHP}</span>
              </div>
              <div className="cs-hp-bar">
                <div className="cs-hp-bar-fill" style={{ width: `${hpPercent}%` }} />
              </div>
              <div className="cs-hp-thresholds">
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.75 ? 'active' : ''}`}>
                  ⦿ 3/4 [{Math.round(maxHP * 0.75)}] -5
                </span>
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.5 ? 'active' : ''}`}>
                  ⦿ 1/2 [{Math.round(maxHP * 0.5)}] -10
                </span>
                <span className={`cs-hp-threshold ${currentHp <= maxHP * 0.25 ? 'active' : ''}`}>
                  ⦿ 1/4 [{Math.round(maxHP * 0.25)}] 의식불명
                </span>
                <span className={`cs-hp-threshold ${currentHp <= 0 ? 'active' : ''}`} style={{ color: 'var(--color-danger)' }}>
                  ✝ 사망 위험
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section">
          <div className="sheet-ribbon"><h3>영예 (Glory)</h3></div>
          <div className="cs-section-inner">
            <div className="cs-glory-row">
              <div className="cs-glory-item">
                <label>이번 세션</label>
                <input type="number" value={character?.gear?.gloryThisGame || 0}
                  onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
              </div>
              <div className="cs-glory-item cs-glory-total">
                <label>누적 총합</label>
                <input type="number" value={character?.gear?.gloryTotal || 0}
                  onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Shield mini */}
          <div className="cs-shield-wrap">
            <div className="shield-container" style={{ width: '140px', height: '170px', maxWidth: '140px' }}>
              <div className="shield-text" style={{ fontSize: '1rem' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--color-crimson)', marginBottom: '4px' }}>❖</div>
                <div style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>가문의 문장</div>
                <div style={{ fontSize: '0.6rem', marginTop: '3px', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>
                  {character?.family?.name || "아르덴"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════ PERSONALITY TRAITS ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>성향 및 도덕률</h3></div>
        <div className="cs-section-inner">
          {/* Bonus indicators */}
          <div className="cs-bonus-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span className={`cs-bonus-item ${isChivalrousActive ? 'active' : ''}`}>
              ⦿ 기사도 [{chivalrousTraitsTotal}/90] {isChivalrousActive ? '★ +3 아머 (Divine Aid)' : ''}
            </span>
            <span className={`cs-bonus-item ${isReligiousActive ? 'active' : ''}`}>
              ✝ 신앙심 [{religiousTraitsTotal}/90] {isReligiousActive ? '★ +5 기도 보너스' : ''}
            </span>
            <span className={`cs-bonus-item ${isRomanticActive ? 'active' : ''}`} style={{ borderColor: isRomanticActive ? '#4a148c' : 'inherit', backgroundColor: isRomanticActive ? 'rgba(74,20,140,0.06)' : 'inherit', color: isRomanticActive ? '#4a148c' : 'inherit' }}>
              🌹 로맨스 [{romanticTraitsTotal}/90] {isRomanticActive ? '★ 1회 주사위 재굴림' : ''}
            </span>
          </div>

          <table className="cs-trait-table">
            <tbody>
              {traitList.map(t => (
                <tr key={t.key1}>
                  <td className="cs-trait-sym">{t.sym}</td>
                  <td className="cs-trait-name">{t.label1}</td>
                  <td className="cs-trait-val">
                    <div className="cs-num-ctrl mini">
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key1, t.key2, Math.max(0, (character?.traits?.[t.key1] || 0) - 1))}>−</button>
                      <input type="number" value={character?.traits?.[t.key1] || 0}
                        onChange={e => handleTraitChange(t.key1, t.key2, e.target.value)} />
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key1, t.key2, Math.min(20, (character?.traits?.[t.key1] || 0) + 1))}>+</button>
                    </div>
                  </td>
                  <td className="cs-trait-divider">/</td>
                  <td className="cs-trait-val">
                    <div className="cs-num-ctrl mini">
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key2, t.key1, Math.max(0, (character?.traits?.[t.key2] || 0) - 1))}>−</button>
                      <input type="number" value={character?.traits?.[t.key2] || 0}
                        onChange={e => handleTraitChange(t.key2, t.key1, e.target.value)} />
                      <button type="button" className="cs-ctrl-btn" onClick={() => handleTraitChange(t.key2, t.key1, Math.min(20, (character?.traits?.[t.key2] || 0) + 1))}>+</button>
                    </div>
                  </td>
                  <td className="cs-trait-name-right">{t.label2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════ PASSIONS + STANDINGS (side by side) ══════ */}
      <div className="cs-row">
        {/* Passions */}
        <section className="cs-section" style={{ flex: '1' }}>
          <div className="sheet-ribbon"><h3>기사의 열망 (Passions)</h3></div>
          <div className="cs-section-inner">
            {passions.map(p => (
              <div className="cs-passion-row" key={p.key}>
                <input type="checkbox" className="exp-checkbox"
                  checked={character?.passionsChecked?.[p.key] || false}
                  onChange={e => handleInputChange('passionsChecked', p.key, e.target.checked)} />
                <span className="cs-passion-name">{p.label}</span>
                <span className="cs-skill-val">
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const val = character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal;
                      handleInputChange('passions', p.key, Math.max(0, val - 1));
                    }}>−</button>
                    <input type="number"
                      value={character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal}
                      onChange={e => handleInputChange('passions', p.key, parseInt(e.target.value) || 0)} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const val = character?.passions?.[p.key] !== undefined ? character?.passions?.[p.key] : p.defaultVal;
                      handleInputChange('passions', p.key, val + 1);
                    }}>+</button>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Standings */}
        <section className="cs-section" style={{ flex: '1' }}>
          <div className="sheet-ribbon"><h3>사회적 명망 &amp; 신분 (Standings)</h3></div>
          <div className="cs-section-inner">
            {standingsList.map(s => (
              <div className="cs-passion-row" key={s.key}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="cs-passion-name" style={{ fontWeight: 'bold' }}>{s.label}</span>
                    <span className="cs-skill-val">
                      <div className="cs-num-ctrl">
                        <button type="button" className="cs-ctrl-btn" onClick={() => {
                          const val = character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base;
                          handleInputChange('standings', s.key, Math.max(0, val - 1));
                        }}>−</button>
                        <input type="number"
                          value={character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base}
                          onChange={e => handleInputChange('standings', s.key, parseInt(e.target.value) || 0)} />
                        <button type="button" className="cs-ctrl-btn" onClick={() => {
                          const val = character?.standings?.[s.key] !== undefined ? character?.standings?.[s.key] : s.base;
                          handleInputChange('standings', s.key, val + 1);
                        }}>+</button>
                      </div>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-grey)', textAlign: 'right', marginTop: '4px' }}>
                    공식 산출 기준: {s.base}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ══════ SKILLS: Common + Courtly (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>기본 모험 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {commonSkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>궁정 예법 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {courtlySkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
      </div>

      {/* ══════ COMBAT SKILLS + WEAPONS (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>전투 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              <SkillRow skill={{ key: 'battle', label: '전술 (Battle)' }} />
              <SkillRow skill={{ key: 'siege', label: '공성 (Siege)' }} />
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>무기 기술</h3></div>
          <div className="cs-section-inner">
            <div className="cs-skill-list">
              {weaponSkills.map(s => <SkillRow key={s.key} skill={s} />)}
            </div>
          </div>
        </section>
      </div>

      {/* ══════ DISTINCTIVE FEATURES ══════ */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>외형적 특징</h3></div>
        <div className="cs-section-inner">
          <div className="cs-feature-list">
            {[0, 1, 2].map(i => (
              <input key={i} type="text"
                value={character?.personal?.features?.[i] || ''}
                onChange={e => {
                  const arr = [...(character?.personal?.features || ['', '', ''])];
                  arr[i] = e.target.value;
                  handleInputChange('personal', 'features', arr);
                }}
                placeholder={['1. 예: 왼쪽 뺨의 흉터', '2. 예: 날카로운 벽안', '3. 예: 크고 날씬한 체형'][i]} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SQUIRE + HORSE (side by side) ══════ */}
      <div className="cs-row">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>종자 (Squire)</h3></div>
          <div className="cs-section-inner">
            <div className="cs-companion-fields">
              <div className="cs-companion-row">
                <div className="cs-companion-field" style={{ flex: '2 1 140px' }}>
                  <label>이름:</label>
                  <input type="text" value={character?.squire?.name || ''}
                    onChange={e => handleInputChange('squire', 'name', e.target.value)} />
                </div>
                <div className="cs-companion-field" style={{ flex: '1 1 80px' }}>
                  <label>나이:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('squire', 'age', Math.max(0, (character?.squire?.age || 0) - 1))}>−</button>
                    <input type="number" value={character?.squire?.age || 0}
                      onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => handleInputChange('squire', 'age', (character?.squire?.age || 0) + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>전투마 (Charger)</h3></div>
          <div className="cs-section-inner">
            <div className="cs-companion-fields">
              <div className="cs-companion-row">
                <div className="cs-companion-field">
                  <label>HP:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), hp: Math.max(0, (character?.horses?.warhorse?.hp || 0) - 1) };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>−</button>
                    <input type="number" value={character?.horses?.warhorse?.hp || 0}
                      onChange={e => {
                        const updated = { ...(character?.horses?.warhorse || {}), hp: parseInt(e.target.value) || 0 };
                        handleInputChange('horses', 'warhorse', updated);
                      }} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), hp: (character?.horses?.warhorse?.hp || 0) + 1 };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>+</button>
                  </div>
                </div>
                <div className="cs-companion-field">
                  <label>방어:</label>
                  <div className="cs-num-ctrl">
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), armor: Math.max(0, (character?.horses?.warhorse?.armor || 0) - 1) };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>−</button>
                    <input type="number" value={character?.horses?.warhorse?.armor || 0}
                      onChange={e => {
                        const updated = { ...(character?.horses?.warhorse || {}), armor: parseInt(e.target.value) || 0 };
                        handleInputChange('horses', 'warhorse', updated);
                      }} />
                    <button type="button" className="cs-ctrl-btn" onClick={() => {
                      const updated = { ...(character?.horses?.warhorse || {}), armor: (character?.horses?.warhorse?.armor || 0) + 1 };
                      handleInputChange('horses', 'warhorse', updated);
                    }}>+</button>
                  </div>
                </div>
                <div className="cs-companion-field">
                  <label>피해:</label>
                  <input type="text" value={character?.horses?.warhorse?.damage || ''}
                    onChange={e => {
                      const updated = { ...(character?.horses?.warhorse || {}), damage: e.target.value };
                      handleInputChange('horses', 'warhorse', updated);
                    }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
