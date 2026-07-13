import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import React from 'react';

/**
 * EndOfTermReportTemplate - English-only React-PDF template
 *
 * 100% replication of jsPDF English version (no RTL, no bilingual)
 * Matches PDFReportTemplate.tsx renderPDFContent function
 */

// Color scheme matching jsPDF version
const getDefaultColors = () => ({
  primary: '#2980b9',
  secondary: '#34495e',
  accent: '#f39c12',
  success: '#27ae60',
  warning: '#e67e22',
  error: '#e74c3c',
  info: '#3498db',
  gradeExcellent: '#52c41a',
  gradeGood: '#faad14',
  gradePoor: '#ff4d4f',
  lightGray: '#f0f2f5',
  darkGray: '#8c8c8c',
  white: '#ffffff',
  border: '#d9d9d9',
  background: '#ffffff',
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    light: '#95a5a6'
  }
});

// Styles matching jsPDF layout
const createStyles = (colors: any, fontSize: 'small' | 'normal' | 'large' = 'normal', spacing: 'compact' | 'normal' | 'relaxed' = 'normal', layoutConfig?: any) => {
  const fontSizes = {
    small: { title: 14, header: 12, body: 10, small: 8, tiny: 7 },
    normal: { title: 16, header: 14, body: 12, small: 10, tiny: 8 },
    large: { title: 18, header: 16, body: 14, small: 12, tiny: 10 }
  };

  const spacings = {
    compact: { section: 3, element: 2, padding: 1 },
    normal: { section: 4, element: 3, padding: 2 },
    relaxed: { section: 6, element: 4, padding: 3 }
  };

  // Validate fontSize and spacing values to prevent undefined errors
  const validFontSize = (fontSize && fontSizes[fontSize]) ? fontSize : 'normal';
  const validSpacing = (spacing && spacings[spacing]) ? spacing : 'normal';

  const fs = fontSizes[validFontSize];
  const sp = spacings[validSpacing];

  // Override with custom values if provided in config
  const finalSpacing = {
    section: layoutConfig?.sectionMargin ?? sp.section,
    element: layoutConfig?.elementMargin ?? sp.element,
    padding: layoutConfig?.itemPadding ?? sp.padding
  };

  return StyleSheet.create({
    page: {
      paddingTop: layoutConfig?.pageMarginTop ?? 20,
      paddingBottom: layoutConfig?.pageMarginBottom ?? 8,
      paddingHorizontal: layoutConfig?.pageMarginHorizontal ?? 15,
      fontFamily: 'Helvetica',
      backgroundColor: colors.white,
      fontSize: fs.body,
    },

    // Header Styles
    header: {
      marginBottom: finalSpacing.element,
      paddingBottom: finalSpacing.padding,
    },
    // Header Layout: Logo Left, Info Left (default)
    headerLogoLeftInfoLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    // Header Layout: Logo Left, Info Center
    headerLogoLeftInfoCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // Header Layout: Logo Center, Info Center
    headerLogoCenterInfoCenter: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    logo: {
      width: 50,
      height: 50,
      marginRight: 8,
    },
    logoCentered: {
      width: 50,
      height: 50,
      marginBottom: 5,
    },
    schoolInfo: {
      flex: 1,
    },
    schoolInfoCentered: {
      alignItems: 'center',
      textAlign: 'center',
    },
    schoolInfoCenteredRow: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
    },
    schoolName: {
      fontSize: fs.title,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: finalSpacing.padding,
    },
    schoolMotto: {
      fontSize: fs.small,
      fontStyle: 'italic',
      color: colors.secondary,
      marginBottom: finalSpacing.padding,
    },
    schoolContact: {
      fontSize: fs.tiny,
      color: colors.darkGray,
    },

    // Report Title
    reportTitleContainer: {
      marginBottom: finalSpacing.element,
      borderTop: `1px solid ${colors.primary}`,
      borderBottom: `1px solid ${colors.primary}`,
      paddingTop: finalSpacing.padding,
      paddingBottom: finalSpacing.padding,
    },
    reportTitle: {
      fontSize: fs.header,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.primary,
      textTransform: 'uppercase',
    },

    // Student Info Section - 2 column layout (jsPDF style)
    studentInfoSection: {
      marginBottom: finalSpacing.element,
      padding: finalSpacing.padding,
      backgroundColor: colors.lightGray,
      borderRadius: 4,
      border: `1px solid ${colors.border}`,
      flexDirection: 'row',
    },
    studentInfoFields: {
      flex: 1,
    },
    studentPhotoBox: {
      width: 55,
      height: 55,
      marginLeft: 6,
      backgroundColor: '#ddd',
      border: `1px solid ${colors.border}`,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    studentPhotoPlaceholderText: {
      fontSize: 7,
      color: '#888',
      textAlign: 'center',
    },
    studentInfoTwoColumnRow: {
      flexDirection: 'row',
      marginBottom: 2,
      justifyContent: 'space-between',
    },
    studentInfoColumn: {
      width: '48%',
      flexDirection: 'row',
    },
    studentInfoLabel: {
      fontWeight: 'bold',
      fontSize: fs.small,
      color: '#000',
      marginRight: 4,
    },
    studentInfoValue: {
      fontSize: fs.small,
      color: '#000',
      flex: 1,
    },

    // Performance Metrics
    performanceSection: {
      marginBottom: finalSpacing.element,
      padding: finalSpacing.padding,
      backgroundColor: colors.lightGray,
      borderRadius: 4,
      border: `1px solid ${colors.border}`,
    },
    performanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    performanceItem: {
      width: '48%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    performanceLabel: {
      fontSize: fs.small,
      fontWeight: 'bold',
      color: '#000',
    },
    performanceValue: {
      fontSize: fs.small,
      color: '#000',
    },

    // Table Styles
    table: {
      width: '100%',
      marginBottom: finalSpacing.element,
      border: `1px solid ${colors.border}`,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderBottom: `1px solid ${colors.border}`,
    },
    tableHeader: {
      padding: 3,
      fontSize: fs.tiny,
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center',
      borderRight: `1px solid ${colors.border}`,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: `1px solid ${colors.border}`,
      minHeight: 15,
    },
    tableRowAlt: {
      backgroundColor: colors.lightGray,
    },
    tableCell: {
      padding: 2,
      fontSize: fs.tiny,
      textAlign: 'center',
      borderRight: `1px solid ${colors.border}`,
      justifyContent: 'center',
    },
    tableCellLeft: {
      textAlign: 'left',
    },

    // Score Styling
    scoreExcellent: {
      color: colors.gradeExcellent,
      fontWeight: 'bold',
    },
    scoreGood: {
      color: colors.gradeGood,
      fontWeight: 'bold',
    },
    scorePoor: {
      color: colors.gradePoor,
      fontWeight: 'bold',
    },

    // Character Assessment Section
    characterSection: {
      marginBottom: finalSpacing.element,
      padding: finalSpacing.padding,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
    },
    characterTitle: {
      fontSize: fs.body,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: finalSpacing.padding,
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: finalSpacing.padding,
    },
    characterRow: {
      flexDirection: 'row',
      marginBottom: 1,
      paddingVertical: 1,
    },
    characterLabel: {
      fontSize: fs.tiny,
      flex: 3,
    },
    characterGrade: {
      fontSize: fs.tiny,
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
    },

    // Attendance Section
    attendanceSection: {
      marginBottom: finalSpacing.element,
      padding: finalSpacing.padding,
      backgroundColor: colors.lightGray,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
    },
    attendanceTitle: {
      fontSize: fs.body,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: finalSpacing.padding,
    },
    attendanceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    attendanceItem: {
      width: '48%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
      padding: 1,
      backgroundColor: colors.white,
      borderRadius: 2,
    },
    attendanceLabel: {
      fontSize: fs.tiny,
    },
    attendanceValue: {
      fontSize: fs.tiny,
      fontWeight: 'bold',
      color: colors.primary,
    },

    // Remarks Section
    remarksSection: {
      marginTop: finalSpacing.section,
      marginBottom: finalSpacing.section,
      padding: finalSpacing.padding,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
    },
    remarksRow: {
      flexDirection: 'row',
      marginBottom: 1,
      padding: 1,
      backgroundColor: colors.white,
      borderRadius: 2,
    },
    remarksLabel: {
      fontSize: fs.small,
      fontWeight: 'bold',
      width: '30%',
    },
    remarksValue: {
      fontSize: fs.small,
      width: '70%',
      color: colors.text.secondary,
    },

    // Grade Scale
    gradeScale: {
      marginBottom: finalSpacing.element,
      padding: finalSpacing.padding,
      backgroundColor: colors.lightGray,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
    },
    gradeScaleTitle: {
      fontSize: fs.small,
      fontWeight: 'bold',
      marginBottom: finalSpacing.padding,
    },
    gradeScaleItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    gradeScaleItem: {
      fontSize: fs.tiny,
      marginRight: 8,
      marginBottom: 1,
    },

    // Footer
    footer: {
      marginTop: finalSpacing.section,
      paddingTop: finalSpacing.padding,
      borderTop: `1px solid ${colors.border}`,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 1,
    },
    footerLabel: {
      fontSize: fs.tiny,
    },
    footerValue: {
      fontSize: fs.tiny,
    },
    footerGenerated: {
      fontSize: 7,
      textAlign: 'center',
      color: colors.darkGray,
      marginTop: 2,
    },
  });
};

// Interfaces
interface CaSetup {
  assessment_type?: string;
  ca_type?: string; // Fallback property name from API
  contribution_percent: string;
  max_score?: number;
  total_max_score?: string;
  is_active?: number; // For filtering active CAs
  status?: string; // For filtering active CAs
}

interface Subject {
  subject?: string;
  ca1_score?: string | number | null;
  ca2_score?: string | number | null;
  ca3_score?: string | number | null;
  ca4_score?: string | number | null;
  ca5_score?: string | number | null;
  ca6_score?: string | number | null;
  exam_score?: string | number | null;
  total_score?: string | number | null;
  grade?: string;
  remark?: string;
  subject_position?: string | number;
  subject_class_average?: string | number;
  [key: string]: any;
}

interface CharacterScore {
  description: string;
  category: string;
  grade?: string;
  admission_no?: string;
  section?: string;
}

interface AttendanceData {
  present?: number;
  absent?: number;
  late?: number;
  excused?: number;
  dismissed?: number;
  'half-day-in'?: number;
  'half-day-out'?: number;
  total?: number;
  percentage?: number;
}

