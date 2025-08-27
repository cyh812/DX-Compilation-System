import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/ImageList.css';
import { SvgIcon, Button } from '@mui/material';
import data from '../assets/image_data.json';
import trash from '../assets/delete.svg';
import lock from '../assets/lock.svg'

const samplePaintings = [
  { src: '/image/1.jpg', year: 150, author: 'Artist A' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 800, author: 'Artist B' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1200, author: 'Artist C' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1240, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1800, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1810, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1900, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1860, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1990, author: 'Artist D' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1000, author: 'Artist D' },
];

function Left(props) {
  return (
    <SvgIcon {...props}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11L1 6L6 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 17V10C17 8.93913 16.5786 7.92172 15.8284 7.17157C15.0783 6.42143 14.0609 6 13 6H1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SvgIcon>
  );
}

function Right(props) {
  return (
    <SvgIcon {...props}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11L17 6L12 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 17V10C1 8.93913 1.42143 7.92172 2.17157 7.17157C2.92172 6.42143 3.93913 6 5 6H17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SvgIcon>
  );
}

const ImageList = ({
  results,
  paintings = samplePaintings,
  spanYears = 2000,
  baseImageSize = 80,
  gap = 5,
  onClose,
  onDelete,
  icons = { delete: trash, lock: lock },
  maxImageHeight = 150
}) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(true);
  const CONF_COLORS = ["#ff3b30", "#ff453a", "#ff8e8e", "#ffffff", "#d4f8d4", "#34c759", "#00e676"];
  const [confIdx, setConfIdx] = useState(3);

  // ✅ 独立保存每个卡片的缩放/拖拽状态
  const [cardStates, setCardStates] = useState({});

  const handlePick = (i) => {
    if (locked) return;
    setConfIdx(i);
  };

  const handleWheel = useCallback((e) => {
    const delta = -e.deltaY / 1000;
    setScale(s => Math.min(5, Math.max(1, s + delta)));
  }, []);

  const syncScroll = source => {
    const srcRef = source === 'wrapper' ? wrapperRef : topScrollRef;
    const tgtRef = source === 'wrapper' ? topScrollRef : wrapperRef;
    if (srcRef.current && tgtRef.current) tgtRef.current.scrollLeft = srcRef.current.scrollLeft;
  };

  useEffect(() => {
    const w = wrapperRef.current;
    const t = topScrollRef.current;
    if (w && t) {
      const cw = w.clientWidth;
      const ch = w.clientHeight;
      setContainerWidth(cw);
      setContainerHeight(ch);
      const contentW = cw * scale;
      w.querySelector('.timeline-content').style.width = `${contentW}px`;
      t.querySelector('.scroll-content').style.width = `${contentW}px`;
    }
  }, [scale, paintings]);

  const bucketYears = scale < 2 ? 100 : scale < 4 ? 50 : 1;
  const buckets = {};
  paintings.forEach(p => {
    const key = Math.floor(p.year / bucketYears) * bucketYears;
    buckets[key] = buckets[key] || [];
    buckets[key].push(p);
  });

  // --- 缩放 + 拖拽逻辑 for 卡片 ---
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const getCardState = (src) => cardStates[src] || { scale: 1, offset: { x: 0, y: 0 } };

  const handleCardWheel = (src, e) => {
    e.stopPropagation(); // ✅ 避免冒泡影响 ImageList
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const prev = getCardState(src);
    setCardStates((prevStates) => ({
      ...prevStates,
      [src]: {
        ...prev,
        scale: Math.max(0.5, prev.scale + delta),
      }
    }));
  };

  const handleCardMouseDown = (src, e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardMouseMove = (src, e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const prev = getCardState(src);
    setCardStates((prevStates) => ({
      ...prevStates,
      [src]: {
        ...prev,
        offset: { x: prev.offset.x + dx, y: prev.offset.y + dy }
      }
    }));
  };

  const handleCardMouseUp = () => { dragging.current = false; };

  return (
    <div className='L'>
      <div
        className='L1'
        onWheel={(e) => {
          if (selected) return; // ✅ 有卡片时禁止全局缩放
          handleWheel(e);
        }}
      >
        <div className='scroll'>
          <div className="scroll-content-buttons">
            <Button variant="contained" size="small" startIcon={<Left />}></Button>
            <Button variant="contained" size="small" startIcon={<Right />}></Button>
          </div>
        </div>
        <div ref={topScrollRef} className='top-scroll' onScroll={() => syncScroll('top')}>
          <div className='scroll-content' />
        </div>
        <div ref={wrapperRef} className='wrapper' onScroll={() => syncScroll('wrapper')}>
          <div className='timeline-content'>
            {containerWidth > 0 &&
              Object.entries(buckets).sort((a, b) => +a[0] - +b[0]).map(([yearStart, list]) => {
                const leftPx = (yearStart / spanYears) * containerWidth * scale;
                const imgSize = baseImageSize * scale;
                const groupHeight = list.length * imgSize + (list.length - 1) * gap;
                const startY = (containerHeight - groupHeight) / 2;
                return (
                  <div key={yearStart} className='bucket-group' style={{ left: `${leftPx}px` }}>
                    <div className='line' />
                    {list.map((p, i) => {
                      const topY = startY + i * (imgSize + gap) + imgSize / 2;
                      return (
                        <img
                          key={i}
                          src={p.src}
                          alt={`${p.author}-${p.year}`}
                          className='painting'
                          style={{
                            width: `${imgSize}px`,
                            height: `${imgSize}px`,
                            top: `${topY}px`,
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer'
                          }}
                          title={`${p.author} (${p.year})`}
                          onClick={() => {
                            setSelected({ ...p, x: leftPx, y: topY });
                            setCardStates(prev => ({
                              ...prev,
                              [p.src]: prev[p.src] || { scale: 1, offset: { x: 0, y: 0 } }
                            }));
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
          </div>
          {selected && (
            <div className='info-card-v2' role="dialog" aria-label="candidate card" style={{ left: `${selected.x + 10}px`, top: `${selected.y - 180}px` }}>
              {/* 标题栏 */}
              <div className="card-header">
                <h4 className="card-title">{selected.title || "Untitled"}</h4>
                <button className="icon-btn" onClick={() => setSelected(null)}>
                  {icons.delete ? <img src={icons.delete} alt="" /> : <span />}
                </button>
              </div>

              {/* 媒体区：支持缩放+拖拽 */}
              <div
                className="card-media"
                style={{ "--max-media-h": `${maxImageHeight}px` }}
                onWheel={(e) => handleCardWheel(selected.src, e)}
                onMouseDown={(e) => handleCardMouseDown(selected.src, e)}
                onMouseMove={(e) => handleCardMouseMove(selected.src, e)}
                onMouseUp={handleCardMouseUp}
                onMouseLeave={handleCardMouseUp}
              >
                <img
                  src={selected.src}
                  alt=""
                  style={{
                    transform: `translate(${getCardState(selected.src).offset.x}px, ${getCardState(selected.src).offset.y}px) scale(${getCardState(selected.src).scale})`,
                    transformOrigin: "center center",
                    cursor: "grab"
                  }}
                  draggable={false}
                />
              </div>

              {/* 信息区 */}
              <div className="meta">
                <div className="row">
                  <span className="label">Painter:</span>
                  <span className="value">{selected.author || "-"}</span>
                </div>
                <div className="row two-cols">
                  <div className="col">
                    <span className="label">Time: </span>
                    <span className="value">{selected.year || "-"}</span>
                  </div>
                  <div className="col">
                    <span className="label">Style:</span>
                    <span className="value">{selected.style || "-"}</span>
                  </div>
                </div>
                <div className="row">
                  <span className="label">Similarity</span>
                  <span className="value">{selected.similarity ?? "-"}</span>
                </div>
              </div>

              {/* 置信度 */}
              <div className="confidence">
                <div className="conf-head">
                  <span className="label">Confidence level</span>
                  <button className="icon-btn" onClick={() => setLocked(v => !v)}>
                    {locked
                      ? (icons.lock ? <img src={icons.lock} alt="" /> : <span />)
                      : (icons.unlock ? <img src={icons.unlock} alt="" /> : <span />)
                    }
                  </button>
                </div>
                <div className="divider" />
                <div className="swatches" role="radiogroup">
                  {CONF_COLORS.map((c, i) => (
                    <button
                      key={i}
                      className={`swatch ${i === confIdx ? "active" : "inactive"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setConfIdx(i)}
                      role="radio"
                      aria-checked={i === confIdx}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageList;
