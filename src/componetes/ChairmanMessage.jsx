import { motion } from "framer-motion";
import { useWebsiteContent } from "../lib/useWebsiteContent";

const ChairmanMessage = () => {
  const { meta, getSection, getParagraphs, getMedia } = useWebsiteContent();

  const schoolName    = meta?.school_name || "Our School";
  const tagline       = meta?.tagline || "";

  // Chairman section: title field holds "Name | Title | Motto" OR just name
  // Paragraphs hold the body text. Media[0] is the photo.
  const section       = getSection('chairman');
  const rawTitle      = section?.title || "";
  // Support "Name | Title | Motto" pipe-delimited convention
  const titleParts    = rawTitle.split('|').map(s => s.trim());
  const chairmanName  = titleParts[0] || "Chairman";
  const chairmanRole  = titleParts[1] || "Chairman";
  const motto         = titleParts[2] || tagline;

  const photoMedia    = getMedia('chairman');
  const photoUrl      = photoMedia[0]?.url || null;
  const paragraphs    = getParagraphs('chairman');

  const bodyParagraphs = paragraphs.length > 0 ? paragraphs : [];

  return (
    <section className="bg-white dark:bg-gray-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Message from the {chairmanRole}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Leadership, vision, and commitment to academic excellence
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <div className="border-l-4 border-blue-950 dark:border-yellow-400 pl-6">
              <img
                src={photoUrl}
                alt={chairmanName}
                className="w-full aspect-square object-cover rounded-xl shadow-lg mb-6"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {chairmanName}
              </h3>
              <p className="text-blue-950 dark:text-yellow-400 font-semibold">
                {chairmanRole}
              </p>
              {motto && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  "{motto}"
                </p>
              )}
            </div>
          </motion.aside>

          {/* MESSAGE BODY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {bodyParagraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <p className="mt-10 font-bold">
                {chairmanName}<br />
                <span className="text-gray-600 dark:text-gray-400 font-normal">
                  {chairmanRole}, {schoolName}
                </span>
              </p>
            </article>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ChairmanMessage;
