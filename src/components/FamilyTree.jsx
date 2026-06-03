import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Plus, Trash2, Edit, Crown, UserPlus, X, RefreshCw, Info, Calendar, Skull } from 'lucide-react';

const parseName = (fullName) => {
  if (!fullName) return { ko: '', en: '' };
  const regex = /([^(]+)\s*(?:\(([^)]+)\))?/;
  const match = fullName.match(regex);
  let koPart = fullName;
  let enPart = '';
  
  if (match) {
    koPart = match[1].trim();
    enPart = match[2] ? match[2].trim() : '';
  }

  // Remove common titles to get raw name
  const cleanKo = koPart.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  const cleanEn = enPart.replace(/^(Sir|Baron|Count|Earl|Duke|Lord|Lady)\s+/i, '').trim();

  return { ko: cleanKo, en: cleanEn };
};

const getTitleByNameAndClass = (koName, enName, statusClass) => {
  if (!koName) return '';
  const cleanKo = koName.replace(/\s*(경|남작|백작|공작|영주|부인|종자)$/, '').trim();
  const cleanEn = enName ? enName.replace(/^(Sir|Baron|Count|Earl|Duke|Lord|Lady)\s+/i, '').trim() : '';

  const cls = (statusClass || '').toLowerCase();
  
  let koTitle = '';
  let enPrefix = '';

  if (cls.includes('공작') || cls.includes('duke')) {
    koTitle = ' 공작';
    enPrefix = 'Duke ';
  } else if (cls.includes('백작') || cls.includes('count') || cls.includes('earl')) {
    koTitle = ' 백작';
    enPrefix = 'Count ';
  } else if (cls.includes('남작') || cls.includes('baron')) {
    koTitle = ' 남작';
    enPrefix = 'Baron ';
  } else if (cls.includes('영주') || cls.includes('lord') || cls.includes('officer') || cls.includes('지방관')) {
    koTitle = ' 영주';
    enPrefix = 'Lord ';
  } else if (cls.includes('부인') || cls.includes('lady')) {
    koTitle = ' 부인';
    enPrefix = 'Lady ';
  } else if (cls.includes('종자') || cls.includes('squire')) {
    koTitle = '';
    enPrefix = '';
  } else if (cls.includes('기사') || cls.includes('knight') || cls.includes('vassal') || cls.includes('bachelor') || cls.includes('mercenary') || cls.includes('banneret')) {
    koTitle = ' 경';
    enPrefix = 'Sir ';
  } else {
    // Default fallback to "경" / "Sir" for general knights/nobles
    koTitle = '';
    enPrefix = '';
  }

  const finalKo = `${cleanKo}${koTitle}`;
  const finalEn = cleanEn ? ` (${enPrefix}${cleanEn})` : '';
  return `${finalKo}${finalEn}`;
};

const splitName = (fullName) => {
  if (!fullName) return { ko: '', en: '' };
  const regex = /([^(]+)\s*(?:\(([^)]+)\))?/;
  const match = fullName.match(regex);
  let koPart = fullName;
  let enPart = '';
  
  if (match) {
    koPart = match[1].trim();
    enPart = match[2] ? match[2].trim() : '';
  }
  return { ko: koPart, en: enPart };
};

