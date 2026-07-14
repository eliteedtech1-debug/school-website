import { Helmet } from 'react-helmet-async';

const FALLBACK_SITE_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Our School';
const FALLBACK_SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;
const DEFAULT_DESC = `${FALLBACK_SITE_NAME} — A centre for academic excellence and character development. Offering quality education from Early Years to Senior Secondary in Abuja, Nigeria. Enrol today!`;
const DEFAULT_OG_IMAGE = `${FALLBACK_SITE_URL}/school.png`;

const SEO = ({
  title,
  description = DEFAULT_DESC,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalPath = '',
  jsonld,
}) => {
  const siteName = import.meta.env.VITE_SCHOOL_NAME || FALLBACK_SITE_NAME;
  const siteUrl = import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const canonical = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;

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
      <meta property="og:site_name" content={siteName} />
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

export default SEO;
