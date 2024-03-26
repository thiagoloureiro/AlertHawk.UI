import {  useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material';
import { useStoreActions, useStoreState } from '../../../hooks';
import { Environment, Region } from '../../../enums/Enums';
import { useForm } from "react-hook-form";
import MonitorService from '../../../services/MonitorService';
import { showSnackbar } from '../../../utils/snackbarHelper';
import { useTranslation } from 'react-i18next';
interface IAddTcpMonitorProps {
    monitorTypeId: number;
}
const TcpForm: React.FC<IAddTcpMonitorProps> = ({ monitorTypeId }) => {
    const { t } = useTranslation("global");
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            monitorGroup: null,
            monitorRegion: null,
            monitorEnvironment: null,
            heartBeatInterval: 1,
            port: 0,
            ip: '',
            timeout: 20,
            status: true,
            retries: 3,
            monitorTypeId: monitorTypeId
        }
    });
    const { selectedEnvironment } = useStoreState((state) => state.app);
    const { thunkGetMonitorGroupListByUser, setAddMonitorPainel } = useStoreActions((actions) => actions.monitor);
    const monitorGroupList = useStoreState((state) => state.monitor.monitorGroupList);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hasGroupSelected, setHasGroupSelected] = useState(false);
    const isIPv4 = (value: any) => {
        const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        return ipv4Regex.test(value);
    };
    const handleMonitorGroupChange = (event: any) => {
        const selectedGroup = monitorGroupList.find(group => group.id === event.target.value);
        if (selectedGroup === undefined) {
            setHasGroupSelected(false);
        } else {
            setHasGroupSelected(true);
        }
    };

    const handleValidSubmit = async (data: any) => {
        setIsButtonDisabled(true);
        data.checkCertificateExpiry = data.checkCertificateExpiry === "1";
        data.ignoreTLSSSL = data.ignoreTLSSSL === "1";
        await MonitorService.createTcpMonitor(data).then(async (response: any) => {
            await MonitorService.addMonitorToGroup({ monitorId: response, monitorgroupId: data.monitorGroup }).then(async () => {
                setIsButtonDisabled(false);
                await thunkGetMonitorGroupListByUser(selectedEnvironment);
                setAddMonitorPainel(false);
                showSnackbar(t("dashboard.addHttpForm.success"), "success");

            });
        });
    }
    return (<>
        <form onSubmit={handleSubmit(handleValidSubmit)}>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: '16px'

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
                    >
                        {monitorGroupList.sort((a, b) => a.name.localeCompare(b.name)).map((group, key) => (
                            <MenuItem value={group.id} key={key}>
                                {group.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {hasGroupSelected && <>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("name", { required: true })}
                            fullWidth
                            label="Monitor Name"
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.name && <span>{t("dashboard.addHttpForm.errors.name")}</span>}
                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: '16px'
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
                        >
                            {(
                                Object.keys(Region) as Array<
                                    keyof typeof Region
                                >
                            )
                                .filter((key) => !isNaN(Number(Region[key])))
                                .map((key) => (
                                    <MenuItem
                                        key={Region[key]}
                                        value={Region[key]}
                                    >
                                        {key}
                                    </MenuItem>
                                ))}
                        </Select>
                        {errors.monitorRegion && <span>{t("dashboard.addHttpForm.errors.region")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: '16px'
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
                        >
                            {(
                                Object.keys(Environment) as Array<
                                    keyof typeof Environment
                                >
                            )
                                .filter((key) => !isNaN(Number(Environment[key])))
                                .map((key) => (
                                    <MenuItem
                                        key={Environment[key]}
                                        value={Environment[key]}
                                    >
                                        {key}
                                    </MenuItem>
                                ))}
                        </Select>
                        {errors.monitorEnvironment && <span>{t("dashboard.addHttpForm.errors.monitorEnvironment")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("retries", { required: true })}
                            fullWidth
                            label={t("dashboard.addHttpForm.retries")}
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.retries && <span>{t("dashboard.addHttpForm.errors.retries")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("heartBeatInterval", { required: true })}
                            fullWidth
                            label={t("dashboard.addHttpForm.heartbeatInterval")}
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.heartBeatInterval && <span>{t("dashboard.addHttpForm.errors.heartbeatInterval")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("timeout", { required: true })}
                            fullWidth
                            label={t("dashboard.addHttpForm.timeout")}
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.timeout && <span>{t("dashboard.addHttpForm.errors.timeout")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("port", { required: true })}
                            fullWidth
                            label={t("dashboard.addHttpForm.port")}
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.timeout && <span>{t("dashboard.addHttpForm.errors.port")}</span>}

                    </FormControl>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: '0'
                    }}
                > <FormControl fullWidth>
                        <TextField
                            {...register("ip", {
                                required: true,
                                validate: {
                                    validIPv4: (value) => isIPv4(value) || t("dashboard.addHttpForm.errors.ip")
                                }
                            })}
                            fullWidth
                            label={t("dashboard.addHttpForm.ip")}
                            margin="normal"
                            variant="outlined"
                            autoFocus
                            sx={{
                                marginBottom: '0px !important'
                            }}
                            autoComplete="off"
                        />
                        {errors.timeout && <span>{t("dashboard.addHttpForm.errors.ip")}</span>}

                    </FormControl>
                </Box>
                <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: '0'
                        }}
                    >
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mb: 2, mt: 2, color: "white", fontWeight: 700, position: "relative" }}
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
            </>}
        </form>
    </>
    )
}
export default TcpForm;