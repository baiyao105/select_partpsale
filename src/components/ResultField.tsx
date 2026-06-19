import { LABELS } from '../config';

interface Props {
  fieldKey: string;
  value: string;
  onCopy: (text: string) => void;
}

export function ResultField({ fieldKey, value, onCopy }: Props) {
  const label = LABELS[fieldKey] || fieldKey;
  const display = String(value ?? '');

  function handleCopy() {
    const text = `${label}: ${display}`;
    navigator.clipboard.writeText(text).then(() => onCopy(text)).catch(() => {});
  }

  return (
    <div className="field" onClick={handleCopy} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleCopy(); }}>
      <span className="field-label">{label}</span>
      <span className="field-value">{display}</span>
    </div>
  );
}
