import { defineStore } from 'pinia';
import { Socket } from 'socket.io-client';
import { useAppStore } from '@store/app';
import { io } from 'socket.io-client';

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
      console.log('---3');
      this.socket = io(`ws://localhost:3000/?userId=${user.userId}`, { reconnection: true });
      this.socket.on('connect', () => {
        console.log('连接成功');
        this.socket.emit('chatData', user);
      });
    },
  },
});
