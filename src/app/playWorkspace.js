export const PLAY_VIEWS = ['dashboard', 'character', 'family', 'chronicle', 'adventure', 'combat', 'battle', 'winter', 'economy', 'personality', 'standing', 'glory', 'procedures', 'oracles', 'reference', 'rulebook'];

export const readPlayView = storage => {
  try {
    const view = storage?.getItem('paladin_play_view');
    return PLAY_VIEWS.includes(view) ? view : 'dashboard';
  } catch {
    return 'dashboard';
  }
};

export const rememberPlayView = (storage, view) => {
  try {
    if (PLAY_VIEWS.includes(view)) storage?.setItem('paladin_play_view', view);
  } catch {
    // Navigation still works when browser storage is unavailable.
  }
};

// This is a read-only presentation of pending canonical state, not a rules gate.
export const getPlayActions = character => {
  const campaign = character.campaign || {};
  const lifecycle = campaign.lifecycle || {};
  const winter = campaign.winter || {};
  const health = campaign.health || {};
  const combat = campaign.combat;
  const war = [campaign.massBattle, campaign.skirmish, campaign.siege].find(item => item?.status === 'active');
  const adventure = campaign.adventures?.active;
  const year = character.personal?.campaignYear || 767;
  const actions = [];
  const add = (tab, title, detail, actionLabel, kind = 'pending') => actions.push({ tab, title, detail, actionLabel, kind });

  if (lifecycle.status === 'pending_salvation') add('character', '구원 판정', '끝난 생애의 Salvation 판정이 남아 있습니다.', '구원 판정');
  if (lifecycle.status === 'pending_legacy') add('character', '유산 선택', '다음 기사에게 전할 Legacy를 선택합니다.', '유산 선택');
  if (lifecycle.status === 'pending_successor') add('family', '계승자 선택', '가문의 연대를 이을 후계자를 지정합니다.', '계승자 선택');
  if (actions.length) return actions;

  if (!String(character.personal?.name || '').trim() || lifecycle.status === 'successor_in_creation') {
    add('character', campaign.characterCreationSession ? '기사 생성을 계속하십시오' : '첫 기사를 완성하십시오',
      campaign.characterCreationSession ? '주사위와 선택이 저장된 생성 단계에서 이어갑니다.' : '출신과 가족, 능력과 성향을 정해 이 기사의 생애를 시작합니다.',
      campaign.characterCreationSession ? '생성 재개' : '기사 생성', 'creation');
    return actions;
  }

  if (health.pendingDeath) add('combat', '자정 전 생명 위기', '생명력이 0 이하입니다. 응급처치로 양수까지 회복하거나 사망을 확정해야 합니다.', '생명 위기 처리', 'danger');
  else if (health.majorWoundCourage?.status === 'pending') add('combat', '큰 부상 뒤 용기 판정', '전투를 계속하려면 Valorous 판정이 필요합니다.', '용기 판정', 'danger');
  else if (health.majorWoundCourage?.status === 'blocked') add('combat', '전투 재진입 제한', 'Valorous 실패로 외부 상황에 강제되지 않는 한 다시 교전할 수 없습니다.', '부상 상태 확인', 'danger');
  else if (health.majorWoundCourage?.status === 'must_withdraw') add('combat', '도주 또는 항복', 'Valorous 대실패 결과를 전투 결말에 기록합니다.', '결말 기록', 'danger');

  const madness = (campaign.personalityMagic?.conditions || []).find(item => item.type === 'madness' && item.status === 'active');
  if (madness) add('personality', madness.onset === 'gm_pending' ? 'Madness 발현 시점 결정' : '기사가 광기에 빠졌습니다',
    madness.onset === 'gm_pending' ? 'GM이 광기의 즉시 발현 또는 현재 행동 뒤 발현을 정합니다.' : '캐릭터는 GM에게 맡기며 Winter의 Madness Solo에서 회복을 처리합니다.', '광기 상태 확인', 'danger');
  if (health.surgeryNeeded) add('combat', '외과 치료 필요', '이번 주 외과 치료와 자연 회복을 처리합니다.', '치료하기', 'warning');
  const captive = ['active', 'awaiting_ransom'].includes(campaign.captivity?.status);
  if (captive) {
    add('economy', '포로 상태와 몸값', '자유로운 모험이나 겨울 정산에 앞서 포로·몸값 상태를 확인합니다.', '몸값 장부', 'warning');
    return actions;
  }
  if (['deceased', 'retired', 'historical'].includes(lifecycle.status)) {
    add('character', '끝난 생애와 계승', '생애 기록과 다음 기사의 준비 상태를 확인합니다.', '생애 기록');
    return actions;
  }

  if (combat?.status === 'active') add('combat', `${combat.opponents?.[0]?.name || combat.opponent?.name || '적'}와 교전 중`, `${combat.round || 1}라운드의 저장된 단계에서 이어갑니다.`, '전투 재개', 'combat');
  else if (war) add('battle', war.name || war.fortress || '진행 중인 전쟁', '저장된 교전·대전투·공성 단계에서 이어갑니다.', '전쟁 재개', 'battle');
  else if (campaign.personalityMagic?.activeResolution) add('personality', 'Passion 또는 기도의 후속 행동', '저장된 판정에 이어 행동의 성공·실패와 후유증을 처리합니다.', '후속 행동 처리', 'personality');
  else if (adventure && ['active', 'deferred'].includes(adventure.status)) {
    const pending = adventure.pendingSubsystem;
    const route = pending?.type === 'personality_magic' ? 'personality' : pending?.type === 'economy' ? 'economy' : 'adventure';
    add(route, adventure.title || '진행 중인 모험', route === 'adventure'
      ? `${Number(adventure.stageIndex || 0) + 1}번째 장면의 저장된 선택과 판정에서 이어갑니다.`
      : '모험이 호출한 절차를 처리한 뒤 결과를 모험으로 돌려보냅니다.', route === 'adventure' ? '모험 재개' : '연결 절차 재개', 'adventure');
  }
  if (campaign.honorStatus?.pendingLordJudgment) add('personality', '영주의 명예 심판', `Honor ${campaign.honorStatus.honor}. 원문에 따른 영주의 판단을 기록합니다.`, '심판 기록', 'warning');

  const journey = [...(campaign.rulebookProcedures?.journeys || [])].reverse().find(item => item.status !== 'complete' || item.pendingDecision);
  if (journey) add('procedures', `${journey.destination} 여행`, `남은 거리 ${journey.remainingDistance} miles. 저장된 여행의 다음 날을 처리합니다.`, '여행 재개', 'travel');

  const complete = Object.values(winter.steps || {}).filter(value => ['resolved', 'skipped'].includes(value)).length;
  const unresolved = Object.values(winter.unresolved || {}).filter(Boolean).length;
  if (complete === 10 && winter.currentStep === 'complete') add('winter', `${year}년 겨울 장부 마감`, '10단계를 마쳤습니다. 장부를 봉인해 다음 연도로 진행합니다.', '연도 마감', 'winter');
  else if (complete > 0 || unresolved) add('winter', `${year}년 겨울 정산`, `${complete}/10단계 처리${unresolved ? ` · 미결 ${unresolved}건` : ''}. 저장된 단계에서 이어갑니다.`, '정산 재개', 'winter');
  else {
    const completedAdventure = (campaign.adventures?.history || []).some(item => item.status === 'complete' && Number(item.campaignYear) === Number(year));
    if (!adventure && !war && combat?.status !== 'active' && !completedAdventure) add('adventure', `${year}년 모험을 선택하십시오`, 'GM이 정한 올해의 사건을 진행하고 결과를 기록합니다.', '모험 선택', 'adventure');
    add('winter', `${year}년 겨울 정산`, '올해의 시나리오를 마쳤다면 원문 순서의 10단계로 한 해를 닫습니다.', '겨울 정산', 'winter');
  }
  return actions;
};
