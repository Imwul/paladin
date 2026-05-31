import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { Shield, Dices, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

export default function FamilyWinter({ character, setCharacter }) {
  const [activeSubTab, setActiveSubTab] = useState('family');
  const [winterStep, setWinterStep] = useState(1);
  const [logMessages, setLogMessages] = useState([]);

  const handleFamilyChange = (field, value) => {
    setCharacter(prev => ({ ...prev, family: { ...prev.family, [field]: value } }));
  };

  const runSkillImprovement = (skillKey, label, currentVal) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    let success = false;
    let newVal = currentVal;
    if (roll > currentVal || roll === 20) {
      if (currentVal < 20) { success = true; newVal = currentVal + 1; }
    }
    setCharacter(prev => {
      const updatedSkills = { ...prev.skills, [skillKey]: newVal };
      const updatedChecked = { ...prev.skillsChecked, [skillKey]: false };
      return { ...prev, skills: updatedSkills, skillsChecked: updatedChecked };
    });
    setLogMessages(prev => [`[${label} 성장]: d20 [${roll}] vs [${currentVal}]. ${success ? `성공! → ${newVal} 🎉` : '실패.'}`, ...prev]);
  };

  const runAgingRoll = () => {
    const age = character.personal.age || 0;
    if (age < 35) {
      setLogMessages(prev => [`현재 ${age}세 (35세 미만). 노화 생략.`, ...prev]);
      return;
    }
    const roll = Math.floor(Math.random() * 20) + 1;
    let msg = `[노화 (${age}세)]: d20 [${roll}]. `;
    if (roll === 20) {
      msg += "치명적 노화! STR, CON, DEX, SIZ 각 -1.";
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
      msg += "일반 노화. STR/CON/DEX 중 하나 -1.";
    } else {
      msg += "아직 강건! 능력치 하락 없음.";
    }
    setLogMessages(prev => [msg, ...prev]);
  };

  const runFamilyEvent = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    let outcome = "";
    if (roll <= 10) outcome = "탄생: 건강한 남자아이 태어남! (+50 Glory)";
    else if (roll <= 20) outcome = "탄생: 딸아이 태어남. (+20 Glory)";
    else if (roll <= 40) outcome = "결혼: 명망 가문과 혼인. (+1d6 £)";
    else if (roll <= 60) outcome = "풍년: 대풍작! (+2d6 £)";
    else if (roll <= 80) outcome = "평온한 해: 무난한 1년.";
    else if (roll <= 90) outcome = "역병: 식솔이 큰 병에 걸림. 치료비 1£ 필요.";
    else outcome = "비극: 친족 기사 전사. (-50 Glory)";
    setLogMessages(prev => [`[가문 사건 (d100: ${roll})]: ${outcome}`, ...prev]);
  };

  const resetWinter = () => { setWinterStep(1); setLogMessages([]); };
  const checkedSkills = Object.keys(character.skillsChecked).filter(k => character.skillsChecked[k]);

  const stepTitles = [
    "1. 모험 정리 및 최종 기록",
    "2. 기술 성장 판정 (d20)",
    "3. 노화 판정 (Aging)",
    "4. 가문 돌발 사건 (d100)",
    "5. 훈련 및 자유 성장",
    "6. 유지비 납부",
    "7. 영예 수확 & 새해 개막"
  ];

  return (
    <div className="cs-page view-animate">

      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">가문 관리 및 겨울 단계 정산</h4>
          <p>1년 주기의 모험 후, 겨울에 성과를 정산합니다. 기술 성장, 노화, 가문 이벤트를 판정하세요.</p>
        </div>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px', marginBottom: '4px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: activeSubTab === 'family' ? 'bold' : 'normal', color: activeSubTab === 'family' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('family')}>가문 정보 시트</button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: activeSubTab === 'winter' ? 'bold' : 'normal', color: activeSubTab === 'winter' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('winter')}>겨울 정산 (7단계)</button>
      </div>

      {/* FAMILY SHEET */}
      {activeSubTab === 'family' && (
        <section className="cs-section view-animate">
          <div className="sheet-ribbon"><h3>가문 명망 및 가계 혈통</h3></div>
          <div className="cs-section-inner">
            <div className="cs-field-grid">
              {[
                { key: 'name', label: '가문 성씨', ph: '예: 아르덴' },
                { key: 'motto', label: '가언/신조', ph: '예: 명예와 신조' },
                { key: 'battleCry', label: '전투 함성', ph: '예: 몽주아 생드니!' },
                { key: 'ancestor', label: '가문 시조', ph: '예: 고드프루아 경' },
                { key: 'homeCountry', label: '영지/고향', ph: '예: 아키텐' },
                { key: 'patronSaint', label: '수호 성인', ph: '예: 성 데니스' },
              ].map(f => (
                <div className="cs-field" key={f.key}>
                  <span className="cs-field-label">{f.label}:</span>
                  <input type="text" value={character.family[f.key] || ''} placeholder={f.ph}
                    onChange={e => handleFamilyChange(f.key, e.target.value)} />
                </div>
              ))}
              <div className="cs-field">
                <span className="cs-field-label">누적 명예:</span>
                <input type="number" value={character.family.honor || 0}
                  onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>우방 동맹:</label>
                <textarea className="form-input" rows={2} value={character.family.allies || ''} style={{ width: '100%' }}
                  onChange={e => handleFamilyChange('allies', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>적대 세력:</label>
                <textarea className="form-input" rows={2} value={character.family.enemies || ''} style={{ width: '100%' }}
                  onChange={e => handleFamilyChange('enemies', e.target.value)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WINTER PHASE */}
      {activeSubTab === 'winter' && (
        <div className="view-animate">
          {/* Step Wizard */}
          <section className="cs-section">
            <div className="sheet-ribbon">
              <h3>{stepTitles[winterStep - 1]}</h3>
            </div>
            <div className="cs-section-inner">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button className="btn-medieval" onClick={resetWinter} style={{ fontSize: '0.8rem', padding: '3px 8px' }}>
                  <RotateCcw size={12} /> 처음부터
                </button>
              </div>

              <div style={{ minHeight: '150px', marginBottom: '16px' }}>
                {winterStep === 1 && (
                  <div>
                    <p style={{ marginBottom: '8px' }}><strong>연대기 &amp; 일지</strong> 탭에서 올해 사건들을 최종 점검해 보세요.</p>
                    <p style={{ color: 'var(--color-grey)', fontSize: '0.85rem' }}>* 팁: 전설적 위업을 달성했다면 영예(Glory)를 수동으로 올리세요.</p>
                  </div>
                )}
                {winterStep === 2 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>체크된 기술을 d20으로 굴려 <strong>현재 값 초과 또는 20</strong>이 나오면 +1 상승!</p>
                    {checkedSkills.length === 0 ? (
                      <div style={{ padding: '12px', backgroundColor: 'var(--color-grey-light)', textAlign: 'center', border: '1px dashed var(--color-gold)', color: 'var(--color-ink-light)', fontSize: '0.9rem' }}>
                        체크된 기술 없음. (시트에서 ☐를 클릭하세요)
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {checkedSkills.map(key => (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', border: '1px solid var(--color-gold-light)', background: 'rgba(179,143,67,0.04)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{key} ({character.skills[key]}점)</span>
                            <button className="btn-medieval" style={{ padding: '2px 8px', fontSize: '0.8rem' }} onClick={() => runSkillImprovement(key, key, character.skills[key])}>
                              <Dices size={12} /> 굴림
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {winterStep === 3 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>35세 이상이면 노화 굴림을 해야 합니다.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '10px 14px', border: '1px solid var(--color-crimson)', background: 'rgba(153,34,34,0.04)' }}>
                        <span style={{ fontSize: '0.9rem' }}>현재 나이: </span>
                        <strong style={{ fontSize: '1.3rem', color: 'var(--color-crimson)' }}>{character.personal.age}세</strong>
                      </div>
                      {character.personal.age >= 35 ? (
                        <button className="btn-medieval btn-medieval-primary" onClick={runAgingRoll}>
                          <Dices size={14} /> 노화 d20
                        </button>
                      ) : (
                        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '0.9rem' }}>35세 미만 — 노화 없음!</p>
                      )}
                    </div>
                  </div>
                )}
                {winterStep === 4 && (
                  <div>
                    <p style={{ marginBottom: '12px' }}>겨울 동안 영지와 가문의 무작위 이벤트를 d100으로 판정합니다.</p>
                    <button className="btn-medieval btn-medieval-primary" onClick={runFamilyEvent}>
                      <Dices size={14} /> 가문 사건 d100
                    </button>
                  </div>
                )}
                {winterStep === 5 && (
                  <div>
                    <p style={{ marginBottom: '8px' }}>겨울 여유 시간 동안 자유 단련. 하나를 골라 시트에 반영:</p>
                    <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                      <li><strong>능력치 훈련:</strong> DEX/STR 등 1점 영구 상승</li>
                      <li><strong>기술 훈련:</strong> 1d6만큼 기술 포인트 분배 (상한 15)</li>
                      <li><strong>열망 연마:</strong> Passion 하나 +1</li>
                    </ul>
                  </div>
                )}
                {winterStep === 6 && (
                  <div>
                    <p style={{ marginBottom: '8px' }}>연간 유지비 정산:</p>
                    <div style={{ padding: '10px', border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.04)', fontSize: '0.9rem' }}>
                      <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <li>기사 품위 유지: <strong>2 £</strong></li>
                        <li>종자 복지비: <strong>1 £</strong></li>
                        <li>전투마 유지: 마리당 <strong>1 £</strong></li>
                      </ul>
                    </div>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-crimson)' }}>* 미납 시 다음 해 스탯 패널티!</p>
                  </div>
                )}
                {winterStep === 7 && (
                  <div>
                    <p style={{ marginBottom: '8px' }}>겨울을 무사히 극복! 새 봄을 준비합니다:</p>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      <li><strong>영예 보너스:</strong> 총 Glory의 1/10을 세션 영예에 추가</li>
                      <li><strong>나이 +1세</strong></li>
                      <li>전투마와 종자 HP 가득 채우기</li>
                    </ul>
                    <button className="btn-medieval btn-medieval-primary" onClick={() => {
                      setCharacter(prev => ({ ...prev, personal: { ...prev.personal, age: (prev.personal.age || 0) + 1 } }));
                      setLogMessages(prev => ["겨울 정산 완료: 나이 +1! 새 봄입니다 ⚔️", ...prev]);
                    }}>새로운 봄 맞이하기 (나이 +1)</button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gold-light)', paddingTop: '12px' }}>
                <button className="btn-medieval" disabled={winterStep === 1} onClick={() => setWinterStep(w => w - 1)}>
                  <ChevronLeft size={14} /> 이전
                </button>
                <button className="btn-medieval" disabled={winterStep === 7} onClick={() => setWinterStep(w => w + 1)}>
                  다음 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* Log */}
          <section className="cs-section" style={{ marginTop: '8px' }}>
            <div className="sheet-ribbon"><h3>정산 결과 기록실</h3></div>
            <div className="cs-section-inner">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', border: '1px solid var(--color-gold-light)' }}>
                {logMessages.length === 0 ? (
                  <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '40px 0' }}>
                    아직 올해 겨울 굴림을 진행하지 않았습니다.
                  </div>
                ) : (
                  logMessages.map((msg, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '5px', lineHeight: 1.4 }}>
                      {msg}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
