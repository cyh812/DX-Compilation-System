import React, { useState, useRef, useCallback } from 'react';
import '../style/ImageChoose.css';
import { SvgIcon, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';


const ImageChoose = ({ src, alt = 'uploaded image', onSearch }) => {

  // slider的值
  const [value, setValue] = React.useState(10);
  const min = 0, max = 100;
  const percent = (value - min) / (max - min) * 100;
  // 当前图片 URL（object URL 或者默认图片）
  const [imageSrc, setImageSrc] = useState(null);
  // 缩放比例
  const [scale, setScale] = useState(1);
  // 平移偏移
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // 拖拽状态
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // 裁剪功能
  const [isClipping, setIsClipping] = useState(false);
  const [clipRect, setClipRect] = useState(null);
  const containerRef = useRef(null);
  const clipStart = useRef({ x: 0, y: 0 });
  const draggingClip = useRef(false);

  // 隐藏的文件输入
  const fileInputRef = useRef(null);

  // 1. 处理上传
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      // 重置拖拽/缩放
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
    e.target.value = ''; // 允许重复上传同一文件
  };

  // 2. 处理删除
  const handleDelete = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    }
    console.log(imageSrc)
  };

  // scale
  const handleWheel = useCallback(e => {
    // e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.1, s + delta));
  }, []);

  // Mouse down
  const handleMouseDown = useCallback((e) => {
    if (isClipping) {
      if (e.button === 0) {
        // start clipping with left button
        draggingClip.current = true;
        const rect = containerRef.current.getBoundingClientRect();
        clipStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        setClipRect({ x: clipStart.current.x, y: clipStart.current.y, width: 0, height: 0 });
        e.preventDefault();
      }
    } else {
      if (e.button === 0) {
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    }
  }, [isClipping]);

  // Mouse move
  const handleMouseMove = useCallback((e) => {
    if (dragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    } else if (draggingClip.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setClipRect({
        x: Math.min(clipStart.current.x, x),
        y: Math.min(clipStart.current.y, y),
        width: Math.abs(x - clipStart.current.x),
        height: Math.abs(y - clipStart.current.y)
      });
    }
  }, []);

  // Mouse up / leave
  const handleMouseUp = useCallback((e) => {
    if (dragging.current) dragging.current = false;
    if (draggingClip.current) draggingClip.current = false;
  }, []);
  // clip button toggle
  const handleClipToggle = () => {
    setIsClipping(c => !c);
    if (isClipping) setClipRect(null);
  };

  // reset
  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setClipRect(null);
    setIsClipping(false);
  };

  // 把imagesrc变为file格式
  async function blobUrlToFile(blobUrl, filename = 'upload.png') {
    // 1. 把 Blob URL 当作资源 fetch 一下
    const res = await fetch(blobUrl)
    const blob = await res.blob()
    // 2. 包装成 File 对象
    return new File([blob], filename, { type: blob.type })
  }

  // 发送请求给后端
  const ImageSearch = async () => {
    if (!imageSrc) {
      console.warn('请先选择一张图片')
      return
    }

    // 把 blob URL 转成 File
    const fileObj = await blobUrlToFile(imageSrc, 'search.png')
    console.log(fileObj)
    // 构造 FormData
    const formData = new FormData()
    formData.append('file', fileObj)
    // formData.append('topk', 5)

    try {
      const res = await fetch(`/api/search/image?topk=${value}`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`后端返回 ${res.status}`)
      }

      const data = await res.json()
      console.log('检索结果：', data.results)

      onSearch(data.results)
    } catch (err) {
      console.error('检索出错：', err)
    }
  };

  function Upload(props) {
    return (
      <SvgIcon {...props}>
        {/* 把你 SVG 文件里的 <path d="…"/> 内容粘进去 */}
        <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.69811 6.02929L6.32251 2.88001H24.1684L26.7928 6.02929H3.69811ZM19.4445 20.7259V24.925H11.0464V20.7259H4.74787L14.5243 10.537C14.9221 10.1213 15.5709 10.1223 15.9667 10.5349L25.7431 20.7259H19.4445ZM29.3585 6.20355L26.3267 1.65599C26.0055 1.17415 25.277 0.780487 24.7017 0.780487H5.78923C5.22551 0.780487 4.48648 1.1731 4.1642 1.65599L1.13249 6.20355C0.811268 6.68539 0.548828 7.55039 0.548828 8.13091V28.0837C0.548828 29.2395 1.48521 30.1738 2.6389 30.1738H27.852C28.9973 30.1738 29.9421 29.2384 29.9421 28.0837V8.13091C29.9421 7.53989 29.6807 6.68644 29.3585 6.20355Z" fill="white" />
        </svg>
      </SvgIcon>
    );
  }

  function Reset(props) {
    return (
      <SvgIcon {...props}>
        {/* 把你 SVG 文件里的 <path d="…"/> 内容粘进去 */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_154_28)">
            <path d="M1 4V10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.51 14.9999C4.15839 16.8403 5.38734 18.4201 7.01166 19.5013C8.63598 20.5825 10.5677 21.1065 12.5157 20.9944C14.4637 20.8823 16.3226 20.1401 17.8121 18.8797C19.3017 17.6193 20.3413 15.9089 20.7742 14.0063C21.2072 12.1037 21.0101 10.1119 20.2126 8.33105C19.4152 6.55019 18.0605 5.07674 16.3528 4.13271C14.6451 3.18868 12.6769 2.82521 10.7447 3.09707C8.81245 3.36892 7.02091 4.26137 5.64 5.63995L1 9.99995" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_154_28">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </SvgIcon>
    );
  }

  function Cut(props) {
    return (
      <SvgIcon {...props}>
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.25 1H3.25C2.71957 1 2.21086 1.21071 1.83579 1.58579C1.46071 1.96086 1.25 2.46957 1.25 3V6M19.25 6V3C19.25 2.46957 19.0393 1.96086 18.6642 1.58579C18.2891 1.21071 17.7804 1 17.25 1H14.25M14.25 19H17.25C17.7804 19 18.2891 18.7893 18.6642 18.4142C19.0393 18.0391 19.25 17.5304 19.25 17V14M1.25 14V17C1.25 17.5304 1.46071 18.0391 1.83579 18.4142C2.21086 18.7893 2.71957 19 3.25 19H6.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SvgIcon>
    );
  }

  function Delete(props) {
    return (
      <SvgIcon {...props}>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.75 6H5.75H21.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.75 6V20C19.75 20.5304 19.5393 21.0391 19.1642 21.4142C18.7891 21.7893 18.2804 22 17.75 22H7.75C7.21957 22 6.71086 21.7893 6.33579 21.4142C5.96071 21.0391 5.75 20.5304 5.75 20V6M8.75 6V4C8.75 3.46957 8.96071 2.96086 9.33579 2.58579C9.71086 2.21071 10.2196 2 10.75 2H14.75C15.2804 2 15.7891 2.21071 16.1642 2.58579C16.5393 2.96086 16.75 3.46957 16.75 4V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.75 11V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.75 11V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    <div className="P1">
      <div className='Title'>Image View</div>
      <div className="image-container"
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ position: 'relative', userSelect: 'none' }}
      >

        {imageSrc
          ? (
            <img
              src={imageSrc}
              alt={alt}
              className="image-content"
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
              draggable={false}
            />
          )
          : (
            <div className="placeholder">
              <div className="upload-wrapper">
                <button
                  className="upload-button"
                  onClick={handleUploadClick}
                >
                  <span className="upload-icon">＋</span>
                </button>
                <span className="upload-label">Import</span>
              </div>
            </div>
          )
        }
        {clipRect && (
          <div
            className="clip-rect"
            style={{
              position: 'absolute',
              left: clipRect.x,
              top: clipRect.y,
              width: clipRect.width,
              height: clipRect.height,
              border: '2px dashed red',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>


      <div className='ButtonGroup'>
        <Button variant="contained" startIcon={<Cut />} onClick={() => setIsClipping((c) => !c)} color={isClipping ? 'secondary' : 'primary'} sx={{
          width: '100px'
        }}>
          Cut
        </Button>
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={handleUploadClick}
          sx={{
            width: '120px'
          }}
        >
          Segment
        </Button>
        <Button variant="contained" startIcon={<Reset />} onClick={handleReset}>
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={<Delete />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className='BottomGroup'>
        {/* <div className="SliderGroup">
          <div className="sliderRow">
          </div>
        </div> */}

        <div className='search'>
          <FormControlLabel control={<Checkbox
            checked={checkedKvalue}
            onChange={handleCheckKvalue}
            sx={{
              color: '#fff',
              '&.Mui-checked': {
                color: '#00C1CD',
              },
            }} />}
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
          <Button variant="contained" startIcon={<Search />} onClick={ImageSearch} >
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
          <Button variant="contained" startIcon={<Search />} onClick={ImageSearch} >
            Iterative
          </Button>
        </div>
      </div>
    </div >
  );
};

export default ImageChoose;

