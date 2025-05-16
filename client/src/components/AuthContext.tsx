import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as t from '@/services/types'
import { useGetUserQuery, useUserLoginMutation } from '@/services/provider/auth';
import { toast } from 'sonner';
import { router } from '@/routes'
import { AuthContext } from '@/hooks/use-auth';


const AuthContextProvider = ({ children }) => {
  // const [isAuthenticated, setisAuthenticated] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);

  const { data: loggedInUser, isSuccess: isAuthenticated } = useGetUserQuery()

  // const setAuthContext = useCallback((userContext: t.TUserContext) => {
  //   console.log(userContext)
  //   setisAuthenticated(userContext.isAuthenticated);
  //   setRedirect(userContext.redirect);
  // }, [])

  const { mutate, ...options } = useUserLoginMutation({
      onSuccess: (e) => {
        toast.success("Login successful! Redirecting...")
        // router.navigate({ to: '/c/new' })
        console.log(e)
      },
      onError: (e) => {
        toast.error("Login failed! Please try again later")
      }
  })

//  Logout
//  get user
const useLogin = useCallback((params: t.TLoginParams) => { 
  return {
    isLoading: options.isPending,
    login: () => mutate(params),
    ...options
  }
}, [mutate, options])

// const useLogout = () => {
//   return logout
// }

  const memoedValue = useMemo(() => ({
      user: loggedInUser,
      useLogin,
      // logout,
      redirect,
      isAuthenticated,
    }),
    [loggedInUser, useLogin, isAuthenticated, redirect]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
