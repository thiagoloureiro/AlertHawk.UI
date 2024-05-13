import { Box, FormControl, TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';

interface IFormTelegramProps {
    register: any;
    errors: any;
}

const FormTelegram: React.FC<IFormTelegramProps> = ({ errors, register }) => {
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
                        {...register("notificationWebHook.notificationId", { required: true })}
                        fullWidth
                        label={t("notification.notificationId")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        type='number'
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.notificationId}
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
                                message: t("dashboard.addHttpFrom.errors.url"),
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
            {/* <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "16px",
                }}
            >
                <FormControl fullWidth>
                    <TextField
                        {...register("notificationWebHook.headers", { required: true })}
                        fullWidth
                        label={t("notifications.headers")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationWebHook?.headers}
                    />
                </FormControl>
            </Box> */}
        </>
    );
};

export default FormTelegram;

