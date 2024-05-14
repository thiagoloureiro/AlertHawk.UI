import React from 'react';
import { useTranslation } from "react-i18next";
import { Box, FormControl, TextField } from '@mui/material';
interface IFormTelegramProps {
    register: any;
    errors: any;
}

const FormTelegram: React.FC<IFormTelegramProps> = ({ register, errors }) => {
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
                        {...register("notificationTelegram.chatId", { required: true })}
                        fullWidth
                        label={t("notifications.chatId")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        type='number'
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationTelegram?.chatId}
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
                        {...register("notificationTelegram.telegramBotToken", { required: true })}
                        fullWidth
                        label={t("notifications.telegramBotToken")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationTelegram?.telegramBotToken}
                    />
                </FormControl>
            </Box>
        </>
    );
};

export default FormTelegram;

