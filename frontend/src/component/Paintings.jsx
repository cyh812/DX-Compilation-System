import React, { useState, useEffect, useRef } from 'react';
import '../style/Paintings.css';
import paintingImg from '../assets/D004423.jpg';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Paintings = ({ number, trigger }) => {
    const prevTrigger = useRef(trigger);
    const allImages = [paintingImg, paintingImg, paintingImg, paintingImg, paintingImg];
    const [visibleImages, setVisibleImages] = useState([]);
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [hasGenerated, setHasGenerated] = useState(false); // ✅ 新增

    useEffect(() => {
        if (prevTrigger.current === trigger) return;
        prevTrigger.current = trigger;

        console.log("生成图像:", number);

        setHasGenerated(true);  // ✅ 只有点击生成后才允许显示
        setVisibleImages([]);
        setLoadingIndex(0);
    }, [trigger, number]);

    useEffect(() => {
        if (loadingIndex === null) return;
        if (loadingIndex >= number) {
            setLoadingIndex(null);
            return;
        }

        const delay = Math.floor(Math.random() * 5000) + 1000;
        const timer = setTimeout(() => {
            setVisibleImages((prev) => [...prev, loadingIndex]);
            setLoadingIndex((prev) => prev + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [loadingIndex, number]);

    const handleClick = (index) => {
        console.log(`Clicked image ${index}`);
    };

    return (
        <div className='Paintings'>
            <div className="paintings-container">
                {hasGenerated &&
                    Array.from({ length: number }).map((_, index) => (
                        <div
                            key={index}
                            className="painting-wrapper"
                            onClick={() => handleClick(index)}
                        >
                            {visibleImages.includes(index) ? (
                                <>
                                    <img
                                        src={allImages[index % allImages.length]}
                                        alt={`Painting ${index}`}
                                        className="painting-image"
                                    />
                                    <div className="overlay">
                                        <span>send to image view</span>
                                    </div>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        width: "100%"
                                    }}
                                >
                                    <CircularProgress
                                        sx={{ color: "rgba(0,255,255,1)" }}
                                        thickness={8}   // 默认值是 3.6，可以设大一点更粗
                                    />
                                </Box>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Paintings;
