import { FC, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { IExtendedAgent } from "../MonitorManagement";

interface ISelectedAgentDetailsProps {
  selectedAgentsPerContinent: IExtendedAgent[];
  selectedContinent: string;
}

const SelectedAgentDetails: FC<ISelectedAgentDetailsProps> = ({
  selectedAgentsPerContinent,
  selectedContinent,
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" p={2}>
        Monitor Agents in {" " + selectedContinent}
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              {selectedAgentsPerContinent.length === 0 ? (
                "No monitors running in this region"
              ) : (
                <>
                  <b>Total Number of Running Monitors:</b>{" "}
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
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "calc(60vh)",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "secondary.main",
            outline: "1px solid secondary.main",
            borderRadius: "30px",
          },
        }}
      >
        {selectedAgentsPerContinent.map((agent, index) => (
          <Card
            key={index}
            sx={{ my: 2 }}
            onMouseOver={() => setHoveredCard(index)}
            onMouseOut={() => setHoveredCard(null)}
            raised={hoveredCard === index}
          >
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
    </Box>
  );
};

export default SelectedAgentDetails;
