import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid3x3 } from 'lucide-react';
import { queryAPI, extractBindNumber } from './api';
import { useTheme } from './hooks/useTheme';
import { useADB } from './hooks/useADB';
import { useHistory } from './hooks/useHistory';
import { ThemeToggle } from './components/ThemeToggle';
import { QueryInput } from './components/QueryInput';
import { ActionButtons } from './components/ActionButtons';
import { StatusBar } from './components/StatusBar';
import { Toast } from './components/Toast';
import { ScannerModal } from './components/ScannerModal';
import { ResultGroups } from './components/ResultGroups';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  const [input, setInput] = useState('');
  const [queryCode, setQueryCode] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'ok' | 'err'>('info');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { theme, effective, cycleTheme } = useTheme();
  const { adbRead } = useADB();
  const { history, add: addHistory, remove: removeHistory, clearAll: clearHistory } = useHistory();

  const { data: queryData, isLoading, isError, error } = useQuery({
    queryKey: ['query', queryCode],
    queryFn: () => queryAPI(queryCode!),
    enabled: !!queryCode,
    retry: false,
    gcTime: 0,
  });

  const setToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(text); setToastType(type);
  }, []);
  const clearToast = useCallback(() => setToastMsg(null), []);

  const setStatus = useCallback((text: string, type: 'info' | 'ok' | 'err' = 'info') => {
    setStatusVisible(true); setStatusText(text); setStatusType(type);
  }, []);

  useEffect(() => { if (isLoading) setStatus('查询中...', 'info'); }, [isLoading, setStatus]);
  useEffect(() => { if (isError) setStatus(error instanceof Error ? error.message : '查询失败', 'err'); }, [isError, error, setStatus]);
  useEffect(() => {
    if (queryData && !isLoading && !isError) {
      const ok = !!(queryData.data && Object.keys(queryData.data).length > 0);
      setStatus(ok ? '查询成功' : (queryData.msg || '未找到数据'), ok ? 'ok' : 'err');
    }
  }, [queryData, isLoading, isError, setStatus]);

  const doQuery = useCallback((code: string) => {
    if (!code.trim()) { setStatus('请输入串码', 'err'); return; }
    setQueryCode(code.trim());
    if (code.trim()) addHistory(code.trim());
  }, [setStatus, addHistory]);
  const handleQuery = useCallback(() => doQuery(input), [input, doQuery]);
  const handleClear = useCallback(() => { setInput(''); setQueryCode(null); setStatusVisible(false); }, []);

  const handleScanResult = useCallback((text: string) => {
    const bn = extractBindNumber(text); setInput(bn); doQuery(bn);
  }, [doQuery]);
  const handleScanError = useCallback((msg: string) => setStatus('摄像头错误: ' + msg, 'err'), [setStatus]);

  const handleADB = useCallback(async () => {
    setStatus('等待选择ADB设备', 'info');
    const val = await adbRead();
    if (val) { setStatus('绑定号读取成功', 'ok'); setInput(val); doQuery(val); }
    else { setStatusVisible(false); }
  }, [adbRead, setStatus, doQuery]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => setToast('已复制: ' + text, 'success'), () => setToast('复制失败', 'error'));
  }, [setToast]);

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div className="logo"><Grid3x3 size={22} /></div>
          <span className="title">串码查询</span>
          <a className="github-link" href="https://github.com/baiyao105/select_partpsale" target="_blank" rel="noopener noreferrer" title="查看项目仓库">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="github-tooltip">查看项目仓库</span>
          </a>
          <ThemeToggle theme={theme} effective={effective} onCycle={cycleTheme} />
        </div>

        <QueryInput value={input} loading={isLoading} onChange={setInput} onClear={handleClear} onSubmit={handleQuery} />
        <ActionButtons loading={isLoading} onQuery={handleQuery} onScan={() => setScannerOpen(true)} onADB={handleADB} />
        <HistoryPanel history={history} onSelect={(code) => { setInput(code); doQuery(code); }} onRemove={removeHistory} onClearAll={clearHistory} />
        <StatusBar visible={statusVisible} loading={isLoading} text={statusText} type={statusType} />
        {queryData?.data && <ResultGroups data={queryData.data} onCopy={handleCopy} />}
        <div className="footer">串码查询工具</div>
      </div>
      <Toast message={toastMsg} type={toastType} onDone={clearToast} />
      <ScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleScanResult} onError={handleScanError} />
    </div>
  );
}
