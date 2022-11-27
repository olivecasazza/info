/* eslint-disable import/extensions */

import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import VueMobileDetection from "vue-mobile-detection";
import router from './router';

import '../../../../libs/theme/src/css/tailwind.scss';
import '../../../../libs/theme/src/css/globals.scss';

createApp(App).use(router).use(i18n).use(VueMobileDetection).mount('#app');
