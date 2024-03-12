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
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" mb={2}>
            {selectedMonitorGroup?.name || selectedMonitorItem?.name}
          </Typography>
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
      </CardContent>
    </Card>
  );
};

export default SelectedMonitorDetails;
