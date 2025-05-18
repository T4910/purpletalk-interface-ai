import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useUserResetPassword } from "@/services/provider/auth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { mutate: resetPassword, isPending: isLoading, isSuccess: completed } = useUserResetPassword()
  
  // Get the token from search parameters using Tanstack Router's useSearch
  const search = useSearch({
    from: '/reset-password' // Specify the route ID if needed, though often not strictly necessary for search params
  });
  const token = search.token || "demo-token";
  const uid = search.uid || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !passwordConfirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    resetPassword({ password, token, uidb64: uid, password2: passwordConfirm }, {
      onSuccess: () => {
        toast.success("Password has been reset successfully!");
      },
      onError: (e) => {
        toast.error("Something went wrong");
        // console.log(e.response.data, 93872)
      }
    })
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
            <p className="text-muted-foreground mt-2">Find your dream property with AI</p>
          </div>
          
          <Card className="border-muted glass-morphism bg-secondary/20">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <KeyRound className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Password Reset Complete</CardTitle>
              <CardDescription className="text-center">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="mt-4">
                <Link to="/login">
                  Sign in with new password
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
          <p className="text-muted-foreground mt-2">Create a new password</p>
        </div>
        
        <Card className="border-muted glass-morphism bg-secondary/20">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm New Password</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full">
              <Link to="/login" className="text-primary underline hover:underline text-sm">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
