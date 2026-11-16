/**
 * logic.js - Core Business Logic & Pure Functions
 * 
 * Features:
 * - Smart Priority Heuristic Engine (keyword scoring)
 * - Duplicate Detection & Me-Too Vote Merging
 * - Department Auto-Routing
 * - ID Generator & Timeline Audit Logger
 */

import { CATEGORY_ROUTING } from '../data/campusData.js';

// High signals (Urgent hazard, fire risk, flooding)
export const HIGH_KEYWORDS = [
  "spark", "sparking", "short circuit", "shock", "fire", "smoke",
  "burning", "exposed wire", "flood", "gas", "leak", "collapse",
  "broken glass", "injur", "unsafe", "danger", "stuck", "theft", "explosion"
];

// Medium signals (Functional disruption, blockages, degradation)
export const MEDIUM_KEYWORDS = [
  "not working", "broken", "overflow", "no water", "no power",
  "blocked", "slow", "dirty", "smell", "damaged", "crack", "down", "faulty", "choked"
];

/**
 * Evaluates text and category to assign a priority score (High / Medium / Low).
 * Pure function.
 */
export function calculatePriority(text, category) {
  const lower = (text || "").toLowerCase();
  let score = 0;

  HIGH_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) score += 3;
  });

  MEDIUM_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) score += 1;
  });

  // Additional weight for critical campus safety categories
  if (category === "Safety & Security") score += 3;
  if (category === "Electrical") score += 1;

  if (score >= 3) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

/**
 * Determines target department from issue category.
 * Pure function.
 */
export function getRoutedDepartment(category) {
  return CATEGORY_ROUTING[category] || "Campus Administration";
}

/**
 * Checks if an open complaint already exists for the given block, room, and category.
 * Returns the matching complaint object if found, or null.
 * Pure function.
 */
export function findOpenDuplicate(complaints, block, room, category) {
  if (!Array.isArray(complaints)) return null;
  return complaints.find(c =>
    c.status !== "Resolved" &&
    c.blk === block &&
    c.room === room &&
    c.cat === category
  ) || null;
}

/**
 * Generates the next sequential ticket ID (e.g. FIX-1005).
 * Pure function.
 */
export function generateNextId(complaints) {
  let highest = 1000;
  if (Array.isArray(complaints)) {
    complaints.forEach(item => {
      if (item.id && item.id.startsWith("FIX-")) {
        const num = parseInt(item.id.replace("FIX-", ""), 10);
        if (!isNaN(num) && num > highest) {
          highest = num;
        }
      }
    });
  }
  return `FIX-${highest + 1}`;
}

/**
 * Formats Unix timestamp into a readable date string.
 */
export function formatDateTime(ts) {
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

/**
 * Returns human-readable relative time string (e.g. "2h ago").
 */
export function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
