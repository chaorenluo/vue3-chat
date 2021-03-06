<template>
  <div
    class="chat"
    :style="{
      '--bg-image': `url('${appStore.background}')`,
    }"
  >
    <div class="chat-part1">
      <genal-tool @logout="logout" />
    </div>
    <div class="chat-part2">
      <genal-search
        @add-group="addGroup"
        @join-group="joinGroup"
        @set-active-room="setActiveRoom"
        @add-friend="addFriend"
      />
      <genal-room @set-active-room="setActiveRoom" />
    </div>
    <div class="chat-part3">
      <TeamOutlined class="chat-team" @click="toggleDrawer" />
      <div class="chat-tool">
        <MenuFoldOutlined />
        <MenuUnfoldOutlined />
      </div>
      <genal-message v-if="chatStore.activeRoom" />
    </div>
    <genal-join
      @register="handleRegister"
      @login="handleLogin"
      :loading="loadingRef"
      :showModal="showModalRef"
    />
  </div>
</template>

<script setup lang="ts">
  import { useUser } from '@/hooks/userUser';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';
  import GenalTool from '@components/GenalTool.vue';
  import GenalJoin from '@components/GenalJoin.vue';
  import GenalSearch from '@components/GenalSearch.vue';
  import GenalRoom from '@components/GenalRoom.vue';
  import GenalMessage from '@components/GenalMessage.vue';
  import { ref } from 'vue';
  import { EventName } from '@utils/socket/handleSocketEvent';

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const loadingRef = ref(false);
  const visibleDrawerRef = ref(false);
  const { showModalRef, getUser } = useUser();
  getUser();

  const unifiedUserWith = async (fn: Function) => {
    loadingRef.value = true;
    let res = await fn();
    loadingRef.value = false;
    if (res) {
      showModalRef.value = false;
      chatStore.connectSocket();
    }
    return res;
  };

  // 注册
  const handleRegister = async (user: pickUser) => {
    await unifiedUserWith(async () => await appStore.register(user));
  };

  // 登录
  const handleLogin = async (user: pickUser) => {
    await unifiedUserWith(async () => await appStore.login(user));
  };

  //注销
  const logout = () => {
    appStore.clearUser();
    showModalRef.value = true;
  };

  // 创建群组
  const addGroup = (groupName: string) => {
    chatStore.emit(EventName.ADD_GROUP, {
      userId: appStore.user.userId,
      groupName: groupName,
      createTime: new Date().valueOf(),
    });
  };

  // 加入群组
  const joinGroup = (groupId: string) => {
    alert(groupId);
    chatStore.emit(EventName.JOIN_GROUP, {
      userId: appStore.user.userId,
      groupId: groupId,
    });
  };

  // 添加好友
  const addFriend = (friendId: string) => {
    chatStore.emit(EventName.ADD_FRIEND, {
      userId: appStore.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf(),
    });
  };

  const setActiveRoom = (room: Friend & Group) => {
    chatStore.setActiveRoom(room);
  };

  const toggleDrawer = () => {
    visibleDrawerRef.value = !visibleDrawerRef.value;
  };
</script>

<style lang="scss" scoped>
  .chat {
    font-size: 16px;
    z-index: 999;
    max-width: 1000px;
    min-width: 300px;
    width: 100%;
    height: 80%;
    max-height: 900px;
    min-height: 470px;
    position: relative;
    margin: auto 20px;
    box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    .chat-part1 {
      width: 74px;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.7);
    }
    .chat-part2 {
      width: 230px;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.3);
    }
    .chat-part3 {
      flex: 1;
      height: 100%;
      background-color: rgb(0, 0, 0, 0.2);
      overflow-y: hidden;
      position: relative;
      .chat-group {
        height: 53px;
        border-bottom: 1px solid #ccc;
        line-height: 50px;
        font-weight: bold;
      }
    }
    .chat-team {
      display: none;
    }
    .chat-tool {
      display: none;
    }
  }
  .chat::after {
    content: '';
    background: var(--bg-image) 0 / cover fixed;
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: blur(10px);
    transform: scale(1.08);
    z-index: -1;
  }
  @media screen and (max-width: 768px) {
    .chat {
      margin: 0;
      height: 100%;
      .chat-part2 {
        display: none;
      }
      .chat-team {
        display: block !important;
        position: absolute;
        font-size: 25px;
        top: 17px;
        left: 60px;
        z-index: 999;
        &:active {
          color: skyblue;
        }
      }
      .chat-tool {
        display: block !important;
        position: absolute;
        font-size: 25px;
        top: 13px;
        left: 20px;
        z-index: 999;
        &:active {
          color: skyblue;
        }
      }
    }
  }
</style>
