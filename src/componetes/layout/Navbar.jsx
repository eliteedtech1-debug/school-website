import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { FiUser, FiUsers, FiBookOpen } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import { useWebsiteContent } from "../../lib/useWebsiteContent";
import DarkModeToggle from "./DarkModeToggle";
import ApplyModal from "../ApplyModal";

/* ─── Login URL helper ────────────────────────────────────────────────────
   Priority order for each portal type (staff / parent / student):

   1. VITE_LOGIN_URL_STAFF / VITE_LOGIN_URL_PARENT / VITE_LOGIN_URL_STUDENT
      → School uses a different LMS or custom domain. Use as-is.

   2. Auto-build from VITE_SCHOOL_SHORT_NAME:
      Production : https://{short_name}.elitecore.com.ng/login?type={type}
      Dev (localhost): http://localhost:3000/login?type={type}&school={short_name}
        — the ?school= param auto-fills the unified-login Short Name input.
──────────────────────────────────────────────────────────────────────── */
const SHORT_NAME = import.meta.env.VITE_SCHOOL_SHORT_NAME || "";
const IS_DEV =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Per-type custom URLs from env (blank = use auto-build)
const CUSTOM_URLS = {
  staff:   import.meta.env.VITE_LOGIN_URL_STAFF   || "",
  parent:  import.meta.env.VITE_LOGIN_URL_PARENT  || "",
  student: import.meta.env.VITE_LOGIN_URL_STUDENT || "",
};

function loginUrl(type) {
  // 1. School-specific override
  if (CUSTOM_URLS[type]) return CUSTOM_URLS[type];

  // 2. Auto-build for Elite Core LMS
  if (IS_DEV) {
    const params = new URLSearchParams({ type });
    if (SHORT_NAME) params.set("school", SHORT_NAME);
    return `http://localhost:3000/login?${params.toString()}`;
  }
  const subdomain = SHORT_NAME || window.location.hostname.split(".")[0];
  return `https://${subdomain}.elitecore.com.ng/login?type=${type}`;
}

/* ─── Login dropdown items ──────────────────────────────────────────── */
const LOGIN_ITEMS = [
  {
    type: "staff",
    label: "Staff",
    icon: FiUser,
    desc: "Teachers & Admin",
  },
  {
    type: "parent",
    label: "Parent",
    icon: FiUsers,
    desc: "Parent portal",
  },
  {
    type: "student",
    label: "Student",
    icon: FiBookOpen,
    desc: "Student portal",
  },
];

/* ─── LoginDropdown component ───────────────────────────────────────── */
function LoginDropdown({ isMobile = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
          Login as
        </p>
        {LOGIN_ITEMS.map(({ type, label, icon: Icon, desc }) => (
          <a
            key={type}
            href={loginUrl(type)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-48 px-4 py-2.5 rounded-xl bg-blue-950 dark:bg-yellow-400
                       text-white dark:text-blue-950 font-semibold hover:opacity-80 transition"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
            <span className="ml-auto text-xs opacity-70 font-normal">{desc}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-yellow-400 dark:bg-blue-950
                   text-blue-950 dark:text-yellow-400 font-semibold px-4 py-2
                   rounded-xl hover:opacity-80 transition select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Login
        <HiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-gray-900
                     rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700
                     overflow-hidden z-50 animate-fade-in"
        >
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Login as
            </p>
          </div>
          {LOGIN_ITEMS.map(({ type, label, icon: Icon, desc }) => (
            <a
              key={type}
              href={loginUrl(type)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-800
                         transition group"
            >
              <span
                className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40
                           flex items-center justify-center flex-shrink-0
                           group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition"
              >
                <Icon className="w-4 h-4 text-blue-700 dark:text-blue-300" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────────── */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const location = useLocation();
  const { meta } = useWebsiteContent();
  const schoolName = meta?.school_name || "";
  const logoUrl = meta?.logo_url || null;

  const linkClass = (path) =>
    location.pathname === path
      ? "text-black dark:text-yellow-400 font-semibold underline underline-offset-8 dark:decoration-yellow-400 decoration-blue-950 drop-shadow"
      : "text-black dark:text-gray-50/90 font-bold hover:text-blue-950 transition";

  return (
    <nav className="fixed items-center top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-800/80 backdrop-blur shadow">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={schoolName || "logo"}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {schoolName.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {schoolName && (
            <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:inline">
              {schoolName}
            </span>
          )}
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex font-semibold gap-6 text-gray-700">
          <li><Link className={linkClass("/")} to="/">Home</Link></li>
          <li><Link className={linkClass("/about")} to="/about">About</Link></li>
          <li><Link className={linkClass("/gallery")} to="/gallery">Gallery</Link></li>
          <li>
            <button
              onClick={() => setApplyOpen(true)}
              className={
                location.pathname === "/apply"
                  ? "text-black dark:text-yellow-400 font-semibold underline underline-offset-8 dark:decoration-yellow-400 decoration-blue-950 drop-shadow"
                  : "text-black dark:text-gray-50/90 font-bold hover:text-blue-950 transition"
              }
            >
              Apply
            </button>
          </li>
          <li><Link className={linkClass("/Results")} to="/Results">Results</Link></li>
          <li><Link className={linkClass("/contact")} to="/contact">Contact</Link></li>
        </ul>

        {/* Desktop right actions */}
        <div className="gap-3 hidden lg:flex items-center">
          <DarkModeToggle />
          <button
            onClick={() => setApplyOpen(true)}
            className="bg-blue-950 dark:bg-yellow-400 dark:text-blue-950 font-semibold text-white
                       px-5 py-2 rounded-xl dark:hover:bg-yellow-100 hover:bg-yellow-100
                       hover:text-blue-950 transition"
          >
            Apply Now
          </button>

          {/* ↓ LOGIN DROPDOWN — replaces "Student Portal" button */}
          <LoginDropdown />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-3xl text-blue-950 dark:text-yellow-400"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-blue-950/30 shadow-lg">
          <ul className="flex flex-col items-center gap-4 py-6 text-gray-700 font-medium">
            <Link className={linkClass("/")} onClick={() => setOpen(false)} to="/">Home</Link>
            <Link className={linkClass("/about")} onClick={() => setOpen(false)} to="/about">About</Link>
            <Link className={linkClass("/Results")} onClick={() => setOpen(false)} to="/Results">Results</Link>
            <Link className={linkClass("/gallery")} onClick={() => setOpen(false)} to="/gallery">Gallery</Link>
            <Link className={linkClass("/contact")} onClick={() => setOpen(false)} to="/contact">Contact</Link>
            <li><DarkModeToggle /></li>
            <button
              onClick={() => { setOpen(false); setApplyOpen(true); }}
              className="bg-blue-950 dark:bg-yellow-400 dark:text-blue-950 font-semibold
                         text-white dark:hover:text-yellow-100 px-6 py-2 rounded-xl"
            >
              Apply Now
            </button>

            {/* ↓ LOGIN DROPDOWN (mobile flat list) */}
            <LoginDropdown isMobile />
          </ul>
        </div>
      )}

      {applyOpen && <ApplyModal onClose={() => setApplyOpen(false)} />}
    </nav>
  );
}
