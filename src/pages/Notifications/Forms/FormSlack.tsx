import React from 'react';
import { useTranslation } from "react-i18next";
import { Box, FormControl, TextField } from '@mui/material';
interface FormTeamsProps {
    register: any;
    errors: any;
}

const FormTeams: React.FC<FormTeamsProps> = ({ errors, register }) => {
    const { t } = useTranslation("global");
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
                        {...register("notificationSlack.channel", { required: true })}
                        fullWidth
                        label={t("notifications.channel")}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationSlack?.channel}
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
                        {...register("notificationSlack.webHookUrl", {
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
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationSlack?.webHookUrl}
                    />
                    {!!errors?.notificationSlack?.webHookUrl && (
                        <span style={{ color: "#f44336" }}>
                            {t("notifications.errors.url")}
                        </span>
                    )}
                </FormControl>
            </Box>
        </>
    );
};

export default FormTeams;

