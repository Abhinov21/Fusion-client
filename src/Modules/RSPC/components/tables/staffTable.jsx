import PropTypes from "prop-types";
import cx from "clsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Container,
  Text,
  Loader,
  Button,
  ScrollArea,
} from "@mantine/core";
import {
  Eye,
  DownloadSimple,
  FileText,
  ArrowUp,
  ArrowDown,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";
import StaffViewModal from "../modals/staffViewModal";
import JoiningReportAndIDCardFormModal from "../modals/joiningReportAndIDCardFormModal";
import { host } from "../../../../routes/globalRoutes";
import { fetchStaff } from "../../services/rspcApi";
import useTableSort from "../../hooks/useTableSort";

function StaffTable({ projectData }) {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);
  const [staff, setStaff] = useState([]);
  const role = useSelector((state) => state.user.role);
  const [documentModalOpened, setDocumentModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Use table sorting hook instead of inline sorting logic
  const { sortedData, sortConfig, requestSort } = useTableSort();

  // Fetch staff data using service layer
  useEffect(() => {
    if (!projectData?.pid) return;

    const loadStaffData = async () => {
      setLoading(true);
      try {
        const response = await fetchStaff({
          "pids[]": [projectData.pid],
          type: 3,
        });
        setStaff(response);
        setFetched(true);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setFetched(false);
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, [projectData?.pid]);

  const handleViewClick = (row) => {
    setSelectedStaff(row);
    setViewModalOpened(true);
  };
  const handleActionClick = (row) => {
    setSelectedStaff(row);
    setDocumentModalOpened(true);
  };

  const displayedStaff = sortedData(staff) || staff;
  const staffRows = displayedStaff.map((row, index) => {
    const startDate = row.start_date ? new Date(row.start_date) : null;
    const endDate =
      startDate && row.duration > 0
        ? new Date(startDate.setMonth(startDate.getMonth() + row.duration))
        : null;
    const isOver = endDate && new Date() > endDate;
    return (
      <Table.Tr key={index} style={isOver && { backgroundColor: "#D3D3D3" }}>
        <Table.Td className={classes["row-content"]}>{row.person}</Table.Td>
        <Table.Td className={classes["row-content"]}>{row.type}</Table.Td>
        <Table.Td className={classes["row-content"]}>
          {row.start_date
            ? new Date(row.start_date).toLocaleDateString()
            : "---"}
        </Table.Td>
        <Table.Td className={classes["row-content"]}>
          {row.duration > 0 ? `${row.duration} months` : "---"}
        </Table.Td>
        <Table.Td className={classes["row-content"]}>
          {row.salary_per_month > 0 ? `₹${row.salary_per_month}` : "---"}
        </Table.Td>
        <Table.Td className={classes["row-content"]}>
          {role.includes("SectionHead_RSPC") ? (
            <Button
              onClick={() => handleActionClick(row)}
              variant="outline"
              color="#15ABFF"
              size="xs"
              disabled={projectData.status !== "OnGoing"}
              style={{ borderRadius: "8px" }}
            >
              <FileText size={26} style={{ marginRight: "3px" }} />
              Document Upload
            </Button>
          ) : (
            <Button
              variant="outline"
              color="#15ABFF"
              size="xs"
              style={{ borderRadius: "8px" }}
              component="a"
              href={
                row.joining_report ? `${host}/${row.joining_report}` : undefined
              } // Directly access the file URL
              target="_blank"
              rel="noopener noreferrer"
              disabled={!row.joining_report}
            >
              <DownloadSimple size={26} style={{ marginRight: "3px" }} />
              Open Report
            </Button>
          )}
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
              <Table.Th
                className={classes["header-cell"]}
                onClick={() => requestSort("person")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Name
                  {sortConfig.column === "person" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={16} style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDown size={16} style={{ marginLeft: "5px" }} />
                    )
                  ) : (
                    <ArrowsDownUp size={16} style={{ marginLeft: "5px" }} />
                  )}
                </div>
              </Table.Th>
              <Table.Th
                className={classes["header-cell"]}
                onClick={() => requestSort("type")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Designation
                  {sortConfig.column === "type" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={16} style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDown size={16} style={{ marginLeft: "5px" }} />
                    )
                  ) : (
                    <ArrowsDownUp size={16} style={{ marginLeft: "5px" }} />
                  )}
                </div>
              </Table.Th>
              <Table.Th
                className={classes["header-cell"]}
                onClick={() => requestSort("start_date")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Joining Date
                  {sortConfig.column === "start_date" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={16} style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDown size={16} style={{ marginLeft: "5px" }} />
                    )
                  ) : (
                    <ArrowsDownUp size={16} style={{ marginLeft: "5px" }} />
                  )}
                </div>
              </Table.Th>
              <Table.Th
                className={classes["header-cell"]}
                onClick={() => requestSort("duration")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Tenure
                  {sortConfig.column === "duration" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={16} style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDown size={16} style={{ marginLeft: "5px" }} />
                    )
                  ) : (
                    <ArrowsDownUp size={16} style={{ marginLeft: "5px" }} />
                  )}
                </div>
              </Table.Th>
              <Table.Th
                className={classes["header-cell"]}
                onClick={() => requestSort("salary_per_month")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Salary (per month)
                  {sortConfig.column === "salary_per_month" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={16} style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDown size={16} style={{ marginLeft: "5px" }} />
                    )
                  ) : (
                    <ArrowsDownUp size={16} style={{ marginLeft: "5px" }} />
                  )}
                </div>
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Joining Report
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>
                File Details
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan="6">
                  <Container py="xl">
                    <Loader size="lg" />
                  </Container>
                </Table.Td>
              </Table.Tr>
            ) : fetched ? (
              <> {staffRows} </>
            ) : (
              <Table.Tr>
                <Table.Td colSpan="6" align="center">
                  <Text color="red" align="center">
                    Failed to load staff details
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <StaffViewModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        staffData={selectedStaff}
      />
      <JoiningReportAndIDCardFormModal
        opened={documentModalOpened}
        onClose={() => setDocumentModalOpened(false)}
        staffData={selectedStaff}
      />
    </div>
  );
}

StaffTable.propTypes = {
  projectData: PropTypes.shape({
    pid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default StaffTable;
