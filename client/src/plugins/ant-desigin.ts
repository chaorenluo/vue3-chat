import type { App } from 'vue';
import 'ant-design-vue/dist/antd.css';
import {
  Button,
  Input,
  Modal,
  Form,
  Checkbox,
  Tabs,
  Popover,
  Dropdown,
  Menu,
  Avatar,
  Card,
  Select,
  Upload,
  Tooltip,
  Drawer,
  Popconfirm,
  Badge,
  MenuItem,
} from 'ant-design-vue';
export const setupDesign = (app: App<Element>) => {
  const component = [
    Button,
    Input,
    Modal,
    Form,
    Checkbox,
    Tabs,
    Popover,
    Dropdown,
    Menu,
    Avatar,
    Card,
    Select,
    Upload,
    Tooltip,
    Drawer,
    Popconfirm,
    Badge,
    Menu,
    MenuItem,
  ];
  component.forEach((item) => {
    app.use(item);
  });
};
