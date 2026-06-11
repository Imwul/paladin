import React from 'react';
import { Award, BookOpen, Crown, Feather, Heart, ScrollText, Shield, Star, Users } from 'lucide-react';
import { chronologyData } from '../data/chronology';

const TRAIT_LABELS = {
  chaste: '정숙', lustful: '음탕',
  energetic: '열정', lazy: '나태',
  forgiving: '관용', vengeful: '복수',
  generous: '관대', selfish: '이기',
  honest: '정직', deceitful: '기만',
  just: '정의', arbitrary: '독단',
  merciful: '자비', cruel: '잔혹',
  modest: '겸손', proud: '오만',
  pious: '경건', worldly: '세속',
  prudent: '신중', reckless: '무모',
  temperate: '절제', indulgent: '방종',
  trusting: '신뢰', suspicious: '의심',
  valorous: '용맹', cowardly: '겁쟁이'
};

const PASSION_LABELS = {
  loyaltyLiege: '주군 충성',
  loveFamily: '가족 사랑',
  hospitality: '환대',
  honor: '명예',
  hateSaracens: '사라센 증오',
  loveGod: '신 사랑',
  amor: '연인 사랑'
};

const STANDING_LABELS = {
  charlemagne: '샤를마뉴',
  liegeLord: '주군',
  family: '가문',
  retinue: '가신단',
  church: '교회',
  commoners: '평민'
};

const getBirthYear = (lifeYears = '') => {
  const match = String(lifeYears).match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const getDeathYear = (lifeYears = '') => {
  const match = String(lifeYears).match(/~\s*(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

const getPlainName = (name = '') => name.replace(/\s*\([^)]*\)/g, '').trim();

const getTopEntries = (source = {}, labels = {}, limit = 3) => (
  Object.entries(source)
    .filter(([, value]) => Number.isFinite(Number(value)))
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: labels[key] || key, value }))
);

const isDescendantOf = (member, ancestorId, members) => {
  let cursor = member;
  const seen = new Set();
  while (cursor?.parentId && !seen.has(cursor.id)) {
    if (cursor.parentId === ancestorId) return true;
    seen.add(cursor.id);
    cursor = members.find(m => m.id === cursor.parentId);
  }
  return false;
};

const getYearTitle = (year) => {
  const record = chronologyData.find(item => item.year === Number(year));
  return record?.title || '가문의 해';
};

const classifyEntry = (text = '') => {
  const patterns = [
    { type: '혈통', words: ['출산', '아이', '쌍둥이', '자녀', '아들', '딸'] },
    { type: '혼인', words: ['결혼', '혼례', '배우자', '지참금'] },
    { type: '죽음', words: ['사망', '서거', '전사', '난산', '영면'] },
    { type: '영광', words: ['Glory', '영예', '명예', '영광'] },
    { type: '성장', words: ['성장', '훈련', '단련', '경험', '열망', '성향'] },
    { type: '가문', words: ['가문사건', '가문 정산', '친족', '가문'] }
  ];
  return patterns.find(pattern => pattern.words.some(word => text.includes(word)))?.type || '기록';
};

const getExcerpt = (text = '') => {
  const lines = text
    .split('\n')
    .map(line => line.replace(/^•\s*/, '').trim())
    .filter(Boolean);

  const important = lines.find(line =>
    /출산|결혼|사망|서거|전사|Glory|영예|가문사건|성장|단련|영면/.test(line)
  );

  const selected = important || lines[0] || '';
  return selected.length > 170 ? `${selected.slice(0, 167)}...` : selected;
};

