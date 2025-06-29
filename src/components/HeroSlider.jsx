// src/components/HeroSlider.jsx
import { useState, useEffect } from "react";

const slides = [
  { image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrKRlU0ebZy1CI-rSCweqlTLOWu3mRgqw11Q&s", text: "Shop the Latest Trends!" },
  { image: "https://static-01.daraz.pk/p/b0e440d293b1f2a8f4715e9ef659abbd.jpg", text: "New Arrivals Every Week!" },
  { image: "https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amVhbnN8ZW58MHx8MHx8fDA%3D", text: "Up to 50% Off!" },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-96 mb-8">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image} alt={slide.text} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-30">
            <h2 className="text-white text-xl sm:text-3xl font-bold">{slide.text}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSlider;