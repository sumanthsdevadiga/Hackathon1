# FixIt CEC – Smart Campus Maintenance & Complaint Reporting
### Canara Engineering College | CEC-HACKSTORM-2026
**React 18 + Vite Multi-Page Web Application with Client-Side Routing**

---

## 📌 Problem Description

Campus infrastructure across educational institutions frequently suffers from maintenance delays, lack of transparency, and redundant complaint tickets:
1. **Safety Hazard Blindness**: Critical safety hazards (ceiling fan sparks, exposed wiring, water pipe bursts) are lost in manual registers alongside routine bench repairs.
2. **Duplicate Ticket Clutter**: When a projector or washroom tap fails in a common area, dozens of students file identical complaints, overwhelming maintenance officers.
3. **Black Box Tracking**: Students never know if their reports were acknowledged or when technicians were dispatched.
4. **Heavy Deployment Overhead**: Students rarely download bulky native apps for occasional maintenance reporting.

---

## 💡 The FixIt Solution & Core Innovations

FixIt CEC is a lightweight, high-performance React application designed for **Canara Engineering College** with client-side routing, instant QR code access, and a design language modeled after the **Mindu** visual reference:

- ⚡ **Offline Priority Heuristic Engine** (`src/utils/logic.js`): Evaluates hazard keywords (`spark`, `burning`, `exposed wire`, `flood`, `gas`) and departmental risk weighting to automatically assign High, Medium, or Low priority without external API dependencies.
- 🤝 **Smart Duplicate Detection & "Me-Too" Upvoting**: If an open complaint already exists for the same Block, Room, and Category, FixIt CEC prevents duplicate ticket creation and automatically converts new reports into **“Me-Too” upvotes**, elevating institutional urgency.
- 🏢 **Automatic Department Routing**: Directs issues automatically to 6 specialized campus units:
  - **Electrical Dept** (⚡)
  - **Plumbing Team** (🚰)
  - **Civil / Carpentry** (🔨)
  - **IT Support** (💻)
  - **Housekeeping** (🧹)
  - **Security Office** (🛡️)
- 📍 **Classroom QR Code Instant Pre-fill**: Physical QR posters in classrooms link directly to `/report?loc=Main Block|Room 204`. React Router's `useSearchParams` reads the parameters, auto-selects the block and room, and displays an alert banner.
- ⏱️ **Timestamped Audit Timeline**: Every state change (`Reported` → `Assigned` → `In Progress` → `Resolved`) is permanently recorded with human-readable timestamps and relative intervals.
- 🔐 **Admin Facility Command Center (PIN: 1234)**:
  - 4 KPI metric cards (Total, Open, High Priority, Resolved).
  - Pure CSS animated category distribution bar chart.
  - Complaints table sorted by **Priority (High > Medium > Low)** and **Upvotes**.
  - One-click status change buttons that instantly update the student's live tracking view.
  - Demo data reset button to restore the sandbox environment at any point.

---

## 🗺️ Route Architecture

FixIt CEC utilizes **React Router v6** with a shared persistent layout shell (`Layout.jsx`):
```text
<Layout>
  <Navbar />      (Persistent Top Navigation with Active Route Highlights)
  <Outlet />      (Specific Routed Page Content)
  <Footer />      (Persistent Campus Footer)
</Layout>
```

| Route Path | Page Component | Description |
|---|---|---|
| `/` | `Home` | Hero banner with dual CTA pills, "What we fix" 4 cards (first highlighted in vibrant orange), live dynamic stats strip, active departments strip, and CTA banner. |
| `/report` | `Report` | PageBanner, 2-column layout (interactive complaint form on left + tips & category chips on right), real-time priority preview, QR code auto-fill, and success/merged result card. |
| `/track` | `Track` | PageBanner, ID search bar with sample chips, recent public complaints list. |
| `/track/:id` | `Track` | Direct URL lookup: displays complaint details, priority/status pills, routed department, upvotes, and full timestamped audit timeline. |
| `/how-it-works`| `HowItWorks` | PageBanner, 5 numbered steps as a vertical timeline, priority engine keyword table, duplicate detection before/after, room QR link explanation, and 4-question FAQ accordion. |
| `/admin` | `Admin` | Protected facilities desk. Prompts for demo PIN `1234`, then unlocks real-time KPI metrics, CSS bar chart, filterable/sortable table, status buttons, and demo reset. |
| `*` | `NotFound` | 404 Not Found page with friendly message and "Back to Home" button. |

> **Router Note**: This application uses `BrowserRouter` for clean, modern URLs. When running `npm run dev`, Vite's built-in dev server handles SPA history fallbacks automatically. If deploying to static hosting environments (such as GitHub Pages or an S3 bucket without rewrite rules), configure server fallback redirects to `index.html` or swap `BrowserRouter` for `HashRouter` in `src/main.jsx`.

