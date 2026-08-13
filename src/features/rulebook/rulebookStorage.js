export const RULEBOOK_LIBRARY_KEY = 'paladin.rulebook.v1.1.personal';

export const EMPTY_RULEBOOK_LIBRARY = {
  version: 1,
  bookmarks: [],
  recents: [],
  notes: {},
  houseRules: {}
};

const normalizeEntry = entry => ({
  page: Number(entry?.page) || 0,
  title: String(entry?.title || ''),
  updatedAt: String(entry?.updatedAt || new Date().toISOString())
});

export function readRulebookLibrary() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RULEBOOK_LIBRARY_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return EMPTY_RULEBOOK_LIBRARY;
    return {
      version: 1,
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks.map(normalizeEntry).slice(0, 120) : [],
      recents: Array.isArray(parsed.recents) ? parsed.recents.map(normalizeEntry).slice(0, 24) : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      houseRules: parsed.houseRules && typeof parsed.houseRules === 'object' ? parsed.houseRules : {}
    };
  } catch {
    return EMPTY_RULEBOOK_LIBRARY;
  }
}

export function writeRulebookLibrary(library) {
  localStorage.setItem(RULEBOOK_LIBRARY_KEY, JSON.stringify(library));
}

export function addRecent(library, entry) {
  const normalized = normalizeEntry(entry);
  return {
    ...library,
    recents: [normalized, ...library.recents.filter(item => item.page !== normalized.page)].slice(0, 24)
  };
}

export function toggleBookmark(library, entry) {
  const normalized = normalizeEntry(entry);
  const exists = library.bookmarks.some(item => item.page === normalized.page);
  return {
    ...library,
    bookmarks: exists
      ? library.bookmarks.filter(item => item.page !== normalized.page)
      : [normalized, ...library.bookmarks].sort((a, b) => a.page - b.page)
  };
}

export function updatePageNote(library, page, value, kind = 'notes') {
  const collection = { ...library[kind] };
  const key = String(page);
  const trimmed = String(value || '');
  if (trimmed) collection[key] = trimmed;
  else delete collection[key];
  return { ...library, [kind]: collection };
}
