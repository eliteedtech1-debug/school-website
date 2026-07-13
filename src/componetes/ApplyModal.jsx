import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCalendar, FiExternalLink, FiMapPin } from 'react-icons/fi';

const API_URL   = import.meta.env.VITE_API_URL  || '';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID || '';
const APP_URL   = import.meta.env.VITE_APP_URL   || '';
const WEBSITE_TOKEN  = import.meta.env.VITE_WEBSITE_TOKEN  || '';
const ADMISSION_URL  = import.meta.env.VITE_ADMISSION_URL  || ''; // optional external link
const AUTH_HEADER = WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {};

/* ─── helpers ──────────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function daysRemaining(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}
function DeadlineTag({ closingDate }) {
  const days = daysRemaining(closingDate);
  if (days === null) return null;
  if (days <= 0)  return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Closed</span>;
  if (days === 1) return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">1 day left</span>;
  if (days <= 7)  return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{days} days left</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{days} days left</span>;
}

/* ─── Shared modal shell ───────────────────────────────────────────── */
function ModalShell({ onClose, children }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-blue-950 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function ApplyModal({ onClose }) {
  /* ── If VITE_ADMISSION_URL is set → open it immediately and close ── */
  useEffect(() => {
    if (ADMISSION_URL) {
      window.open(ADMISSION_URL, '_blank', 'noopener,noreferrer');
      onClose();
    }
  }, [onClose]);

  const [branches, setBranches]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [conductRules, setConductRules]     = useState([]);
  const [termsLoading, setTermsLoading]     = useState(false);
  const [termsAgreed, setTermsAgreed]       = useState(false);

  /* If external URL, modal already closed above — render nothing */
  if (ADMISSION_URL) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!API_URL || !SCHOOL_ID) { setLoading(false); return; }
    fetch(`${API_URL}/admission-branches/schools/branches?school_id=${SCHOOL_ID}`, { headers: AUTH_HEADER })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setBranches(res.data.filter(b => Boolean(b.effective_admission_open)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchTerms = async () => {
    if (!API_URL || !SCHOOL_ID) return;
    setTermsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/public/website-content?school_id=${SCHOOL_ID}`,
        { headers: AUTH_HEADER }
      ).then(r => r.json());
      setConductRules(res?.conduct_rules || []);
    } catch { setConductRules([]); }
    finally { setTermsLoading(false); }
  };

  const handleApplyClick = async (branch) => {
    setSelectedBranch(branch);
    setTermsAgreed(false);
    await fetchTerms();
  };

  const proceedToApplication = () => {
    if (!selectedBranch) return;
    const branchId = selectedBranch.branch_id || selectedBranch;
    window.open(`${APP_URL}/application?branch_id=${encodeURIComponent(branchId)}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const fallbackBranchId = import.meta.env.VITE_BRANCH_ID || '';

  /* ── Terms & Conditions step ──────────────────────────────────── */
  if (selectedBranch) {
    const branchName = selectedBranch.branch_name || '';
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-blue-950 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-blue-800">
            <div>
              <h2 className="text-xl font-bold text-blue-950 dark:text-yellow-400">Terms & Conditions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Please read and agree to proceed with <strong>{branchName}</strong>
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-blue-800 rounded-full transition">
              <FiX className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </button>
          </div>

          {/* Rules */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-yellow-400 mb-3">School Rules & Conduct</h3>
            {termsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conductRules.length > 0 ? (
              <div className="bg-gray-50 dark:bg-blue-900/30 rounded-xl p-5 max-h-80 overflow-y-auto text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                {conductRules.map((section, si) => (
                  <div key={si} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 uppercase text-xs tracking-wide">
                      {section.section_name}
                    </h4>
                    <ul className="space-y-1">
                      {section.rules.map((rule, ri) => (
                        <li key={rule.id || ri} className="flex gap-2">
                          <span className="text-blue-950 dark:text-yellow-400 mt-0.5 shrink-0">•</span>
                          <span>{rule.rule_text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-blue-900/30 rounded-xl p-5 text-sm text-gray-400 italic">
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
                onChange={e => setTermsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-950 dark:accent-yellow-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                I confirm that I have read, understood, and agree to the above terms and conditions.
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-blue-800 flex justify-between">
            <button
              onClick={() => setSelectedBranch(null)}
              className="px-5 py-2 border border-gray-300 dark:border-blue-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-blue-900 transition"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2 border border-gray-300 dark:border-blue-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-blue-900 transition">
                Cancel
              </button>
              <button
                onClick={proceedToApplication}
                disabled={!termsAgreed}
                className="flex items-center gap-1.5 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Proceed to Application <FiExternalLink />
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  /* ── Branch selection step ─────────────────────────────────────── */
  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-blue-800">
        <div>
          <h2 className="text-xl font-bold text-blue-950 dark:text-yellow-400">Apply for Admission</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Choose Your Preferred Branch</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-blue-800 rounded-full transition">
          <FiX className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : branches.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-yellow-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-lg">
              <FiMapPin className="shrink-0" />
              <span>Select a branch below to start your admission application</span>
            </div>
            {branches.map(branch => (
              <div key={branch.branch_id} className="border border-gray-200 dark:border-blue-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{branch.branch_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">OPEN</span>
                    </div>
                    {branch.admission_closing_date && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar className="shrink-0" />
                        <DeadlineTag closingDate={branch.admission_closing_date} />
                        <span>Deadline: {formatDate(branch.admission_closing_date)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleApplyClick(branch)}
                    className="shrink-0 flex items-center gap-1.5 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                  >
                    Apply Now <FiExternalLink />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No open branches — show fallback Proceed button */
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-500 dark:text-gray-400">No branches with open admission at this time.</p>
            {fallbackBranchId && (
              <button
                onClick={() => handleApplyClick({ branch_id: fallbackBranchId, branch_name: 'Main Campus' })}
                className="inline-flex items-center gap-1.5 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Proceed to Application <FiExternalLink />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-blue-800 flex justify-end">
        <button onClick={onClose} className="px-5 py-2 border border-gray-300 dark:border-blue-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-blue-900 transition">
          Cancel
        </button>
      </div>
    </ModalShell>
  );
}
