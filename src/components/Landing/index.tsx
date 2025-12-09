import { useState } from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';
import { useNavigate } from 'react-router-dom';
// Import all landing images
import img1 from '../../assets/images/landing/1 (1).jpg';
import img2 from '../../assets/images/landing/1 (2).jpg';
import img3 from '../../assets/images/landing/1 (3).jpg';
import img4 from '../../assets/images/landing/1 (4).jpg';
import img5 from '../../assets/images/landing/1 (5).jpg';
import img6 from '../../assets/images/landing/1 (6).jpg';
import img7 from '../../assets/images/landing/1 (7).jpg';
import img8 from '../../assets/images/landing/1 (8).jpg';
import img9 from '../../assets/images/landing/1 (9).jpg';
import img10 from '../../assets/images/landing/1 (10).jpg';
import img11 from '../../assets/images/landing/1 (11).jpg';
import img12 from '../../assets/images/landing/1 (12).jpg';
import img13 from '../../assets/images/landing/1 (13).jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

export default function Landing() {
    const [carouselRef, setCarouselRef] = useState<CarouselRef | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const handlePrev = () => {
        carouselRef?.prev();
    };

    const handleNext = () => {
        carouselRef?.next();
    };

    const handleSlideChange = (current: number) => {
        setCurrentSlide(current);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Carousel Container */}
            <Carousel
                ref={setCarouselRef}
                autoplay
                autoplaySpeed={2000}
                effect="fade"
                dots={true}
                dotPosition="bottom"
                afterChange={handleSlideChange}
                className="h-full"
            >
                {images.map((image, index) => (
                    <div key={index} className="relative h-screen">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{
                                filter: 'brightness(0.7)',
                            }}
                        />
                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                        
                        {/* Content overlay */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center px-4 md:px-8 max-w-4xl">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
                                    Welcome to Our Platform
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-lg">
                                    Experience the best betting experience with us
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="px-8 py-6 h-auto text-lg font-semibold bg-blue-600 hover:bg-blue-700 border-none shadow-lg"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Get Started
                                    </Button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Custom Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Previous slide"
            >
                <LeftOutlined className="text-xl md:text-2xl" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Next slide"
            >
                <RightOutlined className="text-xl md:text-2xl" />
            </button>

            {/* Slide Counter */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                {currentSlide + 1} / {images.length}
            </div>

            {/* Custom Dots Styling */}
            <style>{`
                .ant-carousel .ant-carousel-dots {
                    bottom: 40px;
                }
                .ant-carousel .ant-carousel-dots li button {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transition: all 0.3s;
                }
                .ant-carousel .ant-carousel-dots li.ant-carousel-dots-active button {
                    width: 32px;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 1);
                }
                .ant-carousel .slick-slide {
                    height: 100vh;
                }
                .ant-carousel .slick-slide > div {
                    height: 100%;
                }
            `}</style>
        </div>
    );
}