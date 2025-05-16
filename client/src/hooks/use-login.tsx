import * as t from '@/services/types'
import { useAuthContext } from './use-auth'


export const useLogin = (params: t.TLoginParams) => {
    const {  useLogin: loginHook } = useAuthContext()
    const loginVars = loginHook(params)
    
    return loginVars as undefined as {
        isLoading: boolean
        login: () => void
    }
}
