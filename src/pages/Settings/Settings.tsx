import { FC } from "react";
import VerticalTabs from "../../components/Tabs/VerticalTabs";
import { Box } from "@mui/material";

interface ISettingsProps {}

const Settings: FC<ISettingsProps> = () => {
  return (
    <Box>
      <VerticalTabs />
    </Box>
  );
};

export default Settings;
