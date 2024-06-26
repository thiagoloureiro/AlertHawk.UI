import React from 'react';
import { useTranslation } from "react-i18next";
import { DeleteForever } from '@mui/icons-material';
import { showSnackbar } from '../../../utils/snackbarHelper';
import { Box, Button, FormControl, TextField } from '@mui/material';
interface IFormTelegramProps {
    register: any;
    errors: any;
    headers: { name: string; value: string }[];
    setHeaders: React.Dispatch<React.SetStateAction<{ name: string; value: string }[]>>;
}

const FormTelegram: React.FC<IFormTelegramProps> = ({ errors, register, headers, setHeaders }) => {
    const { t } = useTranslation("global");
    const handleAddHeader = () => {
        const lastHeader = headers[headers.length - 1];
        if (
            !lastHeader ||
            (lastHeader.name.trim() !== "" && lastHeader.value.trim() !== "")
        ) {
            setHeaders([...headers, { name: "", value: "" }]);
        } else {
            showSnackbar(t("notifications.fillThePreviusHeader"), "error");
        }
    };
    const handleRemoveHeader = (index: number) => {
        const updatedHeaders = [...headers];
        updatedHeaders.splice(index, 1);
        setHeaders(updatedHeaders);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "16px",
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        {...register("notificationWebHook.message", { required: true })}
                        fullWidth
                        label={t("notifications.message")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.message}
                    />
                </FormControl>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "16px",
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        {...register("notificationWebHook.webHookUrl", {
                            required: true,
                            pattern: {
                                value: /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i,
                                message: t("notifications.errors.url"),
                            },
                        })}
                        fullWidth
                        label={t("notifications.webHookUrl")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.webHookUrl}
                    />
                    {!!errors?.notificationTeams?.webHookUrl && (
                  <span style={{ color: "#f44336" }}>
                    {t("notifications.errors.url")}
                  </span>
                )}
                </FormControl>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "16px",
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        {...register("notificationWebHook.body", { required: true })}
                        fullWidth
                        label={t("notifications.body")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        multiline
                        rows={6}
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.body}
                    />
                </FormControl>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "16px",
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        {...register("notificationWebHook.headersJson", { required: true })}
                        fullWidth
                        label={t("notifications.headersJson")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.headersJson}
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
                    {t("notifications.addHeaders")}
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
                                    label={t("notifications.headerName")}
                                    value={header.name}
                                    sx={{ minWidth: "30%", marginRight: "8px" }}
                                    onChange={(e) => {
                                        const updatedHeaders = [...headers];
                                        updatedHeaders[index].name = e.target.value;
                                        setHeaders(updatedHeaders);
                                    }}
                                />
                                <TextField
                                    label={t("notifications.headerValue")}
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
        </>
    );
};

export default FormTelegram;

