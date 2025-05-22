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

  // —— 2. 副作用（useEffect） ——
  // 组件挂载后打印一次
  useEffect(() => {
    console.log('MyComponent mounted');
    return () => {
      console.log('MyComponent unmounted');
    };
  }, []);

  // —— 3. 事件处理函数 ——  
  const handleClick = () => {
    // 更新本地状态
    setCount(prev => prev + 1);
    // 如果父组件传了回调，就通知一下
    if (onAction) onAction(count + 1);
  };

  // —— 4. useCallback 优化 ——  
  // 如果有复杂计算或要传给子组件，在依赖不变时保持引用稳定
  const computeMessage = useCallback(() => {
    return `当前计数：${count}`;
  }, [count]);

  // —— 5. 组件内部其他普通函数 ——  
  const helper = (text) => {
    return text.trim().toUpperCase();
  };

  return (
    <div className='P'>
        <div className='P1'></div>
        <div className='P2'></div>
    </div>
  );
};

export default ImageChoose;
