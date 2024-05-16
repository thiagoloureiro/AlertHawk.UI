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
import { Environment } from "../../enums/Enums";
import MonitorAlertsTableRow from "./MonitorAlertsTableRow";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { IMonitorAlerts } from "../../interfaces/IMonitorAlerts";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

interface IMonitorAlertsTableTableProps {
  monitorAlerts: IMonitorAlerts[];
  searchText: string;
}

interface IHeaderCell {
  id: string;
  label: string;
  width?: string;
  sortable: boolean;
  align?: "left" | "center" | "right" | "justify" | "inherit";
}

const MonitorAlertsTable: FC<IMonitorAlertsTableTableProps> = ({
  monitorAlerts,
  searchText
}) => {
  const { t } = useTranslation("global");

  const [maxRowNumber, setMaxRowNumber] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredMonitorAlerts, setfilteredMonitorAlerts] = useState<IMonitorAlerts[]>([]);

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
      id: "timeStamp",
      label: t("monitorAlerts.timeStamp"),
      sortable: false,
      width: "20%",
    },
    {
      id: "monitorName",
      label: t("monitorAlerts.monitorName"),
      sortable: true,
      width: "20%",
    },
    {
      id: "monitorEnvironment",
      label: t("dashboard.environment"),
      sortable: true,
      width: "20%",
    },
    {
      id: "monitorMessage",
      label: t("monitorAlerts.message"),
      sortable: true,
      width: "20%",
    },
    {
      id: "screenshot",
      label: t("monitorAlerts.screenshot"),
      width: "20%",
      sortable: true,
    }
  ];

  const handleChangePage = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = monitorAlerts.filter((monitorAlert) => {
      const searchTextLower = searchText.trim().toLowerCase();
      const environmentString = Environment[monitorAlert.environment];

      return (
        monitorAlert.monitorName?.toLowerCase().includes(searchTextLower) ||
        monitorAlert.message.toLowerCase().includes(searchTextLower) ||
        (environmentString && environmentString.toLowerCase().includes(searchTextLower))
      );
    });



    const newPageCount = Math.ceil(filtered.length / maxRowNumber);

    if (currentPage !== 1 && currentPage > newPageCount) {
      setCurrentPage(newPageCount);
    }

    setfilteredMonitorAlerts(filtered);
  }, [monitorAlerts, searchText]);

  return (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          minHeight:
            filteredMonitorAlerts.length === 0 ? "calc(100vh - 400px)" : "unset",
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
              >
                {headerCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMonitorAlerts.length > 0 ? (
            filteredMonitorAlerts.map((monitorAlert, key) => {
              if (
                key >= maxRowNumber * (currentPage - 1) &&
                key < maxRowNumber * currentPage
              ) {
                return (
                  <MonitorAlertsTableRow
                    key={key}
                    monitorAlert={monitorAlert}
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
          filteredMonitorAlerts.length === 0
            ? 1
            : filteredMonitorAlerts.length % maxRowNumber === 0
              ? filteredMonitorAlerts.length / maxRowNumber
              : Math.ceil(filteredMonitorAlerts.length / maxRowNumber)
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

export default MonitorAlertsTable;
