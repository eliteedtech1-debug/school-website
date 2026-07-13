import { motion } from "framer-motion";
import { Eye, Target, Star, Users, BookOpen, Heart } from "lucide-react";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import { Skeleton, CardSkeleton, TextSkeleton } from "../components/Skeleton";

const coreIconMap = {
  eye: Eye,
  target: Target,
  star: Star,
  users: Users,
  bookopen: BookOpen,
  heart: Heart,
};

const resolveCoreIcon = (name) => {
  const Icon = coreIconMap[name?.toLowerCase().replace(/[-\s]/g, '')] || Star;
  return <Icon className="w-6 h-6" />;
};

export default function VisionMission() {
  const { getSection, loading } = useWebsiteContent();

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

  const cmsVision = parseStructured('vision');
  const cmsMission = parseStructured('mission');
  const cmsVisionValues = parseStructured('vision_values');
  const vision = cmsVision[0] || null;
  const mission = cmsMission[0] || null;
  const visionValues = cmsVisionValues.length > 0
    ? cmsVisionValues.map(v => ({
        icon: resolveCoreIcon(v.icon),
        title: v.title,
        description: v.description,
      }))
    : [];

  return (
    <section className="py-20">
      <div className="">
        {/* Header */}
        <div className="text-center mb-16">
          {loading && !vision && !mission ? (
            <div className="animate-pulse space-y-3">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-72 mx-auto" />
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Vision & Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our commitment to excellence in education and character development
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            {loading && !vision ? (
              <div className="rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                <Skeleton className="w-16 h-16 rounded-xl mb-6" />
                <Skeleton className="h-7 w-40 mb-4" />
                <TextSkeleton lines={3} />
                <div className="space-y-2 mt-6">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
                <Skeleton className="h-4 w-64 mt-8 pt-6" />
              </div>
            ) : (
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-800 hover:border-blue-950 dark:hover:border-yellow-400 transition-colors">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-950 to-blue-900 dark:from-yellow-400 dark:to-yellow-400 flex items-center justify-center mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {vision?.title || "Our Vision"}
              </h3>

              {vision?.description && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {vision.description}
                </p>
              )}

              {vision?.points && vision.points.length > 0 && (
                <div className="space-y-3">
                  {vision.points.map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-950 dark:bg-yellow-400"></div>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {(vision?.quote) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 italic">"{vision.quote}"</p>
                </div>
              )}
            </div>
            )}
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group"
          >
            {loading && !mission ? (
              <div className="rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                <Skeleton className="w-16 h-16 rounded-xl mb-6" />
                <Skeleton className="h-7 w-40 mb-4" />
                <TextSkeleton lines={3} />
                <div className="space-y-2 mt-6">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
                <Skeleton className="h-4 w-64 mt-8 pt-6" />
              </div>
            ) : (
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-800 hover:border-blue-950 dark:hover:border-yellow-400 transition-colors">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-950 to-blue-900 dark:from-yellow-400 dark:to-yellow-400 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {mission?.title || "Our Mission"}
              </h3>

              {mission?.description && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {mission.description}
                </p>
              )}

              {mission?.points && mission.points.length > 0 && (
                <div className="space-y-3">
                  {mission.points.map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-950 dark:bg-yellow-400"></div>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {(mission?.quote) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 italic">"{mission.quote}"</p>
                </div>
              )}
            </div>
            )}
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            {loading && visionValues.length === 0 ? (
              <Skeleton className="h-8 w-48 mx-auto" />
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
                Our Core Values
              </h3>
            )}
          </div>

          {loading && visionValues.length === 0 ? (
            <CardSkeleton count={3} cols={3} />
          ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionValues.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
