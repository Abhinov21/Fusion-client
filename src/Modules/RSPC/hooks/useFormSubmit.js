import { useState } from "react";
import { notifications } from "@mantine/notifications";

/**
 * Custom hook to abstract form submission logic
 * Handles: loading state, success notification, error notification, reset logic
 *
 * @param {Object} form - Mantine useForm hook instance
 * @param {Function} submitFn - API submission function (should return a Promise)
 * @returns {Object} { handleSubmit, submitting, error }
 */
function useFormSubmit(form, submitFn) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitFn(values);

      // Show success notification
      notifications.show({
        title: "Success",
        message: "Form submitted successfully!",
        color: "green",
        autoClose: 3000,
      });

      // Reset form after successful submission
      form.reset();

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An error occurred while submitting the form";

      setError(errorMessage);

      // Show error notification
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });

      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    submitting,
    error,
  };
}

export default useFormSubmit;
