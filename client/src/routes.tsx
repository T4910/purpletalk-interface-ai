
import { createRoute, redirect, Outlet, createRootRouteWithContext, createRouter } from '@tanstack/react-router'
import Landing from './pages/Landing'
import NewChat from './pages/NewChat'
import ChatView from './pages/ChatView'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TwoFactorAuth from './pages/TwoFactorAuth'
import RequestPasswordReset from './pages/RequestPasswordReset'
import ResetPassword from './pages/ResetPassword'
import EmailConfirmation from './pages/EmailConfirmation'
import NotFound from './pages/NotFound'
import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { useAuthContext } from './hooks/use-auth' 
import { toast } from 'sonner'
import { useGetUserQueryOptions } from './services/provider/auth'
import { QueryKeys } from './services/keys'
import { resendConfirmEmail } from './services'

interface MyRouterContext {
  authContext: ReturnType<typeof useAuthContext>,
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* This is the root layout. You can add a navigation bar or footer here */}
      <Outlet />
    </>
  ),
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      const user = await queryClient.fetchQuery(useGetUserQueryOptions);
      return { isAuthenticated: !!user.id, isActive: user.is_active, user };
    } catch {
      return { isAuthenticated: null, isActive: null, user: null };
    }
  }
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/c',
  component: () => <Outlet />,
  beforeLoad: async ({ context: { isAuthenticated, isActive, user, queryClient }, location, ...a }) => {
    console.log("before load fired approute", isAuthenticated)

    if(!isAuthenticated) {
      toast.error("Please sign in to continue");
      throw redirect({ 
        to: '/login', 
        search: {
          redirect: location.href
        } 
      })
    }

    // Email confirmed
    if(!isActive){
      // resendEmailVerification
      await resendConfirmEmail({ email: user.email })
      toast.error("Looks like you haven't verified your email. We've sent a new link to your email");
      throw redirect({ 
        to: '/login', 
        search: {
          redirect: location.href
        } 
      })
    }
  }
})

const chatIndex = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => redirect({ to: "/c/new" })
})

const newChatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: 'new',
  component: NewChat,
})

const chatViewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '$id',
  component: ChatView,
})


// Non protected app route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const preventAuthUser = {
  beforeLoad: async ({ context: { isAuthenticated } }) => {
    console.log("before load preventroute", isAuthenticated)

    if(isAuthenticated) throw redirect({ to: '/' });
  }
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
  ...preventAuthUser
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
  ...preventAuthUser
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
  ...preventAuthUser
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  validateSearch: (search: Record<string, unknown>) => {
    return { token: search.token, uid: search.uid }
  },
  beforeLoad: ({ search }) => {
    if(!search.token || !search.uid) throw redirect({ to: '/login' });
  },
  component: ResetPassword,
})

const emailConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-email',
  validateSearch: (search: Record<string, unknown>) => {          
    return { token: search.token || '', uid: search.uid || '', email: search.email || '' }
  },
  beforeLoad: ({ search }) => {
    if(!search.token || !search.uid || !search.email) throw redirect({ to: '/login' })
  },
  component: EmailConfirmation,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  // appRoute,
  // newChatRoute,
  // chatViewRoute,
  appRoute.addChildren([chatIndex, newChatRoute, chatViewRoute]),
  loginRoute,
  signupRoute,
  twoFactorAuthRoute,
  requestPasswordResetRoute,
  resetPasswordRoute,
  emailConfirmationRoute,
  notFoundRoute
])

export const router = createRouter({
  routeTree,
  context: {
    authContext: undefined!,
    queryClient: QueryClient
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
