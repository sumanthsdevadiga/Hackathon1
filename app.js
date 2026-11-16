/**
 * FixIt CEC – Smart Campus Maintenance & Complaint Reporting
 * Canara Engineering College | CEC-HACKSTORM-2026
 * 
 * Core Application Logic:
 * - Smart Priority Engine (Keyword scoring)
 * - Duplicate Detection & Me-Too Vote Merging
 * - Department Auto-Routing
 * - QR Code Hash Parser (#loc=Block|Room)
 * - Interactive Timeline & Status Tracking
 * - Admin Dashboard & Analytics (PIN 1234)
 * - LocalStorage persistence with try/catch
 */

// ==========================================================================
// 1. DATA CONSTANTS & DEFINITIONS
// ==========================================================================

const BLOCKS_CONFIG = {
  "Main Block": [
    "Room 101",
    "Room 204",
    "Room 305",
    "Seminar Hall",
    "Corridor – Ground Floor",
    "Principal's Office",
    "Board Room"
  ],
  "ISE Department": [
    "Lab 1",
    "Lab 2",
    "Staff Room",
    "Classroom 1",
    "Washroom",
    "Server Room"
  ],
  "Library": [
    "Reading Hall",
    "Digital Section",
    "Stack Area",
    "Washroom"
  ],
  "Canteen": [
    "Dining Area",
    "Wash Area",
    "Kitchen Counter",
    "Faculty Dining"
  ],
  "Hostel / Grounds": [
    "Boys Hostel",
    "Girls Hostel",
    "Parking Area",
    "Playground",
    "Gymnasium"
  ],
  "Mechanical Block": [
    "Workshop 1",
    "CAD Lab",
    "Thermodynamics Lab",
    "Seminar Hall"
  ]
};

const CATEGORY_ROUTING = {
  "Electrical": "Electrical Dept",
  "Plumbing & Water": "Plumbing Team",
  "Furniture & Civil": "Civil / Carpentry",
  "IT & Network": "IT Support",
  "Cleanliness": "Housekeeping",
  "Safety & Security": "Security Office"
};

const STATUS_OPTIONS = ["Reported", "Assigned", "In Progress", "Resolved"];

// High & Medium signals for offline heuristic scoring
const HIGH_KEYWORDS = [
  "spark", "sparking", "short circuit", "shock", "fire", "smoke",
  "burning", "exposed wire", "flood", "gas", "leak", "collapse",
  "broken glass", "injur", "unsafe", "danger", "stuck", "theft", "explosion"
];

const MEDIUM_KEYWORDS = [
  "not working", "broken", "overflow", "no water", "no power",
  "blocked", "slow", "dirty", "smell", "damaged", "crack", "down", "faulty", "choked"
];

const STORAGE_KEY = "fixit_cec_db_v2";
const ADMIN_PIN = "1234";

// ==========================================================================
// 2. HELPER FUNCTIONS
// ==========================================================================

// Safe HTML Escape to prevent injection
function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// Format Unix Timestamp nicely
function formatDateTime(ts) {
  if (!ts) return "N/A";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) + " · " + d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// Relative time string (e.g., "2 hours ago")
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Priority Scoring Engine
function calculatePriority(text, category) {
  const lower = (text || "").toLowerCase();
  let score = 0;

  HIGH_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) score += 3;
  });

  MEDIUM_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) score += 1;
  });

  // Category specific risk weightings
  if (category === "Safety & Security") score += 3;
  if (category === "Electrical") score += 1;

  if (score >= 3) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

// ==========================================================================
// 3. STORAGE & SEED DATA
// ==========================================================================

