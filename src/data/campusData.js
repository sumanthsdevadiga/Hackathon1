/**
 * campusData.js - Data definitions for Canara Engineering College (FixIt CEC)
 */

export const BLOCKS_CONFIG = {
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

export const CATEGORIES = [
  "Electrical",
  "Plumbing & Water",
  "Furniture & Civil",
  "IT & Network",
  "Cleanliness",
  "Safety & Security"
];

export const CATEGORY_ROUTING = {
  "Electrical": "Electrical Dept",
  "Plumbing & Water": "Plumbing Team",
  "Furniture & Civil": "Civil / Carpentry",
  "IT & Network": "IT Support",
  "Cleanliness": "Housekeeping",
  "Safety & Security": "Security Office"
};

export const DEPARTMENTS = [
  { name: "Electrical Dept", icon: "⚡", head: "Prof. K. Shenoy", contact: "Ext 201", status: "On Duty" },
  { name: "Plumbing Team", icon: "🚰", head: "Ramesh Naik", contact: "Ext 202", status: "On Duty" },
  { name: "Civil / Carpentry", icon: "🔨", head: "Manjunath P.", contact: "Ext 203", status: "On Duty" },
  { name: "IT Support", icon: "💻", head: "Suresh Rao", contact: "Ext 204", status: "On Duty" },
  { name: "Housekeeping", icon: "🧹", head: "Sunitha B.", contact: "Ext 205", status: "On Duty" },
  { name: "Security Office", icon: "🛡️", head: "Capt. D'Souza", contact: "Ext 206", status: "24/7 Active" }
];

export const STATUS_LIST = ["Reported", "Assigned", "In Progress", "Resolved"];

export function getSeedComplaints() {
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
