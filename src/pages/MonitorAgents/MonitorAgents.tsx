import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Continents from "@react-map/continents";
import { IAgent } from "../../interfaces/IAgent";
import { useStoreState } from "../../hooks";
import { getContinentName } from "../../utils/continentHelper";
import SelectedAgentDetails from "./Items/SelectedAgentDetails";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export interface IExtendedAgent extends IAgent {
  name: string;
}

interface IMonitorAgentsProps {}

const MonitorAgents: FC<IMonitorAgentsProps> = () => {
  const { t } = useTranslation("global");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null
  );
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );
  const { agents } = useStoreState((state) => state.monitor);
  const { isSidebarOpen } = useStoreState((state) => state.app);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [extendedAgents, setExtendedAgents] = useState<IExtendedAgent[]>([]);
  const cardItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (cardItemRef.current) {
        setContainerWidth(cardItemRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (cardItemRef.current) {
      setContainerWidth(cardItemRef.current.offsetWidth);
    }
  }, [containerWidth]);

  const adjustViewBox = () => {
    const svg = document.getElementById("svg2");
    if (svg) {
      svg.setAttribute("viewBox", `0 0 1000 700`);
    }
  };

  useEffect(() => {
    adjustViewBox();
  }, [containerWidth]);

  useEffect(() => {
    let filteredAgents = [...agents];
    if (selectedContinent !== null) {
      filteredAgents = agents.filter((agent) => {
        const continentName = getContinentName(agent.monitorRegion);
        return continentName === selectedContinent;
      });
    }

    const extendedAgentsData = filteredAgents.map((agent) => ({
      ...agent,
      name: getContinentName(agent.monitorRegion),
    }));

    setExtendedAgents(extendedAgentsData);
  }, [agents, selectedContinent]);

  useEffect(() => {
    const svg = document.getElementById("svg2");
    if (svg) {
      const regionTasksMap: { [key: string]: number } = {};

      extendedAgents.forEach((agent) => {
        const region = agent.name;
        if (regionTasksMap[region]) {
          regionTasksMap[region] += agent.listTasks;
        } else {
          regionTasksMap[region] = agent.listTasks;
        }
      });

      Object.keys(regionTasksMap).forEach((region) => {
        let cx = "";
        let cy = "";
        if (region.includes("Custom")) {
          return;
        }
        if (region === "Africa") {
          cx = "52%";
          cy = "60%";
        } else if (region === "Asia") {
          cx = "77%";
          cy = "40%";
        } else if (region === "Europe") {
          cx = "55%";
          cy = "40%";
        } else if (region === "North America") {
          cx = "20%";
          cy = "45%";
        } else if (region === "Latin America") {
          cx = "32%";
          cy = "72%";
        } else if (region === "Oceania") {
          cx = "85%";
          cy = "76%";
        }
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", "30");
        circle.setAttribute("stroke", "#001e3c");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("fill", "#001e3c");
        circle.setAttribute("pointer-events", "none");
        svg.appendChild(circle);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", cx);
        text.setAttribute("y", cy);
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("stroke", "white");
        text.setAttribute("stroke-width", "1px");
        text.setAttribute("pointer-events", "none");
        text.textContent = regionTasksMap[region].toString();
        svg.appendChild(text);
      });
    }
  }, [extendedAgents]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("monitorAgents.text")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={isSidebarOpen ? 6 : 5}>
          <Card ref={cardItemRef}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Continents
                  onSelect={(e) => {
                    if (e === "Australia and Oceania") {
                      setSelectedContinent("Oceania");
                    } else {
                      setSelectedContinent(e);
                    }
                  }}
                  hoverColor="#FFFF00"
                  mapColor={"#00bcd4"}
                  size={containerWidth}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={isSidebarOpen ? 6 : 7}>
          {selectedContinent === null ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5" p={2}>
                {t("monitorAgents.text")}
              </Typography>
              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="body1">
                      {agents.length === 0 ? (
                        "No monitor agents found"
                      ) : (
                        <b>
                          {t("monitorAgents.totalNumberOfMonitorAgents")}:{" "}
                          {agents.length}
                        </b>
                      )}
                    </Typography>
                    <Typography variant="body1">
                      {agents.length === 0 ? (
                        "No monitor agents found"
                      ) : (
                        <>
                          <b>
                            {t("monitorAgents.totalNumberofRunningMonitors")}:
                          </b>{" "}
                          {agents.reduce(
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
                  maxHeight: "calc(50vh)",
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
                {agents.length > 0 &&
                  agents.map((agent, index) => (
                    <Card
                      key={index}
                      sx={{ my: 2 }}
                      onMouseOver={() => setHoveredCard(index)}
                      onMouseOut={() => setHoveredCard(null)}
                      raised={hoveredCard === index}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Typography variant="body2">
                            <b>{t("monitorAgents.hostname")}: </b>{" "}
                            {agent.hostname}
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
                              <CheckCircleIcon
                                sx={{ color: "success.main", ml: 1 }}
                              />
                            ) : (
                              <CancelIcon
                                sx={{ color: "secondary.light", ml: 1 }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2">
                            <b>{t("monitorAgents.location")}: </b>{" "}
                            {getContinentName(agent.monitorRegion)}
                          </Typography>
                          <Typography variant="body2">
                            <b>{t("monitorAgents.version")}: </b>{" "}
                            {agent.version}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Box>
          ) : (
            <SelectedAgentDetails
              selectedContinent={selectedContinent}
              setSelectedContinent={setSelectedContinent}
              selectedAgentsPerContinent={extendedAgents}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MonitorAgents;