function getSeedData() {
  const now = Date.now();
  const HOUR = 3600000;

  return [
    {
      id: "FIX-1001",
      who: "Rahul Shenoy – 4CB22CS014",
      cat: "Electrical",
      blk: "Main Block",
      room: "Room 101",
      desc: "Ceiling light flickering constantly and switchboard has loose contact.",
      created: now - 30 * HOUR,
      status: "In Progress",
      votes: 3,
      priority: "High",
      dept: "Electrical Dept",
      photo: null,
      log: [
        { s: "Complaint Reported via FixIt Portal", t: now - 30 * HOUR },
        { s: "Auto-Assigned to Electrical Dept", t: now - 29 * HOUR },
        { s: "Technician dispatched – In Progress", t: now - 18 * HOUR }
      ]
    },
    {
      id: "FIX-1002",
      who: "Meera Pai – 4CB23IS022",
      cat: "Plumbing & Water",
      blk: "Canteen",
      room: "Wash Area",
      desc: "Main wash tap leaking continuously, water on floor causing slip hazard.",
      created: now - 20 * HOUR,
      status: "Assigned",
      votes: 2,
      priority: "High",
      dept: "Plumbing Team",
      photo: null,
      log: [
        { s: "Complaint Reported via FixIt Portal", t: now - 20 * HOUR },
        { s: "Assigned to Plumbing Team", t: now - 19 * HOUR }
      ]
    },
    {
      id: "FIX-1003",
      who: "Arjun Kamath – 4CB22EC009",
      cat: "IT & Network",
      blk: "ISE Department",
      room: "Lab 2",
      desc: "Wi-Fi is extremely slow and 5 systems not connecting to the intranet.",
      created: now - 8 * HOUR,
      status: "Reported",
      votes: 1,
      priority: "Medium",
      dept: "IT Support",
      photo: null,
      log: [
        { s: "Complaint Reported via FixIt Portal", t: now - 8 * HOUR }
      ]
    },
    {
      id: "FIX-1004",
      who: "Sneha Shetty – 4CB24ME031",
      cat: "Cleanliness",
      blk: "Library",
      room: "Washroom",
      desc: "Washroom needs cleaning and soap dispenser is empty.",
      created: now - 52 * HOUR,
      status: "Resolved",
      votes: 1,
      priority: "Low",
      dept: "Housekeeping",
      photo: null,
      log: [
        { s: "Complaint Reported via FixIt Portal", t: now - 52 * HOUR },
        { s: "Assigned to Housekeeping Team", t: now - 50 * HOUR },
        { s: "Sanitization Completed – Resolved", t: now - 44 * HOUR }
      ]
    }
  ];
}

function loadDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("FixIt CEC: LocalStorage read error, using memory fallback.", err);
  }
  const seed = getSeedData();
  saveDatabase(seed);
  return seed;
}

function saveDatabase(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("FixIt CEC: Failed to save to LocalStorage", err);
  }
}

let DB = loadDatabase();
window.DB = DB;

function generateNextId() {
  let highest = 1000;
  DB.forEach(item => {
    if (item.id && item.id.startsWith("FIX-")) {
      const num = parseInt(item.id.replace("FIX-", ""), 10);
      if (!isNaN(num) && num > highest) {
        highest = num;
      }
    }
  });
  return "FIX-" + (highest + 1);
}

// ==========================================================================
// 4. UI POPULATION & EVENT LISTENERS
// ==========================================================================

let uploadedPhotoBase64 = null;
let isAdminAuthenticated = false;

document.addEventListener("DOMContentLoaded", () => {
  initBlocksAndRooms();
  applyQRHash();
  setupLivePriorityPreview();
  setupPhotoUpload();
  updateHeroStats();

  // Hash change listener for QR support while on page
  window.addEventListener("hashchange", applyQRHash);

  // Smooth scroll links and mobile nav toggle
  setupNavigation();
});

function initBlocksAndRooms() {
  const blkSelect = document.getElementById("reportBlock");
  if (!blkSelect) return;

  blkSelect.innerHTML = Object.keys(BLOCKS_CONFIG)
    .map(b => `<option value="${esc(b)}">${esc(b)}</option>`)
    .join("");

  blkSelect.addEventListener("change", populateRoomsForSelectedBlock);
  populateRoomsForSelectedBlock();
}

