import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useStoreActions, useStoreState } from "../../hooks";
import { Status } from "../../enums/Enums";
import { showSnackbar } from "../../utils/snackbarHelper";
import { red } from "@mui/material/colors";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MonitorService from "../../services/MonitorService";
import logging from "../../utils/logging";
import { downloadJsonFile } from "../../utils/downloadJsonFile";
import { useNavigate } from "react-router-dom";

interface FormValues {
  retentionInDays: number;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Admin: FC<{}> = ({}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { retentionInDays } = useStoreState((state) => state.monitorHistory);
  const {
    thunkGetMonitorHistoryRetention,
    thunkSetMonitorHistoryRetention,
    thunkDeleteMonitorHistory,
  } = useStoreActions((action) => action.monitorHistory);
  const { isDarkMode } = useStoreState((state) => state.app);

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: { retentionInDays },
  });

  const [isRetentionFormBeingProcessed, setIsRetentionFormBeingProcessed] =
    useState<boolean>(false);

  const [isBackupDownloadBeingProcessed, setIsBackupDownloadBeingProcessed] =
    useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [openClearHistoryDialog, setOpenClearHistoryDialog] =
    useState<boolean>(false);

  const [
    isClearHistoryFormBeingProcessed,
    setIsClearHistoryFormBeingProcessed,
  ] = useState<boolean>(false);

  const handleClearHistoryOpen = () => {
    setOpenClearHistoryDialog(true);
  };

  const handleClearHistoryClose = () => {
    setOpenClearHistoryDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await thunkGetMonitorHistoryRetention();
    };

    fetchData();
  }, []);

  useEffect(() => {
    reset({ retentionInDays });
  }, [retentionInDays]);

  const onSubmit = async (data: FormValues) => {
    setIsRetentionFormBeingProcessed(true);

    const response = await thunkSetMonitorHistoryRetention({
      historyDaysRetention: Number(data.retentionInDays),
    });

    if (response === Status.Success) {
      showSnackbar(
        t("snackbar.monitorHistory.historyRetentionPeriodSavedSuccessfully"),
        "success"
      );
      reset({ retentionInDays: data.retentionInDays });
    } else {
      showSnackbar(
        t("snackbar.general.somethingWentWrongPleaseTryAgain"),
        "error"
      );
    }
    setIsRetentionFormBeingProcessed(false);
  };

  const handleDeleteMonitorHistory = async () => {
    setIsClearHistoryFormBeingProcessed(true);
    const response = await thunkDeleteMonitorHistory();
    if (response === Status.Success) {
      showSnackbar(
        t("snackbar.monitorHistory.monitorHistoryHasBeenRemovedSuccessfully"),
        "success"
      );
    } else {
      showSnackbar(
        t("snackbar.general.somethingWentWrongPleaseTryAgain"),
        "error"
      );
    }
    handleClearHistoryClose();
    setIsClearHistoryFormBeingProcessed(false);
  };

  const handleBackupDownload = async () => {
    setIsBackupDownloadBeingProcessed(true);

    try {
      const backupData = await MonitorService.getMonitorJsonBackup();
      downloadJsonFile(backupData, "backup.json");
    } catch (error) {
      logging.error(error);
      showSnackbar(
        t("snackbar.general.somethingWentWrongPleaseTryAgain"),
        "error"
      );
    } finally {
      setIsBackupDownloadBeingProcessed(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validExtensions = ["json"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !validExtensions.includes(extension)) {
      showSnackbar(
        t("admin.invalidFileFormatOnlyJSONFormatIsAllowed"),
        "error"
      );
      return;
    }

    handleUpload(file);
    event.target.value = "";
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      await MonitorService.uploadMonitorJsonBackup(formData, headers);

      showSnackbar(t("admin.backupFileHasBeenUploaded"), "success");
      navigate("/");
    } catch (error) {
      logging.error(error);
      showSnackbar(
        t("snackbar.general.somethingWentWrongPleaseTryAgain"),
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isUploading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            // backdropFilter: "blur(1px)",
            zIndex: 9999,
          }}
        >
          <CircularProgress
            color="success"
            sx={{
              position: "absolute",
              top: "calc(50% - 80px)",
              right: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      )}
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("users.isAdmin")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography component="div" variant="h5">
                  {t("admin.monitorHistory")}
                </Typography>
                <Typography variant="body2">
                  {t("admin.numberOfDaysTheMonitorDataWillBeKeptFor")}. (
                  {t("admin.setToZeroForInfiniteRetention")})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Controller
                    name="retentionInDays"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ flex: 3 }}
                        id="retention-period"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onBlur={() => {
                          const value = field.value;
                          setValue("retentionInDays", Math.max(0, value));
                        }}
                        inputProps={{ min: 0 }}
                        size="small"
                        variant="outlined"
                        hiddenLabel
                      />
                    )}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      flex: 1,
                      color: "white",
                      fontWeight: 700,
                      position: "relative",
                      minWidth: "150px",
                      alignSelf: "flex-start",
                    }}
                    disabled={isRetentionFormBeingProcessed}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t("admin.save")}
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    minWidth: "250px",
                    height: "42px",
                    color: red[400],
                    fontWeight: 700,
                    position: "relative",
                    alignSelf: "flex-end",
                  }}
                  onClick={handleClearHistoryOpen}
                >
                  {t("admin.clearAllStatistics")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography component="div" variant="h5">
                  {t("admin.backup")}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography component="div" variant="h6">
                    {t("admin.exportBackup")}
                  </Typography>
                  <Typography variant="body2">
                    {t("admin.youCanBackupAllMonitorsIntoAJSONFile")}.
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      flex: 1,
                      color: "white",
                      fontWeight: 700,
                      minWidth: "150px",
                      alignSelf: "flex-start",
                    }}
                    disabled={isBackupDownloadBeingProcessed}
                    onClick={handleBackupDownload}
                  >
                    {t("admin.backup")}
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography component="div" variant="h6">
                    {t("admin.importBackup")}
                  </Typography>
                  <Typography variant="body2">
                    {t("admin.youCanImportYourJSONBackupFile")}.
                  </Typography>

                  <Button
                    component="label"
                    variant="contained"
                    color="success"
                    startIcon={
                      <CloudUploadIcon
                        sx={{ color: isDarkMode ? "inherit" : "#fff" }}
                      />
                    }
                    sx={{
                      flex: 1,
                      color: "white",
                      fontWeight: 700,
                      minWidth: "150px",
                      alignSelf: "flex-start",
                    }}
                    disabled={isUploading}
                  >
                    {t("admin.upload")}
                    <VisuallyHiddenInput
                      id="upload-backup"
                      type="file"
                      onChange={handleFileInputChange}
                    />
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={openClearHistoryDialog}
        onClose={handleClearHistoryClose}
        aria-labelledby="clear-history-dialog"
        aria-describedby="clear-history-dialog"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "630px",
            maxHeight: "unset",
          },
        }}
        disableScrollLock
      >
        <DialogTitle component={"span"} sx={{ padding: "24px 24px 0 24px" }}>
          <IconButton
            aria-label="close"
            onClick={handleClearHistoryClose}
            sx={{
              position: "absolute",
              right: "6px",
              top: "6px",
              color: "#0F0F0F",
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h1"
            fontSize="22px"
            fontWeight={500}
            lineHeight={"27.6px"}
            mb={"12px"}
          >
            {t(
              "snackbar.monitorHistory.areYouSureYouWantToDeleteAllStatistics"
            )}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            fontSize="16px"
            fontWeight={400}
            lineHeight={"27.6px"}
          >
            {t(
              "snackbar.monitorHistory.pleaseBeAwareThatThisOperationCannotBeUndone"
            ) + "."}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            marginTop: "32px",
            padding: "0 24px 24px 24px",
          }}
        >
          <Stack direction="row" justifyContent="end" gap="7px">
            <Button
              onClick={handleClearHistoryClose}
              variant="text"
              sx={{
                width: 109,
                fontSize: 14,
                fontWeight: 500,
                height: "40px",
                padding: "8px 33px",
              }}
              color="error"
            >
              {t("users.cancel")}
            </Button>
            <Button
              onClick={handleDeleteMonitorHistory}
              variant="contained"
              sx={{
                width: 107,
                fontSize: 14,
                fontWeight: 500,
                height: "40px",
                padding: "8px 33px",
              }}
              color="error"
              disabled={isClearHistoryFormBeingProcessed}
            >
              {t("dashboard.delete")}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Admin;
