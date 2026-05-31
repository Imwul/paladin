import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { maleNames, femaleNames, surnames, locations, titles } from '../data/names';
import { rollGrades, yesNoOracle, soloScenariosRef } from '../data/oracles';
import { Dices, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';

export default function SoloOracles({ setCharacter }) {
  const [d20Result, setD20Result] = useState(null);
  const [d6Count, setD6Count] = useState(1);
  const [d6Results, setD6Results] = useState([]);
  const [d6Sum, setD6Sum] = useState(0);
  const [targetSkill, setTargetSkill] = useState(10);
  const [rollResolution, setRollResolution] = useState(null);
  const [oracleAnswer, setOracleAnswer] = useState(null);
  const [generatedName, setGeneratedName] = useState(null);

  const rollD20 = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setD20Result(roll);
    let resolution = null;
    if (roll === 20) resolution = rollGrades.FUMBLE;
    else if (roll === 1) resolution = rollGrades.CRITICAL;
    else if (roll === targetSkill) resolution = rollGrades.CRITICAL;
    else if (roll < targetSkill) resolution = rollGrades.SUCCESS;
    else resolution = rollGrades.FAILURE;
    setRollResolution(resolution);
  };

  const rollD6Pool = () => {
    const rolls = [];
    let sum = 0;
    for (let i = 0; i < d6Count; i++) { const r = Math.floor(Math.random() * 6) + 1; rolls.push(r); sum += r; }
    setD6Results(rolls);
    setD6Sum(sum);
  };

  const askOracle = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    let match = null;
    if (roll <= 2) match = yesNoOracle[0];
    else if (roll <= 8) match = yesNoOracle[1];
    else if (roll <= 12) match = yesNoOracle[2];
    else if (roll <= 18) match = yesNoOracle[3];
    else match = yesNoOracle[4];
    setOracleAnswer({ roll, ...match });
  };

  const generateFrankishName = () => {
    const isMale = Math.random() > 0.5;
    const namePool = isMale ? maleNames : femaleNames;
    const name = namePool[Math.floor(Math.random() * namePool.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    setGeneratedName({
      title, name, surname, loc,
      fullTextEN: `${title.en} ${name.en} ${surname.en} of ${loc.en}`,
      fullTextKO: `${title.ko} ${name.ko} ${surname.ko} ${loc.ko}`
    });
  };

  const applyName = () => {
    if (!generatedName) return;
    const cleanName = `${generatedName.name.en} ${generatedName.surname.en}`;
    setCharacter(prev => ({ ...prev, personal: { ...prev.personal, name: cleanName, homeland: generatedName.loc.en } }));
    alert(`[${cleanName}]이 기사 시트에 적용되었습니다!`);
  };

  return (
    <div className="cs-page view-animate">

      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">솔로 오라클 및 주사위</h4>
          <p>d20 판정, 예/아니오 신탁, 이름 생성기를 활용하세요.</p>
        </div>
      </div>

      {/* Dice row */}
      <div className="cs-row">
        {/* d20 */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><Dices size={16} style={{ marginRight: '6px' }} />d20 판정기</h3></div>
          <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="cs-field">
              <span className="cs-field-label">기준값:</span>
              <input type="number" value={targetSkill} min={1} max={20}
                onChange={e => setTargetSkill(parseInt(e.target.value) || 1)} style={{ maxWidth: '80px' }} />
            </div>
            <button className="btn-medieval btn-medieval-primary" onClick={rollD20} style={{ justifyContent: 'center' }}>
              d20 판정 던지기
            </button>
            {d20Result && (
              <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>주사위</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: rollResolution?.color || 'inherit', margin: '-6px 0' }}>{d20Result}</div>
                {rollResolution && (
                  <div style={{ marginTop: '4px' }}>
                    <h4 style={{ color: rollResolution.color, fontWeight: 'bold', fontSize: '1rem' }}>{rollResolution.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginTop: '2px' }}>{rollResolution.desc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* d6 */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><Dices size={16} style={{ marginRight: '6px' }} />d6 피해 롤러</h3></div>
          <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="cs-field">
              <span className="cs-field-label">주사위 수:</span>
              <input type="number" value={d6Count} min={1} max={15}
                onChange={e => setD6Count(parseInt(e.target.value) || 1)} style={{ maxWidth: '80px' }} />
            </div>
            <button className="btn-medieval btn-medieval-primary" onClick={rollD6Pool} style={{ justifyContent: 'center' }}>
              d6 피해 굴리기
            </button>
            {d6Results.length > 0 && (
              <div style={{ border: '1px solid var(--color-gold-light)', padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {d6Results.map((r, i) => (
                    <span key={i} style={{ border: '1px solid var(--color-ink)', padding: '3px 8px', fontSize: '1.1rem', fontWeight: 'bold', background: '#fff' }}>{r}</span>
                  ))}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  합계: <span style={{ color: 'var(--color-crimson)', fontSize: '1.3rem' }}>{d6Sum}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Oracle + Name Gen row */}
      <div className="cs-row">
        {/* Oracle */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><HelpCircle size={16} style={{ marginRight: '6px' }} />예/아니오 오라클</h3></div>
          <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
              상황에 대한 질문을 떠올리고 운명에 물어보세요:
            </p>
            <button className="btn-medieval" onClick={askOracle} style={{ justifyContent: 'center' }}>오라클에 묻기</button>
            {oracleAnswer && (
              <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)' }}>d20 결과 {oracleAnswer.roll}</span>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.05rem', margin: '4px 0' }}>{oracleAnswer.result}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)' }}>{oracleAnswer.desc}</p>
              </div>
            )}
          </div>
        </section>

        {/* Name Gen */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><RefreshCw size={16} style={{ marginRight: '6px' }} />이름 생성기</h3></div>
          <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
              프랑크인 이름과 작위를 자동 생성합니다:
            </p>
            <button className="btn-medieval" onClick={generateFrankishName} style={{ justifyContent: 'center' }}>이름 생성</button>
            {generatedName && (
              <div style={{ border: '1px solid var(--color-gold)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px dashed var(--color-gold-light)', paddingBottom: '6px' }}>
                  <ProperNoun en={generatedName.fullTextEN} ko={generatedName.fullTextKO} />
                </div>
                <button className="btn-medieval" onClick={applyName} style={{ fontSize: '0.8rem', padding: '3px 8px', justifyContent: 'center' }}>
                  시트에 적용
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Quick Reference */}
      <section className="cs-section">
        <div className="sheet-ribbon"><h3>솔로 규칙 요약집</h3></div>
        <div className="cs-section-inner">
          <div className="cs-row" style={{ gap: '16px' }}>
            {soloScenariosRef.map((sc, i) => (
              <div key={i} style={{ flex: '1 1 250px', minWidth: 0, borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '10px' }}>
                <h4 style={{ color: 'var(--color-royal-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                  {sc.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginBottom: '6px' }}>{sc.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '8px', borderLeft: '2px solid var(--color-gold-light)' }}>
                  {sc.flow.map((f, fi) => (
                    <span key={fi} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ArrowRight size={9} color="var(--color-gold)" />{f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
