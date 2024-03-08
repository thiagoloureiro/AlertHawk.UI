import { Box, Tab, Tabs } from "@mui/material";
import { FC, useState } from "react";
import TabPanel from "./TabPanel";
import General from "./TabItems/General/General";
import About from "./TabItems/About/About";

interface IVerticalTabs {}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs: FC<IVerticalTabs> = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ width: "200px" }}
      >
        <Tab label="General" {...a11yProps(0)} />
        <Tab label="About" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <General />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <About />
      </TabPanel>
    </Box>
  );
};

export default VerticalTabs;