export default function FamilyTree({ character, setCharacter }) {
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Modal Form States
  const [formName, setFormName] = useState('');
  const [formNameKo, setFormNameKo] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formMemberClass, setFormMemberClass] = useState('기사 (Knight)');
  const [formRelation, setFormRelation] = useState('자녀');
  const [formGeneration, setFormGeneration] = useState(2);
  const [formStatus, setFormStatus] = useState('생존');
  const [formLifeYears, setFormLifeYears] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDeathCause, setFormDeathCause] = useState('');
  const [formParentId, setFormParentId] = useState('');
  const [formSpouseId, setFormSpouseId] = useState('');

  const treeContainerRef = useRef(null);
  const [lines, setLines] = useState([]);

  const members = (character.family?.members || []).map(m => {
    if (m.relation === '본인') {
      return { ...m, name: character.personal?.name || m.name };
    }
    return m;
  });

  // Default Template for reset
  const defaultMembers = [
    { id: 'albert', name: '알베르 경 (Sir Albert)', relation: '조부', generation: 0, status: '사망', lifeYears: '702~770', deathCause: '영지 분쟁', note: '샤를마뉴 대제 초기의 백작 기사이자 전설적인 용사.' },
    { id: 'gerard', name: '제라르 경 (Sir Gerard)', relation: '부친', generation: 1, status: '사망', lifeYears: '724~768', deathCause: '파비아 공성전', note: '작센 원정에서 주군을 구하고 명예롭게 전사.', spouseId: 'eleanor' },
    { id: 'eleanor', name: '엘레오노르 부인 (Lady Eleanor)', relation: '모친', generation: 1, status: '생존', lifeYears: '748~', note: '기품 있는 성품으로 영지 관리를 돌보는 인자한 어머니.', spouseId: 'gerard' },
    { id: 'roland', name: '롤랑 경 (Sir Roland)', relation: '본인', generation: 2, status: '생존', lifeYears: '768~', note: '플레이어 캐릭터. 샤를마뉴 대제의 젊은 성기사.', parentId: 'gerard' },
    { id: 'pierre', name: '피에르 경 (Sir Pierre)', relation: '남동생', generation: 2, status: '생존', lifeYears: '772~', note: '형의 뒤를 이어 성기사가 되기 위해 맹훈련 중인 종자.', parentId: 'gerard' }
  ];

  // SVG Lines Calculation
  const calculateLines = () => {
    if (!treeContainerRef.current) return;
    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const computedLines = [];

    // Track drawn marriages to avoid duplicate lines
    const drawnMarriages = new Set();

    members.forEach(member => {
      // 1. Marriage Lines
      if (member.spouseId && !drawnMarriages.has(`${member.id}-${member.spouseId}`) && !drawnMarriages.has(`${member.spouseId}-${member.id}`)) {
        const nodeEl = treeContainerRef.current.querySelector(`[data-node-id="${member.id}"]`);
        const spouseEl = treeContainerRef.current.querySelector(`[data-node-id="${member.spouseId}"]`);

        if (nodeEl && spouseEl) {
          const r1 = nodeEl.getBoundingClientRect();
          const r2 = spouseEl.getBoundingClientRect();

          // Draw line from the right edge of the left card to the left edge of the right card
          const isLeft = r1.left < r2.left;
          const leftCard = isLeft ? r1 : r2;
          const rightCard = isLeft ? r2 : r1;

          const x1 = leftCard.right - containerRect.left;
          const y1 = (leftCard.top + leftCard.bottom) / 2 - containerRect.top;
          const x2 = rightCard.left - containerRect.left;
          const y2 = (rightCard.top + rightCard.bottom) / 2 - containerRect.top;

          computedLines.push({
            type: 'marriage',
            id: `m-${member.id}-${member.spouseId}`,
            x1, y1, x2, y2,
            path: `M ${x1} ${y1} L ${x2} ${y2}`
          });
          drawnMarriages.add(`${member.id}-${member.spouseId}`);
        }
      }

      // 2. Parent-Child Lines
      if (member.parentId) {
        const childEl = treeContainerRef.current.querySelector(`[data-node-id="${member.id}"]`);
        const parentNode = members.find(m => m.id === member.parentId);
        
        if (childEl && parentNode) {
          const childRect = childEl.getBoundingClientRect();
          const childX = (childRect.left + childRect.right) / 2 - containerRect.left;
          const childY = childRect.top - containerRect.top;

          // If the parent has a spouse, we should draw from the marriage center rather than a single parent
          let parentX, parentY;
          const parentEl = treeContainerRef.current.querySelector(`[data-node-id="${parentNode.id}"]`);
          const spouseEl = parentNode.spouseId ? treeContainerRef.current.querySelector(`[data-node-id="${parentNode.spouseId}"]`) : null;

          if (parentEl && spouseEl) {
            const pr = parentEl.getBoundingClientRect();
            const sr = spouseEl.getBoundingClientRect();
            parentX = ((pr.left + pr.right) / 2 + (sr.left + sr.right) / 2) / 2 - containerRect.left;
            parentY = ((pr.top + pr.bottom) / 2 + (sr.top + sr.bottom) / 2) / 2 - containerRect.top;
          } else if (parentEl) {
            const pr = parentEl.getBoundingClientRect();
            parentX = (pr.left + pr.right) / 2 - containerRect.left;
            parentY = pr.bottom - containerRect.top;
          }

          if (parentX !== undefined && parentY !== undefined) {
            // Cubic Bezier curve for vertical flow
            const midY = (parentY + childY) / 2;
            const path = `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`;
            
            computedLines.push({
              type: 'lineage',
              id: `l-${parentNode.id}-${member.id}`,
              path
            });
          }
        }
      }
    });

    setLines(computedLines);
  };

  useEffect(() => {
    // Recalculate layout paths after component rendering or data changes
    const timer = setTimeout(() => {
      calculateLines();
    }, 100);

    window.addEventListener('resize', calculateLines);
    
    // Setup ResizeObserver for the tree container itself to track dynamic DOM shifts
    let observer;
    if (treeContainerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        calculateLines();
      });
      observer.observe(treeContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLines);
      if (observer) observer.disconnect();
    };
  }, [members]);

  // Open Modal to Add Member
  const handleOpenAdd = (defaultParentId = '', defaultSpouseId = '', targetGen = 2) => {
    setModalMode('add');
    setFormNameKo('');
    setFormNameEn('');
    setFormMemberClass('기사 (Knight)');
    setFormName('');
    setFormRelation('자녀');
    setFormGeneration(targetGen);
    setFormStatus('생존');
    setFormLifeYears('');
    setFormNote('');
    setFormDeathCause('');
    setFormParentId(defaultParentId);
    setFormSpouseId(defaultSpouseId);
    setIsModalOpen(true);
  };

  // Open Modal to Edit Member
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setModalMode('edit');
    const parsed = parseName(member.name);
    setFormNameKo(parsed.ko);
    setFormNameEn(parsed.en);
    setFormMemberClass(member.memberClass || (member.name.includes('경') ? '기사 (Knight)' : member.name.includes('부인') ? '부인 (Lady)' : member.name.includes('공작') ? '공작 (Duke)' : member.name.includes('백작') ? '백작 (Count)' : member.name.includes('남작') ? '남작 (Baron)' : member.name.includes('영주') ? '영주 (Lord)' : '종자 (Squire)'));
    setFormName(member.name);
    setFormRelation(member.relation);
    setFormGeneration(member.generation);
    setFormStatus(member.status);
    setFormLifeYears(member.lifeYears || '');
    setFormNote(member.note || '');
    setFormDeathCause(member.deathCause || '');
    setFormParentId(member.parentId || '');
    setFormSpouseId(member.spouseId || '');
    setIsModalOpen(true);
  };

  // Save Modal Form Data
  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (!formNameKo.trim()) {
        alert("한국어 이름을 입력해 주세요!");
        return;
      }

      if (modalMode === 'edit' && !editingMember) {
        alert("수정할 대상 인물이 지정되지 않았습니다.");
        return;
      }

      const combinedName = getTitleByNameAndClass(formNameKo, formNameEn, formMemberClass);
      let updatedMembers = [...members];

      if (modalMode === 'add') {
        const newId = 'm-' + Date.now();
        const newMember = {
          id: newId,
          name: combinedName,
          relation: formRelation,
          generation: Number(formGeneration),
          status: formStatus,
          lifeYears: formLifeYears,
          note: formNote,
          memberClass: formMemberClass,
          deathCause: formStatus === '사망' ? formDeathCause : undefined,
          parentId: formParentId || undefined,
          spouseId: formSpouseId || undefined
        };

        updatedMembers.push(newMember);

        // If spouse selected, mutually link them
        if (formSpouseId) {
          updatedMembers = updatedMembers.map(m => {
            if (m && m.id === formSpouseId) {
              return { ...m, spouseId: newId };
            }
            return m;
          });
        }
      } else {
        // Edit mode
        const prevSpouseId = editingMember.spouseId;

        updatedMembers = updatedMembers.map(m => {
          if (!m) return m;
          if (m.id === editingMember.id) {
            return {
              ...m,
              name: combinedName,
              relation: formRelation,
              generation: Number(formGeneration),
              status: formStatus,
              lifeYears: formLifeYears,
              note: formNote,
              memberClass: formMemberClass,
              deathCause: formStatus === '사망' ? formDeathCause : undefined,
              parentId: formParentId || undefined,
              spouseId: formSpouseId || undefined
            };
          }
          
          // Remove link from previous spouse if spouse changed
          if (prevSpouseId && prevSpouseId !== formSpouseId && m.id === prevSpouseId) {
            return { ...m, spouseId: undefined };
          }

          // Add link to new spouse
          if (formSpouseId && m.id === formSpouseId) {
            return { ...m, spouseId: editingMember.id };
          }

          return m;
        });
      }

      // If editing player main character (relation === '본인'), sync character name
      const isPlayer = modalMode === 'edit' && editingMember.relation === '본인';

      setCharacter(prev => {
        const nextChar = {
          ...prev,
          family: {
            ...prev.family,
            members: updatedMembers
          }
        };
        if (isPlayer) {
          nextChar.personal = {
            ...prev.personal,
            name: combinedName
          };
        }
        return nextChar;
      });

      setIsModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error("Error in FamilyTree handleSave:", err);
      alert("정보 저장 중 오류가 발생했습니다: " + err.message);
    }
  };

  // Delete Member
  const handleDelete = (id) => {
    const target = members.find(m => m.id === id);
    if (!target) return;
    
    if (target.relation === '본인') {
      alert("플레이어 기사 본인은 가계도에서 삭제할 수 없습니다!");
      return;
    }

    if (!window.confirm(`정말로 ${target.name}님을 가계도에서 삭제하시겠습니까?\n(연결된 배우자 및 자식 관계선도 함께 정리됩니다)`)) {
      return;
    }

    let updatedMembers = members.filter(m => m.id !== id);

    // Clean up references in other members
    updatedMembers = updatedMembers.map(m => {
      let updated = { ...m };
      if (m.parentId === id) {
        updated.parentId = undefined;
      }
      if (m.spouseId === id) {
        updated.spouseId = undefined;
      }
      return updated;
    });

    setCharacter(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: updatedMembers
      }
    }));
  };

  // Quick Toggle Death Status
  const handleToggleDeath = (id) => {
    const updatedMembers = members.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === '사망' ? '생존' : '사망';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    setCharacter(prev => ({
      ...prev,
      family: {
        ...prev.family,
        members: updatedMembers
      }
    }));
  };

  // Reset to Default Template
  const handleReset = () => {
    if (window.confirm("가계도를 아르덴 가문의 기본 계보 템플릿으로 초기화하시겠습니까?\n(유저가 추가한 임의의 구성원은 삭제됩니다)")) {
      setCharacter(prev => ({
        ...prev,
        family: {
          ...prev.family,
          members: defaultMembers
        }
      }));
    }
  };

  // Group Members by Generation
  const generations = [0, 1, 2, 3, 4, 5];
  const genLabels = [
    "조부모 세대 (Grandparents)",
    "부모 세대 (Parents)",
    "본인 및 형제 세대 (Knight's Gen)",
    "자녀 세대 (Children)",
    "손자녀 세대 (Descendants)",
    "증손자녀 세대 (Great-Grandchildren)"
  ];

  // Helper to render spouse links side-by-side
  const renderGenerationRow = (gen) => {
    const genMembers = members.filter(m => m.generation === gen);
    if (genMembers.length === 0) return null;

    const renderedIds = new Set();
    const groups = [];

    genMembers.forEach(member => {
      if (renderedIds.has(member.id)) return;

      if (member.spouseId) {
        const spouse = genMembers.find(m => m.id === member.spouseId);
        if (spouse) {
          groups.push({
            type: 'marriage',
            husband: member,
            wife: spouse
          });
          renderedIds.add(member.id);
          renderedIds.add(spouse.id);
          return;
        }
      }

      groups.push({
        type: 'single',
        member
      });
      renderedIds.add(member.id);
    });

    return (
      <div key={gen} className="ft-gen-row view-animate">
        <div className="ft-gen-label">
          <span className="ft-gen-badge">{gen}대</span>
          <span className="ft-gen-text">{genLabels[gen]}</span>
        </div>
        <div className="ft-gen-nodes">
          {groups.map((group, idx) => {
            if (group.type === 'marriage') {
              return (
                <div key={idx} className="ft-marriage-block">
                  {renderMemberCard(group.husband)}
                  <div className="ft-marriage-heart">
                    <Heart size={14} fill="var(--color-danger)" color="var(--color-danger)" />
                  </div>
                  {renderMemberCard(group.wife)}
                </div>
              );
            } else {
              return (
                <div key={idx} className="ft-single-block">
                  {renderMemberCard(group.member)}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '생존': return '#2e6b33';
      case '사망': return '#6b5d4e';
      case '질병': return '#8b2020';
      case '실종': return '#702b8b';
      case '포로': return '#d27c2c';
      default: return '#2e1f0f';
    }
  };

  const renderMemberCard = (member) => {
    const isKnight = member.relation === '본인';
    const statusColor = getStatusColor(member.status);
    const isDeceased = member.status === '사망';

    return (
      <div 
        className={`ft-card ${isKnight ? 'ft-card-knight' : ''} ${isDeceased ? 'ft-card-deceased' : ''}`}
        data-node-id={member.id}
      >


        
        <div className="ft-card-header">
          <span className="ft-relation">{member.relation}</span>
          {member.status !== '생존' && (
            <span 
              className="ft-status-text"
              style={{ color: statusColor, fontWeight: 'bold', fontSize: '0.62rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-korean)' }}
            >
              {member.status === '사망' && '🪦 영면'}
              {member.status === '질병' && '🩸 병환'}
              {member.status === '실종' && '🌫️ 행방불명'}
              {member.status === '포로' && '⛓️ 억류'}
            </span>
          )}
        </div>

        <h4 className="ft-name" style={{ textDecoration: isDeceased ? 'line-through' : 'none' }}>
          <span className="ft-name-ko">{splitName(member.name).ko}</span>
          {splitName(member.name).en && (
            <span className="ft-name-en">{splitName(member.name).en}</span>
          )}
        </h4>
        
        {member.lifeYears && (
          <div className="ft-years">
            {member.lifeYears}
          </div>
        )}
        {isDeceased && member.deathCause && (
          <div className="ft-death-cause">
            ({member.deathCause})
          </div>
        )}




        {/* Hover overlay with action buttons */}
        <div className="ft-card-overlay">
          <button 
            className="ft-action-btn" 
            title="인물 정보 편집"
            onClick={() => handleOpenEdit(member)}
          >
            <Edit size={12} />
          </button>
          
          <button 
            className="ft-action-btn" 
            title="자녀 추가"
            onClick={() => handleOpenAdd(member.id, undefined, member.generation + 1)}
          >
            <Plus size={12} />
          </button>

          {!member.spouseId && (
            <button 
              className="ft-action-btn" 
              title="배우자 추가"
              onClick={() => handleOpenAdd(undefined, member.id, member.generation)}
            >
              <UserPlus size={12} />
            </button>
          )}

          <button 
            className={`ft-action-btn ${isDeceased ? 'btn-revive' : 'btn-kill'}`} 
            title={isDeceased ? "생존 상태로 전환" : "사망 상태로 전환 (비명서거)"}
            onClick={() => handleToggleDeath(member.id)}
            style={{ fontSize: '0.9rem' }}
          >
            {isDeceased ? "🌱" : "💀"}
          </button>

          {!isKnight && (
            <button 
              className="ft-action-btn btn-danger" 
              title="가문원 삭제"
              onClick={() => handleDelete(member.id)}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ft-container view-animate">
      
      {/* Action Header controls */}
      <div className="ft-toolbar">
        <div>
          <h4 style={{ fontWeight: 'bold', color: 'var(--color-royal-blue)' }}>🏰 {character.family.name} 가문 계보도</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-grey)', marginTop: '2px' }}>
            가문원 카드에 마우스를 올리면 관계선 추가, 편집, 삭제가 가능합니다. (본인 {character.personal?.name || '롤랑 경'} 중심)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-medieval btn-medieval-primary" onClick={() => handleOpenAdd()}>
            <Plus size={14} /> 새 가문원 영입
          </button>
          <button className="btn-medieval" onClick={handleReset}>
            <RefreshCw size={13} /> 계보도 초기화
          </button>
        </div>
      </div>

      {/* Main Family Tree Drawer Canvas */}
      <div className="ft-canvas-wrapper">
        <div className="ft-canvas" ref={treeContainerRef}>
          
          {/* SVG Overlay layer for connection lines */}
          <svg className="ft-svg-layer">
            {lines.map((line) => (
              <path
                key={line.id}
                d={line.path}
                className={`ft-svg-path ${line.type === 'marriage' ? 'path-marriage' : 'path-lineage'}`}
              />
            ))}
          </svg>

          {/* Render Generations Row by Row */}
          <div className="ft-rows-container">
            {generations.map(gen => renderGenerationRow(gen))}
          </div>

        </div>
      </div>

      {/* Modal Dialog for Add/Edit Member */}
      {isModalOpen && createPortal(
        <div className="ft-modal-overlay">
          <form onSubmit={handleSave} className="ft-modal view-animate">
            <div className="ft-modal-header">
              <h3>{modalMode === 'add' ? '새 가문원 추가' : '가문원 정보 수정'}</h3>
              <button type="button" className="ft-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="ft-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">한국어 이름:</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formNameKo} 
                    onChange={e => setFormNameKo(e.target.value)}
                    placeholder="예: 기욤"
                    required
                  />
                </div>
                <div className="ft-form-group">
                  <label className="ft-label">영어 이름 (선택):</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formNameEn} 
                    onChange={e => setFormNameEn(e.target.value)}
                    placeholder="예: Guillaume"
                  />
                </div>
              </div>

              <div className="ft-form-group">
                <label className="ft-label">가문원 신분/칭호 규칙:</label>
                <select 
                  className="ft-input"
                  value={formMemberClass}
                  onChange={e => setFormMemberClass(e.target.value)}
                >
                  <option value="종자 (Squire)">종자 (Squire) - 칭호 없음</option>
                  <option value="기사 (Knight)">기사 (Knight) - 경 / Sir</option>
                  <option value="영주 (Lord)">영주/지방관 기사 (Lord) - 영주 / Lord</option>
                  <option value="남작 (Baron)">남작 (Baron) - 남작 / Baron</option>
                  <option value="백작 (Count)">백작 (Count) - 백작 / Count</option>
                  <option value="공작 (Duke)">공작 (Duke) - 공작 / Duke</option>
                  <option value="부인 (Lady)">부인 (Lady) - 부인 / Lady</option>
                  <option value="기타 (Custom)">기타 (직접 지정 안함) - 기본값 출력</option>
                </select>
              </div>

              <div className="ft-form-group" style={{ backgroundColor: 'rgba(201,168,76,0.05)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.15)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-grey)', display: 'block' }}>계산된 최종 이름 (가계도 표시):</span>
                <strong style={{ color: 'var(--color-gold-dark)', fontSize: '0.88rem' }}>
                  {getTitleByNameAndClass(formNameKo, formNameEn, formMemberClass) || '(이름을 입력하세요)'}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">가문내 관계/역할:</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formRelation} 
                    onChange={e => setFormRelation(e.target.value)}
                    placeholder="예: 부인, 첫째 아들, 고모"
                  />
                </div>
                
                <div className="ft-form-group">
                  <label className="ft-label">세대 선택 (0~5대):</label>
                  <select 
                    className="ft-input" 
                    value={formGeneration} 
                    onChange={e => setFormGeneration(e.target.value)}
                  >
                    {generations.map(gen => (
                      <option key={gen} value={gen}>{gen}대 ({genLabels[gen].split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">현재 생존/건강 상태:</label>
                  <select 
                    className="ft-input" 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                  >
                    <option value="생존">생존 (Healthy)</option>
                    <option value="사망">사망 (Deceased)</option>
                    <option value="질병">질병 (Illness)</option>
                    <option value="실종">실종 (Missing)</option>
                    <option value="포로">포로 (Captive)</option>
                  </select>
                </div>

                <div className="ft-form-group">
                  <label className="ft-label">생몰년도:</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formLifeYears} 
                    onChange={e => setFormLifeYears(e.target.value)}
                    placeholder="예: 768~ 또는 725~770"
                  />
                </div>
              </div>

              {formStatus === '사망' && (
                <div className="ft-form-group view-animate">
                  <label className="ft-label">사망 원인 (예: 파비아 공성전, 노환, 사고):</label>
                  <input 
                    type="text" 
                    className="ft-input" 
                    value={formDeathCause} 
                    onChange={e => setFormDeathCause(e.target.value)}
                    placeholder="예: 파비아 공성전, 노환, 사고 등 짧게 입력"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ft-form-group">
                  <label className="ft-label">부모 연결:</label>
                  <select 
                    className="ft-input" 
                    value={formParentId} 
                    onChange={e => setFormParentId(e.target.value)}
                  >
                    <option value="">없음</option>
                    {members
                      .filter(m => m.id !== editingMember?.id)
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                      ))
                    }
                  </select>
                </div>

                <div className="ft-form-group">
                  <label className="ft-label">배우자 연결:</label>
                  <select 
                    className="ft-input" 
                    value={formSpouseId} 
                    onChange={e => setFormSpouseId(e.target.value)}
                  >
                    <option value="">없음</option>
                    {members
                      .filter(m => m.id !== editingMember?.id && m.generation === Number(formGeneration))
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="ft-form-group">
                <label className="ft-label">인물 기록 및 특징 (메모):</label>
                <textarea 
                  className="ft-input" 
                  rows={2}
                  value={formNote} 
                  onChange={e => setFormNote(e.target.value)}
                  placeholder="예: 사생아 출생 룰로 인해 태어남. 가문의 기사단장."
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            <div className="ft-modal-footer">
              <button type="button" className="btn-medieval" onClick={() => setIsModalOpen(false)}>
                취소
              </button>
              <button type="submit" className="btn-medieval btn-medieval-primary">
                {modalMode === 'add' ? '추가하기' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

    </div>
  );
}
