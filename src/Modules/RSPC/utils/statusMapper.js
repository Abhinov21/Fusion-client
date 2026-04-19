/**
 * Map backend status to display status with color
 * Status mapping for projects and requests
 */
export const statusMapper = {
  // Project statuses
  OnGoing: {
    display: "Ongoing",
    color: "#15abff",
    badge: "blue",
  },
  Completed: {
    display: "Completed",
    color: "#B8E986",
    badge: "green",
  },
  Submitted: {
    display: "Submitted",
    color: "#B2EBF2",
    badge: "cyan",
  },
  Registered: {
    display: "Registered",
    color: "#50E3C2",
    badge: "teal",
  },
  Terminated: {
    display: "Terminated",
    color: "#FF6B6B",
    badge: "red",
  },

  // Request statuses
  Hiring: {
    display: "Hiring",
    color: "#15abff",
    badge: "blue",
  },
  "RSPC Approval": {
    display: "RSPC Approval",
    color: "#50E3C2",
    badge: "teal",
  },
  "Committee Approval": {
    display: "Committee Approval",
    color: "#50E3C2",
    badge: "teal",
  },
  "HoD Forward": {
    display: "HoD Forward",
    color: "#50E3C2",
    badge: "teal",
  },
  Approved: {
    display: "Approved",
    color: "#B8E986",
    badge: "green",
  },
  Pending: {
    display: "Pending",
    color: "#B2EBF2",
    badge: "cyan",
  },
  Rejected: {
    display: "Rejected",
    color: "#FF6B6B",
    badge: "red",
  },
};

/**
 * Get status display info
 * @param {string} status - Backend status string
 * @returns {Object} { display, color, badge }
 */
export const getStatusInfo = (status) => {
  return (
    statusMapper[status] || {
      display: status,
      color: "#999999",
      badge: "gray",
    }
  );
};

/**
 * Get status color
 * @param {string} status - Backend status string
 * @returns {string} Color hex code
 */
export const getStatusColor = (status) => {
  return getStatusInfo(status).color;
};

/**
 * Get status badge type
 * @param {string} status - Backend status string
 * @returns {string} Badge type for Mantine Badge component
 */
export const getStatusBadgeType = (status) => {
  return getStatusInfo(status).badge;
};
