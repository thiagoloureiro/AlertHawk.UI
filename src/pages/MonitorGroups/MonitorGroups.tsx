import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  Stack,
  OutlinedInput,
} from "@mui/material";
import { useStoreState } from "../../hooks";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import MonitorService from "../../services/MonitorService";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MonitorGroupsTable from "../../components/Table/MonitorGroupsTable";
import NotFoundContent from "../../components/NotFoundContent/NotFoundContent";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";

interface IMonitorGroupsProps { }

const MonitorGroups: FC<IMonitorGroupsProps> = () => {
  const { t } = useTranslation("global");
  const { user } = useStoreState((state) => state.user);
  const [searchText, setSearchText] = useState<string>("");
  const [monitorGroups, setMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
  const [selectedMonitorGroup, setSelectedMonitorGroup] = useState<IMonitorGroupListByUser | null>(null);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleMonitorGroupSelection = (monitorGroup: IMonitorGroupListByUser | null) => {
    setSelectedMonitorGroup(monitorGroup);
  };

  useEffect(() => {
    const fetchData = async () => {
      var response = await MonitorService.getMonitorGroupList();
      response = response.slice().sort((a, b) => {
        if (a.name! < b.name!) {
          return -1;
        }
        if (a.name! > b.name!) {
          return 1;
        }
        return 0;
      });
      setMonitorGroups(response);
    };

    if (monitorGroups.length == 0) {
      if (user?.isAdmin) {
        fetchData();
      } else {
        setMonitorGroups([]);
      }
    }
  }, [monitorGroups]);

  return (
    <>
      {!user?.isAdmin ? (
        <NotFoundContent />
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>AlertHawk | {t("monitorGroups.title")}</title>
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
                    <MonitorGroupsTable
                      monitorGroups={monitorGroups}
                      selectedMonitorGroup={selectedMonitorGroup}
                      searchText={searchText}
                      handleMonitorGroupSelection={handleMonitorGroupSelection}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default MonitorGroups;
