import { FC, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useStoreState } from "../../hooks";
import { IMonitorGroupListByUserItem } from "../../interfaces/IMonitorGroupListByUser";
import SearchIcon from "@mui/icons-material/Search";

// Extended monitor type
interface IExtendedMonitorItem extends IMonitorGroupListByUserItem {
  groupName: string;
  groupId: number;
  url: string | undefined;
}

const MonitorChartsList: FC = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { monitorGroupListByUser } = useStoreState((state) => state.monitor);
  const [monitors, setMonitors] = useState<IExtendedMonitorItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [filteredMonitors, setFilteredMonitors] = useState<IExtendedMonitorItem[]>([]);

  useEffect(() => {
    const allMonitors: IExtendedMonitorItem[] = monitorGroupListByUser.reduce((acc: IExtendedMonitorItem[], group) => {
      const monitorsInGroup = group.monitors.map(monitor => ({
        ...monitor,
        groupName: group.name,
        groupId: group.id,
        url: monitor.urlToCheck || undefined
      } as IExtendedMonitorItem));
      return [...acc, ...monitorsInGroup];
    }, []);
    
    setMonitors(allMonitors);
  }, [monitorGroupListByUser]);

  useEffect(() => {
    let filtered = [...monitors];

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter(monitor => monitor.groupId.toString() === selectedGroup);
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(monitor => 
        monitor.name.toLowerCase().includes(searchLower) ||
        (monitor.url?.toLowerCase() || '').includes(searchLower)
      );
    }

    setFilteredMonitors(filtered);
  }, [monitors, selectedGroup, searchText]);

  const handleGroupChange = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("monitorCharts.text")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="div">
                  {t("monitorCharts.text")}
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' }
              }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <Select
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    displayEmpty
                  >
                    <MenuItem value="all">{t("monitorCharts.allGroups")}</MenuItem>
                    {monitorGroupListByUser.map((group) => (
                      <MenuItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }} size="small">
                  <OutlinedInput
                    placeholder={t("dashboard.search")}
                    value={searchText}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                    fullWidth
                  />
                </FormControl>
              </Box>
              <List>
                {filteredMonitors.length > 0 ? (
                  filteredMonitors.map((monitor) => (
                    <ListItem key={monitor.id} disablePadding>
                      <ListItemButton 
                        onClick={() => navigate(`/monitor-charts/${monitor.id}`)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemText 
                          primary={monitor.name}
                          secondary={
                            <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" component="span">
                                {monitor.url}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" component="span">
                                {t("monitorCharts.group")}: {monitor.groupName}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                    {t("dashboard.noResultFoundFor")}
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default MonitorChartsList; 