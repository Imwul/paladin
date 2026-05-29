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
    { key: "awareness", label: "Awareness (경계)" },
    { key: "chirurgery", label: "Chirurgery (의술)" },
    { key: "faerieLore", label: "Faerie Lore (요정 전설)" },
    { key: "firstAid", label: "First Aid (응급처치)" },
    { key: "folkLore", label: "Folk Lore (민간 전설)" },
    { key: "horsemanship", label: "Horsemanship (마술)" },
    { key: "hunting", label: "Hunting (수렵)" },
    { key: "industry", label: "Industry (근면)" },
    { key: "recognize", label: "Recognize (신분 식별)" },
    { key: "religion", label: "Religion (종교)" },
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

  const combatSkills = [
    { key: "battle", label: "Battle (전술)" },
    { key: "siege", label: "Siege (공성전)" },
    { key: "axe", label: "Axe (도끼)" },
    { key: "bludgeon", label: "Bludgeon (둔기)" },
    { key: "dagger", label: "Dagger (단검)" },
    { key: "spear", label: "Spear & Polearm (창 및 폴암)" },
    { key: "sword", label: "Sword (검)" },
    { key: "unarmed", label: "Unarmed (맨손 격투)" },
    { key: "lance", label: "Lance (마창)" },
    { key: "bow", label: "Bow (활)" },
    { key: "crossbow", label: "Crossbow (쇠뇌)" },
    { key: "thrownWeapon", label: "Thrown Weapon (투척 무기)" }
  ];

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">Knight Character Sheet Tutorial (기사 시트 설명)</h4>
          <p>
            This is your Knight's character sheet. Changing your core attributes automatically recalculates combat stats like damage and maximum hit points. 
            Opposing Traits (such as Chaste/Lustful) always sum to 20. Mark the experience checkbox (circle) next to any skill you successfully used in adventure to test for improvement during the Winter Phase!
          </p>
        </div>
      </div>

      {/* Sheet Navigation Section tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0' }}>
        <button className={`btn-medieval ${activeSection === 'personal' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('personal')}>
          <User size={16} /> Personal Data
        </button>
        <button className={`btn-medieval ${activeSection === 'attributes' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('attributes')}>
          <Activity size={16} /> Attributes & HP
        </button>
        <button className={`btn-medieval ${activeSection === 'traits' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('traits')}>
          <Award size={16} /> Traits & Passions
        </button>
        <button className={`btn-medieval ${activeSection === 'skills' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('skills')}>
          <Swords size={16} /> Skills
        </button>
        <button className={`btn-medieval ${activeSection === 'squire' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('squire')}>
          <Users size={16} /> Squire & Horses
        </button>
        <button className={`btn-medieval ${activeSection === 'gear' ? 'btn-medieval-primary' : ''}`} onClick={() => setActiveSection('gear')}>
          <Shield size={16} /> Gear & Wealth
        </button>
      </div>

      {/* 1. PERSONAL DATA SECTION */}
      {activeSection === 'personal' && (
        <div className="medieval-card view-animate">
          <h3 className="card-title">Personal Data (인적 사양)</h3>
          <div className="medieval-form-grid">
            <div className="form-group">
              <label className="form-label">Name (이름)</label>
              <input type="text" className="form-input" value={character.personal.name} onChange={e => handleInputChange('personal', 'name', e.target.value)} placeholder="e.g. Roland" />
            </div>
            <div className="form-group">
              <label className="form-label">Age (나이)</label>
              <input type="number" className="form-input" value={character.personal.age} onChange={e => handleInputChange('personal', 'age', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Son Number (몇째 아들)</label>
              <input type="text" className="form-input" value={character.personal.sonNumber} onChange={e => handleInputChange('personal', 'sonNumber', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Blessing (축복)</label>
              <input type="text" className="form-input" value={character.personal.blessing} onChange={e => handleInputChange('personal', 'blessing', e.target.value)} placeholder="Divine Grace" />
            </div>
            <div className="form-group">
              <label className="form-label">Homeland (모국)</label>
              <input type="text" className="form-input" value={character.personal.homeland} onChange={e => handleInputChange('personal', 'homeland', e.target.value)} placeholder="Francia" />
            </div>
            <div className="form-group">
              <label className="form-label">Home (영지/고향)</label>
              <input type="text" className="form-input" value={character.personal.home} onChange={e => handleInputChange('personal', 'home', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Culture (문화권)</label>
              <input type="text" className="form-input" value={character.personal.culture} onChange={e => handleInputChange('personal', 'culture', e.target.value)} placeholder="Frankish" />
            </div>
            <div className="form-group">
              <label className="form-label">Lineage (가문 명칭)</label>
              <input type="text" className="form-input" value={character.personal.lineage} onChange={e => handleInputChange('personal', 'lineage', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Liege Lord (주군)</label>
              <input type="text" className="form-input" value={character.personal.liegeLord} onChange={e => handleInputChange('personal', 'liegeLord', e.target.value)} placeholder="Charlemagne" />
            </div>
            <div className="form-group">
              <label className="form-label">Father's Class (부친 계급)</label>
              <input type="text" className="form-input" value={character.personal.fathersClass} onChange={e => handleInputChange('personal', 'fathersClass', e.target.value)} placeholder="Knight" />
            </div>
            <div className="form-group">
              <label className="form-label">Personal Class (기사 계급)</label>
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
            <h3 className="card-title">Core Attributes (기본 능력치)</h3>
            <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">SIZ (크기)</label>
                <input type="number" className="form-input" value={character.attributes.siz} onChange={e => handleInputChange('attributes', 'siz', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">DEX (민첩)</label>
                <input type="number" className="form-input" value={character.attributes.dex} onChange={e => handleInputChange('attributes', 'dex', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">STR (근력)</label>
                <input type="number" className="form-input" value={character.attributes.str} onChange={e => handleInputChange('attributes', 'str', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">CON (체질)</label>
                <input type="number" className="form-input" value={character.attributes.con} onChange={e => handleInputChange('attributes', 'con', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">APP (외모)</label>
                <input type="number" className="form-input" value={character.attributes.app} onChange={e => handleInputChange('attributes', 'app', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Auto-Calculated Battle Stats */}
          <div className="medieval-card">
            <h3 className="card-title">Calculated Stats (자동 계산 수치)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Damage (무기 피해량):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedDamage}d6</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Healing Rate (치유 가속):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedHealing}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Movement Rate (이동 속도):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{calculatedMove}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Knockdown (낙마 한계):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{knockdown} HP</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Major Wound (중상 한계):</span>
                <strong style={{ fontFamily: 'var(--font-english)' }}>{majorWound} HP</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px' }}>
                <span className="form-label">Maximum Hit Points (최대 체력):</span>
                <strong style={{ fontFamily: 'var(--font-english)', color: 'var(--color-crimson)' }}>{maxHP} HP</strong>
              </div>
            </div>
          </div>

          {/* Current HP Tracker */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">Hit Points Tracker & Wounds (체력 상황판)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <div className="form-group" style={{ minWidth: '150px' }}>
                <label className="form-label">Current HP (현재 체력)</label>
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
                    DEAD / DYING (사망 또는 위독)
                  </span>
                ) : character.attributes.currentHp <= maxHP / 4 ? (
                  <span style={{ backgroundColor: 'var(--color-crimson)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    UNCONSCIOUS (의식 상실 - HP 1/4 이하)
                  </span>
                ) : character.attributes.currentHp <= maxHP / 2 ? (
                  <span style={{ backgroundColor: 'var(--color-gold-dark)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    WOUNDED (행동 제약 - HP 1/2 이하)
                  </span>
                ) : (
                  <span style={{ backgroundColor: 'var(--color-success)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    HEALTHY (양호)
                  </span>
                )}
                
                {character.attributes.currentHp < maxHP && (
                  <button className="btn-medieval" onClick={() => handleInputChange('attributes', 'currentHp', Math.min(maxHP, character.attributes.currentHp + calculatedHealing))}>
                    Apply Heal (+{calculatedHealing} HP)
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
            <h3 className="card-title">Personality Traits (성향 수치 - 합산 20)</h3>
            
            {/* Chivalrous / Religious status badges */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ border: `1px solid ${isChivalrousActive ? 'var(--color-crimson)' : '#ccc'}`, backgroundColor: isChivalrousActive ? 'var(--color-crimson-light)' : 'transparent', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color={isChivalrousActive ? 'var(--color-crimson)' : '#666'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: isChivalrousActive ? 'var(--color-crimson)' : '#666' }}>
                  Chivalry Bonus (기사도 보너스): {chivalrousTraitsTotal}/90 {isChivalrousActive ? 'ACTIVE (+3 Natural Armor)' : 'INACTIVE'}
                </span>
              </div>
              <div style={{ border: `1px solid ${isReligiousActive ? 'var(--color-crimson)' : '#ccc'}`, backgroundColor: isReligiousActive ? 'var(--color-crimson-light)' : 'transparent', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color={isReligiousActive ? 'var(--color-crimson)' : '#666'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: isReligiousActive ? 'var(--color-crimson)' : '#666' }}>
                  Religious Bonus (종교 보너스): {religiousTraitsTotal}/90 {isReligiousActive ? 'ACTIVE (+5 Prayers)' : 'INACTIVE'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Left Column Traits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Chaste (정숙)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.chaste} onChange={e => handleTraitChange('chaste', 'lustful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.lustful} onChange={e => handleTraitChange('lustful', 'chaste', e.target.value)} />
                    <span className="form-label">Lustful (음탕)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">Energetic (열정)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.energetic} onChange={e => handleTraitChange('energetic', 'lazy', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.lazy} onChange={e => handleTraitChange('lazy', 'energetic', e.target.value)} />
                    <span className="form-label">Lazy (나태)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Forgiving (관용)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.forgiving} onChange={e => handleTraitChange('forgiving', 'vengeful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.vengeful} onChange={e => handleTraitChange('vengeful', 'forgiving', e.target.value)} />
                    <span className="form-label">Vengeful (복수)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Generous (관대)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.generous} onChange={e => handleTraitChange('generous', 'selfish', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.selfish} onChange={e => handleTraitChange('selfish', 'generous', e.target.value)} />
                    <span className="form-label">Selfish (이기)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Honest (정직)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.honest} onChange={e => handleTraitChange('honest', 'deceitful', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.deceitful} onChange={e => handleTraitChange('deceitful', 'honest', e.target.value)} />
                    <span className="form-label">Deceitful (기만)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">Just (정의)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.just} onChange={e => handleTraitChange('just', 'arbitrary', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.arbitrary} onChange={e => handleTraitChange('arbitrary', 'just', e.target.value)} />
                    <span className="form-label">Arbitrary (독단)</span>
                  </div>
                </div>
              </div>

              {/* Right Column Traits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">Merciful (자비)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.merciful} onChange={e => handleTraitChange('merciful', 'cruel', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.cruel} onChange={e => handleTraitChange('cruel', 'merciful', e.target.value)} />
                    <span className="form-label">Cruel (잔혹)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">Modest (겸손)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.modest} onChange={e => handleTraitChange('modest', 'proud', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.proud} onChange={e => handleTraitChange('proud', 'modest', e.target.value)} />
                    <span className="form-label">Proud (오만)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Pious (경건)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.pious} onChange={e => handleTraitChange('pious', 'worldly', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.worldly} onChange={e => handleTraitChange('worldly', 'pious', e.target.value)} />
                    <span className="form-label">Worldly (세속)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Prudent (신중)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.prudent} onChange={e => handleTraitChange('prudent', 'reckless', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.reckless} onChange={e => handleTraitChange('reckless', 'prudent', e.target.value)} />
                    <span className="form-label">Reckless (무모)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label">Temperate (절제)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.temperate} onChange={e => handleTraitChange('temperate', 'indulgent', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.indulgent} onChange={e => handleTraitChange('indulgent', 'temperate', e.target.value)} />
                    <span className="form-label">Indulgent (방종)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Trusting (신뢰)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.trusting} onChange={e => handleTraitChange('trusting', 'suspicious', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.suspicious} onChange={e => handleTraitChange('suspicious', 'trusting', e.target.value)} />
                    <span className="form-label">Suspicious (의심)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--color-crimson)" /> Valorous (용맹)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.valorous} onChange={e => handleTraitChange('valorous', 'cowardly', e.target.value)} />
                    <span style={{ color: 'var(--color-grey)' }}>/</span>
                    <input type="number" className="form-input" style={{ width: '60px', textAlign: 'center' }} value={character.traits.cowardly} onChange={e => handleTraitChange('cowardly', 'valorous', e.target.value)} />
                    <span className="form-label">Cowardly (겁쟁이)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passions Card */}
          <div className="medieval-card">
            <h3 className="card-title">Passions (기사의 열망)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label"><ProperNoun en="Love [Charlemagne]" ko="충성심 [샤를마뉴 대제]" /></label>
                <input type="number" className="form-input" value={character.passions.loveCharlemagne} onChange={e => handleInputChange('passions', 'loveCharlemagne', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Honor (명예)</label>
                <input type="number" className="form-input" value={character.passions.honor} onChange={e => handleInputChange('passions', 'honor', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Love [Family] (가족애)</label>
                <input type="number" className="form-input" value={character.passions.loveFamily} onChange={e => handleInputChange('passions', 'loveFamily', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Love [God] (신앙심)</label>
                <input type="number" className="form-input" value={character.passions.loveGod} onChange={e => handleInputChange('passions', 'loveGod', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Amor (사랑/연정)</label>
                <input type="number" className="form-input" value={character.passions.amor} onChange={e => handleInputChange('passions', 'amor', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Standings Card */}
          <div className="medieval-card">
            <h3 className="card-title">Social Standings (평판 및 소속)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label"><ProperNoun en="Charlemagne" ko="샤를마뉴 궁정 내 평판" /></label>
                <input type="number" className="form-input" value={character.standings.charlemagne} onChange={e => handleInputChange('standings', 'charlemagne', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Lord (지역 주군 평판)</label>
                <input type="number" className="form-input" value={character.standings.lord} onChange={e => handleInputChange('standings', 'lord', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Family (가문 명망)</label>
                <input type="number" className="form-input" value={character.standings.family} onChange={e => handleInputChange('standings', 'family', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Church (교회 영향력)</label>
                <input type="number" className="form-input" value={character.standings.church} onChange={e => handleInputChange('standings', 'church', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Commoners (백성들의 평판)</label>
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
            <h3 className="card-title">Common Skills (일반 기술)</h3>
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
            <h3 className="card-title">Courtly Skills (사교 기술)</h3>
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
            <h3 className="card-title">Combat Skills (무예 기술)</h3>
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
            <h3 className="card-title">Squire Character Sheet (종자 시트)</h3>
            <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Squire Name (종자 이름)</label>
                <input type="text" className="form-input" value={character.squire.name} onChange={e => handleInputChange('squire', 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Age (나이)</label>
                <input type="number" className="form-input" value={character.squire.age} onChange={e => handleInputChange('squire', 'age', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">SIZ (크기)</label>
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
                <label className="form-label">CON (체질)</label>
                <input type="number" className="form-input" value={character.squire.con} onChange={e => handleInputChange('squire', 'con', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">First Aid (응급처치)</label>
                <input type="number" className="form-input" value={character.squire.firstAid} onChange={e => handleInputChange('squire', 'firstAid', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Horsemanship (마술)</label>
                <input type="number" className="form-input" value={character.squire.horsemanship} onChange={e => handleInputChange('squire', 'horsemanship', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Weapon (무기 숙련)</label>
                <input type="number" className="form-input" value={character.squire.weapon} onChange={e => handleInputChange('squire', 'weapon', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Horses Management Card */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="card-title">Horses & Mounts (기사의 애마 목록)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Best Warhorse #1 */}
              <div style={{ borderRight: '1px solid var(--color-gold-light)', paddingRight: '15px' }}>
                <h4 style={{ color: 'var(--color-crimson)', fontSize: '1.05rem', marginBottom: '10px' }}>Best Warhorse #1 (첫 번째 전투마)</h4>
                <div className="medieval-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Type (종류)</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.type} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, type: e.target.value })} placeholder="Charger" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Breed (품종)</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.breed} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, breed: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Damage (피해)</label>
                    <input type="text" className="form-input" value={character.horses.warhorse.damage} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, damage: e.target.value })} placeholder="4d6" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Move (이동)</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.move} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, move: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Armor (방어구)</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.armor} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, armor: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">HP (체력)</label>
                    <input type="number" className="form-input" value={character.horses.warhorse.hp} onChange={e => handleInputChange('horses', 'warhorse', { ...character.horses.warhorse, hp: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              </div>

              {/* Other Horses */}
              <div>
                <h4 style={{ color: 'var(--color-gold-dark)', fontSize: '1.05rem', marginBottom: '10px' }}>Other Horses (예비 및 기타 마필)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other2} onChange={e => handleInputChange('horses', 'other2', e.target.value)} placeholder="Horse #2 (e.g. Riding Palfrey)" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other3} onChange={e => handleInputChange('horses', 'other3', e.target.value)} placeholder="Horse #3" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other4} onChange={e => handleInputChange('horses', 'other4', e.target.value)} placeholder="Horse #4" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-input" style={{ flex: 1 }} value={character.horses.other5} onChange={e => handleInputChange('horses', 'other5', e.target.value)} placeholder="Horse #5" />
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
            <h3 className="card-title">Equipment Carried (소지 장비)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Armor & Shield (갑옷 및 방패 방어 점수)</label>
                <input type="text" className="form-input" value={character.gear.armorShield} onChange={e => handleInputChange('gear', 'armorShield', e.target.value)} placeholder="e.g. 10 Points Chainmail + Shield" />
              </div>
              <div className="form-group">
                <label className="form-label">Clothing (착용 의복 가치)</label>
                <input type="text" className="form-input" value={character.gear.clothing} onChange={e => handleInputChange('gear', 'clothing', e.target.value)} placeholder="e.g. £1 Fine Tunic" />
              </div>
              <div className="form-group">
                <label className="form-label">Personal Gear (개인 소품)</label>
                <textarea className="form-input" rows={4} value={character.gear.personalGear} onChange={e => handleInputChange('gear', 'personalGear', e.target.value)} placeholder="Whetstone, holy symbol, family ring..." />
              </div>
            </div>
          </div>

          {/* Wealth & Estate Gear */}
          <div className="medieval-card">
            <h3 className="card-title">Wealth & Estate Gear (재산 및 보관 장비)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Estate Cash (보유 금화 - 리브르 £)</label>
                <input type="number" className="form-input" value={character.gear.cash} onChange={e => handleInputChange('gear', 'cash', parseInt(e.target.value) || 0)} style={{ fontSize: '1.2rem', color: 'var(--color-gold-dark)', fontWeight: 'bold' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Glory (영예 점수)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>This Game (이번 세션)</span>
                    <input type="number" className="form-input" value={character.gear.gloryThisGame} onChange={e => handleInputChange('gear', 'gloryThisGame', parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>Total (누적 영예)</span>
                    <input type="number" className="form-input" value={character.gear.gloryTotal} onChange={e => handleInputChange('gear', 'gloryTotal', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Possessions at Home (영지에 보관 중인 재산)</label>
                <textarea className="form-input" rows={3} value={character.gear.homePossessions} onChange={e => handleInputChange('gear', 'homePossessions', e.target.value)} placeholder="Tapestries, war lances, chests of grain..." />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
