import { X } from "lucide-react";

interface Props {
  value: string;
  loading: boolean;
  onChange: (val: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function QueryInput({
  value,
  loading,
  onChange,
  onClear,
  onSubmit,
}: Props) {
  return (
    <div className="input-wrap">
      <input
        type="text"
        className="input"
        placeholder="请输入条形码或串码"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) onSubmit();
        }}
      />
      {value && (
        <button className="clear-btn" onClick={onClear} title="清空">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
