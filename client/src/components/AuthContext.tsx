import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as t from '@/services/types'
import { useGetUserQuery, useUserLoginMutation } from '@/services/provider/auth';
import { toast } from 'sonner';
import { router } from '@/routes'
import { AuthContext } from '@/hooks/use-auth';
import { useSearch } from '@tanstack/react-router';
import { getRouteApi } from '@tanstack/react-router';


const AuthContextProvider = ({ children }) => {
  const { data: loggedInUser, isSuccess: isAuthenticated, refetch } = useGetUserQuery({
    enabled: false
  })
  console.log('AuthContextProvider rendereed', isAuthenticated)
  // const redirect = useSearch({ from: '/login' })
  // const redirect = getRouteApi('/login').useSearch()
  // console.log(redirect)


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
