import { useState, useEffect } from 'react'
import './App.css'
import ImageChoose from './component/ImageChoose'
import ImageList from './component/ImageList'
import TextChoose from './component/TextChoose'
import Matching from './component/Matching'
import MatchingLeft from './component/Matching-left'
import MatchingTop from './component/MatchingTop'
import MatchingBottom from './component/MatchingBottom'
import Paintings from './component/Paintings'
import Texts from './component/Texts'
import TextList from './component/TextList'

function App() {
  // 后端请求检索到的相似图片结果
  const [results, setResults] = useState([])
  const [activeTab, setActiveTab] = useState(0)

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
          <MatchingLeft
            activeIndex={activeTab}
            onIndexChange={setActiveTab}
          />
        </div>
        <div className='MatchingList'>
          <MatchingTop></MatchingTop>
          {activeTab === 0 && <Paintings />}
          {activeTab === 1 && <Texts />}
          {activeTab === 2 && <Matching />}
          <MatchingBottom></MatchingBottom>
        </div>
      </div>



      <div className='Text'>
        <div className='TextChoose'>
          <TextChoose></TextChoose>
        </div>
        <div className='TextList'>
          <TextList results={results}></TextList>
        </div>
      </div>

    </div>
  );
}

export default App
