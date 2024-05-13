import { useForm } from 'react-hook-form';
import logging from "../../../utils/logging";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import { showSnackbar } from "../../../utils/snackbarHelper";
import MonitorService from '../../../services/MonitorService';
import { useStoreState } from '../../../hooks';
import { IMonitorGroupListByUser } from '../../../interfaces/IMonitorGroupListByUser';
import { Box, Typography, Card, CardContent, FormControl, TextField, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, MenuItem, InputLabel, Select } from '@mui/material';
import FormTeams from './FormTeams';
import FormTelegram from './FormTelegram';
import FormEmail from './FormEmail';
import FormWebHook from './FormWebHook';
import FormSlack from './FormSlack';
import NotificationService from '../../../services/NotificationService';

interface IFromNotificationsProps {
  setAddPanel: (val: boolean) => void;
  selectedNotification: INotification | null;
  notificationTypes: INotificationType[];
}

const FromNotifications: React.FC<IFromNotificationsProps> = ({ setAddPanel, selectedNotification, notificationTypes }) => {
  const { t } = useTranslation("global");
  const { isDarkMode } = useStoreState((state) => state.app);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTypeTeams, setisTypeTeams] = useState(false);
  const [isTypeEmail, setisTypeEmail] = useState(false);
  const [isTypeTelegram, setisTypeTelegram] = useState(false);
  const [isTypeWebHook, setisTypeWebHook] = useState(false);
  const [isTypeSlack, setisTypeSlack] = useState(false);
  const [monitorGroupList, setMonitorGroupList] = useState<
    IMonitorGroupListByUser[]
  >([]);

  useEffect(() => {
    if (monitorGroupList.length === 0) {
      fillMonitorGroupList();
    }
  });

  const fillMonitorGroupList = async () => {
    await MonitorService.getMonitorGroupListByUserToken().then((response) => {
      setMonitorGroupList(response);
    });
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: 0,
      monitorGroupId: 0,
      name: "",
      notificationTypeId: 0,
      description: "",
      notificationSlack: {
        notificationId: 0,
        channel: "",
        webHookUrl: ""
      },
      notificationEmail: {
        notificationId: 0,
        fromEmail: "",
        toEmail: "",
        hostname: "",
        port: 0,
        username: "",
        password: "",
        toCCEmail: "",
        toBCCEmail: "",
        enableSsl: true,
        subject: "",
        body: "",
        isHtmlBody: true
      },
      notificationTeams: {
        notificationId: 0,
        webHookUrl: ""
      },
      notificationTelegram: {
        notificationId: 0,
        chatId: 0,
        telegramBotToken: ""
      },
      notificationWebHook: {
        notificationId: 0,
        message: "",
        webHookUrl: "",
        body: "",
        headersJson: "",
        headers: [
          {
            item1: "",
            item2: ""
          }
        ]
      }
    },
  });

  useEffect(() => {
    if (selectedNotification) {
      setValue("name", selectedNotification.name);
      setValue("description", selectedNotification.description);
      setValue("monitorGroupId", selectedNotification.monitorGroupId);
      setValue("notificationTypeId", selectedNotification.notificationTypeId);
      if (selectedNotification.notificationTeams) {
        setValue("notificationTeams.webHookUrl", selectedNotification.notificationTeams.webHookUrl);
      }
      if (selectedNotification.notificationTelegram) {
        setValue("notificationTelegram.chatId", selectedNotification.notificationTelegram.chatId);
        setValue("notificationTelegram.telegramBotToken", selectedNotification.notificationTelegram.telegramBotToken);
      }
      if (selectedNotification.notificationSlack) {
        setValue("notificationSlack.channel", selectedNotification.notificationSlack.channel);
        setValue("notificationSlack.webHookUrl", selectedNotification.notificationSlack.webHookUrl);
      }
      if (selectedNotification.notificationEmail) {
        setValue("notificationEmail.fromEmail", selectedNotification.notificationEmail.fromEmail);
        setValue("notificationEmail.toEmail", selectedNotification.notificationEmail.toEmail);
        setValue("notificationEmail.hostname", selectedNotification.notificationEmail.hostname);
        setValue("notificationEmail.port", selectedNotification.notificationEmail.port);
        setValue("notificationEmail.username", selectedNotification.notificationEmail.username);
        setValue("notificationEmail.password", selectedNotification.notificationEmail.password);
        setValue("notificationEmail.toCCEmail", selectedNotification.notificationEmail.toCCEmail);
        setValue("notificationEmail.toBCCEmail", selectedNotification.notificationEmail.toBCCEmail);
        setValue("notificationEmail.enableSsl", selectedNotification.notificationEmail.enableSsl);
        setValue("notificationEmail.subject", selectedNotification.notificationEmail.subject);
        setValue("notificationEmail.body", selectedNotification.notificationEmail.body);
        setValue("notificationEmail.isHtmlBody", selectedNotification.notificationEmail.isHtmlBody ? true : false);
      }
      if (selectedNotification.notificationWebHook) {
        setValue("notificationWebHook.message", selectedNotification.notificationWebHook.message);
        setValue("notificationWebHook.webHookUrl", selectedNotification.notificationWebHook.webHookUrl);
        setValue("notificationWebHook.body", selectedNotification.notificationWebHook.body);
        setValue("notificationWebHook.headersJson", selectedNotification.notificationWebHook.headersJson);
      }
      handleNotificationTypeChangeLogic(selectedNotification.notificationTypeId);

    } else {
      setValue("name", "");
      setValue("description", "");
      setValue("monitorGroupId", 0);
      setValue("notificationTypeId", 0);
      setValue("notificationTeams.webHookUrl", "");
      setValue("notificationTelegram.chatId", 0);
      setValue("notificationTelegram.telegramBotToken", "");
      setValue("notificationSlack.channel", "");
      setValue("notificationSlack.webHookUrl", "");
      setValue("notificationEmail.fromEmail", "");
      setValue("notificationEmail.toEmail", "");
      setValue("notificationEmail.hostname", "");
      setValue("notificationEmail.port", 0);
      setValue("notificationEmail.username", "");
      setValue("notificationEmail.password", "");
      setValue("notificationEmail.toCCEmail", "");
      setValue("notificationEmail.toBCCEmail", "");
      setValue("notificationEmail.enableSsl", true);
      setValue("notificationEmail.subject", "");
      setValue("notificationEmail.body", "");
      setValue("notificationEmail.isHtmlBody", true);
      setValue("notificationWebHook.message", "");
      setValue("notificationWebHook.webHookUrl", "");
      setValue("notificationWebHook.body", "");
      setValue("notificationWebHook.headersJson", "");

    }
  }, [selectedNotification]);

  const handleDeleteBtn = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    if (selectedNotification !== null) {
      await NotificationService.delete(selectedNotification.id).then(
        async () => {
          showSnackbar(t("notification.deleteConfirmation"), "success");
          setOpenDeleteDialog(false);
          setAddPanel(false);
        }
      ).catch((err) => {
        logging.error(err);
        showSnackbar(t(err.response.data), "error");
      });
    }
  };

  const handleValidSubmit = async (data: any) => {
    setIsButtonDisabled(true);
    logging.info(data);
    if (selectedNotification) {
      data.id = selectedNotification.id;
      await NotificationService.edit(data).then(async () => {
      setIsButtonDisabled(false);
      setAddPanel(false);
      showSnackbar(t("monitorGroups.updateSuccess"), "success");
      });
    } else {
      await NotificationService.create(data).then(async () => {
        setIsButtonDisabled(false);
        setAddPanel(false);
        showSnackbar(t("monitorGroups.createSuccess"), "success");
      });
    }
  };
  const hideAllForms = () => {
    setisTypeTeams(false);
    setisTypeEmail(false);
    setisTypeTelegram(false);
    setisTypeWebHook(false);
    setisTypeSlack(false);
  }
  const handleMonitorGroupChange = async (event: any) => {
    setValue("monitorGroupId", event.target.value);
  }

  const handleNotificationTypeChange = async (event: any) => {

    setValue("notificationTypeId", event.target.value);
    handleNotificationTypeChangeLogic(event.target.value);

  }

  const handleNotificationTypeChangeLogic = (notificationTypeId: number) => {
    var notificationType = notificationTypes.find((type) => type.id === notificationTypeId);
    hideAllForms();
    if (notificationType?.name === "MS Teams") {
      setisTypeTeams(true);
    } else if (notificationType?.name === "Telegram") {
      setisTypeTelegram(true);
    }
    else if (notificationType?.name === "Slack") {
      setisTypeSlack(true);
    }
    else if (notificationType?.name === "WebHook") {
      setisTypeWebHook(true);
    }
    else if (notificationType?.name === "Email Smtp") {
      setisTypeEmail(true);
    }
  }
  const handleCancelButton = () => {
    setAddPanel(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleValidSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={4}
          >
            <div style={{ width: "75%", minWidth: "200px" }}>
              <FormControl fullWidth>
                <Typography variant="h5" px={2} sx={{ marginBottom: "-15px" }}>
                  {t("notifications.addNotification")}
                </Typography>
              </FormControl>
            </div>
            <div>
              {(selectedNotification !== null) && (

                <FormControl fullWidth>
                  <Button
                    aria-label="delete"
                    startIcon={
                      <DeleteIcon sx={{ color: isDarkMode ? "inherit" : "#fff" }} />
                    }
                    color="error"
                    onClick={handleDeleteBtn}
                  >
                    {t("notifications.delete")}
                  </Button>
                </FormControl>)}
            </div>
          </Stack>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    {...register("name", { required: true })}
                    fullWidth
                    label={t("notifications.name")}
                    margin="normal"
                    variant="outlined"
                    autoFocus
                    sx={{
                      marginBottom: "0px !important",
                    }}
                    autoComplete="off"
                    error={!!errors.name}
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    {...register("description", { required: true })}
                    fullWidth
                    label={t("notifications.description")}
                    margin="normal"
                    variant="outlined"
                    sx={{
                      marginBottom: "0px !important",
                    }}
                    autoComplete="off"
                    error={!!errors.description}
                  />
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
                  <InputLabel id="monitorGroup-selection">
                    {t("notifications.monitorGroupId")}
                  </InputLabel>
                  <Select
                    labelId="monitorGroup-selection"
                    id="monitorGroup-selection"
                    value={watch("monitorGroupId")}
                    onChange={handleMonitorGroupChange}
                    label={t("notifications.monitorGroupId")}
                  >
                    {monitorGroupList
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((group, key) => (
                        <MenuItem value={group.id} key={key}>
                          {group.name}
                        </MenuItem>
                      ))}
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
                  <InputLabel id="monitorType-selection">{t("notifications.Type")}</InputLabel>
                  <Select
                    labelId="monitorType-selection"
                    id="monitorType-selection"
                    label={t("addNewMonitor.monitorType")}
                    value={watch("notificationTypeId")}
                    onChange={handleNotificationTypeChange}
                  >
                    {notificationTypes.map((type, key) => (
                      <MenuItem value={type.id} key={key}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Box>
              {isTypeTeams && <FormTeams errors={errors} register={register} />}
              {isTypeTelegram && <FormTelegram errors={errors} register={register} />}
              {isTypeEmail && <FormEmail errors={errors} register={register} watch={watch} />}
              {isTypeWebHook && <FormWebHook errors={errors} register={register} />}
              {isTypeSlack && <FormSlack errors={errors} register={register} />}
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
                  {t("notifications.cancel")}
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
                  {t("notifications.save")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

      </form>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("notification.confirmDeleteTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("notification.confirmDeleteMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirm}
            color="primary"
            autoFocus
            sx={{ p: "5px 15px" }}
          >
            {t("dashboard.addHttpForm.yes")}
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t("dashboard.addHttpForm.no")}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default FromNotifications;

