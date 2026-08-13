import { BookOpenText } from 'lucide-react';
import { useRulebook } from './RulebookContext';

export default function RulebookButton({ page, sourcePage, query, reason, label = '원문 보기', className = 'rulebook-context-button' }) {
  const { openRulebook } = useRulebook();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openRulebook({ page, sourcePage, query, reason })}
      title={reason ? `${reason} 원문 열기` : '현재 규칙의 원문 열기'}
    >
      <BookOpenText size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
