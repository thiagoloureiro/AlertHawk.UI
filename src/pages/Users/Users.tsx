import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Stack,
  OutlinedInput,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../hooks";
import { Helmet, HelmetProvider } from "react-helmet-async";
import UserService from "../../services/UserService";
import NotFoundContent from "../../components/NotFoundContent/NotFoundContent";
import { IUser } from "../../interfaces/IUser";
import UsersTable from "../../components/Table/UsersTable";
import UserDetail from "./UserDetail";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

interface IUsersProps {}

const Users: FC<IUsersProps> = () => {
  const { t } = useTranslation("global");
  const [users, setUsers] = useState<IUser[]>([]);
  const { user } = useStoreState((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleUserSelection = (user: IUser | null) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      var response = await UserService.getAll();
      response = response.slice().sort((a, b) => {
        if (a.username! < b.username!) {
          return -1;
        }
        if (a.username! > b.username!) {
          return 1;
        }
        return 0;
      });
      setUsers(response);
    };
    if (users.length == 0) {
      if (user?.isAdmin) {
        fetchData();
      } else {
        setUsers([]);
      }
    }
  }, [users]);

  const [selectedRole, setSelectedRole] = useState<
    "all" | "admin" | "non-admin"
  >("all");

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as "all" | "admin" | "non-admin");
  };

  return (
    <>
      {!user?.isAdmin ? (
        <NotFoundContent />
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>AlertHawk | {t("users.text")}</title>
            </Helmet>
          </HelmetProvider>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={5}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={4}
                  >
                    <div style={{ width: "25%", minWidth: "100px" }}>
                      <FormControl fullWidth>
                        <InputLabel id="role-select">Role</InputLabel>
                        <Select
                          labelId="role-select"
                          id="role-select-dropdown"
                          value={selectedRole}
                          label="Role"
                          onChange={handleRoleChange}
                          size="small"
                        >
                          <MenuItem value={"all"}>All</MenuItem>
                          <MenuItem value={"admin"}>Admin</MenuItem>
                          <MenuItem value={"non-admin"}>Non-admin</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl fullWidth>
                        <OutlinedInput
                          size="small"
                          startAdornment={<SearchOutlinedIcon />}
                          value={searchText}
                          onChange={handleSearchInputChange}
                          placeholder={t("dashboard.search")}
                        />
                      </FormControl>
                    </div>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <UsersTable
                      users={users}
                      searchText={searchText}
                      selectedRole={selectedRole}
                      selectedUser={selectedUser}
                      handleUserSelection={handleUserSelection}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={7}>
              {selectedUser !== null && (
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UserDetail
                        user={selectedUser}
                        handleUserSelection={handleUserSelection}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Users;
