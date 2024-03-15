import { FC } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { IExtendedAgent } from "../MonitorManagement";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface ISelectedAgentDetailsProps {
  selectedAgentsPerContinent: IExtendedAgent[];
  selectedContinent: string;
}

const SelectedAgentDetails: FC<ISelectedAgentDetailsProps> = ({
  selectedAgentsPerContinent,
  selectedContinent,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" p={2}>
        Monitor Agents in
        {" " + selectedContinent}
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              {selectedAgentsPerContinent.length === 0 ? (
                "No monitors running in this region"
              ) : (
                <>
                  Total Number of Running Monitors:{" "}
                  {selectedAgentsPerContinent.reduce(
                    (total, agent) => total + agent.listTasks,
                    0
                  )}
                </>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {selectedAgentsPerContinent.length > 0 &&
        selectedAgentsPerContinent.map((agent, key) => (
          <Card key={key}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                  <b>Hostname: </b> {agent.hostname}
                </Typography>
                <Typography variant="body2">
                  <b>Number of Monitors: </b> {agent.listTasks}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <b>Master:</b>
                  </Typography>
                  {agent.isMaster ? (
                    <CheckCircleIcon sx={{ color: "success.main", ml: 1 }} />
                  ) : (
                    <CancelIcon sx={{ color: "error.main", ml: 1 }} />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};

export default SelectedAgentDetails;