interface ReportConfig {
  colors?: any;
  layout?: {
    headerLayout?: 'logo-left-info-left' | 'centered' | 'logo-centered-info-below';
    fontSize?: 'small' | 'normal' | 'large';
    spacing?: 'compact' | 'normal' | 'relaxed';
    borderRadius?: 'none' | 'default';
  };
  visibility?: {
    showPosition?: boolean;
    showOutOf?: boolean;
    showClassAverage?: boolean;
    showSubjectPosition?: boolean;
    showSubjectAverage?: boolean;
    showRemark?: boolean;
    showAttendance?: boolean;
    showCharacterAssessment?: boolean;
    capitalizeSubjects?: boolean;
  };
  tableHeaders?: {
    useCustomHeaders?: boolean;
    examName?: string;
    [key: string]: string | boolean | undefined;
  };
  content?: {
    customSchoolMotto?: string;
    customBadgeUrl?: string;
    schoolAddress?: string;
  };
}

interface EndOfTermReportProps {
  reportData: {
    subjects?: Subject[];
    class_average?: string | number | null;
    position?: string | number | null;
    teacher_remark?: string | null;
    principal_remark?: string | null;
    principal_signature?: string | null;
    attendance?: AttendanceData;
    total_score?: number | null;
    final_average?: number | null;
    student_position?: string | number | null;
    total_students?: string | number | null;
  } | null;
  studentData: {
    student_name: string;
    admission_no?: string | number | null;
    class_name?: string | null;
    section?: string | null;
    profile_picture?: string | null;
  };
  academicYear?: string | number | null;
  term?: string | null;
  assessmentType?: string; // NEW: CA1, CA2, EXAM, etc.
  school?: {
    badge_url?: string | null;
    school_name?: string | null;
    school_motto?: string | null;
    primary_contact?: string | null;
    email_address?: string | null;
    address?: string | null;
    personal_dev_scale?: string | null;
  } | null;
  selected_branch?: {
    location?: string | null;
  } | null;
  gradeBoundaries?: Array<{
    grade: string;
    min_percentage: number;
    max_percentage: number;
    remark?: string;
  }>;
  characterScores?: CharacterScore[];
  expectedTraits?: Array<{ category: string; description: string; section: string }>;
  formTeacherData?: {
    teacher_name?: string;
    teacher_signature?: string;
  };
  schoolSettings?: {
    next_term_date?: string;
    manual_attendance_report?: number | string | boolean | null;
    total_days?: number | null;
  };
  caConfiguration?: CaSetup[];
  reportConfig?: ReportConfig | null;
  examRemarks?: any[];
}

