import { FC, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  OutlinedInput,
  Stack,
} from "@mui/material";
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CollapsibleTable from "../../components/Table/CollapsibleTable";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SelectedMonitorDetails from "./Items/SelectedMonitorDetails";
import { useStoreState } from "../../hooks";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../interfaces/IMonitorGroupListByUser";

interface IDashboardProps {}

const Dashboard: FC<IDashboardProps> = ({}) => {
  const { t } = useTranslation("global");

  const { monitorGroupListByUser } = useStoreState((state) => state.monitor);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedChildRowIndex, setSelectedChildRowIndex] = useState<
    number | null
  >(null);
  const [selectedMonitorGroup, setSelectedMonitorGroup] =
    useState<IMonitorGroupListByUser | null>(null);
  const [selectedMonitorItem, setSelectedMonitorItem] =
    useState<IMonitorGroupListByUserItem | null>(null);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(selectedRowIndex === index ? selectedRowIndex : index);
    setSelectedChildRowIndex(null);
  };

  const handleChildRowClick = (index: number) => {
    setSelectedChildRowIndex(
      selectedChildRowIndex === index ? selectedChildRowIndex : index
    );
    setSelectedRowIndex(null);
  };

  useEffect(() => {
    setSelectedMonitorGroup(
      selectedRowIndex !== null
        ? monitorGroupListByUser[selectedRowIndex]
        : null
    );
  }, [selectedRowIndex, monitorGroupListByUser]);

  useEffect(() => {
    setSelectedMonitorItem(
      selectedChildRowIndex !== null
        ? monitorGroupListByUser.reduce((foundItem, parent) => {
            if (foundItem) return foundItem;
            const childItem = parent.monitors.find(
              (child) => child.id === selectedChildRowIndex
            );
            return childItem ? childItem : foundItem;
          }, null as IMonitorGroupListByUserItem | null)
        : null
    );
  }, [selectedChildRowIndex, monitorGroupListByUser]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("dashboard.text")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={4}
              >
                <div>
                  {/* <Button
                    size="large"
                    variant="contained"
                    startIcon={<AddOutlinedIcon sx={{ color: "#fff" }} />}
                    sx={{ color: "white" }}
                  >
                    Add New Monitor
                  </Button> */}
                </div>
                <div>
                  <FormControl fullWidth>
                    <OutlinedInput
                      size="small"
                      startAdornment={<SearchOutlinedIcon />}
                      value={searchText}
                      onChange={handleSearchInputChange}
                      placeholder={t("dashboard.search")}
                    />
                  </FormControl>
                </div>
              </Stack>
              <Box
                sx={{
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 300px)",
                  paddingRight: "16px",
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
                <CollapsibleTable
                  monitors={monitorGroupListByUser}
                  searchText={searchText}
                  handleRowClick={handleRowClick}
                  handleChildRowClick={handleChildRowClick}
                  selectedRowIndex={selectedRowIndex}
                  selectedChildRowIndex={selectedChildRowIndex}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          {selectedMonitorGroup !== null || selectedMonitorItem !== null ? (
            <SelectedMonitorDetails
              selectedMonitorGroup={selectedMonitorGroup}
              selectedMonitorItem={selectedMonitorItem}
            />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
