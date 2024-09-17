"use client";

import { redirect } from "next/navigation";
import Auth from "@/components/Auth";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function LogIn() {
  const { user } = useContext(UserContext);

  if (user?.user) {
    redirect("/");
  }

  return <Auth />;
}
