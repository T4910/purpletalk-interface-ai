import { useState } from "react";
import { Link } from "@tanstack/react-router"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useUserRequestPasswordReset, useUserResetPassword } from "@/services/provider/auth";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [submitted, setSubmitted] = useState(false);

  const { mutate: resetPassword, isPending: isLoading, isSuccess: submitted, reset } = useUserRequestPasswordReset()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // setIsLoading(true);
    
    resetPassword({ email }, {
      onSuccess: () => {
        toast.success("Password reset link sent to your email!");
      },
      onError: () => {
        toast.error("Something went wrong");
      }
    })
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* Changed Link component and props */}
            <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
            <p className="text-muted-foreground mt-2">Find your dream property with AI</p>
          </div>
          
          <Card className="border-muted glass-morphism bg-secondary/20">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">Check your inbox</CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                If you don't see the email, please check your spam folder.
              </p>
              <Button variant="outline" className="mt-2" onClick={reset}>
                Try with a different email
              </Button>
            </CardContent>
            <CardFooter>
              <div className="text-center w-full">
                {/* Changed Link component and props */}
                <Link to="/login" className="text-primary hover:underline text-sm">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Changed Link component and props */}
          <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        
        <Card className="border-muted glass-morphism bg-secondary/20">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl text-center">Forgot your password?</CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full">
              {/* Changed Link component and props */}
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

export default RequestPasswordReset;
