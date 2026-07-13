import { useMemo, useState } from 'react';
import { FiSearch, FiAlertCircle, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { pdf } from '@react-pdf/renderer';
import SEO from "../components/SEO";
import { useWebsiteContent } from "../lib/useWebsiteContent";
import EndOfTermReportTemplate from '@elscholar-ui/feature-module/academic/examinations/exam-results/EndOfTermReportTemplate';

const API_URL = import.meta.env.VITE_API_URL || '';
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN || '';
const AUTH_HEADER = WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {};

const TERMS = ['First Term', 'Second Term', 'Third Term'];

const GRADE_BOUNDARIES = [
  { grade: 'A', min: 80, max: 100, remark: 'Excellent' },
  { grade: 'B+', min: 70, max: 79, remark: 'Very Good' },
  { grade: 'B', min: 60, max: 69, remark: 'Good' },
  { grade: 'C+', min: 50, max: 59, remark: 'Credit' },
  { grade: 'C', min: 40, max: 49, remark: 'Pass' },
  { grade: 'D', min: 30, max: 39, remark: 'Fair' },
  { grade: 'F', min: 0, max: 29, remark: 'Fail' },
];

const getGrade = (score) => {
  if (score == null) return { grade: '-', remark: '-' };
  const found = GRADE_BOUNDARIES.find(b => score >= b.min && score <= b.max);
  return found ? { grade: found.grade, remark: found.remark } : { grade: '-', remark: '-' };
};

const getCurrentTerm = () => {
  const month = new Date().getMonth();
  if (month >= 8) return 'First Term';
  if (month >= 4) return 'Second Term';
  return 'Third Term';
};

const generateYearTerms = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const startYear = month >= 8 ? year : year - 1;
  const items = [];
  for (let i = -1; i <= 1; i++) {
    const sy = startYear + i;
    for (const term of TERMS) {
      items.push({ term, academicYear: `${sy}/${sy + 1}`, label: `${term} (${sy}/${sy + 1})`, value: `${term}|${sy}/${sy + 1}` });
    }
  }
  return items;
};

