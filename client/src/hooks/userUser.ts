import { ref, onBeforeMount } from 'vue';
import cookie from 'js-cookie';
import { useAppStore } from '@store/app';
import { useChatStore } from '@store/chat';
export const useUser = () => {
  const showModalRef = ref(false);
  const appStore = useAppStore();
  const chatStore = useChatStore();
  const getUser = () => {
    onBeforeMount(() => {
      if (cookie.get('token')) {
        appStore
          .getUser()
          .then(() => {
            chatStore.connectSocket();
          })
          .catch((res) => {
            showModalRef.value = true;
          });
      } else {
        showModalRef.value = true;
      }
    });
  };

  return {
    showModalRef,
    getUser,
  };
};
