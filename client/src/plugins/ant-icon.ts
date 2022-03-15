import {
  BulbOutlined,
  SkinOutlined,
  PoweroffOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { App } from 'vue';

export const setupIcon = (app: App<Element>) => {
  const component = {
    BulbOutlined,
    SkinOutlined,
    PoweroffOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined,
  };

  for (const componentKey in component) {
    // @ts-ignore
    app.component(componentKey, component[componentKey]);
  }
};
