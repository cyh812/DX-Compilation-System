import React, { useState, useEffect, useCallback } from 'react';
import '../style/ImageList.css'; // 如果有同名样式文件，可以保留这一行

/**
 * MyComponent 说明：
 * - 在这里写组件的简要描述
 * - 列出主要 props 及其作用
 */
const ImageChoose = ({ title, children, onAction }) => {
  // —— 1. 状态管理（useState） ——
  const [count, setCount] = useState(0);


  return (
    <div className='P'>
        <div className='P1'></div>
        <div className='P2'></div>
    </div>
  );
};

export default ImageChoose;
