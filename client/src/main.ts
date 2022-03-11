import { createApp } from 'vue';
import App from './App.vue';
import { setupDesign } from './plugins/ant-desigin';
import { setupVueViewer } from './plugins/vue-viewer';
import { setupRouter } from './router';

const bootstrap = () => {
  const app = createApp(App);

  setupDesign(app);

  setupVueViewer(app);

  setupRouter(app);

  app.mount('#app');
};

bootstrap();
