import React, { useState } from 'react';
import '../style/Paintings.css';
import paintingImg from '../assets/D004423.jpg'; // 替换为你的图片路径

const Paintings = () => {
    const images = [paintingImg, paintingImg, paintingImg, paintingImg]; // 自定义 1~5 张图片

    const handleClick = (index) => {
        console.log(`Clicked image ${index}`);
    };

    return (
        <div className='Paintings'>
            <div className="paintings-container">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="painting-wrapper"
                        onClick={() => handleClick(index)}
                    >
                        <img src={img} alt={`Painting ${index}`} className="painting-image" />
                        <div className="overlay">
                            <span>send to image view</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>


    );
};

export default Paintings;
