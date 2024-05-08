"use client";

import Header from "@/components/foundation/Header";
import Sidebar from "@/components/foundation/Sidebar";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const { route, setRoute } = useUserProfileContext();
  const [toggleMenu, setToggleMenu] = useState(false);
  const router = useRouter();
  const onClickMenu = (title) => {
    setRoute(title);
    router.push(`/game/${title}`);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <Header title={route} onClickMenu={() => setToggleMenu(!toggleMenu)} />
      <div className="flex w-full h-screen">
        {children}
      </div>
    </div>
  );
}
