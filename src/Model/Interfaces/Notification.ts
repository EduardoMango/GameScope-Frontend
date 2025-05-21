import {PageInfo} from './Review';

export interface Notification {
  id: number;
  message: string;
  url: string | null;
  date: Date;
}

export interface NotificationResponse {
  _embedded: {
    notificationDTOList: Notification[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: PageInfo;
}
