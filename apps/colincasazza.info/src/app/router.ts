import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@app/views/HomeView.vue';
import Projects from '@app/views/ProjectsWrapper.vue';
import BackgroundGUI from '@app/views/background/BackgroundGUI.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve({ el: to.hash });
        }, 500);
      });
    }
    if (savedPosition) {
      return savedPosition;
    }
    if (to.meta.noScroll && from.meta.noScroll) {
      return {};
    }
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { title: 'colincasazza.info' },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      meta: { title: 'colincasazza.info.projects' },
    },
    {
      path: "/projects/three/flock",
      name: "Flock",
      component: BackgroundGUI,
      meta: { title: 'colincasazza.info.flock' },

    },
  ],
});

router.afterEach((to, _from) => {
  const parent = to.matched.find((record) => record.meta.title);
  const parentTitle = parent ? parent.meta.title : null;
  document.title = to.meta.title || parentTitle || 'colincasazza.info';
});

export default router;
