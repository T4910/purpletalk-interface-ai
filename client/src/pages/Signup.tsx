import { useState } from "react";
import { Link } from "@tanstack/react-router"; // Changed import and added useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Mail, User, Key } from "lucide-react";
import { toast } from "sonner";
import { useUserRegisterMutation } from "@/services/provider/auth";
import { useNavigate } from "@tanstack/react-router";

const Signup = () => {
  const [name, setName] = useState('')//("AnotherAccountbyT");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')//("abcde1,,ddfgh1");
  const [passwordConfirm, setPasswordConfirm] = useState('')//("abcde1,,ddfgh1");
  const navigate = useNavigate();

  const { mutate: register, isPending: isLoading } = useUserRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
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

    register(
      {
        username: name,
        password2: passwordConfirm,
        password,
        email,
      },
      {
        onSuccess: (res) => {
          toast.success(
            `Account created! We've sent a confirmation link to your email: ${res.email}`
          );
          navigate({ to: "/login", from: "/signup" });
          console.log(res);
        },
        onError: (e) => {
          toast.error(`Registration failesd! Error: ${Object.values(e.response.data)[0]}`);
          console.log(e.response.data, 23982)
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-chat-bg to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Changed Link component and props */}
          <Link to="/" className="text-3xl font-bold text-primary underline">
            Realyze
          </Link>
          <p className="text-muted-foreground mt-2">
            Find your dream property with AI
          </p>
        </div>

        <Card className="border-muted glass-morphism bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account. Register with a Landmark or Brightdata emails get more credits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                {/* Changed Link component and props */}
                <Link
                  to="/login"
                  className="text-primary underline hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
