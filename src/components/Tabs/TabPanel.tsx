import { Box } from "@mui/material";
import { FC } from "react";
import { useStoreState } from "../../hooks";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<ITabPanelProps> = ({ children, value, index, ...other }) => {
  const { isSmallScreen } = useStoreState((state) => state.app);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: isSmallScreen ? 1 : 6, py: isSmallScreen ? 2 : 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
