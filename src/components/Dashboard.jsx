import React from 'react';
import ProperNoun from './ProperNoun';
import { BookOpen, Award, Compass, ShieldAlert } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">Companion Tutorial (컴패니언 튜토리얼)</h4>
          <p>
            Welcome to the <ProperNoun en="Paladin" ko="팔라딘" /> Solo Companion! This web app allows you to play a knight in the age of <ProperNoun en="Charlemagne" ko="샤를마뉴" />. 
            No rulebook is needed to start. Fill in your Character Sheet, explore the Chronology timeline year-by-year, write your adventure journals, and use the Solo Oracles to generate rolls and events.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Quick Start Card */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Quick Start Guide (빠른 시작 가이드)</span>
          </h3>
          <p style={{ marginBottom: '12px' }}>
            To begin your legendary saga as a holy warrior, follow these simple steps:
          </p>
          <ol style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              Go to the <strong>Knight Sheet</strong> tab and create your character. Roll or assign attributes (DEX, STR, etc.). The companion will automatically calculate your Damage, Healing, and Hit Points!
            </li>
            <li>
              Go to the <strong>Chronology & Journal</strong> tab. Select the starting year, <ProperNoun en="768 AD" ko="768년" />, read the historical summary, and click <strong>Create Log</strong> to write your first journal entry.
            </li>
            <li>
              When faced with uncertainty during your travels, open the <strong>Solo Oracles</strong> tab to roll dice or consult the encounter guidelines.
            </li>
            <li>
              At the end of each simulated year, open the <strong>Winter Phase</strong> tab to advance your age, check for skill improvements, calculate your family fortune, and log the events of your lineage.
            </li>
          </ol>
          <button 
            className="btn-medieval btn-medieval-primary" 
            onClick={() => setActiveTab('character')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Create Your Knight (기사 생성하기)
          </button>
        </div>

        {/* Chivalric Code Card */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />The Chivalric Code (기사도 십계명)</span>
          </h3>
          <p style={{ fontStyle: 'italic', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            A true Paladin must uphold the virtues of honor and loyalty. Strive to maintain these holy traits:
          </p>
          <ul style={{ listStyleType: 'square', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem' }}>
            <li><strong>Chaste (정숙)</strong> vs Lustful (음탕)</li>
            <li><strong>Energetic (열정)</strong> vs Lazy (나태)</li>
            <li><strong>Forgiving (관용)</strong> vs Vengeful (복수)</li>
            <li><strong>Generous (관대)</strong> vs Selfish (이기)</li>
            <li><strong>Honest (정직)</strong> vs Deceitful (기만)</li>
            <li><strong>Just (정의)</strong> vs Arbitrary (독단)</li>
            <li><strong>Merciful (자비)</strong> vs Cruel (잔혹)</li>
            <li><strong>Modest (겸손)</strong> vs Proud (오만)</li>
            <li><strong>Pious (경건)</strong> vs Worldly (세속)</li>
            <li><strong>Prudent (신중)</strong> vs Reckless (무모)</li>
            <li><strong>Temperate (절제)</strong> vs Indulgent (방종)</li>
            <li><strong>Trusting (신뢰)</strong> vs Suspicious (의심)</li>
            <li><strong>Valorous (용맹)</strong> vs Cowardly (겁쟁이)</li>
          </ul>
        </div>
      </div>

      {/* Mechanics Explanation Card */}
      <div className="medieval-card" style={{ marginTop: '20px' }}>
        <h3 className="card-title">
          <span><Compass size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />The Core Game System (핵심 규칙 및 굴림 방법)</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', fontSize: '0.92rem' }}>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>Resolving Actions (d20 판정)</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              All actions are resolved by rolling a 20-sided die (<strong>d20</strong>). You compare the result against your Skill or Trait score:
            </p>
            <ul style={{ paddingLeft: '15px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Equal to Skill:</strong> Critical Success (대성공)</li>
              <li><strong>Less than Skill:</strong> Success (성공)</li>
              <li><strong>Greater than Skill:</strong> Failure (실패)</li>
              <li><strong>Roll of 20:</strong> Fumble (대실패)</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>Opposing Traits (대립 성향)</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              Your character has 13 pairs of opposing traits. Their combined values always equal exactly <strong>20</strong>. 
              If you increase your Chaste(정숙) trait by 1, your Lustful(음탕) trait automatically decreases by 1!
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>Glory & Status (영예와 평판)</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              Your deeds earn you <strong>Glory</strong>. Accumulating Glory increases your social standing and confers mechanical bonuses. 
              If your chivalric traits total 90 or more and your Honor is 16+, you unlock the coveted <strong>Chivalrous Bonus</strong> (+3 Natural Armor)!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
