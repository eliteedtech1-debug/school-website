# Website CMS Implementation - Execution Plan

## Current Status Analysis

### ✅ Already CMS-Enabled (Using `useWebsiteContent`)
1. **Home.jsx** - Hero, core values, features, events, programs
2. **About.jsx** - Hero, key points, floating stats, staff
3. **Gallery.jsx** - Gallery items, hero section
4. **Contact.jsx** - Contact information
5. **Footer.jsx** - School info, social links
6. **Navbar.jsx** - Logo, school name
7. **ChairmanMessage.jsx** - Chairman info
8. **VisionMission.jsx** - Vision & mission content

### ❌ NOT CMS-Enabled (Hardcoded)
1. **Apply.jsx** - Application form & content
2. **Price.jsx** - Pricing/fees information
3. **Results.jsx** - Results display
4. **StaffCarousel.jsx** - Staff showcase
5. **ApplyModal.jsx** - Application modal content

### 📊 Database Tables Status
- ✅ `school_website_content` - Flat content (hero, branding, contact)
- ✅ `school_website_sections` - Structured sections (gallery, about, programs)
- ✅ Existing sections: about, admissions, chairman, contact, gallery, hero, programs

---

## Execution Plan

### Phase 1: Core Infrastructure ✅ COMPLETE
- [x] Database models (WebsiteContent, WebsiteSection)
- [x] Backend API routes (/api/website-content, /api/website-sections)
- [x] Frontend hook (useWebsiteContent)
- [x] Hero section CMS
- [x] Gallery section CMS with categories

### Phase 2: Missing Pages CMS-ization 🔄 IN PROGRESS

#### 2.1 Apply Page (Priority: HIGH)
**Sections Needed:**
```sql
- apply_hero (title, subtitle, image)
- apply_steps (step-by-step application process)
- apply_requirements (list of requirements)
- apply_deadline (application deadline info)
- apply_fees (application fee details)
```

**Implementation:**
```javascript
// Apply.jsx
const { getSection, getParagraphs, getMedia } = useWebsiteContent();
const applyHero = getSection('apply_hero');
const requirements = parseStructured('apply_requirements');
const steps = parseStructured('apply_steps');
const deadline = getSection('apply_deadline');
```

**Database Seed:**
```javascript
sections: [
  { section_key: 'apply_hero', title: 'Apply Now', paragraphs: [...], media: [...] },
  { section_key: 'apply_requirements', title: 'Requirements', paragraphs: [...] },
  { section_key: 'apply_steps', title: 'Application Process', paragraphs: [...] },
]
```

#### 2.2 Price Page (Priority: HIGH)
**Sections Needed:**
```sql
- pricing_hero (title, subtitle)
- pricing_tiers (pricing categories: pre-nursery, primary, secondary)
- pricing_payment_plans (installment options)
- pricing_discounts (early bird, sibling discounts)
```

**Implementation:**
```javascript
const pricingTiers = parseStructured('pricing_tiers');
// Each tier: { level, amount, description, features: [] }
```

#### 2.3 Results Page (Priority: MEDIUM)
**Sections Needed:**
```sql
- results_hero (title, subtitle)
- results_instructions (how to check results)
- results_sessions (available academic sessions)
```

**Implementation:**
```javascript
const { getSection } = useWebsiteContent();
const resultsHero = getSection('results_hero');
const instructions = getParagraphs('results_instructions');
```

#### 2.4 Staff Carousel (Priority: LOW)
**Note:** Already has staff data in `about_staff` section
**Action:** Reuse existing `about_staff` section data
```javascript
// StaffCarousel.jsx
const staffMembers = parseStructured('about_staff');
```

---

### Phase 3: Enhanced CMS Features

#### 3.1 Dynamic Navigation Menu
**Current:** Hardcoded links in Navbar
**Goal:** CMS-configurable menu items

**Database Addition:**
```sql
navigation_items: [
  { label: 'Home', path: '/', order: 1, visible: true },
  { label: 'About', path: '/about', order: 2, visible: true },
  { label: 'Gallery', path: '/gallery', order: 3, visible: true },
  ...
]
```

#### 3.2 Footer Customization
**Current:** Partially CMS (school info only)
**Goal:** Full CMS control

**Additions:**
- Quick links (customizable)
- Contact hours
- Multiple contact phones
- Copyright text

#### 3.3 SEO Meta Tags
**Database Addition to `school_website_content`:**
```sql
- meta_description
- meta_keywords
- og_image
- twitter_handle
```

