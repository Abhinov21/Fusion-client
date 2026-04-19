import { useState, useCallback } from "react";

/**
 * Custom hook to manage table sorting
 * Replaces duplicated sorting logic (~30 lines)
 *
 * Features:
 * - Column sorting
 * - Ascending/descending toggle
 * - Generic comparator
 *
 * @returns {Object} { sortedData, sortConfig, requestSort }
 */
function useTableSort(data = []) {
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: "asc",
  });

  // Generic comparator function
  const compare = (aValue, bValue, direction) => {
    // Handle null/undefined values
    if (aValue === null || aValue === undefined)
      return direction === "asc" ? 1 : -1;
    if (bValue === null || bValue === undefined)
      return direction === "asc" ? -1 : 1;

    // Convert to lowercase for string comparison
    const aCompare = typeof aValue === "string" ? aValue.toLowerCase() : aValue;
    const bCompare = typeof bValue === "string" ? bValue.toLowerCase() : bValue;

    // Compare values
    if (aCompare < bCompare) return direction === "asc" ? -1 : 1;
    if (aCompare > bCompare) return direction === "asc" ? 1 : -1;
    return 0;
  };

  // Request sort handler
  const requestSort = useCallback(
    (column) => {
      let direction = "asc";
      if (sortConfig.column === column && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ column, direction });
    },
    [sortConfig],
  );

  // Sorted data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.column) return 0;
    return compare(
      a[sortConfig.column],
      b[sortConfig.column],
      sortConfig.direction,
    );
  });

  return {
    sortedData,
    sortConfig,
    requestSort,
  };
}

export default useTableSort;
