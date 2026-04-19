import PropTypes from "prop-types";
import { Button, Group } from "@mantine/core";
import { Eye, CursorText, Trash } from "@phosphor-icons/react";

/**
 * Reusable ActionButtons component
 * Provides consistent action buttons (view, edit, delete)
 *
 * @param {Object} props
 * @param {Function} props.onView - View button click handler
 * @param {Function} props.onEdit - Edit button click handler
 * @param {Function} props.onDelete - Delete button click handler
 * @param {boolean} props.hideView - Hide view button
 * @param {boolean} props.hideEdit - Hide edit button
 * @param {boolean} props.hideDelete - Hide delete button
 * @param {boolean} props.loading - Disable buttons while loading
 * @param {string} props.size - Button size
 * @returns {JSX.Element}
 */
function ActionButtons({
  onView,
  onEdit,
  onDelete,
  hideView = false,
  hideEdit = false,
  hideDelete = false,
  loading = false,
  size = "sm",
}) {
  return (
    <Group gap="xs">
      {!hideView && (
        <Button
          size={size}
          variant="light"
          color="blue"
          leftSection={<Eye size={16} />}
          onClick={onView}
          disabled={loading}
        >
          View
        </Button>
      )}
      {!hideEdit && (
        <Button
          size={size}
          variant="light"
          color="grape"
          leftSection={<CursorText size={16} />}
          onClick={onEdit}
          disabled={loading}
        >
          Edit
        </Button>
      )}
      {!hideDelete && (
        <Button
          size={size}
          variant="light"
          color="red"
          leftSection={<Trash size={16} />}
          onClick={onDelete}
          disabled={loading}
        >
          Delete
        </Button>
      )}
    </Group>
  );
}

ActionButtons.propTypes = {
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  hideView: PropTypes.bool,
  hideEdit: PropTypes.bool,
  hideDelete: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.string,
};

export default ActionButtons;