function populateRoomsForSelectedBlock() {
  const blkSelect = document.getElementById("reportBlock");
  const roomSelect = document.getElementById("reportRoom");
  if (!blkSelect || !roomSelect) return;

  const currentBlock = blkSelect.value;
  const rooms = BLOCKS_CONFIG[currentBlock] || [];

  roomSelect.innerHTML = rooms
    .map(r => `<option value="${esc(r)}">${esc(r)}</option>`)
    .join("");
}

// QR Simulation via Hash: e.g. #loc=Main Block|Room 204
function applyQRHash() {
  const hash = decodeURIComponent(window.location.hash || "");
  const match = hash.match(/loc=([^|]+)\|(.+)/);

  if (match) {
    const targetBlock = match[1].trim();
    const targetRoom = match[2].trim();

    if (BLOCKS_CONFIG[targetBlock] && BLOCKS_CONFIG[targetBlock].includes(targetRoom)) {
      const blkSelect = document.getElementById("reportBlock");
      const roomSelect = document.getElementById("reportRoom");
      const qrBanner = document.getElementById("qrNotificationBanner");
      const qrBannerText = document.getElementById("qrBannerText");

      if (blkSelect && roomSelect) {
        blkSelect.value = targetBlock;
        populateRoomsForSelectedBlock();
        roomSelect.value = targetRoom;

        if (qrBanner && qrBannerText) {
          qrBanner.classList.remove("hide");
          qrBannerText.innerHTML = `📍 Location auto-filled from room QR code: <strong>${esc(targetBlock)} – ${esc(targetRoom)}</strong>`;
        }

        // Smooth scroll to report form
        const reportSection = document.getElementById("report");
        if (reportSection) {
          reportSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }
}

// Real-time Priority Feedback as user types description
function setupLivePriorityPreview() {
  const descInput = document.getElementById("reportDesc");
  const catInput = document.getElementById("reportCategory");
  const previewBadge = document.getElementById("livePriorityBadge");
  const previewReason = document.getElementById("livePriorityReason");

  function updatePreview() {
    if (!descInput || !previewBadge) return;
    const text = descInput.value;
    const cat = catInput ? catInput.value : "Electrical";
    const prio = calculatePriority(text, cat);

    previewBadge.className = `pill-badge pill-prio-${prio}`;
    previewBadge.textContent = `${prio} Priority`;

    if (previewReason) {
      if (prio === "High") {
        previewReason.textContent = "Urgent hazard or safety keyword detected! Routed as urgent.";
      } else if (prio === "Medium") {
        previewReason.textContent = "Functional disruption detected. Standard 24h turnaround.";
      } else {
        previewReason.textContent = "Routine request. Handled during daily maintenance cycle.";
      }
    }
  }

  if (descInput) descInput.addEventListener("input", updatePreview);
  if (catInput) catInput.addEventListener("change", updatePreview);
}

// Base64 Photo Upload Handler with Max 400KB check
function setupPhotoUpload() {
  const photoInput = document.getElementById("reportPhoto");
  const previewBox = document.getElementById("photoPreviewBox");
  const previewThumb = document.getElementById("photoPreviewThumb");
  const removeBtn = document.getElementById("photoRemoveBtn");

  if (!photoInput) return;

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      clearUploadedPhoto();
      return;
    }

    if (file.size > 400 * 1024) {
      alert("⚠️ Photo file size exceeds 400KB limit. Please choose a smaller image.");
      photoInput.value = "";
      clearUploadedPhoto();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadedPhotoBase64 = reader.result;
      if (previewBox && previewThumb) {
        previewThumb.src = uploadedPhotoBase64;
        previewBox.classList.remove("hide");
      }
    };
    reader.readAsDataURL(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      clearUploadedPhoto();
      if (photoInput) photoInput.value = "";
    });
  }
}

function clearUploadedPhoto() {
  uploadedPhotoBase64 = null;
  const previewBox = document.getElementById("photoPreviewBox");
  const previewThumb = document.getElementById("photoPreviewThumb");
  if (previewBox) previewBox.classList.add("hide");
  if (previewThumb) previewThumb.src = "";
}

