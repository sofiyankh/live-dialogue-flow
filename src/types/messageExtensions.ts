import { Message } from './index';

export interface ExtendedMessage extends Message {
  replyTo?: {
    _id: string;
    text: string;
    senderName: string;
  };
}
