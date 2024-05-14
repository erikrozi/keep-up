import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { supabase } from "../../utils/supabase.ts";

export function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /*
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      navigate("/dashboard/");
    } else if (event === "SIGNED_OUT") {
      navigate("/");
    } else {
      console.log("Unknown event:", event);
    }
  })*/

  const handleEmailLogin = async (e) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      // Display error message
      console.log(error.message);
      // Alert the user
      alert(error.message);
    } else {
      setError(null);
    }
  };

  const getURL = () => {
    return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/dashboard/';
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo:  getURL() } });
    if (error) {
      setError(error.message);
      alert(error.message)
    } else {
      setError(null);
    }
  };

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
            onClick={(e) => handleEmailLogin(e)}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
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