// Navigation & Mobile menu toggle
function setupNavigation() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("siteNavMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    // Close mobile nav on link click
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // Active section scrollspy
  window.addEventListener("scroll", () => {
    const sections = ["hero", "what-we-fix", "how-it-works", "report", "track", "admin"];
    const scrollPos = window.scrollY + 120;

    sections.forEach(id => {
      const el = document.getElementById(id);
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (el && navLink) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
          navLink.classList.add("active");
        }
      }
    });
  });
}

// ==========================================================================
// 5. COMPLAINT SUBMISSION & DUPLICATE ENGINE
// ==========================================================================

function handleComplaintSubmit(e) {
  if (e) e.preventDefault();

  const whoInput = document.getElementById("reportWho");
  const catInput = document.getElementById("reportCategory");
  const blkInput = document.getElementById("reportBlock");
  const roomInput = document.getElementById("reportRoom");
  const descInput = document.getElementById("reportDesc");
  const resultContainer = document.getElementById("reportResultContainer");

  const who = (whoInput ? whoInput.value : "").trim();
  const cat = catInput ? catInput.value : "";
  const blk = blkInput ? blkInput.value : "";
  const room = roomInput ? roomInput.value : "";
  const desc = (descInput ? descInput.value : "").trim();

  // Basic Validation
  if (!who) {
    showReportResult("error", "⚠️ Please enter your Name / USN.");
    if (whoInput) whoInput.focus();
    return;
  }

  if (desc.length < 8) {
    showReportResult("error", "⚠️ Please describe the problem with at least 8 characters.");
    if (descInput) descInput.focus();
    return;
  }

  // 1. DUPLICATE DETECTION CHECK
  // If an open complaint exists for the same Block, Room, and Category, merge it!
  const duplicate = DB.find(c =>
    c.status !== "Resolved" &&
    c.blk === blk &&
    c.room === room &&
    c.cat === cat
  );

  if (duplicate) {
    duplicate.votes = (duplicate.votes || 1) + 1;
    duplicate.log.push({
      s: `Me-too vote added by ${who} (Total upvotes: ${duplicate.votes})`,
      t: Date.now()
    });
    saveDatabase(DB);
    updateHeroStats();
    if (isAdminAuthenticated) renderAdminDashboard();

    showReportResult("merged", `
      <div style="display:flex; align-items:flex-start; gap:16px;">
        <div style="font-size:2rem; line-height:1;">🤝</div>
        <div>
          <h4 style="margin:0 0 6px 0; color:#BAE6FD; font-size:1.15rem;">Similar Issue Already Reported – Merged!</h4>
          <p style="margin:0 0 10px 0; font-size:0.92rem; color:#93C5FD;">
            An active complaint (<strong>${esc(duplicate.id)}</strong>) is already open for <strong>${esc(blk)} – ${esc(room)}</strong> under <strong>${esc(cat)}</strong>.
          </p>
          <p style="margin:0 0 14px 0; font-size:0.92rem; color:#93C5FD;">
            Instead of cluttering the system, your submission has been added as a <strong>“Me-Too” vote</strong>. Priority has increased to <strong>${duplicate.votes} upvotes</strong>!
          </p>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <button class="btn-pill btn-primary-coral btn-sm" onclick="quickTrackComplaint('${esc(duplicate.id)}')">
              Track Complaint ${esc(duplicate.id)} →
            </button>
            <span class="pill-badge pill-status-${duplicate.status.replace(/\s+/g, '')}">Current Status: ${esc(duplicate.status)}</span>
          </div>
        </div>
      </div>
    `);

    // Reset description & photo
    if (descInput) descInput.value = "";
    clearUploadedPhoto();
    return;
  }

  // 2. CREATE NEW COMPLAINT
  const newId = generateNextId();
  const priority = calculatePriority(desc, cat);
  const dept = CATEGORY_ROUTING[cat] || "Campus Administration";
  const now = Date.now();

  const newComplaint = {
    id: newId,
    who: who,
    cat: cat,
    blk: blk,
    room: room,
    desc: desc,
    created: now,
    status: "Assigned", // Auto-routed directly
    votes: 1,
    priority: priority,
    dept: dept,
    photo: uploadedPhotoBase64,
    log: [
      { s: "Complaint Reported via FixIt Portal", t: now },
      { s: `Auto-routed & Assigned to ${dept}`, t: now + 500 }
    ]
  };

  DB.unshift(newComplaint);
  saveDatabase(DB);
  updateHeroStats();
  if (isAdminAuthenticated) renderAdminDashboard();

  // Show Success Result
  showReportResult("success", `
    <div style="display:flex; align-items:flex-start; gap:16px;">
      <div style="font-size:2rem; line-height:1;">✅</div>
      <div style="flex-grow:1;">
        <h4 style="margin:0 0 6px 0; color:#A7F3D0; font-size:1.2rem;">Complaint Successfully Registered!</h4>
        <p style="margin:0 0 12px 0; font-size:0.93rem; color:#6EE7B7;">
          Your issue has been logged, scored for priority, and automatically routed to the right campus department.
        </p>
        <div style="background:rgba(15, 23, 42, 0.75); border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:16px; margin-bottom:16px; box-shadow:0 0 15px rgba(16, 185, 129, 0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="font-size:0.8rem; text-transform:uppercase; color:#94A3B8; font-weight:700;">Complaint ID</span>
              <div style="font-size:1.4rem; font-weight:800; color:#FFFFFF;">${esc(newComplaint.id)}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <span class="pill-badge pill-prio-${newComplaint.priority}">${newComplaint.priority} Priority</span>
              <span class="pill-badge pill-status-Assigned">Assigned</span>
            </div>
          </div>
          <div style="margin-top:10px; font-size:0.88rem; color:#E2E8F0;">
            📍 <strong>${esc(newComplaint.blk)} – ${esc(newComplaint.room)}</strong> &nbsp;|&nbsp; 🏢 Auto-routed to: <strong>${esc(newComplaint.dept)}</strong>
          </div>
        </div>
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <button class="btn-pill btn-primary-coral btn-sm" onclick="quickTrackComplaint('${esc(newComplaint.id)}')">
            Track Now →
          </button>
          <button class="btn-pill btn-outline-dark btn-sm" onclick="copyComplaintId('${esc(newComplaint.id)}')">
            📋 Copy ID
          </button>
        </div>
      </div>
    </div>
  `);

  // Clear inputs
  if (descInput) descInput.value = "";
  clearUploadedPhoto();
}

