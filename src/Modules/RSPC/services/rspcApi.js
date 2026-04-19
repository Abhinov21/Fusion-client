import axios from "axios";
import {
  fetchProjectsRoute,
  fetchPIDsRoute,
  fetchProfIDsRoute,
  fetchBudgetRoute,
  fetchStaffRoute,
  fetchStaffPositionsRoute,
  projectFormSubmissionRoute,
  projectRegisterCommencementRoute,
  projectClosureRoute,
  advertisementAndCommitteeApprovalFormSubmissionRoute,
  staffSelectionReportRoute,
  staffDocumentUploadRoute,
  staffDecisionRoute,
  committeeActionRoute,
} from "../../../routes/RSPCRoutes";

/**
 * Get authentication token from localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found!");
  }
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * GET /research_procedures/api/get-PIDs/
 * Fetch project IDs based on user role
 */
export const fetchPIDs = async (role) => {
  try {
    const response = await axios.get(fetchPIDsRoute(role), {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PIDs:", error);
    throw error;
  }
};

/**
 * GET /research_procedures/api/get-projects/
 * Fetch projects for given PIDs
 */
export const fetchProjects = async (pids) => {
  try {
    const response = await axios.get(fetchProjectsRoute, {
      params: { "pids[]": pids },
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * GET /research_procedures/api/get-profIDs/
 * Fetch professor IDs
 */
export const fetchProfessorIDs = async () => {
  try {
    const response = await axios.get(fetchProfIDsRoute, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data.profIDs;
  } catch (error) {
    console.error("Error fetching professor IDs:", error);
    throw error;
  }
};

/**
 * GET /research_procedures/api/get-budget/
 * Fetch budget for a project
 */
export const fetchBudget = async (pid) => {
  try {
    const response = await axios.get(fetchBudgetRoute(pid), {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
};

/**
 * GET /research_procedures/api/get-staff-positions/
 * Fetch staff positions available for a project
 */
export const fetchStaffPositions = async (pid) => {
  try {
    const response = await axios.get(fetchStaffPositionsRoute(pid), {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching staff positions:", error);
    throw error;
  }
};

/**
 * GET /research_procedures/api/get-staff/
 * Fetch staff records
 */
export const fetchStaff = async (params = {}) => {
  try {
    const response = await axios.get(fetchStaffRoute, {
      params,
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/add-project/
 * Submit new project addition form
 */
export const submitProjectAddition = async (formData) => {
  try {
    const response = await axios.post(projectFormSubmissionRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
        // Note: Don't set Content-Type header when sending FormData
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting project addition:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/register-commence-project/
 * Submit project register/commencement form
 */
export const submitProjectRegisterCommencement = async (formData) => {
  try {
    const response = await axios.post(
      projectRegisterCommencementRoute,
      formData,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting project register/commencement:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/project-closure/
 * Submit project closure form
 */
export const submitProjectClosure = async (formData) => {
  try {
    const response = await axios.post(projectClosureRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting project closure:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/add-ad-committee/
 * Submit advertisement and committee form
 */
export const submitAdvertisementAndCommittee = async (formData) => {
  try {
    const response = await axios.post(
      advertisementAndCommitteeApprovalFormSubmissionRoute,
      formData,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting advertisement and committee:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/staff-selection-report/
 * Submit staff selection report
 */
export const submitStaffSelectionReport = async (formData) => {
  try {
    const response = await axios.post(staffSelectionReportRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting staff selection report:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/staff-document-upload/
 * Upload staff documents (joining report and ID card)
 */
export const submitStaffDocumentUpload = async (formData) => {
  try {
    const response = await axios.post(staffDocumentUploadRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
        // Note: Don't set Content-Type header when sending FormData
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading staff documents:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/staff-decision/
 * Submit staff decision (approval/rejection)
 */
export const submitStaffDecision = async (formData) => {
  try {
    const response = await axios.post(staffDecisionRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting staff decision:", error);
    throw error;
  }
};

/**
 * POST /research_procedures/api/committee-action/
 * Submit committee action
 */
export const submitCommitteeAction = async (formData) => {
  try {
    const response = await axios.post(committeeActionRoute, formData, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting committee action:", error);
    throw error;
  }
};
