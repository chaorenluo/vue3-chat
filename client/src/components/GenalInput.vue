<template>
  <div class="message-input" v-if="activeRoom">
    <a-popover placement="topLeft" trigger="hover" class="message-popver">
      <template #content>
        <a-tabs default-key="1" size="small">
          <a-tab-pane key="1" tab="Emoji">
            <genal-emoji @add-emoji="addEmoji" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="工具">
            <div class="message-tool-item">
              <a-upload :show-upload-list="false" :before-upload="beforeImgUpload">
                <div class="message-tool-contant">
                  <img src="~@/assets/photo.png" class="message-tool-item-img" alt="" />
                  <div class="message-tool-item-text">图片</div>
                </div>
              </a-upload>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
      <div class="messagte-tool-icon">😃</div>
    </a-popover>
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
  import GenalEmoji from './GenalEmoji.vue';

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const textRef = ref('');
  const inputRef = ref<HTMLFormElement | null>(null);
  const lastTimeRef = ref(0);

  const { handleImgUpload } = useClipboardImg(
    (data) => {
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

  const beforeImgUpload = (file: File) => {
    throttle(handleImgUpload, file);
    return false;
  };

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

  const throttle = (fn: Function, file?: File) => {
    let nowTime = +new Date();
    if (nowTime - lastTimeRef.value < 500) {
      return message.error('消息发送太频繁！');
    }
    fn(file);
    lastTimeRef.value = nowTime;
  };

  /**
   * 添加emoji到input
   */
  const addEmoji = (emoji: string) => {
    const inputDom = inputRef.value?.$el;
    console.log('inputDom?.selectionStart---', inputDom?.$el);
    if (inputDom?.selectionStart || inputDom?.selectionStart === '0') {
      // 得到光标前的位置
      const startPos = inputDom.selectionStart;
      // 得到光标后的位置
      const endPos = inputDom.selectionEnd;
      // 在加入数据之前获得滚动条的高度
      const restoreTop = inputDom.scrollTop;
      // emoji表情插入至当前光标指定位置
      textRef.value =
        textRef.value.substring(0, startPos) +
        emoji +
        textRef.value.substring(endPos, textRef.value.length);
      // 如果滚动条高度大于0
      if (restoreTop > 0) {
        // 返回
        inputDom.scrollTop = restoreTop;
      }
      inputDom.focus();
      // 设置光标位置至emoji表情后一位
      const position = startPos + emoji.length;
      if (inputDom.setSelectionRange) {
        inputDom.focus();
        setTimeout(() => {
          inputDom.setSelectionRange(position, position);
        }, 10);
      } else if (inputDom.createTextRange) {
        const range = inputDom.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
      }
    } else {
      textRef.value += emoji;
      inputDom?.focus();
    }
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
