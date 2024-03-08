import { FC } from "react";
import { Button, Stack } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface IDashboardProps {}

const Dashboard: FC<IDashboardProps> = ({}) => {
  return (
    <Stack direction="row" spacing={3} height="100%">
      <Stack direction="column" alignItems="center">
        <div>
          <Button
            size="large"
            variant="contained"
            startIcon={<AddOutlinedIcon sx={{ color: "#fff" }} />}
            sx={{ color: "white" }}
          >
            Add New Monitor
          </Button>
        </div>
        <div></div>
      </Stack>
      <Stack direction="column" alignItems="center">
        <div></div>
        <div></div>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
