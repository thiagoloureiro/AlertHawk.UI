import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStoreActions, useStoreState } from "../../../hooks";
import {  Environment, Region } from "../../../enums/Enums";
import { useForm } from "react-hook-form";
import MonitorService from "../../../services/MonitorService";
import { showSnackbar } from "../../../utils/snackbarHelper";
import { useTranslation } from "react-i18next";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../../interfaces/IMonitorGroupListByUser";
import { IAgent } from "../../../interfaces/IAgent";

interface IAddTcpMonitorProps {
  monitorTypeId: number;
  setAddMonitorPanel: (val: boolean) => void;
  editMode: boolean;
  monitorItemToBeEdited?: IMonitorGroupListByUserItem | null;
  monitorGroupToBeEdited?: IMonitorGroupListByUser | null;
}
const TcpForm: React.FC<IAddTcpMonitorProps> = ({
  monitorTypeId,
  setAddMonitorPanel,
  editMode,
  monitorItemToBeEdited,
  monitorGroupToBeEdited,
}) => {
  const { t } = useTranslation("global");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: editMode ? monitorItemToBeEdited?.name : "",
      monitorGroup: null,
      monitorRegion: editMode ? 1 : null,
      monitorEnvironment: editMode ? 1 : null,
      heartBeatInterval: 1,
      port: 0,
      ip: " ",
      timeout: 20,
      status: true,
      retries: 3,
      monitorTypeId: monitorTypeId,
    },
  });

  const watchMonitorRegion = watch("monitorRegion");
  const watchMonitorEnvironment = watch("monitorEnvironment");

  const { selectedEnvironment } = useStoreState((state) => state.app);
  const { thunkGetMonitorGroupListByUser } = useStoreActions(
    (actions) => actions.monitor
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hasGroupSelected, setHasGroupSelected] = useState(
    monitorGroupToBeEdited?.id ? true : false
  );
  const [monitorGroupList, setMonitorGroupList] = useState<
    IMonitorGroupListByUser[]
  >([]);

  const [monitorAgents, setMonitorAgents] = useState<IAgent[]>([]);


  const [dataToEdit, setDataToEdit] = useState(null);

  useEffect(() => {
    if(monitorAgents.length === 0) {
      fillMonitorAgentList();
    }
    if (monitorGroupList.length === 0) {
      fillMonitorGroupList();
    }
    if (editMode && dataToEdit == null) {
      getEditData();
    }
  });

  const getEditData = async () => {
    await MonitorService.getMonitorTcpByMonitorId(
      monitorItemToBeEdited?.id
    ).then((response: any) => {
      setDataToEdit(response);
      reset(response);
    });
  };

  const fillMonitorGroupList = async () => {
    await MonitorService.getMonitorGroupListByUserToken().then((response) => {
      setMonitorGroupList(response);
    });
  };

  const filteredRegions = Array.from(new Set(
    monitorAgents
      .map(agent => agent.monitorRegion)
      .filter(region => Object.values(Region).includes(region))
  ));
  const regionEntries = Object.entries(Region);

  const sortedFilteredRegions = filteredRegions.sort((a, b) => {
    const nameA = regionEntries.find(([, value]) => value === a)?.[0] || "";
    const nameB = regionEntries.find(([, value]) => value === b)?.[0] || "";
    return nameA.localeCompare(nameB);
  });
  const fillMonitorAgentList = async () => {
    const response = await MonitorService.getMonitorAgents();
    setMonitorAgents(response);
  };

  const handleMonitorGroupChange = (event: any) => {
    const selectedGroup = monitorGroupList.find(
      (group) => group.id === event.target.value
    );
    if (selectedGroup === undefined) {
      setHasGroupSelected(false);
    } else {
      setHasGroupSelected(true);
    }
  };
  const handleCancelButton = () => {
    setAddMonitorPanel(false);
  };
  const handleValidSubmit = async (data: any) => {
    setIsButtonDisabled(true);
    data.checkCertExpiry = data.checkCertExpiry === "1";
    data.ignoreTlsSsl = data.ignoreTlsSsl === "1";
    data.port = parseInt(data.port, 10);

    data.retries = Number(data.retries);
    data.heartBeatInterval = Number(data.heartBeatInterval);
    data.timeout = Number(data.timeout);
    data.part = Number(data.port);

    if (editMode) {
      await MonitorService.editTcpMonitor(data).then(async () => {
        if (monitorGroupToBeEdited?.id != data.monitorGroup) {
          await MonitorService.addMonitorToGroup({
            monitorId: data.id,
            monitorgroupId: data.monitorGroup,
          }).then(async () => {
            setIsButtonDisabled(false);
            setAddMonitorPanel(false);
            showSnackbar(t("dashboard.addHttpForm.success"), "success");
            await thunkGetMonitorGroupListByUser(selectedEnvironment);
          });
        } else {
          setIsButtonDisabled(false);
          setAddMonitorPanel(false);
          showSnackbar(t("dashboard.addHttpForm.success"), "success");
          await thunkGetMonitorGroupListByUser(selectedEnvironment);
        }
      });
    } else {
      await MonitorService.createTcpMonitor(data).then(
        async (response: any) => {
          await MonitorService.addMonitorToGroup({
            monitorId: response,
            monitorgroupId: data.monitorGroup,
          }).then(async () => {
            setIsButtonDisabled(false);
            setAddMonitorPanel(false);
            showSnackbar(t("dashboard.addHttpForm.success"), "success");
            await thunkGetMonitorGroupListByUser(selectedEnvironment);
          });
        }
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleValidSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="monitorGroup-selection">
              {t("dashboard.addHttpForm.monitorGroup")}
            </InputLabel>
            <Select
              {...register("monitorGroup")}
              labelId="monitorGroup-selection"
              id="monitorGroup-selection"
              onChange={handleMonitorGroupChange}
              label={t("dashboard.addHttpForm.monitorGroup")}
              defaultValue={monitorGroupToBeEdited?.id}
            // disabled={editMode}
            >
              {monitorGroupList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((group, key) => (
                  <MenuItem value={group.id} key={key}>
                    {group.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        {hasGroupSelected && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("name", { required: true })}
                  fullWidth
                  label="Monitor Name"
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.name}
                  inputProps={{ maxLength: 100 }}

                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="monitorRegion-selection">
                  {t("dashboard.addHttpForm.monitorRegion")}
                </InputLabel>
                <Select
                  labelId="monitorRegion-selection"
                  value={watchMonitorRegion}
                  {...register("monitorRegion", { required: true })}
                  id="monitorRegion-selection"
                  label={t("dashboard.addHttpFrom.monitorRegion")}
                  error={!!errors.monitorRegion}
                >
                  {sortedFilteredRegions.map(region => (
                    <MenuItem key={region} value={region}>
                      {regionEntries.find(([, value]) => value === region)?.[0]}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="monitorEnvironment-selection">
                  {t("dashboard.addHttpForm.monitorEnvironment")}
                </InputLabel>
                <Select
                  labelId="monitorEnvironment-selection"
                  {...register("monitorEnvironment", { required: true })}
                  id="monitorEnvironment-selection"
                  value={watchMonitorEnvironment}
                  label={t("dashboard.addHttpForm.monitorEnvironment")}
                  error={!!errors.monitorEnvironment}
                >
                  {(Object.keys(Environment) as Array<keyof typeof Environment>)
                    .sort((a, b) => a.localeCompare(b))
                    .filter((key) => !isNaN(Number(Environment[key])))
                    .map((key) => (
                      <MenuItem key={Environment[key]} value={Environment[key]}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("retries", { required: true })}
                  fullWidth
                  label={t("dashboard.addHttpForm.retries")}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.retries}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("heartBeatInterval", { required: true })}
                  fullWidth
                  label={t("dashboard.addHttpForm.heartbeatInterval")}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.heartBeatInterval}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("timeout", { required: true })}
                  fullWidth
                  label={t("dashboard.addHttpForm.timeout")}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.timeout}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("port", { required: true })}
                  fullWidth
                  label={t("dashboard.addHttpForm.port")}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.port}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0",
              }}
            >
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label={t("dashboard.addHttpForm.ip")}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  autoComplete="off"
                  error={!!errors.ip}
                  {...register("ip", {
                    required: true,
                  })}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignSelf: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "0",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCancelButton()}
              >
                {t("users.cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{
                  mb: 2,
                  mt: 2,
                  ml: 2,
                  color: "white",
                  fontWeight: 700,
                  position: "relative",
                }}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "primary.dark",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
                {t("dashboard.addHttpForm.save")}
              </Button>
            </Box>
          </>
        )}
      </form>
    </>
  );
};
export default TcpForm;
