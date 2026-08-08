const clone = value => JSON.parse(JSON.stringify(value));

const ensureCampaign = character => {
  character.campaign = character.campaign || {};
  character.campaign.gloryLedger = Array.isArray(character.campaign.gloryLedger) ? character.campaign.gloryLedger : [];
  character.campaign.standingLedger = Array.isArray(character.campaign.standingLedger) ? character.campaign.standingLedger : [];
  character.campaign.familyTimeline = Array.isArray(character.campaign.familyTimeline) ? character.campaign.familyTimeline : [];
  character.campaign.chronicleEvents = Array.isArray(character.campaign.chronicleEvents) ? character.campaign.chronicleEvents : [];
};

const appendUnique = (entries, entry, limit) => {
  if (entries.some(item => item.id === entry.id)) return entries;
  return [...entries, entry].slice(-limit);
};

const baseEntry = (character, entry) => ({
  id: String(entry.id),
  year: Number(entry.year ?? character.personal?.campaignYear ?? 767),
  characterId: entry.characterId ?? character.campaign?.lifecycle?.activeCharacterId ?? null,
  characterName: entry.characterName ?? character.personal?.name ?? '',
  title: String(entry.title || entry.cause || '기록'),
  narrative: String(entry.narrative || entry.event || ''),
  sourceRuleId: String(entry.sourceRuleId || ''),
  sourcePage: String(entry.sourcePage || ''),
  createdAt: entry.createdAt || new Date().toISOString()
});

export const appendChronicleEvent = (character, entry) => {
  ensureCampaign(character);
  const normalized = { ...baseEntry(character, entry), ...clone(entry) };
  character.campaign.chronicleEvents = appendUnique(character.campaign.chronicleEvents, normalized, 500);
  return normalized;
};

export const appendFamilyTimeline = (character, entry) => {
  ensureCampaign(character);
  const normalized = {
    ...baseEntry(character, entry),
    ...clone(entry),
    type: String(entry.type || 'family'),
    memberId: entry.memberId || null,
    relatedMemberId: entry.relatedMemberId || null
  };
  character.campaign.familyTimeline = appendUnique(character.campaign.familyTimeline, normalized, 500);
  return normalized;
};

export const recordGloryAward = (character, entry, { applyToAnnual = true } = {}) => {
  ensureCampaign(character);
  const normalized = {
    ...baseEntry(character, entry),
    ...clone(entry),
    amount: Number(entry.amount || 0),
    status: entry.status || (applyToAnnual ? 'pending' : 'posted')
  };
  if (character.campaign.gloryLedger.some(item => item.id === normalized.id)) return normalized;
  if (applyToAnnual && normalized.amount) {
    character.gear = character.gear || {};
    character.gear.gloryThisGame = Number(character.gear.gloryThisGame || 0) + normalized.amount;
  }
  character.campaign.gloryLedger = appendUnique(character.campaign.gloryLedger, normalized, 1000);
  return normalized;
};

export const recordStandingChange = (character, entry) => {
  ensureCampaign(character);
  const normalizedBase = baseEntry(character, entry);
  if (character.campaign.standingLedger.some(item => item.id === normalizedBase.id)) {
    return character.campaign.standingLedger.find(item => item.id === normalizedBase.id);
  }
  const key = String(entry.standingKey || '');
  const amount = Number(entry.amount || 0);
  character.standings = character.standings || {};
  const before = Number(character.standings[key] || 0);
  const after = Math.max(0, before + amount);
  character.standings[key] = after;
  const normalized = {
    ...normalizedBase,
    ...clone(entry),
    standingKey: key,
    amount,
    before,
    after
  };
  character.campaign.standingLedger = appendUnique(character.campaign.standingLedger, normalized, 1000);
  return normalized;
};

export const postAnnualGlory = (character, { year, entries, total, previousTotal, newTotal, sourceRuleId, sourcePage }) => {
  ensureCampaign(character);
  const pending = character.campaign.gloryLedger.filter(entry => entry.year === year && entry.status === 'pending');
  const pendingTotal = pending.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const playAmount = entries.find(entry => entry.source === 'play')?.amount || 0;
  if (playAmount > pendingTotal) {
    recordGloryAward(character, {
      id: `glory:${year}:unitemized-play`,
      year,
      title: '모험 및 플레이 영광',
      narrative: '이전 화면 또는 불러온 기록에서 합산된 상세 미분류 영광입니다.',
      amount: playAmount - pendingTotal,
      sourceRuleId,
      sourcePage,
      status: 'posted'
    }, { applyToAnnual: false });
  }
  character.campaign.gloryLedger = character.campaign.gloryLedger.map(entry => (
    entry.year === year && entry.status === 'pending' ? { ...entry, status: 'posted', postedAtYear: year } : entry
  ));
  entries.filter(entry => entry.source !== 'play').forEach((entry, index) => {
    recordGloryAward(character, {
      id: `glory:${year}:annual:${entry.source}:${index}`,
      year,
      title: entry.label,
      narrative: '겨울 정산에서 확정된 연간 영광입니다.',
      amount: entry.amount,
      sourceRuleId,
      sourcePage,
      status: 'posted'
    }, { applyToAnnual: false });
  });
  const posting = {
    id: `glory:${year}:posting`,
    year,
    title: '연간 영광 확정',
    narrative: `${total}점을 누적 영광에 반영했습니다.`,
    amount: 0,
    totalPosted: total,
    previousTotal,
    newTotal,
    status: 'posting',
    sourceRuleId,
    sourcePage
  };
  character.campaign.gloryLedger = appendUnique(character.campaign.gloryLedger, posting, 1000);
  return posting;
};
