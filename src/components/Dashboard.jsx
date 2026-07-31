import ProperNoun from './ProperNoun';
import { BookOpen } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="cs-page view-animate">
      <h2 className="cs-page-title">
        <BookOpen size={20} style={{ color: 'var(--color-gold-dark)' }} />
        성기사 입문 기록부
      </h2>
      <div className="tutorial-banner">
        <div>
          <p style={{ margin: 0 }}>
            <ProperNoun en="Paladin" ko="팔라딘" /> 모험 기록에 오신 것을 환영합니다. 이 연대기는 <ProperNoun en="Charlemagne" ko="샤를마뉴" /> 대제 시대의 성기사가 되어 가문의 역사와 무훈을 남길 수 있도록 돕습니다.
            규칙에 익숙하지 않더라도 기록을 이어나갈 수 있도록 구성되어 있습니다.
          </p>
        </div>
      </div>

      <div className="cs-row" style={{ marginTop: '12px' }}>
        {/* Quick Start Card */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>초심자 기록 안내</h3></div>
          <div className="cs-section-inner">
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <li><strong>기사의 기록</strong> 탭으로 이동하여 인물을 창조합니다. 능력치를 기록하면 파생 스탯이 스스로 자리를 잡습니다.</li>
              <li><strong>모험 연대기</strong> 탭에서 역사의 시작을 선택하고 첫 일지를 기록해 보십시오.</li>
              <li>판정이 필요할 때는 <strong>운명의 신탁과 주사위</strong> 탭에서 성향과 무기를 휘두르십시오.</li>
              <li>가문의 역사를 갱신하기 위해 겨울 정산 단계(가문의 계보 탭)를 진행하십시오.</li>
            </ol>
            <button className="btn-medieval btn-medieval-primary" onClick={() => setActiveTab('character')}
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              기사의 기록 작성하기
            </button>
          </div>
        </section>

        {/* Chivalric Code Card */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3>핵심 대립 성향</h3></div>
          <div className="cs-section-inner">
            <p style={{ fontStyle: 'italic', color: 'var(--color-ink-light)', marginBottom: '12px', fontSize: '0.9rem' }}>
              고결한 성기사는 명예와 신앙을 평생 수호해야 합니다. 다음 대립 성향들을 단련하여 하늘의 권능을 얻으십시오:
            </p>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.9rem' }}>
              <li><strong>정숙</strong> / 음탕</li>
              <li><strong>열정</strong> / 나태</li>
              <li><strong>관용</strong> / 복수</li>
              <li><strong>관대</strong> / 이기</li>
              <li><strong>정직</strong> / 기만</li>
              <li><strong>정의</strong> / 독단</li>
              <li><strong>자비</strong> / 잔혹</li>
              <li><strong>겸손</strong> / 오만</li>
              <li><strong>신중</strong> / 무모</li>
              <li><strong>절제</strong> / 방종</li>
              <li><strong>신뢰</strong> / 의심</li>
              <li><strong>용맹</strong> / 겁쟁이</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="chronicle-divider" style={{ borderBottom: '1px solid var(--color-gold-light)', width: '100%', margin: '24px 0' }}></div>

      {/* Mechanics */}
      <section className="cs-section" style={{ marginTop: '4px' }}>
        <div className="sheet-ribbon"><h3>연대기 규칙</h3></div>
        <div className="cs-section-inner">
          <div className="cs-row" style={{ gap: '20px' }}>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-ink-light)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>행동 판정 (d20)</h4>
              <ul style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                <li><strong>기술 수치와 일치:</strong> 대성공 (Critical)</li>
                <li><strong>기술 수치 미만:</strong> 성공 (Success)</li>
                <li><strong>기술 수치 초과:</strong> 실패 (Failure)</li>
                <li><strong>주사위 20:</strong> 수정 수치가 20 미만이면 대실패, 20이면 대성공</li>
                <li><strong>수정 수치 20 초과:</strong> 초과분을 주사위에 더하고 결과 20 이상은 대성공</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-ink-light)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>대립 성향</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                각 대립 성향 쌍의 합은 <strong>언제나 20</strong>입니다. 예컨대 정숙이 12가 되면 음탕은 자동으로 8이 됩니다.
              </p>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <h4 style={{ color: 'var(--color-ink-light)', marginBottom: '6px', fontWeight: 700, fontSize: '0.95rem' }}>기사도 권능</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-light)' }}>
                기사도 성향 합이 <strong>90점 이상</strong>이고 명예가 <strong>16점 이상</strong>이면 <strong>+3 천연 아머</strong> 가호를 얻습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
