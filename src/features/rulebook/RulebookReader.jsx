import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  History,
  Library,
  Link2,
  NotebookPen,
  Search,
  TableProperties
} from 'lucide-react';
import { LoadingState } from '../../components/ui/LedgerUI';
import {
  clampPrintedPage,
  getChapterForPage,
  loadRulebookPage,
  loadTableIndex,
  RULEBOOK_MANIFEST,
  RULEBOOK_PDF_URL,
  searchRulebook
} from './rulebookData';
import { useRulebook } from './RulebookContext';
import './RulebookReader.css';

const VIEW_LABELS = {
  dashboard: '표지', chronicle: '연대기', character: '기사', family: '가문', winter: '겨울 정산',
  adventure: '모험', combat: '전투와 회복', battle: '대전투와 공성', economy: '재산과 보물',
  personality: '성격과 신앙', procedures: '원문 절차', standing: '지위', glory: '영광', reference: '참조'
};

const CLASS_LABELS = {
  RULE: '규칙', PROCEDURE: '절차', EXCEPTIONS: '예외', TABLE: '표', EXAMPLE: '예시',
  'GM NOTES': 'GM 지침', 'PLAYER NOTES': '플레이어 지침', CONTEXT: '배경', SOURCE: '원문'
};

const chapterLabel = chapter => chapter.id === 'front' || chapter.id === 'appendices'
  ? chapter.title
  : chapter.id === 'introduction' ? `Introduction · ${chapter.title}` : `Chapter ${chapter.number} · ${chapter.title}`;

function LibraryRail({ selectedPage, onSelect, compact }) {
  const { library } = useRulebook();
  return (
    <aside className={`rulebook-library-rail ${compact ? 'is-compact' : ''}`} aria-label="룰북 목차와 개인 서재">
      <section>
        <h3><Library size={16} aria-hidden="true" /> 장과 부록</h3>
        <ol>
          {RULEBOOK_MANIFEST.chapters.map(chapter => (
            <li key={chapter.id}>
              <button type="button" className={selectedPage >= chapter.start && selectedPage <= chapter.end ? 'active' : ''} onClick={() => onSelect(chapter.start)}>
                <span>{chapter.number}</span><b lang="en">{chapter.title}</b><small>{chapter.start}-{chapter.end}</small>
              </button>
            </li>
          ))}
        </ol>
      </section>
      {library.bookmarks.length > 0 && (
        <section>
          <h3><Bookmark size={16} aria-hidden="true" /> 책갈피</h3>
          <div className="rulebook-personal-list">
            {library.bookmarks.map(item => <button type="button" key={item.page} onClick={() => onSelect(item.page)}><span>p.{item.page}</span><b>{item.title}</b></button>)}
          </div>
        </section>
      )}
      {library.recents.length > 0 && (
        <section>
          <h3><History size={16} aria-hidden="true" /> 최근 열람</h3>
          <div className="rulebook-personal-list">
            {library.recents.slice(0, 8).map(item => <button type="button" key={item.page} onClick={() => onSelect(item.page)}><span>p.{item.page}</span><b>{item.title}</b></button>)}
          </div>
        </section>
      )}
    </aside>
  );
}

