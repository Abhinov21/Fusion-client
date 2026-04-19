import { useState, useEffect, useCallback } from "react";
import { fetchPIDs, fetchProjects } from "../services/rspcApi";

/**
 * Custom hook to manage project data fetching and state
 * Handles: fetching PIDs, fetching projects, loading state, error state, role-based filtering
 *
 * @param {string} role - User role for filtering projects
 * @returns {Object} { projects, pids, loading, error, refreshData }
 */
function useProjectData(role) {
  const [projects, setProjects] = useState([]);
  const [pids, setPIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch PIDs
  useEffect(() => {
    const loadPIDs = async () => {
      if (!role) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPIDs(role);
        setPIDs(data);
      } catch (err) {
        setError(err.message || "Failed to fetch PIDs");
        console.error("Error fetching PIDs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPIDs();
  }, [role]);

  // Fetch projects when PIDs are available
  useEffect(() => {
    const loadProjects = async () => {
      if (!Array.isArray(pids) || pids.length === 0) {
        setProjects([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchProjects(pids);
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to fetch projects");
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pids]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    setError(null);
    try {
      const newPIDs = await fetchPIDs(role);
      setPIDs(newPIDs);
      const newProjects = await fetchProjects(newPIDs);
      setProjects(Array.isArray(newProjects) ? newProjects : []);
    } catch (err) {
      setError(err.message || "Failed to refresh data");
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  return {
    projects,
    pids,
    loading,
    error,
    refreshData,
  };
}

export default useProjectData;
