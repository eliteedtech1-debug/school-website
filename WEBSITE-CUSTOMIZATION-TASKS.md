# Website Customization — Task Tracker

**Goal:** 100% dynamic school website configurable from elite-core dashboard
**Current progress:** ~80%

---

## Phase 1 — Core Theme & Data Connection (HIGH) ✅ DONE

- [x] **1.1** Add full theme settings UI to `elite-core` `WebsiteSettings.tsx` (fonts, spacing, border radius, background/text colors, custom CSS)
- [x] **1.2** Create `GET/PUT /api/website-theme/:school_id` endpoint on `elite-api`
- [x] **1.3** Create DB migration for `school_website_theme` table or extend `school_website_content`
- [x] **1.4** Wire theme colors into `schools_website` — inject `primary_color`, `secondary_color`, fonts etc. as CSS variables in `<head>`
- [x] **1.5** Create `GET/PUT /api/website-stats/:school_id` endpoint on `elite-api`
- [x] **1.6** Create `GET/PUT /api/website-programs/:school_id` endpoint on `elite-api`
- [x] **1.7** Create `GET/PUT /api/website-pricing/:school_id` endpoint on `elite-api`
- [x] **1.8** Create `GET/PUT /api/website-staff/:school_id` endpoint on `elite-api`

## Phase 2 — Replace All Hardcoded Data (HIGH) ✅ DONE

- [x] **2.1** Add **Statistics** tab to `WebsiteSettings.tsx` (manage 4 stat cards: number, label, description)
- [x] **2.2** Add **Programs** tab to `WebsiteSettings.tsx` (manage academic levels, streams, subjects, times)
- [x] **2.3** Add **Pricing/Fee** tab to `WebsiteSettings.tsx` (manage grade-level fee tables)
- [x] **2.4** Add **Staff** tab to `WebsiteSettings.tsx` (manage staff: name, position, photo, bio)
- [x] **2.5** Add **Events** tab to `WebsiteSettings.tsx` (manage event title, status, description)
- [x] **2.6** Add **Features** tab to `WebsiteSettings.tsx` (manage "Why Choose Us" cards)
- [x] **2.7** Add **Core Values** tab to `WebsiteSettings.tsx` (manage value title, icon, description)
- [x] **2.8** Replace hardcoded stats in `Home.jsx` with API fetch
- [x] **2.9** Replace hardcoded programs in `Home.jsx` with API fetch
- [x] **2.10** Replace hardcoded features in `Home.jsx` with API fetch
- [x] **2.11** Replace hardcoded events in `Home.jsx` with API fetch
- [x] **2.12** Replace hardcoded core values in `Home.jsx` with API fetch
- [x] **2.13** Replace hardcoded academic streams in `Home.jsx` with API fetch
- [x] **2.14** Replace hardcoded stats in `About.jsx` with API fetch
- [x] **2.15** Replace hardcoded management staff in `About.jsx` with API fetch
- [x] **2.16** Replace hardcoded vision/mission in `VisionMission.jsx` with API fetch
- [x] **2.17** Replace hardcoded pricing in `Price.jsx` with API fetch
- [x] **2.18** Wire `admission_open` from API into `Apply.jsx` CTA and hero section

## Phase 3 — Admin UI Polish (MEDIUM)

- [ ] **3.1** Add **SEO** tab to `WebsiteSettings.tsx` (meta title, description, keywords, OG image)
- [ ] **3.2** Add **Maintenance Mode** toggle to `WebsiteSettings.tsx`
- [ ] **3.3** Connect `Themes.jsx` preview to real data — replace mock data with API calls
- [ ] **3.4** Fix admin `Layout.jsx` — remove hardcoded "DKG Academy", read from school data
- [ ] **3.5** Add Gallery section as a proper tab (currently embedded in sections)
- [ ] **3.6** Improve `Results.jsx` with proper API integration and error handling

## Phase 4 — Multi-Tenant & Polish (LOW)

- [ ] **4.1** Implement subdomain/domain-based school resolution in `schools_website`
- [ ] **4.2** Build template library system for quick school website setup
- [ ] **4.3** Add website analytics (visits, popular pages)
- [ ] **4.4** Delete orphan `componetes/layout/Navbar.jsx` (duplicate, unused)
- [ ] **4.5** Remove hardcoded school images from `assets/` (use API-served images)
- [ ] **4.6** Remove `VITE_SCHOOL_NAME` from `.env`, use API-provided school name
- [ ] **4.7** Add proper loading/error/empty states to all public components
