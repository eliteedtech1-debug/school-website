# Remaining Work — CMS Dynamic Conversion

## Phase A: Quick Wins (1-2h)

### A1. Gallery — CMS gallery items
- **File:** `src/componetes/Gallery.jsx`
- **Problem:** `staticGalleryItems` array of 16 hardcoded items used as fallback; CMS path exists for hero/highlights but not for individual gallery items
- **Fix:** Parse `gallery_items` section via `parseStructured('gallery_items')`, map each item to the gallery format (`{ title, category, type, image, description }`), use as primary source, keep static array as fallback
- **Sections needed in admin:** `gallery_items` (structured)

### A2. Contact — operating hours & additional sections
- **File:** `src/componetes/Contact.jsx`
- **Problem:** Operating hours ("Mon – Fri: 8am – 4pm") hardcoded; only the hero paragraph comes from CMS
- **Fix:** Parse `contact_info` section (`parseStructured('contact_info')`) for cards like hours, address, phone; parse `contact_form` section for form intro text
- **Sections needed in admin:** `contact_info` (structured), `contact_form` (paragraphs)

### A3. Navbar — school name from CMS
- **File:** `src/componetes/layout/Navbar.jsx`
- **Problem:** School name "DKG Academy" hardcoded; no `useWebsiteContent` usage
- **Fix:** Import `useWebsiteContent`, display `meta.school_name || "DKG Academy"`; logo already uses `ASSETS.school`
- **Note:** Nav links menu items could also be CMS-driven via `parseStructured('nav_links')` but that's optional

### A4. Footer — quick links from CMS
- **File:** `src/componetes/Footer.jsx`
- **Problem:** "Quick Links" section has hardcoded `<Link>` items
- **Fix:** Parse `footer_links` section (`parseStructured('footer_links')`) for dynamic nav links with fallback
- **Sections needed in admin:** `footer_links` (structured)

---

## Phase B: Medium Effort (3-4h)

### B1. Results — exam results page
- **File:** `src/componetes/Results.jsx`
- **Problem:** Entirely static — no `useWebsiteContent`, hardcoded grade boundaries, term logic, assessment types
- **Fix:**
  1. Import `useWebsiteContent` 
  2. Parse `exam_config` section for grade boundaries, terms, assessment types
  3. Parse `exam_results_hero` for page hero text
  4. Keep the API fetch logic (it calls `VITE_API_URL` for actual results) but make grade/term config CMS-driven
- **Sections needed in admin:** `exam_config` (structured), `exam_results_hero` (paragraphs)

### B2. Gallery — CMS-driven with media upload fallback
- **File:** `src/componetes/Gallery.jsx`
- **Enhancement:** Use `getMedia('gallery')` to retrieve uploaded images from CMS, combine with structured items
- **This would push Gallery to ~90% CMS-driven**

---

## Phase C: Polish (1-2h)

### C1. Verify theme system end-to-end
- **Files:** `src/lib/ThemeProvider.jsx`, `src/index.css`, `tailwind.config.js`
- **Check:** That `useWebsiteTheme()` actually receives theme data from the API and applies CSS variables correctly
- **Fix:** If `data.theme` isn't returned by the public endpoint, add it to the elite-api response

### C2. Replace placeholder URLs with dynamic CMS image URLs
- **Files:** All components using `ASSETS.*`
- **Ideal:** When a school uploads their own logo/staff photos etc. via CMS, those URLs should replace the fallback `ASSETS.*` URLs
- This is already partially in place (e.g., `photoMedia[0]?.url || ASSETS.chairman`)

---

## Summary by Component

| Component | Current % | Target % | Phase |
|---|---|---|---|
| Gallery | 50% | 95% | A1 + B2 |
| Contact | 30% | 70% | A2 |
| Navbar | 10% | 40% | A3 |
| Footer | 40% | 70% | A4 |
| Results | 0% | 60% | B1 |
| Theme system | 50% | 100% | C1 |
| Dynamic images | 30% | 80% | C2 |

**Target after all phases: ~85% CMS-dynamic overall**
