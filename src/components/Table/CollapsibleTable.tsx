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
  selectedRowIndex: number | null;
  selectedChildRowIndex: number | null;
  handleRowClick: (monitorId: number) => void;
  handleChildRowClick: (childMonitorId: number) => void;
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
  handleRowClick,
  handleChildRowClick,
  selectedRowIndex,
  selectedChildRowIndex,
  selectedMetric,
}) => {
  const { t } = useTranslation("global");
  const { isMonitorLoading } = useStoreState(
    (state) => state.app
  );
 
  const filteredMonitorGroups = monitors.filter(
    (monitor) =>
      monitor.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
      monitor.monitors.some((childMonitor) =>
        childMonitor.name
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      )
  );

  const [downServices, setDownServices] = useState<
    IMonitorGroupListByUserItem[]
  >([]);

  const [certificateExpirationList, setCertificateExpirationList] = useState<
    IMonitorGroupListByUserItem[]
  >([]);

  useEffect(() => {
    const downServices = monitors.flatMap((monitorGroup) =>
      monitorGroup.monitors.filter((monitor) => !monitor.status && !monitor.paused)
    );
    const certificateExpirationList = monitors.flatMap((monitorGroup) =>
      monitorGroup.monitors
        .filter(
          (monitor) =>
            monitor.urlToCheck?.startsWith("https") &&
            monitor.daysToExpireCert <= 30
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
            `${t("dashboard.certificateIsAboutToExpireFor")} ${service.name} [${service.daysToExpireCert
            } ${t("dashboard.days").toLowerCase()}]`,
            "warning"
          );
        }, index * 500);
      });
    } else {
      certificateExpirationList.forEach((service, index) => {
        setTimeout(() => {
          showSnackbar(
            `${t("dashboard.certificateIsAboutToExpireFor")} ${service.name} [${service.daysToExpireCert
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
              .map((monitorGroup) => (
                <CollapsibleTableRow
                  key={monitorGroup.id}
                  monitorGroup={monitorGroup}
                  isSelected={selectedRowIndex === monitorGroup.id}
                  selectedChildRowIndex={selectedChildRowIndex}
                  onRowClick={() => handleRowClick(monitorGroup.id)}
                  handleChildRowClick={handleChildRowClick}
                  selectedMetric={selectedMetric}
                />
              ))
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
