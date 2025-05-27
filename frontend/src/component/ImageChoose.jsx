import React, { useState, useRef, useCallback } from 'react';
import '../style/ImageChoose.css';
import { SvgIcon, Button, Typography, Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const ImageChoose = ({ src, alt = 'uploaded image', }) => {
  const [value, setValue] = React.useState(30);
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
  };

  // scale
  const handleWheel = useCallback(e => {
    e.preventDefault();
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

  function Upload(props) {
    return (
      <SvgIcon {...props}>
        {/* 把你 SVG 文件里的 <path d="…"/> 内容粘进去 */}
        <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.69811 6.02929L6.32251 2.88001H24.1684L26.7928 6.02929H3.69811ZM19.4445 20.7259V24.925H11.0464V20.7259H4.74787L14.5243 10.537C14.9221 10.1213 15.5709 10.1223 15.9667 10.5349L25.7431 20.7259H19.4445ZM29.3585 6.20355L26.3267 1.65599C26.0055 1.17415 25.277 0.780487 24.7017 0.780487H5.78923C5.22551 0.780487 4.48648 1.1731 4.1642 1.65599L1.13249 6.20355C0.811268 6.68539 0.548828 7.55039 0.548828 8.13091V28.0837C0.548828 29.2395 1.48521 30.1738 2.6389 30.1738H27.852C28.9973 30.1738 29.9421 29.2384 29.9421 28.0837V8.13091C29.9421 7.53989 29.6807 6.68644 29.3585 6.20355Z" fill="black" />
        </svg>
      </SvgIcon>
    );
  }

  function Reset(props) {
    return (
      <SvgIcon {...props}>
        {/* 把你 SVG 文件里的 <path d="…"/> 内容粘进去 */}
        <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.7472 10.7404C27.8605 10.4665 27.9266 10.1705 27.9392 9.862C27.9392 9.82737 27.9392 9.79589 27.9424 9.76126V9.72977L27.8889 3.93704C27.8763 2.5109 26.7901 0.780487 25.3671 0.780487L24.561 1.72866C23.6128 2.67683 23.6128 2.67683 22.7226 3.55926C22.4141 3.33573 22.0961 3.1248 21.7687 2.92646C18.5418 0.971417 14.745 0.388996 11.0805 1.28939C7.41911 2.18348 4.3244 4.4565 2.36936 7.68343C0.414309 10.9104 -0.168112 14.7071 0.73228 18.3716C1.63267 22.0362 3.90254 25.1309 7.12947 27.0859C9.36471 28.4397 11.8738 29.1354 14.4239 29.1354C15.5541 29.1354 16.6906 29 17.8177 28.723C21.4822 27.8226 24.5769 25.5496 26.532 22.3227C27.275 21.0949 26.8846 19.4956 25.6568 18.7526C24.429 18.0096 22.8297 18.4 22.0867 19.6278C19.5366 23.837 14.0367 25.1875 9.82435 22.6375C7.7843 21.4034 6.34871 19.4452 5.77888 17.1312C5.20905 14.8142 5.5774 12.4184 6.81465 10.3783C9.33637 6.2195 14.7356 4.85003 18.9259 7.28046C17.9238 8.36585 17.4497 8.83994 16.5015 10.2622C16.5141 11.6883 17.9238 12.1585 19.5492 12.4026H19.5744L25.3671 12.3491C26.3525 12.3397 27.2088 11.7824 27.6401 10.967C27.6779 10.8978 27.7094 10.8254 27.7409 10.7529C27.744 10.7498 27.7472 10.7435 27.7472 10.7404Z" fill="#2C2C2C" />
        </svg>
      </SvgIcon>
    );
  }

  function Cut(props) {
    return (
      <SvgIcon {...props}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.26487 2.52462V6.98993C8.26439 7.41274 8.09488 7.81809 7.79351 8.11706C7.49215 8.41603 7.08355 8.5842 6.65736 8.58468H2.15634C1.73015 8.5842 1.32155 8.41603 1.02019 8.11706C0.718823 7.81809 0.549307 7.41274 0.548828 6.98993V2.52462C0.549307 2.10181 0.718823 1.69646 1.02019 1.39749C1.32155 1.09852 1.73015 0.930345 2.15634 0.929871H6.65736C7.08355 0.930345 7.49215 1.09852 7.79351 1.39749C8.09488 1.69646 8.26439 2.10181 8.26487 2.52462ZM22.7324 8.58468H27.2335C27.6597 8.5842 28.0683 8.41603 28.3696 8.11706C28.671 7.81809 28.8405 7.41274 28.841 6.98993V2.52462C28.8405 2.10181 28.671 1.69646 28.3696 1.39749C28.0683 1.09852 27.6597 0.930345 27.2335 0.929871H22.7324C22.3063 0.930345 21.8977 1.09852 21.5963 1.39749C21.2949 1.69646 21.1254 2.10181 21.1249 2.52462V6.98993C21.1254 7.41274 21.2949 7.81809 21.5963 8.11706C21.8977 8.41603 22.3063 8.5842 22.7324 8.58468ZM6.65736 11.1363H2.15634C1.73015 11.1368 1.32155 11.3049 1.02019 11.6039C0.718823 11.9029 0.549307 12.3082 0.548828 12.731V17.1963C0.549307 17.6191 0.718823 18.0245 1.02019 18.3235C1.32155 18.6224 1.73015 18.7906 2.15634 18.7911H6.65736C7.08355 18.7906 7.49215 18.6224 7.79351 18.3235C8.09488 18.0245 8.26439 17.6191 8.26487 17.1963V12.731C8.26439 12.3082 8.09488 11.9029 7.79351 11.6039C7.49215 11.3049 7.08355 11.1368 6.65736 11.1363ZM11.1656 2.95959L17.5884 6.63848C17.6862 6.69448 17.7971 6.72395 17.91 6.72395C18.0228 6.72394 18.1337 6.69445 18.2315 6.63845C18.3292 6.58244 18.4104 6.5019 18.4668 6.4049C18.5233 6.30791 18.5529 6.19789 18.5529 6.0859V2.52462C18.5524 2.10181 18.3829 1.69646 18.0816 1.39749C17.7802 1.09852 17.3716 0.930345 16.9454 0.929871H12.4444C12.0521 0.930085 11.6735 1.07248 11.3797 1.33027C11.0859 1.58806 10.8971 1.94348 10.8489 2.32966C10.8336 2.4539 10.8555 2.57987 10.9118 2.69188C10.9681 2.8039 11.0564 2.897 11.1656 2.95959ZM6.65736 21.3427H2.15634C1.73015 21.3432 1.32155 21.5113 1.02019 21.8103C0.718823 22.1093 0.549307 22.5146 0.548828 22.9374V27.4027C0.549307 27.8256 0.718823 28.2309 1.02019 28.5299C1.32155 28.8289 1.73015 28.997 2.15634 28.9975H6.65736C7.08355 28.997 7.49215 28.8289 7.79351 28.5299C8.09488 28.2309 8.26439 27.8256 8.26487 27.4027V22.9374C8.26439 22.5146 8.09488 22.1093 7.79351 21.8103C7.49215 21.5113 7.08355 21.3432 6.65736 21.3427ZM29.6208 15.0492L14.5856 6.43755L11.8142 4.85017C11.5128 4.67734 11.255 4.78738 11.1584 4.84279C11.0606 4.89878 10.9795 4.97929 10.923 5.07626C10.8666 5.17322 10.8369 5.28321 10.8369 5.39518V25.808C10.8369 25.9331 10.8739 26.0554 10.9434 26.1598C11.0129 26.2641 11.1119 26.3459 11.2278 26.3949C11.3438 26.444 11.4718 26.4581 11.5958 26.4355C11.7198 26.413 11.8344 26.3547 11.9254 26.2681L16.5871 21.8251L20.5169 28.5777C20.73 28.9439 21.0811 29.2111 21.4928 29.3206C21.9045 29.4301 22.3432 29.3729 22.7124 29.1616L26.6106 26.9289C26.7934 26.8242 26.9537 26.6848 27.0822 26.5186C27.2108 26.3525 27.3051 26.1628 27.3597 25.9605C27.4144 25.7582 27.4283 25.5472 27.4008 25.3396C27.3732 25.1319 27.3047 24.9317 27.1991 24.7503L23.269 17.9977L29.478 16.2144C29.5991 16.1796 29.7072 16.1102 29.7889 16.015C29.8706 15.9197 29.9222 15.8027 29.9374 15.6786C29.9526 15.5544 29.9307 15.4285 29.8744 15.3166C29.8181 15.2047 29.7298 15.1117 29.6206 15.0492H29.6208Z" fill="black" />
        </svg>
      </SvgIcon>
    );
  }

  function Delete(props) {
    return (
      <SvgIcon {...props}>
        <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M31.7198 5.33766H1.45408C1.07167 5.33766 0.704926 5.49002 0.434522 5.76122C0.164118 6.03242 0.012207 6.40025 0.012207 6.78378C0.012207 7.16732 0.164118 7.53514 0.434522 7.80634C0.704926 8.07754 1.07167 8.2299 1.45408 8.2299H4.79606V25.9911C4.79735 27.6416 5.45123 29.2241 6.61429 30.3917C7.77736 31.5593 9.35465 32.2166 11.0003 32.2195H22.1726C23.8184 32.2169 25.396 31.5597 26.5593 30.3921C27.7225 29.2245 28.3766 27.6417 28.3779 25.9911V8.22596H31.7198C31.9121 8.23098 32.1035 8.19732 32.2826 8.12698C32.4617 8.05664 32.625 7.95103 32.7628 7.81638C32.9006 7.68174 33.0101 7.52078 33.0849 7.34301C33.1597 7.16524 33.1982 6.97425 33.1982 6.78131C33.1982 6.58836 33.1597 6.39738 33.0849 6.2196C33.0101 6.04183 32.9006 5.88088 32.7628 5.74623C32.625 5.61159 32.4617 5.50598 32.2826 5.43563C32.1035 5.36529 31.9121 5.33163 31.7198 5.33665L31.7198 5.33766ZM14.7644 23.0725C14.7652 23.2628 14.7286 23.4514 14.6566 23.6275C14.5846 23.8036 14.4786 23.9637 14.3447 24.0986C14.2108 24.2335 14.0517 24.3406 13.8764 24.4136C13.7012 24.4867 13.5133 24.5243 13.3235 24.5243C13.1337 24.5243 12.9458 24.4867 12.7705 24.4136C12.5953 24.3406 12.4362 24.2335 12.3023 24.0986C12.1684 23.9637 12.0624 23.8036 11.9904 23.6275C11.9183 23.4514 11.8817 23.2628 11.8826 23.0725V13.989C11.8826 13.6057 12.0344 13.2381 12.3046 12.9671C12.5748 12.6961 12.9413 12.5438 13.3235 12.5438C13.7056 12.5438 14.0721 12.6961 14.3424 12.9671C14.6126 13.2381 14.7644 13.6057 14.7644 13.989V23.0725L14.7644 23.0725ZM21.2864 23.0725C21.2864 23.4557 21.1346 23.8233 20.8644 24.0943C20.5942 24.3654 20.2277 24.5176 19.8455 24.5176C19.4634 24.5176 19.0969 24.3654 18.8267 24.0943C18.5565 23.8233 18.4046 23.4557 18.4046 23.0725V13.989C18.4046 13.6057 18.5565 13.2381 18.8267 12.9671C19.0969 12.6961 19.4634 12.5438 19.8455 12.5438C20.2277 12.5438 20.5942 12.6961 20.8644 12.9671C21.1346 13.2381 21.2864 13.6057 21.2864 13.989V23.0725ZM11.0686 3.82309H22.1044C22.4805 3.81328 22.8378 3.65657 23.1003 3.38635C23.3628 3.11613 23.5098 2.75376 23.5098 2.37648C23.5098 1.9992 23.3628 1.63684 23.1003 1.36661C22.8378 1.09639 22.4805 0.939677 22.1044 0.929871H11.0685C10.6925 0.939677 10.3351 1.09639 10.0726 1.36661C9.8101 1.63684 9.66318 1.9992 9.66318 2.37648C9.66318 2.75376 9.8101 3.11613 10.0726 3.38635C10.3351 3.65657 10.6925 3.81328 11.0685 3.82309H11.0686Z" fill="#2C2C2C" />
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


  return (
    <div className="P">
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
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={handleUploadClick}
        >
          Upload
        </Button>
        <Button variant="contained" startIcon={<Reset />} onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" startIcon={<Cut />} onClick={() => setIsClipping((c) => !c)} color={isClipping ? 'secondary' : 'primary'}>
          Cut
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

      <div className="SliderGroup">
        <div className="sliderRow">
          <label htmlFor="s2" style={{
            fontWeight: 'bolder'
          }}>K-value</label>
          <input
            id="s2"
            type="range"
            min="0"
            max="100"
            onChange={e => setValue(e.target.value)}
            style={{
              background: 'blue',
              width: '800px'   // 直接指定你想要的长度
            }}
          />
          <label htmlFor="s2" style={{
            fontWeight: 'bolder'
          }}>{value}</label>
        </div>
      </div>

      <div className='search'>
        <FormControlLabel control={<Checkbox />} label="hello1" />
        <Button variant="contained" startIcon={<Search />} >
          Search
        </Button>
      </div>
    </div >
  );
};

export default ImageChoose;

