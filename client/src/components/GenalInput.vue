<template>
  <div class="message-input" v-if="activeRoom">
    <a-input
      autocomplete="off"
      type="text"
      placeholder="say hello..."
      v-model:value="textRef"
      ref="inputRef"
      autoFocus
      style="color: #000"
      @press-enter="throttle(preSendMessage)"
    />
    <img
      class="message-input-button"
      @click="throttle(preSendMessage)"
      src="~@/assets/send.png"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';
  import { message } from 'ant-design-vue';
  import { EventName } from '@/utils/socket/handleSocketEvent';
  import { useClipboardImg } from '@hooks/useClipboardImg';

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const textRef = ref('');
  const inputRef = ref<HTMLElement | null>(null);
  const lastTimeRef = ref(0);

  useClipboardImg(
    (data) => {
      console.log(data);
      sendMessage({
        type: chatStore.activeRoom?.groupId ? 'group' : 'friend',
        message: data.imageFile,
        width: data.width,
        height: data.height,
        messageType: 'image',
      });
    },
    (error) => {
      message.error(error);
    },
  );

  const activeRoom = computed(() => {
    return chatStore.activeRoom;
  });

  watch([activeRoom], () => {
    inputRef.value?.focus();
  });

  const preSendMessage = () => {
    if (!textRef.value.trim()) {
      message.error('不能发送空消息!');
      return;
    }
    if (textRef.value.length > 220) {
      message.error('消息太长!');
      return;
    }
    const type = activeRoom.value?.groupId ? 'group' : 'friend';
    const data = { type, message: textRef.value, messageType: 'text' };
    sendMessage(data);
    textRef.value = '';
  };

  const sendMessage = (data: SendMessage) => {
    if (data.type === 'group') {
      chatStore.emit(EventName.GROUP_MESSAGE, {
        userId: appStore.user.userId,
        groupId: activeRoom.value?.groupId,
        content: data.message,
        width: data.width,
        height: data.height,
        messageType: data.messageType,
      });
    } else {
      chatStore.emit(EventName.FRIEND_MESSAGE, {
        userId: appStore.user.userId,
        friendId: chatStore.activeRoom?.userId,
        content: data.message,
        width: data.width,
        height: data.height,
        messageType: data.messageType,
      });
    }
  };

  const throttle = (fn: Function) => {
    let nowTime = +new Date();
    if (nowTime - lastTimeRef.value < 500) {
      return message.error('消息发送太频繁！');
    }
    fn();
    lastTimeRef.value = nowTime;
  };
</script>

<style lang="scss" scoped>
  .message-input {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    width: 100%;
    bottom: 0px;
    input {
      height: 40px;
    }
    .message-input-button {
      width: 30px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 4px;
    }
  }

  //输入框样式
  .ant-input {
    padding: 0 50px 0 50px;
  }
  // 消息工具样式
  .messagte-tool-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 40px;
    text-align: center;
    line-height: 42px;
    font-size: 16px;
    cursor: pointer;
    z-index: 99;
  }
  .message-tool-item {
    width: 0px;
    height: 240px;
    cursor: pointer;
    .message-tool-contant {
      width: 50px;
      padding: 5px;
      border-radius: 5px;
      transition: all linear 0.2s;
      .message-tool-item-img {
        width: 40px;
      }
      .message-tool-item-text {
        text-align: center;
        font-size: 10px;
      }
      &:hover {
        background: rgba(135, 206, 235, 0.6);
      }
    }
  }
</style>
