import {
  Card,
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

interface ICollapsibleTable {
  monitors: IMonitorGroupListByUser[];
  searchText: string;
  selectedRowIndex: number | null;
  selectedChildRowIndex: number | null;
  handleRowClick: (monitorId: number) => void;
  handleChildRowClick: (childMonitorId: number) => void;
  selectedMetric:
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

  const filteredMonitorGroups = monitors.filter((monitor) =>
    monitor.name.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const [downServices, setDownServices] = useState<
    IMonitorGroupListByUserItem[]
  >([]);

  useEffect(() => {
    const downServices = monitors.flatMap((monitorGroup) =>
      monitorGroup.monitors.filter((monitor) => !monitor.status)
    );
    setDownServices(downServices);
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

  return (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
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
                <Typography variant="body2" sx={{ textAlign: "center" }}>
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
