<template>
  <div class="tool">
    <div class="tool-avatar">
      <div class="tool-avatar-img" @click="showUserInfo()">
        <img v-if="user" :src="user.avatar" />
      </div>
      <div class="tool-avatar-name">{{ user.userName }}</div>
    </div>
    <a-tooltip placement="topLeft" arrow-point-at-center>
      <template #title>
        <div>请文明聊天</div>
        <div>截图粘贴可发送图片</div>
      </template>
      <BulbOutlined class="tool-tip icon" />
    </a-tooltip>
    <SkinOutlined class="tool-skin icon" @click="showBackgroundModalRef = true" />
    <PoweroffOutlined class="tool-out icon" @click="logout" />
    <a-modal
      v-model:visible="showUserModalRef"
      title="用户信息"
      @cancel="showUserModalRef = false"
      :footer="null"
    >
      <div class="tool-user">
        <div
          @mouseover="showUploadRef = true"
          @mouseleave="showUploadRef = false"
          class="tool-user-avatar"
          :class="{ active: showUploadRef || uploadingRef }"
        >
          <a-avatar :src="user.avatar" class="img" :size="120" />
          <a-upload
            v-if="showUploadRef && !uploadingRef"
            class="tool-user-upload"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <div class="text">
              <UploadOutlined style="margin-right: 4px" />
              <span>更换头像</span>
            </div>
          </a-upload>
          <LoadingOutlined class="loading" v-if="uploadingRef" spin />
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改用户名</div>
          <a-input class="tool-user-input" v-model:value="usernameRef" placeholder="请输入用户名" />
          <a-button type="primary" @click="changeUserName">确认</a-button>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改密码</div>
          <a-input-password
            class="tool-user-input"
            v-model:value="passwordRef"
            placeholder="请输入密码"
          />
          <a-button type="primary" @click="changePassword">确认</a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="showBackgroundModalRef"
      title="用户信息"
      @cancel="showBackgroundModalRef = false"
      :footer="null"
    >
      <div class="tool-user-info">
        <div class="tool-user-title" style="width: 65px">
          <span>背景图</span>
          <a-tooltip placement="topLeft" arrow-point-at-center>
            <template #title>
              <span>输入空格时为默认背景, 支持 jpg, png, gif等格式</span>
            </template>
            <ExclamationCircleOutlined style="margin-left: 5px" />
          </a-tooltip>
        </div>
        <a-input
          v-model:value="backgroundRef"
          class="tool-user-input"
          placeholder="请输入背景图片网址"
        />
        <a-button type="primary" @click="changeBackground">确认</a-button>
      </div>
      <div class="tool-recommend">
        <div
          class="recommend"
          v-for="(item, key) in backgroundList"
          :key="key"
          @click="appStore.setBackground(item.img)"
        >
          <img :src="item.img" alt="" />
          <span class="text">{{ item.name }}</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { processReturn, nameVerify, passwordVerify } from '@utils/common';
  import { useAppStore } from '@store/app';
  import apis from '@/api';
  import { Background } from '@enum/index';

  const appStore = useAppStore();
  const user = computed(() => {
    return appStore.user;
  });

  const backgroundList = ref([
    {
      name: '阿童木',
      img: Background.ASTR0_BOY_BACKGROUND,
    },
    {
      name: 'VSCode摸鱼',
      img: Background.VSCODE_FISHING_BACKGROUND,
    },
    {
      name: '山谷',
      img: Background.VALLEY_BACKGROUND,
    },
    {
      name: '云朵',
      img: Background.CLOUDS_BACKGROUND,
    },
    {
      name: '少女',
      img: Background.GIRL_BACKGROUND,
    },
    {
      name: '猫咪',
      img: Background.CAT_BACKGROUND,
    },
  ]);
  const showUploadRef = ref(false);
  const showUserModalRef = ref(false);
  const showBackgroundModalRef = ref(false);
  const usernameRef = ref('');
  const passwordRef = ref('');
  const backgroundRef = ref('');
  const uploadingRef = ref(false);
  let avatarRef: File;
  const emit = defineEmits<(eventName: 'logout') => void>();

  const logout = () => {
    emit('logout');
  };

  const showUserInfo = () => {
    showUserModalRef.value = true;
  };

  const changeUserName = async () => {
    if (!nameVerify(usernameRef.value)) {
      return;
    }
    let res = await apis.user.updateUserName(usernameRef.value);
    let data = processReturn(res);
    if (data) {
      appStore.setUser(data);
    }
  };

  const changePassword = async () => {
    if (!passwordVerify(passwordRef.value)) {
      return;
    }
    let res = await apis.user.updatePassword(passwordRef.value);
    let data = processReturn(res);
    if (data) {
      appStore.setUser(data);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/gif';

    if (!isJpgOrPng) {
      message.error('请上传jpeg/jpg/png/gif格式的图片!');
    }
    const isLt1M = file.size / 1024 / 1024 < 0.5;
    if (!isLt1M) {
      message.error('图片必须小于500K!');
    }
    avatarRef = file;
    handleUpload();
    return false;
  };

  const handleUpload = async () => {
    uploadingRef.value = true;
    const formData = new FormData();
    formData.append('avatar', avatarRef);
    let data = processReturn(await apis.user.setUserAvatar(formData));
    uploadingRef.value = false;
    if (data) {
      appStore.setUser(data);
      showUploadRef.value = false;
    }
  };

  const changeBackground = () => {
    let background = !appStore.background.trim().length
      ? Background.DEFAULT_BACKGROUND
      : backgroundRef.value;
    appStore.setBackground(background);
    showBackgroundModalRef.value = false;
  };
</script>

<style lang="scss" scoped>
  .tool {
    padding: 10px 5px;
    height: 98%;
    position: relative;
    .tool-avatar {
      margin-top: 3px;
      .tool-avatar-img {
        margin: 0 auto;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .tool-avatar-name {
        color: #fff;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        margin-top: 2px;
      }
    }
    .tool-tip {
      bottom: 190px;
    }
    .tool-skin {
      bottom: 130px;
    }
    .tool-github {
      color: rgba(255, 255, 255, 0.85);
      bottom: 70px;
    }
    .tool-out {
      bottom: 10px;
    }
    .icon {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 25px;
      font-size: 25px;
      cursor: pointer;
      z-index: 100;
      &:hover {
        color: skyblue;
      }
    }
  }
  .tool-user {
    text-align: center;
    font-size: 16px;
    .tool-user-avatar {
      position: relative;
      width: 120px;
      overflow: hidden;
      margin: 0 auto 24px;
      border-radius: 50%;
      cursor: pointer;
      .tool-user-upload {
        .text {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          line-height: 120px;
          font-weight: bold;
        }
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -18px 0 0 -18px;
        font-size: 35px;
        font-weight: bold;
        color: #fff;
      }
      .img {
        transition: 0.2s all linear;
      }
      &.active {
        .img {
          filter: blur(3px);
        }
      }
    }
  }
  .tool-user-info {
    display: flex;
    justify-content: left;
    align-items: center;
    .tool-user-input {
      flex: 1;
      margin-right: 5px;
    }
    .tool-user-title {
      display: flex;
      align-items: center;
      width: 90px;
      text-align: left;
      font-weight: bold;
      word-break: keep-all;
      margin-right: 15px;
    }
    &:nth-child(2) {
      margin-bottom: 15px;
    }
  }
  .tool-recommend {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .recommend {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100px;
      height: 100px;
      margin: 15px 10px 0;
      overflow: hidden;
      cursor: pointer;
      transition: 0.3s all linear;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      span {
        position: absolute;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 600;
        transition: 0.3s all linear;
        opacity: 0;
      }
      &:hover {
        box-shadow: 1px 5px 10px gray;
        span {
          opacity: 1;
        }
      }
    }
  }
  @media screen and (max-width: 788px) {
    .tool-recommend {
      font-size: 12px;
      .recommend {
        width: 80px;
        height: 80px;
      }
    }
  }
</style>
