import React, { useState, useEffect, useCallback } from 'react';
import '../style/MatchingLeft.css'; // 如果有同名样式文件，可以保留这一行
import { SvgIcon, Slider, Input, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const MatchingLeft = ({ activeIndex, onIndexChange }) => {
  const [seed, setSeed] = useState(56);
  const [count, setCount] = useState(56);
  const [strength, setStrength] = useState(50);

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
      <div className="主要内容">
        {/* 左侧按钮 */}
        <div className="切换按钮组">
          {[0, 1, 2].map((idx) => (
            <Button
              key={idx}
              variant="contained"
              disableRipple
              disableFocusRipple
              onClick={() => onIndexChange(idx)}
              sx={{
                borderRadius: 0,
                minWidth: 0,
                padding: 0,
                width: '20px',
                height: '40px',
                backgroundColor: activeIndex === idx ? 'black' : 'initial',
                color: activeIndex === idx ? 'white' : 'inherit',
              }}
            />
          ))}
        </div>

        {/* 右侧内部面板 */}
        <div className="内容区域">
          <div className={`panel ${activeIndex === 0 ? 'active' : ''}`}>
            <div className='panel-left'>

            </div>
            <div className='panel-right'>
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

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#888",
                  width: "60%",
                  height: 48,
                  fontSize: 16,
                  mt: 1.5,
                  "&:hover": { backgroundColor: "#777" },
                }}
              >
                Generation
              </Button>

            </div>
          </div>
          <div className={`panel ${activeIndex === 1 ? 'active' : ''}`}>
            <div className='panel-left'>

            </div>
            <div className='panel-right'>

            </div>
          </div>
          <div className={`panel ${activeIndex === 2 ? 'active' : ''}`}>
            <div className='panel-left'>

            </div>
            <div className='panel-right'>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchingLeft;
