import React, { useState, useEffect, useCallback } from 'react';
import '../style/TextChoose.css'; // 如果有同名样式文件，可以保留这一行
import { SvgIcon, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

/**
 * MyComponent 说明：
 * - 在这里写组件的简要描述
 * - 列出主要 props 及其作用
 */
const TextChoose = ({ title, children, onAction }) => {
    // —— 1. 状态管理（useState） ——
    const [count, setCount] = useState(0);
    const [value, setValue] = React.useState(30);

    // groupActive=false 表示“关闭”状态，按钮半透明且不可点
    const [groupActive, setGroupActive] = useState(false);
    // 每个按钮的独立 on/off 状态，初始都 false
    const [buttonStates, setButtonStates] = useState(Array(5).fill(false));

    // 五个按钮的基础色
    const baseColors = [
        '#E57373',  // 红
        '#81C784',  // 绿
        '#64B5F6',  // 蓝
        '#FFD54F',  // 黄
        '#BA68C8'   // 紫
    ];

    // 点击 Extract：
    // 切换 groupActive，并且根据新的 groupActive 批量设置所有小按钮状态
    const handleExtractClick = () => {
        const next = !groupActive;
        setGroupActive(next);
        setButtonStates(Array(5).fill(next));
    };

    // 单个小按钮点击时，只在 groupActive 时生效，翻转对应索引状态
    const handleSmallBtnClick = idx => {
        if (!groupActive) return;
        setButtonStates(prev => {
            const copy = [...prev];
            copy[idx] = !copy[idx];
            return copy;
        });
    };

    function Cut(props) {
        return (
            <SvgIcon {...props}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.26487 2.52462V6.98993C8.26439 7.41274 8.09488 7.81809 7.79351 8.11706C7.49215 8.41603 7.08355 8.5842 6.65736 8.58468H2.15634C1.73015 8.5842 1.32155 8.41603 1.02019 8.11706C0.718823 7.81809 0.549307 7.41274 0.548828 6.98993V2.52462C0.549307 2.10181 0.718823 1.69646 1.02019 1.39749C1.32155 1.09852 1.73015 0.930345 2.15634 0.929871H6.65736C7.08355 0.930345 7.49215 1.09852 7.79351 1.39749C8.09488 1.69646 8.26439 2.10181 8.26487 2.52462ZM22.7324 8.58468H27.2335C27.6597 8.5842 28.0683 8.41603 28.3696 8.11706C28.671 7.81809 28.8405 7.41274 28.841 6.98993V2.52462C28.8405 2.10181 28.671 1.69646 28.3696 1.39749C28.0683 1.09852 27.6597 0.930345 27.2335 0.929871H22.7324C22.3063 0.930345 21.8977 1.09852 21.5963 1.39749C21.2949 1.69646 21.1254 2.10181 21.1249 2.52462V6.98993C21.1254 7.41274 21.2949 7.81809 21.5963 8.11706C21.8977 8.41603 22.3063 8.5842 22.7324 8.58468ZM6.65736 11.1363H2.15634C1.73015 11.1368 1.32155 11.3049 1.02019 11.6039C0.718823 11.9029 0.549307 12.3082 0.548828 12.731V17.1963C0.549307 17.6191 0.718823 18.0245 1.02019 18.3235C1.32155 18.6224 1.73015 18.7906 2.15634 18.7911H6.65736C7.08355 18.7906 7.49215 18.6224 7.79351 18.3235C8.09488 18.0245 8.26439 17.6191 8.26487 17.1963V12.731C8.26439 12.3082 8.09488 11.9029 7.79351 11.6039C7.49215 11.3049 7.08355 11.1368 6.65736 11.1363ZM11.1656 2.95959L17.5884 6.63848C17.6862 6.69448 17.7971 6.72395 17.91 6.72395C18.0228 6.72394 18.1337 6.69445 18.2315 6.63845C18.3292 6.58244 18.4104 6.5019 18.4668 6.4049C18.5233 6.30791 18.5529 6.19789 18.5529 6.0859V2.52462C18.5524 2.10181 18.3829 1.69646 18.0816 1.39749C17.7802 1.09852 17.3716 0.930345 16.9454 0.929871H12.4444C12.0521 0.930085 11.6735 1.07248 11.3797 1.33027C11.0859 1.58806 10.8971 1.94348 10.8489 2.32966C10.8336 2.4539 10.8555 2.57987 10.9118 2.69188C10.9681 2.8039 11.0564 2.897 11.1656 2.95959ZM6.65736 21.3427H2.15634C1.73015 21.3432 1.32155 21.5113 1.02019 21.8103C0.718823 22.1093 0.549307 22.5146 0.548828 22.9374V27.4027C0.549307 27.8256 0.718823 28.2309 1.02019 28.5299C1.32155 28.8289 1.73015 28.997 2.15634 28.9975H6.65736C7.08355 28.997 7.49215 28.8289 7.79351 28.5299C8.09488 28.2309 8.26439 27.8256 8.26487 27.4027V22.9374C8.26439 22.5146 8.09488 22.1093 7.79351 21.8103C7.49215 21.5113 7.08355 21.3432 6.65736 21.3427ZM29.6208 15.0492L14.5856 6.43755L11.8142 4.85017C11.5128 4.67734 11.255 4.78738 11.1584 4.84279C11.0606 4.89878 10.9795 4.97929 10.923 5.07626C10.8666 5.17322 10.8369 5.28321 10.8369 5.39518V25.808C10.8369 25.9331 10.8739 26.0554 10.9434 26.1598C11.0129 26.2641 11.1119 26.3459 11.2278 26.3949C11.3438 26.444 11.4718 26.4581 11.5958 26.4355C11.7198 26.413 11.8344 26.3547 11.9254 26.2681L16.5871 21.8251L20.5169 28.5777C20.73 28.9439 21.0811 29.2111 21.4928 29.3206C21.9045 29.4301 22.3432 29.3729 22.7124 29.1616L26.6106 26.9289C26.7934 26.8242 26.9537 26.6848 27.0822 26.5186C27.2108 26.3525 27.3051 26.1628 27.3597 25.9605C27.4144 25.7582 27.4283 25.5472 27.4008 25.3396C27.3732 25.1319 27.3047 24.9317 27.1991 24.7503L23.269 17.9977L29.478 16.2144C29.5991 16.1796 29.7072 16.1102 29.7889 16.015C29.8706 15.9197 29.9222 15.8027 29.9374 15.6786C29.9526 15.5544 29.9307 15.4285 29.8744 15.3166C29.8181 15.2047 29.7298 15.1117 29.6206 15.0492H29.6208Z" fill="black" />
                </svg>
            </SvgIcon>
        );
    }

    function Online(props) {
        return (
            <SvgIcon {...props}>
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 1H17.5C18.0304 1 18.5391 1.21071 18.9142 1.58579C19.2893 1.96086 19.5 2.46957 19.5 3V17C19.5 17.5304 19.2893 18.0391 18.9142 18.4142C18.5391 18.7893 18.0304 19 17.5 19H10.5M10.5 1H3.5C2.96957 1 2.46086 1.21071 2.08579 1.58579C1.71071 1.96086 1.5 2.46957 1.5 3V17C1.5 17.5304 1.71071 18.0391 2.08579 18.4142C2.46086 18.7893 2.96957 19 3.5 19H10.5M10.5 1V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </SvgIcon>
        );
    }

    function Literature(props) {
        return (
            <SvgIcon {...props}>
                <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.25 1H7.25C8.31087 1 9.32828 1.42143 10.0784 2.17157C10.8286 2.92172 11.25 3.93913 11.25 5V19C11.25 18.2044 10.9339 17.4413 10.3713 16.8787C9.80871 16.3161 9.04565 16 8.25 16H1.25V1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.25 1H15.25C14.1891 1 13.1717 1.42143 12.4216 2.17157C11.6714 2.92172 11.25 3.93913 11.25 5V19C11.25 18.2044 11.5661 17.4413 12.1287 16.8787C12.6913 16.3161 13.4544 16 14.25 16H21.25V1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </SvgIcon>
        );
    }

    function Search(props) {
        return (
            <SvgIcon {...props}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.2098 20.6141C8.93989 20.6141 5.47197 17.1583 5.47197 12.9027C5.47197 8.64594 8.93989 5.19013 13.2098 5.19013C16.6368 5.19013 19.5461 7.41473 20.5627 10.4922C20.8127 11.25 20.9487 12.0608 20.9487 12.9027C20.9487 17.1583 17.4808 20.6141 13.2098 20.6141ZM33.9012 30.7735C33.7994 30.4206 33.6136 30.1076 33.3691 29.8366C30.8525 27.2359 28.2873 24.6794 25.6777 22.1716C25.5527 22.0588 25.4211 21.957 25.2762 21.8718C24.9344 21.6716 24.5538 21.5698 24.16 21.5521L24.0063 21.5566L23.1091 20.6705L22.9676 20.5333C24.6257 18.4315 25.6147 15.781 25.6147 12.9027C25.6147 6.07842 20.0572 0.539612 13.2098 0.539612C6.36356 0.539612 0.804932 6.07842 0.804932 12.9027C0.804932 19.7258 6.36356 25.2646 13.2098 25.2646C16.0395 25.2646 18.649 24.3188 20.7386 22.7247L20.8912 22.8807L21.7784 23.7734L21.7751 23.8442C21.774 24.0677 21.8038 24.29 21.8658 24.5046C21.9676 24.8564 22.1523 25.1695 22.3968 25.4405C24.9145 28.0423 27.4786 30.5976 30.0881 33.1065C30.3404 33.3311 30.6257 33.5059 30.9488 33.611C31.2408 33.7061 31.5516 33.7426 31.8581 33.7183C32.1368 33.695 32.4111 33.622 32.6634 33.5026C33.4587 33.1276 33.9831 32.3101 33.9908 31.4328C33.993 31.2105 33.962 30.987 33.9012 30.7735Z" fill="black" />
                </svg>
            </SvgIcon>
        );
    }

    // 受控状态
    const [checkedKvalue, setCheckedKvalue] = useState(false);
    const [checkedSimilar, setCheckedSimilar] = useState(false);

    // Checkbox 切换
    const handleCheckKvalue = (event) => {
        const next = event.target.checked;
        setCheckedKvalue(next);
    };

    const handleCheckSimilar = (event) => {
        const next = event.target.checked;
        setCheckedSimilar(next);
    };

    return (
        <div className='P1'>
            <div className='Title'>Text View</div>
            <div className='T1'>
                <TextField
                    fullWidth
                    multiline            // 启用多行，这样超出高度会滚动
                    rows={4}             // 默认显示行数
                    variant="outlined"
                    label="Outlined"
                    sx={{
                        // 1. 整体背景色
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#1C1C1C',
                            border: '1px solid #1976D2',
                            // 2. 自定义高度 (控制输入区域总高度)
                            height: 130,
                        },
                        // 3. 文本输入区超出时显示滚动条
                        '& .MuiOutlinedInput-input': {
                            height: '100%',
                            overflow: 'auto',
                            color: 'white'
                        },
                    }}
                />
            </div>

            <div className='ButtonGroup2'>
                <Button
                    variant="contained"
                    startIcon={<Online />}
                    onClick={handleExtractClick}
                >
                    NER
                </Button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '3px',
                    marginRight: '5px'
                }}>
                    {buttonStates.map((active, i) => (
                        <button
                            key={i}
                            onClick={() => handleSmallBtnClick(i)}
                            disabled={!groupActive}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: '30px',
                                marginRight: 10,
                                border: 'none',
                                cursor: groupActive ? 'pointer' : 'not-allowed',
                                backgroundColor: baseColors[i],
                                opacity: active ? 1 : 0.3
                            }}
                        />
                    ))}
                </div>
                <Button
                    variant="contained"
                    startIcon={<Literature />}
                >
                    Store
                </Button>
            </div>
            <div className='BottomGroup2'>
                <div className='search'>
                    <FormControlLabel control={<Checkbox
                        checked={checkedKvalue}
                        onChange={handleCheckKvalue}
                        sx={{
                            color: '#fff',
                            '&.Mui-checked': {
                                color: '#00C1CD',
                            },
                        }}
                    />}
                        label="K-value"
                        sx={{
                            marginLeft: '1px',
                            '& .MuiFormControlLabel-label': {
                                marginLeft: '0px',
                                color: 'white',
                            },
                        }} />
                    <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" disabled={!checkedKvalue} sx={{
                        width: '200px',
                        height: 10,
                        marginLeft: '10px',
                        '& .MuiSlider-rail': {
                            backgroundColor: '#fff',
                            opacity: 1,           // 默认为 0.38
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: '#00C1CD',
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#00C1CD',
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0px 0px 0px 8px rgba(0, 193, 205, 0.16)',
                            },
                        },
                        '&.Mui-disabled': {
                            // rail 半透明
                            '& .MuiSlider-rail': {
                                backgroundColor: '#fff',
                                opacity: 0.38,
                            },
                            // track 和 thumb 用 theme.palette.action.disabled
                            '& .MuiSlider-track': {
                                backgroundColor: (theme) => theme.palette.action.disabled,
                            },
                            '& .MuiSlider-thumb': {
                                backgroundColor: 'grey',
                                color: (theme) => theme.palette.action.disabled,
                            },
                        },
                    }} />
                    <Button variant="contained" startIcon={<Search />}>
                        Retrieval
                    </Button>
                </div>
                <div className='search'>
                    <FormControlLabel control={<Checkbox
                        checked={checkedSimilar}
                        onChange={handleCheckSimilar}
                        sx={{
                            color: '#fff',
                            '&.Mui-checked': {
                                color: '#00C1CD',
                            },
                        }} />}
                        label="Similarity"
                        sx={{
                            marginLeft: '1px',
                            '& .MuiFormControlLabel-label': {
                                marginLeft: '0px',
                                color: 'white',
                            },
                        }} />
                    <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" disabled={!checkedSimilar} sx={{
                        width: '200px',
                        height: 10,
                        '& .MuiSlider-rail': {
                            backgroundColor: '#fff',
                            opacity: 1,           // 默认为 0.38
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: '#00C1CD',
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#00C1CD',
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0px 0px 0px 8px rgba(0, 193, 205, 0.16)',
                            },
                        },
                        '&.Mui-disabled': {
                            // rail 半透明
                            '& .MuiSlider-rail': {
                                backgroundColor: '#fff',
                                opacity: 0.38,
                            },
                            // track 和 thumb 用 theme.palette.action.disabled
                            '& .MuiSlider-track': {
                                backgroundColor: (theme) => theme.palette.action.disabled,
                            },
                            '& .MuiSlider-thumb': {
                                backgroundColor: 'grey',
                                color: (theme) => theme.palette.action.disabled,
                            },
                        },
                    }} />
                    <Button variant="contained" startIcon={<Search />} >
                        Iterative
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TextChoose;
