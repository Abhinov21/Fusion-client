/**
 * Format date string to readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {string} format - Format pattern (default: "MM/DD/YYYY")
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = "MM/DD/YYYY") => {
  if (!dateString) return "---";

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "---";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    switch (format) {
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "MMM DD, YYYY":
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      default: // MM/DD/YYYY
        return `${month}/${day}/${year}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "---";
  }
};

/**
 * Get ISO date string (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
export const getISODateString = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string
 * @returns {Date} Date object
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};
