import { Moon, Sun, Monitor, X } from "lucide-react";
import type { ThemeMode } from "../types";
import type { Settings } from "../hooks/useSettings";

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "light", label: "亮色模式", icon: <Sun size={16} /> },
  { value: "dark", label: "暗色模式", icon: <Moon size={16} /> },
  { value: "auto", label: "跟随浏览器", icon: <Monitor size={16} /> },
];

interface Props {
  open: boolean;
  theme: ThemeMode;
  settings: Settings;
  onClose: () => void;
  onThemeChange: (t: ThemeMode) => void;
  onSettingsChange: (s: Partial<Settings>) => void;
}

export function SettingsDialog({
  open,
  theme,
  settings,
  onClose,
  onThemeChange,
  onSettingsChange,
}: Props) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <span className="dialog-title">设置</span>
          <button className="dialog-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">
          <div className="settings-section">
            <div className="settings-label">主题模式</div>
            <div className="theme-options">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`theme-option ${theme === opt.value ? "active" : ""}`}
                  onClick={() => onThemeChange(opt.value)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-label">复制设置</div>
            <label className="settings-check">
              <input
                type="checkbox"
                checked={settings.copyWithLabel}
                onChange={(e) =>
                  onSettingsChange({ copyWithLabel: e.target.checked })
                }
              />
              <span>复制时包含字段名</span>
            </label>
            <div className="settings-hint">
              开启后复制 "IMEI: 123456"，关闭后只复制 "123456"
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <a
            className="github-link-bottom"
            href="https://github.com/baiyao105/select_partpsale"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub 仓库</span>
          </a>
        </div>
      </div>
    </div>
  );
}
