import { useState } from "react";
import { LABELS } from "../config";

interface Props {
  fieldKey: string;
  value: string;
  onCopy: (text: string) => void;
}

export function ResultField({ fieldKey, value, onCopy }: Props) {
  const [copied, setCopied] = useState(false);
  const label = LABELS[fieldKey] || fieldKey;
  const display = String(value ?? "");
  const isTruncated = display.length > 20;

  function handleCopy() {
    const text = `${label}: ${display}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        onCopy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 600);
      })
      .catch(() => {});
  }

  return (
    <div
      className={`field ${copied ? "copied" : ""}`}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCopy();
      }}
    >
      <span className="field-label">{label}</span>
      <span className={`field-value ${isTruncated ? "truncated" : ""}`}>
        {display}
      </span>
    </div>
  );
}
