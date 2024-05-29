import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import NotificationService from '../../services/NotificationService';
import MonitorService from '../../services/MonitorService';

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
  const { t } = useTranslation('global');
  const [allNotificationList, setAllNotificationList] = React.useState<INotification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (monitorId === undefined) return;

    MonitorService.getMonitorNotification(monitorId).then((res) => {
      const alreadySelected = res.map((element: any) => element.notificationId);
      const containsAll = alreadySelected.every((element) => selectedNotifications.includes(element));
      if (!containsAll) {
        setSelectedNotifications((prevState) => [...prevState, ...alreadySelected]);
      }
    });

    const getAllNotification = async () => {
      NotificationService.getAll().then((res) => {
        const sortedRes = res.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        setAllNotificationList(sortedRes);
      });
    };

    getAllNotification();
  }, [monitorId]);

  const handleToggle = (value: number) => () => {
    const currentIndex = selectedNotifications.indexOf(value);
    const newSelected = [...selectedNotifications];

    if (currentIndex === -1) {
      newSelected.push(value);
      const request = { monitorId: monitorId, notificationId: value };
      MonitorService.addMonitorNotification(request).then(() => {});
    } else {
      newSelected.splice(currentIndex, 1);
      const request = { monitorId: monitorId, notificationId: value };
      MonitorService.removeMonitorNotification(request).then(() => {});
    }

    setSelectedNotifications(newSelected);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="notification-dialog-title"
      aria-describedby="notification-dialog-description"
      
    >
      <DialogTitle id="alert-dialog-title">
        {t('notifications.title')}
      </DialogTitle>
      <FormControl sx={{ m: 1, width: '500px' }}>
        <List sx={{ width: '100%', maxWidth: '500ox' ,bgcolor: 'background.paper' }}>
          {allNotificationList.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;

            return (
              <ListItem
                key={item.id}
                disablePadding
              >
                <ListItemButton onClick={handleToggle(item.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedNotifications.indexOf(item.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={item.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </FormControl>
    </Dialog>
  );
};

export default NotificationsListDialog;
