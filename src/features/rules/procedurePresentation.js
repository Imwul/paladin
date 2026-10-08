import { resolveOpposedD20 } from '../../rules/coreRules.js';

export const PROCEDURE_TASKS = [
  { id: 'skills', label: '기술 · 위업', page: 95 },
  { id: 'travel', label: '여행', page: 111 },
  { id: 'career', label: '경력과 Ideal', page: 183 },
  { id: 'reputation', label: 'Glory와 Standing', page: 83 },
  { id: 'settlement', label: '기사도 정산', page: 228 },
  { id: 'chronology', label: '올해 규칙', page: 285 }
];

export const OUTCOME_LABELS = { critical: '대성공', success: '성공', failure: '실패', fumble: '대실패' };
const CONSEQUENCES = {
  move_double: '기본 Movement Rate의 두 배 속도로 수영합니다.',
  move_normal: '물 위에 머물며 기본 Movement Rate만큼 이동합니다.',
  no_progress: '이번 라운드에는 의미 있는 전진을 하지 못합니다.',
  drowning_pending: '익수가 시작됩니다. 질식 절차를 전투와 회복에서 처리합니다. (p.134)',
  prey_and_return: '새가 먹잇감을 잡아 우아하게 돌아옵니다.',
  prey: '새가 먹잇감을 잡았습니다.',
  bird_lost_or_dead: '새가 사라졌거나 치명적으로 다쳤습니다. 원문의 두 가능성 중 구체적인 사건은 GM이 정합니다.',
  miss: '새가 먹잇감을 놓쳤습니다.',
  read_or_write: '독해 또는 집필을 할 수 있습니다.',
  read_quickly: '짧은 시간 안에 문서를 읽고 이해합니다.',
  misinterpreted: '글을 오독했습니다. 잘못 이해한 내용은 GM이 정합니다.',
  not_understood: '글을 이해하지 못했습니다.',
  check_only: '판정 등급이 확정되었습니다. 장면의 구체적인 의미와 별도 보상은 GM이 정합니다.'
};

export const getProcedureConsequence = result => {
  if (result?.skillId === 'gaming' && result.check && result.secondaryCheck) {
    const opposed = resolveOpposedD20(result.check, result.secondaryCheck);
    const labels = { actor: '기사 승리', opponent: '상대 승리', tie: '무승부', bothFail: '양측 실패' };
    return `${labels[opposed.winner]}. 판돈이 있다면 금액은 GM이 정하며 자동 정산하지 않습니다.`;
  }
  return CONSEQUENCES[result?.consequence] || CONSEQUENCES.check_only;
};

export const readProcedureTask = (storage, hasJourney = false) => {
  if (hasJourney) return 'travel';
  try {
    const task = storage?.getItem('paladin_procedure_task');
    return PROCEDURE_TASKS.some(item => item.id === task) ? task : 'skills';
  } catch { return 'skills'; }
};
