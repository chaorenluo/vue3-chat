<template>
  <div class="login">
    <a-modal header="" footer="" :visible="props.showModal" :closable="false">
      <a-tabs v-model:activeKey="typeRef">
        <a-tab-pane key="login" tab="登录" />
        <a-tab-pane key="register" tab="注册" force-render />
      </a-tabs>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="账号" v-bind="validateInfos.userName">
          <a-input v-model:value="modelRef.userName" />
        </a-form-item>
        <a-form-item label="密码" v-bind="validateInfos.password">
          <a-input v-model:value="modelRef.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button
            :loading="props.loading"
            type="primary"
            block
            class="login-form-button"
            @click="onSubmit"
          >
            {{ buttomRef }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { withDefaults } from '@vue/runtime-core';
  import { Form } from 'ant-design-vue';
  import { nameVerify } from '@utils/common';

  type userState = 'login' | 'register';
  interface Props {
    showModal: boolean;
    loading: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showModal: false,
    loading: false,
  });
  const emit = defineEmits<(key: userState, user: pickUser) => void>();

  const typeRef = ref<userState>('login');
  const buttomRef = ref('登录');
  const useForm = Form.useForm;
  const modelRef = reactive<pickUser>({
    userName: '',
    password: '',
  });
  const rulesRef = reactive({
    userName: [
      {
        required: true,
        message: '请输入用户名!',
      },
      {
        validator: (rule: any, value: string) => {
          if (!nameVerify(value)) {
            return Promise.reject(new Error('账号不符合规则'));
          }
          return Promise.resolve();
        },
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码!',
      },
    ],
  });
  const { validate, validateInfos } = useForm(modelRef, rulesRef);
  const labelCol = { span: 4 };
  const wrapperCol = { span: 14 };

  const onSubmit = () => {
    validate()
      .then(() => {
        emit(typeRef.value, modelRef);
      })
      .catch(() => {});
  };
</script>
<style lang="scss" scoped>
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
