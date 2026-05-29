import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { Shield, Sparkles, Heart, ChevronRight, ChevronLeft, Dices, RotateCcw } from 'lucide-react';

export default function FamilyWinter({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('family');
  const [winterStep, setWinterStep] = useState(1);
  const [logMessages, setLogMessages] = useState([]);

  // Input change handler for family details
  const handleFamilyChange = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      family: { ...prev.family, [field]: value }
    }));
  };

  // Step 2: Auto Skill Improvement Roll (Pendragon style: Roll > current skill or get a 20 to increase it by 1)
  const runSkillImprovement = (skillKey, label, currentVal) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    let success = false;
    let newVal = currentVal;
    
    // Improvement succeeds if you roll greater than current value, or if you roll a natural 20
    if (roll > currentVal || roll === 20) {
      if (currentVal < 20) {
        success = true;
        newVal = currentVal + 1;
      }
    }

    // Update state
    setCharacter(prev => {
      const updatedSkills = { ...prev.skills, [skillKey]: newVal };
      const updatedChecked = { ...prev.skillsChecked, [skillKey]: false }; // Clear the checkmark
      return { ...prev, skills: updatedSkills, skillsChecked: updatedChecked };
    });

    const msg = `Roll for ${label}: Rolled [${roll}] vs Skill [${currentVal}]. ${success ? `SUCCESS! Skill increases to ${newVal} 🎉` : 'Failed to improve.'}`;
    setLogMessages(prev => [msg, ...prev]);
  };

  // Step 3: Aging Roll Helper
  const runAgingRoll = () => {
    const age = character.personal.age || 0;
    if (age < 35) {
      setLogMessages(prev => [`Age is ${age} (Under 35). You are in your prime! No aging roll required.`, ...prev]);
      return;
    }

    const roll = Math.floor(Math.random() * 20) + 1;
    let msg = `Aging Roll (Age ${age}): Rolled [${roll}]. `;
    
    if (roll === 20) {
      msg += "SEVERE AGING! You lose 1 point from STR, CON, DEX, and SIZ.";
      setCharacter(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          str: Math.max(1, prev.attributes.str - 1),
          con: Math.max(1, prev.attributes.con - 1),
          dex: Math.max(1, prev.attributes.dex - 1),
          siz: Math.max(1, prev.attributes.siz - 1),
        }
      }));
    } else if (roll >= 15) {
      msg += "Normal Aging. Lose 1 point of your choice (STR/CON/DEX).";
    } else {
      msg += "You remain strong! No attribute loss this year.";
    }

    setLogMessages(prev => [msg, ...prev]);
  };

  // Step 4: Random Family Event generator (d100)
  const runFamilyEvent = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    let outcome = "";

    if (roll <= 10) outcome = "Birth: A healthy baby boy is born to your household! Lineage continues. (+50 Glory)";
    else if (roll <= 20) outcome = "Birth: A daughter is born. Marriage alliances await. (+20 Glory)";
    else if (roll <= 40) outcome = "Marriage: A cousin or sibling marries well, securing local ties. (+1d6 £ Dowry)";
    else if (roll <= 60) outcome = "Harvest Success: A plentiful year at the manor. (+2d6 £ Revenue)";
    else if (roll <= 80) outcome = "Peaceful Year: No major family incidents. General stability.";
    else if (roll <= 90) outcome = "Sickness: A family elder falls ill. First Aid/Chirurgery rolls needed, or pay £1 for care.";
    else outcome = "Tragedy: A kinsman falls in battle or dies of plague. High mourning in the hall. (-50 Glory)";

    setLogMessages(prev => [`Family Event (Rolled d100 [${roll}]): ${outcome}`, ...prev]);
  };

  // Reset winter wizard
  const resetWinter = () => {
    setWinterStep(1);
    setLogMessages([]);
  };

  // Find all skills that have been checked for improvement
  const checkedSkills = Object.keys(character.skillsChecked).filter(k => character.skillsChecked[k]);

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">Family & Winter Phase Tutorial (가문 및 겨울 단계 설명)</h4>
          <p>
            The game flows in a yearly cycle. During the active campaign season, you adventure and mark skills you successfully use. 
            Once winter sets in, open the <strong>Winter Phase Helper</strong> to roll for skill increases, test for aging, check family developments, and prepare your lineage for the coming spring.
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '10px' }}>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-english)', fontSize: '1.1rem', fontWeight: activeSubTab === 'family' ? 'bold' : 'normal', color: activeSubTab === 'family' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('family')}
        >
          Family Sheet (가문 시트)
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-english)', fontSize: '1.1rem', fontWeight: activeSubTab === 'winter' ? 'bold' : 'normal', color: activeSubTab === 'winter' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('winter')}
        >
          Winter Phase Helper (겨울 단계 정산)
        </button>
      </div>

      {/* SUB TAB 1: FAMILY SHEET */}
      {activeSubTab === 'family' && (
        <div className="medieval-card view-animate">
          <h3 className="card-title">Family & Lineage Character Sheet (가문 혈통 시트)</h3>
          <div className="medieval-form-grid">
            <div className="form-group">
              <label className="form-label">Family Name (가문 성씨)</label>
              <input type="text" className="form-input" value={character.family.name} onChange={e => handleFamilyChange('name', e.target.value)} placeholder="e.g. Ardennes" />
            </div>
            <div className="form-group">
              <label className="form-label">Family Motto (가문 신조)</label>
              <input type="text" className="form-input" value={character.family.motto} onChange={e => handleFamilyChange('motto', e.target.value)} placeholder="Honor and Faith" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Battle Cry (전투 함성)</label>
              <input type="text" className="form-input" value={character.family.battleCry} onChange={e => handleFamilyChange('battleCry', e.target.value)} placeholder="Montjoie Saint-Denis!" />
            </div>
            <div className="form-group">
              <label className="form-label">Founding Ancestor (가문 시조)</label>
              <input type="text" className="form-input" value={character.family.ancestor} onChange={e => handleFamilyChange('ancestor', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Home Country (본관/고향 영지)</label>
              <input type="text" className="form-input" value={character.family.homeCountry} onChange={e => handleFamilyChange('homeCountry', e.target.value)} placeholder="Aquitaine" />
            </div>
            <div className="form-group">
              <label className="form-label">Patron Saint (수호성인)</label>
              <input type="text" className="form-input" value={character.family.patronSaint} onChange={e => handleFamilyChange('patronSaint', e.target.value)} placeholder="St. Denis" />
            </div>
            <div className="form-group">
              <label className="form-label">Honor (가문 총합 명예 수치)</label>
              <input type="number" className="form-input" value={character.family.honor} onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Allies (우방 세력/가문)</label>
              <textarea className="form-input" rows={2} value={character.family.allies} onChange={e => handleFamilyChange('allies', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Enemies (숙적 세력/가문)</label>
              <textarea className="form-input" rows={2} value={character.family.enemies} onChange={e => handleFamilyChange('enemies', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: WINTER PHASE HELPER */}
      {activeSubTab === 'winter' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Main Step wizard */}
          <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-english)', color: 'var(--color-crimson)' }}>
                Step {winterStep} of 7: {
                  winterStep === 1 ? "Adventure Cleanup (그 해의 마감)" :
                  winterStep === 2 ? "Experience Rolls (체크한 기술 굴림)" :
                  winterStep === 3 ? "Aging (노화 점검)" :
                  winterStep === 4 ? "Family Events (가족 돌발사태)" :
                  winterStep === 5 ? "Training & Improvements (능력치 분배)" :
                  winterStep === 6 ? "Maintenance (영지 유지관리)" :
                  "Glory Rewards (영예 수확 및 봄의 시작)"
                }
              </h3>
              <button className="btn-medieval" onClick={resetWinter} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Step content */}
            <div style={{ minHeight: '180px', marginBottom: '20px' }}>
              {winterStep === 1 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    Review your logs for this year in the <strong>Chronology & Journal</strong> tab. 
                    Ensure all deeds, gained treasure, and lost family knights are correctly entered.
                  </p>
                  <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>
                    * Tip: If your knight completed a legendary deed, ensure you manually award yourself extra <strong>Glory</strong> in the Knight Sheet.
                  </p>
                </div>
              )}

              {winterStep === 2 && (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    Roll d20 for all skills that you checked during adventure. 
                    To succeed in improving, you must **roll GREATER than your current skill value** (or roll a natural **20**). 
                    A success increases your skill by exactly **1**.
                  </p>

                  {checkedSkills.length === 0 ? (
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-grey-light)', color: 'var(--color-ink-light)', textAlign: 'center', border: '1px dashed var(--color-gold)' }}>
                      No skills are checked for improvement! (모험 중 체크된 기술이 없습니다)
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                      {checkedSkills.map(key => {
                        const skillVal = character.skills[key] || 0;
                        return (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(179,143,67,0.05)', padding: '8px 12px', border: '1px solid var(--color-gold-light)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{key.toUpperCase()} ({skillVal})</span>
                            <button className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.8rem' }} onClick={() => runSkillImprovement(key, key, skillVal)}>
                              Roll Improvement
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {winterStep === 3 && (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    Knights aged **35** and older must make an Aging check to see if time has begun degrading their martial physique.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(153,34,34,0.05)', padding: '15px', border: '1px solid var(--color-crimson)', borderRadius: '4px' }}>
                      <span className="form-label">Knight's Age:</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--color-crimson)', marginLeft: '8px' }}>{character.personal.age}</strong>
                    </div>
                    {character.personal.age >= 35 ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={runAgingRoll}>
                        <Dices size={16} style={{ marginRight: '6px' }} /> Roll Aging Check (d20)
                      </button>
                    ) : (
                      <p style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                        You are younger than 35. You skip this step!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {winterStep === 4 && (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    Linage events occur during the harsh winter. Roll d100 to determine if there were new births, marriages, record-breaking harvests, or tragic deaths at the manor.
                  </p>
                  <button className="btn-medieval btn-medieval-primary" onClick={runFamilyEvent}>
                    <Dices size={16} style={{ marginRight: '6px' }} /> Roll Winter Family Event
                  </button>
                </div>
              )}

              {winterStep === 5 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    Allocate your character improvements:
                  </p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
                    <li>Choose **one core Attribute** and increase it by **1** (up to your culture limit).</li>
                    <li>Add **1d6 points** to divide among your Skills (no skill can exceed 15 in this way).</li>
                    <li>Or, increase **one Passion** by **1** point.</li>
                  </ul>
                  <p style={{ color: 'var(--color-grey)', marginTop: '10px', fontSize: '0.85rem' }}>
                    * Open the <strong>Knight Sheet</strong> tab to apply these changes directly!
                  </p>
                </div>
              )}

              {winterStep === 6 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    Pay the maintenance for your squire, knights, and horses.
                  </p>
                  <div style={{ backgroundColor: 'rgba(179,143,67,0.05)', padding: '15px', border: '1px solid var(--color-gold)', borderRadius: '4px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Standard Annual Maintenance Expenses:</p>
                    <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem' }}>
                      <li>Standard Knight: <strong>£2</strong> per year</li>
                      <li>Standard Squire: <strong>£1</strong> per year</li>
                      <li>Ration maintenance for 1 Warhorse: <strong>£1</strong> per year</li>
                    </ul>
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                    If you cannot pay, you suffer the **Under-maintained** status effect (-3 SIZ, -3 DEX for the next season).
                  </p>
                </div>
              )}

              {winterStep === 7 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    Congratulations, you survived the winter! Complete these final tasks:
                  </p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem' }}>
                    <li>Gain **1/10th of your Total Glory** as a direct yearly bonus to your current session Glory.</li>
                    <li>If your session Glory exceeds 1,000, convert it to permanent Glory points and increment your Knight's lineage standing.</li>
                    <li>**Age your character** by 1 year.</li>
                  </ul>
                  <button 
                    className="btn-medieval btn-medieval-primary" 
                    onClick={() => {
                      setCharacter(prev => ({
                        ...prev,
                        personal: { ...prev.personal, age: (prev.personal.age || 0) + 1 }
                      }));
                      setLogMessages(prev => ["Surviving the Winter: Aged your character by exactly 1 year! 🎉 Have a blessed Spring campaign!", ...prev]);
                    }}
                    style={{ marginTop: '15px' }}
                  >
                    Age +1 Year & Start Spring
                  </button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gold-light)', paddingTop: '15px' }}>
              <button className="btn-medieval" disabled={winterStep === 1} onClick={() => setWinterStep(w => w - 1)}>
                <ChevronLeft size={16} /> Prev Step
              </button>
              <button className="btn-medieval" disabled={winterStep === 7} onClick={() => setWinterStep(w => w + 1)}>
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Winter Dice Roller / Console log */}
          <div className="medieval-card">
            <h3 className="card-title">Winter Console Log (정산 기록 보관함)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '240px', overflowY: 'auto', backgroundColor: '#fff', padding: '12px', border: '1px solid var(--color-gold-light)', borderRadius: '2px' }}>
              {logMessages.length === 0 ? (
                <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', marginTop: '80px' }}>
                  No rolls have been made yet in this winter phase.
                </div>
              ) : (
                logMessages.map((msg, i) => (
                  <div key={i} style={{ fontSize: '0.88rem', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '6px', lineHeight: '1.4' }}>
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
