# School Website Customization: Analysis & Path to 100% Dynamic

## Architecture Overview

```
elite-core (Admin Dashboard)
       │
       │  WebsiteSettings.tsx (7 tabs: Branding, Hero, About, Contact, Admission, Gallery, Sections)
       │  school-list.tsx (Enable Website, URL, Token)
       ▼
elite-api (Backend)
       │
       │  routes/websiteContent.js — 14 endpoints
       │  routes/schoolWebsiteTokens.js — 3 endpoints
       │  Tables: school_website_content + school_website_sections
       ▼
     PUBLIC API ──────────────────────────────────────────────┐
       │   GET /api/public/website-content?school_id=...      │
       │   POST /api/public/check-result                      │
       │   POST /api/public/check-result-by-school            │
       │   POST /api/public/student-report                    │
       │   GET /api/public/active-term                        │
       │                                                      │
       └──────────────────────────────────────────────────────┤
                                                              ▼
schools_website (Public Site — separate app)
   - Frontend: React (Vite)
   - Backend: Express (port 5123) — SEPARATE MySQL db (school_cms)
   - Hooks into elite-api via useWebsiteContent.js
   - School model (School.js) has rich schema: theme JSON,
     branding JSON, content JSON, settings JSON
   - But routes return mock data, NOT reading from DB
```

---

## ✅ WHAT'S IMPLEMENTED (Working End-to-End)

| Feature | elite-core UI | elite-api Endpoint | schools_website Public |
|---------|:---:|:---:|:---:|
| School name, tagline, logo | Branding tab | `POST /api/website-content` | ✅ Footer, Navbar |
| Primary/secondary colors | Branding tab (ColorPicker) | `POST /api/website-content` | ❌ **NOT applied anywhere** |
| Hero title, subtitle, image | Hero tab | `POST /api/website-content` | ⚠️ Partially (falls back to hardcoded) |
| About text & image | About tab | `POST /api/website-content` | ⚠️ Partially |
| Contact info (phone, email, address) | Contact tab | `POST /api/website-content` | ✅ Contact page |
| Social links (FB, IG, Twitter) | Contact tab | `POST /api/website-content` | ✅ Footer |
| Admission open/close + message | Admission tab | `POST /api/website-content` | ❌ **Not implemented in public site** |
| Gallery management (CRUD) | Gallery tab | `PUT /api/website-sections/:id` | ⚠️ Prepended to static gallery |
| Custom page sections | Sections tab | Full CRUD endpoints | ⚠️ Partial |
| Website enable/disable | school-list.tsx toggle | `school_setup.has_website` | N/A |
| API token generation | school-list.tsx "Generate" | `POST /api/school-tokens/generate` | ✅ Required for auth |
| Result checker | — | 3 public endpoints | ✅ Results page |
| Chairman message | — | via sections `chairman` key | ✅ ChairmanMessage component |

---

## ❌ MISSING FEATURES (Gaps to 100%)

### A. elite-core Dashboard → Missing Tabs/Controls

| Missing Feature | What It Controls | Priority | Notes |
|---|---|---|---|
| **Theme/Style panel** | Font family, heading font, border radius, spacing, background color, text color, custom CSS | **HIGH** | `schools_website School.theme` model already has all these fields — just need UI + API |
| **Vision & Mission** | School vision, mission, core values text | **HIGH** | Currently hardcoded in `VisionMission.jsx` |
| **Statistics** | Student count, years, programs, graduates numbers | **HIGH** | Hardcoded in `Home.jsx` + `About.jsx` |
| **Programs/Streams** | Academic levels, streams, subjects | **HIGH** | Hardcoded in `Home.jsx` (programs, streams, features) |
| **Fee/Pricing** | Grade-level fee tables | **HIGH** | Completely hardcoded in `Price.jsx` |
| **Management Staff** | Staff name, position, photo, bio | **HIGH** | Hardcoded in `About.jsx` (6 people) |
| **Events** | Title, description, status, dates | **MEDIUM** | Hardcoded in `Home.jsx` |
| **Features/Why Choose Us** | Feature cards with icons and text | **MEDIUM** | Hardcoded in `Home.jsx` |
| **Core Values** | Value title, icon, description | **MEDIUM** | Hardcoded in `Home.jsx` + `VisionMission.jsx` |
| **SEO Settings** | Meta title, description, keywords, OG image | **MEDIUM** | `School.settings.seo` model exists in schools_website |
| **Maintenance Mode** | Toggle site offline, custom message | **LOW** | `School.settings.maintenanceMode` exists |
| **Website Analytics** | Traffic, visits, popular pages | **LOW** | No analytics tracking |
| **Theme Preview** | Live preview of theme changes before saving | **MEDIUM** | Already have mock preview in `Themes.jsx` but disconnected |
| **Template Library** | Choose from pre-built template designs | **LOW** | `School.templateId` + `isTemplate` fields exist |

