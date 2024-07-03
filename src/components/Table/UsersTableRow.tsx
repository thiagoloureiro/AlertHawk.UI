import { FC, Fragment, useState } from "react";
import { IUser } from "../../interfaces/IUser";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { red } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { useStoreActions, useStoreState } from "../../hooks";
import { Status } from "../../enums/Enums";
import { showSnackbar } from "../../utils/snackbarHelper";
import logging from "../../utils/logging";

interface IUsersTableRowProps {
  userRow: IUser;
  selectedUser: IUser | null;
  handleUserSelection: (user: IUser | null) => void;
}
const UsersTableRow: FC<IUsersTableRowProps> = ({
  userRow,
  selectedUser,
  handleUserSelection,
}) => {
  const { t } = useTranslation("global");
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  const { user } = useStoreState((state) => state.user);
  const { thunkUserDelete } = useStoreActions((action) => action.user);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleUserDialogClose = () => {
    setOpenUserDialog(false);
  };

  const handleUserDialogOpen = () => {
    setOpenUserDialog(true);
  };

  const handleUserDeletion = async () => {
    if (userRow.id === null) {
      return;
    }
    setIsDeleting(true);
    setOpenUserDialog(true);

    try {
      const res = await thunkUserDelete(userRow.id);
      if (res === Status.Success) {
        showSnackbar(t("users.userDeleteDialogSuccessConfirmation"), "success");
      } else {
        showSnackbar("Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      logging.error(error);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setOpenUserDialog(false);
      setIsDeleting(false);
    }
  };

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor:
            selectedUser?.id === userRow.id ? "secondary.main" : "inherit",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => handleUserSelection(userRow)}
      >
        <TableCell
          width={"70%"}
          sx={
            selectedUser?.id === userRow.id
              ? {
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }
              : {}
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ backgroundColor: "#424242", color: "#ffffff" }}>
              {userRow?.username
                ?.split(" ")
                .slice(0, 2)
                .map((name) => name.charAt(0))
                .join("")
                .toUpperCase() ||
                userRow?.email?.split(".")[0].charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {userRow.username}
              </Typography>
              <Typography variant="caption">{userRow.email}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell width={"15%"} align="center">
          {userRow.isAdmin ? (
            <CheckCircleIcon sx={{ color: "success.main", ml: 1 }} />
          ) : (
            <CancelIcon sx={{ color: "secondary.light", ml: 1 }} />
          )}
        </TableCell>
        <TableCell
          width={"15%"}
          align="center"
          sx={
            selectedUser?.id === userRow.id
              ? {
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }
              : {}
          }
        >
          {userRow.id === user?.id ? (
            <IconButton aria-label={t("dashboard.delete")} disabled>
              <DeleteForeverIcon
                fontSize="inherit"
                sx={{ color: "secondary.light" }}
              />
            </IconButton>
          ) : (
            <Tooltip title={t("dashboard.delete")} placement="right" arrow>
              <IconButton
                aria-label={t("dashboard.delete")}
                onClick={handleUserDialogOpen}
              >
                <DeleteForeverIcon
                  fontSize="inherit"
                  sx={{ color: red[400] }}
                />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <Dialog
        open={openUserDialog}
        onClose={handleUserDialogClose}
        aria-labelledby="user-dialog-title"
        aria-describedby="user-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "478px",
            maxHeight: "unset",
          },
        }}
        disableScrollLock
      >
        <DialogTitle component={"span"} sx={{ padding: "24px 24px 0 24px" }}>
          <IconButton
            aria-label="close"
            onClick={handleUserDialogClose}
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
            {t("users.userDeleteDialogTitle")}
          </Typography>
        </DialogTitle>
        <DialogActions
          sx={{
            marginTop: "32px",
            padding: "0 24px 24px 24px",
          }}
        >
          <Stack direction="row" justifyContent="end" gap="7px">
            <Button
              onClick={handleUserDialogClose}
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
              onClick={handleUserDeletion}
              variant="contained"
              sx={{
                width: 107,
                fontSize: 14,
                fontWeight: 500,
                height: "40px",
                padding: "8px 33px",
              }}
              color="error"
              disabled={isDeleting}
            >
              {t("dashboard.delete")}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default UsersTableRow;
