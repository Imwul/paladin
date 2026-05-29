import React from 'react';
import ProperNoun from './ProperNoun';
import { BookOpen, Award, Compass, ShieldAlert } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">컴패니언 튜토리얼 (도움말)</h4>
          <p>
            <ProperNoun en="Paladin" ko="팔라딘" /> 솔로 컴패니언에 오신 것을 환영합니다! 이 웹앱은 <ProperNoun en="Charlemagne" ko="샤를마뉴" /> 대제 시대의 성기사가 되어 모험을 즐길 수 있도록 돕습니다.
            룰북을 보지 않고도 시작할 수 있게 설계되었습니다. 기사 시트를 작성하고, 매년 연대기 타임라인을 확인하여 일지를 적으며, 주사위와 조우 오라클을 굴려 세션을 진행해보세요.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Quick Start Card */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />빠른 시작 가이드</span>
          </h3>
          <p style={{ marginBottom: '12px' }}>
            성스러운 전사로서 전설적인 영웅담을 시작하려면 다음 단계를 따르세요:
          </p>
          <ol style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>기사 시트</strong> 탭으로 이동하여 캐릭터를 생성합니다. 능력치(SIZ, DEX 등)를 입력하면 피해량, 치유력, 체력 등이 자동으로 계산됩니다!
            </li>
            <li>
              <strong>연대기 & 일지</strong> 탭으로 이동하여 시작 연도인 <ProperNoun en="768 AD" ko="768년" />을 선택하고, 역사적 배경을 읽은 뒤 <strong>일지 작성</strong>을 클릭해 첫 모험을 기록해 보세요.
            </li>
            <li>
              모험 도중 판정이 필요하거나 무작위 만남을 처리하고 싶을 때는 <strong>솔로 오라클</strong> 탭에서 주사위를 굴리거나 조우 가이드를 확인하세요.
            </li>
            <li>
              1년의 모험이 끝나면 <strong>가문 & 겨울 정산</strong> 탭으로 이동하여 나이를 먹고, 사용한 기술을 단련하며, 가문의 사건을 굴려 다음 해의 모험을 준비합니다.
            </li>
          </ol>
          <button 
            className="btn-medieval btn-medieval-primary" 
            onClick={() => setActiveTab('character')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            기사 캐릭터 생성하기
          </button>
        </div>

        {/* Chivalric Code Card */}
        <div className="medieval-card">
          <h3 className="card-title">
            <span><Award size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />기사도 십계명과 성향</span>
          </h3>
          <p style={{ fontStyle: 'italic', color: 'var(--color-ink-light)', marginBottom: '15px' }}>
            진정한 성기사는 명예와 신앙을 수호해야 합니다. 다음 대립 성향들을 갈고닦아 보너스를 획득하세요:
          </p>
          <ul style={{ listStyleType: 'square', paddingLeft: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.92rem' }}>
            <li><strong>정숙 (Chaste)</strong> / 음탕</li>
            <li><strong>열정 (Energetic)</strong> / 나태</li>
            <li><strong>관용 (Forgiving)</strong> / 복수</li>
            <li><strong>관대 (Generous)</strong> / 이기</li>
            <li><strong>정직 (Honest)</strong> / 기만</li>
            <li><strong>정의 (Just)</strong> / 독단</li>
            <li><strong>자비 (Merciful)</strong> / 잔혹</li>
            <li><strong>겸손 (Modest)</strong> / 오만</li>
            <li><strong>경건 (Pious)</strong> / 세속</li>
            <li><strong>신중 (Prudent)</strong> / 무모</li>
            <li><strong>절제 (Temperate)</strong> / 방종</li>
            <li><strong>신뢰 (Trusting)</strong> / 의심</li>
            <li><strong>용맹 (Valorous)</strong> / 겁쟁이</li>
          </ul>
        </div>
      </div>

      {/* Mechanics Explanation Card */}
      <div className="medieval-card" style={{ marginTop: '20px' }}>
        <h3 className="card-title">
          <span><Compass size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />핵심 게임 시스템 소개</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', fontSize: '0.92rem' }}>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>행동 판정 (d20 룰)</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              모든 행동은 20면체 주사위(<strong>d20</strong>)를 굴려서 판정합니다. 주사위 결과 값을 본인의 기술이나 성향 수치와 비교합니다:
            </p>
            <ul style={{ paddingLeft: '15px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>기술 수치와 일치:</strong> 대성공 (Critical) - 피해 2배 등 극적인 효과</li>
              <li><strong>기술 수치 미만:</strong> 성공 (Success) - 안전하게 행동 완수</li>
              <li><strong>기술 수치 초과:</strong> 실패 (Failure) - 뜻을 이루지 못함</li>
              <li><strong>자연수 20 등장:</strong> 대실패 (Fumble) - 도구 파손, 낙마 등 악재 발생</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>대립 성향의 특징</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              기사의 성격과 신조는 13쌍의 대립하는 성향으로 나타나며, 마주보는 두 성향의 합은 **언제나 20**입니다. 
              예를 들어 정숙(Chaste) 수치를 12로 올리면, 반대되는 성향인 음탕(Lustful) 수치는 자동으로 8로 낮아집니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-crimson)', marginBottom: '5px', fontWeight: '600' }}>기사도 & 신앙 보너스</h4>
            <p style={{ color: 'var(--color-ink-light)' }}>
              기사의 명예로운 행보는 기사도/종교 보너스로 이어집니다. 
              기사도 성향들(정숙, 관용, 관대, 정직, 신중, 신뢰, 용맹)의 합이 **90점 이상**이고 명예(Honor) 수치가 **16점 이상**이 되면 **기사도 보너스(피해 면역 +3 천연 아머)**가 상시 활성화됩니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
