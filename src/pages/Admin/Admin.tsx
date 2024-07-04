import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
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

const Admin: FC<{}> = ({}) => {
  const { t } = useTranslation("global");
  const { retentionInDays } = useStoreState((state) => state.monitorHistory);
  const {
    thunkGetMonitorHistoryRetention,
    thunkSetMonitorHistoryRetention,
    thunkDeleteMonitorHistory,
  } = useStoreActions((action) => action.monitorHistory);
  const [retentionInDaysFormValue, setRetentionInDaysFormValue] =
    useState<number>(retentionInDays);
  const [isRetentionFormBeingProcessed, setIsRetentionFormBeingProcessed] =
    useState<boolean>(false);
  const [
    isClearHistoryFormBeingProcessed,
    setIsClearHistoryFormBeingProcessed,
  ] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await thunkGetMonitorHistoryRetention();

      if (response === Status.Success) {
        setRetentionInDaysFormValue(retentionInDays);
      } else {
        showSnackbar("History retention could not be retrieved.", "error");
      }
    };

    fetchData();
  }, [retentionInDays]);

  const handleRetentionPeriodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (value) {
      value = String(Number(value));
      const parsedValue = parseInt(value, 10);
      if (parsedValue >= 0) {
        setRetentionInDaysFormValue(parsedValue);
      } else {
        setRetentionInDaysFormValue(0);
      }
    }
  };

  const handleSaveClick = async () => {
    setIsRetentionFormBeingProcessed(true);

    const response = await thunkSetMonitorHistoryRetention({
      historyDaysRetention: retentionInDaysFormValue,
    });
    if (response === Status.Success) {
      showSnackbar("History retention period saved successfully.", "success");
    } else {
      showSnackbar("Something went wrong. Please try again.", "error");
    }

    setIsRetentionFormBeingProcessed(false);
  };

  const handleDeleteMonitorHistory = async () => {
    setIsClearHistoryFormBeingProcessed(true);

    const response = await thunkDeleteMonitorHistory();
    if (response === Status.Success) {
      showSnackbar("Monitor history has been removed successfully.", "success");
    } else {
      showSnackbar("Something went wrong. Please try again.", "error");
    }

    setIsClearHistoryFormBeingProcessed(false);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("users.isAdmin")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Stack direction="column" justifyContent="space-between" gap={2}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginBottom: "16px",
                  }}
                >
                  <Typography component="div" variant="h5">
                    Monitor History
                  </Typography>
                  <Typography variant="body2">
                    Number of days the monitor data will be kept for. (Set to 0
                    for infinite retention)
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      sx={{ flex: 3 }}
                      id="retention-period"
                      type="number"
                      value={retentionInDaysFormValue}
                      onChange={handleRetentionPeriodChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0 }}
                      size="small"
                      variant="outlined"
                      hiddenLabel
                    />
                    <Button
                      variant="contained"
                      color="success"
                      sx={{
                        flex: 1,
                        color: "white",
                        fontWeight: 700,
                        position: "relative",
                        maxWidth: "250px",
                      }}
                      disabled={isRetentionFormBeingProcessed}
                      onClick={handleSaveClick}
                    >
                      Save
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      width: "250px",
                      height: "42px",
                      color: red[400],
                      fontWeight: 700,
                      position: "relative",
                      alignSelf: "flex-end",
                    }}
                    disabled={isClearHistoryFormBeingProcessed}
                    onClick={handleDeleteMonitorHistory}
                  >
                    Clear All Statistics
                  </Button>
                </Box>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <Box>
                  <Typography component="div" variant="h5">
                    Backup
                  </Typography>
                </Box>
              </CardContent>
            </Card> */}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
