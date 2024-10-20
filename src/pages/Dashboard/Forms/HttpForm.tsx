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
  SelectChangeEvent,
} from "@mui/material";
import { useStoreActions, useStoreState } from "../../../hooks";
import { Environment, MonitorHttpMethod, Region } from "../../../enums/Enums";
import { useForm } from "react-hook-form";
import MonitorService from "../../../services/MonitorService";
import { showSnackbar } from "../../../utils/snackbarHelper";
import { useTranslation } from "react-i18next";
import DeleteForever from "@mui/icons-material/DeleteForever";
import {
  IMonitorGroupListByUser,
  IMonitorGroupListByUserItem,
} from "../../../interfaces/IMonitorGroupListByUser";
import logging from "../../../utils/logging";
import { IAgent } from "../../../interfaces/IAgent";

interface IAddHttpMonitorProps {
  monitorTypeId: number;
  setAddMonitorPanel: (val: boolean) => void;
  editMode: boolean;
  monitorItemToBeEdited?: IMonitorGroupListByUserItem | null;
  monitorGroupToBeEdited?: IMonitorGroupListByUser | null;
}
const HttpForm: React.FC<IAddHttpMonitorProps> = ({
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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: editMode ? monitorItemToBeEdited?.name : "",
      monitorGroup: monitorGroupToBeEdited?.id ?? null,
      monitorRegion: null,
      monitorEnvironment: null,
      monitorHttpMethod: 1,
      checkCertExpiry: "0",
      ignoreTlsSsl: "0",
      urlToCheck: editMode ? monitorItemToBeEdited?.urlToCheck : "",
      maxRedirects: 5,
      heartBeatInterval: 1,
      body: "",
      timeout: 20,
      retries: 3,
      status: true,
      monitorTypeId: monitorTypeId,
    },
  });

  const certificateExpiry = watch("checkCertExpiry");
  const watchIgnoreTLSSL = watch("ignoreTlsSsl");
  const watchMonitorHttpMethod = watch("monitorHttpMethod");

  const [headers, setHeaders] = useState<{ name: string; value: string }[]>([]);

  const { selectedEnvironment } = useStoreState((state) => state.app);
  const { thunkGetMonitorGroupListByUser, thunkGetMonitorStats } =
    useStoreActions((actions) => actions.monitor);
    
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hasGroupSelected, setHasGroupSelected] = useState(
    monitorGroupToBeEdited?.id ? true : false
  );
  const [monitorAgents, setMonitorAgents] = useState<IAgent[]>([]);

  const [monitorGroupList, setMonitorGroupList] = useState<
    IMonitorGroupListByUser[]
  >([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  useEffect(() => {
    if (monitorAgents.length === 0) {
      fillMonitorAgentList();
    }
    if (monitorGroupList.length === 0) {
      fillMonitorGroupList();
    }
    if (editMode && dataToEdit == null) {
      getEditData();
    }
  }, [reset]);

  const getEditData = async () => {
    await MonitorService.getMonitorHttpByMonitorId(
      monitorItemToBeEdited?.id
    ).then((response: any) => {
      setDataToEdit(response);
      reset({
        ...response,
        checkCertExpiry: response.checkCertExpiry ? "1" : "0",
        ignoreTlsSsl: response.ignoreTlsSsl ? "1" : "0",
      });
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
  const handleAddHeader = () => {
    const lastHeader = headers[headers.length - 1];
    if (
      !lastHeader ||
      (lastHeader.name.trim() !== "" && lastHeader.value.trim() !== "")
    ) {
      setHeaders([...headers, { name: "", value: "" }]);
    } else {
      showSnackbar(t("dashboard.addHttpForm.fillThePreviusHeader"), "error");
    }
  };

  const handleRemoveHeader = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
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

  // Kamil Bulanda - no matter if link starts with http or https you can choose certificate expiry
  //   useEffect(() => {
  //     const url = urlToCheck.toLowerCase();
  //     if (url.startsWith("http://")) {
  //       setValue("ignoreTLSSSL", "0");
  //       setValue("checkCertificateExpiry", "0");
  //     } else if (url.startsWith("https://")) {
  //       setValue("ignoreTLSSSL", "0");
  //       setValue("checkCertificateExpiry", "1");
  //     }
  //   }, [urlToCheck]);

  const handleValidSubmit = async (data: any) => {
    setIsButtonDisabled(true);
    data.checkCertExpiry = data.checkCertExpiry === "1";
    data.ignoreTlsSsl = data.ignoreTlsSsl === "1";
    if (headers.length > 0) {
      const headersList = headers.map((header) => ({
        item1: header.name,
        item2: header.value,
      }));
      data.headers = headersList;
    }
    data.monitorHttpMethod = Number(data.monitorHttpMethod);
    data.maxRedirects = Number(data.maxRedirects);
    data.retries = Number(data.retries);
    data.heartBeatInterval = Number(data.heartBeatInterval);
    data.timeout = Number(data.timeout);
    logging.info(data);

    if (editMode) {
      await MonitorService.editHttpMonitor(data).then(async () => {
        if (monitorGroupToBeEdited?.id != data.monitorGroup) {
          await MonitorService.addMonitorToGroup({
            monitorId: data.id,
            monitorgroupId: data.monitorGroup,
          }).then(async () => {
            setIsButtonDisabled(false);
            setAddMonitorPanel(false);
            showSnackbar(t("dashboard.updateHttpForm.success"), "success");
            await thunkGetMonitorGroupListByUser(selectedEnvironment);
          });
        } else {
          setIsButtonDisabled(false);
          setAddMonitorPanel(false);
          showSnackbar(t("dashboard.updateHttpForm.success"), "success");
          await thunkGetMonitorGroupListByUser(selectedEnvironment);
        }
      });
    } else {
      await MonitorService.createHttpMonitor(data).then(
        async (response: any) => {
          await MonitorService.addMonitorToGroup({
            monitorId: response,
            monitorgroupId: data.monitorGroup,
          }).then(async () => {
            setIsButtonDisabled(false);
            setAddMonitorPanel(false);
            showSnackbar(t("dashboard.addHttpForm.success"), "success");
            await thunkGetMonitorGroupListByUser(selectedEnvironment);
            await thunkGetMonitorStats(selectedEnvironment);
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
              defaultValue={monitorGroupToBeEdited?.id}
              onChange={handleMonitorGroupChange}
              label={t("dashboard.addHttpForm.monitorGroup")}
            // disabled={editMode}
            >
              {monitorGroupList.length > 0 &&
                monitorGroupList
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
                  autoFocus={editMode ? false : true}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.name}
                  defaultValue={monitorItemToBeEdited?.name}
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
                marginBottom: "0",
              }}
            >
              {" "}
              <FormControl fullWidth>
                <TextField
                  {...register("urlToCheck", {
                    required: true,
                    pattern: {
                      value: /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i,
                      message: t("dashboard.addHttpFrom.errors.url"),
                    },
                  })}
                  fullWidth
                  label="URL to check"
                  margin="normal"
                  variant="outlined"
                  autoFocus={editMode ? false : true}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.urlToCheck}
                  defaultValue={monitorItemToBeEdited?.urlToCheck}
                />
                {errors.urlToCheck && (
                  <span style={{ color: "#f44336" }}>
                    {t("dashboard.addHttpForm.errors.url")}
                  </span>
                )}
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
                  {...register("monitorRegion", { required: true })}
                  id="monitorRegion-selection"
                  label={t("dashboard.addHttpFrom.monitorRegion")}
                  error={!!errors.monitorRegion}
                  defaultValue={monitorItemToBeEdited?.monitorRegion}
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
                  label={t("dashboard.addHttpForm.monitorEnvironment")}
                  error={!!errors.monitorEnvironment}
                  defaultValue={monitorItemToBeEdited?.monitorEnvironment}
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
                marginTop: "16px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="checkCertificateExpiry-selection">
                  {t("dashboard.addHttpForm.checkCertificateExpiry")}
                </InputLabel>
                <Select
                  labelId="checkCertificateExpiry-selection"
                  id="checkCertificateExpiry-selection"
                  {...register("checkCertExpiry", { required: true })}
                  value={certificateExpiry}
                  label={t("dashboard.addHttpForm.checkCertificateExpiry")}
                  onChange={(event: SelectChangeEvent) => {
                    setValue("checkCertExpiry", event.target.value);
                  }}
                  // disabled={urlToCheck.startsWith('http://')}
                  error={!!errors.checkCertExpiry}
                >
                  <MenuItem value="1">
                    {t("dashboard.addHttpForm.yes")}
                  </MenuItem>
                  <MenuItem value="0">{t("dashboard.addHttpForm.no")}</MenuItem>
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
                <InputLabel id="ignoreSSL-selection">
                  {t("dashboard.addHttpForm.ignoreTLSSSL")}
                </InputLabel>
                <Select
                  labelId="ignoreSSL-selection"
                  id="ignoreSSL-selection"
                  {...register("ignoreTlsSsl", { required: true })}
                  value={watchIgnoreTLSSL}
                  label={t("dashboard.addHttpForm.ignoreTLSSSL")}
                  onChange={(event: SelectChangeEvent) => {
                    setValue("ignoreTlsSsl", event.target.value);
                  }}
                  //   disabled={urlToCheck.startsWith("http://")} watchIgnoreTLSSL
                  error={!!errors.ignoreTlsSsl}
                >
                  <MenuItem value="1">
                    {t("dashboard.addHttpForm.yes")}
                  </MenuItem>
                  <MenuItem value="0">{t("dashboard.addHttpForm.no")}</MenuItem>
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
                <InputLabel id="httpMethod-selection">
                  {t("dashboard.addHttpForm.httpMethod")}
                </InputLabel>
                <Select
                  labelId="httpMethod-selection"
                  {...register("monitorHttpMethod", { required: true })}
                  id="httpMethod-selection"
                  label={t("dashboard.addHttpForm.httpMethod")}
                  error={!!errors.monitorHttpMethod}
                  value={watchMonitorHttpMethod.toString()}
                  onChange={(e: SelectChangeEvent) => {
                    setValue("monitorHttpMethod", Number(e.target.value));
                  }}
                >
                  {(
                    Object.keys(MonitorHttpMethod) as Array<
                      keyof typeof MonitorHttpMethod
                    >
                  )
                    .sort((a, b) => a.localeCompare(b))
                    .filter((key) => !isNaN(Number(MonitorHttpMethod[key])))
                    .map((key) => (
                      <MenuItem
                        key={MonitorHttpMethod[key]}
                        value={MonitorHttpMethod[key]}
                      >
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
                  autoFocus={editMode ? false : true}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.retries}
                  defaultValue={monitorItemToBeEdited?.retries}
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
                  {...register("maxRedirects", { required: true })}
                  fullWidth
                  label={t("dashboard.addHttpForm.maxRedirects")}
                  margin="normal"
                  variant="outlined"
                  autoFocus={editMode ? false : true}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.maxRedirects}
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
                  autoFocus={editMode ? false : true}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  error={!!errors.heartBeatInterval}
                  defaultValue={monitorItemToBeEdited?.heartBeatInterval}
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
                  autoFocus={editMode ? false : true}
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
              <FormControl fullWidth sx={{ borderRadius: "30px" }}>
                <TextField
                  {...register("body")}
                  fullWidth
                  label={t("dashboard.addHttpForm.body")}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={6}
                  autoFocus={!editMode}
                  sx={{
                    marginBottom: "0px !important",
                  }}
                  autoComplete="off"
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: "16px",
              }}
            >
              <Button onClick={handleAddHeader} variant="contained">
                {t("dashboard.addHttpForm.addHeaders")}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Box>
                  {headers.map((header, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: "16px",
                      }}
                    >
                      <TextField
                        label={t("dashboard.addHttpForm.headerName")}
                        value={header.name}
                        sx={{ minWidth: "30%", marginRight: "8px" }}
                        onChange={(e) => {
                          const updatedHeaders = [...headers];
                          updatedHeaders[index].name = e.target.value;
                          setHeaders(updatedHeaders);
                        }}
                      />
                      <TextField
                        label={t("dashboard.addHttpForm.headerValue")}
                        sx={{ minWidth: "55%", marginRight: "8px" }}
                        value={header.value}
                        onChange={(e) => {
                          const updatedHeaders = [...headers];
                          updatedHeaders[index].value = e.target.value;
                          setHeaders(updatedHeaders);
                        }}
                      />
                      <Box
                        sx={{
                          justifyContent: "flex-end",
                          display: "flex",
                          minWidth: "20%",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ width: "100%" }}
                          color="error"
                          onClick={() => handleRemoveHeader(index)}
                        >
                          <DeleteForever />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
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
                color="success"
                variant="contained"
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

export default HttpForm;
