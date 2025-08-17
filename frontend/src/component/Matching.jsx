import React, { useRef, useEffect, useState, useMemo } from 'react';
import '../style/Matching.css';
import lock from '../assets/lock.svg'
import edit from '../assets/unedit.svg'
import unedit from '../assets/edit.svg'
import { SvgIcon, Slider, Input, Button, Typography, Box } from '@mui/material';

const COLS = 60;
const PAD = 20;     // 左右 padding = 20
const GAP = 10;     // 相邻节点 gap = 10

// 红(#e74c3c) → 白(#ffffff) → 绿(#2ecc71)
function redWhiteGreen(t) {
  const lerp = (a, b, u) => Math.round(a + (b - a) * u);
  // RGB
  const R = [231, 255, 46];
  const G = [76, 255, 204];
  const B = [60, 255, 113];

  if (t <= 0.5) {
    const u = t / 0.5; // 0..1 红→白
    const r = lerp(R[0], R[1], u);
    const g = lerp(G[0], G[1], u);
    const b = lerp(B[0], B[1], u);
    return `rgb(${r},${g},${b})`;
  } else {
    const u = (t - 0.5) / 0.5; // 0..1 白→绿
    const r = lerp(R[1], R[2], u);
    const g = lerp(G[1], G[2], u);
    const b = lerp(B[1], B[2], u);
    return `rgb(${r},${g},${b})`;
  }
}

// 由 blocks 数量映射带宽（像素）
function widthByBlocks(n) {
  const MIN = 6;      // 最小宽度
  const UNIT = 10;    // 每个块增加的宽度
  return Math.max(MIN, n * UNIT);
}

