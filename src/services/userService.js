import { v4 as uuidv4 } from 'uuid';

const newMessageService = (newMessage, user, emiter) => {
  const uniqueId = uuidv4();

  if (!newMessage) {
    return 'Message required';
  }

  if (!user) {
    return 'User required';
  }

  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const day = new Date().getDate();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes().toString().padStart(2, '0');

  const time = `${day}/${month}/${year} at ${hours}:${minutes}`;

  const messageObj = {
    id: uniqueId,
    user: user,
    message: newMessage,
    time: time,
  };

  return messageObj;
};

export const userServices = {
  newMessageService,
};
