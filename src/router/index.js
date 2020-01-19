import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import {AUTH_LOGOUT} from '../store/actions/auth'

// Containers
const TheContainer = () => import('@/containers/TheContainer');

// Views
const Dashboard = () => import('@/views/Dashboard');

// Views - Pages
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');
const Login = () => import('@/views/pages/Login');

// Configuration
const Users = () => import('@/views/configuration/Users');

// Emails
const Inbound = () => import('@/views/emails/Inbound');
const MailDetails = () => import('@/views/emails/MailDetails');
const NewMail = () => import('@/views/emails/NewMail');
const Outbound = () => import('@/views/emails/Outbound');


Vue.use(Router);

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return
  }
  next('/login')
};

const logout = (to, from, next) => {
  store.dispatch(AUTH_LOGOUT, 'logout').then(() => next('/login'))
};

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path:        '/',
      redirect:    '/dashboard',
      name:        'Home',
      component:   TheContainer,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path:      'dashboard',
          name:      'Dashboard',
          component: Dashboard
        },
        {
          path: 'inbound',
          meta: { label: 'Inbound'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Inbound,
            },
            {
              path: ':id',
              meta: { label: 'Mail Details'},
              name: 'InboundMail',
              component: MailDetails,
            },
          ]
        },
        {
          path: 'outbound',
          meta: { label: 'Outbound'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Outbound,
            },
            {
              path: ':id',
              meta: { label: 'Mail Details'},
              name: 'OutboundMail',
              component: MailDetails,
            },
          ]
        },
        {
          path:      'newmail',
          name:      'NewMail',
          component: NewMail
        },
        {
          path:      'users',
          name:      'Users',
          component: Users
        }
      ]
    },
    {
      path:      '/500',
      name:      'Page500',
      component: Page500
    },
    {
      path:      '/login',
      name:      'Login',
      component: Login
    },
    {
      path:      '/logout',
      name:      'Logout',
      beforeEnter: logout,
    },
    {
      path:      '*',
      name:      'Page404',
      component: Page404
    }
  ]
}

