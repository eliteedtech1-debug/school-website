import {
  FiClock,
  FiUsers,
  FiAward,
  FiStar,
  FiTarget,
  FiBookOpen,
  FiHeart,
} from "react-icons/fi";
import { FaGraduationCap, FaBookOpen, FaPray, FaHandsHelping } from "react-icons/fa";
import SEO from "../components/SEO";

import CountUp from "../componetes/layout/CountUp";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StaffCarousel from "../componetes/StaffCarousel";
import ChairmanMessage from "./ChairmanMessage";
import VisionMission from "./VisionMission";
import { Skeleton, CardSkeleton, TextSkeleton, StatSkeleton } from "../components/Skeleton";

const iconMap = {
  target: FiTarget,
  heart: FiHeart,
  star: FiStar,
  book: FiBookOpen,
  users: FiUsers,
  award: FiAward,
  clock: FiClock,
  graduation: FaGraduationCap,
  bookopen: FiBookOpen,
  handshelping: FaHandsHelping,
};

const resolveIcon = (name) => {
  const Icon = iconMap[name?.toLowerCase().replace(/-/g, '')] || FiTarget;
  return <Icon className="w-6 h-6" />;
};

const About = () => {
  const { getSection, getParagraphs, getMedia, loading } = useWebsiteContent();
  const aboutParagraphs = getParagraphs('about');
  const aboutImage = getMedia('about')[0]?.url || null;

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

  const cmsHero = parseStructured('about_hero');
  const cmsKeyPoints = parseStructured('about_key_points');
  const cmsFloatingStats = parseStructured('about_floating_stats');
  const cmsStats = parseStructured('about_stats');
  const cmsStaff = parseStructured('about_staff');
  const cmsPrograms = parseStructured('about_programs');
  const bannerParagraph = getParagraphs('about_programs_banner');

  const heroData = cmsHero[0] || {};
  const keyPoints = cmsKeyPoints.length > 0
    ? cmsKeyPoints.map(k => k.text)
    : [];

  const floatingStats = cmsFloatingStats.length > 0
    ? cmsFloatingStats
    : [];

  const stats = cmsStats.length > 0
    ? cmsStats.map(s => ({
        icon: resolveIcon(s.icon),
        number: <CountUp from={s.from || 0} to={s.to} separator="," direction="up" duration={1} className="count-up-text" />,
        label: s.label,
        description: s.description,
      }))
    : [];

  const managementStaff = cmsStaff.length > 0
    ? cmsStaff
    : [];

  const programs = cmsPrograms.length > 0
    ? cmsPrograms
    : [];

  const bannerText = bannerParagraph[0]?.text || "";

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about our school — our mission, vision, values, and leadership team."
        keywords="about us, school mission vision, our team, school history"
        canonicalPath="/about"
      />
    <div className="pt-16 dark:bg-gray-950">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden py-32 text-center bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 text-white"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {loading && !getSection('about_hero') ? (
            <div className="animate-pulse space-y-4">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-8 w-96 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto mt-6" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                <span className="text-yellow-400">{heroData.title || "About Us"}</span>
              </h1>
              {heroData.tagline && (
                <p className="mt-6 text-lg md:text-xl text-blue-100">
                  {heroData.tagline}
                </p>
              )}
              <div className="mt-10 flex justify-center gap-4 flex-wrap">
                <Link to="/gallery">
                  <button className="px-8 py-3 font-bold rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-950 transition">
                    View Gallery
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* About Us */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && !getSection('about') ? (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 mx-auto mb-6" />
                <TextSkeleton lines={3} />
                <div className="space-y-2 mt-8">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              </div>
              <Skeleton className="w-full h-[500px] rounded-2xl" />
            </div>
          ) : (
          <>
            <div className="text-center text-4xl font-semibold">
              <h1 className="mb-6">{getSection('about')?.title || 'About Our School'}</h1>
            </div>              {aboutParagraphs[0]?.text && (
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-5xl mx-auto">
                  {aboutParagraphs[0]?.text}
                </p>
              )}
            <div className="grid lg:grid-cols-2 gap-12 items-center pt-28 pb-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {aboutImage ? (
                <img
                  src={aboutImage}
                  alt="School Campus"
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Campus Image</span>
                </div>
              )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                {floatingStats.map((stat, i) => (
                  <div
                    key={i}
                    className={`absolute ${i === 0 ? '-bottom-6 -right-6' : '-top-6 -left-6'} bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xl`}
                  >
                    <div className={`text-3xl font-bold ${i === 0 ? 'text-blue-950' : 'text-red-700'} dark:text-yellow-400`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  {aboutParagraphs.slice(1).map(p => (
                    <p key={p.id} className="text-lg leading-relaxed">{p.text}</p>
                  ))}

                  {/* Key Points */}
                  <div className="space-y-4 my-8">
                    {keyPoints.length > 0 && keyPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <li className="text-gray-800 dark:text-gray-200">{point}</li>
                    </div>
                  ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
          )}
        </div>
      </section>

      {/* Vision and Mission */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisionMission />
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ChairmanMessage />
        </div>
      </section>

      {/* Management Staff */}
      <section className="py-20 mb-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {loading && cmsStaff.length === 0 ? (
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-5 w-96 mx-auto" />
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {getSection('about_staff')?.title || "Meet Our Leadership Team"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Dedicated professionals guiding our institution towards excellence
                </p>
              </>
            )}
          </div>
          <div className="relative overflow-hidden">
            {loading && cmsStaff.length === 0 ? (
              <div className="animate-pulse flex items-center gap-8 justify-center p-12">
                <Skeleton className="w-56 h-56 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            ) : (
              <StaffCarousel managementStaff={managementStaff} />
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {loading && cmsStats.length === 0 ? (
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-5 w-72 mx-auto" />
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {getSection('about_stats')?.title || "By The Numbers"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Our journey in numbers - a testament to our commitment to educational excellence
                </p>
              </>
            )}
          </div>

          {loading && cmsStats.length === 0 ? (
            <StatSkeleton count={4} />
          ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-950 dark:bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-950 to-blue-700 dark:from-yellow-400 dark:to-yellow-400 flex items-center justify-center text-white dark:text-blue-950 text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {loading && cmsPrograms.length === 0 ? (
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-5 w-80 mx-auto" />
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {getSection('about_programs')?.title || "Comprehensive Programs"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Tailored educational pathways for every student's success
                </p>
              </>
            )}
          </div>

          {loading && cmsPrograms.length === 0 ? (
            <CardSkeleton count={5} cols={5} />
          ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <div className="h-full rounded-2xl border-2 border-blue-950 dark:border-yellow-400 text-gray-800 backdrop-blur-lg p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="text-4xl mb-3">{program.icon}</div>
                      <h3 className="text-xl dark:text-white font-bold text-blue-950 mb-2">
                        {program.title}
                      </h3>
                      <p className="text-blue-950 dark:text-white text-sm mb-4">
                        {program.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <ul className="space-y-2">
                        {program.items.map((item, idx) => (
                          <li key={idx} className="flex items-center text-blue-950 group-hover:text-blue-950 dark:text-white/90 dark:group-hover:text-white">
                            <div className="w-1.5 h-1.5 dark:bg-white bg-blue-950 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <Link to="/Price">
                          <button className="w-full py-2 dark:bg-white/20 bg-blue-950/80 hover:bg-blue-950 dark:hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-all duration-300 dark:group-hover:bg-white/40">
                            Learn More →
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            {loading && !getSection('about_programs_banner') ? (
              <Skeleton className="h-12 w-96 mx-auto rounded-full" />
            ) : (
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-gray-900 rounded-full shadow-lg">
                <FaBookOpen className="text-2xl text-blue-950 dark:text-yellow-300" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {bannerText}
                </span>
                <FaPray className="text-2xl text-blue-950 dark:text-yellow-300" />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div></>
  );
};

export default About;
