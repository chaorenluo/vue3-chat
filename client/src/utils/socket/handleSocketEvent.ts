import { Socket } from 'socket.io-client';
import { useChatStore } from '@store/chat';
import { useAppStore } from '@store/app';

type ChatStoreType<T = typeof useChatStore> = T extends () => infer P ? P : any;

type EventCallbackType = { [key in EventName]: (res: ServerRes, _this: ChatStoreType) => {} };

export enum EventName {
  ADD_GROUP = 'addGroup',
  JOIN_GROUP = 'joinGroup',
  JOIN_GROUP_SOCKET = 'joinGroupSocket',
  GROUP_MESSAGE = 'groupMessage',
  ADD_FRIEND = 'addFriend',
  JOIN_FRIEND_SOCKET = 'joinFriendSocket',
  FRIEND_MESSAGE = 'friendMessage',
  CHAT_DATA = 'chatData',
  EXIT_GROUP = 'exitGroup',
  EXIT_FRIEND = 'exitFriend',
}

export const eventCallback: EventCallbackType = {
  async addGroup(res: ServerRes, _this: ChatStoreType) {},
  async joinGroup(res: ServerRes, _this: ChatStoreType) {},
  async joinGroupSocket(res: ServerRes, _this: ChatStoreType) {},
  async groupMessage(res: ServerRes, _this: ChatStoreType) {},
  async addFriend(res: ServerRes, _this: ChatStoreType) {},
  async joinFriendSocket(res: ServerRes, _this: ChatStoreType) {},
  async friendMessage(res: ServerRes, _this: ChatStoreType) {},
  async chatData(res: ServerRes, _this: ChatStoreType) {
    const { friendData, groupData, userData } = res.data;
    const appStore = useAppStore();
    if (groupData.length) {
      //加入已经添加的群组房间
      for (const group of groupData) {
        _this.emit(EventName.JOIN_GROUP_SOCKET, {
          groupId: group.groupId,
          userId: appStore.user.userId,
        });
        _this.groupGather[group.groupId] = group;
      }
    }
    if (friendData.length) {
      //加入已经添加的好友私聊房间
      for (const friend of friendData) {
        _this.emit(EventName.JOIN_FRIEND_SOCKET, {
          friendId: friend.friendId,
          userId: appStore.user.userId,
        });
        _this.friendGather[friend.friendId] = friend;
      }
    }
    if (userData.length) {
      for (const user of userData) {
        _this.userGather[user.userId] = user;
      }
    }
  },
  async exitGroup(res: ServerRes, _this: ChatStoreType) {},
  async exitFriend(res: ServerRes, _this: ChatStoreType) {},
};

export const initSocketEvent = (socket: Socket, _this: ChatStoreType) => {
  for (const eventType in EventName) {
    // @ts-ignore
    const callback = eventCallback[EventName[eventType] as EventName];
    // @ts-ignore
    socket.on(EventName[eventType], async (res: ServerRes) => await callback(res, _this));
  }
};
