import { useForm } from 'react-hook-form';
import logging from "../../../utils/logging";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import { showSnackbar } from "../../../utils/snackbarHelper";
import MonitorService from '../../../services/MonitorService';
import { useStoreActions, useStoreState } from '../../../hooks';
import { IMonitorGroupListByUser } from '../../../interfaces/IMonitorGroupListByUser';
import { Box, Typography, Card, CardContent, FormControl, TextField, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

interface IFromMonitorGroupProps {
  setAddMonitorPanel: (val: boolean) => void;
  selectedMonitorGroup: IMonitorGroupListByUser | null;
  reloadData: () => void;
}

const FromMonitorGroup: React.FC<IFromMonitorGroupProps> = ({ setAddMonitorPanel, selectedMonitorGroup, reloadData }) => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const { selectedEnvironment } = useStoreState((state) => state.app);
  const { thunkGetMonitorGroupListByUser } = useStoreActions(
    (actions) => actions.monitor
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const watchName = watch("name");

  useEffect(() => {
    if (selectedMonitorGroup) {
      setValue("name", selectedMonitorGroup.name);
    } else {
      setValue("name", "");
    }
  }, [selectedMonitorGroup, setValue]);

  const handleDeleteBtn = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    if (selectedMonitorGroup !== null) {
      await MonitorService.deleteGroupMonitor(selectedMonitorGroup.id).then(
        async () => {
          await thunkGetMonitorGroupListByUser(selectedEnvironment);
          showSnackbar(t("monitorGroups.deleteConfirmation"), "success");
          reloadData();
          setOpenDeleteDialog(false);
          setAddMonitorPanel(false);
        }
      ).catch((err) => {
        logging.error(err);
        showSnackbar(t(err.response.data), "error");
      });
    }
  };

  const handleValidSubmit = async (data: any) => {
    setIsButtonDisabled(true);
    logging.info(data);
    if (selectedMonitorGroup) {
      data.id = selectedMonitorGroup.id;
      await MonitorService.editMonitorGroup(data).then(async () => {
        await thunkGetMonitorGroupListByUser(selectedEnvironment);
        reloadData();
        setIsButtonDisabled(false);
        setAddMonitorPanel(false);
        showSnackbar(t("monitorGroups.updateSuccess"), "success");
      });
    } else {
      await MonitorService.createMonitorGroup(data).then(async () => {
        await thunkGetMonitorGroupListByUser(selectedEnvironment);
        reloadData();
        setIsButtonDisabled(false);
        setAddMonitorPanel(false);
        showSnackbar(t("monitorGroups.createSuccess"), "success");
      });
    }
  };

  const handleCancelButton = () => {
    setAddMonitorPanel(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleValidSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={4}
          >
            <div style={{ width: "75%", minWidth: "200px" }}>
              <FormControl fullWidth>
                <Typography variant="h5" px={2} sx={{ marginBottom: "-15px" }}>
                  {(!selectedMonitorGroup) ? (t("monitorGroups.addMonitorGroup")) : t("monitorGroups.editMonitorGroup")}
                </Typography>
              </FormControl>
            </div>
            <div>
              {(selectedMonitorGroup !== null) && (
                <FormControl fullWidth>
                  <Button
                    aria-label="delete"
                    startIcon={
                      <DeleteIcon sx={{ color: isDarkMode ? "inherit" : "#fff" }} />
                    }
                    color="error"
                    onClick={handleDeleteBtn}
                  >
                    {t("dashboard.delete")}
                  </Button>
                </FormControl>
              )}
            </div>
          </Stack>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    {...register("name", { required: true })}
                    fullWidth
                    label={t("monitorGroups.name")}
                    margin="normal"
                    variant="outlined"
                    sx={{
                      marginBottom: "0px !important",
                    }}
                    autoComplete="off"
                    error={!!errors.name}
                    value={watchName}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginBottom: "0",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancelButton()}
                >
                  {t("users.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="success"
                  variant="contained"
                  sx={{
                    mb: 2,
                    mt: 2,
                    ml: 2,
                    color: "white",
                    fontWeight: 700,
                    position: "relative",
                  }}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "primary.dark",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                  {t("dashboard.addHttpForm.save")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </form>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("dashboard.confirmDeleteTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("monitorGroups.confirmDeleteMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirm}
            color="primary"
            autoFocus
            sx={{ p: "5px 15px" }}
          >
            {t("dashboard.addHttpForm.yes")}
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t("dashboard.addHttpForm.no")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FromMonitorGroup;
