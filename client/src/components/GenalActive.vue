<template>
  <div>
    <div class="active">
      <div v-if="type === 'group'">
        <TeamOutlined
          @click="toggleGroupUser"
          class="active-button"
          :class="{ heightLight: showGroupUserRef }"
        />
        <a-drawer
          placement="right"
          :closable="false"
          :visible="showGroupUserRef"
          :get-container="getElement"
          @close="toggleGroupUser"
          :wrap-style="{ position: 'absolute' }"
        >
          <div class="active-content" v-if="currentGroupData">
            <div class="actiev-content-title">群聊管理</div>
            <div class="active-content-sum"
              >在线人数: {{ Object.keys(currentGroupData).length }}</div
            >
            <div class="active-content-users">
              <div class="active-content-user" v-for="data in currentGroupData" :key="data.userId">
                <genal-avatar :data="data" :show-time="false" />
                {{ data.userName }}
              </div>
            </div>
            <a-button type="danger" class="active-content-out" @click="exitGroup">退出</a-button>
          </div>
        </a-drawer>
      </div>
      <div v-else>
        <a-popconfirm
          title="确定要删除该好友吗？"
          placement="bottomRight"
          ok-text="Yes"
          cancel-text="No"
          @confirm="exitFriend"
        >
          <UserDeleteOutlined class="active-button" />
        </a-popconfirm>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import GenalAvatar from './GenalAvatar.vue';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';
  import { EventName } from '@/utils/socket/handleSocketEvent';

  interface Props {
    type: string;
  }

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const props = withDefaults(defineProps<Props>(), {
    type: '',
  });
  const showGroupUserRef = ref(false);

  watch([props], () => {
    if (props.type === 'friend') {
      showGroupUserRef.value = false;
    }
  });

  const currentGroupData = computed(() => {
    if (chatStore.activeRoom && chatStore.activeRoom?.groupId) {
      return chatStore.activeGroupUser[chatStore.activeRoom?.groupId];
    }
    return [];
  });

  const toggleGroupUser = () => {
    showGroupUserRef.value = !showGroupUserRef.value;
  };

  const getElement = () => {
    return document.getElementsByClassName('message')[0];
  };

  const exitGroup = () => {
    chatStore.emit(EventName.EXIT_GROUP, {
      userId: appStore.user.userId,
      groupId: chatStore.activeRoom?.groupId,
    });
  };

  const exitFriend = () => {
    chatStore.emit(EventName.EXIT_FRIEND, {
      userId: appStore.user.userId,
      friendId: chatStore.activeRoom?.userId,
    });
  };
</script>
<style lang="scss" scoped>
  .active {
    position: absolute;
    width: 170px;
    right: 0;
    z-index: 100;
    border-radius: 0 0 5px 5px;
    .active-button {
      position: absolute;
      z-index: 999;
      top: -43px;
      right: 20px;
      font-size: 25px;
      cursor: pointer;
      &:active {
        color: skyblue;
      }
    }
    .active-button.heightLight {
      color: skyblue;
    }
  }
  ::-webkit-scrollbar {
    display: none !important;
  }
</style>
