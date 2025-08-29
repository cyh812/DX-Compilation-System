import React, { useState, useEffect, useRef } from 'react';
import '../style/Texts.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Texts = ({ number, trigger }) => {
  const prevTrigger = useRef(trigger);
  const textContents = [
    '建孝陵神功圣德碑，已着力刻画朱元璋“非凡”的外貌。碑文写其“威仪天表，望之如神”。',
    '龙鬣长郁，奇骨隐起，朱元璋形象中隐含了强烈的符号性和神性化描写，颇具神秘色彩。', 
    '碑文多次提及其面貌“异于常人”，甚至提及“磊牙”与“龙颜”，强调其天命正统地位。', 
    '文字塑造的皇帝形象往往带有艺术加工，结合神话、图腾、预兆等元素丰富其历史叙事。', 
    '这些描述并非客观写实，而是一种权力的视觉建构，古代帝王往往以神性面貌展现权威。'
  ];

  const [visibleTexts, setVisibleTexts] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (prevTrigger.current === trigger) return;
    prevTrigger.current = trigger;

    console.log("生成文本:", number);

    setHasGenerated(true);
    setVisibleTexts([]);
    setLoadingIndex(0);
  }, [trigger, number]);

  // 逐条显示逻辑
  useEffect(() => {
    if (loadingIndex === null) return;
    if (loadingIndex >= number) {
      setLoadingIndex(null);
      return;
    }

    const delay = Math.floor(Math.random() * 5000) + 1000; // 1~5秒
    const timer = setTimeout(() => {
      setVisibleTexts((prev) => [...prev, loadingIndex]);
      setLoadingIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [loadingIndex, number]);

  const handleClick = (index) => {
    console.log(`Clicked text box ${index}`);
  };

  return (
    <div className='Texts'>
      <div className="texts-container">
        {hasGenerated &&
          Array.from({ length: number }).map((_, index) => (
            <div
              key={index}
              className="text-wrapper"
              onClick={() => handleClick(index)}
            >
              {visibleTexts.includes(index) ? (
                <>
                  <div className="text-content">{textContents[index % textContents.length]}</div>
                  <div className="overlay">
                    <span>发送到文字匹配</span>
                  </div>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%"
                  }}
                >
                  {/* 自定义颜色和粗细 */}
                  <CircularProgress sx={{ color: "#00C1CD" }} thickness={6} />
                </Box>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Texts;
