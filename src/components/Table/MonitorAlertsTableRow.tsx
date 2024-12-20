import moment from "moment";
import { FC, Fragment } from "react";
import { useStoreState } from "../../hooks";
import { Environment } from "../../enums/Enums";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { IMonitorAlerts } from "../../interfaces/IMonitorAlerts";

interface IMonitorAlertsTableRowProps {
  monitorAlert: IMonitorAlerts;
}
const MonitorAlertsTableRow: FC<IMonitorAlertsTableRowProps> = ({
  monitorAlert,
}) => {

  const { selectedDisplayTimezone } = useStoreState((state) => state.app);

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          userSelect: "none",
          cursor: "pointer",
        }}
        key={monitorAlert.id}>
        <TableCell>
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
                {
                  moment
                    .utc(monitorAlert.timeStamp)
                    .tz(selectedDisplayTimezone)
                    .format("DD/MMM/YYYY HH:mm:ss")
                }
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell >
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
                {
                  monitorAlert.monitorName
                }
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell >
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
                {
                  monitorAlert.environment === 0 ? 'N/A' : Environment[monitorAlert.environment]
                }
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
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
                {
                  monitorAlert.message
                }
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell
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
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default MonitorAlertsTableRow;
