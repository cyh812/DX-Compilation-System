import React, { useState, useEffect, useCallback } from 'react';
import '../style/MatchingLeft.css'; // 如果有同名样式文件，可以保留这一行
import { SvgIcon, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

const MatchingLeft = ({ activeIndex, onIndexChange }) => {
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
                height: '20px',
                backgroundColor: activeIndex === idx ? 'black' : 'initial',
                color: activeIndex === idx ? 'white' : 'inherit',
              }}
            />
          ))}
        </div>

        {/* 右侧内部面板 */}
        <div className="内容区域">
          <div className={`panel ${activeIndex === 0 ? 'active' : ''}`}>
            {/* 面板 1 内部内容 */}
          </div>
          <div className={`panel ${activeIndex === 1 ? 'active' : ''}`}>
            {/* 面板 2 内部内容 */}
          </div>
          <div className={`panel ${activeIndex === 2 ? 'active' : ''}`}>
            {/* 面板 3 内部内容 */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchingLeft;
