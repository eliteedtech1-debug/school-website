import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5123/api';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN;

// Fetch public website sections with TTL cache (re-fetch after 5 min)
let _cache = null;
let _promise = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export const clearContentCache = () => { _cache = null; _promise = null; _cacheTime = 0; };

const fetchSections = () => {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return Promise.resolve(_cache);
  if (_promise && Date.now() - _cacheTime < CACHE_TTL) return _promise;
  _cacheTime = Date.now();
  _promise = axios
    .get(`${API_URL}/public/website-content`, {
      params: { school_id: SCHOOL_ID },
      headers: WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {},
    })
    .then(r => { _cache = r.data; return _cache; })
    .catch(() => ({ sections: [], meta: null, theme: null }));
  return _promise;
};

/**
 * Returns { sections, meta, theme, loading }
 * sections: array of { section_key, title, paragraphs, media, is_visible }
 * Helper: getSection(key) → section | null
 */
export function useWebsiteContent() {
  const [state, setState] = useState({ sections: [], meta: null, theme: null, loading: true });

  useEffect(() => {
    fetchSections().then(data => {
      setState({
        sections: data.sections || [],
        meta: data.meta || null,
        theme: data.theme || null,
        loading: false,
      });
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
