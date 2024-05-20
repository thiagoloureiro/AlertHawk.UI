import { FC, Fragment } from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";

interface INotificationTableRowProps {
  notification: INotification;
  selectedNotification: INotification | null;
  handleNotificationSelection: (mnotification: INotification | null) => void;
}
const NotificationTableRow: FC<INotificationTableRowProps> = ({
  notification,
  selectedNotification,
  handleNotificationSelection,
}) => {
  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: selectedNotification?.id === notification.id ? "secondary.main" : "inherit",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => handleNotificationSelection(notification)}
      >
        <TableCell
          width={"80%"}
          sx={
            selectedNotification?.id === notification.id
              ? {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              }
              : {}
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2}}>

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
                {notification.name}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
          width={"80%"}
          sx={
            selectedNotification?.id === notification.id
              ? {
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }
              : {}
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2}}>

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
                {notification.notificationType.name}
              </Typography>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default NotificationTableRow;
