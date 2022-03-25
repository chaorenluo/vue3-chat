import {
  BulbOutlined,
  SkinOutlined,
  PoweroffOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SyncOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons-vue';

import { App } from 'vue';

export const setupIcon = (app: App<Element>) => {
  const component = {
    BulbOutlined,
    SkinOutlined,
    PoweroffOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined,
    UploadOutlined,
    PlusCircleOutlined,
    TeamOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SyncOutlined,
    UserDeleteOutlined,
  };

  for (const componentKey in component) {
    // @ts-ignore
    app.component(componentKey, component[componentKey]);
  }
};
