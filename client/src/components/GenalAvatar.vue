<template>
  <div class="avatar" v-if="userInfo">
    <a-popover v-if="userInfo.userId != user.userId" trigger="click">
      <template #content>
        <div class="avatar-card">
          <a-avatar :size="60" :src="userInfo.avatar" />
          <div>{{ userInfo.userName }}</div>
          <a-button
            v-if="user.role === 'admin'"
            style="margin-bottom: 5px"
            @click="deleteUser(props.data.userId)"
            type="primary"
          >
            删除用户
          </a-button>
          <a-button
            @click="_setActiveRoom(data.userId)"
            type="primary"
            v-if="chatStore.friendGather[data.userId]"
            >进入私聊</a-button
          >
          <a-button @click="addFriend(data.userId)" type="primary" v-else>添加好友</a-button>
        </div>
      </template>
      <a-avatar class="avatar-img" :src="userInfo.avatar" />
    </a-popover>
    <a-avatar v-else class="avatar-img" :src="userInfo.avatar" />
    <div>
      <span class="avatar-name">{{ userInfo.userName }}</span>
      <span class="avatar-time" v-if="showTime">{{ _formatTime(userInfo.createTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';
  import { EventName } from '@/utils/socket/handleSocketEvent';
  import { formatTime } from '@/utils/common';
  import apis from '@api';

  interface Props {
    showTime: boolean;
    data: User;
  }

  const props = withDefaults(defineProps<Props>(), {
    showTime: false,
    data: {},
  });
  const appStore = useAppStore();
  const chatStore = useChatStore();

  const addFriend = (friendId: string) => {
    chatStore.emit(EventName.ADD_FRIEND, {
      userId: appStore.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf(),
    });
  };

  const userInfo = computed(() => {
    return chatStore.userGather[props.data.userId];
  });

  const user = computed(() => {
    return appStore.user;
  });

  const _formatTime = (time: number) => {
    return formatTime(time);
  };

  const deleteUser = async (userId: string) => {
    await apis.user.deleteUser({
      did: userId,
    });
  };

  const _setActiveRoom = (userId: string) => {
    chatStore.setActiveRoom(chatStore.friendGather[userId]);
  };
</script>

<style lang="scss" scoped>
  .avatar {
    display: flex;
    align-items: center;
    height: 37px;
    .avatar-img {
      cursor: pointer;
      width: 35px;
      height: 35px;
    }
    .avatar-name {
      margin-left: 5px;
    }
    .avatar-time {
      font-size: 12px;
      color: rgb(255, 255, 255, 0.75);
      margin-left: 3px;
    }
  }
  .avatar-card {
    display: flex;
    font-size: 18px;
    flex-direction: column;
    align-items: center;
    > div {
      margin: 4px;
    }
  }
</style>
