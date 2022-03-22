import { defineStore } from 'pinia';
import { Socket } from 'socket.io-client';
import { useAppStore } from '@store/app';
import { io } from 'socket.io-client';
import { initSocketEvent, socketEvent } from '@utils/socket/handleSocketEvent';

export interface ChatState {
  socket: Socket;
  dropped: boolean;
  activeGroupUser: activeGroupUser;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  userGather: FriendGather;
  unReadGather: UnReadGather;
}

export const useChatStore = defineStore({
  id: 'chat-store',
  state: (): ChatState => ({
    // @ts-ignore
    socket: null,
    dropped: false,
    activeGroupUser: {},
    activeRoom: null,
    groupGather: {},
    userGather: {},
    friendGather: {},
    unReadGather: {},
  }),
  actions: {
    async connectSocket() {
      const appStore = useAppStore();
      const user = appStore.user;

      this.socket = io(`http://localhost:3001/?userId=${user.userId}`, { reconnection: true });
      this.socket.on('connect', () => {
        this.socket.emit(socketEvent.CHATDATA.name, user);
      });
      //初始化事件监听
      initSocketEvent(this.socket as Socket, this);
    },
  },
});
