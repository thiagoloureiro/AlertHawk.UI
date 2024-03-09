import {
  Drawer as MuiDrawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Hidden,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MonitorHeartOutlined as MonitorHeartOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  AddToQueueOutlined as AddToQueueOutlinedIcon,
  AddAlertOutlined as AddAlertOutlinedIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
} from "@mui/icons-material";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useStoreState } from "../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const drawerWidth = 340;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "15px 10px",
  ...theme.mixins.toolbar,
}));

interface IMenuItem {
  text: string;
  pathname: string;
  icon: React.ReactNode;
}

const Sidebar: FC<ISidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation("global");
  let location = useLocation();
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const { isDarkMode } = useStoreState((state) => state.app);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItem(
      menuItems.find((item) => item.pathname === location.pathname) ||
        secondMenuItems.find((item) => item.pathname === location.pathname) ||
        menuItems[0]
    );
  }, [location.pathname]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: IMenuItem
  ) => {
    event.preventDefault();
    setSelectedItem(item);
    navigate(item.pathname);
  };

  const menuItems: IMenuItem[] = [
    {
      text: t("sidebar.monitorList"),
      pathname: "/",
      icon: <MonitorHeartOutlinedIcon />,
    },
    {
      text: t("sidebar.monitorManagement"),
      pathname: "/monitor-management",
      icon: <AddToQueueOutlinedIcon />,
    },
    {
      text: t("sidebar.notificationManagement"),
      pathname: "/notification-management",
      icon: <AddAlertOutlinedIcon />,
    },
    {
      text: t("sidebar.monitorAlert"),
      pathname: "/monitor-alert",
      icon: <ErrorOutlineOutlinedIcon />,
    },
    {
      text: t("sidebar.users"),
      pathname: "/users",
      icon: <PeopleAltOutlinedIcon />,
    },
  ];

  const secondMenuItems: IMenuItem[] = [
    {
      text: t("settings.text"),
      pathname: "/settings",
      icon: <SettingsOutlinedIcon />,
    },
  ];

  return (
    <Drawer variant="permanent" open={isOpen}>
      <DrawerHeader>
        <Hidden smDown>
          <IconButton onClick={onToggle}>
            {!isOpen ? (
              <ChevronRightIcon sx={{ fill: isDarkMode ? "white" : "black" }} />
            ) : (
              <ChevronLeftIcon sx={{ fill: isDarkMode ? "white" : "black" }} />
            )}
          </IconButton>
        </Hidden>
      </DrawerHeader>
      <List sx={{ p: 0 }}>
        {menuItems.map((item, key) => (
          <ListItem key={key} disablePadding sx={{ display: "block" }}>
            {isOpen ? (
              <ListItemButton
                selected={location.pathname === item.pathname}
                onClick={() => navigate(item.pathname)}
                sx={{
                  minHeight: 55,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: isOpen ? 1 : 0,
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={item.text} placement="right" arrow>
                <ListItemButton
                  selected={selectedItem === item}
                  onClick={(event) => handleListItemClick(event, item)}
                  sx={{
                    minHeight: 55,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          p: 0,
          //   display: "flex",
          //   height: "100%",
        }}
      >
        {secondMenuItems.map((item, key) => (
          <ListItem key={key} disablePadding sx={{ display: "block" }}>
            {isOpen ? (
              <ListItemButton
                selected={location.pathname === item.pathname}
                onClick={() => navigate(item.pathname)}
                sx={{
                  minHeight: 55,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: isOpen ? 1 : 0,
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={item.text} placement="right" arrow>
                <ListItemButton
                  selected={selectedItem === item}
                  onClick={(event) => handleListItemClick(event, item)}
                  sx={{
                    minHeight: 55,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
