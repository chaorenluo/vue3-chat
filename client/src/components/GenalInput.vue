<template>
  <div>xxx</div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const textRef = ref('');
  const lastTimeRef = ref(0);
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
