import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import {AUTH_RENEW} from '../store/actions'

// Containers
const TheContainer = () => import('../containers/TheContainer');

// Views - Pages
const Page404 = () => import('../views/pages/Page404');
const Page500 = () => import('../views/pages/Page500');
const Login = () => import('../views/pages/Login');

// Configuration
const Users = () => import('../views/configuration/Users');

// Emails
const Inbound = () => import('../views/emails/Inbound');
const MailDetails = () => import('../views/emails/MailDetails');
const NewMail = () => import('../views/emails/NewMail');
const Outbound = () => import('../views/emails/Outbound');

Vue.use(Router);

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    store.dispatch(AUTH_RENEW).then(() => next()).catch(err => console.log(err));
    return;
  }
  next('/login')
};

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior: () => ({y: 0}),
  routes: configRoutes()
})

function configRoutes() {
  return [
    {
      path: '/',
      redirect: '/inbound',
      name: 'Home',
      component: TheContainer,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'inbound',
          meta: {label: 'Inbound'},
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              component: Inbound,
              beforeEnter: ifAuthenticated,
            },
            {
              path: ':id',
              meta: {label: 'Mail Details'},
              name: 'InboundMail',
              component: MailDetails,
              beforeEnter: ifAuthenticated,
            },
          ]
        },
        {
          path: 'outbound',
          meta: {label: 'Outbound'},
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              component: Outbound,
              beforeEnter: ifAuthenticated,
            },
            {
              path: ':id',
              meta: {label: 'Mail Details'},
              name: 'OutboundMail',
              component: MailDetails,
              beforeEnter: ifAuthenticated,
            },
          ]
        },
        {
          path: 'newmail',
          name: 'NewMail',
          component: NewMail,
          beforeEnter: ifAuthenticated,
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
          beforeEnter: ifAuthenticated,
        }
      ]
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    }
  ]
}