const buildLifeEvents = (members) => {
  const events = [];
  members.forEach(member => {
    const birthYear = getBirthYear(member.lifeYears);
    const deathYear = getDeathYear(member.lifeYears);
    if (birthYear) {
      events.push({
        year: birthYear,
        type: '탄생',
        title: `${getPlainName(member.name)} 탄생`,
        detail: `${member.relation || '가문원'}로 기록됨${member.note ? ` - ${member.note}` : ''}`
      });
    }
    if (deathYear) {
      events.push({
        year: deathYear,
        type: '죽음',
        title: `${getPlainName(member.name)} ${member.status === '실종' ? '실종' : '서거'}`,
        detail: member.deathCause || member.note || '가문 기록에 죽음의 해가 남아 있음'
      });
    }
  });
  return events.sort((a, b) => a.year - b.year);
};

const buildAnnals = (journal = {}) => (
  Object.entries(journal)
    .map(([year, entry]) => ({
      year: Number(year),
      title: getYearTitle(year),
      type: classifyEntry(entry?.text || ''),
      excerpt: getExcerpt(entry?.text || ''),
      text: entry?.text || ''
    }))
    .filter(entry => entry.year && entry.text)
    .sort((a, b) => a.year - b.year)
);

export default function HouseChronicle({ character }) {
  const members = character.family?.members || [];
  const self = members.find(member => member.relation === '본인');
  const selfGen = self?.generation ?? 3;
  const selfId = self?.id;
  const annals = buildAnnals(character.journal || {});
  const lifeEvents = buildLifeEvents(members);

  const patronSaint =
    character?.family?.patronSaint ||
    character?.patronSaint ||
    character?.familySaint ||
    "기록 없음";

  const patronSaintRoll =
    character?.family?.patronSaintRoll ??
    character?.patronSaintRoll ??
    null;
  const deceased = members.filter(member => member.status === '사망' || getDeathYear(member.lifeYears));
  const living = members.filter(member => member.status !== '사망' && !getDeathYear(member.lifeYears));
  const descendants = selfId
    ? members.filter(member => member.id !== selfId && (member.generation > selfGen || isDescendantOf(member, selfId, members)))
    : members.filter(member => member.generation > selfGen);
  const heirs = descendants.filter(member => member.status !== '사망').slice(0, 6);
  const topTraits = getTopEntries(character.traits, TRAIT_LABELS);
  const topPassions = getTopEntries(character.passions, PASSION_LABELS);
  const topStandings = getTopEntries(character.standings, STANDING_LABELS);
  const rememberedAncestors = deceased
    .slice()
    .sort((a, b) => (getDeathYear(b.lifeYears) || 0) - (getDeathYear(a.lifeYears) || 0))
    .slice(0, 5);

  const firstYear = annals[0]?.year || character.personal?.campaignYear || 768;
  const lastYear = annals[annals.length - 1]?.year || character.personal?.campaignYear || firstYear;

  return (
    <div className="house-chronicle view-animate">
      <section className="hc-hero">
        <div>
          <span className="hc-kicker">Domus {character.family?.name || character.personal?.lineage || 'Paladin'}</span>
          <h2>{character.family?.name || character.personal?.lineage || '무명의'} 가문 대연대기</h2>
          <p>
            {firstYear}년부터 {lastYear}년까지 남겨진 일지, 가계도, 영예, 혈통 기록을 한 권의 가문사처럼 엮었습니다.
            <br />
            ⛪ 수호 성인: <strong>{patronSaint}</strong>{patronSaintRoll !== null ? ` (🎲 d20: ${patronSaintRoll})` : ''}
          </p>
        </div>
        <div className="hc-seal">
          <Crown size={30} />
          <strong>{character.family?.motto || '명예와 신조'}</strong>
          <span>{character.family?.battleCry || '가문의 함성'}</span>
        </div>
      </section>

      <section className="hc-stats">
        <div>
          <Shield size={18} />
          <span>현 세대</span>
          <strong>{self ? getPlainName(self.name) : character.personal?.name}</strong>
        </div>
        <div>
          <Award size={18} />
          <span>누적 영예</span>
          <strong>{(character.gear?.gloryTotal || 0).toLocaleString()} Glory</strong>
        </div>
        <div>
          <Users size={18} />
          <span>기록된 혈족</span>
          <strong>{members.length}명</strong>
        </div>
        <div>
          <BookOpen size={18} />
          <span>남은 연도 기록</span>
          <strong>{annals.length}편</strong>
        </div>
      </section>

      <div className="hc-grid">
        <section className="cs-section">
          <div className="sheet-ribbon"><h3><ScrollText size={16} /> 해마다 적힌 가문 연보</h3></div>
          <div className="cs-section-inner hc-annals">
            {annals.length > 0 ? annals.map(entry => (
              <article key={entry.year} className="hc-annal">
                <div className="hc-year">{entry.year}</div>
                <div>
                  <div className="hc-annal-head">
                    <strong>{entry.title}</strong>
                    <span>{entry.type}</span>
                  </div>
                  <p>{entry.excerpt}</p>
                </div>
              </article>
            )) : (
              <p className="hc-empty">아직 보존된 연도별 일지가 없습니다.</p>
            )}
          </div>
        </section>

        <aside className="hc-side">
          <section className="cs-section">
            <div className="sheet-ribbon"><h3><Star size={16} /> 기억되는 선조</h3></div>
            <div className="cs-section-inner hc-list">
              {rememberedAncestors.length > 0 ? rememberedAncestors.map(member => (
                <div key={member.id} className="hc-person">
                  <strong>{getPlainName(member.name)}</strong>
                  <span>{member.lifeYears || '생몰년 미상'} · {member.relation || '가문원'}</span>
                  <p>{member.deathCause || member.note || '가문 기록에 이름이 남아 있음'}</p>
                </div>
              )) : (
                <p className="hc-empty">아직 서거한 선조 기록이 없습니다.</p>
              )}
            </div>
          </section>

          <section className="cs-section">
            <div className="sheet-ribbon"><h3><Heart size={16} /> 눈에 띄는 후손</h3></div>
            <div className="cs-section-inner hc-list">
              {heirs.length > 0 ? heirs.map(member => (
                <div key={member.id} className="hc-person">
                  <strong>{getPlainName(member.name)}</strong>
                  <span>{member.lifeYears || '연도 미상'} · {member.relation || '후손'}</span>
                  <p>{member.note || '다음 세대의 기록을 기다리는 혈족'}</p>
                </div>
              )) : (
                <p className="hc-empty">아직 기록된 후손이 없습니다.</p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <section className="cs-section">
        <div className="sheet-ribbon"><h3><Feather size={16} /> 혈통의 큰 사건</h3></div>
        <div className="cs-section-inner hc-life-strip">
          {lifeEvents.slice(-10).map(event => (
            <div key={`${event.year}-${event.title}`} className={`hc-life-event ${event.type === '죽음' ? 'is-death' : ''}`}>
              <span>{event.year}</span>
              <strong>{event.title}</strong>
              <p>{event.detail}</p>
            </div>
          ))}
          {lifeEvents.length === 0 && <p className="hc-empty">가계도에 생몰년이 기록되면 이곳에 혈통 사건이 나타납니다.</p>}
        </div>
      </section>

      <section className="cs-section">
        <div className="sheet-ribbon"><h3><Shield size={16} /> 지금 가문을 규정하는 성품</h3></div>
        <div className="cs-section-inner hc-virtues">
          <div>
            <span>두드러진 성향</span>
            {topTraits.map(item => <strong key={item.key}>{item.label} {item.value}</strong>)}
          </div>
          <div>
            <span>마음을 움직이는 열망</span>
            {topPassions.map(item => <strong key={item.key}>{item.label} {item.value}</strong>)}
          </div>
          <div>
            <span>세상이 기억하는 명망</span>
            {topStandings.map(item => <strong key={item.key}>{item.label} {item.value}</strong>)}
          </div>
        </div>
      </section>
    </div>
  );
}
