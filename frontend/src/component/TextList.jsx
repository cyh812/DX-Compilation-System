import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/TextList.css';
import { SvgIcon, Button, formControlClasses } from '@mui/material';
import data from '../assets/image_data.json';
import trash from '../assets/delete.svg';
import lock from '../assets/lock.svg'
import Jin from '../assets/经.png'
import Shi from '../assets/史.png'
import Zi from '../assets/子.png'
import Ji from '../assets/集.png'
import Fo from '../assets/佛.png'
import Dao from '../assets/道.png'
import Zidingyi from '../assets/自定义.png'

// 模拟数据
const samplePaintings = [
  { src: Jin, year: 150, author: 'Artist A' },
  { src: Shi, year: 800, author: 'Artist B' },
  { src: Zi, year: 1200, author: 'Artist C' },
  { src: Ji, year: 1240, author: 'Artist D' },
  { src: Fo, year: 1800, author: 'Artist D' },
  { src: Dao, year: 1810, author: 'Artist D' },
  { src: Zidingyi, year: 1900, author: 'Artist D' },
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

const TextList = ({
  results,
  paintings = samplePaintings,
  spanYears = 2000,
  baseImageSize = 80,
  gap = 5,
  onClose,                    // 关闭卡片
  onDelete,                   // 点击标题栏垃圾桶回调
  icons = {
    delete: trash,
    lock: lock
  },                 // { delete, lock, unlock } 传入图片或 svg 路径
  maxImageHeight = 150        // 媒体区最大高度（px）
}) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selected, setSelected] = useState(null); //点击查看详情的图片

  const [locked, setLocked] = useState(true);
  const CONF_COLORS = ["#ff3b30", "#ff453a", "#ff8e8e", "#ffffff", "#d4f8d4", "#34c759", "#00e676"];
  const [confIdx, setConfIdx] = useState(3); // 默认中间白色激活

  const handlePick = (i) => {
    if (locked) return;
    setConfIdx(i);
  };

  const handleWheel = useCallback((e) => {
    // e.preventDefault();
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

  useEffect(() => {
    console.log(results)
  }, [results]);

  const bucketYears = scale < 2 ? 100 : scale < 4 ? 50 : 1;
  const buckets = {};
  paintings.forEach(p => {
    const key = Math.floor(p.year / bucketYears) * bucketYears;
    buckets[key] = buckets[key] || [];
    buckets[key].push(p);
  });

  const test = () => {
    console.log('4')
  };

  return (
    <div className='L'>
      <div className='L1' onWheel={handleWheel}>


        <div ref={wrapperRef} className='wrapper' onScroll={() => syncScroll('wrapper')}>
          <div className='timeline-content'>
            {containerWidth > 0 && Object.entries(buckets).sort((a, b) => +a[0] - +b[0]).map(([yearStart, list]) => {
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
                        onClick={(e) => setSelected({ ...p, x: leftPx, y: topY })}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          {selected && (
            <div className='info-card-v2' role="dialog" aria-label="candidate card" style={{ left: `${selected.x + 10}px`, top: `${selected.y - 160}px` }}>
              {/* 标题栏 */}
              <div className="card-header">
                <h4 className="card-title" title={selected.title || ""}>
                  {selected.title || "Untitled"}
                </h4>
                <button
                  className="icon-btn"
                  // onClick={onDelete}
                  onClick={() => setSelected(null)}
                  aria-label="delete"
                  title="Delete"
                >
                  {/* 预留位：传入你的图标路径即可 */}
                  {icons.delete ? <img src={icons.delete} alt="" /> : <span className="icon-placeholder" />}
                </button>
              </div>


              <div className="card-media" style={{ "--max-media-h": `${maxImageHeight}px` }}>
                <div className="media-text">
                  {selected.text || "神功）盖器物图像、图像题材、工艺技法、历史语境与文化符号等要素的多维知识图谱。通过对图像与文本数据的清洗、语义抽取与标准化建模，系统构建文物图像中的实体、关系与属性网络，综合运用语义推理、图计算与神经网络等技术，实现对复杂文化知识的深度关联与智能推演。该图谱不仅具备动态更新与跨模态检索能力，还将为文物图像的人文研究与知识服务提供强有力的支撑，推动中华文明的可视化建模与数字化表达。"}
                </div>
              </div>


              {/* 字段信息 */}
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
                </div>
                <div className="row">
                  <span className="label">Similarity:</span>
                  <span className="value">{selected.similarity ?? "-"}</span>
                </div>
              </div>


              {/* 置信度区 */}
              <div className="confidence">
                <div className="conf-head">
                  <span className="label">Confidence level</span>
                  <button
                    className="icon-btn"
                    onClick={() => setLocked(v => !v)}
                    aria-pressed={!locked}
                    title={locked ? "Locked" : "Unlocked"}
                  >
                    {locked
                      ? (icons.lock ? <img src={icons.lock} alt="" /> : <span className="icon-placeholder" />)
                      : (icons.unlock ? <img src={icons.unlock} alt="" /> : <span className="icon-placeholder" />)
                    }
                  </button>
                </div>

                <div className="divider" />

                <div className="swatches" role="radiogroup" aria-label="Confidence">
                  {CONF_COLORS.map((c, i) => (
                    <button
                      key={i}
                      className={`swatch ${i === confIdx ? "active" : "inactive"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setConfIdx(i)}
                      role="radio"
                      aria-checked={i === confIdx}
                      title={`Level ${i + 1}`}
                    />
                  ))}
                </div>


              </div>
            </div>
          )}
        </div>
        <div ref={topScrollRef} className='top-scroll2' onScroll={() => syncScroll('top')}>
          <div className='scroll-content' >
          </div>
        </div>
        <div className='scroll2' >
          <div className="scroll-content-buttons">
            <Button variant="contained" size="small" startIcon={<Left />} onClick={test}></Button>
            <Button variant="contained" size="small" startIcon={<Right />}></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextList;
