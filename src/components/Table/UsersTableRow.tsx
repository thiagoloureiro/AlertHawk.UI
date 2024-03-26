import { FC, Fragment } from "react";
import { IUser } from "../../interfaces/IUser";
import { Avatar, Box, TableCell, TableRow, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface IUsersTableRowProps {
  user: IUser;
  selectedUser: IUser | null;
  handleUserSelection: (user: IUser | null) => void;
}
const UsersTableRow: FC<IUsersTableRowProps> = ({
  user,
  selectedUser,
  handleUserSelection,
}) => {
  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: selectedUser?.id === user.id ? "secondary.main" : "inherit",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => handleUserSelection(user)}
      >
        <TableCell
          width={"80%"}
          sx={
            selectedUser?.id === user.id
              ? {
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }
              : {}
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ backgroundColor: "#424242", color: "#ffffff" }}>
              {user?.username?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase()}
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
                {user.username}
              </Typography>
              <Typography variant="caption">{user.email}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          width={"20%"}
          align="center"
          sx={
            selectedUser?.id === user.id
              ? {
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }
              : {}
          }
        >
          {user.isAdmin ? (
            <CheckCircleIcon sx={{ color: "success.main", ml: 1 }} />
          ) : (
            <CancelIcon sx={{ color: "secondary.light", ml: 1 }} />
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default UsersTableRow;
