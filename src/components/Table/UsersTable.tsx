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
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IUser } from "../../interfaces/IUser";
import UsersTableRow from "./UsersTableRow";

interface IUsersTableProps {
  users: IUser[];
  searchText: string;
  selectedRole: "all" | "admin" | "non-admin";
  selectedUser: IUser | null;
  handleUserSelection: (user: IUser | null) => void;
}

interface IHeaderCell {
  id: string;
  label: string;
  width?: string;
  sortable: boolean;
  align?: "left" | "center" | "right" | "justify" | "inherit";
}

const UsersTable: FC<IUsersTableProps> = ({
  users,
  searchText,
  selectedRole,
  selectedUser,
  handleUserSelection,
}) => {
  const { t } = useTranslation("global");

  const [maxRowNumber, setMaxRowNumber] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

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
      id: "userName",
      label: t("users.userName"),
      sortable: false,
      width: "70%",
      align: "left",
    },
    {
      id: "isAdmin",
      label: t("users.isAdmin"),
      sortable: true,
      width: "30%",
      align: "right",
    },
  ];

  const handleChangePage = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username
          ?.toLowerCase()
          .includes(searchText.trim().toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.trim().toLowerCase())
    );

    let filteredUsers;
    if (selectedRole !== "all") {
      filteredUsers =
        selectedRole === "admin"
          ? filtered.filter((user) => user.isAdmin)
          : filtered.filter((user) => !user.isAdmin);
    } else {
      filteredUsers = filtered;
    }

    const newPageCount = Math.ceil(filteredUsers.length / maxRowNumber);

    if (currentPage > newPageCount) {
      setCurrentPage(newPageCount);
    }

    setFilteredUsers(filteredUsers);
  }, [users, searchText, selectedRole]);

  return (
    <TableContainer component={Card}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          minHeight:
            filteredUsers.length === 0 ? "calc(100vh - 400px)" : "unset",
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, key) => {
              if (
                key >= maxRowNumber * (currentPage - 1) &&
                key < maxRowNumber * currentPage
              ) {
                return (
                  <UsersTableRow
                    key={key}
                    user={user}
                    selectedUser={selectedUser}
                    handleUserSelection={handleUserSelection}
                  />
                );
              }
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headerCells.length} align="center">
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {t("users.noResultFoundFor")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {}
      <Pagination
        sx={{
          width: "100%",
          height: 72,
          display: "flex",
          justifyContent: "center",
          //   borderTop: "1px solid #EBEBEB",
          //   "& .Mui-selected": {
          //     borderRadius: 0,
          //     fontSize: 14,
          //     background: "white !important",
          //     borderBottom: "1px solid red",
          //   },
        }}
        count={
          filteredUsers.length === 0
            ? 1
            : filteredUsers.length % maxRowNumber === 0
            ? filteredUsers.length / maxRowNumber
            : Math.ceil(filteredUsers.length / maxRowNumber)
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

export default UsersTable;
