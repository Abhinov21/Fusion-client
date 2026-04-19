/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  NumberInput,
  Paper,
  Title,
  Grid,
  Text,
  Divider,
  Group,
  FileInput,
  Alert,
} from "@mantine/core";
import { FileText, AlertCircle } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import classes from "../../styles/formStyle.module.css";
import { submitProjectRegisterCommencement } from "../../services/rspcApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import ConfirmationModal from "../../helpers/confirmationModal";
import { getISODateString } from "../../utils/formatDate";

/**
 * ProjectCommencementForm - Commence registered project
 * Sets project start date and initial funding
 */
function ProjectCommencementForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  // Initialize ALL hooks at top level - before any conditions
  const form = useForm({
    initialValues: {
      start_date: getISODateString(),
      initial_amount: 0,
    },
    validate: {
      initial_amount: (value) =>
        value > 0 ? null : "Initial funding amount must be greater than 0",
      start_date: (value) => (value ? null : "Project start date is required"),
    },
  });

  const submitFormDataFn = async (values) => {
    if (!projectData) return;
    const formData = new FormData();
    formData.append("pid", projectData.pid);
    formData.append("start_date", values.start_date);
    formData.append("initial_amount", values.initial_amount);
    formData.append("status", "OnGoing");
    if (file) {
      formData.append("registration_form", file);
    }
    await submitProjectRegisterCommencement(formData);
    setTimeout(() => {
      navigate("/research");
    }, 1500);
  };

  const { handleSubmit: submitFormWithHook, submitting } = useFormSubmit(
    form,
    submitFormDataFn,
  );

  // Check if project is in Registered status - after hooks
  if (
    !projectData ||
    !projectData.pi_id ||
    projectData.status !== "Registered"
  ) {
    return (
      <Paper padding="lg" shadow="s" className={classes.formContainer}>
        <Alert icon={<AlertCircle />} color="red" title="Invalid Project">
          This project cannot be commenced. Only registered projects can be
          commenced.
        </Alert>
        <Button onClick={() => navigate("/research")} mt="md">
          Back to Projects
        </Button>
      </Paper>
    );
  }

  const handleFormSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmationModalOpened(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmationModalOpened(false);
    try {
      await submitFormWithHook(form.values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
          <Title order={2} className={classes.formTitle}>
            Commence Project
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>Project Title</Text>
              <TextInput
                value={projectData.name || ""}
                readOnly
                styles={{
                  input: {
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>Project ID</Text>
              <TextInput
                value={projectData.pid || ""}
                readOnly
                styles={{
                  input: {
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>Project Investigator</Text>
              <TextInput
                value={projectData.pi_name || ""}
                readOnly
                styles={{
                  input: {
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Total Amount Sanctioned
              </Text>
              <TextInput
                value={`₹${projectData.sanctioned_amount || 0}`}
                readOnly
                styles={{
                  input: {
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                  },
                }}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Divider my="lg" label="" labelPosition="center" size="md" />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Start Date <span style={{ color: "red" }}>*</span>
              </Text>
              <input
                type="date"
                required
                {...form.getInputProps("start_date")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Initial Amount Received (in ₹){" "}
                <span style={{ color: "red" }}>*</span>
              </Text>
              <NumberInput
                placeholder="Enter initial funding amount"
                min={0}
                {...form.getInputProps("initial_amount")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text className={classes.fieldLabel}>
                Upload Registration Form (Optional)
              </Text>
              <FileInput
                placeholder="Choose registration form"
                icon={<FileText />}
                value={file}
                onChange={setFile}
                accept=".pdf,.doc,.docx"
              />
              {file && (
                <Text size="sm" color="gray">
                  Selected: {file.name}
                </Text>
              )}
            </Grid.Col>
          </Grid>

          <div className={classes.submitButtonContainer}>
            <Group grow>
              <Button
                size="lg"
                type="submit"
                color="cyan"
                style={{ borderRadius: "8px" }}
                loading={submitting}
                disabled={submitting}
              >
                Commence
              </Button>
              <Button
                size="lg"
                variant="light"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </Group>
          </div>
        </Paper>
      </form>

      <ConfirmationModal
        opened={confirmationModalOpened}
        onClose={() => setConfirmationModalOpened(false)}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}

ProjectCommencementForm.propTypes = {
  projectData: PropTypes.shape({
    name: PropTypes.string,
    pid: PropTypes.number.isRequired,
    pi_name: PropTypes.string,
    sanctioned_amount: PropTypes.number,
    status: PropTypes.string.isRequired,
    pi_id: PropTypes.string,
  }).isRequired,
};

export default ProjectCommencementForm;
