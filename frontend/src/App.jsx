import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageChoose from './component/ImageChoose'
import ImageList from './component/ImageList copy'
import TextChoose from './component/TextChoose'

function App() {
  // const [message, setMessage] = useState("Loading...");

  // useEffect(() => {
  //   // 发起 GET 请求
  //   fetch("/api/hello")
  //     .then(res => {
  //       if (!res.ok) throw new Error(res.statusText);
  //       return res.json();
  //     })
  //     .then(data => {
  //       setMessage(data.message);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setMessage("Error fetching data");
  //     });
  // }, []);

  return (
    // <div style={{ padding: 20 }}>
    //   <h1>FastAPI ↔ React 通信示例</h1>
    //   <p>后端返回：</p>
    //   <pre>{message}</pre>
    // </div>

    <div>
      {/* 头部 */}
      <div className='Head'> </div>

      {/* 图像检索父模块 */}
      <div className='ImagePart'>
        {/* 图像输入与定制化 */}
        <div className='ImageChoose'>
          <ImageChoose></ImageChoose>
        </div>
        {/* 检索结果列表 */}
        <div className='ImageList'>
          <ImageList></ImageList>
        </div>
      </div>


      <div className='Matching'> </div>



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
