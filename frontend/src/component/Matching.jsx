import React, { useRef, useEffect, useState } from 'react';
import '../style/Matching.css';

const ImageChoose = () => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(null);

  // 测量容器大小
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const { clientWidth: width, clientHeight: height } = containerRef.current;
      setSize({ width, height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { width, height } = size;
  if (width === 0) {
    return (
      <div className="M">
        <div className="M1" />
        <div className="M2" ref={containerRef} style={{ position: 'relative' }} />
      </div>
    );
  }

  // 基础配置
  const regionCount = 10;
  const regionWidth = 50;
  const totalRegions = regionCount * regionWidth;
  const gap = (width - totalRegions) / (regionCount + 1);

  // 区域内子节点定义
  const topGroups = {
    1: [{ id: 'A', w: 20 }, { id: 'B', w: 30 }],
    2: [{ id: 'C', w: 25 }, { id: 'D', w: 25 }],
    3: [{ id: 'E', w: 15 }, { id: 'F', w: 35 }],
    // …到 10
  };
  const bottomGroups = {
    1: [{ id: 'X', w: 15 }, { id: 'Y', w: 15 }, { id: 'Z', w: 20 }],
    2: [{ id: 'U', w: 50 }],
    3: [{ id: 'V', w: 10 }, { id: 'W', w: 40 }],
    // …到 10
  };

  // 链接定义
  const links = [
    { from: 'A', to: 'X', color: '#e74c3c' },
    { from: 'B', to: 'Z', color: '#3498db' },
    { from: 'C', to: 'Y', color: '#2ecc71' },
    { from: 'E', to: 'W', color: '#f1c40f' },
  ];

  // 计算每个子节点坐标及宽度
  const positionMap = {};
  const widthMap = {};
  Object.entries(topGroups).forEach(([ri, items]) => {
    const idx = +ri - 1;
    const start = gap + idx * (regionWidth + gap);
    let offset = 0;
    items.forEach(({ id, w }) => {
      positionMap[id] = { x: start + offset + w / 2, y: 0 };
      widthMap[id] = w;
      offset += w;
    });
  });
  Object.entries(bottomGroups).forEach(([ri, items]) => {
    const idx = +ri - 1;
    const start = gap + idx * (regionWidth + gap);
    let offset = 0;
    items.forEach(({ id, w }) => {
      positionMap[id] = { x: start + offset + w / 2, y: height };
      widthMap[id] = w;
      offset += w;
    });
  });

  // 三次贝塞尔及其导数
  const cubic = (a, b, c, d, t) =>
    a * (1 - t) ** 3 + 3 * b * t * (1 - t) ** 2 + 3 * c * t ** 2 * (1 - t) + d * t ** 3;
  const cubicD = (a, b, c, d, t) =>
    3 * (b - a) * (1 - t) ** 2 + 6 * (c - b) * t * (1 - t) + 3 * (d - c) * t ** 2;

  // 生成 ribbon path 并采样中点位置
  const makeRibbonPath = (from, to, samples = 30) => {
    const p0 = positionMap[from], p1 = positionMap[to];
    const w0 = widthMap[from], w1 = widthMap[to];
    const cx1 = p0.x, cy1 = height * 0.25;
    const cx2 = p1.x, cy2 = height * 0.75;
    const topPts = [], botPts = [];
    let midPoint = null;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = cubic(p0.x, cx1, cx2, p1.x, t);
      const y = cubic(p0.y, cy1, cy2, p1.y, t);
      const dx = cubicD(p0.x, cx1, cx2, p1.x, t);
      const dy = cubicD(p0.y, cy1, cy2, p1.y, t);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const w = w0 + (w1 - w0) * t;
      topPts.push(`${x + nx * w / 2},${y + ny * w / 2}`);
      botPts.push(`${x - nx * w / 2},${y - ny * w / 2}`);
      if (t === 0.5) midPoint = { x, y };
    }

    return {
      d: `M${topPts[0]} L${topPts.slice(1).join(' ')} L${botPts.reverse().join(' ')} Z`,
      mid: midPoint
    };
  };

  // 点击处理
  const handleClick = (link) => {
    const { from, to, color } = link;
    const { mid } = makeRibbonPath(from, to);
    setSelected({ ...link, pos: mid });
  };

  return (
    <div className="M">
      <div className="M2" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          {links.map((link, i) => {
            const { d } = makeRibbonPath(link.from, link.to);
            return (
              <path
                key={i}
                d={d}
                fill={link.color}
                opacity="0.8"
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onClick={() => handleClick(link)}
              />
            );
          })}
        </svg>

        {/* 交互卡片定制 */}
        {selected && (
          <div
            className="link-card"
            style={{
              position: 'absolute',
              left: `${selected.pos.x + 10}px`,
              top: `${selected.pos.y - 80}px`,
              background: '#fff',
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ float: 'right', cursor: 'pointer' }}
            >关闭</button>
            <div style={{ clear: 'both' }} />
            <div><strong>From:</strong> {selected.from}</div>
            <div><strong>To:</strong> {selected.to}</div>
            <div><strong>Width Start:</strong> {widthMap[selected.from]}</div>
            <div><strong>Width End:</strong> {widthMap[selected.to]}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageChoose;
