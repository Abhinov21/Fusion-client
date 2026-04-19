/**
 * Mock API Service for testing refactored RSPC components
 * Simulates backend API responses until full backend is implemented
 */

// Mock data
const mockProjects = [
  {
    id: 1,
    title: "AI Research Project",
    PI: "Dr. Smith",
    status: "Active",
    budget: 500000,
    startDate: "2024-01-01",
    endDate: "2026-12-31",
  },
  {
    id: 2,
    title: "Machine Learning Studies",
    PI: "Dr. Johnson",
    status: "Active",
    budget: 300000,
    startDate: "2024-03-15",
    endDate: "2025-12-31",
  },
];

const mockStaff = [
  {
    id: 1,
    name: "John Doe",
    department: "Computer Science",
    position: "Research Assistant",
    tenure: 2,
    salary: 50000,
    documents: ["doc1.pdf", "doc2.pdf"],
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "Electronics",
    position: "Research Associate",
    tenure: 3,
    salary: 65000,
    documents: ["doc3.pdf"],
  },
  {
    id: 3,
    name: "Bob Wilson",
    department: "Mechanical Engineering",
    position: "Junior Researcher",
    tenure: 1,
    salary: 40000,
    documents: [],
  },
];

const mockApprovals = [
  {
    id: 1,
    project: "AI Research Project",
    staff: "John Doe",
    status: "Pending",
    approval_type: "SelectionCommittee",
    date: "2024-04-01",
  },
  {
    id: 2,
    project: "Machine Learning Studies",
    staff: "Jane Smith",
    status: "Approved",
    approval_type: "Advertisement",
    date: "2024-04-02",
  },
  {
    id: 3,
    project: "AI Research Project",
    staff: "Bob Wilson",
    status: "Rejected",
    approval_type: "SelectionCommittee",
    date: "2024-04-03",
  },
];

const mockPositions = [
  {
    id: 1,
    project_id: 1,
    title: "Senior Researcher",
    level: "Experienced",
    quantity: 2,
  },
  {
    id: 2,
    project_id: 1,
    title: "Research Assistant",
    level: "Junior",
    quantity: 3,
  },
  {
    id: 3,
    project_id: 2,
    title: "Data Scientist",
    level: "Experienced",
    quantity: 1,
  },
];

// Mock API functions
export const mockFetchPIDs = async (role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [1, 2],
        message: "Project IDs fetched successfully",
      });
    }, 300);
  });
};

export const mockFetchProjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockProjects,
        message: "Projects fetched successfully",
      });
    }, 500);
  });
};

export const mockFetchStaff = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockStaff,
        message: "Staff data fetched successfully",
      });
    }, 500);
  });
};

export const mockFetchStaffPositions = async (pid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const positions = mockPositions.filter((p) => p.project_id === pid);
      resolve({
        success: true,
        data: positions,
        message: "Staff positions fetched successfully",
      });
    }, 400);
  });
};

export const mockFetchApprovals = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockApprovals,
        message: "Approvals fetched successfully",
      });
    }, 500);
  });
};

export const mockSubmitForm = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { id: Date.now(), ...formData },
        message: "Form submitted successfully",
      });
    }, 1000);
  });
};
