import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StaffCarousel({ managementStaff }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Guard: empty or missing data — render nothing
  const staff = Array.isArray(managementStaff) && managementStaff.length > 0
    ? managementStaff
    : null;

  // Reset index when staff list changes (e.g. CMS loads async)
  useEffect(() => {
    setIndex(0);
  }, [staff?.length]);

  useEffect(() => {
    if (!staff) return;
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1 >= staff.length ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(interval);
  }, [staff]);

  if (!staff) return null;

  // Clamp index defensively
  const safeIndex = Math.min(index, staff.length - 1);
  const current = staff[safeIndex];

  const slideVariants = {
    enter:  (d) => ({ x: d > 0 ?  300 : -300, opacity: 0 }),
    center:      ({ x: 0, opacity: 1 }),
    exit:   (d) => ({ x: d < 0 ?  300 : -300, opacity: 0 }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prev) => {
      if (newDirection > 0) return prev + 1 >= staff.length ? 0 : prev + 1;
      return prev - 1 < 0 ? staff.length - 1 : prev - 1;
    });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl dark:bg-gray-950">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={safeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Image */}
              <div className="relative">
                <div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg"
                  style={{ border: '4px solid var(--color-secondary)' }}
                >
                  {current.image ? (
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-bold"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}
                    >
                      {current.name?.slice(0, 2).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {current.name}
                  </h3>
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                    <span
                      className="text-lg font-medium"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {current.position}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
                  Leading our team with vision and expertise. Dedicated to innovation
                  and excellence in every aspect of our operations.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {staff.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > safeIndex ? 1 : -1); setIndex(i); }}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === safeIndex ? '2rem' : '0.5rem',
                backgroundColor: i === safeIndex
                  ? 'var(--color-primary)'
                  : '#d1d5db',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
