import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as t from '@/services/types'
import { useGetUserQuery, useUserLoginMutation } from '@/services/provider/auth';
import { toast } from 'sonner';
import { router } from '@/routes'
import { AuthContext } from '@/hooks/use-auth';


const AuthContextProvider = ({ children }) => {
  // const [isAuthenticated, setisAuthenticated] = useState(false);
  // const [redirect, setRedirect] = useState<string | null>(null);
  
  const { data: loggedInUser, isSuccess: isAuthenticated, refetch } = useGetUserQuery()
  console.log('AuthContextProvider rendereed', isAuthenticated)

  // const setAuthContext = useCallback((userContext: t.TUserContext) => {
  //   console.log(userContext)
  //   setisAuthenticated(userContext.isAuthenticated);
  //   setRedirect(userContext.redirect);
  // }, [])

  const { mutate, ...options } = useUserLoginMutation({
      onSuccess: (e) => {
        toast.success("Login successful! Redirecting...")
        // queryClien
        console.log(e)
        refetch()
        router.navigate({ to: '/c/new' })
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

  // const memoedValue = useMemo(() => ({
  //     user: loggedInUser,
  //     useLogin,
  //     // logout,
  //     // redirect,
  //     isAuthenticated,
  //   }),
  //   [loggedInUser, useLogin, isAuthenticated]
  // )

  return (
    <AuthContext.Provider value={{
      user: loggedInUser,
      useLogin,
      // logout,
      // redirect,
      isAuthenticated: !!loggedInUser?.id,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
