import React from 'react';
import { useTranslation } from "react-i18next";

import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
interface IFormEmailProps {
    register: any;
    errors: any;
    watch: any;
}

const FormEmail: React.FC<IFormEmailProps> = ({ register, errors, watch }) => {
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
                        {...register("notificationEmail.fromEmail", {
                            required: true,
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: t("notifications.errors.validEmail"),
                            }
                        })}
                        fullWidth
                        label={t("notifications.fromEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.fromEmail}
                    />
                    {!!errors?.notificationEmail?.fromEmail && (
                        <span style={{ color: "#f44336" }}>
                            {t("notifications.errors.validEmail")}
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
                        {...register("notificationEmail.hostName", { required: true })}
                        fullWidth
                        label={t("notifications.hostName")}
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
                        {...register("notificationEmail.port", { required: true })}
                        fullWidth
                        label={t("notifications.port")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        type='number'
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.port}
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
                        {...register("notificationEmail.username", { required: true })}
                        fullWidth
                        label={t("notifications.username")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.username}
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
                        {...register("notificationEmail.toEmail", {
                            required: true,
                            pattern: {
                                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                message: t("notifications.Errors.validEmail"),
                            }
                        })}
                        fullWidth
                        label={t("notifications.toEmail")}
                        margin="normal"
                        variant="outlined"
                        autoFocus
                        sx={{
                            marginBottom: "0px !important",
                        }}
                        autoComplete="off"
                        error={!!errors?.notificationEmail?.toEmail}
                    />
                    {!!errors?.notificationEmail?.toEmail && (
                        <span style={{ color: "#f44336" }}>
                            {t("notifications.errors.validEmail")}
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
                        {...register("notificationEmail.toCCEmail")}
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
                    {!!errors?.notificationEmail?.toCCCEmail && (
                        <span style={{ color: "#f44336" }}>
                            {t("notifications.errors.validEmail")}
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
                        {...register("notificationEmail.toBCCEmail")}
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
                    {!!errors?.notificationEmail?.toBCCEmail && (
                        <span style={{ color: "#f44336" }}>
                            {t("notifications.errors.validEmail")}
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
                        multiline
                        rows={6}
                        error={!!errors?.notificationEmail?.body}
                    />
                </FormControl>
            </Box>
        </>
    );
};

export default FormEmail;

