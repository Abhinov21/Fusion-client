/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Radio,
  NumberInput,
  Paper,
  Title,
  Grid,
  Text,
  Divider,
  Group,
  FileInput,
} from "@mantine/core";
import { FileText } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import classes from "../../styles/formStyle.module.css";
import { submitProjectRegisterCommencement } from "../../services/rspcApi";
import useFormSubmit from "../../hooks/useFormSubmit";
import ConfirmationModal from "../../helpers/confirmationModal";
import { getISODateString } from "../../utils/formatDate";

/**
 * ProjectRegisterForm - Register and commence approved project
 * Handles budget and sanction details
 */
function ProjectRegisterForm({ projectData }) {
  const [file, setFile] = useState(null);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: projectData.name || "",
      type: projectData.type || "",
      access: projectData.access || "",
      sponsored_agency: projectData.sponsored_agency || "",
      sanctioned_amount: 0,
      sanction_date: getISODateString(),
    },
    validate: {
      sanctioned_amount: (value) =>
        value > 0 ? null : "Total sanctioned amount must be greater than 0",
      name: (value) => (value ? null : "Project title is required"),
      access: (value) =>
        value ? null : "Project access specifier is required",
      type: (value) => (value ? null : "Project type is required"),
      sponsored_agency: (value) =>
        value ? null : "Project sponsor agency is required",
    },
  });

  const submitFormData = async (values) => {
    const formData = new FormData();
    formData.append("pid", projectData.pid);
    formData.append("name", values.name);
    formData.append("access", values.access);
    formData.append("type", values.type);
    formData.append("sponsored_agency", values.sponsored_agency);
    formData.append("sanction_date", values.sanction_date);
    formData.append("sanctioned_amount", values.sanctioned_amount);
    formData.append("status", "Registered");
    if (file) {
      formData.append("file", file);
    }

    await submitProjectRegisterCommencement(formData);

    // Navigate after delay
    setTimeout(() => {
      navigate("/research");
    }, 1500);
  };

  const { handleSubmit: submitFormWithHook, submitting } = useFormSubmit(
    form,
    submitFormData,
  );

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
            Register Project Commencement
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Title <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Enter project title"
                {...form.getInputProps("name")}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Type <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Project type"
                {...form.getInputProps("type")}
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Access <span style={{ color: "red" }}>*</span>
              </Text>
              <Radio.Group {...form.getInputProps("access")}>
                <Radio value="Co" label="Only PI" />
                <Radio value="noCo" label="Either PI or Co-PI(s)" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Project Sponsor Agency <span style={{ color: "red" }}>*</span>
              </Text>
              <TextInput
                placeholder="Sponsor agency"
                {...form.getInputProps("sponsored_agency")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Divider my="lg" label="" labelPosition="center" size="md" />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Sanction Date <span style={{ color: "red" }}>*</span>
              </Text>
              <input
                type="date"
                required
                {...form.getInputProps("sanction_date")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text className={classes.fieldLabel}>
                Sanctioned Amount (in ₹) <span style={{ color: "red" }}>*</span>
              </Text>
              <NumberInput
                placeholder="Enter sanctioned amount"
                min={0}
                {...form.getInputProps("sanctioned_amount")}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text className={classes.fieldLabel}>
                Upload Sanction Letter (Optional)
              </Text>
              <FileInput
                placeholder="Choose sanction letter file"
                icon={<FileText />}
                value={file}
                onChange={setFile}
                accept=".pdf,.doc,.docx,.jpg,.png"
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
                Submit
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

ProjectRegisterForm.propTypes = {
  projectData: PropTypes.shape({
    name: PropTypes.string,
    pid: PropTypes.number.isRequired,
    type: PropTypes.string,
    access: PropTypes.string,
    sponsored_agency: PropTypes.string,
  }).isRequired,
};

export default ProjectRegisterForm;
