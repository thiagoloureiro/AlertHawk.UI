import { FC, useState } from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Hidden,
  Tooltip,
} from "@mui/material";
import { CustomSwitch } from "../Icons/MaterialUISwitch";
import { useStoreActions, useStoreState } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { Logout, Settings } from "@mui/icons-material";
import logo from "./logo.png";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";

interface IHeaderProps {
  title: string;
  isOpen: boolean;
}

const Header: FC<IHeaderProps> = ({ title, isOpen }) => {
  const { t } = useTranslation("global");
  const isAuthenticated: boolean = useIsAuthenticated();
  const { isDarkMode, isSmallScreen } = useStoreState((state) => state.app);
  const { stats } = useStoreState((state) => state.monitor);
  const { setIsDarkMode } = useStoreActions((action) => action.app);
  const theme = useTheme();
  const { user } = useStoreState((actions) => actions.user);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px",
          px: 2,
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: isDarkMode
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <div
            style={
              isAuthenticated && isOpen
                ? { marginRight: "330px" }
                : isAuthenticated && !isOpen
                ? { marginRight: "80px" }
                : {}
            }
          ></div>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <img src={logo} alt="logo" width={isSmallScreen ? 50 : 70} />
            <Typography
              variant={isSmallScreen ? "h6" : "h5"}
              fontWeight={700}
              style={{
                color: isDarkMode
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              }}
            >
              {title}
            </Typography>
          </Link>
        </Box>
        {isAuthenticated && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={6}
            sx={{ userSelect: "none" }}
          >
            <Tooltip title="Up" placement="bottom" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="success.main"
                  component="div"
                  fontWeight={700}
                >
                  {stats.monitorUp}
                </Typography>
                <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
              </Box>
            </Tooltip>
            <Tooltip title="Down" placement="bottom" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="error.main"
                  component="div"
                  fontWeight={700}
                >
                  {stats.monitorDown}
                </Typography>
                <CancelIcon sx={{ color: "error.main", fontSize: 28 }} />
              </Box>
            </Tooltip>
            <Tooltip title="Paused" placement="bottom" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  component="div"
                  fontWeight={700}
                >
                  {stats.monitorPaused}
                </Typography>
                <PauseCircleFilledIcon sx={{ fontSize: 28 }} />
              </Box>
            </Tooltip>
          </Stack>
        )}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Hidden smDown>
            <CustomSwitch checked={isDarkMode} onChange={toggleDarkTheme} />
          </Hidden>
          {isAuthenticated && (
            <Avatar
              onClick={handleClick}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {user?.username
                ?.split(" ")
                .slice(0, 2)
                .map((name) => name.charAt(0))
                .join("")
                .toUpperCase() ||
                user?.email?.split(".")[0].charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Stack>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 250,
            borderRadius: 3,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ px: 2, pt: 0.5, pb: 1, userSelect: "none" }}
        >
          <Avatar
            onClick={handleClick}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {user?.username
              ?.split(" ")
              .slice(0, 2)
              .map((name) => name.charAt(0))
              .join("")
              .toUpperCase() ||
              user?.email?.split(".")[0].charAt(0).toUpperCase()}
          </Avatar>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="start"
            spacing={0}
          >
            <Typography variant="h6" fontWeight={700} fontSize={20}>
              {user?.username || user?.email}
            </Typography>
            <Typography variant="body1" fontWeight={400}>
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <MenuItem
          onClick={() => {
            navigate("/settings");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Settings
              fontSize="small"
              sx={{ fill: isDarkMode ? "white" : "black" }}
            />
          </ListItemIcon>
          {t("settings.text")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout
              fontSize="small"
              sx={{ fill: isDarkMode ? "white" : "black" }}
            />
          </ListItemIcon>
          {t("header.logout")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
