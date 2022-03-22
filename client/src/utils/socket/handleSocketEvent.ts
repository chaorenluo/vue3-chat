import { Socket } from 'socket.io-client';
import { useChatStore } from '@store/chat';

type chatStoreType<T = typeof useChatStore> = T extends () => infer P ? P : any;

export const socketEvent = {
  addGroup: {
    name: 'addGroup',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  JOINGROUP: {
    name: 'joinGroup',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  JOINGROUPSOCKET: {
    name: 'joinGroupSocket',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  GROUPMESSAGE: {
    name: 'groupMessage',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  ADDFRIEND: {
    name: 'addFriend',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  JOINFRIENDSOCKE: {
    name: 'joinFriendSocket',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  FRIENDMESSAGE: {
    name: 'friendMessage',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  CHATDATA: {
    name: 'chatData',
    async callback(res: ServerRes, _this: chatStoreType) {
      console.log(res.data);
      console.log(_this);
    },
  },
  EXITGROUP: {
    name: 'exitGroup',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
  EXITFRIEND: {
    name: 'exitFriend',
    async callback(res: ServerRes, _this: chatStoreType) {},
  },
};

export const initSocketEvent = (socket: Socket, _this: chatStoreType) => {
  Object.values(socketEvent).map((item) => {
    socket.on(item.name, async (res: ServerRes) => await item.callback(res, _this));
  });
};
