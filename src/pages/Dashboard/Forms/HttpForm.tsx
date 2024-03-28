import {  useEffect, useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress} from '@mui/material';
import { useStoreActions, useStoreState } from '../../../hooks';
import { Environment, MonitorHttpMethod, Region } from '../../../enums/Enums';
import { useForm } from "react-hook-form";
import MonitorService from '../../../services/MonitorService';
import { showSnackbar } from '../../../utils/snackbarHelper';
import { useTranslation } from 'react-i18next';
import DeleteForever from "@mui/icons-material/DeleteForever";
interface IAddHttpMonitorProps {
    monitorTypeId: number;
    setMonitorPainelState: any;
}
const HttpForm: React.FC<IAddHttpMonitorProps> = ({ monitorTypeId, setMonitorPainelState }) => {
    const { t } = useTranslation("global");

    const { register, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            monitorGroup: null,
            monitorRegion: null,
            monitorEnvironment: null,
            monitorHttpMethod: null,
            checkCertificateExpiry: "0",
            ignoreTLSSSL: "0",
            urlToCheck: '',
            maxRedirects: 5,
            heartBeatInterval: 1,
            body: '',
            timeout: 20,
            retries: 3,
            status: true,
            monitorTypeId: monitorTypeId
        }
    });

    const urlToCheck = watch("urlToCheck");
    const [headers, setHeaders] = useState<{ name: string; value: string; }[]>([]);

    const { selectedEnvironment } = useStoreState((state) => state.app);
    const { thunkGetMonitorGroupListByUser, setAddMonitorPainel } = useStoreActions((actions) => actions.monitor);
    const monitorGroupList = useStoreState((state) => state.monitor.monitorGroupListByUser);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [hasGroupSelected, setHasGroupSelected] = useState(false);
    const handleAddHeader = () => {
        const lastHeader = headers[headers.length - 1];
        if (!lastHeader || (lastHeader.name.trim() !== '' && lastHeader.value.trim() !== '')) {
            // Adicionar um novo cabeçalho à lista
            setHeaders([...headers, { name: '', value: '' }]);
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
        const selectedGroup = monitorGroupList.find(group => group.id === event.target.value);
        if (selectedGroup === undefined) {
            setHasGroupSelected(false);
        } else {
            setHasGroupSelected(true);
        }
    };
    const handleCancelButton = () => {
        setMonitorPainelState(false);
    };
    useEffect(() => {
        const url = urlToCheck.toLowerCase();
        if (url.startsWith('http://')) {
            setValue("ignoreTLSSSL", "0");
            setValue("checkCertificateExpiry", "0");
        } else if (url.startsWith('https://')) {
            setValue("ignoreTLSSSL", "0");
            setValue("checkCertificateExpiry", "1");
        }
    }, [urlToCheck]);

    const handleValidSubmit = async (data: any) => {
        setIsButtonDisabled(true);
        data.checkCertificateExpiry = data.checkCertificateExpiry === "1";
        data.ignoreTLSSSL = data.ignoreTLSSSL === "1";
        if (headers.length > 0) {
            // data.headers = headers.map(header => [header.name, header.value]);
            const headersList = headers.map(header => ({ item1: header.name, item2: header.value }));

            // Adicionando 'headersList' aos dados do formulário
            data.headers = headersList;
        }

        await MonitorService.createHttpMonitor(data).then(async (response: any) => {
            await MonitorService.addMonitorToGroup({ monitorId: response, monitorgroupId: data.monitorGroup }).then(async () => {
                setIsButtonDisabled(false);
                await thunkGetMonitorGroupListByUser(selectedEnvironment);
                setAddMonitorPainel(false);
                showSnackbar(t("dashboard.addHttpForm.success"), "success");

            });
        });
    }

    return (
        <>
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
                                error={!!errors.name}
                            />
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
                                {...register("urlToCheck", {
                                    required: true,
                                    pattern: {
                                        value: /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i,
                                        message: t("dashboard.addHttpFrom.errors.url")
                                    }
                                })}
                                fullWidth
                                label="URL to check"
                                margin="normal"
                                variant="outlined"
                                autoFocus
                                sx={{
                                    marginBottom: '0px !important'
                                }}
                                autoComplete="off"
                                error={!!errors.urlToCheck}
                            />
                            {errors.urlToCheck && <span style={{ color: "#f44336" }}>{t("dashboard.addHttpForm.errors.url")}</span>}

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
                                error={!!errors.monitorRegion}
                            >
                                {(
                                    Object.keys(Region) as Array<
                                        keyof typeof Region
                                    >
                                ).sort((a, b) => a.localeCompare(b))
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
                                error={!!errors.monitorEnvironment}
                            >
                                {(
                                    Object.keys(Environment) as Array<
                                        keyof typeof Environment
                                    >
                                ).sort((a, b) => a.localeCompare(b))
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
                            <InputLabel id="checkCertificateExpiry-selection">
                                {t("dashboard.addHttpForm.checkCertificateExpiry")}
                            </InputLabel>
                            <Select
                                labelId="checkCertificateExpiry-selection"
                                id="checkCertificateExpiry-selection"
                                {...register("checkCertificateExpiry", { required: true })}
                                value={getValues("checkCertificateExpiry")}
                                label={t("dashboard.addHttpForm.checkCertificateExpiry")}
                                disabled={urlToCheck.startsWith('http://')}
                                error={!!errors.checkCertificateExpiry}
                            >
                                <MenuItem value="1">
                                    {t("dashboard.addHttpForm.yes")}
                                </MenuItem>
                                <MenuItem value="0">
                                    {t("dashboard.addHttpForm.no")}
                                </MenuItem>
                            </Select>
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
                            <InputLabel id="ignoreSSL-selection">
                                {t("dashboard.addHttpForm.ignoreTLSSSL")}
                            </InputLabel>
                            <Select
                                labelId="ignoreSSL-selection"
                                id="ignoreSSL-selection"
                                {...register("ignoreTLSSSL", { required: true })}
                                value={getValues("ignoreTLSSSL")}
                                label={t("dashboard.addHttpForm.ignoreTLSSSL")}
                                disabled={urlToCheck.startsWith('http://')}
                                error={!!errors.ignoreTLSSSL}
                            >
                                <MenuItem value="1">
                                    {t("dashboard.addHttpForm.yes")}
                                </MenuItem>
                                <MenuItem value="0">
                                    {t("dashboard.addHttpForm.no")}
                                </MenuItem>
                            </Select>
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
                            <InputLabel id="httpMethod-selection">
                                {t("dashboard.addHttpForm.httpMethod")}
                            </InputLabel>
                            <Select
                                labelId="httpMethod-selection"
                                {...register("monitorHttpMethod", { required: true })}
                                id="httpMethod-selection"
                                label={t("dashboard.addHttpForm.httpMethod")}
                                error={!!errors.monitorHttpMethod}
                            >
                                {(
                                    Object.keys(MonitorHttpMethod) as Array<
                                        keyof typeof MonitorHttpMethod
                                    >
                                ).sort((a, b) => a.localeCompare(b))
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
                            marginBottom: '0'
                        }}
                    > <FormControl fullWidth>
                            <TextField
                                {...register("maxRedirects", { required: true })}
                                fullWidth
                                label={t("dashboard.addHttpForm.maxRedirects")}
                                margin="normal"
                                variant="outlined"
                                autoFocus
                                sx={{
                                    marginBottom: '0px !important'
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
                            marginBottom: '0'
                        }}
                    > <FormControl fullWidth sx={{ borderRadius: '30px' }}>
                            <TextField
                                {...register("body")}
                                fullWidth
                                label={t("dashboard.addHttpForm.body")}
                                margin="normal"
                                variant="outlined"
                                multiline
                                rows={6}
                                autoFocus
                                sx={{
                                    marginBottom: '0px !important'

                                }}
                                autoComplete="off"
                            />
                        </FormControl>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginTop: '16px'
                        }}>
                        <Button onClick={handleAddHeader} variant="contained" >
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
                                width: '100%',
                            }}
                        >
                            <Box>{headers.map((header, index) => (
                                <Box key={index} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    marginTop: '16px'
                                }}>
                                    <TextField
                                        label={t("dashboard.addHttpForm.headerName")}
                                        value={header.name}
                                        sx={{ minWidth: '30%', marginRight: '8px' }}
                                        onChange={(e) => {
                                            const updatedHeaders = [...headers];
                                            updatedHeaders[index].name = e.target.value;
                                            setHeaders(updatedHeaders);
                                        }}
                                    />
                                    <TextField
                                        label={t("dashboard.addHttpForm.headerValue")}
                                        sx={{ minWidth: '55%', marginRight: '8px' }}
                                        value={header.value}
                                        onChange={(e) => {
                                            const updatedHeaders = [...headers];
                                            updatedHeaders[index].value = e.target.value;
                                            setHeaders(updatedHeaders);
                                        }}
                                    />
                                    <Box sx={{
                                        justifyContent: "flex-end",
                                        display: 'flex',
                                        minWidth: '20%'
                                    }}>
                                        <Button variant="contained" sx={{ width: '100%' }} color='error' onClick={() => handleRemoveHeader(index)}><DeleteForever/></Button>
                                    </Box>
                                </Box>
                            ))}</Box>

                        </Box>

                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignSelf: "flex-end",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginBottom: '0'
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
                            sx={{ mb: 2, mt: 2, ml: 2, color: "white", fontWeight: 700, position: "relative" }}
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

                }
            </form>
        </>

    );
};

export default HttpForm;
