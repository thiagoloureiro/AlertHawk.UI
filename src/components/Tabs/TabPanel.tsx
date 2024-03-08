import { Box } from "@mui/material";
import { FC } from "react";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<ITabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ px: 6, py: 1 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
