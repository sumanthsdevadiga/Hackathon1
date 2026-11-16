// test_app.js - Automated Test Runner for FixIt CEC Core Engine
const fs = require('fs');
const assert = require('assert');

// 1. Mock Browser Environment
const localStorageData = {};
global.localStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

global.window = {
  location: { hash: "#loc=Main Block|Room 204" },
  addEventListener: () => { }
};

// Mock basic DOM elements
const elements = {};
function createMockElement(id, initialVal = "") {
  return {
    id,
    value: initialVal,
    innerHTML: "",
    textContent: "",
    className: "",
    classList: {
      add: function (c) { this.classes.add(c); },
      remove: function (c) { this.classes.delete(c); },
      toggle: function (c, force) {
        if (force === undefined) {
          if (this.classes.has(c)) this.classes.delete(c);
          else this.classes.add(c);
        } else if (force) {
          this.classes.add(c);
        } else {
          this.classes.delete(c);
        }
      },
      contains: function (c) { return this.classes.has(c); },
      classes: new Set()
    },
    addEventListener: () => { },
    scrollIntoView: () => { },
    focus: () => { }
  };
}

const mockIds = [
  "reportBlock", "reportRoom", "reportWho", "reportCategory", "reportDesc",
  "reportPhoto", "reportResultContainer", "qrNotificationBanner", "qrBannerText",
  "livePriorityBadge", "livePriorityReason", "photoPreviewBox", "photoPreviewThumb",
  "photoRemoveBtn", "mobileNavToggle", "siteNavMenu", "statResolvedCount",
  "heroResolvedBadge", "heroLiveActiveBadge", "adminLoginCard", "adminDashboardPanel",
  "adminPinInput", "adminPinError", "admMetricTotal", "admMetricOpen",
  "admMetricHigh", "admMetricResolved", "adminCategoryChart", "adminStatusFilter",
  "adminPrioFilter", "adminTableBody", "photoViewerModal", "modalViewerImg",
  "trackInputId", "trackResultContainer"
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id);
});

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: () => [],
  addEventListener: () => { }
};

// 2. Load and evaluate app.js
const appCode = fs.readFileSync('app.js', 'utf8');
const vm = require('vm');
vm.runInThisContext(appCode);

const DB = window.DB;
const calculatePriority = window.calculatePriority;
const generateNextId = window.generateNextId;
const applyQRHash = window.applyQRHash;
const handleComplaintSubmit = window.handleComplaintSubmit;
const handleAdminLogin = window.handleAdminLogin;
const updateComplaintStatus = window.updateComplaintStatus;
const trackComplaintById = window.trackComplaintById;
const esc = window.esc;
const resetDemoData = window.resetDemoData;

console.log("==================================================");
console.log("FIXIT CEC AUTOMATED TEST SUITE EXECUTION");
console.log("==================================================");

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
  }
}

// TEST 1: Initial Database Seeding
it("Seeds 4 complaints properly", () => {
  assert.strictEqual(DB.length, 4, `Expected 4 seeded complaints, got ${DB.length}`);
  assert.strictEqual(DB[0].id, "FIX-1001");
});

// TEST 2: Priority Engine Keyword Scoring
it("Priority Engine scores 'Ceiling fan sparking and burning smell' as High", () => {
  const prio = calculatePriority("Ceiling fan sparking and burning smell", "Electrical");
  assert.strictEqual(prio, "High", `Expected 'High', got '${prio}'`);
});

it("Priority Engine scores 'Wi-Fi is slow and 5 systems not working' as Medium", () => {
  const prio = calculatePriority("Wi-Fi is slow and 5 systems not working", "IT & Network");
  assert.strictEqual(prio, "Medium", `Expected 'Medium', got '${prio}'`);
});

it("Priority Engine scores 'Empty dustbin needed' as Low", () => {
  const prio = calculatePriority("Empty dustbin needed", "Cleanliness");
  assert.strictEqual(prio, "Low", `Expected 'Low', got '${prio}'`);
});

// TEST 3: Next ID Generation
it("Generates next sequential ID FIX-1005", () => {
  const next = generateNextId();
  assert.strictEqual(next, "FIX-1005", `Expected 'FIX-1005', got '${next}'`);
});

// TEST 4: Room QR simulation
it("Parses QR hash #loc=Main Block|Room 204 correctly", () => {
  applyQRHash();
  assert.strictEqual(elements["reportBlock"].value, "Main Block");
  assert.strictEqual(elements["reportRoom"].value, "Room 204");
  assert.strictEqual(elements["qrNotificationBanner"].classList.contains("hide"), false);
});

