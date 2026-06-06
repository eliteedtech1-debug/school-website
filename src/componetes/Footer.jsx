import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useWebsiteContent } from '../lib/useWebsiteContent';

const Footer = () => {
  const { meta } = useWebsiteContent();

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
    <footer className="bg-gradient-to-b from-blue-950 via-blue-800 to-blue-950 dark:from-gray-900/70 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl
                ? <img src={logoUrl} alt={schoolName} className="w-12 h-12 rounded-lg object-cover" />
                : <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-blue-950 font-bold text-lg">{schoolName.slice(0,2).toUpperCase()}</div>
              }
              <h3 className="text-xl font-bold">{schoolName}</h3>
            </div>
            {tagline && <p className="text-gray-300 mb-4">{tagline}</p>}
            {address && (
              <div className="flex items-start gap-2 text-gray-300">
                <FiMapPin size={16} className="mt-1 shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-gray-300 mt-2">
                <FiPhone size={16} />
                <span className="text-sm">{phone}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">About Us</Link>
              <Link to="/apply" className="block text-gray-300 hover:text-white transition-colors">Apply Now</Link>
              <Link to="/gallery" className="block text-gray-300 hover:text-white transition-colors">Gallery</Link>
              <Link to="/results" className="block text-gray-300 hover:text-white transition-colors">Results</Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              {facebook && <a href={facebook} className="text-gray-300 hover:text-white transition-colors"><FiFacebook size={20} /></a>}
              {instagram && <a href={instagram} className="text-gray-300 hover:text-white transition-colors"><FiInstagram size={20} /></a>}
              {twitter && <a href={twitter} className="text-gray-300 hover:text-white transition-colors"><FiTwitter size={20} /></a>}
              {email && <a href={`mailto:${email}`} className="text-gray-300 hover:text-white transition-colors"><FiMail size={20} /></a>}
            </div>
            <p className="text-gray-300 text-sm">Follow us for updates and school events</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {year} {schoolName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
