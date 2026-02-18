"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
    id: number;
    title: string;
    subtitle: string;
    cta: string;
    bg: string;
    accent: string;
};

const defaultSlides: Slide[] = [
    {
        id: 1,
        title: "Handcrafted with Love",
        subtitle: "Discover unique artisan pieces that bring warmth and character to every corner of your home.",
        cta: "Shop Collection",
        bg: "from-gray-900 to-gray-800",
        accent: "text-yellow-400",
    },
    {
        id: 2,
        title: "New Arrivals",
        subtitle: "Explore our latest collection of premium handmade crafts, designed to inspire and delight.",
        cta: "View New Items",
        bg: "from-yellow-600 to-yellow-500",
        accent: "text-black",
    },
    {
        id: 3,
        title: "Premium Quality",
        subtitle: "Each piece is carefully crafted by skilled artisans using traditional techniques and quality materials.",
        cta: "Learn More",
        bg: "from-black to-gray-900",
        accent: "text-yellow-300",
    },
];

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const slides = defaultSlides;

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning]);

    const nextSlide = useCallback(() => {
        goToSlide((current + 1) % slides.length);
    }, [current, slides.length, goToSlide]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="relative w-full mt-28 py-6 flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
            {/* Slideshow container - smaller and centered */}
            <div className="relative w-full max-w-5xl mx-auto h-[55vh] rounded-xl overflow-hidden shadow-2xl">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${slide.bg} transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-1/4 left-10 w-52 h-52 bg-yellow-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
                            <p className={`text-xs uppercase tracking-[0.3em] font-semibold mb-3 ${slide.accent}`}>
                                Prasanthi Crafts
                            </p>
                            <h1
                                className={`text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 transition-transform duration-700 ${index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                    }`}
                            >
                                {slide.title}
                            </h1>
                            <p
                                className={`text-base md:text-lg text-white/70 max-w-xl mx-auto mb-8 transition-transform duration-700 delay-100 ${index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                    }`}
                            >
                                {slide.subtitle}
                            </p>
                            <a
                                href="#products"
                                className={`inline-block px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${slide.bg.includes("yellow")
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "bg-yellow-400 text-black hover:bg-yellow-300"
                                    }`}
                            >
                                {slide.cta}
                            </a>
                        </div>
                    </div>
                ))}

                {/* Slide indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === current
                                ? "w-8 bg-yellow-400"
                                : "w-2 bg-white/40 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>

                {/* Left/Right arrows */}
                <button
                    onClick={() => goToSlide((current - 1 + slides.length) % slides.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => goToSlide((current + 1) % slides.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
