import PropTypes from "prop-types";
import cx from "clsx";
import { Table, Group, Text, ThemeIcon } from "@mantine/core";
import { ArrowUp, ArrowDown, ArrowsDownUp } from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";

/**
 * Reusable TableHeader component
 * Displays sortable table header with sort indicators
 *
 * @param {Object} props
 * @param {string} props.label - Column header label
 * @param {string} props.columnKey - Column data key
 * @param {Function} props.onSort - Sort handler
 * @param {Object} props.sortConfig - Current sort config { column, direction }
 * @param {boolean} props.sortable - Is column sortable (default: true)
 * @returns {JSX.Element}
 */
function TableHeader({
  label,
  columnKey,
  onSort,
  sortConfig,
  sortable = true,
}) {
  const isSorted = sortConfig?.column === columnKey;
  const isAsc = sortConfig?.direction === "asc";

  const getSortIcon = () => {
    if (!isSorted) return <ArrowsDownUp size={16} />;
    return isAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  if (!sortable) {
    return (
      <Table.Th className={classes["table-header"]}>
        <Text fw={600}>{label}</Text>
      </Table.Th>
    );
  }

  return (
    <Table.Th
      className={cx(classes["table-header"], {
        [classes.sorted]: isSorted,
      })}
      onClick={() => onSort(columnKey)}
      style={{ cursor: "pointer" }}
    >
      <Group gap={8} wrap="nowrap">
        <Text fw={600}>{label}</Text>
        <ThemeIcon size="xs" radius="xl" variant="light">
          {getSortIcon()}
        </ThemeIcon>
      </Group>
    </Table.Th>
  );
}

TableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  sortable: PropTypes.bool,
};

export default TableHeader;
