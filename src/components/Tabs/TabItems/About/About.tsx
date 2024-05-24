import {
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import getTheme from "../../../../theme";
import { useStoreState } from "../../../../hooks";
import logo from "./logo.png";
import { useTranslation } from "react-i18next";
import MonitorService from "../../../../services/MonitorService";
import UserService from "../../../../services/UserService";
import MonitorHistoryService from "../../../../services/MonitorHistoryService";
import NotificationService from "../../../../services/NotificationService";

interface IAboutProps {}

const About: FC<IAboutProps> = () => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const theme = getTheme(isDarkMode ? "dark" : "light");
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [userCount, setUserCount] = useState<number>(0);
  const [monitorAgentsCount, setMonitorAgentsCount] = useState<number>(0);
  const [monitorHistoryCount, setMonitorHistoryCount] = useState<number>(0);
  const [notificationsSentCount, setNotificationsSentCount] =
    useState<number>(0);
  const [monitorItemCount, setMonitorItemCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getAboutData = async () => {
      try {
        const [
          monitorAgentsResponse,
          userCountResponse,
          monitorHistoryCountResponse,
          notificationCountResponse,
          monitorCountResponse,
        ] = await Promise.all([
          MonitorService.getMonitorAgents(),
          UserService.getUserCount(),
          MonitorHistoryService.getMonitorHistoryCount(),
          NotificationService.getNotificationCount(),
          MonitorService.getMonitorCount(),
        ]);
  
        setMonitorAgentsCount(monitorAgentsResponse.length);
        setUserCount(userCountResponse);
        setMonitorHistoryCount(monitorHistoryCountResponse);
        setNotificationsSentCount(notificationCountResponse);
        setMonitorItemCount(monitorCountResponse);
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
  
    getAboutData();
  }, []);
  

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="start"
      spacing={1}
      width="100%"
    >
      <Typography variant="h6" sx={{ pb: 2 }}>
        {t("about.text")}
      </Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        style={!isMediumScreen ? { width: "50%" } : { width: "100%" }}
      >
        <img src={logo} alt="logo" width="150px" />
        <Typography variant="h6" fontWeight={700}>
          AlertHawk
        </Typography>
        <Typography variant="subtitle2" fontSize={14}>
          Version {import.meta.env.VITE_APP_VERSION ?? "N/A"}
        </Typography>

        <Typography variant="subtitle2" fontSize={14}>
          {t("about.checkProjectOn")}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/thiagoloureiro/AlertHawk"
            style={{
              color: isDarkMode ? "#ffffff" : "#001e3c",
              fontWeight: 500,
            }}
          >
            Github
          </a>
        </Typography>
        <Typography variant="subtitle2" fontSize={14}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/thiagoloureiro/AlertHawk.UI/releases"
            style={{
              color: isDarkMode ? "#ffffff" : "#001e3c",
              fontWeight: 500,
            }}
          >
            Release Notes
          </a>
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="subtitle2" fontSize={14}>
              Items monitored: {monitorItemCount}
            </Typography>
            <Typography variant="subtitle2" fontSize={14}>
              User count: {userCount}
            </Typography>
            <Typography variant="subtitle2" fontSize={14}>
              Agent count: {monitorAgentsCount}
            </Typography>
            <Typography variant="subtitle2" fontSize={14}>
              History count: {monitorHistoryCount}
            </Typography>
            <Typography variant="subtitle2" fontSize={14}>
              Notifications Sent: {notificationsSentCount}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default About;
