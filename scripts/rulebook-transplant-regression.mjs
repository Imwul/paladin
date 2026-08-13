import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'src/features/rulebook/data');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const manifest = readJson(path.join(dataRoot, 'manifest.json'));
const searchIndex = readJson(path.join(dataRoot, 'search-index.json'));
const tableIndex = readJson(path.join(dataRoot, 'table-index.json'));
const chapterPages = manifest.chapters.flatMap(chapter => readJson(path.join(dataRoot, 'chapters', `${chapter.id}.json`)));

assert.equal(manifest.version, '1.1-personal');
assert.equal(manifest.pdfPageCount, 463);
assert.equal(manifest.coverage.sourcePages, 463);
assert.equal(manifest.chapters.length, 22);
assert.equal(manifest.ambiguities.length, 9);
assert.equal(manifest.coverage.tables, 163);

assert.equal(chapterPages.length, 463);
assert.equal(new Set(chapterPages.map(page => page.pdfPage)).size, 463);
assert.equal(new Set(chapterPages.map(page => page.printedPage)).size, 463);
assert.equal(Math.min(...chapterPages.map(page => page.pdfPage)), 1);
assert.equal(Math.max(...chapterPages.map(page => page.pdfPage)), 463);
assert.equal(Math.min(...chapterPages.map(page => page.printedPage)), 0);
assert.equal(Math.max(...chapterPages.map(page => page.printedPage)), 462);
assert(chapterPages.every(page => page.classifications.includes('SOURCE')));
assert(chapterPages.every(page => typeof page.fullText === 'string'));
assert(chapterPages.every(page => Array.isArray(page.segments)));
assert(manifest.coverage.rules >= 200);
assert(manifest.coverage.procedures >= 150);
assert(manifest.coverage.examples >= 100);
assert(manifest.coverage.gmGuidance >= 150);
assert(manifest.coverage.crossLinks >= 180);

assert.equal(searchIndex.length, 463);
assert(searchIndex.every(page => typeof page.searchText === 'string'));
assert(searchIndex.filter(page => page.searchText.length > 0).length >= 430);

assert.equal(tableIndex.length, 163);
assert.equal(new Set(tableIndex.map(table => table.id)).size, 163);
assert.equal(tableIndex.filter(table => table.kind === 'numbered').length, 107);
assert.equal(tableIndex.filter(table => table.kind === 'source-index').length, 56);
assert(tableIndex.every(table => chapterPages.some(page => page.printedPage === table.printedPage)));
for (const tableId of ['1-1', '2-3', '3-4', '7-5', '8-16', '10-13', '12-1', '17-1', '18-1', '19-36']) {
  assert(tableIndex.some(table => table.id === tableId), `Missing source table ${tableId}`);
}

const ambiguityPages = manifest.ambiguities.map(item => item.page);
assert.deepEqual(ambiguityPages, [30, 42, 80, 311, 368, 386, 413, 425, 432]);
assert(manifest.ambiguities.every(item => chapterPages.some(page => page.printedPage === item.page && page.ambiguity?.id === item.id)));

const expectedRanges = [
  ['chapter-1', 25, 44], ['chapter-7', 115, 136], ['chapter-8', 137, 162],
  ['chapter-10', 173, 182], ['chapter-12', 193, 212], ['chapter-14', 261, 284],
  ['chapter-15', 285, 320], ['chapter-17', 341, 372], ['chapter-18', 373, 390],
  ['chapter-19', 391, 438]
];
for (const [id, start, end] of expectedRanges) {
  const chapter = manifest.chapters.find(item => item.id === id);
  assert.deepEqual([chapter.start, chapter.end], [start, end]);
}

const appSource = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
const storageSource = fs.readFileSync(path.join(root, 'src/features/rulebook/rulebookStorage.js'), 'utf8');
assert.match(appSource, /schemaVersion:\s*12/);
assert.match(storageSource, /paladin\.rulebook\.v1\.1\.personal/);
assert.doesNotMatch(storageSource, /paladin_companion_data/);
assert(fs.statSync(path.join(root, 'paladin_core_rulebook.pdf')).size > 40_000_000);

console.log('Personal Rulebook transplant regression: PASS');
console.log(JSON.stringify({
  sourcePages: chapterPages.length,
  chapterGroups: manifest.chapters.length,
  tables: tableIndex.length,
  numberedTables: tableIndex.filter(table => table.kind === 'numbered').length,
  sourceIndexTables: tableIndex.filter(table => table.kind === 'source-index').length,
  ruleBlocks: manifest.coverage.rules,
  procedureBlocks: manifest.coverage.procedures,
  examples: manifest.coverage.examples,
  gmGuidanceBlocks: manifest.coverage.gmGuidance,
  crossLinks: manifest.coverage.crossLinks,
  ambiguityClusters: manifest.ambiguities.length,
  campaignSchema: 12
}, null, 2));
