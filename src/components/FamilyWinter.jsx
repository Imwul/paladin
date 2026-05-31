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

    const msg = `[${label} 성장 굴림]: d20 굴림결과 [${roll}] vs 현재치 [${currentVal}]. ${success ? `성공! 기술 수치가 ${newVal}로 상승했습니다 🎉` : '상승 실패.'}`;
    setLogMessages(prev => [msg, ...prev]);
  };

  // Step 3: Aging Roll Helper
  const runAgingRoll = () => {
    const age = character.personal.age || 0;
    if (age < 35) {
      setLogMessages(prev => [`현재 나이 ${age}세 (35세 미만). 청춘의 정점에 있으므로 노화 굴림을 생략합니다.`, ...prev]);
      return;
    }

    const roll = Math.floor(Math.random() * 20) + 1;
    let msg = `[노화 굴림 (나이 ${age}세)]: d20 결과 [${roll}]. `;
    
    if (roll === 20) {
      msg += "치명적 노화! 신체 기능의 쇠퇴로 STR, CON, DEX, SIZ 수치가 각각 1씩 영구 하락합니다.";
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
      msg += "일반 노화 발생. STR/CON/DEX 중 원하는 스탯 하나를 1점 하락시켜야 합니다.";
    } else {
      msg += "아직 강건합니다! 올해는 능력치 하락이 발생하지 않았습니다.";
    }

    setLogMessages(prev => [msg, ...prev]);
  };

  // Step 4: Random Family Event generator (d100)
  const runFamilyEvent = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    let outcome = "";

    if (roll <= 10) outcome = "탄생: 가문에 건강한 남자아이(후계자)가 태어났습니다! 가계가 든든하게 이어집니다. (+50 Glory 영예)";
    else if (roll <= 20) outcome = "탄생: 가문에 딸아이가 태어났습니다. 훗날 정략결혼의 기회가 올 것입니다. (+20 Glory 영예)";
    else if (roll <= 40) outcome = "결혼: 사촌이나 형제가 명망 높은 가문과 좋은 혼인을 올렸습니다. 지참금을 얻습니다. (+1d6 £ 돈)";
    else if (roll <= 60) outcome = "풍년: 올해 영지의 농사가 대풍작을 이뤘습니다. 추가 수입이 들어옵니다. (+2d6 £ 돈)";
    else if (roll <= 80) outcome = "평온한 해: 가문에 아무런 큰 우환이 없었습니다. 무난하고 안정적인 1년입니다.";
    else if (roll <= 90) outcome = "역병/질병: 가문의 어르신이나 식솔이 큰 병에 걸렸습니다. 응급처치/의술 판정에 실패하면 치료비 1£가 지출됩니다.";
    else outcome = "비극: 친족 기사 중 한 명이 전투나 역병으로 전사했습니다. 홀에 깊은 애도가 감돕니다. (-50 Glory 영예)";

    setLogMessages(prev => [`[가문 겨울 사건 (d100 굴림결과 ${roll})]: ${outcome}`, ...prev]);
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
          <h4 className="tutorial-banner-title">가문 관리 및 겨울 단계 정산 안내</h4>
          <p>
            기사의 모험은 1년 주기로 순환합니다. 봄부터 가을까지는 모험을 겪으며 사용한 기술을 체크해 두고, 
            겨울이 찾아오면 **겨울 단계 정산** 탭을 열어 1년의 성과를 정산합니다. 사용한 기술의 성장을 굴리고, 노화와 가문 돌발 이벤트를 판정하여 새로운 봄을 맞이할 준비를 하세요.
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '15px', margin: '20px 0', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '10px' }}>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: activeSubTab === 'family' ? 'bold' : 'normal', color: activeSubTab === 'family' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('family')}
        >
          가문 정보 시트
        </button>
        <span style={{ color: 'var(--color-gold-light)' }}>|</span>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: activeSubTab === 'winter' ? 'bold' : 'normal', color: activeSubTab === 'winter' ? 'var(--color-crimson)' : 'var(--color-ink-light)' }}
          onClick={() => setActiveSubTab('winter')}
        >
          겨울 단계 정산 헬퍼 (7단계)
        </button>
      </div>

      {/* SUB TAB 1: FAMILY SHEET */}
      {activeSubTab === 'family' && (
        <div className="medieval-card view-animate">
          <h3 className="card-title">가문 명망 및 가계 혈통 시트</h3>
          <div className="medieval-form-grid">
            <div className="form-group">
              <label className="form-label">가문 성씨 (Family Name)</label>
              <input type="text" className="form-input" value={character.family.name} onChange={e => handleFamilyChange('name', e.target.value)} placeholder="예: 아르덴 (Ardennes)" />
            </div>
            <div className="form-group">
              <label className="form-label">가문 가언 / 신조 (Motto)</label>
              <input type="text" className="form-input" value={character.family.motto} onChange={e => handleFamilyChange('motto', e.target.value)} placeholder="예: 명예와 신조 (Honor and Faith)" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">전투 함성 (Battle Cry)</label>
              <input type="text" className="form-input" value={character.family.battleCry} onChange={e => handleFamilyChange('battleCry', e.target.value)} placeholder="예: 몽주아 생드니! (Montjoie Saint-Denis!)" />
            </div>
            <div className="form-group">
              <label className="form-label">가문 시조 (Founding Ancestor)</label>
              <input type="text" className="form-input" value={character.family.ancestor} onChange={e => handleFamilyChange('ancestor', e.target.value)} placeholder="예: 고드프루아 경 (Sir Godefroy)" />
            </div>
            <div className="form-group">
              <label className="form-label">영지 / 고향 (Home Country)</label>
              <input type="text" className="form-input" value={character.family.homeCountry} onChange={e => handleFamilyChange('homeCountry', e.target.value)} placeholder="예: 아키텐 (Aquitaine)" />
            </div>
            <div className="form-group">
              <label className="form-label">수호 성인 (Patron Saint)</label>
              <input type="text" className="form-input" value={character.family.patronSaint} onChange={e => handleFamilyChange('patronSaint', e.target.value)} placeholder="예: 성 데니스 (St. Denis)" />
            </div>
            <div className="form-group">
              <label className="form-label">가문 누적 명예 (Honor)</label>
              <input type="number" className="form-input" value={character.family.honor} onChange={e => handleFamilyChange('honor', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">우방 가문 / 든든한 동맹 (Allies)</label>
              <textarea className="form-input" rows={2} value={character.family.allies} onChange={e => handleFamilyChange('allies', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">가문의 숙적 / 적대 세력 (Enemies)</label>
              <textarea className="form-input" rows={2} value={character.family.enemies} onChange={e => handleFamilyChange('enemies', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: WINTER PHASE HELPER */}
      {activeSubTab === 'winter' && (
        <div className="winter-grid">
          
          {/* Main Step wizard */}
          <div className="medieval-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--color-gold-light)', paddingBottom: '8px' }}>
              <h3 style={{ color: 'var(--color-crimson)' }}>
                {winterStep}단계 / 총 7단계: {
                  winterStep === 1 ? "1. 모험 정리 및 최종 기록" :
                  winterStep === 2 ? "2. 사용한 기술 성장 판정 (d20)" :
                  winterStep === 3 ? "3. 기사의 노화 판정 (Aging)" :
                  winterStep === 4 ? "4. 겨울 가문 돌발 사건 판정 (d100)" :
                  winterStep === 5 ? "5. 훈련 및 자유 성장" :
                  winterStep === 6 ? "6. 영지 및 기사 유지비 납부" :
                  "7. 영예의 수확 및 다음 해의 시작"
                }
              </h3>
              <button className="btn-medieval" onClick={resetWinter} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                <RotateCcw size={12} /> 처음부터
              </button>
            </div>

            {/* Step content */}
            <div style={{ minHeight: '180px', marginBottom: '20px' }}>
              {winterStep === 1 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    <strong>연대기 & 일지</strong> 탭으로 이동하여 올해 있었던 원정과 주요 사건들을 최종 점검해 보세요.
                    영웅담이나 전투의 흔적을 기사의 역사의 한 페이지로 온전히 남기는 단계입니다.
                  </p>
                  <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>
                    * 팁: 올해 전설적인 위업을 달성했다면, 기사 시트의 누적 영예(Glory)를 수동으로 상승시키는 것을 잊지 마세요.
                  </p>
                </div>
              )}

              {winterStep === 2 && (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    모험 중 성공적으로 사용해 경험치를 체크해 둔 기술들을 훈련합니다. 
                    d20을 굴려 **본인의 현재 기술 값보다 큰 숫자**가 나오거나, 혹은 대성공인 **20**이 나오면 훈련에 성공하여 기술이 **1점 영구 상승**하며 체크가 지워집니다!
                  </p>

                  {checkedSkills.length === 0 ? (
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-grey-light)', color: 'var(--color-ink-light)', textAlign: 'center', border: '1px dashed var(--color-gold)' }}>
                      체크된 성장 기술이 없습니다. (시트에서 기술 옆 동그라미를 누르면 체크됩니다)
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                      {checkedSkills.map(key => {
                        const skillVal = character.skills[key] || 0;
                        return (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(179,143,67,0.05)', padding: '8px 12px', border: '1px solid var(--color-gold-light)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{key.toUpperCase()} ({skillVal}점)</span>
                            <button className="btn-medieval" style={{ padding: '3px 8px', fontSize: '0.8rem' }} onClick={() => runSkillImprovement(key, key, skillVal)}>
                              성장 굴림 실행
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
                    기사의 나이가 **35세** 이상인 경우, 혹독한 세월이 기사의 무골을 쇠퇴하게 만들고 있는지 노화 굴림을 굴려 확인해야 합니다.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(153,34,34,0.05)', padding: '15px', border: '1px solid var(--color-crimson)', borderRadius: '4px' }}>
                      <span className="form-label">현재 기사의 나이:</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--color-crimson)', marginLeft: '8px' }}>{character.personal.age}세</strong>
                    </div>
                    {character.personal.age >= 35 ? (
                      <button className="btn-medieval btn-medieval-primary" onClick={runAgingRoll}>
                        <Dices size={16} style={{ marginRight: '6px' }} /> 노화 주사위 굴리기 (d20)
                      </button>
                    ) : (
                      <p style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                        기사의 나이가 아직 35세 미만입니다. 노화를 염려할 때가 아닙니다. 다음 단계로 넘어가세요!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {winterStep === 4 && (
                <div>
                  <p style={{ marginBottom: '15px' }}>
                    추운 겨울 동안 영지와 가문에서 일어난 무작위 이벤트를 판정합니다. 출생, 혼사, 풍년 혹은 예기치 못한 우환이 있었는지 100면체 주사위를 굴립니다.
                  </p>
                  <button className="btn-medieval btn-medieval-primary" onClick={runFamilyEvent}>
                    <Dices size={16} style={{ marginRight: '6px' }} /> 가문 사건 굴리기 (d100)
                  </button>
                </div>
              )}

              {winterStep === 5 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    겨울 동안의 여유 시간을 이용해 기사의 능력치를 자유롭게 한 번 더 단련합니다. 다음 혜택 중 하나를 골라 시트에 직접 적어 넣으세요:
                  </p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
                    <li><strong>기본 능력치 훈련:</strong> 핵심 능력치(DEX, STR 등) 중 원하는 스탯 1점을 영구적으로 올립니다 (문화 한계치까지).</li>
                    <li><strong>기술 숙련도 훈련:</strong> 1d6을 굴려 나온 수치만큼 기술 포인트들을 자유롭게 분배하여 올립니다 (개별 기술 상한 15점).</li>
                    <li><strong>열망/Passion 연마:</strong> 마음에 품은 기사의 열망 중 하나를 고 골라 1점 올립니다.</li>
                  </ul>
                  <p style={{ color: 'var(--color-grey)', marginTop: '10px', fontSize: '0.85rem' }}>
                    * 결정한 뒤 <strong>기사 시트</strong> 탭을 열어 수치를 바로 반영해 주세요!
                  </p>
                </div>
              )}

              {winterStep === 6 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    기사의 품위를 유지하고 충성스러운 종자와 군마를 관리하기 위해 영지 및 개인 금고에서 연간 유지비를 정산해 납부합니다.
                  </p>
                  <div style={{ backgroundColor: 'rgba(179,143,67,0.05)', padding: '15px', border: '1px solid var(--color-gold)', borderRadius: '4px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>표준 기사 연간 유지 정산 가이드:</p>
                    <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem' }}>
                      <li>기사 본인의 사격 품위 유지 비용: <strong>2 £</strong></li>
                      <li>충직한 종자(Squire)의 복지 및 식비: <strong>1 £</strong></li>
                      <li>전투마의 사료 및 전술 훈련 유지비: 마리당 <strong>1 £</strong></li>
                    </ul>
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--color-crimson)' }}>
                    * 지출 비용을 내지 못하면 다음 해 모험에서 **유지 부족(Under-maintained)** 상태이상에 걸려 스탯 패널티(-3 SIZ, -3 DEX)를 겪게 됩니다!
                  </p>
                </div>
              )}

              {winterStep === 7 && (
                <div>
                  <p style={{ marginBottom: '10px' }}>
                    축하합니다! 혹독한 겨울을 무사히 극복하고 새로운 봄의 캠페인을 개막합니다:
                  </p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem' }}>
                    <li><strong>영예 보너스:</strong> 가문 누적 총 영예(Total Glory) 수치의 1/10에 해당하는 값을 이번 세션 영예에 즉시 보너스로 보태줍니다.</li>
                    <li><strong>나이 1살 증가:</strong> 기사의 연륜이 한 해 깊어졌습니다. 나이를 1살 증가시킵니다.</li>
                    <li>모든 전투마와 종자들의 HP를 가득 채우고 새로운 모험을 떠나세요!</li>
                  </ul>
                  <button 
                    className="btn-medieval btn-medieval-primary" 
                    onClick={() => {
                      setCharacter(prev => ({
                        ...prev,
                        personal: { ...prev.personal, age: (prev.personal.age || 0) + 1 }
                      }));
                      setLogMessages(prev => ["겨울 정산 최종 완료: 기사의 나이가 1세 늘어났습니다! 대지 위에 따뜻한 봄의 전령이 깃듭니다. 새로운 성전을 떠나세요! ⚔️", ...prev]);
                    }}
                    style={{ marginTop: '15px' }}
                  >
                    새로운 봄 맞이하기 (나이 +1세)
                  </button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-gold-light)', paddingTop: '15px' }}>
              <button className="btn-medieval" disabled={winterStep === 1} onClick={() => setWinterStep(w => w - 1)}>
                <ChevronLeft size={16} /> 이전 단계
              </button>
              <button className="btn-medieval" disabled={winterStep === 7} onClick={() => setWinterStep(w => w + 1)}>
                다음 단계 <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Winter Dice Roller / Console log */}
          <div className="medieval-card">
            <h3 className="card-title">겨울 정산 결과 기록실</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '240px', overflowY: 'auto', backgroundColor: '#fff', padding: '12px', border: '1px solid var(--color-gold-light)', borderRadius: '2px' }}>
              {logMessages.length === 0 ? (
                <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', marginTop: '80px' }}>
                  아직 올해 겨울 굴림을 진행하지 않았습니다.
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
