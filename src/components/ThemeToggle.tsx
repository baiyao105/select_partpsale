import { Moon, Sun, Monitor } from 'lucide-react';
import type { ThemeMode } from '../types';

const LABELS: Record<ThemeMode, string> = { auto: '跟随浏览器', light: '亮色模式', dark: '暗色模式' };

interface Props {
  theme: ThemeMode;
  effective: 'light' | 'dark';
  onCycle: () => void;
}

export function ThemeToggle({ theme, effective, onCycle }: Props) {
  const icon = theme === 'auto' ? <Monitor size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />;

  return (
    <button className="theme-btn" onClick={onCycle} aria-label={`主题: ${LABELS[theme]}`}>
      {icon}
      <span className={`theme-tooltip ${effective === 'dark' ? 'dark-tip' : 'light-tip'}`}>
        {LABELS[theme]}
      </span>
    </button>
  );
}
