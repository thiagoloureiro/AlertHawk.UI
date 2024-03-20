import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, Fragment, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../interfaces/IMonitorGroupListByUser";
import { useStoreState } from "../../hooks";

interface ICollapsibleTableRowProps {
  monitorGroup: IMonitorGroupListByUser;
  isSelected: boolean;
  selectedChildRowIndex: number | null;
  onRowClick: () => void;
  handleChildRowClick: (childMonitorId: number) => void;
  selectedMetric:
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months";
}

const CollapsibleTableRow: FC<ICollapsibleTableRowProps> = ({
  monitorGroup,
  isSelected,
  selectedChildRowIndex,
  onRowClick,
  handleChildRowClick,
  selectedMetric,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { isDarkMode } = useStoreState((state) => state.app);

  const handleIconButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const renderUptimeBoxes = (uptimePercentage: number, status: boolean) => {
    const totalBoxes = 12;
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

  const renderOverallStatusChip = () => {
    const monitors = monitorGroup.monitors;

    if (monitors.length === 0) {
      return (
        <Chip
          label={"N/A"}
          size="medium"
          color="secondary"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: isDarkMode ? "#fff" : "#676767",
              fontWeight: 700,
            },
          }}
        />
      );
    }

    const anyDown = monitors.some((monitor) => !monitor.status);

    if (anyDown) {
      return (
        <Chip
          label={"Down"}
          color="error"
          size="medium"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      );
    } else {
      return (
        <Chip
          label={"Up"}
          color="success"
          size="medium"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      );
    }
  };

  const calculateAverageUptime = (monitors: IMonitorGroupListByUserItem[]) => {
    let totalUptime = 0;
    let totalMonitors = 0;

    monitors.forEach((monitor) => {
      totalUptime += monitor.monitorStatusDashboard[selectedMetric] ?? 0;
      totalMonitors++;
    });

    return totalMonitors === 0 ? 0 : totalUptime / totalMonitors;
  };

  const renderParentStatusChip = () => {
    const monitors = monitorGroup.monitors;

    if (monitors.length === 0) {
      return (
        <Chip
          label={"N/A"}
          size="medium"
          color="secondary"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: isDarkMode ? "#fff" : "#676767",
              fontWeight: 700,
            },
          }}
        />
      );
    }

    const allRunning = monitors.every((monitor) => monitor.status);

    if (allRunning) {
      return (
        <Chip
          label={
            calculateAverageUptime(monitorGroup.monitors).toFixed(2) + " %"
          }
          color="success"
          size="medium"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      );
    } else {
      return (
        <Chip
          label={
            calculateAverageUptime(monitorGroup.monitors).toFixed(2) + " %"
          }
          color="error"
          size="medium"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      );
    }
  };

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: isSelected ? "secondary.main" : "inherit",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={onRowClick}
      >
        <TableCell
          sx={
            isSelected
              ? {
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }
              : {}
          }
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleIconButtonClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {renderParentStatusChip()}
        </TableCell>
        <TableCell>{monitorGroup.name}</TableCell>
        <TableCell
          align="right"
          sx={
            isSelected
              ? {
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }
              : {}
          }
        >
          {renderOverallStatusChip()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: "4px 4px 4px 5%" }}>
              <Table size="medium" aria-label="monitors">
                <TableBody>
                  {monitorGroup.monitors.map((monitor) => (
                    <TableRow
                      key={monitor.id}
                      sx={{
                        cursor: "pointer",
                        bgcolor:
                          selectedChildRowIndex === monitor.id
                            ? "secondary.main"
                            : "inherit",
                        userSelect: "none",
                      }}
                      onClick={() => handleChildRowClick(monitor.id)}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={
                          selectedChildRowIndex === monitor.id
                            ? {
                                borderTopLeftRadius: "10px",
                                borderBottomLeftRadius: "10px",
                              }
                            : {}
                        }
                      >
                        {monitor.monitorStatusDashboard[selectedMetric] !==
                        0 ? (
                          <Chip
                            label={
                              monitor.monitorStatusDashboard[selectedMetric] +
                              " %"
                            }
                            color={monitor.status ? "success" : "error"}
                            size="medium"
                            sx={{
                              p: "5px 15px",
                              "& .MuiChip-label": {
                                color: "#fff",
                                fontWeight: 700,
                              },
                            }}
                          />
                        ) : (
                          <Chip
                            label={
                              monitor.monitorStatusDashboard[selectedMetric] +
                              " %"
                            }
                            color="error"
                            size="medium"
                            sx={{
                              p: "5px 15px",
                              "& .MuiChip-label": {
                                color: "#fff",
                                fontWeight: 700,
                              },
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{monitor.name}</Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={
                          selectedChildRowIndex === monitor.id
                            ? {
                                borderTopRightRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }
                            : {}
                        }
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
                            monitor.monitorStatusDashboard[selectedMetric] ?? 0,
                            monitor.status
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default CollapsibleTableRow;
