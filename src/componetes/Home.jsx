import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiMapPin,
  FiClock,
  FiTarget,
  FiHeart,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { FaGraduationCap, FaPray, FaHandsHelping } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";

import { useState, useEffect } from "react";
import CountUp from "./layout/CountUp";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import ApplyModal from "./ApplyModal";
import { Skeleton, CardSkeleton, TextSkeleton, StatSkeleton } from "../components/Skeleton";

const iconMap = {
  'target': FiTarget,
  'heart': FiHeart,
  'star': FiStar,
  'book': FiBookOpen,
  'users': FiUsers,
  'award': FiAward,
  'graduation': FaGraduationCap,
  'pray': FaPray,
  'zap': FiZap,
  'hands-helping': FaHandsHelping,
  'book-open': FiBookOpen,
};

const eventColorMap = {
  'blue': 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  'green': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  'purple': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  'yellow': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  'red': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const [index, setIndex] = useState(0);
  const [applyOpen, setApplyOpen] = useState(false);
  const { getSection, getParagraphs, getMedia, meta, loading } = useWebsiteContent();

  // Read branding from section (primary source), fallback to meta
  const parseFirstJson = (key) => {
    const section = getSection(key);
    if (!section) return {};
    try {
      const pars = typeof section.paragraphs === 'string'
        ? JSON.parse(section.paragraphs)
        : (section.paragraphs || []);
      return pars[0] ? (typeof pars[0] === 'string' ? JSON.parse(pars[0]) : pars[0]) : {};
    } catch { return {}; }
  };

  const brandingData = parseFirstJson('branding');
  const schoolName = brandingData.school_name || meta?.school_name || "Our School";
  const tagline    = brandingData.tagline || meta?.tagline || "";
  const logoUrl    = brandingData.logo_url || meta?.logo_url || null;

  // Read address from contact_info section
  const contactData = (() => {
    const section = getSection('contact_info');
    if (!section) return {};
    try {
      const pars = typeof section.paragraphs === 'string'
        ? JSON.parse(section.paragraphs)
        : (section.paragraphs || []);
      const result = {};
      pars.forEach(p => {
        const d = typeof p === 'string' ? JSON.parse(p) : p;
        if (d.type === 'address') result.address = d.text;
      });
      return result;
    } catch { return {}; }
  })();
  const address = contactData.address || meta?.address || "";

  // Parse structured data from CMS sections (JSON in paragraph text)
  const parseStructured = (key) => {
    const section = getSection(key);
    if (!section) return [];
    const paragraphs = typeof section.paragraphs === 'string'
      ? JSON.parse(section.paragraphs)
      : (section.paragraphs || []);
    return paragraphs.map(p => {
      try { return { ...JSON.parse(p.text), _id: p.id }; }
      catch { return null; }
    }).filter(Boolean);
  };

  // ── Hero section: all fields come from parsed paragraph JSON ──
  const parsedHero = parseStructured('hero');
  const heroData = parsedHero[0] || {};

  // Hero background images: check media array first, then paragraph images array, then single image (legacy)
  const heroImages = getMedia('hero');
  const heroImagesFromParagraph = heroData.images || (heroData.image ? [heroData.image] : []);
  const carouselImages = heroImages.length > 0
    ? heroImages.map(m => m.url)
    : heroImagesFromParagraph;

  // Hero title from paragraph JSON, fall back to section title, then null
  const heroTitle = heroData.title || getSection('hero')?.title || null;
  // Hero subtitle from paragraph JSON, fall back to meta tagline
  const heroSubtitle = heroData.subtitle || tagline || null;

  const welcomeParagraphs = getParagraphs('welcome');
  const welcomeImage   = getMedia('welcome')[0]?.url || null;

  const resolveIcon = (iconName) => {
    const Icon = iconMap[iconName?.toLowerCase()] || FiTarget;
    return <Icon className="w-8 h-8" />;
  };

  const cmsCoreValues = parseStructured('core_values');
  const cmsFeatures = parseStructured('features');
  const cmsPrograms = parseStructured('programs');
  const cmsEvents = parseStructured('events');
  const cmsStats = parseStructured('home_stats');
  const cmsStreams = parseStructured('home_streams');
  const cmsProgramsSection = getSection('programs');

  // Gallery items from the gallery section media
  const galleryMedia = getMedia('gallery');
  const galleryItems = galleryMedia.filter(item => item.type !== 'video').slice(0, 6);
  const gallerySection = getSection('gallery');

  useEffect(() => {
    if (carouselImages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Only use CMS data - no hardcoded fallbacks
  const features = cmsFeatures.length > 0
    ? cmsFeatures.map(f => ({
        icon: resolveIcon(f.icon),
        title: f.title,
        description: f.description,
      }))
    : [];

  const programs = cmsPrograms;

  const currentEvents = cmsEvents.length > 0
    ? cmsEvents.map(e => ({
        title: e.title,
        status: e.status,
        description: e.description,
        color: eventColorMap[e.color] || eventColorMap.blue,
      }))
    : [];

  const stats = cmsStats.length > 0
    ? cmsStats.map(s => ({
        icon: resolveIcon(s.icon),
        number: <CountUp from={0} to={parseInt(s.value) || 0} duration={1} />,
        label: s.label,
        description: s.description || '',
        suffix: s.suffix || '+',
      }))
    : [];

  const academicStreams = cmsStreams;

  const coreValues = cmsCoreValues.length > 0
    ? cmsCoreValues.map(v => ({
        icon: resolveIcon(v.icon),
        title: v.title,
        description: v.description,
      }))
    : [];

  return (
    <>
      <SEO
        title="Home"
        description={meta?.description || "Welcome to our school — Excellence in Education."}
        keywords={meta?.keywords || "school, education, academic excellence"}
        canonicalPath="/"
      />
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        {loading && heroImages.length === 0 ? (
          <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center px-4 animate-pulse">
              <Skeleton className="w-28 h-28 mx-auto mb-6 rounded-xl" />
              <Skeleton className="h-10 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-64 mx-auto mb-3" />
              <Skeleton className="h-4 w-48 mx-auto mb-8" />
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-36 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>
          </div>
        ) : (
        <motion.div
          id="gallery"
          className="relative w-full h-screen overflow-hidden text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Carousel background */}
          <AnimatePresence>
            <motion.img
              key={index}
              src={carouselImages[index]}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>

          {/* overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />

          {/* Hero text content */}
          <div className="relative z-20 flex items-center justify-center h-full">
            <div className="max-w-7xl mx-auto px-4 text-center">
              {logoUrl && (
                <motion.img
                  src={logoUrl}
                  alt={schoolName}
                  className="w-28 h-28 mx-auto mb-6 rounded-xl object-cover"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {heroTitle ? (
                  <span className="text-yellow-400">{heroTitle}</span>
                ) : (
                  <>Welcome to <br /><span className="text-yellow-400">{schoolName}</span></>
                )}
              </h1>

              {heroSubtitle && (
                <p className="text-xl md:text-2xl mb-6 text-yellow-400 font-semibold">
                  {heroSubtitle}
                </p>
              )}

              {address && (
                <div className="flex items-center justify-center gap-2 mb-8">
                  <FiMapPin className="text-yellow-400" />
                  <p>{address}</p>
                </div>
              )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setApplyOpen(true)}
              className="bg-yellow-400  text-blue-950 px-8 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl transform hover:scale-105"
            >
              Apply Now <FiArrowRight />
            </button>
            <Link
              to="/about"
              className="border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-blue-950 transition-all duration-300 backdrop-blur-sm bg-white/10 shadow-xl"
            >
              Learn More
            </Link>
          </div>
            </div>
          </div>

          {carouselImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setIndex((index - 1 + carouselImages.length) % carouselImages.length)
                }
                className="absolute  left-4 top-1/2 -translate-y-1/2 z-30 text-4xl"
              >
                ❮
              </button>

              <button
                onClick={() => setIndex((index + 1) % carouselImages.length)}
                className="absolute  right-4 top-1/2 -translate-y-1/2 z-30 text-4xl"
              >
                ❯
              </button>
            </>
          )}
        </motion.div>
        )}
      </section>

      {/* Principal's Welcome */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          {loading && !getSection('welcome') ? (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64 mb-6" />
                <TextSkeleton lines={4} />
                <Skeleton className="h-4 w-40 mt-4" />
              </div>
              <Skeleton className="w-full max-w-md mx-auto aspect-[4/5] rounded-lg" />
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {getSection('welcome')?.title || 'Welcome Message'}
              </h2>
              {welcomeParagraphs.length > 0
                ? welcomeParagraphs.map(p => (
                    <p key={p.id} className="text-lg mb-4 leading-relaxed">{p.text}</p>
                  ))
                : null
              }
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Learn More About Us <FiArrowRight />
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {welcomeImage && (
                <img
                  src={welcomeImage}
                  alt="Welcome"
                  className="w-full max-w-md mx-auto rounded-lg shadow-xl"
                />
              )}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaGraduationCap className="w-12 h-12 text-blue-950" />
              </div>
            </motion.div>
          </motion.div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-950 dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-yellow-400">Building excellence through dedication and commitment</p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-yellow-400 text-blue-950 flex items-center justify-center rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <h3 className="font-semibold text-lg mb-1">{stat.label}</h3>
                <p className="text-sm opacity-80">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Academic Streams */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Academic Streams</h2>
            <p className="text-gray-600 dark:text-gray-400">Choose your path to success with our specialized programs</p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {academicStreams.map((stream, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-950 dark:border-yellow-400"
              >
                <div className="text-4xl mb-4">{stream.icon}</div>
                <h3 className="font-bold text-xl mb-3">{stream.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{stream.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-blue-950 dark:text-yellow-400">Key Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(stream.subjects) ? stream.subjects : (stream.subjects || '').split(',').map(s => s.trim())).filter(Boolean).map((subject, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 dark:bg-gray-700 text-blue-950 dark:text-yellow-400 px-3 py-1 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{gallerySection?.title || 'Our Gallery'}</h2>
            <p className="text-gray-600 dark:text-gray-400">A glimpse into life at our school</p>
          </motion.div>

          {loading && galleryItems.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="w-full aspect-[4/3] rounded-lg" />
              ))}
            </div>
          ) : galleryItems.length === 0 ? null : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {galleryItems.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
                >
                  <img
                    src={item.image || item.thumbnail_url || item.url}
                    alt={item.caption || item.title || ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-semibold text-sm">{item.caption || item.title || ''}</p>
                    {item.category && (
                      <span className="text-xs opacity-80 capitalize">{item.category}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {galleryItems.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                View Full Gallery <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400">The principles that guide our educational philosophy</p>
          </motion.div>
          
          {loading && cmsCoreValues.length === 0 ? (
            <CardSkeleton count={3} cols={3} />
          ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6"
              >
                <div className="w-20 h-20 mx-auto bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 flex items-center justify-center rounded-full mb-6">
                  {value.icon}
                </div>
                <h3 className="font-bold text-xl mb-4">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
          )}
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>
        {loading && cmsEvents.length === 0 ? (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
            {[1,2,3].map(i => (
              <div key={i} className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <Skeleton className="h-4 w-28 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4"
        >
          {currentEvents.map((event, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`p-6 rounded-lg border-2 ${event.color}`}
            >
              <span className="text-sm font-bold">{event.status}</span>
              <h3 className="text-lg font-bold mt-2">{event.title}</h3>
              <p className="mt-2">{event.description}</p>
            </motion.div>
          ))}
        </motion.div>
        )}
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        {loading && cmsFeatures.length === 0 ? (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
            {[1,2,3].map(i => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <Skeleton className="w-16 h-16 mx-auto rounded-full mb-4" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
            >
              <div className="w-16 h-16 mx-auto bg-blue-950 text-white dark:bg-yellow-400 dark:text-blue-950 flex items-center justify-center rounded-full mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p>{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
        )}
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">{cmsProgramsSection?.title || 'Our Programs'}</h2>
        {loading && cmsPrograms.length === 0 ? (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-gray-300 dark:border-gray-600">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-950 dark:border-yellow-400"
            >
              <h3 className="font-bold text-lg">{p.level}</h3>
              <p>{p.grades}</p>
              <div className="flex gap-2 mt-2">
                <FiClock />
                <span className="text-sm">{p.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      {applyOpen && <ApplyModal onClose={() => setApplyOpen(false)} />}
    </div></>
  );
};

export default Home;
