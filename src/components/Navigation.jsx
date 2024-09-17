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

  return (
    <NavigationMenu className="bg-card border-b md:border-r pt-4 relative">
      <Logout />
      <NavigationMenuList className="flex-row md:flex-col">
        {navItems?.map((item, index) => (
          <NavigationMenuItem key={index}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  activeIndex === index &&
                    "border-primary border-b-4 md:border-b-0 md:border-l-4"
                )}
                onClick={() => setActiveIndex(index)}
              >
                {item.icon}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const navItems = [
  { href: "/", icon: <LayoutList /> },
  { href: "/add-record", icon: <PencilLine /> },
  { href: "/about", icon: <Search /> },
];
