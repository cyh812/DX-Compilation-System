import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/MatchingLeft.css';
import { SvgIcon, Slider, Input, Button, Box } from '@mui/material';

const MatchingLeft = ({ activeIndex, onIndexChange, leftIcon,
  rightIcon, clipImage, onGenerate
}) => {
  const [seed, setSeed] = useState(42);
  const [strength, setStrength] = useState(3);
  const [count, setCount] = useState(1);

  const [temperature, setTemperature] = useState(1);
  const [maxlength, setMaxlength] = useState(3);
  const [count2, setCount2] = useState(1);

  const [range, setRange] = useState([0.20, 0.80]); // 初始左右两端值
  const [loss, setLoss] = useState(0);

  const handleSliderChange = (_, newValue) => {
    setRange(newValue);
  };

  const handleInputChange = (index, value) => {
    const newRange = [...range];
    newRange[index] = value === "" ? 0 : Number(value);
    setRange(newRange);
  };

  const [text, setText] = useState("测试文字");

  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  function Generate(props) {
    return (
      <SvgIcon {...props}>
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M31.1579 4.75257C31.4077 4.2532 31.6249 3.71947 31.816 3.17888C32.1571 2.20305 32.4025 1.20661 32.5785 0.356772L32.611 0.201006C32.6653 -0.0670021 33.2257 -0.0670021 33.28 0.201006L33.3126 0.356772C33.4864 1.20432 33.734 2.20305 34.075 3.17888C34.2662 3.71947 34.4834 4.25549 34.7332 4.75257C35.059 5.40083 35.437 5.98953 35.8779 6.45453C36.321 6.91954 36.8771 7.32041 37.494 7.66172C37.9653 7.92743 38.4714 8.1565 38.9862 8.35579C39.9093 8.71543 40.8542 8.97656 41.6622 9.16211L41.8078 9.19418C42.0641 9.25144 42.0641 9.84473 41.8078 9.8997L41.6622 9.93406C40.7538 10.138 39.8597 10.4074 38.9862 10.7404C38.4736 10.9397 37.9653 11.1687 37.494 11.4322C36.8792 11.7758 36.321 12.1766 35.8779 12.6416C35.437 13.1066 35.059 13.6953 34.7332 14.3436C34.4834 14.843 34.2662 15.3744 34.075 15.9173C33.7601 16.8385 33.5054 17.7814 33.3126 18.7394L33.28 18.8952C33.2257 19.1632 32.6653 19.1632 32.611 18.8952L32.5785 18.7394C32.3858 17.7814 32.1311 16.8385 31.816 15.9173C31.6298 15.378 31.41 14.8523 31.1579 14.3436C30.858 13.7198 30.4723 13.1463 30.0132 12.6416C29.5348 12.1567 28.9909 11.7491 28.3993 11.4322C27.9169 11.1672 27.4184 10.9361 26.9071 10.7404C26.0336 10.4074 25.1395 10.138 24.231 9.93406L24.0833 9.8997C23.827 9.84473 23.827 9.25144 24.0833 9.19418L24.231 9.16211C25.0347 8.97885 25.9817 8.71543 26.9071 8.35579C27.4197 8.1565 27.9258 7.92743 28.3971 7.66172C29.014 7.31812 29.5701 6.91954 30.0132 6.45453C30.4541 5.98953 30.8342 5.40083 31.1579 4.75257ZM32.3156 8.88493C32.0919 9.12087 31.8551 9.34307 31.6097 9.54923C32.1034 9.96401 32.5514 10.4358 32.9455 10.9557C33.3391 10.4346 33.7872 9.96198 34.2814 9.54694C33.7874 9.13168 33.3393 8.65912 32.9455 8.13818C32.749 8.3993 32.5387 8.64861 32.3156 8.88493ZM13.8527 15.1293C13.1467 17.2092 12.1801 19.2571 10.8769 20.6338C9.57142 22.0082 7.62955 23.0275 5.6551 23.772C4.79277 24.095 3.92392 24.3676 3.09852 24.5943C2.06459 24.8784 1.10018 25.0891 0.305182 25.2426L0.192232 25.2655C-0.0640774 25.3113 -0.0640774 25.8519 0.192232 25.9L0.305182 25.9229C1.10018 26.0764 2.06459 26.2872 3.09852 26.5712C3.92392 26.798 4.79277 27.0683 5.6551 27.3958C7.62955 28.138 9.57142 29.1551 10.8747 30.5341C12.1801 31.9085 13.1467 33.9563 13.8505 36.0362C14.1589 36.9479 14.4152 37.8642 14.6324 38.7324C14.8996 39.825 15.1016 40.8398 15.2472 41.6805L15.2667 41.7973C15.3123 42.0676 15.8249 42.0676 15.8706 41.7973L15.8923 41.6805C16.0356 40.8421 16.2376 39.825 16.507 38.7324C16.7199 37.8619 16.9783 36.9456 17.2868 36.0362C17.9905 33.9563 18.9593 31.9085 20.2626 30.5318C21.5658 29.1574 23.5077 28.138 25.4822 27.3935C26.3445 27.0683 27.2133 26.798 28.0387 26.5689C29.0727 26.2872 30.0371 26.0764 30.8321 25.9229L30.945 25.9C31.2013 25.8542 31.2013 25.3136 30.945 25.2632L30.8321 25.2426C30.0371 25.0891 29.0727 24.8761 28.0387 24.5943C27.2133 24.3676 26.3445 24.095 25.4822 23.7697C23.5077 23.0275 21.5658 22.0082 20.2626 20.6315C18.9593 19.2571 17.9905 17.2092 17.2868 15.1293C16.9783 14.2176 16.722 13.3013 16.5048 12.4309C16.2376 11.3405 16.0356 10.3235 15.8901 9.48509L15.8706 9.36827C15.8249 9.09797 15.3123 9.09797 15.2667 9.36827L15.245 9.48509C15.1016 10.3235 14.8996 11.3405 14.6324 12.4309C14.4152 13.3013 14.1589 14.2176 13.8505 15.1293H13.8527ZM13.1793 23.0619C14.1481 22.0403 14.9322 20.817 15.5686 19.5572C16.2051 20.817 16.9892 22.0403 17.958 23.0619C18.9267 24.0835 20.0866 24.9105 21.2813 25.5816C20.0866 26.2528 18.9267 27.0797 17.958 28.1014C16.9892 29.1253 16.2051 30.3462 15.5686 31.6084C14.9322 30.3485 14.1481 29.123 13.1793 28.1037C12.2105 27.0797 11.0506 26.2528 9.85597 25.5839C11.0506 24.9105 12.2105 24.0835 13.1793 23.0642V23.0619Z" fill="white" />
        </svg>
      </SvgIcon>
    );
  }

  function Sankey(props) {
    return (
      <SvgIcon {...props}>
        <svg width="60" height="52" viewBox="0 0 60 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38.4732 21.9593H55.4146C57.9558 21.9593 59.65 19.4088 59.65 16.8583V5.80609C59.65 3.25558 57.9558 0.705078 55.4146 0.705078H38.4732C37.2026 0.705078 35.932 1.55525 35.0849 2.8305C31.6966 3.68067 30.0025 7.50642 26.6142 15.583C26.6142 16.4332 25.7671 18.5586 24.9201 20.2589C24.073 18.5586 22.8024 17.7084 21.5318 17.7084H4.59034C2.04912 17.7084 0.35498 20.2589 0.35498 22.8094V33.4365C0.35498 36.4121 2.04912 38.9626 4.59034 38.9626H21.5318C24.073 38.9626 25.7671 36.4121 25.7671 33.8616V33.0115C27.0377 34.2867 28.3083 35.9871 29.1554 37.2623C31.2731 39.8128 32.5437 41.5131 34.2378 42.7884V46.1891C34.2378 49.1647 35.932 51.2901 38.4732 51.2901H55.4146C57.9558 51.2901 59.65 48.7396 59.65 46.1891V35.562C59.65 33.0115 57.9558 30.461 55.4146 30.461H38.4732C35.932 30.461 34.2378 33.0115 34.2378 35.562V36.8372C33.8143 35.9871 32.9672 35.562 32.5437 34.7118C31.2731 33.4365 30.0025 31.7362 29.1554 30.461C31.2731 27.9105 32.9672 23.6596 34.6614 18.9837C35.5084 20.684 36.779 21.9593 38.4732 21.9593ZM21.5318 33.8616C21.5318 34.2867 21.5318 34.7118 21.1082 34.7118H5.01387C4.59034 34.7118 4.59034 34.2867 4.59034 33.8616V22.8094C4.59034 22.3844 4.59034 21.9593 5.01387 21.9593H21.5318C21.5318 21.9593 21.5318 22.3844 21.5318 22.8094V33.8616ZM38.4732 35.562C38.4732 35.1369 38.4732 34.7118 38.8967 34.7118H55.4146C55.4146 34.7118 55.8382 35.1369 55.8382 35.562V46.1891C55.8382 46.6142 55.8382 47.0392 55.4146 47.0392H38.8967C38.8967 47.0392 38.4732 46.6142 38.4732 46.1891V35.562ZM38.8967 4.95592H55.4146C55.4146 4.95592 55.4146 5.381 55.4146 5.80609V16.4332C55.4146 17.2834 55.4146 17.7084 54.9911 17.7084H38.4732C38.4732 17.7084 38.4732 17.2834 38.4732 16.8583V10.482V6.23117C38.4732 5.381 38.4732 4.95592 38.8967 4.95592Z" fill="white" />
        </svg>
      </SvgIcon>
    );
  }

  function Diffuse(props) {
    return (
      <SvgIcon {...props}>
        <svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.2472 9.34633C13.1892 8.95467 12.667 8.59199 12.3478 8.35985C12.0287 8.12776 11.3323 8.02621 10.9261 8.09878C10.5199 8.17134 10.1718 8.38889 9.93971 8.70804C7.85075 11.6094 6.71924 15.091 6.73378 18.6596C6.73378 22.2428 7.85075 25.6953 9.93971 28.6112C10.2589 29.0464 10.7811 29.4235 11.3178 29.38C11.8545 29.3365 12.9135 28.8433 13.1312 28.3501C13.3488 27.8568 13.2908 27.2911 12.9861 26.8414C11.2573 24.4593 10.3325 21.5884 10.3459 18.6451C10.3459 15.7003 11.2598 12.8715 12.9861 10.4489C13.2182 10.1442 13.3053 9.738 13.2472 9.34633Z" fill="white" />
          <path d="M4.38362 18.7321C4.38362 12.9875 6.48712 7.4314 10.2879 3.09391C10.6505 2.6877 10.752 2.12197 10.578 1.61421C10.4039 1.1065 9.38844 0.58425 8.8517 0.468205C8.31495 0.366653 7.77821 0.685852 7.41553 1.1065C3.15055 5.96624 0.785978 12.2331 0.771484 18.7321C0.771484 25.2021 3.13606 31.4689 7.43002 36.3722C7.7927 36.7784 8.32944 37.1121 8.86619 37.0105C9.40293 36.9089 10.4039 36.3722 10.5925 35.8645C10.7666 35.3567 10.6505 34.791 10.2879 34.3848C6.48712 30.0473 4.38362 24.4768 4.38362 18.7321ZM34.427 9.40431C34.3689 9.79597 34.4559 10.2022 34.6881 10.5213C36.4288 12.9294 37.3282 15.7727 37.3282 18.7176C37.3282 21.6624 36.3999 24.5203 34.6881 26.9138C34.3834 27.349 34.3254 27.9294 34.543 28.4225C34.7606 28.9158 35.8196 29.3945 36.3563 29.4525C36.8931 29.5106 37.4153 29.1188 37.7344 28.6837C39.8379 25.7533 40.9404 22.3152 40.9404 18.7321C40.9404 15.1635 39.8234 11.6673 37.7345 8.78051C37.5024 8.44687 37.1397 8.22927 36.748 8.17125C36.3563 8.11322 35.66 8.20028 35.3263 8.43237C35.0072 8.64997 34.485 9.0126 34.427 9.40431Z" fill="white" />
          <path d="M37.3865 34.3704C37.0238 34.7766 36.9078 35.3424 37.0819 35.8501C37.2559 36.3578 38.2714 36.88 38.8082 36.9961C39.3449 37.0977 39.8817 36.764 40.2443 36.3578C44.5383 31.4545 46.9029 25.2022 46.9029 18.7177C46.9029 12.2332 44.5383 5.96635 40.2443 1.07757C39.8817 0.671417 39.3449 0.337776 38.8082 0.439278C38.2714 0.54078 37.2705 1.07757 37.0819 1.58528C36.9078 2.09304 37.0238 2.65882 37.372 3.06498C41.1728 7.41701 43.2762 12.9585 43.2762 18.7032C43.2907 24.4769 41.1873 30.0474 37.3865 34.3704ZM23.8373 8.1714C20.0656 8.1714 16.5839 10.1878 14.6981 13.4518C12.8122 16.7158 12.8122 20.7487 14.6981 24.0127C16.5839 27.2767 20.0655 29.2931 23.8372 29.2931C29.669 29.2931 34.3981 24.5639 34.3981 18.7322C34.3981 12.9006 29.669 8.1714 23.8373 8.1714Z" fill="white" />
        </svg>
      </SvgIcon>
    );
  }
  // 点击箭头的逻辑
  const toggleUpArrow = () => {
    setRightActive((prev) => !prev);
  };

  const toggleDownArrow = () => {
    setLeftActive((prev) => !prev);
  };
  useEffect(() => {
    let index = -1;
    if (rightActive && leftActive) {
      index = 2; // 两个都激活
    } else if (rightActive) {
      index = 1; // 只右激活
    } else if (leftActive) {
      index = 0; // 只左激活
    }
    else {
      index = -1;
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

  const sliderSx2 = {
    width: '200px',
    height: 10,
    "& .MuiSlider-rail, & .MuiSlider-track": {
      height: 10,
      borderRadius: 9999,
    },
    // 整条渐变背景
    "& .MuiSlider-rail": {
      position: "relative",
      opacity: 1,
      background:
        "linear-gradient(90deg, #FF3B30 0%, #FFFFFF 50%, #2ecc71 100%)",
    },
    // 左侧灰色遮罩
    "& .MuiSlider-rail::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "calc(var(--min,0) * 100%)",
      background: "#eee",
      borderTopLeftRadius: "inherit",
      borderBottomLeftRadius: "inherit",
      pointerEvents: "none",
    },
    // 右侧灰色遮罩
    "& .MuiSlider-rail::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "calc((1 - var(--max,1)) * 100%)",
      background: "#eee",
      borderTopRightRadius: "inherit",
      borderBottomRightRadius: "inherit",
      pointerEvents: "none",
    },
    "& .MuiSlider-track": {
      background: "transparent",
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
    borderRadius: '5px',
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  };

  const inputSx2 = {
    width: 50,
    height: 32,
    marginLeft: 0,
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: '0 5px',
    borderRadius: '5px',
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  };


  const rowWrap = { marginBottom: 0 };
  const rowWrap2 = { marginTop: 30 };
  const topRow = { display: "flex", alignItems: "center", marginBottom: 0, color: "#fff" };

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


        {/* 图生文 */}
        <div className={`panel-right ${activeIndex === 0 ? 'active' : ''}`}>
          {/* 种子 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Temperature</span>
              <Input
                value={temperature}
                type="number"
                sx={inputSx}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
            </div>

            <Slider
              value={temperature}
              onChange={(_, v) => setTemperature(v)}
              sx={sliderSx}
              min={0}
              max={2}
              step={0.1}
            />
          </div>

          {/* 约束强度 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Max_length</span>
              <Input
                value={maxlength}
                type="number"
                onChange={(e) => setMaxlength(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={maxlength}
              onChange={(_, v) => setMaxlength(v)}
              sx={sliderSx}
              min={0}
              max={128}
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
              startIcon={<Generate />}
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 130,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
              onClick={() => onGenerate("texts", count)}
            >
              Generation
            </Button>
          </Box>
        </div>

        {/* 文生图 */}
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
              max={10000}
            />
          </div>

          {/* 约束强度 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Guidance Scale</span>
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
              max={30}
            />
          </div>

          {/* 生成数量 */}
          <div style={rowWrap}>
            <div style={topRow}>
              <span>Number</span>
              <Input
                value={count2}
                type="number"
                onChange={(e) => setCount2(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={count2}
              onChange={(_, v) => setCount2(v)}
              sx={sliderSx}
              min={0}
              max={5}
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              startIcon={<Generate />}
              variant="contained"
              onClick={() => onGenerate("paintings", count2)}
              sx={{
                backgroundColor: "#535353",
                width: 130,
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
              <Input
                value={range[0]}
                type="number"
                sx={inputSx2}
                onChange={(e) => handleInputChange(0, e.target.value)}
              />
              <span style={{ paddingLeft: '18px' }}>Similarity</span>
              <Input
                value={range[1]}
                type="number"
                sx={inputSx}
                onChange={(e) => handleInputChange(1, e.target.value)}
              />
            </div>

            <Slider
              value={range}
              onChange={handleSliderChange}
              sx={{
                ...sliderSx2,
                "--min": range[0],
                "--max": range[1],
              }}
              min={0}
              max={1}
              step={0.01}
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              startIcon={<Sankey />}
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 130,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
            >
              Matching
            </Button>
          </Box>

          {/* 生成数量 */}
          <div style={rowWrap2}>
            <div style={topRow}>
              <span>Loss</span>
              <Input
                value={loss}
                type="number"
                onChange={(e) => setLoss(Number(e.target.value))}
                sx={inputSx}
              />
            </div>

            <Slider
              value={loss}
              onChange={(_, v) => setLoss(v)}
              sx={sliderSx}
              min={0}
              max={1}
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "10px", paddingTop: "5px" }}>
            <Button
              startIcon={<Diffuse />}
              variant="contained"
              sx={{
                backgroundColor: "#535353",
                width: 130,
                height: 40,
                fontSize: 16,
                textTransform: "none", // 取消全大写
                "&:hover": { backgroundColor: "#777" },
              }}
            >
              Diffuse
            </Button>
          </Box>
        </div>

      </div>
    </div>
  )
}

export default MatchingLeft;
