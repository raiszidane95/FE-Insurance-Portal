import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

export default function HeroSlider({ className, children }) {
  const [activeSlide, setActiveSlide] = useState(0); // Menyimpan indeks slide aktif
  const settings = {
    dots: true,
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: index => {
      setActiveSlide(index);
    },
    customPaging: i => (
      <div
        className={`h-2 bg-softGreen/50 ${activeSlide === i ? "w-5" : "w-2"
          } rounded-full transition-all duration-300`}
      ></div>
    ),
    appendDots: dots => (
      <div className="flex justify-center space-x-2 mt-4">{dots}</div>
    ),
    dotsClass: "slick-dots",
  };

  return (
    <div className="slider-container">
      <Slider {...settings}  arrows={false} className={className}>
        {children}
      </Slider>
    </div>
  );
}
