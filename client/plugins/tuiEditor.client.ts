import { Editor } from '@toast-ui/editor';

import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      editor: Editor,
    },
  };
});
