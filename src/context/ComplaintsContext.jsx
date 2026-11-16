import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getSeedComplaints } from '../data/campusData';
import {
  calculatePriority,
  getRoutedDepartment,
  findOpenDuplicate,
  generateNextId
} from '../utils/logic';

const ComplaintsContext = createContext(null);

const STORAGE_KEY = 'fixit_cec_db_v2';
const ADMIN_PIN = '1234';

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useLocalStorage(STORAGE_KEY, getSeedComplaints);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Adds a new complaint, or merges into an existing open ticket as a "me-too" upvote.
   */
  const addComplaint = ({ who, cat, blk, room, desc, photo = null }) => {
    // 1. Check for open duplicate
    const existing = findOpenDuplicate(complaints, blk, room, cat);

    if (existing) {
      const updatedComplaints = complaints.map(c => {
        if (c.id === existing.id) {
          const newVotes = (c.votes || 1) + 1;
          return {
            ...c,
            votes: newVotes,
            log: [
              ...c.log,
              {
                s: `Me-too vote added by ${who} (Total upvotes: ${newVotes})`,
                t: Date.now()
              }
            ]
          };
        }
        return c;
      });

      setComplaints(updatedComplaints);
      const updatedItem = updatedComplaints.find(c => c.id === existing.id);
      return { isDuplicate: true, complaint: updatedItem };
    }

    // 2. Create fresh complaint
    const newId = generateNextId(complaints);
    const priority = calculatePriority(desc, cat);
    const dept = getRoutedDepartment(cat);
    const now = Date.now();

    const newComplaint = {
      id: newId,
      who,
      cat,
      blk,
      room,
      desc,
      created: now,
      status: 'Assigned', // Auto-routed on creation
      votes: 1,
      priority,
      dept,
      photo,
      log: [
        { s: 'Complaint Reported via FixIt Portal', t: now },
        { s: `Auto-Assigned to ${dept}`, t: now + 500 }
      ]
    };

    setComplaints([newComplaint, ...complaints]);
    return { isDuplicate: false, complaint: newComplaint };
  };

  /**
   * Updates complaint status and logs the administrative transition.
   */
  const updateStatus = (id, newStatus) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            log: [
              ...c.log,
              {
                s: `Status changed to ${newStatus} by Facility Admin`,
                t: Date.now()
              }
            ]
          };
        }
        return c;
      })
    );
  };

  /**
   * Resets data to fresh demo seed.
   */
  const resetDemo = () => {
    setComplaints(getSeedComplaints());
  };

  /**
   * Admin authentication using demo PIN 1234.
   */
  const login = (pin) => {
    if (String(pin).trim() === ADMIN_PIN) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  // Live computed statistics
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status !== 'Resolved').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highOpen: complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        updateStatus,
        resetDemo,
        isAdmin,
        login,
        logout,
        stats
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
}