---

## 🎨 Visual Design Language (Modern Dark Mode / Operations Center Theme)

The visual design language strictly implements the futuristic **Modern Dark Mode / Campus Operations Center** theme:
- **Palette**:
  - **Background**: Deep Obsidian & Midnight Slate (`#0B0F17` & `#0F172A`) with ambient radial cyan/emerald lighting grids.
  - **Signature Accents**: Electric Neon Cyan (`#38BDF8`), Cyber Mint & Emerald (`#10B981` / `#34D399`).
  - **Primary Action Buttons**: Glowing Cyan-to-Emerald gradient (`linear-gradient(135deg, #38BDF8 0%, #10B981 100%)`) with electric glow shadows.
  - **Surfaces**: Frosted glassmorphism acrylic cards (`background: rgba(17, 24, 39, 0.72); backdrop-filter: blur(18px); border: 1px solid rgba(255, 255, 255, 0.08)`).
- **Geometry**: Generously rounded corners (`20px` for cards, `9999px` for pill buttons and badges), soft neon halos, and smooth hover lift animations.
- **Featured Cyber Card**: In the "What We Fix" grid on the Home page, the first card (Electrical) is highlighted with an electric neon cyan glowing border, radiant icon wrapper, and high-contrast typography.
- **Top Navbar**: Logo wordmark **FixIt.** with an inline electric gradient swoosh SVG, centered NavLinks with an active glowing cyan text + underline indicator, and a rounded pill "Report an Issue" button on the right.
- **PageBanner Component**: Reusable `<PageBanner />` with a dark cosmic slate gradient, cyan breadcrumbs, and glowing bottom border on every subpage.
- **Typography**: Google Font **Plus Jakarta Sans** with clean system fallbacks.
- **Offline Ready**: Built with CSS gradients, inline SVGs, and emoji with zero external image dependencies.

---

## 📂 Project Structure

```text
Hackathon/
├── package.json               # React 18, Vite, React Router DOM v6
├── vite.config.js             # Vite configuration
├── index.html                 # HTML entry point with Plus Jakarta Sans font
├── test_react_app.js          # Automated Node.js integration test runner
├── dist/                      # Production build bundle (generated by npm run build)
└── src/
    ├── main.jsx               # Entry point (BrowserRouter & Context Provider)
    ├── App.jsx                # Route definitions & Layout binding
    ├── layout/
    │   ├── Layout.jsx         # App shell: Navbar -> Outlet -> Footer
    │   ├── Navbar.jsx         # Fixed sticky navbar with NavLink active states
    │   ├── Footer.jsx         # Global footer with CEC accreditation info
    │   └── ScrollToTop.jsx    # Automatically scrolls to top on route change
    ├── pages/
    │   ├── Home.jsx           # Hero, What We Fix, Live Stats, Dept Strip, CTA
    │   ├── Report.jsx         # Complaint form + Tips sidebar + Category chips
    │   ├── Track.jsx          # ID search, dynamic timeline, recent public list
    │   ├── HowItWorks.jsx     # 5-step vertical flow, priority table, FAQ
    │   ├── Admin.jsx          # PIN 1234 login, KPI cards, CSS chart, table
    │   └── NotFound.jsx       # 404 page with "Back to Home"
    ├── components/
    │   ├── PageBanner.jsx     # Reusable orange gradient top banner
    │   ├── ComplaintForm.jsx  # Interactive form with QR param listener
    │   ├── StatusPill.jsx     # Reported / Assigned / In Progress / Resolved pill
    │   ├── PriorityPill.jsx   # High / Medium / Low colored badge
    │   ├── Timeline.jsx       # Timestamped audit timeline
    │   ├── StatCard.jsx       # Reusable KPI metric card
    │   ├── BarChart.jsx       # Native CSS animated category distribution chart
    │   ├── ComplaintTable.jsx # Filterable table (sorted by priority & votes)
    │   └── FAQ.jsx            # 4-question interactive accordion
    ├── context/
    │   └── ComplaintsContext.jsx  # React Context for global state & persistence
    ├── hooks/
    │   ├── useLocalStorage.js # Safe LocalStorage hook with try/catch
    │   └── useReveal.js       # Subtle fade-up scroll animation hook
    ├── utils/
    │   └── logic.js           # Pure functions: priority engine, routing, duplicates
    ├── data/
    │   └── campusData.js      # Blocks, rooms, departments, and seed data
    └── styles/
        ├── global.css         # Design tokens, buttons, badges, navbar, footer
        ├── banner.css         # PageBanner styles
        ├── home.css           # Home page grid, hero banner, cards
        ├── report.css         # Form & side-panel layout
        ├── track.css          # Search box, timeline, recent list
        ├── howItWorks.css     # Vertical timeline, before/after comparison
        └── admin.css          # Login card, chart, admin data table
```

