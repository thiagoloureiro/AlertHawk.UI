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
import { useForm, Controller } from "react-hook-form";

interface FormValues {
  retentionInDays: number;
}

const Admin: FC<{}> = ({}) => {
  const { t } = useTranslation("global");
  const { retentionInDays } = useStoreState((state) => state.monitorHistory);
  const {
    thunkGetMonitorHistoryRetention,
    thunkSetMonitorHistoryRetention,
    thunkDeleteMonitorHistory,
  } = useStoreActions((action) => action.monitorHistory);

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: { retentionInDays },
  });

  const [isRetentionFormBeingProcessed, setIsRetentionFormBeingProcessed] =
    useState<boolean>(false);

  const [
    isClearHistoryFormBeingProcessed,
    setIsClearHistoryFormBeingProcessed,
  ] = useState<boolean>(false);

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
                    {t("admin.monitorHistory")}
                  </Typography>
                  <Typography variant="body2">
                    {t("admin.numberOfDaysTheMonitorDataWillBeKeptFor")}. (
                    {t("admin.setToZeroForInfiniteRetention")})
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                            if (!field.value) {
                              setValue("retentionInDays", 0);
                            }
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
                        maxWidth: "250px",
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
                    disabled={isClearHistoryFormBeingProcessed}
                    onClick={handleDeleteMonitorHistory}
                  >
                    {t("admin.clearAllStatistics")}
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
