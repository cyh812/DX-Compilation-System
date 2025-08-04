import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageChoose from './component/ImageChoose'
import ImageList from './component/ImageList'
import TextChoose from './component/TextChoose'
import Matching from './component/Matching'
import MatchingLeft from './component/Matching-left'
import MatchingTop from './component/MatchingTop'
import MatchingBottom from './component/MatchingBottom'

function App() {
  // 后端请求检索到的相似图片结果
  const [results, setResults] = useState([])
  return (
    <div>
      {/* 头部 */}
      <div className='Head'> </div>

      {/* 图像检索父模块 */}
      <div className='ImagePart'>
        {/* 图像输入与定制化 */}
        <div className='ImageChoose'>
          <ImageChoose onSearch={setResults}
          ></ImageChoose>
        </div>
        {/* 检索结果列表 */}
        <div className='ImageList'>
          <ImageList results={results}></ImageList>
        </div>
      </div>


      <div className='Matching'>
        <div className='MatchingLeft'>
          <MatchingLeft />
        </div>
        <div className='MatchingList'>
          <MatchingTop></MatchingTop>
          <Matching></Matching>
          <MatchingBottom></MatchingBottom>
        </div>
      </div>



      <div className='Text'>
        <div className='TextChoose'>
          <TextChoose></TextChoose>
        </div>
        <div className='TextList'></div>
      </div>

    </div>
  );
}

export default App
