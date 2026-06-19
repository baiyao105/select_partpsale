import { useMemo } from 'react';

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tileSVG(texts: { t: string; x: number; y: number }[], w: number, h: number, fs: number, op: number): string {
  const els = texts.map(t =>
    `<text x="${t.x}" y="${t.y}" transform="rotate(-30, ${t.x}, ${t.y})" font-family="'Inter',sans-serif" font-size="${fs}" font-weight="700" fill="currentColor" fill-opacity="${op}" text-anchor="middle" dominant-baseline="middle">${escXml(t.t)}</text>`
  ).join('');
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${els}</svg>`)}`;
}

const LAYER_CANKAO = {
  texts: [
    { t: '仅供参考', x: 50, y: 30 }, { t: '仅供参考', x: 150, y: 110 },
    { t: '仅供参考', x: -30, y: 190 }, { t: '仅供参考', x: 230, y: 270 },
  ],
  w: 200, h: 200, fs: 18, op: 0.06, cls: '',
};

const LAYER_USER = {
  texts: [
    { t: '@baiyao105', x: 100, y: 100 },
  ],
  w: 400, h: 400, fs: 14, op: 0.04, cls: 'wm-sparse',
};

function bindLayer(code: string) {
  return {
    texts: [
      { t: code, x: 140, y: 50 },
      { t: code, x: 140, y: 170 },
      { t: code, x: 140, y: 290 },
    ],
    w: 300, h: 400, fs: 16, op: 0.05, cls: 'wm-bind',
  };
}

export function Watermark({ bindCode }: { bindCode?: string }) {
  const bgCankao = useMemo(() => tileSVG(LAYER_CANKAO.texts, LAYER_CANKAO.w, LAYER_CANKAO.h, LAYER_CANKAO.fs, LAYER_CANKAO.op), []);
  const bgUser = useMemo(() => tileSVG(LAYER_USER.texts, LAYER_USER.w, LAYER_USER.h, LAYER_USER.fs, LAYER_USER.op), []);
  const bgBind = useMemo(() => {
    if (!bindCode) return '';
    const l = bindLayer(bindCode);
    return tileSVG(l.texts, l.w, l.h, l.fs, l.op);
  }, [bindCode]);

  return (
    <>
      <div className="watermark" style={{ backgroundImage: `url("${bgCankao}")`, backgroundSize: `${LAYER_CANKAO.w}px ${LAYER_CANKAO.h}px` }} />
      <div className={`watermark ${LAYER_USER.cls}`} style={{ backgroundImage: `url("${bgUser}")`, backgroundSize: `${LAYER_USER.w}px ${LAYER_USER.h}px` }} />
      {bgBind && <div className={`watermark ${bindLayer('').cls}`} style={{ backgroundImage: `url("${bgBind}")`, backgroundSize: `${bindLayer('').w}px ${bindLayer('').h}px` }} />}
    </>
  );
}
