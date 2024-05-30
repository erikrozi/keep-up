import React from "react";
import Link from "next/link";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { CardContent, Card } from "./ui/card";
import { Button } from "./ui/button";

export const Vercel: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-20 flex items-center px-6">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      {/* Remaining part of your component */}
    </div>
  );
};

interface IconProps {
  className?: string;
}

const MountainIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
};

const RocketIcon: React.FC<IconProps> = (props) => {
  // SVG content remains the same, insert here
};

const SettingsIcon: React.FC<IconProps> = (props) => {
  // SVG content remains the same, insert here
};

const ShieldIcon: React.FC<IconProps> = (props) => {
  // SVG content remains the same, insert here
};
