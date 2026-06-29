import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { useWebsiteContent } from "../lib/useWebsiteContent";

const Contact = () => {
  const { meta, getParagraphs } = useWebsiteContent();
  const contactParagraphs = getParagraphs('contact');

  const address = meta?.address || "Address not configured";
  const phone   = meta?.phone   || "Phone not configured";
  const email   = meta?.email   || "Email not configured";
  const schoolName = meta?.school_name || "Our School";

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Dr. Kabiru Gwarzo Academy. Find our address, phone numbers, email, and operating hours. We're here to help with admissions and inquiries."
        keywords="contact Dr Kabiru Gwarzo Academy, Kano school address, school phone number, school email, admissions contact"
        canonicalPath="/contact"
      />
    <div className="pt-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 overflow-hidden text-center bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 mb-8"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-4">Contact Us</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          {contactParagraphs[0]?.text || `We'd love to hear from you. Reach out to ${schoolName} anytime.`}
        </p>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <InfoCard icon={<FiMapPin />} title="Address" text={address} />
            <InfoCard icon={<FiClock />} title="School Hours" text={`Mon–Thu: 7:30am – 1:15pm\nFriday: 7:30am – 12:00pm`} />
            <InfoCard icon={<FiPhone />} title="Phone" text={phone} />
            <InfoCard icon={<FiMail />} title="Email" text={email} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 dark:bg-gray-900 border border-gray-600 backdrop-blur-xl rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-blue-950 dark:text-yellow-400">Send a Message</h2>
            <form className="space-y-5">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <textarea rows="8" placeholder="Your Message"
                className="w-full rounded-xl border border-black/60 dark:border-gray-700 px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-yellow-400"
              />
              <button className="w-full bg-blue-950 hover:bg-blue-800 dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-blue-950 text-white py-3 rounded-xl font-semibold transition">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div></>
  );
};

const InfoCard = ({ icon, title, text }) => (
  <div className="flex gap-4 bg-white/70 dark:bg-gray-900 border border-gray-700 backdrop-blur-xl p-5 rounded-2xl">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-yellow-400 text-blue-950 text-xl shrink-0">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{text}</p>
    </div>
  </div>
);

const Input = ({ type = "text", placeholder }) => (
  <input type={type} placeholder={placeholder}
    className="w-full rounded-xl border border-black/60 dark:border-gray-700 px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-yellow-400"
  />
);

export default Contact;
