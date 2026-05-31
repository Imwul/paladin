import React, { useState } from 'react';
import ProperNoun from './ProperNoun';
import { chronologyData } from '../data/chronology';
import { BookOpen, Edit3, Trash2, Save, Calendar } from 'lucide-react';

export default function ChronologyJournal({ character, setCharacter }) {
  const [selectedYear, setSelectedYear] = useState(768);
  const [journalInput, setJournalInput] = useState('');

  const currentHistory = chronologyData.find(item => item.year === selectedYear) || {
    year: selectedYear, title: "Era of Peace", summary: "No major conflicts recorded.", details: "The kingdom enjoys relative calm.", events: []
  };

  const existingJournal = character.journal[selectedYear];

  const saveJournalEntry = () => {
    if (!journalInput.trim()) return;
    setCharacter(prev => ({
      ...prev,
      journal: { ...prev.journal, [selectedYear]: { text: journalInput, updatedAt: new Date().toISOString() } }
    }));
    alert(`${selectedYear}년 일지가 안전하게 기록되었습니다!`);
  };

  const deleteJournalEntry = () => {
    if (!window.confirm("이 연도의 기록을 소각하시겠습니까?")) return;
    setCharacter(prev => {
      const updatedJournal = { ...prev.journal };
      delete updatedJournal[selectedYear];
      return { ...prev, journal: updatedJournal };
    });
    setJournalInput('');
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const existing = character.journal[year];
    setJournalInput(existing ? existing.text : '');
  };

  return (
    <div className="cs-page view-animate">

      <div className="tutorial-banner">
        <div>
          <h4 className="tutorial-banner-title">역사 연대기 및 모험 일지</h4>
          <p>
            <ProperNoun en="768 AD" ko="768년" />부터 <ProperNoun en="814 AD" ko="814년" />까지의 타임라인입니다.
            연도를 선택하고, 역사적 배경을 읽은 뒤, 기사의 모험을 일지로 기록해 보세요.
          </p>
        </div>
      </div>

      {/* Year Selection */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.95rem' }}>
            <Calendar size={16} /> 연도 선택
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {chronologyData.map(item => (
              <button key={item.year}
                className={`btn-medieval ${selectedYear === item.year ? 'btn-medieval-primary' : ''}`}
                style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                onClick={() => handleYearChange(item.year)}>
                {item.year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* History + Journal side by side */}
      <div className="cs-row">
        {/* LORE */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><BookOpen size={16} style={{ marginRight: '6px' }} />{selectedYear}년 역사</h3></div>
          <div className="cs-section-inner" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: '10px', fontStyle: 'italic', color: 'var(--color-ink-light)', fontWeight: 'bold', marginBottom: '10px' }}>
              {currentHistory.title}
            </div>
            <p style={{ marginBottom: '10px' }}>{currentHistory.summary}</p>
            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', textTransform: 'uppercase' }}>세부 야사</h4>
              <p style={{ color: 'var(--color-ink-light)', fontSize: '0.9rem' }}>{currentHistory.details}</p>
            </div>
            {currentHistory.events?.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', textTransform: 'uppercase' }}>주요 전황</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '15px', fontSize: '0.9rem' }}>
                  {currentHistory.events.map((ev, idx) => (
                    <li key={idx}>
                      <strong style={{ color: 'var(--color-gold-dark)', fontSize: '0.8rem', marginRight: '4px' }}>
                        [{ev.type === 'War' ? '전투' : ev.type === 'Court' ? '어전회의' : ev.type === 'Intrigue' ? '계략' : '비화'}]
                      </strong>
                      {ev.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* JOURNAL */}
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><Edit3 size={16} style={{ marginRight: '6px' }} />기사의 일지</h3></div>
          <div className="cs-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {existingJournal ? (
              <div style={{ backgroundColor: 'rgba(179,143,67,0.04)', border: '1px solid var(--color-gold-light)', padding: '12px', borderRadius: '2px' }}>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '10px' }}>{existingJournal.text}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    onClick={() => setJournalInput(existingJournal.text)}>일지 수정</button>
                  <button className="btn-medieval" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-crimson)' }}
                    onClick={deleteJournalEntry}><Trash2 size={12} /> 소각</button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', padding: '15px 0' }}>
                {selectedYear}년 — 아직 기록된 모험담이 없습니다.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>일지 작성</label>
              <textarea className="form-input" style={{ minHeight: '180px', resize: 'vertical', fontSize: '0.95rem' }}
                value={journalInput} onChange={e => setJournalInput(e.target.value)}
                placeholder="여기에 모험 일기를 적어보세요..." />
            </div>
            <button className="btn-medieval btn-medieval-primary" onClick={saveJournalEntry} style={{ justifyContent: 'center' }}>
              <Save size={14} style={{ marginRight: '6px' }} /> 일지 보관하기
            </button>
          </div>
        </section>
      </div>

    </div>
  );
}
