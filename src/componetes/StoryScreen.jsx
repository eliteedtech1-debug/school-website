import { useEffect, useState } from "react";
import axios from 'axios';
import fallbackStories from "./stories.js";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5123/api';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN;

export default function StorySlider() {
  const [index, setIndex] = useState(0);
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {};
    axios.get(`${API_URL}/public/stories`, {
      params: { school_id: SCHOOL_ID },
      headers
    }).then(res => {
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setStories(data);
      } else if (fallbackStories.length > 0) {
        setStories(fallbackStories);
      } else {
        setStories([]);
      }
    }).catch(() => {
      setStories(fallbackStories.length > 0 ? fallbackStories : []);
    }).finally(() => setLoading(false));
  }, []);

  const slides = stories || fallbackStories;

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto h-[500px] md:h-[600px] overflow-hidden rounded-xl shadow-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative max-w-7xl mx-auto h-[500px] md:h-[600px] overflow-hidden rounded-xl shadow-xl">
      <div className="absolute inset-0">
        <img
          src={slides[index].image_url || slides[index].image}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-3">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Featured Story
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            {slides[index].title}
          </h2>
          <p className="text-gray-200 text-base md:text-lg mb-6 line-clamp-2">
            {slides[index].description}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              View Full Gallery <FiArrowRight />
            </Link>
            <span className="text-gray-300 text-sm">
              {index + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: idx === index ? '2rem' : '0.75rem',
              backgroundColor: idx === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/30">
        <div
          className="h-full transition-all duration-5000 ease-linear"
          style={{
            width: `${((index + 1) / slides.length) * 100}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  );
}
