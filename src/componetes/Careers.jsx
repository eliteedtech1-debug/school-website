import { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiSend,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import { Skeleton, CardSkeleton } from "../components/Skeleton";
import api from "../lib/axios";

const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;

const Careers = () => {
  const { meta, loading: contentLoading } = useWebsiteContent();

  const [jobs, setJobs] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    api
      .get("/recruitment/jobs", { params: { school_id: SCHOOL_ID, public: true } })
      .then((r) => setJobs(r.data.data || []))
      .catch(() => setJobs([]));
  }, []);

  const schoolName = meta?.school_name || "Our School";

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <>
      <SEO
        title="Careers"
        description={`Join ${schoolName}. Explore available job openings and start your career with us.`}
        keywords="careers, jobs, job openings, recruitment, work with us"
        canonicalPath="/careers"
      />
      <div className="pt-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden py-28 text-center bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 text-white"
        >
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            {contentLoading ? (
              <>
                <Skeleton className="h-12 w-64 mx-auto mb-6" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-yellow-400">
                  Careers
                </h1>
                <p className="text-lg md:text-xl text-blue-100">
                  Join our team and make a difference in education at {schoolName}
                </p>
              </>
            )}
          </div>
        </motion.section>

        {/* Open Positions */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
            >
              Open Positions
            </motion.h2>

            {jobs === null ? (
              <CardSkeleton count={3} cols={1} />
            ) : jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <FiBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  No Open Positions Right Now
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We don't have any current openings, but we're always looking for
                  great people. Check back soon!
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-950 dark:bg-yellow-400 text-white dark:text-gray-900 flex items-center justify-center">
                        <FiBriefcase className="w-6 h-6" />
                      </div>
                      {job.position_type && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {job.position_type}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    {job.department && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {job.department}
                      </p>
                    )}
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {job.location && (
                        <p className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" /> {job.location}
                        </p>
                      )}
                      {job.employment_level && (
                        <p className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4" /> {job.employment_level}
                        </p>
                      )}
                      {job.work_schedule && (
                        <p className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" /> {job.work_schedule}
                        </p>
                      )}
                      {job.salary_range && (
                        <p className="flex items-center gap-2">
                          <FiDollarSign className="w-4 h-4" /> {job.salary_range}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      {job.slots_available > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {job.slots_available} slot{job.slots_available > 1 ? "s" : ""}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowApplication(false);
                        }}
                        className="px-4 py-2 rounded-md bg-blue-950 dark:bg-yellow-400 text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Job Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedJob(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedJob.title}
                  </h2>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiX className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {!showApplication ? (
                    <>
                      {selectedJob.description && (
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            Job Description
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {selectedJob.description}
                          </p>
                        </div>
                      )}

                      {selectedJob.requirements && (
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            Requirements
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {selectedJob.requirements}
                          </p>
                        </div>
                      )}

                      {selectedJob.responsibilities && (
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            Responsibilities
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {selectedJob.responsibilities}
                          </p>
                        </div>
                      )}

                      {selectedJob.qualifications && (
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            Qualifications
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {selectedJob.qualifications}
                          </p>
                        </div>
                      )}

                      {selectedJob.benefits && (
                        <div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            Benefits
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {selectedJob.benefits}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={() => setShowApplication(true)}
                          className="px-6 py-3 rounded-md bg-blue-950 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity"
                        >
                          Apply Now
                        </button>
                      </div>
                    </>
                  ) : (
                    <ApplicationForm
                      job={selectedJob}
                      onBack={() => setShowApplication(false)}
                      onClose={() => setSelectedJob(null)}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const ApplicationForm = ({ job, onBack, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    highest_qualification: "",
    institution: "",
    years_of_experience: "",
    current_position: "",
    previous_experience: "",
    skills: "",
    why_join: "",
    resume_url: "",
    cover_letter_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/recruitment/applications", {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : null,
        job_id: job.id,
        school_id: SCHOOL_ID,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.error || "Failed to submit application. Please try again.");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600";

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
        Apply for {job.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Fill in the form below and our HR team will contact you.
      </p>

      {submitSuccess ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Application Submitted!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you for applying. Our team will review your application and
            get back to you soon.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-md bg-blue-950 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold hover:opacity-90"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              First Name *
            </label>
            <input
              required
              className={inputCls}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Last Name *
            </label>
            <input
              required
              className={inputCls}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email *
            </label>
            <input
              required
              type="email"
              className={inputCls}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Phone *
            </label>
            <input
              required
              type="tel"
              className={inputCls}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              className={inputCls}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              State
            </label>
            <input
              className={inputCls}
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Highest Qualification
            </label>
            <input
              className={inputCls}
              value={formData.highest_qualification}
              onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Institution
            </label>
            <input
              className={inputCls}
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              className={inputCls}
              value={formData.years_of_experience}
              onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Current Position
            </label>
            <input
              className={inputCls}
              value={formData.current_position}
              onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Skills (comma separated)
            </label>
            <input
              className={inputCls}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Previous Work Experience
            </label>
            <textarea
              rows="3"
              placeholder="Briefly describe your previous roles"
              className={inputCls}
              value={formData.previous_experience}
              onChange={(e) => setFormData({ ...formData, previous_experience: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Resume / CV Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              className={inputCls}
              value={formData.resume_url}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Cover Letter Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              className={inputCls}
              value={formData.cover_letter_url}
              onChange={(e) => setFormData({ ...formData, cover_letter_url: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Why do you want to join us?
            </label>
            <textarea
              rows="4"
              className={inputCls}
              value={formData.why_join}
              onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-md bg-blue-950 dark:bg-yellow-400 text-white dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="w-4 h-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default Careers;
