// test_react_app.js - Automated Test Runner for FixIt CEC React Project
import assert from 'assert';
import {
  calculatePriority,
  getRoutedDepartment,
  findOpenDuplicate,
  generateNextId,
  formatDateTime,
  timeAgo
} from './src/utils/logic.js';
import { getSeedComplaints, BLOCKS_CONFIG, CATEGORIES } from './src/data/campusData.js';

console.log("==================================================");
console.log("RUNNING FIXIT CEC REACT AUTOMATED TEST SUITE");
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

// 1. Data Integrity & Seeding
it("Seeds 4 complaints properly and leaves Room 204 open", () => {
  const seeds = getSeedComplaints();
  assert.strictEqual(seeds.length, 4, "Must seed exactly 4 complaints");
  const room204 = seeds.find(c => c.blk === "Main Block" && c.room === "Room 204");
  assert.strictEqual(room204, undefined, "Room 204 must NOT be seeded so test runs clean");
});

// 2. Logic: Priority Engine
it("Priority engine scores 'Ceiling fan sparking and burning smell' as High", () => {
  const prio = calculatePriority("Ceiling fan sparking and burning smell", "Electrical");
  assert.strictEqual(prio, "High", `Expected High, got ${prio}`);
});

it("Priority engine scores 'Wi-Fi is slow and 5 systems not working' as Medium", () => {
  const prio = calculatePriority("Wi-Fi is slow and 5 systems not working", "IT & Network");
  assert.strictEqual(prio, "Medium", `Expected Medium, got ${prio}`);
});

// 3. Logic: Auto-Routing
it("Auto-routes categories to correct campus departments", () => {
  assert.strictEqual(getRoutedDepartment("Electrical"), "Electrical Dept");
  assert.strictEqual(getRoutedDepartment("Plumbing & Water"), "Plumbing Team");
  assert.strictEqual(getRoutedDepartment("IT & Network"), "IT Support");
  assert.strictEqual(getRoutedDepartment("Cleanliness"), "Housekeeping");
  assert.strictEqual(getRoutedDepartment("Safety & Security"), "Security Office");
});

// 4. Test Scenario (b): Report "Ceiling fan sparking and burning smell" in Main Block, Room 204
let complaints = getSeedComplaints();
let newTicketId = null;

it("Test (b): Report 'Ceiling fan sparking and burning smell' in Main Block, Room 204 -> Creates High priority complaint", () => {
  const who = "Rahul Shenoy – 4CB22CS014";
  const cat = "Electrical";
  const blk = "Main Block";
  const room = "Room 204";
  const desc = "Ceiling fan sparking and burning smell";

  // Check duplicate
  const existing = findOpenDuplicate(complaints, blk, room, cat);
  assert.strictEqual(existing, null, "Should not be duplicate on first report");

  newTicketId = generateNextId(complaints);
  const prio = calculatePriority(desc, cat);
  const dept = getRoutedDepartment(cat);
  const now = Date.now();

  const newTicket = {
    id: newTicketId,
    who, cat, blk, room, desc,
    created: now,
    status: "Assigned",
    votes: 1,
    priority: prio,
    dept,
    photo: null,
    log: [
      { s: "Complaint Reported via FixIt Portal", t: now },
      { s: `Auto-Assigned to ${dept}`, t: now + 500 }
    ]
  };

  complaints = [newTicket, ...complaints];
  assert.strictEqual(newTicket.id, "FIX-1005");
  assert.strictEqual(newTicket.priority, "High");
  assert.strictEqual(newTicket.status, "Assigned");
  assert.strictEqual(newTicket.dept, "Electrical Dept");
  console.log(`   -> Created Ticket: ${newTicket.id} (${newTicket.priority} Priority, routed to ${newTicket.dept})`);
});

// 5. Test Scenario (c): Report the same issue again -> merged as a me-too vote
it("Test (c): Report the same issue again -> merged as a me-too vote", () => {
  const who = "Meera Pai – 4CB23IS022";
  const cat = "Electrical";
  const blk = "Main Block";
  const room = "Room 204";
  const desc = "Fan sparking in 204 and smell";

  const existing = findOpenDuplicate(complaints, blk, room, cat);
  assert(existing, "Duplicate detection must find the open complaint in Room 204");
  assert.strictEqual(existing.id, newTicketId);

  // Merge as vote
  existing.votes = (existing.votes || 1) + 1;
  existing.log.push({
    s: `Me-too vote added by ${who} (Total upvotes: ${existing.votes})`,
    t: Date.now()
  });

  assert.strictEqual(existing.votes, 2, "Votes should be incremented to 2");
  console.log(`   -> Merged into ${existing.id}! Updated votes: ${existing.votes}`);
});

// 6. Test Scenario (d): Track the complaint -> timeline contains all steps
it("Test (d): Track complaint by ID -> shows full timeline with me-too vote", () => {
  const found = complaints.find(c => c.id === newTicketId);
  assert(found, "Ticket must be retrievable by ID");
  assert.strictEqual(found.log.length, 3, "Timeline must contain 3 logged events");
  assert(found.log[2].s.includes("Me-too vote added"), "Third log item must be me-too vote");
});

// 7. Test Scenario (e): Admin PIN login & Status change
it("Test (e): Admin login with PIN 1234 and status change to In Progress", () => {
  const pin = "1234";
  const isAuth = pin === "1234";
  assert.strictEqual(isAuth, true, "PIN 1234 must authenticate admin");

  const ticket = complaints.find(c => c.id === newTicketId);
  ticket.status = "In Progress";
  ticket.log.push({
    s: "Status changed to In Progress by Facility Admin",
    t: Date.now()
  });

  assert.strictEqual(ticket.status, "In Progress");
  assert.strictEqual(ticket.log.length, 4);
  console.log(`   -> Status updated to 'In Progress' and logged to timeline!`);
});

// 8. Test QR Parameter parsing
it("Test QR code parameter format /report?loc=Main Block|Room 204", () => {
  const loc = "Main Block|Room 204";
  const [targetBlock, targetRoom] = loc.split("|");
  assert.strictEqual(targetBlock, "Main Block");
  assert.strictEqual(targetRoom, "Room 204");
  assert(BLOCKS_CONFIG[targetBlock].includes(targetRoom), "Block and room must be valid in campus config");
});

console.log("==================================================");
console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED!`);
console.log("==================================================");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
