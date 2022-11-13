/* eslint-disable import/extensions */

import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';

import '../../../../libs/theme/src/css/tailwind.scss';
import '../../../../libs/theme/src/css/globals.scss';
import flockInit from '../../../../libs/flock/pkg';

import rendererInit from '../../../../libs/renderer/pkg/renderer';

Promise.all([flockInit(), rendererInit()]).then(() =>
  createApp(App).use(router).use(i18n).mount('#app')
);
