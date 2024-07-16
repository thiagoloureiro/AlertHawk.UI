import { Box, Tab, Tabs } from "@mui/material";
import { FC, useState } from "react";
import TabPanel from "./TabPanel";
import General from "./TabItems/General/General";
import About from "./TabItems/About/About";
import Account from "./TabItems/Account/Account";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../hooks";
import { useIsAuthenticated as useMsalIsAuthenticated } from "@azure/msal-react";

interface IVerticalTabs {}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs: FC<IVerticalTabs> = () => {
  const { isSmallScreen } = useStoreState((state) => state.app);
  const isMsalAuthenticated = useMsalIsAuthenticated();
  const { t } = useTranslation("global");
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  // Adjust index numbers based on authentication status
  const getIndexForTab = (index: number) => {
    if (isMsalAuthenticated) {
      if (index === 1)
        return 2; // Shift Account tab index to 2 if authenticated
      else if (index > 1) return index - 1; // Shift other tab indexes accordingly
    }
    return index; // Return original index for non-affected tabs
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", height: "100%" }}>
      {!isSmallScreen && (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ width: "200px" }}
        >
          <Tab
            label={t("settings.general.text")}
            {...a11yProps(getIndexForTab(0))}
          />
          {!isMsalAuthenticated && (
            <Tab label={t("account.text")} {...a11yProps(getIndexForTab(1))} />
          )}
          <Tab label={t("about.text")} {...a11yProps(getIndexForTab(2))} />
        </Tabs>
      )}

      <Box sx={{ width: "100%", marginLeft: isSmallScreen ? "0" : "16px" }}>
        <TabPanel value={value} index={getIndexForTab(0)}>
          <General />
        </TabPanel>
        {!isMsalAuthenticated && (
          <TabPanel value={value} index={getIndexForTab(1)}>
            <Account />
          </TabPanel>
        )}
        <TabPanel value={value} index={getIndexForTab(2)}>
          <About />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default VerticalTabs;
