/**
 * Role-based utility functions for RSPC module
 * Maps roles to permissions and data access patterns
 */

/**
 * Check if user is a professor
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const isProfessor = (role) => {
  if (!role) return false;
  const roleStr = Array.isArray(role) ? role.join(",") : role;
  return roleStr.toLowerCase().includes("professor");
};

/**
 * Check if user is HOD
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const isHOD = (role) => {
  if (!role) return false;
  const roleStr = Array.isArray(role) ? role.join(",") : role;
  return roleStr.toLowerCase().includes("hod");
};

/**
 * Check if user is RSPC Section Head
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const isRSPCHead = (role) => {
  if (!role) return false;
  const roleStr = Array.isArray(role) ? role.join(",") : role;
  return roleStr.toLowerCase().includes("sectionhead_rspc");
};

/**
 * Check if user is staff member
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const isStaff = (role) => {
  if (!role) return false;
  const roleStr = Array.isArray(role) ? role.join(",") : role;
  return roleStr.toLowerCase().includes("staff");
};

/**
 * Check if user can create projects (typically Professor)
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const canCreateProject = (role) => {
  return isProfessor(role);
};

/**
 * Check if user can approve projects
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const canApproveProject = (role) => {
  return isHOD(role) || isRSPCHead(role);
};

/**
 * Check if user can manage staff
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const canManageStaff = (role) => {
  return isProfessor(role) || isRSPCHead(role);
};

/**
 * Check if user has admin role (HOD or RSPC Head)
 * @param {string|array} role - User role(s)
 * @returns {boolean}
 */
export const isAdmin = (role) => {
  return isHOD(role) || isRSPCHead(role);
};

/**
 * Get user role type
 * @param {string|array} role - User role(s)
 * @returns {string} Role type: 'professor', 'hod', 'rspc_head', 'staff', or 'other'
 */
export const getRoleType = (role) => {
  if (isProfessor(role)) return "professor";
  if (isHOD(role)) return "hod";
  if (isRSPCHead(role)) return "rspc_head";
  if (isStaff(role)) return "staff";
  return "other";
};

/**
 * Get user display role
 * @param {string|array} role - User role(s)
 * @returns {string} Display name for the role
 */
export const getDisplayRole = (role) => {
  if (isProfessor(role)) return "Professor";
  if (isRSPCHead(role)) return "Section Head - RSPC";
  if (isHOD(role)) return "Head of Department";
  if (isStaff(role)) return "Staff";
  return "User";
};
