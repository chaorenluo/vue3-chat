<template>
  <div class="search">
    <div class="search-select">
      <a-select
        show-search
        placeholder="搜索聊天组"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
        @search="handleSearch"
      >
        <a-select-option v-for="(chat, index) in searchData" :key="index" @click="selectChat(chat)">
          <div v-if="isGroup(chat)">{{ chat.groupName }}</div>
          <div v-else>{{ chat.userName }}</div>
        </a-select-option>
      </a-select>

      <a-dropdown class="search-dropdown">
        <PlusCircleOutlined class="search-dropdown-button" />
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <div @click="() => (visibleCreateGroupRef = !visibleCreateGroupRef)">创建群</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="() => (visibleJoinGroupRef = !visibleJoinGroupRef)">搜索群</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="() => (visibleAddFriendRef = !visibleAddFriendRef)">搜索用户</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <a-modal v-model:visible="visibleCreateGroupRef" :footer="null" title="创建群">
      <div style="display: flex">
        <a-input v-model:value="groupNameRef" placeholder="请输入群名字" />
        <a-button @click="createGroup" type="primary">确定</a-button>
      </div>
    </a-modal>
    <a-modal v-model:visible="visibleJoinGroupRef" :footer="null" title="搜索群">
      <div style="display: flex" v-if="visibleJoinGroupRef">
        <a-select
          show-search
          placeholder="请输入群名字"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleGroupSearch"
          @change="handleGroupChange"
        >
          <a-select-option
            v-for="(group, index) in groupArrRef"
            :key="index"
            @click="handleGroupSelect(group)"
          >
            <div>{{ group.groupName }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="joinGroup" type="primary">加入群</a-button>
      </div>
    </a-modal>
    <a-modal v-model:visible="visibleAddFriendRef" footer="" title="搜索用户">
      <div style="display: flex">
        <a-select
          show-search
          placeholder="请输入用户名"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleUserSearch"
          @change="handleUserChange"
        >
          <a-select-option
            v-for="(user, index) in userArrRef"
            :key="index"
            @click="handleUserSelect(user)"
          >
            <div>{{ user.userName }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="addFriend" type="primary">添加好友</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useChatStore } from '@store/chat';
  import { isContainStr, processReturn, nameVerify } from '@utils/common';
  import apis from '@/api';
  import debounce from 'lodash.debounce';

  type EmitName = 'setActiveRoom' | 'addGroup' | 'joinGroup' | 'addFriend';

  const chatStore = useChatStore();
  const visibleCreateGroupRef = ref(false);
  const visibleJoinGroupRef = ref(false);
  const visibleAddFriendRef = ref(false);
  const groupNameRef = ref('');
  const groupIdRef = ref('');
  const groupArrRef = ref<Array<Group>>([]);
  const friendIdRef = ref('');
  const userArrRef = ref<Array<User>>([]);
  const searchDataRef = ref<Array<Group | Friend>>([]);
  const emit = defineEmits<(eventName: EmitName, data: any) => void>();
  const wait = 800;

  const searchData = computed(() => {
    return [...Object.values(chatStore.groupGather), ...Object.values(chatStore.friendGather)];
  });

  const isGroup = (val: any): val is Group => {
    return val.groupName;
  };

  //收搜已经添加的群或者好友
  const handleSearch = (value: string) => {
    console.log(searchData.value);
    let mySearchData = [];
    for (let chat of searchData.value) {
      if (isGroup(chat)) {
        isContainStr(value, chat.groupName) && mySearchData.push(chat);
      } else {
        isContainStr(value, chat.userName) && mySearchData.push(chat);
      }
    }
    searchDataRef.value = mySearchData;
  };

  const handleGroupSearch = debounce(async (value: string) => {
    if (!value) {
      return;
    }
    const res = await apis.group.getGroupsByName(value);
    let data = processReturn(res);
    groupArrRef.value = data;
  }, wait);

  const handleGroupSelect = (group: Group) => {
    groupIdRef.value = group.groupId;
  };

  const handleGroupChange = () => {
    groupArrRef.value = [];
  };

  const handleUserSearch = debounce(async (value: string) => {
    if (!value) {
      return;
    }
    const res = await apis.user.getUserByName(value);
    let data = processReturn(res);
    userArrRef.value = data;
  }, wait);

  const handleUserSelect = (friend: Friend) => {
    friendIdRef.value = friend.userId;
  };

  const handleUserChange = () => {
    userArrRef.value = [];
  };

  const selectChat = (chat: Friend | Group) => {
    emit('setActiveRoom', chat);
  };

  const createGroup = () => {
    if (!nameVerify(groupNameRef.value)) {
      return;
    }
    visibleCreateGroupRef.value = false;
    emit('addGroup', groupNameRef.value);
  };

  const joinGroup = () => {
    visibleJoinGroupRef.value = false;
    emit('joinGroup', groupIdRef.value);
    groupIdRef.value = '';
  };

  const addFriend = () => {
    visibleAddFriendRef.value = false;
    emit('addFriend', friendIdRef.value);
    friendIdRef.value = '';
  };
</script>
<style lang="scss" scoped>
  .search {
    position: relative;
    height: 60px;
    padding: 10px;
    display: flex;
    align-items: center;
    .search-select {
      width: 100%;
      .ant-select {
        width: 100%;
      }
    }
    .search-dropdown {
      position: absolute;
      right: 10px;
      top: 13px;
      width: 40px;
      height: 34px;
      font-size: 20px;
      cursor: pointer;
      line-height: 40px;
      color: gray;
      transition: 0.2s all linear;
      border-radius: 4px;
      &:hover {
        background-color: skyblue;
      }
    }
  }
</style>
