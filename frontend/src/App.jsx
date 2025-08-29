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
import Null from './component/Null'

function App() {
  // 后端请求检索到的相似图片结果
  const [results, setResults] = useState([])
  const [activeTab, setActiveTab] = useState(-1)

  // 传给图生文的图片切片
  const [clipImage, setClipImage] = useState(null);

  const [textNumber, setTextNumber] = useState(1);
  const [paintingNumber, setPaintingNumber] = useState(1);
  const [generationTrigger, setGenerationTrigger] = useState(0);

  const handleGenerate = (type, number) => {
    if (type === "texts") {
      setTextNumber(number);
    } else if (type === "paintings") {
      setPaintingNumber(number);
    }
    setGenerationTrigger(prev => prev + 1); // 每次点击都会递增
  };

  return (
    <div>
      {/* 头部 */}
      <div className='Head'> </div>

      {/* 图像检索父模块 */}
      <div className='ImagePart'>
        {/* 图像输入与定制化 */}
        <div className='ImageChoose'>
          <ImageChoose
            onSearch={setResults}
            onClip={setClipImage}
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
            clipImage={clipImage}
            onGenerate={handleGenerate}   // 传给图生文/文生图对应生成的数量
          />
        </div>
        <div className='MatchingList'>
          <MatchingTop></MatchingTop>
          {activeTab === -1 && <Null />}
          {activeTab === 1 && <Paintings number={paintingNumber} trigger={generationTrigger}/>}
          {activeTab === 0 && <Texts number={textNumber} trigger={generationTrigger}/>}
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
