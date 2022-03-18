import { ref, onBeforeMount } from 'vue';
import cookie from 'js-cookie';
import { useAppStore } from '@store/app';
export const useUser = () => {
  const showModalRef = ref(false);
  const appStore = useAppStore();
  const getUser = () => {
    onBeforeMount(() => {
      if (cookie.get('token')) {
        appStore.getUser().catch((res) => {
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
