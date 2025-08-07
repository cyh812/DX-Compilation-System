import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/ImageList.css';
import { SvgIcon, Button } from '@mui/material';

import data from '../assets/image_data.json'

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

function Left(props) {
  return (
    <SvgIcon {...props}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11L1 6L6 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17 17V10C17 8.93913 16.5786 7.92172 15.8284 7.17157C15.0783 6.42143 14.0609 6 13 6H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </SvgIcon>
  );
}

function Right(props) {
  return (
    <SvgIcon {...props}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11L17 6L12 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M1 17V10C1 8.93913 1.42143 7.92172 2.17157 7.17157C2.92172 6.42143 3.93913 6 5 6H17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </SvgIcon>
  );
}

const ImageChoose = ({ results, paintings = samplePaintings, spanYears = 2000, baseImageSize = 80, gap = 5 }) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selected, setSelected] = useState(null); //点击查看详情的图片

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
        <div className='scroll' >
          <div className="scroll-content-buttons">
            <Button variant="contained" size="small" startIcon={<Left />} onClick={test}></Button>
            <Button variant="contained" size="small" startIcon={<Right />}></Button>
          </div>
        </div>
        <div ref={topScrollRef} className='top-scroll' onScroll={() => syncScroll('top')}>
          <div className='scroll-content' >
          </div>
        </div>
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
            <div className='info-card' style={{ left: `${selected.x + 10}px`, top: `${selected.y}px` }}>
              <button className='close-btn' onClick={() => setSelected(null)}>×</button>
              <h4>{selected.title}</h4>
              <p>Author: {selected.author}</p>
              <p>Year: {selected.year}</p>
              <p>{selected.description}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImageChoose;
