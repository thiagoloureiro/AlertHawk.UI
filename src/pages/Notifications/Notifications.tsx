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
import NotificationService from "../../services/NotificationService";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotFoundContent from "../../components/NotFoundContent/NotFoundContent";
import NotificationsTable from "../../components/Table/NotificationsTable";
import FromNotifications from "./Forms/FromNotifications";
import { IMonitorGroupListByUser } from "../../interfaces/IMonitorGroupListByUser";
import MonitorService from "../../services/MonitorService";

interface INotificationsProps { }

const Notifications: FC<INotificationsProps> = () => {
  const { t } = useTranslation("global");
  const { user } = useStoreState((state) => state.user);
  const [searchText, setSearchText] = useState<string>("");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false); // New state to track data fetching

  const [notificationTypes, setNotificationTypes] = useState<
    INotificationType[]
  >([]);
  const [selectedNotification, setSelectedNotification] =
    useState<INotification | null>(null);
  const [monitorGroupList, setMonitorGroupList] = useState<
    IMonitorGroupListByUser[]
  >([]);

  const [addPanel, setAddPanel] = useState<boolean>(false);
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    setAddPanel(false);
  }, []);
  useEffect(() => {
    if (addPanel == false && dataFetched) {
      fetchData();
    }
  }, [addPanel]);

  const handleNotificationSelection = (notification: INotification | null) => {
    setAddPanel(false);
    setTimeout(() => {
      setSelectedNotification(notification);
      setAddPanel(true);
    }, 100);
  };
  useEffect(() => {
    if (monitorGroupList.length === 0) {
      fillMonitorGroupList();
    }
  }, []);
  const fillMonitorGroupList = async () => {
    await MonitorService.getMonitorGroupListByUserToken().then((response) => {
      setMonitorGroupList(response);
    });
  };
  const handleAddNew = () => {
        setAddPanel(false);
    setSelectedNotification(null);
    setAddPanel(true);
  };
  const fetchData = async () => {
      var notificationResponse = await NotificationService.getAll();
      if (notificationResponse != null) {
        var notificationTypeResponse =
          await NotificationService.getNotificationTypes();
        setNotificationTypes(notificationTypeResponse);
        notificationResponse.forEach((notification: INotification) => {
          notification.notificationType = notificationTypeResponse.find(
            (notificationType: INotificationType) =>
              notificationType.id == notification.notificationTypeId
          )!;
        });
      }
      notificationResponse = notificationResponse.slice().sort((a, b) => {
        if (a.name! < b.name!) {
          return -1;
        }
        if (a.name! > b.name!) {
          return 1;
        }
        return 0;
      });
      setNotifications(notificationResponse);
      setDataFetched(true); // Set the data fetched flag to true
  };
  useEffect(() => {
    if (notifications.length == 0 && !dataFetched) { // Include the dataFetched check here
      if (user?.isAdmin) {
        fetchData();
      } else {
        setNotifications([]);
      }
    }
  }, [notifications, dataFetched, user?.isAdmin]);

  return (
    <>
      {!user?.isAdmin ? (
        <NotFoundContent />
      ) : (
        <>
          <HelmetProvider>
            <Helmet>
              <title>AlertHawk | {t("notifications.title")}</title>
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
                          placeholder={t("notifications.search")}
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
                          disabled={monitorGroupList.length === 0}
                          onClick={handleAddNew}
                        >
                          {t("notifications.addNew")}
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
                    <NotificationsTable
                      handleNotificationSelection={handleNotificationSelection}
                      notifications={notifications}
                      selectedNotification={selectedNotification}
                      searchText={searchText}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={7}>
              {addPanel && (
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
                      <FromNotifications
                        selectedNotification={selectedNotification}
                        setAddPanel={setAddPanel}
                        notificationTypes={notificationTypes}
                        monitorGroupList={monitorGroupList}
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

export default Notifications;