const getOrdinalSuffix = (position: string | number | null | undefined): string => {
  if (position === null || position === undefined || position === '') return '—';
  const num = typeof position === 'string' ? parseInt(position, 10) : position;
  if (isNaN(num) || num <= 0) return '—';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Helper function to get effective school data (matching PDFReportTemplate)
const getEffectiveSchoolData = (school: any, config: any) => {
  // Always return a merged object, even if config.content doesn't exist
  const baseSchool = school || {};

  console.log('📋 School data received:', {
    school,
    config,
    hasContent: !!config?.content
  });

  return {
    ...baseSchool,
    school_name: config?.content?.customSchoolName || baseSchool?.school_name || baseSchool?.name || 'School Name',
    address: config?.content?.schoolAddress || baseSchool?.address || baseSchool?.location || '',
    primary_contact: config?.content?.customPrimaryContact || baseSchool?.primary_contact || baseSchool?.primary_contact_number || baseSchool?.phone || '',
    email_address: config?.content?.customEmailAddress || baseSchool?.email_address || baseSchool?.email || '',
    website: config?.content?.customWebsite || baseSchool?.website || '',
    school_motto: config?.content?.customSchoolMotto || baseSchool?.school_motto || baseSchool?.motto || '',
    badge_url: config?.content?.customBadgeUrl || baseSchool?.badge_url || baseSchool?.logo || '',
  };
};

const EndOfTermReportTemplate: React.FC<EndOfTermReportProps> = ({
  reportData,
  studentData,
  academicYear,
  term,
  assessmentType = "EXAM", // Default to EXAM for backward compatibility
  school,
  selected_branch,
  gradeBoundaries = [],
  characterScores = [],
  expectedTraits = [],
  formTeacherData = {},
  schoolSettings = {},
  caConfiguration = [],
  reportConfig = null,
  examRemarks = [],
}) => {
  if (!reportData || !studentData) {
    return null;
  }

  // Debug: Log the data being received
  console.log('🔍 Template received data:', {
    reportData: {
      subjects: reportData.subjects?.slice(0, 2), // First 2 subjects for debugging
      subjectsCount: reportData.subjects?.length
    },
    caConfiguration,
    assessmentType,
    gradeBoundaries: gradeBoundaries?.length ? gradeBoundaries : 'EMPTY OR UNDEFINED'
  });

  // Debug: Log first subject's properties
  if (reportData.subjects && reportData.subjects.length > 0) {
    console.log('🔍 First subject properties:', Object.keys(reportData.subjects[0]));
    console.log('🔍 First subject data:', reportData.subjects[0]);
  }

  // Convert character grades based on school's personal development scale
  const convertCharacterGrade = (grade: string): string => {
    if (!grade || grade === '-') return '-';
    
    const schoolScale = school?.personal_dev_scale || 'Alphabet';
    
    // If school uses Numerical but grade is Alphabetic, convert
    if (schoolScale === 'Numeric') {
      const alphabetToNumeric: { [key: string]: string } = {
        'A': '5', 'B': '4', 'C': '3', 'D': '2', 'E': '1', 'F': '1'
      };
      return alphabetToNumeric[grade.toUpperCase()] || grade;
    }
    
    // If school uses Alphabet but grade is Numeric, convert
    if (schoolScale === 'Alphabet') {
      const numericToAlphabet: { [key: string]: string } = {
        '5': 'A', '4': 'B', '3': 'C', '2': 'D', '1': 'E'
      };
      return numericToAlphabet[grade] || grade;
    }
    
    return grade;
  };

  // Debug: Log principal signature in template
  console.log('📝 Template received principal_signature:', reportData.principal_signature);

  // Strategy: Use finalEffectiveSchool pattern (matching PDFReportTemplate)
  let effectiveSchool = getEffectiveSchoolData(school, reportConfig);
  const effectiveReportConfig = reportConfig;

  // If school data is missing or incomplete, provide fallback
  if (!school || !school.school_name) {
    console.warn('⚠️ School data missing or incomplete, using fallback');
    effectiveSchool = getEffectiveSchoolData({
      school_name: "School Name Not Provided",
      address: school?.address || "",
      primary_contact: school?.primary_contact || "",
      email_address: school?.email_address || "",
      website: school?.website || "",
      school_motto: school?.school_motto || "",
      badge_url: school?.badge_url || ""
    }, effectiveReportConfig);
  }

  const finalEffectiveSchool = effectiveSchool;
  const finalReportConfig = effectiveReportConfig;

  console.log('✅ Final effective school data:', finalEffectiveSchool);
  console.log('📊 Original school prop:', school);
  console.log('🔧 Report config:', finalReportConfig);

  // Get colors from config or use defaults
  const defaultColors = getDefaultColors();
  const colors = finalReportConfig?.colors ? { ...defaultColors, ...finalReportConfig.colors } : defaultColors;

  // Get layout settings with validation
  const validFontSizes: ('small' | 'normal' | 'large')[] = ['small', 'normal', 'large'];
  const validSpacings: ('compact' | 'normal' | 'relaxed')[] = ['compact', 'normal', 'relaxed'];

  const fontSize = validFontSizes.includes(finalReportConfig?.layout?.fontSize as any)
    ? finalReportConfig?.layout?.fontSize as 'small' | 'normal' | 'large'
    : 'normal';
  const spacing = validSpacings.includes(finalReportConfig?.layout?.spacing as any)
    ? finalReportConfig?.layout?.spacing as 'compact' | 'normal' | 'relaxed'
    : 'normal';
  const headerLayout = finalReportConfig?.layout?.headerLayout || 'logo-left-info-left';

  // Get visibility settings - use direct API field names (no mapping)
  const configVisibility = finalReportConfig?.visibility || {};
  const visibility = {
    showPosition: configVisibility.showPosition ?? true,
    showSubjectPosition: configVisibility.showSubjectPosition ?? true,
    showOutOf: configVisibility.showOutOf ?? true,
    showClassAverage: configVisibility.showClassAverage ?? true,
    showGradeDetails: configVisibility.showGradeDetails ?? true,
    showSubjectAverage: configVisibility.showSubjectAverage ?? true,
    showRemark: configVisibility.showRemark ?? true,
    showStudentPhoto: configVisibility.showStudentPhoto ?? false,
    showHighestLowestAvg: configVisibility.showHighestLowestAvg ?? false,
    showFormTeacher: configVisibility.showFormTeacher ?? true,
    showTeacherRemarks: configVisibility.showTeacherRemarks ?? true,
    showPrincipalRemarks: configVisibility.showPrincipalRemarks ?? true,
    showNextTerm: configVisibility.showNextTerm ?? true,
    showAttendancePerformance: configVisibility.showAttendancePerformance ?? true,
    showAttendanceStats: configVisibility.showAttendanceStats ?? true,
    showAttendanceRate: configVisibility.showAttendanceRate ?? true,
    showAttendanceDetails: schoolSettings?.manual_attendance_report == 1 ? false : (configVisibility.showAttendanceDetails ?? false),
    showCharacterAssessment: configVisibility.showCharacterAssessment ?? true,
    showPersonalDevEmptyRows: configVisibility.showPersonalDevEmptyRows ?? true,
    showSchoolLogo: configVisibility.showSchoolLogo ?? true,
    showSchoolContactDetails: configVisibility.showSchoolContactDetails ?? true,
    showNoInClass: configVisibility.showNoInClass ?? true,
    showClassPosition: configVisibility.showClassPosition ?? true,
    showFinalAverage: configVisibility.showFinalAverage ?? true,
  };

  // Use pre-calculated class average from reportData; fall back to subject averages only if not provided
  const classAverage = reportData.class_average != null
    ? parseFloat(String(reportData.class_average))
    : (reportData.subjects && reportData.subjects.length > 0
        ? (() => {
            const validAvgs = reportData.subjects
              .map(row => parseFloat(String(row.subject_class_average)))
              .filter(v => !isNaN(v) && v > 0);
            return validAvgs.length > 0 ? validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length : null;
          })()
        : null);

  // Create styles with config
  const styles = createStyles(colors, fontSize, spacing, finalReportConfig?.layout);

  // Process CA Configuration
  const processCaConfiguration = () => {
    console.log('🔍 Processing CA Configuration - RAW DATA:', {
      caConfiguration,
      assessmentType,
      length: caConfiguration?.length,
      sample: caConfiguration?.[0],
      allConfigs: caConfiguration?.map(c => ({
        assessment_type: c.assessment_type,
        ca_type: c.ca_type,
        contribution_percent: c.contribution_percent,
        max_score: c.max_score,
        is_active: c.is_active,
        normalized_type: (c.assessment_type || c.ca_type || '').toLowerCase().trim(),
        raw_object: c // Include full object for debugging
      }))
    });
    
    console.log('⚠️ BLOSSOM DEBUG - Full caConfiguration:', JSON.stringify(caConfiguration, null, 2));
    
    // Log all exam entries found
    const allExams = caConfiguration?.filter(c => {
      const type = (c.assessment_type || c.ca_type || '').toLowerCase().trim();
      return type === 'exam' || type === 'examination' || type.includes('exam');
    }) || [];
    console.log('🔍 All exam entries found in caConfiguration:', allExams);
    
    // Log all CA entries (non-exam)
    const allCAs = caConfiguration?.filter(c => {
      const type = (c.assessment_type || c.ca_type || '').toLowerCase().trim();
      return !(type === 'exam' || type === 'examination' || type.includes('exam'));
    }) || [];
    console.log('🔍 All CA entries (non-exam) found in caConfiguration:', allCAs.map(c => ({
      assessment_type: c.assessment_type,
      ca_type: c.ca_type,
      contribution_percent: c.contribution_percent
    })));

    // For CA reports (CA1, CA2, etc.), only show the selected CA column
    if (assessmentType !== "EXAM" && assessmentType !== "END_OF_SESSION_AGGREGATE" && assessmentType !== "CUMULATIVE_CA") {
      const selectedCaConfig = caConfiguration?.find((caConfig: CaSetup) => {
        const caType = caConfig.assessment_type?.toLowerCase();
        return caType === assessmentType.toLowerCase();
      });

      if (selectedCaConfig) {
        const weight = parseFloat((selectedCaConfig.contribution_percent || '0').toString().replace('%', '')) || 0;
        const maxScore = selectedCaConfig.max_score || 20;
        
        return {
          caHeaders: [{
            key: assessmentType.toLowerCase(),
            displayName: assessmentType,
            weight: weight,
            maxScore: maxScore,
            fieldName: `${assessmentType.toLowerCase()}_score`
          }],
          examHeader: null // No exam column for CA reports
        };
      } else {
        // Fallback for CA reports when no config found
        return {
          caHeaders: [{
            key: assessmentType.toLowerCase(),
            displayName: assessmentType,
            weight: 20,
            maxScore: 20,
            fieldName: `${assessmentType.toLowerCase()}_score`
          }],
          examHeader: null
        };
      }
    }

    // For END_OF_SESSION_AGGREGATE, use same column structure as normal EXAM report
    // (data has ca1_score, ca2_score, exam_score per subject — averaged across terms)

    // For EXAM reports, show all CAs and exam (original logic)
    // Fallback: If no caConfiguration, use reportConfig tableHeaders or localStorage
    if (!caConfiguration || caConfiguration.length === 0) {
      console.warn('⚠️ No CA configuration found, using reportConfig or localStorage fallback');
      
      // Try to get from reportConfig first
      const tableHeaders = reportConfig?.tableHeaders;
      if (tableHeaders && tableHeaders.useCustomHeaders) {
        const ca1Weight = caConfiguration.find(c => c.assessment_type === 'ca1')?.contribution_percent || '10';
        const ca2Weight = caConfiguration.find(c => c.assessment_type === 'ca2')?.contribution_percent || '20';
        const examWeight = caConfiguration.find(c => c.assessment_type === 'exam')?.contribution_percent || '70';
        
        return {
          caHeaders: [
            { key: 'ca1', displayName: tableHeaders.ca1Name, weight: ca1Weight, maxScore: 20, fieldName: 'ca1_score' },
            { key: 'ca2', displayName: tableHeaders.ca2Name, weight: ca2Weight, maxScore: 20, fieldName: 'ca2_score' }
          ],
          examHeader: { key: 'exam', displayName: tableHeaders.ca3Name, weight: examWeight, maxScore: 60, fieldName: 'exam_score' }
        };
      }
      
      // Fallback to localStorage or default
      const storedConfig = localStorage.getItem('reportConfig');
      if (storedConfig) {
        try {
          const config = JSON.parse(storedConfig);
          const headers = config.tableHeaders;
          if (headers && headers.useCustomHeaders) {
            return {
              caHeaders: [
                { key: 'ca1', displayName: headers.ca1Name, weight: headers.ca1Score, maxScore: 20, fieldName: 'ca1_score' },
                { key: 'ca2', displayName: headers.ca2Name, weight: headers.ca2Score, maxScore: 20, fieldName: 'ca2_score' }
              ],
              examHeader: { key: 'exam', displayName: headers.ca3Name, weight: headers.ca3Score, maxScore: 60, fieldName: 'exam_score' }
            };
          }
        } catch (e) {
          console.warn('Failed to parse stored reportConfig');
        }
      }
      
      // Final fallback to default
      return {
        caHeaders: [
          { key: 'ca1', displayName: 'CA1', weight: 20, maxScore: 20, fieldName: 'ca1_score' },
          { key: 'ca2', displayName: 'CA2', weight: 20, maxScore: 20, fieldName: 'ca2_score' }
        ],
        examHeader: { key: 'exam', displayName: 'Exam', weight: 60, maxScore: 60, fieldName: 'exam_score' }
      };
    }

    const activeCAs = caConfiguration?.filter((caConfig: CaSetup) => {
      const assessmentType = (caConfig.assessment_type || caConfig.ca_type || '').toLowerCase().trim();
      
      // Strictly exclude exam entries - check for exact match or contains 'exam'
      // Check multiple variations to catch all exam entries
      const isExam = assessmentType === 'exam' || 
                     assessmentType === 'examination' || 
                     assessmentType === 'exams' ||
                     assessmentType.startsWith('exam') ||
                     assessmentType.endsWith('exam') ||
                     assessmentType.includes('exam');
      
      if (isExam) {
        console.log('🚫 Filtering out exam entry from CAs:', {
          assessment_type: caConfig.assessment_type,
          ca_type: caConfig.ca_type,
          contribution_percent: caConfig.contribution_percent,
          normalized_type: assessmentType
        });
      }
      return !isExam;
    }) || [];
    
    console.log('✅ Active CAs after filtering:', activeCAs.map(c => ({
      assessment_type: c.assessment_type,
      ca_type: c.ca_type,
      contribution_percent: c.contribution_percent
    })));

    // Group by assessment_type to avoid duplicate columns (backend now deduplicates, this is a safety net)
    const uniqueCAs = activeCAs.reduce((acc: CaSetup[], ca: CaSetup) => {
      const caType = (ca.assessment_type || ca.ca_type || '').toLowerCase();
      if (!acc.find(c => (c.assessment_type || c.ca_type || '').toLowerCase() === caType)) {
        acc.push(ca);
      }
      return acc;
    }, []);

    console.log('✅ Unique CAs after grouping:', uniqueCAs);

    // Sort CAs by assessment_type to ensure correct order (CA1, CA2, CA3, CA4, CA5, CA6, CA7, etc.)
    // IMPORTANT: Exam should NOT be in this list (already filtered out)
    const sortedCAs = [...uniqueCAs].sort((a, b) => {
      const aType = (a.assessment_type || a.ca_type || '').toLowerCase().trim();
      const bType = (b.assessment_type || b.ca_type || '').toLowerCase().trim();
      
      // Safety check: If either is exam, it shouldn't be here (log error)
      if (aType.includes('exam') || bType.includes('exam')) {
        console.error('❌ ERROR: Exam entry found in sortedCAs! This should have been filtered out:', { a, b });
      }
      
      // Extract numeric part for sorting (CA1 -> 1, CA2 -> 2, CA6 -> 6, etc.)
      // Use 0 for non-numeric entries (shouldn't happen for CAs)
      const aNum = parseInt(aType.replace(/\D/g, '')) || 0;
      const bNum = parseInt(bType.replace(/\D/g, '')) || 0;
      
      return aNum - bNum;
    });
    
    console.log('✅ Sorted CAs (should NOT contain exam):', sortedCAs.map(c => ({
      assessment_type: c.assessment_type,
      ca_type: c.ca_type,
      contribution_percent: c.contribution_percent
    })));

    // Find all exam configs and use the one with highest weight (or first one if weights are equal)
    const allExamConfigs = caConfiguration?.filter((caConfig: CaSetup) => {
      const assessmentType = (caConfig.assessment_type || caConfig.ca_type || '').toLowerCase().trim();
      return assessmentType === 'exam' || assessmentType === 'examination' || assessmentType.includes('exam');
    }) || [];
    
    const examConfig = allExamConfigs.length > 0 
      ? allExamConfigs.reduce((prev, current) => {
          const prevWeight = parseFloat((prev.contribution_percent || '0').toString().replace('%', '')) || 0;
          const currentWeight = parseFloat((current.contribution_percent || '0').toString().replace('%', '')) || 0;
          return currentWeight > prevWeight ? current : prev;
        })
      : null;

    if (allExamConfigs.length > 1) {
      console.warn('⚠️ Multiple exam configs found, using the one with highest weight:', {
        allConfigs: allExamConfigs,
        selected: examConfig
      });
    }
    console.log('✅ Exam config found:', examConfig);

    const useCustomHeaders = finalReportConfig?.tableHeaders?.useCustomHeaders;
    const customHeaders = finalReportConfig?.tableHeaders || {};

    const caHeaders = sortedCAs
      .filter((caConfig: CaSetup) => {
        // Additional safeguard: double-check that this is not an exam entry
        const assessmentType = (caConfig.assessment_type || caConfig.ca_type || '').toLowerCase().trim();
        const isExam = assessmentType === 'exam' || 
                       assessmentType === 'examination' || 
                       assessmentType.includes('exam');
        if (isExam) {
          console.warn('⚠️ Exam entry found in CA headers, filtering out:', caConfig);
        }
        return !isExam;
      })
      .map((caConfig: CaSetup, index: number) => {
        const assessmentType = caConfig.assessment_type || caConfig.ca_type || `ca${index + 1}`;
        // Normalize key to lowercase for consistent matching
        const normalizedKey = assessmentType.toLowerCase().trim();
        
        // Safety check: Ensure this is NOT an exam entry
        if (normalizedKey.includes('exam')) {
          console.error('❌ ERROR: Exam entry found when creating CA header!', caConfig);
          return null; // Skip this entry
        }
        
        let headerName = assessmentType.toUpperCase(); // Default to uppercase display (CA1, CA2, etc.)

        if (useCustomHeaders) {
          const customName = customHeaders[`ca${index + 1}Name`];
          if (typeof customName === 'string' && customName.trim() !== '') {
            headerName = customName; // Use custom name as-is, even if it's "Trump" or "EXAM"
          }
        } else {
          // Only apply friendly labels if NOT using custom headers
          if (normalizedKey === 'ca1') {
            headerName = '1st CA';
          } else if (normalizedKey === 'ca2') {
            headerName = '2nd CA';
          } else if (normalizedKey === 'ca3') {
            headerName = '3rd CA';
          } else if (normalizedKey === 'ca4') {
            headerName = '4th CA';
          } else if (normalizedKey === 'ca5') {
            headerName = '5th CA';
          } else if (normalizedKey === 'ca6') {
            headerName = '6th CA';
          } else if (normalizedKey === 'ca7') {
            headerName = '7th CA';
          }
        }

        const weight = parseFloat((caConfig.contribution_percent || '0').toString().replace('%', '')) || 0;
        const maxScore = caConfig.max_score || 20;

        // Use normalized key for matching, but preserve original for display
        const caHeader = {
          key: normalizedKey, // Use lowercase for consistent property matching
          displayName: headerName, // Use display name (may be custom)
          weight: weight,
          maxScore: maxScore,
          fieldName: `${normalizedKey}_score` // Match subject data property names (ca1_score, ca2_score, etc.)
        };

        console.log('📊 Created CA header:', caHeader);
        return caHeader;
      })
      .filter((ca): ca is NonNullable<typeof ca> => ca !== null); // Remove any null entries

    const examHeader = examConfig ? {
      key: 'exam',
      displayName: `${useCustomHeaders && customHeaders.examName ? customHeaders.examName : 'Exam'}`,
      weight: parseFloat((examConfig.contribution_percent || '60').toString().replace('%', '')) || 60,
      maxScore: examConfig.max_score || 60,
      fieldName: 'exam_score'
    } : null;

    // For Cumulative CA Report, hide the exam column
    const finalExamHeader = assessmentType === "CUMULATIVE_CA" ? null : examHeader;

    // Final safety check: Remove any exam entries that might have slipped through
    // Only filter by key, not displayName, to avoid filtering CA3 that happens to be named "EXAM"
    const finalCaHeaders = caHeaders.filter(ca => {
      const keyLower = ca.key.toLowerCase().trim();
      const isExam = keyLower === 'exam' || 
                     keyLower === 'examination' || 
                     keyLower.includes('exam');
      if (isExam) {
        console.error('❌ ERROR: Exam entry found in final CA headers! This should not happen:', ca);
      }
      return !isExam;
    });

    console.log('✅ Final CA Headers (after final filter):', finalCaHeaders);
    console.log('✅ Final Exam Header:', examHeader);
    console.log('📋 Sample subject data:', reportData?.subjects?.[0]);

    return { caHeaders: finalCaHeaders, examHeader: finalExamHeader };
  };

  const { caHeaders, examHeader } = processCaConfiguration();

  console.log('📋 CA Configuration Debug:', {
    caConfiguration,
    caHeaders,
    examHeader,
    sampleSubject: reportData?.subjects?.[0]
  });

  // Grade calculation helper - uses school's specific grade boundaries
  // Calculate final grade based on final average percentage
  const calculateFinalGrade = (finalAverage: number | null | undefined): string => {
    if (finalAverage == null || !gradeBoundaries || gradeBoundaries.length === 0) {
      return 'N/A';
    }
    
    // Sort boundaries by min_percentage descending to check highest grades first
    const sortedBoundaries = [...gradeBoundaries].sort((a, b) => b.min_percentage - a.min_percentage);
    
    const boundary = sortedBoundaries.find(b => finalAverage >= b.min_percentage);
    
    return boundary?.grade || 'N/A';
  };

  const calculateFinalRemark = (finalAverage: number | null | undefined): string => {
    if (finalAverage == null || !gradeBoundaries || gradeBoundaries.length === 0) {
      return 'N/A';
    }
    
    // Sort boundaries by min_percentage descending to check highest grades first
    const sortedBoundaries = [...gradeBoundaries].sort((a, b) => b.min_percentage - a.min_percentage);
    
    const boundary = sortedBoundaries.find(b => finalAverage >= b.min_percentage);
    
    return boundary?.remark || 'N/A';
  };

  // For Cumulative CA, compute effective values from individual CA scores
  let effectiveTotalScore = reportData.total_score;
  let effectiveFinalAverage = reportData.final_average;
  if (assessmentType === 'CUMULATIVE_CA' && reportData.subjects && caHeaders.length > 0) {
    let cumulativeSum = 0;
    const subjectCount = reportData.subjects.length || 1;
    reportData.subjects.forEach(subject => {
      for (let i = 1; i <= caHeaders.length; i++) {
        const score = parseFloat(String((subject as any)[`ca${i}_score`] ?? 0));
        if (!isNaN(score)) cumulativeSum += score;
      }
    });
    const cumulativeMaxPerSubject = caHeaders.reduce((sum, h) => sum + (h.weight || 20), 0);
    const totalMax = cumulativeMaxPerSubject * subjectCount;
    effectiveTotalScore = cumulativeSum;
    effectiveFinalAverage = totalMax > 0 ? (cumulativeSum / totalMax) * 100 : 0;
  }

  const finalGrade = calculateFinalGrade(effectiveFinalAverage);
  const finalRemark = calculateFinalRemark(effectiveFinalAverage);

  const getGradeFromScore = (score: number, totalPossible: number = 100): string => {
    const percentage = totalPossible > 0 ? (score / totalPossible) * 100 : 0;

    console.log('🎯 Grade calculation debug:', {
      score,
      totalPossible,
      percentage,
      gradeBoundariesLength: gradeBoundaries?.length || 0,
      gradeBoundaries: gradeBoundaries?.map(b => ({
        grade: b.grade,
        min: b.min_percentage,
        max: b.max_percentage,
        remark: b.remark
      })) || 'NO BOUNDARIES'
    });

    if (!gradeBoundaries || gradeBoundaries.length === 0) {
      console.log('⚠️ No grade boundaries found, using fallback');
      // Fallback grading when no boundaries are configured
      if (percentage >= 75) return 'A';
      if (percentage >= 70) return 'B';
      if (percentage >= 60) return 'C';
      if (percentage >= 50) return 'D';
      if (percentage >= 40) return 'E';
      return 'F';
    }

    console.log('📊 Grade calculation:', {
      score,
      totalPossible,
      percentage,
      gradeBoundaries: gradeBoundaries.map(b => ({
        grade: b.grade,
        min: b.min_percentage,
        max: b.max_percentage
      }))
    });

    // Find the appropriate grade based on score and school's grade boundaries
    // Sort boundaries by min_percentage descending to check highest grades first
    const sortedBoundaries = [...gradeBoundaries].sort((a, b) => {
      const aMin = parseFloat(String(a.min_percentage));
      const bMin = parseFloat(String(b.min_percentage));
      return bMin - aMin;
    });
    
    for (const boundary of sortedBoundaries) {
      const minPercentage = parseFloat(String(boundary.min_percentage));

      console.log('🔍 Checking boundary:', {
        grade: boundary.grade,
        minPercentage,
        percentage,
        matches: percentage >= minPercentage
      });

      if (percentage >= minPercentage) {
        console.log('✅ Found matching grade:', boundary.grade);
        return boundary.grade || '';
      }
    }

    // If no boundary matched, return fallback grade
    if (percentage >= 50) return 'C';
    return 'F';
  };
  const getRemarkFromScore = (score: number, totalPossible: number = 100): string => {
    const percentage = totalPossible > 0 ? (score / totalPossible) * 100 : 0;

    if (!gradeBoundaries || gradeBoundaries.length === 0) {
      // Fallback grading when no boundaries are configured
      if (percentage >= 75) return 'Excellent';
      if (percentage >= 70) return 'V. Good';
      if (percentage >= 60) return 'Good';
      if (percentage >= 50) return 'Average';
      if (percentage >= 40) return 'Fair';
      return 'Poor';
    }

    // Sort boundaries by min_percentage descending to check highest grades first
    const sortedBoundaries = [...gradeBoundaries].sort((a, b) => {
      const aMin = parseFloat(String(a.min_percentage));
      const bMin = parseFloat(String(b.min_percentage));
      return bMin - aMin;
    });
    
    for (const boundary of sortedBoundaries) {
      const minPercentage = parseFloat(String(boundary.min_percentage));

      if (percentage >= minPercentage) {
        return boundary.remark || boundary.grade || '-';
      }
    }

    // Fallback if no boundary matches
    if (percentage >= 50) return 'Pass';
    return 'Poor';
  };
  // Build table headers
  const buildTableHeaders = () => {
    const headers: Array<{ key: string; label: string; width: string; weight?: number }> = [];

    // For MOCK exams, skip CA columns
    if (assessmentType?.startsWith('MOCK')) {
      const columnCount = 5; // Subject, Exam, Total, Grade, Remark
      const totalUnits = 2.5 + (columnCount - 1);
      const standardWidth = `${100 / totalUnits}%`;
      const subjectWidth = `${(100 * 2.5) / totalUnits}%`;

      headers.push({ key: 'subjects', label: 'Subject', width: subjectWidth });
      headers.push({ key: 'exam', label: 'Exam Score', width: standardWidth });
      headers.push({ key: 'total_score', label: 'Total', width: standardWidth });
      headers.push({ key: 'grade', label: 'Grade', width: standardWidth });
      headers.push({ key: 'remark', label: 'Remark', width: `${(100 * 1.5) / totalUnits}%` });
      if (visibility.showSubjectAverage) headers.push({ key: 'average', label: 'Avg.', width: standardWidth });
      if (visibility.showSubjectPosition) {
        headers.push({ key: 'position', label: 'POS', width: `${(100 * 0.7) / totalUnits}%` });
        headers.push({ key: 'out_of', label: 'Out Of', width: `${(100 * 0.7) / totalUnits}%` });
      }
      return headers;
    }

    // Calculate column count for width
    let columnCount = 3; // Subject, Total, Grade
    if (caHeaders.length > 0) columnCount += caHeaders.length;
    if (examHeader) columnCount += 1;
    if (visibility.showSubjectPosition) columnCount += 2; // Position and Out Of together
    if (visibility.showSubjectAverage) columnCount += 1;
    columnCount += 1; // Remark always follows Grade

    // Calculate widths: Subject = 2.5x, others = 1x
    const totalUnits = 2.5 + (columnCount - 1); // Subject gets 2.5 units, others get 1 unit each
    const standardWidth = `${100 / totalUnits}%`;
    const subjectWidth = `${(100 * 2.5) / totalUnits}%`;

    // LTR Layout: Subject, CAs, Exam, Total, Grade, Remark, Avg, Position, OutOf
    headers.push({ key: 'subjects', label: 'Subject', width: subjectWidth });
    caHeaders.forEach(ca => {
      // Final safeguard: Skip any exam entries that might have slipped through
      const caKeyLower = ca.key.toLowerCase().trim();
      if (caKeyLower === 'exam' || caKeyLower === 'examination' || caKeyLower.includes('exam')) {
        console.warn('⚠️ Skipping exam entry in CA headers:', ca);
        return; // Skip this entry
      }
      
      // Use the displayName from CA configuration (already processed from API)
      // Only apply friendly labels if displayName is generic (CA1, CA2, etc.)
      let displayLabel = ca.displayName || ca.key;
      
      // Convert generic CA names to friendly labels only if they match standard patterns
      if (caKeyLower === 'ca1' && (displayLabel === 'CA1' || displayLabel === 'ca1')) {
        displayLabel = '1st CA';
      } else if (caKeyLower === 'ca2' && (displayLabel === 'CA2' || displayLabel === 'ca2')) {
        displayLabel = '2nd CA';
      } else if (caKeyLower === 'ca3' && (displayLabel === 'CA3' || displayLabel === 'ca3')) {
        displayLabel = '3rd CA';
      } else if (caKeyLower === 'ca4' && (displayLabel === 'CA4' || displayLabel === 'ca4')) {
        displayLabel = '4th CA';
      } else if (caKeyLower === 'ca5' && (displayLabel === 'CA5' || displayLabel === 'ca5')) {
        displayLabel = '5th CA';
      } else if (caKeyLower === 'ca6' && (displayLabel === 'CA6' || displayLabel === 'ca6')) {
        displayLabel = '6th CA';
      } else if (caKeyLower === 'ca7' && (displayLabel === 'CA7' || displayLabel === 'ca7')) {
        displayLabel = '7th CA';
      }
      // IMPORTANT: Fix CA entries that incorrectly have "exam" in the label
      if (displayLabel.toLowerCase().includes('exam') && !caKeyLower.includes('exam')) {
        console.warn('⚠️ WARNING: CA entry has EXAM label - correcting it:', {
          key: ca.key,
          wrongLabel: displayLabel,
          caKeyLower
        });
        // Correct the label based on the key
        if (caKeyLower === 'ca3') {
          displayLabel = 'CA3';
        } else {
          displayLabel = ca.key.toUpperCase(); // Fallback to key
        }
      } else if (displayLabel === 'CA3' || displayLabel === 'ca3') {
        displayLabel = 'CA3';
      } else {
        displayLabel = ca.displayName || ca.key.toUpperCase();
      }
      
      headers.push({ 
        key: ca.key, 
        label: displayLabel, 
        weight: ca.weight, // Weight from CA configuration - rendered separately in header
        width: standardWidth 
      });
    });
    // Only add exam header if it exists and we haven't already added it
    if (examHeader && !headers.some(h => h.key === 'exam')) {
      const examLabel = examHeader.displayName || 'Exam';
      headers.push({ 
        key: 'exam', 
        label: examLabel, 
        weight: examHeader.weight, 
        width: standardWidth 
      });
    }
    headers.push({ key: 'total_score', label: 'Total', width: standardWidth });
    headers.push({ key: 'grade', label: 'Grade', width: standardWidth });
    headers.push({ key: 'remark', label: 'Remark', width: `${(100 * 1.5) / totalUnits}%` }); // Always show Remark after Grade
    if (visibility.showSubjectAverage) headers.push({ key: 'average', label: 'Avg.', width: standardWidth });
    if (visibility.showSubjectPosition) {
      headers.push({ key: 'position', label: 'POS', width: `${(100 * 0.7) / totalUnits}%` });
      headers.push({ key: 'out_of', label: 'Out Of', width: `${(100 * 0.7) / totalUnits}%` });
    }

    return headers;
  };

  const tableHeaders = buildTableHeaders();
  
  console.log('📋 Table headers built:', tableHeaders.map(h => ({ key: h.key, label: h.label })));

  // Format number: show decimal only if non-zero (e.g. 10.0 → "10", 10.5 → "10.5")
  const fmt = (n: any) => {
    const num = typeof n === 'string' ? parseFloat(n) : Number(n);
    if (isNaN(num)) return '-';
    return num % 1 === 0 ? String(Math.round(num)) : num.toFixed(1);
  };

  // Helper: Get score style
  const getScoreStyle = (score: any, maxScore: number = 100) => {
    const numericScore = typeof score === 'string' ? parseFloat(score) : Number(score);
    if (isNaN(numericScore)) return {};

    const percentage = (numericScore / maxScore) * 100;
    if (percentage >= 75) return styles.scoreExcellent;
    if (percentage >= 50) return styles.scoreGood;
    return styles.scorePoor;
  };
// Helper: Get subject score with CA lookup logic and percentage calculation
  const getSubjectScore = (subject: Subject, fieldName: string) => {
    console.log('🔍 getSubjectScore called:', { 
      fieldName, 
      subjectKeys: Object.keys(subject),
      subjectSample: {
        ca1_score: subject.ca1_score,
        ca2_score: subject.ca2_score,
        exam_score: subject.exam_score,
        total_score: subject.total_score
      }
    });

    // Handle CA scores with multiple property lookup and convert to percentage
    if ((fieldName.includes('_score') && fieldName !== 'total_score') || fieldName === 'exam' || caHeaders.some(ca => ca.key === fieldName)) {
      let rawScore: any = null;
      let maxPossible: number = 100;

      // Find the corresponding CA configuration for this field
      const caHeader = caHeaders.find(ca => ca.key === fieldName);
      if (caHeader) {
        maxPossible = caHeader.weight; // Use the configured percentage as max
      } else if (fieldName === 'exam' && examHeader) {
        maxPossible = examHeader.weight; // Use exam percentage as max
      }

      // Build comprehensive list of possible property names
      const possibleProps = [
        fieldName,
        `${fieldName}_score`,
        fieldName.replace('_score', ''),
      ];

      // For CA headers, also try caX_score format and assessment_type variations
      if (caHeader) {
        const caIndex = caHeaders.indexOf(caHeader) + 1;
        possibleProps.push(`ca${caIndex}_score`);
        possibleProps.push(`ca${caIndex}`);
        possibleProps.push(`CA${caIndex}_score`);
        possibleProps.push(`CA${caIndex}`);
        // Fallback to contribution field for regular schools where score might be null
        possibleProps.push(`ca${caIndex}_contribution`);
      }

      // Enhanced fallback: Try standard CA field names regardless of configuration
      const lowerFieldName = fieldName.toLowerCase().trim();
      if (lowerFieldName === 'ca1' || lowerFieldName.includes('ca1')) {
        possibleProps.push('ca1_score', 'ca1');
      }
      if (lowerFieldName === 'ca2' || lowerFieldName.includes('ca2')) {
        possibleProps.push('ca2_score', 'ca2');
      }
      if (lowerFieldName === 'ca3' || lowerFieldName.includes('ca3')) {
        possibleProps.push('ca3_score', 'ca3');
      }
      if (lowerFieldName === 'ca4' || lowerFieldName.includes('ca4')) {
        possibleProps.push('ca4_score', 'ca4');
      }
      if (lowerFieldName === 'ca5' || lowerFieldName.includes('ca5')) {
        possibleProps.push('ca5_score', 'ca5');
      }
      if (lowerFieldName === 'ca6' || lowerFieldName.includes('ca6')) {
        possibleProps.push('ca6_score', 'ca6');
      }
      if (lowerFieldName === 'exam' || lowerFieldName.includes('exam')) {
        possibleProps.push('exam_score', 'exam');
      }

      console.log('🔍 Trying properties for', fieldName, ':', possibleProps);

      // Try each possible property name
      for (const prop of possibleProps) {
        if (subject[prop] !== undefined && subject[prop] !== null && subject[prop] !== '') {
          rawScore = subject[prop];
          console.log('✅ Found score in property:', prop, '=', rawScore);
          break;
        }
      }

      if (rawScore !== null) {
        const numericScore = typeof rawScore === 'string' ? parseFloat(rawScore) : Number(rawScore);
        if (!isNaN(numericScore)) {
          console.log('✅ Returning score:', fmt(numericScore));
          return fmt(numericScore);
        }
      }

      console.log('❌ No score found for field:', fieldName);
      return '-';
    }

    // Handle total_score - trust the API's weighted total_score
    if (fieldName === 'total_score') {
      const allNull = [1,2,3,4,5,6,7].every(i => subject[`ca${i}_score`] == null) && subject.exam_score == null;
      if (allNull) return '-';

      // For Cumulative CA, compute total as sum of individual CA scores
      if (assessmentType === 'CUMULATIVE_CA') {
        const caTotal = [1,2,3,4,5,6,7].reduce((sum, i) => {
          const val = parseFloat(String(subject[`ca${i}_score`] ?? 0));
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        return fmt(caTotal);
      }

      if (subject.total_score !== null && subject.total_score !== undefined) {
        const val = parseFloat(String(subject.total_score));
        if (!isNaN(val) && val > 0) return fmt(val);
      }
      if (subject.percentage !== null && subject.percentage !== undefined) {
        const val = parseFloat(String(subject.percentage));
        return isNaN(val) ? '-' : fmt(val);
      }
      return '-';
    }

    // Handle other fields normally
    const value = subject[fieldName];
    if (value === undefined || value === null || value === '') return '—';
    return String(value);
  };

  const getScoreWithStyle = (subject: any, fieldName: string, caIndex?: number) => {
    let score: any = null;
    const possibleProps: string[] = [];

    // For CA fields, try multiple property names
    if (fieldName.startsWith('ca') && caIndex) {
      possibleProps.push(`ca${caIndex}_score`);
      possibleProps.push(`CA${caIndex}_score`);
      possibleProps.push(`ca${caIndex}`);
      possibleProps.push(`CA${caIndex}`);

      // Also try the original assessment_type
      const originalCA = caConfiguration.find((_, idx) => idx === caIndex - 1);
      if (originalCA?.assessment_type) {
        possibleProps.push(`${originalCA.assessment_type.toLowerCase()}_score`);
        possibleProps.push(originalCA.assessment_type.toLowerCase());
        possibleProps.push(`${originalCA.assessment_type.toLowerCase()}_contribution`);
      }
    }

    // For exam field
    if (fieldName === 'exam') {
      possibleProps.push('exam_score');
      possibleProps.push('exam');
      possibleProps.push('Exam_score');
      possibleProps.push('Exam');
    }

    for (const prop of possibleProps) {
      if (subject[prop] !== undefined && subject[prop] !== null && subject[prop] !== '') {
        score = subject[prop];
        break;
      }
    }

    // Differentiate between zero scores and missing data
    if (score === null || score === undefined || score === '') {
      return { value: '-', style: {} }; // Missing/unattempted
    }

    const numericScore = parseFloat(String(score));
    if (isNaN(numericScore)) {
      return { value: '-', style: {} }; // Invalid data = missing
    }

    // Return actual score (including 0.0 for attempted but failed)
    return { value: fmt(numericScore), style: getScoreStyle(numericScore) };
  };

  // Combined getScore that handles all cases using getSubjectScore
  const getScore = (subject: Subject, fieldName: string) => {
    console.log('🔍 getScore called:', { subject: subject.subject, fieldName });
    
    // For CA and exam scores, use the enhanced getSubjectScore function
    if ((fieldName.includes('_score') && fieldName !== 'total_score') || 
        fieldName === 'exam' || 
        caHeaders.some(ca => ca.key === fieldName)) {
      const scoreValue = getSubjectScore(subject, fieldName);
      // Get the header weight for this field to determine max score
      const header = tableHeaders.find(h => h.key === fieldName);
      const maxScore = header?.weight || 100; // Use weight (e.g., 20) or default to 100
      return { value: scoreValue, style: scoreValue !== '-' ? getScoreStyle(parseFloat(scoreValue), maxScore) : {} };
    }

    if (fieldName === 'total_score') {
      const scoreValue = getSubjectScore(subject, fieldName);
      // Total column uses 100 as max score
      return { value: scoreValue, style: scoreValue !== '-' ? getScoreStyle(parseFloat(scoreValue), 100) : {} };
    }

    if (fieldName === 'grade') {
      // If all scores are null/missing, subject was not attempted
      const allNull = [1,2,3,4,5,6,7].every(i => subject[`ca${i}_score`] == null) && subject.exam_score == null;
      if (allNull) return { value: '-', style: {} };

      // For Cumulative CA, compute grade from CA-only total and CA max
      if (assessmentType === 'CUMULATIVE_CA') {
        const caTotal = [1,2,3,4,5,6,7].reduce((sum, i) => {
          const val = parseFloat(String(subject[`ca${i}_score`] ?? 0));
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        const caMax = caHeaders.reduce((sum, h) => sum + (h.weight || 20), 0);
        const calculatedGrade = getGradeFromScore(caTotal, caMax);
        return { value: calculatedGrade, style: {} };
      }

      const total = parseFloat(String(subject.total_score ?? ''));
      if (isNaN(total) || total === 0) return { value: '-', style: {} };
      const calculatedGrade = getGradeFromScore(Math.round(total), 100);
      return { value: calculatedGrade, style: {} };
    }

    if (fieldName === 'subjects') {
      const subjectName = subject.subject || '-';
      // Check if capitalization is enabled in config (default: true)
      // Always capitalize unless explicitly set to false
      const shouldCapitalize = finalReportConfig?.visibility?.capitalizeSubjects !== false;
      
      if (subjectName !== '-') {
        if (shouldCapitalize) {
          return { value: subjectName.toUpperCase(), style: {} };
        }
        const titleCased = subjectName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        return { value: titleCased, style: {} };
      }
      
      // Return as-is if capitalization is disabled
      return { value: subjectName, style: {} };
    }

    if (fieldName === 'remark') {
      const allNull = [1,2,3,4,5,6,7].every(i => subject[`ca${i}_score`] == null) && subject.exam_score == null;
      if (allNull) return { value: '-', style: {} };

      // For Cumulative CA, compute remark from CA-only total and CA max
      if (assessmentType === 'CUMULATIVE_CA') {
        const caTotal = [1,2,3,4,5,6,7].reduce((sum, i) => {
          const val = parseFloat(String(subject[`ca${i}_score`] ?? 0));
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        const caMax = caHeaders.reduce((sum, h) => sum + (h.weight || 20), 0);
        const calculatedRemark = getRemarkFromScore(caTotal, caMax);
        const remarkAbbr: Record<string, string> = {
          'Below Average': 'Below Avg',
          'Very Good': 'V.Good',
          'Above Average': 'Abv Avg',
          'Needs Improvement': 'Needs Imp.',
        };
        return { value: remarkAbbr[calculatedRemark] || calculatedRemark, style: {} };
      }

      const total = parseFloat(String(subject.total_score ?? ''));
      if (isNaN(total) || total === 0) return { value: '-', style: {} };
      const calculatedRemark = getRemarkFromScore(Math.round(total), 100);
      const remarkAbbr: Record<string, string> = {
        'Below Average': 'Below Avg',
        'Very Good': 'V.Good',
        'Above Average': 'Abv Avg',
        'Needs Improvement': 'Needs Imp.',
      };
      return { value: remarkAbbr[calculatedRemark] || calculatedRemark, style: {} };
    }

    if (fieldName === 'position') {
      const allNull = [1,2,3,4,5,6,7].every(i => subject[`ca${i}_score`] == null) && subject.exam_score == null;
      const hasNoPosition = subject.subject_position === null || subject.subject_position === undefined;
      if (allNull || hasNoPosition) return { value: '-', style: {} };
      const pos = parseInt(String(subject.subject_position));
      if (isNaN(pos) || pos <= 0) return { value: '-', style: {} };
      const s = ['th', 'st', 'nd', 'rd'];
      const v = pos % 100;
      const ordinal = pos + (s[(v - 20) % 10] || s[v] || s[0]);
      return { value: ordinal, style: {} };
    }

    if (fieldName === 'out_of') {
      // Out Of should be the total number of students in the class, not per subject
      return { value: reportData.total_students ? reportData.total_students.toString() : '-', style: {} };
    }

    if (fieldName === 'average') {
      const allNull = [1,2,3,4,5,6,7].every(i => subject[`ca${i}_score`] == null) && subject.exam_score == null;
      return { value: allNull ? '-' : (subject.subject_class_average ? subject.subject_class_average.toString() : '-'), style: {} };
    }

    return { value: subject[fieldName] || '-', style: {} };
  };

  // Organize character assessments dynamically by category
  const organizeCharacterAssessments = () => {
    console.log('🎭 Character Assessment Debug:', {
      studentSection: studentData.section,
      studentAdmissionNo: studentData.admission_no,
      totalCharacterScores: characterScores.length,
      totalExpectedTraits: expectedTraits.length,
      expectedTraitsSample: expectedTraits.slice(0, 3)
    });
    
    // expectedTraits defines what traits to show (from character_traits table)
    // API already filters by section, so use directly
    const traitsToProcess = expectedTraits;
    if (traitsToProcess.length === 0) {
      console.log('🎭 No traits to process - returning empty');
      return [];
    }
    
    // Create lookup for student's actual scores
    const studentScoreMap = new Map<string, string>();
    const studentScores = characterScores.filter(s => s.admission_no === studentData.admission_no);
    console.log('🎭 Student scores found:', studentScores.length);
    
    studentScores.forEach(s => {
      studentScoreMap.set(`${s.category}|${s.description}`, s.grade || '-');
    });
    
    // Group traits by category with student scores
    // When showPersonalDevEmptyRows is false (default), skip traits with no score
    const showUnscored = visibility.showPersonalDevEmptyRows;
    const groupedByCategory: Record<string, CharacterScore[]> = {};
    traitsToProcess.forEach(({ category, description }) => {
      const grade = studentScoreMap.get(`${category}|${description}`) || '-';
      if (!showUnscored && grade === '-') return; // skip unscored traits
      if (!groupedByCategory[category]) groupedByCategory[category] = [];
      groupedByCategory[category].push({ category, description, grade });
    });

    const result = Object.entries(groupedByCategory);
    console.log('🎭 Final categories:', result.length, result.map(([cat]) => cat));
    return result;
  };

  const characterCategories = organizeCharacterAssessments();

  return (
    <Document>
      {console.log('🎭 Template rendering started')}
      <Page size="A4" style={styles.page}>
        {/* Header - School Info with Dynamic Layout */}
        <View style={styles.header}>
          {/* Layout 1: Logo Left, Info Left (default) */}
          {headerLayout === 'logo-left-info-left' && (
            <View style={styles.headerLogoLeftInfoLeft}>
              {finalEffectiveSchool?.badge_url && finalEffectiveSchool.badge_url.trim() !== '' && (
                <Image
                  style={styles.logo}
                  src={finalEffectiveSchool.badge_url}
                  cache={false}
                />
              )}
              <View style={styles.schoolInfo}>
                <Text style={styles.schoolName}>
                  {finalEffectiveSchool?.school_name || 'School Name'}
                </Text>
                {finalEffectiveSchool?.school_motto && (
                  <Text style={styles.schoolMotto}>
                    {finalEffectiveSchool.school_motto}
                  </Text>
                )}
                {finalEffectiveSchool?.address && (
                  <Text style={styles.schoolContact}>
                    {finalEffectiveSchool.address}
                  </Text>
                )}
                {finalEffectiveSchool?.primary_contact && (
                  <Text style={styles.schoolContact}>
                    Phone: {finalEffectiveSchool.primary_contact}
                  </Text>
                )}
                {finalEffectiveSchool?.email_address && (
                  <Text style={styles.schoolContact}>
                    Email: {finalEffectiveSchool.email_address}
                  </Text>
                )}
                {finalEffectiveSchool?.website && (
                  <Text style={styles.schoolContact}>
                    Website: {finalEffectiveSchool.website}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Layout 2: Logo Left, Info Center */}
          {headerLayout === 'logo-left-info-center' && (
            <View style={styles.headerLogoLeftInfoCenter}>
              {finalEffectiveSchool?.badge_url && finalEffectiveSchool.badge_url.trim() !== '' && (
                <Image
                  style={styles.logo}
                  src={finalEffectiveSchool.badge_url}
                  cache={false}
                />
              )}
              <View style={styles.schoolInfoCenteredRow}>
                <Text style={styles.schoolName}>
                  {finalEffectiveSchool?.school_name || 'School Name'}
                </Text>
                {finalEffectiveSchool?.school_motto && (
                  <Text style={styles.schoolMotto}>
                    {finalEffectiveSchool.school_motto}
                  </Text>
                )}
                {finalEffectiveSchool?.address && (
                  <Text style={styles.schoolContact}>
                    {finalEffectiveSchool.address}
                  </Text>
                )}
                {finalEffectiveSchool?.primary_contact && (
                  <Text style={styles.schoolContact}>
                    Phone: {finalEffectiveSchool.primary_contact}
                  </Text>
                )}
                {finalEffectiveSchool?.email_address && (
                  <Text style={styles.schoolContact}>
                    Email: {finalEffectiveSchool.email_address}
                  </Text>
                )}
                {finalEffectiveSchool?.website && (
                  <Text style={styles.schoolContact}>
                    Website: {finalEffectiveSchool.website}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Layout 3: Logo Center, Info Center */}
          {headerLayout === 'logo-center-info-center' && (
            <View style={styles.headerLogoCenterInfoCenter}>
              {finalEffectiveSchool?.badge_url && finalEffectiveSchool.badge_url.trim() !== '' && (
                <Image
                  style={styles.logoCentered}
                  src={finalEffectiveSchool.badge_url}
                  cache={false}
                />
              )}
              <View style={styles.schoolInfoCentered}>
                <Text style={styles.schoolName}>
                  {finalEffectiveSchool?.school_name || 'School Name'}
                </Text>
                {finalEffectiveSchool?.school_motto && (
                  <Text style={styles.schoolMotto}>
                    {finalEffectiveSchool.school_motto}
                  </Text>
                )}
                {finalEffectiveSchool?.address && (
                  <Text style={styles.schoolContact}>
                    {finalEffectiveSchool.address}
                  </Text>
                )}
                {finalEffectiveSchool?.primary_contact && (
                  <Text style={styles.schoolContact}>
                    Phone: {finalEffectiveSchool.primary_contact}
                  </Text>
                )}
                {finalEffectiveSchool?.email_address && (
                  <Text style={styles.schoolContact}>
                    Email: {finalEffectiveSchool.email_address}
                  </Text>
                )}
                {finalEffectiveSchool?.website && (
                  <Text style={styles.schoolContact}>
                    Website: {finalEffectiveSchool.website}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Report Title with horizontal lines */}
        <View style={styles.reportTitleContainer}>
          <Text style={styles.reportTitle}>
            {assessmentType === "END_OF_SESSION_AGGREGATE" 
              ? `END OF SESSION AGGREGATE REPORT (${reportData?.summary?.terms_count || 3} Terms)`
              : assessmentType?.startsWith("MOCK")
              ? `${assessmentType} EXAM REPORT`
              : assessmentType === "CUMULATIVE_CA"
              ? "CUMULATIVE CA PROGRESS REPORT"
              : assessmentType?.toUpperCase() === "EXAM" ? "END OF TERM REPORT" : `${assessmentType} PROGRESS REPORT`}
          </Text>
        </View>

        {/* Student Information - 2 Column Layout (jsPDF Style) */}
        <View style={styles.studentInfoSection}>
          <View style={styles.studentInfoFields}>
          {/* Row 1: Student Name | Class */}
          <View style={styles.studentInfoTwoColumnRow}>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Student Name:</Text>
              <Text style={styles.studentInfoValue}>{studentData.student_name}</Text>
            </View>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Class:</Text>
              <Text style={styles.studentInfoValue}>{studentData.class_name}</Text>
            </View>
          </View>

          {/* Row 2: Admission No | Term */}
          <View style={styles.studentInfoTwoColumnRow}>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Admission No:</Text>
              <Text style={styles.studentInfoValue}>{studentData.admission_no}</Text>
            </View>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Term:</Text>
              <Text style={styles.studentInfoValue}>{term}</Text>
            </View>
          </View>

          {/* Row 3: No. in Class | Session */}
          <View style={styles.studentInfoTwoColumnRow}>
            {visibility.showNoInClass && reportData.total_students && (
              <View style={styles.studentInfoColumn}>
                <Text style={styles.studentInfoLabel}>No. in Class:</Text>
                <Text style={styles.studentInfoValue}>{reportData.total_students}</Text>
              </View>
            )}
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Session:</Text>
              <Text style={styles.studentInfoValue}>{academicYear}</Text>
            </View>
          </View>
          </View>
          {/* Student Photo */}
          {visibility.showStudentPhoto && (
            <View style={styles.studentPhotoBox}>
              {studentData.profile_picture ? (
                <Image src={studentData.profile_picture} style={{ width: 55, height: 55, borderRadius: 3 }} cache={false} />
              ) : (
                <Text style={styles.studentPhotoPlaceholderText}>{'STUDENT\nPHOTO'}</Text>
              )}
            </View>
          )}
        </View>

        {/* Performance Metrics Section */}
        <View style={styles.performanceSection}>
          {/* Row 1: Total Score | Final Average */}
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Total Score:</Text>
              <Text style={styles.performanceValue}>
                {assessmentType === 'CUMULATIVE_CA' ? fmt(effectiveTotalScore) : (reportData.total_score != null ? fmt(reportData.total_score) : '-')}
              </Text>
            </View>
            {visibility.showFinalAverage && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Final Average:</Text>
                <Text style={styles.performanceValue}>
                  {assessmentType === 'CUMULATIVE_CA' ? `${fmt(effectiveFinalAverage)}%` : (reportData.final_average != null ? `${fmt(reportData.final_average)}%` : '-')}
                </Text>
              </View>
            )}
          </View>
          {/* Row 2: Final Grade | Final Remark */}
          <View style={styles.performanceRow}>
            {visibility.showGradeDetails && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Final Grade:</Text>
                <Text style={styles.performanceValue}>{finalGrade}</Text>
              </View>
            )}
            {visibility.showRemark && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Final Remark:</Text>
                <Text style={styles.performanceValue}>{finalRemark}</Text>
              </View>
            )}
          </View>
          {/* Row 3: Highest Average | Lowest Average */}
          {visibility.showHighestLowestAvg && (
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Highest Average:</Text>
                <Text style={styles.performanceValue}>
                  {reportData.highest_average != null ? `${fmt(reportData.highest_average)}%` : '-'}
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Lowest Average:</Text>
                <Text style={styles.performanceValue}>
                  {reportData.lowest_average != null ? `${fmt(reportData.lowest_average)}%` : '-'}
                </Text>
              </View>
            </View>
          )}
          {/* Row 4: Class Average | Class Position */}
          <View style={styles.performanceRow}>
            {visibility.showClassAverage && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Class Average:</Text>
                <Text style={styles.performanceValue}>
                  {classAverage != null ? `${classAverage.toFixed(2)}%` : '-'}
                </Text>
              </View>
            )}
            {visibility.showClassPosition && (
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Class Position:</Text>
                <Text style={styles.performanceValue}>
                  {getOrdinalSuffix(reportData.student_position || reportData.position)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Subjects Table */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            {tableHeaders.map((header, index) => (
              <View
                key={header.key}
                style={[
                  styles.tableHeader,
                  { width: header.width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
                  ...(index === tableHeaders.length - 1 ? [{ borderRight: 'none' }] : [])
                ]}
              >
                <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{header.label}</Text>
                {header.weight && <Text style={{ fontSize: 6 }}>({header.weight}%)</Text>}
              </View>
            ))}
          </View>

          {reportData.subjects?.map((subject, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                ...(index % 2 === 1 ? [styles.tableRowAlt] : [])
              ]}
            >
              {tableHeaders.map((header, colIndex) => {
                // Use getScore function which handles all property lookups and styling
                const scoreData = getScore(subject, header.key);
                return (
                  <View
                    key={header.key}
                    style={[
                      styles.tableCell,
                      { width: header.width },
                      ...(header.key === 'subjects' ? [styles.tableCellLeft] : []),
                      ...(colIndex === tableHeaders.length - 1 ? [{ borderRight: 'none' }] : [])
                    ]}
                  >
                    <Text style={scoreData.style}>
                      {scoreData.value || '-'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Academic Grading Scale */}
        {gradeBoundaries.length > 0 && (
          <View style={styles.gradeScale}>
            <View style={styles.sectionHeader}>
            <Text style={styles.characterTitle}>Academic Grading Scale:</Text>
            </View>

            <View style={[styles.gradeScaleItems, { backgroundColor: '#ffffff', padding: 4 }]}>
              {gradeBoundaries.map((boundary, index) => {
                // Compact remark mapping
                const compactRemark = boundary.remark ? (() => {
                  const remark = boundary.remark.toLowerCase();
                  if (remark.includes('excellent')) return 'Excellent';
                  if (remark.includes('very good') || remark.includes('v.good')) return 'V.Good';
                  if (remark.includes('good')) return 'Good';
                  if (remark.includes('pass')) return 'Pass';
                  if (remark.includes('fair')) return 'Fair';
                  if (remark.includes('poor')) return 'Poor';
                  return boundary.remark.length > 6 ? boundary.remark.substring(0, 6) : boundary.remark;
                })() : '';
                
                return (
                  <Text key={index} style={styles.gradeScaleItem}>
                    {boundary.grade}={Math.round(boundary.min_percentage)}-{Math.round(boundary.max_percentage)}%{compactRemark ? ` (${compactRemark})` : ''}
                    {index < gradeBoundaries.length - 1 ? ' • ' : ''}
                  </Text>
                );
              })}
            </View>
          </View>
        )}
        {/* Character Assessment - Dynamic Categories */}
        {(() => {
          const isExam = (assessmentType?.toUpperCase() === "EXAM") && assessmentType !== "CUMULATIVE_CA";
          const configAllows = visibility.showCharacterAssessment;
          const hasTraits = expectedTraits && expectedTraits.length > 0;
          console.log('🎭 showPersonalDev check:', { isExam, configAllows, hasTraits, expectedTraitsLen: expectedTraits?.length, characterCategoriesLen: characterCategories.length, assessmentType });
          const showPersonalDev = isExam && configAllows && hasTraits;
          return showPersonalDev;
        })() && (
          <View style={styles.characterSection}>
            <Text style={styles.characterTitle}>Personal Development</Text>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {(() => {
                // Build display columns: categories with >=8 items split into 2 sub-columns
                const displayCols: Array<{ key: string; header: string; items: Array<{ description: string; grade: string }> }> = [];
                const source = characterCategories.length > 0
                  ? characterCategories.map(([cat, items]) => ({ cat, items: items.map(i => ({ description: i.description, grade: convertCharacterGrade(i.grade || '') || '-' })) }))
                  : visibility.showPersonalDevEmptyRows
                    ? Object.entries(
                        expectedTraits.reduce((acc, t) => { if (!acc[t.category]) acc[t.category] = []; acc[t.category].push(t); return acc; }, {} as Record<string, typeof expectedTraits>)
                      ).map(([cat, traits]) => ({ cat, items: traits.map(t => ({ description: t.description, grade: '-' })) }))
                    : [];

                source.forEach(({ cat, items }) => {
                  if (items.length >= 8) {
                    const mid = Math.ceil(items.length / 2);
                    displayCols.push({ key: `${cat}_1`, header: cat, items: items.slice(0, mid) });
                    displayCols.push({ key: `${cat}_2`, header: '', items: items.slice(mid) });
                  } else {
                    displayCols.push({ key: cat, header: cat, items });
                  }
                });

                return displayCols.map((col, idx) => {
                  const shouldCapitalize = finalReportConfig?.visibility?.capitalizeSubjects !== false;
                  return (
                  <View key={col.key} style={{ flex: 1, marginRight: idx < displayCols.length - 1 ? 6 : 0 }}>
                    <View style={{ borderBottom: '1px solid #d9d9d9', paddingBottom: 2, marginBottom: 2, minHeight: 14 }}>
                      {col.header ? (
                        <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>
                          {shouldCapitalize ? col.header.toUpperCase() : col.header.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                        </Text>
                      ) : null}
                    </View>
                    {col.items.map((item, i) => (
                      <View key={i} style={styles.characterRow}>
                        <Text style={styles.characterLabel}>
                          {shouldCapitalize ? item.description.toUpperCase() : item.description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                        </Text>
                        <Text style={styles.characterGrade}>{item.grade}</Text>
                      </View>
                    ))}
                  </View>
                )});
              })()}
            </View>
          </View>
        )}

        {/* Personal Development Grading Scale - Separate section outside characterSection */}
        {(() => {
          const isExam = assessmentType?.toUpperCase() === "EXAM";
          const configAllows = visibility.showCharacterAssessment;
          const hasTraits = expectedTraits && expectedTraits.length > 0;
          const showGradingScale = isExam && configAllows && hasTraits;
          return showGradingScale;
        })() && (
          <View style={styles.gradeScale}>
            <View style={styles.sectionHeader}>
              <Text style={styles.characterTitle}>Personal Development Grading Scale:</Text>
            </View>
            <View style={[styles.gradeScaleItems, { backgroundColor: '#ffffff', padding: 4 }]}>
              {(() => {
                const schoolScale = school?.personal_dev_scale || 'Alphabet';
                const scaleItems = [
                  { remark: 'Excellent', alpha: 'A', numeric: '5' },
                  { remark: 'V.Good', alpha: 'B', numeric: '4' },
                  { remark: 'Good', alpha: 'C', numeric: '3' },
                  { remark: 'Fair', alpha: 'D', numeric: '2' },
                  { remark: 'Poor', alpha: 'E', numeric: '1' }
                ];

                return scaleItems.map((item, index) => (
                  <Text key={index} style={styles.gradeScaleItem}>
                    {item.remark}={schoolScale === 'Numeric' ? item.numeric : item.alpha}={schoolScale === 'Numeric' ? item.alpha : item.numeric}
                    {index < scaleItems.length - 1 ? ' • ' : ''}
                  </Text>
                ));
              })()}
            </View>
          </View>
        )}

        {/* Attendance */}
        {assessmentType?.toUpperCase() === "EXAM" && assessmentType !== "CUMULATIVE_CA" && visibility.showAttendancePerformance && reportData.attendance && (
          <View style={styles.attendanceSection}>
            <Text style={styles.attendanceTitle}>Attendance Summary</Text>

            <View style={styles.attendanceGrid}>
              {schoolSettings?.manual_attendance_report == 1 ? (
                // Manual attendance mode: only show Present and Absent
                <>
                  <View style={styles.attendanceItem}>
                    <Text style={styles.attendanceLabel}>No. of Days Present:</Text>
                    <Text style={styles.attendanceValue}>{reportData.attendance.present || 0}</Text>
                  </View>
                  <View style={styles.attendanceItem}>
                    <Text style={styles.attendanceLabel}>No. of Days Absent:</Text>
                    <Text style={styles.attendanceValue}>{reportData.attendance.absent || 0}</Text>
                  </View>
                  {schoolSettings?.total_days && (
                    <View style={styles.attendanceItem}>
                      <Text style={styles.attendanceLabel}>No of Days School Open:</Text>
                      <Text style={styles.attendanceValue}>{schoolSettings.total_days}</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {/* Non-manual: always show % */}
                  <View style={styles.attendanceItem}>
                    <Text style={styles.attendanceLabel}>Attendance %:</Text>
                    <Text style={styles.attendanceValue}>{reportData.attendance.percentage || 0}%</Text>
                  </View>

                  {/* Detailed breakdown only when showAttendanceDetails is enabled */}
                  {visibility.showAttendanceDetails && (
                    <>
                      <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Present:</Text>
                        <Text style={styles.attendanceValue}>{reportData.attendance.present || 0}</Text>
                      </View>

                      <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Absent:</Text>
                        <Text style={styles.attendanceValue}>{reportData.attendance.absent || 0}</Text>
                      </View>

                      <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Late:</Text>
                        <Text style={styles.attendanceValue}>{reportData.attendance.late || 0}</Text>
                      </View>

                      <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Excused:</Text>
                        <Text style={styles.attendanceValue}>{reportData.attendance.excused || 0}</Text>
                      </View>

                      {reportData.attendance['half-day-in'] !== undefined && (
                        <View style={styles.attendanceItem}>
                          <Text style={styles.attendanceLabel}>Half Day In:</Text>
                          <Text style={styles.attendanceValue}>{reportData.attendance['half-day-in'] || 0}</Text>
                        </View>
                      )}

                      {reportData.attendance['half-day-out'] !== undefined && (
                        <View style={styles.attendanceItem}>
                          <Text style={styles.attendanceLabel}>Half Day Out:</Text>
                          <Text style={styles.attendanceValue}>{reportData.attendance['half-day-out'] || 0}</Text>
                        </View>
                      )}

                      <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Total Days:</Text>
                        <Text style={styles.attendanceValue}>{reportData.attendance.total || 0}</Text>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {/* Remarks Section - Below Grade Scale */}
        {/* Only show container if at least one remark is visible */}
        {(
          (reportData.teacher_remark && visibility.showTeacherRemarks) ||
          (reportData.principal_remark && visibility.showPrincipalRemarks)
        ) && (
          <View style={styles.remarksSection}>
            {reportData.teacher_remark && visibility.showTeacherRemarks && (
              <View style={[styles.remarksRow, { marginBottom: 4, paddingBottom: 4, borderBottom: `1px solid ${colors.border}` }]}>
                <Text style={styles.remarksLabel}>Teacher's Remark:</Text>
                <Text style={styles.remarksValue}>{reportData.teacher_remark}</Text>
              </View>
            )}

            {reportData.principal_remark && visibility.showPrincipalRemarks && (
              <View style={[styles.remarksRow, { marginTop: 2 }]}>
                <Text style={styles.remarksLabel}>{['SS', 'JSS', 'SENIOR SECONDARY', 'JUNIOR SECONDARY'].includes(studentData.section?.toUpperCase() || '') ? "Principal's" : "Head Teacher's"} Remark:</Text>
                <Text style={styles.remarksValue}>{reportData.principal_remark}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Signatures Section */}
          <View style={styles.footerRow}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {typeof formTeacherData?.digital_signature === 'string' && formTeacherData.digital_signature.trim() !== '' ? (
                <>
                  <Text style={styles.footerLabel}>Form Teacher Signature: </Text>
                  <Image 
                    src={formTeacherData.digital_signature}
                    style={{ width: 60, height: 25, marginLeft: 5 }}
                    cache={false}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.footerLabel}>Form Teacher: </Text>
                  <Text style={styles.footerLabel}>
                    {formTeacherData?.fullname || formTeacherData?.name || formTeacherData?.teacher_name || formTeacherData?.full_name || '_________________'}
                  </Text>
                </>
              )}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={styles.footerLabel}>{['SS', 'JSS', 'SENIOR SECONDARY', 'JUNIOR SECONDARY'].includes(studentData.section?.toUpperCase() || '') ? "Principal's" : "Head Teacher's"} Signature: </Text>
              {typeof reportData.principal_signature === 'string' && reportData.principal_signature !== '' ? (
                <Image 
                  src={reportData.principal_signature} 
                  style={{ width: 60, height: 25, marginLeft: 5 }}
                  cache={false}
                />
              ) : (
                <Text style={styles.footerLabel}>_________________</Text>
              )}
            </View>
          </View>

          {/* Date and Next Term */}
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Date: {new Date().toLocaleDateString()}</Text>
            {assessmentType?.toUpperCase() === "EXAM" && schoolSettings.next_term_date && (
              <Text style={styles.footerLabel}>Next Term Begins: {schoolSettings.next_term_date}</Text>
            )}
          </View>

          {/* Generated By */}
          <Text style={styles.footerGenerated}>
            Generated by Elite Core • Powered by Elite Edutech Systems Ltd • {new Date().toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  );

};

export default EndOfTermReportTemplate;
