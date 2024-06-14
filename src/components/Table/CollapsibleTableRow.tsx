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
import { useTranslation } from "react-i18next";

interface ICollapsibleTableRowProps {
  monitorGroup: IMonitorGroupListByUser;
  monitorGroupId: number;
  isSelected: boolean;
  selectedChildRowIndex: number | null;
  onRowClick: () => void;
  handleChildRowClick: (childMonitorId: number, monitorGroupId: number) => void;
  selectedMetric:
    | "uptime1Hr"
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months";
  monitorStatus: string;
  searchText: string;
  parentMatchesSearchText: boolean;
}

const CollapsibleTableRow: FC<ICollapsibleTableRowProps> = ({
  monitorGroup,
  monitorGroupId,
  isSelected,
  selectedChildRowIndex,
  onRowClick,
  handleChildRowClick,
  selectedMetric,
  monitorStatus,
  searchText,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { isDarkMode } = useStoreState((state) => state.app);
  const { t } = useTranslation("global");

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

    const anyDown = monitors.some(
      (monitor) => !monitor.status && !monitor.paused
    );
    const anyPaused = monitors.some((monitor) => monitor.paused);
    if (anyDown) {
      return (
        <Chip
          label={t("dashboard.down")}
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
    } else if (anyPaused) {
      return (
        <Chip
          label={t("dashboard.paused")}
          color="secondary"
          size="medium"
          sx={{
            p: "5px 15px",
            "& .MuiChip-label": {
              color: "primary",
              fontWeight: 700,
            },
          }}
        />
      );
    } else {
      return (
        <Chip
          label={t("dashboard.up")}
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

    let uptime = 0;

    monitors.forEach((monitor) => {
      uptime = monitor.monitorStatusDashboard[selectedMetric] ?? 0;

      if (uptime >= 0) {
        totalUptime += uptime ?? 0;
        totalMonitors++;
      }
    });

    if (uptime < 0) {
      return "N/A";
    }
    let result = totalMonitors === 0 ? 0 : totalUptime / totalMonitors;
    return result.toFixed(2);
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

    const allRunning = monitors.every(
      (monitor) => monitor.paused || monitor.status
    );

    if (allRunning) {
      return (
        <Chip
          label={
            typeof calculateAverageUptime(monitorGroup.monitors) === "number"
              ? calculateAverageUptime(monitorGroup.monitors) + " %"
              : calculateAverageUptime(monitorGroup.monitors)
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
            typeof calculateAverageUptime(monitorGroup.monitors) === "number"
              ? calculateAverageUptime(monitorGroup.monitors) + " %"
              : calculateAverageUptime(monitorGroup.monitors)
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

  const filteredChildMonitors = monitorGroup.monitors.filter((childMonitor) => {
    const matchesSearchText = childMonitor.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    const matchesMonitorStatus =
      monitorStatus === "all" ||
      (monitorStatus === "up" && childMonitor.status) ||
      (monitorStatus === "down" && !childMonitor.status);

    return matchesSearchText && matchesMonitorStatus;
  });

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
                  {filteredChildMonitors
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((monitor) => (
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
                        onClick={() =>
                          handleChildRowClick(monitor.id, monitorGroupId)
                        }
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
                                (monitor.monitorStatusDashboard[
                                  selectedMetric
                                ] ?? 0) < 0
                                  ? "N/A"
                                  : (monitor.monitorStatusDashboard[
                                      selectedMetric
                                    ] ?? "N/A") + " %"
                              }
                              color={
                                monitor.paused
                                  ? "secondary"
                                  : !monitor.status
                                  ? "error"
                                  : "success"
                              }
                              size="medium"
                              sx={{
                                p: "5px 15px",
                                "& .MuiChip-label": {
                                  color: monitor.paused ? "primary" : "#fff",
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
                              color={
                                monitor.paused
                                  ? "secondary"
                                  : !monitor.status
                                  ? "error"
                                  : "success"
                              }
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
                          <Typography variant="body2">
                            {monitor.name}
                          </Typography>
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
                              monitor.monitorStatusDashboard[selectedMetric] ??
                                0,
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
