import { useContext, createContext } from "react";
import * as t from '@/services/types'
import { MutationFunction, MutationOptions, UseMutationResult } from "@tanstack/react-query";

type TMemoedValue = {
    user: t.TUser,
    useLogin: (params: t.TLoginParams) => Omit<UseMutationResult<t.TLoginResponse, t.TLoginResponse, t.TLoginParams, unknown>, 'mutate'>,
    redirect: string,
    isAuthenticated: boolean
    // a: string
}



export const AuthContext = createContext<{
    memoedValue: TMemoedValue,
    setAuthContext: (userContext: t.TUserContext) => void
}>(undefined);


export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext should be used inside AuthProvider');
    }

    return context;
};
