import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { User, Activity, Swords, Users, Shield, Award, Sparkles, Heart } from 'lucide-react';

export default function CharacterSheet({ character, setCharacter }) {
  const [activeSection, setActiveSection] = useState('personal');

  // Input change handler for general nested paths
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

  // Trait modification helper (opposing traits total 20)
  const handleTraitChange = (traitName, oppositeName, value) => {
    const numValue = Math.min(20, Math.max(0, parseInt(value) || 0));
    const oppositeValue = 20 - numValue;

    setCharacter(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [traitName]: numValue,
        [oppositeName]: oppositeValue
      }
    }));
  };

  // Auto-calculated stats
  const str = parseInt(character.attributes.str) || 0;
  const siz = parseInt(character.attributes.siz) || 0;
  const dex = parseInt(character.attributes.dex) || 0;
  const con = parseInt(character.attributes.con) || 0;
  const app = parseInt(character.attributes.app) || 0;

  const calculatedDamage = Math.floor((str + siz) / 6);
  const calculatedHealing = Math.round((str + con) / 10);
  const calculatedMove = Math.round((str + dex) / 10);
  const maxHP = siz + con;
  const knockdown = siz;
  const majorWound = con;

  // Chivalrous / Religious / Romantic Bonus checks
  // 1. Chivalrous: Chaste, Forgiving, Generous, Honest, Prudent, Trusting, Valorous total >= 90, Honor >= 16
  const chivalrousTraitsTotal = 
    (character.traits.chaste || 0) +
    (character.traits.forgiving || 0) +
    (character.traits.generous || 0) +
    (character.traits.honest || 0) +
    (character.traits.prudent || 0) +
    (character.traits.trusting || 0) +
    (character.traits.valorous || 0);
  const honorVal = parseInt(character.passions.honor) || 0;
  const isChivalrousActive = chivalrousTraitsTotal >= 90 && honorVal >= 16;

  // 2. Religious: Chaste, Forgiving, Merciful, Modest, Pious total >= 90, Love [God] >= 16
  const religiousTraitsTotal =
    (character.traits.chaste || 0) +
    (character.traits.forgiving || 0) +
    (character.traits.merciful || 0) +
    (character.traits.modest || 0) +
    (character.traits.pious || 0);
  const loveGodVal = parseInt(character.passions.loveGod) || 0;
  const isReligiousActive = religiousTraitsTotal >= 90 && loveGodVal >= 16;

  // 3. Romantic: Generous, Honest, Just, Merciful, Modest, Trusting total >= 90
  const romanticTraitsTotal =
    (character.traits.generous || 0) +
    (character.traits.honest || 0) +
    (character.traits.just || 0) +
    (character.traits.merciful || 0) +
    (character.traits.modest || 0) +
    (character.traits.trusting || 0);
  const isRomanticActive = romanticTraitsTotal >= 90;

  // Skill checklist categories
  const commonSkills = [
    { key: "awareness", label: "경계 (Awareness)" },
    { key: "chirurgery", label: "의술 (Chirurgery)" },
    { key: "faerieLore", label: "요정 전설 (Faerie Lore)" },
    { key: "firstAid", label: "응급처치 (First Aid)" },
    { key: "folkLore", label: "민간 전설 (Folk Lore)" },
    { key: "horsemanship", label: "마술 (Horsemanship)" },
    { key: "hunting", label: "수렵 (Hunting)" },
    { key: "industry", label: "근면 (Industry)" },
    { key: "recognize", label: "신분 식별 (Recognize)" },
    { key: "religion", label: "종교 지식 (Religion)" },
    { key: "stewardship", label: "영지 관리 (Stewardship)" },
    { key: "swimming", label: "수영 (Swimming)" }
  ];

  const courtlySkills = [
    { key: "courtesy", label: "예의 (Courtesy)" },
    { key: "dancing", label: "무용 (Dancing)" },
    { key: "eloquence", label: "웅변 (Eloquence)" },
    { key: "falconry", label: "매사냥 (Falconry)" },
    { key: "gaming", label: "유희 (Gaming)" },
    { key: "heraldry", label: "문장학 (Heraldry)" },
    { key: "intrigue", label: "음모 (Intrigue)" },
    { key: "playInstruments", label: "악기 연주 (Play Instruments)" },
    { key: "readingWriting", label: "독서 및 집필 (Reading & Writing)" },
    { key: "romance", label: "로맨스 (Romance)" },
    { key: "singing", label: "가창 (Singing)" }
  ];

  const combatSkills = [
    { key: "battle", label: "전술 (Battle)" },
    { key: "siege", label: "공성전 (Siege)" },
    { key: "axe", label: "도끼 (Axe)" },
    { key: "bludgeon", label: "둔기 (Bludgeon)" },
    { key: "dagger", label: "단검 (Dagger)" },
    { key: "spear", label: "창 & 폴암 (Spear & Polearm)" },
    { key: "sword", label: "검 (Sword)" },
    { key: "unarmed", label: "맨손 격투 (Unarmed)" },
    { key: "lance", label: "마창 (Lance)" },
    { key: "bow", label: "활 (Bow)" },
    { key: "crossbow", label: "쇠뇌 (Crossbow)" },
    { key: "thrownWeapon", label: "투척 무기 (Thrown Weapon)" }
  ];

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">기사 캐릭터 시트 도움말</h4>
          <p>
            기사의 능력치와 기술을 기록하는 곳입니다. 근력(STR)이나 크기(SIZ) 등을 고치면 대미지와 최대 체력이 실시간으로 자동 계산됩니다. 
            마주보는 대립 성향들은 합이 항상 20이므로 하나를 고치면 반대쪽이 자동으로 맞춰집니다. 모험 중 성공적으로 사용한 기술은 이름 옆의 둥근 체크박스(경험치)를 선택해 두면, 겨울 정산 단계에서 능력 성장을 판정할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Sheet Navigation Section tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0' }}>
        <button className={`btn-medieval ${activeSection === 'personal' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('personal')}>
          <User size={16} /> 신상 정보
        </button>
        <button className={`btn-medieval ${activeSection === 'attributes' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('attributes')}>
          <Activity size={16} /> 능력치 & 체력
        </button>
        <button className={`btn-medieval ${activeSection === 'traits' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('traits')}>
          <Award size={16} /> 성향 & 열망
        </button>
        <button className={`btn-medieval ${activeSection === 'skills' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('skills')}>
          <Swords size={16} /> 기술 목록
        </button>
        <button className={`btn-medieval ${activeSection === 'squire' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('squire')}>
          <Users size={16} /> 종자 & 마필
        </button>
        <button className={`btn-medieval ${activeSection === 'gear' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('gear')}>
          <Shield size={16} /> 소지품 & 장비
        </button>
      </div>

      {/* 1. PERSONAL DATA SECTION */}
      {activeSection === 'personal' && (
        <div className="medieval-card view-animate">
          <h3 className="card-title">인적 사양 및 개인 기록</h3>
          <div className="medieval-form-grid">
            <div className="form-group">
              <label className="form-label">기사 이름 (Name)</label>
              <input type="text" className="form-input" value={character.personal.name} onChange={e => handleInputChange('personal', 'name', e.target.value)} placeholder="예: Roland" />
            </div>
            <div className="form-group">
              <label className="form-label">나이 (Age)</label>
              <input type="number" className="form-input" value={character.personal.age} onChange={e => handleInputChange('personal', 'age', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">출생 순서 (Son Number)</label>
              <input type="text" className="form-input" value={character.personal.sonNumber} onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)} placeholder="첫째" />
            </div>
            <div className="form-group">
              <label className="form-label">성스러운 축복 (Blessing)</label>
              <input type="text" className="form-input" value={character.personal.blessing} onChange={e => handleInputChange('personal', 'blessing', e.target.value)} placeholder="Divine Grace" />
            </div>
            <div className="form-group">
              <label className="form-label">출신국 (Homeland)</label>
              <input type="text" className="form-input" value={character.personal.homeland} onChange={e => handleInputChange('personal', 'homeland', e.target.value)} placeholder="Francia" />
            </div>
            <div className="form-group">
              <label className="form-label">봉토 / 고향 (Home)</label>
              <input type="text" className="form-input" value={character.personal.home} onChange={e => handleInputChange('personal', 'home', e.target.value)} placeholder="Aachen" />
            </div>
            <div className="form-group">
              <label className="form-label">문화권 (Culture)</label>
              <input type="text" className="form-input" value={character.personal.culture} onChange={e => handleInputChange('personal', 'culture', e.target.value)} placeholder="Frankish" />
            </div>
            <div className="form-group">
              <label className="form-label">혈통 / 가문명 (Lineage)</label>
              <input type="text" className="form-input" value={character.personal.lineage} onChange={e => handleInputChange('personal', 'lineage', e.target.value)} placeholder="Ardennes" />
            </div>
            <div className="form-group">
              <label className="form-label">주군 (Liege Lord)</label>
              <input type="text" className="form-input" value={character.personal.liegeLord} onChange={e => handleInputChange('personal', 'liegeLord', e.target.value)} placeholder="Charlemagne" />
            </div>
            <div className="form-group">
              <label className="form-label">부친의 신분 (Father's Class)</label>
              <input type="text" className="form-input" value={character.personal.fathersClass} onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)} placeholder="Vassal Knight" />
            </div>
            <div className="form-group">
              <label className="form-label">현재 신분 계급 (Personal Class)</label>
              <input type="text" className="form-input" value={character.personal.personalClass} onChange={e => handleInputChange('personal', 'personalClass', e.target.value)} placeholder="Vassal Knight" />
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTRIBUTES & HP SECTION */}
      {activeSection === 'attributes' && (
        <div className="view-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Attributes input */}
          <div className="medieval-card">
            <h3 className="card-title">기본 능력치</h3>
            <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">SIZ (신체 크기)</label>
                <input type="number" className="form-input" value={character.attributes.siz} onChange={e => handleInputChange('attributes', 'siz', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">DEX (민첩성)</label>
                <input type="number" className="form-input" value={character.attributes.dex} onChange={e => handleInputChange('attributes', 'dex', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">STR (근력)</label>
                <input type="number" className="form-input" value={character.attributes.str} onChange={e => handleInputChange('attributes', 'str', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">CON (건강/체질)</label>
                <input type="number" className="form-input" value={character.attributes.con} onChange={e => handleInputChange('attributes', 'con', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">APP (용모/친화)</label>
                <input type="number" className="form-input" value={character.attributes.app} onChange={e => handleInputChange('attributes', 'app', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Auto-Calculated Battle Stats */}
          <div className="medieval-card">
            <h3 className="card-title">자동 계산 전투 수치</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">무기 대미지 (Damage):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedDamage}d6</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">자연 치유력 (Healing Rate):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedHealing}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">이동 속도 (Movement Rate):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedMove}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">낙마 한계치 (Knockdown):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{knockdown} HP</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">중상 한계치 (Major Wound):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{majorWound} HP</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">최대 체력 (Total HP):</span>
                <strong style={{ fontFamily: 'var(--font-english)', color: 'var(--color-crimson)' }}>{maxHP} HP</strong>
              </div>
            </div>
          </div>

          {/* Current HP Tracker */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">실시간 기사 체력 상황판</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <div className="form-group" style={{ minWidth: '150px' }}>
                <label className="form-label">현재 체력 (Current HP)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={character.attributes.currentHp} 
                  max={maxHP}
                  onChange={e => handleInputChange('attributes', 'currentHp', Math.min(maxHP, parseInt(e.target.value) || 0))} 
                  style={{ fontSize: '1.4rem', color: 'var(--color-crimson)', fontWeight: 'bold' }}
                />
              </div>

              {/* Status conditions display */}
              <div style={{ flex: 1, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {character.attributes.currentHp <= 0 ? (
                  <span style={{ backgroundColor: 'var(--color-ink)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    전사 / 빈사 상태
                  </span>
                ) : character.attributes.currentHp <= maxHP / 4 ? (
                  <span style={{ backgroundColor: 'var(--color-crimson)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    의식 불명 (HP 1/4 이하)
                  </span>
                ) : character.attributes.currentHp <= maxHP / 2 ? (
                  <span style={{ backgroundColor: 'var(--color-gold-dark)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    부상 상태 (HP 1/2 이하)
                  </span>
                ) : (
                  <span style={{ backgroundColor: 'var(--color-success)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    건강함
                  </span>
                )}
                
                {character.attributes.currentHp < maxHP && (
                  <button className="btn-medieval" onClick={() => handleInputChange('attributes', 'currentHp', Math.min(maxHP, character.attributes.currentHp + calculatedHealing))}>
                    자연 치유력 적용 (+{calculatedHealing} HP)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRAITS & PASSIONS SECTION */}
      {activeSection === 'traits' && (
        <div className="view-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Opposing Traits Card */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">대립 성향 (Personality Traits - 마주보는 쌍의 합은 20)</h3>
            
            {/* Chivalrous / Religious status badges */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ border: `1px solid ${isChivalrousActive ? 'var(--color-crimson)' : '#ccc'}`, backgroundColor: isChivalrousActive ? 'var(--color-crimson-light)' : 'transparent', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color={isChivalrousActive ? 'var(--color-crimson)' : '#666'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: isChivalrousActive ? 'var(--color-crimson)' : '#666' }}>
                  기사도 보너스 (Chivalry): {chivalrousTraitsTotal}/90 {isChivalrousActive ? '★ 활성화 (아머 +3)' : '비활성'}
                </span>
              </div>
              <div style={{ border: `1px solid ${isReligiousActive ? 'var(--color-crimson)' : '#ccc'}`, backgroundColor: isReligiousActive ? 'var(--color-crimson-light)' : 'transparent', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color={isReligiousActive ? 'var(--color-crimson)' : '#666'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: isReligiousActive ? 'var(--color-crimson)' : '#666' }}>
                  성스러운 신앙 보너스 (Religious): {religiousTraitsTotal}/90 {isReligiousActive ? '★ 활성화 (기도 +5)' : '비활성'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Left Column Traits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 정숙 (Chaste)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.chaste} onChange={e => handleTraitChange('chaste', 'lustful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.lustful} onChange={e => handleTraitChange('lustful', 'chaste', e.target.value)} />
                    <span className="form-label">음탕 (Lustful)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">열정 (Energetic)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.energetic} onChange={e => handleTraitChange('energetic', 'lazy', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.lazy} onChange={e => handleTraitChange('lazy', 'energetic', e.target.value)} />
                    <span className="form-label">나태 (Lazy)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 관용 (Forgiving)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.forgiving} onChange={e => handleTraitChange('forgiving', 'vengeful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.vengeful} onChange={e => handleTraitChange('vengeful', 'forgiving', e.target.value)} />
                    <span className="form-label">복수 (Vengeful)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 관대 (Generous)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.generous} onChange={e => handleTraitChange('generous', 'selfish', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.selfish} onChange={e => handleTraitChange('selfish', 'generous', e.target.value)} />
                    <span className="form-label">이기 (Selfish)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 정직 (Honest)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.honest} onChange={e => handleTraitChange('honest', 'deceitful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.deceitful} onChange={e => handleTraitChange('deceitful', 'honest', e.target.value)} />
                    <span className="form-label">기만 (Deceitful)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">정의 (Just)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.just} onChange={e => handleTraitChange('just', 'arbitrary', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.arbitrary} onChange={e => handleTraitChange('arbitrary', 'just', e.target.value)} />
                    <span className="form-label">독단 (Arbitrary)</span>
                  </div>
                </div>
              </div>

              {/* Right Column Traits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">자비 (Merciful)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.merciful} onChange={e => handleTraitChange('merciful', 'cruel', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.cruel} onChange={e => handleTraitChange('cruel', 'merciful', e.target.value)} />
                    <span className="form-label">잔혹 (Cruel)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">겸손 (Modest)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.modest} onChange={e => handleTraitChange('modest', 'proud', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.proud} onChange={e => handleTraitChange('proud', 'modest', e.target.value)} />
                    <span className="form-label">오만 (Proud)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 경건 (Pious)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.pious} onChange={e => handleTraitChange('pious', 'worldly', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.worldly} onChange={e => handleTraitChange('worldly', 'pious', e.target.value)} />
                    <span className="form-label">세속 (Worldly)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 신중 (Prudent)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.prudent} onChange={e => handleTraitChange('prudent', 'reckless', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.reckless} onChange={e => handleTraitChange('reckless', 'prudent', e.target.value)} />
                    <span className="form-label">무모 (Reckless)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">절제 (Temperate)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.temperate} onChange={e => handleTraitChange('temperate', 'indulgent', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.indulgent} onChange={e => handleTraitChange('indulgent', 'temperate', e.target.value)} />
                    <span className="form-label">방종 (Indulgent)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 신뢰 (Trusting)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.trusting} onChange={e => handleTraitChange('trusting', 'suspicious', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.suspicious} onChange={e => handleTraitChange('suspicious', 'trusting', e.target.value)} />
                    <span className="form-label">의심 (Suspicious)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> 용맹 (Valorous)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.valorous} onChange={e => handleTraitChange('valorous', 'cowardly', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.cowardly} onChange={e => handleTraitChange('cowardly', 'valorous', e.target.value)} />
                    <span className="form-label">겁쟁이 (Cowardly)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passions Card */}
          <div className="medieval-card">
            <h3 className="card-title">기사의 열망 (Passions)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label"><ProperNoun en="Love [Charlemagne]" ko="주군 충성심 [샤를마뉴]" /></label>
                <input type="number" className="form-input" value={character.passions.loveCharlemagne} onChange={e => handleInputChange('passions', 'loveCharlemagne', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">기사의 명예 (Honor)</label>
                <input type="number" className="form-input" value={character.passions.honor} onChange={e => handleInputChange('passions', 'honor', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">가문 충성도 (Love [Family])</label>
                <input type="number" className="form-input" value={character.passions.loveFamily} onChange={e => handleInputChange('passions', 'loveFamily', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">신을 향한 사랑 (Love [God])</label>
                <input type="number" className="form-input" value={character.passions.loveGod} onChange={e => handleInputChange('passions', 'loveGod', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">연정 / 연인 (Amor)</label>
                <input type="number" className="form-input" value={character.passions.amor} onChange={e => handleInputChange('passions', 'amor', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Standings Card */}
          <div className="medieval-card">
            <h3 className="card-title">사회적 평판 (Standings)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label"><ProperNoun en="Charlemagne" ko="샤를마뉴 궁정 내 위상" /></label>
                <input type="number" className="form-input" value={character.standings.charlemagne} onChange={e => handleInputChange('standings', 'charlemagne', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">영지 내 주군 평판 (Lord)</label>
                <input type="number" className="form-input" value={character.standings.lord} onChange={e => handleInputChange('standings', 'lord', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">친족간 평판 (Family)</label>
                <input type="number" className="form-input" value={character.standings.family} onChange={e => handleInputChange('standings', 'family', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">교회 영향력 (Church)</label>
                <input type="number" className="form-input" value={character.standings.church} onChange={e => handleInputChange('standings', 'church', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">민중 지지도 (Commoners)</label>
                <input type="number" className="form-input" value={character.standings.commoners} onChange={e => handleInputChange('standings', 'commoners', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. SKILLS SECTION */}
      {activeSection === 'skills' && (
        <div className="view-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Common Skills */}
          <div className="medieval-card">
            <h3 className="card-title">일반 기술</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {commonSkills.map(skill => (
                <div key={skill.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">{skill.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      className="exp-checkbox" 
                      checked={character.skillsChecked[skill.key] || false}
                      onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)}
                    />
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: '60px', textAlign: 'center' }} 
                      value={character.skills[skill.key] || 0} 
                      onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courtly Skills */}
          <div className="medieval-card">
            <h3 className="card-title">사교 기술</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {courtlySkills.map(skill => (
                <div key={skill.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">{skill.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      className="exp-checkbox" 
                      checked={character.skillsChecked[skill.key] || false}
                      onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)}
                    />
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: '60px', textAlign: 'center' }} 
                      value={character.skills[skill.key] || 0} 
                      onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Skills */}
          <div className="medieval-card">
            <h3 className="card-title">무예 기술</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {combatSkills.map(skill => (
                <div key={skill.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">{skill.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      className="exp-checkbox" 
                      checked={character.skillsChecked[skill.key] || false}
                      onChange={e => handleInputChange('skillsChecked', skill.key, e.target.checked)}
                    />
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: '60px', textAlign: 'center' }} 
                      value={character.skills[skill.key] || 0} 
                      onChange={e => handleInputChange('skills', skill.key, parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. SQUIRE & HORSES SECTION */}
      {activeSection === 'squire' && (
        <div className="view-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Squire Stats Card */}
          <div className="medieval-card">
            <h3 className="card-title">종자 캐릭터 시트 (Squire)</h3>
            <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">종자 이름 (Name)</label>
                <input type="text" className="form-input" value={character.squire.name} onChange={e => handleInputChange('squire', 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">나이 (Age)</label>
                <input type="number" className="form-input" value={character.squire.age} onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">SIZ (신체 크기)</label>
                <input type="number" className="form-input" value={character.squire.siz} onChange={e => handleInputChange('squire', 'siz', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">DEX (민첩)</label>
                <input type="number" className="form-input" value={character.squire.dex} onChange={e => handleInputChange('squire', 'dex', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">STR (근력)</label>
                <input type="number" className="form-input" value={character.squire.str} onChange={e => handleInputChange('squire', 'str', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">CON (건강)</label>
                <input type="number" className="form-input" value={character.squire.con} onChange={e => handleInputChange('squire', 'con', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">응급처치 (First Aid)</label>
                <input type="number" className="form-input" value={character.squire.firstAid} onChange={e => handleInputChange('squire', 'firstAid', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">마술 (Horsemanship)</label>
                <input type="number" className="form-input" value={character.squire.horsemanship} onChange={e => handleInputChange('squire', 'horsemanship', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">무기 숙련 (Weapon)</label>
                <input type="number" className="form-input" value={character.squire.weapon} onChange={e => handleInputChange('squire', 'weapon', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Horses Management Card */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">마필 정보 관리</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Best Warhorse #1 */}
              <div style={{ borderRight: '1px solid var(--color-gold-light)', paddingRight: '15px' }}>
                <h4 style={{ color: 'var(--color-crimson)', fontSize: '1.05rem', marginBottom: '10px' }}>최고의 전투마 #1 (Best Warhorse)</h4>
                <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">용도/분류 (Type)</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.type} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, type: e.target.value })} placeholder="Charger" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">마종 (Breed)</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.breed} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, breed: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">말의 피해량</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.damage} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, damage: e.target.value })} placeholder="4d6" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">이동 (Move)</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.move} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, move: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">마갑 방어 (Armor)</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.armor} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, armor: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">말의 HP</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.hp} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, hp: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              </div>

              {/* Other Horses */}
              <div>
                <h4 style={{ color: 'var(--color-gold-dark)', fontSize: '1.05rem', marginBottom: '10px' }}>기타 및 비상용 말 목록</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other2} onChange={e => handleInputChange('horses', 'other2', e.target.value)} placeholder="말 #2 (예: Riding Palfrey)" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other3} onChange={e => handleInputChange('horses', 'other3', e.target.value)} placeholder="말 #3" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other4} onChange={e => handleInputChange('horses', 'other4', e.target.value)} placeholder="말 #4" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other5} onChange={e => handleInputChange('horses', 'other5', e.target.value)} placeholder="말 #5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 6. GEAR & WEALTH SECTION */}
      {activeSection === 'gear' && (
        <div className="view-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Equipment Carried */}
          <div className="medieval-card">
            <h3 className="card-title">소지한 장비 및 의복</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">갑옷 및 방패 (Armor & Shield - 방어 점수)</label>
                <input type="text" className="form-input" value={character.gear.armorShield} onChange={e => handleInputChange('gear', 'armorShield', e.target.value)} placeholder="예: 10 Points Chainmail + Shield" />
              </div>
              <div className="form-group">
                <label className="form-label">의복 (Clothing - 소장 가치)</label>
                <input type="text" className="form-input" value={character.gear.clothing} onChange={e => handleInputChange('gear', 'clothing', e.target.value)} placeholder="예: £2 Courtyard Tunic" />
              </div>
              <div className="form-group">
                <label className="form-label">말에 실은 소품 (Personal Gear)</label>
                <textarea className="form-input" rows={4} value={character.gear.personalGear} onChange={e => handleInputChange('gear', 'personalGear', e.target.value)} placeholder="Wooden crucifix, holy symbol, family ring..." />
              </div>
            </div>
          </div>

          {/* Wealth & Estate Gear */}
          <div className="medieval-card">
            <h3 className="card-title">가문의 재정 상황 및 보관물</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">금화 / 은괴 잔고 (Cash - 리브르 £)</label>
                <input type="number" className="form-input" value={character.gear.cash} onChange={e => handleInputChange('gear', 'cash', parseInt(e.target.value) || 0)} style={{ fontSize: '1.2rem', color: 'var(--color-gold-dark)', fontWeight: 'bold' }} />
              </div>
              <div className="form-group">
                <label className="form-label">기사의 영예 (Glory)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>이번 게임 획득 (This Game)</span>
                    <input type="number" className="form-input" value={character.gear.gloryThisGame} onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>누적 영예 총점 (Total Glory)</span>
                    <input type="number" className="form-input" value={character.gear.gloryTotal} onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">영지에 보관 중인 자산 (Possessions at Home)</label>
                <textarea className="form-input" rows={3} value={character.gear.homePossessions} onChange={e => handleInputChange('gear', 'homePossessions', e.target.value)} placeholder="Tapestries, war lances, chests of grain..." />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
