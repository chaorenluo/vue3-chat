<template>
  <div class="message">
    <div class="message-header">
      <div class="message-header-box">
        <span class="message-header-text">{{ chatName }}</span>
        <SyncOutlined spin class="message-header-icon" v-if="chatStore.dropped" />
        <genal-active :type="isGroup ? 'group' : 'friend'" />
      </div>
    </div>
    <transition name="loading">
      <div class="message-loading" v-if="spinningRef && !isNoDataRef">
        <SyncOutlined spin class="message-loading-icon" />
      </div>
    </transition>
    <div class="message-main" :style="{ opacity: messageOpacityRef }">
      <div class="message-content">
        <transition name="noData">
          <div class="message-content-noData" v-if="isNoDataRef">没有更多消息了~</div>
        </transition>
        <template v-for="item in chatStore.activeRoom?.messages" :key="item.userId + item.time">
          <div
            class="message-content-message"
            :class="{ 'text-right': item.userId === appStore.user.userId }"
          >
            <genal-avatar :data="item" :showTime="false" />
            <div>
              <a
                class="message-content-text"
                v-if="_isUrl(item.content)"
                :href="item.content"
                target="_blank"
                >{{ item.content }}</a
              >
              <div
                class="message-content-text"
                v-text="_parseText(item.content)"
                v-else-if="item.messageType === 'text'"
              ></div>
              <div
                class="message-content-image"
                v-if="item.messageType === 'image'"
                :style="getImageStyle(item.content)"
              >
                <viewer style="display: flex; align-items: center">
                  <img :src="'api/static/' + item.content" alt="" />
                </viewer>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <genal-input />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAppStore } from '@store/app';
  import { useChatStore } from '@store/chat';
  import GenalActive from './GenalActive.vue';
  import GenalAvatar from './GenalAvatar.vue';
  import GenalInput from './GenalInput.vue';
  import { isUrl, parseText } from '@/utils/common';

  const appStore = useAppStore();
  const chatStore = useChatStore();
  const spinningRef = ref(false);
  const isNoDataRef = ref(false);
  const messageOpacityRef = ref(1);

  const isGroup = computed(() => {
    if (chatStore.activeRoom && chatStore.activeRoom?.groupId) {
      return !!chatStore.activeGroupUser[chatStore.activeRoom?.groupId];
    }
    return false;
  });
  const chatName = computed(() => {
    if (chatStore.activeRoom?.groupId) {
      return chatStore.groupGather[chatStore.activeRoom.groupId].groupName;
    } else if (chatStore.activeRoom?.userId) {
      return chatStore.friendGather[chatStore.activeRoom?.userId].userName;
    }
    return '';
  });

  const _isUrl = (url: string) => {
    return isUrl(url);
  };

  const _parseText = (txt: string) => {
    return parseText(txt);
  };

  /**
   * 根据图片url设置图片框宽高, 注意是图片框
   */
  const getImageStyle = (src: string) => {
    let arr = src.split('$');
    let width = Number(arr[2]);
    let height = Number(arr[3]);
    if (appStore.mobile) {
      // 如果是移动端,图片最大宽度138, 返回值加12是因为设置的是图片框的宽高要加入padding值
      if (width > 138) {
        height = (height * 138) / width;
        width = 138;
        return {
          width: `${width + 12}px`,
          height: `${height + 12}px`,
        };
      }
    }
    return {
      width: `${width + 12}px`,
      height: `${height + 12}px`,
    };
  };
</script>

<style lang="scss" scoped>
  .message {
    overflow: hidden;
    height: 100%;
    position: relative;
    .message-header {
      height: 60px;
      line-height: 60px;
      z-index: 100;
      background-color: rgb(0, 0, 0, 0.6);
      .message-header-text {
        color: #fff;
      }
      .message-header-icon {
        margin-left: 5px;
      }
    }
    .message-loading {
      position: absolute;
      left: calc(50% - 18px);
      top: 60px;
      z-index: 99;
      .message-loading-icon {
        margin: 10px auto;
        font-size: 20px;
        padding: 8px;
        border-radius: 50%;
        background-color: rgb(0, 0, 0, 0.8);
      }
    }
    .message-main {
      height: calc(100% - 100px);
      overflow: auto;
      position: relative;
      .message-content {
        .message-content-noData {
          line-height: 50px;
        }
        .message-content-message {
          text-align: left;
          margin: 10px 20px;
          .message-content-text,
          .message-content-image {
            max-width: 600px;
            display: inline-block;
            overflow: hidden;
            margin-top: 4px;
            padding: 6px;
            background-color: rgba(0, 0, 0, 0.4);
            font-size: 16px;
            border-radius: 5px;
            text-align: left;
            word-break: break-word;
          }
          .message-content-image {
            max-height: 350px;
            max-width: 350px;
            img {
              cursor: pointer;
              max-width: 335px;
              max-height: 335px;
            }
          }
        }
        .text-right {
          text-align: right !important;
          .avatar {
            justify-content: flex-end;
          }
        }
      }
    }
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

  // 移动端样式
  @media screen and (max-width: 768px) {
    .message-main {
      .message-content-image {
        img {
          cursor: pointer;
          max-width: 138px !important;
          height: inherit !important;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .message-header-box {
      .message-header-text {
        display: block;
        width: 36%;
        margin: 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .message-header-icon {
        position: absolute;
        top: 17px;
        right: 60px;
        font-size: 25px;
      }
    }
  }
  .loading-enter-active {
    transition: all 0.3s ease;
  }
  .loading-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .loading-enter,
  .loading-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }

  .noData-enter-active,
  .noData-leave-active {
    transition: opacity 1s;
  }
  .noData-enter,
  .noData-leave-to {
    opacity: 0;
  }

  .transition {
    display: inline-block;
    animation: transition 0.4s ease;
  }
  @keyframes transition {
    0% {
      transform: translateY(-40px);
      opacity: 0;
    }
    60% {
      transform: translateY(10px);
      opacity: 0.6;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
</style>
