import { useMemo } from 'react';
import '../style/MatchingTop.css';

/**
 * 期望的数据结构（来自父组件）：
 * data = [
 *   {
 *     a: [ { id: 'A1', confidence: 87 }, { id: 'A2', confidence: 65 } ],  // 子对象1 => n个字典
 *     b: [ { id: 'B1', confidence: 92 }, { id: 'B2', confidence: 55 } ]   // 子对象2 => n个字典
 *   },
 *   ... 共 15 个这样的对象
 * ]
 */

const confidenceColors = {
  1: "#ff3b30", // 浅红
  2: "#ff453a",
  3: "#ff8e8e",
  4: "#ffffff",
  5: "#d4f8d4",
  6: "#34c759",
  7: "#00e676"  // 浅蓝
};


const data = Array.from({ length: 30 }).map((_, i) => {
  const mkArr = (prefix) => {
    const n = 0 + Math.floor(Math.random() * 4); // 1~3 个
    return Array.from({ length: n }).map((__, k) => ({
      id: `${prefix}${i}-${k+1}`,
      confidence: Math.floor(1 + Math.random() * 6), // 50~99
    }));
  };
  return {
    a: mkArr('A'),
    b: mkArr('B'),
  };
});

function MatchingTop() {
  // 把 15 个对象的 2 个子对象摊平成 30 个“单元”（每个单元对应一个 div）
  const cells = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const out = [];
    for (const item of data) {
      // 兼容两种写法：{a:[], b:[]} 或 {children:[[],[]]}
      if (Array.isArray(item?.children) && item.children.length >= 2) {
        out.push(item.children[0], item.children[1]);
      } else {
        out.push(item?.a ?? [], item?.b ?? []);
      }
    }
    // 只取前 30 个（防御式）
    return out.slice(0, 60);
  }, [data]);

  return (
    <div className="matching-top">
      <div className="cells-grid">
        {cells.map((subobj, idx) => (
          <div key={idx} className="cell">
            <div className="cell-inner">
              {(subobj ?? []).map((d, j) => (
                <button
                  key={j}
                  className="square-btn"
                  style={{ background: confidenceColors[d?.confidence] || '#444' }}
                  title={`ID: ${d?.id ?? ''} | Confidence: ${d?.confidence ?? ''}`}
                  onClick={() => {
                    // 这里可触发你需要的交互，比如把选中项回传给父组件
                    // console.log('clicked', idx, d);
                  }}
                >
                </button>
              ))}
            </div>
          </div>
        ))}
        {/* 如果数据不足 30 个，补齐空格子以保持等分布局 */}
        {cells.length < 30 &&
          Array.from({ length: 30 - cells.length }).map((_, k) => (
            <div key={`placeholder-${k}`} className="cell">
              <div className="cell-inner placeholder" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MatchingTop;
