import { AlertTriangle, BookOpen, Check, LoaderCircle } from 'lucide-react';

export function FolioHeading({ eyebrow, title, year, children }) {
  return (
    <header className="folio-heading">
      <div>
        <span className="serial-label">{eyebrow}</span>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {year !== undefined && <strong className="folio-heading__year" aria-label={`${year}년`}>{year}</strong>}
    </header>
  );
}

export function SectionHeader({ index, title, meta, action }) {
  return (
    <div className="register-heading">
      <span>{index}</span>
      <h2>{title}</h2>
      {meta && <small>{meta}</small>}
      {action && <div className="register-heading__action">{action}</div>}
    </div>
  );
}

export function LedgerRow({ label, value, meta, accent = false, children }) {
  return (
    <div className={`ledger-row ${accent ? 'ledger-row--accent' : ''}`}>
      <div><span>{label}</span>{meta && <small>{meta}</small>}</div>
      {value !== undefined && <strong>{value}</strong>}
      {children}
    </div>
  );
}

export function StatusSeal({ tone = 'neutral', children }) {
  return <span className={`status-seal status-seal--${tone}`}>{children}</span>;
}

export function PendingAction({ title, children, onClick, actionLabel = '열기' }) {
  return (
    <div className="pending-action">
      <AlertTriangle size={18} aria-hidden="true" />
      <div><strong>{title}</strong><p>{children}</p></div>
      {onClick && <button type="button" className="text-command" onClick={onClick}>{actionLabel}</button>}
    </div>
  );
}

export function LoadingState({ label = '기록을 펼치는 중' }) {
  return (
    <div className="ledger-state" role="status" aria-live="polite">
      <LoaderCircle className="spin" size={22} aria-hidden="true" />
      <strong>{label}</strong>
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="ledger-state">
      <BookOpen size={22} aria-hidden="true" />
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

export function CompleteMark({ children = '완료' }) {
  return <span className="complete-mark"><Check size={13} aria-hidden="true" />{children}</span>;
}
