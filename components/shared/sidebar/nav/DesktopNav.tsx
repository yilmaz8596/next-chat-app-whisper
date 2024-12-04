"use client";
import useNavigation from "@/hooks/useNavigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export default function DesktopNav() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { paths } = useNavigation();
  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.map((path, id) => (
            <li key={id}>
              <Link href={path.href}>
                <div
                  className={`p-2 rounded-md relative ${
                    path.active
                      ? "bg-primary text-white"
                      : "border text-gray-400 hover:text-gray-800"
                  }`}
                >
                  {path.icon}
                  {path.count ? (
                    <Badge className="absolute left-6 bottom-7 px-2">
                      {path.count}
                    </Badge>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-center gap-2">
        <div suppressHydrationWarning>{isMounted && <ThemeToggle />}</div>
        <UserButton />
      </div>
    </Card>
  );
}
