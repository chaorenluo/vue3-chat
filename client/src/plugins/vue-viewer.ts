import type { App } from 'vue';
import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

export const setupVueViewer = (app: App<Element>) => {
  app.use(VueViewer, {
    defaultOptions: {
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 4,
        reset: 4,
        prev: 0,
        next: 0,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
      },
    },
  });
};
