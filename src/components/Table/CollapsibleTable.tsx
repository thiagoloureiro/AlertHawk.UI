import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import CollapsibleTableRow from "./CollapsibleTableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../interfaces/IMonitorGroupListByUser";
import { showSnackbar } from "../../utils/snackbarHelper";
import { useStoreState } from "../../hooks";

interface ICollapsibleTable {
  monitors: IMonitorGroupListByUser[];
  searchText: string;
  monitorStatus: string;
  selectedRowIndex: number | null;
  selectedChildRowIndex: number | null;
  handleRowClick: (monitorId: number) => void;
  handleChildRowClick: (childMonitorId: number, monitorGroupId: number) => void;
  selectedMetric:
    | "uptime1Hr"
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months";
}

const CollapsibleTable: FC<ICollapsibleTable> = ({
  monitors,
  searchText,
  monitorStatus,
  handleRowClick,
  handleChildRowClick,
  selectedRowIndex,
  selectedChildRowIndex,
  selectedMetric,
}) => {
  const { t } = useTranslation("global");
  const { isMonitorLoading } = useStoreState((state) => state.app);

  const filteredMonitorGroups = monitors.filter((monitor) => {
    const trimmedSearchText = searchText.trim().toLowerCase();

    const parentMatchesSearchText = monitor.name
      .toLowerCase()
      .includes(trimmedSearchText);

    const filteredChildren = monitor.monitors.filter((childMonitor) =>
      childMonitor.name.toLowerCase().includes(trimmedSearchText)
    );

    const anyFilteredChildMatchesStatus = filteredChildren.some(
      (childMonitor) => {
        const statusMatches =
          monitorStatus === "all" ||
          (monitorStatus === "up" && childMonitor.status) ||
          (monitorStatus === "down" && !childMonitor.status);
        return statusMatches;
      }
    );

    if (trimmedSearchText === "") {
      return anyFilteredChildMatchesStatus;
    }

    return parentMatchesSearchText || anyFilteredChildMatchesStatus;
  });

  const [downServices, setDownServices] = useState<
    IMonitorGroupListByUserItem[]
  >([]);

  const [certificateExpirationList, setCertificateExpirationList] = useState<
    IMonitorGroupListByUserItem[]
  >([]);

  useEffect(() => {
    const downServices = monitors.flatMap((monitorGroup) =>
      monitorGroup.monitors.filter(
        (monitor) => !monitor.status && !monitor.paused
      )
    );
    const certificateExpirationList = monitors.flatMap((monitorGroup) =>
      monitorGroup.monitors
        .filter(
          (monitor) =>
            monitor.checkCertExpiry && monitor.daysToExpireCert <= 30 && monitor
        )
        .sort((a, b) => b.daysToExpireCert - a.daysToExpireCert)
    );
    setDownServices(downServices);
    setCertificateExpirationList(certificateExpirationList);
  }, [monitors]);

  useEffect(() => {
    downServices.forEach((service, index) => {
      setTimeout(() => {
        showSnackbar(
          `${t("dashboard.serviceDown")} - ${service.name}`,
          "error"
        );
      }, index * 500);
    });
  }, [downServices]);

  useEffect(() => {
    if (certificateExpirationList.length > 3) {
      certificateExpirationList.slice(0, 3).forEach((service, index) => {
        setTimeout(() => {
          showSnackbar(
            `${t("dashboard.certificateIsAboutToExpireFor")} ${service.name} [${
              service.daysToExpireCert
            } ${t("dashboard.days").toLowerCase()}]`,
            "warning"
          );
        }, index * 500);
      });
    } else {
      certificateExpirationList.forEach((service, index) => {
        setTimeout(() => {
          showSnackbar(
            `${t("dashboard.certificateIsAboutToExpireFor")} ${service.name} [${
              service.daysToExpireCert
            } ${t("dashboard.days").toLowerCase()}]`,
            "warning"
          );
        }, index * 500);
      });
    }
  }, [certificateExpirationList]);

  return isMonitorLoading ? (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 130px)",
      }}
    >
      <CircularProgress
        color="success"
        sx={{ position: "absolute", left: "50%" }}
      />
    </Box>
  ) : (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          minHeight:
            filteredMonitorGroups.length === 0 ? "calc(100vh - 130px)" : "",
        }}
      >
        <TableBody>
          {filteredMonitorGroups.length > 0 ? (
            filteredMonitorGroups
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((monitorGroup) => {
                const parentMatchesSearchText = monitorGroup.name
                  .toLowerCase()
                  .includes(searchText.trim().toLowerCase());

                return (
                  <CollapsibleTableRow
                    key={monitorGroup.id}
                    monitorGroup={monitorGroup}
                    monitorGroupId={monitorGroup.id}
                    isSelected={selectedRowIndex === monitorGroup.id}
                    selectedChildRowIndex={selectedChildRowIndex}
                    onRowClick={() => handleRowClick(monitorGroup.id)}
                    handleChildRowClick={handleChildRowClick}
                    selectedMetric={selectedMetric}
                    monitorStatus={monitorStatus}
                    searchText={searchText}
                    parentMatchesSearchText={parentMatchesSearchText}
                  />
                );
              })
          ) : (
            <TableRow>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", pb: "180px" }}
                >
                  {t("dashboard.noResultFoundFor")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
