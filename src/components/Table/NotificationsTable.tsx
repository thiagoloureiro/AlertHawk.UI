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
import { ChangeEvent, FC, useEffect, useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import NotificationTableRow from "./NotificationTableRow";

interface INotificationTableProps {
  searchText: string;
  notifications: INotification[];
  selectedNotification: INotification | null;
  handleNotificationSelection: (mnotification: INotification | null) => void;
}

interface IHeaderCell {
  id: string;
  label: string;
  width?: string;
  sortable: boolean;
  align?: "left" | "center" | "right" | "justify" | "inherit";
}

const NotificationsTable: FC<INotificationTableProps> = ({
  searchText,
  notifications,
  selectedNotification,
  handleNotificationSelection
}) => {
  const { t } = useTranslation("global");

  const [maxRowNumber, setMaxRowNumber] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredNotifications, setfilteredNotifications] = useState<INotification[]>([]);

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
      label: t("notifications.name"),
      sortable: false,
      align: "left",
    },
    {
      id: "tYPE",
      label: t("notifications.type"),
      sortable: false,
      align: "left",
    }

  ];

  const handleChangePage = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = notifications.filter(
      (notifications) =>
        notifications.name
          ?.toLowerCase()
          .includes(searchText.trim().toLowerCase())
    );


    const newPageCount = Math.ceil(filtered.length / maxRowNumber);

    if (currentPage !== 1 && currentPage > newPageCount) {
      setCurrentPage(newPageCount);
    }

    setfilteredNotifications(filtered);
  }, [notifications, searchText]);

  return (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          minHeight:
            filteredNotifications.length === 0 ? "calc(100vh - 400px)" : "unset",
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, key) => {
              if (
                key >= maxRowNumber * (currentPage - 1) &&
                key < maxRowNumber * currentPage
              ) {
                return (
                  <NotificationTableRow
                    key={key}
                    notification={notification}
                    selectedNotification={selectedNotification}
                    handleNotificationSelection={handleNotificationSelection}
                  />
                );
              }
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headerCells.length} align="center">
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                {t("dashboard.noResultFoundFor")}
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
          filteredNotifications.length === 0
            ? 1
            : filteredNotifications.length % maxRowNumber === 0
              ? filteredNotifications.length / maxRowNumber
              : Math.ceil(filteredNotifications.length / maxRowNumber)
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

export default NotificationsTable;
