"use client";

import { auth } from "@/config/firebase";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useContext } from "react";
import { signOut } from "firebase/auth";
import { UserContext } from "@/context/UserContext";

export default function Logout() {
  const user = useContext(UserContext).user;

  const handleLogout = async () => {
    console.log("logout");
    signOut(auth);
  };

  return (
    user && (
      <Button
        size="icon"
        variant="outline"
        className="absolute right-2 top-2"
        onClick={handleLogout}
      >
        <LogOut />
      </Button>
    )
  );
}
