import {
  Checkbox,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NotificationService from "../../services/NotificationService";
import MonitorService from "../../services/MonitorService";

interface INotificationsListDialog {
  openDialog: boolean;
  handleCloseDialog: () => void;
  monitorId: number | undefined;
}

const NotificationsListDialog: React.FC<INotificationsListDialog> = ({
  openDialog,
  handleCloseDialog,
  monitorId,
}) => {
  const { t } = useTranslation("global");
  const [allNotificationList, setAllNotificationList] = useState<
    INotification[]
  >([]);
  const [selectedNotifications, setSelectedNotifications] = useState<any[]>([]);

  useEffect(() => {
    MonitorService.getMonitorNotification(monitorId).then((res) => {
      const alreadySelected = res.map((element: any) => {
        return element.notificationId;
      });
      const containsAll = alreadySelected.every((element) =>
        selectedNotifications.includes(element)
      );
      if (!containsAll) {
        setSelectedNotifications((prevState) => [
          ...prevState,
          ...alreadySelected,
        ]);
      }
    });

    const getAllNotification = async () => {
      NotificationService.getAll().then((res) => {
        const sortedRes = res.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        setAllNotificationList(sortedRes);
      });
    };


    getAllNotification();
  }, [monitorId]);

  const handleChange = (
    event: SelectChangeEvent<number[]>
  ) => {

    const {
      target: { value },
    } = event;
    const selected = typeof value === "string" ? value.split(",").map(Number) : value;

    const addedNotifications = selected.filter((id) => !selectedNotifications.includes(id));
    const removedNotifications = selectedNotifications.filter((id) => !selected.includes(id));


    if (addedNotifications.length > 0) {
      const request: any = {
        monitorId: monitorId,
        notificationId: addedNotifications[0],
      };
      MonitorService.addMonitorNotification(request).then(() => {
      });
    }

    if (removedNotifications.length > 0) {
      const request: any = {
        monitorId: monitorId,
        notificationId: removedNotifications[0],
      };
      MonitorService.removeMonitorNotification(request).then(() => {
      });
    }

    setSelectedNotifications(selected);

  };
  useEffect(() => {
    console.log(selectedNotifications);
  }, [selectedNotifications]);
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="notification-dialog-title"
      aria-describedby="notification-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("notifications.title")}
      </DialogTitle>
      <FormControl sx={{ m: 1, width: 550 }}>
        <InputLabel id="demo-multiple-checkbox-label">Notification</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedNotifications}
          defaultValue={selectedNotifications}
          onChange={handleChange}
          input={<OutlinedInput label="Notification" />}
          renderValue={(selected) => {
            const valueMapping = allNotificationList.reduce(
              (acc: any, item) => {
                acc[item.id] = item.name;
                return acc;
              },
              {}
            );
            return selected.map((id) => valueMapping[id] || id).join(", ");
          }}
        >
          {allNotificationList.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={selectedNotifications.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Dialog>
  );
};

export default NotificationsListDialog;
