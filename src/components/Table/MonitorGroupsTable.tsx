import {
  Card,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import MonitorGroupsTableRow from "./MonitorGroupsTableRow";
import { ChangeEvent, FC, useEffect, useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";

interface IMonitorGroupsTableProps {
  monitorGroups: IMonitorGroupListByUser[];
  searchText: string;
  selectedMonitorGroup: IMonitorGroupListByUser | null;
  handleMonitorGroupSelection: (monitorGroup: IMonitorGroupListByUser | null) => void;
}

interface IHeaderCell {
  id: string;
  label: string;
  width?: string;
  sortable: boolean;
  align?: "left" | "center" | "right" | "justify" | "inherit";
}

const MonitorGroupsTable: FC<IMonitorGroupsTableProps> = ({
  monitorGroups,
  searchText,
  selectedMonitorGroup,
  handleMonitorGroupSelection,
}) => {
  const { t } = useTranslation("global");

  const [maxRowNumber, setMaxRowNumber] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredMonitorGroups, setfilteredMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);

  useEffect(() => {
    const calculateMaxRowNumber = () => {
      const windowHeight = window.innerHeight;
      const rowHeight = 84;
      const maxRows = Math.floor((windowHeight - 400) / rowHeight);
      setMaxRowNumber(maxRows);
    };

    calculateMaxRowNumber();
    window.addEventListener("resize", calculateMaxRowNumber);

    return () => {
      window.removeEventListener("resize", calculateMaxRowNumber);
    };
  }, []);

  const headerCells: readonly IHeaderCell[] = [
    {
      id: "Name",
      label: t("monitorGroups.name"),
      sortable: false,
      width: "70%",
      align: "left",
    }

  ];

  const handleChangePage = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = monitorGroups.filter(
      (monitorGroup) =>
        monitorGroup.name
          ?.toLowerCase()
          .includes(searchText.trim().toLowerCase())
    );


    const newPageCount = Math.ceil(filtered.length / maxRowNumber);

    if (currentPage !== 1 && currentPage > newPageCount) {
      setCurrentPage(newPageCount);
    }

    setfilteredMonitorGroups(filtered);
  }, [monitorGroups, searchText]);

  return (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          minHeight:
            filteredMonitorGroups.length === 0 ? "calc(100vh - 400px)" : "unset",
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              height: 49,
            }}
          >
            {headerCells.map((headerCell: IHeaderCell) => (
              <TableCell
                key={headerCell.id}
                align={headerCell.align}
                style={{ width: headerCell.width ?? "auto" }}
              >
                {headerCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMonitorGroups.length > 0 ? (
            filteredMonitorGroups.map((monitorGroup, key) => {
              if (
                key >= maxRowNumber * (currentPage - 1) &&
                key < maxRowNumber * currentPage
              ) {
                return (
                  <MonitorGroupsTableRow
                    key={key}
                    monitorGroup={monitorGroup}
                    selectedGroup={selectedMonitorGroup}
                    handleMonitorGroupSelection={handleMonitorGroupSelection}
                  />
                );
              }
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headerCells.length} align="center">
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {t("monitorGroups.noResultFoundFor")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      { }
      <Pagination
        sx={{
          width: "100%",
          height: 72,
          display: "flex",
          justifyContent: "center",
        }}
        count={
          filteredMonitorGroups.length === 0
            ? 1
            : filteredMonitorGroups.length % maxRowNumber === 0
              ? filteredMonitorGroups.length / maxRowNumber
              : Math.ceil(filteredMonitorGroups.length / maxRowNumber)
        }
        defaultPage={1}
        page={currentPage}
        onChange={handleChangePage}
        siblingCount={0}
        showFirstButton
        showLastButton
      />
    </TableContainer>
  );
};

export default MonitorGroupsTable;
