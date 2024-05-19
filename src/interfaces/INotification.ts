interface INotification {
  id: number;
  monitorGroupId: number;
  name: string;
  notificationTypeId: number;
  description: string;
  notificationSlack?: {
      notificationId: number;
      channel: string;
      webHookUrl: string;
  };
  notificationEmail?: {
      notificationId: number;
      fromEmail: string;
      toEmail: string;
      hostname: string;
      port: number;
      username: string;
      password: string;
      toCCEmail: string;
      toBCCEmail: string;
      enableSsl: boolean;
      subject: string;
      body: string;
      isHtmlBody: boolean;
  };
  notificationTeams?: {
      notificationId: number;
      webHookUrl: string;
  };
  notificationTelegram?: {
      notificationId: number;
      chatId: number;
      telegramBotToken: string;
  };
  notificationWebHook?: {
      notificationId: number;
      message: string;
      webHookUrl: string;
      body: string;
      headersJson: string;
      headers: { item1: string; item2: string }[];
  };
  notificationType: INotificationType;
  message?: string;
}
