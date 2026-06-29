import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Dr. Kabiru Gwarzo Academy';
const SITE_URL = 'https://kirmaskngovschools.com';
const DEFAULT_DESC = 'Dr. Kabiru Gwarzo Academy — Excellence in Education. A premier secondary school nurturing future leaders through quality academics, character development, and holistic education.';
const DEFAULT_OG_IMAGE = '/school.png';

const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalPath = '',
  jsonld,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonld && (
        <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
      )}
    </Helmet>
  );
};

const OrganizationSchema = () => (
  <script type="application/ld+json">{JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/school.png`,
    description: DEFAULT_DESC,
    address: { '@type': 'PostalAddress', addressLocality: 'Kano', addressCountry: 'NG' },
  })}</script>
);

export { SEO, OrganizationSchema };
export default SEO;