const Results = () => {
  const { meta, getSection, getParagraphs } = useWebsiteContent();
  const [studentId, setStudentId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

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

  const cmsExamConfig = parseStructured('exam_config');
  const examConfig = cmsExamConfig[0] || {};
  const cmsHero = parseStructured('exam_results_hero');
  const examHero = cmsHero[0] || {};

  const yearTerms = useMemo(() => generateYearTerms(), []);
  const defaultTerm = useMemo(() => {
    const t = getCurrentTerm();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const sy = month >= 8 ? year : year - 1;
    return `${t}|${sy}/${sy + 1}`;
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    const [term, academicYear] = (selectedTerm || defaultTerm).split('|');
    try {
      const res = await fetch(`${API_URL}/public/student-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
        body: JSON.stringify({
          admission_no: studentId.trim(),
          academic_year: academicYear,
          term,
        }),
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setResults({ rows: data.data, caConfiguration: data.caConfiguration, studentRemarks: data.studentRemarks });
      } else {
        setError(data.error || 'No results found for this student');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    console.log('📥 PDF download clicked');
    if (!results) { console.log('no results'); return; }
    console.log('rows:', results.rows.length, 'first:', results.rows[0]);
    try {
    const first = results.rows[0];
    console.log('building PDF...');
    const termLabel = first?.term || '';
    const academicYear = first?.academic_year || '';
    const subjects = results.rows.map(r => {
      const computed = getGrade(r.total_score);
      return {
        subject: r.subject,
        subject_code: r.subject_code,
        ca1_score: r.ca1_score,
        ca2_score: r.ca2_score,
        ca3_score: r.ca3_score,
        exam_score: r.exam_score,
        total_score: r.total_score,
        percentage: r.percentage,
        grade: r.grade || computed.grade,
        remark: r.remark || computed.remark,
        term: r.term,
        academic_year: r.academic_year,
        subject_class_average: null,
        subject_position: r.subject_position,
      };
    });
    const totalScore = subjects.reduce((s, r) => s + (r.total_score || 0), 0);
    const finalAvg = subjects.length > 0 ? +(totalScore / subjects.length).toFixed(1) : null;
    const remarks = results.studentRemarks?.[first?.admission_no] || {};
    const reportData = {
      subjects,
      principal_signature: null,
      total_score: totalScore,
      final_average: finalAvg,
    };
    const studentData = {
      student_name: first?.student_name || 'Student',
      admission_no: first?.admission_no || '',
      class_name: first?.class_name || '',
    };
    const schoolInfo = {
      school_name: meta?.school_name || import.meta.env.VITE_SCHOOL_NAME || 'School Name',
      badge_url: meta?.logo_url || null,
      school_motto: examConfig.motto || meta?.tagline || 'Excellence in Education',
      primary_contact: meta?.phone || '',
      email_address: meta?.email || '',
      address: meta?.address || '',
    };
    const defaultGradeBoundaries = [
      { grade: 'A', min_percentage: 80, max_percentage: 100, remark: 'Excellent' },
      { grade: 'B+', min_percentage: 70, max_percentage: 79, remark: 'Very Good' },
      { grade: 'B', min_percentage: 60, max_percentage: 69, remark: 'Good' },
      { grade: 'C+', min_percentage: 50, max_percentage: 59, remark: 'Credit' },
      { grade: 'C', min_percentage: 40, max_percentage: 49, remark: 'Pass' },
      { grade: 'D', min_percentage: 30, max_percentage: 39, remark: 'Fair' },
      { grade: 'F', min_percentage: 0, max_percentage: 29, remark: 'Fail' },
    ];
    const reportConfig = {
      visibility: {
        showPosition: false,
        showSubjectPosition: false,
        showOutOf: false,
        showClassAverage: false,
        showGradeDetails: true,
        showSubjectAverage: false,
        showRemark: true,
        showStudentPhoto: false,
        showHighestLowestAvg: false,
        showFormTeacher: true,
        showTeacherRemarks: true,
        showPrincipalRemarks: true,
        showNextTerm: false,
        showAttendancePerformance: false,
        showAttendanceStats: false,
        showAttendanceRate: false,
        showAttendanceDetails: false,
        showCharacterAssessment: false,
        showPersonalDevEmptyRows: false,
        showSchoolLogo: true,
        showSchoolContactDetails: false,
        showNoInClass: false,
        showClassPosition: false,
        showFinalAverage: true,
      },
    };
    console.log('rendering template with', subjects.length, 'subjects');
    const blob = await pdf(
      <EndOfTermReportTemplate
        reportData={reportData}
        studentData={studentData}
        academicYear={academicYear}
        term={termLabel}
        assessmentType="EXAM"
        school={schoolInfo}
        selected_branch={null}
        gradeBoundaries={defaultGradeBoundaries}
        characterScores={[]}
        expectedTraits={[]}
        formTeacherData={{ teacher_remark: remarks.teacher_remark, principal_remark: remarks.principal_remark }}
        schoolSettings={{}}
        caConfiguration={results.caConfiguration || []}
        reportConfig={reportConfig}
        examRemarks={[]}
      />
    ).toBlob();
    console.log('PDF blob generated, size:', blob?.size);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result_${studentData.student_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF: ' + err.message);
    }
  };

  return (
    <>
      <SEO
        title={examHero.title || 'Results Checker'}
        description={examHero.description || 'Check your examination results. Enter your student ID to view your results.'}
        keywords="exam results, check results, student results"
        canonicalPath="/results"
      />
    <div className="pt-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative overflow-hidden py-28 text-center bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 text-white"
      >
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-yellow-400">
            {examHero.title || 'Results Checker'}
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            {examHero.subtitle || 'Enter your admission number to check your results'}
          </p>
        </div>
      </motion.section>

      {/* Search Form */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Student ID</label>
              <input
                type="text"
                required
                placeholder="Enter your student ID"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Term</label>
              <select
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-base"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                {yearTerms.map((yt) => (
                  <option key={yt.value} value={yt.value}>{yt.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-950 dark:bg-yellow-400 dark:text-blue-950 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FiSearch /> {loading ? 'Searching...' : 'Check Results'}
            </button>
          </form>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="pb-16 bg-white dark:bg-gray-950">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <FiAlertCircle className="shrink-0" size={20} />
              <p>{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {results && results.rows && results.rows.length > 0 && (
        <section className="pb-16 bg-white dark:bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">
                  <FiCheckCircle className="inline text-green-500 me-2" />
                  Results Found ({results.rows.length})
                </h2>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950 text-white text-xs rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <FiDownload size={14} /> PDF
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Student: <span className="font-semibold">{results.rows[0]?.student_name || studentId}</span>
                {results.rows[0]?.class_name && <span className="ms-2">| Class: {results.rows[0].class_name}</span>}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Subject</th>
                      <th className="px-4 py-3 text-center font-semibold">CA1</th>
                      <th className="px-4 py-3 text-center font-semibold">CA2</th>
                      <th className="px-4 py-3 text-center font-semibold">Exam</th>
                      <th className="px-4 py-3 text-center font-semibold">Total</th>
                      <th className="px-4 py-3 text-center font-semibold">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold">Remark</th>
                      <th className="px-4 py-3 text-center font-semibold">Term</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {results.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{r.subject || '-'}</td>
                        <td className="px-4 py-3 text-center">{r.ca1_score ?? '-'}</td>
                        <td className="px-4 py-3 text-center">{r.ca2_score ?? '-'}</td>
                        <td className="px-4 py-3 text-center">{r.exam_score ?? '-'}</td>
                      <td className="px-4 py-3 text-center font-semibold">{r.total_score ?? '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          ((r.grade || getGrade(r.total_score).grade).toUpperCase()) === 'A' ? 'bg-green-100 text-green-700' :
                          ((r.grade || getGrade(r.total_score).grade).toUpperCase()) === 'B' ? 'bg-blue-100 text-blue-700' :
                          ((r.grade || getGrade(r.total_score).grade).toUpperCase()) === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          ((r.grade || getGrade(r.total_score).grade).toUpperCase()) === 'D' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>{r.grade || getGrade(r.total_score).grade}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{r.remark || getGrade(r.total_score).remark || '-'}</td>
                      <td className="px-4 py-3 text-center text-gray-500">{r.term || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {(() => {
              const avg = results.rows.length > 0
                ? (results.rows.reduce((s, r) => s + (r.total_score || 0), 0) / results.rows.length).toFixed(1)
                : null;
              return avg !== null && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-wrap gap-6 text-sm">
                  <div><span className="text-gray-500">Average Score:</span> <strong>{avg}</strong></div>
                  <div><span className="text-gray-500">Subjects:</span> <strong>{results.rows.length}</strong></div>
                </div>
              );
            })()}
          </div>
        </section>
      )}
    </div></>
  );
};

export default Results;
