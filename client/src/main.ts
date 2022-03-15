import { createApp } from 'vue';
import App from './App.vue';
import { setupDesign } from './plugins/ant-desigin';
import { setupVueViewer } from './plugins/vue-viewer';
import { setupIcon } from './plugins/ant-icon';
import { setupRouter } from './router';
import { setupStore } from './store';

const bootstrap = () => {
  const app = createApp(App);

  setupDesign(app);

  setupVueViewer(app);

  setupRouter(app);

  setupStore(app);

  setupIcon(app);

  app.mount('#app');
};

bootstrap();
