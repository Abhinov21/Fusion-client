import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
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
import { submitProjectClosure } from "../../services/rspcApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import ConfirmationModal from "../../helpers/confirmationModal";

/**
 * ProjectClosureForm - Close ongoing project with final report
 * Handles final utilization certificate and project closure
 */
function ProjectClosureForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  // Initialize ALL hooks at top level - before any conditions
  const form = useForm({
    initialValues: {},
    validate: {},
  });

  const submitFormDataFn = async () => {
    if (!projectData) return;
    const formData = new FormData();
    formData.append("pid", projectData.pid);
    if (file) {
      formData.append("end_report", file);
    }
    await submitProjectClosure(formData);
    setTimeout(() => {
      navigate("/research");
    }, 1500);
  };

  const { handleSubmit: submitFormWithHook, submitting } = useFormSubmit(
    form,
    submitFormDataFn,
  );

  // Check if project is in OnGoing status - after hooks
  if (!projectData || !projectData.pi_id || projectData.status !== "OnGoing") {
    return (
      <Paper padding="lg" shadow="s" className={classes.formContainer}>
        <Alert icon={<AlertCircle />} color="red" title="Invalid Project">
          This project cannot be closed. Only ongoing projects can be closed.
        </Alert>
        <Button onClick={() => navigate("/research")} mt="md">
          Back to Projects
        </Button>
      </Paper>
    );
  }

  const handleFormSubmit = () => {
    setConfirmationModalOpened(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmationModalOpened(false);
    try {
      await submitFormWithHook({});
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
          <Title order={2} className={classes.formTitle}>
            Final Utilization Certificate & Statement of Expenditure and Closure
            of Project
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

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>Project Start Date</Text>
              <TextInput
                value={projectData.start_date || "N/A"}
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
                Amount Released Till Date
              </Text>
              <TextInput
                value={`₹${projectData.initial_amount || 0}`}
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

            <Grid.Col span={12}>
              <Text className={classes.fieldLabel}>
                Upload Final Report & Utilization Certificate (Optional)
              </Text>
              <FileInput
                placeholder="Choose final report and utilization certificate"
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
              <Text size="xs" color="gray" mt="xs">
                Upload the final utilization certificate and statement of
                expenditure to close this project.
              </Text>
            </Grid.Col>
          </Grid>

          <div className={classes.submitButtonContainer}>
            <Group grow>
              <Button
                size="lg"
                type="submit"
                color="red"
                style={{ borderRadius: "8px" }}
                loading={submitting}
                disabled={submitting}
              >
                Close Project
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
        title="Close Project"
        message="Are you sure you want to close this project? This action cannot be undone."
      />
    </>
  );
}

ProjectClosureForm.propTypes = {
  projectData: PropTypes.shape({
    name: PropTypes.string,
    pid: PropTypes.number.isRequired,
    pi_name: PropTypes.string,
    sanctioned_amount: PropTypes.number,
    start_date: PropTypes.string,
    initial_amount: PropTypes.number,
    status: PropTypes.string.isRequired,
    pi_id: PropTypes.string,
  }).isRequired,
};

export default ProjectClosureForm;
