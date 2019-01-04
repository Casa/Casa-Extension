import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../../store';

Vue.use(VueRouter);

let router = new VueRouter({ routes });

// Check secured routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth === true) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
