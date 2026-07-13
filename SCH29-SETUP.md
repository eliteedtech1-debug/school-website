# SCH/29 — Hajiya Amina Ibrahim Heritage Academy
## School Website Setup Guide

---

### School Details (from `school_setup`)

| Field | Value |
|---|---|
| School ID | `SCH/29` |
| School Name | HAJIYA AMINA IBRAHIM HERITAGE ACADEMY |
| Short Name | haiha |
| Motto | AN EDUCATION THAT LASTS A LIFETIME |
| Address | No B.Y. 30 Kerawa Street, Sabon Gari, Tudun Wada, Kaduna |
| Phone | 08069776050 |
| Email | admin@haiheritage.com.ng |
| Logo | `https://files.eliteedu.tech//uploads/c32657fb-0dc1-4a0b-a77b-1630abda14cb_1783786486_6a526bf68ea10.png` |

---

### Theme — Green Palette

The school logo is green, so the website uses a full green theme:

| CSS Variable | Value | Usage |
|---|---|---|
| `--color-primary` | `#166534` | Deep green — navbar, buttons, headings |
| `--color-secondary` | `#22c55e` | Bright green — accents, highlights |
| `--color-accent` | `#bbf7d0` | Light green tint — badges, tags |
| `--color-background` | `#f0fdf4` | Very light green — page background |
| `--color-text` | `#14532d` | Dark green — body text |
| Font | `Poppins` | All text |

---

### What Was Set Up

#### 1. Frontend (`schools_website/`)

**`.env`** — pointed to SCH/29:
```
VITE_SCHOOL_ID=SCH/29
VITE_BRANCH_ID=BRCH/29
VITE_WEBSITE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (non-expiring, id=4)
VITE_APP_NAME=HAJIYA AMINA IBRAHIM HERITAGE ACADEMY
VITE_SCHOOL_NAME=HAJIYA AMINA IBRAHIM HERITAGE ACADEMY
```

**`index.html`**:
- `<title>` → `Hajiya Amina Ibrahim Heritage Academy`
- `<meta name="theme-color">` → `#166534`

**`src/index.css`** — CSS variables updated to green palette (static fallback before API loads).

**`src/lib/ThemeProvider.jsx`** — `DEFAULTS` object updated to green palette.  
These defaults apply instantly on first paint; the API then confirms/overrides them with the DB values.

#### 2. Database (`elite_db`)

**`school_website_tokens`** (id=4, active):
```
school_id : SCH/29
label     : schools_website deployment
revoked   : 0
```
> Previous token (id=3) was revoked before inserting the new one.

**`school_website_content`**:
```
school_name    : HAJIYA AMINA IBRAHIM HERITAGE ACADEMY
tagline        : AN EDUCATION THAT LASTS A LIFETIME
logo_url       : https://files.eliteedu.tech//uploads/c32657fb-...
primary_color  : #166534
secondary_color: #22c55e
phone          : 08069776050
email          : admin@haiheritage.com.ng
address        : No B.Y. 30 Kerawa Street, Sabon Gari, Tudun Wada, Kaduna
admission_open : 1
```

**`school_website_sections`** — 30 sections created (all `is_visible=1`):

| Section Key | Title | Order |
|---|---|---|
| welcome | Welcome Message | 10 |
| home_stats | Our Achievements | 20 |
| home_streams | Academic Streams | 30 |
| core_values | Our Core Values | 40 |
| features | Why Choose Us | 50 |
| events | Upcoming Events | 60 |
| about_hero | About Hero | 100 |
| about_key_points | Key Points | 110 |
| about_floating_stats | Floating Stats | 120 |
| about_stats | By The Numbers | 130 |
| about_staff | Meet Our Leadership Team | 140 |
| about_programs | Comprehensive Programs | 150 |
| about_programs_banner | Banner Text | 160 |
| vision | Our Vision | 170 |
| mission | Our Mission | 180 |
| vision_values | Core Values | 190 |
| gallery_hero | Gallery Hero | 200 |
| gallery_highlights | School Highlights | 210 |
| gallery_items | Gallery Items | 220 |
| contact_info | Contact Information | 300 |
| contact_form | Contact Form | 310 |
| apply_hero | Apply Now | 400 |
| apply_requirements | Admission Requirements | 410 |
| apply_steps | Application Process | 420 |
| pricing_hero | Tuition and Fees | 500 |
| pricing_tiers | Fee Tiers | 510 |
| pricing_payment_plans | Payment Plans | 520 |
| exam_results_hero | Results Checker | 600 |
| exam_config | Exam Configuration | 610 |
| footer_links | Quick Links | 700 |

---

### How the Theme Flows

```
DB (school_website_content)
  └─► GET /api/public/website-content?school_id=SCH/29
        └─► useWebsiteContent() hook
              └─► ThemeProvider.jsx
                    └─► sets CSS vars on :root
                          └─► Tailwind classes pick them up
```

**Static fallback chain** (so the page is never unstyled):
1. `index.css` `:root` vars (green) — applied at CSS parse time
2. `ThemeProvider DEFAULTS` (green) — applied before API response arrives
3. API response theme (green, from `school_website_content`) — final values

---

### Next Steps

1. **Fill in section content** via the admin panel (`/admin/dashboard`) or run `seed-populate-content.js` with `SCHOOL_ID = 'SCH/29'`.
2. **Upload staff photos** and add staff data to the `about_staff` section.
3. **Add fee tiers** to the `pricing_tiers` section.
4. **Add gallery images** via admin Gallery page.
5. **Test** the API: `GET http://localhost:3000/api/public/website-content?school_id=SCH/29` with `Authorization: Bearer <token>`.

---

### Re-running the Seed

The seed script is idempotent:

```bash
mysql -u root -p'2024' elite_db < backend/scripts/seed-sch29.sql
```

- `school_website_content` uses `ON DUPLICATE KEY UPDATE` — safe to re-run.
- `school_website_sections` uses `INSERT IGNORE` — won't overwrite existing content.

### Regenerating the Website Token

```bash
cd elite-api
node -e "
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { school_id: 'SCH/29', type: 'website' },
    process.env.JWT_SECRET_KEY || process.env.JWT_SECRET
  );
  console.log(token);
"
```

Then update `VITE_WEBSITE_TOKEN` in `.env` and insert the new token into `school_website_tokens`.
