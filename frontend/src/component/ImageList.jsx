import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/ImageList.css';
import { SvgIcon, Button } from '@mui/material';
import trash from '../assets/delete.svg';
import lock from '../assets/lock.svg'

function Left(props) {
  return (
    <SvgIcon {...props}>
      <svg width="102" height="178" viewBox="0 0 102 178" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M96.9463 4.83276C91.3805 -0.892822 82.3489 -0.892822 76.7692 4.83276L5.04341 78.663C-0.519678 84.3988 -0.519678 93.6986 5.04341 99.423L76.7692 173.251C82.3477 178.986 91.3797 178.986 96.9463 173.251C102.522 167.523 102.522 158.225 96.9463 152.488L35.3057 89.0425L96.9461 25.6044C102.521 19.8687 102.521 10.5707 96.9461 4.83179L96.9463 4.83276Z" fill="white" />
      </svg>
    </SvgIcon>
  );
}

function Right(props) {
  return (
    <SvgIcon {...props}>
      <svg width="101" height="178" viewBox="0 0 101 178" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.18159 172.719C9.74741 178.445 18.7791 178.445 24.3587 172.719L96.0845 98.8892C101.648 93.1535 101.648 83.8537 96.0845 78.1292L24.3587 4.30171C18.7802 -1.43402 9.74819 -1.43402 4.18159 4.30171C-1.3938 10.0293 -1.3938 19.3269 4.18159 25.0642L65.8222 88.5097L4.18179 151.948C-1.39341 157.684 -1.39322 166.982 4.18179 172.72L4.18159 172.719Z" fill="white" />
      </svg>
    </SvgIcon>
  );
}

const ImageList = ({
  results,
  spanYears = 1500,
  baseImageSize = 80,
  gap = 5,
  icons = { delete: trash, lock: lock },
  maxImageHeight = 150
}) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selected, setSelected] = useState(null);
  const CONF_COLORS = ["#ff3b30", "#ff453a", "#ff8e8e", "#ffffff", "#d4f8d4", "#34c759", "#00e676"];
  const [confIdx, setConfIdx] = useState(3);

  // 独立保存每个卡片的缩放/拖拽状态
  const [cardStates, setCardStates] = useState({});

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
  }, [scale, results]);

  const bucketYears = scale < 2 ? 100 : scale < 4 ? 50 : 1;
  const buckets = {};
  results.forEach(p => {
    const key = Math.floor(p.year / bucketYears) * bucketYears;
    buckets[key] = buckets[key] || [];
    buckets[key].push(p);
  });

  // --- 缩放 + 拖拽逻辑 for 卡片 ---
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const getCardState = (src) => cardStates[src] || { scale: 1, offset: { x: 0, y: 0 } };

  const handleCardWheel = (src, e) => {
    e.stopPropagation(); // 避免冒泡影响 ImageList
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
          if (selected) return; //有卡片时禁止全局缩放
          handleWheel(e);
        }}
      >
        <div className='scroll'>
          <div className="scroll-content-buttons">
            <Button
              variant="contained"
              size="small"
              startIcon={<Left />}
              className="square-button"
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<Right />}
              className="square-button"
            />
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
                console.log(buckets)
                return (
                  <div key={yearStart} className='bucket-group' style={{ left: `${leftPx}px` }}>
                    <div className='line' />
                    {list.map((p, i) => {
                      const topY = startY + i * (imgSize + gap) + imgSize / 2;
                      return (
                        <img
                          key={i}
                          src={p.url}
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
                <h4 className="card-title">{selected.workName || "Untitled"}</h4>
                <button className="icon-btn" onClick={() => setSelected(null)}>
                  {icons.delete ? <img src={icons.delete} alt="" /> : <span />}
                </button>
              </div>

              {/* 媒体区：支持缩放+拖拽 */}
              <div
                className="card-media"
                style={{ "--max-media-h": `${maxImageHeight}px` }}
                onWheel={(e) => handleCardWheel(selected.url, e)}
                onMouseDown={(e) => handleCardMouseDown(selected.url, e)}
                onMouseMove={(e) => handleCardMouseMove(selected.url, e)}
                onMouseUp={handleCardMouseUp}
                onMouseLeave={handleCardMouseUp}
              >
                <img
                  src={selected.url}
                  alt=""
                  style={{
                    transform: `translate(${getCardState(selected.url).offset.x}px, ${getCardState(selected.url).offset.y}px) scale(${getCardState(selected.url).scale})`,
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
                  <span className="value">{selected.authorName || "-"}</span>
                </div>
                <div className="row two-cols">
                  <div className="col">
                    <span className="label">Time: </span>
                    <span className="value">{selected.year || "-"}</span>
                  </div>
                  <div className="col">
                    <span className="label">Style:</span>
                    <span className="value">{selected.dynasty || "-"}</span>
                  </div>
                </div>
                <div className="row">
                  <span className="label">Similarity</span>
                  <span className="value">{selected.similar ?? "-"}</span>
                </div>
              </div>

              {/* 置信度 */}
              <div className="confidence">
                <div className="conf-head">
                  <span className="label">Confidence level</span>
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
