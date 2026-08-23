export const CHRONICLE_TYPE_LABELS = Object.freeze({
  active: '활동 복귀',
  adventure: '개인 모험',
  adventure_complete: '모험 완료',
  adventure_start: '모험 시작',
  battle: '대전투',
  bedridden: '병상',
  birth: '탄생',
  canonization: '시성',
  captivity: '포로',
  character: '기사',
  combat: '전투',
  creature_encounter: '조우',
  death: '죽음',
  dishonor: '불명예',
  family: '가문',
  glory: '영광',
  incapacitated: '행동 불능',
  injury: '부상',
  knighting: '기사 서임',
  legacy: '유산',
  madness: '광기',
  marriage: '혼인',
  miracle: '기적',
  ransom: '몸값',
  recovery: '회복',
  retirement: '은퇴',
  siege: '공성',
  succession: '계승',
  treasure: '보물',
  winter: '겨울'
});

export const getChronicleTypeLabel = type => CHRONICLE_TYPE_LABELS[String(type || '').toLowerCase()] || '기타 사건';

const LIFECYCLE_LABELS = Object.freeze({
  active: '활동 복귀',
  bedridden: '병상',
  deceased: '사망',
  incapacitated: '행동 불능',
  retired: '은퇴',
  target_death: '가문원 사망',
  wound: '부상'
});

export const getLifecycleLabel = value => LIFECYCLE_LABELS[String(value || '').toLowerCase()] || '생애 변화';

const STANDING_LABELS = Object.freeze({
  charlemagne: '샤를마뉴',
  church: '교회',
  commoners: '평민',
  family: '가문',
  liegeLord: '주군',
  retinue: '수행단'
});

const formatStandingItem = item => {
  if (item === null || item === undefined) return '';
  if (typeof item !== 'object') return String(item);
  const label = STANDING_LABELS[item.key] || '지위';
  if (item.check) return `${label} 체크`;
  if (item.before !== undefined && item.after !== undefined) return `${label} ${item.before}→${item.after}`;
  if (item.amount !== undefined) return `${label} ${Number(item.amount) >= 0 ? '+' : ''}${item.amount}`;
  return `${label} 변동`;
};

export const formatStandingChange = value => {
  const items = Array.isArray(value) ? value : [value];
  const formatted = items.map(formatStandingItem).filter(Boolean);
  return formatted.length ? formatted.join(' · ') : '변동 기록';
};
