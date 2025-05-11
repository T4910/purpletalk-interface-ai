import { createRootRoute, createRoute, Router, redirect, Outlet } from '@tanstack/react-router'
import Landing from './pages/Landing'
import NewChat from './pages/NewChat'
import ChatView from './pages/ChatView'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TwoFactorAuth from './pages/TwoFactorAuth'
import RequestPasswordReset from './pages/RequestPasswordReset'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'

const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* This is the root layout. You can add a navigation bar or footer here */}
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  beforeLoad: () => {
    throw redirect({ to: '/c/new' });
  },
})

const newChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/c/new',
  component: NewChat,
})

export const chatViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/c/$id',
  component: ChatView,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
})

const twoFactorAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/2fa',
  component: TwoFactorAuth,
})

const requestPasswordResetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-password-reset',
  component: RequestPasswordReset,
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  validateSearch: (search: Record<string, unknown>) => {
    return { token: search.token }
  },
  beforeLoad: ({ search }) => {
    if(!search.token) throw redirect({ to: '/login' });
  },
  component: ResetPassword,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  appRoute,
  newChatRoute,
  chatViewRoute,
  loginRoute,
  signupRoute,
  twoFactorAuthRoute,
  requestPasswordResetRoute,
  resetPasswordRoute,
  notFoundRoute
])

export const router = new Router({
  routeTree,
  // defaultPreload
  // notFoundRoute: notFoundRoute
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
