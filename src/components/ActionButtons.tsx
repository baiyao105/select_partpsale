import { Search, ScanLine, Smartphone } from 'lucide-react';

interface Props {
  loading: boolean;
  onQuery: () => void;
  onScan: () => void;
  onADB: () => void;
}

export function ActionButtons({ loading, onQuery, onScan, onADB }: Props) {
  return (
    <div className="actions">
      <button className="btn btn-primary" onClick={onQuery} disabled={loading}>
        <Search size={18} />查询
      </button>
      <div className="btn-row">
        <button className="btn btn-outline" onClick={onScan} disabled={loading}>
          <ScanLine size={18} />扫码查询
        </button>
        <button className="btn btn-outline" onClick={onADB} disabled={loading}>
          <Smartphone size={18} />ADB读取
        </button>
      </div>
    </div>
  );
}
