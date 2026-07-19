import { useEffect, useMemo, useRef } from "react";

function escXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
}

const FILL = "#e0e0e0";

function svgText(
  text: string,
  x: number,
  y: number,
  size: number,
  opacity: number,
  rotate: number,
  weight = 400,
) {
  return `
    <text
      x="${x}"
      y="${y}"
      transform="rotate(${rotate} ${x} ${y})"
      font-family="Inter,Segoe UI,sans-serif"
      font-size="${size}"
      font-weight="${weight}"
      fill="${FILL}"
      fill-opacity="${opacity}"
      stroke="${FILL}"
      stroke-width="0.2"
      stroke-opacity="${opacity * 0.4}"
      paint-order="stroke"
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
          "仅供参考",
          p.x,
          p.y,
          16 + seededRandom(seed++) * 2,
          0.035 + seededRandom(seed++) * 0.02,
          -25 - seededRandom(seed++) * 10,
          400,
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
            0.03 + seededRandom(seed++) * 0.015,
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
          "@baiyao105",
          p.x,
          p.y,
          14 + seededRandom(seed++) * 2,
          0.025 + seededRandom(seed++) * 0.01,
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
      ${elements.join("")}
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function Watermark({ bindCode }: { bindCode?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const backgroundImage = useMemo(
    () => createWatermarkSvg(bindCode),
    [bindCode],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    const restore = () => {
      if (!el.parentElement) {
        parent.appendChild(el);
      }
      if (
        el.style.display === "none" ||
        getComputedStyle(el).display === "none"
      ) {
        el.style.display = "";
      }
      if (
        el.style.visibility === "hidden" ||
        getComputedStyle(el).visibility === "hidden"
      ) {
        el.style.visibility = "";
      }
      if (el.style.opacity === "0" || getComputedStyle(el).opacity === "0") {
        el.style.opacity = "";
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" && m.removedNodes.length > 0) {
          for (const node of Array.from(m.removedNodes)) {
            if (node === el) {
              restore();
              return;
            }
          }
        }
        if (m.type === "attributes" && m.target === el) {
          restore();
        }
      }
    });

    observer.observe(parent, { childList: true, subtree: true });
    observer.observe(el, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="watermark"
      aria-hidden
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "1800px 1400px",
      }}
    />
  );
}
