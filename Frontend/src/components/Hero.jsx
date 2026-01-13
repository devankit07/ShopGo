import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const Hero = () => {
  const images = [
    "/hero.avif",
    "/hero1.avif", 
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(timer); 
  }, [images.length]);

  return (
    
    <section className="bg-gradient-to-r from-yellow-500 to-purple-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Latest Items at <br /> 
              <span className="text-yellow-300">Best Prices</span>
            </h1>
            <p className="text-xl text-pink-50 leading-relaxed max-w-lg">
              Discover cutting-edge technology with unbeatable deals and
              exclusive offers on Smart gadgets & accessories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className='bg-white text-[#FF3F6C] hover:bg-gray-100 font-bold h-12 px-8 shadow-lg'>
                Shop Now
              </Button>
              <Button variant="outline" className='border-2 border-white text-white hover:bg-white hover:text-[#FF3F6C] bg-transparent font-bold h-12 px-8'>
                View Deals
              </Button>
            </div>
          </div>

          {/* Slider Image Section */}
          <div className="relative group flex justify-center items-center">
            <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Slide ${index}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  }`}
                />
              ))}
              
              {/* Bottom Dots (Indicator) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;