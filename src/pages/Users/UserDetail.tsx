import { FC, useEffect, useState } from "react";
import { IUser } from "../../interfaces/IUser";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useStoreState } from "../../hooks";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";
import UserService from "../../services/UserService";
import logging from "../../utils/logging";
import { showSnackbar } from "../../utils/snackbarHelper";
import { useTranslation } from "react-i18next";

interface IUserDetailProps {
  user: IUser;
  handleUserSelection: (user: IUser | null) => void;
}

const UserDetail: FC<IUserDetailProps> = ({ user, handleUserSelection }) => {
  const { t } = useTranslation("global");
  const { monitorGroupList } = useStoreState((state) => state.monitor);
  const [originalAssignedMonitorGroups, setOriginalAssignedMonitorGroups] =
    useState<IMonitorGroupListByUser[]>([]);
  const [assignedMonitorGroups, setAssignedMonitorGroups] = useState<
    IMonitorGroupListByUser[]
  >([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.id !== null) {
          const responseGroupListByUser =
            await UserService.getUserMonitorGroups(user.id);
          const convertedResponseGroupListByUser = monitorGroupList.filter(
            (x) =>
              responseGroupListByUser
                .map((y) => y.groupMonitorId)
                .includes(x.id)
          );
          setOriginalAssignedMonitorGroups([
            ...convertedResponseGroupListByUser,
          ]);
          setAssignedMonitorGroups([...convertedResponseGroupListByUser]);
        }
      } catch (err) {
        logging.error(err);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteChip = (groupId: number) => {
    setAssignedMonitorGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  const handleAddChip = (group: IMonitorGroupListByUser) => {
    setAssignedMonitorGroups((prevGroups) => [...prevGroups, group]);
  };

  const handleSave = async () => {
    try {
      if (
        JSON.stringify(assignedMonitorGroups) ===
        JSON.stringify(originalAssignedMonitorGroups)
      ) {
        return;
      }

      setIsButtonDisabled(true);

      let convertedAssignedMonitorGroups: {
        userId: string | null;
        groupMonitorId: number;
      }[] = [];

      if (assignedMonitorGroups.length > 0) {
        convertedAssignedMonitorGroups = assignedMonitorGroups.map((group) => ({
          userId: user.id,
          groupMonitorId: group.id,
        }));
      } else {
        convertedAssignedMonitorGroups = [
          { userId: user.id, groupMonitorId: 0 },
        ];
      }

      await UserService.updateMonitorGroup(convertedAssignedMonitorGroups);

      showSnackbar(t("users.monitorConfirmation"), "success");
      setOriginalAssignedMonitorGroups([...assignedMonitorGroups]);
    } catch (error) {
      showSnackbar("Something went wrong. Please try again later", "error");
      logging.error(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 230px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        px: 6,
        py: 2,
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: "2.5rem",
            mb: 2,
          }}
        >
          {user?.username
            ?.split(" ")
            .slice(0, 2)
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase() ||
            user?.email?.split(".")[0].charAt(0).toUpperCase()}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1" fontWeight={500} fontSize={22}>
            {user.username}
          </Typography>
          <Typography variant="caption">{user.email}</Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
            my: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              flex: "1 1 auto",
              position: "relative",
            }}
          >
            <Typography variant="body1" fontWeight={500} fontSize={16}>
              {t("users.monitorGroups")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              marginTop: "8px",
            }}
          >
            {assignedMonitorGroups.map((assignedGroup) => (
              <Chip
                key={assignedGroup.id}
                label={assignedGroup.name}
                onClick={() => handleDeleteChip(assignedGroup.id)}
                onDelete={() => handleDeleteChip(assignedGroup.id)}
                deleteIcon={
                  <IconButton>
                    <RemoveOutlinedIcon sx={{ fontSize: 14, color: "#fff" }} />
                  </IconButton>
                }
                color="success"
                sx={{ color: "#fff", fontWeight: 500 }}
              />
            ))}
            {monitorGroupList
              .filter((group) =>
                assignedMonitorGroups.every(
                  (assignedGroup) => assignedGroup.id !== group.id
                )
              )
              .map((unassignedGroup) => (
                <Chip
                  key={unassignedGroup.id}
                  label={unassignedGroup.name}
                  onClick={() => handleAddChip(unassignedGroup)}
                  onDelete={() => handleAddChip(unassignedGroup)}
                  deleteIcon={
                    <IconButton>
                      <AddOutlinedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  }
                />
              ))}
          </Box>
        </Box>
      </div>
      <Box
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleUserSelection(null)}
        >
          {t("users.cancel")}
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ color: "#fff", position: "relative" }}
          disabled={
            JSON.stringify(assignedMonitorGroups) ===
              JSON.stringify(originalAssignedMonitorGroups) || isButtonDisabled
          }
          onClick={handleSave}
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
          {t("users.save")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetail;