function showReportResult(type, htmlContent) {
  const container = document.getElementById("reportResultContainer");
  if (!container) return;

  container.className = `result-box result-${type}`;
  container.innerHTML = htmlContent;
  container.classList.remove("hide");
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function copyComplaintId(id) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(id).then(() => {
      alert(`Copied ID ${id} to clipboard!`);
    }).catch(() => {
      prompt("Copy your Complaint ID:", id);
    });
  } else {
    prompt("Copy your Complaint ID:", id);
  }
}

// ==========================================================================
// 6. TRACK COMPLAINT & TIMELINE
// ==========================================================================

function trackComplaintById(customId) {
  const searchInput = document.getElementById("trackInputId");
  const queryId = (customId || (searchInput ? searchInput.value : "")).trim().toUpperCase();
  const outputContainer = document.getElementById("trackResultContainer");

  if (!outputContainer) return;

  if (!queryId) {
    outputContainer.innerHTML = `
      <div class="result-box result-error">
        ⚠️ Please enter a valid Complaint ID (e.g. FIX-1001).
      </div>
    `;
    outputContainer.classList.remove("hide");
    return;
  }

  const complaint = DB.find(c => c.id.toUpperCase() === queryId);

  if (!complaint) {
    outputContainer.innerHTML = `
      <div class="result-box result-error">
        <h4 style="margin:0 0 6px 0;">Complaint Not Found</h4>
        <p style="margin:0;">No record found with ID <strong>${esc(queryId)}</strong>. Please check your reference ID or report a new issue.</p>
      </div>
    `;
    outputContainer.classList.remove("hide");
    return;
  }

  // Build Timeline Items
  const timelineHtml = (complaint.log || []).map((step, idx) => {
    const isResolved = step.s.toLowerCase().includes("resolved");
    const isLatest = idx === complaint.log.length - 1;
    return `
      <div class="timeline-item">
        <div class="timeline-dot ${isResolved ? 'resolved' : ''}"></div>
        <div class="timeline-content-title" style="${isLatest ? 'color:var(--primary-orange);' : ''}">
          ${esc(step.s)}
        </div>
        <div class="timeline-content-time">
          ${formatDateTime(step.t)} (${timeAgo(step.t)})
        </div>
      </div>
    `;
  }).join("");

  // Photo thumbnail if exists
  const photoHtml = complaint.photo ? `
    <div style="margin-top:16px;">
      <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">ATTACHED EVIDENCE PHOTO:</span>
      <img src="${complaint.photo}" alt="Attached Evidence" style="max-height:160px; border-radius:12px; border:1px solid #E5E7EB; cursor:pointer;" onclick="openImageModal('${complaint.photo}')" title="Click to view full image">
    </div>
  ` : "";

  outputContainer.innerHTML = `
    <div class="track-result-card">
      <div class="track-header-row">
        <div>
          <span style="font-size:0.82rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Canara Engineering College · Ticket</span>
          <div class="track-id-large">${esc(complaint.id)}</div>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span class="pill-badge pill-prio-${complaint.priority}">${complaint.priority} Priority</span>
          <span class="pill-badge pill-status-${complaint.status.replace(/\s+/g, '')}">${esc(complaint.status)}</span>
          <span class="vote-badge">👍 ${complaint.votes || 1} Report${(complaint.votes || 1) > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px; font-size:0.9rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">LOCATION</span>
          <strong>${esc(complaint.blk)} – ${esc(complaint.room)}</strong>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">CATEGORY & DEPT</span>
          <strong>${esc(complaint.cat)}</strong> (${esc(complaint.dept)})
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">REPORTED BY</span>
          <span>${esc(complaint.who)}</span>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">INITIAL TIMESTAMP</span>
          <span>${formatDateTime(complaint.created)}</span>
        </div>
      </div>

      <div style="background:rgba(15, 23, 42, 0.7); border:1px solid var(--border-subtle); border-radius:14px; padding:18px; margin-bottom:24px;">
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">ISSUE DESCRIPTION:</span>
        <p style="margin:0; font-size:0.95rem; color:#F8FAFC; font-weight:500;">
          "${esc(complaint.desc)}"
        </p>
        ${photoHtml}
      </div>

      <h4 style="font-size:1.05rem; margin-bottom:16px;">Resolution Progress & Audit Timeline</h4>
      <div class="timeline">
        ${timelineHtml}
      </div>
    </div>
  `;

  outputContainer.classList.remove("hide");
  outputContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function quickTrackComplaint(id) {
  const searchInput = document.getElementById("trackInputId");
  if (searchInput) searchInput.value = id;

  const trackSection = document.getElementById("track");
  if (trackSection) {
    trackSection.scrollIntoView({ behavior: "smooth" });
  }
  trackComplaintById(id);
}

// ==========================================================================
// 7. STATS STRIP & METRICS UPDATE
// ==========================================================================

function updateHeroStats() {
  const totalCount = DB.length;
  const resolvedCount = DB.filter(c => c.status === "Resolved").length;
  const highOpenCount = DB.filter(c => c.priority === "High" && c.status !== "Resolved").length;

  const resolvedStatEl = document.getElementById("statResolvedCount");
  const heroResolvedBadge = document.getElementById("heroResolvedBadge");
  const heroLiveActiveBadge = document.getElementById("heroLiveActiveBadge");

  if (resolvedStatEl) {
    resolvedStatEl.textContent = `${120 + resolvedCount}+`;
  }
  if (heroResolvedBadge) {
    heroResolvedBadge.textContent = `${120 + resolvedCount}+ Issues Fixed`;
  }
  if (heroLiveActiveBadge) {
    heroLiveActiveBadge.textContent = `${highOpenCount} Priority Active`;
  }
}

// ==========================================================================
// 8. ADMIN DASHBOARD (PIN 1234)
// ==========================================================================

function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const pinInput = document.getElementById("adminPinInput");
  const pinError = document.getElementById("adminPinError");

  if (!pinInput) return;

  if (pinInput.value.trim() === ADMIN_PIN) {
    isAdminAuthenticated = true;
    if (pinError) pinError.classList.add("hide");
    document.getElementById("adminLoginCard").classList.add("hide");
    document.getElementById("adminDashboardPanel").classList.remove("hide");
    renderAdminDashboard();
  } else {
    if (pinError) {
      pinError.classList.remove("hide");
      pinError.textContent = "❌ Incorrect PIN! For the demo, use PIN: 1234";
    }
    pinInput.focus();
  }
}

