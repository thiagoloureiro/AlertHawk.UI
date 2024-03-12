import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";
import CollapsibleTableRow from "./CollapsibleTableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";

interface ICollapsibleTable {
  monitors: IMonitorGroupListByUser[];
  searchText: string;
  selectedRowIndex: number | null;
  selectedChildRowIndex: number | null;
  handleRowClick: (monitorId: number) => void;
  handleChildRowClick: (childMonitorId: number) => void;
}

const CollapsibleTable: FC<ICollapsibleTable> = ({
  monitors,
  searchText,
  handleRowClick,
  handleChildRowClick,
  selectedRowIndex,
  selectedChildRowIndex,
}) => {
  const { t } = useTranslation("global");

  const filteredMonitorGroups = monitors.filter((monitor) =>
    monitor.name.toLowerCase().includes(searchText.trim().toLowerCase())
  );

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
              .map((monitorGroup, index) => (
                <CollapsibleTableRow
                  key={monitorGroup.id}
                  monitorGroup={monitorGroup}
                  isSelected={selectedRowIndex === index}
                  selectedChildRowIndex={selectedChildRowIndex}
                  onRowClick={() => handleRowClick(index)}
                  handleChildRowClick={handleChildRowClick}
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
