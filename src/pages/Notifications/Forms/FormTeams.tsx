import { Box, FormControl, TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';

interface FormTeamsProps {
    register: any;
    errors: any;
}

const FormTeams: React.FC<FormTeamsProps> = ({ errors, register }) => {
    return (
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
                    {...register("notificationTeams.webHookUrl", {
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
                    error={!!errors?.notificationTeams?.webHookUrl}
                />
            </FormControl>
        </Box>
    );
};

export default FormTeams;

