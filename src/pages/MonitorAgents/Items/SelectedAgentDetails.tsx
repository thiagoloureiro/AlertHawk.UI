import { FC, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { IExtendedAgent } from "../MonitorAgents";
import { useTranslation } from "react-i18next";

interface ISelectedAgentDetailsProps {
  selectedAgentsPerContinent: IExtendedAgent[];
  selectedContinent: string;
  setSelectedContinent: (val: string | null) => void;
}

const SelectedAgentDetails: FC<ISelectedAgentDetailsProps> = ({
  selectedAgentsPerContinent,
  selectedContinent,
  setSelectedContinent,
}) => {
  const { t } = useTranslation("global");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "11px",
          pb: 1,
          px: 2,
        }}
      >
        <Typography variant="h5">
          {t(`monitorAgents.monitorAgentsIn${selectedContinent}`)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectedContinent(null)}
          sx={{ color: "#fff" }}
        >
          {t("general.goBack")}
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              {selectedAgentsPerContinent.length === 0 ? (
                "No monitors running in this region"
              ) : (
                <>
                  <b>{t("monitorAgents.totalNumberofRunningMonitors")}:</b>{" "}
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
                  <b>{t("monitorAgents.hostname")}: </b> {agent.hostname}
                </Typography>
                <Typography variant="body2">
                  <b>{t("monitorAgents.numberOfMonitors")}: </b>{" "}
                  {agent.listTasks}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <b>{t("monitorAgents.master")}:</b>
                  </Typography>
                  {agent.isMaster ? (
                    <CheckCircleIcon sx={{ color: "success.main", ml: 1 }} />
                  ) : (
                    <CancelIcon sx={{ color: "secondary.light", ml: 1 }} />
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
