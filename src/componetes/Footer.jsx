import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useWebsiteContent } from '../lib/useWebsiteContent';

const Footer = () => {
  const { meta, getSection, getParagraphs } = useWebsiteContent();

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

  const cmsFooterLinks = parseStructured('footer_links');

  const schoolName = meta?.school_name || "Our School";
  const tagline    = meta?.tagline || "";
  const address    = meta?.address || "";
  const phone      = meta?.phone || "";
  const email      = meta?.email || "";
  const logoUrl    = meta?.logo_url || null;
  const facebook   = meta?.facebook_url || "#";
  const instagram  = meta?.instagram_url || null;
  const twitter    = meta?.twitter_url || null;
  const year       = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--color-primary)' }} className="text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl
                ? <img src={logoUrl} alt={schoolName} className="w-12 h-12 rounded-lg object-cover" />
                : <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}>{schoolName.slice(0,2).toUpperCase()}</div>
              }
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>{schoolName}</h3>
            </div>
            {tagline && <p className="mb-4 text-sm opacity-80">{tagline}</p>}
            {address && (
              <div className="flex items-start gap-2 opacity-80 mt-2">
                <FiMapPin size={16} className="mt-1 shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 opacity-80 mt-2">
                <FiPhone size={16} />
                <span className="text-sm">{phone}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--color-secondary)' }}>
              {getSection('footer_links')?.title || 'Quick Links'}
            </h4>
            <div className="space-y-2">
              {cmsFooterLinks.length > 0 ? cmsFooterLinks.map((link, i) => (
                <Link key={i} to={link.url}
                  className="block text-sm transition-opacity hover:opacity-100 opacity-80"
                  style={{ color: 'var(--color-secondary)' }}>
                  {link.label}
                </Link>
              )) : (
                <>
                  {[['About Us','/about'],['Apply Now','/apply'],['Gallery','/gallery'],['Results','/results'],['Contact','/contact']].map(([label, url]) => (
                    <Link key={url} to={url}
                      className="block text-sm transition-opacity hover:opacity-100 opacity-80"
                      style={{ color: 'var(--color-secondary)' }}>
                      {label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--color-secondary)' }}>Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              {facebook && <a href={facebook} className="transition-opacity hover:opacity-100 opacity-80" style={{ color: 'var(--color-secondary)' }}><FiFacebook size={20} /></a>}
              {instagram && <a href={instagram} className="transition-opacity hover:opacity-100 opacity-80" style={{ color: 'var(--color-secondary)' }}><FiInstagram size={20} /></a>}
              {twitter && <a href={twitter} className="transition-opacity hover:opacity-100 opacity-80" style={{ color: 'var(--color-secondary)' }}><FiTwitter size={20} /></a>}
              {email && <a href={`mailto:${email}`} className="transition-opacity hover:opacity-100 opacity-80" style={{ color: 'var(--color-secondary)' }}><FiMail size={20} /></a>}
            </div>
            <p className="text-sm opacity-80">Follow us for updates and school events</p>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm opacity-60" style={{ borderTop: '1px solid rgba(201,162,39,0.3)' }}>
          <p>&copy; {year} {schoolName}. All rights reserved.</p>
          <p className="mt-1">
            Powered by{' '}
            <a
              href="https://eliteedu.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-secondary)' }}
            >
              Elite Edutech Systems Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