function renderAdminDashboard() {
  if (!isAdminAuthenticated) return;

  const total = DB.length;
  const open = DB.filter(c => c.status !== "Resolved").length;
  const highOpen = DB.filter(c => c.priority === "High" && c.status !== "Resolved").length;
  const resolved = DB.filter(c => c.status === "Resolved").length;

  // Stat metrics
  const mTotal = document.getElementById("admMetricTotal");
  const mOpen = document.getElementById("admMetricOpen");
  const mHigh = document.getElementById("admMetricHigh");
  const mResolved = document.getElementById("admMetricResolved");

  if (mTotal) mTotal.textContent = total;
  if (mOpen) mOpen.textContent = open;
  if (mHigh) mHigh.textContent = highOpen;
  if (mResolved) mResolved.textContent = resolved;

  renderCategoryChart();
  renderAdminTable();
}

function renderCategoryChart() {
  const chartContainer = document.getElementById("adminCategoryChart");
  if (!chartContainer) return;

  const counts = {};
  Object.keys(CATEGORY_ROUTING).forEach(cat => { counts[cat] = 0; });
  DB.forEach(c => {
    counts[c.cat] = (counts[c.cat] || 0) + 1;
  });

  const maxVal = Math.max(...Object.values(counts), 1);

  chartContainer.innerHTML = Object.entries(counts).map(([cat, count]) => {
    const pct = Math.round((count / maxVal) * 100);
    return `
      <div class="chart-row">
        <div style="font-weight:600; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(cat)}</div>
        <div class="chart-bar-bg">
          <div class="chart-bar-fill" style="width:${pct}%;"></div>
        </div>
        <div style="font-weight:700; color:var(--text-muted); text-align:right;">${count}</div>
      </div>
    `;
  }).join("");
}

