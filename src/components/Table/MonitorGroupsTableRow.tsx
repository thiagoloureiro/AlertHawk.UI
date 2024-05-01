import { FC, Fragment } from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";

interface IMonitorGroupsTableRowProps {
  monitorGroup: IMonitorGroupListByUser;
  selectedGroup: IMonitorGroupListByUser | null;
  handleMonitorGroupSelection: (monitorGroup: IMonitorGroupListByUser | null) => void;
}
const MonitorGroupsTableRow: FC<IMonitorGroupsTableRowProps> = ({
  monitorGroup,
  selectedGroup,
  handleMonitorGroupSelection,
}) => {
  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: selectedGroup?.id === monitorGroup.id ? "secondary.main" : "inherit",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => handleMonitorGroupSelection(monitorGroup)}
      >
        <TableCell
          width={"80%"}
          sx={
            selectedGroup?.id === monitorGroup.id
              ? {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              }
              : {}
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

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
                {monitorGroup.name}
              </Typography>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default MonitorGroupsTableRow;
