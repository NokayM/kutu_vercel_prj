"use client";

import { useEffect, useRef, useState } from "react";

interface Oneri {
  olculer: string;
  image: string;
  price: string;
  url: string;
}

export default function Slider({ oneriler }: { oneriler: Oneri[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (!sliderRef.current || oneriler.length === 0) return;

    const slider = sliderRef.current;
    let autoSlideInterval: NodeJS.Timeout;

    const updateCardWidth = () => {
      if (slider.firstChild instanceof HTMLElement) {
        setCardWidth(slider.firstChild.clientWidth);
      }
    };

    const slideToIndex = (index: number) => {
      slider.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % oneriler.length;
          slideToIndex(newIndex);
          return newIndex;
        });
      }, 3000);
    };

    startAutoSlide();
    updateCardWidth();

    window.addEventListener("resize", updateCardWidth);

    return () => {
      clearInterval(autoSlideInterval);
      window.removeEventListener("resize", updateCardWidth);
    };
  }, [oneriler, cardWidth]);

  // **Dokunmatik (Swipe) İşlemleri**
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diffX = startX - e.touches[0].clientX;
    sliderRef.current!.scrollLeft += diffX;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    setCurrentIndex(Math.round(sliderRef.current!.scrollLeft / cardWidth));
  };

  return (
    <div
      ref={sliderRef}
      className="oneri-grid overflow-x-auto flex gap-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {oneriler.map((oneri, index) => (
        <div
          key={index}
          className="oneri-card min-w-[250px] bg-white border rounded-lg p-4 text-center shadow-lg"
        >
          <img src={oneri.image} alt={oneri.olculer} className="h-40 mx-auto mb-2 rounded" />
          <p className="font-bold">{oneri.olculer}</p>
          <p className="text-sm text-gray-600">{oneri.price}</p>
          <a href={oneri.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Ürünü İncele
          </a>
        </div>
      ))}
    </div>
  );
}
