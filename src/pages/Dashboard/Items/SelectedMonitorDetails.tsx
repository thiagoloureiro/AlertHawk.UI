import { FC, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStoreState } from "../../../hooks";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../../interfaces/IMonitorGroupListByUser";
import { useTranslation } from "react-i18next";

interface ISelectedMonitorDetailsProps {
  selectedMonitorGroup: IMonitorGroupListByUser | null;
  selectedMonitorItem: IMonitorGroupListByUserItem | null;
}

const SelectedMonitorDetails: FC<ISelectedMonitorDetailsProps> = ({
  selectedMonitorGroup,
  selectedMonitorItem,
}) => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleResumePauseBtn = () => {
    setIsPaused(!isPaused);
  };

  const handleEditBtn = () => {
    setIsEditMode(!isEditMode);
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h5" px={2} sx={{ marginBottom: "-10px" }}>
        {selectedMonitorGroup?.name || selectedMonitorItem?.name}
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
          <Button
            aria-label="edit"
            startIcon={<EditNoteIcon />}
            onClick={handleEditBtn}
          >
            {t("dashboard.edit")}
          </Button>
          <Button
            aria-label="delete"
            startIcon={
              <DeleteIcon sx={{ color: isDarkMode ? "inherit" : "#fff" }} />
            }
            color="error"
          >
            {t("dashboard.delete")}
          </Button>
        </ButtonGroup>
      </Box>
      {selectedMonitorItem !== null && (
        <>
          <Card>
            <CardContent>
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
                    selectedMonitorItem.monitorStatusDashboard?.uptime24Hrs ??
                      0,
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
                  {selectedMonitorItem.status ? (
                    <Chip
                      label={"Up"}
                      color="success"
                      sx={{
                        borderRadius: "56px",
                        p: "30px 30px",
                        "& .MuiChip-label": {
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 36,
                        },
                      }}
                    />
                  ) : (
                    <Chip
                      label={"Down"}
                      color="error"
                      sx={{
                        borderRadius: "56px",
                        p: "30px 30px",
                        "& .MuiChip-label": {
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 36,
                        },
                      }}
                    />
                  )}
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
                  <Typography variant="h6">Uptime</Typography>
                  <Typography variant="body2">(24 hours)</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.uptime24Hrs ??
                      "N/A"}
                    {selectedMonitorItem.monitorStatusDashboard.uptime24Hrs &&
                      "%"}
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
                  <Typography variant="h6">Uptime</Typography>
                  <Typography variant="body2">(7 days)</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.uptime7Days ??
                      "N/A"}
                    {selectedMonitorItem.monitorStatusDashboard.uptime7Days &&
                      "%"}
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
                  <Typography variant="h6">Uptime</Typography>
                  <Typography variant="body2">(30 days)</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.uptime30Days ??
                      "N/A"}
                    {selectedMonitorItem.monitorStatusDashboard.uptime30Days &&
                      "%"}
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
                  <Typography variant="h6">Uptime</Typography>
                  <Typography variant="body2">(3 months)</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.uptime3Months ??
                      "N/A"}
                    {selectedMonitorItem.monitorStatusDashboard.uptime3Months &&
                      "%"}
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
                  <Typography variant="h6">Uptime</Typography>
                  <Typography variant="body2">(6 months)</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.uptime6Months ??
                      "N/A"}
                    {selectedMonitorItem.monitorStatusDashboard.uptime6Months &&
                      "%"}
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
                  <Typography variant="h6">Response</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.responseTime +
                      " ms"}
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
                  <Typography variant="h6">Certificate Expiration</Typography>
                  <Typography variant="subtitle1">
                    {selectedMonitorItem.monitorStatusDashboard.certExpDays +
                      " days"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default SelectedMonitorDetails;
