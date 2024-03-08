import { Stack, Typography, useMediaQuery } from "@mui/material";
import { FC } from "react";
import getTheme from "../../../../theme";
import { useStoreState } from "../../../../hooks";
import logo from "./logo.png";
import { useTranslation } from "react-i18next";

interface IAboutProps {}

const About: FC<IAboutProps> = () => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const theme = getTheme(isDarkMode ? "dark" : "light");
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

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
      </Stack>
    </Stack>
  );
};

export default About;
