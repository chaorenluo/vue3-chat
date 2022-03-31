<template>
  <div class="emoji-content">
    <div class="emoji-content-item" v-for="(arr, index) in emojiArr" :key="index">
      <span v-for="(item, key) in arr" :key="key" @click="addEmoji(item)">{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { EMOJI } from '@enum/index';
  import { cuttingArr } from '@utils/common';

  const emit = defineEmits<(key: 'addEmoji', data: string) => void>();
  const emoji = EMOJI.split(' ');
  let emojiArr = cuttingArr(emoji, 9);

  const addEmoji = (item: string) => {
    emit('addEmoji', item);
  };
</script>

<style lang="scss" scoped>
  .emoji-content {
    color: #000;
    font-size: 20px;
    width: 250px;
    // 禁止文字被鼠标选中
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .emoji-content-item {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: nowrap;
      span {
        cursor: pointer;
      }
    }
  }
</style>
