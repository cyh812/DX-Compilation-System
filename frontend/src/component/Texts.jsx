import React from 'react';
import '../style/Texts.css';

const Texts = () => {
  const textContents = [
    '建孝陵神功圣德碑，已着力刻画朱元璋“非凡”的外貌。碑文写其“威仪天表，望之如神”。',
    '龙鬣长郁，奇骨隐起，朱元璋形象中隐含了强烈的符号性和神性化描写，颇具神秘色彩。',
    '碑文多次提及其面貌“异于常人”，甚至提及“磊牙”与“龙颜”，强调其天命正统地位。',
    '文字塑造的皇帝形象往往带有艺术加工，结合神话、图腾、预兆等元素丰富其历史叙事。',
    '这些描述并非客观写实，而是一种权力的视觉建构，古代帝王往往以神性面貌展现权威。'
  ];

  const handleClick = (index) => {
    console.log(`Clicked text box ${index}`);
  };

  return (
    <div className='Texts'>
      <div className="texts-container">
        {textContents.map((text, index) => (
          <div
            key={index}
            className="text-wrapper"
            onClick={() => handleClick(index)}
          >
            <div className="text-content">{text}</div>
            <div className="overlay">
              <span>发送到文字匹配</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Texts;
