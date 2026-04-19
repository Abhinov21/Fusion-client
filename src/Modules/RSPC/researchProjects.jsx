import {
  SortAscending,
  CaretCircleLeft,
  CaretCircleRight,
} from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import { Tabs, Button, Flex, Select, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import classes from "./styles/researchProjectsStyle.module.css";
import ProjectTable from "./components/tables/projectTable.jsx";
import ProjectAdditionForm from "./components/forms/ProjectAdditionForm.jsx";
import InboxTable from "./components/tables/inboxTable.jsx";
import Appendix from "./components/forms/appendix.jsx";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs.jsx";
import FilterTable from "./components/tables/filterTable.jsx";
import useProjectData from "./hooks/useProjectData.js";
import { isProfessor, isHOD } from "./utils/roleMapper.js";

const categories = ["Most Recent", "Ongoing", "Completed", "Terminated"];

/**
 * ResearchProjects - Main page for research project management
 * Displays projects, inbox, forms based on user role
 * Uses useProjectData hook for data fetching
 */
function ResearchProjects() {
  const role = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState("0");
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const tabsListRef = useRef(null);

  // Use custom hook for project data
  const { projects, pids, loading, error, refreshData } = useProjectData(role);

  // Refresh data when role changes
  useEffect(() => {
    if (role) {
      refreshData();
    }
  }, [role]);

  const tabItems = [
    {
      title: "Projects",
      component: (
        <ProjectTable setActiveTab={setActiveTab} projectsData={projects} />
      ),
    },
    {
      title: "Inbox And Approvals",
      component: <InboxTable setActiveTab={setActiveTab} />,
    },
  ];

  // Add role-based tabs
  if (isProfessor(role)) {
    tabItems.push({
      title: "New Project Proposal",
      component: <ProjectAdditionForm setActiveTab={setActiveTab} />,
    });
  } else if (!isHOD(role)) {
    tabItems.push({
      title: "Data Filter",
      component: <FilterTable />,
    });
  }

  tabItems.push({
    title: "Form Appendix",
    component: <Appendix />,
  });

  const handleScroll = (direction) => {
    const container = tabsListRef.current;
    if (container) {
      const scrollAmount = 200;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  if (error) {
    return (
      <div className={classes.pageContainer}>
        <div style={{ padding: "20px", color: "red" }}>
          <Text>Error loading projects: {error}</Text>
          <Button onClick={refreshData} mt="md">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.pageContainer}>
      <RSPCBreadcrumbs />

      <div className={classes.headerSection}>
        <Flex justify="space-between" align="center">
          <Flex gap="md" align="center">
            <Select
              placeholder="Sort by"
              data={categories}
              value={sortedBy}
              onChange={(value) => setSortedBy(value)}
              style={{ width: "150px" }}
              checkIconPosition="right"
            />
            <Button
              onClick={refreshData}
              variant="light"
              loading={loading}
              disabled={loading}
            >
              Refresh
            </Button>
          </Flex>

          <Flex gap="xs">
            <Button
              onClick={() => handleScroll("left")}
              variant="light"
              size="sm"
              p="xs"
            >
              <CaretCircleLeft size={20} />
            </Button>
            <Button
              onClick={() => handleScroll("right")}
              variant="light"
              size="sm"
              p="xs"
            >
              <CaretCircleRight size={20} />
            </Button>
          </Flex>
        </Flex>
      </div>

      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        defaultValue="0"
        orientation="horizontal"
        tabPadding="md"
      >
        <Tabs.List ref={tabsListRef} style={{ overflowX: "auto" }}>
          {tabItems.map((item, index) => (
            <Tabs.Tab
              key={index}
              value={String(index)}
              leftSection={<SortAscending size={14} />}
            >
              {item.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabItems.map((item, index) => (
          <Tabs.Panel key={index} value={String(index)}>
            {item.component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}

export default ResearchProjects;
