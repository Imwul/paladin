import React from 'react';
import ProperNoun from './ProperNoun';
import { BookOpen, Award, Compass } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="cs-page view-animate">

      {/* Hero Illustration */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '16px 0 0',
      }}>
        <img 
          src="/medieval-knight.png" 
          alt="중세 기사 필사본 삽화" 
          style={{ 
            width: '100%',
            maxWidth: '360px', 
            borderRadius: '12px',
            border: '2px solid var(--color-gold-light)',
            boxShadow: '0 4px 20px rgba(43, 65, 112, 0.12)',
          }} 
        />
      </div>

      {/* Manuscript Border Divider */}
      <div style={{ margin: '12px 0', overflow: 'hidden', borderRadius: '6px' }}>
        <img 
          src="/manuscript-border.png" 
          alt="" 
          style={{ width: '100%', height: '40px', objectFit: 'cover', opacity: 0.7 }} 
        />
      </div>

      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">📜 컴패니언 튜토리얼 (도움말)</h4>
          <p>
            <ProperNoun en="Paladin" ko="팔라딘" /> 솔로 컴패니언에 오신 것을 환영합니다! 이 웹앱은 <ProperNoun en="Charlemagne" ko="샤를마뉴" /> 대제 시대의 성기사가 되어 모험을 즐길 수 있도록 돕습니다.
            룰북을 보지 않고도 시작할 수 있게 설계되었습니다.
          </p>
        </div>
      </div>

      <div className="cs-row" style={{ marginTop: '12px' }}>
        {/* Quick Start Card */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>📖 빠른 시작 가이드</h3></div>
          <div className="cs-section-inner">
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <li>⚔️ <strong>기사 시트</strong> 탭으로 이동하여 캐릭터를 생성합니다. 능력치를 입력하면 파생 스탯이 자동 계산됩니다!</li>
              <li>📜 <strong>역사 연대기 &amp; 일지</strong> 탭에서 768년을 선택하고 첫 모험을 기록해 보세요.</li>
              <li>🎲 판정이 필요할 때는 <strong>솔로 오라클</strong> 탭에서 주사위를 굴리세요.</li>
              <li>🏰 1년의 모험이 끝나면 <strong>가문 &amp; 겨울 정산</strong> 탭에서 다음 해를 준비합니다.</li>
            </ol>
            <button className="btn-medieval btn-medieval-primary" onClick={() => setActiveTab('character')}
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              ⚔️ 기사 캐릭터 생성하기
            </button>
          </div>
        </section>

        {/* Chivalric Code Card */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>🛡️ 기사도 십계명</h3></div>
          <div className="cs-section-inner">
            <p style={{ fontStyle: 'italic', color: 'var(--color-ink-light)', marginBottom: '12px', fontSize: '0.9rem' }}>
              진정한 성기사는 명예와 신앙을 수호해야 합니다. 다음 대립 성향들을 갈고닦아 보너스를 획득하세요:
            </p>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.9rem' }}>
              <li>⚜️ <strong>정숙</strong> / 음탕</li>
              <li>🔥 <strong>열정</strong> / 나태</li>
              <li>🕊️ <strong>관용</strong> / 복수</li>
              <li>💰 <strong>관대</strong> / 이기</li>
              <li>📿 <strong>정직</strong> / 기만</li>
              <li>⚖️ <strong>정의</strong> / 독단</li>
              <li>🤲 <strong>자비</strong> / 잔혹</li>
              <li>🙏 <strong>겸손</strong> / 오만</li>
              <li>✝️ <strong>경건</strong> / 세속</li>
              <li>🦉 <strong>신중</strong> / 무모</li>
              <li>🍷 <strong>절제</strong> / 방종</li>
              <li>🤝 <strong>신뢰</strong> / 의심</li>
              <li>🗡️ <strong>용맹</strong> / 겁쟁이</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Mechanics */}
      <section className="cs-section" style={{ marginTop: '4px' }}>
        <div className="sheet-ribbon"><h3>🧭 핵심 게임 시스템</h3></div>
        <div className="cs-section-inner">
          <div className="cs-row" style={{ gap: '20px' }}>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-royal-blue)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>🎲 행동 판정 (d20)</h4>
              <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                <li><strong>기술 수치와 일치:</strong> 대성공</li>
                <li><strong>기술 수치 미만:</strong> 성공</li>
                <li><strong>기술 수치 초과:</strong> 실패</li>
                <li><strong>자연수 20:</strong> 대실패</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-royal-blue)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>⚖️ 대립 성향</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                13쌍의 대립 성향의 합은 <strong>언제나 20</strong>. 정숙을 12로 올리면 음탕은 자동으로 8이 됩니다.
              </p>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-royal-blue)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>👑 기사도 보너스</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                기사도 성향 합 <strong>90+</strong>, 명예 <strong>16+</strong> → <strong>+3 천연 아머</strong> 상시 활성!
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
