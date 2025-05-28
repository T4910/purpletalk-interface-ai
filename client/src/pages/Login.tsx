import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router"; // Changed import and added useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { useGetUserQuery, useUserLoginMutation, useUserResendConfirmEmail } from "@/services/provider/auth";

const Login = () => {
  const [username, setusername] = useState('') //("AnotherAccountbyT");
  const [password, setPassword] = useState('') //("abcde1,,ddfgh1");
  const search = useSearch({ from: '/login' })
  const { refetch } = useGetUserQuery()
  const navigate = useNavigate()
  const { mutate: login, isPending: isLoading } = useUserLoginMutation()
  const { mutateAsync: resendEmail } = useUserResendConfirmEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    login({ username, password }, {
      onSuccess: (e) => {
        toast.success("Login successful! Redirecting...")
        console.log(e)
        refetch()
        console.log(search.redirect)
        
        navigate({ to: search.redirect || '/c/new', replace: true })
      },
      onError: (e) => {
        const notActiveError = e?.response.data.detail.non_field_errors[0] as string;
        toast.error(notActiveError)
        if(notActiveError.includes('Looks like you have not confirmed your emai')) {
          toast.error(notActiveError)
          const [_, email] = notActiveError.match(/\[(.*?)\]/);
          console.log('resending....', email)
          setTimeout(() => toast.promise(resendEmail({ email: email }), {
            loading: 'Resending email...',
            success: () => {
              return `Confirm email has been resent (check spam just in case)`;
            },
            error: 'Error occured while resending email',
          }), 2000)
        }
      }
    })
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
          <p className="text-muted-foreground mt-2">Find your dream property with AI</p>
        </div>
        
        <Card className="border-muted glass-morphism bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Enter your username and password to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="yourusername"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/request-password-reset" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary underline hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
