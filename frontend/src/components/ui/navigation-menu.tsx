import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "../../utils";
import logo from "../../assets/LogoAndNameBig.png"; // Import your logo image here
import profileImage from "../../assets/UserProfile.png"; // Your profile image here

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    user: { name: string; email: string };
    logout: () => void;
  }
>(({ className, children, user, logout, ...props }, ref) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", height: "70px" }} // Black with 80% opacity
      className={cn(
        "relative z-10 w-full flex items-center justify-center",
        className
      )}
      {...props}
    >
      {/* Logo image */}
      <Link to="/dashboard" style={{ height: "100%", marginLeft: "20px", marginRight: "auto", display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "100%" }}
        />
      </Link>

      {/* Search bar with button */}
      <form onSubmit={handleSearchSubmit} className="flex-1 px-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/5 px-3 py-2 rounded-l-md text-sm bg-gray-100 text-black placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded-r-md text-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600">
          Search
        </button>
      </form>

      {/* Dashboard link */}
      <NavigationMenuPrimitive.Item className="list-none">
        <NavigationMenuPrimitive.Trigger asChild>
          <Link
            to="/dashboard"
            className="text-white group flex items-center justify-start rounded-md bg-transparent p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
          >
            Dashboard
          </Link>
        </NavigationMenuPrimitive.Trigger>
      </NavigationMenuPrimitive.Item>

      {children}
      {/* Profile Section */}
      <NavigationMenuPrimitive.Item className="ml-auto list-none">
        <NavigationMenuPrimitive.Trigger
          className={cn("flex flex-col items-center", navigationMenuTriggerStyle, "px-4")}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
          <ChevronDown
            className="h-3 w-3 transition duration-200"
            aria-hidden="true"
            style={{ color: "white" }}
          />
        </NavigationMenuPrimitive.Trigger>

        <NavigationMenuPrimitive.Content
          className={cn(
            "origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white"
          )}
        >
          <div className="block px-4 py-2 text-sm text-gray-700">
            Logged in as {user.name} ({user.email})
          </div>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>
      {/* Additional viewport or other elements here if necessary */}
    </NavigationMenuPrimitive.Root>
  );
});
export default NavigationMenu;

NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group flex items-center justify-start rounded-md bg-transparent p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
      color="white"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "absolute left-0 right-auto top-full mt-2 w-auto rounded-md shadow-lg bg-white",
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute right-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
