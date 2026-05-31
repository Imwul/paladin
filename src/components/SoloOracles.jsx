import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { maleNames, femaleNames, surnames, locations, titles } from '../data/names';
import { rollGrades, yesNoOracle, soloScenariosRef } from '../data/oracles';
import { Dices, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';

// D6 Tactile Dice Face Component
const DiceFace = ({ value, isRolling }) => {
  const activeDotsMap = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  const activeDots = activeDotsMap[value] || [];
  return (
    <div className={`die-face ${isRolling ? 'roll-blur' : 'roll-pop'}`} data-val={value}>
      {[...Array(9)].map((_, i) => (
        <div key={i} className="die-cell">
          {activeDots.includes(i) && <div className="die-dot" />}
        </div>
      ))}
    </div>
  );
};

// D20 Tactile Icosahedron Component
const D20Face = ({ value, isRolling, color }) => {
  return (
    <div className={`d20-container ${isRolling ? 'roll-blur' : 'roll-pop'}`}>
      <svg viewBox="0 0 100 100" className="d20-svg">
        {/* 중앙 삼각형 */}
        <polygon points="50,25 24,70 76,70" className="d20-face-center" />
        
        {/* 외곽 삼각형 3D 투영 면들 */}
        <polygon points="50,5 50,25 7,30" className="d20-face-outer" />
        <polygon points="50,5 93,30 50,25" className="d20-face-outer" />
        <polygon points="93,30 93,75 76,70" className="d20-face-outer" />
        <polygon points="93,75 50,95 76,70" className="d20-face-outer" />
        <polygon points="50,95 7,75 24,70" className="d20-face-outer" />
        <polygon points="7,75 7,30 24,70" className="d20-face-outer" />
        <polygon points="7,30 50,25 24,70" className="d20-face-outer" />
        <polygon points="93,30 50,25 76,70" className="d20-face-outer" />
        <polygon points="24,70 50,95 76,70" className="d20-face-outer" />
        
        {/* 내부 와이어프레임 입체 구분선 */}
        <line x1="50" y1="5" x2="50" y2="25" className="d20-line" />
        <line x1="93" y1="30" x2="50" y2="25" className="d20-line" />
        <line x1="93" y1="30" x2="76" y2="70" className="d20-line" />
        <line x1="93" y1="75" x2="76" y2="70" className="d20-line" />
        <line x1="50" y1="95" x2="76" y2="70" className="d20-line" />
        <line x1="50" y1="95" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="75" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="30" x2="24" y2="70" className="d20-line" />
        <line x1="7" y1="30" x2="50" y2="25" className="d20-line" />
        
        <polygon points="50,5 93,30 93,75 50,95 7,75 7,30" className="d20-outline" />
      </svg>
      <div className="d20-number" style={{ color: color || 'var(--color-crimson)' }}>
        {value}
      </div>
    </div>
  );
};

export default function SoloOracles({ setCharacter }) {
  const [d20Result, setD20Result] = useState(null);
  const [d6Count, setD6Count] = useState(1);
  const [d6Results, setD6Results] = useState([]);
  const [d6Sum, setD6Sum] = useState(0);
  const [targetSkill, setTargetSkill] = useState(10);
  const [rollResolution, setRollResolution] = useState(null);
  const [oracleAnswer, setOracleAnswer] = useState(null);
  const [generatedName, setGeneratedName] = useState(null);

  // Animation states
  const [isRollingD20, setIsRollingD20] = useState(false);
  const [isRollingD6, setIsRollingD6] = useState(false);
  const [isRollingOracle, setIsRollingOracle] = useState(false);
  const [isRollingName, setIsRollingName] = useState(false);

  const rollD20 = () => {
    if (isRollingD20) return;
    setIsRollingD20(true);
    setRollResolution(null);
    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      setD20Result(tempRoll);
      counter++;
      if (counter > 24) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setD20Result(finalRoll);
        let resolution = null;
        if (finalRoll === 20) resolution = rollGrades.FUMBLE;
        else if (finalRoll === 1) resolution = rollGrades.CRITICAL;
        else if (finalRoll === targetSkill) resolution = rollGrades.CRITICAL;
        else if (finalRoll < targetSkill) resolution = rollGrades.SUCCESS;
        else resolution = rollGrades.FAILURE;
        setRollResolution(resolution);
        setIsRollingD20(false);
      }
    }, 50);
  };

  const rollD6Pool = () => {
    if (isRollingD6) return;
    setIsRollingD6(true);
    let counter = 0;
    const interval = setInterval(() => {
      const rolls = [];
      let sum = 0;
      for (let i = 0; i < d6Count; i++) {
        const r = Math.floor(Math.random() * 6) + 1;
        rolls.push(r);
        sum += r;
      }
      setD6Results(rolls);
      setD6Sum(sum);
      counter++;
      if (counter > 24) {
        clearInterval(interval);
        const rollsFinal = [];
        let sumFinal = 0;
        for (let i = 0; i < d6Count; i++) {
          const r = Math.floor(Math.random() * 6) + 1;
          rollsFinal.push(r);
          sumFinal += r;
        }
        setD6Results(rollsFinal);
        setD6Sum(sumFinal);
        setIsRollingD6(false);
      }
    }, 50);
  };

  const askOracle = () => {
    if (isRollingOracle) return;
    setIsRollingOracle(true);
    let counter = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      let tempMatch = null;
      if (tempRoll <= 2) tempMatch = yesNoOracle[0];
      else if (tempRoll <= 8) tempMatch = yesNoOracle[1];
      else if (tempRoll <= 12) tempMatch = yesNoOracle[2];
      else if (tempRoll <= 18) tempMatch = yesNoOracle[3];
      else tempMatch = yesNoOracle[4];
      setOracleAnswer({ roll: tempRoll, ...tempMatch });
      counter++;
      if (counter > 24) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        let match = null;
        if (finalRoll <= 2) match = yesNoOracle[0];
        else if (finalRoll <= 8) match = yesNoOracle[1];
        else if (finalRoll <= 12) match = yesNoOracle[2];
        else if (finalRoll <= 18) match = yesNoOracle[3];
        else match = yesNoOracle[4];
        setOracleAnswer({ roll: finalRoll, ...match });
        setIsRollingOracle(false);
      }
    }, 50);
  };

  const generateFrankishName = () => {
    if (isRollingName) return;
    setIsRollingName(true);
    let counter = 0;
    const interval = setInterval(() => {
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
      counter++;
      if (counter > 24) {
        clearInterval(interval);
        const isMaleFinal = Math.random() > 0.5;
        const namePoolFinal = isMaleFinal ? maleNames : femaleNames;
        const nameFinal = namePoolFinal[Math.floor(Math.random() * namePoolFinal.length)];
        const surnameFinal = surnames[Math.floor(Math.random() * surnames.length)];
        const titleFinal = titles[Math.floor(Math.random() * titles.length)];
        const locFinal = locations[Math.floor(Math.random() * locations.length)];
        setGeneratedName({
          title: titleFinal, name: nameFinal, surname: surnameFinal, loc: locFinal,
          fullTextEN: `${titleFinal.en} ${nameFinal.en} ${surnameFinal.en} of ${locFinal.en}`,
          fullTextKO: `${titleFinal.ko} ${nameFinal.ko} ${surnameFinal.ko} ${locFinal.ko}`
        });
        setIsRollingName(false);
      }
    }, 50);
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
            <button className="btn-medieval btn-medieval-primary" onClick={rollD20} style={{ justifyContent: 'center' }} disabled={isRollingD20}>
              {isRollingD20 ? "주사위 굴리는 중..." : "d20 판정 던지기"}
            </button>
            {d20Result && (
              <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)', textTransform: 'uppercase', marginBottom: '4px' }}>판정 주사위</span>
                <D20Face value={d20Result} isRolling={isRollingD20} color={rollResolution?.color} />
                {rollResolution && !isRollingD20 && (
                  <div style={{ marginTop: '8px' }}>
                    <h4 style={{ color: rollResolution.color, fontWeight: 'bold', fontSize: '1rem' }}>{rollResolution.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)', marginTop: '2px', whiteSpace: 'pre-line' }}>{rollResolution.desc}</p>
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
            <button className="btn-medieval btn-medieval-primary" onClick={rollD6Pool} style={{ justifyContent: 'center' }} disabled={isRollingD6}>
              {isRollingD6 ? "피해 굴리는 중..." : "d6 피해 굴리기"}
            </button>
            {d6Results.length > 0 && (
              <div style={{ border: '1px solid var(--color-gold-light)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {d6Results.map((r, i) => (
                    <DiceFace key={i} value={r} isRolling={isRollingD6} />
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
            <button className="btn-medieval" onClick={askOracle} style={{ justifyContent: 'center' }} disabled={isRollingOracle}>
              {isRollingOracle ? "신탁 묻는 중..." : "오라클에 묻기"}
            </button>
            {oracleAnswer && (
              <div style={{ border: '1px solid var(--color-gold)', background: 'rgba(179,143,67,0.03)', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-grey)', marginBottom: '4px' }}>신탁 주사위</span>
                <D20Face value={oracleAnswer.roll} isRolling={isRollingOracle} color="var(--color-crimson)" />
                <div className={isRollingOracle ? "roll-blur" : ""} style={{ marginTop: '8px' }}>
                  <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.05rem', margin: '4px 0' }}>{oracleAnswer.result}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-light)' }}>{oracleAnswer.desc}</p>
                </div>
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
            <button className="btn-medieval" onClick={generateFrankishName} style={{ justifyContent: 'center' }} disabled={isRollingName}>
              {isRollingName ? "이름 모색 중..." : "이름 생성"}
            </button>
            {generatedName && (
              <div style={{ border: '1px solid var(--color-gold)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className={isRollingName ? "roll-blur" : ""} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px dashed var(--color-gold-light)', paddingBottom: '6px', textAlign: 'center' }}>
                  {/* Top Line: Title + First Name */}
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-crimson)' }}>
                      {generatedName.title.en} {generatedName.name.en}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginLeft: '8px', fontWeight: 'normal' }}>
                      ({generatedName.title.ko} {generatedName.name.ko})
                    </span>
                  </div>
                  {/* Bottom Line: House + Origin */}
                  <div style={{ fontSize: '0.95rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold-dark)' }}>
                      {generatedName.surname.en} of {generatedName.loc.en}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginLeft: '8px' }}>
                      ({generatedName.surname.ko} {generatedName.loc.ko})
                    </span>
                  </div>
                </div>
                <button className="btn-medieval" onClick={applyName} style={{ fontSize: '0.8rem', padding: '3px 8px', justifyContent: 'center' }} disabled={isRollingName}>
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
