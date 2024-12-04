"use client";

import useConversation from "@/hooks/useConversation";
import useNavigation from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export default function MobileNav() {
  const { paths } = useNavigation();
  const { isActive } = useConversation();

  if (isActive) {
    return null;
  }
  return (
    <Card className="fixed bottom-4 w-[calc(100%-32px)] flex items-center p-2 h-16 lg:hidden">
      <nav className="w-full">
        <ul className="flex gap-2 items-center">
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
      <div className="flex gap-2 items-center justify-center">
        <ThemeToggle />
        <UserButton />
      </div>
    </Card>
  );
}
