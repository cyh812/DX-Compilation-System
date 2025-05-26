import React, { useRef, useEffect, useState } from 'react';
import '../style/Matching.css';

const ImageChoose = ({
  color = '#69b3a2',   // 曲线颜色
  thickness = 10        // 曲线粗细
}) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 测量 M2 大小
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

  // 起点：上边中点
  const x0 = width / 2;
  const y0 = 0;
  // 终点：下边“1/4”处（距离底部 1/4*height）
  const x1 = width * 3 / 4;
  const y1 = height * 1;

  // 控制点：你可以调这两个来改变曲率
  const cx1 = x0;
  const cy1 = height * 0.25;
  const cx2 = x1;
  const cy2 = height * 0.5;

  // 三次贝塞尔路径
  const pathD = `M ${x0},${y0}
                 C ${cx1},${cy1}
                   ${cx2},${cy2}
                   ${x1},${y1}`;

  return (
    <div className="M">
      <div className="M1">{/* 侧边 UI */}</div>

      <div
        className="M2"
        ref={containerRef}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none'
            }}
          >
            <path
              d={pathD}
              stroke={color}
              strokeWidth={thickness}
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageChoose;