function SearchWorkspace({ onSelect, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(Boolean(initialQuery));

  useEffect(() => {
    if (!initialQuery) return undefined;
    let active = true;
    searchRulebook(initialQuery).then(items => {
      if (!active) return;
      setResults(items);
      setSearching(false);
    });
    return () => { active = false; };
  }, [initialQuery]);

  const submit = async event => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResults(await searchRulebook(query));
    setSearching(false);
  };

  return (
    <section className="rulebook-search-workspace" aria-labelledby="rulebook-search-title">
      <header><span>Quaere</span><h2 id="rulebook-search-title">463쪽 원문 검색</h2><p>규칙, 절차, 인명, 지명과 페이지 번호를 원문 전체에서 찾습니다.</p></header>
      <form onSubmit={submit} role="search">
        <label><span className="sr-only">룰북 검색어</span><Search size={19} aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="예: Melancholy, Siege, p.425" /></label>
        <button type="submit" className="primary-command">검색</button>
      </form>
      {searching && <LoadingState label="원문 색인을 찾는 중" />}
      {!searching && query && results.length === 0 && <p className="rulebook-empty-result">일치하는 원문을 찾지 못했습니다.</p>}
      <div className="rulebook-search-results">
        {results.map(result => (
          <button type="button" key={result.pdfPage} onClick={() => onSelect(result.printedPage)}>
            <span>p.{result.printedPage}</span>
            <div><b>{result.title}</b><p>{result.snippet}</p></div>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function TableLibrary({ onSelect }) {
  const [tables, setTables] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    loadTableIndex().then(items => { if (active) setTables(items); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!tables) return [];
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return tables;
    return tables.filter(table => `${table.number} ${table.title} ${table.chapterNumber}`.toLocaleLowerCase().includes(normalized));
  }, [query, tables]);

  return (
    <section className="rulebook-table-library" aria-labelledby="rulebook-tables-title">
      <header><span>Tabulae</span><h2 id="rulebook-tables-title">원문 표 163개</h2><p>번호 표 107개와 원문 색인의 역사·시장·전투 비번호 표 56개입니다.</p></header>
      <label className="rulebook-filter"><Search size={17} aria-hidden="true" /><span className="sr-only">표 검색</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="표 번호 또는 이름" /></label>
      {!tables && <LoadingState label="표 색인을 펼치는 중" />}
      <div className="rulebook-table-grid">
        {filtered.map(table => (
          <button type="button" key={table.id} onClick={() => onSelect(table.printedPage)}>
            <span>{table.number}</span><b lang="en">{table.title}</b><small>Chapter {table.chapterNumber} · p.{table.printedPage}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function PageNotes({ page }) {
  const { library, saveNote } = useRulebook();
  return (
    <section className="rulebook-notes" aria-labelledby="rulebook-notes-title">
      <h3 id="rulebook-notes-title"><NotebookPen size={17} aria-hidden="true" /> 개인 주석</h3>
      <label><span>읽기 메모</span><textarea value={library.notes[String(page)] || ''} onChange={event => saveNote(page, event.target.value, 'notes')} rows="4" /></label>
      <label className="house-rule-note"><span>하우스 룰 · 원문과 분리</span><textarea value={library.houseRules[String(page)] || ''} onChange={event => saveNote(page, event.target.value, 'houseRules')} rows="4" /></label>
      <p>이 기록은 개인 룰북 서재에만 저장되며 캠페인 판정과 수치를 변경하지 않습니다.</p>
    </section>
  );
}

function SourcePage({ page, onSelect }) {
  const { library, bookmarkPage, navigateToGame } = useRulebook();
  const chapter = getChapterForPage(page.printedPage);
  const bookmarked = library.bookmarks.some(item => item.page === page.printedPage);
  const pdfHref = `${RULEBOOK_PDF_URL}#page=${page.pdfPage}`;
  const hasColumns = page.leftColumn || page.rightColumn;

  return (
    <article className="rulebook-source-page" aria-labelledby="rulebook-source-title">
      <header className="rulebook-source-page__heading">
        <div><span>{chapterLabel(chapter)}</span><h2 id="rulebook-source-title">{page.title}</h2><p>Printed p.{page.printedPage} · PDF p.{page.pdfPage}</p></div>
        <div className="rulebook-page-actions">
          <button type="button" className="secondary-command" onClick={() => bookmarkPage({ page: page.printedPage, title: page.title })}>{bookmarked ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}{bookmarked ? '책갈피 해제' : '책갈피'}</button>
          <a className="secondary-command" href={pdfHref} target="_blank" rel="noreferrer"><ExternalLink size={17} aria-hidden="true" /> PDF 원문</a>
        </div>
      </header>

      {page.ambiguity && (
        <aside className="rulebook-ambiguity">
          <AlertTriangle size={19} aria-hidden="true" />
          <div><strong>{page.ambiguity.id} · 원문 모호성</strong><p>{page.ambiguity.label}</p><small>{page.ambiguity.handling}</small></div>
        </aside>
      )}

      <div className="rulebook-classifications" aria-label="이 페이지의 자료 유형">
        {page.classifications.map(item => <span key={item}>{CLASS_LABELS[item] || item}</span>)}
      </div>

      <section className="rulebook-practical-context">
        <div>
          <h3>이 페이지에서 찾을 것</h3>
          {page.headings.length > 0 ? <ul>{page.headings.map(heading => <li key={heading}>{heading}</li>)}</ul> : <p>해당 페이지의 원문 본문과 표를 확인합니다.</p>}
        </div>
        {page.tables.length > 0 && <div><h3>표</h3><ul>{page.tables.map(table => <li key={table}>{table}</li>)}</ul></div>}
        {chapter.runtimeView !== 'rulebook' && (
          <button type="button" className="rulebook-use-button" onClick={() => navigateToGame(chapter.runtimeView)}>
            <Link2 size={17} aria-hidden="true" /><span><b>{VIEW_LABELS[chapter.runtimeView] || chapter.runtimeView}</b>에서 현재 게임 계속</span><ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </section>

      {page.segments?.some(segment => !['SOURCE', 'CONTEXT'].includes(segment.type)) && (
        <section className="rulebook-structured-sections" aria-labelledby="rulebook-structured-title">
          <header><h3 id="rulebook-structured-title">실전 참조 블록</h3><p>원문 전사에서 자동 분류한 탐색 보조이며, 판정 근거는 아래 전체 전사와 원면입니다.</p></header>
          <div>
            {page.segments.filter(segment => !['SOURCE', 'CONTEXT'].includes(segment.type)).map((segment, index) => (
              <details key={`${segment.type}-${index}`}>
                <summary><span>{CLASS_LABELS[segment.type] || segment.type}</span>{segment.text.split('\n')[0].slice(0, 100)}</summary>
                <pre>{segment.text}</pre>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="rulebook-transcript" aria-labelledby="rulebook-transcript-title">
        <header><BookOpenText size={18} aria-hidden="true" /><div><h3 id="rulebook-transcript-title">원문 전사</h3><p>개인 소장 PDF에서 추출한 해당 인쇄면의 텍스트입니다.</p></div></header>
        {hasColumns ? (
          <>
            <div className="rulebook-transcript__columns">
              <pre>{page.leftColumn}</pre><pre>{page.rightColumn}</pre>
            </div>
            <details className="rulebook-linear-transcript">
              <summary>전체 폭 표를 위한 선형 전사</summary>
              <pre>{page.fullText}</pre>
            </details>
          </>
        ) : <pre>{page.fullText}</pre>}
      </section>

      {page.crossReferences.length > 0 && (
        <section className="rulebook-crossrefs">
          <h3><Link2 size={17} aria-hidden="true" /> 원문 교차 참조</h3>
          <div>{page.crossReferences.map((reference, index) => reference.type === 'page'
            ? <button type="button" key={`${reference.label}-${index}`} onClick={() => onSelect(reference.page)}>{reference.label}</button>
            : <button type="button" key={`${reference.label}-${index}`} onClick={() => onSelect(RULEBOOK_MANIFEST.chapters.find(item => item.id === reference.chapterId)?.start || 14)}>{reference.label}</button>)}</div>
        </section>
      )}

      <PageNotes page={page.printedPage} />
    </article>
  );
}

export default function RulebookReader({ initialPage = 14, initialQuery = '', compact = false }) {
  const { library, rememberPage } = useRulebook();
  const [selectedPage, setSelectedPage] = useState(clampPrintedPage(initialPage));
  const [pageInput, setPageInput] = useState(String(clampPrintedPage(initialPage)));
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState('');
  const [workspace, setWorkspace] = useState(initialQuery ? 'search' : 'page');

  useEffect(() => {
    let active = true;
    loadRulebookPage(selectedPage)
      .then(page => {
        if (!active) return;
        setPageData(page);
        rememberPage({ page: page.printedPage, title: page.title });
      })
      .catch(caught => { if (active) setError(caught instanceof Error ? caught.message : '원문 페이지를 불러오지 못했습니다.'); });
    return () => { active = false; };
  }, [rememberPage, selectedPage]);

  const selectPage = value => {
    const page = clampPrintedPage(value);
    setError('');
    setPageData(null);
    setSelectedPage(page);
    setPageInput(String(page));
    setWorkspace('page');
  };

  const commitPageInput = () => {
    const page = clampPrintedPage(pageInput);
    selectPage(page);
  };

  const exportLibrary = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'paladin-personal-rulebook-notes.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className={`rulebook-reader ${compact ? 'is-compact' : ''}`}>
      {!compact && (
        <header className="rulebook-reader__masthead">
          <div><span>Codex Privatus · v1.1</span><h1>개인 룰북</h1><p>Paladin 원문 463쪽을 현재 플레이 맥락과 연결한 비공개 참조 장부</p></div>
          <dl>
            <div><dt>원문</dt><dd>{RULEBOOK_MANIFEST.coverage.sourcePages}</dd></div>
            <div><dt>장·부록</dt><dd>{RULEBOOK_MANIFEST.coverage.chapters}</dd></div>
            <div><dt>표</dt><dd>{RULEBOOK_MANIFEST.coverage.tables}</dd></div>
            <div><dt>모호성</dt><dd>{RULEBOOK_MANIFEST.ambiguities.length}</dd></div>
          </dl>
        </header>
      )}

      <div className="rulebook-reader__toolbar">
        <div className="segmented-control" role="group" aria-label="룰북 보기">
          <button type="button" className={workspace === 'page' ? 'active' : ''} onClick={() => setWorkspace('page')}><BookOpenText size={16} aria-hidden="true" /> 페이지</button>
          <button type="button" className={workspace === 'search' ? 'active' : ''} onClick={() => setWorkspace('search')}><Search size={16} aria-hidden="true" /> 검색</button>
          <button type="button" className={workspace === 'tables' ? 'active' : ''} onClick={() => setWorkspace('tables')}><TableProperties size={16} aria-hidden="true" /> 표</button>
        </div>
        <label className="rulebook-page-jump"><span>p.</span><input type="number" min="0" max="462" value={pageInput} onChange={event => setPageInput(event.target.value)} onBlur={commitPageInput} onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur(); }} aria-label="인쇄 페이지로 이동" /></label>
        <button type="button" className="icon-command" onClick={exportLibrary} title="책갈피와 메모 내보내기" aria-label="책갈피와 메모 내보내기"><Download size={18} aria-hidden="true" /></button>
      </div>

      <div className="rulebook-reader__layout">
        <LibraryRail compact={compact} selectedPage={selectedPage} onSelect={selectPage} />
        <main className="rulebook-reader__content">
          {workspace === 'page' && (
            <>
              <nav className="rulebook-page-nav" aria-label="룰북 페이지 이동">
                <button type="button" onClick={() => selectPage(selectedPage - 1)} disabled={selectedPage <= 0}><ChevronLeft size={16} aria-hidden="true" /> 이전</button>
                <span>{chapterLabel(getChapterForPage(selectedPage))}</span>
                <button type="button" onClick={() => selectPage(selectedPage + 1)} disabled={selectedPage >= 462}>다음 <ChevronRight size={16} aria-hidden="true" /></button>
              </nav>
              {!pageData && !error && <LoadingState label="원문 페이지를 펼치는 중" />}
              {error && <div className="rulebook-load-error" role="alert"><AlertTriangle size={18} aria-hidden="true" /><p>{error}</p><a href={RULEBOOK_PDF_URL} target="_blank" rel="noreferrer">PDF 직접 열기</a></div>}
              {pageData && pageData.printedPage === selectedPage && <SourcePage page={pageData} onSelect={selectPage} />}
            </>
          )}
          {workspace === 'search' && <SearchWorkspace initialQuery={initialQuery} onSelect={selectPage} />}
          {workspace === 'tables' && <TableLibrary onSelect={selectPage} />}
        </main>
      </div>
    </div>
  );
}
