import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_DEV_API_URL || 'http://localhost:34567';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN;
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || '';
const SCHOOL_LOGO = import.meta.env.VITE_SCHOOL_LOGO || '';
const SCHOOL_SHORT_NAME = import.meta.env.VITE_SCHOOL_SHORT_NAME || '';
const SCHOOL_MOTTO = import.meta.env.VITE_SCHOOL_MOTTO || '';

// Fetch public website sections with TTL cache (re-fetch after 5 min)
let _cache = null;
let _promise = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export const clearContentCache = () => { _cache = null; _promise = null; _cacheTime = 0; };

// Hide the HTML loading screen (index.html #app-loader), then remove it
export function hideLoader() {
  const el = document.getElementById('app-loader');
  if (!el) return;
  el.classList.add('loader-hidden');
  setTimeout(() => el.remove(), 600);
}

// Fill the loading screen with the school's real (dynamic) logo + name,
// then fade it out so the page appears fully formed.
export function brandLoader(meta) {
  const el = document.getElementById('app-loader');
  if (!el) return;
  const badge = el.querySelector('.loader-badge');
  const nameEl = el.querySelector('.loader-name');
  if (badge && meta?.logo_url) {
    const alt = String(meta.school_name || '').replace(/"/g, '&quot;');
    badge.innerHTML = `<img class="loader-logo" src="${meta.logo_url}" alt="${alt}" />`;
    badge.classList.add('has-logo');
  }
  if (nameEl && meta?.school_name) nameEl.textContent = meta.school_name;
  setTimeout(hideLoader, 400);
}

const fetchSections = () => {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return Promise.resolve(_cache);
  if (_promise && Date.now() - _cacheTime < CACHE_TTL) return _promise;
  _cacheTime = Date.now();
  _promise = axios
    .get(`${API_URL}/public/website-content`, {
      params: { school_id: SCHOOL_ID },
      headers: WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {},
    })
    .then(r => {
      const data = r.data;
      // Merge env var fallbacks into meta so school name/logo show even without CMS branding section
      if (data.meta) {
        if (!data.meta.school_name && SCHOOL_NAME) data.meta.school_name = SCHOOL_NAME;
        if (!data.meta.logo_url && SCHOOL_LOGO) data.meta.logo_url = SCHOOL_LOGO;
        if (!data.meta.tagline && SCHOOL_SHORT_NAME) data.meta.tagline = SCHOOL_SHORT_NAME;
        if (!data.meta.school_motto && SCHOOL_MOTTO) data.meta.school_motto = SCHOOL_MOTTO;
      } else {
        data.meta = {};
        if (SCHOOL_NAME) data.meta.school_name = SCHOOL_NAME;
        if (SCHOOL_LOGO) data.meta.logo_url = SCHOOL_LOGO;
        if (SCHOOL_SHORT_NAME) data.meta.tagline = SCHOOL_SHORT_NAME;
        if (SCHOOL_MOTTO) data.meta.school_motto = SCHOOL_MOTTO;
      }
      _cache = data;
      return _cache;
    })
    .catch(() => {
      // Even on error, provide env var fallbacks
      const fallbackMeta = {};
      if (SCHOOL_NAME) fallbackMeta.school_name = SCHOOL_NAME;
      if (SCHOOL_LOGO) fallbackMeta.logo_url = SCHOOL_LOGO;
      if (SCHOOL_SHORT_NAME) fallbackMeta.tagline = SCHOOL_SHORT_NAME;
      if (SCHOOL_MOTTO) fallbackMeta.school_motto = SCHOOL_MOTTO;
      return { sections: [], meta: Object.keys(fallbackMeta).length ? fallbackMeta : null, theme: null, recruitment_enabled: false };
    });
  return _promise;
};

/**
 * Returns { sections, meta, theme, recruitment_enabled, loading }
 * sections: array of { section_key, title, paragraphs, media, is_visible }
 * Helper: getSection(key) → section | null
 */
export function useWebsiteContent() {
  const [state, setState] = useState({ sections: [], meta: null, theme: null, recruitment_enabled: false, loading: true });

  useEffect(() => {
    fetchSections().then(data => {
      setState({
        sections: data.sections || [],
        meta: data.meta || null,
        theme: data.theme || null,
        recruitment_enabled: data.recruitment_enabled === true || data.recruitment_enabled === 1,
        loading: false,
      });
      brandLoader(data.meta);
    });
  }, []);

  const getSection = (key) => state.sections.find(s => s.section_key === key) || null;
  const getParagraphs = (key) => {
    const s = getSection(key);
    if (!s) return [];
    return typeof s.paragraphs === 'string' ? JSON.parse(s.paragraphs) : (s.paragraphs || []);
  };
  const getMedia = (key) => {
    const s = getSection(key);
    if (!s) return [];
    return typeof s.media === 'string' ? JSON.parse(s.media) : (s.media || []);
  };

  return { ...state, getSection, getParagraphs, getMedia };
}

/**
 * Hook that returns just the theme object + loading state
 */
export function useWebsiteTheme() {
  const { theme, loading } = useWebsiteContent();
  return { theme, loading };
}
