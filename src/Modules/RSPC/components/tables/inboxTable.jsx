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
  Badge,
  ScrollArea,
} from "@mantine/core";
import {
  ArrowBendDoubleUpRight,
  ArrowDown,
  ArrowsDownUp,
  ArrowUp,
  Eye,
  FileText,
} from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";
import StaffViewModal from "../modals/staffViewModal";
import { badgeColor } from "../../helpers/badgeColours";
import SelectionCommitteeReportApprovalModal from "../modals/selectionCommitteeReportApprovalModal";
import AdvertisementAndCommitteeApprovalModal from "../modals/advertisementAndCommitteeApprovalModal";
import { fetchPIDs, fetchStaff } from "../../services/rspcApi";
import useTableSort from "../../hooks/useTableSort";

function InboxTable({ setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);
  const [PIDs, setPIDs] = useState([]);
  const role = useSelector((state) => state.user.role);

  // Use table sorting hook instead of inline sorting logic
  const { sortedData, sortConfig, requestSort } = useTableSort();

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [reportApprovalModalOpened, setReportApprovalModalOpened] =
    useState(false);
  const [
    advertisementAndCommitteeApprovalModalOpened,
    setAdvertisementAndCommitteeApprovalModalOpened,
  ] = useState(false);

  // Fetch PIDs using service layer
  useEffect(() => {
    const loadPIDs = async () => {
      try {
        const response = await fetchPIDs(role);
        setPIDs(response);
      } catch (error) {
        console.error("Error fetching PIDs:", error);
      }
    };
    loadPIDs();
  }, [role]);

  const handleViewClick = (row) => {
    setSelectedStaff(row);
    setViewModalOpened(true);
  };

  const handleActionClick = (row) => {
    setSelectedStaff(row);
    if (!row.final_selection || row.final_selection.length === 0) {
      setAdvertisementAndCommitteeApprovalModalOpened(true);
    } else {
      setReportApprovalModalOpened(true);
    }
  };

  const [staffRequests, setStaffRequests] = useState([]);
  // Fetch staff data using service layer
  useEffect(() => {
    if (PIDs.length === 0) return;

    const loadStaffData = async () => {
      setLoading(true);
      try {
        const response = await fetchStaff({
          "pids[]": PIDs,
          role,
          type: 2,
        });
        const enrichedData = response.map((row) => ({
          ...row,
          approval_type:
            !row.final_selection || row.final_selection.length === 0
              ? "Advertisement"
              : "Committee Report",
        }));
        setStaffRequests(enrichedData);
        setFetched(true);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setFetched(false);
      } finally {
        setLoading(false);
      }
    };
    loadStaffData();
  }, [PIDs]);

  const displayedStaff = sortedData(staffRequests) || staffRequests;
  const staffRows = displayedStaff.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td className={classes["row-content"]}>
        <Badge
          color={badgeColor[row.approval]}
          size="lg"
          style={{ minWidth: "180px", color: "#3f3f3f" }}
        >
          {row.approval}
        </Badge>
      </Table.Td>
      <Table.Td className={classes["row-content"]}>{row.type}</Table.Td>
      <Table.Td className={classes["row-content"]}>
        {row.project_title}
      </Table.Td>
      <Table.Td className={classes["row-content"]}>{row.pid}</Table.Td>
      <Table.Td className={classes["row-content"]}>
        {row.approval_type}
      </Table.Td>
      <Table.Td className={classes["row-content"]}>
        <Button
          onClick={() => handleActionClick(row)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "8px" }}
        >
          {role.includes("HOD") ? (
            <>
              <ArrowBendDoubleUpRight
                size={26}
                style={{ marginRight: "3px" }}
              />
              Forward
            </>
          ) : (
            <>
              <FileText size={26} style={{ marginRight: "3px" }} />
              Approve
            </>
          )}
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
  ));

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
                onClick={() => requestSort("approval")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Status
                  {sortConfig.column === "approval" ? (
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
                  Staff Designation
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
                onClick={() => requestSort("project_title")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Project Title
                  {sortConfig.column === "project_title" ? (
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
                onClick={() => requestSort("pid")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Project ID
                  {sortConfig.column === "pid" ? (
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
                onClick={() => requestSort("approval_type")}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Approval Type
                  {sortConfig.column === "approval_type" ? (
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
                Action Centre
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
                    Failed to load personnel details
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
      <SelectionCommitteeReportApprovalModal
        opened={reportApprovalModalOpened}
        onClose={() => setReportApprovalModalOpened(false)}
        staffData={selectedStaff}
        setActiveTab={setActiveTab}
      />
      <AdvertisementAndCommitteeApprovalModal
        opened={advertisementAndCommitteeApprovalModalOpened}
        onClose={() => setAdvertisementAndCommitteeApprovalModalOpened(false)}
        staffData={selectedStaff}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

InboxTable.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

export default InboxTable;