---

## 🚀 How to Run

### Development Mode:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build:
```bash
npm run build
```
Generates an optimized, tree-shaken static bundle in `/dist` in under 1 second.

---

## ⏱️ 5-Minute Hackathon Demo Script (For Presenters & Judges)

Follow this step-by-step presentation script to demonstrate all features to hackathon judges:

### 1️⃣ Minute 1: Navigation & Routing Showcase
- **Action**: Open [http://localhost:3000](http://localhost:3000).
- **Showcase**: Point out the sticky frosted-glass navbar with the **FixIt.** wordmark and orange swoosh.
- **Action**: Click through the navigation links: **Home** (`/`) → **Report** (`/report`) → **Track** (`/track`) → **How it Works** (`/how-it-works`) → **Admin** (`/admin`).
- **Showcase**: Notice how the **Header and Footer stay fixed**, only the middle `<Outlet />` content transitions smoothly, and the active link is highlighted with an orange text and underline pill indicator.

### 2️⃣ Minute 2: QR Poster Simulation & Real-Time Smart Priority
- **Action**: Navigate to `/report?loc=Main Block|Room 204` (simulating scanning a classroom QR poster).
- **Showcase**: The Campus Block auto-selects **Main Block**, Room auto-selects **Room 204**, and the yellow alert banner appears: `📍 Location auto-filled from room QR code: Main Block – Room 204`.
- **Action**: In the description box, type:
  `Ceiling fan sparking and burning smell`
- **Showcase**: Point to the **Priority Engine preview box** directly under the description. It immediately evaluates keywords (`sparking` +3, `burning` +3, `smell` +1, `Electrical` +1) and tags it as **High Priority** in red!
- **Action**: Fill Name/USN (`Rahul – 4CB22CS014`) and click **Submit Complaint Now →**.
- **Result**: Success card appears with generated Ticket ID **FIX-1005**, High Priority badge, and auto-routing to **Electrical Dept**.

### 3️⃣ Minute 3: Duplicate Detection & "Me-Too" Upvoting
- **Explanation**: *"What happens when another student in Room 204 notices the sparking fan 5 minutes later and reports it?"*
- **Action**: Click **Submit New Complaint** (or stay on `/report`). Leave **Main Block**, **Room 204**, and **Electrical** selected.
- **Action**: Enter `Fan sparking and burning smell again` with Name `Meera – 4CB23IS022` and submit.
- **Showcase**: The system detects the active open ticket for Room 204! Instead of creating a duplicate ticket, it displays the blue card: `🤝 Duplicate Detected & Merged as a "Me-Too" Report!`, bumps upvotes from **1 to 2**, and provides a direct button to track **FIX-1005**.

### 4️⃣ Minute 4: Direct URL Tracking (`/track/:id`) & Audit Timeline
- **Action**: Click **Track Complaint FIX-1005 →** on the success card (or navigate directly to `/track/FIX-1005`).
- **Showcase**: The URL routes to `/track/FIX-1005`. The ticket renders with its location, department, upvote badge (👍 2 Reports), and the **Resolution Progress & Audit Timeline** logging every step:
  1. `Complaint Reported via FixIt Portal`
  2. `Auto-Assigned to Electrical Dept`
  3. `Me-too vote added by Meera (Total upvotes: 2)` with exact timestamps!

### 5️⃣ Minute 5: Admin Command Center & Live Dispatch
- **Action**: Click **Admin** in the navbar (`/admin`).
- **Showcase**: Protected dashboard state. Enter demo PIN `1234` and click **Authorize Login →**.
- **Showcase**: 
  - Real-time KPI stat cards update live.
  - The **CSS Bar Chart** shows complaints by category.
  - In the table, **FIX-1005** is ranked at the very top (sorted by High Priority first, then by 2 Upvotes).
- **Action**: Click the status button **→ In Progress** on FIX-1005.
- **Action**: Navigate back to `/track/FIX-1005` in the navbar. Point out that the status is now **In Progress** and a 4th audit entry has been added to the student's timeline!
- **Mobile Check**: Open browser DevTools (`F12`), toggle to **iPhone (390px)**, and showcase the collapsible mobile menu and responsive layout.

---

## 👥 Credits
- **Project**: FixIt CEC – Smart Campus Maintenance & Complaint Reporting
- **Event**: CEC-HACKSTORM-2026
- **Institution**: Canara Engineering College, Benjanapadavu, Bantwal
- **Team**: Technical Activity Cell
- **License**: MIT Open Source
