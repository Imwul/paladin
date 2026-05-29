import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { maleNames, femaleNames, surnames, locations, titles } from '../data/names';
import { rollGrades, yesNoOracle, soloScenariosRef } from '../data/oracles';
import { Dices, RefreshCw, HelpCircle, ArrowRight, ClipboardCopy } from 'lucide-react';

export default function SoloOracles({ setCharacter }) {
  // Dice states
  const [d20Result, setD20Result] = useState(null);
  const [d6Count, setD6Count] = useState(1);
  const [d6Results, setD6Results] = useState([]);
  const [d6Sum, setD6Sum] = useState(0);
  const [targetSkill, setTargetSkill] = useState(10);
  const [rollResolution, setRollResolution] = useState(null);

  // Oracle states
  const [oracleAnswer, setOracleAnswer] = useState(null);

  // Generator states
  const [generatedName, setGeneratedName] = useState(null);

  // Roll d20 with resolution logic
  const rollD20 = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setD20Result(roll);

    let resolution = null;
    if (roll === 20) {
      resolution = rollGrades.FUMBLE;
    } else if (roll === 1) {
      resolution = rollGrades.CRITICAL; // Natural 1 is always a critical in many d20 systems
    } else if (roll === targetSkill) {
      resolution = rollGrades.CRITICAL; // Skill matches exactly
    } else if (roll < targetSkill) {
      resolution = rollGrades.SUCCESS;
    } else {
      resolution = rollGrades.FAILURE;
    }
    setRollResolution(resolution);
  };

  // Roll d6 pool
  const rollD6Pool = () => {
    const rolls = [];
    let sum = 0;
    for (let i = 0; i < d6Count; i++) {
      const r = Math.floor(Math.random() * 6) + 1;
      rolls.push(r);
      sum += r;
    }
    setD6Results(rolls);
    setD6Sum(sum);
  };

  // Yes / No Oracle
  const askOracle = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    let match = null;

    if (roll <= 2) match = yesNoOracle[0]; // No, and
    else if (roll <= 8) match = yesNoOracle[1]; // No
    else if (roll <= 12) match = yesNoOracle[2]; // Maybe
    else if (roll <= 18) match = yesNoOracle[3]; // Yes
    else match = yesNoOracle[4]; // Yes, and

    setOracleAnswer({ roll, ...match });
  };

  // Name Generator
  const generateFrankishName = () => {
    const isMale = Math.random() > 0.5;
    const namePool = isMale ? maleNames : femaleNames;
    const name = namePool[Math.floor(Math.random() * namePool.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];

    setGeneratedName({
      title,
      name,
      surname,
      loc,
      fullTextEN: `${title.en} ${name.en} ${surname.en} of ${loc.en}`,
      fullTextKO: `${title.ko} ${name.ko} ${surname.ko} ${loc.ko}`
    });
  };

  // Set generated name to current character
  const applyName = () => {
    if (!generatedName) return;
    const cleanName = `${generatedName.name.en} ${generatedName.surname.en}`;
    setCharacter(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        name: cleanName,
        homeland: generatedName.loc.en
      }
    }));
    alert(`Applied name [${cleanName}] to your Knight sheet!`);
  };

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">Solo Oracles & Rollers Tutorial (오라클 및 주사위 설명)</h4>
          <p>
            Solo journaling RPGs rely on dice and quick resolution charts to steer the adventure. 
            Use the **d20 Skill Matcher** to instantly check if you succeeded or fumbled. 
            Stuck on a decision? Ask the **Yes/No Oracle**. Need an NPC on the road? Tap the **Name Generator**!
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* DICE ROLLER CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Dices size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />D20 Skill Matcher (d20 기술 판정)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Target Skill / Trait Value (기준 기술/성향 점수)</label>
              <input 
                type="number" 
                className="form-input" 
                value={targetSkill} 
                min={1} 
                max={20}
                onChange={e => setTargetSkill(parseInt(e.target.value) || 1)} 
              />
            </div>
            
            <button className="btn-medieval btn-medieval-primary" onClick={rollD20} style={{ justifyContent: 'center' }}>
              Roll d20 (주사위 굴리기)
            </button>

            {d20Result && (
              <div style={{ border: '1px solid var(--color-gold)', backgroundColor: 'rgba(179,143,67,0.03)', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>Rolled Result</span>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'var(--font-english)', color: rollResolution?.color || 'inherit', margin: '-10px 0' }}>
                  {d20Result}
                </div>
                {rollResolution && (
                  <div style={{ marginTop: '5px' }}>
                    <h4 style={{ color: rollResolution.color, fontWeight: 'bold', fontSize: '1rem' }}>{rollResolution.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)', marginTop: '4px' }}>{rollResolution.desc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* D6 DAMAGE POOL CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Dices size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />D6 Damage Pool (d6 대미지 굴림)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Number of Dice (굴릴 주사위 개수)</label>
              <input 
                type="number" 
                className="form-input" 
                value={d6Count} 
                min={1} 
                max={15}
                onChange={e => setD6Count(parseInt(e.target.value) || 1)} 
              />
            </div>
            
            <button className="btn-medieval btn-medieval-primary" onClick={rollD6Pool} style={{ justifyContent: 'center' }}>
              Roll Damage Pool (d6)
            </button>

            {d6Results.length > 0 && (
              <div style={{ border: '1px solid var(--color-gold-light)', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)', textTransform: 'uppercase' }}>Dice Results</span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
                  {d6Results.map((r, i) => (
                    <span key={i} style={{ border: '1px solid var(--color-ink)', padding: '4px 10px', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#fff', fontFamily: 'var(--font-english)' }}>
                      {r}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Total Damage: <span style={{ color: 'var(--color-crimson)', fontSize: '1.4rem', fontFamily: 'var(--font-english)' }}>{d6Sum}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YES / NO ORACLE CARD */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><HelpCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Yes / No Oracle (예/아니오 신탁)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
              Ask a question about the surroundings (e.g., "Is there a guard at the bridge?") and roll d20 to receive a prompt:
            </p>
            <button className="btn-medieval" onClick={askOracle} style={{ justifyContent: 'center' }}>
              Ask the Oracle (신탁 구하기)
            </button>

            {oracleAnswer && (
              <div style={{ border: '1px solid var(--color-gold)', backgroundColor: 'rgba(179,143,67,0.03)', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-grey)' }}>Oracle rolled d20 [ {oracleAnswer.roll} ]</span>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1.1rem', margin: '6px 0' }}>
                  {oracleAnswer.result}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-light)' }}>{oracleAnswer.desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* FRANKISH NAME GENERATOR */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><RefreshCw size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Frankish Name Generator (고유명사 생성기)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button className="btn-medieval" onClick={generateFrankishName} style={{ justifyContent: 'center' }}>
              Generate Random Name (무작위 생성)
            </button>

            {generatedName && (
              <div style={{ border: '1px solid var(--color-gold)', padding: '15px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Proper Noun bilingual rendering */}
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '1px dashed var(--color-gold-light)', paddingBottom: '8px' }}>
                  <ProperNoun en={generatedName.fullTextEN} ko={generatedName.fullTextKO} />
                </div>
                
                <button className="btn-medieval" onClick={applyName} style={{ fontSize: '0.8rem', padding: '4px 8px', justifyContent: 'center' }}>
                  Apply to Knight Sheet (기사 시트에 적용)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SOLO SCENARIOS QUICK REFERENCE */}
        <div className="medieval-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Solo Encounter Guides (솔로 조우 요약집)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {soloScenariosRef.map((sc, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '12px' }}>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
                  {sc.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)', marginBottom: '8px' }}>
                  {sc.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '10px', borderLeft: '2px solid var(--color-gold-light)' }}>
                  {sc.flow.map((f, fi) => (
                    <span key={fi} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowRight size={10} color="var(--color-gold)" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
