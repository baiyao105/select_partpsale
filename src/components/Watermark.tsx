import { useMemo } from 'react';

function escXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
}

function svgText(
  text: string,
  x: number,
  y: number,
  size: number,
  opacity: number,
  rotate: number,
  weight = 600,
) {
  return `
    <text
      x="${x}"
      y="${y}"
      transform="rotate(${rotate} ${x} ${y})"
      font-family="Inter,Segoe UI,sans-serif"
      font-size="${size}"
      font-weight="${weight}"
      fill="#364953ff"
      fill-opacity="${opacity}"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      ${escXml(text)}
    </text>
  `;
}

function createWatermarkSvg(bindCode?: string) {
  const width = 1800;
  const height = 1400;

  const elements: string[] = [];

  let seed = 1;

  const jitter = (
    baseX: number,
    baseY: number,
    xRange: number,
    yRange: number,
  ) => {
    const dx = (seededRandom(seed++) - 0.5) * xRange;
    const dy = (seededRandom(seed++) - 0.5) * yRange;

    return {
      x: baseX + dx,
      y: baseY + dy,
    };
  };
  for (let y = -100; y < height + 200; y += 140) {
    for (let x = -100; x < width + 200; x += 130) {
      const p = jitter(x, y, 50, 40);

      elements.push(
        svgText(
          '仅供参考',
          p.x,
          p.y,
          18 + seededRandom(seed++) * 3,
          0.05 + seededRandom(seed++) * 0.03,
          -25 - seededRandom(seed++) * 10,
          700,
        ),
      );
    }
  }
  if (bindCode?.trim()) {
    const code = bindCode.trim().slice(0, 64);

    for (let y = -50; y < height + 200; y += 140) {
      for (let x = 50; x < width + 200; x += 160) {
        const p = jitter(x, y, 80, 60);

        elements.push(
          svgText(
            code,
            p.x,
            p.y,
            15 + seededRandom(seed++) * 2,
            0.045 + seededRandom(seed++) * 0.02,
            -25 - seededRandom(seed++) * 10,
          ),
        );
      }
    }
  }
  for (let y = 0; y < height + 300; y += 230) {
    for (let x = 100; x < width + 300; x += 270) {
      const p = jitter(x, y, 100, 80);

      elements.push(
        svgText(
          '@baiyao105',
          p.x,
          p.y,
          14 + seededRandom(seed++) * 2,
          0.04 + seededRandom(seed++) * 0.015,
          -25 - seededRandom(seed++) * 10,
        ),
      );
    }
  }

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      ${elements.join('')}
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function Watermark({
  bindCode,
}: {
  bindCode?: string;
}) {
  const backgroundImage = useMemo(
    () => createWatermarkSvg(bindCode),
    [bindCode],
  );

  return (
    <div
      className="watermark"
      aria-hidden
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '1800px 1400px',
      }}
    />
  );
}
