import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/MatchingLeft.css'; // 如果有同名样式文件，可以保留这一行
import { SvgIcon, Slider, Input, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import upArrowIcon from '../assets/rightarrow.svg'
import imgSrc from '../assets/D004423.jpg'

const MatchingLeft = ({ activeIndex, onIndexChange, leftIcon,
  rightIcon,clipImage 
}) => {
  const [seed, setSeed] = useState(56);
  const [count, setCount] = useState(56);
  const [strength, setStrength] = useState(50);

  const [text, setText] = useState("测试文字");

  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  // 点击箭头的逻辑
  const toggleUpArrow = () => {
    setRightActive((prev) => !prev);
  };

  const toggleDownArrow = () => {
    setLeftActive((prev) => !prev);
  };
  useEffect(() => {
    let index = 0;
    if (rightActive && leftActive) {
      index = 2; // 两个都激活
    } else if (rightActive) {
      index = 1; // 只右激活
    } else if (leftActive) {
      index = 0; // 只左激活
    }
    onIndexChange(index);
    activeIndex = index;
  }, [rightActive, leftActive, onIndexChange]);


  // 四个红绿按钮之间的连边
  const [selectedCircles, setSelectedCircles] = useState([]); // 存储已点击的圆
  const [edges, setEdges] = useState([]); // 存储连边
  const circleRefs = useRef({}); // 存储圆形DOM引用

  // 用对象存储每个红绿按钮的激活状态
  const [activeButtons, setActiveButtons] = useState({
    btn1: false,
    btn2: false,
    btn3: false,
    btn4: false,
  });

  // 点击切换状态
  const toggleButton = (id) => {
    setActiveButtons((prev) => ({
      ...prev,
      [id]: !prev[id], // 单独切换对应按钮
    }));
  };

  // 点击圆形按钮
  const handleCircleClick = (id) => {
    setSelectedCircles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id);
      } else if (prev.length === 2) {
        return [id]; // 超过2个则只保留当前
      } else {
        return [...prev, id];
      }
    });
  };

  // 监听已选圆变化
  useEffect(() => {
    if (selectedCircles.length === 2) {
      const [a, b] = selectedCircles;
      const key1 = `${a}-${b}`;
      const key2 = `${b}-${a}`;
      setEdges((prev) => {
        // 如果已有边 → 删除
        if (prev.some((edge) => edge.key === key1 || edge.key === key2)) {
          return prev.filter(
            (edge) => edge.key !== key1 && edge.key !== key2
          );
        }
        // 否则添加新边
        return [...prev, { key: key1, from: a, to: b }];
      });
      setSelectedCircles([]); // 清空选择
    }
  }, [selectedCircles]);

  // 获取圆的中心坐标
  const getCircleCenter = (id) => {
    const el = circleRefs.current[id];
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY
    };
  };

  // 定义圆的 ID
  const circles = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ];

  // 根据左右激活状态切换内容
  const renderContent = () => {
    if (leftActive && rightActive) {
      return <div className="content-both">        {/* SVG 层绘制连边 */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {edges.map((edge) => {
            const fromPos = getCircleCenter(edge.from);
            const toPos = getCircleCenter(edge.to);
            return (
              <line
                key={edge.key}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="white"
                strokeWidth="4"
              />
            );
          })}
        </svg>

        <div className="button-row">
          <button id="btn1"
            className={`btn-green ${activeButtons.btn1 ? "active" : ""}`}
            onClick={() => toggleButton("btn1")}></button>
          <button id="btn2"
            className={`btn-red ${activeButtons.btn2 ? "active" : ""}`}
            onClick={() => toggleButton("btn2")}></button>
          <button
            className="btn-circle circle-below left-circle"
            ref={(el) => (circleRefs.current["top-left"] = el)}
            onClick={() => handleCircleClick("top-left")}
          />
          <button
            className="btn-circle circle-below right-circle"
            ref={(el) => (circleRefs.current["top-right"] = el)}
            onClick={() => handleCircleClick("top-right")}
          />
        </div>

        <div className="button-row">
          <button id="btn3"
            className={`btn-green ${activeButtons.btn3 ? "active" : ""}`}
            onClick={() => toggleButton("btn3")}></button>
          <button id="btn4"
            className={`btn-red ${activeButtons.btn4 ? "active" : ""}`}
            onClick={() => toggleButton("btn4")}></button>
          <button
            className="btn-circle circle-above left-circle"
            ref={(el) => (circleRefs.current["bottom-left"] = el)}
            onClick={() => handleCircleClick("bottom-left")}
          />
          <button
            className="btn-circle circle-above right-circle"
            ref={(el) => (circleRefs.current["bottom-right"] = el)}
            onClick={() => handleCircleClick("bottom-right")}
          />
        </div></div>;
    }
    if (leftActive) {
      return <div className="content-left">
        <div className='content-left-box'>
           <img className="fit-img" src={clipImage} alt="" />
        </div>
      </div>;
    }
    if (rightActive) {
      return <div className="content-right">
        <div className='content-right-box'>
          {text}
        </div>
      </div>;
    }
    return <div className="content-empty"></div>;
  };

  const sliderSx = {
    width: '200px',
    height: 10,
    "& .MuiSlider-rail": {
      backgroundColor: "#fff",
      opacity: 1,
    },
    "& .MuiSlider-track": {
      backgroundColor: "#00C1CD",
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#00C1CD",
      "&:hover, &.Mui-focusVisible": {
        boxShadow: "0px 0px 0px 8px rgba(0, 193, 205, 0.16)",
      },
    },
  };

  const inputSx = {
    width: 50,
    height: 32,
    marginLeft: "auto",
    marginRight: 1,
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: '0 5px',
    borderRadius: '5px'
  };


  const rowWrap = { marginBottom: 0 };
  const topRow = { display: "flex", alignItems: "center", marginBottom: 0, color: "#fff" };
  const label = { flex: 1 };

  return (
    <div className="M1">
      <div className="Title">Matching View</div>
      <div className="content">
        <div className='panel-left'>

          <div className="tab-bar">
            {/* 左标签 */}
            <div
              className={`tab left-tab ${leftActive ? "active" : ""}`}
              onClick={() => setLeftActive(!leftActive)}
            >
              {leftIcon && <img src={leftIcon} alt="left" />}
            </div>

            {/* 中间上下箭头 */}
            <div className="tab center-tab">
              <button
                className="arrow-btn"
                onClick={toggleUpArrow}
              >
                <svg
                  width="43"
                  height="16"
                  viewBox="0 0 43 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 15L20 1.5V9H42V15H2Z"
                    fill={rightActive ? "rgba(0,255,255,1)" : "rgba(0,255,255,0.6)"}   // ← 颜色绑定到状态
                  />
                </svg>
              </button>
              <button
                className="arrow-btn"
                onClick={toggleDownArrow}
              >
                <svg
                  width="43"
                  height="15"
                  viewBox="0 0 43 15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M41 0.5L23 14V6.5L1 6.5V0.5L41 0.5Z"
                    fill={leftActive ? "rgba(0,255,255,1)" : "rgba(0,255,255,0.6)"}   // ← 颜色绑定到状态
                  />
                </svg>

              </button>
            </div>

            {/* 右标签 */}
            <div
              className={`tab right-tab ${rightActive ? "active" : ""}`}
              onClick={() => setRightActive(!rightActive)}
            >
              {rightIcon && <img src={rightIcon} alt="right" />}
            </div>
          </div>

          {/* 下方内容区 */}
          <div className="panel-area">{renderContent()}</div>
        </div>
        <div className={`panel-right ${activeIndex === 0 ? 'active' : ''}`}>
          {/* 种子 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Seed</span>
              <Input
                value={seed}
                type="number"
                sx={inputSx}
                onChange={(e) => setSeed(Number(e.target.value))}
              />
            </div>

            <Slider
              value={seed}
              onChange={(_, v) => setSeed(v)}
              sx={sliderSx}
              min={0}
              max={100}
            />
          </div>



          {/* 生成数量 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Number</span>
              <Input
                value={count}
                type="number"
                onChange={(e) => setCount(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={count}
              onChange={(_, v) => setCount(v)}
              sx={sliderSx}
              min={0}
              max={5}
            />
          </div>


          {/* 约束强度 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Constraint</span>
              <Input
                value={strength}
                type="number"
                onChange={(e) => setStrength(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={strength}
              onChange={(_, v) => setStrength(v)}
              sx={sliderSx}
              min={0}
              max={100}
            />
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 115,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
            >
              Generation
            </Button>
          </Box>
        </div>

        <div className={`panel-right ${activeIndex === 1 ? 'active' : ''}`}>
          {/* 种子 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Seed</span>
              <Input
                value={seed}
                type="number"
                sx={inputSx}
                onChange={(e) => setSeed(Number(e.target.value))}
              />
            </div>

            <Slider
              value={seed}
              onChange={(_, v) => setSeed(v)}
              sx={sliderSx}
              min={0}
              max={100}
            />
          </div>



          {/* 生成数量 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Number</span>
              <Input
                value={count}
                type="number"
                onChange={(e) => setCount(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={count}
              onChange={(_, v) => setCount(v)}
              sx={sliderSx}
              min={0}
              max={5}
            />
          </div>


          {/* 约束强度 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Constraint</span>
              <Input
                value={strength}
                type="number"
                onChange={(e) => setStrength(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={strength}
              onChange={(_, v) => setStrength(v)}
              sx={sliderSx}
              min={0}
              max={100}
            />
          </div>
          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 115,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
            >
              Generation
            </Button>
          </Box>
        </div>

        <div className={`panel-right ${activeIndex === 2 ? 'active' : ''}`}>
          {/* 种子 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Seed</span>
              <Input
                value={seed}
                type="number"
                sx={inputSx}
                onChange={(e) => setSeed(Number(e.target.value))}
              />
            </div>

            <Slider
              value={seed}
              onChange={(_, v) => setSeed(v)}
              sx={sliderSx}
              min={0}
              max={100}
            />
          </div>



          {/* 生成数量 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Number</span>
              <Input
                value={count}
                type="number"
                onChange={(e) => setCount(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={count}
              onChange={(_, v) => setCount(v)}
              sx={sliderSx}
              min={0}
              max={5}
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 115,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
            >
              Generation
            </Button>
          </Box>
        </div>

      </div>
    </div>
  )
}

export default MatchingLeft;
