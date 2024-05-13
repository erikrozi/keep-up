import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase.js";

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

export function RegisterForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/personalInfo");
    }
  }, [user, navigate]);

  const register = () => {
    if (!name) {
        alert("Please enter name");
    } else {
        registerWithEmailAndPassword(name, email, password);
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
              {/* <Link href="#" className="ml-auto inline-block text-sm underline"> */}
                {/* Forgot your password? */}
              {/* </Link> */}
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
            onClick={register}
          >
            Register
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
          >
            Register with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          {/* <Link href="#" className="underline">
            Sign up
          </Link> */}
          <Link to="/login" className="underline">Sign in</Link>
        </div>
      </CardContent>
    </Card>
  )
}
