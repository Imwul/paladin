import manifest from './data/manifest.json';

const chapterModules = import.meta.glob('./data/chapters/*.json');
let searchIndexPromise;
let tableIndexPromise;

export const RULEBOOK_MANIFEST = manifest;
export const RULEBOOK_PDF_URL = new URL('../../../paladin_core_rulebook.pdf', import.meta.url).href;

export const VIEW_RULEBOOK_CONTEXT = {
  dashboard: { page: 14, label: 'Introduction' },
  chronicle: { page: 285, label: 'Chapter 15 · The Future' },
  character: { page: 25, label: 'Chapter 1 · Character Creation' },
  family: { page: 45, label: 'Chapter 2 · The Past' },
  winter: { page: 173, label: 'Chapter 10 · The Winter Phase' },
  adventure: { page: 391, label: 'Chapter 19 · Adventures' },
  combat: { page: 115, label: 'Chapter 7 · Combat' },
  battle: { page: 137, label: 'Chapter 8 · Mass Combat' },
  economy: { page: 193, label: 'Chapter 12 · Wealth and Treasure' },
  personality: { page: 65, label: 'Chapter 3 · Personality' },
  procedures: { page: 107, label: 'Chapter 6 · General Mechanics' },
  standing: { page: 83, label: 'Chapter 4 · Reputation' },
  glory: { page: 83, label: 'Chapter 4 · Reputation' },
  oracles: { page: 424, label: 'Chapter 19 · Short Form Scenarios' },
  reference: { page: 261, label: 'Chapter 14 · Frankland' },
  rulebook: { page: 14, label: 'Rulebook Index' }
};

export const clampPrintedPage = value => {
  const page = Number(value);
  if (!Number.isFinite(page)) return 14;
  return Math.max(0, Math.min(462, Math.trunc(page)));
};

export const parseSourcePage = (source, fallback = 14) => {
  if (typeof source === 'number') return clampPrintedPage(source);
  const value = String(source || '');
  const printedPage = value.match(/\bp{1,2}\.\s*(\d{1,3})/i);
  if (printedPage) return clampPrintedPage(printedPage[1]);
  const chapter = value.match(/\b(?:ch(?:apter)?\.?)\s*(\d{1,2})/i);
  if (chapter) return RULEBOOK_MANIFEST.chapters.find(item => item.id === `chapter-${Number(chapter[1])}`)?.start || clampPrintedPage(fallback);
  const barePage = value.match(/\b(\d{1,3})\b/);
  return barePage ? clampPrintedPage(barePage[1]) : clampPrintedPage(fallback);
};

export const getChapterForPage = page => {
  const printedPage = clampPrintedPage(page);
  return manifest.chapters.find(chapter => printedPage >= chapter.start && printedPage <= chapter.end)
    || manifest.chapters[printedPage <= 13 ? 0 : manifest.chapters.length - 1];
};

export const getContextForView = view => VIEW_RULEBOOK_CONTEXT[view] || VIEW_RULEBOOK_CONTEXT.rulebook;

export async function loadChapter(chapterId) {
  const loader = chapterModules[`./data/chapters/${chapterId}.json`];
  if (!loader) throw new Error(`Unknown rulebook chapter: ${chapterId}`);
  const module = await loader();
  return module.default;
}

export async function loadRulebookPage(page) {
  const printedPage = clampPrintedPage(page);
  const chapter = getChapterForPage(printedPage);
  const pages = await loadChapter(chapter.id);
  return pages.find(item => item.printedPage === printedPage) || pages[0];
}

export async function loadSearchIndex() {
  searchIndexPromise ||= import('./data/search-index.json').then(module => module.default);
  return searchIndexPromise;
}

export async function loadTableIndex() {
  tableIndexPromise ||= import('./data/table-index.json').then(module => module.default);
  return tableIndexPromise;
}

const normalizeQuery = value => String(value || '').trim().toLocaleLowerCase();

export async function searchRulebook(query, limit = 80) {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];
  const pageOnly = normalized.match(/^(?:p(?:age)?\.?\s*)?(\d{1,3})$/i);
  const index = await loadSearchIndex();
  if (pageOnly) {
    const page = clampPrintedPage(pageOnly[1]);
    return index.filter(item => item.printedPage === page);
  }
  const terms = normalized.split(/\s+/).filter(Boolean);
  return index
    .map(item => {
      const headingText = item.headings.join(' ').toLocaleLowerCase();
      const titleText = item.title.toLocaleLowerCase();
      const tableText = item.tables.join(' ').toLocaleLowerCase();
      const searchable = `${titleText} ${headingText} ${tableText} ${item.searchText}`;
      if (!terms.every(term => searchable.includes(term))) return null;
      const score = terms.reduce((total, term) => total
        + (titleText.includes(term) ? 8 : 0)
        + (headingText.includes(term) ? 5 : 0)
        + (tableText.includes(term) ? 4 : 0)
        + (item.searchText.includes(term) ? 1 : 0), 0);
      return { ...item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.printedPage - b.printedPage)
    .slice(0, limit);
}
