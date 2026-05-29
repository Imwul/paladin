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
    
    // Clear input or show alert/notification
  };

  // Delete the journal entry
  const deleteJournalEntry = () => {
    if (!window.confirm("Are you sure you want to burn this journal entry? (이 연도의 일지를 소각하시겠습니까?)")) return;

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
          <h4 className="tutorial-banner-title">Chronology & Lore Journal Tutorial (역사 연대기 및 일기장 설명)</h4>
          <p>
            Here lies the history of the Empire from <ProperNoun en="768 AD" ko="768년" /> to <ProperNoun en="814 AD" ko="814년" />. 
            Select any year from the medieval scrollbar below. Read the historical lore derived from the epic stories of Charlemagne's Paladins, and draft your knight's own chronicle for that year in the journal editor!
          </p>
        </div>
      </div>

      {/* Year Selection Scrollbar */}
      <div style={{ margin: '20px 0', position: 'relative' }}>
        <h4 className="form-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={16} /> Select Chronicle Year (역사 연도 선택)
        </h4>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
          {chronologyData.map(item => (
            <button 
              key={item.year} 
              className={`btn-medieval ${selectedYear === item.year ? 'btn-medieval-primary' : ''}`}
              style={{ padding: '8px 16px', minWidth: '80px', flexShrink: 0, fontSize: '1.05rem', fontFamily: 'var(--font-english)' }}
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
          <h3 className="card-title" style={{ fontFamily: 'var(--font-english)', fontSize: '1.25rem' }}>
            <span><BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{selectedYear} AD: {currentHistory.title}</span>
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.94rem', lineHeight: '1.6' }}>
            <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: '12px', fontStyle: 'italic', color: 'var(--color-ink-light)' }}>
              {currentHistory.summary}
            </div>
            
            <div>
              <h4 style={{ color: 'var(--color-gold-dark)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px', textTransform: 'uppercase' }}>Historical Details (역사적 전말)</h4>
              <p style={{ color: 'var(--color-ink)' }}>{currentHistory.details}</p>
            </div>

            {currentHistory.events && currentHistory.events.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--color-crimson)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px', textTransform: 'uppercase' }}>Key Events (주요 대소사)</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '15px' }}>
                  {currentHistory.events.map((ev, idx) => (
                    <li key={idx} style={{ fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--color-gold-dark)', fontFamily: 'var(--font-english)', fontSize: '0.82rem', textTransform: 'uppercase', marginRight: '6px' }}>
                        [{ev.type}]
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
            <span><Edit3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Knight's Chronicle Log (기사의 활약상 기록)</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            {existingJournal ? (
              <div style={{ backgroundColor: 'rgba(179,143,67,0.04)', border: '1px solid var(--color-gold-light)', padding: '15px', borderRadius: '2px', position: 'relative' }}>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '40px', fontFamily: 'var(--font-korean)' }}>
                  {existingJournal.text}
                </p>
                <div style={{ display: 'flex', gap: '10px', position: 'absolute', bottom: '10px', right: '10px' }}>
                  <button 
                    className="btn-medieval" 
                    style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    onClick={() => setJournalInput(existingJournal.text)}
                  >
                    Edit Log
                  </button>
                  <button 
                    className="btn-medieval" 
                    style={{ padding: '4px 8px', fontSize: '0.78rem', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}
                    onClick={deleteJournalEntry}
                  >
                    <Trash2 size={12} /> Burn Log
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                No chronicle logged yet for {selectedYear} AD. Draft your achievements below! (기록된 일지가 없습니다. 기사의 영웅담을 아래에 작성해보세요!)
              </div>
            )}

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
              <label className="form-label">Draft Journal Entry (일지 초안 작성)</label>
              <textarea 
                className="form-input" 
                style={{ flex: 1, resize: 'none', fontFamily: 'var(--font-korean)', fontSize: '0.95rem' }} 
                value={journalInput} 
                onChange={e => setJournalInput(e.target.value)}
                placeholder="Write your adventure log here... e.g. We crossed the Pyrenees under deep fog. Roland blew his horn, and the battle cry echoed..."
              />
            </div>
            
            <button 
              className="btn-medieval btn-medieval-primary" 
              onClick={saveJournalEntry}
              style={{ justifyContent: 'center' }}
            >
              <Save size={16} style={{ marginRight: '6px' }} /> Save Journal Log (일지 저장하기)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
