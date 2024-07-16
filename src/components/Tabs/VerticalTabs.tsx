import { Box, Tab, Tabs } from "@mui/material";
import { FC, useState } from "react";
import TabPanel from "./TabPanel";
import General from "./TabItems/General/General";
import About from "./TabItems/About/About";
import { useTranslation } from "react-i18next";
import { useStoreState } from "../../hooks";
import Account from "./TabItems/Account/Account";

interface IVerticalTabs {}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs: FC<IVerticalTabs> = () => {
  const { isSmallScreen } = useStoreState((state) => state.app);

  const { t } = useTranslation("global");
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <>
      {!isSmallScreen ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            height: "100%",
          }}
        >
          <Tabs
            orientation={"vertical"}
            variant="scrollable"
            value={value}
            onChange={handleChange}
            sx={{ width: "200px" }}
          >
            <Tab label={t("settings.general.text")} {...a11yProps(0)} />
            <Tab label={t("account.text")} {...a11yProps(1)} />
            <Tab label={t("about.text")} {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <General />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Account />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <About />
          </TabPanel>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label={t("settings.general.text")} {...a11yProps(0)} />
            <Tab label={t("account.text")} {...a11yProps(1)} />
            <Tab label={t("about.text")} {...a11yProps(2)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <General />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Account />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <About />
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default VerticalTabs;
