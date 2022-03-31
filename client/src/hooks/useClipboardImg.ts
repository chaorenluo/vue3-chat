import { onMounted, onUnmounted } from 'vue';

type shearData = {
  imageFile: File;
  image: HTMLImageElement;
  width: number;
  height: number;
};
type successCallback = (data: shearData) => void;
type errorCallback = (error: string) => void;

export const useClipboardImg = (shearSuccess: successCallback, shearError: errorCallback) => {
  const getImageSize = (data: ImageSize) => {
    let { width, height } = data;
    if (width > 335 || height > 335) {
      if (width > height) {
        height = 335 * (height / width);
        width = 335;
      } else {
        width = 335 * (width / height);
        height = 335;
      }
    }
    return {
      width,
      height,
    };
  };

  const getClipboardContent = (event: ClipboardEvent) => {
    const items = event.clipboardData && event.clipboardData.items;
    let file = null;
    if (items && items.length) {
      // 检索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (file) {
      handleImgUpload(file);
    }
  };

  const handleImgUpload = (imageFile: File) => {
    const isJpgOrPng =
      imageFile.type === 'image/jpeg' ||
      imageFile.type === 'image/png' ||
      imageFile.type === 'image/jpg' ||
      imageFile.type === 'image/gif';
    if (!isJpgOrPng) {
      shearError('请选择jpeg/jpg/png/gif格式的图片!');
      return;
    }
    const isLt1M = imageFile.size / 1024 / 1024 < 0.5;
    if (!isLt1M) {
      shearError('图片必须小于500K!');
      return;
    }
    const image = new Image();
    const url = window.URL || window.webkitURL;
    image.src = url.createObjectURL(imageFile);
    image.onload = () => {
      const imageSize: ImageSize = getImageSize({ width: image.width, height: image.height });
      shearSuccess({
        ...imageSize,
        imageFile,
        image,
      });
    };
  };

  onMounted(() => {
    document.addEventListener('paste', getClipboardContent);
  });
  onUnmounted(() => {
    document.removeEventListener('paste', getClipboardContent);
  });

  return { handleImgUpload };
};
