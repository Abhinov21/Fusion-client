/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, ScrollArea } from "@mantine/core";
import { Eye, FileText } from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";
import ProjectViewModal from "../modals/projectViewModal";
import useTableSort from "../../hooks/useTableSort";
import TableHeader from "../ui/TableHeader";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { isProfessor, isRSPCHead } from "../../utils/roleMapper";

/**
 * ProjectTable - Display list of research projects with sorting and filtering
 * Uses useTableSort hook for generic sorting logic
 * No API calls - data provided via props
 */
function ProjectTable({ setActiveTab, projectsData }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  // Use custom hook for sorting
  const { sortedData, sortConfig, requestSort } = useTableSort(projectsData);

  const handleProjectActionClick = (row) => {
    let tabIndex = "1";
    if (isProfessor(role) || isRSPCHead(role)) {
      tabIndex =
        row.status === "OnGoing" ? "1" : row.status === "Completed" ? "2" : "0";
    }
    navigate("/research/forms", {
      state: { data: row, initialTab: tabIndex },
    });
  };

  const handleViewClick = (row) => {
    setSelectedProject(row);
    setViewModalOpened(true);
  };

  // Determine action button text and availability
  const getActionButtonProps = (row) => {
    if (isProfessor(role)) {
      return {
        label:
          row.status === "Submitted"
            ? "Register"
            : row.status === "OnGoing"
              ? "Forms"
              : "Details",
        disabled: row.status === "Registered",
      };
    }

    if (isRSPCHead(role)) {
      return {
        label:
          row.status === "Registered"
            ? "Commence"
            : row.status === "OnGoing"
              ? "Forms"
              : "Details",
        disabled: row.status === "Submitted",
      };
    }

    return {
      label: "Details",
      disabled: row.status !== "OnGoing" && row.status !== "Completed",
    };
  };

  const rows = sortedData.map((row, index) => {
    const actionProps = getActionButtonProps(row);

    return (
      <Table.Tr key={index}>
        <Table.Td className={classes["row-content"]}>
          <StatusBadge status={row.status} />
        </Table.Td>
        <Table.Td className={classes["row-content"]}>{row.name}</Table.Td>
        <Table.Td className={classes["row-content"]}>{row.pid}</Table.Td>
        <Table.Td className={classes["row-content"]}>
          {row.sponsored_agency}
        </Table.Td>
        <Table.Td className={classes["row-content"]}>
          {formatDate(row.sanction_date)}
        </Table.Td>
        <Table.Td className={classes["row-content"]}>
          <Button
            onClick={() => handleProjectActionClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            style={{ borderRadius: "8px", minWidth: "105px" }}
            disabled={actionProps.disabled}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            {actionProps.label}
          </Button>
        </Table.Td>

        <Table.Td className={classes["row-content"]}>
          <Button
            onClick={() => handleViewClick(row)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            style={{ borderRadius: "8px" }}
          >
            <Eye size={26} style={{ margin: "3px" }} />
            View
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div style={{ padding: "3% 5%" }}>
      <ScrollArea
        h={350}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <TableHeader
                label="Status"
                columnKey="status"
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              <TableHeader
                label="Project Name"
                columnKey="name"
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              <TableHeader
                label="Project ID"
                columnKey="pid"
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              <TableHeader
                label="Sponsor Agency"
                columnKey="sponsored_agency"
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              <TableHeader
                label="Sanction Date"
                columnKey="sanction_date"
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              <Table.Th className={classes["header-cell"]}>Action</Table.Th>
              <Table.Th className={classes["header-cell"]}>View</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      <ProjectViewModal
        project={selectedProject}
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
      />
    </div>
  );
}

ProjectTable.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  projectsData: PropTypes.arrayOf(
    PropTypes.shape({
      pid: PropTypes.number.isRequired,
      name: PropTypes.string,
      status: PropTypes.string,
      sponsored_agency: PropTypes.string,
      sanction_date: PropTypes.string,
    }),
  ).isRequired,
};

export default ProjectTable;