function renderAdminTable() {
  const tableBody = document.getElementById("adminTableBody");
  const statusFilterEl = document.getElementById("adminStatusFilter");
  const prioFilterEl = document.getElementById("adminPrioFilter");
  if (!tableBody) return;

  const statusFilter = statusFilterEl ? statusFilterEl.value : "All";
  const prioFilter = prioFilterEl ? prioFilterEl.value : "All";

  const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };

  // Filter & Sort
  const filtered = DB.filter(item => {
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPrio = prioFilter === "All" || item.priority === prioFilter;
    return matchesStatus && matchesPrio;
  });

  // Sort by Priority (High first), then by Votes (desc), then by Date (desc)
  filtered.sort((a, b) => {
    const prioDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    if (prioDiff !== 0) return prioDiff;
    const voteDiff = (b.votes || 1) - (a.votes || 1);
    if (voteDiff !== 0) return voteDiff;
    return b.created - a.created;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">
          No complaints match the selected filters.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(c => {
    const actionButtons = STATUS_OPTIONS.filter(s => s !== c.status).map(s => `
      <button class="action-status-btn" onclick="updateComplaintStatus('${esc(c.id)}', '${esc(s)}')">
        → ${esc(s)}
      </button>
    `).join("");

    const photoThumb = c.photo ? `
      <div style="margin-top:6px;">
        <img src="${c.photo}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; cursor:pointer;" onclick="openImageModal('${c.photo}')" title="View attached photo">
      </div>
    ` : "";

    return `
      <tr>
        <td>
          <strong style="color:var(--text-main);">${esc(c.id)}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${timeAgo(c.created)}</div>
        </td>
        <td style="max-width:280px;">
          <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${esc(c.desc)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">Reporter: ${esc(c.who)}</div>
          ${photoThumb}
        </td>
        <td>
          <div><strong>${esc(c.blk)}</strong></div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${esc(c.room)}</div>
        </td>
        <td>
          <span class="pill-badge pill-prio-${c.priority}">${c.priority}</span>
        </td>
        <td>
          <span style="font-size:0.82rem; font-weight:600;">${esc(c.dept)}</span>
        </td>
        <td>
          <span class="vote-badge">👍 ${c.votes || 1}</span>
        </td>
        <td>
          <div style="margin-bottom:8px;">
            <span class="pill-badge pill-status-${c.status.replace(/\s+/g, '')}">${esc(c.status)}</span>
          </div>
          <div class="admin-action-btn-group">
            ${actionButtons}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateComplaintStatus(id, newStatus) {
  const complaint = DB.find(c => c.id === id);
  if (!complaint) return;

  complaint.status = newStatus;
  complaint.log.push({
    s: `Status changed to ${newStatus} by Admin`,
    t: Date.now()
  });

  saveDatabase(DB);
  updateHeroStats();
  renderAdminDashboard();

  // If track output is open for this complaint, update it live
  const trackInput = document.getElementById("trackInputId");
  if (trackInput && trackInput.value.trim().toUpperCase() === id.toUpperCase()) {
    trackComplaintById(id);
  }
}

function resetDemoData() {
  if (confirm("Are you sure you want to reset all complaints to the original demo dataset?")) {
    DB = getSeedData();
    saveDatabase(DB);
    updateHeroStats();
    renderAdminDashboard();
    alert("Demo data successfully reset!");
  }
}

// ==========================================================================
// 9. IMAGE MODAL
// ==========================================================================

function openImageModal(imgSrc) {
  const modal = document.getElementById("photoViewerModal");
  const modalImg = document.getElementById("modalViewerImg");
  if (modal && modalImg) {
    modalImg.src = imgSrc;
    modal.classList.remove("hide");
  }
}

function closeImageModal() {
  const modal = document.getElementById("photoViewerModal");
  if (modal) {
    modal.classList.add("hide");
  }
}

function handleAdminLogout() {
  isAdminAuthenticated = false;
  document.getElementById("adminLoginCard").classList.remove("hide");
  document.getElementById("adminDashboardPanel").classList.add("hide");
  const pinInput = document.getElementById("adminPinInput");
  if (pinInput) pinInput.value = "";
}

// Global functions exposed to inline handlers
window.handleComplaintSubmit = handleComplaintSubmit;
window.trackComplaintById = trackComplaintById;
window.quickTrackComplaint = quickTrackComplaint;
window.copyComplaintId = copyComplaintId;
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.updateComplaintStatus = updateComplaintStatus;
window.resetDemoData = resetDemoData;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.renderAdminDashboard = renderAdminDashboard;
window.calculatePriority = calculatePriority;
window.generateNextId = generateNextId;
window.applyQRHash = applyQRHash;
window.esc = esc;
Object.defineProperty(window, 'isAdminAuthenticated', {
  get: () => isAdminAuthenticated,
  set: (v) => { isAdminAuthenticated = v; }
});
Object.defineProperty(window, 'DB', {
  get: () => DB,
  set: (v) => { DB = v; }
});
