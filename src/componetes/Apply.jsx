import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import api from "../lib/axios";

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_DEV_API_URL || 'http://localhost:34567';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID || "";
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN || "";
const AUTH_HEADER = WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysRemaining(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function DeadlineTag({ closingDate }) {
  const days = daysRemaining(closingDate);
  if (days === null) return null;
  if (days <= 0)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        Closed
      </span>
    );
  if (days <= 7)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
        {days} {days === 1 ? "day" : "days"} left
      </span>
    );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
      {days} days left
    </span>
  );
}

const Apply = () => {
  const { getSection, getParagraphs, meta, loading: contentLoading } = useWebsiteContent();

  const applyHero = getSection("apply_hero");

  /* ── Branch selection state ─────────────────────────────────────── */
  const [step, setStep] = useState("branches"); // branches | terms | form | success
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [conductRules, setConductRules] = useState([]);
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  /* ── Fetch branches ────────────────────────────────────────────── */
  useEffect(() => {
    if (!API_URL || !SCHOOL_ID) {
      setLoading(false);
      return;
    }
    fetch(
      `${API_URL}/admission-branches/schools/branches?school_id=${SCHOOL_ID}`,
      { headers: AUTH_HEADER }
    )
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setBranches(res.data.filter((b) => Boolean(b.effective_admission_open)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Fetch terms ───────────────────────────────────────────────── */
  const fetchTerms = async () => {
    if (!API_URL || !SCHOOL_ID) return;
    setTermsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/public/website-content?school_id=${SCHOOL_ID}`,
        { headers: AUTH_HEADER }
      ).then((r) => r.json());
      setConductRules(res?.conduct_rules || []);
    } catch {
      setConductRules([]);
    } finally {
      setTermsLoading(false);
    }
  };

  /* ── Branch select → show terms ────────────────────────────────── */
  const handleBranchSelect = async (branch) => {
    setSelectedBranch(branch);
    setTermsAgreed(false);
    setStep("terms");
    await fetchTerms();
  };

  /* ── Terms agreed → show form ──────────────────────────────────── */
  const proceedToForm = () => {
    if (!termsAgreed) return;
    setStep("form");
  };

  /* ── Form state ────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    gender: "",
    dob: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    previousSchool: "",
    medicalInfo: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/public/applications", {
        ...formData,
        school_id: SCHOOL_ID,
        branch_id: selectedBranch?.branch_id || "",
      });
      setIsSubmitting(false);
      setStep("success");
      toast.success("Application submitted successfully!");
    } catch (err) {
      setIsSubmitting(false);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <>
      <SEO
        title="Admissions"
        description="Apply for admission. Easy online application process for all grade levels."
        keywords="admissions, apply to school, online application, enrollment"
        canonicalPath="/apply"
      />
      <div className="pt-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden py-28 text-center bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 text-white"
        >
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-yellow-400">
              {applyHero?.title || "Apply for Admission"}
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              {getParagraphs("apply_hero")[0]?.text ||
                getParagraphs("apply_hero")[0] ||
                "Choose Your Preferred Branch"}
            </p>
          </div>
        </motion.section>

        {/* ── Step: Branch Selection ──────────────────────────────── */}
        {step === "branches" && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                  Choose Your Preferred Branch
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a branch below to start your admission application
                </p>
              </motion.div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : branches.length > 0 ? (
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <motion.div
                      key={branch.branch_id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {branch.branch_name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                              OPEN
                            </span>
                          </div>
                          {branch.admission_closing_date && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <FiCalendar className="shrink-0" />
                              <DeadlineTag closingDate={branch.admission_closing_date} />
                              <span>
                                Deadline:{" "}
                                {formatDate(branch.admission_closing_date)}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleBranchSelect(branch)}
                          className="shrink-0 flex items-center gap-1.5 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                        >
                          Apply Now <FiExternalLink />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No branches with open admission at this time.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Step: Terms & Conditions ───────────────────────────── */}
        {step === "terms" && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-blue-950 dark:text-yellow-400">
                      Terms & Conditions
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Please read and agree to proceed with{" "}
                      <strong>{selectedBranch?.branch_name}</strong>
                    </p>
                  </div>

                  {/* Rules */}
                  <div className="p-6">
                    {termsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : conductRules.length > 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 max-h-80 overflow-y-auto text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {conductRules.map((section, si) => (
                          <div key={si} className="mb-4 last:mb-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 uppercase text-xs tracking-wide">
                              {section.section_name}
                            </h4>
                            <ul className="space-y-1">
                              {section.rules.map((rule, ri) => (
                                <li
                                  key={rule.id || ri}
                                  className="flex gap-2"
                                >
                                  <span className="text-blue-950 dark:text-yellow-400 mt-0.5 shrink-0">
                                    •
                                  </span>
                                  <span>{rule.rule_text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 text-sm text-gray-400 italic">
                        No school rules have been configured yet.
                      </div>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div className="px-6 pb-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-blue-950 dark:accent-yellow-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        I confirm that I have read, understood, and agree to the
                        above terms and conditions.
                      </span>
                    </label>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button
                      onClick={() => {
                        setStep("branches");
                        setSelectedBranch(null);
                      }}
                      className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={proceedToForm}
                      disabled={!termsAgreed}
                      className="flex items-center gap-1.5 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Proceed to Application <FiExternalLink />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Step: Application Form ─────────────────────────────── */}
        {step === "form" && (
          <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Form Header */}
                <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-400/10 flex items-center justify-center">
                      <FiEdit2 className="text-blue-950 text-xl dark:text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black dark:text-white">
                        Application Form
                      </h2>
                      <p className="text-black dark:text-gray-300">
                        {selectedBranch?.branch_name} — Fill in the required
                        information below
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Student Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Student Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Full Name *
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="Student's full name"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Date of Birth *
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="date"
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.dob}
                              onChange={(e) =>
                                setFormData({ ...formData, dob: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Gender *
                          </label>
                          <select
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                            value={formData.gender}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Applying for *
                          </label>
                          <div className="relative">
                            <FiBook className="absolute left-3 top-3.5 text-gray-400" />
                            <select
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all appearance-none"
                              value={formData.level}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  level: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Level</option>
                              <option value="pre-nursery">Pre-Nursery</option>
                              <option value="nursery">Nursery</option>
                              <option value="primary">Primary School</option>
                              <option value="jss">Junior Secondary</option>
                              <option value="islamiyya">Islamiyya Only</option>
                              <option value="academy-islamiyya">
                                Academy with Islamiyyah
                              </option>
                              <option value="tahfeez">Tahfeez Program</option>
                            </select>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Previous School
                          </label>
                          <input
                            type="text"
                            placeholder="Name of previous school attended"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                            value={formData.previousSchool}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                previousSchool: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guardian Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Guardian Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Guardian Name *
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="Guardian's full name"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.guardianName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  guardianName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Guardian Phone *
                          </label>
                          <div className="relative">
                            <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              placeholder="0800 000 0000"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.guardianPhone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  guardianPhone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Email Address *
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="email"
                              required
                              placeholder="guardian@email.com"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Residential Address *
                          </label>
                          <div className="relative">
                            <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="Full residential address"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all"
                              value={formData.address}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Additional Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Medical Information (Optional)
                          </label>
                          <textarea
                            placeholder="Any medical conditions, allergies, or special needs we should know about"
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all resize-none"
                            value={formData.medicalInfo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                medicalInfo: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            placeholder="Any additional information you'd like to share"
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-blue-500 dark:focus:border-yellow-400 transition-all resize-none"
                            value={formData.notes}
                            onChange={(e) =>
                              setFormData({ ...formData, notes: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            * Required fields
                          </p>
                          <button
                            type="button"
                            onClick={() => setStep("terms")}
                            className="text-sm text-blue-600 dark:text-yellow-400 hover:underline mt-1"
                          >
                            ← Back to Terms
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3.5 bg-blue-950 hover:bg-blue-700 dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-gray-800 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Step: Success ──────────────────────────────────────── */}
        {step === "success" && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-xl mx-auto px-4 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FiCheck className="text-green-600 dark:text-green-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Thank you for your application to{" "}
                  <strong>{selectedBranch?.branch_name}</strong>. We'll contact
                  you shortly.
                </p>
                <button
                  onClick={() => {
                    setStep("branches");
                    setSelectedBranch(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      level: "",
                      gender: "",
                      dob: "",
                      guardianName: "",
                      guardianPhone: "",
                      address: "",
                      previousSchool: "",
                      medicalInfo: "",
                      notes: "",
                    });
                  }}
                  className="px-6 py-3 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Apply for Another Branch
                </button>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Apply;
