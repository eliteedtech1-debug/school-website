import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5123/api';
const SCHOOL_ID = import.meta.env.VITE_SCHOOL_ID;
const WEBSITE_TOKEN = import.meta.env.VITE_WEBSITE_TOKEN;

// Fetch public website sections once and cache in module scope
let _cache = null;
let _promise = null;

const fetchSections = () => {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = axios
    .get(`${API_URL}/public/website-content`, {
      params: { school_id: SCHOOL_ID },
      headers: WEBSITE_TOKEN ? { Authorization: `Bearer ${WEBSITE_TOKEN}` } : {},
    })
    .then(r => { _cache = r.data; return _cache; })
    .catch(() => ({ sections: [], meta: null }));
  return _promise;
};

/**
 * Returns { sections, meta, loading }
 * sections: array of { section_key, title, paragraphs, media, is_visible }
 * Helper: getSection(key) → section | null
 */
export function useWebsiteContent() {
  const [state, setState] = useState({ sections: [], meta: null, loading: true });

  useEffect(() => {
    fetchSections().then(data => {
      setState({ sections: data.sections || [], meta: data.meta || null, loading: false });
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
