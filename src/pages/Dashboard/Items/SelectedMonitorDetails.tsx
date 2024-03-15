import { FC, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h5" px={2}>
        {selectedMonitorGroup?.name || selectedMonitorItem?.name}
      </Typography>
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
        {/* <Typography
                  component="div"
                  variant="h5"
                  sx={{
                    fontSize: 48,
                    backgroundColor: "success.main",
                    padding: "10px 20px",
                    minWidth: "150px",
                    textAlign: "center",
                    borderRadius: "56px",
                  }}
                >
                  Up
                </Typography> */}
      </Box>
      {selectedMonitorItem !== null && (
        <>
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
