import PropTypes from "prop-types";
import { Badge } from "@mantine/core";
import { getStatusInfo } from "../../utils/statusMapper";

/**
 * Reusable StatusBadge component
 * Maps backend status to color and displays as Mantine Badge
 *
 * @param {string} status - Backend status string
 * @param {string} size - Badge size (xs, sm, md, lg, xl)
 * @param {object} style - Additional inline styles
 * @returns {JSX.Element}
 */
function StatusBadge({ status, size = "lg", style = {} }) {
  const statusInfo = getStatusInfo(status);

  return (
    <Badge
      color={statusInfo.badge}
      size={size}
      style={{
        minWidth: "110px",
        color: "#3f3f3f",
        ...style,
      }}
    >
      {statusInfo.display}
    </Badge>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  style: PropTypes.object,
};

export default StatusBadge;
