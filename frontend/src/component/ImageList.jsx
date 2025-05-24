import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../style/ImageList.css';

// 模拟数据
const samplePaintings = [
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 150, author: 'Artist A' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 800, author: 'Artist B' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1200, author: 'Artist C' },
  { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', year: 1800, author: 'Artist D' },
];

const ImageChoose = ({ paintings = samplePaintings, spanYears = 2000, baseImageSize = 80 }) => {
  const wrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  // 百分比映射
  const calcLeftPercentage = (year) => Math.min(100, Math.max(0, (year / spanYears) * 100));

  // 缩放事件：scale 范围 [1,5]
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY / 1000;
    setScale((s) => Math.min(5, Math.max(1, s + delta)));
  }, []);

  // 同步滚动
  const syncScroll = (source) => {
    const src = source === 'wrapper' ? wrapperRef.current : topScrollRef.current;
    const target = source === 'wrapper' ? topScrollRef.current : wrapperRef.current;
    if (src && target) target.scrollLeft = src.scrollLeft;
  };

  // 更新容器与内容宽度
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const topScroll = topScrollRef.current;
    if (wrapper && topScroll) {
      const cw = wrapper.clientWidth;
      setContainerWidth(cw);
      const contentWidth = cw * scale;
      const content = wrapper.querySelector('.timeline-content');
      const scrollContent = topScroll.querySelector('.scroll-content');
      if (content) content.style.width = `${contentWidth}px`;
      if (scrollContent) scrollContent.style.width = `${contentWidth}px`;
    }
  }, [scale, paintings]);

  return (
    <div className='L'>
      <div className='L1' onWheel={handleWheel}>
        {/* 顶部悬浮滚动条 */}
        <div ref={topScrollRef} className='top-scroll' onScroll={() => syncScroll('top')}>
          <div className='scroll-content' />
        </div>
        {/* 主内容区，隐藏滚动条 */}
        <div ref={wrapperRef} className='wrapper' onScroll={() => syncScroll('wrapper')}>
          <div className='timeline-content'>
            {containerWidth > 0 && paintings.map((p, idx) => {
              const pct = calcLeftPercentage(p.year) / 100;
              const leftPx = pct * containerWidth * scale;
              const imgSize = baseImageSize * scale;
              return (
                <div key={idx} className='timeline-item' style={{ left: `${leftPx}px` }}>
                  <div className='line' />
                  <img
                    src={p.src}
                    alt={`${p.author} - ${p.year}`}
                    className='painting'
                    style={{ width: `${imgSize}px`, height: `${imgSize}px` }}
                    title={`${p.author} (${p.year})`}
                  />
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
