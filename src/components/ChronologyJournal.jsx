import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { chronologyData } from '../data/chronology';
import { BookOpen, Edit3, Trash2, Save, Calendar } from 'lucide-react';

export default function ChronologyJournal({ character, setCharacter }) {
  const [selectedYear, setSelectedYear] = useState(768);
  const [journalInput, setJournalInput] = useState('');

  // Find the selected year's historical data
  const currentHistory = chronologyData.find(item => item.year === selectedYear) || {
    year: selectedYear,
    title: "Era of Peace (기나긴 평화)",
    summary: "No major military conflicts are recorded in the annals.",
    details: "The kingdom enjoys relative calm as seasonal farming thrives and local counts maintain law.",
    events: []
  };

  // Check if a journal entry already exists for the selected year
  const existingJournal = character.journal[selectedYear];

  // Save the journal entry
  const saveJournalEntry = () => {
    if (!journalInput.trim()) return;
    
    setCharacter(prev => ({
      ...prev,
      journal: {
        ...prev.journal,
        [selectedYear]: {
          text: journalInput,
          updatedAt: new Date().toISOString()
        }
      }
    }));
    
    alert(`${selectedYear}년 일지가 안전하게 서책에 기록되었습니다!`);
  };

  // Delete the journal entry
  const deleteJournalEntry = () => {
    if (!window.confirm("이 연도에 작성했던 모험 기록을 소각하시겠습니까? 복구할 수 없습니다.")) return;

    setCharacter(prev => {
      const updatedJournal = { ...prev.journal };
      delete updatedJournal[selectedYear];
      return { ...prev, journal: updatedJournal };
    });
    setJournalInput('');
  };

  // Handle year selection and load existing entry
  const handleYearChange = (year) => {
    setSelectedYear(year);
    const existing = character.journal[year];
    setJournalInput(existing ? existing.text : '');
  };

  return (
    <div className="view-animate">
      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">역사 연대기 및 모험 일지 작성법</h4>
          <p>
            샤를마뉴 대제가 훈령을 선포하고 제국을 지배한 <ProperNoun en="768 AD" ko="768년" />부터 <ProperNoun en="814 AD" ko="814년" />까지의 위대한 타임라인입니다. 
            아래의 연도 스크롤바에서 한 해를 선택하세요. 당해 연도에 대륙에서 발생했던 전설적인 역사와 기사들의 충성을 읽어보신 후, 그 역사의 물결 한가운데에서 내 기사가 겪었던 활약상과 모험을 일지(Diary)로 자유롭게 적어 보세요.
          </p>
        </div>
      </div>

      {/* Year Selection Scrollbar */}
      <div style={{ margin: '20px 0', position: 'relative' }}>
        <h4 className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={16} /> 역사적 대서사 연도 선택
        </h4>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
          {chronologyData.map(item => (
            <button 
              key={item.year} 
              className={`btn-medieval ${selectedYear === item.year ? 'btn-medieval-primary' : ''}`}
              style={{ padding: '8px 16px', minWidth: '80px', flexShrink: 0, fontSize: '1.15rem' }}
              onClick={() => handleYearChange(item.year)}
            >
              {item.year}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* LORE PANEL */}
        <div className="medieval-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title" style={{ fontSize: '1.35rem' }}>
            <span><BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{selectedYear}년 역사적 배경</span>
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: '12px', fontStyle: 'italic', color: 'var(--color-ink-light)', fontWeight: 'bold' }}>
              {currentHistory.title}
            </div>
            
            <div style={{ borderBottom: '1px solid var(--color-grey-light)', paddingBottom: '10px' }}>
              <p style={{ color: 'var(--color-ink)' }}>{currentHistory.summary}</p>
            </div>

            <div>
              <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px', textTransform: 'uppercase' }}>정사 및 세부 야사</h4>
              <p style={{ color: 'var(--color-ink-light)' }}>{currentHistory.details}</p>
            </div>

            {currentHistory.events && currentHistory.events.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '6px', textTransform: 'uppercase' }}>주요 전황 및 궁정 뉴스</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '15px' }}>
                  {currentHistory.events.map((ev, idx) => (
                    <li key={idx} style={{ fontSize: '1rem' }}>
                      <strong style={{ color: 'var(--color-gold-dark)', fontSize: '0.92rem', textTransform: 'uppercase', marginRight: '6px' }}>
                        [{ev.type === 'War' ? '전투' : ev.type === 'Court' ? '어전회의' : ev.type === 'Intrigue' ? '계략/음모' : '비화'}]
                      </strong>
                      {ev.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* JOURNAL PANEL */}
        <div className="medieval-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title">
            <span><Edit3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />기사의 원정 일지 기록부</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            {existingJournal ? (
              <div style={{ backgroundColor: 'rgba(179,143,67,0.04)', border: '1px solid var(--color-gold-light)', padding: '15px', borderRadius: '2px', position: 'relative' }}>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '40px' }}>
                  {existingJournal.text}
                </p>
                <div style={{ display: 'flex', gap: '10px', position: 'absolute', bottom: '10px', right: '10px' }}>
                  <button 
                    className="btn-medieval" 
                    style={{ padding: '4px 8px', fontSize: '0.88rem' }}
                    onClick={() => setJournalInput(existingJournal.text)}
                  >
                    일지 수정
                  </button>
                  <button 
                    className="btn-medieval" 
                    style={{ padding: '4px 8px', fontSize: '0.88rem', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}
                    onClick={deleteJournalEntry}
                  >
                    <Trash2 size={12} /> 기록 소각
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '1rem', textAlign: 'center', padding: '20px 0' }}>
                {selectedYear}년도에는 아직 작성된 기사의 모험담이 없습니다. 아래에 올해 있었던 치열한 성전을 적어 보세요!
              </div>
            )}

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
              <label className="form-label">기사의 역사 일기장 작성</label>
              <textarea 
                className="form-input" 
                style={{ flex: 1, resize: 'none', fontSize: '1.05rem' }} 
                value={journalInput} 
                onChange={e => setJournalInput(e.target.value)}
                placeholder="여기에 모험 일기를 적어보세요... 예: 짙은 안개 속에서 피레네 산맥을 넘었다. 뒤쪽에서 바스크인들과 이교도들의 추격 함성이 메아리쳤고, 롤랑 님은 그의 올리판트 뿔나팔을 장대하게 불었다..."
              />
            </div>
            
            <button 
              className="btn-medieval btn-medieval-primary" 
              onClick={saveJournalEntry}
              style={{ justifyContent: 'center' }}
            >
              <Save size={16} style={{ marginRight: '6px' }} /> 모험 일지 안전하게 보관하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
