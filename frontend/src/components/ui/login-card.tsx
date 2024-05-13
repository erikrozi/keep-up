import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle
} from "../../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "./button.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card.tsx"
import { Input } from "./input.tsx"
import { Label } from "./label.tsx"

export function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              onChange={(e) => {setPassword(e.target.value)}}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
          >
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">Sign up</Link>
        </div>
      </CardContent>
    </Card>
  )
}