const Matching = ({
  icons = {
    edit: edit,
    unedit: unedit,
  }
}) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(null);
  const [edited, setedited] = useState(false);

  const [note, setNote] = useState('');  // 输入内容
  // 根据规则决定是否显示输入框
  const showInput = edited ? true : (note.trim().length > 0);

  const cardRef = useRef(null);
  const sliderSx = {
    width: '200px',
    height: 10,

    // 统一厚度
    "& .MuiSlider-rail, & .MuiSlider-track": {
      height: 10,
      border: 'none',
      borderRadius: 9999,
    },

    // ✅ 整条底色 = 渐变
    "& .MuiSlider-rail": {
      position: 'relative',
      opacity: 1,
      background: "linear-gradient(90deg, #FF3B30 0%, #FFFFFF 50%, #2ecc71 100%)",
    },

    "& .MuiSlider-rail::after": {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,                // 从右侧开始盖
      bottom: 0,
      width: 'calc((1 - var(--progress, 0)) * 100%)',
      background: '#eee',
      borderTopRightRadius: 'inherit',
      borderBottomRightRadius: 'inherit',
      pointerEvents: 'none',
    },

    "& .MuiSlider-track": {
      background: 'transparent',
    },

    "& .MuiSlider-thumb": {
      backgroundColor: "#00C1CD",
      "&:hover, &.Mui-focusVisible": {
        boxShadow: "0px 0px 0px 8px rgba(0, 193, 205, 0.16)",
      },
    },
  };




  // 测量容器大小
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const { clientWidth: width, clientHeight: height } = containerRef.current;
      setSize({ width: width * 2, height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        // 点击了 card 外部
        setSelected(null);
      }
    }
    if (selected) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selected]);


  const { width, height } = size;

  // === 布局：计算每个节点的中心坐标与统一宽度 ===
  const layout = useMemo(() => {
    if (!width || !height) return null;
    const nodeW = (width - 2 * PAD - GAP * (COLS - 1)) / COLS; // 每个 div 的宽

    const centersX = Array.from({ length: COLS }, (_, i) => PAD + i * (nodeW + GAP) + nodeW / 2);

    return { nodeW, centersX };
  }, [width, height]);

  // === 模拟节点数据（稀疏） ===
  // 每个节点：{ id: 'T00', blocks: [...] } / { id: 'B00', blocks: [...] }
  const { topNodes, bottomNodes } = useMemo(() => {
    const pActive = 0.22; // 节点激活概率（越小越稀疏）
    const mkNodes = (prefix) =>
      Array.from({ length: COLS }, (_, i) => {
        const active = Math.random() < pActive;
        const cnt = active ? 1 + Math.floor(Math.random() * 3) : 0; // 1~3 个块 / 或 0
        const blocks = Array.from({ length: cnt }, (_, k) => `${prefix}${String(i).padStart(2, '0')}-b${k + 1}`);
        return { id: `${prefix}${String(i).padStart(2, '0')}`, blocks };
      });

    return {
      topNodes: mkNodes('T'),
      bottomNodes: mkNodes('B'),
    };
  }, []);

  // === 建立坐标与带宽映射 ===
  const { positionMap, widthMap } = useMemo(() => {
    const pos = {};
    const wmap = {};
    if (!layout) return { positionMap: pos, widthMap: wmap };

    // 上排 Y=0；下排 Y=height
    topNodes.forEach((n, i) => {
      const x = layout.centersX[i];
      pos[n.id] = { x, y: 0 };
      wmap[n.id] = widthByBlocks(n.blocks.length);
    });
    bottomNodes.forEach((n, i) => {
      const x = layout.centersX[i];
      pos[n.id] = { x, y: height };
      wmap[n.id] = widthByBlocks(n.blocks.length);
    });

    return { positionMap: pos, widthMap: wmap };
  }, [layout, height, topNodes, bottomNodes]);

  // === 生成链接 ===
  // 规则：上下都“非空”的节点，两两成边；每条边有 value∈[0,1]（映射色）
  // const links = useMemo(() => {
  //   const tops = topNodes.filter(n => n.blocks.length > 0);
  //   const bots = bottomNodes.filter(n => n.blocks.length > 0);
  //   const out = [];
  //   for (const t of tops) {
  //     for (const b of bots) {
  //       const value = Math.random(); // 0..1
  //       out.push({ from: t.id, to: b.id, value });
  //     }
  //   }
  //   return out;
  // }, [topNodes, bottomNodes]);

  const [links, setLinks] = useState([]);

  useEffect(() => {
    // 用你原先的生成逻辑创建一次性初始 links
    const tops = topNodes.filter(n => n.blocks.length > 0);
    const bots = bottomNodes.filter(n => n.blocks.length > 0);
    const out = [];
    for (const t of tops) {
      for (const b of bots) {
        out.push({
          id: `${t.id}->${b.id}`,  // 给每条 link 一个稳定 id
          from: t.id,
          to: b.id,
          value: Math.random(),     // 0..1
        });
      }
    }
    setLinks(out);
  }, [topNodes, bottomNodes]);

  // 三次贝塞尔及其导数
  const cubic = (a, b, c, d, t) =>
    a * (1 - t) ** 3 + 3 * b * t * (1 - t) ** 2 + 3 * c * t ** 2 * (1 - t) + d * t ** 3;
  const cubicD = (a, b, c, d, t) =>
    3 * (b - a) * (1 - t) ** 2 + 6 * (c - b) * t * (1 - t) + 3 * (d - c) * t ** 2;

  // 生成 ribbon path 并采样中点位置
  const makeRibbonPath = (from, to, samples = 30) => {
    const p0 = positionMap[from], p1 = positionMap[to];

    // 控制点：竖向弯曲
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
      const w = layout.nodeW * 0.5;  // 全程保持节点宽度一致

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
  // const handleClick = (link) => {
  //   const { from, to } = link;
  //   const { mid } = makeRibbonPath(from, to);
  //   setSelected({ ...link, pos: mid });
  // };

  const handleClick = (link, index) => {
    const { mid } = makeRibbonPath(link.from, link.to);
    setSelected({ ...link, index, pos: mid }); // 记住 index 方便回写
  };


  if (!layout) {
    return (
      <div className="M">
        <div className="M1" />
        <div className="M2" ref={containerRef} style={{ position: 'relative' }} />
      </div>
    );
  }

  return (
    <div className="M">
      {/* 右侧绘制容器 */}
      <div className="M2" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* {links.map((link, i) => {
            const { d } = makeRibbonPath(link.from, link.to);
            const color = redWhiteGreen(link.value);
            return (
              <path
                key={i}
                d={d}
                fill={color}
                opacity="0.85"
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onClick={() => handleClick(link)}
              />
            );
          })} */}

          {links.map((link, i) => {
            const { d } = makeRibbonPath(link.from, link.to);
            const color = redWhiteGreen(link.value); // 仍按你的映射上色
            return (
              <path
                key={link.id}
                d={d}
                fill={color}
                opacity="0.85"
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onClick={() => handleClick(link, i)}
              />
            );
          })}

        </svg>

        {/* 点击后的信息卡片 */}
        {selected && (
          <div
            className="link-card"
            ref={cardRef}
            style={{
              left: `${selected.pos.x + 10}px`,
              top: `${selected.pos.y - 20}px`,
            }}
          >
            <div style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between"

            }}>
              <button
                className="icon-btn"
                onClick={() => setedited(v => !v)}
                aria-pressed={!edited}
                title={edited ? "Edited" : "Unedited"}
              >
                {edited
                  ? (icons.edit ? <img src={icons.edit} alt="" /> : <span className="icon-placeholder" />)
                  : (icons.unedit ? <img src={icons.unedit} alt="" /> : <span className="icon-placeholder" />)
                }
              </button>

              <Slider
                sx={{ ...sliderSx, '--progress': Number(selected.value ?? 0) }} // ⬅️ 动态进度
                value={Number(selected.value ?? 0)}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => v.toFixed(2)}  // 只格式化显示
                min={0}
                max={1}
                step={0.01}
                onChange={(_, val) => {
                  const v = Array.isArray(val) ? val[0] : val;
                  setSelected(prev => ({ ...prev, value: v }));
                  setLinks(prev => prev.map((l, idx) =>
                    idx === selected.index ? { ...l, value: v } : l
                  ));
                }}
              />

              <button
                className="icon-btn"
                onClick={() => setedited(v => !v)}
                aria-pressed={!edited}
                title={edited ? "Edited" : "Unedited"}
              >
                {edited
                  ? (icons.edit ? <img src={icons.edit} alt="" /> : <span className="icon-placeholder" />)
                  : (icons.unedit ? <img src={icons.unedit} alt="" /> : <span className="icon-placeholder" />)
                }
              </button>
            </div>
            <div style={{
              width: '100%'
            }}>
              {showInput && (
                <div style={{ marginTop: 8 }}>
                  <textarea
                    className="note-input"
                    placeholder="请输入备注..."
                    rows={1}                         // 一行高
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={!edited}               // unedit 时锁定
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      resize: 'vertical',            // 需要的话可拉伸；不需要就设 'none'
                      padding: '10px 10px',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      background: !edited ? '#1c1c1c' : '#1c1c1c',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '16px',
                    }}
                  />
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default Matching;