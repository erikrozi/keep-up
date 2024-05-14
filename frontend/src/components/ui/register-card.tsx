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


export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      navigate("/personalInfo");
    } else if (event === "SIGNED_OUT") {
      navigate("/");
    } else {
      console.log("Unknown event:", event);
    }
  })

  async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      alert(error.message);
    } else {
      setError(null);
    }
  }

  const getURL = () => {
    return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/personalInfo';
  }

  const handleGoogleLogin = async () => {
    const url = getURL();
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
        <CardTitle className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900">Register</CardTitle>
        <CardDescription className="mb-4 text-2xl font-normal text-gray-500">
          Enter your information below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            onClick={signUpNewUser}
          >
            Register
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Register with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">Sign in</Link>
        </div>
      </CardContent>
    </Card>
  )
}