// TEST 5: User Test (a) - Report 'Ceiling fan sparking and burning smell' in Main Block, Room 204
let createdId = null;
it("User Test (a): Report 'Ceiling fan sparking and burning smell' in Main Block, Room 204 -> Creates High priority complaint", () => {
  elements["reportWho"].value = "Harshith Rao – 4CB22CS045";
  elements["reportCategory"].value = "Electrical";
  elements["reportBlock"].value = "Main Block";
  elements["reportRoom"].value = "Room 204";
  elements["reportDesc"].value = "Ceiling fan sparking and burning smell";

  handleComplaintSubmit();

  const newTicket = DB.find(c => c.blk === "Main Block" && c.room === "Room 204" && c.cat === "Electrical");
  assert(newTicket, "New ticket should be created in DB");
  assert.strictEqual(newTicket.priority, "High", `Priority must be High, got ${newTicket.priority}`);
  assert.strictEqual(newTicket.status, "Assigned", "Status should be Assigned");
  assert.strictEqual(newTicket.dept, "Electrical Dept", "Auto-routed to Electrical Dept");
  assert.strictEqual(newTicket.votes, 1, "Initial vote count should be 1");
  createdId = newTicket.id;
  assert.strictEqual(createdId, "FIX-1005");
  console.log(`   -> Created Complaint ID: ${createdId} with Priority: ${newTicket.priority}`);
});

// TEST 6: User Test (b) - Report same issue again -> must merge as me-too vote
it("User Test (b): Report same issue again -> merges as a me-too vote", () => {
  elements["reportWho"].value = "Kavya Bhat – 4CB23CS012";
  elements["reportCategory"].value = "Electrical";
  elements["reportBlock"].value = "Main Block";
  elements["reportRoom"].value = "Room 204";
  elements["reportDesc"].value = "Ceiling fan sparking and burning smell observed again";

  handleComplaintSubmit();

  const existingTicket = DB.find(c => c.id === createdId);
  assert.strictEqual(existingTicket.votes, 2, `Votes must be incremented to 2, got ${existingTicket.votes}`);
  const lastLog = existingTicket.log[existingTicket.log.length - 1];
  assert(lastLog.s.includes("Me-too vote added"), `Expected me-too vote log, got: ${lastLog.s}`);
  assert(elements["reportResultContainer"].innerHTML.includes("Similar Issue Already Reported – Merged!"), "UI must indicate merge");
  console.log(`   -> Successfully merged! New vote count: ${existingTicket.votes}`);
});

// TEST 7: User Test (c) - Admin sets it to In Progress -> Track ID and see timeline
it("User Test (c): Admin sets status to In Progress and timeline updates", () => {
  // 1. Admin login with PIN 1234
  elements["adminPinInput"].value = "1234";
  handleAdminLogin();
  assert.strictEqual(isAdminAuthenticated, true, "Admin should be authenticated with PIN 1234");

  // 2. Admin sets status to 'In Progress'
  updateComplaintStatus(createdId, "In Progress");
  const ticket = DB.find(c => c.id === createdId);
  assert.strictEqual(ticket.status, "In Progress", `Status should be 'In Progress', got ${ticket.status}`);

  // 3. Track complaint and verify timeline
  trackComplaintById(createdId);
  const trackHtml = elements["trackResultContainer"].innerHTML;
  assert(trackHtml.includes(createdId), "Track output must contain Ticket ID");
  assert(trackHtml.includes("In Progress"), "Track output must display 'In Progress' status");
  assert(trackHtml.includes("Status changed to In Progress by Admin"), "Timeline must log admin status transition");
  console.log("   -> Timeline verified with all status audit transitions!");
});

// TEST 8: XSS Prevention
it("XSS prevention: Escapes malicious tags safely", () => {
  const dangerous = "<script>alert('pwned')</script>";
  const escaped = esc(dangerous);
  assert.strictEqual(escaped, "&lt;script&gt;alert(&#39;pwned&#39;)&lt;/script&gt;");
  assert(!escaped.includes("<script>"));
});

// TEST 9: Reset Demo Data
it("Reset demo data restores original 4 seed items", () => {
  // mock confirm
  global.confirm = () => true;
  global.alert = () => { };
  resetDemoData();
  assert.strictEqual(window.DB.length, 4, `Expected 4 items after reset, got ${window.DB.length}`);
});

console.log("==================================================");
console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED!`);
console.log("==================================================");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
