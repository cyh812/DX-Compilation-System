import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/ImageList copy.css';

// 模拟数据
const samplePaintings = [
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 150, author: 'Artist A' },
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

const ImageChoose = ({ paintings = samplePaintings, spanYears = 2000, baseImageSize = 80, gap = 5 }) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
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

  return (
    <div className='L'>
      <div className='L1' onWheel={handleWheel}>
        <div ref={topScrollRef} className='top-scroll' onScroll={() => syncScroll('top')}>
          <div className='scroll-content' />
        </div>
        <div ref={wrapperRef} className='wrapper' onScroll={() => syncScroll('wrapper')}>
          <div className='timeline-content'>
            {containerWidth > 0 && Object.entries(buckets).sort((a,b) => +a[0] - +b[0]).map(([yearStart, list]) => {
                const leftPx = (yearStart / spanYears) * containerWidth * scale;
                const imgSize = baseImageSize * scale;
                const groupHeight = list.length * imgSize + (list.length - 1) * gap;
                const startY = (containerHeight - groupHeight) / 2;
                return (
                  <div key={yearStart} className='bucket-group' style={{ left: `${leftPx}px` }}>
                    <div className='line' />
                    {list.map((p, i) => (
                      <img
                        key={i}
                        src={p.src}
                        alt={`${p.author}-${p.year}`}
                        className='painting'
                        style={{
                          width: `${imgSize}px`,
                          height: `${imgSize}px`,
                          top: `${startY + i * (imgSize + gap) + imgSize/2}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${p.author} (${p.year})`}
                      />
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className='L2' />
    </div>
  );
};

export default ImageChoose;
