import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  Stack,
  OutlinedInput,
  Button,
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
import FromMonitorGroup from "./Forms/FromMonitorGroup";

interface IMonitorGroupsProps { }

const MonitorGroups: FC<IMonitorGroupsProps> = () => {
  const { t } = useTranslation("global");
  const { user } = useStoreState((state) => state.user);
  const [searchText, setSearchText] = useState<string>("");
  const [monitorGroups, setMonitorGroups] = useState<IMonitorGroupListByUser[]>([]);
  const [selectedMonitorGroup, setSelectedMonitorGroup] = useState<IMonitorGroupListByUser | null>(null);
  const [addMonitorPanel, setAddMonitorPanel] = useState<boolean>(false);
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    setAddMonitorPanel(false);
  }, []);
  useEffect(() => {
    if(addMonitorPanel == false){
      //fetchData();
    }
  }, [addMonitorPanel]);
  
  const handleMonitorGroupSelection = (monitorGroup: IMonitorGroupListByUser | null) => {
    setAddMonitorPanel(false);
    setSelectedMonitorGroup(monitorGroup);
    setAddMonitorPanel(true);

  };

  function handleAddNew(): void {
    setAddMonitorPanel(false);
    setSelectedMonitorGroup(null);
    setAddMonitorPanel(true);
  }
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

  const fetchUserData = async () => {
    var response = await MonitorService.getMonitorGroupListByUserToken();
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
  useEffect(() => {
    
    if (monitorGroups.length == 0) {
      if (user?.isAdmin) {
        fetchData();
      } else {
        fetchUserData();
       // setMonitorGroups([]);
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
                    <div style={{ width: "75%", minWidth: "200px" }}>
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
                    <div>
                      <FormControl fullWidth>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          sx={{
                            mb: 2,
                            mt: 2,
                            ml: 2,
                            color: "white",
                            minWidth: "110px",
                            fontWeight: 700,
                            position: "relative",
                          }}
                        onClick={handleAddNew}
                        >
                          {t("dashboard.addNew")}
                        </Button>
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
            <Grid item xs={12} lg={7}>
            {addMonitorPanel && (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 210px)",
                    paddingRight: "16px",
                    "&::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "&::-webkit-scrollbar-track": {
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "secondary.main",
                      outline: "1px solid secondary.main",
                      borderRadius: "30px",
                    },
                  }}
                >
                  <FromMonitorGroup setAddMonitorPanel={setAddMonitorPanel} selectedMonitorGroup={selectedMonitorGroup}/>
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

export default MonitorGroups;
