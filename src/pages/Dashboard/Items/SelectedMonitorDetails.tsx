import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useStoreState } from "../../../hooks";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../../interfaces/IMonitorGroupListByUser";
import { useTranslation } from "react-i18next";
import { getMetricName } from "../../../utils/metricParser";
import { useNavigate } from "react-router-dom";
import MonitorService from "../../../services/MonitorService";
import { useStoreActions } from "../../../hooks";
import Chart from "../../../components/Charts/Chart";
import { showSnackbar } from "../../../utils/snackbarHelper";
import EditMonitor from "../Forms/EditMonitor";
import NotificationsListDialog from "../../../components/Dialogs/NotificationsListDialog";
import HttpsIcon from "@mui/icons-material/Https";

interface ISelectedMonitorDetailsProps {
  selectedMonitorGroup: IMonitorGroupListByUser | null;
  selectedMonitorItem: IMonitorGroupListByUserItem | null;
  selectedMetric:
    | "uptime1Hr"
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months";
  setEditMonitorPanel: (val: boolean) => void;
  editMonitorPanel: boolean;
}

const SelectedMonitorDetails: FC<ISelectedMonitorDetailsProps> = ({
  selectedMonitorGroup,
  selectedMonitorItem,
  selectedMetric,
  setEditMonitorPanel,
  editMonitorPanel,
}) => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();
  const { thunkGetMonitorGroupListByUser, thunkGetMonitorStats } =
    useStoreActions((actions) => actions.monitor);

  const { selectedEnvironment } = useStoreState((state) => state.app);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);

  const handleDeleteBtn = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleCloseNotificationDialog = () => {
    setOpenNotificationDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    if (selectedMonitorItem !== null) {
      await MonitorService.deleteMonitor(selectedMonitorItem.id).then(
        async () => {
          await thunkGetMonitorGroupListByUser({
            environment: selectedEnvironment,
          });
          await thunkGetMonitorStats(selectedEnvironment);
          showSnackbar(t("dashboard.deleteConfirmation"), "success");
        }
      );
    }
  };

  const handleResumePauseBtn = async () => {
    if (selectedMonitorItem !== null) {
      await MonitorService.pauseMonitor(
        selectedMonitorItem?.id ?? 0,
        !isPaused
      );
    } else {
      await MonitorService.pauseGroupMonitor(
        selectedMonitorGroup?.id ?? 0,
        !isPaused
      );
    }
    await thunkGetMonitorGroupListByUser({
      environment: selectedEnvironment,
    });
    setIsPaused(!isPaused);
    showSnackbar(t("dashboard.pauseConfirmation"), "success");
  };
  const handleAlertBtn = () => {
    navigate(`/monitor-alert/${selectedMonitorItem?.id}`);
  };
  useEffect(() => {
    if (selectedMonitorItem !== null) {
      setIsPaused(selectedMonitorItem.paused);
    } else if (selectedMonitorGroup !== null) {
      let paused = selectedMonitorGroup.monitors.find((x) => x.paused);
      if (paused !== undefined) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    }
  });

  const handleSslCheckBtn = () => {
    if (
      selectedMonitorItem === null ||
      selectedMonitorItem.urlToCheck === undefined
    ) {
      return;
    }

    window.open(
      `https://www.ssllabs.com/ssltest/analyze.html?d=${selectedMonitorItem.urlToCheck}`,
      "_blank"
    );
  };

  const handleNotificationBtn = () => {
    setOpenNotificationDialog(true);
  };

  const handleEditBtn = () => {
    setEditMonitorPanel(true);
  };

  const renderUptimeBoxes = (uptimePercentage: number, status: boolean) => {
    const totalBoxes = 24;
    const greenBoxes = Math.floor((uptimePercentage / 100) * totalBoxes);
    const redBoxes = totalBoxes - greenBoxes;

    const boxes = [];

    if (status) {
      const greenEndIndex = Math.floor((greenBoxes + redBoxes) / 2);

      for (let i = 0; i < greenBoxes; i++) {
        boxes.push(
          <Box
            key={i}
            sx={{
              backgroundColor: "success.main",
              width: "8px",
              height: "25px",
              borderRadius: "56px",
              transition: "all 0.2s ease-in-out",
              ":hover": {
                transform: "scale(1.4)",
              },
            }}
          />
        );
        if (i === greenEndIndex - 1) {
          for (let j = 0; j < redBoxes; j++) {
            boxes.push(
              <Box
                key={i + j + 1}
                sx={{
                  backgroundColor: "error.main",
                  width: "8px",
                  height: "25px",
                  borderRadius: "56px",
                  transition: "all 0.2s ease-in-out",
                  ":hover": {
                    transform: "scale(1.4)",
                  },
                }}
              />
            );
          }
        }
      }
    } else {
      for (let i = 0; i < greenBoxes; i++) {
        boxes.push(
          <Box
            key={i}
            sx={{
              backgroundColor: "success.main",
              width: "8px",
              height: "25px",
              borderRadius: "56px",
              transition: "all 0.2s ease-in-out",
              ":hover": {
                transform: "scale(1.4)",
              },
            }}
          />
        );
      }
      for (let i = 0; i < redBoxes; i++) {
        boxes.push(
          <Box
            key={i + greenBoxes}
            sx={{
              backgroundColor: "error.main",
              width: "8px",
              height: "25px",
              borderRadius: "56px",
              transition: "all 0.2s ease-in-out",
              ":hover": {
                transform: "scale(1.4)",
              },
            }}
          />
        );
      }
    }

    return boxes;
  };

  const calculateAverageUptime = (
    monitors: IMonitorGroupListByUserItem[],
    metric:
      | "uptime1Hr"
      | "uptime24Hrs"
      | "uptime7Days"
      | "uptime30Days"
      | "uptime3Months"
      | "uptime6Months" = selectedMetric
  ) => {
    let totalUptime = 0;
    let totalMonitors = 0;

    monitors.forEach((monitor) => {
      const uptime = monitor.monitorStatusDashboard[metric];
      if (uptime !== 0) {
        totalUptime += uptime ?? 0;
        totalMonitors++;
      }
    });

    return totalMonitors === 0 ? 0 : totalUptime / totalMonitors;
  };

  useEffect(() => {
    const fetchData = async () => {
      await thunkGetMonitorGroupListByUser({
        environment: selectedEnvironment,
      });
    };

    fetchData();
  }, []);

  return (
    <>
      {editMonitorPanel ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <EditMonitor
            setEditMonitorPanel={setEditMonitorPanel}
            monitorItemToBeEdited={selectedMonitorItem}
            monitorGroupToBeEdited={selectedMonitorGroup}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" px={2} sx={{ marginBottom: "-10px" }}>
            {selectedMonitorGroup !== null
              ? selectedMonitorItem !== null
                ? selectedMonitorItem?.name
                : selectedMonitorGroup?.name
              : ""}
          </Typography>
          {selectedMonitorItem !== null && (
            <Box px={2}>
              <a
                href={
                  selectedMonitorItem.urlToCheck ??
                  selectedMonitorItem.monitorTcp ??
                  "#"
                }
                style={{
                  fontWeight: 700,
                  color: isDarkMode ? "#00bcd4" : "#0097a7",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedMonitorItem.urlToCheck ??
                  selectedMonitorItem.monitorTcp ??
                  "N/A"}
              </a>
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
            <ButtonGroup
              variant="contained"
              size="large"
              color="secondary"
              disableElevation
            >
              <Button
                aria-label="pause/resume"
                startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                onClick={handleResumePauseBtn}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isPaused ? t("dashboard.resume") : t("dashboard.pause")}
                </Box>
              </Button>
              {selectedMonitorItem !== null && (
                <Button
                  aria-label=""
                  startIcon={<EditNoteIcon />}
                  onClick={handleEditBtn}
                >
                  {t("dashboard.edit")}
                </Button>
              )}
              {selectedMonitorItem !== null && (
                <Button
                  aria-label=""
                  startIcon={<NotificationsIcon />}
                  onClick={handleAlertBtn}
                >
                  {t("dashboard.alarm")}
                </Button>
              )}
              {selectedMonitorItem !== null && (
                <Button
                  aria-label=""
                  startIcon={<NotificationsIcon />}
                  onClick={handleNotificationBtn}
                >
                  {t("notifications.title")}
                </Button>
              )}
              {selectedMonitorItem !== null &&
                selectedMonitorItem.urlToCheck !== undefined && (
                  <Button
                    aria-label=""
                    startIcon={<HttpsIcon />}
                    onClick={handleSslCheckBtn}
                  >
                    {t("dashboard.sslCheck")}
                  </Button>
                )}
              {selectedMonitorItem !== null && (
                <Button
                  aria-label="delete"
                  startIcon={
                    <DeleteIcon
                      sx={{ color: isDarkMode ? "inherit" : "#fff" }}
                    />
                  }
                  color="error"
                  onClick={handleDeleteBtn}
                >
                  {t("dashboard.delete")}
                </Button>
              )}
            </ButtonGroup>
          </Box>
          {selectedMonitorGroup !== null && selectedMonitorItem === null && (
            <>
              <Card>
                <CardContent sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 6,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {selectedMonitorGroup.monitors.length === 0 ? (
                        <Typography variant="body1">N/A</Typography>
                      ) : (
                        renderUptimeBoxes(
                          calculateAverageUptime(
                            selectedMonitorGroup.monitors
                          ) ?? 0,
                          selectedMonitorGroup.monitors.every((x) => x.status)
                        )
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedMonitorGroup.monitors.length === 0 ? (
                        <Chip
                          label={"N/A"}
                          color="secondary"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: isDarkMode ? "#fff" : "#676767",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      ) : selectedMonitorGroup.monitors.some(
                          (x) => x.status && x.paused
                        ) ? (
                        <Chip
                          label={t("dashboard.paused")}
                          color="secondary"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "primary",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      ) : selectedMonitorGroup.monitors.every(
                          (x) => x.status
                        ) ? (
                        <Chip
                          label={t("dashboard.up")}
                          color="success"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      ) : (
                        <Chip
                          label={t("dashboard.down")}
                          color="error"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="secondary.light"
                    px={4}
                    sx={{ position: "absolute", left: "30px", bottom: "5px" }}
                  >
                    {getMetricName(selectedMetric).split(" ")[0]}{" "}
                    {t(
                      `dashboard.${getMetricName(selectedMetric)
                        .split(" ")[1]
                        .toLowerCase()}`
                    )}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (1 {t("dashboard.hour")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime1Hr
                          ? selectedMonitorGroup.avgUptime1Hr.toFixed(2) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (24 {t("dashboard.hours")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime24Hrs
                          ? selectedMonitorGroup.avgUptime24Hrs.toFixed(2) +
                            " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (7 {t("dashboard.days")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime7Days !== null &&
                        selectedMonitorGroup.avgUptime7Days !== undefined &&
                        selectedMonitorGroup.avgUptime7Days >= 0
                          ? selectedMonitorGroup.avgUptime7Days.toFixed(2) +
                            " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (30 {t("dashboard.days")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime30Days !== null &&
                        selectedMonitorGroup.avgUptime30Days !== undefined &&
                        selectedMonitorGroup.avgUptime30Days >= 0
                          ? selectedMonitorGroup.avgUptime30Days.toFixed(2) +
                            " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (3 {t("dashboard.months")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime3Months !== null &&
                        selectedMonitorGroup.avgUptime3Months !== undefined &&
                        selectedMonitorGroup.avgUptime3Months >= 0
                          ? selectedMonitorGroup.avgUptime3Months.toFixed(2) +
                            " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (6 {t("dashboard.months")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorGroup.avgUptime6Months !== null &&
                        selectedMonitorGroup.avgUptime6Months !== undefined &&
                        selectedMonitorGroup.avgUptime6Months >= 0
                          ? selectedMonitorGroup.avgUptime6Months.toFixed(2) +
                            " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
          {selectedMonitorItem !== null && (
            <>
              <Card>
                <CardContent sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 6,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {renderUptimeBoxes(
                        selectedMonitorItem.monitorStatusDashboard[
                          selectedMetric
                        ] ?? 0,
                        selectedMonitorItem.status
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedMonitorItem.paused ? (
                        <Chip
                          label={t("dashboard.paused")}
                          color="secondary"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "primary",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      ) : selectedMonitorItem.status ? (
                        <Chip
                          label={t("dashboard.up")}
                          color="success"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      ) : (
                        <Chip
                          label={t("dashboard.down")}
                          color="error"
                          sx={{
                            borderRadius: "56px",
                            p: "20px 20px",
                            "& .MuiChip-label": {
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 24,
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="secondary.light"
                    px={4}
                    sx={{ position: "absolute", left: "30px", bottom: "5px" }}
                  >
                    {getMetricName(selectedMetric)}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (1 {t("dashboard.hour")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime1Hr === "number" &&
                        selectedMonitorItem.monitorStatusDashboard.uptime1Hr >=
                          0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime1Hr.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (24 {t("dashboard.hours")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime24Hrs === "number" &&
                        selectedMonitorItem.monitorStatusDashboard
                          .uptime24Hrs >= 0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime24Hrs.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (7 {t("dashboard.days")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime7Days === "number" &&
                        selectedMonitorItem.monitorStatusDashboard
                          .uptime7Days >= 0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime7Days.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (30 {t("dashboard.days")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime30Days === "number" &&
                        selectedMonitorItem.monitorStatusDashboard
                          .uptime30Days >= 0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime30Days.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (3 {t("dashboard.months")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime3Months === "number" &&
                        selectedMonitorItem.monitorStatusDashboard
                          .uptime3Months >= 0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime3Months.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.uptime")}
                      </Typography>
                      <Typography variant="body2">
                        (6 {t("dashboard.months")})
                      </Typography>
                      <Typography variant="subtitle1">
                        {typeof selectedMonitorItem.monitorStatusDashboard
                          .uptime6Months === "number" &&
                        selectedMonitorItem.monitorStatusDashboard
                          .uptime6Months >= 0
                          ? selectedMonitorItem.monitorStatusDashboard.uptime6Months.toFixed(
                              2
                            ) + " %"
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.response")}
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorItem.monitorStatusDashboard
                          .responseTime + " ms"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {t("dashboard.certificateexpiration")}
                      </Typography>
                      <Typography variant="subtitle1">
                        {selectedMonitorItem.monitorStatusDashboard
                          .certExpDays + " days"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Chart
                    monitorId={selectedMonitorItem.id}
                    data={
                      selectedMonitorItem.monitorStatusDashboard.historyData
                    }
                  />
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      )}
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
            {t("dashboard.confirmDeleteMessage")}
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
      <NotificationsListDialog
        openDialog={openNotificationDialog}
        handleCloseDialog={handleCloseNotificationDialog}
        monitorId={selectedMonitorItem?.id}
      />
    </>
  );
};

export default SelectedMonitorDetails;
