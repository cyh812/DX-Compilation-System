import React, { useState, useRef, useCallback } from 'react';
import '../style/ImageChoose.css';
import D004423 from '../assets/D004423.jpg';

const ImageChoose = ({ src, alt }) => {
  // 缩放比例
  const [scale, setScale] = useState(1);
  // 平移偏移
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // 拖拽状态
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // 滚轮缩放处理
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;             // 向下滚缩小，向上滚放大
    setScale(prev => Math.max(0.1, prev + delta));       // 最小 0.1 倍
  }, []);

  // 鼠标按下开始拖拽
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;  // 只响应左键
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  // 拖拽进行时
  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  // 松开停止拖拽
  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="P">
      <div className="image-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}>
        <img
          src={D004423}
          alt={alt}
          className="image-content"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
          }}
          draggable={false}  // 阻止浏览器默认拖拽
        />
      </div>


      <div className='ButtonGroup'>
        <button>按钮 1</button>
        <button>按钮 2</button>
        <button>按钮 3</button>
        <button>按钮 4</button>
      </div>



      <div className="SliderGroup">
        <div className="sliderRow">
          <label htmlFor="s1">亮度</label>
          <input id="s1" type="range" min="0" max="100" />
        </div>
        <div className="sliderRow">
          <label htmlFor="s2">对比度</label>
          <input id="s2" type="range" min="0" max="100" />
        </div>
      </div>
    </div>
  );
};

export default ImageChoose;

