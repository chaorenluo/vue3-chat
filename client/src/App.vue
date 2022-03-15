<template>
  <router-view />
  <img class="background" v-if="appStore.background" :src="appStore.background" alt="" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAppStore } from '@store/app';
  import { Background } from './enum';

  const appStore = useAppStore();

  const isMobile = (): boolean => {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    );
    return !!(flag && flag.length);
  };
  onMounted(() => {
    appStore.setMobile(isMobile());

    if (!appStore.background || appStore.background.trim().length) {
      let background = localStorage.getItem('background');
      appStore.setBackground(background ? background : Background.DEFAULT_BACKGROUND);
    }
  });
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-size: cover;
    color: rgba(255, 255, 255, 0.85);
    background-color: #fff;
    .background {
      position: absolute;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
</style>