---

### Phase 4: Admin UI Enhancements

#### 4.1 Content Management Dashboard
**Location:** `/admin/content` (already exists) + `/admin/website-data`

**Improvements:**
1. Add missing section types:
   - `apply_hero`, `apply_requirements`, `apply_steps`
   - `pricing_tiers`, `pricing_payment_plans`
   - `results_hero`, `results_instructions`

2. Visual preview before publish
3. Bulk upload for gallery
4. Drag-and-drop ordering

#### 4.2 WebsiteSettings.tsx Enhancements
**Add Tabs:**
- Pricing (manage pricing tiers)
- Applications (application settings)
- Results (results portal settings)
- Navigation (menu items)
- SEO (meta tags)

---

### Phase 5: Media Management

#### 5.1 Gallery Upload Fix
**Issue:** files.eliteedu.tech returns 406 error
**Solutions:**
1. Fix authentication headers
2. Add retry logic
3. Implement local fallback

**Script Update:**
```javascript
// Add proper auth header
headers: {
  ...form.getHeaders(),
  'Authorization': `Bearer ${API_KEY}`
}
```

#### 5.2 Batch Media Upload
**Feature:** Upload multiple images at once
**UI:** Drag-and-drop zone with progress bars

---

## Implementation Priority

### Week 1: Critical Pages
1. ✅ Hero section CMS
2. ✅ Gallery CMS with categories  
3. 🔄 Apply page CMS
4. 🔄 Price page CMS

### Week 2: Enhanced Features
5. ⏳ Results page CMS
6. ⏳ Navigation menu CMS
7. ⏳ Footer enhancements
8. ⏳ SEO meta tags

### Week 3: Admin UI
9. ⏳ WebsiteSettings tabs (Pricing, Applications)
10. ⏳ Preview before publish
11. ⏳ Bulk media upload
12. ⏳ Drag-and-drop ordering

### Week 4: Media & Polish
13. ⏳ Fix gallery upload to files.eliteedu.tech
14. ⏳ Batch upload all existing images
15. ⏳ Loading skeletons for all pages
16. ⏳ Error handling & fallbacks

---

## Database Schema Summary

### `school_website_content` (Flat Content)
```sql
- school_id (PK)
- school_name, tagline, logo_url
- primary_color, secondary_color
- hero_title, hero_subtitle, hero_image_url
- about_text, about_image_url
- phone, email, address
- facebook_url, instagram_url, twitter_url
- admission_open, admission_message
- meta_description, meta_keywords (TO ADD)
```

### `school_website_sections` (Structured Content)
```sql
- id (PK)
- school_id
- section_key (e.g., 'gallery', 'about_hero')
- title
- paragraphs (JSON array)
- media (JSON array)
- order_index
- is_visible
```

**Section Keys Needed:**
```
✅ hero, about, gallery, contact, chairman, programs
⏳ apply_hero, apply_requirements, apply_steps
⏳ pricing_tiers, pricing_payment_plans
⏳ results_hero, results_instructions
⏳ navigation_menu, footer_links
```

---

## Quick Start Commands

### Create Missing Sections
```bash
node schools_website/backend/scripts/seed-apply-sections.js
node schools_website/backend/scripts/seed-pricing-sections.js
node schools_website/backend/scripts/seed-results-sections.js
```

### Update Frontend Pages
```bash
# Apply page
code schools_website/src/componetes/Apply.jsx

# Price page  
code schools_website/src/componetes/Price.jsx

# Results page
code schools_website/src/componetes/Results.jsx
```

### Test CMS Changes
```bash
# Start backend
cd schools_website/backend && node server.js

# Start frontend
cd schools_website && npm run dev

# Visit admin panel
open http://localhost:3000/admin/content
```

---

## Success Criteria

✅ **100% CMS Customizable** when:
1. All pages fetch content from database
2. No hardcoded text/images in components
3. Admin can modify everything via UI
4. Changes reflect immediately on public site
5. All media hosted on files.eliteedu.tech
6. Loading skeletons on all pages
7. Proper error handling & fallbacks

---

## Next Steps

1. **Immediate:** Create seed scripts for Apply, Price, Results sections
2. **Today:** Update Apply.jsx to use CMS
3. **This Week:** Complete all page CMS-ization
4. **Next Week:** Enhance admin UI with new tabs
5. **Final:** Fix media upload & batch migrate all images
