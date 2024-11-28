"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LayoutList, PencilLine, Search } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import Logout from "./dashboard/Logout";
import { DateContext } from "@/context/DateContext";

export default function Navigation() {
  const { activeIndex, setActiveIndex } = useContext(DateContext);

  const navItems = [
    { href: "/", icon: <LayoutList />, text: "Records" },
    { href: "/add-record", icon: <PencilLine />, text: "Add" },
    { href: "/about", icon: <Search />, text: "About" },
  ];

  return (
    <NavigationMenu className="bg-card border-b sticky top-0 z-50 w-full">
      <div className="mx-auto w-[90%] md:w-[70%] h-full">
        <NavigationMenuList className="flex items-center justify-between h-full">
          <div className="flex gap-4 items-center">
            {navItems?.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2",
                      activeIndex === index && "border-primary border-b-4"
                    )}
                    onClick={() => setActiveIndex(index)}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </div>
          <div className="flex items-center">
            <Logout />
          </div>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
