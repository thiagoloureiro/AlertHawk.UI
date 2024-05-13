import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';

interface IFormEmailProps {
    register: any;
    errors: any;
    watch: any;
}

const FormEmail: React.FC<IFormEmailProps> = ({ register, errors, watch }) => {
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
                        {...register("notificationEmail.FromEmail", {
                            required: true,
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: t("notificationEmail..Errors.validEmail"),
                            }
                        })}
                        fullWidth
                        label={t("notifications.FromEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.FromEmail}
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
                        {...register("notificationEmail.ToEmail", {
                            required: true,
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: t("notificationEmail..Errors.validEmail"),
                            }
                        })}
                        fullWidth
                        label={t("notifications.ToEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.ToEmail}
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
                        {...register("notificationEmail.HostName", { required: true })}
                        fullWidth
                        label={t("notifications.HostName")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.HostName}
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
                        {...register("notificationEmail.Port", { required: true })}
                        fullWidth
                        label={t("notifications.Port")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        type='number'
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.Port}
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
                        {...register("notificationEmail.Username", { required: true })}
                        fullWidth
                        label={t("notifications.Username")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.Username}
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
                        {...register("password", { required: true })}
                        fullWidth
                        label={t("notifications.password")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        type='password'
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.password}
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
                        {...register("notificationEmail.toCCEmail", { required: true })}
                        fullWidth
                        label={t("notifications.toCCEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.toCCEmail}
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
                        {...register("notificationEmail.toBCCEmail", { required: true })}
                        fullWidth
                        label={t("notifications.toBCCEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.toBCCEmail}
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
                    <InputLabel id="enableSsl">
                        {t("notifications.enableSsl")}
                    </InputLabel>
                    <Select
                        labelId="checkCertificateExpiry-selection"
                        id="checkCertificateExpiry-selection"
                        {...register("notificationEmail.enableSsl", { required: true })}
                        error={!!errors?.notificationEmail?.enableSsl}
                        value={watch("notificationEmail.enableSsl")}
                        label={t("notifications.enableSsl")}
                    >
                        <MenuItem value="true">
                            {t("notifications.yes")}
                        </MenuItem>
                        <MenuItem value="false">{t("notifications.no")}</MenuItem>
                    </Select>
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
                        {...register("notificationEmail.subject", { required: true })}
                        fullWidth
                        label={t("notifications.subject")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.subject}
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
                        {...register("notificationEmail.body", { required: true })}
                        fullWidth
                        label={t("notifications.body")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.body}
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
                    <InputLabel id="isHtmlBody-selection">
                        {t("notifications.isHtmlBody")}
                    </InputLabel>
                    <Select
                        labelId="checkCertificateExpiry-selection"
                        id="checkCertificateExpiry-selection"
                        {...register("notificationEmail.isHtmlBody", { required: true })}
                        value={watch("notificationEmail.isHtmlBody")}
                        label={t("notifications.isHtmlBody")}
                        error={!!errors?.notificationEmail?.isHtmlBody}
                    >
                        <MenuItem value="true">
                            {t("notifications.yes")}
                        </MenuItem>
                        <MenuItem value="false">{t("notifications.no")}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default FormEmail;

