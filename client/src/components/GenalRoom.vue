<template>
  <div class="room" v-if="chatArr.length">
    <div
      v-for="(chat, index) in chatArr"
      :key="(isGroup(chat) ? chat.groupId : chat.userId) + index"
    >
      <div
        v-if="isGroup(chat)"
        class="room-card"
        :class="{ active: chatStore.activeRoom && chatStore.activeRoom.groupId === chat.groupId }"
        @click="changeActiveRoom(chat)"
      >
        <a-badge class="room-card-badge" :count="chatStore.unReadGather[chat.groupId]" />
        <img class="room-card-type" src="../assets/group.png" alt="" />
        <div class="room-card-message">
          <div class="room-card-name">{{ chat.groupName }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div
              class="text"
              v-text="_parseText(chat.messages[chat.messages.length - 1].content)"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"
            ></div>
            <div
              class="image"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'image'"
            >
              [图片]
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="room-card"
        :class="{
          active:
            chatStore.activeRoom &&
            !chatStore.activeRoom.groupId &&
            chatStore.activeRoom.userId === chat.userId,
        }"
        @click="changeActiveRoom(chat)"
      >
        <a-badge class="room-card-badge" :count="chatStore.unReadGather[chat.userId]" />
        <img
          class="room-card-type"
          :src="chatStore.friendGather[chat.userId].avatar"
          :class="{ offLine: !activeUserGather.hasOwnProperty(chat.userId) }"
          alt=""
        />
        <div class="room-card-message">
          <div class="room-card-name">{{ chat.userName }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div
              class="text"
              v-text="_parseText(chat.messages[chat.messages.length - 1].content)"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"
            ></div>
            <div
              class="image"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'image'"
              >[图片]</div
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { useChatStore } from '@store/chat';
  import { parseText } from '@utils/common';
  import { DEFAULT_GROUP } from '@/enum';

  type RoomType = Friend | Group;

  const chatStore = useChatStore();
  const emit = defineEmits<(name: 'setActiveRoom', data: any) => void>();

  const isGroup = (val: any): val is Group => {
    return val.groupName;
  };
  const activeUserGather = computed(() => {
    return chatStore.activeGroupUser[DEFAULT_GROUP] || {};
  });
  const chatArr = computed<Array<RoomType>>(() => {
    let chatArr: Array<RoomType> = [];
    chatArr = [...Object.values(chatStore.friendGather), ...Object.values(chatStore.groupGather)];
    console.log(chatArr);
    chatArr = chatArr.sort((a, b) => {
      if (a.messages && b.messages) {
        return b.messages[a.messages.length - 1].time - a.messages[a.messages.length - 1].time;
      }
      if (a.messages) {
        return -1;
      }
      return 1;
    });
    return chatArr;
  });
  const changeActiveRoom = (activeRoom: RoomType) => {
    emit('setActiveRoom', activeRoom);
    chatStore.loseUnreadGather(isGroup(activeRoom) ? activeRoom.groupId : activeRoom.userId);
  };
  const _parseText = (text: string) => {
    return parseText(text);
  };
</script>
<style lang="scss" scoped>
  @mixin button($bcolor, $url, $x1, $y1, $bor, $col) {
    background: $bcolor;
    -webkit-mask: url($url);
    mask: url($url);
    -webkit-mask-size: $x1 $y1;
    mask-size: $x1 $y1;
    border: $bor;
    color: $col;
  }

  .room {
    height: calc(100% - 60px);
    overflow: auto;
    .room-card {
      position: relative;
      min-height: 70px;
      display: flex;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 5px 10px;
      text-align: left;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: rgb(0, 0, 0, 0.4);
      }
      &.active {
        background-color: rgb(0, 0, 0, 0.5);
        @include button(rgb(0, 0, 0, 0.5), '../assets/animate.png', 3000%, 100%, none, #fff);
        -webkit-animation: ani 2s steps(29) forwards;
        animation: ani 0.5s steps(29) forwards;
      }
      .room-card-badge {
        position: absolute;
        right: 10px;
        top: 10px;
        ::v-deep.ant-badge-count {
          box-shadow: none;
        }
      }
      .room-card-type {
        width: 35px;
        height: 35px;
        margin-right: 5px;
        border-radius: 50%;
        object-fit: cover;
        &.offLine {
          filter: grayscale(90%);
        }
      }
      .room-card-message {
        flex: 1;
        display: flex;
        width: 75%;
        flex-direction: column;
        .room-card-name {
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
        .room-card-new {
          > * {
            display: block;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          }
          color: rgb(255, 255, 255, 0.6);
          font-size: 14px;
        }
      }
    }
  }

  @keyframes ani {
    from {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
    }

    to {
      -webkit-mask-position: 0 0;
      mask-position: 0 0;
    }
  }
</style>