### B. elite-api → Missing Endpoints

| Missing Endpoint | Reason | Priority |
|---|---|---|
| `GET/PUT /api/website-theme/:school_id` | Theme CRUD (colors, fonts, layout, customCSS) | **HIGH** |
| `GET/PUT /api/website-stats/:school_id` | Statistics CRUD (numbers, labels) | **HIGH** |
| `GET/PUT /api/website-programs/:school_id` | Programs/streams CRUD | **HIGH** |
| `GET/PUT /api/website-pricing/:school_id` | Fee/pricing CRUD | **HIGH** |
| `GET/PUT /api/website-staff/:school_id` | Staff profiles CRUD | **HIGH** |
| `GET/PUT /api/website-events/:school_id` | Events CRUD | **MEDIUM** |
| `GET/PUT /api/website-features/:school_id` | Feature highlights CRUD | **MEDIUM** |
| `GET/PUT /api/website-values/:school_id` | Core values CRUD | **MEDIUM** |
| `GET/PUT /api/website-seo/:school_id` | SEO metadata CRUD | **MEDIUM** |

### C. schools_website → Needs Implementation

| Component | Current State | What's Needed |
|---|---|---|
| **Theme engine** | ❌ Not applied | Read `primary_color`/`secondary_color` + full theme → inject as CSS variables in `<head>` |
| **Home — Hero** | ⚠️ Partial | Use all CMS fields (CTA, overlay), support carousel |
| **Home — Stats** | ❌ Hardcoded numbers | Fetch from API, animate with CountUp |
| **Home — Programs** | ❌ Hardcoded array | Fetch from API, render dynamically |
| **Home — Features** | ❌ Hardcoded array | Fetch from API |
| **Home — Events** | ❌ Hardcoded array | Fetch from API |
| **Home — Core Values** | ❌ Hardcoded | Fetch from API |
| **Home — Academic Streams** | ❌ Hardcoded | Fetch from API |
| **About — Stats** | ❌ Hardcoded | Fetch from API |
| **About — Management Staff** | ❌ Hardcoded 6 people | Fetch from API |
| **About — Vision/Mission** | ❌ Hardcoded text | Fetch from API |
| **Gallery** | ⚠️ Static fallback | Use gallery section exclusively |
| **Price** | ❌ Completely static | Fetch fee structure from API |
| **Results** | ⚠️ Alert placeholder | Uses API but form could be richer |
| **Admission status** | ❌ Not checked | Read `admission_open` from API, show/hide apply CTA |
| **Footer** | ✅ Good | Already mostly dynamic |
| **Navbar** | ⚠️ Partial | Has duplicate orphan `layout/Navbar.jsx` |

---

## Current Conversion: ~25% to 100% Dynamic

The `useWebsiteContent` bridge is the right foundation, but it only carries ~10 data fields (meta + sections). The remaining ~40+ data points (theme, stats, programs, pricing, staff, events, features, values, vision, mission, SEO, etc.) are still hardcoded. The admin panel in elite-core only manages 10 fields of content — for 100% it needs to manage all aspects of the public website.

---

## ROADMAP TO 100%

### Phase 1 — Core Theme & Data Connection (HIGH priority)
1. Add full theme/design settings to `WebsiteSettings.tsx` (fonts, spacing, CSS)
2. Create `PUT /api/website-theme` endpoint on elite-api
3. Wire the theme colors into `schools_website` as CSS variables
4. Create API endpoints for stats, programs, pricing, staff

### Phase 2 — Replace all hardcoded data (HIGH priority)
5. Add corresponding tabs to elite-core for: Stats, Programs, Pricing, Staff, Events, Features, Values
6. Replace every hardcoded array in `Home.jsx`, `About.jsx`, `Price.jsx` with API calls

### Phase 3 — Admin UI polish (MEDIUM priority)
7. Add SEO tab, Maintenance mode toggle
8. Add live theme preview (the `Themes.jsx` already has the UI, just needs connecting)
9. Fix admin `Layout.jsx` — remove hardcoded "DKG Academy", read from school data

### Phase 4 — Multi-tenant & polish (LOW priority)
10. Subdomain/domain-based school resolution
11. Template library for quick school setup
12. Website analytics
13. Delete orphan `layout/Navbar.jsx`
