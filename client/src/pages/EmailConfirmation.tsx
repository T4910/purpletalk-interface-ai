
import { useState, useEffect } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Loader } from "lucide-react";
import { toast } from "sonner";
import { useUserEmailVerification } from "@/services/provider/auth";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { mutate, reset, isPending: isVerifying, isSuccess: isVerified, isError } = useUserEmailVerification()

  const search = useSearch({ from: '/verify-email' });
  const token = search.token as string;
  const uid = search.uid as string;

  useEffect(() => {
    mutate({
      uidb64: uid,
      token
    }, {
      onSuccess: () => {
        toast.success("Email verified successfully!");
        navigate({ to: "/login" })
      },
      onError: (e) => {
        console.log(e)
      },
    })

  }, [uid, token, mutate, navigate])

  const handleTryAgain = () => {
    reset()
    
    // Simulate retry
    setTimeout(() => {
      toast.success("Email verified successfully!");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary underline">Realyze</Link>
          <p className="text-muted-foreground mt-2">Email Verification</p>
        </div>
        
        <Card className="border-muted glass-morphism bg-secondary/20">
          <CardHeader>
            <div className="flex justify-center mb-2">
              {isVerifying ? (
                <div className="bg-primary/20 p-3 rounded-full">
                  <Loader className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : isVerified ? (
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              ) : (
                <div className="bg-destructive/20 p-3 rounded-full">
                  <X className="h-8 w-8 text-destructive" />
                </div>
              )}
            </div>
            <CardTitle className="text-xl text-center">
              {isVerifying ? "Verifying Your Email" : (isVerified ? "Email Verified" : "Verification Failed")}
            </CardTitle>
            <CardDescription className="text-center">
              {isVerifying ? (
                `Please wait while we verify your identity`
              ) : isVerified ? (
                "Your email has been successfully verified"
              ) : (
                isError || "There was a problem verifying your email"
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            {isVerifying ? (
              <p className="text-sm text-muted-foreground">This should only take a moment...</p>
            ) : isVerified ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Thank you for verifying your email. You can now access all features of your Realyze account.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/login">
                    Sign in to your account
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We couldn't verify your email address. The verification link may be expired or invalid.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <Button onClick={handleTryAgain}>
                    Try Again
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/login">
                      Return to Login
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          {!isVerifying && !isVerified && (
            <CardFooter>
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground">
                  If you're having trouble verifying your email, please contact support.
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;
